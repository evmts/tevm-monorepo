const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes to test
const evm = @import("evm");
const environment = evm.opcodes.environment;

test "Environment: ADDRESS opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const contract_address = helpers.TestAddresses.CONTRACT;
    var contract = try helpers.createTestContract(
        allocator,
        contract_address,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Execute ADDRESS opcode
    _ = try helpers.executeOpcode(0x30, test_vm.vm, test_frame.frame);

    // Should push contract address to stack
    const result = try test_frame.frame.stack.peek_n(0);
    const expected = helpers.Address.to_u256(contract_address);
    try testing.expectEqual(expected, result);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
}

test "Environment: BALANCE opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up accounts with balances
    const test_balance: u256 = 1000000;
    try test_vm.vm.balances.put(helpers.TestAddresses.ALICE, test_balance);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.BOB,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test 1: Get balance of existing account
    const alice_u256 = helpers.Address.to_u256(helpers.TestAddresses.ALICE);
    try test_frame.pushStack(&[_]u256{alice_u256});
    _ = try helpers.executeOpcode(0x31, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, test_balance);

    // Test 2: Get balance of non-existent account (should return 0)
    test_frame.frame.stack.clear();
    const random_address = helpers.Address.to_u256(helpers.TestAddresses.RANDOM);
    try test_frame.pushStack(&[_]u256{random_address});
    _ = try helpers.executeOpcode(0x31, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "Environment: ORIGIN and CALLER opcodes" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set transaction origin
    test_vm.vm.tx_origin = helpers.TestAddresses.ALICE;

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.BOB, // caller
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test ORIGIN
    _ = try helpers.executeOpcode(0x32, test_vm.vm, test_frame.frame);
    const origin_result = try test_frame.frame.stack.peek_n(0);
    const expected_origin = helpers.Address.to_u256(helpers.TestAddresses.ALICE);
    try testing.expectEqual(expected_origin, origin_result);

    // Test CALLER
    test_frame.frame.stack.clear();
    _ = try helpers.executeOpcode(0x33, test_vm.vm, test_frame.frame);
    const caller_result = try test_frame.frame.stack.peek_n(0);
    const expected_caller = helpers.Address.to_u256(helpers.TestAddresses.BOB);
    try testing.expectEqual(expected_caller, caller_result);
}

test "Environment: CALLVALUE opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const call_value: u256 = 500000;
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        call_value,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Execute CALLVALUE
    _ = try helpers.executeOpcode(0x34, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, call_value);
}

test "Environment: GASPRICE opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set gas price
    const gas_price: u256 = 20_000_000_000; // 20 gwei
    test_vm.vm.gas_price = gas_price;

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

    try helpers.expectStackValue(test_frame.frame, 0, gas_price);
}

test "Environment: EXTCODESIZE opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up account with code
    const test_code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0x00 }; // PUSH1 0 PUSH1 0 STOP
    try test_vm.vm.balances.put(helpers.TestAddresses.BOB, 0);
    try test_vm.vm.code.put(helpers.TestAddresses.BOB, &test_code);

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

    // Test 1: Get code size of account with code
    const bob_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);
    try test_frame.pushStack(&[_]u256{bob_u256});
    _ = try helpers.executeOpcode(0x3B, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, test_code.len);

    // Test 2: Get code size of account without code
    test_frame.frame.stack.clear();
    const alice_u256 = helpers.Address.to_u256(helpers.TestAddresses.ALICE);
    try test_frame.pushStack(&[_]u256{alice_u256});
    _ = try helpers.executeOpcode(0x3B, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "Environment: EXTCODECOPY opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up account with code
    const test_code = [_]u8{
        0x60, 0x01, // PUSH1 1
        0x60, 0x02, // PUSH1 2
        0x01, // ADD
        0x60, 0x03, // PUSH1 3
        0x02, // MUL
        0x00, // STOP
    };
    try test_vm.vm.balances.put(helpers.TestAddresses.BOB, 0);
    try test_vm.vm.code.put(helpers.TestAddresses.BOB, &test_code);

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

    // Test 1: Copy entire code
    const bob_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);
    try test_frame.pushStack(&[_]u256{
        test_code.len, // size
        0, // code offset
        0, // memory offset
        bob_u256, // address
    });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    // Verify code was copied to memory
    for (test_code, 0..) |byte, i| {
        const mem_byte = try test_frame.frame.memory.get_byte(i);
        try testing.expectEqual(byte, mem_byte);
    }

    // Test 2: Copy partial code with offset
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{
        4, // size (copy 4 bytes)
        2, // code offset (skip first 2 bytes)
        32, // memory offset
        bob_u256, // address
    });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    // Verify partial copy
    for (0..4) |i| {
        const mem_byte = try test_frame.frame.memory.get_byte(32 + i);
        try testing.expectEqual(test_code[2 + i], mem_byte);
    }

    // Test 3: Copy beyond code length (should pad with zeros)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{
        16, // size (longer than code)
        0, // code offset
        64, // memory offset
        bob_u256, // address
    });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    // Verify padding with zeros
    for (test_code.len..16) |i| {
        const mem_byte = try test_frame.frame.memory.get_byte(64 + i);
        try testing.expectEqual(@as(u8, 0), mem_byte);
    }
}

