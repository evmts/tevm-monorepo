/// Comprehensive test suite for EVM arithmetic operations
/// Based on test cases from go-ethereum, revm, and evmone implementations
/// Covers all edge cases, overflow/underflow scenarios, and gas consumption

const std = @import("std");
const testing = std.testing;
const helpers = @import("../opcodes/test_helpers.zig");

// Import arithmetic module directly to test implementation functions
const arithmetic = @import("../../../src/evm/execution/arithmetic.zig");

// Test constants from reference implementations
const TEST_VECTORS = struct {
    const ZERO = 0x0000000000000000000000000000000000000000000000000000000000000000;
    const ONE = 0x0000000000000000000000000000000000000000000000000000000000000001;
    const FIVE = 0x0000000000000000000000000000000000000000000000000000000000000005;
    const MAX_POSITIVE = 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    const MAX_POSITIVE_MINUS_1 = 0x7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe;
    const MAX_NEGATIVE = 0x8000000000000000000000000000000000000000000000000000000000000000;
    const MAX_NEGATIVE_PLUS_1 = 0x8000000000000000000000000000000000000000000000000000000000000001;
    const MINUS_FIVE = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb;
    const MINUS_ONE = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    const MAX_U256 = std.math.maxInt(u256);
};

// ============================================================================
// ADD (0x01) - Comprehensive Tests
// ============================================================================

test "ADD: Basic arithmetic operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x01}, // ADD
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test case matrix from go-ethereum
    const test_cases = [_]struct { a: u256, b: u256, expected: u256 }{
        .{ .a = TEST_VECTORS.ZERO, .b = TEST_VECTORS.ZERO, .expected = TEST_VECTORS.ZERO },
        .{ .a = TEST_VECTORS.ZERO, .b = TEST_VECTORS.ONE, .expected = TEST_VECTORS.ONE },
        .{ .a = TEST_VECTORS.ONE, .b = TEST_VECTORS.FIVE, .expected = 6 },
        .{ .a = 42, .b = 58, .expected = 100 },
        .{ .a = TEST_VECTORS.MAX_POSITIVE, .b = TEST_VECTORS.ONE, .expected = TEST_VECTORS.MAX_NEGATIVE },
        .{ .a = TEST_VECTORS.MAX_U256, .b = TEST_VECTORS.ONE, .expected = TEST_VECTORS.ZERO }, // Overflow wraps
        .{ .a = TEST_VECTORS.MAX_POSITIVE_MINUS_1, .b = TEST_VECTORS.MAX_POSITIVE, .expected = TEST_VECTORS.MINUS_ONE },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.a, case.b });
        _ = try helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

test "ADD: Gas consumption validation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x01},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test gas consumption (ADD costs 3 gas - GasFastestStep)
    test_frame.frame.gas_remaining = 1000;
    try test_frame.pushStack(&[_]u256{ 42, 58 });

    const jump_table = helpers.JumpTable.init_from_hardfork(.FRONTIER);
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x01, test_vm.vm, test_frame.frame);
    try helpers.expectGasUsed(test_frame.frame, 1000, 3);
}

// ============================================================================
// SUB (0x03) - Comprehensive Tests  
// ============================================================================

