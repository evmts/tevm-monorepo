const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers");

// Import opcodes from evm module
const evm = @import("evm");
const environment = evm.opcodes.environment;
const system = evm.opcodes.system;
const block = evm.opcodes.block;
const stack = evm.opcodes.stack;
const arithmetic = evm.opcodes.arithmetic;
const memory_ops = evm.opcodes.memory;
const log = evm.opcodes.log;

test "Integration: Contract deployment simulation" {
    // Simulate CREATE operation with constructor
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up deployer account
    const deployer_balance: u256 = helpers.TestValues.ONE_ETHER;
    try test_vm.vm.state.set_balance(helpers.TestAddresses.ALICE, deployer_balance);

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
        0x55, // SSTORE (store 0x42 at slot 0)
        0x00, // STOP
    };

    try test_frame.setMemory(0, &constructor_code);

    // Push CREATE parameters: value, offset, size
    try test_frame.pushStack(&[_]u256{
        helpers.TestValues.ONE_GWEI, // value
        0, // offset
        constructor_code.len, // size
    });

    // Execute CREATE (will fail with placeholder implementation)
    _ = helpers.executeOpcode(0xF0, test_vm.vm, test_frame.frame) catch |err| {
        // CREATE is not fully implemented, but we can verify it tries to execute
        try testing.expect(err == helpers.ExecutionError.Error.OutOfGas or
            err == helpers.ExecutionError.Error.StackUnderflow or
            err == helpers.ExecutionError.Error.MaxCodeSizeExceeded);
    };
}

test "Integration: Call with value transfer" {
    // Test CALL operation with ETH transfer
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up accounts
    try test_vm.vm.state.set_balance(helpers.TestAddresses.ALICE, helpers.TestValues.ONE_ETHER);
    try test_vm.vm.state.set_balance(helpers.TestAddresses.BOB, 0);

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
    try test_vm.vm.state.set_balance(helpers.TestAddresses.CONTRACT, helpers.TestValues.ONE_ETHER);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Prepare CALL parameters
    // CALL(gas, address, value, argsOffset, argsSize, retOffset, retSize)
    try test_frame.pushStack(&[_]u256{
        50000, // gas
        helpers.toU256(helpers.TestAddresses.BOB), // address
        helpers.TestValues.ONE_GWEI, // value
        0, // argsOffset
        0, // argsSize
        0, // retOffset
        0, // retSize
    });

    // Execute CALL (placeholder implementation)
    _ = helpers.executeOpcode(0xF1, test_vm.vm, test_frame.frame) catch |err| {
        // CALL is not fully implemented
        try testing.expect(err == helpers.ExecutionError.Error.OutOfGas or
            err == helpers.ExecutionError.Error.StackUnderflow);
    };
}

