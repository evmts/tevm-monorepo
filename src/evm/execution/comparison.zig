const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame/frame.zig");

// Helper to convert Stack errors to ExecutionError
// These are redundant and can be removed.
// The op_* functions below use unsafe stack operations,
// so these helpers are unused anyway.

pub fn op_lt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // EVM LT computes: a < b (where a was second from top, b was top)
    const result: u256 = if (a < b) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_gt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // EVM GT computes: a > b (where a was second from top, b was top)
    const result: u256 = if (a > b) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_slt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // Signed less than
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));

    const result: u256 = if (a_i256 < b_i256) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_sgt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // Signed greater than
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));

    const result: u256 = if (a_i256 > b_i256) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_eq(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) {
        @branchHint(.cold);
        unreachable;
    }

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a == b) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_iszero(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 1) {
        @branchHint(.cold);
        unreachable;
    }

    // Peek the operand unsafely
    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a == 0) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
