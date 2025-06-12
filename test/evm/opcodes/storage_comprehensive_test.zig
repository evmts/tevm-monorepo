const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// ============================
// 0x54: SLOAD opcode
// ============================

test "SLOAD (0x54): Load from storage" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0x54}; // SLOAD
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Set storage value
    try test_vm.setStorage(helpers.TestAddresses.CONTRACT, 0x42, 0x123456);
    
    // Push storage slot
    try test_frame.pushStack(&[_]u256{0x42});
    
    const result = try helpers.executeOpcode(0x54, &test_vm.vm, test_frame.frame);
    try testing.expectEqual(@as(usize, 1), result.bytes_consumed);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0x123456), value);
}

test "SLOAD: Load from uninitialized slot returns zero" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x54},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 3000);
    defer test_frame.deinit();
    
    // Load from slot that was never written
    try test_frame.pushStack(&[_]u256{0x99});
    
    _ = try helpers.executeOpcode(0x54, &test_vm.vm, test_frame.frame);
    
    const value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), value);
}

test "SLOAD: Multiple loads from same slot" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x54},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 6000);
    defer test_frame.deinit();
    
    // Set storage value
    try test_vm.setStorage(helpers.TestAddresses.CONTRACT, 0x10, 0xABCDEF);
    
    // Load same slot multiple times
    for (0..3) |_| {
        try test_frame.pushStack(&[_]u256{0x10});
        _ = try helpers.executeOpcode(0x54, &test_vm.vm, test_frame.frame);
        const value = try test_frame.popStack();
        try testing.expectEqual(@as(u256, 0xABCDEF), value);
    }
}

test "SLOAD: EIP-2929 cold/warm access" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x54},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000);
    defer test_frame.deinit();
    
    // Enable EIP-2929
    test_vm.vm.chain_rules.IsBerlin = true; // EIP-2929 is part of Berlin
    
    // Clear access list to ensure cold access
    test_vm.vm.access_list.clear();
    
    // First access (cold)
    try test_frame.pushStack(&[_]u256{0x100});
    const gas_before_cold = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x54, &test_vm.vm, test_frame.frame);
    const gas_used_cold = gas_before_cold - test_frame.frame.gas_remaining;
    
    // Should consume 2100 gas for cold access
    try testing.expectEqual(@as(u64, 2100), gas_used_cold);
    
    // Second access (warm)
    try test_frame.pushStack(&[_]u256{0x100});
    const gas_before_warm = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x54, &test_vm.vm, test_frame.frame);
    const gas_used_warm = gas_before_warm - test_frame.frame.gas_remaining;
    
    // Should consume 100 gas for warm access
    try testing.expectEqual(@as(u64, 100), gas_used_warm);
}

// ============================
// 0x55: SSTORE opcode
// ============================

test "SSTORE (0x55): Store to storage" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{0x55}; // SSTORE
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 30000);
    defer test_frame.deinit();
    
    // Push slot and value
    try test_frame.pushStack(&[_]u256{0x42}); // slot
    try test_frame.pushStack(&[_]u256{0x999}); // value
    
    _ = try helpers.executeOpcode(0x55, &test_vm.vm, test_frame.frame);
    
    // Verify value was stored
    const stored = try test_vm.getStorage(helpers.TestAddresses.CONTRACT, 0x42);
    try testing.expectEqual(@as(u256, 0x999), stored);
}

test "SSTORE: Static call protection" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    // Set static mode
    test_frame.frame.is_static = true;
    
    // Try to store
    try test_frame.pushStack(&[_]u256{0x10}); // slot
    try test_frame.pushStack(&[_]u256{0x20}); // value
    
    const result = helpers.executeOpcode(0x55, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.WriteProtection, result);
}

