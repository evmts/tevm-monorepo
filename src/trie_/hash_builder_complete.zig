const std = @import("std");
const Allocator = std.mem.Allocator;
const trie = @import("trie.zig");
const rlp = @import("Rlp");

const TrieNode = trie.TrieNode;
const HashValue = trie.HashValue;
const BranchNode = trie.BranchNode;
const ExtensionNode = trie.ExtensionNode;
const LeafNode = trie.LeafNode;
const TrieError = trie.TrieError;

/// Error types for HashBuilder operations
const HashBuilderError = std.mem.Allocator.Error || TrieError;

/// Complete Patricia Merkle Trie implementation with safe memory management
pub const HashBuilder = struct {
    allocator: Allocator,
    // Store nodes by their hash (hex encoded) - safer than complex pointer management
    nodes: std.StringHashMap(TrieNode),
    // The root node's hash (if built)
    root_hash: ?[32]u8,

    pub fn init(allocator: Allocator) HashBuilder {
        return HashBuilder{
            .allocator = allocator,
            .nodes = std.StringHashMap(TrieNode).init(allocator),
            .root_hash = null,
        };
    }

    pub fn deinit(self: *HashBuilder) void {
        // Clean up all nodes
        var it = self.nodes.iterator();
        while (it.next()) |entry| {
            // Free the hash key string
            self.allocator.free(entry.key_ptr.*);
            // Deinit the node
            var node = entry.value_ptr.*;
            node.deinit(self.allocator);
        }
        self.nodes.deinit();
    }

    pub fn reset(self: *HashBuilder) void {
        // Clean up all nodes
        var it = self.nodes.iterator();
        while (it.next()) |entry| {
            self.allocator.free(entry.key_ptr.*);
            var node = entry.value_ptr.*;
            node.deinit(self.allocator);
        }
        self.nodes.clearRetainingCapacity();

        self.root_hash = null;
    }

    /// Store a node and return its hash
    fn storeNode(self: *HashBuilder, node: TrieNode) HashBuilderError![32]u8 {
        // Calculate the hash
        const hash = try node.hash(self.allocator);
        const hash_str = try bytesToHexString(self.allocator, &hash);
        errdefer self.allocator.free(hash_str);

        // Check if we already have this node
        if (self.nodes.contains(hash_str)) {
            self.allocator.free(hash_str);
            return hash;
        }

        // Store the node
        try self.nodes.put(hash_str, node);
        return hash;
    }

    /// Add a key-value pair to the trie
    pub fn insert(self: *HashBuilder, key: []const u8, value: []const u8) HashBuilderError!void {
        // Convert key to nibbles
        const nibbles = try trie.key_to_nibbles(self.allocator, key);
        defer self.allocator.free(nibbles);

        // Get or create root
        const root_node = if (self.root_hash) |hash| blk: {
            const hash_str = try bytesToHexString(self.allocator, &hash);
            defer self.allocator.free(hash_str);
            break :blk self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
        } else TrieNode{ .Empty = {} };

        // Insert into the trie
        const new_root = try self.insertNode(root_node, nibbles, value);

        // Store the new root and update hash
        self.root_hash = try self.storeNode(new_root);
    }

    /// Get a value from the trie
    pub fn get(self: *HashBuilder, key: []const u8) HashBuilderError!?[]const u8 {
        if (self.root_hash == null) return null;

        const nibbles = try trie.key_to_nibbles(self.allocator, key);
        defer self.allocator.free(nibbles);

        const hash_str = try bytesToHexString(self.allocator, &self.root_hash.?);
        defer self.allocator.free(hash_str);

        const root_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
        return try self.getValue(root_node, nibbles);
    }

    /// Delete a key-value pair from the trie
    pub fn delete(self: *HashBuilder, key: []const u8) HashBuilderError!void {
        if (self.root_hash == null) return;

        const nibbles = try trie.key_to_nibbles(self.allocator, key);
        defer self.allocator.free(nibbles);

        const hash_str = try bytesToHexString(self.allocator, &self.root_hash.?);
        defer self.allocator.free(hash_str);

        const root_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;

        const result = try self.deleteNode(root_node, nibbles);
        if (result) |new_root| {
            self.root_hash = try self.storeNode(new_root);
        } else {
            self.root_hash = null;
        }
    }

    /// Get the root hash
    pub fn rootHash(self: *const HashBuilder) ?[32]u8 {
        return self.root_hash;
    }

    // Internal implementation methods

    fn insertNode(self: *HashBuilder, node: TrieNode, nibbles: []const u8, value: []const u8) HashBuilderError!TrieNode {
        switch (node) {
            .Empty => {
                // Create new leaf
                const path_copy = try self.allocator.dupe(u8, nibbles);
                const value_copy = try self.allocator.dupe(u8, value);
                const leaf = try LeafNode.init(self.allocator, path_copy, HashValue{ .Raw = value_copy });
                return TrieNode{ .Leaf = leaf };
            },
            .Leaf => |leaf| {
                if (std.mem.eql(u8, leaf.nibbles, nibbles)) {
                    // Replace value
                    const path_copy = try self.allocator.dupe(u8, nibbles);
                    const value_copy = try self.allocator.dupe(u8, value);
                    const new_leaf = try LeafNode.init(self.allocator, path_copy, HashValue{ .Raw = value_copy });
                    return TrieNode{ .Leaf = new_leaf };
                }

                // Split the leaf
                return try self.splitLeaf(leaf, nibbles, value);
            },
            .Extension => |extension| {
                return try self.insertIntoExtension(extension, nibbles, value);
            },
            .Branch => |branch| {
                return try self.insertIntoBranch(branch, nibbles, value);
            },
        }
    }

    fn splitLeaf(self: *HashBuilder, leaf: LeafNode, nibbles: []const u8, value: []const u8) HashBuilderError!TrieNode {
        const common_len = commonPrefixLength(leaf.nibbles, nibbles);

        if (common_len == 0) {
            // No common prefix, create branch
            var branch = BranchNode.init();

            // Add existing leaf
            if (leaf.nibbles.len > 0) {
                const existing_key = leaf.nibbles[0];
                if (leaf.nibbles.len == 1) {
                    branch.children[existing_key] = try leaf.value.dupe(self.allocator);
                    branch.children_mask.set(@intCast(existing_key));
                } else {
                    const remaining_path = try self.allocator.dupe(u8, leaf.nibbles[1..]);
                    const new_leaf = try LeafNode.init(self.allocator, remaining_path, try leaf.value.dupe(self.allocator));
                    const new_node = TrieNode{ .Leaf = new_leaf };
                    const hash = try self.storeNode(new_node);
                    branch.children[existing_key] = HashValue{ .Hash = hash };
                    branch.children_mask.set(@intCast(existing_key));
                }
            }

            // Add new value
            if (nibbles.len > 0) {
                const new_key = nibbles[0];
                if (nibbles.len == 1) {
                    branch.children[new_key] = HashValue{ .Raw = try self.allocator.dupe(u8, value) };
                    branch.children_mask.set(@intCast(new_key));
                } else {
                    const remaining_path = try self.allocator.dupe(u8, nibbles[1..]);
                    const new_leaf = try LeafNode.init(self.allocator, remaining_path, HashValue{ .Raw = try self.allocator.dupe(u8, value) });
                    const new_node = TrieNode{ .Leaf = new_leaf };
                    const hash = try self.storeNode(new_node);
                    branch.children[new_key] = HashValue{ .Hash = hash };
                    branch.children_mask.set(@intCast(new_key));
                }
            } else {
                branch.value = HashValue{ .Raw = try self.allocator.dupe(u8, value) };
            }

            return TrieNode{ .Branch = branch };
        } else {
            // Create extension + branch
            var branch = BranchNode.init();

            // Add existing leaf remainder
            if (leaf.nibbles.len > common_len) {
                const existing_key = leaf.nibbles[common_len];
                if (leaf.nibbles.len == common_len + 1) {
                    branch.children[existing_key] = try leaf.value.dupe(self.allocator);
                    branch.children_mask.set(@intCast(existing_key));
                } else {
                    const remaining_path = try self.allocator.dupe(u8, leaf.nibbles[common_len + 1 ..]);
                    const new_leaf = try LeafNode.init(self.allocator, remaining_path, try leaf.value.dupe(self.allocator));
                    const new_node = TrieNode{ .Leaf = new_leaf };
                    const hash = try self.storeNode(new_node);
                    branch.children[existing_key] = HashValue{ .Hash = hash };
                    branch.children_mask.set(@intCast(existing_key));
                }
            } else {
                branch.value = try leaf.value.dupe(self.allocator);
            }

            // Add new value remainder
            if (nibbles.len > common_len) {
                const new_key = nibbles[common_len];
                if (nibbles.len == common_len + 1) {
                    branch.children[new_key] = HashValue{ .Raw = try self.allocator.dupe(u8, value) };
                    branch.children_mask.set(@intCast(new_key));
                } else {
                    const remaining_path = try self.allocator.dupe(u8, nibbles[common_len + 1 ..]);
                    const new_leaf = try LeafNode.init(self.allocator, remaining_path, HashValue{ .Raw = try self.allocator.dupe(u8, value) });
                    const new_node = TrieNode{ .Leaf = new_leaf };
                    const hash = try self.storeNode(new_node);
                    branch.children[new_key] = HashValue{ .Hash = hash };
                    branch.children_mask.set(@intCast(new_key));
                }
            } else {
                branch.value = HashValue{ .Raw = try self.allocator.dupe(u8, value) };
            }

            // Store branch and create extension
            const branch_node = TrieNode{ .Branch = branch };
            const branch_hash = try self.storeNode(branch_node);

            const common_prefix = try self.allocator.dupe(u8, nibbles[0..common_len]);
            const extension = try ExtensionNode.init(self.allocator, common_prefix, HashValue{ .Hash = branch_hash });

            return TrieNode{ .Extension = extension };
        }
    }

    fn insertIntoExtension(self: *HashBuilder, extension: ExtensionNode, nibbles: []const u8, value: []const u8) HashBuilderError!TrieNode {
        const common_len = commonPrefixLength(extension.nibbles, nibbles);

        if (common_len == extension.nibbles.len) {
            // Extension is prefix of path, continue with next node
            const remaining_path = nibbles[common_len..];

            // Get next node
            const next_node = switch (extension.next) {
                .Raw => return TrieError.InvalidNode,
                .Hash => |hash| blk: {
                    const hash_str = try bytesToHexString(self.allocator, &hash);
                    defer self.allocator.free(hash_str);
                    break :blk self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                },
            };

            // Insert into next node
            const updated_node = try self.insertNode(next_node, remaining_path, value);
            const updated_hash = try self.storeNode(updated_node);

            // Create new extension with updated next
            const path_copy = try self.allocator.dupe(u8, extension.nibbles);
            const new_extension = try ExtensionNode.init(self.allocator, path_copy, HashValue{ .Hash = updated_hash });

            return TrieNode{ .Extension = new_extension };
        } else {
            // Split the extension
            return try self.splitExtension(extension, nibbles, value, common_len);
        }
    }

    fn splitExtension(self: *HashBuilder, extension: ExtensionNode, nibbles: []const u8, value: []const u8, common_len: usize) HashBuilderError!TrieNode {
        // Create branch at split point
        var branch = BranchNode.init();

        // Add extension continuation
        const ext_key = extension.nibbles[common_len];
        if (extension.nibbles.len == common_len + 1) {
            branch.children[ext_key] = extension.next;
            branch.children_mask.set(@intCast(ext_key));
        } else {
            const remaining_ext_path = try self.allocator.dupe(u8, extension.nibbles[common_len + 1 ..]);
            const new_extension = try ExtensionNode.init(self.allocator, remaining_ext_path, extension.next);
            const ext_node = TrieNode{ .Extension = new_extension };
            const ext_hash = try self.storeNode(ext_node);
            branch.children[ext_key] = HashValue{ .Hash = ext_hash };
            branch.children_mask.set(@intCast(ext_key));
        }

        // Add new value
        if (nibbles.len > common_len) {
            const new_key = nibbles[common_len];
            if (nibbles.len == common_len + 1) {
                branch.children[new_key] = HashValue{ .Raw = try self.allocator.dupe(u8, value) };
                branch.children_mask.set(@intCast(new_key));
            } else {
                const remaining_path = try self.allocator.dupe(u8, nibbles[common_len + 1 ..]);
                const new_leaf = try LeafNode.init(self.allocator, remaining_path, HashValue{ .Raw = try self.allocator.dupe(u8, value) });
                const leaf_node = TrieNode{ .Leaf = new_leaf };
                const leaf_hash = try self.storeNode(leaf_node);
                branch.children[new_key] = HashValue{ .Hash = leaf_hash };
                branch.children_mask.set(@intCast(new_key));
            }
        } else {
            branch.value = HashValue{ .Raw = try self.allocator.dupe(u8, value) };
        }

        if (common_len > 0) {
            // Create new extension
            const branch_node = TrieNode{ .Branch = branch };
            const branch_hash = try self.storeNode(branch_node);

            const common_prefix = try self.allocator.dupe(u8, nibbles[0..common_len]);
            const new_extension = try ExtensionNode.init(self.allocator, common_prefix, HashValue{ .Hash = branch_hash });

            return TrieNode{ .Extension = new_extension };
        } else {
            return TrieNode{ .Branch = branch };
        }
    }

    fn insertIntoBranch(self: *HashBuilder, branch: BranchNode, nibbles: []const u8, value: []const u8) HashBuilderError!TrieNode {
        var new_branch = try branch.dupe(self.allocator);

        if (nibbles.len == 0) {
            // Set branch value
            if (new_branch.value) |*old_value| {
                old_value.deinit(self.allocator);
            }
            new_branch.value = HashValue{ .Raw = try self.allocator.dupe(u8, value) };
            return TrieNode{ .Branch = new_branch };
        }

        const key = nibbles[0];
        const remaining_path = nibbles[1..];

        if (new_branch.children_mask.is_set(@intCast(key))) {
            // Update existing child
            const child = new_branch.children[key].?;
            const updated_node = switch (child) {
                .Raw => |data| blk: {
                    // Handle raw value directly without creating temp node
                    if (remaining_path.len == 0) {
                        // Direct replacement with new value
                        const new_leaf = try LeafNode.init(self.allocator, try self.allocator.alloc(u8, 0), HashValue{ .Raw = try self.allocator.dupe(u8, value) });
                        break :blk TrieNode{ .Leaf = new_leaf };
                    } else {
                        // Need to create a branch to hold both the existing data and new value
                        var sub_branch = BranchNode.init();

                        // Add existing value at remaining_path[0]
                        if (remaining_path.len == 1) {
                            sub_branch.children[remaining_path[0]] = HashValue{ .Raw = try self.allocator.dupe(u8, value) };
                            sub_branch.children_mask.set(@intCast(remaining_path[0]));
                        } else {
                            const leaf_path = try self.allocator.dupe(u8, remaining_path[1..]);
                            const new_leaf = try LeafNode.init(self.allocator, leaf_path, HashValue{ .Raw = try self.allocator.dupe(u8, value) });
                            const leaf_node = TrieNode{ .Leaf = new_leaf };
                            const leaf_hash = try self.storeNode(leaf_node);
                            sub_branch.children[remaining_path[0]] = HashValue{ .Hash = leaf_hash };
                            sub_branch.children_mask.set(@intCast(remaining_path[0]));
                        }

                        // Set the existing data as the branch value
                        sub_branch.value = HashValue{ .Raw = try self.allocator.dupe(u8, data) };

                        break :blk TrieNode{ .Branch = sub_branch };
                    }
                },
                .Hash => |hash| blk: {
                    const hash_str = try bytesToHexString(self.allocator, &hash);
                    defer self.allocator.free(hash_str);
                    const next_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                    break :blk try self.insertNode(next_node, remaining_path, value);
                },
            };

            const updated_hash = try self.storeNode(updated_node);

            // Free old child and set new one
            new_branch.children[key].?.deinit(self.allocator);
            new_branch.children[key] = HashValue{ .Hash = updated_hash };
        } else {
            // Add new child
            if (remaining_path.len == 0) {
                new_branch.children[key] = HashValue{ .Raw = try self.allocator.dupe(u8, value) };
            } else {
                const leaf = try LeafNode.init(self.allocator, try self.allocator.dupe(u8, remaining_path), HashValue{ .Raw = try self.allocator.dupe(u8, value) });
                const leaf_node = TrieNode{ .Leaf = leaf };
                const leaf_hash = try self.storeNode(leaf_node);
                new_branch.children[key] = HashValue{ .Hash = leaf_hash };
            }
            new_branch.children_mask.set(@intCast(key));
        }

        return TrieNode{ .Branch = new_branch };
    }

    fn getValue(self: *const HashBuilder, node: TrieNode, nibbles: []const u8) HashBuilderError!?[]const u8 {
        switch (node) {
            .Empty => return null,
            .Leaf => |leaf| {
                if (std.mem.eql(u8, leaf.nibbles, nibbles)) {
                    switch (leaf.value) {
                        .Raw => |data| return data,
                        .Hash => return TrieError.InvalidNode, // Leaves should have raw values
                    }
                }
                return null;
            },
            .Extension => |extension| {
                if (nibbles.len < extension.nibbles.len) return null;
                if (!std.mem.eql(u8, extension.nibbles, nibbles[0..extension.nibbles.len])) return null;

                const next_node = switch (extension.next) {
                    .Raw => return TrieError.InvalidNode,
                    .Hash => |hash| blk: {
                        const hash_str = try bytesToHexString(self.allocator, &hash);
                        defer self.allocator.free(hash_str);
                        break :blk self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                    },
                };

                return try self.getValue(next_node, nibbles[extension.nibbles.len..]);
            },
            .Branch => |branch| {
                if (nibbles.len == 0) {
                    if (branch.value) |value| {
                        switch (value) {
                            .Raw => |data| return data,
                            .Hash => return TrieError.InvalidNode,
                        }
                    }
                    return null;
                }

                const key = nibbles[0];
                if (!branch.children_mask.is_set(@intCast(key))) return null;

                const child = branch.children[key].?;
                return switch (child) {
                    .Raw => |data| {
                        if (nibbles.len == 1) return data;
                        return null;
                    },
                    .Hash => |hash| blk: {
                        const hash_str = try bytesToHexString(self.allocator, &hash);
                        defer self.allocator.free(hash_str);
                        const next_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                        break :blk try self.getValue(next_node, nibbles[1..]);
                    },
                };
            },
        }
    }

    fn deleteNode(self: *HashBuilder, node: TrieNode, nibbles: []const u8) HashBuilderError!?TrieNode {
        // Simplified delete - in a full implementation this would handle node consolidation
        switch (node) {
            .Empty => return null,
            .Leaf => |leaf| {
                if (std.mem.eql(u8, leaf.nibbles, nibbles)) {
                    return null; // Delete this leaf
                }
                // Copy the leaf
                const path_copy = try self.allocator.dupe(u8, leaf.nibbles);
                const new_leaf = try LeafNode.init(self.allocator, path_copy, try leaf.value.dupe(self.allocator));
                return TrieNode{ .Leaf = new_leaf };
            },
            .Extension => |extension| {
                if (nibbles.len < extension.nibbles.len) {
                    // Path doesn't match
                    const path_copy = try self.allocator.dupe(u8, extension.nibbles);
                    const new_extension = try ExtensionNode.init(self.allocator, path_copy, extension.next);
                    return TrieNode{ .Extension = new_extension };
                }

                if (!std.mem.eql(u8, extension.nibbles, nibbles[0..extension.nibbles.len])) {
                    // Path doesn't match
                    const path_copy = try self.allocator.dupe(u8, extension.nibbles);
                    const new_extension = try ExtensionNode.init(self.allocator, path_copy, extension.next);
                    return TrieNode{ .Extension = new_extension };
                }

                // Follow extension and delete from next node
                const next_node = switch (extension.next) {
                    .Raw => return TrieError.InvalidNode,
                    .Hash => |hash| blk: {
                        const hash_str = try bytesToHexString(self.allocator, &hash);
                        defer self.allocator.free(hash_str);
                        break :blk self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                    },
                };

                const result = try self.deleteNode(next_node, nibbles[extension.nibbles.len..]);
                if (result) |new_next| {
                    const new_hash = try self.storeNode(new_next);
                    const path_copy = try self.allocator.dupe(u8, extension.nibbles);
                    const new_extension = try ExtensionNode.init(self.allocator, path_copy, HashValue{ .Hash = new_hash });
                    return TrieNode{ .Extension = new_extension };
                } else {
                    return null; // Next node was deleted
                }
            },
            .Branch => |branch| {
                var new_branch = try branch.dupe(self.allocator);

                if (nibbles.len == 0) {
                    // Delete branch value
                    if (new_branch.value) |*value| {
                        value.deinit(self.allocator);
                        new_branch.value = null;
                    }
                } else {
                    const key = nibbles[0];
                    if (new_branch.children_mask.is_set(@intCast(key))) {
                        const child = new_branch.children[key].?;
                        const next_node = switch (child) {
                            .Raw => |_| {
                                if (nibbles.len == 1) {
                                    // Delete this child
                                    new_branch.children[key].?.deinit(self.allocator);
                                    new_branch.children[key] = null;
                                    new_branch.children_mask.unset(@intCast(key));
                                    return TrieNode{ .Branch = new_branch };
                                }
                                return TrieNode{ .Branch = new_branch }; // No change
                            },
                            .Hash => |hash| blk: {
                                const hash_str = try bytesToHexString(self.allocator, &hash);
                                defer self.allocator.free(hash_str);
                                break :blk self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                            },
                        };

                        const result = try self.deleteNode(next_node, nibbles[1..]);
                        if (result) |new_next| {
                            const new_hash = try self.storeNode(new_next);
                            new_branch.children[key].?.deinit(self.allocator);
                            new_branch.children[key] = HashValue{ .Hash = new_hash };
                        } else {
                            new_branch.children[key].?.deinit(self.allocator);
                            new_branch.children[key] = null;
                            new_branch.children_mask.unset(@intCast(key));
                        }
                    }
                }

                return TrieNode{ .Branch = new_branch };
            },
        }
    }
};

