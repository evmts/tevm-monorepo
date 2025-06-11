# Implement External Bytecode

You are implementing External Bytecode for the Tevm EVM written in Zig. Your goal is to implement external bytecode loading and validation following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_external_bytecode` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_external_bytecode feat_implement_external_bytecode`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a comprehensive external bytecode system that enables dynamic loading, caching, and execution of contract bytecode from external sources. This includes bytecode verification, caching strategies, lazy loading, code signing, and secure execution environments while maintaining performance and security.

## ELI5

Think of external bytecode like having a smart library system for computer programs. Normally, when you want to run a smart contract, all its code has to be stored directly on the blockchain (which is expensive). External bytecode is like having a library where you can store the actual code elsewhere and just keep a small "library card" on the blockchain.

Here's how it works:
- **Smart Library**: Instead of storing entire books (contracts) on expensive shelf space (blockchain), you store just the catalog card with a reference to where the book is kept
- **Lazy Loading**: You only fetch the book when someone actually wants to read it, not when they're just browsing the catalog
- **Caching**: Once you've fetched a popular book, you keep a copy at the front desk so the next person doesn't have to wait
- **Security Checks**: Before letting anyone read a book, you verify it hasn't been tampered with (code signing and verification)

This is especially useful for:
- **Large contracts** that would be expensive to store directly on-chain
- **Shared libraries** that many contracts use (why store the same code 100 times?)
- **Upgradeable systems** where you can point to new versions of code without changing the on-chain address

The enhanced version adds smart features like predicting which code you'll need next and keeping hot caches for popular contracts.

## External Bytecode Specifications

### Core External Bytecode Framework

#### 1. External Bytecode Manager
```zig
pub const ExternalBytecodeManager = struct {
    allocator: std.mem.Allocator,
    config: BytecodeConfig,
    bytecode_cache: BytecodeCache,
    loader_registry: LoaderRegistry,
    verifier: BytecodeVerifier,
    security_manager: SecurityManager,
    performance_tracker: BytecodePerformanceTracker,
    
    pub const BytecodeConfig = struct {
        enable_external_bytecode: bool,
        max_cached_contracts: u32,
        max_contract_size: usize,
        enable_lazy_loading: bool,
        enable_code_signing: bool,
        enable_bytecode_verification: bool,
        cache_strategy: CacheStrategy,
        security_level: SecurityLevel,
        loader_timeout_ms: u64,
        
        pub const CacheStrategy = enum {
            None,           // No caching
            LRU,            // Least Recently Used
            LFU,            // Least Frequently Used
            TTL,            // Time To Live
            Adaptive,       // Adaptive based on usage patterns
        };
        
        pub const SecurityLevel = enum {
            None,           // No security (development only)
            Basic,          // Basic validation
            Standard,       // Standard security checks
            Strict,         // Strict validation and signing
            Paranoid,       // Maximum security with overhead
        };
        
        pub fn production() BytecodeConfig {
            return BytecodeConfig{
                .enable_external_bytecode = true,
                .max_cached_contracts = 10000,
                .max_contract_size = 24 * 1024, // 24KB
                .enable_lazy_loading = true,
                .enable_code_signing = true,
                .enable_bytecode_verification = true,
                .cache_strategy = .Adaptive,
                .security_level = .Strict,
                .loader_timeout_ms = 5000,
            };
        }
        
        pub fn development() BytecodeConfig {
            return BytecodeConfig{
                .enable_external_bytecode = true,
                .max_cached_contracts = 1000,
                .max_contract_size = 24 * 1024,
                .enable_lazy_loading = true,
                .enable_code_signing = false,
                .enable_bytecode_verification = true,
                .cache_strategy = .LRU,
                .security_level = .Basic,
                .loader_timeout_ms = 10000,
            };
        }
        
        pub fn testing() BytecodeConfig {
            return BytecodeConfig{
                .enable_external_bytecode = true,
                .max_cached_contracts = 100,
                .max_contract_size = 8 * 1024,
                .enable_lazy_loading = false,
                .enable_code_signing = false,
                .enable_bytecode_verification = false,
                .cache_strategy = .None,
                .security_level = .None,
                .loader_timeout_ms = 1000,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: BytecodeConfig) !ExternalBytecodeManager {
        return ExternalBytecodeManager{
            .allocator = allocator,
            .config = config,
            .bytecode_cache = try BytecodeCache.init(allocator, config),
            .loader_registry = try LoaderRegistry.init(allocator),
            .verifier = try BytecodeVerifier.init(allocator, config),
            .security_manager = try SecurityManager.init(allocator, config.security_level),
            .performance_tracker = BytecodePerformanceTracker.init(),
        };
    }
    
    pub fn deinit(self: *ExternalBytecodeManager) void {
        self.bytecode_cache.deinit();
        self.loader_registry.deinit();
        self.verifier.deinit();
        self.security_manager.deinit();
    }
    
    pub fn load_bytecode(
        self: *ExternalBytecodeManager,
        address: Address,
        source: BytecodeSource,
        load_options: LoadOptions
    ) !*ExternalBytecode {
        if (!self.config.enable_external_bytecode) {
            return error.ExternalBytecodeDisabled;
        }
        
        const start_time = std.time.nanoTimestamp();
        
        // Check cache first
        if (self.bytecode_cache.get(address)) |cached_bytecode| {
            self.performance_tracker.record_cache_hit();
            return cached_bytecode;
        }
        
        // Load from external source
        const bytecode = try self.load_from_source(address, source, load_options);
        
        // Verify bytecode if enabled
        if (self.config.enable_bytecode_verification) {
            try self.verifier.verify_bytecode(bytecode);
        }
        
        // Check security constraints
        try self.security_manager.validate_bytecode(bytecode);
        
        // Cache the bytecode
        try self.bytecode_cache.put(address, bytecode);
        
        const load_time = std.time.nanoTimestamp() - start_time;
        self.performance_tracker.record_load(load_time, bytecode.code.len);
        
        return bytecode;
    }
    
    pub fn unload_bytecode(self: *ExternalBytecodeManager, address: Address) !void {
        try self.bytecode_cache.remove(address);
        self.performance_tracker.record_unload();
    }
    
    pub fn preload_bytecode(
        self: *ExternalBytecodeManager,
        addresses: []const Address,
        source: BytecodeSource
    ) !void {
        for (addresses) |address| {
            // Load bytecode in background if not already cached
            if (!self.bytecode_cache.contains(address)) {
                const load_options = LoadOptions{
                    .lazy = true,
                    .verify_signature = false,
                    .priority = .Background,
                };
                
                _ = self.load_bytecode(address, source, load_options) catch |err| {
                    // Log error but continue with other addresses
                    std.log.warn("Failed to preload bytecode for {}: {}", .{ address, err });
                    continue;
                };
            }
        }
    }
    
    pub fn register_loader(
        self: *ExternalBytecodeManager,
        loader_type: LoaderType,
        loader: BytecodeLoader
    ) !void {
        try self.loader_registry.register(loader_type, loader);
    }
    
    pub fn get_bytecode_info(self: *const ExternalBytecodeManager, address: Address) ?BytecodeInfo {
        if (self.bytecode_cache.get_info(address)) |info| {
            return info;
        }
        return null;
    }
    
    fn load_from_source(
        self: *ExternalBytecodeManager,
        address: Address,
        source: BytecodeSource,
        load_options: LoadOptions
    ) !*ExternalBytecode {
        const loader = self.loader_registry.get_loader(source.loader_type) orelse {
            return error.LoaderNotFound;
        };
        
        // Create load context
        const load_context = LoadContext{
            .address = address,
            .source = source,
            .options = load_options,
            .timeout_ms = self.config.loader_timeout_ms,
            .security_level = self.config.security_level,
        };
        
        // Load bytecode using appropriate loader
        return try loader.load(self.allocator, load_context);
    }
    
    pub fn compact_cache(self: *ExternalBytecodeManager) !void {
        try self.bytecode_cache.compact();
    }
    
    pub fn get_cache_stats(self: *const ExternalBytecodeManager) BytecodeCache.Stats {
        return self.bytecode_cache.get_stats();
    }
    
    pub fn get_performance_metrics(self: *const ExternalBytecodeManager) BytecodePerformanceTracker.Metrics {
        return self.performance_tracker.get_metrics();
    }
    
    pub const LoadOptions = struct {
        lazy: bool,
        verify_signature: bool,
        priority: LoadPriority,
        
        pub const LoadPriority = enum {
            Low,
            Normal,
            High,
            Critical,
            Background,
        };
    };
    
    pub const BytecodeSource = struct {
        loader_type: LoaderType,
        uri: []const u8,
        metadata: ?SourceMetadata,
        
        pub const SourceMetadata = struct {
            version: []const u8,
            checksum: []const u8,
            signature: ?[]const u8,
            compression: CompressionType,
            
            pub const CompressionType = enum {
                None,
                Gzip,
                Zstd,
                LZ4,
            };
        };
    };
    
    pub const LoadContext = struct {
        address: Address,
        source: BytecodeSource,
        options: LoadOptions,
        timeout_ms: u64,
        security_level: BytecodeConfig.SecurityLevel,
    };
    
    pub const BytecodeInfo = struct {
        address: Address,
        size: usize,
        load_time: i64,
        access_count: u64,
        last_access: i64,
        is_verified: bool,
        is_signed: bool,
        source_uri: []const u8,
    };
};
```

#### 2. External Bytecode Structure
```zig
pub const ExternalBytecode = struct {
    allocator: std.mem.Allocator,
    address: Address,
    code: []const u8,
    metadata: BytecodeMetadata,
    verification_status: VerificationStatus,
    security_context: SecurityContext,
    load_time: i64,
    access_count: std.atomic.Atomic(u64),
    last_access_time: std.atomic.Atomic(i64),
    reference_count: std.atomic.Atomic(u32),
    
    pub const BytecodeMetadata = struct {
        version: []const u8,
        source_uri: []const u8,
        checksum: [32]u8,
        signature: ?[]const u8,
        compression: CompressionType,
        original_size: usize,
        load_method: LoadMethod,
        
        pub const CompressionType = enum {
            None,
            Gzip,
            Zstd,
            LZ4,
        };
        
        pub const LoadMethod = enum {
            Direct,
            Lazy,
            Prefetch,
            OnDemand,
        };
    };
    
    pub const VerificationStatus = struct {
        is_verified: bool,
        verification_time: i64,
        signature_valid: bool,
        checksum_valid: bool,
        bytecode_valid: bool,
        verification_errors: []const VerificationError,
        
        pub const VerificationError = struct {
            error_type: ErrorType,
            message: []const u8,
            location: ?u32,
            
            pub const ErrorType = enum {
                InvalidOpcode,
                InvalidJumpDest,
                InvalidStackOperation,
                SecurityViolation,
                SignatureInvalid,
                ChecksumMismatch,
            };
        };
    };
    
    pub const SecurityContext = struct {
        trust_level: TrustLevel,
        permissions: ExecutionPermissions,
        sandbox_level: SandboxLevel,
        origin_validation: bool,
        
        pub const TrustLevel = enum {
            Untrusted,
            LowTrust,
            MediumTrust,
            HighTrust,
            FullyTrusted,
        };
        
        pub const ExecutionPermissions = struct {
            can_call_external: bool,
            can_modify_state: bool,
            can_emit_logs: bool,
            can_create_contracts: bool,
            gas_limit_multiplier: f64,
        };
        
        pub const SandboxLevel = enum {
            None,
            Basic,
            Strict,
            Isolated,
        };
    };
    
    pub fn init(
        allocator: std.mem.Allocator,
        address: Address,
        code: []const u8,
        metadata: BytecodeMetadata
    ) !*ExternalBytecode {
        const code_copy = try allocator.dupe(u8, code);
        const version_copy = try allocator.dupe(u8, metadata.version);
        const uri_copy = try allocator.dupe(u8, metadata.source_uri);
        
        var signature_copy: ?[]u8 = null;
        if (metadata.signature) |sig| {
            signature_copy = try allocator.dupe(u8, sig);
        }
        
        const bytecode = try allocator.create(ExternalBytecode);
        bytecode.* = ExternalBytecode{
            .allocator = allocator,
            .address = address,
            .code = code_copy,
            .metadata = BytecodeMetadata{
                .version = version_copy,
                .source_uri = uri_copy,
                .checksum = metadata.checksum,
                .signature = signature_copy,
                .compression = metadata.compression,
                .original_size = metadata.original_size,
                .load_method = metadata.load_method,
            },
            .verification_status = VerificationStatus{
                .is_verified = false,
                .verification_time = 0,
                .signature_valid = false,
                .checksum_valid = false,
                .bytecode_valid = false,
                .verification_errors = &[_]VerificationStatus.VerificationError{},
            },
            .security_context = SecurityContext{
                .trust_level = .Untrusted,
                .permissions = SecurityContext.ExecutionPermissions{
                    .can_call_external = false,
                    .can_modify_state = false,
                    .can_emit_logs = false,
                    .can_create_contracts = false,
                    .gas_limit_multiplier = 1.0,
                },
                .sandbox_level = .Strict,
                .origin_validation = true,
            },
            .load_time = std.time.milliTimestamp(),
            .access_count = std.atomic.Atomic(u64).init(0),
            .last_access_time = std.atomic.Atomic(i64).init(std.time.milliTimestamp()),
            .reference_count = std.atomic.Atomic(u32).init(1),
        };
        
        return bytecode;
    }
    
    pub fn deinit(self: *ExternalBytecode) void {
        self.allocator.free(self.code);
        self.allocator.free(self.metadata.version);
        self.allocator.free(self.metadata.source_uri);
        
        if (self.metadata.signature) |signature| {
            self.allocator.free(signature);
        }
        
        if (self.verification_status.verification_errors.len > 0) {
            for (self.verification_status.verification_errors) |error_item| {
                self.allocator.free(error_item.message);
            }
            self.allocator.free(self.verification_status.verification_errors);
        }
        
        self.allocator.destroy(self);
    }
    
    pub fn add_reference(self: *ExternalBytecode) void {
        _ = self.reference_count.fetchAdd(1, .SeqCst);
    }
    
    pub fn remove_reference(self: *ExternalBytecode) void {
        const prev_count = self.reference_count.fetchSub(1, .SeqCst);
        if (prev_count == 1) {
            // Last reference removed, can be garbage collected
            self.deinit();
        }
    }
    
    pub fn access(self: *ExternalBytecode) void {
        _ = self.access_count.fetchAdd(1, .SeqCst);
        self.last_access_time.store(std.time.milliTimestamp(), .SeqCst);
    }
    
    pub fn get_instruction(self: *ExternalBytecode, offset: u32) ?u8 {
        if (offset >= self.code.len) {
            return null;
        }
        
        self.access();
        return self.code[offset];
    }
    
    pub fn get_code_slice(self: *ExternalBytecode, offset: u32, length: u32) ?[]const u8 {
        if (offset >= self.code.len) {
            return null;
        }
        
        const end_offset = @min(offset + length, @as(u32, @intCast(self.code.len)));
        self.access();
        
        return self.code[offset..end_offset];
    }
    
    pub fn is_valid_jump_dest(self: *ExternalBytecode, offset: u32) bool {
        if (offset >= self.code.len) {
            return false;
        }
        
        return self.code[offset] == 0x5B; // JUMPDEST
    }
    
    pub fn calculate_checksum(self: *const ExternalBytecode) [32]u8 {
        var hasher = std.crypto.hash.sha2.Sha256.init(.{});
        hasher.update(self.code);
        return hasher.finalResult();
    }
    
    pub fn verify_checksum(self: *const ExternalBytecode) bool {
        const calculated = self.calculate_checksum();
        return std.mem.eql(u8, &calculated, &self.metadata.checksum);
    }
    
    pub fn get_size_metrics(self: *const ExternalBytecode) SizeMetrics {
        const metadata_size = self.metadata.version.len + 
                             self.metadata.source_uri.len +
                             if (self.metadata.signature) |sig| sig.len else 0;
        
        return SizeMetrics{
            .code_size = self.code.len,
            .metadata_size = metadata_size,
            .total_size = self.code.len + metadata_size + @sizeOf(ExternalBytecode),
            .compression_ratio = if (self.metadata.original_size > 0)
                @as(f64, @floatFromInt(self.code.len)) / @as(f64, @floatFromInt(self.metadata.original_size))
            else 1.0,
        };
    }
    
    pub const SizeMetrics = struct {
        code_size: usize,
        metadata_size: usize,
        total_size: usize,
        compression_ratio: f64,
    };
};
```

#### 3. Bytecode Cache Implementation
```zig
pub const BytecodeCache = struct {
    allocator: std.mem.Allocator,
    config: ExternalBytecodeManager.BytecodeConfig,
    cache_entries: std.HashMap(Address, CacheEntry, AddressHashContext, std.hash_map.default_max_load_percentage),
    lru_list: LRUList,
    cache_stats: CacheStats,
    lock: std.Thread.RwLock,
    
    pub const CacheEntry = struct {
        bytecode: *ExternalBytecode,
        cache_time: i64,
        access_count: u64,
        last_access: i64,
        frequency_score: f64,
        ttl_expires: ?i64,
        
        pub fn init(bytecode: *ExternalBytecode) CacheEntry {
            return CacheEntry{
                .bytecode = bytecode,
                .cache_time = std.time.milliTimestamp(),
                .access_count = 0,
                .last_access = std.time.milliTimestamp(),
                .frequency_score = 0.0,
                .ttl_expires = null,
            };
        }
        
        pub fn access(self: *CacheEntry) void {
            self.access_count += 1;
            self.last_access = std.time.milliTimestamp();
            
            // Update frequency score using exponential moving average
            const time_diff = @as(f64, @floatFromInt(self.last_access - self.cache_time)) / 1000.0;
            self.frequency_score = 0.9 * self.frequency_score + 0.1 * (1.0 / @max(time_diff, 1.0));
        }
        
        pub fn is_expired(self: *const CacheEntry) bool {
            if (self.ttl_expires) |expires| {
                return std.time.milliTimestamp() > expires;
            }
            return false;
        }
    };
    
    pub const CacheStats = struct {
        hits: u64,
        misses: u64,
        evictions: u64,
        total_entries: u64,
        current_size: usize,
        max_size: usize,
        
        pub fn init(max_size: usize) CacheStats {
            return CacheStats{
                .hits = 0,
                .misses = 0,
                .evictions = 0,
                .total_entries = 0,
                .current_size = 0,
                .max_size = max_size,
            };
        }
        
        pub fn get_hit_rate(self: *const CacheStats) f64 {
            const total = self.hits + self.misses;
            if (total == 0) return 0.0;
            return @as(f64, @floatFromInt(self.hits)) / @as(f64, @floatFromInt(total));
        }
        
        pub fn get_utilization(self: *const CacheStats) f64 {
            if (self.max_size == 0) return 0.0;
            return @as(f64, @floatFromInt(self.current_size)) / @as(f64, @floatFromInt(self.max_size));
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ExternalBytecodeManager.BytecodeConfig) !BytecodeCache {
        return BytecodeCache{
            .allocator = allocator,
            .config = config,
            .cache_entries = std.HashMap(Address, CacheEntry, AddressHashContext, std.hash_map.default_max_load_percentage).init(allocator),
            .lru_list = LRUList.init(allocator),
            .cache_stats = CacheStats.init(config.max_cached_contracts),
            .lock = std.Thread.RwLock{},
        };
    }
    
    pub fn deinit(self: *BytecodeCache) void {
        self.lock.lock();
        defer self.lock.unlock();
        
        // Clean up all cached bytecode
        var iterator = self.cache_entries.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.bytecode.remove_reference();
        }
        
        self.cache_entries.deinit();
        self.lru_list.deinit();
    }
    
    pub fn get(self: *BytecodeCache, address: Address) ?*ExternalBytecode {
        self.lock.lockShared();
        defer self.lock.unlockShared();
        
        if (self.cache_entries.getPtr(address)) |entry| {
            // Check if entry is expired
            if (entry.is_expired()) {
                return null;
            }
            
            entry.access();
            entry.bytecode.access();
            
            // Update LRU position
            self.lru_list.move_to_front(address);
            
            self.cache_stats.hits += 1;
            return entry.bytecode;
        }
        
        self.cache_stats.misses += 1;
        return null;
    }
    
    pub fn put(self: *BytecodeCache, address: Address, bytecode: *ExternalBytecode) !void {
        self.lock.lock();
        defer self.lock.unlock();
        
        // Check if we need to evict entries
        if (self.cache_entries.count() >= self.config.max_cached_contracts) {
            try self.evict_entries();
        }
        
        // Create cache entry
        var entry = CacheEntry.init(bytecode);
        
        // Set TTL if using TTL strategy
        if (self.config.cache_strategy == .TTL) {
            entry.ttl_expires = std.time.milliTimestamp() + 3600000; // 1 hour
        }
        
        // Add to cache
        try self.cache_entries.put(address, entry);
        try self.lru_list.add_to_front(address);
        
        bytecode.add_reference();
        
        self.cache_stats.total_entries += 1;
        self.cache_stats.current_size += bytecode.get_size_metrics().total_size;
    }
    
    pub fn remove(self: *BytecodeCache, address: Address) !void {
        self.lock.lock();
        defer self.lock.unlock();
        
        if (self.cache_entries.fetchRemove(address)) |removed| {
            removed.value.bytecode.remove_reference();
            self.lru_list.remove(address);
            
            self.cache_stats.current_size -= removed.value.bytecode.get_size_metrics().total_size;
        }
    }
    
    pub fn contains(self: *BytecodeCache, address: Address) bool {
        self.lock.lockShared();
        defer self.lock.unlockShared();
        
        if (self.cache_entries.get(address)) |entry| {
            return !entry.is_expired();
        }
        return false;
    }
    
    pub fn get_info(self: *BytecodeCache, address: Address) ?ExternalBytecodeManager.BytecodeInfo {
        self.lock.lockShared();
        defer self.lock.unlockShared();
        
        if (self.cache_entries.get(address)) |entry| {
            if (entry.is_expired()) {
                return null;
            }
            
            return ExternalBytecodeManager.BytecodeInfo{
                .address = address,
                .size = entry.bytecode.code.len,
                .load_time = entry.bytecode.load_time,
                .access_count = entry.access_count,
                .last_access = entry.last_access,
                .is_verified = entry.bytecode.verification_status.is_verified,
                .is_signed = entry.bytecode.metadata.signature != null,
                .source_uri = entry.bytecode.metadata.source_uri,
            };
        }
        
        return null;
    }
    
    fn evict_entries(self: *BytecodeCache) !void {
        const entries_to_evict = @max(1, self.cache_entries.count() / 10); // Evict 10%
        
        switch (self.config.cache_strategy) {
            .LRU => try self.evict_lru(entries_to_evict),
            .LFU => try self.evict_lfu(entries_to_evict),
            .TTL => try self.evict_expired(),
            .Adaptive => try self.evict_adaptive(entries_to_evict),
            .None => {}, // No eviction
        }
    }
    
    fn evict_lru(self: *BytecodeCache, count: usize) !void {
        var evicted: usize = 0;
        
        while (evicted < count and self.lru_list.tail != null) {
            const address = self.lru_list.tail.?;
            
            if (self.cache_entries.fetchRemove(address)) |removed| {
                removed.value.bytecode.remove_reference();
                self.lru_list.remove(address);
                
                self.cache_stats.current_size -= removed.value.bytecode.get_size_metrics().total_size;
                self.cache_stats.evictions += 1;
                evicted += 1;
            }
        }
    }
    
    fn evict_lfu(self: *BytecodeCache, count: usize) !void {
        // Create list of entries sorted by frequency
        var entries = std.ArrayList(struct { address: Address, frequency: f64 }).init(self.allocator);
        defer entries.deinit();
        
        var iterator = self.cache_entries.iterator();
        while (iterator.next()) |entry| {
            try entries.append(.{
                .address = entry.key_ptr.*,
                .frequency = entry.value_ptr.frequency_score,
            });
        }
        
        // Sort by frequency (ascending)
        const sortFn = struct {
            fn lessThan(context: void, a: @TypeOf(entries.items[0]), b: @TypeOf(entries.items[0])) bool {
                _ = context;
                return a.frequency < b.frequency;
            }
        }.lessThan;
        
        std.sort.pdq(@TypeOf(entries.items[0]), entries.items, {}, sortFn);
        
        // Evict lowest frequency entries
        const to_evict = @min(count, entries.items.len);
        for (entries.items[0..to_evict]) |entry| {
            if (self.cache_entries.fetchRemove(entry.address)) |removed| {
                removed.value.bytecode.remove_reference();
                self.lru_list.remove(entry.address);
                
                self.cache_stats.current_size -= removed.value.bytecode.get_size_metrics().total_size;
                self.cache_stats.evictions += 1;
            }
        }
    }
    
    fn evict_expired(self: *BytecodeCache) !void {
        var expired_addresses = std.ArrayList(Address).init(self.allocator);
        defer expired_addresses.deinit();
        
        var iterator = self.cache_entries.iterator();
        while (iterator.next()) |entry| {
            if (entry.value_ptr.is_expired()) {
                try expired_addresses.append(entry.key_ptr.*);
            }
        }
        
        for (expired_addresses.items) |address| {
            if (self.cache_entries.fetchRemove(address)) |removed| {
                removed.value.bytecode.remove_reference();
                self.lru_list.remove(address);
                
                self.cache_stats.current_size -= removed.value.bytecode.get_size_metrics().total_size;
                self.cache_stats.evictions += 1;
            }
        }
    }
    
    fn evict_adaptive(self: *BytecodeCache, count: usize) !void {
        // Adaptive strategy combines LRU and LFU based on hit rate
        const hit_rate = self.cache_stats.get_hit_rate();
        
        if (hit_rate > 0.8) {
            // High hit rate: use LFU to keep frequently used items
            try self.evict_lfu(count);
        } else {
            // Lower hit rate: use LRU for temporal locality
            try self.evict_lru(count);
        }
    }
    
    pub fn compact(self: *BytecodeCache) !void {
        self.lock.lock();
        defer self.lock.unlock();
        
        // Remove expired entries
        try self.evict_expired();
        
        // Rebuild LRU list for better cache locality
        try self.lru_list.rebuild();
    }
    
    pub fn get_stats(self: *const BytecodeCache) Stats {
        self.lock.lockShared();
        defer self.lock.unlockShared();
        
        return Stats{
            .cache_stats = self.cache_stats,
            .entry_count = @intCast(self.cache_entries.count()),
            .average_access_count = self.calculate_average_access_count(),
            .memory_efficiency = self.calculate_memory_efficiency(),
        };
    }
    
    fn calculate_average_access_count(self: *const BytecodeCache) f64 {
        if (self.cache_entries.count() == 0) return 0.0;
        
        var total_accesses: u64 = 0;
        var iterator = self.cache_entries.iterator();
        while (iterator.next()) |entry| {
            total_accesses += entry.value_ptr.access_count;
        }
        
        return @as(f64, @floatFromInt(total_accesses)) / @as(f64, @floatFromInt(self.cache_entries.count()));
    }
    
    fn calculate_memory_efficiency(self: *const BytecodeCache) f64 {
        if (self.cache_stats.current_size == 0) return 0.0;
        
        var code_size: usize = 0;
        var iterator = self.cache_entries.iterator();
        while (iterator.next()) |entry| {
            code_size += entry.value_ptr.bytecode.code.len;
        }
        
        return @as(f64, @floatFromInt(code_size)) / @as(f64, @floatFromInt(self.cache_stats.current_size));
    }
    
    pub const Stats = struct {
        cache_stats: CacheStats,
        entry_count: u32,
        average_access_count: f64,
        memory_efficiency: f64,
    };
    
    pub const AddressHashContext = struct {
        pub fn hash(self: @This(), key: Address) u64 {
            _ = self;
            return std.hash_map.hashString(&key.bytes);
        }
        
        pub fn eql(self: @This(), a: Address, b: Address) bool {
            _ = self;
            return std.mem.eql(u8, &a.bytes, &b.bytes);
        }
    };
};

// Simplified LRU list implementation
pub const LRUList = struct {
    allocator: std.mem.Allocator,
    head: ?Address,
    tail: ?Address,
    nodes: std.HashMap(Address, LRUNode, BytecodeCache.AddressHashContext, std.hash_map.default_max_load_percentage),
    
    pub const LRUNode = struct {
        prev: ?Address,
        next: ?Address,
    };
    
    pub fn init(allocator: std.mem.Allocator) LRUList {
        return LRUList{
            .allocator = allocator,
            .head = null,
            .tail = null,
            .nodes = std.HashMap(Address, LRUNode, BytecodeCache.AddressHashContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
    }
    
    pub fn deinit(self: *LRUList) void {
        self.nodes.deinit();
    }
    
    pub fn add_to_front(self: *LRUList, address: Address) !void {
        const node = LRUNode{ .prev = null, .next = self.head };
        
        if (self.head) |head_addr| {
            if (self.nodes.getPtr(head_addr)) |head_node| {
                head_node.prev = address;
            }
        } else {
            self.tail = address;
        }
        
        self.head = address;
        try self.nodes.put(address, node);
    }
    
    pub fn move_to_front(self: *LRUList, address: Address) void {
        self.remove(address);
        self.add_to_front(address) catch {};
    }
    
    pub fn remove(self: *LRUList, address: Address) void {
        if (self.nodes.fetchRemove(address)) |removed| {
            const node = removed.value;
            
            if (node.prev) |prev| {
                if (self.nodes.getPtr(prev)) |prev_node| {
                    prev_node.next = node.next;
                }
            } else {
                self.head = node.next;
            }
            
            if (node.next) |next| {
                if (self.nodes.getPtr(next)) |next_node| {
                    next_node.prev = node.prev;
                }
            } else {
                self.tail = node.prev;
            }
        }
    }
    
    pub fn rebuild(self: *LRUList) !void {
        // Rebuild for better cache locality - simplified implementation
        var addresses = std.ArrayList(Address).init(self.allocator);
        defer addresses.deinit();
        
        var current = self.head;
        while (current) |addr| {
            try addresses.append(addr);
            current = if (self.nodes.get(addr)) |node| node.next else null;
        }
        
        // Clear and rebuild
        self.nodes.clearRetainingCapacity();
        self.head = null;
        self.tail = null;
        
        for (addresses.items) |addr| {
            try self.add_to_front(addr);
        }
    }
};
```

