# Implement Async Database Support

## What
Implement comprehensive async database support enabling non-blocking database operations for state management. This includes async state backends, connection pooling, concurrent read/write operations, batched transactions, and support for multiple database backends (SQLite, PostgreSQL, Redis, in-memory) while maintaining EVM execution correctness.

## Why
Async database operations prevent blocking the main execution thread during state queries, enabling better concurrency and throughput for EVM operations. This is essential for high-performance applications where database I/O latency could otherwise limit EVM execution speed, particularly important for server-side applications and batch processing scenarios.

## How
1. Design AsyncStateInterface with vtable-based backend abstraction
2. Implement connection pooling with health checking and automatic failover
3. Create async result framework with futures/promises pattern
4. Build database backends for SQLite, PostgreSQL, Redis, and memory
5. Add transaction management with ACID properties and deadlock detection
6. Integrate batching system for efficient bulk operations
7. Add comprehensive error handling and recovery mechanisms

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_async_database_support` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_async_database_support feat_implement_async_database_support`
3. **Work in isolation**: `cd g/feat_implement_async_database_support`
4. **Commit message**: Use the following XML format:

```
✨ feat: brief description of the change

<summary>
<what>
- Bullet point summary of what was changed
- Key implementation details and files modified
</what>

<why>
- Motivation and reasoning behind the changes
- Problem being solved or feature being added
</why>

<how>
- Technical approach and implementation strategy
- Important design decisions or trade-offs made
</how>
</summary>

<prompt>
Condensed version of the original prompt that includes:
- The core request or task
- Essential context needed to re-execute
- Replace large code blocks with <github>url</github> or <docs>description</docs>
- Remove redundant examples but keep key technical details
- Ensure someone could understand and repeat the task from this prompt alone
</prompt>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive async database support to enable non-blocking database operations for state management. This includes async state backends, concurrent read/write operations, batched transactions, and connection pooling while maintaining EVM execution correctness and performance.

## ELI5

Async database support is like having a restaurant with multiple waiters instead of just one - while one waiter is taking an order to the kitchen (database operation), other waiters can continue serving customers (handling other EVM operations) without everyone having to wait in line. This means the EVM can keep processing transactions and executing contracts even while waiting for database reads and writes to complete, making everything much faster and more responsive.

## Async Database Architecture Specifications

### Core Async Framework

#### 1. Async State Interface
```zig
pub const AsyncStateInterface = struct {
    ptr: *anyopaque,
    vtable: *const VTable,
    
    pub const VTable = struct {
        // Account operations
        get_account_async: *const fn(ptr: *anyopaque, address: Address) AsyncResult(Account),
        set_account_async: *const fn(ptr: *anyopaque, address: Address, account: Account) AsyncResult(void),
        delete_account_async: *const fn(ptr: *anyopaque, address: Address) AsyncResult(void),
        
        // Storage operations
        get_storage_async: *const fn(ptr: *anyopaque, address: Address, key: U256) AsyncResult(U256),
        set_storage_async: *const fn(ptr: *anyopaque, address: Address, key: U256, value: U256) AsyncResult(void),
        
        // Code operations
        get_code_async: *const fn(ptr: *anyopaque, address: Address) AsyncResult([]const u8),
        set_code_async: *const fn(ptr: *anyopaque, address: Address, code: []const u8) AsyncResult(void),
        
        // Batch operations
        batch_get_storage_async: *const fn(ptr: *anyopaque, requests: []const StorageRequest) AsyncResult([]const U256),
        batch_set_storage_async: *const fn(ptr: *anyopaque, updates: []const StorageUpdate) AsyncResult(void),
        
        // Transaction operations
        begin_transaction_async: *const fn(ptr: *anyopaque) AsyncResult(TransactionId),
        commit_transaction_async: *const fn(ptr: *anyopaque, tx_id: TransactionId) AsyncResult(void),
        rollback_transaction_async: *const fn(ptr: *anyopaque, tx_id: TransactionId) AsyncResult(void),
        
        // Lifecycle operations
        initialize_async: *const fn(ptr: *anyopaque, config: DatabaseConfig) AsyncResult(void),
        close_async: *const fn(ptr: *anyopaque) AsyncResult(void),
        flush_async: *const fn(ptr: *anyopaque) AsyncResult(void),
    };
    
    pub fn init(pointer: anytype) AsyncStateInterface {
        const Ptr = @TypeOf(pointer);
        const ptr_info = @typeInfo(Ptr);
        
        if (ptr_info != .Pointer) @compileError("Expected pointer");
        if (ptr_info.Pointer.size != .One) @compileError("Expected single item pointer");
        
        const Child = ptr_info.Pointer.child;
        
        const impl = struct {
            fn get_account_async(ptr: *anyopaque, address: Address) AsyncResult(Account) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.get_account_async(address);
            }
            
            fn set_account_async(ptr: *anyopaque, address: Address, account: Account) AsyncResult(void) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.set_account_async(address, account);
            }
            
            fn delete_account_async(ptr: *anyopaque, address: Address) AsyncResult(void) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.delete_account_async(address);
            }
            
            fn get_storage_async(ptr: *anyopaque, address: Address, key: U256) AsyncResult(U256) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.get_storage_async(address, key);
            }
            
            fn set_storage_async(ptr: *anyopaque, address: Address, key: U256, value: U256) AsyncResult(void) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.set_storage_async(address, key, value);
            }
            
            fn get_code_async(ptr: *anyopaque, address: Address) AsyncResult([]const u8) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.get_code_async(address);
            }
            
            fn set_code_async(ptr: *anyopaque, address: Address, code: []const u8) AsyncResult(void) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.set_code_async(address, code);
            }
            
            fn batch_get_storage_async(ptr: *anyopaque, requests: []const StorageRequest) AsyncResult([]const U256) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.batch_get_storage_async(requests);
            }
            
            fn batch_set_storage_async(ptr: *anyopaque, updates: []const StorageUpdate) AsyncResult(void) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.batch_set_storage_async(updates);
            }
            
            fn begin_transaction_async(ptr: *anyopaque) AsyncResult(TransactionId) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.begin_transaction_async();
            }
            
            fn commit_transaction_async(ptr: *anyopaque, tx_id: TransactionId) AsyncResult(void) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.commit_transaction_async(tx_id);
            }
            
            fn rollback_transaction_async(ptr: *anyopaque, tx_id: TransactionId) AsyncResult(void) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.rollback_transaction_async(tx_id);
            }
            
            fn initialize_async(ptr: *anyopaque, config: DatabaseConfig) AsyncResult(void) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.initialize_async(config);
            }
            
            fn close_async(ptr: *anyopaque) AsyncResult(void) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.close_async();
            }
            
            fn flush_async(ptr: *anyopaque) AsyncResult(void) {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                return self.flush_async();
            }
        };
        
        return AsyncStateInterface{
            .ptr = pointer,
            .vtable = &VTable{
                .get_account_async = impl.get_account_async,
                .set_account_async = impl.set_account_async,
                .delete_account_async = impl.delete_account_async,
                .get_storage_async = impl.get_storage_async,
                .set_storage_async = impl.set_storage_async,
                .get_code_async = impl.get_code_async,
                .set_code_async = impl.set_code_async,
                .batch_get_storage_async = impl.batch_get_storage_async,
                .batch_set_storage_async = impl.batch_set_storage_async,
                .begin_transaction_async = impl.begin_transaction_async,
                .commit_transaction_async = impl.commit_transaction_async,
                .rollback_transaction_async = impl.rollback_transaction_async,
                .initialize_async = impl.initialize_async,
                .close_async = impl.close_async,
                .flush_async = impl.flush_async,
            },
        };
    }
    
    // Convenience methods that await results
    pub fn get_account(self: AsyncStateInterface, address: Address) !Account {
        return (self.vtable.get_account_async(self.ptr, address)).await();
    }
    
    pub fn set_account(self: AsyncStateInterface, address: Address, account: Account) !void {
        return (self.vtable.set_account_async(self.ptr, address, account)).await();
    }
    
    pub fn get_storage(self: AsyncStateInterface, address: Address, key: U256) !U256 {
        return (self.vtable.get_storage_async(self.ptr, address, key)).await();
    }
    
    pub fn set_storage(self: AsyncStateInterface, address: Address, key: U256, value: U256) !void {
        return (self.vtable.set_storage_async(self.ptr, address, key, value)).await();
    }
};

