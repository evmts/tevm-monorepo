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

/// The main trie implementation supporting all operations
pub const HashBuilder = struct {
    allocator: Allocator,
    // Store nodes by their hash (hex encoded)
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
        // Create a list of all keys and values to free after the hashmap is cleared
        var keys = std.ArrayList([]u8).init(self.allocator);
        defer keys.deinit();
        
        var nodes = std.ArrayList(TrieNode).init(self.allocator);
        defer nodes.deinit();
        
        // First collect all keys and nodes
        var it = self.nodes.iterator();
        while (it.next()) |entry| {
            // Add key to list for freeing later
            keys.append(try self.allocator.dupe(u8, entry.key_ptr.*)) catch {};
            
            // Add node to list for deinit later
            nodes.append(entry.value_ptr.*) catch {};
        }
        
        // Deinit the hashmap first
        self.nodes.clearAndFree();
        
        // Now deinit all nodes
        for (nodes.items) |*node| {
            node.deinit(self.allocator);
        }
        
        // Free all keys
        for (keys.items) |key| {
            self.allocator.free(key);
        }
    }
    
    pub fn reset(self: *HashBuilder) void {
        // Create a list of all keys and values to free after the hashmap is cleared
        var keys = std.ArrayList([]u8).init(self.allocator);
        defer keys.deinit();
        
        var nodes = std.ArrayList(TrieNode).init(self.allocator);
        defer nodes.deinit();
        
        // First collect all keys and nodes
        var it = self.nodes.iterator();
        while (it.next()) |entry| {
            // Add key to list for freeing later
            keys.append(try self.allocator.dupe(u8, entry.key_ptr.*)) catch {};
            
            // Add node to list for deinit later
            nodes.append(entry.value_ptr.*) catch {};
        }
        
        // Clear the hashmap first 
        self.nodes.clearRetainingCapacity();
        self.root_hash = null;
        
        // Now deinit all nodes
        for (nodes.items) |*node| {
            node.deinit(self.allocator);
        }
        
        // Free all keys
        for (keys.items) |key| {
            self.allocator.free(key);
        }
    }
    
    /// Add a key-value pair to the trie
    pub fn insert(self: *HashBuilder, key: []const u8, value: []const u8) !void {
        // Convert key to nibbles
        const nibbles = try trie.keyToNibbles(self.allocator, key);
        defer self.allocator.free(nibbles);
        
        // Make a copy of the value - this is the source of truth for this insertion
        const value_copy = try self.allocator.dupe(u8, value);
        errdefer self.allocator.free(value_copy);
        
        // Start with either existing root or empty node
        const current = if (self.root_hash) |hash| blk: {
            const hash_str = try bytesToHexString(self.allocator, &hash);
            defer self.allocator.free(hash_str);
            
            const node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
            break :blk node;
        } else TrieNode{ .Empty = {} };
        
        // Insert the key-value pair
        var result = try self.update(nibbles, value_copy, current);
        errdefer result.deinit(self.allocator);
        
        // Get the hash of the result
        const hash = try result.hash(self.allocator);
        self.root_hash = hash;
        
        // Store the node
        const hash_str = try bytesToHexString(self.allocator, &hash);
        errdefer self.allocator.free(hash_str);
        
        try self.nodes.put(hash_str, result);
    }
    
    /// Get a value from the trie
    pub fn get(self: *HashBuilder, key: []const u8) !?[]const u8 {
        if (self.root_hash == null) {
            return null; // Empty trie
        }
        
        // Convert key to nibbles
        const nibbles = try trie.keyToNibbles(self.allocator, key);
        defer self.allocator.free(nibbles);
        
        const hash_str = try bytesToHexString(self.allocator, &self.root_hash.?);
        defer self.allocator.free(hash_str);
        
        const root_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
        
        // The returned value will be a slice of internally stored data, ownership remains with the trie
        // We don't need to copy the result since the Trie is responsible for managing this memory
        // Users should not modify or free this data
        return try self.getValue(root_node, nibbles);
    }
    
    /// Delete a key-value pair from the trie
    pub fn delete(self: *HashBuilder, key: []const u8) !void {
        if (self.root_hash == null) {
            return; // Empty trie, nothing to delete
        }
        
        // Convert key to nibbles
        const nibbles = try trie.keyToNibbles(self.allocator, key);
        defer self.allocator.free(nibbles);
        
        const hash_str = try bytesToHexString(self.allocator, &self.root_hash.?);
        defer self.allocator.free(hash_str);
        
        const root_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
        
        const result = try self.deleteKey(nibbles, root_node);
        
        // Update root hash
        if (result) |node| {
            const hash = try node.hash(self.allocator);
            self.root_hash = hash;
            
            const new_hash_str = try bytesToHexString(self.allocator, &hash);
            try self.nodes.put(new_hash_str, node);
        } else {
            // Trie is now empty
            self.root_hash = null;
        }
    }
    
    /// Calculate the root hash
    pub fn rootHash(self: *const HashBuilder) ?[32]u8 {
        return self.root_hash;
    }
    
    // Internal helper functions
    
    /// Core update function that implements trie insertion logic
    fn update(self: *HashBuilder, 
              nibbles: []const u8, 
              value: []const u8, 
              current_node: TrieNode) !TrieNode {
        switch (current_node) {
            .Empty => {
                // Create a new leaf node
                const path_copy = try self.allocator.dupe(u8, nibbles);
                // Create a value copy to ensure ownership
                const value_copy = try self.allocator.dupe(u8, value);
                errdefer self.allocator.free(value_copy);
                
                const leaf = try LeafNode.init(
                    self.allocator,
                    path_copy,
                    HashValue{ .Raw = value_copy }
                );
                return TrieNode{ .Leaf = leaf };
            },
            .Leaf => |leaf| {
                // Check if the paths match
                if (std.mem.eql(u8, leaf.nibbles, nibbles)) {
                    // Same path, replace the value
                    var new_leaf = leaf;
                    new_leaf.value.deinit(self.allocator);
                    
                    // Create a value copy to ensure ownership
                    const value_copy = try self.allocator.dupe(u8, value);
                    errdefer self.allocator.free(value_copy);
                    
                    new_leaf.value = HashValue{ .Raw = value_copy };
                    return TrieNode{ .Leaf = new_leaf };
                }
                
                // Paths differ, find the common prefix
                const common_prefix_len = commonPrefixLength(leaf.nibbles, nibbles);
                
                if (common_prefix_len == 0) {
                    // No common prefix, create a branch
                    var branch = BranchNode.init();
                    
                    // Add existing leaf to branch
                    const existing_path = leaf.nibbles[common_prefix_len..];
                    const existing_value = leaf.value;
                    if (existing_path.len == 1) {
                        // Direct branch entry - clone to prevent double ownership
                        branch.children[@intCast(existing_path[0])] = try existing_value.clone(self.allocator);
                        branch.children_mask.set(@intCast(existing_path[0]));
                        // No further action needed
                    } else {
                        // Create new leaf for remaining path
                        const new_path = if (existing_path.len > 1) 
                            try self.allocator.dupe(u8, existing_path[1..])
                        else
                            try self.allocator.alloc(u8, 0);
                        const new_leaf = try LeafNode.init(
                            self.allocator,
                            new_path,
                            try existing_value.clone(self.allocator)
                        );
                        const new_node = TrieNode{ .Leaf = new_leaf };
                        
                        // Get hash of new node
                        const hash = try new_node.hash(self.allocator);
                        const hash_str = try bytesToHexString(self.allocator, &hash);
                        
                        // Store the node
                        try self.nodes.put(hash_str, new_node);
                        
                        // Add reference to branch
                        if (existing_path.len > 0) {
                            branch.children[@intCast(existing_path[0])] = HashValue{ .Hash = hash };
                            branch.children_mask.set(@intCast(existing_path[0]));
                        } else {
                            // If path is empty, this shouldn't happen but we'll handle it gracefully
                            branch.value = HashValue{ .Hash = hash };
                        }
                    }
                    
                    // Add new leaf to branch
                    const new_path = nibbles[common_prefix_len..];
                    if (new_path.len == 1) {
                        // Direct branch entry
                        // Create a value copy to ensure ownership
                        const value_copy2 = try self.allocator.dupe(u8, value);
                        errdefer self.allocator.free(value_copy2);
                        
                        branch.children[@intCast(new_path[0])] = HashValue{ .Raw = value_copy2 };
                        branch.children_mask.set(@intCast(new_path[0]));
                        // No further action needed
                    } else {
                        // Create new leaf for remaining path
                        const path_copy = if (new_path.len > 1) 
                            try self.allocator.dupe(u8, new_path[1..])
                        else
                            try self.allocator.alloc(u8, 0);
                        const new_leaf = try LeafNode.init(
                            self.allocator,
                            path_copy,
                            HashValue{ .Raw = value }
                        );
                        const new_node = TrieNode{ .Leaf = new_leaf };
                        
                        // Get hash of new node
                        const hash = try new_node.hash(self.allocator);
                        const hash_str = try bytesToHexString(self.allocator, &hash);
                        
                        // Store the node
                        try self.nodes.put(hash_str, new_node);
                        
                        // Add reference to branch
                        branch.children[@intCast(new_path[0])] = HashValue{ .Hash = hash };
                        branch.children_mask.set(@intCast(new_path[0]));
                    }
                    
                    return TrieNode{ .Branch = branch };
                } else {
                    // Common prefix exists
                    var branch = BranchNode.init();
                    
                    // Add existing leaf to branch (if path continues)
                    if (leaf.nibbles.len > common_prefix_len) {
                        const existing_path = leaf.nibbles[common_prefix_len..];
                        const existing_value = leaf.value;
                        
                        if (existing_path.len == 1) {
                            // Direct branch entry
                            branch.children[existing_path[0]] = try existing_value.clone(self.allocator);
                            branch.children_mask.set(@intCast(existing_path[0]));
                        } else {
                            // Create new leaf for remaining path
                            const new_path = if (existing_path.len > 1) 
                                try self.allocator.dupe(u8, existing_path[1..])
                            else
                                try self.allocator.alloc(u8, 0);
                            const new_leaf = try LeafNode.init(
                                self.allocator,
                                new_path,
                                try existing_value.clone(self.allocator)
                            );
                            const new_node = TrieNode{ .Leaf = new_leaf };
                            
                            // Get hash of new node
                            const hash = try new_node.hash(self.allocator);
                            const hash_str = try bytesToHexString(self.allocator, &hash);
                            
                            // Store the node
                            try self.nodes.put(hash_str, new_node);
                            
                            // Add reference to branch
                            branch.children[existing_path[0]] = HashValue{ .Hash = hash };
                            branch.children_mask.set(@intCast(existing_path[0]));
                        }
                    }
                    
                    // Add new leaf to branch
                    if (nibbles.len > common_prefix_len) {
                        const new_path = nibbles[common_prefix_len..];
                        
                        if (new_path.len == 1) {
                            // Direct branch entry
                            // Create a value copy to ensure ownership
                            const value_copy5 = try self.allocator.dupe(u8, value);
                            errdefer self.allocator.free(value_copy5);
                            
                            branch.children[new_path[0]] = HashValue{ .Raw = value_copy5 };
                            branch.children_mask.set(@intCast(new_path[0]));
                        } else {
                            // Create new leaf for remaining path
                            const path_copy = if (new_path.len > 1) 
                            try self.allocator.dupe(u8, new_path[1..])
                        else
                            try self.allocator.alloc(u8, 0);
                            const new_leaf = try LeafNode.init(
                                self.allocator,
                                path_copy,
                                HashValue{ .Raw = value }
                            );
                            const new_node = TrieNode{ .Leaf = new_leaf };
                            
                            // Get hash of new node
                            const hash = try new_node.hash(self.allocator);
                            const hash_str = try bytesToHexString(self.allocator, &hash);
                            
                            // Store the node
                            try self.nodes.put(hash_str, new_node);
                            
                            // Add reference to branch
                            branch.children[new_path[0]] = HashValue{ .Hash = hash };
                            branch.children_mask.set(@intCast(new_path[0]));
                        }
                    } else {
                        // This is a terminating node
                        // Create a value copy to ensure ownership
                        const value_copy4 = try self.allocator.dupe(u8, value);
                        errdefer self.allocator.free(value_copy4);
                        
                        branch.value = HashValue{ .Raw = value_copy4 };
                    }
                    
                    // Create an extension node for the common prefix
                    const common_prefix = try self.allocator.dupe(u8, nibbles[0..common_prefix_len]);
                    errdefer self.allocator.free(common_prefix);
                    
                    // Hash the branch node
                    const branch_node = TrieNode{ .Branch = branch };
                    const hash = try branch_node.hash(self.allocator);
                    const hash_str = try bytesToHexString(self.allocator, &hash);
                    
                    // Store the branch node
                    try self.nodes.put(hash_str, branch_node);
                    
                    // Create the extension node
                    const extension = try ExtensionNode.init(
                        self.allocator,
                        common_prefix,
                        HashValue{ .Hash = hash }
                    );
                    
                    return TrieNode{ .Extension = extension };
                }
            },
            .Extension => |extension| {
                // Check for common prefix with the extension node
                const common_prefix_len = commonPrefixLength(extension.nibbles, nibbles);
                
                if (common_prefix_len == 0) {
                    // No common prefix, create a branch
                    var branch = BranchNode.init();
                    
                    // Add existing extension to branch
                    if (extension.nibbles.len > 0) {
                        const extension_key = extension.nibbles[0];
                        const next_value = extension.next;
                        
                        if (extension.nibbles.len == 1) {
                            // Direct branch entry
                            branch.children[extension_key] = next_value;
                            branch.children_mask.set(@intCast(extension_key));
                        } else {
                            // Create new extension node for remaining path
                            const new_path = if (extension.nibbles.len > 1) 
                                try self.allocator.dupe(u8, extension.nibbles[1..])
                            else
                                try self.allocator.alloc(u8, 0);
                            const new_extension = try ExtensionNode.init(
                                self.allocator,
                                new_path,
                                next_value
                            );
                            const new_node = TrieNode{ .Extension = new_extension };
                            
                            // Get hash of new node
                            const hash = try new_node.hash(self.allocator);
                            const hash_str = try bytesToHexString(self.allocator, &hash);
                            
                            // Store the node
                            try self.nodes.put(hash_str, new_node);
                            
                            // Add reference to branch
                            branch.children[extension_key] = HashValue{ .Hash = hash };
                            branch.children_mask.set(@intCast(extension_key));
                        }
                    }
                    
                    // Add new leaf to branch
                    if (nibbles.len > 0) {
                        const new_key = nibbles[0];
                        
                        if (nibbles.len == 1) {
                            // Direct branch entry (value node)
                            // Create a value copy to ensure ownership
                            const value_copy6 = try self.allocator.dupe(u8, value);
                            errdefer self.allocator.free(value_copy6);
                            
                            branch.children[new_key] = HashValue{ .Raw = value_copy6 };
                            branch.children_mask.set(@intCast(new_key));
                        } else {
                            // Create new leaf for remaining path
                            const new_path = if (nibbles.len > 1) 
                                try self.allocator.dupe(u8, nibbles[1..])
                            else
                                try self.allocator.alloc(u8, 0);
                            const new_leaf = try LeafNode.init(
                                self.allocator,
                                new_path,
                                HashValue{ .Raw = value }
                            );
                            const new_node = TrieNode{ .Leaf = new_leaf };
                            
                            // Get hash of new node
                            const hash = try new_node.hash(self.allocator);
                            const hash_str = try bytesToHexString(self.allocator, &hash);
                            
                            // Store the node
                            try self.nodes.put(hash_str, new_node);
                            
                            // Add reference to branch
                            branch.children[new_key] = HashValue{ .Hash = hash };
                            branch.children_mask.set(@intCast(new_key));
                        }
                    } else {
                        // This is a terminating node (empty path)
                        // Create a value copy to ensure ownership
                        const value_copy4 = try self.allocator.dupe(u8, value);
                        errdefer self.allocator.free(value_copy4);
                        
                        branch.value = HashValue{ .Raw = value_copy4 };
                    }
                    
                    return TrieNode{ .Branch = branch };
                } else if (common_prefix_len == extension.nibbles.len) {
                    // Extension's path is a prefix of our path
                    // Resolve the next node and continue
                    var next_node: TrieNode = undefined;
                    
                    switch (extension.next) {
                        .Raw => {
                            // Shouldn't happen in normal operation - extensions point to other nodes
                            return TrieError.InvalidNode;
                        },
                        .Hash => |hash| {
                            const hash_str = try bytesToHexString(self.allocator, &hash);
                            defer self.allocator.free(hash_str);
                            
                            next_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                        },
                    }
                    
                    // Continue insertion with the remaining path
                    const remaining_path = nibbles[common_prefix_len..];
                    const updated_node = try self.update(remaining_path, value, next_node);
                    
                    // Get hash of updated node
                    const hash = try updated_node.hash(self.allocator);
                    const hash_str = try bytesToHexString(self.allocator, &hash);
                    
                    // Store updated node
                    try self.nodes.put(hash_str, updated_node);
                    
                    // Create new extension with same path but updated next
                    const path_copy = try self.allocator.dupe(u8, extension.nibbles);
                    const new_extension = try ExtensionNode.init(
                        self.allocator,
                        path_copy,
                        HashValue{ .Hash = hash }
                    );
                    
                    return TrieNode{ .Extension = new_extension };
                } else if (common_prefix_len < extension.nibbles.len) {
                    // Partial match, split the extension
                    // Create a branch for the divergence point
                    var branch = BranchNode.init();
                    
                    // Add existing extension's continuation to branch
                    const extension_key = extension.nibbles[common_prefix_len];
                    const next_value = extension.next;
                    
                    if (extension.nibbles.len == common_prefix_len + 1) {
                        // Direct branch entry
                        branch.children[@intCast(extension_key)] = next_value;
                        branch.children_mask.set(@intCast(extension_key));
                    } else {
                        // Create new extension for remaining path
                        const new_path = try self.allocator.dupe(u8, extension.nibbles[common_prefix_len + 1..]);
                        const new_extension = try ExtensionNode.init(
                            self.allocator,
                            new_path,
                            next_value
                        );
                        const new_node = TrieNode{ .Extension = new_extension };
                        
                        // Get hash of new node
                        const hash = try new_node.hash(self.allocator);
                        const hash_str = try bytesToHexString(self.allocator, &hash);
                        
                        // Store the node
                        try self.nodes.put(hash_str, new_node);
                        
                        // Add reference to branch
                        branch.children[extension_key] = HashValue{ .Hash = hash };
                        branch.children_mask.set(@intCast(extension_key));
                    }
                    
                    // Add new path to branch
                    if (nibbles.len > common_prefix_len) {
                        const new_key = nibbles[common_prefix_len];
                        
                        if (nibbles.len == common_prefix_len + 1) {
                            // Direct branch entry for value
                            // Create a value copy to ensure ownership
                            const value_copy6 = try self.allocator.dupe(u8, value);
                            errdefer self.allocator.free(value_copy6);
                            
                            branch.children[new_key] = HashValue{ .Raw = value_copy6 };
                            branch.children_mask.set(@intCast(new_key));
                        } else {
                            // Create new leaf for remaining path
                            const new_path = try self.allocator.dupe(u8, nibbles[common_prefix_len + 1..]);
                            const new_leaf = try LeafNode.init(
                                self.allocator,
                                new_path,
                                HashValue{ .Raw = value }
                            );
                            const new_node = TrieNode{ .Leaf = new_leaf };
                            
                            // Get hash of new node
                            const hash = try new_node.hash(self.allocator);
                            const hash_str = try bytesToHexString(self.allocator, &hash);
                            
                            // Store the node
                            try self.nodes.put(hash_str, new_node);
                            
                            // Add reference to branch
                            branch.children[new_key] = HashValue{ .Hash = hash };
                            branch.children_mask.set(@intCast(new_key));
                        }
                    } else {
                        // This is a terminating node
                        // Create a value copy to ensure ownership
                        const value_copy4 = try self.allocator.dupe(u8, value);
                        errdefer self.allocator.free(value_copy4);
                        
                        branch.value = HashValue{ .Raw = value_copy4 };
                    }
                    
                    // Hash the branch node
                    const branch_node = TrieNode{ .Branch = branch };
                    const hash = try branch_node.hash(self.allocator);
                    const hash_str = try bytesToHexString(self.allocator, &hash);
                    
                    // Store the branch node
                    try self.nodes.put(hash_str, branch_node);
                    
                    // Create extension node for common prefix
                    if (common_prefix_len > 0) {
                        const common_prefix = try self.allocator.dupe(u8, nibbles[0..common_prefix_len]);
                        errdefer self.allocator.free(common_prefix);
                        const new_extension = try ExtensionNode.init(
                            self.allocator,
                            common_prefix,
                            HashValue{ .Hash = hash }
                        );
                        
                        return TrieNode{ .Extension = new_extension };
                    } else {
                        // No common prefix, return branch directly
                        return branch_node;
                    }
                }
                
                // This should be unreachable
                return TrieError.InvalidNode;
            },
            .Branch => |branch| {
                if (nibbles.len == 0) {
                    // Insert at the value position of the branch
                    var new_branch = branch;
                    if (new_branch.value) |*old_value| {
                        old_value.deinit(self.allocator);
                    }
                    new_branch.value = HashValue{ .Raw = value };
                    return TrieNode{ .Branch = new_branch };
                }
                
                // Get the first nibble as the key
                const key = nibbles[0];
                const remaining_path = nibbles[1..];
                
                // Check if there's already a child at this position
                if (branch.children_mask.isSet(@intCast(key))) {
                    // Get the existing child
                    const child = branch.children[key].?;
                    var next_node: TrieNode = undefined;
                    
                    switch (child) {
                        .Raw => |data| {
                            // Convert to a leaf node
                            const leaf = try LeafNode.init(
                                self.allocator,
                                try self.allocator.alloc(u8, 0), // Empty path
                                HashValue{ .Raw = try self.allocator.dupe(u8, data) }
                            );
                            next_node = TrieNode{ .Leaf = leaf };
                        },
                        .Hash => |hash| {
                            const hash_str = try bytesToHexString(self.allocator, &hash);
                            defer self.allocator.free(hash_str);
                            
                            next_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                        },
                    }
                    
                    // Continue insertion with the remaining path
                    const updated_node = try self.update(remaining_path, value, next_node);
                    
                    // Get hash of updated node
                    const hash = try updated_node.hash(self.allocator);
                    const hash_str = try bytesToHexString(self.allocator, &hash);
                    
                    // Store updated node
                    try self.nodes.put(hash_str, updated_node);
                    
                    // Update branch with new hash
                    var new_branch = branch;
                    if (new_branch.children[key]) |*old_value| {
                        old_value.deinit(self.allocator);
                    }
                    new_branch.children[key] = HashValue{ .Hash = hash };
                    new_branch.children_mask.set(@intCast(key));
                    
                    return TrieNode{ .Branch = new_branch };
                } else {
                    // No existing child, add a new one
                    var new_branch = branch;
                    
                    if (remaining_path.len == 0) {
                        // Insert directly into branch
                        // Create a value copy to ensure ownership
                        const value_copy7 = try self.allocator.dupe(u8, value);
                        errdefer self.allocator.free(value_copy7);
                        
                        new_branch.children[key] = HashValue{ .Raw = value_copy7 };
                        new_branch.children_mask.set(@intCast(key));
                    } else {
                        // Create a new leaf for the remaining path
                        const path_copy = try self.allocator.dupe(u8, remaining_path);
                        const leaf = try LeafNode.init(
                            self.allocator,
                            path_copy,
                            HashValue{ .Raw = value }
                        );
                        const new_node = TrieNode{ .Leaf = leaf };
                        
                        // Get hash of new node
                        const hash = try new_node.hash(self.allocator);
                        const hash_str = try bytesToHexString(self.allocator, &hash);
                        
                        // Store the node
                        try self.nodes.put(hash_str, new_node);
                        
                        // Update branch
                        new_branch.children[key] = HashValue{ .Hash = hash };
                        new_branch.children_mask.set(@intCast(key));
                    }
                    
                    return TrieNode{ .Branch = new_branch };
                }
            },
        }
    }
    
    /// Get a value from the trie
    fn getValue(self: *const HashBuilder, node: TrieNode, nibbles: []const u8) !?[]const u8 {
        switch (node) {
            .Empty => return null,
            .Leaf => |leaf| {
                // Check if paths match
                if (std.mem.eql(u8, leaf.nibbles, nibbles)) {
                    switch (leaf.value) {
                        .Raw => |data| return data,
                        .Hash => |hash| {
                            // This is unusual but possible - we'd need to follow the hash
                            const hash_str = try bytesToHexString(self.allocator, &hash);
                            defer self.allocator.free(hash_str);
                            
                            const next_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                            return try self.getValue(next_node, &[_]u8{});
                        },
                    }
                }
                return null; // No match
            },
            .Extension => |extension| {
                // Check if extension path is a prefix of our path
                if (nibbles.len < extension.nibbles.len) {
                    return null; // Path too short
                }
                
                // Compare the prefix
                if (!std.mem.eql(u8, extension.nibbles, nibbles[0..extension.nibbles.len])) {
                    return null; // Prefix doesn't match
                }
                
                // Follow the extension
                switch (extension.next) {
                    .Raw => {
                        // This shouldn't happen - extensions point to nodes
                        return TrieError.InvalidNode;
                    },
                    .Hash => |hash| {
                        const hash_str = try bytesToHexString(self.allocator, &hash);
                        defer self.allocator.free(hash_str);
                        
                        const next_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                        return try self.getValue(next_node, nibbles[extension.nibbles.len..]);
                    },
                }
            },
            .Branch => |branch| {
                if (nibbles.len == 0) {
                    // We've reached the end of our path
                    if (branch.value) |value| {
                        switch (value) {
                            .Raw => |data| return data,
                            .Hash => |hash| {
                                const hash_str = try bytesToHexString(self.allocator, &hash);
                                defer self.allocator.free(hash_str);
                                
                                const next_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                                return try self.getValue(next_node, &[_]u8{});
                            },
                        }
                    }
                    return null; // No value at this branch
                }
                
                // Get the next nibble
                const key = nibbles[0];
                
                // Check if there's a child at this position
                if (!branch.children_mask.isSet(@intCast(key))) {
                    return null; // No child at this position
                }
                
                const child = branch.children[key].?;
                switch (child) {
                    .Raw => |data| {
                        // Direct value in branch
                        if (nibbles.len == 1) {
                            return data;
                        }
                        return null; // Path too long
                    },
                    .Hash => |hash| {
                        const hash_str = try bytesToHexString(self.allocator, &hash);
                        defer self.allocator.free(hash_str);
                        
                        const next_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                        return try self.getValue(next_node, nibbles[1..]);
                    },
                }
            },
        }
    }
    
    /// Delete a key-value pair from the trie
    fn deleteKey(self: *HashBuilder, nibbles: []const u8, current_node: TrieNode) !?TrieNode {
        switch (current_node) {
            .Empty => return null, // Nothing to delete
            .Leaf => |leaf| {
                // Check if paths match
                if (std.mem.eql(u8, leaf.nibbles, nibbles)) {
                    // Found the node to delete
                    return null;
                }
                
                // No match, keep the node
                var leaf_copy = leaf;
                leaf_copy.nibbles = try self.allocator.dupe(u8, leaf.nibbles);
                // Use the clone method to properly handle memory ownership
                leaf_copy.value = try leaf.value.clone(self.allocator);
                return TrieNode{ .Leaf = leaf_copy };
            },
            .Extension => |extension| {
                // Check if extension path is a prefix of our path
                if (nibbles.len < extension.nibbles.len) {
                    return current_node; // Path too short, nothing to delete
                }
                
                // Compare the prefix
                if (!std.mem.eql(u8, extension.nibbles, nibbles[0..extension.nibbles.len])) {
                    return current_node; // Prefix doesn't match, nothing to delete
                }
                
                // Follow the extension
                var next_node: TrieNode = undefined;
                const hash = switch (extension.next) {
                    .Raw => return TrieError.InvalidNode, // Extensions shouldn't have raw values
                    .Hash => |h| h,
                };
                
                const hash_str = try bytesToHexString(self.allocator, &hash);
                defer self.allocator.free(hash_str);
                
                next_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                
                // Delete from the next node
                const result = try self.deleteKey(nibbles[extension.nibbles.len..], next_node);
                
                if (result == null) {
                    // Next node was deleted entirely
                    return null;
                }
                
                // Get the hash of the result
                const result_hash = try result.?.hash(self.allocator);
                const result_hash_str = try bytesToHexString(self.allocator, &result_hash);
                
                // Store the updated node
                try self.nodes.put(result_hash_str, result.?);
                
                // Create a new extension node with cloned data 
                const path_copy = try self.allocator.dupe(u8, extension.nibbles);
                errdefer self.allocator.free(path_copy);
                
                const new_extension = try ExtensionNode.init(
                    self.allocator,
                    path_copy,
                    HashValue{ .Hash = result_hash }
                );
                
                return TrieNode{ .Extension = new_extension };
            },
            .Branch => |branch| {
                if (nibbles.len == 0) {
                    // We're deleting the value at this branch
                    var new_branch = branch;
                    if (new_branch.value) |*value| {
                        value.deinit(self.allocator);
                        new_branch.value = null;
                    }
                    
                    // Check if branch is now empty or has only one child
                    const child_count: u5 = new_branch.children_mask.bitCount();
                    if (child_count == 0) {
                        // Branch is empty
                        return null;
                    } else if (child_count == 1) {
                        // Branch has only one child, collapse it
                        var child_index: ?u4 = null;
                        for (0..16) |i| {
                            if (new_branch.children_mask.isSet(@intCast(i))) {
                                child_index = @intCast(i);
                                break;
                            }
                        }
                        
                        if (child_index == null) {
                            return TrieError.CorruptedTrie;
                        }
                        
                        const child = new_branch.children[child_index.?].?;
                        switch (child) {
                            .Raw => |data| {
                                // Create a leaf node directly
                                const path = try self.allocator.alloc(u8, 1);
                                path[0] = child_index.?;
                                
                                const leaf = try LeafNode.init(
                                    self.allocator,
                                    path,
                                    HashValue{ .Raw = try self.allocator.dupe(u8, data) }
                                );
                                
                                return TrieNode{ .Leaf = leaf };
                            },
                            .Hash => |hash| {
                                const hash_str = try bytesToHexString(self.allocator, &hash);
                                defer self.allocator.free(hash_str);
                                
                                const next_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                                
                                // The child could be a leaf, extension, or branch
                                switch (next_node) {
                                    .Empty => unreachable, // Hash points to a node
                                    .Leaf => |leaf| {
                                        // Combine paths
                                        const new_path = try self.allocator.alloc(u8, leaf.nibbles.len + 1);
                                        new_path[0] = child_index.?;
                                        @memcpy(new_path[1..], leaf.nibbles);
                                        
                                        const new_leaf = try LeafNode.init(
                                            self.allocator,
                                            new_path,
                                            switch (leaf.value) {
                                                .Raw => |data| HashValue{ .Raw = try self.allocator.dupe(u8, data) },
                                                .Hash => |h| HashValue{ .Hash = h },
                                            }
                                        );
                                        
                                        return TrieNode{ .Leaf = new_leaf };
                                    },
                                    .Extension => |ext| {
                                        // Combine paths
                                        const new_path = try self.allocator.alloc(u8, ext.nibbles.len + 1);
                                        new_path[0] = child_index.?;
                                        @memcpy(new_path[1..], ext.nibbles);
                                        
                                        const new_ext = try ExtensionNode.init(
                                            self.allocator,
                                            new_path,
                                            switch (ext.next) {
                                                .Raw => |data| HashValue{ .Raw = try self.allocator.dupe(u8, data) },
                                                .Hash => |h| HashValue{ .Hash = h },
                                            }
                                        );
                                        
                                        return TrieNode{ .Extension = new_ext };
                                    },
                                    .Branch => |_| {
                                        // Create extension to the branch
                                        const path = try self.allocator.alloc(u8, 1);
                                        path[0] = child_index.?;
                                        
                                        const new_ext = try ExtensionNode.init(
                                            self.allocator,
                                            path,
                                            HashValue{ .Hash = hash }
                                        );
                                        
                                        return TrieNode{ .Extension = new_ext };
                                    },
                                }
                            },
                        }
                    }
                    
                    // Branch still has multiple children
                    return TrieNode{ .Branch = new_branch };
                }
                
                // Delete from a child
                const key = nibbles[0];
                
                // If the key doesn't exist, nothing to delete
                if (!branch.children_mask.isSet(@intCast(key))) {
                    return current_node;
                }
                
                const child = branch.children[key].?;
                var next_node: TrieNode = undefined;
                
                switch (child) {
                    .Raw => |data| {
                        // Create a leaf for the raw data
                        const empty_path = try self.allocator.alloc(u8, 0);
                        errdefer self.allocator.free(empty_path);
                        
                        const data_copy = try self.allocator.dupe(u8, data);
                        errdefer self.allocator.free(data_copy);
                        
                        const leaf = try LeafNode.init(
                            self.allocator,
                            empty_path,
                            HashValue{ .Raw = data_copy }
                        );
                        next_node = TrieNode{ .Leaf = leaf };
                    },
                    .Hash => |hash| {
                        const hash_str = try bytesToHexString(self.allocator, &hash);
                        defer self.allocator.free(hash_str);
                        
                        next_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                    },
                }
                
                // Delete from the child node
                const result = try self.deleteKey(nibbles[1..], next_node);
                
                // Create a new branch with the updated child
                var new_branch = branch;
                if (result == null) {
                    // Child was deleted entirely
                    if (new_branch.children[key]) |*old_value| {
                        old_value.deinit(self.allocator);
                    }
                    new_branch.children[key] = null;
                    new_branch.children_mask.unset(@intCast(key));
                    
                    // Check if branch now has only one child and no value
                    const child_count: u5 = new_branch.children_mask.bitCount();
                    if (child_count == 0 and new_branch.value == null) {
                        // Branch is empty
                        return null;
                    } else if (child_count == 1 and new_branch.value == null) {
                        // Branch has only one child, collapse it
                        var child_index: ?u4 = null;
                        for (0..16) |i| {
                            if (new_branch.children_mask.isSet(@intCast(i))) {
                                child_index = @intCast(i);
                                break;
                            }
                        }
                        
                        if (child_index == null) {
                            return TrieError.CorruptedTrie;
                        }
                        
                        const remaining_child = new_branch.children[child_index.?].?;
                        switch (remaining_child) {
                            .Raw => |data| {
                                // Create a leaf node directly
                                const path = try self.allocator.alloc(u8, 1);
                                path[0] = child_index.?;
                                
                                const leaf = try LeafNode.init(
                                    self.allocator,
                                    path,
                                    HashValue{ .Raw = try self.allocator.dupe(u8, data) }
                                );
                                
                                return TrieNode{ .Leaf = leaf };
                            },
                            .Hash => |hash| {
                                const hash_str = try bytesToHexString(self.allocator, &hash);
                                defer self.allocator.free(hash_str);
                                
                                const child_node = self.nodes.get(hash_str) orelse return TrieError.NonExistentNode;
                                
                                // The child could be a leaf, extension, or branch
                                switch (child_node) {
                                    .Empty => unreachable, // Hash points to a node
                                    .Leaf => |leaf| {
                                        // Combine paths
                                        const new_path = try self.allocator.alloc(u8, leaf.nibbles.len + 1);
                                        new_path[0] = child_index.?;
                                        @memcpy(new_path[1..], leaf.nibbles);
                                        
                                        const new_leaf = try LeafNode.init(
                                            self.allocator,
                                            new_path,
                                            switch (leaf.value) {
                                                .Raw => |data| HashValue{ .Raw = try self.allocator.dupe(u8, data) },
                                                .Hash => |h| HashValue{ .Hash = h },
                                            }
                                        );
                                        
                                        return TrieNode{ .Leaf = new_leaf };
                                    },
                                    .Extension => |ext| {
                                        // Combine paths
                                        const new_path = try self.allocator.alloc(u8, ext.nibbles.len + 1);
                                        new_path[0] = child_index.?;
                                        @memcpy(new_path[1..], ext.nibbles);
                                        
                                        const new_ext = try ExtensionNode.init(
                                            self.allocator,
                                            new_path,
                                            switch (ext.next) {
                                                .Raw => |data| HashValue{ .Raw = try self.allocator.dupe(u8, data) },
                                                .Hash => |h| HashValue{ .Hash = h },
                                            }
                                        );
                                        
                                        return TrieNode{ .Extension = new_ext };
                                    },
                                    .Branch => |_| {
                                        // Create extension to the branch
                                        const path = try self.allocator.alloc(u8, 1);
                                        path[0] = child_index.?;
                                        
                                        const new_ext = try ExtensionNode.init(
                                            self.allocator,
                                            path,
                                            HashValue{ .Hash = hash }
                                        );
                                        
                                        return TrieNode{ .Extension = new_ext };
                                    },
                                }
                            },
                        }
                    }
                } else {
                    // Child was updated
                    if (new_branch.children[key]) |*old_value| {
                        old_value.deinit(self.allocator);
                    }
                    
                    // Get the hash of the updated child
                    const hash = try result.?.hash(self.allocator);
                    const hash_str = try bytesToHexString(self.allocator, &hash);
                    
                    // Store the updated child
                    try self.nodes.put(hash_str, result.?);
                    
                    // Update the branch
                    new_branch.children[key] = HashValue{ .Hash = hash };
                    new_branch.children_mask.set(@intCast(key));
                }
                
                return TrieNode{ .Branch = new_branch };
            },
        }
    }
};

