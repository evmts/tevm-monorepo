const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");
const evm = @import("evm");

/// Enhanced control flow operations edge case tests inspired by revm and evmone patterns
/// 
/// This comprehensive test suite focuses on jump validation, memory expansion during returns,
/// boundary conditions for program counters, and sophisticated edge cases that production EVM
/// implementations handle. Tests are based on patterns found in revm's control.rs and evmone's
/// control flow architecture.
///
/// Key areas covered:
/// - Jump destination validation with boundary conditions and overflow scenarios
/// - Conditional jump behavior with zero/non-zero edge cases and stack ordering
/// - Return/revert operations with memory expansion, zero-length data, and overflow protection
/// - Program counter edge cases including large values and boundary conditions
/// - INVALID/SELFDESTRUCT operations with gas accounting and access list interactions
/// - Static call protection and write operation validation
/// - Complex interaction patterns between control flow and memory/gas systems

test "JUMP: Jump destination validation edge cases" {
    // Tests comprehensive jump destination validation including boundary conditions
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create contract with strategic JUMPDEST placement for edge case testing
    var code = [_]u8{0} ** 256;
    code[0] = 0x5b;   // JUMPDEST at 0
    code[1] = 0x60;   // PUSH1 (not a JUMPDEST)
    code[254] = 0x5b; // JUMPDEST near end
    code[255] = 0x00; // STOP at very end

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test case 1: Jump to boundary JUMPDEST positions
    try test_frame.pushStack(&[_]u256{0}); // Jump to first position
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame); // JUMP
    try testing.expectEqual(@as(usize, 0), test_frame.frame.pc);

    test_frame.frame.pc = 10; // Reset PC
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{254}); // Jump to near-end JUMPDEST
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 254), test_frame.frame.pc);

    // Test case 2: Jump to exact code boundary (invalid)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{256}); // One past code end
    const boundary_result = helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, boundary_result);

    // Test case 3: Jump to positions that are just off JUMPDEST
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{1}); // Position 1 is PUSH1, not JUMPDEST
    const off_jumpdest = helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, off_jumpdest);

    // Test case 4: Large jump targets (revm pattern: as_usize_or_fail)
    test_frame.frame.stack.clear();
    const large_target = @as(u256, std.math.maxInt(usize)) + 1;
    try test_frame.pushStack(&[_]u256{large_target});
    const large_result = helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, large_result);

    // Test case 5: Maximum valid usize target (should still be invalid if beyond code)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{std.math.maxInt(usize)});
    const max_usize_result = helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, max_usize_result);
}

test "JUMPI: Conditional jump stack order and condition edge cases" {
    // Tests conditional jump behavior with focus on stack ordering and condition evaluation
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create contract with JUMPDEST at multiple strategic positions
    var code = [_]u8{0} ** 50;
    code[5] = 0x5b;   // JUMPDEST at 5
    code[10] = 0x5b;  // JUMPDEST at 10
    code[20] = 0x5b;  // JUMPDEST at 20

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test case 1: Jump with condition = 1 (should jump)
    try test_frame.pushStack(&[_]u256{ 5, 1 }); // destination=5, condition=1 (on top)
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame); // JUMPI
    try testing.expectEqual(@as(usize, 5), test_frame.frame.pc);

    // Test case 2: Jump with condition = 0 (should not jump)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 10, 0 }); // destination=10, condition=0 (on top)
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.pc); // PC unchanged

    // Test case 3: Jump with large non-zero condition (revm: !cond.is_zero())
    test_frame.frame.stack.clear();
    const large_condition = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try test_frame.pushStack(&[_]u256{ 20, large_condition });
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 20), test_frame.frame.pc); // Should jump

    // Test case 4: Jump with condition = 1 but invalid destination (should fail)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 7, 1 }); // destination=7 (not JUMPDEST), condition=1
    test_frame.frame.pc = 0;
    const invalid_dest = helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidJump, invalid_dest);

    // Test case 5: Stack order verification - verify which value is condition vs destination
    test_frame.frame.stack.clear();
    const dest_value = 5;
    const cond_value = 42; // Non-zero, should trigger jump
    try test_frame.pushStack(&[_]u256{ dest_value, cond_value }); // Push in specific order
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, dest_value), test_frame.frame.pc); // Should jump to dest_value

    // Test case 6: Boundary condition with very small non-zero value
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{ 5, 1 }); // Minimal non-zero condition
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 5), test_frame.frame.pc);
}

