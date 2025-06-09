const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// Control Flow Instructions (0x56-0x58, 0x5A-0x5B)
// JUMP, JUMPI, PC, GAS, JUMPDEST
// ============================

// ============================
// 0x56: JUMP - Unconditional jump to destination
// ============================

test "JUMP (0x56): Basic unconditional jump" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create bytecode with JUMPDEST at position 5
    var code = [_]u8{0} ** 8;
    code[0] = 0x60; // PUSH1
    code[1] = 0x05; // 5 (jump destination)
    code[2] = 0x56; // JUMP
    code[3] = 0x00; // STOP (should be skipped)
    code[4] = 0x00; // padding
    code[5] = 0x5B; // JUMPDEST at position 5
    code[6] = 0x60; // PUSH1
    code[7] = 0x42; // 0x42

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

    // Push jump destination
    try test_frame.pushStack(&[_]u256{5});

    // Execute JUMP
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);

    // Program counter should now be at position 5
    try testing.expectEqual(@as(usize, 5), test_frame.frame.pc);
}

test "JUMP: Jump to various valid destinations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Complex bytecode with multiple JUMPDESTs
    const code = [_]u8{
        0x5B,       // JUMPDEST at position 0
        0x60, 0x05, // PUSH1 5
        0x5B,       // JUMPDEST at position 3
        0x60, 0x08, // PUSH1 8 
        0x5B,       // JUMPDEST at position 6
        0x60, 0x0C, // PUSH1 12
        0x5B,       // JUMPDEST at position 9
        0x60, 0x0F, // PUSH1 15
        0x5B,       // JUMPDEST at position 12
        0x60, 0x10, // PUSH1 16
        0x00,       // STOP
        0x5B,       // JUMPDEST at position 15
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

    // Test jumping to each valid JUMPDEST
    const destinations = [_]u256{ 0, 3, 6, 9, 12, 15 };

    for (destinations) |dest| {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        try test_frame.pushStack(&[_]u256{dest});
        _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
        try testing.expectEqual(@as(usize, @intCast(dest)), test_frame.frame.pc);
    }
}

test "JUMP: Invalid jump destinations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{
        0x60, 0x05, // PUSH1 5 - position 0,1
        0x56,       // JUMP - position 2
        0x00,       // STOP - position 3
        0x5B,       // JUMPDEST - position 4
        0x00,       // STOP - position 5
    };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    // Test jumping to invalid destinations
    const invalid_destinations = [_]u256{ 1, 2, 3, 5, 100, std.math.maxInt(usize) };

    for (invalid_destinations) |dest| {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        try test_frame.pushStack(&[_]u256{dest});
        const result = helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.InvalidJump, result);
    }
}

test "JUMP: Stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{0x5B}; // Just a JUMPDEST

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Don't push anything to stack - should cause stack underflow
    const result = helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
}

// ============================
// 0x57: JUMPI - Conditional jump to destination
// ============================

test "JUMPI (0x57): Conditional jump with true condition" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var code = [_]u8{0} ** 10;
    code[0] = 0x60; // PUSH1
    code[1] = 0x01; // 1 (condition)
    code[2] = 0x60; // PUSH1
    code[3] = 0x08; // 8 (destination)
    code[4] = 0x57; // JUMPI
    code[5] = 0x00; // STOP (should be skipped)
    code[6] = 0x00; // padding
    code[7] = 0x00; // padding
    code[8] = 0x5B; // JUMPDEST at position 8
    code[9] = 0x60; // PUSH1

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    // Force analysis to identify JUMPDEST positions
    contract.analyze_jumpdests(allocator);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Execute the PUSH1 instructions in the bytecode
    // PUSH1 1 (condition)
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame); // PUSH1 1
    
    // PUSH1 8 (destination)
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame); // PUSH1 8

    // Execute JUMPI
    test_frame.frame.pc = 4;
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);

    // Should have jumped to position 8
    try testing.expectEqual(@as(usize, 8), test_frame.frame.pc);
}

