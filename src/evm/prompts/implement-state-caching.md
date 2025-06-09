# Implement State Caching

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_state_caching` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_state_caching feat_implement_state_caching`
3. **Work in isolation**: `cd g/feat_implement_state_caching`
4. **Commit message**: `✨ feat: implement intelligent state caching layer for frequently accessed state`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement an intelligent state caching layer that provides fast access to frequently accessed state data while maintaining consistency and memory efficiency. This includes multi-level caching, cache invalidation strategies, LRU eviction policies, and integration with both synchronous and asynchronous state backends.

## State Caching Architecture Specifications

### Core Caching Framework

#### 1. Multi-Level Cache System
```zig
pub const StateCacheManager = struct {
    allocator: std.mem.Allocator,
    config: CacheConfig,
    l1_cache: L1Cache, // Hot data, in-memory
    l2_cache: ?L2Cache, // Warm data, compressed
    l3_cache: ?L3Cache, // Cold data, disk-based
    cache_statistics: CacheStatistics,
    eviction_policy: EvictionPolicy,
    consistency_manager: ConsistencyManager,
    
    pub const CacheConfig = struct {
        enable_l1_cache: bool,
        enable_l2_cache: bool,
        enable_l3_cache: bool,
        l1_max_size_bytes: usize,
        l2_max_size_bytes: usize,
        l3_max_size_bytes: usize,
        l1_max_entries: u32,
        l2_max_entries: u32,
        l3_max_entries: u32,
        ttl_seconds: u32,
        enable_compression: bool,
        enable_statistics: bool,
        eviction_strategy: EvictionStrategy,
        consistency_mode: ConsistencyMode,
        
        pub const EvictionStrategy = enum {
            LRU,        // Least Recently Used
            LFU,        // Least Frequently Used
            FIFO,       // First In, First Out
            Random,     // Random eviction
            TTL,        // Time To Live based
            Adaptive,   // Adaptive based on access patterns
        };
        
        pub const ConsistencyMode = enum {
            Strong,     // Immediate invalidation
            Eventual,   // Delayed invalidation
            Weak,       // Manual invalidation
        };
        
        pub fn production() CacheConfig {
            return CacheConfig{
                .enable_l1_cache = true,
                .enable_l2_cache = true,
                .enable_l3_cache = false,
                .l1_max_size_bytes = 64 * 1024 * 1024, // 64MB
                .l2_max_size_bytes = 256 * 1024 * 1024, // 256MB
                .l3_max_size_bytes = 1024 * 1024 * 1024, // 1GB
                .l1_max_entries = 100000,
                .l2_max_entries = 500000,
                .l3_max_entries = 2000000,
                .ttl_seconds = 3600, // 1 hour
                .enable_compression = true,
                .enable_statistics = true,
                .eviction_strategy = .LRU,
                .consistency_mode = .Strong,
            };
        }
        
        pub fn development() CacheConfig {
            return CacheConfig{
                .enable_l1_cache = true,
                .enable_l2_cache = true,
                .enable_l3_cache = true,
                .l1_max_size_bytes = 32 * 1024 * 1024, // 32MB
                .l2_max_size_bytes = 128 * 1024 * 1024, // 128MB
                .l3_max_size_bytes = 512 * 1024 * 1024, // 512MB
                .l1_max_entries = 50000,
                .l2_max_entries = 250000,
                .l3_max_entries = 1000000,
                .ttl_seconds = 1800, // 30 minutes
                .enable_compression = true,
                .enable_statistics = true,
                .eviction_strategy = .Adaptive,
                .consistency_mode = .Strong,
            };
        }
        
        pub fn testing() CacheConfig {
            return CacheConfig{
                .enable_l1_cache = true,
                .enable_l2_cache = false,
                .enable_l3_cache = false,
                .l1_max_size_bytes = 1024 * 1024, // 1MB
                .l2_max_size_bytes = 0,
                .l3_max_size_bytes = 0,
                .l1_max_entries = 1000,
                .l2_max_entries = 0,
                .l3_max_entries = 0,
                .ttl_seconds = 60, // 1 minute
                .enable_compression = false,
                .enable_statistics = true,
                .eviction_strategy = .LRU,
                .consistency_mode = .Strong,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: CacheConfig) StateCacheManager {
        return StateCacheManager{
            .allocator = allocator,
            .config = config,
            .l1_cache = L1Cache.init(allocator, config),
            .l2_cache = if (config.enable_l2_cache) L2Cache.init(allocator, config) else null,
            .l3_cache = if (config.enable_l3_cache) L3Cache.init(allocator, config) else null,
            .cache_statistics = CacheStatistics.init(),
            .eviction_policy = EvictionPolicy.init(config.eviction_strategy),
            .consistency_manager = ConsistencyManager.init(allocator, config.consistency_mode),
        };
    }
    
    pub fn deinit(self: *StateCacheManager) void {
        self.l1_cache.deinit();
        if (self.l2_cache) |*cache| {
            cache.deinit();
        }
        if (self.l3_cache) |*cache| {
            cache.deinit();
        }
        self.consistency_manager.deinit();
    }
    
    pub fn get_account(self: *StateCacheManager, address: Address) ?Account {
        const cache_key = CacheKey.account(address);
        
        // Try L1 cache first
        if (self.l1_cache.get(cache_key)) |entry| {
            self.cache_statistics.record_hit(.L1);
            self.eviction_policy.record_access(cache_key);
            
            return switch (entry.data) {
                .account => |account| account,
                else => null,
            };
        }
        
        // Try L2 cache
        if (self.l2_cache) |*l2| {
            if (l2.get(cache_key)) |entry| {
                self.cache_statistics.record_hit(.L2);
                self.eviction_policy.record_access(cache_key);
                
                // Promote to L1
                self.l1_cache.put(cache_key, entry) catch {
                    // L1 cache full, continue with L2 hit
                };
                
                return switch (entry.data) {
                    .account => |account| account,
                    else => null,
                };
            }
        }
        
        // Try L3 cache
        if (self.l3_cache) |*l3| {
            if (l3.get(cache_key)) |entry| {
                self.cache_statistics.record_hit(.L3);
                self.eviction_policy.record_access(cache_key);
                
                // Promote to L2 and L1
                if (self.l2_cache) |*l2| {
                    l2.put(cache_key, entry) catch {};
                }
                self.l1_cache.put(cache_key, entry) catch {};
                
                return switch (entry.data) {
                    .account => |account| account,
                    else => null,
                };
            }
        }
        
        // Cache miss
        self.cache_statistics.record_miss();
        return null;
    }
    
    pub fn set_account(self: *StateCacheManager, address: Address, account: Account) !void {
        const cache_key = CacheKey.account(address);
        const entry = CacheEntry{
            .key = cache_key,
            .data = .{ .account = account },
            .size = @sizeOf(Account),
            .timestamp = std.time.milliTimestamp(),
            .access_count = 1,
            .last_access = std.time.milliTimestamp(),
            .ttl = self.config.ttl_seconds * 1000,
        };
        
        // Store in all available cache levels
        try self.l1_cache.put(cache_key, entry);
        
        if (self.l2_cache) |*l2| {
            try l2.put(cache_key, entry);
        }
        
        if (self.l3_cache) |*l3| {
            try l3.put(cache_key, entry);
        }
        
        // Record write statistics
        self.cache_statistics.record_write();
        
        // Update consistency tracking
        try self.consistency_manager.track_update(cache_key);
    }
    
    pub fn get_storage(self: *StateCacheManager, address: Address, key: U256) ?U256 {
        const cache_key = CacheKey.storage(address, key);
        
        // Check L1 cache
        if (self.l1_cache.get(cache_key)) |entry| {
            self.cache_statistics.record_hit(.L1);
            self.eviction_policy.record_access(cache_key);
            
            return switch (entry.data) {
                .storage => |value| value,
                else => null,
            };
        }
        
        // Check L2 cache
        if (self.l2_cache) |*l2| {
            if (l2.get(cache_key)) |entry| {
                self.cache_statistics.record_hit(.L2);
                self.eviction_policy.record_access(cache_key);
                
                // Promote to L1
                self.l1_cache.put(cache_key, entry) catch {};
                
                return switch (entry.data) {
                    .storage => |value| value,
                    else => null,
                };
            }
        }
        
        // Check L3 cache
        if (self.l3_cache) |*l3| {
            if (l3.get(cache_key)) |entry| {
                self.cache_statistics.record_hit(.L3);
                self.eviction_policy.record_access(cache_key);
                
                // Promote through cache levels
                if (self.l2_cache) |*l2| {
                    l2.put(cache_key, entry) catch {};
                }
                self.l1_cache.put(cache_key, entry) catch {};
                
                return switch (entry.data) {
                    .storage => |value| value,
                    else => null,
                };
            }
        }
        
        // Cache miss
        self.cache_statistics.record_miss();
        return null;
    }
    
    pub fn set_storage(self: *StateCacheManager, address: Address, key: U256, value: U256) !void {
        const cache_key = CacheKey.storage(address, key);
        const entry = CacheEntry{
            .key = cache_key,
            .data = .{ .storage = value },
            .size = @sizeOf(U256),
            .timestamp = std.time.milliTimestamp(),
            .access_count = 1,
            .last_access = std.time.milliTimestamp(),
            .ttl = self.config.ttl_seconds * 1000,
        };
        
        // Store in all cache levels
        try self.l1_cache.put(cache_key, entry);
        
        if (self.l2_cache) |*l2| {
            try l2.put(cache_key, entry);
        }
        
        if (self.l3_cache) |*l3| {
            try l3.put(cache_key, entry);
        }
        
        self.cache_statistics.record_write();
        try self.consistency_manager.track_update(cache_key);
    }
    
    pub fn invalidate(self: *StateCacheManager, cache_key: CacheKey) void {
        self.l1_cache.remove(cache_key);
        
        if (self.l2_cache) |*l2| {
            l2.remove(cache_key);
        }
        
        if (self.l3_cache) |*l3| {
            l3.remove(cache_key);
        }
        
        self.cache_statistics.record_invalidation();
        self.consistency_manager.track_invalidation(cache_key);
    }
    
    pub fn invalidate_address(self: *StateCacheManager, address: Address) void {
        // Invalidate all entries related to an address
        self.l1_cache.invalidate_by_address(address);
        
        if (self.l2_cache) |*l2| {
            l2.invalidate_by_address(address);
        }
        
        if (self.l3_cache) |*l3| {
            l3.invalidate_by_address(address);
        }
        
        self.consistency_manager.track_address_invalidation(address);
    }
    
    pub fn flush_all(self: *StateCacheManager) void {
        self.l1_cache.clear();
        
        if (self.l2_cache) |*l2| {
            l2.clear();
        }
        
        if (self.l3_cache) |*l3| {
            l3.clear();
        }
        
        self.cache_statistics.record_flush();
        self.consistency_manager.clear();
    }
    
    pub fn get_statistics(self: *const StateCacheManager) CacheStatistics {
        return self.cache_statistics;
    }
    
    pub fn optimize_cache(self: *StateCacheManager) !void {
        // Run cache optimization based on access patterns
        try self.eviction_policy.optimize(&self.l1_cache, &self.cache_statistics);
        
        if (self.l2_cache) |*l2| {
            try self.eviction_policy.optimize(l2, &self.cache_statistics);
        }
        
        if (self.l3_cache) |*l3| {
            try self.eviction_policy.optimize(l3, &self.cache_statistics);
        }
    }
};
```

