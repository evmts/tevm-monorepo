const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const opcodes = evm.opcodes;
const test_helpers = @import("test_helpers.zig");
const ExecutionError = evm.ExecutionError;

// Test SLOAD operation
// WORKING ON THIS TEST - Agent fixing SLOAD gas calculation issue
test "SLOAD: load value from storage" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Set storage value
    try test_vm.vm.state.set_storage(test_helpers.TestAddresses.CONTRACT, 0x123, 0x456789);
    
    // Push storage slot
    try test_frame.pushStack(&[_]u256{0x123});
    
    // Execute SLOAD
    _ = try test_helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    
    // Should return the stored value
    try testing.expectEqual(@as(u256, 0x456789), try test_frame.popStack());
}

test "SLOAD: load from uninitialized slot returns zero" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Push storage slot that hasn't been set
    try test_frame.pushStack(&[_]u256{0x999});
    
    // Execute SLOAD
    _ = try test_helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    
    // Should return 0
    try testing.expectEqual(@as(u256, 0), try test_frame.popStack());
}

// WORKING ON THIS TEST - Agent fixing SLOAD gas calculation issue
test "SLOAD: cold storage access costs more gas" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Push storage slot
    try test_frame.pushStack(&[_]u256{0x123});
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute SLOAD - cold access
    _ = try test_helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    
    // Should consume 2100 gas for cold access
    const cold_gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2100), cold_gas_used);
    
    // Second access should be warm
    try test_frame.pushStack(&[_]u256{0x123});
    const gas_before_warm = test_frame.frame.gas_remaining;
    
    _ = try test_helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    
    // Should consume 100 gas for warm access
    try testing.expectEqual(@as(u64, 100), gas_before_warm - test_frame.frame.gas_remaining);
}

// Test SSTORE operation
test "SSTORE: store value to storage" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 25000);
    defer test_frame.deinit();
    
    // EVM SSTORE pops slot first (top), then value second. Stack: [..., value, slot]
    try test_frame.pushStack(&[_]u256{0xABCDEF, 0x555}); // value, slot (slot on top)
    
    // Execute SSTORE
    _ = try test_helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    // Check that value was stored
    const stored_value = test_vm.vm.state.get_storage(test_helpers.TestAddresses.CONTRACT, 0x555);
    try testing.expectEqual(@as(u256, 0xABCDEF), stored_value);
}

test "SSTORE: overwrite existing value" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 25000);
    defer test_frame.deinit();
    
    // Set initial value
    try test_vm.vm.state.set_storage(test_helpers.TestAddresses.CONTRACT, 0x100, 0x111);
    
    // EVM SSTORE pops slot first (top), then value second. Stack: [..., value, slot]
    try test_frame.pushStack(&[_]u256{0x222, 0x100}); // value, slot (slot on top)
    
    // Execute SSTORE
    _ = try test_helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    // Check that value was updated
    const stored_value = test_vm.vm.state.get_storage(test_helpers.TestAddresses.CONTRACT, 0x100);
    try testing.expectEqual(@as(u256, 0x222), stored_value);
}

test "SSTORE: write protection in static call" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Set static call
    test_frame.frame.is_static = true;
    
    // EVM SSTORE pops slot first (top), then value second. Stack: [..., value, slot]
    try test_frame.pushStack(&[_]u256{0x123, 0x456}); // value, slot (slot on top)
    
    // Execute SSTORE - should fail
    const result = test_helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
}

test "SSTORE: cold storage access costs more gas" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 25000);
    defer test_frame.deinit();
    
    // EVM SSTORE pops slot first (top), then value second. Stack: [..., value, slot]
    try test_frame.pushStack(&[_]u256{0x123, 0x789}); // value, slot (slot on top)
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute SSTORE - cold access
    _ = try test_helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    // Should consume 2100 gas for cold access + 20000 for SSTORE_SET (new non-zero value)
    const cold_gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 22100), cold_gas_used);
    
    // EVM SSTORE pops slot first (top), then value second. Stack: [..., value, slot]
    try test_frame.pushStack(&[_]u256{0x456, 0x789}); // value, slot (slot on top)
    const gas_before_warm = test_frame.frame.gas_remaining;
    
    _ = try test_helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    // Should consume 2900 gas for warm SSTORE_RESET (changing existing non-zero value)
    try testing.expectEqual(@as(u64, 2900), gas_before_warm - test_frame.frame.gas_remaining);
}

// Test TLOAD operation (EIP-1153)
test "TLOAD: load value from transient storage" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Set transient storage value
    try test_vm.vm.state.set_transient_storage(test_helpers.TestAddresses.CONTRACT, 0xAAA, 0xBBBBBB);
    
    // Push storage slot
    try test_frame.pushStack(&[_]u256{0xAAA});
    
    // Execute TLOAD
    _ = try test_helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    
    // Should return the transient value
    try testing.expectEqual(@as(u256, 0xBBBBBB), try test_frame.popStack());
}

