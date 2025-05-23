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

// Run a simple test of the ADD operation
test "Math - ADD operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]u256 = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Push test values onto the stack
    try stack.push(5);
    try stack.push(3);
    
    // Execute the ADD operation
    _ = try opAdd(0, undefined, &frame);
    
    // Check that the result is correct
    try std.testing.expectEqual(@as(u256, 8), try stack.pop());
}

// Run a simple test of the MUL operation
test "Math - MUL operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]u256 = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Push test values onto the stack
    try stack.push(5);
    try stack.push(3);
    
    // Execute the MUL operation
    _ = try opMul(0, undefined, &frame);
    
    // Check that the result is correct
    try std.testing.expectEqual(@as(u256, 15), try stack.pop());
}

// Run a simple test of the SUB operation
test "Math - SUB operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]u256 = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Push test values onto the stack
    try stack.push(10);
    try stack.push(4);
    
    // Execute the SUB operation
    _ = try opSub(0, undefined, &frame);
    
    // Check that the result is correct
    try std.testing.expectEqual(@as(u256, 6), try stack.pop());
}

// Test edge cases for the DIV operation
test "Math - DIV operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]u256 = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Test normal division
    try stack.push(10);
    try stack.push(2);
    _ = try opDiv(0, undefined, &frame);
    try std.testing.expectEqual(@as(u256, 5), try stack.pop());
    
    // Test division by zero
    try stack.push(10);
    try stack.push(0);
    _ = try opDiv(0, undefined, &frame);
    try std.testing.expectEqual(@as(u256, 0), try stack.pop());
}

// Test edge cases for the MOD operation
test "Math - MOD operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]u256 = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Test normal modulo
    try stack.push(10);
    try stack.push(3);
    _ = try opMod(0, undefined, &frame);
    try std.testing.expectEqual(@as(u256, 1), try stack.pop());
    
    // Test modulo by zero
    try stack.push(10);
    try stack.push(0);
    _ = try opMod(0, undefined, &frame);
    try std.testing.expectEqual(@as(u256, 0), try stack.pop());
}

// Test the EXP operation
test "Math - EXP operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]u256 = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Test 2^3 = 8
    try stack.push(2);
    try stack.push(3);
    _ = try opExp(0, undefined, &frame);
    try std.testing.expectEqual(@as(u256, 8), try stack.pop());
    
    // Test 0^0 = 1 (EVM convention)
    try stack.push(0);
    try stack.push(0);
    _ = try opExp(0, undefined, &frame);
    try std.testing.expectEqual(@as(u256, 1), try stack.pop());
    
    // Test 0^5 = 0
    try stack.push(0);
    try stack.push(5);
    _ = try opExp(0, undefined, &frame);
    try std.testing.expectEqual(@as(u256, 0), try stack.pop());
    
    // Test 5^0 = 1
    try stack.push(5);
    try stack.push(0);
    _ = try opExp(0, undefined, &frame);
    try std.testing.expectEqual(@as(u256, 1), try stack.pop());
}

// Test the ADDMOD operation
test "Math - ADDMOD operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]u256 = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Test (5 + 3) % 7 = 8 % 7 = 1
    try stack.push(5);
    try stack.push(3);
    try stack.push(7);
    _ = try opAddmod(0, undefined, &frame);
    try std.testing.expectEqual(@as(u256, 1), try stack.pop());
    
    // Test (5 + 3) % 0 = 0 (EVM convention for modulo by zero)
    try stack.push(5);
    try stack.push(3);
    try stack.push(0);
    _ = try opAddmod(0, undefined, &frame);
    try std.testing.expectEqual(@as(u256, 0), try stack.pop());
}

// Test the MULMOD operation
test "Math - MULMOD operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]u256 = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Test (5 * 3) % 7 = 15 % 7 = 1
    try stack.push(5);
    try stack.push(3);
    try stack.push(7);
    _ = try opMulmod(0, undefined, &frame);
    try std.testing.expectEqual(@as(u256, 1), try stack.pop());
    
    // Test (5 * 3) % 0 = 0 (EVM convention for modulo by zero)
    try stack.push(5);
    try stack.push(3);
    try stack.push(0);
    _ = try opMulmod(0, undefined, &frame);
    try std.testing.expectEqual(@as(u256, 0), try stack.pop());
}

/// Register math opcodes in the jump table
///
/// This adds the following opcodes to the jump table:
/// - ADD (0x01)
/// - MUL (0x02)
/// - SUB (0x03)
/// - DIV (0x04)
/// - SDIV (0x05)
/// - MOD (0x06)
/// - SMOD (0x07)
/// - ADDMOD (0x08)
/// - MULMOD (0x09)
/// - EXP (0x0A)
///
/// Parameters:
/// - allocator: Memory allocator to use for the operations
/// - jump_table: JumpTable to register the opcodes in
///
/// Returns: Any allocation errors
pub fn registerMathOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable) !void {
    // ADD (0x01)
    const add_op = try allocator.create(Operation);
    add_op.* = Operation{
        .execute = opAdd,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x01] = add_op;
    
    // MUL (0x02)
    const mul_op = try allocator.create(Operation);
    mul_op.* = Operation{
        .execute = opMul,
        .constant_gas = jumpTableModule.GasFastStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x02] = mul_op;
    
    // SUB (0x03)
    const sub_op = try allocator.create(Operation);
    sub_op.* = Operation{
        .execute = opSub,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x03] = sub_op;
    
    // DIV (0x04)
    const div_op = try allocator.create(Operation);
    div_op.* = Operation{
        .execute = opDiv,
        .constant_gas = jumpTableModule.GasFastStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x04] = div_op;
    
    // SDIV (0x05)
    const sdiv_op = try allocator.create(Operation);
    sdiv_op.* = Operation{
        .execute = opSdiv,
        .constant_gas = jumpTableModule.GasFastStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x05] = sdiv_op;
    
    // MOD (0x06)
    const mod_op = try allocator.create(Operation);
    mod_op.* = Operation{
        .execute = opMod,
        .constant_gas = jumpTableModule.GasFastStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x06] = mod_op;
    
    // SMOD (0x07)
    const smod_op = try allocator.create(Operation);
    smod_op.* = Operation{
        .execute = opSmod,
        .constant_gas = jumpTableModule.GasFastStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x07] = smod_op;
    
    // EXP (0x0A)
    const exp_op = try allocator.create(Operation);
    exp_op.* = Operation{
        .execute = opExp,
        .constant_gas = jumpTableModule.GasSlowStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
        // TODO: EXP has dynamic gas based on exponent size
    };
    jump_table.table[0x0A] = exp_op;
}