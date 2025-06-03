const std = @import("std");
const testing = std.testing;
const test_helpers = @import("test_helpers");
const evm = @import("evm");
const opcodes = evm.opcodes;
const ExecutionError = evm.ExecutionError;

// Test stack limit edge cases
test "Integration: stack limit boundary conditions" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Fill stack to near limit (1024 items)
    var i: usize = 0;
    while (i < 1023) : (i += 1) {
        try frame.pushValue(i);
    }
    
    // One more push should succeed (reaching 1024)
    try frame.pushValue(1023);
    try testing.expectEqual(@as(usize, 1024), frame.stack.items.len);
    
    // DUP1 should fail (would exceed 1024)
    const dup_result = test_helpers.executeOpcode(opcodes.stack.op_dup1, &frame);
    try testing.expectError(ExecutionError.Error.StackOverflow, dup_result);
    
    // SWAP1 should succeed (doesn't increase stack size)
    try test_helpers.executeOpcode(opcodes.stack.op_swap1, &frame);
    
    // POP should succeed and make room
    try test_helpers.executeOpcode(opcodes.stack.op_pop, &frame);
    try testing.expectEqual(@as(usize, 1023), frame.stack.items.len);
    
    // Now DUP1 should succeed
    try test_helpers.executeOpcode(opcodes.stack.op_dup1, &frame);
    try testing.expectEqual(@as(usize, 1024), frame.stack.items.len);
}

// Test memory expansion edge cases
test "Integration: memory expansion limits" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set limited gas
    frame.frame.gas_remaining = 30000;
    
    // Try moderate memory expansion
    try frame.pushValue(0x1234);
    try frame.pushValue(1000); // offset
    
    const gas_before = frame.frame.gas_remaining;
    try test_helpers.executeOpcode(opcodes.memory.op_mstore, &frame);
    
    const gas_used = gas_before - frame.frame.gas_remaining;
    try testing.expect(gas_used > 0);
    
    // Try very large memory expansion
    frame.frame.gas_remaining = 1000; // Limited gas
    try frame.pushValue(0x5678);
    try frame.pushValue(1000000); // Very large offset
    
    // Should fail with out of gas
    const result = test_helpers.executeOpcode(opcodes.memory.op_mstore, &frame);
    try testing.expectError(ExecutionError.Error.OutOfGas, result);
}

// Test u256 overflow/underflow edge cases
test "Integration: arithmetic overflow and underflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    const max_u256 = std.math.maxInt(u256);
    
    // Test addition overflow (wraps around)
    try frame.pushValue(max_u256);
    try frame.pushValue(1);
    try test_helpers.executeOpcode(opcodes.arithmetic.op_add, &frame);
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
    
    // Test subtraction underflow (wraps around)
    try frame.pushValue(0);
    try frame.pushValue(1);
    try test_helpers.executeOpcode(opcodes.arithmetic.op_sub, &frame);
    try testing.expectEqual(max_u256, try frame.popValue());
    
    // Test multiplication overflow
    try frame.pushValue(max_u256);
    try frame.pushValue(2);
    try test_helpers.executeOpcode(opcodes.arithmetic.op_mul, &frame);
    try testing.expectEqual(max_u256 - 1, try frame.popValue()); // (2^256 - 1) * 2 = 2^257 - 2 ≡ -2 ≡ 2^256 - 2
    
    // Test division by zero
    try frame.pushValue(100);
    try frame.pushValue(0);
    try test_helpers.executeOpcode(opcodes.arithmetic.op_div, &frame);
    try testing.expectEqual(@as(u256, 0), try frame.popValue()); // EVM returns 0 for division by zero
    
    // Test modulo by zero
    try frame.pushValue(100);
    try frame.pushValue(0);
    try test_helpers.executeOpcode(opcodes.arithmetic.op_mod, &frame);
    try testing.expectEqual(@as(u256, 0), try frame.popValue()); // EVM returns 0 for modulo by zero
}

// Test signed arithmetic edge cases
test "Integration: signed arithmetic boundaries" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Maximum positive signed value (2^255 - 1)
    const max_signed: u256 = (1 << 255) - 1;
    // Minimum negative signed value (-2^255)
    const min_signed: u256 = 1 << 255;
    
    // Test SLT with boundary values
    try frame.pushValue(max_signed); // Maximum positive
    try frame.pushValue(min_signed); // Minimum negative
    try test_helpers.executeOpcode(opcodes.comparison.op_slt, &frame);
    try testing.expectEqual(@as(u256, 1), try frame.popValue()); // -2^255 < 2^255-1
    
    // Test SGT with boundary values
    try frame.pushValue(min_signed); // Minimum negative
    try frame.pushValue(max_signed); // Maximum positive
    try test_helpers.executeOpcode(opcodes.comparison.op_sgt, &frame);
    try testing.expectEqual(@as(u256, 1), try frame.popValue()); // 2^255-1 > -2^255
    
    // Test SDIV with overflow case
    try frame.pushValue(min_signed); // -2^255
    try frame.pushValue(std.math.maxInt(u256)); // -1 in two's complement
    try test_helpers.executeOpcode(opcodes.arithmetic.op_sdiv, &frame);
    try testing.expectEqual(min_signed, try frame.popValue()); // -2^255 / -1 = -2^255 (overflow)
}

