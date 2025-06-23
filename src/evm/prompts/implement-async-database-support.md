# Implement Async Database Support

<<<<<<< HEAD
You are implementing Async Database Support for the Tevm EVM written in Zig. Your goal is to implement asynchronous database interface for state operations following Ethereum specifications and maintaining compatibility with existing implementations.

=======
<review>
**Implementation Status: NOT IMPLEMENTED ❌**

**Current Status:**
- Current database interface is synchronous only
- State operations in database_interface.zig are blocking
- No async framework or connection pooling exists

**Implementation Requirements:**
- Complete async database interface with Zig async/await support
- Async state backends and connection pooling
- Integration with existing synchronous state management system

**Priority: HIGH - Critical for production scalability and performance under load**
</review>

You are implementing Async Database Support for the Tevm EVM written in Zig. Your goal is to implement asynchronous database interface for state operations following Ethereum specifications and maintaining compatibility with existing implementations.

>>>>>>> origin/main
## Development Workflow
- **Branch**: `feat_implement_async_database_support` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_async_database_support feat_implement_async_database_support`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement comprehensive async database support to enable non-blocking database operations for state management. This includes async state backends, concurrent read/write operations, batched transactions, and connection pooling while maintaining EVM execution correctness and performance.

## ELI5

Imagine you're running a busy restaurant where customers place orders, but instead of making each customer wait while their food is being prepared, you give them a number and let them sit down while multiple chefs work on different orders simultaneously. Async database support works similarly for blockchain operations - instead of making the EVM wait every time it needs to read or write data to storage, it can continue processing other tasks while database operations happen in the background. The enhanced version is like upgrading to a smart restaurant system: you have multiple kitchen stations working in parallel, a smart ordering system that can batch similar requests together (like preparing all salads at once), a reservation system that manages how many customers can be served at once, and automatic coordination to ensure orders are delivered to the right tables in the right order. This prevents the blockchain from getting stuck waiting for slow storage operations and allows much higher transaction throughput.

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

## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Implementation matches Ethereum specification exactly
✅ Input validation handles all edge cases
✅ Output format matches reference implementations
✅ Performance meets or exceeds benchmarks
✅ Gas costs are calculated correctly

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/async_database/async_database_test.zig`)
```zig
// Test basic async database functionality
test "async_database basic functionality with known scenarios"
test "async_database handles edge cases correctly"
test "async_database validates state changes"
test "async_database correct behavior under load"
```

#### 2. **Integration Tests**
```zig
test "async_database integrates with EVM context correctly"
test "async_database works with existing systems"
test "async_database maintains backward compatibility"
test "async_database handles system interactions"
```

#### 3. **State Management Tests**
```zig
test "async_database state transitions work correctly"
test "async_database handles concurrent state access"
test "async_database maintains state consistency"
test "async_database reverts state on failure"
```

#### 4. **Performance Tests**
```zig
test "async_database performance with realistic workloads"
test "async_database memory efficiency and allocation patterns"
test "async_database scalability under high load"
test "async_database benchmark against baseline implementation"
```

#### 5. **Error Handling Tests**
```zig
test "async_database error propagation works correctly"
test "async_database proper error types returned"
test "async_database handles resource exhaustion gracefully"
test "async_database recovery from failure states"
```

#### 6. **Concurrency Tests** (for async/multi-threaded features)
```zig
test "async_database thread safety verification"
test "async_database async operation correctness"
test "async_database handles race conditions properly"
test "async_database deadlock prevention"
```

#### 7. **Transaction Tests**
```zig
test "async_database maintains EVM specification compliance"
test "async_database transaction isolation correctness"
test "async_database batch operation efficiency"
test "async_database connection pooling behavior"
```

### Test Development Priority
1. **Start with core async interface tests** - Ensures basic async operations work
2. **Add transaction management tests** - Verifies ACID properties and rollback
3. **Implement connection pooling tests** - Critical for resource management
4. **Add performance benchmarks** - Ensures production readiness
5. **Test concurrency and race conditions** - Robust async operation
6. **Add integration tests** - System-level correctness verification

### Test Data Sources
- **EVM specification requirements**: State operation compliance
- **Reference implementation behavior**: Database interaction patterns
- **Performance benchmarks**: Async operation throughput and latency
- **Real-world scenarios**: Transaction batching and state access patterns
- **Edge case generation**: Boundary testing for connection limits and timeouts

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public APIs
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify memory safety and leak detection

### Test-First Examples

**Before writing any implementation:**
```zig
test "async_database basic functionality" {
    // This test MUST fail initially
    const context = test_utils.createTestContext();
    var async_db = AsyncStateInterface.init(context.allocator);
    
    const result = try async_db.get_account_async(test_address);
    try testing.expect(result.is_pending());
}
```

**Only then implement:**
```zig
pub const AsyncStateInterface = struct {
    pub fn get_account_async(self: *AsyncStateInterface, address: Address) !AsyncResult(Account) {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test async correctness thoroughly** - Architecture changes affect whole EVM execution
- **Verify transaction isolation** - Especially important for concurrent database access
- **Test performance implications** - Ensure async optimizations don't break correctness
- **Validate connection management** - Critical for resource cleanup and pooling

## References

- [Async/Await Patterns](https://en.wikipedia.org/wiki/Async/await) - Asynchronous programming concepts
- [Connection Pooling](https://en.wikipedia.org/wiki/Connection_pool) - Database connection management
- [ACID Properties](https://en.wikipedia.org/wiki/ACID) - Database transaction properties
- [Futures and Promises](https://en.wikipedia.org/wiki/Futures_and_promises) - Async programming primitives
- [Database Sharding](https://en.wikipedia.org/wiki/Shard_(database_architecture)) - Scaling database operations

## EVMONE Context

An analysis of `evmone` reveals a clear separation between the EVM core and the host environment, which is responsible for state access. This is primarily managed through the `evmc::HostInterface`. The following snippets are selected to illustrate this architectural separation, the data structures used, and the state management patterns that would be most relevant when implementing asynchronous database support.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/include/evmc/evmc.h">
```cpp
/**
 * The EVMC Host interface.
 *
 * The set of all callback functions that an EVM implementation may need to
 * call in the Host implementation.
 *
 * @see evmc_execute_fn().
 */
struct evmc_host_interface
{
    /**
     * The account existence check callback function.
     *
     * @param context  The pointer to the Host execution context.
     * @param address  The address of the account to be checked.
     * @return         true if the account exists, false otherwise.
     */
    bool (*account_exists)(struct evmc_host_context* context, const evmc_address* address);

    /**
     * The get storage callback function.
     *
     * @param context  The pointer to the Host execution context.
     * @param address  The address of the account.
     * @param key      The 32-bytes key of the storage entry.
     * @return         The 32-bytes value of the storage entry.
     *                 If the storage entry does not exist, a zeroed value is returned.
     */
    evmc_bytes32 (*get_storage)(struct evmc_host_context* context, const evmc_address* address,
                                const evmc_bytes32* key);

    /**
     * The set storage callback function.
     *
     * @param context  The pointer to the Host execution context.
     * @param address  The address of the account.
     * @param key      The 32-bytes key of the storage entry.
     * @param value    The 32-bytes value to be stored.
     * @return         The storage status. See ::evmc_storage_status for details.
     */
    enum evmc_storage_status (*set_storage)(struct evmc_host_context* context,
                                            const evmc_address* address, const evmc_bytes32* key,
                                            const evmc_bytes32* value);

    /**
     * The get balance callback function.
     *
     * @param context  The pointer to the Host execution context.
     * @param address  The address of the account.
     * @return         The account balance.
     */
    evmc_uint256be (*get_balance)(struct evmc_host_context* context, const evmc_address* address);

    /**
     * The get code size callback function.
     *
     * @param context  The pointer to the Host execution context.
     * @param address  The address of the account.
     * @return         The size of the code of the account.
     */
    size_t (*get_code_size)(struct evmc_host_context* context, const evmc_address* address);

    /**
     * The get code hash callback function.
     *
     * @param context  The pointer to the Host execution context.
     * @param address  The address of the account.
     * @return         The hash of the code of the account.
     *                 If the account does not exist or is empty, a zeroed value is returned.
     */
    evmc_bytes32 (*get_code_hash)(struct evmc_host_context* context, const evmc_address* address);

    /**
     * The copy code callback function.
     *
     * @param context       The pointer to the Host execution context.
     * @param address       The address of the account.
     * @param code_offset   The offset in the code to start copying from.
     * @param buffer_data   The pointer to the buffer to copy the code to.
     * @param buffer_size   The size of the buffer.
     * @return              The number of bytes copied.
     */
    size_t (*copy_code)(struct evmc_host_context* context, const evmc_address* address,
                        size_t code_offset, uint8_t* buffer_data, size_t buffer_size);
    /* ... other host functions like selfdestruct, call, get_tx_context, get_block_hash, emit_log ... */

    /**
     * The access account callback function.
     *
     * @param context  The pointer to the Host execution context.
     * @param address  The address of the account to be accessed.
     * @return         The access status. See ::evmc_access_status for details.
     */
    enum evmc_access_status (*access_account)(struct evmc_host_context* context,
                                              const evmc_address* address);

    /**
     * The access storage callback function.
     *
     * @param context  The pointer to the Host execution context.
     * @param address  The address of the account.
     * @param key      The 32-bytes key of the storage entry.
     * @return         The access status. See ::evmc_access_status for details.
     */
    enum evmc_access_status (*access_storage)(struct evmc_host_context* context,
                                              const evmc_address* address,
                                              const evmc_bytes32* key);
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
/// Generic execution state for generic instructions implementations.
class ExecutionState
{
public:
    int64_t gas_refund = 0;
    Memory memory;
    const evmc_message* msg = nullptr;
    evmc::HostContext host;
    evmc_revision rev = {};
    bytes return_data;
    bytes_view original_code;

    evmc_status_code status = EVMC_SUCCESS;
    size_t output_offset = 0;
    size_t output_size = 0;

    // ...

    /// Resets the contents of the ExecutionState so that it could be reused.
    void reset(const evmc_message& message, evmc_revision revision,
        const evmc_host_interface& host_interface, evmc_host_context* host_ctx,
        bytes_view _code) noexcept
    {
        gas_refund = 0;
        memory.clear();
        msg = &message;
        host = {host_interface, host_ctx};
        rev = revision;
        return_data.clear();
        original_code = _code;
        status = EVMC_SUCCESS;
        output_offset = 0;
        output_size = 0;
        // ...
    }

    const evmc_tx_context& get_tx_context() noexcept;
    // ...
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_storage.cpp">
```cpp
Result sload(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    auto& x = stack.top();
    const auto key = intx::be::store<evmc::bytes32>(x);

    if (state.rev >= EVMC_BERLIN &&
        state.host.access_storage(state.msg->recipient, key) == EVMC_ACCESS_COLD)
    {
        // ... gas calculation ...
        if ((gas_left -= additional_cold_sload_cost) < 0)
            return {EVMC_OUT_OF_GAS, gas_left};
    }

    x = intx::be::load<uint256>(state.host.get_storage(state.msg->recipient, key));

    return {EVMC_SUCCESS, gas_left};
}

Result sstore(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    if (state.in_static_mode())
        return {EVMC_STATIC_MODE_VIOLATION, gas_left};

    if (state.rev >= EVMC_ISTANBUL && gas_left <= 2300)
        return {EVMC_OUT_OF_GAS, gas_left};

    const auto key = intx::be::store<evmc::bytes32>(stack.pop());
    const auto value = intx::be::store<evmc::bytes32>(stack.pop());

    // ... gas calculation based on warm/cold access ...

    const auto status = state.host.set_storage(state.msg->recipient, key, value);

    const auto [gas_cost_warm, gas_refund] = sstore_costs[state.rev][status];
    const auto gas_cost = gas_cost_warm + gas_cost_cold;
    if ((gas_left -= gas_cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};
    state.gas_refund += gas_refund;
    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/state.hpp">
```cpp
/// The representation of the account storage value.
struct StorageValue
{
    /// The current value.
    bytes32 current;

    /// The original value.
    bytes32 original;

    evmc_access_status access_status = EVMC_ACCESS_COLD;
};

/// The state account.
struct Account
{
    // ...
    uint64_t nonce = 0;
    intx::uint256 balance;
    bytes32 code_hash = EMPTY_CODE_HASH;
    std::unordered_map<bytes32, StorageValue> storage;
    bytes code;
    // ...
};

/// The Ethereum State: the collection of accounts mapped by their addresses.
class State
{
    // ...
    const StateView& m_initial;
    std::unordered_map<address, Account> m_modified;
    std::vector<JournalEntry> m_journal;

public:
    // ...
    [[nodiscard]] size_t checkpoint() const noexcept { return m_journal.size(); }
    void rollback(size_t checkpoint);
    // ...
};

/// Executes a valid transaction.
TransactionReceipt transition(const StateView& state, const BlockInfo& block,
    const BlockHashes& block_hashes, const Transaction& tx, evmc_revision rev, evmc::VM& vm,
    const TransactionProperties& tx_props);
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/host.hpp">
```cpp
class Host : public evmc::Host
{
    evmc_revision m_rev;
    evmc::VM& m_vm;
    State& m_state;
    const BlockInfo& m_block;
    const BlockHashes& m_block_hashes;
    const Transaction& m_tx;
    std::vector<Log> m_logs;
    // ...

public:
    Host(evmc_revision rev, evmc::VM& vm, State& state, const BlockInfo& block,
        const BlockHashes& block_hashes, const Transaction& tx) noexcept;

    evmc::Result call(const evmc_message& msg) noexcept override;

private:
    bool account_exists(const address& addr) const noexcept override;
    bytes32 get_storage(const address& addr, const bytes32& key) const noexcept override;
    evmc_storage_status set_storage(const address& addr, const bytes32& key, const bytes32& value) noexcept override;
    uint256be get_balance(const address& addr) const noexcept override;
    size_t get_code_size(const address& addr) const noexcept override;
    bytes32 get_code_hash(const address& addr) const noexcept override;
    size_t copy_code(const address& addr, size_t code_offset, uint8_t* buffer_data, size_t buffer_size) const noexcept override;
    // ...
};
```
</file>
</evmone>

## Prompt Corrections

The original prompt provides a robust starting point for an asynchronous database interface in Zig. However, there are a few architectural points worth refining based on common async patterns:

1.  **Synchronization in `ConnectionPool`**: The provided `ConnectionPool` uses `std.Thread.Mutex` and `std.Thread.Condition`. While correct for multi-threaded synchronous code, these primitives will **block the OS thread**, which is highly undesirable in an async environment as it defeats the purpose of non-blocking I/O. For a truly async implementation, the `ConnectionPool` should use async-aware synchronization primitives, such as an async mutex or a channel/queue, to avoid blocking the event loop while waiting for a connection.

2.  **`await` Implementation**: The `await` function in `AsyncResult` uses a busy-wait loop (`std.time.sleep`). This is noted as a placeholder, but it's a critical point. In a real Zig async application, this would need to integrate with an event loop (like the one in `std.io`) to `suspend` the current frame and `resume` it when the future is complete, allowing other tasks to run in the meantime.

3.  **Batch Operations Interface**: The `batch_get_storage_async` function returns `AsyncResult([]const U256)`. This implies that the caller receives a single future for the entire batch. This is a good approach. It's important that the implementation of this function on the backend is truly a single batch query to the database (e.g., using `UNNEST` in PostgreSQL or `MGET` in Redis) rather than iterating and making individual async calls, which would be less efficient.

The overall architecture using a v-table for the `AsyncStateInterface` is a solid, idiomatic Zig pattern for this kind of abstraction. The inspiration from `evmone`'s `evmc::HostInterface` confirms that separating the state access logic from the EVM core is a proven and effective design.



## REVM Context

An analysis of the `revm` codebase shows a robust and layered approach to state management, which will be highly relevant for implementing async database support. The most pertinent concepts are the `Database` trait for abstracting state access, its asynchronous counterpart `DatabaseAsync`, and the `Journal` for managing state changes and reverts.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/interface/src/lib.rs">
```rust
//! # revm-primitives
//!
//! EVM primitive types.

// ... (imports)

/// Database error marker is needed to implement From conversion for Error type.
pub trait DBErrorMarker {}

/// Implement marker for `()`.
impl DBErrorMarker for () {}
impl DBErrorMarker for Infallible {}
impl DBErrorMarker for String {}

/// EVM database interface.
#[auto_impl(&mut, Box)]
pub trait Database {
    /// The database error type.
    type Error: DBErrorMarker + Error;

    /// Gets basic account information.
    fn basic(&mut self, address: Address) -> Result<Option<AccountInfo>, Self::Error>;

    /// Gets account code by its hash.
    fn code_by_hash(&mut self, code_hash: B256) -> Result<Bytecode, Self::Error>;

    /// Gets storage value of address at index.
    fn storage(&mut self, address: Address, index: StorageKey)
        -> Result<StorageValue, Self::Error>;

    /// Gets block hash by block number.
    fn block_hash(&mut self, number: u64) -> Result<B256, Self::Error>;
}

/// EVM database commit interface.
#[auto_impl(&mut, Box)]
pub trait DatabaseCommit {
    /// Commit changes to the database.
    fn commit(&mut self, changes: HashMap<Address, Account>);
}

/// EVM database interface.
///
/// Contains the same methods as [`Database`], but with `&self` receivers instead of `&mut self`.
///
/// Use [`WrapDatabaseRef`] to provide [`Database`] implementation for a type
/// that only implements this trait.
#[auto_impl(&, &mut, Box, Rc, Arc)]
pub trait DatabaseRef {
    /// The database error type.
    type Error: DBErrorMarker + Error;

    /// Gets basic account information.
    fn basic_ref(&self, address: Address) -> Result<Option<AccountInfo>, Self::Error>;

    /// Gets account code by its hash.
    fn code_by_hash_ref(&self, code_hash: B256) -> Result<Bytecode, Self::Error>;

    /// Gets storage value of address at index.
    fn storage_ref(&self, address: Address, index: StorageKey)
        -> Result<StorageValue, Self::Error>;

    /// Gets block hash by block number.
    fn block_hash_ref(&self, number: u64) -> Result<B256, Self::Error>;
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/interface/src/async_db.rs">
```rust
use core::future::Future;

use crate::{DBErrorMarker, Database, DatabaseRef};
use core::error::Error;
use primitives::{Address, StorageKey, StorageValue, B256};
use state::{AccountInfo, Bytecode};
use tokio::runtime::{Handle, Runtime};

/// The async EVM database interface
///
/// Contains the same methods as [Database], but it returns [Future] type instead.
///
/// Use [WrapDatabaseAsync] to provide [Database] implementation for a type that only implements this trait.
pub trait DatabaseAsync {
    /// The database error type
    type Error: Send + DBErrorMarker + Error;

    /// Gets basic account information.
    fn basic_async(
        &mut self,
        address: Address,
    ) -> impl Future<Output = Result<Option<AccountInfo>, Self::Error>> + Send;

    /// Gets account code by its hash.
    fn code_by_hash_async(
        &mut self,
        code_hash: B256,
    ) -> impl Future<Output = Result<Bytecode, Self::Error>> + Send;

    /// Gets storage value of address at index.
    fn storage_async(
        &mut self,
        address: Address,
        index: StorageKey,
    ) -> impl Future<Output = Result<StorageValue, Self::Error>> + Send;

    /// Gets block hash by block number.
    fn block_hash_async(
        &mut self,
        number: u64,
    ) -> impl Future<Output = Result<B256, Self::Error>> + Send;
}

/// The async EVM database interface
///
/// Contains the same methods as [DatabaseRef], but it returns [Future] type instead.
///
/// Use [WrapDatabaseAsync] to provide [DatabaseRef] implementation for a type that only implements this trait.
pub trait DatabaseAsyncRef {
    /// The database error type
    type Error: Send + DBErrorMarker + Error;

    /// Gets basic account information.
    fn basic_async_ref(
        &self,
        address: Address,
    ) -> impl Future<Output = Result<Option<AccountInfo>, Self::Error>> + Send;

    /// Gets account code by its hash.
    fn code_by_hash_async_ref(
        &self,
        code_hash: B256,
    ) -> impl Future<Output = Result<Bytecode, Self::Error>> + Send;

    /// Gets storage value of address at index.
    fn storage_async_ref(
        &self,
        address: Address,
        index: StorageKey,
    ) -> impl Future<Output = Result<StorageValue, Self::Error>> + Send;

    /// Gets block hash by block number.
    fn block_hash_async_ref(
        &self,
        number: u64,
    ) -> impl Future<Output = Result<B256, Self::Error>> + Send;
}

/// Wraps a [DatabaseAsync] or [DatabaseAsyncRef] to provide a [`Database`] implementation.
#[derive(Debug)]
pub struct WrapDatabaseAsync<T> {
    db: T,
    rt: HandleOrRuntime,
}

impl<T: DatabaseAsync> Database for WrapDatabaseAsync<T> {
    type Error = T::Error;

    #[inline]
    fn basic(&mut self, address: Address) -> Result<Option<AccountInfo>, Self::Error> {
        self.rt.block_on(self.db.basic_async(address))
    }

    #[inline]
    fn code_by_hash(&mut self, code_hash: B256) -> Result<Bytecode, Self::Error> {
        self.rt.block_on(self.db.code_by_hash_async(code_hash))
    }

    #[inline]
    fn storage(
        &mut self,
        address: Address,
        index: StorageKey,
    ) -> Result<StorageValue, Self::Error> {
        self.rt.block_on(self.db.storage_async(address, index))
    }

    #[inline]
    fn block_hash(&mut self, number: u64) -> Result<B256, Self::Error> {
        self.rt.block_on(self.db.block_hash_async(number))
    }
}

// ... implementation details for HandleOrRuntime ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/host.rs">
```rust
// ... (imports)

/// Host trait with all methods that are needed by the Interpreter.
///
/// This trait is implemented for all types that have `ContextTr` trait.
///
/// There are few groups of functions which are Block, Transaction, Config, Database and Journal functions.
pub trait Host {
    /* Block */

    /// Block basefee, calls ContextTr::block().basefee()
    fn basefee(&self) -> U256;
    /// Block blob gasprice, calls `ContextTr::block().blob_gasprice()`
    fn blob_gasprice(&self) -> U256;
    // ... (other block methods)

    /* Transaction */

    /// Transaction effective gas price, calls `ContextTr::tx().effective_gas_price(basefee as u128)`
    fn effective_gas_price(&self) -> U256;
    /// Transaction caller, calls `ContextTr::tx().caller()`
    fn caller(&self) -> Address;
    // ... (other transaction methods)
    
    /* Database */

    /// Block hash, calls `ContextTr::journal().db().block_hash(number)`
    fn block_hash(&mut self, number: u64) -> Option<B256>;

    /* Journal */

    /// Selfdestruct account, calls `ContextTr::journal().selfdestruct(address, target)`
    fn selfdestruct(
        &mut self,
        address: Address,
        target: Address,
    ) -> Option<StateLoad<SelfDestructResult>>;

    /// Log, calls `ContextTr::journal().log(log)`
    fn log(&mut self, log: Log);
    /// Sstore, calls `ContextTr::journal().sstore(address, key, value)`
    fn sstore(
        &mut self,
        address: Address,
        key: StorageKey,
        value: StorageValue,
    ) -> Option<StateLoad<SStoreResult>>;

    /// Sload, calls `ContextTr::journal().sload(address, key)`
    fn sload(&mut self, address: Address, key: StorageKey) -> Option<StateLoad<StorageValue>>;
    /// Tstore, calls `ContextTr::journal().tstore(address, key, value)`
    fn tstore(&mut self, address: Address, key: StorageKey, value: StorageValue);
    /// Tload, calls `ContextTr::journal().tload(address, key)`
    fn tload(&mut self, address: Address, key: StorageKey) -> StorageValue;
    /// Balance, calls `ContextTr::journal().load_account(address)`
    fn balance(&mut self, address: Address) -> Option<StateLoad<U256>>;
    /// Load account delegated, calls `ContextTr::journal().load_account_delegated(address)`
    fn load_account_delegated(&mut self, address: Address) -> Option<StateLoad<AccountLoad>>;
    /// Load account code, calls `ContextTr::journal().load_account_code(address)`
    fn load_account_code(&mut self, address: Address) -> Option<StateLoad<Bytes>>;
    /// Load account code hash, calls `ContextTr::journal().code_hash(address)`
    fn load_account_code_hash(&mut self, address: Address) -> Option<StateLoad<B256>>;
}

// ... (Host implementation for ContextTr)
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/interface/src/journaled_state.rs">
```rust
// ... (imports)

/// Trait that contains database and journal of all changes that were made to the state.
pub trait JournalTr {
    type Database: Database;
    type State;

