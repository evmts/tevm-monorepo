const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// 0x30-0x39 Environmental Information Opcodes
// ============================

test "ADDRESS (0x30): Push current contract address" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Create contract with specific address
    const contract_addr = [_]u8{0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF} ++ [_]u8{0} ** 12;
    var contract = try helpers.createTestContract(
        allocator,
        @as(helpers.Address.Address, contract_addr),
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Execute ADDRESS opcode
    _ = try helpers.executeOpcode(0x30, test_vm.vm, test_frame.frame);
    
    // Check result - address should be zero-extended to u256
    const expected = helpers.Address.to_u256(contract_addr);
    try helpers.expectStackValue(test_frame.frame, 0, expected);
}

test "BALANCE (0x31): Get account balance" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Set balances for test addresses
    const test_balance: u256 = 1_000_000_000_000_000_000; // 1 ETH in wei
    try test_vm.vm.balances.put(helpers.TestAddresses.ALICE, test_balance);
    try test_vm.vm.balances.put(helpers.TestAddresses.BOB, test_balance * 2);
    
    // Test 1: Check ALICE's balance
    try test_frame.pushStack(&[_]u256{helpers.Address.to_u256(helpers.TestAddresses.ALICE)});
    _ = try helpers.executeOpcode(0x31, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, test_balance);
    _ = try test_frame.popStack();
    
    // Test 2: Check BOB's balance
    try test_frame.pushStack(&[_]u256{helpers.Address.to_u256(helpers.TestAddresses.BOB)});
    _ = try helpers.executeOpcode(0x31, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, test_balance * 2);
    _ = try test_frame.popStack();
    
    // Test 3: Check non-existent account (should return 0)
    const zero_addr = helpers.Address.zero();
    try test_frame.pushStack(&[_]u256{helpers.Address.to_u256(zero_addr)});
    _ = try helpers.executeOpcode(0x31, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "ORIGIN (0x32): Get transaction origin" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Set transaction origin
    test_vm.vm.tx_origin = helpers.TestAddresses.ALICE;
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.BOB, // Caller is different from origin
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Execute ORIGIN opcode
    _ = try helpers.executeOpcode(0x32, test_vm.vm, test_frame.frame);
    
    // Should push tx_origin (ALICE), not caller (BOB)
    const expected = helpers.Address.to_u256(helpers.TestAddresses.ALICE);
    try helpers.expectStackValue(test_frame.frame, 0, expected);
}

test "CALLER (0x33): Get immediate caller" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Set transaction origin different from caller
    test_vm.vm.tx_origin = helpers.TestAddresses.ALICE;
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.BOB, // Immediate caller
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Execute CALLER opcode
    _ = try helpers.executeOpcode(0x33, test_vm.vm, test_frame.frame);
    
    // Should push caller (BOB), not origin (ALICE)
    const expected = helpers.Address.to_u256(helpers.TestAddresses.BOB);
    try helpers.expectStackValue(test_frame.frame, 0, expected);
}

test "CALLVALUE (0x34): Get msg.value" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const test_cases = [_]u256{
        0,                              // No value
        1,                              // 1 wei
        1_000_000_000_000_000_000,      // 1 ETH
        std.math.maxInt(u256),          // Max value
    };
    
    for (test_cases) |value| {
        var contract = try helpers.createTestContract(
            allocator,
            helpers.TestAddresses.CONTRACT,
            helpers.TestAddresses.ALICE,
            value, // Set call value
            &[_]u8{},
        );
        defer contract.deinit(allocator, null);
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();
        
        // Execute CALLVALUE opcode
        _ = try helpers.executeOpcode(0x34, test_vm.vm, test_frame.frame);
        
        try helpers.expectStackValue(test_frame.frame, 0, value);
    }
}

