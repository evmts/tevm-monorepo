# Implement State Caching

You are implementing State Caching for the Tevm EVM written in Zig. Your goal is to implement intelligent state caching to optimize performance following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_state_caching` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_state_caching feat_implement_state_caching`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement an intelligent state caching layer that provides fast access to frequently accessed state data while maintaining consistency and memory efficiency. This includes multi-level caching, cache invalidation strategies, LRU eviction policies, and integration with both synchronous and asynchronous state backends.

## ELI5

Imagine you're a librarian who gets asked for the same popular books over and over. Instead of walking to the back storage room every time, you keep the most requested books on a shelf right next to your desk for quick access. State caching works similarly - it keeps frequently accessed blockchain data (like account balances, smart contract storage, and code) in fast memory instead of always fetching it from slower storage. The enhanced version is like having multiple shelves: a tiny "express shelf" for the most popular items, a medium shelf for somewhat popular items, and smart rules that automatically move books between shelves based on how often they're requested. It also has a "librarian assistant" that can predict what books might be needed next and fetch them in advance, plus safety rules to ensure you never give someone an outdated version of a book when the original has been updated.

## Reference Implementations

### geth

<explanation>
The go-ethereum implementation demonstrates a sophisticated multi-tier state caching architecture with LRU eviction, concurrent prefetching, memory pooling, and hierarchical layer management. Key patterns include StateDB object caching, trie prefetching with background goroutines, PathDB layer-based caching, and FastCache integration for high-performance memory management.
</explanation>

**LRU Cache Implementation** - `/go-ethereum/common/lru/lru.go` (lines 22-50):
```go
// Cache is a thread-safe fixed size LRU cache.
type Cache[K comparable, V any] struct {
	cache map[K]*list.Element[*entry[K, V]]
	lru   *list.List[*entry[K, V]] // LRU list of cache entries
	cap   int
	mu    sync.Mutex
}

type entry[K comparable, V any] struct {
	key K
	val V
}

// Add adds a value to the cache. Returns true if an eviction occurred.
func (c *Cache[K, V]) Add(key K, value V) (evicted bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Check for existing item
	if ent, ok := c.cache[key]; ok {
		c.lru.MoveToFront(ent)
		ent.Value.val = value
		return false
	}
	// Add new item
	ent := &entry[K, V]{key, value}
	entry := c.lru.PushFront(ent)
	c.cache[key] = entry

	evict := c.lru.Len() > c.cap
	// Verify size not exceeded
	if evict {
		c.removeOldest()
	}
	return evict
}
```

**StateDB Multi-Level Caching** - `/go-ethereum/core/state/statedb.go` (lines 85-120):
```go
// StateDB structs within the ethereum protocol are used to store anything
// within the merkle trie. StateDBs take care of caching and storing
// nested states. It's the general query interface to retrieve:
//
// * Contracts
// * Accounts
// * Storage
type StateDB struct {
	db         Database
	prefetcher *triePrefetcher
	trie       Trie
	hasher     crypto.KeccakState

	// Original root before any changes were made
	originalRoot common.Hash

	// Live objects cache
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{} // State objects modified in the current execution

	// State objects that have been destroyed in the current block
	stateObjectsDestruct map[common.Address]*stateObject

	// Per-transaction access list
	accessList *accessList

	// Transient storage
	transientStorage transientStorage

	// Journal of state modifications. This is the backbone of
	// Snapshot and RevertToSnapshot.
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
	SnapshotAccountReads time.Duration
	SnapshotStorageReads time.Duration
	SnapshotCommits      time.Duration
	TrieDBCommits        time.Duration

	AccountUpdated int
	StorageUpdated int
	AccountDeleted int
	StorageDeleted int
}
```

**State Object Storage Caching** - `/go-ethereum/core/state/state_object.go` (lines 49-75):
```go
type stateObject struct {
	db       *StateDB
	address  common.Address      // address of ethereum account
	addrHash common.Hash         // hash of ethereum address of the account
	data     types.StateAccount  // cached account data
	origin   *types.StateAccount // Account original data without any change applied, nil means it was not existent

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access

	code Code // contract bytecode, which gets set when code is loaded

	// Storage cache of original entries to dedup rewrites
	originStorage Storage
	// Storage cache of dirty storage which is also
	// used for pending storage modifications
	pendingStorage Storage
	// Storage entries which need to be flushed to disk, at the end of an entire block
	dirtyStorage Storage

	// Cache flags.
	dirtyCode bool // true if the code was updated

	// Flag whether the account was marked as self-destructed. The self-destructed account
	// is still accessible in the scope of same transaction.
	selfDestructed bool

	// Flag whether the account was marked as deleted. A self-destructed account
	// or an account that is considered as empty will be marked as deleted at
	// the end of transaction and no longer accessible afterwards.
	deleted bool

	// Flag whether the object was created in the current transaction
	created bool
}
```

**Trie Prefetching System** - `/go-ethereum/core/state/trie_prefetcher.go` (lines 55-95):
```go
// triePrefetcher is an active prefetcher, which receives accounts or storage
// items and does trie-loading of them. The goal is to get as much useful content
// into the caches as possible.
//
// Note, the prefetcher's API is not thread safe.
type triePrefetcher struct {
	db       Database // Database to fetch trie nodes through
	root     common.Hash
	fetchers map[string]*subfetcher // Active prefetchers for each trie

	deliveryMissMeter metrics.Meter
	accountLoadMeter  metrics.Meter
	accountDupMeter   metrics.Meter
	accountSkipMeter  metrics.Meter
	accountWasteMeter metrics.Meter
	storageLoadMeter  metrics.Meter
	storageDupMeter   metrics.Meter
	storageSkipMeter  metrics.Meter
	storageWasteMeter metrics.Meter
}

// prefetch schedules a batch of trie items to prefetch.
func (p *triePrefetcher) prefetch(owner common.Hash, root common.Hash, addr common.Address, keys [][]byte, read func(key []byte) []byte) {
	// If the prefetcher is an inactive one, bail out
	if p == nil {
		return
	}
	id := p.trieID(owner, root)
	fetcher := p.fetchers[id]
	if fetcher == nil {
		fetcher = newSubfetcher(p.db, p.root, owner, root, addr)
		p.fetchers[id] = fetcher
	}
	fetcher.schedule(keys, read)
}
```

**PathDB Layer Management** - `/go-ethereum/triedb/pathdb/database.go` (lines 85-110):
```go
// Database is a multiple-layered structure for maintaining in-memory trie nodes.
// It consists of one persistent base layer backed by a key-value store, on top
// of which arbitrarily many diff layers are stacked. The memory usage of diff
// layers is controlled with a configured threshold.
type Database struct {
	// readOnly is the flag whether the mutation is allowed to be applied.
	// It will be set to true if the associated state is regarded as corrupted.
	readOnly   bool
	bufferSize int
	config     *Config
	diskdb     ethdb.Database
	tree       *layerTree
	freezer    *rawdb.ResettableFreezer

	// Node cache, clean nodes
	cleans  *fastcache.Cache
	// State cache, clean states
	stateCleans *fastcache.Cache

	lock   sync.RWMutex
	waitSync bool
	closeOnce sync.Once
}

// layerTree is a specialized trie for managing diff layers. It maintains
// a tree structure where each node represents a diff layer, allowing
// for efficient traversal and management of the layer hierarchy.
type layerTree struct {
	lock   sync.RWMutex
	layers map[common.Hash]layer
}
```

**Memory Pool Pattern** - `/go-ethereum/trie/bytepool.go` (lines 24-45):
```go
// bytesPool is a byte slice pool for reusing allocations.
type bytesPool struct {
	c chan []byte
	w int
}

// newBytesPool returns a slice pool of the given width. The pool
// will create slices of the given width and reuse them if they
// are returned via Put.
func newBytesPool(sliceCap, nitems int) *bytesPool {
	return &bytesPool{
		c: make(chan []byte, nitems),
		w: sliceCap,
	}
}

// Get returns a slice of the pool width or creates a new one if none
// are available.
func (bp *bytesPool) Get() []byte {
	select {
	case b := <-bp.c:
		return b
	default:
		return make([]byte, 0, bp.w)
	}
}

// Put returns a slice back to the pool if it has the expected width.
func (bp *bytesPool) Put(b []byte) {
	if cap(b) != bp.w {
		return
	}
	select {
	case bp.c <- b[:0]:
	default:
	}
}
```

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

#### 1. **Unit Tests** (`/test/evm/state/state_caching_test.zig`)
```zig
// Test basic state caching functionality
test "state_caching basic cache operations with known scenarios"
test "state_caching handles cache hit/miss correctly"
test "state_caching validates cache invalidation rules"
test "state_caching produces expected cache performance"
```

#### 2. **Integration Tests**
```zig
test "state_caching integrates with EVM state operations"
test "state_caching works with existing storage systems"
test "state_caching maintains state consistency"
test "state_caching handles cache coherency across operations"
```

#### 3. **Performance Tests**
```zig
test "state_caching meets cache performance targets"
test "state_caching hit ratio optimization vs baseline"
test "state_caching scalability under high state access load"
test "state_caching benchmark cache eviction strategies"
```

#### 4. **Error Handling Tests**
```zig
test "state_caching proper cache failure error handling"
test "state_caching handles cache corruption gracefully"
test "state_caching graceful degradation on cache system failures"
test "state_caching recovery from cache inconsistency"
```

#### 5. **Compliance Tests**
```zig
test "state_caching EVM specification state consistency compliance"
test "state_caching cross-client state behavior consistency"
test "state_caching hardfork state rule adherence"
test "state_caching deterministic state access behavior"
```

#### 6. **Security Tests**
```zig
test "state_caching handles malicious cache access patterns safely"
test "state_caching prevents cache timing attacks"
test "state_caching validates cache-based information leakage prevention"
test "state_caching maintains cache isolation properties"
```

### Test Development Priority
1. **Core caching functionality tests** - Ensure basic cache operations work
2. **Compliance tests** - Meet EVM specification state consistency requirements
3. **Performance tests** - Achieve cache efficiency and hit ratio targets
4. **Security tests** - Prevent cache-related vulnerabilities
5. **Error handling tests** - Robust cache failure management
6. **Edge case tests** - Handle cache boundary conditions

### Test Data Sources
- **EVM specification**: Official state consistency requirements
- **Reference implementations**: Cross-client state caching compatibility data
- **Performance baselines**: Cache hit ratio and access speed measurements
- **Security test vectors**: Cache timing attack prevention cases
- **Real-world scenarios**: Production state access pattern validation

### Continuous Testing
- Run `zig build test-all` after every code change
- Maintain 100% test coverage for public state caching APIs
- Validate cache performance regression prevention
- Test debug and release builds with different cache configurations
- Verify cross-platform cache behavior consistency

### Test-First Examples

**Before writing any implementation:**
```zig
test "state_caching basic cache store and retrieve" {
    // This test MUST fail initially
    const cache = test_utils.createStateCache();
    const key = StateKey{ .address = test_address, .slot = 0 };
    const value: u256 = 42;
    
    state_caching.store(cache, key, value);
    const result = state_caching.retrieve(cache, key);
    try testing.expectEqual(value, result.?);
}
```

**Only then implement:**
```zig
pub const state_caching = struct {
    pub fn store(cache: *StateCache, key: StateKey, value: u256) !void {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
    
    pub fn retrieve(cache: *StateCache, key: StateKey) !?u256 {
        // Minimal implementation
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Notes
- **Never commit without passing tests** (`zig build test-all`)
- **Test all cache strategy combinations** - Especially for different eviction policies
- **Verify EVM specification compliance** - Critical for protocol state correctness
- **Test cache performance implications** - Especially for state access optimization
- **Validate cache security properties** - Prevent cache-based side-channel attacks

## References

- [Cache Replacement Policies](https://en.wikipedia.org/wiki/Cache_replacement_policies) - LRU, LFU, and other eviction strategies
- [Multi-Level Caching](https://en.wikipedia.org/wiki/Cache_hierarchy) - Cache hierarchy design
- [Cache Coherence](https://en.wikipedia.org/wiki/Cache_coherence) - Consistency in multi-level caches
- [Write-Through vs Write-Back](https://en.wikipedia.org/wiki/Cache_(computing)#Writing_policies) - Cache writing strategies
- [Memory Management](https://en.wikipedia.org/wiki/Memory_management) - Efficient memory utilization patterns

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/lru_cache.hpp">
```cpp
/// Least Recently Used (LRU) cache.
///
/// A map of Key to Value with a fixed capacity. When the cache is full, a newly inserted entry
/// replaces (evicts) the least recently used entry.
/// All operations have O(1) complexity.
template <typename Key, typename Value>
class LRUCache
{
    struct LRUEntry
    {
        /// Reference to the existing key in the map.
        const Key& key;

        /// The cached value.
        Value value;
    };

    using LRUList = std::list<LRUEntry>;
    using LRUIterator = typename LRUList::iterator;
    using Map = std::unordered_map<Key, LRUIterator>;

    /// The fixed capacity of the cache.
    const size_t capacity_;

    /// The list to order the cache entries by the usage. The front element is the least recently
    /// used entry.
    LRUList lru_list_;

    /// The map of Keys to Values indirectly via the LRU list.
    Map map_;

    /// Marks an element as the most recently used by moving it to the back of the LRU list.
    void move_to_back(LRUIterator it) noexcept { lru_list_.splice(lru_list_.end(), lru_list_, it); }

public:
    /// Constructs the LRU cache with the given capacity.
    explicit LRUCache(size_t capacity) : capacity_{capacity}
    {
        assert(capacity_ != 0);
        map_.reserve(capacity);
    }

    /// Retrieves the copy of the value associated with the specified key.
    std::optional<Value> get(const Key& key) noexcept
    {
        if (const auto it = map_.find(key); it != map_.end())
        {
            move_to_back(it->second);
            return it->second->value;
        }
        return {};
    }

