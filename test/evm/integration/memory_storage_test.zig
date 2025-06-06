const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers");
const evm = @import("evm");
const opcodes = evm.opcodes;

// Integration tests for memory and storage operations

test "Integration: Memory operations with arithmetic" {
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
    
    // Store result of arithmetic operation in memory
    // Calculate 10 + 20 = 30, store at offset 0
    try test_frame.pushStack(&[_]u256{10, 20});
    _ = try helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame);
    
    // Store result in memory
    try test_frame.pushStack(&[_]u256{0}); // offset
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    
    // Load from memory and verify
    try test_frame.pushStack(&[_]u256{0}); // offset
    _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 30);
    
    // Check memory size
    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 32); // Should be 32 bytes
}

test "Integration: Storage with conditional updates" {
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
    
    // Set initial storage value
    const slot: u256 = 42;
    const initial_value: u256 = 100;
    const storage_key = helpers.Vm.StorageKey{ .address = helpers.TestAddresses.CONTRACT, .slot = slot };
    try test_vm.vm.state.set_storage(storage_key.address, storage_key.slot, initial_value);
    
    // Load value, add 50, store back if result > 120
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, initial_value);
    
    // Add 50
    try test_frame.pushStack(&[_]u256{50});
    _ = try helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 150);
    
    // Duplicate for comparison
    _ = try helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame);
    
    // Compare with 120
    try test_frame.pushStack(&[_]u256{120});
    _ = try helpers.executeOpcode(0x11, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1); // 150 > 120 is true
    
    // Since condition is true, store the value
    // Stack: [150, 1] - need to remove condition and keep value
    _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);
    
    // Store value
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    // Verify storage was updated
    const updated_value = test_vm.vm.state.get_storage(storage_key.address, storage_key.slot);
    try testing.expectEqual(@as(u256, 150), updated_value);
}

test "Integration: Memory copy operations" {
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
    
    // Store some data in memory
    const data1: u256 = 0xDEADBEEF;
    const data2: u256 = 0xCAFEBABE;
    
    try test_frame.pushStack(&[_]u256{data1, 0}); // value, offset
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    
    try test_frame.pushStack(&[_]u256{data2, 32}); // value, offset
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    
    // Copy 32 bytes from offset 0 to offset 64
    try test_frame.pushStack(&[_]u256{64, 0, 32}); // dst, src, size
    _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);
    
    // Verify copy
    try test_frame.pushStack(&[_]u256{64}); // offset
    _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, data1);
    
    // Check memory size expanded
    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 96); // Should be 96 bytes
}

test "Integration: Transient storage with arithmetic" {
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
    
    const slot: u256 = 123;
    
    // Store initial value in transient storage
    try test_frame.pushStack(&[_]u256{1000, slot});
    _ = try helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);
    
    // Load, double it, store back
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 1000);
    
    // Double the value
    _ = try helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame);
    _ = try helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 2000);
    
    // Store back
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x5D, test_vm.vm, test_frame.frame);
    
    // Verify
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x5C, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 2000);
}

test "Integration: MSTORE8 with bitwise operations" {
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
    
    // Store individual bytes to build a word
    var offset: u256 = 0;
    const bytes = [_]u8{0xDE, 0xAD, 0xBE, 0xEF};
    
    for (bytes) |byte| {
        try test_frame.pushStack(&[_]u256{byte, offset});
        _ = try helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame);
        offset += 1;
    }
    
    // Load the full word
    try test_frame.pushStack(&[_]u256{0});
    _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame);
    
    // The result should be 0xDEADBEEF0000...
    const result = try test_frame.popStack();
    const expected = @as(u256, 0xDEADBEEF) << (28 * 8); // Shift to most significant bytes
    try testing.expectEqual(expected, result);
}

test "Integration: Storage slot calculation" {
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
    
    var test_frame = try helpers.TestFrame.init(allocator, &contract, 30000);
    defer test_frame.deinit();
    
    // Simulate array access: array[index] where base slot = 5
    const base_slot: u256 = 5;
    const index: u256 = 3;
    
    // Calculate slot: keccak256(base_slot) + index
    // For this test, we'll use a simpler calculation: base_slot * 1000 + index
    try test_frame.pushStack(&[_]u256{base_slot, 1000});
    _ = try helpers.executeOpcode(0x02, test_vm.vm, test_frame.frame);
    
    try test_frame.pushStack(&[_]u256{index});
    _ = try helpers.executeOpcode(0x01, test_vm.vm, test_frame.frame);
    
    const calculated_slot = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 5003), calculated_slot);
    
    // Store value at calculated slot
    const value: u256 = 999;
    try test_frame.pushStack(&[_]u256{value, calculated_slot});
    _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame);
    
    // Load and verify
    try test_frame.pushStack(&[_]u256{calculated_slot});
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, value);
}

// WORKING ON THIS: Fixing memory expansion tracking expectations
test "Integration: Memory expansion tracking" {
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
    
    // Track memory size as we expand
    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 0); // Initially 0
    
    // Store at offset 0
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{42, 0});
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    
    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame);
    try helpers.expectStackValue(test_frame.frame, 0, 32); // Expanded to 32
    
    // Store at offset 100 (forces expansion)
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{99, 100});
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    
    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame);
    // Memory expands in 32-byte words. Offset 100 + 32 bytes = 132 bytes needed
    // 132 bytes = 4.125 words, rounds up to 5 words = 160 bytes
    try helpers.expectStackValue(test_frame.frame, 0, 160);
    
    // Store single byte at offset 200
    test_frame.frame.stack.clear();
    try test_frame.pushStack(&[_]u256{0xFF, 200});
    _ = try helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame);
    
    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame);
    // MSTORE8 at offset 200 needs byte 200, which requires 201 bytes
    // 201 bytes = 6.28125 words, rounds up to 7 words = 224 bytes
    try helpers.expectStackValue(test_frame.frame, 0, 224); // Memory expands to 7 words (224 bytes)
}

test "Integration: Cold/warm storage access patterns" {
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
    
    const slot: u256 = 777;
    
    // First access - cold (should cost 2100 gas)
    const gas_before_cold = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    const gas_after_cold = test_frame.frame.gas_remaining;
    const cold_gas_used = gas_before_cold - gas_after_cold;
    try testing.expectEqual(@as(u64, 2100), cold_gas_used);
    
    // Second access - warm (should cost 100 gas)
    test_frame.frame.stack.clear();
    const gas_before_warm = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{slot});
    _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame);
    const gas_after_warm = test_frame.frame.gas_remaining;
    const warm_gas_used = gas_before_warm - gas_after_warm;
    try testing.expectEqual(@as(u64, 100), warm_gas_used);
}
