const std = @import("std");

// Type definitions
pub const Address = [20]u8;
pub const B256 = struct {
    bytes: [32]u8,
    
    pub fn eql(self: B256, other: B256) bool {
        return std.mem.eql(u8, &self.bytes, &other.bytes);
    }
};

/// Error types for journal operations
pub const JournalError = error{
    NoCheckpoint,
    InvalidCheckpoint,
    OutOfMemory,
};

/// Types of changes that can be journaled
pub const ChangeType = enum {
    AccountCreated,
    AccountDestroyed,
    BalanceChange,
    NonceChange,
    CodeChange,
    StorageChange,
    StorageCleared,
    Touched,
    AccessListAccount,
    AccessListStorage,
    Log,
    Refund,
};

/// A single change entry in the journal
pub const Change = union(ChangeType) {
    AccountCreated: struct {
        address: Address,
    },
    AccountDestroyed: struct {
        address: Address,
        balance: u256,
        nonce: u64,
        code_hash: B256,
    },
    BalanceChange: struct {
        address: Address,
        prev: u256,
    },
    NonceChange: struct {
        address: Address,
        prev: u64,
    },
    CodeChange: struct {
        address: Address,
        prev_hash: B256,
        prev_code: []const u8,
    },
    StorageChange: struct {
        address: Address,
        key: B256,
        prev: B256,
    },
    StorageCleared: struct {
        address: Address,
        storage: std.AutoHashMap(B256, B256),
    },
    Touched: struct {
        address: Address,
    },
    AccessListAccount: struct {
        address: Address,
    },
    AccessListStorage: struct {
        address: Address,
        key: B256,
    },
    Log: struct {
        address: Address,
        topics: []const B256,
        data: []const u8,
    },
    Refund: struct {
        amount: u64,
    },
};

/// Checkpoint represents a point in time to which we can revert
pub const Checkpoint = struct {
    /// Index in the changes array where this checkpoint starts
    change_index: usize,
    /// Log index at this checkpoint
    log_index: usize,
    /// Refund counter at this checkpoint
    refund: u64,
};

/// Log entry structure
pub const LogEntry = struct {
    address: Address,
    topics: []const B256,
    data: []const u8,
};