// Helper functions

/// Find the length of the common prefix of two byte slices
fn commonPrefixLength(a: []const u8, b: []const u8) usize {
    const min_len = @min(a.len, b.len);
    var i: usize = 0;
    while (i < min_len and a[i] == b[i]) : (i += 1) {}
    return i;
}

/// Convert a byte array to a hex string
fn bytesToHexString(allocator: Allocator, bytes: []const u8) ![]u8 {
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

test "HashBuilder - insert and get" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var builder = HashBuilder.init(allocator);
    defer builder.deinit();
    
    // Empty trie has no root
    try testing.expect(builder.rootHash() == null);
    
    // Insert a key-value pair
    try builder.insert(&[_]u8{1, 2, 3}, "value1");
    
    // Root should be set
    try testing.expect(builder.rootHash() != null);
    
    // Get the value
    const value = try builder.get(&[_]u8{1, 2, 3});
    try testing.expect(value != null);
    try testing.expectEqualStrings("value1", value.?);
    
    // Get a non-existent key
    const missing = try builder.get(&[_]u8{4, 5, 6});
    try testing.expect(missing == null);
    
    // Insert another key
    try builder.insert(&[_]u8{1, 2, 4}, "value2");
    
    // Get both values
    const value1 = try builder.get(&[_]u8{1, 2, 3});
    try testing.expect(value1 != null);
    try testing.expectEqualStrings("value1", value1.?);
    
    const value2 = try builder.get(&[_]u8{1, 2, 4});
    try testing.expect(value2 != null);
    try testing.expectEqualStrings("value2", value2.?);
}

