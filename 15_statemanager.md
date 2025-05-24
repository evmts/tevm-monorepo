# StateManager Implementation Issue

## Overview

StateManager.zig provides a high-level interface for EVM state operations, managing access lists (EIP-2929), caching strategies, fork handling, and coordination between StateDB and the EVM execution layer.

## Requirements

- Manage EIP-2929 access lists for warm/cold storage
- Handle transaction context and pre-warming
- Coordinate with StateDB for persistence
- Support state caching and optimization
- Handle fork-specific state access
- Manage original storage values for SSTORE
- Track touched accounts for cleanup
- Support state prefetching
- Handle account abstraction delegations
- Provide metrics and debugging support

## Interface

```zig
const std = @import("std");
const Address = @import("address").Address;
const B256 = @import("utils").B256;
const StateDB = @import("StateDB.zig").StateDB;
const Account = @import("Account.zig").Account;
const Journal = @import("Journal.zig").Journal;

pub const StateManagerError = error{
    StateDBError,
    CacheMiss,
    ForkError,
    OutOfMemory,
};

/// Access list tracking for EIP-2929
pub const AccessList = struct {
    /// Warm addresses
    warm_addresses: std.AutoHashMap(Address, void),
    /// Warm storage slots
    warm_storage: std.AutoHashMap(StorageKey, void),
    /// Allocator
    allocator: std.mem.Allocator,

    pub const StorageKey = struct {
        address: Address,
        slot: B256,
    };

    /// Initialize access list
    pub fn init(allocator: std.mem.Allocator) AccessList {
        return .{
            .warm_addresses = std.AutoHashMap(Address, void).init(allocator),
            .warm_storage = std.AutoHashMap(StorageKey, void).init(allocator),
            .allocator = allocator,
        };
    }

    /// Clean up
    pub fn deinit(self: *AccessList) void {
        self.warm_addresses.deinit();
        self.warm_storage.deinit();
    }

    /// Check if address is warm
    pub fn isAddressWarm(self: *const AccessList, address: Address) bool {
        return self.warm_addresses.contains(address);
    }

    /// Check if storage slot is warm
    pub fn isSlotWarm(self: *const AccessList, address: Address, slot: B256) bool {
        return self.warm_storage.contains(.{ .address = address, .slot = slot });
    }

    /// Add address (returns true if was cold)
    pub fn addAddress(self: *AccessList, address: Address) !bool {
        const result = try self.warm_addresses.getOrPut(address);
        return !result.found_existing;
    }

    /// Add storage slot (returns true if was cold)
    pub fn addSlot(self: *AccessList, address: Address, slot: B256) !bool {
        const key = StorageKey{ .address = address, .slot = slot };
        const result = try self.warm_storage.getOrPut(key);
        return !result.found_existing;
    }

    /// Clear all entries
    pub fn clear(self: *AccessList) void {
        self.warm_addresses.clearRetainingCapacity();
        self.warm_storage.clearRetainingCapacity();
    }

    /// Pre-warm from transaction access list
    pub fn preWarm(self: *AccessList, addresses: []const Address, slots: []const StorageKey) !void {
        for (addresses) |addr| {
            _ = try self.addAddress(addr);
        }
        for (slots) |slot| {
            _ = try self.addSlot(slot.address, slot.slot);
        }
    }
};

/// Fork handling for state access
pub const ForkState = struct {
    /// Fork URL for RPC calls
    fork_url: []const u8,
    /// Block number to fork from
    fork_block: u64,
    /// Cache for fork data
    cache: ForkCache,
    /// HTTP client for RPC
    client: *HttpClient,

    pub const ForkCache = struct {
        accounts: std.AutoHashMap(Address, Account),
        storage: std.AutoHashMap(AccessList.StorageKey, B256),
        code: std.AutoHashMap(Address, []const u8),
        allocator: std.mem.Allocator,

        pub fn init(allocator: std.mem.Allocator) ForkCache {
            return .{
                .accounts = std.AutoHashMap(Address, Account).init(allocator),
                .storage = std.AutoHashMap(AccessList.StorageKey, B256).init(allocator),
                .code = std.AutoHashMap(Address, []const u8).init(allocator),
                .allocator = allocator,
            };
        }

        pub fn deinit(self: *ForkCache) void {
            self.accounts.deinit();
            self.storage.deinit();
            
            var code_iter = self.code.iterator();
            while (code_iter.next()) |entry| {
                self.allocator.free(entry.value_ptr.*);
            }
            self.code.deinit();
        }
    };

    /// Fetch account from fork
    pub fn getAccount(self: *ForkState, address: Address) !Account {
        // Check cache first
        if (self.cache.accounts.get(address)) |account| {
            return account;
        }

        // Fetch from RPC
        const account = try self.fetchAccountRPC(address);
        try self.cache.accounts.put(address, account);
        return account;
    }

    /// Fetch storage from fork
    pub fn getStorage(self: *ForkState, address: Address, slot: B256) !B256 {
        const key = AccessList.StorageKey{ .address = address, .slot = slot };
        
        // Check cache first
        if (self.cache.storage.get(key)) |value| {
            return value;
        }

        // Fetch from RPC
        const value = try self.fetchStorageRPC(address, slot);
        try self.cache.storage.put(key, value);
        return value;
    }

    // RPC methods would be implemented here
    fn fetchAccountRPC(self: *ForkState, address: Address) !Account {
        _ = self;
        _ = address;
        // Implementation would make eth_getBalance, eth_getNonce, etc. calls
        return Account.init();
    }

    fn fetchStorageRPC(self: *ForkState, address: Address, slot: B256) !B256 {
        _ = self;
        _ = address;
        _ = slot;
        // Implementation would make eth_getStorageAt call
        return B256.zero();
    }
};

/// Main state manager
pub const StateManager = struct {
    /// Underlying state database
    state_db: *StateDB,
    /// EIP-2929 access tracking
    access_list: AccessList,
    /// Journal for changes
    journal: *Journal,
    /// Fork state (if forking)
    fork_state: ?*ForkState,
    /// Transaction context
    tx_context: TxContext,
    /// Allocator
    allocator: std.mem.Allocator,
    /// Metrics
    metrics: Metrics,

    pub const TxContext = struct {
        sender: ?Address = null,
        recipient: ?Address = null,
        precompiles: []const Address = &.{},
        access_list_addresses: []const Address = &.{},
        access_list_slots: []const AccessList.StorageKey = &.{},
    };

    pub const Metrics = struct {
        storage_reads: u64 = 0,
        storage_writes: u64 = 0,
        account_reads: u64 = 0,
        account_writes: u64 = 0,
        cache_hits: u64 = 0,
        cache_misses: u64 = 0,
        fork_requests: u64 = 0,
    };

    /// Initialize state manager
    pub fn init(
        allocator: std.mem.Allocator,
        state_db: *StateDB,
        journal: *Journal,
        fork_state: ?*ForkState,
    ) !StateManager {
        var mgr = StateManager{
            .state_db = state_db,
            .access_list = AccessList.init(allocator),
            .journal = journal,
            .fork_state = fork_state,
            .tx_context = .{},
            .allocator = allocator,
            .metrics = .{},
        };

        // Pre-warm precompile addresses
        const precompiles = [_]Address{
            Address.fromInt(0x01), // ecrecover
            Address.fromInt(0x02), // sha256
            Address.fromInt(0x03), // ripemd160
            Address.fromInt(0x04), // identity
            Address.fromInt(0x05), // modexp
            Address.fromInt(0x06), // ecadd
            Address.fromInt(0x07), // ecmul
            Address.fromInt(0x08), // ecpairing
            Address.fromInt(0x09), // blake2f
        };
        
        for (precompiles) |addr| {
            _ = try mgr.access_list.addAddress(addr);
        }

        return mgr;
    }

    /// Clean up
    pub fn deinit(self: *StateManager) void {
        self.access_list.deinit();
    }

    /// Begin new transaction
    pub fn beginTx(self: *StateManager, context: TxContext) !void {
        self.tx_context = context;
        self.access_list.clear();

        // Pre-warm transaction addresses
        if (context.sender) |sender| {
            _ = try self.access_list.addAddress(sender);
        }
        if (context.recipient) |recipient| {
            _ = try self.access_list.addAddress(recipient);
        }

        // Pre-warm precompiles
        for (context.precompiles) |addr| {
            _ = try self.access_list.addAddress(addr);
        }

        // Pre-warm access list
        try self.access_list.preWarm(
            context.access_list_addresses,
            context.access_list_slots,
        );
    }

    // Account operations

    /// Get account (with access tracking)
    pub fn getAccount(self: *StateManager, address: Address) !*Account {
        self.metrics.account_reads += 1;

        const was_cold = try self.access_list.addAddress(address);
        if (was_cold) {
            try self.journal.accessAccount(address);
        }

        // Check local state first
        if (try self.state_db.getAccount(address)) |account| {
            self.metrics.cache_hits += 1;
            return account;
        }

        // Check fork if available
        if (self.fork_state) |fork| {
            self.metrics.cache_misses += 1;
            self.metrics.fork_requests += 1;
            const fork_account = try fork.getAccount(address);
            try self.state_db.createAccount(address);
            const account = try self.state_db.getAccount(address);
            account.?.* = fork_account;
            return account.?;
        }

        // Create new account
        try self.state_db.createAccount(address);
        return (try self.state_db.getAccount(address)).?;
    }

    /// Get balance
    pub fn getBalance(self: *StateManager, address: Address) !u256 {
        const account = try self.getAccount(address);
        return account.balance;
    }

    /// Set balance
    pub fn setBalance(self: *StateManager, address: Address, balance: u256) !void {
        self.metrics.account_writes += 1;
        const account = try self.getAccount(address);
        try self.state_db.setBalance(address, balance);
    }

    // Storage operations

    /// Get storage value
    pub fn getStorage(self: *StateManager, address: Address, slot: B256) !B256 {
        self.metrics.storage_reads += 1;

        // Track access
        _ = try self.access_list.addAddress(address);
        const was_cold = try self.access_list.addSlot(address, slot);
        if (was_cold) {
            try self.journal.accessStorage(address, slot);
        }

        // Check local state
        const value = self.state_db.getStorage(address, slot);
        if (!value.isZero()) {
            self.metrics.cache_hits += 1;
            return value;
        }

        // Check fork if available
        if (self.fork_state) |fork| {
            self.metrics.cache_misses += 1;
            self.metrics.fork_requests += 1;
            return try fork.getStorage(address, slot);
        }

        return B256.zero();
    }

    /// Set storage value
    pub fn setStorage(self: *StateManager, address: Address, slot: B256, value: B256) !void {
        self.metrics.storage_writes += 1;
        
        // Track access
        _ = try self.access_list.addAddress(address);
        _ = try self.access_list.addSlot(address, slot);

        try self.state_db.setStorage(address, slot, value);
    }

    /// Get original storage (for SSTORE gas calculation)
    pub fn getOriginalStorage(self: *StateManager, address: Address, slot: B256) !B256 {
        // Original storage is the value at the start of the transaction
        const committed = self.state_db.getCommittedStorage(address, slot);
        if (!committed.isZero()) {
            return committed;
        }

        // Check fork for original value
        if (self.fork_state) |fork| {
            return try fork.getStorage(address, slot);
        }

        return B256.zero();
    }

    // Code operations

    /// Get code
    pub fn getCode(self: *StateManager, address: Address) ![]const u8 {
        _ = try self.access_list.addAddress(address);
        
        const code = self.state_db.getCode(address);
        if (code.len > 0) {
            return code;
        }

        // Check fork
        if (self.fork_state) |fork| {
            if (fork.cache.code.get(address)) |cached| {
                return cached;
            }
            
            // Fetch code from fork
            const fork_code = try fork.fetchCodeRPC(address);
            try fork.cache.code.put(address, fork_code);
            
            // Set in local state
            try self.state_db.setCode(address, fork_code);
            return fork_code;
        }

        return &[_]u8{};
    }

    /// Get metrics
    pub fn getMetrics(self: *const StateManager) Metrics {
        return self.metrics;
    }

    /// Reset metrics
    pub fn resetMetrics(self: *StateManager) void {
        self.metrics = .{};
    }
};
```

