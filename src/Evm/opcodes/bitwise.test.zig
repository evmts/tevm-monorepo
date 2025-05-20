const std = @import("std");
const testing = std.testing;
const bitwise = @import("bitwise.zig");
const EvmModule = @import("Evm");
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

const ExecutionError = EvmModule.InterpreterError;
const TestValue = u256_native;

test "AND operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(std.testing.allocator);

    try frame.stack.push(0xFF00);
    try frame.stack.push(0x0FF0);

    _ = try bitwise.opAnd(0, &mock_interpreter, &frame);

    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x0F00), result);
}

test "OR operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(std.testing.allocator);

    try frame.stack.push(0xFF00);
    try frame.stack.push(0x0FF0);

    _ = try bitwise.opOr(0, &mock_interpreter, &frame);

    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0xFFF0), result);
}

test "XOR operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(std.testing.allocator);

    try frame.stack.push(0xFF00);
    try frame.stack.push(0x0FF0);

    _ = try bitwise.opXor(0, &mock_interpreter, &frame);

    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0xF0F0), result);
}

test "NOT operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(std.testing.allocator);

    try frame.stack.push(0xFF00);

    _ = try bitwise.opNot(0, &mock_interpreter, &frame);

    const result = try frame.stack.pop();
    try testing.expectEqual(@as(u256, ~@as(u256, 0xFF00)), result);
}

test "BYTE operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(std.testing.allocator);

    const test_value: u256 = 0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20;

    try frame.stack.push(test_value);
    try frame.stack.push(0);

    _ = try bitwise.opByte(0, &mock_interpreter, &frame);

    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x01), result1);

    try frame.stack.push(test_value);
    try frame.stack.push(31);

    _ = try bitwise.opByte(0, &mock_interpreter, &frame);

    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x20), result2);

    try frame.stack.push(test_value);
    try frame.stack.push(32);

    _ = try bitwise.opByte(0, &mock_interpreter, &frame);

    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
}

test "SHL operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(std.testing.allocator);

    try frame.stack.push(1);
    try frame.stack.push(1);

    _ = try bitwise.opShl(0, &mock_interpreter, &frame);

    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), result1);

    try frame.stack.push(1);
    try frame.stack.push(8);

    _ = try bitwise.opShl(0, &mock_interpreter, &frame);

    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 256), result2);

    try frame.stack.push(1);
    try frame.stack.push(256);

    _ = try bitwise.opShl(0, &mock_interpreter, &frame);

    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
}

test "SHR operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(std.testing.allocator);

    try frame.stack.push(8);
    try frame.stack.push(2);

    _ = try bitwise.opShr(0, &mock_interpreter, &frame);

    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), result1);

    try frame.stack.push(256);
    try frame.stack.push(8);

    _ = try bitwise.opShr(0, &mock_interpreter, &frame);

    const result2 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 1), result2);

    try frame.stack.push(256);
    try frame.stack.push(256);

    _ = try bitwise.opShr(0, &mock_interpreter, &frame);

    const result3 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), result3);
}

test "SAR operation" {
    var frame = try MockFrame.init(testing.allocator);
    defer frame.deinit();

    var mock_interpreter = MockInterpreter.init(std.testing.allocator);

    try frame.stack.push(8);
    try frame.stack.push(2);

    _ = try bitwise.opSar(0, &mock_interpreter, &frame);

    const result1 = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 2), result1);

    const negative_value: u256 = (1 << 255) | 8;
    try frame.stack.push(negative_value);
    try frame.stack.push(2);

    _ = try bitwise.opSar(0, &mock_interpreter, &frame);

    const result2 = try frame.stack.pop();
    const expected2 = (negative_value >> 2) | (1 << 255) | (1 << 254) | (1 << 253);
    try testing.expectEqual(expected2, result2);

    try frame.stack.push(8);
    try frame.stack.push(256);

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
