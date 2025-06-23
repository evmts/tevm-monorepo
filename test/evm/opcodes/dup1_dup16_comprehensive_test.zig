const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// 0x80-0x8F: DUP1 through DUP16
// ============================

test "DUP1 (0x80): Duplicate 1st stack item" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x33, // PUSH1 0x33
        0x80, // DUP1
    };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Execute PUSH1 0x42
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 2;

    // Execute PUSH1 0x33
    _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 4;

    // Stack should be [0x42, 0x33] (top is 0x33)
    try testing.expectEqual(@as(usize, 2), test_frame.frame.stack.size);

    // Execute DUP1
    const result = try helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);

    // Stack should now be [0x42, 0x33, 0x33]
    try testing.expectEqual(@as(usize, 3), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 0x33); // Top
    try helpers.expectStackValue(test_frame.frame, 1, 0x33); // Second
    try helpers.expectStackValue(test_frame.frame, 2, 0x42); // Third
}

test "DUP2 (0x81): Duplicate 2nd stack item" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x33, // PUSH1 0x33
        0x81, // DUP2
    };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push two values
    try test_frame.pushStack(&[_]u256{0x42});
    try test_frame.pushStack(&[_]u256{0x33});

    // Execute DUP2
    test_frame.frame.pc = 4;
    const result = try helpers.executeOpcode(0x81, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);

    // Stack should now be [0x42, 0x33, 0x42]
    try testing.expectEqual(@as(usize, 3), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 0x42); // Top (duplicated)
    try helpers.expectStackValue(test_frame.frame, 1, 0x33); // Second
    try helpers.expectStackValue(test_frame.frame, 2, 0x42); // Third (original)
}

test "DUP3-DUP5: Various duplications" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{ 0x82, 0x83, 0x84 }; // DUP3, DUP4, DUP5

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push 5 distinct values
    try test_frame.pushStack(&[_]u256{0x11}); // Bottom
    try test_frame.pushStack(&[_]u256{0x22});
    try test_frame.pushStack(&[_]u256{0x33});
    try test_frame.pushStack(&[_]u256{0x44});
    try test_frame.pushStack(&[_]u256{0x55}); // Top

    // Execute DUP3 (should duplicate 0x33)
    test_frame.frame.pc = 0;
    std.debug.print("Before DUP3:\n", .{});
    helpers.printStack(test_frame.frame);
    var result = try helpers.executeOpcode(0x82, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    try testing.expectEqual(@as(usize, 6), test_frame.frame.stack.size);
    std.debug.print("After DUP3:\n", .{});
    helpers.printStack(test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x33); // Duplicated value on top

    // Execute DUP4 (should duplicate 0x33 again, as it's now 4th from top)
    test_frame.frame.pc = 1;
    result = try helpers.executeOpcode(0x83, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    try testing.expectEqual(@as(usize, 7), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 0x33); // Duplicated value on top

    // Execute DUP5 (should duplicate 0x22)
    test_frame.frame.pc = 2;
    std.debug.print("Before DUP5:\n", .{});
    helpers.printStack(test_frame.frame);
    result = try helpers.executeOpcode(0x84, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    try testing.expectEqual(@as(usize, 8), test_frame.frame.stack.size);
    std.debug.print("After DUP5:\n", .{});
    helpers.printStack(test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x33); // DUP5 duplicates the 5th element which is 0x33
}

test "DUP6-DUP10: Mid-range duplications" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{ 0x85, 0x86, 0x87, 0x88, 0x89 }; // DUP6-DUP10

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push 10 distinct values
    for (1..11) |i| {
        try test_frame.pushStack(&[_]u256{i * 0x10});
    }

    // Execute DUP6 (should duplicate 0x50)
    test_frame.frame.pc = 0;
    helpers.printStack(test_frame.frame);
    const result = try helpers.executeOpcode(0x85, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    std.debug.print("After DUP6:\n", .{});
    helpers.printStack(test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x50);

    // Execute DUP7 (should duplicate 0x50 again, as it's now 7th)
    test_frame.frame.pc = 1;
    _ = try helpers.executeOpcode(0x86, test_vm.vm, test_frame.frame);
    std.debug.print("After DUP7:\n", .{});
    helpers.printStack(test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x50);

    // Execute DUP8 (should duplicate 0x40)
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x87, test_vm.vm, test_frame.frame);
    std.debug.print("After DUP8:\n", .{});
    helpers.printStack(test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x50); // DUP8 duplicates position 8 which is 0x50

    // Execute DUP9 (should duplicate 0x30)
    test_frame.frame.pc = 3;
    _ = try helpers.executeOpcode(0x88, test_vm.vm, test_frame.frame);
    std.debug.print("After DUP9:\n", .{});
    helpers.printStack(test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x50); // DUP9 duplicates position 9 which is 0x50

    // Execute DUP10 (should duplicate 0x20)
    test_frame.frame.pc = 4;
    _ = try helpers.executeOpcode(0x89, test_vm.vm, test_frame.frame);
    std.debug.print("After DUP10:\n", .{});
    helpers.printStack(test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x50); // DUP10 duplicates position 10 which is 0x50
}

test "DUP11-DUP16: High-range duplications" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{ 0x8A, 0x8B, 0x8C, 0x8D, 0x8E, 0x8F }; // DUP11-DUP16

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push 16 distinct values
    for (1..17) |i| {
        try test_frame.pushStack(&[_]u256{i * 0x100});
    }

    // Execute DUP11 (should duplicate 0x600)
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x8A, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x600);

    // Execute DUP12 (position 12 contains 0x600)
    test_frame.frame.pc = 1;
    _ = try helpers.executeOpcode(0x8B, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x600);

    // Execute DUP13 (position 13 contains 0x600)
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x8C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x600);

    // Execute DUP14 - position 14 is 0x600
    test_frame.frame.pc = 3;
    _ = try helpers.executeOpcode(0x8D, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x600);

    // Execute DUP15 - position 15 from top
    test_frame.frame.pc = 4;
    _ = try helpers.executeOpcode(0x8E, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x600);

    // Execute DUP16 - position 16 from top
    test_frame.frame.pc = 5;
    _ = try helpers.executeOpcode(0x8F, test_vm.vm, test_frame.frame);
    // Stack now has 21 items. Position 16 from top should be one of the original values
    try helpers.expectStackValue(test_frame.frame, 0, 0x600);
}

