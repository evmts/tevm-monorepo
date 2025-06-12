const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
<<<<<<< HEAD
const helpers = @import("test_helpers");
const opcodes = evm.opcodes;
const gas_constants = evm.gas_constants;

// Gas accounting tests to verify calculations match the Ethereum Yellow Paper

test "Gas: Arithmetic operations basic costs" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Create jump table for gas consumption
    const jump_table = helpers.JumpTable.new_frontier_instruction_set();

    // Test ADD (3 gas)
    try test_frame.pushStack(&[_]u256{ 10, 20 });
    const gas_before_add = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x01, &test_vm.vm, test_frame.frame); // 0x01 = ADD
    try testing.expectEqual(@as(u64, opcodes.gas_constants.GasFastestStep), gas_before_add - test_frame.frame.gas_remaining);

    // Test MUL (5 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 10, 20 });
    const gas_before_mul = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x02, &test_vm.vm, test_frame.frame); // 0x02 = MUL
    try testing.expectEqual(@as(u64, opcodes.gas_constants.GasFastStep), gas_before_mul - test_frame.frame.gas_remaining);

    // Test SUB (3 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 20, 10 });
    const gas_before_sub = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x03, &test_vm.vm, test_frame.frame); // 0x03 = SUB
    try testing.expectEqual(@as(u64, opcodes.gas_constants.GasFastestStep), gas_before_sub - test_frame.frame.gas_remaining);

    // Test DIV (5 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 20, 10 });
    const gas_before_div = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x04, &test_vm.vm, test_frame.frame); // 0x04 = DIV
    try testing.expectEqual(@as(u64, opcodes.gas_constants.GasFastStep), gas_before_div - test_frame.frame.gas_remaining);

    // Test ADDMOD (8 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 10, 20, 7 });
    const gas_before_addmod = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x08, &test_vm.vm, test_frame.frame); // 0x08 = ADDMOD
    try testing.expectEqual(@as(u64, opcodes.gas_constants.GasMidStep), gas_before_addmod - test_frame.frame.gas_remaining);
}

test "Gas: EXP dynamic gas calculation" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Create jump table for gas consumption
    const jump_table = helpers.JumpTable.new_frontier_instruction_set();

    // Test EXP with small exponent (10 + 50 * 1 = 60 gas)
    try test_frame.pushStack(&[_]u256{ 2, 8 }); // 2^8
    const gas_before_small = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x0a, &test_vm.vm, test_frame.frame); // 0x0a = EXP
    const gas_used_small = gas_before_small - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 10 + 50 * 1), gas_used_small);

    // Test EXP with larger exponent (2 bytes: 10 + 50 * 2 = 110 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 2, 0x1000 }); // 2^4096
    const gas_before_large = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x0a, &test_vm.vm, test_frame.frame); // 0x0a = EXP
    const gas_used_large = gas_before_large - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 10 + 50 * 2), gas_used_large);

    // Test EXP with zero exponent (10 gas only)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 2, 0 }); // 2^0
    const gas_before_zero = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x0a, &test_vm.vm, test_frame.frame); // 0x0a = EXP
    const gas_used_zero = gas_before_zero - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 10), gas_used_zero);
}

