const std = @import("std");
const jumpTableModule = @import("jumpTable/package.zig");
const JumpTable = jumpTableModule.JumpTable;
const Operation = jumpTableModule.Operation;
const Interpreter = @import("interpreter.zig").Interpreter;
const Frame = @import("Frame.zig").Frame;
const ExecutionError = @import("interpreter.zig").InterpreterError;
const Stack = @import("Stack.zig").Stack;
const StackError = @import("Stack.zig").StackError;
const Memory = @import("Memory.zig").Memory;
// u256 is a built-in type in Zig, no need to import

// Helper to convert Stack errors to ExecutionError
fn mapStackError(err: StackError) ExecutionError {
    return switch (err) {
        error.OutOfBounds => ExecutionError.StackUnderflow,
        error.StackOverflow => ExecutionError.StackOverflow,
        error.OutOfMemory => ExecutionError.OutOfGas,
    };
}

// AND operation - bitwise AND of the top two stack items
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
    const y = frame.stack.pop() catch |err| return mapStackError(err);
    if (@import("builtin").mode == .Debug) {
        std.debug.print("opAnd: Popped y={x}\n", .{y});
    }
    
    // Get reference to x (which is now at the top of the stack)
    const x = frame.stack.peek() catch |err| return mapStackError(err);
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

// OR operation - bitwise OR of the top two stack items
pub fn opOr(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop y from the stack
    const y = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Get reference to x (which is now at the top of the stack)
    const x = frame.stack.peek() catch |err| return mapStackError(err);
    
    // Perform bitwise OR and store result
    x.* = x.* | y;
    
    return "";
}

// XOR operation - bitwise XOR of the top two stack items
pub fn opXor(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop y from the stack
    const y = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Get reference to x (which is now at the top of the stack)
    const x = frame.stack.peek() catch |err| return mapStackError(err);
    
    // Perform bitwise XOR and store result
    x.* = x.* ^ y;
    
    return "";
}

// NOT operation - bitwise NOT of the top stack item
pub fn opNot(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 1 item on the stack
    if (frame.stack.size < 1) {
        return ExecutionError.StackUnderflow;
    }
    
    // Get reference to x (which is at the top of the stack)
    const x = frame.stack.peek() catch |err| return mapStackError(err);
    
    // Perform bitwise NOT and store result
    x.* = ~x.*;
    
    return "";
}

// BYTE operation - retrieves a byte from the operand stack
pub fn opByte(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop n (byte index) from the stack
    const n = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Get reference to x (value to extract byte from)
    const x = frame.stack.peek() catch |err| return mapStackError(err);
    
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

// SHL operation - left bit-shifting operation
pub fn opShl(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop shift from the stack
    const shift = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Get reference to value (which is now at the top of the stack)
    const value = frame.stack.peek() catch |err| return mapStackError(err);
    
    // If shift is >= 256, result is 0 (all bits are shifted out)
    if (shift >= 256) {
        value.* = 0;
    } else {
        // Perform left shift by the specified amount
        value.* = value.* << @intCast(shift);
    }
    
    return "";
}

// SHR operation - logical right bit-shifting operation
pub fn opShr(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop shift from the stack
    const shift = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Get reference to value (which is now at the top of the stack)
    const value = frame.stack.peek() catch |err| return mapStackError(err);
    
    // If shift is >= 256, result is 0 (all bits are shifted out)
    if (shift >= 256) {
        value.* = 0;
    } else {
        // Perform logical right shift by the specified amount
        value.* = value.* >> @intCast(shift);
    }
    
    return "";
}

// SAR operation - arithmetic right bit-shifting operation
pub fn opSar(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    _ = interpreter;
    _ = pc;
    
    // We need at least 2 items on the stack
    if (frame.stack.size < 2) {
        return ExecutionError.StackUnderflow;
    }
    
    // Pop shift from the stack
    const shift = frame.stack.pop() catch |err| return mapStackError(err);
    
    // Get reference to value (which is now at the top of the stack)
    const value = frame.stack.peek() catch |err| return mapStackError(err);
    
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
            const mask = (~@as(u256, 0)) << @intCast(256 - shift);
            value.* = (value.* >> @intCast(shift)) | mask;
        } else {
            // For positive numbers, SAR is the same as SHR
            value.* = value.* >> @intCast(shift);
        }
    }
    
    return "";
}

