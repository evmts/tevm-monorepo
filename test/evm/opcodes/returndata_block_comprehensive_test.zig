const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");
const evm = @import("evm");

// ============================
// 0x3B-0x3F Environmental Information (continued) + 0x40-0x44 Block Information
// ============================

test "EXTCODESIZE (0x3B): Get external code size" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Deploy a contract with code
    const test_code = [_]u8{
        0x60, 0x00, // PUSH1 0
        0x60, 0x01, // PUSH1 1
        0x01,       // ADD
        0x00,       // STOP
    };
    
    // Set code directly in the state
    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, &test_code);
    // Set balance directly in the state
    try test_vm.vm.state.set_balance(helpers.TestAddresses.BOB, 1000);
    
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
    
    // Test 1: Get code size of contract with code
    try test_frame.pushStack(&[_]u256{helpers.Address.to_u256(helpers.TestAddresses.BOB)});
    _ = try helpers.executeOpcode(0x3B, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, test_code.len);
    _ = try test_frame.popStack();
    
    // Test 2: Get code size of EOA (should be 0)
    try test_frame.pushStack(&[_]u256{helpers.Address.to_u256(helpers.TestAddresses.ALICE)});
    _ = try helpers.executeOpcode(0x3B, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();
    
    // Test 3: Get code size of non-existent account (should be 0)
    const zero_addr = helpers.Address.zero();
    try test_frame.pushStack(&[_]u256{helpers.Address.to_u256(zero_addr)});
    _ = try helpers.executeOpcode(0x3B, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "EXTCODECOPY (0x3C): Copy external code to memory" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const external_code = [_]u8{
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x00, // PUSH1 0
        0x55,       // SSTORE
        0x00,       // STOP
    };
    
    // Set code directly in the state
    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, &external_code);
    
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
    
    // Test 1: Copy entire external code
    const bob_addr = helpers.Address.to_u256(helpers.TestAddresses.BOB);
    try test_frame.pushStack(&[_]u256{ external_code.len, 0, 0, bob_addr }); // size, code_offset, mem_offset, address
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);
    
    const mem_slice1 = try test_frame.frame.memory.get_slice(0, external_code.len);
    try testing.expectEqualSlices(u8, &external_code, mem_slice1);
    
    // Test 2: Copy partial code with offset
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 2, 2, 10, bob_addr }); // size=2, code_offset=2, mem_offset=10, address
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);
    
    const mem_slice2 = try test_frame.frame.memory.get_slice(10, 2);
    try testing.expectEqualSlices(u8, external_code[2..4], mem_slice2);
    
    // Test 3: Copy from EOA (should get zeros)
    test_frame.frame.memory.resize_context(0) catch unreachable;
    const alice_addr = helpers.Address.to_u256(helpers.TestAddresses.ALICE);
    try test_frame.pushStack(&[_]u256{ 32, 0, 0, alice_addr });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);
    
    const mem_slice3 = try test_frame.frame.memory.get_slice(0, 32);
    const zeros = [_]u8{0} ** 32;
    try testing.expectEqualSlices(u8, &zeros, mem_slice3);
}