test "HashBuilder - delete" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var builder = HashBuilder.init(allocator);
    defer builder.deinit();
    
    // Insert some key-value pairs
    try builder.insert(&[_]u8{1, 2, 3}, "value1");
    try builder.insert(&[_]u8{1, 2, 4}, "value2");
    try builder.insert(&[_]u8{5, 6, 7}, "value3");
    
    // Delete a key
    try builder.delete(&[_]u8{1, 2, 3});
    
    // Value should be gone
    const value1 = try builder.get(&[_]u8{1, 2, 3});
    try testing.expect(value1 == null);
    
    // Other values still present
    const value2 = try builder.get(&[_]u8{1, 2, 4});
    try testing.expect(value2 != null);
    try testing.expectEqualStrings("value2", value2.?);
    
    const value3 = try builder.get(&[_]u8{5, 6, 7});
    try testing.expect(value3 != null);
    try testing.expectEqualStrings("value3", value3.?);
    
    // Delete all keys
    try builder.delete(&[_]u8{1, 2, 4});
    try builder.delete(&[_]u8{5, 6, 7});
    
    // Trie should be empty
    try testing.expect(builder.rootHash() == null);
}

test "HashBuilder - update existing" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var builder = HashBuilder.init(allocator);
    defer builder.deinit();
    
    // Insert a key-value pair
    try builder.insert(&[_]u8{1, 2, 3}, "value1");
    
    // Update it
    try builder.insert(&[_]u8{1, 2, 3}, "updated");
    
    // Get the updated value
    const value = try builder.get(&[_]u8{1, 2, 3});
    try testing.expect(value != null);
    try testing.expectEqualStrings("updated", value.?);
}

