const std = @import("std");
const Contract = @import("Contract.zig").Contract;
const Stack = @import("Stack.zig").Stack;
const Memory = @import("Memory.zig").Memory;

pub const Vm = struct {
    const Self = @This();

    allocator: std.mem.Allocator,

    returnData: []u8 = &[_]u8{},

    stack: Stack = Stack{},
    memory: Memory,

    depth: u16 = 0,

    pub fn init(allocator: std.mem.Allocator) Self {
        return Self{ .allocator = allocator, .memory = Memory.init(allocator) };
    }

    pub fn deinit(self: *Self) void {
        self.memory.deinit();
    }

    pub fn interpret(self: *Self, contract: *const Contract, input: []const u8) ![]const u8 {
        _ = input;
        _ = contract;

        self.depth += 1;
        defer self.depth -= 1;

        while (true) {}
    }
};
