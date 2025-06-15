/// Comprehensive test suite for comparison operations
///
/// This test suite is based on test cases from revm and go-ethereum to ensure
/// our implementation matches production-grade EVM comparison behavior.
///
/// Test case sources:
/// - go-ethereum: /core/vm/testdata/testcases_*.json  
/// - revm: /crates/interpreter/src/instructions/bitwise.rs (comparison ops)
///
/// The test structure covers:
/// 1. Basic comparison operations (LT, GT, EQ, ISZERO)
/// 2. Signed comparisons (SLT, SGT)
/// 3. Edge cases with zero, max values, and sign boundaries
/// 4. Two's complement behavior for signed operations

const std = @import("std");
const testing = std.testing;
const comparison = @import("comparison.zig");
const Frame = @import("../frame.zig");
const Stack = @import("../stack/stack.zig");
const Memory = @import("../memory.zig");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");

/// Test case structure for binary comparison operations
const BinaryTestCase = struct {
    a: u256,
    b: u256,
    expected: u256,  // 0 for false, 1 for true
    description: []const u8,
};

/// Test case structure for unary comparison operations (ISZERO)
const UnaryTestCase = struct {
    input: u256,
    expected: u256,  // 0 for false, 1 for true
    description: []const u8,
};

/// Helper function to create a test frame with a stack containing given values
fn createTestFrame(allocator: std.mem.Allocator, values: []const u256) !Frame {
    var frame = Frame{
        .stack = Stack{},
        .memory = try Memory.init(allocator),
        .gas_remaining = 1000000,
        .contract_address = [_]u8{0} ** 20,
        .caller = [_]u8{0} ** 20,
        .call_value = 0,
        .call_data = &[_]u8{},
        .return_data = &[_]u8{},
        .code = &[_]u8{},
        .is_static = false,
        .depth = 0,
    };
    
    // Push values onto stack in reverse order (stack is LIFO)
    for (values) |value| {
        try frame.stack.append(value);
    }
    
    return frame;
}

