const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// 0x6D-0x7F: PUSH14 through PUSH32
// ============================

test "PUSH14 (0x6D): Push 14 bytes onto stack" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x6D, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, // PUSH14
        0x6D, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, // PUSH14 max
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test first PUSH14
    var result = try helpers.executeOpcode(0x6D, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 15), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0102030405060708090A0B0C0D0E);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 15;
    
    // Test second PUSH14 (max value)
    result = try helpers.executeOpcode(0x6D, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 15), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFF);
}

test "PUSH15 (0x6E): Push 15 bytes onto stack" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x6E, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, // PUSH15
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    const result = try helpers.executeOpcode(0x6E, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 16), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0102030405060708090A0B0C0D0E0F);
}

test "PUSH16 (0x6F): Push 16 bytes onto stack" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x6F, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10, // PUSH16
        0x6F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, // PUSH16 max
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test first PUSH16
    var result = try helpers.executeOpcode(0x6F, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 17), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0102030405060708090A0B0C0D0E0F10);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 17;
    
    // Test second PUSH16 (max value)
    result = try helpers.executeOpcode(0x6F, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 17), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF);
}

test "PUSH17-PUSH19: Various sizes" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Create code with PUSH17, PUSH18, PUSH19
    var code: [60]u8 = undefined;
    var idx: usize = 0;
    
    // PUSH17
    code[idx] = 0x70;
    for (1..18) |i| {
        code[idx + i] = @intCast(i);
    }
    idx += 18;
    
    // PUSH18
    code[idx] = 0x71;
    for (1..19) |i| {
        code[idx + i] = @intCast(i);
    }
    idx += 19;
    
    // PUSH19
    code[idx] = 0x72;
    for (1..20) |i| {
        code[idx + i] = @intCast(i);
    }
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test PUSH17
    var result = try helpers.executeOpcode(0x70, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 18), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0102030405060708090A0B0C0D0E0F1011);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 18;
    
    // Test PUSH18
    result = try helpers.executeOpcode(0x71, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 19), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0102030405060708090A0B0C0D0E0F101112);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 37;
    
    // Test PUSH19
    result = try helpers.executeOpcode(0x72, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 20), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0102030405060708090A0B0C0D0E0F10111213);
}

test "PUSH20-PUSH24: Various sizes" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Create large code buffer
    var code: [150]u8 = undefined;
    var idx: usize = 0;
    
    // PUSH20 (0x73) - 20 bytes is common for addresses
    code[idx] = 0x73;
    for (1..21) |i| {
        code[idx + i] = @intCast(i);
    }
    idx += 21;
    
    // PUSH21 (0x74)
    code[idx] = 0x74;
    for (1..22) |i| {
        code[idx + i] = @intCast(i);
    }
    idx += 22;
    
    // PUSH22 (0x75)
    code[idx] = 0x75;
    for (1..23) |i| {
        code[idx + i] = @intCast(i);
    }
    idx += 23;
    
    // PUSH23 (0x76)
    code[idx] = 0x76;
    for (1..24) |i| {
        code[idx + i] = @intCast(i);
    }
    idx += 24;
    
    // PUSH24 (0x77)
    code[idx] = 0x77;
    for (1..25) |i| {
        code[idx + i] = @intCast(i);
    }
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test PUSH20
    var result = try helpers.executeOpcode(0x73, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 21), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0102030405060708090A0B0C0D0E0F1011121314);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 21;
    
    // Test PUSH21
    result = try helpers.executeOpcode(0x74, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 22), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0102030405060708090A0B0C0D0E0F101112131415);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 43;
    
    // Test PUSH22
    result = try helpers.executeOpcode(0x75, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 23), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0102030405060708090A0B0C0D0E0F10111213141516);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 66;
    
    // Test PUSH23
    result = try helpers.executeOpcode(0x76, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 24), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0102030405060708090A0B0C0D0E0F1011121314151617);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 90;
    
    // Test PUSH24
    result = try helpers.executeOpcode(0x77, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 25), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x0102030405060708090A0B0C0D0E0F101112131415161718);
}

