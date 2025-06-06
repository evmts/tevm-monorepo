const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const opcodes = evm.opcodes;
const test_helpers = @import("test_helpers.zig");
const ExecutionError = evm.ExecutionError;

// Test MLOAD operation
test "MLOAD: load 32 bytes from memory" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Write 32 bytes to memory
    var data: [32]u8 = undefined;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        data[i] = @intCast(i);
    }
    try test_frame.setMemory(0, &data);
    
    // Push offset 0
    try test_frame.pushStack(&[_]u256{0});
    
    // Execute MLOAD
    _ = try test_helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    
    // Should load 32 bytes as u256 (big-endian)
    const result = try test_frame.popStack();
    // First byte (0) should be in the most significant position
    try testing.expect((result >> 248) == 0);
    try testing.expect(((result >> 240) & 0xFF) == 1);
}

test "MLOAD: load with offset" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Write pattern to memory
    var data: [64]u8 = undefined;
    var i: usize = 0;
    while (i < 64) : (i += 1) {
        data[i] = @intCast(i + 0x10);
    }
    try test_frame.setMemory(0, &data);
    
    // Push offset 16
    try test_frame.pushStack(&[_]u256{16});
    
    // Execute MLOAD
    _ = try test_helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    
    // Should load 32 bytes starting at offset 16
    const result = try test_frame.popStack();
    // First byte should be 0x20 (16 + 0x10)
    try testing.expect((result >> 248) == 0x20);
}

test "MLOAD: load from uninitialized memory returns zeros" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push offset to uninitialized area
    try test_frame.pushStack(&[_]u256{1000});
    
    // Execute MLOAD
    _ = try test_helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    
    // Should return all zeros
    try testing.expectEqual(@as(u256, 0), try test_frame.popStack());
}

// Test MSTORE operation
test "MSTORE: store 32 bytes to memory" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push value and offset (stack is LIFO)
    const value: u256 = 0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20;
    try test_frame.pushStack(&[_]u256{value, 0}); // value first, then offset (offset on top)
    
    // Execute MSTORE
    _ = try test_helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    
    // Check memory contents
    const mem = try test_frame.getMemory(0, 32);
    try testing.expectEqual(@as(u8, 0x01), mem[0]);
    try testing.expectEqual(@as(u8, 0x02), mem[1]);
    try testing.expectEqual(@as(u8, 0x20), mem[31]);
}

test "MSTORE: store with offset" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push value and offset (stack is LIFO)
    const value: u256 = 0xFFEEDDCCBBAA99887766554433221100;
    try test_frame.pushStack(&[_]u256{value, 64}); // value first, then offset (offset on top)
    
    // Execute MSTORE
    _ = try test_helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    
    // Check memory contents at offset
    const mem = try test_frame.getMemory(64, 32);
    // The value 0xFFEEDDCCBBAA99887766554433221100 is stored big-endian
    // Most significant bytes first: 00 00 ... 00 FF EE DD CC BB AA ...
    try testing.expectEqual(@as(u8, 0x00), mem[15]); // Byte 15 at offset 64+15=79
    try testing.expectEqual(@as(u8, 0xFF), mem[16]); // Byte 16 at offset 64+16=80 is 0xFF
}

// Test MSTORE8 operation
test "MSTORE8: store single byte to memory" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push value and offset (stack is LIFO)
    try test_frame.pushStack(&[_]u256{0x1234, 10}); // value first, then offset (offset on top) - only lowest byte 0x34 will be stored
    
    // Execute MSTORE8
    _ = try test_helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame);
    
    // Check memory contents
    const mem = try test_frame.getMemory(10, 1);
    try testing.expectEqual(@as(u8, 0x34), mem[0]);
    // Adjacent bytes should be unaffected (zero)
    const mem_before = try test_frame.getMemory(9, 1);
    const mem_after = try test_frame.getMemory(11, 1);
    try testing.expectEqual(@as(u8, 0), mem_before[0]);
    try testing.expectEqual(@as(u8, 0), mem_after[0]);
}

test "MSTORE8: store only lowest byte" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push value with all bytes set (stack is LIFO)
    try test_frame.pushStack(&[_]u256{0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFAB, 0}); // value first, then offset (offset on top) - only 0xAB should be stored
    
    // Execute MSTORE8
    _ = try test_helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame);
    
    // Check that only lowest byte was stored
    const mem = try test_frame.getMemory(0, 1);
    try testing.expectEqual(@as(u8, 0xAB), mem[0]);
}

// Test MSIZE operation
test "MSIZE: get memory size" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Initially memory size should be 0
    _ = try test_helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(u256, 0), try test_frame.popStack());
    
    // Write to memory at offset 31 (should expand to 32 bytes)
    try test_frame.setMemory(31, &[_]u8{0xFF});
    
    // Check size again
    _ = try test_helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(u256, 32), try test_frame.popStack());
    
    // Write to memory at offset 32 (should expand to 64 bytes - word aligned)
    try test_frame.setMemory(32, &[_]u8{0xFF});
    
    // Check size again
    _ = try test_helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(u256, 64), try test_frame.popStack());
}

