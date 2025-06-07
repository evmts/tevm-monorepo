const std = @import("std");
const JournalEntry = @import("journal_entry.zig").JournalEntry;

/// A journal of state changes that occur within a transaction.
/// This allows for atomic reversion of state to a previous checkpoint.
pub const Journal = struct {
    allocator: std.mem.Allocator,
    /// A list of all state changes recorded in chronological order.
    entries: std.ArrayList(JournalEntry),
    /// A list of indices into `entries`. Each index marks the beginning of a
    /// new checkpoint, typically corresponding to a nested call frame.
    checkpoints: std.ArrayList(usize),

    /// Initializes a new, empty journal.
    pub fn init(allocator: std.mem.Allocator) Journal {
        return .{
            .allocator = allocator,
            .entries = std.ArrayList(JournalEntry).init(allocator),
            .checkpoints = std.ArrayList(usize).init(allocator),
        };
    }

    /// Frees all memory used by the journal.
    pub fn deinit(self: *Journal) void {
        self.entries.deinit();
        self.checkpoints.deinit();
    }

    /// Records a new state change to the journal.
    pub fn record(self: *Journal, entry: JournalEntry) !void {
        try self.entries.append(entry);
    }

    /// Creates a new checkpoint, marking the current state as a save point.
    pub fn checkpoint(self: *Journal) !void {
        try self.checkpoints.append(self.entries.items.len);
    }

    /// Commits the changes made since the last checkpoint.
    /// In the case of nested checkpoints, this merges the child's changes
    /// into the parent's checkpoint.
    pub fn commit(self: *Journal) !void {
        _ = self.checkpoints.pop();
    }
};