test "HashBuilder - common prefixes" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var builder = HashBuilder.init(allocator);
    defer builder.deinit();
    
    // Insert keys with common prefixes
    try builder.insert(&[_]u8{1, 2, 3, 4}, "value1");
    try builder.insert(&[_]u8{1, 2, 3, 5}, "value2");
    try builder.insert(&[_]u8{1, 2, 4, 5}, "value3");
    
    // Get values
    const value1 = try builder.get(&[_]u8{1, 2, 3, 4});
    try testing.expect(value1 != null);
    try testing.expectEqualStrings("value1", value1.?);
    
    const value2 = try builder.get(&[_]u8{1, 2, 3, 5});
    try testing.expect(value2 != null);
    try testing.expectEqualStrings("value2", value2.?);
    
    const value3 = try builder.get(&[_]u8{1, 2, 4, 5});
    try testing.expect(value3 != null);
    try testing.expectEqualStrings("value3", value3.?);
    
    // Delete a value
    try builder.delete(&[_]u8{1, 2, 3, 4});
    
    // Verify it's gone
    const deleted = try builder.get(&[_]u8{1, 2, 3, 4});
    try testing.expect(deleted == null);
    
    // Others still present
    const still2 = try builder.get(&[_]u8{1, 2, 3, 5});
    try testing.expect(still2 != null);
    try testing.expectEqualStrings("value2", still2.?);
    
    const still3 = try builder.get(&[_]u8{1, 2, 4, 5});
    try testing.expect(still3 != null);
    try testing.expectEqualStrings("value3", still3.?);
}

test "HashBuilder - reset" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var builder = HashBuilder.init(allocator);
    defer builder.deinit();
    
    // Insert some key-value pairs
    try builder.insert(&[_]u8{1, 2, 3}, "value1");
    try builder.insert(&[_]u8{4, 5, 6}, "value2");
    
    // Reset the builder
    builder.reset();
    
    // Trie should be empty
    try testing.expect(builder.rootHash() == null);
    
    // Values should be gone
    const value1 = try builder.get(&[_]u8{1, 2, 3});
    try testing.expect(value1 == null);
    
    const value2 = try builder.get(&[_]u8{4, 5, 6});
    try testing.expect(value2 == null);
}