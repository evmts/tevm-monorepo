const std = @import("std");
const testing = std.testing;
const opcodes = @import("../../../src/evm/opcodes/package.zig");
const test_helpers = @import("test_helpers.zig");
const ExecutionError = opcodes.ExecutionError;

// Test SHA3 (KECCAK256) operation
test "SHA3: hash empty data" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push offset and length (0, 0 for empty data)
    try frame.pushValue(0); // length
    try frame.pushValue(0); // offset
    
    // Execute SHA3
    try test_helpers.executeOpcode(opcodes.crypto.op_sha3, &frame);
    
    // Expected hash of empty data: keccak256("") = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
    const expected_hash: u256 = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
    
    try testing.expectEqual(expected_hash, try frame.popValue());
    try testing.expectEqual(@as(usize, 0), frame.stack.items.len);
}

test "SHA3: hash single byte" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write byte 0x80 to memory
    try frame.memory.write_byte(0, 0x80);
    
    // Push offset and length
    try frame.pushValue(1); // length
    try frame.pushValue(0); // offset
    
    // Execute SHA3
    try test_helpers.executeOpcode(opcodes.crypto.op_sha3, &frame);
    
    // Expected hash of 0x80: keccak256(0x80) = 0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421
    const expected_hash: u256 = 0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421;
    
    try testing.expectEqual(expected_hash, try frame.popValue());
}

test "SHA3: hash 32 bytes" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write 32 bytes of 0xFF to memory
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        try frame.memory.write_byte(i, 0xFF);
    }
    
    // Push offset and length
    try frame.pushValue(32); // length
    try frame.pushValue(0);  // offset
    
    // Execute SHA3
    try test_helpers.executeOpcode(opcodes.crypto.op_sha3, &frame);
    
    // Expected hash of 32 bytes of 0xFF
    const expected_hash: u256 = 0xe3a703e3a25fea77d32351c5e7a5c96502e07e4317132eca97de59d9b5c4acbc;
    
    try testing.expectEqual(expected_hash, try frame.popValue());
}

test "SHA3: hash with offset" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write pattern to memory starting at offset 10
    var i: usize = 0;
    while (i < 10) : (i += 1) {
        try frame.memory.write_byte(10 + i, @intCast(i));
    }
    
    // Push offset and length
    try frame.pushValue(10); // length
    try frame.pushValue(10); // offset
    
    // Execute SHA3
    try test_helpers.executeOpcode(opcodes.crypto.op_sha3, &frame);
    
    // Result should be a valid hash
    const result = try frame.popValue();
    try testing.expect(result != 0);
}

test "SHA3: large data hash" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Write 1KB of data
    var i: usize = 0;
    while (i < 1024) : (i += 1) {
        try frame.memory.write_byte(i, @intCast(i % 256));
    }
    
    // Push offset and length
    try frame.pushValue(1024); // length
    try frame.pushValue(0);    // offset
    
    // Execute SHA3
    try test_helpers.executeOpcode(opcodes.crypto.op_sha3, &frame);
    
    // Result should be a valid hash
    const result = try frame.popValue();
    try testing.expect(result != 0);
}

test "SHA3: gas consumption" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 1000;
    
    // Push offset and length for 64 bytes
    try frame.pushValue(64); // length
    try frame.pushValue(0);  // offset
    
    // Execute SHA3
    try test_helpers.executeOpcode(opcodes.crypto.op_sha3, &frame);
    
    // SHA3 costs 30 + 6 * (size + 31) / 32
    // For 64 bytes: 30 + 6 * (64 + 31) / 32 = 30 + 6 * 2 = 42
    try testing.expectEqual(@as(u64, 958), frame.frame.gas_remaining);
}

test "SHA3: memory expansion gas" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 10000;
    
    // Push offset and length that requires memory expansion
    try frame.pushValue(32);  // length
    try frame.pushValue(256); // offset (requires expansion to 288 bytes)
    
    const initial_gas = frame.frame.gas_remaining;
    
    // Execute SHA3
    try test_helpers.executeOpcode(opcodes.crypto.op_sha3, &frame);
    
    // Gas should be consumed for both SHA3 and memory expansion
    try testing.expect(frame.frame.gas_remaining < initial_gas - 36); // At least SHA3 base cost + word cost
}

test "SHA3: stack underflow" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push only one value (need two)
    try frame.pushValue(0);
    
    // Execute SHA3 - should fail with stack underflow
    const result = test_helpers.executeOpcode(opcodes.crypto.op_sha3, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "SHA3: out of gas for large data" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set very limited gas
    frame.frame.gas_remaining = 10;
    
    // Push offset and length for large data
    try frame.pushValue(1000); // length
    try frame.pushValue(0);    // offset
    
    // Execute SHA3 - should fail with out of gas
    const result = test_helpers.executeOpcode(opcodes.crypto.op_sha3, &frame);
    try testing.expectError(ExecutionError.Error.OutOfGas, result);
}

test "SHA3: offset overflow protection" {
    var vm = test_helpers.TestVm.init();
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push values that would overflow when added
    try frame.pushValue(std.math.maxInt(u256)); // length
    try frame.pushValue(std.math.maxInt(u256)); // offset
    
    // Execute SHA3 - should fail with out of offset
    const result = test_helpers.executeOpcode(opcodes.crypto.op_sha3, &frame);
    try testing.expectError(ExecutionError.Error.OutOfOffset, result);
}