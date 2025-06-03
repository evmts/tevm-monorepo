const std = @import("std");
const testing = std.testing;
const opcodes = @import("../../../src/evm/opcodes/package.zig");
const test_helpers = @import("test_helpers.zig");
const ExecutionError = opcodes.ExecutionError;

// Test MLOAD operation
test "MLOAD: load 32 bytes from memory" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write 32 bytes to memory
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        try frame.memory.write_byte(i, @intCast(i));
    }
    
    // Push offset 0
    try frame.pushValue(0);
    
    // Execute MLOAD
    try test_helpers.executeOpcode(opcodes.memory.op_mload, &frame);
    
    // Should load 32 bytes as u256 (big-endian)
    const result = try frame.popValue();
    // First byte (0) should be in the most significant position
    try testing.expect((result >> 248) == 0);
    try testing.expect(((result >> 240) & 0xFF) == 1);
}

test "MLOAD: load with offset" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write pattern to memory
    var i: usize = 0;
    while (i < 64) : (i += 1) {
        try frame.memory.write_byte(i, @intCast(i + 0x10));
    }
    
    // Push offset 16
    try frame.pushValue(16);
    
    // Execute MLOAD
    try test_helpers.executeOpcode(opcodes.memory.op_mload, &frame);
    
    // Should load 32 bytes starting at offset 16
    const result = try frame.popValue();
    // First byte should be 0x20 (16 + 0x10)
    try testing.expect((result >> 248) == 0x20);
}

test "MLOAD: load from uninitialized memory returns zeros" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push offset to uninitialized area
    try frame.pushValue(1000);
    
    // Execute MLOAD
    try test_helpers.executeOpcode(opcodes.memory.op_mload, &frame);
    
    // Should return all zeros
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
}

// Test MSTORE operation
test "MSTORE: store 32 bytes to memory" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push value and offset
    const value: u256 = 0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20;
    try frame.pushValue(value); // value
    try frame.pushValue(0);     // offset
    
    // Execute MSTORE
    try test_helpers.executeOpcode(opcodes.memory.op_mstore, &frame);
    
    // Check memory contents
    try testing.expectEqual(@as(u8, 0x01), frame.memory.read_byte(0));
    try testing.expectEqual(@as(u8, 0x02), frame.memory.read_byte(1));
    try testing.expectEqual(@as(u8, 0x20), frame.memory.read_byte(31));
}

test "MSTORE: store with offset" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push value and offset
    const value: u256 = 0xFFEEDDCCBBAA99887766554433221100;
    try frame.pushValue(value); // value
    try frame.pushValue(64);    // offset
    
    // Execute MSTORE
    try test_helpers.executeOpcode(opcodes.memory.op_mstore, &frame);
    
    // Check memory contents at offset
    try testing.expectEqual(@as(u8, 0x00), frame.memory.read_byte(79));
    try testing.expectEqual(@as(u8, 0x00), frame.memory.read_byte(80));
    // ... more bytes in the middle are zeros...
    try testing.expectEqual(@as(u8, 0xFF), frame.memory.read_byte(80 - 16)); // Most significant bytes
}

// Test MSTORE8 operation
test "MSTORE8: store single byte to memory" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push value and offset
    try frame.pushValue(0x1234); // value (only lowest byte 0x34 will be stored)
    try frame.pushValue(10);     // offset
    
    // Execute MSTORE8
    try test_helpers.executeOpcode(opcodes.memory.op_mstore8, &frame);
    
    // Check memory contents
    try testing.expectEqual(@as(u8, 0x34), frame.memory.read_byte(10));
    // Adjacent bytes should be unaffected (zero)
    try testing.expectEqual(@as(u8, 0), frame.memory.read_byte(9));
    try testing.expectEqual(@as(u8, 0), frame.memory.read_byte(11));
}

