const std = @import("std");
const Contract = @import("Contract.zig").Contract;
const Memory = @import("Memory.zig").Memory;
const Stack = @import("Stack.zig").Stack;

const Allocator = std.mem.Allocator;

pub const Frame = struct {
    const Self = @This();

    allocator: Allocator,
    contract: *const Contract,
    pc: usize = 0,
    stack: Stack,
    memory: Memory,
    gas: u64 = 0,
    gas_used: u64 = 0,

    // Contract context
    caller: []u8 = &[_]u8{},
    callvalue: u256 = 0,
    calldata: []u8 = &[_]u8{},
    return_data: []u8 = &[_]u8{},

    pub fn create(allocator: Allocator, contract: *const Contract) Self {
        const stack = Stack.create();

        const memory = Memory.create(allocator) catch {
            @panic("Failed to create memory");
        };

        return Frame{
            .allocator = allocator,
            .contract = contract,
            .stack = stack,
            .memory = memory,
        };
    }

    pub fn destroy(self: *Self) void {
        self.memory.destroy();
    }
};
