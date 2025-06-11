const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes to test
const evm = @import("evm");
const environment = evm.execution.environment;

test "Environment: CALLDATALOAD opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up contract with calldata
    const calldata = [_]u8{
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, // 0-7
        0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10, // 8-15  
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, // 16-23
        0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20, // 24-31
        0x21, 0x22, 0x23, 0x24, // 32-35 (additional bytes)
    };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Set calldata for this frame
    test_frame.frame.input = &calldata;

    // Test 1: Load from offset 0 (should get first 32 bytes)
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x35, test_vm.vm, test_frame.frame);

    // Expected value: 0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20
    const expected_word_0: u256 = 0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20;
    try helpers.expectStackValue(test_frame.frame, 0, expected_word_0);

    // Check gas after first operation
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastestStep);

    // Test 2: Load from offset 4 (should get bytes 4-35, with last 28 bytes from calldata)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{4});
    _ = try helpers.executeOpcode(0x35, test_vm.vm, test_frame.frame);

    // Expected: bytes 4-35, with zeros for missing bytes
    // Calculate expected value manually for bytes 4-35
    var expected_word_4: u256 = 0;
    for (0..32) |i| {
        const byte_idx = 4 + i;
        const byte_val: u256 = if (byte_idx < calldata.len) calldata[byte_idx] else 0;
        expected_word_4 = (expected_word_4 << 8) | byte_val;
    }
    try helpers.expectStackValue(test_frame.frame, 0, expected_word_4);

    // Test 3: Load from offset beyond calldata (should return all zeros)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{100});
    _ = try helpers.executeOpcode(0x35, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, 0);

    // Test 4: Load from very large offset
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u32)}); // Large but safe value
    _ = try helpers.executeOpcode(0x35, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "Environment: CALLDATASIZE opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Test 1: Contract with calldata
    const calldata = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05};
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Set calldata
    test_frame.frame.input = &calldata;

    // Execute CALLDATASIZE
    _ = try helpers.executeOpcode(0x36, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, 5);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);

    // Test 2: Contract with no calldata
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 1000; // Reset gas
    test_frame.frame.input = &[_]u8{}; // Empty calldata

    _ = try helpers.executeOpcode(0x36, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "Environment: CALLDATACOPY opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const calldata = [_]u8{
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
    };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Set calldata
    test_frame.frame.input = &calldata;

    // Test 1: Copy entire calldata to memory at offset 0
    try test_frame.pushStack(&[_]u256{
        calldata.len, // size
        0, // data offset  
        0, // memory offset
    });
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    // Verify data was copied correctly
    for (calldata, 0..) |byte, i| {
        const mem_byte = try test_frame.frame.memory.get_byte(i);
        try testing.expectEqual(byte, mem_byte);
    }

    // Test 2: Copy partial calldata with offset
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{
        8, // size (copy 8 bytes)
        4, // data offset (skip first 4 bytes)
        32, // memory offset
    });
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    // Verify partial copy
    for (0..8) |i| {
        const mem_byte = try test_frame.frame.memory.get_byte(32 + i);
        try testing.expectEqual(calldata[4 + i], mem_byte);
    }

    // Test 3: Copy beyond calldata (should pad with zeros)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{
        32, // size (longer than calldata)
        0, // data offset
        64, // memory offset
    });
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    // Verify original data
    for (calldata, 0..) |byte, i| {
        const mem_byte = try test_frame.frame.memory.get_byte(64 + i);
        try testing.expectEqual(byte, mem_byte);
    }

    // Verify zero padding
    for (calldata.len..32) |i| {
        const mem_byte = try test_frame.frame.memory.get_byte(64 + i);
        try testing.expectEqual(@as(u8, 0), mem_byte);
    }

    // Test 4: Zero size copy (should be no-op)
    test_frame.frame.stack.clear();
    const initial_gas = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{
        0, // size
        0, // data offset
        96, // memory offset
    });
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    // Should only consume minimal gas for stack operations
    const gas_used = initial_gas - test_frame.frame.gas_remaining;
    try testing.expect(gas_used < 10); // Minimal gas for no-op
}

test "Environment: CODESIZE opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Test 1: Contract with code
    const contract_code = [_]u8{0x60, 0x00, 0x60, 0x00, 0x00}; // PUSH1 0 PUSH1 0 STOP
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &contract_code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Execute CODESIZE
    _ = try helpers.executeOpcode(0x38, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, contract_code.len);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);

    // Test 2: Contract with empty code
    const empty_code = [_]u8{};
    var empty_contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.BOB,
        helpers.TestAddresses.ALICE,
        0,
        &empty_code,
    );
    defer empty_contract.deinit(allocator, null);

    var empty_test_frame = try helpers.TestFrame.init(allocator, &empty_contract, 1000);
    defer empty_test_frame.deinit();

    _ = try helpers.executeOpcode(0x38, test_vm.vm, empty_test_frame.frame);

    try helpers.expectStackValue(empty_test_frame.frame, 0, 0);
}

