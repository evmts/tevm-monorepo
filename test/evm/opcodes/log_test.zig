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
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Write data to memory
    const log_data = [_]u8{ 0x11, 0x22, 0x33, 0x44 };
    var i: usize = 0;
    while (i < log_data.len) : (i += 1) {
        try test_frame.frame.memory.set_byte(i, log_data[i]);
    }
    
    // Push length and offset (stack is LIFO)
    try test_frame.pushStack(&[_]u256{4}); // length (pushed first, popped second)
    try test_frame.pushStack(&[_]u256{0}); // offset (pushed last, popped first)
    
    // Execute LOG0
    _ = try test_helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    
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
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Push length and offset for empty data (stack is LIFO)
    try test_frame.pushStack(&[_]u256{0}); // length (pushed first, popped second)
    try test_frame.pushStack(&[_]u256{0}); // offset (pushed last, popped first)
    
    // Execute LOG0
    _ = try test_helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    
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
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Write data to memory
    const log_data = [_]u8{ 0xAA, 0xBB };
    var i: usize = 0;
    while (i < log_data.len) : (i += 1) {
        try test_frame.frame.memory.set_byte(i, log_data[i]);
    }
    
    // Push topic, length and offset (stack is LIFO)
    try test_frame.pushStack(&[_]u256{0x123456}); // topic (pushed first, popped third)
    try test_frame.pushStack(&[_]u256{2}); // length (pushed second, popped second)
    try test_frame.pushStack(&[_]u256{0}); // offset (pushed last, popped first)
    
    // Execute LOG1
    _ = try test_helpers.executeOpcode(0xA1, &test_vm.vm, test_frame.frame);
    
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
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Write data to memory
    const log_data = [_]u8{ 0x01, 0x02, 0x03 };
    var i: usize = 0;
    while (i < log_data.len) : (i += 1) {
        try test_frame.frame.memory.set_byte(10 + i, log_data[i]);
    }
    
    // Push topics, length and offset (stack is LIFO - reverse order)
    try test_frame.pushStack(&[_]u256{0xCAFE}); // topic1 (pushed first, popped fourth)
    try test_frame.pushStack(&[_]u256{0xBEEF}); // topic2 (pushed second, popped third)
    try test_frame.pushStack(&[_]u256{3}); // length (pushed third, popped second)
    try test_frame.pushStack(&[_]u256{10}); // offset (pushed last, popped first)
    
    // Execute LOG2
    _ = try test_helpers.executeOpcode(0xA2, &test_vm.vm, test_frame.frame);
    
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
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Push topics, length and offset (stack is LIFO - reverse order)
    try test_frame.pushStack(&[_]u256{0x111}); // topic1 (pushed first, popped fifth)
    try test_frame.pushStack(&[_]u256{0x222}); // topic2 (pushed second, popped fourth)
    try test_frame.pushStack(&[_]u256{0x333}); // topic3 (pushed third, popped third)
    try test_frame.pushStack(&[_]u256{0}); // length (pushed fourth, popped second - empty data)
    try test_frame.pushStack(&[_]u256{0}); // offset (pushed last, popped first)
    
    // Execute LOG3
    _ = try test_helpers.executeOpcode(0xA3, &test_vm.vm, test_frame.frame);
    
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
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Write large data to memory
    var log_data: [100]u8 = undefined;
    var i: usize = 0;
    while (i < 100) : (i += 1) {
        log_data[i] = @intCast(i);
        try test_frame.frame.memory.set_byte(i, log_data[i]);
    }
    
    // Push topics, length and offset (stack is LIFO - reverse order)
    try test_frame.pushStack(&[_]u256{0x1111}); // topic1 (pushed first, popped sixth)
    try test_frame.pushStack(&[_]u256{0x2222}); // topic2 (pushed second, popped fifth)
    try test_frame.pushStack(&[_]u256{0x3333}); // topic3 (pushed third, popped fourth)
    try test_frame.pushStack(&[_]u256{0x4444}); // topic4 (pushed fourth, popped third)
    try test_frame.pushStack(&[_]u256{100}); // length (pushed fifth, popped second)
    try test_frame.pushStack(&[_]u256{0}); // offset (pushed last, popped first)
    
    // Execute LOG4
    _ = try test_helpers.executeOpcode(0xA4, &test_vm.vm, test_frame.frame);
    
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
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Set static call
    test_frame.frame.is_static = true;
    
    // Push length and offset (stack is LIFO)
    try test_frame.pushStack(&[_]u256{0}); // length (pushed first, popped second)
    try test_frame.pushStack(&[_]u256{0}); // offset (pushed last, popped first)
    
    // Execute LOG0 - should fail
    const result = test_helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
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
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Set static call
    test_frame.frame.is_static = true;
    
    // Push topic, length and offset (stack is LIFO)
    try test_frame.pushStack(&[_]u256{0x123}); // topic (pushed first, popped third)
    try test_frame.pushStack(&[_]u256{0}); // length (pushed second, popped second)
    try test_frame.pushStack(&[_]u256{0}); // offset (pushed last, popped first)
    
    // Execute LOG1 - should fail
    const result = test_helpers.executeOpcode(0xA1, &test_vm.vm, test_frame.frame);
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
    
    // Push length and offset for 32 bytes (stack is LIFO)
    try test_frame.pushStack(&[_]u256{32}); // length (pushed first, popped second)
    try test_frame.pushStack(&[_]u256{0}); // offset (pushed last, popped first)
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute LOG0
    _ = try test_helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    
    // LOG0 base cost is 375 gas
    // Plus 8 gas per byte: 32 * 8 = 256
    // Plus memory expansion: 3 gas (for 1 word)
    // Total: 375 + 256 + 3 = 634
    try testing.expectEqual(@as(u64, 634), gas_before - test_frame.frame.gas_remaining);
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
    
    // Push topics, length and offset (stack is LIFO - reverse order)
    try test_frame.pushStack(&[_]u256{0x1}); // topic1 (pushed first, popped last)
    try test_frame.pushStack(&[_]u256{0x2}); // topic2
    try test_frame.pushStack(&[_]u256{0x3}); // topic3
    try test_frame.pushStack(&[_]u256{0x4}); // topic4
    try test_frame.pushStack(&[_]u256{10}); // length (pushed fifth, popped second)
    try test_frame.pushStack(&[_]u256{0}); // offset (pushed last, popped first)
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute LOG4
    _ = try test_helpers.executeOpcode(0xA4, &test_vm.vm, test_frame.frame);
    
    // LOG4 base cost is 375 gas
    // Plus 375 gas per topic: 4 * 375 = 1500
    // Plus 8 gas per byte: 10 * 8 = 80
    // Plus memory expansion: 3 gas (for 1 word)
    // Total: 375 + 1500 + 80 + 3 = 1958
    try testing.expectEqual(@as(u64, 1958), gas_before - test_frame.frame.gas_remaining);
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
    
    // Push length and offset that requires memory expansion (stack is LIFO)
    try test_frame.pushStack(&[_]u256{32}); // length (pushed first, popped second)
    try test_frame.pushStack(&[_]u256{256}); // offset (pushed last, popped first - requires expansion)
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute LOG0
    _ = try test_helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    
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
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Push only one value (need two)
    try test_frame.pushStack(&[_]u256{0});
    
    // Execute LOG0 - should fail
    const result = test_helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
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
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Push only 5 values (need 6 for LOG4)
    try test_frame.pushStack(&[_]u256{0x1, 0x2, 0x3, 0x4, 0}); // topic1, topic2, topic3, topic4, length
    // Missing offset
    
    // Execute LOG4 - should fail
    const result = test_helpers.executeOpcode(0xA4, &test_vm.vm, test_frame.frame);
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
    
    // Push length and offset for large data (stack is LIFO)
    try test_frame.pushStack(&[_]u256{1000}); // length (pushed first, popped second - would cost 8000 gas for data alone)
    try test_frame.pushStack(&[_]u256{0}); // offset (pushed last, popped first)
    
    // Execute LOG0 - should fail
    const result = test_helpers.executeOpcode(0xA0, &test_vm.vm, test_frame.frame);
    try testing.expectError(test_helpers.ExecutionError.Error.OutOfGas, result);
}
