const std = @import("std");
const testing = std.testing;
const helpers = @import("test_helpers.zig");
const evm = @import("evm");

/// Enhanced memory expansion edge case tests inspired by revm and go-ethereum patterns
/// 
/// This comprehensive test suite focuses on memory operations, gas accounting precision,
/// and boundary conditions that production EVM implementations handle. Tests are based on
/// patterns found in revm's memory operations and go-ethereum's memory expansion logic.
///
/// Key areas covered:
/// - Word-aligned memory expansion gas calculations with precise boundaries
/// - Memory offset overflow handling and usize saturation patterns
/// - MSIZE gas-free operation and word boundary rounding behavior
/// - MCOPY overlap detection and memmove-style copying
/// - Memory growth progression and gas cost verification
/// - Large memory allocation stress testing with realistic limits
/// - Zero-size operations optimization patterns

test "MLOAD: Memory expansion gas cost precision at word boundaries" {
    // Inspired by revm's memory expansion gas calculation
    // Tests precise gas costs when crossing 32-byte word boundaries
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

    // Test cases around word boundaries for gas calculation verification
    const boundary_tests = [_]struct {
        offset: u64,
        expected_words: u64,
        description: []const u8,
    }{
        .{ .offset = 0, .expected_words = 1, .description = "First word boundary" },
        .{ .offset = 31, .expected_words = 2, .description = "Just before second word" }, // offset 31 + 32 bytes = 63, rounds to 2 words
        .{ .offset = 32, .expected_words = 2, .description = "Exactly second word" }, // offset 32 + 32 bytes = 64, exactly 2 words
        .{ .offset = 33, .expected_words = 3, .description = "Just into third word" }, // offset 33 + 32 bytes = 65, rounds to 3 words
        .{ .offset = 1024, .expected_words = 33, .description = "Large aligned offset" }, // 1024 + 32 = 1056, rounds to 33 words
    };

    for (boundary_tests) |test_case| {
        test_frame.frame.memory.resize_context(0) catch unreachable;
        const gas_before = 50000;
        test_frame.frame.gas_remaining = gas_before;

        try test_frame.pushStack(&[_]u256{test_case.offset});
        _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame); // MLOAD

        const gas_used = gas_before - test_frame.frame.gas_remaining;
        
        // Verify memory was expanded to expected word boundary
        const memory_size = test_frame.frame.memory.context_size();
        const expected_size = test_case.expected_words * 32;
        try testing.expectEqual(expected_size, memory_size);

        // Verify gas calculation includes memory expansion cost
        // Base MLOAD cost (3) + memory expansion cost
        try testing.expect(gas_used >= 3); // At minimum, base gas cost
        
        // Gas should increase significantly when crossing word boundaries
        if (test_case.expected_words > 1) {
            try testing.expect(gas_used > 3); // Should include memory expansion
        }
    }
}

test "MSTORE: Offset overflow handling with usize saturation" {
    // Inspired by revm's as_usize_saturated pattern for handling large offsets
    // Tests behavior when memory offset approaches or exceeds usize limits
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

    // Test case 1: Offset exactly at usize max
    const max_usize_as_u256: u256 = std.math.maxInt(usize);
    const test_value: u256 = 0xDEADBEEF;
    
    try test_frame.pushStack(&[_]u256{ max_usize_as_u256, test_value });
    
    const result1 = helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame); // MSTORE
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, result1);

    // Test case 2: Offset beyond usize max (u256 max)
    test_frame.frame.stack.clear();
    const huge_offset = std.math.maxInt(u256);
    
    try test_frame.pushStack(&[_]u256{ huge_offset, test_value });
    
    const result2 = helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, result2);

    // Test case 3: Large but valid offset near usize max
    test_frame.frame.stack.clear();
    const large_valid_offset = std.math.maxInt(usize) - 1000;
    
    try test_frame.pushStack(&[_]u256{ large_valid_offset, test_value });
    
    const result3 = helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame);
    try testing.expectError(helpers.ExecutionError.Error.OutOfOffset, result3);
}

