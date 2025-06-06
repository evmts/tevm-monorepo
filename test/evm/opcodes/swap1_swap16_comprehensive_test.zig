const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// 0x90-0x9F: SWAP1 through SWAP16
// ============================

test "SWAP1 (0x90): Swap top two stack items" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{
        0x60, 0x01,    // PUSH1 0x01
        0x60, 0x02,    // PUSH1 0x02
        0x90,          // SWAP1
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
    
    // Execute PUSH1 0x01
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 2;
    
    // Execute PUSH1 0x02
    _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 4;
    
    // Stack should be [0x01, 0x02] (top is 0x02)
    try testing.expectEqual(@as(usize, 2), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 0x02);
    try helpers.expectStackValue(test_frame.frame, 1, 0x01);
    
    // Execute SWAP1
    const result = try helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // Stack should now be [0x02, 0x01] (swapped)
    try testing.expectEqual(@as(usize, 2), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 0x01); // Top
    try helpers.expectStackValue(test_frame.frame, 1, 0x02); // Bottom
}

test "SWAP2 (0x91): Swap 1st and 3rd stack items" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{0x91}; // SWAP2
    
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
    
    // Push three values
    try test_frame.pushStack(&[_]u256{0x11}); // Bottom
    try test_frame.pushStack(&[_]u256{0x22}); // Middle
    try test_frame.pushStack(&[_]u256{0x33}); // Top
    
    // Execute SWAP2
    const result = try helpers.executeOpcode(0x91, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // Stack should now be [0x33, 0x22, 0x11] -> [0x11, 0x22, 0x33]
    try testing.expectEqual(@as(usize, 3), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 0x11); // Top (was bottom)
    try helpers.expectStackValue(test_frame.frame, 1, 0x22); // Middle (unchanged)
    try helpers.expectStackValue(test_frame.frame, 2, 0x33); // Bottom (was top)
}

test "SWAP3-SWAP5: Various swaps" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{0x92, 0x93, 0x94}; // SWAP3, SWAP4, SWAP5
    
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
    
    // Push 6 distinct values
    for (1..7) |i| {
        try test_frame.pushStack(&[_]u256{i * 0x10}); // 0x10, 0x20, ..., 0x60
    }
    
    // Execute SWAP3 (swap top with 4th)
    test_frame.frame.pc = 0;
    std.debug.print("Before SWAP3:\n", .{});
    helpers.printStack(test_frame.frame);
    var result = try helpers.executeOpcode(0x92, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    std.debug.print("After SWAP3:\n", .{});
    helpers.printStack(test_frame.frame);
    // Stack was: [0x10, 0x20, 0x30, 0x40, 0x50, 0x60]
    // SWAP3 swaps top (0x60) with 4th from top (0x30)
    // Now: [0x10, 0x20, 0x60, 0x40, 0x50, 0x30]
    try helpers.expectStackValue(test_frame.frame, 0, 0x30);
    try helpers.expectStackValue(test_frame.frame, 3, 0x60);
    
    // Execute SWAP4 (swap new top with 5th)
    test_frame.frame.pc = 1;
    // Before SWAP4
    result = try helpers.executeOpcode(0x93, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    // After SWAP4
    // Stack was: [0x10, 0x20, 0x60, 0x40, 0x50, 0x30]
    // SWAP4 swaps top (0x30) with 5th from top (0x20)
    // Now: [0x10, 0x30, 0x60, 0x40, 0x50, 0x20]
    try helpers.expectStackValue(test_frame.frame, 0, 0x20);
    try helpers.expectStackValue(test_frame.frame, 4, 0x30);
    
    // Execute SWAP5 (swap new top with 6th)
    test_frame.frame.pc = 2;
    // Before SWAP5
    result = try helpers.executeOpcode(0x94, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    // After SWAP5
    // Stack was: [0x10, 0x30, 0x60, 0x40, 0x50, 0x20]
    // SWAP5 swaps top (0x20) with 6th from top (0x10)
    // Now: [0x20, 0x30, 0x60, 0x40, 0x50, 0x10]
    try helpers.expectStackValue(test_frame.frame, 0, 0x10);
    try helpers.expectStackValue(test_frame.frame, 5, 0x20);
}

test "SWAP6-SWAP10: Mid-range swaps" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{0x95, 0x96, 0x97, 0x98, 0x99}; // SWAP6-SWAP10
    
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
    
    // Push 11 distinct values
    for (0..11) |i| {
        try test_frame.pushStack(&[_]u256{0x100 + i}); // 0x100, 0x101, ..., 0x10A
    }
    
    // Execute SWAP6
    test_frame.frame.pc = 0;
    const result6 = try helpers.executeOpcode(0x95, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result6.bytes_consumed);
    try helpers.expectStackValue(test_frame.frame, 0, 0x104); // Was at position 6
    try helpers.expectStackValue(test_frame.frame, 6, 0x10A); // Was at top
    
    // Execute SWAP7
    test_frame.frame.pc = 1;
    _ = try helpers.executeOpcode(0x96, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x103); // Was at position 7
    
    // Execute SWAP8
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x97, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x102); // Was at position 8
    
    // Execute SWAP9
    test_frame.frame.pc = 3;
    _ = try helpers.executeOpcode(0x98, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x101); // Was at position 9
    
    // Execute SWAP10
    test_frame.frame.pc = 4;
    _ = try helpers.executeOpcode(0x99, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x100); // Was at position 10 (bottom)
}

