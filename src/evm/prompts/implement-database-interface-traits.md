# Implement Database Interface/Traits for Pluggable State Management

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_database_interface_traits` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_database_interface_traits feat_implement_database_interface_traits`
3. **Work in isolation**: `cd g/feat_implement_database_interface_traits`
4. **Commit message**: `✨ feat: implement pluggable database interface with vtable traits`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement a pluggable database abstraction for state management using Zig's vtable pattern. This will allow different backend implementations (in-memory, file-based, network-based) to be swapped without changing EVM core logic.

## Database Interface Requirements

### Core Database Operations
1. **Account Management**: Get/set account data (balance, nonce, code)
2. **Storage Operations**: Get/set contract storage slots
3. **Code Management**: Store and retrieve contract bytecode
4. **State Root**: Calculate and verify state root hashes
5. **Snapshots**: Create and restore state snapshots
6. **Batch Operations**: Efficient bulk updates

### Backend Types
- **Memory Database**: Fast in-memory implementation for testing
- **File Database**: Persistent file-based storage
- **Fork Database**: Proxy to remote Ethereum node for forking
- **Cached Database**: Layered caching over other backends
- **Network Database**: Remote database access over network

## Implementation Requirements

### Core Interface Design
```zig
pub const DatabaseError = error{
    AccountNotFound,
    StorageNotFound,
    CodeNotFound,
    InvalidAddress,
    DatabaseCorrupted,
    NetworkError,
    PermissionDenied,
    OutOfMemory,
};

pub const Account = struct {
    balance: U256,
    nonce: u64,
    code_hash: B256,
    storage_root: B256,
};

pub const DatabaseInterface = struct {
    ptr: *anyopaque,
    vtable: *const VTable,

    pub const VTable = struct {
        // Account operations
        get_account: *const fn (ptr: *anyopaque, address: Address) DatabaseError!?Account,
        set_account: *const fn (ptr: *anyopaque, address: Address, account: Account) DatabaseError!void,
        delete_account: *const fn (ptr: *anyopaque, address: Address) DatabaseError!void,
        account_exists: *const fn (ptr: *anyopaque, address: Address) bool,

        // Storage operations
        get_storage: *const fn (ptr: *anyopaque, address: Address, key: B256) DatabaseError!B256,
        set_storage: *const fn (ptr: *anyopaque, address: Address, key: B256, value: B256) DatabaseError!void,

        // Code operations
        get_code: *const fn (ptr: *anyopaque, code_hash: B256) DatabaseError![]const u8,
        set_code: *const fn (ptr: *anyopaque, code: []const u8) DatabaseError!B256,

        // State root operations
        get_state_root: *const fn (ptr: *anyopaque) DatabaseError!B256,
        commit_changes: *const fn (ptr: *anyopaque) DatabaseError!B256,

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

    pub fn getAccount(self: DatabaseInterface, address: Address) DatabaseError!?Account {
        return self.vtable.get_account(self.ptr, address);
    }

    pub fn setAccount(self: DatabaseInterface, address: Address, account: Account) DatabaseError!void {
        return self.vtable.set_account(self.ptr, address, account);
    }

    // ... wrapper methods for all vtable functions
};
```

## Implementation Tasks

### Task 1: Define Database Interface
File: `/src/evm/state/database_interface.zig`
```zig
const std = @import("std");
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const B256 = @import("../Types/B256.ts").B256;

// Include complete interface definition from above
pub const DatabaseInterface = struct {
    // ... full implementation
    
    pub fn init(implementation: anytype) DatabaseInterface {
        const Impl = @TypeOf(implementation);
        const gen = struct {
            fn getAccount(ptr: *anyopaque, address: Address) DatabaseError!?Account {
                const self: *Impl = @ptrCast(@alignCast(ptr));
                return self.getAccount(address);
            }
            
            fn setAccount(ptr: *anyopaque, address: Address, account: Account) DatabaseError!void {
                const self: *Impl = @ptrCast(@alignCast(ptr));
                return self.setAccount(address, account);
            }
            
            // ... implement all vtable functions
            
            const vtable = VTable{
                .get_account = getAccount,
                .set_account = setAccount,
                // ... all other function pointers
            };
        };
        
        return DatabaseInterface{
            .ptr = implementation,
            .vtable = &gen.vtable,
        };
    }
};
```

