const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");
const evm = @import("evm");

/// Enhanced comparison operations edge case tests inspired by revm and go-ethereum patterns
/// 
/// This comprehensive test suite focuses on signed vs unsigned comparison distinctions,
/// two's complement boundary conditions, and edge cases that production EVM implementations handle.
/// Tests are based on patterns found in revm's i256_cmp implementation and go-ethereum's comparison logic.
///
/// Key areas covered:
/// - Two's complement boundary conditions (MIN_NEGATIVE vs MAX_POSITIVE)
/// - Signed vs unsigned comparison distinctions with identical bit patterns
/// - Cross-zero boundary comparisons (-1 vs +1, etc.)
/// - Stack order verification (which operand is compared to which)
/// - Zero detection and boundary cases around zero
/// - Critical edge cases around 0x7FFF...FFF and 0x8000...000
/// - Sign bit transition testing and overflow behavior

test "LT/GT: Unsigned comparison with large values" {
    // Tests unsigned comparison behavior with values that would be negative if interpreted as signed
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

    // Test case 1: Compare large unsigned values (would be negative as signed)
    const large_a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; // Max u256
    const large_b = 0x8000000000000000000000000000000000000000000000000000000000000000; // Min negative as signed

    // LT: large_a < large_b (unsigned) -> false (since large_a > large_b as unsigned)
    try test_frame.pushStack(&[_]u256{ large_b, large_a }); // stack: [large_a, large_b] (large_b on top)
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame); // LT
    const lt_result = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), lt_result); // large_a > large_b as unsigned

    // GT: large_a > large_b (unsigned) -> true
    try test_frame.pushStack(&[_]u256{ large_b, large_a });
    _ = try helpers.executeOpcode(0x11, test_vm.vm, test_frame.frame); // GT
    const gt_result = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), gt_result); // large_a > large_b as unsigned

    // Test case 2: Boundary values around max positive signed
    const max_positive = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    const min_negative = 0x8000000000000000000000000000000000000000000000000000000000000000;

    // Unsigned: min_negative > max_positive (since MSB gives it larger unsigned value)
    try test_frame.pushStack(&[_]u256{ max_positive, min_negative });
    _ = try helpers.executeOpcode(0x11, test_vm.vm, test_frame.frame); // GT
    const boundary_gt = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), boundary_gt); // min_negative > max_positive as unsigned

    try test_frame.pushStack(&[_]u256{ max_positive, min_negative });
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame); // LT
    const boundary_lt = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), boundary_lt); // min_negative > max_positive as unsigned
}

test "SLT/SGT: Signed comparison with two's complement edge cases" {
    // Tests signed comparison behavior focusing on two's complement boundaries
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

    // Test case 1: Critical two's complement boundaries (revm patterns)
    const max_positive = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; // +2^255 - 1
    const min_negative = 0x8000000000000000000000000000000000000000000000000000000000000000; // -2^255

    // SLT: min_negative < max_positive (signed) -> true (opposite of unsigned!)
    try test_frame.pushStack(&[_]u256{ max_positive, min_negative });
    _ = try helpers.executeOpcode(0x12, test_vm.vm, test_frame.frame); // SLT
    const slt_boundary = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), slt_boundary); // min_negative < max_positive as signed

    // SGT: max_positive > min_negative (signed) -> true
    try test_frame.pushStack(&[_]u256{ min_negative, max_positive });
    _ = try helpers.executeOpcode(0x13, test_vm.vm, test_frame.frame); // SGT
    const sgt_boundary = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), sgt_boundary); // max_positive > min_negative as signed

    // Test case 2: Cross-zero comparisons (critical for revm i256_cmp)
    const minus_one = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; // -1
    const plus_one = 0x0000000000000000000000000000000000000000000000000000000000000001; // +1

    // SLT: -1 < +1 (signed) -> true
    try test_frame.pushStack(&[_]u256{ plus_one, minus_one });
    _ = try helpers.executeOpcode(0x12, test_vm.vm, test_frame.frame); // SLT
    const cross_zero_lt = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), cross_zero_lt); // -1 < +1 as signed

    // SGT: +1 > -1 (signed) -> true
    try test_frame.pushStack(&[_]u256{ minus_one, plus_one });
    _ = try helpers.executeOpcode(0x13, test_vm.vm, test_frame.frame); // SGT
    const cross_zero_gt = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), cross_zero_gt); // +1 > -1 as signed

    // Test case 3: Negative number comparisons
    const minus_two = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE; // -2

    // SLT: -2 < -1 (signed) -> true
    try test_frame.pushStack(&[_]u256{ minus_one, minus_two });
    _ = try helpers.executeOpcode(0x12, test_vm.vm, test_frame.frame); // SLT
    const neg_comparison = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), neg_comparison); // -2 < -1 as signed
}

