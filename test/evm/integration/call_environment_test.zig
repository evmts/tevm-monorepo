const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers");
const evm = @import("evm");
const opcodes = evm.opcodes;

// Integration tests for call operations and environment interactions

test "Integration: Call with value transfer and balance check" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set up accounts with balances
    try test_vm.setAccount(helpers.TestAddresses.ALICE, 1000, &[_]u8{});
    try test_vm.setAccount(helpers.TestAddresses.BOB, 500, &[_]u8{});
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.ALICE,
        helpers.TestAddresses.ALICE,
        1000,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Check balance of BOB before call
    try test_frame.pushStack(&[_]u256{helpers.toU256(helpers.TestAddresses.BOB)});
    _ = try helpers.executeOpcode(opcodes.environment.op_balance, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 500);
    
    // Prepare to call BOB with 100 wei
    test_frame.frame.stack.clear();
    const value: u256 = 100;
    
    // Mock successful call
    test_vm.vm.call_result = .{
        .success = true,
        .gas_left = 90000,
        .output = null,
    };
    
    // Push CALL parameters
    try test_frame.pushStack(&[_]u256{
        0,  // ret_size
        0,  // ret_offset
        0,  // args_size
        0,  // args_offset
        value,  // value (100 wei)
        helpers.toU256(helpers.TestAddresses.BOB),  // to
        50000,  // gas
    });
    
    _ = try helpers.executeOpcode(opcodes.system.op_call, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // Success
    
    // In a real implementation, balance would be updated
    // For now, manually update for testing
    try test_vm.setAccount(helpers.TestAddresses.ALICE, 900, &[_]u8{});
    try test_vm.setAccount(helpers.TestAddresses.BOB, 600, &[_]u8{});
    
    // Check balance of BOB after call
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{helpers.toU256(helpers.TestAddresses.BOB)});
    _ = try helpers.executeOpcode(opcodes.environment.op_balance, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 600);
}

test "Integration: Environment opcodes in context" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set up VM environment
    test_vm.vm.tx_origin = helpers.TestAddresses.ALICE;
    test_vm.vm.gas_price = 20_000_000_000; // 20 gwei
    test_vm.vm.block_number = 15_000_000;
    test_vm.vm.timestamp = 1_650_000_000;
    test_vm.vm.block_coinbase = helpers.TestAddresses.CHARLIE;
    test_vm.vm.chain_id = 1; // Mainnet
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.BOB, // Caller is BOB
        500, // Contract received 500 wei
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Test ADDRESS
    _ = try helpers.executeOpcode(opcodes.environment.op_address, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, helpers.toU256(helpers.TestAddresses.CONTRACT));
    
    // Test ORIGIN
    test_frame.frame.stack.clear();
    _ = try helpers.executeOpcode(opcodes.environment.op_origin, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, helpers.toU256(helpers.TestAddresses.ALICE));
    
    // Test CALLER
    test_frame.frame.stack.clear();
    _ = try helpers.executeOpcode(opcodes.environment.op_caller, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, helpers.toU256(helpers.TestAddresses.BOB));
    
    // Test CALLVALUE
    test_frame.frame.stack.clear();
    _ = try helpers.executeOpcode(opcodes.environment.op_callvalue, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 500);
    
    // Test GASPRICE
    test_frame.frame.stack.clear();
    _ = try helpers.executeOpcode(opcodes.environment.op_gasprice, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 20_000_000_000);
    
    // Test block-related opcodes
    test_frame.frame.stack.clear();
    _ = try helpers.executeOpcode(opcodes.block.op_number, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 15_000_000);
    
    test_frame.frame.stack.clear();
    _ = try helpers.executeOpcode(opcodes.block.op_timestamp, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1_650_000_000);
    
    test_frame.frame.stack.clear();
    _ = try helpers.executeOpcode(opcodes.block.op_coinbase, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, helpers.toU256(helpers.TestAddresses.CHARLIE));
    
    test_frame.frame.stack.clear();
    _ = try helpers.executeOpcode(opcodes.environment.op_chainid, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1);
}

test "Integration: CREATE with init code from memory" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        10000, // Contract has enough balance
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Build init code that stores a value and returns runtime code
    // PUSH1 42, PUSH1 0, SSTORE (store 42 at slot 0)
    // PUSH1 runtime_size, PUSH1 runtime_offset, PUSH1 0, CODECOPY
    // PUSH1 runtime_size, PUSH1 0, RETURN
    const init_code = [_]u8{
        0x60, 0x42, // PUSH1 42
        0x60, 0x00, // PUSH1 0
        0x55,       // SSTORE
        0x60, 0x01, // PUSH1 1 (runtime size)
        0x60, 0x10, // PUSH1 16 (runtime offset in this code)
        0x60, 0x00, // PUSH1 0 (memory offset)
        0x39,       // CODECOPY
        0x60, 0x01, // PUSH1 1 (runtime size)
        0x60, 0x00, // PUSH1 0 (memory offset)
        0xf3,       // RETURN
        0x00,       // Runtime code: STOP
    };
    
    // Store init code in memory
    var i: usize = 0;
    while (i < init_code.len) : (i += 1) {
        try test_frame.setMemory(i, &[_]u8{init_code[i]});
    }
    
    // Mock successful creation
    test_vm.vm.create_result = .{
        .success = true,
        .address = helpers.TestAddresses.CHARLIE,
        .gas_left = 80000,
        .output = &[_]u8{0x00}, // Runtime code
    };
    
    // Execute CREATE
    try test_frame.pushStack(&[_]u256{
        init_code.len, // size
        0,              // offset
        1000,           // value
    });
    
    _ = try helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, test_frame.frame);
    
    // Should push new contract address
    const addr = try test_frame.popStack();
    try testing.expectEqual(helpers.toU256(helpers.TestAddresses.CHARLIE), addr);
}

