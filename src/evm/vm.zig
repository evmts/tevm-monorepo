const std = @import("std");
const Contract = @import("contract.zig");
const Stack = @import("stack.zig");
const JumpTable = @import("jump_table.zig");
const Frame = @import("frame.zig");
const Operation = @import("operation.zig");
const Address = @import("Address");
const StoragePool = @import("storage_pool.zig");
const AccessList = @import("access_list.zig");
const ExecutionError = @import("execution_error.zig");
const rlp = @import("Rlp");
const Keccak256 = std.crypto.hash.sha3.Keccak256;
const ChainRules = @import("chain_rules.zig");
const gas_constants = @import("gas_constants.zig");
const constants = @import("constants.zig");
const Log = @import("log.zig");
const EvmLog = @import("evm_log.zig");
const Context = @import("context.zig");
const EvmState = @import("evm_state.zig");
const StorageKey = @import("storage_key.zig");
const CreateResult = @import("create_result.zig");
const CallResult = @import("call_result.zig");
const RunResult = @import("run_result.zig");
const Hardfork = @import("hardfork.zig").Hardfork;

/// Virtual Machine for executing Ethereum bytecode.
///
/// Manages contract execution, gas accounting, state access, and protocol enforcement
/// according to the configured hardfork rules. Supports the full EVM instruction set
/// including contract creation, calls, and state modifications.
const Self = @This();

/// Memory allocator for VM operations
allocator: std.mem.Allocator,
/// Return data from the most recent operation
return_data: []u8 = &[_]u8{},
/// Legacy stack field (unused in current implementation)
stack: Stack = .{},
/// Opcode dispatch table for the configured hardfork
table: JumpTable,
/// Protocol rules for the current hardfork
chain_rules: ChainRules,
// TODO should be injected
/// World state including accounts, storage, and code
state: EvmState,
/// Transaction and block context
context: Context,
/// Warm/cold access tracking for EIP-2929 gas costs
access_list: AccessList,
/// Current call depth for overflow protection
depth: u16 = 0,
/// Whether the current context is read-only (STATICCALL)
read_only: bool = false,

/// Initialize VM with a jump table and corresponding chain rules.
///
/// @param allocator Memory allocator for VM operations
/// @param jump_table Optional jump table. If null, uses JumpTable.DEFAULT (latest hardfork)
/// @param chain_rules Optional chain rules. If null, uses ChainRules.DEFAULT (latest hardfork)
/// @return Initialized VM instance
///
/// Example with custom jump table and rules:
/// ```zig
/// const my_table = comptime JumpTable.init_from_hardfork(.BERLIN);
/// const my_rules = ChainRules.for_hardfork(.BERLIN);
/// var vm = try VM.init(allocator, &my_table, &my_rules);
/// ```
///
/// Example with default (latest):
/// ```zig
/// var vm = try VM.init(allocator, null, null);
/// ```
pub fn init(allocator: std.mem.Allocator, jump_table: ?*const JumpTable, chain_rules: ?*const ChainRules) std.mem.Allocator.Error!Self {
    var state = try EvmState.init(allocator);
    errdefer state.deinit();

    var access_list = AccessList.init(allocator);
    errdefer access_list.deinit();

    return Self{
        .allocator = allocator,
        .table = (jump_table orelse &JumpTable.DEFAULT).*,
        .chain_rules = (chain_rules orelse &ChainRules.DEFAULT).*,
        .state = state,
        .context = Context.init(),
        .access_list = access_list,
    };
}

/// Initialize VM with a specific hardfork.
/// Convenience function that creates the jump table at runtime.
/// For production use, consider pre-generating the jump table at compile time.
pub fn init_with_hardfork(allocator: std.mem.Allocator, hardfork: Hardfork) std.mem.Allocator.Error!Self {
    const table = JumpTable.init_from_hardfork(hardfork);
    const rules = ChainRules.for_hardfork(hardfork);
    return init(allocator, &table, &rules);
}