pub const TransactionId = struct {
    id: u64,
    timestamp: i64,
    
    pub fn new() TransactionId {
        return TransactionId{
            .id = std.crypto.random.int(u64),
            .timestamp = std.time.milliTimestamp(),
        };
    }
};

pub const StorageRequest = struct {
    address: Address,
    key: U256,
    priority: Priority,
    
    pub const Priority = enum {
        Low,
        Normal,
        High,
        Critical,
    };
};

pub const StorageUpdate = struct {
    address: Address,
    key: U256,
    value: U256,
    transaction_id: ?TransactionId,
};

pub const DatabaseConfig = struct {
    connection_string: []const u8,
    max_connections: u32,
    connection_timeout_ms: u32,
    query_timeout_ms: u32,
    enable_connection_pooling: bool,
    enable_write_batching: bool,
    batch_size: u32,
    batch_timeout_ms: u32,
    enable_compression: bool,
    enable_encryption: bool,
    
    pub fn default() DatabaseConfig {
        return DatabaseConfig{
            .connection_string = "sqlite://state.db",
            .max_connections = 10,
            .connection_timeout_ms = 5000,
            .query_timeout_ms = 10000,
            .enable_connection_pooling = true,
            .enable_write_batching = true,
            .batch_size = 100,
            .batch_timeout_ms = 100,
            .enable_compression = false,
            .enable_encryption = false,
        };
    }
    
    pub fn postgres(connection_string: []const u8) DatabaseConfig {
        return DatabaseConfig{
            .connection_string = connection_string,
            .max_connections = 20,
            .connection_timeout_ms = 3000,
            .query_timeout_ms = 15000,
            .enable_connection_pooling = true,
            .enable_write_batching = true,
            .batch_size = 500,
            .batch_timeout_ms = 50,
            .enable_compression = true,
            .enable_encryption = true,
        };
    }
    
    pub fn redis(connection_string: []const u8) DatabaseConfig {
        return DatabaseConfig{
            .connection_string = connection_string,
            .max_connections = 50,
            .connection_timeout_ms = 1000,
            .query_timeout_ms = 5000,
            .enable_connection_pooling = true,
            .enable_write_batching = true,
            .batch_size = 1000,
            .batch_timeout_ms = 10,
            .enable_compression = false,
            .enable_encryption = false,
        };
    }
};
```

#### 2. Async Result Framework
```zig
pub fn AsyncResult(comptime T: type) type {
    return struct {
        const Self = @This();
        
        future: Future(T),
        
        pub const Future = struct {
            state: State,
            result: union(enum) {
                pending: void,
                completed: T,
                error_result: AsyncError,
            },
            callbacks: std.ArrayList(Callback),
            allocator: std.mem.Allocator,
            
            pub const State = enum {
                Pending,
                Completed,
                Error,
            };
            
            pub const Callback = struct {
                function: *const fn(result: AsyncResultValue(T)) void,
                context: ?*anyopaque,
            };
            
            pub fn init(allocator: std.mem.Allocator) Future {
                return Future{
                    .state = .Pending,
                    .result = .{ .pending = {} },
                    .callbacks = std.ArrayList(Callback).init(allocator),
                    .allocator = allocator,
                };
            }
            
            pub fn deinit(self: *Future) void {
                self.callbacks.deinit();
            }
            
            pub fn complete(self: *Future, value: T) void {
                if (self.state != .Pending) return;
                
                self.state = .Completed;
                self.result = .{ .completed = value };
                
                // Notify all callbacks
                for (self.callbacks.items) |callback| {
                    callback.function(.{ .ok = value });
                }
                
                self.callbacks.clearRetainingCapacity();
            }
            
            pub fn complete_error(self: *Future, err: AsyncError) void {
                if (self.state != .Pending) return;
                
                self.state = .Error;
                self.result = .{ .error_result = err };
                
                // Notify all callbacks
                for (self.callbacks.items) |callback| {
                    callback.function(.{ .err = err });
                }
                
                self.callbacks.clearRetainingCapacity();
            }
            
            pub fn add_callback(self: *Future, callback: Callback) !void {
                switch (self.state) {
                    .Pending => {
                        try self.callbacks.append(callback);
                    },
                    .Completed => {
                        callback.function(.{ .ok = self.result.completed });
                    },
                    .Error => {
                        callback.function(.{ .err = self.result.error_result });
                    },
                }
            }
        };
        
        pub fn init(allocator: std.mem.Allocator) Self {
            return Self{
                .future = Future.init(allocator),
            };
        }
        
        pub fn deinit(self: *Self) void {
            self.future.deinit();
        }
        
        pub fn complete(self: *Self, value: T) void {
            self.future.complete(value);
        }
        
        pub fn complete_error(self: *Self, err: AsyncError) void {
            self.future.complete_error(err);
        }
        
        pub fn await(self: *Self) !T {
            // In a real implementation, this would block or yield to the event loop
            // For now, we'll use a simple busy wait
            while (self.future.state == .Pending) {
                std.time.sleep(1000000); // 1ms
            }
            
            return switch (self.future.state) {
                .Completed => self.future.result.completed,
                .Error => self.future.result.error_result,
                .Pending => unreachable,
            };
        }
        
        pub fn then(self: *Self, comptime callback: anytype) !void {
            const callback_wrapper = struct {
                fn call(result: AsyncResultValue(T)) void {
                    callback(result);
                }
            };
            
            try self.future.add_callback(.{
                .function = callback_wrapper.call,
                .context = null,
            });
        }
        
        pub fn is_ready(self: *const Self) bool {
            return self.future.state != .Pending;
        }
        
        pub fn is_error(self: *const Self) bool {
            return self.future.state == .Error;
        }
    };
}

