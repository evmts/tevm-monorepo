const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const helpers = @import("test_helpers");
const opcodes = evm.opcodes;
const gas_constants = evm.gas_constants;

// Gas accounting tests to verify calculations match the Ethereum Yellow Paper

test "Gas: Arithmetic operations basic costs" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    errdefer test_vm.deinit();
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    errdefer test_frame.deinit();
    defer test_frame.deinit();
    
    // Create jump table for gas consumption
    const jump_table = helpers.JumpTable.new_frontier_instruction_set();
    
    // Test ADD (3 gas)
    try test_frame.pushStack(&[_]u256{10, 20});
    const gas_before_add = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x01, &test_vm.vm, &test_frame.frame); // 0x01 = ADD
    try testing.expectEqual(@as(u64, gas_constants.GasFastestStep), gas_before_add - test_frame.frame.gas_remaining);
    
    // Test MUL (5 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{10, 20});
    const gas_before_mul = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x02, &test_vm.vm, &test_frame.frame); // 0x02 = MUL
    try testing.expectEqual(@as(u64, gas_constants.GasFastStep), gas_before_mul - test_frame.frame.gas_remaining);
    
    // Test SUB (3 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{20, 10});
    const gas_before_sub = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x03, &test_vm.vm, &test_frame.frame); // 0x03 = SUB
    try testing.expectEqual(@as(u64, gas_constants.GasFastestStep), gas_before_sub - test_frame.frame.gas_remaining);
    
    // Test DIV (5 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{20, 10});
    const gas_before_div = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x04, &test_vm.vm, &test_frame.frame); // 0x04 = DIV
    try testing.expectEqual(@as(u64, gas_constants.GasFastStep), gas_before_div - test_frame.frame.gas_remaining);
    
    // Test ADDMOD (8 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{10, 20, 7});
    const gas_before_addmod = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x08, &test_vm.vm, &test_frame.frame); // 0x08 = ADDMOD
    try testing.expectEqual(@as(u64, gas_constants.GasMidStep), gas_before_addmod - test_frame.frame.gas_remaining);
}

test "Gas: EXP dynamic gas calculation" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    errdefer test_vm.deinit();
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    errdefer test_frame.deinit();
    defer test_frame.deinit();
    
    // Create jump table for gas consumption
    const jump_table = helpers.JumpTable.new_frontier_instruction_set();
    
    // Test EXP with small exponent (10 + 50 * 1 = 60 gas)
    try test_frame.pushStack(&[_]u256{2, 8}); // 2^8
    const gas_before_small = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x0a, &test_vm.vm, &test_frame.frame); // 0x0a = EXP
    const gas_used_small = gas_before_small - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 10 + 50 * 1), gas_used_small);
    
    // Test EXP with larger exponent (2 bytes: 10 + 50 * 2 = 110 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{2, 0x1000}); // 2^4096
    const gas_before_large = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x0a, &test_vm.vm, &test_frame.frame); // 0x0a = EXP
    const gas_used_large = gas_before_large - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 10 + 50 * 2), gas_used_large);
    
    // Test EXP with zero exponent (10 gas only)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{2, 0}); // 2^0
    const gas_before_zero = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x0a, &test_vm.vm, &test_frame.frame); // 0x0a = EXP
    const gas_used_zero = gas_before_zero - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 10), gas_used_zero);
}

test "Gas: Memory expansion costs" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    errdefer test_vm.deinit();
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    errdefer test_frame.deinit();
    defer test_frame.deinit();
    
    // Test memory expansion to 32 bytes (1 word)
    // Cost = 3 * 1 + 1²/512 = 3 gas
    try test_frame.pushStack(&[_]u256{42, 0}); // value, offset
    const gas_before_32 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.memory.op_mstore, &test_vm.vm, &test_frame.frame);
    const gas_used_32 = gas_before_32 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 3 + 3), gas_used_32); // 3 for MSTORE + 3 for memory
    
    // Test expansion to 64 bytes (2 words)
    // Additional cost = 3 * 1 + 0 = 3 gas (total memory cost = 6)
    try test_frame.pushStack(&[_]u256{99, 32}); // value, offset
    const gas_before_64 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.memory.op_mstore, &test_vm.vm, &test_frame.frame);
    const gas_used_64 = gas_before_64 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 3 + 3), gas_used_64); // 3 for MSTORE + 3 for expansion
    
    // Test expansion to 1024 bytes (32 words)
    // Total memory cost = 3 * 32 + 32²/512 = 96 + 2 = 98
    // Previous memory cost = 3 * 2 + 2²/512 = 6 + 0 = 6
    // Additional cost = 98 - 6 = 92
    try test_frame.pushStack(&[_]u256{111, 992}); // value, offset 992 (expands to 1024)
    const gas_before_1024 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.memory.op_mstore, &test_vm.vm, &test_frame.frame);
    const gas_used_1024 = gas_before_1024 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 3 + 92), gas_used_1024); // 3 for MSTORE + 92 for expansion
}

