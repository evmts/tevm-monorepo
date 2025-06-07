const std = @import("std");
const testing = std.testing;
const test_helpers = @import("test_helpers");
const evm = @import("evm");
const opcodes = evm.opcodes;
const ExecutionError = evm.ExecutionError;

// Test basic arithmetic sequences
test "Integration: arithmetic calculation sequence" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();

    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();

    // Simulate: (5 + 3) * 2 - 1 = 15

    // Push values
    try frame.pushValue(5);
    try frame.pushValue(3);

    // ADD: 5 + 3 = 8
    try test_helpers.executeOpcode(0x01, &frame);
    try testing.expectEqual(@as(u256, 8), frame.peekStack(0));

    // Push 2 and multiply
    try frame.pushValue(2);
    try test_helpers.executeOpcode(0x02, &frame);
    try testing.expectEqual(@as(u256, 16), frame.peekStack(0));

    // Push 1 and subtract
    try frame.pushValue(1);
    try test_helpers.executeOpcode(0x03, &frame);

    // Final result
    try testing.expectEqual(@as(u256, 15), try frame.popValue());
    try testing.expectEqual(@as(usize, 0), frame.stack.items.len);
}

// Test stack manipulation sequences
test "Integration: stack manipulation with DUP and SWAP" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();

    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();

    // Push initial values
    try frame.pushValue(10);
    try frame.pushValue(20);
    try frame.pushValue(30);

    // Stack: [10, 20, 30] (top is 30)

    // DUP2 - duplicate second item
    try test_helpers.executeOpcode(0x81, &frame);

    // Stack: [10, 20, 30, 20]
    try testing.expectEqual(@as(u256, 20), frame.peekStack(0));
    try testing.expectEqual(@as(u256, 30), frame.peekStack(1));

    // SWAP1 - swap top two
    try test_helpers.executeOpcode(0x90, &frame);

    // Stack: [10, 20, 20, 30]
    try testing.expectEqual(@as(u256, 30), frame.peekStack(0));
    try testing.expectEqual(@as(u256, 20), frame.peekStack(1));

    // ADD top two
    try test_helpers.executeOpcode(0x01, &frame);

    // Stack: [10, 20, 50]
    try testing.expectEqual(@as(u256, 50), frame.peekStack(0));

    // Clean up
    _ = try frame.popValue();
    _ = try frame.popValue();
    _ = try frame.popValue();
}

// Test memory and storage interaction
test "Integration: memory to storage workflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();

    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();

    // Store value in memory
    const test_value: u256 = 0x123456789ABCDEF;
    try frame.pushValue(test_value);
    try frame.pushValue(32); // offset

    try test_helpers.executeOpcode(0x52, &frame);

    // Load from memory
    try frame.pushValue(32); // offset
    try test_helpers.executeOpcode(0x51, &frame);

    // Store in storage slot 5
    try frame.pushValue(5); // slot
    try test_helpers.executeOpcode(0x55, &frame);

    // Load from storage
    try frame.pushValue(5); // slot
    try test_helpers.executeOpcode(0x54, &frame);

    // Verify value
    try testing.expectEqual(test_value, try frame.popValue());
}

// Test conditional logic with JUMPI
test "Integration: conditional branching" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();

    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();

    // Set up contract code with jump destinations
    var code: [50]u8 = undefined;
    @memset(&code, 0x00); // Fill with STOP
    code[10] = 0x5B; // JUMPDEST at 10
    code[20] = 0x5B; // JUMPDEST at 20
    vm.setCode(test_helpers.TEST_CONTRACT_ADDRESS, &code);

    // Mark jump destinations as valid
    vm.vm.test_valid_jumpdests.put(10, true) catch unreachable;
    vm.vm.test_valid_jumpdests.put(20, true) catch unreachable;

    // Test 1: Jump taken (condition true)
    try frame.pushValue(100);
    try frame.pushValue(200);

    // Check if 100 < 200 (true)
    try test_helpers.executeOpcode(0x10, &frame);

    // JUMPI to 10 if true
    try frame.pushValue(10); // destination
    try frame.swapStack(0, 1); // put condition on top

    const result1 = try test_helpers.executeOpcode(0x57, &frame);
    try testing.expectEqual(@as(?usize, 10), result1.jump_dest);

    // Test 2: Jump not taken (condition false)
    frame.frame.pc = 0; // Reset PC
    try frame.pushValue(200);
    try frame.pushValue(100);

    // Check if 200 < 100 (false)
    try test_helpers.executeOpcode(0x10, &frame);

    // JUMPI to 20 if true (won't jump)
    try frame.pushValue(20); // destination
    try frame.swapStack(0, 1); // put condition on top

    const result2 = try test_helpers.executeOpcode(0x57, &frame);
    try testing.expectEqual(@as(?usize, null), result2.jump_dest);
}

// Test hash calculation and comparison
test "Integration: hash and compare workflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();

    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();

    // Write data to memory
    const data1 = [_]u8{ 0x01, 0x02, 0x03, 0x04 };
    const data2 = [_]u8{ 0x01, 0x02, 0x03, 0x04 };
    const data3 = [_]u8{ 0x05, 0x06, 0x07, 0x08 };

    // Write first data
    var i: usize = 0;
    while (i < data1.len) : (i += 1) {
        try frame.memory.write_byte(i, data1[i]);
    }

    // Hash first data
    try frame.pushValue(4); // length
    try frame.pushValue(0); // offset
    try test_helpers.executeOpcode(0x20, &frame);

    const hash1 = frame.peekStack(0);

    // Write second data (same as first)
    i = 0;
    while (i < data2.len) : (i += 1) {
        try frame.memory.write_byte(100 + i, data2[i]);
    }

    // Hash second data
    try frame.pushValue(4); // length
    try frame.pushValue(100); // offset
    try test_helpers.executeOpcode(0x20, &frame);

    // Compare hashes (should be equal)
    try test_helpers.executeOpcode(0x14, &frame);
    try testing.expectEqual(@as(u256, 1), try frame.popValue());

    // Write third data (different)
    i = 0;
    while (i < data3.len) : (i += 1) {
        try frame.memory.write_byte(200 + i, data3[i]);
    }

    // Hash third data
    try frame.pushValue(hash1); // Push first hash back
    try frame.pushValue(4); // length
    try frame.pushValue(200); // offset
    try test_helpers.executeOpcode(0x20, &frame);

    // Compare hashes (should be different)
    try test_helpers.executeOpcode(0x14, &frame);
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
}

