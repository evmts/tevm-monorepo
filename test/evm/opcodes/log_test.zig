const std = @import("std");
const testing = std.testing;
const opcodes = @import("../../../src/evm/opcodes/package.zig");
const test_helpers = @import("test_helpers.zig");
const ExecutionError = opcodes.ExecutionError;

// Test LOG0 operation
test "LOG0: emit log with no topics" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write data to memory
    const log_data = [_]u8{ 0x11, 0x22, 0x33, 0x44 };
    var i: usize = 0;
    while (i < log_data.len) : (i += 1) {
        try frame.memory.write_byte(i, log_data[i]);
    }
    
    // Push offset and length
    try frame.pushValue(4); // length
    try frame.pushValue(0); // offset
    
    // Execute LOG0
    try test_helpers.executeOpcode(opcodes.log.op_log0, &frame);
    
    // Check that log was emitted
    try testing.expectEqual(@as(usize, 1), vm.vm.logs.items.len);
    const log = vm.vm.logs.items[0];
    try testing.expectEqual(test_helpers.TEST_CONTRACT_ADDRESS, log.address);
    try testing.expectEqual(@as(usize, 0), log.topics.len);
    try testing.expectEqualSlices(u8, &log_data, log.data);
}

test "LOG0: emit log with empty data" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push offset and length for empty data
    try frame.pushValue(0); // length
    try frame.pushValue(0); // offset
    
    // Execute LOG0
    try test_helpers.executeOpcode(opcodes.log.op_log0, &frame);
    
    // Check that log was emitted with empty data
    try testing.expectEqual(@as(usize, 1), vm.vm.logs.items.len);
    const log = vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 0), log.topics.len);
    try testing.expectEqual(@as(usize, 0), log.data.len);
}

// Test LOG1 operation
test "LOG1: emit log with one topic" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write data to memory
    const log_data = [_]u8{ 0xAA, 0xBB };
    var i: usize = 0;
    while (i < log_data.len) : (i += 1) {
        try frame.memory.write_byte(i, log_data[i]);
    }
    
    // Push topic, offset and length
    try frame.pushValue(0x123456); // topic
    try frame.pushValue(2);        // length
    try frame.pushValue(0);        // offset
    
    // Execute LOG1
    try test_helpers.executeOpcode(opcodes.log.op_log1, &frame);
    
    // Check that log was emitted
    try testing.expectEqual(@as(usize, 1), vm.vm.logs.items.len);
    const log = vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 1), log.topics.len);
    try testing.expectEqual(@as(u256, 0x123456), log.topics[0]);
    try testing.expectEqualSlices(u8, &log_data, log.data);
}

// Test LOG2 operation
test "LOG2: emit log with two topics" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write data to memory
    const log_data = [_]u8{ 0x01, 0x02, 0x03 };
    var i: usize = 0;
    while (i < log_data.len) : (i += 1) {
        try frame.memory.write_byte(10 + i, log_data[i]);
    }
    
    // Push topics, offset and length
    try frame.pushValue(0xBEEF);   // topic2
    try frame.pushValue(0xCAFE);   // topic1
    try frame.pushValue(3);         // length
    try frame.pushValue(10);        // offset
    
    // Execute LOG2
    try test_helpers.executeOpcode(opcodes.log.op_log2, &frame);
    
    // Check that log was emitted
    try testing.expectEqual(@as(usize, 1), vm.vm.logs.items.len);
    const log = vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 2), log.topics.len);
    try testing.expectEqual(@as(u256, 0xCAFE), log.topics[0]);
    try testing.expectEqual(@as(u256, 0xBEEF), log.topics[1]);
    try testing.expectEqualSlices(u8, &log_data, log.data);
}

// Test LOG3 operation
test "LOG3: emit log with three topics" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push topics, offset and length
    try frame.pushValue(0x333);    // topic3
    try frame.pushValue(0x222);    // topic2
    try frame.pushValue(0x111);    // topic1
    try frame.pushValue(0);        // length (empty data)
    try frame.pushValue(0);        // offset
    
    // Execute LOG3
    try test_helpers.executeOpcode(opcodes.log.op_log3, &frame);
    
    // Check that log was emitted
    try testing.expectEqual(@as(usize, 1), vm.vm.logs.items.len);
    const log = vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 3), log.topics.len);
    try testing.expectEqual(@as(u256, 0x111), log.topics[0]);
    try testing.expectEqual(@as(u256, 0x222), log.topics[1]);
    try testing.expectEqual(@as(u256, 0x333), log.topics[2]);
    try testing.expectEqual(@as(usize, 0), log.data.len);
}

