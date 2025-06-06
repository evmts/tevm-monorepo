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
pub const StorageKey = @import("storage_key.zig");
pub const CreateResult = @import("create_result.zig");
pub const CallResult = @import("call_result.zig");
pub const RunResult = @import("run_result.zig");

// Error types for VM operations
pub const VmError = ExecutionError.Error || std.mem.Allocator.Error || Frame.FrameError;
pub const VmStorageError = std.mem.Allocator.Error;
pub const VmStateError = ExecutionError.Error;
pub const VmInitError = std.mem.Allocator.Error;
pub const VmInterpretError = ExecutionError.Error || Frame.FrameError;
pub const VmAccessListError = error{
    OutOfMemory,
    InvalidAddress,
    InvalidSlot,
};
pub const VmAddressCalculationError = std.mem.Allocator.Error;

const Self = @This();

allocator: std.mem.Allocator,

return_data: []u8 = &[_]u8{},

stack: Stack = .{},
table: JumpTable,
chain_rules: ChainRules,

depth: u16 = 0,

read_only: bool = false,

// Storage and state management
storage: std.AutoHashMap(Self.StorageKey, u256),
balances: std.AutoHashMap(Address.Address, u256),
code: std.AutoHashMap(Address.Address, []const u8),
nonces: std.AutoHashMap(Address.Address, u64),
transient_storage: std.AutoHashMap(Self.StorageKey, u256),
logs: std.ArrayList(EvmLog),

// EIP-2929: Access list for gas cost calculation
access_list: AccessList,

// Transaction context (temporary placeholder)
tx_origin: Address.Address = Address.zero(),
gas_price: u256 = 0,
block_number: u64 = 0,
block_timestamp: u64 = 0,
block_coinbase: Address.Address = Address.zero(),
block_difficulty: u256 = 0,
block_gas_limit: u64 = 0,
chain_id: u256 = 1,
block_base_fee: u256 = 0,
blob_hashes: []const u256 = &[_]u256{},
blob_base_fee: u256 = 0,

pub fn init(allocator: std.mem.Allocator) VmInitError!Self {
    return init_with_hardfork(allocator, .CANCUN) catch |err| {
        Log.debug("Failed to initialize VM with default hardfork: {any}", .{err});
        return err;
    };
}

pub fn init_with_hardfork(allocator: std.mem.Allocator, hardfork: @import("hardfork.zig").Hardfork) VmInitError!Self {
    var storage = std.AutoHashMap(Self.StorageKey, u256).init(allocator);
    errdefer storage.deinit();

    var balances = std.AutoHashMap(Address.Address, u256).init(allocator);
    errdefer balances.deinit();

    var code = std.AutoHashMap(Address.Address, []const u8).init(allocator);
    errdefer code.deinit();

    var nonces = std.AutoHashMap(Address.Address, u64).init(allocator);
    errdefer nonces.deinit();

    var transient_storage = std.AutoHashMap(Self.StorageKey, u256).init(allocator);
    errdefer transient_storage.deinit();

    var logs = std.ArrayList(EvmLog).init(allocator);
    errdefer logs.deinit();

    var access_list = AccessList.init(allocator);
    errdefer access_list.deinit();

    return Self{
        .allocator = allocator,
        .table = JumpTable.init_from_hardfork(hardfork),
        .chain_rules = ChainRules.for_hardfork(hardfork),
        .storage = storage,
        .balances = balances,
        .code = code,
        .nonces = nonces,
        .transient_storage = transient_storage,
        .logs = logs,
        .access_list = access_list,
    };
}

pub fn deinit(self: *Self) void {
    self.storage.deinit();
    self.balances.deinit();
    self.code.deinit();
    self.nonces.deinit();
    self.transient_storage.deinit();

    // Clean up logs - free allocated memory for topics and data
    for (self.logs.items) |log| {
        self.allocator.free(log.topics);
        self.allocator.free(log.data);
    }
    self.logs.deinit();

    self.access_list.deinit();

    // Clean up the global contract analysis cache
    Contract.clear_analysis_cache(self.allocator);
}

