const std = @import("std");
const evm = @import("evm");
const Memory = evm.Memory;
const testing = std.testing;

pub fn calculate_num_words(len: usize) usize {
    return (len + 31) / 32;
}

// Test basic functionality
test "Memory initialization and basic operations" {
    // Test init with default capacity
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    try testing.expect(mem.context_is_empty());
    try testing.expectEqual(@as(usize, 0), mem.context_size());

    // Test custom capacity
    var mem2 = try Memory.init(testing.allocator, 8192, Memory.DefaultMemoryLimit);
    mem2.finalize_root();
    defer mem2.deinit();

    try testing.expect(mem2.context_is_empty());

    // Test with custom memory limit
    var mem3 = try Memory.init_default(testing.allocator);
    mem3.finalize_root();
    defer mem3.deinit();
    mem3.memory_limit = 1024;

    try testing.expectEqual(@as(u64, 1024), mem3.memory_limit);
}

test "Memory byte operations" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Test setByte and getByte
    try mem.set_byte(10, 0xAB);
    try testing.expectEqual(@as(usize, 11), mem.context_size());
    try testing.expectEqual(@as(u8, 0xAB), try mem.get_byte(10));

    // Verify zero-initialization
    for (0..10) |i| {
        try testing.expectEqual(@as(u8, 0), try mem.get_byte(i));
    }

    // Test out of bounds
    try testing.expectError(Memory.MemoryError.InvalidOffset, mem.get_byte(11));
}

test "Memory word operations" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Test setWord and getWord
    const word = [32]u8{
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
        0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20,
    };

    try mem.set_word(64, word);
    try testing.expectEqual(@as(usize, 96), mem.context_size());

    const read_word = try mem.get_word(64);
    try testing.expectEqualSlices(u8, &word, &read_word);

    // Test word at boundary
    try mem.set_word(mem.context_size() - 32, word);
    const boundary_word = try mem.get_word(mem.context_size() - 32);
    try testing.expectEqualSlices(u8, &word, &boundary_word);
}

test "Memory U256 operations" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Test small value
    const val1: u256 = 0x1234567890ABCDEF;
    try mem.set_u256(0, val1);
    const read_val1 = try mem.get_u256(0);
    try testing.expectEqual(val1, read_val1);

    // Test max value
    const val2: u256 = std.math.maxInt(u256);
    try mem.set_u256(32, val2);
    const read_val2 = try mem.get_u256(32);
    try testing.expectEqual(val2, read_val2);

    // Test zero
    try mem.set_u256(64, 0);
    const read_val3 = try mem.get_u256(64);
    try testing.expectEqual(@as(u256, 0), read_val3);
}

test "Memory slice operations" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Test setData and getSlice
    const data = "Hello, EVM Memory!";
    try mem.set_data(100, data);

    const slice = try mem.get_slice(100, data.len);
    try testing.expectEqualSlices(u8, data, slice);

    // Test empty slice
    const empty = try mem.get_slice(0, 0);
    try testing.expectEqual(@as(usize, 0), empty.len);

    // Test out of bounds
    try testing.expectError(Memory.MemoryError.InvalidOffset, mem.get_slice(mem.context_size(), 1));
}

test "Memory setDataBounded" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    const data = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8 };

    // Test normal copy
    try mem.set_data_bounded(10, &data, 2, 4);
    const result1 = try mem.get_slice(10, 4);
    try testing.expectEqualSlices(u8, data[2..6], result1);

    // Test source offset beyond data (should zero-fill)
    try mem.set_data_bounded(20, &data, 10, 4);
    const result2 = try mem.get_slice(20, 4);
    for (result2) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }

    // Test partial copy with zero-fill
    try mem.set_data_bounded(30, &data, 6, 4);
    const result3 = try mem.get_slice(30, 4);
    try testing.expectEqual(@as(u8, 7), result3[0]);
    try testing.expectEqual(@as(u8, 8), result3[1]);
    try testing.expectEqual(@as(u8, 0), result3[2]);
    try testing.expectEqual(@as(u8, 0), result3[3]);
}

