//! Database Interface for Pluggable State Management
//!
//! This module provides a vtable-based interface abstraction for EVM state storage,
//! allowing different backend implementations (memory, file, network, etc.) to be
//! swapped without changing the core EVM logic.
//!
//! ## Design Philosophy
//!
//! The interface uses Zig's vtable pattern to provide type-safe, runtime polymorphism
//! without the overhead of traditional virtual function calls. Each implementation
//! provides its own vtable with function pointers to its specific operations.
//!
//! ## Usage
//!
//! ```zig
//! // Create a memory database
//! var memory_db = MemoryDatabase.init(allocator);
//! defer memory_db.deinit();
//! 
//! // Convert to interface
//! const db_interface = memory_db.to_database_interface();
//! 
//! // Use through interface
//! const account = try db_interface.get_account(address);
//! try db_interface.set_account(address, updated_account);
//! ```
//!
//! ## Performance Considerations
//!
//! The vtable dispatch adds minimal overhead compared to direct function calls.
//! Hot paths should consider batching operations where possible to reduce the
//! number of interface calls.

const std = @import("std");
// Address type is [20]u8
const StorageKey = @import("storage_key.zig");

/// Database operation errors
pub const DatabaseError = error{
    /// Account not found in the database
    AccountNotFound,
    /// Storage slot not found for the given address
    StorageNotFound,
    /// Contract code not found for the given hash
    CodeNotFound,
    /// Invalid address format
    InvalidAddress,
    /// Database corruption detected
    DatabaseCorrupted,
    /// Network error when accessing remote database
    NetworkError,
    /// Permission denied accessing database
    PermissionDenied,
    /// Out of memory during database operation
    OutOfMemory,
    /// Invalid snapshot identifier
    InvalidSnapshot,
    /// Batch operation not in progress
    NoBatchInProgress,
    /// Snapshot not found
    SnapshotNotFound,
};

/// Account state data structure
pub const Account = struct {
    /// Account balance in wei
    balance: u256,
    /// Transaction nonce (number of transactions sent from this account)
    nonce: u64,
    /// Hash of the contract code (keccak256 hash)
    code_hash: [32]u8,
    /// Storage root hash (merkle root of account's storage trie)
    storage_root: [32]u8,

    /// Creates a new account with zero values
    pub fn zero() Account {
        return Account{
            .balance = 0,
            .nonce = 0,
            .code_hash = [_]u8{0} ** 32,
            .storage_root = [_]u8{0} ** 32,
        };
    }

    /// Checks if account is empty (zero balance, nonce, and no code)
    pub fn is_empty(self: Account) bool {
        return self.balance == 0 and 
               self.nonce == 0 and 
               std.mem.eql(u8, &self.code_hash, &[_]u8{0} ** 32);
    }
};

