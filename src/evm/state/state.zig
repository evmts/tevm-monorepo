//! EVM state management module - Tracks blockchain state during execution
//! 
//! This module provides the state storage layer for the EVM, managing all
//! mutable blockchain state including account balances, storage, code, nonces,
//! transient storage, and event logs.
//! 
//! ## State Components
//! 
//! The EVM state consists of:
//! - **Account State**: Balances, nonces, and contract code
//! - **Persistent Storage**: Contract storage slots (SSTORE/SLOAD)
//! - **Transient Storage**: Temporary storage within transactions (TSTORE/TLOAD)
//! - **Event Logs**: Emitted events from LOG0-LOG4 opcodes
//! 
//! ## Design Philosophy
//! 
//! This implementation uses hash maps for efficient lookups and modifications.
//! All state changes are applied immediately (no journaling in this layer).
//! For transaction rollback support, this should be wrapped in a higher-level
//! state manager that implements checkpointing/journaling.
//! 
//! ## Memory Management
//! 
//! All state data is heap-allocated using the provided allocator. The state
//! owns all data it stores and properly cleans up in deinit().
//! 
//! ## Thread Safety
//! 
//! This implementation is NOT thread-safe. Concurrent access must be synchronized
//! externally.

const std = @import("std");
const Address = @import("Address");
const EvmLog = @import("evm_log.zig");
const StorageKey = @import("storage_key.zig");
const Journal = @import("journal.zig").Journal;
const Log = @import("../log.zig");

/// EVM state container
/// 
/// Manages all mutable blockchain state during EVM execution.
/// This includes account data, storage, and transaction artifacts.
const EvmState = @This();

/// Memory allocator for all state allocations
allocator: std.mem.Allocator,

/// Persistent contract storage (SSTORE/SLOAD)
/// Maps (address, slot) -> value
storage: std.AutoHashMap(StorageKey, u256),

/// Account balances in wei
/// Maps address -> balance
balances: std.AutoHashMap(Address.Address, u256),

/// Contract bytecode
/// Maps address -> code bytes
/// Empty slice for EOAs (Externally Owned Accounts)
code: std.AutoHashMap(Address.Address, []const u8),

/// Account nonces (transaction counters)
/// Maps address -> nonce
/// Incremented on each transaction from the account
nonces: std.AutoHashMap(Address.Address, u64),

/// Transient storage (EIP-1153: TSTORE/TLOAD)
/// Maps (address, slot) -> value
/// Cleared after each transaction
transient_storage: std.AutoHashMap(StorageKey, u256),

/// Event logs emitted during execution
/// Ordered list of all LOG0-LOG4 events
logs: std.ArrayList(EvmLog),

/// Journal for tracking state changes and enabling snapshots/reverts
/// Provides transaction-level rollback functionality
journal: Journal,

/// Initialize a new EVM state instance
/// 
/// Creates empty state with the provided allocator. All maps and lists
/// are initialized empty.
/// 
/// ## Parameters
/// - `allocator`: Memory allocator for all state allocations
/// 
/// ## Returns
/// - Success: New initialized state instance
/// - Error: OutOfMemory if allocation fails
/// 
/// ## Example
/// ```zig
/// var state = try EvmState.init(allocator);
/// defer state.deinit();
/// ```
pub fn init(allocator: std.mem.Allocator) std.mem.Allocator.Error!EvmState {
    Log.debug("EvmState.init: Initializing EVM state with allocator", .{});
    
    var storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer storage.deinit();

    var balances = std.AutoHashMap(Address.Address, u256).init(allocator);
    errdefer balances.deinit();

    var code = std.AutoHashMap(Address.Address, []const u8).init(allocator);
    errdefer code.deinit();

    var nonces = std.AutoHashMap(Address.Address, u64).init(allocator);
    errdefer nonces.deinit();

    var transient_storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer transient_storage.deinit();

    var logs = std.ArrayList(EvmLog).init(allocator);
    errdefer logs.deinit();

    var journal = Journal.init(allocator);
    errdefer journal.deinit();

    Log.debug("EvmState.init: EVM state initialization complete", .{});
    return EvmState{
        .allocator = allocator,
        .storage = storage,
        .balances = balances,
        .code = code,
        .nonces = nonces,
        .transient_storage = transient_storage,
        .logs = logs,
        .journal = journal,
    };
}

