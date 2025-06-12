const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");
const evm = @import("evm");

/// Enhanced bitwise operations edge case tests inspired by revm and go-ethereum patterns
/// 
/// This comprehensive test suite focuses on bit manipulation edge cases, shift overflow handling,
/// and boundary conditions that production EVM implementations handle. Tests are based on
/// patterns found in revm's EIP-145 shift implementations and go-ethereum's bitwise operations.
///
/// Key areas covered:
/// - EIP-145 shift operations with precise overflow handling (SHL, SHR, SAR)
/// - Arithmetic vs logical shift distinction with sign extension
/// - BYTE operation boundary conditions and big-endian indexing
/// - Shift overflow saturation patterns (revm: as_usize_saturated)
/// - Sign bit behavior and two's complement edge cases
/// - Bit manipulation boundary conditions at 256-bit boundaries
/// - Zero operand handling and identity operation verification

test "SHL: Shift left overflow and boundary conditions" {
    // Inspired by revm's EIP-145 shift left implementation
    // Tests precise behavior when shift amounts exceed 256 bits
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test case 1: Shift by exactly 256 (should result in zero)
    try test_frame.pushStack(&[_]u256{ 256, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF });
    _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame); // SHL
    const result_256 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), result_256);

    // Test case 2: Shift by 255 (maximum valid shift)
    const test_value = 0x0000000000000000000000000000000000000000000000000000000000000001;
    try test_frame.pushStack(&[_]u256{ 255, test_value });
    _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame); // SHL
    const result_255 = try test_frame.popStack();
    const expected_255 = @as(u256, 1) << 255; // Should set only the sign bit
    try testing.expectEqual(expected_255, result_255);

    // Test case 3: Shift by 257 (overflow, should be zero)
    try test_frame.pushStack(&[_]u256{ 257, 0x123456789ABCDEF });
    _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame); // SHL
    const result_257 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), result_257);

    // Test case 4: Large shift amount (revm as_usize_saturated pattern)
    const huge_shift = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ huge_shift, 0x42 });
    _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame); // SHL
    const result_huge = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), result_huge);

    // Test case 5: Edge case with bit transitions
    const bit_pattern = 0x8000000000000000000000000000000000000000000000000000000000000000; // Sign bit set
    try test_frame.pushStack(&[_]u256{ 1, bit_pattern });
    _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame); // SHL
    const result_bit_shift = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), result_bit_shift); // Should shift out and become zero
}

test "SHR: Logical shift right with zero-fill behavior" {
    // Inspired by go-ethereum's logical shift right implementation
    // Tests zero-fill behavior and overflow handling
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test case 1: Shift negative value by 1 (should zero-fill, not sign-extend)
    const negative_value = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try test_frame.pushStack(&[_]u256{ 1, negative_value });
    _ = try helpers.executeOpcode(0x1C, test_vm.vm, test_frame.frame); // SHR
    const result_logical = try test_frame.popStack();
    const expected_logical = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; // Zero-fill, not sign-extend
    try testing.expectEqual(expected_logical, result_logical);

    // Test case 2: Shift by exactly 256 (overflow)
    try test_frame.pushStack(&[_]u256{ 256, 0x123456789ABCDEF });
    _ = try helpers.executeOpcode(0x1C, test_vm.vm, test_frame.frame); // SHR
    const result_256 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), result_256);

    // Test case 3: Shift by 255 (almost full shift)
    const sign_bit_only = 0x8000000000000000000000000000000000000000000000000000000000000000;
    try test_frame.pushStack(&[_]u256{ 255, sign_bit_only });
    _ = try helpers.executeOpcode(0x1C, test_vm.vm, test_frame.frame); // SHR
    const result_255 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), result_255); // Should result in 1

    // Test case 4: Multiple bit pattern preservation
    const pattern = 0x5555555555555555555555555555555555555555555555555555555555555555; // Alternating bits
    try test_frame.pushStack(&[_]u256{ 4, pattern });
    _ = try helpers.executeOpcode(0x1C, test_vm.vm, test_frame.frame); // SHR
    const result_pattern = try test_frame.popStack();
    const expected_pattern = 0x0555555555555555555555555555555555555555555555555555555555555555; // Pattern shifted right by 4
    try testing.expectEqual(expected_pattern, result_pattern);
}

