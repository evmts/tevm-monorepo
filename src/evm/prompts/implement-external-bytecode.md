# Implement External Bytecode

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_external_bytecode` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_external_bytecode feat_implement_external_bytecode`
3. **Work in isolation**: `cd g/feat_implement_external_bytecode`
4. **Commit message**: `🔄 feat: implement external bytecode loading and management for dynamic contract execution`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement a comprehensive external bytecode system that enables dynamic loading, caching, and execution of contract bytecode from external sources. This includes bytecode verification, caching strategies, lazy loading, code signing, and secure execution environments while maintaining performance and security.

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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Security validation** - All external bytecode must be properly verified
3. **Memory safety** - No memory leaks or corruption in bytecode management
4. **Performance validation** - Caching must provide significant performance benefits
5. **Correctness** - Bytecode loading and execution must be reliable
6. **Resource efficiency** - Memory and network usage must be optimized

## References

- [Dynamic Loading](https://en.wikipedia.org/wiki/Dynamic_loading) - Dynamic code loading concepts
- [Caching Strategies](https://en.wikipedia.org/wiki/Cache_replacement_policies) - Cache replacement algorithms
- [Code Signing](https://en.wikipedia.org/wiki/Code_signing) - Digital signature verification
- [Lazy Loading](https://en.wikipedia.org/wiki/Lazy_loading) - Deferred loading patterns
- [Content-Addressable Storage](https://en.wikipedia.org/wiki/Content-addressable_storage) - IPFS and similar systems