test "Unsigned vs Signed: Same bit patterns, different results" {
    // Demonstrates how identical bit patterns produce different comparison results
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

    // Values chosen to show unsigned vs signed differences
    const value_a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; // -1 signed, max unsigned
    const value_b = 0x0000000000000000000000000000000000000000000000000000000000000001; // +1 both

    // Unsigned comparison: value_a > value_b (since value_a is max u256)
    try test_frame.pushStack(&[_]u256{ value_b, value_a });
    _ = try helpers.executeOpcode(0x11, test_vm.vm, test_frame.frame); // GT (unsigned)
    const unsigned_gt = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), unsigned_gt); // max_u256 > 1 (unsigned)

    // Signed comparison: value_a < value_b (since value_a is -1, value_b is +1)
    try test_frame.pushStack(&[_]u256{ value_b, value_a });
    _ = try helpers.executeOpcode(0x13, test_vm.vm, test_frame.frame); // SGT (signed)
    const signed_gt = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), signed_gt); // -1 < +1 (signed), so -1 > +1 is false

    // Demonstrate the opposite comparison
    try test_frame.pushStack(&[_]u256{ value_a, value_b });
    _ = try helpers.executeOpcode(0x12, test_vm.vm, test_frame.frame); // SLT (signed)
    const signed_lt = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), signed_lt); // +1 > -1 (signed), so +1 < -1 is false

    // Additional test: Large positive vs small negative
    const large_positive = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; // Max positive
    const small_negative = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE; // -2

    // Unsigned: large_positive < small_negative (since small_negative has larger unsigned value)
    try test_frame.pushStack(&[_]u256{ small_negative, large_positive });
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame); // LT (unsigned)
    const mixed_unsigned = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), mixed_unsigned); // max_positive < -2 (unsigned)

    // Signed: large_positive > small_negative 
    try test_frame.pushStack(&[_]u256{ small_negative, large_positive });
    _ = try helpers.executeOpcode(0x13, test_vm.vm, test_frame.frame); // SGT (signed)
    const mixed_signed = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), mixed_signed); // max_positive > -2 (signed)
}

test "EQ: Equality edge cases and boundary conditions" {
    // Tests equality comparison with various edge cases
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

    // Test case 1: Self-equality
    const test_value = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF;
    try test_frame.pushStack(&[_]u256{ test_value, test_value });
    _ = try helpers.executeOpcode(0x14, test_vm.vm, test_frame.frame); // EQ
    const self_eq = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), self_eq);

    // Test case 2: Zero equality
    try test_frame.pushStack(&[_]u256{ 0, 0 });
    _ = try helpers.executeOpcode(0x14, test_vm.vm, test_frame.frame); // EQ
    const zero_eq = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), zero_eq);

    // Test case 3: Max value equality
    const max_value = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try test_frame.pushStack(&[_]u256{ max_value, max_value });
    _ = try helpers.executeOpcode(0x14, test_vm.vm, test_frame.frame); // EQ
    const max_eq = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), max_eq);

    // Test case 4: Near-equality (differ by 1)
    try test_frame.pushStack(&[_]u256{ test_value + 1, test_value });
    _ = try helpers.executeOpcode(0x14, test_vm.vm, test_frame.frame); // EQ
    const near_eq = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), near_eq);

    // Test case 5: Bit pattern equality with sign differences (should still be equal since it's bitwise)
    const positive_pattern = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    const same_pattern = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try test_frame.pushStack(&[_]u256{ same_pattern, positive_pattern });
    _ = try helpers.executeOpcode(0x14, test_vm.vm, test_frame.frame); // EQ
    const pattern_eq = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), pattern_eq);

    // Test case 6: Different representations of semantically same signed value should be equal
    const minus_one_a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    const minus_one_b = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try test_frame.pushStack(&[_]u256{ minus_one_b, minus_one_a });
    _ = try helpers.executeOpcode(0x14, test_vm.vm, test_frame.frame); // EQ
    const minus_one_eq = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), minus_one_eq);
}