#### 2. Cache Key and Entry Types
```zig
pub const CacheKey = struct {
    key_type: KeyType,
    data: [32]u8,
    hash: u64,
    
    pub const KeyType = enum {
        Account,
        Storage,
        Code,
        CodeHash,
    };
    
    pub fn account(address: Address) CacheKey {
        var data: [32]u8 = [_]u8{0} ** 32;
        @memcpy(data[0..20], &address.bytes);
        
        return CacheKey{
            .key_type = .Account,
            .data = data,
            .hash = std.hash_map.hashString(data[0..20]),
        };
    }
    
    pub fn storage(address: Address, key: U256) CacheKey {
        var data: [32]u8 = [_]u8{0} ** 32;
        
        // Combine address and storage key for unique identifier
        const combined = std.hash.Wyhash.hash(0, &address.bytes) ^ key.to_u64();
        std.mem.writeIntNative(u64, data[0..8], combined);
        @memcpy(data[8..28], &address.bytes);
        
        return CacheKey{
            .key_type = .Storage,
            .data = data,
            .hash = std.hash_map.hashString(&data),
        };
    }
    
    pub fn code(address: Address) CacheKey {
        var data: [32]u8 = [_]u8{0} ** 32;
        @memcpy(data[0..20], &address.bytes);
        data[20] = @intFromEnum(KeyType.Code);
        
        return CacheKey{
            .key_type = .Code,
            .data = data,
            .hash = std.hash_map.hashString(data[0..21]),
        };
    }
    
    pub fn code_hash(code_hash: Hash) CacheKey {
        return CacheKey{
            .key_type = .CodeHash,
            .data = code_hash.bytes,
            .hash = std.hash_map.hashString(&code_hash.bytes),
        };
    }
    
    pub fn equals(self: *const CacheKey, other: *const CacheKey) bool {
        return self.key_type == other.key_type and 
               std.mem.eql(u8, &self.data, &other.data);
    }
    
    pub fn get_address(self: *const CacheKey) ?Address {
        return switch (self.key_type) {
            .Account, .Storage, .Code => Address.from_bytes(self.data[0..20].*),
            .CodeHash => null,
        };
    }
};

pub const CacheEntry = struct {
    key: CacheKey,
    data: CacheData,
    size: usize,
    timestamp: i64,
    access_count: u64,
    last_access: i64,
    ttl: i64,
    
    pub const CacheData = union(enum) {
        account: Account,
        storage: U256,
        code: []const u8,
        code_hash: Hash,
    };
    
    pub fn is_expired(self: *const CacheEntry) bool {
        const now = std.time.milliTimestamp();
        return (now - self.timestamp) > self.ttl;
    }
    
    pub fn get_age_ms(self: *const CacheEntry) i64 {
        return std.time.milliTimestamp() - self.timestamp;
    }
    
    pub fn get_idle_time_ms(self: *const CacheEntry) i64 {
        return std.time.milliTimestamp() - self.last_access;
    }
    
    pub fn update_access(self: *CacheEntry) void {
        self.access_count += 1;
        self.last_access = std.time.milliTimestamp();
    }
    
    pub fn get_access_frequency(self: *const CacheEntry) f64 {
        const age_seconds = @as(f64, @floatFromInt(self.get_age_ms())) / 1000.0;
        return if (age_seconds > 0) 
            @as(f64, @floatFromInt(self.access_count)) / age_seconds 
        else 
            0.0;
    }
};
```

