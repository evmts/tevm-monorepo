/// Comprehensive test suite for EVM bitwise operations
/// Based on test cases from go-ethereum, revm, and evmone implementations
/// Covers all edge cases, bit manipulation patterns, and gas consumption

const std = @import("std");
const testing = std.testing;
const helpers = @import("../opcodes/test_helpers.zig");

// Import bitwise module directly to test implementation functions
const bitwise = @import("../../../src/evm/execution/bitwise.zig");

// Test constants from reference implementations
const TEST_VECTORS = struct {
    const ZERO = 0x0000000000000000000000000000000000000000000000000000000000000000;
    const ONE = 0x0000000000000000000000000000000000000000000000000000000000000001;
    const MAX_U256 = std.math.maxInt(u256);
    const SIGN_BIT = @as(u256, 1) << 255;
    const HIGH_BIT_PATTERN = 0x8000000000000000000000000000000000000000000000000000000000000000;
    const LOW_BIT_PATTERN = 0x0000000000000000000000000000000000000000000000000000000000000001;
    const ALTERNATING_BITS = 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA;
    const INVERTED_ALTERNATING = 0x5555555555555555555555555555555555555555555555555555555555555555;
};

// ============================================================================
// AND (0x16) - Comprehensive Tests
// ============================================================================

test "AND: Truth table and bitwise patterns" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x16}, // AND
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test case matrix based on revm test patterns
    const test_cases = [_]struct { a: u256, b: u256, expected: u256, desc: []const u8 }{
        .{ .a = TEST_VECTORS.ZERO, .b = TEST_VECTORS.ZERO, .expected = TEST_VECTORS.ZERO, .desc = "0 & 0 = 0" },
        .{ .a = TEST_VECTORS.ZERO, .b = TEST_VECTORS.MAX_U256, .expected = TEST_VECTORS.ZERO, .desc = "0 & MAX = 0" },
        .{ .a = TEST_VECTORS.MAX_U256, .b = TEST_VECTORS.ZERO, .expected = TEST_VECTORS.ZERO, .desc = "MAX & 0 = 0" },
        .{ .a = TEST_VECTORS.MAX_U256, .b = TEST_VECTORS.MAX_U256, .expected = TEST_VECTORS.MAX_U256, .desc = "MAX & MAX = MAX" },
        
        // Bit pattern tests
        .{ .a = TEST_VECTORS.ALTERNATING_BITS, .b = TEST_VECTORS.INVERTED_ALTERNATING, .expected = 0, .desc = "Alternating patterns" },
        .{ .a = TEST_VECTORS.ALTERNATING_BITS, .b = TEST_VECTORS.ALTERNATING_BITS, .expected = TEST_VECTORS.ALTERNATING_BITS, .desc = "Same alternating pattern" },
        
        // Masking operations
        .{ .a = 0xFF00FF00FF00FF00, .b = 0x00FF00FF00FF00FF, .expected = 0, .desc = "Complementary masks" },
        .{ .a = 0x123456789ABCDEF0, .b = 0xFFFFFFFFFFFFFFFF, .expected = 0x123456789ABCDEF0, .desc = "Identity with all 1s" },
        .{ .a = 0x123456789ABCDEF0, .b = 0x00000000000000FF, .expected = 0xF0, .desc = "Extract bottom byte" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.a, case.b });
        _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

test "AND: Gas consumption validation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x16},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test gas consumption (AND costs 3 gas - GasFastestStep)
    test_frame.frame.gas_remaining = 1000;
    try test_frame.pushStack(&[_]u256{ 0x42, 0x24 });

    const jump_table = helpers.JumpTable.init_from_hardfork(.FRONTIER);
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x16, test_vm.vm, test_frame.frame);
    try helpers.expectGasUsed(test_frame.frame, 1000, 3);
}

// ============================================================================
// OR (0x17) - Comprehensive Tests
// ============================================================================

