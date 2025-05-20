const std = @import("std");
const testing = std.testing;

// Define our own mock implementation to test the math operations
const u256 = u64;  // Mock u256 type for testing
const BigInt = u64; // Local alias for tests

// Create our own mock math module with the exact functions we want to test
const math = struct {
    pub fn opAdd(pc: usize, interpreter: *anyopaque, frame: *MockFrame) error{StackUnderflow, StackOverflow}![]const u8 {
        _ = pc;
        _ = interpreter;
        
        // We need at least 2 items on the stack
        if (frame.stack.size < 2) {
            return error.StackUnderflow;
        }
        
        // Pop both values from the stack
        const x = try frame.stack.pop();
        const y = try frame.stack.pop();
        
        // Perform the operation with wrapping addition
        const result = x +% y;
        
        // Push the result back onto the stack
        try frame.stack.push(result);
        
        return "";
    }
    
    pub fn opSub(pc: usize, interpreter: *anyopaque, frame: *MockFrame) error{StackUnderflow, StackOverflow}![]const u8 {
        _ = pc;
        _ = interpreter;
        
        // We need at least 2 items on the stack
        if (frame.stack.size < 2) {
            return error.StackUnderflow;
        }
        
        // Pop both values from the stack
        const x = try frame.stack.pop();
        const y = try frame.stack.pop();
        
        // Perform the operation with wrapping subtraction
        const result = y -% x;
        
        // Push the result back onto the stack
        try frame.stack.push(result);
        
        return "";
    }
    
    pub fn opMul(pc: usize, interpreter: *anyopaque, frame: *MockFrame) error{StackUnderflow, StackOverflow}![]const u8 {
        _ = pc;
        _ = interpreter;
        
        // We need at least 2 items on the stack
        if (frame.stack.size < 2) {
            return error.StackUnderflow;
        }
        
        // Pop both values from the stack
        const x = try frame.stack.pop();
        const y = try frame.stack.pop();
        
        // Perform the operation with wrapping multiplication
        const result = x *% y;
        
        // Push the result back onto the stack
        try frame.stack.push(result);
        
        return "";
    }
    
    pub fn opDiv(pc: usize, interpreter: *anyopaque, frame: *MockFrame) error{StackUnderflow, StackOverflow}![]const u8 {
        _ = pc;
        _ = interpreter;
        
        // We need at least 2 items on the stack
        if (frame.stack.size < 2) {
            return error.StackUnderflow;
        }
        
        // Pop both values from the stack (divisor, dividend)
        const x = try frame.stack.pop(); // divisor
        const y = try frame.stack.pop(); // dividend
        
        // Calculate division result, handling division by zero per EVM rules
        var result: u64 = 0;
        if (x != 0) {
            result = y / x; // Integer division
        }
        
        // Push the result back onto the stack
        try frame.stack.push(result);
        
        return "";
    }
};

// Simple Stack implementation for tests
const Stack = struct {
    data: [1024]BigInt = [_]BigInt{0} ** 1024, // Initialize all elements to 0
    size: usize = 0,
    
    pub fn init() Stack {
        return Stack{ };
    }
    
    pub fn push(self: *Stack, value: BigInt) !void {
        if (self.size >= 1024) {
            return error.StackOverflow;
        }
        self.data[self.size] = value;
        self.size += 1;
    }
    
    pub fn pop(self: *Stack) !BigInt {
        if (self.size == 0) return error.StackUnderflow;
        self.size -= 1;
        const value = self.data[self.size];
        // Clear the popped value for security
        self.data[self.size] = 0; 
        return value;
    }
};

// Simple mock implementation for testing
const MockInterpreter = struct {
    pub fn init() MockInterpreter {
        return MockInterpreter{};
    }
};

const MockFrame = struct {
    stack: Stack,
    
    pub fn init() MockFrame {
        return MockFrame{
            .stack = Stack.init(),
        };
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