## Code Reference from Existing Implementation

From the existing StateManager.zig:

```zig
// Access list tracking for EIP-2929
pub const AccessList = struct {
    /// Addresses that have been accessed (warm)
    warm_addresses: std.AutoHashMap(Address, void),
    
    /// Storage slots that have been accessed (warm)
    warm_storage: std.AutoHashMap(struct { Address, B256 }, void),
    
    /// Check if an address is warm
    pub fn isWarm(self: *const AccessList, address: Address) bool {
        return self.warm_addresses.contains(address);
    }
    
    /// Mark an address as warm
    /// Returns true if the address was cold before
    pub fn addAddress(self: *AccessList, address: Address) !bool {
        if (self.isWarm(address)) {
            return false;
        }
        
        try self.warm_addresses.put(address, {});
        return true;
    }
```

## Reference Implementations

### Go-Ethereum (core/state/interface.go)

```go
// StateDB is an EVM database for full state querying.
type StateDB interface {
    CreateAccount(common.Address)
    
    SubBalance(common.Address, *uint256.Int, tracing.BalanceChangeReason)
    AddBalance(common.Address, *uint256.Int, tracing.BalanceChangeReason)
    GetBalance(common.Address) *uint256.Int
    
    GetNonce(common.Address) uint64
    SetNonce(common.Address, uint64)
    
    GetCodeHash(common.Address) common.Hash
    GetCode(common.Address) []byte
    SetCode(common.Address, []byte)
    GetCodeSize(common.Address) int
    
    AddRefund(uint64)
    SubRefund(uint64)
    GetRefund() uint64
    
    GetCommittedState(common.Address, common.Hash) common.Hash
    GetState(common.Address, common.Hash) common.Hash
    SetState(common.Address, common.Hash, common.Hash)
    
    SelfDestruct(common.Address)
    HasSelfDestructed(common.Address) bool
    
    // Exist reports whether the given account exists in state.
    // Notably this should also return true for self-destructed accounts.
    Exist(common.Address) bool
    // Empty returns whether the given account is empty. Empty
    // is defined according to EIP161 (balance = nonce = code = 0).
    Empty(common.Address) bool
    
    AddressInAccessList(addr common.Address) bool
    SlotInAccessList(addr common.Address, slot common.Hash) (addressOk bool, slotOk bool)
    AddAddressToAccessList(addr common.Address)
    AddSlotToAccessList(addr common.Address, slot common.Hash)
    
    Prepare(rules params.Rules, sender, coinbase common.Address, dest *common.Address, precompiles []common.Address, txAccesses types.AccessList)
    
    RevertToSnapshot(int)
    Snapshot() int
    
    AddLog(*types.Log)
    AddPreimage(common.Hash, []byte)
}
```