test "ISZERO: Zero detection edge cases" {
    // Tests zero detection with various edge cases including near-zero values
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

    // Test case 1: Actual zero
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x15, test_vm.vm, test_frame.frame); // ISZERO
    const zero_result = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), zero_result);

    // Test case 2: Smallest non-zero value
    try test_frame.pushStack(&[_]u256{1});
    _ = try helpers.executeOpcode(0x15, test_vm.vm, test_frame.frame); // ISZERO
    const one_result = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), one_result);

    // Test case 3: Largest value (all bits set)
    const max_value = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try test_frame.pushStack(&[_]u256{max_value});
    _ = try helpers.executeOpcode(0x15, test_vm.vm, test_frame.frame); // ISZERO
    const max_result = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), max_result);

    // Test case 4: Only sign bit set (would be negative in signed interpretation)
    const sign_bit = 0x8000000000000000000000000000000000000000000000000000000000000000;
    try test_frame.pushStack(&[_]u256{sign_bit});
    _ = try helpers.executeOpcode(0x15, test_vm.vm, test_frame.frame); // ISZERO
    const sign_result = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), sign_result); // Non-zero, even though negative

    // Test case 5: Powers of 2 (single bit set)
    const powers_of_two = [_]u8{ 0, 1, 8, 16, 32, 64, 128, 255 };
    for (powers_of_two) |power| {
        const value = @as(u256, 1) << @intCast(power);
        try test_frame.pushStack(&[_]u256{value});
        _ = try helpers.executeOpcode(0x15, test_vm.vm, test_frame.frame); // ISZERO
        const power_result = try test_frame.popStack();
        try testing.expectEqual(@as(u256, 0), power_result); // All should be non-zero
    }
}

test "Stack order verification: Comparison operand ordering" {
    // Verifies that comparison operations handle stack operand order correctly
    // Critical for understanding which value is compared to which
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

    // Test with clearly different values to verify order
    const value_a = 10; // Second on stack (pushed first)
    const value_b = 20; // Top of stack (pushed second)

    // Test case 1: LT - should compute value_a < value_b (10 < 20 = true)
    try test_frame.pushStack(&[_]u256{ value_b, value_a }); // Stack: [10, 20] (20 on top)
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame); // LT
    const lt_result = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), lt_result); // 10 < 20 = true

    // Test case 2: GT - should compute value_a > value_b (10 > 20 = false)
    try test_frame.pushStack(&[_]u256{ value_b, value_a });
    _ = try helpers.executeOpcode(0x11, test_vm.vm, test_frame.frame); // GT
    const gt_result = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), gt_result); // 10 > 20 = false

    // Test case 3: Reverse the values to double-check
    try test_frame.pushStack(&[_]u256{ value_a, value_b }); // Stack: [20, 10] (10 on top)
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame); // LT
    const reverse_lt = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), reverse_lt); // 20 < 10 = false

    try test_frame.pushStack(&[_]u256{ value_a, value_b });
    _ = try helpers.executeOpcode(0x11, test_vm.vm, test_frame.frame); // GT
    const reverse_gt = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), reverse_gt); // 20 > 10 = true

    // Test case 4: Signed comparisons with same ordering
    const signed_a = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; // -1
    const signed_b = 1; // +1

    // SLT: -1 < +1 = true
    try test_frame.pushStack(&[_]u256{ signed_b, signed_a }); // Stack: [-1, +1] (+1 on top)
    _ = try helpers.executeOpcode(0x12, test_vm.vm, test_frame.frame); // SLT
    const slt_order = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 1), slt_order); // -1 < +1 = true

    // SGT: -1 > +1 = false
    try test_frame.pushStack(&[_]u256{ signed_b, signed_a });
    _ = try helpers.executeOpcode(0x13, test_vm.vm, test_frame.frame); // SGT
    const sgt_order = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), sgt_order); // -1 > +1 = false
}

