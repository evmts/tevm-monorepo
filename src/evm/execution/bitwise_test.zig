/// Comprehensive test suite for bitwise operations
///
/// This test suite is based on test cases from revm and go-ethereum to ensure
/// our implementation matches production-grade EVM bitwise behavior.
///
/// Test case sources:
/// - go-ethereum: /core/vm/testdata/testcases_*.json
/// - revm: /crates/interpreter/src/instructions/bitwise.rs
///
/// The test structure covers:
/// 1. Basic bitwise operations (AND, OR, XOR, NOT)
/// 2. Bit shifting operations (SHL, SHR, SAR)
/// 3. Byte extraction (BYTE)
/// 4. Edge cases with all 0s, all 1s, and mixed patterns
/// 5. Overflow and boundary conditions

const std = @import("std");
const testing = std.testing;
const bitwise = @import("bitwise.zig");
const Frame = @import("../frame.zig");
const Stack = @import("../stack/stack.zig");
const Memory = @import("../memory.zig");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");

/// Test case structure for binary bitwise operations
const BinaryTestCase = struct {
    a: u256,
    b: u256,
    expected: u256,
    description: []const u8,
};

/// Test case structure for unary bitwise operations
const UnaryTestCase = struct {
    input: u256,
    expected: u256,
    description: []const u8,
};

