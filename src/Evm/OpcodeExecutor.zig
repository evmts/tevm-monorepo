const std = @import("std");
const _frame = @import("Frame.zig");
const _opcodes = @import("Opcodes.zig");
const bytecode = @import("Bytecode");
const Evm = @import("Interpreter.zig").Evm;

const Frame = _frame.Frame;
const Opcode = _opcodes.Opcode;

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
    pub fn execute(self: Self, evm: *Evm, frame: *Frame) ExecutionError!void {
        return switch (self.opcode) {
            Opcode.STOP => {
                _ = try STOP.execute(evm, frame);
            },
            else => ExecutionError.STOP,
        };
    }
};