test "Comparison operations: Gas cost verification" {
    // Verifies that all comparison operations consume correct base gas
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

    // All comparison operations should consume VERYLOW gas (3 gas)
    const comparison_ops = [_]struct {
        opcode: u8,
        stack_args: []const u256,
        name: []const u8,
    }{
        .{ .opcode = 0x10, .stack_args = &[_]u256{ test_value_b, test_value_a }, .name = "LT" },
        .{ .opcode = 0x11, .stack_args = &[_]u256{ test_value_b, test_value_a }, .name = "GT" },
        .{ .opcode = 0x12, .stack_args = &[_]u256{ test_value_b, test_value_a }, .name = "SLT" },
        .{ .opcode = 0x13, .stack_args = &[_]u256{ test_value_b, test_value_a }, .name = "SGT" },
        .{ .opcode = 0x14, .stack_args = &[_]u256{ test_value_b, test_value_a }, .name = "EQ" },
        .{ .opcode = 0x15, .stack_args = &[_]u256{test_value_a}, .name = "ISZERO" },
    };

    for (comparison_ops) |op| {
        const gas_before = 10000;
        test_frame.frame.gas_remaining = gas_before;

        try test_frame.pushStack(op.stack_args);
        _ = try helpers.executeOpcode(op.opcode, test_vm.vm, test_frame.frame);
        
        const gas_after = test_frame.frame.gas_remaining;
        const gas_used = gas_before - gas_after;
        
        // All comparison operations should use exactly 3 gas (VERYLOW)
        try testing.expectEqual(@as(u64, 3), gas_used);
        
        // Consume result to clean stack
        _ = try test_frame.popStack();
    }
}

test "Comparison comprehensive: Two's complement matrix" {
    // Comprehensive test matrix covering critical two's complement boundary interactions
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

    // Critical boundary values from revm patterns
    const boundary_values = [_]struct {
        value: u256,
        description: []const u8,
        signed_value: i256,
    }{
        .{ .value = 0x0000000000000000000000000000000000000000000000000000000000000000, .description = "Zero", .signed_value = 0 },
        .{ .value = 0x0000000000000000000000000000000000000000000000000000000000000001, .description = "+1", .signed_value = 1 },
        .{ .value = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .description = "Max positive", .signed_value = std.math.maxInt(i256) },
        .{ .value = 0x8000000000000000000000000000000000000000000000000000000000000000, .description = "Min negative", .signed_value = std.math.minInt(i256) },
        .{ .value = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE, .description = "-2", .signed_value = -2 },
        .{ .value = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .description = "-1", .signed_value = -1 },
    };

    // Test all pairs for critical relationships
    for (boundary_values, 0..) |val_a, i| {
        for (boundary_values, 0..) |val_b, j| {
            if (i == j) continue; // Skip self-comparison

            // Test signed comparison
            try test_frame.pushStack(&[_]u256{ val_b.value, val_a.value });
            _ = try helpers.executeOpcode(0x12, test_vm.vm, test_frame.frame); // SLT
            const slt_result = try test_frame.popStack();
            
            const expected_slt: u256 = if (val_a.signed_value < val_b.signed_value) 1 else 0;
            try testing.expectEqual(expected_slt, slt_result);

            // Test unsigned comparison
            try test_frame.pushStack(&[_]u256{ val_b.value, val_a.value });
            _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame); // LT
            const lt_result = try test_frame.popStack();
            
            const expected_lt: u256 = if (val_a.value < val_b.value) 1 else 0;
            try testing.expectEqual(expected_lt, lt_result);

            // Verify that signed and unsigned can give different results
            if (slt_result != lt_result) {
                // This is expected for cases like min_negative vs max_positive
                // Document this critical difference
                const sign_a = val_a.value >> 255;
                const sign_b = val_b.value >> 255;
                
                // Different results should only occur when signs differ
                try testing.expect(sign_a != sign_b);
            }
        }
    }
}