test "PC: Program counter edge cases and boundary conditions" {
    // Tests PC opcode with various program counter positions and edge cases
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test case 1: PC at zero position
    test_frame.frame.pc = 0;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame); // PC
    const pc_zero = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), pc_zero);

    // Test case 2: PC at maximum reasonable position
    test_frame.frame.pc = 65535; // Large but reasonable PC
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    const pc_large = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 65535), pc_large);

    // Test case 3: PC at usize boundary (revm pattern: PC as U256)
    const max_usize_pc = std.math.maxInt(usize);
    test_frame.frame.pc = max_usize_pc;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    const pc_max = try test_frame.popStack();
    try testing.expectEqual(@as(u256, max_usize_pc), pc_max);

    // Test case 4: PC incrementation pattern - verify PC reports the current position
    test_frame.frame.pc = 42;
    const initial_stack_size = test_frame.stackSize();
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    const pc_reported = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 42), pc_reported); // Should report the PC passed to opcode
    try testing.expectEqual(initial_stack_size, test_frame.stackSize()); // Stack balanced

    // Test case 5: Multiple PC calls in sequence (stack accumulation test)
    test_frame.frame.pc = 100;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 200;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);
    test_frame.frame.pc = 300;
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame);

    // Stack should have 3 PC values in reverse order of execution
    const pc3 = try test_frame.popStack(); // Last PC pushed (300)
    const pc2 = try test_frame.popStack(); // Second PC pushed (200)
    const pc1 = try test_frame.popStack(); // First PC pushed (100)
    try testing.expectEqual(@as(u256, 300), pc3);
    try testing.expectEqual(@as(u256, 200), pc2);
    try testing.expectEqual(@as(u256, 100), pc1);
}

test "RETURN: Memory expansion and data handling edge cases" {
    // Tests RETURN opcode with focus on memory expansion and boundary conditions
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test case 1: Return with zero size (revm pattern: len != 0 check)
    try test_frame.pushStack(&[_]u256{ 0, 0 }); // size=0, offset=0 (on top)
    const initial_gas = test_frame.frame.gas_remaining;
    const zero_size_result = helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, zero_size_result);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.return_data.size());
    // No memory expansion gas should be consumed for zero size
    try testing.expectEqual(initial_gas, test_frame.frame.gas_remaining);

    // Test case 2: Return with data requiring memory expansion
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 10000;
    
    // Set up test data at memory position 64
    const test_data = [_]u8{ 0xde, 0xad, 0xbe, 0xef, 0x12, 0x34, 0x56, 0x78 };
    try test_frame.setMemory(64, &test_data);
    
    try test_frame.pushStack(&[_]u256{ 8, 64 }); // size=8, offset=64 (on top)
    const expand_result = helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, expand_result);
    
    // Verify data was correctly returned
    const returned_data = test_frame.frame.return_data.get();
    try testing.expectEqualSlices(u8, &test_data, returned_data);
    
    // Gas should be consumed for memory expansion
    try testing.expect(test_frame.frame.gas_remaining < 10000);

    // Test case 3: Return with offset overflow protection (revm pattern)
    test_frame.frame.stack.clear();
    const max_offset = std.math.maxInt(u256);
    const normal_size = 32;
    try test_frame.pushStack(&[_]u256{ normal_size, max_offset });
    const overflow_result = helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, overflow_result);

    // Test case 4: Return with size overflow protection
    test_frame.frame.stack.clear();
    const normal_offset = 0;
    const max_size = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{ max_size, normal_offset });
    const size_overflow_result = helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, size_overflow_result);

    // Test case 5: Return with very large but valid memory region
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 100000; // More gas for large memory
    
    const large_offset: u256 = 1024;
    const large_size: u256 = 64;
    
    // Initialize memory with pattern
    var large_data = [_]u8{0xAA} ** 64;
    try test_frame.setMemory(@intCast(large_offset), &large_data);
    
    try test_frame.pushStack(&[_]u256{ large_size, large_offset });
    const large_result = helpers.executeOpcode(0xF3, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, large_result);
    
    const large_returned = test_frame.frame.return_data.get();
    try testing.expectEqual(@as(usize, 64), large_returned.len);
    try testing.expectEqual(@as(u8, 0xAA), large_returned[0]);
    try testing.expectEqual(@as(u8, 0xAA), large_returned[63]);
}

