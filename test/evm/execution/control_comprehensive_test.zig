/// Comprehensive test suite for EVM control flow operations
/// Based on test cases from go-ethereum, revm, and evmone implementations
/// Covers all edge cases, jump validation, gas consumption, and state changes

const std = @import("std");
const testing = std.testing;
const helpers = @import("../opcodes/test_helpers.zig");

// Import control module directly to test implementation functions
const control = @import("../../../src/evm/execution/control.zig");

// Test constants for control flow operations
const TEST_VECTORS = struct {
    const ZERO = 0x0000000000000000000000000000000000000000000000000000000000000000;
    const ONE = 0x0000000000000000000000000000000000000000000000000000000000000001;
    const MAX_U256 = std.math.maxInt(u256);
    const MAX_USIZE = std.math.maxInt(usize);
    
    // Common jump destinations for testing
    const VALID_DEST_5 = 0x05;
    const VALID_DEST_10 = 0x0A;
    const INVALID_DEST_3 = 0x03;
    const OUT_OF_BOUNDS = 0x1000;
};

// ============================================================================
// STOP (0x00) - Comprehensive Tests
// ============================================================================

test "STOP: Execution termination and state preservation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x00}, // STOP
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // STOP should always return STOP error to halt execution
    try testing.expectError(
        helpers.ExecutionError.Error.STOP,
        helpers.executeOpcode(0x00, test_vm.vm, test_frame.frame)
    );
    
    // Stack should remain unchanged
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());
    
    // Gas should not be consumed by STOP itself (it's already accounted for)
    try testing.expectEqual(@as(u64, 1000), test_frame.frame.gas_remaining);
}

test "STOP: Gas consumption validation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x00},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const jump_table = helpers.JumpTable.init_from_hardfork(.FRONTIER);
    test_frame.frame.gas_remaining = 1000;

    // STOP costs 0 gas
    try testing.expectError(
        helpers.ExecutionError.Error.STOP,
        helpers.executeOpcodeWithGas(&jump_table, 0x00, test_vm.vm, test_frame.frame)
    );
    try helpers.expectGasUsed(test_frame.frame, 1000, 0);
}

// ============================================================================
// JUMP (0x56) - Comprehensive Tests
// ============================================================================

test "JUMP: Valid destination validation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create bytecode with valid JUMPDEST at position 5
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x60, 0x05, 0x56, 0x00, 0x00, 0x5B }, // PUSH1 5, JUMP, STOP, STOP, JUMPDEST
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push jump destination onto stack
    try test_frame.pushStack(&[_]u256{TEST_VECTORS.VALID_DEST_5});
    
    // Execute JUMP
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    
    // Verify PC was set correctly
    try testing.expectEqual(@as(usize, 5), test_frame.frame.pc);
    
    // Stack should be empty after consuming destination
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());
}

test "JUMP: Invalid destination rejection" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create bytecode without JUMPDEST at position 3
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x60, 0x03, 0x56, 0x00, 0x00, 0x5B }, // PUSH1 3, JUMP, STOP, STOP, JUMPDEST
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push invalid jump destination onto stack
    try test_frame.pushStack(&[_]u256{TEST_VECTORS.INVALID_DEST_3});
    
    // Execute JUMP - should fail with InvalidJump
    try testing.expectError(
        helpers.ExecutionError.Error.InvalidJump,
        helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame)
    );
}

test "JUMP: Out of bounds destination" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x60, 0x05, 0x56, 0x00, 0x00, 0x5B }, // PUSH1 5, JUMP, STOP, STOP, JUMPDEST
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push out-of-bounds destination
    try test_frame.pushStack(&[_]u256{TEST_VECTORS.OUT_OF_BOUNDS});
    
    // Execute JUMP - should fail with InvalidJump
    try testing.expectError(
        helpers.ExecutionError.Error.InvalidJump,
        helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame)
    );
}

