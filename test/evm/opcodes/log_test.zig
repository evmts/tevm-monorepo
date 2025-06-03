const std = @import("std");
const testing = std.testing;
const test_helpers = @import("test_helpers.zig");
const evm = @import("evm");
const log = evm.opcodes.log;

// Test LOG0 operation
test "LOG0: emit log with no topics" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Write data to memory
    const log_data = [_]u8{ 0x11, 0x22, 0x33, 0x44 };
    var i: usize = 0;
    while (i < log_data.len) : (i += 1) {
        try test_frame.frame.memory.set_byte(i, log_data[i]);
    }
    
    // Push offset and length
    try test_frame.pushStack(&[_]u256{0, 4}); // offset, length
    
    // Execute LOG0
    _ = try test_helpers.executeOpcode(log.op_log0, &test_vm.vm, &test_frame.frame);
    
    // Check that log was emitted
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
    const emitted_log = test_vm.vm.logs.items[0];
    try testing.expectEqual(test_helpers.TestAddresses.CONTRACT, emitted_log.address);
    try testing.expectEqual(@as(usize, 0), emitted_log.topics.len);
    try testing.expectEqualSlices(u8, &log_data, emitted_log.data);
}

test "LOG0: emit log with empty data" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push offset and length for empty data
    try test_frame.pushStack(&[_]u256{0, 0}); // offset, length
    
    // Execute LOG0
    _ = try test_helpers.executeOpcode(log.op_log0, &test_vm.vm, &test_frame.frame);
    
    // Check that log was emitted with empty data
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
    const emitted_log = test_vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 0), emitted_log.topics.len);
    try testing.expectEqual(@as(usize, 0), emitted_log.data.len);
}

// Test LOG1 operation
test "LOG1: emit log with one topic" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Write data to memory
    const log_data = [_]u8{ 0xAA, 0xBB };
    var i: usize = 0;
    while (i < log_data.len) : (i += 1) {
        try test_frame.frame.memory.set_byte(i, log_data[i]);
    }
    
    // Push topic, offset and length
    try test_frame.pushStack(&[_]u256{0, 2, 0x123456}); // offset, length, topic
    
    // Execute LOG1
    _ = try test_helpers.executeOpcode(log.op_log1, &test_vm.vm, &test_frame.frame);
    
    // Check that log was emitted
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
    const emitted_log = test_vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 1), emitted_log.topics.len);
    try testing.expectEqual(@as(u256, 0x123456), emitted_log.topics[0]);
    try testing.expectEqualSlices(u8, &log_data, emitted_log.data);
}

// Test LOG2 operation
test "LOG2: emit log with two topics" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Write data to memory
    const log_data = [_]u8{ 0x01, 0x02, 0x03 };
    var i: usize = 0;
    while (i < log_data.len) : (i += 1) {
        try test_frame.frame.memory.set_byte(10 + i, log_data[i]);
    }
    
    // Push topics, offset and length
    try test_frame.pushStack(&[_]u256{10, 3, 0xCAFE, 0xBEEF}); // offset, length, topic1, topic2
    
    // Execute LOG2
    _ = try test_helpers.executeOpcode(log.op_log2, &test_vm.vm, &test_frame.frame);
    
    // Check that log was emitted
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
    const emitted_log = test_vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 2), emitted_log.topics.len);
    try testing.expectEqual(@as(u256, 0xCAFE), emitted_log.topics[0]);
    try testing.expectEqual(@as(u256, 0xBEEF), emitted_log.topics[1]);
    try testing.expectEqualSlices(u8, &log_data, emitted_log.data);
}

// Test LOG3 operation
test "LOG3: emit log with three topics" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push topics, offset and length
    try test_frame.pushStack(&[_]u256{0, 0, 0x111, 0x222, 0x333}); // offset, length (empty data), topic1, topic2, topic3
    
    // Execute LOG3
    _ = try test_helpers.executeOpcode(log.op_log3, &test_vm.vm, &test_frame.frame);
    
    // Check that log was emitted
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
    const emitted_log = test_vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 3), emitted_log.topics.len);
    try testing.expectEqual(@as(u256, 0x111), emitted_log.topics[0]);
    try testing.expectEqual(@as(u256, 0x222), emitted_log.topics[1]);
    try testing.expectEqual(@as(u256, 0x333), emitted_log.topics[2]);
    try testing.expectEqual(@as(usize, 0), emitted_log.data.len);
}