pub fn interpret(self: *Self, contract: *Contract, input: []const u8) VmInterpretError![]const u8 {
    return self.interpret_with_context(contract, input, false) catch |err| {
        Log.debug("Failed to interpret contract: {any}", .{err});
        return err;
    };
}

pub fn interpret_static(self: *Self, contract: *Contract, input: []const u8) VmInterpretError![]const u8 {
    return self.interpret_with_context(contract, input, true) catch |err| {
        Log.debug("Failed to interpret contract in static context: {any}", .{err});
        return err;
    };
}

pub fn interpret_with_context(self: *Self, contract: *Contract, input: []const u8, is_static: bool) VmInterpretError![]const u8 {
    self.depth += 1;
    defer self.depth -= 1;

    const prev_read_only = self.read_only;
    defer self.read_only = prev_read_only;

    self.read_only = self.read_only or is_static;

    var pc: usize = 0;
    var frame = Frame.init(self.allocator, contract) catch |err| {
        Log.debug("Failed to initialize frame: {any}", .{err});
        return switch (err) {
            Frame.FrameError.OutOfMemory => ExecutionError.Error.OutOfMemory,
            Frame.FrameError.InvalidContract => ExecutionError.Error.InvalidCodeEntry,
            Frame.FrameError.InvalidMemoryOperation => ExecutionError.Error.OutOfMemory,
            Frame.FrameError.InvalidStackOperation => ExecutionError.Error.StackUnderflow,
        };
    };
    defer frame.deinit();
    frame.memory.finalize_root();
    frame.is_static = self.read_only;
    frame.depth = @as(u32, @intCast(self.depth));
    frame.input = input;
    frame.gas_remaining = contract.gas;

    while (pc < contract.code_size) {
        const opcode = contract.get_op(pc);
        frame.pc = pc;

        const interpreter_ptr: *Operation.Interpreter = @ptrCast(self);
        const state_ptr: *Operation.State = @ptrCast(&frame);
        const result = self.table.execute(pc, interpreter_ptr, state_ptr, opcode) catch |err| {
            // Update contract gas before returning
            contract.gas = frame.gas_remaining;
            self.return_data = @constCast(frame.return_data_buffer);

            // Handle specific errors with exhaustive switch
            return switch (err) {
                ExecutionError.Error.InvalidOpcode => {
                    // INVALID opcode consumes all remaining gas
                    frame.gas_remaining = 0;
                    contract.gas = 0;
                    return &[_]u8{};
                },
                ExecutionError.Error.STOP => {
                    // Normal stop
                    return frame.return_data_buffer;
                },
                else => return err,
            };
        };

        // BUGFIX: Correctly handle JUMP/JUMPI destinations
        if (frame.pc != pc) {
            pc = frame.pc;
        } else {
            // Update PC based on bytes consumed (for PUSH operations)
            pc += result.bytes_consumed;
        }
    }

    // Fell off end of bytecode, equivalent to a STOP
    contract.gas = frame.gas_remaining;
    self.return_data = @constCast(frame.return_data_buffer);
    return &[_]u8{};
}

