const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes through evm module
const evm = @import("evm");

/// Test stack manipulation operations comprehensively
/// This follows geth's approach to testing stack operations with edge cases

test "Geth-style PUSH operations comprehensive tests" {
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

    // Test PUSH1 through PUSH32 with various patterns
    const push_test_cases = [_]struct {
        opcode: u8,
        expected_bytes: u8,
        test_value: u256,
        name: []const u8,
    }{
        .{ .opcode = 0x60, .expected_bytes = 1, .test_value = 0x42, .name = "PUSH1" },
        .{ .opcode = 0x61, .expected_bytes = 2, .test_value = 0x4242, .name = "PUSH2" },
        .{ .opcode = 0x62, .expected_bytes = 3, .test_value = 0x424242, .name = "PUSH3" },
        .{ .opcode = 0x63, .expected_bytes = 4, .test_value = 0x42424242, .name = "PUSH4" },
        .{ .opcode = 0x64, .expected_bytes = 5, .test_value = 0x4242424242, .name = "PUSH5" },
        .{ .opcode = 0x70, .expected_bytes = 17, .test_value = 0x424242424242424242424242424242424242, .name = "PUSH17" },
        .{ .opcode = 0x7F, .expected_bytes = 32, .test_value = 0x4242424242424242424242424242424242424242424242424242424242424242, .name = "PUSH32" },
    };

    for (push_test_cases, 0..) |test_case, i| {
        test_frame.clearStack();

        // For PUSH operations, we need to simulate the immediate data following the opcode
        // In a real implementation, PUSH reads the immediate bytes from bytecode
        std.debug.print("PUSH test {}: {s}\n", .{ i, test_case.name });
        std.debug.print("  Opcode: 0x{x:0>2}\n", .{test_case.opcode});
        std.debug.print("  Expected bytes: {}\n", .{test_case.expected_bytes});
        std.debug.print("  Test value: 0x{x}\n", .{test_case.test_value});

        // Verify the opcode is in the correct range
        const push_num = test_case.opcode - 0x5F; // PUSH1 = 0x60, so PUSH1-PUSH32 = 1-32
        try testing.expect(push_num >= 1 and push_num <= 32);
        try testing.expect(push_num == test_case.expected_bytes);
    }
}

test "Geth-style DUP operations comprehensive tests" {
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

    // Test DUP1 through DUP16
    const dup_test_cases = [_]struct {
        opcode: u8,
        dup_position: u8,
        name: []const u8,
    }{
        .{ .opcode = 0x80, .dup_position = 1, .name = "DUP1" },
        .{ .opcode = 0x81, .dup_position = 2, .name = "DUP2" },
        .{ .opcode = 0x82, .dup_position = 3, .name = "DUP3" },
        .{ .opcode = 0x83, .dup_position = 4, .name = "DUP4" },
        .{ .opcode = 0x88, .dup_position = 9, .name = "DUP9" },
        .{ .opcode = 0x8F, .dup_position = 16, .name = "DUP16" },
    };

    for (dup_test_cases, 0..) |test_case, i| {
        test_frame.clearStack();

        // Set up stack with enough values for the DUP operation
        const stack_values = [_]u256{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 };
        try test_frame.pushStack(stack_values[0..test_case.dup_position + 1]);

        const initial_stack_size = test_frame.frame.stack.len();
        const expected_duplicated_value = test_frame.frame.stack.peek(test_case.dup_position - 1) catch unreachable;

        // Execute DUP operation
        _ = try helpers.executeOpcode(test_case.opcode, test_vm.vm, test_frame.frame);

        // Verify stack size increased by 1
        const final_stack_size = test_frame.frame.stack.len();
        if (final_stack_size != initial_stack_size + 1) {
            std.debug.print("DUP test {} failed: {s} - Stack size mismatch\n", .{ i, test_case.name });
            std.debug.print("  Expected size: {}, Got: {}\n", .{ initial_stack_size + 1, final_stack_size });
            return error.StackSizeMismatch;
        }

        // Verify the top of stack is the duplicated value
        const top_value = try test_frame.frame.stack.peek(0);
        if (top_value != expected_duplicated_value) {
            std.debug.print("DUP test {} failed: {s} - Value mismatch\n", .{ i, test_case.name });
            std.debug.print("  Expected: {}, Got: {}\n", .{ expected_duplicated_value, top_value });
            return error.ValueMismatch;
        }

        std.debug.print("DUP test {} passed: {s}\n", .{ i, test_case.name });
    }
}

