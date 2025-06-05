const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// 0xA0-0xA4: LOG0 through LOG4
// ============================

test "LOG0 (0xA0): Emit log with no topics" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x60, 0x20,    // PUSH1 0x20 (size = 32 bytes)
        0x60, 0x00,    // PUSH1 0x00 (offset = 0)
        0xA0,          // LOG0
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
    
    // Write some data to memory
    const test_data = "Hello, Ethereum logs!";
    const padded_data = test_data ++ ([_]u8{0} ** (32 - test_data.len));
    _ = try test_frame.frame.memory.set_data(0, padded_data);
    
    // Execute the push operations
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 4;
    
    // Execute LOG0
    const result = try helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // Check that log was emitted
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
    const log = test_vm.vm.logs.items[0];
    try testing.expectEqualSlices(u8, &helpers.TestAddresses.CONTRACT, &log.address);
    try testing.expectEqual(@as(usize, 0), log.topics.len); // No topics for LOG0
    try testing.expectEqualSlices(u8, padded_data, log.data);
}

test "LOG1 (0xA1): Emit log with one topic" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x7F,          // PUSH32 topic (ERC20 Transfer event signature)
        0xDD, 0xF2, 0x52, 0xAD, 0x1B, 0xE2, 0xC8, 0x9B,
        0x69, 0xC2, 0xB0, 0x68, 0xFC, 0x37, 0x8D, 0xAA,
        0x95, 0x2B, 0xA7, 0xF1, 0x63, 0xC4, 0xA1, 0x16,
        0x28, 0xF5, 0x5A, 0x4D, 0xF5, 0x23, 0xB3, 0xEF,
        0x60, 0x10,    // PUSH1 0x10 (size = 16 bytes)
        0x60, 0x20,    // PUSH1 0x20 (offset = 32)
        0xA1,          // LOG1
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
    
    // Write some data to memory at offset 32
    const test_data: [16]u8 = .{ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10 };
    _ = try test_frame.frame.memory.set_data(32, &test_data);
    
    // Execute push operations
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x7F, &test_vm.vm, test_frame.frame);  // PUSH32 topic
    test_frame.frame.pc = 33;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);  // PUSH1 size
    test_frame.frame.pc = 35;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);  // PUSH1 offset
    test_frame.frame.pc = 37;
    
    // Execute LOG1
    const result = try helpers.executeOpcode(0xA1, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // Check log
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
    const log = test_vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 1), log.topics.len);
    try testing.expectEqual(@as(u256, 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF), log.topics[0]);
    try testing.expectEqualSlices(u8, &test_data, log.data);
}