test "RETURNDATASIZE (0x3D): Get return data size" {
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
    
    // Test 1: No return data initially
    _ = try helpers.executeOpcode(0x3D, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();
    
    // Test 2: Set return data and check size
    const return_data = [_]u8{0x42, 0x43, 0x44, 0x45};
    try test_frame.frame.return_data.set(&return_data);
    
    _ = try helpers.executeOpcode(0x3D, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, return_data.len);
    _ = try test_frame.popStack();
    
    // Test 3: Large return data
    const large_data = [_]u8{0xFF} ** 1024;
    try test_frame.frame.return_data.set(&large_data);
    
    _ = try helpers.executeOpcode(0x3D, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1024);
}

test "RETURNDATACOPY (0x3E): Copy return data to memory" {
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
    
    const return_data = [_]u8{
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
        0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF, 0x00,
    };
    try test_frame.frame.return_data.set(&return_data);
    
    // Test 1: Copy all return data
    try test_frame.pushStack(&[_]u256{ return_data.len, 0, 0 }); // size, data_offset, mem_offset
    _ = try helpers.executeOpcode(0x3E, test_vm.vm, test_frame.frame);
    
    const mem_slice1 = try test_frame.frame.memory.get_slice(0, return_data.len);
    try testing.expectEqualSlices(u8, &return_data, mem_slice1);
    
    // Test 2: Copy partial data with offsets
    test_frame.frame.memory.resize_context(0) catch unreachable;
    try test_frame.pushStack(&[_]u256{ 4, 4, 32 }); // size=4, data_offset=4, mem_offset=32
    _ = try helpers.executeOpcode(0x3E, test_vm.vm, test_frame.frame);
    
    const mem_slice2 = try test_frame.frame.memory.get_slice(32, 4);
    try testing.expectEqualSlices(u8, return_data[4..8], mem_slice2);
    
    // Test 3: Out of bounds should revert
    try test_frame.pushStack(&[_]u256{ 32, 0, 0 }); // size > return_data.len
    const result = helpers.executeOpcode(0x3E, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.ReturnDataOutOfBounds, result);
}

test "EXTCODEHASH (0x3F): Get external code hash" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Set up contract with known code
    const test_code = [_]u8{0x60, 0x00, 0x60, 0x01, 0x01}; // PUSH1 0, PUSH1 1, ADD
    // Set code using tracked allocation
    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, &test_code);
    
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
    
    // Test 1: Get hash of contract with code
    try test_frame.pushStack(&[_]u256{helpers.Address.to_u256(helpers.TestAddresses.BOB)});
    _ = try helpers.executeOpcode(0x3F, test_vm.vm, test_frame.frame);
    
    // Calculate expected hash
    var expected_hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(&test_code, &expected_hash, .{});
    var expected_u256: u256 = 0;
    for (expected_hash) |byte| {
        expected_u256 = (expected_u256 << 8) | byte;
    }
    
    try helpers.expectStackValue(test_frame.frame, 0, expected_u256);
    _ = try test_frame.popStack();
    
    // Test 2: Get hash of EOA (should be 0)
    try test_frame.pushStack(&[_]u256{helpers.Address.to_u256(helpers.TestAddresses.ALICE)});
    _ = try helpers.executeOpcode(0x3F, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "BLOCKHASH (0x40): Get block hash" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Set up block context
    const context = evm.Context.init_with_values(
        helpers.TestAddresses.ALICE,  // tx_origin
        0,                           // gas_price
        1000,                        // block_number
        0,                           // block_timestamp
        helpers.TestAddresses.ALICE,  // block_coinbase
        0,                           // block_difficulty
        0,                           // block_gas_limit
        1,                           // chain_id
        0,                           // block_base_fee
        &[_]u256{},                  // blob_hashes
        0,                           // blob_base_fee
    );
    test_vm.vm.set_context(context);
    
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
    
    // Test 1: Get recent block hash (should return pseudo-hash)
    try test_frame.pushStack(&[_]u256{999});
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    const result1 = try test_frame.popStack();
    // Should be a non-zero pseudo-hash
    try testing.expect(result1 != 0);
    
    // Test 2: Get older block hash (within 256 blocks)
    try test_frame.pushStack(&[_]u256{995});
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    const result2 = try test_frame.popStack();
    // Should be a non-zero pseudo-hash, different from result1
    try testing.expect(result2 != 0);
    try testing.expect(result1 != result2);
    
    // Test 3: Block too old (> 256 blocks ago)
    try test_frame.pushStack(&[_]u256{700}); // 300 blocks ago
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();
    
    // Test 4: Future block
    try test_frame.pushStack(&[_]u256{1001});
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();
    
    // Test 5: Current block
    try test_frame.pushStack(&[_]u256{1000});
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();
    
    // Test 6: Genesis block
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
}

