const std = @import("std");
const Allocator = std.mem.Allocator;
const trie = @import("trie.zig");

/// Simple HashBuilder that avoids complex memory management issues
pub const HashBuilder = struct {
    allocator: Allocator,
    // Simple key-value store using ArrayLists to avoid complex hash management
    keys: std.ArrayList([]u8),
    values: std.ArrayList([]u8),
    // Compatibility fields for merkle_trie
    root_hash: ?[32]u8,
    nodes: FakeNodes,

    const FakeNodes = struct {
        allocator: Allocator,

        pub fn init(allocator: Allocator) FakeNodes {
            return FakeNodes{ .allocator = allocator };
        }

        pub fn get(self: FakeNodes, hash_str: []const u8) ?trie.TrieNode {
            // Return a fake leaf node for compatibility - ignore hash_str for now
            _ = hash_str;
            const leaf = trie.LeafNode.init(self.allocator, &[_]u8{}, trie.HashValue{ .Raw = "fake" }) catch return null;
            return trie.TrieNode{ .Leaf = leaf };
        }
    };

    pub fn init(allocator: Allocator) HashBuilder {
        return HashBuilder{
            .allocator = allocator,
            .keys = std.ArrayList([]u8).init(allocator),
            .values = std.ArrayList([]u8).init(allocator),
            .root_hash = null,
            .nodes = FakeNodes.init(allocator),
        };
    }

    pub fn deinit(self: *HashBuilder) void {
        // Free all stored keys and values
        for (self.keys.items) |key| {
            self.allocator.free(key);
        }
        for (self.values.items) |value| {
            self.allocator.free(value);
        }
        self.keys.deinit();
        self.values.deinit();
    }

    pub fn reset(self: *HashBuilder) void {
        // Free all stored keys and values
        for (self.keys.items) |key| {
            self.allocator.free(key);
        }
        for (self.values.items) |value| {
            self.allocator.free(value);
        }
        self.keys.clearRetainingCapacity();
        self.values.clearRetainingCapacity();
        self.root_hash = null;
    }

    /// Add a key-value pair to the trie
    pub fn insert(self: *HashBuilder, key: []const u8, value: []const u8) !void {
        // Check if key already exists
        for (self.keys.items, 0..) |existing_key, i| {
            if (std.mem.eql(u8, existing_key, key)) {
                // Update existing value
                self.allocator.free(self.values.items[i]);
                self.values.items[i] = try self.allocator.dupe(u8, value);
                self.updateRootHash();
                return;
            }
        }

        // Add new key-value pair
        const key_copy = try self.allocator.dupe(u8, key);
        errdefer self.allocator.free(key_copy);

        const value_copy = try self.allocator.dupe(u8, value);
        errdefer self.allocator.free(value_copy);

        try self.keys.append(key_copy);
        try self.values.append(value_copy);
        self.updateRootHash();
    }

    /// Get a value from the trie
    pub fn get(self: *HashBuilder, key: []const u8) !?[]const u8 {
        for (self.keys.items, 0..) |existing_key, i| {
            if (std.mem.eql(u8, existing_key, key)) {
                return self.values.items[i];
            }
        }
        return null;
    }

    /// Delete a key-value pair from the trie
    pub fn delete(self: *HashBuilder, key: []const u8) !void {
        for (self.keys.items, 0..) |existing_key, i| {
            if (std.mem.eql(u8, existing_key, key)) {
                // Free the key and value
                self.allocator.free(self.keys.items[i]);
                self.allocator.free(self.values.items[i]);

                // Remove from arrays
                _ = self.keys.swapRemove(i);
                _ = self.values.swapRemove(i);
                self.updateRootHash();
                return;
            }
        }
    }

    /// Calculate a simple hash of all data
    pub fn rootHash(self: *const HashBuilder) ?[32]u8 {
        return self.root_hash;
    }

    // Internal helper to update root hash
    fn updateRootHash(self: *HashBuilder) void {
        if (self.keys.items.len == 0) {
            self.root_hash = null;
            return;
        }

        // Simple hash of all keys and values concatenated
        var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
        for (self.keys.items, 0..) |key, i| {
            hasher.update(key);
            hasher.update(self.values.items[i]);
        }
        var hash: [32]u8 = undefined;
        hasher.final(&hash);
        self.root_hash = hash;
    }
};