    // ... (other methods)

    /// Creates a checkpoint of the current state. State can be revert to this point
    /// if needed.
    fn checkpoint(&mut self) -> JournalCheckpoint;

    /// Commits the changes made since the last checkpoint.
    fn checkpoint_commit(&mut self);

    /// Reverts the changes made since the last checkpoint.
    fn checkpoint_revert(&mut self, checkpoint: JournalCheckpoint);

    /// Creates a checkpoint of the account creation.
    fn create_account_checkpoint(
        &mut self,
        caller: Address,
        address: Address,
        balance: U256,
        spec_id: SpecId,
    ) -> Result<JournalCheckpoint, TransferError>;
    
    /// Commit current transaction journal and returns transaction logs.
    fn commit_tx(&mut self);

    /// Discard current transaction journal by removing journal entries and logs and incrementing the transaction id.
    ///
    /// This function is useful to discard intermediate state that is interrupted by error and it will not revert
    /// any already committed changes and it is safe to call it multiple times.
    fn discard_tx(&mut self);

    /// Clear current journal resetting it to initial state and return changes state.
    fn finalize(&mut self) -> Self::State;
}

/// SubRoutine checkpoint that will help us to go back from this
#[derive(Debug, Copy, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct JournalCheckpoint {
    pub log_i: usize,
    pub journal_i: usize,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/src/in_memory_db.rs">
```rust
use core::convert::Infallible;
use database_interface::{Database, DatabaseCommit, DatabaseRef, EmptyDB};
use primitives::{
    address, hash_map::Entry, Address, HashMap, Log, StorageKey, StorageValue, B256, KECCAK_EMPTY,
    U256,
};
use state::{Account, AccountInfo, Bytecode};
use std::vec::Vec;

/// A [Database] implementation that stores all state changes in memory.
pub type InMemoryDB = CacheDB<EmptyDB>;

/// A cache used in [CacheDB]. Its kept separate so it can be used independently.
///
/// Accounts and code are stored in two separate maps, the `accounts` map maps addresses to [DbAccount],
/// whereas contracts are identified by their code hash, and are stored in the `contracts` map.
/// The [DbAccount] holds the code hash of the contract, which is used to look up the contract in the `contracts` map.
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Cache {
    /// Account info where None means it is not existing. Not existing state is needed for Pre TANGERINE forks.
    /// `code` is always `None`, and bytecode can be found in `contracts`.
    pub accounts: HashMap<Address, DbAccount>,
    /// Tracks all contracts by their code hash.
    pub contracts: HashMap<B256, Bytecode>,
    /// All logs that were committed via [DatabaseCommit::commit].
    pub logs: Vec<Log>,
    /// All cached block hashes from the [DatabaseRef].
    pub block_hashes: HashMap<U256, B256>,
}

/// A [Database] implementation that stores all state changes in memory.
///
/// This implementation wraps a [DatabaseRef] that is used to load data ([AccountInfo]).
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CacheDB<ExtDB> {
    /// The cache that stores all state changes.
    pub cache: Cache,
    /// The underlying database ([DatabaseRef]) that is used to load data.
    ///
    /// Note: This is read-only, data is never written to this database.
    pub db: ExtDB,
}

// ... (CacheDB implementation)

impl<ExtDB: DatabaseRef> Database for CacheDB<ExtDB> {
    type Error = ExtDB::Error;

    fn basic(&mut self, address: Address) -> Result<Option<AccountInfo>, Self::Error> {
        let basic = match self.cache.accounts.entry(address) {
            Entry::Occupied(entry) => entry.into_mut(),
            Entry::Vacant(entry) => entry.insert(
                self.db
                    .basic_ref(address)?
                    .map(|info| DbAccount {
                        info,
                        ..Default::default()
                    })
                    .unwrap_or_else(DbAccount::new_not_existing),
            ),
        };
        Ok(basic.info())
    }

    fn code_by_hash(&mut self, code_hash: B256) -> Result<Bytecode, Self::Error> {
        match self.cache.contracts.entry(code_hash) {
            Entry::Occupied(entry) => Ok(entry.get().clone()),
            Entry::Vacant(entry) => {
                // If you return code bytes when basic fn is called this function is not needed.
                Ok(entry.insert(self.db.code_by_hash_ref(code_hash)?).clone())
            }
        }
    }

    /// Get the value in an account's storage slot.
    ///
    /// It is assumed that account is already loaded.
    fn storage(
        &mut self,
        address: Address,
        index: StorageKey,
    ) -> Result<StorageValue, Self::Error> {
        match self.cache.accounts.entry(address) {
            Entry::Occupied(mut acc_entry) => {
                let acc_entry = acc_entry.get_mut();
                match acc_entry.storage.entry(index) {
                    Entry::Occupied(entry) => Ok(*entry.get()),
                    Entry::Vacant(entry) => {
                        if matches!(
                            acc_entry.account_state,
                            AccountState::StorageCleared | AccountState::NotExisting
                        ) {
                            Ok(StorageValue::ZERO)
                        } else {
                            let slot = self.db.storage_ref(address, index)?;
                            entry.insert(slot);
                            Ok(slot)
                        }
                    }
                }
            }
            Entry::Vacant(acc_entry) => {
                // Acc needs to be loaded for us to access slots.
                let info = self.db.basic_ref(address)?;
                let (account, value) = if info.is_some() {
                    let value = self.db.storage_ref(address, index)?;
                    let mut account: DbAccount = info.into();
                    account.storage.insert(index, value);
                    (account, value)
                } else {
                    (info.into(), StorageValue::ZERO)
                };
                acc_entry.insert(account);
                Ok(value)
            }
        }
    }

    fn block_hash(&mut self, number: u64) -> Result<B256, Self::Error> {
        match self.cache.block_hashes.entry(U256::from(number)) {
            Entry::Occupied(entry) => Ok(*entry.get()),
            Entry::Vacant(entry) => {
                let hash = self.db.block_hash_ref(number)?;
                entry.insert(hash);
                Ok(hash)
            }
        }
    }
}
```
</file>
</revm>



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/state.py">
```python
@dataclass
class State:
    """
    Contains all information that is preserved between transactions.
    """

    _main_trie: Trie[Address, Optional[Account]] = field(
        default_factory=lambda: Trie(secured=True, default=None)
    )
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(
        default_factory=dict
    )
    _snapshots: List[
        Tuple[
            Trie[Address, Optional[Account]],
            Dict[Address, Trie[Bytes32, U256]],
        ]
    ] = field(default_factory=list)
    created_accounts: Set[Address] = field(default_factory=set)


@dataclass
class TransientStorage:
    """
    Contains all information that is preserved between message calls
    within a transaction.
    """

    _tries: Dict[Address, Trie[Bytes32, U256]] = field(default_factory=dict)
    _snapshots: List[Dict[Address, Trie[Bytes32, U256]]] = field(
        default_factory=list
    )


def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Start a state transaction.

    Transactions are entirely implicit and can be nested. It is not possible to
    calculate the state root during a transaction.

    Parameters
    ----------
    state : State
        The state.
    transient_storage : TransientStorage
        The transient storage of the transaction.
    """
    state._snapshots.append(
        (
            copy_trie(state._main_trie),
            {k: copy_trie(t) for (k, t) in state._storage_tries.items()},
        )
    )
    transient_storage._snapshots.append(
        {k: copy_trie(t) for (k, t) in transient_storage._tries.items()}
    )


def commit_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Commit a state transaction.

    Parameters
    ----------
    state : State
        The state.
    transient_storage : TransientStorage
        The transient storage of the transaction.
    """
    state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

    transient_storage._snapshots.pop()


def rollback_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Rollback a state transaction, resetting the state to the point when the
    corresponding `start_transaction()` call was made.

    Parameters
    ----------
    state : State
        The state.
    transient_storage : TransientStorage
        The transient storage of the transaction.
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

    transient_storage._tries = transient_storage._snapshots.pop()


def get_account(state: State, address: Address) -> Account:
    """
    Get the `Account` object at an address. Returns `EMPTY_ACCOUNT` if there
    is no account at the address.

    Use `get_account_optional()` if you care about the difference between a
    non-existent account and `EMPTY_ACCOUNT`.

    Parameters
    ----------
    state: `State`
        The state
    address : `Address`
        Address to lookup.

    Returns
    -------
    account : `Account`
        Account at address.
    """
    account = get_account_optional(state, address)
    if isinstance(account, Account):
        return account
    else:
        return EMPTY_ACCOUNT

def set_account(
    state: State, address: Address, account: Optional[Account]
) -> None:
    """
    Set the `Account` object at an address. Setting to `None` deletes
    the account (but not its storage, see `destroy_account()`).

    Parameters
    ----------
    state: `State`
        The state
    address : `Address`
        Address to set.
    account : `Account`
        Account to set at address.
    """
    trie_set(state._main_trie, address, account)


def get_storage(state: State, address: Address, key: Bytes32) -> U256:
    """
    Get a value at a storage key on an account. Returns `U256(0)` if the
    storage key has not been set previously.

    Parameters
    ----------
    state: `State`
        The state
    address : `Address`
        Address of the account.
    key : `Bytes`
        Key to lookup.

    Returns
    -------
    value : `U256`
        Value at the key.
    """
    trie = state._storage_tries.get(address)
    if trie is None:
        return U256(0)

    value = trie_get(trie, key)

    assert isinstance(value, U256)
    return value


def set_storage(
    state: State, address: Address, key: Bytes32, value: U256
) -> None:
    """
    Set a value at a storage key on an account. Setting to `U256(0)` deletes
    the key.

    Parameters
    ----------
    state: `State`
        The state
    address : `Address`
        Address of the account.
    key : `Bytes`
        Key to set.
    value : `U256`
        Value to set at the key.
    """
    assert trie_get(state._main_trie, address) is not None

    trie = state._storage_tries.get(address)
    if trie is None:
        trie = Trie(secured=True, default=U256(0))
        state._storage_tries[address] = trie
    trie_set(trie, key, value)
    if trie._data == {}:
        del state._storage_tries[address]


def get_transient_storage(
    transient_storage: TransientStorage, address: Address, key: Bytes32
) -> U256:
    """
    Get a value at a storage key on an account from transient storage.
    Returns `U256(0)` if the storage key has not been set previously.
    Parameters
    ----------
    transient_storage: `TransientStorage`
        The transient storage
    address : `Address`
        Address of the account.
    key : `Bytes`
        Key to lookup.
    Returns
    -------
    value : `U256`
        Value at the key.
    """
    trie = transient_storage._tries.get(address)
    if trie is None:
        return U256(0)

    value = trie_get(trie, key)

    assert isinstance(value, U256)
    return value


def set_transient_storage(
    transient_storage: TransientStorage,
    address: Address,
    key: Bytes32,
    value: U256,
) -> None:
    """
    Set a value at a storage key on an account. Setting to `U256(0)` deletes
    the key.
    Parameters
    ----------
    transient_storage: `TransientStorage`
        The transient storage
    address : `Address`
        Address of the account.
    key : `Bytes`
        Key to set.
    value : `U256`
        Value to set at the key.
    """
    trie = transient_storage._tries.get(address)
    if trie is None:
        trie = Trie(secured=True, default=U256(0))
        transient_storage._tries[address] = trie
    trie_set(trie, key, value)
    if trie._data == {}:
        del transient_storage._tries[address]
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
```python
def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    output : `MessageCallOutput`
        Output of the message call
    """
    block_env = message.block_env
    refund_counter = U256(0)
    if message.target == Bytes0(b""):
        is_collision = account_has_code_or_nonce(
            block_env.state, message.current_target
        ) or account_has_storage(block_env.state, message.current_target)
        if is_collision:
            return MessageCallOutput(
                Uint(0), U256(0), tuple(), set(), set(), AddressCollision()
            )
        else:
            evm = process_create_message(message)
    else:
        evm = process_message(message)

    if evm.error:
        logs: Tuple[Log, ...] = ()
        accounts_to_delete = set()
    else:
        logs = evm.logs
        accounts_to_delete = evm.accounts_to_delete
        refund_counter += U256(evm.refund_counter)

    tx_end = TransactionEnd(
        int(message.gas) - int(evm.gas_left), evm.output, evm.error
    )
    evm_trace(evm, tx_end)

    return MessageCallOutput(
        gas_left=evm.gas_left,
        refund_counter=refund_counter,
        logs=logs,
        accounts_to_delete=accounts_to_delete,
        error=evm.error,
    )


def process_message(message: Message) -> Evm:
    """
    Move ether and execute the relevant code.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: :py:class:`~ethereum.cancun.vm.Evm`
        Items containing execution specific objects
    """
    state = message.block_env.state
    transient_storage = message.tx_env.transient_storage
    if message.depth > STACK_DEPTH_LIMIT:
        raise StackDepthLimitError("Stack depth limit reached")

    # take snapshot of state before processing the message
    begin_transaction(state, transient_storage)

    if message.should_transfer_value and message.value != 0:
        move_ether(
            state, message.caller, message.current_target, message.value
        )

    evm = execute_code(message)
    if evm.error:
        # revert state to the last saved checkpoint
        # since the message call resulted in an error
        rollback_transaction(state, transient_storage)
    else:
        commit_transaction(state, transient_storage)
    return evm

def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: `ethereum.vm.EVM`
        Items containing execution specific objects
    """
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        pc=Uint(0),
        stack=[],
        memory=bytearray(),
        code=code,
        gas_left=message.gas,
        valid_jump_destinations=valid_jump_destinations,
        logs=(),
        refund_counter=0,
        running=True,
        message=message,
        output=b"",
        accounts_to_delete=set(),
        return_data=b"",
        error=None,
        accessed_addresses=message.accessed_addresses,
        accessed_storage_keys=message.accessed_storage_keys,
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            evm_trace(evm, PrecompileStart(evm.message.code_address))
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            evm_trace(evm, PrecompileEnd())
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    except ExceptionalHalt as error:
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        evm_trace(evm, OpException(error))
        evm.error = error
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/storage.py">
```python
def sload(evm: Evm) -> None:
    """
    Loads to the stack, the value corresponding to a certain key from the
    storage of the current account.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()

    # GAS
    if (evm.message.current_target, key) in evm.accessed_storage_keys:
        charge_gas(evm, GAS_WARM_ACCESS)
    else:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        charge_gas(evm, GAS_COLD_SLOAD)

    # OPERATION
    value = get_storage(
        evm.message.block_env.state, evm.message.current_target, key
    )

    push(evm.stack, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def sstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's storage.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)
    if evm.gas_left <= GAS_CALL_STIPEND:
        raise OutOfGasError

    state = evm.message.block_env.state
    original_value = get_storage_original(
        state, evm.message.current_target, key
    )
    current_value = get_storage(state, evm.message.current_target, key)

    gas_cost = Uint(0)

    if (evm.message.current_target, key) not in evm.accessed_storage_keys:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        gas_cost += GAS_COLD_SLOAD

    if original_value == current_value and current_value != new_value:
        if original_value == 0:
            gas_cost += GAS_STORAGE_SET
        else:
            gas_cost += GAS_STORAGE_UPDATE - GAS_COLD_SLOAD
    else:
        gas_cost += GAS_WARM_ACCESS

    # Refund Counter Calculation
    if current_value != new_value:
        if original_value != 0 and current_value != 0 and new_value == 0:
            # Storage is cleared for the first time in the transaction
            evm.refund_counter += int(GAS_STORAGE_CLEAR_REFUND)

        if original_value != 0 and current_value == 0:
            # Gas refund issued earlier to be reversed
            evm.refund_counter -= int(GAS_STORAGE_CLEAR_REFUND)

        if original_value == new_value:
            # Storage slot being restored to its original value
            if original_value == 0:
                # Slot was originally empty and was SET earlier
                evm.refund_counter += int(GAS_STORAGE_SET - GAS_WARM_ACCESS)
            else:
                # Slot was originally non-empty and was UPDATED earlier
                evm.refund_counter += int(
                    GAS_STORAGE_UPDATE - GAS_COLD_SLOAD - GAS_WARM_ACCESS
                )

    charge_gas(evm, gas_cost)
    if evm.message.is_static:
        raise WriteInStaticContext
    set_storage(state, evm.message.current_target, key, new_value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def tload(evm: Evm) -> None:
    """
    Loads to the stack, the value corresponding to a certain key from the
    transient storage of the current account.
    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()

    # GAS
    charge_gas(evm, GAS_WARM_ACCESS)

    # OPERATION
    value = get_transient_storage(
        evm.message.tx_env.transient_storage, evm.message.current_target, key
    )
    push(evm.stack, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def tstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's transient storage.
    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_WARM_ACCESS)
    if evm.message.is_static:
        raise WriteInStaticContext
    set_transient_storage(
        evm.message.tx_env.transient_storage,
        evm.message.current_target,
        key,
        new_value,
    )

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/__init__.py">
```python
@dataclass
class Evm:
    """The internal state of the virtual machine."""

    pc: Uint
    stack: List[U256]
    memory: bytearray
    code: Bytes
    gas_left: Uint
    valid_jump_destinations: Set[Uint]
    logs: Tuple[Log, ...]
    refund_counter: int
    running: bool
    message: Message
    output: Bytes
    accounts_to_delete: Set[Address]
    return_data: Bytes
    error: Optional[EthereumException]
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
```
</file>
</execution-specs>
## Prompt Corrections
The original prompt is well-structured and provides a clear specification for the new async database feature. There are no direct errors. However, to better align the new Zig implementation with the existing `execution-specs` patterns, consider the following points:

1.  **Journaling vs. Explicit Transactions**: The provided `AsyncStateInterface` includes explicit transaction management functions (`begin_transaction_async`, `commit_transaction_async`, `rollback_transaction_async`). The current `execution-specs` implementation in `state.py` uses an implicit journaling system where `begin_transaction` and `rollback_transaction`/`commit_transaction` are called automatically at the start and end of message calls. The new implementation should decide whether to follow the explicit transaction model from the prompt or adapt the existing implicit journaling model from `state.py` to an async context. The `journal.zig` in the target codebase suggests an implicit model is already in use.

2.  **State Object**: The `AsyncStateBackend` in the prompt seems to be a self-contained state manager. The current implementation in `state.py` separates the state data (`State` class) from the functions that operate on it. The new async implementation could benefit from a similar separation, where the `Vm` holds an `EvmState` object that uses the `AsyncStateInterface` for its operations, rather than the `Vm` directly holding the `AsyncStateInterface`. This aligns better with the existing `vm.zig` which contains an `EvmState` field.

3.  **Error Handling**: The `AsyncError` enum is well-defined. Ensure that errors from the database layer are correctly mapped to `ExecutionError` types where appropriate (e.g., a database timeout could result in an `OutOfGas` error for the transaction) to maintain EVM-level correctness.

These are not corrections but rather architectural considerations to ensure the new feature integrates smoothly with the existing codebase's patterns. The provided prompt is excellent as a standalone specification.

---

An excellent and detailed prompt. Implementing async database support is a significant architectural change. The current `execution-specs` provide a synchronous, in-memory state model using Tries. The most relevant context will be how this state is managed, mutated, and snapshotted, as this is the logic that will need to be adapted to the new async interface.

Here are the most relevant code snippets to guide the implementation.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/state.py">
```python
"""
State
^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

The state contains all information that is preserved between transactions.

It consists of a main account trie and storage tries for each contract.
"""
from dataclasses import dataclass, field
from typing import Callable, Dict, Iterable, List, Optional, Set, Tuple

from ethereum_types.bytes import Bytes, Bytes32
from ethereum_types.frozen import modify
from ethereum_types.numeric import U256, Uint

from .fork_types import EMPTY_ACCOUNT, Account, Address, Root
from .trie import EMPTY_TRIE_ROOT, Trie, copy_trie, root, trie_get, trie_set


@dataclass
class State:
    """
    Contains all information that is preserved between transactions.
    """

    _main_trie: Trie[Address, Optional[Account]] = field(
        default_factory=lambda: Trie(secured=True, default=None)
    )
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(
        default_factory=dict
    )
    _snapshots: List[
        Tuple[
            Trie[Address, Optional[Account]],
            Dict[Address, Trie[Bytes32, U256]],
        ]
    ] = field(default_factory=list)
    created_accounts: Set[Address] = field(default_factory=set)

# ... (other functions) ...

def begin_transaction(state: State) -> None:
    """
    Start a state transaction.

    Transactions are entirely implicit and can be nested. It is not possible to
    calculate the state root during a transaction.

    Parameters
    ----------
    state : State
        The state.
    """
    state._snapshots.append(
        (
            copy_trie(state._main_trie),
            {k: copy_trie(t) for (k, t) in state._storage_tries.items()},
        )
    )


def commit_transaction(state: State) -> None:
    """
    Commit a state transaction.

    Parameters
    ----------
    state : State
        The state.
    """
    state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()


def rollback_transaction(state: State) -> None:
    """
    Rollback a state transaction, resetting the state to the point when the
    corresponding `start_transaction()` call was made.

    Parameters
    ----------
    state : State
        The state.
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()


def get_account(state: State, address: Address) -> Account:
    """
    Get the `Account` object at an address. Returns `EMPTY_ACCOUNT` if there
    is no account at the address.
    """
    account = get_account_optional(state, address)
    if isinstance(account, Account):
        return account
    else:
        return EMPTY_ACCOUNT

def set_account(
    state: State, address: Address, account: Optional[Account]
) -> None:
    """
    Set the `Account` object at an address. Setting to `None` deletes
    the account (but not its storage, see `destroy_account()`).
    """
    trie_set(state._main_trie, address, account)

def get_storage(state: State, address: Address, key: Bytes32) -> U256:
    """
    Get a value at a storage key on an account. Returns `U256(0)` if the
    storage key has not been set previously.
    """
    trie = state._storage_tries.get(address)
    if trie is None:
        return U256(0)

    value = trie_get(trie, key)

    assert isinstance(value, U256)
    return value


def set_storage(
    state: State, address: Address, key: Bytes32, value: U256
) -> None:
    """
    Set a value at a storage key on an account. Setting to `U256(0)` deletes
    the key.
    """
    assert trie_get(state._main_trie, address) is not None

    trie = state._storage_tries.get(address)
    if trie is None:
        trie = Trie(secured=True, default=U256(0))
        state._storage_tries[address] = trie
    trie_set(trie, key, value)
    if trie._data == {}:
        del state._storage_tries[address]

# ... (other helper functions) ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/fork_types.py">
```python
"""
Ethereum Types
^^^^^^^^^^^^^^
"""

from dataclasses import dataclass

from ethereum_rlp import rlp
from ethereum_types.bytes import Bytes, Bytes20, Bytes256
from ethereum_types.frozen import slotted_freezable
from ethereum_types.numeric import U256, Uint

from ..crypto.hash import Hash32, keccak256

Address = Bytes20
Root = Hash32

Bloom = Bytes256


@slotted_freezable
@dataclass
class Account:
    """
    State associated with an address.
    """

    nonce: Uint
    balance: U256
    code: Bytes


EMPTY_ACCOUNT = Account(
    nonce=Uint(0),
    balance=U256(0),
    code=bytearray(),
)


def encode_account(raw_account_data: Account, storage_root: Bytes) -> Bytes:
    """
    Encode `Account` dataclass.

