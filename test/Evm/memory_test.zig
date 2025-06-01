const std = @import("std");
const evm = @import("evm");
const Memory = evm.Memory;
const testing = std.testing;

pub fn calculateNumWords(len: usize) usize {
    return (len + 31) / 32;
}

// Test basic functionality
test "Memory initialization and basic operations" {
    // Test init with default capacity
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    try testing.expect(mem.isEmpty());
    try testing.expectEqual(@as(usize, 0), mem.size());

    // Test custom capacity
    var mem2 = try Memory.initWithCapacity(testing.allocator, 8192);
    defer mem2.deinit();

    try testing.expect(mem2.isEmpty());

    // Test with custom memory limit
    var mem3 = try Memory.init(testing.allocator);
    defer mem3.deinit();
    mem3.memory_limit = 1024;

    try testing.expectEqual(@as(u64, 1024), mem3.memory_limit);
}

test "Memory byte operations" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    // Test setByte and getByte
    try mem.setByte(10, 0xAB);
    try testing.expectEqual(@as(usize, 11), mem.size());
    try testing.expectEqual(@as(u8, 0xAB), try mem.getByte(10));

    // Verify zero-initialization
    for (0..10) |i| {
        try testing.expectEqual(@as(u8, 0), try mem.getByte(i));
    }

    // Test out of bounds
    try testing.expectError(Memory.Error.InvalidOffset, mem.getByte(11));
}

test "Memory word operations" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    // Test setWord and getWord
    const word = [32]u8{
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
        0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20,
    };

    try mem.setWord(64, word);
    try testing.expectEqual(@as(usize, 96), mem.size());

    const read_word = try mem.getWord(64);
    try testing.expectEqualSlices(u8, &word, &read_word);

    // Test word at boundary
    try mem.setWord(mem.size() - 32, word);
    const boundary_word = try mem.getWord(mem.size() - 32);
    try testing.expectEqualSlices(u8, &word, &boundary_word);
}

test "Memory U256 operations" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    // Test small value
    const val1: u256 = 0x1234567890ABCDEF;
    try mem.setU256(0, val1);
    const read_val1 = try mem.getU256(0);
    try testing.expectEqual(val1, read_val1);

    // Test max value
    const val2: u256 = std.math.maxInt(u256);
    try mem.setU256(32, val2);
    const read_val2 = try mem.getU256(32);
    try testing.expectEqual(val2, read_val2);

    // Test zero
    try mem.setU256(64, 0);
    const read_val3 = try mem.getU256(64);
    try testing.expectEqual(@as(u256, 0), read_val3);
}

test "Memory slice operations" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    // Test setData and getSlice
    const data = "Hello, EVM Memory!";
    try mem.setData(100, data);

    const slice = try mem.getSlice(100, data.len);
    try testing.expectEqualSlices(u8, data, slice);

    // Test empty slice
    const empty = try mem.getSlice(0, 0);
    try testing.expectEqual(@as(usize, 0), empty.len);

    // Test out of bounds
    try testing.expectError(Memory.Error.InvalidOffset, mem.getSlice(mem.size(), 1));
}

test "Memory setDataBounded" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    const data = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8 };

    // Test normal copy
    try mem.setDataBounded(10, &data, 2, 4);
    const result1 = try mem.getSlice(10, 4);
    try testing.expectEqualSlices(u8, data[2..6], result1);

    // Test source offset beyond data (should zero-fill)
    try mem.setDataBounded(20, &data, 10, 4);
    const result2 = try mem.getSlice(20, 4);
    for (result2) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }

    // Test partial copy with zero-fill
    try mem.setDataBounded(30, &data, 6, 4);
    const result3 = try mem.getSlice(30, 4);
    try testing.expectEqual(@as(u8, 7), result3[0]);
    try testing.expectEqual(@as(u8, 8), result3[1]);
    try testing.expectEqual(@as(u8, 0), result3[2]);
    try testing.expectEqual(@as(u8, 0), result3[3]);
}