// Test bitwise operations edge cases
test "Integration: bitwise operation boundaries" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Test shift operations with large shift amounts
    try frame.pushValue(0xFF);
    try frame.pushValue(256); // Shift by full width
    try test_helpers.executeOpcode(opcodes.bitwise.op_shl, &frame);
    try testing.expectEqual(@as(u256, 0), try frame.popValue()); // Shifts out completely
    
    try frame.pushValue(0xFF << 248); // Byte in most significant position
    try frame.pushValue(256); // Shift right by full width
    try test_helpers.executeOpcode(opcodes.bitwise.op_shr, &frame);
    try testing.expectEqual(@as(u256, 0), try frame.popValue()); // Shifts out completely
    
    // Test SAR with negative number
    const negative_one = std.math.maxInt(u256); // -1 in two's complement
    try frame.pushValue(negative_one);
    try frame.pushValue(255); // Shift right by 255 bits
    try test_helpers.executeOpcode(opcodes.bitwise.op_sar, &frame);
    try testing.expectEqual(negative_one, try frame.popValue()); // Sign extension fills with 1s
    
    // Test BYTE operation edge cases
    try frame.pushValue(0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20);
    try frame.pushValue(0); // Get most significant byte
    try test_helpers.executeOpcode(opcodes.bitwise.op_byte, &frame);
    try testing.expectEqual(@as(u256, 0x01), try frame.popValue());
    
    try frame.pushValue(0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20);
    try frame.pushValue(31); // Get least significant byte
    try test_helpers.executeOpcode(opcodes.bitwise.op_byte, &frame);
    try testing.expectEqual(@as(u256, 0x20), try frame.popValue());
    
    try frame.pushValue(0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20);
    try frame.pushValue(32); // Out of range
    try test_helpers.executeOpcode(opcodes.bitwise.op_byte, &frame);
    try testing.expectEqual(@as(u256, 0), try frame.popValue()); // Returns 0 for out of range
}

// Test call with insufficient gas
test "Integration: call gas calculation edge cases" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set up for call
    frame.frame.gas_remaining = 1000;
    vm.vm.call_result = .{
        .success = false,
        .gas_left = 0,
        .output = null,
    };
    
    // Request more gas than available
    try frame.pushValue(0); // ret_size
    try frame.pushValue(0); // ret_offset
    try frame.pushValue(0); // args_size
    try frame.pushValue(0); // args_offset
    try frame.pushValue(0); // value
    try frame.pushValue(test_helpers.to_u256(test_helpers.TEST_ADDRESS_1)); // to
    try frame.pushValue(2000); // gas (more than available)
    
    try test_helpers.executeOpcode(opcodes.system.op_call, &frame);
    
    // Call should fail but not error
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
    
    // Should have consumed gas (at least 1/64th retained)
    try testing.expect(frame.frame.gas_remaining < 1000);
    try testing.expect(frame.frame.gas_remaining >= 1000 / 64);
}

// Test RETURNDATACOPY edge cases
test "Integration: return data boundary conditions" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set return data
    const return_data = [_]u8{ 0x11, 0x22, 0x33, 0x44 };
    frame.frame.return_data_buffer = &return_data;
    
    // Test 1: Copy within bounds
    try frame.pushValue(2); // size
    try frame.pushValue(1); // data offset
    try frame.pushValue(0); // memory offset
    
    try test_helpers.executeOpcode(opcodes.environment.op_returndatacopy, &frame);
    
    try testing.expectEqual(@as(u8, 0x22), frame.memory.read_byte(0));
    try testing.expectEqual(@as(u8, 0x33), frame.memory.read_byte(1));
    
    // Test 2: Copy with offset at boundary
    try frame.pushValue(1); // size
    try frame.pushValue(3); // data offset (last valid)
    try frame.pushValue(10); // memory offset
    
    try test_helpers.executeOpcode(opcodes.environment.op_returndatacopy, &frame);
    
    try testing.expectEqual(@as(u8, 0x44), frame.memory.read_byte(10));
    
    // Test 3: Copy beyond boundary - should fail
    try frame.pushValue(2); // size
    try frame.pushValue(3); // data offset (would read beyond)
    try frame.pushValue(20); // memory offset
    
    const result = test_helpers.executeOpcode(opcodes.environment.op_returndatacopy, &frame);
    try testing.expectError(ExecutionError.Error.ReturnDataOutOfBounds, result);
    
    // Test 4: Offset beyond data - should fail
    try frame.pushValue(1); // size
    try frame.pushValue(5); // data offset (beyond data)
    try frame.pushValue(30); // memory offset
    
    const result2 = test_helpers.executeOpcode(opcodes.environment.op_returndatacopy, &frame);
    try testing.expectError(ExecutionError.Error.ReturnDataOutOfBounds, result2);
}

