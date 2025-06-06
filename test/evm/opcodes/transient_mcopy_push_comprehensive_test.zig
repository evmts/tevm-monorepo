const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// 0x5C-0x5E: TLOAD, TSTORE, MCOPY
// ============================

test "TLOAD (0x5C): Load from transient storage" {
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test 1: Load from empty slot (should return 0)
    try test_frame.pushStack(&[_]u256{42}); // slot
    _ = try helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 2: Load after TSTORE
    const slot: u256 = 100;
    const value: u256 = 0xdeadbeef;
    try test_frame.pushStack(&[_]u256{ value, slot }); // value, slot
    _ = try helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame); // TSTORE

    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, value);
    _ = try test_frame.popStack();

    // Test 3: Multiple slots
    const test_slots = [_]struct { slot: u256, value: u256 }{
        .{ .slot = 0, .value = 1 },
        .{ .slot = 1, .value = 1000 },
        .{ .slot = std.math.maxInt(u256), .value = 42 },
    };

    for (test_slots) |ts| {
        try test_frame.pushStack(&[_]u256{ ts.value, ts.slot });
        _ = try helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame); // TSTORE

        try test_frame.pushStack(&[_]u256{ts.slot});
        _ = try helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, ts.value);
        _ = try test_frame.popStack();
    }
}

test "TSTORE (0x5D): Store to transient storage" {
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test 1: Store to empty slot
    const slot1: u256 = 10;
    const value1: u256 = 12345;
    try test_frame.pushStack(&[_]u256{ value1, slot1 }); // value, slot
    _ = try helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);

    // Verify storage was updated via TLOAD
    try test_frame.pushStack(&[_]u256{slot1});
    _ = try helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, value1);
    _ = try test_frame.popStack();

    // Test 2: Update existing slot
    const value2: u256 = 67890;
    try test_frame.pushStack(&[_]u256{ value2, slot1 }); // value, slot
    _ = try helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);

    try test_frame.pushStack(&[_]u256{slot1});
    _ = try helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, value2);
    _ = try test_frame.popStack();

    // Test 3: Clear slot (set to 0)
    try test_frame.pushStack(&[_]u256{ 0, slot1 }); // value, slot
    _ = try helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);

    try test_frame.pushStack(&[_]u256{slot1});
    _ = try helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 4: TSTORE in static context should fail
    test_frame.frame.is_static = true;
    try test_frame.pushStack(&[_]u256{ 42, 1 }); // value, slot
    const result = helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.WriteProtection, result);
}

test "MCOPY (0x5E): Memory to memory copy" {
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

    // Test 1: Simple copy without overlap
    // Store data at source location
    const test_data: u256 = 0xdeadbeefcafebabe1234567890abcdef;
    try test_frame.pushStack(&[_]u256{ test_data, 0 }); // value, offset
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame); // MSTORE at 0

    // Copy 32 bytes from offset 0 to offset 64
    try test_frame.pushStack(&[_]u256{ 64, 0, 32 }); // dest, src, size
    _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);

    // Verify data was copied
    try test_frame.pushStack(&[_]u256{64}); // offset
    _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame); // MLOAD
    try helpers.expectStackValue(test_frame.frame, 0, test_data);
    _ = try test_frame.popStack();

    // Test 2: Copy with forward overlap (dest > src)
    // Copy from offset 0 to offset 16 (partial overlap)
    try test_frame.pushStack(&[_]u256{ 16, 0, 32 }); // dest, src, size
    _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);

    // Test 3: Copy with backward overlap (dest < src)
    // First store different data at offset 32
    const test_data2: u256 = 0xfeedfacefeedfacefeedfacefeedface;
    try test_frame.pushStack(&[_]u256{ test_data2, 32 }); // value, offset
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame); // MSTORE

    // Copy from offset 32 to offset 16 (backward overlap)
    try test_frame.pushStack(&[_]u256{ 16, 32, 32 }); // dest, src, size
    _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);

    // Test 4: Zero-size copy (should be no-op)
    const gas_before = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ 100, 200, 0 }); // dest, src, size=0
    _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);
    // Should only consume base gas (3)
    try testing.expectEqual(@as(u64, gas_before - 3), test_frame.frame.gas_remaining);

    // Test 5: Large copy
    try test_frame.pushStack(&[_]u256{ 1000, 0, 256 }); // dest, src, size
    _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);

    // Verify memory size expanded correctly
    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame); // MSIZE
    try helpers.expectStackValue(test_frame.frame, 0, 1280); // 1000 + 256 = 1256, rounded to 1280
}