test "JUMP: Large destination values" {
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test jumping to MAX_U256 (should fail)
    try test_frame.pushStack(&[_]u256{TEST_VECTORS.MAX_U256});
    try testing.expectError(
        helpers.ExecutionError.Error.InvalidJump,
        helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame)
    );
    
    // Test jumping to MAX_USIZE + 1 (should fail)
    test_frame.frame.stack.clear();
    const max_usize_plus_one = @as(u256, TEST_VECTORS.MAX_USIZE) + 1;
    try test_frame.pushStack(&[_]u256{max_usize_plus_one});
    try testing.expectError(
        helpers.ExecutionError.Error.InvalidJump,
        helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame)
    );
}

test "JUMP: Gas consumption validation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x5B, 0x00 }, // JUMPDEST, STOP
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const jump_table = helpers.JumpTable.init_from_hardfork(.FRONTIER);
    test_frame.frame.gas_remaining = 1000;
    try test_frame.pushStack(&[_]u256{0}); // Jump to JUMPDEST at position 0

    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x56, test_vm.vm, test_frame.frame);
    try helpers.expectGasUsed(test_frame.frame, 1000, 8); // JUMP costs GasMid = 8
}

// ============================================================================
// JUMPI (0x57) - Comprehensive Tests
// ============================================================================

test "JUMPI: Conditional execution with true condition" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create bytecode with JUMPDEST at position 5
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x60, 0x05, 0x60, 0x01, 0x57, 0x5B }, // PUSH1 5, PUSH1 1, JUMPI, JUMPDEST
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push destination and condition (non-zero means jump)
    try test_frame.pushStack(&[_]u256{ TEST_VECTORS.VALID_DEST_5, TEST_VECTORS.ONE });
    
    // Execute JUMPI
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    
    // Verify PC was set to destination
    try testing.expectEqual(@as(usize, 5), test_frame.frame.pc);
    
    // Stack should be empty after consuming both values
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());
}

test "JUMPI: Conditional execution with false condition" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x60, 0x05, 0x60, 0x00, 0x57, 0x5B }, // PUSH1 5, PUSH1 0, JUMPI, JUMPDEST
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const original_pc = test_frame.frame.pc;
    
    // Push destination and condition (zero means no jump)
    try test_frame.pushStack(&[_]u256{ TEST_VECTORS.VALID_DEST_5, TEST_VECTORS.ZERO });
    
    // Execute JUMPI
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    
    // Verify PC was NOT changed
    try testing.expectEqual(original_pc, test_frame.frame.pc);
    
    // Stack should be empty after consuming both values
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());
}

test "JUMPI: Invalid destination with true condition" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x60, 0x03, 0x60, 0x01, 0x57, 0x5B }, // PUSH1 3, PUSH1 1, JUMPI, JUMPDEST
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push invalid destination and true condition
    try test_frame.pushStack(&[_]u256{ TEST_VECTORS.INVALID_DEST_3, TEST_VECTORS.ONE });
    
    // Execute JUMPI - should fail with InvalidJump when condition is true
    try testing.expectError(
        helpers.ExecutionError.Error.InvalidJump,
        helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame)
    );
}

test "JUMPI: Invalid destination with false condition (should not fail)" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x60, 0x03, 0x60, 0x00, 0x57, 0x5B }, // PUSH1 3, PUSH1 0, JUMPI, JUMPDEST
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const original_pc = test_frame.frame.pc;
    
    // Push invalid destination and false condition
    try test_frame.pushStack(&[_]u256{ TEST_VECTORS.INVALID_DEST_3, TEST_VECTORS.ZERO });
    
    // Execute JUMPI - should succeed since condition is false (no jump attempted)
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    
    // Verify PC was NOT changed and no error occurred
    try testing.expectEqual(original_pc, test_frame.frame.pc);
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());
}

test "JUMPI: Condition evaluation edge cases" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x5B, 0x00 }, // JUMPDEST, STOP
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test various truthy conditions that should all trigger jump
    const truthy_conditions = [_]u256{
        1,
        42,
        TEST_VECTORS.MAX_U256,
        0x8000000000000000000000000000000000000000000000000000000000000000, // Sign bit
    };

    for (truthy_conditions) |condition| {
        test_frame.frame.stack.clear();
        test_frame.frame.pc = 1; // Reset PC away from JUMPDEST
        
        try test_frame.pushStack(&[_]u256{ 0, condition }); // Jump to JUMPDEST at 0
        _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
        
        // All non-zero conditions should jump to position 0
        try testing.expectEqual(@as(usize, 0), test_frame.frame.pc);
        try testing.expectEqual(@as(usize, 0), test_frame.stackSize());
    }
}