#### 3. L1 Cache Implementation (Hot Data)
```zig
pub const L1Cache = struct {
    allocator: std.mem.Allocator,
    config: StateCacheManager.CacheConfig,
    entries: std.HashMap(CacheKey, CacheEntry, CacheKeyContext, std.hash_map.default_max_load_percentage),
    lru_list: LRUList,
    current_size: usize,
    mutex: std.Thread.RwLock,
    
    pub const CacheKeyContext = struct {
        pub fn hash(self: @This(), key: CacheKey) u64 {
            _ = self;
            return key.hash;
        }
        
        pub fn eql(self: @This(), a: CacheKey, b: CacheKey) bool {
            _ = self;
            return a.equals(&b);
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: StateCacheManager.CacheConfig) L1Cache {
        return L1Cache{
            .allocator = allocator,
            .config = config,
            .entries = std.HashMap(CacheKey, CacheEntry, CacheKeyContext, std.hash_map.default_max_load_percentage).init(allocator),
            .lru_list = LRUList.init(allocator),
            .current_size = 0,
            .mutex = std.Thread.RwLock{},
        };
    }
    
    pub fn deinit(self: *L1Cache) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        // Clean up any allocated data in cache entries
        var iterator = self.entries.iterator();
        while (iterator.next()) |entry| {
            switch (entry.value_ptr.data) {
                .code => |code| self.allocator.free(code),
                else => {},
            }
        }
        
        self.entries.deinit();
        self.lru_list.deinit();
    }
    
    pub fn get(self: *L1Cache, key: CacheKey) ?CacheEntry {
        self.mutex.lockShared();
        defer self.mutex.unlockShared();
        
        if (self.entries.getPtr(key)) |entry| {
            if (entry.is_expired()) {
                // Entry expired, remove it
                self.mutex.unlockShared();
                self.mutex.lock();
                defer self.mutex.unlock();
                
                self.remove_internal(key);
                return null;
            }
            
            // Update access information
            entry.update_access();
            self.lru_list.move_to_front(key);
            
            return entry.*;
        }
        
        return null;
    }
    
    pub fn put(self: *L1Cache, key: CacheKey, entry: CacheEntry) !void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        // Check if we need to evict entries
        while (self.current_size + entry.size > self.config.l1_max_size_bytes or
               self.entries.count() >= self.config.l1_max_entries) {
            
            if (!self.evict_lru()) {
                return CacheError.CacheFull;
            }
        }
        
        // Remove existing entry if present
        if (self.entries.contains(key)) {
            self.remove_internal(key);
        }
        
        // Add new entry
        try self.entries.put(key, entry);
        try self.lru_list.add_to_front(key);
        self.current_size += entry.size;
    }
    
    pub fn remove(self: *L1Cache, key: CacheKey) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        self.remove_internal(key);
    }
    
    fn remove_internal(self: *L1Cache, key: CacheKey) void {
        if (self.entries.fetchRemove(key)) |kv| {
            // Clean up allocated data
            switch (kv.value.data) {
                .code => |code| self.allocator.free(code),
                else => {},
            }
            
            self.current_size -= kv.value.size;
            self.lru_list.remove(key);
        }
    }
    
    fn evict_lru(self: *L1Cache) bool {
        if (self.lru_list.get_lru()) |lru_key| {
            self.remove_internal(lru_key);
            return true;
        }
        return false;
    }
    
    pub fn invalidate_by_address(self: *L1Cache, address: Address) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        var keys_to_remove = std.ArrayList(CacheKey).init(self.allocator);
        defer keys_to_remove.deinit();
        
        var iterator = self.entries.iterator();
        while (iterator.next()) |entry| {
            if (entry.key_ptr.get_address()) |entry_address| {
                if (std.mem.eql(u8, &entry_address.bytes, &address.bytes)) {
                    keys_to_remove.append(entry.key_ptr.*) catch continue;
                }
            }
        }
        
        for (keys_to_remove.items) |key| {
            self.remove_internal(key);
        }
    }
    
    pub fn clear(self: *L1Cache) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        // Clean up all allocated data
        var iterator = self.entries.iterator();
        while (iterator.next()) |entry| {
            switch (entry.value_ptr.data) {
                .code => |code| self.allocator.free(code),
                else => {},
            }
        }
        
        self.entries.clearRetainingCapacity();
        self.lru_list.clear();
        self.current_size = 0;
    }
    
    pub fn get_size_bytes(self: *L1Cache) usize {
        self.mutex.lockShared();
        defer self.mutex.unlockShared();
        
        return self.current_size;
    }
    
    pub fn get_entry_count(self: *L1Cache) u32 {
        self.mutex.lockShared();
        defer self.mutex.unlockShared();
        
        return @intCast(u32, self.entries.count());
    }
};

pub const LRUList = struct {
    allocator: std.mem.Allocator,
    head: ?*LRUNode,
    tail: ?*LRUNode,
    nodes: std.HashMap(CacheKey, *LRUNode, L1Cache.CacheKeyContext, std.hash_map.default_max_load_percentage),
    
    pub const LRUNode = struct {
        key: CacheKey,
        prev: ?*LRUNode,
        next: ?*LRUNode,
    };
    
    pub fn init(allocator: std.mem.Allocator) LRUList {
        return LRUList{
            .allocator = allocator,
            .head = null,
            .tail = null,
            .nodes = std.HashMap(CacheKey, *LRUNode, L1Cache.CacheKeyContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
    }
    
    pub fn deinit(self: *LRUList) void {
        self.clear();
        self.nodes.deinit();
    }
    
    pub fn add_to_front(self: *LRUList, key: CacheKey) !void {
        const node = try self.allocator.create(LRUNode);
        node.* = LRUNode{
            .key = key,
            .prev = null,
            .next = self.head,
        };
        
        if (self.head) |head| {
            head.prev = node;
        } else {
            self.tail = node;
        }
        
        self.head = node;
        try self.nodes.put(key, node);
    }
    
    pub fn move_to_front(self: *LRUList, key: CacheKey) void {
        if (self.nodes.get(key)) |node| {
            // Remove from current position
            if (node.prev) |prev| {
                prev.next = node.next;
            } else {
                self.head = node.next;
            }
            
            if (node.next) |next| {
                next.prev = node.prev;
            } else {
                self.tail = node.prev;
            }
            
            // Move to front
            node.prev = null;
            node.next = self.head;
            
            if (self.head) |head| {
                head.prev = node;
            } else {
                self.tail = node;
            }
            
            self.head = node;
        }
    }
    
    pub fn remove(self: *LRUList, key: CacheKey) void {
        if (self.nodes.fetchRemove(key)) |kv| {
            const node = kv.value;
            
            if (node.prev) |prev| {
                prev.next = node.next;
            } else {
                self.head = node.next;
            }
            
            if (node.next) |next| {
                next.prev = node.prev;
            } else {
                self.tail = node.prev;
            }
            
            self.allocator.destroy(node);
        }
    }
    
    pub fn get_lru(self: *LRUList) ?CacheKey {
        if (self.tail) |tail| {
            return tail.key;
        }
        return null;
    }
    
    pub fn clear(self: *LRUList) void {
        var current = self.head;
        while (current) |node| {
            const next = node.next;
            self.allocator.destroy(node);
            current = next;
        }
        
        self.head = null;
        self.tail = null;
        self.nodes.clearRetainingCapacity();
    }
};
```