test "Gas: Memory expansion costs" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Create jump table for gas consumption
    const jump_table = helpers.JumpTable.new_frontier_instruction_set();

    // Test memory expansion to 32 bytes (1 word)
    // Cost = 3 * 1 + 1²/512 = 3 gas
    try test_frame.pushStack(&[_]u256{ 0, 42 }); // offset, value (stack reverses on pop)
    const gas_before_32 = test_frame.frame.gas_remaining;
    std.debug.print("\\n[Test MSTORE 1] Gas before executeOpcodeWithGas: {d}\\n", .{gas_before_32});
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x52, &test_vm.vm, test_frame.frame); // 0x52 = MSTORE
    std.debug.print("[Test MSTORE 1] Gas after executeOpcodeWithGas: {d}\\n", .{test_frame.frame.gas_remaining});
    const gas_used_32 = gas_before_32 - test_frame.frame.gas_remaining;
    std.debug.print("[Test MSTORE 1] gas_used_32 = {d} (expected 6, found {d})\n", .{ gas_used_32, gas_used_32 });
    try testing.expectEqual(@as(u64, 3 + 3), gas_used_32); // 3 for MSTORE + 3 for memory

    // Test expansion to 64 bytes (2 words)
    // Additional cost = 3 * 1 + 0 = 3 gas (total memory cost = 6)
    try test_frame.pushStack(&[_]u256{ 32, 99 }); // offset, value
    const gas_before_64 = test_frame.frame.gas_remaining;
    std.debug.print("\\n[Test MSTORE 2] Gas before executeOpcodeWithGas: {d}\\n", .{gas_before_64});
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x52, &test_vm.vm, test_frame.frame); // 0x52 = MSTORE
    std.debug.print("[Test MSTORE 2] Gas after executeOpcodeWithGas: {d}\\n", .{test_frame.frame.gas_remaining});
    const gas_used_64 = gas_before_64 - test_frame.frame.gas_remaining;
    std.debug.print("[Test MSTORE 2] gas_used_64 = {d} (expected 6, found {d})\n", .{ gas_used_64, gas_used_64 });
    try testing.expectEqual(@as(u64, 3 + 3), gas_used_64); // 3 for MSTORE + 3 for expansion

    // Test expansion to 1024 bytes (32 words)
    // Total memory cost = 3 * 32 + 32²/512 = 96 + 2 = 98
    // Previous memory cost = 3 * 2 + 2²/512 = 6 + 0 = 6
    // Additional cost = 98 - 6 = 92
    try test_frame.pushStack(&[_]u256{ 992, 111 }); // offset, value 992 (expands to 1024)
    const gas_before_1024 = test_frame.frame.gas_remaining;
    std.debug.print("\\n[Test MSTORE 3] Gas before executeOpcodeWithGas: {d}\\n", .{gas_before_1024});
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x52, &test_vm.vm, test_frame.frame); // 0x52 = MSTORE
    std.debug.print("[Test MSTORE 3] Gas after executeOpcodeWithGas: {d}\\n", .{test_frame.frame.gas_remaining});
    const gas_used_1024 = gas_before_1024 - test_frame.frame.gas_remaining;
    std.debug.print("[Test MSTORE 3] gas_used_1024 = {d} (expected 95, found {d})\n", .{ gas_used_1024, gas_used_1024 });
    try testing.expectEqual(@as(u64, 3 + 92), gas_used_1024); // 3 for MSTORE + 92 for expansion
}

test "Gas: SHA3 dynamic costs" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Create jump table for gas consumption
    const jump_table = helpers.JumpTable.new_frontier_instruction_set();

    // Prepare data in memory
    var i: usize = 0;
    while (i < 128) : (i += 1) {
        try test_frame.setMemory(i, &[_]u8{@intCast(i & 0xFF)});
    }

    // Test SHA3 of 0 bytes (30 gas only)
    try test_frame.pushStack(&[_]u256{ 0, 0 }); // size, offset
    const gas_before_0 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x20, &test_vm.vm, test_frame.frame); // 0x20 = SHA3
    const gas_used_0 = gas_before_0 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 30), gas_used_0);

    // Test SHA3 of 32 bytes (30 + 6 * 1 = 36 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 32, 0 }); // size, offset
    const gas_before_32 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x20, &test_vm.vm, test_frame.frame); // 0x20 = SHA3
    const gas_used_32 = gas_before_32 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 30 + 6), gas_used_32);

    // Test SHA3 of 64 bytes (30 + 6 * 2 = 42 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 64, 0 }); // size, offset
    const gas_before_64 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x20, &test_vm.vm, test_frame.frame); // 0x20 = SHA3
    const gas_used_64 = gas_before_64 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 30 + 12), gas_used_64);

    // Test SHA3 of 100 bytes (30 + 6 * 4 = 54 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 100, 0 }); // size, offset
    const gas_before_100 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x20, &test_vm.vm, test_frame.frame); // 0x20 = SHA3
    const gas_used_100 = gas_before_100 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 30 + 24), gas_used_100); // 4 words
}