    Storage is not stored in the `Account` dataclass, so `Accounts` cannot be
    encoded without providing a storage root.
    """
    return rlp.encode(
        (
            raw_account_data.nonce,
            raw_account_data.balance,
            storage_root,
            keccak256(raw_account_data.code),
        )
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
"""
Ethereum Virtual Machine (EVM) Interpreter
"""

# ... (imports) ...

def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.
    """
    # ...
    # This function shows how the EVM manages state transitions for calls.
    # The key insight is the snapshotting mechanism for reverts.
    # ...
    evm = process_message(message)
    # ...

def process_message(message: Message) -> Evm:
    """
    Move ether and execute the relevant code.
    """
    state = message.block_env.state
    if message.depth > STACK_DEPTH_LIMIT:
        raise StackDepthLimitError("Stack depth limit reached")

    # take snapshot of state before processing the message
    begin_transaction(state)

    touch_account(state, message.current_target)

    if message.should_transfer_value and message.value != 0:
        move_ether(
            state, message.caller, message.current_target, message.value
        )

    evm = execute_code(message)
    if evm.error:
        # revert state to the last saved checkpoint
        # since the message call resulted in an error
        rollback_transaction(state)
    else:
        commit_transaction(state)
    return evm

def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
    """
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        # ... (initialization) ...
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            # ... (precompile handling) ...
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            op_implementation[op](evm)

    except ExceptionalHalt as error:
        # ... (error handling) ...
    except Revert as error:
        # ... (error handling) ...
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/storage.py">
```python
"""
Ethereum Virtual Machine (EVM) Storage Instructions
"""
from ethereum_types.numeric import Uint

from ...state import get_storage, get_storage_original, set_storage
from .. import Evm
from ..exceptions import OutOfGasError, WriteInStaticContext
from ..gas import (
    GAS_CALL_STIPEND,
    GAS_COLD_SLOAD,
    GAS_STORAGE_CLEAR_REFUND,
    GAS_STORAGE_SET,
    GAS_STORAGE_UPDATE,
    GAS_WARM_ACCESS,
    charge_gas,
)
from ..stack import pop, push


def sload(evm: Evm) -> None:
    """
    Loads to the stack, the value corresponding to a certain key from the
    storage of the current account.
    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()

    # GAS
    if (evm.message.current_target, key) in evm.accessed_storage_keys:
        charge_gas(evm, GAS_WARM_ACCESS)
    else:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        charge_gas(evm, GAS_COLD_SLOAD)

    # OPERATION
    value = get_storage(
        evm.message.block_env.state, evm.message.current_target, key
    )

    push(evm.stack, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def sstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's storage.
    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)

    # ... (Gas calculation and other checks) ...

