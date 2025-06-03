const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const opcodes = evm.opcodes;
const test_helpers = @import("test_helpers.zig");
const ExecutionError = evm.ExecutionError;

// Test SLOAD operation
test "SLOAD: load value from storage" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Set storage value
    try test_vm.setStorage(test_helpers.TestAddresses.CONTRACT, 0x123, 0x456789);
    
    // Push storage slot
    try test_frame.pushStack(&[_]u256{0x123});
    
    // Execute SLOAD
    _ = try test_helpers.executeOpcode(opcodes.storage.op_sload, &test_vm.vm, test_frame.frame);
    
    // Should return the stored value
    try testing.expectEqual(@as(u256, 0x456789), try test_frame.popStack());
}

test "SLOAD: load from uninitialized slot returns zero" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push storage slot that hasn't been set
    try test_frame.pushStack(&[_]u256{0x999});
    
    // Execute SLOAD
    _ = try test_helpers.executeOpcode(opcodes.storage.op_sload, &test_vm.vm, test_frame.frame);
    
    // Should return 0
    try testing.expectEqual(@as(u256, 0), try test_frame.popStack());
}

test "SLOAD: cold storage access costs more gas" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Push storage slot
    try test_frame.pushStack(&[_]u256{0x123});
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute SLOAD - cold access
    _ = try test_helpers.executeOpcode(opcodes.storage.op_sload, &test_vm.vm, test_frame.frame);
    
    // Should consume 2100 gas for cold access (minus warm cost already in base)
    const cold_gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2000), cold_gas_used); // 2100 - 100 warm cost
    
    // Second access should be warm
    try test_frame.pushStack(&[_]u256{0x123});
    const gas_before_warm = test_frame.frame.gas_remaining;
    
    _ = try test_helpers.executeOpcode(opcodes.storage.op_sload, &test_vm.vm, test_frame.frame);
    
    // Should consume 0 additional gas for warm access
    try testing.expectEqual(@as(u64, 0), gas_before_warm - test_frame.frame.gas_remaining);
}

// Test SSTORE operation
test "SSTORE: store value to storage" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push value and slot
    try test_frame.pushStack(&[_]u256{0x555});    // slot
    try test_frame.pushStack(&[_]u256{0xABCDEF}); // value
    
    // Execute SSTORE
    _ = try test_helpers.executeOpcode(opcodes.storage.op_sstore, &test_vm.vm, test_frame.frame);
    
    // Check that value was stored
    const stored_value = test_vm.getStorage(test_helpers.TestAddresses.CONTRACT, 0x555);
    try testing.expectEqual(@as(u256, 0xABCDEF), stored_value);
}

test "SSTORE: overwrite existing value" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Set initial value
    try test_vm.setStorage(test_helpers.TestAddresses.CONTRACT, 0x100, 0x111);
    
    // Push new value and slot
    try test_frame.pushStack(&[_]u256{0x100}); // slot
    try test_frame.pushStack(&[_]u256{0x222}); // new value
    
    // Execute SSTORE
    _ = try test_helpers.executeOpcode(opcodes.storage.op_sstore, &test_vm.vm, test_frame.frame);
    
    // Check that value was updated
    const stored_value = test_vm.getStorage(test_helpers.TestAddresses.CONTRACT, 0x100);
    try testing.expectEqual(@as(u256, 0x222), stored_value);
}

test "SSTORE: write protection in static call" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Set static call
    test_frame.frame.is_static = true;
    
    // Push value and slot
    try test_frame.pushStack(&[_]u256{0x456}); // slot
    try test_frame.pushStack(&[_]u256{0x123}); // value
    
    // Execute SSTORE - should fail
    const result = test_helpers.executeOpcode(opcodes.storage.op_sstore, &test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
}

