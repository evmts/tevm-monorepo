const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// 0x4F-0x58 Stack, Memory, Storage, and Control Flow
// ============================

test "POP (0x50): Remove top stack item" {
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Pop single value
    try test_frame.pushStack(&[_]u256{42});
    try testing.expectEqual(@as(usize, 1), test_frame.frame.stack.size);

    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.stack.size);

    // Test 2: Pop multiple values in sequence
    try test_frame.pushStack(&[_]u256{ 10, 20, 30 });
    try testing.expectEqual(@as(usize, 3), test_frame.frame.stack.size);

    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 2), test_frame.frame.stack.size);

    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), test_frame.frame.stack.size);

    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.stack.size);

    // Test 3: Pop from empty stack should fail
    const result = helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
}

test "MLOAD (0x51): Load word from memory" {
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

    // Test 1: Load from uninitialized memory (should return 0)
    try test_frame.pushStack(&[_]u256{0}); // offset
    _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 2: Store and load a value
    const test_value: u256 = 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef;
    try test_frame.frame.memory.set_u256(32, test_value);

    try test_frame.pushStack(&[_]u256{32}); // offset
    _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, test_value);
    _ = try test_frame.popStack();

    // Test 3: Load from offset with partial overlap
    try test_frame.pushStack(&[_]u256{16}); // offset
    _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    const result = try test_frame.popStack();
    // Should load 16 bytes of zeros followed by first 16 bytes of test_value
    const expected = test_value >> 128;
    try testing.expectEqual(expected, result);
}

test "MSTORE (0x52): Store 32 bytes to memory" {
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

    // Test 1: Store at offset 0
    const value1: u256 = 0xdeadbeefcafebabe;
    try test_frame.pushStack(&[_]u256{ value1, 0 }); // value, offset
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);

    // Verify the value was stored
    const stored1 = try test_frame.frame.memory.get_u256(0);
    try testing.expectEqual(value1, stored1);

    // Test 2: Store at offset 32
    const value2: u256 = 0x1234567890abcdef;
    try test_frame.pushStack(&[_]u256{ value2, 32 }); // value, offset
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);

    const stored2 = try test_frame.frame.memory.get_u256(32);
    try testing.expectEqual(value2, stored2);

    // Test 3: Store with memory expansion
    const value3: u256 = 0xffffffffffffffff;
    try test_frame.pushStack(&[_]u256{ value3, 1024 }); // value, offset
    const gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);

    // Should have consumed gas for memory expansion
    try testing.expect(test_frame.frame.gas_remaining < gas_before);

    const stored3 = try test_frame.frame.memory.get_u256(1024);
    try testing.expectEqual(value3, stored3);
}

test "MSTORE8 (0x53): Store single byte to memory" {
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

    // Test 1: Store single byte
    try test_frame.pushStack(&[_]u256{ 0xAB, 0 }); // value, offset
    _ = try helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame);

    const byte1 = try test_frame.frame.memory.get_byte(0);
    try testing.expectEqual(@as(u8, 0xAB), byte1);

    // Test 2: Store only lowest byte of larger value
    try test_frame.pushStack(&[_]u256{ 0x123456789ABCDEF0, 1 }); // value, offset
    _ = try helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame);

    const byte2 = try test_frame.frame.memory.get_byte(1);
    try testing.expectEqual(@as(u8, 0xF0), byte2); // Only lowest byte

    // Test 3: Store at various offsets
    const test_bytes = [_]struct { value: u256, offset: u256, expected: u8 }{
        .{ .value = 0xFF, .offset = 10, .expected = 0xFF },
        .{ .value = 0x100, .offset = 11, .expected = 0x00 }, // Only lowest byte (0x00)
        .{ .value = 0x42, .offset = 12, .expected = 0x42 },
    };

    for (test_bytes) |tb| {
        try test_frame.pushStack(&[_]u256{ tb.value, tb.offset });
        _ = try helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame);

        const stored = try test_frame.frame.memory.get_byte(@intCast(tb.offset));
        try testing.expectEqual(tb.expected, stored);
    }
}

