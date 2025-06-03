const std = @import("std");
const testing = std.testing;
const test_helpers = @import("../opcodes/test_helpers.zig");
const opcodes = @import("../../../src/evm/opcodes/package.zig");
const ExecutionError = opcodes.ExecutionError;

// Test ERC20 Transfer event pattern
test "Integration: ERC20 Transfer event logging" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Transfer event: Transfer(address indexed from, address indexed to, uint256 value)
    // Event signature hash (topic0)
    const transfer_sig: u256 = 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef;
    
    // Prepare event data
    const from_address: u256 = test_helpers.to_u256(test_helpers.TEST_ADDRESS_1);
    const to_address: u256 = test_helpers.to_u256(test_helpers.TEST_ADDRESS_2);
    const amount: u256 = 1000;
    
    // Write amount to memory (non-indexed data)
    var amount_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &amount_bytes, amount, .big);
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        try frame.memory.write_byte(i, amount_bytes[i]);
    }
    
    // Push topics in reverse order (to_address, from_address, signature)
    try frame.pushValue(to_address);
    try frame.pushValue(from_address);
    try frame.pushValue(transfer_sig);
    
    // Push data location
    try frame.pushValue(32); // size (32 bytes for uint256)
    try frame.pushValue(0);  // offset
    
    // Execute LOG3 (3 topics)
    try test_helpers.executeOpcode(opcodes.log.op_log3, &frame);
    
    // Verify log was emitted
    try testing.expectEqual(@as(usize, 1), vm.vm.logs.items.len);
    
    const log = vm.vm.logs.items[0];
    try testing.expectEqual(test_helpers.TEST_CONTRACT_ADDRESS, log.address);
    try testing.expectEqual(@as(usize, 3), log.topics.len);
    try testing.expectEqual(transfer_sig, log.topics[0]);
    try testing.expectEqual(from_address, log.topics[1]);
    try testing.expectEqual(to_address, log.topics[2]);
    try testing.expectEqual(@as(usize, 32), log.data.len);
}

// Test multiple events in sequence
test "Integration: multiple event emissions" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Emit event 1: Simple notification (LOG0)
    const data1 = [_]u8{ 0x01, 0x02, 0x03, 0x04 };
    var i: usize = 0;
    while (i < data1.len) : (i += 1) {
        try frame.memory.write_byte(i, data1[i]);
    }
    
    try frame.pushValue(4); // size
    try frame.pushValue(0); // offset
    try test_helpers.executeOpcode(opcodes.log.op_log0, &frame);
    
    // Emit event 2: Indexed event (LOG1)
    const topic1: u256 = 0x1234567890ABCDEF;
    const data2 = [_]u8{ 0xAA, 0xBB };
    i = 0;
    while (i < data2.len) : (i += 1) {
        try frame.memory.write_byte(100 + i, data2[i]);
    }
    
    try frame.pushValue(topic1);
    try frame.pushValue(2);   // size
    try frame.pushValue(100); // offset
    try test_helpers.executeOpcode(opcodes.log.op_log1, &frame);
    
    // Emit event 3: Complex event (LOG4)
    const topic2: u256 = 0x2222222222222222;
    const topic3: u256 = 0x3333333333333333;
    const topic4: u256 = 0x4444444444444444;
    
    try frame.pushValue(topic4);
    try frame.pushValue(topic3);
    try frame.pushValue(topic2);
    try frame.pushValue(topic1);
    try frame.pushValue(0); // size (empty data)
    try frame.pushValue(0); // offset
    try test_helpers.executeOpcode(opcodes.log.op_log4, &frame);
    
    // Verify all logs
    try testing.expectEqual(@as(usize, 3), vm.vm.logs.items.len);
    
    // Check first log
    try testing.expectEqual(@as(usize, 0), vm.vm.logs.items[0].topics.len);
    try testing.expectEqualSlices(u8, &data1, vm.vm.logs.items[0].data);
    
    // Check second log
    try testing.expectEqual(@as(usize, 1), vm.vm.logs.items[1].topics.len);
    try testing.expectEqual(topic1, vm.vm.logs.items[1].topics[0]);
    try testing.expectEqualSlices(u8, &data2, vm.vm.logs.items[1].data);
    
    // Check third log
    try testing.expectEqual(@as(usize, 4), vm.vm.logs.items[2].topics.len);
    try testing.expectEqual(topic1, vm.vm.logs.items[2].topics[0]);
    try testing.expectEqual(topic2, vm.vm.logs.items[2].topics[1]);
    try testing.expectEqual(topic3, vm.vm.logs.items[2].topics[2]);
    try testing.expectEqual(topic4, vm.vm.logs.items[2].topics[3]);
    try testing.expectEqual(@as(usize, 0), vm.vm.logs.items[2].data.len);
}