#### 4. Cache Statistics and Monitoring
```zig
pub const CacheStatistics = struct {
    l1_hits: u64,
    l2_hits: u64,
    l3_hits: u64,
    misses: u64,
    writes: u64,
    invalidations: u64,
    evictions: u64,
    flushes: u64,
    start_time: i64,
    
    pub const CacheLevel = enum {
        L1,
        L2,
        L3,
    };
    
    pub fn init() CacheStatistics {
        return CacheStatistics{
            .l1_hits = 0,
            .l2_hits = 0,
            .l3_hits = 0,
            .misses = 0,
            .writes = 0,
            .invalidations = 0,
            .evictions = 0,
            .flushes = 0,
            .start_time = std.time.milliTimestamp(),
        };
    }
    
    pub fn record_hit(self: *CacheStatistics, level: CacheLevel) void {
        switch (level) {
            .L1 => self.l1_hits += 1,
            .L2 => self.l2_hits += 1,
            .L3 => self.l3_hits += 1,
        }
    }
    
    pub fn record_miss(self: *CacheStatistics) void {
        self.misses += 1;
    }
    
    pub fn record_write(self: *CacheStatistics) void {
        self.writes += 1;
    }
    
    pub fn record_invalidation(self: *CacheStatistics) void {
        self.invalidations += 1;
    }
    
    pub fn record_eviction(self: *CacheStatistics) void {
        self.evictions += 1;
    }
    
    pub fn record_flush(self: *CacheStatistics) void {
        self.flushes += 1;
    }
    
    pub fn get_total_hits(self: *const CacheStatistics) u64 {
        return self.l1_hits + self.l2_hits + self.l3_hits;
    }
    
    pub fn get_total_requests(self: *const CacheStatistics) u64 {
        return self.get_total_hits() + self.misses;
    }
    
    pub fn get_hit_rate(self: *const CacheStatistics) f64 {
        const total_requests = self.get_total_requests();
        return if (total_requests > 0)
            @as(f64, @floatFromInt(self.get_total_hits())) / @as(f64, @floatFromInt(total_requests))
        else
            0.0;
    }
    
    pub fn get_l1_hit_rate(self: *const CacheStatistics) f64 {
        const total_requests = self.get_total_requests();
        return if (total_requests > 0)
            @as(f64, @floatFromInt(self.l1_hits)) / @as(f64, @floatFromInt(total_requests))
        else
            0.0;
    }
    
    pub fn get_miss_rate(self: *const CacheStatistics) f64 {
        return 1.0 - self.get_hit_rate();
    }
    
    pub fn get_uptime_seconds(self: *const CacheStatistics) f64 {
        const now = std.time.milliTimestamp();
        return @as(f64, @floatFromInt(now - self.start_time)) / 1000.0;
    }
    
    pub fn get_requests_per_second(self: *const CacheStatistics) f64 {
        const uptime = self.get_uptime_seconds();
        return if (uptime > 0)
            @as(f64, @floatFromInt(self.get_total_requests())) / uptime
        else
            0.0;
    }
    
    pub fn print_summary(self: *const CacheStatistics) void {
        const hit_rate = self.get_hit_rate() * 100.0;
        const l1_hit_rate = self.get_l1_hit_rate() * 100.0;
        const miss_rate = self.get_miss_rate() * 100.0;
        const rps = self.get_requests_per_second();
        
        std.log.info("=== CACHE STATISTICS ===");
        std.log.info("L1 Hits: {} ({d:.2}%)", .{ self.l1_hits, l1_hit_rate });
        std.log.info("L2 Hits: {}", .{self.l2_hits});
        std.log.info("L3 Hits: {}", .{self.l3_hits});
        std.log.info("Misses: {} ({d:.2}%)", .{ self.misses, miss_rate });
        std.log.info("Overall Hit Rate: {d:.2}%", .{hit_rate});
        std.log.info("Writes: {}", .{self.writes});
        std.log.info("Invalidations: {}", .{self.invalidations});
        std.log.info("Evictions: {}", .{self.evictions});
        std.log.info("Flushes: {}", .{self.flushes});
        std.log.info("Requests/sec: {d:.2}", .{rps});
        std.log.info("Uptime: {d:.2}s", .{self.get_uptime_seconds()});
    }
};
```