    # OPERATION
    charge_gas(evm, gas_cost)
    if evm.message.is_static:
        raise WriteInStaticContext
    set_storage(state, evm.message.current_target, key, new_value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
</execution-specs>

## Prompt Corrections
The provided prompt is exceptionally well-structured and detailed, outlining a clear architectural vision for async database support. There are no significant errors. However, here are some minor clarifications and suggestions for improvement based on the `execution-specs`:

1.  **`AsyncStateInterface` Transaction Naming**: The proposed methods `begin_transaction_async`, `commit_transaction_async`, and `rollback_transaction_async` are excellent. It's worth noting that the `execution-specs` achieve this with a `snapshot` mechanism (`begin_transaction`, `commit_transaction`, `rollback_transaction` in `state.py`). This suggests that the async implementation should manage state snapshots or database transactions, which aligns perfectly with the prompt's intent. The naming is clear and appropriate.

2.  **`AsyncResult` Implementation**: The `await` function in `AsyncResult` uses a simple busy-wait loop (`std.time.sleep`). This is correctly identified as a placeholder. In a real-world Zig implementation, this should be integrated with an event loop (like `std.event.Loop`) to yield control back to the scheduler instead of blocking the thread. The current structure is a good starting point for a more robust implementation.

3.  **Missing Operations in `AsyncStateInterface`**: The prompt's `AsyncStateInterface` covers the most critical operations. For completeness, consider adding:
    *   `account_exists_async`: A way to check for account existence without fetching the full account object, which can be more efficient.
    *   `get_code_hash_async`: To retrieve just the code hash, which is cheaper than getting the full code.

4.  **Error Handling in `AsyncStateBackend`**: In `get_account_async` and `get_storage_async`, the error handling for a failed `acquire_connection` immediately creates and returns a failed `AsyncResult`. This is a synchronous pattern. A true async implementation would likely involve returning a future that is immediately completed with an error, or making the `acquire_connection` function itself asynchronous. This is a minor implementation detail but important for achieving non-blocking behavior throughout.

Overall, the prompt is of very high quality and provides a solid foundation for the requested feature. The provided `execution-specs` context illustrates the synchronous patterns that need to be refactored into the new async architecture.



## GO-ETHEREUM Context

Excellent. This is a well-defined prompt for implementing a core, performance-critical feature. Building an async database layer requires careful consideration of state consistency, concurrency, and performance, all of which are central to go-ethereum's design.

The following context from go-ethereum will be highly relevant. It focuses on:
1.  **`StateDB` and `Database` Interfaces**: How Geth abstracts state and the underlying key-value store. This is the direct synchronous equivalent of your proposed `AsyncStateInterface` and `DatabaseBackend`.
2.  **`state.Journal`**: How Geth achieves atomicity and rollbacks for state transitions. This is critical for implementing your `begin/commit/rollback_transaction_async` functionality correctly.
3.  **`State Prefetcher`**: A real-world example of how Geth uses concurrency to parallelize state access for performance, directly applicable to your goal of non-blocking operations.
4.  **Metrics**: How Geth instruments its components. This pattern is useful for implementing your `ConnectionPool` monitoring.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interfaces.go">
```go
// StateDB is an EVM database for full state management.
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

	// Suicide marks the given account as suicided.
	// This should be irreversible. It's not slated for removal in EIP-6049, yet.
	Suicide(common.Address) bool
	HasSuicided(common.Address) bool

	// Exist reports whether the given account exists in state.
	// Notably this should also return true for suicided accounts.
	Exist(common.Address) bool
	// Empty returns whether the given account is empty. Empty
	// is defined according to EIP161 (balance = nonce = code = 0).
	Empty(common.Address) bool

	// setError is used to add error reporting to the StateDB.
	// setError is not supported by all StateDBs.
	SetError(error)
	Error() error

	// RevertToSnapshot reverts all state changes made since the given revision.
	RevertToSnapshot(int)
	Snapshot() int

	AddLog(*types.Log)
	GetLogs(hash common.Hash, blockNum uint64, blockHash common.Hash, blockTime uint64) []*types.Log
	Logs() []*types.Log

	// AddPreimage records a SHA3 preimage seen by the VM.
	AddPreimage(common.Hash, []byte)

	// AddAddressToAccessList adds the given address to the access list.
	// This is needed for EIP-2929.
	AddAddressToAccessList(addr common.Address)
	// AddSlotToAccessList adds the given (address, slot) to the access list.
	// This is needed for EIP-2929.
	AddSlotToAccessList(addr common.Address, slot common.Hash)
	// AddressInAccessList returns true if the given address is in the access list.
	AddressInAccessList(addr common.Address) bool
	// SlotInAccessList returns true if the given (address, slot) is in the access list.
	SlotInAccessList(addr common.Address, slot common.Hash) bool

	// AddBalanceWithReason is a variant of AddBalance which has a reason for the change.
	// This is used for tracing, to be able to reason about balance changes.
	AddBalanceWithReason(common.Address, *uint256.Int, tracing.BalanceChangeReason)
	// SubBalanceWithReason is a variant of SubBalance which has a reason for the change.
	// This is used for tracing, to be able to reason about balance changes.
	SubBalanceWithReason(common.Address, *uint256.Int, tracing.BalanceChangeReason)

	// SetNonceWithReason is a variant of SetNonce which has a reason for the change.
	// This is used for tracing, to be able to reason about nonce changes.
	SetNonceWithReason(common.Address, uint64, tracing.NonceChangeReason)

	// various getter methods used by tracer.
	GetCodeAndCodeHash(common.Address) ([]byte, common.Hash)
	GetTransientState(common.Address, common.Hash) common.Hash
	SetTransientState(common.Address, common.Hash, common.Hash)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/ethdb/database.go">
```go
// Database is a key-value database.
type Database interface {
	// NewBatch creates a write-only database that buffers changes to its host db
	// until a final write is called.
	NewBatch() Batch

	// NewBatchWithSize creates a write-only database that buffers changes to its host db
	// until a final write is called. The size hint indicates to the database the
	// expected size of the batch in bytes.
	NewBatchWithSize(size int) Batch

	// NewIterator creates a binary-alphabetical iterator over a subset
	// of database content with a particular key prefix, starting at a particular
	// point.
	NewIterator(prefix []byte, start []byte) Iterator

	// NewSnapshot creates a database snapshot based on the current state of the
	// database. The created snapshot is held from being garbage collected until the
	// Release method is called.
	NewSnapshot() (Snapshot, error)

	// Stat returns a particular internal metric from the database.
	Stat(property string) (string, error)

	// Compact flattens the underlying data store for the given key range. In essence,
	// deleted and overwritten versions are discarded, and the data is rearranged to
	// reduce the উদ্ধरण disk space and increase the query performance.
	Compact(start []byte, limit []byte) error

	// Path returns the path to the database directory.
	Path() string

	io.Closer
	KeyValueReader
	KeyValueWriter
}

// Batch is a write-only database that commits changes to its host database
// when Write is called. A batch cannot be used concurrently.
type Batch interface {
	KeyValueWriter

	// ValueSize retrieves the amount of data queued up for writing.
	ValueSize() int

	// Write flushes any accumulated data to the host database.
	Write() error

	// Reset resets the batch for reuse.
	Reset()

	// Replay replays the batch contents.
	Replay(w KeyValueWriter) error
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journalEntry is a modification to the state that can be reverted.
type journalEntry interface {
	// revert undoes the state change in the given state db.
	revert(*StateDB)

	// dirtied returns the address modified by this journal entry.
	dirtied() common.Address
}

// journal contains the list of state changes for the current execution context
// and is used to revert changes in case of execution failure.
type journal struct {
	entries  []journalEntry // Current changes tracked by the journal
	dirties  []common.Address
	postponA int
}

// Different journal entry types.
type (
	// Changes to the account balance.
	balanceChange struct {
		account *stateObject
		prev    *uint256.Int
		prevNeg bool
	}
	// Changes to the account nonce.
	nonceChange struct {
		account *stateObject
		prev    uint64
	}
	// Changes to the account code.
	codeChange struct {
		account            *stateObject
		prevCode, prevHash []byte
	}
	// Changes to the account storage.
	storageChange struct {
		account       *stateObject
		key, prevVal  common.Hash
		prevValExists bool
	}
	// Transient storage changes.
	transientStorageChange struct {
		account      *stateObject
		key, prevVal common.Hash
	}
	// Changes to the access list.
	addAddressToAccessListChange struct {
		address common.Address
	}
	addSlotToAccessListChange struct {
		address common.Address
		slot    common.Hash
	}
	// Changes to the refund counter.
	refundChange struct {
		prev uint64
	}
	// An account was touched by the EVM.
	touchChange struct {
		account  *stateObject
		prev     bool
		prevDest bool
	}
	// An account was suicided.
	suicideChange struct {
		account     *stateObject
		prev        bool // whether account had been suicided already
		prevBalance *uint256.Int
	}
	// Account creation.
	createObjectChange struct {
		account *stateObject
	}
	// Log creation.
	addLogChange struct {
		txhash common.Hash
	}
)

// revert removes the change from the journal and reverts the state db.
func (ch *journal) revert(statedb *StateDB, snapshot int) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(statedb.snapshots), func(i int) bool {
		return statedb.snapshots[i] >= snapshot
	})
	if idx == len(statedb.snapshots) || statedb.snapshots[idx] != snapshot {
		panic(fmt.Errorf("journal snapshot %d does not exist", snapshot))
	}
	// Replay the journal to specified snapshot.
	for i := len(ch.entries) - 1; i >= snapshot; i-- {
		// Undo the change and remove it from the journal
		ch.entries[i].revert(statedb)
		ch.entries[i] = nil // Discard for garbage collection
	}
	ch.entries = ch.entries[:snapshot]

	// Roll back the snapshot stack.
	statedb.snapshots = statedb.snapshots[:idx]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_prefetcher.go">
```go
// statePrefetcher is a basic Prefetcher that executes transactions from a block
// on top of the parent state, aiming to prefetch potentially useful state data
// from disk. Transactions are executed in parallel to fully leverage the
// SSD's read performance.
type statePrefetcher struct {
	config *params.ChainConfig // Chain configuration options
	chain  *HeaderChain        // Canonical block chain
}

// Prefetch processes the state changes according to the Ethereum rules by running
// the transaction messages using the statedb, but any changes are discarded. The
// only goal is to warm the state caches.
func (p *statePrefetcher) Prefetch(block *types.Block, statedb *state.StateDB, cfg vm.Config, interrupt *atomic.Bool) {
	var (
		fails   atomic.Int64
		header  = block.Header()
		signer  = types.MakeSigner(p.config, header.Number, header.Time)
		workers errgroup.Group
		reader  = statedb.Reader()
	)
	workers.SetLimit(runtime.NumCPU() / 2)

	// Iterate over and process the individual transactions
	for i, tx := range block.Transactions() {
		stateCpy := statedb.Copy() // closure
		workers.Go(func() error {
			// If block precaching was interrupted, abort
			if interrupt != nil && interrupt.Load() {
				return nil
			}
			// Preload the touched accounts and storage slots in advance
			sender, err := types.Sender(signer, tx)
			if err != nil {
				fails.Add(1)
				return nil
			}
			reader.Account(sender)

			if tx.To() != nil {
				account, _ := reader.Account(*tx.To())

				// Preload the contract code if the destination has non-empty code
				if account != nil && !bytes.Equal(account.CodeHash, types.EmptyCodeHash.Bytes()) {
					reader.Code(*tx.To(), common.BytesToHash(account.CodeHash))
				}
			}
			for _, list := range tx.AccessList() {
				reader.Account(list.Address)
				if len(list.StorageKeys) > 0 {
					for _, slot := range list.StorageKeys {
						reader.Storage(list.Address, slot)
					}
				}
			}
			// Execute the message to preload the implicit touched states
			evm := vm.NewEVM(NewEVMBlockContext(header, p.chain, nil), stateCpy, p.config, cfg)

			// Convert the transaction into an executable message and pre-cache its sender
			msg, err := TransactionToMessage(tx, signer, header.BaseFee)
			if err != nil {
				fails.Add(1)
				return nil // Also invalid block, bail out
			}
			// Disable the nonce check
			msg.SkipNonceChecks = true

			stateCpy.SetTxContext(tx.Hash(), i)

			// We attempt to apply a transaction. The goal is not to execute
			// the transaction successfully, rather to warm up touched data slots.
			if _, err := ApplyMessage(evm, msg, new(GasPool).AddGas(block.GasLimit())); err != nil {
				fails.Add(1)
				return nil // Ugh, something went horribly wrong, bail out
			}
			// Pre-load trie nodes for the intermediate root.
			//
			// This operation incurs significant memory allocations due to
			// trie hashing and node decoding. TODO(rjl493456442): investigate
			// ways to mitigate this overhead.
			stateCpy.IntermediateRoot(true)
			return nil
		})
	}
	workers.Wait()

	blockPrefetchTxsValidMeter.Mark(int64(len(block.Transactions())) - fails.Load())
	blockPrefetchTxsInvalidMeter.Mark(fails.Load())
	return
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
// Meter count events to produce exponentially-weighted moving average rates
// at one-, five-, and fifteen-minutes and a mean rate.
type Meter struct {
	count     atomic.Int64
	uncounted atomic.Int64 // not yet added to the EWMAs
	rateMean  atomic.Uint64

	a1, a5, a15 *EWMA
	startTime   time.Time
	stopped     atomic.Bool
}

// Mark records the occurrence of n events.
func (m *Meter) Mark(n int64) {
	m.uncounted.Add(n)
}

// Snapshot returns a read-only copy of the meter.
func (m *Meter) Snapshot() *MeterSnapshot {
	return &MeterSnapshot{
		count:    m.count.Load() + m.uncounted.Load(),
		rate1:    m.a1.Snapshot().Rate(),
		rate5:    m.a5.Snapshot().Rate(),
		rate15:   m.a15.Snapshot().Rate(),
		rateMean: math.Float64frombits(m.rateMean.Load()),
	}
}

func (m *Meter) tick() {
	// Take the uncounted values, add to count
	n := m.uncounted.Swap(0)
	count := m.count.Add(n)
	m.rateMean.Store(math.Float64bits(float64(count) / time.Since(m.startTime).Seconds()))
	// Update the EWMA's internal state
	m.a1.Update(n)
	m.a5.Update(n)
	m.a15.Update(n)
	// And trigger them to calculate the rates
	m.a1.tick()
	m.a5.tick()
	m.a15.tick()
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides a solid architectural foundation. However, to ensure EVM correctness (especially for reverts and atomic operations), one critical component is missing: a **state journal**.

### Recommendation: Add a Journaling Mechanism

Your current `AsyncStateInterface` includes `begin_transaction_async`, `commit_transaction_async`, and `rollback_transaction_async`. To implement this correctly, you need a mechanism to track all state changes within a transaction so they can be reverted atomically.

Go-ethereum solves this with a `journal` (`core/state/journal.go`). Before any state-mutating operation (e.g., `SetState`, `AddBalance`), the *original* value is recorded in a journal entry. If the transaction reverts, these entries are replayed in reverse to restore the state to its pre-transaction snapshot.

**Key concepts to borrow from `go-ethereum/core/state/journal.go`:**
1.  **`journalEntry` interface/enum**: Define different entry types for each kind of state change (balance, nonce, storage, code, etc.).
2.  **`journal` struct**: A list of `journalEntry` objects.
3.  **Snapshots**: The journal uses integer revision IDs to create snapshots. `Snapshot()` records the current length of the journal entries. `RevertToSnapshot(id)` replays all entries after that ID in reverse.

Integrating a journaling mechanism will make your async database layer robust and align with the atomicity requirements of the EVM.

---

This prompt requests the implementation of an asynchronous database layer for an EVM, focusing on non-blocking state operations, connection pooling, and batching.

Go-ethereum's `StateDB` and `rawdb` packages provide excellent, battle-tested patterns for these features, even though its core execution loop is synchronous.

-   **State Management & Journaling**: `core/state/statedb.go` is the most relevant file. It implements the `StateDB` object, which acts as a transactional cache on top of the database. It manages accounts, storage, and code, and crucially, it contains a `journal` for handling state reversions (snapshots and rollbacks), which directly maps to the prompt's transaction support requirements.
-   **Database Abstraction & Batching**: `ethdb/interface.go` defines the `Database` and `Batch` interfaces, showing how Geth abstracts its storage backend. The `Batch` interface is a direct parallel to the prompt's request for batched database operations.
-   **Low-Level DB Schema**: `core/rawdb/schema.go` and `accessors_*.go` files define the actual keys and prefixes used to store Ethereum state data (headers, bodies, receipts, trie nodes). This is critical context for understanding *what* needs to be stored and how to key it.
-   **Append-Only Storage (Freezer)**: `core/rawdb/freezer.go` is a powerful example of a specialized, append-only database for immutable "ancient" chain data. Its design, which uses flat files and indexes, is highly relevant for efficient, high-throughput, asynchronous writes and reads of historical data.
-   **Resource Pooling**: `core/types/hashing.go` uses `sync.Pool` to reuse expensive-to-create objects like hashers. This pattern is directly applicable to the prompt's request for a database connection pool.

The selected snippets below provide a comprehensive blueprint for implementing a robust and efficient state database for an EVM, covering state caching, transaction journaling, low-level data layout, and resource management patterns.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state.
// It is a caching layer on top of the underlying database.
type StateDB struct {
	db                Database
	prefetcher        *prefetcher
	originalRoot      common.Hash
	snaps             *snapshot.Tree
	snapDestructs     map[common.Hash]struct{}
	snapAccounts      map[common.Hash][]byte
	snapStorage       map[common.Hash]map[common.Hash][]byte
	trieIsVerkle      bool
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}
	dbErr             error

	// This map holds 'live' objects, which will get modified while processing a
	// transaction. These objects are cleared after the transaction has been processed.
	// Update(s) to account/storage are recorded in journal.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// Measurements for metrics.
	AccountReads         time.Duration
	AccountHashes        time.Duration
	AccountUpdates       time.Duration
	AccountCommits       time.Duration
	StorageReads         time.Duration
	StorageHashes        time.Duration
	StorageUpdates       time.Duration
	StorageCommits       time.Duration
	PreimageReads        time.Duration
	PreimageWrites       time.Duration
	preimages            map[common.Hash][]byte
	preimagesDirty       map[common.Hash]struct{}
	initialHasPreimages  bool
	initialImmutable     bool
	pendingVerklePointOp *verkle.PointOperation
}

// CreateAccount explicitly creates a state object. If a state object with the address
// already exists the balance is carried over to the new account.
//
// CreateAccount is called during the EVM CREATE operation. The situation might arise that
// a contract does the following:
//
// 1. sends funds to sha(account ++ (nonce))
// 2. CREATEs a contract at sha(account ++ (nonce))
//
// It is important to carry over the balance in order to get the same results as existing
// clients.
func (s *StateDB) CreateAccount(addr common.Address) {
	newObj, prev := s.createObject(addr)
	if prev != nil {
		newObj.setBalance(prev.data.Balance)
	}
}

// SubBalance subtracts amount from the account associated with addr.
func (s *StateDB) SubBalance(addr common.Address, amount *uint256.Int) {
	so := s.GetOrNewStateObject(addr)
	if so != nil {
		so.SubBalance(amount)
	}
}

// AddBalance adds amount to the account associated with addr.
func (s *StateDB) AddBalance(addr common.Address, amount *uint256.Int) {
	so := s.GetOrNewStateObject(addr)
	if so != nil {
		so.AddBalance(amount)
	}
}

// GetBalance retrieves the balance from the given address or 0 if object not found
func (s *StateDB) GetBalance(addr common.Address) *uint256.Int {
	so := s.getStateObject(addr)
	if so != nil {
		return so.Balance()
	}
	return uint256.NewInt(0)
}

// GetNonce returns the nonce of the given account.
func (s *StateDB) GetNonce(addr common.Address) uint64 {
	so := s.getStateObject(addr)
	if so != nil {
		return so.Nonce()
	}
	return 0
}

// SetNonce sets the nonce of the given account.
func (s *StateDB) SetNonce(addr common.Address, nonce uint64) {
	so := s.GetOrNewStateObject(addr)
	if so != nil {
		so.SetNonce(nonce)
	}
}

// GetCodeHash returns the code hash of the given account.
func (s *StateDB) GetCodeHash(addr common.Address) common.Hash {
	so := s.getStateObject(addr)
	if so == nil {
		return common.Hash{}
	}
	return common.BytesToHash(so.CodeHash())
}

// GetCode returns the code of the given account.
func (s *StateDB) GetCode(addr common.Address) []byte {
	so := s.getStateObject(addr)
	if so != nil {
		return so.Code(s.db)
	}
	return nil
}

// SetCode sets the code of the given account.
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	so := s.GetOrNewStateObject(addr)
	if so != nil {
		so.SetCode(crypto.Keccak256Hash(code), code)
	}
}

// GetState retrieves a value from the given account's storage trie.
func (s *StateDB) GetState(addr common.Address, hash common.Hash) common.Hash {
	so := s.getStateObject(addr)
	if so != nil {
		return so.GetState(s.db, hash)
	}
	return common.Hash{}
}

// SetState sets a value in the given account's storage trie.
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) {
	so := s.GetOrNewStateObject(addr)
	if so != nil {
		so.SetState(key, value)
	}
}

// GetCommittedState retrieves a value from the given account's committed storage trie.
func (s *StateDB) GetCommittedState(addr common.Address, hash common.Hash) common.Hash {
	so := s.getStateObject(addr)
	if so != nil {
		return so.GetCommittedState(s.db, hash)
	}
	return common.Hash{}
}

// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	id := s.nextRevisionId
	s.nextRevisionId++
	s.validRevisions = append(s.validRevisions, revision{id, s.journal.length()})
	return id
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(s.validRevisions), func(i int) bool {
		return s.validRevisions[i].id >= revid
	})
	if idx == len(s.validRevisions) || s.validRevisions[idx].id != revid {
		panic(fmt.Errorf("revision id %v cannot be reverted", revid))
	}
	// Replay the journal to specified snapshot.
	snapshot := s.validRevisions[idx].journalIndex
	s.journal.revert(s, snapshot)
	s.validRevisions = s.validRevisions[:idx]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journal contains the list of state modifications applied to the state database.
// These are used during transaction processing to either revert a failed transaction
// or clean up after a successful one.
type journal struct {
	entries []journalEntry      // Current changes tracked by the journal
	dirties map[common.Hash]int // Dirty accounts and storage slots
}

// journalEntry is a modification entry in the journal.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the address of the account that this journal entry belongs to.
	// In case of a create or selfdestruct, it is the address of the contract.
	// In case of other operations, it is the address of the sender.
	dirtied() *common.Address
}

// newJournal creates a new journal.
func newJournal() *journal {
	return &journal{
		dirties: make(map[common.Hash]int),
	}
}

// append inserts a new modification entry to the end of the journal.
func (j *journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[addr.Hash()] = j.length()
	}
}

// revert undoes all modifications in the journal since a specific snapshot.
func (j *journal) revert(statedb *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the operation
		j.entries[i].revert(statedb)

		// Drop any dirty tracking induced by the change
		if addr := j.entries[i].dirtied(); addr != nil {
			if j.dirties[addr.Hash()] == i+1 {
				delete(j.dirties, addr.Hash())
			}
		}
	}
	j.entries = j.entries[:snapshot]
}

// length returns the current number of entries in the journal.
func (j *journal) length() int {
	return len(j.entries)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/ethdb/interface.go">
```go
// Batch is a write-only database that commits changes to its host database
// when Write is called. A batch cannot be used concurrently.
type Batch interface {
	KeyValueWriter

	// ValueSize retrieves the amount of data queued up for writing.
	ValueSize() int

	// Write flushes any accumulated data to disk.
	Write() error

	// Reset resets the batch for reuse.
	Reset()

	// Replay replays the batch contents.
	Replay(w KeyValueWriter) error
}

// AncientStoreReader is the read-only interface of an ancient store.
type AncientStoreReader interface {
	// Ancient retrieves an ancient binary blob from the append-only immutable files.
	Ancient(kind string, number uint64) ([]byte, error)

	// AncientRange retrieves multiple items in sequence, starting from the index 'start'.
	AncientRange(kind string, start, count, maxBytes uint64) ([][]byte, error)

	// Ancients returns the ancient item numbers in the freezer.
	Ancients() (uint64, error)

	// Tail returns the number of first stored item in the freezer.
	Tail() (uint64, error)

	// AncientSize returns the ancient size of the specified category.
	AncientSize(kind string) (uint64, error)

	// AncientDatadir returns the path of the ancient store.
	AncientDatadir() (string, error)
}

// AncientReaderOp is an interface for reading from an ancient store.
//
// The 'op' suffix is there to make it clear that an object implementing this
// interface is not a snapshot of the freezer at a certain point in time, but
// rather an operational object that can be used to perform reads.
type AncientReaderOp interface {
	AncientReader

	// ReadAncients runs the given read operation while ensuring that no writes take
	// place on the underlying freezer.
	ReadAncients(fn func(AncientReaderOp) error) (err error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/rawdb/schema.go">
```go
// Data item prefixes (use single byte to avoid mixing data types, avoid `i`, used for indexes).
var (
	headerPrefix       = []byte("h") // headerPrefix + num (uint64 big endian) + hash -> header
	headerTDSuffix     = []byte("t") // headerPrefix + num (uint64 big endian) + hash + headerTDSuffix -> td (deprecated)
	headerHashSuffix   = []byte("n") // headerPrefix + num (uint64 big endian) + headerHashSuffix -> hash
	headerNumberPrefix = []byte("H") // headerNumberPrefix + hash -> num (uint64 big endian)

	blockBodyPrefix     = []byte("b") // blockBodyPrefix + num (uint64 big endian) + hash -> block body
	blockReceiptsPrefix = []byte("r") // blockReceiptsPrefix + num (uint64 big endian) + hash -> block receipts

	txLookupPrefix        = []byte("l") // txLookupPrefix + hash -> transaction/receipt lookup metadata
	bloomBitsPrefix       = []byte("B") // bloomBitsPrefix + bit (uint16 big endian) + section (uint64 big endian) + hash -> bloom bits
	SnapshotAccountPrefix = []byte("a") // SnapshotAccountPrefix + account hash -> account trie value
	SnapshotStoragePrefix = []byte("o") // SnapshotStoragePrefix + account hash + storage hash -> storage trie value
	CodePrefix            = []byte("c") // CodePrefix + code hash -> account code
	skeletonHeaderPrefix  = []byte("S") // skeletonHeaderPrefix + num (uint64 big endian) -> header

	// Path-based storage scheme of merkle patricia trie.
	TrieNodeAccountPrefix = []byte("A") // TrieNodeAccountPrefix + hexPath -> trie node
	TrieNodeStoragePrefix = []byte("O") // TrieNodeStoragePrefix + accountHash + hexPath -> trie node
	stateIDPrefix         = []byte("L") // stateIDPrefix + state root -> state id

	// VerklePrefix is the database prefix for Verkle trie data, which includes:
	// (a) Trie nodes
	// (b) In-memory trie node journal
	// (c) Persistent state ID
	// (d) State ID lookups, etc.
	VerklePrefix = []byte("v")

	PreimagePrefix = []byte("secure-key-")       // PreimagePrefix + hash -> preimage
	configPrefix   = []byte("ethereum-config-")  // config prefix for the db
	genesisPrefix  = []byte("ethereum-genesis-") // genesis state prefix for the db
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/rawdb/freezer.go">
```go
// Freezer is an append-only database to store immutable ordered data into
// flat files:
//
// - The append-only nature ensures that disk writes are minimized.
// - The in-order data ensures that disk reads are always optimized.
type Freezer struct {
	datadir string
	frozen  atomic.Uint64 // Number of items already frozen
	tail    atomic.Uint64 // Number of the first stored item in the freezer

	// This lock synchronizes writers and the truncate operation, as well as
	// the "atomic" (batched) read operations.
	writeLock  sync.RWMutex
	writeBatch *freezerBatch

	readonly     bool
	tables       map[string]*freezerTable // Data tables for storing everything
	instanceLock *flock.Flock             // File-system lock to prevent double opens
	closeOnce    sync.Once
}

// ModifyAncients runs the given write operation.
func (f *Freezer) ModifyAncients(fn func(ethdb.AncientWriteOp) error) (writeSize int64, err error) {
	if f.readonly {
		return 0, errReadOnly
	}
	f.writeLock.Lock()
	defer f.writeLock.Unlock()

	// Roll back all tables to the starting position in case of error.
	prevItem := f.frozen.Load()
	defer func() {
		if err != nil {
			// The write operation has failed. Go back to the previous item position.
			for name, table := range f.tables {
				err := table.truncateHead(prevItem)
				if err != nil {
					log.Error("Freezer table roll-back failed", "table", name, "index", prevItem, "err", err)
				}
			}
		}
	}()

	f.writeBatch.reset()
	if err := fn(f.writeBatch); err != nil {
		return 0, err
	}
	item, writeSize, err := f.writeBatch.commit()
	if err != nil {
		return 0, err
	}
	f.frozen.Store(item)
	return writeSize, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// ApplyMessage computes the new state by applying the given message
// against the old state within the environment.
//
// ApplyMessage returns the bytes returned by any EVM execution (if it took place),
// the gas used (which includes gas refunds) and an error if it failed. An error always
// indicates a core error meaning that the message would always fail for that particular
// state and would never be accepted within a block.
func ApplyMessage(evm *vm.EVM, msg *Message, gp *GasPool) (*ExecutionResult, error) {
	evm.SetTxContext(NewEVMTxContext(msg))
	return newStateTransition(evm, msg, gp).execute()
}

// stateTransition represents a state transition.
type stateTransition struct {
	gp           *GasPool
	msg          *Message
	gasRemaining uint64
	initialGas   uint64
	state        vm.StateDB
	evm          *vm.EVM
}

// execute will transition the state by applying the current message and
// returning the evm execution result with following fields.
func (st *stateTransition) execute() (*ExecutionResult, error) {
	// ... (pre-check logic, buying gas, etc.) ...

	// Prepare the state for the transition.
	st.state.Prepare(rules, msg.From, st.evm.Context.Coinbase, msg.To, vm.ActivePrecompiles(rules), msg.AccessList)

	var (
		ret   []byte
		vmerr error // vm errors do not effect consensus and are therefore not assigned to err
	)
	if contractCreation {
		ret, _, st.gasRemaining, vmerr = st.evm.Create(msg.From, msg.Data, st.gasRemaining, value)
	} else {
		// Increment the nonce for the next transaction.
		st.state.SetNonce(msg.From, st.state.GetNonce(msg.From)+1, tracing.NonceChangeEoACall)
		// ... (EIP-7702 authorization logic) ...
		ret, st.gasRemaining, vmerr = st.evm.Call(msg.From, st.to(), msg.Data, st.gasRemaining, value)
	}

	// ... (refund logic, fee payments, etc.) ...

	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		MaxUsedGas: peakGasUsed,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/hashing.go">
```go
// hasherPool holds LegacyKeccak256 hashers for rlpHash.
var hasherPool = sync.Pool{
	New: func() interface{} { return crypto.NewKeccakState() },
}

// encodeBufferPool holds temporary encoder buffers for DeriveSha and TX encoding.
var encodeBufferPool = sync.Pool{
	New: func() interface{} { return new(bytes.Buffer) },
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides a well-structured plan for building an async database layer. The architecture, including the `AsyncStateInterface`, `AsyncResult`, and `ConnectionPool`, is sound.

The Go-ethereum codebase offers valuable patterns that can refine this implementation:

1.  **Transactional State vs. Database Transactions**: The prompt's `AsyncStateInterface` includes `begin_transaction_async`, `commit_transaction_async`, etc. This suggests exposing raw database transaction controls to the EVM. Go-ethereum takes a different approach: its `StateDB` object acts as an in-memory, journaled cache on top of the database.
    *   **Geth's Pattern**:
        1.  Start of a call/transaction: `StateDB.Snapshot()` is called, which saves the current length of an internal `journal` (a list of changes).
        2.  During execution: All state changes (`SetStorage`, `AddBalance`) are applied to in-memory objects and an "undo" entry is added to the journal.
        3.  On revert: `StateDB.RevertToSnapshot()` is called, which iterates through the journal in reverse, applying the "undo" operations to the in-memory state objects.
        4.  On commit: The changes are flushed from the in-memory `stateObjects` to the underlying database using a `trie.Database` which performs a batched write.
    *   **Recommendation**: Consider adopting Geth's journaling pattern. Instead of exposing raw DB transactions, the `AsyncStateBackend` would manage an in-memory journal of changes. This is often more efficient for the EVM's access patterns, as it avoids database-level locking during execution and makes reverts (which are common) very fast in-memory operations. The final `commit` would then be a single, large, asynchronous batch write to the database.

2.  **Batching is Key**: The prompt mentions `batch_set_storage_async`. Geth's performance relies heavily on batching writes. All state modifications within a block are typically committed to the database in one single, large batch (`StateDB.Commit`). This is a critical pattern to replicate for performance, and the `ethdb.Batch` interface is a good model.

3.  **Database Schema**: The `core/rawdb/schema.go` file shows how Geth prefixes keys to avoid collisions between different types of data (headers vs bodies vs state trie nodes) in a simple key-value store. This context is essential for building a correct and efficient database backend, as it defines what data needs to be stored and how it can be retrieved. The Zig implementation should adopt a similar key-prefixing scheme.

---

An analysis of the go-ethereum codebase reveals several patterns and structures that are highly relevant to implementing asynchronous database support for an EVM. The most pertinent concepts are the `StateDB` abstraction, the journaling mechanism for state reverts, the `stateObject` caching layer, and the `Snapshot` system for performant state access.

### `StateDB` as the Core State Manager
`StateDB` is the central component for managing EVM state. It handles account data, storage, and code, while abstracting away the underlying database and trie implementation. It uses a journaling system to track state changes, enabling efficient reverts, which is analogous to the transactional support requested in the prompt.

### `stateObject` as a Caching Layer
Each account is represented by a `stateObject` in memory. This object acts as a write-through cache, holding account data and dirty storage slots. Changes are written to the in-memory `stateObject` first and are only committed to the underlying trie and database when `StateDB.Commit` is called. This pattern is directly applicable to the `StateCache` and `WriteBatch` components in your specification.

### `Snapshot` for Performance
Go-ethereum uses a `Snapshot` mechanism, which is a flattened, read-only representation of the state trie. This is a key performance optimization that avoids expensive trie traversals for state reads. While your prompt focuses on async operations, Geth's snapshotting provides a valuable, battle-tested pattern for achieving high-performance, non-blocking state reads, which aligns with your overall goal.

### Database Abstraction
At a lower level, `ethdb` provides a key-value store interface, allowing different database backends like LevelDB or PebbleDB to be used. This directly corresponds to your `DatabaseBackend` abstraction.

The following code snippets are the most relevant for your implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state.
// It is the main object to access and modify the state.
type StateDB struct {
	db         Database
	trie       Trie
	hasher     crypto.KeccakState
	hashTrie   Trie
	prefetcher *TriePrefetcher

	// This map holds the state objects that have been modified in the current transaction.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	// State objects are lazy loaded and processed. Accumulate the errors for return value.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txIndex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Journal of state modifications. This is the backbone of
	// snapshot and revert cleanly.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// Measurements gathered during execution for debugging purposes
	AccountReads         time.Duration
	AccountHashes        time.Duration
	AccountUpdates       time.Duration
	AccountCommits       time.Duration
	StorageReads         time.Duration
	StorageHashes        time.Duration
	StorageUpdates       time.Duration
	StorageCommits       time.Duration
	TrieTime             time.Duration
	SnapshotAccountReads time.Duration
	SnapshotStorageReads time.Duration
	SnapshotCommits      time.Duration

	// The snapshot tree for fast lookups.
	snaps    *snapshot
	snapDest Mismatch
	snapErr  error

	// Per-transaction access list
	accessList *accessList
}

// Create a new state from a given trie.
func New(root common.Hash, db Database, snaps *snapshot) (*StateDB, error) {
	tr, err := db.OpenTrie(root)
	if err != nil {

		return nil, err
	}
	sdb := &StateDB{
		db:                db,
		trie:              tr,
		stateObjects:      make(map[common.Address]*stateObject),
		stateObjectsDirty: make(map[common.Address]struct{}),
		logs:              make(map[common.Hash][]*types.Log),
		preimages:         make(map[common.Hash][]byte),
		journal:           newJournal(),
		snaps:             snaps,
		accessList:        newAccessList(),
	}
	sdb.hasher = MakeHasher(sdb.snap)
	sdb.hashTrie = sdb.db.NewTrie(sdb.hasher)
	return sdb, nil
}

// GetState retrieves a value from the given account's storage trie.
func (s *StateDB) GetState(addr common.Address, hash common.Hash) common.Hash {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		return stateObject.GetState(s.db, hash)
	}
	return common.Hash{}
}

// SetState updates a value in the given account's storage trie.
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetState(s.db, key, value)
	}
}

// GetCode returns the code of an account.
func (s *StateDB) GetCode(addr common.Address) []byte {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		return stateObject.Code(s.db)
	}
	return nil
}

// SetCode updates the code of an account.
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetCode(crypto.Keccak256Hash(code), code)
	}
}

// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	id := s.nextRevisionId
	s.nextRevisionId++
	s.validRevisions = append(s.validRevisions, revision{id, s.journal.length()})
	return id
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(s.validRevisions), func(i int) bool {
		return s.validRevisions[i].id >= revid
	})
	if idx == len(s.validRevisions) || s.validRevisions[idx].id != revid {
		panic(fmt.Errorf("revision id %v cannot be reverted", revid))
	}
	snapshot := s.validRevisions[idx].journalIndex

	// Replay the journal to undo changes and remove invalidated snapshots
	s.journal.revert(s, snapshot)
	s.validRevisions = s.validRevisions[:idx]
}
```
*This `StateDB` is the primary state-manipulation object. Its journaling and snapshotting methods are direct analogues for the transactional capabilities you are building.*
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
//  1. You can retrieve a state object from the trie or create a new one.
//  2. You can then modify the state object in memory.
//  3. Finally, when you want to commit your changes, you call `CommitTrie`
//     and the changes will be written to the trie.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.Account
	db       *StateDB

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access
	code Code // contract bytecode, which gets stored when setting a new code

	// Cache flags.
	// When an object is marked suicided it will be delete from the trie
	// during the commit pass and whatever number of balance it has will be returned.
	suicided bool
	touched  bool
	dirty    bool // true if the account has been modified
	codePipe *cpipe.Pipe

	origin      *stateObject   // used for iteration, it's the stateObject instead of a copy
	dirtyStorage Storage       // Storage entries that have been modified in the current transaction
	pendingCode []byte         // pending code to be written to the trie, this is a temporary field.
	originCode  []byte         // original code, used for gas refund
}

// newObject creates a state object.
func newObject(db *StateDB, address common.Address, data types.Account) *stateObject {
	if data.IsEmpty() {
		// Per EIP-158, empty accounts are removed from the state trie.
		// For a new account, this can be satisfied by not creating it
		// in the first place.
		return nil
	}
	return &stateObject{
		db:           db,
		address:      address,
		addrHash:     crypto.Keccak256Hash(address[:]),
		data:         data,
		dirtyStorage: make(Storage),
	}
}

// GetState returns a value from the account's storage trie.
func (s *stateObject) GetState(db Database, key common.Hash) common.Hash {
	// If we have a dirty value for this state entry, return it
	if value, dirty := s.dirtyStorage[key]; dirty {
		return value
	}
	// Otherwise return the entry's original value
	return s.GetCommittedState(db, key)
}

// SetState updates a value in the account's storage trie.
func (s *stateObject) SetState(db Database, key, value common.Hash) {
	// If the new value is the same as old, don't set
	if s.GetState(db, key) == value {
		return
	}
	// New value is different, update the state object.
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: s.GetCommittedState(db, key),
	})
	s.setState(key, value)
}

// SetCode sets the code of the contract.
func (s *stateObject) SetCode(codeHash common.Hash, code []byte) {
	// Create the backend code writer.
	pipe := s.db.db.NewCodePipe()

	// If there's pending code set, write that first.
	if s.pendingCode != nil {
		if _, err := pipe.Write(s.pendingCode); err != nil {
			panic(err) // This should not happen
		}
		s.pendingCode = nil
	}
	// Write the new code to the backend.
	if len(code) > 0 {
		if _, err := pipe.Write(code); err != nil {
			panic(err)
		}
	}
	// If the code pipe returns a non-empty code hash, it means the code
	// has been written to the backend. In this case, we can simply drop
	// our local copy. Otherwise, the code is small enough, we should keep
	// it in memory.
	if hash := pipe.Hash(); hash != (common.Hash{}) {
		s.code = nil
		s.codePipe = nil
		s.data.CodeHash = hash.Bytes()
		return
	}
	s.code = code
	s.codePipe = pipe
	s.data.CodeHash = codeHash.Bytes()
}
```
*This `stateObject` demonstrates an effective caching strategy. It tracks dirty state in memory (`dirtyStorage`) and only commits to the persistent trie when necessary. This pattern of write-caching is highly relevant to your `StateCache` and `WriteBatch` design.*
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/database.go">
```go
// Database retrieves state objects from the world state trie and is responsible
// for correct caching and data scheduling. It is not safe for concurrent use.
type Database interface {
	// OpenTrie opens the main account trie.
	OpenTrie(root common.Hash) (Trie, error)

	// OpenStorageTrie opens the storage trie of an account.
	OpenStorageTrie(addrHash, root common.Hash) (Trie, error)

	// ContractCode retrieves a particular contract's code from the database.
	ContractCode(codeHash common.Hash) ([]byte, error)

	// ContractCodeSize retrieves a particular contract's code size from the database.
	ContractCodeSize(codeHash common.Hash) (int, error)

	// TrieDB retrieves the low level trie database used for special operations.
	TrieDB() *trie.Database

	// NewCodePipe creates a new code writer which can be used to write the
	// contract code to the backend.
	NewCodePipe() cpipe.Pipe
}
```
*This is the high-level interface `StateDB` uses. It abstracts the trie and code storage, which is a good model for your `AsyncStateInterface` to follow.*
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context vm.Context

	// StateDB gives access to the underlying state
	StateDB vm.StateDB

	// Depth is the call depth, which is restricted to 1024
	depth int

	// chain rules
	chainRules params.Rules

	// chain context operations
	chain vm.ChainContext

	// virtual machine configuration options used to run the contract
	vmConfig vm.Config

	// global gas pool for the entire transaction
	gasPool *GasPool

	// interpreter is the interpreter used to run the contracts
	interpreter *vm.Interpreter

	// readOnly denotes whether the EVM is in read-only mode (static call)
	readOnly bool

	// returnData is the returned data from the last call.
	returnData []byte
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(ctx vm.Context, statedb vm.StateDB, chainConfig *params.ChainConfig, vmConfig vm.Config) *EVM {
	// Initialize the interpreter
	interpreter := vm.NewInterpreter(&vm.EVM{
		StateDB:     statedb,
		ChainConfig: chainConfig,
	}, vmConfig)

	// The EVM should not be used without properly initialising the interpreter
	// and the StateDB.
	return &EVM{
		Context:     ctx,
		StateDB:     statedb,
		chainRules:  chainConfig.Rules(ctx.BlockNumber, ctx.Random != nil, ctx.Time),
		vmConfig:    vmConfig,
		interpreter: interpreter,
	}
}

// Call executes the contract associated with the destination address. It is a
// simplified version of an EVM Call.
func (evm *EVM) Call(caller vm.ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// Pass on the readonly check
	if evm.readOnly {
		return nil, gas, vm.ErrWriteProtection
	}
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, vm.ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, vm.ErrInsufficientBalance
	}
	var (
		to       = vm.AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	//...
	// If the account has no code, transfer value and return.
	if evm.StateDB.GetCodeSize(addr) == 0 {
		//...
	} else {
		// Call the contract, check arguments
		ret, err = run(evm, caller, to, input, gas, value)
	}

	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != vm.ErrExecutionReverted {
			// In case of a revert, we also need to substract the gas, but not all of it.
			gas = 0
		}
	}
	return ret, gas, err
}
```
*This shows how the `EVM` struct holds the `StateDB` and how methods like `Call` use `StateDB.Snapshot()` and `StateDB.RevertToSnapshot()` to manage state changes within a sub-call, which is a key part of EVM execution semantics.*
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/snapshot.go">
```go
// Snapshot is a snapshot of a part of the state trie. The snapshot is a read-only
// data structure, and is not safe for concurrent use.
type Snapshot interface {
	// Account returns the account for a particular address.
	Account(hash common.Hash) (*types.Account, error)

	// Storage returns the storage value for a particular account.
	Storage(accountHash, storageHash common.Hash) (common.Hash, error)

	// Root returns the root hash of the snapshot.
	Root() common.Hash

	// Stale returns true if the snapshot is based on a state that is older
	// than what the node has locally available.
	Stale() bool

	// Release releases all memory held by the snapshot and any layers below it.
	// After this method is called, the snapshot is no longer usable.
	Release()

	// Journal returns all of the states and storage values that were modified
	// between this snapshot and the next. This method is used by the consensus
	// engine to track the changes that need to be persisted.
	Journal() (*Journal, error)
}

// snapshot is a snapshot of a state trie. It is a read-only data structure.
// A snapshot can be layered on top of another snapshot, in which case lookups
// will fall back to the parent.
//
// A snapshot is not safe for concurrent use.
type snapshot struct {
	// Layering and caching infrastructure
	root   common.Hash  // Root hash of the trie the snapshot is for
	parent *snapshot    // Parent snapshot to fall back to
	diskdb ethdb.Reader // Persistent database to fall back to

	// Accounts and storage tracked by this snapshot layer
	accounts map[common.Hash][]byte // Map of account hash -> RLP encoded account
	storage  map[common.Hash][]byte // Map of storage hash -> RLP encoded storage value
	//...
}
```
*This `Snapshot` interface and struct illustrate a powerful performance optimization. For your async implementation, you could consider a similar pattern where a read-only, in-memory snapshot is used to serve most read requests (`get_account_async`, `get_storage_async`) without hitting the database, reserving actual async DB calls for cache misses.*
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/ethdb/interface.go">
```go
// Database is a key-value database.
type Database interface {
	Reader
	Writer
	Batcher
	Iteratee
	Stater
	Compacter
	io.Closer
}

// Reader wraps the Has and Get method of a backing data store.
type Reader interface {
	// Has retrieves if a key is present in the key-value data store.
	Has(key []byte) (bool, error)

	// Get retrieves the given key if it's present in the key-value data store.
	Get(key []byte) ([]byte, error)
}

// Writer wraps the Put and Delete methods of a backing data store.
type Writer interface {
	// Put inserts the given value into the key-value data store.
	Put(key []byte, value []byte) error

	// Delete removes the key from the key-value data store.
	Delete(key []byte) error
}

// Batcher wraps the NewBatch and Write methods of a backing data store.
type Batcher interface {
	// NewBatch creates a write-only database batch.
	NewBatch() Batch

	// NewBatchWithSize creates a write-only database batch with a specific buffer size.
	NewBatchWithSize(size int) Batch
}

// Batch is a write-only database that commits changes to its host database
// when Write is called. A batch cannot be used concurrently.
type Batch interface {
	// Put inserts the given value into the batch for later commit.
	Put(key, value []byte) error

	// Delete removes the key from the host database when the batch is committed.
	Delete(key []byte) error

	// ValueSize retrieves the amount of data queued up for writing.
	ValueSize() int

	// Write flushes any accumulated data to the host database.
	Write() error

	// Reset resets the batch for reuse.
	Reset()

	// Replay replays the batch contents.
	Replay(w io.Writer) error
}
```
*This is the low-level database interface. Your `DatabaseBackend` would implement a similar set of primitives. The `Batch` interface is particularly relevant to your `batch_set_storage_async` requirement, as it provides a way to buffer multiple writes and commit them atomically.*
</file>

## Prompt Corrections
The original prompt is very well-structured and provides a clear architectural vision for the feature. The proposed Zig interfaces are clean and idiomatic. There are no direct errors, but here are some observations and suggestions based on the go-ethereum implementation:

1.  **Journaling vs. Transactions**: The prompt specifies `begin_transaction_async`, `commit_transaction_async`, and `rollback_transaction_async`. In the context of EVM execution, this is almost always implemented via a **journaling** system rather than traditional database transactions. Go-ethereum's `StateDB` uses a `journal` to log the *original* state of any modified account or storage slot. A `Snapshot()` records the current length of the journal. A `RevertToSnapshot()` operation then iterates through the journal in reverse, restoring the original values. This pattern is highly optimized for the EVM's nested call structure and may be a more performant and idiomatic model to adopt than general-purpose database transactions.

2.  **Snapshot Purpose**: Go-ethereum's `Snapshot` system (`core/state/snapshot.go`) is a performance optimization layer that creates a read-only, flattened view of the state to avoid costly trie traversals. This is distinct from the journaling "snapshot" which is just a revert point. Given that a key goal of your async work is performance, you might consider implementing a similar flattened snapshot cache. This would allow most `get_*_async` calls to be served instantly from memory, with the async database calls only being made on a cache miss. This could provide a significant performance boost beyond just making I/O non-blocking.

3.  **Caching and Dirty Tracking**: The `stateObject` in go-ethereum is a crucial caching layer. It holds account data and a `dirtyStorage` map of modified storage slots. This prevents redundant database reads and batches writes. Your `AsyncStateBackend` mentions a `StateCache` and `WriteBatch`, which perfectly align with this concept. The `stateObject` implementation provides a good reference for how to manage this "dirty" state effectively.

---

An async database layer is a significant architectural component. In go-ethereum, state access is synchronous during EVM execution. However, we can draw inspiration from its state management architecture, particularly the `StateDB`, `stateObject`, and `journal` components, which provide a clear separation of concerns for caching, tracking changes, and committing to a persistent store.

The following snippets illustrate how go-ethereum's `StateDB` acts as a high-level API for the EVM, how it uses `stateObject`s to cache account data in memory, and how its `journal` system enables transaction-level atomicity with snapshots and reverts. This mirrors the architecture requested in the prompt, where `AsyncStateBackend` would serve a similar role to `StateDB`.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interface.go">
```go
// StateDB is an EVM database for full state querying.
type StateDB interface {
	CreateAccount(common.Address)
	CreateContract(common.Address)

	SubBalance(common.Address, *uint256.Int, tracing.BalanceChangeReason) uint256.Int
	AddBalance(common.Address, *uint256.Int, tracing.BalanceChangeReason) uint256.Int
	GetBalance(common.Address) *uint256.Int

	GetNonce(common.Address) uint64
	SetNonce(common.Address, uint64, tracing.NonceChangeReason)

	GetCodeHash(common.Address) common.Hash
	GetCode(common.Address) []byte
	SetCode(common.Address, []byte) []byte
	GetCodeSize(common.Address) int

	AddRefund(uint64)
	SubRefund(uint64)
	GetRefund() uint64

	GetCommittedState(common.Address, common.Hash) common.Hash
	GetState(common.Address, common.Hash) common.Hash
	SetState(common.Address, common.Hash, common.Hash) common.Hash
	GetStorageRoot(addr common.Address) common.Hash

	GetTransientState(addr common.Address, key common.Hash) common.Hash
	SetTransientState(addr common.Address, key, value common.Hash)

	SelfDestruct(common.Address) uint256.Int
	HasSelfDestructed(common.Address) bool
	SelfDestruct6780(common.Address) (uint256.Int, bool)

	Exist(common.Address) bool
	Empty(common.Address) bool

	AddressInAccessList(addr common.Address) bool
	SlotInAccessList(addr common.Address, slot common.Hash) (addressOk bool, slotOk bool)
	AddAddressToAccessList(addr common.Address)
	AddSlotToAccessList(addr common.Address, slot common.Hash)

	PointCache() *utils.PointCache

	Prepare(rules params.Rules, sender, coinbase common.Address, dest *common.Address, precompiles []common.Address, txAccesses types.AccessList)

	RevertToSnapshot(int)
	Snapshot() int

	AddLog(*types.Log)
	AddPreimage(common.Hash, []byte)

	Witness() *stateless.Witness
	AccessEvents() *state.AccessEvents

	Finalise(bool)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object and provides
// the necessary tools to run a contract on the given state with
// the provided context. It should be noted that any error
// generated through any of the calls should be considered a
// revert-state-and-consume-all-gas operation, no checks on
// specific errors should ever be performed. The interpreter makes
// sure that any errors generated are to be considered faulty code.
//
// The EVM should never be reused and is not thread safe.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	TxContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// depth is the current call stack
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules

	// virtual machine configuration options used to initialise the evm
	Config Config

	// global (to this context) ethereum virtual machine used throughout
	// the execution of the tx
	interpreter *EVMInterpreter

	// abort is used to abort the EVM calling operations
	abort atomic.Bool

	// callGasTemp holds the gas available for the current call. This is needed because the
	// available gas is calculated in gasCall* according to the 63/64 rule and later
	// applied in opCall*.
	callGasTemp uint64

	// precompiles holds the precompiled contracts for the current epoch
	precompiles map[common.Address]PrecompiledContract

	// jumpDests is the aggregated result of JUMPDEST analysis made through
	// the life cycle of EVM.
	jumpDests map[common.Hash]bitvec
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB structs within the ethereum protocol are used to store anything
// within the merkle trie. StateDBs take care of caching and storing
// nested states. It's the general query interface to retrieve:
//
// * Contracts
// * Accounts
//
// Once the state is committed, tries cached in stateDB (including account
// trie, storage tries) will no longer be functional. A new state instance
// must be created with new root and updated database for accessing post-
// commit states.
type StateDB struct {
	db         Database
	prefetcher *triePrefetcher
	trie       Trie
	reader     Reader

	// originalRoot is the pre-state root, before any changes were made.
	// It will be updated when the Commit is called.
	originalRoot common.Hash

	// This map holds 'live' objects, which will get modified while
	// processing a state transition.
	stateObjects map[common.Address]*stateObject

	// ...

	// Journal of state modifications. This is the backbone of
	// Snapshot and RevertToSnapshot.
	journal *journal

	// ...
}


// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	return s.journal.snapshot()
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	s.journal.revertToSnapshot(revid, s)
}


// GetState retrieves the value associated with the specific key.
func (s *StateDB) GetState(addr common.Address, hash common.Hash) common.Hash {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.GetState(hash)
	}
	return common.Hash{}
}

// SetState updates the value of a storage slot.
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) common.Hash {
	if stateObject := s.getOrNewStateObject(addr); stateObject != nil {
		return stateObject.SetState(key, value)
	}
	return common.Hash{}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journalEntry is a modification entry in the state change journal that can be
// reverted on demand.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the Ethereum address modified by this journal entry.
	dirtied() *common.Address

	// copy returns a deep-copied journal entry.
	copy() journalEntry
}

// journal contains the list of state modifications applied since the last state
// commit. These are tracked to be able to be reverted in the case of an execution
// exception or request for reversal.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes

	validRevisions []revision
	nextRevisionId int
}

// ...

// Changes to individual accounts.
type balanceChange struct {
	account common.Address
	prev    *uint256.Int
}
type nonceChange struct {
	account common.Address
	prev    uint64
}
type storageChange struct {
	account   common.Address
	key       common.Hash
	prevvalue common.Hash
	origvalue common.Hash
}
type codeChange struct {
	account  common.Address
	prevCode []byte
}

// ...

func (ch balanceChange) revert(s *StateDB) {
	s.getStateObject(ch.account).setBalance(ch.prev)
}

func (ch nonceChange) revert(s *StateDB) {
	s.getStateObject(ch.account).setNonce(ch.prev)
}

func (ch codeChange) revert(s *StateDB) {
	s.getStateObject(ch.account).setCode(crypto.Keccak256Hash(ch.prevCode), ch.prevCode)
}

func (ch storageChange) revert(s *StateDB) {
	s.getStateObject(ch.account).setState(ch.key, ch.prevvalue, ch.origvalue)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
// - First you need to obtain a state object.
// - Account values as well as storages can be accessed and modified through the object.
// - Finally, call commit to return the changes of storage trie and update account data.
type stateObject struct {
	db       *StateDB
	address  common.Address      // address of ethereum account
	addrHash common.Hash         // hash of ethereum address of the account
	origin   *types.StateAccount // Account original data without any change applied, nil means it was not existent
	data     types.StateAccount  // Account data with all mutations applied in the scope of block

	// Write caches.
	trie Trie   // storage trie, which becomes non-nil on first access
	code []byte // contract bytecode, which gets set when code is loaded

	originStorage  Storage // Storage entries that have been accessed within the current block
	dirtyStorage   Storage // Storage entries that have been modified within the current transaction
	pendingStorage Storage // Storage entries that have been modified within the current block

	// ...
}

// GetState retrieves a value associated with the given storage key.
func (s *stateObject) GetState(key common.Hash) common.Hash {
	value, _ := s.getState(key)
	return value
}

// getState retrieves a value associated with the given storage key, along with
// its original value.
func (s *stateObject) getState(key common.Hash) (common.Hash, common.Hash) {
	origin := s.GetCommittedState(key)
	value, dirty := s.dirtyStorage[key]
	if dirty {
		return value, origin
	}
	return origin, origin
}

// GetCommittedState retrieves the value associated with the specific key
// without any mutations caused in the current execution.
func (s *stateObject) GetCommittedState(key common.Hash) common.Hash {
	// If we have a pending write or clean cached, return that
	if value, pending := s.pendingStorage[key]; pending {
		return value
	}
	if value, cached := s.originStorage[key]; cached {
		return value
	}
	// ...
	value, err := s.db.reader.Storage(s.address, key)
	// ...
	s.originStorage[key] = value
	return value
}


// SetState updates a value in account storage.
// It returns the previous value
func (s *stateObject) SetState(key, value common.Hash) common.Hash {
	// If the new value is the same as old, don't set. Otherwise, track only the
	// dirty changes, supporting reverting all of it back to no change.
	prev, origin := s.getState(key)
	if prev == value {
		return prev
	}
	// New value is different, update and journal the change
	s.db.journal.storageChange(s.address, key, prev, origin)
	s.setState(key, value, origin)
	return prev
}

// setState updates a value in account dirty storage. The dirtiness will be
// removed if the value being set equals to the original value.
func (s *stateObject) setState(key common.Hash, value common.Hash, origin common.Hash) {
	// Storage slot is set back to its original value, undo the dirty marker
	if value == origin {
		delete(s.dirtyStorage, key)
		return
	}
	s.dirtyStorage[key] = value
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/database.go">
```go
// Database wraps access to tries and contract code.
type Database interface {
	// Reader returns a state reader associated with the specified state root.
	Reader(root common.Hash) (Reader, error)

	// OpenTrie opens the main account trie.
	OpenTrie(root common.Hash) (Trie, error)

	// OpenStorageTrie opens the storage trie of an account.
	OpenStorageTrie(stateRoot common.Hash, address common.Address, root common.Hash, trie Trie) (Trie, error)

	// PointCache returns the cache holding points used in verkle tree key computation
	PointCache() *utils.PointCache

	// TrieDB returns the underlying trie database for managing trie nodes.
	TrieDB() *triedb.Database

	// Snapshot returns the underlying state snapshot.
	Snapshot() *snapshot.Tree
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt provides a robust and well-thought-out architecture for adding asynchronous database support to a Zig-based EVM. The use of a vtable-based interface (`AsyncStateInterface`) and a future/promise framework (`AsyncResult`) are excellent patterns for this task. The provided go-ethereum snippets offer valuable architectural context on how a production-grade EVM handles state management, even though it does so synchronously.

Here are some points to consider based on the go-ethereum implementation:

1.  **Transactional State with Journaling**: The prompt includes `begin/commit/rollback_transaction_async`. In go-ethereum, this is handled by a `journal` within the `StateDB`. Instead of managing raw transaction IDs, Geth's `StateDB` uses `Snapshot()` to get an integer revision ID and `RevertToSnapshot(id)` to roll back. The `journal` records every individual state change (e.g., `balanceChange`, `storageChange`, `codeChange`) as a distinct entry. This provides a fine-grained and highly efficient mechanism for reverts. This journaling pattern is more aligned with EVM execution semantics than a traditional database transaction and would be a valuable pattern to adopt for the `TransactionManager`.

2.  **State Caching and Dirty Tracking**: The `stateObject` in go-ethereum is a crucial optimization. It serves as an in-memory cache for an account's data (balance, nonce, code) and its storage slots. It tracks which storage slots are "dirty" (modified in the current transaction) and which have been read from the database ("origin storage"). This minimizes database reads and batches writes. Your `StateCache` and `WriteBatch` components can draw inspiration from this, ensuring that you differentiate between the original state and the pending state within a transaction.

3.  **VM and StateDB Interaction**: In go-ethereum, the `EVM` holds an instance of the `StateDB` and calls its methods directly (e.g., `evm.StateDB.GetBalance(addr)`). This is a clean separation of concerns. Your `Vm` struct should similarly hold an instance of your `AsyncStateInterface` and use it for all state operations. The provided `vm.zig` modifications in the prompt align well with this pattern.

4.  **Database Interface Abstraction**: Your `DatabaseBackend` is analogous to go-ethereum's `ethdb.Database`, which abstracts away the specific key-value store (LevelDB, PebbleDB). Your `AsyncStateBackend` is analogous to `state.StateDB`, providing a higher-level API for the EVM. This layered abstraction is a strong design choice.

The provided prompt is excellent. The go-ethereum context primarily reinforces the architectural choices and offers battle-tested patterns for implementation details, especially around journaling and in-memory caching of state objects.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an EVM database for full state processing.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds 'live' objects, which will get modified while processing a
	// state transition.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	// State objects are lazy loaded and stored in the cache. Database errors
	// are returned by any operation that accesses lazy loaded objects.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txindex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Journal of state modifications. This is the backbone of
	// Snapshot and RevertToSnapshot.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// Measurements for stats reporting
	AccountReads         time.Duration
	AccountHashes        time.Duration
	AccountUpdates       time.Duration
	AccountCommits       time.Duration
	StorageReads         time.Duration
	StorageHashes        time.Duration
	StorageUpdates       time.Duration
	StorageCommits       time.Duration
	SnapshotAccountReads time.Duration
	SnapshotStorageReads time.Duration
	SnapshotCommits      time.Duration
}

// GetBalance retrieves the balance from the given address or 0 if object not found
func (s *StateDB) GetBalance(addr common.Address) *uint256.Int {
	so := s.getStateObject(addr)
	if so != nil {
		return so.Balance()
	}
	return uint256.NewInt(0)
}

// GetNonce retrieves the nonce from the given address or 0 if object not found
func (s *StateDB) GetNonce(addr common.Address) uint64 {
	so := s.getStateObject(addr)
	if so != nil {
		return so.Nonce()
	}
	return 0
}

// GetCode retrieves the code from the given address or nil if object not found
func (s *StateDB) GetCode(addr common.Address) []byte {
	so := s.getStateObject(addr)
	if so != nil {
		return so.Code(s.db)
	}
	return nil
}

// GetState retrieves a value from the given account's storage trie.
func (s *StateDB) GetState(addr common.Address, hash common.Hash) common.Hash {
	so := s.getStateObject(addr)
	if so != nil {
		return so.GetState(s.db, hash)
	}
	return common.Hash{}
}

// SetState updates a value in the given account's storage trie.
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) {
	so := s.getOrNewStateObject(addr)
	if so != nil {
		so.SetState(s.db, key, value)
	}
}

// SetBalance adds the given amount to the address balance.
func (s *StateDB) SetBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) {
	so := s.getOrNewStateObject(addr)
	if so != nil {
		so.SetBalance(amount)
	}
	// Call tracer hook
	if s.tracer != nil {
		s.tracer.OnBalanceChange(addr, so.Account().Balance.ToBig(), amount.ToBig(), reason)
	}
}

// SetNonce sets the nonce of the given address.
func (s *StateDB) SetNonce(addr common.Address, nonce uint64, reason tracing.NonceChangeReason) {
	so := s.getOrNewStateObject(addr)
	if so != nil {
		so.SetNonce(nonce)
	}
	if s.tracer != nil {
		s.tracer.OnNonceChange(addr, so.Account().Nonce, nonce, reason)
	}
}

// SetCode sets the code of the given address.
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	so := s.getOrNewStateObject(addr)
	if so != nil {
		so.SetCode(crypto.Keccak256Hash(code), code)
	}
}

// AddLog adds a log to the current transaction's list of logs.
func (s *StateDB) AddLog(log *types.Log) {
	s.journal.append(addLogChange{txhash: s.thash})

	log.TxHash = s.thash
	log.BlockHash = s.bhash
	log.TxIndex = uint(s.txindex)
	log.Index = s.logSize
	s.logs[s.thash] = append(s.logs[s.thash], log)
	s.logSize++
}

// AddPreimage records a SHA3 preimage seen by the VM.
func (s *StateDB) AddPreimage(hash common.Hash, preimage []byte) {
	if _, ok := s.preimages[hash]; !ok {
		s.journal.append(addPreimageChange{hash: hash})
		pi := make([]byte, len(preimage))
		copy(pi, preimage)
		s.preimages[hash] = pi
	}
}

// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	id := s.nextRevisionId
	s.nextRevisionId++
	s.validRevisions = append(s.validRevisions, revision{id, s.journal.length()})
	return id
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(s.validRevisions), func(i int) bool {
		return s.validRevisions[i].id >= revid
	})
	if idx == len(s.validRevisions) || s.validRevisions[idx].id != revid {
		panic(fmt.Errorf("revision id %v cannot be reverted", revid))
	}
	snapshot := s.validRevisions[idx].journalIndex

	// Replay the journal to specified snapshot.
	s.journal.revert(s, snapshot)
	s.validRevisions = s.validRevisions[:idx]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/ethdb/interface.go">
