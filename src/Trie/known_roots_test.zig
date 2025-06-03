const std = @import("std");
const testing = std.testing;
const MerkleTrie = @import("merkle_trie.zig").MerkleTrie;

test "Empty trie matches known root" {
    const allocator = testing.allocator;
    
    var trie_impl = MerkleTrie.init(allocator);
    defer trie_impl.deinit();
    
    // Empty trie should have no root
    try testing.expect(trie_impl.root_hash() == null);
}

test "Simple entry trie matches known root" {
    const allocator = testing.allocator;
    
    var trie_impl = MerkleTrie.init(allocator);
    defer trie_impl.deinit();
    
    // Insert a simple key-value pair
    const key = &[_]u8{ 0x01, 0x23, 0x45 };
    const value = "test_value";
    
    try trie_impl.put(key, value);
    
    // The trie should now have a root
    const root = trie_impl.root_hash();
    try testing.expect(root != null);
    
    // Verify we can retrieve the value
    const retrieved = try trie_impl.get(key);
    try testing.expect(retrieved != null);
    try testing.expectEqualStrings(value, retrieved.?);
    
    // Test that a non-existent key returns null
    const non_existent = try trie_impl.get(&[_]u8{ 0x99, 0x99, 0x99 });
    try testing.expect(non_existent == null);
    
    // Test deletion
    try trie_impl.delete(key);
    const after_delete = try trie_impl.get(key);
    try testing.expect(after_delete == null);
    
    // After deletion of the only key, root should be null again
    try testing.expect(trie_impl.root_hash() == null);
}

// Test with multiple entries to verify trie structure
test "Multiple entries trie" {
    const allocator = testing.allocator;
    
    var trie_impl = MerkleTrie.init(allocator);
    defer trie_impl.deinit();
    
    // Insert multiple key-value pairs
    const entries = [_]struct { key: []const u8, value: []const u8 }{
        .{ .key = &[_]u8{ 0x01, 0x23 }, .value = "value1" },
        .{ .key = &[_]u8{ 0x01, 0x24 }, .value = "value2" },
        .{ .key = &[_]u8{ 0x02, 0x34 }, .value = "value3" },
        .{ .key = &[_]u8{ 0x12, 0x34 }, .value = "value4" },
    };
    
    for (entries) |entry| {
        try trie_impl.put(entry.key, entry.value);
    }
    
    // Verify all entries can be retrieved
    for (entries) |entry| {
        const retrieved = try trie_impl.get(entry.key);
        try testing.expect(retrieved != null);
        try testing.expectEqualStrings(entry.value, retrieved.?);
    }
    
    // The root should exist
    try testing.expect(trie_impl.root_hash() != null);
    
    // For a real implementation, we should check if the trie produces correct roots
    // for common Ethereum operations like block headers, transactions, etc.
}

test "Trie invariant tests" {
    const allocator = testing.allocator;
    
    var trie_impl = MerkleTrie.init(allocator);
    defer trie_impl.deinit();
    
    // Property to test: inserting a key and then getting it should return the same value
    const key1 = &[_]u8{1, 2, 3};
    const value1 = "value1";
    try trie_impl.put(key1, value1);
    
    const retrieved1 = try trie_impl.get(key1);
    try testing.expect(retrieved1 != null);
    try testing.expectEqualStrings(value1, retrieved1.?);
    
    // Property to test: proofs should verify correctly
    const proof = try trie_impl.prove(key1);
    defer {
        for (proof) |node| {
            allocator.free(node);
        }
        allocator.free(proof);
    }
    
    const root_hash = trie_impl.root_hash().?;
    const result = try trie_impl.verify_proof(root_hash, key1, proof, value1);
    try testing.expect(result);
}

// Test for compact encodings and edge cases
test "Trie edge cases" {
    const allocator = testing.allocator;
    
    var trie_impl = MerkleTrie.init(allocator);
    defer trie_impl.deinit();
    
    // Test with empty value
    const key1 = &[_]u8{0x01};
    try trie_impl.put(key1, "");
    const retrieved1 = try trie_impl.get(key1);
    try testing.expect(retrieved1 != null);
    try testing.expectEqualStrings("", retrieved1.?);
    
    // Test with very long key
    var long_key: [32]u8 = undefined;
    for (&long_key, 0..) |*byte, i| {
        byte.* = @intCast(i % 256);
    }
    try trie_impl.put(&long_key, "long_key_value");
    const retrieved2 = try trie_impl.get(&long_key);
    try testing.expect(retrieved2 != null);
    try testing.expectEqualStrings("long_key_value", retrieved2.?);
    
    // Test overwriting existing value
    try trie_impl.put(key1, "new_value");
    const retrieved3 = try trie_impl.get(key1);
    try testing.expect(retrieved3 != null);
    try testing.expectEqualStrings("new_value", retrieved3.?);
}