test "JUMPI: Conditional jump with false condition" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var code = [_]u8{0} ** 12;
    code[0] = 0x60; // PUSH1
    code[1] = 0x00; // 0 (false condition)
    code[2] = 0x60; // PUSH1
    code[3] = 0x09; // 9 (destination)
    code[4] = 0x57; // JUMPI
    code[5] = 0x60; // PUSH1
    code[6] = 0x42; // 0x42 (should execute)
    code[7] = 0x00; // STOP
    code[8] = 0x00; // padding
    code[9] = 0x5B; // JUMPDEST at position 9
    code[10] = 0x60; // PUSH1
    code[11] = 0x99; // 0x99 (should not execute)

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

    // Set PC to start of JUMPI instruction
    test_frame.frame.pc = 4; // Position of JUMPI

    // Push condition and destination
    try test_frame.pushStack(&[_]u256{ 0, 9 });

    // Execute JUMPI
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);

    // Should not have jumped - PC should remain at 4
    try testing.expectEqual(@as(usize, 4), test_frame.frame.pc);
}

test "JUMPI: Various condition values" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{
        0x5B, // JUMPDEST at position 0
        0x00, // STOP
    };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    // Test true conditions (any non-zero value)
    const true_conditions = [_]u256{ 1, 255, 1000, std.math.maxInt(u256) };
    
    for (true_conditions) |condition| {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        test_frame.frame.pc = 10; // Set to non-zero position
        try test_frame.pushStack(&[_]u256{ condition, 0 }); // condition, dest=0
        _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
        try testing.expectEqual(@as(usize, 0), test_frame.frame.pc); // Should jump
    }

    // Test false condition (only zero)
    {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        test_frame.frame.pc = 10;
        try test_frame.pushStack(&[_]u256{ 0, 0 }); // condition=0, dest=0
        _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
        try testing.expectEqual(@as(usize, 10), test_frame.frame.pc); // Should not jump
    }
}

test "JUMPI: Invalid destination with true condition" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{0x5B}; // JUMPDEST at position 0

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Try to jump to invalid destination with true condition
    try test_frame.pushStack(&[_]u256{ 1, 5 }); // condition=1 (true), dest=5 (invalid)
    const result = helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, result);
}

test "JUMPI: Stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{0x5B}; // JUMPDEST

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test with empty stack
    {
        const result = helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
    }

    // Test with only one value on stack (need two)
    {
        test_frame.frame.stack.clear();
        try test_frame.pushStack(&[_]u256{5});
        const result = helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
    }
}

// ============================
// 0x58: PC - Get current program counter
// ============================

test "PC (0x58): Get program counter at various positions" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{
        0x58,       // PC at position 0
        0x58,       // PC at position 1
        0x60, 0x42, // PUSH1 0x42 at position 2-3
        0x58,       // PC at position 4
        0x00,       // STOP at position 5
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

    // Test PC at position 0
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);
    _ = try test_frame.popStack();

    // Test PC at position 1
    test_frame.frame.pc = 1;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1);
    _ = try test_frame.popStack();

    // Test PC at position 4
    test_frame.frame.pc = 4;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 4);
    _ = try test_frame.popStack();

    // Test PC at large position
    test_frame.frame.pc = 1000;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1000);
}

test "PC: Stack overflow protection" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x58}, // PC
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Fill stack to capacity - 1 (so PC can still push one value)
    const stack_capacity = helpers.Stack.CAPACITY;
    for (0..stack_capacity - 1) |_| {
        try test_frame.pushStack(&[_]u256{0});
    }

    // This should succeed
    test_frame.frame.pc = 42;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 42);
    _ = try test_frame.popStack();

    // Fill stack to capacity
    try test_frame.pushStack(&[_]u256{0});

    // This should fail with stack overflow
    const result = helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackOverflow, result);
}

// ============================
// 0x5A: GAS - Get remaining gas
// ============================

