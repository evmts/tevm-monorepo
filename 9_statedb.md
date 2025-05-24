# StateDB Implementation Issue

## Overview

StateDB.zig provides the primary interface for managing Ethereum state including accounts, storage, and code with full transactional support through journaling and efficient caching for optimal performance.

## Requirements

- Manage account state (balance, nonce, code, storage)
- Integrate with Journal for transactional semantics
- Support account creation and deletion
- Handle code deployment and retrieval
- Manage storage with efficient caching
- Track access lists for EIP-2929
- Support state root calculation
- Handle empty account cleanup
- Provide snapshot and revert capabilities
- Support state iteration for debugging

## Interface

```zig
const std = @import("std");
const Address = @import("address").Address;
const B256 = @import("utils").B256;
const Account = @import("Account.zig").Account;
const Storage = @import("Storage.zig").Storage;
const Journal = @import("Journal.zig").Journal;

pub const StateDBError = error{
    AccountNotFound,
    InsufficientBalance,
    NonceOverflow,
    CodeTooLarge,
    OutOfMemory,
    InvalidSnapshot,
};

/// Snapshot identifier for state reversion
pub const Snapshot = u32;

pub const StateDB = struct {
    /// Account states indexed by address
    accounts: std.AutoHashMap(Address, *AccountState),
    /// Journal for tracking changes
    journal: *Journal,
    /// Code storage indexed by code hash
    codes: std.AutoHashMap(B256, []const u8),
    /// Snapshot counter
    snapshot_id: u32,
    /// Allocator for memory management
    allocator: std.mem.Allocator,
    /// Empty code hash constant
    pub const EMPTY_CODE_HASH = B256.fromHex("c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");
    /// Empty storage root constant
    pub const EMPTY_STORAGE_ROOT = B256.fromHex("56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421");

    // Initialization

    /// Create a new StateDB
    pub fn init(allocator: std.mem.Allocator, journal: *Journal) !StateDB

    /// Clean up resources
    pub fn deinit(self: *StateDB) void

    // Account Management

    /// Get or create account state
    pub fn getAccount(self: *StateDB, address: Address) !*AccountState

    /// Check if account exists
    pub fn accountExists(self: *const StateDB, address: Address) bool

    /// Check if account is empty (no balance, nonce, code)
    pub fn isEmpty(self: *const StateDB, address: Address) bool

    /// Create a new account
    pub fn createAccount(self: *StateDB, address: Address) !void

    /// Delete an account (SELFDESTRUCT)
    pub fn deleteAccount(self: *StateDB, address: Address) !void

    // Balance Operations

    /// Get account balance
    pub fn getBalance(self: *StateDB, address: Address) u256

    /// Set account balance
    pub fn setBalance(self: *StateDB, address: Address, balance: u256) !void

    /// Add to balance
    pub fn addBalance(self: *StateDB, address: Address, amount: u256) !void

    /// Subtract from balance (with underflow check)
    pub fn subBalance(self: *StateDB, address: Address, amount: u256) StateDBError!void

    /// Transfer balance between accounts
    pub fn transfer(self: *StateDB, from: Address, to: Address, amount: u256) StateDBError!void

    // Nonce Operations

    /// Get account nonce
    pub fn getNonce(self: *StateDB, address: Address) u64

    /// Set account nonce
    pub fn setNonce(self: *StateDB, address: Address, nonce: u64) !void

    /// Increment nonce (with overflow check)
    pub fn incrementNonce(self: *StateDB, address: Address) StateDBError!void

    // Code Operations

    /// Get account code
    pub fn getCode(self: *StateDB, address: Address) []const u8

    /// Get account code hash
    pub fn getCodeHash(self: *StateDB, address: Address) B256

    /// Get account code size
    pub fn getCodeSize(self: *StateDB, address: Address) usize

    /// Set account code
    pub fn setCode(self: *StateDB, address: Address, code: []const u8) StateDBError!void

    // Storage Operations

    /// Get storage value
    pub fn getStorage(self: *StateDB, address: Address, key: B256) B256

    /// Get committed (original) storage value
    pub fn getCommittedStorage(self: *StateDB, address: Address, key: B256) B256

    /// Set storage value
    pub fn setStorage(self: *StateDB, address: Address, key: B256, value: B256) !void

    /// Clear all storage for an account
    pub fn clearStorage(self: *StateDB, address: Address) !void

    // Access List Operations (EIP-2929)

    /// Add account to access list
    pub fn accessAccount(self: *StateDB, address: Address) !bool

    /// Add storage slot to access list
    pub fn accessStorage(self: *StateDB, address: Address, key: B256) !bool

    // Snapshot Operations

    /// Create a snapshot of current state
    pub fn snapshot(self: *StateDB) !Snapshot

    /// Revert to a snapshot
    pub fn revertToSnapshot(self: *StateDB, snap: Snapshot) StateDBError!void

    /// Commit current changes
    pub fn commit(self: *StateDB) !void

    // State Root Operations

    /// Calculate current state root
    pub fn stateRoot(self: *StateDB) !B256

    /// Intermediate state root (for debugging)
    pub fn intermediateRoot(self: *StateDB) !B256

    // Utility Operations

    /// Touch account for EIP-158 empty account cleanup
    pub fn touch(self: *StateDB, address: Address) !void

    /// Check if account is marked for deletion
    pub fn isDeleted(self: *const StateDB, address: Address) bool

    /// Get refund counter
    pub fn getRefund(self: *const StateDB) u64

    /// Add to refund counter
    pub fn addRefund(self: *StateDB, amount: u64) !void

    /// Subtract from refund counter
    pub fn subRefund(self: *StateDB, amount: u64) !void

    /// Finalize state after block execution
    pub fn finalize(self: *StateDB) !void

    /// Iterate over all accounts (for debugging)
    pub fn iterateAccounts(self: *StateDB, callback: fn(Address, *AccountState) void) void

    /// Get dirty accounts (modified in current transaction)
    pub fn getDirtyAccounts(self: *StateDB) ![]const Address
};

/// Account state wrapper with caching
pub const AccountState = struct {
    /// The account data
    account: Account,
    /// Storage for this account
    storage: Storage,
    /// Original values for modified storage slots
    original_storage: std.AutoHashMap(B256, B256),
    /// Cached code (loaded on demand)
    code: ?[]const u8,
    /// Dirty flags for optimization
    dirty: bool,
    dirty_code: bool,
    /// Deletion flag
    deleted: bool,
    /// Touch flag for empty account cleanup
    touched: bool,
    /// Storage clear flag
    storage_cleared: bool,

    /// Initialize account state
    pub fn init(allocator: std.mem.Allocator) !AccountState

    /// Clean up resources
    pub fn deinit(self: *AccountState) void

    /// Mark account as dirty
    pub fn markDirty(self: *AccountState) void

    /// Check if account is empty
    pub fn isEmpty(self: *const AccountState) bool

    /// Get storage value with caching
    pub fn getStorage(self: *AccountState, key: B256) B256

    /// Set storage value with dirty tracking
    pub fn setStorage(self: *AccountState, key: B256, value: B256) !void

    /// Get original storage value
    pub fn getOriginalStorage(self: *AccountState, key: B256) B256

    /// Clear all storage
    pub fn clearStorage(self: *AccountState) !void

    /// Apply journal changes
    pub fn applyJournalEntry(self: *AccountState, entry: Journal.Change) !void
};
```

