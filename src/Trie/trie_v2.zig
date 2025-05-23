const std = @import("std");
const Allocator = std.mem.Allocator;
const rlp = @import("rlp");

// Memory Management Architecture:
// 1. Clear ownership: Nodes are owned by the Trie, not duplicated
// 2. Arena allocator for temporary operations during updates
// 3. Move semantics: Nodes are moved, not copied
// 4. Single source of truth: One node storage location

pub const TrieError = error{
    InvalidNode,
    InvalidKey,
    InvalidProof,
    InvalidPath,
    NonExistentNode,
    EmptyInput,
    OutOfMemory,
    CorruptedTrie,
};

// Node handle - indirect reference to a node
pub const NodeHandle = union(enum) {
    Hash: [32]u8,      // Reference to a node by hash
    Inline: NodeId,    // Direct reference to a node in storage
    
    pub fn hash(self: NodeHandle, trie: *const TrieV2) ![32]u8 {
        switch (self) {
            .Hash => |h| return h,
            .Inline => |id| {
                const node = trie.getNode(id) orelse return TrieError.NonExistentNode;
                return node.hash(trie.allocator);
            },
        }
    }
};

// Node ID for internal storage
pub const NodeId = u32;

// Value type - either raw data or hash
pub const Value = union(enum) {
    Data: []const u8,
    Hash: [32]u8,
    
    pub fn deinit(self: *Value, allocator: Allocator) void {
        switch (self.*) {
            .Data => |data| allocator.free(data),
            .Hash => {},
        }
    }
    
    pub fn clone(self: Value, allocator: Allocator) !Value {
        return switch (self) {
            .Data => |data| Value{ .Data = try allocator.dupe(u8, data) },
            .Hash => |h| Value{ .Hash = h },
        };
    }
};

// Node types
pub const Node = union(enum) {
    Empty: void,
    Leaf: struct {
        partial: []u8,    // Remaining path
        value: Value,
    },
    Extension: struct {
        partial: []u8,    // Shared path prefix
        child: NodeHandle,
    },
    Branch: struct {
        children: [16]?NodeHandle,
        value: ?Value,
    },
    
    pub fn deinit(self: *Node, allocator: Allocator) void {
        switch (self.*) {
            .Empty => {},
            .Leaf => |*leaf| {
                allocator.free(leaf.partial);
                leaf.value.deinit(allocator);
            },
            .Extension => |*ext| {
                allocator.free(ext.partial);
            },
            .Branch => |*branch| {
                if (branch.value) |*v| {
                    v.deinit(allocator);
                }
            },
        }
    }
    
    pub fn hash(self: Node, allocator: Allocator) ![32]u8 {
        const encoded = try self.encode(allocator);
        defer allocator.free(encoded);
        
        var result: [32]u8 = undefined;
        std.crypto.hash.sha3.Keccak256.hash(encoded, &result, .{});
        return result;
    }
    
    pub fn encode(self: Node, allocator: Allocator) ![]u8 {
        switch (self) {
            .Empty => return try rlp.encode(allocator, ""),
            .Leaf => |leaf| {
                var items = std.ArrayList([]u8).init(allocator);
                defer {
                    for (items.items) |item| allocator.free(item);
                    items.deinit();
                }
                
                const encoded_path = try encodePath(allocator, leaf.partial, true);
                try items.append(encoded_path);
                
                const encoded_value = switch (leaf.value) {
                    .Data => |data| try rlp.encode(allocator, data),
                    .Hash => |h| try rlp.encode(allocator, &h),
                };
                try items.append(encoded_value);
                
                return try rlp.encode(allocator, items.items);
            },
            .Extension => |ext| {
                var items = std.ArrayList([]u8).init(allocator);
                defer {
                    for (items.items) |item| allocator.free(item);
                    items.deinit();
                }
                
                const encoded_path = try encodePath(allocator, ext.partial, false);
                try items.append(encoded_path);
                
                // For encoding, we need the child's hash
                // This is a simplification - in practice we'd need access to the trie
                const child_hash = switch (ext.child) {
                    .Hash => |h| h,
                    .Inline => return TrieError.InvalidNode, // Would need trie access
                };
                const encoded_child = try rlp.encode(allocator, &child_hash);
                try items.append(encoded_child);
                
                return try rlp.encode(allocator, items.items);
            },
            .Branch => |branch| {
                var items = std.ArrayList([]u8).init(allocator);
                defer {
                    for (items.items) |item| allocator.free(item);
                    items.deinit();
                }
                
                // Add 16 children
                for (branch.children) |child| {
                    if (child) |c| {
                        const child_hash = switch (c) {
                            .Hash => |h| h,
                            .Inline => return TrieError.InvalidNode, // Would need trie access
                        };
                        const encoded = try rlp.encode(allocator, &child_hash);
                        try items.append(encoded);
                    } else {
                        const empty = try rlp.encode(allocator, "");
                        try items.append(empty);
                    }
                }
                
                // Add value
                if (branch.value) |v| {
                    const encoded_value = switch (v) {
                        .Data => |data| try rlp.encode(allocator, data),
                        .Hash => |h| try rlp.encode(allocator, &h),
                    };
                    try items.append(encoded_value);
                } else {
                    const empty = try rlp.encode(allocator, "");
                    try items.append(empty);
                }
                
                return try rlp.encode(allocator, items.items);
            },
        }
    }
};

