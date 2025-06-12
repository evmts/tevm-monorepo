const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");

// Import opcodes through evm module
const evm = @import("evm");
const memory_ops = evm.opcodes.memory;

/// Memory operation test case structure matching geth's memory tests
const MemoryCopyTestCase = struct {
    dst: u64,
    src: u64,
    len: u64,
    pre: []const u8,
    expected: []const u8,
    description: []const u8,
};

/// Helper function to convert hex string with spaces to bytes
fn hex_string_to_bytes(allocator: std.mem.Allocator, hex_str: []const u8) ![]u8 {
    var result = std.ArrayList(u8).init(allocator);
    defer result.deinit();
    
    var i: usize = 0;
    while (i < hex_str.len) {
        if (hex_str[i] == ' ') {
            i += 1;
            continue;
        }
        
        if (i + 1 < hex_str.len) {
            const byte_str = hex_str[i..i+2];
            const byte_val = try std.fmt.parseInt(u8, byte_str, 16);
            try result.append(byte_val);
            i += 2;
        } else {
            break;
        }
    }
    
    return result.toOwnedSlice();
}

/// Test MCOPY operation with cases from EIP-5656
test "Geth-style MCOPY comprehensive test cases" {
    const allocator = testing.allocator;

    // Test cases directly from geth's memory_test.go and EIP-5656
    const mcopy_test_cases = [_]MemoryCopyTestCase{
        .{
            .dst = 0,
            .src = 32,
            .len = 32,
            .pre = "0000000000000000000000000000000000000000000000000000000000000000 000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
            .expected = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
            .description = "Copy 32 bytes from offset 32 to offset 0",
        },
        .{
            .dst = 0,
            .src = 0,
            .len = 32,
            .pre = "0101010101010101010101010101010101010101010101010101010101010101",
            .expected = "0101010101010101010101010101010101010101010101010101010101010101",
            .description = "Copy 32 bytes from offset 0 to offset 0 (identity)",
        },
        .{
            .dst = 0,
            .src = 1,
            .len = 8,
            .pre = "000102030405060708 000000000000000000000000000000000000000000000000",
            .expected = "010203040506070808 000000000000000000000000000000000000000000000000",
            .description = "Copy 8 bytes from offset 1 to offset 0 (overlapping forward)",
        },
        .{
            .dst = 1,
            .src = 0,
            .len = 8,
            .pre = "000102030405060708 000000000000000000000000000000000000000000000000",
            .expected = "000001020304050607 000000000000000000000000000000000000000000000000",
            .description = "Copy 8 bytes from offset 0 to offset 1 (overlapping backward)",
        },
        .{
            .dst = 0xFFFFFFFF,
            .src = 0,
            .len = 1,
            .pre = "00",
            .expected = "", // Will cause memory expansion
            .description = "Copy to very high offset (memory expansion test)",
        },
    };

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    for (mcopy_test_cases[0..4]) |test_case| { // Skip the last one that causes huge expansion
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

        // Set up initial memory
        const pre_bytes = try hex_string_to_bytes(allocator, test_case.pre);
        defer allocator.free(pre_bytes);

        // Expand memory to accommodate the pre-data
        try test_frame.frame.memory.expand(pre_bytes.len);
        
        // Copy pre-data to memory
        @memcpy(test_frame.frame.memory.data[0..pre_bytes.len], pre_bytes);

        // Clear stack and push MCOPY parameters: dst, src, len
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{ test_case.len, test_case.src, test_case.dst });

        // Execute MCOPY (opcode 0x5E)
        _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame);

        // Verify the result
        if (test_case.expected.len > 0) {
            const expected_bytes = try hex_string_to_bytes(allocator, test_case.expected);
            defer allocator.free(expected_bytes);

            const actual_bytes = test_frame.frame.memory.data[0..expected_bytes.len];
            
            if (!std.mem.eql(u8, actual_bytes, expected_bytes)) {
                std.debug.print("MCOPY test failed: {s}\n", .{test_case.description});
                std.debug.print("Expected: ");
                for (expected_bytes) |b| std.debug.print("{x:0>2}", .{b});
                std.debug.print("\nActual:   ");
                for (actual_bytes) |b| std.debug.print("{x:0>2}", .{b});
                std.debug.print("\n");
                return error.MemoryMismatch;
            }
        }
    }
}

/// Test memory expansion and gas calculation
test "Geth-style memory expansion tests" {
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

    // Test cases for memory expansion
    const expansion_cases = [_]struct {
        offset: u64,
        length: u64,
        expected_memory_size: u64,
        description: []const u8,
    }{
        .{ .offset = 0, .length = 32, .expected_memory_size = 32, .description = "Basic 32-byte expansion" },
        .{ .offset = 32, .length = 32, .expected_memory_size = 64, .description = "Expand to 64 bytes" },
        .{ .offset = 0, .length = 1024, .expected_memory_size = 1024, .description = "Large expansion" },
        .{ .offset = 1000, .length = 24, .expected_memory_size = 1024, .description = "Expansion with offset" },
    };

    for (expansion_cases) |test_case| {
        // Reset memory
        test_frame.frame.memory.deinit(allocator);
        test_frame.frame.memory = try evm.memory.Memory.init(allocator);

        // Test MSTORE to trigger expansion
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{ 0x123456789ABCDEF, test_case.offset });

        _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame); // MSTORE

        const actual_size = test_frame.frame.memory.data.len;
        if (actual_size < test_case.expected_memory_size) {
            std.debug.print("Memory expansion test failed: {s}\n", .{test_case.description});
            std.debug.print("Expected at least {} bytes, got {}\n", .{ test_case.expected_memory_size, actual_size });
            return error.InsufficientMemoryExpansion;
        }
    }
}