/// Test case structure for byte extraction
const ByteTestCase = struct {
    index: u256,
    value: u256,
    expected: u256,
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

/// Test AND opcode with comprehensive patterns from go-ethereum
test "AND opcode - comprehensive test cases" {
    const test_cases = [_]BinaryTestCase{
        // Basic cases
        .{ .a = 0, .b = 0, .expected = 0, .description = "0 & 0" },
        .{ .a = 0, .b = 1, .expected = 0, .description = "0 & 1" },
        .{ .a = 1, .b = 0, .expected = 0, .description = "1 & 0" },
        .{ .a = 1, .b = 1, .expected = 1, .description = "1 & 1" },
        
        // Pattern cases
        .{ .a = 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,
           .b = 0x5555555555555555555555555555555555555555555555555555555555555555,
           .expected = 0, .description = "alternating bits (no overlap)" },
           
        .{ .a = 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,
           .description = "alternating & all 1s" },
        
        // Edge cases with max values
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .description = "max_u256 & max_u256" },
           
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .b = 0,
           .expected = 0, .description = "max_u256 & 0" },
        
        // Bit mask operations
        .{ .a = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .b = 0x00000000000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0x0000000000000000000000000000000123456789ABCDEF0123456789ABCDEF0,
           .description = "mask lower 128 bits" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        const result = try bitwise.op_and(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test OR opcode with comprehensive patterns
test "OR opcode - comprehensive test cases" {
    const test_cases = [_]BinaryTestCase{
        // Basic cases
        .{ .a = 0, .b = 0, .expected = 0, .description = "0 | 0" },
        .{ .a = 0, .b = 1, .expected = 1, .description = "0 | 1" },
        .{ .a = 1, .b = 0, .expected = 1, .description = "1 | 0" },
        .{ .a = 1, .b = 1, .expected = 1, .description = "1 | 1" },
        
        // Pattern cases
        .{ .a = 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,
           .b = 0x5555555555555555555555555555555555555555555555555555555555555555,
           .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .description = "alternating bits (full coverage)" },
           
        .{ .a = 0xF0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0,
           .b = 0x0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F,
           .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .description = "nibble patterns" },
        
        // Edge cases
        .{ .a = 0, .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .description = "0 | max_u256" },
           
        .{ .a = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .b = 0xFEDCBA9876543210FEDCBA9876543210FEDCBA9876543210FEDCBA9876543210,
           .expected = 0xFFDCFEF99EFDFF10FFDCFEF99EFDFF10FFDCFEF99EFDFF10FFDCFEF99EFDFF10,
           .description = "complex pattern OR" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        const result = try bitwise.op_or(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test XOR opcode with comprehensive patterns
test "XOR opcode - comprehensive test cases" {
    const test_cases = [_]BinaryTestCase{
        // Basic cases
        .{ .a = 0, .b = 0, .expected = 0, .description = "0 ^ 0" },
        .{ .a = 0, .b = 1, .expected = 1, .description = "0 ^ 1" },
        .{ .a = 1, .b = 0, .expected = 1, .description = "1 ^ 0" },
        .{ .a = 1, .b = 1, .expected = 0, .description = "1 ^ 1" },
        
        // Self-XOR (always 0)
        .{ .a = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .b = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .expected = 0, .description = "value ^ value = 0" },
           
        .{ .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0, .description = "max_u256 ^ max_u256 = 0" },
        
        // XOR with all 1s (bit flip)
        .{ .a = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0xEDCBA9876543210FEDCBA9876543210FEDCBA9876543210FEDCBA9876543210F,
           .description = "bit flip with all 1s" },
        
        // Pattern cases
        .{ .a = 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,
           .b = 0x5555555555555555555555555555555555555555555555555555555555555555,
           .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .description = "alternating pattern XOR" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        const result = try bitwise.op_xor(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test NOT opcode (bitwise inversion)
test "NOT opcode - comprehensive test cases" {
    const test_cases = [_]UnaryTestCase{
        // Basic cases
        .{ .input = 0, .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .description = "~0 = max_u256" },
        .{ .input = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0, .description = "~max_u256 = 0" },
        
        // Pattern cases
        .{ .input = 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,
           .expected = 0x5555555555555555555555555555555555555555555555555555555555555555,
           .description = "flip alternating pattern" },
           
        .{ .input = 0xF0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0,
           .expected = 0x0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F,
           .description = "flip nibble pattern" },
        
        // Specific bit patterns
        .{ .input = 1, .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE,
           .description = "~1" },
        .{ .input = 0x8000000000000000000000000000000000000000000000000000000000000000,
           .expected = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .description = "flip sign bit" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{case.input});
        defer frame.memory.deinit();
        
        const result = try bitwise.op_not(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test BYTE opcode with all byte positions (from revm test cases)
test "BYTE opcode - all byte positions" {
    const test_cases = [_]ByteTestCase{
        // Test extracting each byte from a known value
        .{ .index = 0, .value = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .expected = 0xF0, .description = "byte 0 (rightmost)" },
        .{ .index = 1, .value = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .expected = 0xDE, .description = "byte 1" },
        .{ .index = 31, .value = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .expected = 0x12, .description = "byte 31 (leftmost)" },
        
        // Out of bounds (should return 0)
        .{ .index = 32, .value = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .expected = 0, .description = "byte 32 (out of bounds)" },
        .{ .index = 100, .value = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .expected = 0, .description = "byte 100 (far out of bounds)" },
        .{ .index = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .value = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .expected = 0, .description = "max index (out of bounds)" },
        
        // Edge cases with specific patterns
        .{ .index = 0, .value = 0xFF, .expected = 0xFF, .description = "extract 0xFF from byte 0" },
        .{ .index = 0, .value = 0x00, .expected = 0x00, .description = "extract 0x00 from byte 0" },
        .{ .index = 0, .value = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00,
           .expected = 0x00, .description = "extract 0x00 from all 1s except last byte" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.index, case.value });
        defer frame.memory.deinit();
        
        const result = try bitwise.op_byte(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test SHL opcode (shift left) with cases from revm
test "SHL opcode - shift left test cases" {
    const test_cases = [_]BinaryTestCase{
        // Basic cases
        .{ .a = 0, .b = 1, .expected = 1, .description = "0 << 1 = 1" },
        .{ .a = 1, .b = 1, .expected = 2, .description = "1 << 1 = 2" },
        .{ .a = 1, .b = 2, .expected = 4, .description = "1 << 2 = 4" },
        .{ .a = 8, .b = 2, .expected = 32, .description = "8 << 2 = 32" },
        .{ .a = 1, .b = 0x01, .expected = 0x02, .description = "shift by 1" },
        
        // Powers of 2
        .{ .a = 1, .b = 0x01, .expected = 0x02, .description = "2^0 << 1 = 2^1" },
        .{ .a = 4, .b = 0x01, .expected = 0x08, .description = "2^2 << 1 = 2^3" },
        .{ .a = 8, .b = 0x01, .expected = 0x10, .description = "2^3 << 1 = 2^4" },
        
        // Overflow cases
        .{ .a = 255, .b = 1, .expected = 0, .description = "255 << 1 = 0 (overflow)" },
        .{ .a = 256, .b = 1, .expected = 0, .description = "256 << 1 = 0 (overflow)" },
        .{ .a = 1, .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0, .description = "1 << max_u256 = 0" },
        
        // Zero shifts
        .{ .a = 0, .b = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .expected = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .description = "0 << value = value" },
        
        // Edge pattern from revm tests
        .{ .a = 1, .b = 0x01, .expected = 0x02, .description = "revm case: 1 << 1" },
        .{ .a = 4, .b = 0x10, .expected = 0x100000, .description = "revm case: 4 << 16" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        const result = try bitwise.op_shl(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test SHR opcode (logical shift right) with cases from revm
test "SHR opcode - logical shift right test cases" {
    const test_cases = [_]BinaryTestCase{
        // Basic cases
        .{ .a = 0, .b = 2, .expected = 1, .description = "0 >> 2 = 1" },
        .{ .a = 1, .b = 2, .expected = 1, .description = "1 >> 2 = 1" },
        .{ .a = 1, .b = 4, .expected = 2, .description = "1 >> 4 = 2" },
        .{ .a = 2, .b = 8, .expected = 2, .description = "2 >> 8 = 2" },
        .{ .a = 1, .b = 1, .expected = 0, .description = "1 >> 1 = 0" },
        
        // Powers of 2
        .{ .a = 1, .b = 0x02, .expected = 0x01, .description = "2^1 >> 1 = 2^0" },
        .{ .a = 1, .b = 0x08, .expected = 0x04, .description = "2^3 >> 1 = 2^2" },
        .{ .a = 1, .b = 0x10, .expected = 0x08, .description = "2^4 >> 1 = 2^3" },
        
        // Large shifts (result becomes 0)
        .{ .a = 256, .b = 1, .expected = 0, .description = "256 >> 1 = 0" },
        .{ .a = 1, .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0, .description = "1 >> max_u256 = 0" },
        
        // Zero shifts
        .{ .a = 0, .b = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .expected = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0,
           .description = "0 >> value = value" },
        
        // High bit patterns
        .{ .a = 1, .b = 0x8000000000000000000000000000000000000000000000000000000000000000,
           .expected = 0x4000000000000000000000000000000000000000000000000000000000000000,
           .description = "logical shift of high bit" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        const result = try bitwise.op_shr(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*; 
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test SAR opcode (arithmetic shift right) with sign extension
test "SAR opcode - arithmetic shift right test cases" {
    const test_cases = [_]BinaryTestCase{
        // Positive numbers (same as logical shift)
        .{ .a = 0, .b = 2, .expected = 1, .description = "positive: 0 >> 2 = 1" },
        .{ .a = 1, .b = 2, .expected = 1, .description = "positive: 1 >> 2 = 1" },
        .{ .a = 1, .b = 8, .expected = 4, .description = "positive: 1 >> 8 = 4" },
        
        // Negative numbers (sign extension)
        .{ .a = 1, .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .description = "negative: -1 >> 1 = -1" },
        .{ .a = 1, .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE,
           .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .description = "negative: -2 >> 1 = -1" },
        
        // Edge case: shifting negative number by large amount
        .{ .a = 255, .b = 0x8000000000000000000000000000000000000000000000000000000000000000,
           .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .description = "large negative shift" },
        
        // Zero and boundary cases
        .{ .a = 0, .b = 0, .expected = 0, .description = "0 >> 0 = 0" },
        .{ .a = 1, .b = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0x3FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .description = "positive max >> 1" },
    };

    var allocator = testing.allocator;
    
    for (test_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        const result = try bitwise.op_sar(0, undefined, @ptrCast(&frame));
        _ = result;
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
        try testing.expectEqual(@as(usize, 1), frame.stack.size);
    }
}

/// Test edge cases and error conditions
test "bitwise opcodes - comprehensive edge cases" {
    var allocator = testing.allocator;
    
    // Test that operations work with extreme values
    const extreme_cases = [_]struct {
        op_name: []const u8,
        op_func: *const fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult,
        a: u256,
        b: u256,
        expected: u256,
    }{
        .{ .op_name = "AND", .op_func = bitwise.op_and, .a = 0, .b = 0, .expected = 0 },
        .{ .op_name = "AND", .op_func = bitwise.op_and, 
           .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF },
        
        .{ .op_name = "OR", .op_func = bitwise.op_or, .a = 0, .b = 0, .expected = 0 },
        .{ .op_name = "OR", .op_func = bitwise.op_or,
           .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF },
        
        .{ .op_name = "XOR", .op_func = bitwise.op_xor, .a = 0, .b = 0, .expected = 0 },
        .{ .op_name = "XOR", .op_func = bitwise.op_xor,
           .a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
           .expected = 0 },
    };
    
    for (extreme_cases) |case| {
        var frame = try createTestFrame(allocator, &[_]u256{ case.a, case.b });
        defer frame.memory.deinit();
        
        _ = try case.op_func(0, undefined, @ptrCast(&frame));
        
        const actual = frame.stack.peek_unsafe().*;
        try testing.expectEqual(case.expected, actual);
    }
}

/// Test stack manipulation behavior
test "bitwise opcodes - stack manipulation verification" {
    var allocator = testing.allocator;
    
    // Binary operations should pop 2 and push 1
    {
        var frame = try createTestFrame(allocator, &[_]u256{ 10, 20, 30 });
        defer frame.memory.deinit();
        
        try testing.expectEqual(@as(usize, 3), frame.stack.size);
        
        _ = try bitwise.op_and(0, undefined, @ptrCast(&frame));
        
        try testing.expectEqual(@as(usize, 2), frame.stack.size);
        
        // Top should be the result (20 & 30)
        const expected = 20 & 30;
        try testing.expectEqual(expected, frame.stack.peek_unsafe().*);
    }
    
    // Unary operations should pop 1 and push 1
    {
        var frame = try createTestFrame(allocator, &[_]u256{ 10, 20 });
        defer frame.memory.deinit();
        
        try testing.expectEqual(@as(usize, 2), frame.stack.size);
        
        _ = try bitwise.op_not(0, undefined, @ptrCast(&frame));
        
        try testing.expectEqual(@as(usize, 2), frame.stack.size);
        
        // Top should be the result (~20)
        const expected = ~@as(u256, 20);
        try testing.expectEqual(expected, frame.stack.peek_unsafe().*);
    }
}