test "PUSH25-PUSH31: Various sizes" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Test a few more sizes
    var code: [100]u8 = undefined;
    var idx: usize = 0;
    
    // PUSH25 (0x78)
    code[idx] = 0x78;
    for (1..26) |i| {
        code[idx + i] = @intCast(i % 256);
    }
    idx += 26;
    
    // PUSH30 (0x7D)
    code[idx] = 0x7D;
    for (1..31) |i| {
        code[idx + i] = @intCast(i % 256);
    }
    idx += 31;
    
    // PUSH31 (0x7E)
    code[idx] = 0x7E;
    for (1..32) |i| {
        code[idx + i] = @intCast(i % 256);
    }
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test PUSH25
    var result = try helpers.executeOpcode(0x78, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 26), result.bytes_consumed);
    const expected25: u256 = 0x0102030405060708090A0B0C0D0E0F10111213141516171819;
    try helpers.expectStackValue(test_frame.frame, 0, expected25);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 26;
    
    // Test PUSH30
    result = try helpers.executeOpcode(0x7D, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 31), result.bytes_consumed);
    const expected30: u256 = 0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E;
    try helpers.expectStackValue(test_frame.frame, 0, expected30);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 57;
    
    // Test PUSH31
    result = try helpers.executeOpcode(0x7E, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 32), result.bytes_consumed);
    const expected31: u256 = 0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F;
    try helpers.expectStackValue(test_frame.frame, 0, expected31);
}

test "PUSH32 (0x7F): Push full 32 bytes onto stack" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        // PUSH32 with all bytes different
        0x7F, 
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
        0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20,
        // PUSH32 with max value
        0x7F,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        // PUSH32 with zero
        0x7F,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Test first PUSH32
    var result = try helpers.executeOpcode(0x7F, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 33), result.bytes_consumed);
    const expected: u256 = 0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20;
    try helpers.expectStackValue(test_frame.frame, 0, expected);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 33;
    
    // Test PUSH32 with max value
    result = try helpers.executeOpcode(0x7F, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 33), result.bytes_consumed);
    const max_u256: u256 = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try helpers.expectStackValue(test_frame.frame, 0, max_u256);
    _ = try test_frame.popStack();
    test_frame.frame.pc = 66;
    
    // Test PUSH32 with zero
    result = try helpers.executeOpcode(0x7F, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 33), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

// ============================
// Gas consumption tests
// ============================

test "PUSH14-PUSH32: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Create bytecode with various PUSH operations
    var code: [500]u8 = undefined;
    var idx: usize = 0;
    
    // Add PUSH14 through PUSH32
    for (0x6D..0x80) |opcode| {
        code[idx] = @intCast(opcode);
        idx += 1;
        const bytes_to_push = opcode - 0x60 + 1;
        for (0..bytes_to_push) |_| {
            code[idx] = 0x00;
            idx += 1;
        }
    }
    
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
    
    var pc: usize = 0;
    for (0x6D..0x80) |opcode| {
        test_frame.frame.pc = pc;
        test_frame.frame.stack.clear();
        
        const gas_before = test_frame.frame.gas_remaining;
        const result = try helpers.executeOpcode(@intCast(opcode), &test_vm.vm, test_frame.frame);
        
        // All PUSH operations cost 3 gas (GasFastestStep)
        const gas_used = gas_before - test_frame.frame.gas_remaining;
        try testing.expectEqual(@as(u64, 3), gas_used);
        
        // Check bytes consumed
        const expected_bytes = (opcode - 0x60 + 1) + 1; // data bytes + opcode byte
        try testing.expectEqual(expected_bytes, result.bytes_consumed);
        
        pc += expected_bytes;
    }
}

// ============================
// Edge cases and special scenarios
// ============================

