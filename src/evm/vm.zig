const std = @import("std");
<<<<<<< HEAD
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

// Log struct for EVM event logs (LOG0-LOG4 opcodes)
pub const Log = struct {
    address: Address.Address,
    topics: []const u256,
    data: []const u8,
};
=======
const Contract = @import("contract/contract.zig");
const Stack = @import("stack/stack.zig");
const JumpTable = @import("jump_table/jump_table.zig");
const Frame = @import("frame.zig");
const Operation = @import("opcodes/operation.zig");
const Address = @import("Address");
const StoragePool = @import("contract/storage_pool.zig");
const AccessList = @import("access_list/access_list.zig");
const ExecutionError = @import("execution/execution_error.zig");
const rlp = @import("Rlp");
const Keccak256 = std.crypto.hash.sha3.Keccak256;
const ChainRules = @import("hardforks/chain_rules.zig");
const gas_constants = @import("constants/gas_constants.zig");
const constants = @import("constants/constants.zig");
const Log = @import("log.zig");
const EvmLog = @import("state/evm_log.zig");
const Context = @import("context.zig");
const EvmState = @import("state/state.zig");
pub const StorageKey = @import("state/storage_key.zig");
pub const CreateResult = @import("create_result.zig").CreateResult;
pub const CallResult = @import("call_result.zig").CallResult;
pub const RunResult = @import("run_result.zig").RunResult;
const Hardfork = @import("hardforks/hardfork.zig").Hardfork;
const precompiles = @import("precompiles/precompiles.zig");
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

/// Virtual Machine for executing Ethereum bytecode.
///
/// Manages contract execution, gas accounting, state access, and protocol enforcement
/// according to the configured hardfork rules. Supports the full EVM instruction set
/// including contract creation, calls, and state modifications.
const Vm = @This();

/// Memory allocator for VM operations
allocator: std.mem.Allocator,
/// Return data from the most recent operation
return_data: []u8 = &[_]u8{},
/// Legacy stack field (unused in current implementation)
stack: Stack = .{},
<<<<<<< HEAD
table: JumpTable,
chain_rules: ChainRules,

=======
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
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
depth: u16 = 0,
/// Whether the current context is read-only (STATICCALL)
read_only: bool = false,

<<<<<<< HEAD
// Storage and state management
storage: std.AutoHashMap(StorageKey, u256),
balances: std.AutoHashMap(Address.Address, u256),
code: std.AutoHashMap(Address.Address, []const u8),
nonces: std.AutoHashMap(Address.Address, u64),
transient_storage: std.AutoHashMap(StorageKey, u256),
logs: std.ArrayList(Log),

// EIP-2929: Access list for gas cost calculation
access_list: AccessList,

// Transaction context (temporary placeholder)
tx_origin: Address.Address = Address.ZERO_ADDRESS,
gas_price: u256 = 0,
block_number: u64 = 0,
block_timestamp: u64 = 0,
block_coinbase: Address.Address = Address.ZERO_ADDRESS,
block_difficulty: u256 = 0,
block_gas_limit: u64 = 0,
chain_id: u256 = 1,
block_base_fee: u256 = 0,
blob_hashes: []const u256 = &[_]u256{},
blob_base_fee: u256 = 0,

// Testing helpers
last_stack_value: ?u256 = null,
call_result: ?CallResult = null,
create_result: ?CreateResult = null,

pub const StorageKey = struct {
    address: Address.Address,
    slot: u256,
};

pub fn init(allocator: std.mem.Allocator) !Self {
    return init_with_hardfork(allocator, .CANCUN);
}

pub fn init_with_hardfork(allocator: std.mem.Allocator, hardfork: @import("hardfork.zig").Hardfork) !Self {
    var storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer storage.deinit();

    var balances = std.AutoHashMap(Address.Address, u256).init(allocator);
    errdefer balances.deinit();

    var code = std.AutoHashMap(Address.Address, []const u8).init(allocator);
    errdefer code.deinit();

    var nonces = std.AutoHashMap(Address.Address, u64).init(allocator);
    errdefer nonces.deinit();

    var transient_storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer transient_storage.deinit();

    var logs = std.ArrayList(Log).init(allocator);
    errdefer logs.deinit();
=======
/// Initialize VM with a jump table and corresponding chain rules.
///
/// @param allocator Memory allocator for VM operations
/// @param jump_table Optional jump table. If null, uses JumpTable.DEFAULT (latest hardfork)
/// @param chain_rules Optional chain rules. If null, uses ChainRules.DEFAULT (latest hardfork)
/// @return Initialized VM instance
/// @throws std.mem.Allocator.Error if allocation fails
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
pub fn init(allocator: std.mem.Allocator, database: @import("state/database_interface.zig").DatabaseInterface, jump_table: ?*const JumpTable, chain_rules: ?*const ChainRules) !Vm {
    Log.debug("VM.init: Initializing VM with allocator and database", .{});

    var state = try EvmState.init(allocator, database);
    errdefer state.deinit();
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var access_list = AccessList.init(allocator);
    errdefer access_list.deinit();

<<<<<<< HEAD
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
=======
    Log.debug("VM.init: VM initialization complete", .{});
    return Vm{
        .allocator = allocator,
        .table = (jump_table orelse &JumpTable.DEFAULT).*,
        .chain_rules = (chain_rules orelse &ChainRules.DEFAULT).*,
        .state = state,
        .context = Context.init(),
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        .access_list = access_list,
    };
}

<<<<<<< HEAD
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
}

// Storage methods
pub fn get_storage(self: *Self, address: Address.Address, slot: u256) !u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    return self.storage.get(key) orelse 0;
}

pub fn set_storage(self: *Self, address: Address.Address, slot: u256, value: u256) !void {
    const key = StorageKey{ .address = address, .slot = slot };
    try self.storage.put(key, value);
}

pub fn get_transient_storage(self: *Self, address: Address.Address, slot: u256) !u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    return self.transient_storage.get(key) orelse 0;
}

pub fn set_transient_storage(self: *Self, address: Address.Address, slot: u256, value: u256) !void {
    const key = StorageKey{ .address = address, .slot = slot };
    try self.transient_storage.put(key, value);
}