// Register all bitwise opcodes in the given jump table
pub fn registerBitwiseOpcodes(allocator: std.mem.Allocator, jump_table: *JumpTable) !void {
    // AND (0x16)
    const and_op = try allocator.create(Operation);
    and_op.* = Operation{
        .execute = opAnd,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x16] = and_op;
    
    // OR (0x17)
    const or_op = try allocator.create(Operation);
    or_op.* = Operation{
        .execute = opOr,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x17] = or_op;
    
    // XOR (0x18)
    const xor_op = try allocator.create(Operation);
    xor_op.* = Operation{
        .execute = opXor,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x18] = xor_op;
    
    // NOT (0x19)
    const not_op = try allocator.create(Operation);
    not_op.* = Operation{
        .execute = opNot,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(1, 1),
        .max_stack = jumpTableModule.maxStack(1, 1),
    };
    jump_table.table[0x19] = not_op;
    
    // BYTE (0x1A)
    const byte_op = try allocator.create(Operation);
    byte_op.* = Operation{
        .execute = opByte,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x1A] = byte_op;
    
    // SHL (0x1B)
    const shl_op = try allocator.create(Operation);
    shl_op.* = Operation{
        .execute = opShl,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x1B] = shl_op;
    
    // SHR (0x1C)
    const shr_op = try allocator.create(Operation);
    shr_op.* = Operation{
        .execute = opShr,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x1C] = shr_op;
    
    // SAR (0x1D)
    const sar_op = try allocator.create(Operation);
    sar_op.* = Operation{
        .execute = opSar,
        .constant_gas = jumpTableModule.GasFastestStep,
        .min_stack = jumpTableModule.minStack(2, 1),
        .max_stack = jumpTableModule.maxStack(2, 1),
    };
    jump_table.table[0x1D] = sar_op;
}

// Tests
test "AND operation" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Create a frame with a stack
    const stack = Stack{};
    // Stack no longer needs deinit
    
    var memory = try Memory.init(allocator);
    defer memory.deinit();
    
    var frame = Frame{
        .code = &[_]u8{},
        .pc = 0,
        .gas_left = 1000000,
        .stack = stack,
        .memory = memory,
        .memory_last = 0,
        .table_size = 0,
        .ret_offset = 0,
        .ret_len = 0,
    };
    
    // Create a dummy interpreter
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    // Push test values
    try frame.stack.push(0xFF00);
    try frame.stack.push(0x0FF0);
    
    // Execute AND operation
    _ = try opAnd(0, &interpreter, &frame);
    
    // Check result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x0F00), result);
}

test "OR operation" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const stack = Stack{};
    // Stack no longer needs deinit
    
    var memory = try Memory.init(allocator);
    defer memory.deinit();
    
    var frame = Frame{
        .code = &[_]u8{},
        .pc = 0,
        .gas_left = 1000000,
        .stack = stack,
        .memory = memory,
        .memory_last = 0,
        .table_size = 0,
        .ret_offset = 0,
        .ret_len = 0,
    };
    
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    try frame.stack.push(0xFF00);
    try frame.stack.push(0x0FF0);
    
    _ = try opOr(0, &interpreter, &frame);
    
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0xFFF0), result);
}

test "XOR operation" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const stack = Stack{};
    // Stack no longer needs deinit
    
    var memory = try Memory.init(allocator);
    defer memory.deinit();
    
    var frame = Frame{
        .code = &[_]u8{},
        .pc = 0,
        .gas_left = 1000000,
        .stack = stack,
        .memory = memory,
        .memory_last = 0,
        .table_size = 0,
        .ret_offset = 0,
        .ret_len = 0,
    };
    
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    try frame.stack.push(0xFF00);
    try frame.stack.push(0x0FF0);
    
    _ = try opXor(0, &interpreter, &frame);
    
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0xF0F0), result);
}

test "NOT operation" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const stack = Stack{};
    // Stack no longer needs deinit
    
    var memory = try Memory.init(allocator);
    defer memory.deinit();
    
    var frame = Frame{
        .code = &[_]u8{},
        .pc = 0,
        .gas_left = 1000000,
        .stack = stack,
        .memory = memory,
        .memory_last = 0,
        .table_size = 0,
        .ret_offset = 0,
        .ret_len = 0,
    };
    
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    try frame.stack.push(0xFF00);
    
    _ = try opNot(0, &interpreter, &frame);
    
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, ~@as(u256, 0xFF00)), result);
}