test "CALLDATALOAD (0x35): Load 32 bytes from calldata" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Create test calldata
    const calldata = [_]u8{
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
        0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20,
        0x21, 0x22, 0x23, 0x24, // Extra bytes
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
    
    // Set calldata in frame
    test_frame.frame.input = &calldata;
    
    // Test 1: Load from offset 0
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x35, test_vm.vm, test_frame.frame);
    
    // Expected: first 32 bytes as big-endian u256
    const expected1: u256 = 0x0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20;
    try helpers.expectStackValue(test_frame.frame, 0, expected1);
    _ = try test_frame.popStack();
    
    // Test 2: Load from offset 4 
    try test_frame.pushStack(&[_]u256{4});
    _ = try helpers.executeOpcode(0x35, test_vm.vm, test_frame.frame);
    
    const expected2: u256 = 0x05060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F2021222324;
    try helpers.expectStackValue(test_frame.frame, 0, expected2);
    _ = try test_frame.popStack();
    
    // Test 3: Load beyond calldata (should pad with zeros)
    try test_frame.pushStack(&[_]u256{32});
    _ = try helpers.executeOpcode(0x35, test_vm.vm, test_frame.frame);
    
    const expected3: u256 = 0x2122232400000000000000000000000000000000000000000000000000000000;
    try helpers.expectStackValue(test_frame.frame, 0, expected3);
    _ = try test_frame.popStack();
    
    // Test 4: Load from very large offset (should return 0)
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u256) - 10});
    _ = try helpers.executeOpcode(0x35, test_vm.vm, test_frame.frame);
    
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "CALLDATASIZE (0x36): Get calldata size" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const test_cases = [_]struct {
        data: []const u8,
        desc: []const u8,
    }{
        .{ .data = &[_]u8{}, .desc = "empty calldata" },
        .{ .data = &[_]u8{0x42}, .desc = "1 byte" },
        .{ .data = &[_]u8{0x00} ** 32, .desc = "32 bytes" },
        .{ .data = &[_]u8{0xFF} ** 100, .desc = "100 bytes" },
    };
    
    for (test_cases) |tc| {
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
        test_frame.frame.input = tc.data;
        
        // Execute CALLDATASIZE
        _ = try helpers.executeOpcode(0x36, test_vm.vm, test_frame.frame);
        
        try helpers.expectStackValue(test_frame.frame, 0, tc.data.len);
    }
}

test "CALLDATACOPY (0x37): Copy calldata to memory" {
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
    
    // Test 1: Copy all calldata to memory at offset 0
    try test_frame.pushStack(&[_]u256{ calldata.len, 0, 0 }); // size, data_offset, mem_offset
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);
    
    // Check memory contents
    const mem_slice1 = try test_frame.frame.memory.get_slice(0, calldata.len);
    try testing.expectEqualSlices(u8, &calldata, mem_slice1);
    
    // Test 2: Copy partial calldata to different memory offset
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 8, 4, 32 }); // size=8, data_offset=4, mem_offset=32
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);
    
    const mem_slice2 = try test_frame.frame.memory.get_slice(32, 8);
    try testing.expectEqualSlices(u8, calldata[4..12], mem_slice2);
    
    // Test 3: Copy with data offset beyond calldata (should pad with zeros)
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 8, 12, 0 }); // size=8, data_offset=12, mem_offset=0
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);
    
    const mem_slice3 = try test_frame.frame.memory.get_slice(0, 8);
    const expected3 = [_]u8{0x0D, 0x0E, 0x0F, 0x10, 0x00, 0x00, 0x00, 0x00};
    try testing.expectEqualSlices(u8, &expected3, mem_slice3);
    
    // Test 4: Zero size copy (no-op)
    const gas_before = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ 0, 0, 0 }); // size=0
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);
    
    // Should only consume base gas (3)
    try testing.expectEqual(gas_before - 3, test_frame.frame.gas_remaining);
}

test "CODESIZE (0x38): Get code size" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const test_cases = [_]struct {
        code: []const u8,
        desc: []const u8,
    }{
        .{ .code = &[_]u8{}, .desc = "empty code" },
        .{ .code = &[_]u8{0x60, 0x00, 0x60, 0x00, 0x01}, .desc = "5 byte code" },
        .{ .code = &[_]u8{0xFF} ** 100, .desc = "100 byte code" },
    };
    
    for (test_cases) |tc| {
        var contract = try helpers.createTestContract(
            allocator,
            helpers.TestAddresses.CONTRACT,
            helpers.TestAddresses.ALICE,
            0,
            tc.code,
        );
        defer contract.deinit(allocator, null);
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();
        
        // Execute CODESIZE
        _ = try helpers.executeOpcode(0x38, test_vm.vm, test_frame.frame);
        
        try helpers.expectStackValue(test_frame.frame, 0, tc.code.len);
    }
}

test "CODECOPY (0x39): Copy code to memory" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const code = [_]u8{
        0x60, 0x00, // PUSH1 0
        0x60, 0x01, // PUSH1 1
        0x01,       // ADD
        0x60, 0x00, // PUSH1 0
        0x55,       // SSTORE
        0x00,       // STOP
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
    
    // Test 1: Copy all code to memory
    try test_frame.pushStack(&[_]u256{ code.len, 0, 0 }); // size, code_offset, mem_offset
    _ = try helpers.executeOpcode(0x39, test_vm.vm, test_frame.frame);
    
    const mem_slice1 = try test_frame.frame.memory.get_slice(0, code.len);
    try testing.expectEqualSlices(u8, &code, mem_slice1);
    
    // Test 2: Copy partial code
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 4, 2, 10 }); // size=4, code_offset=2, mem_offset=10
    _ = try helpers.executeOpcode(0x39, test_vm.vm, test_frame.frame);
    
    const mem_slice2 = try test_frame.frame.memory.get_slice(10, 4);
    try testing.expectEqualSlices(u8, code[2..6], mem_slice2);
    
    // Test 3: Copy beyond code size (should pad with zeros)
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 10, 5, 0 }); // size=10, code_offset=5, mem_offset=0
    _ = try helpers.executeOpcode(0x39, test_vm.vm, test_frame.frame);
    
    const mem_slice3 = try test_frame.frame.memory.get_slice(0, 10);
    var expected: [10]u8 = undefined;
    const remaining = code.len - 5; // 9 - 5 = 4 bytes remaining
    @memcpy(expected[0..remaining], code[5..]);
    @memset(expected[remaining..], 0x00);
    try testing.expectEqualSlices(u8, &expected, mem_slice3);
}