// Test EXP edge cases
test "Integration: exponentiation edge cases" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Test 0^0 = 1
    try frame.pushValue(0); // exponent
    try frame.pushValue(0); // base
    try test_helpers.executeOpcode(opcodes.arithmetic.op_exp, &frame);
    try testing.expectEqual(@as(u256, 1), try frame.popValue());
    
    // Test x^0 = 1
    try frame.pushValue(0); // exponent
    try frame.pushValue(12345); // base
    try test_helpers.executeOpcode(opcodes.arithmetic.op_exp, &frame);
    try testing.expectEqual(@as(u256, 1), try frame.popValue());
    
    // Test 0^x = 0 (x > 0)
    try frame.pushValue(5); // exponent
    try frame.pushValue(0); // base
    try test_helpers.executeOpcode(opcodes.arithmetic.op_exp, &frame);
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
    
    // Test 1^x = 1
    try frame.pushValue(std.math.maxInt(u256)); // huge exponent
    try frame.pushValue(1); // base
    try test_helpers.executeOpcode(opcodes.arithmetic.op_exp, &frame);
    try testing.expectEqual(@as(u256, 1), try frame.popValue());
    
    // Test 2^256 (overflow)
    try frame.pushValue(256); // exponent
    try frame.pushValue(2); // base
    try test_helpers.executeOpcode(opcodes.arithmetic.op_exp, &frame);
    try testing.expectEqual(@as(u256, 0), try frame.popValue()); // Overflows to 0
}

// Test JUMPDEST validation edge cases
test "Integration: jump destination validation" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Create code with JUMPDEST in data section of PUSH
    const code = [_]u8{
        0x60, 0x5B, // PUSH1 0x5B (0x5B is JUMPDEST opcode, but it's data here)
        0x00,       // STOP
        0x5B,       // JUMPDEST (valid at position 3)
        0x00,       // STOP
    };
    
    vm.setCode(test_helpers.TEST_CONTRACT_ADDRESS, &code);
    vm.vm.test_valid_jumpdests.put(3, true) catch unreachable;
    
    // Jump to position 1 (inside PUSH data) - should fail
    try frame.pushValue(1);
    const result1 = test_helpers.executeOpcode(opcodes.control.op_jump, &frame);
    try testing.expectError(ExecutionError.Error.InvalidJump, result1);
    
    // Jump to position 3 (valid JUMPDEST) - should succeed
    frame.stack.clear();
    try frame.pushValue(3);
    const result2 = try test_helpers.executeOpcode(opcodes.control.op_jump, &frame);
    try testing.expectEqual(@as(?usize, 3), result2.jump_dest);
}

// Test cold/warm storage slot transitions
test "Integration: storage slot temperature transitions" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    frame.frame.gas_remaining = 10000;
    
    // First access to slot 100 - cold
    try frame.pushValue(100); // slot
    const gas_before_cold = frame.frame.gas_remaining;
    try test_helpers.executeOpcode(opcodes.storage.op_sload, &frame);
    const cold_gas = gas_before_cold - frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2000), cold_gas); // 2100 - 100 base cost
    
    _ = try frame.popValue(); // Discard result
    
    // Second access to slot 100 - warm
    try frame.pushValue(100); // slot
    const gas_before_warm = frame.frame.gas_remaining;
    try test_helpers.executeOpcode(opcodes.storage.op_sload, &frame);
    const warm_gas = gas_before_warm - frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 0), warm_gas); // Only base cost charged by jump table
    
    _ = try frame.popValue(); // Discard result
    
    // Access different slot - cold again
    try frame.pushValue(200); // different slot
    const gas_before_cold2 = frame.frame.gas_remaining;
    try test_helpers.executeOpcode(opcodes.storage.op_sload, &frame);
    const cold_gas2 = gas_before_cold2 - frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2000), cold_gas2);
}

// Test MCOPY with overlapping regions
test "Integration: MCOPY overlap handling" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write pattern to memory
    var i: usize = 0;
    while (i < 10) : (i += 1) {
        try frame.memory.write_byte(i, @intCast(i + 1)); // 1,2,3,4,5,6,7,8,9,10
    }
    
    // Test forward overlap (source < dest, overlapping)
    try frame.pushValue(6); // length
    try frame.pushValue(2); // source offset
    try frame.pushValue(5); // dest offset (overlaps last 3 bytes)
    
    try test_helpers.executeOpcode(opcodes.memory.op_mcopy, &frame);
    
    // Memory should be: 1,2,3,4,5,3,4,5,6,7,8
    try testing.expectEqual(@as(u8, 3), frame.memory.read_byte(5));
    try testing.expectEqual(@as(u8, 4), frame.memory.read_byte(6));
    try testing.expectEqual(@as(u8, 5), frame.memory.read_byte(7));
    try testing.expectEqual(@as(u8, 6), frame.memory.read_byte(8));
    try testing.expectEqual(@as(u8, 7), frame.memory.read_byte(9));
    try testing.expectEqual(@as(u8, 8), frame.memory.read_byte(10));
}