test "JUMPI: Gas consumption validation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{ 0x5B, 0x00 }, // JUMPDEST, STOP
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const jump_table = helpers.JumpTable.init_from_hardfork(.FRONTIER);
    
    // Test gas for taken jump
    test_frame.frame.gas_remaining = 1000;
    try test_frame.pushStack(&[_]u256{ 0, 1 }); // Jump to JUMPDEST at 0
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x57, test_vm.vm, test_frame.frame);
    try helpers.expectGasUsed(test_frame.frame, 1000, 10); // JUMPI costs GasHigh = 10
    
    // Test gas for not taken jump
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 1000;
    try test_frame.pushStack(&[_]u256{ 0, 0 }); // Don't jump
    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x57, test_vm.vm, test_frame.frame);
    try helpers.expectGasUsed(test_frame.frame, 1000, 10); // Same cost regardless of taken/not taken
}

// ============================================================================
// PC (0x58) - Comprehensive Tests
// ============================================================================

test "PC: Program counter retrieval" {
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test PC retrieval at various positions
    const test_positions = [_]usize{ 0, 1, 42, 100, 255, 1000 };
    
    for (test_positions) |pc_value| {
        test_frame.frame.stack.clear();
        test_frame.frame.pc = pc_value;
        
        // Execute PC opcode
        _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
        
        // Verify PC value was pushed to stack
        try helpers.expectStackValue(test_frame.frame, 0, @as(u256, @intCast(pc_value)));
        try testing.expectEqual(@as(usize, 1), test_frame.stackSize());
    }
}

test "PC: Gas consumption validation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x58},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const jump_table = helpers.JumpTable.init_from_hardfork(.FRONTIER);
    test_frame.frame.gas_remaining = 1000;

    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x58, test_vm.vm, test_frame.frame);
    try helpers.expectGasUsed(test_frame.frame, 1000, 2); // PC costs GasBase = 2
}

// ============================================================================
// JUMPDEST (0x5B) - Comprehensive Tests
// ============================================================================

test "JUMPDEST: No-op behavior and gas consumption" {
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const original_pc = test_frame.frame.pc;
    const original_stack_size = test_frame.stackSize();
    
    // Execute JUMPDEST
    _ = try helpers.executeOpcode(0x5B, test_vm.vm, test_frame.frame);
    
    // Verify JUMPDEST is a no-op (no state changes)
    try testing.expectEqual(original_pc, test_frame.frame.pc);
    try testing.expectEqual(original_stack_size, test_frame.stackSize());
}

test "JUMPDEST: Gas consumption validation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x5B},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const jump_table = helpers.JumpTable.init_from_hardfork(.FRONTIER);
    test_frame.frame.gas_remaining = 1000;

    _ = try helpers.executeOpcodeWithGas(&jump_table, 0x5B, test_vm.vm, test_frame.frame);
    try helpers.expectGasUsed(test_frame.frame, 1000, 1); // JUMPDEST costs GasJumpDest = 1
}

// ============================================================================
// RETURN (0xF3) - Comprehensive Tests
// ============================================================================

test "RETURN: Empty return data" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0xF3}, // RETURN
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push offset=0, size=0 for empty return
    try test_frame.pushStack(&[_]u256{ 0, 0 });
    
    // Execute RETURN - should end execution with STOP
    try testing.expectError(
        helpers.ExecutionError.Error.STOP,
        helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame)
    );
    
    // Verify return data was set to empty
    try testing.expectEqual(@as(usize, 0), test_frame.frame.return_data.size());
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());
}

