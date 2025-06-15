const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes to test
const evm = @import("evm");

test "SELFDESTRUCT: Basic functionality" {
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

    // Set contract balance
    try test_vm.vm.state.set_balance(helpers.TestAddresses.CONTRACT, 1000);

    // Push recipient address to stack
    try test_frame.pushStack(&[_]u256{helpers.TestAddresses.to_u256(helpers.TestAddresses.BOB)});

    // Execute SELFDESTRUCT opcode - should halt execution
    const result = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, result);

    // Stack should be empty after consuming recipient address
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());

    // Contract should be marked for destruction
    try testing.expect(test_vm.vm.state.is_marked_for_destruction(helpers.TestAddresses.CONTRACT));

    // Recipient should be correct
    const recipient = test_vm.vm.state.get_destruction_recipient(helpers.TestAddresses.CONTRACT);
    try testing.expect(recipient != null);
    try testing.expect(recipient.?.eql(helpers.TestAddresses.BOB));
}

test "SELFDESTRUCT: Forbidden in static call" {
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

    // Set static call flag
    test_frame.frame.is_static = true;

    // Push recipient address to stack
    try test_frame.pushStack(&[_]u256{helpers.TestAddresses.to_u256(helpers.TestAddresses.BOB)});

    // Execute SELFDESTRUCT opcode - should fail in static context
    const result = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.WriteProtection, result);

    // Contract should NOT be marked for destruction
    try testing.expect(!test_vm.vm.state.is_marked_for_destruction(helpers.TestAddresses.CONTRACT));
}

test "SELFDESTRUCT: Gas costs by hardfork" {
    const allocator = testing.allocator;

    // Test Frontier: 0 gas
    {
        var test_vm = try helpers.TestVm.init(allocator);
        test_vm.vm.hardfork = .FRONTIER;
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

        // Push recipient address to stack
        try test_frame.pushStack(&[_]u256{helpers.TestAddresses.to_u256(helpers.TestAddresses.BOB)});

        const gas_before = test_frame.frame.gas_remaining;
        _ = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
        
        // Should consume 0 gas in Frontier (plus any access list costs)
        const gas_consumed = gas_before - test_frame.frame.gas_remaining;
        // Note: actual gas might include access list costs, so we check it's reasonable
        try testing.expect(gas_consumed < 3000); // Should be much less than Tangerine Whistle
    }

    // Test Tangerine Whistle: 5000 gas base
    {
        var test_vm = try helpers.TestVm.init(allocator);
        test_vm.vm.hardfork = .TANGERINE_WHISTLE;
        defer test_vm.deinit(allocator);

        var contract = try helpers.createTestContract(
            allocator,
            helpers.TestAddresses.CONTRACT,
            helpers.TestAddresses.ALICE,
            0,
            &[_]u8{},
        );
        defer contract.deinit(allocator, null);

        var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000);
        defer test_frame.deinit();

        // Push recipient address to stack
        try test_frame.pushStack(&[_]u256{helpers.TestAddresses.to_u256(helpers.TestAddresses.BOB)});

        const gas_before = test_frame.frame.gas_remaining;
        _ = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
        
        const gas_consumed = gas_before - test_frame.frame.gas_remaining;
        // Should consume 5000 base + access costs
        try testing.expect(gas_consumed >= 5000);
        try testing.expect(gas_consumed < 10000); // Reasonable upper bound
    }
}

test "SELFDESTRUCT: Account creation cost (EIP-161)" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    test_vm.vm.hardfork = .SPURIOUS_DRAGON; // First hardfork with EIP-161
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000);
    defer test_frame.deinit();

    // Use a fresh address that doesn't exist (no balance, code, or nonce)
    const new_address = helpers.TestAddresses.random();
    
    // Push non-existent recipient address to stack
    try test_frame.pushStack(&[_]u256{helpers.TestAddresses.to_u256(new_address)});

    const gas_before = test_frame.frame.gas_remaining;
    _ = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
    
    const gas_consumed = gas_before - test_frame.frame.gas_remaining;
    // Should consume 5000 base + 25000 account creation + access costs
    try testing.expect(gas_consumed >= 30000);
    try testing.expect(gas_consumed < 35000); // Reasonable upper bound
}