test "OR: Truth table and set operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x17}, // OR
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const test_cases = [_]struct { a: u256, b: u256, expected: u256, desc: []const u8 }{
        .{ .a = TEST_VECTORS.ZERO, .b = TEST_VECTORS.ZERO, .expected = TEST_VECTORS.ZERO, .desc = "0 | 0 = 0" },
        .{ .a = TEST_VECTORS.ZERO, .b = TEST_VECTORS.MAX_U256, .expected = TEST_VECTORS.MAX_U256, .desc = "0 | MAX = MAX" },
        .{ .a = TEST_VECTORS.MAX_U256, .b = TEST_VECTORS.ZERO, .expected = TEST_VECTORS.MAX_U256, .desc = "MAX | 0 = MAX" },
        .{ .a = TEST_VECTORS.MAX_U256, .b = TEST_VECTORS.MAX_U256, .expected = TEST_VECTORS.MAX_U256, .desc = "MAX | MAX = MAX" },
        
        // Bit setting operations
        .{ .a = 0xF000F000F000F000, .b = 0x0F000F000F000F00, .expected = 0xFF00FF00FF00FF00, .desc = "Set additional bits" },
        .{ .a = TEST_VECTORS.ALTERNATING_BITS, .b = TEST_VECTORS.INVERTED_ALTERNATING, .expected = TEST_VECTORS.MAX_U256, .desc = "Complementary OR = MAX" },
        
        // Identity operations
        .{ .a = 0x123456789ABCDEF0, .b = 0x0000000000000000, .expected = 0x123456789ABCDEF0, .desc = "OR with zero is identity" },
        .{ .a = 0x0000000000000001, .b = 0x8000000000000000, .expected = 0x8000000000000001, .desc = "Set high and low bits" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.a, case.b });
        _ = try helpers.executeOpcode(0x17, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

// ============================================================================
// XOR (0x18) - Comprehensive Tests  
// ============================================================================

test "XOR: Toggle operations and symmetric properties" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x18}, // XOR
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const test_cases = [_]struct { a: u256, b: u256, expected: u256, desc: []const u8 }{
        .{ .a = TEST_VECTORS.ZERO, .b = TEST_VECTORS.ZERO, .expected = TEST_VECTORS.ZERO, .desc = "0 ^ 0 = 0" },
        .{ .a = TEST_VECTORS.ZERO, .b = TEST_VECTORS.MAX_U256, .expected = TEST_VECTORS.MAX_U256, .desc = "0 ^ MAX = MAX" },
        .{ .a = TEST_VECTORS.MAX_U256, .b = TEST_VECTORS.MAX_U256, .expected = TEST_VECTORS.ZERO, .desc = "MAX ^ MAX = 0" },
        
        // Self-cancellation property
        .{ .a = 0x123456789ABCDEF0, .b = 0x123456789ABCDEF0, .expected = 0, .desc = "X ^ X = 0" },
        
        // Toggle patterns
        .{ .a = TEST_VECTORS.ALTERNATING_BITS, .b = TEST_VECTORS.INVERTED_ALTERNATING, .expected = TEST_VECTORS.MAX_U256, .desc = "Complementary XOR = MAX" },
        .{ .a = 0b1010, .b = 0b1100, .expected = 0b0110, .desc = "Bit toggle pattern" },
        
        // XOR as toggle operation
        .{ .a = 0xFF00FF00FF00FF00, .b = 0xFFFFFFFFFFFFFFFF, .expected = 0x00FF00FF00FF00FF, .desc = "Invert with all 1s" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.a, case.b });
        _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

test "XOR: Encryption/decryption properties" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x18}, // XOR
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test XOR encryption/decryption property: (A ^ B) ^ B = A
    const plaintext = 0x123456789ABCDEF0123456789ABCDEF0;
    const key = 0xDEADBEEFCAFEBABEDEADBEEFCAFEBABE;

    // First XOR: encrypt
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ plaintext, key });
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame);
    const encrypted = try test_frame.popStack();

    // Second XOR: decrypt
    try test_frame.pushStack(&[_]u256{ encrypted, key });
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame);
    const decrypted = try test_frame.popStack();

    try testing.expectEqual(plaintext, decrypted);
}

// ============================================================================
// NOT (0x19) - Comprehensive Tests
// ============================================================================

