const std = @import("std");
const Allocator = std.mem.Allocator;
const rlp = @import("rlp");

// Simplified Trie with clear ownership rules:
// 1. Values are always moved, never cloned
// 2. When a node is freed, its values are freed
// 3. No value is ever duplicated

pub const TrieError = error{
    InvalidNode,
    InvalidKey,
    NonExistentNode,
    OutOfMemory,
};

// Simplified node structure
pub const Node = union(enum) {
    Empty: void,
    Leaf: struct {
        nibbles: []u8,
        value: []u8,
    },
    Branch: struct {
        children: [16]?*Node,
        value: ?[]u8,
    },
    
    pub fn deinit(self: *Node, allocator: Allocator) void {
        switch (self.*) {
            .Empty => {},
            .Leaf => |*leaf| {
                allocator.free(leaf.nibbles);
                allocator.free(leaf.value);
            },
            .Branch => |*branch| {
                // Free all children
                for (branch.children) |child| {
                    if (child) |c| {
                        c.deinit(allocator);
                        allocator.destroy(c);
                    }
                }
                // Free value if present
                if (branch.value) |v| {
                    allocator.free(v);
                }
            },
        }
    }
    
    pub fn hash(self: *const Node, allocator: Allocator) ![32]u8 {
        const encoded = try self.encode(allocator);
        defer allocator.free(encoded);
        
        var result: [32]u8 = undefined;
        std.crypto.hash.sha3.Keccak256.hash(encoded, &result, .{});
        return result;
    }
    
    fn encode(self: *const Node, allocator: Allocator) ![]u8 {
        switch (self.*) {
            .Empty => return try rlp.encode(allocator, ""),
            .Leaf => |leaf| {
                var items = std.ArrayList([]u8).init(allocator);
                defer {
                    for (items.items) |item| allocator.free(item);
                    items.deinit();
                }
                
                const encoded_path = try encodePath(allocator, leaf.nibbles, true);
                try items.append(encoded_path);
                
                const encoded_value = try rlp.encode(allocator, leaf.value);
                try items.append(encoded_value);
                
                return try rlp.encode(allocator, items.items);
            },
            .Branch => |branch| {
                var items = std.ArrayList([]u8).init(allocator);
                defer {
                    for (items.items) |item| allocator.free(item);
                    items.deinit();
                }
                
                // Encode children
                for (branch.children) |child| {
                    if (child) |c| {
                        const child_encoded = try c.encode(allocator);
                        defer allocator.free(child_encoded);
                        
                        if (child_encoded.len < 32) {
                            // Inline small nodes
                            const copy = try allocator.dupe(u8, child_encoded);
                            try items.append(copy);
                        } else {
                            // Hash large nodes
                            const h = try c.hash(allocator);
                            const hash_encoded = try rlp.encode(allocator, &h);
                            try items.append(hash_encoded);
                        }
                    } else {
                        const empty = try rlp.encode(allocator, "");
                        try items.append(empty);
                    }
                }
                
                // Encode value
                if (branch.value) |v| {
                    const encoded = try rlp.encode(allocator, v);
                    try items.append(encoded);
                } else {
                    const empty = try rlp.encode(allocator, "");
                    try items.append(empty);
                }
                
                return try rlp.encode(allocator, items.items);
            },
        }
    }
};

