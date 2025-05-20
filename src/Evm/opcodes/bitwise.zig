const std = @import("std");
const pkg = @import("package.zig");
const Interpreter = pkg.Interpreter;
const Frame = pkg.Frame;
const ExecutionError = pkg.ExecutionError;
const JumpTable = pkg.JumpTable;
const Stack = pkg.Stack;
const @"u256" = pkg.@"u256";

/// AND operation - bitwise AND of the top two stack items
pub fn opAnd(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // Debug logging (only in debug builds)
    if (@import("builtin").mode == .Debug) {
        std.debug.print("opAnd: stack.size={d}\n", .{frame.stack.size});
    }
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        if (@import("builtin").mode == .Debug) {
            std.debug.print("opAnd: Stack underflow (size={d})\n", .{frame.stack.size});
        }
        return ExecutionError.StackUnderflow;
    }
    
    // Pop y from the stack
    const y = try frame.stack.pop();
    if (@import("builtin").mode == .Debug) {
        std.debug.print("opAnd: Popped y={x}\n", .{y});
    }
    
    // Get reference to x (which is now at the top of the stack)
    const x = try frame.stack.peek();
    if (@import("builtin").mode == .Debug) {
        std.debug.print("opAnd: Peeked x={x}\n", .{x.*});
    }
    
    // Perform bitwise AND and store result
    const result = x.* & y;
    x.* = result;
    
    if (@import("builtin").mode == .Debug) {
        std.debug.print("opAnd: Result={x}\n", .{result});
    }
    
    return "";
}

/// OR operation - bitwise OR of the top two stack items
pub fn opOr(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop y from the stack
    const y = try frame.stack.pop();
    
    // Get reference to x (which is now at the top of the stack)
    const x = try frame.stack.peek();
    
    // Perform bitwise OR and store result
    x.* = x.* | y;
    
    return "";
}

/// XOR operation - bitwise XOR of the top two stack items
pub fn opXor(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop y from the stack
    const y = try frame.stack.pop();
    
    // Get reference to x (which is now at the top of the stack)
    const x = try frame.stack.peek();
    
    // Perform bitwise XOR and store result
    x.* = x.* ^ y;
    
    return "";
}

/// NOT operation - bitwise NOT of the top stack item
pub fn opNot(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 1 item on the stack
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Get reference to x (which is at the top of the stack)
    const x = try frame.stack.peek();
    
    // Perform bitwise NOT and store result
    x.* = ~x.*;
    
    return "";
}

/// BYTE operation - retrieves a byte from the operand stack
pub fn opByte(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop n (byte index) from the stack
    const n = try frame.stack.pop();
    
    // Get reference to x (value to extract byte from)
    const x = try frame.stack.peek();
    
    // If n >= 32, result is 0 (byte index out of range for 256-bit value)
    if (n >= 32) {
        x.* = 0;
        return "";
    }
    
    // Extract the nth byte from the value x
    // In big-endian representation, we need to shift and mask
    // Shift right by 8 * (31 - n) to position the desired byte at the least significant position
    // Then mask with 0xFF to extract only that byte
    const shift = 8 * (31 - @as(u8, @intCast(n)));
    x.* = (x.* >> shift) & 0xFF;
    
    return "";
}

/// SHL operation - left bit-shifting operation
pub fn opShl(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop shift from the stack
    const shift = try frame.stack.pop();
    
    // Get reference to value (which is now at the top of the stack)
    const value = try frame.stack.peek();
    
    // If shift is >= 256, result is 0 (all bits are shifted out)
    if (shift >= 256) {
        value.* = 0;
    } else {
        // Perform left shift by the specified amount
        value.* = value.* << @intCast(shift);
    }
    
    return "";
}

/// SHR operation - logical right bit-shifting operation
pub fn opShr(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop shift from the stack
    const shift = try frame.stack.pop();
    
    // Get reference to value (which is now at the top of the stack)
    const value = try frame.stack.peek();
    
    // If shift is >= 256, result is 0 (all bits are shifted out)
    if (shift >= 256) {
        value.* = 0;
    } else {
        // Perform logical right shift by the specified amount
        value.* = value.* >> @intCast(shift);
    }
    
    return "";
}