// Contract creation with CREATE opcode
pub const CreateContractError = std.mem.Allocator.Error || Address.CalculateAddressError;
pub fn create_contract(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) CreateContractError!CreateResult {
    // Get and increment nonce for the creator
    const current_nonce = self.nonces.get(creator) orelse 0;
    const nonce = current_nonce;
    const new_nonce = current_nonce + 1;
    self.nonces.put(creator, new_nonce) catch |err| {
        Log.debug("Failed to increment nonce for address 0x{x}: {any}", .{ Address.to_u256(creator), err });
        return err;
    };

    // Calculate the new contract address using CREATE formula:
    // address = keccak256(rlp([sender, nonce]))[12:]
    const new_address = try Address.calculate_create_address(self.allocator, creator, nonce);

    // Log init code info
    _ = init_code.len; // Use init_code to avoid unused parameter warning

    // Check if account already exists at this address
    const existing_code = self.code.get(new_address) orelse &[_]u8{};
    if (existing_code.len > 0) {
        // Contract already exists at this address
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = gas,
            .output = null,
        };
    }

    // Check if creator has sufficient balance for value transfer
    const creator_balance = self.balances.get(creator) orelse 0;
    if (creator_balance < value) {
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = gas,
            .output = null,
        };
    }

    // Transfer value from creator to new contract
    if (value > 0) {
        self.balances.put(creator, creator_balance - value) catch |err| {
            Log.debug("Failed to set balance for address 0x{x}: {any}", .{ Address.to_u256(creator), err });
            return err;
        };
        self.balances.put(new_address, value) catch |err| {
            Log.debug("Failed to set balance for address 0x{x}: {any}", .{ Address.to_u256(new_address), err });
            return err;
        };
    }

    // Execute the init code to get the deployed bytecode
    if (init_code.len == 0) {
        // No init code means empty contract
        return CreateResult{
            .success = true,
            .address = new_address,
            .gas_left = gas,
            .output = null,
        };
    }

    // Create a new contract for the init code execution
    // Calculate code hash for the init code
    var hasher = Keccak256.init(.{});
    hasher.update(init_code);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    // Create a contract to execute the init code
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
    const init_result = self.interpret_with_context(&init_contract, &[_]u8{}, false) catch {

        // Most initcode failures should return 0 address and consume all gas
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = 0, // Consume all gas on failure
            .output = null,
        };
    };

    // Check EIP-170 MAX_CODE_SIZE limit on the returned bytecode (24,576 bytes)
    if (init_result.len > constants.MAX_CODE_SIZE) {
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = 0, // Consume all gas on failure
            .output = null,
        };
    }

    // Charge gas for deployed code size (200 gas per byte)
    const deploy_code_gas = @as(u64, @intCast(init_result.len)) * constants.DEPLOY_CODE_GAS_PER_BYTE;

    // Check if we have enough gas for deployment
    if (deploy_code_gas > gas) {
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = 0,
            .output = null,
        };
    }

    // Store the deployed bytecode at the new contract address
    self.code.put(new_address, init_result) catch |err| {
        Log.debug("Failed to set code for address 0x{x}: {any}", .{ Address.to_u256(new_address), err });
        return err;
    };

    const gas_left = gas - deploy_code_gas;

    return CreateResult{
        .success = true,
        .address = new_address,
        .gas_left = gas_left,
        .output = init_result,
    };
}