test "NOT: Bit inversion and complement operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x19}, // NOT
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const test_cases = [_]struct { input: u256, expected: u256, desc: []const u8 }{
        .{ .input = TEST_VECTORS.ZERO, .expected = TEST_VECTORS.MAX_U256, .desc = "NOT 0 = MAX" },
        .{ .input = TEST_VECTORS.MAX_U256, .expected = TEST_VECTORS.ZERO, .desc = "NOT MAX = 0" },
        .{ .input = TEST_VECTORS.ONE, .expected = TEST_VECTORS.MAX_U256 - 1, .desc = "NOT 1 = MAX - 1" },
        .{ .input = TEST_VECTORS.ALTERNATING_BITS, .expected = TEST_VECTORS.INVERTED_ALTERNATING, .desc = "NOT alternating pattern" },
        .{ .input = 0xFF00FF00FF00FF00, .expected = 0x00FF00FF00FF00FF, .desc = "NOT byte pattern" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{case.input});
        _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

test "NOT: Double negation property" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x19}, // NOT
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test NOT(NOT(X)) = X property
    const test_values = [_]u256{
        0x123456789ABCDEF0,
        TEST_VECTORS.ALTERNATING_BITS,
        0xFF00FF00FF00FF00,
        42,
        TEST_VECTORS.SIGN_BIT,
    };

    for (test_values) |original| {
        // First NOT
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{original});
        _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame);
        const first_not = try test_frame.popStack();

        // Second NOT
        try test_frame.pushStack(&[_]u256{first_not});
        _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame);
        const double_not = try test_frame.popStack();

        try testing.expectEqual(original, double_not);
    }
}

// ============================================================================
// BYTE (0x1A) - Comprehensive Tests
// ============================================================================

test "BYTE: Systematic byte extraction from revm patterns" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x1A}, // BYTE
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test value from revm: 0x1234567890abcdef1234567890abcdef (extended to 256-bit)
    const test_value = @as(u256, 0x1234567890abcdef1234567890abcdef);

    // Test all valid byte positions (0-31)
    for (0..32) |i| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ test_value, @as(u256, i) });
        _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame);
        const result = try test_frame.popStack();

        // Calculate expected byte value
        const byte_pos = 31 - i; // Byte 0 is MSB, byte 31 is LSB
        const shift_amount = @as(u8, @intCast(byte_pos * 8));
        const expected = (test_value >> shift_amount) & 0xFF;

        try testing.expectEqual(expected, result);
    }

    // Test out of bounds (index >= 32)
    const out_of_bounds_tests = [_]u256{ 32, 33, 100, 256, TEST_VECTORS.MAX_U256 };
    for (out_of_bounds_tests) |index| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ test_value, index });
        _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, 0);
    }
}

test "BYTE: Known pattern validation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x1A},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Create test value with known byte pattern
    var pattern_value: u256 = 0;
    for (0..32) |i| {
        const byte_val = @as(u256, 31 - i); // Byte value equals position
        pattern_value = (pattern_value << 8) | byte_val;
    }

    const test_cases = [_]struct { index: u256, expected: u256, desc: []const u8 }{
        .{ .index = 0, .expected = 31, .desc = "MSB byte" },
        .{ .index = 1, .expected = 30, .desc = "Second byte" },
        .{ .index = 30, .expected = 1, .desc = "Second to last byte" },
        .{ .index = 31, .expected = 0, .desc = "LSB byte" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ pattern_value, case.index });
        _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

// ============================================================================
// SHL (0x1B) - Comprehensive Tests based on revm
// ============================================================================