pub fn AsyncResultValue(comptime T: type) type {
    return union(enum) {
        ok: T,
        err: AsyncError,
    };
}

pub const AsyncError = error{
    DatabaseConnectionFailed,
    DatabaseTimeout,
    DatabaseQueryFailed,
    TransactionFailed,
    InvalidTransaction,
    DatabaseCorrupted,
    InsufficientPermissions,
    ResourceExhausted,
    NetworkError,
    SerializationError,
    DeserializationError,
    InvalidConfiguration,
    OperationCancelled,
    ConcurrencyConflict,
    DeadlockDetected,
};
```

#### 3. Connection Pool Manager
```zig
pub const ConnectionPool = struct {
    allocator: std.mem.Allocator,
    config: DatabaseConfig,
    connections: std.ArrayList(Connection),
    available_connections: std.ArrayList(*Connection),
    active_connections: std.HashMap(*Connection, ConnectionInfo, std.hash_map.AutoContext(*Connection), std.hash_map.default_max_load_percentage),
    mutex: std.Thread.Mutex,
    condition: std.Thread.Condition,
    closed: bool,
    
    pub const Connection = struct {
        id: u32,
        created_at: i64,
        last_used: i64,
        usage_count: u64,
        state: ConnectionState,
        backend: DatabaseBackend,
        
        pub const ConnectionState = enum {
            Available,
            InUse,
            Closed,
            Error,
        };
        
        pub fn is_healthy(self: *const Connection) bool {
            const now = std.time.milliTimestamp();
            const idle_time = now - self.last_used;
            const age = now - self.created_at;
            
            return self.state == .Available and
                   idle_time < MAX_IDLE_TIME_MS and
                   age < MAX_CONNECTION_AGE_MS;
        }
        
        const MAX_IDLE_TIME_MS = 300000; // 5 minutes
        const MAX_CONNECTION_AGE_MS = 3600000; // 1 hour
    };
    
    pub const ConnectionInfo = struct {
        acquired_at: i64,
        thread_id: std.Thread.Id,
        operation: []const u8,
    };
    
    pub fn init(allocator: std.mem.Allocator, config: DatabaseConfig) ConnectionPool {
        return ConnectionPool{
            .allocator = allocator,
            .config = config,
            .connections = std.ArrayList(Connection).init(allocator),
            .available_connections = std.ArrayList(*Connection).init(allocator),
            .active_connections = std.HashMap(*Connection, ConnectionInfo, std.hash_map.AutoContext(*Connection), std.hash_map.default_max_load_percentage).init(allocator),
            .mutex = std.Thread.Mutex{},
            .condition = std.Thread.Condition{},
            .closed = false,
        };
    }
    
    pub fn deinit(self: *ConnectionPool) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        self.closed = true;
        
        // Close all connections
        for (self.connections.items) |*connection| {
            connection.backend.close();
        }
        
        self.connections.deinit();
        self.available_connections.deinit();
        self.active_connections.deinit();
    }
    
    pub fn acquire_connection(self: *ConnectionPool) !*Connection {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        if (self.closed) {
            return AsyncError.DatabaseConnectionFailed;
        }
        
        // Try to get an available connection
        if (self.available_connections.items.len > 0) {
            const connection = self.available_connections.pop();
            
            if (connection.is_healthy()) {
                connection.state = .InUse;
                connection.last_used = std.time.milliTimestamp();
                connection.usage_count += 1;
                
                try self.active_connections.put(connection, ConnectionInfo{
                    .acquired_at = std.time.milliTimestamp(),
                    .thread_id = std.Thread.getCurrentId(),
                    .operation = "unknown",
                });
                
                return connection;
            } else {
                // Connection is unhealthy, close it and try to create a new one
                connection.backend.close();
                connection.state = .Closed;
            }
        }
        
        // Create new connection if under limit
        if (self.connections.items.len < self.config.max_connections) {
            const connection = try self.create_connection();
            try self.connections.append(connection);
            
            const connection_ptr = &self.connections.items[self.connections.items.len - 1];
            connection_ptr.state = .InUse;
            connection_ptr.last_used = std.time.milliTimestamp();
            connection_ptr.usage_count += 1;
            
            try self.active_connections.put(connection_ptr, ConnectionInfo{
                .acquired_at = std.time.milliTimestamp(),
                .thread_id = std.Thread.getCurrentId(),
                .operation = "unknown",
            });
            
            return connection_ptr;
        }
        
        // Wait for a connection to become available
        const deadline = std.time.milliTimestamp() + self.config.connection_timeout_ms;
        
        while (self.available_connections.items.len == 0 and 
               std.time.milliTimestamp() < deadline and 
               !self.closed) {
            
            self.condition.wait(&self.mutex);
        }
        
        if (self.closed) {
            return AsyncError.DatabaseConnectionFailed;
        }
        
        if (self.available_connections.items.len == 0) {
            return AsyncError.DatabaseTimeout;
        }
        
        // Try again recursively
        return self.acquire_connection();
    }
    
    pub fn release_connection(self: *ConnectionPool, connection: *Connection) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        if (self.active_connections.remove(connection)) {
            connection.state = .Available;
            connection.last_used = std.time.milliTimestamp();
            
            if (connection.is_healthy()) {
                self.available_connections.append(connection) catch {
                    // If we can't add to available list, close the connection
                    connection.backend.close();
                    connection.state = .Closed;
                };
            } else {
                connection.backend.close();
                connection.state = .Closed;
            }
            
            // Notify waiting threads
            self.condition.signal();
        }
    }
    
    fn create_connection(self: *ConnectionPool) !Connection {
        const backend = try DatabaseBackend.init(self.config);
        try backend.connect();
        
        return Connection{
            .id = @truncate(u32, std.crypto.random.int(u64)),
            .created_at = std.time.milliTimestamp(),
            .last_used = std.time.milliTimestamp(),
            .usage_count = 0,
            .state = .Available,
            .backend = backend,
        };
    }
    
    pub fn get_pool_statistics(self: *ConnectionPool) PoolStatistics {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        return PoolStatistics{
            .total_connections = self.connections.items.len,
            .available_connections = self.available_connections.items.len,
            .active_connections = self.active_connections.count(),
            .closed_connections = self.count_closed_connections(),
        };
    }
    
    fn count_closed_connections(self: *ConnectionPool) u32 {
        var count: u32 = 0;
        for (self.connections.items) |connection| {
            if (connection.state == .Closed) {
                count += 1;
            }
        }
        return count;
    }
    
    pub const PoolStatistics = struct {
        total_connections: usize,
        available_connections: usize,
        active_connections: u32,
        closed_connections: u32,
    };
};
```

#### 4. Database Backend Implementation
```zig
pub const DatabaseBackend = struct {
    backend_type: BackendType,
    connection_state: ConnectionState,
    config: DatabaseConfig,
    native_handle: ?*anyopaque,
    
    pub const BackendType = enum {
        SQLite,
        PostgreSQL,
        Redis,
        Memory,
    };
    
    pub const ConnectionState = enum {
        Disconnected,
        Connecting,
        Connected,
        Error,
    };
    
    pub fn init(config: DatabaseConfig) !DatabaseBackend {
        const backend_type = determine_backend_type(config.connection_string);
        
        return DatabaseBackend{
            .backend_type = backend_type,
            .connection_state = .Disconnected,
            .config = config,
            .native_handle = null,
        };
    }
    
    pub fn connect(self: *DatabaseBackend) !void {
        self.connection_state = .Connecting;
        
        switch (self.backend_type) {
            .SQLite => try self.connect_sqlite(),
            .PostgreSQL => try self.connect_postgresql(),
            .Redis => try self.connect_redis(),
            .Memory => try self.connect_memory(),
        }
        
        self.connection_state = .Connected;
    }
    
    pub fn close(self: *DatabaseBackend) void {
        switch (self.backend_type) {
            .SQLite => self.close_sqlite(),
            .PostgreSQL => self.close_postgresql(),
            .Redis => self.close_redis(),
            .Memory => self.close_memory(),
        }
        
        self.connection_state = .Disconnected;
        self.native_handle = null;
    }
    
    pub fn execute_query_async(
        self: *DatabaseBackend,
        query: DatabaseQuery
    ) AsyncResult(QueryResult) {
        var result = AsyncResult(QueryResult).init(self.config.allocator);
        
        // Spawn async task
        const task = AsyncTask{
            .backend = self,
            .query = query,
            .result = &result,
        };
        
        // In a real implementation, this would be submitted to a thread pool
        std.Thread.spawn(.{}, execute_query_task, .{task}) catch |err| {
            result.complete_error(AsyncError.DatabaseQueryFailed);
        };
        
        return result;
    }
    
    pub fn execute_batch_async(
        self: *DatabaseBackend,
        batch: BatchQuery
    ) AsyncResult(BatchResult) {
        var result = AsyncResult(BatchResult).init(self.config.allocator);
        
        // Spawn async task for batch processing
        const task = AsyncBatchTask{
            .backend = self,
            .batch = batch,
            .result = &result,
        };
        
        std.Thread.spawn(.{}, execute_batch_task, .{task}) catch |err| {
            result.complete_error(AsyncError.DatabaseQueryFailed);
        };
        
        return result;
    }
    
    fn connect_sqlite(self: *DatabaseBackend) !void {
        // SQLite connection implementation
        // This would use a real SQLite library
        self.native_handle = @ptrCast(*anyopaque, &sqlite_placeholder);
    }
    
    fn connect_postgresql(self: *DatabaseBackend) !void {
        // PostgreSQL connection implementation
        // This would use libpq or similar
        self.native_handle = @ptrCast(*anyopaque, &postgresql_placeholder);
    }
    
    fn connect_redis(self: *DatabaseBackend) !void {
        // Redis connection implementation
        // This would use hiredis or similar
        self.native_handle = @ptrCast(*anyopaque, &redis_placeholder);
    }
    
    fn connect_memory(self: *DatabaseBackend) !void {
        // In-memory backend for testing
        const memory_db = try self.config.allocator.create(MemoryDatabase);
        memory_db.* = MemoryDatabase.init(self.config.allocator);
        self.native_handle = @ptrCast(*anyopaque, memory_db);
    }
    
    fn close_sqlite(self: *DatabaseBackend) void {
        // Close SQLite connection
    }
    
    fn close_postgresql(self: *DatabaseBackend) void {
        // Close PostgreSQL connection
    }
    
    fn close_redis(self: *DatabaseBackend) void {
        // Close Redis connection
    }
    
    fn close_memory(self: *DatabaseBackend) void {
        if (self.native_handle) |handle| {
            const memory_db = @ptrCast(*MemoryDatabase, @alignCast(@alignOf(MemoryDatabase), handle));
            memory_db.deinit();
            self.config.allocator.destroy(memory_db);
        }
    }
    
    fn determine_backend_type(connection_string: []const u8) BackendType {
        if (std.mem.startsWith(u8, connection_string, "sqlite://")) {
            return .SQLite;
        } else if (std.mem.startsWith(u8, connection_string, "postgresql://") or 
                   std.mem.startsWith(u8, connection_string, "postgres://")) {
            return .PostgreSQL;
        } else if (std.mem.startsWith(u8, connection_string, "redis://")) {
            return .Redis;
        } else if (std.mem.startsWith(u8, connection_string, "memory://")) {
            return .Memory;
        } else {
            return .SQLite; // Default
        }
    }
    
    // Placeholder handles for demonstration
    var sqlite_placeholder: u8 = 0;
    var postgresql_placeholder: u8 = 0;
    var redis_placeholder: u8 = 0;
};