// Test event with dynamic data
test "Integration: event with dynamic array data" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Simulate logging a dynamic array
    // In Solidity: event DataLogged(uint256 indexed id, bytes data);
    
    const event_id: u256 = 42;
    const event_sig: u256 = 0xAAAABBBBCCCCDDDD; // Hypothetical signature
    
    // Dynamic data encoding (offset, length, data)
    // For simplicity, just log the actual data part
    const dynamic_data = [_]u8{
        'H', 'e', 'l', 'l', 'o', ',', ' ', 'W', 'o', 'r', 'l', 'd', '!', 0, 0, 0
    };
    
    // Write to memory
    var i: usize = 0;
    while (i < dynamic_data.len) : (i += 1) {
        try frame.memory.write_byte(i, dynamic_data[i]);
    }
    
    // Push topics
    try frame.pushValue(event_id);
    try frame.pushValue(event_sig);
    
    // Push data info
    try frame.pushValue(16); // size (padded to 16)
    try frame.pushValue(0);  // offset
    
    // Execute LOG2
    try test_helpers.executeOpcode(opcodes.log.op_log2, &frame);
    
    // Verify
    try testing.expectEqual(@as(usize, 1), vm.vm.logs.items.len);
    const log = vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 2), log.topics.len);
    try testing.expectEqual(event_sig, log.topics[0]);
    try testing.expectEqual(event_id, log.topics[1]);
    try testing.expectEqual(@as(usize, 16), log.data.len);
}

// Test gas consumption for logging
test "Integration: log gas consumption patterns" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 50000;
    
    // Test 1: LOG0 with small data
    const small_data = [_]u8{ 0x01, 0x02, 0x03, 0x04 };
    var i: usize = 0;
    while (i < small_data.len) : (i += 1) {
        try frame.memory.write_byte(i, small_data[i]);
    }
    
    try frame.pushValue(4); // size
    try frame.pushValue(0); // offset
    
    const gas_before_log0 = frame.frame.gas_remaining;
    try test_helpers.executeOpcode(opcodes.log.op_log0, &frame);
    
    const log0_gas = gas_before_log0 - frame.frame.gas_remaining;
    // LOG0 base: 375, data: 8 * 4 = 32, total: 407
    try testing.expectEqual(@as(u64, 375 + 32), log0_gas);
    
    // Test 2: LOG4 with larger data
    const large_data_size: usize = 64;
    i = 0;
    while (i < large_data_size) : (i += 1) {
        try frame.memory.write_byte(100 + i, @intCast(i));
    }
    
    try frame.pushValue(0x4444);
    try frame.pushValue(0x3333);
    try frame.pushValue(0x2222);
    try frame.pushValue(0x1111);
    try frame.pushValue(large_data_size); // size
    try frame.pushValue(100);              // offset
    
    const gas_before_log4 = frame.frame.gas_remaining;
    try test_helpers.executeOpcode(opcodes.log.op_log4, &frame);
    
    const log4_gas = gas_before_log4 - frame.frame.gas_remaining;
    // LOG4 base: 375, topics: 375 * 4 = 1500, data: 8 * 64 = 512, total: 2387
    try testing.expectEqual(@as(u64, 375 + 1500 + 512), log4_gas);
}

