const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");

pub fn op_and(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    const result = a & b;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_or(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    const result = a | b;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_xor(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    const result = a ^ b;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_not(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 1);

    // Peek the operand unsafely
    const value = frame.stack.peek_unsafe().*;

    const result = ~value;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_byte(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (i) unsafely
    const i = frame.stack.pop_unsafe();
    // Peek the new top operand (val) unsafely
    const val = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (i >= 32) {
        result = 0;
    } else {
        const i_usize = @as(usize, @intCast(i));
        // Byte 0 is MSB, byte 31 is LSB
        // To get byte i, we need to shift right by (31 - i) * 8 positions
        const shift_amount = (31 - i_usize) * 8;
        result = (val >> @intCast(shift_amount)) & 0xFF;
    }

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_shl(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (shift) unsafely
    const shift = frame.stack.pop_unsafe();
    // Peek the new top operand (value) unsafely
    const value = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (shift >= 256) {
        result = 0;
    } else {
        result = value << @intCast(shift);
    }

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_shr(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (shift) unsafely
    const shift = frame.stack.pop_unsafe();
    // Peek the new top operand (value) unsafely
    const value = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (shift >= 256) {
        result = 0;
    } else {
        result = value >> @intCast(shift);
    }

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_sar(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (shift) unsafely
    const shift = frame.stack.pop_unsafe();
    // Peek the new top operand (value) unsafely
    const value = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (shift >= 256) {
        // Check sign bit
        const sign_bit = value >> 255;
        if (sign_bit == 1) {
            result = std.math.maxInt(u256); // All 1s
        } else {
            result = 0;
        }
    } else {
        // Arithmetic shift preserving sign
        const shift_amount = @as(u8, @intCast(shift));
        const value_i256 = @as(i256, @bitCast(value));
        const result_i256 = value_i256 >> shift_amount;
        result = @as(u256, @bitCast(result_i256));
    }

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