#### 5. Consistency Manager
```zig
pub const ConsistencyManager = struct {
    allocator: std.mem.Allocator,
    mode: StateCacheManager.CacheConfig.ConsistencyMode,
    update_log: std.ArrayList(ConsistencyUpdate),
    invalidation_queue: std.ArrayList(CacheKey),
    mutex: std.Thread.Mutex,
    
    pub const ConsistencyUpdate = struct {
        key: CacheKey,
        timestamp: i64,
        update_type: UpdateType,
        
        pub const UpdateType = enum {
            Write,
            Delete,
            Invalidate,
        };
    };
    
    pub fn init(allocator: std.mem.Allocator, mode: StateCacheManager.CacheConfig.ConsistencyMode) ConsistencyManager {
        return ConsistencyManager{
            .allocator = allocator,
            .mode = mode,
            .update_log = std.ArrayList(ConsistencyUpdate).init(allocator),
            .invalidation_queue = std.ArrayList(CacheKey).init(allocator),
            .mutex = std.Thread.Mutex{},
        };
    }
    
    pub fn deinit(self: *ConsistencyManager) void {
        self.update_log.deinit();
        self.invalidation_queue.deinit();
    }
    
    pub fn track_update(self: *ConsistencyManager, key: CacheKey) !void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        const update = ConsistencyUpdate{
            .key = key,
            .timestamp = std.time.milliTimestamp(),
            .update_type = .Write,
        };
        
        try self.update_log.append(update);
        
        // Handle consistency based on mode
        switch (self.mode) {
            .Strong => {
                // Immediate consistency - no additional action needed
                // Cache is updated synchronously
            },
            .Eventual => {
                // Queue for eventual invalidation
                try self.invalidation_queue.append(key);
            },
            .Weak => {
                // Manual consistency - just log
            },
        }
    }
    
    pub fn track_invalidation(self: *ConsistencyManager, key: CacheKey) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        const update = ConsistencyUpdate{
            .key = key,
            .timestamp = std.time.milliTimestamp(),
            .update_type = .Invalidate,
        };
        
        self.update_log.append(update) catch {};
    }
    
    pub fn track_address_invalidation(self: *ConsistencyManager, address: Address) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        // Find all updates related to this address and mark for invalidation
        for (self.update_log.items) |*update| {
            if (update.key.get_address()) |update_address| {
                if (std.mem.eql(u8, &update_address.bytes, &address.bytes)) {
                    update.update_type = .Invalidate;
                }
            }
        }
    }
    
    pub fn process_pending_invalidations(self: *ConsistencyManager, cache_manager: *StateCacheManager) !void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        for (self.invalidation_queue.items) |key| {
            cache_manager.invalidate(key);
        }
        
        self.invalidation_queue.clearRetainingCapacity();
    }
    
    pub fn clear(self: *ConsistencyManager) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        self.update_log.clearRetainingCapacity();
        self.invalidation_queue.clearRetainingCapacity();
    }
    
    pub fn get_consistency_report(self: *ConsistencyManager) ConsistencyReport {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        var writes: u32 = 0;
        var deletes: u32 = 0;
        var invalidates: u32 = 0;
        
        for (self.update_log.items) |update| {
            switch (update.update_type) {
                .Write => writes += 1,
                .Delete => deletes += 1,
                .Invalidate => invalidates += 1,
            }
        }
        
        return ConsistencyReport{
            .total_updates = @intCast(u32, self.update_log.items.len),
            .pending_invalidations = @intCast(u32, self.invalidation_queue.items.len),
            .writes = writes,
            .deletes = deletes,
            .invalidates = invalidates,
            .consistency_mode = self.mode,
        };
    }
    
    pub const ConsistencyReport = struct {
        total_updates: u32,
        pending_invalidations: u32,
        writes: u32,
        deletes: u32,
        invalidates: u32,
        consistency_mode: StateCacheManager.CacheConfig.ConsistencyMode,
    };
};

pub const CacheError = error{
    CacheFull,
    KeyNotFound,
    InvalidKey,
    CompressionFailed,
    DecompressionFailed,
    SerializationFailed,
    DeserializationFailed,
    ConsistencyViolation,
    EvictionFailed,
    LockTimeout,
};
```