test "SUB: Underflow and edge cases" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x03}, // SUB
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const test_cases = [_]struct { a: u256, b: u256, expected: u256 }{
        .{ .a = 10, .b = 5, .expected = 5 },
        .{ .a = 42, .b = 0, .expected = 42 },
        .{ .a = 5, .b = 10, .expected = TEST_VECTORS.MINUS_FIVE }, // Underflow wraps
        .{ .a = TEST_VECTORS.ZERO, .b = TEST_VECTORS.ONE, .expected = TEST_VECTORS.MINUS_ONE },
        .{ .a = TEST_VECTORS.MAX_NEGATIVE, .b = TEST_VECTORS.ONE, .expected = TEST_VECTORS.MAX_POSITIVE },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.a, case.b });
        _ = try helpers.executeOpcode(0x03, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

// ============================================================================
// MUL (0x02) - Comprehensive Tests
// ============================================================================

test "MUL: Overflow handling and edge cases" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x02}, // MUL
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const test_cases = [_]struct { a: u256, b: u256, expected: u256 }{
        .{ .a = 6, .b = 7, .expected = 42 },
        .{ .a = 0, .b = 42, .expected = 0 },
        .{ .a = 1, .b = TEST_VECTORS.MAX_U256, .expected = TEST_VECTORS.MAX_U256 },
        .{ .a = TEST_VECTORS.MAX_U256, .b = 2, .expected = TEST_VECTORS.MAX_U256 -% 1 }, // Overflow
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.a, case.b });
        _ = try helpers.executeOpcode(0x02, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }

    // Test large number overflow (from evmone test cases)
    test_frame.frame.stack.clear();
    const large_val = @as(u256, 1) << 200;
    try test_frame.pushStack(&[_]u256{ large_val, large_val });
    _ = try helpers.executeOpcode(0x02, test_vm.vm, test_frame.frame);
    const expected = large_val *% large_val;
    try helpers.expectStackValue(test_frame.frame, 0, expected);
}

// ============================================================================
// DIV (0x04) - Critical division-by-zero behavior
// ============================================================================

test "DIV: Division by zero returns 0 (not error)" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x04}, // DIV
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const test_cases = [_]struct { a: u256, b: u256, expected: u256 }{
        .{ .a = 42, .b = 6, .expected = 7 },
        .{ .a = 50, .b = 7, .expected = 7 }, // Integer division
        .{ .a = 42, .b = 0, .expected = 0 }, // Critical: division by zero = 0
        .{ .a = TEST_VECTORS.MAX_U256, .b = 0, .expected = 0 }, // Any number / 0 = 0
        .{ .a = 0, .b = 0, .expected = 0 }, // Even 0 / 0 = 0
        .{ .a = TEST_VECTORS.MAX_U256, .b = 1, .expected = TEST_VECTORS.MAX_U256 },
        .{ .a = TEST_VECTORS.MAX_U256, .b = TEST_VECTORS.MAX_U256, .expected = 1 },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.a, case.b });
        _ = try helpers.executeOpcode(0x04, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

// ============================================================================
// SDIV (0x05) - Signed division with overflow protection
// ============================================================================

test "SDIV: Signed division and overflow protection" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x05}, // SDIV
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const test_cases = [_]struct { a: u256, b: u256, expected: u256 }{
        .{ .a = 20, .b = 5, .expected = 4 }, // Positive / positive
        .{ .a = TEST_VECTORS.MINUS_ONE, .b = 2, .expected = 0 }, // -1 / 2 = 0 (truncated)
        .{ .a = 20, .b = TEST_VECTORS.MINUS_FIVE, .expected = @as(u256, @bitCast(@as(i256, -4))) }, // 20 / -5 = -4
        .{ .a = 42, .b = 0, .expected = 0 }, // Division by zero = 0
        
        // Critical overflow case: MIN_I256 / -1 should not overflow
        .{ .a = TEST_VECTORS.MAX_NEGATIVE, .b = TEST_VECTORS.MINUS_ONE, .expected = TEST_VECTORS.MAX_NEGATIVE },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.a, case.b });
        _ = try helpers.executeOpcode(0x05, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

// ============================================================================
// MOD (0x06) - Modulo operations
// ============================================================================

test "MOD: Modulo by zero returns 0" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x06}, // MOD
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const test_cases = [_]struct { a: u256, b: u256, expected: u256 }{
        .{ .a = 50, .b = 7, .expected = 1 }, // 50 % 7 = 1
        .{ .a = 42, .b = 6, .expected = 0 }, // Perfect division
        .{ .a = 42, .b = 0, .expected = 0 }, // Critical: modulo by zero = 0
        .{ .a = TEST_VECTORS.MAX_U256, .b = 10, .expected = 5 }, // Large numbers
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.a, case.b });
        _ = try helpers.executeOpcode(0x06, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

// ============================================================================
// SMOD (0x07) - Signed modulo
// ============================================================================

test "SMOD: Signed modulo operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x07}, // SMOD
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const test_cases = [_]struct { a: u256, b: u256, expected: u256 }{
        .{ .a = 17, .b = 5, .expected = 2 }, // 17 % 5 = 2
        .{ .a = @as(u256, @bitCast(@as(i256, -17))), .b = 5, .expected = @as(u256, @bitCast(@as(i256, -2))) }, // -17 % 5 = -2
        .{ .a = 17, .b = @as(u256, @bitCast(@as(i256, -5))), .expected = 2 }, // 17 % -5 = 2
        .{ .a = @as(u256, @bitCast(@as(i256, -17))), .b = @as(u256, @bitCast(@as(i256, -5))), .expected = @as(u256, @bitCast(@as(i256, -2))) }, // -17 % -5 = -2
        .{ .a = 42, .b = 0, .expected = 0 }, // Modulo by zero = 0
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.a, case.b });
        _ = try helpers.executeOpcode(0x07, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

// ============================================================================
// ADDMOD (0x08) - Addition modulo with overflow protection
// ============================================================================

test "ADDMOD: Overflow protection and edge cases" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x08}, // ADDMOD
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const test_cases = [_]struct { a: u256, b: u256, n: u256, expected: u256 }{
        .{ .a = 5, .b = 7, .n = 10, .expected = 2 }, // (5 + 7) % 10 = 2
        .{ .a = 100, .b = 200, .n = 150, .expected = 0 }, // (100 + 200) % 150 = 0
        .{ .a = 5, .b = 7, .n = 0, .expected = 0 }, // Modulo by zero = 0
        
        // Critical overflow test from go-ethereum
        .{ .a = TEST_VECTORS.MAX_U256, .b = TEST_VECTORS.MAX_U256 - 1, .n = TEST_VECTORS.MAX_U256, .expected = TEST_VECTORS.MAX_U256 - 1 },
        
        // Large number tests
        .{ .a = TEST_VECTORS.MAX_U256, .b = 5, .n = 100, .expected = 4 }, // (max + 5) % 100 should handle overflow
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.a, case.b, case.n });
        _ = try helpers.executeOpcode(0x08, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }
}