test "Memory copy operations" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    const data = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
    try mem.setData(0, &data);

    // Test non-overlapping copy
    try mem.copy(20, 0, 10);
    const result1 = try mem.getSlice(20, 10);
    try testing.expectEqualSlices(u8, &data, result1);

    // Test overlapping copy (forward)
    try mem.copy(2, 0, 8);
    const expected_forward = [_]u8{ 1, 2, 1, 2, 3, 4, 5, 6, 7, 8 };
    const result2 = try mem.getSlice(0, 10);
    try testing.expectEqualSlices(u8, &expected_forward, result2);

    // Reset data
    try mem.setData(0, &data);

    // Test overlapping copy (backward)
    try mem.copy(0, 2, 8);
    const expected_backward = [_]u8{ 3, 4, 5, 6, 7, 8, 9, 10, 9, 10 };
    const result3 = try mem.getSlice(0, 10);
    try testing.expectEqualSlices(u8, &expected_backward, result3);

    // Test zero-length copy
    try mem.copy(50, 0, 0);
}

test "Memory expansion and gas calculation" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    // Test ensureCapacity
    const new_words1 = try mem.ensureCapacity(100);
    try testing.expectEqual(@as(u64, 4), new_words1); // ceil(100/32) = 4 words
    try testing.expect(mem.size() >= 100);

    // Test no expansion needed
    const new_words2 = try mem.ensureCapacity(50);
    try testing.expectEqual(@as(u64, 0), new_words2);

    // Test large expansion
    const new_words3 = try mem.ensureCapacity(1024);
    try testing.expectEqual(@as(u64, 28), new_words3); // 32 - 4 = 28 new words
}

test "Memory resize behavior" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    // Test growth
    try mem.resize(100);
    try testing.expectEqual(@as(usize, 100), mem.size());

    // Verify zero-initialization
    for (0..100) |i| {
        try testing.expectEqual(@as(u8, 0), try mem.getByte(i));
    }

    // Write some data
    try mem.setData(50, "test");

    // Test shrinking
    try mem.resize(60);
    try testing.expectEqual(@as(usize, 60), mem.size());

    // Verify data is preserved
    const preserved = try mem.getSlice(50, 4);
    try testing.expectEqualSlices(u8, "test", preserved);

    // Test growth after shrinking
    try mem.resize(200);
    try testing.expectEqual(@as(usize, 200), mem.size());

    // Verify new area is zero-initialized
    for (60..200) |i| {
        try testing.expectEqual(@as(u8, 0), try mem.getByte(i));
    }
}

test "Memory limit enforcement" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();
    mem.memory_limit = 1024;

    // Should succeed
    try mem.resize(1024);

    // Should fail - exceeds limit
    try testing.expectError(Memory.Error.MemoryLimitExceeded, mem.resize(1025));
    try testing.expectError(Memory.Error.MemoryLimitExceeded, mem.ensureCapacity(2048));

    // Size should remain unchanged
    try testing.expectEqual(@as(usize, 1024), mem.size());
}

test "Memory unsafe operations" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    // Set up some data
    const data = [_]u8{ 0xAA, 0xBB, 0xCC, 0xDD };
    try mem.resize(100);

    // Test unsafe set
    mem.setUnsafe(10, &data);

    // Verify with safe read
    const result = try mem.getSlice(10, 4);
    try testing.expectEqualSlices(u8, &data, result);

    // Test unsafe pointers
    const ptr = mem.getPtrUnsafe(10);
    try testing.expectEqual(@as(u8, 0xAA), ptr[0]);

    const const_ptr = mem.getConstPtrUnsafe(10);
    try testing.expectEqual(@as(u8, 0xBB), const_ptr[1]);
}

test "Memory snapshot and restore" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    // Set up initial state
    try mem.setData(0, "Hello");
    try mem.setData(100, "World");
    const initial_size = mem.size();

    // Create snapshot
    const snap = try mem.snapshot(testing.allocator);
    defer testing.allocator.free(snap);

    // Modify memory
    try mem.setData(0, "Modified");
    try mem.resize(200);

    // Restore from snapshot
    try mem.restore(snap);

    // Verify restoration
    try testing.expectEqual(initial_size, mem.size());
    const hello = try mem.getSlice(0, 5);
    try testing.expectEqualSlices(u8, "Hello", hello);
    const world = try mem.getSlice(100, 5);
    try testing.expectEqualSlices(u8, "World", world);
}

test "Memory hex conversion" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    try mem.setData(0, &[_]u8{ 0x00, 0x01, 0xAB, 0xCD, 0xEF });

    const hex = try mem.toHex(testing.allocator);
    defer testing.allocator.free(hex);

    try testing.expectEqualSlices(u8, "0001abcdef", hex);
}