// Placeholder contract call - to be implemented properly later
pub const CallContractError = std.mem.Allocator.Error;
pub fn call_contract(self: *Self, caller: Address.Address, to: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallContractError!CallResult {
    _ = self; // autofix
    _ = caller;
    _ = to;
    _ = value;
    _ = input;
    _ = gas;
    _ = is_static;

    // For now, return a failed call
    return CallResult{
        .success = false,
        .gas_left = 0,
        .output = null,
    };
}

// Gas consumption method for opcodes
pub const ConsumeGasError = ExecutionError.Error;
pub fn consume_gas(self: *Self, amount: u64) ConsumeGasError!void {
    _ = self;
    _ = amount;
    // Gas tracking is implemented at the Frame level (frame.consume_gas)
    // This method is kept for future VM-level gas accounting
}

// CREATE2 specific method
pub const Create2ContractError = std.mem.Allocator.Error || Address.CalculateCreate2AddressError;
pub fn create2_contract(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractError!CreateResult {
    // Calculate the new contract address using CREATE2 formula:
    // address = keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:]
    const new_address = try Address.calculate_create2_address(self.allocator, creator, salt, init_code);

    // Check if account already exists at this address
    const existing_code = self.code.get(new_address) orelse &[_]u8{};
    if (existing_code.len > 0) {
        // Contract already exists at this address
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = gas,
            .output = null,
        };
    }

    // Check if creator has sufficient balance for value transfer
    const creator_balance = self.balances.get(creator) orelse 0;
    if (creator_balance < value) {
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = gas,
            .output = null,
        };
    }

    // Transfer value from creator to new contract
    if (value > 0) {
        self.balances.put(creator, creator_balance - value) catch |err| {
            Log.debug("Failed to set balance for address 0x{x}: {any}", .{ Address.to_u256(creator), err });
            return err;
        };
        self.balances.put(new_address, value) catch |err| {
            Log.debug("Failed to set balance for address 0x{x}: {any}", .{ Address.to_u256(new_address), err });
            return err;
        };
    }

    // Execute the init code to get the deployed bytecode
    if (init_code.len == 0) {
        // No init code means empty contract
        return CreateResult{
            .success = true,
            .address = new_address,
            .gas_left = gas,
            .output = null,
        };
    }

    // Create a new contract for the init code execution
    // Calculate code hash for the init code
    var hasher = Keccak256.init(.{});
    hasher.update(init_code);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    // Create a contract to execute the init code
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
    const init_result = self.interpret_with_context(&init_contract, &[_]u8{}, false) catch {

        // Most initcode failures should return 0 address and consume all gas
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = 0, // Consume all gas on failure
            .output = null,
        };
    };

    // Check EIP-170 MAX_CODE_SIZE limit on the returned bytecode (24,576 bytes)
    if (init_result.len > constants.MAX_CODE_SIZE) {
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = 0, // Consume all gas on failure
            .output = null,
        };
    }

    // Charge gas for deployed code size (200 gas per byte)
    const deploy_code_gas = @as(u64, @intCast(init_result.len)) * constants.DEPLOY_CODE_GAS_PER_BYTE;

    // Check if we have enough gas for deployment
    if (deploy_code_gas > gas) {
        return CreateResult{
            .success = false,
            .address = Address.zero(),
            .gas_left = 0,
            .output = null,
        };
    }

    // Store the deployed bytecode at the new contract address
    self.code.put(new_address, init_result) catch |err| {
        Log.debug("Failed to set code for address 0x{x}: {any}", .{ Address.to_u256(new_address), err });
        return err;
    };

    const gas_left = gas - deploy_code_gas;

    return CreateResult{
        .success = true,
        .address = new_address,
        .gas_left = gas_left,
        .output = init_result,
    };
}