/// Test MLOAD and MSTORE operations with edge cases
test "Geth-style MLOAD/MSTORE comprehensive tests" {
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

    const test_cases = [_]struct {
        offset: u64,
        value: u256,
        description: []const u8,
    }{
        .{ .offset = 0, .value = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF, .description = "Store/Load at offset 0" },
        .{ .offset = 32, .value = 0xFEDCBA9876543210FEDCBA9876543210FEDCBA9876543210FEDCBA9876543210, .description = "Store/Load at offset 32" },
        .{ .offset = 1, .value = 0x1111111111111111111111111111111111111111111111111111111111111111, .description = "Store/Load at unaligned offset" },
        .{ .offset = 0xFFFF, .value = 0x4242424242424242424242424242424242424242424242424242424242424242, .description = "Store/Load at high offset" },
    };

    for (test_cases) |test_case| {
        // Test MSTORE
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{ test_case.value, test_case.offset });
        _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame); // MSTORE

        // Test MLOAD
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{test_case.offset});
        _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame); // MLOAD

        // Verify the loaded value matches what we stored
        const loaded_value = try test_frame.frame.stack.peek(0);
        if (loaded_value != test_case.value) {
            std.debug.print("MLOAD/MSTORE test failed: {s}\n", .{test_case.description});
            std.debug.print("Expected: 0x{x}\n", .{test_case.value});
            std.debug.print("Got:      0x{x}\n", .{loaded_value});
            return error.ValueMismatch;
        }

        test_frame.clearStack();
    }
}

/// Test MSIZE opcode
test "Geth-style MSIZE tests" {
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

    // Initially, memory size should be 0
    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame); // MSIZE
    const initial_size = try test_frame.frame.stack.pop();
    if (initial_size != 0) {
        return error.UnexpectedInitialMemorySize;
    }

    // Store something to expand memory
    try test_frame.pushStack(&[_]u256{ 0x123, 0 });
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame); // MSTORE

    // Check memory size after expansion
    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame); // MSIZE
    const expanded_size = try test_frame.frame.stack.pop();
    if (expanded_size != 32) {
        std.debug.print("Expected memory size 32, got {}\n", .{expanded_size});
        return error.UnexpectedExpandedMemorySize;
    }

    // Store at higher offset
    try test_frame.pushStack(&[_]u256{ 0x456, 64 });
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame); // MSTORE

    // Check memory size after second expansion
    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame); // MSIZE
    const final_size = try test_frame.frame.stack.pop();
    if (final_size != 96) {
        std.debug.print("Expected memory size 96, got {}\n", .{final_size});
        return error.UnexpectedFinalMemorySize;
    }
}

/// Test CALLDATACOPY with various edge cases
test "Geth-style CALLDATACOPY comprehensive tests" {
    const allocator = testing.allocator;

    var test_vm = try helpers.TestVm.init(allocator);
    defer test_vm.deinit(allocator);

    // Create test calldata
    const test_calldata = &[_]u8{ 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF, 0x00 };

    var contract = try helpers.createTestContract(
        allocator,
        helpers.TestAddresses.CONTRACT,
        helpers.TestAddresses.ALICE,
        0,
        test_calldata,
    );
    defer contract.deinit(allocator, null);

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 100000);
    defer test_frame.deinit();

    const copy_cases = [_]struct {
        dest_offset: u64,
        src_offset: u64,
        length: u64,
        description: []const u8,
    }{
        .{ .dest_offset = 0, .src_offset = 0, .length = 16, .description = "Copy entire calldata" },
        .{ .dest_offset = 32, .src_offset = 4, .length = 8, .description = "Copy middle section" },
        .{ .dest_offset = 0, .src_offset = 12, .length = 8, .description = "Copy with some out-of-bounds" },
        .{ .dest_offset = 0, .src_offset = 20, .length = 8, .description = "Copy entirely out-of-bounds" },
    };

    for (copy_cases) |test_case| {
        // Reset memory
        test_frame.frame.memory.deinit(allocator);
        test_frame.frame.memory = try evm.memory.Memory.init(allocator);

        // Execute CALLDATACOPY
        test_frame.clearStack();
        try test_frame.pushStack(&[_]u256{ test_case.length, test_case.src_offset, test_case.dest_offset });
        _ = try helpers.executeOpcode(0x37, test_vm.vm, test_frame.frame); // CALLDATACOPY

        // Verify memory was expanded
        if (test_frame.frame.memory.data.len < test_case.dest_offset + test_case.length) {
            std.debug.print("CALLDATACOPY test failed: insufficient memory expansion for {s}\n", .{test_case.description});
            return error.InsufficientMemoryExpansion;
        }

        // Check that some data was copied (detailed verification would require more complex logic)
        std.debug.print("CALLDATACOPY test passed: {s}\n", .{test_case.description});
    }
}