test "SAR: Arithmetic shift right with sign extension" {
    // Inspired by revm's arithmetic shift right with proper sign handling
    // Tests sign extension behavior vs logical shift
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test case 1: Positive number arithmetic shift (should zero-fill like logical)
    const positive_value = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; // Max positive
    try test_frame.pushStack(&[_]u256{ 1, positive_value });
    _ = try helpers.executeOpcode(0x1D, test_vm.vm, test_frame.frame); // SAR
    const result_positive = try test_frame.popStack();
    const expected_positive = 0x3FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try testing.expectEqual(expected_positive, result_positive);

    // Test case 2: Negative number arithmetic shift (should sign-extend)
    const negative_value = 0x8000000000000000000000000000000000000000000000000000000000000000; // Min negative
    try test_frame.pushStack(&[_]u256{ 1, negative_value });
    _ = try helpers.executeOpcode(0x1D, test_vm.vm, test_frame.frame); // SAR
    const result_negative = try test_frame.popStack();
    const expected_negative = 0xC000000000000000000000000000000000000000000000000000000000000000; // Sign-extended
    try testing.expectEqual(expected_negative, result_negative);

    // Test case 3: Shift negative by large amount (should be all 1s)
    const all_ones = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try test_frame.pushStack(&[_]u256{ 300, all_ones }); // Shift > 256
    _ = try helpers.executeOpcode(0x1D, test_vm.vm, test_frame.frame); // SAR
    const result_large_negative = try test_frame.popStack();
    try testing.expectEqual(all_ones, result_large_negative); // Should remain all 1s

    // Test case 4: Shift positive by large amount (should be zero)
    try test_frame.pushStack(&[_]u256{ 300, 0x123456789ABCDEF });
    _ = try helpers.executeOpcode(0x1D, test_vm.vm, test_frame.frame); // SAR
    const result_large_positive = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), result_large_positive);

    // Test case 5: Edge case at sign boundary
    const almost_negative = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try test_frame.pushStack(&[_]u256{ 255, almost_negative });
    _ = try helpers.executeOpcode(0x1D, test_vm.vm, test_frame.frame); // SAR
    const result_boundary = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), result_boundary); // Should be zero (positive)
}

test "BYTE: Big-endian byte extraction with boundary conditions" {
    // Inspired by revm's byte operation with proper big-endian indexing
    // Tests byte index boundary handling and out-of-bounds behavior
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test value with known byte pattern
    // Each byte set to its position (big-endian): 0x00, 0x01, 0x02, ..., 0x1F
    const test_value = 0x000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F;

    // Test case 1: Extract byte 0 (MSB - should be 0x00)
    try test_frame.pushStack(&[_]u256{ 0, test_value });
    _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame); // BYTE
    const byte_0 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0x00), byte_0);

    // Test case 2: Extract byte 1 (should be 0x01)
    try test_frame.pushStack(&[_]u256{ 1, test_value });
    _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame); // BYTE
    const byte_1 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0x01), byte_1);

    // Test case 3: Extract byte 31 (LSB - should be 0x1F)
    try test_frame.pushStack(&[_]u256{ 31, test_value });
    _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame); // BYTE
    const byte_31 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0x1F), byte_31);

    // Test case 4: Extract byte 32 (out of bounds - should be 0)
    try test_frame.pushStack(&[_]u256{ 32, test_value });
    _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame); // BYTE
    const byte_32 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), byte_32);

    // Test case 5: Extract with large index (revm as_usize_saturated pattern)
    const huge_index = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ huge_index, test_value });
    _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame); // BYTE
    const byte_huge = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), byte_huge);

    // Test case 6: Extract from zero value
    try test_frame.pushStack(&[_]u256{ 15, 0 });
    _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame); // BYTE
    const byte_from_zero = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), byte_from_zero);

    // Test case 7: Extract from all-ones value
    const all_ones = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try test_frame.pushStack(&[_]u256{ 10, all_ones });
    _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame); // BYTE
    const byte_from_ones = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0xFF), byte_from_ones);
}