/// SAR operation - arithmetic right bit-shifting operation
pub fn opSar(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop shift from the stack
    const shift = try frame.stack.pop();
    
    // Get reference to value (which is now at the top of the stack)
    const value = try frame.stack.peek();
    
    // Check if the value is negative (MSB is 1)
    const is_negative = (value.* >> 255) == 1;
    
    if (shift >= 256) {
        // If shift is >= 256, result is either 0 (if positive) or all 1s (if negative)
        if (is_negative) {
            value.* = ~@as(u256, 0); // All bits set to 1
        } else {
            value.* = 0;
        }
    } else {
        if (is_negative) {
            // For negative numbers, do logical right shift and then set the high bits
            const mask = (~@as(u256, 0)) << (256 - @as(u8, @intCast(shift)));
            value.* = (value.* >> @intCast(shift)) | mask;
        } else {
            // For positive numbers, SAR is the same as SHR
            value.* = value.* >> @intCast(shift);
        }
    }
    
    return "";
}

/// Register all bitwise opcodes in the given jump table
pub fn registerBitwiseOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable.JumpTable) !void {
    // AND (0x16)
    const and_op = try allocator.create(JumpTable.Operation);
    and_op.* = JumpTable.Operation{
        .execute = opAnd,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x16] = and_op;
    
    // OR (0x17)
    const or_op = try allocator.create(JumpTable.Operation);
    or_op.* = JumpTable.Operation{
        .execute = opOr,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x17] = or_op;
    
    // XOR (0x18)
    const xor_op = try allocator.create(JumpTable.Operation);
    xor_op.* = JumpTable.Operation{
        .execute = opXor,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x18] = xor_op;
    
    // NOT (0x19)
    const not_op = try allocator.create(JumpTable.Operation);
    not_op.* = JumpTable.Operation{
        .execute = opNot,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(1, 1),
        .max_stack = JumpTable.maxStack(1, 1),
    };
    jump_table.table[0x19] = not_op;
    
    // BYTE (0x1A)
    const byte_op = try allocator.create(JumpTable.Operation);
    byte_op.* = JumpTable.Operation{
        .execute = opByte,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x1A] = byte_op;
    
    // SHL (0x1B)
    const shl_op = try allocator.create(JumpTable.Operation);
    shl_op.* = JumpTable.Operation{
        .execute = opShl,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x1B] = shl_op;
    
    // SHR (0x1C)
    const shr_op = try allocator.create(JumpTable.Operation);
    shr_op.* = JumpTable.Operation{
        .execute = opShr,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x1C] = shr_op;
    
    // SAR (0x1D)
    const sar_op = try allocator.create(JumpTable.Operation);
    sar_op.* = JumpTable.Operation{
        .execute = opSar,
        .constant_gas = JumpTable.GasFastestStep,
        .min_stack = JumpTable.minStack(2, 1),
        .max_stack = JumpTable.maxStack(2, 1),
    };
    jump_table.table[0x1D] = sar_op;
}

// Unit tests for bitwise operations
const testing = std.testing;

// Simple mock implementation for testing
const MockInterpreter = struct {
    // Simplified mock interpreter for testing
};

const MockFrame = struct {
    stack: Stack,
    
    pub fn init() MockFrame {
        return MockFrame{ .stack = Stack{} };
    }
};

test "AND operation" {
    var frame = MockFrame.init();
    var mock_interpreter = MockInterpreter{};
    
    try frame.stack.push(0xFF00); // First push (x)
    try frame.stack.push(0x0FF0); // Second push (y)
    
    // Execute opAnd - this should perform 0xFF00 & 0x0FF0 = 0x0F00
    _ = try opAnd(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x0F00), result);
}

test "OR operation" {
    var frame = MockFrame.init();
    var mock_interpreter = MockInterpreter{};
    
    try frame.stack.push(0xFF00); // First push (x)
    try frame.stack.push(0x0FF0); // Second push (y)
    
    // Execute opOr - this should perform 0xFF00 | 0x0FF0 = 0xFFF0
    _ = try opOr(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0xFFF0), result);
}

test "XOR operation" {
    var frame = MockFrame.init();
    var mock_interpreter = MockInterpreter{};
    
    try frame.stack.push(0xFF00); // First push (x)
    try frame.stack.push(0x0FF0); // Second push (y)
    
    // Execute opXor - this should perform 0xFF00 ^ 0x0FF0 = 0xF0F0
    _ = try opXor(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0xF0F0), result);
}