test "Memory copy operations" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    const data = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
    try mem.set_data(0, &data);

    // Test non-overlapping copy
    try mem.copy(20, 0, 10);
    const result1 = try mem.get_slice(20, 10);
    try testing.expectEqualSlices(u8, &data, result1);

    // Test overlapping copy (forward)
    try mem.copy(2, 0, 8);
    const expected_forward = [_]u8{ 1, 2, 1, 2, 3, 4, 5, 6, 7, 8 };
    const result2 = try mem.get_slice(0, 10);
    try testing.expectEqualSlices(u8, &expected_forward, result2);

    // Reset data
    try mem.set_data(0, &data);

    // Test overlapping copy (backward)
    try mem.copy(0, 2, 8);
    const expected_backward = [_]u8{ 3, 4, 5, 6, 7, 8, 9, 10, 9, 10 };
    const result3 = try mem.get_slice(0, 10);
    try testing.expectEqualSlices(u8, &expected_backward, result3);

    // Test zero-length copy
    try mem.copy(50, 0, 0);
}

test "Memory expansion and gas calculation" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Test ensureCapacity
    const new_words1 = try mem.ensure_context_capacity(100);
    try testing.expectEqual(@as(u64, 4), new_words1); // ceil(100/32) = 4 words
    try testing.expect(mem.context_size() >= 100);

    // Test no expansion needed
    const new_words2 = try mem.ensure_context_capacity(50);
    try testing.expectEqual(@as(u64, 0), new_words2);

    // Test large expansion
    const new_words3 = try mem.ensure_context_capacity(1024);
    try testing.expectEqual(@as(u64, 28), new_words3); // 32 - 4 = 28 new words
}

test "Memory resize behavior" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Test growth
    try mem.resize_context(100);
    try testing.expectEqual(@as(usize, 100), mem.context_size());

    // Verify zero-initialization
    for (0..100) |i| {
        try testing.expectEqual(@as(u8, 0), try mem.get_byte(i));
    }

    // Write some data
    try mem.set_data(50, "test");

    // Test shrinking
    try mem.resize_context(60);
    try testing.expectEqual(@as(usize, 60), mem.context_size());

    // Verify data is preserved
    const preserved = try mem.get_slice(50, 4);
    try testing.expectEqualSlices(u8, "test", preserved);

    // Test growth after shrinking
    try mem.resize_context(200);
    try testing.expectEqual(@as(usize, 200), mem.context_size());

    // Verify new area is zero-initialized
    for (60..200) |i| {
        try testing.expectEqual(@as(u8, 0), try mem.get_byte(i));
    }
}

test "Memory limit enforcement" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();
    mem.memory_limit = 1024;

    // Should succeed
    try mem.resize_context(1024);

    // Should fail - exceeds limit
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, mem.resize_context(1025));
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, mem.ensure_context_capacity(2048));

    // Size should remain unchanged
    try testing.expectEqual(@as(usize, 1024), mem.context_size());
}

test "Memory unsafe operations" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Set up some data
    const data = [_]u8{ 0xAA, 0xBB, 0xCC, 0xDD };
    try mem.resize_context(100);

    // Test unsafe set
    mem.set_unsafe(10, &data);

    // Verify with safe read
    const result = try mem.get_slice(10, 4);
    try testing.expectEqualSlices(u8, &data, result);

    // Test unsafe pointers
    const ptr = mem.get_ptr_unsafe(10);
    try testing.expectEqual(@as(u8, 0xAA), ptr[0]);

    const const_ptr = mem.get_const_ptr_unsafe(10);
    try testing.expectEqual(@as(u8, 0xBB), const_ptr[1]);
}

test "Memory snapshot and restore" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Set up initial state
    try mem.set_data(0, "Hello");
    try mem.set_data(100, "World");
    const initial_size = mem.context_size();

    // Create snapshot
    const snap = try mem.snapshot_context(testing.allocator);
    defer testing.allocator.free(snap);

    // Modify memory
    try mem.set_data(0, "Modified");
    try mem.resize_context(200);

    // Restore from snapshot
    try mem.restore_context(snap);

    // Verify restoration
    try testing.expectEqual(initial_size, mem.context_size());
    const hello = try mem.get_slice(0, 5);
    try testing.expectEqualSlices(u8, "Hello", hello);
    const world = try mem.get_slice(100, 5);
    try testing.expectEqualSlices(u8, "World", world);
}

test "Memory hex conversion" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    try mem.set_data(0, &[_]u8{ 0x00, 0x01, 0xAB, 0xCD, 0xEF });

    const hex = try mem.to_hex(testing.allocator);
    defer testing.allocator.free(hex);

    try testing.expectEqualSlices(u8, "0001abcdef", hex);
}