test "SHL: Comprehensive shift patterns from revm test suite" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x1B}, // SHL
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test cases from revm implementation
    const test_cases = [_]struct { value: u256, shift: u256, expected: u256, desc: []const u8 }{
        // Basic shifts
        .{ .value = 0x01, .shift = 0x00, .expected = 0x01, .desc = "1 << 0 = 1" },
        .{ .value = 0x01, .shift = 0x01, .expected = 0x02, .desc = "1 << 1 = 2" },
        .{ .value = 0x01, .shift = 0xFF, .expected = TEST_VECTORS.SIGN_BIT, .desc = "1 << 255 = sign bit" },
        .{ .value = 0x01, .shift = 0x100, .expected = 0x00, .desc = "1 << 256 = 0 (overflow)" },
        .{ .value = 0x01, .shift = 0x101, .expected = 0x00, .desc = "1 << 257 = 0 (overflow)" },
        
        // All 1s pattern
        .{ .value = TEST_VECTORS.MAX_U256, .shift = 0x00, .expected = TEST_VECTORS.MAX_U256, .desc = "MAX << 0 = MAX" },
        .{ .value = TEST_VECTORS.MAX_U256, .shift = 0x01, .expected = TEST_VECTORS.MAX_U256 - 1, .desc = "MAX << 1 drops LSB" },
        .{ .value = TEST_VECTORS.MAX_U256, .shift = 0xFF, .expected = TEST_VECTORS.SIGN_BIT, .desc = "MAX << 255 = sign bit" },
        .{ .value = TEST_VECTORS.MAX_U256, .shift = 0x100, .expected = 0x00, .desc = "MAX << 256 = 0" },
        
        // Zero handling
        .{ .value = 0x00, .shift = 0x01, .expected = 0x00, .desc = "0 << 1 = 0" },
        
        // Large positive number
        .{ .value = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .shift = 0x01, .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE, .desc = "MAX_POSITIVE << 1" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.value, case.shift });
        _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

// ============================================================================
// SHR (0x1C) - Logical right shift tests
// ============================================================================

