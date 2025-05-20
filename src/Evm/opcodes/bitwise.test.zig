const std = @import("std");
const testing = std.testing;

// Import the Evm module using the global import path
const EvmModule = @import("Evm");
// Get bitwise opcodes functions from the Evm module
const bitwise = EvmModule.opcodes.bitwise;

// Create simplified Stack implementation for testing
const TestStack = struct {
    values: std.ArrayList(u256_native),
    
    pub fn init(self: *TestStack, allocator: std.mem.Allocator, capacity: usize) !void {
        _ = capacity;  // Unused in test
        self.values = std.ArrayList(u256_native).init(allocator);
    }
    
    pub fn deinit(self: *TestStack) void {
        self.values.deinit();
    }
    
    pub fn push(self: *TestStack, value: u256_native) !void {
        try self.values.append(value);
    }
    
    pub fn pop(self: *TestStack) !u256_native {
        if (self.values.items.len == 0) {
            return 0;
        }
        return self.values.pop();
    }
    
    pub fn length(self: *const TestStack) usize {
        return self.values.items.len;
    }
};

// Use Zig's built-in u256 type
const u256_native = u256;

// Simple mock implementation for testing
const MockInterpreter = struct {
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) MockInterpreter {
        return MockInterpreter{ .allocator = allocator };
    }
};

const MockFrame = struct {
    stack: TestStack,
    gas: u64 = 1000000,

    pub fn init(allocator: std.mem.Allocator) !MockFrame {
        // Initialize TestStack with values field
        var stack_instance = TestStack{
            .values = undefined, // Will be properly initialized below
        };
        try stack_instance.init(allocator, 1024);

        return MockFrame{
            .stack = stack_instance,
        };
    }

    pub fn deinit(self: *MockFrame) void {
        self.stack.deinit();
    }
};

// Define error type to match the one from interpreter.zig
const ExecutionError = error{
    OutOfGas,
    StackUnderflow,
    StackOverflow,
    InvalidJump,
    InvalidOpcode,
    OutOfOffset,
    OutOfRange,
    GasUintOverflow,
    NonceTooHigh,
    ContractAddressCollision,
    ExecutionReverted,
    MaxCodeSizeExceeded,
    InvalidCode,
    OutOfFunds,
    WriteProtection,
    ReturnDataOutOfBounds,
    GasLimitReached,
    DepthLimit,
    MemoryLimitExceeded,
    MaxInitCodeSizeExceeded,
    InvalidCommitment,
    InvalidBlob,
    InvalidStateAccess,
};

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