const std = @import("std");
const evm = @import("evm");
const Memory = evm.Memory;
const testing = std.testing;

// Tests that verify behavior matches revm and evmone implementations

test "Comparison: initial memory state matches implementations" {
    // Both revm and evmone start with empty memory
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    try testing.expect(mem.context_is_empty());
    try testing.expectEqual(@as(usize, 0), mem.context_size());

    // Verify 4KB initial capacity like evmone
    try testing.expect(mem.total_shared_buffer_capacity() >= 4 * 1024);
}

test "Comparison: word-aligned operations like revm" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Test word operations similar to revm's get_word/set_word
    const test_word = [32]u8{
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F,
        0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17,
        0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F,
    };

    // Set word at offset 64 (like revm)
    try mem.set_word(64, test_word);

    // Get word back
    const read_word = try mem.get_word(64);
    try testing.expectEqualSlices(u8, &test_word, &read_word);

    // Test U256 operations like revm
    const test_u256: u256 = 0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF;
    try mem.set_u256(128, test_u256);
    const read_u256 = try mem.get_u256(128);
    try testing.expectEqual(test_u256, read_u256);
}

test "Comparison: setDataBounded matches revm's set_data behavior" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    const data = [_]u8{ 0xAA, 0xBB, 0xCC, 0xDD };

    // Test case 1: Normal copy (like revm's set_data)
    try mem.set_data_bounded(10, &data, 0, 4);
    const result1 = try mem.get_slice(10, 4);
    try testing.expectEqualSlices(u8, &data, result1);

    // Test case 2: Source offset beyond bounds (should zero-fill like revm)
    try mem.set_data_bounded(20, &data, 10, 4);
    const result2 = try mem.get_slice(20, 4);
    for (result2) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }

    // Test case 3: Partial copy with zero-fill (like revm)
    try mem.set_data_bounded(30, &data, 2, 6);
    const result3 = try mem.get_slice(30, 6);
    try testing.expectEqual(@as(u8, 0xCC), result3[0]);
    try testing.expectEqual(@as(u8, 0xDD), result3[1]);
    try testing.expectEqual(@as(u8, 0), result3[2]);
    try testing.expectEqual(@as(u8, 0), result3[3]);
    try testing.expectEqual(@as(u8, 0), result3[4]);
    try testing.expectEqual(@as(u8, 0), result3[5]);
}

test "Comparison: memory expansion matches evmone's grow behavior" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // evmone uses 2x growth factor
    const initial_cap = mem.total_shared_buffer_capacity();

    // Trigger expansion beyond initial capacity
    try mem.resize_context(initial_cap + 1);

    // Verify 2x growth like evmone
    try testing.expect(mem.total_shared_buffer_capacity() >= initial_cap * 2);

    // Verify zero-initialization like both implementations
    for (0..mem.context_size()) |i| {
        try testing.expectEqual(@as(u8, 0), try mem.get_byte(i));
    }
}

test "Comparison: copy semantics match revm/evmone memmove" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Initialize test data
    const data = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
    try mem.set_data(0, &data);

    // Test overlapping copy forward (like memmove)
    try mem.copy(2, 0, 8);
    const forward_result = try mem.get_slice(0, 10);
    const expected_forward = [_]u8{ 1, 2, 1, 2, 3, 4, 5, 6, 7, 8 };
    try testing.expectEqualSlices(u8, &expected_forward, forward_result);

    // Reset
    try mem.set_data(0, &data);

    // Test overlapping copy backward (like memmove)
    try mem.copy(0, 2, 8);
    const backward_result = try mem.get_slice(0, 10);
    const expected_backward = [_]u8{ 3, 4, 5, 6, 7, 8, 9, 10, 9, 10 };
    try testing.expectEqualSlices(u8, &expected_backward, backward_result);
}