## Implementation Requirements

### Core Functionality
1. **Multi-Level Caching**: L1 (hot), L2 (warm), L3 (cold) cache levels
2. **Intelligent Eviction**: LRU, LFU, and adaptive eviction policies
3. **Consistency Management**: Strong, eventual, and weak consistency modes
4. **Compression Support**: Optional compression for L2 and L3 caches
5. **Statistics and Monitoring**: Comprehensive cache performance metrics
6. **Thread Safety**: Concurrent read/write operations with minimal locking

## Implementation Tasks

### Task 1: Implement L2 and L3 Cache Levels
File: `/src/evm/state_cache/l2_cache.zig`
```zig
const std = @import("std");
const CacheEntry = @import("cache_entry.zig").CacheEntry;
const CacheKey = @import("cache_key.zig").CacheKey;
const CompressionManager = @import("compression_manager.zig").CompressionManager;

pub const L2Cache = struct {
    allocator: std.mem.Allocator,
    config: StateCacheManager.CacheConfig,
    entries: std.HashMap(CacheKey, CompressedEntry, L1Cache.CacheKeyContext, std.hash_map.default_max_load_percentage),
    compression: CompressionManager,
    current_size: usize,
    mutex: std.Thread.RwLock,
    
    pub const CompressedEntry = struct {
        key: CacheKey,
        compressed_data: []const u8,
        original_size: usize,
        compressed_size: usize,
        timestamp: i64,
        access_count: u64,
        last_access: i64,
        ttl: i64,
        
        pub fn decompress(self: *const CompressedEntry, allocator: std.mem.Allocator, compression: *CompressionManager) !CacheEntry {
            const decompressed_data = try compression.decompress(self.compressed_data, allocator);
            defer allocator.free(decompressed_data);
            
            // Deserialize the cache entry
            return try self.deserialize_entry(decompressed_data);
        }
        
        fn deserialize_entry(self: *const CompressedEntry, data: []const u8) !CacheEntry {
            // Simplified deserialization - would use proper serialization format
            return CacheEntry{
                .key = self.key,
                .data = undefined, // Would deserialize from data
                .size = self.original_size,
                .timestamp = self.timestamp,
                .access_count = self.access_count,
                .last_access = self.last_access,
                .ttl = self.ttl,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: StateCacheManager.CacheConfig) L2Cache {
        return L2Cache{
            .allocator = allocator,
            .config = config,
            .entries = std.HashMap(CacheKey, CompressedEntry, L1Cache.CacheKeyContext, std.hash_map.default_max_load_percentage).init(allocator),
            .compression = CompressionManager.init(allocator),
            .current_size = 0,
            .mutex = std.Thread.RwLock{},
        };
    }
    
    pub fn deinit(self: *L2Cache) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        var iterator = self.entries.iterator();
        while (iterator.next()) |entry| {
            self.allocator.free(entry.value_ptr.compressed_data);
        }
        
        self.entries.deinit();
        self.compression.deinit();
    }
    
    pub fn get(self: *L2Cache, key: CacheKey) ?CacheEntry {
        self.mutex.lockShared();
        defer self.mutex.unlockShared();
        
        if (self.entries.getPtr(key)) |compressed_entry| {
            // Decompress and return entry
            const entry = compressed_entry.decompress(self.allocator, &self.compression) catch return null;
            
            // Update access information
            compressed_entry.access_count += 1;
            compressed_entry.last_access = std.time.milliTimestamp();
            
            return entry;
        }
        
        return null;
    }
    
    pub fn put(self: *L2Cache, key: CacheKey, entry: CacheEntry) !void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        // Serialize and compress the entry
        const serialized = try self.serialize_entry(entry);
        defer self.allocator.free(serialized);
        
        const compressed = try self.compression.compress(serialized);
        
        const compressed_entry = CompressedEntry{
            .key = key,
            .compressed_data = compressed,
            .original_size = entry.size,
            .compressed_size = compressed.len,
            .timestamp = entry.timestamp,
            .access_count = entry.access_count,
            .last_access = entry.last_access,
            .ttl = entry.ttl,
        };
        
        // Check size limits and evict if necessary
        while (self.current_size + compressed.len > self.config.l2_max_size_bytes or
               self.entries.count() >= self.config.l2_max_entries) {
            
            if (!self.evict_oldest()) {
                return CacheError.CacheFull;
            }
        }
        
        try self.entries.put(key, compressed_entry);
        self.current_size += compressed.len;
    }
    
    pub fn remove(self: *L2Cache, key: CacheKey) void {
        self.mutex.lock();
        defer self.mutex.unlock();
        
        if (self.entries.fetchRemove(key)) |kv| {
            self.allocator.free(kv.value.compressed_data);
            self.current_size -= kv.value.compressed_size;
        }
    }
    
    fn serialize_entry(self: *L2Cache, entry: CacheEntry) ![]u8 {
        // Simplified serialization - would use proper format like MessagePack
        var buffer = std.ArrayList(u8).init(self.allocator);
        defer buffer.deinit();
        
        // Serialize entry data based on type
        switch (entry.data) {
            .account => |account| {
                try buffer.appendSlice(std.mem.asBytes(&account));
            },
            .storage => |value| {
                try buffer.appendSlice(std.mem.asBytes(&value));
            },
            .code => |code| {
                try buffer.appendSlice(code);
            },
            .code_hash => |hash| {
                try buffer.appendSlice(&hash.bytes);
            },
        }
        
        return buffer.toOwnedSlice();
    }
    
    fn evict_oldest(self: *L2Cache) bool {
        var oldest_key: ?CacheKey = null;
        var oldest_time: i64 = std.math.maxInt(i64);
        
        var iterator = self.entries.iterator();
        while (iterator.next()) |entry| {
            if (entry.value_ptr.last_access < oldest_time) {
                oldest_time = entry.value_ptr.last_access;
                oldest_key = entry.key_ptr.*;
            }
        }
        
        if (oldest_key) |key| {
            self.remove(key);
            return true;
        }
        
        return false;
    }
    
    // Additional methods similar to L1Cache...
};
```