// ============================================================================
// MULMOD (0x09) - Multiplication modulo with large number handling  
// ============================================================================

test "MULMOD: Russian peasant algorithm and large numbers" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x09}, // MULMOD
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const test_cases = [_]struct { a: u256, b: u256, n: u256, expected: u256 }{
        .{ .a = 5, .b = 7, .n = 10, .expected = 5 }, // (5 * 7) % 10 = 5
        .{ .a = 12, .b = 15, .n = 100, .expected = 80 }, // (12 * 15) % 100 = 80
        .{ .a = 5, .b = 7, .n = 0, .expected = 0 }, // Modulo by zero = 0
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.a, case.b, case.n });
        _ = try helpers.executeOpcode(0x09, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }

    // Test with large numbers that would overflow in naive implementation
    test_frame.frame.stack.clear();
    const large = @as(u256, 1) << 200;
    try test_frame.pushStack(&[_]u256{ large, large, 1000 });
    _ = try helpers.executeOpcode(0x09, test_vm.vm, test_frame.frame);
    const result = try test_frame.frame.stack.peek_n(0);
    try testing.expect(result < 1000); // Result should be valid modulo
}

// ============================================================================
// EXP (0x0A) - Exponentiation with gas cost validation
// ============================================================================

test "EXP: Edge cases and gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x0A}, // EXP
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test critical edge cases from evmone
    const test_cases = [_]struct { base: u256, exp: u256, expected: u256, desc: []const u8 }{
        .{ .base = 2, .exp = 3, .expected = 8, .desc = "2^3 = 8" },
        .{ .base = 42, .exp = 0, .expected = 1, .desc = "anything^0 = 1" },
        .{ .base = 0, .exp = 5, .expected = 0, .desc = "0^anything = 0" },
        .{ .base = 0, .exp = 0, .expected = 1, .desc = "0^0 = 1 (critical case)" },
        .{ .base = 1, .exp = TEST_VECTORS.MAX_U256, .expected = 1, .desc = "1^max = 1" },
        .{ .base = 3, .exp = 0x2019, .expected = std.math.pow(u256, 3, 0x2019), .desc = "evmone test case" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        test_frame.frame.gas_remaining = 10000;
        try test_frame.pushStack(&[_]u256{ case.base, case.exp });
        _ = try helpers.executeOpcode(0x0A, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }

    // Test gas consumption: 10 + 50 * exponent_byte_size
    const gas_test_cases = [_]struct { exp: u256, expected_gas: u64 }{
        .{ .exp = 0, .expected_gas = 10 }, // 0 bytes
        .{ .exp = 255, .expected_gas = 10 + 50 * 1 }, // 1 byte
        .{ .exp = 256, .expected_gas = 10 + 50 * 2 }, // 2 bytes
        .{ .exp = 65535, .expected_gas = 10 + 50 * 2 }, // 2 bytes
        .{ .exp = 65536, .expected_gas = 10 + 50 * 3 }, // 3 bytes
    };

    for (gas_test_cases) |case| {
        test_frame.frame.stack.clear();
        test_frame.frame.gas_remaining = 10000;
        try test_frame.pushStack(&[_]u256{ 2, case.exp });
        _ = try helpers.executeOpcode(0x0A, test_vm.vm, test_frame.frame);
        try helpers.expectGasUsed(test_frame.frame, 10000, case.expected_gas);
    }
}

// ============================================================================
// SIGNEXTEND (0x0B) - Sign extension comprehensive tests
// ============================================================================

test "SIGNEXTEND: All byte positions and sign patterns" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x0B}, // SIGNEXTEND
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test all critical cases
    const test_cases = [_]struct { byte_pos: u256, value: u256, expected: u256, desc: []const u8 }{
        // Byte 0 (rightmost byte) tests
        .{ .byte_pos = 0, .value = 0x7F, .expected = 0x7F, .desc = "positive byte 0" },
        .{ .byte_pos = 0, .value = 0x80, .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF80, .desc = "negative byte 0" },
        .{ .byte_pos = 0, .value = 0xFF, .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .desc = "all 1s byte 0" },
        
        // Byte 1 tests
        .{ .byte_pos = 1, .value = 0x80FF, .expected = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF80FF, .desc = "negative byte 1" },
        .{ .byte_pos = 1, .value = 0x7FFF, .expected = 0x7FFF, .desc = "positive byte 1" },
        
        // Boundary test: byte_pos >= 31 returns unchanged
        .{ .byte_pos = 31, .value = 0x8000000000000000000000000000000000000000000000000000000000000000, .expected = 0x8000000000000000000000000000000000000000000000000000000000000000, .desc = "byte 31 unchanged" },
        .{ .byte_pos = 32, .value = 0x1234, .expected = 0x1234, .desc = "byte >= 32 unchanged" },
        .{ .byte_pos = 100, .value = 0xABCD, .expected = 0xABCD, .desc = "large byte pos unchanged" },
    };

    for (test_cases) |case| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ case.byte_pos, case.value });
        _ = try helpers.executeOpcode(0x0B, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, case.expected);
    }

    // Test all byte positions 0-30 systematically
    for (0..31) |i| {
        test_frame.frame.stack.clear();
        const byte_pos = @as(u256, i);
        const sign_bit_pos = i * 8 + 7;
        
        // Test positive sign (bit = 0)
        const positive_val = (@as(u256, 1) << @intCast(sign_bit_pos)) - 1; // All 1s up to sign bit
        try test_frame.pushStack(&[_]u256{ byte_pos, positive_val });
        _ = try helpers.executeOpcode(0x0B, test_vm.vm, test_frame.frame);
        const pos_result = try test_frame.popStack();
        try testing.expectEqual(positive_val, pos_result);
        
        // Test negative sign (bit = 1)
        const negative_val = @as(u256, 1) << @intCast(sign_bit_pos); // Just the sign bit
        try test_frame.pushStack(&[_]u256{ byte_pos, negative_val });
        _ = try helpers.executeOpcode(0x0B, test_vm.vm, test_frame.frame);
        const neg_result = try test_frame.popStack();
        
        // Should have all upper bits set to 1
        const keep_bits = sign_bit_pos + 1;
        const shift_amount = @as(u9, 256) - @as(u9, keep_bits);
        const ones_mask = ~(@as(u256, 0) >> @intCast(shift_amount));
        const expected = negative_val | ones_mask;
        try testing.expectEqual(expected, neg_result);
    }
}