pub fn interpret(self: *Self, contract: *Contract, input: []const u8) ![]const u8 {
    return self.interpret_with_context(contract, input, false);
}
=======
/// Initialize VM with a specific hardfork.
/// Convenience function that creates the jump table at runtime.
/// For production use, consider pre-generating the jump table at compile time.
/// @param allocator Memory allocator for VM operations
/// @param database Database interface for state management
/// @param hardfork Ethereum hardfork to configure for
/// @return Initialized VM instance
/// @throws std.mem.Allocator.Error if allocation fails
pub fn init_with_hardfork(allocator: std.mem.Allocator, database: @import("state/database_interface.zig").DatabaseInterface, hardfork: Hardfork) !Vm {
    const table = JumpTable.init_from_hardfork(hardfork);
    const rules = ChainRules.for_hardfork(hardfork);
    return try init(allocator, database, &table, &rules);
}

/// Free all VM resources.
/// Must be called when finished with the VM to prevent memory leaks.
pub fn deinit(self: *Vm) void {
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
pub fn interpret(self: *Vm, contract: *Contract, input: []const u8) ExecutionError.Error!RunResult {
    return try self.interpret_with_context(contract, input, false);
}

/// Execute contract bytecode in read-only mode.
/// Identical to interpret() but prevents any state modifications.
/// Used for view functions and static analysis.
pub fn interpret_static(self: *Vm, contract: *Contract, input: []const u8) ExecutionError.Error!RunResult {
    return try self.interpret_with_context(contract, input, true);
}

/// Core bytecode execution with configurable static context.
/// Runs the main VM loop, executing opcodes sequentially while tracking
/// gas consumption and handling control flow changes.
pub fn interpret_with_context(self: *Vm, contract: *Contract, input: []const u8, is_static: bool) ExecutionError.Error!RunResult {
    @branchHint(.likely);
    Log.debug("VM.interpret_with_context: Starting execution, depth={}, gas={}, static={}", .{ self.depth, contract.gas, is_static });
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

pub fn interpret_static(self: *Self, contract: *Contract, input: []const u8) ![]const u8 {
    return self.interpret_with_context(contract, input, true);
}

pub fn interpret_with_context(self: *Self, contract: *Contract, input: []const u8, is_static: bool) ![]const u8 {
    self.depth += 1;
    defer self.depth -= 1;

<<<<<<< HEAD
    // Save previous read_only state and set new one
    const prev_read_only = self.read_only;
    defer self.read_only = prev_read_only;

    // If entering a static context or already in one, maintain read-only
    self.read_only = self.read_only or is_static;

    var pc: usize = 0;
    var frame = try Frame.init(self.allocator, contract);
    defer frame.deinit();
    // Finalize the root memory now that frame is at its final location
    frame.memory.finalize_root();
    frame.is_static = self.read_only;
    frame.depth = @as(u32, @intCast(self.depth));
    frame.input = input;

    while (true) {
        const opcode = contract.get_op(pc);
        // Cast self and frame to the opaque types expected by execute
        const interpreter_ptr: *Operation.Interpreter = @ptrCast(self);
        const state_ptr: *Operation.State = @ptrCast(&frame);
        // Use jump table's execute method which handles gas consumption
        const result = self.table.execute(pc, interpreter_ptr, state_ptr, opcode) catch |err| {
            // Handle specific errors
            switch (err) {
                ExecutionError.Error.InvalidOpcode => {
                    // INVALID opcode consumes all remaining gas
                    frame.gas_remaining = 0;
                    return &[_]u8{};
                },
                ExecutionError.Error.STOP => {
                    // Normal stop
                    return &[_]u8{};
                },
                else => return err,
            }
        };

        // Update pc based on result - PUSH operations consume more than 1 byte
        pc += result.bytes_consumed;

        // Check if we should stop
        if (result.output.len > 0 or pc >= contract.code_size) {
            return result.output;
=======
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

    const interpreter_ptr = @as(*Operation.Interpreter, @ptrCast(self));
    const state_ptr = @as(*Operation.State, @ptrCast(&frame));

    while (pc < contract.code_size) {
        @branchHint(.likely);
        const opcode = contract.get_op(pc);
        frame.pc = pc;

        const result = self.table.execute(pc, interpreter_ptr, state_ptr, opcode) catch |err| {
            @branchHint(.cold);
            contract.gas = frame.gas_remaining;
            self.return_data = @constCast(frame.return_data.get());

            var output: ?[]const u8 = null;
            const return_data = frame.return_data.get();
            if (return_data.len > 0) {
                output = self.allocator.dupe(u8, return_data) catch {
                    // We are out of memory, which is a critical failure. The safest way to
                    // handle this is to treat it as an OutOfGas error, which consumes
                    // all gas and stops execution.
                    return RunResult.init(initial_gas, 0, .OutOfGas, ExecutionError.Error.OutOfMemory, null);
                };
            }

            return switch (err) {
                ExecutionError.Error.InvalidOpcode => {
                    @branchHint(.cold);
                    // INVALID opcode consumes all remaining gas
                    frame.gas_remaining = 0;
                    contract.gas = 0;
                    return RunResult.init(initial_gas, 0, .Invalid, err, output);
                },
                ExecutionError.Error.STOP => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .Success, null, output);
                },
                ExecutionError.Error.REVERT => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .Revert, err, output);
                },
                ExecutionError.Error.OutOfGas => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .OutOfGas, err, output);
                },
                ExecutionError.Error.InvalidJump,
                ExecutionError.Error.StackUnderflow,
                ExecutionError.Error.StackOverflow,
                ExecutionError.Error.StaticStateChange,
                ExecutionError.Error.WriteProtection,
                ExecutionError.Error.DepthLimit,
                ExecutionError.Error.MaxCodeSizeExceeded,
                ExecutionError.Error.OutOfMemory,
                => {
                    @branchHint(.cold);
                    return RunResult.init(initial_gas, frame.gas_remaining, .Invalid, err, output);
                },
                else => return err, // Unexpected error
            };
        };

        if (frame.pc != pc) {
            @branchHint(.likely);
            pc = frame.pc;
        } else {
            pc += result.bytes_consumed;
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        }
    }

    contract.gas = frame.gas_remaining;
    self.return_data = @constCast(frame.return_data.get());

    const return_data = frame.return_data.get();
    const output: ?[]const u8 = if (return_data.len > 0) try self.allocator.dupe(u8, return_data) else null;

    return RunResult.init(
        initial_gas,
        frame.gas_remaining,
        .Success,
        null,
        output,
    );
}