### Task 2: Implement Memory Database
File: `/src/evm/state/memory_database.zig`
```zig
const std = @import("std");
const DatabaseInterface = @import("database_interface.zig").DatabaseInterface;
const DatabaseError = @import("database_interface.zig").DatabaseError;
const Account = @import("database_interface.zig").Account;

pub const MemoryDatabase = struct {
    accounts: std.HashMap(Address, Account, AddressContext, 80),
    storage: std.HashMap(StorageKey, B256, StorageKeyContext, 80),
    code_storage: std.HashMap(B256, []u8, B256Context, 80),
    snapshots: std.ArrayList(Snapshot),
    allocator: std.mem.Allocator,
    
    const StorageKey = struct {
        address: Address,
        key: B256,
    };
    
    const Snapshot = struct {
        accounts: std.HashMap(Address, Account, AddressContext, 80),
        storage: std.HashMap(StorageKey, B256, StorageKeyContext, 80),
        id: u64,
    };
    
    pub fn init(allocator: std.mem.Allocator) MemoryDatabase {
        return MemoryDatabase{
            .accounts = std.HashMap(Address, Account, AddressContext, 80).init(allocator),
            .storage = std.HashMap(StorageKey, B256, StorageKeyContext, 80).init(allocator),
            .code_storage = std.HashMap(B256, []u8, B256Context, 80).init(allocator),
            .snapshots = std.ArrayList(Snapshot).init(allocator),
            .allocator = allocator,
        };
    }
    
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
            snapshot.accounts.deinit();
            snapshot.storage.deinit();
        }
        self.snapshots.deinit();
    }
    
    pub fn getAccount(self: *MemoryDatabase, address: Address) DatabaseError!?Account {
        return self.accounts.get(address);
    }
    
    pub fn setAccount(self: *MemoryDatabase, address: Address, account: Account) DatabaseError!void {
        try self.accounts.put(address, account);
    }
    
    pub fn deleteAccount(self: *MemoryDatabase, address: Address) DatabaseError!void {
        _ = self.accounts.remove(address);
        
        // Remove all storage for this account
        var storage_iter = self.storage.iterator();
        var keys_to_remove = std.ArrayList(StorageKey).init(self.allocator);
        defer keys_to_remove.deinit();
        
        while (storage_iter.next()) |entry| {
            if (std.mem.eql(u8, &entry.key_ptr.address.bytes, &address.bytes)) {
                try keys_to_remove.append(entry.key_ptr.*);
            }
        }
        
        for (keys_to_remove.items) |key| {
            _ = self.storage.remove(key);
        }
    }
    
    pub fn accountExists(self: *MemoryDatabase, address: Address) bool {
        return self.accounts.contains(address);
    }
    
    // Implement all other required methods...
    
    pub fn toDatabaseInterface(self: *MemoryDatabase) DatabaseInterface {
        return DatabaseInterface.init(self);
    }
};
```

### Task 3: Implement Fork Database
File: `/src/evm/state/fork_database.zig`
```zig
const std = @import("std");
const DatabaseInterface = @import("database_interface.zig").DatabaseInterface;

pub const ForkDatabase = struct {
    local_db: MemoryDatabase,
    remote_url: []const u8,
    http_client: std.http.Client,
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator, remote_url: []const u8) !ForkDatabase {
        return ForkDatabase{
            .local_db = MemoryDatabase.init(allocator),
            .remote_url = try allocator.dupe(u8, remote_url),
            .http_client = std.http.Client{ .allocator = allocator },
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *ForkDatabase) void {
        self.local_db.deinit();
        self.allocator.free(self.remote_url);
        self.http_client.deinit();
    }
    
    pub fn getAccount(self: *ForkDatabase, address: Address) DatabaseError!?Account {
        // Check local cache first
        if (try self.local_db.getAccount(address)) |account| {
            return account;
        }
        
        // Fetch from remote if not cached
        const remote_account = try self.fetchRemoteAccount(address);
        if (remote_account) |account| {
            // Cache locally
            try self.local_db.setAccount(address, account);
            return account;
        }
        
        return null;
    }
    
    fn fetchRemoteAccount(self: *ForkDatabase, address: Address) DatabaseError!?Account {
        // Implement JSON-RPC calls to fetch account data
        // eth_getBalance, eth_getTransactionCount, eth_getCode, etc.
        // This would make HTTP requests to the remote node
        
        // Placeholder implementation
        return null;
    }
    
    // Implement all other required methods with local caching + remote fallback
    
    pub fn toDatabaseInterface(self: *ForkDatabase) DatabaseInterface {
        return DatabaseInterface.init(self);
    }
};
```