## Implementation Details

### Account Caching Strategy

```zig
pub fn getAccount(self: *StateDB, address: Address) !*AccountState {
    // Check cache first
    if (self.accounts.get(address)) |account| {
        return account;
    }
    
    // Create new account state
    var account_state = try self.allocator.create(AccountState);
    account_state.* = try AccountState.init(self.allocator);
    
    // Record creation in journal
    try self.journal.recordAccountCreated(address);
    
    // Add to cache
    try self.accounts.put(address, account_state);
    
    return account_state;
}
```

### Storage Access Pattern

```zig
pub fn getStorage(self: *StateDB, address: Address, key: B256) B256 {
    const account = self.getAccount(address) catch return B256.zero();
    
    // Access tracking for EIP-2929
    _ = self.journal.accessStorage(address, key) catch {};
    
    return account.getStorage(key);
}

pub fn setStorage(self: *StateDB, address: Address, key: B256, value: B256) !void {
    var account = try self.getAccount(address);
    
    // Get current value for journaling
    const current = account.getStorage(key);
    
    if (!current.eql(value)) {
        // Record change in journal
        try self.journal.recordStorageChange(address, key, current);
        
        // Update storage
        try account.setStorage(key, value);
    }
}
```

### Code Management

```zig
pub fn setCode(self: *StateDB, address: Address, code: []const u8) StateDBError!void {
    // Check code size limit (EIP-3541)
    if (code.len > 0 and code[0] == 0xEF) {
        return error.InvalidCodePrefix;
    }
    
    // Check max code size (EIP-170)
    if (code.len > 24576) {
        return error.CodeTooLarge;
    }
    
    var account = try self.getAccount(address);
    
    // Calculate code hash
    var hash: B256 = undefined;
    if (code.len == 0) {
        hash = EMPTY_CODE_HASH;
    } else {
        // Keccak256 of code
        hash = B256.keccak256(code);
    }
    
    // Store code in global code storage
    if (code.len > 0) {
        const code_copy = try self.allocator.dupe(u8, code);
        try self.codes.put(hash, code_copy);
    }
    
    // Record change in journal
    try self.journal.recordCodeChange(address, account.account.code_hash, account.code orelse &[_]u8{});
    
    // Update account
    account.account.code_hash = hash;
    account.code = if (code.len > 0) code else null;
    account.dirty_code = true;
    account.markDirty();
}
```