test "SSTORE: cold storage access costs more gas" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 25000);
    defer test_frame.deinit();
    
    // Push value and slot
    try test_frame.pushStack(&[_]u256{0x789}); // slot
    try test_frame.pushStack(&[_]u256{0x123}); // value
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute SSTORE - cold access
    _ = try test_helpers.executeOpcode(opcodes.storage.op_sstore, &test_vm.vm, test_frame.frame);
    
    // Should consume 2100 gas for cold access
    const cold_gas_used = gas_before - test_frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2100), cold_gas_used);
    
    // Second access to same slot should be warm
    try test_frame.pushStack(&[_]u256{0x789}); // same slot
    try test_frame.pushStack(&[_]u256{0x456}); // different value
    const gas_before_warm = test_frame.frame.gas_remaining;
    
    _ = try test_helpers.executeOpcode(opcodes.storage.op_sstore, &test_vm.vm, test_frame.frame);
    
    // Should consume 0 additional gas for warm access
    try testing.expectEqual(@as(u64, 0), gas_before_warm - test_frame.frame.gas_remaining);
}

// Test TLOAD operation (EIP-1153)
test "TLOAD: load value from transient storage" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Set transient storage value
    try test_vm.setTransientStorage(test_helpers.TestAddresses.CONTRACT, 0xAAA, 0xBBBBBB);
    
    // Push storage slot
    try test_frame.pushStack(&[_]u256{0xAAA});
    
    // Execute TLOAD
    _ = try test_helpers.executeOpcode(opcodes.storage.op_tload, &test_vm.vm, test_frame.frame);
    
    // Should return the transient value
    try testing.expectEqual(@as(u256, 0xBBBBBB), try test_frame.popStack());
}

test "TLOAD: load from uninitialized slot returns zero" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push storage slot that hasn't been set
    try test_frame.pushStack(&[_]u256{0xFFF});
    
    // Execute TLOAD
    _ = try test_helpers.executeOpcode(opcodes.storage.op_tload, &test_vm.vm, test_frame.frame);
    
    // Should return 0
    try testing.expectEqual(@as(u256, 0), try test_frame.popStack());
}

test "TLOAD: transient storage is separate from regular storage" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Set same slot in both storages with different values
    try test_vm.setStorage(test_helpers.TestAddresses.CONTRACT, 0x100, 0x111);
    try test_vm.setTransientStorage(test_helpers.TestAddresses.CONTRACT, 0x100, 0x222);
    
    // Load from transient storage
    try test_frame.pushStack(&[_]u256{0x100});
    _ = try test_helpers.executeOpcode(opcodes.storage.op_tload, &test_vm.vm, test_frame.frame);
    
    // Should return transient value, not regular storage value
    try testing.expectEqual(@as(u256, 0x222), try test_frame.popStack());
    
    // Load from regular storage
    try test_frame.pushStack(&[_]u256{0x100});
    _ = try test_helpers.executeOpcode(opcodes.storage.op_sload, &test_vm.vm, test_frame.frame);
    
    // Should return regular storage value
    try testing.expectEqual(@as(u256, 0x111), try test_frame.popStack());
}

// Test TSTORE operation (EIP-1153)
test "TSTORE: store value to transient storage" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push value and slot
    try test_frame.pushStack(&[_]u256{0x777});      // slot
    try test_frame.pushStack(&[_]u256{0xDEADBEEF}); // value
    
    // Execute TSTORE
    _ = try test_helpers.executeOpcode(opcodes.storage.op_tstore, &test_vm.vm, test_frame.frame);
    
    // Check that value was stored
    const stored_value = test_vm.getTransientStorage(test_helpers.TestAddresses.CONTRACT, 0x777);
    try testing.expectEqual(@as(u256, 0xDEADBEEF), stored_value);
}

test "TSTORE: overwrite existing transient value" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Set initial transient value
    try test_vm.setTransientStorage(test_helpers.TestAddresses.CONTRACT, 0x200, 0x333);
    
    // Push new value and slot
    try test_frame.pushStack(&[_]u256{0x200}); // slot
    try test_frame.pushStack(&[_]u256{0x444}); // new value
    
    // Execute TSTORE
    _ = try test_helpers.executeOpcode(opcodes.storage.op_tstore, &test_vm.vm, test_frame.frame);
    
    // Check that value was updated
    const stored_value = test_vm.getTransientStorage(test_helpers.TestAddresses.CONTRACT, 0x200);
    try testing.expectEqual(@as(u256, 0x444), stored_value);
}