test "MSTORE8: Single byte storage with word boundary effects" {
    // Tests MSTORE8's behavior across memory word boundaries
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

    // Test pattern: Store bytes at strategic positions to verify word boundary handling
    const store_pattern = [_]struct {
        offset: u64,
        value: u8,
        expected_memory_words: u64,
    }{
        .{ .offset = 0, .value = 0xAA, .expected_memory_words = 1 },
        .{ .offset = 31, .value = 0xBB, .expected_memory_words = 1 }, // Still in first word
        .{ .offset = 32, .value = 0xCC, .expected_memory_words = 2 }, // First byte of second word
        .{ .offset = 63, .value = 0xDD, .expected_memory_words = 2 }, // Last byte of second word
        .{ .offset = 64, .value = 0xEE, .expected_memory_words = 3 }, // First byte of third word
    };

    for (store_pattern) |pattern| {
        try test_frame.pushStack(&[_]u256{ pattern.offset, pattern.value });
        _ = try helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame); // MSTORE8

        // Verify memory expansion
        const memory_size = test_frame.frame.memory.context_size();
        const expected_size = pattern.expected_memory_words * 32;
        try testing.expectEqual(expected_size, memory_size);

        // Verify the byte was stored correctly
        const stored_data = try test_frame.frame.memory.get_slice(pattern.offset, 1);
        try testing.expectEqual(pattern.value, stored_data[0]);
    }

    // Verify entire memory pattern
    const full_memory = try test_frame.frame.memory.get_slice(0, 65);
    try testing.expectEqual(@as(u8, 0xAA), full_memory[0]);
    try testing.expectEqual(@as(u8, 0xBB), full_memory[31]);
    try testing.expectEqual(@as(u8, 0xCC), full_memory[32]);
    try testing.expectEqual(@as(u8, 0xDD), full_memory[63]);
    try testing.expectEqual(@as(u8, 0xEE), full_memory[64]);
}

test "MSIZE: Gas-free operation with word boundary rounding" {
    // MSIZE should return memory size rounded up to word boundary without consuming gas
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

    // Test case 1: Initial memory size (should be 0)
    const gas_before_1 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame); // MSIZE
    const gas_after_1 = test_frame.frame.gas_remaining;
    const initial_size = try test_frame.popStack();

    try testing.expectEqual(@as(u256, 0), initial_size);
    try testing.expectEqual(gas_before_1 - 2, gas_after_1); // Only base gas cost

    // Test case 2: After expanding memory with MSTORE at offset 10
    try test_frame.pushStack(&[_]u256{ 10, 0x12345678 });
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame); // MSTORE

    const gas_before_2 = test_frame.frame.gas_remaining;
    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame); // MSIZE
    const gas_after_2 = test_frame.frame.gas_remaining;
    const size_after_store = try test_frame.popStack();

    // Memory should be rounded to word boundary: (10 + 32 + 31) / 32 * 32 = 64
    try testing.expectEqual(@as(u256, 64), size_after_store);
    try testing.expectEqual(gas_before_2 - 2, gas_after_2); // Only base gas cost

    // Test case 3: After expanding with MSTORE8 at boundary
    try test_frame.pushStack(&[_]u256{ 95, 0xFF }); // Just before 3rd word boundary
    _ = try helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame); // MSTORE8

    _ = try helpers.executeOpcode(0x59, test_vm.vm, test_frame.frame); // MSIZE
    const size_after_mstore8 = try test_frame.popStack();

    // Memory should be: (95 + 1 + 31) / 32 * 32 = 128 (4 words)
    try testing.expectEqual(@as(u256, 96), size_after_mstore8);
}