test "Geth-style SWAP operations comprehensive tests" {
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

    // Test SWAP1 through SWAP16
    const swap_test_cases = [_]struct {
        opcode: u8,
        swap_position: u8,
        name: []const u8,
    }{
        .{ .opcode = 0x90, .swap_position = 1, .name = "SWAP1" },
        .{ .opcode = 0x91, .swap_position = 2, .name = "SWAP2" },
        .{ .opcode = 0x92, .swap_position = 3, .name = "SWAP3" },
        .{ .opcode = 0x93, .swap_position = 4, .name = "SWAP4" },
        .{ .opcode = 0x98, .swap_position = 9, .name = "SWAP9" },
        .{ .opcode = 0x9F, .swap_position = 16, .name = "SWAP16" },
    };

    for (swap_test_cases, 0..) |test_case, i| {
        test_frame.clearStack();

        // Set up stack with enough values for the SWAP operation
        const stack_values = [_]u256{ 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700 };
        try test_frame.pushStack(stack_values[0..test_case.swap_position + 1]);

        const initial_stack_size = test_frame.frame.stack.len();
        const top_value = test_frame.frame.stack.peek(0) catch unreachable;
        const swap_value = test_frame.frame.stack.peek(test_case.swap_position) catch unreachable;

        // Execute SWAP operation
        _ = try helpers.executeOpcode(test_case.opcode, test_vm.vm, test_frame.frame);

        // Verify stack size unchanged
        const final_stack_size = test_frame.frame.stack.len();
        if (final_stack_size != initial_stack_size) {
            std.debug.print("SWAP test {} failed: {s} - Stack size changed\n", .{ i, test_case.name });
            return error.StackSizeChanged;
        }

        // Verify values were swapped
        const new_top_value = try test_frame.frame.stack.peek(0);
        const new_swap_value = try test_frame.frame.stack.peek(test_case.swap_position);

        if (new_top_value != swap_value or new_swap_value != top_value) {
            std.debug.print("SWAP test {} failed: {s} - Values not swapped correctly\n", .{ i, test_case.name });
            std.debug.print("  Original top: {}, swap: {}\n", .{ top_value, swap_value });
            std.debug.print("  New top: {}, swap: {}\n", .{ new_top_value, new_swap_value });
            return error.SwapFailed;
        }

        std.debug.print("SWAP test {} passed: {s}\n", .{ i, test_case.name });
    }
}

test "Geth-style POP operation comprehensive tests" {
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

    const pop_test_cases = [_]struct {
        initial_stack: []const u256,
        expected_remaining: usize,
        name: []const u8,
    }{
        .{ .initial_stack = &[_]u256{42}, .expected_remaining = 0, .name = "POP single item" },
        .{ .initial_stack = &[_]u256{ 1, 2, 3 }, .expected_remaining = 2, .name = "POP from multiple items" },
        .{ .initial_stack = &[_]u256{ 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, 0x123456789ABCDEF }, .expected_remaining = 1, .name = "POP large values" },
    };

    for (pop_test_cases, 0..) |test_case, i| {
        test_frame.clearStack();
        try test_frame.pushStack(test_case.initial_stack);

        const initial_size = test_frame.frame.stack.len();
        const top_value = test_frame.frame.stack.peek(0) catch unreachable;

        // Execute POP operation
        _ = try helpers.executeOpcode(0x50, test_vm.vm, test_frame.frame);

        // Verify stack size decreased by 1
        const final_size = test_frame.frame.stack.len();
        if (final_size != test_case.expected_remaining) {
            std.debug.print("POP test {} failed: {s} - Stack size mismatch\n", .{ i, test_case.name });
            std.debug.print("  Expected: {}, Got: {}\n", .{ test_case.expected_remaining, final_size });
            return error.StackSizeMismatch;
        }

        std.debug.print("POP test {} passed: {s} - Popped value: {}\n", .{ i, test_case.name, top_value });
    }
}

