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
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);
    
    // Direct access - no error handling needed
    const b = frame.stack.data[frame.stack.size - 1];
    const a = frame.stack.data[frame.stack.size - 2];
    frame.stack.size -= 1;
    
    // Modify in-place (now at top of stack)
    frame.stack.data[frame.stack.size - 1] = a & b;

    return Operation.ExecutionResult{};
}

pub fn op_or(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);
    
    // Direct access - no error handling needed
    const b = frame.stack.data[frame.stack.size - 1];
    const a = frame.stack.data[frame.stack.size - 2];
    frame.stack.size -= 1;
    
    // Modify in-place (now at top of stack)
    frame.stack.data[frame.stack.size - 1] = a | b;

    return Operation.ExecutionResult{};
}

pub fn op_xor(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);
    
    // Direct access - no error handling needed
    const b = frame.stack.data[frame.stack.size - 1];
    const a = frame.stack.data[frame.stack.size - 2];
    frame.stack.size -= 1;
    
    // Modify in-place (now at top of stack)
    frame.stack.data[frame.stack.size - 1] = a ^ b;

    return Operation.ExecutionResult{};
}

pub fn op_not(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 1);
    
    // Modify top of stack in-place
    const value_ptr = &frame.stack.data[frame.stack.size - 1];
    value_ptr.* = ~value_ptr.*;

    return Operation.ExecutionResult{};
}

pub fn op_byte(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);
    
    // Direct access - no error handling needed
    const i = frame.stack.data[frame.stack.size - 1];
    const val = frame.stack.data[frame.stack.size - 2];
    frame.stack.size -= 1;
    
    // Modify value in-place (now at top of stack)
    const value_ptr = &frame.stack.data[frame.stack.size - 1];
    
    if (i >= 32) {
        value_ptr.* = 0;
    } else {
        const i_usize = @as(usize, @intCast(i));
        // Byte 0 is MSB, byte 31 is LSB
        // To get byte i, we need to shift right by (31 - i) * 8 positions
        const shift_amount = (31 - i_usize) * 8;
        value_ptr.* = (val >> @intCast(shift_amount)) & 0xFF;
    }

    return Operation.ExecutionResult{};
}

pub fn op_shl(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);
    
    // Direct access - no error handling needed
    const shift = frame.stack.data[frame.stack.size - 1];
    frame.stack.size -= 1;
    
    // Modify value in-place (now at top of stack)
    const value_ptr = &frame.stack.data[frame.stack.size - 1];
    
    if (shift >= 256) {
        value_ptr.* = 0;
    } else {
        value_ptr.* <<= @intCast(shift);
    }

    return Operation.ExecutionResult{};
}

pub fn op_shr(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);
    
    // Direct access - no error handling needed
    const shift = frame.stack.data[frame.stack.size - 1];
    frame.stack.size -= 1;
    
    // Modify value in-place (now at top of stack)
    const value_ptr = &frame.stack.data[frame.stack.size - 1];
    
    if (shift >= 256) {
        value_ptr.* = 0;
    } else {
        value_ptr.* >>= @intCast(shift);
    }

    return Operation.ExecutionResult{};
}

pub fn op_sar(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);
    
    // Direct access - no error handling needed
    const shift = frame.stack.data[frame.stack.size - 1];
    frame.stack.size -= 1;
    
    // Get mutable reference to value (now at top of stack)
    const value_ptr = &frame.stack.data[frame.stack.size - 1];
    const value = value_ptr.*;

    if (shift >= 256) {
        // Check sign bit
        const sign_bit = value >> 255;
        if (sign_bit == 1) {
            value_ptr.* = std.math.maxInt(u256); // All 1s
        } else {
            value_ptr.* = 0;
        }
    } else {
        // Arithmetic shift preserving sign
        const shift_amount = @as(u8, @intCast(shift));
        const value_i256 = @as(i256, @bitCast(value));
        const result_i256 = value_i256 >> shift_amount;
        value_ptr.* = @as(u256, @bitCast(result_i256));
    }

    return Operation.ExecutionResult{};
}