test "COINBASE (0x41): Get block coinbase" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Set coinbase address
    const coinbase_addr = [_]u8{0xC0, 0x1B, 0xBA, 0x5E} ++ [_]u8{0} ** 16;
    const context = evm.Context.init_with_values(
        helpers.TestAddresses.ALICE,  // tx_origin
        0,                           // gas_price
        0,                           // block_number
        0,                           // block_timestamp
        coinbase_addr,               // block_coinbase
        0,                           // block_difficulty
        0,                           // block_gas_limit
        1,                           // chain_id
        0,                           // block_base_fee
        &[_]u256{},                  // blob_hashes
        0,                           // blob_base_fee
    );
    test_vm.vm.set_context(context);
    
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
    
    // Execute COINBASE
    _ = try helpers.executeOpcode(0x41, test_vm.vm, test_frame.frame);
    
    const expected = helpers.Address.to_u256(coinbase_addr);
    try helpers.expectStackValue(test_frame.frame, 0, expected);
}

test "TIMESTAMP (0x42): Get block timestamp" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const test_cases = [_]u64{
        0,                    // Genesis
        1640995200,           // 2022-01-01 00:00:00 UTC
        1704067200,           // 2024-01-01 00:00:00 UTC
        std.math.maxInt(u64), // Far future
    };
    
    for (test_cases) |timestamp| {
        const context = evm.Context.init_with_values(
            helpers.TestAddresses.ALICE,  // tx_origin
            0,                           // gas_price
            0,                           // block_number
            timestamp,                   // block_timestamp
            helpers.TestAddresses.ALICE,  // block_coinbase
            0,                           // block_difficulty
            0,                           // block_gas_limit
            1,                           // chain_id
            0,                           // block_base_fee
            &[_]u256{},                  // blob_hashes
            0,                           // blob_base_fee
        );
        test_vm.vm.set_context(context);
        
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
        
        // Execute TIMESTAMP
        _ = try helpers.executeOpcode(0x42, test_vm.vm, test_frame.frame);
        
        try helpers.expectStackValue(test_frame.frame, 0, timestamp);
    }
}

test "NUMBER (0x43): Get block number" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const test_cases = [_]u64{
        0,                    // Genesis
        1,                    // First block
        1000000,              // Millionth block
        15537393,             // Merge block on mainnet
        std.math.maxInt(u64), // Max block number
    };
    
    for (test_cases) |block_num| {
        const context = evm.Context.init_with_values(
            helpers.TestAddresses.ALICE,  // tx_origin
            0,                           // gas_price
            block_num,                   // block_number
            0,                           // block_timestamp
            helpers.TestAddresses.ALICE,  // block_coinbase
            0,                           // block_difficulty
            0,                           // block_gas_limit
            1,                           // chain_id
            0,                           // block_base_fee
            &[_]u256{},                  // blob_hashes
            0,                           // blob_base_fee
        );
        test_vm.vm.set_context(context);
        
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
        
        // Execute NUMBER
        _ = try helpers.executeOpcode(0x43, test_vm.vm, test_frame.frame);
        
        try helpers.expectStackValue(test_frame.frame, 0, block_num);
    }
}

test "PREVRANDAO (0x44): Get previous RANDAO" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Post-merge, DIFFICULTY opcode returns PREVRANDAO
    const test_values = [_]u256{
        0,
        0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef,
        std.math.maxInt(u256),
    };
    
    for (test_values) |randao| {
        const context = evm.Context.init_with_values(
            helpers.TestAddresses.ALICE,  // tx_origin
            0,                           // gas_price
            0,                           // block_number
            0,                           // block_timestamp
            helpers.TestAddresses.ALICE,  // block_coinbase
            randao,                      // block_difficulty (Post-merge, this is PREVRANDAO)
            0,                           // block_gas_limit
            1,                           // chain_id
            0,                           // block_base_fee
            &[_]u256{},                  // blob_hashes
            0,                           // blob_base_fee
        );
        test_vm.vm.set_context(context);
        
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
        
        // Execute PREVRANDAO
        _ = try helpers.executeOpcode(0x44, test_vm.vm, test_frame.frame);
        
        try helpers.expectStackValue(test_frame.frame, 0, randao);
    }
}

// ============================
// Gas consumption tests
// ============================