test "NOT operation" {
    var frame = MockFrame.init();
    var mock_interpreter = MockInterpreter{};
    
    try frame.stack.push(0xFF00); // Push value
    
    // Execute opNot - this should perform ~0xFF00
    _ = try opNot(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, ~@as(u256, 0xFF00)), result);
}

test "BYTE operation" {
    var frame = MockFrame.init();
    var mock_interpreter = MockInterpreter{};
    
    // Create a value with distinct bytes for testing
    const test_value: u256 = 0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20;
    
    // Test getting the 0th byte (should be 0x01)
    try frame.stack.push(test_value);
    try frame.stack.push(0); // Byte index 0
    
    _ = try opByte(0, &mock_interpreter, &frame);
    
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x01), result1);
    
    // Test getting the 31st byte (should be 0x20)
    try frame.stack.push(test_value);
    try frame.stack.push(31); // Byte index 31
    
    _ = try opByte(0, &mock_interpreter, &frame);
    
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x20), result2);
    
    // Test getting a byte out of range (should be 0)
    try frame.stack.push(test_value);
    try frame.stack.push(32); // Byte index out of range
    
    _ = try opByte(0, &mock_interpreter, &frame);
    
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
}

test "SHL operation" {
    var frame = MockFrame.init();
    var mock_interpreter = MockInterpreter{};
    
    try frame.stack.push(1); // Value
    try frame.stack.push(1); // Shift by 1
    
    // Execute opShl - this should perform 1 << 1 = 2
    _ = try opShl(0, &mock_interpreter, &frame);
    
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), result1);
    
    // Test with larger shift
    try frame.stack.push(1);
    try frame.stack.push(8); // Shift by 8
    
    _ = try opShl(0, &mock_interpreter, &frame);
    
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 256), result2);
    
    // Test with shift >= 256 (should be 0)
    try frame.stack.push(1);
    try frame.stack.push(256); // Shift by 256
    
    _ = try opShl(0, &mock_interpreter, &frame);
    
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
}

test "SHR operation" {
    var frame = MockFrame.init();
    var mock_interpreter = MockInterpreter{};
    
    try frame.stack.push(8); // Value
    try frame.stack.push(2); // Shift by 2
    
    // Execute opShr - this should perform 8 >> 2 = 2
    _ = try opShr(0, &mock_interpreter, &frame);
    
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), result1);
    
    // Test with larger value
    try frame.stack.push(256);
    try frame.stack.push(8); // Shift by 8
    
    _ = try opShr(0, &mock_interpreter, &frame);
    
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result2);
    
    // Test with shift >= 256 (should be 0)
    try frame.stack.push(256);
    try frame.stack.push(256); // Shift by 256
    
    _ = try opShr(0, &mock_interpreter, &frame);
    
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
}

test "SAR operation" {
    var frame = MockFrame.init();
    var mock_interpreter = MockInterpreter{};
    
    // Test with positive value
    try frame.stack.push(8); // Value
    try frame.stack.push(2); // Shift by 2
    
    // Execute opSar - for positive values, this should be the same as SHR
    _ = try opSar(0, &mock_interpreter, &frame);
    
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), result1);
    
    // Test with negative value (MSB set)
    const negative_value: u256 = (1 << 255) | 8; // High bit set, with value 8
    try frame.stack.push(negative_value);
    try frame.stack.push(2); // Shift by 2
    
    _ = try opSar(0, &mock_interpreter, &frame);
    
    const result2 = try frame.stack.pop();
    // The result should be arithmetic right shift, preserving the sign bit
    const expected2 = (negative_value >> 2) | (1 << 255) | (1 << 254) | (1 << 253);
    try testing.expectEqual(expected2, result2);
    
    // Test with shift >= 256 for positive value (should be 0)
    try frame.stack.push(8);
    try frame.stack.push(256); // Shift by 256
    
    _ = try opSar(0, &mock_interpreter, &frame);
    
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
    
    // Test with shift >= 256 for negative value (should be all 1s)
    try frame.stack.push(negative_value);
    try frame.stack.push(256); // Shift by 256
    
    _ = try opSar(0, &mock_interpreter, &frame);
    
    const result4 = try frame.stack.pop();
    try testing.expectEqual(~@as(u256, 0), result4); // All bits set
}