// Node storage with clear ownership
const NodeStorage = struct {
    nodes: std.ArrayList(Node),
    free_list: std.ArrayList(NodeId),
    
    pub fn init(allocator: Allocator) NodeStorage {
        return .{
            .nodes = std.ArrayList(Node).init(allocator),
            .free_list = std.ArrayList(NodeId).init(allocator),
        };
    }
    
    pub fn deinit(self: *NodeStorage, allocator: Allocator) void {
        for (self.nodes.items) |*node| {
            node.deinit(allocator);
        }
        self.nodes.deinit();
        self.free_list.deinit();
    }
    
    pub fn allocNode(self: *NodeStorage, node: Node) !NodeId {
        if (self.free_list.items.len > 0) {
            const id = self.free_list.pop() orelse unreachable;
            self.nodes.items[id] = node;
            return id;
        } else {
            const id: NodeId = @intCast(self.nodes.items.len);
            try self.nodes.append(node);
            return id;
        }
    }
    
    pub fn freeNode(self: *NodeStorage, allocator: Allocator, id: NodeId) void {
        if (id < self.nodes.items.len) {
            self.nodes.items[id].deinit(allocator);
            self.nodes.items[id] = Node{ .Empty = {} };
            self.free_list.append(id) catch {}; // Best effort
        }
    }
    
    pub fn getNode(self: *NodeStorage, id: NodeId) ?*Node {
        if (id < self.nodes.items.len) {
            return &self.nodes.items[id];
        }
        return null;
    }
    
    pub fn getNodeConst(self: *const NodeStorage, id: NodeId) ?*const Node {
        if (id < self.nodes.items.len) {
            return &self.nodes.items[id];
        }
        return null;
    }
};

