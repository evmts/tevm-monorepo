const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes to test
const evm = @import("evm");
const control = evm.opcodes.control;

test "Control: STOP halts execution" {
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

    // Execute STOP opcode - should return STOP error
    const result = helpers.executeOpcode(0x00, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, result);

    // Gas should not be consumed by the opcode itself (jump table handles base gas)
    try testing.expectEqual(@as(u64, 1000), test_frame.frame.gas_remaining);
}

test "Control: JUMP basic operations" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create contract with JUMPDEST at position 5
    var code = [_]u8{0} ** 10;
    code[5] = 0x5b; // JUMPDEST opcode

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

    // Test 1: Valid jump to JUMPDEST
    try test_frame.pushStack(&[_]u256{5}); // Jump to position 5
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 5), test_frame.frame.pc);
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());

    // Test 2: Invalid jump (not a JUMPDEST)
    test_frame.frame.pc = 0; // Reset PC
    try test_frame.pushStack(&[_]u256{3}); // Jump to position 3 (not JUMPDEST)
    const result = helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, result);

    // Test 3: Jump out of bounds
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{100}); // Jump beyond code size
    const result2 = helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, result2);

    // Test 4: Jump to max u256 (out of range)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{std.math.maxInt(u256)});
    const result3 = helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, result3);
}

test "Control: JUMPI conditional jump" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create contract with JUMPDEST at position 5
    var code = [_]u8{0} ** 10;
    code[5] = 0x5b; // JUMPDEST opcode

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

    // Test 1: Jump when condition is non-zero
    // JUMPI expects stack: [condition, destination] with destination on top
    try test_frame.pushStack(&[_]u256{ 1, 5 }); // condition=1, destination=5
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 5), test_frame.frame.pc);
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());

    // Test 2: No jump when condition is zero
    test_frame.frame.pc = 0; // Reset PC
    try test_frame.pushStack(&[_]u256{ 0, 5 }); // condition=0, destination=5
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.pc); // PC unchanged
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());

    // Test 3: Invalid jump with non-zero condition
    test_frame.frame.pc = 0;
    try test_frame.pushStack(&[_]u256{ 1, 3 }); // condition=1, destination=3 (not JUMPDEST)
    const result = helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, result);

    // Test 4: Invalid destination is OK if condition is zero
    test_frame.frame.stack.clear();
    test_frame.frame.pc = 0;
    try test_frame.pushStack(&[_]u256{ 0, 3 }); // condition=0, destination=3 (invalid)
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.pc); // No jump occurred
}

test "Control: PC returns program counter" {
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

    // Test 1: PC at position 0
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0);

    // Test 2: PC at position 42
    test_frame.frame.stack.clear();
    test_frame.frame.pc = 42;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 42);

    // Test 3: PC at large position
    test_frame.frame.stack.clear();
    test_frame.frame.pc = 1000;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1000);
}

test "Control: JUMPDEST is a no-op" {
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

    // Push some values to stack to ensure it's not modified
    try test_frame.pushStack(&[_]u256{ 42, 100 });

    // Execute JUMPDEST - should be a no-op
    _ = try helpers.executeOpcode(0x5B, test_vm.vm, test_frame.frame);

    // Stack should be unchanged
    try testing.expectEqual(@as(usize, 2), test_frame.stackSize());
    try helpers.expectStackValue(test_frame.frame, 0, 100);
    try helpers.expectStackValue(test_frame.frame, 1, 42);

    // PC should not be modified by the opcode
    try testing.expectEqual(@as(usize, 0), test_frame.frame.pc);
}

