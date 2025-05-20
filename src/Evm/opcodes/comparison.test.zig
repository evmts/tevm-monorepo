const std = @import("std");
const testing = std.testing;
const comparison = @import("comparison.zig");

const EvmModule = @import("../evm.zig");
const Stack = EvmModule.Stack;
const u256_native = u256;

// Simple mock implementation for testing
const MockInterpreter = struct {
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) MockInterpreter {
        return MockInterpreter{ .allocator = allocator };
    }
};

const MockFrame = struct {
    stack: Stack,
    gas: u64 = 1000000,

    pub fn init(allocator: std.mem.Allocator) !MockFrame {
        var stack_instance = Stack{};
        try stack_instance.init(allocator, 1024);

        return MockFrame{
            .stack = stack_instance,
        };
    }

    pub fn deinit(self: *MockFrame) void {
        self.stack.deinit();
    }
};

test "LT operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(testing.allocator);

    try frame.stack.push(u256_native, 5);
    try frame.stack.push(u256_native, 10);

    _ = try comparison.opLt(0, &mock_interpreter, &frame);

    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result);

    try frame.stack.push(u256_native, 20);
    try frame.stack.push(u256_native, 10);

    _ = try comparison.opLt(0, &mock_interpreter, &frame);

    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
}

test "GT operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(testing.allocator);

    try frame.stack.push(u256_native, 20);
    try frame.stack.push(u256_native, 10);

    _ = try comparison.opGt(0, &mock_interpreter, &frame);

    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result);

    try frame.stack.push(u256_native, 5);
    try frame.stack.push(u256_native, 10);

    _ = try comparison.opGt(0, &mock_interpreter, &frame);

    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
}

test "SLT operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(testing.allocator);

    try frame.stack.push(u256_native, 5);
    try frame.stack.push(u256_native, 10);

    _ = try comparison.opSlt(0, &mock_interpreter, &frame);

    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result1);

    const neg_x: u256 = (1 << 255) | 5;
    try frame.stack.push(neg_x);
    try frame.stack.push(u256_native, 10);

    _ = try comparison.opSlt(0, &mock_interpreter, &frame);

    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result2);

    try frame.stack.push(u256_native, 5);
    const neg_y: u256 = (1 << 255) | 10;
    try frame.stack.push(neg_y);

    _ = try comparison.opSlt(0, &mock_interpreter, &frame);

    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);

    const neg_x2: u256 = (1 << 255) | 20;
    const neg_y2: u256 = (1 << 255) | 10;
    try frame.stack.push(neg_x2);
    try frame.stack.push(neg_y2);

    _ = try comparison.opSlt(0, &mock_interpreter, &frame);

    const result4 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result4);
}

test "SGT operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(testing.allocator);

    try frame.stack.push(u256_native, 20);
    try frame.stack.push(u256_native, 10);

    _ = try comparison.opSgt(0, &mock_interpreter, &frame);

    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result1);

    const neg_x: u256 = (1 << 255) | 5;
    try frame.stack.push(neg_x);
    try frame.stack.push(u256_native, 10);

    _ = try comparison.opSgt(0, &mock_interpreter, &frame);

    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);

    try frame.stack.push(u256_native, 5);
    const neg_y: u256 = (1 << 255) | 10;
    try frame.stack.push(neg_y);

    _ = try comparison.opSgt(0, &mock_interpreter, &frame);

    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result3);

    const neg_x2: u256 = (1 << 255) | 10;
    const neg_y2: u256 = (1 << 255) | 20;
    try frame.stack.push(neg_x2);
    try frame.stack.push(neg_y2);

    _ = try comparison.opSgt(0, &mock_interpreter, &frame);

    const result4 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result4);
}

test "EQ operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(testing.allocator);

    try frame.stack.push(u256_native, 10);
    try frame.stack.push(u256_native, 10);

    _ = try comparison.opEq(0, &mock_interpreter, &frame);

    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result);

    try frame.stack.push(u256_native, 5);
    try frame.stack.push(u256_native, 10);

    _ = try comparison.opEq(0, &mock_interpreter, &frame);

    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
}

test "ISZERO operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(testing.allocator);

    try frame.stack.push(u256_native, 0);

    _ = try comparison.opIszero(0, &mock_interpreter, &frame);

    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result);

    try frame.stack.push(u256_native, 42);

    _ = try comparison.opIszero(0, &mock_interpreter, &frame);

    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result2);
}
