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
//! This implementation now uses a pluggable database interface for state persistence,
//! allowing different storage backends (memory, file, network) to be used without
//! changing the core EVM logic. Transient storage and logs are still managed locally
//! as they are transaction-scoped.
//! 
//! ## Memory Management
//! 
//! State data persistence is managed by the database interface. Local data like
//! transient storage and logs are heap-allocated using the provided allocator.
//! 
//! ## Thread Safety
//! 
//! This implementation is NOT thread-safe. External synchronization is required
//! for concurrent access.

const std = @import("std");
const Address = @import("Address");
const EvmLog = @import("evm_log.zig");
const StorageKey = @import("storage_key.zig");
const DatabaseInterface = @import("database_interface.zig").DatabaseInterface;
const DatabaseError = @import("database_interface.zig").DatabaseError;
const Account = @import("database_interface.zig").Account;
const Log = @import("../log.zig");

/// EVM state container
/// 
/// Manages all mutable blockchain state during EVM execution.
/// This includes account data, storage, and transaction artifacts.
const EvmState = @This();

/// Memory allocator for local allocations (transient storage, logs)
allocator: std.mem.Allocator,

/// Pluggable database interface for persistent state
/// Handles accounts, storage, and code persistence
database: DatabaseInterface,

/// Transient storage (EIP-1153: TSTORE/TLOAD)
/// Maps (address, slot) -> value
/// Cleared after each transaction, not persisted in database
transient_storage: std.AutoHashMap(StorageKey, u256),

/// Event logs emitted during execution
/// Ordered list of all LOG0-LOG4 events
/// Stored locally as they are transaction-scoped
logs: std.ArrayList(EvmLog),

/// Contracts marked for destruction (SELFDESTRUCT)
/// Maps address -> recipient address for funds transfer
/// Destruction happens at end of transaction
selfdestructs: std.AutoHashMap(Address.Address, Address.Address),

/// Initialize a new EVM state instance with database interface
/// 
/// Creates empty state with the provided allocator and database interface.
/// Only transient storage and logs are initialized locally.
/// 
/// ## Parameters
/// - `allocator`: Memory allocator for local allocations
/// - `database`: Database interface for persistent state storage
/// 
/// ## Returns
/// - Success: New initialized state instance
/// - Error: OutOfMemory if allocation fails
/// 
/// ## Example
/// ```zig
/// const db_interface = try database_factory.createMemoryDatabase(allocator);
/// defer database_factory.destroyDatabase(allocator, db_interface);
/// 
/// var state = try EvmState.init(allocator, db_interface);
/// defer state.deinit();
/// ```
pub fn init(allocator: std.mem.Allocator, database: DatabaseInterface) std.mem.Allocator.Error!EvmState {
    Log.debug("EvmState.init: Initializing EVM state with database interface", .{});
    
    var transient_storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer transient_storage.deinit();

    var logs = std.ArrayList(EvmLog).init(allocator);
    errdefer logs.deinit();

    var selfdestructs = std.AutoHashMap(Address.Address, Address.Address).init(allocator);
    errdefer selfdestructs.deinit();

    Log.debug("EvmState.init: EVM state initialization complete", .{});
    return EvmState{
        .allocator = allocator,
        .database = database,
        .transient_storage = transient_storage,
        .logs = logs,
        .selfdestructs = selfdestructs,
    };
}

/// Clean up all allocated resources
/// 
/// Frees all memory used by the state, including:
/// - Transient storage hash map
/// - Log data (topics and data arrays)
/// 
/// ## Important
/// After calling deinit(), the state instance is invalid and
/// must not be used. The database interface is NOT cleaned up
/// as it may be owned by the caller.
pub fn deinit(self: *EvmState) void {
    Log.debug("EvmState.deinit: Cleaning up EVM state, logs_count={}", .{
        self.logs.items.len
    });
    
    self.transient_storage.deinit();
    self.selfdestructs.deinit();

    // Clean up logs - free allocated memory for topics and data
    for (self.logs.items) |log| {
        self.allocator.free(log.topics);
        self.allocator.free(log.data);
    }
    self.logs.deinit();
    
    Log.debug("EvmState.deinit: EVM state cleanup complete", .{});
}