test "Gas: SHA3 dynamic costs" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    errdefer test_vm.deinit();
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    errdefer test_frame.deinit();
    defer test_frame.deinit();
    
    // Prepare data in memory
    var i: usize = 0;
    while (i < 128) : (i += 1) {
        try test_frame.setMemory(i, &[_]u8{@intCast(i & 0xFF)});
    }
    
    // Test SHA3 of 0 bytes (30 gas only)
    try test_frame.pushStack(&[_]u256{0, 0}); // offset, size
    const gas_before_0 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.crypto.op_sha3, &test_vm.vm, &test_frame.frame);
    const gas_used_0 = gas_before_0 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 30), gas_used_0);
    
    // Test SHA3 of 32 bytes (30 + 6 * 1 = 36 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 32}); // offset, size
    const gas_before_32 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.crypto.op_sha3, &test_vm.vm, &test_frame.frame);
    const gas_used_32 = gas_before_32 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 30 + 6), gas_used_32);
    
    // Test SHA3 of 64 bytes (30 + 6 * 2 = 42 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 64}); // offset, size
    const gas_before_64 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.crypto.op_sha3, &test_vm.vm, &test_frame.frame);
    const gas_used_64 = gas_before_64 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 30 + 12), gas_used_64);
    
    // Test SHA3 of 100 bytes (30 + 6 * 4 = 54 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0, 100}); // offset, size
    const gas_before_100 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.crypto.op_sha3, &test_vm.vm, &test_frame.frame);
    const gas_used_100 = gas_before_100 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 30 + 24), gas_used_100); // 4 words
}

test "Gas: LOG operations dynamic costs" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    errdefer test_vm.deinit();
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    errdefer test_frame.deinit();
    defer test_frame.deinit();
    
    // Prepare log data
    const log_data = [_]u8{1, 2, 3, 4, 5, 6, 7, 8};
    try test_frame.setMemory(0, &log_data);
    
    // Test LOG0 (375 + 8 * data_size)
    try test_frame.pushStack(&[_]u256{8, 0}); // size, offset
    const gas_before_log0 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.log.op_log0, &test_vm.vm, &test_frame.frame);
    const gas_used_log0 = gas_before_log0 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 375 + 8 * 8), gas_used_log0);
    
    // Test LOG1 (375 + 375 + 8 * data_size)
    test_frame.frame.stack.clear();
    test_vm.vm.logs.clearRetainingCapacity();
    try test_frame.pushStack(&[_]u256{0x1111, 8, 0}); // topic, size, offset
    const gas_before_log1 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.log.op_log1, &test_vm.vm, &test_frame.frame);
    const gas_used_log1 = gas_before_log1 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 375 + 375 + 8 * 8), gas_used_log1);
    
    // Test LOG4 (375 + 4*375 + 8 * data_size)
    test_frame.frame.stack.clear();
    test_vm.vm.logs.clearRetainingCapacity();
    try test_frame.pushStack(&[_]u256{0x4444, 0x3333, 0x2222, 0x1111, 8, 0});
    const gas_before_log4 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.log.op_log4, &test_vm.vm, &test_frame.frame);
    const gas_used_log4 = gas_before_log4 - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 375 + 4 * 375 + 8 * 8), gas_used_log4);
}

