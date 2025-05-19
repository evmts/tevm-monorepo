const std = @import("std");
const Allocator = std.mem.Allocator;
const rlp = @import("Rlp");
const utils = @import("Utils");

/// Error type for trie operations
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

/// 16-bit mask for efficient representation of children
pub const TrieMask = struct {
    mask: u16,

    pub fn init() TrieMask {
        return TrieMask{ .mask = 0 };
    }

    pub fn set(self: *TrieMask, index: u4) void {
        const bit = @as(u16, 1) << index;
        self.mask |= bit;
    }

    pub fn unset(self: *TrieMask, index: u4) void {
        const bit = @as(u16, 1) << index;
        self.mask &= ~bit;
    }

    pub fn isSet(self: TrieMask, index: u4) bool {
        const bit = @as(u16, 1) << index;
        return (self.mask & bit) != 0;
    }

    pub fn bitCount(self: TrieMask) u5 {
        var count: u5 = 0;
        var mask = self.mask;
        while (mask != 0) : (mask &= mask - 1) {
            count += 1;
        }
        return count;
    }

    pub fn isEmpty(self: TrieMask) bool {
        return self.mask == 0;
    }
};

/// Represents different node types in the trie
pub const NodeType = enum {
    Empty,
    Branch,
    Extension,
    Leaf,
};

/// Value stored in trie - either raw bytes or a hash
pub const HashValue = union(enum) {
    Raw: []const u8,
    Hash: [32]u8,

    pub fn deinit(self: HashValue, allocator: Allocator) void {
        switch (self) {
            .Raw => |data| allocator.free(data),
            .Hash => {}, // Hashes are static/fixed size
        }
    }

    pub fn hash(self: HashValue, allocator: Allocator) ![32]u8 {
        switch (self) {
            .Hash => |h| return h,
            .Raw => |data| {
                // RLP encode the data first
                const encoded = try rlp.encode(allocator, data);
                defer allocator.free(encoded);
                
                // Then calculate the hash
                var hash_output: [32]u8 = undefined;
                std.crypto.hash.sha3.Keccak256.hash(encoded, &hash_output, .{});
                return hash_output;
            },
        }
    }
};