```go
// KeyValueReader wraps the Has and Get method of a backing data store.
type KeyValueReader interface {
	// Has retrieves if a key is present in the key-value data store.
	Has(key []byte) (bool, error)

	// Get retrieves the given key if it's present in the key-value data store.
	Get(key []byte) ([]byte, error)
}

// KeyValueWriter wraps the Put method of a backing data store.
type KeyValueWriter interface {
	// Put inserts the given value into the key-value data store.
	Put(key []byte, value []byte) error

	// Delete removes the key from the key-value data store.
	Delete(key []byte) error
}

// KeyValueStater wraps the Stat method of a backing data store.
type KeyValueStater interface {
	// Stat returns a particular internal metric from the database.
	Stat(property string) (string, error)
}

// Compacter wraps the Compact method of a backing data store.
type Compacter interface {
	// Compact flattens the underlying data store for the given key range. In essence,
	// deleted and overwritten versions are discarded, and the data is rearranged to
	// reduce the disk space and seeking overhead.
	Compact(start []byte, limit []byte) error
}

// KeyValueStore contains all the methods required to allow handling different
// key-value data stores backing the high level database.
type KeyValueStore interface {
	KeyValueReader
	KeyValueWriter
	Batcher
	Iteratee
	KeyValueStater
	Compacter
	io.Closer

	// Sync synchronously flushes all dirty data to disk.
	SyncKeyValue() error
}

// Batch is a write-only database that commits changes to its host database
// when Write is called. A batch cannot be used concurrently.
type Batch interface {
	KeyValueWriter

	// ValueSize retrieves the amount of data queued up for writing.
	ValueSize() int

	// Write flushes any accumulated data to disk.
	Write() error

	// Reset resets the batch for reuse.
	Reset()

	// Replay replays the batch contents.
	Replay(w KeyValueWriter) error
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/triedb/database.go">
```go
// Config defines all necessary options for database.
type Config struct {
	Preimages bool           // Flag whether the preimage of node key is recorded
	IsVerkle  bool           // Flag whether the db is holding a verkle tree
	HashDB    *hashdb.Config // Configs for hash-based scheme
	PathDB    *pathdb.Config // Configs for experimental path-based scheme
}