test "REVERT: Error handling with data and gas accounting" {
    // Tests REVERT opcode with comprehensive error scenarios and gas accounting
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test case 1: Revert with typical error signature (revm pattern)
    const error_signature = [_]u8{ 0x08, 0xc3, 0x79, 0xa0 }; // Error(string) selector
    const error_data = "execution reverted".*;
    const full_error = error_signature ++ error_data;
    
    try test_frame.setMemory(0, &full_error);
    try test_frame.pushStack(&[_]u256{ full_error.len, 0 });
    
    const revert_result = helpers.executeOpcode(0xFD, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.REVERT, revert_result);
    
    const reverted_data = test_frame.frame.return_data.get();
    try testing.expectEqualSlices(u8, &full_error, reverted_data);

    // Test case 2: Revert with empty data (gas optimization test)
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 5000;
    const initial_gas = test_frame.frame.gas_remaining;
    
    try test_frame.pushStack(&[_]u256{ 0, 0 }); // size=0, offset=0
    const empty_revert = helpers.executeOpcode(0xFD, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.REVERT, empty_revert);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.return_data.size());
    
    // Should consume minimal gas for empty revert
    try testing.expectEqual(initial_gas, test_frame.frame.gas_remaining);

    // Test case 3: Revert with memory expansion beyond current size
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 10000;
    
    const revert_offset: u256 = 2048; // Large offset requiring expansion
    const revert_size: u256 = 128;
    
    // Set up data at the large offset
    var expansion_data = [_]u8{0xFF} ** 128;
    try test_frame.setMemory(@intCast(revert_offset), &expansion_data);
    
    try test_frame.pushStack(&[_]u256{ revert_size, revert_offset });
    const expansion_revert = helpers.executeOpcode(0xFD, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.REVERT, expansion_revert);
    
    // Gas should be consumed for memory expansion
    try testing.expect(test_frame.frame.gas_remaining < 10000);

    // Test case 4: Revert with boundary offset + size calculation
    test_frame.frame.stack.clear();
    const boundary_offset: u256 = std.math.maxInt(usize) - 64;
    const boundary_size: u256 = 32; // Won't overflow when added to offset
    
    // This should work if memory expansion gas is available
    test_frame.frame.gas_remaining = 100000;
    try test_frame.pushStack(&[_]u256{ boundary_size, boundary_offset });
    
    // This may succeed or fail depending on memory constraints, but shouldn't crash
    const boundary_result = helpers.executeOpcode(0xFD, test_vm.vm, test_frame.frame);
    // We expect either REVERT (success) or OutOfOffset/OutOfGas (boundary condition)
    const is_expected_error = boundary_result == helpers.ExecutionError.Error.REVERT or
        boundary_result == helpers.ExecutionError.Error.OutOfOffset or
        boundary_result == helpers.ExecutionError.Error.OutOfGas;
    try testing.expect(is_expected_error);
}

test "SELFDESTRUCT: Access list integration and gas accounting" {
    // Tests SELFDESTRUCT with EIP-2929 access list patterns and comprehensive gas accounting
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        1000, // Contract has 1000 wei balance
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000);
    defer test_frame.deinit();

    // Test case 1: SELFDESTRUCT with cold beneficiary (EIP-2929 pattern)
    const cold_beneficiary = helpers.toU256(helpers.TestAddresses.BOB);
    try test_frame.pushStack(&[_]u256{cold_beneficiary});
    
    const cold_gas_before = test_frame.frame.gas_remaining;
    const cold_result = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, cold_result);
    
    const cold_gas_used = cold_gas_before - test_frame.frame.gas_remaining;
    // Should consume base SELFDESTRUCT gas (5000) + cold access cost (2600)
    const expected_cold_cost = 5000 + helpers.opcodes.gas_constants.ColdAccountAccessCost;
    try testing.expectEqual(expected_cold_cost, cold_gas_used);

    // Test case 2: SELFDESTRUCT with warm beneficiary (should cost less)
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 50000;
    
    const warm_beneficiary = helpers.toU256(helpers.TestAddresses.CHARLIE);
    
    // Pre-warm the beneficiary address
    _ = try test_vm.vm.access_list.access_address(helpers.TestAddresses.CHARLIE);
    
    try test_frame.pushStack(&[_]u256{warm_beneficiary});
    
    const warm_gas_before = test_frame.frame.gas_remaining;
    const warm_result = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, warm_result);
    
    const warm_gas_used = warm_gas_before - test_frame.frame.gas_remaining;
    // Should only consume base SELFDESTRUCT gas (5000) for warm access
    try testing.expectEqual(@as(u64, 5000), warm_gas_used);

    // Test case 3: SELFDESTRUCT in static context (write protection)
    test_frame.frame.stack.clear();
    test_frame.frame.is_static = true;
    
    const static_beneficiary = helpers.toU256(helpers.TestAddresses.ALICE);
    try test_frame.pushStack(&[_]u256{static_beneficiary});
    
    const static_result = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.WriteProtection, static_result);

    // Test case 4: SELFDESTRUCT with self as beneficiary
    test_frame.frame.is_static = false;
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 50000;
    
    const self_address = helpers.toU256(helpers.TestAddresses.CONTRACT);
    try test_frame.pushStack(&[_]u256{self_address});
    
    const self_result = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, self_result);
    
    // Should still consume appropriate gas regardless of self-targeting

    // Test case 5: SELFDESTRUCT with maximum address value
    test_frame.frame.stack.clear();
    test_frame.frame.gas_remaining = 50000;
    
    const max_address = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; // Max 160-bit address
    try test_frame.pushStack(&[_]u256{max_address});
    
    const max_addr_result = helpers.executeOpcode(0xFF, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.STOP, max_addr_result);
    
    // Should succeed with valid address format
}