/// Branch node in the trie with up to 16 children (one per nibble)
pub const BranchNode = struct {
    children: [16]?HashValue = [_]?HashValue{null} ** 16,
    value: ?HashValue = null,
    children_mask: TrieMask = TrieMask.init(),

    pub fn init() BranchNode {
        return BranchNode{};
    }

    pub fn deinit(self: *BranchNode, allocator: Allocator) void {
        for (self.children, 0..) |child, i| {
            if (child != null and self.children_mask.isSet(@intCast(i))) {
                child.?.deinit(allocator);
            }
        }
        if (self.value) |value| {
            value.deinit(allocator);
        }
    }

    pub fn isEmpty(self: BranchNode) bool {
        return self.children_mask.isEmpty() and self.value == null;
    }

    pub fn encode(self: BranchNode, allocator: Allocator) ![]u8 {
        var encoded_children = std.ArrayList([]u8).init(allocator);
        defer {
            for (encoded_children.items) |item| {
                allocator.free(item);
            }
            encoded_children.deinit();
        }

        // Encode each child or an empty string
        for (self.children) |child| {
            if (child) |value| {
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

/// Extension node - compresses shared path prefixes
pub const ExtensionNode = struct {
    nibbles: []u8,
    next: HashValue,

    pub fn init(allocator: Allocator, path: []const u8, next: HashValue) !ExtensionNode {
        const nibbles = try allocator.dupe(u8, path);
        return ExtensionNode{
            .nibbles = nibbles,
            .next = next,
        };
    }

    pub fn deinit(self: *ExtensionNode, allocator: Allocator) void {
        allocator.free(self.nibbles);
        self.next.deinit(allocator);
    }

    pub fn encode(self: ExtensionNode, allocator: Allocator) ![]u8 {
        var items = std.ArrayList([]u8).init(allocator);
        defer {
            for (items.items) |item| {
                allocator.free(item);
            }
            items.deinit();
        }

        // Encode the path
        const encoded_path = try encodePath(allocator, self.nibbles, false);
        try items.append(encoded_path);

        // Encode the next node
        const encoded_next = switch (self.next) {
            .Raw => |data| try rlp.encode(allocator, data),
            .Hash => |hash| try rlp.encode(allocator, &hash),
        };
        try items.append(encoded_next);

        // Encode as a list
        return try rlp.encode(allocator, items.items);
    }
};

/// Leaf node - stores actual key-value pairs
pub const LeafNode = struct {
    nibbles: []u8,
    value: HashValue,

    pub fn init(allocator: Allocator, path: []const u8, value: HashValue) !LeafNode {
        const nibbles = try allocator.dupe(u8, path);
        return LeafNode{
            .nibbles = nibbles,
            .value = value,
        };
    }

    pub fn deinit(self: *LeafNode, allocator: Allocator) void {
        allocator.free(self.nibbles);
        self.value.deinit(allocator);
    }

    pub fn encode(self: LeafNode, allocator: Allocator) ![]u8 {
        var items = std.ArrayList([]u8).init(allocator);
        defer {
            for (items.items) |item| {
                allocator.free(item);
            }
            items.deinit();
        }

        // Encode the path
        const encoded_path = try encodePath(allocator, self.nibbles, true);
        try items.append(encoded_path);

        // Encode the value
        const encoded_value = switch (self.value) {
            .Raw => |data| try rlp.encode(allocator, data),
            .Hash => |hash| try rlp.encode(allocator, &hash),
        };
        try items.append(encoded_value);

        // Encode as a list
        return try rlp.encode(allocator, items.items);
    }
};

/// The main trie node type
pub const TrieNode = union(NodeType) {
    Empty: void,
    Branch: BranchNode,
    Extension: ExtensionNode,
    Leaf: LeafNode,

    pub fn deinit(self: *TrieNode, allocator: Allocator) void {
        switch (self.*) {
            .Empty => {},
            .Branch => |*branch| branch.deinit(allocator),
            .Extension => |*extension| extension.deinit(allocator),
            .Leaf => |*leaf| leaf.deinit(allocator),
        }
    }

    pub fn encode(self: TrieNode, allocator: Allocator) ![]u8 {
        return switch (self) {
            .Empty => try rlp.encode(allocator, ""),
            .Branch => |branch| try branch.encode(allocator),
            .Extension => |extension| try extension.encode(allocator),
            .Leaf => |leaf| try leaf.encode(allocator),
        };
    }

    pub fn hash(self: TrieNode, allocator: Allocator) ![32]u8 {
        const encoded = try self.encode(allocator);
        defer allocator.free(encoded);

        var hash_output: [32]u8 = undefined;
        std.crypto.hash.sha3.Keccak256.hash(encoded, &hash_output, .{});
        return hash_output;
    }
};

/// Converts hex key to nibbles
pub fn keyToNibbles(allocator: Allocator, key: []const u8) ![]u8 {
    const nibbles = try allocator.alloc(u8, key.len * 2);
    errdefer allocator.free(nibbles);

    for (key, 0..) |byte, i| {
        nibbles[i * 2] = byte >> 4;
        nibbles[i * 2 + 1] = byte & 0x0F;
    }

    return nibbles;
}

/// Converts nibbles back to hex key
pub fn nibblesToKey(allocator: Allocator, nibbles: []const u8) ![]u8 {
    // Must have even number of nibbles
    if (nibbles.len % 2 != 0) {
        return TrieError.InvalidKey;
    }

    const key = try allocator.alloc(u8, nibbles.len / 2);
    errdefer allocator.free(key);

    var i: usize = 0;
    while (i < nibbles.len) : (i += 2) {
        key[i / 2] = (nibbles[i] << 4) | nibbles[i + 1];
    }

    return key;
}

/// Encodes a path for either leaf or extension nodes
fn encodePath(allocator: Allocator, nibbles: []const u8, is_leaf: bool) ![]u8 {
    // Create a new array for the encoded path
    const hex_arr = try allocator.alloc(u8, (nibbles.len + 1) / 2);
    errdefer allocator.free(hex_arr);

    if (nibbles.len % 2 == 0) {
        // Even number of nibbles
        hex_arr[0] = if (is_leaf) 0x20 else 0x00;
        for (1..hex_arr.len) |i| {
            hex_arr[i] = (nibbles[(i - 1) * 2] << 4) | nibbles[(i - 1) * 2 + 1];
        }
    } else {
        // Odd number of nibbles
        hex_arr[0] = if (is_leaf) 0x30 else 0x10 | nibbles[0];
        for (1..hex_arr.len) |i| {
            hex_arr[i] = (nibbles[i * 2 - 1] << 4) | nibbles[i * 2];
        }
    }

    return hex_arr;
}

/// Decodes a path into nibbles
pub fn decodePath(allocator: Allocator, encoded_path: []const u8) !struct { 
    nibbles: []u8, 
    is_leaf: bool 
} {
    if (encoded_path.len == 0) {
        return TrieError.InvalidPath;
    }

    const prefix = encoded_path[0];
    const prefix_nibble = prefix >> 4;
    const is_leaf = prefix_nibble == 2 or prefix_nibble == 3;
    const has_odd_nibble = prefix_nibble == 1 or prefix_nibble == 3;
    
    const nibble_count = encoded_path.len * 2 - @intFromBool(!has_odd_nibble);
    const nibbles = try allocator.alloc(u8, nibble_count);
    errdefer allocator.free(nibbles);

    if (has_odd_nibble) {
        nibbles[0] = prefix & 0x0F;
        for (1..encoded_path.len) |i| {
            nibbles[i * 2 - 1] = encoded_path[i] >> 4;
            nibbles[i * 2] = encoded_path[i] & 0x0F;
        }
    } else {
        for (0..encoded_path.len - 1) |i| {
            nibbles[i * 2] = encoded_path[i + 1] >> 4;
            nibbles[i * 2 + 1] = encoded_path[i + 1] & 0x0F;
        }
    }

    return .{ .nibbles = nibbles, .is_leaf = is_leaf };
}

/// The main HashBuilder for constructing Merkle Patricia Tries
pub const HashBuilder = struct {
    allocator: Allocator,
    hashed_nodes: std.StringHashMap(TrieNode),

    pub fn init(allocator: Allocator) HashBuilder {
        return HashBuilder{
            .allocator = allocator,
            .hashed_nodes = std.StringHashMap(TrieNode).init(allocator),
        };
    }

    pub fn deinit(self: *HashBuilder) void {
        var it = self.hashed_nodes.iterator();
        while (it.next()) |entry| {
            var node = entry.value_ptr.*;
            node.deinit(self.allocator);
        }
        self.hashed_nodes.deinit();
    }

    // Main interface functions and implementations will be added here
};

// Tests

test "TrieMask operations" {
    const testing = std.testing;
    
    var mask = TrieMask.init();
    try testing.expect(mask.isEmpty());
    try testing.expectEqual(@as(u5, 0), mask.bitCount());
    
    mask.set(1);
    try testing.expect(!mask.isEmpty());
    try testing.expectEqual(@as(u5, 1), mask.bitCount());
    try testing.expect(mask.isSet(1));
    try testing.expect(!mask.isSet(2));
    
    mask.set(3);
    try testing.expectEqual(@as(u5, 2), mask.bitCount());
    
    mask.unset(1);
    try testing.expectEqual(@as(u5, 1), mask.bitCount());
    try testing.expect(!mask.isSet(1));
    try testing.expect(mask.isSet(3));
    
    mask.unset(3);
    try testing.expect(mask.isEmpty());
}

test "keyToNibbles and nibblesToKey" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const key = [_]u8{ 0x12, 0x34, 0xAB, 0xCD };
    const nibbles = try keyToNibbles(allocator, &key);
    defer allocator.free(nibbles);
    
    try testing.expectEqual(@as(usize, 8), nibbles.len);
    try testing.expectEqual(@as(u8, 1), nibbles[0]);
    try testing.expectEqual(@as(u8, 2), nibbles[1]);
    try testing.expectEqual(@as(u8, 3), nibbles[2]);
    try testing.expectEqual(@as(u8, 4), nibbles[3]);
    try testing.expectEqual(@as(u8, 10), nibbles[4]);
    try testing.expectEqual(@as(u8, 11), nibbles[5]);
    try testing.expectEqual(@as(u8, 12), nibbles[6]);
    try testing.expectEqual(@as(u8, 13), nibbles[7]);
    
    const round_trip = try nibblesToKey(allocator, nibbles);
    defer allocator.free(round_trip);
    
    try testing.expectEqualSlices(u8, &key, round_trip);
}

test "encodePath and decodePath" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Test with even number of nibbles - extension node
    {
        const nibbles = [_]u8{ 1, 2, 3, 4 };
        const encoded = try encodePath(allocator, &nibbles, false);
        defer allocator.free(encoded);
        
        try testing.expectEqual(@as(usize, 3), encoded.len);
        try testing.expectEqual(@as(u8, 0x00), encoded[0]);
        try testing.expectEqual(@as(u8, 0x12), encoded[1]);
        try testing.expectEqual(@as(u8, 0x34), encoded[2]);
        
        const decoded = try decodePath(allocator, encoded);
        defer allocator.free(decoded.nibbles);
        
        try testing.expectEqual(false, decoded.is_leaf);
        try testing.expectEqualSlices(u8, &nibbles, decoded.nibbles);
    }
    
    // Test with odd number of nibbles - leaf node
    {
        const nibbles = [_]u8{ 1, 2, 3, 4, 5 };
        const encoded = try encodePath(allocator, &nibbles, true);
        defer allocator.free(encoded);
        
        try testing.expectEqual(@as(usize, 3), encoded.len);
        try testing.expectEqual(@as(u8, 0x31), encoded[0]);
        try testing.expectEqual(@as(u8, 0x23), encoded[1]);
        try testing.expectEqual(@as(u8, 0x45), encoded[2]);
        
        const decoded = try decodePath(allocator, encoded);
        defer allocator.free(decoded.nibbles);
        
        try testing.expectEqual(true, decoded.is_leaf);
        try testing.expectEqualSlices(u8, &nibbles, decoded.nibbles);
    }
}

test "BranchNode encoding" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var branch = BranchNode.init();
    defer branch.deinit(allocator);
    
    const data1 = "value1";
    const data1_copy = try allocator.dupe(u8, data1);
    branch.children[1] = HashValue{ .Raw = data1_copy };
    branch.children_mask.set(1);
    
    const data2 = "value2";
    const data2_copy = try allocator.dupe(u8, data2);
    branch.children[9] = HashValue{ .Raw = data2_copy };
    branch.children_mask.set(9);
    
    const encoded = try branch.encode(allocator);
    defer allocator.free(encoded);
    
    // With RLP, we can only verify encoding-decoding roundtrip because
    // the exact encoding layout is complex to predict
    const decoded = try rlp.decode(allocator, encoded, false);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .List => |items| {
            try testing.expectEqual(@as(usize, 17), items.len);
        },
        .String => unreachable,
    }
}