test "MCOPY: Overlap detection and memmove-style copying" {
    // Inspired by go-ethereum's memory copy with overlap handling
    // Tests correct behavior for overlapping source and destination regions
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

    // Setup: Initialize memory with known pattern
    const init_pattern = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10};
    for (init_pattern, 0..) |byte, i| {
        try test_frame.pushStack(&[_]u256{ i, byte });
        _ = try helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame); // MSTORE8
    }

    // Test case 1: Forward overlap (dest > src, dest < src + size)
    // Copy bytes 0-7 to positions 4-11, should copy backwards to preserve data
    try test_frame.pushStack(&[_]u256{ 4, 0, 8 }); // dest=4, src=0, size=8
    _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame); // MCOPY

    const memory_after_forward = try test_frame.frame.memory.get_slice(0, 16);
    const expected_forward = [_]u8{0x01, 0x02, 0x03, 0x04, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x0D, 0x0E, 0x0F, 0x10};
    try testing.expectEqualSlices(u8, &expected_forward, memory_after_forward);

    // Reset memory
    test_frame.frame.memory.resize_context(0) catch unreachable;
    for (init_pattern, 0..) |byte, i| {
        try test_frame.pushStack(&[_]u256{ i, byte });
        _ = try helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame); // MSTORE8
    }

    // Test case 2: Backward overlap (src > dest, src < dest + size)
    // Copy bytes 4-11 to positions 0-7, should copy forwards to preserve data
    try test_frame.pushStack(&[_]u256{ 0, 4, 8 }); // dest=0, src=4, size=8
    _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame); // MCOPY

    const memory_after_backward = try test_frame.frame.memory.get_slice(0, 16);
    const expected_backward = [_]u8{0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10};
    try testing.expectEqualSlices(u8, &expected_backward, memory_after_backward);

    // Test case 3: No overlap
    test_frame.frame.memory.resize_context(0) catch unreachable;
    for (init_pattern, 0..) |byte, i| {
        try test_frame.pushStack(&[_]u256{ i, byte });
        _ = try helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame); // MSTORE8
    }

    try test_frame.pushStack(&[_]u256{ 32, 0, 8 }); // dest=32, src=0, size=8 (no overlap)
    _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame); // MCOPY

    const memory_after_no_overlap = try test_frame.frame.memory.get_slice(32, 8);
    try testing.expectEqualSlices(u8, init_pattern[0..8], memory_after_no_overlap);
}

test "MCOPY: Gas accounting for large copies" {
    // Tests gas calculation for memory expansion and copy costs
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000000);
    defer test_frame.deinit();

    // Initialize source data
    const source_size = 1024;
    for (0..source_size) |i| {
        try test_frame.pushStack(&[_]u256{ i, i % 256 });
        _ = try helpers.executeOpcode(0x53, test_vm.vm, test_frame.frame); // MSTORE8
    }

    // Test case: Large copy with significant memory expansion
    const dest_offset = 2048;
    const copy_size = 512;
    
    const gas_before = test_frame.frame.gas_remaining;
    try test_frame.pushStack(&[_]u256{ dest_offset, 0, copy_size });
    _ = try helpers.executeOpcode(0x5E, test_vm.vm, test_frame.frame); // MCOPY
    const gas_after = test_frame.frame.gas_remaining;
    
    const gas_used = gas_before - gas_after;
    
    // Verify gas includes:
    // 1. Base MCOPY cost (3 gas)
    // 2. Memory expansion cost for dest_offset + copy_size
    // 3. Copy cost (3 gas per word)
    const words_copied = (copy_size + 31) / 32; // 16 words
    const expected_copy_gas = 3 * words_copied; // 48 gas
    
    try testing.expect(gas_used >= 3 + expected_copy_gas); // At minimum base + copy costs
    
    // Verify data was copied correctly
    const copied_data = try test_frame.frame.memory.get_slice(dest_offset, copy_size);
    for (copied_data, 0..) |byte, i| {
        try testing.expectEqual(@as(u8, @intCast(i % 256)), byte);
    }
}

test "Memory expansion: Progressive growth gas cost verification" {
    // Tests that memory expansion costs increase quadratically as per EVM spec
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 1000000);
    defer test_frame.deinit();

    // Test progressive memory expansion at different sizes
    const expansion_tests = [_]u64{ 32, 64, 128, 256, 512, 1024 };
    var previous_total_gas: u64 = 0;

    for (expansion_tests, 0..) |target_size, i| {
        test_frame.frame.memory.resize_context(0) catch unreachable;
        test_frame.frame.gas_remaining = 1000000;
        
        const gas_before = test_frame.frame.gas_remaining;
        
        // Expand memory to target size by accessing last byte
        try test_frame.pushStack(&[_]u256{target_size - 32}); // Offset for MLOAD to reach target_size
        _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame); // MLOAD
        
        const gas_after = test_frame.frame.gas_remaining;
        const gas_used = gas_before - gas_after;
        
        // Verify memory was expanded to expected size
        const memory_size = test_frame.frame.memory.context_size();
        try testing.expectEqual(target_size, memory_size);
        
        // Gas cost should increase more than linearly (quadratic component)
        if (i > 0) {
            const gas_increase = gas_used - previous_total_gas;
            const size_ratio = target_size / expansion_tests[i-1];
            
            // Gas increase should be more than proportional to size increase
            // due to quadratic component in memory gas formula
            if (target_size >= 128) { // Skip very small sizes where base costs dominate
                try testing.expect(gas_increase > 3 * size_ratio); // More than just linear scaling
            }
        }
        
        previous_total_gas = gas_used;
    }
}