test "SWAP11-SWAP16: High-range swaps" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{0x9A, 0x9B, 0x9C, 0x9D, 0x9E, 0x9F}; // SWAP11-SWAP16
    
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
    
    // Push 17 distinct values (need 17 for SWAP16)
    for (0..17) |i| {
        try test_frame.pushStack(&[_]u256{0x200 + i}); // 0x200-0x210
    }
    
    // Execute SWAP11
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x9A, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x205); // Was at position 11
    try helpers.expectStackValue(test_frame.frame, 11, 0x210); // Was at top
    
    // Execute SWAP12
    test_frame.frame.pc = 1;
    _ = try helpers.executeOpcode(0x9B, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x204); // Was at position 12
    
    // Execute SWAP13
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x9C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x203); // Was at position 13
    
    // Execute SWAP14
    test_frame.frame.pc = 3;
    _ = try helpers.executeOpcode(0x9D, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x202); // Was at position 14
    
    // Execute SWAP15
    test_frame.frame.pc = 4;
    _ = try helpers.executeOpcode(0x9E, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x201); // Was at position 15
    
    // Execute SWAP16
    test_frame.frame.pc = 5;
    _ = try helpers.executeOpcode(0x9F, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x200); // Was at position 16 (bottom)
    try helpers.expectStackValue(test_frame.frame, 16, 0x201); // Previous top value
}

test "SWAP16 (0x9F): Swap with 16th position (maximum)" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{0x9F}; // SWAP16
    
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
    
    // Push exactly 17 values (minimum for SWAP16)
    for (0..17) |i| {
        try test_frame.pushStack(&[_]u256{0xA00 + i});
    }
    
    // Before SWAP16: top is 0xA10, 16th position is 0xA00
    try helpers.expectStackValue(test_frame.frame, 0, 0xA10);
    try helpers.expectStackValue(test_frame.frame, 16, 0xA00);
    
    const result = try helpers.executeOpcode(0x9F, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // After SWAP16: positions should be swapped
    try helpers.expectStackValue(test_frame.frame, 0, 0xA00);
    try helpers.expectStackValue(test_frame.frame, 16, 0xA10);
}

// ============================
// Gas consumption tests
// ============================