// Database is the wrapper of the underlying backend which is shared by different
// types of node backend as an entrypoint. It's responsible for all interactions
// relevant with trie nodes and node preimages.
type Database struct {
	disk      ethdb.Database
	config    *Config        // Configuration for trie database
	preimages *preimageStore // The store for caching preimages
	backend   backend        // The backend for managing trie nodes
}

// NewDatabase initializes the trie database with default settings, note
// the legacy hash-based scheme is used by default.
func NewDatabase(diskdb ethdb.Database, config *Config) *Database {
	// Sanitize the config and use the default one if it's not specified.
	if config == nil {
		config = HashDefaults
	}
	var preimages *preimageStore
	if config.Preimages {
		preimages = newPreimageStore(diskdb)
	}
	db := &Database{
		disk:      diskdb,
		config:    config,
		preimages: preimages,
	}
	if config.HashDB != nil && config.PathDB != nil {
		log.Crit("Both 'hash' and 'path' mode are configured")
	}
	if config.PathDB != nil {
		db.backend = pathdb.New(diskdb, config.PathDB, config.IsVerkle)
	} else {
		db.backend = hashdb.New(diskdb, config.HashDB)
	}
	return db
}

// NodeReader returns a reader for accessing trie nodes within the specified state.
// An error will be returned if the specified state is not available.
func (db *Database) NodeReader(blockRoot common.Hash) (database.NodeReader, error) {
	return db.backend.NodeReader(blockRoot)
}

// StateReader returns a reader that allows access to the state data associated
// with the specified state. An error will be returned if the specified state is
// not available.
func (db *Database) StateReader(blockRoot common.Hash) (database.StateReader, error) {
	return db.backend.StateReader(blockRoot)
}

// Update performs a state transition by committing dirty nodes contained in the
// given set in order to update state from the specified parent to the specified
// root. The held pre-images accumulated up to this point will be flushed in case
// the size exceeds the threshold.
//
// The passed in maps(nodes, states) will be retained to avoid copying everything.
// Therefore, these maps must not be changed afterwards.
func (db *Database) Update(root common.Hash, parent common.Hash, block uint64, nodes *trienode.MergedNodeSet, states *StateSet) error {
	if db.preimages != nil {
		db.preimages.commit(false)
	}
	switch b := db.backend.(type) {
	case *hashdb.Database:
		return b.Update(root, parent, block, nodes)
	case *pathdb.Database:
		return b.Update(root, parent, block, nodes, states.internal())
	}
	return errors.New("unknown backend")
}

// Commit iterates over all the children of a particular node, writes them out
// to disk. As a side effect, all pre-images accumulated up to this point are
// also written.
func (db *Database) Commit(root common.Hash, report bool) error {
	if db.preimages != nil {
		db.preimages.commit(true)
	}
	return db.backend.Commit(root, report)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journal contains the list of state changes for the current transaction.
// A new entry is added to the journal for each state change.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// journalEntry is a modification to the state.
type journalEntry interface {
	// revert undoes the state change.
	revert(*StateDB)
	// dirtied returns the address that was modified.
	dirtied() *common.Address
}

// newJournal creates a new journal.
func newJournal() *journal {
	return &journal{
		dirties: make(map[common.Address]int),
	}
}

// append inserts a new modification entry to the end of the journal.
func (j *journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// revert undoes all modifications in the journal since a specific snapshot.
func (j *journal) revert(statedb *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the operation
		j.entries[i].revert(statedb)

		// Drop any dirty tracking induced by the change
		if addr := j.entries[i].dirtied(); addr != nil {
			if j.dirties[*addr]--; j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
}

// Various journal entries that can be created.
type (
	// Changes to the account trie.
	createObjectChange struct {
		account *common.Address
	}
	resetObjectChange struct {
		prev *stateObject
	}
	suicideChange struct {
		account     *common.Address
		prev        bool // whether account had already been suicided
		prevbalance *uint256.Int
	}

	// Changes to individual state of an account.
	balanceChange struct {
		account     *common.Address
		prev        *uint256.Int
		prevStorage map[common.Hash]common.Hash
	}
	nonceChange struct {
		account *common.Address
		prev    uint64
	}
	storageChange struct {
		account       *common.Address
		key, prevalue common.Hash
	}
	codeChange struct {
		account            *common.Address
		prevcode, prevhash []byte
	}

	// Changes to other state values.
	refundChange struct {
		prev uint64
	}
	addLogChange struct {
		txhash common.Hash
	}
	addPreimageChange struct {
		hash common.Hash
	}
	touchChange struct {
		account *common.Address
	}
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts of the
// state and blockchain context.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	// StateDB gives access to the underlying state
	StateDB StateDB
	// Depth is the call depth, which is restricted to 1024
	depth int

	// chain rules
	chainConfig *params.ChainConfig

	// virtual machine configuration options used to initialise the
	// virtual machine.
	vmConfig Config

	// interpreter is the Interpreter instance that is used to
	// execute the contract code.
	interpreter *Interpreter

	// readOnly is the flag indicating whether state modifications are allowed
	readOnly bool
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by a single thread.
func NewEVM(blockCtx BlockContext, stateDB StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		Context:     blockCtx,
		StateDB:     stateDB,
		chainConfig: chainConfig,
		vmConfig:    vmConfig,
	}
	evm.interpreter = NewInterpreter(evm, vmConfig)
	return evm
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.vmConfig.NoRecursion && evm.depth > 0 {
		return nil, gas, nil
	}
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if !value.IsZero() && !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}

	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	// Transfer value, and create account if necessary
	evm.Transfer(evm.StateDB, caller.Address(), addr, value, Dump)

	if isPrecompile {
		ret, leftOverGas, err = RunPrecompiledContract(p, input, gas)
	} else {
		// Initialise a new contract and set the code that is to be used by the EVM.
		// The contract is a scoped environment for this execution context only.
		code := evm.StateDB.GetCode(addr)
		if len(code) == 0 {
			ret, leftOverGas = nil, gas
		} else {
			addrCopy := addr
			contract := NewContract(caller, AccountRef(addrCopy), value, gas)
			contract.SetCode(&addrCopy, code)
			ret, leftOverGas, err = evm.interpreter.Run(contract, input, evm.readOnly)
		}
	}
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if !errors.Is(err, vm.ErrExecutionReverted) {
			leftOverGas = 0
		}
	}
	return ret, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
func opSload(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// check stack
	if stack.len() < 1 {
		return nil, ErrStackUnderflow
	}
	// pop value from the stack
	loc := stack.pop()
	// get value from contract storage
	val := evm.StateDB.GetState(contract.Address(), common.Hash(loc.Bytes32()))
	// push value to the stack
	stack.push(val.Bytes256())
	return nil, nil
}

func opSstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// check stack
	if stack.len() < 2 {
		return nil, ErrStackUnderflow
	}
	// pop value and location from the stack
	loc := stack.pop()
	val := stack.pop()
	// set state in the contract's storage
	evm.StateDB.SetState(contract.Address(), common.Hash(loc.Bytes32()), common.Hash(val.Bytes32()))

	return nil, nil
}

func opBalance(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// check stack
	if stack.len() < 1 {
		return nil, ErrStackUnderflow
	}
	// pop address from the stack
	addr := common.Address(stack.pop().Bytes20())
	// push the balance of the given address on the stack
	balance := evm.StateDB.GetBalance(addr)
	stack.push(balance)
	return nil, nil
}

func opCreate(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// check stack
	if stack.len() < 3 {
		return nil, ErrStackUnderflow
	}
	var (
		value        = stack.pop()
		offset, size = stack.pop(), stack.pop()
		input        = memory.GetPtr(offset.Uint64(), size.Uint64())
		gas          = contract.Gas
	)
	// After the hard forks(Homestead), the gas for create is not all-but-one 64th of the remaining gas.
	// The amount of gas passed to a create is weighted and cannot exceed the amount of gas left in the current context.
	if evm.chainConfig.IsHomestead(evm.Context.BlockNumber) {
		gas = gas - gas/64
	}
	// As of EIP-150, the gas available to a create is even more limited.
	if evm.chainConfig.IsEIP150(evm.Context.BlockNumber) {
		gas = availableGas(gas, evm.callGasTemp)
	}
	// pass the remaining gas to the new contract
	contract.UseGas(gas)
	// create the new contract
	addr, _, leftOverGas, err := evm.Create(contract, input, gas, value)
	// push the new address on the stack
	if err != nil {
		stack.push(new(uint256.Int))
	} else {
		stack.push(addr.Bytes256())
	}
	// add the remaining gas to the contract
	contract.Gas += leftOverGas
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/ethdb/memorydb/memorydb.go">
```go
// memorydb is a volatile key-value store.
type MemoryDatabase struct {
	db   map[string][]byte
	lock sync.RWMutex
}

// New creates a new in-memory key-value store.
func New() *MemoryDatabase {
	return &MemoryDatabase{
		db: make(map[string][]byte),
	}
}

// NewWithCap creates a new in-memory key-value store with a initial capacity.
func NewWithCap(size int) *MemoryDatabase {
	return &MemoryDatabase{
		db: make(map[string][]byte, size),
	}
}

// Has retrieves if a key is present in the key-value data store.
func (db *MemoryDatabase) Has(key []byte) (bool, error) {
	db.lock.RLock()
	defer db.lock.RUnlock()

	_, ok := db.db[string(key)]
	return ok, nil
}

// Get retrieves the given key if it's present in the key-value data store.
func (db *MemoryDatabase) Get(key []byte) ([]byte, error) {
	db.lock.RLock()
	defer db.lock.RUnlock()

	if entry, ok := db.db[string(key)]; ok {
		return common.CopyBytes(entry), nil
	}
	return nil, errors.New("not found")
}

// Put inserts the given value into the key-value data store.
func (db *MemoryDatabase) Put(key []byte, value []byte) error {
	db.lock.Lock()
	defer db.lock.Unlock()

	db.db[string(key)] = common.CopyBytes(value)
	return nil
}

// Delete removes the key from the key-value data store.
func (db *MemoryDatabase) Delete(key []byte) error {
	db.lock.Lock()
	defer db.lock.Unlock()

	delete(db.db, string(key))
	return nil
}

// NewBatch creates a write-only database that buffers changes to its host db
// until a final write is called.
func (db *MemoryDatabase) NewBatch() ethdb.Batch {
	return &memBatch{
		db:      db,
		changes: make(map[string][]byte),
	}
}

// NewBatchWithSize creates a write-only database that buffers changes to its host db
// until a final write is called.
func (db *MemoryDatabase) NewBatchWithSize(size int) ethdb.Batch {
	return &memBatch{
		db:      db,
		changes: make(map[string][]byte, size),
	}
}
```
</file>
## Prompt Corrections

The original prompt provides a very detailed and well-thought-out specification for adding asynchronous database support to a Zig-based EVM. The Go-ethereum codebase serves as an excellent reference for building a robust and correct state management layer. There are no major corrections needed, but here are some notes on how the Go-ethereum implementation differs from the proposed Zig architecture, which may be helpful for the implementer:

1.  **Async Model**: The prompt specifies an `AsyncResult`/`Future`-based model. Go-ethereum, being written in Go, uses goroutines and channels for concurrency. There isn't a direct equivalent of `Future.await()`. Instead, operations that need to be asynchronous would likely be run in a separate goroutine, with results passed back over a channel. The `state.StateDB` interface itself is synchronous. Asynchronous behavior (like write-back caching) is handled in lower layers like `triedb`.
2.  **Connection Pooling**: The prompt's `ConnectionPool` is modeled after traditional remote databases (like PostgreSQL). Go-ethereum's default backends (LevelDB, PebbleDB) are embedded key-value stores, so they don't use connection pooling. Instead, they manage file handles and in-memory caches (e.g., `fastcache` in `triedb/hashdb/database.go`). The concepts of caching, resource management, and batching are still highly relevant.
3.  **Database Interface Abstraction**:
    *   The prompt's `AsyncStateInterface` is analogous to Go-ethereum's `state.StateDB` struct, which acts as a high-level API for the EVM.
    *   The prompt's `DatabaseBackend` is analogous to Go-ethereum's `ethdb.Database` interface, which abstracts the underlying key-value store.
    *   Go-ethereum introduces an intermediate layer, `triedb.Database`, which manages the Merkle trie structure on top of the key-value store. This is a powerful pattern that separates the state data structure (trie) from the raw storage backend.
4.  **Transaction Management**: The prompt's `begin_transaction_async`, `commit_transaction_async`, and `rollback_transaction_async` are directly equivalent to Go-ethereum's `state.StateDB.Snapshot()` and `state.StateDB.RevertToSnapshot()`. The `core/state/journal.go` file is a perfect implementation reference for this, as it tracks every individual state change (balance, nonce, storage, code) and can revert them precisely.

The provided Go-ethereum snippets offer a mature, battle-tested blueprint for implementing the requested features, even though the concurrency and database models differ slightly from what is specified in the Zig prompt. The patterns for state journaling, database abstraction, and state object caching are particularly valuable.

---

An analysis of the `go-ethereum` codebase reveals several key components that are highly relevant to implementing asynchronous database support for EVM state management. The most pertinent patterns are found in the `core/state`, `ethdb`, and `core/vm` packages.

`go-ethereum`'s `StateDB` serves as a high-level, in-memory cache on top of a persistent key-value store. It journals changes, allowing for efficient state reverts, a critical feature for EVM execution. While its interface is synchronous, it provides a perfect model for what an asynchronous equivalent would need to accomplish. The underlying `ethdb` package defines the raw database interface, including support for atomic batches, which directly maps to the "Batch Operations" requirement in the prompt.

The most valuable context for this task is understanding:
1.  The `StateDB` API, which represents the functions that need to be made asynchronous.
2.  The `journal` mechanism, which is how `StateDB` implements transactional support (snapshots and reverts).
3.  The `ethdb` interface, which defines the contract for pluggable database backends and batch writes.
4.  How the `EVM` object uses the `StateDB` during opcode execution.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state.
// It is a caching layer on top of the trie and database.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds 'live' objects, which will be written to the trie at the end of
	// the transaction. It is needed during state access and statedb commit.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	// State objects are lazy loaded and stored in the state cache.
	// When a state object is accessed, it is checked whether the underlying
	// database has an error.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txIndex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Journal of state modifications. This is the backbone of
	// snapshot and revert capability.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// Measurements gathered during execution for debugging purposes
	AccountReads         time.Duration
	AccountUpdates       time.Duration
	AccountHashes        time.Duration
	StorageReads         time.Duration
	StorageUpdates       time.Duration
	StorageHashes        time.Duration
	SnapshotAccountReads time.Duration
	SnapshotStorageReads time.Duration
	TrieReads            time.Duration
	TrieWrites           time.Duration
	TrieCommits          time.Duration
}

// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
//  1. When managed trie isn't copied, get a object from the database or create a new one.
//  2. Start transaction using WithTx.
//  3. Call you modification functions.
//  4. Call Commit to write changes to the trie.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     Account
	db       *StateDB

	// Write caches.
	origin      *stateObject // original state of the object, if modified
	trie        Trie         // storage trie, which may be nil
	code        []byte
	cachedDirty bool // true if the dirty storage is not nil

	// Cache flags.
	// When an object is marked suicided it will be delete from the trie
	// during the commit pass and whatever number of balance it has will be returned.
	suicided bool
	touched  bool
	deleted  bool
}

// GetState retrieves a value from the account storage trie.
func (s *StateDB) GetState(addr common.Address, hash common.Hash) common.Hash {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.GetState(s.db, hash)
	}
	return common.Hash{}
}

// SetState updates a value in the account storage trie.
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetState(s.db, key, value)
	}
}

// GetBalance retrieves the balance from the given address or 0 if object not found
func (s *StateDB) GetBalance(addr common.Address) *big.Int {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Balance()
	}
	return new(big.Int)
}

// GetNonce returns the nonce of an account in the stateDB. It returns 0 if the
// account doesn't exist.
func (s *StateDB) GetNonce(addr common.Address) uint64 {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Nonce()
	}
	return 0
}

// SetNonce sets the nonce of an account in the stateDB.
func (s *StateDB) SetNonce(addr common.Address, nonce uint64) {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetNonce(nonce)
	}
}

// GetCode retrieves the code of an account.
func (s *StateDB) GetCode(addr common.Address) []byte {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Code(s.db)
	}
	return nil
}

// SetCode sets the code of an account.
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetCode(crypto.Keccak256Hash(code), code)
	}
}

// AddLog adds a log to the current transaction's list of logs.
func (s *StateDB) AddLog(log *types.Log) {
	s.journal.append(addLogChange{txhash: s.thash})

	log.TxHash = s.thash
	log.TxIndex = uint(s.txIndex)
	log.Index = s.logSize
	s.logs[s.thash] = append(s.logs[s.thash], log)
	s.logSize++
}

// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	id := s.nextRevisionId
	s.nextRevisionId++
	s.validRevisions = append(s.validRevisions, revision{id, s.journal.length()})
	return id
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(s.validRevisions), func(i int) bool {
		return s.validRevisions[i].id >= revid
	})
	if idx == len(s.validRevisions) || s.validRevisions[idx].id != revid {
		panic(fmt.Errorf("revision id %v cannot be reverted", revid))
	}
	snapshot := s.validRevisions[idx].journalIndex

	// Replay the journal to specified snapshot.
	s.journal.revert(s, snapshot)
	s.validRevisions = s.validRevisions[:idx]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// The journal is the list of state changes.
// The journal entries can be reverted in reverse order.
// A change is defined as a 'revert-state' and a 'value'
// The value is the state that is reverted to.
// The revert-state is the previous state.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// journalEntry is a modification to the state. All journaled
// changes can be reverted by restoring the previous state.
type journalEntry interface {
	// revert undoes the state change in the given state database.
	revert(*StateDB)

	// dirties returns the address that is changed by this journal entry.
	dirtied() *common.Address
}

// The following types are the concrete journal entries.
type (
	// Changes to the account balance.
	balanceChange struct {
		account *stateObject
		prev    *big.Int
	}
	// Changes to the account nonce.
	nonceChange struct {
		account *stateObject
		prev    uint64
	}
	// Changes to the account code.
	codeChange struct {
		account *stateObject
		prev    []byte
		prevHash common.Hash
	}
	// Changes to the account storage.
	storageChange struct {
		account       *stateObject
		key, prevalue common.Hash
	}
	// Changes to the logs.
	addLogChange struct {
		txhash common.Hash
	}
	// ... other change types ...
)

// revert removes the last appended change from the journal and restores
// the state to its previous value.
func (j *journal) revert(statedb *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the change and remove it from the journal
		j.entries[i].revert(statedb)

		// Un-dirty the account associated with the change
		if addr := j.entries[i].dirtied(); addr != nil {
			if j.dirties[*addr]--; j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts of the
// state transition function, as defined in the yellow paper.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// Depth is the current call stack
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules

	// virtual machine configuration options used to initialise the
	// evm.
	vmConfig Config

	// interpreter is the contract interpreter
	interpreter *Interpreter

	// readOnly is the read-only indicator. If this is true, the state database cannot be modified.
	readOnly bool
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// If the user specified a specific block number, mark it in the context.
	// This is required for some opcodes, e.g. BLOCKHASH.
	if blockCtx.BlockNumber != nil {
		// YP: Set I_n = H_n
		txCtx.BlockNumber = new(big.Int).Set(blockCtx.BlockNumber)
	}
	evm := &EVM{
		Context:     blockCtx,
		StateDB:     statedb,
		chainConfig: chainConfig,
		chainRules:  chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time),
		vmConfig:    vmConfig,
	}
	evm.interpreter = NewInterpreter(evm, vmConfig)
	return evm
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run runs the EVM code with the given input and returns the trailing output
// data, the amount of gas leftover and any occurring error. If the execution is
// cancelled, the `context.Canceled` error is returned.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() {
		in.evm.depth--
	}()
    // ...
	// The Interpreter main loop. This loop will continue until execution ends
	// with STOP, RETURN, REVERT or an error.
	for {
		// ...
		// Get the operation from the jump table and validate the stack
		op := contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		// ...
		// Execute the operation
		res, err := operation.execute(&pc, in, contract)

		// If the operation returned with an error, it is suggested to stop the execution.
		// Some errors are handled here, the others are bubbling up to the top of the call
		// stack.
		if err != nil {
			return nil, err
		}
        // ...
		// If the result contains a suggestions to stop the virtual machine, return.
		if operation.halts {
			return res, nil
		}
	}
}