pub const DatabaseQuery = struct {
    query_type: QueryType,
    parameters: QueryParameters,
    timeout_ms: u32,
    priority: Priority,
    
    pub const QueryType = enum {
        Select,
        Insert,
        Update,
        Delete,
        Transaction,
    };
    
    pub const Priority = enum {
        Low,
        Normal,
        High,
        Critical,
    };
};

pub const QueryParameters = union(enum) {
    account_query: AccountQuery,
    storage_query: StorageQuery,
    code_query: CodeQuery,
    batch_query: BatchQueryParams,
    
    pub const AccountQuery = struct {
        address: Address,
        fields: AccountFields,
        
        pub const AccountFields = packed struct {
            balance: bool,
            nonce: bool,
            code_hash: bool,
            storage_root: bool,
        };
    };
    
    pub const StorageQuery = struct {
        address: Address,
        key: U256,
        include_proofs: bool,
    };
    
    pub const CodeQuery = struct {
        address: Address,
        include_analysis: bool,
    };
    
    pub const BatchQueryParams = struct {
        operations: []const Operation,
        transaction_id: ?TransactionId,
        
        pub const Operation = union(enum) {
            get_account: Address,
            get_storage: struct { address: Address, key: U256 },
            set_storage: struct { address: Address, key: U256, value: U256 },
            get_code: Address,
        };
    };
};