// ============================
// 0x5F-0x62: PUSH0, PUSH1, PUSH2, PUSH3
// ============================

test "PUSH0 (0x5F): Push zero onto stack" {
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();

    // Test 1: Basic PUSH0
    _ = try helpers.executeOpcode(0x5F, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 2: Multiple PUSH0 operations
    for (0..5) |_| {
        _ = try helpers.executeOpcode(0x5F, test_vm.vm, test_frame.frame);
    }
    try testing.expectEqual(@as(usize, 5), test_frame.frame.stack.size);

    // All values should be 0
    for (0..5) |_| {
        const value = try test_frame.popStack();
        try testing.expectEqual(@as(u256, 0), value);
    }

    // Test 3: Stack overflow protection
    // Fill stack to near capacity
    for (0..1023) |_| {
        _ = try helpers.executeOpcode(0x5F, test_vm.vm, test_frame.frame);
    }

    // One more should succeed (stack capacity is 1024)
    _ = try helpers.executeOpcode(0x5F, test_vm.vm, test_frame.frame);

    // Next one should fail
    const result = helpers.executeOpcode(0x5F, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackOverflow, result);
}

test "PUSH1 (0x60): Push 1 byte onto stack" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{
        0x60, 0x42, // PUSH1 0x42
        0x60, 0xFF, // PUSH1 0xFF
        0x60, 0x00, // PUSH1 0x00
        0x60, 0x7F, // PUSH1 0x7F
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

    // Test pushing different byte values
    const expected_values = [_]u256{ 0x42, 0xFF, 0x00, 0x7F };

    for (expected_values) |expected| {
        const pc = test_frame.frame.pc;
        const result = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame);

        // Check that 2 bytes were consumed (opcode + data)
        try testing.expectEqual(@as(usize, 2), result.bytes_consumed);
        test_frame.frame.pc = pc + 2;

        try helpers.expectStackValue(test_frame.frame, 0, expected);
        _ = try test_frame.popStack();
    }
}

test "PUSH2 (0x61): Push 2 bytes onto stack" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{
        0x61, 0x12, 0x34, // PUSH2 0x1234
        0x61, 0xFF, 0xFF, // PUSH2 0xFFFF
        0x61, 0x00, 0x00, // PUSH2 0x0000
        0x61, 0xAB, 0xCD, // PUSH2 0xABCD
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

    const expected_values = [_]u256{ 0x1234, 0xFFFF, 0x0000, 0xABCD };

    for (expected_values) |expected| {
        const pc = test_frame.frame.pc;
        const result = try helpers.executeOpcode(0x61, test_vm.vm, test_frame.frame);

        // Check that 3 bytes were consumed (opcode + 2 data bytes)
        try testing.expectEqual(@as(usize, 3), result.bytes_consumed);
        test_frame.frame.pc = pc + 3;

        try helpers.expectStackValue(test_frame.frame, 0, expected);
        _ = try test_frame.popStack();
    }
}