test "RETURN: Return data from memory" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0xF3}, // RETURN
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000); // More gas for memory operations
    defer test_frame.deinit();

    // Store some data in memory first
    const test_data = [_]u8{ 0x42, 0x43, 0x44, 0x45 };
    try test_frame.frame.memory.store_bytes(0, &test_data);
    
    // Push offset=0, size=4 to return the test data
    try test_frame.pushStack(&[_]u256{ 0, 4 });
    
    // Execute RETURN
    try testing.expectError(
        helpers.ExecutionError.Error.STOP,
        helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame)
    );
    
    // Verify return data contains the expected bytes
    try testing.expectEqual(@as(usize, 4), test_frame.frame.return_data.size());
    const return_slice = test_frame.frame.return_data.data();
    try testing.expectEqualSlices(u8, &test_data, return_slice);
}

test "RETURN: Out of bounds memory access" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0xF3},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test with offset > MAX_USIZE
    try test_frame.pushStack(&[_]u256{ TEST_VECTORS.MAX_U256, 1 });
    try testing.expectError(
        helpers.ExecutionError.Error.OutOfOffset,
        helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame)
    );
    
    // Test with size > MAX_USIZE
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 0, TEST_VECTORS.MAX_U256 });
    try testing.expectError(
        helpers.ExecutionError.Error.OutOfOffset,
        helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame)
    );
}

// ============================================================================
// REVERT (0xFD) - Comprehensive Tests
// ============================================================================

test "REVERT: Empty revert data" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0xFD}, // REVERT
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Push offset=0, size=0 for empty revert
    try test_frame.pushStack(&[_]u256{ 0, 0 });
    
    // Execute REVERT - should end execution with REVERT error
    try testing.expectError(
        helpers.ExecutionError.Error.REVERT,
        helpers.executeOpcode(0xFD, test_vm.vm, test_frame.frame)
    );
    
    // Verify return data was set to empty
    try testing.expectEqual(@as(usize, 0), test_frame.frame.return_data.size());
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());
}

test "REVERT: Revert with custom error data" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0xFD}, // REVERT
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Store custom error data in memory
    const error_data = [_]u8{ 0x08, 0xC3, 0x79, 0xA0 }; // Error(string) selector
    try test_frame.frame.memory.store_bytes(0, &error_data);
    
    // Push offset=0, size=4 to revert with error data
    try test_frame.pushStack(&[_]u256{ 0, 4 });
    
    // Execute REVERT
    try testing.expectError(
        helpers.ExecutionError.Error.REVERT,
        helpers.executeOpcode(0xFD, test_vm.vm, test_frame.frame)
    );
    
    // Verify return data contains the error data
    try testing.expectEqual(@as(usize, 4), test_frame.frame.return_data.size());
    const return_slice = test_frame.frame.return_data.data();
    try testing.expectEqualSlices(u8, &error_data, return_slice);
}

test "REVERT: Out of bounds memory access" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0xFD},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    // Test with offset > MAX_USIZE
    try test_frame.pushStack(&[_]u256{ TEST_VECTORS.MAX_U256, 1 });
    try testing.expectError(
        helpers.ExecutionError.Error.OutOfOffset,
        helpers.executeOpcode(0xFD, test_vm.vm, test_frame.frame)
    );
}

// ============================================================================
// INVALID (0xFE) - Comprehensive Tests
// ============================================================================

test "INVALID: Gas consumption and error behavior" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0xFE}, // INVALID
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const original_gas = test_frame.frame.gas_remaining;
    
    // Execute INVALID - should consume all gas and return InvalidOpcode error
    try testing.expectError(
        helpers.ExecutionError.Error.InvalidOpcode,
        helpers.executeOpcode(0xFE, test_vm.vm, test_frame.frame)
    );
    
    // Verify all gas was consumed
    try testing.expectEqual(@as(u64, 0), test_frame.frame.gas_remaining);
    _ = original_gas; // Suppress unused variable warning
}

// ============================================================================
// SELFDESTRUCT (0xFF) - Comprehensive Tests
// ============================================================================

test "SELFDESTRUCT: Basic execution and state handling" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0xFF}, // SELFDESTRUCT
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Push beneficiary address
    try test_frame.pushStack(&[_]u256{@as(u256, @intFromPtr(helpers.TestAddresses.ALICE.bytes.ptr))});
    
    // Execute SELFDESTRUCT - should end execution with STOP
    try testing.expectError(
        helpers.ExecutionError.Error.STOP,
        helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame)
    );
    
    // Stack should be empty after consuming beneficiary
    try testing.expectEqual(@as(usize, 0), test_frame.stackSize());
}