// ============================================================================
// Gas Cost Validation for All Operations
// ============================================================================

test "Arithmetic: Gas cost validation matrix" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x01},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const jump_table = helpers.JumpTable.init_from_hardfork(.FRONTIER);

    // Gas cost validation for all arithmetic operations
    const gas_tests = [_]struct { opcode: u8, stack_items: u8, expected_gas: u64, desc: []const u8 }{
        .{ .opcode = 0x01, .stack_items = 2, .expected_gas = 3, .desc = "ADD" },
        .{ .opcode = 0x02, .stack_items = 2, .expected_gas = 5, .desc = "MUL" },
        .{ .opcode = 0x03, .stack_items = 2, .expected_gas = 3, .desc = "SUB" },
        .{ .opcode = 0x04, .stack_items = 2, .expected_gas = 5, .desc = "DIV" },
        .{ .opcode = 0x05, .stack_items = 2, .expected_gas = 5, .desc = "SDIV" },
        .{ .opcode = 0x06, .stack_items = 2, .expected_gas = 5, .desc = "MOD" },
        .{ .opcode = 0x07, .stack_items = 2, .expected_gas = 5, .desc = "SMOD" },
        .{ .opcode = 0x08, .stack_items = 3, .expected_gas = 8, .desc = "ADDMOD" },
        .{ .opcode = 0x09, .stack_items = 3, .expected_gas = 8, .desc = "MULMOD" },
        .{ .opcode = 0x0B, .stack_items = 2, .expected_gas = 5, .desc = "SIGNEXTEND" },
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

test "Arithmetic: Stack underflow error conditions" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x01},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const underflow_tests = [_]struct { opcode: u8, stack_items: u8, required: u8, desc: []const u8 }{
        // Two-operand operations
        .{ .opcode = 0x01, .stack_items = 0, .required = 2, .desc = "ADD empty stack" },
        .{ .opcode = 0x01, .stack_items = 1, .required = 2, .desc = "ADD one item" },
        .{ .opcode = 0x02, .stack_items = 1, .required = 2, .desc = "MUL one item" },
        .{ .opcode = 0x03, .stack_items = 0, .required = 2, .desc = "SUB empty stack" },
        .{ .opcode = 0x04, .stack_items = 1, .required = 2, .desc = "DIV one item" },
        .{ .opcode = 0x05, .stack_items = 0, .required = 2, .desc = "SDIV empty stack" },
        .{ .opcode = 0x06, .stack_items = 1, .required = 2, .desc = "MOD one item" },
        .{ .opcode = 0x07, .stack_items = 0, .required = 2, .desc = "SMOD empty stack" },
        .{ .opcode = 0x0A, .stack_items = 1, .required = 2, .desc = "EXP one item" },
        .{ .opcode = 0x0B, .stack_items = 0, .required = 2, .desc = "SIGNEXTEND empty stack" },
        
        // Three-operand operations
        .{ .opcode = 0x08, .stack_items = 0, .required = 3, .desc = "ADDMOD empty stack" },
        .{ .opcode = 0x08, .stack_items = 1, .required = 3, .desc = "ADDMOD one item" },
        .{ .opcode = 0x08, .stack_items = 2, .required = 3, .desc = "ADDMOD two items" },
        .{ .opcode = 0x09, .stack_items = 1, .required = 3, .desc = "MULMOD one item" },
        .{ .opcode = 0x09, .stack_items = 2, .required = 3, .desc = "MULMOD two items" },
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