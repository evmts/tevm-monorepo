const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");

// Helper to convert Stack errors to ExecutionError
inline fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| switch (err) {
        Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
        else => return ExecutionError.Error.StackUnderflow,
    };
}

inline fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| switch (err) {
        Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
        else => return ExecutionError.Error.StackOverflow,
    };
}

pub fn op_lt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    
    const result: u256 = if (a < b) 1 else 0;
    
    try stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}

pub fn op_gt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    
    const result: u256 = if (a > b) 1 else 0;
    
    try stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}

pub fn op_slt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    
    // Signed less than
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));
    
    const result: u256 = if (a_i256 < b_i256) 1 else 0;
    
    try stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}

pub fn op_sgt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    
    // Signed greater than
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));
    
    const result: u256 = if (a_i256 > b_i256) 1 else 0;
    
    try stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}

pub fn op_eq(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    
    const result: u256 = if (a == b) 1 else 0;
    
    try stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}

pub fn op_iszero(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const a = try stack_pop(&frame.stack);
    
    const result: u256 = if (a == 0) 1 else 0;
    
    try stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}