test "GASPRICE (0x3A): Get gas price" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const test_prices = [_]u256{
        0,                    // Zero gas price (possible in some contexts)
        1_000_000_000,        // 1 Gwei
        20_000_000_000,       // 20 Gwei (typical)
        100_000_000_000,      // 100 Gwei (high)
        std.math.maxInt(u256), // Max possible
    };
    
    for (test_prices) |price| {
        test_vm.vm.gas_price = price;
        
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
        
        // Execute GASPRICE
        _ = try helpers.executeOpcode(0x3A, test_vm.vm, test_frame.frame);
        
        try helpers.expectStackValue(test_frame.frame, 0, price);
    }
}

// ============================
// Gas consumption tests
// ============================

test "Environmental opcodes: Gas consumption" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x60, 0x00}, // Simple code
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    const simple_opcodes = [_]struct {
        opcode: u8,
        name: []const u8,
        expected_gas: u64,
    }{
        .{ .opcode = 0x30, .name = "ADDRESS", .expected_gas = 2 },
        .{ .opcode = 0x32, .name = "ORIGIN", .expected_gas = 2 },
        .{ .opcode = 0x33, .name = "CALLER", .expected_gas = 2 },
        .{ .opcode = 0x34, .name = "CALLVALUE", .expected_gas = 2 },
        .{ .opcode = 0x36, .name = "CALLDATASIZE", .expected_gas = 2 },
        .{ .opcode = 0x38, .name = "CODESIZE", .expected_gas = 2 },
        .{ .opcode = 0x3A, .name = "GASPRICE", .expected_gas = 2 },
    };
    
    for (simple_opcodes) |op| {
        test_frame.frame.stack.clear();
        const gas_before = 1000;
        test_frame.frame.gas_remaining = gas_before;
        
        _ = try helpers.executeOpcode(op.opcode, test_vm.vm, test_frame.frame);
        
        const gas_used = gas_before - test_frame.frame.gas_remaining;
        try testing.expectEqual(op.expected_gas, gas_used);
    }
}

// ============================
// Edge cases and error conditions
// ============================

test "Environmental opcodes: Stack underflow" {
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
    
    // Opcodes that require stack arguments
    const stack_opcodes = [_]u8{
        0x31, // BALANCE - needs 1 arg
        0x35, // CALLDATALOAD - needs 1 arg
        0x37, // CALLDATACOPY - needs 3 args
        0x39, // CODECOPY - needs 3 args
    };
    
    for (stack_opcodes) |opcode| {
        test_frame.frame.stack.clear();
        
        const result = helpers.executeOpcode(opcode, test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
    }
}

test "Environmental opcodes: Memory expansion limits" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x00}, // Minimal code
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100); // Limited gas
    defer test_frame.deinit();
    
    // Test CODECOPY with huge memory offset
    const huge_offset = 1_000_000;
    try test_frame.pushStack(&[_]u256{ 32, 0, huge_offset }); // size=32, code_offset=0, mem_offset=huge
    
    const result = helpers.executeOpcode(0x39, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfGas, result);
}

test "BALANCE: EIP-2929 cold/warm account access" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // First access to an address should be cold (2600 gas)
    try test_frame.pushStack(&[_]u256{helpers.Address.to_u256(helpers.TestAddresses.BOB)});
    const gas_before_cold = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x31, test_vm.vm, test_frame.frame);
    const gas_cold = gas_before_cold - test_frame.frame.gas_remaining;
    
    // Second access should be warm (100 gas)
    _ = try test_frame.popStack();
    try test_frame.pushStack(&[_]u256{helpers.Address.to_u256(helpers.TestAddresses.BOB)});
    const gas_before_warm = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x31, test_vm.vm, test_frame.frame);
    const gas_warm = gas_before_warm - test_frame.frame.gas_remaining;
    
    // Cold access should cost more than warm
    try testing.expect(gas_cold > gas_warm);
    try testing.expectEqual(@as(u64, 2600), gas_cold);
    try testing.expectEqual(@as(u64, 100), gas_warm);
}