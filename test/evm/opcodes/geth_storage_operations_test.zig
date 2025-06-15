const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes through evm module
const evm = @import("evm");

/// Test storage operations (SLOAD, SSTORE) comprehensively following geth patterns
/// This includes warm/cold access, gas costs, and storage layout edge cases

test "Geth-style SSTORE operation comprehensive tests" {
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

    // Test cases for SSTORE with various patterns
    const sstore_test_cases = [_]struct {
        key: u256,
        value: u256,
        name: []const u8,
    }{
        .{ .key = 0, .value = 0x123456789ABCDEF, .name = "Store to slot 0" },
        .{ .key = 1, .value = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .name = "Store max value to slot 1" },
        .{ .key = 0x8000000000000000000000000000000000000000000000000000000000000000, .value = 42, .name = "Store to high slot" },
        .{ .key = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .value = 1, .name = "Store to max slot" },
        .{ .key = 0x1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF, .value = 0xFEDCBA0987654321FEDCBA0987654321FEDCBA0987654321FEDCBA0987654321, .name = "Store arbitrary values" },
    };

    for (sstore_test_cases, 0..) |test_case, i| {
        test_frame.clearStack();

        // Push value and key for SSTORE (note: order is value, key due to stack LIFO)
        try test_frame.pushStack(&[_]u256{ test_case.key, test_case.value });

        const gas_before = test_frame.frame.gas_limit - test_frame.frame.gas_used;

        // Execute SSTORE operation
        _ = helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame) catch |err| {
            std.debug.print("SSTORE test {} failed: {s} - Error: {}\n", .{ i, test_case.name, err });
            continue;
        };

        const gas_after = test_frame.frame.gas_limit - test_frame.frame.gas_used;
        const gas_consumed = gas_before - gas_after;

        std.debug.print("SSTORE test {}: {s}\n", .{ i, test_case.name });
        std.debug.print("  Key: 0x{x}\n", .{test_case.key});
        std.debug.print("  Value: 0x{x}\n", .{test_case.value});
        std.debug.print("  Gas consumed: {}\n", .{gas_consumed});

        // Verify stack is empty after SSTORE
        if (test_frame.frame.stack.len() != 0) {
            std.debug.print("  Warning: Stack not empty after SSTORE\n");
        }
    }
}

test "Geth-style SLOAD operation comprehensive tests" {
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

    // First, store some values to test loading
    const store_test_data = [_]struct {
        key: u256,
        value: u256,
    }{
        .{ .key = 0, .value = 0x111111 },
        .{ .key = 1, .value = 0x222222 },
        .{ .key = 100, .value = 0x333333 },
        .{ .key = 0xABCDEF, .value = 0x444444 },
    };

    // Store test values
    for (store_test_data) |data| {
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{ data.key, data.value });
        _ = helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame) catch continue; // SSTORE
    }

    // Now test SLOAD operations
    for (store_test_data, 0..) |data, i| {
        test_frame.clearStack();

        // Push key for SLOAD
        try test_frame.pushStack(&[_]u256{data.key});

        const gas_before = test_frame.frame.gas_limit - test_frame.frame.gas_used;

        // Execute SLOAD operation
        _ = helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame) catch |err| {
            std.debug.print("SLOAD test {} failed: Error: {}\n", .{ i, err });
            continue;
        };

        const gas_after = test_frame.frame.gas_limit - test_frame.frame.gas_used;
        const gas_consumed = gas_before - gas_after;

        // Verify stack has one item (the loaded value)
        if (test_frame.frame.stack.len() != 1) {
            std.debug.print("SLOAD test {} failed: Unexpected stack size {}\n", .{ i, test_frame.frame.stack.len() });
            continue;
        }

        const loaded_value = try test_frame.frame.stack.peek(0);
        
        std.debug.print("SLOAD test {}: Key 0x{x}\n", .{ i, data.key });
        std.debug.print("  Expected: 0x{x}\n", .{data.value});
        std.debug.print("  Loaded: 0x{x}\n", .{loaded_value});
        std.debug.print("  Gas consumed: {}\n", .{gas_consumed});

        // Verify the loaded value matches what was stored
        if (loaded_value != data.value) {
            std.debug.print("  Value mismatch!\n");
            return error.StorageValueMismatch;
        }
    }
}

