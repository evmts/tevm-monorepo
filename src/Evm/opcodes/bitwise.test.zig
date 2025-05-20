const std = @import("std");
const testing = std.testing;
const bitwise = @import("bitwise.zig");
const Stack = @import("../Stack.zig").Stack;

// Simple mock implementation for testing
const MockInterpreter = struct {
    // Simplified mock interpreter for testing
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) MockInterpreter {
        return MockInterpreter{ .allocator = allocator };
    }
};

const MockFrame = struct {
    stack: Stack,
    gas: u64 = 1000000,
    
    pub fn init() !MockFrame {
        var stack = Stack{};
        try stack.init(std.testing.allocator, 1024);
        
        return MockFrame{ 
            .stack = stack,
        };
    }
    
    pub fn deinit(self: *MockFrame) void {
        self.stack.deinit();
    }
};

test "AND operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    try frame.stack.push(0xFF00); // First push (x)
    try frame.stack.push(0x0FF0); // Second push (y)
    
    // Execute opAnd - this should perform 0xFF00 & 0x0FF0 = 0x0F00
    _ = try bitwise.opAnd(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x0F00), result);
}

test "OR operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    try frame.stack.push(0xFF00); // First push (x)
    try frame.stack.push(0x0FF0); // Second push (y)
    
    // Execute opOr - this should perform 0xFF00 | 0x0FF0 = 0xFFF0
    _ = try bitwise.opOr(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0xFFF0), result);
}

test "XOR operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    try frame.stack.push(0xFF00); // First push (x)
    try frame.stack.push(0x0FF0); // Second push (y)
    
    // Execute opXor - this should perform 0xFF00 ^ 0x0FF0 = 0xF0F0
    _ = try bitwise.opXor(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0xF0F0), result);
}

test "NOT operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    try frame.stack.push(0xFF00); // Push value
    
    // Execute opNot - this should perform ~0xFF00
    _ = try bitwise.opNot(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, ~@as(u256, 0xFF00)), result);
}

test "BYTE operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    // Create a value with distinct bytes for testing
    const test_value: u256 = 0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20;
    
    // Test getting the 0th byte (should be 0x01)
    try frame.stack.push(test_value);
    try frame.stack.push(0); // Byte index 0
    
    _ = try bitwise.opByte(0, &mock_interpreter, &frame);
    
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x01), result1);
    
    // Test getting the 31st byte (should be 0x20)
    try frame.stack.push(test_value);
    try frame.stack.push(31); // Byte index 31
    
    _ = try bitwise.opByte(0, &mock_interpreter, &frame);
    
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x20), result2);
    
    // Test getting a byte out of range (should be 0)
    try frame.stack.push(test_value);
    try frame.stack.push(32); // Byte index out of range
    
    _ = try bitwise.opByte(0, &mock_interpreter, &frame);
    
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
}

test "SHL operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    try frame.stack.push(1); // Value
    try frame.stack.push(1); // Shift by 1
    
    // Execute opShl - this should perform 1 << 1 = 2
    _ = try bitwise.opShl(0, &mock_interpreter, &frame);
    
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), result1);
    
    // Test with larger shift
    try frame.stack.push(1);
    try frame.stack.push(8); // Shift by 8
    
    _ = try bitwise.opShl(0, &mock_interpreter, &frame);
    
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 256), result2);
    
    // Test with shift >= 256 (should be 0)
    try frame.stack.push(1);
    try frame.stack.push(256); // Shift by 256
    
    _ = try bitwise.opShl(0, &mock_interpreter, &frame);
    
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
}

test "SHR operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    try frame.stack.push(8); // Value
    try frame.stack.push(2); // Shift by 2
    
    // Execute opShr - this should perform 8 >> 2 = 2
    _ = try bitwise.opShr(0, &mock_interpreter, &frame);
    
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), result1);
    
    // Test with larger value
    try frame.stack.push(256);
    try frame.stack.push(8); // Shift by 8
    
    _ = try bitwise.opShr(0, &mock_interpreter, &frame);
    
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result2);
    
    // Test with shift >= 256 (should be 0)
    try frame.stack.push(256);
    try frame.stack.push(256); // Shift by 256
    
    _ = try bitwise.opShr(0, &mock_interpreter, &frame);
    
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
}

test "SAR operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    // Test with positive value
    try frame.stack.push(8); // Value
    try frame.stack.push(2); // Shift by 2
    
    // Execute opSar - for positive values, this should be the same as SHR
    _ = try bitwise.opSar(0, &mock_interpreter, &frame);
    
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), result1);
    
    // Test with negative value (MSB set)
    const negative_value: u256 = (1 << 255) | 8; // High bit set, with value 8
    try frame.stack.push(negative_value);
    try frame.stack.push(2); // Shift by 2
    
    _ = try bitwise.opSar(0, &mock_interpreter, &frame);
    
    const result2 = try frame.stack.pop();
    // The result should be arithmetic right shift, preserving the sign bit
    const expected2 = (negative_value >> 2) | (1 << 255) | (1 << 254) | (1 << 253);
    try testing.expectEqual(expected2, result2);
    
    // Test with shift >= 256 for positive value (should be 0)
    try frame.stack.push(8);
    try frame.stack.push(256); // Shift by 256
    
    _ = try bitwise.opSar(0, &mock_interpreter, &frame);
    
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
    
    // Test with shift >= 256 for negative value (should be all 1s)
    try frame.stack.push(negative_value);
    try frame.stack.push(256); // Shift by 256
    
    _ = try bitwise.opSar(0, &mock_interpreter, &frame);
    
    const result4 = try frame.stack.pop();
    try testing.expectEqual(~@as(u256, 0), result4); // All bits set
}