test "MSTORE8: store only lowest byte" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push value with all bytes set
    try frame.pushValue(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFAB); // only 0xAB should be stored
    try frame.pushValue(0);                                    // offset
    
    // Execute MSTORE8
    try test_helpers.executeOpcode(opcodes.memory.op_mstore8, &frame);
    
    // Check that only lowest byte was stored
    try testing.expectEqual(@as(u8, 0xAB), frame.memory.read_byte(0));
}

// Test MSIZE operation
test "MSIZE: get memory size" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Initially memory size should be 0
    try test_helpers.executeOpcode(opcodes.memory.op_msize, &frame);
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
    
    // Write to memory at offset 31 (should expand to 32 bytes)
    try frame.memory.write_byte(31, 0xFF);
    
    // Check size again
    try test_helpers.executeOpcode(opcodes.memory.op_msize, &frame);
    try testing.expectEqual(@as(u256, 32), try frame.popValue());
    
    // Write to memory at offset 32 (should expand to 64 bytes - word aligned)
    try frame.memory.write_byte(32, 0xFF);
    
    // Check size again
    try test_helpers.executeOpcode(opcodes.memory.op_msize, &frame);
    try testing.expectEqual(@as(u256, 64), try frame.popValue());
}

// Test MCOPY operation (EIP-5656)
test "MCOPY: copy memory to memory" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write source data
    const src_data = [_]u8{ 0xAA, 0xBB, 0xCC, 0xDD, 0xEE };
    var i: usize = 0;
    while (i < src_data.len) : (i += 1) {
        try frame.memory.write_byte(10 + i, src_data[i]);
    }
    
    // Push length, source offset, destination offset
    try frame.pushValue(5);  // length
    try frame.pushValue(10); // source offset
    try frame.pushValue(50); // destination offset
    
    // Execute MCOPY
    try test_helpers.executeOpcode(opcodes.memory.op_mcopy, &frame);
    
    // Check that data was copied
    i = 0;
    while (i < src_data.len) : (i += 1) {
        try testing.expectEqual(src_data[i], frame.memory.read_byte(50 + i));
    }
    
    // Original data should still be there
    i = 0;
    while (i < src_data.len) : (i += 1) {
        try testing.expectEqual(src_data[i], frame.memory.read_byte(10 + i));
    }
}

test "MCOPY: overlapping copy forward" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write source data
    const src_data = [_]u8{ 0x11, 0x22, 0x33, 0x44, 0x55 };
    var i: usize = 0;
    while (i < src_data.len) : (i += 1) {
        try frame.memory.write_byte(10 + i, src_data[i]);
    }
    
    // Copy with overlap (forward)
    try frame.pushValue(5);  // length
    try frame.pushValue(10); // source offset
    try frame.pushValue(12); // destination offset (overlaps by 3 bytes)
    
    // Execute MCOPY
    try test_helpers.executeOpcode(opcodes.memory.op_mcopy, &frame);
    
    // Check result - should handle overlap correctly
    try testing.expectEqual(@as(u8, 0x11), frame.memory.read_byte(12));
    try testing.expectEqual(@as(u8, 0x22), frame.memory.read_byte(13));
    try testing.expectEqual(@as(u8, 0x33), frame.memory.read_byte(14));
    try testing.expectEqual(@as(u8, 0x44), frame.memory.read_byte(15));
    try testing.expectEqual(@as(u8, 0x55), frame.memory.read_byte(16));
}

test "MCOPY: overlapping copy backward" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write source data
    const src_data = [_]u8{ 0xAA, 0xBB, 0xCC, 0xDD, 0xEE };
    var i: usize = 0;
    while (i < src_data.len) : (i += 1) {
        try frame.memory.write_byte(10 + i, src_data[i]);
    }
    
    // Copy with overlap (backward)
    try frame.pushValue(5);  // length
    try frame.pushValue(10); // source offset
    try frame.pushValue(8);  // destination offset (overlaps by 3 bytes)
    
    // Execute MCOPY
    try test_helpers.executeOpcode(opcodes.memory.op_mcopy, &frame);
    
    // Check result
    try testing.expectEqual(@as(u8, 0xAA), frame.memory.read_byte(8));
    try testing.expectEqual(@as(u8, 0xBB), frame.memory.read_byte(9));
    try testing.expectEqual(@as(u8, 0xCC), frame.memory.read_byte(10));
    try testing.expectEqual(@as(u8, 0xDD), frame.memory.read_byte(11));
    try testing.expectEqual(@as(u8, 0xEE), frame.memory.read_byte(12));
}

