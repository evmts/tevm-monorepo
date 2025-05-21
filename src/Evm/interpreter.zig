const std = @import("std");
const _contract = @import("Contract.zig");
const _frame = @import("Frame.zig");
const _opcodes = @import("Opcodes.zig");

const Contract = _contract.Contract;
const Frame = _frame.Frame;
const Opcode = _opcodes.Opcode;

const Allocator = std.mem.Allocator;
const print = std.debug.print;

pub const InterpreterError = error{
    /// Not enough gas to continue execution
    OutOfGas,
};

pub const ExecutionError = error{
    /// Normal stop (STOP opcode)
    STOP,
};

pub const STOP = struct {
    constantGas: u32 = 0,
    minStack: u32 = 0,
    maxStack: u32 = 1028,
    dynamicGas: u32 = 0,
    pub fn execute(_: *Evm, _: *Frame) ExecutionError![]const u8 {
        return ExecutionError.STOP;
    }
};

pub const OpcodeExecutor = struct {
    const Self = @This();

    // we are treating this like this because in future this should be dynamically dispatching via a jump table and pointer
    opcode: Opcode,
    pub fn create(opcode: Opcode) Self {
        return Self{ .opcode = opcode };
    }

    // TODO: Perf improvement we should use a jump table though
    pub fn execute(self: Self, evm: Evm, frame: Frame) InterpreterError!void {
        switch (self.op) {
            Opcode.STOP => STOP.execute(evm, frame),
        }
    }
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
        _ = input;

        self.evm.depth += 1;
        defer self.evm.depth -= 1;

        var frame = try Frame.create(self.allocator, contract);
        defer frame.destroy();

        while (true) {
            // TODO: Perf improvement. Rather than getting opcode from bytecode then getting operation from opcode we can just replace the bytecode with direct pointers to operation
            const op = contract.getOp(frame.pc);
            print("Executing opcode: pc={d}, op=0x{x:0>2} ({s})", .{ frame.pc, op, op.getName() });
            const executor = OpcodeExecutor.create(op);
            _ = executor.execute(self, frame);
        }
    }
};
