const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// Cryptographic Instructions (0x20)
// KECCAK256 (SHA3)
// ============================

// ============================
// 0x20: KECCAK256 - Compute Keccak-256 hash of memory data
// Gas: 30 base + 6 per word + memory expansion
// Stack: [offset, size] -> [hash]
// ============================

test "KECCAK256 (0x20): Known test vectors" {
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

    // Test vector 1: Empty string
    // keccak256("") = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
    try test_frame.pushStack(&[_]u256{ 0, 0 }); // offset=0, size=0
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const empty_hash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
    try helpers.expectStackValue(test_frame.frame, 0, empty_hash);
    test_frame.frame.stack.clear();

    // Test vector 2: Single byte 0x01
    // keccak256(0x01) = 0x5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2
    try test_frame.frame.memory.set_data(0, &[_]u8{0x01});
    try test_frame.pushStack(&[_]u256{ 1, 0 }); // offset=0, size=1
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const single_byte_hash = 0x5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2;
    try helpers.expectStackValue(test_frame.frame, 0, single_byte_hash);
    test_frame.frame.stack.clear();

    // Test vector 3: "abc" (0x616263)
    // keccak256("abc") = 0x4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45
    try test_frame.frame.memory.set_data(0, &[_]u8{ 0x61, 0x62, 0x63 });
    try test_frame.pushStack(&[_]u256{ 3, 0 }); // offset=0, size=3
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const abc_hash = 0x4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45;
    try helpers.expectStackValue(test_frame.frame, 0, abc_hash);
    test_frame.frame.stack.clear();

    // Test vector 4: 32 bytes of zeros
    // keccak256(32 zero bytes) = 0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563
    var zero_bytes = [_]u8{0} ** 32;
    for (0..32) |i| {
        try test_frame.frame.memory.set_data(i, &[_]u8{zero_bytes[i]});
    }
    try test_frame.pushStack(&[_]u256{ 32, 0 }); // offset=0, size=32
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const zero32_hash = 0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563;
    try helpers.expectStackValue(test_frame.frame, 0, zero32_hash);
}

test "KECCAK256: Gas cost calculations" {
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

    // Test 1: Empty data (0 words)
    // Gas cost should be base cost (30) + 0 words * 6 = 30
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const initial_gas = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ 0, 0 }); // offset=0, size=0
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const gas_used_empty = initial_gas - test_frame.frame.gas_remaining;
    // Empty data still charges base cost
    try testing.expectEqual(@as(u64, 30), gas_used_empty);
    test_frame.frame.stack.clear();

    // Test 2: 1 byte (1 word)
    // Gas cost should be 30 + 1 * 6 = 36
    test_frame.frame.gas_remaining = 1000;
    const initial_gas2 = test_frame.frame.gas_remaining;
    try test_frame.frame.memory.set_data(0, &[_]u8{0x01});
    try test_frame.pushStack(&[_]u256{ 1, 0 }); // offset=0, size=1
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const gas_used_1byte = initial_gas2 - test_frame.frame.gas_remaining;
    try testing.expect(gas_used_1byte >= 36); // At least 36, may include memory expansion
    test_frame.frame.stack.clear();

    // Test 3: 32 bytes (1 word)
    // Gas cost should be 30 + 1 * 6 = 36
    test_frame.frame.gas_remaining = 1000;
    const initial_gas3 = test_frame.frame.gas_remaining;
    for (0..32) |i| {
        try test_frame.frame.memory.set_data(i, &[_]u8{@intCast(i)});
    }
    try test_frame.pushStack(&[_]u256{ 32, 0 }); // offset=0, size=32
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const gas_used_32bytes = initial_gas3 - test_frame.frame.gas_remaining;
    try testing.expect(gas_used_32bytes >= 36);
    test_frame.frame.stack.clear();

    // Test 4: 64 bytes (2 words)
    // Gas cost should be 30 + 2 * 6 = 42
    test_frame.frame.gas_remaining = 1000;
    const initial_gas4 = test_frame.frame.gas_remaining;
    for (0..64) |i| {
        try test_frame.frame.memory.set_data(i, &[_]u8{@intCast(i & 0xFF)});
    }
    try test_frame.pushStack(&[_]u256{ 64, 0 }); // offset=0, size=64
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const gas_used_64bytes = initial_gas4 - test_frame.frame.gas_remaining;
    try testing.expect(gas_used_64bytes >= 42);
    try testing.expect(gas_used_64bytes > gas_used_32bytes); // Should cost more

    // Test 5: Large data (256 bytes = 8 words)
    // Gas cost should be 30 + 8 * 6 = 78 (plus memory expansion)
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 1000;
    const initial_gas5 = test_frame.frame.gas_remaining;
    for (0..256) |i| {
        try test_frame.frame.memory.set_data(i, &[_]u8{@intCast(i & 0xFF)});
    }
    try test_frame.pushStack(&[_]u256{ 256, 0 }); // offset=0, size=256
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const gas_used_256bytes = initial_gas5 - test_frame.frame.gas_remaining;
    try testing.expect(gas_used_256bytes >= 78);
    try testing.expect(gas_used_256bytes > gas_used_64bytes);
}