/// Database interface using vtable pattern for pluggable implementations
pub const DatabaseInterface = struct {
    /// Pointer to the actual implementation
    ptr: *anyopaque,
    /// Function pointer table for the implementation
    vtable: *const VTable,

    /// Virtual function table defining all database operations
    pub const VTable = struct {
        // Account operations
        get_account: *const fn (ptr: *anyopaque, address: [20]u8) DatabaseError!?Account,
        set_account: *const fn (ptr: *anyopaque, address: [20]u8, account: Account) DatabaseError!void,
        delete_account: *const fn (ptr: *anyopaque, address: [20]u8) DatabaseError!void,
        account_exists: *const fn (ptr: *anyopaque, address: [20]u8) bool,

        // Storage operations
        get_storage: *const fn (ptr: *anyopaque, address: [20]u8, key: u256) DatabaseError!u256,
        set_storage: *const fn (ptr: *anyopaque, address: [20]u8, key: u256, value: u256) DatabaseError!void,

        // Code operations
        get_code: *const fn (ptr: *anyopaque, code_hash: [32]u8) DatabaseError![]const u8,
        set_code: *const fn (ptr: *anyopaque, code: []const u8) DatabaseError![32]u8,

        // State root operations
        get_state_root: *const fn (ptr: *anyopaque) DatabaseError![32]u8,
        commit_changes: *const fn (ptr: *anyopaque) DatabaseError![32]u8,

        // Snapshot operations
        create_snapshot: *const fn (ptr: *anyopaque) DatabaseError!u64,
        revert_to_snapshot: *const fn (ptr: *anyopaque, snapshot_id: u64) DatabaseError!void,
        commit_snapshot: *const fn (ptr: *anyopaque, snapshot_id: u64) DatabaseError!void,

        // Batch operations
        begin_batch: *const fn (ptr: *anyopaque) DatabaseError!void,
        commit_batch: *const fn (ptr: *anyopaque) DatabaseError!void,
        rollback_batch: *const fn (ptr: *anyopaque) DatabaseError!void,

        // Lifecycle
        deinit: *const fn (ptr: *anyopaque) void,
    };

    /// Initialize a database interface from any implementation
    /// 
    /// This function uses Zig's compile-time type introspection to generate
    /// the appropriate vtable for the given implementation type.
    ///
    /// ## Parameters
    /// - `implementation`: Pointer to the database implementation
    ///
    /// ## Returns
    /// DatabaseInterface wrapping the implementation
    ///
    /// ## Type Requirements
    /// The implementation must provide all required methods with correct signatures
    pub fn init(implementation: anytype) DatabaseInterface {
        const Impl = @TypeOf(implementation);
        const impl_info = @typeInfo(Impl);
        
        if (impl_info != .pointer) {
            @compileError("Database interface requires a pointer to implementation");
        }

        const gen = struct {
            fn vtable_get_account(ptr: *anyopaque, address: [20]u8) DatabaseError!?Account {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.get_account(address);
            }

            fn vtable_set_account(ptr: *anyopaque, address: [20]u8, account: Account) DatabaseError!void {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.set_account(address, account);
            }

            fn vtable_delete_account(ptr: *anyopaque, address: [20]u8) DatabaseError!void {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.delete_account(address);
            }

            fn vtable_account_exists(ptr: *anyopaque, address: [20]u8) bool {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.account_exists(address);
            }

            fn vtable_get_storage(ptr: *anyopaque, address: [20]u8, key: u256) DatabaseError!u256 {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.get_storage(address, key);
            }

            fn vtable_set_storage(ptr: *anyopaque, address: [20]u8, key: u256, value: u256) DatabaseError!void {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.set_storage(address, key, value);
            }

            fn vtable_get_code(ptr: *anyopaque, code_hash: [32]u8) DatabaseError![]const u8 {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.get_code(code_hash);
            }

            fn vtable_set_code(ptr: *anyopaque, code: []const u8) DatabaseError![32]u8 {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.set_code(code);
            }

            fn vtable_get_state_root(ptr: *anyopaque) DatabaseError![32]u8 {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.get_state_root();
            }

            fn vtable_commit_changes(ptr: *anyopaque) DatabaseError![32]u8 {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.commit_changes();
            }

            fn vtable_create_snapshot(ptr: *anyopaque) DatabaseError!u64 {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.create_snapshot();
            }

            fn vtable_revert_to_snapshot(ptr: *anyopaque, snapshot_id: u64) DatabaseError!void {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.revert_to_snapshot(snapshot_id);
            }

            fn vtable_commit_snapshot(ptr: *anyopaque, snapshot_id: u64) DatabaseError!void {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.commit_snapshot(snapshot_id);
            }

            fn vtable_begin_batch(ptr: *anyopaque) DatabaseError!void {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.begin_batch();
            }

            fn vtable_commit_batch(ptr: *anyopaque) DatabaseError!void {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.commit_batch();
            }

            fn vtable_rollback_batch(ptr: *anyopaque) DatabaseError!void {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.rollback_batch();
            }

            fn vtable_deinit(ptr: *anyopaque) void {
                const self: Impl = @ptrCast(@alignCast(ptr));
                return self.deinit();
            }

            const vtable = VTable{
                .get_account = vtable_get_account,
                .set_account = vtable_set_account,
                .delete_account = vtable_delete_account,
                .account_exists = vtable_account_exists,
                .get_storage = vtable_get_storage,
                .set_storage = vtable_set_storage,
                .get_code = vtable_get_code,
                .set_code = vtable_set_code,
                .get_state_root = vtable_get_state_root,
                .commit_changes = vtable_commit_changes,
                .create_snapshot = vtable_create_snapshot,
                .revert_to_snapshot = vtable_revert_to_snapshot,
                .commit_snapshot = vtable_commit_snapshot,
                .begin_batch = vtable_begin_batch,
                .commit_batch = vtable_commit_batch,
                .rollback_batch = vtable_rollback_batch,
                .deinit = vtable_deinit,
            };
        };

        return DatabaseInterface{
            .ptr = implementation,
            .vtable = &gen.vtable,
        };
    }

    // Account operations

    /// Get account data for the given address
    pub fn get_account(self: DatabaseInterface, address: [20]u8) DatabaseError!?Account {
        return self.vtable.get_account(self.ptr, address);
    }

    /// Set account data for the given address
    pub fn set_account(self: DatabaseInterface, address: [20]u8, account: Account) DatabaseError!void {
        return self.vtable.set_account(self.ptr, address, account);
    }

    /// Delete account and all associated data
    pub fn delete_account(self: DatabaseInterface, address: [20]u8) DatabaseError!void {
        return self.vtable.delete_account(self.ptr, address);
    }

    /// Check if account exists in the database
    pub fn account_exists(self: DatabaseInterface, address: [20]u8) bool {
        return self.vtable.account_exists(self.ptr, address);
    }

    // Storage operations

    /// Get storage value for the given address and key
    pub fn get_storage(self: DatabaseInterface, address: [20]u8, key: u256) DatabaseError!u256 {
        return self.vtable.get_storage(self.ptr, address, key);
    }

    /// Set storage value for the given address and key
    pub fn set_storage(self: DatabaseInterface, address: [20]u8, key: u256, value: u256) DatabaseError!void {
        return self.vtable.set_storage(self.ptr, address, key, value);
    }

    // Code operations

    /// Get contract code by hash
    pub fn get_code(self: DatabaseInterface, code_hash: [32]u8) DatabaseError![]const u8 {
        return self.vtable.get_code(self.ptr, code_hash);
    }

    /// Store contract code and return its hash
    pub fn set_code(self: DatabaseInterface, code: []const u8) DatabaseError![32]u8 {
        return self.vtable.set_code(self.ptr, code);
    }

    // State root operations

    /// Get current state root hash
    pub fn get_state_root(self: DatabaseInterface) DatabaseError![32]u8 {
        return self.vtable.get_state_root(self.ptr);
    }

    /// Commit pending changes and return new state root
    pub fn commit_changes(self: DatabaseInterface) DatabaseError![32]u8 {
        return self.vtable.commit_changes(self.ptr);
    }

    // Snapshot operations

    /// Create a state snapshot and return its ID
    pub fn create_snapshot(self: DatabaseInterface) DatabaseError!u64 {
        return self.vtable.create_snapshot(self.ptr);
    }

    /// Revert state to the given snapshot
    pub fn revert_to_snapshot(self: DatabaseInterface, snapshot_id: u64) DatabaseError!void {
        return self.vtable.revert_to_snapshot(self.ptr, snapshot_id);
    }

    /// Commit a snapshot (discard it without reverting)
    pub fn commit_snapshot(self: DatabaseInterface, snapshot_id: u64) DatabaseError!void {
        return self.vtable.commit_snapshot(self.ptr, snapshot_id);
    }

    // Batch operations

    /// Begin a batch operation for efficient bulk updates
    pub fn begin_batch(self: DatabaseInterface) DatabaseError!void {
        return self.vtable.begin_batch(self.ptr);
    }

    /// Commit all changes in the current batch
    pub fn commit_batch(self: DatabaseInterface) DatabaseError!void {
        return self.vtable.commit_batch(self.ptr);
    }

    /// Rollback all changes in the current batch
    pub fn rollback_batch(self: DatabaseInterface) DatabaseError!void {
        return self.vtable.rollback_batch(self.ptr);
    }

    // Lifecycle

    /// Clean up database resources
    pub fn deinit(self: DatabaseInterface) void {
        return self.vtable.deinit(self.ptr);
    }
};

