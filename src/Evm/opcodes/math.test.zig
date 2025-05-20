const std = @import("std");
const testing = std.testing;
const math = @import("math.zig");

// Use the types defined in math.zig for consistency
const BigInt = u64; // Local type for the tests

// Define a Stack that matches the interface in math.zig
const Stack = struct {
    data: [1024]BigInt = [_]BigInt{0} ** 1024, // Initialize all elements to 0
    size: usize = 0,
    capacity: usize = 1024,
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator, capacity_unused: usize) !Stack {
        _ = capacity_unused;
        return Stack{ 
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *Stack) void {
        _ = self;
    }
    
    pub fn push(self: *Stack, value: BigInt) !void {
        if (self.size >= self.capacity) {
            return error.StackOverflow;
        }
        self.data[self.size] = value;
        self.size += 1;
    }
    
    pub fn pop(self: *Stack) !BigInt {
        if (self.size == 0) return error.OutOfBounds;
        self.size -= 1;
        const value = self.data[self.size];
        // Clear the popped value for security
        self.data[self.size] = 0; 
        return value;
    }
};

// Simple mock implementation for testing, matching the expected structure in math.zig
const MockInterpreter = struct {
    evm: ?*anyopaque = null, // Match the struct in math.zig
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) MockInterpreter {
        return MockInterpreter{ .allocator = allocator };
    }
};

const MockFrame = struct {
    stack: *Stack,
    memory: ?*anyopaque = null,
    contract: ?*anyopaque = null,
    logger: ?*anyopaque = null,
    
    pub fn init() !*MockFrame {
        var frame = std.testing.allocator.create(MockFrame) catch unreachable;
        var stack = std.testing.allocator.create(Stack) catch unreachable;
        stack.* = try Stack.init(std.testing.allocator, 1024);
        
        frame.* = MockFrame{
            .stack = stack,
        };
        
        return frame;
    }
    
    pub fn deinit(self: *MockFrame) void {
        self.stack.deinit();
        std.testing.allocator.destroy(self.stack);
        std.testing.allocator.destroy(self);
    }
};

test "ADD operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    // Test basic addition
    try frame.stack.push(10); // First push
    try frame.stack.push(20); // Second push
    
    // Execute opAdd - this should add 10 + 20 = 30
    _ = try math.opAdd(0, &mock_interpreter, frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(BigInt, 30), result);
    
    // Test addition with wrapping (overflow)
    const max_value: BigInt = ~@as(BigInt, 0); // All bits set to 1
    try frame.stack.push(max_value); // First push (max value)
    try frame.stack.push(1);         // Second push (1)
    
    // Execute opAdd - this should wrap around to 0
    _ = try math.opAdd(0, &mock_interpreter, frame);
    
    // Check the result
    const overflow_result = try frame.stack.pop();
    try testing.expectEqual(@as(BigInt, 0), overflow_result);
}

test "SUB operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    // Test basic subtraction
    try frame.stack.push(30); // First push
    try frame.stack.push(10); // Second push
    
    // Execute opSub - this should subtract 30 - 10 = 20
    _ = try math.opSub(0, &mock_interpreter, frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(BigInt, 20), result);
    
    // Test subtraction with wrapping (underflow)
    try frame.stack.push(0); // First push (0)
    try frame.stack.push(1); // Second push (1)
    
    // Execute opSub - this should wrap around to max value
    _ = try math.opSub(0, &mock_interpreter, frame);
    
    // Check the result
    const underflow_result = try frame.stack.pop();
    try testing.expectEqual(~@as(BigInt, 0), underflow_result); // All bits set to 1
}

test "MUL operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    // Test basic multiplication
    try frame.stack.push(7);  // First push
    try frame.stack.push(6);  // Second push
    
    // Execute opMul - this should multiply 7 * 6 = 42
    _ = try math.opMul(0, &mock_interpreter, frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(BigInt, 42), result);
    
    // Test multiplication with large numbers (not overflowing)
    try frame.stack.push(0x10000000); // 2^28
    try frame.stack.push(0x10);       // 16
    
    // Execute opMul - this should multiply 2^28 * 16 = 2^32
    _ = try math.opMul(0, &mock_interpreter, frame);
    
    // Check the result
    const large_result = try frame.stack.pop();
    try testing.expectEqual(@as(BigInt, 0x100000000), large_result); // 2^32
    
    // Test multiplication with wrapping (overflow)
    const half_max: BigInt = (@as(BigInt, 1) << (std.math.log2(BigInt) - 1)) - 1; // 2^(bits-1) - 1
    try frame.stack.push(half_max);  // Value close to overflow
    try frame.stack.push(2);         // Multiply by 2 to cause overflow
    
    // Execute opMul - this should wrap around
    _ = try math.opMul(0, &mock_interpreter, frame);
    
    // Check the result - should be (2^255 - 1) * 2 = 2^256 - 2 which wraps to -2 (using 2's complement)
    const overflow_result = try frame.stack.pop();
    const expected_wrap = ~@as(BigInt, 1); // All bits set except least significant bit
    try testing.expectEqual(expected_wrap, overflow_result);
}

test "DIV operation" {
    var frame = try MockFrame.init();
    defer frame.deinit();
    
    var mock_interpreter = MockInterpreter.init(std.testing.allocator);
    
    // Test basic division
    try frame.stack.push(42);  // First push (dividend)
    try frame.stack.push(7);   // Second push (divisor)
    
    // Execute opDiv - this should divide 42 / 7 = 6
    _ = try math.opDiv(0, &mock_interpreter, frame);
    
    // Check the result
    const result = try frame.stack.pop();
    try testing.expectEqual(@as(BigInt, 6), result);
    
    // Test integer division truncation
    try frame.stack.push(10);  // First push (dividend)
    try frame.stack.push(3);   // Second push (divisor)
    
    // Execute opDiv - this should divide 10 / 3 = 3 (integer division truncates)
    _ = try math.opDiv(0, &mock_interpreter, frame);
    
    // Check the result
    const trunc_result = try frame.stack.pop();
    try testing.expectEqual(@as(BigInt, 3), trunc_result);
    
    // Test division by zero
    try frame.stack.push(42);  // First push (dividend)
    try frame.stack.push(0);   // Second push (divisor = 0)
    
    // Execute opDiv - this should result in 0 per EVM specs
    _ = try math.opDiv(0, &mock_interpreter, frame);
    
    // Check the result
    const div_by_zero_result = try frame.stack.pop();
    try testing.expectEqual(@as(BigInt, 0), div_by_zero_result);
}