test "TLOAD: load from uninitialized slot returns zero" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Push storage slot that hasn't been set
    try test_frame.pushStack(&[_]u256{0xFFF});
    
    // Execute TLOAD
    _ = try test_helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    
    // Should return 0
    try testing.expectEqual(@as(u256, 0), try test_frame.popStack());
}

test "TLOAD: transient storage is separate from regular storage" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 5000);
    defer test_frame.deinit();
    
    // Set same slot in both storages with different values
    try test_vm.vm.state.set_storage(test_helpers.TestAddresses.CONTRACT, 0x100, 0x111);
    try test_vm.vm.state.set_transient_storage(test_helpers.TestAddresses.CONTRACT, 0x100, 0x222);
    
    // Load from transient storage
    try test_frame.pushStack(&[_]u256{0x100});
    _ = try test_helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    
    // Should return transient value, not regular storage value
    try testing.expectEqual(@as(u256, 0x222), try test_frame.popStack());
    
    // Load from regular storage
    try test_frame.pushStack(&[_]u256{0x100});
    _ = try test_helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    
    // Should return regular storage value
    try testing.expectEqual(@as(u256, 0x111), try test_frame.popStack());
}

// Test TSTORE operation (EIP-1153)
test "TSTORE: store value to transient storage" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // EVM TSTORE pops slot first (top), then value second. Stack: [..., value, slot]
    try test_frame.pushStack(&[_]u256{0xDEADBEEF, 0x777}); // value, slot (slot on top)
    
    // Execute TSTORE
    _ = try test_helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);
    
    // Check that value was stored
    const stored_value = test_vm.vm.state.get_transient_storage(test_helpers.TestAddresses.CONTRACT, 0x777);
    try testing.expectEqual(@as(u256, 0xDEADBEEF), stored_value);
}

test "TSTORE: overwrite existing transient value" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Set initial transient value
    try test_vm.vm.state.set_transient_storage(test_helpers.TestAddresses.CONTRACT, 0x200, 0x333);
    
    // EVM TSTORE pops slot first (top), then value second. Stack: [..., value, slot]
    try test_frame.pushStack(&[_]u256{0x444, 0x200}); // value, slot (slot on top)
    
    // Execute TSTORE
    _ = try test_helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);
    
    // Check that value was updated
    const stored_value = test_vm.vm.state.get_transient_storage(test_helpers.TestAddresses.CONTRACT, 0x200);
    try testing.expectEqual(@as(u256, 0x444), stored_value);
}

test "TSTORE: write protection in static call" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Set static call
    test_frame.frame.is_static = true;
    
    // EVM TSTORE pops slot first (top), then value second. Stack: [..., value, slot]
    try test_frame.pushStack(&[_]u256{0x123, 0x456}); // value, slot (slot on top)
    
    // Execute TSTORE - should fail
    const result = test_helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
}

test "TSTORE: does not affect regular storage" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Set regular storage value
    try test_vm.vm.state.set_storage(test_helpers.TestAddresses.CONTRACT, 0x300, 0x555);
    
    // EVM TSTORE pops slot first (top), then value second. Stack: [..., value, slot]
    try test_frame.pushStack(&[_]u256{0x666, 0x300}); // value, slot (slot on top)
    
    // Execute TSTORE
    _ = try test_helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);
    
    // Regular storage should be unchanged
    const regular_value = test_vm.vm.state.get_storage(test_helpers.TestAddresses.CONTRACT, 0x300);
    try testing.expectEqual(@as(u256, 0x555), regular_value);
    
    // Transient storage should have new value
    const transient_value = test_vm.vm.state.get_transient_storage(test_helpers.TestAddresses.CONTRACT, 0x300);
    try testing.expectEqual(@as(u256, 0x666), transient_value);
}

// Test stack errors
test "SLOAD: stack underflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Empty stack
    
    // Execute SLOAD - should fail
    const result = test_helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "SSTORE: stack underflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Push only one value (need two)
    try test_frame.pushStack(&[_]u256{0x123});
    
    // Execute SSTORE - should fail
    const result = test_helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "TLOAD: stack underflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Empty stack
    
    // Execute TLOAD - should fail
    const result = test_helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "TSTORE: stack underflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Push only one value (need two)
    try test_frame.pushStack(&[_]u256{0x789});
    
    // Execute TSTORE - should fail
    const result = test_helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

// Test gas consumption
test "TLOAD: gas consumption" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Push storage slot
    try test_frame.pushStack(&[_]u256{0x123});
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute TLOAD
    _ = try test_helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    
    // TLOAD base cost is 100 gas (no cold/warm distinction for transient storage)
    try testing.expectEqual(@as(u64, 100), gas_before - test_frame.frame.gas_remaining);
}

test "TSTORE: gas consumption" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(allocator, null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // EVM TSTORE pops slot first (top), then value second. Stack: [..., value, slot]
    try test_frame.pushStack(&[_]u256{0x123, 0x456}); // value, slot (slot on top)
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute TSTORE
    _ = try test_helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);
    
    // TSTORE base cost is 100 gas (no cold/warm distinction for transient storage)
    try testing.expectEqual(@as(u64, 100), gas_before - test_frame.frame.gas_remaining);
}