### Snapshot Implementation

```zig
pub fn snapshot(self: *StateDB) !Snapshot {
    // Create journal checkpoint
    try self.journal.checkpoint();
    
    // Return snapshot ID
    const snap = self.snapshot_id;
    self.snapshot_id += 1;
    
    return snap;
}

pub fn revertToSnapshot(self: *StateDB, snap: Snapshot) StateDBError!void {
    // Validate snapshot
    if (snap >= self.snapshot_id) {
        return error.InvalidSnapshot;
    }
    
    // Revert journal to checkpoint
    try self.journal.revert();
    
    // Apply reverted changes to state
    // Journal revert will call back into StateDB to apply changes
}
```

## Usage Example

```zig
// Initialize StateDB with journal
var journal = try Journal.init(allocator);
var state_db = try StateDB.init(allocator, &journal);
defer state_db.deinit();

// Create snapshot for transaction
const snap = try state_db.snapshot();

// Transfer value
try state_db.transfer(sender, recipient, amount);

// Deploy contract
try state_db.createAccount(contract_addr);
try state_db.setCode(contract_addr, bytecode);
try state_db.setNonce(contract_addr, 1);

// Store value
try state_db.setStorage(contract_addr, key, value);

// Check balance
const balance = state_db.getBalance(contract_addr);

if (execution_failed) {
    // Revert all changes
    try state_db.revertToSnapshot(snap);
} else {
    // Commit changes
    try state_db.commit();
}

// Get state root
const root = try state_db.stateRoot();
```

## Performance Considerations

1. **Lazy Loading**: Load account data and code only when accessed
2. **Batch Updates**: Collect changes in journal before applying
3. **Storage Caching**: Cache frequently accessed storage slots
4. **Dirty Tracking**: Only persist modified accounts
5. **Code Deduplication**: Store code once per unique hash

## Testing Requirements

1. **Account Operations**:
   - Test account creation/deletion
   - Test balance transfers
   - Test nonce management
   - Test empty account handling

2. **Storage Operations**:
   - Test storage get/set
   - Test storage clearing
   - Test original value tracking

3. **Code Management**:
   - Test code deployment
   - Test code size limits
   - Test invalid code prefix

4. **Snapshot/Revert**:
   - Test nested snapshots
   - Test revert correctness
   - Test partial reverts

5. **Integration**:
   - Test with Journal
   - Test state root calculation
   - Test access list tracking

## References

- [Go-Ethereum statedb.go](https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go)
- [revm InMemoryDB](https://github.com/bluealloy/revm/blob/main/crates/revm/src/db/in_memory_db.rs)
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - Gas cost increases for state access opcodes