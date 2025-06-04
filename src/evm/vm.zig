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

// Log struct for EVM event logs (LOG0-LOG4 opcodes)
pub const Log = struct {
    address: Address.Address,
    topics: []const u256,
    data: []const u8,
};

const Self = @This();

allocator: std.mem.Allocator,

return_data: []u8 = &[_]u8{},

stack: Stack = .{},
table: JumpTable,
chain_rules: ChainRules,

depth: u16 = 0,

read_only: bool = false,

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

pub fn interpret_static(self: *Self, contract: *Contract, input: []const u8) ![]const u8 {
    return self.interpret_with_context(contract, input, true);
}

pub fn interpret_with_context(self: *Self, contract: *Contract, input: []const u8, is_static: bool) ![]const u8 {
    self.depth += 1;
    defer self.depth -= 1;

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
        }
    }
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
    std.debug.print("CREATE: Calculated address: 0x{x} for creator: 0x{x}, nonce: {}\n", .{ Address.to_u256(new_address), Address.to_u256(creator), nonce });

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
    std.debug.print("CREATE: Checking balance. Creator: 0x{x}, balance: {}, required value: {}\n", .{ Address.to_u256(creator), creator_balance, value });
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
    // For now, we'll simulate successful execution and return the address
    // TODO: Actually execute the init code in a new frame

    // Simulate successful deployment (temporary)
    // In a real implementation, we would:
    // 1. Create a new frame with the init code
    // 2. Execute the init code
    // 3. Get the return data (deployed bytecode)
    // 4. Store the deployed bytecode at the new address

    // For testing purposes, assume success and consume some gas
    const gas_used = @min(gas / 2, 50000); // Simulate gas usage

    return CreateResult{
        .success = true,
        .address = new_address,
        .gas_left = gas - gas_used,
        .output = null,
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
        std.debug.print("CREATE2: Insufficient balance. Creator balance: {}, required value: {}\n", .{ creator_balance, value });
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
    // For now, we'll simulate successful execution and return the address
    // TODO: Actually execute the init code in a new frame

    // Simulate successful deployment (temporary)
    // In a real implementation, we would:
    // 1. Create a new frame with the init code
    // 2. Execute the init code
    // 3. Get the return data (deployed bytecode)
    // 4. Store the deployed bytecode at the new address

    // For testing purposes, assume success and consume some gas
    const gas_used = @min(gas / 2, 50000); // Simulate gas usage

    return CreateResult{
        .success = true,
        .address = new_address,
        .gas_left = gas - gas_used,
        .output = null,
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
        frame.pc = pc;

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
        if (frame.pc != pc) {
            pc = frame.pc;
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
