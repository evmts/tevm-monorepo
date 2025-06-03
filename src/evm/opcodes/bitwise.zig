const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");

// Helper to convert Stack errors to ExecutionError
fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| switch (err) {
        Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
        else => return ExecutionError.Error.StackUnderflow,
    };
}

fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| switch (err) {
        Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
        else => return ExecutionError.Error.StackOverflow,
    };
}

pub fn op_and(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);

    const result = a & b;

    try stack_push(&frame.stack, result);

    return Operation.ExecutionResult{};
}

pub fn op_or(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);

    const result = a | b;

    try stack_push(&frame.stack, result);

    return Operation.ExecutionResult{};
}

pub fn op_xor(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);

    const result = a ^ b;

    try stack_push(&frame.stack, result);

    return Operation.ExecutionResult{};
}

pub fn op_not(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const a = try stack_pop(&frame.stack);

    const result = ~a;

    try stack_push(&frame.stack, result);

    return Operation.ExecutionResult{};
}

pub fn op_byte(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const i = try stack_pop(&frame.stack);
    const val = try stack_pop(&frame.stack);

    if (i >= 32) {
        try stack_push(&frame.stack, 0);
    } else {
        const i_usize = @as(usize, @intCast(i));
        // Byte 0 is MSB, byte 31 is LSB
        // To get byte i, we need to shift right by (31 - i) * 8 positions
        const shift_amount = (31 - i_usize) * 8;
        const result = (val >> @intCast(shift_amount)) & 0xFF;
        try stack_push(&frame.stack, result);
    }

    return Operation.ExecutionResult{};
}

pub fn op_shl(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const shift = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);

    if (shift >= 256) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }

    const result = value << @as(u8, @intCast(shift));
    try stack_push(&frame.stack, result);

    return Operation.ExecutionResult{};
}

pub fn op_shr(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const shift = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);

    if (shift >= 256) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }

    const result = value >> @as(u8, @intCast(shift));
    try stack_push(&frame.stack, result);

    return Operation.ExecutionResult{};
}

pub fn op_sar(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const shift = try stack_pop(&frame.stack);
    const value = try stack_pop(&frame.stack);

    if (shift >= 256) {
        // Check sign bit
        const sign_bit = value >> 255;
        if (sign_bit == 1) {
            try stack_push(&frame.stack, std.math.maxInt(u256)); // All 1s
        } else {
            try stack_push(&frame.stack, 0);
        }
        return Operation.ExecutionResult{};
    }

    // Arithmetic shift preserving sign
    const shift_amount = @as(u8, @intCast(shift));
    const value_i256 = @as(i256, @bitCast(value));
    const result_i256 = value_i256 >> shift_amount;
    const result = @as(u256, @bitCast(result_i256));
    try stack_push(&frame.stack, result);

    return Operation.ExecutionResult{};
}
