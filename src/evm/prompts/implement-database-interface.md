# Implement Database Interface/Traits

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_database_interface` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_database_interface feat_implement_database_interface`
3. **Work in isolation**: `cd g/feat_implement_database_interface`
4. **Commit message**: `( feat: implement pluggable database abstraction for state management`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement a pluggable database abstraction layer that allows the EVM to work with different storage backends. This enables support for various database implementations (in-memory, persistent, remote, cached) without changing the core EVM logic.

## Architecture Goals

### Pluggable Backends
Enable different database implementations:
1. **InMemoryDatabase** - HashMap-based storage for testing and development
2. **PersistentDatabase** - Disk-based storage (RocksDB, LMDB, etc.)
3. **ForkedDatabase** - Remote state provider for mainnet forking
4. **CachedDatabase** - Layered caching on top of other backends
5. **NetworkDatabase** - Remote database access via RPC/API
6. **TestDatabase** - Optimized for testing with snapshots and reset

### Design Principles
1. **Zero Runtime Cost**: Interface dispatch should be compile-time optimized
2. **Type Safety**: Prevent incorrect database usage at compile time
3. **Async Support**: Interface should support async database operations
4. **Memory Management**: Clear ownership and lifetime semantics
5. **Error Handling**: Comprehensive error types for all failure modes

## Database Interface Definition

### Core Database Operations
```zig
pub const DatabaseInterface = struct {
    ptr: *anyopaque,
    vtable: *const VTable,
    
    pub const VTable = struct {
        // Account operations
        get_account: *const fn (ptr: *anyopaque, address: Address) DatabaseError!?Account,
        put_account: *const fn (ptr: *anyopaque, address: Address, account: Account) DatabaseError!void,
        delete_account: *const fn (ptr: *anyopaque, address: Address) DatabaseError!void,
        account_exists: *const fn (ptr: *anyopaque, address: Address) DatabaseError!bool,
        
        // Storage operations
        get_storage: *const fn (ptr: *anyopaque, address: Address, key: U256) DatabaseError!U256,
        put_storage: *const fn (ptr: *anyopaque, address: Address, key: U256, value: U256) DatabaseError!void,
        delete_storage: *const fn (ptr: *anyopaque, address: Address, key: U256) DatabaseError!void,
        
        // Code operations
        get_code: *const fn (ptr: *anyopaque, address: Address) DatabaseError![]const u8,
        put_code: *const fn (ptr: *anyopaque, address: Address, code: []const u8) DatabaseError!void,
        get_code_hash: *const fn (ptr: *anyopaque, address: Address) DatabaseError!Hash,
        
        // Batch operations
        begin_batch: *const fn (ptr: *anyopaque) DatabaseError!BatchHandle,
        commit_batch: *const fn (ptr: *anyopaque, handle: BatchHandle) DatabaseError!void,
        rollback_batch: *const fn (ptr: *anyopaque, handle: BatchHandle) DatabaseError!void,
        
        // Snapshot operations
        create_snapshot: *const fn (ptr: *anyopaque) DatabaseError!SnapshotId,
        restore_snapshot: *const fn (ptr: *anyopaque, snapshot: SnapshotId) DatabaseError!void,
        delete_snapshot: *const fn (ptr: *anyopaque, snapshot: SnapshotId) DatabaseError!void,
        
        // Lifecycle
        flush: *const fn (ptr: *anyopaque) DatabaseError!void,
        close: *const fn (ptr: *anyopaque) DatabaseError!void,
        deinit: *const fn (ptr: *anyopaque) void,
    };
    
    // Wrapper methods for type-safe access
    pub fn get_account(self: DatabaseInterface, address: Address) DatabaseError!?Account {
        return self.vtable.get_account(self.ptr, address);
    }
    
    pub fn put_account(self: DatabaseInterface, address: Address, account: Account) DatabaseError!void {
        return self.vtable.put_account(self.ptr, address, account);
    }
    
    // ... wrapper methods for all vtable functions
};
```