/// Clean up all allocated resources
/// 
/// Frees all memory used by the state, including:
/// - All hash maps
/// - Log data (topics and data arrays)
/// - Any allocated slices
/// 
/// ## Important
/// After calling deinit(), the state instance is invalid and
/// must not be used.
pub fn deinit(self: *EvmState) void {
    Log.debug("EvmState.deinit: Cleaning up EVM state, storage_count={}, balance_count={}, code_count={}, logs_count={}", .{
        self.storage.count(), self.balances.count(), self.code.count(), self.logs.items.len
    });
    
    self.storage.deinit();
    self.balances.deinit();
    self.code.deinit();
    self.nonces.deinit();
    self.transient_storage.deinit();

    // Clean up logs - free allocated memory for topics and data
    for (self.logs.items) |log| {
        self.allocator.free(log.topics);
        self.allocator.free(log.data);
    }
    self.logs.deinit();

    // Clean up journal
    self.journal.deinit();
    
    Log.debug("EvmState.deinit: EVM state cleanup complete", .{});
}

// State access methods

/// Get a value from persistent storage
/// 
/// Reads a storage slot for the given address. Returns 0 for
/// uninitialized slots (EVM default).
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// 
/// ## Returns
/// The stored value, or 0 if not set
/// 
/// ## Gas Cost
/// In real EVM: 100-2100 gas depending on cold/warm access
pub fn get_storage(self: *const EvmState, address: Address.Address, slot: u256) u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    // Hot path: most storage reads are cache hits
    if (self.storage.get(key)) |value| {
        @branchHint(.likely);
        Log.debug("EvmState.get_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
        return value;
    } else {
        @branchHint(.cold);
        // Cold path: uninitialized storage defaults to 0
        Log.debug("EvmState.get_storage: addr={x}, slot={}, value=0 (uninitialized)", .{ Address.to_u256(address), slot });
        return 0;
    }
}

/// Set a value in persistent storage
/// 
/// Updates a storage slot for the given address. Setting a value
/// to 0 is different from deleting it - it still consumes storage.
/// This function records the change in the journal for potential revert.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number  
/// - `value`: Value to store
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Gas Cost
/// In real EVM: 2900-20000 gas depending on current/new value
pub fn set_storage(self: *EvmState, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    // Record the previous value for potential revert
    const previous_value = self.get_storage(address, slot);
    
    try self.journal.add_entry(.{ .storage_changed = .{
        .address = address,
        .slot = slot,
        .previous_value = previous_value,
    }});
    
    Log.debug("EvmState.set_storage: addr={x}, slot={}, value={}, prev_value={}", .{ 
        Address.to_u256(address), slot, value, previous_value 
    });
    
    try self.set_storage_direct(address, slot, value);
}

/// Set storage value directly without journaling
/// 
/// Internal function that applies storage changes without recording
/// them in the journal. Used during revert operations.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number  
/// - `value`: Value to store
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
pub fn set_storage_direct(self: *EvmState, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    try self.storage.put(key, value);
}

/// Get account balance
/// 
/// Returns the balance in wei for the given address.
/// Non-existent accounts have balance 0.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// Balance in wei (0 for non-existent accounts)
pub fn get_balance(self: *const EvmState, address: Address.Address) u256 {
    // Hot path: account exists with balance
    if (self.balances.get(address)) |balance| {
        @branchHint(.likely);
        Log.debug("EvmState.get_balance: addr={x}, balance={}", .{ Address.to_u256(address), balance });
        return balance;
    } else {
        @branchHint(.cold);
        // Cold path: new or zero-balance account
        Log.debug("EvmState.get_balance: addr={x}, balance=0 (new account)", .{ Address.to_u256(address) });
        return 0;
    }
}

/// Set account balance
/// 
/// Updates the balance for the given address. Setting balance
/// creates the account if it doesn't exist. This function records
/// the change in the journal for potential revert.
/// 
/// ## Parameters
/// - `address`: Account address
/// - `balance`: New balance in wei
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Note
/// Balance can exceed total ETH supply in test scenarios
pub fn set_balance(self: *EvmState, address: Address.Address, balance: u256) std.mem.Allocator.Error!void {
    // Record the previous balance for potential revert
    const previous_balance = self.get_balance(address);
    
    try self.journal.add_entry(.{ .balance_changed = .{
        .address = address,
        .previous_balance = previous_balance,
    }});
    
    Log.debug("EvmState.set_balance: addr={x}, balance={}, prev_balance={}", .{ 
        Address.to_u256(address), balance, previous_balance 
    });
    
    try self.set_balance_direct(address, balance);
}