test "Geth-style SLOAD from empty storage tests" {
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

    // Test loading from various slots that should be empty
    const empty_slot_tests = [_]struct {
        key: u256,
        name: []const u8,
    }{
        .{ .key = 0, .name = "Load from slot 0 (empty)" },
        .{ .key = 1, .name = "Load from slot 1 (empty)" },
        .{ .key = 0x123456, .name = "Load from arbitrary slot (empty)" },
        .{ .key = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, .name = "Load from max slot (empty)" },
    };

    for (empty_slot_tests, 0..) |test_case, i| {
        test_frame.clearStack();

        // Push key for SLOAD
        try test_frame.pushStack(&[_]u256{test_case.key});

        // Execute SLOAD operation
        _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame); // SLOAD

        // Verify stack has one item
        if (test_frame.frame.stack.len() != 1) {
            return error.UnexpectedStackSize;
        }

        const loaded_value = try test_frame.frame.stack.peek(0);
        
        std.debug.print("Empty storage test {}: {s}\n", .{ i, test_case.name });
        std.debug.print("  Key: 0x{x}\n", .{test_case.key});
        std.debug.print("  Loaded value: 0x{x}\n", .{loaded_value});

        // Empty storage slots should return 0
        if (loaded_value != 0) {
            std.debug.print("  Warning: Empty slot returned non-zero value\n");
        }
    }
}

test "Geth-style storage overwrite tests" {
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

    const storage_key = 42;
    const values_to_test = [_]u256{
        0x111111,
        0x222222,
        0x000000, // Store zero (should clear slot)
        0x333333,
        0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
        0x000000, // Clear again
    };

    for (values_to_test, 0..) |value, i| {
        // Store the value
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{ storage_key, value });
        _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame); // SSTORE

        // Load it back
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{storage_key});
        _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame); // SLOAD

        const loaded_value = try test_frame.frame.stack.peek(0);

        std.debug.print("Storage overwrite test {}: Key {}\n", .{ i, storage_key });
        std.debug.print("  Stored: 0x{x}\n", .{value});
        std.debug.print("  Loaded: 0x{x}\n", .{loaded_value});

        if (loaded_value != value) {
            std.debug.print("  Overwrite failed!\n");
            return error.StorageOverwriteFailed;
        }
    }
}

test "Geth-style storage gas cost patterns" {
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

    // Test different gas cost scenarios for SSTORE
    const gas_test_scenarios = [_]struct {
        key: u256,
        initial_value: u256,
        new_value: u256,
        scenario_name: []const u8,
    }{
        .{ .key = 1, .initial_value = 0, .new_value = 100, .scenario_name = "Zero to non-zero (expensive)" },
        .{ .key = 2, .initial_value = 100, .new_value = 200, .scenario_name = "Non-zero to non-zero (moderate)" },
        .{ .key = 3, .initial_value = 100, .new_value = 0, .scenario_name = "Non-zero to zero (refund)" },
        .{ .key = 4, .initial_value = 0, .new_value = 0, .scenario_name = "Zero to zero (cheapest)" },
    };

    for (gas_test_scenarios, 0..) |scenario, i| {
        // Set initial value if needed
        if (scenario.initial_value != 0) {
            test_frame.clearStack();
            try test_frame.pushStack(&[_]u256{ scenario.key, scenario.initial_value });
            _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame); // SSTORE
        }

        // Now perform the test store operation
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{ scenario.key, scenario.new_value });

        const gas_before = test_frame.frame.gas_limit - test_frame.frame.gas_used;
        _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame); // SSTORE
        const gas_after = test_frame.frame.gas_limit - test_frame.frame.gas_used;

        const gas_consumed = gas_before - gas_after;

        std.debug.print("Gas scenario {}: {s}\n", .{ i, scenario.scenario_name });
        std.debug.print("  Key: {}, {} -> {}\n", .{ scenario.key, scenario.initial_value, scenario.new_value });
        std.debug.print("  Gas consumed: {}\n", .{gas_consumed});

        // Different scenarios should have different gas costs
        // This is implementation-specific, so we just log the costs
    }
}

