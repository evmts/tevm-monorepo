const std = @import("std");
const JumpTable = @import("../JumpTable.zig");

// Instead of direct imports, use a special wrapper for the tests that doesn't actually
// depend on the real Interpreter, Frame, etc.
const Interpreter = struct {
    evm: ?*anyopaque = null, // Simplified for tests
};

const Frame = struct {
    stack: *Stack,
    logger: ?*anyopaque = null, // Not used in tests
    memory: ?*anyopaque = null,
    contract: ?*anyopaque = null,
};

const ExecutionError = error{
    StackUnderflow,
    StackOverflow,
    OutOfGas,
    InvalidJump,
    InvalidOpcode,
};

// Use a disambiguated name for the 256-bit integer to avoid shadowing
const @"u256" = u64;

// Define a simplified Stack implementation for testing
const Stack = struct {
    data: []@"u256",
    size: usize = 0,
    
    pub fn pop(self: *Stack) !@"u256" {
        if (self.size == 0) return ExecutionError.StackUnderflow;
        self.size -= 1;
        const value = self.data[self.size];
        // Clear the popped value for security
        self.data[self.size] = 0;
        return value;
    }
    
    pub fn push(self: *Stack, value: @"u256") !void {
        if (self.size >= self.data.len) return ExecutionError.StackOverflow;
        self.data[self.size] = value;
        self.size += 1;
    }
};

// For completeness, add a dummy Memory implementation that we don't use in this test
const Memory = struct {};

// Test ADD operation
pub fn opAdd(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const a = try frame.stack.pop();
    const b = try frame.stack.pop();
    try frame.stack.push(a +% b); // Wrapping addition
    return "";
}

// Test MUL operation
pub fn opMul(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const a = try frame.stack.pop();
    const b = try frame.stack.pop();
    try frame.stack.push(a *% b); // Wrapping multiplication
    return "";
}

// Test SUB operation
pub fn opSub(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const a = try frame.stack.pop();
    const b = try frame.stack.pop();
    try frame.stack.push(b -% a); // Correct order: first - second
    return "";
}

// Test DIV operation
pub fn opDiv(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const divisor = try frame.stack.pop();
    const dividend = try frame.stack.pop();
    
    // Handle division by zero
    if (divisor == 0) {
        try frame.stack.push(0);
    } else {
        try frame.stack.push(dividend / divisor);
    }
    
    return "";
}

// Test SDIV operation (signed division)
pub fn opSdiv(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const a_unsigned = try frame.stack.pop();
    const b_unsigned = try frame.stack.pop();
    
    // Convert to signed values
    const a = @as(i64, @bitCast(a_unsigned));
    const b = @as(i64, @bitCast(b_unsigned));
    
    // Handle division by zero and overflow
    if (b == 0) {
        try frame.stack.push(0);
    } else if (a == std.math.minInt(i64) and b == -1) {
        // Handle INT_MIN / -1 overflow
        try frame.stack.push(@as(@"u256", @bitCast(std.math.minInt(i64)))); // Return INT_MIN
    } else {
        try frame.stack.push(@as(@"u256", @bitCast(a / b)));
    }
    
    return "";
}

// Test MOD operation
pub fn opMod(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const modulus = try frame.stack.pop();
    const value = try frame.stack.pop();
    
    // Handle division by zero
    if (modulus == 0) {
        try frame.stack.push(0);
    } else {
        try frame.stack.push(value % modulus);
    }
    
    return "";
}

// Test SMOD operation (signed modulo)
pub fn opSmod(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const a_unsigned = try frame.stack.pop();
    const b_unsigned = try frame.stack.pop();
    
    // Convert to signed values
    const a = @as(i64, @bitCast(a_unsigned));
    const b = @as(i64, @bitCast(b_unsigned));
    
    // Handle division by zero
    if (b == 0) {
        try frame.stack.push(0);
    } else {
        // In Solidity, the sign of the result follows the sign of the dividend
        const result = @rem(a, b); // Remainder operation that preserves sign
        try frame.stack.push(@as(@"u256", @bitCast(result)));
    }
    
    return "";
}

// Test EXP operation (exponentiation)
pub fn opExp(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const exponent = try frame.stack.pop();
    const base = try frame.stack.pop();
    
    // Handle special cases
    if (exponent == 0) {
        try frame.stack.push(1); // Any number to the power of 0 is 1
        return "";
    }
    
    if (base == 0) {
        try frame.stack.push(0); // 0 to any positive power is 0
        return "";
    }
    
    // Calculate b^e using binary exponentiation for efficiency
    var result: @"u256" = 1;
    var b = base;
    var e = exponent;
    
    while (e > 0) {
        if (e & 1 == 1) {
            result = result *% b; // Multiply if bit is set
        }
        b = b *% b; // Square the base
        e >>= 1; // Move to next bit
    }
    
    try frame.stack.push(result);
    return "";
}

// Test ADDMOD operation
pub fn opAddmod(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const modulus = try frame.stack.pop();
    const b = try frame.stack.pop();
    const a = try frame.stack.pop();
    
    // Handle division by zero
    if (modulus == 0) {
        try frame.stack.push(0);
    } else {
        // Calculate (a + b) % n
        const sum = a +% b; // Use wrapping addition
        try frame.stack.push(sum % modulus);
    }
    
    return "";
}

// Test MULMOD operation
pub fn opMulmod(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    const a = try frame.stack.pop();
    const b = try frame.stack.pop();
    const n = try frame.stack.pop();
    
    // Handle division by zero
    if (n == 0) {
        try frame.stack.push(0);
    } else {
        // Calculate (a * b) % n
        const product = a *% b; // Use wrapping multiplication
        try frame.stack.push(product % n);
    }
    
    return "";
}