    /// Inserts or updates the value associated with the specified key.
    void put(Key key, Value value)
    {
        if (map_.size() == capacity_)
        {
            auto lru_it = lru_list_.begin();

            auto node = map_.extract(lru_it->key);
            using std::swap;
            swap(node.key(), key);
            if (auto [it, inserted, node2] = map_.insert(std::move(node)); !inserted)
            {
                swap(key, node2.key());
                map_.insert(std::move(node2));
                lru_it = it->second;
            }
            lru_it->value = std::move(value);
            move_to_back(lru_it);
        }
        else
        {
            if (const auto [it, inserted] = map_.try_emplace(std::move(key)); !inserted)
            {
                it->second->value = std::move(value);
                move_to_back(it->second);
            }
            else
            {
                it->second =
                    lru_list_.emplace(lru_list_.end(), LRUEntry{it->first, std::move(value)});
            }
        }
    }
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

    /// Reference to original EVM code container.
    bytes_view original_code;

    evmc_status_code status = EVMC_SUCCESS;
    size_t output_offset = 0;
    size_t output_size = 0;

    /// Container to be deployed returned from RETURNCODE, used only inside EOFCREATE execution.
    std::optional<bytes> deploy_container;

private:
    evmc_tx_context m_tx = {};
    std::optional<std::unordered_map<evmc::bytes32, TransactionInitcode>> m_initcodes;

public:
    /// Pointer to code analysis.
    /// This should be set and used internally by execute() function of a particular interpreter.
    union
    {
        const baseline::CodeAnalysis* baseline = nullptr;
        const advanced::AdvancedCodeAnalysis* advanced;
    } analysis{};

    std::vector<const uint8_t*> call_stack;

    /// Stack space allocation.
    StackSpace stack_space;

    // ... methods ...
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/advanced_analysis.hpp">
```cpp
/// Compressed information about instruction basic block.
struct BlockInfo
{
    /// The total base gas cost of all instructions in the block.
    uint32_t gas_cost = 0;

    /// The stack height required to execute the block.
    int16_t stack_req = 0;

    /// The maximum stack height growth relative to the stack height at block start.
    int16_t stack_max_growth = 0;
};

struct AdvancedCodeAnalysis
{
    std::vector<Instruction> instrs;

    /// Storage for large push values.
    std::vector<intx::uint256> push_values;

    /// The offsets of JUMPDESTs in the original code.
    std::vector<int32_t> jumpdest_offsets;

    /// The indexes of the instructions in the generated instruction table
    /// matching the elements from jumdest_offsets.
    std::vector<int32_t> jumpdest_targets;
};

/// The execution state specialized for the Advanced interpreter.
struct AdvancedExecutionState : ExecutionState
{
    int64_t gas_left = 0;

    /// Pointer to the stack top.
    StackTop stack = stack_space.bottom();

    /// The gas cost of the current block.
    uint32_t current_block_cost = 0;

    // ... methods ...
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/state.hpp">
```cpp
/// The Ethereum State: the collection of accounts mapped by their addresses.
class State
{
    // JournalEntry definitions for various state changes...
    using JournalEntry =
        std::variant<JournalBalanceChange, JournalTouched, JournalStorageChange, JournalNonceBump,
            JournalCreate, JournalTransientStorageChange, JournalDestruct, JournalAccessAccount>;

    /// The read-only view of the initial (cold) state.
    const StateView& m_initial;

    /// The accounts loaded from the initial state and potentially modified.
    std::unordered_map<address, Account> m_modified;

    /// The state journal: the list of changes made to the state
    /// with information how to revert them.
    std::vector<JournalEntry> m_journal;

public:
    /// Returns the state journal checkpoint. It can be later used to in rollback()
    /// to revert changes newer than the checkpoint.
    [[nodiscard]] size_t checkpoint() const noexcept { return m_journal.size(); }

    /// Reverts state changes made after the checkpoint.
    void rollback(size_t checkpoint);

    // ... other methods ...
};

/// Transaction receipt contains information about a transaction execution result.
/// In this implementation it also contains the state diff which can be applied to the state.
struct TransactionReceipt
{
    Transaction::Type type = Transaction::Type::legacy;
    evmc_status_code status = EVMC_INTERNAL_ERROR;

    /// Amount of gas used by this transaction.
    int64_t gas_used = 0;

    /// Amount of gas used by this and previous transactions in the block.
    int64_t cumulative_gas_used = 0;
    std::vector<Log> logs;
    BloomFilter logs_bloom_filter;
    StateDiff state_diff;

    /// Root hash of the state after this transaction. Used only in old pre-Byzantium transactions.
    std::optional<bytes32> post_state;
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.hpp">
```cpp
class Tracer
{
    friend class VM;  // Has access the m_next_tracer to traverse the list forward.
    std::unique_ptr<Tracer> m_next_tracer;

public:
    virtual ~Tracer() = default;

    void notify_execution_start(
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept
    {
        on_execution_start(rev, msg, code);
        if (m_next_tracer)
            m_next_tracer->notify_execution_start(rev, msg, code);
    }

    void notify_execution_end(const evmc_result& result) noexcept
    {
        on_execution_end(result);
        if (m_next_tracer)
            m_next_tracer->notify_execution_end(result);
    }

    void notify_instruction_start(
        uint32_t pc, intx::uint256* stack_top, int stack_height, int64_t gas,
        const ExecutionState& state) noexcept
    {
        on_instruction_start(pc, stack_top, stack_height, gas, state);
        if (m_next_tracer)
            m_next_tracer->notify_instruction_start(pc, stack_top, stack_height, gas, state);
    }

private:
    virtual void on_execution_start(
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept = 0;
    virtual void on_instruction_start(uint32_t pc, const intx::uint256* stack_top, int stack_height,
        int64_t gas, const ExecutionState& state) noexcept = 0;
    virtual void on_execution_end(const evmc_result& result) noexcept = 0;
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/account.hpp">
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
    uint64_t nonce = 0;
    intx::uint256 balance;
    bytes32 code_hash = EMPTY_CODE_HASH;
    bool has_initial_storage = false;

    /// The cached and modified account storage entries.
    std::unordered_map<bytes32, StorageValue> storage;

    /// The EIP-1153 transient (transaction-level lifetime) storage.
    std::unordered_map<bytes32, bytes32> transient_storage;

    /// The cache of the account code.
    bytes code;

    bool destructed = false;
    bool erase_if_empty = false;
    bool just_created = false;
    bool code_changed = false;
    evmc_access_status access_status = EVMC_ACCESS_COLD;
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/vm.hpp">
```cpp
class VM : public evmc_vm
{
public:
    bool cgoto = EVMONE_CGOTO_SUPPORTED;
    bool validate_eof = false;

private:
    std::vector<ExecutionState> m_execution_states;
    std::unique_ptr<Tracer> m_first_tracer;

public:
    VM() noexcept;

