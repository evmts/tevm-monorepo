const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const helpers = @import("test_helpers.zig");
const gas_constants = evm.gas_constants;

/// Comprehensive test suite for SSTORE gas refunds according to EIP-2200, EIP-2929, and EIP-3529
/// This test file specifically focuses on gas refund mechanisms and transaction finalization

// ============================
// EIP-2200 Gas Refund Tests
// ============================

test "SSTORE Gas Refunds: Clearing storage slot (non-zero to zero)" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55}, // SSTORE
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    const slot: u256 = 0x123;
    
    // Set up initial non-zero value in storage
    try test_vm.vm.state.set_storage(helpers.TestAddresses.CONTRACT, slot, 0x456);
    
    // Get initial refund total
    const initial_refunds = test_vm.vm.get_total_refunds();
    
    // Clear the storage slot (non-zero -> zero)
    try test_frame.pushStack(&[_]u256{0}); // value: zero
    try test_frame.pushStack(&[_]u256{slot}); // slot
    
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    // Check that refund was added
    const final_refunds = test_vm.vm.get_total_refunds();
    const refund_added = final_refunds - initial_refunds;
    
    // Should receive SSTORE_CLEAR_REFUND (15000 gas)
    try testing.expectEqual(@as(u64, gas_constants.SSTORE_CLEAR_REFUND), refund_added);
    
    // Verify the storage was actually cleared
    const stored_value = test_vm.vm.state.get_storage(helpers.TestAddresses.CONTRACT, slot);
    try testing.expectEqual(@as(u256, 0), stored_value);
}

test "SSTORE Gas Refunds: Setting zero to non-zero then back to zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55}, // SSTORE
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 200000);
    defer test_frame.deinit();

    const slot: u256 = 0x789;
    
    // Step 1: Set zero to non-zero (original=0, current=0, new=123)
    try test_frame.pushStack(&[_]u256{0x123}); // value: non-zero
    try test_frame.pushStack(&[_]u256{slot}); // slot
    
    const refunds_after_set = test_vm.vm.get_total_refunds();
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    // No refund expected for zero -> non-zero
    try testing.expectEqual(refunds_after_set, test_vm.vm.get_total_refunds());
    
    // Step 2: Set non-zero back to zero (original=0, current=123, new=0)
    try test_frame.pushStack(&[_]u256{0}); // value: zero
    try test_frame.pushStack(&[_]u256{slot}); // slot
    
    const refunds_before_clear = test_vm.vm.get_total_refunds();
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    const refunds_after_clear = test_vm.vm.get_total_refunds();
    
    // Should receive SSTORE_SET_REFUND (19900 gas) for restoring to original zero
    const refund_added = refunds_after_clear - refunds_before_clear;
    try testing.expectEqual(@as(u64, gas_constants.SSTORE_SET_REFUND), refund_added);
}

test "SSTORE Gas Refunds: Complex refund scenarios with multiple modifications" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55}, // SSTORE
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 300000);
    defer test_frame.deinit();

    const slot: u256 = 0xABC;
    
    // Set initial value to track original
    try test_vm.vm.state.set_storage(helpers.TestAddresses.CONTRACT, slot, 0x111);
    
    // Sequence: 0x111 -> 0x222 -> 0 -> 0x111 (back to original)
    
    // Step 1: 0x111 -> 0x222 (original=0x111, current=0x111, new=0x222)
    try test_frame.pushStack(&[_]u256{0x222});
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    // Step 2: 0x222 -> 0 (original=0x111, current=0x222, new=0)
    try test_frame.pushStack(&[_]u256{0});
    try test_frame.pushStack(&[_]u256{slot});
    
    const refunds_before_clear = test_vm.vm.get_total_refunds();
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    const refunds_after_clear = test_vm.vm.get_total_refunds();
    
    // Should get SSTORE_CLEAR_REFUND for setting to zero
    try testing.expect(refunds_after_clear > refunds_before_clear);
    
    // Step 3: 0 -> 0x111 (original=0x111, current=0, new=0x111) - back to original
    try test_frame.pushStack(&[_]u256{0x111});
    try test_frame.pushStack(&[_]u256{slot});
    
    const refunds_before_restore = test_vm.vm.get_total_refunds();
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    const refunds_after_restore = test_vm.vm.get_total_refunds();
    
    // Complex refund calculation: should get RESET_REFUND and lose CLEAR_REFUND
    // The exact amount depends on the EIP-2200 complex logic
    try testing.expect(refunds_after_restore != refunds_before_restore);
}