// Test LOG4 operation
test "LOG4: emit log with four topics" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Write large data to memory
    var log_data: [100]u8 = undefined;
    var i: usize = 0;
    while (i < 100) : (i += 1) {
        log_data[i] = @intCast(i);
        try test_frame.frame.memory.set_byte(i, log_data[i]);
    }
    
    // Push topics, offset and length
    try test_frame.pushStack(&[_]u256{0, 100, 0x1111, 0x2222, 0x3333, 0x4444}); // offset, length, topic1, topic2, topic3, topic4
    
    // Execute LOG4
    _ = try test_helpers.executeOpcode(log.op_log4, &test_vm.vm, &test_frame.frame);
    
    // Check that log was emitted
    try testing.expectEqual(@as(usize, 1), test_vm.vm.logs.items.len);
    const emitted_log = test_vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 4), emitted_log.topics.len);
    try testing.expectEqual(@as(u256, 0x1111), emitted_log.topics[0]);
    try testing.expectEqual(@as(u256, 0x2222), emitted_log.topics[1]);
    try testing.expectEqual(@as(u256, 0x3333), emitted_log.topics[2]);
    try testing.expectEqual(@as(u256, 0x4444), emitted_log.topics[3]);
    try testing.expectEqualSlices(u8, &log_data, emitted_log.data);
}

// Test LOG operations in static call
test "LOG0: write protection in static call" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Set static call
    test_frame.frame.is_static = true;
    
    // Push offset and length
    try test_frame.pushStack(&[_]u256{0, 0}); // offset, length
    
    // Execute LOG0 - should fail
    const result = test_helpers.executeOpcode(log.op_log0, &test_vm.vm, &test_frame.frame);
    try testing.expectError(test_helpers.ExecutionError.Error.WriteProtection, result);
}

test "LOG1: write protection in static call" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Set static call
    test_frame.frame.is_static = true;
    
    // Push topic, offset and length
    try test_frame.pushStack(&[_]u256{0, 0, 0x123}); // offset, length, topic
    
    // Execute LOG1 - should fail
    const result = test_helpers.executeOpcode(log.op_log1, &test_vm.vm, &test_frame.frame);
    try testing.expectError(test_helpers.ExecutionError.Error.WriteProtection, result);
}

// Test gas consumption
test "LOG0: gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Push offset and length for 32 bytes
    try test_frame.pushStack(&[_]u256{0, 32}); // offset, length
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute LOG0
    _ = try test_helpers.executeOpcode(log.op_log0, &test_vm.vm, &test_frame.frame);
    
    // LOG0 base cost is 375 gas
    // Plus 8 gas per byte: 32 * 8 = 256
    // Total: 375 + 256 = 631
    try testing.expectEqual(@as(u64, 631), gas_before - test_frame.frame.gas_remaining);
}

test "LOG4: gas consumption with topics" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Push topics, offset and length
    try test_frame.pushStack(&[_]u256{0, 10, 0x1, 0x2, 0x3, 0x4}); // offset, length, topic1, topic2, topic3, topic4
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute LOG4
    _ = try test_helpers.executeOpcode(log.op_log4, &test_vm.vm, &test_frame.frame);
    
    // LOG4 base cost is 375 gas
    // Plus 375 gas per topic: 4 * 375 = 1500
    // Plus 8 gas per byte: 10 * 8 = 80
    // Total: 375 + 1500 + 80 = 1955
    try testing.expectEqual(@as(u64, 1955), gas_before - test_frame.frame.gas_remaining);
}

// Test memory expansion
test "LOG0: memory expansion gas" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Push offset and length that requires memory expansion
    try test_frame.pushStack(&[_]u256{256, 32}); // offset (requires expansion), length
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute LOG0
    _ = try test_helpers.executeOpcode(log.op_log0, &test_vm.vm, &test_frame.frame);
    
    // Should consume gas for LOG0 plus memory expansion
    const gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expect(gas_used > 631); // More than just LOG0 + data cost
}

// Test stack underflow
test "LOG0: stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push only one value (need two)
    try test_frame.pushStack(&[_]u256{0});
    
    // Execute LOG0 - should fail
    const result = test_helpers.executeOpcode(log.op_log0, &test_vm.vm, &test_frame.frame);
    try testing.expectError(test_helpers.ExecutionError.Error.StackUnderflow, result);
}

test "LOG4: stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push only 5 values (need 6 for LOG4)
    try test_frame.pushStack(&[_]u256{0, 0x1, 0x2, 0x3, 0x4}); // length, topic1, topic2, topic3, topic4
    // Missing offset
    
    // Execute LOG4 - should fail
    const result = test_helpers.executeOpcode(log.op_log4, &test_vm.vm, &test_frame.frame);
    try testing.expectError(test_helpers.ExecutionError.Error.StackUnderflow, result);
}

// Test out of gas
test "LOG0: out of gas" {
    const allocator = testing.allocator;
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 100);
    defer test_frame.deinit();
    
    // Push offset and length for large data
    try test_frame.pushStack(&[_]u256{0, 1000}); // offset, length (would cost 8000 gas for data alone)
    
    // Execute LOG0 - should fail
    const result = test_helpers.executeOpcode(log.op_log0, &test_vm.vm, &test_frame.frame);
    try testing.expectError(test_helpers.ExecutionError.Error.OutOfGas, result);
}