/// Set balance directly without journaling
/// 
/// Internal function that applies balance changes without recording
/// them in the journal. Used during revert operations.
/// 
/// ## Parameters
/// - `address`: Account address
/// - `balance`: New balance in wei
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
pub fn set_balance_direct(self: *EvmState, address: Address.Address, balance: u256) std.mem.Allocator.Error!void {
    try self.balances.put(address, balance);
}

/// Remove account balance
/// 
/// Internal function used during revert operations to remove
/// a balance entry entirely.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// - Success: true if balance was removed, false if it didn't exist
pub fn remove_balance(self: *EvmState, address: Address.Address) bool {
    return self.balances.remove(address);
}

/// Get contract code
/// 
/// Returns the bytecode deployed at the given address.
/// EOAs and non-existent accounts return empty slice.
/// 
/// ## Parameters
/// - `address`: Contract address
/// 
/// ## Returns
/// Contract bytecode (empty slice for EOAs)
/// 
/// ## Note
/// The returned slice is owned by the state - do not free
pub fn get_code(self: *const EvmState, address: Address.Address) []const u8 {
    // Hot path: contract with code
    if (self.code.get(address)) |code| {
        @branchHint(.likely);
        Log.debug("EvmState.get_code: addr={x}, code_len={}", .{ Address.to_u256(address), code.len });
        return code;
    } else {
        @branchHint(.cold);
        // Cold path: EOA or non-existent account
        Log.debug("EvmState.get_code: addr={x}, code_len=0 (EOA or non-existent)", .{ Address.to_u256(address) });
        return &[_]u8{};
    }
}

/// Set contract code
/// 
/// Deploys bytecode to the given address. The state takes
/// ownership of the code slice. This function records the
/// change in the journal for potential revert.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `code`: Bytecode to deploy
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Important
/// The state does NOT copy the code - it takes ownership
/// of the provided slice
pub fn set_code(self: *EvmState, address: Address.Address, code: []const u8) std.mem.Allocator.Error!void {
    // Record the previous code for potential revert
    const previous_code = self.get_code(address);
    const previous_code_owned = if (previous_code.len > 0) previous_code else null;
    
    try self.journal.add_entry(.{ .code_changed = .{
        .address = address,
        .previous_code = previous_code_owned,
    }});
    
    Log.debug("EvmState.set_code: addr={x}, code_len={}, prev_code_len={}", .{ 
        Address.to_u256(address), code.len, if (previous_code_owned) |pc| pc.len else 0
    });
    
    try self.set_code_direct(address, code);
}

/// Set code directly without journaling
/// 
/// Internal function that applies code changes without recording
/// them in the journal. Used during revert operations.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `code`: Bytecode to deploy
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
pub fn set_code_direct(self: *EvmState, address: Address.Address, code: []const u8) std.mem.Allocator.Error!void {
    try self.code.put(address, code);
}

/// Remove contract code
/// 
/// Internal function used during revert operations to remove
/// a code entry entirely.
/// 
/// ## Parameters
/// - `address`: Contract address
/// 
/// ## Returns
/// - Success: true if code was removed, false if it didn't exist
pub fn remove_code(self: *EvmState, address: Address.Address) bool {
    return self.code.remove(address);
}

/// Get account nonce
/// 
/// Returns the transaction count for the given address.
/// Non-existent accounts have nonce 0.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// Current nonce (0 for new accounts)
/// 
/// ## Note
/// Nonce prevents transaction replay attacks
pub fn get_nonce(self: *const EvmState, address: Address.Address) u64 {
    // Hot path: existing account with nonce
    if (self.nonces.get(address)) |nonce| {
        @branchHint(.likely);
        Log.debug("EvmState.get_nonce: addr={x}, nonce={}", .{ Address.to_u256(address), nonce });
        return nonce;
    } else {
        @branchHint(.cold);
        // Cold path: new account
        Log.debug("EvmState.get_nonce: addr={x}, nonce=0 (new account)", .{ Address.to_u256(address) });
        return 0;
    }
}

