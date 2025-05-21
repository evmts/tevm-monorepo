const std = @import("std");
const _contract = @import("Contract.zig");
const _frame = @import("Frame.zig");
const _opcodes = @import("Opcodes.zig");
const bytecode = @import("Bytecode");
const opcode_executor = @import("OpcodeExecutor.zig");

const Contract = _contract.Contract;
const Frame = _frame.Frame;
const Opcode = _opcodes.Opcode;

const Allocator = std.mem.Allocator;
const print = std.debug.print;

pub const InterpreterError = error{
    /// Not enough gas to continue execution
    OutOfGas,
    OutOfMemory,
};

pub const Evm = struct {
    const Self = @This();

    allocator: Allocator,

    returnData: []u8 = &[_]u8{},

    /// Depth of call stack to track stack overflow
    depth: u16 = 0,

    pub fn create(allocator: Allocator) Self {
        return Evm{ .allocator = allocator };
    }

    pub fn interpret(self: *Self, contract: *const Contract, input: []const u8) InterpreterError![]const u8 {
        print("Starting execution\n", .{});
        _ = input;

        self.depth += 1;
        defer self.depth -= 1;

        var frame = Frame.create(self.allocator, contract);
        defer frame.destroy();

        while (true) {
            // TODO: Perf improvement. Rather than getting opcode from bytecode then getting operation from opcode we can just replace the bytecode with direct pointers to operation
            const op = contract.getOp(frame.pc);
            print("Executing opcode: pc={d}, op=0x{x:0>2} ({s})\n", .{ frame.pc, @intFromEnum(op), op.getName() });

            const executor = opcode_executor.OpcodeExecutor.create(op);
            executor.execute(self, &frame) catch |err| {
                switch (err) {
                    opcode_executor.ExecutionError.STOP => return try self.allocator.alloc(u8, 0),
                    opcode_executor.ExecutionError.REVERT => {
                        // TODO: Handle REVERT - return return data and revert state changes
                        return try self.allocator.alloc(u8, 0);
                    },
                    opcode_executor.ExecutionError.INVALID => {
                        // TODO: Handle INVALID instruction
                        return try self.allocator.alloc(u8, 0);
                    },
                    opcode_executor.ExecutionError.StackUnderflow => {
                        // TODO: Handle stack underflow error
                        return try self.allocator.alloc(u8, 0);
                    },
                    opcode_executor.ExecutionError.StackOverflow => {
                        // TODO: Handle stack overflow error
                        return try self.allocator.alloc(u8, 0);
                    },
                    opcode_executor.ExecutionError.OutOfOffset => {
                        // TODO: Handle out of offset error
                        return try self.allocator.alloc(u8, 0);
                    },
                    opcode_executor.ExecutionError.OutOfGas => {
                        // TODO: Handle out of gas error
                        return try self.allocator.alloc(u8, 0);
                    },
                    opcode_executor.ExecutionError.InvalidJump => {
                        // TODO: Handle invalid jump error
                        return try self.allocator.alloc(u8, 0);
                    },
                    opcode_executor.ExecutionError.InvalidOpcode => {
                        // TODO: Handle invalid opcode error
                        return try self.allocator.alloc(u8, 0);
                    },
                    opcode_executor.ExecutionError.StaticCallViolation => {
                        // TODO: Handle static call violation error
                        return try self.allocator.alloc(u8, 0);
                    },
                    opcode_executor.ExecutionError.CreateContractFailed => {
                        // TODO: Handle contract creation failure
                        return try self.allocator.alloc(u8, 0);
                    },
                }
            };
            // Increment PC, which will be ignored if the operation modified PC
            frame.pc += 1;
        }
    }
};

test "Evm interprets simple STOP bytecode" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();

    var evm = Evm.create(arena.allocator());

    const stop_contract = Contract{ .code = &[_]u8{0x00} };
    const call_data = &[_]u8{};

    const result = try evm.interpret(&stop_contract, call_data);

    try testing.expectEqual(result.len, 0);
}
