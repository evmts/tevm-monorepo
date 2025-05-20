const std = @import("std");
const testing = std.testing;
const comparison = @import("comparison.zig");
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

test "LT operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    try frame.stack.push(5); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    // Execute opLt - this should compare 5 < 10 and result in 1
    _ = try comparison.opLt(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result);
    
    // Test case where x > y
    try frame.stack.push(20); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    _ = try comparison.opLt(0, &mock_interpreter, &frame);
    
    // Check the result - should be 0 since 20 < 10 is false
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
}

test "GT operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    try frame.stack.push(20); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    // Execute opGt - this should compare 20 > 10 and result in 1
    _ = try comparison.opGt(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result);
    
    // Test case where x < y
    try frame.stack.push(5); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    _ = try comparison.opGt(0, &mock_interpreter, &frame);
    
    // Check the result - should be 0 since 5 > 10 is false
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
}

test "SLT operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    // Test with both positive numbers
    try frame.stack.push(5); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    // Execute opSlt - this should compare signed 5 < 10 and result in 1
    _ = try comparison.opSlt(0, &mock_interpreter, &frame);
    
    // Check the result
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result1);
    
    // Test with negative x and positive y (negative < positive)
    const neg_x: u256 = (1 << 255) | 5; // -5 in two's complement
    try frame.stack.push(neg_x); // First push (negative x)
    try frame.stack.push(10); // Second push (positive y)
    
    _ = try comparison.opSlt(0, &mock_interpreter, &frame);
    
    // Check the result - should be 1 since negative < positive
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result2);
    
    // Test with positive x and negative y (positive > negative)
    try frame.stack.push(5); // First push (positive x)
    const neg_y: u256 = (1 << 255) | 10; // -10 in two's complement
    try frame.stack.push(neg_y); // Second push (negative y)
    
    _ = try comparison.opSlt(0, &mock_interpreter, &frame);
    
    // Check the result - should be 0 since positive > negative
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
    
    // Test with both negative numbers
    const neg_x2: u256 = (1 << 255) | 20; // -20 in two's complement
    const neg_y2: u256 = (1 << 255) | 10; // -10 in two's complement
    try frame.stack.push(neg_x2); // First push (more negative x)
    try frame.stack.push(neg_y2); // Second push (less negative y)
    
    _ = try comparison.opSlt(0, &mock_interpreter, &frame);
    
    // Check the result - should be 1 since -20 < -10
    const result4 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result4);
}

test "SGT operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    // Test with both positive numbers
    try frame.stack.push(20); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    // Execute opSgt - this should compare signed 20 > 10 and result in 1
    _ = try comparison.opSgt(0, &mock_interpreter, &frame);
    
    // Check the result
    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result1);
    
    // Test with negative x and positive y (negative < positive)
    const neg_x: u256 = (1 << 255) | 5; // -5 in two's complement
    try frame.stack.push(neg_x); // First push (negative x)
    try frame.stack.push(10); // Second push (positive y)
    
    _ = try comparison.opSgt(0, &mock_interpreter, &frame);
    
    // Check the result - should be 0 since negative < positive
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
    
    // Test with positive x and negative y (positive > negative)
    try frame.stack.push(5); // First push (positive x)
    const neg_y: u256 = (1 << 255) | 10; // -10 in two's complement
    try frame.stack.push(neg_y); // Second push (negative y)
    
    _ = try comparison.opSgt(0, &mock_interpreter, &frame);
    
    // Check the result - should be 1 since positive > negative
    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result3);
    
    // Test with both negative numbers
    const neg_x2: u256 = (1 << 255) | 10; // -10 in two's complement
    const neg_y2: u256 = (1 << 255) | 20; // -20 in two's complement
    try frame.stack.push(neg_x2); // First push (less negative x)
    try frame.stack.push(neg_y2); // Second push (more negative y)
    
    _ = try comparison.opSgt(0, &mock_interpreter, &frame);
    
    // Check the result - should be 1 since -10 > -20
    const result4 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result4);
}

test "EQ operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    try frame.stack.push(10); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    // Execute opEq - this should compare 10 == 10 and result in 1
    _ = try comparison.opEq(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result);
    
    // Test case where x != y
    try frame.stack.push(5); // First push (x)
    try frame.stack.push(10); // Second push (y)
    
    _ = try comparison.opEq(0, &mock_interpreter, &frame);
    
    // Check the result - should be 0 since 5 == 10 is false
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
}

test "ISZERO operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    try frame.stack.push(0); // Push 0
    
    // Execute opIszero - this should check if 0 == 0 and result in 1
    _ = try comparison.opIszero(0, &mock_interpreter, &frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result);
    
    // Test case with non-zero value
    try frame.stack.push(42); // Push non-zero value
    
    _ = try comparison.opIszero(0, &mock_interpreter, &frame);
    
    // Check the result - should be 0 since 42 == 0 is false
    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
}