test "Gas: LOG operations dynamic costs" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Create jump table for gas consumption
    const jump_table = helpers.JumpTable.new_frontier_instruction_set();

    // Prepare log data
    const log_data = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8 };
    try test_frame.setMemory(0, &log_data);

    // Test LOG0 (375 + 8 * data_size)
    try test_frame.pushStack(&[_]u256{ 8, 0 }); // size, offset
    const gas_before_log0 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0xa0, &test_vm.vm, test_frame.frame); // 0xa0 = LOG0
    const gas_used_log0 = gas_before_log0 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 375 + 8 * 8), gas_used_log0);

    // Test LOG1 (375 + 375 + 8 * data_size)
    test_frame.frame.stack.clear();
    // Free existing logs before clearing
    for (test_vm.vm.logs.items) |log| {
        test_vm.vm.allocator.free(log.topics);
        test_vm.vm.allocator.free(log.data);
    }
    test_vm.vm.logs.clearRetainingCapacity();
    try test_frame.pushStack(&[_]u256{ 0x1111, 8, 0 }); // topic, size, offset
    const gas_before_log1 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0xa1, &test_vm.vm, test_frame.frame); // 0xa1 = LOG1
    const gas_used_log1 = gas_before_log1 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 375 + 375 + 8 * 8), gas_used_log1);

    // Test LOG4 (375 + 4*375 + 8 * data_size)
    test_frame.frame.stack.clear();
    // Free existing logs before clearing
    for (test_vm.vm.logs.items) |log| {
        test_vm.vm.allocator.free(log.topics);
        test_vm.vm.allocator.free(log.data);
    }
    test_vm.vm.logs.clearRetainingCapacity();
    try test_frame.pushStack(&[_]u256{ 0x4444, 0x3333, 0x2222, 0x1111, 8, 0 });
    const gas_before_log4 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0xa4, &test_vm.vm, test_frame.frame); // 0xa4 = LOG4
    const gas_used_log4 = gas_before_log4 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 375 + 4 * 375 + 8 * 8), gas_used_log4);
}

test "Gas: Storage operations with access lists (EIP-2929)" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Create jump table for gas consumption with EIP-2929 support
    const jump_table = helpers.JumpTable.new_berlin_instruction_set();

    // Test SLOAD cold (2100 gas)
    const cold_slot: u256 = 12345;
    try test_frame.pushStack(&[_]u256{cold_slot});
    const gas_before_cold_sload = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x54, &test_vm.vm, test_frame.frame); // 0x54 = SLOAD
    const gas_used_cold_sload = gas_before_cold_sload - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, gas_constants.ColdSloadCost), gas_used_cold_sload);

    // Test SLOAD warm (100 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{cold_slot}); // Same slot, now warm
    const gas_before_warm_sload = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x54, &test_vm.vm, test_frame.frame); // 0x54 = SLOAD
    const gas_used_warm_sload = gas_before_warm_sload - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, gas_constants.WarmStorageReadCost), gas_used_warm_sload);

    // Test BALANCE cold address (2600 gas)
    test_frame.frame.stack.clear();
    const cold_address = helpers.toU256(helpers.TestAddresses.CHARLIE);
    try test_frame.pushStack(&[_]u256{cold_address});
    const gas_before_cold_balance = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x31, &test_vm.vm, test_frame.frame); // 0x31 = BALANCE
    const gas_used_cold_balance = gas_before_cold_balance - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, gas_constants.ColdAccountAccessCost), gas_used_cold_balance);

    // Test BALANCE warm address (100 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{cold_address}); // Same address, now warm
    const gas_before_warm_balance = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x31, &test_vm.vm, test_frame.frame); // 0x31 = BALANCE
    const gas_used_warm_balance = gas_before_warm_balance - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, gas_constants.WarmStorageReadCost), gas_used_warm_balance);
}