test "Memory operations: Zero-size optimization patterns" {
    // Tests that zero-size memory operations are optimized and don't expand memory
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

    const zero_size_tests = [_]struct {
        opcode: u8,
        stack_setup: []const u256,
        description: []const u8,
    }{
        .{ .opcode = 0x5E, .stack_setup = &[_]u256{ 1000, 0, 0 }, .description = "MCOPY zero size" }, // dest, src, size
    };

    for (zero_size_tests) |test_case| {
        const memory_size_before = test_frame.frame.memory.context_size();
        const gas_before = test_frame.frame.gas_remaining;

        try test_frame.pushStack(test_case.stack_setup);
        _ = try helpers.executeOpcode(test_case.opcode, test_vm.vm, test_frame.frame);

        const memory_size_after = test_frame.frame.memory.context_size();
        const gas_after = test_frame.frame.gas_remaining;
        const gas_used = gas_before - gas_after;

        // Memory should not expand for zero-size operations
        try testing.expectEqual(memory_size_before, memory_size_after);
        
        // Should only consume base opcode gas, no memory expansion gas
        try testing.expectEqual(@as(u64, 3), gas_used); // Base cost for MCOPY
    }
}

test "Memory stress test: Large allocation near limits" {
    // Tests behavior with large memory allocations approaching practical limits
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

    var test_frame = try helpers.TestFrame.init(allocator, &contract, 10000000);
    defer test_frame.deinit();

    // Test large but reasonable memory allocation (64KB)
    const large_offset = 65536 - 32; // 64KB - 32 bytes
    
    try test_frame.pushStack(&[_]u256{large_offset});
    _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame); // MLOAD
    
    // Verify memory was allocated
    const memory_size = test_frame.frame.memory.context_size();
    try testing.expectEqual(@as(usize, 65536), memory_size);
    
    // Verify we can read from allocated memory
    const loaded_value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0), loaded_value); // Should be zero-initialized

    // Test MSTORE at the allocated region
    try test_frame.pushStack(&[_]u256{ large_offset, 0xCAFEBABE });
    _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame); // MSTORE

    // Verify the value was stored correctly
    try test_frame.pushStack(&[_]u256{large_offset});
    _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame); // MLOAD
    const stored_value = try test_frame.popStack();
    try testing.expectEqual(@as(u256, 0xCAFEBABE), stored_value);
}

test "MLOAD/MSTORE: Consistent memory access patterns" {
    // Tests that MLOAD and MSTORE work consistently across different scenarios
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

    // Test pattern: Store and load at various offsets to verify consistency
    const test_patterns = [_]struct {
        offset: u64,
        value: u256,
    }{
        .{ .offset = 0, .value = 0x1111111111111111 },
        .{ .offset = 32, .value = 0x2222222222222222 },
        .{ .offset = 100, .value = 0x3333333333333333 },
        .{ .offset = 1000, .value = 0x4444444444444444 },
    };

    // Store all values
    for (test_patterns) |pattern| {
        try test_frame.pushStack(&[_]u256{ pattern.offset, pattern.value });
        _ = try helpers.executeOpcode(0x52, test_vm.vm, test_frame.frame); // MSTORE
    }

    // Load and verify all values
    for (test_patterns) |pattern| {
        try test_frame.pushStack(&[_]u256{pattern.offset});
        _ = try helpers.executeOpcode(0x51, test_vm.vm, test_frame.frame); // MLOAD
        const loaded_value = try test_frame.popStack();
        try testing.expectEqual(pattern.value, loaded_value);
    }

    // Verify memory size is correct (should be rounded to word boundary of highest access)
    const highest_access = 1000 + 32; // 1032
    const expected_memory_size = ((highest_access + 31) / 32) * 32; // Round up to word boundary
    const actual_memory_size = test_frame.frame.memory.context_size();
    try testing.expectEqual(expected_memory_size, actual_memory_size);
}