test "Memory word calculation" {
    try testing.expectEqual(@as(usize, 0), calculate_num_words(0));
    try testing.expectEqual(@as(usize, 1), calculate_num_words(1));
    try testing.expectEqual(@as(usize, 1), calculate_num_words(31));
    try testing.expectEqual(@as(usize, 1), calculate_num_words(32));
    try testing.expectEqual(@as(usize, 2), calculate_num_words(33));
    try testing.expectEqual(@as(usize, 2), calculate_num_words(64));
    try testing.expectEqual(@as(usize, 3), calculate_num_words(65));

    // Test numWords method
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    try testing.expectEqual(@as(usize, 1), Memory.calculate_num_words(32));
    try testing.expectEqual(@as(usize, 10), Memory.calculate_num_words(320));
}

test "Memory edge cases and error handling" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Test integer overflow protection
    const max_usize = std.math.maxInt(usize);
    try testing.expectError(Memory.MemoryError.InvalidSize, mem.set_data(max_usize - 5, &[_]u8{ 1, 2, 3, 4, 5, 6 }));
    try testing.expectError(Memory.MemoryError.InvalidSize, mem.copy(max_usize - 5, 0, 10));

    // Test zero-length operations
    try mem.set_data(0, &[_]u8{});
    try mem.set_data_bounded(0, &[_]u8{}, 0, 0);
    try mem.copy(0, 0, 0);

    // Test same source and destination copy
    try mem.set_data(10, "test");
    try mem.copy(10, 10, 4);
    const result = try mem.get_slice(10, 4);
    try testing.expectEqualSlices(u8, "test", result);
}

test "Memory word boundary operations" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Test operations at word boundaries
    try mem.resize_context(96); // 3 words

    // Set data crossing word boundary
    const data = [_]u8{0xFF} ** 40;
    try mem.set_data(28, &data); // Crosses 32-byte boundary

    // Verify data integrity
    const result = try mem.get_slice(28, 40);
    try testing.expectEqualSlices(u8, &data, result);

    // Test word operations at last possible position
    const last_word_offset = mem.context_size() - 32;
    const word = [_]u8{0xAA} ** 32;
    try mem.set_word(last_word_offset, word);

    const read_word = try mem.get_word(last_word_offset);
    try testing.expectEqualSlices(u8, &word, &read_word);
}

test "Memory growth strategy" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Initial capacity should be 4KB
    try testing.expect(mem.total_shared_buffer_capacity() >= 4 * 1024);

    // Test 2x growth
    const initial_cap = mem.total_shared_buffer_capacity();
    try mem.resize_context(initial_cap + 1);

    // Capacity should have doubled
    try testing.expect(mem.total_shared_buffer_capacity() >= initial_cap * 2);
}

test "Memory word alignment behavior" {
    var mem = try Memory.init_default(testing.allocator);
    mem.finalize_root();
    defer mem.deinit();

    // Test exact byte sizing (not word-aligned)
    try mem.resize_context(33);
    try testing.expectEqual(@as(usize, 33), mem.context_size());
    
    // Test ensureCapacity calculates words correctly
    const old_words = calculate_num_words(mem.context_size());
    const new_words = try mem.ensure_context_capacity(65);
    try testing.expectEqual(@as(u64, 3 - old_words), new_words); // 65 bytes = 3 words
    try testing.expectEqual(@as(usize, 65), mem.context_size());
    
    // Test resizeWordAligned for strict word alignment
    try mem.resize_context_word_aligned(100);
    try testing.expectEqual(@as(usize, 128), mem.context_size()); // 100 bytes -> 4 words -> 128 bytes
    
    // Verify word calculation edge cases
    try testing.expectEqual(@as(usize, 1), calculate_num_words(1));   // 1 byte = 1 word
    try testing.expectEqual(@as(usize, 1), calculate_num_words(32));  // 32 bytes = 1 word  
    try testing.expectEqual(@as(usize, 2), calculate_num_words(33));  // 33 bytes = 2 words
    
    // Test memory expansion with exact byte requirements
    var mem2 = try Memory.init_default(testing.allocator);
    mem2.finalize_root();
    defer mem2.deinit();
    
    // Simulate MLOAD at offset 320 with 10 bytes
    const required_size = 320 + 10; // 330 bytes
    _ = try mem2.ensure_context_capacity(required_size);
    try testing.expectEqual(@as(usize, 330), mem2.context_size());
    
    // Gas calculation should be based on words
    const words_for_gas = calculate_num_words(330); // 11 words
    try testing.expectEqual(@as(usize, 11), words_for_gas);
}