test "SLOAD (0x54): Load from storage" {
    const allocator = testing.allocator;

    std.debug.print("\n=== Starting SLOAD test ===\n", .{});

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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000);
    defer test_frame.deinit();

    // Test 1: Load from empty slot (should return 0)
    std.debug.print("Test 1: Loading from empty slot 42\n", .{});
    try test_frame.pushStack(&[_]u256{42}); // slot
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();
    std.debug.print("Test 1: PASSED\n", .{});

    // Test 2: Load from populated slot
    std.debug.print("Test 2: Loading from populated slot\n", .{});
    const slot: u256 = 100;
    const value: u256 = 0xdeadbeef;
    const storage_key = helpers.Vm.StorageKey{ .address = contract.address, .slot = slot };
    try test_vm.vm.storage.put(storage_key, value);

    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, value);
    _ = try test_frame.popStack();
    std.debug.print("Test 2: PASSED\n", .{});

    // Test 3: Load multiple different slots
    std.debug.print("Test 3: Loading multiple different slots\n", .{});
    const test_slots = [_]struct { slot: u256, value: u256 }{
        .{ .slot = 0, .value = 1 },
        .{ .slot = 1, .value = 1000 },
        .{ .slot = std.math.maxInt(u256), .value = 42 },
    };

    for (test_slots, 0..) |ts, i| {
        std.debug.print("  Test 3.{}: slot={}, value={}\n", .{ i, ts.slot, ts.value });
        const ts_storage_key = helpers.Vm.StorageKey{ .address = contract.address, .slot = ts.slot };
        try test_vm.vm.storage.put(ts_storage_key, ts.value);
        try test_frame.pushStack(&[_]u256{ts.slot});
        _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
        const stack_value = test_frame.frame.stack.peek() catch |err| {
            std.debug.print("  Test 3.{}: Failed to peek stack: {}\n", .{ i, err });
            return err;
        };
        std.debug.print("  Test 3.{}: Stack value after SLOAD: {}\n", .{ i, stack_value.* });
        try helpers.expectStackValue(test_frame.frame, 0, ts.value);
        _ = try test_frame.popStack();
        std.debug.print("  Test 3.{}: PASSED\n", .{i});
    }
    std.debug.print("Test 3: PASSED\n", .{});
    std.debug.print("\n=== SLOAD test completed successfully ===\n\n", .{});
}

test "SSTORE (0x55): Store to storage" {
    std.debug.print("\n=== Starting SSTORE test ===\n", .{});
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 30000);
    defer test_frame.deinit();

    // Test 1: Store to empty slot
    const slot1: u256 = 10;
    const value1: u256 = 12345;
    try test_frame.pushStack(&[_]u256{ value1, slot1 }); // value, slot
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);

    // Verify storage was updated
    const storage_key1 = helpers.Vm.StorageKey{ .address = contract.address, .slot = slot1 };
    const stored1 = test_vm.vm.storage.get(storage_key1) orelse 0;
    try testing.expectEqual(value1, stored1);

    // Test 2: Update existing slot
    const value2: u256 = 67890;
    try test_frame.pushStack(&[_]u256{ value2, slot1 }); // value, slot
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);

    const stored2 = test_vm.vm.storage.get(storage_key1) orelse 0;
    try testing.expectEqual(value2, stored2);

    // Test 3: Clear slot (set to 0)
    try test_frame.pushStack(&[_]u256{ 0, slot1 }); // value, slot
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);

    const stored3 = test_vm.vm.storage.get(storage_key1) orelse 0;
    try testing.expectEqual(@as(u256, 0), stored3);
}

test "JUMP (0x56): Unconditional jump" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create bytecode with JUMPDEST
    const code = [_]u8{
        0x60, 0x04, // PUSH1 4
        0x56, // JUMP
        0x00, // STOP (should be skipped)
        0x5B, // JUMPDEST at position 4
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
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Valid jump
    try test_frame.pushStack(&[_]u256{4}); // Jump to JUMPDEST at position 4
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 4), test_frame.frame.pc);

    // Test 2: Invalid jump (not a JUMPDEST)
    test_frame.frame.pc = 0;
    try test_frame.pushStack(&[_]u256{3}); // Position 3 is not a JUMPDEST
    const result = helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, result);

    // Test 3: Jump out of bounds
    test_frame.frame.pc = 0;
    try test_frame.pushStack(&[_]u256{100}); // Beyond code length
    const result2 = helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, result2);
}

