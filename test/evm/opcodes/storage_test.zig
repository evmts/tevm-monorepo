const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const opcodes = evm.opcodes;
const test_helpers = @import("test_helpers.zig");
const ExecutionError = evm.ExecutionError;

// Test SLOAD operation
test "SLOAD: load value from storage" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set storage value
    vm.setStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0x123, 0x456789);
    
    // Push storage slot
    try frame.pushValue(0x123);
    
    // Execute SLOAD
    try test_helpers.executeOpcode(opcodes.storage.op_sload, &frame);
    
    // Should return the stored value
    try testing.expectEqual(@as(u256, 0x456789), try frame.popValue());
}

test "SLOAD: load from uninitialized slot returns zero" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push storage slot that hasn't been set
    try frame.pushValue(0x999);
    
    // Execute SLOAD
    try test_helpers.executeOpcode(opcodes.storage.op_sload, &frame);
    
    // Should return 0
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
}

test "SLOAD: cold storage access costs more gas" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 3000;
    
    // Push storage slot
    try frame.pushValue(0x123);
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute SLOAD - cold access
    try test_helpers.executeOpcode(opcodes.storage.op_sload, &frame);
    
    // Should consume 2100 gas for cold access (minus warm cost already in base)
    const cold_gas_used = gas_before - frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2000), cold_gas_used); // 2100 - 100 warm cost
    
    // Second access should be warm
    try frame.pushValue(0x123);
    const gas_before_warm = frame.frame.gas_remaining;
    
    try test_helpers.executeOpcode(opcodes.storage.op_sload, &frame);
    
    // Should consume 0 additional gas for warm access
    try testing.expectEqual(@as(u64, 0), gas_before_warm - frame.frame.gas_remaining);
}

// Test SSTORE operation
test "SSTORE: store value to storage" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push value and slot
    try frame.pushValue(0xABCDEF); // value
    try frame.pushValue(0x555);    // slot
    
    // Execute SSTORE
    try test_helpers.executeOpcode(opcodes.storage.op_sstore, &frame);
    
    // Check that value was stored
    const stored_value = vm.getStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0x555);
    try testing.expectEqual(@as(u256, 0xABCDEF), stored_value);
}

test "SSTORE: overwrite existing value" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial value
    vm.setStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0x100, 0x111);
    
    // Push new value and slot
    try frame.pushValue(0x222); // new value
    try frame.pushValue(0x100); // slot
    
    // Execute SSTORE
    try test_helpers.executeOpcode(opcodes.storage.op_sstore, &frame);
    
    // Check that value was updated
    const stored_value = vm.getStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0x100);
    try testing.expectEqual(@as(u256, 0x222), stored_value);
}

test "SSTORE: write protection in static call" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set static call
    frame.frame.is_static = true;
    
    // Push value and slot
    try frame.pushValue(0x123); // value
    try frame.pushValue(0x456); // slot
    
    // Execute SSTORE - should fail
    const result = test_helpers.executeOpcode(opcodes.storage.op_sstore, &frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
}

test "SSTORE: cold storage access costs more gas" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 25000;
    
    // Push value and slot
    try frame.pushValue(0x123); // value
    try frame.pushValue(0x789); // slot
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute SSTORE - cold access
    try test_helpers.executeOpcode(opcodes.storage.op_sstore, &frame);
    
    // Should consume 2100 gas for cold access
    const cold_gas_used = gas_before - frame.frame.gas_remaining;
    try testing.expectEqual(@as(u64, 2100), cold_gas_used);
    
    // Second access to same slot should be warm
    try frame.pushValue(0x456); // different value
    try frame.pushValue(0x789); // same slot
    const gas_before_warm = frame.frame.gas_remaining;
    
    try test_helpers.executeOpcode(opcodes.storage.op_sstore, &frame);
    
    // Should consume 0 additional gas for warm access
    try testing.expectEqual(@as(u64, 0), gas_before_warm - frame.frame.gas_remaining);
}

// Test TLOAD operation (EIP-1153)
test "TLOAD: load value from transient storage" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set transient storage value
    vm.setTransientStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0xAAA, 0xBBBBBB);
    
    // Push storage slot
    try frame.pushValue(0xAAA);
    
    // Execute TLOAD
    try test_helpers.executeOpcode(opcodes.storage.op_tload, &frame);
    
    // Should return the transient value
    try testing.expectEqual(@as(u256, 0xBBBBBB), try frame.popValue());
}

test "TLOAD: load from uninitialized slot returns zero" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push storage slot that hasn't been set
    try frame.pushValue(0xFFF);
    
    // Execute TLOAD
    try test_helpers.executeOpcode(opcodes.storage.op_tload, &frame);
    
    // Should return 0
    try testing.expectEqual(@as(u256, 0), try frame.popValue());
}