### revm (crates/revm/src/db/states/state.rs)

```rust
/// EVM State is a mapping from addresses to accounts.
pub struct State<DB> {
    /// Cached state contains both changed and unchanged accounts.
    pub cache: CacheState,
    /// Database to fetch unchanged accounts.
    pub database: DB,
    /// Block state, it aggregates transactions transitions into one state.
    pub block: BundleState,
}

impl<DB: Database> State<DB> {
    /// Returns the account associated with the given address.
    ///
    /// # Note
    ///
    /// - If the account has not been loaded, it will be loaded from the database.
    /// - If the account has been loaded, it will be returned from the cache.
    /// - An empty account will be created if no account is found.
    pub fn load_account(&mut self, address: Address) -> Result<&mut Account, DB::Error> {
        match self.cache.accounts.entry(address) {
            Entry::Occupied(entry) => Ok(entry.into_mut()),
            Entry::Vacant(entry) => {
                let account = self.load_account_from_db(address)?;
                Ok(entry.insert(account))
            }
        }
    }

    /// Load the account from the database
    fn load_account_from_db(&mut self, address: Address) -> Result<Account, DB::Error> {
        let info = self.database.basic(address)?;
        let account = match info {
            None => Account::new_empty(),
            Some(info) => Account::from(info),
        };
        Ok(account)
    }
}
```