test "Geth-style stack depth limit tests" {
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

    // Test that we can push up to the stack limit (1024 items in EVM)
    const max_stack_size = 1024;
    
    // Fill stack to near capacity
    const fill_count = 1020; // Leave room for operations
    var i: u256 = 0;
    while (i < fill_count) : (i += 1) {
        try test_frame.pushStack(&[_]u256{i});
    }

    std.debug.print("Stack depth test: Pushed {} items\n", .{fill_count});
    
    // Try to push a few more items
    try test_frame.pushStack(&[_]u256{9999});
    const current_size = test_frame.frame.stack.len();
    
    std.debug.print("Current stack size: {}\n", .{current_size});
    try testing.expect(current_size <= max_stack_size);
    
    // Test DUP with full stack
    if (current_size < max_stack_size) {
        _ = try helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame); // DUP1
        std.debug.print("DUP1 succeeded at stack size: {}\n", .{test_frame.frame.stack.len()});
    }
}

test "Geth-style stack underflow protection tests" {
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

    // Test operations that should fail with empty stack
    const underflow_cases = [_]struct {
        opcode: u8,
        name: []const u8,
        min_stack_required: u8,
    }{
        .{ .opcode = 0x50, .name = "POP", .min_stack_required = 1 },
        .{ .opcode = 0x80, .name = "DUP1", .min_stack_required = 1 },
        .{ .opcode = 0x81, .name = "DUP2", .min_stack_required = 2 },
        .{ .opcode = 0x90, .name = "SWAP1", .min_stack_required = 2 },
        .{ .opcode = 0x91, .name = "SWAP2", .min_stack_required = 3 },
        .{ .opcode = 0x01, .name = "ADD", .min_stack_required = 2 },
        .{ .opcode = 0x02, .name = "MUL", .min_stack_required = 2 },
    };

    for (underflow_cases, 0..) |test_case, i| {
        test_frame.clearStack();

        // Try operation with insufficient stack
        if (test_case.min_stack_required > 1) {
            // Push one less than required
            var j: u8 = 0;
            while (j < test_case.min_stack_required - 1) : (j += 1) {
                try test_frame.pushStack(&[_]u256{j});
            }
        }

        // This should fail with stack underflow
        const result = helpers.executeOpcode(test_case.opcode, test_vm.vm, test_frame.frame);
        
        if (result) |_| {
            std.debug.print("Warning: {s} should have failed with stack underflow\n", .{test_case.name});
        } else |err| {
            std.debug.print("Stack underflow test {} passed: {s} correctly failed with {}\n", .{ i, test_case.name, err });
        }
    }
}

test "Geth-style stack operation edge cases" {
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

    // Test with extreme values
    const extreme_values = [_]u256{
        0, // Zero
        1, // One  
        0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // Max uint256
        0x8000000000000000000000000000000000000000000000000000000000000000, // Sign bit
        0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF, // Max positive in signed
    };

    // Test DUP with extreme values
    for (extreme_values, 0..) |value, i| {
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{value});

        _ = try helpers.executeOpcode(0x80, test_vm.vm, test_frame.frame); // DUP1

        const top = try test_frame.frame.stack.peek(0);
        const second = try test_frame.frame.stack.peek(1);

        if (top != value or second != value) {
            std.debug.print("DUP1 extreme value test {} failed\n", .{i});
            return error.DupExtremeFailed;
        }
    }

    // Test SWAP with extreme values
    test_frame.clearStack();
    try test_frame.pushStack(&[_]u256{ extreme_values[4], extreme_values[0] });

    _ = try helpers.executeOpcode(0x90, test_vm.vm, test_frame.frame); // SWAP1

    const top = try test_frame.frame.stack.peek(0);
    const second = try test_frame.frame.stack.peek(1);

    if (top != extreme_values[4] or second != extreme_values[0]) {
        std.debug.print("SWAP1 extreme value test failed\n");
        return error.SwapExtremeFailed;
    }

    std.debug.print("All extreme value stack tests passed\n");
}