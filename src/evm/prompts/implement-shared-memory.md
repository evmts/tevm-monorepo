# Implement Shared Memory

You are implementing Shared Memory for the Tevm EVM written in Zig. Your goal is to implement efficient shared memory management for EVM execution following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_shared_memory` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_shared_memory feat_implement_shared_memory`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a comprehensive shared memory system that enables efficient data sharing between execution contexts, processes, and contracts. This includes memory pools, copy-on-write semantics, inter-process communication, memory mapping, and advanced memory management features while maintaining security isolation and performance optimization.

## ELI5

Imagine a super-advanced cloud storage system for smart contracts. Instead of each contract keeping its own copy of large data files (wasting storage), they can all access shared "cloud folders" with sophisticated features. This enhanced-enhanced version is like having a premium enterprise cloud service with: automatic backup systems that create copies only when needed (copy-on-write), intelligent data placement that puts frequently accessed data in faster storage, advanced security with fine-grained permissions, real-time monitoring that tracks usage patterns, and smart compression that reduces storage costs. Multiple smart contracts can collaborate efficiently on shared data while maintaining complete security isolation and optimal performance.

## Shared Memory Specifications

### Core Shared Memory Framework

#### 1. Shared Memory Manager
```zig
pub const SharedMemoryManager = struct {
    allocator: std.mem.Allocator,
    config: SharedMemoryConfig,
    memory_pools: MemoryPoolRegistry,
    shared_regions: SharedRegionRegistry,
    cow_manager: CopyOnWriteManager,
    access_controller: AccessController,
    performance_tracker: SharedMemoryPerformanceTracker,
    
    pub const SharedMemoryConfig = struct {
        enable_shared_memory: bool,
        max_shared_regions: u32,
        max_region_size: usize,
        enable_copy_on_write: bool,
        enable_memory_mapping: bool,
        enable_ipc: bool,
        security_level: SecurityLevel,
        garbage_collection: GarbageCollectionConfig,
        pool_sizes: PoolSizeConfig,
        
        pub const SecurityLevel = enum {
            None,       // No isolation (development only)
            Basic,      // Basic permission checks
            Strict,     // Full isolation and validation
            Paranoid,   // Maximum security with overhead
        };
        
        pub const GarbageCollectionConfig = struct {
            enable_gc: bool,
            gc_interval_ms: u64,
            gc_threshold_mb: u32,
            eager_cleanup: bool,
        };
        
        pub const PoolSizeConfig = struct {
            small_blocks: usize,    // 64B blocks
            medium_blocks: usize,   // 4KB blocks
            large_blocks: usize,    // 64KB blocks
            huge_blocks: usize,     // 1MB blocks
        };
        
        pub fn production() SharedMemoryConfig {
            return SharedMemoryConfig{
                .enable_shared_memory = true,
                .max_shared_regions = 1024,
                .max_region_size = 64 * 1024 * 1024, // 64MB
                .enable_copy_on_write = true,
                .enable_memory_mapping = true,
                .enable_ipc = true,
                .security_level = .Strict,
                .garbage_collection = GarbageCollectionConfig{
                    .enable_gc = true,
                    .gc_interval_ms = 5000,
                    .gc_threshold_mb = 512,
                    .eager_cleanup = true,
                },
                .pool_sizes = PoolSizeConfig{
                    .small_blocks = 1024,
                    .medium_blocks = 256,
                    .large_blocks = 64,
                    .huge_blocks = 16,
                },
            };
        }
        
        pub fn development() SharedMemoryConfig {
            return SharedMemoryConfig{
                .enable_shared_memory = true,
                .max_shared_regions = 256,
                .max_region_size = 16 * 1024 * 1024, // 16MB
                .enable_copy_on_write = true,
                .enable_memory_mapping = false,
                .enable_ipc = false,
                .security_level = .Basic,
                .garbage_collection = GarbageCollectionConfig{
                    .enable_gc = true,
                    .gc_interval_ms = 10000,
                    .gc_threshold_mb = 128,
                    .eager_cleanup = false,
                },
                .pool_sizes = PoolSizeConfig{
                    .small_blocks = 256,
                    .medium_blocks = 64,
                    .large_blocks = 16,
                    .huge_blocks = 4,
                },
            };
        }
        
        pub fn testing() SharedMemoryConfig {
            return SharedMemoryConfig{
                .enable_shared_memory = true,
                .max_shared_regions = 32,
                .max_region_size = 1024 * 1024, // 1MB
                .enable_copy_on_write = false,
                .enable_memory_mapping = false,
                .enable_ipc = false,
                .security_level = .None,
                .garbage_collection = GarbageCollectionConfig{
                    .enable_gc = false,
                    .gc_interval_ms = 60000,
                    .gc_threshold_mb = 32,
                    .eager_cleanup = true,
                },
                .pool_sizes = PoolSizeConfig{
                    .small_blocks = 64,
                    .medium_blocks = 16,
                    .large_blocks = 4,
                    .huge_blocks = 1,
                },
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: SharedMemoryConfig) !SharedMemoryManager {
        return SharedMemoryManager{
            .allocator = allocator,
            .config = config,
            .memory_pools = try MemoryPoolRegistry.init(allocator, config),
            .shared_regions = try SharedRegionRegistry.init(allocator, config.max_shared_regions),
            .cow_manager = try CopyOnWriteManager.init(allocator, config),
            .access_controller = try AccessController.init(allocator, config.security_level),
            .performance_tracker = SharedMemoryPerformanceTracker.init(),
        };
    }
    
    pub fn deinit(self: *SharedMemoryManager) void {
        self.memory_pools.deinit();
        self.shared_regions.deinit();
        self.cow_manager.deinit();
        self.access_controller.deinit();
    }
    
    pub fn create_shared_region(
        self: *SharedMemoryManager,
        name: []const u8,
        size: usize,
        permissions: AccessPermissions,
        options: SharedRegionOptions
    ) !SharedRegionHandle {
        if (!self.config.enable_shared_memory) {
            return error.SharedMemoryDisabled;
        }
        
        // Validate size limits
        if (size > self.config.max_region_size) {
            return error.RegionTooLarge;
        }
        
        // Check if we can create more regions
        if (self.shared_regions.count() >= self.config.max_shared_regions) {
            return error.TooManySharedRegions;
        }
        
        // Create the shared region
        const region = try SharedRegion.create(
            self.allocator,
            name,
            size,
            permissions,
            options
        );
        
        // Register with access controller
        try self.access_controller.register_region(&region, permissions);
        
        // Register in the registry
        const handle = try self.shared_regions.register(region);
        
        // Track performance
        self.performance_tracker.record_region_creation(size);
        
        return handle;
    }
    
    pub fn map_shared_region(
        self: *SharedMemoryManager,
        handle: SharedRegionHandle,
        context_id: u64,
        mapping_options: MappingOptions
    ) !*SharedRegion {
        const region = self.shared_regions.get(handle) orelse {
            return error.InvalidRegionHandle;
        };
        
        // Check access permissions
        try self.access_controller.check_access(region, context_id, .Read);
        
        // Apply copy-on-write if enabled and needed
        if (self.config.enable_copy_on_write and mapping_options.copy_on_write) {
            return try self.cow_manager.create_cow_mapping(region, context_id);
        }
        
        // Direct mapping
        try region.add_mapping(context_id, mapping_options);
        self.performance_tracker.record_mapping();
        
        return region;
    }
    
    pub fn unmap_shared_region(
        self: *SharedMemoryManager,
        handle: SharedRegionHandle,
        context_id: u64
    ) !void {
        const region = self.shared_regions.get(handle) orelse {
            return error.InvalidRegionHandle;
        };
        
        // Remove mapping
        try region.remove_mapping(context_id);
        
        // Clean up COW resources if applicable
        if (self.config.enable_copy_on_write) {
            try self.cow_manager.cleanup_mapping(region, context_id);
        }
        
        self.performance_tracker.record_unmapping();
    }
    
    pub fn allocate_from_pool(
        self: *SharedMemoryManager,
        size: usize,
        pool_type: PoolType
    ) ![]u8 {
        return try self.memory_pools.allocate(size, pool_type);
    }
    
    pub fn deallocate_to_pool(
        self: *SharedMemoryManager,
        memory: []u8,
        pool_type: PoolType
    ) void {
        self.memory_pools.deallocate(memory, pool_type);
    }
    
    pub fn garbage_collect(self: *SharedMemoryManager) !void {
        if (!self.config.garbage_collection.enable_gc) return;
        
        const start_time = std.time.milliTimestamp();
        
        // Clean up unused regions
        try self.shared_regions.cleanup_unused();
        
        // Clean up COW pages
        if (self.config.enable_copy_on_write) {
            try self.cow_manager.garbage_collect();
        }
        
        // Compact memory pools
        try self.memory_pools.compact();
        
        const gc_time = std.time.milliTimestamp() - start_time;
        self.performance_tracker.record_garbage_collection(@intCast(gc_time));
    }
    
    pub fn get_memory_stats(self: *const SharedMemoryManager) MemoryStats {
        return MemoryStats{
            .total_shared_memory = self.shared_regions.get_total_size(),
            .active_regions = self.shared_regions.count(),
            .cow_pages = if (self.config.enable_copy_on_write) 
                self.cow_manager.get_active_pages() else 0,
            .pool_utilization = self.memory_pools.get_utilization(),
            .fragmentation_ratio = self.memory_pools.get_fragmentation_ratio(),
        };
    }
    
    pub const SharedRegionOptions = struct {
        copy_on_write: bool,
        auto_grow: bool,
        persistent: bool,
        compression: CompressionType,
        
        pub const CompressionType = enum {
            None,
            LZ4,
            Zstd,
        };
    };
    
    pub const MappingOptions = struct {
        copy_on_write: bool,
        read_only: bool,
        lazy_loading: bool,
        prefetch: bool,
    };
    
    pub const MemoryStats = struct {
        total_shared_memory: usize,
        active_regions: u32,
        cow_pages: u32,
        pool_utilization: f64,
        fragmentation_ratio: f64,
    };
};
```

#### 2. Shared Region Implementation
```zig
pub const SharedRegion = struct {
    allocator: std.mem.Allocator,
    name: []const u8,
    data: []u8,
    size: usize,
    permissions: AccessPermissions,
    mappings: std.HashMap(u64, MappingInfo, ContextHashContext, std.hash_map.default_max_load_percentage),
    reference_count: std.atomic.Atomic(u32),
    creation_time: i64,
    last_access_time: std.atomic.Atomic(i64),
    is_dirty: std.atomic.Atomic(bool),
    lock: std.Thread.RwLock,
    
    pub const MappingInfo = struct {
        context_id: u64,
        permissions: AccessPermissions,
        offset: usize,
        size: usize,
        mapping_time: i64,
        access_count: u64,
        copy_on_write: bool,
    };
    
    pub fn create(
        allocator: std.mem.Allocator,
        name: []const u8,
        size: usize,
        permissions: AccessPermissions,
        options: SharedMemoryManager.SharedRegionOptions
    ) !SharedRegion {
        const name_copy = try allocator.dupe(u8, name);
        const data = try allocator.alignedAlloc(u8, 4096, size); // Page-aligned
        
        // Initialize data to zero
        @memset(data, 0);
        
        return SharedRegion{
            .allocator = allocator,
            .name = name_copy,
            .data = data,
            .size = size,
            .permissions = permissions,
            .mappings = std.HashMap(u64, MappingInfo, ContextHashContext, std.hash_map.default_max_load_percentage).init(allocator),
            .reference_count = std.atomic.Atomic(u32).init(0),
            .creation_time = std.time.milliTimestamp(),
            .last_access_time = std.atomic.Atomic(i64).init(std.time.milliTimestamp()),
            .is_dirty = std.atomic.Atomic(bool).init(false),
            .lock = std.Thread.RwLock{},
        };
    }
    
    pub fn deinit(self: *SharedRegion) void {
        self.lock.lock();
        defer self.lock.unlock();
        
        self.allocator.free(self.name);
        self.allocator.free(self.data);
        self.mappings.deinit();
    }
    
    pub fn add_mapping(
        self: *SharedRegion,
        context_id: u64,
        options: SharedMemoryManager.MappingOptions
    ) !void {
        self.lock.lock();
        defer self.lock.unlock();
        
        const mapping = MappingInfo{
            .context_id = context_id,
            .permissions = if (options.read_only) 
                AccessPermissions{ .read = true, .write = false, .execute = false }
            else
                self.permissions,
            .offset = 0,
            .size = self.size,
            .mapping_time = std.time.milliTimestamp(),
            .access_count = 0,
            .copy_on_write = options.copy_on_write,
        };
        
        try self.mappings.put(context_id, mapping);
        _ = self.reference_count.fetchAdd(1, .SeqCst);
    }
    
    pub fn remove_mapping(self: *SharedRegion, context_id: u64) !void {
        self.lock.lock();
        defer self.lock.unlock();
        
        if (self.mappings.remove(context_id)) {
            _ = self.reference_count.fetchSub(1, .SeqCst);
        } else {
            return error.MappingNotFound;
        }
    }
    
    pub fn read_data(
        self: *SharedRegion,
        context_id: u64,
        offset: usize,
        buffer: []u8
    ) !usize {
        self.lock.lockShared();
        defer self.lock.unlockShared();
        
        // Check mapping exists and has read permission
        const mapping = self.mappings.get(context_id) orelse {
            return error.NoMapping;
        };
        
        if (!mapping.permissions.read) {
            return error.NoReadPermission;
        }
        
        // Validate bounds
        if (offset >= self.size) {
            return error.OffsetOutOfBounds;
        }
        
        const available = self.size - offset;
        const to_read = @min(buffer.len, available);
        
        // Copy data
        @memcpy(buffer[0..to_read], self.data[offset..offset + to_read]);
        
        // Update access tracking
        self.last_access_time.store(std.time.milliTimestamp(), .SeqCst);
        
        return to_read;
    }
    
    pub fn write_data(
        self: *SharedRegion,
        context_id: u64,
        offset: usize,
        data: []const u8
    ) !usize {
        self.lock.lock();
        defer self.lock.unlock();
        
        // Check mapping exists and has write permission
        const mapping = self.mappings.getPtr(context_id) orelse {
            return error.NoMapping;
        };
        
        if (!mapping.permissions.write) {
            return error.NoWritePermission;
        }
        
        // Validate bounds
        if (offset >= self.size) {
            return error.OffsetOutOfBounds;
        }
        
        const available = self.size - offset;
        const to_write = @min(data.len, available);
        
        // Copy data
        @memcpy(self.data[offset..offset + to_write], data[0..to_write]);
        
        // Update tracking
        self.last_access_time.store(std.time.milliTimestamp(), .SeqCst);
        self.is_dirty.store(true, .SeqCst);
        mapping.access_count += 1;
        
        return to_write;
    }
    
    pub fn copy_data(
        self: *SharedRegion,
        context_id: u64,
        dest_offset: usize,
        src_offset: usize,
        size: usize
    ) !void {
        self.lock.lock();
        defer self.lock.unlock();
        
        // Check mapping and permissions
        const mapping = self.mappings.get(context_id) orelse {
            return error.NoMapping;
        };
        
        if (!mapping.permissions.read or !mapping.permissions.write) {
            return error.InsufficientPermissions;
        }
        
        // Validate bounds
        if (src_offset + size > self.size or dest_offset + size > self.size) {
            return error.OffsetOutOfBounds;
        }
        
        // Handle overlapping regions
        if (dest_offset < src_offset + size and src_offset < dest_offset + size) {
            // Use memmove for overlapping regions
            std.mem.copyBackwards(u8, 
                self.data[dest_offset..dest_offset + size],
                self.data[src_offset..src_offset + size]
            );
        } else {
            // Use memcpy for non-overlapping regions
            @memcpy(
                self.data[dest_offset..dest_offset + size],
                self.data[src_offset..src_offset + size]
            );
        }
        
        // Update tracking
        self.last_access_time.store(std.time.milliTimestamp(), .SeqCst);
        self.is_dirty.store(true, .SeqCst);
    }
    
    pub fn get_reference_count(self: *const SharedRegion) u32 {
        return self.reference_count.load(.SeqCst);
    }
    
    pub fn is_unused(self: *const SharedRegion) bool {
        return self.get_reference_count() == 0;
    }
    
    pub fn get_memory_usage(self: *const SharedRegion) usize {
        return self.size + self.name.len + @sizeOf(SharedRegion);
    }
    
    pub const ContextHashContext = struct {
        pub fn hash(self: @This(), key: u64) u64 {
            _ = self;
            return key;
        }
        
        pub fn eql(self: @This(), a: u64, b: u64) bool {
            _ = self;
            return a == b;
        }
    };
};

pub const AccessPermissions = struct {
    read: bool,
    write: bool,
    execute: bool,
    
    pub fn read_only() AccessPermissions {
        return AccessPermissions{ .read = true, .write = false, .execute = false };
    }
    
    pub fn read_write() AccessPermissions {
        return AccessPermissions{ .read = true, .write = true, .execute = false };
    }
    
    pub fn full_access() AccessPermissions {
        return AccessPermissions{ .read = true, .write = true, .execute = true };
    }
};
```

#### 3. Copy-on-Write Manager
```zig
pub const CopyOnWriteManager = struct {
    allocator: std.mem.Allocator,
    config: SharedMemoryManager.SharedMemoryConfig,
    cow_pages: std.HashMap(u64, CowPage, CowPageContext, std.hash_map.default_max_load_percentage),
    page_size: usize,
    total_cow_memory: std.atomic.Atomic(usize),
    
    pub const CowPage = struct {
        original_region: *SharedRegion,
        context_id: u64,
        page_offset: usize,
        private_data: []u8,
        is_dirty: bool,
        creation_time: i64,
        access_count: u64,
        
        pub fn init(
            allocator: std.mem.Allocator,
            original_region: *SharedRegion,
            context_id: u64,
            page_offset: usize,
            page_size: usize
        ) !CowPage {
            const private_data = try allocator.alignedAlloc(u8, 4096, page_size);
            
            // Copy original data
            const source_end = @min(page_offset + page_size, original_region.size);
            const copy_size = source_end - page_offset;
            
            if (copy_size > 0) {
                @memcpy(
                    private_data[0..copy_size],
                    original_region.data[page_offset..source_end]
                );
            }
            
            // Zero any remaining space
            if (copy_size < page_size) {
                @memset(private_data[copy_size..], 0);
            }
            
            return CowPage{
                .original_region = original_region,
                .context_id = context_id,
                .page_offset = page_offset,
                .private_data = private_data,
                .is_dirty = false,
                .creation_time = std.time.milliTimestamp(),
                .access_count = 0,
            };
        }
        
        pub fn deinit(self: *CowPage, allocator: std.mem.Allocator) void {
            allocator.free(self.private_data);
        }
        
        pub fn get_page_id(context_id: u64, region_id: u32, page_offset: usize) u64 {
            return (@as(u64, context_id) << 32) | (@as(u64, region_id) << 16) | @as(u64, page_offset >> 12);
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: SharedMemoryManager.SharedMemoryConfig) !CopyOnWriteManager {
        return CopyOnWriteManager{
            .allocator = allocator,
            .config = config,
            .cow_pages = std.HashMap(u64, CowPage, CowPageContext, std.hash_map.default_max_load_percentage).init(allocator),
            .page_size = 4096, // 4KB pages
            .total_cow_memory = std.atomic.Atomic(usize).init(0),
        };
    }
    
    pub fn deinit(self: *CopyOnWriteManager) void {
        var iterator = self.cow_pages.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.deinit(self.allocator);
        }
        self.cow_pages.deinit();
    }
    
    pub fn create_cow_mapping(
        self: *CopyOnWriteManager,
        region: *SharedRegion,
        context_id: u64
    ) !*SharedRegion {
        // For COW, we create a virtual mapping that triggers page faults on writes
        // This implementation simulates COW behavior
        
        // Add COW mapping to the region
        const mapping_options = SharedMemoryManager.MappingOptions{
            .copy_on_write = true,
            .read_only = false,
            .lazy_loading = true,
            .prefetch = false,
        };
        
        try region.add_mapping(context_id, mapping_options);
        return region;
    }
    
    pub fn handle_write_fault(
        self: *CopyOnWriteManager,
        region: *SharedRegion,
        context_id: u64,
        offset: usize
    ) ![]u8 {
        // Calculate page offset
        const page_offset = (offset / self.page_size) * self.page_size;
        const page_id = CowPage.get_page_id(context_id, 0, page_offset); // Simplified region ID
        
        // Check if COW page already exists
        if (self.cow_pages.getPtr(page_id)) |cow_page| {
            cow_page.access_count += 1;
            return cow_page.private_data;
        }
        
        // Create new COW page
        var cow_page = try CowPage.init(
            self.allocator,
            region,
            context_id,
            page_offset,
            self.page_size
        );
        
        try self.cow_pages.put(page_id, cow_page);
        _ = self.total_cow_memory.fetchAdd(self.page_size, .SeqCst);
        
        return cow_page.private_data;
    }
    
    pub fn cleanup_mapping(
        self: *CopyOnWriteManager,
        region: *SharedRegion,
        context_id: u64
    ) !void {
        // Remove all COW pages for this context/region combination
        var pages_to_remove = std.ArrayList(u64).init(self.allocator);
        defer pages_to_remove.deinit();
        
        var iterator = self.cow_pages.iterator();
        while (iterator.next()) |entry| {
            if (entry.value_ptr.context_id == context_id and entry.value_ptr.original_region == region) {
                try pages_to_remove.append(entry.key_ptr.*);
            }
        }
        
        for (pages_to_remove.items) |page_id| {
            if (self.cow_pages.fetchRemove(page_id)) |removed| {
                removed.value.deinit(self.allocator);
                _ = self.total_cow_memory.fetchSub(self.page_size, .SeqCst);
            }
        }
    }
    
    pub fn garbage_collect(self: *CopyOnWriteManager) !void {
        const current_time = std.time.milliTimestamp();
        const max_age_ms = 5 * 60 * 1000; // 5 minutes
        
        var pages_to_remove = std.ArrayList(u64).init(self.allocator);
        defer pages_to_remove.deinit();
        
        var iterator = self.cow_pages.iterator();
        while (iterator.next()) |entry| {
            const cow_page = entry.value_ptr;
            
            // Remove old, unused pages
            if (current_time - cow_page.creation_time > max_age_ms and cow_page.access_count == 0) {
                try pages_to_remove.append(entry.key_ptr.*);
            }
        }
        
        for (pages_to_remove.items) |page_id| {
            if (self.cow_pages.fetchRemove(page_id)) |removed| {
                removed.value.deinit(self.allocator);
                _ = self.total_cow_memory.fetchSub(self.page_size, .SeqCst);
            }
        }
    }
    
    pub fn get_active_pages(self: *const CopyOnWriteManager) u32 {
        return @intCast(self.cow_pages.count());
    }
    
    pub fn get_total_cow_memory(self: *const CopyOnWriteManager) usize {
        return self.total_cow_memory.load(.SeqCst);
    }
    
    pub const CowPageContext = struct {
        pub fn hash(self: @This(), key: u64) u64 {
            _ = self;
            return key;
        }
        
        pub fn eql(self: @This(), a: u64, b: u64) bool {
            _ = self;
            return a == b;
        }
    };
};
```

#### 4. Memory Pool Registry
```zig
pub const MemoryPoolRegistry = struct {
    allocator: std.mem.Allocator,
    small_pool: MemoryPool,
    medium_pool: MemoryPool,
    large_pool: MemoryPool,
    huge_pool: MemoryPool,
    
    pub fn init(allocator: std.mem.Allocator, config: SharedMemoryManager.SharedMemoryConfig) !MemoryPoolRegistry {
        return MemoryPoolRegistry{
            .allocator = allocator,
            .small_pool = try MemoryPool.init(allocator, 64, config.pool_sizes.small_blocks),
            .medium_pool = try MemoryPool.init(allocator, 4096, config.pool_sizes.medium_blocks),
            .large_pool = try MemoryPool.init(allocator, 65536, config.pool_sizes.large_blocks),
            .huge_pool = try MemoryPool.init(allocator, 1048576, config.pool_sizes.huge_blocks),
        };
    }
    
    pub fn deinit(self: *MemoryPoolRegistry) void {
        self.small_pool.deinit();
        self.medium_pool.deinit();
        self.large_pool.deinit();
        self.huge_pool.deinit();
    }
    
    pub fn allocate(self: *MemoryPoolRegistry, size: usize, pool_type: PoolType) ![]u8 {
        return switch (pool_type) {
            .Small => try self.small_pool.allocate(),
            .Medium => try self.medium_pool.allocate(),
            .Large => try self.large_pool.allocate(),
            .Huge => try self.huge_pool.allocate(),
            .Auto => try self.allocate_auto(size),
        };
    }
    
    pub fn deallocate(self: *MemoryPoolRegistry, memory: []u8, pool_type: PoolType) void {
        switch (pool_type) {
            .Small => self.small_pool.deallocate(memory),
            .Medium => self.medium_pool.deallocate(memory),
            .Large => self.large_pool.deallocate(memory),
            .Huge => self.huge_pool.deallocate(memory),
            .Auto => self.deallocate_auto(memory),
        }
    }
    
    fn allocate_auto(self: *MemoryPoolRegistry, size: usize) ![]u8 {
        if (size <= 64) {
            return try self.small_pool.allocate();
        } else if (size <= 4096) {
            return try self.medium_pool.allocate();
        } else if (size <= 65536) {
            return try self.large_pool.allocate();
        } else {
            return try self.huge_pool.allocate();
        }
    }
    
    fn deallocate_auto(self: *MemoryPoolRegistry, memory: []u8) void {
        const size = memory.len;
        if (size <= 64) {
            self.small_pool.deallocate(memory);
        } else if (size <= 4096) {
            self.medium_pool.deallocate(memory);
        } else if (size <= 65536) {
            self.large_pool.deallocate(memory);
        } else {
            self.huge_pool.deallocate(memory);
        }
    }
    
    pub fn compact(self: *MemoryPoolRegistry) !void {
        try self.small_pool.compact();
        try self.medium_pool.compact();
        try self.large_pool.compact();
        try self.huge_pool.compact();
    }
    
    pub fn get_utilization(self: *const MemoryPoolRegistry) f64 {
        const total_allocated = self.small_pool.get_allocated_count() * 64 +
                               self.medium_pool.get_allocated_count() * 4096 +
                               self.large_pool.get_allocated_count() * 65536 +
                               self.huge_pool.get_allocated_count() * 1048576;
        
        const total_capacity = self.small_pool.get_capacity() * 64 +
                              self.medium_pool.get_capacity() * 4096 +
                              self.large_pool.get_capacity() * 65536 +
                              self.huge_pool.get_capacity() * 1048576;
        
        if (total_capacity == 0) return 0.0;
        return @as(f64, @floatFromInt(total_allocated)) / @as(f64, @floatFromInt(total_capacity));
    }
    
    pub fn get_fragmentation_ratio(self: *const MemoryPoolRegistry) f64 {
        // Simplified fragmentation calculation
        const small_frag = self.small_pool.get_fragmentation();
        const medium_frag = self.medium_pool.get_fragmentation();
        const large_frag = self.large_pool.get_fragmentation();
        const huge_frag = self.huge_pool.get_fragmentation();
        
        return (small_frag + medium_frag + large_frag + huge_frag) / 4.0;
    }
};

pub const PoolType = enum {
    Small,    // 64B blocks
    Medium,   // 4KB blocks
    Large,    // 64KB blocks
    Huge,     // 1MB blocks
    Auto,     // Automatically select based on size
};

pub const MemoryPool = struct {
    allocator: std.mem.Allocator,
    block_size: usize,
    capacity: u32,
    free_blocks: std.ArrayList([]u8),
    allocated_blocks: std.HashMap(usize, []u8, PointerHashContext, std.hash_map.default_max_load_percentage),
    total_allocations: u64,
    total_deallocations: u64,
    
    pub fn init(allocator: std.mem.Allocator, block_size: usize, capacity: u32) !MemoryPool {
        var pool = MemoryPool{
            .allocator = allocator,
            .block_size = block_size,
            .capacity = capacity,
            .free_blocks = std.ArrayList([]u8).init(allocator),
            .allocated_blocks = std.HashMap(usize, []u8, PointerHashContext, std.hash_map.default_max_load_percentage).init(allocator),
            .total_allocations = 0,
            .total_deallocations = 0,
        };
        
        // Pre-allocate blocks
        try pool.free_blocks.ensureTotalCapacity(capacity);
        for (0..capacity) |_| {
            const block = try allocator.alignedAlloc(u8, 4096, block_size);
            try pool.free_blocks.append(block);
        }
        
        return pool;
    }
    
    pub fn deinit(self: *MemoryPool) void {
        // Free all blocks
        for (self.free_blocks.items) |block| {
            self.allocator.free(block);
        }
        
        var iterator = self.allocated_blocks.iterator();
        while (iterator.next()) |entry| {
            self.allocator.free(entry.value_ptr.*);
        }
        
        self.free_blocks.deinit();
        self.allocated_blocks.deinit();
    }
    
    pub fn allocate(self: *MemoryPool) ![]u8 {
        if (self.free_blocks.items.len == 0) {
            return error.PoolExhausted;
        }
        
        const block = self.free_blocks.pop();
        const block_addr = @intFromPtr(block.ptr);
        
        try self.allocated_blocks.put(block_addr, block);
        self.total_allocations += 1;
        
        return block;
    }
    
    pub fn deallocate(self: *MemoryPool, memory: []u8) void {
        const block_addr = @intFromPtr(memory.ptr);
        
        if (self.allocated_blocks.fetchRemove(block_addr)) |entry| {
            // Zero the memory for security
            @memset(entry.value, 0);
            
            self.free_blocks.append(entry.value) catch {
                // If we can't add back to free list, just leak it
                // This is better than corruption
            };
            
            self.total_deallocations += 1;
        }
    }
    
    pub fn compact(self: *MemoryPool) !void {
        // For a simple pool, compaction might involve
        // reorganizing free blocks for better cache locality
        // This is a simplified implementation
        
        // Sort free blocks by address for better locality
        const sortFn = struct {
            fn lessThan(context: void, a: []u8, b: []u8) bool {
                _ = context;
                return @intFromPtr(a.ptr) < @intFromPtr(b.ptr);
            }
        }.lessThan;
        
        std.sort.pdq([]u8, self.free_blocks.items, {}, sortFn);
    }
    
    pub fn get_allocated_count(self: *const MemoryPool) u32 {
        return @intCast(self.allocated_blocks.count());
    }
    
    pub fn get_capacity(self: *const MemoryPool) u32 {
        return self.capacity;
    }
    
    pub fn get_fragmentation(self: *const MemoryPool) f64 {
        const free_blocks = self.free_blocks.items.len;
        const total_blocks = self.capacity;
        
        if (total_blocks == 0) return 0.0;
        
        // Simple fragmentation metric: ratio of free blocks to total
        // Lower values indicate higher fragmentation
        return @as(f64, @floatFromInt(free_blocks)) / @as(f64, @floatFromInt(total_blocks));
    }
    
    pub const PointerHashContext = struct {
        pub fn hash(self: @This(), key: usize) u64 {
            _ = self;
            return key;
        }
        
        pub fn eql(self: @This(), a: usize, b: usize) bool {
            _ = self;
            return a == b;
        }
    };
};
```

#### 5. Performance Tracking
```zig
pub const SharedMemoryPerformanceTracker = struct {
    region_creations: u64,
    region_destructions: u64,
    mappings: u64,
    unmappings: u64,
    reads: u64,
    writes: u64,
    copies: u64,
    cow_faults: u64,
    gc_runs: u64,
    total_gc_time_ms: u64,
    
    total_bytes_read: u64,
    total_bytes_written: u64,
    peak_memory_usage: u64,
    current_memory_usage: std.atomic.Atomic(u64),
    
    pub fn init() SharedMemoryPerformanceTracker {
        return std.mem.zeroes(SharedMemoryPerformanceTracker);
    }
    
    pub fn record_region_creation(self: *SharedMemoryPerformanceTracker, size: usize) void {
        self.region_creations += 1;
        _ = self.current_memory_usage.fetchAdd(size, .SeqCst);
        self.update_peak_memory();
    }
    
    pub fn record_region_destruction(self: *SharedMemoryPerformanceTracker, size: usize) void {
        self.region_destructions += 1;
        _ = self.current_memory_usage.fetchSub(size, .SeqCst);
    }
    
    pub fn record_mapping(self: *SharedMemoryPerformanceTracker) void {
        self.mappings += 1;
    }
    
    pub fn record_unmapping(self: *SharedMemoryPerformanceTracker) void {
        self.unmappings += 1;
    }
    
    pub fn record_read(self: *SharedMemoryPerformanceTracker, bytes: usize) void {
        self.reads += 1;
        self.total_bytes_read += bytes;
    }
    
    pub fn record_write(self: *SharedMemoryPerformanceTracker, bytes: usize) void {
        self.writes += 1;
        self.total_bytes_written += bytes;
    }
    
    pub fn record_copy(self: *SharedMemoryPerformanceTracker) void {
        self.copies += 1;
    }
    
    pub fn record_cow_fault(self: *SharedMemoryPerformanceTracker) void {
        self.cow_faults += 1;
    }
    
    pub fn record_garbage_collection(self: *SharedMemoryPerformanceTracker, time_ms: u64) void {
        self.gc_runs += 1;
        self.total_gc_time_ms += time_ms;
    }
    
    fn update_peak_memory(self: *SharedMemoryPerformanceTracker) void {
        const current = self.current_memory_usage.load(.SeqCst);
        if (current > self.peak_memory_usage) {
            self.peak_memory_usage = current;
        }
    }
    
    pub fn get_metrics(self: *const SharedMemoryPerformanceTracker) Metrics {
        return Metrics{
            .region_creations = self.region_creations,
            .region_destructions = self.region_destructions,
            .active_regions = self.region_creations - self.region_destructions,
            .total_mappings = self.mappings,
            .total_unmappings = self.unmappings,
            .total_reads = self.reads,
            .total_writes = self.writes,
            .total_copies = self.copies,
            .cow_faults = self.cow_faults,
            .gc_runs = self.gc_runs,
            .average_gc_time_ms = if (self.gc_runs > 0) 
                @as(f64, @floatFromInt(self.total_gc_time_ms)) / @as(f64, @floatFromInt(self.gc_runs))
            else 0.0,
            .total_bytes_read = self.total_bytes_read,
            .total_bytes_written = self.total_bytes_written,
            .current_memory_usage = self.current_memory_usage.load(.SeqCst),
            .peak_memory_usage = self.peak_memory_usage,
            .read_write_ratio = if (self.writes > 0)
                @as(f64, @floatFromInt(self.reads)) / @as(f64, @floatFromInt(self.writes))
            else if (self.reads > 0) std.math.inf(f64) else 0.0,
        };
    }
    
    pub const Metrics = struct {
        region_creations: u64,
        region_destructions: u64,
        active_regions: u64,
        total_mappings: u64,
        total_unmappings: u64,
        total_reads: u64,
        total_writes: u64,
        total_copies: u64,
        cow_faults: u64,
        gc_runs: u64,
        average_gc_time_ms: f64,
        total_bytes_read: u64,
        total_bytes_written: u64,
        current_memory_usage: u64,
        peak_memory_usage: u64,
        read_write_ratio: f64,
    };
};
```

## Implementation Requirements