/// Set account nonce
/// 
/// Updates the transaction count for the given address.
/// This function records the change in the journal for potential revert.
/// 
/// ## Parameters
/// - `address`: Account address
/// - `nonce`: New nonce value
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Warning
/// Setting nonce below current value can enable replay attacks
pub fn set_nonce(self: *EvmState, address: Address.Address, nonce: u64) std.mem.Allocator.Error!void {
    // Record the previous nonce for potential revert
    const previous_nonce = self.get_nonce(address);
    
    try self.journal.add_entry(.{ .nonce_changed = .{
        .address = address,
        .previous_nonce = previous_nonce,
    }});
    
    Log.debug("EvmState.set_nonce: addr={x}, nonce={}, prev_nonce={}", .{ 
        Address.to_u256(address), nonce, previous_nonce 
    });
    
    try self.set_nonce_direct(address, nonce);
}

/// Set nonce directly without journaling
/// 
/// Internal function that applies nonce changes without recording
/// them in the journal. Used during revert operations.
/// 
/// ## Parameters
/// - `address`: Account address
/// - `nonce`: New nonce value
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
pub fn set_nonce_direct(self: *EvmState, address: Address.Address, nonce: u64) std.mem.Allocator.Error!void {
    try self.nonces.put(address, nonce);
}

/// Remove account nonce
/// 
/// Internal function used during revert operations to remove
/// a nonce entry entirely.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// - Success: true if nonce was removed, false if it didn't exist
pub fn remove_nonce(self: *EvmState, address: Address.Address) bool {
    return self.nonces.remove(address);
}

/// Increment account nonce
/// 
/// Atomically increments the nonce and returns the previous value.
/// Used when processing transactions from an account. This function
/// uses the journaled set_nonce to ensure proper revert support.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// - Success: Previous nonce value (before increment)
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Example
/// ```zig
/// const tx_nonce = try state.increment_nonce(sender);
/// // tx_nonce is used for the transaction
/// // account nonce is now tx_nonce + 1
/// ```
pub fn increment_nonce(self: *EvmState, address: Address.Address) std.mem.Allocator.Error!u64 {
    const current_nonce = self.get_nonce(address);
    const new_nonce = current_nonce + 1;
    Log.debug("EvmState.increment_nonce: addr={x}, old_nonce={}, new_nonce={}", .{ Address.to_u256(address), current_nonce, new_nonce });
    try self.set_nonce(address, new_nonce);
    return current_nonce;
}

// Transient storage methods

/// Get a value from transient storage
/// 
/// Reads a transient storage slot (EIP-1153). Transient storage
/// is cleared after each transaction, making it cheaper than
/// persistent storage for temporary data.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// 
/// ## Returns
/// The stored value, or 0 if not set
/// 
/// ## Gas Cost
/// TLOAD: 100 gas (always warm)
pub fn get_transient_storage(self: *const EvmState, address: Address.Address, slot: u256) u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    // Hot path: transient storage hit
    if (self.transient_storage.get(key)) |value| {
        @branchHint(.likely);
        Log.debug("EvmState.get_transient_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
        return value;
    } else {
        @branchHint(.cold);
        // Cold path: uninitialized transient storage defaults to 0
        Log.debug("EvmState.get_transient_storage: addr={x}, slot={}, value=0 (uninitialized)", .{ Address.to_u256(address), slot });
        return 0;
    }
}

/// Set a value in transient storage
/// 
/// Updates a transient storage slot (EIP-1153). Values are
/// automatically cleared after the transaction completes.
/// This function records the change in the journal for potential revert.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// - `value`: Value to store temporarily
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Gas Cost
/// TSTORE: 100 gas (always warm)
/// 
/// ## Use Cases
/// - Reentrancy locks
/// - Temporary computation results
/// - Cross-contract communication within a transaction
pub fn set_transient_storage(self: *EvmState, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    // Record the previous value for potential revert
    const previous_value = self.get_transient_storage(address, slot);
    
    try self.journal.add_entry(.{ .transient_storage_changed = .{
        .address = address,
        .slot = slot,
        .previous_value = previous_value,
    }});
    
    Log.debug("EvmState.set_transient_storage: addr={x}, slot={}, value={}, prev_value={}", .{ 
        Address.to_u256(address), slot, value, previous_value 
    });
    
    try self.set_transient_storage_direct(address, slot, value);
}

/// Set transient storage value directly without journaling
/// 
/// Internal function that applies transient storage changes without recording
/// them in the journal. Used during revert operations.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// - `value`: Value to store temporarily
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
pub fn set_transient_storage_direct(self: *EvmState, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    try self.transient_storage.put(key, value);
}

// Log methods