test "SELFDESTRUCT: Static call protection" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0xFF},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    // Set static call flag
    test_frame.frame.is_static = true;
    
    // Push beneficiary address
    try test_frame.pushStack(&[_]u256{@as(u256, @intFromPtr(helpers.TestAddresses.ALICE.bytes.ptr))});
    
    // Execute SELFDESTRUCT in static context - should fail with WriteProtection
    try testing.expectError(
        helpers.ExecutionError.Error.WriteProtection,
        helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame)
    );
}

// ============================================================================
// Stack Underflow Error Conditions
// ============================================================================

test "Control: Stack underflow error conditions" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x56},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();

    const underflow_tests = [_]struct { opcode: u8, stack_items: u8, required: u8, desc: []const u8 }{
        // One-operand operations
        .{ .opcode = 0x56, .stack_items = 0, .required = 1, .desc = "JUMP empty stack" },
        .{ .opcode = 0xFF, .stack_items = 0, .required = 1, .desc = "SELFDESTRUCT empty stack" },
        
        // Two-operand operations
        .{ .opcode = 0x57, .stack_items = 0, .required = 2, .desc = "JUMPI empty stack" },
        .{ .opcode = 0x57, .stack_items = 1, .required = 2, .desc = "JUMPI one item" },
        .{ .opcode = 0xF3, .stack_items = 1, .required = 2, .desc = "RETURN one item" },
        .{ .opcode = 0xFD, .stack_items = 0, .required = 2, .desc = "REVERT empty stack" },
    };

    for (underflow_tests) |test_case| {
        test_frame.frame.stack.clear();
        
        // Push the specified number of stack items
        for (0..test_case.stack_items) |_| {
            try test_frame.frame.stack.append(42);
        }

        // Should fail with stack underflow
        try testing.expectError(
            helpers.ExecutionError.Error.StackUnderflow,
            helpers.executeOpcode(test_case.opcode, test_vm.vm, test_frame.frame)
        );
    }
}

// ============================================================================
// Gas Cost Validation for All Control Operations
// ============================================================================

test "Control: Comprehensive gas cost validation" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x5B}, // JUMPDEST for valid jump target
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();

    const jump_table = helpers.JumpTable.init_from_hardfork(.FRONTIER);

    // Gas cost validation for control operations
    const gas_tests = [_]struct { opcode: u8, stack_items: u8, expected_gas: u64, desc: []const u8 }{
        .{ .opcode = 0x00, .stack_items = 0, .expected_gas = 0, .desc = "STOP" },
        .{ .opcode = 0x56, .stack_items = 1, .expected_gas = 8, .desc = "JUMP" },
        .{ .opcode = 0x57, .stack_items = 2, .expected_gas = 10, .desc = "JUMPI" },
        .{ .opcode = 0x58, .stack_items = 0, .expected_gas = 2, .desc = "PC" },
        .{ .opcode = 0x5B, .stack_items = 0, .expected_gas = 1, .desc = "JUMPDEST" },
    };

    for (gas_tests) |gas_test| {
        test_frame.frame.stack.clear();
        test_frame.frame.gas_remaining = 10000;

        // Push required number of stack items
        for (0..gas_test.stack_items) |_| {
            try test_frame.frame.stack.append(0); // Jump target 0 (JUMPDEST)
        }

        // Handle opcodes that exit execution
        switch (gas_test.opcode) {
            0x00 => { // STOP
                try testing.expectError(
                    helpers.ExecutionError.Error.STOP,
                    helpers.executeOpcodeWithGas(&jump_table, gas_test.opcode, test_vm.vm, test_frame.frame)
                );
            },
            else => {
                _ = try helpers.executeOpcodeWithGas(&jump_table, gas_test.opcode, test_vm.vm, test_frame.frame);
            }
        }
        
        try helpers.expectGasUsed(test_frame.frame, 10000, gas_test.expected_gas);
    }
}