### Error Handling
```zig
pub const DatabaseError = error{
    // Connection errors
    ConnectionFailed,
    ConnectionLost,
    Timeout,
    
    // Data errors
    KeyNotFound,
    DataCorrupted,
    SerializationFailed,
    DeserializationFailed,
    
    // Transaction errors
    TransactionFailed,
    TransactionConflict,
    BatchTooLarge,
    
    // Resource errors
    OutOfMemory,
    OutOfDiskSpace,
    PermissionDenied,
    
    // Database errors
    DatabaseLocked,
    DatabaseCorrupted,
    IncompatibleVersion,
    
    // Generic errors
    Unknown,
    Unsupported,
};
```

### Data Types
```zig
pub const Account = struct {
    nonce: u64,
    balance: U256,
    code_hash: Hash,
    storage_root: Hash,
    
    pub fn encode(self: Account, allocator: std.mem.Allocator) ![]u8 {
        // RLP encoding implementation
    }
    
    pub fn decode(data: []const u8, allocator: std.mem.Allocator) !Account {
        // RLP decoding implementation
    }
};

pub const StorageEntry = struct {
    key: U256,
    value: U256,
};

pub const BatchHandle = u64;
pub const SnapshotId = u64;
pub const Hash = [32]u8;
```

## Implementation Tasks

### Task 1: Define Database Interface
File: `/src/evm/state/database_interface.zig`
- Define DatabaseInterface struct with vtable
- Implement wrapper methods for type safety
- Define error types and data structures
- Add comprehensive documentation

### Task 2: Create In-Memory Database Implementation
File: `/src/evm/state/in_memory_database.zig`
```zig
pub const InMemoryDatabase = struct {
    accounts: std.HashMap(Address, Account, AddressContext, std.hash_map.default_max_load_percentage),
    storage: std.HashMap(StorageKey, U256, StorageKeyContext, std.hash_map.default_max_load_percentage),
    code: std.HashMap(Address, []u8, AddressContext, std.hash_map.default_max_load_percentage),
    snapshots: std.ArrayList(DatabaseSnapshot),
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) InMemoryDatabase {
        return InMemoryDatabase{
            .accounts = std.HashMap(Address, Account, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
            .storage = std.HashMap(StorageKey, U256, StorageKeyContext, std.hash_map.default_max_load_percentage).init(allocator),
            .code = std.HashMap(Address, []u8, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
            .snapshots = std.ArrayList(DatabaseSnapshot).init(allocator),
            .allocator = allocator,
        };
    }
    
    pub fn interface(self: *InMemoryDatabase) DatabaseInterface {
        return DatabaseInterface{
            .ptr = self,
            .vtable = &vtable,
        };
    }
    
    const vtable = DatabaseInterface.VTable{
        .get_account = get_account_impl,
        .put_account = put_account_impl,
        .delete_account = delete_account_impl,
        .account_exists = account_exists_impl,
        .get_storage = get_storage_impl,
        .put_storage = put_storage_impl,
        .delete_storage = delete_storage_impl,
        .get_code = get_code_impl,
        .put_code = put_code_impl,
        .get_code_hash = get_code_hash_impl,
        .begin_batch = begin_batch_impl,
        .commit_batch = commit_batch_impl,
        .rollback_batch = rollback_batch_impl,
        .create_snapshot = create_snapshot_impl,
        .restore_snapshot = restore_snapshot_impl,
        .delete_snapshot = delete_snapshot_impl,
        .flush = flush_impl,
        .close = close_impl,
        .deinit = deinit_impl,
    };
    
    fn get_account_impl(ptr: *anyopaque, address: Address) DatabaseError!?Account {
        const self = @as(*InMemoryDatabase, @ptrCast(@alignCast(ptr)));
        return self.accounts.get(address);
    }
    
    fn put_account_impl(ptr: *anyopaque, address: Address, account: Account) DatabaseError!void {
        const self = @as(*InMemoryDatabase, @ptrCast(@alignCast(ptr)));
        try self.accounts.put(address, account);
    }
    
    // ... implement all vtable functions
};
```