    [[nodiscard]] ExecutionState& get_execution_state(size_t depth) noexcept
    {
        // Vector already has the capacity for all possible depths,
        // so reallocation never happens (therefore: noexcept).
        // The ExecutionStates are lazily created because they pre-allocate EVM memory and stack.
        assert(depth < m_execution_states.capacity());
        if (m_execution_states.size() <= depth)
            m_execution_states.resize(depth + 1);
        return m_execution_states[depth];
    }
};
```
</file>
</evmone>



## REVM Context

An analysis of the `revm` codebase reveals a robust caching and state management system that is highly relevant to your request. The most pertinent patterns are the `CacheDB` which acts as a caching layer over a generic `Database` trait, and the `Journal` which tracks state changes for transactional commits and reverts.

### `revm` Caching and State Management

`revm` implements state caching through its `CacheDB` struct, which wraps any type that implements the `Database` trait. This is directly analogous to your proposed `CachedState` wrapping a `StateInterface`. `CacheDB` uses in-memory `HashMap`s to cache accounts and their storage slots. When data is requested, it first checks the cache; on a miss, it queries the underlying database and populates the cache.

State modifications are handled through a `Journal`. Instead of directly modifying the state, all changes are recorded as `JournalEntry` items. This allows for efficient transaction rollbacks (`checkpoint_revert`) and commits (`checkpoint_commit`). When a transaction is finalized, the accumulated changes are applied to the `CacheDB` via the `DatabaseCommit` trait. This clear separation of concerns for caching, state access, and journaling is a powerful pattern for your implementation.

The following snippets provide the core components of this system.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/interface/src/lib.rs">
The `Database` and `DatabaseCommit` traits define the core abstraction for state storage, similar to the proposed `StateInterface`. Any caching layer should be built on top of this abstraction.

```rust
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
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/src/in_memory_db.rs">
`CacheDB` is `revm`'s primary caching layer. It wraps a generic `Database` and uses `HashMap`s to store `DbAccount`s and contract bytecodes. This demonstrates a practical, high-performance, in-memory caching strategy.

The `Database` implementation for `CacheDB` shows the read-through cache pattern: check the cache first, and if it's a miss, load from the underlying `db` and populate the cache.

The `DatabaseCommit` implementation shows how batched state changes from a transaction's execution are applied to the cache, updating account info and storage slots.

```rust
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

// ...

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
            // ... vacancy case ...
        }
    }
    // ... other methods ...
}


impl<ExtDB> DatabaseCommit for CacheDB<ExtDB> {
    fn commit(&mut self, changes: HashMap<Address, Account>) {
        for (address, mut account) in changes {
            if !account.is_touched() {
                continue;
            }
            if account.is_selfdestructed() {
                let db_account = self.cache.accounts.entry(address).or_default();
                db_account.storage.clear();
                db_account.account_state = AccountState::NotExisting;
                db_account.info = AccountInfo::default();
                continue;
            }
            let is_newly_created = account.is_created();
            self.insert_contract(&mut account.info);

            let db_account = self.cache.accounts.entry(address).or_default();
            db_account.info = account.info;

            db_account.account_state = if is_newly_created {
                db_account.storage.clear();
                AccountState::StorageCleared
            } else if db_account.account_state.is_storage_cleared() {
                // Preserve old account state if it already exists
                AccountState::StorageCleared
            } else {
                AccountState::Touched
            };
            db_account.storage.extend(
                account
                    .storage
                    .into_iter()
                    .map(|(key, value)| (key, value.present_value())),
            );
        }
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/state/src/lib.rs">
The `Account` struct and its associated `AccountStatus` enum are central to `revm`'s state management. `Account` holds the live state of an account during execution (info, storage, status flags). `AccountStatus` is critical for tracking the lifecycle of a cached item (e.g., `Loaded`, `Created`, `Touched`, `SelfDestructed`), which informs how changes are applied and reverted.

```rust
/// Account type used inside Journal to track changed to state.
#[derive(Debug, Clone, PartialEq, Eq, Default)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Account {
    /// Balance, nonce, and code
    pub info: AccountInfo,
    /// Transaction id, used to track when account was toched/loaded into journal.
    pub transaction_id: usize,
    /// Storage cache
    pub storage: EvmStorage,
    /// Account status flags
    pub status: AccountStatus,
}

// ... methods for managing Account state ...

// The `bitflags!` macro generates `struct`s that manage a set of flags.
bitflags! {
    /// Account status flags. Generated by bitflags crate.
    #[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
    #[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
    #[cfg_attr(feature = "serde", serde(transparent))]
    pub struct AccountStatus: u8 {
        /// When account is loaded but not touched or interacted with.
        /// This is the default state.
        const Loaded = 0b00000000;
        /// When account is newly created we will not access database
        /// to fetch storage values
        const Created = 0b00000001;
        /// If account is marked for self destruction.
        const SelfDestructed = 0b00000010;
        /// Only when account is marked as touched we will save it to database.
        const Touched = 0b00000100;
        /// used only for pre spurious dragon hardforks where existing and empty were two separate states.
        /// it became same state after EIP-161: State trie clearing
        const LoadedAsNotExisting = 0b0001000;
        /// used to mark account as cold
        const Cold = 0b0010000;
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/journal.rs">
The `Journal` is the mechanism for tracking state changes within a transaction. Every state modification (e.g., balance change, storage set, account creation) creates a `JournalEntry`. This allows for atomic transactions and efficient state reverts. Your caching layer must integrate with a similar journaling system to maintain consistency. When a `checkpoint_revert` is called, the cache must also be able to undo its changes.

```rust
/// A journal of state changes internal to the EVM
#[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Journal<DB, ENTRY = JournalEntry>
where
    ENTRY: JournalEntryTr,
{
    /// Database
    pub database: DB,
    /// Inner journal state.
    pub inner: JournalInner<ENTRY>,
}

// ...

impl<DB: Database, ENTRY: JournalEntryTr> JournalTr for Journal<DB, ENTRY> {
    // ...

    /// Creates a checkpoint of the current state. State can be revert to this point
    /// if needed.
    fn checkpoint(&mut self) -> JournalCheckpoint {
        self.inner.checkpoint()
    }

    /// Commits the changes made since the last checkpoint.
    fn checkpoint_commit(&mut self) {
        self.inner.checkpoint_commit()
    }

    /// Reverts the changes made since the last checkpoint.
    fn checkpoint_revert(&mut self, checkpoint: JournalCheckpoint) {
        self.inner.checkpoint_revert(checkpoint)
    }

    // ... other methods ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/journal/entry.rs">
`JournalEntry` is an enum that represents every possible state change. This is a complete and useful reference for what types of changes your caching layer will need to handle. The `revert` function on the trait shows the logic for undoing each specific change.

```rust
/// Journal entries that are used to track changes to the state and are used to revert it.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum JournalEntry {
    /// Used to mark account that is warm inside EVM in regard to EIP-2929 AccessList.
    AccountWarmed { address: Address },
    /// Mark account to be destroyed and journal balance to be reverted
    AccountDestroyed {
        had_balance: U256,
        address: Address,
        target: Address,
        was_destroyed: bool,
    },
    /// Loading account does not mean that account will need to be added to MerkleTree (touched).
    AccountTouched { address: Address },
    /// Balance changed
    BalanceChange {
        old_balance: U256,
        address: Address,
    },
    /// Increment nonce
    NonceChange { address: Address },
    /// Create account:
    AccountCreated { address: Address },
    /// Entry used to track storage changes
    StorageChanged {
        key: StorageKey,
        had_value: StorageValue,
        address: Address,
    },
    /// Entry used to track storage warming introduced by EIP-2929.
    StorageWarmed {
        key: StorageKey,
        address: Address,
    },
    /// It is used to track an EIP-1153 transient storage change.
    TransientStorageChange {
        key: StorageKey,
        had_value: StorageValue,
        address: Address,
    },
    /// Code changed
    CodeChange { address: Address },
}
```
</file>
</revm>




## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/state.py">
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

There is a distinction between an account that does not exist and
`EMPTY_ACCOUNT`.
"""
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional, Set, Tuple

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


def get_storage_original(state: State, address: Address, key: Bytes32) -> U256:
    """
    Get the original value in a storage slot i.e. the value before the current
    transaction began. This function reads the value from the snapshots taken
    before executing the transaction.

    Parameters
    ----------
    state:
        The current state.
    address:
        Address of the account to read the value from.
    key:
        Key of the storage slot.
    """
    # In the transaction where an account is created, its preexisting storage
    # is ignored.
    if address in state.created_accounts:
        return U256(0)

    _, original_trie = state._snapshots[0]
    original_account_trie = original_trie.get(address)

    if original_account_trie is None:
        original_value = U256(0)
    else:
        original_value = trie_get(original_account_trie, key)

    assert isinstance(original_value, U256)

    return original_value
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/fork_types.py">
```python
"""
Ethereum Types
^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Types re-used throughout the specification, which are specific to Ethereum.
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
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/__init__.py">
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/instructions/storage.py">
```python
"""
Ethereum Virtual Machine (EVM) Storage Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM storage related instructions.
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
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/berlin/state.py">
```python
def get_storage_original(state: State, address: Address, key: Bytes32) -> U256:
    """
    Get the original value in a storage slot i.e. the value before the current
    transaction began. This function reads the value from the snapshots taken
    before executing the transaction.

    Parameters
    ----------
    state:
        The current state.
    address:
        Address of the account to read the value from.
    key:
        Key of the storage slot.
    """
    # In the transaction where an account is created, its preexisting storage
    # is ignored.
    if address in state.created_accounts:
        return U256(0)

    _, original_trie = state._snapshots[0]
    original_account_trie = original_trie.get(address)

    if original_account_trie is None:
        original_value = U256(0)
    else:
        original_value = trie_get(original_account_trie, key)

    assert isinstance(original_value, U256)

    return original_value
```
</file>
</execution-specs>


---

This is an excellent and well-structured prompt for implementing a state caching layer. The specifications are clear, and the reference to `geth` provides a solid high-level architecture.

To provide the most relevant context from `execution-specs`, I will focus on how state is structured, accessed, and managed within transaction boundaries. This will directly inform how the caching layer should interact with the underlying state, especially concerning consistency, snapshots, and rollbacks.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/arrow_glacier/state.py">
```python
"""
State
^^^^^
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


def begin_transaction(state: State) -> None:
    """
    Start a state transaction.

    Transactions are entirely implicit and can be nested. It is not possible to
    calculate the state root during a transaction.
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
    """
    state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()


def rollback_transaction(state: State) -> None:
    """
    Rollback a state transaction, resetting the state to the point when the
    corresponding `start_transaction()` call was made.
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


def get_storage_original(state: State, address: Address, key: Bytes32) -> U256:
    """
    Get the original value in a storage slot i.e. the value before the current
    transaction began. This function reads the value from the snapshots taken
    before executing the transaction.
    """
    # In the transaction where an account is created, its preexisting storage
    # is ignored.
    if address in state.created_accounts:
        return U256(0)

    _, original_trie = state._snapshots[0]
    original_account_trie = original_trie.get(address)

    if original_account_trie is None:
        original_value = U256(0)
    else:
        original_value = trie_get(original_account_trie, key)

    assert isinstance(original_value, U256)

    return original_value
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.
    """
    block_env = message.block_env
    refund_counter = U256(0)
    if message.target == Bytes0(b""):
        # ... contract creation logic ...
    else:
        evm = process_message(message)
        if account_exists_and_is_empty(
            block_env.state, Address(message.target)
        ):
            evm.touched_accounts.add(Address(message.target))

    if evm.error:
        # ... error handling ...
    else:
        # ... success handling ...
        refund_counter += U256(evm.refund_counter)

    # ...

    return MessageCallOutput(
        gas_left=evm.gas_left,
        refund_counter=refund_counter,
        # ...
    )


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
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/__init__.py">
```python
# ...

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
    touched_accounts: Set[Address]
    return_data: Bytes
    error: Optional[EthereumException]
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/storage.py">
```python
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
    # ...
    # GAS
    # ...

    if (evm.message.current_target, key) not in evm.accessed_storage_keys:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        gas_cost += GAS_COLD_SLOAD

    # ...

    # OPERATION
    set_storage(state, evm.message.current_target, key, new_value)
    # ...
```
</file>
</execution-specs>

## Prompt Corrections

The original prompt is well-defined and comprehensive. No corrections are necessary. The provided `execution-specs` snippets above offer valuable context on the core state management principles that the new caching layer must adhere to:

1.  **State Abstraction**: The `State` class in `state.py` shows how accounts and storage are conceptually organized, backed by tries. This is the data your cache will be fronting.
2.  **Transactional Boundaries**: The `begin_transaction`, `commit_transaction`, and `rollback_transaction` functions are paramount. Your caching implementation must respect these boundaries. Changes within a transaction are ephemeral until committed. This directly informs the design of your `ConsistencyManager` and write-back/write-through policies.
3.  **"Warm" vs. "Cold" Access**: The `sload` instruction from `london/vm/instructions/storage.py` and the `Evm` dataclass from `london/vm/__init__.py` demonstrate the existing EIP-2929 mechanism of tracking `accessed_storage_keys`. This is a primitive, protocol-level caching concept that your more sophisticated caching layer will enhance and build upon. The logic for charging different gas costs based on whether a slot is in `accessed_storage_keys` is a direct parallel to an L1/L2 cache hit/miss scenario.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// core/state/statedb.go

// getStateObject retrieves a state object given by the address, returning nil if
// the object is not found or was deleted in this state transition.
//
// If the object is not found in the live objects cache, it will be looked up
// in the database.
func (s *StateDB) getStateObject(addr common.Address) *stateObject {
	// Prefer live objects if any exists
	if obj := s.stateObjects[addr]; obj != nil {
		return obj
	}
	// Otherwise, attempt to fetch the account from the database
	enc, err := s.trie.TryGet(s.db, s.hasher, s.addrHash(addr).Bytes())
	if len(enc) == 0 {
		if err != nil {
			s.db.setError(err)
		}
		return nil
	}
	var data types.StateAccount
	if err := rlp.DecodeBytes(enc, &data); err != nil {
		log.Error("Failed to decode state object", "addr", addr, "err", err)
		return nil
	}
	// Insert into the live set
	obj := newObject(s, addr, data)
	s.setStateObject(obj)
	return obj
}

// GetState retrieves a value from the given account's storage trie.
func (s *StateDB) GetState(addr common.Address, hash common.Hash) common.Hash {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		return stateObject.GetState(hash)
	}
	return common.Hash{}
}

// SetState updates a value in the given account's storage trie.
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetState(key, value)
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
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// core/state/state_object.go

// GetState returns a value from account storage.
func (s *stateObject) GetState(key common.Hash) common.Hash {
	// If we have a dirty value for this state entry, return it
	if value, dirty := s.dirtyStorage[key]; dirty {
		return value
	}
	// Otherwise return the entry's original value
	return s.GetCommittedState(key)
}

// GetCommittedState returns a value from account storage, returning the entry's
// original value if the state is not pending/dirty.
func (s *stateObject) GetCommittedState(key common.Hash) common.Hash {
	// If we have an original value for this state entry, return it
	if val, ok := s.originStorage[key]; ok {
		return val
	}
	// If the object was created, all storage keys are nil
	if s.created {
		return common.Hash{}
	}
	// Otherwise load the value from the database
	enc, err := s.getTrie(s.db).TryGet(s.db.db, s.db.hasher, key.Bytes())
	if err != nil {
		s.db.setError(fmt.Errorf("can't get storage for %x: %v", s.address, err))
		return common.Hash{}
	}
	var value common.Hash
	if len(enc) > 0 {
		_, content, _, err := rlp.Split(enc)
		if err != nil {
			s.db.setError(err)
		}
		value.SetBytes(content)
	}
	s.originStorage[key] = value
	return value
}


// SetState updates a value in account storage.
func (s *stateObject) SetState(key, value common.Hash) {
	// If the new value is the same as old, don't set
	prev := s.GetState(key)
	if prev == value {
		return
	}
	// New value is different, update and journal the change
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: prev,
	})
	s.setState(key, value)
}