/// Journal provides transaction journaling for tracking and reverting state changes
pub const Journal = struct {
    /// All changes made during execution
    changes: std.ArrayList(Change),
    /// Stack of checkpoints for nested calls
    checkpoints: std.ArrayList(Checkpoint),
    /// All logs emitted during execution
    logs: std.ArrayList(LogEntry),
    /// Current refund counter
    refund: u64,
    /// Warm account addresses (EIP-2929)
    warm_accounts: std.AutoHashMap(Address, void),
    /// Warm storage slots per account (EIP-2929)
    warm_storage: std.AutoHashMap(Address, std.AutoHashMap(B256, void)),
    /// Allocator for memory management
    allocator: std.mem.Allocator,

    /// Create a new journal
    pub fn init(allocator: std.mem.Allocator) !Journal {
        return Journal{
            .changes = std.ArrayList(Change).init(allocator),
            .checkpoints = std.ArrayList(Checkpoint).init(allocator),
            .logs = std.ArrayList(LogEntry).init(allocator),
            .refund = 0,
            .warm_accounts = std.AutoHashMap(Address, void).init(allocator),
            .warm_storage = std.AutoHashMap(Address, std.AutoHashMap(B256, void)).init(allocator),
            .allocator = allocator,
        };
    }

    /// Create with pre-allocated capacity
    pub fn initWithCapacity(allocator: std.mem.Allocator, capacity: usize) !Journal {
        const journal = Journal{
            .changes = try std.ArrayList(Change).initCapacity(allocator, capacity),
            .checkpoints = try std.ArrayList(Checkpoint).initCapacity(allocator, capacity / 10),
            .logs = try std.ArrayList(LogEntry).initCapacity(allocator, capacity / 5),
            .refund = 0,
            .warm_accounts = std.AutoHashMap(Address, void).init(allocator),
            .warm_storage = std.AutoHashMap(Address, std.AutoHashMap(B256, void)).init(allocator),
            .allocator = allocator,
        };
        return journal;
    }

    /// Clean up resources
    pub fn deinit(self: *Journal) void {
        // Free all allocated memory in changes
        for (self.changes.items) |*change| {
            self.freeChange(change);
        }
        self.changes.deinit();
        
        self.checkpoints.deinit();
        
        // Free all log data
        for (self.logs.items) |*log| {
            self.allocator.free(log.topics);
            self.allocator.free(log.data);
        }
        self.logs.deinit();
        
        self.warm_accounts.deinit();
        
        // Free nested storage maps
        var storage_iter = self.warm_storage.iterator();
        while (storage_iter.next()) |entry| {
            entry.value_ptr.deinit();
        }
        self.warm_storage.deinit();
    }

    /// Create a new checkpoint at the current state
    pub fn checkpoint(self: *Journal) !void {
        try self.checkpoints.append(.{
            .change_index = self.changes.items.len,
            .log_index = self.logs.items.len,
            .refund = self.refund,
        });
    }

    /// Revert to the most recent checkpoint
    pub fn revert(self: *Journal) JournalError!void {
        if (self.checkpoints.items.len == 0) return error.NoCheckpoint;
        const saved_checkpoint = self.checkpoints.items[self.checkpoints.items.len - 1];
        _ = self.checkpoints.pop();
        
        // Revert changes in reverse order
        while (self.changes.items.len > saved_checkpoint.change_index) {
            const change = self.changes.pop() orelse unreachable;
            try self.applyRevert(&change);
            self.freeChange(&change);
        }
        
        // Revert logs
        while (self.logs.items.len > saved_checkpoint.log_index) {
            const log = self.logs.pop() orelse unreachable;
            self.allocator.free(log.topics);
            self.allocator.free(log.data);
        }
        
        // Revert refund counter
        self.refund = saved_checkpoint.refund;
    }

    /// Commit the most recent checkpoint (merge with parent)
    pub fn commit(self: *Journal) JournalError!void {
        if (self.checkpoints.items.len == 0) return error.NoCheckpoint;
        _ = self.checkpoints.pop();
        // Changes are kept in the journal, just remove the checkpoint
    }

    /// Get the current checkpoint depth
    pub fn depth(self: *const Journal) usize {
        return self.checkpoints.items.len;
    }

    /// Record account creation
    pub fn recordAccountCreated(self: *Journal, address: Address) !void {
        try self.changes.append(.{ .AccountCreated = .{ .address = address } });
    }

    /// Record account destruction
    pub fn recordAccountDestroyed(
        self: *Journal,
        address: Address,
        balance: u256,
        nonce: u64,
        code_hash: B256,
    ) !void {
        try self.changes.append(.{ .AccountDestroyed = .{
            .address = address,
            .balance = balance,
            .nonce = nonce,
            .code_hash = code_hash,
        } });
    }

    /// Record balance change
    pub fn recordBalanceChange(self: *Journal, address: Address, prev: u256) !void {
        try self.changes.append(.{ .BalanceChange = .{
            .address = address,
            .prev = prev,
        } });
    }

    /// Record nonce change
    pub fn recordNonceChange(self: *Journal, address: Address, prev: u64) !void {
        try self.changes.append(.{ .NonceChange = .{
            .address = address,
            .prev = prev,
        } });
    }

    /// Record code change
    pub fn recordCodeChange(
        self: *Journal,
        address: Address,
        prev_hash: B256,
        prev_code: []const u8,
    ) !void {
        const code_copy = try self.allocator.dupe(u8, prev_code);
        try self.changes.append(.{ .CodeChange = .{
            .address = address,
            .prev_hash = prev_hash,
            .prev_code = code_copy,
        } });
    }

    /// Record storage change
    pub fn recordStorageChange(self: *Journal, address: Address, key: B256, prev: B256) !void {
        try self.changes.append(.{ .StorageChange = .{
            .address = address,
            .key = key,
            .prev = prev,
        } });
    }

    /// Record storage cleared
    pub fn recordStorageCleared(
        self: *Journal,
        address: Address,
        storage: std.AutoHashMap(B256, B256),
    ) !void {
        var storage_copy = std.AutoHashMap(B256, B256).init(self.allocator);
        try storage_copy.ensureTotalCapacity(storage.count());
        
        var iter = storage.iterator();
        while (iter.next()) |entry| {
            try storage_copy.put(entry.key_ptr.*, entry.value_ptr.*);
        }
        
        try self.changes.append(.{ .StorageCleared = .{
            .address = address,
            .storage = storage_copy,
        } });
    }

    /// Record account touched (for empty account cleanup)
    pub fn recordTouched(self: *Journal, address: Address) !void {
        try self.changes.append(.{ .Touched = .{ .address = address } });
    }

    /// Add account to access list
    pub fn accessAccount(self: *Journal, address: Address) !bool {
        const result = try self.warm_accounts.getOrPut(address);
        if (!result.found_existing) {
            try self.changes.append(.{ .AccessListAccount = .{ .address = address } });
            return true; // Was cold
        }
        return false; // Was warm
    }

    /// Add storage slot to access list
    pub fn accessStorage(self: *Journal, address: Address, key: B256) !bool {
        // Get or create storage map for this address
        const storage_result = try self.warm_storage.getOrPut(address);
        if (!storage_result.found_existing) {
            storage_result.value_ptr.* = std.AutoHashMap(B256, void).init(self.allocator);
        }
        
        // Check if slot is already warm
        const slot_result = try storage_result.value_ptr.getOrPut(key);
        if (!slot_result.found_existing) {
            try self.changes.append(.{ .AccessListStorage = .{
                .address = address,
                .key = key,
            } });
            return true; // Was cold
        }
        return false; // Was warm
    }

    /// Check if account is warm
    pub fn isWarmAccount(self: *const Journal, address: Address) bool {
        return self.warm_accounts.contains(address);
    }

    /// Check if storage slot is warm
    pub fn isWarmStorage(self: *const Journal, address: Address, key: B256) bool {
        if (self.warm_storage.get(address)) |storage_map| {
            return storage_map.contains(key);
        }
        return false;
    }

    /// Record a log entry
    pub fn recordLog(self: *Journal, address: Address, topics: []const B256, data: []const u8) !void {
        const topics_copy = try self.allocator.dupe(B256, topics);
        const data_copy = try self.allocator.dupe(u8, data);
        
        try self.logs.append(.{
            .address = address,
            .topics = topics_copy,
            .data = data_copy,
        });
    }

    /// Get all logs
    pub fn getLogs(self: *const Journal) []const LogEntry {
        return self.logs.items;
    }

    /// Clear all logs (used after successful execution)
    pub fn clearLogs(self: *Journal) void {
        for (self.logs.items) |*log| {
            self.allocator.free(log.topics);
            self.allocator.free(log.data);
        }
        self.logs.clearRetainingCapacity();
    }

    /// Add gas refund
    pub fn addRefund(self: *Journal, amount: u64) !void {
        self.refund +|= amount; // Saturating add
        try self.changes.append(.{ .Refund = .{ .amount = amount } });
    }

    /// Subtract gas refund (with underflow protection)
    pub fn subRefund(self: *Journal, amount: u64) !void {
        const actual_amount = @min(amount, self.refund);
        self.refund -= actual_amount;
        // Record negative refund change
        try self.changes.append(.{ .Refund = .{ .amount = std.math.maxInt(u64) - actual_amount + 1 } });
    }

    /// Get current refund amount
    pub fn getRefund(self: *const Journal) u64 {
        return self.refund;
    }

    /// Clear the journal (remove all changes and checkpoints)
    pub fn clear(self: *Journal) void {
        // Free all allocated memory
        for (self.changes.items) |*change| {
            self.freeChange(change);
        }
        self.changes.clearRetainingCapacity();
        
        self.checkpoints.clearRetainingCapacity();
        
        self.clearLogs();
        
        self.refund = 0;
        
        self.warm_accounts.clearRetainingCapacity();
        
        var storage_iter = self.warm_storage.iterator();
        while (storage_iter.next()) |entry| {
            entry.value_ptr.deinit();
        }
        self.warm_storage.clearRetainingCapacity();
    }

    /// Get the number of changes
    pub fn changeCount(self: *const Journal) usize {
        return self.changes.items.len;
    }

    /// Check if journal is empty
    pub fn isEmpty(self: *const Journal) bool {
        return self.changes.items.len == 0 and self.checkpoints.items.len == 0;
    }

    /// Apply a single change during revert
    fn applyRevert(self: *Journal, change: *const Change) !void {
        switch (change.*) {
            .AccessListAccount => |c| {
                _ = self.warm_accounts.remove(c.address);
            },
            .AccessListStorage => |c| {
                if (self.warm_storage.getPtr(c.address)) |storage_map| {
                    _ = storage_map.remove(c.key);
                    if (storage_map.count() == 0) {
                        storage_map.deinit();
                        _ = self.warm_storage.remove(c.address);
                    }
                }
            },
            .Refund => |c| {
                // Revert refund changes
                if (c.amount > std.math.maxInt(u64) / 2) {
                    // This was a subtraction, add it back
                    self.refund +|= std.math.maxInt(u64) - c.amount + 1;
                } else {
                    // This was an addition, subtract it
                    self.refund -|= c.amount;
                }
            },
            else => {
                // Other changes are handled by StateDB during revert
            },
        }
    }

    /// Free memory allocated for a change
    fn freeChange(self: *Journal, change: *const Change) void {
        switch (change.*) {
            .CodeChange => |c| {
                self.allocator.free(c.prev_code);
            },
            .StorageCleared => |c| {
                var storage = c.storage;
                storage.deinit();
            },
            else => {},
        }
    }
};