/// Free all VM resources.
/// Must be called when finished with the VM to prevent memory leaks.
pub fn deinit(self: *Self) void {
    self.state.deinit();
    self.access_list.deinit();
    Contract.clear_analysis_cache(self.allocator);
}

/// Execute contract bytecode and return the result.
///
/// This is the main execution entry point. The contract must be properly initialized
/// with bytecode, gas limit, and input data. The VM executes opcodes sequentially
/// until completion, error, or gas exhaustion.
///
/// Time complexity: O(n) where n is the number of opcodes executed.
/// Memory: May allocate for return data if contract returns output.
///
/// Example:
/// ```zig
/// var contract = Contract.init_at_address(caller, addr, 0, 100000, code, input, false);
/// defer contract.deinit(vm.allocator, null);
/// try vm.state.set_code(addr, code);
/// const result = try vm.interpret(&contract, input);
/// defer if (result.output) |output| vm.allocator.free(output);
/// ```
///
/// See also: interpret_static() for read-only execution
pub fn interpret(self: *Self, contract: *Contract, input: []const u8) ExecutionError.Error!RunResult {
    return try self.interpret_with_context(contract, input, false);
}

/// Execute contract bytecode in read-only mode.
/// Identical to interpret() but prevents any state modifications.
/// Used for view functions and static analysis.
pub fn interpret_static(self: *Self, contract: *Contract, input: []const u8) ExecutionError.Error!RunResult {
    return try self.interpret_with_context(contract, input, true);
}

/// Core bytecode execution with configurable static context.
/// Runs the main VM loop, executing opcodes sequentially while tracking
/// gas consumption and handling control flow changes.
pub fn interpret_with_context(self: *Self, contract: *Contract, input: []const u8, is_static: bool) ExecutionError.Error!RunResult {
    self.depth += 1;
    defer self.depth -= 1;

    const prev_read_only = self.read_only;
    defer self.read_only = prev_read_only;

    self.read_only = self.read_only or is_static;

    const initial_gas = contract.gas;
    var pc: usize = 0;
    var frame = try Frame.init(self.allocator, contract);
    defer frame.deinit();
    frame.memory.finalize_root();
    frame.is_static = self.read_only;
    frame.depth = @as(u32, @intCast(self.depth));
    frame.input = input;
    frame.gas_remaining = contract.gas;

    const interpreter_ptr: *Operation.Interpreter = @ptrCast(self);
    const state_ptr: *Operation.State = @ptrCast(&frame);

    while (pc < contract.code_size) {
        const opcode = contract.get_op(pc);
        frame.pc = pc;

        const result = self.table.execute(pc, interpreter_ptr, state_ptr, opcode) catch |err| {
            contract.gas = frame.gas_remaining;
            self.return_data = @constCast(frame.return_data_buffer);

            var output: ?[]const u8 = null;
            if (frame.return_data_buffer.len > 0) {
                output = try self.allocator.dupe(u8, frame.return_data_buffer);
            }

            return switch (err) {
                ExecutionError.Error.InvalidOpcode => {
                    // INVALID opcode consumes all remaining gas
                    frame.gas_remaining = 0;
                    contract.gas = 0;
                    return RunResult{
                        .err = err,
                        .status = .Invalid,
                        .gas_left = 0,
                        .gas_used = initial_gas,
                        .output = output,
                    };
                },
                ExecutionError.Error.STOP => {
                    // Normal stop
                    return RunResult{
                        .err = null,
                        .status = .Success,
                        .gas_left = frame.gas_remaining,
                        .gas_used = initial_gas - frame.gas_remaining,
                        .output = output,
                    };
                },
                ExecutionError.Error.REVERT => {
                    return RunResult{
                        .err = err,
                        .status = .Revert,
                        .gas_left = frame.gas_remaining,
                        .gas_used = initial_gas - frame.gas_remaining,
                        .output = output,
                    };
                },
                ExecutionError.Error.OutOfGas => {
                    return RunResult{
                        .err = err,
                        .status = .OutOfGas,
                        .gas_left = frame.gas_remaining,
                        .gas_used = initial_gas - frame.gas_remaining,
                        .output = output,
                    };
                },
                ExecutionError.Error.InvalidJump, ExecutionError.Error.StackUnderflow, ExecutionError.Error.StackOverflow, ExecutionError.Error.StaticStateChange, ExecutionError.Error.WriteProtection, ExecutionError.Error.DepthLimit, ExecutionError.Error.MaxCodeSizeExceeded => {
                    return RunResult{
                        .err = err,
                        .status = .Invalid,
                        .gas_left = frame.gas_remaining,
                        .gas_used = initial_gas - frame.gas_remaining,
                        .output = output,
                    };
                },
                else => return err, // Unexpected error
            };
        };

        if (frame.pc != pc) {
            pc = frame.pc;
        } else {
            pc += result.bytes_consumed;
        }
    }

    contract.gas = frame.gas_remaining;
    self.return_data = @constCast(frame.return_data_buffer);

    const output: ?[]const u8 = if (frame.return_data_buffer.len > 0) try self.allocator.dupe(u8, frame.return_data_buffer) else null;

    return RunResult{
        .err = null,
        .status = .Success,
        .gas_left = frame.gas_remaining,
        .gas_used = initial_gas - frame.gas_remaining,
        .output = output,
    };
}