test "PUSH3 (0x62): Push 3 bytes onto stack" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{
        0x62, 0x12, 0x34, 0x56, // PUSH3 0x123456
        0x62, 0xFF, 0xFF, 0xFF, // PUSH3 0xFFFFFF
        0x62, 0x00, 0x00, 0x00, // PUSH3 0x000000
        0x62, 0xAB, 0xCD, 0xEF, // PUSH3 0xABCDEF
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

    const expected_values = [_]u256{ 0x123456, 0xFFFFFF, 0x000000, 0xABCDEF };

    for (expected_values) |expected| {
        const pc = test_frame.frame.pc;
        const result = try helpers.executeOpcode(0x62, test_vm.vm, test_frame.frame);

        // Check that 4 bytes were consumed (opcode + 3 data bytes)
        try testing.expectEqual(@as(usize, 4), result.bytes_consumed);
        test_frame.frame.pc = pc + 4;

        try helpers.expectStackValue(test_frame.frame, 0, expected);
        _ = try test_frame.popStack();
    }
}

// ============================
// Gas consumption tests
// ============================

test "Transient storage and memory opcodes: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x60, 0x42 }, // PUSH1 data for testing
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test TLOAD gas
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42}); // slot
    var gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    var gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 100), gas_used); // TLOAD costs 100
    _ = try test_frame.popStack();

    // Test TSTORE gas
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 0xdead, 42 }); // value, slot
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);
    gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 100), gas_used); // TSTORE costs 100

    // Test MCOPY gas (base cost only, no copy)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 100, 0, 0 }); // dest, src, size=0
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);
    gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 3), gas_used); // MCOPY base cost is 3

    // Test MCOPY with copy gas
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 100, 0, 32 }); // dest, src, size=32 (1 word)
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);
    gas_used = gas_before - test_frame.frame.gas_remaining;
    // Base cost (3) + copy cost (3 * 1 word) + memory expansion
    try testing.expect(gas_used >= 6);

    // Test PUSH0 gas
    test_frame.frame.stack.clear();
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x5F, test_vm.vm, test_frame.frame);
    gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2), gas_used); // PUSH0 costs 2

    // Test PUSH1 gas
    test_frame.frame.stack.clear();
    test_frame.frame.pc = 0;
    gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame);
    gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 3), gas_used); // PUSH1 costs 3
}

// ============================
// Edge cases and special scenarios
// ============================

test "MCOPY: Edge cases" {
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100); // Limited gas
    defer test_frame.deinit();

    // Test: MCOPY with huge size should run out of gas
    try test_frame.pushStack(&[_]u256{ 0, 0, std.math.maxInt(u256) }); // dest, src, huge size
    const result = helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, result);
}

test "Transient storage: Isolation between addresses" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract1 = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract1.deinit(allocator, null);

    var contract2 = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.BOB,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract2.deinit(allocator, null);

    var test_frame1 = try helpers.TestFrame.init(allocator, &contract1, 10000);
    defer test_frame1.deinit();

    var test_frame2 = try helpers.TestFrame.init(allocator, &contract2, 10000);
    defer test_frame2.deinit();

    // Store value in contract1's transient storage
    const slot: u256 = 42;
    const value: u256 = 0xdeadbeef;
    try test_frame1.pushStack(&[_]u256{ value, slot });
    _ = try helpers.executeOpcode(0x5D, test_vm.vm, test_frame1.frame); // TSTORE

    // Same slot in contract2 should still be 0
    try test_frame2.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x5C, test_vm.vm, test_frame2.frame); // TLOAD
    try helpers.expectStackValue(test_frame2.frame, 0, 0); // Should be 0, not value
}

test "PUSH operations: Boundary conditions" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Test PUSH with truncated data at end of code
    const code = [_]u8{
        0x60, 0x42, // Complete PUSH1
        0x61, 0x12, // Incomplete PUSH2 (missing 1 byte)
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

    // First PUSH1 should work normally
    const result1 = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 2), result1.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x42);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 2;

    // Second PUSH2 should pad with zeros
    const result2 = try helpers.executeOpcode(0x61, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 3), result2.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x1200); // 0x12 followed by 0x00
}
