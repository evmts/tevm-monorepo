const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes to test
const evm = @import("evm");
const crypto = evm.opcodes.crypto;

test "Crypto: KECCAK256 (SHA3) basic operations" {
    const allocator = testing.allocator;
    
    // Set up test VM and frame
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
    
    // Test 1: Hash empty data
    try test_frame.pushStack(&[_]u256{0, 0}); // offset=0, size=0
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    
    // Empty hash: keccak256("") = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
    const empty_hash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
    try helpers.expectStackValue(test_frame.frame, 0, empty_hash);
    try testing.expectEqual(@as(usize, 1), test_frame.stackSize());
    
    // Test 2: Hash single byte
    test_frame.frame.stack.clear();
    // Write 0x01 to memory at position 0
    try test_frame.frame.memory.set_byte(0, 0x01);
    try test_frame.pushStack(&[_]u256{1, 0}); // offset=0, size=1
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    
    // keccak256(0x01) = 0x5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2
    const single_byte_hash = 0x5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2;
    try helpers.expectStackValue(test_frame.frame, 0, single_byte_hash);
    
    // Test 3: Hash 32 bytes (one word)
    test_frame.frame.stack.clear();
    // Write 32 bytes of 0xFF to memory
    for (0..32) |i| {
        try test_frame.frame.memory.set_byte(i, 0xFF);
    }
    try test_frame.pushStack(&[_]u256{32, 0}); // offset=0, size=32
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    
    // Should produce a valid hash (exact value would depend on actual keccak256 implementation)
    const result = try test_frame.frame.stack.peek_n(0);
    try testing.expect(result != 0); // Hash should not be zero
    
    // Test 4: Hash with non-zero offset
    test_frame.frame.stack.clear();
    // Write pattern starting at offset 64
    for (64..96) |i| {
        try test_frame.frame.memory.set_byte(i, @intCast(i & 0xFF));
    }
    try test_frame.pushStack(&[_]u256{32, 64}); // offset=64, size=32
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    
    const offset_result = try test_frame.frame.stack.peek_n(0);
    try testing.expect(offset_result != 0); // Hash should not be zero
    try testing.expect(offset_result != result); // Different data should produce different hash
}

test "Crypto: KECCAK256 memory expansion and gas" {
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
    
    // Test memory expansion gas cost
    const initial_gas = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{256, 0}); // offset=0, size=256 (8 words)
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    
    // Gas should include:
    // - Base cost: 30
    // - Word cost: 6 * ceil(256/32) = 6 * 8 = 48
    // - Memory expansion cost for 256 bytes
    const gas_used = initial_gas - test_frame.frame.gas_remaining;
    try testing.expect(gas_used >= 30 + 48); // At least base + word costs
    
    // Test large memory expansion
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 10000;
    const large_size = 1024; // 32 words
    try test_frame.pushStack(&[_]u256{large_size, 0});
    _ = try helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    
    // Should consume more gas for larger data
    const large_gas_used = 10000 - test_frame.frame.gas_remaining;
    try testing.expect(large_gas_used > gas_used);
}

test "Crypto: KECCAK256 edge cases" {
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
    
    // Test with maximum offset that fits in memory
    const max_offset = std.math.maxInt(usize) - 32;
    if (max_offset <= std.math.maxInt(u256)) {
        try test_frame.pushStack(&[_]u256{0, max_offset});
        const err = helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, err);
    }
    
    // Test with size exceeding available gas (would cost too much)
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 100; // Very limited gas
    const huge_size = 10000; // Would require lots of gas
    try test_frame.pushStack(&[_]u256{huge_size, 0});
    const err2 = helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfGas, err2);
}

test "Crypto: Stack underflow errors" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test SHA3 with empty stack
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame)
    );
    
    // Test SHA3 with only one item
    try test_frame.pushStack(&[_]u256{32});
    try testing.expectError(
        helpers.ExecutionError.Error.StackUnderflow,
        helpers.executeOpcode(0x20, &test_vm.vm, test_frame.frame)
    );
}
