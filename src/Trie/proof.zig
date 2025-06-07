const std = @import("std");
const Allocator = std.mem.Allocator;
const trie = @import("trie.zig");
const rlp = @import("Rlp");

const TrieNode = trie.TrieNode;
const HashValue = trie.HashValue;
const TrieError = trie.TrieError;

/// Error type for proof operations
pub const ProofError = error{
    InvalidProof,
    MissingNode,
    InvalidKey,
    InconsistentProof,
    CorruptedNode,
    InvalidRootHash,
};

/// Proof nodes collection for Merkle proofs
pub const ProofNodes = struct {
    allocator: Allocator,
    nodes: std.StringHashMap([]const u8), // Hash (hex) -> RLP encoded node

    pub fn init(allocator: Allocator) ProofNodes {
        return ProofNodes{
            .allocator = allocator,
            .nodes = std.StringHashMap([]const u8).init(allocator),
        };
    }

    pub fn deinit(self: *ProofNodes) void {
        var it = self.nodes.iterator();
        while (it.next()) |entry| {
            self.allocator.free(entry.key_ptr.*);
            self.allocator.free(entry.value_ptr.*);
        }
        self.nodes.deinit();
    }

    /// Add a node to the proof
    pub fn add_node(self: *ProofNodes, hash: [32]u8, node_data: []const u8) !void {
        const hash_str = try bytes_to_hex_string(self.allocator, &hash);
        errdefer self.allocator.free(hash_str);

        // Check if already exists
        if (self.nodes.contains(hash_str)) {
            self.allocator.free(hash_str);
            return;
        }

        // Copy the node data
        const data_copy = try self.allocator.dupe(u8, node_data);
        errdefer self.allocator.free(data_copy);

        // Store the node
        try self.nodes.put(hash_str, data_copy);
    }

    /// Convert to a list of RLP-encoded nodes for external use
    pub fn to_node_list(self: *const ProofNodes, allocator: Allocator) ![]const []const u8 {
        var node_list = std.ArrayList([]const u8).init(allocator);
        errdefer {
            for (node_list.items) |item| {
                allocator.free(item);
            }
            node_list.deinit();
        }

        var it = self.nodes.valueIterator();
        while (it.next()) |value| {
            const node_copy = try allocator.dupe(u8, value.*);
            try node_list.append(node_copy);
        }

        return try node_list.toOwnedSlice();
    }

    /// Verify a key against the proof with expected root hash
    pub fn verify(self: *const ProofNodes, allocator: Allocator, root_hash: [32]u8, key: []const u8, expected_value: ?[]const u8) !bool {
        // Convert key to nibbles
        const nibbles = try trie.key_to_nibbles(allocator, key);
        defer allocator.free(nibbles);

        // Get root node
        const root_hash_str = try bytes_to_hex_string(allocator, &root_hash);
        defer allocator.free(root_hash_str);

        const root_node_data = self.nodes.get(root_hash_str) orelse {
            return ProofError.InvalidRootHash;
        };

        // Verify the root node hash
        var hash_buf: [32]u8 = undefined;
        std.crypto.hash.sha3.Keccak256.hash(root_node_data, &hash_buf, .{});
        if (!std.mem.eql(u8, &hash_buf, &root_hash)) {
            return ProofError.InvalidRootHash;
        }

        // Begin verification with the root node
        const decoded = try rlp.decode(allocator, root_node_data, false);
        defer decoded.data.deinit(allocator);

        return try self.verify_path(allocator, decoded.data, nibbles, expected_value);
    }

    /// Verify a path in the proof
    fn verify_path(self: *const ProofNodes, allocator: Allocator, node_data: rlp.Data, remaining_path: []const u8, expected_value: ?[]const u8) !bool {
        switch (node_data) {
            .String => {
                // Empty node or single byte - shouldn't happen at this point
                if (expected_value != null) return false; // Expected value but reached a non-value node
                return true; // Assuming empty proof is valid for non-existent keys
            },
            .List => |items| {
                // Determine node type based on item count
                if (items.len == 0) {
                    // Empty node
                    return expected_value == null;
                } else if (items.len == 2) {
                    // Either leaf or extension node
                    switch (items[0]) {
                        .String => |path_bytes| {
                            if (path_bytes.len == 0) return ProofError.CorruptedNode;

                            // Decode the path
                            const decoded_path = try trie.decode_path(allocator, path_bytes);
                            defer allocator.free(decoded_path.nibbles);

                            if (decoded_path.is_leaf) {
                                // Leaf node
                                // Check if paths match
                                if (!std.mem.eql(u8, decoded_path.nibbles, remaining_path)) return expected_value == null; // Path doesn't match, expect null

                                // Check value
                                switch (items[1]) {
                                    .String => |value| {
                                        // The value is RLP-encoded, so we need to decode it
                                        const decoded_value = try rlp.decode(allocator, value, false);
                                        defer decoded_value.data.deinit(allocator);

                                        switch (decoded_value.data) {
                                            .String => |actual_value| {
                                                // Found value, compare with expected
                                                if (expected_value) |expected| {
                                                    return std.mem.eql(u8, actual_value, expected);
                                                } else {
                                                    return false; // Value exists but none expected
                                                }
                                            },
                                            .List => return ProofError.CorruptedNode, // Value should not be a list
                                        }
                                    },
                                    .List => {
                                        return ProofError.CorruptedNode; // Invalid value format
                                    },
                                }
                            } else {
                                // Extension node
                                // Check if extension is a prefix of the path
                                if (remaining_path.len < decoded_path.nibbles.len) {
                                    return expected_value == null; // Path too short
                                }

                                if (!std.mem.eql(u8, decoded_path.nibbles, remaining_path[0..decoded_path.nibbles.len])) {
                                    return expected_value == null; // Prefix doesn't match
                                }

                                // Follow the extension
                                switch (items[1]) {
                                    .String => |next_hash| {
                                        if (next_hash.len != 32) {
                                            return ProofError.CorruptedNode; // Expected 32-byte hash
                                        }

                                        // Get the hash
                                        var hash_buf: [32]u8 = undefined;
                                        @memcpy(&hash_buf, next_hash);

                                        // Get the next node
                                        const hash_str = try bytes_to_hex_string(allocator, &hash_buf);
                                        defer allocator.free(hash_str);

                                        const next_node_data = self.nodes.get(hash_str) orelse {
                                            return ProofError.MissingNode;
                                        };

                                        // Verify the next node hash
                                        var next_hash_buf: [32]u8 = undefined;
                                        std.crypto.hash.sha3.Keccak256.hash(next_node_data, &next_hash_buf, .{});
                                        if (!std.mem.eql(u8, &next_hash_buf, &hash_buf)) {
                                            return ProofError.InvalidProof;
                                        }

                                        // Decode the next node
                                        const next_decoded = try rlp.decode(allocator, next_node_data, false);
                                        defer next_decoded.data.deinit(allocator);

                                        // Continue verification
                                        return try self.verify_path(allocator, next_decoded.data, remaining_path[decoded_path.nibbles.len..], expected_value);
                                    },
                                    .List => return ProofError.CorruptedNode, // Invalid next node format
                                }
                            }
                        },
                        .List => return ProofError.CorruptedNode, // Invalid path format
                    }
                } else if (items.len == 17) {
                    // Branch node
                    if (remaining_path.len == 0) {
                        // End of path, check value at position 16
                        switch (items[16]) {
                            .String => |value| {
                                if (value.len == 0) {
                                    // No value
                                    return expected_value == null;
                                } else {
                                    // Has value
                                    if (expected_value) |expected| {
                                        return std.mem.eql(u8, value, expected);
                                    } else {
                                        return false; // Value exists but none expected
                                    }
                                }
                            },
                            .List => return ProofError.CorruptedNode, // Invalid value format
                        }
                    } else {
                        // Get the next nibble
                        const nibble = remaining_path[0];
                        if (nibble >= 16) {
                            return ProofError.InvalidKey; // Nibble value out of range
                        }

                        // Check the branch at this position
                        switch (items[nibble]) {
                            .String => |next| {
                                if (next.len == 0) {
                                    // No child at this position
                                    return expected_value == null;
                                } else if (next.len == 32) {
                                    // Child is a hash reference
                                    var hash_buf: [32]u8 = undefined;
                                    @memcpy(&hash_buf, next);

                                    // Get the next node
                                    const hash_str = try bytes_to_hex_string(allocator, &hash_buf);
                                    defer allocator.free(hash_str);

                                    const next_node_data = self.nodes.get(hash_str) orelse {
                                        return ProofError.MissingNode;
                                    };

                                    // Verify the next node hash
                                    var next_hash_buf: [32]u8 = undefined;
                                    std.crypto.hash.sha3.Keccak256.hash(next_node_data, &next_hash_buf, .{});
                                    if (!std.mem.eql(u8, &next_hash_buf, &hash_buf)) {
                                        return ProofError.InvalidProof;
                                    }

                                    // Decode the next node
                                    const next_decoded = try rlp.decode(allocator, next_node_data, false);
                                    defer next_decoded.data.deinit(allocator);

                                    // Continue verification
                                    return try self.verify_path(allocator, next_decoded.data, remaining_path[1..], expected_value);
                                } else {
                                    // Direct value reference
                                    if (remaining_path.len == 1) {
                                        if (expected_value) |expected| {
                                            return std.mem.eql(u8, next, expected);
                                        } else {
                                            return false; // Value exists but none expected
                                        }
                                    } else {
                                        return ProofError.InconsistentProof; // Path too long for value node
                                    }
                                }
                            },
                            .List => return ProofError.CorruptedNode, // Invalid child format
                        }
                    }
                } else {
                    return ProofError.CorruptedNode; // Invalid node format
                }
            },
        }

        return ProofError.CorruptedNode; // Should never reach here
    }
};