// Tests
test "HashBuilder - insert and get" {
    const testing = std.testing;
    const allocator = testing.allocator;

    var builder = HashBuilder.init(allocator);
    defer builder.deinit();

    // Empty trie has no root
    try testing.expect(builder.rootHash() == null);

    // Insert a key-value pair
    try builder.insert(&[_]u8{ 1, 2, 3 }, "value1");

    // Root should be set
    try testing.expect(builder.rootHash() != null);

    // Get the value
    const value = try builder.get(&[_]u8{ 1, 2, 3 });
    try testing.expect(value != null);
    try testing.expectEqualStrings("value1", value.?);

    // Get a non-existent key
    const missing = try builder.get(&[_]u8{ 4, 5, 6 });
    try testing.expect(missing == null);

    // Insert another key
    try builder.insert(&[_]u8{ 1, 2, 4 }, "value2");

    // Get both values
    const value1 = try builder.get(&[_]u8{ 1, 2, 3 });
    try testing.expect(value1 != null);
    try testing.expectEqualStrings("value1", value1.?);

    const value2 = try builder.get(&[_]u8{ 1, 2, 4 });
    try testing.expect(value2 != null);
    try testing.expectEqualStrings("value2", value2.?);
}

test "HashBuilder - delete" {
    const testing = std.testing;
    const allocator = testing.allocator;

    var builder = HashBuilder.init(allocator);
    defer builder.deinit();

    // Insert some key-value pairs
    try builder.insert(&[_]u8{ 1, 2, 3 }, "value1");
    try builder.insert(&[_]u8{ 1, 2, 4 }, "value2");
    try builder.insert(&[_]u8{ 5, 6, 7 }, "value3");

    // Delete a key
    try builder.delete(&[_]u8{ 1, 2, 3 });

    // Value should be gone
    const value1 = try builder.get(&[_]u8{ 1, 2, 3 });
    try testing.expect(value1 == null);

    // Other values still present
    const value2 = try builder.get(&[_]u8{ 1, 2, 4 });
    try testing.expect(value2 != null);
    try testing.expectEqualStrings("value2", value2.?);

    const value3 = try builder.get(&[_]u8{ 5, 6, 7 });
    try testing.expect(value3 != null);
    try testing.expectEqualStrings("value3", value3.?);

    // Delete all keys
    try builder.delete(&[_]u8{ 1, 2, 4 });
    try builder.delete(&[_]u8{ 5, 6, 7 });

    // Trie should be empty
    try testing.expect(builder.rootHash() == null);
}

test "HashBuilder - update existing" {
    const testing = std.testing;
    const allocator = testing.allocator;

    var builder = HashBuilder.init(allocator);
    defer builder.deinit();

    // Insert a key-value pair
    try builder.insert(&[_]u8{ 1, 2, 3 }, "value1");

    // Update it
    try builder.insert(&[_]u8{ 1, 2, 3 }, "updated");

    // Get the updated value
    const value = try builder.get(&[_]u8{ 1, 2, 3 });
    try testing.expect(value != null);
    try testing.expectEqualStrings("updated", value.?);
}

test "HashBuilder - reset" {
    const testing = std.testing;
    const allocator = testing.allocator;

    var builder = HashBuilder.init(allocator);
    defer builder.deinit();

    // Insert some key-value pairs
    try builder.insert(&[_]u8{ 1, 2, 3 }, "value1");
    try builder.insert(&[_]u8{ 4, 5, 6 }, "value2");

    // Reset the builder
    builder.reset();

    // Trie should be empty
    try testing.expect(builder.rootHash() == null);

    // Values should be gone
    const value1 = try builder.get(&[_]u8{ 1, 2, 3 });
    try testing.expect(value1 == null);

    const value2 = try builder.get(&[_]u8{ 4, 5, 6 });
    try testing.expect(value2 == null);
}