// Contract creation with CREATE opcode
pub const CreateContractError = std.mem.Allocator.Error || Address.CalculateAddressError;

/// Create a new contract using CREATE opcode semantics.
///
/// Increments creator's nonce, calculates address via keccak256(rlp([sender, nonce])),
/// transfers value if specified, executes init code, and deploys resulting bytecode.
///
/// Parameters:
/// - creator: Account initiating contract creation
/// - value: Wei to transfer to new contract (0 for no transfer)
/// - init_code: Bytecode executed to generate contract code
/// - gas: Maximum gas for entire creation process
///
/// Returns CreateResult with success=false if:
/// - Creator balance < value (insufficient funds)
/// - Contract exists at calculated address (collision)
/// - Init code reverts or runs out of gas
/// - Deployed bytecode > 24,576 bytes (EIP-170)
/// - Insufficient gas for deployment (200 gas/byte)
///
/// Time complexity: O(init_code_length + deployed_code_length)
/// Memory: Allocates space for deployed bytecode
///
/// See also: create2_contract() for deterministic addresses
pub fn create_contract(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) CreateContractError!CreateResult {
    _ = init_code.len;

    const nonce = try self.state.increment_nonce(creator);
    const new_address = try Address.calculate_create_address(self.allocator, creator, nonce);

    if (self.state.get_code(new_address).len > 0) {
        // Contract already exists at this address
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = gas,
            .output = null,
        };
    }

    const creator_balance = self.state.get_balance(creator);
    if (creator_balance < value) {
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = gas,
            .output = null,
        };
    }

    if (value > 0) {
        try self.state.set_balance(creator, creator_balance - value);
        try self.state.set_balance(new_address, value);
    }

    if (init_code.len == 0) {
        // No init code means empty contract
        return CreateResult{
            .success = true,
            .address = new_address,
            .gas_left = gas,
            .output = null,
        };
    }

    var hasher = Keccak256.init(.{});
    hasher.update(init_code);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    var init_contract = Contract.init(
        creator, // caller (who is creating this contract)
        new_address, // address (the new contract's address)
        value, // value being sent to this contract
        gas, // gas available for init code execution
        init_code, // the init code to execute
        code_hash, // hash of the init code
        &[_]u8{}, // no input data for init code
        false, // not static
    );
    defer init_contract.deinit(self.allocator, null);

    // Execute the init code - this should return the deployment bytecode
    const init_result = self.interpret_with_context(&init_contract, &[_]u8{}, false) catch |err| {
        if (err == ExecutionError.Error.REVERT) {
            // On revert, we should still consume gas but not all
            return CreateResult{
                .success = false,
                .address = Address.zero(),
                .gas_left = init_contract.gas,
                .output = null,
            };
        }

        // Most initcode failures should return 0 address and consume all gas
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = 0,
            .output = null,
        };
    };

    const deployment_code = init_result.output orelse &[_]u8{};

    // Check EIP-170 MAX_CODE_SIZE limit on the returned bytecode (24,576 bytes)
    if (deployment_code.len > constants.MAX_CODE_SIZE) {
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = 0, // Consume all gas on failure
            .output = null,
        };
    }

    const deploy_code_gas = @as(u64, @intCast(deployment_code.len)) * constants.DEPLOY_CODE_GAS_PER_BYTE;

    if (deploy_code_gas > init_result.gas_left) {
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = 0,
            .output = null,
        };
    }

    try self.state.set_code(new_address, deployment_code);

    const gas_left = init_result.gas_left - deploy_code_gas;

    return CreateResult{
        .success = true,
        .address = new_address,
        .gas_left = gas_left,
        .output = deployment_code,
    };
}