test "JUMPI (0x57): Conditional jump" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create bytecode with JUMPDEST
    const code = [_]u8{
        0x60, 0x08, // PUSH1 8
        0x60, 0x01, // PUSH1 1
        0x57, // JUMPI
        0x60, 0xFF, // PUSH1 0xFF (should be skipped)
        0x00, // STOP
        0x5B, // JUMPDEST at position 8
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
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: Jump with non-zero condition
    try test_frame.pushStack(&[_]u256{ 1, 8 }); // condition, dest (dest on top)
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 8), test_frame.frame.pc);

    // Test 2: No jump with zero condition
    test_frame.frame.pc = 0;
    try test_frame.pushStack(&[_]u256{ 0, 8 }); // condition, dest (zero condition)
    const pc_before = test_frame.frame.pc;
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(pc_before, test_frame.frame.pc); // PC unchanged

    // Test 3: Jump with large non-zero condition
    test_frame.frame.pc = 0;
    try test_frame.pushStack(&[_]u256{ std.math.maxInt(u256), 8 }); // large condition, dest
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 8), test_frame.frame.pc);

    // Test 4: Invalid jump destination with non-zero condition
    test_frame.frame.pc = 0;
    try test_frame.pushStack(&[_]u256{ 1, 3 }); // non-zero condition, invalid dest
    const result = helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, result);
}

test "PC (0x58): Get program counter" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x58, 0x58, 0x58 }, // PC, PC, PC
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test 1: PC at position 0
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test 2: PC at position 1
    test_frame.frame.pc = 1;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1);
    _ = try test_frame.popStack();

    // Test 3: PC at various positions
    const test_positions = [_]usize{ 0, 10, 100, 1000, 10000 };
    for (test_positions) |pos| {
        test_frame.frame.pc = pos;
        _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, pos);
        _ = try test_frame.popStack();
    }
}

// ============================
// Gas consumption tests
// ============================

test "Stack, Memory, and Control opcodes: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x5B}, // JUMPDEST for jump tests
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test POP gas
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42});
    var gas_before: u64 = 1000;
    test_frame.frame.gas_remaining = gas_before;
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);
    var gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2), gas_used);

    // Test MLOAD gas
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0});
    gas_before = 1000;
    test_frame.frame.gas_remaining = gas_before;
    _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 6), gas_used); // 3 base + 3 memory expansion

    // Test MSTORE gas
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 42, 0 });
    gas_before = 1000;
    test_frame.frame.gas_remaining = gas_before;
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 3), gas_used);

    // Test MSTORE8 gas
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 42, 0 });
    gas_before = 1000;
    test_frame.frame.gas_remaining = gas_before;
    _ = try helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame);
    gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 3), gas_used);

    // Test PC gas
    test_frame.frame.stack.clear();
    gas_before = 1000;
    test_frame.frame.gas_remaining = gas_before;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2), gas_used);
}

test "SLOAD/SSTORE: EIP-2929 gas costs" {
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000);
    defer test_frame.deinit();

    // Test SLOAD cold access
    const slot: u256 = 42;
    try test_frame.pushStack(&[_]u256{slot});
    const gas_before_cold = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    const gas_cold = gas_before_cold - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2100), gas_cold); // Cold SLOAD cost
    _ = try test_frame.popStack();

    // Test SLOAD warm access
    try test_frame.pushStack(&[_]u256{slot});
    const gas_before_warm = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    const gas_warm = gas_before_warm - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 100), gas_warm); // Warm SLOAD cost
}

// ============================
// Edge cases and error conditions
// ============================

test "Invalid opcode 0x4F" {
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const result = helpers.executeOpcode(0x4F, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidOpcode, result);
    try testing.expectEqual(@as(u64, 0), test_frame.frame.gas_remaining);
}

test "Memory operations: Large offset handling" {
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

    // MSTORE with huge offset should run out of gas
    const huge_offset = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ 42, huge_offset });
    const result = helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, result);
}

test "Jump operations: Code analysis integration" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Complex bytecode with multiple JUMPDESTs
    const code = [_]u8{
        0x60, 0x09, // PUSH1 9
        0x56, // JUMP
        0x00, // STOP
        0x00, // STOP
        0x00, // STOP
        0x00, // STOP
        0x00, // STOP
        0x00, // STOP
        0x5B, // JUMPDEST at position 9
        0x60, 0x13, // PUSH1 19
        0x60, 0x01, // PUSH1 1
        0x57, // JUMPI
        0x00, // STOP
        0x00, // STOP
        0x00, // STOP
        0x00, // STOP
        0x5B, // JUMPDEST at position 19
        0x00, // STOP
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

    // Test chained jumps
    test_frame.frame.pc = 0;

    // First JUMP to position 9
    try test_frame.pushStack(&[_]u256{9});
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 9), test_frame.frame.pc);

    // Simulate execution at JUMPDEST, then JUMPI to position 19
    test_frame.frame.pc = 11; // After PUSH1 19
    // JUMPI expects: destination on top, then condition
    // Stack: [condition, destination] -> destination popped first
    try test_frame.pushStack(&[_]u256{ 1, 19 }); // condition, dest (dest on top)
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 19), test_frame.frame.pc);
}