### Task 2: Integrate with State Management
File: `/src/evm/state/cached_state.zig`
```zig
const std = @import("std");
const StateInterface = @import("state_interface.zig").StateInterface;
const StateCacheManager = @import("../state_cache/state_cache_manager.zig").StateCacheManager;

pub const CachedState = struct {
    allocator: std.mem.Allocator,
    backend_state: StateInterface,
    cache_manager: StateCacheManager,
    write_through: bool,
    
    pub fn init(
        allocator: std.mem.Allocator,
        backend_state: StateInterface,
        cache_config: StateCacheManager.CacheConfig
    ) CachedState {
        return CachedState{
            .allocator = allocator,
            .backend_state = backend_state,
            .cache_manager = StateCacheManager.init(allocator, cache_config),
            .write_through = cache_config.consistency_mode == .Strong,
        };
    }
    
    pub fn deinit(self: *CachedState) void {
        self.cache_manager.deinit();
    }
    
    pub fn get_account(self: *CachedState, address: Address) !Account {
        // Try cache first
        if (self.cache_manager.get_account(address)) |account| {
            return account;
        }
        
        // Cache miss - get from backend
        const account = try self.backend_state.get_account(address);
        
        // Store in cache
        self.cache_manager.set_account(address, account) catch |err| {
            std.log.warn("Failed to cache account {}: {}", .{ address, err });
        };
        
        return account;
    }
    
    pub fn set_account(self: *CachedState, address: Address, account: Account) !void {
        // Update cache
        try self.cache_manager.set_account(address, account);
        
        // Write through to backend if enabled
        if (self.write_through) {
            try self.backend_state.set_account(address, account);
        }
    }
    
    pub fn get_storage(self: *CachedState, address: Address, key: U256) !U256 {
        // Try cache first
        if (self.cache_manager.get_storage(address, key)) |value| {
            return value;
        }
        
        // Cache miss - get from backend
        const value = try self.backend_state.get_storage(address, key);
        
        // Store in cache
        self.cache_manager.set_storage(address, key, value) catch |err| {
            std.log.warn("Failed to cache storage {}.{}: {}", .{ address, key, err });
        };
        
        return value;
    }
    
    pub fn set_storage(self: *CachedState, address: Address, key: U256, value: U256) !void {
        // Update cache
        try self.cache_manager.set_storage(address, key, value);
        
        // Write through to backend if enabled
        if (self.write_through) {
            try self.backend_state.set_storage(address, key, value);
        }
    }
    
    pub fn flush_cache(self: *CachedState) !void {
        // Write all pending changes to backend
        // This would require implementing a write buffer
        
        // Clear cache
        self.cache_manager.flush_all();
    }
    
    pub fn get_cache_statistics(self: *const CachedState) StateCacheManager.CacheStatistics {
        return self.cache_manager.get_statistics();
    }
    
    pub fn optimize_cache(self: *CachedState) !void {
        try self.cache_manager.optimize_cache();
    }
};
```