test "GAS (0x5A): Get remaining gas" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x5A}, // GAS
    );
    defer contract.deinit(allocator, null);

    // Test with different gas amounts
    const test_gas_amounts = [_]u64{ 100, 1000, 10000, 100000, 1000000 };

    for (test_gas_amounts) |initial_gas| {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, initial_gas);
        defer test_frame.deinit();

        _ = try helpers.executeOpcode(0x5A, test_vm.vm, test_frame.frame);

        // GAS opcode should return remaining gas minus its own cost (2)
        const expected_gas = initial_gas - 2;
        try helpers.expectStackValue(test_frame.frame, 0, expected_gas);
        _ = try test_frame.popStack();
    }
}

test "GAS: After consuming gas with operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x5A}, // GAS
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    const initial_gas = test_frame.frame.gas_remaining;

    // Execute some operations to consume gas
    try test_frame.pushStack(&[_]u256{ 5, 10 });
    _ = try helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame); // ADD (costs 3)
    _ = try test_frame.popStack();

    try test_frame.pushStack(&[_]u256{ 2, 3 });
    _ = try helpers.executeOpcode(0x02, test_vm.vm, test_frame.frame); // MUL (costs 5)
    _ = try test_frame.popStack();

    // Now execute GAS opcode
    _ = try helpers.executeOpcode(0x5A, test_vm.vm, test_frame.frame);

    // Calculate expected remaining gas: initial - ADD - MUL - GAS
    const expected_gas = initial_gas - 3 - 5 - 2;
    try helpers.expectStackValue(test_frame.frame, 0, expected_gas);
}

test "GAS: Low gas scenarios" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x5A}, // GAS
    );
    defer contract.deinit(allocator, null);

    // Test with exactly enough gas for GAS opcode
    {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 2);
        defer test_frame.deinit();

        _ = try helpers.executeOpcode(0x5A, test_vm.vm, test_frame.frame);
        try helpers.expectStackValue(test_frame.frame, 0, 0); // All gas consumed
        _ = try test_frame.popStack();
    }

    // Test with not enough gas
    {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1);
        defer test_frame.deinit();

        const result = helpers.executeOpcode(0x5A, test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.OutOfGas, result);
    }
}

test "GAS: Stack overflow protection" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x5A}, // GAS
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Fill stack to capacity
    const stack_capacity = helpers.Stack.CAPACITY;
    for (0..stack_capacity) |_| {
        try test_frame.pushStack(&[_]u256{0});
    }

    // This should fail with stack overflow
    const result = helpers.executeOpcode(0x5A, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackOverflow, result);
}

// ============================
// 0x5B: JUMPDEST - Valid jump destination marker
// ============================

test "JUMPDEST (0x5B): Basic operation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{
        0x5B,       // JUMPDEST at position 0
        0x60, 0x42, // PUSH1 0x42
        0x5B,       // JUMPDEST at position 3
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

    // JUMPDEST should be a no-op
    const stack_size_before = test_frame.frame.stack.size;
    const gas_before = test_frame.frame.gas_remaining;

    _ = try helpers.executeOpcode(0x5B, test_vm.vm, test_frame.frame);

    // Stack should be unchanged
    try testing.expectEqual(stack_size_before, test_frame.frame.stack.size);

    // Should consume only JUMPDEST gas (1)
    try testing.expectEqual(@as(u64, gas_before - 1), test_frame.frame.gas_remaining);
}