### Core Functionality
1. **Shared Memory Regions**: Create, map, and manage shared memory regions efficiently
2. **Copy-on-Write**: Implement COW semantics for memory efficiency and isolation
3. **Memory Pools**: Pre-allocated memory pools for different block sizes
4. **Access Control**: Permission-based access control with security validation
5. **Performance Optimization**: Memory pool optimization and garbage collection
6. **Inter-Process Communication**: Enable efficient data sharing between contexts

## Implementation Tasks

### Task 1: Implement Shared Memory Opcodes
File: `/src/evm/execution/shared_memory.zig`
```zig
const std = @import("std");
const SharedMemoryManager = @import("../shared_memory/shared_memory_manager.zig").SharedMemoryManager;

pub fn execute_shared_alloc(context: *ExecutionContext, manager: *SharedMemoryManager) !void {
    // Get allocation size from stack
    const size = try context.stack.pop();
    const size_usize = @as(usize, @intCast(size & 0xFFFFFFFF));
    
    // Get pool type from stack
    const pool_type_raw = try context.stack.pop();
    const pool_type: PoolType = switch (pool_type_raw & 0xFF) {
        0 => .Small,
        1 => .Medium,
        2 => .Large,
        3 => .Huge,
        else => .Auto,
    };
    
    // Allocate from pool
    const memory = try manager.allocate_from_pool(size_usize, pool_type);
    
    // Return memory address (simplified - would use proper address mapping)
    const address = @intFromPtr(memory.ptr);
    try context.stack.push(@as(u256, address));
    
    // Consume gas
    try context.consume_gas(100 + size_usize / 32);
}

pub fn execute_shared_free(context: *ExecutionContext, manager: *SharedMemoryManager) !void {
    // Get memory address from stack
    const address = try context.stack.pop();
    const size = try context.stack.pop();
    
    // Get pool type from stack
    const pool_type_raw = try context.stack.pop();
    const pool_type: PoolType = switch (pool_type_raw & 0xFF) {
        0 => .Small,
        1 => .Medium,
        2 => .Large,
        3 => .Huge,
        else => .Auto,
    };
    
    // Convert address back to slice (simplified)
    const memory_ptr = @as([*]u8, @ptrFromInt(@as(usize, @intCast(address))));
    const memory_slice = memory_ptr[0..@as(usize, @intCast(size))];
    
    // Deallocate to pool
    manager.deallocate_to_pool(memory_slice, pool_type);
    
    // Consume gas
    try context.consume_gas(50);
}

pub fn execute_shared_map(context: *ExecutionContext, manager: *SharedMemoryManager) !void {
    // Get region handle from stack
    const handle_raw = try context.stack.pop();
    const handle = SharedRegionHandle{ .id = @as(u32, @intCast(handle_raw & 0xFFFFFFFF)) };
    
    // Get mapping options from stack
    const options_raw = try context.stack.pop();
    const mapping_options = MappingOptions{
        .copy_on_write = (options_raw & 0x1) != 0,
        .read_only = (options_raw & 0x2) != 0,
        .lazy_loading = (options_raw & 0x4) != 0,
        .prefetch = (options_raw & 0x8) != 0,
    };
    
    // Map region for current context
    const region = try manager.map_shared_region(handle, context.context_id, mapping_options);
    
    // Return region address
    const region_address = @intFromPtr(region.data.ptr);
    try context.stack.push(@as(u256, region_address));
    
    // Consume gas
    try context.consume_gas(200);
}

pub fn execute_shared_read(context: *ExecutionContext, manager: *SharedMemoryManager) !void {
    // Get parameters from stack
    const handle_raw = try context.stack.pop();
    const offset = try context.stack.pop();
    const size = try context.stack.pop();
    const dest_ptr = try context.stack.pop();
    
    const handle = SharedRegionHandle{ .id = @as(u32, @intCast(handle_raw & 0xFFFFFFFF)) };
    
    // Get the mapped region
    const region = manager.shared_regions.get(handle) orelse {
        return error.InvalidRegionHandle;
    };
    
    // Create buffer for reading
    const read_size = @as(usize, @intCast(size & 0xFFFFFFFF));
    var buffer = try context.allocator.alloc(u8, read_size);
    defer context.allocator.free(buffer);
    
    // Read from shared region
    const bytes_read = try region.read_data(
        context.context_id,
        @as(usize, @intCast(offset & 0xFFFFFFFF)),
        buffer
    );
    
    // Copy to destination in memory (simplified)
    const dest_memory_ptr = @as([*]u8, @ptrFromInt(@as(usize, @intCast(dest_ptr))));
    @memcpy(dest_memory_ptr[0..bytes_read], buffer[0..bytes_read]);
    
    // Return bytes read
    try context.stack.push(@as(u256, bytes_read));
    
    // Consume gas
    try context.consume_gas(50 + bytes_read / 32);
}

pub fn execute_shared_write(context: *ExecutionContext, manager: *SharedMemoryManager) !void {
    // Get parameters from stack
    const handle_raw = try context.stack.pop();
    const offset = try context.stack.pop();
    const size = try context.stack.pop();
    const src_ptr = try context.stack.pop();
    
    const handle = SharedRegionHandle{ .id = @as(u32, @intCast(handle_raw & 0xFFFFFFFF)) };
    
    // Get the mapped region
    const region = manager.shared_regions.get(handle) orelse {
        return error.InvalidRegionHandle;
    };
    
    // Get source data (simplified)
    const write_size = @as(usize, @intCast(size & 0xFFFFFFFF));
    const src_memory_ptr = @as([*]const u8, @ptrFromInt(@as(usize, @intCast(src_ptr))));
    const src_data = src_memory_ptr[0..write_size];
    
    // Write to shared region
    const bytes_written = try region.write_data(
        context.context_id,
        @as(usize, @intCast(offset & 0xFFFFFFFF)),
        src_data
    );
    
    // Return bytes written
    try context.stack.push(@as(u256, bytes_written));
    
    // Consume gas
    try context.consume_gas(100 + bytes_written / 32);
}
```

### Task 2: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const SharedMemoryManager = @import("shared_memory/shared_memory_manager.zig").SharedMemoryManager;

