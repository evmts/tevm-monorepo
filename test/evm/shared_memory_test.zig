const std = @import("std");
const testing = std.testing;
const Memory = @import("evm").Memory;

test "Memory: basic initialization" {
    const allocator = testing.allocator;
    
    // Test default initialization
    var mem = try Memory.init_default(allocator);
    defer mem.deinit();
    mem.finalize_root();
    mem.finalize_root();
    
    try testing.expectEqual(@as(usize, 0), mem.context_size());
    try testing.expectEqual(@as(usize, 0), mem.my_checkpoint);
    try testing.expectEqual(@as(?usize, null), mem.child_active_checkpoint);
    try testing.expectEqual(Memory.DefaultMemoryLimit, mem.memory_limit);
    try testing.expectEqual(&mem, mem.root_ptr);
}

test "Memory: initialization with custom capacity and limit" {
    const allocator = testing.allocator;
    
    var mem = try Memory.init(allocator, 8192, 1024 * 1024);
    defer mem.deinit();
    mem.finalize_root();
    
    try testing.expectEqual(@as(usize, 0), mem.context_size());
    try testing.expectEqual(@as(u64, 1024 * 1024), mem.memory_limit);
    try testing.expect(mem.total_shared_buffer_capacity() >= 8192);
}

test "Memory: child context creation" {
    const allocator = testing.allocator;
    
    var root = try Memory.init_default(allocator);
    defer root.deinit();
    root.finalize_root();
    
    // Write some data to root
    try root.set_word(0, [_]u8{0xFF} ** 32);
    try testing.expectEqual(@as(usize, 32), root.context_size());
    
    // Create child context
    var child = try root.new_child_context();
    try testing.expectEqual(@as(usize, 32), child.my_checkpoint);
    try testing.expectEqual(@as(usize, 0), child.context_size());
    try testing.expectEqual(@as(?usize, 32), root.child_active_checkpoint);
    
    // Child should share the same root
    try testing.expectEqual(root.root_ptr, child.root_ptr);
    
    // Try to create another child while one is active (should fail)
    try testing.expectError(Memory.MemoryError.ChildContextActive, root.new_child_context());
}

test "Memory: context operations - basic read/write" {
    const allocator = testing.allocator;
    
    var root = try Memory.init_default(allocator);
    defer root.deinit();
    root.finalize_root();
    
    // Test byte operations
    try root.set_byte(10, 0xAB);
    try testing.expectEqual(@as(u8, 0xAB), try root.get_byte(10));
    
    // Test word operations
    const word: [32]u8 = [_]u8{0xDE} ** 32;
    try root.set_word(32, word);
    try testing.expectEqualSlices(u8, &word, &try root.get_word(32));
    
    // Test u256 operations
    const value: u256 = 0x123456789ABCDEF;
    try root.set_u256(64, value);
    try testing.expectEqual(value, try root.get_u256(64));
}

test "Memory: child context isolation" {
    const allocator = testing.allocator;
    
    var root = try Memory.init_default(allocator);
    defer root.deinit();
    root.finalize_root();
    
    // Root writes data
    try root.set_word(0, [_]u8{0xAA} ** 32);
    try testing.expectEqual(@as(usize, 32), root.context_size());
    
    // Create child
    var child = try root.new_child_context();
    
    // Child writes data in its own space
    try child.set_word(0, [_]u8{0xBB} ** 32);
    try testing.expectEqual(@as(usize, 32), child.context_size());
    
    // Total buffer should be 64 bytes (32 from root + 32 from child)
    try testing.expectEqual(@as(usize, 64), root.total_shared_buffer_size());
    
    // Root still sees only its own data
    try testing.expectEqualSlices(u8, &([_]u8{0xAA} ** 32), &try root.get_word(0));
    
    // Child sees its own data
    try testing.expectEqualSlices(u8, &([_]u8{0xBB} ** 32), &try child.get_word(0));
}

