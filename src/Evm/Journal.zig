const std = @import("std");
const testing = std.testing;

// For testing purposes, we'll define Address locally
const Address = @import("address").Address;

// Import unified B256 type
const B256 = @import("utils").B256;

// Since our Address module doesn't have a fromString function, we'll define one here for testing
fn addressFromHexString(hex: []const u8) !Address {
    if (hex.len < 2 or !std.mem.eql(u8, hex[0..2], "0x"))
        return error.InvalidAddressFormat;
    
    if (hex.len != 42)
        return error.InvalidAddressLength;
    
    var addr: Address = undefined;
    const hex_without_prefix = hex[2..];
    _ = try std.fmt.hexToBytes(&addr, hex_without_prefix);
    return addr;
}

/// JournalEntry represents a state change that can be reverted
pub const JournalEntry = union(enum) {
    /// Track a balance change
    BalanceChange: struct {
        address: Address,
        prev_balance: u256,
    },
    
    /// Track a nonce change
    NonceChange: struct {
        address: Address,
        prev_nonce: u64,
    },
    
    /// Track a storage change
    StorageChange: struct {
        address: Address,
        key: B256,
        prev_value: B256,
    },
    
    /// Track a code change
    CodeChange: struct {
        address: Address,
        prev_code_hash: B256,
    },
    
    /// Track account creation
    CreateAccount: struct {
        address: Address,
    },
    
    /// Track account suicide/self-destruct
    SelfDestruct: struct {
        address: Address,
        prev_balance: u256,
        prev_nonce: u64,
        had_code: bool,
    },
    
    /// Track when an account changes from empty to non-empty or vice versa
    AccountChange: struct {
        address: Address,
        prev_empty: bool,
    },
    
    /// Track when a log is added
    AddLog: struct {
        index: u32,
    },
    
    /// Track a refund change
    RefundChange: struct {
        prev_refund: u64,
    },
    
    /// Track access list changes (EIP-2929)
    AccessListChange: struct {
        address: Address,
        is_warm: bool,
    },
    
    /// Track storage access list changes (EIP-2929)
    StorageAccessChange: struct {
        address: Address,
        slot: B256,
        is_warm: bool,
    },
    
    /// Snapshot boundary marker
    Snapshot,
};

/// Journal maintains a log of state changes that allows reverting to previous states
pub const Journal = struct {
    /// List of recorded state changes
    entries: std.ArrayList(JournalEntry),
    
    /// Current snapshot ID
    snapshot_id: u64,
    
    /// Snapshot index tracking
    snapshot_indexes: std.AutoHashMap(u64, usize),
    
    /// Allocator for memory management
    allocator: std.mem.Allocator,
    
    /// Initialize a new journal
    pub fn init(allocator: std.mem.Allocator) Journal {
        return Journal{
            .entries = std.ArrayList(JournalEntry).init(allocator),
            .snapshot_id = 0,
            .snapshot_indexes = std.AutoHashMap(u64, usize).init(allocator),
            .allocator = allocator,
        };
    }
    
    /// Clean up resources
    pub fn deinit(self: *Journal) void {
        self.entries.deinit();
        self.snapshot_indexes.deinit();
    }
    
    /// Record a state change
    pub fn append(self: *Journal, entry: JournalEntry) !void {
        try self.entries.append(entry);
    }
    
    /// Create a new snapshot and return its ID
    pub fn snapshot(self: *Journal) !u64 {
        const id = self.snapshot_id;
        self.snapshot_id += 1;
        
        // Record the current length as the index for this snapshot
        try self.snapshot_indexes.put(id, self.entries.items.len);
        
        // Add a snapshot marker entry
        try self.entries.append(.Snapshot);
        
        return id;
    }
    
    /// Revert to a previous snapshot
    pub fn revertToSnapshot(self: *Journal, id: u64) !void {
        // Find the index for this snapshot
        const index = self.snapshot_indexes.get(id) orelse return error.InvalidSnapshotID;
        
        // Remove all entries after (and including) the snapshot marker
        // (snapshot marker is at index position)
        if (index < self.entries.items.len) {
            self.entries.shrinkRetainingCapacity(index);
        }
        
        // Remove all snapshot indexes after this one
        var it = self.snapshot_indexes.iterator();
        var keys_to_remove = std.ArrayList(u64).init(self.allocator);
        defer keys_to_remove.deinit();
        
        while (it.next()) |entry| {
            if (entry.value_ptr.* >= index) {
                try keys_to_remove.append(entry.key_ptr.*);
            }
        }
        
        for (keys_to_remove.items) |key| {
            _ = self.snapshot_indexes.remove(key);
        }
    }
    
    /// Get all entries since a snapshot
    pub fn entriesSinceSnapshot(self: *Journal, id: u64) ![]JournalEntry {
        const index = self.snapshot_indexes.get(id) orelse return error.InvalidSnapshotID;
        
        if (index >= self.entries.items.len) {
            return &[_]JournalEntry{};
        }
        
        return self.entries.items[index..];
    }
    
    /// Get the current number of entries
    pub fn len(self: *const Journal) usize {
        return self.entries.items.len;
    }
    
    /// Get a slice of all entries
    pub fn getEntries(self: *const Journal) []const JournalEntry {
        return self.entries.items;
    }
    
    /// Clear all entries and snapshots
    pub fn clear(self: *Journal) void {
        self.entries.clearRetainingCapacity();
        self.snapshot_indexes.clearRetainingCapacity();
        self.snapshot_id = 0;
    }
};

// Tests
test "Journal initialization" {
    const allocator = testing.allocator;
    var journal = Journal.init(allocator);
    defer journal.deinit();
    
    try testing.expectEqual(@as(usize, 0), journal.len());
    try testing.expectEqual(@as(u64, 0), journal.snapshot_id);
}

