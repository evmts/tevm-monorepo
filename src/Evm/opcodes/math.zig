const std = @import("std");
// Import from parent directory using relative paths
const jumpTableModule = @import("../jumpTable/JumpTable.zig");
const JumpTable = jumpTableModule.JumpTable;
const Operation = jumpTableModule.Operation;
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../interpreter.zig").InterpreterError;
const stackModule = @import("../Stack.zig");
const Stack = stackModule.Stack;
const StackError = stackModule.StackError;

// Helper to convert Stack errors to ExecutionError
fn mapStackError(err: StackError) ExecutionError {
    return switch (err) {
        error.OutOfBounds => ExecutionError.StackUnderflow,
        error.StackOverflow => ExecutionError.StackOverflow,
        error.OutOfMemory => ExecutionError.OutOfGas,
    };
}

// For completeness, add a dummy Memory implementation that we don't use in this test
const Memory = struct {};

// Test ADD operation
pub fn opAdd(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const a = frame.stack.pop() catch |err| return mapStackError(err);
    const b = frame.stack.pop() catch |err| return mapStackError(err);
    frame.stack.push(a +% b) catch |err| return mapStackError(err); // Wrapping addition
    return "";
}

// Test MUL operation
pub fn opMul(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const a = frame.stack.pop() catch |err| return mapStackError(err);
    const b = frame.stack.pop() catch |err| return mapStackError(err);
    frame.stack.push(a *% b) catch |err| return mapStackError(err); // Wrapping multiplication
    return "";
}

// Test SUB operation
pub fn opSub(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const a = frame.stack.pop() catch |err| return mapStackError(err);
    const b = frame.stack.pop() catch |err| return mapStackError(err);
    frame.stack.push(b -% a) catch |err| return mapStackError(err); // Correct order: first - second
    return "";
}

// Test DIV operation
pub fn opDiv(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const divisor = frame.stack.pop() catch |err| return mapStackError(err);
    const dividend = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Handle division by zero
    if (divisor == 0) {
        frame.stack.push(0) catch |err| return mapStackError(err);
    } else {
        frame.stack.push(dividend / divisor) catch |err| return mapStackError(err);
    }
    
    return "";
}

// Test SDIV operation (signed division)
pub fn opSdiv(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const a_unsigned = frame.stack.pop() catch |err| return mapStackError(err);
    const b_unsigned = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Convert to signed values
    const a = @as(i256, @bitCast(a_unsigned));
    const b = @as(i256, @bitCast(b_unsigned));
    
    // Handle division by zero and overflow
    if (b == 0) {
        frame.stack.push(0) catch |err| return mapStackError(err);
    } else if (a == std.math.minInt(i256) and b == -1) {
        // Handle INT_MIN / -1 overflow
        const min_int: i256 = std.math.minInt(i256);
        frame.stack.push(@as(u256, @bitCast(min_int))) catch |err| return mapStackError(err); // Return INT_MIN
    } else {
        frame.stack.push(@as(u256, @bitCast(@divTrunc(a, b)))) catch |err| return mapStackError(err);
    }
    
    return "";
}

// Test MOD operation
pub fn opMod(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const modulus = frame.stack.pop() catch |err| return mapStackError(err);
    const value = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Handle division by zero
    if (modulus == 0) {
        frame.stack.push(0) catch |err| return mapStackError(err);
    } else {
        frame.stack.push(value % modulus) catch |err| return mapStackError(err);
    }
    
    return "";
}

// Test SMOD operation (signed modulo)
pub fn opSmod(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const a_unsigned = frame.stack.pop() catch |err| return mapStackError(err);
    const b_unsigned = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Convert to signed values
    const a = @as(i256, @bitCast(a_unsigned));
    const b = @as(i256, @bitCast(b_unsigned));
    
    // Handle division by zero
    if (b == 0) {
        frame.stack.push(0) catch |err| return mapStackError(err);
    } else {
        // In Solidity, the sign of the result follows the sign of the dividend
        const result = @rem(a, b); // Remainder operation that preserves sign
        frame.stack.push(@as(u256, @bitCast(result))) catch |err| return mapStackError(err);
    }
    
    return "";
}

// Test EXP operation (exponentiation)
pub fn opExp(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const exponent = frame.stack.pop() catch |err| return mapStackError(err);
    const base = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Handle special cases
    if (exponent == 0) {
        frame.stack.push(1) catch |err| return mapStackError(err); // Any number to the power of 0 is 1
        return "";
    }
    
    if (base == 0) {
        frame.stack.push(0) catch |err| return mapStackError(err); // 0 to any positive power is 0
        return "";
    }
    
    // Calculate b^e using binary exponentiation for efficiency
    var result: u256 = 1;
    var b = base;
    var e = exponent;
    
    while (e > 0) {
        if (e & 1 == 1) {
            result = result *% b; // Multiply if bit is set
        }
        b = b *% b; // Square the base
        e >>= 1; // Move to next bit
    }
    
    frame.stack.push(result) catch |err| return mapStackError(err);
    return "";
}

// Test ADDMOD operation
pub fn opAddmod(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const modulus = frame.stack.pop() catch |err| return mapStackError(err);
    const b = frame.stack.pop() catch |err| return mapStackError(err);
    const a = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Handle division by zero
    if (modulus == 0) {
        frame.stack.push(0) catch |err| return mapStackError(err);
    } else {
        // Calculate (a + b) % n
        const sum = a +% b; // Use wrapping addition
        frame.stack.push(sum % modulus) catch |err| return mapStackError(err);
    }
    
    return "";
}

// Test MULMOD operation
pub fn opMulmod(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const a = frame.stack.pop() catch |err| return mapStackError(err);
    const b = frame.stack.pop() catch |err| return mapStackError(err);
    const n = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Handle division by zero
    if (n == 0) {
        frame.stack.push(0) catch |err| return mapStackError(err);
    } else {
        // Calculate (a * b) % n
        const product = a *% b; // Use wrapping multiplication
        frame.stack.push(product % n) catch |err| return mapStackError(err);
    }
    
    return "";
}

