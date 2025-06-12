//! Memory Database Implementation
//!
//! A fast, in-memory database implementation for EVM state management.
//! This implementation stores all data in memory using hash maps for efficient
//! access and is primarily intended for testing and development scenarios.
//!
//! ## Features
//!
//! - **Fast Access**: All operations are O(1) average case using hash maps
//! - **Complete Interface**: Implements all database interface methods
//! - **Snapshot Support**: Full snapshot/revert functionality 
//! - **Batch Operations**: Efficient bulk update support
//! - **Memory Management**: Proper cleanup of all allocated resources
//!
//! ## Usage
//!
//! ```zig
//! var memory_db = try MemoryDatabase.init(allocator);
//! defer memory_db.deinit();
//!
//! const db_interface = memory_db.to_database_interface();
//! 
//! // Use through interface
//! try db_interface.set_account(address, account);
//! const account = try db_interface.get_account(address);
//! ```
//!
//! ## Thread Safety
//!
//! This implementation is NOT thread-safe. External synchronization is required
//! for concurrent access.

const std = @import("std");
// Address type is [20]u8 as defined in the database interface
const StorageKey = @import("storage_key.zig");
const DatabaseInterface = @import("database_interface.zig").DatabaseInterface;
const DatabaseError = @import("database_interface.zig").DatabaseError;
const Account = @import("database_interface.zig").Account;

/// Context for address hash map operations
const AddressContext = struct {
    pub fn hash(self: @This(), addr: [20]u8) u64 {
        _ = self;
        return std.hash_map.hashString(&addr);
    }

    pub fn eql(self: @This(), a: [20]u8, b: [20]u8) bool {
        _ = self;
        return std.mem.eql(u8, &a, &b);
    }
};

/// Context for storage key hash map operations
const StorageKeyContext = struct {
    pub fn hash(self: @This(), key: StorageKey) u64 {
        _ = self;
        var hasher = std.hash.Wyhash.init(0);
        key.hash(&hasher);
        return hasher.final();
    }

    pub fn eql(self: @This(), a: StorageKey, b: StorageKey) bool {
        _ = self;
        return StorageKey.eql(a, b);
    }
};

/// Context for code hash (32-byte array) hash map operations  
const CodeHashContext = struct {
    pub fn hash(self: @This(), code_hash: [32]u8) u64 {
        _ = self;
        return std.hash_map.hashString(&code_hash);
    }

    pub fn eql(self: @This(), a: [32]u8, b: [32]u8) bool {
        _ = self;
        return std.mem.eql(u8, &a, &b);
    }
};

/// Snapshot of database state for rollback support
const Snapshot = struct {
    id: u64,
    accounts: std.HashMap([20]u8, Account, AddressContext, 80),
    storage: std.HashMap(StorageKey, u256, StorageKeyContext, 80), 
    code_storage: std.HashMap([32]u8, []u8, CodeHashContext, 80),

    fn deinit(self: *Snapshot, allocator: std.mem.Allocator) void {
        self.accounts.deinit();
        self.storage.deinit();
        
        // Free all stored code
        var code_iter = self.code_storage.iterator();
        while (code_iter.next()) |entry| {
            allocator.free(entry.value_ptr.*);
        }
        self.code_storage.deinit();
    }

    fn clone_from(allocator: std.mem.Allocator, source_accounts: *const std.HashMap([20]u8, Account, AddressContext, 80), source_storage: *const std.HashMap(StorageKey, u256, StorageKeyContext, 80), source_code: *const std.HashMap([32]u8, []u8, CodeHashContext, 80), snapshot_id: u64) !Snapshot {
        var snapshot = Snapshot{
            .id = snapshot_id,
            .accounts = std.HashMap([20]u8, Account, AddressContext, 80).init(allocator),
            .storage = std.HashMap(StorageKey, u256, StorageKeyContext, 80).init(allocator),
            .code_storage = std.HashMap([32]u8, []u8, CodeHashContext, 80).init(allocator),
        };

        // Clone accounts
        var account_iter = source_accounts.iterator();
        while (account_iter.next()) |entry| {
            try snapshot.accounts.put(entry.key_ptr.*, entry.value_ptr.*);
        }

        // Clone storage
        var storage_iter = source_storage.iterator();
        while (storage_iter.next()) |entry| {
            try snapshot.storage.put(entry.key_ptr.*, entry.value_ptr.*);
        }

        // Clone code storage (deep copy of byte arrays)
        var code_iter = source_code.iterator();
        while (code_iter.next()) |entry| {
            const code_copy = try allocator.alloc(u8, entry.value_ptr.len);
            @memcpy(code_copy, entry.value_ptr.*);
            try snapshot.code_storage.put(entry.key_ptr.*, code_copy);
        }

        return snapshot;
    }
};

