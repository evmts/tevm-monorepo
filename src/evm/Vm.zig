const std = @import("std");
const Contract = @import("Contract.zig");
const Stack = @import("Stack.zig");
const Memory = @import("Memory.zig");
const JumpTable = @import("JumpTable.zig");
const Frame = @import("Frame.zig");

const Self = @This();

allocator: std.mem.Allocator,

returnData: []u8 = &[_]u8{},

stack: Stack = .{},
memory: Memory,
table: JumpTable,

depth: u16 = 0,

readOnly: bool = false,

pub fn init(allocator: std.mem.Allocator) Self {
    return Self{ .allocator = allocator, .memory = Memory.init(allocator) };
}

pub fn deinit(self: *Self) void {
    self.memory.deinit();
}

pub fn interpret(self: *Self, contract: *const Contract, input: []const u8) ![]const u8 {
    _ = input;

    self.depth += 1;
    defer self.depth -= 1;

    const pc: u64 = 0;
    const frame = Frame.init(self.allocator, contract);

    while (true) {
        const operation = self.table.getOperation(contract.getOp(pc));
        operation.execute(frame);
    }
}