pub const QueryResult = union(enum) {
    account_result: ?Account,
    storage_result: U256,
    code_result: []const u8,
    batch_result: BatchQueryResult,
    transaction_result: TransactionResult,
    
    pub const BatchQueryResult = struct {
        results: []const QueryResult,
        errors: []const AsyncError,
    };
    
    pub const TransactionResult = struct {
        transaction_id: TransactionId,
        committed: bool,
        affected_rows: u32,
    };
};

const AsyncTask = struct {
    backend: *DatabaseBackend,
    query: DatabaseQuery,
    result: *AsyncResult(QueryResult),
};

const AsyncBatchTask = struct {
    backend: *DatabaseBackend,
    batch: BatchQuery,
    result: *AsyncResult(BatchResult),
};

fn execute_query_task(task: AsyncTask) void {
    // Execute the query on the backend
    const query_result = task.backend.execute_query_sync(task.query) catch |err| {
        task.result.complete_error(AsyncError.DatabaseQueryFailed);
        return;
    };
    
    task.result.complete(query_result);
}

fn execute_batch_task(task: AsyncBatchTask) void {
    // Execute batch operations
    const batch_result = task.backend.execute_batch_sync(task.batch) catch |err| {
        task.result.complete_error(AsyncError.DatabaseQueryFailed);
        return;
    };
    
    task.result.complete(batch_result);
}
```

## Implementation Requirements

### Core Functionality
1. **Non-blocking Operations**: All database operations must be asynchronous
2. **Connection Pooling**: Efficient connection management with health checking
3. **Transaction Support**: ACID transactions with rollback capabilities
4. **Batch Operations**: Efficient batch reads and writes
5. **Multiple Backends**: Support for SQLite, PostgreSQL, Redis, and in-memory
6. **Error Handling**: Comprehensive error handling with retry mechanisms

## Implementation Tasks

### Task 1: Implement Async State Backend
File: `/src/evm/async_state/async_state_backend.zig`
```zig
const std = @import("std");
const AsyncStateInterface = @import("async_state_interface.zig").AsyncStateInterface;
const ConnectionPool = @import("connection_pool.zig").ConnectionPool;
const AsyncResult = @import("async_result.zig").AsyncResult;

