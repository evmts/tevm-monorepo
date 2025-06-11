const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes to test
const evm = @import("evm");

test "Stack: Complete PUSH1-PUSH32 coverage" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Test each PUSH operation from PUSH1 to PUSH32
    for (1..33) |push_size| {
        const opcode = 0x60 + push_size - 1; // PUSH1 = 0x60, PUSH2 = 0x61, etc.
        
        // Create test data of appropriate size
        var test_data: [32]u8 = [_]u8{0} ** 32;
        for (0..push_size) |i| {
            test_data[i] = @as(u8, @intCast(i + 1));
        }

        // Create contract with the PUSH instruction and data
        var contract_code: [33]u8 = [_]u8{0} ** 33;
        contract_code[0] = @as(u8, @intCast(opcode));
        @memcpy(contract_code[1..1+push_size], test_data[0..push_size]);

        var contract = try helpers.createTestContract(
            allocator,
            helpers.TestAddresses.CONTRACT,
            helpers.TestAddresses.ALICE,
            0,
            contract_code[0..1+push_size],
        );
        defer contract.deinit(allocator, null);

        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        // Execute PUSH operation
        _ = try helpers.executeOpcode(@as(u8, @intCast(opcode)), test_vm.vm, test_frame.frame);

        // Verify the correct value was pushed
        const stack_value = try test_frame.frame.stack.peek_n(0);
        
        // Calculate expected value (big-endian)
        var expected_value: u256 = 0;
        for (0..push_size) |i| {
            expected_value = (expected_value << 8) | test_data[i];
        }
        
        try testing.expectEqual(expected_value, stack_value);
        
        // Verify stack size is 1
        try testing.expectEqual(@as(usize, 1), test_frame.frame.stack.size);
        
        // Verify gas consumption (PUSH1-PUSH32 all cost 3 gas)
        try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastestStep);
    }
}

test "Stack: Complete DUP1-DUP16 coverage" {
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

    // Test each DUP operation from DUP1 to DUP16
    for (1..17) |dup_position| {
        const opcode = 0x80 + dup_position - 1; // DUP1 = 0x80, DUP2 = 0x81, etc.
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        // Set up stack with enough values
        var stack_values: [17]u256 = undefined;
        for (0..17) |i| {
            stack_values[i] = @as(u256, @intCast(100 + i));
            try test_frame.frame.stack.append(stack_values[i]);
        }

        const initial_size = test_frame.frame.stack.size;
        
        // Execute DUP operation
        _ = try helpers.executeOpcode(@as(u8, @intCast(opcode)), test_vm.vm, test_frame.frame);

        // Verify the correct value was duplicated
        const duplicated_value = try test_frame.frame.stack.peek_n(0);
        const original_value = try test_frame.frame.stack.peek_n(dup_position);
        
        try testing.expectEqual(original_value, duplicated_value);
        
        // Verify stack size increased by 1
        try testing.expectEqual(initial_size + 1, test_frame.frame.stack.size);
        
        // Verify gas consumption (DUP1-DUP16 all cost 3 gas)
        try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastestStep);
    }
}

test "Stack: Complete SWAP1-SWAP16 coverage" {
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

    // Test each SWAP operation from SWAP1 to SWAP16
    for (1..17) |swap_position| {
        const opcode = 0x90 + swap_position - 1; // SWAP1 = 0x90, SWAP2 = 0x91, etc.
        
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        // Set up stack with enough values
        var stack_values: [17]u256 = undefined;
        for (0..17) |i| {
            stack_values[i] = @as(u256, @intCast(200 + i));
            try test_frame.frame.stack.append(stack_values[i]);
        }

        const initial_size = test_frame.frame.stack.size;
        
        // Get values before swap
        const top_value = try test_frame.frame.stack.peek_n(0);
        const swap_value = try test_frame.frame.stack.peek_n(swap_position);
        
        // Execute SWAP operation
        _ = try helpers.executeOpcode(@as(u8, @intCast(opcode)), test_vm.vm, test_frame.frame);

        // Verify the values were swapped
        const new_top_value = try test_frame.frame.stack.peek_n(0);
        const new_swap_value = try test_frame.frame.stack.peek_n(swap_position);
        
        try testing.expectEqual(swap_value, new_top_value);
        try testing.expectEqual(top_value, new_swap_value);
        
        // Verify stack size unchanged
        try testing.expectEqual(initial_size, test_frame.frame.stack.size);
        
        // Verify gas consumption (SWAP1-SWAP16 all cost 3 gas)
        try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasFastestStep);
    }
}