// ... inside instructions.go before refactor
func opSload(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// ... gas calculation ...
	loc := stack.pop()
	val := evm.StateDB.GetState(contract.Address(), loc) // <--- STATE ACCESS
	stack.push(val)
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/ethdb/database.go">
```go
// KeyValueReader wraps the Has and Get method of a backing data store.
type KeyValueReader interface {
	// Has retrieves if a key is present in the key-value data store.
	Has(key []byte) (bool, error)

	// Get retrieves the given key if it's present in the key-value data store.
	Get(key []byte) ([]byte, error)
}

// KeyValueWriter wraps the Put and Delete method of a backing data store.
type KeyValueWriter interface {
	// Put inserts the given value into the key-value data store.
	Put(key []byte, value []byte) error

	// Delete removes the key from the key-value data store.
	Delete(key []byte) error
}

// KeyValueStater wraps the Stat method of a backing data store.
type KeyValueStater interface {
	// Stat returns a particular internal stat of the database.
	Stat(property string) (string, error)
}

// KeyValueStore contains all the methods required to allow handling different
// key-value data stores backing the high level database.
type KeyValueStore interface {
	KeyValueReader
	KeyValueWriter
	KeyValueStater
	Batcher
	AncientStore
	io.Closer
}

// Batch is a write-only database that commits changes to its host database
// when Write is called. A batch cannot be used concurrently.
type Batch interface {
	KeyValueWriter

	// ValueSize retrieves the size of all pending values in the batch.
	ValueSize() int

	// Write flushes any accumulated data to disk.
	Write() error

	// Reset resets the batch for reuse.
	Reset()

	// Replay replays the batch contents.
	Replay(w KeyValueWriter) error
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/rawdb/accessors_state.go">
```go
// This file contains the methods to access the state of the blockchain.

// ReadAccount retrieves an account from the database.
func ReadAccount(db ethdb.Reader, addr common.Address, blockNum uint64) *state.Account {
	enc, _ := db.Get(accountKey(addr))
	if len(enc) == 0 {
		return nil
	}
	var acc state.Account
	if err := rlp.DecodeBytes(enc, &acc); err != nil {
		log.Error("Invalid account RLP", "hash", addr, "err", err)
		return nil
	}
	return &acc
}

// WriteAccount stores an account into the database.
func WriteAccount(db ethdb.KeyValueWriter, addr common.Address, acc *state.Account) {
	val, err := rlp.EncodeToBytes(acc)
	if err != nil {
		panic(fmt.Errorf("can't encode account %x: %v", addr, err))
	}
	if err := db.Put(accountKey(addr), val); err != nil {
		log.Crit("Failed to store account", "err", err)
	}
}

// ReadStorage retrieves a storage slot from the database.
func ReadStorage(db ethdb.Reader, addrHash, slotHash common.Hash) []byte {
	key := storageKey(addrHash, slotHash)
	val, _ := db.Get(key)
	return val
}

// WriteStorage stores a storage slot into the database.
func WriteStorage(db ethdb.KeyValueWriter, addrHash, slotHash common.Hash, value []byte) {
	key := storageKey(addrHash, slotHash)
	if err := db.Put(key, value); err != nil {
		log.Crit("Failed to store storage slot", "err", err)
	}
}

// ReadCode retrieves a contract's code from the database.
func ReadCode(db ethdb.Reader, codeHash common.Hash) []byte {
	code, _ := db.Get(codeKey(codeHash))
	return code
}

// WriteCode stores a contract's code into the database.
func WriteCode(db ethdb.KeyValueWriter, codeHash common.Hash, code []byte) {
	if err := db.Put(codeKey(codeHash), code); err != nil {
		log.Crit("Failed to store contract code", "err", err)
	}
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides an excellent and detailed specification for building an async database framework in Zig. However, I've noticed a few areas where go-ethereum's design principles could offer valuable refinements:

1.  **Journaling over Async Transactions**: The prompt specifies an `AsyncStateInterface` with methods like `begin_transaction_async`, `commit_transaction_async`, and `rollback_transaction_async`. While this is a standard database pattern, `go-ethereum` uses a more specialized approach called "journaling" (`core/state/journal.go`).
    *   **Go-ethereum's approach**: Every single state change (e.g., `SetState`, `AddBalance`) is recorded as a `journalEntry`. A "snapshot" is just an integer pointing to the current length of the journal. To "revert" to a snapshot, the journal is simply replayed in reverse to that index, undoing each change.
    *   **Recommendation**: This journaling pattern is highly optimized for the EVM's execution model, where state needs to be reverted frequently within nested calls or upon errors. It might be more performant and simpler to implement than managing explicit, heavy-weight database transactions with transaction IDs. Consider replacing the transaction-based methods with `snapshot() -> RevisionId` and `revert_to_snapshot(revid: RevisionId)`. This is a proven pattern for EVM state management.

2.  **Separation of Caching (`StateDB`) and Raw DB (`ethdb`)**: The prompt's `AsyncStateBackend` combines connection pooling, caching, batching, and transaction management into one large struct. `go-ethereum` separates these concerns more clearly:
    *   **`ethdb.Database`**: A low-level key-value store interface with `Get`, `Put`, `Delete`, and `NewBatch` methods. Concrete implementations could be LevelDB, PebbleDB, or in your case, an async PostgreSQL/Redis backend.
    *   **`state.StateDB`**: A higher-level state manager that acts as a caching and journaling layer on *top* of an `ethdb.Database`. It holds state objects (accounts) in memory, tracks dirty objects, and commits them to the underlying database in a batch at the end of a transaction.
    *   **Recommendation**: Adopting this layered architecture would make the system more modular. The `AsyncStateBackend` could be modeled after `StateDB`, operating on an abstract `AsyncDatabase` interface (equivalent to `ethdb.Database`). This separates the complex EVM state caching and journaling logic from the raw async database I/O.

3.  **State Objects for Caching**: The prompt mentions an optional `StateCache`. `go-ethereum`'s `state.stateObject` is a more advanced pattern. It's an in-memory representation of an account (balance, nonce, code, and its storage trie). These objects are loaded lazily from the database, cached, and marked as "dirty" when modified. At the end of a block's execution, only the dirty `stateObject`s are written back to the database. This significantly reduces database I/O.
    *   **Recommendation**: Instead of a simple cache, consider implementing a `StateObject` struct that encapsulates an account's state and its dirty status. This would be managed by the `AsyncStateBackend` (`StateDB` equivalent).

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context vm.BlockContext
	// StateDB gives access to the underlying state
	StateDB vm.StateDB
	// Depth is the current call stack
	depth int
	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig
	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules
	// vmConfig contains configuration for vm execution
	vmConfig vm.Config
	// interpreter is the contract interpreter
	interpreter *vm.Interpreter
	// gasPool tracks the gas available for the current call.
	gasPool *core.GasPool
	// readOnly marks the EVM object read-only, no state changes allowed
	readOnly bool
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single goroutine.
func NewEVM(blockCtx vm.BlockContext, statedb vm.StateDB, chainConfig *params.ChainConfig, vmConfig vm.Config) *EVM {
	e := &EVM{
		Context:     blockCtx,
		StateDB:     statedb,
		chainConfig: chainConfig,
		chainRules:  chainConfig.Rules(blockCtx.Number, blockCtx.Random != nil, blockCtx.Time),
		vmConfig:    vmConfig,
		gasPool:     new(core.GasPool),
	}
	e.interpreter = vm.NewInterpreter(e, &vmConfig)
	return e
}

// Call executes the contract associated with the destination address. It is up
// to the caller to decide whether the StateDB is committed or not after the call
// returns.
func (evm *EVM) Call(caller vm.ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.vmConfig.NoRecursion && evm.depth > 0 {
		return nil, gas, nil
	}
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, vm.ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() > 0 {
		return nil, gas, vm.ErrWriteProtection
	}
	// Make sure the caller has enough balance to send the value.
	// This should already be checked before this function is called, but is safe to check again.
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, vm.ErrInsufficientBalance
	}

	var (
		to       = vm.AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	if !evm.StateDB.Exist(addr) {
		precompiles := vm.ActivePrecompiles(evm.chainRules)
		if precompiles[addr] == nil && evm.chainRules.IsEIP158 && value.IsZero() {
			return nil, gas, nil
		}
		evm.StateDB.CreateAccount(addr)
	}
	evm.Context.Transfer(evm.StateDB, caller.Address(), to.Address(), value)

	// Touch address which is added to access list
	evm.StateDB.AddressInAccessList(addr)

	// Call the precompiled contracts
	if precompiles := vm.ActivePrecompiles(evm.chainRules); precompiles[addr] != nil {
		return vm.RunPrecompiledContract(precompiles[addr], input, gas)
	}
	// Call the contract code
	code := evm.StateDB.GetCode(addr)
	if len(code) == 0 {
		return nil, gas, nil
	}
	ret, err = evm.run(vm.NewContract(caller, to, value, gas), input, false)
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != vm.ErrExecutionReverted {
			gas = 0
		}
	}
	return ret, gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller vm.ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the
	// limit.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, vm.ErrDepth
	}
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, vm.ErrInsufficientBalance
	}
	// Ensure the contract address is correct
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	// Check whether the contract address is safe to use
	if err = evm.Context.IsCreateAddressSafe(evm.StateDB, contractAddr); err != nil {
		return nil, common.Address{}, gas, err
	}

	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr)
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1)
	}

	evm.Context.Transfer(evm.StateDB, caller.Address(), contractAddr, value)

	// Create a new contract and execute the code
	contract := vm.NewContract(caller, vm.AccountRef(contractAddr), value, gas, nil)
	ret, err = evm.run(contract, code, true)
	// check whether the max code size has been exceeded
	maxCodeSizeExceeded := evm.chainRules.IsEIP170 && len(ret) > params.MaxCodeSize
	// if the code resulted in an error, must revert state changes
	if err != nil || maxCodeSizeExceeded {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err == vm.ErrExecutionReverted {
			err = nil
		}
	}
	// but even if the call resulted in an error, the gas is deducted and the
	// nonce increased. Only when the call stack is deeper than the max call
	// depth the error is returned and gas is not deducted. The latter is done
	// by the caller of this method.
	if maxCodeSizeExceeded {
		err = vm.ErrMaxCodeSizeExceeded
	}
	if err == nil {
		createDataGas := uint64(len(ret)) * params.CreateDataGas
		if contract.UseGas(createDataGas) {
			evm.StateDB.SetCode(contractAddr, ret)
		} else {
			err = vm.ErrCodeStoreOutOfGas
		}
	}

	if err != nil {
		gas = 0
		if err == vm.ErrCodeStoreOutOfGas {
			evm.StateDB.RevertToSnapshot(snapshot)
		}
	}
	return ret, contractAddr, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an EVM database for full state processing.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds 'live' objects, which will get modified while processing a state transition.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	// State objects are lazy loaded and stored in the stateObjects map.
	// When a state object is accessed, it is checked whether the object has been
	// destructed or not. When the object is destructed, the returned value is nil.
	//
	// After the db is setError'd, all subsequent state access will return the error.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txIndex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Journal of state modifications. This is the backbone of
	// Snapshot and RevertToSnapshot.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// Measurements for metrics.
	AccountReads            time.Duration
	AccountUpdates          time.Duration
	AccountHashes           time.Duration
	StorageReads            time.Duration
	StorageUpdates          time.Duration
	StorageHashes           time.Duration
	SnapshotAccountReads    time.Duration
	SnapshotStorageReads    time.Duration
	TrieNodeReads           time.Duration
	TrieNodeWrites          time.Duration
	TrieNodeCommits         time.Duration
	TrieNodeTime            time.Duration
	AccountAddDestructs     time.Duration
	AccountRevertDestructs  time.Duration
	StorageAddDestructs     time.Duration
	StorageRevertDestructs  time.Duration
	AccountAddRefunds       time.Duration
	AccountRevertRefunds    time.Duration
	AccountAddSuicides      time.Duration
	AccountRevertSuicides   time.Duration
	StorageAddRefunds       time.Duration
	StorageRevertRefunds    time.Duration
	accessList              *accessList
	addressInAccessList     map[common.Address]bool
	slotInAccessList        map[common.Address]map[common.Hash]bool
	transientStorage        transientStorage
	snapshotDisabled        bool // disable snapshot for tracing if it's true
	skipJournal             bool // disable journaling for tracing if it's true
	initialBalance          map[common.Address]*uint256.Int
	rules                   params.Rules
	logger                  *tracing.Hooks //if not nil, the tracer will be invoked
}


// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	id := s.nextRevisionId
	s.nextRevisionId++
	s.validRevisions = append(s.validRevisions, revision{id, s.journal.length()})
	return id
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(s.validRevisions), func(i int) bool {
		return s.validRevisions[i].id >= revid
	})
	if idx == len(s.validRevisions) || s.validRevisions[idx].id != revid {
		panic(fmt.Errorf("revision id %v cannot be reverted", revid))
	}
	snapshot := s.validRevisions[idx].journalIndex

	// Replay the journal to specified snapshot.
	s.journal.revert(s, snapshot)
	s.validRevisions = s.validRevisions[:idx]
}

// Finalise finalises the state by removing the self destructed objects
// and clears the journal as well as the refunds. Finalise, however, will not
// commit the state so that the state object can be used in the future.
func (s *StateDB) Finalise(deleteEmptyObjects bool) {
	for addr := range s.journal.dirties {
		obj, exist := s.stateObjects[addr]
		if !exist {
			// ripeMD is 'touched' at block 1714175, in tx 0x1237f737031e40bcde4a8b7e717b2d15e3ec46891012579855022ebe810a2e55
			// That tx goes out of gas, and although the notion of 'touched' does not exist any more
			// the code was already in place to handle that condition. Touched addresses are entered into
			// the journal only by logging from DebugCallTracer.
			// Then when the execution ends, the commits are reverted and the journal is tried to be cleared
			// However, the journal holds the entry, but the state object has been removed.
			// In order to not have to handle this special case, we just will ignore it
			// and not try to assess the change, since there is no change that needs to be assessed.
			continue
		}
		if obj.suicided || (deleteEmptyObjects && obj.empty()) {
			s.deleteStateObject(obj)
		} else {
			obj.updateRoot(s.db)
			s.updateStateObject(obj)
		}
	}
	// Invalidate journal because reverting across transactions is not allowed.
	s.clearJournalAndRefund()
}