### Task 3: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const CachedState = @import("state/cached_state.zig").CachedState;
const StateCacheManager = @import("state_cache/state_cache_manager.zig").StateCacheManager;

pub const Vm = struct {
    // Existing fields...
    cached_state: ?CachedState,
    cache_enabled: bool,
    
    pub fn enable_state_caching(self: *Vm, cache_config: StateCacheManager.CacheConfig) !void {
        const cached_state = CachedState.init(self.allocator, self.state, cache_config);
        self.cached_state = cached_state;
        self.cache_enabled = true;
    }
    
    pub fn disable_state_caching(self: *Vm) void {
        if (self.cached_state) |*cached| {
            cached.deinit();
            self.cached_state = null;
        }
        self.cache_enabled = false;
    }
    
    pub fn get_state_access(self: *Vm) StateInterface {
        if (self.cached_state) |*cached| {
            return StateInterface.init(cached);
        } else {
            return self.state;
        }
    }
    
    pub fn get_cache_report(self: *Vm) ?StateCacheManager.CacheStatistics {
        if (self.cached_state) |*cached| {
            return cached.get_cache_statistics();
        }
        return null;
    }
    
    pub fn optimize_state_cache(self: *Vm) !void {
        if (self.cached_state) |*cached| {
            try cached.optimize_cache();
        }
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/state_cache/state_caching_test.zig`

### Test Cases
```zig
test "cache manager initialization and configuration" {
    // Test cache manager creation with different configs
    // Test multi-level cache setup
    // Test configuration validation
}

test "basic cache operations" {
    // Test cache hit/miss scenarios
    // Test cache eviction policies
    // Test TTL expiration
}

test "multi-level cache promotion" {
    // Test L3 to L2 to L1 promotion
    // Test access pattern optimization
    // Test cache level statistics
}

test "cache consistency" {
    // Test strong consistency mode
    // Test eventual consistency mode
    // Test cache invalidation
}

test "performance benchmarks" {
    // Test cache vs non-cache performance
    // Test memory usage efficiency
    // Test eviction policy effectiveness
}

test "concurrent access" {
    // Test thread safety
    // Test concurrent read/write operations
    // Test lock contention
}

test "integration with state operations" {
    // Test cached state integration
    // Test VM integration
    // Test execution performance impact
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/state_cache/state_cache_manager.zig` - Main cache management system
- `/src/evm/state_cache/cache_key.zig` - Cache key definitions and utilities
- `/src/evm/state_cache/cache_entry.zig` - Cache entry structure and operations
- `/src/evm/state_cache/l1_cache.zig` - L1 cache implementation (hot data)
- `/src/evm/state_cache/l2_cache.zig` - L2 cache implementation (warm data)
- `/src/evm/state_cache/l3_cache.zig` - L3 cache implementation (cold data)
- `/src/evm/state_cache/eviction_policy.zig` - Cache eviction algorithms
- `/src/evm/state_cache/consistency_manager.zig` - Cache consistency management
- `/src/evm/state_cache/compression_manager.zig` - Data compression for L2/L3
- `/src/evm/state_cache/cache_statistics.zig` - Cache performance monitoring
- `/src/evm/state/cached_state.zig` - State interface with caching
- `/src/evm/vm.zig` - VM integration with cached state
- `/test/evm/state_cache/state_caching_test.zig` - Comprehensive tests

## Success Criteria

1. **Performance Improvement**: Significant speedup for repeated state access
2. **Memory Efficiency**: Optimal memory usage with effective eviction
3. **Cache Hit Rate**: High cache hit rates (>80%) for typical workloads
4. **Consistency**: Correct cache invalidation and consistency management
5. **Scalability**: Handles large state sets without memory exhaustion
6. **Integration**: Seamless integration with existing state management

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Memory safety** - No memory leaks or buffer overflows
3. **Data consistency** - Cache must never serve stale data in strong consistency mode
4. **Performance** - Cache should improve, not degrade performance
5. **Thread safety** - Concurrent access must be safe and efficient
6. **Backward compatibility** - Existing state operations must continue working

## References

- [Cache Replacement Policies](https://en.wikipedia.org/wiki/Cache_replacement_policies) - LRU, LFU, and other eviction strategies
- [Multi-Level Caching](https://en.wikipedia.org/wiki/Cache_hierarchy) - Cache hierarchy design
- [Cache Coherence](https://en.wikipedia.org/wiki/Cache_coherence) - Consistency in multi-level caches
- [Write-Through vs Write-Back](https://en.wikipedia.org/wiki/Cache_(computing)#Writing_policies) - Cache writing strategies
- [Memory Management](https://en.wikipedia.org/wiki/Memory_management) - Efficient memory utilization patterns