test "Bitwise operations: AND, OR, XOR identity and boundary conditions" {
    // Tests basic bitwise operations with identity properties and edge cases
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    const test_value = 0x5555555555555555555555555555555555555555555555555555555555555555; // Alternating bits
    const zero = 0;
    const all_ones = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

    // AND identity tests
    // Test case 1: AND with zero (should be zero)
    try test_frame.pushStack(&[_]u256{ test_value, zero });
    _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame); // AND
    const and_zero = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), and_zero);

    // Test case 2: AND with all ones (should be identity)
    try test_frame.pushStack(&[_]u256{ test_value, all_ones });
    _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame); // AND
    const and_ones = try test_frame.popStack();
    try testing.expectEqual(test_value, and_ones);

    // Test case 3: AND with self (should be identity)
    try test_frame.pushStack(&[_]u256{ test_value, test_value });
    _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame); // AND
    const and_self = try test_frame.popStack();
    try testing.expectEqual(test_value, and_self);

    // OR identity tests
    // Test case 4: OR with zero (should be identity)
    try test_frame.pushStack(&[_]u256{ test_value, zero });
    _ = try helpers.executeOpcode(0x17, test_vm.vm, test_frame.frame); // OR
    const or_zero = try test_frame.popStack();
    try testing.expectEqual(test_value, or_zero);

    // Test case 5: OR with all ones (should be all ones)
    try test_frame.pushStack(&[_]u256{ test_value, all_ones });
    _ = try helpers.executeOpcode(0x17, test_vm.vm, test_frame.frame); // OR
    const or_ones = try test_frame.popStack();
    try testing.expectEqual(all_ones, or_ones);

    // XOR identity tests
    // Test case 6: XOR with zero (should be identity)
    try test_frame.pushStack(&[_]u256{ test_value, zero });
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame); // XOR
    const xor_zero = try test_frame.popStack();
    try testing.expectEqual(test_value, xor_zero);

    // Test case 7: XOR with self (should be zero)
    try test_frame.pushStack(&[_]u256{ test_value, test_value });
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame); // XOR
    const xor_self = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), xor_self);

    // Test case 8: XOR with all ones (should be bitwise NOT)
    try test_frame.pushStack(&[_]u256{ test_value, all_ones });
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame); // XOR
    const xor_ones = try test_frame.popStack();
    const expected_not = ~test_value;
    try testing.expectEqual(expected_not, xor_ones);
}

test "NOT: Bitwise complement edge cases" {
    // Tests NOT operation with various bit patterns
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test case 1: NOT of zero (should be all ones)
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame); // NOT
    const not_zero = try test_frame.popStack();
    const all_ones = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try testing.expectEqual(all_ones, not_zero);

    // Test case 2: NOT of all ones (should be zero)
    try test_frame.pushStack(&[_]u256{all_ones});
    _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame); // NOT
    const not_ones = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), not_ones);

    // Test case 3: NOT of alternating pattern
    const pattern = 0x5555555555555555555555555555555555555555555555555555555555555555;
    try test_frame.pushStack(&[_]u256{pattern});
    _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame); // NOT
    const not_pattern = try test_frame.popStack();
    const expected_pattern = 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA;
    try testing.expectEqual(expected_pattern, not_pattern);

    // Test case 4: NOT of single bit
    const single_bit = 0x0000000000000000000000000000000000000000000000000000000000000001;
    try test_frame.pushStack(&[_]u256{single_bit});
    _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame); // NOT
    const not_single = try test_frame.popStack();
    const expected_single = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE;
    try testing.expectEqual(expected_single, not_single);
}

test "Shift operations: Comprehensive boundary matrix" {
    // Comprehensive test matrix for shift boundary conditions
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test boundary conditions for all shift operations
    const boundary_tests = [_]struct {
        shift: u256,
        value: u256,
        description: []const u8,
    }{
        .{ .shift = 0, .value = 0x123456789ABCDEF, .description = "No shift (identity)" },
        .{ .shift = 1, .value = 0x8000000000000000000000000000000000000000000000000000000000000000, .description = "Single bit shift of sign bit" },
        .{ .shift = 8, .value = 0x00112233445566778899AABBCCDDEEFF00112233445566778899AABBCCDDEEFF, .description = "Byte boundary shift" },
        .{ .shift = 64, .value = 0x123456789ABCDEF, .description = "Word boundary shift" },
        .{ .shift = 128, .value = 0x123456789ABCDEF, .description = "Half-register shift" },
        .{ .shift = 254, .value = 0x0000000000000000000000000000000000000000000000000000000000000003, .description = "Near-maximum shift" },
        .{ .shift = 255, .value = 0x0000000000000000000000000000000000000000000000000000000000000001, .description = "Maximum valid shift" },
        .{ .shift = 256, .value = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .description = "Exact overflow boundary" },
    };

    for (boundary_tests) |test_case| {
        // Test SHL
        try test_frame.pushStack(&[_]u256{ test_case.shift, test_case.value });
        _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame); // SHL
        const shl_result = try test_frame.popStack();
        
        // Test SHR  
        try test_frame.pushStack(&[_]u256{ test_case.shift, test_case.value });
        _ = try helpers.executeOpcode(0x1C, test_vm.vm, test_frame.frame); // SHR
        const shr_result = try test_frame.popStack();
        
        // Test SAR
        try test_frame.pushStack(&[_]u256{ test_case.shift, test_case.value });
        _ = try helpers.executeOpcode(0x1D, test_vm.vm, test_frame.frame); // SAR
        const sar_result = try test_frame.popStack();

        // Verify overflow behavior for shifts >= 256
        if (test_case.shift >= 256) {
            try testing.expectEqual(@as(u256, 0), shl_result);
            try testing.expectEqual(@as(u256, 0), shr_result);
            
            // SAR should be 0 for positive, all 1s for negative
            if (test_case.value >> 255 == 1) { // Negative
                const all_ones = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
                try testing.expectEqual(all_ones, sar_result);
            } else { // Positive
                try testing.expectEqual(@as(u256, 0), sar_result);
            }
        }

        // Identity test for zero shift
        if (test_case.shift == 0) {
            try testing.expectEqual(test_case.value, shl_result);
            try testing.expectEqual(test_case.value, shr_result);
            try testing.expectEqual(test_case.value, sar_result);
        }
    }
}