test "Stack: POP and PUSH0 comprehensive coverage" {
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

    // Test PUSH0 (Shanghai+ opcode)
    {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        // Execute PUSH0
        _ = try helpers.executeOpcode(0x5F, test_vm.vm, test_frame.frame);

        // Verify zero was pushed
        try helpers.expectStackValue(test_frame.frame, 0, 0);
        try testing.expectEqual(@as(usize, 1), test_frame.frame.stack.size);
        
        // Verify gas consumption (PUSH0 costs 2 gas)
        try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
    }

    // Test POP
    {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        // Set up stack with values
        try test_frame.pushStack(&[_]u256{ 100, 200, 300 });
        
        const initial_size = test_frame.frame.stack.size;
        
        // Execute POP
        _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

        // Verify stack size decreased by 1
        try testing.expectEqual(initial_size - 1, test_frame.frame.stack.size);
        
        // Verify correct remaining values
        try helpers.expectStackValue(test_frame.frame, 0, 200);
        try helpers.expectStackValue(test_frame.frame, 1, 100);
        
        // Verify gas consumption (POP costs 2 gas)
        try helpers.expectGasUsed(test_frame.frame, 1000, helpers.opcodes.gas_constants.GasQuickStep);
    }
}

test "Stack: Boundary and edge cases" {
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

    // Test PUSH with maximum values
    {
        // Test PUSH32 with all 0xFF bytes
        const max_data = [_]u8{0xFF} ** 32;
        
        var contract_code: [33]u8 = undefined;
        contract_code[0] = 0x7F; // PUSH32
        @memcpy(contract_code[1..33], &max_data);

        var max_contract = try helpers.createTestContract(
            allocator,
            helpers.TestAddresses.BOB,
            helpers.TestAddresses.ALICE,
            0,
            &contract_code,
        );
        defer max_contract.deinit(allocator, null);

        var test_frame = try helpers.TestFrame.init(allocator, &max_contract, 1000);
        defer test_frame.deinit();

        _ = try helpers.executeOpcode(0x7F, test_vm.vm, test_frame.frame);

        // Should push maximum u256 value
        const expected_max = std.math.maxInt(u256);
        try helpers.expectStackValue(test_frame.frame, 0, expected_max);
    }

    // Test DUP at maximum depth
    {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        // Fill stack with 16 unique values
        for (0..16) |i| {
            try test_frame.frame.stack.append(@as(u256, @intCast(i + 1)));
        }

        // DUP16 should duplicate the bottom-most value (1)
        _ = try helpers.executeOpcode(0x8F, test_vm.vm, test_frame.frame); // DUP16

        try helpers.expectStackValue(test_frame.frame, 0, 1); // Should duplicate value 1
        try testing.expectEqual(@as(usize, 17), test_frame.frame.stack.size);
    }

    // Test SWAP at maximum depth
    {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        // Fill stack with 17 unique values
        for (0..17) |i| {
            try test_frame.frame.stack.append(@as(u256, @intCast(i + 1)));
        }

        // SWAP16 should swap top (17) with 17th from top (1) [0-indexed position 16]
        _ = try helpers.executeOpcode(0x9F, test_vm.vm, test_frame.frame); // SWAP16

        try helpers.expectStackValue(test_frame.frame, 0, 1);  // Top should now be 1
        try helpers.expectStackValue(test_frame.frame, 16, 17); // 16th position should now be 17
        try testing.expectEqual(@as(usize, 17), test_frame.frame.stack.size);
    }
}

test "Stack: Error conditions and validation" {
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

    // Test stack underflow errors
    {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        // POP on empty stack should fail
        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, 
                               helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame));

        // DUP1 on empty stack should fail
        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, 
                               helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame));

        // SWAP1 on stack with only one item should fail
        try test_frame.frame.stack.append(100);
        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, 
                               helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame));
    }

    // Test insufficient stack depth for DUP/SWAP operations
    {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        // Add only 5 items, then try DUP16 (needs 16 items)
        for (0..5) |i| {
            try test_frame.frame.stack.append(@as(u256, @intCast(i)));
        }

        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, 
                               helpers.executeOpcode(0x8F, test_vm.vm, test_frame.frame)); // DUP16

        // Add only 10 items, then try SWAP16 (needs 17 items total)
        test_frame.frame.stack.clear();
        for (0..10) |i| {
            try test_frame.frame.stack.append(@as(u256, @intCast(i)));
        }

        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, 
                               helpers.executeOpcode(0x9F, test_vm.vm, test_frame.frame)); // SWAP16
    }
}