/// Collect proof nodes while executing an operation
pub const ProofRetainer = struct {
    allocator: Allocator,
    proof: ProofNodes,
    key_nibbles: []const u8,

    pub fn init(allocator: Allocator, key: []const u8) !ProofRetainer {
        // Convert key to nibbles
        const nibbles = try trie.key_to_nibbles(allocator, key);
        errdefer allocator.free(nibbles);

        return ProofRetainer{
            .allocator = allocator,
            .proof = ProofNodes.init(allocator),
            .key_nibbles = nibbles,
        };
    }

    pub fn deinit(self: *ProofRetainer) void {
        self.proof.deinit();
        self.allocator.free(self.key_nibbles);
    }

    /// Collect a node for the proof if it's relevant to the key path
    pub fn collect_node(self: *ProofRetainer, node: TrieNode, path_prefix: []const u8) !bool {
        // Check if this node is on the path to our key
        if (path_prefix.len > self.key_nibbles.len) return false; // Path is longer than key, not relevant

        if (!std.mem.eql(u8, path_prefix, self.key_nibbles[0..path_prefix.len])) return false; // Path doesn't match key prefix, not relevant

        // This node is on the path, encode and collect it
        const encoded = try node.encode(self.allocator);
        defer self.allocator.free(encoded);

        // Calculate the node hash
        var hash: [32]u8 = undefined;
        std.crypto.hash.sha3.Keccak256.hash(encoded, &hash, .{});

        // Add to proof
        try self.proof.add_node(hash, encoded);
        return true;
    }

    /// Get the collected proof
    pub fn get_proof(self: *const ProofRetainer) *const ProofNodes {
        return &self.proof;
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

test "ProofNodes - add and verify" {
    const testing = std.testing;
    const allocator = testing.allocator;

    var proof_nodes = ProofNodes.init(allocator);
    defer proof_nodes.deinit();

    // Create a sample leaf node
    const path = [_]u8{ 1, 2, 3, 4 };
    const value = "test_value";

    const leaf = try trie.LeafNode.init(allocator, try allocator.dupe(u8, &path), trie.HashValue{ .Raw = try allocator.dupe(u8, value) });
    var node = trie.TrieNode{ .Leaf = leaf };

    // Encode the node
    const encoded = try node.encode(allocator);
    defer allocator.free(encoded);

    // Calculate the hash
    var hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(encoded, &hash, .{});

    // Add to proof nodes
    try proof_nodes.add_node(hash, encoded);

    // Convert to node list
    const nodes = try proof_nodes.to_node_list(allocator);
    defer {
        for (nodes) |node_data| {
            allocator.free(node_data);
        }
        allocator.free(nodes);
    }

    try testing.expectEqual(@as(usize, 1), nodes.len);
    try testing.expectEqualSlices(u8, encoded, nodes[0]);

    // Clean up the node
    node.deinit(allocator);
}

test "ProofRetainer - collect nodes" {
    const testing = std.testing;
    const allocator = testing.allocator;

    const key = [_]u8{ 0x12, 0x34 }; // This will become nibbles [1,2,3,4]
    var retainer = try ProofRetainer.init(allocator, &key);
    defer retainer.deinit();

    // Create a node on the path - use the first 2 nibbles of the key
    const path = [_]u8{ 1, 2 }; // First two nibbles of key
    const value = "test_value";

    const extension = try trie.ExtensionNode.init(allocator, try allocator.dupe(u8, &path), trie.HashValue{ .Raw = try allocator.dupe(u8, value) });
    var node = trie.TrieNode{ .Extension = extension };
    defer node.deinit(allocator);

    // Collect the node
    const collected = try retainer.collect_node(node, &path);
    try testing.expect(collected);

    // Verify it was added to the proof
    const proof = retainer.get_proof();
    try testing.expectEqual(@as(usize, 1), proof.nodes.count());

    // Node not on path
    const off_path = [_]u8{ 5, 6 };
    const not_collected = try retainer.collect_node(node, &off_path);
    try testing.expect(!not_collected);

    // Still only one node in proof
    try testing.expectEqual(@as(usize, 1), proof.nodes.count());
}