pub const AsyncStateBackend = struct {
    allocator: std.mem.Allocator,
    connection_pool: ConnectionPool,
    config: DatabaseConfig,
    cache: ?StateCache,
    write_batch: WriteBatch,
    transaction_manager: TransactionManager,
    
    pub fn init(allocator: std.mem.Allocator, config: DatabaseConfig) !AsyncStateBackend {
        return AsyncStateBackend{
            .allocator = allocator,
            .connection_pool = ConnectionPool.init(allocator, config),
            .config = config,
            .cache = if (config.enable_caching) StateCache.init(allocator) else null,
            .write_batch = WriteBatch.init(allocator, config),
            .transaction_manager = TransactionManager.init(allocator),
        };
    }
    
    pub fn deinit(self: *AsyncStateBackend) void {
        self.connection_pool.deinit();
        if (self.cache) |*cache| {
            cache.deinit();
        }
        self.write_batch.deinit();
        self.transaction_manager.deinit();
    }
    
    pub fn get_account_async(self: *AsyncStateBackend, address: Address) AsyncResult(Account) {
        // Check cache first
        if (self.cache) |*cache| {
            if (cache.get_account(address)) |account| {
                var result = AsyncResult(Account).init(self.allocator);
                result.complete(account);
                return result;
            }
        }
        
        // Query database asynchronously
        const connection = self.connection_pool.acquire_connection() catch |err| {
            var result = AsyncResult(Account).init(self.allocator);
            result.complete_error(AsyncError.DatabaseConnectionFailed);
            return result;
        };
        defer self.connection_pool.release_connection(connection);
        
        const query = DatabaseQuery{
            .query_type = .Select,
            .parameters = .{ .account_query = .{
                .address = address,
                .fields = .{
                    .balance = true,
                    .nonce = true,
                    .code_hash = true,
                    .storage_root = true,
                },
            }},
            .timeout_ms = self.config.query_timeout_ms,
            .priority = .Normal,
        };
        
        return connection.backend.execute_query_async(query);
    }
    
    pub fn set_account_async(self: *AsyncStateBackend, address: Address, account: Account) AsyncResult(void) {
        // Update cache
        if (self.cache) |*cache| {
            cache.set_account(address, account);
        }
        
        // Add to write batch if enabled
        if (self.config.enable_write_batching) {
            self.write_batch.add_account_update(address, account) catch |err| {
                var result = AsyncResult(void).init(self.allocator);
                result.complete_error(AsyncError.DatabaseQueryFailed);
                return result;
            };
            
            var result = AsyncResult(void).init(self.allocator);
            result.complete({});
            return result;
        }
        
        // Execute immediately
        return self.execute_account_update(address, account);
    }
    
    pub fn get_storage_async(self: *AsyncStateBackend, address: Address, key: U256) AsyncResult(U256) {
        // Check cache first
        if (self.cache) |*cache| {
            if (cache.get_storage(address, key)) |value| {
                var result = AsyncResult(U256).init(self.allocator);
                result.complete(value);
                return result;
            }
        }
        
        // Query database asynchronously
        const connection = self.connection_pool.acquire_connection() catch |err| {
            var result = AsyncResult(U256).init(self.allocator);
            result.complete_error(AsyncError.DatabaseConnectionFailed);
            return result;
        };
        defer self.connection_pool.release_connection(connection);
        
        const query = DatabaseQuery{
            .query_type = .Select,
            .parameters = .{ .storage_query = .{
                .address = address,
                .key = key,
                .include_proofs = false,
            }},
            .timeout_ms = self.config.query_timeout_ms,
            .priority = .Normal,
        };
        
        return connection.backend.execute_query_async(query);
    }
    
    pub fn batch_get_storage_async(
        self: *AsyncStateBackend,
        requests: []const StorageRequest
    ) AsyncResult([]const U256) {
        var results = std.ArrayList(U256).init(self.allocator);
        var pending_requests = std.ArrayList(StorageRequest).init(self.allocator);
        defer pending_requests.deinit();
        
        // Check cache for each request
        for (requests) |request| {
            if (self.cache) |*cache| {
                if (cache.get_storage(request.address, request.key)) |value| {
                    results.append(value) catch {
                        var result = AsyncResult([]const U256).init(self.allocator);
                        result.complete_error(AsyncError.ResourceExhausted);
                        return result;
                    };
                    continue;
                }
            }
            
            pending_requests.append(request) catch {
                var result = AsyncResult([]const U256).init(self.allocator);
                result.complete_error(AsyncError.ResourceExhausted);
                return result;
            };
        }
        
        // If all requests were served from cache
        if (pending_requests.items.len == 0) {
            var result = AsyncResult([]const U256).init(self.allocator);
            result.complete(results.toOwnedSlice() catch {
                result.complete_error(AsyncError.ResourceExhausted);
                return result;
            });
            return result;
        }
        
        // Execute batch query for remaining requests
        return self.execute_batch_storage_query(pending_requests.items, results);
    }
    
    fn execute_account_update(self: *AsyncStateBackend, address: Address, account: Account) AsyncResult(void) {
        const connection = self.connection_pool.acquire_connection() catch |err| {
            var result = AsyncResult(void).init(self.allocator);
            result.complete_error(AsyncError.DatabaseConnectionFailed);
            return result;
        };
        defer self.connection_pool.release_connection(connection);
        
        const query = DatabaseQuery{
            .query_type = .Update,
            .parameters = .{ .account_query = .{
                .address = address,
                .fields = .{
                    .balance = true,
                    .nonce = true,
                    .code_hash = true,
                    .storage_root = true,
                },
            }},
            .timeout_ms = self.config.query_timeout_ms,
            .priority = .Normal,
        };
        
        return connection.backend.execute_query_async(query);
    }
    
    fn execute_batch_storage_query(
        self: *AsyncStateBackend,
        requests: []const StorageRequest,
        existing_results: std.ArrayList(U256)
    ) AsyncResult([]const U256) {
        var result = AsyncResult([]const U256).init(self.allocator);
        
        // This would be implemented with proper batch query logic
        // For now, return the existing results
        result.complete(existing_results.toOwnedSlice() catch {
            result.complete_error(AsyncError.ResourceExhausted);
            return result;
        });
        
        return result;
    }
};
```

### Task 2: Integrate with VM Execution
File: `/src/evm/vm.zig` (modify existing)
```zig
const AsyncStateInterface = @import("async_state/async_state_interface.zig").AsyncStateInterface;
const AsyncStateBackend = @import("async_state/async_state_backend.zig").AsyncStateBackend;