test "TSTORE: write protection in static call" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Set static call
    test_frame.frame.is_static = true;
    
    // Push value and slot
    try test_frame.pushStack(&[_]u256{0x456}); // slot
    try test_frame.pushStack(&[_]u256{0x123}); // value
    
    // Execute TSTORE - should fail
    const result = test_helpers.executeOpcode(opcodes.storage.op_tstore, &test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
}

test "TSTORE: does not affect regular storage" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Set regular storage value
    try test_vm.setStorage(test_helpers.TestAddresses.CONTRACT, 0x300, 0x555);
    
    // Store to transient storage at same slot
    try test_frame.pushStack(&[_]u256{0x300}); // slot
    try test_frame.pushStack(&[_]u256{0x666}); // value
    
    // Execute TSTORE
    _ = try test_helpers.executeOpcode(opcodes.storage.op_tstore, &test_vm.vm, test_frame.frame);
    
    // Regular storage should be unchanged
    const regular_value = test_vm.getStorage(test_helpers.TestAddresses.CONTRACT, 0x300);
    try testing.expectEqual(@as(u256, 0x555), regular_value);
    
    // Transient storage should have new value
    const transient_value = test_vm.getTransientStorage(test_helpers.TestAddresses.CONTRACT, 0x300);
    try testing.expectEqual(@as(u256, 0x666), transient_value);
}

// Test stack errors
test "SLOAD: stack underflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Empty stack
    
    // Execute SLOAD - should fail
    const result = test_helpers.executeOpcode(opcodes.storage.op_sload, &test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "SSTORE: stack underflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push only one value (need two)
    try test_frame.pushStack(&[_]u256{0x123});
    
    // Execute SSTORE - should fail
    const result = test_helpers.executeOpcode(opcodes.storage.op_sstore, &test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "TLOAD: stack underflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Empty stack
    
    // Execute TLOAD - should fail
    const result = test_helpers.executeOpcode(opcodes.storage.op_tload, &test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "TSTORE: stack underflow" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push only one value (need two)
    try test_frame.pushStack(&[_]u256{0x789});
    
    // Execute TSTORE - should fail
    const result = test_helpers.executeOpcode(opcodes.storage.op_tstore, &test_vm.vm, test_frame.frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

// Test gas consumption
test "TLOAD: gas consumption" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push storage slot
    try test_frame.pushStack(&[_]u256{0x123});
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute TLOAD
    _ = try test_helpers.executeOpcode(opcodes.storage.op_tload, &test_vm.vm, test_frame.frame);
    
    // TLOAD base cost is 100 gas (no cold/warm distinction for transient storage)
    try testing.expectEqual(@as(u64, 0), gas_before - test_frame.frame.gas_remaining);
}

test "TSTORE: gas consumption" {
    const allocator = testing.allocator;
    
    var test_vm = try test_helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try test_helpers.createTestContract(
        allocator,
        test_helpers.TestAddresses.CONTRACT,
        test_helpers.TestAddresses.ALICE,
        0,
        &[_]u8{},
    );
    defer contract.deinit(null);
    
    var test_frame = try test_helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Push value and slot
    try test_frame.pushStack(&[_]u256{0x456}); // slot
    try test_frame.pushStack(&[_]u256{0x123}); // value
    
    const gas_before = test_frame.frame.gas_remaining;
    
    // Execute TSTORE
    _ = try test_helpers.executeOpcode(opcodes.storage.op_tstore, &test_vm.vm, test_frame.frame);
    
    // TSTORE base cost is 100 gas (no cold/warm distinction for transient storage)
    try testing.expectEqual(@as(u64, 0), gas_before - test_frame.frame.gas_remaining);
}