test "INVALID: Gas consumption and immediate termination" {
    // Tests INVALID opcode behavior including gas consumption patterns
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

    // Test case 1: INVALID consumes all remaining gas (revm pattern)
    const initial_gas = test_frame.frame.gas_remaining;
    
    const invalid_result = helpers.executeOpcode(0xFE, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidOpcode, invalid_result);
    
    // INVALID should consume all remaining gas
    try testing.expectEqual(@as(u64, 0), test_frame.frame.gas_remaining);

    // Test case 2: INVALID with stack data (should not modify stack)
    test_frame.frame.gas_remaining = 5000;
    try test_frame.pushStack(&[_]u256{ 42, 100, 200 });
    const initial_stack_size = test_frame.stackSize();
    
    const invalid_with_stack = helpers.executeOpcode(0xFE, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidOpcode, invalid_with_stack);
    
    // Stack should remain unchanged after INVALID
    try testing.expectEqual(initial_stack_size, test_frame.stackSize());
    
    // But gas should still be consumed
    try testing.expectEqual(@as(u64, 0), test_frame.frame.gas_remaining);

    // Test case 3: INVALID with minimal gas remaining
    test_frame.frame.gas_remaining = 1;
    
    const minimal_gas_result = helpers.executeOpcode(0xFE, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidOpcode, minimal_gas_result);
    try testing.expectEqual(@as(u64, 0), test_frame.frame.gas_remaining);

    // Test case 4: INVALID with zero gas (edge case)
    test_frame.frame.gas_remaining = 0;
    
    const zero_gas_result = helpers.executeOpcode(0xFE, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.InvalidOpcode, zero_gas_result);
    try testing.expectEqual(@as(u64, 0), test_frame.frame.gas_remaining);
}

test "Control flow: Gas cost verification across operations" {
    // Verifies gas consumption patterns for all control flow operations
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create contract with JUMPDEST for testing
    var code = [_]u8{0} ** 10;
    code[5] = 0x5b; // JUMPDEST at position 5

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        1000,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test gas costs for each control flow operation
    const control_ops = [_]struct {
        opcode: u8,
        stack_setup: []const u256,
        expected_base_gas: u64,
        name: []const u8,
        expect_error: ?helpers.ExecutionError.Error,
    }{
        .{ .opcode = 0x00, .stack_setup = &[_]u256{}, .expected_base_gas = 0, .name = "STOP", .expect_error = helpers.ExecutionError.Error.STOP },
        .{ .opcode = 0x56, .stack_setup = &[_]u256{5}, .expected_base_gas = 8, .name = "JUMP", .expect_error = null },
        .{ .opcode = 0x57, .stack_setup = &[_]u256{ 5, 1 }, .expected_base_gas = 10, .name = "JUMPI", .expect_error = null },
        .{ .opcode = 0x58, .stack_setup = &[_]u256{}, .expected_base_gas = 2, .name = "PC", .expect_error = null },
        .{ .opcode = 0x5B, .stack_setup = &[_]u256{}, .expected_base_gas = 1, .name = "JUMPDEST", .expect_error = null },
        .{ .opcode = 0xF3, .stack_setup = &[_]u256{ 0, 0 }, .expected_base_gas = 0, .name = "RETURN", .expect_error = helpers.ExecutionError.Error.STOP },
        .{ .opcode = 0xFD, .stack_setup = &[_]u256{ 0, 0 }, .expected_base_gas = 0, .name = "REVERT", .expect_error = helpers.ExecutionError.Error.REVERT },
        .{ .opcode = 0xFF, .stack_setup = &[_]u256{helpers.toU256(helpers.TestAddresses.BOB)}, .expected_base_gas = 5000, .name = "SELFDESTRUCT", .expect_error = helpers.ExecutionError.Error.STOP },
        .{ .opcode = 0xFE, .stack_setup = &[_]u256{}, .expected_base_gas = 0, .name = "INVALID", .expect_error = helpers.ExecutionError.Error.InvalidOpcode },
    };

    for (control_ops) |op| {
        // Reset frame state
        test_frame.frame.stack.clear();
        test_frame.frame.pc = 0;
        test_frame.frame.gas_remaining = 10000;
        test_frame.frame.is_static = false;

        // Set up stack for operation
        try test_frame.pushStack(op.stack_setup);

        const gas_before = test_frame.frame.gas_remaining;
        const result = helpers.executeOpcode(op.opcode, test_vm.vm, test_frame.frame);

        if (op.expect_error) |expected_error| {
            try testing.expectError(expected_error, result);
        } else {
            try testing.expect(result == {});
        }

        const gas_after = test_frame.frame.gas_remaining;
        
        // For INVALID, all gas is consumed
        if (op.opcode == 0xFE) {
            try testing.expectEqual(@as(u64, 0), gas_after);
        } else if (op.opcode == 0xFF) {
            // SELFDESTRUCT includes cold access cost
            const gas_used = gas_before - gas_after;
            const expected_total = op.expected_base_gas + helpers.opcodes.gas_constants.ColdAccountAccessCost;
            try testing.expectEqual(expected_total, gas_used);
        } else {
            // Other operations should consume their base gas cost
            const gas_used = gas_before - gas_after;
            try testing.expectEqual(op.expected_base_gas, gas_used);
        }
    }
}

