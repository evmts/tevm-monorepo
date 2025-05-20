const std = @import("std");
const Allocator = std.mem.Allocator;
const trie = @import("trie.zig");
const rlp = @import("../Rlp/rlp.zig");

const TrieMask = trie.TrieMask;
const HashValue = trie.HashValue;

/// More memory-efficient branch node implementation with compact storage
/// This is a performance enhancement from the Alloy implementation
pub const CompactBranchNode = struct {
    /// Mask indicating which child positions have values
    children_mask: TrieMask = TrieMask.init(),
    /// Mask indicating which child positions have "tree" nodes (vs direct values)
    tree_mask: TrieMask = TrieMask.init(),
    /// Mask indicating which child positions use hashed nodes
    hash_mask: TrieMask = TrieMask.init(),
    /// Compact children array - only stores non-null entries
    children: std.ArrayList(HashValue),
    /// Terminator value (if any)
    value: ?HashValue = null,
    
    pub fn init(allocator: Allocator) CompactBranchNode {
        return CompactBranchNode{
            .children = std.ArrayList(HashValue).init(allocator),
        };
    }
    
    pub fn deinit(self: *CompactBranchNode) void {
        for (self.children.items) |value| {
            value.deinit(self.children.allocator);
        }
        self.children.deinit();
        if (self.value) |value| {
            value.deinit(self.children.allocator);
        }
    }
    
    /// Adds a child at the specified position
    pub fn addChild(self: *CompactBranchNode, index: u4, value: HashValue, is_tree: bool, is_hash: bool) !void {
        if (self.children_mask.isSet(index)) {
            // Replace existing child
            var idx: usize = 0;
            var current_index: u4 = 0;
            
            // Find the child position in the compact array
            while (current_index < index) : (current_index += 1) {
                if (self.children_mask.isSet(current_index)) {
                    idx += 1;
                }
            }
            
            // Free the old value
            self.children.items[idx].deinit(self.children.allocator);
            
            // Replace with the new value
            self.children.items[idx] = value;
        } else {
            // Add new child
            // Count how many children are before this index
            var count: usize = 0;
            for (0..index) |i| {
                if (self.children_mask.isSet(@intCast(i))) {
                    count += 1;
                }
            }
            
            // Insert at the correct position
            try self.children.insert(count, value);
            
            // Update the mask
            self.children_mask.set(index);
        }
        
        // Update the tree and hash masks
        if (is_tree) {
            self.tree_mask.set(index);
        } else {
            self.tree_mask.unset(index);
        }
        
        if (is_hash) {
            self.hash_mask.set(index);
        } else {
            self.hash_mask.unset(index);
        }
    }
    
    /// Get the child at the specified position
    pub fn getChild(self: *const CompactBranchNode, index: u4) ?HashValue {
        if (!self.children_mask.isSet(index)) {
            return null;
        }
        
        // Count how many children are before this index
        var count: usize = 0;
        for (0..index) |i| {
            if (self.children_mask.isSet(@intCast(i))) {
                count += 1;
            }
        }
        
        return self.children.items[count];
    }
    
    /// Removes a child at the specified position
    pub fn removeChild(self: *CompactBranchNode, index: u4) !void {
        if (!self.children_mask.isSet(index)) {
            return; // Nothing to remove
        }
        
        // Count how many children are before this index
        var count: usize = 0;
        for (0..index) |i| {
            if (self.children_mask.isSet(@intCast(i))) {
                count += 1;
            }
        }
        
        // Free the value
        self.children.items[count].deinit(self.children.allocator);
        
        // Remove from the array
        _ = self.children.orderedRemove(count);
        
        // Update the masks
        self.children_mask.unset(index);
        self.tree_mask.unset(index);
        self.hash_mask.unset(index);
    }
    
    /// Convert to regular branch node
    pub fn toBranchNode(self: *const CompactBranchNode, allocator: Allocator) !trie.BranchNode {
        var branch = trie.BranchNode.init();
        
        // Copy the masks
        branch.children_mask = self.children_mask;
        
        // Copy the values
        for (0..16) |i| {
            if (self.children_mask.isSet(@intCast(i))) {
                const child = self.getChild(@intCast(i)).?;
                branch.children[i] = switch (child) {
                    .Raw => |data| HashValue{ .Raw = try allocator.dupe(u8, data) },
                    .Hash => |hash| HashValue{ .Hash = hash },
                };
            }
        }
        
        // Copy the value
        if (self.value) |val| {
            branch.value = switch (val) {
                .Raw => |data| HashValue{ .Raw = try allocator.dupe(u8, data) },
                .Hash => |hash| HashValue{ .Hash = hash },
            };
        }
        
        return branch;
    }
    
    /// Check if the branch is empty
    pub fn isEmpty(self: *const CompactBranchNode) bool {
        return self.children_mask.isEmpty() and self.value == null;
    }
    
    /// Check if the branch has only one child and no value
    pub fn hasOnlyOneChild(self: *const CompactBranchNode) bool {
        return self.children_mask.bitCount() == 1 and self.value == null;
    }
    
    /// Get the only child's index, if there is only one
    pub fn getOnlyChildIndex(self: *const CompactBranchNode) ?u4 {
        if (!self.hasOnlyOneChild()) {
            return null;
        }
        
        for (0..16) |i| {
            if (self.children_mask.isSet(@intCast(i))) {
                return @intCast(i);
            }
        }
        
        return null; // Should not reach here
    }
    
    /// RLP encode the branch node
    pub fn encode(self: *const CompactBranchNode, allocator: Allocator) ![]u8 {
        var encoded_children = std.ArrayList([]u8).init(allocator);
        defer {
            for (encoded_children.items) |item| {
                allocator.free(item);
            }
            encoded_children.deinit();
        }
        
        // Encode each child or an empty string
        for (0..16) |i| {
            if (self.children_mask.isSet(@intCast(i))) {
                const child = self.getChild(@intCast(i)).?;
                switch (child) {
                    .Raw => |data| {
                        const encoded = try rlp.encode(allocator, data);
                        try encoded_children.append(encoded);
                    },
                    .Hash => |hash| {
                        const encoded = try rlp.encode(allocator, &hash);
                        try encoded_children.append(encoded);
                    },
                }
            } else {
                const empty = try rlp.encode(allocator, "");
                try encoded_children.append(empty);
            }
        }
        
        // Encode value or empty string
        if (self.value) |value| {
            switch (value) {
                .Raw => |data| {
                    const encoded = try rlp.encode(allocator, data);
                    try encoded_children.append(encoded);
                },
                .Hash => |hash| {
                    const encoded = try rlp.encode(allocator, &hash);
                    try encoded_children.append(encoded);
                },
            }
        } else {
            const empty = try rlp.encode(allocator, "");
            try encoded_children.append(empty);
        }
        
        // Encode the entire node as a list
        return try rlp.encode(allocator, encoded_children.items);
    }
};