test "SSTORE: Gas refund for clearing storage" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000);
    defer test_frame.deinit();
    
    // First set a non-zero value
    try test_vm.setStorage(helpers.TestAddresses.CONTRACT, 0x50, 0x123);
    
    // Store zero to clear the slot
    try test_frame.pushStack(&[_]u256{0x50}); // slot
    try test_frame.pushStack(&[_]u256{0});    // value (zero)
    
    const gas_refund_before = test_frame.frame.contract.gas_refund;
    _ = try helpers.executeOpcode(0x55, &test_vm.vm, test_frame.frame);
    const gas_refund_after = test_frame.frame.contract.gas_refund;
    
    // Should receive refund for clearing storage
    try testing.expect(gas_refund_after > gas_refund_before);
}

test "SSTORE: EIP-2200 gas cost scenarios" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Enable EIP-2200
    test_vm.vm.chain_rules.IsConstantinople = true; // EIP-2200 is part of Constantinople
    
    // Test 1: Fresh slot (0 -> non-zero)
    try test_frame.pushStack(&[_]u256{0x60}); // slot
    try test_frame.pushStack(&[_]u256{0x111}); // value
    
    const gas_before_fresh = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x55, &test_vm.vm, test_frame.frame);
    const gas_fresh = gas_before_fresh - test_frame.frame.gas_remaining;
    
    // Should consume 20000 gas for fresh slot
    try testing.expect(gas_fresh >= 20000);
    
    // Test 2: Update existing value (non-zero -> different non-zero)
    try test_frame.pushStack(&[_]u256{0x60}); // same slot
    try test_frame.pushStack(&[_]u256{0x222}); // different value
    
    const gas_before_update = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x55, &test_vm.vm, test_frame.frame);
    const gas_update = gas_before_update - test_frame.frame.gas_remaining;
    
    // Should consume less gas for update
    try testing.expect(gas_update < gas_fresh);
}

test "SSTORE: Large storage values" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55, 0x54}, // SSTORE, SLOAD
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 50000);
    defer test_frame.deinit();
    
    // Store maximum u256 value
    const max_value = std.math.maxInt(u256);
    try test_frame.pushStack(&[_]u256{0x80}); // slot
    try test_frame.pushStack(&[_]u256{max_value}); // value
    
    test_frame.frame.program_counter = 0;
    _ = try helpers.executeOpcode(0x55, &test_vm.vm, test_frame.frame);
    
    // Load it back
    try test_frame.pushStack(&[_]u256{0x80}); // same slot
    test_frame.frame.program_counter = 1;
    _ = try helpers.executeOpcode(0x54, &test_vm.vm, test_frame.frame);
    
    const loaded = try test_frame.popStack();
    try testing.expectEqual(max_value, loaded);
}

// ============================
// Gas consumption tests
// ============================

test "Storage opcodes: Gas consumption patterns" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x54, 0x55},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // SLOAD base gas (pre-EIP-2929)
    test_vm.vm.chain_rules.IsBerlin = false; // Disable EIP-2929
    try test_frame.pushStack(&[_]u256{0x90});
    
    const gas_before_sload = test_frame.frame.gas_remaining;
    test_frame.frame.program_counter = 0;
    _ = try helpers.executeOpcode(0x54, &test_vm.vm, test_frame.frame);
    const gas_sload = gas_before_sload - test_frame.frame.gas_remaining;
    
    // Pre-Berlin: 800 gas
    try testing.expectEqual(@as(u64, 800), gas_sload);
    
    // SSTORE to fresh slot
    try test_frame.pushStack(&[_]u256{0xA0}); // slot
    try test_frame.pushStack(&[_]u256{0x123}); // value
    
    const gas_before_sstore = test_frame.frame.gas_remaining;
    test_frame.frame.program_counter = 1;
    _ = try helpers.executeOpcode(0x55, &test_vm.vm, test_frame.frame);
    const gas_sstore = gas_before_sstore - test_frame.frame.gas_remaining;
    
    // Fresh slot store is expensive
    try testing.expect(gas_sstore >= 20000);
}