test "BYTE operation" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const stack = Stack{};
    // Stack no longer needs deinit
    
    var memory = try Memory.init(allocator);
    defer memory.deinit();
    
    var frame = Frame{
        .code = &[_]u8{},
        .pc = 0,
        .gas_left = 1000000,
        .stack = stack,
        .memory = memory,
        .memory_last = 0,
        .table_size = 0,
        .ret_offset = 0,
        .ret_len = 0,
    };
    
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    const test_value: u256 = 0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20;
    
    // Test byte 0 (most significant)
    try frame.stack.push(test_value);
    try frame.stack.push(0);
    
    _ = try opByte(0, &interpreter, &frame);
    
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x01), result1);
    
    // Test byte 31 (least significant)
    try frame.stack.push(test_value);
    try frame.stack.push(31);
    
    _ = try opByte(0, &interpreter, &frame);
    
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x20), result2);
    
    // Test out of range (index >= 32)
    try frame.stack.push(test_value);
    try frame.stack.push(32);
    
    _ = try opByte(0, &interpreter, &frame);
    
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
}

test "SHL operation" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const stack = Stack{};
    // Stack no longer needs deinit
    
    var memory = try Memory.init(allocator);
    defer memory.deinit();
    
    var frame = Frame{
        .code = &[_]u8{},
        .pc = 0,
        .gas_left = 1000000,
        .stack = stack,
        .memory = memory,
        .memory_last = 0,
        .table_size = 0,
        .ret_offset = 0,
        .ret_len = 0,
    };
    
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    // Test shift by 1
    try frame.stack.push(1);
    try frame.stack.push(1);
    
    _ = try opShl(0, &interpreter, &frame);
    
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), result1);
    
    // Test shift by 8
    try frame.stack.push(1);
    try frame.stack.push(8);
    
    _ = try opShl(0, &interpreter, &frame);
    
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 256), result2);
    
    // Test shift >= 256 (should be 0)
    try frame.stack.push(1);
    try frame.stack.push(256);
    
    _ = try opShl(0, &interpreter, &frame);
    
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
}

test "SHR operation" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const stack = Stack{};
    // Stack no longer needs deinit
    
    var memory = try Memory.init(allocator);
    defer memory.deinit();
    
    var frame = Frame{
        .code = &[_]u8{},
        .pc = 0,
        .gas_left = 1000000,
        .stack = stack,
        .memory = memory,
        .memory_last = 0,
        .table_size = 0,
        .ret_offset = 0,
        .ret_len = 0,
    };
    
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    // Test shift by 2
    try frame.stack.push(8);
    try frame.stack.push(2);
    
    _ = try opShr(0, &interpreter, &frame);
    
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), result1);
    
    // Test shift by 8
    try frame.stack.push(256);
    try frame.stack.push(8);
    
    _ = try opShr(0, &interpreter, &frame);
    
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result2);
    
    // Test shift >= 256 (should be 0)
    try frame.stack.push(256);
    try frame.stack.push(256);
    
    _ = try opShr(0, &interpreter, &frame);
    
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
}

test "SAR operation" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const stack = Stack{};
    // Stack no longer needs deinit
    
    var memory = try Memory.init(allocator);
    defer memory.deinit();
    
    var frame = Frame{
        .code = &[_]u8{},
        .pc = 0,
        .gas_left = 1000000,
        .stack = stack,
        .memory = memory,
        .memory_last = 0,
        .table_size = 0,
        .ret_offset = 0,
        .ret_len = 0,
    };
    
    var interpreter = Interpreter{
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .allocator = allocator,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    // Test positive value
    try frame.stack.push(8);
    try frame.stack.push(2);
    
    _ = try opSar(0, &interpreter, &frame);
    
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), result1);
    
    // Test negative value
    const negative_value: u256 = (@as(u256, 1) << 255) | 8;
    try frame.stack.push(negative_value);
    try frame.stack.push(2);
    
    _ = try opSar(0, &interpreter, &frame);
    
    const result2 = try frame.stack.pop();
    const expected2 = (negative_value >> 2) | (@as(u256, 3) << 254);
    try testing.expectEqual(expected2, result2);
    
    // Test positive value with shift >= 256
    try frame.stack.push(8);
    try frame.stack.push(256);
    
    _ = try opSar(0, &interpreter, &frame);
    
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
    
    // Test negative value with shift >= 256 (should be all 1s)
    try frame.stack.push(negative_value);
    try frame.stack.push(256);
    
    _ = try opSar(0, &interpreter, &frame);
    
    const result4 = try frame.stack.pop();
    try testing.expectEqual(~@as(u256, 0), result4);
}