test "Gas: Storage operations with access lists (EIP-2929)" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    errdefer test_vm.deinit();
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    errdefer test_frame.deinit();
    defer test_frame.deinit();
    
    // Test SLOAD cold (2100 gas)
    const cold_slot: u256 = 12345;
    try test_frame.pushStack(&[_]u256{cold_slot});
    const gas_before_cold_sload = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.storage.op_sload, &test_vm.vm, &test_frame.frame);
    const gas_used_cold_sload = gas_before_cold_sload - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, gas_constants.ColdSloadCost), gas_used_cold_sload);
    
    // Test SLOAD warm (100 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{cold_slot}); // Same slot, now warm
    const gas_before_warm_sload = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.storage.op_sload, &test_vm.vm, &test_frame.frame);
    const gas_used_warm_sload = gas_before_warm_sload - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, gas_constants.WarmStorageReadCost), gas_used_warm_sload);
    
    // Test BALANCE cold address (2600 gas)
    test_frame.frame.stack.clear();
    const cold_address = helpers.toU256(helpers.TestAddresses.CHARLIE);
    try test_frame.pushStack(&[_]u256{cold_address});
    const gas_before_cold_balance = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.environment.op_balance, &test_vm.vm, &test_frame.frame);
    const gas_used_cold_balance = gas_before_cold_balance - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, gas_constants.ColdAccountAccessCost), gas_used_cold_balance);
    
    // Test BALANCE warm address (100 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{cold_address}); // Same address, now warm
    const gas_before_warm_balance = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.environment.op_balance, &test_vm.vm, &test_frame.frame);
    const gas_used_warm_balance = gas_before_warm_balance - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, gas_constants.WarmStorageReadCost), gas_used_warm_balance);
}

test "Gas: CALL operations gas forwarding" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    errdefer test_vm.deinit();
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        10000,
        &[_]u8{},
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    errdefer test_frame.deinit();
    defer test_frame.deinit();
    
    // Mock successful call
    // TODO: Fix this when call_result is implemented
    // test_vm.vm.call_result = .{
    //     .success = true,
    //     .gas_left = 40000, // Will use 10000 gas
    //     .output = null,
    // };
    
    // Test CALL with gas calculation
    const target = helpers.toU256(helpers.TestAddresses.BOB);
    const requested_gas: u256 = 50000;
    
    try test_frame.pushStack(&[_]u256{
        0, 0, 0, 0, 0, // ret_size, ret_offset, args_size, args_offset, value
        target,
        requested_gas,
    });
    
    const gas_before_call = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.system.op_call, &test_vm.vm, &test_frame.frame);
    const gas_after_call = test_frame.frame.gas_remaining;
    
    // Gas consumed = cold access (2600) + gas given (50000) - gas returned (40000)
    const expected_gas = 2600 + 50000 - 40000;
    const actual_gas = gas_before_call - gas_after_call;
    try testing.expectEqual(expected_gas, actual_gas);
}

test "Gas: CREATE operations with init code" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    errdefer test_vm.deinit();
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        10000,
        &[_]u8{},
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 200000);
    errdefer test_frame.deinit();
    defer test_frame.deinit();
    
    // Prepare init code
    const init_code = [_]u8{0x60, 0x00, 0x60, 0x00, 0xf3} ** 10; // 50 bytes
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try test_frame.setMemory(i, &[_]u8{init_code[i]});
    }
    
    // Mock successful creation
    // TODO: Fix this when create_result is implemented
    // test_vm.vm.create_result = .{
    //     .success = true,
    //     .address = helpers.TestAddresses.CHARLIE,
    //     .gas_left = 150000,
    //     .output = null,
    // };
    
    // Test CREATE gas (32000 base + 200 per byte of init code)
    try test_frame.pushStack(&[_]u256{init_code.len, 0, 0}); // size, offset, value
    const gas_before_create = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, &test_frame.frame);
    const gas_after_create = test_frame.frame.gas_remaining;
    
    // Should consume at least init code cost (200 per byte)
    const min_gas = @as(u64, init_code.len) * 200;
    const actual_gas = gas_before_create - gas_after_create;
    try testing.expect(actual_gas >= min_gas);
    
    // Test CREATE2 with additional hashing cost
    test_frame.frame.stack.clear();
    // test_vm.vm.create_result.gas_left = 150000; // Reset
    
    try test_frame.pushStack(&[_]u256{0x12345678, init_code.len, 0, 0}); // salt, size, offset, value
    const gas_before_create2 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.system.op_create2, &test_vm.vm, &test_frame.frame);
    const gas_after_create2 = test_frame.frame.gas_remaining;
    
    // Should consume init code cost + hashing cost (6 per word)
    const hash_words = (init_code.len + 31) / 32;
    const min_gas2 = @as(u64, init_code.len) * 200 + hash_words * 6;
    const actual_gas2 = gas_before_create2 - gas_after_create2;
    try testing.expect(actual_gas2 >= min_gas2);
}