#### 4. Bytecode Loaders
```zig
pub const LoaderRegistry = struct {
    allocator: std.mem.Allocator,
    loaders: std.HashMap(LoaderType, BytecodeLoader, LoaderTypeContext, std.hash_map.default_max_load_percentage),
    
    pub fn init(allocator: std.mem.Allocator) !LoaderRegistry {
        var registry = LoaderRegistry{
            .allocator = allocator,
            .loaders = std.HashMap(LoaderType, BytecodeLoader, LoaderTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
        
        // Register default loaders
        try registry.register_default_loaders();
        return registry;
    }
    
    pub fn deinit(self: *LoaderRegistry) void {
        self.loaders.deinit();
    }
    
    pub fn register(self: *LoaderRegistry, loader_type: LoaderType, loader: BytecodeLoader) !void {
        try self.loaders.put(loader_type, loader);
    }
    
    pub fn get_loader(self: *const LoaderRegistry, loader_type: LoaderType) ?*const BytecodeLoader {
        return self.loaders.getPtr(loader_type);
    }
    
    fn register_default_loaders(self: *LoaderRegistry) !void {
        // File system loader
        try self.loaders.put(.FileSystem, BytecodeLoader{
            .load_fn = FileSystemLoader.load,
            .validate_fn = FileSystemLoader.validate,
            .name = "filesystem",
            .version = "1.0.0",
        });
        
        // HTTP loader
        try self.loaders.put(.HTTP, BytecodeLoader{
            .load_fn = HTTPLoader.load,
            .validate_fn = HTTPLoader.validate,
            .name = "http",
            .version = "1.0.0",
        });
        
        // IPFS loader
        try self.loaders.put(.IPFS, BytecodeLoader{
            .load_fn = IPFSLoader.load,
            .validate_fn = IPFSLoader.validate,
            .name = "ipfs",
            .version = "1.0.0",
        });
        
        // Database loader
        try self.loaders.put(.Database, BytecodeLoader{
            .load_fn = DatabaseLoader.load,
            .validate_fn = DatabaseLoader.validate,
            .name = "database",
            .version = "1.0.0",
        });
    }
    
    pub const LoaderTypeContext = struct {
        pub fn hash(self: @This(), key: LoaderType) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: LoaderType, b: LoaderType) bool {
            _ = self;
            return a == b;
        }
    };
};

pub const LoaderType = enum {
    FileSystem,
    HTTP,
    IPFS,
    Database,
    Memory,
    Custom,
};

pub const BytecodeLoader = struct {
    load_fn: *const fn(std.mem.Allocator, ExternalBytecodeManager.LoadContext) anyerror!*ExternalBytecode,
    validate_fn: *const fn([]const u8) bool,
    name: []const u8,
    version: []const u8,
    
    pub fn load(self: *const BytecodeLoader, allocator: std.mem.Allocator, context: ExternalBytecodeManager.LoadContext) !*ExternalBytecode {
        return try self.load_fn(allocator, context);
    }
    
    pub fn validate(self: *const BytecodeLoader, uri: []const u8) bool {
        return self.validate_fn(uri);
    }
};

// File System Loader Implementation
pub const FileSystemLoader = struct {
    pub fn load(allocator: std.mem.Allocator, context: ExternalBytecodeManager.LoadContext) !*ExternalBytecode {
        const file = std.fs.cwd().openFile(context.source.uri, .{}) catch |err| {
            return err;
        };
        defer file.close();
        
        const file_size = try file.getEndPos();
        if (file_size > 24 * 1024) { // 24KB limit
            return error.BytecodeTooLarge;
        }
        
        const code = try allocator.alloc(u8, file_size);
        _ = try file.readAll(code);
        
        // Create metadata
        const metadata = ExternalBytecode.BytecodeMetadata{
            .version = "1.0.0",
            .source_uri = context.source.uri,
            .checksum = std.crypto.hash.sha2.Sha256.hash(code),
            .signature = null,
            .compression = .None,
            .original_size = code.len,
            .load_method = if (context.options.lazy) .Lazy else .Direct,
        };
        
        return try ExternalBytecode.init(allocator, context.address, code, metadata);
    }
    
    pub fn validate(uri: []const u8) bool {
        // Check if URI looks like a file path
        return uri.len > 0 and !std.mem.startsWith(u8, uri, "http");
    }
};

// HTTP Loader Implementation
pub const HTTPLoader = struct {
    pub fn load(allocator: std.mem.Allocator, context: ExternalBytecodeManager.LoadContext) !*ExternalBytecode {
        // Simplified HTTP loading implementation
        // In practice, would use actual HTTP client
        
        if (!std.mem.startsWith(u8, context.source.uri, "http")) {
            return error.InvalidURI;
        }
        
        // Simulate HTTP request with timeout
        const timeout_ns = context.timeout_ms * 1000000;
        _ = timeout_ns; // Would use for actual request
        
        // For now, return an error to indicate not implemented
        return error.HTTPLoaderNotImplemented;
    }
    
    pub fn validate(uri: []const u8) bool {
        return std.mem.startsWith(u8, uri, "http://") or std.mem.startsWith(u8, uri, "https://");
    }
};

// IPFS Loader Implementation
pub const IPFSLoader = struct {
    pub fn load(allocator: std.mem.Allocator, context: ExternalBytecodeManager.LoadContext) !*ExternalBytecode {
        // Simplified IPFS loading implementation
        _ = allocator;
        _ = context;
        
        return error.IPFSLoaderNotImplemented;
    }
    
    pub fn validate(uri: []const u8) bool {
        return std.mem.startsWith(u8, uri, "ipfs://") or std.mem.startsWith(u8, uri, "/ipfs/");
    }
};

// Database Loader Implementation
pub const DatabaseLoader = struct {
    pub fn load(allocator: std.mem.Allocator, context: ExternalBytecodeManager.LoadContext) !*ExternalBytecode {
        // Simplified database loading implementation
        _ = allocator;
        _ = context;
        
        return error.DatabaseLoaderNotImplemented;
    }
    
    pub fn validate(uri: []const u8) bool {
        return std.mem.startsWith(u8, uri, "db://") or std.mem.startsWith(u8, uri, "sql://");
    }
};
```

#### 5. Performance Tracking
```zig
pub const BytecodePerformanceTracker = struct {
    cache_hits: u64,
    cache_misses: u64,
    loads: u64,
    unloads: u64,
    verifications: u64,
    verification_failures: u64,
    total_load_time_ns: u64,
    total_bytes_loaded: u64,
    
    pub fn init() BytecodePerformanceTracker {
        return std.mem.zeroes(BytecodePerformanceTracker);
    }
    
    pub fn record_cache_hit(self: *BytecodePerformanceTracker) void {
        self.cache_hits += 1;
    }
    
    pub fn record_cache_miss(self: *BytecodePerformanceTracker) void {
        self.cache_misses += 1;
    }
    
    pub fn record_load(self: *BytecodePerformanceTracker, time_ns: i64, bytes: usize) void {
        self.loads += 1;
        self.total_load_time_ns += @intCast(time_ns);
        self.total_bytes_loaded += bytes;
    }
    
    pub fn record_unload(self: *BytecodePerformanceTracker) void {
        self.unloads += 1;
    }
    
    pub fn record_verification(self: *BytecodePerformanceTracker, success: bool) void {
        self.verifications += 1;
        if (!success) {
            self.verification_failures += 1;
        }
    }
    
    pub fn get_metrics(self: *const BytecodePerformanceTracker) Metrics {
        const total_cache_requests = self.cache_hits + self.cache_misses;
        
        return Metrics{
            .cache_hit_rate = if (total_cache_requests > 0)
                @as(f64, @floatFromInt(self.cache_hits)) / @as(f64, @floatFromInt(total_cache_requests))
            else 0.0,
            .total_loads = self.loads,
            .total_unloads = self.unloads,
            .average_load_time_ns = if (self.loads > 0)
                @as(f64, @floatFromInt(self.total_load_time_ns)) / @as(f64, @floatFromInt(self.loads))
            else 0.0,
            .average_bytes_per_load = if (self.loads > 0)
                @as(f64, @floatFromInt(self.total_bytes_loaded)) / @as(f64, @floatFromInt(self.loads))
            else 0.0,
            .verification_success_rate = if (self.verifications > 0)
                @as(f64, @floatFromInt(self.verifications - self.verification_failures)) / @as(f64, @floatFromInt(self.verifications))
            else 0.0,
            .bytes_per_second = if (self.total_load_time_ns > 0)
                @as(f64, @floatFromInt(self.total_bytes_loaded)) / (@as(f64, @floatFromInt(self.total_load_time_ns)) / 1_000_000_000.0)
            else 0.0,
        };
    }
    
    pub const Metrics = struct {
        cache_hit_rate: f64,
        total_loads: u64,
        total_unloads: u64,
        average_load_time_ns: f64,
        average_bytes_per_load: f64,
        verification_success_rate: f64,
        bytes_per_second: f64,
    };
};
```

## Implementation Requirements

### Core Functionality
1. **Dynamic Loading**: Load bytecode from various external sources
2. **Caching Strategies**: Efficient caching with LRU, LFU, TTL, and adaptive strategies
3. **Security Validation**: Bytecode verification and signature checking
4. **Performance Optimization**: Lazy loading and preload capabilities
5. **Source Agnostic**: Support multiple bytecode sources (files, HTTP, IPFS, databases)
6. **Memory Management**: Efficient memory usage with reference counting

## Implementation Tasks

### Task 1: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const ExternalBytecodeManager = @import("external_bytecode/external_bytecode_manager.zig").ExternalBytecodeManager;