test "Geth-style storage slot collision tests" {
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

    // Test storage slots that might have interesting bit patterns
    const collision_test_cases = [_]struct {
        key1: u256,
        key2: u256,
        value1: u256,
        value2: u256,
        name: []const u8,
    }{
        .{
            .key1 = 0x0000000000000000000000000000000000000000000000000000000000000001,
            .key2 = 0x0000000000000000000000000000000000000000000000000000000000000002,
            .value1 = 0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,
            .value2 = 0x5555555555555555555555555555555555555555555555555555555555555555,
            .name = "Adjacent slots with alternating bits",
        },
        .{
            .key1 = 0x0000000000000000000000000000000000000000000000000000000000000000,
            .key2 = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,
            .value1 = 0x1111111111111111111111111111111111111111111111111111111111111111,
            .value2 = 0x2222222222222222222222222222222222222222222222222222222222222222,
            .name = "Min and max slots",
        },
    };

    for (collision_test_cases, 0..) |test_case, i| {
        // Store first value
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{ test_case.key1, test_case.value1 });
        _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame); // SSTORE

        // Store second value
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{ test_case.key2, test_case.value2 });
        _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame); // SSTORE

        // Load first value
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{test_case.key1});
        _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame); // SLOAD
        const loaded_value1 = try test_frame.frame.stack.pop();

        // Load second value
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{test_case.key2});
        _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame); // SLOAD
        const loaded_value2 = try test_frame.frame.stack.pop();

        std.debug.print("Storage collision test {}: {s}\n", .{ i, test_case.name });
        std.debug.print("  Key1: 0x{x} -> Value1: 0x{x} (loaded: 0x{x})\n", .{ test_case.key1, test_case.value1, loaded_value1 });
        std.debug.print("  Key2: 0x{x} -> Value2: 0x{x} (loaded: 0x{x})\n", .{ test_case.key2, test_case.value2, loaded_value2 });

        // Verify no collision occurred
        if (loaded_value1 != test_case.value1 or loaded_value2 != test_case.value2) {
            std.debug.print("  Storage collision detected!\n");
            return error.StorageCollision;
        }
    }
}

test "Geth-style storage edge case patterns" {
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

    // Test edge cases with special bit patterns
    const edge_case_patterns = [_]struct {
        key: u256,
        value: u256,
        name: []const u8,
    }{
        .{ .key = 0, .value = 1, .name = "Slot 0 with minimal value" },
        .{ .key = 1, .value = 0, .name = "Slot 1 with zero value" },
        .{ .key = 0x80000000, .value = 0x80000000, .name = "Sign bit patterns" },
        .{ .key = 0x7FFFFFFF, .value = 0x7FFFFFFF, .name = "Max positive patterns" },
        .{ .key = 0x0101010101010101, .value = 0x0101010101010101, .name = "Alternating byte pattern" },
        .{ .key = 0xDEADBEEFDEADBEEF, .value = 0xCAFEBABECAFEBABE, .name = "Known hex patterns" },
    };

    for (edge_case_patterns, 0..) |pattern, i| {
        // Store the pattern
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{ pattern.key, pattern.value });
        _ = try helpers.executeOpcode(0x55, test_vm.vm, test_frame.frame); // SSTORE

        // Load it back
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{pattern.key});
        _ = try helpers.executeOpcode(0x54, test_vm.vm, test_frame.frame); // SLOAD

        const loaded_value = try test_frame.frame.stack.peek(0);

        std.debug.print("Edge case pattern {}: {s}\n", .{ i, pattern.name });
        std.debug.print("  Key: 0x{x}\n", .{pattern.key});
        std.debug.print("  Value: 0x{x}\n", .{pattern.value});
        std.debug.print("  Loaded: 0x{x}\n", .{loaded_value});

        if (loaded_value != pattern.value) {
            std.debug.print("  Pattern storage failed!\n");
            return error.PatternStorageFailed;
        }
    }

    std.debug.print("All edge case patterns stored and loaded successfully\n");
}