/// Emit an event log
/// 
/// Records an event log from LOG0-LOG4 opcodes. The log is added
/// to the transaction's log list. This function records the change
/// in the journal for potential revert.
/// 
/// ## Parameters
/// - `address`: Contract emitting the log
/// - `topics`: Indexed topics (0-4 entries)
/// - `data`: Non-indexed log data
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if allocation fails
/// 
/// ## Memory Management
/// This function copies both topics and data to ensure they
/// persist beyond the current execution context.
/// 
/// ## Example
/// ```zig
/// // Emit Transfer event
/// const topics = [_]u256{
///     0x123..., // Transfer event signature
///     from_addr, // indexed from
///     to_addr,   // indexed to  
/// };
/// const data = encode_u256(amount);
/// try state.emit_log(contract_addr, &topics, data);
/// ```
pub fn emit_log(self: *EvmState, address: Address.Address, topics: []const u256, data: []const u8) std.mem.Allocator.Error!void {
    Log.debug("EvmState.emit_log: addr={x}, topics_len={}, data_len={}", .{ Address.to_u256(address), topics.len, data.len });
    
    // Record the log creation for potential revert
    const log_index = self.logs.items.len;
    try self.journal.add_entry(.{ .log_created = .{
        .log_index = log_index,
    }});
    
    // Clone the data to ensure it persists
    const data_copy = try self.allocator.alloc(u8, data.len);
    @memcpy(data_copy, data);

    // Clone the topics to ensure they persist
    const topics_copy = try self.allocator.alloc(u256, topics.len);
    @memcpy(topics_copy, topics);

    const log = EvmLog{
        .address = address,
        .topics = topics_copy,
        .data = data_copy,
    };

    try self.logs.append(log);
    Log.debug("EvmState.emit_log: Log emitted, total_logs={}, log_index={}", .{self.logs.items.len, log_index});
}

/// Remove a log entry
/// 
/// Internal function used during revert operations to remove
/// a log entry that was created during execution.
/// 
/// ## Parameters
/// - `log_index`: Index of the log to remove
/// 
/// ## Returns
/// - Success: void
/// - Error: If log_index is invalid
pub fn remove_log(self: *EvmState, log_index: usize) !void {
    if (log_index >= self.logs.items.len) {
        @branchHint(.cold);
        unreachable;
    }
    
    // Free the memory for the log we're removing
    const log_to_remove = self.logs.items[log_index];
    self.allocator.free(log_to_remove.topics);
    self.allocator.free(log_to_remove.data);
    
    // Remove the log by truncating the array
    // This works because logs are always removed in reverse order during revert
    if (log_index != self.logs.items.len - 1) {
        @branchHint(.cold);
        unreachable;
    }
    _ = self.logs.pop();
    
    Log.debug("EvmState.remove_log: Removed log at index={}, remaining_logs={}", .{log_index, self.logs.items.len});
}

// Journal interface methods

/// Create a snapshot of the current state
/// 
/// Captures the current state for potential revert operations.
/// Snapshots can be nested for handling complex call hierarchies.
/// 
/// ## Returns
/// - Success: Snapshot ID that can be used for commit/revert
/// - Error: OutOfMemory if snapshot allocation fails
/// 
/// ## Example
/// ```zig
/// const snapshot = try state.snapshot();
/// // ... risky operations ...
/// if (success) {
///     state.commit(snapshot);
/// } else {
///     try state.revert(snapshot);
/// }
/// ```
pub fn snapshot(self: *EvmState) std.mem.Allocator.Error!usize {
    return try self.journal.snapshot();
}

/// Commit changes since the given snapshot
/// 
/// Finalizes all changes made since the snapshot was created.
/// The snapshot is removed and can no longer be reverted to.
/// 
/// ## Parameters
/// - `snapshot_id`: Snapshot ID returned from snapshot()
/// 
/// ## Example
/// ```zig
/// const snapshot = try state.snapshot();
/// // ... successful operations ...
/// state.commit(snapshot);
/// ```
pub fn commit(self: *EvmState, snapshot_id: usize) void {
    self.journal.commit(snapshot_id);
}

/// Revert all changes since the given snapshot
/// 
/// Restores the state to exactly what it was when the snapshot
/// was created. All changes since the snapshot are undone.
/// 
/// ## Parameters
/// - `snapshot_id`: Snapshot ID returned from snapshot()
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory or other state modification errors
/// 
/// ## Example
/// ```zig
/// const snapshot = try state.snapshot();
/// // ... failed operations ...
/// try state.revert(snapshot);
/// ```
pub fn revert(self: *EvmState, snapshot_id: usize) !void {
    try self.journal.revert(snapshot_id, self);
}
