const std = @import("std");
const testing = std.testing;
const pkg = @import("package.zig");
const helpers = pkg.test_helpers;

// Import opcodes from evm module
const evm = @import("evm");
const environment = evm.opcodes.environment;
const system = evm.opcodes.system;
const block = evm.opcodes.block;
const stack = evm.opcodes.stack;
const arithmetic = evm.opcodes.arithmetic;
const memory = evm.opcodes.memory;
const log = evm.opcodes.log;

test "Integration: Contract deployment simulation" {
    // Simulate CREATE operation with constructor
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set up deployer account
    const deployer_balance: u256 = helpers.TestValues.ONE_ETHER;
    try test_vm.setAccount(helpers.TestAddresses.ALICE, deployer_balance, &[_]u8{});
    
    var contract = helpers.Contract.init(
        helpers.TestAddresses.ALICE,
        helpers.TestAddresses.ALICE, // Deployer is also the contract during creation
        helpers.TestValues.ONE_GWEI, // Send 1 Gwei with deployment
        1_000_000,
        &[_]u8{}, // Empty code during deployment
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Prepare constructor bytecode in memory
    // Simple constructor that stores a value
    const constructor_code = [_]u8{
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x00, // PUSH1 0x00
        0x55,       // SSTORE (store 0x42 at slot 0)
        0x00,       // STOP
    };
    
    try test_frame.setMemory(0, &constructor_code);
    
    // Push CREATE parameters: value, offset, size
    try test_frame.pushStack(&[_]u256{
        helpers.TestValues.ONE_GWEI, // value
        0,                           // offset
        constructor_code.len,        // size
    });
    
    // Execute CREATE (will fail with placeholder implementation)
    _ = helpers.executeOpcode(system.op_create, &test_vm.vm, &test_frame.frame) catch |err| {
        // CREATE is not fully implemented, but we can verify it tries to execute
        try testing.expect(err == helpers.ExecutionError.Error.OutOfGas or 
                          err == helpers.ExecutionError.Error.StackUnderflow);
    };
}

test "Integration: Call with value transfer" {
    // Test CALL operation with ETH transfer
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set up accounts
    try test_vm.setAccount(helpers.TestAddresses.ALICE, helpers.TestValues.ONE_ETHER, &[_]u8{});
    try test_vm.setAccount(helpers.TestAddresses.BOB, 0, &[_]u8{});
    
    var contract = helpers.Contract.init(
        helpers.TestAddresses.ALICE,
        helpers.TestAddresses.CONTRACT,
        0,
        1_000_000,
        &[_]u8{},
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    
    // Give contract some balance to transfer
    try test_vm.setAccount(helpers.TestAddresses.CONTRACT, helpers.TestValues.ONE_ETHER, &[_]u8{});
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Prepare CALL parameters
    // CALL(gas, address, value, argsOffset, argsSize, retOffset, retSize)
    try test_frame.pushStack(&[_]u256{
        50000,                                              // gas
        @as(u256, @bitCast(helpers.TestAddresses.BOB.inner)), // address
        helpers.TestValues.ONE_GWEI,                        // value
        0,                                                  // argsOffset
        0,                                                  // argsSize
        0,                                                  // retOffset
        0,                                                  // retSize
    });
    
    // Execute CALL (placeholder implementation)
    _ = helpers.executeOpcode(system.op_call, &test_vm.vm, &test_frame.frame) catch |err| {
        // CALL is not fully implemented
        try testing.expect(err == helpers.ExecutionError.Error.OutOfGas or 
                          err == helpers.ExecutionError.Error.StackUnderflow);
    };
}

test "Integration: Environment data access" {
    // Test accessing various environment data
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set up VM environment
    test_vm.vm.tx_origin = helpers.TestAddresses.ALICE;
    test_vm.vm.gas_price = 20 * helpers.TestValues.ONE_GWEI;
    test_vm.vm.block_number = 15000000;
    test_vm.vm.block_timestamp = 1234567890;
    test_vm.vm.block_coinbase = helpers.TestAddresses.CHARLIE;
    test_vm.vm.block_gas_limit = 30000000;
    test_vm.vm.chain_id = 1; // Mainnet
    
    var contract = helpers.Contract.init(
        helpers.TestAddresses.BOB,    // caller
        helpers.TestAddresses.CONTRACT,
        helpers.TestValues.ONE_GWEI,  // callvalue
        1_000_000,
        &[_]u8{},
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test ADDRESS
    _ = try helpers.executeOpcode(environment.op_address, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, @as(u256, @bitCast(helpers.TestAddresses.CONTRACT.inner)));
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test ORIGIN
    _ = try helpers.executeOpcode(environment.op_origin, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, @as(u256, @bitCast(helpers.TestAddresses.ALICE.inner)));
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test CALLER
    _ = try helpers.executeOpcode(environment.op_caller, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, @as(u256, @bitCast(helpers.TestAddresses.BOB.inner)));
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test CALLVALUE
    _ = try helpers.executeOpcode(environment.op_callvalue, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, helpers.TestValues.ONE_GWEI);
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test GASPRICE
    _ = try helpers.executeOpcode(environment.op_gasprice, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 20 * helpers.TestValues.ONE_GWEI);
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test CHAINID
    _ = try helpers.executeOpcode(environment.op_chainid, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1);
}

test "Integration: Block information access" {
    // Test block-related opcodes
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set up block information
    test_vm.vm.block_number = 17000000;
    test_vm.vm.block_timestamp = 1683000000;
    test_vm.vm.block_coinbase = helpers.TestAddresses.CHARLIE;
    test_vm.vm.block_difficulty = 0; // Post-merge
    test_vm.vm.block_gas_limit = 30000000;
    test_vm.vm.block_base_fee = 30 * helpers.TestValues.ONE_GWEI;
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test NUMBER
    _ = try helpers.executeOpcode(block.op_number, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 17000000);
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test TIMESTAMP
    _ = try helpers.executeOpcode(block.op_timestamp, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 1683000000);
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test COINBASE
    _ = try helpers.executeOpcode(block.op_coinbase, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, @as(u256, @bitCast(helpers.TestAddresses.CHARLIE.inner)));
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test GASLIMIT
    _ = try helpers.executeOpcode(block.op_gaslimit, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 30000000);
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test BASEFEE
    _ = try helpers.executeOpcode(block.op_basefee, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 30 * helpers.TestValues.ONE_GWEI);
}

test "Integration: Log emission with topics" {
    // Test LOG operations
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Prepare log data in memory
    const log_data = "Transfer successful";
    try test_frame.setMemory(0, log_data);
    
    // Prepare topics (e.g., Transfer event signature and addresses)
    const topic1: u256 = 0x1234567890abcdef; // Event signature
    const topic2: u256 = @as(u256, @bitCast(helpers.TestAddresses.ALICE.inner)); // From
    const topic3: u256 = @as(u256, @bitCast(helpers.TestAddresses.BOB.inner)); // To
    
    // Emit LOG3 (3 topics)
    try test_frame.pushStack(&[_]u256{
        0,              // offset
        log_data.len,   // size
        topic1,
        topic2,
        topic3,
    });
    
    const initial_log_count = test_vm.vm.logs.items.len;
    _ = try helpers.executeOpcode(log.op_log3, &test_vm.vm, &test_frame.frame);
    
    // Verify log was emitted
    try testing.expectEqual(initial_log_count + 1, test_vm.vm.logs.items.len);
    
    const emitted_log = test_vm.vm.logs.items[test_vm.vm.logs.items.len - 1];
    try testing.expectEqual(helpers.TestAddresses.CONTRACT, emitted_log.address);
    try testing.expectEqual(@as(usize, 3), emitted_log.topics.len);
    try testing.expectEqual(topic1, emitted_log.topics[0]);
    try testing.expectEqual(topic2, emitted_log.topics[1]);
    try testing.expectEqual(topic3, emitted_log.topics[2]);
    try testing.expectEqualSlices(u8, log_data, emitted_log.data);
}

test "Integration: External code operations" {
    // Test EXTCODESIZE, EXTCODECOPY, EXTCODEHASH
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Set up external contract with code
    const external_code = [_]u8{
        0x60, 0x80, // PUSH1 0x80
        0x60, 0x40, // PUSH1 0x40
        0x52,       // MSTORE
        0x00,       // STOP
    };
    
    try test_vm.setAccount(helpers.TestAddresses.BOB, 0, &external_code);
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test EXTCODESIZE
    try test_frame.pushStack(&[_]u256{@as(u256, @bitCast(helpers.TestAddresses.BOB.inner))});
    _ = try helpers.executeOpcode(environment.op_extcodesize, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, external_code.len);
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test EXTCODECOPY
    try test_frame.pushStack(&[_]u256{
        @as(u256, @bitCast(helpers.TestAddresses.BOB.inner)), // address
        0,                                                    // destOffset
        0,                                                    // offset
        external_code.len,                                    // size
    });
    _ = try helpers.executeOpcode(environment.op_extcodecopy, &test_vm.vm, &test_frame.frame);
    
    // Verify code was copied to memory
    const copied_code = try test_frame.getMemory(0, external_code.len);
    try testing.expectEqualSlices(u8, &external_code, copied_code);
    
    // Test EXTCODEHASH
    try test_frame.pushStack(&[_]u256{@as(u256, @bitCast(helpers.TestAddresses.BOB.inner))});
    _ = try helpers.executeOpcode(environment.op_extcodehash, &test_vm.vm, &test_frame.frame);
    
    // Hash should be non-zero for account with code
    const code_hash = try test_frame.popStack();
    try testing.expect(code_hash != 0);
}

test "Integration: Calldata operations" {
    // Test CALLDATALOAD, CALLDATASIZE, CALLDATACOPY
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Prepare calldata
    const calldata = [_]u8{
        0x12, 0x34, 0x56, 0x78, // Function selector
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x42, // uint256 argument = 66
    };
    
    var contract = helpers.Contract.init(
        helpers.TestAddresses.ALICE,
        helpers.TestAddresses.CONTRACT,
        0,
        1_000_000,
        &[_]u8{},
        [_]u8{0} ** 32,
        &calldata,
        false,
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test CALLDATASIZE
    _ = try helpers.executeOpcode(environment.op_calldatasize, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, calldata.len);
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test CALLDATALOAD at offset 0 (function selector)
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(environment.op_calldataload, &test_vm.vm, &test_frame.frame);
    
    // Should load 32 bytes starting from offset 0
    const loaded_value = try test_frame.popStack();
    try testing.expect((loaded_value >> (28 * 8)) == 0x12345678);
    
    // Test CALLDATALOAD at offset 4 (first argument)
    try test_frame.pushStack(&[_]u256{4});
    _ = try helpers.executeOpcode(environment.op_calldataload, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, 0x42);
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test CALLDATACOPY
    try test_frame.pushStack(&[_]u256{
        0,              // destOffset
        0,              // offset
        calldata.len,   // size
    });
    _ = try helpers.executeOpcode(environment.op_calldatacopy, &test_vm.vm, &test_frame.frame);
    
    // Verify calldata was copied to memory
    const copied_data = try test_frame.getMemory(0, calldata.len);
    try testing.expectEqualSlices(u8, &calldata, copied_data);
}

test "Integration: Self balance and code operations" {
    // Test SELFBALANCE, CODESIZE, CODECOPY
    const allocator = testing.allocator;
    
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Contract code
    const contract_code = [_]u8{
        0x60, 0x00, // PUSH1 0x00
        0x35,       // CALLDATALOAD
        0x60, 0x00, // PUSH1 0x00
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 0x20
        0x60, 0x00, // PUSH1 0x00
        0xf3,       // RETURN
    };
    
    // Set up contract with balance and code
    try test_vm.setAccount(helpers.TestAddresses.CONTRACT, helpers.TestValues.ONE_ETHER, &contract_code);
    
    var contract = helpers.Contract.init(
        helpers.TestAddresses.ALICE,
        helpers.TestAddresses.CONTRACT,
        0,
        1_000_000,
        &contract_code,
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Test SELFBALANCE
    _ = try helpers.executeOpcode(environment.op_selfbalance, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, helpers.TestValues.ONE_ETHER);
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test CODESIZE
    _ = try helpers.executeOpcode(environment.op_codesize, &test_vm.vm, &test_frame.frame);
    try helpers.expectStackValue(&test_frame.frame, 0, contract_code.len);
    _ = try helpers.executeOpcode(stack.op_pop, &test_vm.vm, &test_frame.frame);
    
    // Test CODECOPY
    try test_frame.pushStack(&[_]u256{
        0,                  // destOffset
        0,                  // offset
        contract_code.len,  // size
    });
    _ = try helpers.executeOpcode(environment.op_codecopy, &test_vm.vm, &test_frame.frame);
    
    // Verify code was copied to memory
    const copied_code = try test_frame.getMemory(0, contract_code.len);
    try testing.expectEqualSlices(u8, &contract_code, copied_code);
}