test "EXTCODE* opcodes: Gas consumption with EIP-2929" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Set up external code
    const code = [_]u8{0x60, 0x42};
    // Set code using tracked allocation
    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, &code);
    
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
    
    // Test EXTCODESIZE - cold access
    try test_frame.pushStack(&[_]u256{helpers.Address.to_u256(helpers.TestAddresses.BOB)});
    const gas_before_cold = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x3B, test_vm.vm, test_frame.frame);
    const gas_cold = gas_before_cold - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2600), gas_cold); // Cold access
    _ = try test_frame.popStack();
    
    // Test EXTCODESIZE - warm access
    try test_frame.pushStack(&[_]u256{helpers.Address.to_u256(helpers.TestAddresses.BOB)});
    const gas_before_warm = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x3B, test_vm.vm, test_frame.frame);
    const gas_warm = gas_before_warm - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 100), gas_warm); // Warm access
}

test "Block opcodes: Gas consumption" {
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
    
    const simple_opcodes = [_]struct {
        opcode: u8,
        name: []const u8,
        expected_gas: u64,
        needs_stack: bool,
    }{
        .{ .opcode = 0x40, .name = "BLOCKHASH", .expected_gas = 20, .needs_stack = true },
        .{ .opcode = 0x41, .name = "COINBASE", .expected_gas = 2, .needs_stack = false },
        .{ .opcode = 0x42, .name = "TIMESTAMP", .expected_gas = 2, .needs_stack = false },
        .{ .opcode = 0x43, .name = "NUMBER", .expected_gas = 2, .needs_stack = false },
        .{ .opcode = 0x44, .name = "PREVRANDAO", .expected_gas = 2, .needs_stack = false },
    };
    
    for (simple_opcodes) |op| {
        test_frame.frame.stack.clear();
        if (op.needs_stack) {
            try test_frame.pushStack(&[_]u256{999}); // Block number for BLOCKHASH
        }
        
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

test "RETURNDATACOPY: Out of bounds access" {
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
    
    const return_data = [_]u8{0x42, 0x43, 0x44, 0x45};
    try test_frame.frame.return_data.set(&return_data);
    
    // Test cases that should fail
    const test_cases = [_]struct {
        size: u256,
        data_offset: u256,
        mem_offset: u256,
        desc: []const u8,
    }{
        .{ .size = 5, .data_offset = 0, .mem_offset = 0, .desc = "size > data length" },
        .{ .size = 2, .data_offset = 3, .mem_offset = 0, .desc = "offset + size > data length" },
        .{ .size = 1, .data_offset = 5, .mem_offset = 0, .desc = "offset beyond data" },
    };
    
    for (test_cases) |tc| {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{ tc.size, tc.data_offset, tc.mem_offset });
        
        const result = helpers.executeOpcode(0x3E, test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.ReturnDataOutOfBounds, result);
    }
}

test "Memory copy opcodes: Memory expansion" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    // Set up external code
    const code = [_]u8{0xFF} ** 32;
    // Set code using tracked allocation
    try test_vm.vm.state.set_code(helpers.TestAddresses.BOB, &code);
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100); // Limited gas
    defer test_frame.deinit();
    
    // Test EXTCODECOPY with huge memory offset - should run out of gas
    const huge_offset = 1_000_000;
    const bob_addr = helpers.Address.to_u256(helpers.TestAddresses.BOB);
    try test_frame.pushStack(&[_]u256{ 32, 0, huge_offset, bob_addr });
    
    const result = helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfGas, result);
}

test "BLOCKHASH: Edge cases" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    const context = evm.Context.init_with_values(
        helpers.TestAddresses.ALICE,  // tx_origin
        0,                           // gas_price
        1000,                        // block_number
        0,                           // block_timestamp
        helpers.TestAddresses.ALICE,  // block_coinbase
        0,                           // block_difficulty
        0,                           // block_gas_limit
        1,                           // chain_id
        0,                           // block_base_fee
        &[_]u256{},                  // blob_hashes
        0,                           // blob_base_fee
    );
    test_vm.vm.set_context(context);
    
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
    
    // Test with maximum u256 block number
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u256)});
    _ = try helpers.executeOpcode(0x40, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Should return 0 for invalid block
}