test "PUSH operations: Truncated data at end of code" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Test PUSH32 with only 10 bytes of data available
    const code = [_]u8{
        0x7F, // PUSH32
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A,
        // Missing 22 bytes - should be padded with zeros
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    const result = try helpers.executeOpcode(0x7F, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 33), result.bytes_consumed);
    
    // Should be 0x0102030405060708090A followed by 22 zeros
    const expected: u256 = 0x0102030405060708090A00000000000000000000000000000000000000000000;
    try helpers.expectStackValue(test_frame.frame, 0, expected);
}

test "PUSH20: Address pushing pattern" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // PUSH20 is commonly used for Ethereum addresses
    const code = [_]u8{
        0x73, // PUSH20
        // A typical Ethereum address (20 bytes)
        0xDE, 0xAD, 0xBE, 0xEF, 0xCA, 0xFE, 0xBA, 0xBE,
        0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0,
        0x11, 0x22, 0x33, 0x44,
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    const result = try helpers.executeOpcode(0x73, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 21), result.bytes_consumed);
    
    const expected_address: u256 = 0xDEADBEEFCAFEBABE123456789ABCDEF011223344;
    try helpers.expectStackValue(test_frame.frame, 0, expected_address);
}

test "PUSH32: Hash value pattern" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // PUSH32 is commonly used for hash values (32 bytes)
    const code = [_]u8{
        0x7F, // PUSH32
        // A typical hash pattern (32 bytes)
        0xAB, 0xCD, 0xEF, 0x01, 0x23, 0x45, 0x67, 0x89,
        0x9A, 0xBC, 0xDE, 0xF0, 0x12, 0x34, 0x56, 0x78,
        0x87, 0x65, 0x43, 0x21, 0x0F, 0xED, 0xCB, 0xA9,
        0x89, 0x67, 0x45, 0x23, 0x01, 0xEF, 0xCD, 0xAB,
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    const result = try helpers.executeOpcode(0x7F, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 33), result.bytes_consumed);
    
    const expected_hash: u256 = 0xABCDEF0123456789_9ABCDEF012345678_8765432110FEDCBA9_89674523_01EFCDAB;
    try helpers.expectStackValue(test_frame.frame, 0, expected_hash);
}

test "Large PUSH operations with stack near limit" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x7F, // PUSH32
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Fill stack to near capacity (1023 items)
    for (0..1023) |i| {
        try test_frame.pushStack(@intCast(i));
    }
    
    // One more PUSH32 should succeed (reaching limit of 1024)
    const result = try helpers.executeOpcode(0x7F, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 33), result.bytes_consumed);
    try testing.expectEqual(@as(usize, 1024), test_frame.frame.stack.size);
    
    // Clear one item to test overflow
    _ = try test_frame.popStack();
    
    // Fill to exactly 1024
    try test_frame.pushStack(&[_]u256{0});
    
    // Next PUSH should fail with stack overflow
    test_frame.frame.pc = 0;
    const overflow_result = helpers.executeOpcode(0x7F, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackOverflow, overflow_result);
}

test "PUSH operations sequence verification" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Create sequence: PUSH14, PUSH20, PUSH32
    const code = [_]u8{
        // PUSH14 - small value
        0x6D, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        // PUSH20 - address-like
        0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,
        // PUSH32 - full value
        0x7F, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03,
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Execute PUSH14
    var result = try helpers.executeOpcode(0x6D, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 15), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 1);
    test_frame.frame.pc = 15;
    
    // Execute PUSH20
    result = try helpers.executeOpcode(0x73, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 21), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 2);
    try helpers.expectStackValue(test_frame.frame, 1, 1);
    test_frame.frame.pc = 36;
    
    // Execute PUSH32
    result = try helpers.executeOpcode(0x7F, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 33), result.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 3);
    try helpers.expectStackValue(test_frame.frame, 1, 2);
    try helpers.expectStackValue(test_frame.frame, 2, 1);
    
    try testing.expectEqual(@as(usize, 3), test_frame.frame.stack.size);
}