## Usage Example

```zig
// Initialize state manager with fork
var fork_state = try ForkState.init(
    allocator,
    "https://eth-mainnet.alchemyapi.io/v2/...",
    17000000, // Fork block
);
defer fork_state.deinit();

var state_manager = try StateManager.init(
    allocator,
    &state_db,
    &journal,
    &fork_state,
);
defer state_manager.deinit();

// Begin transaction with access list
try state_manager.beginTx(.{
    .sender = sender_address,
    .recipient = contract_address,
    .access_list_addresses = &[_]Address{token_address},
    .access_list_slots = &[_]AccessList.StorageKey{
        .{ .address = token_address, .slot = balance_slot },
    },
});

// Access account (automatically tracked)
const balance = try state_manager.getBalance(sender_address);

// Access storage (warm due to access list)
const token_balance = try state_manager.getStorage(token_address, balance_slot);

// Get metrics
const metrics = state_manager.getMetrics();
std.log.info("Cache hit rate: {d:.2}%", .{
    @as(f64, metrics.cache_hits) / @as(f64, metrics.cache_hits + metrics.cache_misses) * 100
});
```

## Testing Requirements

1. **Access List Tracking**:
   - Test warm/cold address tracking
   - Test warm/cold storage tracking
   - Test pre-warming from tx access list
   - Test gas cost differences

2. **Fork Handling**:
   - Test account fetching from fork
   - Test storage fetching from fork
   - Test code fetching from fork
   - Test cache behavior

3. **State Operations**:
   - Test account CRUD operations
   - Test storage operations
   - Test code operations
   - Test original storage tracking

4. **Transaction Context**:
   - Test transaction setup
   - Test access list pre-warming
   - Test sender/recipient warming

5. **Performance**:
   - Test caching effectiveness
   - Test metrics collection
   - Test fork request minimization

## References

- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - Gas cost increases for state access
- [Go-Ethereum state](https://github.com/ethereum/go-ethereum/tree/master/core/state)
- [revm state](https://github.com/bluealloy/revm/tree/main/crates/revm/src/db/states)