test "KECCAK256: Memory operations" {
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

    // Test 1: Hash data at non-zero offset
    const pattern = [_]u8{ 0xDE, 0xAD, 0xBE, 0xEF };
    for (pattern, 0..) |byte, i| {
        try test_frame.frame.memory.set_data(100 + i, &[_]u8{byte});
    }
    try test_frame.pushStack(&[_]u256{ 4, 100 }); // offset=100, size=4
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const offset_hash = try test_frame.frame.stack.peek_n(0);
    try testing.expect(offset_hash != 0);
    test_frame.frame.stack.clear();

    // Test 2: Same data at offset 0 should produce same hash
    for (pattern, 0..) |byte, i| {
        try test_frame.frame.memory.set_data(i, &[_]u8{byte});
    }
    try test_frame.pushStack(&[_]u256{ 4, 0 }); // offset=0, size=4
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const zero_offset_hash = try test_frame.frame.stack.peek_n(0);
    try testing.expectEqual(offset_hash, zero_offset_hash);
    test_frame.frame.stack.clear();

    // Test 3: Memory expansion
    const large_offset = 1000;
    const size = 64;
    try test_frame.pushStack(&[_]u256{ size, large_offset });
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    // Should not error, memory should expand to accommodate
    const expansion_hash = try test_frame.frame.stack.peek_n(0);
    try testing.expect(expansion_hash != 0);
    test_frame.frame.stack.clear();

    // Test 4: Zero-size hash at large offset should not fail
    try test_frame.pushStack(&[_]u256{ 0, large_offset });
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const empty_at_offset = try test_frame.frame.stack.peek_n(0);
    const empty_hash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
    try testing.expectEqual(@as(u256, empty_hash), empty_at_offset);
}

test "KECCAK256: Variable input sizes" {
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

    // Set up test data pattern
    for (0..1024) |i| {
        try test_frame.frame.memory.set_data(i, &[_]u8{@intCast(i & 0xFF)});
    }

    var previous_hash: u256 = 0;

    // Test various sizes to ensure each produces a different hash
    const test_sizes = [_]u256{ 1, 2, 3, 4, 5, 8, 16, 31, 32, 33, 63, 64, 65, 127, 128, 255, 256, 511, 512, 1023 };

    for (test_sizes) |size| {
        try test_frame.pushStack(&[_]u256{ size, 0 });
        _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
        const current_hash = try test_frame.frame.stack.peek_n(0);

        // Each different input size should produce a different hash
        if (previous_hash != 0) {
            try testing.expect(current_hash != previous_hash);
        }
        previous_hash = current_hash;
        test_frame.frame.stack.clear();
    }
}

test "KECCAK256: Hash consistency" {
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

    // Test: Same input should always produce same hash
    const test_data = [_]u8{ 0x48, 0x65, 0x6c, 0x6c, 0x6f }; // "Hello"
    for (test_data, 0..) |byte, i| {
        try test_frame.frame.memory.set_data(i, &[_]u8{byte});
    }

    // Hash it multiple times
    var first_hash: u256 = 0;
    for (0..5) |iteration| {
        try test_frame.pushStack(&[_]u256{ test_data.len, 0 });
        _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
        const current_hash = try test_frame.frame.stack.peek_n(0);

        if (iteration == 0) {
            first_hash = current_hash;
        } else {
            try testing.expectEqual(first_hash, current_hash);
        }
        test_frame.frame.stack.clear();
    }

    // Test: Different input should produce different hash
    try test_frame.frame.memory.set_data(4, &[_]u8{0x6F}); // Change "Hello" to "Helloo"
    try test_frame.pushStack(&[_]u256{ test_data.len, 0 });
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const different_hash = try test_frame.frame.stack.peek_n(0);
    try testing.expect(different_hash != first_hash);
}