// Test LOG4 operation
test "LOG4: emit log with four topics" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write large data to memory
    var log_data: [100]u8 = undefined;
    var i: usize = 0;
    while (i < 100) : (i += 1) {
        log_data[i] = @intCast(i);
        try frame.memory.write_byte(i, log_data[i]);
    }
    
    // Push topics, offset and length
    try frame.pushValue(0x4444);   // topic4
    try frame.pushValue(0x3333);   // topic3
    try frame.pushValue(0x2222);   // topic2
    try frame.pushValue(0x1111);   // topic1
    try frame.pushValue(100);       // length
    try frame.pushValue(0);         // offset
    
    // Execute LOG4
    try test_helpers.executeOpcode(opcodes.log.op_log4, &frame);
    
    // Check that log was emitted
    try testing.expectEqual(@as(usize, 1), vm.vm.logs.items.len);
    const log = vm.vm.logs.items[0];
    try testing.expectEqual(@as(usize, 4), log.topics.len);
    try testing.expectEqual(@as(u256, 0x1111), log.topics[0]);
    try testing.expectEqual(@as(u256, 0x2222), log.topics[1]);
    try testing.expectEqual(@as(u256, 0x3333), log.topics[2]);
    try testing.expectEqual(@as(u256, 0x4444), log.topics[3]);
    try testing.expectEqualSlices(u8, &log_data, log.data);
}

// Test LOG operations in static call
test "LOG0: write protection in static call" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set static call
    frame.frame.is_static = true;
    
    // Push offset and length
    try frame.pushValue(0); // length
    try frame.pushValue(0); // offset
    
    // Execute LOG0 - should fail
    const result = test_helpers.executeOpcode(opcodes.log.op_log0, &frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
}

test "LOG1: write protection in static call" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set static call
    frame.frame.is_static = true;
    
    // Push topic, offset and length
    try frame.pushValue(0x123); // topic
    try frame.pushValue(0);     // length
    try frame.pushValue(0);     // offset
    
    // Execute LOG1 - should fail
    const result = test_helpers.executeOpcode(opcodes.log.op_log1, &frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
}

// Test gas consumption
test "LOG0: gas consumption" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 10000;
    
    // Push offset and length for 32 bytes
    try frame.pushValue(32); // length
    try frame.pushValue(0);  // offset
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute LOG0
    try test_helpers.executeOpcode(opcodes.log.op_log0, &frame);
    
    // LOG0 base cost is 375 gas
    // Plus 8 gas per byte: 32 * 8 = 256
    // Total: 375 + 256 = 631
    try testing.expectEqual(@as(u64, 631), gas_before - frame.frame.gas_remaining);
}

test "LOG4: gas consumption with topics" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 10000;
    
    // Push topics, offset and length
    try frame.pushValue(0x4); // topic4
    try frame.pushValue(0x3); // topic3
    try frame.pushValue(0x2); // topic2
    try frame.pushValue(0x1); // topic1
    try frame.pushValue(10);  // length
    try frame.pushValue(0);   // offset
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute LOG4
    try test_helpers.executeOpcode(opcodes.log.op_log4, &frame);
    
    // LOG4 base cost is 375 gas
    // Plus 375 gas per topic: 4 * 375 = 1500
    // Plus 8 gas per byte: 10 * 8 = 80
    // Total: 375 + 1500 + 80 = 1955
    try testing.expectEqual(@as(u64, 1955), gas_before - frame.frame.gas_remaining);
}

// Test memory expansion
test "LOG0: memory expansion gas" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 10000;
    
    // Push offset and length that requires memory expansion
    try frame.pushValue(32);  // length
    try frame.pushValue(256); // offset (requires expansion)
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute LOG0
    try test_helpers.executeOpcode(opcodes.log.op_log0, &frame);
    
    // Should consume gas for LOG0 plus memory expansion
    const gas_used = gas_before - frame.frame.gas_remaining;
    try testing.expect(gas_used > 631); // More than just LOG0 + data cost
}

// Test stack underflow
test "LOG0: stack underflow" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push only one value (need two)
    try frame.pushValue(0);
    
    // Execute LOG0 - should fail
    const result = test_helpers.executeOpcode(opcodes.log.op_log0, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "LOG4: stack underflow" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push only 5 values (need 6 for LOG4)
    try frame.pushValue(0x4); // topic4
    try frame.pushValue(0x3); // topic3
    try frame.pushValue(0x2); // topic2
    try frame.pushValue(0x1); // topic1
    try frame.pushValue(0);   // length
    // Missing offset
    
    // Execute LOG4 - should fail
    const result = test_helpers.executeOpcode(opcodes.log.op_log4, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

// Test out of gas
test "LOG0: out of gas" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set very limited gas
    frame.frame.gas_remaining = 100;
    
    // Push offset and length for large data
    try frame.pushValue(1000); // length (would cost 8000 gas for data alone)
    try frame.pushValue(0);    // offset
    
    // Execute LOG0 - should fail
    const result = test_helpers.executeOpcode(opcodes.log.op_log0, &frame);
    try testing.expectError(ExecutionError.Error.OutOfGas, result);
}