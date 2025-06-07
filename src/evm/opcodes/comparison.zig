const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");

pub fn op_lt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a < b) 1 else 0;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_gt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a > b) 1 else 0;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_slt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));

    const result: u256 = if (a_i256 < b_i256) 1 else 0;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_sgt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));

    const result: u256 = if (a_i256 > b_i256) 1 else 0;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_eq(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 2);

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a == b) 1 else 0;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_iszero(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    std.debug.assert(frame.stack.size >= 1);

    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a == 0) 1 else 0;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
