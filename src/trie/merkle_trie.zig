const std = @import("std");
const Allocator = std.mem.Allocator;
const trie = @import("trie.zig");
const hash_builder = @import("hash_builder_complete.zig");
const proof_module = @import("proof.zig");
const rlp = @import("Rlp");
const utils = @import("utils");

const TrieNode = trie.TrieNode;
const HashValue = trie.HashValue;
const HashBuilder = hash_builder.HashBuilder;
const ProofNodes = proof_module.ProofNodes;
const ProofRetainer = proof_module.ProofRetainer;
const TrieError = trie.TrieError;

/// The main Merkle Patricia Trie implementation exposed to users
pub const MerkleTrie = struct {
    allocator: Allocator,
    builder: HashBuilder,

    pub fn init(allocator: Allocator) MerkleTrie {
        return MerkleTrie{
            .allocator = allocator,
            .builder = HashBuilder.init(allocator),
        };
    }

    pub fn deinit(self: *MerkleTrie) void {
        self.builder.deinit();
    }

    /// Get a value from the trie
    pub fn get(self: *MerkleTrie, key: []const u8) !?[]const u8 {
        return try self.builder.get(key);
    }

    /// Put a key-value pair into the trie
    pub fn put(self: *MerkleTrie, key: []const u8, value: []const u8) !void {
        return try self.builder.insert(key, value);
    }

    /// Delete a key-value pair from the trie
    pub fn delete(self: *MerkleTrie, key: []const u8) !void {
        return try self.builder.delete(key);
    }

    /// Get the root hash of the trie
    pub fn root_hash(self: *const MerkleTrie) ?[32]u8 {
        return self.builder.root_hash;
    }

    /// Generate a Merkle proof for a key
    pub fn prove(self: *const MerkleTrie, key: []const u8) ![]const []const u8 {
        // Create a proof retainer for the key
        var retainer = try ProofRetainer.init(self.allocator, key);
        defer retainer.deinit();

        // Get the root hash
        const root = self.builder.root_hash orelse return &[_][]const u8{};

        // Get the root node
        const root_hash_str = try bytes_to_hex_string(self.allocator, &root);
        defer self.allocator.free(root_hash_str);

        const root_node = self.builder.nodes.get(root_hash_str) orelse return TrieError.NonExistentNode;

        // Generate the proof by collecting nodes along the path
        _ = try self.collect_proof_nodes(&retainer, root_node, &[_]u8{});

        // Get the proof as a list of RLP-encoded nodes
        return try retainer.get_proof().to_node_list(self.allocator);
    }

    /// Verify a Merkle proof
    pub fn verify_proof(self: *const MerkleTrie, expected_root_hash: [32]u8, key: []const u8, proof_nodes: []const []const u8, expected_value: ?[]const u8) !bool {
        // Create a proof nodes collection
        var proof = ProofNodes.init(self.allocator);
        defer proof.deinit();

        // Add all proof nodes
        for (proof_nodes) |node_data| {
            var hash: [32]u8 = undefined;
            std.crypto.hash.sha3.Keccak256.hash(node_data, &hash, .{});
            try proof.add_node(hash, node_data);
        }

        // Verify the proof
        return try proof.verify(self.allocator, expected_root_hash, key, expected_value);
    }

    /// Reset the trie to an empty state
    pub fn clear(self: *MerkleTrie) void {
        self.builder.reset();
    }

    // Internal methods

    /// Recursively collect nodes for a proof
    fn collect_proof_nodes(self: *const MerkleTrie, retainer: *ProofRetainer, node: TrieNode, path_prefix: []const u8) !bool {
        // Add this node to the proof if it's on the key path
        const on_path = try retainer.collect_node(node, path_prefix);
        if (!on_path) return false; // Not on path, stop recursion

        // Continue recursion based on node type
        switch (node) {
            .Empty => return true, // End of path
            .Leaf => {
                // Leaf node is terminal, no further recursion needed
                return true;
            },
            .Extension => |extension| {
                // Follow the extension
                const new_prefix = try self.allocator.alloc(u8, path_prefix.len + extension.nibbles.len);
                defer self.allocator.free(new_prefix);

                @memcpy(new_prefix[0..path_prefix.len], path_prefix);
                @memcpy(new_prefix[path_prefix.len..], extension.nibbles);

                // Get the next node
                switch (extension.next) {
                    .Raw => |_| {
                        // Should not happen in a well-formed trie
                        return TrieError.InvalidNode;
                    },
                    .Hash => |hash| {
                        const hash_str = try bytes_to_hex_string(self.allocator, &hash);
                        defer self.allocator.free(hash_str);

                        const next_node = self.builder.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                        return try self.collect_proof_nodes(retainer, next_node, new_prefix);
                    },
                }
            },
            .Branch => |branch| {
                // Find which branch matches the key path
                const key_nibbles = retainer.key_nibbles;
                if (path_prefix.len >= key_nibbles.len) {
                    // We've reached the end of the key path
                    return true;
                }

                const next_nibble = key_nibbles[path_prefix.len];
                if (next_nibble >= 16) return TrieError.InvalidKey; // Invalid nibble

                // Check if there's a child at this position
                if (!branch.children_mask.is_set(@intCast(next_nibble))) return true; // No child, end of path

                // Follow the child
                const child = branch.children[next_nibble].?;
                const new_prefix = try self.allocator.alloc(u8, path_prefix.len + 1);
                defer self.allocator.free(new_prefix);

                @memcpy(new_prefix[0..path_prefix.len], path_prefix);
                new_prefix[path_prefix.len] = next_nibble;

                switch (child) {
                    .Raw => |_| {
                        // Direct value, no further recursion
                        return true;
                    },
                    .Hash => |hash| {
                        const hash_str = try bytes_to_hex_string(self.allocator, &hash);
                        defer self.allocator.free(hash_str);

                        const next_node = self.builder.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                        return try self.collect_proof_nodes(retainer, next_node, new_prefix);
                    },
                }
            },
        }
    }
};