test "KECCAK256: Edge cases and limits" {
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

    // Test 1: Maximum reasonable size that doesn't exceed memory limits
    const large_size = 8192; // 256 words
    try test_frame.pushStack(&[_]u256{ large_size, 0 });
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const large_hash = try test_frame.frame.stack.peek_n(0);
    try testing.expect(large_hash != 0);
    test_frame.frame.stack.clear();

    // Test 2: Zero offset with non-zero size
    try test_frame.pushStack(&[_]u256{ 32, 0 });
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const zero_offset_result = try test_frame.frame.stack.peek_n(0);
    try testing.expect(zero_offset_result != 0);
    test_frame.frame.stack.clear();

    // Test 3: Word boundary alignment (31 bytes vs 32 bytes)
    // 31 bytes should use 1 word, 33 bytes should use 2 words
    for (0..33) |i| {
        try test_frame.frame.memory.set_data(i, &[_]u8{0xAA});
    }

    const gas_before_31 = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ 31, 0 }); // 31 bytes = 1 word
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const gas_after_31 = test_frame.frame.gas_remaining;
    const gas_used_31 = gas_before_31 - gas_after_31;
    test_frame.frame.stack.clear();

    const gas_before_33 = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ 33, 0 }); // 33 bytes = 2 words
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const gas_after_33 = test_frame.frame.gas_remaining;
    const gas_used_33 = gas_before_33 - gas_after_33;

    // 33 bytes should cost more than 31 bytes due to additional word
    try testing.expect(gas_used_33 >= gas_used_31 + 6); // At least 6 more gas for extra word
}

test "KECCAK256: Error conditions" {
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

    // Test 1: Stack underflow - no arguments
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame));

    // Test 2: Stack underflow - only one argument
    try test_frame.pushStack(&[_]u256{32});
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame));
    test_frame.frame.stack.clear();

    // Test 3: Out of gas - insufficient gas for large hash
    test_frame.frame.gas_remaining = 30; // Only enough for base cost, not word cost
    const large_size = 1000; // Would require 30 + ceil(1000/32) * 6 = 30 + 32 * 6 = 222 gas
    try test_frame.pushStack(&[_]u256{ large_size, 0 });
    try testing.expectError(helpers.ExecutionError.Error.OutOfGas, helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame));
    test_frame.frame.stack.clear();

    // Test 4: Invalid offset - extremely large offset that would overflow
    test_frame.frame.gas_remaining = 10000;
    const huge_offset = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ 1, huge_offset });
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame));
    test_frame.frame.stack.clear();

    // Test 5: Size overflow - offset + size overflows
    const large_offset = std.math.maxInt(u256) - 10;
    const size_that_overflows = 20;
    try test_frame.pushStack(&[_]u256{ size_that_overflows, large_offset });
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame));
}

test "KECCAK256: Stack behavior" {
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

    // Set up initial stack state
    try test_frame.pushStack(&[_]u256{ 0x12345678, 0xABCDEF, 0x55, 0x0 }); // [bottom] 0x12345678, 0xABCDEF, 0x55, 0x0 [top]

    // Stack before: [0x12345678, 0xABCDEF, 0x55, 0x0] (size and offset are on top)
    try testing.expectEqual(@as(usize, 4), test_frame.stackSize());

    // Execute KECCAK256
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);

    // Stack after: [0x12345678, 0xABCDEF, hash_result] (consumed 2, produced 1)
    try testing.expectEqual(@as(usize, 3), test_frame.stackSize());

    // Bottom values should remain unchanged
    try helpers.expectStackValue(test_frame.frame, 2, 0x12345678);
    try helpers.expectStackValue(test_frame.frame, 1, 0xABCDEF);

    // Top value should be the hash result
    const hash_result = try test_frame.frame.stack.peek_n(0);
    try testing.expect(hash_result != 0); // Hash should be non-zero
    try testing.expect(hash_result != 0x55); // Should not be the old value
}

test "KECCAK256: Memory access patterns" {
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

    // Test 1: Reading across memory boundaries
    // Write data that spans multiple 32-byte words
    const test_pattern = "This is a test string that spans multiple memory words and should produce a consistent hash";
    for (test_pattern, 0..) |char, i| {
        try test_frame.frame.memory.set_data(i, &[_]u8{char});
    }

    try test_frame.pushStack(&[_]u256{ test_pattern.len, 0 });
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const pattern_hash = try test_frame.frame.stack.peek_n(0);
    try testing.expect(pattern_hash != 0);
    test_frame.frame.stack.clear();

    // Test 2: Reading with gaps in initialized memory
    // Initialize only every other byte
    for (0..64) |i| {
        if (i % 2 == 0) {
            try test_frame.frame.memory.set_data(100 + i, &[_]u8{@intCast(i)});
        }
        // Odd positions remain 0 (default)
    }

    try test_frame.pushStack(&[_]u256{ 64, 100 });
    _ = try helpers.executeOpcode(0x20, test_vm.vm, test_frame.frame);
    const gap_hash = try test_frame.frame.stack.peek_n(0);
    try testing.expect(gap_hash != 0);
    try testing.expect(gap_hash != pattern_hash);
}