test "SWAP1-SWAP16: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{
        0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97,
        0x98, 0x99, 0x9A, 0x9B, 0x9C, 0x9D, 0x9E, 0x9F,
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
    
    // Push 17 values to satisfy all SWAP operations
    for (0..17) |i| {
        try test_frame.pushStack(&[_]u256{@as(u256, @intCast(i))});
    }
    
    // Test each SWAP operation
    for (0..16) |i| {
        test_frame.frame.pc = i;
        const gas_before = test_frame.frame.gas_remaining;
        
        const opcode = @as(u8, @intCast(0x90 + i));
        const result = try helpers.executeOpcode(opcode, test_vm.vm, test_frame.frame);
        
        // All SWAP operations cost 3 gas (GasFastestStep)
        const gas_used = gas_before - test_frame.frame.gas_remaining;
        try testing.expectEqual(@as(u64, 3), gas_used);
        
        // All SWAP operations consume 1 byte
        try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    }
}

// ============================
// Edge cases and error conditions
// ============================

test "SWAP operations: Stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{0x90, 0x91, 0x95, 0x9F}; // SWAP1, SWAP2, SWAP6, SWAP16
    
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
    
    // Empty stack - SWAP1 should fail (needs 2 items)
    test_frame.frame.pc = 0;
    var result = helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
    
    // Push 1 value
    try test_frame.pushStack(&[_]u256{0x42});
    
    // SWAP1 still fails (needs 2 items)
    result = helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
    
    // Push another value
    try test_frame.pushStack(&[_]u256{0x43});
    
    // SWAP1 should succeed now (2 items)
    _ = try helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame);
    
    // SWAP2 should fail (needs 3 items, only have 2)
    test_frame.frame.pc = 1;
    result = helpers.executeOpcode(0x91, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
    
    // Push more values
    for (0..5) |i| {
        try test_frame.pushStack(&[_]u256{@as(u256, @intCast(i))});
    }
    
    // SWAP6 should succeed (have 7 items, need 7)
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x95, test_vm.vm, test_frame.frame);
    
    // SWAP16 should fail (have 7 items, need 17)
    test_frame.frame.pc = 3;
    result = helpers.executeOpcode(0x9F, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
}

test "SWAP operations: Sequential swaps" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{
        0x60, 0x01,    // PUSH1 0x01
        0x60, 0x02,    // PUSH1 0x02
        0x60, 0x03,    // PUSH1 0x03
        0x60, 0x04,    // PUSH1 0x04
        0x90,          // SWAP1
        0x91,          // SWAP2
        0x90,          // SWAP1
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
    for (0..4) |i| {
        test_frame.frame.pc = i * 2;
        _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame);
    }
    
    // Stack: [0x01, 0x02, 0x03, 0x04]
    try testing.expectEqual(@as(usize, 4), test_frame.frame.stack.size);
    
    // Execute first SWAP1
    test_frame.frame.pc = 8;
    _ = try helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame);
    // Stack: [0x01, 0x02, 0x04, 0x03]
    try helpers.expectStackValue(test_frame.frame, 0, 0x03);
    try helpers.expectStackValue(test_frame.frame, 1, 0x04);
    
    // Execute SWAP2
    test_frame.frame.pc = 9;
    _ = try helpers.executeOpcode(0x91, test_vm.vm, test_frame.frame);
    // Stack: [0x01, 0x03, 0x04, 0x02]
    try helpers.expectStackValue(test_frame.frame, 0, 0x02);
    try helpers.expectStackValue(test_frame.frame, 2, 0x03);
    
    // Execute second SWAP1
    test_frame.frame.pc = 10;
    _ = try helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame);
    // Stack: [0x01, 0x03, 0x02, 0x04]
    try helpers.expectStackValue(test_frame.frame, 0, 0x04);
    try helpers.expectStackValue(test_frame.frame, 1, 0x02);
}