// Tests

test "CompactBranchNode - basic operations" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var branch = CompactBranchNode.init(allocator);
    defer branch.deinit();
    
    // Start empty
    try testing.expect(branch.isEmpty());
    try testing.expect(!branch.hasOnlyOneChild());
    try testing.expect(branch.getOnlyChildIndex() == null);
    
    // Add one child
    const value1 = try allocator.dupe(u8, "value1");
    try branch.addChild(3, HashValue{ .Raw = value1 }, false, false);
    
    try testing.expect(!branch.isEmpty());
    try testing.expect(branch.hasOnlyOneChild());
    try testing.expect(branch.getOnlyChildIndex() != null);
    try testing.expectEqual(@as(u4, 3), branch.getOnlyChildIndex().?);
    
    // Get the child
    const child = branch.getChild(3);
    try testing.expect(child != null);
    switch (child.?) {
        .Raw => |data| try testing.expectEqualStrings("value1", data),
        .Hash => unreachable,
    }
    
    // Add another child
    const hash2 = [_]u8{0} ** 32;
    var hash2_copy: [32]u8 = undefined;
    @memcpy(&hash2_copy, &hash2);
    try branch.addChild(7, HashValue{ .Hash = hash2_copy }, true, true);
    
    try testing.expect(!branch.isEmpty());
    try testing.expect(!branch.hasOnlyOneChild());
    try testing.expect(branch.getOnlyChildIndex() == null);
    
    // Convert to regular branch
    const regular_branch = try branch.toBranchNode(allocator);
    var branch_copy = regular_branch;
    defer branch_copy.deinit(allocator);
    
    try testing.expect(regular_branch.children_mask.isSet(3));
    try testing.expect(regular_branch.children_mask.isSet(7));
    try testing.expect(!regular_branch.children_mask.isSet(0));
    
    // Remove children
    try branch.removeChild(3);
    try testing.expect(!branch.isEmpty());
    try testing.expect(branch.hasOnlyOneChild());
    try testing.expect(branch.getOnlyChildIndex() != null);
    try testing.expectEqual(@as(u4, 7), branch.getOnlyChildIndex().?);
    
    try branch.removeChild(7);
    try testing.expect(branch.isEmpty());
}