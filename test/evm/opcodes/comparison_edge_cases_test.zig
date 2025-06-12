const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes to test
const evm = @import("evm");
const comparison = evm.opcodes.comparison;

test "Comparison: EQ edge case - operand order shouldn't matter" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test that EQ(a,b) == EQ(b,a)
    const val_a: u256 = 0x123456789;
    const val_b: u256 = 0xABCDEF;

    // First order: a, b
    try test_frame.pushStack(&[_]u256{ val_a, val_b });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x14, &test_vm.vm, test_frame.frame);
=======
    _ = try helpers.executeOpcode(0x14, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    const result1 = try test_frame.popStack();

    // Second order: b, a
    try test_frame.pushStack(&[_]u256{ val_b, val_a });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x14, &test_vm.vm, test_frame.frame);
=======
    _ = try helpers.executeOpcode(0x14, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    const result2 = try test_frame.popStack();

    // Both should give the same result
    try testing.expectEqual(result1, result2);
}

test "Comparison: Signed comparisons with boundary values" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test MIN_I256 < -1
    const min_i256 = @as(u256, 1) << 255; // 0x80000...0 (most negative)
    const neg_one = std.math.maxInt(u256); // 0xFFFF...F (-1 in two's complement)
    
    try test_frame.pushStack(&[_]u256{ min_i256, neg_one });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x12, &test_vm.vm, test_frame.frame); // SLT
=======
    _ = try helpers.executeOpcode(0x12, test_vm.vm, test_frame.frame); // SLT
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, 1); // MIN_I256 < -1 is true

    // Test -1 > MIN_I256
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ neg_one, min_i256 });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x13, &test_vm.vm, test_frame.frame); // SGT
=======
    _ = try helpers.executeOpcode(0x13, test_vm.vm, test_frame.frame); // SGT
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, 1); // -1 > MIN_I256 is true
}

test "Comparison: Gas edge case - ensure gas is consumed before operation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 2); // Only 2 gas
    defer test_frame.deinit();

    // Push values for LT operation
    try test_frame.pushStack(&[_]u256{ 5, 10 });

    // Should fail with OutOfGas since we need 3 gas for comparison
    try testing.expectError(
        helpers.ExecutionError.Error.OutOfGas,
<<<<<<< HEAD
        helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame)
=======
        helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame)
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    );
}

test "Bitwise: XOR properties verification" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test: a XOR a = 0 (already tested, but let's verify with edge values)
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ max_u256, max_u256 });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x18, &test_vm.vm, test_frame.frame);
=======
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, 0);

    // Test: a XOR 0 = a (identity)
    test_frame.frame.stack.clear();
    const test_val: u256 = 0x123456789ABCDEF;
    try test_frame.pushStack(&[_]u256{ test_val, 0 });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x18, &test_vm.vm, test_frame.frame);
=======
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, test_val);

    // Test: a XOR ~a = MAX_U256 (all ones)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ test_val, ~test_val });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x18, &test_vm.vm, test_frame.frame);
=======
    _ = try helpers.executeOpcode(0x18, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, max_u256);
}

test "Bitwise: AND/OR De Morgan's laws" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test: ~(a AND b) = (~a OR ~b)
    const a: u256 = 0xF0F0F0F0;
    const b: u256 = 0xFF00FF00;

    // Calculate ~(a AND b)
    try test_frame.pushStack(&[_]u256{ a, b });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame); // AND
    _ = try helpers.executeOpcode(0x19, &test_vm.vm, test_frame.frame); // NOT
=======
    _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame); // AND
    _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame); // NOT
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    const left_side = try test_frame.popStack();

    // Calculate (~a OR ~b)
    try test_frame.pushStack(&[_]u256{ a });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x19, &test_vm.vm, test_frame.frame); // NOT
    const not_a = try test_frame.popStack();

    try test_frame.pushStack(&[_]u256{ b });
    _ = try helpers.executeOpcode(0x19, &test_vm.vm, test_frame.frame); // NOT
    const not_b = try test_frame.popStack();

    try test_frame.pushStack(&[_]u256{ not_a, not_b });
    _ = try helpers.executeOpcode(0x17, &test_vm.vm, test_frame.frame); // OR