test "Stack: Gas consumption verification" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x60, 0x01 }, // PUSH1 1
    );
    defer contract.deinit(allocator, null);

    // Test gas costs for different operation types
    const test_cases = [_]struct { opcode: u8, gas_cost: u64, setup_needed: bool }{
        .{ .opcode = 0x50, .gas_cost = helpers.opcodes.gas_constants.GasQuickStep, .setup_needed = true }, // POP (2 gas)
        .{ .opcode = 0x5F, .gas_cost = helpers.opcodes.gas_constants.GasQuickStep, .setup_needed = false }, // PUSH0 (2 gas)
        .{ .opcode = 0x60, .gas_cost = helpers.opcodes.gas_constants.GasFastestStep, .setup_needed = false }, // PUSH1 (3 gas)
        .{ .opcode = 0x7F, .gas_cost = helpers.opcodes.gas_constants.GasFastestStep, .setup_needed = false }, // PUSH32 (3 gas)
        .{ .opcode = 0x80, .gas_cost = helpers.opcodes.gas_constants.GasFastestStep, .setup_needed = true }, // DUP1 (3 gas)
        .{ .opcode = 0x8F, .gas_cost = helpers.opcodes.gas_constants.GasFastestStep, .setup_needed = true }, // DUP16 (3 gas)
        .{ .opcode = 0x90, .gas_cost = helpers.opcodes.gas_constants.GasFastestStep, .setup_needed = true }, // SWAP1 (3 gas)
        .{ .opcode = 0x9F, .gas_cost = helpers.opcodes.gas_constants.GasFastestStep, .setup_needed = true }, // SWAP16 (3 gas)
    };

    for (test_cases) |test_case| {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        // Set up stack if needed
        if (test_case.setup_needed) {
            for (0..17) |i| {
                try test_frame.frame.stack.append(@as(u256, @intCast(i + 1)));
            }
        }

        _ = try helpers.executeOpcode(test_case.opcode, test_vm.vm, test_frame.frame);

        try helpers.expectGasUsed(test_frame.frame, 1000, test_case.gas_cost);
    }
}

test "Stack: Sequential operations" {
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

    // Manual sequence: PUSH0, PUSH0, push manual values, DUP2, SWAP1, POP
    
    // Execute PUSH0 twice
    _ = try helpers.executeOpcode(0x5F, test_vm.vm, test_frame.frame);
    _ = try helpers.executeOpcode(0x5F, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 2), test_frame.frame.stack.size);

    // Manually push values for testing
    try test_frame.frame.stack.append(0x42);
    try test_frame.frame.stack.append(0x99);
    try testing.expectEqual(@as(usize, 4), test_frame.frame.stack.size);

    // Verify current stack state
    try helpers.expectStackValue(test_frame.frame, 0, 0x99);
    try helpers.expectStackValue(test_frame.frame, 1, 0x42);
    try helpers.expectStackValue(test_frame.frame, 2, 0);
    try helpers.expectStackValue(test_frame.frame, 3, 0);

    // Execute DUP2 (duplicate second item: 0x42)
    _ = try helpers.executeOpcode(0x81, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x42);
    try helpers.expectStackValue(test_frame.frame, 1, 0x99);
    try helpers.expectStackValue(test_frame.frame, 2, 0x42);
    try testing.expectEqual(@as(usize, 5), test_frame.frame.stack.size);

    // Execute SWAP1 (swap top two: 0x42 and 0x99)
    _ = try helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x99);
    try helpers.expectStackValue(test_frame.frame, 1, 0x42);
    try helpers.expectStackValue(test_frame.frame, 2, 0x42);
    try testing.expectEqual(@as(usize, 5), test_frame.frame.stack.size);

    // Execute POP (remove top: 0x99)
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0x42);
    try helpers.expectStackValue(test_frame.frame, 1, 0x42);
    try testing.expectEqual(@as(usize, 4), test_frame.frame.stack.size);
}