test "Environment: CODECOPY opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const contract_code = [_]u8{
        0x60, 0x01, // PUSH1 1
        0x60, 0x02, // PUSH1 2  
        0x01, // ADD
        0x60, 0x03, // PUSH1 3
        0x02, // MUL
        0x00, // STOP
    };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &contract_code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test 1: Copy entire code to memory
    try test_frame.pushStack(&[_]u256{
        contract_code.len, // size
        0, // code offset
        0, // memory offset
    });
    _ = try helpers.executeOpcode(0x39, test_vm.vm, test_frame.frame);

    // Verify code was copied correctly
    for (contract_code, 0..) |byte, i| {
        const mem_byte = try test_frame.frame.memory.get_byte(i);
        try testing.expectEqual(byte, mem_byte);
    }

    // Test 2: Copy partial code with offset
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{
        4, // size (copy 4 bytes)
        2, // code offset (skip first 2 bytes)
        32, // memory offset
    });
    _ = try helpers.executeOpcode(0x39, test_vm.vm, test_frame.frame);

    // Verify partial copy
    for (0..4) |i| {
        const mem_byte = try test_frame.frame.memory.get_byte(32 + i);
        try testing.expectEqual(contract_code[2 + i], mem_byte);
    }

    // Test 3: Copy beyond code length (should pad with zeros)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{
        16, // size (longer than code)
        0, // code offset
        64, // memory offset
    });
    _ = try helpers.executeOpcode(0x39, test_vm.vm, test_frame.frame);

    // Verify original code
    for (contract_code, 0..) |byte, i| {
        const mem_byte = try test_frame.frame.memory.get_byte(64 + i);
        try testing.expectEqual(byte, mem_byte);
    }

    // Verify zero padding
    for (contract_code.len..16) |i| {
        const mem_byte = try test_frame.frame.memory.get_byte(64 + i);
        try testing.expectEqual(@as(u8, 0), mem_byte);
    }
}

test "Environment: Data operations gas consumption" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const calldata = [_]u8{0x01, 0x02, 0x03, 0x04};
    const contract_code = [_]u8{0x60, 0x00, 0x00}; // PUSH1 0 STOP

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &contract_code,
    );
    defer contract.deinit(allocator, null);

    // Test gas costs for each opcode
    const test_cases = [_]struct { opcode: u8, has_stack_input: bool, expected_gas: u64 }{
        .{ .opcode = 0x35, .has_stack_input = true, .expected_gas = helpers.opcodes.gas_constants.GasFastestStep }, // CALLDATALOAD
        .{ .opcode = 0x36, .has_stack_input = false, .expected_gas = helpers.opcodes.gas_constants.GasQuickStep }, // CALLDATASIZE
        .{ .opcode = 0x38, .has_stack_input = false, .expected_gas = helpers.opcodes.gas_constants.GasQuickStep }, // CODESIZE
        // CALLDATACOPY and CODECOPY have dynamic gas costs based on size, tested separately
    };

    for (test_cases) |test_case| {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        test_frame.frame.input = &calldata;

        // Set up stack input if needed
        if (test_case.has_stack_input) {
            try test_frame.pushStack(&[_]u256{0}); // Valid offset
        }

        _ = try helpers.executeOpcode(test_case.opcode, test_vm.vm, test_frame.frame);

        try helpers.expectGasUsed(test_frame.frame, 1000, test_case.expected_gas);
    }
}

test "Environment: Stack underflow errors for data operations" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test opcodes that require stack items
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x35, test_vm.vm, test_frame.frame)); // CALLDATALOAD

    // CALLDATACOPY needs 3 stack items
    try test_frame.pushStack(&[_]u256{ 1, 2 }); // Only 2 items
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame));

    // CODECOPY needs 3 stack items
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 1, 2 }); // Only 2 items
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x39, test_vm.vm, test_frame.frame));
}

test "Environment: Data operations edge cases" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const large_calldata = [_]u8{0xFF} ** 1000; // Large calldata
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x60, 0x00}, // Small code
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000);
    defer test_frame.deinit();

    test_frame.frame.input = &large_calldata;

    // Test CALLDATALOAD with large offset
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u32)});
    _ = try helpers.executeOpcode(0x35, test_vm.vm, test_frame.frame);
    
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Should return 0

    // Test CALLDATACOPY with large size (should handle gracefully)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{
        1000, // size
        0, // data offset
        0, // memory offset
    });
    
    // This should work but consume appropriate gas for memory expansion
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);
    
    // Verify the data was copied
    for (0..100) |i| { // Check first 100 bytes
        const mem_byte = try test_frame.frame.memory.get_byte(i);
        try testing.expectEqual(@as(u8, 0xFF), mem_byte);
    }
}