test "MCOPY: zero length copy" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push length 0
    try frame.pushValue(0);   // length
    try frame.pushValue(100); // source offset
    try frame.pushValue(200); // destination offset
    
    // Execute MCOPY
    try test_helpers.executeOpcode(opcodes.memory.op_mcopy, &frame);
    
    // Should succeed without doing anything
    try testing.expectEqual(@as(usize, 0), frame.stack.items.len);
}

// Test gas consumption
test "MLOAD: memory expansion gas" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 1000;
    
    // Push offset that requires memory expansion
    try frame.pushValue(256); // offset (requires 288 bytes = 9 words)
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute MLOAD
    try test_helpers.executeOpcode(opcodes.memory.op_mload, &frame);
    
    // Should consume gas for memory expansion
    const gas_used = gas_before - frame.frame.gas_remaining;
    try testing.expect(gas_used > 0); // Memory expansion should cost gas
}

test "MSTORE: memory expansion gas" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 1000;
    
    // Push value and offset that requires expansion
    try frame.pushValue(0x123456); // value
    try frame.pushValue(512);      // offset (requires 544 bytes)
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute MSTORE
    try test_helpers.executeOpcode(opcodes.memory.op_mstore, &frame);
    
    // Should consume gas for memory expansion
    const gas_used = gas_before - frame.frame.gas_remaining;
    try testing.expect(gas_used > 0);
}

test "MCOPY: gas consumption" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 1000;
    
    // Push parameters for 32 byte copy
    try frame.pushValue(32);  // length
    try frame.pushValue(0);   // source
    try frame.pushValue(100); // destination
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute MCOPY
    try test_helpers.executeOpcode(opcodes.memory.op_mcopy, &frame);
    
    // MCOPY costs 3 gas per word
    // 32 bytes = 1 word = 3 gas
    // Plus memory expansion for destination
    const gas_used = gas_before - frame.frame.gas_remaining;
    try testing.expect(gas_used >= 3);
}

// Test stack errors
test "MLOAD: stack underflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Empty stack
    
    // Execute MLOAD - should fail
    const result = test_helpers.executeOpcode(opcodes.memory.op_mload, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "MSTORE: stack underflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push only one value (need two)
    try frame.pushValue(0);
    
    // Execute MSTORE - should fail
    const result = test_helpers.executeOpcode(opcodes.memory.op_mstore, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "MCOPY: stack underflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push only two values (need three)
    try frame.pushValue(10); // length
    try frame.pushValue(0);  // source
    
    // Execute MCOPY - should fail
    const result = test_helpers.executeOpcode(opcodes.memory.op_mcopy, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

// Test out of offset
test "MLOAD: offset overflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push offset that would overflow when adding 32
    try frame.pushValue(std.math.maxInt(u256) - 10);
    
    // Execute MLOAD - should fail
    const result = test_helpers.executeOpcode(opcodes.memory.op_mload, &frame);
    try testing.expectError(ExecutionError.Error.OutOfOffset, result);
}

test "MCOPY: source offset overflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push parameters that would overflow
    try frame.pushValue(100);                   // length
    try frame.pushValue(std.math.maxInt(u256)); // source offset
    try frame.pushValue(0);                     // destination
    
    // Execute MCOPY - should fail
    const result = test_helpers.executeOpcode(opcodes.memory.op_mcopy, &frame);
    try testing.expectError(ExecutionError.Error.OutOfOffset, result);
}