test "Bitwise operations: Gas cost verification" {
    // Verifies that all bitwise operations consume correct base gas
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    const test_value_a = 0x123456789ABCDEF;
    const test_value_b = 0xFEDCBA987654321;

    // All bitwise operations should consume VERYLOW gas (3 gas)
    const bitwise_ops = [_]struct {
        opcode: u8,
        stack_args: []const u256,
        name: []const u8,
    }{
        .{ .opcode = 0x16, .stack_args = &[_]u256{ test_value_a, test_value_b }, .name = "AND" },
        .{ .opcode = 0x17, .stack_args = &[_]u256{ test_value_a, test_value_b }, .name = "OR" },
        .{ .opcode = 0x18, .stack_args = &[_]u256{ test_value_a, test_value_b }, .name = "XOR" },
        .{ .opcode = 0x19, .stack_args = &[_]u256{test_value_a}, .name = "NOT" },
        .{ .opcode = 0x1A, .stack_args = &[_]u256{ 5, test_value_a }, .name = "BYTE" },
        .{ .opcode = 0x1B, .stack_args = &[_]u256{ 4, test_value_a }, .name = "SHL" },
        .{ .opcode = 0x1C, .stack_args = &[_]u256{ 4, test_value_a }, .name = "SHR" },
        .{ .opcode = 0x1D, .stack_args = &[_]u256{ 4, test_value_a }, .name = "SAR" },
    };

    for (bitwise_ops) |op| {
        const gas_before = 10000;
        test_frame.frame.gas_remaining = gas_before;

        try test_frame.pushStack(op.stack_args);
        _ = try helpers.executeOpcode(op.opcode, test_vm.vm, test_frame.frame);
        
        const gas_after = test_frame.frame.gas_remaining;
        const gas_used = gas_before - gas_after;
        
        // All bitwise operations should use exactly 3 gas (VERYLOW)
        try testing.expectEqual(@as(u64, 3), gas_used);
        
        // Consume result to clean stack
        _ = try test_frame.popStack();
    }
}

test "Bitwise operations: Pattern preservation and bit manipulation" {
    // Tests that bitwise operations correctly preserve or manipulate specific bit patterns
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test pattern: Create a mask and verify bitwise operations work correctly
    const data = 0x5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A; // 01011010 pattern
    const mask = 0x0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F; // Lower nibble mask

    // Test case 1: Extract lower nibbles with AND mask
    try test_frame.pushStack(&[_]u256{ data, mask });
    _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame); // AND
    const masked_data = try test_frame.popStack();
    const expected_masked = 0x0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A;
    try testing.expectEqual(expected_masked, masked_data);

    // Test case 2: Set all lower nibbles with OR
    try test_frame.pushStack(&[_]u256{ data, mask });
    _ = try helpers.executeOpcode(0x17, test_vm.vm, test_frame.frame); // OR
    const or_result = try test_frame.popStack();
    const expected_or = 0x5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F5F;
    try testing.expectEqual(expected_or, or_result);

    // Test case 3: Toggle lower nibbles with XOR
    try test_frame.pushStack(&[_]u256{ data, mask });
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame); // XOR
    const xor_result = try test_frame.popStack();
    const expected_xor = 0x5555555555555555555555555555555555555555555555555555555555555555;
    try testing.expectEqual(expected_xor, xor_result);

    // Test case 4: Extract specific bytes with BYTE operation
    const byte_pattern = 0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF;
    for (0..8) |i| {
        try test_frame.pushStack(&[_]u256{ i * 4, byte_pattern }); // Extract every 4th byte
        _ = try helpers.executeOpcode(0x1A, test_vm.vm, test_frame.frame); // BYTE
        const extracted_byte = try test_frame.popStack();
        
        // Verify the pattern repeats correctly
        const expected_byte = switch (i % 4) {
            0 => 0x01,
            1 => 0x45,
            2 => 0x89,
            3 => 0xCD,
            else => unreachable,
        };
        try testing.expectEqual(@as(u256, expected_byte), extracted_byte);
    }
}