test "Journal append entries" {
    const allocator = testing.allocator;
    var journal = Journal.init(allocator);
    defer journal.deinit();
    
    // Add a balance change entry
    const addr = try addressFromHexString("0x1234567890123456789012345678901234567890");
    try journal.append(.{ .BalanceChange = .{ .address = addr, .prev_balance = 100 } });
    
    // Add a nonce change entry
    try journal.append(.{ .NonceChange = .{ .address = addr, .prev_nonce = 5 } });
    
    try testing.expectEqual(@as(usize, 2), journal.len());
    
    // Verify entries
    const entries = journal.getEntries();
    switch (entries[0]) {
        .BalanceChange => |change| {
            try testing.expectEqual(addr, change.address);
            try testing.expectEqual(@as(u256, 100), change.prev_balance);
        },
        else => return error.InvalidEntryType,
    }
    
    switch (entries[1]) {
        .NonceChange => |change| {
            try testing.expectEqual(addr, change.address);
            try testing.expectEqual(@as(u64, 5), change.prev_nonce);
        },
        else => return error.InvalidEntryType,
    }
}

test "Journal snapshots" {
    const allocator = testing.allocator;
    var journal = Journal.init(allocator);
    defer journal.deinit();
    
    // Add initial entries
    const addr = try addressFromHexString("0x1234567890123456789012345678901234567890");
    try journal.append(.{ .BalanceChange = .{ .address = addr, .prev_balance = 100 } });
    
    // Create a snapshot
    const snapshot1 = try journal.snapshot();
    try testing.expectEqual(@as(u64, 0), snapshot1);
    try testing.expectEqual(@as(usize, 2), journal.len()); // 1 entry + 1 snapshot
    
    // Add more entries
    try journal.append(.{ .NonceChange = .{ .address = addr, .prev_nonce = 5 } });
    
    // Create another snapshot
    const snapshot2 = try journal.snapshot();
    try testing.expectEqual(@as(u64, 1), snapshot2);
    try testing.expectEqual(@as(usize, 4), journal.len()); // 2 entries + 2 snapshots
    
    // Add more entries
    try journal.append(.{ .RefundChange = .{ .prev_refund = 200 } });
    try testing.expectEqual(@as(usize, 5), journal.len());
    
    // Revert to first snapshot
    try journal.revertToSnapshot(snapshot1);
    try testing.expectEqual(@as(usize, 1), journal.len());
    
    // Attempting to revert to second snapshot should fail
    try testing.expectError(error.InvalidSnapshotID, journal.revertToSnapshot(snapshot2));
    
    // We should still have same entries after failed revert
    try testing.expectEqual(@as(usize, 1), journal.len());
    
    // Clear journal
    journal.clear();
    try testing.expectEqual(@as(usize, 0), journal.len());
    try testing.expectEqual(@as(u64, 0), journal.snapshot_id);
}

test "Journal entries since snapshot" {
    const allocator = testing.allocator;
    var journal = Journal.init(allocator);
    defer journal.deinit();
    
    // Add initial entries
    const addr = try addressFromHexString("0x1234567890123456789012345678901234567890");
    try journal.append(.{ .BalanceChange = .{ .address = addr, .prev_balance = 100 } });
    
    // Create a snapshot
    const snapshot1 = try journal.snapshot();
    
    // Add more entries
    try journal.append(.{ .NonceChange = .{ .address = addr, .prev_nonce = 5 } });
    try journal.append(.{ .RefundChange = .{ .prev_refund = 200 } });
    
    // Get entries since snapshot
    const entries = try journal.entriesSinceSnapshot(snapshot1);
    try testing.expectEqual(@as(usize, 3), entries.len);
    
    // First entry should be the snapshot marker
    switch (entries[0]) {
        .Snapshot => {},
        else => return error.InvalidEntryType,
    }
    
    // Second entry should be the nonce change
    switch (entries[1]) {
        .NonceChange => |change| {
            try testing.expectEqual(addr, change.address);
            try testing.expectEqual(@as(u64, 5), change.prev_nonce);
        },
        else => return error.InvalidEntryType,
    }
    
    // Third entry should be the refund change
    switch (entries[2]) {
        .RefundChange => |change| {
            try testing.expectEqual(@as(u64, 200), change.prev_refund);
        },
        else => return error.InvalidEntryType,
    }
}

test "Journal multiple snapshots and reverts" {
    const allocator = testing.allocator;
    var journal = Journal.init(allocator);
    defer journal.deinit();
    
    const addr = try addressFromHexString("0x1234567890123456789012345678901234567890");
    
    // Create snapshot 0
    const snapshot0 = try journal.snapshot();
    try journal.append(.{ .BalanceChange = .{ .address = addr, .prev_balance = 100 } });
    
    // Create snapshot 1
    const snapshot1 = try journal.snapshot();
    try journal.append(.{ .NonceChange = .{ .address = addr, .prev_nonce = 5 } });
    
    // Create snapshot 2
    const snapshot2 = try journal.snapshot();
    try journal.append(.{ .RefundChange = .{ .prev_refund = 200 } });
    
    // Verify state
    try testing.expectEqual(@as(usize, 6), journal.len());
    
    // Revert to snapshot 1
    try journal.revertToSnapshot(snapshot1);
    try testing.expectEqual(@as(usize, 2), journal.len());
    
    // Trying to revert to snapshot 2 should fail
    try testing.expectError(error.InvalidSnapshotID, journal.revertToSnapshot(snapshot2));
    
    // We can still revert to snapshot 0
    try journal.revertToSnapshot(snapshot0);
    
    // After reverting to snapshot 0, we might have an empty journal
    try testing.expectEqual(@as(usize, 0), journal.len());
}