pub const Vm = struct {
    // Existing fields...
    external_bytecode_manager: ?ExternalBytecodeManager,
    external_bytecode_enabled: bool,
    
    pub fn enable_external_bytecode(self: *Vm, config: ExternalBytecodeManager.BytecodeConfig) !void {
        self.external_bytecode_manager = try ExternalBytecodeManager.init(self.allocator, config);
        self.external_bytecode_enabled = true;
    }
    
    pub fn disable_external_bytecode(self: *Vm) void {
        if (self.external_bytecode_manager) |*manager| {
            manager.deinit();
            self.external_bytecode_manager = null;
        }
        self.external_bytecode_enabled = false;
    }
    
    pub fn load_external_contract(
        self: *Vm,
        address: Address,
        source_uri: []const u8,
        loader_type: LoaderType
    ) !void {
        if (self.external_bytecode_manager) |*manager| {
            const source = ExternalBytecodeManager.BytecodeSource{
                .loader_type = loader_type,
                .uri = source_uri,
                .metadata = null,
            };
            
            const load_options = ExternalBytecodeManager.LoadOptions{
                .lazy = false,
                .verify_signature = true,
                .priority = .Normal,
            };
            
            _ = try manager.load_bytecode(address, source, load_options);
        } else {
            return error.ExternalBytecodeNotEnabled;
        }
    }
    
    pub fn get_external_bytecode_stats(self: *Vm) ?ExternalBytecodeManager.BytecodeCache.Stats {
        if (self.external_bytecode_manager) |*manager| {
            return manager.get_cache_stats();
        }
        return null;
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/external_bytecode/external_bytecode_test.zig`

### Test Cases
```zig
test "external bytecode manager initialization" {
    // Test manager creation with different configs
    // Test loader registry initialization
    // Test cache setup
}

test "bytecode loading from different sources" {
    // Test file system loading
    // Test HTTP loading (mocked)
    // Test error handling for invalid sources
}

test "bytecode caching strategies" {
    // Test LRU caching
    // Test LFU caching
    // Test TTL caching
    // Test adaptive caching
}

test "bytecode verification and security" {
    // Test checksum verification
    // Test signature validation
    // Test security constraint enforcement
}

test "performance and memory management" {
    // Test reference counting
    // Test memory cleanup
    // Test performance metrics
}

test "integration with VM execution" {
    // Test VM integration
    // Test contract execution with external bytecode
    // Test performance impact measurement
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/external_bytecode/external_bytecode_manager.zig` - Main external bytecode framework
- `/src/evm/external_bytecode/external_bytecode.zig` - Bytecode structure and operations
- `/src/evm/external_bytecode/bytecode_cache.zig` - Caching implementation
- `/src/evm/external_bytecode/loader_registry.zig` - Loader management
- `/src/evm/external_bytecode/bytecode_verifier.zig` - Verification system
- `/src/evm/external_bytecode/security_manager.zig` - Security validation
- `/src/evm/external_bytecode/performance_tracker.zig` - Performance monitoring
- `/src/evm/vm.zig` - VM integration
- `/test/evm/external_bytecode/external_bytecode_test.zig` - Comprehensive tests

## Success Criteria

1. **Dynamic Loading**: Successfully load bytecode from multiple source types
2. **Efficient Caching**: Low-latency bytecode access with effective caching
3. **Security**: Robust verification and validation of external bytecode
4. **Performance**: Minimal overhead for bytecode management
5. **Reliability**: Proper error handling and fallback mechanisms
6. **Scalability**: Support for large numbers of external contracts

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

#### 1. **Unit Tests** (`/test/evm/bytecode/external_bytecode_test.zig`)
```zig
// Test basic external bytecode functionality
test "external_bytecode basic loading with known scenarios"
test "external_bytecode handles validation correctly"
test "external_bytecode validates bytecode format"
test "external_bytecode produces expected execution results"
```

#### 2. **Integration Tests**
```zig
test "external_bytecode integrates with EVM execution"
test "external_bytecode works with existing contract systems"
test "external_bytecode maintains hardfork compatibility"
test "external_bytecode handles bytecode version transitions"
```

#### 3. **Performance Tests**
```zig
test "external_bytecode meets loading speed targets"
test "external_bytecode memory usage vs baseline"
test "external_bytecode scalability under high bytecode load"
test "external_bytecode benchmark bytecode validation overhead"
```

#### 4. **Error Handling Tests**
```zig
test "external_bytecode proper invalid bytecode error handling"
test "external_bytecode handles corrupted bytecode gracefully"
test "external_bytecode graceful degradation on loading failures"
test "external_bytecode recovery from bytecode system errors"
```

#### 5. **Compliance Tests**
```zig
test "external_bytecode EVM specification bytecode compliance"
test "external_bytecode cross-client bytecode compatibility"
test "external_bytecode hardfork bytecode rule adherence"
test "external_bytecode deterministic bytecode execution"
```

#### 6. **Security Tests**
```zig
test "external_bytecode handles malicious bytecode safely"
test "external_bytecode prevents bytecode injection attacks"
test "external_bytecode validates bytecode security boundaries"
test "external_bytecode maintains execution isolation"
```

### Test Development Priority
1. **Core bytecode functionality tests** - Ensure basic bytecode loading and validation works
2. **Compliance tests** - Meet EVM specification bytecode requirements
3. **Performance tests** - Achieve bytecode processing efficiency targets
4. **Security tests** - Prevent bytecode-related vulnerabilities
5. **Error handling tests** - Robust bytecode failure management
6. **Edge case tests** - Handle bytecode boundary conditions

### Test Data Sources
- **EVM specification**: Official bytecode format requirements
- **Reference implementations**: Cross-client bytecode compatibility data
- **Performance baselines**: Bytecode loading and validation speed measurements
- **Security test vectors**: Malicious bytecode prevention cases
- **Real-world scenarios**: Production bytecode pattern validation

### Continuous Testing
- Run `zig build test-all` after every code change
- Maintain 100% test coverage for public bytecode APIs
- Validate bytecode processing performance regression prevention
- Test debug and release builds with different bytecode types
- Verify cross-platform bytecode handling consistency

### Test-First Examples

**Before writing any implementation:**
```zig
test "external_bytecode basic valid bytecode loading" {
    // This test MUST fail initially
    const bytecode = test_utils.createValidBytecode();
    const loader = test_utils.createBytecodeLoader();
    
    const result = external_bytecode.loadBytecode(loader, bytecode);
    try testing.expect(result.is_valid);
    try testing.expectEqual(bytecode.len, result.loaded_size);
}
```

**Only then implement:**
```zig
pub const external_bytecode = struct {
    pub fn loadBytecode(loader: *BytecodeLoader, bytecode: []const u8) !LoadResult {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Notes
- **Never commit without passing tests** (`zig build test-all`)
- **Test all bytecode format combinations** - Especially for different EVM versions
- **Verify EVM specification compliance** - Critical for protocol bytecode correctness
- **Test bytecode performance implications** - Especially for large contract loading
- **Validate bytecode security properties** - Prevent malicious bytecode execution

## References

- [Dynamic Loading](https://en.wikipedia.org/wiki/Dynamic_loading) - Dynamic code loading concepts
- [Caching Strategies](https://en.wikipedia.org/wiki/Cache_replacement_policies) - Cache replacement algorithms
- [Code Signing](https://en.wikipedia.org/wiki/Code_signing) - Digital signature verification
- [Lazy Loading](https://en.wikipedia.org/wiki/Lazy_loading) - Deferred loading patterns
- [Content-Addressable Storage](https://en.wikipedia.org/wiki/Content-addressable_storage) - IPFS and similar systems

## EVMONE Context

An analysis of the `evmone` codebase reveals several components and patterns that are highly relevant to implementing an external bytecode system. The most pertinent areas are the EOF (EVM Object Format) validation, which mirrors the need for bytecode verification and metadata parsing, the LRU cache for implementing caching strategies, and the host interface for abstracting code retrieval.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/eof.hpp">
```cpp
/// This file provides context on how a structured bytecode format like the proposed
/// `ExternalBytecode` can be implemented. The `EOF1Header` is analogous to the
/// `ExternalBytecode.BytecodeMetadata` struct, containing information about
/// different sections (code, data) within the bytecode container. The validation
/// and parsing logic is a great reference for the `BytecodeVerifier`.

#pragma once

#include <evmc/bytes.hpp>
#include <evmc/evmc.hpp>
#include <evmc/utils.h>
#include <cassert>
#include <cstddef>
#include <cstdint>
#include <string_view>
#include <vector>

namespace evmone
{
using evmc::bytes;
using evmc::bytes_view;
using namespace evmc::literals;

constexpr uint8_t EOF_MAGIC_BYTES[] = {0xef, 0x00};
constexpr bytes_view EOF_MAGIC{EOF_MAGIC_BYTES, std::size(EOF_MAGIC_BYTES)};

struct EOFCodeType
{
    uint8_t inputs;               ///< Number of code inputs.
    uint8_t outputs;              ///< Number of code outputs.
    uint16_t max_stack_increase;  ///< Maximum stack height above the inputs reached in the code.

    EOFCodeType(uint8_t inputs_, uint8_t outputs_, uint16_t max_stack_increase_)
      : inputs{inputs_}, outputs{outputs_}, max_stack_increase{max_stack_increase_}
    {}
};

struct EOF1Header
{
    /// Size of a type entry in bytes.
    static constexpr size_t TYPE_ENTRY_SIZE = sizeof(EOFCodeType);

    /// The EOF version, 0 means legacy code.
    uint8_t version = 0;

    /// Offset of the type section start.
    size_t type_section_offset = 0;

    /// Size of every code section.
    std::vector<uint16_t> code_sizes;

    /// Offset of every code section from the beginning of the EOF container.
    std::vector<uint16_t> code_offsets;

    /// Size of the data section.
    uint16_t data_size = 0;
    /// Offset of data container section start.
    uint32_t data_offset = 0;
    /// Size of every container section.
    std::vector<uint32_t> container_sizes;
    /// Offset of every container section start;
    std::vector<uint32_t> container_offsets;

    /// A helper to extract reference to a specific code section.
    [[nodiscard]] bytes_view get_code(bytes_view container, size_t code_idx) const noexcept
    {
        assert(code_idx < code_offsets.size());
        return container.substr(code_offsets[code_idx], code_sizes[code_idx]);
    }

    /// A helper to extract reference to the data section.
    [[nodiscard]] bytes_view get_data(bytes_view container) const noexcept
    {
        return container.substr(data_offset);
    }
};

/// Checks if code starts with EOF FORMAT + MAGIC, doesn't validate the format.
[[nodiscard]] EVMC_EXPORT bool is_eof_container(bytes_view code) noexcept;

/// Reads the section sizes assuming that container has valid format.
/// (must be true for all EOF contracts on-chain)
[[nodiscard]] EVMC_EXPORT EOF1Header read_valid_eof1_header(bytes_view container);

enum class EOFValidationError
{
    success,
    invalid_prefix,
    // ... other validation errors
};

enum class ContainerKind : uint8_t
{
    initcode,
    runtime,
};

/// Validates whether given container is a valid EOF according to the rules of given revision.
[[nodiscard]] EVMC_EXPORT EOFValidationError validate_eof(
    evmc_revision rev, ContainerKind kind, bytes_view container) noexcept;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/lru_cache.hpp">
```cpp
/// The prompt requires a `BytecodeCache` with multiple eviction strategies, including LRU.
/// This file provides a production-quality, header-only C++ implementation of an
/// LRU cache using `std::list` and `std::unordered_map` for O(1) complexity.
/// It's a perfect reference for building the requested caching system.

#pragma once

#include <cassert>
#include <list>
#include <optional>
#include <unordered_map>

namespace evmone
{
/// Least Recently Used (LRU) cache.
template <typename Key, typename Value>
class LRUCache
{
    struct LRUEntry
    {
        const Key& key;
        Value value;
    };

    using LRUList = std::list<LRUEntry>;
    using LRUIterator = typename LRUList::iterator;
    using Map = std::unordered_map<Key, LRUIterator>;

    const size_t capacity_;
    LRUList lru_list_;
    Map map_;

    void move_to_back(LRUIterator it) noexcept { lru_list_.splice(lru_list_.end(), lru_list_, it); }

public:
    explicit LRUCache(size_t capacity) : capacity_{capacity}
    {
        assert(capacity_ != 0);
        map_.reserve(capacity);
    }

    void clear() noexcept
    {
        map_.clear();
        lru_list_.clear();
    }

    std::optional<Value> get(const Key& key) noexcept
    {
        if (const auto it = map_.find(key); it != map_.end())
        {
            move_to_back(it->second);
            return it->second->value;
        }
        return {};
    }

    void put(Key key, Value value)
    {
        if (map_.size() == capacity_)
        {
            auto lru_it = lru_list_.begin();
            auto node = map_.extract(lru_it->key);
            // ... eviction logic ...
        }
        else
        {
            // ... insertion logic ...
        }
    }
};

}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline.hpp">
```cpp
/// The `CodeAnalysis` class demonstrates what information is useful to pre-compute
/// and cache for a given piece of bytecode. The external bytecode system in the prompt
/// would benefit from a similar analysis step to cache JUMPDEST locations and other
/// static properties of the code, improving execution performance.

namespace evmone::baseline
{
class CodeAnalysis
{
public:
    using JumpdestMap = std::vector<bool>;

private:
    bytes_view m_raw_code;
    bytes_view m_executable_code;
    JumpdestMap m_jumpdest_map;
    EOF1Header m_eof_header;
    std::unique_ptr<uint8_t[]> m_padded_code;

public:
    /// Check if given position is valid jump destination. Use only for legacy code.
    [[nodiscard]] bool check_jumpdest(uint64_t position) const noexcept
    {
        if (position >= m_jumpdest_map.size())
            return false;
        return m_jumpdest_map[static_cast<size_t>(position)];
    }

    // ... other methods ...
};

/// Analyze the EVM code in preparation for execution.
EVMC_EXPORT CodeAnalysis analyze(bytes_view code, bool eof_enabled);
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/host.hpp">
```cpp
/// The Host interface defines how the VM interacts with the outside world to retrieve
/// state, including account code. The proposed `ExternalBytecodeManager` would
/// essentially be implemented behind this interface. A custom `Host` implementation
/// would delegate `get_code_size`, `get_code_hash`, and `copy_code` calls to the manager.

#pragma once

#include "state.hpp"
#include "state_view.hpp"
#include <optional>

namespace evmone::state
{
class Host : public evmc::Host
{
    // ...
private:
    [[nodiscard]] bool account_exists(const address& addr) const noexcept override;
    [[nodiscard]] size_t get_code_size(const address& addr) const noexcept override;
    [[nodiscard]] bytes32 get_code_hash(const address& addr) const noexcept override;
    size_t copy_code(const address& addr, size_t code_offset, uint8_t* buffer_data,
        size_t buffer_size) const noexcept override;
    // ...
};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/delegation.hpp">
```cpp
/// The EIP-7702 delegation mechanism is a form of external bytecode loading.
/// This file shows how to detect a special prefix in the code to trigger
/// fetching the actual executable code from a different address (the delegate).
/// This pattern is directly applicable to the prompt's requirement for loaders.

#pragma once

#include <evmc/bytes.hpp>
#include <evmc/evmc.hpp>
#include <evmc/utils.h>

namespace evmone
{
using evmc::bytes_view;

/// Prefix of code for delegated accounts
/// defined by [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702)
constexpr uint8_t DELEGATION_MAGIC_BYTES[] = {0xef, 0x01, 0x00};
constexpr bytes_view DELEGATION_MAGIC{DELEGATION_MAGIC_BYTES, std::size(DELEGATION_MAGIC_BYTES)};

/// Check if code contains EIP-7702 delegation designator
constexpr bool is_code_delegated(bytes_view code) noexcept
{
    return code.starts_with(DELEGATION_MAGIC);
}

/// Get EIP-7702 delegate address from the code of addr, if it is delegated.
EVMC_EXPORT std::optional<evmc::address> get_delegate_address(
    const evmc::HostInterface& host, const evmc::address& addr) noexcept;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/delegation.cpp">
```cpp
/// This implementation shows the logic for `get_delegate_address`. It copies the code prefix,
/// checks for the magic bytes, and then extracts the delegate address. A similar pattern
/// could be used to extract a URI or identifier for an external bytecode source.

#include "delegation.hpp"
#include <cassert>

namespace evmone
{
std::optional<evmc::address> get_delegate_address(
    const evmc::HostInterface& host, const evmc::address& addr) noexcept
{
    // Load the code prefix up to the delegation designation size.
    // The HostInterface::copy_code() copies up to the addr's code size
    // and returns the number of bytes copied.
    uint8_t designation_buffer[std::size(DELEGATION_MAGIC) + sizeof(evmc::address)];
    const auto size = host.copy_code(addr, 0, designation_buffer, std::size(designation_buffer));
    const bytes_view designation{designation_buffer, size};

    if (!is_code_delegated(designation))
        return {};

    // Copy the delegate address from the designation buffer.
    evmc::address delegate_address;
    // Assume the designation with the valid magic has also valid length.
    assert(designation.size() == std::size(designation_buffer));
    std::ranges::copy(designation.substr(std::size(DELEGATION_MAGIC)), delegate_address.bytes);
    return delegate_address;
}
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
/// The `ExecutionState` struct is the context for a single call frame. It holds a
/// reference to the code being executed. In an implementation of external bytecode,
/// this is where a pointer to the `ExternalBytecode` object (or its analysis result)
/// would live, making it accessible to the instruction loop.

class ExecutionState
{
public:
    // ...
    const evmc_message* msg = nullptr;
    evmc::HostContext host;
    evmc_revision rev = {};

    /// Reference to original EVM code container.
    bytes_view original_code;

    // ...

    /// Pointer to code analysis.
    union
    {
        const baseline::CodeAnalysis* baseline = nullptr;
        const advanced::AdvancedCodeAnalysis* advanced;
    } analysis{};

    // ...
};
```
</file>
</evmone>

## Prompt Corrections

The original prompt describes an `ExternalBytecodeManager` as a central component within the `Vm` struct. This is a valid design, but `evmone` offers a different architectural pattern that achieves a similar outcome with greater separation of concerns.

-   **Host Interface Abstraction**: In `evmone`, the `Vm` is completely decoupled from how state (including bytecode) is stored and retrieved. It interacts with the outside world exclusively through the `evmc_host_interface`.

-   **Recommended Integration**: Instead of putting the `ExternalBytecodeManager` inside the `Vm`, a more `evmone`-like approach would be to implement a custom `Host` that *uses* the `ExternalBytecodeManager`.

    -   The custom `Host`'s implementation of `get_code`, `get_code_size`, and `get_code_hash` would first check if an address corresponds to an external contract.
    -   If it does, it would call `ExternalBytecodeManager.load_bytecode()` to get the code.
    -   If not, it would fall back to the standard state database.

This approach keeps the core VM logic clean and agnostic of where the bytecode comes from, which is a powerful and flexible design. The provided `evmone` snippets for the `Host` interface illustrate the API that such a custom host would need to implement.



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/interpreter.py">
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
                Uint(0), U256(0), tuple(), set(), AddressCollision()
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/utils/message.py">
```python
def prepare_message(
    block_env: BlockEnvironment,
    tx_env: TransactionEnvironment,
    tx: Transaction,
) -> Message:
    """
    Execute a transaction against the provided environment.

    Parameters
    ----------
    block_env :
        Environment for the Ethereum Virtual Machine.
    tx_env :
        Environment for the transaction.
    tx :
        Transaction to be executed.

    Returns
    -------
    message: `ethereum.shanghai.vm.Message`
        Items containing contract creation or message call specific data.
    """
    accessed_addresses = set()
    accessed_addresses.add(tx_env.origin)
    accessed_addresses.update(PRE_COMPILED_CONTRACTS.keys())
    accessed_addresses.update(tx_env.access_list_addresses)

    if isinstance(tx.to, Bytes0):
        current_target = compute_contract_address(
            tx_env.origin,
            get_account(block_env.state, tx_env.origin).nonce - Uint(1),
        )
        msg_data = Bytes(b"")
        code = tx.data
        code_address = None
    elif isinstance(tx.to, Address):
        current_target = tx.to
        msg_data = tx.data
        code = get_account(block_env.state, tx.to).code

        code_address = tx.to
    else:
        raise AssertionError("Target must be address or empty bytes")

    accessed_addresses.add(current_target)

    return Message(
        block_env=block_env,
        tx_env=tx_env,
        caller=tx_env.origin,
        target=tx.to,
        gas=tx_env.gas,
        value=tx.value,
        data=msg_data,
        code=code,
        depth=Uint(0),
        current_target=current_target,
        code_address=code_address,
        should_transfer_value=True,
        is_static=False,
        accessed_addresses=accessed_addresses,
        accessed_storage_keys=set(tx_env.access_list_storage_keys),
        parent_evm=None,
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/state.py">
```python
def get_account(state: State, address: Address) -> Account:
    """
    Get the `Account` object at an address. Returns `EMPTY_ACCOUNT` if there
    is no account at the address.
    ...
    """
    account = get_account_optional(state, address)
    if isinstance(account, Account):
        return account
    else:
        return EMPTY_ACCOUNT

def set_code(state: State, address: Address, code: Bytes) -> None:
    """
    Sets Account code.
    ...
    """

    def write_code(sender: Account) -> None:
        sender.code = code

    modify_state(state, address, write_code)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/instructions/system.py">
```python
def generic_call(
    evm: Evm,
    gas: Uint,
    value: U256,
    caller: Address,
    to: Address,
    code_address: Address,
    should_transfer_value: bool,
    is_staticcall: bool,
    memory_input_start_position: U256,
    memory_input_size: U256,
    memory_output_start_position: U256,
    memory_output_size: U256,
) -> None:
    """
    Perform the core logic of the `CALL*` family of opcodes.
    """
    from ...vm.interpreter import STACK_DEPTH_LIMIT, process_message

    # ... (rest of the function)

    call_data = memory_read_bytes(
        evm.memory, memory_input_start_position, memory_input_size
    )
    code = get_account(evm.message.block_env.state, code_address).code
    child_message = Message(
        # ...
        code=code,
        # ...
    )
    child_evm = process_message(child_message)

    # ... (rest of the function)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/instructions/environment.py">
```python
def extcodesize(evm: Evm) -> None:
    """
    Push the code size of a given account onto the stack.
    ...
    """
    # STACK
    address = to_address(pop(evm.stack))

    # GAS
    if address in evm.accessed_addresses:
        access_gas_cost = GAS_WARM_ACCESS
    else:
        evm.accessed_addresses.add(address)
        access_gas_cost = GAS_COLD_ACCOUNT_ACCESS

    charge_gas(evm, access_gas_cost)

    # OPERATION
    code = get_account(evm.message.block_env.state, address).code

    codesize = U256(len(code))
    push(evm.stack, codesize)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def extcodecopy(evm: Evm) -> None:
    """
    Copy a portion of an account's code to memory.
    ...
    """
    # STACK
    address = to_address(pop(evm.stack))
    memory_start_index = pop(evm.stack)
    code_start_index = pop(evm.stack)
    size = pop(evm.stack)

    # ... (gas calculation)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    code = get_account(evm.message.block_env.state, address).code

    value = buffer_read(code, code_start_index, size)
    memory_write(evm.memory, memory_start_index, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
</execution-specs>
## Prompt Corrections
The provided prompt is exceptionally detailed regarding the *new* components to be built (`ExternalBytecodeManager`, `ExternalBytecode`, etc.). However, it could be improved by explicitly stating where the new logic should integrate with the existing VM execution flow.

### Suggested Integration Point:

The core of the integration will likely happen where contract code is currently fetched from the state. Based on the `execution-specs`, this occurs in functions like `prepare_message` (for initial transaction execution) and `generic_call` (for inter-contract calls).

The logic should be approximately:
1. When a contract's code is needed (e.g., for a `CALL` to a specific address).
2. Check if the address is managed by the `ExternalBytecodeManager`.
3. **If yes**: Use `ExternalBytecodeManager.load_bytecode()` to get the code.
4. **If no**: Fall back to the existing mechanism of `state.get_account(address).code`.
5. The retrieved code (either from the external manager or the state) is then passed to the `Evm` execution frame.

This clarification will help the developer understand that they are not just building a standalone manager, but hooking it into the critical path of code loading within the EVM.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/interpreter.py">
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
                Uint(0),
                U256(0),
                tuple(),
                set(),
                AddressCollision(),
                Bytes(b""),
            )
        else:
            evm = process_create_message(message)
    else:
        if message.tx_env.authorizations != ():
            refund_counter += set_delegation(message)

        delegated_address = get_delegated_code_address(message.code)
        if delegated_address is not None:
            message.disable_precompiles = True
            message.accessed_addresses.add(delegated_address)
            message.code = get_account(block_env.state, delegated_address).code
            message.code_address = delegated_address

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
        return_data=evm.output,
    )


def process_create_message(message: Message) -> Evm:
    """
    Executes a call to create a smart contract.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: :py:class:`~ethereum.prague.vm.Evm`
        Items containing execution specific objects.
    """
    state = message.block_env.state
    transient_storage = message.tx_env.transient_storage
    # take snapshot of state before processing the message
    begin_transaction(state, transient_storage)

    # If the address where the account is being created has storage, it is
    # destroyed. This can only happen in the following highly unlikely
    # circumstances:
    # * The address created by a `CREATE` call collides with a subsequent
    #   `CREATE` or `CREATE2` call.
    # * The first `CREATE` happened before Spurious Dragon and left empty
    #   code.
    destroy_storage(state, message.current_target)

    # In the previously mentioned edge case the preexisting storage is ignored
    # for gas refund purposes. In order to do this we must track created
    # accounts.
    mark_account_created(state, message.current_target)

    increment_nonce(state, message.current_target)
    evm = process_message(message)
    if not evm.error:
        contract_code = evm.output
        contract_code_gas = Uint(len(contract_code)) * GAS_CODE_DEPOSIT
        try:
            if len(contract_code) > 0:
                if contract_code[0] == 0xEF:
                    raise InvalidContractPrefix
            charge_gas(evm, contract_code_gas)
            if len(contract_code) > MAX_CODE_SIZE:
                raise OutOfGasError
        except ExceptionalHalt as error:
            rollback_transaction(state, transient_storage)
            evm.gas_left = Uint(0)
            evm.output = b""
            evm.error = error
        else:
            set_code(state, message.current_target, contract_code)
            commit_transaction(state, transient_storage)
    else:
        rollback_transaction(state, transient_storage)
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
            if message.disable_precompiles:
                return evm
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/runtime.py">
```python
def get_valid_jump_destinations(code: Bytes) -> Set[Uint]:
    """
    Analyze the evm code to obtain the set of valid jump destinations.

    Valid jump destinations are defined as follows:
        * The jump destination is less than the length of the code.
        * The jump destination should have the `JUMPDEST` opcode (0x5B).
        * The jump destination shouldn't be part of the data corresponding to
          `PUSH-N` opcodes.

    Note - Jump destinations are 0-indexed.

    Parameters
    ----------
    code :
        The EVM code which is to be executed.

    Returns
    -------
    valid_jump_destinations: `Set[Uint]`
        The set of valid jump destinations in the code.
    """
    valid_jump_destinations = set()
    pc = Uint(0)

    while pc < ulen(code):
        try:
            current_opcode = Ops(code[pc])
        except ValueError:
            # Skip invalid opcodes, as they don't affect the jumpdest
            # analysis. Nevertheless, such invalid opcodes would be caught
            # and raised when the interpreter runs.
            pc += Uint(1)
            continue

        if current_opcode == Ops.JUMPDEST:
            valid_jump_destinations.add(pc)
        elif Ops.PUSH1.value <= current_opcode.value <= Ops.PUSH32.value:
            # If PUSH-N opcodes are encountered, skip the current opcode along
            # with the trailing data segment corresponding to the PUSH-N
            # opcodes.
            push_data_size = current_opcode.value - Ops.PUSH1.value + 1
            pc += Uint(push_data_size)

        pc += Uint(1)

    return valid_jump_destinations
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/utils/message.py">
```python
def prepare_message(
    block_env: BlockEnvironment,
    tx_env: TransactionEnvironment,
    tx: Transaction,
) -> Message:
    """
    Execute a transaction against the provided environment.

    Parameters
    ----------
    block_env :
        Environment for the Ethereum Virtual Machine.
    tx_env :
        Environment for the transaction.
    tx :
        Transaction to be executed.

    Returns
    -------
    message: `ethereum.prague.vm.Message`
        Items containing contract creation or message call specific data.
    """
    accessed_addresses = set()
    accessed_addresses.add(tx_env.origin)
    accessed_addresses.update(PRE_COMPILED_CONTRACTS.keys())
    accessed_addresses.update(tx_env.access_list_addresses)

    if isinstance(tx.to, Bytes0):
        current_target = compute_contract_address(
            tx_env.origin,
            get_account(block_env.state, tx_env.origin).nonce - Uint(1),
        )
        msg_data = Bytes(b"")
        code = tx.data
        code_address = None
    elif isinstance(tx.to, Address):
        current_target = tx.to
        msg_data = tx.data
        code = get_account(block_env.state, tx.to).code
        code_address = tx.to
    else:
        raise AssertionError("Target must be address or empty bytes")

    accessed_addresses.add(current_target)

    return Message(
        block_env=block_env,
        tx_env=tx_env,
        caller=tx_env.origin,
        target=tx.to,
        gas=tx_env.gas,
        value=tx.value,
        data=msg_data,
        code=code,
        depth=Uint(0),
        current_target=current_target,
        code_address=code_address,
        should_transfer_value=True,
        is_static=False,
        accessed_addresses=accessed_addresses,
        accessed_storage_keys=set(tx_env.access_list_storage_keys),
        disable_precompiles=False,
        parent_evm=None,
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/state.py">
```python
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

def set_code(state: State, address: Address, code: Bytes) -> None:
    """
    Sets Account code.

    Parameters
    ----------
    state:
        The current state.

    address:
        Address of the account whose code needs to be update.

    code:
        The bytecode that needs to be set.
    """

    def write_code(sender: Account) -> None:
        sender.code = code

    modify_state(state, address, write_code)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/system.py">
```python
def create(evm: Evm) -> None:
    """
    Creates a new account with associated code.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    # STACK
    endowment = pop(evm.stack)
    memory_start_position = pop(evm.stack)
    memory_size = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(memory_start_position, memory_size)]
    )
    init_code_gas = init_code_cost(Uint(memory_size))

    charge_gas(evm, GAS_CREATE + extend_memory.cost + init_code_gas)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    contract_address = compute_contract_address(
        evm.message.current_target,
        get_account(
            evm.message.block_env.state, evm.message.current_target
        ).nonce,
    )

    generic_create(
        evm,
        endowment,
        contract_address,
        memory_start_position,
        memory_size,
    )

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/environment.py">
```python
def extcodesize(evm: Evm) -> None:
    """
    Push the code size of a given account onto the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    address = to_address(pop(evm.stack))

    # GAS
    if address in evm.accessed_addresses:
        access_gas_cost = GAS_WARM_ACCESS
    else:
        evm.accessed_addresses.add(address)
        access_gas_cost = GAS_COLD_ACCOUNT_ACCESS

    charge_gas(evm, access_gas_cost)

    # OPERATION
    code = get_account(evm.message.block_env.state, address).code

    codesize = U256(len(code))
    push(evm.stack, codesize)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def extcodecopy(evm: Evm) -> None:
    """
    Copy a portion of an account's code to memory.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    address = to_address(pop(evm.stack))
    memory_start_index = pop(evm.stack)
    code_start_index = pop(evm.stack)
    size = pop(evm.stack)

    # GAS
    words = ceil32(Uint(size)) // Uint(32)
    copy_gas_cost = GAS_COPY * words
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(memory_start_index, size)]
    )

    if address in evm.accessed_addresses:
        access_gas_cost = GAS_WARM_ACCESS
    else:
        evm.accessed_addresses.add(address)
        access_gas_cost = GAS_COLD_ACCOUNT_ACCESS

    charge_gas(evm, access_gas_cost + copy_gas_cost + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    code = get_account(evm.message.block_env.state, address).code

    value = buffer_read(code, code_start_index, size)
    memory_write(evm.memory, memory_start_index, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/__init__.py">
```python
@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    block_env: BlockEnvironment
    tx_env: TransactionEnvironment
    caller: Address
    target: Union[Bytes0, Address]
    current_target: Address
    gas: Uint
    value: U256
    data: Bytes
    code_address: Optional[Address]
    code: Bytes
    depth: Uint
    should_transfer_value: bool
    is_static: bool
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
    disable_precompiles: bool
    parent_evm: Optional["Evm"]


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
The provided prompt is well-structured and detailed, outlining a significant new feature for the EVM implementation. There are no direct "errors" to correct, as it's a feature proposal. However, here are some clarifications and considerations based on the `execution-specs` that will be important during implementation:

1.  **Integration Point for Code Loading**: The most logical place to integrate the external bytecode loading is within the function that prepares a `Message` for execution (equivalent to `prepare_message` in `ethereum.prague.utils.message`). Currently, this function fetches code directly from the state: `code = get_account(block_env.state, tx.to).code`. The new system should hook in here. If an address has external bytecode associated with it (perhaps managed by the `ExternalBytecodeManager`), that code should be used instead of the on-chain code.

2.  **Opcode Behavior (`EXTCODESIZE`, `EXTCODECOPY`, `EXTCODEHASH`)**: These opcodes directly interact with the code of other contracts. The implementation must decide how they will behave with externally loaded code.
    *   Will `EXTCODESIZE` return the size of the external bytecode?
    *   Will `EXTCODECOPY` copy the external bytecode?
    *   Will `EXTCODEHASH` return the hash of the external bytecode?
    The current implementations in `ethereum.prague.vm.instructions.environment` are based on `get_account(state, address).code`. The new logic will need to intercept these calls to provide information about external code if present.

3.  **Bytecode Verification**: The prompt correctly identifies the need for bytecode verification. The `get_valid_jump_destinations` function from `ethereum.prague.vm.runtime` is the exact logic required. This function iterates through the bytecode, skipping `PUSH` data, to identify all valid `JUMPDEST` locations. This should be a core part of the `BytecodeVerifier` implementation.

4.  **Contract Creation (`CREATE`/`CREATE2`)**: The `system.py` instruction implementations show that the output of the `init_code` execution becomes the contract's runtime bytecode, which is then stored using `set_code`. The external bytecode system needs to define its relationship with this process. Does it only apply to already-deployed contracts, or can it influence the deployment process itself? The prompt seems to focus on loading code for existing addresses, which is the simpler approach.

By referencing the provided Python specifications for these key areas, the engineer can ensure that the new external bytecode system integrates correctly with the core EVM execution flow while maintaining protocol-consistent behavior where necessary.



## GO-ETHEREUM Context

This prompt describes adding a non-standard feature to an EVM: loading contract bytecode from external sources like filesystems or IPFS, rather than exclusively from the world state. While go-ethereum only loads code from its state trie, its internal components for managing, analyzing, and executing that code are highly relevant.

The selected snippets focus on:
1.  **`Contract` Object**: How Geth represents an executing contract, including its code, address, and context. This is analogous to the prompt's `ExternalBytecode` struct.
2.  **Bytecode Analysis**: Geth's method for pre-analyzing bytecode to identify valid `JUMPDEST` locations using a bit vector, a key performance optimization mentioned in the prompt.
3.  **Code Storage & Caching**: How contract code is traditionally retrieved from the state and the simple caching mechanism Geth uses.
4.  **EVM Integration**: The high-level functions (`Call`, `Create`) that orchestrate the loading and execution of contract code.
5.  **Performance Metrics**: Geth's robust `metrics` package, which provides a solid reference for implementing the `BytecodePerformanceTracker`.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of CALLER opcode.
	// This is the address of the account that initiated the current execution.
	// N.B. This is not necessarily the same as the address of the transaction origin.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests bitvec // result of JUMPDEST analysis.
	code      []byte
	codeHash  common.Hash
	input     []byte

	value *big.Int
	gas   uint64
	// ...
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	contract := &Contract{CallerAddress: caller.Address(), caller: caller, self: object, value: value, gas: gas}

	// This is the part that would be replaced by the external loader system.
	// It shows that code can be loaded from a backing object (in Geth's case, the state DB).
	if object != nil {
		db, _ := evmStateDB.Get(object.Address()) // DB is a global for state test tracer builds
		if db != nil {
			contract.code = db.Code
			contract.codeHash = db.CodeHash
		}
	}
	return contract
}

// Code returns the contract's code.
func (c *Contract) Code() []byte {
	return c.code
}

// validJumpdest returns whether the given destination is a valid JUMPDEST.
func (c *Contract) validJumpdest(dest *uint256.Int) bool {
	udest, overflow := dest.Uint64()
	// The JUMPDEST location must be within the contract's code, and the location
	// must be an actual JUMPDEST opcode.
	if overflow || udest >= uint64(len(c.code)) {
		return false
	}
	// Note: we're using a cache here, which is not strictly necessary, but
	// is a good way to speed up the interpreter, by not re-running JUMPDEST
	// analysis on every single JUMP.
	if c.jumpdests == nil {
		c.jumpdests = codeBitmap(c.code)
	}
	return c.jumpdests.isset(udest)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_analysis.go">
```go
package vm

// bitvec is a bit vector which maps bytes in a program to booleans.
// This is used for jump destination analysis.
type bitvec []byte

// newBitvec returns a new bit vector of the given size.
func newBitvec(size int) bitvec {
	return make(bitvec, (size+7)/8)
}

// set sets the bit at the given index.
func (b bitvec) set(i uint64) {
	b[i/8] |= 1 << (i % 8)
}

// isset returns true if the bit at the given index is set.
func (b bitvec) isset(i uint64) bool {
	if i/8 >= uint64(len(b)) {
		return false
	}
	return b[i/8]&(1<<(i%8)) != 0
}

// codeBitmap creates a bitmap of valid jump destinations for a given code.
// The output is a bit-array where valid JUMPDESTs are marked with 1.
func codeBitmap(code []byte) bitvec {
	// The bitmap is enlarged with one extra byte, which is always zero.
	// This is so that the check `i < len(code)` does not need to be performed
	// in the main loop.
	b := newBitvec(len(code) + 1)
	for i := 0; i < len(code); {
		op := OpCode(code[i])
		if op == JUMPDEST {
			b.set(uint64(i))
		}
		if op.IsPush() {
			i += int(op) - int(PUSH1) + 2
		} else {
			i++
		}
	}
	return b
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an EVM database for full state transitions.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds 'live' objects, which are guaranteed to be specific types.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// ... other fields ...

	// The read-only state that this StateDB is based on. If this is nil,
	// it is a write-instance, and will writes to the database. If it is not
	// nil, it is a read-only instance, and will writes to the in-memory
	// overlay only.
	originalReadonlyState *StateDB

	// codeCache is used to cache the code of contracts.
	codeCache *lru.Cache[common.Hash, []byte]
	// ...
}

// GetCode retrieves a contract's code.
func (s *StateDB) GetCode(addr common.Address) []byte {
	// If the contract is alive, return the cached code
	if obj := s.getStateObject(addr); obj != nil {
		return obj.Code(s.db)
	}
	return nil
}

// GetCodeHash retrieves a contract's code hash.
func (s *StateDB) GetCodeHash(addr common.Address) common.Hash {
	// If the contract is alive, return the cached code hash
	if obj := s.getStateObject(addr); obj != nil {
		return obj.CodeHash()
	}
	return common.Hash{}
}

// SetCode sets the code of a contract.
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	stateObject := s.GetOrNewStateObject(addr)
	if stateObject != nil {
		stateObject.SetCode(crypto.Keccak256Hash(code), code)
	}
}

// Code reads the contract code from the database.
func (so *stateObject) Code(db Database) []byte {
	if so.code != nil {
		return so.code
	}
	if bytes.Equal(so.CodeHash(), types.EmptyCodeHash.Bytes()) {
		return nil
	}
	code, err := db.ContractCode(so.addrHash, so.CodeHash())
	if err != nil {
		so.db.setError(fmt.Errorf("can't load code %x for @%x: %w", so.CodeHash(), so.address, err))
	}
	so.code = code
	return code
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current chain and state.
	Context BlockContext
	// StateDB gives access to the underlying state.
	StateDB vm.StateDB
	// depth is the current call stack
	depth int
	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig
	// ... other fields
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb vm.StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// ...
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller vm.ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ...
	// Create a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, codeAndHash.Hash, codeAndHash.Code)

	ret, err = run(evm, contract, input, false)
	// ...
	return ret, contract.Gas, err
}

// Create creates a new contract using the EVM.
func (evm *EVM) Create(caller vm.ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ...
	// Create a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	contract := NewContract(caller, AccountRef(address), value, gas)
	contract.SetCodeOptionalHash(&address, &codeAndHash)

	if evm.vmConfig.NoCustomCreateCodeSize {
		// As per EIP-3541, contract creation initialization code cannot start with 0xef
		if len(code) > 0 && code[0] == 0xef {
			return nil, common.Address{}, gas, ErrInvalidCode
		}
	}
	// ...
	ret, err = run(evm, contract, nil, true)
	// ...
	return ret, address, contract.Gas, err
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

// MeterSnapshot is a read-only copy of the meter's internal values.
type MeterSnapshot struct {
	count                          int64
	rate1, rate5, rate15, rateMean float64
}

// Count returns the count of events at the time the snapshot was taken.
func (m *MeterSnapshot) Count() int64 { return m.count }

// RateMean returns the meter's mean rate of events per second at the time the
// snapshot was taken.
func (m *MeterSnapshot) RateMean() float64 { return m.rateMean }
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/timer.go">
```go
// Timer captures the duration and rate of events, using a Histogram and a Meter.
type Timer struct {
	histogram Histogram
	meter     *Meter
	mutex     sync.Mutex
}

// Time record the duration of the execution of the given function.
func (t *Timer) Time(f func()) {
	ts := time.Now()
	f()
	t.Update(time.Since(ts))
}

// Update the duration of an event, in nanoseconds.
func (t *Timer) Update(d time.Duration) {
	t.mutex.Lock()
	defer t.mutex.Unlock()
	t.histogram.Update(d.Nanoseconds())
	t.meter.Mark(1)
}

// TimerSnapshot is a read-only copy of another Timer.
type TimerSnapshot struct {
	histogram HistogramSnapshot
	meter     *MeterSnapshot
}

// Count returns the number of events recorded at the time the snapshot was
// taken.
func (t *TimerSnapshot) Count() int64 { return t.histogram.Count() }

// Mean returns the mean value at the time the snapshot was taken.
func (t *TimerSnapshot) Mean() float64 { return t.histogram.Mean() }

// Rate1 returns the one-minute moving average rate of events per second at the
// time the snapshot was taken.
func (t *TimerSnapshot) Rate1() float64 { return t.meter.Rate1() }
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt describes a feature for loading EVM bytecode from various "external" sources. This is not standard Ethereum behavior, where code is only loaded from the world state associated with a contract address.

Here are some suggested improvements based on go-ethereum's architecture:

1.  **Separate Code from Execution Context**: The `ExternalBytecode` struct in the prompt mixes immutable code properties (e.g., `code`, `metadata`) with mutable execution-time state (e.g., `access_count`, `last_access_time`). Geth separates these concepts:
    *   The raw `code` and its `codeHash` are stored in the state database.
    *   The `vm.Contract` object is an ephemeral, in-memory struct created for a single execution context. It holds the `code`, `input` data, `gas`, and references to the `caller` and `self`.

    Adopting this separation would lead to a cleaner design. The `ExternalBytecodeManager` would be responsible for loading the code and metadata, and the VM would then use that to construct an execution-specific `Contract` object.

2.  **Content-Addressable Caching**: The prompt's `BytecodeCache` is keyed by `Address`. Geth's `state.codeCache` is keyed by the code's hash (`common.Hash`). This is more efficient, as identical bytecode deployed at different addresses can share a single cache entry. This is a form of content-addressable storage.

3.  **JUMPDEST Analysis**: The prompt's `ExternalBytecode.is_valid_jump_dest` method implies real-time checking. Geth's approach of pre-analyzing the entire bytecode to create a `bitvec` of valid jump destinations is significantly more performant, as it turns runtime checks into a near-instant bitwise operation. The included `jump_analysis.go` snippet is an excellent reference for this.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the transaction and block
	Context BlockContext
	// StateDB provides access to the world state
	StateDB StateDB
	// Depth is the call depth, which is restricted to 1024
	depth int

	// chainConfig contains information about the current chain configuration.
	chainConfig *params.ChainConfig
	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules
	// virtual machine configuration options used to create the VM.
	Config Config
	// globalGasPool is used to track gas usage during processing.
	globalGasPool *core.GasPool
	// accessList is the EIP-2930 access list for the current transaction
	accessList *accesslist.AccessList
	// readOnly denotes whether the EVM is in read-only mode, in which case state changes are prohibited
	readOnly bool
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		Context:     blockCtx,
		StateDB:     statedb,
		Config:      vmConfig,
		chainConfig: chainConfig,
		chainRules:  chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time),
		accessList:  accesslist.New(),
	}
	evm.TxContext = txCtx
	return evm
}

// Call executes the contract associated with the destination address. It is a
// convenience wrapper around executing a message.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute above the legacy gas limit
	if gas > params.MaxGasLimit {
		panic("GAS LIMIT EXCEEDS
	}
	// Fail if we're trying to transfer more than the available balance
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}
	var (
		to       = AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	if !evm.StateDB.Exist(addr) {
		if !value.IsZero() {
			evm.StateDB.CreateAccount(addr, false)
		}
	}
	evm.Context.Transfer(evm.StateDB, caller.Address(), to.Address(), value)

	// Initialise a new contract and set the code that is to be used by the
	// EIP-7702 auth call rule.
	var (
		p    = ActivePrecompiles(evm.chainRules)
		code []byte
	)
	if p[addr] == nil {
		code = evm.StateDB.GetCode(addr)
	}

	// It's possible the code was set by the EIP-7702 authorization of the caller.
	// When that is the case, the address of the caller is used to resolve the
	// delegation.
	if delegatedTo, ok := types.ParseDelegation(code); ok {
		// Code is a delegation, resolve it.
		to = AccountRef(delegatedTo)
		code = evm.StateDB.GetCode(to.Address())
	}
	// If the contract has no code, abort returning only the gas.
	if len(code) == 0 {
		return nil, gas, nil
	}

	// Create a new contract from the destination address, and instantiate the VM
	// with the new contract. Then execute the code.
	contract := NewContract(caller, to, value, gas)
	contract.SetCallCode(&addr, crypto.Keccak256Hash(code), code)

	ret, err = evm.interpreter.Run(contract, input, evm.readOnly)
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
	}
	return ret, contract.Gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Ensure there's no address collision when creating a new contract
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	contractHash := evm.StateDB.GetCodeHash(contractAddr)
	if evm.StateDB.GetNonce(contractAddr) != 0 || (contractHash != types.EmptyCodeHash && contractHash != (common.Hash{})) {
		return nil, common.Address{}, 0, ErrContractAddressCollision
	}
	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr, false)

	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1)
	}
	evm.Context.Transfer(evm.StateDB, caller.Address(), contractAddr, value)

	// Create a new contract and execute the code.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCodeOptionalHash(&contractAddr, crypto.Keccak256Hash(code), code)

	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(FrameTypeCreate, caller.Address(), contractAddr, code, gas, value)
	}
	start := time.Now()

	ret, err = evm.interpreter.Run(contract, nil, evm.readOnly)

	// Check whether the max code size exceeds the limit
	if err == nil && evm.chainRules.IsEIP170 && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}
	// If the code failed, but not because of a revert, consume all gas
	if err != nil && err != ErrExecutionReverted {
		contract.UseGas(contract.Gas)
	}
	// Otherwise, store the resulting code in the state database
	if err == nil {
		createDataGas := uint64(len(ret)) * params.CreateDataGas
		if contract.UseGas(createDataGas) {
			evm.StateDB.SetCode(contractAddr, ret)
		} else {
			err = ErrCodeStoreOutOfGas
		}
	}
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
	}
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureExit(ret, time.Since(start), err)
	}
	return ret, contractAddr, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// AccountRef implements ContractRef.
//
// AccountRef is used to refer to contract objects that are backed by a state object.
type AccountRef common.Address

// Address returns the address of the contract.
func (ar AccountRef) Address() common.Address {
	return common.Address(ar)
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the caller stack.
	//
	// Note this is not the actual caller of the call. It is the result of the
	// caller stack which is actually the address of the call originator.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	code        []byte
	codeHash    common.Hash
	input       []byte

	value *uint256.Int
	Gas   uint64

	Args []byte
}

// NewContract returns a new contract environment for the execution of EVM bytecode.
func NewContract(caller ContractRef, object ContractRef, value *uint256.Int, gas uint64) *Contract {
	c := &Contract{
		caller: caller,
		self:   object,
		Gas:    gas,
	}
	if value == nil {
		c.value = new(uint256.Int)
	} else {
		c.value = value
	}
	return c
}

// SetCallCode sets the code of the contract and address of the backing data
// object.
func (c *Contract) SetCallCode(addr *common.Address, hash common.Hash, code []byte) {
	c.self = AccountRef(*addr)
	c.code = code
	c.codeHash = hash
}

// SetCodeOptionalHash can be used to provide code, but it's also possible that
// the hash is not known, in which case the hash is calculated.
func (c *Contract) SetCodeOptionalHash(addr *common.Address, codeAndHash *codeAndHash) {
	c.self = AccountRef(*addr)
	c.code = codeAndHash.code
	c.codeHash = codeAndHash.hash
}

// Address returns the contracts address
func (c *Contract) Address() common.Address {
	return c.self.Address()
}

// validJumpdest checks whether the given PC is a valid jump destination.
// The Function also uses the bit map to check for a valid JUMPDEST.
func (c *Contract) validJumpdest(dest *uint256.Int) bool {
	udest, overflow := dest.Uint64()
	if overflow || udest >= uint64(len(c.code)) {
		return false
	}
	// Don't have to verify this is a valid JUMPDEST because this has been
	// done already in `Analyse`.
	return c.isCode(udest)
}

// isCode returns true if the provided PC location is an actual opcode, and not
// the argument of a PUSH-opcode.
func (c *Contract) isCode(udest uint64) bool {
	// The call is safe because we've checked for overflow above
	return c.jumpdests.has(c.codeHash, c.code, udest)
}

// GetOp returns the n'th element in the contract's byte code
func (c *Contract) GetOp(n uint64) OpCode {
	return OpCode(c.GetByte(n))
}

// GetByte returns the n'th byte in the contract's byte code
func (c *Contract) GetByte(n uint64) byte {
	if n < uint64(len(c.code)) {
		return c.code[n]
	}
	return byte(STOP)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// destinations contains the results of jumpdest analysis.
// This is a map from code hash to a bitmap of valid jump destinations.
type destinations map[common.Hash]*bitvec

// has checks whether the given destination is present in the bitmap.
func (d destinations) has(codehash common.Hash, code []byte, dest uint64) bool {
	// If the destinations map is not yet initialized, do it.
	// This is not racy because all writes are protected by a mutex.
	if d[codehash] == nil {
		d[codehash] = analyse(code)
	}
	return d[codehash].has(dest)
}

// bitvec is a bit vector which can be used to mark locations in the code.
type bitvec []byte

// has checks whether the bit at the given index is set.
func (b bitvec) has(i uint64) bool {
	if i >= uint64(len(b))*8 {
		return false
	}
	return b[i/8]&(1<<(i%8)) != 0
}

// set sets the bit at the given index.
func (b bitvec) set(i uint64) {
	b[i/8] |= 1 << (i % 8)
}

var (
	analysedCode   = make(destinations)
	analysedMutex  = new(sync.RWMutex)
	errCodeTooLarge = errors.New("code size exceeds 24576 bytes (EIP-170)")
)

// Analyse analyses the given code and returns a bit vector of valid jump
// destinations.
func Analyse(code []byte) (bitvec, error) {
	// We need to lock since we're using a shared cache. This is fine because
	// we're only reading from the cache.
	analysedMutex.RLock()
	// After grabbing the lock, check if the code has been analysed already.
	bv := analysedCode[crypto.Keccak256Hash(code)]
	analysedMutex.RUnlock()
	if bv != nil {
		return bv, nil
	}

	// The code is not yet analysed.
	bv, err := doAnalyse(code)
	if err != nil {
		return nil, err
	}
	// Could be that it was analysed and inserted while we were working.
	// In that case, we'll just use the one that's already in the map
	analysedMutex.Lock()
	hash := crypto.Keccak256Hash(code)
	if analysedCode[hash] == nil {
		analysedCode[hash] = bv
	} else {
		bv = analysedCode[hash]
	}
	analysedMutex.Unlock()
	return bv, nil
}

// analyse is the private version of Analyse, which does the actual work.
func doAnalyse(code []byte) (bitvec, error) {
	// EIP-170: do not analyse code if it's too large
	if len(code) > params.MaxCodeSize {
		return nil, errCodeTooLarge
	}
	// Don't allocate the bitvector on the stack. A bit vector for a 24KB
	// code will be 3KB in size. We can do better than that, but for now,
	// let's not have it on the stack.
	destinations := make(bitvec, len(code)/8+1)

	// Iterate over the code and when a JUMPDEST is found, mark it as valid.
	for i := 0; i < len(code); i++ {
		// Found a JUMPDEST, mark it as valid
		if OpCode(code[i]) == JUMPDEST {
			destinations.set(uint64(i))
		}
		// Skip PUSH data.
		if OpCode(code[i]).IsPush() {
			i += int(code[i] - PUSH1 + 1)
		}
	}
	return destinations, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an EVM database for full state processing.
type StateDB struct {
	db                Database
	journal           *journal
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}
	// ... other fields
}

// GetCode retrieves a particular contract's code.
func (s *StateDB) GetCode(addr common.Address) []byte {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Code(s.db)
	}
	return nil
}

// GetCodeSize gets the size of the code stored at the given address.
func (s *StateDB) GetCodeSize(addr common.Address) int {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return 0
	}
	if stateObject.code != nil {
		return len(stateObject.code)
	}
	size, err := s.db.ContractCodeSize(stateObject.addrHash, stateObject.CodeHash())
	if err != nil {
		s.setError(err)
		return 0
	}
	return size
}

// GetCodeHash returns the code hash for a certain account.
func (s *StateDB) GetCodeHash(addr common.Address) common.Hash {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return types.EmptyCodeHash
	}
	return stateObject.CodeHash()
}

// SetCode sets the code of a certain account.
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	stateObject := s.getOrNewStateObject(addr)
	if stateObject != nil {
		s.journal.append(codeChange{
			account:  &addr,
			prevcode: stateObject.Code(s.db),
			prevhash: stateObject.CodeHash(),
		})
		stateObject.SetCode(crypto.Keccak256Hash(code), code)
	}
}

// getStateObject retrieves a state object or create a new state object if nil.
func (s *StateDB) getStateObject(addr common.Address) *stateObject {
	// Prefer live objects if any
	if obj := s.stateObjects[addr]; obj != nil {
		return obj
	}
	// If no live object is available, load from the database
	data, err := s.db.ContractCode(common.Hash{}, crypto.Keccak256Hash(addr.Bytes()))
	if err != nil {
		s.setError(fmt.Errorf("can't create trie for address %x: %w", addr, err))
		return nil
	}
	if len(data) == 0 {
		return nil
	}
	// Insert into the live set
	obj := newObject(s, addr, data)
	s.setStateObject(obj)
	return obj
}

// getOrNewStateObject retrieves a state object or create a new state object if nil.
func (s *StateDB) getOrNewStateObject(addr common.Address) *stateObject {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		stateObject = s.createObject(addr)
	}
	return stateObject
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
//
//  1. You can retrieve a state object from the trie or create a new one.
//  2. You can then modify the state object.
//  3. Finally, call CommitTrie to write the modified state object back to the trie.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.StateAccount
	db       *StateDB

	// Write caches.
	code code // contract bytecode, which gets stored as which gets stored in the database

	// ... other fields
}


// Code returns the contract code associated with this object, if any.
func (s *stateObject) Code(db Database) []byte {
	if s.code != nil {
		return s.code
	}
	if s.CodeHash() == types.EmptyCodeHash {
		return nil
	}
	code, err := db.ContractCode(s.addrHash, s.CodeHash())
	if err != nil {
		s.db.setError(err)
		return nil
	}
	s.code = code
	return code
}

// SetCode sets the contract code associated with this object.
func (s *stateObject) SetCode(codeHash common.Hash, code []byte) {
	s.setCode(codeHash, code)
}

func (s *stateObject) setCode(codeHash common.Hash, code []byte) {
	s.db.journal.append(codeChange{
		account:  &s.address,
		prevhash: s.CodeHash(),
		prevcode: s.Code(s.db.db),
	})
	s.data.CodeHash = codeHash[:]
	s.code = code
}

// CodeHash returns the code hash of the object.
func (s *stateObject) CodeHash() common.Hash {
	return common.BytesToHash(s.data.CodeHash)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// applyAuthorization applies an EIP-7702 code delegation to the state.
func (st *stateTransition) applyAuthorization(auth *types.SetCodeAuthorization) error {
	authority, err := st.validateAuthorization(auth)
	if err != nil {
		return err
	}

	// If the account already exists in state, refund the new account cost
	// charged in the intrinsic calculation.
	if st.state.Exist(authority) {
		st.state.AddRefund(params.CallNewAccountGas - params.TxAuthTupleGas)
	}

	// Update nonce and account code.
	st.state.SetNonce(authority, auth.Nonce+1, tracing.NonceChangeAuthorization)
	if auth.Address == (common.Address{}) {
		// Delegation to zero address means clear.
		st.state.SetCode(authority, nil)
		return nil
	}

	// Otherwise install delegation to auth.Address.
	st.state.SetCode(authority, types.AddressToDelegation(auth.Address))

	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go">
```go
const (
	// DelegationVersion is the current version of the EIP-7702 delegation format.
	DelegationVersion = 0xE7

	// DelegationCodeType is the type identifier for delegated code.
	DelegationCodeType = 0x02
)

// ParseDelegation validates the given bytecode as an EIP-7702 delegation and
// returns the delegated-to address and a boolean indicating whether it is
// indeed a delegation.
func ParseDelegation(code []byte) (common.Address, bool) {
	if len(code) == 22 && code[0] == DelegationVersion && code[1] == DelegationCodeType {
		var addr common.Address
		copy(addr[:], code[2:])
		return addr, true
	}
	return common.Address{}, false
}

// AddressToDelegation converts an address into an EIP-7702 delegation bytecode.
func AddressToDelegation(addr common.Address) []byte {
	return append([]byte{DelegationVersion, DelegationCodeType}, addr[:]...)
}
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt describes a feature-rich "External Bytecode" system that goes far beyond the standard EVM's capabilities. While Geth's implementation provides a solid foundation for core EVM execution, several parts of the prompt are novel and have no direct equivalent in `go-ethereum`.

1.  **No URI-based Bytecode Loaders**: The core EVM in `go-ethereum` is designed to be deterministic and self-contained. It exclusively loads bytecode from its internal state database (`StateDB`), identified by a contract's address. The concept of loading bytecode from external URIs (like FileSystem, HTTP, or IPFS) is not part of the standard EVM model. The implementation will need to build this loading and resolution logic from scratch and integrate it into the `StateDB` or a similar mechanism. The provided snippets show how the EVM *requests* code from the `StateDB`, which is the interface the new loaders would need to satisfy.

2.  **No Code Signing or External Security Context**: In Ethereum, the integrity and authenticity of bytecode are guaranteed by the blockchain's state root (a cryptographic hash of the entire state trie), not by code signatures. The prompt's concepts of `code_signing`, `SecurityManager`, and `SecurityContext` are not present in Geth's EVM. The security model is based on the immutability of the blockchain and the deterministic nature of contract creation.

3.  **Bytecode Caching is Implicit**: Geth doesn't have an explicit, configurable bytecode cache (LRU, LFU, etc.) as described in the prompt. Caching is handled at multiple lower levels:
    *   `state.StateDB` caches `stateObject` instances in memory for the duration of a block's processing.
    *   The underlying database (e.g., LevelDB/Pebble) has its own block and memory caches.
    *   The `stateObject` itself caches the contract `code` in-memory after the first time it's read from the database.
    The provided snippets from `state_object.go` and `statedb.go` illustrate this on-demand loading and in-memory caching pattern.

4.  **EIP-7702 is a Specific Form of Delegation**: The prompt includes `EIP7702_BYTECODE` in the Zig implementation. This is a specific EIP for EOA delegation and is the closest thing in Ethereum to a standardized "external bytecode" reference. The Geth snippets from `state_transition.go` and `transaction.go` show how this specific delegation format is parsed and applied, which can serve as a model for handling special bytecode formats.

---

An analysis of the `go-ethereum` codebase reveals several key architectural patterns and implementations that are highly relevant to building an external bytecode system. The following snippets provide direct context and parallels for the requested features.

### Key Parallels
*   **`vm.Contract`**: This is the `go-ethereum` equivalent of the proposed `ExternalBytecode` struct. It's an ephemeral object created for each call frame, holding the code, input, and gas for that specific execution context.
*   **`vm.analysis`**: This package directly corresponds to the requested `BytecodeVerifier`. It performs a one-time analysis of bytecode to identify valid `JUMPDEST` locations, creating a bit-vector for efficient validation during execution.
*   **`state.StateDB`**: This acts as the primary data and caching layer, analogous to the proposed `ExternalBytecodeManager` and `BytecodeCache`. It retrieves contract code from the underlying database and caches it in memory.
*   **`vm.Interpreter`**: The `Run` loop within this component is the heart of the EVM, showing how bytecode is fetched and executed instruction by instruction. This provides a clear model for integrating the external bytecode system.
*   **Precompiled Contracts**: The handling of precompiles in `go-ethereum` serves as a good model for the proposed `LoaderRegistry`, where specific addresses (or in the prompt's case, URI schemes) are mapped to special execution handlers instead of standard EVM bytecode.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the caller stack frame and in case of a
	// create, it is the creator. The Contract implementation uses this in
	// the CALLER opcode.
	CallerAddress common.Address
	// caller is a reference to the contract's caller, to be used in DELEGATECALL.
	caller ContractRef
	// self is a reference to the contract's backing object
	self ContractRef

	jumpdests      destinations // Aggregated analysis of all jump destinations in the code
	analysis       codeAnalysis // Code analysis of the contract, shared across all invocations
	Code           []byte       // Actual code of the contract
	CodeHash       common.Hash  // Hash of the code
	CodeAddr       *common.Address
	Input          []byte
	Gas            uint64
	value          *big.Int
	Args           []byte
	DelegateCall   bool
	Static         bool
	EVM            *EVM
	isEIP7702      bool // set when code comes from EIP-7702 transaction's authorization list
	codeUpgradedV4 bool // set when an EOF contract has upgraded from legacy to v1

	//Bitmap for valid jump destinations.
	bitmap         *bitvec.BitVec
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64, isEIP7702 bool) *Contract {
	contract := &Contract{
		caller:    caller,
		self:      object,
		Gas:       gas,
		value:     value,
		isEIP7702: isEIP7702,
	}
	if caller != nil {
		contract.CallerAddress = caller.Address()
	}
	return contract
}

// GetOp returns the n'th element in the contract's byte code
func (c *Contract) GetOp(n uint64) OpCode {
	if n < uint64(len(c.Code)) {
		return OpCode(c.Code[n])
	}
	return STOP
}

// ValidJumpdest returns whether the given destination is a valid jump destination.
// The bitmap is used to speed up the validation process.
func (c *Contract) ValidJumpdest(dest *uint256.Int) bool {
	udest, overflow := dest.Uint64WithOverflow()
	// The max code size is 24576 bytes, well within uint64.
	if overflow || udest >= uint64(len(c.Code)) {
		return false
	}
	// PC cannot go into PUSH-data, so we have to check for that.
	// We do it by checking a bit-vector of valid jump destinations.
	return c.jumpdests.has(udest)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// codeAnalysis contains the results of analyzing a contracts code.
type codeAnalysis struct {
	jumpdests destinations
}

// destinations is a bit-vector of valid jump destinations in a contract.
type destinations bitvec.BitVec

// has returns true if the given destination is a valid jump destination.
func (d destinations) has(dest uint64) bool {
	return bitvec.BitVec(d).Get(int(dest))
}

// codeCache is a cache of analyzed contract code.
var codeCache = cache.New(1024)

// Analyse analyses the given code and returns the destinations.
func Analyse(code []byte) destinations {
	// Check if we have a cached copy
	hash := crypto.Keccak25 consejoHash(code)
	if cached, ok := codeCache.Get(hash); ok {
		return cached.(destinations)
	}
	// No cached copy, analyze and cache
	dests := make(destinations, len(code)/32+1)
	for i, c := range code {
		if OpCode(c) == JUMPDEST {
			dests.set(uint64(i))
		}
	}
	rems := code
	for len(rems) > 0 {
		op := OpCode(rems[0])
		size := op.pushDataSize()
		if size > 0 {
			// Skip over pushdata, including the opcode itself
			rems = rems[size+1:]
			continue
		}
		if op >= DUP1 && op <= DUP16 {
			// Uninteresting, skip
			rems = rems[1:]
			continue
		}
		if op >= SWAP1 && op <= SWAP16 {
			// Uninteresting, skip
			rems = rems[1:]
			continue
		}
		if op >= LOG0 && op <= LOG4 {
			// Uninteresting, skip
			rems = rems[1:]
			continue
		}
		// All other opcodes are one byte
		rems = rems[1:]
	}
	codeCache.Add(hash, dests)
	return dests
}

// set sets the given bit in the bitmap
func (d destinations) set(dest uint64) {
	bitvec.BitVec(d).Set(int(dest))
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds 'live' objects, which are guaranteed to be dirty.
	// So upon commit, instead of iterating over all accounts, only these
	// objects need to be gathered and committed to the trie.
	stateObjects        map[common.Address]*stateObject
	stateObjectsPending map[common.Address]struct{} // Scheduled for deletion
	stateObjectsDirty   map[common.Address]struct{} // For logging, received a dirty-making event

	// DB error.
	// State objects are lazy-loaded and stored in the stateObjects map.
	// When the social contract scheme is used, state objects are stored flattened.
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

	// Measurements gathered during execution for debugging purposes
	AccountReads         time.Duration
	AccountUpdates       time.Duration
	AccountHashes        time.Duration
	StorageReads         time.Duration
	StorageUpdates       time.Duration
	StorageHashes        time.Duration
	TrieCommit           time.Duration
	TrieDBCommits        time.Duration
	SnapshotAccountReads time.Duration
	SnapshotStorageReads time.Duration
	SnapshotCommits      time.Duration

	// Per-transaction access list
	accessList *accesslist

	// The stashed transition states, used for skipping state-reverting in case
	// of execution timeout.
	transitions stashedStateDB

	// Per-transaction code cache.
	code cachegen.Cache[common.Hash, []byte]
}

// GetCode returns the code for a given account.
func (s *StateDB) GetCode(addr common.Address) []byte {
	so := s.getStateObject(addr)
	if so != nil {
		return so.Code(s.db)
	}
	return nil
}

// GetCodeSize returns the code size for a given account.
func (s *StateDB) GetCodeSize(addr common.Address) int {
	so := s.getStateObject(addr)
	if so == nil {
		return 0
	}
	if so.code != nil {
		return len(so.code)
	}
	size, err := s.db.ContractCodeSize(so.CodeHash())
	if err != nil {
		s.setError(fmt.Errorf("can't get code size of %x: %w", so.addr, err))
	}
	return size
}

// GetCodeHash returns the code hash for a given account.
func (s *StateDB) GetCodeHash(addr common.Address) common.Hash {
	so := s.getStateObject(addr)
	if so == nil {
		return common.Hash{}
	}
	return so.CodeHash()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Interpreter is a go-ethereum internal EVM interpreter.
//
// The Interpreter will execute bytecode and has ability to operate on the run-time
// state of the machine. The Interpreter will not make any changes to the touch-
// state of the virtual machine. In other words, the interpreter is a pure state-
// less component.
type Interpreter struct {
	evm *EVM
	cfg Config

	hasher    crypto.KeccakState // Keccak256 hasher instance for the SHA3 opcode
	hasherBuf bytes.Buffer       // Keccak256 hasher buffer to write to

	readOnly   bool   // Whether to throw on state modifying opcodes
	returnData []byte // Last CALL's return data for subsequent reuse
}

// NewInterpreter returns a new instance of the Interpreter.
func NewInterpreter(evm *EVM, cfg Config) *Interpreter {
	return &Interpreter{
		evm: evm,
		cfg: cfg,
	}
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, no matter the error code
// or message.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() {
		in.evm.depth--
	}()

	// Make sure the readOnly is only set if we aren't in readOnly yet.
	// This also makes sure that the readOnly flag is accumulated, the literal
	// stack of readOnly-ness gets deeper just like the call stack.
	if readOnly && !in.readOnly {
		in.readOnly = true
		defer func() { in.readOnly = false }()
	}

	// Reset the previous return value. It's temporary and should not be persisted.
	in.returnData = nil

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallCtx()
		// For optimisation reason we're using uint64 as the program counter.
		// It's safe to expect the code to be maximum 2^64 bytes long.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the defer
		gasCopy uint64 // for tracer
		logged  bool   // deferred tracer should ignore already logged steps
		res     []byte // result of the opcode execution function
	)
	// Don't move this defer any other place. It might cause panic with logging enabled.
	defer func() {
		if err != nil {
			if !logged {
				if in.cfg.Debug {
					in.cfg.Tracer.CaptureState(in.evm, pcCopy, op, gasCopy, cost, mem, stack, callContext, in.returnData, in.evm.depth, err)
				}
			}
		}
	}()

	contract.Input = input
	// We have to make a copy of the code here, since it can be modified via
	// future EIPs.
	contract.Code = common.CopyBytes(contract.Code)

	// The Interpreter main run loop. It will execute operations as long as the
	// Unhalt is true and it has enough gas.
	for {
		if in.cfg.Debug {
			logged, gasCopy, pcCopy = false, contract.Gas, pc
		}
		// Get the operation from the jump table and validate the stack to ensure there are
		// enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		if !operation.valid {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		//
		// If the operation is valid, deduct the execution cost from the total gas available.
		// If the gas is not enough and the interpreter is not running in static mode, then
		// 'ErrOutOfGas' is returned.
		cost, err = operation.gasCost(in.evm, contract, stack, mem)
		if err != nil || !contract.UseGas(cost) {
			return nil, ErrOutOfGas
		}

		// Execute the operation
		if in.cfg.Debug {
			in.cfg.Tracer.CaptureState(in.evm, pc, op, gasCopy, cost, mem, stack, callContext, in.returnData, in.evm.depth, err)
			logged = true
		}

		res, err = operation.execute(pc, in, contract, mem, stack)
		if err != nil {
			return nil, err
		}

		pc++
		// If the sightseeing switch is enabled, we need to clear all queued up
		// state objects and revert them to the last copy of the database.
		if in.cfg.Sightseeing.Enabled(pc) {
			in.evm.StateDB.RevertToSnapshot(in.cfg.Sightseeing.Snapshot)
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the consensus engine.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	// StateDB provides access to the world state
	StateDB StateDB
	// Depth is the call depth, which is restricted to 1024
	depth int
	// chain backend
	chain Chain
	// chain rules
	chainRules params.Rules
	// virtual machine configuration
	vmConfig Config
	// global (to this context) ethereum virtual machine
	// used by the interpreter to run contracts
	interpreter *Interpreter
	// searcher is used to inspect the EVM during execution
	searcher *runtime.Searcher
	// readOnly denotes whether the EVM is in read only mode
	readOnly bool
	// returnData is the return data of the last call.
	returnData []byte
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(ctx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		Context:     ctx,
		StateDB:     statedb,
		chain:       &dummyChain{},
		chainRules:  chainConfig.Rules(ctx.BlockNumber, ctx.Random != nil, ctx.Time),
		vmConfig:    vmConfig,
		interpreter: NewInterpreter(nil, vmConfig), // Initialised with nil evm, to be set later.
	}
	evm.interpreter.evm = evm // set evm for interpreter
	// We need to do this because the interpreter is not passed by pointer,
	// so a new instance is created.
	evm.interpreter.hasher = crypto.NewKeccakState()

	// The EVM should not be used for executing old blocks
	// so the following is not strictly necessary, but it's good
	// to have it here.
	if vmConfig.Tracer != nil && txCtx.TxHash != (common.Hash{}) {
		evm.vmConfig.Tracer = NewEVMLoggerWithTxContext(vmConfig.Tracer, txCtx)
	}
	return evm
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer and enforces the
// rule of only executing if the transfer can be successfully performed.
//
// The returned values are the return value of the executed contract, the
// left over gas and an error if it failed.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (gas calculation and transfer logic)

	// Create a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	contract := NewContract(caller, AccountRef(addr), value, gas, evm.isEIP7702)
	contract.SetCodeOptional(addr, codeAndHash) // codeAndHash is loaded from StateDB

	// ... (precompile handling logic)

	// If the contract is not a precompile, proceed with EVM execution.
	ret, err = evm.interpreter.Run(contract, input, evm.readOnly)

	// When the interpreter returns, we're done with the actual run of the
	// contract. The return data is grabbed and the gas is returned to the
	// caller.
	return ret, contract.Gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check means that contract creation cannot be deferred. It must be
	// performed here and now.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Ensure there's no existing contract at the designated address
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	if evm.StateDB.GetCodeSize(contractAddr) > 0 {
		return nil, common.Address{}, gas, ErrContractAddressCollision
	}
	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr)
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1)
	}
	evm.Transfer(evm.StateDB, caller.Address(), contractAddr, value)

	// Create a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution context
	// only.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas, evm.isEIP7702)
	contract.SetCallCode(&contractAddr, crypto.Keccak256Hash(code), code)

	// ... (tracer and debug logic) ...

	// In the case of a create, the contract's code is the input instead of
	// the code of the destination address.
	ret, err = evm.interpreter.Run(contract, nil, evm.readOnly)

	// ... (gas cost and refund logic for deployment) ...

	return ret, contractAddr, contract.Gas, err
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt outlines a sophisticated external bytecode system that goes beyond the standard EVM's capabilities. While this is a valid goal for a custom EVM, it's important to note the following distinctions from production implementations like `go-ethereum`:

1.  **Code Source**: In `go-ethereum`, all contract code is fetched from the state trie via the `StateDB`. The concept of loading from arbitrary sources like filesystems, HTTP, or IPFS is a significant extension and has major security implications (e.g., code immutability, consensus) that are not addressed by standard EVM security models. The provided `go-ethereum` snippets show how code is fetched from the `StateDB`, which is the canonical "external source" in a standard EVM.
2.  **`ExternalBytecode` vs. `vm.Contract`**: The prompt's `ExternalBytecode` struct mixes concerns of a cached object (with `access_count`, `last_access_time`) and a runtime execution object. In `go-ethereum`, the `vm.Contract` is an ephemeral object created for a single call frame. Caching of the raw bytecode and its analysis (`vm.analysis`) is handled at lower levels (`state.StateDB`, `vm.codeCache`), which is a cleaner separation of concerns.
3.  **Security Model**: The prompt's inclusion of `enable_code_signing` suggests a security model different from Ethereum's. In Ethereum, the "trust" in bytecode comes from the immutability of the blockchain and the transaction that deployed it, not from digital signatures on the code itself.

These points are not errors but rather design choices that distinguish the proposed system from a standard EVM. The provided `go-ethereum` snippets offer a robust, battle-tested foundation for implementing the core EVM logic (code analysis, execution frames, caching), which can then be extended to support the more advanced features described in the prompt.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// Copyright 2015 The go-ethereum Authors
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

package vm

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/holiman/uint256"
)

// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef
type Contract struct {
	// caller is the result of the caller which initialised this
	// contract. However, when the "call method" is delegated this
	// value needs to be initialised to that of the caller's caller.
	caller  common.Address
	address common.Address

	jumpdests map[common.Hash]bitvec // Aggregated result of JUMPDEST analysis.
	analysis  bitvec                 // Locally cached result of JUMPDEST analysis

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	// is the execution frame represented by this object a contract deployment
	IsDeployment bool
	IsSystemCall bool

	Gas   uint64
	value *uint256.Int
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller common.Address, address common.Address, value *uint256.Int, gas uint64, jumpDests map[common.Hash]bitvec) *Contract {
	// Initialize the jump analysis map if it's nil, mostly for tests
	if jumpDests == nil {
		jumpDests = make(map[common.Hash]bitvec)
	}
	return &Contract{
		caller:    caller,
		address:   address,
		jumpdests: jumpDests,
		Gas:       gas,
		value:     value,
	}
}

func (c *Contract) validJumpdest(dest *uint256.Int) bool {
	udest, overflow := dest.Uint64WithOverflow()
	// PC cannot go beyond len(code) and certainly can't be bigger than 63bits.
	// Don't bother checking for JUMPDEST in that case.
	if overflow || udest >= uint64(len(c.Code)) {
		return false
	}
	// Only JUMPDESTs allowed for destinations
	if OpCode(c.Code[udest]) != JUMPDEST {
		return false
	}
	return c.isCode(udest)
}

// isCode returns true if the provided PC location is an actual opcode, as
// opposed to a data-segment following a PUSHN operation.
func (c *Contract) isCode(udest uint64) bool {
	// Do we already have an analysis laying around?
	if c.analysis != nil {
		return c.analysis.codeSegment(udest)
	}
	// Do we have a contract hash already?
	// If we do have a hash, that means it's a 'regular' contract. For regular
	// contracts ( not temporary initcode), we store the analysis in a map
	if c.CodeHash != (common.Hash{}) {
		// Does parent context have the analysis?
		analysis, exist := c.jumpdests[c.CodeHash]
		if !exist {
			// Do the analysis and save in parent context
			// We do not need to store it in c.analysis
			analysis = codeBitmap(c.Code)
			c.jumpdests[c.CodeHash] = analysis
		}
		// Also stash it in current contract for faster access
		c.analysis = analysis
		return analysis.codeSegment(udest)
	}
	// We don't have the code hash, most likely a piece of initcode not already
	// in state trie. In that case, we do an analysis, and save it locally, so
	// we don't have to recalculate it for every JUMP instruction in the execution
	// However, we don't save it within the parent context
	if c.analysis == nil {
		c.analysis = codeBitmap(c.Code)
	}
	return c.analysis.codeSegment(udest)
}

// GetOp returns the n'th element in the contract's byte array
func (c *Contract) GetOp(n uint64) OpCode {
	if n < uint64(len(c.Code)) {
		return OpCode(c.Code[n])
	}

	return STOP
}

// Caller returns the caller of the contract.
//
// Caller will recursively call caller when the contract is a delegate
// call, including that of caller's caller.
func (c *Contract) Caller() common.Address {
	return c.caller
}

// UseGas attempts the use gas and subtracts it and returns true on success
func (c *Contract) UseGas(gas uint64, logger *tracing.Hooks, reason tracing.GasChangeReason) (ok bool) {
	if c.Gas < gas {
		return false
	}
	if logger != nil && logger.OnGasChange != nil && reason != tracing.GasChangeIgnored {
		logger.OnGasChange(c.Gas, c.Gas-gas, reason)
	}
	c.Gas -= gas
	return true
}

// Address returns the contracts address
func (c *Contract) Address() common.Address {
	return c.address
}

// Value returns the contract's value (sent to it from it's caller)
func (c *Contract) Value() *uint256.Int {
	return c.value
}

// SetCallCode sets the code of the contract,
func (c *Contract) SetCallCode(hash common.Hash, code []byte) {
	c.Code = code
	c.CodeHash = hash
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis_legacy.go">
```go
// bitvec is a bit vector which maps bytes in a program.
// An unset bit means the byte is an opcode, a set bit means
// it's data (i.e. argument of PUSHxx).
type bitvec []byte

// codeSegment checks if the position is in a code segment.
func (bits *bitvec) codeSegment(pos uint64) bool {
	return (((*bits)[pos/8] >> (pos % 8)) & 1) == 0
}

// codeBitmap collects data locations in code.
func codeBitmap(code []byte) bitvec {
	// The bitmap is 4 bytes longer than necessary, in case the code
	// ends with a PUSH32, the algorithm will set bits on the
	// bitvector outside the bounds of the actual code.
	bits := make(bitvec, len(code)/8+1+4)
	return codeBitmapInternal(code, bits)
}

// codeBitmapInternal is the internal implementation of codeBitmap.
// It exists for the purpose of being able to run benchmark tests
// without dynamic allocations affecting the results.
func codeBitmapInternal(code, bits bitvec) bitvec {
	for pc := uint64(0); pc < uint64(len(code)); {
		op := OpCode(code[pc])
		pc++
		if int8(op) < int8(PUSH1) { // If not PUSH (the int8(op) > int(PUSH32) is always false).
			continue
		}
		numbits := op - PUSH1 + 1
		if numbits >= 8 {
			for ; numbits >= 16; numbits -= 16 {
				bits.set16(pc)
				pc += 16
			}
			for ; numbits >= 8; numbits -= 8 {
				bits.set8(pc)
				pc += 8
			}
		}
		switch numbits {
		case 1:
			bits.set1(pc)
			pc += 1
		case 2:
			bits.setN(set2BitsMask, pc)
			pc += 2
		case 3:
			bits.setN(set3BitsMask, pc)
			pc += 3
		case 4:
			bits.setN(set4BitsMask, pc)
			pc += 4
		case 5:
			bits.setN(set5BitsMask, pc)
			pc += 5
		case 6:
			bits.setN(set6BitsMask, pc)
			pc += 6
		case 7:
			bits.setN(set7BitsMask, pc)
			pc += 7
		}
	}
	return bits
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
	...
}

// getStateObject retrieves a state object given by the address, returning nil if
// the object is not found or was deleted in this execution context.
func (s *StateDB) getStateObject(addr common.Address) *stateObject {
	// Prefer live objects if any is available
	if obj := s.stateObjects[addr]; obj != nil {
		return obj
	}
	// Short circuit if the account is already destructed in this block.
	if _, ok := s.stateObjectsDestruct[addr]; ok {
		return nil
	}
	s.AccountLoaded++

	start := time.Now()
	acct, err := s.reader.Account(addr)
	if err != nil {
		s.setError(fmt.Errorf("getStateObject (%x) error: %w", addr.Bytes(), err))
		return nil
	}
	s.AccountReads += time.Since(start)

	// Short circuit if the account is not found
	if acct == nil {
		return nil
	}
	// Schedule the resolved account for prefetching if it's enabled.
	if s.prefetcher != nil {
		if err = s.prefetcher.prefetch(common.Hash{}, s.originalRoot, common.Address{}, []common.Address{addr}, nil, true); err != nil {
			log.Error("Failed to prefetch account", "addr", addr, "err", err)
		}
	}
	// Insert into the live set
	obj := newObject(s, addr, acct)
	s.setStateObject(obj)
	return obj
}

func (s *StateDB) GetCode(addr common.Address) []byte {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		if s.witness != nil {
			s.witness.AddCode(stateObject.Code())
		}
		return stateObject.Code()
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/txpool/blobpool/evictheap.go">
```go
// evictHeap is a helper data structure to keep track of the cheapest bottleneck
// transaction from each account to determine which account to evict from.
//
// The heap internally tracks a slice of cheapest transactions from each account
// and a mapping from addresses to indices for direct removals/updates.
//
// The goal of the heap is to decide which account has the worst bottleneck to
// evict transactions from.
type evictHeap struct {
	metas map[common.Address][]*blobTxMeta // Pointer to the blob pool's index for price retrievals

	basefeeJumps float64 // Pre-calculated absolute dynamic fee jumps for the base fee
	blobfeeJumps float64 // Pre-calculated absolute dynamic fee jumps for the blob fee

	addrs []common.Address       // Heap of addresses to retrieve the cheapest out of
	index map[common.Address]int // Indices into the heap for replacements
}

// newPriceHeap creates a new heap of cheapest accounts in the blob pool to evict
// from in case of over saturation.
func newPriceHeap(basefee *uint256.Int, blobfee *uint256.Int, index map[common.Address][]*blobTxMeta) *evictHeap {
	heap := &evictHeap{
		metas: index,
		index: make(map[common.Address]int, len(index)),
	}
	// Populate the heap in account sort order. Not really needed in practice,
	// but it makes the heap initialization deterministic and less annoying to
	// test in unit tests.
	heap.addrs = slices.SortedFunc(maps.Keys(index), common.Address.Cmp)
	for i, addr := range heap.addrs {
		heap.index[addr] = i
	}
	heap.reinit(basefee, blobfee, true)
	return heap
}

// Less implements sort.Interface as part of heap.Interface, returning which of
// the two requested accounts has a cheaper bottleneck.
func (h *evictHeap) Less(i, j int) bool {
	txsI := h.metas[h.addrs[i]]
	txsJ := h.metas[h.addrs[j]]

	lastI := txsI[len(txsI)-1]
	lastJ := txsJ[len(txsJ)-1]

	prioI := evictionPriority(h.basefeeJumps, lastI.evictionExecFeeJumps, h.blobfeeJumps, lastI.evictionBlobFeeJumps)
	if prioI > 0 {
		prioI = 0
	}
	prioJ := evictionPriority(h.basefeeJumps, lastJ.evictionExecFeeJumps, h.blobfeeJumps, lastJ.evictionBlobFeeJumps)
	if prioJ > 0 {
		prioJ = 0
	}
	if prioI == prioJ {
		return lastI.evictionExecTip.Lt(lastJ.evictionExecTip)
	}
	return prioI < prioJ
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

// CachingDB is an implementation of Database interface. It leverages both trie and
// state snapshot to provide functionalities for state access. It's meant to be a
// long-live object and has a few caches inside for sharing between blocks.
type CachingDB struct {
	disk          ethdb.KeyValueStore
	triedb        *triedb.Database
	snap          *snapshot.Tree
	codeCache     *lru.SizeConstrainedCache[common.Hash, []byte]
	codeSizeCache *lru.Cache[common.Hash, int]
	pointCache    *utils.PointCache
}

// NewDatabase creates a state database with the provided data sources.
func NewDatabase(triedb *triedb.Database, snap *snapshot.Tree) *CachingDB {
	return &CachingDB{
		disk:          triedb.Disk(),
		triedb:        triedb,
		snap:          snap,
		codeCache:     lru.NewSizeConstrainedCache[common.Hash, []byte](codeCacheSize),
		codeSizeCache: lru.NewCache[common.Hash, int](codeSizeCacheSize),
		pointCache:    utils.NewPointCache(pointCacheSize),
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/blockchain.go">
```go
var (
	headBlockGauge          = metrics.NewRegisteredGauge("chain/head/block", nil)
	headHeaderGauge         = metrics.NewRegisteredGauge("chain/head/header", nil)
	headFastBlockGauge      = metrics.NewRegisteredGauge("chain/head/receipt", nil)
	headFinalizedBlockGauge = metrics.NewRegisteredGauge("chain/head/finalized", nil)
	headSafeBlockGauge      = metrics.NewRegisteredGauge("chain/head/safe", nil)

	chainInfoGauge   = metrics.NewRegisteredGaugeInfo("chain/info", nil)
	chainMgaspsGauge = metrics.NewRegisteredGauge("chain/mgasps", nil)

	accountReadTimer   = metrics.NewRegisteredResettingTimer("chain/account/reads", nil)
	accountHashTimer   = metrics.NewRegisteredResettingTimer("chain/account/hashes", nil)
	accountUpdateTimer = metrics.NewRegisteredResettingTimer("chain/account/updates", nil)
	accountCommitTimer = metrics.NewRegisteredResettingTimer("chain/account/commits", nil)

	storageReadTimer   = metrics.NewRegisteredResettingTimer("chain/storage/reads", nil)
	storageUpdateTimer = metrics.NewRegisteredResettingTimer("chain/storage/updates", nil)
	storageCommitTimer = metrics.NewRegisteredResettingTimer("chain/storage/commits", nil)

	accountReadSingleTimer = metrics.NewRegisteredResettingTimer("chain/account/single/reads", nil)
	storageReadSingleTimer = metrics.NewRegisteredResettingTimer("chain/storage/single/reads", nil)

	snapshotCommitTimer = metrics.NewRegisteredResettingTimer("chain/snapshot/commits", nil)
	triedbCommitTimer   = metrics.NewRegisteredResettingTimer("chain/triedb/commits", nil)

	blockInsertTimer          = metrics.NewRegisteredResettingTimer("chain/inserts", nil)
	blockValidationTimer      = metrics.NewRegisteredResettingTimer("chain/validation", nil)
	blockCrossValidationTimer = metrics.NewRegisteredResettingTimer("chain/crossvalidation", nil)
	blockExecutionTimer       = metrics.NewRegisteredResettingTimer("chain/execution", nil)
	blockWriteTimer           = metrics.NewRegisteredResettingTimer("chain/write", nil)

	blockReorgMeter     = metrics.NewRegisteredMeter("chain/reorg/executes", nil)
	blockReorgAddMeter  = metrics.NewRegisteredMeter("chain/reorg/add", nil)
	blockReorgDropMeter = metrics.NewRegisteredMeter("chain/reorg/drop", nil)

	blockPrefetchExecuteTimer    = metrics.NewRegisteredResettingTimer("chain/prefetch/executes", nil)
	blockPrefetchInterruptMeter  = metrics.NewRegisteredMeter("chain/prefetch/interrupts", nil)
	blockPrefetchTxsInvalidMeter = metrics.NewRegisteredMeter("chain/prefetch/txs/invalid", nil)
	blockPrefetchTxsValidMeter   = metrics.NewRegisteredMeter("chain/prefetch/txs/valid", nil)
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/txpool/blobpool/config.go">
```go
// Config are the configuration parameters of the blob transaction pool.
type Config struct {
	Datadir   string // Data directory containing the currently executable blobs
	Datacap   uint64 // Soft-cap of database storage (hard cap is larger due to overhead)
	PriceBump uint64 // Minimum price bump percentage to replace an already existing nonce
}

// DefaultConfig contains the default configurations for the transaction pool.
var DefaultConfig = Config{
	Datadir:   "blobpool",
	Datacap:   10 * 1024 * 1024 * 1024 / 4, // TODO(karalabe): /4 handicap for rollout, gradually bump back up to 10GB
	PriceBump: 100,                         // either have patience or be aggressive, no mushy ground
}

// sanitize checks the provided user configurations and changes anything that's
// unreasonable or unworkable.
func (config *Config) sanitize() Config {
	conf := *config
	if conf.Datacap < 1 {
		log.Warn("Sanitizing invalid blobpool storage cap", "provided", conf.Datacap, "updated", DefaultConfig.Datacap)
		conf.Datacap = DefaultConfig.Datacap
	}
	if conf.PriceBump < 1 {
		log.Warn("Sanitizing invalid blobpool price bump", "provided", conf.PriceBump, "updated", DefaultConfig.PriceBump)
		conf.PriceBump = DefaultConfig.PriceBump
	}
	return conf
}
```
</file>
</go-ethereum>
## Prompt Corrections
The provided prompt is very well-structured and comprehensive. It outlines a modern, feature-rich external bytecode system. The specified Zig structs and functions are clear and logical. There are no significant errors in the prompt itself.

However, a few points of clarification and potential enhancement based on `go-ethereum`'s design principles could be considered:

1.  **`ExternalBytecode` vs `vm.Contract`**:
    *   The prompt's `ExternalBytecode` struct is a good representation. In `go-ethereum`, a `vm.Contract` object is created for *every execution context* (every `CALL`, `CREATE`, etc.). It's a lightweight object that holds references to the code, caller, value, and gas for that specific call frame.
    *   **Suggestion**: The implementation could distinguish between a cached `ExternalBytecode` object (which is heavier and contains metadata, verification status, etc.) and a lighter `ExecutionContract` or `Frame` struct for the actual VM execution loop. This would prevent passing the large `ExternalBytecode` struct through the call stack repeatedly.

2.  **JUMPDEST Analysis (`BytecodeVerifier`)**:
    *   The prompt correctly identifies the need for bytecode verification. `go-ethereum`'s approach is highly optimized. It performs `JUMPDEST` analysis once per unique `codeHash` and caches the result (a `bitvec`) globally.
    *   **Suggestion**: The `BytecodeVerifier` in the prompt should adopt this pattern. The `load_bytecode` function in `ExternalBytecodeManager` should perform verification only if the bytecode hasn't been seen and verified before. The result of the verification (e.g., the `bitvec`) should be cached along with the bytecode itself, likely within the `ExternalBytecode` struct, to avoid re-analysis. This is reflected in `go-ethereum/core/vm/contract.go` with its `jumpdests` map.

3.  **Caching Strategy (`BytecodeCache`)**:
    *   The prompt specifies several caching strategies (LRU, LFU, Adaptive). `go-ethereum`'s `blobpool` uses a sophisticated heap-based eviction mechanism (`evictheap.go`) that considers multiple pricing factors. This is an excellent model for the "Adaptive" strategy.
    *   **Suggestion**: The implementation of the `Adaptive` cache eviction strategy should draw inspiration from `evictheap.go`, where the `Less` function compares items based on a combined score (e.g., access frequency, recency, size, and perhaps even gas cost savings) to determine the "cheapest" item to evict.

4.  **Security Manager**:
    *   This is a novel concept not explicitly present in Geth's core EVM in the same way. Geth's primary security check during execution is the `readOnly` flag (for `STATICCALL`), which prevents state-modifying opcodes.
    *   **Suggestion**: The `SecurityManager` could be simplified to primarily enforce the `readOnly` property. The more complex sandbox levels (`Basic`, `Strict`, `Isolated`) would be a significant extension beyond standard EVM behavior and should be carefully designed to avoid consensus divergence if this EVM is meant to be mainnet-compatible. If it's for a custom environment, the proposed design is good.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements the EVMCode interface.
type Contract struct {
	// CallerAddress is the result of the caller stack.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests map[common.Hash]bitvec // Aggregated result of JUMPDEST analysis.
	analysis  map[common.Hash]bitvec // Locally cached JUMPDEST analysis.

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	value *big.Int
	argslen,
	gas uint64

	snapshot int // Snapshot revision for call reentrancy checks.
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{CallerAddress: caller.Address(), caller: caller, self: object, value: value, gas: gas}

	// Gas should be a pointer so it can safely be reduced through the run
	// This is not the case so we'll just disable it for now.
	if parent, ok := caller.(*Contract); ok {
		// Transfer snapshot of jump analysis.
		c.jumpdests = parent.jumpdests
		c.snapshot = parent.snapshot
	} else {
		c.jumpdests = make(map[common.Hash]bitvec)
	}
	// The following two are here for backward compatibility.
	// We have to have this in for the tests to pass.
	c.analysis = make(map[common.Hash]bitvec)

	return c
}

// getCode returns the contract code at the given address.
// It will panic if the code is not present in the database.
func (c *Contract) getCode(db vm.StateDB, address common.Address) []byte {
	return db.GetCode(address)
}

// AsDelegate sets the contract to be a delegate call and returns the contract.
// It is used for properly testing the delegate call ops.
func (c *Contract) AsDelegate() *Contract {
	// NOTE: In order to create a correct delegate call we must set the
	// caller to be the same as the context's caller.
	c.self = c.caller
	return c
}

// GetOp implements EVMCode and returns the opcode at the given index.
func (c *Contract) GetOp(n uint64) vm.OpCode {
	if n >= uint64(len(c.Code)) {
		return vm.STOP
	}
	return vm.OpCode(c.Code[n])
}

// Code returns the contract code
func (c *Contract) CodeAddr() common.Address {
	return c.self.Address()
}

// Value returns the contract value (sent with the transaction/call)
func (c *Contract) Value() *big.Int {
	return c.value
}

// SetCode sets the contract code
func (c *Contract) SetCode(hash common.Hash, code []byte) {
	c.Code = code
	c.CodeHash = hash
}

// validJumpdest returns whether the given destination is a valid JUMPDEST.
func (c *Contract) validJumpdest(dest *uint256.Int) bool {
	udest := dest.Uint64()
	// The JUMPDEST location must be within the code bounds
	if udest >= uint64(len(c.Code)) {
		return false
	}
	// The JUMPDEST location must be a JUMPDEST instruction
	if vm.OpCode(c.Code[udest]) != vm.JUMPDEST {
		return false
	}
	// The JUMPDEST location must be on a valid instruction boundary.
	return c.isCode(c.CodeHash, udest)
}

// isCode returns whether the given location is a valid instruction boundary.
func (c *Contract) isCode(codehash common.Hash, udest uint64) bool {
	// If the code is not yet analysed, do it now.
	// We only need to analyse this a single time.
	// We use the codehash as a key in case the code of a contract is changed.
	if _, ok := c.analysis[codehash]; !ok {
		c.jumpdests[codehash] = bitvec(analyse(c.Code))
	}
	// The JUMPDEST location must be on a valid instruction boundary.
	return c.jumpdests[codehash].isSet(udest)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// bitvec is a bit vector which can be used for marking valid jump
// destinations.
type bitvec []byte

// isSet returns true if the given bit is set in the bit vector.
func (b bitvec) isSet(pos uint64) bool {
	return (b[pos/8] & (1 << (pos % 8))) != 0
}

// set sets the given bit in the bit vector.
func (b bitvec) set(pos uint64) {
	b[pos/8] |= 1 << (pos % 8)
}

// codeBitmap returns a bit vector of valid jump destinations in the given code.
// The code is debug-only, don't rely on it for production use.
func codeBitmap(code []byte) bitvec {
	// The bit vector is created with a capacity of len(code)
	// which is then sliced to the required size.
	// The capacity is a hint so that the slice doesn't have to be re-allocated
	// and copied when the underlying array is full.
	bv := make(bitvec, len(code))
	for pc := uint64(0); pc < uint64(len(code)); {
		op := OpCode(code[pc])
		// The bit vector is only concerned with valid jump destinations.
		// JUMPDESTs are explicitly marked in the bit vector, other valid
		// locations are not.
		if op == JUMPDEST {
			bv.set(pc)
		}
		pc += op.instrLen()
	}
	return bv
}

// analyse is used to analyse the given code and returns a bit vector of valid
// jump destinations.
func analyse(code []byte) []byte {
	// The bit vector is created with a capacity of len(code)
	// which is then sliced to the required size.
	// The capacity is a hint so that the slice doesn't have to be re-allocated
	// and copied when the underlying array is full.
	jumpdests := make(bitvec, len(code))
	for pc := uint64(0); pc < uint64(len(code)); {
		op := OpCode(code[pc])
		if op == JUMPDEST {
			jumpdests.set(pc)
		}
		pc += op.instrLen()
	}
	return jumpdests
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

// Cap iteratively flushes old but still referenced trie nodes until the total
// memory usage goes below the given threshold.
func (db *Database) Cap(limit common.StorageSize) error {
	db.lock.Lock()
	defer db.lock.Unlock()

	// ... (batching and flushing logic) ...

	// Keep committing nodes from the flush-list until we're below allowance
	oldest := db.oldest
	for size > limit && oldest != (common.Hash{}) {
		// Fetch the oldest referenced node and push into the batch
		node := db.dirties[oldest]
		rawdb.WriteLegacyTrieNode(batch, oldest, node.node)

		// ... (batch write logic) ...

		// Iterate to the next flush item
		oldest = node.flushNext
	}
	// ... (final flush and cleanup) ...

	return nil
}


// dereference is the private locked version of Dereference.
func (db *Database) dereference(hash common.Hash) {
	// If the node does not exist, it's a previously committed node.
	node, ok := db.dirties[hash]
	if !ok {
		return
	}
	// If there are no more references to the node, delete it and cascade
	if node.parents > 0 {
		// ...
		node.parents--
	}
	if node.parents == 0 {
		// ... (remove from flush-list) ...

		// Dereference all children and delete the node
		node.forChildren(func(child common.Hash) {
			db.dereference(child)
		})
		delete(db.dirties, hash)
		// ... (update size metrics) ...
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/database.go">
```go
// Database is an intermediate trie database that can be used for read-only
// access on top of a disk database. The goal is to provide a Trie API that
// can be used without modifying the underlying database.
//
// After use, any held resources should be released via Close.
type Database interface {
	// OpenTrie opens the main account trie at a specific root hash.
	OpenTrie(root common.Hash) (Trie, error)

	// OpenStorageTrie opens the storage trie of an account.
	OpenStorageTrie(addrHash, root common.Hash) (Trie, error)

	// OpenCode opens the code of an account.
	OpenCode(codeHash common.Hash) ([]byte, error)

	// TrieDB retrieves the low level trie database used for data storage.
	TrieDB() *triedb.Database

	// Copy returns a copy of the database. The returned copy is not safe for
	// concurrent use.
	Copy() Database
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state.
// Its contents can be written to a database.
type StateDB struct {
	db                Database
	prefetcher        *TriePrefetcher
	originalRoot      common.Hash
	snaps             *snapshot.Tree
	snap              snapshot.Snapshot
	journal           *journal
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}
	//...
}

// GetCode returns the code of an account.
func (s *StateDB) GetCode(addr common.Address) []byte {
	so := s.getStateObject(addr)
	if so != nil {
		return so.Code(s.db)
	}
	return nil
}

// SetCode sets the code of an account to the given code.
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	so := s.getOrNewStateObject(addr)
	s.journal.append(codeChange{
		account:  &addr,
		prevcode: so.Code(s.db),
		prevhash: so.CodeHash(),
	})
	so.SetCode(crypto.Keccak256Hash(code), code)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiled.go">
```go
// PrecompiledContract is the interface for a native contract.
//
// A native contract is supposed to be used as a pre-compiled contract that
// may be called from the EVM. Native contracts do not require gas to be
// executed and are thus cheaper to use.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas returns the gas required to execute the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}


// PrecompiledContractsBerlin contains the default set of pre-compiled contracts used
// in the Berlin release.
var PrecompiledContractsBerlin = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run executes the given contract and returns the gas used and the returned data.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup)

	var (
		op    OpCode        // current opcode
		mem   = NewMemory() // bound memory
		stack = newstack()  // local stack
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go above 2^64. The YP defines the PC
		// to be uint256. Practically much smaller bounded size should be chosen
		// to simplify the implementation.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the defer
		gasCopy uint64 // for Tracer.CaptureState
		logged  bool   // deferred Tracer.CaptureState logging done
		res     []byte // result of the opcode execution function
	)

	// ... (tracer setup) ...

	// The main execution loop
	for {
		// ... (tracer capture) ...

		// Get next opcode
		op = contract.GetOp(pc)
		// Validate stack
		if err := op.validateStack(stack); err != nil {
			return nil, err
		}
		// Execute the operation
		// ...
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/lru/lru.go">
```go
// Package lru implements generically-typed LRU caches.
package lru

import "sync"

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

// ... (other methods: Contains, Len, Peek, Purge, Remove, Keys)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current execution environment
	Context BlockContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// depth is the current call stack
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules

	// vmConfig contains configuration options for the EVM
	vmConfig Config

	// interpreter is used to execute the contracts
	interpreter *EVMInterpreter

	// readOnly is the read-only indicator. If it is true, the state is not
	// allowed to be changed.
	readOnly bool

	// returnData is the return data of the last call.
	returnData []byte
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(blockCtx BlockContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		Context:     blockCtx,
		StateDB:     statedb,
		chainConfig: chainConfig,
		chainRules:  chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time),
		vmConfig:    vmConfig,
		returnData:  nil,
	}
	evm.interpreter = NewEVMInterpreter(evm, vmConfig)
	return evm
}


// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer and calls the
// snapshot generation functions if necessary.
//
// The returned slice is from the interpreter's memory and must NOT be modified.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.vmConfig.NoRecursion && evm.depth > 0 {
		return nil, gas, nil
	}
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if value.Sign() != 0 && !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}

	// ... (snapshotting logic) ...

	p, isPrecompile := evm.precompile(addr)
	if !isPrecompile {
		// ... (logic for regular contract calls) ...
		code := evm.StateDB.GetCode(addr)
		// ...
		ret, err = evm.interpreter.Run(contract, input, evm.readOnly)
	} else {
		// Execute precompiled contract
		ret, gas, err = RunPrecompiledContract(p, input, gas)
	}
	// ... (handle results) ...
	return ret, leftOverGas, err
}

// Create creates a new contract using code as deployment code.
//
// The returned slice is from the interpreter's memory and must NOT be modified.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (depth and balance checks) ...

	// Create a new account on the state
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)

	// ... (collision check, value transfer) ...

	// Create a new contract and execute the code.
	contract := NewContract(caller, Account(contractAddr), value, gas)
	contract.SetCode(common.Hash{}, code)

	// ... (initcode size checks for EIP-3860) ...

	ret, err = evm.interpreter.Run(contract, nil, evm.readOnly)
	
	// ... (max code size checks for EIP-170, handle results) ...

	// Deploy the code if the initialization was successful.
	if err == nil {
		createDataGas := uint64(len(ret)) * params.CreateDataGas
		if contract.Gas < createDataGas {
			err = ErrCodeStoreOutOfGas
		} else {
			contract.Gas -= createDataGas
			evm.StateDB.SetCode(contractAddr, ret)
		}
	}
	// ... (handle failure) ...
	return ret, contractAddr, contract.Gas, err
}
```
</file>

## Prompt Corrections
The original prompt's design for an `ExternalBytecodeManager` is quite sophisticated and includes features not directly present in `go-ethereum`, such as multiple bytecode loaders (HTTP, IPFS) and advanced caching strategies (LFU, TTL, Adaptive). While `go-ethereum` is a great reference for a production EVM, its code loading is tightly coupled to its state database (`StateDB` backed by a `TrieDB`).

The following points clarify how `go-ethereum` concepts map to the prompt's request and suggest how the implementation can draw inspiration:

1.  **Bytecode Loading**:
    *   **Prompt**: A `LoaderRegistry` for sources like files, HTTP, IPFS.
    *   **Go-Ethereum**: Code is loaded from the state trie via the `StateDB` (`GetCode` method). The `StateDB` itself uses a `Database` interface (`core/state/database.go`), which allows for different backend implementations (e.g., `triedb.Database`). This abstract `Database` interface is the closest parallel to the prompt's pluggable loader system. The implementation could model its loaders to conform to a similar interface.

2.  **Bytecode Caching**:
    *   **Prompt**: A dedicated `BytecodeCache` with LRU, LFU, TTL, etc.
    *   **Go-Ethereum**: Caching is deeply integrated into the state management.
        *   `triedb/hashdb/database.go`: Implements a complex in-memory cache for trie nodes (which includes code). It uses reference counting (`parents` field in `cachedNode`) and an LRU-like eviction policy (`Cap` function) to manage memory. This is an excellent reference for high-performance, memory-managed caching.
        *   `common/lru/lru.go`: Provides a generic, thread-safe LRU cache that can be directly used to implement the LRU strategy.
    *   **Correction**: Instead of a simple key-value cache, the implementation should consider the benefits of a reference-counted system like `geth`'s `triedb` if bytecode objects are to be shared across different contexts, to prevent memory duplication and ensure proper garbage collection.

3.  **Bytecode Verification**:
    *   **Prompt**: A `BytecodeVerifier` for checksums, signatures, and format validation.
    *   **Go-Ethereum**: Verification is primarily focused on EVM correctness.
        *   `core/vm/analysis.go`: The `analyse` function performs JUMPDEST validation by creating a bit-vector of valid jump locations. This is a critical security and performance feature that prevents jumps into instruction data.
        *   Deployment-time checks (e.g., max code size in `EVM.Create`) are also a form of verification.
    *   **Recommendation**: The `analyse` function and `bitvec` implementation are directly relevant and should be a core part of the `BytecodeVerifier`. Code signing and checksums are application-level features not present in the core EVM and would need to be implemented from scratch.

4.  **Bytecode Representation**:
    *   **Prompt**: A rich `ExternalBytecode` struct with metadata, status, and security context.
    *   **Go-Ethereum**: The `core/vm/contract.go` `Contract` object is the closest equivalent. It holds the `Code`, `CodeHash`, and execution context (`caller`, `self`, `value`, `gas`). While it doesn't store the extensive metadata from the prompt, it's the right place to look for how bytecode is managed during execution.

By studying these `go-ethereum` components, the developer can build a robust external bytecode system that is both feature-rich (as per the prompt) and grounded in the proven architectural patterns of a production-grade EVM.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
package vm

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/params"
)

// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// AccountRef implements ContractRef.
//
// AccountRef is used by the vm to fetch the address of the contract as a common.Address
type AccountRef common.Address

// Address returns the contract address
func (ar AccountRef) Address() common.Address {
	return (common.Address)(ar)
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the caller stack.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests bitvec // Aggregated result of JUMPDEST analysis.
	analysis  bitvec // JUMPDEST analysis result cache for validating new code.

	Code     []byte
	CodeHash common.Hash
	CodeAddr *common.Address
	Input    []byte

	value *big.Int
	Gas   uint64

	// inCreate is true if the contract is being created.
	inCreate bool
}

// NewContract creates a new contract for execution
//
// The returned contract is not a copy and modifications will affect the state of the parent.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{
		caller:   caller,
		self:     object,
		value:    value,
		Gas:      gas,
		inCreate: false,
	}

	if object != nil {
		// No need to check for nil, object is checked above
		c.CodeAddr = new(common.Address)
		*c.CodeAddr = object.Address()
	}
	return c
}

// AsDelegate creates a new contract with the destination address as the context, but
// sets the caller to the original caller and sets the value to the original value.
func (c *Contract) AsDelegate() *Contract {
	// NOTE: caller must, at all times be a contract. It should never be an
	// account reference.
	return &Contract{
		caller:   c.caller,
		self:     c.self,
		value:    c.value,
		Code:     c.Code,
		CodeHash: c.CodeHash,
		CodeAddr: c.CodeAddr,
		Gas:      c.Gas,
		Input:    c.Input,
	}
}

// GetOp returns the n'th element in the contract's byte code
func (c *Contract) GetOp(n uint64) OpCode {
	if n < uint64(len(c.Code)) {
		return OpCode(c.Code[n])
	}
	return STOP
}

// Caller returns the caller of the contract.
//
// Caller will return the address of the caller if the context is created with
// NewContract. But if the context is created with NewContractCreation, the
// caller will be the address of the contract being created.
func (c *Contract) Caller() common.Address {
	return c.caller.Address()
}

// UseGas attempts to use gas and returns whether it succeeded.
func (c *Contract) UseGas(gas uint64) (ok bool) {
	if c.Gas < gas {
		return false
	}
	c.Gas -= gas
	return true
}

// Address returns the contracts address
func (c *Contract) Address() common.Address {
	return c.self.Address()
}

// Value returns the contracts value (sent to it from it's caller)
func (c *Contract) Value() *big.Int {
	return c.value
}

// SetCode sets the code for the contract
func (c *Contract) SetCode(hash common.Hash, code []byte) {
	c.Code = code
	c.CodeHash = hash
}

// validJumpdest checks whether the given PC is a valid jump destination.
func (c *Contract) validJumpdest(dest *big.Int) bool {
	udest := dest.Uint64()
	// The JUMPDEST location must not be part of the constant data section of a contract,
	// it must be a valid instruction.
	if dest.IsUint64() && udest < uint64(len(c.Code)) {
		if c.Code[udest] != JUMPDEST {
			return false
		}
		// The JUMPDEST analysis is only performed if the contract is not
		// already analysed. This is controlled by the parent setting the
		// analysis field on the contract.
		if c.jumpdests == nil {
			c.jumpdests = c.analyseJumpdest()
		}
		return c.jumpdests.isSet(udest)
	}
	return false
}

// isCode returns whether the given pc is within the contract's code.
func (c *Contract) isCode(pc uint64) bool {
	return pc < uint64(len(c.Code))
}

// Create creates a new contract using code as deployment code.
func (c *Contract) Create(code []byte, gas uint64, value *big.Int, address common.Address) ([]byte, common.Address, uint64, error) {
	return nil, address, gas, nil
}

// analyseJumpdest performs a one-off analysis on the given byte code, determining the
// valid jump destinations.
func (c *Contract) analyseJumpdest() (dests bitvec) {
	c.analysis, dests = analyse(c.Code)
	return
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
package vm

import "github.com/ethereum/go-ethereum/params"

type bitvec []byte

func (bits bitvec) isSet(pos uint64) bool {
	return (bits[pos/8] & (1 << (pos % 8))) != 0
}

func (bits *bitvec) set(pos uint64) {
	(*bits)[pos/8] |= 1 << (pos % 8)
}

// analyse analyses the given code and returns the collected jump destinations.
// The data section is defined by push operations, which are followed by data
// that is not considered executable code, but rather arguments to the push
// operations. The jump destinations are checked to be within the code, not
// be part of push-data and to be a JUMPDEST instruction.
func analyse(code []byte) (codeAnalysis, bitvec) {
	// The analysis is a very cheap process that involves a single pass over the code
	analysis := make(codeAnalysis, len(code))
	jumps := make(bitvec, (len(code)+7)/8)

	// Don't bother analyzing Gasmeter code.
	if len(code) == 0 {
		return analysis, jumps
	}

	var (
		i      = uint64(0)
		isCode = true
	)
	for i < uint64(len(code)) {
		var (
			op     = OpCode(code[i])
			opdata = int(op) - int(PUSH1) + 1
		)

		if isCode {
			analysis[i] = opValid
			if op == JUMPDEST {
				analysis[i] = opJumpdest
			}
			if op >= PUSH1 && op <= PUSH32 {
				isCode = false
			}
		} else {
			analysis[i] = opPushdata
			opdata--
			if opdata == 0 {
				isCode = true
			}
		}
		i++
	}

	for i, op := range analysis {
		if op == opJumpdest {
			jumps.set(uint64(i))
		}
	}
	return analysis, jumps
}

// validateCode returns a list of valid jump destinations.
func validateCode(code []byte) bitvec {
	// Geth used to have a 'code cache' here, but it was removed in favour
	// of just-in-time validation. For the most part, code is only checked
	// once, unless it's a delegate call, where the code is coming from another
	// account.
	_, dests := analyse(code)
	return dests
}

func validateCodeEIP3541(code []byte) error {
	// EIP-3541: Reject new contract code starting with the 0xEF byte
	if len(code) > 0 && code[0] == 0xEF {
		return ErrInvalidCode
	}
	return nil
}

// validateCodeEOF returns a list of valid jump destinations.
func validateCodeEOF(code []byte, config *params.ChainConfig) (bitvec, error) {
	// placeholder for EOF validation
	return validateCode(code), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
package state

import (
	"fmt"
	"math/big"
	"sort"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/metrics"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/rlp"
)

// stateRevisions is the number of revisions maintained by the state db.
const stateRevisions = 256

// StateDB is a wrapper around a Trie that supports snapshoting and reverting
// to a previous state.
type StateDB struct {
	db                Database
	prefetcher        *prefetcher
	originalRoot      common.Hash
	snaps             *snapshot.Tree
	snap              int
	journal           *journal
	journalIndex      map[common.Address]int
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}
	//...
}

// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
// First you need to obtain a state object.
//
//	obj := s.getStateObject(addr)
//
// You can now access and modify the state object's fields.
//
//	obj.AddBalance(big.NewInt(5))
//
// Finally, call s.updateStateObject(obj) to write the changes to the
// underlying trie.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.StateAccount
	db       *StateDB

	// Write caches.
	code Code // contract bytecode, which gets stored as health-check against code tampering

	// Cache flags.
	dirtyCode bool // true if the code was updated
	//...
}

// GetCode retrieves a state object's contract code.
func (s *StateDB) GetCode(addr common.Address) []byte {
	stateObject := s.getStateObject(addr)
	if stateObject != nil {
		return stateObject.Code(s.db)
	}
	return nil
}

// GetCodeSize retrieves a state object's contract code size.
func (s *StateDB) GetCodeSize(addr common.Address) int {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return 0
	}
	if stateObject.code != nil {
		return len(stateObject.code)
	}
	size, _ := s.db.ContractCodeSize(stateObject.addrHash, common.BytesToHash(stateObject.data.CodeHash))
	return size
}

// SetCode sets the contract code for a state object.
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	stateObject := s.GetOrNewStateObject(addr)
	stateObject.SetCode(crypto.Keccak256Hash(code), code)
}

// GetCodeHash retrieves a state object's contract code hash.
func (s *StateDB) GetCodeHash(addr common.Address) common.Hash {
	stateObject := s.getStateObject(addr)
	if stateObject == nil {
		return common.Hash{}
	}
	return common.BytesToHash(stateObject.data.CodeHash)
}

// Code returns the contract code associated with this object, if any.
func (s *stateObject) Code(db Database) []byte {
	if s.code != nil {
		return s.code
	}
	if bytes.Equal(s.data.CodeHash, types.EmptyCodeHash.Bytes()) {
		return nil
	}
	code, err := db.ContractCode(s.addrHash, common.BytesToHash(s.data.CodeHash))
	if err != nil {
		s.setError(fmt.Errorf("can't load code %x for @%x: %v", common.BytesToHash(s.data.CodeHash), s.address, err))
		return nil
	}
	s.code = code
	return code
}

// SetCode sets the contract code for the state object.
func (s *stateObject) SetCode(codeHash common.Hash, code []byte) {
	s.setCode(codeHash, code)
}

func (s *stateObject) setCode(codeHash common.Hash, code []byte) {
	s.code = code
	s.data.CodeHash = codeHash[:]
	s.dirtyCode = true
}

// getStateObject attempts to retrieve a state object given by the address.
func (s *StateDB) getStateObject(addr common.Address) *stateObject {
	// Prefer 'live' objects if any.
	if obj := s.stateObjects[addr]; obj != nil {
		return obj
	}
	// Try state snapshot first, and then database for the state object.
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
		s.setError(fmt.Errorf("can't create new state object for %x: %v", addr, err))
		return nil
	}
	if data == nil {
		return nil
	}
	// Insert into the live set.
	obj := newObject(s, addr, *data)
	s.setStateObject(obj)
	return obj
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/database.go">
```go
package state

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/triedb"
)

// Database defines an interface for fetching and storing state objects.
type Database interface {
	// OpenTrie opens the main account trie at a specific root hash.
	OpenTrie(root common.Hash) (Trie, error)
	// OpenStorageTrie opens the storage trie of an account.
	OpenStorageTrie(addrHash, root common.Hash) (Trie, error)
	// ContractCode retrieves a particular contract's code.
	ContractCode(addrHash, codeHash common.Hash) ([]byte, error)
	// ContractCodeSize retrieves a particular contract's code size.
	ContractCodeSize(addrHash, codeHash common.Hash) (int, error)
	// TrieDB retrieves the low level trie database used for data storage.
	TrieDB() *triedb.Database
}

// ContractCodeDatabase retrieves contract code from the database.
type ContractCodeDatabase interface {
	// ContractCode retrieves a particular contract's code.
	ContractCode(addrHash, codeHash common.Hash) ([]byte, error)
	// ContractCodeSize retrieves a particular contract's code size.
	ContractCodeSize(addrHash, codeHash common.Hash) (int, error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/p2p/keystore/account_cache.go">
```go
package keystore

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"slices"
	"sort"
	"strings"
	"sync"
	"time"

	mapset "github.com/deckarep/golang-set/v2"
	"github.com/ethereum/go-ethereum/accounts"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/log"
)

// Minimum amount of time between cache reloads. This limit applies if the platform does
// not support change notifications. It also applies if the keystore directory does not
// exist yet, the code will attempt to create a watcher at most this often.
const minReloadInterval = 2 * time.Second

// accountCache is a live index of all accounts in the keystore.
type accountCache struct {
	keydir   string
	watcher  *watcher
	mu       sync.Mutex
	all      []accounts.Account
	byAddr   map[common.Address][]accounts.Account
	throttle *time.Timer
	notify   chan struct{}
	fileC    fileCache
}

func newAccountCache(keydir string) (*accountCache, chan struct{}) {
	ac := &accountCache{
		keydir: keydir,
		byAddr: make(map[common.Address][]accounts.Account),
		notify: make(chan struct{}, 1),
		fileC:  fileCache{all: mapset.NewThreadUnsafeSet[string]()},
	}
	ac.watcher = newWatcher(ac)
	return ac, ac.notify
}

func (ac *accountCache) accounts() []accounts.Account {
	ac.maybeReload()
	ac.mu.Lock()
	defer ac.mu.Unlock()
	cpy := make([]accounts.Account, len(ac.all))
	copy(cpy, ac.all)
	return cpy
}

func (ac *accountCache) add(newAccount accounts.Account) {
	ac.mu.Lock()
	defer ac.mu.Unlock()
	// ... (implementation to add an account to the cache)
}

func (ac *accountCache) delete(removed accounts.Account) {
	ac.mu.Lock()
	defer ac.mu.Unlock()
	// ... (implementation to delete an account from the cache)
}

// scanAccounts checks if any changes have occurred on the filesystem, and
// updates the account cache accordingly
func (ac *accountCache) scanAccounts() error {
	// Scan the entire folder metadata for file changes
	creates, deletes, updates, err := ac.fileC.scan(ac.keydir)
	if err != nil {
		log.Debug("Failed to reload keystore contents", "err", err)
		return err
	}
	if creates.Cardinality() == 0 && deletes.Cardinality() == 0 && updates.Cardinality() == 0 {
		return nil
	}
	// Create a helper method to scan the contents of the key files
	var (
		buf = new(bufio.Reader)
		key struct {
			Address string `json:"address"`
		}
	)
	readAccount := func(path string) *accounts.Account {
		fd, err := os.Open(path)
		if err != nil {
			log.Trace("Failed to open keystore file", "path", path, "err", err)
			return nil
		}
		defer fd.Close()
		buf.Reset(fd)
		// Parse the address.
		key.Address = ""
		err = json.NewDecoder(buf).Decode(&key)
		addr := common.HexToAddress(key.Address)
		switch {
		case err != nil:
			log.Debug("Failed to decode keystore key", "path", path, "err", err)
		case addr == common.Address{}:
			log.Debug("Failed to decode keystore key", "path", path, "err", "missing or zero address")
		default:
			return &accounts.Account{
				Address: addr,
				URL:     accounts.URL{Scheme: KeyStoreScheme, Path: path},
			}
		}
		return nil
	}
	// Process all the file diffs
	start := time.Now()

	for _, path := range creates.ToSlice() {
		if a := readAccount(path); a != nil {
			ac.add(*a)
		}
	}
	for _, path := range deletes.ToSlice() {
		ac.deleteByFile(path)
	}
	for _, path := range updates.ToSlice() {
		ac.deleteByFile(path)
		if a := readAccount(path); a != nil {
			ac.add(*a)
		}
	}
	end := time.Now()

	select {
	case ac.notify <- struct{}{}:
	default:
	}
	log.Trace("Handled keystore changes", "time", end.Sub(start))
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/p2p/dnsdisc/client.go">
```go
package dnsdisc

import (
	"context"
	"errors"
	"fmt"
	"math/rand"
	"net"
	"strings"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum/common/lru"
	"github.com/ethereum/go-ethereum/common/mclock"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/p2p/enode"
	"github.com/ethereum/go-ethereum/p2p/enr"
	"golang.org/x/sync/singleflight"
	"golang.org/x/time/rate"
)

// Client discovers nodes by querying DNS servers.
type Client struct {
	cfg          Config
	clock        mclock.Clock
	entries      *lru.Cache[string, entry]
	ratelimit    *rate.Limiter
	singleflight singleflight.Group
}

// Config holds configuration options for the client.
type Config struct {
	Timeout         time.Duration      // timeout used for DNS lookups (default 5s)
	RecheckInterval time.Duration      // time between tree root update checks (default 30min)
	CacheLimit      int                // maximum number of cached records (default 1000)
	RateLimit       float64            // maximum DNS requests / second (default 3)
	ValidSchemes    enr.IdentityScheme // acceptable ENR identity schemes (default enode.ValidSchemes)
	Resolver        Resolver           // the DNS resolver to use (defaults to system DNS)
	Logger          log.Logger         // destination of client log messages (defaults to root logger)
}

// NewClient creates a client.
func NewClient(cfg Config) *Client {
	cfg = cfg.withDefaults()
	rlimit := rate.NewLimiter(rate.Limit(cfg.RateLimit), 10)
	return &Client{
		cfg:       cfg,
		entries:   lru.NewCache[string, entry](cfg.CacheLimit),
		clock:     mclock.System{},
		ratelimit: rlimit,
	}
}

// resolveEntry retrieves an entry from the cache or fetches it from the network
// if it isn't cached.
func (c *Client) resolveEntry(ctx context.Context, domain, hash string) (entry, error) {
	// The rate limit always applies, even when the result might be cached. This is
	// important because it avoids hot-spinning in consumers of node iterators created on
	// this client.
	if err := c.ratelimit.Wait(ctx); err != nil {
		return nil, err
	}
	cacheKey := truncateHash(hash)
	if e, ok := c.entries.Get(cacheKey); ok {
		return e, nil
	}

	ei, err, _ := c.singleflight.Do(cacheKey, func() (interface{}, error) {
		e, err := c.doResolveEntry(ctx, domain, hash)
		if err != nil {
			return nil, err
		}
		c.entries.Add(cacheKey, e)
		return e, nil
	})
	e, _ := ei.(entry)
	return e, err
}

// doResolveEntry fetches an entry via DNS.
func (c *Client) doResolveEntry(ctx context.Context, domain, hash string) (entry, error) {
	wantHash, err := b32format.DecodeString(hash)
	if err != nil {
		return nil, errors.New("invalid base32 hash")
	}
	name := hash + "." + domain
	txts, err := c.cfg.Resolver.LookupTXT(ctx, hash+"."+domain)
	c.cfg.Logger.Trace("DNS discovery lookup", "name", name, "err", err)
	if err != nil {
		return nil, err
	}
	for _, txt := range txts {
		e, err := parseEntry(txt, c.cfg.ValidSchemes)
		if errors.Is(err, errUnknownEntry) {
			continue
		}
		if !bytes.HasPrefix(crypto.Keccak256([]byte(txt)), wantHash) {
			err = nameError{name, errHashMismatch}
		} else if err != nil {
			err = nameError{name, err}
		}
		return e, err
	}
	return nil, nameError{name, errNoEntry}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
package vm

import (
	"fmt"
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/params"
)

// Config are the configuration options for the Interpreter
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op code logger
	Tracer Tracer
	// NoBaseFee may be used to disable base fee analysis
	NoBaseFee bool
	// EnableJit enabled the JIT VM
	EnableJit bool
	// AllowUnprotectedTxs may be used to disable EIP-155 checks, thus allowing 'unprotected' transactions.
	// This is a pathological situation, and should only be used in specific test scenarios
	AllowUnprotectedTxs bool

	// The values of these two fields are only used by the JIT EVM.
	// They correspond to the EIP-2929 constants, but are left here
	// as config options for the JIT. The JIT might be used with other
	// (non-mainnet) configurations.
	ColdAccountAccessCost uint64
	ColdSloadCost         uint64

	// EIP-4762: precompile for point evaluation
	Precompile4762Code []byte `toml:",omitempty"`
}

// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm      *EVM
	config   Config
	gas      uint64
	op       OpCode
	readOnly bool
	ret      []byte

	stack    *Stack
	memory   *Memory
	pc       uint64
	gasPool  *GasPool
	contract *Contract

	// Keccak256 hash of contract code
	codeHash common.Hash

	// Current call depth
	depth int
}

// NewEVMInterpreter returns a new instance of the interpreter.
func NewEVMInterpreter(evm *EVM, config Config) *EVMInterpreter {
	return &EVMInterpreter{
		evm:      evm,
		config:   config,
		gasPool:  new(GasPool),
		readOnly: evm.readOnly,
	}
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	in.readOnly = readOnly
	in.contract = contract
	in.memory = NewMemory()
	in.stack = NewStack()
	in.ret = nil
	in.pc = 0
	in.gas = contract.Gas
	in.codeHash = crypto.Keccak256Hash(contract.Code)

	var (
		op          OpCode        // current opcode
		mem         = in.memory   // bound memory
		stack       = in.stack    // bound stack
		callContext = in          // needed for STATICCALL
		// For optimisation, we have a stack cache for the peek operations.
		stackCache [_stackCacheSize]uint256
	)
	// ...
	for {
		// ...
		// Get operation from contract
		op = contract.GetOp(in.pc)
		operation := opTable[op]
		// ...
		// If the operation is valid, get the scope and execute the operation
		scope.In = in
		scope.Op = op
		scope.PC = &in.pc
		scope.Gas = &in.gas
		scope.Stack = stack
		scope.Memory = mem
		scope.Contract = contract
		scope.ReturnData = &in.evm.interpreter.ret

		// Check if the operation is valid
		if !operation.valid {
			return nil, &ErrInvalidOpCode{opcode: op}
		}

		// Check and subtract gas
		cost := operation.constantGas
		//...
		if err := scope.useGas(cost); err != nil {
			return nil, err
		}

		// a precompile is a contract that is not executed by the EVM, but by the client
		if operation.precompileFn != nil {
			if err := operation.precompileFn(in.evm, scope.Contract, scope.Input, scope.Gas); err != nil {
				return nil, err
			}
		} else {
			// Execute the operation
			res, err = operation.execute(&in.pc, in, &scope)
		}
		// ...
	}
	//...
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// Contract represents an ethereum contract in the state machine.
type Contract struct {
	// CallerAddress is the result of the CALLER opcode.
	// This is the address of the contract that initiated the current execution.
	//
	// NOTE: This is not the transaction sender, see Caller().
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of ANALYSE given with the code
	analysis  atomic.Pointer[codeAnalysis]

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	value *uint256.Int
	gas   uint64

	// Sane indicates whether the contract is running in a sane environment.
	// A sane environment means that the UIP-6800 is active. In a sane environment,
	// we can assume that an EIP-3540 contract is valid, and that `STATICCALL` is
	// truly static.
	sane bool

	// This is the static flag, which forbids any state-modifying operations.
	// It is true if the contract is being executed in a static context.
	static bool
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller ContractRef, object ContractRef, value *uint256.Int, gas uint64) *Contract {
	c := &Contract{
		caller: caller,
		self:   object,
		value:  value,
		gas:    gas,
	}
	// Check whether the UIP-6800 rules are in effect or not.
	// We can't use the rules from the current head because it might be a pre-merge header,
	// so we use the rules from the config instead, since it is always post-merge.
	c.sane = true
	return c
}

// AsDelegate sets the contract to be a delegate call and returns the contract.
//
// Delegate call transfers the execution of a contract to another contract,
// but executes in the context of the caller.
func (c *Contract) AsDelegate() *Contract {
	c.self = c.caller
	return c
}

// validJumpdest checks whether the given destination is a valid jump destination.
func (c *Contract) validJumpdest(dest *uint256.Int) bool {
	udest, overflow := dest.Uint64WithOverflow()
	// The max uint64 is a very large number, and it's impossible to have a contract
	// that large. In that case, the jump destination is invalid.
	if overflow || udest >= uint64(len(c.Code)) {
		return false
	}
	if c.jumpdests.has(udest) {
		return true
	}
	// Before EIP-3540, we don't need to consider the contract format, so an
	// invalid jumpdest is final.
	if !c.sane {
		return false
	}
	// After EIP-3540, we need to check the contract format. It's possible
	// that a "sane" contract is called from an "insane" one. In that case
	// we still need to perform the check.
	analysis := c.analysis.Load()
	if analysis == nil {
		a := analyseCode(c.Code)
		c.analysis.Store(&a)
		analysis = &a
	}
	return analysis.jumpdests.has(udest)
}

// bitvec is a bit vector which can be used to mark locations in the code.
type bitvec []byte

// has checks whether the bit at the given index is set.
func (bits bitvec) has(pos uint64) bool {
	return (bits[pos/8] & (1 << (pos % 8))) != 0
}

// destinations is a wrapper around a bit vector to implement the legacy destination
// cache for non-upgraded contract, and a raw bit-vector for validated contracts.
//
// The use of a pointer to the bit vector is to enable lazy code analysis, and
// to share the analysis result between multiple calling contracts.
type destinations struct {
	// For legacy contracts, we can't do a full validation, so we have to
	// live with a lazily-populated jumpdest map.
	legacy map[uint64]struct{}
	sorted *bitvec
}

// has checks whether the given destination is a valid jump destination.
func (d destinations) has(dest uint64) bool {
	if d.sorted != nil {
		return d.sorted.has(dest)
	}
	// Legacy contracts will have a nil bitvec. They are not length-prefixed and
	// have no special validation rules.
	_, ok := d.legacy[dest]
	return ok
}
// ...
// Analyse analyzes the given code and returns the destinations.
func Analyse(code []byte) destinations {
	// Do a quick pass for a single JUMPDEST, which is the most common case
	if bytes.IndexByte(code, byte(JUMPDEST)) == -1 {
		return destinations{sorted: new(bitvec)} // empty bitvec
	}
	// Do the full analysis if not the most common case
	return analyse(code)
}

// analyse is the slow-path for Analyse.
func analyse(code []byte) destinations {
	// Gather all jump destinations
	var (
		dests    = make(map[uint64]struct{})
		codesize = uint64(len(code))
	)
	for i := uint64(0); i < codesize; {
		var (
			op = OpCode(code[i])
			opsize = op.opsize()
		)
		if op == JUMPDEST {
			dests[i] = struct{}{}
		}
		i += opsize
	}
	// For legacy contracts, we return the map directly.
	return destinations{legacy: dests}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes the code of the given account with the given input data and returns
// the results, the remaining gas and an error if one occurred.
//
// The canTransfer can be used to disallow state modifications unless the value transfer
// is done. Note that this check is only performed in the initial call and not for internal
// calls.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		evm.StateDB.Transfer(caller.Address(), addr, value)
	}
	// Set up the new contract for execution
	code := evm.StateDB.GetCode(addr)

	if len(code) == 0 {
		return nil, gas, nil
	}
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), code)

	return evm.interpreter.Run(contract, input, false)
}
//...
// Create creates a new contract using the data passed to the CREATE
// instruction.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Ensure there's no existing contract already at the designated address
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	if evm.StateDB.GetCodeSize(contractAddr) != 0 {
		return nil, common.Address{}, 0, ErrContractAddressCollision
	}
	// Check whether the address is on the access list.
	if evm.chainRules.IsBerlin {
		evm.StateDB.AddAddressToAccessList(contractAddr)
	}
	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr)
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1)
	}
	evm.StateDB.Transfer(caller.Address(), contractAddr, value)

	// Create a new contract and execute the code
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.Code, contract.CodeHash = code, crypto.Keccak256Hash(code)

	if evm.chainRules.IsEIP3541 {
		if len(code) > 0 && code[0] == 0xEF {
			return nil, contractAddr, gas, ErrInvalidCode
		}
	}
	ret, err = evm.interpreter.Run(contract, nil, false)

	// Check whether the max code size exceeds the limit
	if err == nil && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}
	// if the contract creation ran out of gas you need to create the account with the given value,
	// but created contracts are not removed.
	if err != nil && (errors.Is(err, ErrCodeStoreOutOfGas) || errors.Is(err, ErrMaxCodeSizeExceeded)) {
		evm.StateDB.SetCode(contractAddr, ret)
	} else if err == nil {
		evm.StateDB.SetCode(contractAddr, ret)
	}
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if !errors.Is(err, ErrExecutionReverted) {
			// In case of a reversion, we need toink the remaining gas.
			// But for anything else, we are left with zero gas available.
			gas = 0
		}
	}
	return ret, contractAddr, gas, err
}
//...
// GetCode returns the code for a given address.
func (evm *EVM) GetCode(address common.Address) []byte {
	return evm.StateDB.GetCode(address)
}

// GetCodeSize returns the code size for a given address.
func (evm *EVM) GetCodeSize(address common.Address) int {
	return evm.StateDB.GetCodeSize(address)
}

// GetCodeHash returns the code hash for a given address.
func (evm *EVM) GetCodeHash(address common.Address) common.Hash {
	return evm.StateDB.GetCodeHash(address)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/p2p/dnsdisc/client.go">
```go
// SyncTree retrieves all nodes from a DNS discovery tree.
func (c *Client) SyncTree(url string) (*Tree, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	// If the client has already seen the tree, reuse it to avoid DOSing the
	// resolver for a previously resolved tree.
	if tree, ok := c.trees[url]; ok {
		return tree, nil
	}
	// Parse the discovery tree address
	link, err := ParseLink(url)
	if err != nil {
		return nil, err
	}
	// Resolve the initial entry point of the discovery tree
	root, err := c.resolveRoot(link)
	if err != nil {
		return nil, err
	}
	// The tree will be filled by walking it.
	tree := &Tree{
		nodes: make(map[enode.ID]*enode.Node),
		links: make(map[string]bool),
		seq:   root.seq,
	}
	err = c.syncAll(tree, root.eroot, root.lroot)
	if err != nil {
		return nil, err
	}
	c.trees[url] = tree
	return tree, nil
}

// syncAll traverses and syncs all the branches of a discovery tree.
func (c *Client) syncAll(t *Tree, hashes ...string) error {
	for len(hashes) > 0 {
		c.log.Trace("Traversing discovery branch", "hashes", hashes)
		next, err := c.syncNext(t, hashes...)
		if err != nil {
			return err
		}
		hashes = next
	}
	return nil
}

// syncNext traverses and syncs the next layer of a discovery tree.
func (c *Client) syncNext(t *Tree, hashes ...string) ([]string, error) {
	var (
		next         []string
		pending, finished = len(hashes), make(chan entry, len(hashes))
		ctx, cancel       = context.WithCancel(context.Background())
	)
	defer cancel()

	for _, hash := range hashes {
		go c.resolveEntry(ctx, t.domain, hash, finished)
	}
	for ; pending > 0; pending-- {
		select {
		case entry := <-finished:
			switch e := entry.(type) {
			case *branchEntry:
				next = append(next, e.children...)
			case *linkEntry:
				t.links[e.str] = true
			case *enrEntry:
				t.nodes[e.node.ID()] = e.node
			}
		case <-time.After(c.cfg.Timeout):
			return nil, context.DeadlineExceeded
		}
	}
	return next, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/p2p/dnsdisc/tree_test.go">
```go
func TestParseRoot(t *testing.T) {
	tests := []struct {
		input string
		e     rootEntry
		err   error
	}{
		{
			input: "enrtree-root:v1 e=TO4Q75OQ2N7DX4EOOR7X66A6OM seq=3 sig=N-YY6UB9xD0hFx1Gmnt7v0RfSxch5tKyry2SRDoLx7B4GfPXagwLxQqyf7gAMvApFn_ORwZQekMWa_pXrcGCtw",
			err:   entryError{"root", errSyntax},
		},
		{
			input: "enrtree-root:v1 e=TO4Q75OQ2N7DX4EOOR7X66A6OM l=TO4Q75OQ2N7DX4EOOR7X66A6OM seq=3 sig=N-YY6UB9xD0hFx1Gmnt7v0RfSxch5tKyry2SRDoLx7B4GfPXagwLxQqyf7gAMvApFn_ORwZQekMWa_pXrcGCtw",
			err:   entryError{"root", errInvalidSig},
		},
		{
			input: "enrtree-root:v1 e=QFT4PBCRX4XQCV3VUYJ6BTCEPU l=JGUFMSAGI7KZYB3P7IZW4S5Y3A seq=3 sig=3FmXuVwpa8Y7OstZTx9PIb1mt8FrW7VpDOFv4AaGCsZ2EIHmhraWhe4NxYhQDlw5MjeFXYMbJjsPeKlHzmJREQE",
			e: rootEntry{
				eroot: "QFT4PBCRX4XQCV3VUYJ6BTCEPU",
				lroot: "JGUFMSAGI7KZYB3P7IZW4S5Y3A",
				seq:   3,
				sig:   hexutil.MustDecode("0xdc5997b95c296bc63b3acb594f1f4f21bd66b7c16b5bb5690ce16fe006860ac6761081e686b69685ee0dc588500e5c393237855d831b263b0f78a947ce62511101"),
			},
		},
	}
	for i, test := range tests {
		e, err := parseRoot(test.input)
		if !reflect.DeepEqual(e, test.e) {
			t.Errorf("test %d: wrong entry %s, want %s", i, spew.Sdump(e), spew.Sdump(test.e))
		}
		if err != test.err {
			t.Errorf("test %d: wrong error %q, want %q", i, err, test.err)
		}
	}
}
```
</file>
</go-ethereum>

---

Excellent request. The concept of an "External Bytecode Manager" is an advanced feature not standard in the EVM, but we can draw parallels from how `go-ethereum` manages contract code, analysis, and execution contexts.

Here are the most relevant code snippets from `go-ethereum` that will help you implement this feature.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// core/vm/contract.go

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments.
type Contract struct {
	// CallerAddress is the result of the caller stack frame and is used to identify
	// the account that called the contract.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	// jumpdests contains the valid jump destinations of the contract code.
	jumpdests destinations 
	// analysis contains code analysis result.
	analysis  atomic.Value 

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	Gas   uint64
	value *big.Int

	// ...
	mutex sync.Mutex
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	contract := &Contract{CallerAddress: caller.Address(), caller: caller, self: object, Gas: gas, value: value}

	// In delegate call, the caller's address is the caller of the caller.
	if evm, ok := caller.(*EVM); ok {
		// ...
	}
	return contract
}

// validJumpdest validates the provided destination for JUMP and JUMPI.
func (c *Contract) validJumpdest(dest *uint256.Int) bool {
	udest, overflow := dest.Uint64WithOverflow()
	// The JUMPDEST location must be within the program bounds.
	if overflow || udest >= uint64(len(c.Code)) {
		return false
	}
	// The JUMPDEST location must be an actual JUMPDEST opcode.
	if OpCode(c.Code[udest]) != JUMPDEST {
		return false
	}
	// The JUMPDEST location must be part of the valid jumpdest analysis.
	// The analysis is performed lazily.
	return c.isCode(udest)
}

// isCode returns true if the provided pc is a valid jump destination.
func (c *Contract) isCode(udest uint64) bool {
	// Analysis is lazily performed, create one if not yet present.
	analysis := c.analysis.Load()
	if analysis == nil {
		// This is the only place where we need to lock access to analysis,
		// because it's the only place where it's created.
		c.mutex.Lock()
		defer c.mutex.Unlock()
		// Another thread might have created it while we were waiting for the lock
		analysis = c.analysis.Load()
		if analysis == nil {
			a := codeAnalysis(c.Code)
			c.analysis.Store(&a)
			analysis = &a
		}
	}
	return analysis.(*destinations).has(udest)
}
```
**Relevance:** The `Contract` struct is go-ethereum's equivalent of an execution context for a piece of code. It holds the bytecode, input, gas, and value. The `validJumpdest` and `isCode` methods demonstrate lazy analysis and verification of bytecode, which is a key part of your `ExternalBytecodeManager` and `BytecodeVerifier` specification.
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// core/vm/analysis.go

// destinations is a map of valid jump destinations.
type destinations map[uint64]struct{}

func (d destinations) has(loc uint64) bool {
	_, ok := d[loc]
	return ok
}

// codeAnalysis performs a single pass over the contract code and returns a
// mapping of valid jump destinations.
func codeAnalysis(code []byte) destinations {
	// The code is not empty, create a new map for the jump destinations.
	dests := make(map[uint64]struct{})
	for i := 0; i < len(code); {
		var op OpCode = OpCode(code[i])
		if op == JUMPDEST {
			dests[uint64(i)] = struct{}{}
		}
		if op >= PUSH1 && op <= PUSH32 {
			i += int(op) - int(PUSH1) + 2
		} else {
			i++
		}
	}
	return dests
}
```
**Relevance:** This is a direct implementation of bytecode analysis. It iterates through the code and identifies valid `JUMPDEST` locations while correctly skipping over the data part of `PUSH` instructions. This is analogous to the `code_bitmap` analysis in your Zig prompt and can be used as a reference for your `BytecodeVerifier`.
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// core/vm/evm.go

// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	// StateDB provides access to the world state
	StateDB StateDB
	// Depth is the call stack depth
	depth int

	// ...
}

// Call executes the contract associated with the destination address.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ...
	// Set up the new stack frame.
	p := NewContract(caller, AccountRef(addr), value, gas)

	// For a call, the code is the destination account's code.
	// But it can be empty, in which case, the EVM will fall back
	// to the default code.
	code := evm.StateDB.GetCode(addr)
	if len(code) == 0 {
		// ...
	} else {
		// In case of a SELFDESTRUCT in the same transaction, the code is actually
		// not empty, but a single STOP instruction. In this case, we should not
		// execute any code.
		if code[0] == SELFDESTRUCT {
			// ...
		}
	}
	p.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), code)
	p.Input = input
	
	// ...
	ret, leftOverGas, err = evm.interpreter.Run(p, nil)
	return ret, leftOverGas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ...
	// Create a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.Code = code
	// ...
	ret, err = evm.interpreter.Run(contract, nil)
	// ...
	// if the contract creation ran successfully and no errors were returned
	// and the code is not empty, create the account in the state with the code
	if err == nil && len(ret) > 0 {
		createDataGas := uint64(len(ret)) * params.CreateDataGas
		if contract.Gas < createDataGas {
			return nil, common.Address{}, 0, ErrCodeStoreOutOfGas
		}
		contract.Gas -= createDataGas
		evm.StateDB.SetCode(contractAddr, ret)
	}
	// ...
}
```
**Relevance:** This demonstrates the VM integration. The `EVM.Call` method is the key entry point. It shows how the VM uses the `StateDB` (your "Loader") to fetch code (`evm.StateDB.GetCode(addr)`) and then creates a `Contract` object to execute it. This is how you would integrate your `ExternalBytecodeManager`.
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// core/state/statedb.go

// StateDB is an EVM database for full state processing.
type StateDB interface {
	CreateAccount(common.Address)

	GetBalance(common.Address) *big.Int
	GetNonce(common.Address) uint64
	
	GetCode(common.Address) []byte
	GetCodeSize(common.Address) int
	GetCodeHash(common.Address) common.Hash

	SetCode(common.Address, []byte)
	SetNonce(common.Address, uint64)

	GetState(common.Address, common.Hash) common.Hash
	SetState(common.Address, common.Hash, common.Hash)

	// ... other methods
}
```
**Relevance:** This `StateDB` interface is the abstraction Geth uses to load data, including code. Your `LoaderRegistry` and various `BytecodeLoader` implementations can be modeled after this pattern, providing a unified `load_bytecode` function to the VM regardless of the underlying source (file, HTTP, IPFS).
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// core/state/state_object.go

// stateObject represents an Ethereum account which is being modified.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.Account
	db       *StateDB

	// Write caches.
	code Code // contract bytecode, which gets stored as health-check against state-sync inconsistencies

	// Cache flags.
	// ...
	dirtyCode bool // true if the code was updated
	// ...
}

// Code returns the contract code associated with this object, also loading from
// the database if necessary.
func (s *stateObject) Code(db Database) []byte {
	if s.code != nil {
		return s.code
	}
	if s.CodeHash() == emptyCodeHash {
		return nil
	}
	code, err := db.ContractCode(s.addrHash, s.CodeHash())
	if err != nil {
		s.setError(fmt.Errorf("can't load code %x for @%x: %v", s.CodeHash(), s.addrHash, err))
		return nil
	}
	s.code = code
	return code
}

// SetCode sets the contract code for the state object.
func (s *stateObject) SetCode(codeHash common.Hash, code []byte) {
	s.setCode(codeHash, code)
}

func (s *stateObject) setCode(codeHash common.Hash, code []byte) {
	s.data.CodeHash = codeHash
	s.code = code
	s.dirtyCode = true
}
```
**Relevance:** The `stateObject` is the Geth equivalent of a cached contract. Its `Code()` method perfectly illustrates the "lazy loading" pattern specified in your prompt. It first checks for a local copy (`s.code`) and only fetches it from the database (`db.ContractCode`) if it's not present. This is a model for your `BytecodeCache`'s interaction with loaders.
</file>
</go-ethereum>