test "LOG2-LOG4: Multiple topics" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        // Setup for LOG2
        0x60, 0xBB,    // PUSH1 0xBB (topic2)
        0x60, 0xAA,    // PUSH1 0xAA (topic1)
        0x60, 0x08,    // PUSH1 0x08 (size)
        0x60, 0x00,    // PUSH1 0x00 (offset)
        0xA2,          // LOG2
        
        // Setup for LOG3
        0x60, 0xEE,    // PUSH1 0xEE (topic3)
        0x60, 0xDD,    // PUSH1 0xDD (topic2)
        0x60, 0xCC,    // PUSH1 0xCC (topic1)
        0x60, 0x08,    // PUSH1 0x08 (size)
        0x60, 0x08,    // PUSH1 0x08 (offset)
        0xA3,          // LOG3
        
        // Setup for LOG4
        0x60, 0x44,    // PUSH1 0x44 (topic4)
        0x60, 0x33,    // PUSH1 0x33 (topic3)
        0x60, 0x22,    // PUSH1 0x22 (topic2)
        0x60, 0x11,    // PUSH1 0x11 (topic1)
        0x60, 0x08,    // PUSH1 0x08 (size)
        0x60, 0x10,    // PUSH1 0x10 (offset)
        0xA4,          // LOG4
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
    
    // Write test data to memory
    const data1: [8]u8 = .{ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08 };
    const data2: [8]u8 = .{ 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18 };
    const data3: [8]u8 = .{ 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28 };
    _ = try test_frame.frame.memory.set_data(0, &data1);
    _ = try test_frame.frame.memory.set_data(8, &data2);
    _ = try test_frame.frame.memory.set_data(16, &data3);
    
    // Execute LOG2
    test_frame.frame.pc = 0;
    for (0..4) |_| {
        _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
        test_frame.frame.pc += 2;
    }
    _ = try helpers.executeOpcode(0xA2, &test_vm.vm, test_frame.frame);
    
    // Clear stack before LOG3
    test_frame.frame.stack.clear();
    
    // Execute LOG3 - PC should be at 9 (4 PUSH1s * 2 bytes + LOG2)
    test_frame.frame.pc = 9;
    for (0..5) |_| {
        _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
        test_frame.frame.pc += 2;
    }
    _ = try helpers.executeOpcode(0xA3, &test_vm.vm, test_frame.frame);
    
    // Clear stack before LOG4
    test_frame.frame.stack.clear();
    
    // Execute LOG4 - PC should be at 20 (9 + 5 PUSH1s * 2 bytes + LOG3)
    test_frame.frame.pc = 20;
    for (0..6) |_| {
        _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
        test_frame.frame.pc += 2;
    }
    _ = try helpers.executeOpcode(0xA4, &test_vm.vm, test_frame.frame);
    
    // Verify all logs
    try testing.expectEqual(@as(usize, 3), test_vm.vm.logs.items.len);
    
    // Check LOG2
    const log2 = test_vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 2), log2.topics.len);
    try testing.expectEqual(@as(u256, 0xAA), log2.topics[0]); // First pushed = first topic
    try testing.expectEqual(@as(u256, 0xBB), log2.topics[1]); // Last pushed = second topic
    try testing.expectEqualSlices(u8, &data1, log2.data);
    
    // Check LOG3
    const log3 = test_vm.vm.logs.items[1];
    try testing.expectEqual(@as(usize, 3), log3.topics.len);
    try testing.expectEqual(@as(u256, 0xCC), log3.topics[0]); // First pushed = first topic
    try testing.expectEqual(@as(u256, 0xDD), log3.topics[1]); // Middle pushed = second topic
    try testing.expectEqual(@as(u256, 0xEE), log3.topics[2]); // Last pushed = third topic
    try testing.expectEqualSlices(u8, &data2, log3.data);
    
    // Check LOG4
    const log4 = test_vm.vm.logs.items[2];
    try testing.expectEqual(@as(usize, 4), log4.topics.len);
    try testing.expectEqual(@as(u256, 0x11), log4.topics[0]); // First pushed = first topic
    try testing.expectEqual(@as(u256, 0x22), log4.topics[1]); // Second pushed = second topic
    try testing.expectEqual(@as(u256, 0x33), log4.topics[2]); // Third pushed = third topic
    try testing.expectEqual(@as(u256, 0x44), log4.topics[3]); // Last pushed = fourth topic
    try testing.expectEqualSlices(u8, &data3, log4.data);
}

// ============================
// Gas consumption tests
// ============================

test "LOG0-LOG4: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xA0, 0xA1, 0xA2, 0xA3, 0xA4}; // LOG0-LOG4
    
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
    
    // Test LOG0 gas consumption
    try test_frame.pushStack(&[_]u256{32});    // size (32 bytes)
    try test_frame.pushStack(&[_]u256{0});     // offset
    
    test_frame.frame.pc = 0;
    const gas_before_log0 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    const gas_used_log0 = gas_before_log0 - test_frame.frame.gas_remaining;
    
    // LOG0 gas = 375 (base) + 8*32 (data) + memory expansion
    // Memory expansion from 0 to 32 bytes (1 word) = 3
    try testing.expectEqual(@as(u64, 375 + 256 + 3), gas_used_log0);
    
    // Test LOG1 gas consumption
    try test_frame.pushStack(&[_]u256{0x123}); // topic
    try test_frame.pushStack(&[_]u256{16});    // size (16 bytes)
    try test_frame.pushStack(&[_]u256{0});     // offset
    
    test_frame.frame.pc = 1;
    const gas_before_log1 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0xA1, &test_vm.vm, test_frame.frame);
    const gas_used_log1 = gas_before_log1 - test_frame.frame.gas_remaining;
    
    // LOG1 gas = 375 (base) + 375 (1 topic) + 8*16 (data) + 0 (no new memory)
    try testing.expectEqual(@as(u64, 375 + 375 + 128), gas_used_log1);
    
    // Test LOG4 gas consumption (empty data)
    try test_frame.pushStack(&[_]u256{0x111}); // topic1
    try test_frame.pushStack(&[_]u256{0x222}); // topic2
    try test_frame.pushStack(&[_]u256{0x333}); // topic3
    try test_frame.pushStack(&[_]u256{0x444}); // topic4
    try test_frame.pushStack(&[_]u256{0});     // size (0 bytes - empty data)
    try test_frame.pushStack(&[_]u256{0});     // offset
    
    test_frame.frame.pc = 4;
    const gas_before_log4 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0xA4, &test_vm.vm, test_frame.frame);
    const gas_used_log4 = gas_before_log4 - test_frame.frame.gas_remaining;
    
    // LOG4 gas = 375 (base) + 375*4 (4 topics) + 0 (no data) + 0 (no memory)
    try testing.expectEqual(@as(u64, 375 + 1500), gas_used_log4);
}