test "Gas: CALL operations gas forwarding" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        10000,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Mock successful call result
    test_vm.call_result = .{
        .success = true,
        .gas_left = 40000, // Will use 10000 gas
        .output = null,
    };
    test_vm.syncMocks();

    // Test CALL with gas calculation
    const target = helpers.toU256(helpers.TestAddresses.BOB);
    const requested_gas: u256 = 50000;

    try test_frame.pushStack(&[_]u256{
        0,      0,             0, 0, 0, // ret_size, ret_offset, args_size, args_offset, value
        target, requested_gas,
    });

    // Create jump table for gas consumption
    const jump_table = helpers.JumpTable.new_frontier_instruction_set();

    const gas_before_call = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0xf1, &test_vm.vm, test_frame.frame); // 0xf1 = CALL
    const gas_after_call = test_frame.frame.gas_remaining;

    // TODO: This test requires mocking the CALL result to return gas
    // For now, just verify that gas was consumed
    const actual_gas = gas_before_call - gas_after_call;
    try testing.expect(actual_gas > 0);
}

test "Gas: CREATE operations with init code" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        10000,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 500000);
    defer test_frame.deinit();

    // Prepare init code - smaller to use less gas
    const init_code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0xf3 }; // 5 bytes (PUSH1 0x00 PUSH1 0x00 RETURN)
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try test_frame.setMemory(i, &[_]u8{init_code[i]});
    }

    // Mock successful creation
    test_vm.create_result = .{
        .success = true,
        .address = helpers.TestAddresses.CHARLIE,
        .gas_left = 450000, // Return most of the gas
        .output = null,
    };
    test_vm.syncMocks();

    // Create jump table for gas consumption - need Shanghai for EIP-3860
    const jump_table = helpers.JumpTable.new_shanghai_instruction_set();

    // Test CREATE gas (32000 base + 200 per byte of init code)
    try test_frame.pushStack(&[_]u256{ init_code.len, 0, 0 }); // size, offset, value
    const gas_before_create = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0xf0, &test_vm.vm, test_frame.frame); // 0xf0 = CREATE
    const gas_after_create = test_frame.frame.gas_remaining;

    // Should consume base gas + init code cost + memory expansion + word cost
    // Base: 32000, init code: 5 * 200 = 1000, word cost: 1 * 2 = 2
    // Memory expansion to 5 bytes: 3 gas
    // Total minimum: 32000 + 1000 + 2 + 3 = 33005
    // But we get back most of the gas given to the call
    const actual_gas = gas_before_create - gas_after_create;
    const expected_min_gas = 33005;
    try testing.expect(actual_gas >= expected_min_gas);

    // Test CREATE2 with additional hashing cost
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 500000; // Reset gas for CREATE2 test
    test_vm.create_result = .{
        .success = true,
        .address = helpers.TestAddresses.CHARLIE,
        .gas_left = 450000, // Return most of the gas
        .output = null,
    }; // Reset

    try test_frame.pushStack(&[_]u256{ 0, 0, init_code.len, 0x12345678 }); // value, offset, size, salt
    const gas_before_create2 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0xf5, &test_vm.vm, test_frame.frame); // 0xf5 = CREATE2
    const gas_after_create2 = test_frame.frame.gas_remaining;

    // Should consume base gas + init code cost + hash cost + word cost
    // Base: 32000, init code: 5 * 200 = 1000, hash: 1 * 6 = 6, word cost: 1 * 2 = 2
    // Memory already expanded, no additional cost
    // Total minimum: 32000 + 1000 + 6 + 2 = 33008
    const actual_gas2 = gas_before_create2 - gas_after_create2;
    const expected_min_gas2 = 33008;
    try testing.expect(actual_gas2 >= expected_min_gas2);
}