// IntermediateRoot computes the current root hash of the state trie.
// It is called in between transactions to get the root hash that
// goes into transaction receipts.
func (s *StateDB) IntermediateRoot(deleteEmptyObjects bool) common.Hash {
	s.Finalise(deleteEmptyObjects)
	return s.trie.Hash()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/ethdb/database.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

// Package ethdb defines the interfaces for an Ethereum data store.
package ethdb

import (
	"errors"
	"io"
)

// KeyValueReader wraps the Has and Get method of a backing data store.
type KeyValueReader interface {
	// Has retrieves if a key is present in the key-value data store.
	Has(key []byte) (bool, error)

	// Get retrieves the given key if it's present in the key-value data store.
	Get(key []byte) ([]byte, error)
}

// KeyValueWriter wraps the Put method of a backing data store.
type KeyValueWriter interface {
	// Put inserts the given value into the key-value data store.
	Put(key []byte, value []byte) error

	// Delete removes the key from the key-value data store.
	Delete(key []byte) error
}

var ErrTooManyKeys = errors.New("too many keys in deleted range")

// KeyValueStore contains all the methods required to allow handling different
// key-value data stores backing the high level database.
type KeyValueStore interface {
	KeyValueReader
	KeyValueWriter
	KeyValueStater
	KeyValueSyncer
	KeyValueRangeDeleter
	Batcher
	Iteratee
	Compacter
	io.Closer
}

// Batch is a write-only database that commits changes to its host database
// when Write is called. A batch cannot be used concurrently.
type Batch interface {
	KeyValueWriter

	// ValueSize retrieves the amount of data queued up for writing.
	ValueSize() int

	// Write flushes any accumulated data to disk.
	Write() error

	// Reset resets the batch for reuse.
	Reset()

	// Replay replays the batch contents.
	Replay(w KeyValueWriter) error
}

// Batcher wraps the NewBatch method of a backing data store.
type Batcher interface {
	// NewBatch creates a write-only database that buffers changes to its host db
	// until a final write is called.
	NewBatch() Batch

	// NewBatchWithSize creates a write-only database batch with pre-allocated buffer.
	NewBatchWithSize(size int) Batch
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/ethdb/pebble/pebble.go">
```go
// Package pebble implements the key-value database layer based on pebble.
package pebble

import (
	"bytes"
	"fmt"
	"runtime"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/cockroachdb/pebble"
	"github.com/cockroachdb/pebble/bloom"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethdb"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/metrics"
)

// Database is a persistent key-value store based on the pebble storage engine.
// Apart from basic data storage functionality it also supports batch writes and
// iterating over the keyspace in binary-alphabetical order.
type Database struct {
	fn string     // filename for reporting
	db *pebble.DB // Underlying pebble storage engine
	// ... (metrics and internal fields) ...
}

// New returns a wrapped pebble DB object. The namespace is the prefix that the
// metrics reporting should use for surfacing internal stats.
func New(file string, cache int, handles int, namespace string, readonly bool) (*Database, error) {
    // ... (options configuration) ...
	
	// Open the db and recover any potential corruptions
	innerDB, err := pebble.Open(file, opt)
	if err != nil {
		return nil, err
	}
	db.db = innerDB
	
    // ... (metrics registration) ...
	
	// Start up the metrics gathering and return
	go db.meter(metricsGatheringInterval, namespace)
	return db, nil
}

// Has retrieves if a key is present in the key-value store.
func (d *Database) Has(key []byte) (bool, error) {
	d.quitLock.RLock()
	defer d.quitLock.RUnlock()
	if d.closed {
		return false, pebble.ErrClosed
	}
	_, closer, err := d.db.Get(key)
	if err == pebble.ErrNotFound {
		return false, nil
	} else if err != nil {
		return false, err
	}
	if err = closer.Close(); err != nil {
		return false, err
	}
	return true, nil
}

// Get retrieves the given key if it's present in the key-value store.
func (d *Database) Get(key []byte) ([]byte, error) {
	d.quitLock.RLock()
	defer d.quitLock.RUnlock()
	if d.closed {
		return nil, pebble.ErrClosed
	}
	dat, closer, err := d.db.Get(key)
	if err != nil {
		return nil, err
	}
	ret := make([]byte, len(dat))
	copy(ret, dat)
	if err = closer.Close(); err != nil {
		return nil, err
	}
	return ret, nil
}

// Put inserts the given value into the key-value store.
func (d *Database) Put(key []byte, value []byte) error {
	d.quitLock.RLock()
	defer d.quitLock.RUnlock()
	if d.closed {
		return pebble.ErrClosed
	}
	return d.db.Set(key, value, d.writeOptions)
}

// Delete removes the key from the key-value store.
func (d *Database) Delete(key []byte) error {
	d.quitLock.RLock()
	defer d.quitLock.RUnlock()
	if d.closed {
		return pebble.ErrClosed
	}
	return d.db.Delete(key, d.writeOptions)
}

// NewBatch creates a write-only key-value store that buffers changes to its host
// database until a final write is called.
func (d *Database) NewBatch() ethdb.Batch {
	return &batch{
		b:  d.db.NewBatch(),
		db: d,
	}
}

// NewBatchWithSize creates a write-only database batch with pre-allocated buffer.
func (d *Database) NewBatchWithSize(size int) ethdb.Batch {
	return &batch{
		b:  d.db.NewBatchWithSize(size),
		db: d,
	}
}

// batch is a write-only batch that commits changes to its host database
// when Write is called. A batch cannot be used concurrently.
type batch struct {
	b    *pebble.Batch
	db   *Database
	size int
}

// Put inserts the given value into the batch for later committing.
func (b *batch) Put(key, value []byte) error {
	if err := b.b.Set(key, value, nil); err != nil {
		return err
	}
	b.size += len(key) + len(value)
	return nil
}

// Delete inserts the key removal into the batch for later committing.
func (b *batch) Delete(key []byte) error {
	if err := b.b.Delete(key, nil); err != nil {
		return err
	}
	b.size += len(key)
	return nil
}

// Write flushes any accumulated data to disk.
func (b *batch) Write() error {
	b.db.quitLock.RLock()
	defer b.db.quitLock.RUnlock()
	if b.db.closed {
		return pebble.ErrClosed
	}
	return b.b.Commit(b.db.writeOptions)
}

// Reset resets the batch for reuse.
func (b *batch) Reset() {
	b.b.Reset()
	b.size = 0
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/p2p/dial.go">
```go
// dialer creates outbound connections and submits them into Server.
// Two types of peer connections can be created:
//
//   - static dials are pre-configured connections. The dialer attempts
//     keep these nodes connected at all times.
//
//   - dynamic dials are created from node discovery results. The dialer
//     continuously reads candidate nodes from its input iterator and attempts
//     to create peer connections to nodes arriving through the iterator.
type dialScheduler struct {
	dialConfig
	setupFunc     dialSetupFunc
	dnsLookupFunc func(ctx context.Context, network string, name string) ([]netip.Addr, error)
	wg            sync.WaitGroup
	cancel        context.CancelFunc
	ctx           context.Context
	nodesIn       chan *enode.Node
	doneCh        chan *dialTask
	addStaticCh   chan *enode.Node
	remStaticCh   chan *enode.Node
	addPeerCh     chan *conn
	remPeerCh     chan *conn

	// Everything below here belongs to loop and
	// should only be accessed by code on the loop goroutine.
	dialing   map[enode.ID]*dialTask // active tasks
	peers     map[enode.ID]struct{}  // all connected peers
	dialPeers int                    // current number of dialed peers

	// The static map tracks all static dial tasks. The subset of usable static dial tasks
	// (i.e. those passing checkDial) is kept in staticPool. The scheduler prefers
	// launching random static tasks from the pool over launching dynamic dials from the
	// iterator.
	static     map[enode.ID]*dialTask
	staticPool []*dialTask

	// The dial history keeps recently dialed nodes. Members of history are not dialed.
	history      expHeap
	historyTimer *mclock.Alarm

	// for logStats
	lastStatsLog     mclock.AbsTime
	doneSinceLastLog int
}

// loop is the main loop of the dialer.
func (d *dialScheduler) loop(it enode.Iterator) {
	var (
		nodesCh chan *enode.Node
	)

loop:
	for {
		// Launch new dials if slots are available.
		slots := d.freeDialSlots()
		slots -= d.startStaticDials(slots)
		if slots > 0 {
			nodesCh = d.nodesIn
		} else {
			nodesCh = nil
		}
		d.rearmHistoryTimer()
		d.logStats()

		select {
		case node := <-nodesCh:
			if err := d.checkDial(node); err != nil {
				d.log.Trace("Discarding dial candidate", "id", node.ID(), "ip", node.IPAddr(), "reason", err)
			} else {
				d.startDial(newDialTask(node, dynDialedConn))
			}

		case task := <-d.doneCh:
			id := task.dest().ID()
			delete(d.dialing, id)
			d.updateStaticPool(id)
			d.doneSinceLastLog++

		case c := <-d.addPeerCh:
			if c.is(dynDialedConn) || c.is(staticDialedConn) {
				d.dialPeers++
			}
			id := c.node.ID()
			d.peers[id] = struct{}{}
			// Remove from static pool because the node is now connected.
			task := d.static[id]
			if task != nil && task.staticPoolIndex >= 0 {
				d.removeFromStaticPool(task.staticPoolIndex)
			}

		case c := <-d.remPeerCh:
			if c.is(dynDialedConn) || c.is(staticDialedConn) {
				d.dialPeers--
			}
			delete(d.peers, c.node.ID())
			d.updateStaticPool(c.node.ID())

		case node := <-d.addStaticCh:
			id := node.ID()
			_, exists := d.static[id]
			d.log.Trace("Adding static node", "id", id, "endpoint", nodeEndpointForLog(node), "added", !exists)
			if exists {
				continue loop
			}
			task := newDialTask(node, staticDialedConn)
			d.static[id] = task
			if d.checkDial(node) == nil {
				d.addToStaticPool(task)
			}

		case node := <-d.remStaticCh:
			id := node.ID()
			task := d.static[id]
			d.log.Trace("Removing static node", "id", id, "ok", task != nil)
			if task != nil {
				delete(d.static, id)
				if task.staticPoolIndex >= 0 {
					d.removeFromStaticPool(task.staticPoolIndex)
				}
			}

		case <-d.historyTimer.C():
			d.expireHistory()

		case <-d.ctx.Done():
			it.Close()
			break loop
		}
	}

	d.historyTimer.Stop()
	for range d.dialing {
		<-d.doneCh
	}
	d.wg.Done()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/downloader/queue.go">
```go
// fetchRequest is a currently running data retrieval operation.
type fetchRequest struct {
	Peer    *peerConnection // Peer to which the request was sent
	From    uint64          // Requested chain element index (used for skeleton fills only)
	Headers []*types.Header // Requested headers, sorted by request order
	Time    time.Time       // Time when the request was made
}

// fetchResult is a struct collecting partial results from data fetchers until
// all outstanding pieces complete and the result as a whole can be processed.
type fetchResult struct {
	pending atomic.Int32 // Flag telling what deliveries are outstanding

	Header       *types.Header
	Uncles       []*types.Header
	Transactions types.Transactions
	Receipts     rlp.RawValue
	Withdrawals  types.Withdrawals
}

// queue represents hashes that are either need fetching or are being fetched
type queue struct {
	mode       SyncMode    // Synchronisation mode to decide on the block parts to schedule for fetching
	headerHead common.Hash // Hash of the last queued header to verify order

	// All data retrievals below are based on an already assembles header chain
	blockTaskPool  map[common.Hash]*types.Header      // Pending block (body) retrieval tasks, mapping hashes to headers
	blockTaskQueue *prque.Prque[int64, *types.Header] // Priority queue of the headers to fetch the blocks (bodies) for
	blockPendPool  map[string]*fetchRequest           // Currently pending block (body) retrieval operations
	blockWakeCh    chan bool                          // Channel to notify the block fetcher of new tasks

	receiptTaskPool  map[common.Hash]*types.Header      // Pending receipt retrieval tasks, mapping hashes to headers
	receiptTaskQueue *prque.Prque[int64, *types.Header] // Priority queue of the headers to fetch the receipts for
	receiptPendPool  map[string]*fetchRequest           // Currently pending receipt retrieval operations
	receiptWakeCh    chan bool                          // Channel to notify when receipt fetcher of new tasks

	resultCache *resultStore       // Downloaded but not yet delivered fetch results
	resultSize  common.StorageSize // Approximate size of a block (exponential moving average)

	lock   *sync.RWMutex
	active *sync.Cond
	closed bool

	logTime time.Time // Time instance when status was last reported
}

// Schedule adds a set of headers for the download queue for scheduling, returning
// the new headers encountered.
func (q *queue) Schedule(headers []*types.Header, hashes []common.Hash, from uint64) int {
	q.lock.Lock()
	defer q.lock.Unlock()

	// Insert all the headers prioritised by the contained block number
	var inserts int
	for i, header := range headers {
		// ... (checks and queueing logic) ...
	}
	return inserts
}

// Results retrieves and permanently removes a batch of fetch results from
// the cache. the result slice will be empty if the queue has been closed.
// Results can be called concurrently with Deliver and Schedule,
// but assumes that there are not two simultaneous callers to Results
func (q *queue) Results(block bool) []*fetchResult {
	// ... (wait and retrieve completed items) ...
	return results
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/ethclient/simulated/backend.go">
```go
// Backend is a simulated blockchain. You can use it to test your contracts or
// other code that interacts with the Ethereum chain.
type Backend struct {
	node   *node.Node
	beacon *catalyst.SimulatedBeacon
	client simClient
}

// NewBackend creates a new simulated blockchain that can be used as a backend for
// contract bindings in unit tests.
//
// A simulated backend always uses chainID 1337.
func NewBackend(alloc types.GenesisAlloc, options ...func(nodeConf *node.Config, ethConf *ethconfig.Config)) *Backend {
	// Create the default configurations for the outer node shell and the Ethereum
	// service to mutate with the options afterwards
	nodeConf := node.DefaultConfig
	nodeConf.DataDir = ""
	nodeConf.P2P = p2p.Config{NoDiscovery: true}

	ethConf := ethconfig.Defaults
	ethConf.Genesis = &core.Genesis{
		Config:   params.AllDevChainProtocolChanges,
		GasLimit: ethconfig.Defaults.Miner.GasCeil,
		Alloc:    alloc,
	}
	ethConf.SyncMode = ethconfig.FullSync
	ethConf.TxPool.NoLocals = true

	for _, option := range options {
		option(&nodeConf, &ethConf)
	}
	// Assemble the Ethereum stack to run the chain with
	stack, err := node.New(&nodeConf)
	if err != nil {
		panic(err) // this should never happen
	}
	sim, err := newWithNode(stack, &ethConf, 0)
	if err != nil {
		panic(err) // this should never happen
	}
	return sim
}

// newWithNode sets up a simulated backend on an existing node. The provided node
// must not be started and will be started by this method.
func newWithNode(stack *node.Node, conf *eth.Config, blockPeriod uint64) (*Backend, error) {
	backend, err := eth.New(stack, conf)
	if err != nil {
		return nil, err
	}
	// Register the filter system
	filterSystem := filters.NewFilterSystem(backend.APIBackend, filters.Config{})
	stack.RegisterAPIs([]rpc.API{{
		Namespace: "eth",
		Service:   filters.NewFilterAPI(filterSystem),
	}})
	// Start the node
	if err := stack.Start(); err != nil {
		return nil, err
	}
	// Set up the simulated beacon
	beacon, err := catalyst.NewSimulatedBeacon(blockPeriod, common.Address{}, backend)
	if err != nil {
		return nil, err
	}
	// Reorg our chain back to genesis
	if err := beacon.Fork(backend.BlockChain().GetCanonicalHash(0)); err != nil {
		return nil, err
	}
	return &Backend{
		node:   stack,
		beacon: beacon,
		client: simClient{ethclient.NewClient(stack.Attach())},
	}, nil
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an EVM state database. It is not safe for concurrent use.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds 'live' objects, which will be written to the trie at the end of
	// the transaction. It is needed during transaction execution because state objects
	// can be modified and reverted multiple times.
	stateObjects        map[common.Address]*stateObject
	stateObjectsPending map[common.Address]struct{} // State objects finalized but not yet written to the trie
	stateObjectsDirty   map[common.Address]struct{} // State objects modified in the current execution

	// DB error.
	// State objects are lazy loaded and stored in the stateObjects map.
	// When lazy loading fails, this error is set and propagated through the next
	// calls.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txIndex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Journal of state modifications. This is the backbone of
	// snapshot and revert capabilities.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// The amount of gas left in the current transaction.
	gas uint64

	// The initial state of the accounts in this transaction. This is used for
	// transaction-level undo.
	initialState map[common.Address]initialState

	// Measurements gathered during execution for debugging purposes
	AccountReads         time.Duration
	AccountUpdates       time.Duration
	AccountHashes        time.Duration
	StorageReads         time.Duration
	StorageUpdates       time.Duration
	StorageHashes        time.Duration
	SnapshotAccountReads time.Duration
	SnapshotStorageReads time.Duration
	SnapshotCommits      time.Duration
}

// CreateAccount explicitly creates a state object. If a state object with the address
// already exists the balance is carried over to the new account.
//
// CreateAccount is called during the EVM CREATE operation. The situation might arise that
// a contract does the following:
//
//   1. sends funds to sha(account ++ (nonce + 1))
//   2. tx calls contract C
//   3. C calls CREATE
//
// Don't matter if the execution fails, the account is created and the initial balance is present.
func (s *StateDB) CreateAccount(addr common.Address) {
	newObj, prev := s.createObject(addr)
	if prev != nil {
		newObj.setBalance(prev.data.Balance)
	}
}

// GetBalance retrieves the balance from the given address or 0 if object not found
func (s *StateDB) GetBalance(addr common.Address) *big.Int {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Balance()
	}
	return common.Big0
}

// GetState retrieves a value from the given account's storage trie.
func (s *StateDB) GetState(addr common.Address, hash common.Hash) common.Hash {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.GetState(s.db, hash)
	}
	return common.Hash{}
}

// SetState updates a value in the given account's storage trie.
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) {
	stateObject := s.getOrCreateStateObject(addr)
	if stateObject != nil {
		stateObject.SetState(s.db, key, value)
	}
}

// GetCode retrieves the code of an account.
func (s *StateDB) GetCode(addr common.Address) []byte {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Code(s.db)
	}
	return nil
}

// SetCode updates the code of an account.
func (s *StateDB) SetCode(addr common.Hash, code []byte) {
	stateObject := s.getOrCreateStateObject(addr)
	if stateObject != nil {
		stateObject.SetCode(crypto.Keccak256Hash(code), code)
	}
}

// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	id := s.nextRevisionId
	s.nextRevisionId++
	s.validRevisions = append(s.validRevisions, revision{id, s.journal.length()})
	return id
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(s.validRevisions), func(i int) bool {
		return s.validRevisions[i].id >= revid
	})
	if idx == len(s.validRevisions) || s.validRevisions[idx].id != revid {
		panic(fmt.Errorf("revision id %v not found", revid))
	}
	snapshot := s.validRevisions[idx].journalIndex

	// Replay the journal to specified snapshot.
	s.journal.revert(s, snapshot)
	s.validRevisions = s.validRevisions[:idx]
}

// Finalise finalises the state by removing the self destructed objects
// and clears the journal as well as the refunds.
func (s *StateDB) Finalise(deleteEmptyObjects bool) {
	for addr := range s.journal.dirties {
		obj, exist := s.stateObjects[addr]
		if !exist {
			// ripeMD is 'touched' at block 1714175, in tx 0x1237f737031e40bcde4a8b7e717b2d15e3ec46095759614c01f553a4df326451
			// That tx goes out of gas, and although the notion of 'touched' does not exist there, the
			// touch-event will still be recorded in the journal. Since ripeMD is a special snowflake,
			// it will be skipped when processing created accounts.
			// TODO: In order to fix this, we should introduce a concept of 'touch', which is undone
			// by setting the empty-flag to true in the journal
			continue
		}
		if obj.suicided || (deleteEmptyObjects && obj.empty()) {
			s.deleteStateObject(obj)
		} else {
			obj.finalise()
		}
		s.stateObjectsPending[addr] = struct{}{}
		s.stateObjectsDirty[addr] = struct{}{}
	}
	// Invalidate journal because reverting across transactions is not allowed.
	s.clearJournalAndRefund()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journal contains the list of state modifications applied to the state database.
// These modifications are stored in chronological order and can be reverted.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// journalEntry is a modification entry in the state journal.
type journalEntry interface {
	// revert undoes the state change in the given state database.
	revert(*StateDB)

	// dirtied returns the address of the account that was modified.
	dirtied() *common.Address
}

// append inserts a new modification entry to the end of the journal.
func (j *journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// revert undoes all modifications in the journal since a given snapshot.
func (j *journal) revert(statedb *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the operation
		j.entries[i].revert(statedb)

		// Drop the dirtiness counter
		if addr := j.entries[i].dirtied(); addr != nil {
			if j.dirties[*addr]--; j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
}

// The following types are the concrete journal entries, each representing a
// single state modification.

type (
	// createObjectChange is the journal entry for creating a new account.
	createObjectChange struct {
		account *common.Address
	}
	// resetObjectChange is the journal entry for resetting an account's state.
	resetObjectChange struct {
		prev *stateObject
	}
	// suicideChange is the journal entry for self-destructing an account.
	suicideChange struct {
		account     *common.Address
		prev        bool // Whether the account was previously suicided
		prevBalance *big.Int
	}
	// balanceChange is the journal entry for a balance change.
	balanceChange struct {
		account *common.Address
		prev    *big.Int
	}
	// nonceChange is the journal entry for a nonce change.
	nonceChange struct {
		account *common.Address
		prev    uint64
	}
	// storageChange is the journal entry for a storage change.
	storageChange struct {
		account       *common.Address
		key, prevalue common.Hash
	}
	// codeChange is the journal entry for a code change.
	codeChange struct {
		account            *common.Address
		prevcode, prevhash common.Hash
	}
	// refundChange is the journal entry for a refund change.
	refundChange struct {
		prev uint64
	}
	// addLogChange is the journal entry for a log change.
	addLogChange struct {
		txhash common.Hash
	}
	// addPreimageChange is the journal entry for a new preimage.
	addPreimageChange struct {
		hash common.Hash
	}
	// touchChange is the journal entry for a touch operation.
	touchChange struct {
		account *common.Address
		prev    bool
		prevDirty bool
	}
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/prefetcher.go">
```go
// prefetcher is a state-prefetching scheduler that retrieves state data from the
// database whilst the EVM is executing transactions in parallel. Its goal is to
// already have the state data in-memory when the EVM needs it.
//
// The prefetcher is composed of two components: a scheduler and a worker. The
// scheduler is responsible for discovering the state that needs to be fetched
// and scheduling it for retrieval. The worker is responsible for actually going
// to the database and pulling the data into memory.
type prefetcher struct {
	ctx      context.Context
	cancel   context.CancelFunc
	db       Database
	requests chan *request // Channel to feed requests to the prefetcher
	results  chan *result  // Channel to stream results back from the prefetcher

	lock    sync.RWMutex
	trie    Trie                 // The state trie to fetch from, can be swapped out
	reads   map[common.Hash]bool // Set of accounts/slots already read
	fetches map[common.Hash]bool // Set of accounts/slots already fetched/fetching
}

// request is an internal type used to represent a single data retrieval request
// from the database. It is used by the scheduler to push new tasks to the workers.
type request struct {
	trie Trie           // Trie to fetch from, can be different from the scheduler's
	hash common.Hash     // Hash of the storage node to retrieve
	node chan *request   // Channel to return the request to when processing is done
	item chan<- *result // Channel to stream the results back on
}

// loop is the main worker loop of a prefetcher. It's sitting and waiting for data
// retrieval requests and when one is received, it goes to the database to pull
// in the entry.
func (p *prefetcher) loop() {
	// Since we're initiating a slew of database reads, we need to ensure that no
	// matter how the loop terminates, we signal the goroutines to tear down.
	defer p.cancel()

	for {
		// Wait for a new prefetch request to arrive, or the prefetcher to be stopped
		select {
		case <-p.ctx.Done():
			return
		case req := <-p.requests:
			// Request arrived, go and fetch it from the database
			val, err := req.trie.TryGet(req.hash[:])
			if err != nil {
				log.Warn("Prefetcher failed to fetch node", "err", err)
			}
			// Return the retrieved data and the request to the owning pools
			req.item <- &result{
				hash: req.hash,
				data: val,
				err:  err,
			}
			req.node <- req
		}
	}
}

// Prefetch schedules a batch of accounts and storage slots for retrieval from
// the database. The method will not block on the data retrieval, rather it will
// queue up the requested state, and return immediately.
func (p *prefetcher) Prefetch(trie Trie, accounts map[common.Address]struct{}, slots map[common.Address]map[common.Hash]struct{}) {
	p.lock.Lock()
	defer p.lock.Unlock()

	// Schedule all the requested accounts for fetching
	for addr := range accounts {
		hash := crypto.Keccak256Hash(addr.Bytes())
		if !p.reads[hash] && !p.fetches[hash] {
			p.schedule(trie, hash)
		}
	}
	// Schedule all the requested storage slots for fetching
	for addr, hashes := range slots {
		for hash := range hashes {
			// Create a composite key to not clash with account hashes
			accHash := crypto.Keccak256Hash(addr.Bytes())
			hash := crypto.Keccak256Hash(accHash.Bytes(), hash.Bytes())

			if !p.reads[hash] && !p.fetches[hash] {
				p.schedule(trie, hash)
			}
		}
	}
}

// schedule adds a new data retrieval request to the queue.
func (p *prefetcher) schedule(trie Trie, hash common.Hash) {
	// Mark the node as fetching and push the request into the queue
	p.fetches[hash] = true

	// Grab a pre-allocated request structure, or allocate a new one
	var req *request
	select {
	case req = <-p.nodePool:
	default:
		req = new(request)
		req.node = p.nodePool
		req.item = p.results
	}
	// Populate the request and push to the workers
	req.trie = trie
	req.hash = hash
	p.requests <- req
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/database.go">
```go
// Database is an intermediate write layer between the state and the low level
// key-value database.
type Database interface {
	// OpenTrie opens the main account trie.
	OpenTrie(root common.Hash) (Trie, error)

	// OpenStorageTrie opens the storage trie of an account.
	OpenStorageTrie(addrHash, root common.Hash) (Trie, error)

	// CopyTrie returns an independent copy of the given trie.
	CopyTrie(Trie) Trie

	// ContractCode retrieves a particular contract's code from the database.
	ContractCode(addrHash, codeHash common.Hash) ([]byte, error)

	// ContractCodeSize retrieves a particular contract's code size from the database.
	ContractCodeSize(addrHash, codeHash common.Hash) (int, error)

	// TrieDB retrieves the low level trie database used for data storage.
	TrieDB() *trie.Database

	// Commit writes all pending state changes to the database.
	Commit(root common.Hash, deleteEmptyObjects bool, ws state.Writer) (common.Hash, error)

	// SetPreimageWriter sets the preimage writer.
	SetPreimageWriter(preimage.Writer)

	// Preimage retrieves a particular hash's preimage from the database.
	Preimage(hash common.Hash) ([]byte, error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/miner/worker.go">
```go
// environment is the worker's current environment and holds all
// information of the sealing block generation.
type environment struct {
	signer   types.Signer
	state    *state.StateDB // apply state changes here
	tcount   int            // tx count in cycle
	gasPool  *core.GasPool  // available gas used to pack transactions
	coinbase common.Address
	evm      *vm.EVM

	header   *types.Header
	txs      []*types.Transaction
	receipts []*types.Receipt
	sidecars []*types.BlobTxSidecar
	blobs    int

	witness *stateless.Witness
}

// commitTransactions attempts to apply transactions to the currently pending block.
func (w *worker) commitTransactions(txs *types.TransactionSet, coinbase common.Address, interrupt *int32) bool {
	// Short circuit if there is no available pending work
	if w.current == nil {
		return true
	}
	if w.current.gasPool == nil {
		w.current.gasPool = new(core.GasPool).AddGas(w.current.header.GasLimit)
	}
	//...
	for {
		// If we're strictly mining, check for interruptions
		if interrupt != nil && atomic.LoadInt32(interrupt) != commitInterruptNone {
			log.Trace("Commit interrupt requested")
			return true
		}
		// If the gas pool is empty, we can't add any more transactions
		if w.current.gasPool.Gas() < params.TxGas {
			log.Trace("Not enough gas for further transactions", "have", w.current.gasPool, "want", params.TxGas)
			break
		}
		// Retrieve the next transaction and abort if all done
		tx := txs.Peek()
		if tx == nil {
			break
		}
        //...

		// Apply the transaction to the current state (lock taken)
		w.mu.Lock()
		w.current.state.SetTxContext(tx.Hash(), w.current.tcount)
		receipt, err := core.ApplyTransaction(w.current.evm, w.current.gasPool, w.current.state, w.current.header, tx, &w.current.header.GasUsed)
		if err != nil {
			w.current.state.RevertToSnapshot(snap) //<<<--- REVERT ON FAILURE
			w.mu.Unlock()
			//...
			continue
		}
		w.mu.Unlock()

		// The transaction was successful, commit it to the block and track the gas
		w.current.txs = append(w.current.txs, tx)
		w.current.receipts = append(w.current.receipts, receipt)
		w.current.tcount++
	}
	//...
	return false
}
```
</file>
</go-ethereum>

## Prompt Corrections

The provided prompt is a strong, well-structured specification for building an asynchronous database layer. The design using a v-table interface, a future/promise framework, and a connection pool is a solid architectural choice. However, based on the battle-tested design of `go-ethereum`, here are a few suggestions for improvement:

1.  **Introduce a `Journal` for Fine-Grained Reverts:**
    Your `AsyncStateInterface` includes `begin_transaction`, `commit_transaction`, and `rollback_transaction`. In Geth, this is implemented at a lower level with a `Journal`. Instead of snapshotting the entire database state, the journal records every individual state change (e.g., a balance change, a storage slot change, a nonce change).

    *   **Benefit:** Reverting a transaction becomes a simple process of iterating through the journal entries since the last snapshot and applying the *inverse* of each change. This is often more efficient and granular than a full database-level rollback.
    *   **Geth Reference:** See `core/state/journal.go`. The `journalEntry` interface and its concrete implementations (`balanceChange`, `storageChange`, etc.) are excellent examples of this pattern.
    *   **Suggestion:** Consider replacing the `TransactionId` concept with an integer-based `SnapshotId`, which corresponds to an index in a `Journal` of `JournalEntry` items. This makes managing nested calls (like in the EVM) much cleaner.

2.  **Model State Objects Explicitly:**
    Geth uses a `stateObject` to represent an account in memory. This object caches the account's balance, nonce, and code, and also manages its storage trie. Changes are made to this in-memory object first, which are then flushed to the trie and database upon commit.

    *   **Benefit:** This pattern reduces database access, as repeated reads/writes to the same account within a transaction only touch the in-memory object.
    *   **Geth Reference:** See the `stateObject` struct in `core/state/state_object.go`.

3.  **Incorporate a Prefetcher for True Async Performance:**
    The core of your request is to make database operations non-blocking. Geth achieves this for read operations using a `prefetcher`. While the EVM execution loop is processing one transaction, the prefetcher can be scheduled to *asynchronously* load the accounts and storage slots needed for *future* transactions from the database into a cache.

    *   **Benefit:** When the EVM actually needs the data (e.g., for `SLOAD`), it's often already in memory, eliminating I/O wait time. This is a practical and powerful way to implement non-blocking state access.
    *   **Geth Reference:** The code in `core/state/prefetcher.go` is directly relevant. It shows a worker-queue pattern where goroutines fetch data from the DB in the background. This is a perfect model for your async implementation.

By incorporating these battle-tested concepts from Geth—especially the `journal` for reverts and a `prefetcher` for async reads—the resulting implementation will be more robust, performant, and closely aligned with the architecture of a production-grade EVM.