test "Control: RETURN with data" {
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

    // Test 1: Return with data
    const test_data = [_]u8{ 0xde, 0xad, 0xbe, 0xef };
    try test_frame.setMemory(10, &test_data);
    try test_frame.pushStack(&[_]u256{ 10, 4 }); // offset=10, size=4

    const result = helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, result); // RETURN uses STOP error

    // Check return data was set
    try testing.expectEqualSlices(u8, &test_data, test_frame.frame.return_data.get());

    // Test 2: Return with zero size
    test_frame.frame.stack.clear();
    try test_frame.frame.return_data.set(&[_]u8{ 1, 2, 3 }); // Set some existing data
    try test_frame.pushStack(&[_]u256{ 0, 0 }); // offset=0, size=0

    const result2 = helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, result2);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.return_data.size());

    // Test 3: Return with memory expansion
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 1000;
    try test_frame.pushStack(&[_]u256{ 100, 32 }); // offset=100, size=32

    const result3 = helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, result3);

    // Gas should be consumed for memory expansion
    try testing.expect(test_frame.frame.gas_remaining < 1000);
}

test "Control: REVERT with data" {
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

    // Test 1: Revert with data
    const test_data = [_]u8{ 0x08, 0xc3, 0x79, 0xa0 }; // Common revert signature
    try test_frame.setMemory(0, &test_data);
    try test_frame.pushStack(&[_]u256{ 0, 4 }); // offset=0, size=4

    const result = helpers.executeOpcode(0xFD, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.REVERT, result);

    // Check return data was set
    try testing.expectEqualSlices(u8, &test_data, test_frame.frame.return_data.get());

    // Test 2: Revert with zero size
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 0, 0 }); // offset=0, size=0

    const result2 = helpers.executeOpcode(0xFD, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.REVERT, result2);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.return_data.size());

    // Test 3: Revert with out of bounds offset
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ std.math.maxInt(u256), 32 });

    const result3 = helpers.executeOpcode(0xFD, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, result3);
}

test "Control: INVALID always fails" {
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

    // INVALID should always return InvalidOpcode error
    const result = helpers.executeOpcode(0xFE, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidOpcode, result);

    // Stack should be unchanged
    try test_frame.pushStack(&[_]u256{42});
    const result2 = helpers.executeOpcode(0xFE, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidOpcode, result2);
    try testing.expectEqual(@as(usize, 1), test_frame.stackSize());
}

test "Control: SELFDESTRUCT basic operation" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        100, // Contract has 100 wei
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Test 1: Selfdestruct to beneficiary
    const beneficiary = helpers.toU256(helpers.TestAddresses.BOB);
    try test_frame.pushStack(&[_]u256{beneficiary});

    const result = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, result);

    // Gas should be consumed for base SELFDESTRUCT (5000) + cold address access (2600)
    try helpers.expectGasUsed(test_frame.frame, 10000, 5000 + helpers.opcodes.gas_constants.ColdAccountAccessCost);

    // Test 2: Selfdestruct with warm beneficiary
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 10000;

    // Pre-warm the beneficiary address
    _ = try test_vm.vm.access_list.access_address(helpers.TestAddresses.BOB);
    try test_frame.pushStack(&[_]u256{beneficiary});

    const result2 = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, result2);

    // Only base SELFDESTRUCT gas (5000) should be consumed for warm address
    try helpers.expectGasUsed(test_frame.frame, 10000, 5000);

    // Test 3: Selfdestruct in static context should fail
    test_frame.frame.stack.clear();
    test_frame.frame.is_static = true;
    try test_frame.pushStack(&[_]u256{beneficiary});

    const result3 = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.WriteProtection, result3);
}

test "Control: Stack underflow errors" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x5b}, // JUMPDEST at position 0
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test JUMP with empty stack
    const jump_result = helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, jump_result);

    // Test JUMPI with insufficient stack
    try test_frame.pushStack(&[_]u256{0}); // Only destination, no condition
    const jumpi_result = helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, jumpi_result);

    // Test RETURN with empty stack
    test_frame.frame.stack.clear();
    const return_result = helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, return_result);

    // Test REVERT with only one value
    try test_frame.pushStack(&[_]u256{0});
    const revert_result = helpers.executeOpcode(0xFD, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, revert_result);

    // Test SELFDESTRUCT with empty stack
    test_frame.frame.stack.clear();
    const selfdestruct_result = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, selfdestruct_result);
}
