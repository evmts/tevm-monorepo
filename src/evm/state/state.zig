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
const Log = @import("../log.zig");

/// EVM state container
/// 
/// Manages all mutable blockchain state during EVM execution.
/// This includes account data, storage, and transaction artifacts.
const Self = @This();

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

/// Contracts marked for destruction (SELFDESTRUCT)
/// Maps address -> recipient address for funds transfer
/// Destruction happens at end of transaction
selfdestructs: std.AutoHashMap(Address.Address, Address.Address),

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
pub fn init(allocator: std.mem.Allocator) std.mem.Allocator.Error!Self {
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

    var selfdestructs = std.AutoHashMap(Address.Address, Address.Address).init(allocator);
    errdefer selfdestructs.deinit();

    Log.debug("EvmState.init: EVM state initialization complete", .{});
    return Self{
        .allocator = allocator,
        .storage = storage,
        .balances = balances,
        .code = code,
        .nonces = nonces,
        .transient_storage = transient_storage,
        .logs = logs,
        .selfdestructs = selfdestructs,
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
pub fn deinit(self: *Self) void {
    Log.debug("EvmState.deinit: Cleaning up EVM state, storage_count={}, balance_count={}, code_count={}, logs_count={}", .{
        self.storage.count(), self.balances.count(), self.code.count(), self.logs.items.len
    });
    
    self.storage.deinit();
    self.balances.deinit();
    self.code.deinit();
    self.nonces.deinit();
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
pub fn get_storage(self: *const Self, address: Address.Address, slot: u256) u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    const value = self.storage.get(key) orelse 0;
    Log.debug("EvmState.get_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
    return value;
}

/// Set a value in persistent storage
/// 
/// Updates a storage slot for the given address. Setting a value
/// to 0 is different from deleting it - it still consumes storage.
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
pub fn set_storage(self: *Self, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    Log.debug("EvmState.set_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
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
pub fn get_balance(self: *const Self, address: Address.Address) u256 {
    const balance = self.balances.get(address) orelse 0;
    Log.debug("EvmState.get_balance: addr={x}, balance={}", .{ Address.to_u256(address), balance });
    return balance;
}

/// Set account balance
/// 
/// Updates the balance for the given address. Setting balance
/// creates the account if it doesn't exist.
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
pub fn set_balance(self: *Self, address: Address.Address, balance: u256) std.mem.Allocator.Error!void {
    Log.debug("EvmState.set_balance: addr={x}, balance={}", .{ Address.to_u256(address), balance });
    try self.balances.put(address, balance);
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
pub fn get_code(self: *const Self, address: Address.Address) []const u8 {
    const code = self.code.get(address) orelse &[_]u8{};
    Log.debug("EvmState.get_code: addr={x}, code_len={}", .{ Address.to_u256(address), code.len });
    return code;
}

/// Set contract code
/// 
/// Deploys bytecode to the given address. The state takes
/// ownership of the code slice.
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
pub fn set_code(self: *Self, address: Address.Address, code: []const u8) std.mem.Allocator.Error!void {
    Log.debug("EvmState.set_code: addr={x}, code_len={}", .{ Address.to_u256(address), code.len });
    try self.code.put(address, code);
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
pub fn get_nonce(self: *const Self, address: Address.Address) u64 {
    const nonce = self.nonces.get(address) orelse 0;
    Log.debug("EvmState.get_nonce: addr={x}, nonce={}", .{ Address.to_u256(address), nonce });
    return nonce;
}

/// Set account nonce
/// 
/// Updates the transaction count for the given address.
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
pub fn set_nonce(self: *Self, address: Address.Address, nonce: u64) std.mem.Allocator.Error!void {
    Log.debug("EvmState.set_nonce: addr={x}, nonce={}", .{ Address.to_u256(address), nonce });
    try self.nonces.put(address, nonce);
}

/// Increment account nonce
/// 
/// Atomically increments the nonce and returns the previous value.
/// Used when processing transactions from an account.
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
pub fn increment_nonce(self: *Self, address: Address.Address) std.mem.Allocator.Error!u64 {
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
pub fn get_transient_storage(self: *const Self, address: Address.Address, slot: u256) u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    const value = self.transient_storage.get(key) orelse 0;
    Log.debug("EvmState.get_transient_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
    return value;
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
pub fn set_transient_storage(self: *Self, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    Log.debug("EvmState.set_transient_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
    try self.transient_storage.put(key, value);
}

// Log methods

/// Emit an event log
/// 
/// Records an event log from LOG0-LOG4 opcodes. The log is added
/// to the transaction's log list and cannot be removed.
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
pub fn emit_log(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) std.mem.Allocator.Error!void {
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
pub fn mark_for_destruction(self: *Self, contract_address: Address.Address, recipient: Address.Address) std.mem.Allocator.Error!void {
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
pub fn is_marked_for_destruction(self: *const Self, address: Address.Address) bool {
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
pub fn get_destruction_recipient(self: *const Self, address: Address.Address) ?Address.Address {
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
pub fn clear_transient_storage(self: *Self) void {
    Log.debug("EvmState.clear_transient_storage: Clearing transient storage", .{});
    self.transient_storage.clearAndFree();
}
