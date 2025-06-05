const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// 0x59-0x5B: MSIZE, GAS, JUMPDEST
// ============================

test "MSIZE (0x59): Get current memory size" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test 1: Initial memory size (should be 0)
    _ = try helpers.executeOpcode(0x59, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 2: After storing 32 bytes
    try test_frame.pushStack(&[_]u256{ 0xdeadbeef, 0 }); // value, offset
    _ = try helpers.executeOpcode(0x52, &test_vm.vm, test_frame.frame); // MSTORE

    _ = try helpers.executeOpcode(0x59, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 32); // One word
    _ = try test_frame.popStack();

    // Test 3: After storing at offset 32
    try test_frame.pushStack(&[_]u256{ 0xcafebabe, 32 }); // value, offset
    _ = try helpers.executeOpcode(0x52, &test_vm.vm, test_frame.frame); // MSTORE

    _ = try helpers.executeOpcode(0x59, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 64); // Two words
    _ = try test_frame.popStack();

    // Test 4: After storing at offset 100 (should expand to word boundary)
    try test_frame.pushStack(&[_]u256{ 0x12345678, 100 }); // value, offset
    _ = try helpers.executeOpcode(0x52, &test_vm.vm, test_frame.frame); // MSTORE

    _ = try helpers.executeOpcode(0x59, &test_vm.vm, test_frame.frame);
    // 100 + 32 = 132, rounded up to word boundary = 160 (5 words)
    try helpers.expectStackValue(test_frame.frame, 0, 160);
    _ = try test_frame.popStack();

    // Test 5: After MSTORE8 (single byte)
    try test_frame.pushStack(&[_]u256{ 0xFF, 200 }); // value, offset
    _ = try helpers.executeOpcode(0x53, &test_vm.vm, test_frame.frame); // MSTORE8

    _ = try helpers.executeOpcode(0x59, &test_vm.vm, test_frame.frame);
    // 200 + 1 = 201, rounded up to word boundary = 224 (7 words)
    try helpers.expectStackValue(test_frame.frame, 0, 224);
}

test "GAS (0x5A): Get remaining gas" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    // Test with different initial gas amounts
    const test_cases = [_]u64{
        100,
        1000,
        10000,
        100000,
        1000000,
        std.math.maxInt(u64),
    };

    for (test_cases) |initial_gas| {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, initial_gas);
        defer test_frame.deinit();

        // Execute GAS opcode
        _ = try helpers.executeOpcode(0x5A, &test_vm.vm, test_frame.frame);

        // The value pushed should be initial_gas minus the gas cost of GAS itself (2)
        const expected_gas = initial_gas - 2;
        try helpers.expectStackValue(test_frame.frame, 0, expected_gas);
        _ = try test_frame.popStack();

        // Test 2: After consuming more gas
        const gas_before = test_frame.frame.gas_remaining;

        // Execute some operations to consume gas
        try test_frame.pushStack(&[_]u256{ 5, 10 }); // Push two values
        _ = try helpers.executeOpcode(0x01, &test_vm.vm, test_frame.frame); // ADD (costs 3)
        _ = try test_frame.popStack();

        // Execute GAS again
        _ = try helpers.executeOpcode(0x5A, &test_vm.vm, test_frame.frame);

        // Should have consumed gas for ADD (3) and GAS (2)
        const expected_remaining = gas_before - 3 - 2;
        try helpers.expectStackValue(test_frame.frame, 0, expected_remaining);
    }
}

test "JUMPDEST (0x5B): Mark valid jump destination" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    // Create bytecode with multiple JUMPDESTs
    const code = [_]u8{
        0x5B, // JUMPDEST at position 0
        0x60, 0x05, // PUSH1 5
        0x5B, // JUMPDEST at position 3
        0x60, 0x0A, // PUSH1 10
        0x5B, // JUMPDEST at position 6
        0x00, // STOP
    };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test 1: Execute JUMPDEST - should be a no-op
    const stack_size_before = test_frame.frame.stack.size;
    const gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x5B, &test_vm.vm, test_frame.frame);

    // Stack should be unchanged
    try testing.expectEqual(stack_size_before, test_frame.frame.stack.size);

    // Should consume only JUMPDEST gas (1)
    try testing.expectEqual(@as(u64, gas_before - 1), test_frame.frame.gas_remaining);

    // Test 2: Verify jump destinations are valid
    try testing.expect(contract.valid_jumpdest(0)); // Position 0
    try testing.expect(contract.valid_jumpdest(3)); // Position 3
    try testing.expect(contract.valid_jumpdest(6)); // Position 6

    // Test 3: Verify non-JUMPDEST positions are invalid
    try testing.expect(!contract.valid_jumpdest(1)); // PUSH1 opcode
    try testing.expect(!contract.valid_jumpdest(2)); // PUSH1 data
    try testing.expect(!contract.valid_jumpdest(4)); // PUSH1 opcode
    try testing.expect(!contract.valid_jumpdest(5)); // PUSH1 data
    try testing.expect(!contract.valid_jumpdest(7)); // STOP

    // Test 4: Verify out of bounds positions are invalid
    try testing.expect(!contract.valid_jumpdest(100));
    try testing.expect(!contract.valid_jumpdest(std.math.maxInt(u256)));
}