test "LeafNode encoding" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const path = [_]u8{ 1, 2, 3, 4 };
    const value = "test_value";
    const value_copy = try allocator.dupe(u8, value);
    
    const leaf = try LeafNode.init(allocator, &path, HashValue{ .Raw = value_copy });
    defer leaf.deinit(allocator);
    
    const encoded = try leaf.encode(allocator);
    defer allocator.free(encoded);
    
    // Verify it's a list with 2 items (path and value)
    const decoded = try rlp.decode(allocator, encoded, false);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .List => |items| {
            try testing.expectEqual(@as(usize, 2), items.len);
        },
        .String => unreachable,
    }
}

test "ExtensionNode encoding" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    const path = [_]u8{ 1, 2, 3, 4 };
    const value = "next_node";
    const value_copy = try allocator.dupe(u8, value);
    
    var extension = try ExtensionNode.init(allocator, &path, HashValue{ .Raw = value_copy });
    defer extension.deinit(allocator);
    
    const encoded = try extension.encode(allocator);
    defer allocator.free(encoded);
    
    // Verify it's a list with 2 items (path and next node)
    const decoded = try rlp.decode(allocator, encoded, false);
    defer decoded.data.deinit(allocator);
    
    switch (decoded.data) {
        .List => |items| {
            try testing.expectEqual(@as(usize, 2), items.len);
        },
        .String => unreachable,
    }
}

test "TrieNode hash" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Create a leaf node
    const path = [_]u8{ 1, 2, 3, 4 };
    const value = "test_value";
    const value_copy = try allocator.dupe(u8, value);
    
    const leaf = try LeafNode.init(allocator, &path, HashValue{ .Raw = value_copy });
    var node = TrieNode{ .Leaf = leaf };
    defer node.deinit(allocator);
    
    const hash = try node.hash(allocator);
    
    // We can't predict the exact hash, but we can ensure it's non-zero
    var is_zero = true;
    for (hash) |byte| {
        if (byte != 0) {
            is_zero = false;
            break;
        }
    }
    try testing.expect(!is_zero);
}