pub const TrieV3 = struct {
    allocator: Allocator,
    root: ?*Node,
    
    pub fn init(allocator: Allocator) TrieV3 {
        return .{
            .allocator = allocator,
            .root = null,
        };
    }
    
    pub fn deinit(self: *TrieV3) void {
        if (self.root) |root| {
            root.deinit(self.allocator);
            self.allocator.destroy(root);
            self.root = null;
        }
    }
    
    pub fn insert(self: *TrieV3, key: []const u8, value: []const u8) !void {
        const nibbles = try keyToNibbles(self.allocator, key);
        defer self.allocator.free(nibbles);
        
        // Create owned copy of value
        const value_copy = try self.allocator.dupe(u8, value);
        errdefer self.allocator.free(value_copy);
        
        if (self.root) |root| {
            self.root = try self.insertNode(root, nibbles, value_copy);
        } else {
            // Create new leaf as root
            const nibbles_copy = try self.allocator.dupe(u8, nibbles);
            const leaf = try self.allocator.create(Node);
            leaf.* = Node{ .Leaf = .{ .nibbles = nibbles_copy, .value = value_copy } };
            self.root = leaf;
        }
    }
    
    pub fn get(self: *TrieV3, key: []const u8) !?[]const u8 {
        if (self.root == null) return null;
        
        const nibbles = try keyToNibbles(self.allocator, key);
        defer self.allocator.free(nibbles);
        
        return self.getNode(self.root.?, nibbles);
    }
    
    pub fn delete(self: *TrieV3, key: []const u8) !void {
        if (self.root == null) return;
        
        const nibbles = try keyToNibbles(self.allocator, key);
        defer self.allocator.free(nibbles);
        
        self.root = try self.deleteNode(self.root.?, nibbles);
    }
    
    fn insertNode(self: *TrieV3, node: *Node, nibbles: []const u8, value: []u8) !*Node {
        switch (node.*) {
            .Empty => {
                // Replace with leaf
                const nibbles_copy = try self.allocator.dupe(u8, nibbles);
                node.* = Node{ .Leaf = .{ .nibbles = nibbles_copy, .value = value } };
                return node;
            },
            .Leaf => |*leaf| {
                if (std.mem.eql(u8, leaf.nibbles, nibbles)) {
                    // Update value - free old, use new
                    self.allocator.free(leaf.value);
                    leaf.value = value;
                    return node;
                }
                
                // Need to split into branch
                return try self.splitLeaf(node, nibbles, value);
            },
            .Branch => |*branch| {
                if (nibbles.len == 0) {
                    // Update branch value
                    if (branch.value) |old| {
                        self.allocator.free(old);
                    }
                    branch.value = value;
                    return node;
                }
                
                // Insert into child
                const idx = nibbles[0];
                const remaining = nibbles[1..];
                
                if (branch.children[idx]) |child| {
                    branch.children[idx] = try self.insertNode(child, remaining, value);
                } else {
                    // Create new leaf child
                    const child_nibbles = try self.allocator.dupe(u8, remaining);
                    const child = try self.allocator.create(Node);
                    child.* = Node{ .Leaf = .{ .nibbles = child_nibbles, .value = value } };
                    branch.children[idx] = child;
                }
                
                return node;
            },
        }
    }
    
    fn splitLeaf(self: *TrieV3, leaf_node: *Node, new_nibbles: []const u8, new_value: []u8) !*Node {
        const leaf = &leaf_node.Leaf;
        const common_len = commonPrefixLength(leaf.nibbles, new_nibbles);
        
        // Create branch
        const branch = try self.allocator.create(Node);
        branch.* = Node{ .Branch = .{ .children = [_]?*Node{null} ** 16, .value = null } };
        
        // Add existing leaf to branch
        if (leaf.nibbles.len > common_len) {
            const idx = leaf.nibbles[common_len];
            const remaining = leaf.nibbles[common_len + 1..];
            
            if (remaining.len == 0) {
                // Move value to branch
                branch.Branch.value = leaf.value;
                // Don't free leaf.value - we moved it
            } else {
                // Create new child leaf
                const child = try self.allocator.create(Node);
                const child_nibbles = try self.allocator.dupe(u8, remaining);
                child.* = Node{ .Leaf = .{ .nibbles = child_nibbles, .value = leaf.value } };
                branch.Branch.children[idx] = child;
                // Don't free leaf.value - we moved it
            }
        } else {
            // Existing leaf terminates at branch
            branch.Branch.value = leaf.value;
            // Don't free leaf.value - we moved it
        }
        
        // Add new value to branch
        if (new_nibbles.len > common_len) {
            const idx = new_nibbles[common_len];
            const remaining = new_nibbles[common_len + 1..];
            
            if (remaining.len == 0) {
                // Create a leaf node with empty nibbles at this branch position
                const child = try self.allocator.create(Node);
                child.* = Node{ .Leaf = .{ .nibbles = try self.allocator.alloc(u8, 0), .value = new_value } };
                branch.Branch.children[idx] = child;
            } else {
                // Create new child leaf
                const child = try self.allocator.create(Node);
                const child_nibbles = try self.allocator.dupe(u8, remaining);
                child.* = Node{ .Leaf = .{ .nibbles = child_nibbles, .value = new_value } };
                branch.Branch.children[idx] = child;
            }
        } else {
            // New value terminates at branch
            branch.Branch.value = new_value;
        }
        
        // Free the original leaf's nibbles (but not value - we moved it)
        self.allocator.free(leaf.nibbles);
        
        // Free the old node and return the new branch
        self.allocator.destroy(leaf_node);
        
        return branch;
    }
    
    fn getNode(self: *TrieV3, node: *Node, nibbles: []const u8) ?[]const u8 {
        switch (node.*) {
            .Empty => return null,
            .Leaf => |leaf| {
                if (std.mem.eql(u8, leaf.nibbles, nibbles)) {
                    return leaf.value;
                }
                return null;
            },
            .Branch => |branch| {
                if (nibbles.len == 0) {
                    return branch.value;
                }
                
                const idx = nibbles[0];
                if (branch.children[idx]) |child| {
                    return self.getNode(child, nibbles[1..]);
                }
                return null;
            },
        }
    }
    
    fn deleteNode(self: *TrieV3, node: *Node, nibbles: []const u8) !?*Node {
        switch (node.*) {
            .Empty => return node,
            .Leaf => |leaf| {
                if (std.mem.eql(u8, leaf.nibbles, nibbles)) {
                    // Delete this leaf
                    node.deinit(self.allocator);
                    self.allocator.destroy(node);
                    return null;
                }
                return node;
            },
            .Branch => |*branch| {
                if (nibbles.len == 0) {
                    // Delete branch value
                    if (branch.value) |v| {
                        self.allocator.free(v);
                        branch.value = null;
                    }
                } else {
                    // Delete from child
                    const idx = nibbles[0];
                    if (branch.children[idx]) |child| {
                        branch.children[idx] = try self.deleteNode(child, nibbles[1..]);
                    }
                }
                
                // Check if branch should collapse
                var child_count: u32 = 0;
                var last_child_idx: ?u8 = null;
                for (branch.children, 0..) |child, i| {
                    if (child != null) {
                        child_count += 1;
                        last_child_idx = @intCast(i);
                    }
                }
                
                if (child_count == 0 and branch.value == null) {
                    // Empty branch
                    node.deinit(self.allocator);
                    self.allocator.destroy(node);
                    return null;
                } else if (child_count == 1 and branch.value == null) {
                    // Collapse to single child
                    const child = branch.children[last_child_idx.?].?;
                    
                    // Free the branch node (but not its children - we're keeping one)
                    // Set the child to null so it won't be freed
                    branch.children[last_child_idx.?] = null;
                    node.deinit(self.allocator);
                    self.allocator.destroy(node);
                    
                    return child;
                }
                
                return node;
            },
        }
    }
    
    pub fn rootHash(self: *TrieV3) ?[32]u8 {
        if (self.root) |root| {
            return root.hash(self.allocator) catch null;
        }
        return null;
    }
};