// CALLCODE specific method - executes code of 'to' in the context of the current contract
pub const CallcodeContractError = std.mem.Allocator.Error;
pub fn callcode_contract(self: *Self, current: Address.Address, code_address: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallcodeContractError!CallResult {
    _ = self; // autofix
    _ = current;
    _ = code_address;
    _ = value;
    _ = input;
    _ = gas;
    _ = is_static;

    // For now, return a failed call
    return CallResult{
        .success = false,
        .gas_left = 0,
        .output = null,
    };
}

// DELEGATECALL specific method - executes code of 'to' with current contract's storage and sender/value
pub const DelegatecallContractError = std.mem.Allocator.Error;
pub fn delegatecall_contract(self: *Self, current: Address.Address, code_address: Address.Address, input: []const u8, gas: u64, is_static: bool) DelegatecallContractError!CallResult {
    _ = self; // autofix
    _ = current;
    _ = code_address;
    _ = input;
    _ = gas;
    _ = is_static;

    // For now, return a failed call
    return CallResult{
        .success = false,
        .gas_left = 0,
        .output = null,
    };
}

// STATICCALL specific method - guaranteed read-only call
pub const StaticcallContractError = std.mem.Allocator.Error;
pub fn staticcall_contract(self: *Self, caller: Address.Address, to: Address.Address, input: []const u8, gas: u64) StaticcallContractError!CallResult {
    _ = self; // autofix
    _ = caller;
    _ = to;
    _ = input;
    _ = gas;

    // Implementation would call interpret_static or set read_only = true
    // For now, return a failed call
    return CallResult{
        .success = false,
        .gas_left = 0,
        .output = null,
    };
}

// Emit a log event
// TODO: Architecture for freeable logs following Rust ownership best practices:
// 1. Log should own its data and topics, not just hold pointers
// 2. When VM is deinitialized, it should free all log data
// 3. Consider using Arena allocator for logs within a transaction
// 4. Alternative: Log could hold indices into a central buffer that's freed at once
// 5. For now, we're leaking memory - this needs to be fixed
pub const EmitLogError = std.mem.Allocator.Error;
pub fn emit_log(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) EmitLogError!void {
    // Clone the data to ensure it persists
    const data_copy = try self.allocator.alloc(u8, data.len);
    @memcpy(data_copy, data);

    // Clone the topics to ensure they persist
    const topics_copy = try self.allocator.alloc(u256, topics.len);
    @memcpy(topics_copy, topics);

    const log = EvmLog{
        .address = address,
        .topics = topics_copy,
        .data = data_copy,
    };

    try self.logs.append(log);
}

// EIP-2929: Initialize transaction access list
pub const InitTransactionAccessListError = AccessList.InitTransactionError;
pub fn init_transaction_access_list(self: *Self, to: ?Address.Address) InitTransactionAccessListError!void {
    try self.access_list.init_transaction(self.tx_origin, self.block_coinbase, to);
}

// EIP-2929: Pre-warm addresses from EIP-2930 access list
pub const PreWarmAddressesError = AccessList.PreWarmAddressesError;
pub fn pre_warm_addresses(self: *Self, addresses: []const Address.Address) PreWarmAddressesError!void {
    try self.access_list.pre_warm_addresses(addresses);
}

// EIP-2929: Pre-warm storage slots from EIP-2930 access list
pub const PreWarmStorageSlotsError = AccessList.PreWarmStorageSlotsError;
pub fn pre_warm_storage_slots(self: *Self, address: Address.Address, slots: []const u256) PreWarmStorageSlotsError!void {
    try self.access_list.pre_warm_storage_slots(address, slots);
}

// EIP-2929: Get gas cost for accessing an address
pub const GetAddressAccessCostError = AccessList.AccessAddressError;
pub fn get_address_access_cost(self: *Self, address: Address.Address) GetAddressAccessCostError!u64 {
    return self.access_list.access_address(address);
}

// EIP-2929: Get gas cost for accessing a storage slot
pub const GetStorageAccessCostError = AccessList.AccessStorageSlotError;
pub fn get_storage_access_cost(self: *Self, address: Address.Address, slot: u256) GetStorageAccessCostError!u64 {
    return self.access_list.access_storage_slot(address, slot);
}

// EIP-2929: Get extra gas cost for CALL to an address
pub const GetCallCostError = AccessList.GetCallCostError;
pub fn get_call_cost(self: *Self, address: Address.Address) GetCallCostError!u64 {
    return self.access_list.get_call_cost(address);
}

// Static call protection validation
pub const ValidateStaticContextError = error{WriteProtection};
pub fn validate_static_context(self: *const Self) ValidateStaticContextError!void {
    if (self.read_only) {
        return error.WriteProtection;
    }
}

// State modification methods with static protection
pub const SetStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;
pub fn set_storage_protected(self: *Self, address: Address.Address, slot: u256, value: u256) SetStorageProtectedError!void {
    try self.validate_static_context();
    const key = Self.StorageKey{ .address = address, .slot = slot };
    self.storage.put(key, value) catch |err| {
        Log.debug("Failed to set storage for address 0x{x}, slot {d}: {any}", .{ Address.to_u256(address), slot, err });
        return err;
    };
}

pub const SetTransientStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;
pub fn set_transient_storage_protected(self: *Self, address: Address.Address, slot: u256, value: u256) SetTransientStorageProtectedError!void {
    try self.validate_static_context();
    const key = Self.StorageKey{ .address = address, .slot = slot };
    self.transient_storage.put(key, value) catch |err| {
        Log.debug("Failed to set transient storage for address 0x{x}, slot {d}: {any}", .{ Address.to_u256(address), slot, err });
        return err;
    };
}

pub const SetBalanceProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;
pub fn set_balance_protected(self: *Self, address: Address.Address, balance: u256) SetBalanceProtectedError!void {
    try self.validate_static_context();
    self.balances.put(address, balance) catch |err| {
        Log.debug("Failed to set balance for address 0x{x}: {any}", .{ Address.to_u256(address), err });
        return err;
    };
}

pub const SetCodeProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;
pub fn set_code_protected(self: *Self, address: Address.Address, code: []const u8) SetCodeProtectedError!void {
    try self.validate_static_context();
    self.code.put(address, code) catch |err| {
        Log.debug("Failed to set code for address 0x{x}: {any}", .{ Address.to_u256(address), err });
        return err;
    };
}

pub const EmitLogProtectedError = ValidateStaticContextError || EmitLogError;
pub fn emit_log_protected(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) EmitLogProtectedError!void {
    try self.validate_static_context();
    try self.emit_log(address, topics, data);
}

// Contract creation with static protection
pub const CreateContractProtectedError = ValidateStaticContextError || CreateContractError;
pub fn create_contract_protected(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) CreateContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create_contract(creator, value, init_code, gas);
}