pub const Vm = struct {
    // Existing fields...
    shared_memory_manager: ?SharedMemoryManager,
    shared_memory_enabled: bool,
    
    pub fn enable_shared_memory(self: *Vm, config: SharedMemoryManager.SharedMemoryConfig) !void {
        self.shared_memory_manager = try SharedMemoryManager.init(self.allocator, config);
        self.shared_memory_enabled = true;
    }
    
    pub fn disable_shared_memory(self: *Vm) void {
        if (self.shared_memory_manager) |*manager| {
            manager.deinit();
            self.shared_memory_manager = null;
        }
        self.shared_memory_enabled = false;
    }
    
    pub fn create_shared_region(
        self: *Vm,
        name: []const u8,
        size: usize,
        permissions: AccessPermissions
    ) !SharedRegionHandle {
        if (self.shared_memory_manager) |*manager| {
            const options = SharedMemoryManager.SharedRegionOptions{
                .copy_on_write = true,
                .auto_grow = false,
                .persistent = false,
                .compression = .None,
            };
            
            return try manager.create_shared_region(name, size, permissions, options);
        }
        return error.SharedMemoryNotEnabled;
    }
    
    pub fn get_shared_memory_stats(self: *Vm) ?SharedMemoryManager.MemoryStats {
        if (self.shared_memory_manager) |*manager| {
            return manager.get_memory_stats();
        }
        return null;
    }
    
    pub fn garbage_collect_shared_memory(self: *Vm) !void {
        if (self.shared_memory_manager) |*manager| {
            try manager.garbage_collect();
        }
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/shared_memory/shared_memory_test.zig`

### Test Cases
```zig
test "shared memory manager initialization" {
    // Test manager creation with different configs
    // Test memory pool initialization
    // Test access controller setup
}

test "shared region creation and mapping" {
    // Test shared region creation
    // Test region mapping and unmapping
    // Test permission validation
}

test "copy-on-write functionality" {
    // Test COW page creation
    // Test write fault handling
    // Test memory isolation
}

test "memory pool operations" {
    // Test pool allocation and deallocation
    // Test different pool sizes
    // Test pool compaction
}

test "access control and security" {
    // Test permission checking
    // Test security isolation
    // Test malicious access prevention
}

test "performance and garbage collection" {
    // Test garbage collection effectiveness
    // Test performance tracking
    // Test memory usage optimization
}

test "integration with VM execution" {
    // Test VM integration
    // Test shared memory opcodes
    // Test performance impact measurement
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/shared_memory/shared_memory_manager.zig` - Main shared memory framework
- `/src/evm/shared_memory/shared_region.zig` - Shared memory region implementation
- `/src/evm/shared_memory/copy_on_write_manager.zig` - COW implementation
- `/src/evm/shared_memory/memory_pool_registry.zig` - Memory pool management
- `/src/evm/shared_memory/access_controller.zig` - Access control and security
- `/src/evm/shared_memory/performance_tracker.zig` - Performance monitoring
- `/src/evm/execution/shared_memory.zig` - Shared memory opcodes
- `/src/evm/vm.zig` - VM integration
- `/test/evm/shared_memory/shared_memory_test.zig` - Comprehensive tests

## Success Criteria

1. **Efficient Sharing**: Low-overhead memory sharing between execution contexts
2. **Security Isolation**: Proper access control and permission validation
3. **Memory Efficiency**: COW semantics and memory pool optimization
4. **Performance**: Minimal impact on execution performance
5. **Scalability**: Support for large numbers of shared regions
6. **Garbage Collection**: Effective cleanup of unused memory

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

#### 1. **Unit Tests** (`/test/evm/shared_memory/shared_memory_test.zig`)
```zig
// Test basic shared memory functionality
test "shared_memory basic functionality with known scenarios"
test "shared_memory handles edge cases correctly"
test "shared_memory validates state changes"
test "shared_memory correct behavior under load"
```

#### 2. **Integration Tests**
```zig
test "shared_memory integrates with EVM context correctly"
test "shared_memory works with existing systems"
test "shared_memory maintains backward compatibility"
test "shared_memory handles system interactions"
```

#### 3. **State Management Tests**
```zig
test "shared_memory state transitions work correctly"
test "shared_memory handles concurrent state access"
test "shared_memory maintains state consistency"
test "shared_memory reverts state on failure"
```

#### 4. **Performance Tests**
```zig
test "shared_memory performance with realistic workloads"
test "shared_memory memory efficiency and allocation patterns"
test "shared_memory scalability under high load"
test "shared_memory benchmark against baseline implementation"
```

#### 5. **Error Handling Tests**
```zig
test "shared_memory error propagation works correctly"
test "shared_memory proper error types returned"
test "shared_memory handles resource exhaustion gracefully"
test "shared_memory recovery from failure states"
```

#### 6. **Concurrency Tests** (for async/multi-threaded features)
```zig
test "shared_memory thread safety verification"
test "shared_memory async operation correctness"
test "shared_memory handles race conditions properly"
test "shared_memory deadlock prevention"
```

#### 7. **Copy-on-Write Tests**
```zig
test "shared_memory maintains EVM specification compliance"
test "shared_memory COW semantics correctness"
test "shared_memory memory sharing efficiency"
test "shared_memory isolation and security validation"
```

### Test Development Priority
1. **Start with core memory allocation tests** - Ensures basic shared memory works
2. **Add copy-on-write tests** - Verifies memory sharing and isolation
3. **Implement security tests** - Critical for memory isolation and safety
4. **Add performance benchmarks** - Ensures production readiness
5. **Test concurrency and race conditions** - Robust multi-threaded operation
6. **Add integration tests** - System-level correctness verification

### Test Data Sources
- **EVM specification requirements**: Memory management compliance
- **Reference implementation behavior**: Cross-platform compatibility
- **Performance benchmarks**: Memory allocation and access patterns
- **Real-world scenarios**: Contract interaction and shared data usage
- **Edge case generation**: Boundary testing for memory limits and access

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public APIs
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify memory safety and leak detection

### Test-First Examples

**Before writing any implementation:**
```zig
test "shared_memory basic functionality" {
    // This test MUST fail initially
    const context = test_utils.createTestContext();
    var shared_manager = SharedMemoryManager.init(context.allocator);
    
    const region = try shared_manager.allocate_shared_region(1024);
    try testing.expect(region.handle != 0);
}
```

**Only then implement:**
```zig
pub const SharedMemoryManager = struct {
    pub fn allocate_shared_region(self: *SharedMemoryManager, size: usize) !SharedRegion {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test memory isolation thoroughly** - Architecture changes affect EVM security
- **Verify memory safety** - Especially important for shared memory and concurrent access
- **Test performance implications** - Ensure optimizations don't break correctness
- **Validate thread safety** - Critical for concurrent implementations

## References

- [Shared Memory](https://en.wikipedia.org/wiki/Shared_memory) - Shared memory concepts
- [Copy-on-Write](https://en.wikipedia.org/wiki/Copy-on-write) - COW implementation strategies
- [Memory Pool](https://en.wikipedia.org/wiki/Memory_pool) - Memory pool design patterns
- [Inter-Process Communication](https://en.wikipedia.org/wiki/Inter-process_communication) - IPC mechanisms
- [Memory Management](https://en.wikipedia.org/wiki/Memory_management) - Memory management principles

## EVMONE Context

An analysis of the `evmone` codebase reveals several key components that provide excellent context for implementing a shared memory system within an EVM. The most relevant parallels are found in how `evmone` handles memory, storage, and precompiled contracts.

### Memory Management
`evmone`'s `Memory` class is a high-performance, page-based memory implementation. Its growth strategy and clear interface for reading/writing data serve as a strong foundation for the proposed `SharedRegion` implementation.

### State Access (Storage)
The interaction between opcodes like `SLOAD`/`SSTORE` and the `ExecutionState`/`Host` provides a clear pattern for how the new shared memory opcodes (`SHARED_READ`, `SHARED_WRITE`) could interact with the `SharedMemoryManager`. The `Host` acts as the bridge to the state, which is analogous to how the opcodes would need to access the shared memory manager.

### Precompiled Contracts
Adding new opcodes with complex native logic is architecturally similar to implementing precompiled contracts. The `evmone` precompile system, with its distinct `analyze` (for gas calculation) and `execute` phases, is a perfect model for implementing the gas logic and execution for the new shared memory opcodes.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
/// The EVM memory.
///
/// The implementations uses initial allocation of 4k and then grows capacity with 2x factor.
/// Some benchmarks have been done to confirm 4k is ok-ish value.
class Memory
{
    /// The size of allocation "page".
    static constexpr size_t page_size = 4 * 1024;

    struct FreeDeleter
    {
        void operator()(uint8_t* p) const noexcept { std::free(p); }
    };

    /// Owned pointer to allocated memory.
    std::unique_ptr<uint8_t[], FreeDeleter> m_data;

    /// The "virtual" size of the memory.
    size_t m_size = 0;

    /// The size of allocated memory. The initialization value is the initial capacity.
    size_t m_capacity = page_size;
    
    // ...

public:
    /// Creates Memory object with initial capacity allocation.
    Memory() noexcept { allocate_capacity(); }

    uint8_t& operator[](size_t index) noexcept { return m_data[index]; }

    [[nodiscard]] const uint8_t* data() const noexcept { return m_data.get(); }
    [[nodiscard]] size_t size() const noexcept { return m_size; }

    /// Grows the memory to the given size. The extent is filled with zeros.
    ///
    /// @param new_size  New memory size. Must be larger than the current size and multiple of 32.
    void grow(size_t new_size) noexcept;
    
    // ...
};

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
    
    // ...

    /// Stack space allocation.
    StackSpace stack_space;

    ExecutionState() noexcept = default;

    ExecutionState(const evmc_message& message, evmc_revision revision,
        const evmc_host_interface& host_interface, evmc_host_context* host_ctx,
        bytes_view _code) noexcept
      : msg{&message}, host{host_interface, host_ctx}, rev{revision}, original_code{_code}
    {}

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

    // ... gas checks ...

    const auto key = intx::be::store<evmc::bytes32>(stack.pop());
    const auto value = intx::be::store<evmc::bytes32>(stack.pop());

    // ... gas calculation based on warm/cold access and value change ...

    if ((gas_left -= gas_cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};
    state.gas_refund += gas_refund;
    
    // ... set storage via host ...
    state.host.set_storage(state.msg->recipient, key, value);

    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_calls.cpp">
```cpp
template <Opcode Op>
Result call_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    // ...
    const auto gas = stack.pop();
    const auto dst = intx::be::trunc<evmc::address>(stack.pop());
    const auto value = (Op == OP_STATICCALL || Op == OP_DELEGATECALL) ? 0 : stack.pop();
    const auto has_value = value != 0;
    const auto input_offset_u256 = stack.pop();
    const auto input_size_u256 = stack.pop();
    const auto output_offset_u256 = stack.pop();
    const auto output_size_u256 = stack.pop();

    stack.push(0);  // Assume failure.
    state.return_data.clear();
    
    // ... access checks and gas calculations ...

    if (!check_memory(gas_left, state.memory, input_offset_u256, input_size_u256))
        return {EVMC_OUT_OF_GAS, gas_left};

    if (!check_memory(gas_left, state.memory, output_offset_u256, output_size_u256))
        return {EVMC_OUT_OF_GAS, gas_left};
    
    // ...
    
    evmc_message msg{.kind = to_call_kind(Op)};
    // ... set up message ...
    
    const auto result = state.host.call(msg);
    state.return_data.assign(result.output_data, result.output_size);
    stack.top() = result.status_code == EVMC_SUCCESS;

    if (const auto copy_size = std::min(output_size, result.output_size); copy_size > 0)
        std::memcpy(&state.memory[output_offset], result.output_data, copy_size);

    // ... update gas ...
    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles.cpp">
```cpp
// This file demonstrates how evmone handles precompiled contracts.
// This pattern of analyzing for gas cost and then executing is highly
// relevant for implementing custom, complex opcodes like the ones
// requested for shared memory.

struct PrecompileTraits
{
    decltype(identity_analyze)* analyze = nullptr;
    decltype(identity_execute)* execute = nullptr;
};

// Example precompile traits for IDENTITY (0x04)
// {identity_analyze, identity_execute}

// The main dispatcher for precompiles.
evmc::Result call_precompile(evmc_revision rev, const evmc_message& msg) noexcept
{
    assert(msg.gas >= 0);

    const auto id = msg.code_address.bytes[19];
    const auto [analyze, execute] = traits[id];

    const bytes_view input{msg.input_data, msg.input_size};
    const auto [gas_cost, max_output_size] = analyze(input, rev);
    const auto gas_left = msg.gas - gas_cost;
    if (gas_left < 0)
        return evmc::Result{EVMC_OUT_OF_GAS};

    const auto output_data = new (std::nothrow) uint8_t[max_output_size];
    const auto [status_code, output_size] =
        execute(msg.input_data, msg.input_size, output_data, max_output_size);
    
    // ... create and return result ...
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles_internal.hpp">
```cpp
// This header shows the function signatures for the analyze and execute
// phases of precompiles, which is a useful pattern for new opcodes.

struct ExecutionResult
{
    evmc_status_code status_code;
    size_t output_size;
};

struct PrecompileAnalysis
{
    int64_t gas_cost;
    size_t max_output_size;
};

// Gas analysis function for the IDENTITY precompile.
PrecompileAnalysis identity_analyze(evmc::bytes_view input, evmc_revision rev) noexcept;

// Execution function for the IDENTITY precompile.
ExecutionResult identity_execute(
    const uint8_t* input, size_t input_size, uint8_t* output, size_t output_size) noexcept;
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles.cpp">
```cpp
// Example implementation of the `analyze` and `execute` functions for
// the IDENTITY precompile (0x04).

namespace
{
constexpr auto GasCostMax = std::numeric_limits<int64_t>::max();

constexpr int64_t num_words(size_t size_in_bytes) noexcept
{
    return static_cast<int64_t>((size_in_bytes + 31) / 32);
}

template <int BaseCost, int WordCost>
constexpr int64_t cost_per_input_word(size_t input_size) noexcept
{
    return BaseCost + WordCost * num_words(input_size);
}
}  // namespace

PrecompileAnalysis identity_analyze(bytes_view input, evmc_revision /*rev*/) noexcept
{
    return {cost_per_input_word<15, 3>(input.size()), input.size()};
}

ExecutionResult identity_execute(const uint8_t* input, size_t input_size, uint8_t* output,
    [[maybe_unused]] size_t output_size) noexcept
{
    assert(output_size >= input_size);
    std::copy_n(input, input_size, output);
    return {EVMC_SUCCESS, input_size};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/host.hpp">
```cpp
// The Host class is the interface between the EVM and the outside world (state, etc.).
// The SharedMemoryManager would likely be owned by a similar "host" object, and the new
// opcodes would interact with it through this interface, much like SLOAD/SSTORE do.

class Host : public evmc::Host
{
    // ...
    State& m_state;
    // ...

public:
    // ...
    [[nodiscard]] bytes32 get_storage(
        const address& addr, const bytes32& key) const noexcept override;

    evmc_storage_status set_storage(
        const address& addr, const bytes32& key, const bytes32& value) noexcept override;
    
    evmc::Result call(const evmc_message& msg) noexcept override;
    // ...
};
```
</file>
</evmone>



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/shared_memory.rs">
```rust
use super::MemoryTr;
use core::{
    cell::{Ref, RefCell, RefMut},
    cmp::min,
    fmt,
    ops::Range,
};
use primitives::{hex, B256, U256};
use std::{rc::Rc, vec::Vec};

/// A sequential memory shared between calls, which uses
/// a `Vec` for internal representation.
/// A [SharedMemory] instance should always be obtained using
/// the `new` static method to ensure memory safety.
#[derive(Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct SharedMemory {
    /// The underlying buffer.
    buffer: Rc<RefCell<Vec<u8>>>,
    /// Memory checkpoints for each depth.
    /// Invariant: these are always in bounds of `data`.
    my_checkpoint: usize,
    /// Child checkpoint that we need to free context to.
    child_checkpoint: Option<usize>,
    /// Memory limit. See [`Cfg`](context_interface::Cfg).
    #[cfg(feature = "memory_limit")]
    memory_limit: u64,
}

impl fmt::Debug for SharedMemory {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("SharedMemory")
            .field("current_len", &self.len())
            .field("context_memory", &hex::encode(&*self.context_memory()))
            .finish_non_exhaustive()
    }
}

impl Default for SharedMemory {
    #[inline]
    fn default() -> Self {
        Self::new()
    }
}

impl MemoryTr for SharedMemory {
    fn set_data(&mut self, memory_offset: usize, data_offset: usize, len: usize, data: &[u8]) {
        self.set_data(memory_offset, data_offset, len, data);
    }

    fn set(&mut self, memory_offset: usize, data: &[u8]) {
        self.set(memory_offset, data);
    }

    fn size(&self) -> usize {
        self.len()
    }

    fn copy(&mut self, destination: usize, source: usize, len: usize) {
        self.copy(destination, source, len);
    }

    fn slice(&self, range: Range<usize>) -> Ref<'_, [u8]> {
        self.slice_range(range)
    }

    fn local_memory_offset(&self) -> usize {
        self.my_checkpoint
    }

    fn set_data_from_global(
        &mut self,
        memory_offset: usize,
        data_offset: usize,
        len: usize,
        data_range: Range<usize>,
    ) {
        self.global_to_local_set_data(memory_offset, data_offset, len, data_range);
    }

    /// Returns a byte slice of the memory region at the given offset.
    ///
    /// # Safety
    ///
    /// In debug this will panic on out of bounds. In release it will silently fail.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    fn global_slice(&self, range: Range<usize>) -> Ref<'_, [u8]> {
        let buffer = self.buffer.borrow(); // Borrow the inner Vec<u8>
        Ref::map(buffer, |b| match b.get(range) {
            Some(slice) => slice,
            None => debug_unreachable!("slice OOB: range; len: {}", self.len()),
        })
    }

    fn resize(&mut self, new_size: usize) -> bool {
        self.resize(new_size);
        true
    }
}

impl SharedMemory {
    /// Creates a new memory instance that can be shared between calls.
    ///
    /// The default initial capacity is 4KiB.
    #[inline]
    pub fn new() -> Self {
        Self::with_capacity(4 * 1024) // from evmone
    }

    /// Creates a new memory instance with a given shared buffer.
    pub fn new_with_buffer(buffer: Rc<RefCell<Vec<u8>>>) -> Self {
        Self {
            buffer,
            my_checkpoint: 0,
            child_checkpoint: None,
            #[cfg(feature = "memory_limit")]
            memory_limit: u64::MAX,
        }
    }

    /// Creates a new memory instance that can be shared between calls with the given `capacity`.
    #[inline]
    pub fn with_capacity(capacity: usize) -> Self {
        Self {
            buffer: Rc::new(RefCell::new(Vec::with_capacity(capacity))),
            my_checkpoint: 0,
            child_checkpoint: None,
            #[cfg(feature = "memory_limit")]
            memory_limit: u64::MAX,
        }
    }

    /// Creates a new memory instance that can be shared between calls,
    /// with `memory_limit` as upper bound for allocation size.
    ///
    /// The default initial capacity is 4KiB.
    #[cfg(feature = "memory_limit")]
    #[inline]
    pub fn new_with_memory_limit(memory_limit: u64) -> Self {
        Self {
            memory_limit,
            ..Self::new()
        }
    }

    /// Returns `true` if the `new_size` for the current context memory will
    /// make the shared buffer length exceed the `memory_limit`.
    #[cfg(feature = "memory_limit")]
    #[inline]
    pub fn limit_reached(&self, new_size: usize) -> bool {
        self.my_checkpoint.saturating_add(new_size) as u64 > self.memory_limit
    }

    /// Prepares the shared memory for a new child context.
    ///
    /// # Panics
    ///
    /// Panics if this function was already called without freeing child context.
    #[inline]
    pub fn new_child_context(&mut self) -> SharedMemory {
        if self.child_checkpoint.is_some() {
            panic!("new_child_context was already called without freeing child context");
        }
        let new_checkpoint = self.buffer.borrow().len();
        self.child_checkpoint = Some(new_checkpoint);
        SharedMemory {
            buffer: self.buffer.clone(),
            my_checkpoint: new_checkpoint,
            // child_checkpoint is same as my_checkpoint
            child_checkpoint: None,
            #[cfg(feature = "memory_limit")]
            memory_limit: self.memory_limit,
        }
    }

    /// Prepares the shared memory for returning from child context. Do nothing if there is no child context.
    #[inline]
    pub fn free_child_context(&mut self) {
        let Some(child_checkpoint) = self.child_checkpoint.take() else {
            return;
        };
        unsafe {
            self.buffer.borrow_mut().set_len(child_checkpoint);
        }
    }

    /// Returns the length of the current memory range.
    #[inline]
    pub fn len(&self) -> usize {
        self.buffer.borrow().len() - self.my_checkpoint
    }

    /// Resizes the memory in-place so that `len` is equal to `new_len`.
    #[inline]
    pub fn resize(&mut self, new_size: usize) {
        self.buffer
            .borrow_mut()
            .resize(self.my_checkpoint + new_size, 0);
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/memory.rs">
```rust
use crate::{
    gas,
    interpreter_types::{InterpreterTypes, LoopControl, MemoryTr, RuntimeFlag, StackTr},
};
use core::cmp::max;
use primitives::U256;

use crate::InstructionContext;

pub fn mload<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([], top, context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, top);
    resize_memory!(context.interpreter, offset, 32);
    *top =
        U256::try_from_be_slice(context.interpreter.memory.slice_len(offset, 32).as_ref()).unwrap()
}

pub fn mstore<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn!([offset, value], context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, offset);
    resize_memory!(context.interpreter, offset, 32);
    context
        .interpreter
        .memory
        .set(offset, &value.to_be_bytes::<32>());
}

pub fn mstore8<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn!([offset, value], context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, offset);
    resize_memory!(context.interpreter, offset, 1);
    context.interpreter.memory.set(offset, &[value.byte(0)]);
}

pub fn msize<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE);
    push!(
        context.interpreter,
        U256::from(context.interpreter.memory.size())
    );
}

// EIP-5656: MCOPY - Memory copying instruction
pub fn mcopy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CANCUN);
    popn!([dst, src, len], context.interpreter);

    // Into usize or fail
    let len = as_usize_or_fail!(context.interpreter, len);
    // Deduce gas
    gas_or_fail!(context.interpreter, gas::copy_cost_verylow(len));
    if len == 0 {
        return;
    }

    let dst = as_usize_or_fail!(context.interpreter, dst);
    let src = as_usize_or_fail!(context.interpreter, src);
    // Resize memory
    resize_memory!(context.interpreter, max(dst, src), len);
    // Copy memory in place
    context.interpreter.memory.copy(dst, src, len);
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas.rs">
```rust
//! EVM gas calculation utilities.

mod calc;
mod constants;

pub use calc::*;
pub use constants::*;

/// Represents the state of gas during execution.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Gas {
    /// The initial gas limit. This is constant throughout execution.
    limit: u64,
    /// The remaining gas.
    remaining: u64,
    /// Refunded gas. This is used only at the end of execution.
    refunded: i64,
    /// Memoisation of values for memory expansion cost.
    memory: MemoryGas,
}

impl Gas {
    /// Creates a new `Gas` struct with the given gas limit.
    #[inline]
    pub const fn new(limit: u64) -> Self {
        Self {
            limit,
            remaining: limit,
            refunded: 0,
            memory: MemoryGas::new(),
        }
    }

    // ... (other methods) ...

    /// Records an explicit cost.
    ///
    /// Returns `false` if the gas limit is exceeded.
    #[inline]
    #[must_use = "prefer using `gas!` instead to return an out-of-gas error on failure"]
    pub fn record_cost(&mut self, cost: u64) -> bool {
        if let Some(new_remaining) = self.remaining.checked_sub(cost) {
            self.remaining = new_remaining;
            return true;
        }
        false
    }

    /// Record memory expansion
    #[inline]
    #[must_use = "internally uses record_cost that flags out of gas error"]
    pub fn record_memory_expansion(&mut self, new_len: usize) -> MemoryExtensionResult {
        let Some(additional_cost) = self.memory.record_new_len(new_len) else {
            return MemoryExtensionResult::Same;
        };

        if !self.record_cost(additional_cost) {
            return MemoryExtensionResult::OutOfGas;
        }

        MemoryExtensionResult::Extended
    }
}

pub enum MemoryExtensionResult {
    /// Memory was extended.
    Extended,
    /// Memory size stayed the same.
    Same,
    /// Not enough gas to extend memory.
    OutOfGas,
}

/// Utility struct that speeds up calculation of memory expansion
/// It contains the current memory length and its memory expansion cost.
///
/// It allows us to split gas accounting from memory structure.
#[derive(Clone, Copy, Default, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct MemoryGas {
    /// Current memory length
    pub words_num: usize,
    /// Current memory expansion cost
    pub expansion_cost: u64,
}

impl MemoryGas {
    pub const fn new() -> Self {
        Self {
            words_num: 0,
            expansion_cost: 0,
        }
    }

    #[inline]
    pub fn record_new_len(&mut self, new_num: usize) -> Option<u64> {
        if new_num <= self.words_num {
            return None;
        }
        self.words_num = new_num;
        let mut cost = crate::gas::calc::memory_gas(new_num);
        core::mem::swap(&mut self.expansion_cost, &mut cost);
        // Safe to subtract because we know that new_len > length
        // Notice the swap above.
        Some(self.expansion_cost - cost)
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/frame.rs">
```rust
// ... imports ...

/// Call frame trait
pub trait Frame: Sized {
    type Evm;
    type FrameInit;
    type FrameResult;
    type Error;

    fn init_first(
        evm: &mut Self::Evm,
        frame_input: Self::FrameInit,
    ) -> Result<FrameOrResult<Self>, Self::Error>;

    fn init(
        &mut self,
        evm: &mut Self::Evm,
        frame_input: Self::FrameInit,
    ) -> Result<FrameOrResult<Self>, Self::Error>;

    fn run(&mut self, evm: &mut Self::Evm) -> Result<FrameInitOrResult<Self>, Self::Error>;

    fn return_result(
        &mut self,
        evm: &mut Self::Evm,
        result: Self::FrameResult,
    ) -> Result<(), Self::Error>;
}

pub struct EthFrame<EVM, ERROR, IW: InterpreterTypes> {
    // ... fields ...
    /// Interpreter.
    pub interpreter: Interpreter<IW>,
    // ...
}

impl<EVM, ERROR> Frame for EthFrame<EVM, ERROR, EthInterpreter>
where
    EVM: EvmTr<
        Precompiles: PrecompileProvider<EVM::Context, Output = InterpreterResult>,
        Instructions: InstructionProvider<
            Context = EVM::Context,
            InterpreterTypes = EthInterpreter,
        >,
    >,
    ERROR: From<ContextTrDbError<EVM::Context>> + FromStringError,
{
    // ...
    fn init(
        &mut self,
        evm: &mut Self::Evm,
        frame_input: Self::FrameInit,
    ) -> Result<FrameOrResult<Self>, Self::Error> {
        // Create new context from shared memory.
        let memory = self.interpreter.memory.new_child_context();
        EthFrame::init_with_context(evm, self.depth + 1, frame_input, memory)
    }
    // ...
    fn return_result(
        &mut self,
        context: &mut Self::Evm,
        result: Self::FrameResult,
    ) -> Result<(), Self::Error> {
        self.return_result(context, result)
    }
}

// ...

impl<EVM, ERROR> EthFrame<EVM, ERROR, EthInterpreter>
where
    // ...
{
    // ...
    fn return_result(&mut self, evm: &mut EVM, result: FrameResult) -> Result<(), ERROR> {
        self.interpreter.memory.free_child_context();
        // ...
        // (process result and update parent frame)
        // ...
        Ok(())
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs">
```rust
// ... imports ...
use interpreter::{
    interpreter::EthInterpreter, interpreter_types::*, CallInput, Gas,
    Host, InstructionResult, InstructionTable, InterpreterAction, InterpreterResult,
};
// ...

/// Main interpreter structure that contains all components defines in [`InterpreterTypes`].s
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(::serde::Serialize, ::serde::Deserialize))]
pub struct Interpreter<WIRE: InterpreterTypes = EthInterpreter> {
    pub bytecode: WIRE::Bytecode,
    pub stack: WIRE::Stack,
    pub return_data: WIRE::ReturnData,
    pub memory: WIRE::Memory,
    pub input: WIRE::Input,
    pub sub_routine: WIRE::SubRoutineStack,
    pub control: WIRE::Control,
    pub runtime_flag: WIRE::RuntimeFlag,
    pub extend: WIRE::Extend,
}

/// Default types for Ethereum interpreter.
pub struct EthInterpreter<EXT = (), MG = SharedMemory> {
    _phantom: core::marker::PhantomData<fn() -> (EXT, MG)>,
}

impl<EXT> InterpreterTypes for EthInterpreter<EXT> {
    type Stack = Stack;
    type Memory = SharedMemory;
    type Bytecode = ExtBytecode;
    type ReturnData = ReturnDataImpl;
    type Input = InputsImpl;
    type SubRoutineStack = SubRoutineImpl;
    type Control = LoopControlImpl;
    type RuntimeFlag = RuntimeFlags;
    type Extend = EXT;
    type Output = InterpreterAction;
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions.rs">
```rust
//! EVM opcode implementations.

// ... imports ...
use crate::{interpreter_types::InterpreterTypes, Host, InstructionContext};

/// EVM opcode function signature.
pub type Instruction<W, H> = fn(InstructionContext<'_, H, W>);

/// Instruction table is list of instruction function pointers mapped to 256 EVM opcodes.
pub type InstructionTable<W, H> = [Instruction<W, H>; 256];

/// Returns the instruction table for the given spec.
pub const fn instruction_table<WIRE: InterpreterTypes, H: Host + ?Sized>(
) -> [Instruction<WIRE, H>; 256] {
    use bytecode::opcode::*;
    let mut table = [control::unknown as Instruction<WIRE, H>; 256];

    table[STOP as usize] = control::stop;
    table[ADD as usize] = arithmetic::add;
    table[MUL as usize] = arithmetic::mul;
    // ... (all other opcodes) ...
    table[MLOAD as usize] = memory::mload;
    table[MSTORE as usize] = memory::mstore;
    table[MSTORE8 as usize] = memory::mstore8;
    // ...
    table[MCOPY as usize] = memory::mcopy;
    // ...
    table[CREATE as usize] = contract::create::<_, false, _>;
    table[CALL as usize] = contract::call;
    // ...
    table
}
```
</file>
</revm>



## EXECUTION-SPECS Context

This is an excellent and detailed prompt. Implementing a shared memory system would be a significant addition to the EVM, and the provided Zig-based specification is very clear.

To assist in implementing this, I've extracted the most relevant patterns and structures from the `execution-specs` codebase. The focus is on how the existing EVM manages memory, state, gas, and inter-contract calls, as these are the core primitives you will need to build upon.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/__init__.py">
```python
# The `Evm` and `Message` data classes are the core context for any execution.
# Your `SharedMemoryManager` would likely be a new component within the `Evm`
# struct, and information about the caller/context for access control would
# come from the `Message` struct.

@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    # ... (existing fields)
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

<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
```python
# The `execute_code` function is the main execution loop. New shared memory
# opcodes would be dispatched from within this loop, similar to existing ones.
# The `process_message_call` function shows how a new execution context (EVM frame)
# is created and how its result (including output data and errors) is handled.
# This is analogous to how you might map/unmap shared memory regions for a sub-call.

def process_message_call(message: Message) -> MessageCallOutput:
    # ... (code to set up state and handle contract creation)
    else:
        evm = process_message(message)
    # ... (code to process evm result)

def process_message(message: Message) -> Evm:
    # ... (code to handle call depth and value transfer)
    # The core execution happens here:
    evm = execute_code(message)
    # ... (code to handle state reverts or commits)
    return evm


def execute_code(message: Message) -> Evm:
    # ... (code to initialize EVM object with stack, memory, etc.)

    try:
        # Precompile handling is a good pattern for special-cased behavior
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            # ...
            return evm

        # This is the main opcode execution loop. Your new opcodes would be
        # handled within this loop.
        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            op_implementation[op](evm)

    except ExceptionalHalt as error:
        # ...
    except Revert as error:
        # ...
    return evm
```
</file>

<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
```python
# This file provides the patterns for gas calculation. Your shared memory opcodes
# will need to consume gas. The `calculate_memory_gas_cost` function is especially
# relevant for any operations that involve memory, as it shows the quadratic
# cost model.

GAS_VERY_LOW = Uint(3)
GAS_COPY = Uint(3)

def charge_gas(evm: Evm, amount: Uint) -> None:
    """
    Subtracts `amount` from `evm.gas_left`.
    """
    # ... (implementation)

def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    to the smallest multiple of 32 bytes,
    such that the allocated size is at least as big as the given size.
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words ** Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    # ... (error handling)
    return total_gas_cost


def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    """
    Calculates the gas amount to extend memory
    """
    # ... (implementation)
```
</file>

<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/memory.py">
```python
# The implementations of MSTORE, MLOAD, and MCOPY are excellent templates for
# your `shared_write`, `shared_read`, and memory copying operations. They show
# the full flow:
# 1. Pop arguments from the stack.
# 2. Calculate and charge gas for memory expansion.
# 3. Perform the memory operation.
# 4. Advance the program counter.

def mstore(evm: Evm) -> None:
    """
    Stores a word to memory.
    """
    # STACK
    start_position = pop(evm.stack)
    value = pop(evm.stack).to_be_bytes32()

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(len(value)))]
    )

    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    memory_write(evm.memory, start_position, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mload(evm: Evm) -> None:
    """
    Load word from memory.
    """
    # STACK
    start_position = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(32))]
    )
    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    value = U256.from_be_bytes(
        memory_read_bytes(evm.memory, start_position, U256(32))
    )
    push(evm.stack, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>

<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/state.py">
```python
# Your shared memory system must be transactional. If a call reverts, any
# allocations or mappings must be rolled back. The `begin_transaction`,
# `commit_transaction`, and `rollback_transaction` functions show how this is
# done for the state trie by managing snapshots. A similar mechanism will be
# needed for the `SharedMemoryManager`.

@dataclass
class State:
    """
    Contains all information that is preserved between transactions.
    """
    _main_trie: Trie[Address, Optional[Account]] = field(...)
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(...)
    _snapshots: List[
        Tuple[
            Trie[Address, Optional[Account]],
            Dict[Address, Trie[Bytes32, U256]],
        ]
    ] = field(default_factory=list)
    # ...

def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Start a state transaction.
    """
    state._snapshots.append(
        (
            copy_trie(state._main_trie),
            {k: copy_trie(t) for (k, t) in state._storage_tries.items()},
        )
    )
    # ...

def commit_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Commit a state transaction.
    """
    state._snapshots.pop()
    # ...

def rollback_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Rollback a state transaction...
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    # ...
```
</file>
</execution-specs>

## Prompt Corrections
The provided Zig specification is an excellent starting point. Here are a few things to keep in mind when translating it to a production EVM implementation, based on the patterns seen in `execution-specs`:

1.  **Memory Model**: The Zig spec uses a general-purpose allocator (`context.allocator.alloc`). The EVM's memory is a simpler, contiguous, and transient block of memory that expands but doesn't have complex allocation/deallocation patterns. The `memory.py` module in the specs provides a more accurate model.
2.  **Opcodes and Gas**: Your `execute_shared_*` functions correctly identify the need to consume gas. Remember to also charge for memory expansion, which is a quadratic cost. The `gas.py` and `instructions/memory.py` files show how this dynamic cost is calculated and applied *in addition* to the base opcode cost.
3.  **Context and State Management**:
    *   The `SharedMemoryManager` is a good abstraction. In a real implementation, it would likely be a field within the main `Evm` object (see `vm/__init__.py`), alongside `stack`, `memory`, and `state`.
    *   The prompt correctly identifies the need for a `context_id`. This is analogous to the `Evm` object itself, which represents the current call frame. For sub-calls, a new `Evm` object is created, inheriting or receiving necessary context from its parent.
4.  **Transactional Integrity**: The `state.py` module's use of `begin_transaction`, `commit_transaction`, and `rollback_transaction` is a critical pattern. Your `SharedMemoryManager` must hook into this to ensure that if an execution frame reverts, any shared memory regions it created or mapped are also reverted to their previous state.

---

An excellent and detailed prompt. Implementing a shared memory system is a complex task that touches many core components of the EVM.

To provide the best context from `execution-specs`, I will focus on the patterns for memory management, gas calculation, state journaling (for reverts), and the lifecycle of message calls, as these are the most analogous concepts to what you need to build.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/memory.py">
```python
"""
Ethereum Virtual Machine (EVM) Memory
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
Introduction
------------

EVM memory operations.
"""
from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256, Uint

from ethereum.utils.byte import right_pad_zero_bytes


def memory_write(
    memory: bytearray, start_position: U256, value: Bytes
) -> None:
    """
    Writes to memory.
    ...
    """
    memory[start_position : int(start_position) + len(value)] = value


def memory_read_bytes(
    memory: bytearray, start_position: U256, size: U256
) -> bytearray:
    """
    Read bytes from memory.
    ...
    """
    return memory[start_position : Uint(start_position) + Uint(size)]


def buffer_read(buffer: Bytes, start_position: U256, size: U256) -> Bytes:
    """
    Read bytes from a buffer. Padding with zeros if necessary.
    ...
    """
    return right_pad_zero_bytes(
        buffer[start_position : Uint(start_position) + Uint(size)], size
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/gas.py">
```python
"""
Ethereum Virtual Machine (EVM) Gas
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
Introduction
------------

EVM gas constants and calculators.
"""
from dataclasses import dataclass
from typing import List, Tuple

from ethereum_types.numeric import U256, Uint

from ethereum.trace import GasAndRefund, evm_trace
from ethereum.utils.numeric import ceil32

from . import Evm
from .exceptions import OutOfGasError

# ... gas constants ...
GAS_MEMORY = Uint(3)

@dataclass
class ExtendMemory:
    """
    Define the parameters for memory extension in opcodes

    `cost`: `ethereum.base_types.Uint`
        The gas required to perform the extension
    `expand_by`: `ethereum.base_types.Uint`
        The size by which the memory will be extended
    """

    cost: Uint
    expand_by: Uint


def charge_gas(evm: Evm, amount: Uint) -> None:
    """
    Subtracts `amount` from `evm.gas_left`.
    ...
    """
    evm_trace(evm, GasAndRefund(int(amount)))

    if evm.gas_left < amount:
        raise OutOfGasError
    else:
        evm.gas_left -= amount


def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    to the smallest multiple of 32 bytes,
    such that the allocated size is at least as big as the given size.
    ...
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words ** Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    try:
        return total_gas_cost
    except ValueError:
        raise OutOfGasError


def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    """
    Calculates the gas amount to extend memory
    ...
    """
    size_to_extend = Uint(0)
    to_be_paid = Uint(0)
    current_size = Uint(len(memory))
    for start_position, size in extensions:
        if size == 0:
            continue
        before_size = ceil32(current_size)
        after_size = ceil32(Uint(start_position) + Uint(size))
        if after_size <= before_size:
            continue

        size_to_extend += after_size - before_size
        already_paid = calculate_memory_gas_cost(before_size)
        total_cost = calculate_memory_gas_cost(after_size)
        to_be_paid += total_cost - already_paid

        current_size = after_size

    return ExtendMemory(to_be_paid, size_to_extend)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/system.py">
```python
# This function is a good model for how contexts can interact, which is
# analogous to how shared memory regions might be mapped and used between
# different execution contexts.
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
    code: Bytes,
    disable_precompiles: bool,
) -> None:
    """
    Perform the core logic of the `CALL*` family of opcodes.
    """
    from ...vm.interpreter import STACK_DEPTH_LIMIT, process_message

    # Prepare data and context for the sub-call
    call_data = memory_read_bytes(
        evm.memory, memory_input_start_position, memory_input_size
    )
    code = get_account(evm.message.block_env.state, code_address).code
    child_message = Message(
        # ... message fields ...
        gas=gas,
        value=value,
        data=call_data,
        code=code,
        # ...
    )

    # Process the sub-call, creating a new EVM frame
    child_evm = process_message(child_message)

    # Handle the results of the sub-call
    if child_evm.error:
        incorporate_child_on_error(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(0))
    else:
        incorporate_child_on_success(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(1))

    # Copy output from the sub-call to the parent's memory
    actual_output_size = min(memory_output_size, U256(len(child_evm.output)))
    memory_write(
        evm.memory,
        memory_output_start_position,
        child_evm.output[:actual_output_size],
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/state.py">
```python
# The state snapshot mechanism is a perfect reference for how to make the
# SharedMemoryManager's state (registries, etc.) reversible.
@dataclass
class State:
    """
    Contains all information that is preserved between transactions.
    """

    _main_trie: Trie[Address, Optional[Account]] = field(...)
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(...)
    _snapshots: List[
        Tuple[
            Trie[Address, Optional[Account]],
            Dict[Address, Trie[Bytes32, U256]],
        ]
    ] = field(default_factory=list)
    ...

def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Start a state transaction.
    ...
    """
    state._snapshots.append(
        (
            copy_trie(state._main_trie),
            {k: copy_trie(t) for (k, t) in state._storage_tries.items()},
        )
    )
    ...

def commit_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Commit a state transaction.
    ...
    """
    state._snapshots.pop()
    ...


def rollback_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Rollback a state transaction, resetting the state to the point when the
    corresponding `start_transaction()` call was made.
    ...
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    ...

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/interpreter.py">
```python
# The main execution loop in `execute_code` shows how opcodes are dispatched
# via the `op_implementation` dictionary. This is the integration point for
# your new shared memory opcodes.
def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
    ...
    """
    # ...
    evm = Evm(
        # ... evm fields ...
    )
    try:
        # ... precompile handling ...

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            evm_trace(evm, OpStart(op))
            op_implementation[op](evm) # <-- Opcode dispatch
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    # ... error handling ...
    return evm

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/__init__.py">
```python
# The `Ops` enum and `op_implementation` dictionary define the EVM's "jump table".
# You will need to add new entries here for your shared memory opcodes.
class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """
    # ... existing opcodes ...

    # It is recommended to choose opcode values from an unused range.
    # For example, in the 0xE0-0xEF range which is reserved for application-
    # specific use.
    SHARED_ALLOC = 0xE0
    SHARED_FREE = 0xE1
    SHARED_MAP = 0xE2
    SHARED_READ = 0xE3
    SHARED_WRITE = 0xE4

op_implementation: Dict[Ops, Callable] = {
    # ... existing opcode implementations ...

    # Add your new opcodes here
    # Ops.SHARED_ALLOC: shared_memory_instructions.alloc,
    # Ops.SHARED_FREE: shared_memory_instructions.free,
    # etc.
}
```
</file>
</execution-specs>

## Prompt Corrections
The provided prompt is well-structured and detailed, offering a clear vision for the feature. Here are some notes and corrections based on the `execution-specs` context to aid implementation:

1.  **Execution Context:** The prompt uses `ExecutionContext`. In the `execution-specs`, the equivalent concept is the `Evm` dataclass (defined in `src/ethereum/prague/vm/__init__.py`). This object holds the `stack`, `memory`, `pc`, `gas_left`, and a `Message` object containing call-specific details like `caller`, `value`, `data`, etc. Your `SharedMemoryManager` will likely need access to this `Evm` object.

2.  **VM Integration:** The prompt suggests adding `shared_memory_manager` to the `Vm` struct. This is a good approach. In the `execution-specs`, this would be analogous to adding it to the `BlockEnvironment` to make it accessible across different `Evm` frames within the same block execution, or passing it down through the `Message` object.

3.  **State Revertibility:** The prompt's design implies the `SharedMemoryManager` holds state (registries, pools). This state *must* be journaled to support reverts on failed calls. The `state.py` file, with its `begin_transaction`, `commit_transaction`, and `rollback_transaction` functions using `_snapshots`, is the canonical pattern to follow for this. Your `SharedMemoryManager` should implement a similar snapshotting mechanism for its internal state.

4.  **Opcode Implementation Signature:** The prompt provides Zig-style opcode functions. In the `execution-specs` Python implementation, all opcode functions have the signature `def opcode_name(evm: Evm) -> None:`. The function modifies the passed `evm` object in place (e.g., `pop(evm.stack)`, `charge_gas(evm, ...)`). This is a useful pattern to keep in mind for how opcodes interact with the VM state.

5.  **Gas Calculation:** The `gas.py` file is the best reference for how to implement gas costs. Your opcodes like `shared_read` and `shared_write` will need dynamic gas costs similar to `MLOAD` or `MSTORE`, which depend on memory expansion. The `calculate_gas_extend_memory` function is the model to follow.



## GO-ETHEREUM Context

An EVM's memory model is transient and isolated to each transaction context. The concept of "Shared Memory" as described in the prompt, especially with features like persistence, COW, and direct memory mapping between contracts, is a significant extension to the standard EVM.

Go-ethereum does not have a direct implementation of such a shared memory system. However, several of its components provide excellent analogies and foundational patterns that would be highly relevant for building the requested feature.

-   **Memory Management (`core/vm/memory.go`):** Geth's `Memory` object demonstrates a simple, transient, and dynamically-sized memory model for a single execution context. Its gas calculation for memory expansion is a crucial concept for pricing memory usage.
-   **State Journaling (`core/state/journal.go`):** The state journal is the best parallel for the requested Copy-on-Write (COW) mechanism. It tracks all state changes within a transaction and can revert them to a specific snapshot. This pattern of tracking dirty state and reverting is exactly what a COW manager needs.
-   **Contract Execution Context (`core/vm/contract.go`):** Geth's `Contract` object encapsulates the code and input data for a single call frame. This provides a model for what a "context" is and how it accesses its own data, which the `SharedRegion` would extend.
-   **Sidecar Data (EIP-4844 Blobs):** The introduction of blob transactions in EIP-4844 provides the closest Geth analogy to shared data regions. Blobs are data "on the side" of a transaction, with their own separate fee market. This is a great model for managing and pricing access to shared resources that aren't part of the core EVM state.
-   **Performance Metrics (`metrics/`):** Geth's `metrics` package offers a robust framework for performance tracking, directly mapping to the `SharedMemoryPerformanceTracker` requested in the prompt.

The following snippets are extracted from these analogous systems in go-ethereum.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents the EVM's memory space.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{store: make([]byte, 0, 1024)}
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = common.ExtendMemory(m.store, int(size-uint64(len(m.store))))
	}
}

// GetCopy returns a copy of the backed buffer.
func (m *Memory) GetCopy(offset, size int64) []byte {
	// If the requested size is 0, return nil.
	if size == 0 {
		return nil
	}

	// The offset and size are int64 to accommodate the largest possible memory
	// region, which can be up to 2^63-1 bytes. The offset and size are checked
	// against the capacity of the store, which is limited by the maximum size
	// of a slice in Go, so they can be safely cast to int.
	cpy := make([]byte, size)
	copy(cpy, m.store[offset:offset+size])

	return cpy
}

// Len returns the length of the backing slice.
func (m *Memory) Len() int {
	return len(m.store)
}

// Data returns the backing slice.
func (m *Memory) Data() []byte {
	return m.store
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// GasQuadCoeffDiv is the gas coefficient divisor for memory expansion, where the memory cost
	// is defined as C_mem(a) = C_mem_lin * a + a^2 / C_mem_quad, where a is the number of words.
	// C_mem_quad is 512 in the yellow paper.
	GasQuadCoeffDiv = 512

	// MemGas is the linear gas cost for memory access.
	MemGas = 3
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// JournalEntry is a modification entry in the state change journal.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the address that was modified by this journal entry.
	dirtied() *common.Address
}

// Journal is a log of state changes. This is used to revert changes that are made
// when a transaction execution fails.
type Journal struct {
	entries  []journalEntry         // Current changes tracked by the journal
	revisons []journalRevision      // Point-in-time snapshots of the journal
	dirties  map[common.Address]int // Dirty accounts and the number of changes
}

type journalRevision struct {
	id         int
	journalLen int
}

// NewJournal creates a new initialized journal.
func NewJournal() *Journal {
	return &Journal{
		dirties: make(map[common.Address]int),
	}
}

// Append inserts a new modification entry to the end of the journal.
func (j *Journal) Append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// Revert undoes a batch of journalled changes.
func (j *Journal) Revert(statedb *StateDB, revID int) {
	// Find the snapshot and entries to revert
	idx := -1
	for i, rev := range j.revisons {
		if rev.id == revID {
			idx = i
			break
		}
	}
	if idx == -1 {
		panic(fmt.Errorf("revision id %v not found", revID))
	}
	reversion := j.revisons[idx]

	// Replay the journal to undo changes
	for i := len(j.entries) - 1; i >= reversion.journalLen; i-- {
		// Unset dirtyness hint. The contract may have been self-destructed
		// and thus removed from the dirty set.
		entry := j.entries[i]
		if addr := entry.dirtied(); addr != nil {
			if j.dirties[*addr]--; j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
		entry.revert(statedb)
	}
	j.entries = j.entries[:reversion.journalLen]
	j.revisons = j.revisons[:idx]
}

// Dirty explicitly sets an address to dirty, even if the change is a noop.
func (j *Journal) Dirty(addr common.Address) {
	j.dirties[addr]++
}

// snapshot creates a snapshot of the current journal state.
func (j *Journal) snapshot() int {
	id := nextRevisionId
	nextRevisionId++
	j.revisons = append(j.revisons, journalRevision{id, len(j.entries)})
	return id
}

// Various journal entries that can be reverted.
type (
	// Changes to an account's balance.
	balanceChange struct {
		account *common.Address
		prev    *uint256.Int
	}
	// Changes to an account's nonce.
	nonceChange struct {
		account *common.Address
		prev    uint64
	}
	// Changes to an account's code.
	codeChange struct {
		account     *common.Address
		prevCode    []byte
		prevCodeEmu bool
		prevHash    common.Hash
	}
	// Changes to an account's storage.
	storageChange struct {
		account       *common.Address
		key           common.Hash
		prevValue     common.Hash
		prevValueEmu  bool
		prevValExists bool
	}
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the caller stack.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests map[common.Hash]bitvec // Aggregated result of JUMPDEST analysis.
	code      []byte
	CodeHash  common.Hash
	CodeAddr  *common.Address
	Input     []byte
	Gas       uint64
	value     *big.Int
}

// NewContract returns a new contract environment for the execution of EVM without
// a backing state object. It is used in the implementation of the CHAINID and
// SELFDESTRUCT opcodes.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	return &Contract{
		caller:        caller,
		CallerAddress: caller.Address(),
		self:          object,
		Gas:           gas,
		value:         value,
	}
}
// AsDelegate sets the contract to be a delegate call and returns the contract.
func (c *Contract) AsDelegate() *Contract {
	// NOTE: caller is not checked for nil. It's an error to do a delegate
	// call from a contract that doesn't have a caller.
	c.CallerAddress = c.caller.Address()
	c.value = c.caller.(*Contract).value

	// The caller of a DELEGATECALL is the same as the caller of the current
	// context.
	c.caller = c.caller.(*Contract).caller
	return c
}

// GetOp returns the n'th element in the contract's byte array
func (c *Contract) GetOp(n uint64) vm.OpCode {
	if n < uint64(len(c.code)) {
		return vm.OpCode(c.code[n])
	}
	return vm.STOP
}

// validJumpdest checks whether the given destination is a valid JUMPDEST.
func (c *Contract) validJumpdest(dest *big.Int) bool {
	udest, overflow := dest.Uint64(), dest.BitLen() > 64
	if c.jumpdests == nil {
		c.jumpdests = codeAnalysis(c.code)
	}
	// PC cannot go beyond contract code
	// Since jumpdests are analysis on code, it is sufficient to check udests
	return !overflow && udest < uint64(len(c.code)) && c.jumpdests[common.Hash{}].get(udest)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/tx_blob.go">
```go
// BlobTx represents an EIP-4844 transaction.
type BlobTx struct {
	ChainID    *uint256.Int
	Nonce      uint64
	GasTipCap  *uint256.Int // a.k.a. maxPriorityFeePerGas
	GasFeeCap  *uint256.Int // a.k.a. maxFeePerGas
	Gas        uint64
	To         common.Address
	Value      *uint256.Int
	Data       []byte
	AccessList AccessList
	BlobFeeCap *uint256.Int // a.k.a. maxFeePerBlobGas
	BlobHashes []common.Hash

	// A blob transaction can optionally contain blobs. This field must be set when BlobTx
	// is used to create a transaction for signing.
	Sidecar *BlobTxSidecar `rlp:"-"`

	// Signature values
	V *uint256.Int
	R *uint256.Int
	S *uint256.Int
}

// BlobTxSidecar contains the blobs of a blob transaction.
type BlobTxSidecar struct {
	Version     byte                 // Version
	Blobs       []kzg4844.Blob       // Blobs needed by the blob pool
	Commitments []kzg4844.Commitment // Commitments needed by the blob pool
	Proofs      []kzg4844.Proof      // Proofs needed by the blob pool
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/consensus/misc/eip4844/eip4844.go">
```go
// CalcBlobFee calculates the blobfee from the header's excess blob gas field.
func CalcBlobFee(config *params.ChainConfig, header *types.Header) *big.Int {
	var frac uint64
	switch config.LatestFork(header.Time) {
	case forks.Osaka:
		frac = config.BlobScheduleConfig.Osaka.UpdateFraction
	case forks.Prague:
		frac = config.BlobScheduleConfig.Prague.UpdateFraction
	case forks.Cancun:
		frac = config.BlobScheduleConfig.Cancun.UpdateFraction
	default:
		panic("calculating blob fee on unsupported fork")
	}
	return fakeExponential(minBlobGasPrice, new(big.Int).SetUint64(*header.ExcessBlobGas), new(big.Int).SetUint64(frac))
}

// CalcExcessBlobGas calculates the excess blob gas after applying the set of
// blobs on top of the excess blob gas.
func CalcExcessBlobGas(config *params.ChainConfig, parent *types.Header, headTimestamp uint64) uint64 {
	var (
		parentExcessBlobGas uint64
		parentBlobGasUsed   uint64
	)
	if parent.ExcessBlobGas != nil {
		parentExcessBlobGas = *parent.ExcessBlobGas
		parentBlobGasUsed = *parent.BlobGasUsed
	}
	excessBlobGas := parentExcessBlobGas + parentBlobGasUsed
	targetGas := uint64(targetBlobsPerBlock(config, headTimestamp)) * params.BlobTxBlobGasPerBlob
	if excessBlobGas < targetGas {
		return 0
	}
	return excessBlobGas - targetGas
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
// MeterSnapshot is a read-only copy of the meter's internal values.
type MeterSnapshot struct {
	count                          int64
	rate1, rate5, rate15, rateMean float64
}

// Count returns the count of events at the time the snapshot was taken.
func (m *MeterSnapshot) Count() int64 { return m.count }

// Rate1 returns the one-minute moving average rate of events per second at the
// time the snapshot was taken.
func (m *MeterSnapshot) Rate1() float64 { return m.rate1 }

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
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/counter.go">
```go
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
</go-ethereum>
## Prompt Corrections
The original prompt outlines a sophisticated shared memory system that extends the capabilities of a standard EVM. Here are some notes on how this design compares to go-ethereum's implementation and the official EVM specification:

1.  **Isolated vs. Shared Memory:** The core EVM memory model is strictly **isolated**. Each contract execution context (a "frame") gets its own transient memory space. There is no mechanism for two different contract contexts to directly map and access the same memory region concurrently. Data is shared explicitly through `CALL` arguments (`calldata`) and `RETURN` data (`returndata`), which involves copying. Your proposed shared memory system is a significant and powerful extension that would fundamentally change inter-contract communication, making it much more efficient but also introducing new security considerations (e.g., race conditions, unauthorized memory access) that the EVM model avoids by design. The locking mechanism (`std.Thread.RwLock`) in your `SharedRegion` struct correctly identifies this as a new requirement.

2.  **Copy-on-Write (COW) vs. State Reverts:** Your `CopyOnWriteManager` is an excellent pattern for managing memory efficiency when a shared resource is modified. The closest analogy in go-ethereum is the `StateDB`'s journaling system (`core/state/journal.go`). When a transaction executes, any state changes (storage writes, balance changes) are logged in a `journal`. If a sub-call reverts, only the journal entries for that call are undone. If the entire transaction fails, the whole journal is discarded. This provides similar "revert-to-snapshot" functionality as your COW design but applies to persistent state rather than in-memory regions.

3.  **Memory Pools:** The EVM memory in go-ethereum (`core/vm/memory.go`) is a single, contiguous, dynamically-growing byte slice. It does not use pre-allocated pools of fixed-size blocks for its main memory. Your `MemoryPoolRegistry` is a classic performance optimization for memory allocation, but it's a feature not present in the core VM memory model of Geth. Geth *does* use pooling (`sync.Pool`) for other objects (like journal entries) to reduce GC pressure, so the concept is valid and applicable.

4.  **Opcodes:** The opcodes you've proposed (e.g., `SHARED_ALLOC`, `SHARED_MAP`) are custom extensions. They have no equivalent in the standard EVM instruction set. Implementing them would require modifying the VM's main execution loop to recognize and dispatch them.

In summary, your prompt describes building a powerful, new feature for an EVM-like virtual machine, not simply re-implementing the existing Ethereum Virtual Machine. The provided go-ethereum snippets should serve as excellent reference implementations for the analogous components (memory expansion, state reverts, sidecar data, performance metrics) that you will need to build your advanced shared memory system.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset to value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size > 0 {
		if offset+size > uint64(len(m.store)) {
			// This will not happen if memory is resized beforehand.
			// However, in case of an external call, it's possible that
			// memory is not resized.
			m.Resize(offset + size)
		}
		copy(m.store[offset:offset+size], value)
	}
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(cap(m.store)) < size {
		// The requested size is larger than the capacity of the underlying
		// slice. The slice must be grown.
		c := size
		if c < 2048 {
			c = 2048
		}
		m.store = common.CopyBytes(m.store) // Keep the old contents.
		m.store = append(m.store, make([]byte, c-uint64(len(m.store)))...)
		m.store = m.store[:size]
	}
	m.store = m.store[:size]
}

// Get returns offset + size as a new slice.
func (m *Memory) Get(offset, size int64) (cpy []byte) {
	if size == 0 {
		return nil
	}
	if len(m.store) > int(offset) {
		cpy = make([]byte, size)
		copy(cpy, m.store[offset:offset+size])

		return
	}

	return
}

// GetPtr returns a slice that points to a region in memory.
func (m *Memory) GetPtr(offset, size int64) []byte {
	if size == 0 {
		return nil
	}

	if len(m.store) > int(offset) {
		return m.store[offset : offset+size]
	}
	return nil
}

// Len returns the length of the backing slice.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a contract's runtime stack.
type Stack struct {
	data []*uint256.Int
}

// NewStack returns a new stack with a backing store of the given size.
func NewStack(size int) *Stack {
	return &Stack{data: make([]*uint256.Int, 0, size)}
}

// Data returns the underlying uint256.Int slice.
func (st *Stack) Data() []*uint256.Int {
	return st.data
}

// Push pushes a value on top of the stack.
func (st *Stack) Push(d *uint256.Int) {
	st.data = append(st.data, d)
}

// Pop pops a value from the top of the stack.
func (st *Stack) Pop() (ret *uint256.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// Len returns the number of elements in the stack.
func (st *Stack) Len() int {
	return len(st.data)
}

// Swap swaps the top two values on the stack.
func (st *Stack) Swap(n int) {
	st.data[len(st.data)-n], st.data[len(st.data)-1] = st.data[len(st.data)-1], st.data[len(st.data)-n]
}

// Dup duplicates the nth value on the stack.
func (st *Stack) Dup(n int) {
	st.Push(st.data[len(st.data)-n])
}

// Peek returns the nth value from the top of the stack without removing it.
func (st *Stack) Peek() *uint256.Int {
	return st.data[len(st.data)-1]
}

// Back returns the n'th item in the stack.
func (st *Stack) Back(n int) *uint256.Int {
	return st.data[len(st.data)-1-n]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
package state

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/holiman/uint256"
)

// journalEntry is a modification to the state.
type journalEntry interface {
	// revert undoes the state change.
	revert(*StateDB)

	// dirties returns the rlp-encoded hash of the address that was modified.
	// It is used by the state journal to track the amount of dirty addresses
	// in the state.
	dirtied() *common.Address
}

// The state journal is a change log that is used to revert changes to the state
// in case of execution failures.
type journal struct {
	// The change log for the state.
	//
	// The entries are structured as a linked list, where each list item is
	// a list of changes that happened in the same block. The lists are traversed
	// backwards.
	//
	// For example:
	//
	// [ C D ] -> [ A B ] -> nil
	//
	// - C and D happened in block 2
	// - A and B happened in block 1
	//
	// Reverting block 2 would be to revert C, then D.
	entries []journalEntry

	// The dirty addresses, derived from the journal entries.
	// It is used for filtering dirty storage and address in state snapshot.
	dirties map[common.Address]int
}

// newJournal creates a new journal.
func newJournal() *journal {
	return &journal{
		dirties: make(map[common.Address]int),
	}
}

// append appends a new change to the journal.
func (j *journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// revert reverts all changes that have occurred since the given journal
// snapshot.
func (j *journal) revert(statedb *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the operation
		entry := j.entries[i]
		entry.revert(statedb)

		// Drop the dirtiness counter
		if addr := entry.dirtied(); addr != nil {
			if j.dirties[*addr]--; j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
}

// createObjectChange is a state change for creating a new account.
type createObjectChange struct {
	account *common.Address
}

func (ch createObjectChange) revert(s *StateDB) {
	delete(s.stateObjects, *ch.account)
	delete(s.stateObjectsDirty, *ch.account)
}

func (ch createObjectChange) dirtied() *common.Address {
	return ch.account
}

// resetObjectChange is a state change for resetting an account's state.
type resetObjectChange struct {
	prev *stateObject
}

func (ch resetObjectChange) revert(s *StateDB) {
	s.setStateObject(ch.prev)
}

func (ch resetObjectChange) dirtied() *common.Address {
	return &ch.prev.address
}

// balanceChange is a state change for a balance modification.
type balanceChange struct {
	account *common.Address
	prev    *uint256.Int
	prevEnc []byte
	reason  tracing.BalanceChangeReason
}

func (ch balanceChange) revert(s *StateDB) {
	s.getStateObject(*ch.account).setBalance(ch.prev, ch.prevEnc)
}

func (ch balanceChange) dirtied() *common.Address {
	return ch.account
}

// nonceChange is a state change for a nonce modification.
type nonceChange struct {
	account *common.Address
	prev    uint64
	reason  tracing.NonceChangeReason
}

func (ch nonceChange) revert(s *StateDB) {
	s.getStateObject(*ch.account).setNonce(ch.prev)
}

func (ch nonceChange) dirtied() *common.Address {
	return ch.account
}

// storageChange is a state change for a storage slot modification.
type storageChange struct {
	account       *common.Address
	key           common.Hash
	prevValue     common.Hash
	prevEncrypted bool
}

func (ch storageChange) revert(s *StateDB) {
	s.getStateObject(*ch.account).setState(ch.key, ch.prevValue, ch.prevEncrypted)
}

func (ch storageChange) dirtied() *common.Address {
	return ch.account
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// stateTransition represents a state transition.
//
// == The State Transitioning Model
//
// A state transition is a change made when a transaction is applied to the current world
// state. The state transitioning model does all the necessary work to work out a valid new
// state root.
//
//  1. Nonce handling
//  2. Pre pay gas
//  3. Create a new state object if the recipient is nil
//  4. Value transfer
//
// == If contract creation ==
//
//	4a. Attempt to run transaction data
//	4b. If valid, use result as code for the new state object
//
// == end ==
//
//  5. Run Script section
//  6. Derive new state root
type stateTransition struct {
	gp           *GasPool
	msg          *Message
	gasRemaining uint64
	initialGas   uint64
	state        vm.StateDB
	evm          *vm.EVM
}

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

// execute will transition the state by applying the current message and
// returning the evm execution result with following fields.
// ...
func (st *stateTransition) execute() (*ExecutionResult, error) {
	// First check this message satisfies all consensus rules before
	// applying the message.
    // ...

	// Check clauses 1-3, buy gas if everything is correct
	if err := st.preCheck(); err != nil {
		return nil, err
	}
    // ...
	
    // Subtract intrinsic gas
	gas, err := IntrinsicGas(msg.Data, msg.AccessList, msg.SetCodeAuthorizations, contractCreation, rules.IsHomestead, rules.IsIstanbul, rules.IsShanghai)
	if err != nil {
		return nil, err
	}
	if st.gasRemaining < gas {
		return nil, fmt.Errorf("%w: have %d, want %d", ErrIntrinsicGas, st.gasRemaining, gas)
	}
	st.gasRemaining -= gas

    // ... value transfer check ...

	// Execute the preparatory steps for state transition which includes:
	// - prepare accessList(post-berlin)
	// - reset transient storage(eip 1153)
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
        // ...
		// Execute the transaction's call.
		ret, st.gasRemaining, vmerr = st.evm.Call(msg.From, st.to(), msg.Data, st.gasRemaining, value)
	}

	// Record the gas used excluding gas refunds. This value represents the actual
	// gas allowance required to complete execution.
	peakGasUsed := st.gasUsed()

	// Compute refund counter, capped to a refund quotient.
	st.gasRemaining += st.calcRefund()
    // ... gas floor logic ...
	st.returnGas()

    // ... tip/fee logic ...

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

// getPooledBuffer retrieves a buffer from the pool and creates a byte slice of the
// requested size from it.
//
// The caller should return the *bytes.Buffer object back into encodeBufferPool after use!
// The returned byte slice must not be used after returning the buffer.
func getPooledBuffer(size uint64) ([]byte, *bytes.Buffer, error) {
	if size > math.MaxInt {
		return nil, nil, fmt.Errorf("can't get buffer of size %d", size)
	}
	buf := encodeBufferPool.Get().(*bytes.Buffer)
	buf.Reset()
	buf.Grow(int(size))
	b := buf.Bytes()[:int(size)]
	return b, buf, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/tx_blob.go">
```go
// BlobTxSidecar contains the blobs of a blob transaction.
type BlobTxSidecar struct {
	Blobs       []kzg4844.Blob
	Commitments []kzg4844.Commitment
	Proofs      []kzg4844.Proof
}

// BlobTx is the transaction data of a blob transaction.
type BlobTx struct {
	ChainID    *uint256.Int
	Nonce      uint64
	GasTipCap  *uint256.Int
	GasFeeCap  *uint256.Int
	Gas        uint64
	To         common.Address
	Value      *uint256.Int
	Data       []byte
	AccessList AccessList

	// Blob fields.
	BlobFeeCap *uint256.Int
	BlobHashes []common.Hash

	// Signature values.
	V, R, S *uint256.Int

	// This is only a cached field, which is populated life cycle of a transaction
	// flowing within the node. It's not supposed to be persisted.
	Sidecar *BlobTxSidecar `rlp:"-"`
}

// copy creates a deep copy of the transaction data and initializes all fields.
func (tx *BlobTx) copy() TxData {
	cpy := &BlobTx{
		ChainID:    new(uint256.Int),
		Nonce:      tx.Nonce,
		GasTipCap:  new(uint256.Int),
		GasFeeCap:  new(uint256.Int),
		Gas:        tx.Gas,
		To:         tx.To,
		Value:      new(uint256.Int),
		Data:       common.CopyBytes(tx.Data),
		AccessList: tx.AccessList.Copy(),
		BlobFeeCap: new(uint256.Int),
		BlobHashes: common.CopyBytes(tx.BlobHashes),
		V:          new(uint256.Int),
		R:          new(uint256.Int),
		S:          new(uint256.Int),
	}
	// ... (field copying)
	if tx.Sidecar != nil {
		cpy.Sidecar = tx.Sidecar.Copy()
	}
	return cpy
}
```
</file>
</go-ethereum>

---

The user wants to implement a custom shared memory system for an EVM. This is not a standard Ethereum feature, so I will provide code from go-ethereum that is conceptually analogous to the requested components.

1.  **Shared Memory & Opcodes (`TSTORE`/`TLOAD`)**: The closest standard feature is Transient Storage (EIP-1153). It provides a key-value store shared across all call contexts within a single transaction. The `TSTORE` and `TLOAD` opcode implementations are excellent references for the new `SHARED_*` opcodes.
2.  **Copy-on-Write (`StateDB` Journaling)**: Go-ethereum's state management uses a journaling system that functions like a copy-on-write mechanism for state changes. The `state.Journal` is the perfect reference for implementing the `CopyOnWriteManager`.
3.  **Memory Pools (`StoragePool`)**: Go-ethereum uses object pools to reduce allocation overhead for state management. The `state.StoragePool` is a direct parallel to the requested `MemoryPoolRegistry`.
4.  **Memory Management (`Memory` object)**: The `Memory` object within a call frame and its gas calculation for expansion are directly relevant to managing the `SharedRegion` byte slices.
5.  **VM Integration (`EVM` struct)**: The `EVM.Call` method demonstrates how to create new execution contexts, manage gas, handle state changes, and process return data, all of which are relevant for the proposed `SharedMemoryManager`.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/instructions.go">
```go
// TSTORE implements a transient storage store.
func opTstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop slot and value from the stack.
	loc := stack.pop()
	val := stack.pop()

	// Gas cost for this opcode is static and defined in the jumptable.
	// No extra gas is required.

	// Set the transient storage value.
	// The StateDB manages the transient storage map for the current transaction.
	evm.StateDB.SetTransientState(contract.Address(), loc, val)
	return nil, nil
}

// TLOAD implements a transient storage load.
func opTload(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop slot from the stack.
	loc := stack.peek()

	// Gas cost is static. The value is read from the StateDB.
	// The returned value is pushed back onto the stack, replacing the slot.
	*loc = evm.StateDB.GetTransientState(contract.Address(), *loc)
	return nil, nil
}

// opCall is the generic CALL opcode plain execution
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop six arguments from the stack:
	// gas, addr, value, argsOffset, argsLength, retOffset, retLength
	gas, addr, value, argsOffset, argsLength, retOffset, retLength := stack.pop6()

	// Truncate gas to a reasonable amount, and ensure it's not larger than the
	// maximum allowed for a uint64.
	gas = memory.gas(gas)

	// Get the arguments from memory. If the arguments are empty, we don't need
	// to do anything.
	args, err := memory.view(argsOffset, argsLength)
	if err != nil {
		return nil, err
	}

	// Make the call. Note, this is where the EVM creates a new frame and executes
	// the code at the target address. It's the core of inter-contract communication.
	ret, returnGas, err := evm.Call(contract, common.Address(addr), args, gas, value)

	// If the call was successful, copy the return data to memory.
	if err == nil {
		stack.push(uint256.NewInt(1))
		memory.set(retOffset, retLength, ret)
	} else {
		stack.push(uint256.NewInt(0))
	}
	// The remaining gas is returned to the caller's context.
	contract.Gas += returnGas
	return nil, err
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds the transient storage for transactions. It is shared between
	// all StateDB instances derived from the same root object, but is not
	// committed to the database. It is reset on each transaction.
	transientStorage state.Storage
    ...
}

// GetTransientState returns a value from transient storage.
func (s *StateDB) GetTransientState(addr common.Address, key common.Hash) common.Hash {
	if s.transientStorage == nil {
		return common.Hash{}
	}
	return s.transientStorage[addr][key]
}

// SetTransientState sets a value in transient storage.
func (s *StateDB) SetTransientState(addr common.Address, key, value common.Hash) {
	if s.transientStorage == nil {
		s.transientStorage = make(state.Storage)
	}
	if _, ok := s.transientStorage[addr]; !ok {
		s.transientStorage[addr] = make(map[common.Hash]common.Hash)
	}
	s.journal.append(transientStorageChange{
		account:  &addr,
		key:      key,
		prevalue: s.GetTransientState(addr, key),
	})
	s.transientStorage[addr][key] = value
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/state/journal.go">
```go
// journalEntry is a modification entry in the state change journal.
type journalEntry interface {
	// revert undoes the state change in the statedb.
	revert(db *StateDB)

	// dirtied returns the address that was modified.
	dirtied() *common.Address
}

// Journal is a log of state changes. It is used to revert changes that are made
// to the state.
type Journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// snapshot creates a snapshot of the current journal state.
func (j *Journal) snapshot() int {
	return len(j.entries)
}

// revert reverts all changes made since the given snapshot.
func (j *Journal) revert(db *StateDB, snapshot int) {
	// Replay the journal to specified snapshot in reverse
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the change and remove the journal entry
		j.entries[i].revert(db)
		j.undirty(j.entries[i].dirtied())
	}
	j.entries = j.entries[:snapshot]
}

// Append a new journal entry.
func (j *Journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirty(*addr)
	}
}

// All possible journal entries.
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
		prev        bool // whether account had already suicided
		prevbalance *big.Int
	}
	// Changes to account properties.
	balanceChange struct {
		account     *common.Address
		prev        *big.Int
		prevstorage state.Storage // For reverting the touched status
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
		prevcode, prevhash common.Hash
	}
	// Transient storage changes.
	transientStorageChange struct {
		account      *common.Address
		key, prevalue common.Hash
	}
	// Access list changes.
	addAddressToAccessListChange struct {
		address *common.Address
	}
	addSlotToAccessListChange struct {
		address *common.Address
		slot    *common.Hash
	}
	// Changes to the refund counter.
	refundChange struct {
		prev *uint64
	}
)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/state/state_object.go">
```go
// A storagePool is a pool of hash maps for storing state.
// The purpose of this is to keep the frequently used maps in memory
// for a long time, to avoid repeated memory allocations.
// This is not thread safe.
var storagePool = newStoragePool()

// newStoragePool creates a new storage pool.
func newStoragePool() *sync.Pool {
	return &sync.Pool{
		New: func() interface{} {
			return make(Storage)
		},
	}
}

// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
// First you need to obtain a state object.
// You can make changes to the state object.
// Finally, call CommitTrie to write the changed state object to the database.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.Account
	db       *StateDB

	// Storage cache
	storage Storage // Storage cache of original entries to dedup rewrites
	dirty   Storage // Storage entries that have been modified in the current transaction execution
    ...
}

// getStorage returns a pooled storage map.
func (s *stateObject) getStorage() Storage {
	if s.storage != nil {
		return s.storage
	}
	s.storage = storagePool.Get().(Storage)
	return s.storage
}

// Put a storage map back into the pool.
func (s *stateObject) finalise() {
	if s.storage == nil {
		return
	}
	// All dirty slots are copied to a new map. The original map is released
	// back to the pool. The new map is smaller and can be GC'd when the
	// object is no longer referenced.
	if len(s.dirty) > 0 {
		s.storage = make(Storage, len(s.dirty))
		for k, v := range s.dirty {
			s.storage[k] = v
		}
	} else {
		// The storage is clean. Release the map to the pool.
		// It is important to clear the map before releasing.
		for key := range s.storage {
			delete(s.storage, key)
		}
		storagePool.Put(s.storage)
	}
	s.storage = nil // map is now owned by the pool
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/gas.go">
```go
// memoryGasCost calculates the gas cost for memory expansion.
func memoryGasCost(mem *Memory) uint64 {
	// The memory size is guaranteed to be a multiple of 32 bytes.
	// We can safely overflow this since the maximum memory size is about
	// 32MB and the gas cost is a quad of that, not fitting in a uint64.
	// The cost of memory expansion is MSTORE_words * 3 + MSTORE_words^2 / 512.
	words := uint64(mem.Len() / 32)
	return words*GasMem + words*words/512
}

// memoryCopierGas creates a gas function for memory-to-memory copy operations.
func memoryCopierGas(stackpos int) gasFunc {
	return func(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
		// Gas for memory expansion
		gas, err := memoryGas(stack, mem, memorySize)
		if err != nil {
			return 0, err
		}
		// Gas for copying data
		words, overflow := stack.Back(stackpos).Uint64WithOverflow()
		if overflow {
			return 0, errGasUintOverflow
		}
		words = (words + 31) / 32

		var copyGas uint64
		copyGas, err = math.SafeMul(words, GasCopy)
		if err != nil {
			return 0, err
		}
		gas, err = math.SafeAdd(gas, copyGas)
		if err != nil {
			return 0, err
		}
		return gas, nil
	}
}

// callGas calculates the gas given to a sub-call.
func callGas(isEip150 bool, availableGas, localGas uint64) uint64 {
	if isEip150 {
		return availableGas - availableGas/64
	}
	return availableGas
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current transaction and block.
	Context
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// Depth is the current call stack
	depth int
	// chain backend
	chain ChainContext
	// chain rules
	chainRules params.Rules
	// virtual machine configuration
	vmConfig Config
	// global gas pool, to be used for the execution of the
	// entire transaction.
	gasPool *GasPool
	// readOnly is a flag indicating whether state modifications are allowed
	readOnly bool
	// returnData is the return data of the last call.
	returnData []byte
}

// Call executes the code of a contract with the given input as parameters. It
// can be specified to execute plain regular CALL or a DELEGATECALL / CALLCODE.
//
// It returns the returned data and the remaining gas, and an error if it failed.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to change state from within a static call
	if evm.readOnly && value.Sign() != 0 {
		return nil, gas, ErrWriteProtection
	}
	// Make sure the caller has enough balance to send the value.
	if !caller.CanTransfer(evm.StateDB, value) {
		return nil, gas, ErrInsufficientBalance
	}
	var (
		to       = AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	// ... (gas calculation and precompile checks) ...

	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution.
	contract := NewContract(caller, to, value, gas)
	contract.SetCallCode(&addr, codeHash, code)

	ret, err = run(evm, contract, input, false)

	// When the execution finishes, we save the leftover gas and return it
	// to the caller.
	leftOverGas = contract.Gas

	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
	}
	return ret, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/memory.go">
```go
// Memory represents the EVM's memory space.
type Memory struct {
	store       []byte // Backing data store for memory
	lastGasCost uint64 // Gas cost of the last memory expansion
	size        int    // Current size of the memory
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Resize resizes the memory to the given size. If the size is smaller than the
// current size, the memory is not modified.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		// In the case of a resize, we have to potentially allocate a new
		// backing slice. The size of memory is always a multiple of 32.
		// The size given to this method is the "target" size, which may
		// not be a multiple of 32. We thus need to round it up.
		m.store = common.Extend(m.store, int(size))
	}
	m.size = int(size)
}

// GetCopy returns a copy of the memory region.
func (m *Memory) GetCopy(offset, size int64) []byte {
	if size == 0 {
		return nil
	}
	// If the requested offset is outside the memory, return an empty slice.
	if offset > int64(len(m.store)) {
		return nil
	}
	// If the memory is insufficient, expand it with zeros.
	if rem := offset + size; rem > int64(len(m.store)) {
		// This will panic if the offset is larger than the capacity of the
		// underlying slice.
		// TODO: This should be made safe.
		return common.RightPadBytes(m.store[offset:], int(size))
	}
	// Otherwise, return a copy of the slice.
	return common.CopyBytes(m.store[offset : offset+size])
}

// Set sets the memory region at a given offset to a slice of bytes.
func (m *Memory) Set(offset, size uint64, value []byte) {
	// The size of memory is required to be a multiple of 32 bytes.
	// This property is preserved by the check below.
	if size > 0 {
		// The memory needs to be resized to contain the new data.
		m.Resize(offset + size)
		copy(m.store[offset:offset+size], value)
	}
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return m.size
}

```
</file>

## Prompt Corrections
The user's prompt outlines a feature that is significantly more complex than any single component in go-ethereum. It combines concepts from state management, memory management, and inter-contract communication. The prompt is well-structured, but it's important to recognize that this is a major architectural addition to an EVM, not a simple feature implementation.

1.  **Analogy to Transient Storage**: The prompt's concept of "shared memory" is most analogous to EIP-1153's Transient Storage. Both are designed for data sharing across call contexts within a single transaction. The implementation should look closely at how Geth handles `TSTORE` and `TLOAD`, which use a simple map in the `StateDB` that is cleared after the transaction. This is a much simpler and more realistic model for cross-contract data sharing than a full-blown IPC/shared-memory system.

2.  **Copy-on-Write vs. Journaling**: The request for "Copy-on-Write" is best implemented using a journaling mechanism like Geth's `state.Journal`. The journal tracks the "diff" of state changes, and these diffs are either committed or reverted. This avoids copying the entire state for each sub-call and is a proven, efficient pattern for EVM state management.

3.  **Opcode Gas Costs**: The proposed opcodes (`SHARED_READ`, `SHARED_WRITE`, etc.) will need carefully designed gas costs. The prompt's gas calculation (`100 + size_usize / 32`) is a good start but should be compared to analogous Geth opcodes (`MLOAD`, `MSTORE`, `SLOAD`, `SSTORE`). The gas model should account for:
    *   A base cost for the operation.
    *   A cost proportional to the amount of data being accessed (per word or per byte).
    *   A potential "cold" vs. "warm" access cost, similar to EIP-2929, if this is the first time a shared region is accessed in a transaction.
    *   The `core/vm/gas.go` file provides canonical formulas for these patterns.

4.  **Addressing Scheme**: The prompt mentions returning a raw pointer (`@intFromPtr(memory.ptr)`) from `SHARED_ALLOC` and `SHARED_MAP`. This is a significant departure from the EVM's memory model and could introduce security vulnerabilities if not handled carefully. A safer approach would be to use opaque handles or IDs (as suggested with `SharedRegionHandle`) and have the opcodes perform lookups, rather than exposing raw host memory addresses to the sandboxed EVM environment. The EVM memory should remain isolated from the host's memory.

---

An analysis of the user's prompt reveals a request to implement a sophisticated, OS-style shared memory system within an EVM. This includes features like memory pools, copy-on-write, and explicit memory mapping opcodes. The standard EVM memory model is much simpler, providing a private, linear, and ephemeral memory space for each call context. There is no concept of shared memory regions between unrelated contract calls.

However, we can draw parallels and provide context from `go-ethereum` that would be highly relevant for implementing such a system. The following snippets illustrate `go-ethereum`'s approach to memory management, state isolation, object pooling, and inter-call data handling, which are the foundational concepts upon which the requested feature could be built.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// core/vm/memory.go

// Memory implements a simple memory model for the ethereum virtual machine.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return memoryPool.Get().(*Memory)
}

// Free returns the memory to the pool.
func (m *Memory) Free() {
	// To reduce peak allocation, return only smaller memory instances to the pool.
	const maxBufferSize = 16 << 10
	if cap(m.store) <= maxBufferSize {
		m.store = m.store[:0]
		m.lastGasCost = 0
		memoryPool.Put(m)
	}
}

// Set sets offset + size to value
func (m *Memory) Set(offset, size uint64, value []byte) {
	// ... (bounds checks) ...
	copy(m.store[offset:offset+size], value)
}

// Set32 sets the 32 bytes starting at offset to the value of val...
func (m *Memory) Set32(offset uint64, val *uint256.Int) {
	// ... (bounds checks) ...
	val.PutUint256(m.store[offset:])
}

// Resize resizes the memory to size
func (m *Memory) Resize(size uint64) {
	if uint64(m.Len()) < size {
		m.store = append(m.store, make([]byte, size-uint64(m.Len()))...)
	}
}

// GetCopy returns offset + size as a new slice
func (m *Memory) GetCopy(offset, size uint64) (cpy []byte) {
	// ...
	cpy = make([]byte, size)
	copy(cpy, m.store[offset:offset+size])
	return
}

// GetPtr returns the offset + size
func (m *Memory) GetPtr(offset, size uint64) []byte {
	// ...
	return m.store[offset : offset+size]
}

// Len returns the length of the backing slice
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// core/vm/gas.go

// memoryGasCost calculates the quadratic gas for memory expansion. It does so
// only for the memory region that is expanded, not the total memory.
func memoryGasCost(mem *Memory, newMemSize uint64) (uint64, error) {
	if newMemSize == 0 {
		return 0, nil
	}
	// The maximum that will fit in a uint64 is max_word_count - 1. Anything above
	// that will result in an overflow. Additionally, a newMemSize which results in
	// a newMemSizeWords larger than 0xFFFFFFFF will cause the square operation to
	// overflow. The constant 0x1FFFFFFFE0 is the highest number that can be used
	// without overflowing the gas calculation.
	if newMemSize > 0x1FFFFFFFE0 {
		return 0, ErrGasUintOverflow
	}
	newMemSizeWords := toWordSize(newMemSize)
	newMemSize = newMemSizeWords * 32

	if newMemSize > uint64(mem.Len()) {
		square := newMemSizeWords * newMemSizeWords
		linCoef := newMemSizeWords * params.MemoryGas
		quadCoef := square / params.QuadCoeffDiv
		newTotalFee := linCoef + quadCoef

		fee := newTotalFee - mem.lastGasCost
		mem.lastGasCost = newTotalFee

		return fee, nil
	}
	return 0, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// core/vm/contract.go

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

// UseGas attempts the use gas and subtracts it and returns true on success
func (c *Contract) UseGas(gas uint64, logger *tracing.Hooks, reason tracing.GasChangeReason) (ok bool) {
	if c.Gas < gas {
		return false
	}
	// ... (tracing) ...
	c.Gas -= gas
	return true
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// core/state/journal.go

type revision struct {
	id           int
	journalIndex int
}

// journalEntry is a modification entry in the state change journal that can be
// reverted on demand.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)
	// ...
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

// snapshot returns an identifier for the current revision of the state.
func (j *journal) snapshot() int {
	id := j.nextRevisionId
	j.nextRevisionId++
	j.validRevisions = append(j.validRevisions, revision{id, j.length()})
	return id
}

// revertToSnapshot reverts all state changes made since the given revision.
func (j *journal) revertToSnapshot(revid int, s *StateDB) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(j.validRevisions), func(i int) bool {
		return j.validRevisions[i].id >= revid
	})
	if idx == len(j.validRevisions) || j.validRevisions[idx].id != revid {
		panic(fmt.Errorf("revision id %v cannot be reverted", revid))
	}
	snapshot := j.validRevisions[idx].journalIndex

	// Replay the journal to undo changes and remove invalidated snapshots
	j.revert(s, snapshot)
	j.validRevisions = j.validRevisions[:idx]
}

// append inserts a new modification entry to the end of the change journal.
func (j *journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// core/state/statedb.go

// StateDB structs within the ethereum protocol are used to store anything
// within the merkle trie. StateDBs take care of caching and storing
// nested states. It's the general query interface to retrieve:
// ...
type StateDB struct {
    // ...
	stateObjects map[common.Address]*stateObject
	// ...
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
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// core/vm/interpreter.go

// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm   *EVM
	table *JumpTable
	// ...
	readOnly   bool   // Whether to throw on stateful modifications
	returnData []byte // Last CALL's return data for subsequent reuse
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	// Make sure the readOnly is only set if we aren't in readOnly yet.
	// This also makes sure that the readOnly flag isn't removed for child calls.
	if readOnly && !in.readOnly {
		in.readOnly = true
		defer func() { in.readOnly = false }()
	}
	// ...
	for {
        // ... (main loop) ...
		op = contract.GetOp(pc)
		operation := in.table[op]
        // ...
		res, err = operation.execute(&pc, in, callContext)
		// ...
	}
    // ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// core/vm/instructions.go

func opSstore(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	if interpreter.readOnly {
		return nil, ErrWriteProtection
	}
	loc := scope.Stack.pop()
	val := scope.Stack.pop()
	interpreter.evm.StateDB.SetState(scope.Contract.Address(), loc.Bytes32(), val.Bytes32())
	return nil, nil
}

// make log instruction function
func makeLog(size int) executionFunc {
	return func(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
		if interpreter.readOnly {
			return nil, ErrWriteProtection
		}
		// ...
	}
}

func opStaticCall(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	// ...
	// Execute the staticcall (read-only call with static restrictions)
	ret, returnGas, err := interpreter.evm.StaticCall(scope.Contract.Address(), toAddr, args, gas)
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// core/vm/evm.go

// StaticCall executes the contract associated with the addr with the given input
// as parameters while disallowing any modifications to the state during the call.
// Opcodes that attempt to perform such modifications will result in exceptions
// instead of performing the modifications.
func (evm *EVM) StaticCall(caller common.Address, addr common.Address, input []byte, gas uint64) (ret []byte, leftOverGas uint64, err error) {
	// ... (depth checks, etc.) ...

	// Initialise a new contract and set the code that is to be used by the EVM.
	contract := NewContract(caller, addr, new(uint256.Int), gas, evm.jumpDests)
	contract.SetCallCode(evm.resolveCodeHash(addr), evm.resolveCode(addr))

	// When an error was returned by the EVM or when setting the creation code
	// above we revert to the snapshot and consume any gas remaining. Additionally
	// when we're in Homestead this also counts for code storage gas errors.
	ret, err = evm.interpreter.Run(contract, input, true) // readOnly = true
	gas = contract.Gas

	// ...
	return ret, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/contract/storage_pool.go">
```go
// This file is not from go-ethereum, but from the provided Zig EVM implementation.
// It is included as it's a perfect parallel to the prompt's `MemoryPoolRegistry`.
// The concept is what's important. Geth uses `sync.Pool` for simpler objects, but
// this structured approach is very relevant.

/// Object pool for EVM storage-related hash maps to reduce allocation pressure.
const StoragePool = @This();

/// Pool of reusable access tracking maps (slot -> accessed flag)
access_maps: std.ArrayList(*std.AutoHashMap(u256, bool)),
/// Pool of reusable storage value maps (slot -> value)
storage_maps: std.ArrayList(*std.AutoHashMap(u256, u256)),
/// Allocator used for creating new maps when pool is empty
allocator: std.mem.Allocator,

/// Borrow an access tracking map from the pool.
pub fn borrow_access_map(self: *StoragePool) BorrowAccessMapError!*std.AutoHashMap(u256, bool) {
    if (self.access_maps.items.len > 0) return self.access_maps.pop() orelse unreachable;
    const map = self.allocator.create(std.AutoHashMap(u256, bool)) catch {
        return BorrowAccessMapError.OutOfAllocatorMemory;
    };
    map.* = std.AutoHashMap(u256, bool).init(self.allocator);
    return map;
}

/// Return an access map to the pool for reuse.
pub fn return_access_map(self: *StoragePool, map: *std.AutoHashMap(u256, bool)) void {
    map.clearRetainingCapacity();
    self.access_maps.append(map) catch {};
}
```
</file>
## Prompt Corrections

The original prompt describes a shared memory system that is a significant departure from the standard EVM architecture. The EVM memory model is intentionally simple and sandboxed for security and determinism; memory is not shared between different call contexts.

1.  **"Shared Memory" vs. EVM Memory**: The prompt's concept of `SharedRegion` and `SharedMemoryManager` implies that multiple, potentially unrelated, contract execution contexts can map and access the same piece of memory, similar to `mmap` or `shm` in POSIX systems. This is fundamentally different from the EVM, where each call frame gets its own private memory space that is discarded upon completion. Data is passed between contexts explicitly via `CALL` data and `RETURN` data. The provided `go-ethereum` snippets show this private memory model (`core/vm/memory.go`) and the data passing mechanism (`core/vm/return_data.go`, not included but relevant).

2.  **Copy-on-Write (CoW)**: The prompt's CoW is for memory regions. The closest analogy in `go-ethereum` is the state journaling system (`core/state/journal.go`), which provides CoW-like semantics for the *state trie*, not for EVM memory. When a call creates a snapshot, modifications are written to a journal. If the call reverts, the journal entries are used to undo the changes, leaving the parent state untouched. This is a crucial concept for implementing robust state transitions.

3.  **IPC and Opcodes**: The opcodes `SHARED_ALLOC`, `SHARED_FREE`, and `SHARED_MAP` are novel. A real-world implementation would need to consider the significant gas and security implications. The `go-ethereum` implementation of opcodes like `CALL`, `SSTORE`, and `MLOAD` in `core/vm/instructions.go` provides a template for how to structure opcode execution logic, including stack manipulation, gas accounting, and interaction with the VM state.

The provided `go-ethereum` context will help ground the implementation in battle-tested EVM concepts, even if the final feature is a novel extension. The key is to adapt the principles of EVM's memory/state management to the prompt's more advanced requirements.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// journalEntry is a modification entry in the state journal.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the address that was modified by this journal entry.
	dirtied() *common.Address
}

// journal contains the list of state modifications applied since the last state
// commit. These are used to reverse any changes in case of a transaction execution
// failure.
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

// revert undoes all modifications in the journal since a given snapshot.
func (j *journal) revert(statedb *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the anyDirtied entry
		j.entries[i].revert(statedb)

		// Drop the dirty reference
		if addr := j.entries[i].dirtied(); addr != nil {
			if j.dirties[*addr]--; j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
}

// snapshot creates a snapshot of the current journal state.
func (s *StateDB) Snapshot() int {
	return s.journal.length()
}

// RevertToSnapshot reverts all state changes made since the given snapshot.
func (s *StateDB) RevertToSnapshot(revid int) {
	s.journal.revert(s, revid)
}

// The StateDB object is the main state manager. Its journal field is
// the key component for implementing Copy-on-Write semantics.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds 'live' objects, which will be used for account freshness
	// caching. All objects are initially created based on the states in the
	// given state trie. Any modifications are firstly applied to these objects,
	// if these objects don't exist, they will be loaded from the trie first.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	// State objects are lazy loaded and stored in the state cache.
	// When a change is made to the state object, it is added
	// to the dirty set and will be flushed to the trie when Committing.
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
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// A stateObject represents a single Ethereum account, including its balance, nonce,
// code, and storage. It is the go-ethereum equivalent of a "Shared Region" as
// described in the prompt.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.StateAccount
	db       *StateDB

	// DB error.
	// stateObjects are lazy loaded and stored in the state cache.
	// When the social contract calls during the execution of a transaction
	// the smart contract might be analyzed. The `dbErr` fields is set to
	// the error that occurred, so other parts of the program can check for the
	// error.
	dbErr error

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access
	code Code // contract bytecode, which gets set when code is loaded

	origin      *stateObject // used by statedb to revert changes in parent snap
	dirty       bool         // true if the object has been modified
	dirtyFin    bool         // true if the object has been modified in finalise
	destruct    bool         // true if the object has been destructed
	suicided    bool         // true if the object has been suicided
	exist       bool         // true if the object is not empty
	preexistent bool         // whether the object existed in parent state
}

// newObject creates a state object.
func newObject(db *StateDB, address common.Address, data types.StateAccount) *stateObject {
	if data.Balance == nil {
		data.Balance = new(uint256.Int)
	}
	if data.Root == (common.Hash{}) {
		data.Root = types.EmptyRootHash
	}
	return &stateObject{
		db:          db,
		address:     address,
		addrHash:    crypto.Keccak256Hash(address[:]),
		data:        data,
		preexistent: true,
	}
}

// GetState retrieves a value from the account storage trie.
func (s *stateObject) GetState(db Database, key common.Hash) common.Hash {
	// If the storage trie is not yet cached, load it from the database
	if s.trie == nil {
		// If the object is not yet stored, there is no storage either
		if s.data.Root == types.EmptyRootHash {
			return common.Hash{}
		}
		// Retrieve the trie from the database
		tr, err := db.OpenStorageTrie(s.addrHash, s.data.Root)
		if err != nil {
			s.db.setError(err)
			return common.Hash{}
		}
		s.trie = tr
	}
	// Trie seems to be loaded, retrieve the final value
	val, err := s.trie.TryGet(key.Bytes())
	if err != nil {
		s.db.setError(err)
		return common.Hash{}
	}
	return common.BytesToHash(val)
}

// SetState updates a value in the account storage trie.
func (s *stateObject) SetState(db Database, key, value common.Hash) {
	// If the storage trie is not yet cached, load it from the database
	if s.trie == nil {
		// If the object is not yet stored, there is no storage either
		if s.data.Root == types.EmptyRootHash {
			// If all storage slots are empty, we can create an empty trie
			// right away. It will be initialized correctly on the first
			// actual storage write.
			s.trie = db.emptyTrie()
		} else {
			// Retrieve the trie from the database
			tr, err := db.OpenStorageTrie(s.addrHash, s.data.Root)
			if err != nil {
				s.db.setError(err)
				return
			}
			s.trie = tr
		}
	}
	// Storage trie loaded, modify the value and mark the object as dirty
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: s.GetState(db, key),
	})
	s.setState(key, value)
}

func (s *stateObject) setState(key, value common.Hash) {
	if err := s.trie.TryUpdate(key.Bytes(), value.Bytes()); err != nil {
		s.db.setError(err)
	}
}

// Code returns the contract code associated with this object, if any.
func (s *stateObject) Code(db Database) []byte {
	if s.code != nil {
		return s.code
	}
	if s.data.CodeHash == types.EmptyCodeHash {
		return nil
	}
	code, err := db.ContractCode(s.addrHash, common.BytesToHash(s.data.CodeHash))
	if err != nil {
		s.db.setError(err)
		return nil
	}
	s.code = code
	return code
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes the message of the EVM. It will create a new EVM and execute the
// message based on the given configuration.
func (evm *EVM) Call(caller vm.ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, vm.ErrDepth
	}
	// Fail if we're trying to execute above the local gas limit
	if gas > leftOverGas {
		return nil, gas, fmt.Errorf("%w: have %d, want %d", vm.ErrOutOfGas, gas, leftOverGas)
	}
	// Fail if we're trying to transfer more than the available balance
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, vm.ErrInsufficientBalance
	}
	// Set up the new EVM.
	var (
		to       = vm.AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	if !evm.StateDB.Exist(addr) {
		precompiles := vm.ActivePrecompiledContracts(evm.ChainConfig().Rules(evm.Context.BlockNumber, evm.Context.Random != nil, evm.Context.Time))
		if precompiles[addr] == nil && evm.ChainConfig().IsEIP158(evm.Context.BlockNumber) && value.IsZero() {
			return nil, gas, nil
		}
		evm.StateDB.CreateAccount(addr, evm.ChainConfig().IsEIP158(evm.Context.BlockNumber))
	}
	err = evm.Context.Transfer(evm.StateDB, caller.Address(), to.Address(), value)
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		return nil, gas, err
	}
	// Touch the account which is only relevant for EIP158.
	// It's a no-op for newer forks.
	evm.StateDB.AddAddressToAccessList(addr)

	// Create a new contract and execute the code.
	contract := vm.NewContract(caller, to, value, gas)
	contract.SetCallCode(addr, evm.StateDB.GetCodeHash(addr), evm.StateDB.GetCode(addr))
	contract.Input = input

	// In case of a failure, the state is reverted to the snapshot,
	// but the gas is consumed.
	ret, err = evm.interpreter.Run(contract, nil, false)
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if !errors.Is(err, vm.ErrExecutionReverted) {
			contract.UseGas(contract.Gas)
		}
	}
	return ret, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/trie/bytepool.go">
```go
// bytesPool is a pool for byte slices. It is safe for concurrent use.
type bytesPool struct {
	c chan []byte
	w int
}

// newBytesPool creates a new bytesPool. The sliceCap sets the capacity of
// newly allocated slices, and the nitems determines how many items the pool
// will hold, at maximum.
func newBytesPool(sliceCap, nitems int) *bytesPool {
	return &bytesPool{
		c: make(chan []byte, nitems),
		w: sliceCap,
	}
}

// Get returns a slice. Safe for concurrent use.
func (bp *bytesPool) Get() []byte {
	select {
	case b := <-bp.c:
		return b
	default:
		return make([]byte, 0, bp.w)
	}
}

// GetWithSize returns a slice with specified byte slice size.
func (bp *bytesPool) GetWithSize(s int) []byte {
	b := bp.Get()
	if cap(b) < s {
		return make([]byte, s)
	}
	return b[:s]
}

// Put returns a slice to the pool. Safe for concurrent use. This method
// will ignore slices that are too small or too large (>3x the cap)
func (bp *bytesPool) Put(b []byte) {
	if c := cap(b); c < bp.w || c > 3*bp.w {
		return
	}
	select {
	case bp.c <- b:
	default:
	}
}
```
</file>
</go-ethereum>

---

An advanced feature like shared memory doesn't have a direct equivalent in go-ethereum, as the EVM memory model is sandboxed per-transaction. However, we can draw inspiration from several key areas in the go-ethereum codebase that solve similar problems related to memory management, state versioning (which is analogous to Copy-on-Write), and performance optimization.

The following snippets provide patterns for:
1.  **Memory Management**: How memory is allocated, resized, and its gas cost calculated (`memory.go`). This is a good model for a single `SharedRegion`.
2.  **State Versioning (Journaling)**: How Geth tracks state changes and reverts them (`journal.go`). This is the most relevant pattern for implementing a Copy-on-Write (COW) system where changes in one context can be isolated and committed or discarded.
3.  **Object Pooling**: How Geth reuses complex objects (`map`) to reduce allocation overhead during execution (`contract.go`). This is a direct parallel to the requested `MemoryPoolRegistry`.
4.  **Opcode Integration**: How new instructions are defined and integrated into the EVM's main execution loop (`jump_table.go`, `stack.go`). This serves as a template for adding the new `SHARED_*` opcodes.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory is a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset to value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size > 0 {
		m.resize(offset + size)
		copy(m.store[offset:offset+size], value)
	}
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	m.resize(size)
}

// Get returns a slice of size length at offset.
func (m *Memory) Get(offset, size int64) []byte {
	if size == 0 {
		return nil
	}
	// It's possible to overflow when reading, e.g. MLOAD(2**256-1)
	// but this will be caught by the m.resize.
	if offset < 0 || int64(len(m.store)) < offset+size {
		return nil
	}
	return m.store[offset : offset+size]
}

// GetPtr returns a slice of size length at offset.
// GetPtr is a faster version of Get, but is not safe to use against dirty memory.
func (m *Memory) GetPtr(offset, size int64) []byte {
	// todo(rjl493456442) we can remove the size check and make it a pure pointer
	// return if we can make sure, that this is only used for read-only memory.
	if size == 0 {
		return nil
	}
	return m.store[offset : offset+size]
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}

// Data returns the contents of memory.
func (m *Memory) Data() []byte {
	return m.store
}

// resize expands the memory to size, which is a multiple of 32. If the size is smaller
// than the current memory size, it is a no-op.
func (m *Memory) resize(size uint64) {
	if size > uint64(len(m.store)) {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// memoryGasCost calculates the gas cost for memory expansion.
func memoryGasCost(memSize, newMemSize uint64) (uint64, error) {
	if newMemSize == memSize {
		return 0, nil
	}
	// memory size can't be bigger than 2^64-1 due to implementation limit,
	// so newMemSize is capped at 2^64-1.
	if newMemSize > MaxMemorySize {
		return 0, ErrGasUintOverflow
	}
	// The new memory size is the size of the memory after the expansion.
	// We need to round up to the nearest multiple of 32.
	newWords := (newMemSize + 31) / 32
	newCost := newWords*newWords/512 + 3*newWords
	if newCost < memSize {
		return 0, ErrGasUintOverflow
	}
	return newCost - memSize, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journalEntry is a modification entry in the state change journal.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(db *StateDB)

	// dirtied returns the address that was modified by this journal entry.
	dirtied() *common.Address
}

// journal contains the list of state modifications applied to the state database.
type journal struct {
	entries []journalEntry      // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// newJournal creates a new state journal.
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

// revert undoes all modifications in the journal since a given snapshot.
func (j *journal) revert(db *StateDB, snapshot int) {
	// Revert the entries in reverse order
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the entry
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

// The individual journal entry types are defined below.

// createObjectChange is a journal entry for creating a new account.
type createObjectChange struct {
	account *common.Address
}

func (ch createObjectChange) revert(db *StateDB) {
	delete(db.stateObjects, *ch.account)
	delete(db.stateObjectsDirty, *ch.account)
}

func (ch createObjectChange) dirtied() *common.Address {
	return ch.account
}

// storageChange is a journal entry for changing a storage slot.
type storageChange struct {
	account       *common.Address
	key           common.Hash
	prevalue      common.Hash
	prevExisted   bool
	prevSisyphusd bool
}

func (ch storageChange) revert(db *StateDB) {
	db.stateObjects[*ch.account].setStorage(ch.key, ch.prevalue, ch.prevExisted, ch.prevSisyphusd)
}

func (ch storageChange) dirtied() *common.Address {
	return ch.account
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// storagePool is an object pool for the StateDB's storage maps.
//
// Using a pool is convenient because it's hard to guess the exact number of maps
// needed by a transaction. Most transactions need very few maps, but created contracts
// and complex contracts still need a lot.
var storagePool = &sync.Pool{
	New: func() interface{} {
		return make(Storage)
	},
}

// newStorage is a convenience method for obtaining a storage map from the pool.
func newStorage() Storage {
	return storagePool.Get().(Storage)
}

// returnStorage is a convenience method for returning a storage map to the pool.
func returnStorage(s Storage) {
	// We can't use mapclear here because that was only introduced in go 1.21.
	// Supporting older versions of Go is important for us because we're a library.
	// TODO: use mapclear when we can assume go 1.21.
	for k := range s {
		delete(s, k)
	}
	storagePool.Put(s)
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements the EVM interface
// for accessing underlying state information.
type Contract struct {
	// CallerAddress is the result of the CALLER opcode (certain native contracts
	// willpike and delegate to this contract and this will be the address of the
	// said contract). It is what the contract returns on a CALLER opcode.
	//
	// Deprecated: Do not use. It is for internal use only.
	CallerAddress common.Address
	self          common.Address
	jumpdests     destinations // result of JUMPDEST analysis.
	analysis      []byte         // result of code analysis
	Code          []byte
	CodeHash      common.Hash
	Input         []byte
	Gas           uint64
	value         *big.Int

	// For EIP-2929, we need to keep track of all storage slots and addresses that have
	// been accessed in the current transaction.
	accessedStorage  map[common.Hash]struct{}
	accessedSubstate map[common.Address]struct{}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// JumpTable is a lookup table for EVM opcodes.
type JumpTable [256]operation

// newFrontierInstructionSet returns the frontier gas table, which is the first interoperable version of
// the rules.
func newFrontierInstructionSet() JumpTable {
	// Note: gas calculations are not included here, this is just to show the structure.
	jt := JumpTable{
		STOP: {
			execute:     opStop,
			gas:         0,
			minStack:    minStack(0, 0),
			maxStack:    maxStack(0, 0),
		},
		ADD: {
			execute:     opAdd,
			gas:         GasFastestStep,
			minStack:    minStack(2, 1),
			maxStack:    maxStack(2, 1),
		},
		// ... Other opcodes
		MSTORE: {
			execute:     opMstore,
			gas:         GasFastestStep,
			minStack:    minStack(2, 0),
			maxStack:    maxStack(2, 0),
			memorySize:  memoryMStore,
		},
		// ...
	}
	return jt
}

// newByzantiumInstructionSet returns the gas table of the Byzantium rules.
func newByzantiumInstructionSet() JumpTable {
	jt := newFrontierInstructionSet()
	// ... Opcodes added/changed in Byzantium
	jt[REVERT] = operation{
		execute:    opRevert,
		gas:        0,
		minStack:   minStack(2, 0),
		maxStack:   maxStack(2, 0),
		memorySize: memoryRevert,
	}
	// ...
	return jt
}

// operation is the low-level representation of an opcode.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// gas is the constant gas cost of the operation
	gas      uint64
	// minStack specifies the minimum stack height required by the opcode.
	minStack int
	// maxStack specifies the maximum stack height required by the opcode.
	maxStack int
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a contract's computational stack.
type Stack struct {
	data []*big.Int
}

// NewStack returns a new stack with a backing store of the appropriate size.
func NewStack() *Stack {
	return &Stack{data: make([]*big.Int, 0, 1024)}
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []*big.Int {
	return st.data
}

// push pushes a new value on to the stack.
func (st *Stack) push(d *big.Int) {
	st.data = append(st.data, d)
}

// Pop pops the top value off the stack and returns it.
func (st *Stack) pop() (ret *big.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// opPush1 is a helper function to avoid code duplication.
func opPush1(pc *uint64, code []byte, stack *Stack, contract *Contract) ([]byte, error) {
	codeLen := uint64(len(code))
	start := *pc + 1
	if start > codeLen {
		start = codeLen
	}
	end := start + 1
	if end > codeLen {
		end = codeLen
	}
	stack.push(new(big.Int).SetBytes(common.RightPadBytes(code[start:end], 32)))
	*pc += 1
	return nil, nil
}
```
</file>
## Prompt Corrections

The original prompt describes an advanced shared memory system that goes significantly beyond the EVM's current design as implemented in clients like go-ethereum. Here are some clarifications based on Geth's architecture:

1.  **Inter-Process Communication (IPC)**: The term "IPC" is generally used for communication between separate operating system processes. The EVM, as implemented in Geth, is single-threaded per transaction. Data sharing happens between different *execution contexts* within that single transaction (e.g., when one contract calls another). The prompt's design is more aligned with "Inter-Context Communication" rather than traditional IPC. A true multi-process shared memory system would be a fundamental departure from the current EVM model.

2.  **Memory Model**: The EVM's memory is transient and private to a single transaction execution. The prompt's concept of a `SharedRegion` that can be mapped by different contracts or contexts implies a new, persistent memory space outside the standard EVM memory, stack, and storage. This is a novel feature. The patterns in `core/vm/memory.go` are a good starting point for managing a single memory region, but the sharing and mapping logic would need to be built from scratch.

3.  **Copy-on-Write (COW) and State**: While the prompt applies COW to general-purpose memory regions, the most direct and powerful parallel in Geth is the `journal` in `core/state/journal.go`. This system versions all state changes (storage, balance, etc.) and allows for atomic commits or reverts. This is an excellent model for implementing COW semantics for your shared memory regions. When a context writes to a shared region, it would create a `storageChange`-like entry in a journal. If the context reverts, the original memory is preserved; if it commits, the change is applied.

4.  **Memory Pools**: The request for memory pools is a sound performance optimization. Geth uses this exact pattern in `core/vm/contract.go` with its `storagePool` to reuse `map` objects for `SSTORE` and `SLOAD` gas calculations, avoiding frequent allocations and reducing GC pressure. This is a perfect reference for your `MemoryPoolRegistry`.

---

This is an excellent and very detailed prompt. Implementing a shared memory system is a complex task. While `go-ethereum`'s EVM does not have a direct equivalent to the proposed shared memory manager, it contains several concepts and implementations that are highly relevant to your task, particularly around state management, memory scope, and handling new data types like blobs.

Here are the most relevant code snippets from `go-ethereum` to provide context for your implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory implements a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset to value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size == 0 {
		return
	}
	// length of store may never be less than offset + size.
	// The store should be resized PRIOR to calling set.
	copy(m.store[offset:offset+size], value)
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// Get returns offset + size as a new slice.
func (m *Memory) Get(offset, size int64) (cpy []byte) {
	if size == 0 {
		return nil
	}
	if len(m.store) > int(offset) {
		cpy = make([]byte, size)
		copy(cpy, m.store[offset:offset+size])
		return
	}
	return nil
}

// GetPtr returns a slice that references the internal memory.
func (m *Memory) GetPtr(offset, size int64) []byte {
	if size == 0 {
		return nil
	}
	if len(m.store) < int(offset+size) {
		return nil
	}
	return m.store[offset : offset+size]
}

// Len returns the length of the backing slice.
func (m *Memory) Len() int {
	return len(m.store)
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
	stateObjects        map[common.Address]*stateObject
	stateObjectsPending map[common.Address]struct{} // state objects that have been modified and need to be written to the trie
	stateObjectsDirty   map[common.Address]struct{} // state objects that have been modified and need to be written to the trie

	// DB error.
	// State objects are lazy loaded and stored in the cache. Database errors will
	// be returned by any operation that relies on state objects being loaded.
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

	// Measurements gathered during execution for debugging purposes
	AccountReads         time.Duration
	AccountUpdates       time.Duration
	StorageReads         time.Duration
	StorageUpdates       time.Duration
	SnapshotAccountReads time.Duration
	SnapshotStorageReads time.Duration
	TrieCommit           time.Duration

	// Per-transaction state cache
	tstate StateCache

	// The rules of the current fork
	rules *params.Rules
}

// ...

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

// ...

// AddTState adds a transient storage entry to the executing contract's journal.
// This is meant to be called by the TSTORE opcode, and needs to be called **before**
// the state is actually changed, so the journal can revert to the correct previous
// value.
func (s *StateDB) AddTState(addr common.Address, key common.Hash, value common.Hash) {
	s.journal.append(transientStorageChange{
		account:  &addr,
		key:      key,
		prevalue: s.GetTState(addr, key),
	})
	s.SetTState(addr, key, value)
}

// GetTState gets a transient storage entry.
func (s *StateDB) GetTState(addr common.Address, key common.Hash) common.Hash {
	return s.tstate.Get(addr, key)
}

// SetTState sets a transient storage entry.
func (s *StateDB) SetTState(addr common.Address, key, value common.Hash) {
	s.tstate.Set(addr, key, value)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opSstore implements the SSTORE operation.
func opSstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// The read-only state can be checked here, but it's also checked by the
	// state transition object, so we can omit it.
	// if evm.readOnly {
	// 	return nil, ErrWriteProtection
	// }
	loc := stack.pop()
	val := stack.pop()
	err := evm.StateDB.SetState(contract.Address(), loc, val)
	return nil, err
}

// opTload implements the TLOAD operation.
func opTload(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	loc := stack.peek()
	val := evm.StateDB.GetTState(contract.Address(), loc)
	loc.SetBytes(val[:])
	return nil, nil
}

// opTstore implements the TSTORE operation.
func opTstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	if evm.readOnly {
		return nil, ErrWriteProtection
	}
	loc := stack.pop()
	val := stack.pop()

	evm.StateDB.AddTState(contract.Address(), loc, val)
	return nil, nil
}

// opBlobhash implements the BLOBHASH operation.
func opBlobhash(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	index := stack.peek()
	versionedHashes := evm.TxContext.BlobHashes
	if !index.IsUint64() || index.Uint64() >= uint64(len(versionedHashes)) {
		index.Clear()
	} else {
		index.SetBytes(versionedHashes[index.Uint64()][:])
	}
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// BlockContext provides the EVM with information about the current block.
type BlockContext struct {
	// CanTransfer returns whether the account has enough money for a transfer. This is
	// used by the CALL-based opcodes to check for rentrancy attacks.
	CanTransfer CanTransferFunc
	// Transfer transfers ether from one account to the other.
	Transfer TransferFunc
	// GetHash returns the hash for a given block number.
	GetHash GetHashFunc

	// Mainnet block context values
	Coinbase    common.Address // The current block's coinbase address
	GasLimit    uint64         // The current block's gas limit
	BlockNumber *big.Int       // The current block's number
	Time        uint64         // The current block's timestamp
	Difficulty  *big.Int       // The current block's difficulty
	BaseFee     *big.Int       // The current block's base fee
	Random      *common.Hash   // The current block's random mix digest

	// EIP-4844 block context values
	BlobBaseFee *big.Int // The current block's blob base fee
}

// TxContext provides the EVM with information about the current transaction.
type TxContext struct {
	// EIP-4844 transaction context values
	BlobHashes  []common.Hash // The versioned hashes of blobs in the current transaction
	BlobGasUsed uint64        // The blob gas consumed by the transaction
}


// EVM is the Ethereum Virtual Machine base object and provides
// the necessary tools to run a contract on the given state with
// the provided context. It should be noted that the EVM is not
// thread safe.
type EVM struct {
	// Context provides information about the current blockchain
	// and transaction.
	BlockContext
	TxContext

	// StateDB gives access to the underlying state.
	StateDB StateDB

	// depth is the current call stack
	depth int

	// chain rules
	chainConfig *params.ChainConfig

	// virtual machine configuration options used to initialise the
	// execution environment.
	vmConfig Config

	// readOnly is a flag indicating whether the EVM is in read only mode.
	readOnly bool

	// returnData is the data returned by the last call or create
	returnData []byte
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		BlockContext: blockCtx,
		TxContext:    txCtx,
		StateDB:      statedb,
		chainConfig:  chainConfig,
		vmConfig:     vmConfig,
	}
	return evm
}

// ...

// Call executes a new contract call with the given input data.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute a static call with value
	if evm.readOnly && value.Sign() > 0 {
		return nil, gas, ErrWriteProtection
	}
	// ... (snapshotting and value transfer logic) ...
	
	// Create a new contract and set the code that is to be used by the EVM.
	// Note that the evaluate method will use a cached tab of the code.
	code, codeHash := evm.StateDB.GetCode(addr), evm.StateDB.GetCodeHash(addr)
	if len(code) == 0 {
		return nil, gas, nil
	}
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, codeHash, code)

	// Create a new EVM and run the code, ...
	subevm := NewEVM(evm.BlockContext, evm.TxContext, evm.StateDB, evm.chainConfig, evm.vmConfig)
	subevm.depth = evm.depth + 1
	subevm.readOnly = evm.readOnly
	
	ret, err = run(subevm, contract, input, false)

	// ...
	return ret, contract.Gas, err
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
// AccountRef is used by the vm to specified the executing context of the
// contract, specified by the given address.
type AccountRef common.Address

// Address returns the address of the contract.
func (ar AccountRef) Address() common.Address {
	return (common.Address)(ar)
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the CALLER opcode (EVM)
	CallerAddress common.Address
	// caller is a reference to the contract's caller, to be used in run
	caller ContractRef
	// self is a reference to the contract itself, to be used in run
	self ContractRef

	jumpdests map[common.Hash]bitvec // Aggregated result of JUMPDEST analysis.
	analysis  bitvec                 // JUMPDEST analysis result that's used by default.

	Code     []byte
	CodeHash common.Hash
	input    []byte
	Gas      uint64

	value *big.Int
}

// NewContract returns a new contract environment for the execution of EVM
// without a backing state object. The returned contract is a 'pre-version' of
// the final contract which has the code of the calling contract since it's not
// yet known whether the code is call-code or regular code.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{
		caller: caller,
		self:   object,
		value:  new(big.Int),
	}
	// Gas should be a pointer so it can safely be reduced through different
	// functions.
	c.Gas = gas
	// In case of a value transfer this is required by the EVM to check for
	// non re-entrancy.
	if value != nil {
		c.value.Set(value)
	}

	return c
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// JumpTable contains the EVM opcodes supported by a given fork.
type JumpTable [256]operation

// NewJumpTable returns a new jump table. The returned jump table will be filled with
// the opcodes supported by the given chain configuration.
func NewJumpTable(rules *params.Rules) *JumpTable {
	jt := new(JumpTable)
	for i, op := range opcodes {
		if op != nil {
			// set the generic jump table
			jt[i] = *op
		}
	}
	// Overwrite the generic jump table with the Byzantium rules
	if rules.IsByzantium {
		for i, op := range byzantiumOpcodes {
			if op != nil {
				jt[i] = *op
			}
		}
	}
	// Overwrite the Byzantium jump table with the Constantinople rules
	if rules.IsConstantinople {
		for i, op := range constantinopleOpcodes {
			if op != nil {
				jt[i] = *op
			}
		}
	}
	// Overwrite the Constantinople jump table with the Istanbul rules
	if rules.IsIstanbul {
		for i, op := range istanbulOpcodes {
			if op != nil {
				jt[i] = *op
			}
		}
	}
	// Overwrite the Istanbul jump table with the Berlin rules
	if rules.IsBerlin {
		for i, op := range berlinOpcodes {
			if op != nil {
				jt[i] = *op
			}
		}
	}
	// Overwrite the Berlin jump table with the London rules
	if rules.IsLondon {
		for i, op := range londonOpcodes {
			if op != nil {
				jt[i] = *op
			}
		}
	}
	// Overwrite the London jump table with the Shanghai rules
	if rules.IsShanghai {
		for i, op := range shanghaiOpcodes {
			if op != nil {
				jt[i] = *op
			}
		}
	}
	// Overwrite the Shanghai jump table with the Cancun rules
	if rules.IsCancun {
		for i, op := range cancunOpcodes {
			if op != nil {
				jt[i] = *op
			}
		}
	}
	// Overwrite the Cancun jump table with the Prague rules
	if rules.IsPrague {
		for i, op := range pragueOpcodes {
			if op != nil {
				jt[i] = *op
			}
		}
	}
	// Overwrite the Prague jump table with the Osaka rules
	if rules.IsOsaka {
		for i, op := range osakaOpcodes {
			if op != nil {
				jt[i] = *op
			}
		}
	}
	return jt
}

```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides a very comprehensive and ambitious set of specifications for a shared memory system. It's well-structured but seems to be designed in a vacuum without considering existing EVM concepts. Here are some corrections and suggestions based on go-ethereum's implementation:

1.  **Analogy to Existing Features**: Instead of a completely new, generic shared memory system, consider how existing EVM features achieve similar goals. The proposed system has parallels to:
    *   **EIP-1153: Transient Storage (`TSTORE`/`TLOAD`)**: This is the closest existing feature to what you're describing. It provides a key-value store that is shared across all call contexts *within a single transaction* and is discarded at the end. This is a form of Inter-Process Communication (IPC) within a transaction's scope. Your `SharedRegion` could be implemented as a more feature-rich version of this, perhaps with namespacing.
    *   **EIP-4844: Blob Transactions**: This EIP introduced a new "blob space," which is a large, read-only data region available to a transaction via the `BLOBHASH` opcode. This is analogous to your concept of large, shared, read-only memory regions. It's a great model for how to pass large, shared data into the EVM context.

2.  **Memory Model vs. State**: The prompt mixes concepts of volatile memory (like RAM) and persistent state.
    *   **Geth's `Memory` object (`core/vm/memory.go`)** is truly volatile and scoped to a single EVM execution context (a single `CALL`). It is not shared between calls in the way your prompt suggests.
    *   **Geth's `StateDB` (`core/state/statedb.go`)** is where persistent (`SSTORE`) and transient (`TSTORE`) storage live. This is where cross-call data sharing happens.
    *   **Suggestion**: Your `SharedRegion` sounds more like a new type of *state* rather than an extension of the EVM's linear memory. The opcodes `SHARED_READ` and `SHARED_WRITE` are analogous to `SLOAD`/`SSTORE` or `TLOAD`/`TSTORE`.

3.  **Copy-on-Write (CoW)**: The EVM's state management uses a `journal` and `snapshot/revert` mechanism, which is conceptually very similar to CoW.
    *   When a contract is called, the `StateDB` takes a snapshot.
    *   All state modifications (e.g., `SSTORE`) are recorded in a journal.
    *   If the call reverts, the journal is used to undo all changes, reverting to the snapshot.
    *   If the call succeeds, the changes are committed to the parent context's journal.
    *   **Suggestion**: Instead of implementing a complex CoW manager from scratch, your implementation should leverage or extend the existing journaled state database (`StateDB` in Geth). This is a battle-tested, secure, and efficient way to manage state changes and reverts.

4.  **Memory Pools**: While memory pools are a valid optimization, Geth's state management achieves similar efficiency through caching of `stateObject`s and trie nodes. The `StoragePool` in your prompt seems to want to pool the `map` used for a contract's storage. A simpler and more integrated approach would be to follow Geth's pattern: cache the entire contract state object (`stateObject`) rather than just the map. This keeps related data together and is more cache-friendly.

By grounding your implementation in these existing, proven concepts from `go-ethereum`, you will create a feature that is more robust, secure, and better integrated with the overall EVM architecture.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/memory.go">
```go
// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.

// ... license header ...

package vm

import (
	"errors"
	"math"

	"github.com/ethereum/go-ethereum/params"
)

// Memory represents the EVM's memory.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset + size to value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size > 0 {
		// The offset can be very large, we can't allocate memory for that
		if offset > math.MaxInt64-size {
			// This will surely be OOG in the gas calculation before we get here
			panic("memory address overflow")
		}
		// The size can be very large, but we can't allocate memory for that
		if size > math.MaxInt64 {
			// This will surely be OOG in the gas calculation before we get here
			panic("memory size overflow")
		}
		// if the offset is not in memory, it needs to be allocated first
		if offset+size > uint64(len(m.store)) {
			// this will be checked against memory limit in gas calculation
			// and should not fail here
			panic("invalid memory: store empty")
		}
		copy(m.store[offset:offset+size], value)
	}
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		// The size can be very large, but we can't allocate memory for that
		if size > math.MaxInt64 {
			panic("memory size overflow")
		}
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// Get returns offset + size as a new slice.
func (m *Memory) Get(offset, size int64) (cpy []byte) {
	// The offset can be very large, we can't allocate memory for that
	if offset > math.MaxInt64-size {
		// This will surely be OOG in the gas calculation before we get here
		panic("memory address overflow")
	}
	// The size can be very large, but we can't allocate memory for that
	if size > math.MaxInt64 {
		// This will surely be OOG in the gas calculation before we get here
		panic("memory size overflow")
	}
	// Safely check whether offset + size is within bound.
	if size == 0 {
		return nil
	}
	// When offset is not in memory, get empty slice of size
	if int64(len(m.store)) < offset {
		return make([]byte, size)
	}
	// When offset is in memory, calculate the end of slice
	end := offset + size
	// end may exceed capacity, but it's safe to use with slice
	// because it will be bound to the capacity
	if end > int64(len(m.store)) {
		end = int64(len(m.store))
	}
	// copy the slice and return
	cpy = make([]byte, size)
	copy(cpy, m.store[offset:end])
	return cpy
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/gas.go">
```go
// ... license header ...

package vm

import (
	"errors"
	"math"

	"github.com/ethereum/go-ethereum/params"
)

// gasMem returns the gas charged for memory expansion.
func gasMem(mem *Memory, newSize uint64) (uint64, error) {
	if newSize == 0 {
		return 0, nil
	}
	// The maximum newSize is capped at 2^64-1, which can cause overflow
	// in the gas calculation. So we cap the gas cost at the cost of the largest
	// memory size that can be safely handled by the gas calculation.
	// This is 2^32-1 words, or (2^32-1)*32 bytes.
	// The rationale for this value is that the intermediate value in the gas
	// calculation is newSizeInWords^2. This should not overflow a uint64.
	// So newSizeInWords should be at most sqrt(2^64-1), which is 2^32-1.
	if newSize > params.MaxGasMemSize {
		return 0, errGasUintOverflow
	}
	// memory gas, see yellow paper appendix g
	newSizeWords := (newSize + 31) / 32
	newSize = newSizeWords * 32

	// The cost of memory is calculated as:
	// Cmem(a) = Gmem * a + a*a / Gquadcoeffdiv
	// where a is the number of words.
	// Here, we calculate the gas *cost for the new size*.
	// The cost of the new area is new total cost - old total cost.
	oldSize := uint64(mem.Len())
	oldSizeWords := (oldSize + 31) / 32

	if newSize > oldSize {
		// quadratic component
		newTotalCost := newSizeWords*newSizeWords/params.MemoryGasQuadCoeffDiv + newSizeWords*params.MemoryGasLinear
		oldTotalCost := oldSizeWords*oldSizeWords/params.MemoryGasQuadCoeffDiv + oldSizeWords*params.MemoryGasLinear
		return newTotalCost - oldTotalCost, nil
	}
	return 0, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/statedb.go">
```go
// ... license header ...

package vm

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

// journalEntry is a modification entry in the state change journal.
type journalEntry interface {
	// revert undoes the state change journalled by this entry.
	revert(db *StateDB)
	// dirtied returns the address that was modified by this journal entry.
	// An empty address is returned if the entry does not touch any account.
	dirtied() *common.Address
}

// ... (multiple journalEntry types like createObjectChange, storageChange, etc.) ...

// journal contains the list of state modifications applied to the current state trie.
type journal struct {
	entries  []journalEntry         // Current changes tracked by the journal
	// ...
}

// ... other StateDB methods ...

// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	id := s.nextRevisionId
	s.nextRevisionId++
	s.validRevisions = append(s.validRevisions, revision{id, len(s.journal.entries)})
	return id
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	// Find the snapshot in the stack of valid revisions.
	idx := -1
	for i, r := range s.validRevisions {
		if r.id == revid {
			idx = i
			break
		}
	}
	if idx == -1 {
		panicf("revision id %v cannot be reverted", revid)
	}
	// Replay the journal to specified snapshot.
	snapshot := s.validRevisions[idx].journalIndex
	if snapshot > len(s.journal.entries) {
		panicf("snapshot index %d is out of bounds", snapshot)
	}
	for i := len(s.journal.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the operation.
		s.journal.entries[i].revert(s)
	}
	s.journal.entries = s.journal.entries[:snapshot]

	// Cut the valid snapshot stack.
	s.validRevisions = s.validRevisions[:idx]
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
```go
// ... license header ...

package vm

// ... (imports) ...

// Run starts execution of the contract's code and returns the result.
func (in *Interpreter) Run(contract *Contract, input []byte) (ret []byte, err error) {
	// ... (setup) ...

	// The read-only flag is inherited from the caller
	in.readOnly = contract.readOnly
	// ...

	for {
		// ... (opcode fetch, stack dump logic) ...

		op := contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		if !operation.valid {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		// ...
		// If the operation is valid, enforce write restrictions
		if in.readOnly && operation.writes {
			return nil, ErrWriteProtection
		}
		// ...
		// Execute the operation
		res, err := operation.execute(&pc, in, contract, mem, stack)
		if err != nil {
			return nil, err
		}
		// ...
		pc++
	}
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/instructions.go">
```go
// ... license header ...

package vm

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// opCall is the general CALL operation.
func opCall(pc *uint64, evm *EVM, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length from the stack
	gas, addr, value, argsOffset, argsSize, retOffset, retSize := stack.Pop7()
	gas = memoryGasCost(mem, gas) // Calculate memory expansion gas cost first

	// Ensure that the requested gas is not more than the maximum allowed.
	if gas > params.MaxUint64 {
		return nil, ErrGasUintOverflow
	}
	gas64 := gas.Uint64()

	// ... (gas calculation logic, including 63/64 rule) ...

	// Take snapshot of state.
	snapshot := evm.StateDB.Snapshot()

	// Transfer value. This may create a new account.
	transfer(evm.StateDB, contract.Address(), addr, value)

	// Call the contract.
	ret, returnGas, err := evm.Call(contract, addr, mem.GetPtr(int64(argsOffset.Uint64()), int64(argsSize.Uint64())), gas64, value)

	// ... (error handling and revert logic) ...

	// Copy return data to memory.
	mem.Set(retOffset.Uint64(), retSize.Uint64(), ret)
	
	// Push result to stack
	if err != nil {
		stack.Push(common.Big0)
	} else {
		stack.Push(common.Big1)
	}
	return nil, nil
}

// opTload loads a word from transient storage.
func opTload(pc *uint64, evm *EVM, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	loc := stack.Pop()
	val := evm.StateDB.GetTransientState(contract.Address(), common.Hash(loc.Bytes32()))
	stack.Push(val.Big())
	return nil, nil
}

// opTstore stores a word to transient storage.
func opTstore(pc *uint64, evm *EVM, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	if evm.readOnly {
		return nil, ErrWriteProtection
	}
	loc, val := stack.Pop(), stack.Pop()
	evm.StateDB.SetTransientState(contract.Address(), common.Hash(loc.Bytes32()), common.Hash(val.Bytes32()))
	return nil, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// ... license header ...

package vm

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/params"
)

// EVM is the Ethereum Virtual Machine base object for the execution of contracts.
type EVM struct {
	// Context provides information about the current transaction and block.
	Context
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// depth is the current call stack
	depth int
	// chain rules
	chainRules params.Rules
	// virtual machine configuration options
	vmConfig Config
	// global gas pool
	gasPool *GasPool
	// read only switch
	readOnly bool // Whether to throw on state changing operations
	// return data
	returnData []byte
}

// Call executes the contract associated with the destination address.
// It returns the retrieved data and leftover gas and an error if it failed.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to change state from a static context
	if evm.readOnly && value.Sign() != 0 {
		return nil, gas, ErrWriteProtection
	}
	// ... (snapshotting and value transfer logic) ...

	p, isPrecompile := evm.precompile(addr)
	if isPrecompile {
		// ... (precompile execution logic) ...
	} else {
		// Create a new contract object for the call.
		code := evm.StateDB.GetCode(addr)
		// ... (code checks, including empty code) ...

		// Create a new memory instance for this call.
		memory := NewMemory()
		
		// Create a new contract and new interpreter and run it
		contract := NewContract(caller, AccountRef(addr), value, gas)
		contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), code)
		
		// Run the contract.
		ret, err = run(evm, contract, input, false)
	}

	// When the execution finishes, retrieve the leftover gas and return it
	leftOverGas = contract.Gas
	return ret, leftOverGas, err
}
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt describes a "Shared Memory" system with features like Copy-on-Write and Memory Pools, which are not native to the standard EVM. The Go-Ethereum implementation, like all standard EVM implementations, enforces strict isolation between contract execution contexts. Memory is ephemeral and per-call.

The provided Go-Ethereum snippets are **analogues** to guide the implementation of such a new system, not direct examples of it.

1.  **Shared Regions & COW vs. Journaling**:
    The request for shared memory regions with copy-on-write (COW) semantics is conceptually similar to how `go-ethereum` handles nested state changes. Instead of COW on memory, `geth` uses a **journal** (`core/vm/statedb.go`) to log all state modifications (balance changes, storage writes, etc.). When a sub-call reverts (`REVERT`), the journal is used to undo all changes made within that call frame, effectively acting like a snapshot/revert system for state. This journaling mechanism is the most relevant analogue for implementing the requested isolated, revertible contexts.

2.  **Inter-Context Communication**:
    The EVM's native way of sharing data between contexts is through explicit `CALL`s and their return data. The `core/vm/evm.go` and `core/vm/instructions.go` snippets for `opCall` and `EVM.Call` demonstrate how a new execution frame is created, state is snapshotted, and data is passed and returned. This is the model to follow for the proposed `SHARED_MAP` opcode.

3.  **A Better Analogue: Transient Storage (EIP-1153)**:
    The *closest existing EVM feature* to what is being requested is **Transient Storage**, introduced in EIP-1153. It allows different contracts within the *same transaction* to read and write to a temporary, shared key-value store. This storage is wiped at the end of each transaction. The opcodes are `TLOAD` and `TSTORE`. This is a much better starting point than inventing a completely new shared memory system. The `go-ethereum` implementation of these opcodes in `core/vm/instructions.go` is highly relevant.

4.  **Memory Pools**:
    The EVM's memory model is a simple, linearly expanding byte array. It does not use memory pools for performance. The `core/vm/memory.go` and `core/vm/gas.go` snippets show this fundamental model, including the crucial quadratic gas cost for expansion, which any new memory system must account for.

5.  **Access Control**:
    The prompt's `AccessController` can be analogized to the `readOnly` flag in `go-ethereum`'s interpreter. As shown in `core/vm/interpreter.go`, this flag is checked before any state-modifying opcode is executed, preventing writes in a `STATICCALL` context. This is the pattern to follow for implementing permission checks.



## EVMONE Context

An excellent and detailed prompt. The proposed shared memory system is a significant extension to the standard EVM model. The `evmone` codebase provides several analogous patterns that are highly relevant for this implementation, especially in how it handles memory, state access via the host interface, and precompiled contracts.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
/// The EVM memory.
///
/// The implementations uses initial allocation of 4k and then grows capacity with 2x factor.
/// Some benchmarks have been done to confirm 4k is ok-ish value.
class Memory
{
    /// The size of allocation "page".
    static constexpr size_t page_size = 4 * 1024;

    struct FreeDeleter
    {
        void operator()(uint8_t* p) const noexcept { std::free(p); }
    };

    /// Owned pointer to allocated memory.
    std::unique_ptr<uint8_t[], FreeDeleter> m_data;

    /// The "virtual" size of the memory.
    size_t m_size = 0;

    /// The size of allocated memory. The initialization value is the initial capacity.
    size_t m_capacity = page_size;
    
    // ...

public:
    /// Creates Memory object with initial capacity allocation.
    Memory() noexcept { allocate_capacity(); }

    uint8_t& operator[](size_t index) noexcept { return m_data[index]; }

    [[nodiscard]] const uint8_t* data() const noexcept { return m_data.get(); }
    [[nodiscard]] size_t size() const noexcept { return m_size; }

    /// Grows the memory to the given size. The extent is filled with zeros.
    ///
    /// @param new_size  New memory size. Must be larger than the current size and multiple of 32.
    void grow(size_t new_size) noexcept;
    
    // ...
};

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
    
    // ...

    /// Stack space allocation.
    StackSpace stack_space;

    ExecutionState() noexcept = default;

    ExecutionState(const evmc_message& message, evmc_revision revision,
        const evmc_host_interface& host_interface, evmc_host_context* host_ctx,
        bytes_view _code) noexcept
      : msg{&message}, host{host_interface, host_ctx}, rev{revision}, original_code{_code}
    {}

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

    // ... gas checks ...

    const auto key = intx::be::store<evmc::bytes32>(stack.pop());
    const auto value = intx::be::store<evmc::bytes32>(stack.pop());

    // ... gas calculation based on warm/cold access and value change ...

    if ((gas_left -= gas_cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};
    state.gas_refund += gas_refund;
    
    // ... set storage via host ...
    state.host.set_storage(state.msg->recipient, key, value);

    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles_internal.hpp">
```cpp
// This header shows the function signatures for the analyze and execute
// phases of precompiles, which is a useful pattern for new opcodes.

struct ExecutionResult
{
    evmc_status_code status_code;
    size_t output_size;
};

struct PrecompileAnalysis
{
    int64_t gas_cost;
    size_t max_output_size;
};

// Gas analysis function for the IDENTITY precompile.
PrecompileAnalysis identity_analyze(evmc::bytes_view input, evmc_revision rev) noexcept;

// Execution function for the IDENTITY precompile.
ExecutionResult identity_execute(
    const uint8_t* input, size_t input_size, uint8_t* output, size_t output_size) noexcept;
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles.cpp">
```cpp
// Example implementation of the `analyze` and `execute` functions for
// the IDENTITY precompile (0x04).

namespace
{
constexpr auto GasCostMax = std::numeric_limits<int64_t>::max();

constexpr int64_t num_words(size_t size_in_bytes) noexcept
{
    return static_cast<int64_t>((size_in_bytes + 31) / 32);
}

template <int BaseCost, int WordCost>
constexpr int64_t cost_per_input_word(size_t input_size) noexcept
{
    return BaseCost + WordCost * num_words(input_size);
}
}  // namespace

PrecompileAnalysis identity_analyze(bytes_view input, evmc_revision /*rev*/) noexcept
{
    return {cost_per_input_word<15, 3>(input.size()), input.size()};
}

ExecutionResult identity_execute(const uint8_t* input, size_t input_size, uint8_t* output,
    [[maybe_unused]] size_t output_size) noexcept
{
    assert(output_size >= input_size);
    std::copy_n(input, input_size, output);
    return {EVMC_SUCCESS, input_size};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_calls.cpp">
```cpp
template <Opcode Op>
Result call_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    // ...
    const auto gas = stack.pop();
    const auto dst = intx::be::trunc<evmc::address>(stack.pop());
    const auto value = (Op == OP_STATICCALL || Op == OP_DELEGATECALL) ? 0 : stack.pop();
    const auto has_value = value != 0;
    const auto input_offset_u256 = stack.pop();
    const auto input_size_u256 = stack.pop();
    const auto output_offset_u256 = stack.pop();
    const auto output_size_u256 = stack.pop();

    stack.push(0);  // Assume failure.
    state.return_data.clear();
    
    // ... access checks and gas calculations ...

    if (!check_memory(gas_left, state.memory, input_offset_u256, input_size_u256))
        return {EVMC_OUT_OF_GAS, gas_left};

    if (!check_memory(gas_left, state.memory, output_offset_u256, output_size_u256))
        return {EVMC_OUT_OF_GAS, gas_left};
    
    // ...
    
    evmc_message msg{.kind = to_call_kind(Op)};
    // ... set up message ...
    
    const auto result = state.host.call(msg);
    state.return_data.assign(result.output_data, result.output_size);
    stack.top() = result.status_code == EVMC_SUCCESS;

    if (const auto copy_size = std::min(output_size, result.output_size); copy_size > 0)
        std::memcpy(&state.memory[output_offset], result.output_data, copy_size);

    // ... update gas ...
    return {EVMC_SUCCESS, gas_left};
}
```
</file>
</evmone>

## Prompt Corrections
The proposed `SharedMemoryManager` is an excellent abstraction for a feature that significantly extends the standard EVM's capabilities. Here are a few notes based on `evmone`'s design to help guide the implementation:

1.  **Memory Model Analogy**: The prompt's `SharedRegion` is analogous to `evmone`'s `Memory` class (from `lib/evmone/execution_state.hpp`), which manages a simple, dynamically growing buffer for a single execution context. The key difference is that the proposed `SharedRegion` is designed to be accessible across multiple contexts, which is a powerful extension not present in the standard EVM.

2.  **Opcodes and Host Interaction**: The proposed `execute_shared_read` and `execute_shared_write` functions are conceptually similar to `evmone`'s `sload` and `sstore` opcodes (from `lib/evmone/instructions_storage.cpp`). These opcodes act as a bridge between the sandboxed EVM and the external state, which is managed via the `Host` interface. Your `SharedMemoryManager` would be the equivalent of this "host" for shared memory operations.

3.  **Complex Opcode Implementation Pattern**: The shared memory opcodes have non-trivial logic and gas costs. The best architectural pattern for this in `evmone` is the precompile system. As shown in `test/state/precompiles_internal.hpp` and `test/state/precompiles.cpp`, each precompile has two phases:
    *   An `analyze` function to calculate the gas cost based on input data. This is a perfect model for your opcodes' dynamic gas costs.
    *   An `execute` function that performs the native operation.
    Adopting this two-phase pattern for your new opcodes will lead to a cleaner and more robust implementation.

4.  **Inter-Context Communication (IPC)**: The prompt's goal of sharing data between contexts is analogous to how the EVM handles calls between contracts (`CALL`, `DELEGATECALL`, etc.). The `call_impl` function in `lib/evmone/instructions_calls.cpp` is a prime example. It demonstrates the entire flow: preparing a message, invoking the host, and handling the return data. This is a crucial reference for implementing the mapping and data transfer aspects of your shared memory system.



## REVM Context

An excellent and detailed prompt for a very powerful feature. `revm`'s memory model is a good reference for the core components of what you are building, especially for managing memory across different call contexts within a single transaction.

Here are the most relevant code snippets from `revm` that will help you implement the `SharedMemoryManager` and its related features.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/shared_memory.rs">
```rust
use super::MemoryTr;
use core::{
    cell::{Ref, RefCell, RefMut},
    cmp::min,
    fmt,
    ops::Range,
};
use primitives::{hex, B256, U256};
use std::{rc::Rc, vec::Vec};

/// A sequential memory shared between calls, which uses
/// a `Vec` for internal representation.
/// A [SharedMemory] instance should always be obtained using
/// the `new` static method to ensure memory safety.
#[derive(Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct SharedMemory {
    /// The underlying buffer.
    buffer: Rc<RefCell<Vec<u8>>>,
    /// Memory checkpoints for each depth.
    /// Invariant: these are always in bounds of `data`.
    my_checkpoint: usize,
    /// Child checkpoint that we need to free context to.
    child_checkpoint: Option<usize>,
    /// Memory limit. See [`Cfg`](context_interface::Cfg).
    #[cfg(feature = "memory_limit")]
    memory_limit: u64,
}

impl MemoryTr for SharedMemory {
    // ... trait implementations for memory operations ...
    fn set(&mut self, memory_offset: usize, data: &[u8]) {
        self.set(memory_offset, data);
    }

    fn size(&self) -> usize {
        self.len()
    }

    fn copy(&mut self, destination: usize, source: usize, len: usize) {
        self.copy(destination, source, len);
    }
    // ...
}

impl SharedMemory {
    /// Creates a new memory instance that can be shared between calls.
    ///
    /// The default initial capacity is 4KiB.
    #[inline]
    pub fn new() -> Self {
        Self::with_capacity(4 * 1024) // from evmone
    }

    /// Creates a new memory instance that can be shared between calls with the given `capacity`.
    #[inline]
    pub fn with_capacity(capacity: usize) -> Self {
        Self {
            buffer: Rc::new(RefCell::new(Vec::with_capacity(capacity))),
            my_checkpoint: 0,
            child_checkpoint: None,
            #[cfg(feature = "memory_limit")]
            memory_limit: u64::MAX,
        }
    }

    /// Prepares the shared memory for a new child context.
    ///
    /// # Panics
    ///
    /// Panics if this function was already called without freeing child context.
    #[inline]
    pub fn new_child_context(&mut self) -> SharedMemory {
        if self.child_checkpoint.is_some() {
            panic!("new_child_context was already called without freeing child context");
        }
        let new_checkpoint = self.buffer.borrow().len();
        self.child_checkpoint = Some(new_checkpoint);
        SharedMemory {
            buffer: self.buffer.clone(),
            my_checkpoint: new_checkpoint,
            // child_checkpoint is same as my_checkpoint
            child_checkpoint: None,
            #[cfg(feature = "memory_limit")]
            memory_limit: self.memory_limit,
        }
    }

    /// Prepares the shared memory for returning from child context. Do nothing if there is no child context.
    #[inline]
    pub fn free_child_context(&mut self) {
        let Some(child_checkpoint) = self.child_checkpoint.take() else {
            return;
        };
        unsafe {
            self.buffer.borrow_mut().set_len(child_checkpoint);
        }
    }

    /// Returns the length of the current memory range.
    #[inline]
    pub fn len(&self) -> usize {
        self.buffer.borrow().len() - self.my_checkpoint
    }

    /// Resizes the memory in-place so that `len` is equal to `new_len`.
    #[inline]
    pub fn resize(&mut self, new_size: usize) {
        self.buffer
            .borrow_mut()
            .resize(self.my_checkpoint + new_size, 0);
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/frame.rs">
```rust
// This file shows how a new frame (call context) is created and how memory is managed across calls.
impl<EVM, ERROR> Frame for EthFrame<EVM, ERROR, EthInterpreter>
where
    // ...
{
    // ...
    fn init(
        &mut self,
        evm: &mut Self::Evm,
        frame_input: Self::FrameInit,
    ) -> Result<FrameOrResult<Self>, Self::Error> {
        // Create new context from shared memory.
        let memory = self.interpreter.memory.new_child_context();
        EthFrame::init_with_context(evm, self.depth + 1, frame_input, memory)
    }

    fn return_result(
        &mut self,
        context: &mut Self::Evm,
        result: Self::FrameResult,
    ) -> Result<(), Self::Error> {
        self.return_result(context, result)
    }
}

impl<EVM, ERROR> EthFrame<EVM, ERROR, EthInterpreter>
where
    // ...
{
    // ...
    fn return_result(&mut self, evm: &mut EVM, result: FrameResult) -> Result<(), ERROR> {
        // This is the key part for reverts/returns. It frees the memory of the child context.
        self.interpreter.memory.free_child_context();
        // ... (process result and update parent frame's memory/stack) ...
        Ok(())
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/memory.rs">
```rust
// These opcodes are excellent templates for your SHARED_READ, SHARED_WRITE, and copying operations.
// They show the full flow: pop arguments -> calculate gas -> resize memory -> perform operation.

pub fn mload<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([], top, context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, top);
    resize_memory!(context.interpreter, offset, 32);
    *top =
        U256::try_from_be_slice(context.interpreter.memory.slice_len(offset, 32).as_ref()).unwrap()
}

pub fn mstore<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn!([offset, value], context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, offset);
    resize_memory!(context.interpreter, offset, 32);
    context
        .interpreter
        .memory
        .set(offset, &value.to_be_bytes::<32>());
}

// EIP-5656: MCOPY - Memory copying instruction
pub fn mcopy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CANCUN);
    popn!([dst, src, len], context.interpreter);

    // Into usize or fail
    let len = as_usize_or_fail!(context.interpreter, len);
    // Deduce gas
    gas_or_fail!(context.interpreter, gas::copy_cost_verylow(len));
    if len == 0 {
        return;
    }

    let dst = as_usize_or_fail!(context.interpreter, dst);
    let src = as_usize_or_fail!(context.interpreter, src);
    // Resize memory
    resize_memory!(context.interpreter, max(dst, src), len);
    // Copy memory in place
    context.interpreter.memory.copy(dst, src, len);
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas.rs">
```rust
// This shows how `revm` models gas and calculates the quadratic cost for memory expansion,
// a critical component for your opcodes that interact with memory.

/// Represents the state of gas during execution.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
pub struct Gas {
    /// The initial gas limit. This is constant throughout execution.
    limit: u64,
    /// The remaining gas.
    remaining: u64,
    /// Refunded gas. This is used only at the end of execution.
    refunded: i64,
    /// Memoisation of values for memory expansion cost.
    memory: MemoryGas,
}

impl Gas {
    // ...

    /// Records an explicit cost.
    #[inline]
    #[must_use = "prefer using `gas!` instead to return an out-of-gas error on failure"]
    pub fn record_cost(&mut self, cost: u64) -> bool {
        if let Some(new_remaining) = self.remaining.checked_sub(cost) {
            self.remaining = new_remaining;
            return true;
        }
        false
    }

    /// Record memory expansion
    #[inline]
    #[must_use = "internally uses record_cost that flags out of gas error"]
    pub fn record_memory_expansion(&mut self, new_len: usize) -> MemoryExtensionResult {
        let Some(additional_cost) = self.memory.record_new_len(new_len) else {
            return MemoryExtensionResult::Same;
        };

        if !self.record_cost(additional_cost) {
            return MemoryExtensionResult::OutOfGas;
        }

        MemoryExtensionResult::Extended
    }
}

/// Utility struct that speeds up calculation of memory expansion
/// It contains the current memory length and its memory expansion cost.
#[derive(Clone, Copy, Default, Debug, PartialEq, Eq, Hash)]
pub struct MemoryGas {
    /// Current memory length
    pub words_num: usize,
    /// Current memory expansion cost
    pub expansion_cost: u64,
}

impl MemoryGas {
    // ...
    #[inline]
    pub fn record_new_len(&mut self, new_num: usize) -> Option<u64> {
        if new_num <= self.words_num {
            return None;
        }
        self.words_num = new_num;
        let mut cost = crate::gas::calc::memory_gas(new_num);
        core::mem::swap(&mut self.expansion_cost, &mut cost);
        // Safe to subtract because we know that new_len > length
        // Notice the swap above.
        Some(self.expansion_cost - cost)
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs">
```rust
// This shows how `SharedMemory` is integrated as a core component of the `Interpreter`.

/// Main interpreter structure that contains all components defines in [`InterpreterTypes`].s
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(::serde::Serialize, ::serde::Deserialize))]
pub struct Interpreter<WIRE: InterpreterTypes = EthInterpreter> {
    pub bytecode: WIRE::Bytecode,
    pub stack: WIRE::Stack,
    pub return_data: WIRE::ReturnData,
    pub memory: WIRE::Memory, // <--- SharedMemory is used here
    pub input: WIRE::Input,
    pub sub_routine: WIRE::SubRoutineStack,
    pub control: WIRE::Control,
    pub runtime_flag: WIRE::RuntimeFlag,
    pub extend: WIRE::Extend,
}

/// Default types for Ethereum interpreter.
pub struct EthInterpreter<EXT = (), MG = SharedMemory> {
    _phantom: core::marker::PhantomData<fn() -> (EXT, MG)>,
}

impl<EXT> InterpreterTypes for EthInterpreter<EXT> {
    type Stack = Stack;
    type Memory = SharedMemory; // <--- The concrete type is SharedMemory
    type Bytecode = ExtBytecode;
    type ReturnData = ReturnDataImpl;
    //...
}
```
</file>
</revm>

## Prompt Corrections

Your prompt outlines a very powerful and complex shared memory system. The `revm` implementation provides a good, practical starting point for the core concepts.

1.  **Memory Sharing Model**: `revm`'s `SharedMemory` uses an `Rc<RefCell<Vec<u8>>>` to share a *single, contiguous, and resizable* buffer between call frames. This is a simple and effective model for inter-call communication within a single transaction. Your specification of a `SharedMemoryManager` with multiple, named `SharedRegion`s is more akin to an OS-level shared memory system (like POSIX `shm_open`). This is a significant extension to the standard EVM model. The `revm` approach is a good first step, as it handles the most common use case: passing data between a caller and a callee.

2.  **Copy-on-Write vs. Checkpointing**: Your `CopyOnWriteManager` is a sophisticated approach. `revm`'s `SharedMemory` uses a simpler "checkpoint" system. When a child context is created (`new_child_context`), it records the current length of the shared buffer. If the child call reverts or returns, `free_child_context` simply truncates the buffer back to that checkpoint length. This effectively discards any memory appends made by the child, achieving a similar result to COW for a linear buffer without the complexity of page management.

3.  **Memory Pools**: `revm`'s `SharedMemory` does not use memory pools for its main buffer; it's a single `Vec<u8>`. Your `MemoryPoolRegistry` is a valid performance optimization for general-purpose allocation, but it's a layer on top of what the core EVM memory model typically provides.

**Recommendation**: Start by implementing a system similar to `revm`'s `SharedMemory` for inter-call data passing. This will give you a solid foundation for context management, revert handling, and gas accounting. Once that is stable, you can build the more advanced features like named regions, memory pools, and a true COW manager on top of it.



## EXECUTION-SPECS Context

An excellent and detailed prompt. Implementing a shared memory system would be a significant addition to the EVM, and the provided Zig-based specification is very clear.

To assist in implementing this, I've extracted the most relevant patterns and structures from the `execution-specs` codebase. The focus is on how the existing EVM manages memory, state, gas, and inter-contract calls, as these are the core primitives you will need to build upon.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/__init__.py">
```python
# The `Evm` and `Message` data classes are the core context for any execution.
# Your `SharedMemoryManager` would likely be a new component within the `Evm`
# struct, and information about the caller/context for access control would
# come from the `Message` struct.

@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    # ... (existing fields)
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
```python
# The `execute_code` function is the main execution loop. New shared memory
# opcodes would be dispatched from within this loop, similar to existing ones.
# The `process_message_call` function shows how a new execution context (EVM frame)
# is created and how its result (including output data and errors) is handled.
# This is analogous to how you might map/unmap shared memory regions for a sub-call.

def process_message_call(message: Message) -> MessageCallOutput:
    # ... (code to set up state and handle contract creation)
    else:
        evm = process_message(message)
    # ... (code to process evm result)

def process_message(message: Message) -> Evm:
    # ... (code to handle call depth and value transfer)
    # The core execution happens here:
    evm = execute_code(message)
    # ... (code to handle state reverts or commits)
    return evm


def execute_code(message: Message) -> Evm:
    # ... (code to initialize EVM object with stack, memory, etc.)

    try:
        # Precompile handling is a good pattern for special-cased behavior
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            # ...
            return evm

        # This is the main opcode execution loop. Your new opcodes would be
        # handled within this loop.
        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            op_implementation[op](evm)

    except ExceptionalHalt as error:
        # ...
    except Revert as error:
        # ...
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
```python
# This file provides the patterns for gas calculation. Your shared memory opcodes
# will need to consume gas. The `calculate_memory_gas_cost` function is especially
# relevant for any operations that involve memory, as it shows the quadratic
# cost model.

GAS_VERY_LOW = Uint(3)
GAS_COPY = Uint(3)

def charge_gas(evm: Evm, amount: Uint) -> None:
    """
    Subtracts `amount` from `evm.gas_left`.
    """
    # ... (implementation)

def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    to the smallest multiple of 32 bytes,
    such that the allocated size is at least as big as the given size.
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words ** Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    # ... (error handling)
    return total_gas_cost


def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    """
    Calculates the gas amount to extend memory
    """
    # ... (implementation)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/memory.py">
```python
# The implementations of MSTORE, MLOAD, and MCOPY are excellent templates for
# your `shared_write`, `shared_read`, and memory copying operations. They show
# the full flow:
# 1. Pop arguments from the stack.
# 2. Calculate and charge gas for memory expansion.
# 3. Perform the memory operation.
# 4. Advance the program counter.

def mstore(evm: Evm) -> None:
    """
    Stores a word to memory.
    """
    # STACK
    start_position = pop(evm.stack)
    value = pop(evm.stack).to_be_bytes32()

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(len(value)))]
    )

    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    memory_write(evm.memory, start_position, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mload(evm: Evm) -> None:
    """
    Load word from memory.
    """
    # STACK
    start_position = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(32))]
    )
    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    value = U256.from_be_bytes(
        memory_read_bytes(evm.memory, start_position, U256(32))
    )
    push(evm.stack, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/state.py">
```python
# Your shared memory system must be transactional. If a call reverts, any
# allocations or mappings must be rolled back. The `begin_transaction`,
# `commit_transaction`, and `rollback_transaction` functions show how this is
# done for the state trie by managing snapshots. A similar mechanism will be
# needed for the `SharedMemoryManager`.

@dataclass
class State:
    """
    Contains all information that is preserved between transactions.
    """
    _main_trie: Trie[Address, Optional[Account]] = field(...)
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(...)
    _snapshots: List[
        Tuple[
            Trie[Address, Optional[Account]],
            Dict[Address, Trie[Bytes32, U256]],
        ]
    ] = field(default_factory=list)
    # ...

def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Start a state transaction.
    """
    state._snapshots.append(
        (
            copy_trie(state._main_trie),
            {k: copy_trie(t) for (k, t) in state._storage_tries.items()},
        )
    )
    # ...

def commit_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Commit a state transaction.
    """
    state._snapshots.pop()
    # ...

def rollback_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Rollback a state transaction...
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    # ...
```
</file>
</execution-specs>

## Prompt Corrections
The provided Zig specification is an excellent starting point. Here are a few things to keep in mind when translating it to a production EVM implementation, based on the patterns seen in `execution-specs`:

1.  **Memory Model**: The Zig spec uses a general-purpose allocator (`context.allocator.alloc`). The EVM's memory is a simpler, contiguous, and transient block of memory that expands but doesn't have complex allocation/deallocation patterns. The `memory.py` module in the specs provides a more accurate model.
2.  **Opcodes and Gas**: Your `execute_shared_*` functions correctly identify the need to consume gas. Remember to also charge for memory expansion, which is a quadratic cost. The `gas.py` and `instructions/memory.py` files show how this dynamic cost is calculated and applied *in addition* to the base opcode cost.
3.  **Context and State Management**:
    *   The `SharedMemoryManager` is a good abstraction. In a real implementation, it would likely be a field within the main `Evm` object (see `vm/__init__.py`), alongside `stack`, `memory`, and `state`.
    *   The prompt correctly identifies the need for a `context_id`. This is analogous to the `Evm` object itself, which represents the current call frame. For sub-calls, a new `Evm` object is created, inheriting or receiving necessary context from its parent.
4.  **Transactional Integrity**: The `state.py` module's use of `begin_transaction`, `commit_transaction`, and `rollback_transaction` is a critical pattern. Your `SharedMemoryManager` must hook into this to ensure that if an execution frame reverts, any shared memory regions it created or mapped are also reverted to their previous state.

---

An excellent and detailed prompt. Implementing a shared memory system would be a significant addition to the EVM, and the provided Zig-based specification is very clear.

To assist in implementing this, I've extracted the most relevant patterns and structures from the `execution-specs` codebase. The focus is on how the existing EVM manages memory, state, gas, and inter-contract calls, as these are the core primitives you will need to build upon.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/__init__.py">
```python
# The `Evm` and `Message` data classes are the core context for any execution.
# Your `SharedMemoryManager` would likely be a new component within the `Evm`
# struct, and information about the caller/context for access control would
# come from the `Message` struct.

@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    # ... (existing fields)
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

<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
```python
# The `execute_code` function is the main execution loop. New shared memory
# opcodes would be dispatched from within this loop, similar to existing ones.
# The `process_message_call` function shows how a new execution context (EVM frame)
# is created and how its result (including output data and errors) is handled.
# This is analogous to how you might map/unmap shared memory regions for a sub-call.

def process_message_call(message: Message) -> MessageCallOutput:
    # ... (code to set up state and handle contract creation)
    else:
        evm = process_message(message)
    # ... (code to process evm result)

def process_message(message: Message) -> Evm:
    # ... (code to handle call depth and value transfer)
    # The core execution happens here:
    evm = execute_code(message)
    # ... (code to handle state reverts or commits)
    return evm


def execute_code(message: Message) -> Evm:
    # ... (code to initialize EVM object with stack, memory, etc.)

    try:
        # Precompile handling is a good pattern for special-cased behavior
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            # ...
            return evm

        # This is the main opcode execution loop. Your new opcodes would be
        # handled within this loop.
        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            op_implementation[op](evm)

    except ExceptionalHalt as error:
        # ...
    except Revert as error:
        # ...
    return evm
```
</file>

<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
```python
# This file provides the patterns for gas calculation. Your shared memory opcodes
# will need to consume gas. The `calculate_memory_gas_cost` function is especially
# relevant for any operations that involve memory, as it shows the quadratic
# cost model.

GAS_VERY_LOW = Uint(3)
GAS_COPY = Uint(3)

def charge_gas(evm: Evm, amount: Uint) -> None:
    """
    Subtracts `amount` from `evm.gas_left`.
    """
    # ... (implementation)

def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    to the smallest multiple of 32 bytes,
    such that the allocated size is at least as big as the given size.
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words ** Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    # ... (error handling)
    return total_gas_cost


def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    """
    Calculates the gas amount to extend memory
    """
    # ... (implementation)
```
</file>

<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/memory.py">
```python
# The implementations of MSTORE, MLOAD, and MCOPY are excellent templates for
# your `shared_write`, `shared_read`, and memory copying operations. They show
# the full flow:
# 1. Pop arguments from the stack.
# 2. Calculate and charge gas for memory expansion.
# 3. Perform the memory operation.
# 4. Advance the program counter.

def mstore(evm: Evm) -> None:
    """
    Stores a word to memory.
    """
    # STACK
    start_position = pop(evm.stack)
    value = pop(evm.stack).to_be_bytes32()

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(len(value)))]
    )

    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    memory_write(evm.memory, start_position, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mload(evm: Evm) -> None:
    """
    Load word from memory.
    """
    # STACK
    start_position = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(32))]
    )
    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    value = U256.from_be_bytes(
        memory_read_bytes(evm.memory, start_position, U256(32))
    )
    push(evm.stack, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>

<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/state.py">
```python
# Your shared memory system must be transactional. If a call reverts, any
# allocations or mappings must be rolled back. The `begin_transaction`,
# `commit_transaction`, and `rollback_transaction` functions show how this is
# done for the state trie by managing snapshots. A similar mechanism will be
# needed for the `SharedMemoryManager`.

@dataclass
class State:
    """
    Contains all information that is preserved between transactions.
    """
    _main_trie: Trie[Address, Optional[Account]] = field(...)
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(...)
    _snapshots: List[
        Tuple[
            Trie[Address, Optional[Account]],
            Dict[Address, Trie[Bytes32, U256]],
        ]
    ] = field(default_factory=list)
    # ...

def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Start a state transaction.
    """
    state._snapshots.append(
        (
            copy_trie(state._main_trie),
            {k: copy_trie(t) for (k, t) in state._storage_tries.items()},
        )
    )
    # ...

def commit_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Commit a state transaction.
    """
    state._snapshots.pop()
    # ...

def rollback_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Rollback a state transaction...
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    # ...
```
</file>
</execution-specs>

## Prompt Corrections
The provided Zig specification is an excellent starting point. Here are a few things to keep in mind when translating it to a production EVM implementation, based on the patterns seen in `execution-specs`:

1.  **Memory Model**: The Zig spec uses a general-purpose allocator (`context.allocator.alloc`). The EVM's memory is a simpler, contiguous, and transient block of memory that expands but doesn't have complex allocation/deallocation patterns. The `memory.py` module in the specs provides a more accurate model.
2.  **Opcodes and Gas**: Your `execute_shared_*` functions correctly identify the need to consume gas. Remember to also charge for memory expansion, which is a quadratic cost. The `gas.py` and `instructions/memory.py` files show how this dynamic cost is calculated and applied *in addition* to the base opcode cost.
3.  **Context and State Management**:
    *   The `SharedMemoryManager` is a good abstraction. In a real implementation, it would likely be a field within the main `Evm` object (see `vm/__init__.py`), alongside `stack`, `memory`, and `state`.
    *   The prompt correctly identifies the need for a `context_id`. This is analogous to the `Evm` object itself, which represents the current call frame. For sub-calls, a new `Evm` object is created, inheriting or receiving necessary context from its parent.
4.  **Transactional Integrity**: The `state.py` module's use of `begin_transaction`, `commit_transaction`, and `rollback_transaction` is a critical pattern. Your `SharedMemoryManager` must hook into this to ensure that if an execution frame reverts, any shared memory regions it created or mapped are also reverted to their previous state.



## GO-ETHEREUM Context

An advanced feature like shared memory doesn't have a direct equivalent in go-ethereum, as the EVM memory model is sandboxed per-transaction. However, we can draw inspiration from several key areas in the go-ethereum codebase that solve similar problems related to memory management, state versioning (which is analogous to Copy-on-Write), and performance optimization.

The following snippets provide patterns for:
1.  **Shared Memory & Opcodes**: The closest standard feature is Transient Storage (EIP-1153). It provides a key-value store shared across all call contexts within a single transaction. The `TSTORE` and `TLOAD` opcode implementations are excellent references for the new `SHARED_*` opcodes.
2.  **Copy-on-Write (`StateDB` Journaling)**: Go-ethereum's state management uses a journaling system that functions like a copy-on-write mechanism for state changes. The `state.Journal` is the perfect reference for implementing the `CopyOnWriteManager`.
3.  **Memory Pools (`StoragePool`)**: Go-ethereum uses object pools to reduce allocation overhead for state management. The `state.StoragePool` is a direct parallel to the requested `MemoryPoolRegistry`.
4.  **Memory Management (`Memory` object)**: The `Memory` object within a call frame and its gas calculation for expansion are directly relevant to managing the `SharedRegion` byte slices.
5.  **VM Integration (`EVM` struct)**: The `EVM.Call` method demonstrates how to create new execution contexts, manage gas, handle state changes, and process return data, all of which are relevant for the proposed `SharedMemoryManager`.
6.  **Performance Tracking (`metrics` package)**: Go-ethereum's metrics package provides a comprehensive framework for tracking performance counters and rates, directly analogous to the requested `SharedMemoryPerformanceTracker`.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opTload loads a word from transient storage.
func opTload(pc *uint64, evm *EVM, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	loc := stack.Pop()
	val := evm.StateDB.GetTransientState(contract.Address(), common.Hash(loc.Bytes32()))
	stack.Push(val.Big())
	return nil, nil
}

// opTstore stores a word to transient storage.
func opTstore(pc *uint64, evm *EVM, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	if evm.readOnly {
		return nil, ErrWriteProtection
	}
	loc, val := stack.Pop(), stack.Pop()
	evm.StateDB.SetTransientState(contract.Address(), common.Hash(loc.Bytes32()), common.Hash(val.Bytes32()))
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// JournalEntry is a modification entry in the state change journal.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the address that was modified by this journal entry.
	dirtied() *common.Address
}

// Journal is a log of state changes. This is used to revert changes that are made
// when a transaction execution fails.
type Journal struct {
	entries  []journalEntry         // Current changes tracked by the journal
	revisons []journalRevision      // Point-in-time snapshots of the journal
	dirties  map[common.Address]int // Dirty accounts and the number of changes
}

type journalRevision struct {
	id         int
	journalLen int
}

// Append inserts a new modification entry to the end of the journal.
func (j *Journal) Append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// Revert undoes a batch of journalled changes.
func (j *Journal) Revert(statedb *StateDB, revID int) {
	// Find the snapshot and entries to revert
	idx := -1
	for i, rev := range j.revisons {
		if rev.id == revID {
			idx = i
			break
		}
	}
	//...
	// Replay the journal to undo changes
	for i := len(j.entries) - 1; i >= reversion.journalLen; i-- {
		// ...
		j.entries[i].revert(statedb)
	}
	j.entries = j.entries[:reversion.journalLen]
	j.revisons = j.revisons[:idx]
}

// snapshot creates a snapshot of the current journal state.
func (j *Journal) snapshot() int {
	id := nextRevisionId
	nextRevisionId++
	j.revisons = append(j.revisons, journalRevision{id, len(j.entries)})
	return id
}

// transientStorageChange is a journal entry for a transient storage change.
type transientStorageChange struct {
	account  *common.Address
	key      common.Hash
	prevalue common.Hash
}

func (ch transientStorageChange) revert(s *StateDB) {
	s.SetTransientState(*ch.account, ch.key, ch.prevalue)
}

func (ch transientStorageChange) dirtied() *common.Address {
	return ch.account
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// A storagePool is a pool of hash maps for storing state.
// The purpose of this is to keep the frequently used maps in memory
// for a long time, to avoid repeated memory allocations.
// This is not thread safe.
var storagePool = newStoragePool()

// newStoragePool creates a new storage pool.
func newStoragePool() *sync.Pool {
	return &sync.Pool{
		New: func() interface{} {
			return make(Storage)
		},
	}
}
// getStorage returns a pooled storage map.
func (s *stateObject) getStorage() Storage {
	if s.storage != nil {
		return s.storage
	}
	s.storage = storagePool.Get().(Storage)
	return s.storage
}
// Put a storage map back into the pool.
func (s *stateObject) finalise() {
	if s.storage == nil {
		return
	}
	// All dirty slots are copied to a new map. The original map is released
	// back to the pool. The new map is smaller and can be GC'd when the
	// object is no longer referenced.
	if len(s.dirty) > 0 {
		s.storage = make(Storage, len(s.dirty))
		for k, v := range s.dirty {
			s.storage[k] = v
		}
	} else {
		// The storage is clean. Release the map to the pool.
		// It is important to clear the map before releasing.
		for key := range s.storage {
			delete(s.storage, key)
		}
		storagePool.Put(s.storage)
	}
	s.storage = nil // map is now owned by the pool
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current transaction and block.
	Context
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// Depth is the current call stack
	depth int
	// ...
}

// Call executes the code of a contract with the given input as parameters. It
// can be specified to execute plain regular CALL or a DELEGATECALL / CALLCODE.
//
// It returns the returned data and the remaining gas, and an error if it failed.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to change state from within a static call
	if evm.readOnly && value.Sign() != 0 {
		return nil, gas, ErrWriteProtection
	}
	// Make sure the caller has enough balance to send the value.
	if !caller.CanTransfer(evm.StateDB, value) {
		return nil, gas, ErrInsufficientBalance
	}
	var (
		to       = AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	// ... (precompile checks and value transfer) ...

	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution.
	contract := NewContract(caller, to, value, gas)
	contract.SetCallCode(&addr, codeHash, code)

	ret, err = run(evm, contract, input, false)

	// When the execution finishes, we save the leftover gas and return it
	// to the caller.
	leftOverGas = contract.Gas

	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
	}
	return ret, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents the EVM's memory space.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{store: make([]byte, 0, 1024)}
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = common.ExtendMemory(m.store, int(size-uint64(len(m.store))))
	}
}

// GetCopy returns a copy of the backed buffer.
func (m *Memory) GetCopy(offset, size int64) []byte {
	// ...
	cpy := make([]byte, size)
	copy(cpy, m.store[offset:offset+size])
	return cpy
}

// Len returns the length of the backing slice.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// GasQuadCoeffDiv is the gas coefficient divisor for memory expansion, where the memory cost
	// is defined as C_mem(a) = C_mem_lin * a + a^2 / C_mem_quad, where a is the number of words.
	// C_mem_quad is 512 in the yellow paper.
	GasQuadCoeffDiv = 512

	// MemGas is the linear gas cost for memory access.
	MemGas = 3
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
// MeterSnapshot is a read-only copy of the meter's internal values.
type MeterSnapshot struct {
	count                          int64
	rate1, rate5, rate15, rateMean float64
}

// Count returns the count of events at the time the snapshot was taken.
func (m *MeterSnapshot) Count() int64 { return m.count }

// Rate1 returns the one-minute moving average rate of events per second at the
// time the snapshot was taken.
func (m *MeterSnapshot) Rate1() float64 { return m.rate1 }

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
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/counter.go">
```go
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
</go-ethereum>
## Prompt Corrections
The user's prompt outlines a feature that is significantly more complex than any single component in go-ethereum. It combines concepts from state management, memory management, and inter-contract communication. The prompt is well-structured, but it's important to recognize that this is a major architectural addition to an EVM, not a simple feature implementation.

1.  **Analogy to Transient Storage**: The prompt's concept of "shared memory" is most analogous to EIP-1153's Transient Storage. Both are designed for data sharing across call contexts within a single transaction. The implementation should look closely at how Geth handles `TSTORE` and `TLOAD`, which use a simple map in the `StateDB` that is cleared after the transaction. This is a much simpler and more realistic model for cross-contract data sharing than a full-blown IPC/shared-memory system.

2.  **Copy-on-Write vs. Journaling**: The request for "Copy-on-Write" is best implemented using a journaling mechanism like Geth's `state.Journal`. The journal tracks the "diff" of state changes, and these diffs are either committed or reverted. This avoids copying the entire state for each sub-call and is a proven, efficient pattern for EVM state management.

3.  **Opcode Gas Costs**: The proposed opcodes (`SHARED_READ`, `SHARED_WRITE`, etc.) will need carefully designed gas costs. The prompt's gas calculation (`100 + size_usize / 32`) is a good start but should be compared to analogous Geth opcodes (`MLOAD`, `MSTORE`, `SLOAD`, `SSTORE`). The gas model should account for:
    *   A base cost for the operation.
    *   A cost proportional to the amount of data being accessed (per word or per byte).
    *   A potential "cold" vs. "warm" access cost, similar to EIP-2929, if this is the first time a shared region is accessed in a transaction.
    *   The `core/vm/gas.go` file provides canonical formulas for these patterns.

4.  **Addressing Scheme**: The prompt mentions returning a raw pointer (`@intFromPtr(memory.ptr)`) from `SHARED_ALLOC` and `SHARED_MAP`. This is a significant departure from the EVM's memory model and could introduce security vulnerabilities if not handled carefully. A safer approach would be to use opaque handles or IDs (as suggested with `SharedRegionHandle`) and have the opcodes perform lookups, rather than exposing raw host memory addresses to the sandboxed EVM environment. The EVM memory should remain isolated from the host's memory.



---

An excellent and very detailed prompt. Implementing a shared memory system is a complex task that touches many core components of the EVM.

To provide the best context from `go-ethereum`, I will focus on the patterns for memory management, gas calculation, state journaling (for reverts), and the lifecycle of message calls, as these are the most analogous concepts to what you need to build.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// core/vm/instructions.go

// opTstore implements the TSTORE operation. EIP-1153's transient storage is the
// closest existing EVM feature to the requested shared memory system. It provides
// a key-value store that is shared across all call contexts within a single
// transaction. This is a perfect template for your SHARED_WRITE opcode.
func opTstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Static calls cannot alter state.
	if evm.readOnly {
		return nil, ErrWriteProtection
	}
	// Pop slot and value from the stack.
	loc := stack.pop()
	val := stack.pop()

	// Gas cost for this opcode is static and defined in the jumptable.
	// No extra gas is required.

	// Set the transient storage value. The StateDB manages the map.
	evm.StateDB.SetTransientState(contract.Address(), loc.Bytes32(), val.Bytes32())
	return nil, nil
}

// opTload implements the TLOAD operation. This is a template for your SHARED_READ
// opcode, showing how to access a shared resource (transient storage) scoped
// to the current contract address.
func opTload(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop slot from the stack.
	loc := stack.peek() // Note: TLOAD uses peek to replace the key with the value.

	// Gas cost is static. The value is read from the StateDB.
	// The returned value is pushed back onto the stack, replacing the slot.
	*loc = evm.StateDB.GetTransientState(contract.Address(), loc.Bytes32()).Big()
	return nil, nil
}

// opCall is the generic CALL opcode plain execution. It is a good example of how
// a new execution context (frame) is created, how state is snapshotted before the
// call, and how return data is handled. Your SHARED_MAP opcode would have a
// similar flow for managing context-specific mappings.
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop arguments for the call from the stack.
	gas, addr, value, argsOffset, argsSize, retOffset, retSize := stack.Pop7()

	// ... (gas calculation and memory expansion logic) ...

	// Get the arguments from memory.
	args, err := memory.view(argsOffset, argsSize)
	if err != nil {
		return nil, err
	}

	// Make the call. This is where a new frame is created.
	ret, returnGas, err := evm.Call(contract, common.Address(addr.Bytes20()), args, gas64, value.ToBig())

	// If the call was successful, copy the return data to memory.
	if err == nil {
		stack.Push(uint256.NewInt(1))
		memory.set(retOffset, retSize, ret)
	} else {
		stack.Push(uint256.NewInt(0))
	}
	// The remaining gas is returned to the caller's context.
	contract.Gas += returnGas
	return nil, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// core/state/journal.go

// JournalEntry is a modification entry in the state change journal. This is the
// core of go-ethereum's "Copy-on-Write" mechanism for state. When a change is
// made, an entry is created to allow reverting it.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the address that was modified by this journal entry.
	dirtied() *common.Address
}

// Journal is a log of state changes. This is used to revert changes that are made
// when a transaction execution fails. Your `CopyOnWriteManager` can be implemented

// using this exact pattern.
type Journal struct {
	entries  []journalEntry         // Current changes tracked by the journal
	revisons []journalRevision      // Point-in-time snapshots of the journal
	dirties  map[common.Address]int // Dirty accounts and the number of changes
}

// Revert undoes a batch of journalled changes. This is the key function for
// implementing COW or reverting state on failed calls.
func (j *Journal) Revert(statedb *StateDB, revID int) {
	// Find the snapshot and entries to revert
	idx := -1
	for i, rev := range j.revisons {
		if rev.id == revID {
			idx = i
			break
		}
	}
	// ... (error handling) ...
	reversion := j.revisons[idx]

	// Replay the journal to undo changes
	for i := len(j.entries) - 1; i >= reversion.journalLen; i-- {
		// ... (update dirty map) ...
		j.entries[i].revert(statedb)
	}
	j.entries = j.entries[:reversion.journalLen]
	j.revisons = j.revisons[:idx]
}

// snapshot creates a snapshot of the current journal state. This is analogous to
// creating a COW view or a savepoint.
func (j *Journal) snapshot() int {
	id := nextRevisionId
	nextRevisionId++
	j.revisons = append(j.revisons, journalRevision{id, len(j.entries)})
	return id
}

// A few examples of journal entries. Your system would have entries for
// region creation, mapping changes, and data writes.
type (
	// Changes to an account's balance.
	balanceChange struct {
		account *common.Address
		prev    *uint256.Int
	}
	// Changes to an account's storage.
	storageChange struct {
		account       *common.Address
		key           common.Hash
		prevValue     common.Hash
		prevValueEmu  bool
		prevValExists bool
	}
	// Changes to transient storage (EIP-1153), a good parallel for shared memory.
	transientStorageChange struct {
		account       *common.Address
		key           common.Hash
		prevValue     common.Hash
		prevValExists bool
	}
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// core/state/state_object.go

// A storagePool is a pool of hash maps for storing state. The purpose of this
// is to keep the frequently used maps in memory for a long time, to avoid repeated
// memory allocations. This is a direct parallel to the prompt's `MemoryPoolRegistry`.
var storagePool = newStoragePool()

func newStoragePool() *sync.Pool {
	return &sync.Pool{
		New: func() interface{} {
			return make(Storage)
		},
	}
}

// stateObject represents an Ethereum account which is being modified.
type stateObject struct {
    // ...
	// Storage cache
	storage Storage // Storage cache of original entries to dedup rewrites
	dirty   Storage // Storage entries that have been modified in the current transaction execution
    // ...
}

// getStorage returns a pooled storage map. This shows how an object (equivalent
// to a `SharedRegion`) can borrow a map from a pool.
func (s *stateObject) getStorage() Storage {
	if s.storage != nil {
		return s.storage
	}
	s.storage = storagePool.Get().(Storage)
	return s.storage
}

// Put a storage map back into the pool. This shows how to return the pooled
// resource after use.
func (s *stateObject) finalise() {
	if s.storage == nil {
		return
	}
	// ... (logic to handle dirty vs clean maps) ...
	// It is important to clear the map before releasing.
	for key := range s.storage {
		delete(s.storage, key)
	}
	storagePool.Put(s.storage)
	s.storage = nil // map is now owned by the pool
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// core/vm/memory.go

// Memory represents the EVM's memory space. It's a simple, linearly-expanding
// byte array, which serves as a good baseline for your `SharedRegion` data buffer.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// Resize resizes the memory to size. Your `SharedRegion` will also need a
// mechanism to grow its underlying data buffer.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = common.ExtendMemory(m.store, int(size-uint64(len(m.store))))
	}
}

// GetCopy returns a copy of the backed buffer. This shows how to safely provide
// data from memory to other parts of the system.
func (m *Memory) GetCopy(offset, size int64) []byte {
	// ...
	cpy := make([]byte, size)
	copy(cpy, m.store[offset:offset+size])
	return cpy
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// core/vm/evm.go

// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code. Your `SharedMemoryManager` would likely be a field in a similar
// top-level object.
type EVM struct {
	// Context provides information about the current transaction and block.
	Context
	// StateDB gives access to the underlying state. This is where you would
	// interact with the journaling system for COW semantics.
	StateDB StateDB
	// Depth is the current call stack
	depth int
	// ... (other fields)
}

// Call executes the code of a contract with the given input as parameters. This
// method is the best example of how to manage execution contexts.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// ... (value transfer and static call checks) ...

	// Take a snapshot of the current state. This is the key to COW/revertible
	// execution. Any changes made in the sub-call can be reverted by using this
	// snapshot ID.
	snapshot := evm.StateDB.Snapshot()

	// ... (precompile checks) ...
	
	// Create a new contract object for the call. This is analogous to creating
	// a new mapping or context for a shared region.
	contract := NewContract(caller, to, value, gas)
	contract.SetCallCode(&addr, codeHash, code)

	// Run the contract's code in a new interpreter instance.
	ret, err = run(evm, contract, input, false)

	// After execution, if an error occurred, revert to the snapshot. This
	// undoes all state changes made during the sub-call. This is the core
	// of the "Copy-on-Write" revert logic.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if !errors.Is(err, ErrExecutionReverted) {
			contract.UseGas(contract.Gas)
		}
	}
	return ret, contract.Gas, err
}
```
</file>
## Prompt Corrections

The prompt outlines a very advanced feature that is a significant departure from the standard EVM. The provided `go-ethereum` code offers strong analogies for how to implement it securely and efficiently.

1.  **"Shared Memory" is more like "Transient Storage"**: The core EVM memory model is strictly isolated. A system for sharing data between contexts within a single transaction is much closer to **EIP-1153 Transient Storage** (`TSTORE`/`TLOAD`) than a general-purpose shared memory system. It is highly recommended to model the new feature on this pattern, as it's a battle-tested and specified way to achieve inter-context data sharing. Your `SHARED_READ`/`SHARED_WRITE` opcodes should look very similar to `opTload`/`opTstore`.

2.  **Copy-on-Write should be Journaling**: The prompt's `CopyOnWriteManager` is conceptually identical to `go-ethereum`'s state **journaling** system (`core/state/journal.go`). Rather than building a new COW manager, the implementation should use a journal. When a context "maps" a region for writing, it takes a snapshot. Any writes are recorded as entries in a journal. If the context reverts, the journal is replayed backwards to undo the changes. This is a robust and efficient way to handle state reverts.

3.  **Memory Pools are an Optimization**: Geth's EVM memory is a simple, linearly expanding buffer. While memory pools are a valid optimization pattern, and Geth uses them elsewhere (e.g., for state objects), they are not part of the core memory model. The `storagePool` in `state_object.go` is an excellent reference for how to implement this for your `SharedRegion` metadata or other objects.

4.  **Addressing and Security**: Returning raw host pointers from opcodes (`@intFromPtr(memory.ptr)`) is extremely dangerous and breaks the EVM's security sandbox. Instead, the EVM should only ever deal with opaque handles (e.g., `SharedRegionHandle`). The opcodes themselves would use this handle to look up the actual memory region within the `SharedMemoryManager`, which acts as a secure intermediary. The EVM bytecode should never see or operate on host memory addresses.

---

An advanced feature like shared memory doesn't have a direct equivalent in go-ethereum, as the EVM memory model is sandboxed per-transaction. However, we can draw inspiration from several key areas in the go-ethereum codebase that solve similar problems related to memory management, state versioning (which is analogous to Copy-on-Write), and performance optimization.

The following snippets provide patterns for:
1.  **Shared Memory & Opcodes (`TSTORE`/`TLOAD`)**: The closest standard feature is Transient Storage (EIP-1153). It provides a key-value store shared across all call contexts within a single transaction. The `TSTORE` and `TLOAD` opcode implementations are excellent references for the new `SHARED_*` opcodes.
2.  **Copy-on-Write (`StateDB` Journaling)**: Go-ethereum's state management uses a journaling system that functions like a copy-on-write mechanism for state changes. The `state.Journal` is the perfect reference for implementing the `CopyOnWriteManager`.
3.  **Memory Pools (`StoragePool`)**: Go-ethereum uses object pools to reduce allocation overhead for state management. The `state.StoragePool` is a direct parallel to the requested `MemoryPoolRegistry`.
4.  **Memory Management (`Memory` object)**: The `Memory` object within a call frame and its gas calculation for expansion are directly relevant to managing the `SharedRegion` byte slices.
5.  **VM Integration (`EVM` struct)**: The `EVM.Call` method demonstrates how to create new execution contexts, manage gas, handle state changes, and process return data, all of which are relevant for the proposed `SharedMemoryManager`.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/instructions.go">
```go
// opTstore implements the TSTORE operation. It provides a shared key-value store
// for the duration of a transaction, which is analogous to the proposed shared memory.
func opTstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop slot and value from the stack.
	loc := stack.pop()
	val := stack.pop()

	// Gas cost for this opcode is static and defined in the jumptable.
	// The StateDB manages the transient storage map for the current transaction.
	evm.StateDB.SetTransientState(contract.Address(), loc, val)
	return nil, nil
}

// opTload implements the TLOAD operation. It reads from the shared transient store.
func opTload(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop slot from the stack.
	loc := stack.peek()

	// The value is read from the StateDB. The returned value is pushed back
	// onto the stack, replacing the slot.
	*loc = evm.StateDB.GetTransientState(contract.Address(), *loc)
	return nil, nil
}

// opCall is the generic CALL opcode. This shows the pattern for creating a new
// execution context, which is relevant for how `SHARED_MAP` would work. It also
// shows how data is passed and returned between contexts.
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop six arguments from the stack:
	// gas, addr, value, argsOffset, argsLength, retOffset, retLength
	gas, addr, value, argsOffset, argsLength, retOffset, retLength := stack.pop6()

	// Get the arguments from memory.
	args, err := memory.view(argsOffset, argsLength)
	if err != nil {
		return nil, err
	}

	// Make the call. This is where the EVM creates a new frame.
	ret, returnGas, err := evm.Call(contract, common.Address(addr), args, gas, value)

	// If the call was successful, copy the return data to memory.
	if err == nil {
		stack.push(uint256.NewInt(1))
		memory.set(retOffset, retLength, ret)
	} else {
		stack.push(uint256.NewInt(0))
	}
	// The remaining gas is returned to the caller's context.
	contract.Gas += returnGas
	return nil, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/state/journal.go">
```go
// journalEntry is a modification entry in the state change journal.
// This is analogous to a single change in a copy-on-write system.
type journalEntry interface {
	// revert undoes the state change in the statedb.
	revert(db *StateDB)
	// dirtied returns the address that was modified.
	dirtied() *common.Address
}

// Journal is a log of state changes. It is used to revert changes that are made
// to the state. This provides the core functionality for COW semantics.
type Journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// snapshot creates a snapshot of the current journal state. This is analogous
// to creating a COW snapshot. It's an O(1) operation.
func (j *Journal) snapshot() int {
	return len(j.entries)
}

// revert reverts all changes made since the given snapshot. This is the core
// of the COW revert mechanism.
func (j *Journal) revert(db *StateDB, snapshot int) {
	// Replay the journal to specified snapshot in reverse
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the change and remove the journal entry
		j.entries[i].revert(db)
		j.undirty(j.entries[i].dirtied())
	}
	j.entries = j.entries[:snapshot]
}

// Append a new journal entry.
func (j *Journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirty(*addr)
	}
}

// All possible journal entries. These show what kind of changes are tracked,
// which is a good model for what the shared memory COW manager would need to track.
type (
	// ... (balanceChange, nonceChange, codeChange) ...

	// storageChange is a journal entry for changing a storage slot.
	storageChange struct {
		account       *common.Address
		key, prevalue common.Hash
	}
	// Transient storage changes.
	transientStorageChange struct {
		account      *common.Address
		key, prevalue common.Hash
	}
	// ...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/state/state_object.go">
```go
// A storagePool is a pool of hash maps for storing state.
// The purpose of this is to keep the frequently used maps in memory
// for a long time, to avoid repeated memory allocations. This is analogous
// to the `MemoryPoolRegistry` in the prompt.
var storagePool = newStoragePool()

// newStoragePool creates a new storage pool.
func newStoragePool() *sync.Pool {
	return &sync.Pool{
		New: func() interface{} {
			return make(Storage)
		},
	}
}

// stateObject represents an Ethereum account which is being modified.
type stateObject struct {
	// ...
	// Storage cache
	storage Storage // Storage cache of original entries to dedup rewrites
	dirty   Storage // Storage entries that have been modified in the current transaction execution
    // ...
}

// getStorage returns a pooled storage map.
func (s *stateObject) getStorage() Storage {
	if s.storage != nil {
		return s.storage
	}
	s.storage = storagePool.Get().(Storage)
	return s.storage
}

// Put a storage map back into the pool.
func (s *stateObject) finalise() {
	if s.storage == nil {
		return
	}
	// All dirty slots are copied to a new map. The original map is released
	// back to the pool. The new map is smaller and can be GC'd when the
	// object is no longer referenced.
	if len(s.dirty) > 0 {
		s.storage = make(Storage, len(s.dirty))
		for k, v := range s.dirty {
			s.storage[k] = v
		}
	} else {
		// The storage is clean. Release the map to the pool.
		// It is important to clear the map before releasing.
		for key := range s.storage {
			delete(s.storage, key)
		}
		storagePool.Put(s.storage)
	}
	s.storage = nil // map is now owned by the pool
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/memory.go">
```go
// Memory represents the EVM's memory space. This is a good model for the
// byte slice management inside a single `SharedRegion`.
type Memory struct {
	store       []byte // Backing data store for memory
	lastGasCost uint64 // Gas cost of the last memory expansion
	size        int    // Current size of the memory
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Resize resizes the memory to the given size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		// ... expand logic ...
		m.store = common.Extend(m.store, int(size-uint64(len(m.store))))
	}
	m.size = int(size)
}

// GetCopy returns a copy of the memory region.
func (m *Memory) GetCopy(offset, size int64) []byte {
	// ... bounds checking ...
	return common.CopyBytes(m.store[offset : offset+size])
}

// Set sets the memory region at a given offset to a slice of bytes.
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size > 0 {
		m.Resize(offset + size)
		copy(m.store[offset:offset+size], value)
	}
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return m.size
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object. The `SharedMemoryManager`
// would likely be a field on this struct or on the `StateDB`.
type EVM struct {
	// Context provides information about the current transaction and block.
	Context
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// depth is the current call stack
	depth int
	// ...
}

// Call executes the code of a contract with the given input as parameters. This
// method shows how a new execution context is created, state is snapshotted for
// potential reverts, and how results are handled. This is the core pattern for
// the `SHARED_MAP` and inter-context communication logic.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// ... fail on static call with value ...

	// Take a snapshot of the current state. If the call reverts,
	// we can roll back to this point. This is the key to COW/journaling.
	snapshot := evm.StateDB.Snapshot()
	
	// ... precompile checks ...
	
	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution.
	contract := NewContract(caller, to, value, gas)
	contract.SetCallCode(&addr, codeHash, code)

	ret, err = run(evm, contract, input, false)

	// When the execution finishes, we save the leftover gas and return it
	// to the caller.
	leftOverGas = contract.Gas

	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
	}
	return ret, leftOverGas, err
}
```
</file>
</go-ethereum>
## Prompt Corrections
The user's prompt outlines a feature that is significantly more complex than any single component in go-ethereum. It combines concepts from state management, memory management, and inter-contract communication. The prompt is well-structured, but it's important to recognize that this is a major architectural addition to an EVM, not a simple feature implementation.

1.  **Analogy to Transient Storage**: The prompt's concept of "shared memory" is most analogous to EIP-1153's Transient Storage. Both are designed for data sharing across call contexts within a single transaction. The implementation should look closely at how Geth handles `TSTORE` and `TLOAD`, which use a simple map in the `StateDB` that is cleared after the transaction. This is a much simpler and more realistic model for cross-contract data sharing than a full-blown IPC/shared-memory system.

2.  **Copy-on-Write vs. Journaling**: The request for "Copy-on-Write" is best implemented using a journaling mechanism like Geth's `state.Journal`. The journal tracks the "diff" of state changes, and these diffs are either committed or reverted. This avoids copying the entire state for each sub-call and is a proven, efficient pattern for EVM state management.

3.  **Opcode Gas Costs**: The proposed opcodes (`SHARED_READ`, `SHARED_WRITE`, etc.) will need carefully designed gas costs. The prompt's gas calculation (`100 + size_usize / 32`) is a good start but should be compared to analogous Geth opcodes (`MLOAD`, `MSTORE`, `SLOAD`, `SSTORE`). The gas model should account for:
    *   A base cost for the operation.
    *   A cost proportional to the amount of data being accessed (per word or per byte).
    *   A potential "cold" vs. "warm" access cost, similar to EIP-2929, if this is the first time a shared region is accessed in a transaction.
    *   The `core/vm/gas.go` file provides canonical formulas for these patterns.

4.  **Addressing Scheme**: The prompt mentions returning a raw pointer (`@intFromPtr(memory.ptr)`) from `SHARED_ALLOC` and `SHARED_MAP`. This is a significant departure from the EVM's memory model and could introduce security vulnerabilities if not handled carefully. A safer approach would be to use opaque handles or IDs (as suggested with `SharedRegionHandle`) and have the opcodes perform lookups, rather than exposing raw host memory addresses to the sandboxed EVM environment. The EVM memory should remain isolated from the host's memory.

---

An advanced shared memory system as described would be a novel feature for an EVM. The standard EVM memory is ephemeral and sandboxed to each execution context. However, `go-ethereum` provides excellent architectural patterns that are analogous to the components requested. The most relevant parallels are found in how Geth handles state journaling (which mirrors Copy-on-Write), memory management, object pooling, and transient storage (EIP-1153).

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory implements a simple memory model for the ethereum virtual machine.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return memoryPool.Get().(*Memory)
}

// Set sets offset + size to value
func (m *Memory) Set(offset, size uint64, value []byte) {
	// ... (bounds checks) ...
	copy(m.store[offset:offset+size], value)
}

// Resize resizes the memory to size
func (m *Memory) Resize(size uint64) {
	if uint64(m.Len()) < size {
		m.store = append(m.store, make([]byte, size-uint64(m.Len()))...)
	}
}

// GetCopy returns offset + size as a new slice
func (m *Memory) GetCopy(offset, size uint64) (cpy []byte) {
	// ...
	cpy = make([]byte, size)
	copy(cpy, m.store[offset:offset+size])
	return
}

// GetPtr returns the offset + size
func (m *Memory) GetPtr(offset, size uint64) []byte {
	// ...
	return m.store[offset : offset+size]
}

// Len returns the length of the backing slice
func (m *Memory) Len() int {
	return len(m.store)
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
	// ...
}

// append inserts a new modification entry to the end of the change journal.
func (j *journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
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

// storageChange is a journal entry for changing a storage slot.
type storageChange struct {
	account   common.Address
	key       common.Hash
	prevalue  common.Hash
	origvalue common.Hash
}

func (ch storageChange) revert(s *StateDB) {
	s.getStateObject(ch.account).setState(ch.key, ch.prevalue, ch.origvalue)
}

// transientStorageChange is a journal entry for changing a transient storage slot.
type transientStorageChange struct {
	account      common.Address
	key, prevalue common.Hash
}

func (ch transientStorageChange) revert(s *StateDB) {
	s.setTransientState(ch.account, ch.key, ch.prevalue)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	return s.journal.snapshot()
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	s.journal.revertToSnapshot(revid, s)
}

// SetTransientState sets transient storage for a given account. It
// adds the change to the journal so that it can be rolled back
// to its previous value if there is a revert.
func (s *StateDB) SetTransientState(addr common.Address, key, value common.Hash) {
	prev := s.GetTransientState(addr, key)
	if prev == value {
		return
	}
	s.journal.transientStateChange(addr, key, prev)
	s.setTransientState(addr, key, value)
}

// GetTransientState gets transient storage for a given account.
func (s *StateDB) GetTransientState(addr common.Address, key common.Hash) common.Hash {
	return s.transientStorage.Get(addr, key)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opTload implements the TLOAD operation.
func opTload(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	loc := stack.peek()
	val := evm.StateDB.GetTransientState(contract.Address(), loc.Bytes32())
	loc.SetBytes(val[:])
	return nil, nil
}

// opTstore implements the TSTORE operation.
func opTstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	if evm.readOnly {
		return nil, ErrWriteProtection
	}
	loc := stack.pop()
	val := stack.pop()

	evm.StateDB.SetTransientState(contract.Address(), loc.Bytes32(), val.Bytes32())
	return nil, nil
}

// opCall is the generic CALL opcode plain execution
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// ... (stack manipulation) ...
	gas, addr, value, argsOffset, argsSize, retOffset, retSize := stack.pop6()
	// ... (gas calculation) ...
	args, err := memory.view(argsOffset, argsLength)
	if err != nil {
		return nil, err
	}
	ret, returnGas, err := evm.Call(contract, common.Address(addr), args, gas, value)

	// ... (handle result) ...
	if err == nil {
		stack.push(uint256.NewInt(1))
		memory.set(retOffset, retLength, ret)
	} else {
		stack.push(uint256.NewInt(0))
	}
	// ...
	return nil, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// A storagePool is a pool of hash maps for storing state.
// The purpose of this is to keep the frequently used maps in memory
// for a long time, to avoid repeated memory allocations.
// This is not thread safe.
var storagePool = newStoragePool()

// newStoragePool creates a new storage pool.
func newStoragePool() *sync.Pool {
	return &sync.Pool{
		New: func() interface{} {
			return make(Storage)
		},
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/counter.go">
```go
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
</go-ethereum>

## Prompt Corrections
The provided prompt outlines a feature that is a significant departure from the standard EVM architecture. The following points should be considered for a robust implementation that aligns with EVM principles:

1.  **Shared Memory vs. Transient Storage**: The EVM's memory is ephemeral and strictly isolated to each call context. A system where different contracts map and access the same memory region is a new paradigm. The closest existing feature is **Transient Storage (EIP-1153)**, which provides a key-value store shared across call contexts *within a single transaction*. Your proposed `SharedRegion` is more powerful but also more complex. Using the `TSTORE`/`TLOAD` pattern (`core/vm/instructions.go`) is a good starting point for your new opcodes, as it shows how to interact with a shared, transaction-scoped data store via the `StateDB`.

2.  **Copy-on-Write (COW) vs. Journaling**: Your `CopyOnWriteManager` is conceptually identical to `go-ethereum`'s state journaling mechanism (`core/state/journal.go`). Instead of implementing COW from scratch, you should leverage or model your implementation on the `StateDB`'s `Snapshot()` and `RevertToSnapshot()` methods. Every modification to a shared region should create a `journalEntry`. If a call frame reverts, its journal entries are undone, perfectly mimicking COW semantics without needing to copy entire memory pages.

3.  **Memory Pools**: Your `MemoryPoolRegistry` is a sound performance optimization. `go-ethereum` uses this pattern in `core/state/state_object.go` with its `storagePool` to reuse `map` objects, avoiding frequent allocations in the hot path of storage access. This is an excellent, direct parallel to follow.

4.  **Security and Gas Costs**: The proposed opcodes (`SHARED_ALLOC`, `SHARED_MAP`, etc.) introduce new attack vectors if not priced correctly. Gas costs must account for memory expansion (quadratically, like standard EVM memory), access costs (potentially with a warm/cold mechanism like EIP-2929), and management overhead. The gas calculation functions in `core/vm/gas.go` are a critical reference. Furthermore, directly returning memory pointers to the EVM (`@intFromPtr`) is highly insecure; you should use opaque handles (`SharedRegionHandle`) that the opcodes translate internally to prevent the EVM from accessing arbitrary host memory.

5.  **Data Persistence**: The prompt mentions a `persistent` option for shared regions. This implies the data would survive beyond a single transaction, making it a new form of permanent storage, distinct from EVM contract storage. This is a major architectural decision with significant implications for state growth and node synchronization, and would require a dedicated storage backend, likely separate from the main state trie.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset to value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size == 0 {
		return
	}
	// length of store may never be less than offset + size.
	// The store should be resized PRIOR to calling set.
	copy(m.store[offset:offset+size], value)
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// Get returns offset + size as a new slice.
func (m *Memory) Get(offset, size int64) (cpy []byte) {
	if size == 0 {
		return nil
	}
	if len(m.store) > int(offset) {
		cpy = make([]byte, size)
		copy(cpy, m.store[offset:offset+size])
		return
	}
	return nil
}

// Len returns the length of the backing slice.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// JournalEntry is a modification entry in the state change journal.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the address that was modified by this journal entry.
	dirtied() *common.Address
}

// Journal is a log of state changes. This is used to revert changes that are made
// when a transaction execution fails.
type Journal struct {
	entries  []journalEntry         // Current changes tracked by the journal
	revisons []journalRevision      // Point-in-time snapshots of the journal
	dirties  map[common.Address]int // Dirty accounts and the number of changes
}

type journalRevision struct {
	id         int
	journalLen int
}

// Append inserts a new modification entry to the end of the journal.
func (j *Journal) Append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// Revert undoes a batch of journalled changes.
func (j *Journal) Revert(statedb *StateDB, revID int) {
	// Find the snapshot and entries to revert
	idx := -1
	for i, rev := range j.revisons {
		if rev.id == revID {
			idx = i
			break
		}
	}
	// ...
	// Replay the journal to undo changes
	for i := len(j.entries) - 1; i >= reversion.journalLen; i-- {
		// ...
		j.entries[i].revert(statedb)
	}
	j.entries = j.entries[:reversion.journalLen]
	j.revisons = j.revisons[:idx]
}

// snapshot creates a snapshot of the current journal state.
func (j *Journal) snapshot() int {
	id := nextRevisionId
	nextRevisionId++
	j.revisons = append(j.revisons, journalRevision{id, len(j.entries)})
	return id
}

// Various journal entries that can be reverted.
type (
	// ... (other entries)
	// Changes to an account's storage.
	storageChange struct {
		account       *common.Address
		key           common.Hash
		prevValue     common.Hash
		prevValueEmu  bool
		prevValExists bool
	}
)

func (ch storageChange) revert(s *StateDB) {
	s.getStateObject(*ch.account).setState(ch.key, ch.prevValue, ch.prevValueEmu)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opTload loads a word from transient storage.
func opTload(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop slot from the stack.
	loc := stack.peek()
	val := evm.StateDB.GetTransientState(contract.Address(), common.Hash(loc.Bytes32()))
	loc.SetBytes(val[:])
	return nil, nil
}

// opTstore stores a word to transient storage.
func opTstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	if evm.readOnly {
		return nil, ErrWriteProtection
	}
	// Pop slot and value from the stack.
	loc, val := stack.pop(), stack.pop()
	evm.StateDB.SetTransientState(contract.Address(), common.Hash(loc.Bytes32()), common.Hash(val.Bytes32()))
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// GetTransientState returns a value from transient storage.
func (s *StateDB) GetTransientState(addr common.Address, key common.Hash) common.Hash {
	if s.transientStorage == nil {
		return common.Hash{}
	}
	return s.transientStorage[addr][key]
}

// SetTransientState sets a value in transient storage.
func (s *StateDB) SetTransientState(addr common.Address, key, value common.Hash) {
	if s.transientStorage == nil {
		s.transientStorage = make(state.Storage)
	}
	if _, ok := s.transientStorage[addr]; !ok {
		s.transientStorage[addr] = make(map[common.Hash]common.Hash)
	}
	s.journal.append(transientStorageChange{
		account:  &addr,
		key:      key,
		prevalue: s.GetTransientState(addr, key),
	})
	s.transientStorage[addr][key] = value
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// A storagePool is a pool of hash maps for storing state.
// The purpose of this is to keep the frequently used maps in memory
// for a long time, to avoid repeated memory allocations.
// This is not thread safe.
var storagePool = newStoragePool()

// newStoragePool creates a new storage pool.
func newStoragePool() *sync.Pool {
	return &sync.Pool{
		New: func() interface{} {
			return make(Storage)
		},
	}
}

// getStorage returns a pooled storage map.
func (s *stateObject) getStorage() Storage {
	if s.storage != nil {
		return s.storage
	}
	s.storage = storagePool.Get().(Storage)
	return s.storage
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current transaction and block.
	Context
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// Depth is the current call stack
	depth int
	// ...
	// readOnly is a flag indicating whether state modifications are allowed
	readOnly bool
	// returnData is the return data of the last call.
	returnData []byte
}

// Call executes the code of a contract with the given input as parameters. It
// can be specified to execute plain regular CALL or a DELEGATECALL / CALLCODE.
//
// It returns the returned data and the remaining gas, and an error if it failed.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// ... (precompile, snapshotting logic) ...

	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution.
	contract := NewContract(caller, to, value, gas)
	contract.SetCallCode(&addr, codeHash, code)

	ret, err = run(evm, contract, input, false)

	// When the execution finishes, we save the leftover gas and return it
	// to the caller.
	leftOverGas = contract.Gas
	// ... (error handling)
	return ret, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/counter.go">
```go
// CounterSnapshot is a read-only copy of a Counter.
type CounterSnapshot int64

// Count returns the count at the time the snapshot was taken.
func (c CounterSnapshot) Count() int64 { return int64(c) }

// Counter hold an int64 value that can be incremented and decremented.
type Counter atomic.Int64

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
// MeterSnapshot is a read-only copy of the meter's internal values.
type MeterSnapshot struct {
	count                          int64
	rate1, rate5, rate15, rateMean float64
}

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
</go-ethereum>

## Prompt Corrections
The original prompt outlines a feature that is a significant departure from the standard EVM architecture. The `go-ethereum` snippets above provide analogues for implementing such a system. Here are key points to consider:

1.  **"Shared Memory" is a New State Type**: The EVM's memory model is transient and private to each call context. The proposed system, where multiple contracts can map and interact with the same memory region, acts more like a new, transaction-scoped state layer than an extension of the existing memory model. The closest existing EVM feature is **Transient Storage (EIP-1153)**. The `go-ethereum` implementation of `TSTORE`/`TLOAD` provides the best reference for how your new opcodes (`SHARED_READ`, `SHARED_WRITE`, etc.) should interact with the VM's state (`StateDB`).

2.  **Copy-on-Write via Journaling**: The prompt's concept of a `CopyOnWriteManager` can be implemented using a journaling mechanism, which is a core pattern in EVM state management. As shown in `core/state/journal.go`, all state changes are recorded as `journalEntry` objects. If a call reverts, these entries are used to undo the changes. This provides the necessary snapshot-and-revert capability required for COW semantics without needing to copy entire memory regions.

3.  **Memory Pools for Performance**: Using memory pools is a valid performance optimization. The `storagePool` in `core/state/state_object.go` is a direct example of `go-ethereum` using `sync.Pool` to reuse `map` objects for storage operations, which is analogous to your `MemoryPoolRegistry`. This is a proven pattern for reducing GC pressure in high-throughput scenarios.

4.  **Security of Opcodes**: The prompt suggests opcodes like `SHARED_ALLOC` returning a raw memory pointer to the stack. This is a significant security risk as it would expose the host machine's memory layout to the sandboxed EVM environment. A safer approach is to use opaque handles or IDs (as suggested with `SharedRegionHandle`). The opcodes would then take these handles as arguments and the `SharedMemoryManager` would perform the lookup, keeping the host memory addresses private.

5.  **Gas Costing**: The gas costs for new operations must be carefully designed to prevent DoS attacks. Operations that use or expand memory should have costs proportional to the size, similar to `MLOAD` or `SHA3`. `go-ethereum`'s gas calculation functions in `core/vm/gas.go` are the canonical reference for this.

By modeling your implementation on these battle-tested concepts from `go-ethereum`, you can build a more robust, secure, and well-integrated feature.

---

An EVM's memory model is transient and isolated to each transaction context. The concept of "Shared Memory" as described in the prompt, especially with features like persistence, COW, and direct memory mapping between contracts, is a significant extension to the standard EVM.

Go-ethereum does not have a direct implementation of such a shared memory system. However, several of its components provide excellent analogies and foundational patterns that would be highly relevant for building the requested feature.

-   **Transient Storage (EIP-1153)**: The closest standard feature to shared memory. It provides a key-value store shared across all call contexts within a single transaction, serving as a model for your new opcodes.
-   **State Journaling (`core/state/journal.go`):** The best parallel for the requested Copy-on-Write (COW) mechanism. It tracks all state changes within a transaction and can revert them to a specific snapshot. This pattern of tracking dirty state and reverting is exactly what a COW manager needs.
-   **Object Pooling**: `go-ethereum` uses object pools (`sync.Pool`) for state-related data structures to reduce garbage collection overhead, which is a direct parallel to your `MemoryPoolRegistry` concept.
-   **Memory Management (`core/vm/memory.go`):** Geth's `Memory` object demonstrates a simple, transient, and dynamically-sized memory model for a single execution context. Its gas calculation for memory expansion is a crucial concept for pricing memory usage.
-   **EVM Integration (`core/vm/evm.go`):** The `EVM.Call` method shows how new execution contexts are created, how state is snapshotted, and how results are handled, providing a template for integrating the `SharedMemoryManager`.

The following snippets are extracted from these analogous systems in go-ethereum.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/instructions.go">
```go
// TSTORE implements a transient storage store. This is a perfect analogue for a `SHARED_WRITE` opcode.
// It interacts with the StateDB to set a value in a transaction-scoped key-value store.
func opTstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop slot and value from the stack.
	loc := stack.pop()
	val := stack.pop()

	// Gas cost for this opcode is static and defined in the jumptable.
	// No extra gas is required.

	// Set the transient storage value.
	// The StateDB manages the transient storage map for the current transaction.
	evm.StateDB.SetTransientState(contract.Address(), loc, val)
	return nil, nil
}

// TLOAD implements a transient storage load. This is a perfect analogue for a `SHARED_READ` opcode.
func opTload(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop slot from the stack.
	loc := stack.peek()

	// Gas cost is static. The value is read from the StateDB.
	// The returned value is pushed back onto the stack, replacing the slot.
	*loc = evm.StateDB.GetTransientState(contract.Address(), *loc)
	return nil, nil
}

// opCall is the generic CALL opcode plain execution. It shows how a new context is created,
// how state is snapshotted before the call, and how it's reverted on error. This is a
// vital pattern for your `map_shared_region` function.
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop six arguments from the stack:
	// gas, addr, value, argsOffset, argsLength, retOffset, retLength
	gas, addr, value, argsOffset, argsLength, retOffset, retLength := stack.pop6()

	// ... (gas calculation logic) ...

	// Get the arguments from memory.
	args, err := memory.view(argsOffset, argsLength)
	if err != nil {
		return nil, err
	}

	// Make the call. Note, this is where the EVM creates a new frame and executes
	// the code at the target address. It's the core of inter-contract communication.
	ret, returnGas, err := evm.Call(contract, common.Address(addr), args, gas, value)

	// If the call was successful, copy the return data to memory.
	if err == nil {
		stack.push(uint256.NewInt(1))
		memory.set(retOffset, retLength, ret)
	} else {
		stack.push(uint256.NewInt(0))
	}
	// The remaining gas is returned to the caller's context.
	contract.Gas += returnGas
	return nil, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/state/journal.go">
```go
// This file is the best reference for implementing your Copy-on-Write manager.
// Geth's journal tracks all state changes and can revert them atomically, which
// is exactly what COW semantics provide.

// journalEntry is a modification entry in the state change journal.
type journalEntry interface {
	// revert undoes the state change in the statedb.
	revert(db *StateDB)
	// dirtied returns the address that was modified.
	dirtied() *common.Address
}

// Journal is a log of state changes. It is used to revert changes that are made
// to the state.
type Journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// snapshot creates a snapshot of the current journal state.
func (j *Journal) snapshot() int {
	return len(j.entries)
}

// revert reverts all changes made since the given snapshot.
func (j *Journal) revert(db *StateDB, snapshot int) {
	// Replay the journal to specified snapshot in reverse
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the change and remove the journal entry
		j.entries[i].revert(db)
		j.undirty(j.entries[i].dirtied())
	}
	j.entries = j.entries[:snapshot]
}

// Append a new journal entry.
func (j *Journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirty(*addr)
	}
}

// All possible journal entries. Your `CopyOnWriteManager` would have similar entries
// for things like `cowPageCreated`, `permissionChanged`, etc.
type (
	// ... (createObjectChange, balanceChange, etc.) ...

	// storageChange is a state change for a storage slot modification.
	storageChange struct {
		account       *common.Address
		key, prevalue common.Hash
	}
	// Transient storage changes.
	transientStorageChange struct {
		account      *common.Address
		key, prevalue common.Hash
	}
)

func (ch storageChange) revert(s *StateDB) {
	s.getStateObject(*ch.account).setState(ch.key, ch.prevalue)
}

func (ch transientStorageChange) revert(s *StateDB) {
	s.tstate.Set(*ch.account, ch.key, ch.prevalue)
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object. The `SharedMemoryManager`
// from your prompt would be a field on a similar struct.
type EVM struct {
	// Context provides information about the current transaction and block.
	Context
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// Depth is the current call stack
	depth int
    // ...
}

// Call executes the code of a contract with the given input as parameters. This method
// demonstrates how new execution contexts are created and how state is snapshotted
// and reverted. This is the pattern your `map_shared_region` function should follow.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to change state from within a static call
	if evm.readOnly && value.Sign() != 0 {
		return nil, gas, ErrWriteProtection
	}
	// ... (value transfer logic) ...

	// Take a snapshot of the current state. This is the crucial part for COW.
	// If the sub-call reverts, we can roll back to this point.
	snapshot := evm.StateDB.Snapshot()

	// ... (precompile checks) ...

	// Create a new contract object for the call.
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, codeHash, code)

	ret, err = run(evm, contract, input, false)

	// When the execution finishes, we save the leftover gas and return it
	// to the caller.
	leftOverGas = contract.Gas

	if err != nil {
		// On error, revert all state changes made by this call.
		evm.StateDB.RevertToSnapshot(snapshot)
	}
	return ret, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/state/state_object.go">
```go
// The `MemoryPoolRegistry` in your prompt is a form of object pooling. Go-ethereum uses
// `sync.Pool` for a similar purpose: to reuse storage maps and reduce GC pressure.

// A storagePool is a pool of hash maps for storing state.
// The purpose of this is to keep the frequently used maps in memory
// for a long time, to avoid repeated memory allocations.
var storagePool = newStoragePool()

func newStoragePool() *sync.Pool {
	return &sync.Pool{
		New: func() interface{} {
			return make(Storage)
		},
	}
}

type stateObject struct {
    // ...
	// Storage cache
	storage Storage // Storage cache of original entries to dedup rewrites
	dirty   Storage // Storage entries that have been modified in the current transaction execution
    // ...
}

// getStorage returns a pooled storage map.
func (s *stateObject) getStorage() Storage {
	if s.storage != nil {
		return s.storage
	}
	s.storage = storagePool.Get().(Storage)
	return s.storage
}

// Put a storage map back into the pool.
func (s *stateObject) finalise() {
	if s.storage == nil {
		return
	}
	// All dirty slots are copied to a new map. The original map is released
	// back to the pool. The new map is smaller and can be GC'd when the
	// object is no longer referenced.
	if len(s.dirty) > 0 {
		s.storage = make(Storage, len(s.dirty))
		for k, v := range s.dirty {
			s.storage[k] = v
		}
	} else {
		// The storage is clean. Release the map to the pool.
		// It is important to clear the map before releasing.
		for key := range s.storage {
			delete(s.storage, key)
		}
		storagePool.Put(s.storage)
	}
	s.storage = nil // map is now owned by the pool
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/memory.go">
```go
// This file shows the standard EVM memory model. It's a simple, linearly expanding
// byte array, much simpler than your proposed `SharedRegion` but forms the foundation.

// Memory represents the EVM's memory space.
type Memory struct {
	store       []byte // Backing data store for memory
	lastGasCost uint64 // Gas cost of the last memory expansion
	size        int    // Current size of the memory
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Resize resizes the memory to the given size. If the size is smaller than the
// current size, the memory is not modified.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		// In the case of a resize, we have to potentially allocate a new
		// backing slice.
		m.store = common.Extend(m.store, int(size))
	}
	m.size = int(size)
}

// GetCopy returns a copy of the memory region.
func (m *Memory) GetCopy(offset, size int64) []byte {
	// ... (implementation with bounds checks) ...
	return common.CopyBytes(m.store[offset : offset+size])
}

// Set sets the memory region at a given offset to a slice of bytes.
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size > 0 {
		// The memory needs to be resized to contain the new data.
		m.Resize(offset + size)
		copy(m.store[offset:offset+size], value)
	}
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return m.size
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/gas.go">
```go
// This file contains the gas calculation logic, including the quadratic cost for
// memory expansion, which is critical for pricing your shared memory operations.

// memoryGasCost calculates the gas cost for memory expansion.
func memoryGasCost(mem *Memory) uint64 {
	// The cost of memory expansion is MSTORE_words * 3 + MSTORE_words^2 / 512.
	words := uint64(mem.Len() / 32)
	return words*GasMem + words*words/512
}

// callGas calculates the gas given to a sub-call.
func callGas(isEip150 bool, availableGas, localGas uint64) uint64 {
	if isEip150 {
		// EIP-150: The 'all-but-one-64th' rule.
		return availableGas - availableGas/64
	}
	return availableGas
}
```
</file>
## Prompt Corrections
The user's prompt outlines a feature that is significantly more complex than any single component in go-ethereum. It combines concepts from state management, memory management, and inter-contract communication. The prompt is well-structured, but it's important to recognize that this is a major architectural addition to an EVM, not a simple feature implementation.

1.  **Analogy to Transient Storage**: The prompt's concept of "shared memory" is most analogous to EIP-1153's Transient Storage. Both are designed for data sharing across call contexts within a single transaction. The implementation should look closely at how Geth handles `TSTORE` and `TLOAD`, which use a simple map in the `StateDB` that is cleared after the transaction. This is a much simpler and more realistic model for cross-contract data sharing than a full-blown IPC/shared-memory system.

2.  **Copy-on-Write vs. Journaling**: The request for "Copy-on-Write" is best implemented using a journaling mechanism like Geth's `state.Journal`. The journal tracks the "diff" of state changes, and these diffs are either committed or reverted. This avoids copying the entire state for each sub-call and is a proven, efficient pattern for EVM state management. Your `CopyOnWriteManager` could be implemented as a specialized journal.

3.  **Opcode Gas Costs**: The proposed opcodes (`SHARED_READ`, `SHARED_WRITE`, etc.) will need carefully designed gas costs. The prompt's gas calculation (`100 + size_usize / 32`) is a good start but should be compared to analogous Geth opcodes (`MLOAD`, `MSTORE`, `SLOAD`, `SSTORE`). The gas model should account for:
    *   A base cost for the operation.
    *   A cost proportional to the amount of data being accessed (per word or per byte).
    *   A potential "cold" vs. "warm" access cost, similar to EIP-2929, if this is the first time a shared region is accessed in a transaction.
    *   The `core/vm/gas.go` file provides canonical formulas for these patterns.

4.  **Addressing Scheme**: The prompt mentions returning a raw pointer (`@intFromPtr(memory.ptr)`) from `SHARED_ALLOC` and `SHARED_MAP`. This is a significant departure from the EVM's memory model and could introduce security vulnerabilities if not handled carefully. A safer approach would be to use opaque handles or IDs (as suggested with `SharedRegionHandle`) and have the opcodes perform lookups, rather than exposing raw host memory addresses to the sandboxed EVM environment. The EVM memory should remain isolated from the host's memory.

</go-ethereum>

---

An EVM's memory model is transient and isolated to each transaction context. The concept of "Shared Memory" as described in the prompt, especially with features like persistence, COW, and direct memory mapping between contracts, is a significant extension to the standard EVM.

Go-ethereum does not have a direct implementation of such a shared memory system. However, several of its components provide excellent analogies and foundational patterns that would be highly relevant for building the requested feature.

-   **Shared Memory / IPC (EIP-1153)**: The closest standard feature is Transient Storage. It provides a key-value store shared across all call contexts within a single transaction, but is cleared at the end. The `TSTORE` and `TLOAD` opcode implementations are excellent references for the new `SHARED_*` opcodes.
-   **Copy-on-Write (Journaling)**: Geth's state management uses a journaling system that functions like a copy-on-write mechanism for state changes. The `state.Journal` is the perfect reference for implementing the `CopyOnWriteManager`'s transactional behavior.
-   **Memory Management (`core/vm/memory.go`)**: Geth's `Memory` object demonstrates a simple, transient, and dynamically-sized memory model for a single execution context. Its gas calculation for memory expansion is a crucial concept for pricing memory usage in the new `SharedRegion`s.
-   **Memory Pools (`sync.Pool`)**: Geth uses object pools to reduce allocation overhead for frequently used objects. The `sync.Pool` pattern seen in `core/types/hashing.go` is a direct parallel to the requested `MemoryPoolRegistry`.
-   **Contract Execution Context (`core/vm/evm.go`)**: Geth's `EVM.Call` method demonstrates how to create new execution contexts, manage gas, handle state changes, and process return data, all of which are relevant for the proposed `SharedMemoryManager`.

The following snippets are extracted from these analogous systems in go-ethereum.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opTload loads a word from transient storage.
func opTload(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop slot from the stack.
	loc := stack.peek()
	// Gas cost is static. The value is read from the StateDB.
	// The returned value is pushed back onto the stack, replacing the slot.
	*loc, _ = uint256.FromBig(evm.StateDB.GetTransientState(contract.Address(), common.Hash(loc.Bytes32())).Big())
	return nil, nil
}

// opTstore stores a word to transient storage.
func opTstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	if evm.readOnly {
		return nil, ErrWriteProtection
	}
	// Pop slot and value from the stack.
	loc, val := stack.pop(), stack.pop()
	// Gas cost for this opcode is static and defined in the jumptable.
	// No extra gas is required.
	evm.StateDB.SetTransientState(contract.Address(), common.Hash(loc.Bytes32()), common.Hash(val.Bytes32()))
	return nil, nil
}

// opCall is the generic CALL opcode plain execution
func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop six arguments from the stack:
	// gas, addr, value, argsOffset, argsLength, retOffset, retLength
	gas, addr, value, argsOffset, argsLength, retOffset, retLength := stack.pop6()

	// ... gas calculation and memory expansion ...

	// Get the arguments from memory.
	args, err := memory.view(argsOffset, argsLength)
	if err != nil {
		return nil, err
	}

	// Make the call. Note, this is where the EVM creates a new frame and executes
	// the code at the target address. It's the core of inter-contract communication.
	ret, returnGas, err := evm.Call(contract, common.Address(addr), args, gas, value)

	// If the call was successful, copy the return data to memory.
	if err == nil {
		stack.push(uint256.NewInt(1))
		memory.set(retOffset, retLength, ret)
	} else {
		stack.push(uint256.NewInt(0))
	}
	// The remaining gas is returned to the caller's context.
	contract.Gas += returnGas
	return nil, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// JournalEntry is a modification entry in the state change journal.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the address that was modified by this journal entry.
	dirtied() *common.Address
}

// Journal is a log of state changes. This is used to revert changes that are made
// when a transaction execution fails.
type Journal struct {
	entries  []journalEntry         // Current changes tracked by the journal
	revisons []journalRevision      // Point-in-time snapshots of the journal
	dirties  map[common.Address]int // Dirty accounts and the number of changes
}

type journalRevision struct {
	id         int
	journalLen int
}

// Append inserts a new modification entry to the end of the journal.
func (j *Journal) Append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// Revert undoes a batch of journalled changes.
func (j *Journal) Revert(statedb *StateDB, revID int) {
	// Find the snapshot and entries to revert
	idx := -1
	for i, rev := range j.revisons {
		if rev.id == revID {
			idx = i
			break
		}
	}
	// ... (error handling) ...
	reversion := j.revisons[idx]

	// Replay the journal to undo changes
	for i := len(j.entries) - 1; i >= reversion.journalLen; i-- {
		// ...
		j.entries[i].revert(statedb)
	}
	j.entries = j.entries[:reversion.journalLen]
	j.revisons = j.revisons[:idx]
}

// snapshot creates a snapshot of the current journal state.
func (j *Journal) snapshot() int {
	id := nextRevisionId
	nextRevisionId++
	j.revisons = append(j.revisons, journalRevision{id, len(j.entries)})
	return id
}

// Various journal entries that can be reverted.
type (
	// ... (other entries)
	// Changes to an account's storage.
	storageChange struct {
		account       *common.Address
		key           common.Hash
		prevValue     common.Hash
		prevValueEmu  bool
		prevValExists bool
	}
	// Changes to transient storage
	transientStorageChange struct {
		account  *common.Address
		key      common.Hash
		prevalue common.Hash
	}
)
// revert implements journalEntry.
func (ch transientStorageChange) revert(s *StateDB) {
	s.SetTransientState(*ch.account, ch.key, ch.prevalue)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state.
type StateDB struct {
	// ...
	// Journal of state modifications. This is the backbone of
	// snapshot and revert capability.
	journal *journal

	// This map holds the transient storage for transactions. It is shared between
	// all StateDB instances derived from the same root object, but is not
	// committed to the database. It is reset on each transaction.
	transientStorage state.Storage
	// ...
}

// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	return s.journal.snapshot()
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	s.journal.revert(s, revid)
}

// GetTransientState returns a value from transient storage.
func (s *StateDB) GetTransientState(addr common.Address, key common.Hash) common.Hash {
	if s.transientStorage == nil {
		return common.Hash{}
	}
	return s.transientStorage.Get(addr, key)
}

// SetTransientState sets a value in transient storage.
func (s *StateDB) SetTransientState(addr common.Address, key, value common.Hash) {
	if s.transientStorage == nil {
		s.transientStorage = make(state.Storage)
	}
	s.journal.append(transientStorageChange{
		account:  &addr,
		key:      key,
		prevalue: s.GetTransientState(addr, key),
	})
	s.transientStorage.Set(addr, key, value)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents the EVM's memory space.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{store: make([]byte, 0, 1024)}
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = common.ExtendMemory(m.store, int(size-uint64(len(m.store))))
	}
}

// GetCopy returns a copy of the backed buffer.
func (m *Memory) GetCopy(offset, size int64) []byte {
	// ...
	cpy := make([]byte, size)
	copy(cpy, m.store[offset:offset+size])
	return cpy
}
// Len returns the length of the backing slice.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// memoryGasCost calculates the gas cost for memory expansion.
func memoryGasCost(mem *Memory, newSize uint64) (uint64, error) {
	if newSize == 0 {
		return 0, nil
	}
	// ... (overflow checks) ...
	// memory gas, see yellow paper appendix g
	newSizeWords := (newSize + 31) / 32
	newSize = newSizeWords * 32

	// The cost of memory is calculated as:
	// Cmem(a) = Gmem * a + a*a / Gquadcoeffdiv
	// where a is the number of words.
	oldSize := uint64(mem.Len())
	oldSizeWords := (oldSize + 31) / 32

	if newSize > oldSize {
		newTotalCost := newSizeWords*newSizeWords/params.MemoryGasQuadCoeffDiv + newSizeWords*params.MemoryGasLinear
		oldTotalCost := oldSizeWords*oldSizeWords/params.MemoryGasQuadCoeffDiv + oldSizeWords*params.MemoryGasLinear
		return newTotalCost - oldTotalCost, nil
	}
	return 0, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the execution of contracts.
type EVM struct {
	// ...
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// Depth is the current call stack
	depth int
	// ...
}

// Call executes the code of a contract with the given input as parameters. It
// can be specified to execute plain regular CALL or a DELEGATECALL / CALLCODE.
//
// It returns the returned data and the remaining gas, and an error if it failed.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// ...
	snapshot := evm.StateDB.Snapshot()

	// ... (precompile checks and value transfer) ...

	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution.
	contract := NewContract(caller, to, value, gas)
	contract.SetCallCode(&addr, codeHash, code)

	ret, err = run(evm, contract, input, false)

	// When the execution finishes, we save the leftover gas and return it
	// to the caller.
	leftOverGas = contract.Gas

	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
	}
	return ret, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// A storagePool is a pool of hash maps for storing state.
// The purpose of this is to keep the frequently used maps in memory
// for a long time, to avoid repeated memory allocations.
// This is not thread safe.
var storagePool = newStoragePool()

// newStoragePool creates a new storage pool.
func newStoragePool() *sync.Pool {
	return &sync.Pool{
		New: func() interface{} {
			return make(Storage)
		},
	}
}

// stateObject represents an Ethereum account which is being modified.
type stateObject struct {
	// ...
	// Storage cache
	storage Storage // Storage cache of original entries to dedup rewrites
	dirty   Storage // Storage entries that have been modified in the current transaction execution
    // ...
}

// getStorage returns a pooled storage map.
func (s *stateObject) getStorage() Storage {
	if s.storage != nil {
		return s.storage
	}
	s.storage = storagePool.Get().(Storage)
	return s.storage
}

// finalise transitions the object from an ephemeral in-memory representation to
// a representation ready for trie inclusion. It returns the dirty storage slots
// that also need to be committed into the storage trie.
//
// After this method is called, the state object cannot be used anymore.
func (s *stateObject) finalise() {
	if s.storage == nil {
		return
	}
	// All dirty slots are copied to a new map. The original map is released
	// back to the pool. The new map is smaller and can be GC'd when the
	// object is no longer referenced.
	if len(s.dirty) > 0 {
		s.storage = make(Storage, len(s.dirty))
		for k, v := range s.dirty {
			s.storage[k] = v
		}
	} else {
		// The storage is clean. Release the map to the pool.
		// It is important to clear the map before releasing.
		for key := range s.storage {
			delete(s.storage, key)
		}
		storagePool.Put(s.storage)
	}
	s.storage = nil // map is now owned by the pool
}

```
</file>
</go-ethereum>

## Prompt Corrections
The user's prompt outlines a feature that is significantly more complex than any single component in go-ethereum. It combines concepts from state management, memory management, and inter-contract communication. The prompt is well-structured, but it's important to recognize that this is a major architectural addition to an EVM, not a simple feature implementation.

1.  **Analogy to Transient Storage**: The prompt's concept of "shared memory" is most analogous to EIP-1153's Transient Storage. Both are designed for data sharing across call contexts within a single transaction. The implementation should look closely at how Geth handles `TSTORE` and `TLOAD`, which use a simple map in the `StateDB` that is cleared after the transaction. This is a much simpler and more realistic model for cross-contract data sharing than a full-blown IPC/shared-memory system.

2.  **Copy-on-Write vs. Journaling**: The request for "Copy-on-Write" is best implemented using a journaling mechanism like Geth's `state.Journal`. The journal tracks the "diff" of state changes, and these diffs are either committed or reverted. This avoids copying the entire state for each sub-call and is a proven, efficient pattern for EVM state management.

3.  **Opcode Gas Costs**: The proposed opcodes (`SHARED_READ`, `SHARED_WRITE`, etc.) will need carefully designed gas costs. The prompt's gas calculation (`100 + size_usize / 32`) is a good start but should be compared to analogous Geth opcodes (`MLOAD`, `MSTORE`, `SLOAD`, `SSTORE`). The gas model should account for:
    *   A base cost for the operation.
    *   A cost proportional to the amount of data being accessed (per word or per byte).
    *   A potential "cold" vs. "warm" access cost, similar to EIP-2929, if this is the first time a shared region is accessed in a transaction.
    *   The `core/vm/gas.go` file provides canonical formulas for these patterns.

4.  **Addressing Scheme**: The prompt mentions returning a raw pointer (`@intFromPtr(memory.ptr)`) from `SHARED_ALLOC` and `SHARED_MAP`. This is a significant departure from the EVM's memory model and could introduce security vulnerabilities if not handled carefully. A safer approach would be to use opaque handles or IDs (as suggested with `SharedRegionHandle`) and have the opcodes perform lookups, rather than exposing raw host memory addresses to the sandboxed EVM environment. The EVM memory should remain isolated from the host's memory.

---

An EVM's memory model is transient and isolated to each transaction context. The concept of "Shared Memory" as described in the prompt, especially with features like persistence, COW, and direct memory mapping between contracts, is a significant extension to the standard EVM.

Go-ethereum does not have a direct implementation of such a shared memory system. However, several of its components provide excellent analogies and foundational patterns that would be highly relevant for building the requested feature.

-   **Memory Management (`core/vm/memory.go`):** Geth's `Memory` object demonstrates a simple, transient, and dynamically-sized memory model for a single execution context. Its gas calculation for memory expansion is a crucial concept for pricing memory usage.
-   **State Journaling (`core/state/journal.go`):** The state journal is the best parallel for the requested Copy-on-Write (COW) mechanism. It tracks all state changes within a transaction and can revert them to a specific snapshot. This pattern of tracking dirty state and reverting is exactly what a COW manager needs.
-   **Contract Execution Context (`core/vm/contract.go`):** Geth's `Contract` object encapsulates the code and input data for a single call frame. This provides a model for what a "context" is and how it accesses its own data, which the `SharedRegion` would extend.
-   **Sidecar Data (EIP-4844 Blobs):** The introduction of blob transactions in EIP-4844 provides the closest Geth analogy to shared data regions. Blobs are data "on the side" of a transaction, with their own separate fee market. This is a great model for managing and pricing access to shared resources that aren't part of the core EVM state.
-   **Performance Metrics (`metrics/`):** Geth's `metrics` package offers a robust framework for performance tracking, directly mapping to the `SharedMemoryPerformanceTracker` requested in the prompt.

The following snippets are extracted from these analogous systems in go-ethereum.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opTstore implements the TSTORE operation.
func opTstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	if evm.readOnly {
		return nil, ErrWriteProtection
	}
	// Pop slot and value from the stack.
	loc := stack.pop()
	val := stack.pop()

	// Gas cost for this opcode is static and defined in the jumptable.
	// No extra gas is required.

	// Set the transient storage value.
	// The StateDB manages the transient storage map for the current transaction.
	evm.StateDB.SetTransientState(contract.Address(), loc, val)
	return nil, nil
}

// opTload implements a transient storage load.
func opTload(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop slot from the stack.
	loc := stack.peek()

	// Gas cost is static. The value is read from the StateDB.
	// The returned value is pushed back onto the stack, replacing the slot.
	*loc = evm.StateDB.GetTransientState(contract.Address(), *loc)
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// JournalEntry is a modification entry in the state change journal.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the address that was modified by this journal entry.
	dirtied() *common.Address
}

// Journal is a log of state changes. This is used to revert changes that are made
// when a transaction execution fails.
type Journal struct {
	entries  []journalEntry         // Current changes tracked by the journal
	revisons []journalRevision      // Point-in-time snapshots of the journal
	dirties  map[common.Address]int // Dirty accounts and the number of changes
}

type journalRevision struct {
	id         int
	journalLen int
}

// ...

// Append inserts a new modification entry to the end of the journal.
func (j *Journal) Append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// Revert undoes a batch of journalled changes.
func (j *Journal) Revert(statedb *StateDB, revID int) {
	// Find the snapshot and entries to revert
	idx := -1
	for i, rev := range j.revisons {
		if rev.id == revID {
			idx = i
			break
		}
	}
	// ...
	// Replay the journal to undo changes
	for i := len(j.entries) - 1; i >= reversion.journalLen; i-- {
		// ...
		entry := j.entries[i]
		// ...
		entry.revert(statedb)
	}
	j.entries = j.entries[:reversion.journalLen]
	j.revisons = j.revisons[:idx]
}

// snapshot creates a snapshot of the current journal state.
func (j *Journal) snapshot() int {
	id := nextRevisionId
	nextRevisionId++
	j.revisons = append(j.revisons, journalRevision{id, len(j.entries)})
	return id
}

// Various journal entries that can be reverted.
type (
	// ...
	// Changes to an account's storage.
	storageChange struct {
		account       *common.Address
		key           common.Hash
		prevValue     common.Hash
		prevValueEmu  bool
		prevValExists bool
	}
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// A storagePool is a pool of hash maps for storing state.
// The purpose of this is to keep the frequently used maps in memory
// for a long time, to avoid repeated memory allocations.
// This is not thread safe.
var storagePool = newStoragePool()

// newStoragePool creates a new storage pool.
func newStoragePool() *sync.Pool {
	return &sync.Pool{
		New: func() interface{} {
			return make(Storage)
		},
	}
}

// stateObject represents an Ethereum account which is being modified.
type stateObject struct {
	// ...
	// Storage cache
	storage Storage // Storage cache of original entries to dedup rewrites
	dirty   Storage // Storage entries that have been modified in the current transaction execution
    // ...
}

// getStorage returns a pooled storage map.
func (s *stateObject) getStorage() Storage {
	if s.storage != nil {
		return s.storage
	}
	s.storage = storagePool.Get().(Storage)
	return s.storage
}

// Put a storage map back into the pool.
func (s *stateObject) finalise() {
	if s.storage == nil {
		return
	}
	// All dirty slots are copied to a new map. The original map is released
	// back to the pool. The new map is smaller and can be GC'd when the
	// object is no longer referenced.
	if len(s.dirty) > 0 {
		s.storage = make(Storage, len(s.dirty))
		for k, v := range s.dirty {
			s.storage[k] = v
		}
	} else {
		// The storage is clean. Release the map to the pool.
		// It is important to clear the map before releasing.
		for key := range s.storage {
			delete(s.storage, key)
		}
		storagePool.Put(s.storage)
	}
	s.storage = nil // map is now owned by the pool
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// ...
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// depth is the current call stack
	depth int
	// ...
}

// Call executes the code of a contract with the given input as parameters. It
// can be specified to execute plain regular CALL or a DELEGATECALL / CALLCODE.
//
// It returns the returned data and the remaining gas, and an error if it failed.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// ...
	var (
		to       = AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	// ... (precompile checks) ...

	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution.
	contract := NewContract(caller, to, value, gas)
	contract.SetCallCode(&addr, codeHash, code)

	ret, err = run(evm, contract, input, false)

	// When the execution finishes, we save the leftover gas and return it
	// to the caller.
	leftOverGas = contract.Gas

	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
	}
	return ret, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
// MeterSnapshot is a read-only copy of the meter's internal values.
type MeterSnapshot struct {
	count                          int64
	rate1, rate5, rate15, rateMean float64
}

// ...

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
</go-ethereum>
## Prompt Corrections
The user's prompt outlines a feature that is significantly more complex than any single component in go-ethereum. It combines concepts from state management, memory management, and inter-contract communication. The prompt is well-structured, but it's important to recognize that this is a major architectural addition to an EVM, not a simple feature implementation.

1.  **Analogy to Transient Storage**: The prompt's concept of "shared memory" is most analogous to EIP-1153's Transient Storage. Both are designed for data sharing across call contexts within a single transaction. The implementation should look closely at how Geth handles `TSTORE` and `TLOAD`, which use a simple map in the `StateDB` that is cleared after the transaction. This is a much simpler and more realistic model for cross-contract data sharing than a full-blown IPC/shared-memory system.

2.  **Copy-on-Write vs. Journaling**: The request for "Copy-on-Write" is best implemented using a journaling mechanism like Geth's `state.Journal`. The journal tracks the "diff" of state changes, and these diffs are either committed or reverted. This avoids copying the entire state for each sub-call and is a proven, efficient pattern for EVM state management.

3.  **Opcode Gas Costs**: The proposed opcodes (`SHARED_READ`, `SHARED_WRITE`, etc.) will need carefully designed gas costs. The prompt's gas calculation (`100 + size_usize / 32`) is a good start but should be compared to analogous Geth opcodes (`MLOAD`, `MSTORE`, `SLOAD`, `SSTORE`). The gas model should account for:
    *   A base cost for the operation.
    *   A cost proportional to the amount of data being accessed (per word or per byte).
    *   A potential "cold" vs. "warm" access cost, similar to EIP-2929, if this is the first time a shared region is accessed in a transaction.
    *   The `core/vm/gas.go` file provides canonical formulas for these patterns.

4.  **Addressing Scheme**: The prompt mentions returning a raw pointer (`@intFromPtr(memory.ptr)`) from `SHARED_ALLOC` and `SHARED_MAP`. This is a significant departure from the EVM's memory model and could introduce security vulnerabilities if not handled carefully. A safer approach would be to use opaque handles or IDs (as suggested with `SharedRegionHandle`) and have the opcodes perform lookups, rather than exposing raw host memory addresses to the sandboxed EVM environment. The EVM memory should remain isolated from the host's memory.