test "JUMPDEST: Jump destination validation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create bytecode with JUMPDEST in various positions (like working test)
    var code = [_]u8{0} ** 12;
    code[0] = 0x5B; // JUMPDEST at position 0
    code[1] = 0x60; // PUSH1 
    code[2] = 0x05; // 5
    code[3] = 0x5B; // JUMPDEST at position 3
    code[4] = 0x60; // PUSH1
    code[5] = 0x09; // 9
    code[6] = 0x56; // JUMP
    code[7] = 0x00; // STOP (should be skipped)
    code[8] = 0x00; // padding
    code[9] = 0x5B; // JUMPDEST at position 9
    code[10] = 0x60; // PUSH1
    code[11] = 0x42; // 0x42

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    // Force analysis to ensure JUMPDEST positions are identified
    contract.analyze_jumpdests(allocator);

    // Debug: print bytecode to verify
    // std.debug.print("Code analysis complete. Code: ");
    // for (code) |byte| {
    //     std.debug.print("{x:02} ", .{byte});
    // }
    // std.debug.print("\n");

    // Verify JUMPDEST positions are valid
    try testing.expect(contract.valid_jumpdest(allocator, 0)); // Position 0
    try testing.expect(contract.valid_jumpdest(allocator, 3)); // Position 3
    try testing.expect(contract.valid_jumpdest(allocator, 9)); // Position 9

    // Verify non-JUMPDEST positions are invalid
    try testing.expect(!contract.valid_jumpdest(allocator, 1)); // PUSH1 opcode
    try testing.expect(!contract.valid_jumpdest(allocator, 2)); // PUSH1 data
    try testing.expect(!contract.valid_jumpdest(allocator, 6)); // JUMP opcode
    try testing.expect(!contract.valid_jumpdest(allocator, 8)); // padding

    // Test actual jumping to valid JUMPDEST
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    test_frame.frame.pc = 5; // Position before JUMP
    try test_frame.pushStack(&[_]u256{9}); // Jump to JUMPDEST at position 9
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame); // JUMP
    try testing.expectEqual(@as(usize, 9), test_frame.frame.pc);
}

test "JUMPDEST: Code analysis edge cases" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // JUMPDEST opcode appearing as data in PUSH instructions
    var code = [_]u8{0} ** 7;
    code[0] = 0x60; // PUSH1
    code[1] = 0x5B; // 0x5B (JUMPDEST as data)
    code[2] = 0x50; // POP
    code[3] = 0x5B; // Real JUMPDEST at position 3
    code[4] = 0x60; // PUSH1
    code[5] = 0x42; // 0x42
    code[6] = 0x00; // STOP

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    // Force analysis
    contract.analyze_jumpdests(allocator);

    // The 0x5B at position 1 should NOT be a valid jump destination (it's data)
    try testing.expect(!contract.valid_jumpdest(allocator, 1));

    // The 0x5B at position 3 SHOULD be a valid jump destination
    try testing.expect(contract.valid_jumpdest(allocator, 3));

    // Test jumping to the valid JUMPDEST
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    try test_frame.pushStack(&[_]u256{3});
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame); // JUMP
    try testing.expectEqual(@as(usize, 3), test_frame.frame.pc);
}

test "JUMPDEST: Empty code and no JUMPDEST scenarios" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Code with no JUMPDESTs
    const code_no_jumpdest = [_]u8{
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x24, // PUSH1 0x24
        0x01,       // ADD
        0x00,       // STOP
    };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code_no_jumpdest,
    );
    defer contract.deinit(allocator, null);

    // No positions should be valid jump destinations
    for (0..code_no_jumpdest.len) |i| {
        try testing.expect(!contract.valid_jumpdest(allocator, @intCast(i)));
    }

    // Test empty code
    var empty_contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer empty_contract.deinit(allocator, null);

    // No positions should be valid in empty code
    try testing.expect(!empty_contract.valid_jumpdest(allocator, 0));
    try testing.expect(!empty_contract.valid_jumpdest(allocator, 100));
}

// ============================
// Gas consumption tests
// ============================