/// Test LT opcode (unsigned less than) with comprehensive cases from go-ethereum
test "LT opcode - unsigned less than test cases" {
    const test_cases = [_]BinaryTestCase{
        // Basic cases
        .{ .a = 0, .b = 0, .expected = 0, .description = "0 < 0 = false" },
        .{ .a = 0, .b = 1, .expected = 1, .description = "0 < 1 = true" },
        .{ .a = 1, .b = 0, .expected = 0, .description = "1 < 0 = false" },
        .{ .a = 1, .b = 1, .expected = 0, .description = "1 < 1 = false" },
        .{ .a = 5, .b = 10, .expected = 1, .description = "5 < 10 = true" },
        .{ .a = 10, .b = 5, .expected = 0, .description = "10 < 5 = false" },
        
        // Edge cases with large numbers
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 1, .description = "(max_u256 - 1) < max_u256 = true" },
           
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE,
           .expected = 0, .description = "max_u256 < (max_u256 - 1) = false" },
        
        // Zero comparisons
        .{ .a = 0, .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 1, .description = "0 < max_u256 = true" },
           
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .b = 0, .expected = 0, .description = "max_u256 < 0 = false" },
        
        // Powers of 2
        .{ .a = 0x8000000000000000000000000000000000000000000000000000000000000000,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 1, .description = "2^255 < max_u256 = true" },
           
        .{ .a = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .b = 0x8000000000000000000000000000000000000000000000000000000000000000,
           .expected = 1, .description = "(2^255 - 1) < 2^255 = true" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        const result = try comparison.op_lt(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test GT opcode (unsigned greater than)
test "GT opcode - unsigned greater than test cases" {
    const test_cases = [_]BinaryTestCase{
        // Basic cases
        .{ .a = 0, .b = 0, .expected = 0, .description = "0 > 0 = false" },
        .{ .a = 0, .b = 1, .expected = 0, .description = "0 > 1 = false" },
        .{ .a = 1, .b = 0, .expected = 1, .description = "1 > 0 = true" },
        .{ .a = 1, .b = 1, .expected = 0, .description = "1 > 1 = false" },
        .{ .a = 10, .b = 5, .expected = 1, .description = "10 > 5 = true" },
        .{ .a = 5, .b = 10, .expected = 0, .description = "5 > 10 = false" },
        
        // Edge cases
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE,
           .expected = 1, .description = "max_u256 > (max_u256 - 1) = true" },
           
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0, .description = "(max_u256 - 1) > max_u256 = false" },
        
        // Large number comparisons
        .{ .a = 0x8000000000000000000000000000000000000000000000000000000000000000,
           .b = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 1, .description = "2^255 > (2^255 - 1) = true" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        const result = try comparison.op_gt(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test SLT opcode (signed less than) with two's complement interpretation
test "SLT opcode - signed less than test cases" {
    const test_cases = [_]BinaryTestCase{
        // Basic positive cases
        .{ .a = 0, .b = 1, .expected = 1, .description = "0 < 1 = true" },
        .{ .a = 1, .b = 0, .expected = 0, .description = "1 < 0 = false" },
        .{ .a = 5, .b = 10, .expected = 1, .description = "5 < 10 = true" },
        
        // Negative vs positive (negative numbers have high bit set)
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // -1
           .b = 0, .expected = 1, .description = "-1 < 0 = true" },
           
        .{ .a = 0, .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // -1
           .expected = 0, .description = "0 < -1 = false" },
        
        // Negative vs negative
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE, // -2
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // -1
           .expected = 1, .description = "-2 < -1 = true" },
           
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // -1
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE, // -2
           .expected = 0, .description = "-1 < -2 = false" },
        
        // Edge cases with extreme values
        .{ .a = 0x8000000000000000000000000000000000000000000000000000000000000000, // MIN_I256 (most negative)
           .b = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // MAX_I256 (most positive)
           .expected = 1, .description = "MIN_I256 < MAX_I256 = true" },
           
        .{ .a = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // MAX_I256
           .b = 0x8000000000000000000000000000000000000000000000000000000000000000, // MIN_I256
           .expected = 0, .description = "MAX_I256 < MIN_I256 = false" },
        
        // Zero boundary cases
        .{ .a = 0x8000000000000000000000000000000000000000000000000000000000000000, // MIN_I256
           .b = 0, .expected = 1, .description = "MIN_I256 < 0 = true" },
           
        .{ .a = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // MAX_I256
           .b = 0, .expected = 0, .description = "MAX_I256 < 0 = false" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        const result = try comparison.op_slt(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test SGT opcode (signed greater than)
test "SGT opcode - signed greater than test cases" {
    const test_cases = [_]BinaryTestCase{
        // Basic positive cases
        .{ .a = 1, .b = 0, .expected = 1, .description = "1 > 0 = true" },
        .{ .a = 10, .b = 5, .expected = 1, .description = "10 > 5 = true" },
        .{ .a = 5, .b = 10, .expected = 0, .description = "5 > 10 = false" },
        
        // Positive vs negative
        .{ .a = 0, .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // -1
           .expected = 1, .description = "0 > -1 = true" },
           
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // -1
           .b = 0, .expected = 0, .description = "-1 > 0 = false" },
        
        // Negative vs negative
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // -1
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE, // -2
           .expected = 1, .description = "-1 > -2 = true" },
           
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE, // -2
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // -1
           .expected = 0, .description = "-2 > -1 = false" },
        
        // Extreme value cases
        .{ .a = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // MAX_I256
           .b = 0x8000000000000000000000000000000000000000000000000000000000000000, // MIN_I256
           .expected = 1, .description = "MAX_I256 > MIN_I256 = true" },
           
        .{ .a = 0x8000000000000000000000000000000000000000000000000000000000000000, // MIN_I256
           .b = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // MAX_I256
           .expected = 0, .description = "MIN_I256 > MAX_I256 = false" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        const result = try comparison.op_sgt(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test EQ opcode (equality)
test "EQ opcode - equality test cases" {
    const test_cases = [_]BinaryTestCase{
        // Basic cases
        .{ .a = 0, .b = 0, .expected = 1, .description = "0 == 0 = true" },
        .{ .a = 0, .b = 1, .expected = 0, .description = "0 == 1 = false" },
        .{ .a = 1, .b = 1, .expected = 1, .description = "1 == 1 = true" },
        .{ .a = 42, .b = 42, .expected = 1, .description = "42 == 42 = true" },
        .{ .a = 100, .b = 200, .expected = 0, .description = "100 == 200 = false" },
        
        // Large number equality
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 1, .description = "max_u256 == max_u256 = true" },
           
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE,
           .expected = 0, .description = "max_u256 == (max_u256 - 1) = false" },
        
        // Specific bit patterns
        .{ .a = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .b = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .expected = 1, .description = "complex pattern equality" },
           
        .{ .a = 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,
           .b = 0x5555555555555555555555555555555555555555555555555555555555555555,
           .expected = 0, .description = "alternating patterns not equal" },
        
        // Sign bit patterns (treated as unsigned for EQ)
        .{ .a = 0x8000000000000000000000000000000000000000000000000000000000000000,
           .b = 0x8000000000000000000000000000000000000000000000000000000000000000,
           .expected = 1, .description = "sign bit pattern equality" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        const result = try comparison.op_eq(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test ISZERO opcode (zero check)
test "ISZERO opcode - zero check test cases" {
    const test_cases = [_]UnaryTestCase{
        // Basic cases
        .{ .input = 0, .expected = 1, .description = "iszero(0) = true" },
        .{ .input = 1, .expected = 0, .description = "iszero(1) = false" },
        .{ .input = 42, .expected = 0, .description = "iszero(42) = false" },
        .{ .input = 100, .expected = 0, .description = "iszero(100) = false" },
        
        // Large numbers
        .{ .input = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0, .description = "iszero(max_u256) = false" },
           
        .{ .input = 0x8000000000000000000000000000000000000000000000000000000000000000,
           .expected = 0, .description = "iszero(2^255) = false" },
           
        .{ .input = 0x0000000000000000000000000000000000000000000000000000000000000001,
           .expected = 0, .description = "iszero(1) = false" },
        
        // Specific patterns that are non-zero
        .{ .input = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .expected = 0, .description = "iszero(complex_pattern) = false" },
           
        .{ .input = 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,
           .expected = 0, .description = "iszero(alternating_pattern) = false" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{case.input});
        defer frame.memory.deinit();
        
        const result = try comparison.op_iszero(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test comparison edge cases and boundary conditions
test "comparison opcodes - edge cases and boundaries" {
    var allocator = testing.allocator;
    
    // Test that operations return exactly 0 or 1
    const boundary_cases = [_]struct {
        op_name: []const u8,
        op_func: *const fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult,
        a: u256,
        b: u256,
        expected: u256,
    }{
        // LT edge cases
        .{ .op_name = "LT", .op_func = comparison.op_lt, .a = 0, .b = 1, .expected = 1 },
        .{ .op_name = "LT", .op_func = comparison.op_lt, .a = 1, .b = 0, .expected = 0 },
        
        // GT edge cases  
        .{ .op_name = "GT", .op_func = comparison.op_gt, .a = 1, .b = 0, .expected = 1 },
        .{ .op_name = "GT", .op_func = comparison.op_gt, .a = 0, .b = 1, .expected = 0 },
        
        // EQ edge cases
        .{ .op_name = "EQ", .op_func = comparison.op_eq, .a = 0, .b = 0, .expected = 1 },
        .{ .op_name = "EQ", .op_func = comparison.op_eq, .a = 0, .b = 1, .expected = 0 },
        
        // Signed comparison edge cases
        .{ .op_name = "SLT", .op_func = comparison.op_slt, 
           .a = 0x8000000000000000000000000000000000000000000000000000000000000000, // MIN_I256
           .b = 0, .expected = 1 },
        .{ .op_name = "SGT", .op_func = comparison.op_sgt,
           .a = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // MAX_I256
           .b = 0, .expected = 1 },
    };
    
    for (boundary_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        _ = try case.op_func(0, undefined, @ptrCast(&frame));
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        
        // Ensure result is exactly 0 or 1 (not any other truthy/falsy value)
        try testing.expect(actual == 0 or actual == 1);
    }
}

/// Test stack manipulation behavior for comparison operations
test "comparison opcodes - stack manipulation verification" {
    var allocator = testing.allocator;
    
    // Binary operations should pop 2 and push 1
    {
        var frame = try createTestFrame(allocator, &[_]u256{ 10, 20, 30 });
        defer frame.memory.deinit();
        
        try testing.expectEqual(@as(usize, 3), frame.stack.size);
        
        _ = try comparison.op_lt(0, undefined, @ptrCast(&frame));
        
        // Should have 2 items now (popped 2, pushed 1)
        try testing.expectEqual(@as(usize, 2), frame.stack.size);
        
        // Top should be the result (20 < 30 = 1)
        try testing.expectEqual(@as(u256, 1), frame.stack.peek_unsafe().*);
    }
    
    // Unary operations should maintain stack size (pop 1, push 1)
    {
        var frame = try createTestFrame(allocator, &[_]u256{ 10, 20 });
        defer frame.memory.deinit();
        
        try testing.expectEqual(@as(usize, 2), frame.stack.size);
        
        _ = try comparison.op_iszero(0, undefined, @ptrCast(&frame));
        
        try testing.expectEqual(@as(usize, 2), frame.stack.size);
        
        // Top should be the result (iszero(20) = 0)
        try testing.expectEqual(@as(u256, 0), frame.stack.peek_unsafe().*);
    }
}

/// Test signed vs unsigned interpretation consistency
test "comparison opcodes - signed vs unsigned interpretation" {
    var allocator = testing.allocator;
    
    // Same operands should give different results for signed vs unsigned comparisons
    // when dealing with the sign bit
    
    const test_value_a = 0x8000000000000000000000000000000000000000000000000000000000000000; // High bit set (negative in signed)
    const test_value_b = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; // High bit clear (positive)
    
    // Unsigned comparison: a > b (larger magnitude)
    {
        var frame = try createTestFrame(allocator, &[_]u256{ test_value_a, test_value_b });
        defer frame.memory.deinit();
        
        _ = try comparison.op_gt(0, undefined, @ptrCast(&frame));
        const unsigned_result = frame.stack.peek_unsafe().*;
        try testing.expectEqual(@as(u256, 1), unsigned_result); // true: 2^255 > (2^255 - 1)
    }
    
    // Signed comparison: a < b (negative < positive)
    {
        var frame = try createTestFrame(allocator, &[_]u256{ test_value_a, test_value_b });
        defer frame.memory.deinit();
        
        _ = try comparison.op_sgt(0, undefined, @ptrCast(&frame));
        const signed_result = frame.stack.peek_unsafe().*;
        try testing.expectEqual(@as(u256, 0), signed_result); // false: MIN_I256 < MAX_I256
    }
    
    // This demonstrates that the same bit patterns are interpreted differently
    // by signed vs unsigned comparison operations
}

/// Test comprehensive patterns from go-ethereum test vectors
test "comparison opcodes - go-ethereum test vector patterns" {
    var allocator = testing.allocator;
    
    // Test with the standard parameter set used in go-ethereum tests
    const standard_params = [_]u256{
        0x0000000000000000000000000000000000000000000000000000000000000000, // 0
        0x0000000000000000000000000000000000000000000000000000000000000001, // +1
        0x0000000000000000000000000000000000000000000000000000000000000005, // +5
        0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE, // +max-1
        0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // +max
        0x8000000000000000000000000000000000000000000000000000000000000000, // -max
        0x8000000000000000000000000000000000000000000000000000000000000001, // -max+1
        0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFB, // -5
        0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // -1
    };
    
    // Test various combinations to ensure consistency
    for (standard_params, 0..) |param_a, i| {
        for (standard_params, 0..) |param_b, j| {
            // Test LT operation
            {
                var frame = try createTestFrame(allocator, &[_]u256{ param_a, param_b });
                defer frame.memory.deinit();
                
                _ = try comparison.op_lt(0, undefined, @ptrCast(&frame));
                const lt_result = frame.stack.peek_unsafe().*;
                
                // Result should be 0 or 1
                try testing.expect(lt_result == 0 or lt_result == 1);
                
                // If a < b, then b >= a should be true
                var frame2 = try createTestFrame(allocator, &[_]u256{ param_b, param_a });
                defer frame2.memory.deinit();
                
                _ = try comparison.op_lt(0, undefined, @ptrCast(&frame2));
                const reverse_result = frame2.stack.peek_unsafe().*;
                
                // If lt_result == 1 (a < b), then reverse should be different unless a == b
                if (param_a == param_b) {
                    try testing.expectEqual(lt_result, reverse_result); // Both should be 0
                }
            }
            
            // Test EQ operation consistency
            {
                var frame = try createTestFrame(allocator, &[_]u256{ param_a, param_b });
                defer frame.memory.deinit();
                
                _ = try comparison.op_eq(0, undefined, @ptrCast(&frame));
                const eq_result = frame.stack.peek_unsafe().*;
                
                // EQ should be symmetric: a == b iff b == a
                var frame2 = try createTestFrame(allocator, &[_]u256{ param_b, param_a });
                defer frame2.memory.deinit();
                
                _ = try comparison.op_eq(0, undefined, @ptrCast(&frame2));
                const symmetric_result = frame2.stack.peek_unsafe().*;
                
                try testing.expectEqual(eq_result, symmetric_result);
                
                // EQ should be 1 iff parameters are identical
                if (i == j) {
                    try testing.expectEqual(@as(u256, 1), eq_result);
                }
            }
        }
    }
}