// Test logging in static context fails
test "Integration: logging restrictions in static calls" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Enter static context
    frame.frame.is_static = true;
    
    // Try LOG0
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    
    var result = test_helpers.executeOpcode(opcodes.log.op_log0, &frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
    
    // Try LOG1
    frame.stack.clearRetainingCapacity();
    try frame.pushValue(0x1234); // topic
    try frame.pushValue(0);      // size
    try frame.pushValue(0);      // offset
    
    result = test_helpers.executeOpcode(opcodes.log.op_log1, &frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
    
    // Verify no logs were emitted
    try testing.expectEqual(@as(usize, 0), vm.vm.logs.items.len);
}

// Test bloom filter pattern (conceptual)
test "Integration: event topics for bloom filter" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Emit events that would be used for bloom filters
    // Topic patterns that represent different event types
    
    const token_transfer_sig: u256 = 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef;
    const approval_sig: u256 = 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925;
    const mint_sig: u256 = 0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885;
    
    // Emit Transfer event
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_2)); // to
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // from
    try frame.pushValue(token_transfer_sig);
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    try test_helpers.executeOpcode(opcodes.log.op_log3, &frame);
    
    // Emit Approval event
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_3)); // spender
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // owner
    try frame.pushValue(approval_sig);
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    try test_helpers.executeOpcode(opcodes.log.op_log3, &frame);
    
    // Emit Mint event
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_2)); // to
    try frame.pushValue(mint_sig);
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    try test_helpers.executeOpcode(opcodes.log.op_log2, &frame);
    
    // Verify all events were logged
    try testing.expectEqual(@as(usize, 3), vm.vm.logs.items.len);
    
    // Each log can be used to construct bloom filters for efficient filtering
    var signatures = std.AutoHashMap(u256, bool).init(testing.allocator);
    defer signatures.deinit();
    
    for (vm.vm.logs.items) |log| {
        if (log.topics.len > 0) {
            try signatures.put(log.topics[0], true);
        }
    }
    
    // Verify we have all three unique signatures
    try testing.expect(signatures.contains(token_transfer_sig));
    try testing.expect(signatures.contains(approval_sig));
    try testing.expect(signatures.contains(mint_sig));
}

// Test memory expansion for log data
test "Integration: log memory expansion costs" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 100000;
    
    // Log with data at high memory offset (causes expansion)
    try frame.pushValue(32);   // size
    try frame.pushValue(1000); // high offset - requires memory expansion
    
    const gas_before = frame.frame.gas_remaining;
    try test_helpers.executeOpcode(opcodes.log.op_log0, &frame);
    
    const gas_used = gas_before - frame.frame.gas_remaining;
    
    // Should include memory expansion cost
    const log_base_cost = 375;
    const log_data_cost = 8 * 32; // 256
    const min_expected = log_base_cost + log_data_cost;
    
    // Gas used should be more than just log costs due to memory expansion
    try testing.expect(gas_used > min_expected);
}

// Test complex event filtering scenario
test "Integration: event filtering by topics" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Emit various events with different topic patterns
    const event_type_1: u256 = 0x1111111111111111;
    const event_type_2: u256 = 0x2222222222222222;
    const sender_1: u256 = 0xAAAAAAAAAAAAAAAA;
    const sender_2: u256 = 0xBBBBBBBBBBBBBBBB;
    
    // Event 1: Type1 from Sender1
    try frame.pushValue(sender_1);
    try frame.pushValue(event_type_1);
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    try test_helpers.executeOpcode(opcodes.log.op_log2, &frame);
    
    // Event 2: Type1 from Sender2
    try frame.pushValue(sender_2);
    try frame.pushValue(event_type_1);
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    try test_helpers.executeOpcode(opcodes.log.op_log2, &frame);
    
    // Event 3: Type2 from Sender1
    try frame.pushValue(sender_1);
    try frame.pushValue(event_type_2);
    try frame.pushValue(0); // size
    try frame.pushValue(0); // offset
    try test_helpers.executeOpcode(opcodes.log.op_log2, &frame);
    
    // Count events by type
    var type1_count: usize = 0;
    var type2_count: usize = 0;
    var sender1_count: usize = 0;
    
    for (vm.vm.logs.items) |log| {
        if (log.topics.len >= 1) {
            if (log.topics[0] == event_type_1) type1_count += 1;
            if (log.topics[0] == event_type_2) type2_count += 1;
        }
        if (log.topics.len >= 2) {
            if (log.topics[1] == sender_1) sender1_count += 1;
        }
    }
    
    try testing.expectEqual(@as(usize, 2), type1_count);
    try testing.expectEqual(@as(usize, 1), type2_count);
    try testing.expectEqual(@as(usize, 2), sender1_count);
}