### Task 4: Implement Cached Database
File: `/src/evm/state/cached_database.zig`
```zig
pub const CachedDatabase = struct {
    cache: MemoryDatabase,
    backend: DatabaseInterface,
    cache_size_limit: usize,
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator, backend: DatabaseInterface, cache_size: usize) CachedDatabase {
        return CachedDatabase{
            .cache = MemoryDatabase.init(allocator),
            .backend = backend,
            .cache_size_limit = cache_size,
            .allocator = allocator,
        };
    }
    
    pub fn getAccount(self: *CachedDatabase, address: Address) DatabaseError!?Account {
        // Check cache first
        if (try self.cache.getAccount(address)) |account| {
            return account;
        }
        
        // Fetch from backend
        const account = try self.backend.getAccount(address);
        if (account) |acc| {
            // Cache the result (with potential eviction)
            try self.cacheAccount(address, acc);
        }
        
        return account;
    }
    
    fn cacheAccount(self: *CachedDatabase, address: Address, account: Account) !void {
        // Implement LRU or similar caching strategy
        // Evict old entries if cache is full
        if (self.cache.accounts.count() >= self.cache_size_limit) {
            try self.evictOldestEntry();
        }
        try self.cache.setAccount(address, account);
    }
    
    // Implement all other methods with caching layer
    
    pub fn toDatabaseInterface(self: *CachedDatabase) DatabaseInterface {
        return DatabaseInterface.init(self);
    }
};
```

### Task 5: Update State to Use Database Interface
File: `/src/evm/state/state.zig` (modify existing)
```zig
pub const State = struct {
    database: DatabaseInterface,
    // ... other existing fields
    
    pub fn init(database: DatabaseInterface) State {
        return State{
            .database = database,
            // ... other field initialization
        };
    }
    
    pub fn get_account(self: *State, address: Address) !?Account {
        return try self.database.getAccount(address);
    }
    
    pub fn set_account(self: *State, address: Address, account: Account) !void {
        try self.database.setAccount(address, account);
    }
    
    pub fn get_storage(self: *State, address: Address, key: B256) !B256 {
        return try self.database.getStorage(address, key);
    }
    
    pub fn set_storage(self: *State, address: Address, key: B256, value: B256) !void {
        try self.database.setStorage(address, key, value);
    }
    
    // Update all state operations to use database interface
};
```

### Task 6: Database Factory
File: `/src/evm/state/database_factory.zig`
```zig
pub const DatabaseType = enum {
    Memory,
    Fork,
    Cached,
    File,
};

pub const DatabaseConfig = union(DatabaseType) {
    Memory: void,
    Fork: struct {
        remote_url: []const u8,
    },
    Cached: struct {
        backend_config: *DatabaseConfig,
        cache_size: usize,
    },
    File: struct {
        file_path: []const u8,
    },
};

pub fn createDatabase(allocator: std.mem.Allocator, config: DatabaseConfig) !DatabaseInterface {
    switch (config) {
        .Memory => {
            const db = try allocator.create(MemoryDatabase);
            db.* = MemoryDatabase.init(allocator);
            return db.toDatabaseInterface();
        },
        .Fork => |fork_config| {
            const db = try allocator.create(ForkDatabase);
            db.* = try ForkDatabase.init(allocator, fork_config.remote_url);
            return db.toDatabaseInterface();
        },
        .Cached => |cached_config| {
            const backend_db = try createDatabase(allocator, cached_config.backend_config.*);
            const db = try allocator.create(CachedDatabase);
            db.* = CachedDatabase.init(allocator, backend_db, cached_config.cache_size);
            return db.toDatabaseInterface();
        },
        // ... handle other types
    }
}
```