test "SWAP operations: Pattern verification" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{0x90, 0x94, 0x98, 0x9C, 0x9F}; // SWAP1, SWAP5, SWAP9, SWAP13, SWAP16
    
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
    
    // Push a pattern of values (17 values for SWAP16)
    for (0..17) |i| {
        try test_frame.pushStack(&[_]u256{0xFF00 + i}); // 0xFF00-0xFF10
    }
    
    // Before any swaps, verify initial state
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF10); // Top
    try helpers.expectStackValue(test_frame.frame, 16, 0xFF00); // Bottom
    
    // SWAP1: swap top (0xFF10) with second (0xFF0F)
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF0F);
    try helpers.expectStackValue(test_frame.frame, 1, 0xFF10);
    
    // SWAP5: swap new top (0xFF0F) with 6th position (0xFF0B)
    test_frame.frame.pc = 1;
    _ = try helpers.executeOpcode(0x94, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF0B);
    try helpers.expectStackValue(test_frame.frame, 5, 0xFF0F);
    
    // SWAP9: swap new top (0xFF0B) with 10th position (0xFF07)
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x98, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF07);
    try helpers.expectStackValue(test_frame.frame, 9, 0xFF0B);
    
    // SWAP13: swap new top (0xFF07) with 14th position (0xFF03)
    test_frame.frame.pc = 3;
    _ = try helpers.executeOpcode(0x9C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF03);
    try helpers.expectStackValue(test_frame.frame, 13, 0xFF07);
    
    // SWAP16: swap new top (0xFF03) with 17th position (0xFF00)
    test_frame.frame.pc = 4;
    _ = try helpers.executeOpcode(0x9F, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xFF00);
    try helpers.expectStackValue(test_frame.frame, 16, 0xFF03);
}

test "SWAP operations: Boundary test with exact stack size" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{0x90, 0x9F}; // SWAP1, SWAP16
    
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
    
    // Test SWAP1 with exactly 2 items
    try test_frame.pushStack(&[_]u256{0xAA});
    try test_frame.pushStack(&[_]u256{0xBB});
    
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0xAA);
    try helpers.expectStackValue(test_frame.frame, 1, 0xBB);
    
    // Clear stack
    test_frame.frame.stack.clear();
    
    // Test SWAP16 with exactly 17 items
    for (1..18) |i| {
        try test_frame.pushStack(&[_]u256{@as(u256, @intCast(i))});
    }
    
    test_frame.frame.pc = 1;
    _ = try helpers.executeOpcode(0x9F, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // Swapped with bottom
    try helpers.expectStackValue(test_frame.frame, 16, 17); // Was top
    
    // Test SWAP16 with 16 items (should fail)
    test_frame.frame.stack.clear();
    for (1..17) |i| {
        try test_frame.pushStack(&[_]u256{@as(u256, @intCast(i))});
    }
    const result = helpers.executeOpcode(0x9F, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
}

test "SWAP operations: No side effects" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{0x92}; // SWAP3
    
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
    
    // Push 5 values
    try test_frame.pushStack(&[_]u256{0x11});
    try test_frame.pushStack(&[_]u256{0x22});
    try test_frame.pushStack(&[_]u256{0x33});
    try test_frame.pushStack(&[_]u256{0x44});
    try test_frame.pushStack(&[_]u256{0x55});
    
    std.debug.print("Before SWAP3:\n", .{});
    helpers.printStack(test_frame.frame);
    
    // Execute SWAP3
    _ = try helpers.executeOpcode(0x92, test_vm.vm, test_frame.frame);
    
    std.debug.print("After SWAP3:\n", .{});
    helpers.printStack(test_frame.frame);
    
    // Verify only positions 0 and 3 were swapped
    try helpers.expectStackValue(test_frame.frame, 0, 0x22); // Was at position 3
    try helpers.expectStackValue(test_frame.frame, 1, 0x44); // Unchanged
    try helpers.expectStackValue(test_frame.frame, 2, 0x33); // Unchanged  
    try helpers.expectStackValue(test_frame.frame, 3, 0x55); // Was at position 0
    try helpers.expectStackValue(test_frame.frame, 4, 0x11); // Unchanged
    
    // Stack size should remain the same
    try testing.expectEqual(@as(usize, 5), test_frame.frame.stack.size);
}