// ============================
// Gas consumption tests
// ============================

test "MSIZE, GAS, JUMPDEST: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x5B}, // Include JUMPDEST
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    const opcodes = [_]struct {
        opcode: u8,
        name: []const u8,
        expected_gas: u64,
    }{
        .{ .opcode = 0x59, .name = "MSIZE", .expected_gas = 2 },
        .{ .opcode = 0x5A, .name = "GAS", .expected_gas = 2 },
        .{ .opcode = 0x5B, .name = "JUMPDEST", .expected_gas = 1 },
    };

    for (opcodes) |op| {
        test_frame.frame.stack.clear();
        const gas_before = 1000;
        test_frame.frame.gas_remaining = gas_before;

        _ = try helpers.executeOpcode(op.opcode, &test_vm.vm, test_frame.frame);

        const gas_used = gas_before - test_frame.frame.gas_remaining;
        try testing.expectEqual(op.expected_gas, gas_used);
    }
}

// ============================
// Edge cases and special scenarios
// ============================

test "MSIZE: Memory expansion scenarios" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test expansion via MLOAD
    try test_frame.pushStack(&[_]u256{64}); // offset
    _ = try helpers.executeOpcode(0x51, &test_vm.vm, test_frame.frame); // MLOAD
    _ = try test_frame.popStack();

    _ = try helpers.executeOpcode(0x59, &test_vm.vm, test_frame.frame); // MSIZE
    try helpers.expectStackValue(test_frame.frame, 0, 96); // 64 + 32 = 96
    _ = try test_frame.popStack();

    // Test expansion via CALLDATACOPY
    test_frame.frame.input = &[_]u8{ 0x01, 0x02, 0x03, 0x04 };
    try test_frame.pushStack(&[_]u256{ 4, 0, 200 }); // size, data_offset, mem_offset
    _ = try helpers.executeOpcode(0x37, &test_vm.vm, test_frame.frame); // CALLDATACOPY

    _ = try helpers.executeOpcode(0x59, &test_vm.vm, test_frame.frame); // MSIZE
    try helpers.expectStackValue(test_frame.frame, 0, 224); // 200 + 4 = 204, rounded to 224
}

test "GAS: Low gas scenarios" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    // Test with exactly enough gas for GAS opcode
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 2);
    defer test_frame.deinit();

    _ = try helpers.executeOpcode(0x5A, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // All gas consumed
    _ = try test_frame.popStack();

    // Test with not enough gas
    test_frame.frame.gas_remaining = 1;
    const result = helpers.executeOpcode(0x5A, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfGas, result);
}

test "JUMPDEST: Code analysis integration" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    // Complex bytecode with JUMPDEST in data section
    const code = [_]u8{
        0x60, 0x5B, // PUSH1 0x5B (pushes JUMPDEST opcode as data)
        0x60, 0x08, // PUSH1 8
        0x56, // JUMP
        0x5B, // This is actually a valid standalone JUMPDEST
        0x00, // STOP
        0x00, // Padding
        0x5B, // Real JUMPDEST at position 8
        0x60, 0x42, // PUSH1 0x42
        0x00, // STOP
    };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);

    // Force code analysis
    contract.analyze_jumpdests();

    // The JUMPDEST at position 5 SHOULD be valid (it's standalone, not PUSH data)
    try testing.expect(contract.valid_jumpdest(5));

    // The JUMPDEST at position 8 should be valid
    try testing.expect(contract.valid_jumpdest(8));

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Jump to valid JUMPDEST should succeed
    try test_frame.pushStack(&[_]u256{8});
    _ = try helpers.executeOpcode(0x56, &test_vm.vm, test_frame.frame); // JUMP
    try testing.expectEqual(@as(usize, 8), test_frame.frame.pc);

    // Jump to position 5 should also succeed (it's a valid JUMPDEST)
    test_frame.frame.pc = 0;
    try test_frame.pushStack(&[_]u256{5});
    _ = try helpers.executeOpcode(0x56, &test_vm.vm, test_frame.frame); // JUMP
    try testing.expectEqual(@as(usize, 5), test_frame.frame.pc);
}

test "Stack operations: MSIZE and GAS push exactly one value" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    const opcodes = [_]u8{ 0x59, 0x5A }; // MSIZE, GAS

    for (opcodes) |opcode| {
        test_frame.frame.stack.clear();
        const initial_stack_len = test_frame.frame.stack.size;

        _ = try helpers.executeOpcode(opcode, &test_vm.vm, test_frame.frame);

        // Check that exactly one value was pushed
        try testing.expectEqual(initial_stack_len + 1, test_frame.frame.stack.size);
    }
}