test "Gas: Copy operations (CALLDATACOPY, CODECOPY, etc.)" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    // Set up contract with call data
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x60, 0x80, 0x60, 0x40 } ** 16, // 64 bytes of code
    );
    defer contract.deinit(null);
    contract.input = &[_]u8{ 0x12, 0x34, 0x56, 0x78 } ** 16; // 64 bytes of input

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Create jump table for gas consumption
    const jump_table = helpers.JumpTable.new_frontier_instruction_set();

    // Test CALLDATACOPY (3 gas per word + memory expansion)
    try test_frame.pushStack(&[_]u256{ 64, 0, 0 }); // size, data_offset, mem_offset
    const gas_before_cdc = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x37, &test_vm.vm, test_frame.frame); // 0x37 = CALLDATACOPY
    const gas_used_cdc = gas_before_cdc - test_frame.frame.gas_remaining;
    // 3 gas base + 3 * 2 words + memory expansion (3 * 2 words)
    try testing.expectEqual(@as(u64, 3 + 6 + 6), gas_used_cdc);

    // Test CODECOPY (3 gas per word)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 32, 0, 100 }); // size, code_offset, mem_offset
    const gas_before_cc = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x39, &test_vm.vm, test_frame.frame); // 0x39 = CODECOPY
    const gas_used_cc = gas_before_cc - test_frame.frame.gas_remaining;
    // 3 gas base + 3 * 1 word + memory expansion
    try testing.expect(gas_used_cc >= 6);
}

test "Gas: Stack operations costs" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Create jump table for gas consumption
    const jump_table = helpers.JumpTable.new_frontier_instruction_set();

    // Test POP (2 gas)
    try test_frame.pushStack(&[_]u256{42});
    const gas_before_pop = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x50, &test_vm.vm, test_frame.frame); // 0x50 = POP
    try testing.expectEqual(@as(u64, gas_constants.GasQuickStep), gas_before_pop - test_frame.frame.gas_remaining);

    // Test PUSH1 (3 gas)
    const gas_before_push = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x60, &test_vm.vm, test_frame.frame); // 0x60 = PUSH1
    try testing.expectEqual(@as(u64, gas_constants.GasFastestStep), gas_before_push - test_frame.frame.gas_remaining);

    // Test DUP1 (3 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{100});
    const gas_before_dup = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x80, &test_vm.vm, test_frame.frame); // 0x80 = DUP1
    try testing.expectEqual(@as(u64, gas_constants.GasFastestStep), gas_before_dup - test_frame.frame.gas_remaining);

    // Test SWAP1 (3 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 10, 20 });
    const gas_before_swap = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x90, &test_vm.vm, test_frame.frame); // 0x90 = SWAP1
    try testing.expectEqual(@as(u64, gas_constants.GasFastestStep), gas_before_swap - test_frame.frame.gas_remaining);
}

test "Gas: Environmental query costs" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Create jump table for gas consumption
    const jump_table = helpers.JumpTable.new_frontier_instruction_set();

    // Test ADDRESS (2 gas)
    const gas_before_address = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x30, &test_vm.vm, test_frame.frame); // 0x30 = ADDRESS
    try testing.expectEqual(@as(u64, gas_constants.GasQuickStep), gas_before_address - test_frame.frame.gas_remaining);

    // Test CALLER (2 gas)
    test_frame.frame.stack.clear();
    const gas_before_caller = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x33, &test_vm.vm, test_frame.frame); // 0x33 = CALLER
    try testing.expectEqual(@as(u64, gas_constants.GasQuickStep), gas_before_caller - test_frame.frame.gas_remaining);

    // Test CODESIZE (2 gas)
    test_frame.frame.stack.clear();
    const gas_before_codesize = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x38, &test_vm.vm, test_frame.frame); // 0x38 = CODESIZE
    try testing.expectEqual(@as(u64, gas_constants.GasQuickStep), gas_before_codesize - test_frame.frame.gas_remaining);

    // Test GASPRICE (2 gas)
    test_frame.frame.stack.clear();
    const gas_before_gasprice = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x3a, &test_vm.vm, test_frame.frame); // 0x3a = GASPRICE
    try testing.expectEqual(@as(u64, gas_constants.GasQuickStep), gas_before_gasprice - test_frame.frame.gas_remaining);
}
=======
const gas_constants = @import("../../../src/evm/constants/gas_constants.zig");