// State access methods

/// Get a value from persistent storage
/// 
/// Reads a storage slot for the given address through the database interface.
/// Returns 0 for uninitialized slots (EVM default).
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// 
/// ## Returns
/// The stored value, or 0 if not set or on database error
/// 
/// ## Gas Cost
/// In real EVM: 100-2100 gas depending on cold/warm access
pub fn get_storage(self: *const EvmState, address: Address.Address, slot: u256) u256 {
    // Use database interface to get storage value
    const value = self.database.get_storage(address, slot) catch |err| {
        @branchHint(.cold);
        Log.debug("EvmState.get_storage: Database error {}, returning 0", .{err});
        return 0;
    };
    
    Log.debug("EvmState.get_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
    return value;
}

/// Set a value in persistent storage
/// 
/// Updates a storage slot for the given address through the database interface.
/// Setting a value to 0 is different from deleting it - it still consumes storage.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number  
/// - `value`: Value to store
/// 
/// ## Returns
/// - Success: void
/// - Error: DatabaseError if storage operation fails
/// 
/// ## Gas Cost
/// In real EVM: 2900-20000 gas depending on current/new value
pub fn set_storage(self: *EvmState, address: Address.Address, slot: u256, value: u256) DatabaseError!void {
    Log.debug("EvmState.set_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
    try self.database.set_storage(address, slot, value);
}

/// Get account balance
/// 
/// Returns the balance in wei for the given address through the database interface.
/// Non-existent accounts have balance 0.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// Balance in wei (0 for non-existent accounts or on error)
pub fn get_balance(self: *const EvmState, address: Address.Address) u256 {
    // Get account from database
    const account = self.database.get_account(address) catch |err| {
        @branchHint(.cold);
        Log.debug("EvmState.get_balance: Database error {}, returning 0", .{err});
        return 0;
    };
    
    if (account) |acc| {
        @branchHint(.likely);
        Log.debug("EvmState.get_balance: addr={x}, balance={}", .{ Address.to_u256(address), acc.balance });
        return acc.balance;
    } else {
        @branchHint(.cold);
        Log.debug("EvmState.get_balance: addr={x}, balance=0 (new account)", .{ Address.to_u256(address) });
        return 0;
    }
}

/// Set account balance
/// 
/// Updates the balance for the given address through the database interface.
/// Creates the account if it doesn't exist, preserving other account data.
/// 
/// ## Parameters
/// - `address`: Account address
/// - `balance`: New balance in wei
/// 
/// ## Returns
/// - Success: void
/// - Error: DatabaseError if account operation fails
/// 
/// ## Note
/// Balance can exceed total ETH supply in test scenarios
pub fn set_balance(self: *EvmState, address: Address.Address, balance: u256) DatabaseError!void {
    Log.debug("EvmState.set_balance: addr={x}, balance={}", .{ Address.to_u256(address), balance });
    
    // Get existing account or create new one
    var account = self.database.get_account(address) catch Account.zero();
    if (account == null) {
        account = Account.zero();
    }
    
    // Update balance and save account
    account.?.balance = balance;
    try self.database.set_account(address, account.?);
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
/// - Success: void
/// - Error: DatabaseError if account operation fails
pub fn remove_balance(self: *EvmState, address: Address.Address) DatabaseError!void {
    // Set balance to 0 instead of removing - database interface handles persistence
    try self.set_balance(address, 0);
}

/// Get contract code
/// 
/// Returns the bytecode deployed at the given address through the database interface.
/// EOAs and non-existent accounts return empty slice.
/// 
/// ## Parameters
/// - `address`: Contract address
/// 
/// ## Returns
/// Contract bytecode (empty slice for EOAs or on error)
/// 
/// ## Note
/// The returned slice is owned by the database - do not free
pub fn get_code(self: *const EvmState, address: Address.Address) []const u8 {
    // Get account to find code hash
    const account = self.database.get_account(address) catch |err| {
        @branchHint(.cold);
        Log.debug("EvmState.get_code: Database error {}, returning empty", .{err});
        return &[_]u8{};
    };
    
    if (account) |acc| {
        // Check if account has code (non-zero code hash)
        const zero_hash = [_]u8{0} ** 32;
        if (std.mem.eql(u8, &acc.code_hash, &zero_hash)) {
            @branchHint(.cold);
            Log.debug("EvmState.get_code: addr={x}, code_len=0 (EOA)", .{ Address.to_u256(address) });
            return &[_]u8{};
        }
        
        // Get code by hash
        const code = self.database.get_code(acc.code_hash) catch |err| {
            @branchHint(.cold);
            Log.debug("EvmState.get_code: Code fetch error {}, returning empty", .{err});
            return &[_]u8{};
        };
        
        Log.debug("EvmState.get_code: addr={x}, code_len={}", .{ Address.to_u256(address), code.len });
        return code;
    } else {
        @branchHint(.cold);
        Log.debug("EvmState.get_code: addr={x}, code_len=0 (non-existent account)", .{ Address.to_u256(address) });
        return &[_]u8{};
    }
}

/// Set contract code
/// 
/// Deploys bytecode to the given address through the database interface.
/// Updates the account's code hash.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `code`: Bytecode to deploy
/// 
/// ## Returns
/// - Success: void
/// - Error: DatabaseError if code storage or account update fails
/// 
/// ## Important
/// The database interface handles code storage and copying
pub fn set_code(self: *EvmState, address: Address.Address, code: []const u8) DatabaseError!void {
    Log.debug("EvmState.set_code: addr={x}, code_len={}", .{ Address.to_u256(address), code.len });
    
    // Store code in database and get its hash
    const code_hash = try self.database.set_code(code);
    
    // Get existing account or create new one
    var account = self.database.get_account(address) catch Account.zero();
    if (account == null) {
        account = Account.zero();
    }
    
    // Update account with new code hash
    account.?.code_hash = code_hash;
    try self.database.set_account(address, account.?);
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
/// - Success: void
/// - Error: DatabaseError if account operation fails
pub fn remove_code(self: *EvmState, address: Address.Address) DatabaseError!void {
    // Set empty code instead of removing - database interface handles persistence
    try self.set_code(address, &[_]u8{});
}

/// Get account nonce
/// 
/// Returns the transaction count for the given address through the database interface.
/// Non-existent accounts have nonce 0.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// Current nonce (0 for new accounts or on error)
/// 
/// ## Note
/// Nonce prevents transaction replay attacks
pub fn get_nonce(self: *const EvmState, address: Address.Address) u64 {
    // Get account from database
    const account = self.database.get_account(address) catch |err| {
        @branchHint(.cold);
        Log.debug("EvmState.get_nonce: Database error {}, returning 0", .{err});
        return 0;
    };
    
    if (account) |acc| {
        @branchHint(.likely);
        Log.debug("EvmState.get_nonce: addr={x}, nonce={}", .{ Address.to_u256(address), acc.nonce });
        return acc.nonce;
    } else {
        @branchHint(.cold);
        Log.debug("EvmState.get_nonce: addr={x}, nonce=0 (new account)", .{ Address.to_u256(address) });
        return 0;
    }
}

/// Set account nonce
/// 
/// Updates the transaction count for the given address through the database interface.
/// 
/// ## Parameters
/// - `address`: Account address
/// - `nonce`: New nonce value
/// 
/// ## Returns
/// - Success: void
/// - Error: DatabaseError if account operation fails
/// 
/// ## Warning
/// Setting nonce below current value can enable replay attacks
pub fn set_nonce(self: *EvmState, address: Address.Address, nonce: u64) DatabaseError!void {
    Log.debug("EvmState.set_nonce: addr={x}, nonce={}", .{ Address.to_u256(address), nonce });
    
    // Get existing account or create new one
    var account = self.database.get_account(address) catch Account.zero();
    if (account == null) {
        account = Account.zero();
    }
    
    // Update nonce and save account
    account.?.nonce = nonce;
    try self.database.set_account(address, account.?);
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
/// - Success: void
/// - Error: DatabaseError if account operation fails
pub fn remove_nonce(self: *EvmState, address: Address.Address) DatabaseError!void {
    // Set nonce to 0 instead of removing - database interface handles persistence
    try self.set_nonce(address, 0);
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
/// - Error: DatabaseError if account operation fails
/// 
/// ## Example
/// ```zig
/// const tx_nonce = try state.increment_nonce(sender);
/// // tx_nonce is used for the transaction
/// // account nonce is now tx_nonce + 1
/// ```
pub fn increment_nonce(self: *EvmState, address: Address.Address) DatabaseError!u64 {
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
    Log.debug("EvmState.set_transient_storage: addr={x}, slot={}, value={}", .{ 
        Address.to_u256(address), slot, value
    });
    
    const key = StorageKey{ .address = address, .slot = slot };
    try self.transient_storage.put(key, value);
}

// Log methods

/// Emit an event log
/// 
/// Records an event log from LOG0-LOG4 opcodes. The log is added
/// to the transaction's log list.
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
    Log.debug("EvmState.emit_log: Log emitted, total_logs={}", .{self.logs.items.len});
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

// SELFDESTRUCT methods

/// Mark a contract for destruction
/// 
/// Records that a contract should be destroyed at the end of the
/// transaction. The contract's balance will be transferred to the
/// recipient address.
/// 
/// ## Parameters
/// - `contract_address`: Address of contract to destroy
/// - `recipient`: Address to receive the contract's balance
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Note
/// Multiple SELFDESTRUCT calls on the same contract only record
/// the latest recipient address.
pub fn mark_for_destruction(self: *EvmState, contract_address: Address.Address, recipient: Address.Address) std.mem.Allocator.Error!void {
    Log.debug("EvmState.mark_for_destruction: contract={x}, recipient={x}", .{ Address.to_u256(contract_address), Address.to_u256(recipient) });
    try self.selfdestructs.put(contract_address, recipient);
}

/// Check if a contract is marked for destruction
/// 
/// Returns whether the given address has been marked for destruction
/// by a SELFDESTRUCT opcode in this transaction.
/// 
/// ## Parameters
/// - `address`: Contract address to check
/// 
/// ## Returns
/// true if marked for destruction, false otherwise
pub fn is_marked_for_destruction(self: *const EvmState, address: Address.Address) bool {
    return self.selfdestructs.contains(address);
}

/// Get the recipient address for a destructed contract
/// 
/// Returns the address that will receive the balance of a
/// contract marked for destruction.
/// 
/// ## Parameters
/// - `address`: Contract address
/// 
/// ## Returns
/// - Some(recipient): If contract is marked for destruction
/// - None: If contract is not marked for destruction
pub fn get_destruction_recipient(self: *const EvmState, address: Address.Address) ?Address.Address {
    return self.selfdestructs.get(address);
}

/// Clear transient storage for the next transaction
/// 
/// Clears all transient storage slots. Called at the end of
/// each transaction as per EIP-1153.
/// 
/// ## Example
/// ```zig
/// // At end of transaction
/// state.clear_transient_storage();
/// ```
pub fn clear_transient_storage(self: *EvmState) void {
    Log.debug("EvmState.clear_transient_storage: Clearing transient storage", .{});
    self.transient_storage.clearAndFree();
}