test "Control Flow: Gas consumption verification" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{0x5B}; // Include JUMPDEST for JUMP/JUMPI tests

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    const opcodes = [_]struct {
        opcode: u8,
        name: []const u8,
        expected_gas: u64,
        setup: ?*const fn (*helpers.TestFrame) anyerror!void,
    }{
        .{ .opcode = 0x56, .name = "JUMP", .expected_gas = 8, .setup = &setupJump },
        .{ .opcode = 0x57, .name = "JUMPI", .expected_gas = 10, .setup = &setupJumpi },
        .{ .opcode = 0x58, .name = "PC", .expected_gas = 2, .setup = null },
        .{ .opcode = 0x5A, .name = "GAS", .expected_gas = 2, .setup = null },
        .{ .opcode = 0x5B, .name = "JUMPDEST", .expected_gas = 1, .setup = null },
    };

    for (opcodes) |op| {
        var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
        defer test_frame.deinit();

        const gas_before = test_frame.frame.gas_remaining;

        if (op.setup) |setup_fn| {
            try setup_fn(&test_frame);
        }

        _ = try helpers.executeOpcode(op.opcode, test_vm.vm, test_frame.frame);

        const gas_used = gas_before - test_frame.frame.gas_remaining;
        try testing.expectEqual(op.expected_gas, gas_used);
    }
}

fn setupJump(test_frame: *helpers.TestFrame) !void {
    try test_frame.pushStack(&[_]u256{0}); // Jump to position 0 (valid JUMPDEST)
}

fn setupJumpi(test_frame: *helpers.TestFrame) !void {
    try test_frame.pushStack(&[_]u256{ 0, 0 }); // condition=0 (don't jump), dest=0
}

// ============================
// Complex control flow scenarios
// ============================

test "Control Flow: Complex jump sequences" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create a program with complex control flow
    var code = [_]u8{0} ** 20;
    code[0] = 0x5B;   // JUMPDEST at 0 - entry point
    code[1] = 0x60;   // PUSH1
    code[2] = 0x08;   // 8 - jump to subroutine
    code[3] = 0x56;   // JUMP
    code[4] = 0x60;   // PUSH1 0xFF (should not execute)
    code[5] = 0xFF;   // 0xFF
    code[6] = 0x00;   // STOP
    code[7] = 0x00;   // padding
    code[8] = 0x5B;   // JUMPDEST at 8 - subroutine
    code[9] = 0x60;   // PUSH1
    code[10] = 0x42;  // 0x42
    code[11] = 0x60;  // PUSH1
    code[12] = 0x01;  // 1 (true condition)
    code[13] = 0x60;  // PUSH1
    code[14] = 0x11;  // 17 (conditional jump target)
    code[15] = 0x57;  // JUMPI
    code[16] = 0x00;  // STOP (should not execute)
    code[17] = 0x5B;  // JUMPDEST at 17 - conditional target
    code[18] = 0x60;  // PUSH1
    code[19] = 0x24;  // 0x24

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

    // Execute the complex flow manually
    // 1. Start at JUMPDEST 0
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x5B, test_vm.vm, test_frame.frame); // JUMPDEST

    // 2. PUSH1 8
    test_frame.frame.pc = 1;
    _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame); // PUSH1 8

    // 3. JUMP to 8
    test_frame.frame.pc = 3;
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame); // JUMP
    try testing.expectEqual(@as(usize, 8), test_frame.frame.pc);

    // 4. Execute JUMPDEST at 8
    _ = try helpers.executeOpcode(0x5B, test_vm.vm, test_frame.frame); // JUMPDEST

    // 5. PUSH1 0x42
    test_frame.frame.pc = 9;
    _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame); // PUSH1 0x42

    // 6. PUSH1 1
    test_frame.frame.pc = 11;
    _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame); // PUSH1 1

    // 7. PUSH1 17
    test_frame.frame.pc = 13;
    _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame); // PUSH1 17

    // 8. JUMPI (should jump because condition is 1)
    test_frame.frame.pc = 15;
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame); // JUMPI
    try testing.expectEqual(@as(usize, 17), test_frame.frame.pc);

    // Verify stack state
    const val3 = try test_frame.popStack(); // Should be 0x42
    try testing.expectEqual(@as(u256, 0x42), val3);
}