### Task 7: Comprehensive Testing
File: `/test/evm/state/database_interface_test.zig`

### Test Cases
1. **Interface Compliance**: Test all database implementations against common interface
2. **Memory Database**: Full functionality testing
3. **Fork Database**: Remote data fetching and local caching
4. **Cached Database**: Cache hit/miss scenarios and eviction
5. **Snapshot Operations**: Create, revert, commit snapshots
6. **Batch Operations**: Efficient bulk updates
7. **Error Handling**: Network errors, corruption, etc.
8. **Performance**: Benchmark different implementations

## Integration Points

### Files to Create/Modify
- `/src/evm/state/database_interface.zig` - New interface definition
- `/src/evm/state/memory_database.zig` - New memory implementation
- `/src/evm/state/fork_database.zig` - New fork implementation
- `/src/evm/state/cached_database.zig` - New cached implementation
- `/src/evm/state/database_factory.zig` - New factory for database creation
- `/src/evm/state/state.zig` - Update to use database interface
- `/src/evm/vm.zig` - Update to accept database interface
- `/test/evm/state/database_interface_test.zig` - Comprehensive tests

### VM Integration
```zig
// Update VM to use database interface
pub fn createVM(allocator: std.mem.Allocator, database: DatabaseInterface) !VM {
    const state = State.init(database);
    return VM.init(allocator, state);
}
```

## Performance Considerations

### Interface Overhead
- **Vtable Dispatch**: Minimal overhead compared to direct calls
- **Memory Layout**: Pack interface data for cache efficiency
- **Batch Operations**: Reduce interface call frequency
- **Inline Optimization**: Hot path inlining where possible

### Database Optimization Strategies
```zig
pub const OptimizedDatabase = struct {
    // Batch pending operations to reduce interface calls
    pending_accounts: std.ArrayList(PendingAccount),
    pending_storage: std.ArrayList(PendingStorage),
    backend: DatabaseInterface,
    
    pub fn flushPending(self: *OptimizedDatabase) !void {
        try self.backend.beginBatch();
        
        for (self.pending_accounts.items) |account_update| {
            try self.backend.setAccount(account_update.address, account_update.account);
        }
        
        for (self.pending_storage.items) |storage_update| {
            try self.backend.setStorage(storage_update.address, storage_update.key, storage_update.value);
        }
        
        try self.backend.commitBatch();
        
        self.pending_accounts.clearRetainingCapacity();
        self.pending_storage.clearRetainingCapacity();
    }
};
```

## Complex Scenarios

### Multi-Layer Caching
```zig
// Example: Memory cache -> File cache -> Fork backend
const config = DatabaseConfig{
    .Cached = .{
        .backend_config = &DatabaseConfig{
            .Cached = .{
                .backend_config = &DatabaseConfig{
                    .Fork = .{ .remote_url = "https://mainnet.example.com" },
                },
                .cache_size = 10000, // File cache
            },
        },
        .cache_size = 1000, // Memory cache
    },
};
```

### Database Migration
- **Schema Evolution**: Handle database format changes
- **Data Migration**: Move between database implementations
- **Backup/Restore**: Snapshot entire database state
- **Consistency Checks**: Validate database integrity

## Success Criteria

1. **Interface Compliance**: All implementations satisfy the same interface
2. **Performance**: Minimal overhead from abstraction layer
3. **Flexibility**: Easy to add new database implementations
4. **Testing**: Comprehensive test suite for all implementations
5. **Documentation**: Clear examples of usage patterns
6. **Memory Safety**: No leaks or undefined behavior

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test all implementations thoroughly** - Interface compliance is critical
3. **Verify memory management** - Prevent leaks in vtable dispatch
4. **Performance testing** - Ensure minimal abstraction overhead
5. **Error handling consistency** - All implementations handle errors uniformly
6. **Thread safety consideration** - Document thread safety guarantees

## References

- [Zig Interface Patterns](https://ziglang.org/documentation/master/#Interfaces)
- [Database Design Patterns](https://en.wikipedia.org/wiki/Database_design)
- [Ethereum State Trie](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/)
- [RocksDB Documentation](https://rocksdb.org/) - For file-based implementation reference