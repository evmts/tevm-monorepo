const std = @import("std");
const Contract = @import("contract.zig");
const Stack = @import("stack.zig");
const Memory = @import("memory.zig");
const JumpTable = @import("jump_table.zig");
const Frame = @import("frame.zig");
const Operation = @import("operation.zig");
const Address = @import("Address");
const StoragePool = @import("storage_pool.zig");

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
    };
}

pub fn deinit(self: *Self) void {
    self.memory.deinit();
    self.storage.deinit();
    self.balances.deinit();
    self.code.deinit();
    self.transient_storage.deinit();
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
    _ = input;

    self.depth += 1;
    defer self.depth -= 1;

    var pc: usize = 0;
    var frame = Frame.init(self.allocator, contract);

    while (true) {
        const operation = self.table.get_operation(contract.get_op(pc));
        // Cast self and frame to the opaque types expected by execute
        const interpreter_ptr: *Operation.Interpreter = @ptrCast(self);
        const state_ptr: *Operation.State = @ptrCast(&frame);
        const result = try operation.execute(pc, interpreter_ptr, state_ptr);
        
        // Update pc based on result (for now, just increment)
        pc += 1;
        
        // Check if we should stop
        if (result.len > 0 or pc >= contract.code_size) {
            return result;
        }
    }
}