test "DUP16 (0x8F): Duplicate 16th stack item (maximum)" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{0x8F}; // DUP16

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push exactly 16 values
    for (0..16) |i| {
        try test_frame.pushStack(&[_]u256{0x1000 + i});
    }

    // The 16th item from top should be 0x1000 (first pushed)
    const result = try helpers.executeOpcode(0x8F, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);

    try testing.expectEqual(@as(usize, 17), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 0x1000); // Duplicated first item
    try helpers.expectStackValue(test_frame.frame, 16, 0x1000); // Original position
}

// ============================
// Gas consumption tests
// ============================

test "DUP1-DUP16: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{
        0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
        0x88, 0x89, 0x8A, 0x8B, 0x8C, 0x8D, 0x8E, 0x8F,
    };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Push 16 values to satisfy all DUP operations
    for (0..16) |i| {
        try test_frame.pushStack(&[_]u256{@as(u256, @intCast(i))});
    }

    // Test each DUP operation
    for (0..16) |i| {
        test_frame.frame.pc = i;
        const gas_before = test_frame.frame.gas_remaining;

        const opcode = @as(u8, @intCast(0x80 + i));
        const result = try helpers.executeOpcode(opcode, test_vm.vm, test_frame.frame);

        // All DUP operations cost 3 gas (GasFastestStep)
        const gas_used = gas_before - test_frame.frame.gas_remaining;
        try testing.expectEqual(@as(u64, 3), gas_used);

        // All DUP operations consume 1 byte
        try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    }
}

// ============================
// Edge cases and error conditions
// ============================

test "DUP operations: Stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{ 0x80, 0x81, 0x85, 0x8F }; // DUP1, DUP2, DUP6, DUP16

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Empty stack - DUP1 should fail
    test_frame.frame.pc = 0;
    std.debug.print("\nDUP underflow test: Empty stack size = {}\n", .{test_frame.frame.stack.size});
    var result = helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame);
    std.debug.print("DUP1 on empty stack result: {any}\n", .{result});
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);

    // Push 1 value
    try test_frame.pushStack(&[_]u256{0x42});

    // DUP1 should succeed
    const result2 = try helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result2.bytes_consumed);

    // DUP2 should succeed with 2 items on stack
    test_frame.frame.pc = 1;
    const result3 = try helpers.executeOpcode(0x81, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result3.bytes_consumed);
    try testing.expectEqual(@as(usize, 3), test_frame.frame.stack.size);

    // Push more values
    for (0..4) |i| {
        try test_frame.pushStack(&[_]u256{@as(u256, @intCast(i))});
    }

    // DUP6 should succeed (6 items on stack)
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x85, test_vm.vm, test_frame.frame);

    // DUP16 should fail (only 7 items on stack)
    test_frame.frame.pc = 3;
    result = helpers.executeOpcode(0x8F, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
}

test "DUP operations: Stack overflow" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{0x80}; // DUP1

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Fill stack to capacity (1024 items)
    for (0..1024) |i| {
        try test_frame.pushStack(&[_]u256{@as(u256, @intCast(i & 0xFF))});
    }

    // DUP1 should fail with stack overflow
    const result = helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackOverflow, result);
}