test "SHR: Logical right shift comprehensive patterns" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x1C}, // SHR
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test cases based on revm logical shift right tests
    const test_cases = [_]struct { value: u256, shift: u256, expected: u256, desc: []const u8 }{
        // Basic shifts
        .{ .value = 0x01, .shift = 0x00, .expected = 0x01, .desc = "1 >> 0 = 1" },
        .{ .value = 0x01, .shift = 0x01, .expected = 0x00, .desc = "1 >> 1 = 0" },
        
        // Sign bit shifts
        .{ .value = TEST_VECTORS.SIGN_BIT, .shift = 0x01, .expected = 0x4000000000000000000000000000000000000000000000000000000000000000, .desc = "SIGN_BIT >> 1" },
        .{ .value = TEST_VECTORS.SIGN_BIT, .shift = 0xFF, .expected = 0x01, .desc = "SIGN_BIT >> 255 = 1" },
        .{ .value = TEST_VECTORS.SIGN_BIT, .shift = 0x100, .expected = 0x00, .desc = "SIGN_BIT >> 256 = 0" },
        .{ .value = TEST_VECTORS.SIGN_BIT, .shift = 0x101, .expected = 0x00, .desc = "SIGN_BIT >> 257 = 0" },
        
        // All 1s pattern
        .{ .value = TEST_VECTORS.MAX_U256, .shift = 0x00, .expected = TEST_VECTORS.MAX_U256, .desc = "MAX >> 0 = MAX" },
        .{ .value = TEST_VECTORS.MAX_U256, .shift = 0x01, .expected = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .desc = "MAX >> 1" },
        .{ .value = TEST_VECTORS.MAX_U256, .shift = 0xFF, .expected = 0x01, .desc = "MAX >> 255 = 1" },
        .{ .value = TEST_VECTORS.MAX_U256, .shift = 0x100, .expected = 0x00, .desc = "MAX >> 256 = 0" },
        
        // Zero handling
        .{ .value = 0x00, .shift = 0x01, .expected = 0x00, .desc = "0 >> 1 = 0" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.value, case.shift });
        _ = try helpers.executeOpcode(0x1C, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

// ============================================================================
// SAR (0x1D) - Arithmetic right shift tests
// ============================================================================

test "SAR: Arithmetic right shift with sign extension" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x1D}, // SAR
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test cases based on revm arithmetic shift right tests
    const test_cases = [_]struct { value: u256, shift: u256, expected: u256, desc: []const u8 }{
        // Positive number shifts (same as logical)
        .{ .value = 0x01, .shift = 0x00, .expected = 0x01, .desc = "1 >>> 0 = 1" },
        .{ .value = 0x01, .shift = 0x01, .expected = 0x00, .desc = "1 >>> 1 = 0" },
        
        // Negative number shifts (sign extension)
        .{ .value = TEST_VECTORS.SIGN_BIT, .shift = 0x01, .expected = 0xC000000000000000000000000000000000000000000000000000000000000000, .desc = "SIGN_BIT >>> 1 with extension" },
        .{ .value = TEST_VECTORS.SIGN_BIT, .shift = 0xFF, .expected = TEST_VECTORS.MAX_U256, .desc = "SIGN_BIT >>> 255 = all 1s" },
        .{ .value = TEST_VECTORS.SIGN_BIT, .shift = 0x100, .expected = TEST_VECTORS.MAX_U256, .desc = "SIGN_BIT >>> 256 = all 1s" },
        .{ .value = TEST_VECTORS.SIGN_BIT, .shift = 0x101, .expected = TEST_VECTORS.MAX_U256, .desc = "SIGN_BIT >>> 257 = all 1s" },
        
        // All 1s (negative) pattern
        .{ .value = TEST_VECTORS.MAX_U256, .shift = 0x00, .expected = TEST_VECTORS.MAX_U256, .desc = "MAX >>> 0 = MAX" },
        .{ .value = TEST_VECTORS.MAX_U256, .shift = 0x01, .expected = TEST_VECTORS.MAX_U256, .desc = "MAX >>> 1 = MAX (sign extended)" },
        .{ .value = TEST_VECTORS.MAX_U256, .shift = 0xFF, .expected = TEST_VECTORS.MAX_U256, .desc = "MAX >>> 255 = MAX" },
        .{ .value = TEST_VECTORS.MAX_U256, .shift = 0x100, .expected = TEST_VECTORS.MAX_U256, .desc = "MAX >>> 256 = MAX" },
        
        // Zero handling
        .{ .value = 0x00, .shift = 0x01, .expected = 0x00, .desc = "0 >>> 1 = 0" },
        
        // Additional test cases from revm
        .{ .value = 0x4000000000000000000000000000000000000000000000000000000000000000, .shift = 0xFE, .expected = 0x01, .desc = "Positive large shift" },
        .{ .value = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .shift = 0xF8, .expected = 0x7F, .desc = "MAX_POSITIVE >>> 248" },
        .{ .value = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .shift = 0xFE, .expected = 0x01, .desc = "MAX_POSITIVE >>> 254" },
        .{ .value = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .shift = 0xFF, .expected = 0x00, .desc = "MAX_POSITIVE >>> 255 = 0" },
        .{ .value = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .shift = 0x100, .expected = 0x00, .desc = "MAX_POSITIVE >>> 256 = 0" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.value, case.shift });
        _ = try helpers.executeOpcode(0x1D, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

// ============================================================================
// Gas Cost Validation for All Bitwise Operations
// ============================================================================

test "Bitwise: Comprehensive gas cost validation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x16},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const jump_table = helpers.JumpTable.init_from_hardfork(.CANCUN); // Include shift operations

    // Gas cost validation for all bitwise operations
    const gas_tests = [_]struct { opcode: u8, stack_items: u8, expected_gas: u64, desc: []const u8 }{
        .{ .opcode = 0x16, .stack_items = 2, .expected_gas = 3, .desc = "AND" },
        .{ .opcode = 0x17, .stack_items = 2, .expected_gas = 3, .desc = "OR" },
        .{ .opcode = 0x18, .stack_items = 2, .expected_gas = 3, .desc = "XOR" },
        .{ .opcode = 0x19, .stack_items = 1, .expected_gas = 3, .desc = "NOT" },
        .{ .opcode = 0x1A, .stack_items = 2, .expected_gas = 3, .desc = "BYTE" },
        .{ .opcode = 0x1B, .stack_items = 2, .expected_gas = 3, .desc = "SHL" },
        .{ .opcode = 0x1C, .stack_items = 2, .expected_gas = 3, .desc = "SHR" },
        .{ .opcode = 0x1D, .stack_items = 2, .expected_gas = 3, .desc = "SAR" },
    };

    for (gas_tests) |gas_test| {
        test_frame.frame.stack.clear();
        test_frame.frame.gas_remaining = 1000;

        // Push required number of stack items
        for (0..gas_test.stack_items) |_| {
            try test_frame.frame.stack.append(42);
        }

        _ = try helpers.executeOpcodeWithGas(&jump_table, gas_test.opcode, test_vm.vm, test_frame.frame);
        try helpers.expectGasUsed(test_frame.frame, 1000, gas_test.expected_gas);
    }
}