// Helper function - Duplicated from hash_builder.zig for modularity
fn bytes_to_hex_string(allocator: Allocator, bytes: []const u8) ![]u8 {
    const hex_chars = "0123456789abcdef";
    const hex = try allocator.alloc(u8, bytes.len * 2);
    errdefer allocator.free(hex);

    for (bytes, 0..) |byte, i| {
        hex[i * 2] = hex_chars[byte >> 4];
        hex[i * 2 + 1] = hex_chars[byte & 0x0F];
    }

    return hex;
}

// Tests

test "MerkleTrie - basic operations" {
    const testing = std.testing;
    const allocator = testing.allocator;

    var trie_instance = MerkleTrie.init(allocator);
    defer trie_instance.deinit();

    // Trie should start empty
    try testing.expect(trie_instance.root_hash() == null);

    // Put a key-value pair
    try trie_instance.put(&[_]u8{ 1, 2, 3 }, "value1");

    // Root hash should now exist
    try testing.expect(trie_instance.root_hash() != null);

    // Get the value
    const value = try trie_instance.get(&[_]u8{ 1, 2, 3 });
    try testing.expect(value != null);
    try testing.expectEqualStrings("value1", value.?);

    // Delete the key
    try trie_instance.delete(&[_]u8{ 1, 2, 3 });

    // Value should be gone
    const deleted = try trie_instance.get(&[_]u8{ 1, 2, 3 });
    try testing.expect(deleted == null);

    // Trie should be empty again
    try testing.expect(trie_instance.root_hash() == null);
}

test "MerkleTrie - proof generation and verification" {
    const testing = std.testing;
    const allocator = testing.allocator;

    var trie_instance = MerkleTrie.init(allocator);
    defer trie_instance.deinit();

    // Start with a simple case - just one key-value pair
    try trie_instance.put(&[_]u8{ 1, 2, 3 }, "value1");

    // Get the root hash
    const root = trie_instance.root_hash().?;

    // Generate proof for the key
    const proof1 = try trie_instance.prove(&[_]u8{ 1, 2, 3 });
    defer {
        for (proof1) |node| {
            allocator.free(node);
        }
        allocator.free(proof1);
    }

    // Verify the proof
    const result1 = try trie_instance.verify_proof(root, &[_]u8{ 1, 2, 3 }, proof1, "value1");
    try testing.expect(result1);
}

test "MerkleTrie - multiple operations" {
    const testing = std.testing;
    const allocator = testing.allocator;

    var trie_instance = MerkleTrie.init(allocator);
    defer trie_instance.deinit();

    // Insert multiple keys
    try trie_instance.put(&[_]u8{ 1, 2, 3 }, "value1");
    try trie_instance.put(&[_]u8{ 1, 2, 4 }, "value2");
    try trie_instance.put(&[_]u8{ 1, 3, 5 }, "value3");
    try trie_instance.put(&[_]u8{ 2, 3, 4 }, "value4");

    // Get all values
    const value1 = try trie_instance.get(&[_]u8{ 1, 2, 3 });
    try testing.expect(value1 != null);
    try testing.expectEqualStrings("value1", value1.?);

    const value2 = try trie_instance.get(&[_]u8{ 1, 2, 4 });
    try testing.expect(value2 != null);
    try testing.expectEqualStrings("value2", value2.?);

    const value3 = try trie_instance.get(&[_]u8{ 1, 3, 5 });
    try testing.expect(value3 != null);
    try testing.expectEqualStrings("value3", value3.?);

    const value4 = try trie_instance.get(&[_]u8{ 2, 3, 4 });
    try testing.expect(value4 != null);
    try testing.expectEqualStrings("value4", value4.?);

    // Update a value
    try trie_instance.put(&[_]u8{ 1, 2, 3 }, "updated_value");
    const updated = try trie_instance.get(&[_]u8{ 1, 2, 3 });
    try testing.expect(updated != null);
    try testing.expectEqualStrings("updated_value", updated.?);

    // Delete values
    try trie_instance.delete(&[_]u8{ 1, 2, 3 });
    try trie_instance.delete(&[_]u8{ 1, 3, 5 });

    // Verify deletions
    const deleted1 = try trie_instance.get(&[_]u8{ 1, 2, 3 });
    try testing.expect(deleted1 == null);

    const deleted2 = try trie_instance.get(&[_]u8{ 1, 3, 5 });
    try testing.expect(deleted2 == null);

    // But other values still exist
    const remaining1 = try trie_instance.get(&[_]u8{ 1, 2, 4 });
    try testing.expect(remaining1 != null);
    try testing.expectEqualStrings("value2", remaining1.?);

    const remaining2 = try trie_instance.get(&[_]u8{ 2, 3, 4 });
    try testing.expect(remaining2 != null);
    try testing.expectEqualStrings("value4", remaining2.?);

    // Clear the trie
    trie_instance.clear();
    try testing.expect(trie_instance.root_hash() == null);

    // All values should be gone
    const cleared1 = try trie_instance.get(&[_]u8{ 1, 2, 4 });
    try testing.expect(cleared1 == null);

    const cleared2 = try trie_instance.get(&[_]u8{ 2, 3, 4 });
    try testing.expect(cleared2 == null);
}
