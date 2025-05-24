const std = @import("std");
const testing = std.testing;
const trie_pkg = @import("trie");
const TrieV2 = trie_pkg.trie_v2.TrieV2;

test "TrieV2 - no memory leaks" {
    const allocator = testing.allocator;
    
    var trie = TrieV2.init(allocator);
    defer trie.deinit();
    
    // Test 1: Basic insert and get
    try trie.insert(&[_]u8{1, 2, 3}, "value1");
    try trie.insert(&[_]u8{1, 2, 4}, "value2");
    try trie.insert(&[_]u8{5, 6, 7}, "value3");
    
    const v1 = try trie.get(&[_]u8{1, 2, 3});
    try testing.expect(v1 != null);
    try testing.expectEqualStrings("value1", v1.?);
    
    const v2 = try trie.get(&[_]u8{1, 2, 4});
    try testing.expect(v2 != null);
    try testing.expectEqualStrings("value2", v2.?);
    
    const v3 = try trie.get(&[_]u8{5, 6, 7});
    try testing.expect(v3 != null);
    try testing.expectEqualStrings("value3", v3.?);
}

test "TrieV2 - update existing values" {
    const allocator = testing.allocator;
    
    var trie = TrieV2.init(allocator);
    defer trie.deinit();
    
    // Insert initial value
    try trie.insert(&[_]u8{1, 2, 3}, "initial");
    
    // Update multiple times
    try trie.insert(&[_]u8{1, 2, 3}, "updated1");
    try trie.insert(&[_]u8{1, 2, 3}, "updated2");
    try trie.insert(&[_]u8{1, 2, 3}, "final");
    
    const value = try trie.get(&[_]u8{1, 2, 3});
    try testing.expect(value != null);
    try testing.expectEqualStrings("final", value.?);
}

test "TrieV2 - delete operations" {
    const allocator = testing.allocator;
    
    var trie = TrieV2.init(allocator);
    defer trie.deinit();
    
    // Build a complex trie
    try trie.insert(&[_]u8{1, 2, 3, 4}, "value1");
    try trie.insert(&[_]u8{1, 2, 3, 5}, "value2");
    try trie.insert(&[_]u8{1, 2, 4, 5}, "value3");
    try trie.insert(&[_]u8{1, 3, 4, 5}, "value4");
    
    // Delete some values
    try trie.delete(&[_]u8{1, 2, 3, 4});
    try trie.delete(&[_]u8{1, 2, 3, 5});
    
    // Check deletions
    const d1 = try trie.get(&[_]u8{1, 2, 3, 4});
    try testing.expect(d1 == null);
    
    const d2 = try trie.get(&[_]u8{1, 2, 3, 5});
    try testing.expect(d2 == null);
    
    // Check remaining values
    const r1 = try trie.get(&[_]u8{1, 2, 4, 5});
    try testing.expect(r1 != null);
    try testing.expectEqualStrings("value3", r1.?);
    
    const r2 = try trie.get(&[_]u8{1, 3, 4, 5});
    try testing.expect(r2 != null);
    try testing.expectEqualStrings("value4", r2.?);
}

test "TrieV2 - stress test with many operations" {
    const allocator = testing.allocator;
    
    var trie = TrieV2.init(allocator);
    defer trie.deinit();
    
    // Insert many values
    var i: u32 = 0;
    while (i < 100) : (i += 1) {
        var key = [_]u8{0} ** 4;
        std.mem.writeInt(u32, &key, i, .big);
        
        var value_buf: [32]u8 = undefined;
        const value = try std.fmt.bufPrint(&value_buf, "value_{}", .{i});
        
        try trie.insert(&key, value);
    }
    
    // Verify all values
    i = 0;
    while (i < 100) : (i += 1) {
        var key = [_]u8{0} ** 4;
        std.mem.writeInt(u32, &key, i, .big);
        
        const value = try trie.get(&key);
        try testing.expect(value != null);
        
        var expected_buf: [32]u8 = undefined;
        const expected = try std.fmt.bufPrint(&expected_buf, "value_{}", .{i});
        try testing.expectEqualStrings(expected, value.?);
    }
    
    // Delete half
    i = 0;
    while (i < 50) : (i += 1) {
        var key = [_]u8{0} ** 4;
        std.mem.writeInt(u32, &key, i, .big);
        try trie.delete(&key);
    }
    
    // Verify deletions and remaining
    i = 0;
    while (i < 100) : (i += 1) {
        var key = [_]u8{0} ** 4;
        std.mem.writeInt(u32, &key, i, .big);
        
        const value = try trie.get(&key);
        if (i < 50) {
            try testing.expect(value == null);
        } else {
            try testing.expect(value != null);
            var expected_buf: [32]u8 = undefined;
            const expected = try std.fmt.bufPrint(&expected_buf, "value_{}", .{i});
            try testing.expectEqualStrings(expected, value.?);
        }
    }
}

test "TrieV2 - edge cases" {
    const allocator = testing.allocator;
    
    var trie = TrieV2.init(allocator);
    defer trie.deinit();
    
    // Empty key
    try trie.insert(&[_]u8{}, "empty_key");
    const empty_val = try trie.get(&[_]u8{});
    try testing.expect(empty_val != null);
    try testing.expectEqualStrings("empty_key", empty_val.?);
    
    // Very long key
    const long_key = [_]u8{0xFF} ** 32;
    try trie.insert(&long_key, "long_key_value");
    const long_val = try trie.get(&long_key);
    try testing.expect(long_val != null);
    try testing.expectEqualStrings("long_key_value", long_val.?);
    
    // Delete non-existent
    try trie.delete(&[_]u8{9, 9, 9, 9});
    
    // Get non-existent
    const missing = try trie.get(&[_]u8{9, 9, 9, 9});
    try testing.expect(missing == null);
}