/// Pending batch operation
const BatchOperation = struct {
    const OperationType = enum {
        SetAccount,
        DeleteAccount,
        SetStorage,
        SetCode,
    };

    operation_type: OperationType,
    address: [20]u8,
    // Union data for different operation types
    account_data: ?Account = null,
    storage_key: ?u256 = null,
    storage_value: ?u256 = null,
    code_data: ?[]const u8 = null,
};

/// Memory-based database implementation
pub const MemoryDatabase = struct {
    /// Memory allocator for all database allocations
    allocator: std.mem.Allocator,
    
    /// Account data storage
    accounts: std.HashMap([20]u8, Account, AddressContext, 80),
    
    /// Contract storage (address, slot) -> value mapping
    storage: std.HashMap(StorageKey, u256, StorageKeyContext, 80),
    
    /// Code storage by hash
    code_storage: std.HashMap([32]u8, []u8, CodeHashContext, 80),
    
    /// State snapshots for rollback support
    snapshots: std.ArrayList(Snapshot),
    
    /// Next snapshot ID to assign
    next_snapshot_id: u64,
    
    /// Pending batch operations
    batch_operations: ?std.ArrayList(BatchOperation),
    
    /// Whether we're currently in a batch
    batch_in_progress: bool,

    /// Initialize a new memory database
    pub fn init(allocator: std.mem.Allocator) MemoryDatabase {
        return MemoryDatabase{
            .allocator = allocator,
            .accounts = std.HashMap([20]u8, Account, AddressContext, 80).init(allocator),
            .storage = std.HashMap(StorageKey, u256, StorageKeyContext, 80).init(allocator),
            .code_storage = std.HashMap([32]u8, []u8, CodeHashContext, 80).init(allocator),
            .snapshots = std.ArrayList(Snapshot).init(allocator),
            .next_snapshot_id = 1,
            .batch_operations = null,
            .batch_in_progress = false,
        };
    }

    /// Clean up all allocated resources
    pub fn deinit(self: *MemoryDatabase) void {
        self.accounts.deinit();
        self.storage.deinit();
        
        // Free all stored code
        var code_iter = self.code_storage.iterator();
        while (code_iter.next()) |entry| {
            self.allocator.free(entry.value_ptr.*);
        }
        self.code_storage.deinit();
        
        // Free all snapshots
        for (self.snapshots.items) |*snapshot| {
            snapshot.deinit(self.allocator);
        }
        self.snapshots.deinit();
        
        // Free batch operations if any
        if (self.batch_operations) |*batch_ops| {
            batch_ops.deinit();
        }
    }

    // Account operations

    /// Get account data for the given address
    pub fn get_account(self: *MemoryDatabase, address: [20]u8) DatabaseError!?Account {
        return self.accounts.get(address);
    }

    /// Set account data for the given address
    pub fn set_account(self: *MemoryDatabase, address: [20]u8, account: Account) DatabaseError!void {
        if (self.batch_in_progress) {
            return self.add_batch_operation(.{
                .operation_type = .SetAccount,
                .address = address,
                .account_data = account,
            });
        }
        
        try self.accounts.put(address, account);
    }

    /// Delete account and all associated data
    pub fn delete_account(self: *MemoryDatabase, address: [20]u8) DatabaseError!void {
        if (self.batch_in_progress) {
            return self.add_batch_operation(.{
                .operation_type = .DeleteAccount,
                .address = address,
            });
        }
        
        _ = self.accounts.remove(address);
        
        // Remove all storage for this account
        var storage_iter = self.storage.iterator();
        var keys_to_remove = std.ArrayList(StorageKey).init(self.allocator);
        defer keys_to_remove.deinit();
        
        while (storage_iter.next()) |entry| {
            if (std.mem.eql(u8, &entry.key_ptr.address, &address)) {
                try keys_to_remove.append(entry.key_ptr.*);
            }
        }
        
        for (keys_to_remove.items) |key| {
            _ = self.storage.remove(key);
        }
    }

    /// Check if account exists in the database
    pub fn account_exists(self: *MemoryDatabase, address: [20]u8) bool {
        return self.accounts.contains(address);
    }

    // Storage operations

    /// Get storage value for the given address and key
    pub fn get_storage(self: *MemoryDatabase, address: [20]u8, key: u256) DatabaseError!u256 {
        const storage_key = StorageKey{ .address = address, .slot = key };
        return self.storage.get(storage_key) orelse 0;
    }

    /// Set storage value for the given address and key
    pub fn set_storage(self: *MemoryDatabase, address: [20]u8, key: u256, value: u256) DatabaseError!void {
        if (self.batch_in_progress) {
            return self.add_batch_operation(.{
                .operation_type = .SetStorage,
                .address = address,
                .storage_key = key,
                .storage_value = value,
            });
        }
        
        const storage_key = StorageKey{ .address = address, .slot = key };
        try self.storage.put(storage_key, value);
    }

    // Code operations

    /// Get contract code by hash
    pub fn get_code(self: *MemoryDatabase, code_hash: [32]u8) DatabaseError![]const u8 {
        return self.code_storage.get(code_hash) orelse &[_]u8{};
    }

    /// Store contract code and return its hash
    pub fn set_code(self: *MemoryDatabase, code: []const u8) DatabaseError![32]u8 {
        // Calculate keccak256 hash of the code
        var hash: [32]u8 = undefined;
        std.crypto.hash.sha3.Keccak256.hash(code, &hash, .{});
        
        if (self.batch_in_progress) {
            try self.add_batch_operation(.{
                .operation_type = .SetCode,
                .address = [_]u8{0} ** 20, // Dummy address for code operations
                .code_data = code,
            });
            return hash;
        }
        
        // Check if code with this hash already exists
        if (self.code_storage.get(hash)) |existing_code| {
            // Code already exists, no need to store again
            _ = existing_code;
            return hash;
        }
        
        // Store a copy of the code
        const code_copy = try self.allocator.alloc(u8, code.len);
        @memcpy(code_copy, code);
        
        try self.code_storage.put(hash, code_copy);
        return hash;
    }

    // State root operations

    /// Get current state root hash (simplified implementation)
    pub fn get_state_root(self: *MemoryDatabase) DatabaseError![32]u8 {
        // In a real implementation, this would compute the Merkle root
        // For now, return a deterministic hash based on state content
        var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
        
        // Hash account count
        const account_count = self.accounts.count();
        hasher.update(std.mem.asBytes(&account_count));
        
        // Hash storage count  
        const storage_count = self.storage.count();
        hasher.update(std.mem.asBytes(&storage_count));
        
        // Hash code count
        const code_count = self.code_storage.count();
        hasher.update(std.mem.asBytes(&code_count));
        
        var hash: [32]u8 = undefined;
        hasher.final(&hash);
        return hash;
    }

    /// Commit pending changes and return new state root
    pub fn commit_changes(self: *MemoryDatabase) DatabaseError![32]u8 {
        // In this implementation, changes are committed immediately
        // So we just return the current state root
        return self.get_state_root();
    }

    // Snapshot operations

    /// Create a state snapshot and return its ID
    pub fn create_snapshot(self: *MemoryDatabase) DatabaseError!u64 {
        const snapshot_id = self.next_snapshot_id;
        self.next_snapshot_id += 1;
        
        const snapshot = try Snapshot.clone_from(
            self.allocator, 
            &self.accounts, 
            &self.storage, 
            &self.code_storage, 
            snapshot_id
        );
        
        try self.snapshots.append(snapshot);
        return snapshot_id;
    }

    /// Revert state to the given snapshot
    pub fn revert_to_snapshot(self: *MemoryDatabase, snapshot_id: u64) DatabaseError!void {
        // Find the snapshot
        var snapshot_index: ?usize = null;
        for (self.snapshots.items, 0..) |snapshot, i| {
            if (snapshot.id == snapshot_id) {
                snapshot_index = i;
                break;
            }
        }
        
        const index = snapshot_index orelse return DatabaseError.SnapshotNotFound;
        const snapshot = &self.snapshots.items[index];
        
        // Clear current state
        self.accounts.clearAndFree();
        self.storage.clearAndFree();
        
        var code_iter = self.code_storage.iterator();
        while (code_iter.next()) |entry| {
            self.allocator.free(entry.value_ptr.*);
        }
        self.code_storage.clearAndFree();
        
        // Restore from snapshot
        var account_iter = snapshot.accounts.iterator();
        while (account_iter.next()) |entry| {
            try self.accounts.put(entry.key_ptr.*, entry.value_ptr.*);
        }
        
        var storage_iter = snapshot.storage.iterator();
        while (storage_iter.next()) |entry| {
            try self.storage.put(entry.key_ptr.*, entry.value_ptr.*);
        }
        
        var snap_code_iter = snapshot.code_storage.iterator();
        while (snap_code_iter.next()) |entry| {
            const code_copy = try self.allocator.alloc(u8, entry.value_ptr.len);
            @memcpy(code_copy, entry.value_ptr.*);
            try self.code_storage.put(entry.key_ptr.*, code_copy);
        }
        
        // Remove this snapshot and all newer ones
        while (self.snapshots.items.len > index) {
            var removed_snapshot = self.snapshots.items[self.snapshots.items.len - 1];
            removed_snapshot.deinit(self.allocator);
            _ = self.snapshots.pop();
        }
    }

    /// Commit a snapshot (remove it without reverting)
    pub fn commit_snapshot(self: *MemoryDatabase, snapshot_id: u64) DatabaseError!void {
        // Find and remove the snapshot
        for (self.snapshots.items, 0..) |*snapshot, i| {
            if (snapshot.id == snapshot_id) {
                snapshot.deinit(self.allocator);
                _ = self.snapshots.orderedRemove(i);
                return;
            }
        }
        
        return DatabaseError.SnapshotNotFound;
    }

    // Batch operations

    /// Begin a batch operation for efficient bulk updates
    pub fn begin_batch(self: *MemoryDatabase) DatabaseError!void {
        if (self.batch_in_progress) {
            return DatabaseError.NoBatchInProgress; // Already in batch
        }
        
        self.batch_operations = std.ArrayList(BatchOperation).init(self.allocator);
        self.batch_in_progress = true;
    }

    /// Commit all changes in the current batch
    pub fn commit_batch(self: *MemoryDatabase) DatabaseError!void {
        if (!self.batch_in_progress) {
            return DatabaseError.NoBatchInProgress;
        }
        
        const batch_ops = &(self.batch_operations orelse return DatabaseError.NoBatchInProgress);
        
        // Execute all batch operations
        for (batch_ops.items) |op| {
            switch (op.operation_type) {
                .SetAccount => {
                    try self.accounts.put(op.address, op.account_data.?);
                },
                .DeleteAccount => {
                    _ = self.accounts.remove(op.address);
                    
                    // Remove associated storage
                    var storage_iter = self.storage.iterator();
                    var keys_to_remove = std.ArrayList(StorageKey).init(self.allocator);
                    defer keys_to_remove.deinit();
                    
                    while (storage_iter.next()) |entry| {
                        if (std.mem.eql(u8, &entry.key_ptr.address, &op.address)) {
                            try keys_to_remove.append(entry.key_ptr.*);
                        }
                    }
                    
                    for (keys_to_remove.items) |key| {
                        _ = self.storage.remove(key);
                    }
                },
                .SetStorage => {
                    const storage_key = StorageKey{ .address = op.address, .slot = op.storage_key.? };
                    try self.storage.put(storage_key, op.storage_value.?);
                },
                .SetCode => {
                    const code = op.code_data.?;
                    var hash: [32]u8 = undefined;
                    std.crypto.hash.sha3.Keccak256.hash(code, &hash, .{});
                    
                    const code_copy = try self.allocator.alloc(u8, code.len);
                    @memcpy(code_copy, code);
                    try self.code_storage.put(hash, code_copy);
                },
            }
        }
        
        // Clean up batch
        batch_ops.deinit();
        self.batch_operations = null;
        self.batch_in_progress = false;
    }

    /// Rollback all changes in the current batch
    pub fn rollback_batch(self: *MemoryDatabase) DatabaseError!void {
        if (!self.batch_in_progress) {
            return DatabaseError.NoBatchInProgress;
        }
        
        // Simply discard all pending operations
        if (self.batch_operations) |*batch_ops| {
            batch_ops.deinit();
        }
        self.batch_operations = null;
        self.batch_in_progress = false;
    }

    // Helper methods

    fn add_batch_operation(self: *MemoryDatabase, operation: BatchOperation) DatabaseError!void {
        const batch_ops = &(self.batch_operations orelse return DatabaseError.NoBatchInProgress);
        try batch_ops.append(operation);
    }

    /// Convert this memory database to a database interface
    pub fn to_database_interface(self: *MemoryDatabase) DatabaseInterface {
        return DatabaseInterface.init(self);
    }
};

// Compile-time validation
comptime {
    @import("database_interface.zig").validate_database_implementation(MemoryDatabase);
}