test "Gas: Copy operations (CALLDATACOPY, CODECOPY, etc.)" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    errdefer test_vm.deinit();
    defer test_vm.deinit();
    
    // Set up contract with call data
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x60, 0x80, 0x60, 0x40} ** 16, // 64 bytes of code
    );
    contract.input = &[_]u8{0x12, 0x34, 0x56, 0x78} ** 16; // 64 bytes of input
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    errdefer test_frame.deinit();
    defer test_frame.deinit();
    
    // Test CALLDATACOPY (3 gas per word + memory expansion)
    try test_frame.pushStack(&[_]u256{64, 0, 0}); // size, data_offset, mem_offset
    const gas_before_cdc = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.memory.op_calldatacopy, &test_vm.vm, &test_frame.frame);
    const gas_used_cdc = gas_before_cdc - test_frame.frame.gas_remaining;
    // 3 gas base + 3 * 2 words + memory expansion (3 * 2 words)
    try testing.expectEqual(@as(u64, 3 + 6 + 6), gas_used_cdc);
    
    // Test CODECOPY (3 gas per word)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{32, 0, 100}); // size, code_offset, mem_offset
    const gas_before_cc = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.memory.op_codecopy, &test_vm.vm, &test_frame.frame);
    const gas_used_cc = gas_before_cc - test_frame.frame.gas_remaining;
    // 3 gas base + 3 * 1 word + memory expansion
    try testing.expect(gas_used_cc >= 6);
}

test "Gas: Stack operations costs" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    errdefer test_vm.deinit();
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    errdefer test_frame.deinit();
    defer test_frame.deinit();
    
    // Test POP (2 gas)
    try test_frame.pushStack(&[_]u256{42});
    const gas_before_pop = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.stack.op_pop, &test_vm.vm, &test_frame.frame);
    try testing.expectEqual(@as(u64, gas_constants.GasQuickStep), gas_before_pop - test_frame.frame.gas_remaining);
    
    // Test PUSH1 (3 gas)
    const gas_before_push = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.stack.op_push1, &test_vm.vm, &test_frame.frame);
    try testing.expectEqual(@as(u64, gas_constants.GasFastestStep), gas_before_push - test_frame.frame.gas_remaining);
    
    // Test DUP1 (3 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{100});
    const gas_before_dup = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.stack.op_dup1, &test_vm.vm, &test_frame.frame);
    try testing.expectEqual(@as(u64, gas_constants.GasFastestStep), gas_before_dup - test_frame.frame.gas_remaining);
    
    // Test SWAP1 (3 gas)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{10, 20});
    const gas_before_swap = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.stack.op_swap1, &test_vm.vm, &test_frame.frame);
    try testing.expectEqual(@as(u64, gas_constants.GasFastestStep), gas_before_swap - test_frame.frame.gas_remaining);
}

test "Gas: Environmental query costs" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    errdefer test_vm.deinit();
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    errdefer test_frame.deinit();
    defer test_frame.deinit();
    
    // Test ADDRESS (2 gas)
    const gas_before_address = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.environment.op_address, &test_vm.vm, &test_frame.frame);
    try testing.expectEqual(@as(u64, gas_constants.GasQuickStep), gas_before_address - test_frame.frame.gas_remaining);
    
    // Test CALLER (2 gas)
    test_frame.frame.stack.clear();
    const gas_before_caller = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.environment.op_caller, &test_vm.vm, &test_frame.frame);
    try testing.expectEqual(@as(u64, gas_constants.GasQuickStep), gas_before_caller - test_frame.frame.gas_remaining);
    
    // Test CODESIZE (2 gas)
    test_frame.frame.stack.clear();
    const gas_before_codesize = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.memory.op_codesize, &test_vm.vm, &test_frame.frame);
    try testing.expectEqual(@as(u64, gas_constants.GasQuickStep), gas_before_codesize - test_frame.frame.gas_remaining);
    
    // Test GASPRICE (2 gas)
    test_frame.frame.stack.clear();
    const gas_before_gasprice = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(opcodes.environment.op_gasprice, &test_vm.vm, &test_frame.frame);
    try testing.expectEqual(@as(u64, gas_constants.GasQuickStep), gas_before_gasprice - test_frame.frame.gas_remaining);
}