pub const CallContractError = std.mem.Allocator.Error;

/// Execute a CALL operation to another contract.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Implement value transfer, gas calculation, recursive execution, and return data handling.
pub fn call_contract(self: *Self, caller: Address.Address, to: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallContractError!CallResult {
    _ = self;
    _ = caller;
    _ = to;
    _ = value;
    _ = input;
    _ = gas;
    _ = is_static;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const ConsumeGasError = ExecutionError.Error;

pub const Create2ContractError = std.mem.Allocator.Error || Address.CalculateCreate2AddressError;

/// Create a new contract using CREATE2 opcode semantics.
///
/// Calculates a deterministic address using keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:],
/// transfers value if specified, executes the initialization code, and deploys
/// the resulting bytecode. Unlike CREATE, the address is predictable before deployment.
pub fn create2_contract(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractError!CreateResult {
    // Calculate the new contract address using CREATE2 formula:
    // address = keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:]
    const new_address = try Address.calculate_create2_address(self.allocator, creator, salt, init_code);

    if (self.state.get_code(new_address).len > 0) {
        // Contract already exists at this address
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = gas,
            .output = null,
        };
    }

    const creator_balance = self.state.get_balance(creator);
    if (creator_balance < value) {
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = gas,
            .output = null,
        };
    }

    if (value > 0) {
        try self.state.set_balance(creator, creator_balance - value);
        try self.state.set_balance(new_address, value);
    }

    if (init_code.len == 0) {
        // No init code means empty contract
        return CreateResult{
            .success = true,
            .address = new_address,
            .gas_left = gas,
            .output = null,
        };
    }

    var hasher = Keccak256.init(.{});
    hasher.update(init_code);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    var init_contract = Contract.init(
        creator, // caller (who is creating this contract)
        new_address, // address (the new contract's address)
        value, // value being sent to this contract
        gas, // gas available for init code execution
        init_code, // the init code to execute
        code_hash, // hash of the init code
        &[_]u8{}, // no input data for init code
        false, // not static
    );
    defer init_contract.deinit(self.allocator, null);

    // Execute the init code - this should return the deployment bytecode
    const init_result = self.interpret_with_context(&init_contract, &[_]u8{}, false) catch |err| {
        if (err == ExecutionError.Error.REVERT) {
            // On revert, we should still consume gas but not all
            return CreateResult{
                .success = false,
                .address = Address.zero(),
                .gas_left = init_contract.gas,
                .output = null,
            };
        }

        // Most initcode failures should return 0 address and consume all gas
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = 0, // Consume all gas on failure
            .output = null,
        };
    };

    // Get the output from the RunResult
    const deployment_code = init_result.output orelse &[_]u8{};

    // Check EIP-170 MAX_CODE_SIZE limit on the returned bytecode (24,576 bytes)
    if (deployment_code.len > constants.MAX_CODE_SIZE) {
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = 0, // Consume all gas on failure
            .output = null,
        };
    }

    const deploy_code_gas = @as(u64, @intCast(deployment_code.len)) * constants.DEPLOY_CODE_GAS_PER_BYTE;

    if (deploy_code_gas > init_result.gas_left) {
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = 0,
            .output = null,
        };
    }

    try self.state.set_code(new_address, deployment_code);

    const gas_left = init_result.gas_left - deploy_code_gas;

    return CreateResult{
        .success = true,
        .address = new_address,
        .gas_left = gas_left,
        .output = deployment_code,
    };
}