// Helper functions
fn commonPrefixLength(a: []const u8, b: []const u8) usize {
    const min_len = @min(a.len, b.len);
    var i: usize = 0;
    while (i < min_len and a[i] == b[i]) : (i += 1) {}
    return i;
}

fn bytesToHexString(allocator: Allocator, bytes: []const u8) std.mem.Allocator.Error![]u8 {
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
test "HashBuilder - complete trie operations" {
    const testing = std.testing;
    const allocator = testing.allocator;

    var builder = HashBuilder.init(allocator);
    defer builder.deinit();

    // Test basic operations
    try builder.insert(&[_]u8{ 1, 2, 3 }, "value1");
    try testing.expect(builder.rootHash() != null);

    const value = try builder.get(&[_]u8{ 1, 2, 3 });
    try testing.expect(value != null);
    try testing.expectEqualStrings("value1", value.?);

    // Test multiple keys with common prefixes
    try builder.insert(&[_]u8{ 1, 2, 4 }, "value2");
    try builder.insert(&[_]u8{ 1, 3, 5 }, "value3");

    const value1 = try builder.get(&[_]u8{ 1, 2, 3 });
    try testing.expectEqualStrings("value1", value1.?);

    const value2 = try builder.get(&[_]u8{ 1, 2, 4 });
    try testing.expectEqualStrings("value2", value2.?);

    const value3 = try builder.get(&[_]u8{ 1, 3, 5 });
    try testing.expectEqualStrings("value3", value3.?);

    // Test deletion
    try builder.delete(&[_]u8{ 1, 2, 3 });
    const deleted = try builder.get(&[_]u8{ 1, 2, 3 });
    try testing.expect(deleted == null);

    // Other values should still exist
    const remaining = try builder.get(&[_]u8{ 1, 2, 4 });
    try testing.expectEqualStrings("value2", remaining.?);
}