fn create_contract_internal(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, gas: u64, new_address: Address.Address) (std.mem.Allocator.Error || @import("state/database_interface.zig").DatabaseError || ExecutionError.Error)!CreateResult {
    Log.debug("VM.create_contract_internal: Creating contract from {any} to {any}, value={}, gas={}", .{ creator, new_address, value, gas });
    if (self.state.get_code(new_address).len > 0) {
        @branchHint(.unlikely);
        // Contract already exists at this address - fail
        return CreateResult.initFailure(gas, null);
    }

    const creator_balance = self.state.get_balance(creator);
    if (creator_balance < value) {
        @branchHint(.unlikely);
        // Insufficient balance - fail
        return CreateResult.initFailure(gas, null);
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
            // On revert, consume partial gas
            return CreateResult.initFailure(init_contract.gas, null);
        }

        // Most initcode failures should return 0 address and consume all gas
        return CreateResult.initFailure(0, null);
    };

    const deployment_code = init_result.output orelse &[_]u8{};

    // Check EIP-170 MAX_CODE_SIZE limit on the returned bytecode (24,576 bytes)
    if (deployment_code.len > constants.MAX_CODE_SIZE) {
        return CreateResult.initFailure(0, null);
    }

    const deploy_code_gas = @as(u64, @intCast(deployment_code.len)) * constants.DEPLOY_CODE_GAS_PER_BYTE;

    if (deploy_code_gas > init_result.gas_left) {
        return CreateResult.initFailure(0, null);
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

// Contract creation with CREATE opcode
pub const CreateContractError = std.mem.Allocator.Error || Address.CalculateAddressError || @import("state/database_interface.zig").DatabaseError || ExecutionError.Error;

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
pub fn create_contract(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) CreateContractError!CreateResult {
    const nonce = try self.state.increment_nonce(creator);
    const new_address = try Address.calculate_create_address(self.allocator, creator, nonce);
    return self.create_contract_internal(creator, value, init_code, gas, new_address);
}

pub const CallContractError = std.mem.Allocator.Error;

/// Execute a CALL operation to another contract or precompile.
///
/// This method handles both regular contract calls and precompile calls.
/// For precompiles, it routes to the appropriate precompile implementation.
/// For regular contracts, it currently returns failure (TODO: implement contract execution).
///
/// @param caller The address initiating the call
/// @param to The address being called (may be a precompile)
/// @param value The amount of ETH being transferred (must be 0 for static calls)
/// @param input Input data for the call
/// @param gas Gas limit available for the call
/// @param is_static Whether this is a static call (no state changes allowed)
/// @return CallResult indicating success/failure and return data
pub fn call_contract(self: *Vm, caller: Address.Address, to: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallContractError!CallResult {
    @branchHint(.likely);
    
    Log.debug("VM.call_contract: Call from {any} to {any}, gas={}, static={}", .{ caller, to, gas, is_static });
    
    // Check if this is a precompile call
    if (precompiles.is_precompile(to)) {
        Log.debug("VM.call_contract: Detected precompile call to {any}", .{to});
        return self.execute_precompile_call(to, input, gas, is_static);
    }
    
    // Regular contract call - currently not implemented
    // TODO: Implement value transfer, gas calculation, recursive execution, and return data handling
    Log.debug("VM.call_contract: Regular contract call not implemented yet", .{});
    _ = value;
    
    return CallResult{ .success = false, .gas_left = gas, .output = null };
}

/// Execute a precompile call
///
/// This method handles the execution of precompiled contracts. It performs
/// the following steps:
/// 1. Check if the precompile is available in the current hardfork
/// 2. Validate that value transfers are zero (precompiles don't accept ETH)
/// 3. Estimate output buffer size and allocate memory
/// 4. Execute the precompile
/// 5. Handle success/failure and return appropriate CallResult
///
/// @param address The precompile address
/// @param input Input data for the precompile
/// @param gas Gas limit available for execution
/// @param is_static Whether this is a static call (doesn't affect precompiles)
/// @return CallResult with success/failure, gas usage, and output data
fn execute_precompile_call(self: *Vm, address: Address.Address, input: []const u8, gas: u64, is_static: bool) CallContractError!CallResult {
    _ = is_static; // Precompiles are inherently stateless, so static flag doesn't matter
    
    Log.debug("VM.execute_precompile_call: Executing precompile at {any}, input_size={}, gas={}", .{ address, input.len, gas });
    
    // Get current chain rules
    const chain_rules = self.chain_rules;
    
    // Check if this precompile is available with current chain rules
    if (!precompiles.is_available(address, chain_rules)) {
        Log.debug("VM.execute_precompile_call: Precompile not available with current chain rules", .{});
        return CallResult{ .success = false, .gas_left = gas, .output = null };
    }
    
    // Estimate required output buffer size
    const output_size = precompiles.get_output_size(address, input.len, chain_rules) catch |err| {
        Log.debug("VM.execute_precompile_call: Failed to get output size: {}", .{err});
        return CallResult{ .success = false, .gas_left = gas, .output = null };
    };
    
    // Allocate output buffer
    const output_buffer = self.allocator.alloc(u8, output_size) catch |err| {
        Log.debug("VM.execute_precompile_call: Failed to allocate output buffer: {}", .{err});
        return error.OutOfMemory;
    };
    
    // Execute the precompile
    const result = precompiles.execute_precompile(address, input, output_buffer, gas, chain_rules);
    
    if (result.is_success()) {
        const gas_used = result.get_gas_used();
        const actual_output_size = result.get_output_size();
        
        Log.debug("VM.execute_precompile_call: Precompile succeeded, gas_used={}, output_size={}", .{ gas_used, actual_output_size });
        
        // Resize buffer to actual output size if needed
        if (actual_output_size < output_size) {
            const resized_output = self.allocator.realloc(output_buffer, actual_output_size) catch output_buffer;
            return CallResult{ 
                .success = true, 
                .gas_left = gas - gas_used, 
                .output = resized_output[0..actual_output_size] 
            };
        }
        
        return CallResult{ 
            .success = true, 
            .gas_left = gas - gas_used, 
            .output = output_buffer[0..actual_output_size] 
        };
    } else {
        // Free the allocated buffer on failure
        self.allocator.free(output_buffer);
        
        if (result.get_error()) |err| {
            Log.debug("VM.execute_precompile_call: Precompile failed with error: {any}", .{err});
        }
        
        return CallResult{ .success = false, .gas_left = gas, .output = null };
    }
}

pub const ConsumeGasError = ExecutionError.Error;

pub const Create2ContractError = std.mem.Allocator.Error || Address.CalculateCreate2AddressError || @import("state/database_interface.zig").DatabaseError || ExecutionError.Error;

/// Create a new contract using CREATE2 opcode semantics.
///
/// Calculates a deterministic address using keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:],
/// transfers value if specified, executes the initialization code, and deploys
/// the resulting bytecode. Unlike CREATE, the address is predictable before deployment.
pub fn create2_contract(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractError!CreateResult {
    // Calculate the new contract address using CREATE2 formula:
    // address = keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:]
    const new_address = try Address.calculate_create2_address(self.allocator, creator, salt, init_code);
    return self.create_contract_internal(creator, value, init_code, gas, new_address);
}

pub const CallcodeContractError = std.mem.Allocator.Error;

// TODO
/// Execute a CALLCODE operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target code in current contract's context while preserving caller information.
pub fn callcode_contract(self: *Vm, current: Address.Address, code_address: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallcodeContractError!CallResult {
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
pub fn delegatecall_contract(self: *Vm, current: Address.Address, code_address: Address.Address, input: []const u8, gas: u64, is_static: bool) DelegatecallContractError!CallResult {
    _ = self;
    Log.debug("VM.delegatecall_contract: DELEGATECALL from {any} to {any}, gas={}, static={}", .{ current, code_address, gas, is_static });
    
    // DELEGATECALL not implemented yet
    Log.debug("VM.delegatecall_contract: DELEGATECALL not implemented yet", .{});
    _ = input;
    
    return CallResult{ .success = false, .gas_left = gas, .output = null };
}

pub const StaticcallContractError = std.mem.Allocator.Error;

/// Execute a STATICCALL operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target contract in guaranteed read-only mode.
pub fn staticcall_contract(self: *Vm, caller: Address.Address, to: Address.Address, input: []const u8, gas: u64) StaticcallContractError!CallResult {
    _ = self;
    Log.debug("VM.staticcall_contract: STATICCALL from {any} to {any}, gas={}", .{ caller, to, gas });
    
    // STATICCALL not implemented yet
    Log.debug("VM.staticcall_contract: STATICCALL not implemented yet", .{});
    _ = input;
    
    return CallResult{ .success = false, .gas_left = gas, .output = null };
}

pub const EmitLogError = std.mem.Allocator.Error;

/// Emit an event log (LOG0-LOG4 opcodes).
/// Records an event that will be included in the transaction receipt.
pub fn emit_log(self: *Vm, address: Address.Address, topics: []const u256, data: []const u8) EmitLogError!void {
    try self.state.emit_log(address, topics, data);
}

pub const InitTransactionAccessListError = AccessList.InitTransactionError;

/// Initialize the access list for a new transaction (EIP-2929).
/// Must be called at the start of each transaction to set up warm/cold access tracking.
pub fn init_transaction_access_list(self: *Vm, to: ?Address.Address) InitTransactionAccessListError!void {
    try self.access_list.init_transaction(self.context.tx_origin, self.context.block_coinbase, to);
}

pub const PreWarmAddressesError = AccessList.PreWarmAddressesError;

/// Mark addresses as warm to reduce gas costs for subsequent access.
/// Used with EIP-2930 access lists to pre-warm addresses in transactions.
/// Time complexity: O(n) where n is the number of addresses.
pub fn pre_warm_addresses(self: *Vm, addresses: []const Address.Address) PreWarmAddressesError!void {
    try self.access_list.pre_warm_addresses(addresses);
}

pub const PreWarmStorageSlotsError = AccessList.PreWarmStorageSlotsError;

/// Mark storage slots as warm to reduce gas costs for subsequent access.
/// Used with EIP-2930 access lists in transactions.
pub fn pre_warm_storage_slots(self: *Vm, address: Address.Address, slots: []const u256) PreWarmStorageSlotsError!void {
    try self.access_list.pre_warm_storage_slots(address, slots);
}

pub const GetAddressAccessCostError = AccessList.AccessAddressError;

/// Get the gas cost for accessing an address and mark it as warm.
/// Returns higher gas for first access, lower gas for subsequent access per EIP-2929.
/// Time complexity: O(1) with hash table lookup.
pub fn get_address_access_cost(self: *Vm, address: Address.Address) GetAddressAccessCostError!u64 {
    return self.access_list.access_address(address);
}

pub const GetStorageAccessCostError = AccessList.AccessStorageSlotError;

/// Get the gas cost for accessing a storage slot and mark it as warm.
/// Returns 2100 gas for cold access, 100 gas for warm access (Berlin hardfork).
pub fn get_storage_access_cost(self: *Vm, address: Address.Address, slot: u256) GetStorageAccessCostError!u64 {
    return self.access_list.access_storage_slot(address, slot);
}

pub const GetCallCostError = AccessList.GetCallCostError;

/// Get the additional gas cost for a CALL operation based on address warmth.
/// Returns extra gas required for calls to cold addresses (EIP-2929).
pub fn get_call_cost(self: *Vm, address: Address.Address) GetCallCostError!u64 {
    return self.access_list.get_call_cost(address);
}

pub const ValidateStaticContextError = error{WriteProtection};

/// Validate that state modifications are allowed in the current context.
/// Returns WriteProtection error if called within a static (read-only) context.
pub fn validate_static_context(self: *const Vm) ValidateStaticContextError!void {
    if (self.read_only) return error.WriteProtection;
}

pub const SetStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error || @import("state/database_interface.zig").DatabaseError;

/// Set a storage value with static context protection.
/// Used by the SSTORE opcode to prevent storage modifications in static calls.
pub fn set_storage_protected(self: *Vm, address: Address.Address, slot: u256, value: u256) SetStorageProtectedError!void {
    try self.validate_static_context();
    try self.state.set_storage(address, slot, value);
}

pub const SetTransientStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set a transient storage value with static context protection.
/// Transient storage (EIP-1153) is cleared at the end of each transaction.
pub fn set_transient_storage_protected(self: *Vm, address: Address.Address, slot: u256, value: u256) SetTransientStorageProtectedError!void {
    try self.validate_static_context();
    try self.state.set_transient_storage(address, slot, value);
}

pub const SetBalanceProtectedError = ValidateStaticContextError || std.mem.Allocator.Error || @import("state/database_interface.zig").DatabaseError;

/// Set an account balance with static context protection.
/// Prevents balance modifications during static calls.
pub fn set_balance_protected(self: *Vm, address: Address.Address, balance: u256) SetBalanceProtectedError!void {
    try self.validate_static_context();
    try self.state.set_balance(address, balance);
}

pub const SetCodeProtectedError = ValidateStaticContextError || std.mem.Allocator.Error || @import("state/database_interface.zig").DatabaseError;

/// Deploy contract code with static context protection.
/// Prevents code deployment during static calls.
pub fn set_code_protected(self: *Vm, address: Address.Address, code: []const u8) SetCodeProtectedError!void {
    try self.validate_static_context();
    try self.state.set_code(address, code);
}

pub const EmitLogProtectedError = ValidateStaticContextError || EmitLogError;

/// Emit a log with static context protection.
/// Prevents log emission during static calls as logs modify the transaction state.
pub fn emit_log_protected(self: *Vm, address: Address.Address, topics: []const u256, data: []const u8) EmitLogProtectedError!void {
    try self.validate_static_context();
    try self.emit_log(address, topics, data);
}

pub const CreateContractProtectedError = ValidateStaticContextError || CreateContractError;

/// Create a contract with static context protection.
/// Prevents contract creation during static calls.
pub fn create_contract_protected(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) CreateContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create_contract(creator, value, init_code, gas);
}

pub const Create2ContractProtectedError = ValidateStaticContextError || Create2ContractError;

/// Create a contract with CREATE2 and static context protection.
/// Prevents contract creation during static calls.
pub fn create2_contract_protected(self: *Vm, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create2_contract(creator, value, init_code, salt, gas);
}

pub const ValidateValueTransferError = error{WriteProtection};

/// Validate that value transfer is allowed in the current context.
/// Static calls cannot transfer value (msg.value must be 0).
pub fn validate_value_transfer(self: *const Vm, value: u256) ValidateValueTransferError!void {
    if (self.read_only and value != 0) return error.WriteProtection;
}

pub const SelfdestructProtectedError = ValidateStaticContextError;

/// Execute SELFDESTRUCT with static context protection.
/// NOT FULLY IMPLEMENTED - currently only validates static context.
/// TODO: Transfer remaining balance to beneficiary and mark contract for deletion.
pub fn selfdestruct_protected(self: *Vm, contract: Address.Address, beneficiary: Address.Address) SelfdestructProtectedError!void {
    _ = contract;
    _ = beneficiary;
    try self.validate_static_context();
}

// Balance methods
pub fn get_balance(self: *Self, address: Address.Address) !u256 {
    return self.balances.get(address) orelse 0;
}

pub fn set_balance(self: *Self, address: Address.Address, balance: u256) !void {
    try self.balances.put(address, balance);
}

// Code methods
pub fn get_code(self: *Self, address: Address.Address) ![]const u8 {
    return self.code.get(address) orelse &[_]u8{};
}

pub fn set_code(self: *Self, address: Address.Address, code: []const u8) !void {
    try self.code.put(address, code);
}

// Nonce methods
pub fn get_nonce(self: *Self, address: Address.Address) !u64 {
    return self.nonces.get(address) orelse 0;
}

pub fn increment_nonce(self: *Self, address: Address.Address) !u64 {
    const current_nonce = try self.get_nonce(address);
    const new_nonce = current_nonce + 1;
    try self.nonces.put(address, new_nonce);
    return current_nonce; // Return the nonce that was used
}

// Contract creation result
pub const CreateResult = struct {
    success: bool,
    address: Address.Address,
    gas_left: u64,
    output: ?[]const u8,
};

// Contract call result
pub const CallResult = struct {
    success: bool,
    gas_left: u64,
    output: ?[]const u8,
};

// Contract creation with CREATE opcode
pub fn create_contract(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) !CreateResult {
    // Check if we have a mocked create result for testing
    if (self.create_result) |result| {
        return result;
    }

    // Get and increment nonce for the creator
    const nonce = try self.increment_nonce(creator);

    // Calculate the new contract address using CREATE formula:
    // address = keccak256(rlp([sender, nonce]))[12:]
    const new_address = try self.calculate_create_address(creator, nonce);
    std.debug.print("CREATE: Calculated address: 0x{x} for creator: 0x{x}, nonce: {d}\n", .{ Address.to_u256(new_address), Address.to_u256(creator), nonce });

    // Log init code info
    _ = init_code.len; // Use init_code to avoid unused parameter warning

    // Check if account already exists at this address
    const existing_code = try self.get_code(new_address);
    if (existing_code.len > 0) {
        // Contract already exists at this address
        return CreateResult{
            .success = false,
            .address = Address.ZERO_ADDRESS,
            .gas_left = gas,
            .output = null,
        };
    }

    // Check if creator has sufficient balance for value transfer
    const creator_balance = try self.get_balance(creator);
    std.debug.print("CREATE: Checking balance. Creator: 0x{x}, balance: {d}, required value: {d}\n", .{ Address.to_u256(creator), creator_balance, value });
    if (creator_balance < value) {
        std.debug.print("CREATE: Insufficient balance. Returning failure with zero address\n", .{});
        return CreateResult{
            .success = false,
            .address = Address.ZERO_ADDRESS,
            .gas_left = gas,
            .output = null,
        };
    }

    // Transfer value from creator to new contract
    if (value > 0) {
        try self.set_balance(creator, creator_balance - value);
        try self.set_balance(new_address, value);
    }

    // Execute the init code to get the deployed bytecode
    if (init_code.len == 0) {
        // No init code means empty contract
        std.debug.print("CREATE: Empty init code, creating empty contract\n", .{});
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
        creator,      // caller (who is creating this contract)
        new_address,  // address (the new contract's address)
        value,        // value being sent to this contract
        gas,          // gas available for init code execution
        init_code,    // the init code to execute
        code_hash,    // hash of the init code
        &[_]u8{},     // no input data for init code
        false,        // not static
    );
    defer init_contract.deinit(null);
    
    std.debug.print("CREATE: Executing init code with gas: {d}\n", .{gas});
    
    // Execute the init code - this should return the deployment bytecode
    const init_result = self.interpret_with_context(&init_contract, &[_]u8{}, false) catch |err| {
        std.debug.print("CREATE: Init code execution failed with error: {any}\n", .{err});
        
        // Most initcode failures should return 0 address and consume all gas
        return CreateResult{
            .success = false,
            .address = Address.ZERO_ADDRESS,
            .gas_left = 0,  // Consume all gas on failure
            .output = null,
        };
    };
    
    std.debug.print("CREATE: Init code execution completed, returned bytecode length: {d}\n", .{init_result.len});
    
    // Check EIP-170 MAX_CODE_SIZE limit on the returned bytecode (24,576 bytes)
    const MAX_CODE_SIZE = 24576;
    if (init_result.len > MAX_CODE_SIZE) {
        std.debug.print("CREATE: Deployment bytecode too large: {d} > {d}\n", .{init_result.len, MAX_CODE_SIZE});
        return CreateResult{
            .success = false,
            .address = Address.ZERO_ADDRESS,
            .gas_left = 0,  // Consume all gas on failure
            .output = null,
        };
    }
    
    // Charge gas for deployed code size (200 gas per byte)
    const DEPLOY_CODE_GAS_PER_BYTE = 200;
    const deploy_code_gas = @as(u64, @intCast(init_result.len)) * DEPLOY_CODE_GAS_PER_BYTE;
    
    // Check if we have enough gas for deployment
    if (deploy_code_gas > gas) {
        std.debug.print("CREATE: Insufficient gas for code deployment: required {d}, available {d}\n", .{deploy_code_gas, gas});
        return CreateResult{
            .success = false,
            .address = Address.ZERO_ADDRESS,
            .gas_left = 0,
            .output = null,
        };
    }
    
    // Store the deployed bytecode at the new contract address
    try self.set_code(new_address, init_result);
    std.debug.print("CREATE: Stored bytecode of length {d} at address: 0x{x}\n", .{init_result.len, Address.to_u256(new_address)});
    
    const gas_left = gas - deploy_code_gas;
    
    return CreateResult{
        .success = true,
        .address = new_address,
        .gas_left = gas_left,
        .output = init_result,
    };
}

// Placeholder contract call - to be implemented properly later
pub fn call_contract(self: *Self, caller: Address.Address, to: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) !CallResult {
    _ = caller;
    _ = to;
    _ = value;
    _ = input;
    _ = gas;
    _ = is_static;

    // Check if we have a mocked call result for testing
    if (self.call_result) |result| {
        return result;
    }

    // For now, return a failed call
    return CallResult{
        .success = false,
        .gas_left = 0,
        .output = null,
    };
}

// Gas consumption method for opcodes
pub fn consume_gas(self: *Self, amount: u64) !void {
    _ = self;
    _ = amount;
    // Gas tracking is implemented at the Frame level (frame.consume_gas)
    // This method is kept for future VM-level gas accounting
}

// CREATE2 specific method
pub fn create2_contract(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) !CreateResult {
    // Check if we have a mocked create result for testing
    if (self.create_result) |result| {
        return result;
    }

    // Calculate the new contract address using CREATE2 formula:
    // address = keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:]
    const new_address = try self.calculate_create2_address(creator, salt, init_code);

    // Check if account already exists at this address
    const existing_code = try self.get_code(new_address);
    if (existing_code.len > 0) {
        // Contract already exists at this address
        return CreateResult{
            .success = false,
            .address = Address.ZERO_ADDRESS,
            .gas_left = gas,
            .output = null,
        };
    }

    // Check if creator has sufficient balance for value transfer
    const creator_balance = try self.get_balance(creator);
    if (creator_balance < value) {
        std.debug.print("CREATE2: Insufficient balance. Creator balance: {d}, required value: {d}\n", .{ creator_balance, value });
        return CreateResult{
            .success = false,
            .address = Address.ZERO_ADDRESS,
            .gas_left = gas,
            .output = null,
        };
    }

    // Transfer value from creator to new contract
    if (value > 0) {
        try self.set_balance(creator, creator_balance - value);
        try self.set_balance(new_address, value);
    }

    // Execute the init code to get the deployed bytecode
    if (init_code.len == 0) {
        // No init code means empty contract
        std.debug.print("CREATE2: Empty init code, creating empty contract\n", .{});
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
        creator,      // caller (who is creating this contract)
        new_address,  // address (the new contract's address)
        value,        // value being sent to this contract
        gas,          // gas available for init code execution
        init_code,    // the init code to execute
        code_hash,    // hash of the init code
        &[_]u8{},     // no input data for init code
        false,        // not static
    );
    defer init_contract.deinit(null);
    
    std.debug.print("CREATE2: Executing init code with gas: {d}\n", .{gas});
    
    // Execute the init code - this should return the deployment bytecode
    const init_result = self.interpret_with_context(&init_contract, &[_]u8{}, false) catch |err| {
        std.debug.print("CREATE2: Init code execution failed with error: {any}\n", .{err});
        
        // Most initcode failures should return 0 address and consume all gas
        return CreateResult{
            .success = false,
            .address = Address.ZERO_ADDRESS,
            .gas_left = 0,  // Consume all gas on failure
            .output = null,
        };
    };
    
    std.debug.print("CREATE2: Init code execution completed, returned bytecode length: {d}\n", .{init_result.len});
    
    // Check EIP-170 MAX_CODE_SIZE limit on the returned bytecode (24,576 bytes)
    const MAX_CODE_SIZE = 24576;
    if (init_result.len > MAX_CODE_SIZE) {
        std.debug.print("CREATE2: Deployment bytecode too large: {d} > {d}\n", .{init_result.len, MAX_CODE_SIZE});
        return CreateResult{
            .success = false,
            .address = Address.ZERO_ADDRESS,
            .gas_left = 0,  // Consume all gas on failure
            .output = null,
        };
    }
    
    // Charge gas for deployed code size (200 gas per byte)
    const DEPLOY_CODE_GAS_PER_BYTE = 200;
    const deploy_code_gas = @as(u64, @intCast(init_result.len)) * DEPLOY_CODE_GAS_PER_BYTE;
    
    // Check if we have enough gas for deployment
    if (deploy_code_gas > gas) {
        std.debug.print("CREATE2: Insufficient gas for code deployment: required {d}, available {d}\n", .{deploy_code_gas, gas});
        return CreateResult{
            .success = false,
            .address = Address.ZERO_ADDRESS,
            .gas_left = 0,
            .output = null,
        };
    }
    
    // Store the deployed bytecode at the new contract address
    try self.set_code(new_address, init_result);
    std.debug.print("CREATE2: Stored bytecode of length {d} at address: 0x{x}\n", .{init_result.len, Address.to_u256(new_address)});
    
    const gas_left = gas - deploy_code_gas;
    
    return CreateResult{
        .success = true,
        .address = new_address,
        .gas_left = gas_left,
        .output = init_result,
    };
}

// CALLCODE specific method - executes code of 'to' in the context of the current contract
pub fn callcode_contract(self: *Self, current: Address.Address, code_address: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) !CallResult {
    _ = current;
    _ = code_address;
    _ = value;
    _ = input;
    _ = gas;
    _ = is_static;

    // Check if we have a mocked call result for testing
    if (self.call_result) |result| {
        return result;
    }

    // For now, return a failed call
    return CallResult{
        .success = false,
        .gas_left = 0,
        .output = null,
    };
}

// DELEGATECALL specific method - executes code of 'to' with current contract's storage and sender/value
pub fn delegatecall_contract(self: *Self, current: Address.Address, code_address: Address.Address, input: []const u8, gas: u64, is_static: bool) !CallResult {
    _ = current;
    _ = code_address;
    _ = input;
    _ = gas;
    _ = is_static;

    // Check if we have a mocked call result for testing
    if (self.call_result) |result| {
        return result;
    }

    // For now, return a failed call
    return CallResult{
        .success = false,
        .gas_left = 0,
        .output = null,
    };
}

// STATICCALL specific method - guaranteed read-only call
pub fn staticcall_contract(self: *Self, caller: Address.Address, to: Address.Address, input: []const u8, gas: u64) !CallResult {
    _ = caller;
    _ = to;
    _ = input;
    _ = gas;

    // Check if we have a mocked call result for testing
    if (self.call_result) |result| {
        return result;
    }

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
pub fn emit_log(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) !void {
    // Clone the data to ensure it persists
    const data_copy = try self.allocator.alloc(u8, data.len);
    @memcpy(data_copy, data);

    // Clone the topics to ensure they persist
    const topics_copy = try self.allocator.alloc(u256, topics.len);
    @memcpy(topics_copy, topics);

    const log = Log{
        .address = address,
        .topics = topics_copy,
        .data = data_copy,
    };

    try self.logs.append(log);
}

// EIP-2929: Initialize transaction access list
pub fn init_transaction_access_list(self: *Self, to: ?Address.Address) !void {
    try self.access_list.init_transaction(self.tx_origin, self.block_coinbase, to);
}

// EIP-2929: Pre-warm addresses from EIP-2930 access list
pub fn pre_warm_addresses(self: *Self, addresses: []const Address.Address) !void {
    try self.access_list.pre_warm_addresses(addresses);
}

// EIP-2929: Pre-warm storage slots from EIP-2930 access list
pub fn pre_warm_storage_slots(self: *Self, address: Address.Address, slots: []const u256) !void {
    try self.access_list.pre_warm_storage_slots(address, slots);
}

// EIP-2929: Get gas cost for accessing an address
pub fn get_address_access_cost(self: *Self, address: Address.Address) !u64 {
    return self.access_list.access_address(address);
}

// EIP-2929: Get gas cost for accessing a storage slot
pub fn get_storage_access_cost(self: *Self, address: Address.Address, slot: u256) !u64 {
    return self.access_list.access_storage_slot(address, slot);
}

// EIP-2929: Get extra gas cost for CALL to an address
pub fn get_call_cost(self: *Self, address: Address.Address) !u64 {
    return self.access_list.get_call_cost(address);
}

// Static call protection validation
pub fn validate_static_context(self: *const Self) !void {
    if (self.read_only) {
        return error.WriteProtection;
    }
}

// State modification methods with static protection
pub fn set_storage_protected(self: *Self, address: Address.Address, slot: u256, value: u256) !void {
    try self.validate_static_context();
    try self.set_storage(address, slot, value);
}

pub fn set_transient_storage_protected(self: *Self, address: Address.Address, slot: u256, value: u256) !void {
    try self.validate_static_context();
    try self.set_transient_storage(address, slot, value);
}

pub fn set_balance_protected(self: *Self, address: Address.Address, balance: u256) !void {
    try self.validate_static_context();
    try self.set_balance(address, balance);
}

pub fn set_code_protected(self: *Self, address: Address.Address, code: []const u8) !void {
    try self.validate_static_context();
    try self.set_code(address, code);
}

pub fn emit_log_protected(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) !void {
    try self.validate_static_context();
    try self.emit_log(address, topics, data);
}

// Contract creation with static protection
pub fn create_contract_protected(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) !CreateResult {
    try self.validate_static_context();
    return self.create_contract(creator, value, init_code, gas);
}

pub fn create2_contract_protected(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) !CreateResult {
    try self.validate_static_context();
    return self.create2_contract(creator, value, init_code, salt, gas);
}

// Value transfer validation
pub fn validate_value_transfer(self: *const Self, value: u256) !void {
    if (self.read_only and value != 0) {
        return error.WriteProtection;
    }
}

// SELFDESTRUCT with static protection
pub fn selfdestruct_protected(self: *Self, contract: Address.Address, beneficiary: Address.Address) !void {
    try self.validate_static_context();
    // Implementation would transfer balance and mark contract for deletion
    _ = contract;
    _ = beneficiary;
    // Selfdestruct scheduling and execution happens at transaction level
}

// Run result structure
pub const RunResult = struct {
    status: enum { Success, Revert, Invalid, OutOfGas },
    gas_left: u64,
    gas_used: u64,
    output: ?[]const u8,
};

// Simple bytecode execution for testing
pub fn run(self: *Self, bytecode: []const u8, address: Address.Address, gas: u64, input: ?[]const u8) !RunResult {
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
    defer contract.deinit(null);

    // Set the code for the contract address
    try self.set_code(address, bytecode);

    // Create a frame for execution
    var frame = try Frame.init(self.allocator, &contract);
    defer frame.deinit();
    // Finalize the root memory now that frame is at its final location
    frame.memory.finalize_root();

    frame.gas_remaining = gas;
    frame.input = input orelse &[_]u8{};
    frame.depth = 0;
    frame.is_static = false;

    // Save initial gas for tracking
    const initial_gas = gas;

    // Execution loop
    var pc: usize = 0;
    while (pc < bytecode.len) {
        const opcode = bytecode[pc];

        // Update frame PC to match current PC
        frame.program_counter = pc;

        // Cast self and frame to the opaque types expected by execute
        const interpreter_ptr: *Operation.Interpreter = @ptrCast(self);
        const state_ptr: *Operation.State = @ptrCast(&frame);

        // Execute opcode through jump table
        const result = self.table.execute(pc, interpreter_ptr, state_ptr, opcode) catch |err| {
            // Handle execution errors
            switch (err) {
                ExecutionError.Error.STOP => {
                    // Save top stack value for testing
                    if (frame.stack.size > 0) {
                        if (frame.stack.peek()) |val| {
                            self.last_stack_value = val.*;
                        } else |_| {
                            self.last_stack_value = null;
                        }
                    }
                    return RunResult{
                        .status = .Success,
                        .gas_left = frame.gas_remaining,
                        .gas_used = initial_gas - frame.gas_remaining,
                        .output = if (frame.return_data_buffer.len > 0)
                            try self.allocator.dupe(u8, frame.return_data_buffer)
                        else
                            null,
                    };
                },
                ExecutionError.Error.REVERT => {
                    return RunResult{
                        .status = .Revert,
                        .gas_left = frame.gas_remaining,
                        .gas_used = initial_gas - frame.gas_remaining,
                        .output = if (frame.return_data_buffer.len > 0)
                            try self.allocator.dupe(u8, frame.return_data_buffer)
                        else
                            null,
                    };
                },
                ExecutionError.Error.InvalidJump => {
                    return RunResult{
                        .status = .Invalid,
                        .gas_left = 0,
                        .gas_used = initial_gas,
                        .output = null,
                    };
                },
                ExecutionError.Error.InvalidOpcode => {
                    // INVALID opcode consumes all remaining gas
                    frame.gas_remaining = 0;
                    return RunResult{
                        .status = .Invalid,
                        .gas_left = 0,
                        .gas_used = initial_gas,
                        .output = null,
                    };
                },
                ExecutionError.Error.OutOfGas => {
                    return RunResult{
                        .status = .OutOfGas,
                        .gas_left = 0,
                        .gas_used = initial_gas,
                        .output = null,
                    };
                },
                ExecutionError.Error.StackUnderflow => {
                    return RunResult{
                        .status = .Invalid,
                        .gas_left = 0,
                        .gas_used = initial_gas,
                        .output = null,
                    };
                },
                else => return err,
            }
        };

        // Check if PC was modified by JUMP/JUMPI opcodes
        if (frame.program_counter != pc) {
            pc = frame.program_counter;
        } else {
            // Update PC based on bytes consumed (for PUSH operations)
            pc += result.bytes_consumed;
        }
    }

    // If we reach end of bytecode without explicit stop/return
    // Save top stack value for testing
    if (frame.stack.size > 0) {
        if (frame.stack.peek()) |val| {
            self.last_stack_value = val.*;
        } else |_| {
            self.last_stack_value = null;
        }
    }
    return RunResult{
        .status = .Success,
        .gas_left = frame.gas_remaining,
        .gas_used = initial_gas - frame.gas_remaining,
        .output = null,
    };
}

// Calculate address for CREATE opcode
fn calculate_create_address(self: *Self, creator: Address.Address, nonce: u64) !Address.Address {
    // Convert nonce to bytes, stripping leading zeros
    var nonce_bytes: [8]u8 = undefined;
    std.mem.writeInt(u64, &nonce_bytes, nonce, .big);

    // Find first non-zero byte
    var nonce_start: usize = 0;
    for (nonce_bytes) |byte| {
        if (byte != 0) break;
        nonce_start += 1;
    }

    // If nonce is 0, use empty slice
    const nonce_slice = if (nonce == 0) &[_]u8{} else nonce_bytes[nonce_start..];

    // Create a list for RLP encoding [creator_address, nonce]
    var list = std.ArrayList([]const u8).init(self.allocator);
    defer list.deinit();

    try list.append(&creator);
    try list.append(nonce_slice);

    // RLP encode the list
    const encoded = try rlp.encode(self.allocator, list.items);
    defer self.allocator.free(encoded);

    // Hash the RLP encoded data
    var hash: [32]u8 = undefined;
    Keccak256.hash(encoded, &hash, .{});

    // Take last 20 bytes as address
    var address: Address.Address = undefined;
    @memcpy(&address, hash[12..32]);

    return address;
}

// Calculate address for CREATE2 opcode
fn calculate_create2_address(self: *Self, creator: Address.Address, salt: u256, init_code: []const u8) !Address.Address {
    // First hash the init code
    var code_hash: [32]u8 = undefined;
    Keccak256.hash(init_code, &code_hash, .{});

    // Create the data to hash: 0xff ++ creator ++ salt ++ keccak256(init_code)
    var data = std.ArrayList(u8).init(self.allocator);
    defer data.deinit();

    // Add 0xff prefix
    try data.append(0xff);

    // Add creator address (20 bytes)
    try data.appendSlice(&creator);

    // Add salt (32 bytes, big-endian)
    var salt_bytes: [32]u8 = undefined;
    var temp_salt = salt;
    for (0..32) |i| {
        salt_bytes[31 - i] = @intCast(temp_salt & 0xFF);
        temp_salt >>= 8;
    }
    try data.appendSlice(&salt_bytes);

    // Add init code hash (32 bytes)
    try data.appendSlice(&code_hash);

    // Hash the combined data
    var hash: [32]u8 = undefined;
    Keccak256.hash(data.items, &hash, .{});

    // Take last 20 bytes as address
    var address: Address.Address = undefined;
    @memcpy(&address, hash[12..32]);

    return address;
}