test "Comparison: gas cost calculation matches EVM specification" {
    // Test gas costs match the formula: 3 * words + words² / 512
    const test_cases = [_]struct {
        size: usize,
        expected_gas: u64,
    }{
        .{ .size = 0, .expected_gas = 0 }, // 0 words: 0 gas
        .{ .size = 32, .expected_gas = 3 }, // 1 word: 3 + 1/512 = 3
        .{ .size = 64, .expected_gas = 6 }, // 2 words: 6 + 4/512 = 6
        .{ .size = 1024, .expected_gas = 98 }, // 32 words: 96 + 1024/512 = 98
        .{ .size = 32768, .expected_gas = 5120 }, // 1024 words: 3072 + 1048576/512 = 5120
    };

    for (test_cases) |tc| {
        // Create fresh memory for each test
        var mem = try Memory.init_default(testing.allocator);
        mem.finalize_root();
        defer mem.deinit();

        const new_words = try mem.ensure_context_capacity(tc.size);
        const words = Memory.calculate_num_words(tc.size);
        try testing.expectEqual(words, new_words);

        // Calculate expected gas
        const gas = 3 * words + (words * words) / 512;
        try testing.expectEqual(tc.expected_gas, gas);
    }
}

test "Comparison: memory limit feature like revm" {
    // Test memory limit feature similar to revm's memory_limit
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();
    mem.memory_limit = 1024 * 1024; // 1MB limit

    // Should succeed within limit
    try mem.resize_context(512 * 1024);

    // Should fail beyond limit
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, mem.resize_context(2 * 1024 * 1024));

    // Verify memory wasn't expanded
    try testing.expectEqual(@as(usize, 512 * 1024), mem.context_size());
}

test "Comparison: unsafe operations performance optimization" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Pre-allocate memory
    try mem.resize_context(1024);

    // Test unsafe operations similar to evmone's direct pointer access
    const data = [_]u8{ 0x11, 0x22, 0x33, 0x44 };

    // Unsafe set (no bounds checking)
    mem.set_unsafe(100, &data);

    // Verify with safe read
    const result = try mem.get_slice(100, 4);
    try testing.expectEqualSlices(u8, &data, result);

    // Test unsafe pointer access
    const ptr = mem.get_ptr_unsafe(100);
    try testing.expectEqual(@as(u8, 0x11), ptr[0]);
    try testing.expectEqual(@as(u8, 0x22), ptr[1]);

    const const_ptr = mem.get_const_ptr_unsafe(100);
    try testing.expectEqual(@as(u8, 0x33), const_ptr[2]);
    try testing.expectEqual(@as(u8, 0x44), const_ptr[3]);
}

test "Comparison: word count calculation matches implementations" {
    // Both revm and evmone use the same word calculation
    try testing.expectEqual(@as(usize, 0), Memory.calculate_num_words(0));
    try testing.expectEqual(@as(usize, 1), Memory.calculate_num_words(1));
    try testing.expectEqual(@as(usize, 1), Memory.calculate_num_words(31));
    try testing.expectEqual(@as(usize, 1), Memory.calculate_num_words(32));
    try testing.expectEqual(@as(usize, 2), Memory.calculate_num_words(33));
    try testing.expectEqual(@as(usize, 2), Memory.calculate_num_words(64));
    try testing.expectEqual(@as(usize, 3), Memory.calculate_num_words(65));

    // Large values
    try testing.expectEqual(@as(usize, 32), Memory.calculate_num_words(1024));
    try testing.expectEqual(@as(usize, 1024), Memory.calculate_num_words(32768));
}

test "Comparison: context management preparation" {
    // This test prepares for future context management like revm's Memory
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Set up initial memory state
    try mem.set_data(0, "Parent context");
    const parent_size = mem.context_size();

    // Create snapshot (simulating new_child_context)
    const snapshot = try mem.snapshot_context(testing.allocator);
    defer testing.allocator.free(snapshot);

    // Modify memory (simulating child context changes)
    try mem.set_data(100, "Child context");
    try testing.expect(mem.context_size() > parent_size);

    // Restore snapshot (simulating free_child_context)
    try mem.restore_context(snapshot);

    // Verify parent context is restored
    try testing.expectEqual(parent_size, mem.context_size());
    const parent_data = try mem.get_slice(0, 14);
    try testing.expectEqualSlices(u8, "Parent context", parent_data);
}