// Test MCOPY operation (EIP-5656)
test "MCOPY: copy memory to memory" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Write source data
    const src_data = [_]u8{ 0xAA, 0xBB, 0xCC, 0xDD, 0xEE };
    try test_frame.setMemory(10, &src_data);
    
    // Push parameters in order for stack
    // MCOPY pops: size (first), src (second), dest (third)
    // So push: dest, src, size (size on top)
    try test_frame.pushStack(&[_]u256{50, 10, 5}); // dest, src, size
    
    // Execute MCOPY
    _ = try test_helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);
    
    // Check that data was copied
    const dest_data = try test_frame.getMemory(50, 5);
    var i: usize = 0;
    while (i < src_data.len) : (i += 1) {
        try testing.expectEqual(src_data[i], dest_data[i]);
    }
    
    // Original data should still be there
    const orig_data = try test_frame.getMemory(10, 5);
    i = 0;
    while (i < src_data.len) : (i += 1) {
        try testing.expectEqual(src_data[i], orig_data[i]);
    }
}

test "MCOPY: overlapping copy forward" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Write source data
    const src_data = [_]u8{ 0x11, 0x22, 0x33, 0x44, 0x55 };
    try test_frame.setMemory(10, &src_data);
    
    // Copy with overlap (forward)
    // MCOPY pops: size, src, dest
    try test_frame.pushStack(&[_]u256{12, 10, 5}); // dest, src, size (overlaps by 3 bytes)
    
    // Execute MCOPY
    _ = try test_helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);
    
    // Check result - should handle overlap correctly
    const result = try test_frame.getMemory(12, 5);
    try testing.expectEqual(@as(u8, 0x11), result[0]);
    try testing.expectEqual(@as(u8, 0x22), result[1]);
    try testing.expectEqual(@as(u8, 0x33), result[2]);
    try testing.expectEqual(@as(u8, 0x44), result[3]);
    try testing.expectEqual(@as(u8, 0x55), result[4]);
}

test "MCOPY: overlapping copy backward" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Write source data
    const src_data = [_]u8{ 0xAA, 0xBB, 0xCC, 0xDD, 0xEE };
    try test_frame.setMemory(10, &src_data);
    
    // Copy with overlap (backward)
    // MCOPY pops: size, src, dest
    try test_frame.pushStack(&[_]u256{8, 10, 5}); // dest, src, size (overlaps by 3 bytes)
    
    // Execute MCOPY
    _ = try test_helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);
    
    // Check result
    const result = try test_frame.getMemory(8, 5);
    try testing.expectEqual(@as(u8, 0xAA), result[0]);
    try testing.expectEqual(@as(u8, 0xBB), result[1]);
    try testing.expectEqual(@as(u8, 0xCC), result[2]);
    try testing.expectEqual(@as(u8, 0xDD), result[3]);
    try testing.expectEqual(@as(u8, 0xEE), result[4]);
}

test "MCOPY: zero length copy" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push length 0
    // MCOPY pops: size, src, dest
    try test_frame.pushStack(&[_]u256{200, 100, 0}); // dest, src, size
    
    // Execute MCOPY
    _ = try test_helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);
    
    // Should succeed without doing anything
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());
}

// Test gas consumption
test "MLOAD: memory expansion gas" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push offset that requires memory expansion
    try test_frame.pushStack(&[_]u256{256}); // offset (requires 288 bytes = 9 words)
    
    const gas_before = test_frame.gasRemaining();
    
    // Execute MLOAD
    _ = try test_helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    
    // Should consume gas for memory expansion
    const gas_used = gas_before - test_frame.gasRemaining();
    try testing.expect(gas_used > 0); // Memory expansion should cost gas
}

test "MSTORE: memory expansion gas" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push value and offset that requires expansion (stack is LIFO)
    try test_frame.pushStack(&[_]u256{0x123456, 512}); // value, offset (requires 544 bytes)
    
    const gas_before = test_frame.gasRemaining();
    
    // Execute MSTORE
    _ = try test_helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    
    // Should consume gas for memory expansion
    const gas_used = gas_before - test_frame.gasRemaining();
    try testing.expect(gas_used > 0);
}

test "MCOPY: gas consumption" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push parameters for 32 byte copy
    // MCOPY pops: size, src, dest
    try test_frame.pushStack(&[_]u256{100, 0, 32}); // dest, src, size
    
    const gas_before = test_frame.gasRemaining();
    
    // Execute MCOPY
    _ = try test_helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);
    
    // MCOPY costs 3 gas per word
    // 32 bytes = 1 word = 3 gas
    // Plus memory expansion for destination
    const gas_used = gas_before - test_frame.gasRemaining();
    try testing.expect(gas_used >= 3);
}

// Test stack errors
test "MLOAD: stack underflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Empty stack
    
    // Execute MLOAD - should fail
    const result = test_helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "MSTORE: stack underflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push only one value (need two)
    try test_frame.pushStack(&[_]u256{0});
    
    // Execute MSTORE - should fail
    const result = test_helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "MCOPY: stack underflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push only two values (need three)
    // MCOPY needs: dest, src, size on stack
    try test_frame.pushStack(&[_]u256{0, 10}); // only two values
    
    // Execute MCOPY - should fail
    const result = test_helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

// Test out of offset
test "MLOAD: offset overflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push offset that would overflow when adding 32
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u256) - 10});
    
    // Execute MLOAD - should fail
    const result = test_helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.OutOfOffset, result);
}

test "MCOPY: source offset overflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push parameters that would overflow
    // MCOPY pops: size, src, dest
    try test_frame.pushStack(&[_]u256{0, std.math.maxInt(u256), 100}); // dest, src (overflow), size
    
    // Execute MCOPY - should fail
    const result = test_helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.OutOfOffset, result);
}