test "DUP operations: Sequential duplications" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{
        0x60, 0x01, // PUSH1 0x01
        0x60, 0x02, // PUSH1 0x02
        0x60, 0x03, // PUSH1 0x03
        0x80, // DUP1 (dup 0x03)
        0x81, // DUP2 (dup 0x03 again)
        0x84, // DUP5 (dup 0x02)
    };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Execute PUSH operations
    for (0..3) |i| {
        test_frame.frame.pc = i * 2;
        _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame);
    }

    // Stack: [0x01, 0x02, 0x03]
    try testing.expectEqual(@as(usize, 3), test_frame.frame.stack.size);

    // Execute DUP1
    test_frame.frame.pc = 6;
    _ = try helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame);
    // Stack: [0x01, 0x02, 0x03, 0x03]
    try testing.expectEqual(@as(usize, 4), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 0x03);

    // Execute DUP2
    test_frame.frame.pc = 7;
    _ = try helpers.executeOpcode(0x81, test_vm.vm, test_frame.frame);
    // Stack: [0x01, 0x02, 0x03, 0x03, 0x03]
    try testing.expectEqual(@as(usize, 5), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 0x03);
    try helpers.expectStackValue(test_frame.frame, 1, 0x03);

    // Execute DUP5
    test_frame.frame.pc = 8;
    _ = try helpers.executeOpcode(0x84, test_vm.vm, test_frame.frame);
    // Stack: [0x01, 0x02, 0x03, 0x03, 0x03, 0x01]
    try testing.expectEqual(@as(usize, 6), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 0x01);
}

test "DUP operations: Pattern verification" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{ 0x80, 0x84, 0x88, 0x8C, 0x8F }; // DUP1, DUP5, DUP9, DUP13, DUP16

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push a pattern of values
    for (0..16) |i| {
        try test_frame.pushStack(&[_]u256{@as(u256, (i + 1) * 0x11)}); // 0x11, 0x22, ..., 0x110
    }

    // DUP1 should duplicate the top (0x110)
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x110);

    // DUP5 should duplicate 5th from top (now 0xCC)
    test_frame.frame.pc = 1;
    std.debug.print("\nBefore DUP5, stack size={}, looking for 5th from top:\n", .{test_frame.frame.stack.size});
    for (0..@min(10, test_frame.frame.stack.size)) |i| {
        const idx = test_frame.frame.stack.size - 1 - i;
        std.debug.print("  Position {} from top (index {}): 0x{x}\n", .{ i + 1, idx, test_frame.frame.stack.data[idx] });
    }
    _ = try helpers.executeOpcode(0x84, test_vm.vm, test_frame.frame);
    std.debug.print("After DUP5, top of stack: 0x{x}\n", .{try test_frame.frame.stack.peek()});
    try helpers.expectStackValue(test_frame.frame, 0, 0xDD); // After DUP1, positions shift

    // DUP9 should duplicate 9th from top (now 0x99)
    test_frame.frame.pc = 2;
    std.debug.print("Before DUP9:\n", .{});
    helpers.printStack(test_frame.frame);
    _ = try helpers.executeOpcode(0x88, test_vm.vm, test_frame.frame);
    std.debug.print("After DUP9:\n", .{});
    helpers.printStack(test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xAA); // DUP9 gets 9th from top which is 0xAA

    // DUP13 should duplicate 13th from top (now 0x77 after 3 DUPs)
    test_frame.frame.pc = 3;
    _ = try helpers.executeOpcode(0x8C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x77); // DUP13 gets 13th from top which is 0x77

    // DUP16 should duplicate 16th from top (now 0x55 after 4 DUPs)
    test_frame.frame.pc = 4;
    _ = try helpers.executeOpcode(0x8F, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x55); // DUP16 gets 16th from top which is 0x55

    // Final stack size should be 21 (16 original + 5 duplicated)
    try testing.expectEqual(@as(usize, 21), test_frame.frame.stack.size);
}

test "DUP operations: Boundary test with exact stack size" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{ 0x80, 0x8F }; // DUP1, DUP16

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test DUP1 with exactly 1 item
    try test_frame.pushStack(&[_]u256{0xAA});
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 2), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 0xAA);
    try helpers.expectStackValue(test_frame.frame, 1, 0xAA);

    // Clear stack
    test_frame.frame.stack.clear();

    // Test DUP16 with exactly 16 items
    for (1..17) |i| {
        try test_frame.pushStack(&[_]u256{@as(u256, @intCast(i))});
    }
    test_frame.frame.pc = 1;
    _ = try helpers.executeOpcode(0x8F, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 17), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // First pushed item

    // Test DUP16 with 15 items (should fail)
    test_frame.frame.stack.clear();
    for (1..16) |i| {
        try test_frame.pushStack(&[_]u256{@as(u256, @intCast(i))});
    }
    const result = helpers.executeOpcode(0x8F, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
}