### Task 3: Database Factory
File: `/src/evm/state/database_factory.zig`
```zig
pub const DatabaseType = enum {
    in_memory,
    persistent,
    forked,
    cached,
    network,
    test,
};

pub const DatabaseConfig = union(DatabaseType) {
    in_memory: void,
    persistent: struct {
        path: []const u8,
        cache_size: usize,
    },
    forked: struct {
        rpc_url: []const u8,
        block_number: ?u64,
    },
    cached: struct {
        backend: DatabaseInterface,
        cache_size: usize,
    },
    network: struct {
        endpoint: []const u8,
        timeout: u64,
    },
    test: struct {
        initial_accounts: []const struct { Address, Account },
    },
};

pub fn createDatabase(allocator: std.mem.Allocator, config: DatabaseConfig) !DatabaseInterface {
    switch (config) {
        .in_memory => {
            const db = try allocator.create(InMemoryDatabase);
            db.* = InMemoryDatabase.init(allocator);
            return db.interface();
        },
        .persistent => |cfg| {
            const db = try allocator.create(PersistentDatabase);
            db.* = try PersistentDatabase.init(allocator, cfg.path, cfg.cache_size);
            return db.interface();
        },
        // ... handle other database types
    }
}
```

### Task 4: Update State to Use Database Interface
File: `/src/evm/state/state.zig` (modify existing)
```zig
pub const State = struct {
    database: DatabaseInterface,
    journal: StateJournal,
    
    pub fn init(database: DatabaseInterface, allocator: std.mem.Allocator) State {
        return State{
            .database = database,
            .journal = StateJournal.init(allocator),
        };
    }
    
    pub fn get_account(self: *State, address: Address) !?Account {
        return try self.database.get_account(address);
    }
    
    pub fn set_account(self: *State, address: Address, account: Account) !void {
        // Record in journal for reverting
        const old_account = try self.database.get_account(address);
        try self.journal.record_account_change(address, old_account, account);
        
        // Update database
        try self.database.put_account(address, account);
    }
    
    pub fn get_storage(self: *State, address: Address, key: U256) !U256 {
        return try self.database.get_storage(address, key);
    }
    
    pub fn set_storage(self: *State, address: Address, key: U256, value: U256) !void {
        // Record in journal for reverting
        const old_value = try self.database.get_storage(address, key);
        try self.journal.record_storage_change(address, key, old_value, value);
        
        // Update database
        try self.database.put_storage(address, key, value);
    }
    
    // ... update all state methods to use database interface
};
```

### Task 5: Implement Persistent Database (Optional)
File: `/src/evm/state/persistent_database.zig`
- RocksDB or LMDB integration
- Efficient key-value storage
- Transaction support
- Crash recovery

### Task 6: Implement Forked Database (Optional)
File: `/src/evm/state/forked_database.zig`
- Remote state provider integration
- Local caching of fetched data
- Batch fetching optimization
- Error handling for network issues

### Task 7: Update VM Integration
File: `/src/evm/vm.zig` (modify)
```zig
pub const Vm = struct {
    state: State,
    // ... other fields
    
    pub fn init(allocator: std.mem.Allocator, database: DatabaseInterface, hardfork: Hardfork) !Vm {
        return Vm{
            .state = State.init(database, allocator),
            // ... other initialization
        };
    }
    
    pub fn create_snapshot(self: *Vm) !SnapshotId {
        return try self.state.database.create_snapshot();
    }
    
    pub fn restore_snapshot(self: *Vm, snapshot: SnapshotId) !void {
        try self.state.database.restore_snapshot(snapshot);
    }
};
```

### Task 8: Async Database Support (Future)
File: `/src/evm/state/async_database_interface.zig`
```zig
pub const AsyncDatabaseInterface = struct {
    // Similar to DatabaseInterface but with async methods
    pub const VTable = struct {
        get_account_async: *const fn (ptr: *anyopaque, address: Address) AsyncResult(?Account),
        put_account_async: *const fn (ptr: *anyopaque, address: Address, account: Account) AsyncResult(void),
        // ... other async methods
    };
};

pub fn AsyncResult(comptime T: type) type {
    return struct {
        data: T,
        error: ?DatabaseError,
    };
}
```

## Testing Requirements

### Test File
Create `/test/evm/state/database_interface_test.zig`

### Test Cases
1. **Interface Compliance**: Test all database implementations satisfy interface
2. **Account Operations**: Get/put/delete account operations
3. **Storage Operations**: Get/put/delete storage operations
4. **Code Operations**: Get/put code and code hash operations
5. **Batch Operations**: Transaction-like batch updates
6. **Snapshot Operations**: Create/restore/delete snapshots
7. **Error Handling**: All error conditions and recovery
8. **Performance**: Database operation performance benchmarks
9. **Memory Management**: No memory leaks in database operations
10. **Concurrent Access**: Thread safety where applicable

