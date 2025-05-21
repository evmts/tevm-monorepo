const std = @import("std");
const _interpreter = @import("Interpreter.zig");
const _contract = @import("Contract.zig");
const _frame = @import("Frame.zig");
const _opcodes = @import("Opcodes.zig");

// Public exports
pub const Evm = _interpreter.Evm;
pub const OpcodeExecutor = _interpreter.OpcodeExecutor;
pub const Contract = _contract.Contract;
pub const Frame = _frame.Frame;
pub const Opcode = _opcodes.Opcode;
pub const InterpreterError = _interpreter.InterpreterError;
pub const ExecutionError = _interpreter.ExecutionError;
pub const STOP = _interpreter.STOP;

test "export test" {
    std.testing.refAllDeclsRecursive(@This());
    std.testing.refAllDeclsRecursive(Evm);
    std.testing.refAllDeclsRecursive(Contract);
    std.testing.refAllDeclsRecursive(Frame);
}