pub const CallcodeContractError = std.mem.Allocator.Error;

// TODO
/// Execute a CALLCODE operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target code in current contract's context while preserving caller information.
pub fn callcode_contract(self: *Self, current: Address.Address, code_address: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallcodeContractError!CallResult {
    _ = self;
    _ = current;
    _ = code_address;
    _ = value;
    _ = input;
    _ = gas;
    _ = is_static;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const DelegatecallContractError = std.mem.Allocator.Error;

/// Execute a DELEGATECALL operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target code with current caller and value context preserved.
pub fn delegatecall_contract(self: *Self, current: Address.Address, code_address: Address.Address, input: []const u8, gas: u64, is_static: bool) DelegatecallContractError!CallResult {
    _ = self;
    _ = current;
    _ = code_address;
    _ = input;
    _ = gas;
    _ = is_static;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const StaticcallContractError = std.mem.Allocator.Error;

/// Execute a STATICCALL operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target contract in guaranteed read-only mode.
pub fn staticcall_contract(self: *Self, caller: Address.Address, to: Address.Address, input: []const u8, gas: u64) StaticcallContractError!CallResult {
    _ = self;
    _ = caller;
    _ = to;
    _ = input;
    _ = gas;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const EmitLogError = std.mem.Allocator.Error;

/// Emit an event log (LOG0-LOG4 opcodes).
/// Records an event that will be included in the transaction receipt.
pub fn emit_log(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) EmitLogError!void {
    try self.state.emit_log(address, topics, data);
}

pub const InitTransactionAccessListError = AccessList.InitTransactionError;

/// Initialize the access list for a new transaction (EIP-2929).
/// Must be called at the start of each transaction to set up warm/cold access tracking.
pub fn init_transaction_access_list(self: *Self, to: ?Address.Address) InitTransactionAccessListError!void {
    try self.access_list.init_transaction(self.context.tx_origin, self.context.block_coinbase, to);
}

pub const PreWarmAddressesError = AccessList.PreWarmAddressesError;

/// Mark addresses as warm to reduce gas costs for subsequent access.
/// Used with EIP-2930 access lists to pre-warm addresses in transactions.
/// Time complexity: O(n) where n is the number of addresses.
pub fn pre_warm_addresses(self: *Self, addresses: []const Address.Address) PreWarmAddressesError!void {
    try self.access_list.pre_warm_addresses(addresses);
}

pub const PreWarmStorageSlotsError = AccessList.PreWarmStorageSlotsError;

/// Mark storage slots as warm to reduce gas costs for subsequent access.
/// Used with EIP-2930 access lists in transactions.
pub fn pre_warm_storage_slots(self: *Self, address: Address.Address, slots: []const u256) PreWarmStorageSlotsError!void {
    try self.access_list.pre_warm_storage_slots(address, slots);
}

pub const GetAddressAccessCostError = AccessList.AccessAddressError;

/// Get the gas cost for accessing an address and mark it as warm.
/// Returns higher gas for first access, lower gas for subsequent access per EIP-2929.
/// Time complexity: O(1) with hash table lookup.
pub fn get_address_access_cost(self: *Self, address: Address.Address) GetAddressAccessCostError!u64 {
    return self.access_list.access_address(address);
}

pub const GetStorageAccessCostError = AccessList.AccessStorageSlotError;

/// Get the gas cost for accessing a storage slot and mark it as warm.
/// Returns 2100 gas for cold access, 100 gas for warm access (Berlin hardfork).
pub fn get_storage_access_cost(self: *Self, address: Address.Address, slot: u256) GetStorageAccessCostError!u64 {
    return self.access_list.access_storage_slot(address, slot);
}

pub const GetCallCostError = AccessList.GetCallCostError;

/// Get the additional gas cost for a CALL operation based on address warmth.
/// Returns extra gas required for calls to cold addresses (EIP-2929).
pub fn get_call_cost(self: *Self, address: Address.Address) GetCallCostError!u64 {
    return self.access_list.get_call_cost(address);
}

pub const ValidateStaticContextError = error{WriteProtection};

/// Validate that state modifications are allowed in the current context.
/// Returns WriteProtection error if called within a static (read-only) context.
pub fn validate_static_context(self: *const Self) ValidateStaticContextError!void {
    if (self.read_only) return error.WriteProtection;
}

pub const SetStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set a storage value with static context protection.
/// Used by the SSTORE opcode to prevent storage modifications in static calls.
pub fn set_storage_protected(self: *Self, address: Address.Address, slot: u256, value: u256) SetStorageProtectedError!void {
    try self.validate_static_context();
    try self.state.set_storage(address, slot, value);
}

pub const SetTransientStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set a transient storage value with static context protection.
/// Transient storage (EIP-1153) is cleared at the end of each transaction.
pub fn set_transient_storage_protected(self: *Self, address: Address.Address, slot: u256, value: u256) SetTransientStorageProtectedError!void {
    try self.validate_static_context();
    try self.state.set_transient_storage(address, slot, value);
}

pub const SetBalanceProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set an account balance with static context protection.
/// Prevents balance modifications during static calls.
pub fn set_balance_protected(self: *Self, address: Address.Address, balance: u256) SetBalanceProtectedError!void {
    try self.validate_static_context();
    try self.state.set_balance(address, balance);
}

pub const SetCodeProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Deploy contract code with static context protection.
/// Prevents code deployment during static calls.
pub fn set_code_protected(self: *Self, address: Address.Address, code: []const u8) SetCodeProtectedError!void {
    try self.validate_static_context();
    try self.state.set_code(address, code);
}

pub const EmitLogProtectedError = ValidateStaticContextError || EmitLogError;

/// Emit a log with static context protection.
/// Prevents log emission during static calls as logs modify the transaction state.
pub fn emit_log_protected(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) EmitLogProtectedError!void {
    try self.validate_static_context();
    try self.emit_log(address, topics, data);
}

pub const CreateContractProtectedError = ValidateStaticContextError || CreateContractError;

/// Create a contract with static context protection.
/// Prevents contract creation during static calls.
pub fn create_contract_protected(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) CreateContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create_contract(creator, value, init_code, gas);
}

pub const Create2ContractProtectedError = ValidateStaticContextError || Create2ContractError;

/// Create a contract with CREATE2 and static context protection.
/// Prevents contract creation during static calls.
pub fn create2_contract_protected(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create2_contract(creator, value, init_code, salt, gas);
}

pub const ValidateValueTransferError = error{WriteProtection};

/// Validate that value transfer is allowed in the current context.
/// Static calls cannot transfer value (msg.value must be 0).
pub fn validate_value_transfer(self: *const Self, value: u256) ValidateValueTransferError!void {
    if (self.read_only and value != 0) return error.WriteProtection;
}

pub const SelfdestructProtectedError = ValidateStaticContextError;

/// Execute SELFDESTRUCT with static context protection.
/// NOT FULLY IMPLEMENTED - currently only validates static context.
/// TODO: Transfer remaining balance to beneficiary and mark contract for deletion.
pub fn selfdestruct_protected(self: *Self, contract: Address.Address, beneficiary: Address.Address) SelfdestructProtectedError!void {
    _ = contract;
    _ = beneficiary;
    try self.validate_static_context();
}