test "TLOAD: transient storage is separate from regular storage" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set same slot in both storages with different values
    vm.setStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0x100, 0x111);
    vm.setTransientStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0x100, 0x222);
    
    // Load from transient storage
    try frame.pushValue(0x100);
    try test_helpers.executeOpcode(opcodes.storage.op_tload, &frame);
    
    // Should return transient value, not regular storage value
    try testing.expectEqual(@as(u256, 0x222), try frame.popValue());
    
    // Load from regular storage
    try frame.pushValue(0x100);
    try test_helpers.executeOpcode(opcodes.storage.op_sload, &frame);
    
    // Should return regular storage value
    try testing.expectEqual(@as(u256, 0x111), try frame.popValue());
}

// Test TSTORE operation (EIP-1153)
test "TSTORE: store value to transient storage" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push value and slot
    try frame.pushValue(0xDEADBEEF); // value
    try frame.pushValue(0x777);      // slot
    
    // Execute TSTORE
    try test_helpers.executeOpcode(opcodes.storage.op_tstore, &frame);
    
    // Check that value was stored
    const stored_value = vm.getTransientStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0x777);
    try testing.expectEqual(@as(u256, 0xDEADBEEF), stored_value);
}

test "TSTORE: overwrite existing transient value" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial transient value
    vm.setTransientStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0x200, 0x333);
    
    // Push new value and slot
    try frame.pushValue(0x444); // new value
    try frame.pushValue(0x200); // slot
    
    // Execute TSTORE
    try test_helpers.executeOpcode(opcodes.storage.op_tstore, &frame);
    
    // Check that value was updated
    const stored_value = vm.getTransientStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0x200);
    try testing.expectEqual(@as(u256, 0x444), stored_value);
}

test "TSTORE: write protection in static call" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set static call
    frame.frame.is_static = true;
    
    // Push value and slot
    try frame.pushValue(0x123); // value
    try frame.pushValue(0x456); // slot
    
    // Execute TSTORE - should fail
    const result = test_helpers.executeOpcode(opcodes.storage.op_tstore, &frame);
    try testing.expectError(ExecutionError.Error.WriteProtection, result);
}

test "TSTORE: does not affect regular storage" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set regular storage value
    vm.setStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0x300, 0x555);
    
    // Store to transient storage at same slot
    try frame.pushValue(0x666); // value
    try frame.pushValue(0x300); // slot
    
    // Execute TSTORE
    try test_helpers.executeOpcode(opcodes.storage.op_tstore, &frame);
    
    // Regular storage should be unchanged
    const regular_value = vm.getStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0x300);
    try testing.expectEqual(@as(u256, 0x555), regular_value);
    
    // Transient storage should have new value
    const transient_value = vm.getTransientStorage(test_helpers.TEST_CONTRACT_ADDRESS, 0x300);
    try testing.expectEqual(@as(u256, 0x666), transient_value);
}

// Test stack errors
test "SLOAD: stack underflow" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Empty stack
    
    // Execute SLOAD - should fail
    const result = test_helpers.executeOpcode(opcodes.storage.op_sload, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "SSTORE: stack underflow" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push only one value (need two)
    try frame.pushValue(0x123);
    
    // Execute SSTORE - should fail
    const result = test_helpers.executeOpcode(opcodes.storage.op_sstore, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "TLOAD: stack underflow" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Empty stack
    
    // Execute TLOAD - should fail
    const result = test_helpers.executeOpcode(opcodes.storage.op_tload, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

test "TSTORE: stack underflow" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Push only one value (need two)
    try frame.pushValue(0x789);
    
    // Execute TSTORE - should fail
    const result = test_helpers.executeOpcode(opcodes.storage.op_tstore, &frame);
    try testing.expectError(ExecutionError.Error.StackUnderflow, result);
}

// Test gas consumption
test "TLOAD: gas consumption" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 1000;
    
    // Push storage slot
    try frame.pushValue(0x123);
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute TLOAD
    try test_helpers.executeOpcode(opcodes.storage.op_tload, &frame);
    
    // TLOAD base cost is 100 gas (no cold/warm distinction for transient storage)
    try testing.expectEqual(@as(u64, 0), gas_before - frame.frame.gas_remaining);
}

test "TSTORE: gas consumption" {
    const allocator = testing.allocator;
    var vm = try test_helpers.TestVm.init(allocator);
    defer vm.deinit();
    
    var frame = test_helpers.TestFrame.init(&vm);
    defer frame.deinit();
    
    // Set initial gas
    frame.frame.gas_remaining = 1000;
    
    // Push value and slot
    try frame.pushValue(0x123); // value
    try frame.pushValue(0x456); // slot
    
    const gas_before = frame.frame.gas_remaining;
    
    // Execute TSTORE
    try test_helpers.executeOpcode(opcodes.storage.op_tstore, &frame);
    
    // TSTORE base cost is 100 gas (no cold/warm distinction for transient storage)
    try testing.expectEqual(@as(u64, 0), gas_before - frame.frame.gas_remaining);
}