// ============================
// Transaction Finalization and Refund Cap Tests
// ============================

test "Transaction Finalization: EIP-3529 refund cap (20% for London+)" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init_with_hardfork(allocator, .LONDON);
    defer test_vm.deinit(allocator);

    // Simulate a scenario where many refunds are earned
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55}, // SSTORE
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 500000);
    defer test_frame.deinit();
    
    // Create multiple storage clearings to accumulate large refunds
    for (0..10) |i| {
        const slot = @as(u256, i);
        // Set initial non-zero value
        try test_vm.vm.state.set_storage(helpers.TestAddresses.CONTRACT, slot, 0x999);
        
        // Clear it to earn refund
        try test_frame.pushStack(&[_]u256{0}); // value: zero
        try test_frame.pushStack(&[_]u256{slot}); // slot
        _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    }
    
    // Total refunds should be 10 * 15000 = 150000
    const total_refunds_before_cap = test_vm.vm.get_total_refunds();
    try testing.expectEqual(@as(u64, 10 * gas_constants.SSTORE_CLEAR_REFUND), total_refunds_before_cap);
    
    // Simulate transaction completion with 200000 gas used
    const gas_used: u64 = 200000;
    const final_refund = test_vm.vm.finalize_transaction(gas_used);
    
    // London+ cap: 20% of gas used = 200000 / 5 = 40000
    const expected_cap = gas_used / 5;
    try testing.expectEqual(expected_cap, final_refund);
    try testing.expect(final_refund < total_refunds_before_cap); // Refund was capped
}

test "Transaction Finalization: Pre-London refund cap (50%)" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init_with_hardfork(allocator, .ISTANBUL);
    defer test_vm.deinit(allocator);

    // Similar test but with pre-London hardfork
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55}, // SSTORE
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 500000);
    defer test_frame.deinit();
    
    // Create multiple storage clearings
    for (0..5) |i| {
        const slot = @as(u256, i + 100);
        // Set initial non-zero value
        try test_vm.vm.state.set_storage(helpers.TestAddresses.CONTRACT, slot, 0x777);
        
        // Clear it to earn refund
        try test_frame.pushStack(&[_]u256{0}); // value: zero
        try test_frame.pushStack(&[_]u256{slot}); // slot
        _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    }
    
    // Total refunds: 5 * 15000 = 75000
    const total_refunds_before_cap = test_vm.vm.get_total_refunds();
    try testing.expectEqual(@as(u64, 5 * gas_constants.SSTORE_CLEAR_REFUND), total_refunds_before_cap);
    
    // Simulate transaction completion with 100000 gas used
    const gas_used: u64 = 100000;
    const final_refund = test_vm.vm.finalize_transaction(gas_used);
    
    // Pre-London cap: 50% of gas used = 100000 / 2 = 50000
    const expected_cap = gas_used / 2;
    try testing.expectEqual(expected_cap, final_refund);
    try testing.expect(final_refund < total_refunds_before_cap); // Refund was capped
}

test "Transaction Finalization: Refunds below cap (no capping)" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init_with_hardfork(allocator, .LONDON);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55}, // SSTORE
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Earn a small refund
    const slot: u256 = 0x456;
    try test_vm.vm.state.set_storage(helpers.TestAddresses.CONTRACT, slot, 0x789);
    
    try test_frame.pushStack(&[_]u256{0}); // Clear storage
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    const total_refunds = test_vm.vm.get_total_refunds();
    try testing.expectEqual(@as(u64, gas_constants.SSTORE_CLEAR_REFUND), total_refunds);
    
    // Use high gas amount so refund is below cap
    const gas_used: u64 = 500000;
    const final_refund = test_vm.vm.finalize_transaction(gas_used);
    
    // Refund should be unchanged (below cap)
    try testing.expectEqual(total_refunds, final_refund);
}

// ============================
// Gas Refund Edge Cases
// ============================