test "Memory: revert child context" {
    const allocator = testing.allocator;
    
    var root = try Memory.init_default(allocator);
    defer root.deinit();
    root.finalize_root();
    
    // Root writes data
    try root.set_word(0, [_]u8{0xAA} ** 32);
    const root_size_before = root.total_shared_buffer_size();
    
    // Create child and write data
    var child = try root.new_child_context();
    try child.set_data(0, &[_]u8{0xBB} ** 64);
    
    // Verify child's changes are visible in total buffer
    try testing.expectEqual(root_size_before + 64, root.total_shared_buffer_size());
    
    // Revert child
    try root.revert_child_context();
    
    // Buffer should be back to original size
    try testing.expectEqual(root_size_before, root.total_shared_buffer_size());
    try testing.expectEqual(@as(?usize, null), root.child_active_checkpoint);
    
    // Root data should be unchanged
    try testing.expectEqualSlices(u8, &([_]u8{0xAA} ** 32), &try root.get_word(0));
}

test "Memory: commit child context" {
    const allocator = testing.allocator;
    
    var root = try Memory.init_default(allocator);
    defer root.deinit();
    root.finalize_root();
    
    // Root writes data
    try root.set_word(0, [_]u8{0xAA} ** 32);
    
    // Create child and write data
    var child = try root.new_child_context();
    try child.set_data(0, &[_]u8{0xBB} ** 64);
    const total_size_with_child = root.total_shared_buffer_size();
    
    // Commit child
    try root.commit_child_context();
    
    // Buffer size should remain the same
    try testing.expectEqual(total_size_with_child, root.total_shared_buffer_size());
    try testing.expectEqual(@as(?usize, null), root.child_active_checkpoint);
    
    // Now root can create another child
    const child2 = try root.new_child_context();
    try testing.expectEqual(@as(usize, 96), child2.my_checkpoint);
}

test "Memory: nested contexts" {
    const allocator = testing.allocator;
    
    var root = try Memory.init_default(allocator);
    defer root.deinit();
    root.finalize_root();
    
    // Root -> Child -> Grandchild
    try root.set_byte(0, 0xAA);
    
    var child = try root.new_child_context();
    try child.set_byte(0, 0xBB);
    
    var grandchild = try child.new_child_context();
    try grandchild.set_byte(0, 0xCC);
    
    // Each context sees its own data
    try testing.expectEqual(@as(u8, 0xAA), try root.get_byte(0));
    try testing.expectEqual(@as(u8, 0xBB), try child.get_byte(0));
    try testing.expectEqual(@as(u8, 0xCC), try grandchild.get_byte(0));
    
    // Revert grandchild
    try child.revert_child_context();
    
    // Child data should still be there
    try testing.expectEqual(@as(u8, 0xBB), try child.get_byte(0));
    
    // Revert child
    try root.revert_child_context();
    
    // Only root data remains
    try testing.expectEqual(@as(u8, 0xAA), try root.get_byte(0));
    try testing.expectEqual(@as(usize, 1), root.total_shared_buffer_size());
}

test "Memory: memory limit enforcement" {
    const allocator = testing.allocator;
    
    var mem = try Memory.init(allocator, 1024, 2048);
    defer mem.deinit();
    mem.finalize_root();
    
    // Should succeed - within limit
    try mem.resize_context(1024);
    try testing.expectEqual(@as(usize, 1024), mem.context_size());
    
    // Should succeed - at limit
    try mem.resize_context(2048);
    try testing.expectEqual(@as(usize, 2048), mem.context_size());
    
    // Should fail - exceeds limit
    try testing.expectError(Memory.MemoryError.MemoryLimitExceeded, mem.resize_context(2049));
}