// ============================
// Edge cases and error conditions
// ============================

test "LOG operations: Static call protection" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x60, 0x00,    // PUSH1 0x00 (offset)
        0x60, 0x00,    // PUSH1 0x00 (size)
        0xA0,          // LOG0
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
    
    // Set static mode
    test_frame.frame.is_static = true;
    
    // Push parameters
    try test_frame.pushStack(&[_]u256{0}); // size
    try test_frame.pushStack(&[_]u256{0}); // offset
    
    // LOG0 should fail with WriteProtection error
    test_frame.frame.pc = 4;
    const result = helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.WriteProtection, result);
    
    // Test all LOG opcodes in static mode
    const log_opcodes = [_]u8{0xA0, 0xA1, 0xA2, 0xA3, 0xA4};
    for (log_opcodes) |opcode| {
        // Reset stack
        test_frame.frame.stack.clear();
        
        // Push required parameters
        try test_frame.pushStack(&[_]u256{0}); // size
        try test_frame.pushStack(&[_]u256{0}); // offset
        
        // Push topics if needed
        const num_topics = opcode - 0xA0;
        for (0..num_topics) |_| {
            try test_frame.pushStack(&[_]u256{0});
        }
        
        const res = helpers.executeOpcode(opcode, &test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.WriteProtection, res);
    }
}

test "LOG operations: Stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xA0, 0xA1, 0xA2, 0xA3, 0xA4}; // All LOG opcodes
    
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
    
    // Test LOG0 with insufficient stack (needs 2)
    test_frame.frame.pc = 0;
    var result = helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
    
    try test_frame.pushStack(&[_]u256{0});
    result = helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
    
    // Test LOG4 with insufficient stack (needs 6)
    test_frame.frame.stack.clear();
    for (0..5) |_| {
        try test_frame.pushStack(&[_]u256{0});
    }
    test_frame.frame.pc = 4;
    result = helpers.executeOpcode(0xA4, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
}

test "LOG operations: Empty data" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x60, 0x42,    // PUSH1 0x42 (topic)
        0x60, 0x00,    // PUSH1 0x00 (size = 0)
        0x60, 0xFF,    // PUSH1 0xFF (offset - doesn't matter)
        0xA1,          // LOG1
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
    
    // Execute push operations
    for (0..3) |i| {
        test_frame.frame.pc = i * 2;
        _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    }
    
    // Execute LOG1 with empty data
    test_frame.frame.pc = 6;
    const result = try helpers.executeOpcode(0xA1, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    // Check log has empty data
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
    const log = test_vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 0), log.data.len);
    try testing.expectEqual(@as(u256, 0x42), log.topics[0]);
}

test "LOG operations: Large memory offset" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0xA0}; // LOG0
    
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
    
    // Push large offset and size (bottom to top: size, offset)
    try test_frame.pushStack(&[_]u256{0x20});   // size = 32
    try test_frame.pushStack(&[_]u256{0x1000}); // offset = 4096
    
    const gas_before = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    
    // Should include memory expansion cost
    // Memory words = (4096 + 32 + 31) / 32 = 129 words
    // Memory cost = 3 * 129 + (129 * 129) / 512 = 387 + 32 = 419
    // Total = 375 (base) + 256 (32 bytes * 8) + 419 (memory) = 1050
    try testing.expect(gas_used > 1000); // Significant gas for memory expansion
    
    // Check log was created
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
}