### Interface Compliance Testing
```zig
// Generic test function that works with any database implementation
pub fn testDatabaseInterface(db: DatabaseInterface) !void {
    const test_address = Address.fromInt(0x123);
    const test_account = Account{
        .nonce = 1,
        .balance = U256.fromInt(1000),
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    };
    
    // Test account operations
    try testing.expectEqual(@as(?Account, null), try db.get_account(test_address));
    try db.put_account(test_address, test_account);
    try testing.expectEqual(test_account, try db.get_account(test_address).?);
    
    // Test storage operations
    const storage_key = U256.fromInt(0x456);
    const storage_value = U256.fromInt(0x789);
    
    try testing.expectEqual(U256.zero(), try db.get_storage(test_address, storage_key));
    try db.put_storage(test_address, storage_key, storage_value);
    try testing.expectEqual(storage_value, try db.get_storage(test_address, storage_key));
    
    // Test snapshot operations
    const snapshot = try db.create_snapshot();
    try db.delete_account(test_address);
    try testing.expectEqual(@as(?Account, null), try db.get_account(test_address));
    
    try db.restore_snapshot(snapshot);
    try testing.expectEqual(test_account, try db.get_account(test_address).?);
}

test "in-memory database compliance" {
    var db = InMemoryDatabase.init(testing.allocator);
    defer db.deinit();
    
    try testDatabaseInterface(db.interface());
}

test "persistent database compliance" {
    var db = try PersistentDatabase.init(testing.allocator, "/tmp/test_db", 1024);
    defer db.deinit();
    
    try testDatabaseInterface(db.interface());
}
```

## Performance Considerations

### Vtable Dispatch Optimization
```zig
// Measure vtable overhead vs direct calls
test "database interface performance" {
    const iterations = 1_000_000;
    var db = InMemoryDatabase.init(testing.allocator);
    defer db.deinit();
    
    const interface = db.interface();
    const address = Address.fromInt(0x123);
    
    // Direct call benchmark
    var timer = std.time.Timer.start();
    for (0..iterations) |_| {
        _ = db.account_exists_impl(&db, address) catch false;
    }
    const direct_time = timer.read();
    
    // Interface call benchmark
    timer.reset();
    for (0..iterations) |_| {
        _ = interface.account_exists(address) catch false;
    }
    const interface_time = timer.read();
    
    // Should have minimal overhead (< 10%)
    try testing.expect(interface_time < direct_time * 1.1);
}
```

### Batch Operation Optimization
```zig
pub const BatchWriter = struct {
    database: DatabaseInterface,
    batch_handle: BatchHandle,
    
    pub fn init(database: DatabaseInterface) !BatchWriter {
        const handle = try database.begin_batch();
        return BatchWriter{
            .database = database,
            .batch_handle = handle,
        };
    }
    
    pub fn put_account(self: BatchWriter, address: Address, account: Account) !void {
        // Batch operations are more efficient than individual puts
        try self.database.put_account(address, account);
    }
    
    pub fn commit(self: BatchWriter) !void {
        try self.database.commit_batch(self.batch_handle);
    }
    
    pub fn rollback(self: BatchWriter) !void {
        try self.database.rollback_batch(self.batch_handle);
    }
};
```

## Success Criteria

1. **Interface Compliance**: All database implementations satisfy the interface
2. **Type Safety**: Compile-time prevention of incorrect usage
3. **Performance**: <5% overhead from interface abstraction
4. **Error Handling**: Comprehensive error coverage and recovery
5. **Memory Management**: No memory leaks in any database implementation
6. **Testing Coverage**: All interface methods tested thoroughly
7. **Documentation**: Clear interface documentation and usage examples

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test all database implementations** - Interface compliance is critical
3. **Performance validation** - Measure and verify minimal overhead
4. **Memory safety** - No memory leaks or corruption
5. **Error handling coverage** - Test all error conditions
6. **Interface stability** - Changes should be backward compatible

## References

- [Zig Interfaces Pattern](https://ziglearn.org/chapter-2/#interfaces)
- [Database Abstraction Layer Design](https://en.wikipedia.org/wiki/Database_abstraction_layer)
- [RocksDB Documentation](https://rocksdb.org/)
- [LMDB Documentation](http://www.lmdb.tech/doc/)