// Compile-time validation helper
/// Validates that a type can be used as a database implementation
pub fn validate_database_implementation(comptime T: type) void {
    // Check for required methods at compile time
    if (!@hasDecl(T, "get_account")) @compileError("Database implementation missing get_account method");
    if (!@hasDecl(T, "set_account")) @compileError("Database implementation missing set_account method");
    if (!@hasDecl(T, "delete_account")) @compileError("Database implementation missing delete_account method");
    if (!@hasDecl(T, "account_exists")) @compileError("Database implementation missing account_exists method");
    if (!@hasDecl(T, "get_storage")) @compileError("Database implementation missing get_storage method");
    if (!@hasDecl(T, "set_storage")) @compileError("Database implementation missing set_storage method");
    if (!@hasDecl(T, "get_code")) @compileError("Database implementation missing get_code method");
    if (!@hasDecl(T, "set_code")) @compileError("Database implementation missing set_code method");
    if (!@hasDecl(T, "get_state_root")) @compileError("Database implementation missing get_state_root method");
    if (!@hasDecl(T, "commit_changes")) @compileError("Database implementation missing commit_changes method");
    if (!@hasDecl(T, "create_snapshot")) @compileError("Database implementation missing create_snapshot method");
    if (!@hasDecl(T, "revert_to_snapshot")) @compileError("Database implementation missing revert_to_snapshot method");
    if (!@hasDecl(T, "commit_snapshot")) @compileError("Database implementation missing commit_snapshot method");
    if (!@hasDecl(T, "begin_batch")) @compileError("Database implementation missing begin_batch method");
    if (!@hasDecl(T, "commit_batch")) @compileError("Database implementation missing commit_batch method");
    if (!@hasDecl(T, "rollback_batch")) @compileError("Database implementation missing rollback_batch method");
    if (!@hasDecl(T, "deinit")) @compileError("Database implementation missing deinit method");
}