pub const Create2ContractProtectedError = ValidateStaticContextError || Create2ContractError;
pub fn create2_contract_protected(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create2_contract(creator, value, init_code, salt, gas);
}

// Value transfer validation
pub const ValidateValueTransferError = error{WriteProtection};
pub fn validate_value_transfer(self: *const Self, value: u256) ValidateValueTransferError!void {
    if (self.read_only and value != 0) {
        return error.WriteProtection;
    }
}

// SELFDESTRUCT with static protection
pub const SelfdestructProtectedError = ValidateStaticContextError;
pub fn selfdestruct_protected(self: *Self, contract: Address.Address, beneficiary: Address.Address) SelfdestructProtectedError!void {
    try self.validate_static_context();
    // Implementation would transfer balance and mark contract for deletion
    _ = contract;
    _ = beneficiary;
    // TODO: Selfdestruct scheduling and execution happens at transaction level
    // For now, this is a stub that only validates static context
}

// Simple bytecode execution for testing
pub const RunError = std.mem.Allocator.Error || Frame.FrameError || ExecutionError.Error;
pub fn run(self: *Self, bytecode: []const u8, address: Address.Address, gas: u64, input: ?[]const u8) RunError!RunResult {
    // Calculate code hash for the contract
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    // Create a contract with the bytecode
    var contract = Contract.init(
        address, // caller
        address, // address
        0, // value
        gas,
        bytecode,
        code_hash,
        input orelse &[_]u8{},
        false, // not static
    );
    defer contract.deinit(self.allocator, null);

    // Set the code for the contract address
    self.code.put(address, bytecode) catch |err| {
        Log.debug("Failed to set code for address 0x{x}: {any}", .{ Address.to_u256(address), err });
        return err;
    };

    const initial_gas = gas;

    const output_data = self.interpret(&contract, input orelse &[_]u8{}) catch |err| {
        var output: ?[]const u8 = null;
        if (self.return_data.len > 0) {
            output = try self.allocator.dupe(u8, self.return_data);
        }

        switch (err) {
            ExecutionError.Error.REVERT => {
                return RunResult{
                    .status = .Revert,
                    .gas_left = contract.gas,
                    .gas_used = initial_gas - contract.gas,
                    .output = output,
                };
            },
            ExecutionError.Error.OutOfGas => {
                return RunResult{
                    .status = .OutOfGas,
                    .gas_left = contract.gas,
                    .gas_used = initial_gas - contract.gas,
                    .output = output,
                };
            },
            ExecutionError.Error.InvalidJump, ExecutionError.Error.InvalidOpcode, ExecutionError.Error.StackUnderflow, ExecutionError.Error.StackOverflow, ExecutionError.Error.StaticStateChange, ExecutionError.Error.WriteProtection, ExecutionError.Error.DepthLimit, ExecutionError.Error.MaxCodeSizeExceeded => {
                return RunResult{
                    .status = .Invalid,
                    .gas_left = contract.gas,
                    .gas_used = initial_gas - contract.gas,
                    .output = output,
                };
            },
            else => return err, // Unexpected error
        }
    };

    // If interpret returns successfully, it's a success status
    var output: ?[]const u8 = null;
    if (output_data.len > 0) {
        output = try self.allocator.dupe(u8, output_data);
    }

    return RunResult{
        .status = .Success,
        .gas_left = contract.gas,
        .gas_used = initial_gas - contract.gas,
        .output = output,
    };
}