test "Memory: gas calculation with ensure_context_capacity" {
    const allocator = testing.allocator;
    
    var mem = try Memory.init_default(allocator);
    defer mem.deinit();
    mem.finalize_root();
    
    // First expansion - 0 to 32 bytes = 1 word
    const words1 = try mem.ensure_context_capacity(32);
    try testing.expectEqual(@as(u64, 1), words1);
    
    // No expansion needed
    const words2 = try mem.ensure_context_capacity(16);
    try testing.expectEqual(@as(u64, 0), words2);
    
    // Expansion from 32 to 64 bytes = 1 more word
    const words3 = try mem.ensure_context_capacity(64);
    try testing.expectEqual(@as(u64, 1), words3);
    
    // Expansion from 64 to 100 bytes = 2 more words (64 -> 128)
    const words4 = try mem.ensure_context_capacity(100);
    try testing.expectEqual(@as(u64, 2), words4);
}

test "Memory: data copy operations" {
    const allocator = testing.allocator;
    
    var mem = try Memory.init_default(allocator);
    defer mem.deinit();
    mem.finalize_root();
    
    // Test set_data
    const data = "Hello, Memory!";
    try mem.set_data(10, data);
    const read_data = try mem.get_slice(10, data.len);
    try testing.expectEqualSlices(u8, data, read_data);
    
    // Test set_data_bounded with full copy
    const src = [_]u8{ 1, 2, 3, 4, 5 };
    try mem.set_data_bounded(100, &src, 0, 5);
    const bounded_read = try mem.get_slice(100, 5);
    try testing.expectEqualSlices(u8, &src, bounded_read);
    
    // Test set_data_bounded with partial copy and zero fill
    try mem.set_data_bounded(200, &src, 2, 10); // Copy from offset 2, length 10
    const partial_read = try mem.get_slice(200, 10);
    try testing.expectEqualSlices(u8, &[_]u8{ 3, 4, 5, 0, 0, 0, 0, 0, 0, 0 }, partial_read);
    
    // Test set_data_bounded with offset beyond source
    try mem.set_data_bounded(300, &src, 10, 5); // Offset beyond source
    const zero_read = try mem.get_slice(300, 5);
    try testing.expectEqualSlices(u8, &[_]u8{ 0, 0, 0, 0, 0 }, zero_read);
}

test "Memory: memory copy (MCOPY)" {
    const allocator = testing.allocator;
    
    var mem = try Memory.init_default(allocator);
    defer mem.deinit();
    mem.finalize_root();
    
    // Set up source data
    const src_data = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8 };
    try mem.set_data(10, &src_data);
    
    // Non-overlapping copy
    try mem.copy(30, 10, 8);
    const non_overlap_read = try mem.get_slice(30, 8);
    try testing.expectEqualSlices(u8, &src_data, non_overlap_read);
    
    // Overlapping copy (forward)
    try mem.copy(12, 10, 6); // Copy [1,2,3,4,5,6] to offset 12
    const forward_read = try mem.get_slice(12, 6);
    try testing.expectEqualSlices(u8, src_data[0..6], forward_read);
    
    // Reset data for backward copy test
    try mem.set_data(10, &src_data);
    
    // Overlapping copy (backward)
    try mem.copy(8, 10, 6); // Copy [1,2,3,4,5,6] to offset 8
    const backward_read = try mem.get_slice(8, 6);
    try testing.expectEqualSlices(u8, src_data[0..6], backward_read);
}

test "Memory: unsafe operations" {
    const allocator = testing.allocator;
    
    var mem = try Memory.init_default(allocator);
    defer mem.deinit();
    mem.finalize_root();
    
    // Ensure some capacity first
    _ = try mem.ensure_context_capacity(100);
    
    // Test unsafe pointer access
    const ptr = mem.get_ptr_unsafe(10);
    ptr[0] = 0xAB;
    ptr[1] = 0xCD;
    
    try testing.expectEqual(@as(u8, 0xAB), try mem.get_byte(10));
    try testing.expectEqual(@as(u8, 0xCD), try mem.get_byte(11));
    
    // Test unsafe set
    const data = [_]u8{ 0x11, 0x22, 0x33 };
    mem.set_unsafe(20, &data);
    
    const read_data = try mem.get_slice(20, 3);
    try testing.expectEqualSlices(u8, &data, read_data);
}