test "Environment: EXTCODEHASH opcode" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up account with code
    const test_code = [_]u8{ 0x60, 0x00, 0x00 }; // PUSH1 0 STOP
    try test_vm.vm.balances.put(helpers.TestAddresses.BOB, 0);
    try test_vm.vm.code.put(helpers.TestAddresses.BOB, &test_code);

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

    // Test 1: Get hash of account with code
    const bob_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);
    try test_frame.pushStack(&[_]u256{bob_u256});
    _ = try helpers.executeOpcode(0x3F, test_vm.vm, test_frame.frame);

    const hash = try test_frame.frame.stack.peek_n(0);
    try testing.expect(hash != 0); // Should be non-zero hash

    // Test 2: Get hash of empty account (should return 0)
    test_frame.frame.stack.clear();
    const alice_u256 = helpers.Address.to_u256(helpers.TestAddresses.ALICE);
    try test_frame.pushStack(&[_]u256{alice_u256});
    _ = try helpers.executeOpcode(0x3F, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "Environment: SELFBALANCE opcode (Istanbul)" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set balance for contract
    const contract_balance: u256 = 2_000_000;
    try test_vm.vm.balances.put(helpers.TestAddresses.CONTRACT, contract_balance);

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

    // Execute SELFBALANCE
    _ = try helpers.executeOpcode(0x47, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, contract_balance);
    try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastStep);
}

test "Environment: CHAINID opcode (Istanbul)" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set chain ID
    const chain_id: u256 = 1; // Mainnet
    test_vm.vm.chain_id = chain_id;

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

    // Execute CHAINID
    _ = try helpers.executeOpcode(0x46, test_vm.vm, test_frame.frame);

    try helpers.expectStackValue(test_frame.frame, 0, chain_id);
}

test "Environment: Cold/Warm address access (EIP-2929)" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up account
    try test_vm.vm.balances.put(helpers.TestAddresses.BOB, 1000);

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

    // First access should be cold (2600 gas)
    const bob_u256 = helpers.Address.to_u256(helpers.TestAddresses.BOB);
    try test_frame.pushStack(&[_]u256{bob_u256});
    const initial_gas = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x31, test_vm.vm, test_frame.frame);
    const cold_gas_used = initial_gas - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2600), cold_gas_used);

    // Second access should be warm (100 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{bob_u256});
    const warm_initial_gas = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x31, test_vm.vm, test_frame.frame);
    const warm_gas_used = warm_initial_gas - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 100), warm_gas_used); // Warm access costs 100 gas
}

test "Environment: Stack underflow errors" {
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
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x31, test_vm.vm, test_frame.frame));

    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x3B, test_vm.vm, test_frame.frame));

    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x3F, test_vm.vm, test_frame.frame));

    // EXTCODECOPY needs 4 stack items
    try test_frame.pushStack(&[_]u256{ 1, 2, 3 }); // Only 3 items
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame));
}