// Test basic gas constants are defined correctly
test "gas constants are correctly defined" {
    // Basic operation costs
    try testing.expectEqual(@as(u64, 2), gas_constants.GasQuickStep);
    try testing.expectEqual(@as(u64, 3), gas_constants.GasFastestStep);
    try testing.expectEqual(@as(u64, 5), gas_constants.GasFastStep);
    try testing.expectEqual(@as(u64, 8), gas_constants.GasMidStep);
    try testing.expectEqual(@as(u64, 10), gas_constants.GasSlowStep);
    try testing.expectEqual(@as(u64, 20), gas_constants.GasExtStep);
    
    // Storage operation costs
    try testing.expectEqual(@as(u64, 100), gas_constants.SloadGas);
    try testing.expectEqual(@as(u64, 2100), gas_constants.ColdSloadCost);
    try testing.expectEqual(@as(u64, 2600), gas_constants.ColdAccountAccessCost);
    
    // Precompile costs
    try testing.expectEqual(@as(u64, 3000), gas_constants.ECRECOVER_COST);
    try testing.expectEqual(@as(u64, 15), gas_constants.IDENTITY_BASE_COST);
    try testing.expectEqual(@as(u64, 3), gas_constants.IDENTITY_WORD_COST);
}

// Test memory expansion gas calculation
test "memory expansion gas calculation" {
    // Test no expansion needed
    try testing.expectEqual(@as(u64, 0), gas_constants.memory_gas_cost(100, 100));
    try testing.expectEqual(@as(u64, 0), gas_constants.memory_gas_cost(100, 50));
    
    // Test basic expansion cases
    // Expanding from 0 to 32 bytes (1 word): 3 + 0 = 3 gas
    try testing.expectEqual(@as(u64, 3), gas_constants.memory_gas_cost(0, 32));
    
    // Expanding from 0 to 64 bytes (2 words): 6 + 0 = 6 gas
    try testing.expectEqual(@as(u64, 6), gas_constants.memory_gas_cost(0, 64));
    
    // Test expansion with existing memory
    // From 32 to 64 bytes: 6 - 3 = 3 gas
    try testing.expectEqual(@as(u64, 3), gas_constants.memory_gas_cost(32, 64));
    
    // Test larger expansion
    // From 0 to 1024 bytes (32 words): 3*32 + 32*32/512 = 96 + 2 = 98 gas
    try testing.expectEqual(@as(u64, 98), gas_constants.memory_gas_cost(0, 1024));
}

// Test memory expansion lookup table
test "memory expansion lookup table" {
    // Test that LUT values match calculated values for small sizes
    for (0..100) |words| {
        const expected = gas_constants.MemoryGas * words + (words * words) / gas_constants.QuadCoeffDiv;
        try testing.expectEqual(expected, gas_constants.MEMORY_EXPANSION_LUT[words]);
    }
}

// Test edge cases for memory expansion
test "memory expansion edge cases" {
    // Test alignment - should round up to nearest word
    try testing.expectEqual(@as(u64, 3), gas_constants.memory_gas_cost(0, 1));
    try testing.expectEqual(@as(u64, 3), gas_constants.memory_gas_cost(0, 31));
    try testing.expectEqual(@as(u64, 3), gas_constants.memory_gas_cost(0, 32));
    try testing.expectEqual(@as(u64, 6), gas_constants.memory_gas_cost(0, 33));
    
    // Test that very large sizes don't cause overflow
    const large_size = gas_constants.memory_gas_cost(0, 1024 * 1024); // 1MB
    try testing.expect(large_size > 1000000); // Should be very expensive
}