// Main trie structure with clear ownership
pub const TrieV2 = struct {
    allocator: Allocator,
    storage: NodeStorage,
    root: ?NodeHandle,
    // Cache for nodes loaded from database
    cache: std.StringHashMap(NodeId),
    
    pub fn init(allocator: Allocator) TrieV2 {
        return .{
            .allocator = allocator,
            .storage = NodeStorage.init(allocator),
            .root = null,
            .cache = std.StringHashMap(NodeId).init(allocator),
        };
    }
    
    pub fn deinit(self: *TrieV2) void {
        self.storage.deinit(self.allocator);
        self.cache.deinit();
    }
    
    fn getNode(self: *const TrieV2, id: NodeId) ?*const Node {
        return self.storage.getNodeConst(id);
    }
    
    fn getMutableNode(self: *TrieV2, id: NodeId) ?*Node {
        return self.storage.getNode(id);
    }
    
    // Insert a key-value pair
    pub fn insert(self: *TrieV2, key: []const u8, value: []const u8) !void {
        const nibbles = try keyToNibbles(self.allocator, key);
        defer self.allocator.free(nibbles);
        
        const value_copy = try self.allocator.dupe(u8, value);
        errdefer self.allocator.free(value_copy);
        
        // Use arena for temporary allocations during update
        var arena = std.heap.ArenaAllocator.init(self.allocator);
        defer arena.deinit();
        const temp_allocator = arena.allocator();
        
        const new_root = try self.insertAtNode(temp_allocator, self.root, nibbles, Value{ .Data = value_copy });
        self.root = new_root;
    }
    
    // Get a value by key
    pub fn get(self: *TrieV2, key: []const u8) !?[]const u8 {
        if (self.root == null) return null;
        
        const nibbles = try keyToNibbles(self.allocator, key);
        defer self.allocator.free(nibbles);
        
        return try self.getAtNode(self.root.?, nibbles);
    }
    
    // Delete a key
    pub fn delete(self: *TrieV2, key: []const u8) !void {
        if (self.root == null) return;
        
        const nibbles = try keyToNibbles(self.allocator, key);
        defer self.allocator.free(nibbles);
        
        var arena = std.heap.ArenaAllocator.init(self.allocator);
        defer arena.deinit();
        const temp_allocator = arena.allocator();
        
        self.root = try self.deleteAtNode(temp_allocator, self.root.?, nibbles);
    }
    
    // Insert at a specific node (returns new node handle)
    fn insertAtNode(self: *TrieV2, temp_allocator: Allocator, handle: ?NodeHandle, nibbles: []const u8, value: Value) !NodeHandle {
        if (handle == null) {
            // Create new leaf
            const partial = try self.allocator.dupe(u8, nibbles);
            const leaf = Node{ .Leaf = .{ .partial = partial, .value = value } };
            const id = try self.storage.allocNode(leaf);
            return NodeHandle{ .Inline = id };
        }
        
        const current_handle = handle.?;
        const node = switch (current_handle) {
            .Hash => |h| {
                // Load from database - simplified for now
                _ = h;
                return TrieError.NonExistentNode;
            },
            .Inline => |id| self.getNode(id) orelse return TrieError.NonExistentNode,
        };
        
        switch (node.*) {
            .Empty => {
                // Create new leaf
                const partial = try self.allocator.dupe(u8, nibbles);
                const leaf = Node{ .Leaf = .{ .partial = partial, .value = value } };
                const id = try self.storage.allocNode(leaf);
                return NodeHandle{ .Inline = id };
            },
            .Leaf => |leaf| {
                if (std.mem.eql(u8, leaf.partial, nibbles)) {
                    // Update value - need to free the old value that's being replaced
                    const new_partial = try self.allocator.dupe(u8, nibbles);
                    errdefer self.allocator.free(new_partial);
                    
                    // The new node takes ownership of both new_partial and value
                    const new_leaf = Node{ .Leaf = .{ .partial = new_partial, .value = value } };
                    const id = try self.storage.allocNode(new_leaf);
                    
                    // Free old node if it was inline (this will free the old value)
                    if (current_handle == .Inline) {
                        self.storage.freeNode(self.allocator, current_handle.Inline);
                    }
                    
                    return NodeHandle{ .Inline = id };
                }
                
                // Split into branch
                return try self.splitLeafAndInsert(temp_allocator, leaf, nibbles, value);
            },
            .Extension => |ext| {
                const common_len = commonPrefixLength(ext.partial, nibbles);
                
                if (common_len == ext.partial.len) {
                    // Continue down
                    const remaining = nibbles[common_len..];
                    const new_child = try self.insertAtNode(temp_allocator, ext.child, remaining, value);
                    
                    const new_partial = try self.allocator.dupe(u8, ext.partial);
                    const new_ext = Node{ .Extension = .{ .partial = new_partial, .child = new_child } };
                    const id = try self.storage.allocNode(new_ext);
                    
                    // Free old node if it was inline
                    if (current_handle == .Inline) {
                        self.storage.freeNode(self.allocator, current_handle.Inline);
                    }
                    
                    return NodeHandle{ .Inline = id };
                } else {
                    // Split extension
                    return try self.splitExtensionAndInsert(temp_allocator, ext, nibbles, value, common_len);
                }
            },
            .Branch => |branch| {
                if (nibbles.len == 0) {
                    // Insert at branch value
                    var new_branch = branch;
                    new_branch.value = value;
                    const branch_node = Node{ .Branch = new_branch };
                    const id = try self.storage.allocNode(branch_node);
                    
                    // Free old node if it was inline
                    if (current_handle == .Inline) {
                        self.storage.freeNode(self.allocator, current_handle.Inline);
                    }
                    
                    return NodeHandle{ .Inline = id };
                } else {
                    // Insert at child
                    const child_idx = nibbles[0];
                    const remaining = nibbles[1..];
                    
                    var new_branch = branch;
                    new_branch.children[child_idx] = try self.insertAtNode(
                        temp_allocator, 
                        branch.children[child_idx], 
                        remaining, 
                        value
                    );
                    
                    const branch_node = Node{ .Branch = new_branch };
                    const id = try self.storage.allocNode(branch_node);
                    
                    // Free old node if it was inline
                    if (current_handle == .Inline) {
                        self.storage.freeNode(self.allocator, current_handle.Inline);
                    }
                    
                    return NodeHandle{ .Inline = id };
                }
            },
        }
    }
    
    fn splitLeafAndInsert(self: *TrieV2, temp_allocator: Allocator, leaf: anytype, nibbles: []const u8, value: Value) !NodeHandle {
        _ = temp_allocator;
        
        const common_len = commonPrefixLength(leaf.partial, nibbles);
        
        // Create branch
        var branch = Node{ .Branch = .{ .children = [_]?NodeHandle{null} ** 16, .value = null } };
        
        // Add existing leaf
        if (leaf.partial.len > common_len) {
            const leaf_idx = leaf.partial[common_len];
            const leaf_remaining = leaf.partial[common_len + 1..];
            
            if (leaf_remaining.len == 0) {
                branch.Branch.children[leaf_idx] = null; // Will set value instead
                const leaf_value = try leaf.value.clone(self.allocator);
                branch.Branch.children[leaf_idx] = NodeHandle{ .Inline = try self.storage.allocNode(Node{ .Leaf = .{ .partial = &[_]u8{}, .value = leaf_value } }) };
            } else {
                const new_partial = try self.allocator.dupe(u8, leaf_remaining);
                const new_value = try leaf.value.clone(self.allocator);
                const new_leaf = Node{ .Leaf = .{ .partial = new_partial, .value = new_value } };
                const leaf_id = try self.storage.allocNode(new_leaf);
                branch.Branch.children[leaf_idx] = NodeHandle{ .Inline = leaf_id };
            }
        } else {
            const branch_value = try leaf.value.clone(self.allocator);
            branch.Branch.value = branch_value;
        }
        
        // Add new value
        if (nibbles.len > common_len) {
            const new_idx = nibbles[common_len];
            const new_remaining = nibbles[common_len + 1..];
            
            if (new_remaining.len == 0) {
                const new_value = try value.clone(self.allocator);
                branch.Branch.children[new_idx] = NodeHandle{ .Inline = try self.storage.allocNode(Node{ .Leaf = .{ .partial = &[_]u8{}, .value = new_value } }) };
            } else {
                const new_partial = try self.allocator.dupe(u8, new_remaining);
                const new_leaf = Node{ .Leaf = .{ .partial = new_partial, .value = value } };
                const leaf_id = try self.storage.allocNode(new_leaf);
                branch.Branch.children[new_idx] = NodeHandle{ .Inline = leaf_id };
            }
        } else {
            branch.Branch.value = value;
        }
        
        // Store branch
        const branch_id = try self.storage.allocNode(branch);
        
        // Create extension if needed
        if (common_len > 0) {
            const ext_partial = try self.allocator.dupe(u8, nibbles[0..common_len]);
            const ext = Node{ .Extension = .{ .partial = ext_partial, .child = NodeHandle{ .Inline = branch_id } } };
            const ext_id = try self.storage.allocNode(ext);
            return NodeHandle{ .Inline = ext_id };
        } else {
            return NodeHandle{ .Inline = branch_id };
        }
    }
    
    fn splitExtensionAndInsert(self: *TrieV2, temp_allocator: Allocator, ext: anytype, nibbles: []const u8, value: Value, common_len: usize) !NodeHandle {
        _ = temp_allocator;
        
        // Create branch for split point
        var branch = Node{ .Branch = .{ .children = [_]?NodeHandle{null} ** 16, .value = null } };
        
        // Add existing extension's continuation
        if (ext.partial.len > common_len) {
            const ext_idx = ext.partial[common_len];
            const ext_remaining = ext.partial[common_len + 1..];
            
            if (ext_remaining.len == 0) {
                branch.Branch.children[ext_idx] = ext.child;
            } else {
                const new_partial = try self.allocator.dupe(u8, ext_remaining);
                const new_ext = Node{ .Extension = .{ .partial = new_partial, .child = ext.child } };
                const ext_id = try self.storage.allocNode(new_ext);
                branch.Branch.children[ext_idx] = NodeHandle{ .Inline = ext_id };
            }
        }
        
        // Add new value
        if (nibbles.len > common_len) {
            const new_idx = nibbles[common_len];
            const new_remaining = nibbles[common_len + 1..];
            
            if (new_remaining.len == 0) {
                const new_value = try value.clone(self.allocator);
                branch.Branch.children[new_idx] = NodeHandle{ .Inline = try self.storage.allocNode(Node{ .Leaf = .{ .partial = &[_]u8{}, .value = new_value } }) };
            } else {
                const new_partial = try self.allocator.dupe(u8, new_remaining);
                const new_leaf = Node{ .Leaf = .{ .partial = new_partial, .value = value } };
                const leaf_id = try self.storage.allocNode(new_leaf);
                branch.Branch.children[new_idx] = NodeHandle{ .Inline = leaf_id };
            }
        } else {
            branch.Branch.value = value;
        }
        
        // Store branch
        const branch_id = try self.storage.allocNode(branch);
        
        // Create extension if needed
        if (common_len > 0) {
            const ext_partial = try self.allocator.dupe(u8, nibbles[0..common_len]);
            const ext_node = Node{ .Extension = .{ .partial = ext_partial, .child = NodeHandle{ .Inline = branch_id } } };
            const ext_id = try self.storage.allocNode(ext_node);
            return NodeHandle{ .Inline = ext_id };
        } else {
            return NodeHandle{ .Inline = branch_id };
        }
    }
    
    fn getAtNode(self: *TrieV2, handle: NodeHandle, nibbles: []const u8) !?[]const u8 {
        const node = switch (handle) {
            .Hash => |h| {
                // Load from database - simplified
                _ = h;
                return null;
            },
            .Inline => |id| self.getNode(id) orelse return null,
        };
        
        switch (node.*) {
            .Empty => return null,
            .Leaf => |leaf| {
                if (std.mem.eql(u8, leaf.partial, nibbles)) {
                    return switch (leaf.value) {
                        .Data => |data| data,
                        .Hash => null, // Would need to load
                    };
                }
                return null;
            },
            .Extension => |ext| {
                if (nibbles.len < ext.partial.len) return null;
                if (!std.mem.eql(u8, ext.partial, nibbles[0..ext.partial.len])) return null;
                return try self.getAtNode(ext.child, nibbles[ext.partial.len..]);
            },
            .Branch => |branch| {
                if (nibbles.len == 0) {
                    if (branch.value) |v| {
                        return switch (v) {
                            .Data => |data| data,
                            .Hash => null, // Would need to load
                        };
                    }
                    return null;
                }
                
                const idx = nibbles[0];
                if (branch.children[idx]) |child| {
                    return try self.getAtNode(child, nibbles[1..]);
                }
                return null;
            },
        }
    }
    
    fn deleteAtNode(self: *TrieV2, temp_allocator: Allocator, handle: NodeHandle, nibbles: []const u8) !?NodeHandle {
        
        const node = switch (handle) {
            .Hash => |h| {
                _ = h;
                return handle; // Can't delete from hash-referenced node
            },
            .Inline => |id| self.getNode(id) orelse return null,
        };
        
        switch (node.*) {
            .Empty => return handle,
            .Leaf => |leaf| {
                if (std.mem.eql(u8, leaf.partial, nibbles)) {
                    // Delete this leaf
                    if (handle == .Inline) {
                        self.storage.freeNode(self.allocator, handle.Inline);
                    }
                    return null;
                }
                return handle;
            },
            .Extension => |ext| {
                if (nibbles.len < ext.partial.len) return handle;
                if (!std.mem.eql(u8, ext.partial, nibbles[0..ext.partial.len])) return handle;
                
                const child_result = try self.deleteAtNode(temp_allocator, ext.child, nibbles[ext.partial.len..]);
                
                if (child_result == null) {
                    // Child deleted, remove extension
                    if (handle == .Inline) {
                        self.storage.freeNode(self.allocator, handle.Inline);
                    }
                    return null;
                }
                
                // Update extension with new child
                const new_partial = try self.allocator.dupe(u8, ext.partial);
                const new_ext = Node{ .Extension = .{ .partial = new_partial, .child = child_result.? } };
                const id = try self.storage.allocNode(new_ext);
                
                if (handle == .Inline) {
                    self.storage.freeNode(self.allocator, handle.Inline);
                }
                
                return NodeHandle{ .Inline = id };
            },
            .Branch => |branch| {
                var new_branch = branch;
                
                if (nibbles.len == 0) {
                    // Delete value
                    if (new_branch.value) |*v| {
                        v.deinit(self.allocator);
                        new_branch.value = null;
                    }
                } else {
                    // Delete from child
                    const idx = nibbles[0];
                    if (branch.children[idx]) |child| {
                        new_branch.children[idx] = try self.deleteAtNode(temp_allocator, child, nibbles[1..]);
                    }
                }
                
                // Check if branch should be collapsed
                var child_count: u32 = 0;
                var last_child_idx: ?u8 = null;
                for (new_branch.children, 0..) |child, i| {
                    if (child != null) {
                        child_count += 1;
                        last_child_idx = @intCast(i);
                    }
                }
                
                if (child_count == 0 and new_branch.value == null) {
                    // Empty branch
                    if (handle == .Inline) {
                        self.storage.freeNode(self.allocator, handle.Inline);
                    }
                    return null;
                } else if (child_count == 1 and new_branch.value == null and last_child_idx != null) {
                    // Collapse to extension or leaf
                    const child_handle = new_branch.children[last_child_idx.?].?;
                    const child_node = switch (child_handle) {
                        .Hash => {
                            // Can't collapse with hash child
                            const branch_node = Node{ .Branch = new_branch };
                            const id = try self.storage.allocNode(branch_node);
                            if (handle == .Inline) {
                                self.storage.freeNode(self.allocator, handle.Inline);
                            }
                            return NodeHandle{ .Inline = id };
                        },
                        .Inline => |id| self.getNode(id) orelse return null,
                    };
                    
                    // Collapse based on child type
                    const result = switch (child_node.*) {
                        .Leaf => |child_leaf| blk: {
                            // Merge into single leaf
                            var new_partial = try self.allocator.alloc(u8, 1 + child_leaf.partial.len);
                            new_partial[0] = last_child_idx.?;
                            @memcpy(new_partial[1..], child_leaf.partial);
                            
                            const new_value = try child_leaf.value.clone(self.allocator);
                            const leaf = Node{ .Leaf = .{ .partial = new_partial, .value = new_value } };
                            break :blk NodeHandle{ .Inline = try self.storage.allocNode(leaf) };
                        },
                        .Extension => |child_ext| blk: {
                            // Merge into single extension
                            var new_partial = try self.allocator.alloc(u8, 1 + child_ext.partial.len);
                            new_partial[0] = last_child_idx.?;
                            @memcpy(new_partial[1..], child_ext.partial);
                            
                            const ext = Node{ .Extension = .{ .partial = new_partial, .child = child_ext.child } };
                            break :blk NodeHandle{ .Inline = try self.storage.allocNode(ext) };
                        },
                        else => blk: {
                            // Keep as branch
                            const branch_node = Node{ .Branch = new_branch };
                            break :blk NodeHandle{ .Inline = try self.storage.allocNode(branch_node) };
                        },
                    };
                    
                    if (handle == .Inline) {
                        self.storage.freeNode(self.allocator, handle.Inline);
                    }
                    
                    return result;
                } else {
                    // Keep as branch
                    const branch_node = Node{ .Branch = new_branch };
                    const id = try self.storage.allocNode(branch_node);
                    
                    if (handle == .Inline) {
                        self.storage.freeNode(self.allocator, handle.Inline);
                    }
                    
                    return NodeHandle{ .Inline = id };
                }
            },
        }
    }
    
    pub fn rootHash(self: *TrieV2) ?[32]u8 {
        if (self.root) |root| {
            return root.hash(self) catch null;
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
test "TrieV2 - basic operations" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var trie = TrieV2.init(allocator);
    defer trie.deinit();
    
    // Insert and get
    try trie.insert(&[_]u8{1, 2, 3}, "value1");
    const value1 = try trie.get(&[_]u8{1, 2, 3});
    try testing.expect(value1 != null);
    try testing.expectEqualStrings("value1", value1.?);
    
    // Insert another
    try trie.insert(&[_]u8{1, 2, 4}, "value2");
    const value2 = try trie.get(&[_]u8{1, 2, 4});
    try testing.expect(value2 != null);
    try testing.expectEqualStrings("value2", value2.?);
    
    // Delete
    try trie.delete(&[_]u8{1, 2, 3});
    const deleted = try trie.get(&[_]u8{1, 2, 3});
    try testing.expect(deleted == null);
    
    // Other still exists
    const still_there = try trie.get(&[_]u8{1, 2, 4});
    try testing.expect(still_there != null);
    try testing.expectEqualStrings("value2", still_there.?);
}