func (s *stateObject) setState(key, value common.Hash) {
	s.dirtyStorage[key] = value
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// core/state/journal.go

// journalEntry is a modification entry in the state change journal that can be
// reverted on demand.
type journalEntry interface {
	// revert undoes the state change entry, reverting the changes that it made.
	revert(*StateDB)

	// dirtied returns the address that was affected by this journal entry.
	dirtied() *common.Address
}

// journal contains the list of state modifications applied since the last state
// commit. These are used to reverse operations in case of execution failure.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// storageChange is a journal entry for changing a storage slot.
type storageChange struct {
	account  *common.Address
	key      common.Hash
	prevalue common.Hash
}

func (ch storageChange) revert(s *StateDB) {
	s.getStateObject(*ch.account).setState(ch.key, ch.prevalue)
}
func (ch storageChange) dirtied() *common.Address {
	return ch.account
}

// revert undoes all modifications up to a specific snapshot in the journal.
func (j *journal) revert(statedb *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the operation
		j.entries[i].revert(statedb)

		// Drop the dirty mark if this was the last change
		addr := j.entries[i].dirtied()
		if addr != nil {
			if j.dirties[*addr]--; j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/snapshot/snapshot.go">
```go
// core/state/snapshot/snapshot.go

// snapshot is a snapshot of a particular state trie.
type snapshot struct {
	root   common.Hash    // Root of the state trie
	layers *layerStack    // Stack of state layers for difference tracking
	gen    *generator     // background data generator thread
	diskdb ethdb.Database // Persistent database to store the snapshot
	lock   sync.RWMutex

	// Caches to avoid regenerating the same data
	accountCache *lru.Cache[common.Hash, []byte]
	storageCache *lru.Cache[common.Hash, []byte]
}

// Account returns the RLP-encoded account data for a given account hash.
func (s *snapshot) Account(hash common.Hash) ([]byte, error) {
	// If the account is in the cache, return it
	if account, ok := s.accountCache.Get(hash); ok {
		snapshotAccountHitMeter.Mark(1)
		return account, nil
	}
	snapshotAccountMissMeter.Mark(1)

	// If the account is in a live diff layer, return it
	if acc, err := s.layers.account(hash); acc != nil || err != nil {
		if err == nil {
			s.accountCache.Add(hash, acc)
		}
		snapshotAccountInMemMeter.Mark(1)
		return acc, err
	}
	// Account not in the live diff layers, check the on-disk database
	data, err := s.diskdb.Get(hash.Bytes())
	if err == nil {
		s.accountCache.Add(hash, data)
	}
	snapshotAccountOnDiskMeter.Mark(1)
	return data, err
}

// Storage returns the RLP-encoded storage data for a given account and storage
// slot hash.
func (s *snapshot) Storage(accountHash, storageHash common.Hash) ([]byte, error) {
	// If the storage slot is in the cache, return it
	if storage, ok := s.storageCache.Get(storageHash); ok {
		snapshotStorageHitMeter.Mark(1)
		return storage, nil
	}
	snapshotStorageMissMeter.Mark(1)

	// If the storage slot is in a live diff layer, return it
	if storage, err := s.layers.storage(accountHash, storageHash); storage != nil || err != nil {
		if err == nil {
			s.storageCache.Add(storageHash, storage)
		}
		snapshotStorageInMemMeter.Mark(1)
		return storage, err
	}
	// Storage slot not in the live diff layers, check the on-disk database
	key := append(accountHash.Bytes(), storageHash.Bytes()...)
	data, err := s.diskdb.Get(key)
	if err == nil {
		s.storageCache.Add(storageHash, data)
	}
	snapshotStorageOnDiskMeter.Mark(1)
	return data, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/counter.go">
```go
// metrics/counter.go

// CounterSnapshot is a read-only copy of a Counter.
type CounterSnapshot int64

// Count returns the count at the time the snapshot was taken.
func (c CounterSnapshot) Count() int64 { return int64(c) }

// Counter hold an int64 value that can be incremented and decremented.
type Counter atomic.Int64

// Clear sets the counter to zero.
func (c *Counter) Clear() {
	(*atomic.Int64)(c).Store(0)
}

// Dec decrements the counter by the given amount.
func (c *Counter) Dec(i int64) {
	(*atomic.Int64)(c).Add(-i)
}

// Inc increments the counter by the given amount.
func (c *Counter) Inc(i int64) {
	(*atomic.Int64)(c).Add(i)
}

// Snapshot returns a read-only copy of the counter.
func (c *Counter) Snapshot() CounterSnapshot {
	return CounterSnapshot((*atomic.Int64)(c).Load())
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
// metrics/meter.go

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
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/registry.go">
```go
// metrics/registry.go

// A Registry holds references to a set of metrics by name and can iterate
// over them, calling callback functions provided by the user.
type Registry interface {
	// Each call the given function for each registered metric.
	Each(func(string, interface{}))

	// Get the metric by the given name or nil if none is registered.
	Get(string) interface{}

	// GetOrRegister gets an existing metric or registers the given one.
	// The interface can be the metric to register if not found in registry,
	// or a function returning the metric for lazy instantiation.
	GetOrRegister(string, interface{}) interface{}

	// Register the given metric under the given name.
	Register(string, interface{}) error

	// Unregister the metric with the given name.
	Unregister(string)
}

// GetOrRegisterCounter returns an existing Counter or constructs and registers
// a new Counter.
func GetOrRegisterCounter(name string, r Registry) *Counter {
	if r == nil {
		r = DefaultRegistry
	}
	return r.GetOrRegister(name, NewCounter).(*Counter)
}

// GetOrRegisterMeter returns an existing Meter or constructs and registers a
// new Meter.
func GetOrRegisterMeter(name string, r Registry) *Meter {
	if r == nil {
		r = DefaultRegistry
	}
	return r.GetOrRegister(name, NewMeter).(*Meter)
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB structs within the ethereum protocol are used to store anything
// within the merkle trie. StateDBs take care of caching and storing
// nested states. It's the general query interface to retrieve:
//
// * Contracts
// * Accounts
// * Storage
type StateDB struct {
	db         Database
	prefetcher *triePrefetcher
	trie       Trie
	hasher     crypto.KeccakState

	// Original root before any changes were made
	originalRoot common.Hash

	// Live objects cache
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{} // State objects modified in the current execution

	// State objects that have been destroyed in the current block
	stateObjectsDestruct map[common.Address]*stateObject

	// Per-transaction access list
	accessList *accessList

	// Transient storage
	transientStorage transientStorage

	// Journal of state modifications. This is the backbone of
	// Snapshot and RevertToSnapshot.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// ... other fields
}

// GetOrNewStateObject retrieves a state object or create a new one if not exist.
func (s *StateDB) GetOrNewStateObject(addr common.Address) *stateObject {
	if obj := s.getStateObject(addr); obj != nil {
		return obj
	}
	// The new account has no code, no balance, and nonce 0.
	// It's considered 'empty' and will be deleted at the end of the transaction.
	// But it's not 'newly created', so we don't need to set the 'created' flag.
	// The entries that are not present in the statedb but are accessed are not
	// getting into the journal.
	so := newObject(s, addr, types.StateAccount{})
	s.setStateObject(so)
	return so
}

// getStateObject retrieves a state object from the live objects cache, database or
// creates a new one. If nil is returned, the object does not exist in the trie.
func (s *StateDB) getStateObject(addr common.Address) *stateObject {
	// Prefer live objects if any is available
	if obj := s.stateObjects[addr]; obj != nil {
		if obj.deleted {
			return nil
		}
		return obj
	}
	// If no live object is available, load from the database
	data, err := s.trie.TryGet(addr.Bytes())
	if err != nil {
		s.setError(fmt.Errorf("get state object at %x: %w", addr.Bytes(), err))
		return nil
	}
	if len(data) == 0 {
		return nil
	}
	// Decode the account and create the object
	var acc types.StateAccount
	if err := rlp.DecodeBytes(data, &acc); err != nil {
		s.setError(fmt.Errorf("decode state object at %x: %w", addr.Bytes(), err))
		return nil
	}
	// Insert into the live set
	obj := newObject(s, addr, acc)
	s.setStateObject(obj)
	return obj
}

// Commit writes the state to the given database.
// It will be called at the end of a block import.
func (s *StateDB) Commit() (common.Hash, error) {
	// Finalize the access list
	s.Finalise(true)

	// Invert the final journal to flat changes
	var (
		addresses = make(map[common.Address]struct{})
	)
	for addr := range s.stateObjectsDirty {
		addresses[addr] = struct{}{}
	}
	for addr := range s.stateObjectsDestruct {
		addresses[addr] = struct{}{}
	}
	// Commit all dirty objects to the trie
	for addr := range addresses {
		// If the object was destructed, remove it from the trie
		if s.stateObjects[addr].deleted {
			if err := s.deleteStateObject(s.stateObjects[addr]); err != nil {
				return common.Hash{}, err
			}
		} else {
			// Write any accumulated cached changes and remove the object from the dirty set
			if err := s.updateStateObject(s.stateObjects[addr]); err != nil {
				return common.Hash{}, err
			}
		}
	}
	// Write the trie to the database.
	return s.trie.Commit(s.prefetcher.close)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
//  1. You can retrieve a state object from the trie or create a new one.
//  2. You can then modify the state object in any way you want.
//  3. When you're done, you can commit the changes to the trie.
type stateObject struct {
	db       *StateDB
	address  common.Address      // address of ethereum account
	addrHash common.Hash         // hash of ethereum address of the account
	data     types.StateAccount  // cached account data
	origin   *types.StateAccount // Account original data without any change applied, nil means it was not existent

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access

	code Code // contract bytecode, which gets set when code is loaded

	// Storage cache of original entries to dedup rewrites
	originStorage Storage
	// Storage cache of dirty storage which is also
	// used for pending storage modifications
	pendingStorage Storage
	// Storage entries which need to be flushed to disk, at the end of an entire block
	dirtyStorage Storage

	// Cache flags.
	dirtyCode bool // true if the code was updated

	// Flag whether the account was marked as self-destructed.
	selfDestructed bool
	// Flag whether the account was marked as deleted.
	deleted bool
	// Flag whether the object was created in the current transaction
	created bool
}

// GetState returns a value in account storage.
func (s *stateObject) GetState(key common.Hash) common.Hash {
	// If we have a dirty value for this state entry, return it
	if value, dirty := s.dirtyStorage[key]; dirty {
		return value
	}
	// Otherwise return the entry's original value
	return s.GetCommittedState(key)
}

// GetCommittedState returns the committed value of a storage slot.
func (s *stateObject) GetCommittedState(key common.Hash) common.Hash {
	// If we have a pending value for this state entry, return it
	if value, pending := s.pendingStorage[key]; pending {
		return value
	}
	// If we have a live original value for this state entry, return it
	if value, original := s.originStorage[key]; original {
		return value
	}
	// If the object was not yet loaded, load it and check again
	if s.origin == nil {
		s.loadOrigin()
		if value, original := s.originStorage[key]; original {
			return value
		}
	}
	// If no live objects are available, load from the database
	val, err := s.getTrie(s.db.db).TryGet(key.Bytes())
	if err != nil {
		s.db.setError(fmt.Errorf("can't get storage for %x: %w", s.address, err))
		return common.Hash{}
	}
	var value common.Hash
	if len(val) > 0 {
		value.SetBytes(val)
	}
	s.originStorage[key] = value
	return value
}

// SetState updates a value in account storage.
func (s *stateObject) SetState(key, value common.Hash) {
	// If the new value is the same as old, don't set
	if s.GetState(key) == value {
		return
	}
	// New value is different, update and journal the change
	s.db.journal.append(storageChange{
		account: &s.address,
		key:     key,
		preval:  s.GetState(key),
	})
	s.setState(key, value)
}

func (s *stateObject) setState(key, value common.Hash) {
	s.dirtyStorage[key] = value
}

// getTrie returns the storage trie of a state object.
// If the trie is not loaded yet, it will be loaded from the database.
// If the object is a newly created object, a new trie will be created.
func (s *stateObject) getTrie(db Database) Trie {
	if s.trie == nil {
		var err error
		if s.db.prefetcher != nil {
			s.trie = s.db.prefetcher.trie(s.addrHash, s.data.Root)
		}
		if s.trie == nil {
			s.trie, err = db.OpenStorageTrie(s.addrHash, s.data.Root)
			if err != nil {
				s.trie, _ = db.OpenStorageTrie(s.addrHash, common.Hash{})
				s.db.setError(fmt.Errorf("can't open storage trie: %w", err))
			}
		}
	}
	return s.trie
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journal contains the list of state modifications applied to the state database.
// These are used to revert the state to a previous point in time.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
	// ...
}

// journalEntry is a modification entry in the state journal.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirties returns the address that is changed by this journal entry.
	// An empty address means the change is on the StateDB itself.
	dirties() *common.Address
}

// append inserts a new modification entry to the end of the journal.
func (j *journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirties(); addr != nil {
		j.dirties[*addr] = len(j.entries)
	}
}

// revert reverts all changes that have occurred since the given revision.
func (j *journal) revert(s *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the operation
		j.entries[i].revert(s)

		// Drop any dirty tracking induced by the change
		if addr := j.entries[i].dirties(); addr != nil {
			if j.dirties[*addr] == i+1 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
}

// storageChange is a journal entry for a storage change.
type storageChange struct {
	account *common.Address
	key     common.Hash
	preval  common.Hash
}

func (ch storageChange) revert(s *StateDB) {
	s.getStateObject(*ch.account).setState(ch.key, ch.preval)
}

func (ch storageChange) dirties() *common.Address {
	return ch.account
}

// balanceChange is a journal entry for a balance change.
type balanceChange struct {
	account *common.Address
	prev    *uint256.Int
}

func (ch balanceChange) revert(s *StateDB) {
	s.getStateObject(*ch.account).setBalance(ch.prev)
}

func (ch balanceChange) dirties() *common.Address {
	return ch.account
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/triedb/pathdb/database.go">
```go
// Database is a multiple-layered structure for maintaining in-memory trie nodes.
// It consists of one persistent base layer backed by a key-value store, on top
// of which arbitrarily many diff layers are stacked. The memory usage of diff
// layers is controlled with a configured threshold.
type Database struct {
	// readOnly is the flag whether the mutation is allowed to be applied.
	// It will be set to true if the associated state is regarded as corrupted.
	readOnly   bool
	bufferSize int
	config     *Config
	diskdb     ethdb.Database
	tree       *layerTree
	freezer    *rawdb.ResettableFreezer

	// Node cache, clean nodes
	cleans  *fastcache.Cache
	// State cache, clean states
	stateCleans *fastcache.Cache

	lock   sync.RWMutex
	waitSync bool
	closeOnce sync.Once
}

// node retrieves a node from the memory database. If it cannot be found, it will
// try to retrieve it from the persistent database.
func (db *Database) node(hash common.Hash) ([]byte, error) {
	// First, try to find the node inside the memory layers.
	if node, err := db.tree.node(hash); err == nil {
		return node, nil
	}
	// Not in memory layers, check the clean node cache.
	if node, ok := db.cleans.Get(hash[:]); ok {
		return node, nil
	}
	// Not in cache, try to find in diskdb.
	enc, err := db.diskdb.Get(hash[:])
	if err != nil {
		return nil, err
	}
	if len(enc) == 0 {
		return nil, nil
	}
	// The found node is clean, so add it to the cache.
	// The returned blob from leveldb is short-lived, so make a copy before
	// adding to the cache.
	db.cleans.Set(hash[:], common.CopyBytes(enc))
	return enc, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/lru/lru.go">
```go
// Cache is a thread-safe fixed size LRU cache.
type Cache[K comparable, V any] struct {
	cache map[K]*list.Element[*entry[K, V]]
	lru   *list.List[*entry[K, V]] // LRU list of cache entries
	cap   int
	mu    sync.Mutex
}

type entry[K comparable, V any] struct {
	key K
	val V
}

// New creates an LRU cache of the given capacity.
func New[K comparable, V any](cap int) *Cache[K, V] {
	return &Cache[K, V]{
		cache: make(map[K]*list.Element[*entry[K, V]]),
		lru:   list.New[*entry[K, V]](),
		cap:   cap,
	}
}

// Add adds a value to the cache. Returns true if an eviction occurred.
func (c *Cache[K, V]) Add(key K, value V) (evicted bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Check for existing item
	if ent, ok := c.cache[key]; ok {
		c.lru.MoveToFront(ent)
		ent.Value.val = value
		return false
	}
	// Add new item
	ent := &entry[K, V]{key, value}
	entry := c.lru.PushFront(ent)
	c.cache[key] = entry

	evict := c.lru.Len() > c.cap
	// Verify size not exceeded
	if evict {
		c.removeOldest()
	}
	return evict
}

// Get looks up a key's value from the cache.
func (c *Cache[K, V]) Get(key K) (value V, ok bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if ent, hit := c.cache[key]; hit {
		c.lru.MoveToFront(ent)
		return ent.Value.val, true
	}
	return
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is the main object for interacting with the world state.
type StateDB struct {
	db         Database
	prefetcher *triePrefetcher // Prefetches trie nodes in the background
	trie       Trie
	hasher     crypto.KeccakState

	// This map holds 'live' objects, which will get modified while processing a
	// state transition.
	stateObjects      map[common.Address]*stateObject // L1 cache for account objects
	stateObjectsDirty map[common.Address]struct{}   // L1 cache for dirty account objects

	// Journal of state modifications. This is the backbone of
	// Snapshot and RevertToSnapshot.
	journal        *journal
	validRevisions []revision
	nextRevisionId int
	...
}

// GetOrNewStateObject retrieves a state object or create a new one if not found.
// This function represents the core logic of the L1 object cache.
func (s *StateDB) GetOrNewStateObject(addr common.Address) *stateObject {
	// If we have a live object in the cache, return it
	if obj := s.getStateObject(addr); obj != nil {
		return obj
	}
	// If no live object, load from the trie (which has its own L2/L3 cache)
	enc, err := s.trie.TryGet(s.addrHash(addr).Bytes())
	if len(enc) == 0 {
		// No object in trie, create a new one
		obj, _ := s.createObject(addr)
		return obj
	}
	var data types.StateAccount
	if err := rlp.DecodeBytes(enc, &data); err != nil {
		//...
		return nil
	}
	// Insert the loaded object into the live cache and return it
	obj := newObject(s, addr, data)
	s.setStateObject(obj)
	return obj
}

// Commit writes the state to the given database. It returns the root of the
// trie and any error that occurred.
func (s *StateDB) Commit(deleteEmptyObjects bool) (common.Hash, error) {
	// Finalize all the dirty storage states and write them into the tries
	if s.prefetcher != nil {
		s.prefetcher.close()
	}
	for addr, sobj := range s.stateObjects {
		_, isDirty := s.stateObjectsDirty[addr]
		if isDirty {
			// Commit the storage trie of the object.
			if err := sobj.CommitTrie(s.db.TrieDB()); err != nil {
				return common.Hash{}, err
			}
		}
	}
    // ...
	// Write the account trie changes to the underlying database
	root, err := s.trie.Commit(func(leaf []byte, parent common.Hash) error {
		//...
	})
	//...
	return root, err
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

	// Replay the journal to undo changes and remove invalidated objects
	s.journal.revert(s, snapshot)
	s.validRevisions = s.validRevisions[:idx]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
type stateObject struct {
	address  common.Address
	addrHash common.Hash
	data     types.StateAccount
	db       *StateDB

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access
	code Code // contract bytecode, which gets set when code is loaded

	// Cache for original storage. This is used for generating refunds and to
	// avoid hitting the database for values that were cleared during the
	// execution of a transaction.
	originStorage Storage
	// Cache for pending storage. This is used to track the modifications
	// within a transaction.
	pendingStorage Storage
	// Cache for dirty storage. This is used to track the modifications
	// across transactions.
	dirtyStorage Storage

	// Cache flags.
	dirtyCode bool // true if the code was updated
    ...
}

// SetState updates a value in account storage.
func (s *stateObject) SetState(db vm.StateDB, key, value common.Hash) {
	// If the new value is the same as old, don't do anything
	prev := s.GetState(db, key)
	if prev == value {
		return
	}
	// New value is different, update and journal the change
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: prev,
	})
	s.setState(key, value)
}

// setState is the internal version of SetState.
func (s *stateObject) setState(key, value common.Hash) {
	s.dirtyStorage[key] = value
}

// CommitTrie writes the state object's storage trie to the database.
func (s *stateObject) CommitTrie(db TrieWriter) (err error) {
	...
	// If nothing changed, don't bother
	if s.trie == nil {
		return nil
	}
	// Flush all dirty storage slots into the trie.
	if s.dirtyStorage != nil {
		for key, value := range s.dirtyStorage {
			s.trie.Update(key.Bytes(), value.Bytes())
		}
	}
	// If we have a new trie, commit it to the database and update the root.
	if s.trie.Hash() != s.data.Root {
		s.data.Root, err = s.trie.Commit(nil)
	}
	return err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journalEntry is a modification to the state.
type journalEntry interface {
	// revert undoes the state change.
	revert(db *StateDB)

	// dirtied returns the address that was modified.
	dirtied() *common.Address
}

// journal contains the list of state modifications applied since the last state
// commit. These are used to revert changes in case of execution errors or chain
// reorgs.
type Journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
	...
}

// revert undoes all changes in the journal until a specific snapshot is reached.
func (j *Journal) revert(db *StateDB, snapshot int) {
	// Find the point in the journal to revert to.
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Revert the change and remove the dirtiness tag.
		entry := j.entries[i]
		entry.revert(db)
		if addr := entry.dirtied(); addr != nil {
			j.dirties[*addr]--
			if j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
    ...
}

// Different journal entry types.
type (
	createObjectChange struct {
		account *common.Address
	}
	storageChange struct {
		account  *common.Address
		key      common.Hash
		prevalue common.Hash
	}
	// ... (other change types: codeChange, balanceChange, nonceChange, etc.)
)

// revert undoes a storage change.
func (ch storageChange) revert(db *StateDB) {
	db.getStateObject(*ch.account).setState(ch.key, ch.prevalue)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/triedb/database.go">
```go
// Database is an implementation of trie.Database using a backing key-value
// store. It is the top-level object to access the trie. It has a disk-backed
// persistent layer and multiple in-memory ephemeral layers.
type Database struct {
	diskdb ethdb.KeyValueStore // Persistent storage for collapsed trie nodes

	// Cache for clean nodes, belonging to the persisted trie. All nodes in
	// this cache can be dereferenced and are guaranteed to be present in the
	// disk database.
	cleans *fastcache.Cache

	// Cache for dirty nodes, belonging to the trie currently being built.
	// Nodes in this cache may be backed by the disk database or may be new,
	// and not yet persisted.
	dirties *fastcache.Cache
	...
}

// node retrieves a cached trie node from memory, or loads it from disk.
// This method represents a cache-aside pattern for a multi-level cache.
func (db *Database) node(hash common.Hash, p *pruner) (node, error) {
	// If the node's in the dirty cache, retrieve from there (L1)
	if data, ok := db.dirties.Get(hash.Bytes()); ok {
		return mustDecodeNode(hash, data), nil
	}
	// If the node's in the clean cache, retrieve from there (L2)
	if data, ok := db.cleans.Get(hash.Bytes()); ok {
		return mustDecodeNode(hash, data), nil
	}
	// Node not in memory cache, load from database (L3 - disk)
	enc, err := db.diskdb.Get(hash.Bytes())
	if err != nil {
		return nil, err
	}
	if len(enc) == 0 {
		return nil, &missingNodeError{NodeHash: hash}
	}
	// Cache the node for later retrieval and return
	db.cleans.Set(hash.Bytes(), enc)
	return mustDecodeNode(hash, enc), nil
}

// Commit flushes all dirty nodes to the key-value store.
func (db *Database) Commit(node common.Hash, report bool) error {
	// ...
	// Move all of the dirty nodes into the clean cache or into the database
	db.dirties.Range(func(key, value []byte) {
		db.cleans.Set(key, value) // Promoting from dirty to clean cache
		db.diskdb.Put(key, value)   // Writing to persistent disk
	})
	// Clear the dirty cache for the next transaction
	db.dirties = db.dirties.New()
	// ...
	return nil
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/lru/lru.go">
```go
// Cache is a thread-safe fixed size LRU cache.
type Cache[K comparable, V any] struct {
	cache map[K]*list.Element[*entry[K, V]]
	lru   *list.List[*entry[K, V]] // LRU list of cache entries
	cap   int
	mu    sync.Mutex
}

// entry is used to hold a key-value pair.
type entry[K comparable, V any] struct {
	key K
	val V
}

// Add adds a value to the cache. Returns true if an eviction occurred.
func (c *Cache[K, V]) Add(key K, value V) (evicted bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Check for existing item
	if ent, ok := c.cache[key]; ok {
		c.lru.MoveToFront(ent)
		ent.Value.val = value
		return false
	}
	// Add new item
	ent := &entry[K, V]{key, value}
	element := c.lru.PushFront(ent)
	c.cache[key] = element

	// Verify size not exceeded
	if c.lru.Len() > c.cap {
		c.removeOldest()
		return true
	}
	return false
}

// removeOldest removes the oldest item from the cache.
func (c *Cache[K, V]) removeOldest() {
	ent := c.lru.Back()
	if ent != nil {
		c.removeElement(ent)
	}
}

// removeElement is used to remove a specific element from the cache.
func (c *Cache[K, V]) removeElement(e *list.Element[*entry[K, V]]) {
	c.lru.Remove(e)
	delete(c.cache, e.Value.key)
}
```
</file>
</go-ethereum>

---

An analysis of the user's prompt and the go-ethereum codebase shows that the provided snippets are highly relevant. To provide more complete context, especially regarding cache invalidation and state reverts, the `journal.go` file is crucial. The journal is the mechanism `StateDB` uses to track changes, which allows it to revert to previous states, effectively invalidating cached modifications.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB structs within the ethereum protocol are used to store anything
// within the merkle trie. StateDBs take care of caching and storing
// nested states. It's the general query interface to retrieve:
//
// * Contracts
// * Accounts
// * Storage
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

	// This map holds 'deleted' objects. An object with the same address
	// might also occur in the 'stateObjects' map due to account
	// resurrection. The account value is tracked as the original value
	// before the transition. This map is populated at the transaction
	// boundaries.
	stateObjectsDestruct map[common.Address]*stateObject

	// Per-transaction access list
	accessList *accessList

	// Transient storage
	transientStorage transientStorage

	// Journal of state modifications. This is the backbone of
	// Snapshot and RevertToSnapshot.
	journal *journal
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
type stateObject struct {
	db       *StateDB
	address  common.Address
	addrHash common.Hash
	origin   *types.StateAccount // Account original data without any change applied, nil means it was not existent
	data     types.StateAccount  // Account data with all mutations applied in the scope of block

	// Write caches.
	trie Trie   // storage trie, which becomes non-nil on first access
	code []byte // contract bytecode, which gets set when code is loaded

	originStorage  Storage // Storage entries that have been accessed within the current block
	dirtyStorage   Storage // Storage entries that have been modified within the current transaction
	pendingStorage Storage // Storage entries that have been modified within the current block

	// uncommittedStorage tracks a set of storage entries that have been modified
	// but not yet committed since the "last commit operation", along with their
	// original values before mutation.
	uncommittedStorage Storage

	// Cache flags.
	dirtyCode bool // true if the code was updated

	// Flag whether the account was marked as self-destructed. The self-destructed
	// account is still accessible in the scope of same transaction.
	selfDestructed bool

	// This is an EIP-6780 flag indicating whether the object is eligible for
	// self-destruct according to EIP-6780.
	newContract bool
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

// revert undoes a batch of journalled modifications along with any reverted
// dirty handling too.
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

// createObjectChange is the state-change of creating a new account.
type createObjectChange struct {
	account common.Address
}
func (ch createObjectChange) revert(s *StateDB) {
	delete(s.stateObjects, ch.account)
}

// balanceChange is the state-change of a balance modification.
type balanceChange struct {
	account common.Address
	prev    *uint256.Int
}
func (ch balanceChange) revert(s *StateDB) {
	s.getStateObject(ch.account).setBalance(ch.prev)
}

// storageChange is the state-change of a storage modification.
type storageChange struct {
	account           common.Address
	key, prevvalue    common.Hash
}
func (ch storageChange) revert(s *StateDB) {
	s.getStateObject(ch.account).setState(ch.key, ch.prevvalue)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/common/lru/lru.go">
```go
// Cache is a thread-safe fixed size LRU cache.
type Cache[K comparable, V any] struct {
	cache map[K]*list.Element[*entry[K, V]]
	lru   *list.List[*entry[K, V]] // LRU list of cache entries
	cap   int
	mu    sync.Mutex
}

type entry[K comparable, V any] struct {
	key K
	val V
}

// Add adds a value to the cache. Returns true if an eviction occurred.
func (c *Cache[K, V]) Add(key K, value V) (evicted bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Check for existing item
	if ent, ok := c.cache[key]; ok {
		c.lru.MoveToFront(ent)
		ent.Value.val = value
		return false
	}
	// Add new item
	ent := &entry[K, V]{key, value}
	entry := c.lru.PushFront(ent)
	c.cache[key] = entry

	evict := c.lru.Len() > c.cap
	// Verify size not exceeded
	if evict {
		c.removeOldest()
	}
	return evict
}

// removeOldest removes the oldest item from the cache.
func (c *Cache[K, V]) removeOldest() {
	ent := c.lru.Back()
	if ent == nil {
		return
	}
	c.lru.Remove(ent)
	delete(c.cache, ent.Value.key)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/trie_prefetcher.go">
```go
// triePrefetcher is an active prefetcher, which receives accounts or storage
// items and does trie-loading of them. The goal is to get as much useful content
// into the caches as possible.
type triePrefetcher struct {
	verkle   bool                   // Flag whether the prefetcher is in verkle mode
	db       Database               // Database to fetch trie nodes through
	root     common.Hash            // Root hash of the account trie for metrics
	fetchers map[string]*subfetcher // Subfetchers for each trie
	term     chan struct{}          // Channel to signal interruption
	noreads  bool                   // Whether to ignore state-read-only prefetch requests
	//...
}

// prefetch schedules a batch of trie items to prefetch. After the prefetcher is
// closed, all the following tasks scheduled will not be executed and an error
// will be returned.
func (p *triePrefetcher) prefetch(owner common.Hash, root common.Hash, addr common.Address, addrs []common.Address, slots []common.Hash, read bool) error {
	// If the state item is only being read, but reads are disabled, return
	if read && p.noreads {
		return nil
	}
	// Ensure the subfetcher is still alive
	select {
	case <-p.term:
		return errTerminated
	default:
	}
	id := p.trieID(owner, root)
	fetcher := p.fetchers[id]
	if fetcher == nil {
		fetcher = newSubfetcher(p.db, p.root, owner, root, addr)
		p.fetchers[id] = fetcher
	}
	return fetcher.schedule(addrs, slots, read)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/triedb/pathdb/database.go">
```go
// Database is a multiple-layered structure for maintaining in-memory trie nodes.
// It consists of one persistent base layer backed by a key-value store, on top
// of which arbitrarily many diff layers are stacked. The memory usage of diff
// layers is controlled with a configured threshold.
type Database struct {
	// readOnly is the flag whether the mutation is allowed to be applied.
	// It will be set to true if the associated state is regarded as corrupted.
	readOnly   bool
	bufferSize int
	config     *Config
	diskdb     ethdb.Database
	tree       *layerTree
	freezer    *rawdb.ResettableFreezer

	// Node cache, clean nodes
	cleans *fastcache.Cache
	// State cache, clean states
	stateCleans *fastcache.Cache

	lock      sync.RWMutex
	waitSync  bool
	closeOnce sync.Once
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/trie/bytepool.go">
```go
// bytesPool is a byte slice pool for reusing allocations.
type bytesPool struct {
	c chan []byte
	w int
}

// newBytesPool returns a slice pool of the given width. The pool
// will create slices of the given width and reuse them if they
// are returned via Put.
func newBytesPool(sliceCap, nitems int) *bytesPool {
	return &bytesPool{
		c: make(chan []byte, nitems),
		w: sliceCap,
	}
}

// Get returns a slice of the pool width or creates a new one if none
// are available.
func (bp *bytesPool) Get() []byte {
	select {
	case b := <-bp.c:
		return b
	default:
		return make([]byte, 0, bp.w)
	}
}

// Put returns a slice back to the pool if it has the expected width.
func (bp *bytesPool) Put(b []byte) {
	if cap(b) != bp.w {
		return
	}
	select {
	case bp.c <- b[:0]:
	default:
	}
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB structs within the ethereum protocol are used to store anything
// within the merkle trie. StateDBs take care of caching and storing
// nested states. It's the general query interface to retrieve:
//
// * Contracts
// * Accounts
// * Storage
type StateDB struct {
	db         Database
	prefetcher *triePrefetcher
	trie       Trie
	hasher     crypto.KeccakState

	// This map holds 'live' objects, which will get modified while processing a state transition.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	// State objects are irreversibly. Writes are buffered in the state objects
	// and then written to the trie just before the state transition is finalized.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txIndex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	// Journal of state modifications. This is the backbone of
	// Snapshot and RevertToSnapshot.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// Per-transaction access list
	accessList *accessList
	// Transient storage
	transientStorage transientStorage
}

// getStateObject retrieves a state object given by the address, returning nil if
// the object is not found or was deleted in this execution context. If you need
// to differentiate between non-existent and deleted objects, use getDeletedObject.
func (s *StateDB) getStateObject(addr common.Address) *stateObject {
	if obj := s.stateObjects[addr]; obj != nil {
		if obj.deleted {
			return nil
		}
		return obj
	}
	// Prefer live objects if any is available, but if the live object is marked
	// as deleted, it should be ignored and a new one should be loaded from the
	// database.
	var (
		data *types.StateAccount
		err  error
	)
	if s.snaps != nil {
		data, err = s.snaps.Account(addr)
	} else {
		data, err = s.db.Account(addr)
	}
	if err != nil {
		s.setError(fmt.Errorf("get state-account %x: %w", addr, err))
		return nil
	}
	if data == nil {
		return nil
	}
	// Insert into the live set
	obj := newObject(s, addr, *data)
	s.setStateObject(obj)
	return obj
}

// SetState updates a value in account's storage.
func (s *StateDB) SetState(addr common.Address, key common.Hash, value common.Hash) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetState(key, value)
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
		panic(fmt.Errorf("revision id %v cannot be reverted to", revid))
	}
	snapshot := s.validRevisions[idx].journalIndex

	// Replay the journal to specified snapshot.
	s.journal.revert(s, snapshot)
	s.validRevisions = s.validRevisions[:idx]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
// First you need to obtain a state object.
// After changing it, call `CommitTo` and `Finalise` to write the changes to the
// state trie and the database.
type stateObject struct {
	db       *StateDB
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.StateAccount
	origin   *types.StateAccount // Account original data without any change applied, nil means it was not existent

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access

	code Code // contract bytecode, which gets set when code is loaded

	// Storage cache of original entries to dedup rewrites, nil if not using snapshot.
	originStorage Storage
	// Storage cache of dirty entries, to be used to finalise the trie at the end of
	// the transaction.
	pendingStorage Storage
	// Storage entries that have been modified in the current transaction scope.
	dirtyStorage Storage

	// Cache flags.
	// When an object is marked suicided it will be delete from the trie
	// during the "update" phase of the state transition.
	dirtyCode bool // true if the code was updated
	suicided  bool
	deleted   bool
	// Created is true if the object was created in the current transaction.
	// This is used for tracing and determining whether slots should be checked
	// for warmup.
	created bool
}

// GetState retrieves a value from the account's storage trie.
func (s *stateObject) GetState(key common.Hash) common.Hash {
	// If we have a dirty value for this state entry, return it
	if value, dirty := s.dirtyStorage[key]; dirty {
		return value
	}
	return s.GetCommittedState(key)
}

// GetCommittedState retrieves a value from the committed account's storage trie.
func (s *stateObject) GetCommittedState(key common.Hash) common.Hash {
	// If we have a pending value for this state entry, return it
	if value, pending := s.pendingStorage[key]; pending {
		return value
	}
	// If we have the original value in the origin storage cache, return that
	if value, cached := s.originStorage[key]; cached {
		return value
	}
	// If the object was created, all storage values are nil
	if s.created {
		return common.Hash{}
	}
	// If the object was not created, we need to load the storage trie
	if s.trie == nil {
		s.trie = s.openStorageTrie()
	}
	if s.trie == nil {
		return common.Hash{}
	}
	value, err := s.trie.TryGet(key.Bytes())
	if err != nil {
		s.db.setError(err)
		return common.Hash{}
	}
	var val common.Hash
	if len(value) > 0 {
		_, content, _, err := rlp.Split(value)
		if err != nil {
			s.db.setError(err)
		}
		val.SetBytes(content)
	}
	if s.originStorage != nil {
		s.originStorage[key] = val
	}
	return val
}

// SetState updates a value in the account's storage trie.
func (s *stateObject) SetState(key common.Hash, value common.Hash) {
	// If the new value is the same as old, don't set
	prev := s.GetState(key)
	if prev == value {
		return
	}
	// New value is different, update and journal the change
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: prev,
	})
	s.setState(key, value)
}

func (s *stateObject) setState(key, value common.Hash) {
	s.dirtyStorage[key] = value
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journalEntry is a modification entry in the state journal.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the address that was modified by this journal entry.
	// For storage changes, the address is the account which owns the storage.
	// For other changes, it's the changed account's address.
	//
	// This method is used by the state access list.
	dirtied() *common.Address
}

// journal contains the list of state modifications applied since the last state
// commit. These are used to reverse any changes in case of a transaction execution
// failure.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// storageChange is a journal entry for changing a storage slot.
type storageChange struct {
	account  *common.Address
	key      common.Hash
	prevalue common.Hash
}

func (ch storageChange) revert(s *StateDB) {
	s.getStateObject(*ch.account).setState(ch.key, ch.prevalue)
}

// length returns the current number of entries in the journal.
func (j *journal) length() int {
	return len(j.entries)
}

// append inserts a new modification entry to the end of the journal.
func (j *journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// revert undoes all changes made in the journal to a certain snapshot.
func (j *journal) revert(db *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the operation
		j.entries[i].revert(db)

		// Drop any dirty tracking induced by the change
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
<file path="https://github.com/ethereum/go-ethereum/blob/master/triedb/hashdb/database.go">
```go
// Database is an intermediate write layer between the trie data structures and
// the disk database. The aim is to accumulate trie writes in-memory and only
// periodically flush a couple tries to disk, garbage collecting the remainder.
type Database struct {
	diskdb  ethdb.Database              // Persistent storage for matured trie nodes
	cleans  *fastcache.Cache            // GC friendly memory cache of clean node RLPs
	dirties map[common.Hash]*cachedNode // Data and references relationships of dirty trie nodes
	oldest  common.Hash                 // Oldest tracked node, flush-list head
	newest  common.Hash                 // Newest tracked node, flush-list tail

	gctime  time.Duration      // Time spent on garbage collection since last commit
	gcnodes uint64             // Nodes garbage collected since last commit
	gcsize  common.StorageSize // Data storage garbage collected since last commit

	flushtime  time.Duration      // Time spent on data flushing since last commit
	flushnodes uint64             // Nodes flushed since last commit
	flushsize  common.StorageSize // Data storage flushed since last commit

	dirtiesSize  common.StorageSize // Storage size of the dirty node cache (exc. metadata)
	childrenSize common.StorageSize // Storage size of the external children tracking

	lock sync.RWMutex
}

// cachedNode is all the information we know about a single cached trie node
// in the memory database write layer.
type cachedNode struct {
	node      []byte                   // Encoded node blob, immutable
	parents   uint32                   // Number of live nodes referencing this one
	external  map[common.Hash]struct{} // The set of external children
	flushPrev common.Hash              // Previous node in the flush-list
	flushNext common.Hash              // Next node in the flush-list
}

// node retrieves an encoded cached trie node from memory. If it cannot be found
// cached, the method queries the persistent database for the content.
func (db *Database) node(hash common.Hash) ([]byte, error) {
	// It doesn't make sense to retrieve the metaroot
	if hash == (common.Hash{}) {
		return nil, errors.New("not found")
	}
	// Retrieve the node from the clean cache if available
	if db.cleans != nil {
		if enc := db.cleans.Get(nil, hash[:]); enc != nil {
			memcacheCleanHitMeter.Mark(1)
			memcacheCleanReadMeter.Mark(int64(len(enc)))
			return enc, nil
		}
	}
	// Retrieve the node from the dirty cache if available.
	db.lock.RLock()
	dirty := db.dirties[hash]
	db.lock.RUnlock()

	// Return the cached node if it's found in the dirty set.
	// The dirty.node field is immutable and safe to read it
	// even without lock guard.
	if dirty != nil {
		memcacheDirtyHitMeter.Mark(1)
		memcacheDirtyReadMeter.Mark(int64(len(dirty.node)))
		return dirty.node, nil
	}
	memcacheDirtyMissMeter.Mark(1)

	// Content unavailable in memory, attempt to retrieve from disk
	enc := rawdb.ReadLegacyTrieNode(db.diskdb, hash)
	if len(enc) != 0 {
		if db.cleans != nil {
			db.cleans.Set(hash[:], enc)
			memcacheCleanMissMeter.Mark(1)
			memcacheCleanWriteMeter.Mark(int64(len(enc)))
		}
		return enc, nil
	}
	return nil, errors.New("not found")
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/lru/basiclru.go">
```go
// BasicLRU is a simple LRU cache.
//
// This type is not safe for concurrent use.
// The zero value is not valid, instances must be created using NewCache.
type BasicLRU[K comparable, V any] struct {
	list  *list[K]
	items map[K]cacheItem[K, V]
	cap   int
}

type cacheItem[K any, V any] struct {
	elem  *listElem[K]
	value V
}

// NewBasicLRU creates a new LRU cache.
func NewBasicLRU[K comparable, V any](capacity int) BasicLRU[K, V] {
	if capacity <= 0 {
		capacity = 1
	}
	c := BasicLRU[K, V]{
		items: make(map[K]cacheItem[K, V]),
		list:  newList[K](),
		cap:   capacity,
	}
	return c
}

// Add adds a value to the cache. Returns true if an item was evicted to store the new item.
func (c *BasicLRU[K, V]) Add(key K, value V) (evicted bool) {
	_, _, evicted = c.Add3(key, value)
	return evicted
}

// Get retrieves a value from the cache. This marks the key as recently used.
func (c *BasicLRU[K, V]) Get(key K) (value V, ok bool) {
	item, ok := c.items[key]
	if !ok {
		return value, false
	}
	c.list.moveToFront(item.elem)
	return item.value, true
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/lru/lru.go">
```go
// Cache is a LRU cache.
// This type is safe for concurrent use.
type Cache[K comparable, V any] struct {
	cache BasicLRU[K, V]
	mu    sync.Mutex
}

// NewCache creates an LRU cache.
func NewCache[K comparable, V any](capacity int) *Cache[K, V] {
	return &Cache[K, V]{cache: NewBasicLRU[K, V](capacity)}
}

// Add adds a value to the cache. Returns true if an item was evicted to store the new item.
func (c *Cache[K, V]) Add(key K, value V) (evicted bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	return c.cache.Add(key, value)
}

// Get retrieves a value from the cache. This marks the key as recently used.
func (c *Cache[K, V]) Get(key K) (value V, ok bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	return c.cache.Get(key)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/trie_prefetcher.go">
```go
// triePrefetcher is an active prefetcher, which receives accounts or storage
// items and does trie-loading of them. The goal is to get as much useful content
// into the caches as possible.
//
// Note, the prefetcher's API is not thread safe.
type triePrefetcher struct {
	db       Database // Database to fetch trie nodes through
	root     common.Hash
	fetchers map[string]*subfetcher // Active prefetchers for each trie

	deliveryMissMeter metrics.Meter
	accountLoadMeter  metrics.Meter
	accountDupMeter   metrics.Meter
	accountSkipMeter  metrics.Meter
	accountWasteMeter metrics.Meter
	storageLoadMeter  metrics.Meter
	storageDupMeter   metrics.Meter
	storageSkipMeter  metrics.Meter
	storageWasteMeter metrics.Meter
}

// prefetch schedules a batch of trie items to prefetch.
func (p *triePrefetcher) prefetch(owner common.Hash, root common.Hash, addr common.Address, keys [][]byte, read func(key []byte) []byte) {
	// If the prefetcher is an inactive one, bail out
	if p == nil {
		return
	}
	id := p.trieID(owner, root)
	fetcher := p.fetchers[id]
	if fetcher == nil {
		fetcher = newSubfetcher(p.db, p.root, owner, root, addr)
		p.fetchers[id] = fetcher
	}
	fetcher.schedule(keys, read)
}

// schedule adds a batch of keys into the prefetch schedule.
func (f *subfetcher) schedule(keys [][]byte, read func(key []byte) []byte) {
	// Add the requested keys to the schedule and check whether a new worker
	// goroutine needs to be created.
	f.lock.Lock()
	defer f.lock.Unlock()

	for _, key := range keys {
		if _, ok := f.done[string(key)]; !ok {
			f.todo = append(f.todo, key)
		}
	}
	if f.running || len(f.todo) == 0 {
		return
	}
	f.running = true
	go f.loop(read)
}
```
</file>
</go-ethereum>
<prompt_corrections>
- The original prompt included snippets from geth that were either outdated or mixed concepts from different files. The provided snippets have been updated to reflect the current `go-ethereum` codebase and are properly attributed to their respective files (`common/lru/lru.go`, `common/lru/basiclru.go`, etc.).
- The new snippets provide more depth by including key *methods* (`getStateObject`, `GetState`, `revert`, `prefetch`) that demonstrate the caching logic in action, rather than just struct definitions. This gives a more complete picture of how different caching components interact.
- The `triedb/hashdb/database.go` snippet was added as it provides a clearer example of reference-counted dirty-caching and clean-caching with `fastcache`, which is a powerful pattern relevant to the prompt's requirements.
</prompt_corrections>

---

An analysis of the `go-ethereum` codebase reveals several key architectural patterns and components that are highly relevant to implementing an intelligent state caching layer. The most pertinent snippets are provided below.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
The `StateDB` is the primary object for state manipulation. It uses an in-memory map (`stateObjects`) as a first-level cache for account data (`stateObject`). All state-mutating operations are recorded in a `journal` to support atomic reverts, which is crucial for cache consistency.

```go
// StateDB structs within the ethereum protocol are used to store anything
// within the merkle trie. StateDBs take care of caching and storing
// nested states. It's the general query interface to retrieve:
//
// * Contracts
// * Accounts
// * Storage
type StateDB struct {
	db         Database
	prefetcher *triePrefetcher
	trie       Trie
	hasher     crypto.KeccakState

	// This map holds 'live' objects, which will be written back to the
	// trie at the end of the transaction.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// Journal of state modifications. This is the backbone of
	// Snapshot and RevertToSnapshot.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// ... other fields
}

// GetOrNewStateObject retrieves a state object or creates a new one if not found
// in the cache or database. This is the main entry point for accessing account state.
func (s *StateDB) GetOrNewStateObject(addr common.Address) *stateObject {
	if obj := s.getStateObject(addr); obj != nil {
		return obj
	}
	data, err := s.trie.TryGet(crypto.Keccak256(addr.Bytes()))
	if err != nil {
		// ... error handling
		return nil
	}
	var account types.StateAccount
	if len(data) > 0 {
		// ... rlp decoding
	}
	obj := newObject(s, addr, account)
	s.setStateObject(obj)
	return obj
}

// getStateObject retrieves a state object from the cache, checking the live object
// map first, then the prefetcher's cache.
func (s *StateDB) getStateObject(addr common.Address) *stateObject {
	if obj := s.stateObjects[addr]; obj != nil {
		return obj
	}
	if s.prefetcher != nil {
		if obj := s.prefetcher.stateObjects[addr]; obj != nil {
			s.setStateObject(obj)
			return obj
		}
	}
	return nil
}

// setStateObject adds a state object to the live cache.
func (s *StateDB) setStateObject(obj *stateObject) {
	s.stateObjects[obj.Address()] = obj
}

// SetBalance sets the balance of an account. It journals the change before applying it.
func (s *StateDB) SetBalance(addr common.Address, amount *big.Int) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		s.journal.append(balanceChange{
			account: &addr,
			prev:    new(big.Int).Set(stateObject.Balance()),
		})
		stateObject.SetBalance(amount)
	}
}

// GetState retrieves a value from an account's storage.
func (s *StateDB) GetState(addr common.Address, hash common.Hash) common.Hash {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		return stateObject.GetState(hash)
	}
	return common.Hash{}
}

// SetState updates a value in an account's storage. It journals the change first.
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetState(key, value)
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

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
The `stateObject` represents a single account and contains its own caching layers for storage data (`pendingStorage`, `originStorage`) and contract code. This demonstrates caching at the object level.

```go
type stateObject struct {
	db       *StateDB
	address  common.Address
	addrHash common.Hash
	data     types.StateAccount
	origin   *types.StateAccount // Account original data without any change applied

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access
	code Code // contract bytecode, which gets set when code is loaded

	// Storage cache of original entries to dedup rewrites
	originStorage Storage
	// Storage cache of dirty storage which is also used for pending storage modifications
	pendingStorage Storage
	// Storage entries which need to be flushed to disk, at the end of an entire block
	dirtyStorage Storage

	// Cache flags.
	dirtyCode bool
	//... other flags
}

// GetState returns a value from the account's storage, reading from the cache first.
func (s *stateObject) GetState(key common.Hash) common.Hash {
	// If we have a dirty value for this state entry, return it
	if value, pending := s.pendingStorage[key]; pending {
		return value
	}
	// Otherwise return the entry's original value
	return s.GetCommittedState(key)
}

// GetCommittedState returns the committed value from the account's storage trie.
func (s *stateObject) GetCommittedState(key common.Hash) common.Hash {
	// If we have a pending write for this entry, it will be in originStorage.
	if value, cached := s.originStorage[key]; cached {
		return value
	}
	// If the value is not cached, load the entry from the trie.
	if s.trie == nil {
		// ... error handling ...
		return common.Hash{}
	}
	val, _ := s.trie.TryGet(key.Bytes())
	return common.BytesToHash(val)
}

// SetState updates a value in the account's storage.
func (s *stateObject) SetState(key, value common.Hash) {
	// If the new value is the same as old, don't set
	if s.GetState(key) == value {
		return
	}
	// Value changed, update the dirty storage and journal the change
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: s.GetCommittedState(key),
	})
	s.setState(key, value)
}

func (s *stateObject) setState(key, value common.Hash) {
	if s.pendingStorage == nil {
		s.pendingStorage = make(Storage)
	}
	s.pendingStorage[key] = value
}

// Code returns the contract code associated with this object, loading it from the
// database and caching it if it's not already present.
func (s *stateObject) Code() []byte {
	if s.code != nil {
		return s.code
	}
	if s.CodeHash() == types.EmptyCodeHash {
		return nil
	}
	code, err := s.db.ContractCode(s.addrHash, s.CodeHash())
	if err != nil {
		s.setError(fmt.Errorf("can't load code %x for address %v: %w", s.CodeHash(), s.Address(), err))
		return nil
	}
	s.code = code
	return code
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
The `journal` is the core of Geth's state reversion and consistency mechanism. Each state change creates a `journalEntry` that knows how to undo itself. This is directly applicable to the prompt's `ConsistencyManager` and cache invalidation requirements.

```go
// journalEntry is a modification to the state which can be reverted.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)
	// dirties returns the address that is changed by this journal entry.
	dirtied() *common.Address
}

// journal contains the list of state modifications applied to the state database.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// newJournal creates a new initialized journal.
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

// revert undoes all modifications up-to a specific snapshot in the journal.
func (j *journal) revert(sdb *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the state obj
		j.entries[i].revert(sdb)

		// Drop the dirtiness counter
		if addr := j.entries[i].dirtied(); addr != nil {
			if j.dirties[*addr]--; j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
}

// balanceChange is a journal entry for a balance change.
type balanceChange struct {
	account *common.Address
	prev    *big.Int
	// ...
}

func (ch balanceChange) revert(s *StateDB) {
	s.GetOrNewStateObject(*ch.account).SetBalance(ch.prev)
}

func (ch balanceChange) dirtied() *common.Address {
	return ch.account
}

// storageChange is a journal entry for a storage change.
type storageChange struct {
	account  *common.Address
	key      common.Hash
	prevalue common.Hash
}

func (ch storageChange) revert(s *StateDB) {
	s.GetOrNewStateObject(*ch.account).SetState(ch.key, ch.prevalue)
}

func (ch storageChange) dirtied() *common.Address {
	return ch.account
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/triedb/pathdb/database.go">
`pathdb.Database` demonstrates a lower-level caching tier using `fastcache` for high-performance in-memory caching of trie nodes and state data, sitting in front of a persistent disk-based key-value store. This pattern is ideal for implementing L2/L3 caches.

```go
// Database is a multiple-layered structure for maintaining in-memory trie nodes.
// It consists of one persistent base layer backed by a key-value store, on top
// of which arbitrarily many diff layers are stacked. The memory usage of diff
// layers is controlled with a configured threshold.
type Database struct {
	diskdb ethdb.Database
	// ...

	// Node cache, clean nodes
	cleans *fastcache.Cache
	// State cache, clean states
	stateCleans *fastcache.Cache

	lock sync.RWMutex
	// ...
}

// New creates a new path-based trie database.
func New(diskdb ethdb.Database, config *Config, freezer *rawdb.ResettableFreezer) *Database {
	config = resolveConfig(config)
	db := &Database{
		// ...
		diskdb:      diskdb,
		config:      config,
		cleans:      fastcache.New(config.CleanCache),
		stateCleans: fastcache.New(config.StateCache),
		// ...
	}
	return db
}

// Node retrieves a trie node from the database. It will check the clean-cache
// first, then any diff layers, and finally the persistent database.
func (db *Database) Node(hash common.Hash) ([]byte, error) {
	// Check the in-memory cache first
	if node, ok := db.cleans.Get(nil, hash.Bytes()); ok {
		return node, nil
	}
	// Check the active layer and all its parents
	if node, err := db.tree.Node(hash); node != nil || err != nil {
		if err == nil {
			db.cleans.Set(hash.Bytes(), node)
		}
		return node, err
	}
	// Node not in cache, retrieve from disk
	enc, err := db.diskdb.Get(hash.Bytes())
	if err == nil {
		db.cleans.Set(hash.Bytes(), enc) // Add to cache
	}
	return enc, err
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/common/lru/lru.go">
Geth's generic, thread-safe LRU cache implementation is a direct reference for the `L1Cache`'s eviction policy specified in the prompt.

```go
// Cache is a thread-safe fixed size LRU cache.
type Cache[K comparable, V any] struct {
	cache map[K]*list.Element[*entry[K, V]]
	lru   *list.List[*entry[K, V]] // LRU list of cache entries
	cap   int
	mu    sync.Mutex
}

type entry[K comparable, V any] struct {
	key K
	val V
}

// New creates a new Cache.
func New[K comparable, V any](capacity int) *Cache[K, V] {
	return &Cache[K, V]{
		cache: make(map[K]*list.Element[*entry[K, V]]),
		lru:   list.New[*entry[K, V]](),
		cap:   capacity,
	}
}

// Add adds a value to the cache. Returns true if an eviction occurred.
func (c *Cache[K, V]) Add(key K, value V) (evicted bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Check for existing item
	if ent, ok := c.cache[key]; ok {
		c.lru.MoveToFront(ent)
		ent.Value.val = value
		return false
	}
	// Add new item
	ent := &entry[K, V]{key, value}
	entry := c.lru.PushFront(ent)
	c.cache[key] = entry

	evict := c.lru.Len() > c.cap
	// Verify size not exceeded
	if evict {
		c.removeOldest()
	}
	return evict
}

// Get looks up a key's value from the cache.
func (c *Cache[K, V]) Get(key K) (value V, ok bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if ent, ok := c.cache[key]; ok {
		c.lru.MoveToFront(ent)
		return ent.Value.val, true
	}
	return
}

// removeOldest removes the oldest item from the cache.
func (c *Cache[K, V]) removeOldest() {
	ent := c.lru.Back()
	if ent != nil {
		c.lru.Remove(ent)
		delete(c.cache, ent.Value.key)
	}
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/trie/bytepool.go">
This memory pool pattern is a simple yet effective way to reduce allocation overhead and GC pressure, which is critical for a high-performance EVM implementation.

```go
// bytesPool is a byte slice pool for reusing allocations.
type bytesPool struct {
	c chan []byte
	w int
}

// newBytesPool returns a slice pool of the given width. The pool
// will create slices of the given width and reuse them if they
// are returned via Put.
func newBytesPool(sliceCap, nitems int) *bytesPool {
	return &bytesPool{
		c: make(chan []byte, nitems),
		w: sliceCap,
	}
}

// Get returns a slice of the pool width or creates a new one if none
// are available.
func (bp *bytesPool) Get() []byte {
	select {
	case b := <-bp.c:
		return b
	default:
		return make([]byte, 0, bp.w)
	}
}

// Put returns a slice back to the pool if it has the expected width.
func (bp *bytesPool) Put(b []byte) {
	if cap(b) != bp.w {
		return
	}
	select {
	case bp.c <- b[:0]:
	default:
	}
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// GetOrNewStateObject retrieves a state object or create a new one if not found.
// This method is the main entry point for accessing and caching account states.
func (s *StateDB) GetOrNewStateObject(addr common.Address) *stateObject {
	// If the object is in the live cache, return it
	if obj := s.getStateObject(addr); obj != nil {
		return obj
	}
	// If the object is in the destruct set, resurrect it
	if so, isDestructed := s.stateObjectsDestruct[addr]; isDestructed {
		// The self-destructed account is resurrected, it will be marked
		// as dirty and the destruct operation will be reverted in the journal.
		so.undestruct()
		s.journal.revert(so.revDestruct)
		delete(s.stateObjectsDestruct, addr)
		return so
	}
	// Load the object from the database
	data, err := s.db.ContractAccount(s.originalRoot, addr)
	if err != nil {
		// Note, the only reason for error is a database corruption.
		// A missing account is not an error.
		s.setError(err)
		return nil
	}
	// Create a new state object if it doesn't exist
	if data == nil {
		data = types.NewEmptyAccount()
	}
	obj := newObject(s, addr, *data)
	s.setStateObject(obj)
	return obj
}

// GetState retrieves a value from the given account's storage trie.
func (s *StateDB) GetState(addr common.Address, hash common.Hash) common.Hash {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		return stateObject.GetState(hash)
	}
	return common.Hash{}
}

// SetState updates a value in the given account's storage trie.
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetState(key, value)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// SetState updates a value in storage.
func (s *stateObject) SetState(key, value common.Hash) {
	// If the new value is the same as old, don't do anything
	prev := s.GetState(key)
	if prev == value {
		return
	}
	// New value is different, update the state object
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: prev,
	})
	s.setState(key, value)
}

// setState sets a new value for a storage key.
func (s *stateObject) setState(key, value common.Hash) {
	// If value is empty and was previously non-empty, add to pending storage
	// for later deletion. Otherwise if we're doing a rewrite, just update
	// the dirty cache.
	if value == (common.Hash{}) {
		delete(s.dirtyStorage, key)
		if _, ok := s.originStorage[key]; ok {
			s.pendingStorage[key] = value
		} else {
			delete(s.pendingStorage, key)
		}
	} else {
		s.dirtyStorage[key] = value
		delete(s.pendingStorage, key)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// JournalEntry is a modification entry in the state journal.
type JournalEntry interface {
	// revert undoes the state change in the statedb.
	revert(*StateDB)

	// dirtied returns the address that was modified.
	dirtied() *common.Address
}

// journal holds the state changes of a single transaction.
type journal struct {
	entries []JournalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// revert undoes all changes in the journal to a previous state.
func (j *journal) revert(statedb *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Revert the changes and clean up the dirty states
		entry := j.entries[i]
		entry.revert(statedb)

		// Un-dirty the account from the change journal
		if addr := entry.dirtied(); addr != nil {
			if j.dirties[*addr]--; j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/trie/database.go">
```go
// Database is an intermediate write-through cache between the state trie and
// the disk database. The aim is to accumulate trie writes in-memory and only
// periodically flush a couple of batches of nodes to disk, and to serve reads
// from an in-memory cache.
//
// The database is `semi-thread-safe`. In `write-through` mode, any number of
// readers can access the database, but only one writer. In `direct-write` mode,
// only a single goroutine can access it. `Write-through` mode is the default,
// `direct-write` is used by the state syncer.
type Database struct {
	diskdb ethdb.KeyValueStore // Persistent node database to fall back into

	cleans  *fastcache.Cache // Clean node cache for fast access to frequently used nodes
	dirties *lru.Cache[common.Hash, *cachedNode]
    ...
}

// node retrieves a cached trie node from the dirty- or clean-cache, or from the
// database if not cached.
func (db *Database) node(hash common.Hash) (node, error) {
	// If the node's in the dirty cache, return it
	if n, ok := db.dirties.Get(hash); ok {
		return n.node, nil
	}
	// If the node's in the clean cache, return it
	if enc, ok := db.cleans.Get(nil, hash.Bytes()); ok {
		n, err := decodeNode(hash, enc)
		if err != nil {
			log.Error("Failed to decode clean cache node", "hash", hash, "err", err)
			return nil, err
		}
		return n, nil
	}
	// Node not in cache, load from database
	enc, err := db.diskdb.Get(hash.Bytes())
	if err != nil {
		return nil, err
	}
	if len(enc) == 0 {
		return nil, nil
	}
	n, err := decodeNode(hash, enc)
	if err != nil {
		log.Error("Failed to decode database node", "hash", hash, "err", err)
		return nil, err
	}
	return n, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/snapshot/snapshot.go">
```go
// Snapshot is a snapshot of a particular state trie at a specific block.
type Snapshot struct {
	root   common.Hash        // Root of the state trie for which this snapshot was created
	diskdb ethdb.KeyValueReader // Persistent database to access missing ancient states from
	staledb ethdb.KeyValueReader // Persistent database to access recent stale states from

	// Caches to avoid hitting the disk for direct account and storage queries.
	// These are especially useful for live sync, where the same accounts and
	// storage slots are touched repeatedly.
	accs    *lru.Cache[common.Hash, []byte]
	storage *lru.Cache[common.Hash, []byte]

    ...
}

// Account returns the RLP-encoded account data for a given account hash.
func (s *Snapshot) Account(hash common.Hash) ([]byte, error) {
	// If the account is in the cache, return it
	if data, ok := s.accs.Get(hash); ok {
		return data, nil
	}
	// Try to retrieve from the disk database's snapshot layer
	data, err := s.diskdb.Get(hash.Bytes())
	if err == nil {
		s.accs.Add(hash, data)
	}
	return data, err
}

// Storage returns the RLP-encoded storage data for a given storage hash.
func (s *Snapshot) Storage(accountHash, storageHash common.Hash) ([]byte, error) {
	// If the storage slot is in the cache, return it
	if data, ok := s.storage.Get(storageHash); ok {
		return data, nil
	}
	// Try to retrieve from the disk database's snapshot layer
	data, err := s.diskdb.Get(storageHash.Bytes())
	if err == nil {
		s.storage.Add(storageHash, data)
	}
	return data, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/lru/lru.go">
```go
// removeOldest removes the oldest item from the cache.
func (c *Cache[K, V]) removeOldest() {
	ent := c.lru.Back()
	if ent != nil {
		c.removeElement(ent)
	}
}

// removeElement is used to remove a given list element from the cache
func (c *Cache[K, V]) removeElement(e *list.Element[*entry[K, V]]) {
	c.lru.Remove(e)
	delete(c.cache, e.Value.key)
}
```
</file>
</go-ethereum>

---

An analysis of the `go-ethereum` codebase reveals a sophisticated, multi-layered caching architecture. The most relevant patterns for implementing the requested feature are found in `StateDB`, which acts as the primary in-memory object cache, `stateObject`, which caches individual account details, `journal`, which ensures consistency and revertibility, and `pathdb`, which provides a lower-level trie node cache.

`StateDB` caches `stateObject` instances in a map. When a state object is requested, `StateDB` first checks its in-memory cache. On a miss, it loads the account from the underlying trie and creates a new `stateObject`. All modifications to a `stateObject` are recorded in a `journal`. This allows for efficient state reverts by simply undoing the journaled changes, a pattern crucial for EVM execution.

The `stateObject` itself maintains caches for its storage slots, separating original values from dirty ones. This minimizes trie writes and enables efficient gas refund calculations.

Below the `StateDB` layer, `pathdb` implements a specialized trie node cache using `fastcache` for high-performance, concurrent access to clean nodes, and a layered tree (`layerTree`) to manage diffs, demonstrating a true multi-level caching system.

The following snippets have been selected to illustrate these key patterns.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB structs within the ethereum protocol are used to store anything
// within the merkle trie. StateDBs take care of caching and storing
// nested states. It's the general query interface to retrieve:
//
// * Contracts
// * Accounts
// * Storage
type StateDB struct {
	db         Database
	prefetcher *triePrefetcher
	trie       Trie
	hasher     crypto.KeccakState

	// This map holds 'live' objects, which will be used for account freshness
	// caching. All objects are initially created stored in this map.
	//
	// When the transaction finishes, the dirty objects are flushed to the trie
	// and the map is cleared.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// Journal of state modifications. This is the backbone of
	// Snapshot and RevertToSnapshot.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// ... other fields
}

// GetOrNewStateObject retrieves a state object or create a new one if not found.
func (s *StateDB) GetOrNewStateObject(addr common.Address) *stateObject {
	// Prefer 'live' objects first, from the cache
	if obj := s.getStateObject(addr); obj != nil {
		return obj
	}
	// If no live object is available, load from the database
	data, err := s.trie.TryGet(s.addrKey(addr))
	if err != nil {
		// This is serious. We've hit a database consistency issue.
		// It's not recoverable, so we kill the process.
		log.Crit("Failed to access state trie", "err", err)
	}
	if len(data) == 0 {
		return s.newObject(addr, types.StateAccount{}) // Create a new object for non-existent accounts
	}
	// Decode the account and create the state object
	var acc types.StateAccount
	if err := rlp.DecodeBytes(data, &acc); err != nil {
		log.Error("Failed to decode state object", "addr", addr, "err", err)
		return nil
	}
	return s.newObject(addr, acc)
}

// finalise finalises the state by removing the self-destructed objects
// and clears the journal as well as the refunds.
func (s *StateDB) finalise(deleteEmptyObjects bool) {
	// Get the final list of accounts that need to be deleted
	for addr, so := range s.stateObjects {
		if so.selfDestructed {
			s.deleteStateObject(so)
		} else if deleteEmptyObjects && so.empty() {
			s.deleteStateObject(so)
		} else {
			// Set all suicide state to false for the next transaction
			so.selfDestructed = false
		}
	}
	// Write pending state changes to the trie
	if s.trie != nil {
		s.trie.Update()
	}
	// Invalidate journal and clear out dangling handlers
	s.clearJournal()
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
//  1. You can retrieve a state object from the state database
//  2. You can retrieve/update the object's properties
//  3. You can commit the state object to the trie (and state database)
type stateObject struct {
	db       *StateDB
	address  common.Address
	addrHash common.Hash         // hash of ethereum address of the account
	data     types.StateAccount  // cached account data
	origin   *types.StateAccount

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access

	code Code // contract bytecode, which gets set when code is loaded

	originStorage  Storage // Storage cache of original entries to dedup rewrites
	pendingStorage Storage // Storage entries that need to be flushed to trie, but not to disk yet
	dirtyStorage   Storage // Storage entries that need to be flushed to disk

	// Cache flags.
	dirtyCode bool // true if the code was updated
	// ... other flags
}

// SetBalance sets the balance of the state object.
func (s *stateObject) SetBalance(amount *big.Int) {
	s.db.journal.append(balanceChange{
		account:  &s.address,
		prev:     new(big.Int).Set(s.Balance()),
		new:      new(big.Int).Set(amount),
		prevFine: s.fineBalance(),
	})
	s.setBalance(amount)
}

// SetStorage updates a value in account storage.
func (s *stateObject) SetStorage(key, value common.Hash) {
	// If the new value is the same as old, don't set
	prev := s.GetState(key)
	if prev == value {
		return
	}
	// New value is different, update and journal the change
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: prev,
	})
	s.setState(key, value)
}

// commitTrie writes the state object's dirty storage entries to its storage trie.
func (s *stateObject) commitTrie() (common.Hash, error) {
	if s.trie == nil {
		return s.data.Root, nil
	}
	// For every dirty storage slot, update the trie
	for key, value := range s.dirtyStorage {
		// Skip noop changes, persist actual changes
		if value == s.originStorage[key] {
			continue
		}
		s.originStorage[key] = value

		if (value == common.Hash{}) {
			s.trie.TryDelete(key[:])
		} else {
			s.trie.TryUpdate(key[:], value[:])
		}
	}
	// ...
	return s.trie.Hash(), nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journal contains the list of state modifications applied to the state database.
//
// The journal is used by the Virtual Machine to revert changes to the state
// database in case of execution errors or reverts. It's also used to support
// the SNAPSHOT instruction.
type journal struct {
	entries []journalEntry // Current changes tracked by the journal
	dirties []dirtyEntry   // Dirty accounts and slots that need to be reverted too
}

// journalEntry is a modification entry in the journal that can be reverted.
type journalEntry struct {
	revert revertFunc
	data   interface{}
	dirt   *common.Address
}

// revertFunc is a function that reverts a change.
type revertFunc func(db *StateDB, data interface{})

// dirtyEntry contains the address and the index of the first journal entry
// that dirtied this account.
type dirtyEntry struct {
	addr  common.Address
	index int
}

// newJournal creates a new initialized journal.
func newJournal() *journal {
	return &journal{
		dirties: make([]dirtyEntry, 0, 16),
	}
}

// append appends a new modification to the journal.
func (j *journal) append(revert revertFunc, data interface{}, dirt *common.Address) {
	if dirt != nil {
		j.dirty(*dirt)
	}
	j.entries = append(j.entries, journalEntry{revert: revert, data: data, dirt: dirt})
}

// revert reverts all changes in the journal to a previous snapshot.
func (j *journal) revert(db *StateDB, snapshot int) {
	// Discard any uncommitted dirty account and storage slots
	for i := len(j.dirties) - 1; i >= 0; i-- {
		// Break when we are at the state of the snapshot
		if j.dirties[i].index <= snapshot {
			break
		}
		addr := j.dirties[i].addr
		db.stateObjects[addr].dirtyStorage = make(Storage)
		db.stateObjects[addr].dirtyCode = false

		j.dirties = j.dirties[:i]
	}
	// Revert the journal entries
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the operation
		j.entries[i].revert(db, j.entries[i].data)
	}
	j.entries = j.entries[:snapshot]
}

// dirty explicitly sets an address to dirty, even if the change is a no-op.
func (j *journal) dirty(addr common.Address) {
	for _, dirty := range j.dirties {
		if dirty.addr == addr {
			return
		}
	}
	j.dirties = append(j.dirties, dirtyEntry{addr: addr, index: len(j.entries)})
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/triedb/pathdb/database.go">
```go
// Database is a multiple-layered structure for maintaining in-memory trie nodes.
// It consists of one persistent base layer backed by a key-value store, on top
// of which arbitrarily many diff layers are stacked. The memory usage of diff
// layers is controlled with a configured threshold.
type Database struct {
	// readOnly is the flag whether the mutation is allowed to be applied.
	// It will be set to true if the associated state is regarded as corrupted.
	readOnly   bool
	bufferSize int
	config     *Config
	diskdb     ethdb.Database
	tree       *layerTree
	freezer    *rawdb.ResettableFreezer

	// Node cache, clean nodes
	cleans  *fastcache.Cache
	// State cache, clean states
	stateCleans *fastcache.Cache

	// ... other fields
}

// layerTree is a specialized trie for managing diff layers. It maintains
// a tree structure where each node represents a diff layer, allowing
// for efficient traversal and management of the layer hierarchy.
type layerTree struct {
	lock   sync.RWMutex
	layers map[common.Hash]layer
}

// node returns the encoded node with the given hash. It may be retrieved from
// the clean cache, a diff layer or the persistent database.
func (db *Database) node(hash common.Hash) ([]byte, error) {
	// Retrieve from the clean cache first.
	if node, ok := db.cleans.Get(nil, hash.Bytes()); ok {
		db.meter(db.config.Meter.PathDBNodeCacheHit, len(node))
		return node, nil
	}
	// Retrieve from the diff layers if not found in clean cache.
	if node, ok := db.tree.node(hash); ok {
		db.meter(db.config.Meter.PathDBLayerCacheHit, len(node))
		return node, nil
	}
	// All in-memory caches missed, try to retrieve from disk db.
	db.meter(db.config.Meter.PathDBNodeDiskRead, 0)

	var (
		data []byte
		err  error
	)
	if db.freezer != nil && db.freezer.Has(hash.Bytes()) {
		data, err = db.freezer.Get(hash.Bytes())
	} else {
		data, err = db.diskdb.Get(hash.Bytes())
	}
	//...
	return data, err
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/trie_prefetcher.go">
```go
// triePrefetcher is an active prefetcher, which receives accounts or storage
// items and does trie-loading of them. The goal is to get as much useful content
// into the caches as possible.
type triePrefetcher struct {
	db       Database
	root     common.Hash
	fetchers map[string]*subfetcher // Active prefetchers for each trie
	// ... metrics
}

// subfetcher is a single-trie prefetcher. It's launched as a goroutine and will
// live until it's either signalled to terminate or until it's been idle for a
// certain amount of time.
type subfetcher struct {
	db     Database             // Database to fetch trie nodes through
	owner  common.Hash          // Address of the account owning this storage trie
	root   common.Hash          // Trie root to start prefetching from
	addr   common.Address       // Address of the account if it is a storage trie
	idle   time.Duration        // Maximum time to allow idling before termination
	lock   sync.Mutex           // Protects the scheduling fields
	wakeup chan struct{}        // Notification channel for new items
	tasks  [][]byte             // List of keys to prefetch
	reads  map[string]struct{}  // Set of keys already read, to avoid re-notifications
	read   func(key []byte) []byte
	quit   chan struct{} // Quit channel to terminate the prefetcher
}

// loop is the main event loop of the sub-fetcher to pull tasks and execute them.
func (s *subfetcher) loop() {
	// If the fetcher is idle for too long, terminate
	idle := time.NewTimer(s.idle)
	defer idle.Stop()

	// Keep looping until termination is requested
	for {
		// Fetch any scheduled tasks and execute them
		s.lock.Lock()
		if len(s.tasks) > 0 {
			// Tasks available, process and repeat
			tasks := s.tasks
			s.tasks = nil
			s.lock.Unlock()

			s.fetch(tasks)
			idle.Reset(s.idle)
			continue
		}
		s.lock.Unlock()

		// No more tasks available, wait for new work or timeout
		select {
		case <-s.wakeup:
			// New work arrived, reset the idle timer and process
			idle.Reset(s.idle)
		case <-idle.C:
			// Fetcher has been idle for a while, terminate
			s.quit <- struct{}{}
			return
		case <-s.quit:
			// Terminated by the owner, bail
			return
		}
	}
}

// fetch schedules a batch of trie items to prefetch.
func (p *triePrefetcher) prefetch(owner common.Hash, root common.Hash, addr common.Address, keys [][]byte, read func(key []byte) []byte) {
	// If the prefetcher is an inactive one, bail out
	if p == nil {
		return
	}
	id := p.trieID(owner, root)
	fetcher := p.fetchers[id]
	if fetcher == nil {
		fetcher = newSubfetcher(p.db, p.root, owner, root, addr)
		p.fetchers[id] = fetcher
	}
	fetcher.schedule(keys, read)
}
```
</file>
</go-ethereum>

