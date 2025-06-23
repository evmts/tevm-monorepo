//! EVM state journaling for snapshot and revert functionality
//!
//! This module implements a journaling system that tracks all state modifications
//! and enables efficient snapshot creation and state reversion. This is critical
//! for proper EVM behavior, especially for failed transactions, reverted calls,
//! and exception handling.
//!
//! ## Design Philosophy
//!
//! The journal system follows these principles:
//! - **Change Tracking**: Every state modification creates a journal entry
//! - **Nested Snapshots**: Support multiple levels of snapshots for call depth
//! - **Efficient Revert**: Fast state restoration to any snapshot point
//! - **Memory Efficiency**: Minimal overhead for snapshot/revert operations
//!
//! ## Usage Pattern
//!
//! ```zig
//! // Create snapshot before risky operation
//! const snapshot_id = try journal.snapshot();
//! 
//! // Perform state modifications
//! try state.set_storage(addr, slot, value);
//! try state.set_balance(addr, new_balance);
//! 
//! // Either commit or revert
//! if (operation_successful) {
//!     journal.commit(snapshot_id);
//! } else {
//!     try journal.revert(snapshot_id, &state);
//! }
//! ```

const std = @import("std");
const Address = @import("Address");
const Log = @import("../log.zig");

/// Journal entry types for different state modifications
///
/// Each entry contains the information needed to revert a specific
/// type of state change. The entries store the previous state values
/// so they can be restored during revert operations.
pub const JournalEntry = union(enum) {
    /// Account was touched (for EIP-158 empty account tracking)
    account_touched: struct {
        address: Address.Address,
    },

    /// Account was loaded from external state
    account_loaded: struct {
        address: Address.Address,
        /// Previous account state (null if account didn't exist)
        previous_balance: ?u256,
        previous_nonce: ?u64,
        previous_code: ?[]const u8,
    },

    /// Storage slot was modified
    storage_changed: struct {
        address: Address.Address,
        slot: u256,
        previous_value: u256,
    },

    /// Transient storage slot was modified (EIP-1153)
    transient_storage_changed: struct {
        address: Address.Address,
        slot: u256,
        previous_value: u256,
    },

    /// Account balance was modified
    balance_changed: struct {
        address: Address.Address,
        previous_balance: u256,
    },

    /// Account nonce was modified
    nonce_changed: struct {
        address: Address.Address,
        previous_nonce: u64,
    },

    /// Contract code was modified
    code_changed: struct {
        address: Address.Address,
        /// Previous code (null if no code existed)
        previous_code: ?[]const u8,
    },

    /// Account was destroyed (SELFDESTRUCT)
    account_destroyed: struct {
        address: Address.Address,
        /// Account state before destruction
        previous_balance: u256,
        previous_nonce: u64,
        previous_code: []const u8,
    },

    /// Account was created
    account_created: struct {
        address: Address.Address,
    },

    /// Log was emitted
    log_created: struct {
        /// Index of the log in the logs array
        log_index: usize,
    },
};

/// Snapshot identifier representing a point in time
///
/// Snapshots are identified by their index in the snapshots array.
/// This allows for O(1) snapshot creation and efficient revert operations.
pub const SnapshotId = usize;