pub const Vm = struct {
    // Existing fields...
    async_state: ?AsyncStateInterface,
    async_enabled: bool,
    
    pub fn init(allocator: std.mem.Allocator, chain_id: u64) !Vm {
        var vm = Vm{
            // Existing initialization...
            .async_state = null,
            .async_enabled = false,
        };
        
        return vm;
    }
    
    pub fn enable_async_state(self: *Vm, config: DatabaseConfig) !void {
        const backend = try self.allocator.create(AsyncStateBackend);
        backend.* = try AsyncStateBackend.init(self.allocator, config);
        
        self.async_state = AsyncStateInterface.init(backend);
        self.async_enabled = true;
    }
    
    pub fn disable_async_state(self: *Vm) void {
        if (self.async_state) |state| {
            // Properly clean up the backend
            const backend = @ptrCast(*AsyncStateBackend, @alignCast(@alignOf(AsyncStateBackend), state.ptr));
            backend.deinit();
            self.allocator.destroy(backend);
            
            self.async_state = null;
        }
        self.async_enabled = false;
    }
    
    pub fn get_storage_async(self: *Vm, address: Address, key: U256) !U256 {
        if (self.async_state) |state| {
            return state.get_storage(address, key);
        } else {
            // Fall back to synchronous state
            return self.state.get_storage(address, key);
        }
    }
    
    pub fn set_storage_async(self: *Vm, address: Address, key: U256, value: U256) !void {
        if (self.async_state) |state| {
            return state.set_storage(address, key, value);
        } else {
            // Fall back to synchronous state
            self.state.set_storage(address, key, value);
        }
    }
    
    pub fn execute_with_async_state(
        self: *Vm,
        caller: Address,
        callee: Address,
        input: []const u8,
        gas_limit: u64
    ) !ExecutionResult {
        if (!self.async_enabled) {
            return self.execute(caller, callee, input, gas_limit);
        }
        
        // Execute with async state operations
        // This would require refactoring the execution loop to handle async operations
        return self.execute_async_internal(caller, callee, input, gas_limit);
    }
    
    fn execute_async_internal(
        self: *Vm,
        caller: Address,
        callee: Address,
        input: []const u8,
        gas_limit: u64
    ) !ExecutionResult {
        // Async execution implementation
        // This would require significant refactoring of the execution loop
        // to handle async state operations properly
        
        // For now, return a placeholder implementation
        return ExecutionResult{
            .success = true,
            .gas_used = 21000,
            .output = &[_]u8{},
        };
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/async_state/async_database_support_test.zig`

### Test Cases
```zig
test "async state interface creation" {
    // Test async state interface initialization
    // Test backend registration
    // Test configuration validation
}

test "connection pool management" {
    // Test connection acquisition and release
    // Test connection health checking
    // Test pool statistics
}

test "async database operations" {
    // Test async account operations
    // Test async storage operations
    // Test batch operations
}

test "transaction management" {
    // Test transaction begin/commit/rollback
    // Test concurrent transactions
    // Test deadlock detection
}

test "error handling and recovery" {
    // Test connection failures
    // Test timeout handling
    // Test retry mechanisms
}

test "performance with async operations" {
    // Test async vs sync performance
    // Test connection pool efficiency
    // Test batch operation benefits
}

test "integration with VM execution" {
    // Test VM async state integration
    // Test execution with async operations
    // Test mixed sync/async scenarios
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/async_state/async_state_interface.zig` - Async state interface definition
- `/src/evm/async_state/async_state_backend.zig` - Async state implementation
- `/src/evm/async_state/async_result.zig` - Async result framework
- `/src/evm/async_state/connection_pool.zig` - Database connection pooling
- `/src/evm/async_state/database_backend.zig` - Database backend implementations
- `/src/evm/async_state/transaction_manager.zig` - Transaction management
- `/src/evm/async_state/write_batch.zig` - Write batching system
- `/src/evm/async_state/state_cache.zig` - State caching layer
- `/src/evm/vm.zig` - VM integration with async state
- `/src/evm/execution/` - Async operation support in opcodes
- `/test/evm/async_state/async_database_support_test.zig` - Comprehensive tests

## Success Criteria

1. **Non-blocking Operations**: All database operations execute asynchronously
2. **Connection Efficiency**: Effective connection pooling with health monitoring
3. **Transaction Integrity**: ACID compliance with proper isolation
4. **Batch Performance**: Significant performance improvement with batch operations
5. **Error Resilience**: Robust error handling with automatic recovery
6. **Integration Quality**: Seamless integration with existing VM execution

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Backward compatibility** - Sync state operations must continue working
3. **Data integrity** - No data corruption or loss during async operations
4. **Performance** - Async operations should improve throughput
5. **Resource management** - Proper cleanup of connections and resources
6. **Error isolation** - Database errors must not crash VM execution

## References

- [Async/Await Patterns](https://en.wikipedia.org/wiki/Async/await) - Asynchronous programming concepts
- [Connection Pooling](https://en.wikipedia.org/wiki/Connection_pool) - Database connection management
- [ACID Properties](https://en.wikipedia.org/wiki/ACID) - Database transaction properties
- [Futures and Promises](https://en.wikipedia.org/wiki/Futures_and_promises) - Async programming primitives
- [Database Sharding](https://en.wikipedia.org/wiki/Shard_(database_architecture)) - Scaling database operations