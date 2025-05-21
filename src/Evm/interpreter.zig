const std = @import("std");
const _contract = @import("Contract.zig");
const _frame = @import("Frame.zig");

const Contract = _contract.Contract;
const Frame = _frame.Frame;

const Allocator = std.mem.Allocator;
const print = std.debug.print;

pub const InterpreterError = error{
    /// Not enough gas to continue execution
    OutOfGas,
};

pub const Evm = struct {
    const Self = @This();

    allocator: Allocator,

    returnData: []u8,

    /// Pointer to the EVM instance that provides context and state access
    depth: u16,

    pub fn create(allocator: Allocator) Self {
        return Evm{ .allocator = allocator };
    }

    pub fn run(self: *Self, contract: *Contract, input: []const u8) InterpreterError![]const u8 {
        print("Starting execution", .{});

        var frame = try Frame.create(self.allocator, contract);
        defer frame.destroy();

        while (true) {
            const op_code = contract.getOp(frame.pc);
        }
    }
};
