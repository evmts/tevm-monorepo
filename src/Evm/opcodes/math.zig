const std = @import("std");
// Import from evm package
const evm = @import("evm");
const jumpTableModule = evm.jumpTable;
const JumpTable = jumpTableModule.JumpTable;
const Operation = jumpTableModule.Operation;
const Interpreter = evm.Interpreter;
const Frame = evm.Frame;
const ExecutionError = evm.InterpreterError;
const Stack = evm.Stack;
const StackError = evm.StackError;

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


/// Register all math opcodes in the jump table
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
    
    // MOD (0x05)
    const mod_op = try allocator.create(Operation);
    mod_op.* = Operation{
        .execute = opMod,
        .constant_gas = jumpTableModule.GasFastStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x05] = mod_op;
    
    // ADDMOD (0x08)
    const addmod_op = try allocator.create(Operation);
    addmod_op.* = Operation{
        .execute = opAddmod,
        .constant_gas = jumpTableModule.GasMidStep,
        .min_stack = jumpTableModule.minStack(3, 1),
        .max_stack = jumpTableModule.maxStack(3, 1),
    };
    jump_table.table[0x08] = addmod_op;
    
    // MULMOD (0x09)
    const mulmod_op = try allocator.create(Operation);
    mulmod_op.* = Operation{
        .execute = opMulmod,
        .constant_gas = jumpTableModule.GasMidStep,
        .min_stack = jumpTableModule.minStack(3, 1),
        .max_stack = jumpTableModule.maxStack(3, 1),
    };
    jump_table.table[0x09] = mulmod_op;
}

// ===== TESTS =====

const testing = std.testing;

test "ADD operation" {
    // Create stack
    const stack = Stack{};
    // Stack no longer needs deinit
    
    // Create frame
    var frame = Frame{
        .gas = 10000,
        .stack = stack,
        .memory = undefined,
        .contract = undefined,
        .returnData = null,
    };
    
    // Test basic addition
    try frame.stack.push(10); // First push
    try frame.stack.push(20); // Second push
    
    // Execute opAdd - this should add 10 + 20 = 30
    _ = try opAdd(0, undefined, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 30), result);
    
    // Test addition with wrapping (overflow)
    const max_value: u256 = ~@as(u256, 0); // All bits set to 1
    try frame.stack.push(max_value); // First push (max value)
    try frame.stack.push(1);         // Second push (1)
    
    // Execute opAdd - this should wrap around to 0
    _ = try opAdd(0, undefined, &frame);
    
    // Check the result
    const overflow_result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), overflow_result);
}

test "SUB operation" {
    // Create stack
    const stack = Stack{};
    // Stack no longer needs deinit
    
    // Create frame
    var frame = Frame{
        .gas = 10000,
        .stack = stack,
        .memory = undefined,
        .contract = undefined,
        .returnData = null,
    };
    
    // Test basic subtraction
    try frame.stack.push(30); // First push
    try frame.stack.push(10); // Second push
    
    // Execute opSub - this should subtract 30 - 10 = 20
    _ = try opSub(0, undefined, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 20), result);
    
    // Test subtraction with wrapping (underflow)
    try frame.stack.push(0); // First push (0)
    try frame.stack.push(1); // Second push (1)
    
    // Execute opSub - this should wrap around to max value
    _ = try opSub(0, undefined, &frame);
    
    // Check the result
    const underflow_result = try frame.stack.pop();
    try testing.expectEqual(~@as(u256, 0), underflow_result); // All bits set to 1
}

test "MUL operation" {
    // Create stack
    const stack = Stack{};
    // Stack no longer needs deinit
    
    // Create frame
    var frame = Frame{
        .gas = 10000,
        .stack = stack,
        .memory = undefined,
        .contract = undefined,
        .returnData = null,
    };
    
    // Test basic multiplication
    try frame.stack.push(7);  // First push
    try frame.stack.push(6);  // Second push
    
    // Execute opMul - this should multiply 7 * 6 = 42
    _ = try opMul(0, undefined, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 42), result);
    
    // Test multiplication with large numbers (not overflowing)
    try frame.stack.push(0x10000000); // 2^28
    try frame.stack.push(0x10);       // 16
    
    // Execute opMul - this should multiply 2^28 * 16 = 2^32
    _ = try opMul(0, undefined, &frame);
    
    // Check the result
    const large_result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x100000000), large_result); // 2^32
}

test "DIV operation" {
    // Create stack
    const stack = Stack{};
    // Stack no longer needs deinit
    
    // Create frame
    var frame = Frame{
        .gas = 10000,
        .stack = stack,
        .memory = undefined,
        .contract = undefined,
        .returnData = null,
    };
    
    // Test basic division
    try frame.stack.push(42);  // First push (dividend)
    try frame.stack.push(7);   // Second push (divisor)
    
    // Execute opDiv - this should divide 42 / 7 = 6
    _ = try opDiv(0, undefined, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 6), result);
    
    // Test integer division truncation
    try frame.stack.push(10);  // First push (dividend)
    try frame.stack.push(3);   // Second push (divisor)
    
    // Execute opDiv - this should divide 10 / 3 = 3 (integer division truncates)
    _ = try opDiv(0, undefined, &frame);
    
    // Check the result
    const trunc_result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 3), trunc_result);
    
    // Test division by zero
    try frame.stack.push(42);  // First push (dividend)
    try frame.stack.push(0);   // Second push (divisor = 0)
    
    // Execute opDiv - this should result in 0 per EVM specs
    _ = try opDiv(0, undefined, &frame);
    
    // Check the result
    const div_by_zero_result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), div_by_zero_result);
}