test "Memory word calculation" {
    try testing.expectEqual(@as(usize, 0), calculateNumWords(0));
    try testing.expectEqual(@as(usize, 1), calculateNumWords(1));
    try testing.expectEqual(@as(usize, 1), calculateNumWords(31));
    try testing.expectEqual(@as(usize, 1), calculateNumWords(32));
    try testing.expectEqual(@as(usize, 2), calculateNumWords(33));
    try testing.expectEqual(@as(usize, 2), calculateNumWords(64));
    try testing.expectEqual(@as(usize, 3), calculateNumWords(65));

    // Test numWords method
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    try testing.expectEqual(@as(usize, 1), Memory.numWords(32));
    try testing.expectEqual(@as(usize, 10), Memory.numWords(320));
}

test "Memory edge cases and error handling" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    // Test integer overflow protection
    const max_usize = std.math.maxInt(usize);
    try testing.expectError(Memory.Error.InvalidSize, mem.setData(max_usize - 5, &[_]u8{ 1, 2, 3, 4, 5, 6 }));
    try testing.expectError(Memory.Error.InvalidSize, mem.copy(max_usize - 5, 0, 10));

    // Test zero-length operations
    try mem.setData(0, &[_]u8{});
    try mem.setDataBounded(0, &[_]u8{}, 0, 0);
    try mem.copy(0, 0, 0);

    // Test same source and destination copy
    try mem.setData(10, "test");
    try mem.copy(10, 10, 4);
    const result = try mem.getSlice(10, 4);
    try testing.expectEqualSlices(u8, "test", result);
}

test "Memory word boundary operations" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    // Test operations at word boundaries
    try mem.resize(96); // 3 words

    // Set data crossing word boundary
    const data = [_]u8{0xFF} ** 40;
    try mem.setData(28, &data); // Crosses 32-byte boundary

    // Verify data integrity
    const result = try mem.getSlice(28, 40);
    try testing.expectEqualSlices(u8, &data, result);

    // Test word operations at last possible position
    const last_word_offset = mem.size() - 32;
    const word = [_]u8{0xAA} ** 32;
    try mem.setWord(last_word_offset, word);

    const read_word = try mem.getWord(last_word_offset);
    try testing.expectEqualSlices(u8, &word, &read_word);
}

test "Memory growth strategy" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    // Initial capacity should be 4KB
    try testing.expect(mem.buffer.capacity >= 4 * 1024);

    // Test 2x growth
    const initial_cap = mem.buffer.capacity;
    try mem.resize(initial_cap + 1);

    // Capacity should have doubled
    try testing.expect(mem.buffer.capacity >= initial_cap * 2);
}

test "Memory word alignment behavior" {
    var mem = try Memory.init(testing.allocator);
    defer mem.deinit();

    // Test exact byte sizing (not word-aligned)
    try mem.resize(33);
    try testing.expectEqual(@as(usize, 33), mem.size());
    
    // Test ensureCapacity calculates words correctly
    const old_words = calculateNumWords(mem.size());
    const new_words = try mem.ensureCapacity(65);
    try testing.expectEqual(@as(u64, 3 - old_words), new_words); // 65 bytes = 3 words
    try testing.expectEqual(@as(usize, 65), mem.size());
    
    // Test resizeWordAligned for strict word alignment
    try mem.resizeWordAligned(100);
    try testing.expectEqual(@as(usize, 128), mem.size()); // 100 bytes -> 4 words -> 128 bytes
    
    // Verify word calculation edge cases
    try testing.expectEqual(@as(usize, 1), calculateNumWords(1));   // 1 byte = 1 word
    try testing.expectEqual(@as(usize, 1), calculateNumWords(32));  // 32 bytes = 1 word  
    try testing.expectEqual(@as(usize, 2), calculateNumWords(33));  // 33 bytes = 2 words
    
    // Test memory expansion with exact byte requirements
    var mem2 = try Memory.init(testing.allocator);
    defer mem2.deinit();
    
    // Simulate MLOAD at offset 320 with 10 bytes
    const required_size = 320 + 10; // 330 bytes
    _ = try mem2.ensureCapacity(required_size);
    try testing.expectEqual(@as(usize, 330), mem2.size());
    
    // Gas calculation should be based on words
    const words_for_gas = calculateNumWords(330); // 11 words
    try testing.expectEqual(@as(usize, 11), words_for_gas);
}