// Test gas accounting for specific operations
test "operation gas costs" {
    // Quick operations (ADDRESS, ORIGIN, etc.)
    try testing.expectEqual(@as(u64, 2), gas_constants.GasQuickStep);
    
    // Arithmetic operations (ADD, SUB, etc.)
    try testing.expectEqual(@as(u64, 3), gas_constants.GasFastestStep);
    
    // Multiplication/division (MUL, DIV, etc.)
    try testing.expectEqual(@as(u64, 5), gas_constants.GasFastStep);
    
    // Advanced arithmetic (ADDMOD, MULMOD, etc.)
    try testing.expectEqual(@as(u64, 8), gas_constants.GasMidStep);
    
    // Control flow (JUMPI)
    try testing.expectEqual(@as(u64, 10), gas_constants.GasSlowStep);
    
    // External operations (BALANCE, EXTCODESIZE, etc.)
    try testing.expectEqual(@as(u64, 20), gas_constants.GasExtStep);
}

// Test transaction gas costs
test "transaction gas costs" {
    try testing.expectEqual(@as(u64, 21000), gas_constants.TxGas);
    try testing.expectEqual(@as(u64, 53000), gas_constants.TxGasContractCreation);
    try testing.expectEqual(@as(u64, 4), gas_constants.TxDataZeroGas);
    try testing.expectEqual(@as(u64, 16), gas_constants.TxDataNonZeroGas);
}

// Test call operation gas costs
test "call operation gas costs" {
    try testing.expectEqual(@as(u64, 40), gas_constants.CallGas);
    try testing.expectEqual(@as(u64, 2300), gas_constants.CallStipend);
    try testing.expectEqual(@as(u64, 9000), gas_constants.CallValueTransferGas);
    try testing.expectEqual(@as(u64, 25000), gas_constants.CallNewAccountGas);
}

// Test storage operation gas costs
test "storage operation gas costs" {
    try testing.expectEqual(@as(u64, 20000), gas_constants.SstoreSetGas);
    try testing.expectEqual(@as(u64, 5000), gas_constants.SstoreResetGas);
    try testing.expectEqual(@as(u64, 5000), gas_constants.SstoreClearGas);
    try testing.expectEqual(@as(u64, 4800), gas_constants.SstoreRefundGas);
    try testing.expectEqual(@as(u64, 2300), gas_constants.SstoreSentryGas);
}

// Test logging operation gas costs
test "logging operation gas costs" {
    try testing.expectEqual(@as(u64, 375), gas_constants.LogGas);
    try testing.expectEqual(@as(u64, 8), gas_constants.LogDataGas);
    try testing.expectEqual(@as(u64, 375), gas_constants.LogTopicGas);
}

// Test contract creation gas costs
test "contract creation gas costs" {
    try testing.expectEqual(@as(u64, 32000), gas_constants.CreateGas);
    try testing.expectEqual(@as(u64, 200), gas_constants.CreateDataGas);
    try testing.expectEqual(@as(u64, 2), gas_constants.InitcodeWordGas);
    try testing.expectEqual(@as(u64, 49152), gas_constants.MaxInitcodeSize);
}

// Test hashing operation gas costs
test "hashing operation gas costs" {
    try testing.expectEqual(@as(u64, 30), gas_constants.Keccak256Gas);
    try testing.expectEqual(@as(u64, 6), gas_constants.Keccak256WordGas);
}

// Test EIP-specific gas costs
test "eip specific gas costs" {
    // EIP-1153: Transient storage
    try testing.expectEqual(@as(u64, 100), gas_constants.TLoadGas);
    try testing.expectEqual(@as(u64, 100), gas_constants.TStoreGas);
    
    // EIP-4844: Blob transactions
    try testing.expectEqual(@as(u64, 3), gas_constants.BlobHashGas);
    try testing.expectEqual(@as(u64, 2), gas_constants.BlobBaseFeeGas);
}

// Test refund mechanics
test "gas refund mechanics" {
    try testing.expectEqual(@as(u64, 24000), gas_constants.SelfdestructRefundGas);
    try testing.expectEqual(@as(u64, 5), gas_constants.MaxRefundQuotient);
}

// Test copy operation costs
test "copy operation costs" {
    try testing.expectEqual(@as(u64, 3), gas_constants.CopyGas);
}
>>>>>>> 86ec2c702451874542acebd6fbeffb4e13d752e8