/// EVM state journal for tracking modifications and enabling revert functionality
///
/// The journal maintains a sequential list of all state modifications and
/// provides snapshot functionality for nested transaction scopes. Each
/// snapshot records the journal state at a specific point, allowing
/// reversion of all changes made since that point.
///
/// ## Memory Management
///
/// The journal owns all journal entries and manages their lifecycle.
/// During revert operations, entries are processed in reverse order
/// and then removed from the journal.
///
/// ## Thread Safety
///
/// This implementation is NOT thread-safe. External synchronization
/// is required for concurrent access.
pub const Journal = struct {
    /// Sequential list of all state modifications
    entries: std.ArrayList(JournalEntry),
    
    /// Snapshot points - each entry is the journal length at snapshot time
    snapshots: std.ArrayList(usize),
    
    /// Memory allocator for journal operations
    allocator: std.mem.Allocator,

    /// Initialize a new journal with the given allocator
    ///
    /// Creates empty journal with no entries or snapshots.
    ///
    /// ## Parameters
    /// - `allocator`: Memory allocator for all journal allocations
    ///
    /// ## Returns
    /// New initialized journal instance
    ///
    /// ## Example
    /// ```zig
    /// var journal = Journal.init(allocator);
    /// defer journal.deinit();
    /// ```
    pub fn init(allocator: std.mem.Allocator) Journal {
        Log.debug("Journal.init: Initializing journal with allocator", .{});
        return Journal{
            .entries = std.ArrayList(JournalEntry).init(allocator),
            .snapshots = std.ArrayList(usize).init(allocator),
            .allocator = allocator,
        };
    }

    /// Clean up all allocated resources
    ///
    /// Frees all memory used by the journal, including entry storage
    /// and snapshot tracking. After calling deinit(), the journal
    /// instance is invalid and must not be used.
    ///
    /// ## Important
    /// This function does NOT revert any pending changes - it simply
    /// frees memory. Call revert() first if state restoration is needed.
    pub fn deinit(self: *Journal) void {
        Log.debug("Journal.deinit: Cleaning up journal, entries={}, snapshots={}", .{
            self.entries.items.len, self.snapshots.items.len
        });
        
        self.entries.deinit();
        self.snapshots.deinit();
        
        Log.debug("Journal.deinit: Journal cleanup complete", .{});
    }

    /// Create a new snapshot at the current journal state
    ///
    /// Captures the current state of the journal, allowing for later
    /// reversion to this exact point. Snapshots are nested - multiple
    /// snapshots can be created and reverted in LIFO order.
    ///
    /// ## Returns
    /// - Success: Snapshot ID that can be used for commit/revert
    /// - Error: OutOfMemory if snapshot storage allocation fails
    ///
    /// ## Performance
    /// O(1) operation - simply records current journal length
    ///
    /// ## Example
    /// ```zig
    /// const snapshot = try journal.snapshot();
    /// // ... perform risky operations ...
    /// try journal.revert(snapshot, &state);
    /// ```
    pub fn snapshot(self: *Journal) std.mem.Allocator.Error!SnapshotId {
        const snapshot_id = self.snapshots.items.len;
        const journal_length = self.entries.items.len;
        
        Log.debug("Journal.snapshot: Creating snapshot id={}, journal_len={}", .{ snapshot_id, journal_length });
        
        try self.snapshots.append(journal_length);
        
        Log.debug("Journal.snapshot: Snapshot created successfully", .{});
        return snapshot_id;
    }

    /// Commit changes since the given snapshot
    ///
    /// Finalizes all journal entries created since the snapshot,
    /// making them permanent. The snapshot is removed and can
    /// no longer be reverted to.
    ///
    /// ## Parameters
    /// - `snapshot_id`: Snapshot ID returned from snapshot()
    ///
    /// ## Performance
    /// O(1) operation - simply removes the snapshot record
    ///
    /// ## Panics
    /// Panics if snapshot_id is invalid (debug builds only)
    ///
    /// ## Example
    /// ```zig
    /// const snapshot = try journal.snapshot();
    /// // ... successful operations ...
    /// journal.commit(snapshot);
    /// ```
    pub fn commit(self: *Journal, snapshot_id: SnapshotId) void {
        if (snapshot_id >= self.snapshots.items.len) {
            @branchHint(.cold);
            unreachable;
        }
        
        Log.debug("Journal.commit: Committing snapshot id={}", .{snapshot_id});
        
        // Remove the snapshot - this commits all changes since snapshot
        _ = self.snapshots.swapRemove(snapshot_id);
        
        Log.debug("Journal.commit: Snapshot committed, remaining_snapshots={}", .{self.snapshots.items.len});
    }

    /// Revert all changes since the given snapshot
    ///
    /// Restores the state to exactly what it was when the snapshot
    /// was created. All journal entries since the snapshot are
    /// processed in reverse order to undo their effects.
    ///
    /// ## Parameters
    /// - `snapshot_id`: Snapshot ID returned from snapshot()
    /// - `state`: EVM state to apply revert operations to
    ///
    /// ## Returns
    /// - Success: void
    /// - Error: OutOfMemory or other state modification errors
    ///
    /// ## Performance
    /// O(n) where n is the number of entries since snapshot
    ///
    /// ## Panics
    /// Panics if snapshot_id is invalid (debug builds only)
    ///
    /// ## Example
    /// ```zig
    /// const snapshot = try journal.snapshot();
    /// // ... failed operations ...
    /// try journal.revert(snapshot, &state);
    /// ```
    pub fn revert(self: *Journal, snapshot_id: SnapshotId, state: anytype) !void {
        if (snapshot_id >= self.snapshots.items.len) {
            @branchHint(.cold);
            unreachable;
        }
        
        const snapshot_point = self.snapshots.items[snapshot_id];
        const entries_to_revert = self.entries.items.len - snapshot_point;
        
        Log.debug("Journal.revert: Reverting snapshot id={}, entries_to_revert={}", .{ snapshot_id, entries_to_revert });
        
        // Revert all entries from the end back to snapshot point (reverse order)
        while (self.entries.items.len > snapshot_point) {
            const entry = self.entries.orderedRemove(self.entries.items.len - 1);
            try self.revert_entry(entry, state);
        }
        
        // Remove the snapshot
        _ = self.snapshots.swapRemove(snapshot_id);
        
        Log.debug("Journal.revert: Revert complete, remaining_entries={}, remaining_snapshots={}", .{
            self.entries.items.len, self.snapshots.items.len
        });
    }

    /// Add a journal entry for a state modification
    ///
    /// Records a state change so it can be reverted later if needed.
    /// This function should be called before applying the state change.
    ///
    /// ## Parameters
    /// - `entry`: Journal entry describing the state modification
    ///
    /// ## Returns
    /// - Success: void
    /// - Error: OutOfMemory if entry storage allocation fails
    ///
    /// ## Usage Pattern
    /// ```zig
    /// // Get current value before change
    /// const old_value = state.get_storage(addr, slot);
    /// 
    /// // Record the change in journal
    /// try journal.add_entry(.{ .storage_changed = .{
    ///     .address = addr,
    ///     .slot = slot,
    ///     .previous_value = old_value,
    /// }});
    /// 
    /// // Apply the change
    /// try state.set_storage_direct(addr, slot, new_value);
    /// ```
    pub fn add_entry(self: *Journal, entry: JournalEntry) std.mem.Allocator.Error!void {
        Log.debug("Journal.add_entry: Adding entry type={s}", .{@tagName(entry)});
        try self.entries.append(entry);
        Log.debug("Journal.add_entry: Entry added, total_entries={}", .{self.entries.items.len});
    }

    /// Get the current number of journal entries
    ///
    /// Useful for debugging and monitoring journal growth.
    ///
    /// ## Returns
    /// Current number of entries in the journal
    pub fn entry_count(self: *const Journal) usize {
        return self.entries.items.len;
    }

    /// Get the current number of active snapshots
    ///
    /// Useful for debugging and monitoring snapshot nesting depth.
    ///
    /// ## Returns
    /// Current number of active snapshots
    pub fn snapshot_count(self: *const Journal) usize {
        return self.snapshots.items.len;
    }

    /// Clear all journal entries and snapshots
    ///
    /// Resets the journal to empty state without deallocating
    /// the underlying storage. Useful for transaction boundaries.
    ///
    /// ## Warning
    /// This does NOT revert any changes - it simply clears the
    /// journal history. Use only when discarding transaction state.
    pub fn clear(self: *Journal) void {
        Log.debug("Journal.clear: Clearing journal, entries={}, snapshots={}", .{
            self.entries.items.len, self.snapshots.items.len
        });
        
        self.entries.clearRetainingCapacity();
        self.snapshots.clearRetainingCapacity();
        
        Log.debug("Journal.clear: Journal cleared", .{});
    }

    /// Revert a single journal entry
    ///
    /// Internal function that applies the reverse of a single
    /// state modification. Called during revert operations.
    ///
    /// ## Parameters
    /// - `entry`: Journal entry to revert
    /// - `state`: EVM state to apply revert operation to
    ///
    /// ## Returns
    /// - Success: void
    /// - Error: OutOfMemory or other state modification errors
    fn revert_entry(self: *Journal, entry: JournalEntry, state: anytype) !void {
        _ = self; // Unused parameter
        
        switch (entry) {
            .account_touched => |touch| {
                Log.debug("Journal.revert_entry: Reverting account_touched addr={x}", .{Address.to_u256(touch.address)});
                // For account touched, we may need to handle empty account deletion
                // This depends on the specific EIP-158 implementation
                // For now, this is a no-op as the touch itself doesn't change state
            },

            .account_loaded => |load| {
                Log.debug("Journal.revert_entry: Reverting account_loaded addr={x}", .{Address.to_u256(load.address)});
                // Restore previous account state or remove if it didn't exist
                if (load.previous_balance) |balance| {
                    try state.set_balance_direct(load.address, balance);
                } else {
                    _ = state.remove_balance(load.address);
                }
                
                if (load.previous_nonce) |nonce| {
                    try state.set_nonce_direct(load.address, nonce);
                } else {
                    _ = state.remove_nonce(load.address);
                }
                
                if (load.previous_code) |code| {
                    try state.set_code_direct(load.address, code);
                } else {
                    _ = state.remove_code(load.address);
                }
            },

            .storage_changed => |change| {
                Log.debug("Journal.revert_entry: Reverting storage_changed addr={x}, slot={}, prev_value={}", .{
                    Address.to_u256(change.address), change.slot, change.previous_value
                });
                try state.set_storage_direct(change.address, change.slot, change.previous_value);
            },

            .transient_storage_changed => |change| {
                Log.debug("Journal.revert_entry: Reverting transient_storage_changed addr={x}, slot={}, prev_value={}", .{
                    Address.to_u256(change.address), change.slot, change.previous_value
                });
                try state.set_transient_storage_direct(change.address, change.slot, change.previous_value);
            },

            .balance_changed => |change| {
                Log.debug("Journal.revert_entry: Reverting balance_changed addr={x}, prev_balance={}", .{
                    Address.to_u256(change.address), change.previous_balance
                });
                try state.set_balance_direct(change.address, change.previous_balance);
            },

            .nonce_changed => |change| {
                Log.debug("Journal.revert_entry: Reverting nonce_changed addr={x}, prev_nonce={}", .{
                    Address.to_u256(change.address), change.previous_nonce
                });
                try state.set_nonce_direct(change.address, change.previous_nonce);
            },

            .code_changed => |change| {
                Log.debug("Journal.revert_entry: Reverting code_changed addr={x}", .{Address.to_u256(change.address)});
                if (change.previous_code) |code| {
                    try state.set_code_direct(change.address, code);
                } else {
                    _ = state.remove_code(change.address);
                }
            },

            .account_destroyed => |destroyed| {
                Log.debug("Journal.revert_entry: Reverting account_destroyed addr={x}", .{Address.to_u256(destroyed.address)});
                // Restore the destroyed account
                try state.set_balance_direct(destroyed.address, destroyed.previous_balance);
                try state.set_nonce_direct(destroyed.address, destroyed.previous_nonce);
                try state.set_code_direct(destroyed.address, destroyed.previous_code);
            },

            .account_created => |created| {
                Log.debug("Journal.revert_entry: Reverting account_created addr={x}", .{Address.to_u256(created.address)});
                // Remove the created account
                _ = state.remove_balance(created.address);
                _ = state.remove_nonce(created.address);
                _ = state.remove_code(created.address);
            },

            .log_created => |log_entry| {
                Log.debug("Journal.revert_entry: Reverting log_created log_index={}", .{log_entry.log_index});
                // Remove the log at the specified index
                try state.remove_log(log_entry.log_index);
            },
        }
    }
};