=======
    _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame); // NOT
    const not_a = try test_frame.popStack();

    try test_frame.pushStack(&[_]u256{ b });
    _ = try helpers.executeOpcode(0x19, test_vm.vm, test_frame.frame); // NOT
    const not_b = try test_frame.popStack();

    try test_frame.pushStack(&[_]u256{ not_a, not_b });
    _ = try helpers.executeOpcode(0x17, test_vm.vm, test_frame.frame); // OR
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    const right_side = try test_frame.popStack();

    // They should be equal
    try testing.expectEqual(left_side, right_side);
}

test "Comparison: Chained comparisons behavior" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test: (5 < 10) AND (10 < 15) = 1 AND 1 = 1
    try test_frame.pushStack(&[_]u256{ 5, 10 });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame); // LT
    
    try test_frame.pushStack(&[_]u256{ 10, 15 });
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame); // LT
    
    _ = try helpers.executeOpcode(0x16, &test_vm.vm, test_frame.frame); // AND
=======
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame); // LT
    
    try test_frame.pushStack(&[_]u256{ 10, 15 });
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame); // LT
    
    _ = try helpers.executeOpcode(0x16, test_vm.vm, test_frame.frame); // AND
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, 1); // Both comparisons true
}

test "ISZERO: Various representations of zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test multiple ways to represent zero
    const zero_values = [_]u256{
        0,
        0x0,
        @as(u256, 0),
        0b0,
        0o0,
    };

    for (zero_values) |zero_val| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{zero_val});
<<<<<<< HEAD
        _ = try helpers.executeOpcode(0x15, &test_vm.vm, test_frame.frame);
=======
        _ = try helpers.executeOpcode(0x15, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
        try helpers.expectStackValue(test_frame.frame, 0, 1);
        _ = try test_frame.popStack();
    }
}

test "Bitwise: Shift operations with large values" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test SHL with max value
    const max_u256 = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ max_u256, 1 });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x1B, &test_vm.vm, test_frame.frame); // SHL
=======
    _ = try helpers.executeOpcode(0x1B, test_vm.vm, test_frame.frame); // SHL
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    const expected_shl = max_u256 << 1; // Should lose the MSB
    try helpers.expectStackValue(test_frame.frame, 0, expected_shl);

    // Test SHR with 1
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 1, 1 });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x1C, &test_vm.vm, test_frame.frame); // SHR
=======
    _ = try helpers.executeOpcode(0x1C, test_vm.vm, test_frame.frame); // SHR
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, 0); // 1 >> 1 = 0

    // Test SAR with all ones (negative)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ max_u256, 1 });
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x1D, &test_vm.vm, test_frame.frame); // SAR
=======
    _ = try helpers.executeOpcode(0x1D, test_vm.vm, test_frame.frame); // SAR
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, max_u256); // Sign extension keeps it all ones
}

test "Comparison: Stack behavior with multiple operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
<<<<<<< HEAD
    defer test_vm.deinit();
=======
    defer test_vm.deinit(allocator);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
<<<<<<< HEAD
    defer contract.deinit(null);
=======
    defer contract.deinit(allocator, null);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Start with multiple values on stack
    try test_frame.pushStack(&[_]u256{ 100, 200, 5, 10 }); // Bottom to top: 100, 200, 5, 10

    // LT: pops 10, 5, pushes (5 < 10) = 1
<<<<<<< HEAD
    _ = try helpers.executeOpcode(0x10, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 3), test_frame.stackSize()); // 100, 200, 1

    // GT: pops 1, 200, pushes (200 > 1) = 1
    _ = try helpers.executeOpcode(0x11, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 2), test_frame.stackSize()); // 100, 1

    // EQ: pops 1, 100, pushes (100 == 1) = 0
    _ = try helpers.executeOpcode(0x14, &test_vm.vm, test_frame.frame);
=======
    _ = try helpers.executeOpcode(0x10, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 3), test_frame.stackSize()); // 100, 200, 1

    // GT: pops 1, 200, pushes (200 > 1) = 1
    _ = try helpers.executeOpcode(0x11, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 2), test_frame.stackSize()); // 100, 1

    // EQ: pops 1, 100, pushes (100 == 1) = 0
    _ = try helpers.executeOpcode(0x14, test_vm.vm, test_frame.frame);
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    try testing.expectEqual(@as(usize, 1), test_frame.stackSize());
}