const std = @import("std");
const Contract = @import("contract.zig");
const Stack = @import("stack.zig");
const Memory = @import("memory.zig");
const JumpTable = @import("jump_table.zig");
const Frame = @import("frame.zig");
const Operation = @import("operation.zig");
const Address = @import("Address");
const StoragePool = @import("storage_pool.zig");

// Import Log struct
const log_module = @import("opcodes/log.zig");
pub const Log = log_module.Log;

const Self = @This();

allocator: std.mem.Allocator,

return_data: []u8 = &[_]u8{},

stack: Stack = .{},
memory: Memory,
table: JumpTable,

depth: u16 = 0,

read_only: bool = false,

// Storage and state management
storage: std.AutoHashMap(StorageKey, u256),
balances: std.AutoHashMap(Address.Address, u256),
code: std.AutoHashMap(Address.Address, []const u8),
transient_storage: std.AutoHashMap(StorageKey, u256),
logs: std.ArrayList(Log),

// EIP-2929: Address access tracking (cold/warm)
address_access: std.AutoHashMap(Address.Address, bool),

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

pub const StorageKey = struct {
    address: Address.Address,
    slot: u256,
};

pub fn init(allocator: std.mem.Allocator) !Self {
    var memory = try Memory.init_default(allocator);
    memory.finalize_root();
    
    return Self{ 
        .allocator = allocator, 
        .memory = memory,
        .table = JumpTable.init(),
        .storage = std.AutoHashMap(StorageKey, u256).init(allocator),
        .balances = std.AutoHashMap(Address.Address, u256).init(allocator),
        .code = std.AutoHashMap(Address.Address, []const u8).init(allocator),
        .transient_storage = std.AutoHashMap(StorageKey, u256).init(allocator),
        .logs = std.ArrayList(Log).init(allocator),
        .address_access = std.AutoHashMap(Address.Address, bool).init(allocator),
    };
}

pub fn deinit(self: *Self) void {
    self.memory.deinit();
    self.storage.deinit();
    self.balances.deinit();
    self.code.deinit();
    self.transient_storage.deinit();
    
    // Clean up logs - free allocated memory for topics and data
    for (self.logs.items) |log| {
        self.allocator.free(log.topics);
        self.allocator.free(log.data);
    }
    self.logs.deinit();
    
    self.address_access.deinit();
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
    _ = input;

    self.depth += 1;
    defer self.depth -= 1;

    // Save previous read_only state and set new one
    const prev_read_only = self.read_only;
    defer self.read_only = prev_read_only;
    
    // If entering a static context or already in one, maintain read-only
    self.read_only = self.read_only or is_static;

    var pc: usize = 0;
    var frame = Frame.init(self.allocator, contract);
    frame.is_static = self.read_only;
    frame.depth = @as(u32, @intCast(self.depth));
    frame.input = input;

    while (true) {
        const opcode = contract.get_op(pc);
        // Cast self and frame to the opaque types expected by execute
        const interpreter_ptr: *Operation.Interpreter = @ptrCast(self);
        const state_ptr: *Operation.State = @ptrCast(&frame);
        // Use jump table's execute method which handles gas consumption
        const result = try self.table.execute(pc, interpreter_ptr, state_ptr, opcode);
        
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

// Placeholder contract creation - to be implemented properly later
pub fn create_contract(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) !CreateResult {
    _ = self;
    _ = creator;
    _ = value;
    _ = init_code;
    _ = gas;
    
    // For now, return a failed creation
    return CreateResult{
        .success = false,
        .address = Address.ZERO_ADDRESS,
        .gas_left = 0,
        .output = null,
    };
}

// Placeholder contract call - to be implemented properly later
pub fn call_contract(self: *Self, caller: Address.Address, to: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) !CallResult {
    _ = self;
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
pub fn consume_gas(self: *Self, amount: u64) !void {
    _ = self;
    _ = amount;
    // TODO: Implement proper gas tracking
}

// CREATE2 specific method
pub fn create2_contract(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) !CreateResult {
    _ = self;
    _ = creator;  
    _ = value;
    _ = init_code;
    _ = salt;
    _ = gas;
    
    // For now, return a failed creation
    return CreateResult{
        .success = false,
        .address = Address.ZERO_ADDRESS,
        .gas_left = 0,
        .output = null,
    };
}

// CALLCODE specific method - executes code of 'to' in the context of the current contract
pub fn callcode_contract(self: *Self, current: Address.Address, code_address: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) !CallResult {
    _ = self;
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
pub fn delegatecall_contract(self: *Self, current: Address.Address, code_address: Address.Address, input: []const u8, gas: u64, is_static: bool) !CallResult {
    _ = self;
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
pub fn staticcall_contract(self: *Self, caller: Address.Address, to: Address.Address, input: []const u8, gas: u64) !CallResult {
    _ = self;
    _ = caller;
    _ = to;
    _ = input;
    _ = gas;
    
    // TODO: When implementing, ensure to call interpret_static or set read_only = true
    // For now, return a failed call
    return CallResult{
        .success = false,
        .gas_left = 0,
        .output = null,
    };
}

// Emit a log event
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

// EIP-2929: Mark address as warm and return if it was cold
pub fn mark_address_warm(self: *Self, address: Address.Address) !bool {
    const result = try self.address_access.getOrPut(address);
    if (!result.found_existing) {
        result.value_ptr.* = true;
        return true; // Was cold
    }
    return false; // Was already warm
}

// EIP-2929: Check if an address is cold
pub fn is_address_cold(self: *const Self, address: Address.Address) bool {
    return !self.address_access.contains(address);
}

// EIP-2929: Clear access list for new transaction
pub fn clear_access_list(self: *Self) void {
    self.address_access.clearRetainingCapacity();
    // Also clear storage access in all contracts
    // Note: This would be done at transaction level, not here
}

// EIP-2929: Pre-warm addresses from access list (EIP-2930)
pub fn pre_warm_addresses(self: *Self, addresses: []const Address.Address) !void {
    for (addresses) |address| {
        try self.address_access.put(address, true);
    }
}

// EIP-2929: Pre-warm storage slots from access list (EIP-2930)
pub fn pre_warm_storage_slots(self: *Self, address: Address.Address, slots: []const u256) !void {
    // This would need to be implemented at the contract level
    // For now, we'll leave this as a placeholder
    _ = self;
    _ = address;
    _ = slots;
}

// Initialize transaction with pre-warmed addresses (tx.origin, coinbase, to)
pub fn init_transaction_access_list(self: *Self) !void {
    // Pre-warm transaction origin
    try self.address_access.put(self.tx_origin, true);
    
    // Pre-warm coinbase
    try self.address_access.put(self.block_coinbase, true);
    
    // Note: The 'to' address would be pre-warmed when the transaction starts
    // This is typically done in the transaction processor, not here
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
    // TODO: Implement actual selfdestruct logic
}