// Helper functions
fn keyToNibbles(allocator: Allocator, key: []const u8) ![]u8 {
    const nibbles = try allocator.alloc(u8, key.len * 2);
    for (key, 0..) |byte, i| {
        nibbles[i * 2] = byte >> 4;
        nibbles[i * 2 + 1] = byte & 0x0F;
    }
    return nibbles;
}

fn commonPrefixLength(a: []const u8, b: []const u8) usize {
    const min_len = @min(a.len, b.len);
    var i: usize = 0;
    while (i < min_len and a[i] == b[i]) : (i += 1) {}
    return i;
}

fn encodePath(allocator: Allocator, nibbles: []const u8, is_leaf: bool) ![]u8 {
    if (nibbles.len == 0) {
        const hex_arr = try allocator.alloc(u8, 1);
        hex_arr[0] = if (is_leaf) 0x20 else 0x00;
        return hex_arr;
    }
    
    const len = if (nibbles.len % 2 == 0) (nibbles.len / 2) + 1 else (nibbles.len + 1) / 2;
    const hex_arr = try allocator.alloc(u8, len);
    
    if (nibbles.len % 2 == 0) {
        hex_arr[0] = if (is_leaf) 0x20 else 0x00;
        for (1..hex_arr.len) |i| {
            hex_arr[i] = (nibbles[(i - 1) * 2] << 4) | nibbles[(i - 1) * 2 + 1];
        }
    } else {
        hex_arr[0] = (if (is_leaf) @as(u8, 0x30) else @as(u8, 0x10)) | nibbles[0];
        for (1..hex_arr.len) |i| {
            hex_arr[i] = (nibbles[i * 2 - 1] << 4) | nibbles[i * 2];
        }
    }
    
    return hex_arr;
}

// Tests
test "TrieV3 - single insert" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var trie = TrieV3.init(allocator);
    defer trie.deinit();
    
    // Just one insert to isolate the issue
    try trie.insert(&[_]u8{1, 2, 3}, "value1");
}

test "TrieV3 - insert and update" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var trie = TrieV3.init(allocator);
    defer trie.deinit();
    
    // Insert then update same key
    try trie.insert(&[_]u8{1, 2, 3}, "value1");
    try trie.insert(&[_]u8{1, 2, 3}, "value2");
    
    const v = try trie.get(&[_]u8{1, 2, 3});
    try testing.expect(v != null);
    try testing.expectEqualStrings("value2", v.?);
}

test "TrieV3 - branch creation" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var trie = TrieV3.init(allocator);
    defer trie.deinit();
    
    // This should create a branch
    try trie.insert(&[_]u8{1, 2, 3}, "value1");
    try trie.insert(&[_]u8{1, 2, 4}, "value2");
}