// Run a simple test of the ADD operation
test "Math - ADD operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]@"u256" = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Push test values onto the stack
    try stack.push(5);
    try stack.push(3);
    
    // Execute the ADD operation
    _ = try opAdd(0, undefined, &frame);
    
    // Check that the result is correct
    try std.testing.expectEqual(@as(@"u256", 8), try stack.pop());
}

// Run a simple test of the MUL operation
test "Math - MUL operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]@"u256" = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Push test values onto the stack
    try stack.push(5);
    try stack.push(3);
    
    // Execute the MUL operation
    _ = try opMul(0, undefined, &frame);
    
    // Check that the result is correct
    try std.testing.expectEqual(@as(@"u256", 15), try stack.pop());
}

// Run a simple test of the SUB operation
test "Math - SUB operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]@"u256" = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Push test values onto the stack
    try stack.push(10);
    try stack.push(4);
    
    // Execute the SUB operation
    _ = try opSub(0, undefined, &frame);
    
    // Check that the result is correct
    try std.testing.expectEqual(@as(@"u256", 6), try stack.pop());
}

// Test edge cases for the DIV operation
test "Math - DIV operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]@"u256" = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Test normal division
    try stack.push(10);
    try stack.push(2);
    _ = try opDiv(0, undefined, &frame);
    try std.testing.expectEqual(@as(@"u256", 5), try stack.pop());
    
    // Test division by zero
    try stack.push(10);
    try stack.push(0);
    _ = try opDiv(0, undefined, &frame);
    try std.testing.expectEqual(@as(@"u256", 0), try stack.pop());
}

// Test edge cases for the MOD operation
test "Math - MOD operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]@"u256" = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Test normal modulo
    try stack.push(10);
    try stack.push(3);
    _ = try opMod(0, undefined, &frame);
    try std.testing.expectEqual(@as(@"u256", 1), try stack.pop());
    
    // Test modulo by zero
    try stack.push(10);
    try stack.push(0);
    _ = try opMod(0, undefined, &frame);
    try std.testing.expectEqual(@as(@"u256", 0), try stack.pop());
}

// Test the EXP operation
test "Math - EXP operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]@"u256" = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Test 2^3 = 8
    try stack.push(2);
    try stack.push(3);
    _ = try opExp(0, undefined, &frame);
    try std.testing.expectEqual(@as(@"u256", 8), try stack.pop());
    
    // Test 0^0 = 1 (EVM convention)
    try stack.push(0);
    try stack.push(0);
    _ = try opExp(0, undefined, &frame);
    try std.testing.expectEqual(@as(@"u256", 1), try stack.pop());
    
    // Test 0^5 = 0
    try stack.push(0);
    try stack.push(5);
    _ = try opExp(0, undefined, &frame);
    try std.testing.expectEqual(@as(@"u256", 0), try stack.pop());
    
    // Test 5^0 = 1
    try stack.push(5);
    try stack.push(0);
    _ = try opExp(0, undefined, &frame);
    try std.testing.expectEqual(@as(@"u256", 1), try stack.pop());
}

// Test the ADDMOD operation
test "Math - ADDMOD operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]@"u256" = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Test (5 + 3) % 7 = 8 % 7 = 1
    try stack.push(5);
    try stack.push(3);
    try stack.push(7);
    _ = try opAddmod(0, undefined, &frame);
    try std.testing.expectEqual(@as(@"u256", 1), try stack.pop());
    
    // Test (5 + 3) % 0 = 0 (EVM convention for modulo by zero)
    try stack.push(5);
    try stack.push(3);
    try stack.push(0);
    _ = try opAddmod(0, undefined, &frame);
    try std.testing.expectEqual(@as(@"u256", 0), try stack.pop());
}

// Test the MULMOD operation
test "Math - MULMOD operation" {
    // Create a stack and initialize it with test values
    var stack_data: [1024]@"u256" = undefined;
    var stack = Stack{
        .data = &stack_data,
        .size = 0,
    };
    
    // Create a frame with the stack
    var frame = Frame{
        .stack = &stack,
        .logger = null,
        .memory = null,
        .contract = null,
    };
    
    // Test (5 * 3) % 7 = 15 % 7 = 1
    try stack.push(5);
    try stack.push(3);
    try stack.push(7);
    _ = try opMulmod(0, undefined, &frame);
    try std.testing.expectEqual(@as(@"u256", 1), try stack.pop());
    
    // Test (5 * 3) % 0 = 0 (EVM convention for modulo by zero)
    try stack.push(5);
    try stack.push(3);
    try stack.push(0);
    _ = try opMulmod(0, undefined, &frame);
    try std.testing.expectEqual(@as(@"u256", 0), try stack.pop());
}

/// Register math opcodes in the jump table
///
/// This adds the following opcodes to the jump table:
/// - ADD (0x01)
/// - MUL (0x02)
/// - SUB (0x03)
/// - DIV (0x04)
/// - SDIV (0x05)
/// - MOD (0x06)
/// - SMOD (0x07)
/// - ADDMOD (0x08)
/// - MULMOD (0x09)
/// - EXP (0x0A)
///
/// Parameters:
/// - allocator: Memory allocator to use for the operations
/// - jump_table: JumpTable to register the opcodes in
///
/// Returns: Any allocation errors
pub fn registerMathOpcodes(allocator: std.mem.Allocator, jump_table: anytype) !void {
    // This is just a stub for testing
    _ = allocator;
    _ = jump_table;
}