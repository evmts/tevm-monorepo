const std = @import("std");
const testing = std.testing;
const ArenaMemory = @import("evm").ArenaMemory;

test "ArenaMemory: initialization and basic operations" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
    defer mem.deinit();
    
    try testing.expect(mem.context_is_empty());
    try testing.expectEqual(@as(usize, 0), mem.context_size());
}

test "ArenaMemory: byte operations" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
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
    try testing.expectError(ArenaMemory.MemoryError.InvalidOffset, mem.get_byte(11));
}

test "ArenaMemory: word operations" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
    defer mem.deinit();
    
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
}

test "ArenaMemory: context push/pop/commit" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
    defer mem.deinit();
    
    // Set initial data in root context
    try mem.set_data(0, "root data");
    const root_size = mem.context_size();
    
    // Push child context
    try mem.push_context();
    try testing.expectEqual(@as(usize, 0), mem.context_size()); // Child starts empty
    
    // Modify in child
    try mem.set_data(0, "child data is longer");
    const child_size = mem.context_size();
    try testing.expect(child_size > root_size);
    
    // Test revert
    try mem.pop_context();
    try testing.expectEqual(root_size, mem.context_size());
    const root_data = try mem.get_slice(0, 9);
    try testing.expectEqualSlices(u8, "root data", root_data);
    
    // Test commit
    try mem.push_context();
    try mem.set_data(0, "committed child data");
    try mem.commit_context();
    
    // Parent should now have child's data
    const committed_data = try mem.get_slice(0, 20);
    try testing.expectEqualSlices(u8, "committed child data", committed_data);
}

test "ArenaMemory: nested contexts" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
    defer mem.deinit();
    
    // Root context
    try mem.set_data(0, "level0");
    
    // Push first child
    try mem.push_context();
    try mem.set_data(0, "level1");
    
    // Push grandchild
    try mem.push_context();
    try mem.set_data(0, "level2");
    
    // Verify grandchild data
    const level2_data = try mem.get_slice(0, 6);
    try testing.expectEqualSlices(u8, "level2", level2_data);
    
    // Pop grandchild
    try mem.pop_context();
    const level1_data = try mem.get_slice(0, 6);
    try testing.expectEqualSlices(u8, "level1", level1_data);
    
    // Pop child
    try mem.pop_context();
    const level0_data = try mem.get_slice(0, 6);
    try testing.expectEqualSlices(u8, "level0", level0_data);
}

test "ArenaMemory: memory limit enforcement" {
    var mem = try ArenaMemory.init(testing.allocator, 1024); // 1KB limit
    defer mem.deinit();
    
    // Should succeed
    try mem.resize_context(1024);
    
    // Should fail - exceeds limit
    try testing.expectError(ArenaMemory.MemoryError.MemoryLimitExceeded, mem.resize_context(1025));
    
    // Size should remain unchanged
    try testing.expectEqual(@as(usize, 1024), mem.context_size());
}

test "ArenaMemory: U256 operations" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
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
}

test "ArenaMemory: copy operations" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
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
}

test "ArenaMemory: set_data_bounded" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
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
}

test "ArenaMemory: gas calculation" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
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

test "ArenaMemory: hex conversion" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
    defer mem.deinit();
    
    try mem.set_data(0, &[_]u8{ 0x00, 0x01, 0xAB, 0xCD, 0xEF });
    
    const hex = try mem.to_hex(testing.allocator);
    defer testing.allocator.free(hex);
    
    try testing.expectEqualSlices(u8, "0001abcdef", hex);
}

test "ArenaMemory: no memory leaks with nested contexts" {
    // This test verifies that memory is properly cleaned up
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
    defer mem.deinit();
    
    // Create many nested contexts
    for (0..100) |i| {
        try mem.push_context();
        
        // Allocate some memory in each context
        const data = try testing.allocator.alloc(u8, 1024);
        defer testing.allocator.free(data);
        for (data, 0..) |*byte, j| {
            byte.* = @truncate(i + j);
        }
        
        try mem.set_data(0, data);
    }
    
    // Pop all contexts
    for (0..100) |_| {
        try mem.pop_context();
    }
    
    // Should be back to empty root
    try testing.expectEqual(@as(usize, 0), mem.context_size());
}

test "ArenaMemory: commit chain" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
    defer mem.deinit();
    
    // Create chain: root -> child1 -> child2
    try mem.set_data(0, "root");
    
    try mem.push_context();
    try mem.set_data(0, "child1 data");
    
    try mem.push_context();
    try mem.set_data(0, "child2 data longer");
    
    // Commit child2 to child1
    try mem.commit_context();
    
    // child1 should now have child2's data
    const child1_data = try mem.get_slice(0, 18);
    try testing.expectEqualSlices(u8, "child2 data longer", child1_data);
    
    // Commit child1 to root
    try mem.commit_context();
    
    // root should now have the full data
    const root_data = try mem.get_slice(0, 18);
    try testing.expectEqualSlices(u8, "child2 data longer", root_data);
}

test "ArenaMemory: edge cases" {
    var mem = try ArenaMemory.init(testing.allocator, ArenaMemory.DefaultMemoryLimit);
    defer mem.deinit();
    
    // Test zero-length operations
    try mem.set_data(0, &[_]u8{});
    try mem.copy(0, 0, 0);
    try mem.set_data_bounded(0, &[_]u8{}, 0, 0);
    
    // Test same source and destination copy
    try mem.set_data(10, "test");
    try mem.copy(10, 10, 4);
    const result = try mem.get_slice(10, 4);
    try testing.expectEqualSlices(u8, "test", result);
    
    // Test pop on root (should fail)
    try testing.expectError(ArenaMemory.MemoryError.NoActiveContext, mem.pop_context());
}