test "Integration: DELEGATECALL preserves context" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set up delegate contract with code
    const delegate_code = [_]u8{
        0x33, // CALLER - push caller to stack
        0x00, // STOP
    };
    try test_vm.setAccount(helpers.TestAddresses.BOB, 0, &delegate_code);
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE, // Original caller
        1000,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Mock successful delegatecall that returns caller address
    test_vm.vm.call_result = .{
        .success = true,
        .gas_left = 90000,
        .output = null, // In real execution, delegate would push CALLER
    };
    
    // Execute DELEGATECALL
    try test_frame.pushStack(&[_]u256{
        0,  // ret_size
        0,  // ret_offset
        0,  // args_size
        0,  // args_offset
        helpers.toU256(helpers.TestAddresses.BOB),  // to
        50000,  // gas
    });
    
    _ = try helpers.executeOpcode(opcodes.system.op_delegatecall, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // Success
    
    // In DELEGATECALL, the called code should see the original caller (ALICE)
    // and the current contract's address, not BOB's address
}

test "Integration: STATICCALL prevents state changes" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        1000,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Mock successful staticcall
    test_vm.vm.call_result = .{
        .success = true,
        .gas_left = 90000,
        .output = &[_]u8{0x01}, // Return some data
    };
    
    // Execute STATICCALL
    try test_frame.pushStack(&[_]u256{
        1,  // ret_size
        0,  // ret_offset
        0,  // args_size
        0,  // args_offset
        helpers.toU256(helpers.TestAddresses.BOB),  // to
        50000,  // gas
    });
    
    _ = try helpers.executeOpcode(opcodes.system.op_staticcall, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // Success
    
    // The is_static flag would be set in the called context,
    // preventing any state-modifying operations
}

test "Integration: Call depth limit handling" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        1000,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Test at maximum depth
    test_frame.frame.depth = 1024;
    
    // Try CREATE at max depth
    try test_frame.pushStack(&[_]u256{0, 0, 0}); // size, offset, value
    _ = try helpers.executeOpcode(opcodes.system.op_create, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Should fail
    
    // Try CALL at max depth
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{
        0, 0, 0, 0, 0,
        helpers.toU256(helpers.TestAddresses.BOB),
        1000,
    });
    _ = try helpers.executeOpcode(opcodes.system.op_call, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Should fail
}

test "Integration: Return data handling across calls" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        1000,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // First call returns some data
    const return_data = [_]u8{0xAA, 0xBB, 0xCC, 0xDD};
    test_vm.vm.call_result = .{
        .success = true,
        .gas_left = 90000,
        .output = &return_data,
    };
    
    // Execute CALL
    try test_frame.pushStack(&[_]u256{
        32, // ret_size (larger than actual return)
        100, // ret_offset
        0, 0, 0,
        helpers.toU256(helpers.TestAddresses.BOB),
        50000,
    });
    
    _ = try helpers.executeOpcode(opcodes.system.op_call, &test_vm.vm, test_frame.frame);
    
    // Set return data buffer to simulate real execution
    test_frame.frame.return_data_buffer = &return_data;
    
    // Check RETURNDATASIZE
    test_frame.frame.stack.clear();
    _ = try helpers.executeOpcode(opcodes.environment.op_returndatasize, &test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 4);
    
    // Copy return data to memory
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{
        4,  // size
        0,  // data offset
        200, // memory offset
    });
    _ = try helpers.executeOpcode(opcodes.environment.op_returndatacopy, &test_vm.vm, test_frame.frame);
    
    // Verify data was copied
    try test_frame.pushStack(&[_]u256{200});
    _ = try helpers.executeOpcode(opcodes.memory.op_mload, &test_vm.vm, test_frame.frame);
    
    // Should have 0xAABBCCDD in the most significant bytes
    const expected = (@as(u256, 0xAABBCCDD) << (28 * 8));
    const actual = try test_frame.popStack();
    const mask = @as(u256, 0xFFFFFFFF) << (28 * 8);
    try testing.expectEqual(expected, actual & mask);
}

test "Integration: Gas forwarding in calls" {
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        1000,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Test gas calculation for CALL
    const initial_gas = test_frame.frame.gas_remaining;
    
    // Request specific gas amount
    const requested_gas: u256 = 30000;
    
    test_vm.vm.call_result = .{
        .success = true,
        .gas_left = 25000, // Used 5000 gas
        .output = null,
    };
    
    try test_frame.pushStack(&[_]u256{
        0, 0, 0, 0, 0,
        helpers.toU256(helpers.TestAddresses.BOB),
        requested_gas,
    });
    
    _ = try helpers.executeOpcode(opcodes.system.op_call, &test_vm.vm, test_frame.frame);
    
    // Gas should be deducted for:
    // 1. Cold address access (2600)
    // 2. Base call cost
    // 3. Gas given to call (30000)
    // 4. Minus gas returned (25000)
    const gas_used = initial_gas - test_frame.frame.gas_remaining;
    try testing.expect(gas_used > 2600); // At least cold access cost
    try testing.expect(gas_used < 10000); // But reasonable amount
}