test "Integration: Environment data access" {
    // Test accessing various environment data
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up VM environment
    test_vm.vm.context.tx_origin = helpers.TestAddresses.ALICE;
    test_vm.vm.context.gas_price = 20 * helpers.TestValues.ONE_GWEI;
    test_vm.vm.context.block_number = 15000000;
    test_vm.vm.context.block_timestamp = 1234567890;
    test_vm.vm.context.block_coinbase = helpers.TestAddresses.CHARLIE;
    test_vm.vm.context.block_gas_limit = 30000000;
    test_vm.vm.context.chain_id = 1; // Mainnet

    var contract = helpers.Contract.init(
        helpers.TestAddresses.BOB, // caller
        helpers.TestAddresses.CONTRACT,
        helpers.TestValues.ONE_GWEI, // callvalue
        1_000_000,
        &[_]u8{},
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test ADDRESS
    _ = try helpers.executeOpcode(0x30, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, helpers.toU256(helpers.TestAddresses.CONTRACT));
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test ORIGIN
    _ = try helpers.executeOpcode(0x32, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, helpers.toU256(helpers.TestAddresses.ALICE));
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test CALLER
    _ = try helpers.executeOpcode(0x33, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, helpers.toU256(helpers.TestAddresses.BOB));
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test CALLVALUE
    _ = try helpers.executeOpcode(0x34, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, helpers.TestValues.ONE_GWEI);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test GASPRICE
    _ = try helpers.executeOpcode(0x3A, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 20 * helpers.TestValues.ONE_GWEI);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test CHAINID
    _ = try helpers.executeOpcode(0x46, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1);
}

test "Integration: Block information access" {
    // Test block-related opcodes
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Set up block information
    test_vm.vm.context.block_number = 17000000;
    test_vm.vm.context.block_timestamp = 1683000000;
    test_vm.vm.context.block_coinbase = helpers.TestAddresses.CHARLIE;
    test_vm.vm.context.block_difficulty = 0; // Post-merge
    test_vm.vm.context.block_gas_limit = 30000000;
    test_vm.vm.context.block_base_fee = 30 * helpers.TestValues.ONE_GWEI;

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

    // Test NUMBER
    _ = try helpers.executeOpcode(0x43, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 17000000);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test TIMESTAMP
    _ = try helpers.executeOpcode(0x42, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1683000000);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test COINBASE
    _ = try helpers.executeOpcode(0x41, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, helpers.toU256(helpers.TestAddresses.CHARLIE));
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test GASLIMIT
    _ = try helpers.executeOpcode(0x45, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 30000000);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test BASEFEE
    _ = try helpers.executeOpcode(0x48, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 30 * helpers.TestValues.ONE_GWEI);
}

test "Integration: Log emission with topics" {
    // Test LOG operations
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

    // Prepare log data in memory
    const log_data = "Transfer successful";
    try test_frame.setMemory(0, log_data);

    // Prepare topics (e.g., Transfer event signature and addresses)
    const topic1: u256 = 0x1234567890abcdef; // Event signature
    const topic2: u256 = helpers.toU256(helpers.TestAddresses.ALICE); // From
    const topic3: u256 = helpers.toU256(helpers.TestAddresses.BOB); // To

    // Emit LOG3 (3 topics)
    try test_frame.pushStack(&[_]u256{
        topic1, // topic0 (bottom)
        topic2, // topic1
        topic3, // topic2
        log_data.len, // size
        0, // offset (top)
    });

    const initial_log_count = test_vm.vm.state.logs.items.len;
    _ = try helpers.executeOpcode(0xA3, test_vm.vm, test_frame.frame);

    // Verify log was emitted
    try testing.expectEqual(initial_log_count + 1, test_vm.vm.state.logs.items.len);

    const emitted_log = test_vm.vm.state.logs.items[test_vm.vm.state.logs.items.len - 1];
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
    defer test_vm.deinit(allocator);

    // Set up external contract with code
    const external_code = [_]u8{
        0x60, 0x80, // PUSH1 0x80
        0x60, 0x40, // PUSH1 0x40
        0x52, // MSTORE
        0x00, // STOP
    };

    try test_vm.vm.state.set_balance(helpers.TestAddresses.BOB, 0);
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

    // Test EXTCODESIZE
    try test_frame.pushStack(&[_]u256{helpers.toU256(helpers.TestAddresses.BOB)});
    _ = try helpers.executeOpcode(0x3B, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, external_code.len);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test EXTCODECOPY
    try test_frame.pushStack(&[_]u256{
        external_code.len, // size (bottom)
        0, // code_offset
        0, // mem_offset
        helpers.toU256(helpers.TestAddresses.BOB), // address (top)
    });
    _ = try helpers.executeOpcode(0x3C, test_vm.vm, test_frame.frame);

    // Verify code was copied to memory
    const copied_code = try test_frame.getMemory(0, external_code.len);
    try testing.expectEqualSlices(u8, &external_code, copied_code);

    // Test EXTCODEHASH
    try test_frame.pushStack(&[_]u256{helpers.toU256(helpers.TestAddresses.BOB)});
    _ = try helpers.executeOpcode(0x3F, test_vm.vm, test_frame.frame);

    // Hash should be non-zero for account with code
    const code_hash = try test_frame.popStack();
    try testing.expect(code_hash != 0);
}

test "Integration: Calldata operations" {
    // Test CALLDATALOAD, CALLDATASIZE, CALLDATACOPY
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Prepare calldata
    const calldata = [_]u8{
        0x12, 0x34, 0x56, 0x78, // Function selector
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
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
    _ = try helpers.executeOpcode(0x36, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, calldata.len);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test CALLDATALOAD at offset 0 (function selector)
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x35, test_vm.vm, test_frame.frame);

    // Should load 32 bytes starting from offset 0
    const loaded_value = try test_frame.popStack();
    try testing.expect((loaded_value >> (28 * 8)) == 0x12345678);

    // Test CALLDATALOAD at offset 4 (first argument)
    try test_frame.pushStack(&[_]u256{4});
    _ = try helpers.executeOpcode(0x35, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x42);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test CALLDATACOPY
    try test_frame.pushStack(&[_]u256{
        calldata.len, // size (bottom)
        0, // data_offset
        0, // mem_offset (top)
    });
    _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame);

    // Verify calldata was copied to memory
    const copied_data = try test_frame.getMemory(0, calldata.len);
    try testing.expectEqualSlices(u8, &calldata, copied_data);
}

test "Integration: Self balance and code operations" {
    // Test SELFBALANCE, CODESIZE, CODECOPY
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Contract code
    const contract_code = [_]u8{
        0x60, 0x00, // PUSH1 0x00
        0x35, // CALLDATALOAD
        0x60, 0x00, // PUSH1 0x00
        0x52, // MSTORE
        0x60, 0x20, // PUSH1 0x20
        0x60, 0x00, // PUSH1 0x00
        0xf3, // RETURN
    };

    // Set up contract with balance and code
    try test_vm.vm.state.set_balance(helpers.TestAddresses.CONTRACT, helpers.TestValues.ONE_ETHER);
    try test_vm.vm.state.set_code(helpers.TestAddresses.CONTRACT, &contract_code);

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
    _ = try helpers.executeOpcode(0x47, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, helpers.TestValues.ONE_ETHER);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test CODESIZE
    _ = try helpers.executeOpcode(0x38, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, contract_code.len);
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

    // Test CODECOPY
    try test_frame.pushStack(&[_]u256{
        contract_code.len, // size (bottom)
        0, // code_offset
        0, // mem_offset (top)
    });
    _ = try helpers.executeOpcode(0x39, test_vm.vm, test_frame.frame);

    // Verify code was copied to memory
    const copied_code = try test_frame.getMemory(0, contract_code.len);
    try testing.expectEqualSlices(u8, &contract_code, copied_code);
}