test "LOG operations: ERC20 Transfer event pattern" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        // ERC20 Transfer(from, to, amount) - LOG3
        // Push in reverse order: to, from, signature, size, offset
        0x73,          // PUSH20 (to address - topic3)
        0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22,
        0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22, 0x22,
        0x73,          // PUSH20 (from address - topic2)
        0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11,
        0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11,
        0x7F,          // PUSH32 (Transfer event signature - topic1)
        0xDD, 0xF2, 0x52, 0xAD, 0x1B, 0xE2, 0xC8, 0x9B,
        0x69, 0xC2, 0xB0, 0x68, 0xFC, 0x37, 0x8D, 0xAA,
        0x95, 0x2B, 0xA7, 0xF1, 0x63, 0xC4, 0xA1, 0x16,
        0x28, 0xF5, 0x5A, 0x4D, 0xF5, 0x23, 0xB3, 0xEF,
        0x60, 0x20,    // PUSH1 0x20 (size = 32 bytes for amount)
        0x60, 0x00,    // PUSH1 0x00 (offset = 0)
        0xA3,          // LOG3
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
    
    // Write amount to memory (1000 tokens = 0x3E8)
    var amount_data: [32]u8 = [_]u8{0} ** 32;
    amount_data[31] = 0xE8;
    amount_data[30] = 0x03;
    _ = try test_frame.frame.memory.set_data(0, &amount_data);
    
    // Execute all push operations in new order
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x73, &test_vm.vm, test_frame.frame); // to address
    test_frame.frame.pc = 21;
    _ = try helpers.executeOpcode(0x73, &test_vm.vm, test_frame.frame); // from address
    test_frame.frame.pc = 42;
    _ = try helpers.executeOpcode(0x7F, &test_vm.vm, test_frame.frame); // signature
    test_frame.frame.pc = 75;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame); // size
    test_frame.frame.pc = 77;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame); // offset
    test_frame.frame.pc = 79;
    
    // Execute LOG3
    _ = try helpers.executeOpcode(0xA3, &test_vm.vm, test_frame.frame);
    
    // Verify Transfer event
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
    const log = test_vm.vm.logs.items[0];
    
    // Check topics - LOG stores topics in push order after reversing pops
    try testing.expectEqual(@as(usize, 3), log.topics.len);
    try testing.expectEqual(@as(u256, 0xDDF252AD1BE2C89B69C2B068FC378DAA952BA7F163C4A11628F55A4DF523B3EF), log.topics[0]); // Transfer signature
    try testing.expectEqual(@as(u256, 0x1111111111111111111111111111111111111111), log.topics[1]); // from
    try testing.expectEqual(@as(u256, 0x2222222222222222222222222222222222222222), log.topics[2]); // to
    
    // Check data (amount)
    try testing.expectEqualSlices(u8, &amount_data, log.data);
}

test "LOG operations: Multiple logs in sequence" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        // First LOG0
        0x60, 0x04,    // PUSH1 0x04 (size)
        0x60, 0x00,    // PUSH1 0x00 (offset)
        0xA0,          // LOG0
        
        // Second LOG1
        0x60, 0x99,    // PUSH1 0x99 (topic)
        0x60, 0x04,    // PUSH1 0x04 (size)
        0x60, 0x04,    // PUSH1 0x04 (offset)
        0xA1,          // LOG1
        
        // Third LOG0
        0x60, 0x04,    // PUSH1 0x04 (size)
        0x60, 0x08,    // PUSH1 0x08 (offset)
        0xA0,          // LOG0
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
    
    // Write data to memory
    _ = try test_frame.frame.memory.set_data(0, &[_]u8{ 0xAA, 0xBB, 0xCC, 0xDD });
    _ = try test_frame.frame.memory.set_data(4, &[_]u8{ 0x11, 0x22, 0x33, 0x44 });
    _ = try test_frame.frame.memory.set_data(8, &[_]u8{ 0xFF, 0xEE, 0xDD, 0xCC });
    
    // Execute first LOG0
    for (0..2) |i| {
        test_frame.frame.pc = i * 2;
        _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    }
    test_frame.frame.pc = 4;
    _ = try helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    
    // Execute LOG1
    for (0..3) |i| {
        test_frame.frame.pc = 5 + i * 2;
        _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    }
    test_frame.frame.pc = 11;
    _ = try helpers.executeOpcode(0xA1, &test_vm.vm, test_frame.frame);
    
    // Execute second LOG0
    for (0..2) |i| {
        test_frame.frame.pc = 12 + i * 2;
        _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    }
    test_frame.frame.pc = 16;
    _ = try helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    
    // Verify all logs
    try testing.expectEqual(@as(usize, 3), test_vm.vm.logs.items.len);
    
    // First LOG0
    try testing.expectEqual(@as(usize, 0), test_vm.vm.logs.items[0].topics.len);
    try testing.expectEqualSlices(u8, &[_]u8{ 0xAA, 0xBB, 0xCC, 0xDD }, test_vm.vm.logs.items[0].data);
    
    // LOG1
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items[1].topics.len);
    try testing.expectEqual(@as(u256, 0x99), test_vm.vm.logs.items[1].topics[0]);
    try testing.expectEqualSlices(u8, &[_]u8{ 0x11, 0x22, 0x33, 0x44 }, test_vm.vm.logs.items[1].data);
    
    // Second LOG0
    try testing.expectEqual(@as(usize, 0), test_vm.vm.logs.items[2].topics.len);
    try testing.expectEqualSlices(u8, &[_]u8{ 0xFF, 0xEE, 0xDD, 0xCC }, test_vm.vm.logs.items[2].data);
}