// Test call data handling
test "Integration: call data processing" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();

    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();

    // Set up call data (function selector + parameters)
    const call_data = [_]u8{
        0xa9, 0x05, 0x9c, 0xbb, // transfer(address,uint256) selector
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x12, 0x34, 0x56, 0x78,
        0x9a, 0xbc, 0xde, 0xf0, 0x12, 0x34, 0x56, 0x78, // address
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0xe8, // amount (1000)
    };
    frame.frame.input = &call_data;

    // Get call data size
    try test_helpers.executeOpcode(0x36, &frame);
    try testing.expectEqual(@as(u256, call_data.len), try frame.popValue());

    // Load function selector (first 4 bytes)
    try frame.pushValue(0); // offset
    try test_helpers.executeOpcode(0x35, &frame);

    // Extract selector by shifting right
    try frame.pushValue(224); // 256 - 32 = 224 bits
    try test_helpers.executeOpcode(0x1C, &frame);

    const selector = try frame.popValue();
    try testing.expectEqual(@as(u256, 0xa9059cbb), selector);

    // Load first parameter (address)
    try frame.pushValue(4); // offset past selector
    try test_helpers.executeOpcode(0x35, &frame);

    const param1 = try frame.popValue();
    try testing.expectEqual(@as(u256, 0x123456789abcdef01234567800000000000000000000000000000000), param1);

    // Load second parameter (amount)
    try frame.pushValue(36); // offset to second parameter
    try test_helpers.executeOpcode(0x35, &frame);

    const param2 = try frame.popValue();
    try testing.expectEqual(@as(u256, 1000), param2);
}

// Test gas consumption across operations
test "Integration: gas tracking through operations" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();

    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();

    // Start with specific gas amount
    frame.frame.gas_remaining = 10000;

    // Memory operation (expansion cost)
    try frame.pushValue(0x123456);
    try frame.pushValue(1000); // Large offset causes expansion

    const gas_before_mstore = frame.frame.gas_remaining;
    try test_helpers.executeOpcode(0x52, &frame);

    const mstore_gas = gas_before_mstore - frame.frame.gas_remaining;
    try testing.expect(mstore_gas > 0); // Should consume gas for memory expansion

    // SHA3 operation
    try frame.pushValue(32); // length
    try frame.pushValue(1000); // offset

    const gas_before_sha3 = frame.frame.gas_remaining;
    try test_helpers.executeOpcode(0x20, &frame);

    const sha3_gas = gas_before_sha3 - frame.frame.gas_remaining;
    try testing.expect(sha3_gas >= 30 + 6); // Base cost + 1 word

    // Storage operation (cold access)
    try frame.pushValue(100); // slot

    const gas_before_sstore = frame.frame.gas_remaining;
    try test_helpers.executeOpcode(0x55, &frame);

    const sstore_gas = gas_before_sstore - frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2100), sstore_gas); // Cold storage access

    // Verify total gas consumed
    const total_gas_used = 10000 - frame.frame.gas_remaining;
    try testing.expect(total_gas_used == mstore_gas + sha3_gas + sstore_gas);
}

// Test error propagation through sequences
test "Integration: error handling in sequences" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();

    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();

    // Set limited gas
    frame.frame.gas_remaining = 100;

    // Try sequence that will run out of gas
    try frame.pushValue(1000000); // Large value
    try frame.pushValue(1000000); // Large value

    // This should succeed
    try test_helpers.executeOpcode(0x01, &frame);

    // Try expensive operation - SHA3 with large data
    try frame.pushValue(10000); // Large length
    try frame.pushValue(0); // offset

    // Should fail with out of gas
    const result = test_helpers.executeOpcode(0x20, &frame);
    try testing.expectError(ExecutionError.Error.OutOfGas, result);

    // Stack should still be valid
    try testing.expectEqual(@as(usize, 3), frame.stack.items.len); // Result from ADD + 2 values for SHA3
}

// Test transient storage workflow (EIP-1153)
test "Integration: transient storage usage" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();

    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();

    // Store in both regular and transient storage
    const test_value: u256 = 0xDEADBEEF;
    const slot: u256 = 42;

    // Store in regular storage
    try frame.pushValue(test_value);
    try frame.pushValue(slot);
    try test_helpers.executeOpcode(0x55, &frame);

    // Store different value in transient storage
    const transient_value: u256 = 0xCAFEBABE;
    try frame.pushValue(transient_value);
    try frame.pushValue(slot);
    try test_helpers.executeOpcode(0x5D, &frame);

    // Load from regular storage
    try frame.pushValue(slot);
    try test_helpers.executeOpcode(0x54, &frame);
    const regular_result = try frame.popValue();
    try testing.expectEqual(test_value, regular_result);

    // Load from transient storage
    try frame.pushValue(slot);
    try test_helpers.executeOpcode(0x5C, &frame);
    const transient_result = try frame.popValue();
    try testing.expectEqual(transient_value, transient_result);

    // Verify they are independent
    try testing.expect(regular_result != transient_result);
}