// ============================================================================
// Stack Underflow Error Conditions
// ============================================================================

test "Bitwise: Stack underflow error conditions" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x16},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const underflow_tests = [_]struct { opcode: u8, stack_items: u8, required: u8, desc: []const u8 }{
        // Two-operand operations
        .{ .opcode = 0x16, .stack_items = 0, .required = 2, .desc = "AND empty stack" },
        .{ .opcode = 0x16, .stack_items = 1, .required = 2, .desc = "AND one item" },
        .{ .opcode = 0x17, .stack_items = 1, .required = 2, .desc = "OR one item" },
        .{ .opcode = 0x18, .stack_items = 0, .required = 2, .desc = "XOR empty stack" },
        .{ .opcode = 0x1A, .stack_items = 1, .required = 2, .desc = "BYTE one item" },
        .{ .opcode = 0x1B, .stack_items = 0, .required = 2, .desc = "SHL empty stack" },
        .{ .opcode = 0x1C, .stack_items = 1, .required = 2, .desc = "SHR one item" },
        .{ .opcode = 0x1D, .stack_items = 0, .required = 2, .desc = "SAR empty stack" },
        
        // One-operand operations
        .{ .opcode = 0x19, .stack_items = 0, .required = 1, .desc = "NOT empty stack" },
    };

    for (underflow_tests) |test_case| {
        test_frame.frame.stack.clear();
        
        // Push the specified number of stack items
        for (0..test_case.stack_items) |_| {
            try test_frame.frame.stack.append(42);
        }

        // Should fail with stack underflow
        try testing.expectError(
            helpers.ExecutionError.Error.StackUnderflow,
            helpers.executeOpcode(test_case.opcode, test_vm.vm, test_frame.frame)
        );
    }
}

// ============================================================================
// Advanced Bit Manipulation Patterns
// ============================================================================

test "Bitwise: Advanced bit manipulation use cases" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x16}, // Using AND for various tests
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test bit counting patterns (population count simulation)
    const bit_count_tests = [_]struct { value: u256, mask: u256, expected_bits: u32 }{
        .{ .value = 0b1111, .mask = 0b1111, .expected_bits = 4 },
        .{ .value = 0b1010, .mask = 0b1111, .expected_bits = 2 },
        .{ .value = 0xFF00FF00, .mask = 0xFFFFFFFF, .expected_bits = 16 },
    };

    for (bit_count_tests) |test_case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ test_case.value, test_case.mask });
        _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame);
        const result = try test_frame.popStack();
        
        // Count actual bits in result
        var bit_count: u32 = 0;
        var temp = result;
        while (temp > 0) {
            if (temp & 1 == 1) bit_count += 1;
            temp >>= 1;
        }
        
        try testing.expectEqual(test_case.expected_bits, bit_count);
    }
}

test "Bitwise: Shift edge cases and boundary conditions" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x1B}, // SHL
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test boundary shift amounts
    const boundary_tests = [_]struct { shift: u256, desc: []const u8 }{
        .{ .shift = 254, .desc = "Shift by 254" },
        .{ .shift = 255, .desc = "Shift by 255 (max valid)" },
        .{ .shift = 256, .desc = "Shift by 256 (overflow)" },
        .{ .shift = 257, .desc = "Shift by 257 (overflow)" },
        .{ .shift = 1000, .desc = "Shift by large number" },
        .{ .shift = TEST_VECTORS.MAX_U256, .desc = "Shift by MAX_U256" },
    };

    for (boundary_tests) |test_case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ 1, test_case.shift });
        _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame);
        const result = try test_frame.popStack();
        
        // Any shift >= 256 should result in 0
        if (test_case.shift >= 256) {
            try testing.expectEqual(@as(u256, 0), result);
        }
    }
}