test "Control flow: Complex interaction patterns" {
    // Tests complex interaction patterns between control flow operations
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create contract with multiple JUMPDESTs for complex flow
    var code = [_]u8{0} ** 100;
    code[10] = 0x5b; // JUMPDEST at 10
    code[20] = 0x5b; // JUMPDEST at 20
    code[30] = 0x5b; // JUMPDEST at 30
    code[40] = 0x5b; // JUMPDEST at 40

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    // Test case 1: PC followed by conditional jump based on PC value
    test_frame.frame.pc = 25; // Set specific PC
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame); // PC (pushes 25)
    
    // Now use that PC value to make a conditional jump decision
    try test_frame.pushStack(&[_]u256{20}); // destination
    // Stack is now [25, 20] with 20 on top
    
    // JUMPI with condition (25) and destination (20)
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame); // JUMPI
    try testing.expectEqual(@as(usize, 20), test_frame.frame.pc); // Should jump to 20

    // Test case 2: Chain of conditional jumps with varying conditions
    test_frame.frame.stack.clear();
    test_frame.frame.pc = 0;
    
    // First conditional jump with condition 0 (should not jump)
    try test_frame.pushStack(&[_]u256{ 10, 0 });
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 0), test_frame.frame.pc); // Should not jump

    // Second conditional jump with condition 1 (should jump)
    try test_frame.pushStack(&[_]u256{ 30, 1 });
    _ = try helpers.executeOpcode(0x57, test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 30), test_frame.frame.pc); // Should jump to 30

    // Test case 3: Jump to boundary followed by PC check
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{40}); // Jump to last JUMPDEST
    _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame); // JUMP
    try testing.expectEqual(@as(usize, 40), test_frame.frame.pc);

    // Check PC at boundary position
    _ = try helpers.executeOpcode(0x58, test_vm.vm, test_frame.frame); // PC
    const boundary_pc = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 40), boundary_pc);

    // Test case 4: Multiple JUMPDEST validations in sequence
    test_frame.frame.stack.clear();
    test_frame.frame.pc = 0;
    
    const jumpdest_sequence = [_]u256{ 10, 20, 30, 40 };
    for (jumpdest_sequence) |dest| {
        try test_frame.pushStack(&[_]u256{dest});
        _ = try helpers.executeOpcode(0x56, test_vm.vm, test_frame.frame); // JUMP
        try testing.expectEqual(@as(usize, @intCast(dest)), test_frame.frame.pc);
        
        // Execute JUMPDEST (no-op)
        _ = try helpers.executeOpcode(0x5B, test_vm.vm, test_frame.frame);
        
        // PC should be unchanged by JUMPDEST
        try testing.expectEqual(@as(usize, @intCast(dest)), test_frame.frame.pc);
    }
}