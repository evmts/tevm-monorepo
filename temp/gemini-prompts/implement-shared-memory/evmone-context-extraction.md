You are a prompt engineer helping to add relevant context from evmone to EVM implementation prompts.

## Your Task
Review the following prompt and the evmone codebase, then extract ONLY the most relevant code snippets that would help implement the requested feature.

## Original Prompt
# Implement Shared Memory

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_shared_memory` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_shared_memory feat_implement_shared_memory`
3. **Work in isolation**: `cd g/feat_implement_shared_memory`
4. **Commit message**: `🔗 feat: implement shared memory system for efficient cross-context data sharing and IPC`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement a comprehensive shared memory system that enables efficient data sharing between execution contexts, processes, and contracts. This includes memory pools, copy-on-write semantics, inter-process communication, memory mapping, and advanced memory management features while maintaining security isolation and performance optimization.

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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Security validation** - Access control must be robust and secure
3. **Memory safety** - No memory leaks, corruption, or buffer overflows
4. **Performance validation** - Shared memory must provide performance benefits
5. **Correctness** - Data consistency and isolation must be maintained
6. **Resource efficiency** - Memory usage must be optimized and monitored

## References

- [Shared Memory](https://en.wikipedia.org/wiki/Shared_memory) - Shared memory concepts
- [Copy-on-Write](https://en.wikipedia.org/wiki/Copy-on-write) - COW implementation strategies
- [Memory Pool](https://en.wikipedia.org/wiki/Memory_pool) - Memory pool design patterns
- [Inter-Process Communication](https://en.wikipedia.org/wiki/Inter-process_communication) - IPC mechanisms
- [Memory Management](https://en.wikipedia.org/wiki/Memory_management) - Memory management principles

## Our Current Zig EVM Implementation
Found 5 Zig files in src/evm/

## EVMONE Source Code
<evmone>
Found 6 evmone files total
</evmone>

## Instructions
1. Read the original prompt carefully to understand what feature needs to be implemented
2. Search through the evmone code to find relevant implementations
3. Extract ONLY the most relevant code snippets that would help with this specific feature
4. Format your response as XML snippets that can be appended to the original prompt
5. Include corrections to the prompt if you notice any inaccuracies
6. Focus on quality over quantity - include only the most helpful context

## Output Format
Provide your response in this exact format:

<evmone>
<file path="github_url_here">
[Include only the most relevant code snippets with proper context]
</file>

<file path="another_github_url_here">
[More relevant code if needed]
</file>
</evmone>

If you found any errors or improvements for the original prompt, include them after the code snippets:

## Prompt Corrections
[Any corrections or improvements to the original prompt]

Remember: Only include code that is directly relevant to implementing the feature described in the prompt. Quality and relevance over quantity.