test "Control Flow: Program counter tracking" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var code = [_]u8{0} ** 8;
    code[0] = 0x58; // PC (should push 0)
    code[1] = 0x58; // PC (should push 1) 
    code[2] = 0x60; // PUSH1
    code[3] = 0x06; // 6 (jump to position 6)
    code[4] = 0x56; // JUMP
    code[5] = 0x58; // PC (should not execute)
    code[6] = 0x5B; // JUMPDEST at position 6
    code[7] = 0x58; // PC (should push 6)

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

    // Execute PC at position 0
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);

    // Execute PC at position 1
    test_frame.frame.pc = 1;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);

    // Execute PUSH1 6
    test_frame.frame.pc = 2;
    _ = try helpers.executeOpcode(0x60, test_vm.vm, test_frame.frame);

    // Execute JUMP
    test_frame.frame.pc = 4;
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 6), test_frame.frame.pc);

    // Execute PC at position 6
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);

    // Verify stack contains correct PC values
    // Expected stack from bottom to top: PC(0), PC(1), 6, PC(6)
    const pc_at_6 = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 6), pc_at_6);

    const val_6 = try test_frame.popStack(); // The pushed value 6 
    try testing.expectEqual(@as(u256, 6), val_6);

    const pc_at_1 = try test_frame.popStack(); // PC at position 1
    try testing.expectEqual(@as(u256, 1), pc_at_1);

    const pc_at_0 = try test_frame.popStack(); // PC at position 0
    try testing.expectEqual(@as(u256, 0), pc_at_0);
}

// ============================
// Error handling and edge cases
// ============================

test "Control Flow: Out of gas scenarios" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    const code = [_]u8{0x5B}; // JUMPDEST

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    const test_cases = [_]struct {
        opcode: u8,
        min_gas: u64,
        setup: ?*const fn (*helpers.TestFrame) anyerror!void,
    }{
        .{ .opcode = 0x56, .min_gas = 8, .setup = &setupJump },
        .{ .opcode = 0x57, .min_gas = 10, .setup = &setupJumpi },
        .{ .opcode = 0x58, .min_gas = 2, .setup = null },
        .{ .opcode = 0x5A, .min_gas = 2, .setup = null },
        .{ .opcode = 0x5B, .min_gas = 1, .setup = null },
    };

    for (test_cases) |case| {
        // Test with insufficient gas
        var test_frame = try helpers.TestFrame.init(allocator, &contract, case.min_gas - 1);
        defer test_frame.deinit();

        if (case.setup) |setup_fn| {
            try setup_fn(&test_frame);
        }

        const result = helpers.executeOpcode(case.opcode, test_vm.vm, test_frame.frame);
        try testing.expectError(helpers.ExecutionError.Error.OutOfGas, result);
    }
}

test "Control Flow: Stack operations edge cases" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x5B}, // JUMPDEST
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test PC and GAS push exactly one value
    const stack_ops = [_]u8{ 0x58, 0x5A }; // PC, GAS

    for (stack_ops) |opcode| {
        test_frame.frame.stack.clear();
        const initial_size = test_frame.frame.stack.size;

        _ = try helpers.executeOpcode(opcode, test_vm.vm, test_frame.frame);

        // Should push exactly one value
        try testing.expectEqual(initial_size + 1, test_frame.frame.stack.size);
        _ = try test_frame.popStack(); // Clean up
    }

    // Test JUMP and JUMPI consume correct number of stack items
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0}); // Only one value for JUMP
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame); // JUMP
    try testing.expectEqual(@as(usize, 0), test_frame.frame.stack.size);

    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 0, 0 }); // Two values for JUMPI
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame); // JUMPI
    try testing.expectEqual(@as(usize, 0), test_frame.frame.stack.size);

    // Test JUMPDEST doesn't affect stack
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42});
    _ = try helpers.executeOpcode(0x5B, test_vm.vm, test_frame.frame); // JUMPDEST
    try testing.expectEqual(@as(usize, 1), test_frame.frame.stack.size);
    try helpers.expectStackValue(test_frame.frame, 0, 42);
}