test "SSTORE Gas Refunds: No refund for non-zero to different non-zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55}, // SSTORE
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    const slot: u256 = 0x111;
    
    // Set initial non-zero value
    try test_vm.vm.state.set_storage(helpers.TestAddresses.CONTRACT, slot, 0x222);
    
    const initial_refunds = test_vm.vm.get_total_refunds();
    
    // Change to different non-zero value
    try test_frame.pushStack(&[_]u256{0x333});
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    const final_refunds = test_vm.vm.get_total_refunds();
    
    // No refund should be given for non-zero to different non-zero
    try testing.expectEqual(initial_refunds, final_refunds);
}

test "SSTORE Gas Refunds: No refund for same value stores" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55}, // SSTORE
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    const slot: u256 = 0x444;
    const value: u256 = 0x555;
    
    // Set initial value
    try test_vm.vm.state.set_storage(helpers.TestAddresses.CONTRACT, slot, value);
    
    const initial_refunds = test_vm.vm.get_total_refunds();
    
    // Store same value
    try test_frame.pushStack(&[_]u256{value});
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    const final_refunds = test_vm.vm.get_total_refunds();
    
    // No refund for no-op
    try testing.expectEqual(initial_refunds, final_refunds);
}

// ============================
// Cross-Hardfork Compatibility Tests
// ============================

test "SSTORE Gas Refunds: Consistency across hardforks" {
    const hardforks = [_]evm.Hardfork.Hardfork{ .ISTANBUL, .BERLIN, .LONDON, .SHANGHAI, .CANCUN };
    
    for (hardforks) |hardfork| {
        const allocator = testing.allocator;
        var test_vm = try helpers.TestVm.init_with_hardfork(allocator, hardfork);
        defer test_vm.deinit(allocator);

        var contract = try helpers.createTestContract(
            allocator,
            helpers.TestAddresses.CONTRACT,
            helpers.TestAddresses.ALICE,
            0,
            &[_]u8{0x55}, // SSTORE
        );
        defer contract.deinit(allocator, null);

        var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
        defer test_frame.deinit();

        const slot: u256 = 0x666;
        
        // Set initial non-zero value
        try test_vm.vm.state.set_storage(helpers.TestAddresses.CONTRACT, slot, 0x777);
        
        const initial_refunds = test_vm.vm.get_total_refunds();
        
        // Clear storage to earn refund
        try test_frame.pushStack(&[_]u256{0});
        try test_frame.pushStack(&[_]u256{slot});
        _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
        
        const final_refunds = test_vm.vm.get_total_refunds();
        const refund_earned = final_refunds - initial_refunds;
        
        // All hardforks should give the same base refund for clearing storage
        try testing.expectEqual(@as(u64, gas_constants.SSTORE_CLEAR_REFUND), refund_earned);
    }
}

// ============================
// Original Storage Value Tracking Tests
// ============================

test "Original Storage Values: Proper tracking across transaction" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55}, // SSTORE
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 200000);
    defer test_frame.deinit();

    const slot: u256 = 0x888;
    const original_value: u256 = 0x999;
    
    // Set initial value before transaction starts
    try test_vm.vm.state.set_storage(helpers.TestAddresses.CONTRACT, slot, original_value);
    
    // First access should capture the original value
    const captured_original = try test_vm.vm.get_original_storage_value(helpers.TestAddresses.CONTRACT, slot);
    try testing.expectEqual(original_value, captured_original);
    
    // Modify the storage multiple times
    try test_frame.pushStack(&[_]u256{0x111});
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    try test_frame.pushStack(&[_]u256{0x222});
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    // Original value should remain the same
    const still_original = try test_vm.vm.get_original_storage_value(helpers.TestAddresses.CONTRACT, slot);
    try testing.expectEqual(original_value, still_original);
}

test "Transaction State Reset: Refunds and original values cleared" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55}, // SSTORE
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    const slot: u256 = 0xAAA;
    
    // Set initial value and earn refund
    try test_vm.vm.state.set_storage(helpers.TestAddresses.CONTRACT, slot, 0xBBB);
    
    try test_frame.pushStack(&[_]u256{0}); // Clear storage
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    // Verify refunds were accumulated
    try testing.expect(test_vm.vm.get_total_refunds() > 0);
    
    // Finalize transaction (this should reset everything)
    _ = test_vm.vm.finalize_transaction(50000);
    
    // After finalization, refunds should be reset
    try testing.expectEqual(@as(u64, 0), test_vm.vm.get_total_refunds());
    
    // Original values map should be cleared
    // (We can't directly test this, but subsequent calls to get_original_storage_value
    // should fetch fresh values from storage)
}