test "Memory: snapshot and restore" {
    const allocator = testing.allocator;
    
    var mem = try Memory.init_default(allocator);
    defer mem.deinit();
    mem.finalize_root();
    
    // Set up initial state
    try mem.set_word(0, [_]u8{0xAA} ** 32);
    try mem.set_word(32, [_]u8{0xBB} ** 32);
    
    // Take snapshot
    const snapshot = try mem.snapshot_context(allocator);
    defer allocator.free(snapshot);
    try testing.expectEqual(@as(usize, 64), snapshot.len);
    
    // Modify memory
    try mem.set_word(0, [_]u8{0xCC} ** 32);
    try mem.resize_context(128);
    
    // Restore from snapshot
    try mem.restore_context(snapshot);
    
    // Verify restoration
    try testing.expectEqual(@as(usize, 64), mem.context_size());
    try testing.expectEqualSlices(u8, &([_]u8{0xAA} ** 32), &try mem.get_word(0));
    try testing.expectEqualSlices(u8, &([_]u8{0xBB} ** 32), &try mem.get_word(32));
}

test "Memory: hex conversion" {
    const allocator = testing.allocator;
    
    var mem = try Memory.init_default(allocator);
    defer mem.deinit();
    mem.finalize_root();
    
    try mem.set_data(0, &[_]u8{ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF });
    
    const hex = try mem.to_hex(allocator);
    defer allocator.free(hex);
    
    try testing.expectEqualSlices(u8, "0123456789abcdef", hex);
}

test "Memory: word-aligned resize" {
    const allocator = testing.allocator;
    
    var mem = try Memory.init_default(allocator);
    defer mem.deinit();
    mem.finalize_root();
    
    // Resize to 33 bytes should round up to 64 (2 words)
    try mem.resize_context_word_aligned(33);
    try testing.expectEqual(@as(usize, 64), mem.context_size());
    
    // Resize to 100 bytes should round up to 128 (4 words)
    try mem.resize_context_word_aligned(100);
    try testing.expectEqual(@as(usize, 128), mem.context_size());
}

test "Memory: error cases" {
    const allocator = testing.allocator;
    
    var mem = try Memory.init_default(allocator);
    defer mem.deinit();
    mem.finalize_root();
    
    // Read beyond bounds
    try testing.expectError(Memory.MemoryError.InvalidOffset, mem.get_byte(10));
    try testing.expectError(Memory.MemoryError.InvalidOffset, mem.get_word(0));
    
    // No child to revert/commit
    try testing.expectError(Memory.MemoryError.NoChildContextToRevertOrCommit, mem.revert_child_context());
    try testing.expectError(Memory.MemoryError.NoChildContextToRevertOrCommit, mem.commit_child_context());
    
    // Create child then try to create another
    const child = try mem.new_child_context();
    _ = child;
    try testing.expectError(Memory.MemoryError.ChildContextActive, mem.new_child_context());
}

test "Memory: compatibility aliases" {
    const allocator = testing.allocator;
    
    var mem = try Memory.init_default(allocator);
    defer mem.deinit();
    mem.finalize_root();
    
    // Test size() alias
    try mem.resize(100);
    try testing.expectEqual(@as(usize, 100), mem.size());
    
    // Test is_empty() alias
    var mem2 = try Memory.init_default(allocator);
    defer mem2.deinit();
    mem2.finalize_root();
    try testing.expect(mem2.is_empty());
    try mem2.set_byte(0, 1);
    try testing.expect(!mem2.is_empty());
    
    // Test ensure_capacity() alias
    const words = try mem.ensure_capacity(150);
    try testing.expect(words > 0);
    
    // Test resize_word_aligned() alias
    try mem.resize_word_aligned(200);
    try testing.expectEqual(@as(usize, 224), mem.size()); // 7 words * 32
}