// ============================
// Stack underflow tests
// ============================

test "Storage opcodes: Stack underflow" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    // Test SLOAD with empty stack
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x54},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000);
    defer test_frame.deinit();
    
    const result = helpers.executeOpcode(0x54, &test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result);
    
    // Test SSTORE with insufficient stack
    var contract2 = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55},
    );
    defer contract2.deinit(null);
    
    var test_frame2 = try helpers.TestFrame.init(allocator, &contract2, 1000);
    defer test_frame2.deinit();
    
    // Empty stack
    const result2 = helpers.executeOpcode(0x55, &test_vm.vm, test_frame2.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result2);
    
    // Only one item (need two)
    try test_frame2.pushStack(&[_]u256{0x10});
    const result3 = helpers.executeOpcode(0x55, &test_vm.vm, test_frame2.frame);
    try testing.expectError(helpers.ExecutionError.Error.StackUnderflow, result3);
}

// ============================
// Edge cases
// ============================

test "Storage: Multiple consecutive operations" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    const code = [_]u8{
        0x60, 0x01,    // PUSH1 0x01 (value1)
        0x60, 0x00,    // PUSH1 0x00 (slot0)
        0x55,          // SSTORE
        0x60, 0x02,    // PUSH1 0x02 (value2)
        0x60, 0x01,    // PUSH1 0x01 (slot1)
        0x55,          // SSTORE
        0x60, 0x00,    // PUSH1 0x00 (slot0)
        0x54,          // SLOAD
        0x60, 0x01,    // PUSH1 0x01 (slot1)
        0x54,          // SLOAD
    };
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &code,
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    // Execute all operations
    test_frame.frame.program_counter = 0;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.program_counter = 2;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.program_counter = 4;
    _ = try helpers.executeOpcode(0x55, &test_vm.vm, test_frame.frame);
    
    test_frame.frame.program_counter = 5;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.program_counter = 7;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.program_counter = 9;
    _ = try helpers.executeOpcode(0x55, &test_vm.vm, test_frame.frame);
    
    test_frame.frame.program_counter = 10;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.program_counter = 12;
    _ = try helpers.executeOpcode(0x54, &test_vm.vm, test_frame.frame);
    
    test_frame.frame.program_counter = 13;
    _ = try helpers.executeOpcode(0x60, &test_vm.vm, test_frame.frame);
    test_frame.frame.program_counter = 15;
    _ = try helpers.executeOpcode(0x54, &test_vm.vm, test_frame.frame);
    
    // Check loaded values
    const value1 = try test_frame.popStack();
    const value0 = try test_frame.popStack();
    
    try testing.expectEqual(@as(u256, 2), value1); // slot1
    try testing.expectEqual(@as(u256, 1), value0); // slot0
}

test "SSTORE: Overwriting values" {
    const allocator = testing.allocator;
    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit();
    
    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        &[_]u8{0x55},
    );
    defer contract.deinit(null);
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();
    
    const slot = 0xBEEF;
    
    // Store initial value
    try test_frame.pushStack(&[_]u256{slot});
    try test_frame.pushStack(&[_]u256{0x111});
    _ = try helpers.executeOpcode(0x55, &test_vm.vm, test_frame.frame);
    
    // Overwrite with new value
    try test_frame.pushStack(&[_]u256{slot});
    try test_frame.pushStack(&[_]u256{0x222});
    _ = try helpers.executeOpcode(0x55, &test_vm.vm, test_frame.frame);
    
    // Overwrite again
    try test_frame.pushStack(&[_]u256{slot});
    try test_frame.pushStack(&[_]u256{0x333});
    _ = try helpers.executeOpcode(0x55, &test_vm.vm, test_frame.frame);
    
    // Verify final value
    const stored = try test_vm.getStorage(helpers.TestAddresses.CONTRACT, slot);
    try testing.expectEqual(@as(u256, 0x333), stored);
}