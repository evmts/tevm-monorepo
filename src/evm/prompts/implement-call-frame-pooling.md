# Implement Call Frame Pooling

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_call_frame_pooling` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_call_frame_pooling feat_implement_call_frame_pooling`
3. **Work in isolation**: `cd g/feat_implement_call_frame_pooling`
4. **Commit message**: `⚡ perf: implement call frame pooling for efficient memory management and reduced allocation overhead`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive call frame pooling to efficiently manage frame allocation and deallocation during EVM execution. This includes pooled frame allocation, stack management, memory reuse optimization, and automated pool sizing based on execution patterns to minimize garbage collection pressure and improve execution performance.

## Call Frame Pooling Specifications

### Core Frame Pool Framework

#### 1. Frame Pool Manager
```zig
pub const FramePoolManager = struct {
    allocator: std.mem.Allocator,
    config: PoolConfig,
    frame_pools: [MAX_FRAME_SIZES]?FramePool,
    pool_statistics: PoolStatistics,
    allocation_tracker: AllocationTracker,
    gc_trigger: GarbageCollectionTrigger,
    
    pub const MAX_FRAME_SIZES = 8;  // Different frame sizes for optimization
    pub const DEFAULT_POOL_SIZE = 256;
    pub const MAX_POOL_SIZE = 4096;
    
    pub const PoolConfig = struct {
        enable_pooling: bool,
        enable_size_classes: bool,
        enable_auto_tuning: bool,
        enable_gc_integration: bool,
        initial_pool_sizes: [MAX_FRAME_SIZES]u32,
        max_pool_sizes: [MAX_FRAME_SIZES]u32,
        growth_factor: f64,
        shrink_threshold: f64,
        gc_pressure_threshold: f64,
        pool_cleanup_interval: u64,
        
        pub fn high_performance() PoolConfig {
            return PoolConfig{
                .enable_pooling = true,
                .enable_size_classes = true,
                .enable_auto_tuning = true,
                .enable_gc_integration = true,
                .initial_pool_sizes = [_]u32{128, 128, 64, 64, 32, 32, 16, 16},
                .max_pool_sizes = [_]u32{1024, 1024, 512, 512, 256, 256, 128, 128},
                .growth_factor = 1.5,
                .shrink_threshold = 0.25,
                .gc_pressure_threshold = 0.8,
                .pool_cleanup_interval = 10000,  // 10 seconds
            };
        }
        
        pub fn balanced() PoolConfig {
            return PoolConfig{
                .enable_pooling = true,
                .enable_size_classes = true,
                .enable_auto_tuning = true,
                .enable_gc_integration = false,
                .initial_pool_sizes = [_]u32{64, 64, 32, 32, 16, 16, 8, 8},
                .max_pool_sizes = [_]u32{512, 512, 256, 256, 128, 128, 64, 64},
                .growth_factor = 1.3,
                .shrink_threshold = 0.3,
                .gc_pressure_threshold = 0.7,
                .pool_cleanup_interval = 30000,  // 30 seconds
            };
        }
        
        pub fn minimal() PoolConfig {
            return PoolConfig{
                .enable_pooling = true,
                .enable_size_classes = false,
                .enable_auto_tuning = false,
                .enable_gc_integration = false,
                .initial_pool_sizes = [_]u32{32, 0, 0, 0, 0, 0, 0, 0},
                .max_pool_sizes = [_]u32{128, 0, 0, 0, 0, 0, 0, 0},
                .growth_factor = 1.2,
                .shrink_threshold = 0.2,
                .gc_pressure_threshold = 0.9,
                .pool_cleanup_interval = 60000,  // 60 seconds
            };
        }
        
        pub fn disabled() PoolConfig {
            return PoolConfig{
                .enable_pooling = false,
                .enable_size_classes = false,
                .enable_auto_tuning = false,
                .enable_gc_integration = false,
                .initial_pool_sizes = std.mem.zeroes([MAX_FRAME_SIZES]u32),
                .max_pool_sizes = std.mem.zeroes([MAX_FRAME_SIZES]u32),
                .growth_factor = 1.0,
                .shrink_threshold = 0.0,
                .gc_pressure_threshold = 1.0,
                .pool_cleanup_interval = 0,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: PoolConfig) !FramePoolManager {
        var manager = FramePoolManager{
            .allocator = allocator,
            .config = config,
            .frame_pools = std.mem.zeroes([MAX_FRAME_SIZES]?FramePool),
            .pool_statistics = PoolStatistics.init(),
            .allocation_tracker = AllocationTracker.init(),
            .gc_trigger = GarbageCollectionTrigger.init(config.gc_pressure_threshold),
        };
        
        if (config.enable_pooling) {
            try manager.initialize_pools();
        }
        
        return manager;
    }
    
    pub fn deinit(self: *FramePoolManager) void {
        for (&self.frame_pools) |*pool_opt| {
            if (pool_opt.*) |*pool| {
                pool.deinit();
                pool_opt.* = null;
            }
        }
    }
    
    pub fn acquire_frame(self: *FramePoolManager, frame_type: FrameType) !*PooledFrame {
        if (!self.config.enable_pooling) {
            return self.allocate_frame_direct(frame_type);
        }
        
        const size_class = self.get_size_class(frame_type);
        
        if (self.frame_pools[size_class]) |*pool| {
            if (pool.acquire()) |frame| {
                self.pool_statistics.record_pool_hit(size_class);
                self.allocation_tracker.record_pool_allocation(frame_type);
                return frame;
            }
        }
        
        // Pool miss - allocate directly
        self.pool_statistics.record_pool_miss(size_class);
        const frame = try self.allocate_frame_direct(frame_type);
        
        // Try to expand pool if auto-tuning is enabled
        if (self.config.enable_auto_tuning) {
            try self.maybe_expand_pool(size_class);
        }
        
        return frame;
    }
    
    pub fn release_frame(self: *FramePoolManager, frame: *PooledFrame) void {
        if (!self.config.enable_pooling) {
            self.deallocate_frame_direct(frame);
            return;
        }
        
        const size_class = self.get_size_class(frame.frame_type);
        
        // Reset frame state
        frame.reset();
        
        if (self.frame_pools[size_class]) |*pool| {
            if (pool.release(frame)) {
                self.pool_statistics.record_pool_return(size_class);
                self.allocation_tracker.record_pool_deallocation(frame.frame_type);
                return;
            }
        }
        
        // Pool is full - deallocate directly
        self.deallocate_frame_direct(frame);
        self.pool_statistics.record_pool_overflow(size_class);
    }
    
    pub fn get_or_create_frame(self: *FramePoolManager, frame_type: FrameType, parent: ?*PooledFrame) !*PooledFrame {
        const frame = try self.acquire_frame(frame_type);
        
        // Initialize frame with parent relationship
        frame.initialize(frame_type, parent);
        
        // Track frame in allocation hierarchy
        if (parent) |p| {
            p.add_child(frame);
        }
        
        return frame;
    }
    
    pub fn auto_tune_pools(self: *FramePoolManager) !void {
        if (!self.config.enable_auto_tuning) return;
        
        for (0..MAX_FRAME_SIZES) |i| {
            if (self.frame_pools[i]) |*pool| {
                const stats = pool.get_statistics();
                
                // Expand pool if hit rate is low
                if (stats.hit_rate < 0.8 and stats.current_size < self.config.max_pool_sizes[i]) {
                    const new_size = @min(
                        @as(u32, @intFromFloat(@as(f64, @floatFromInt(stats.current_size)) * self.config.growth_factor)),
                        self.config.max_pool_sizes[i]
                    );
                    try pool.resize(new_size);
                    self.pool_statistics.record_pool_expansion(i, new_size);
                }
                
                // Shrink pool if utilization is low
                if (stats.utilization < self.config.shrink_threshold and stats.current_size > self.config.initial_pool_sizes[i]) {
                    const new_size = @max(
                        @as(u32, @intFromFloat(@as(f64, @floatFromInt(stats.current_size)) * 0.8)),
                        self.config.initial_pool_sizes[i]
                    );
                    try pool.resize(new_size);
                    self.pool_statistics.record_pool_shrinkage(i, new_size);
                }
            }
        }
    }
    
    pub fn cleanup_pools(self: *FramePoolManager) void {
        const current_time = std.time.milliTimestamp();
        
        for (&self.frame_pools) |*pool_opt| {
            if (pool_opt.*) |*pool| {
                pool.cleanup_unused(current_time);
            }
        }
        
        self.pool_statistics.record_cleanup();
    }
    
    pub fn check_gc_pressure(self: *FramePoolManager) bool {
        if (!self.config.enable_gc_integration) return false;
        
        const memory_pressure = self.get_memory_pressure();
        return self.gc_trigger.should_trigger_gc(memory_pressure);
    }
    
    pub fn get_statistics(self: *const FramePoolManager) PoolStatistics {
        return self.pool_statistics;
    }
    
    fn initialize_pools(self: *FramePoolManager) !void {
        for (0..MAX_FRAME_SIZES) |i| {
            if (self.config.initial_pool_sizes[i] > 0) {
                self.frame_pools[i] = try FramePool.init(
                    self.allocator,
                    @intCast(i),
                    self.config.initial_pool_sizes[i],
                    self.config.max_pool_sizes[i]
                );
            }
        }
    }
    
    fn get_size_class(self: *FramePoolManager, frame_type: FrameType) usize {
        if (!self.config.enable_size_classes) return 0;
        
        return switch (frame_type) {
            .Regular => 0,
            .Call => 1,
            .DelegateCall => 2,
            .StaticCall => 3,
            .Create => 4,
            .Create2 => 5,
            .Precompile => 6,
            .System => 7,
        };
    }
    
    fn allocate_frame_direct(self: *FramePoolManager, frame_type: FrameType) !*PooledFrame {
        const frame = try self.allocator.create(PooledFrame);
        frame.* = PooledFrame.init(frame_type, self.allocator);
        self.allocation_tracker.record_direct_allocation(frame_type);
        return frame;
    }
    
    fn deallocate_frame_direct(self: *FramePoolManager, frame: *PooledFrame) void {
        frame.deinit();
        self.allocator.destroy(frame);
        self.allocation_tracker.record_direct_deallocation(frame.frame_type);
    }
    
    fn maybe_expand_pool(self: *FramePoolManager, size_class: usize) !void {
        if (self.frame_pools[size_class]) |*pool| {
            const stats = pool.get_statistics();
            if (stats.miss_rate > 0.2 and stats.current_size < self.config.max_pool_sizes[size_class]) {
                const new_size = @min(
                    stats.current_size + (stats.current_size / 4),  // Grow by 25%
                    self.config.max_pool_sizes[size_class]
                );
                try pool.resize(new_size);
            }
        }
    }
    
    fn get_memory_pressure(self: *FramePoolManager) f64 {
        var total_memory: usize = 0;
        var total_capacity: usize = 0;
        
        for (self.frame_pools) |pool_opt| {
            if (pool_opt) |pool| {
                const stats = pool.get_statistics();
                total_memory += stats.memory_usage;
                total_capacity += stats.memory_capacity;
            }
        }
        
        return if (total_capacity > 0)
            @as(f64, @floatFromInt(total_memory)) / @as(f64, @floatFromInt(total_capacity))
        else
            0.0;
    }
};
```

#### 2. Pooled Frame Implementation
```zig
pub const PooledFrame = struct {
    // Core frame data
    frame_type: FrameType,
    stack: Stack,
    memory: Memory,
    gas: Gas,
    contract: Contract,
    
    // Pool management
    allocator: std.mem.Allocator,
    pool_id: ?u32,
    allocation_time: i64,
    last_access_time: i64,
    usage_count: u64,
    
    // Frame hierarchy
    parent: ?*PooledFrame,
    children: std.ArrayList(*PooledFrame),
    depth: u32,
    
    // State management
    is_active: bool,
    is_pooled: bool,
    needs_cleanup: bool,
    
    pub const FrameType = enum {
        Regular,        // Regular execution frame
        Call,          // CALL instruction frame
        DelegateCall,  // DELEGATECALL instruction frame
        StaticCall,    // STATICCALL instruction frame
        Create,        // CREATE instruction frame
        Create2,       // CREATE2 instruction frame
        Precompile,    // Precompile execution frame
        System,        // System/internal frame
    };
    
    pub fn init(frame_type: FrameType, allocator: std.mem.Allocator) PooledFrame {
        return PooledFrame{
            .frame_type = frame_type,
            .stack = Stack.init(allocator),
            .memory = Memory.init(allocator),
            .gas = Gas.init(),
            .contract = Contract.empty(),
            .allocator = allocator,
            .pool_id = null,
            .allocation_time = std.time.milliTimestamp(),
            .last_access_time = std.time.milliTimestamp(),
            .usage_count = 0,
            .parent = null,
            .children = std.ArrayList(*PooledFrame).init(allocator),
            .depth = 0,
            .is_active = false,
            .is_pooled = false,
            .needs_cleanup = false,
        };
    }
    
    pub fn deinit(self: *PooledFrame) void {
        self.stack.deinit();
        self.memory.deinit();
        self.children.deinit();
    }
    
    pub fn initialize(self: *PooledFrame, frame_type: FrameType, parent: ?*PooledFrame) void {
        self.frame_type = frame_type;
        self.parent = parent;
        self.depth = if (parent) |p| p.depth + 1 else 0;
        self.is_active = true;
        self.last_access_time = std.time.milliTimestamp();
        self.usage_count += 1;
        
        // Initialize frame-specific data
        self.stack.clear();
        self.memory.clear();
        self.gas.reset();
        self.contract = Contract.empty();
    }
    
    pub fn reset(self: *PooledFrame) void {
        // Clear frame state for reuse
        self.stack.clear();
        self.memory.clear();
        self.gas.reset();
        self.contract = Contract.empty();
        
        // Clear hierarchy
        self.remove_all_children();
        self.parent = null;
        self.depth = 0;
        
        // Reset state
        self.is_active = false;
        self.needs_cleanup = false;
        self.last_access_time = std.time.milliTimestamp();
    }
    
    pub fn add_child(self: *PooledFrame, child: *PooledFrame) void {
        self.children.append(child) catch {
            // If we can't track the child, it's not a critical error
        };
        child.parent = self;
        child.depth = self.depth + 1;
    }
    
    pub fn remove_child(self: *PooledFrame, child: *PooledFrame) void {
        for (self.children.items, 0..) |c, i| {
            if (c == child) {
                _ = self.children.swapRemove(i);
                child.parent = null;
                break;
            }
        }
    }
    
    pub fn remove_all_children(self: *PooledFrame) void {
        for (self.children.items) |child| {
            child.parent = null;
        }
        self.children.clearRetainingCapacity();
    }
    
    pub fn get_memory_usage(self: *const PooledFrame) usize {
        return @sizeOf(PooledFrame) +
               self.stack.memory_usage() +
               self.memory.memory_usage() +
               self.children.capacity * @sizeOf(*PooledFrame);
    }
    
    pub fn is_eligible_for_pooling(self: *const PooledFrame) bool {
        // Frames are eligible for pooling if they're not too large or old
        const max_age = 60000; // 60 seconds
        const max_memory = 1024 * 1024; // 1MB
        
        const age = std.time.milliTimestamp() - self.allocation_time;
        const memory_usage = self.get_memory_usage();
        
        return age < max_age and memory_usage < max_memory and !self.needs_cleanup;
    }
    
    pub fn get_reuse_score(self: *const PooledFrame) f64 {
        // Calculate a score for frame reuse priority
        const age_factor = 1.0 / (1.0 + @as(f64, @floatFromInt(std.time.milliTimestamp() - self.last_access_time)) / 1000.0);
        const usage_factor = @min(@as(f64, @floatFromInt(self.usage_count)) / 100.0, 1.0);
        const memory_factor = 1.0 / (1.0 + @as(f64, @floatFromInt(self.get_memory_usage())) / 1024.0);
        
        return (age_factor + usage_factor + memory_factor) / 3.0;
    }
    
    pub fn can_be_parent_of(self: *const PooledFrame, frame_type: FrameType) bool {
        return switch (self.frame_type) {
            .Regular => true,  // Regular frames can parent any type
            .Call, .DelegateCall => frame_type != .Create and frame_type != .Create2,
            .StaticCall => frame_type == .StaticCall or frame_type == .Precompile,
            .Create, .Create2 => frame_type == .Regular,
            .Precompile => false,  // Precompiles don't parent other frames
            .System => true,   // System frames can parent any type
        };
    }
};
```

#### 3. Frame Pool Implementation
```zig
pub const FramePool = struct {
    allocator: std.mem.Allocator,
    size_class: u32,
    frames: std.ArrayList(*PooledFrame),
    available_frames: std.ArrayList(*PooledFrame),
    current_size: u32,
    max_size: u32,
    
    // Pool statistics
    total_acquisitions: u64,
    total_releases: u64,
    cache_hits: u64,
    cache_misses: u64,
    expansions: u64,
    shrinkages: u64,
    
    // Memory tracking
    total_memory_usage: usize,
    peak_memory_usage: usize,
    
    pub const PoolStatistics = struct {
        current_size: u32,
        available_count: u32,
        total_acquisitions: u64,
        total_releases: u64,
        cache_hits: u64,
        cache_misses: u64,
        hit_rate: f64,
        miss_rate: f64,
        utilization: f64,
        memory_usage: usize,
        memory_capacity: usize,
        
        pub fn calculate(pool: *const FramePool) PoolStatistics {
            const total_requests = pool.cache_hits + pool.cache_misses;
            const hit_rate = if (total_requests > 0)
                @as(f64, @floatFromInt(pool.cache_hits)) / @as(f64, @floatFromInt(total_requests))
            else
                0.0;
            
            const utilization = if (pool.current_size > 0)
                @as(f64, @floatFromInt(pool.current_size - @as(u32, @intCast(pool.available_frames.items.len)))) / @as(f64, @floatFromInt(pool.current_size))
            else
                0.0;
                
            return PoolStatistics{
                .current_size = pool.current_size,
                .available_count = @intCast(pool.available_frames.items.len),
                .total_acquisitions = pool.total_acquisitions,
                .total_releases = pool.total_releases,
                .cache_hits = pool.cache_hits,
                .cache_misses = pool.cache_misses,
                .hit_rate = hit_rate,
                .miss_rate = 1.0 - hit_rate,
                .utilization = utilization,
                .memory_usage = pool.total_memory_usage,
                .memory_capacity = pool.current_size * @sizeOf(PooledFrame),
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, size_class: u32, initial_size: u32, max_size: u32) !FramePool {
        var pool = FramePool{
            .allocator = allocator,
            .size_class = size_class,
            .frames = std.ArrayList(*PooledFrame).init(allocator),
            .available_frames = std.ArrayList(*PooledFrame).init(allocator),
            .current_size = 0,
            .max_size = max_size,
            .total_acquisitions = 0,
            .total_releases = 0,
            .cache_hits = 0,
            .cache_misses = 0,
            .expansions = 0,
            .shrinkages = 0,
            .total_memory_usage = 0,
            .peak_memory_usage = 0,
        };
        
        // Pre-allocate initial frames
        try pool.expand_to_size(initial_size);
        
        return pool;
    }
    
    pub fn deinit(self: *FramePool) void {
        // Clean up all frames
        for (self.frames.items) |frame| {
            frame.deinit();
            self.allocator.destroy(frame);
        }
        
        self.frames.deinit();
        self.available_frames.deinit();
    }
    
    pub fn acquire(self: *FramePool) ?*PooledFrame {
        self.total_acquisitions += 1;
        
        if (self.available_frames.items.len > 0) {
            // Get frame from pool
            const frame = self.available_frames.pop();
            frame.is_pooled = false;
            frame.pool_id = self.size_class;
            frame.last_access_time = std.time.milliTimestamp();
            
            self.cache_hits += 1;
            return frame;
        }
        
        self.cache_misses += 1;
        return null;
    }
    
    pub fn release(self: *FramePool, frame: *PooledFrame) bool {
        self.total_releases += 1;
        
        // Check if frame is eligible for pooling
        if (!frame.is_eligible_for_pooling()) {
            return false;
        }
        
        // Check if pool has space
        if (self.available_frames.items.len >= self.current_size) {
            return false; // Pool is full
        }
        
        // Reset frame and add to available list
        frame.reset();
        frame.is_pooled = true;
        frame.pool_id = self.size_class;
        
        self.available_frames.append(frame) catch {
            return false;
        };
        
        return true;
    }
    
    pub fn resize(self: *FramePool, new_size: u32) !void {
        const clamped_size = @min(new_size, self.max_size);
        
        if (clamped_size > self.current_size) {
            // Expand pool
            try self.expand_to_size(clamped_size);
            self.expansions += 1;
        } else if (clamped_size < self.current_size) {
            // Shrink pool
            try self.shrink_to_size(clamped_size);
            self.shrinkages += 1;
        }
    }
    
    pub fn cleanup_unused(self: *FramePool, current_time: i64) void {
        const max_idle_time = 30000; // 30 seconds
        var i: usize = 0;
        
        while (i < self.available_frames.items.len) {
            const frame = self.available_frames.items[i];
            const idle_time = current_time - frame.last_access_time;
            
            if (idle_time > max_idle_time and frame.usage_count < 5) {
                // Remove frame from available list and deallocate
                _ = self.available_frames.swapRemove(i);
                self.remove_frame(frame);
            } else {
                i += 1;
            }
        }
    }
    
    pub fn get_statistics(self: *const FramePool) PoolStatistics {
        return PoolStatistics.calculate(self);
    }
    
    fn expand_to_size(self: *FramePool, target_size: u32) !void {
        while (self.current_size < target_size) {
            const frame_type = self.get_frame_type_for_size_class();
            const frame = try self.allocator.create(PooledFrame);
            frame.* = PooledFrame.init(frame_type, self.allocator);
            frame.pool_id = self.size_class;
            frame.is_pooled = true;
            
            try self.frames.append(frame);
            try self.available_frames.append(frame);
            
            self.current_size += 1;
            self.total_memory_usage += frame.get_memory_usage();
            
            if (self.total_memory_usage > self.peak_memory_usage) {
                self.peak_memory_usage = self.total_memory_usage;
            }
        }
    }
    
    fn shrink_to_size(self: *FramePool, target_size: u32) !void {
        // Remove frames from the available list first
        while (self.current_size > target_size and self.available_frames.items.len > 0) {
            const frame = self.available_frames.pop();
            self.remove_frame(frame);
        }
        
        // If we still need to shrink, we have to wait for frames to be returned
        // This is handled in the cleanup process
    }
    
    fn remove_frame(self: *FramePool, frame: *PooledFrame) void {
        // Remove from main frames list
        for (self.frames.items, 0..) |f, i| {
            if (f == frame) {
                _ = self.frames.swapRemove(i);
                break;
            }
        }
        
        self.total_memory_usage -= frame.get_memory_usage();
        self.current_size -= 1;
        
        frame.deinit();
        self.allocator.destroy(frame);
    }
    
    fn get_frame_type_for_size_class(self: *FramePool) PooledFrame.FrameType {
        return switch (self.size_class) {
            0 => .Regular,
            1 => .Call,
            2 => .DelegateCall,
            3 => .StaticCall,
            4 => .Create,
            5 => .Create2,
            6 => .Precompile,
            7 => .System,
            else => .Regular,
        };
    }
};
```

#### 4. Pool Statistics and Monitoring
```zig
pub const PoolStatistics = struct {
    // Pool-level statistics
    pools_active: u32,
    total_pools_created: u64,
    
    // Frame statistics
    frames_allocated: u64,
    frames_deallocated: u64,
    frames_pooled: u64,
    frames_active: u64,
    
    // Cache performance
    pool_hits: [FramePoolManager.MAX_FRAME_SIZES]u64,
    pool_misses: [FramePoolManager.MAX_FRAME_SIZES]u64,
    pool_overflows: [FramePoolManager.MAX_FRAME_SIZES]u64,
    pool_returns: [FramePoolManager.MAX_FRAME_SIZES]u64,
    
    // Pool management
    pool_expansions: [FramePoolManager.MAX_FRAME_SIZES]u64,
    pool_shrinkages: [FramePoolManager.MAX_FRAME_SIZES]u64,
    cleanups_performed: u64,
    
    // Memory tracking
    total_memory_usage: usize,
    peak_memory_usage: usize,
    memory_savings: usize,
    
    // Timing
    start_time: i64,
    last_cleanup_time: i64,
    
    pub fn init() PoolStatistics {
        return PoolStatistics{
            .pools_active = 0,
            .total_pools_created = 0,
            .frames_allocated = 0,
            .frames_deallocated = 0,
            .frames_pooled = 0,
            .frames_active = 0,
            .pool_hits = std.mem.zeroes([FramePoolManager.MAX_FRAME_SIZES]u64),
            .pool_misses = std.mem.zeroes([FramePoolManager.MAX_FRAME_SIZES]u64),
            .pool_overflows = std.mem.zeroes([FramePoolManager.MAX_FRAME_SIZES]u64),
            .pool_returns = std.mem.zeroes([FramePoolManager.MAX_FRAME_SIZES]u64),
            .pool_expansions = std.mem.zeroes([FramePoolManager.MAX_FRAME_SIZES]u64),
            .pool_shrinkages = std.mem.zeroes([FramePoolManager.MAX_FRAME_SIZES]u64),
            .cleanups_performed = 0,
            .total_memory_usage = 0,
            .peak_memory_usage = 0,
            .memory_savings = 0,
            .start_time = std.time.milliTimestamp(),
            .last_cleanup_time = std.time.milliTimestamp(),
        };
    }
    
    pub fn record_pool_hit(self: *PoolStatistics, size_class: usize) void {
        if (size_class < FramePoolManager.MAX_FRAME_SIZES) {
            self.pool_hits[size_class] += 1;
        }
        self.frames_pooled += 1;
    }
    
    pub fn record_pool_miss(self: *PoolStatistics, size_class: usize) void {
        if (size_class < FramePoolManager.MAX_FRAME_SIZES) {
            self.pool_misses[size_class] += 1;
        }
        self.frames_allocated += 1;
    }
    
    pub fn record_pool_return(self: *PoolStatistics, size_class: usize) void {
        if (size_class < FramePoolManager.MAX_FRAME_SIZES) {
            self.pool_returns[size_class] += 1;
        }
    }
    
    pub fn record_pool_overflow(self: *PoolStatistics, size_class: usize) void {
        if (size_class < FramePoolManager.MAX_FRAME_SIZES) {
            self.pool_overflows[size_class] += 1;
        }
        self.frames_deallocated += 1;
    }
    
    pub fn record_pool_expansion(self: *PoolStatistics, size_class: usize, new_size: u32) void {
        if (size_class < FramePoolManager.MAX_FRAME_SIZES) {
            self.pool_expansions[size_class] += 1;
        }
        _ = new_size;
    }
    
    pub fn record_pool_shrinkage(self: *PoolStatistics, size_class: usize, new_size: u32) void {
        if (size_class < FramePoolManager.MAX_FRAME_SIZES) {
            self.pool_shrinkages[size_class] += 1;
        }
        _ = new_size;
    }
    
    pub fn record_cleanup(self: *PoolStatistics) void {
        self.cleanups_performed += 1;
        self.last_cleanup_time = std.time.milliTimestamp();
    }
    
    pub fn update_memory_usage(self: *PoolStatistics, current_usage: usize) void {
        self.total_memory_usage = current_usage;
        if (current_usage > self.peak_memory_usage) {
            self.peak_memory_usage = current_usage;
        }
    }
    
    pub fn calculate_memory_savings(self: *PoolStatistics, allocation_size: usize) void {
        self.memory_savings += allocation_size;
    }
    
    pub fn get_overall_hit_rate(self: *const PoolStatistics) f64 {
        var total_hits: u64 = 0;
        var total_requests: u64 = 0;
        
        for (0..FramePoolManager.MAX_FRAME_SIZES) |i| {
            total_hits += self.pool_hits[i];
            total_requests += self.pool_hits[i] + self.pool_misses[i];
        }
        
        return if (total_requests > 0)
            @as(f64, @floatFromInt(total_hits)) / @as(f64, @floatFromInt(total_requests))
        else
            0.0;
    }
    
    pub fn get_memory_efficiency(self: *const PoolStatistics) f64 {
        return if (self.peak_memory_usage > 0)
            @as(f64, @floatFromInt(self.memory_savings)) / @as(f64, @floatFromInt(self.peak_memory_usage))
        else
            0.0;
    }
    
    pub fn get_uptime_seconds(self: *const PoolStatistics) f64 {
        const now = std.time.milliTimestamp();
        return @as(f64, @floatFromInt(now - self.start_time)) / 1000.0;
    }
    
    pub fn print_summary(self: *const PoolStatistics) void {
        const hit_rate = self.get_overall_hit_rate() * 100.0;
        const memory_efficiency = self.get_memory_efficiency() * 100.0;
        const uptime = self.get_uptime_seconds();
        
        std.log.info("=== FRAME POOL STATISTICS ===");
        std.log.info("Active pools: {}", .{self.pools_active});
        std.log.info("Total pools created: {}", .{self.total_pools_created});
        std.log.info("Frames allocated: {}", .{self.frames_allocated});
        std.log.info("Frames pooled: {}", .{self.frames_pooled});
        std.log.info("Frames active: {}", .{self.frames_active});
        std.log.info("Overall hit rate: {d:.2}%", .{hit_rate});
        std.log.info("Memory usage: {} bytes (peak: {})", .{self.total_memory_usage, self.peak_memory_usage});
        std.log.info("Memory efficiency: {d:.2}%", .{memory_efficiency});
        std.log.info("Cleanups performed: {}", .{self.cleanups_performed});
        std.log.info("Uptime: {d:.2}s", .{uptime});
        
        std.log.info("Per-pool statistics:");
        for (0..FramePoolManager.MAX_FRAME_SIZES) |i| {
            const pool_total = self.pool_hits[i] + self.pool_misses[i];
            if (pool_total > 0) {
                const pool_hit_rate = @as(f64, @floatFromInt(self.pool_hits[i])) / @as(f64, @floatFromInt(pool_total)) * 100.0;
                std.log.info("  Pool {}: {} hits, {} misses ({d:.1}%)", .{i, self.pool_hits[i], self.pool_misses[i], pool_hit_rate});
            }
        }
    }
};
```

#### 5. Allocation Tracker
```zig
pub const AllocationTracker = struct {
    direct_allocations: std.HashMap(PooledFrame.FrameType, u64, FrameTypeContext, std.hash_map.default_max_load_percentage),
    direct_deallocations: std.HashMap(PooledFrame.FrameType, u64, FrameTypeContext, std.hash_map.default_max_load_percentage),
    pool_allocations: std.HashMap(PooledFrame.FrameType, u64, FrameTypeContext, std.hash_map.default_max_load_percentage),
    pool_deallocations: std.HashMap(PooledFrame.FrameType, u64, FrameTypeContext, std.hash_map.default_max_load_percentage),
    
    allocation_timeline: std.ArrayList(AllocationEvent),
    allocator: std.mem.Allocator,
    
    pub const AllocationEvent = struct {
        frame_type: PooledFrame.FrameType,
        event_type: EventType,
        timestamp: i64,
        
        pub const EventType = enum {
            DirectAllocation,
            DirectDeallocation,
            PoolAllocation,
            PoolDeallocation,
        };
    };
    
    pub const FrameTypeContext = struct {
        pub fn hash(self: @This(), key: PooledFrame.FrameType) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: PooledFrame.FrameType, b: PooledFrame.FrameType) bool {
            _ = self;
            return a == b;
        }
    };
    
    pub fn init() AllocationTracker {
        const allocator = std.heap.page_allocator;
        return AllocationTracker{
            .direct_allocations = std.HashMap(PooledFrame.FrameType, u64, FrameTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .direct_deallocations = std.HashMap(PooledFrame.FrameType, u64, FrameTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .pool_allocations = std.HashMap(PooledFrame.FrameType, u64, FrameTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .pool_deallocations = std.HashMap(PooledFrame.FrameType, u64, FrameTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .allocation_timeline = std.ArrayList(AllocationEvent).init(allocator),
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *AllocationTracker) void {
        self.direct_allocations.deinit();
        self.direct_deallocations.deinit();
        self.pool_allocations.deinit();
        self.pool_deallocations.deinit();
        self.allocation_timeline.deinit();
    }
    
    pub fn record_direct_allocation(self: *AllocationTracker, frame_type: PooledFrame.FrameType) void {
        self.increment_counter(&self.direct_allocations, frame_type);
        self.record_event(frame_type, .DirectAllocation);
    }
    
    pub fn record_direct_deallocation(self: *AllocationTracker, frame_type: PooledFrame.FrameType) void {
        self.increment_counter(&self.direct_deallocations, frame_type);
        self.record_event(frame_type, .DirectDeallocation);
    }
    
    pub fn record_pool_allocation(self: *AllocationTracker, frame_type: PooledFrame.FrameType) void {
        self.increment_counter(&self.pool_allocations, frame_type);
        self.record_event(frame_type, .PoolAllocation);
    }
    
    pub fn record_pool_deallocation(self: *AllocationTracker, frame_type: PooledFrame.FrameType) void {
        self.increment_counter(&self.pool_deallocations, frame_type);
        self.record_event(frame_type, .PoolDeallocation);
    }
    
    pub fn get_pool_efficiency(self: *AllocationTracker, frame_type: PooledFrame.FrameType) f64 {
        const pool_count = self.pool_allocations.get(frame_type) orelse 0;
        const direct_count = self.direct_allocations.get(frame_type) orelse 0;
        const total = pool_count + direct_count;
        
        return if (total > 0)
            @as(f64, @floatFromInt(pool_count)) / @as(f64, @floatFromInt(total))
        else
            0.0;
    }
    
    pub fn get_allocation_pattern(self: *AllocationTracker, window_size: usize) AllocationPattern {
        var pattern = AllocationPattern.init();
        
        const start_index = if (self.allocation_timeline.items.len > window_size)
            self.allocation_timeline.items.len - window_size
        else
            0;
        
        for (self.allocation_timeline.items[start_index..]) |event| {
            pattern.add_event(event);
        }
        
        return pattern;
    }
    
    fn increment_counter(self: *AllocationTracker, map: *std.HashMap(PooledFrame.FrameType, u64, FrameTypeContext, std.hash_map.default_max_load_percentage), frame_type: PooledFrame.FrameType) void {
        const current = map.get(frame_type) orelse 0;
        map.put(frame_type, current + 1) catch {};
    }
    
    fn record_event(self: *AllocationTracker, frame_type: PooledFrame.FrameType, event_type: AllocationEvent.EventType) void {
        const event = AllocationEvent{
            .frame_type = frame_type,
            .event_type = event_type,
            .timestamp = std.time.milliTimestamp(),
        };
        
        self.allocation_timeline.append(event) catch {};
        
        // Limit timeline size
        if (self.allocation_timeline.items.len > 10000) {
            _ = self.allocation_timeline.orderedRemove(0);
        }
    }
};

pub const AllocationPattern = struct {
    frame_type_counts: std.HashMap(PooledFrame.FrameType, u32, AllocationTracker.FrameTypeContext, std.hash_map.default_max_load_percentage),
    event_type_counts: std.HashMap(AllocationTracker.AllocationEvent.EventType, u32, EventTypeContext, std.hash_map.default_max_load_percentage),
    total_events: u32,
    allocator: std.mem.Allocator,
    
    pub const EventTypeContext = struct {
        pub fn hash(self: @This(), key: AllocationTracker.AllocationEvent.EventType) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: AllocationTracker.AllocationEvent.EventType, b: AllocationTracker.AllocationEvent.EventType) bool {
            _ = self;
            return a == b;
        }
    };
    
    pub fn init() AllocationPattern {
        const allocator = std.heap.page_allocator;
        return AllocationPattern{
            .frame_type_counts = std.HashMap(PooledFrame.FrameType, u32, AllocationTracker.FrameTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .event_type_counts = std.HashMap(AllocationTracker.AllocationEvent.EventType, u32, EventTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .total_events = 0,
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *AllocationPattern) void {
        self.frame_type_counts.deinit();
        self.event_type_counts.deinit();
    }
    
    pub fn add_event(self: *AllocationPattern, event: AllocationTracker.AllocationEvent) void {
        // Count by frame type
        const frame_count = self.frame_type_counts.get(event.frame_type) orelse 0;
        self.frame_type_counts.put(event.frame_type, frame_count + 1) catch {};
        
        // Count by event type
        const event_count = self.event_type_counts.get(event.event_type) orelse 0;
        self.event_type_counts.put(event.event_type, event_count + 1) catch {};
        
        self.total_events += 1;
    }
    
    pub fn get_dominant_frame_type(self: *AllocationPattern) ?PooledFrame.FrameType {
        var max_count: u32 = 0;
        var dominant_type: ?PooledFrame.FrameType = null;
        
        var iterator = self.frame_type_counts.iterator();
        while (iterator.next()) |entry| {
            if (entry.value_ptr.* > max_count) {
                max_count = entry.value_ptr.*;
                dominant_type = entry.key_ptr.*;
            }
        }
        
        return dominant_type;
    }
    
    pub fn get_pool_usage_ratio(self: *AllocationPattern) f64 {
        const pool_allocs = self.event_type_counts.get(.PoolAllocation) orelse 0;
        const direct_allocs = self.event_type_counts.get(.DirectAllocation) orelse 0;
        const total_allocs = pool_allocs + direct_allocs;
        
        return if (total_allocs > 0)
            @as(f64, @floatFromInt(pool_allocs)) / @as(f64, @floatFromInt(total_allocs))
        else
            0.0;
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Efficient Pool Management**: Multiple size classes for different frame types
2. **Automatic Pool Tuning**: Dynamic sizing based on usage patterns
3. **Memory Pressure Management**: Integration with garbage collection triggers
4. **Frame Hierarchy Tracking**: Parent-child relationships between frames
5. **Performance Monitoring**: Comprehensive statistics and metrics
6. **Resource Cleanup**: Automatic cleanup of unused frames

## Implementation Tasks

### Task 1: Implement Garbage Collection Trigger
File: `/src/evm/frame_pool/gc_trigger.zig`
```zig
const std = @import("std");

pub const GarbageCollectionTrigger = struct {
    pressure_threshold: f64,
    last_gc_time: i64,
    gc_interval: i64,
    force_gc_threshold: f64,
    
    pub fn init(pressure_threshold: f64) GarbageCollectionTrigger {
        return GarbageCollectionTrigger{
            .pressure_threshold = pressure_threshold,
            .last_gc_time = std.time.milliTimestamp(),
            .gc_interval = 30000,  // 30 seconds
            .force_gc_threshold = 0.95,
        };
    }
    
    pub fn should_trigger_gc(self: *GarbageCollectionTrigger, memory_pressure: f64) bool {
        const current_time = std.time.milliTimestamp();
        const time_since_gc = current_time - self.last_gc_time;
        
        // Force GC if pressure is very high
        if (memory_pressure > self.force_gc_threshold) {
            self.last_gc_time = current_time;
            return true;
        }
        
        // Trigger GC if pressure is above threshold and enough time has passed
        if (memory_pressure > self.pressure_threshold and time_since_gc > self.gc_interval) {
            self.last_gc_time = current_time;
            return true;
        }
        
        return false;
    }
    
    pub fn record_gc_completion(self: *GarbageCollectionTrigger) void {
        self.last_gc_time = std.time.milliTimestamp();
    }
};
```

### Task 2: Integrate with VM Execution
File: `/src/evm/vm.zig` (modify existing)
```zig
const FramePoolManager = @import("frame_pool/frame_pool_manager.zig").FramePoolManager;
const PooledFrame = @import("frame_pool/pooled_frame.zig").PooledFrame;

pub const Vm = struct {
    // Existing fields...
    frame_pool_manager: ?FramePoolManager,
    current_frame: ?*PooledFrame,
    frame_pool_enabled: bool,
    
    pub fn enable_frame_pooling(self: *Vm, config: FramePoolManager.PoolConfig) !void {
        self.frame_pool_manager = try FramePoolManager.init(self.allocator, config);
        self.frame_pool_enabled = true;
    }
    
    pub fn disable_frame_pooling(self: *Vm) void {
        if (self.frame_pool_manager) |*manager| {
            manager.deinit();
            self.frame_pool_manager = null;
        }
        self.frame_pool_enabled = false;
        self.current_frame = null;
    }
    
    pub fn create_execution_frame(self: *Vm, frame_type: PooledFrame.FrameType) !*PooledFrame {
        if (self.frame_pool_manager) |*manager| {
            const frame = try manager.get_or_create_frame(frame_type, self.current_frame);
            
            // Check for GC pressure
            if (manager.check_gc_pressure()) {
                self.trigger_frame_gc();
            }
            
            return frame;
        }
        
        // Fallback to direct allocation
        const frame = try self.allocator.create(PooledFrame);
        frame.* = PooledFrame.init(frame_type, self.allocator);
        return frame;
    }
    
    pub fn release_execution_frame(self: *Vm, frame: *PooledFrame) void {
        if (self.frame_pool_manager) |*manager| {
            // Remove from parent's children list
            if (frame.parent) |parent| {
                parent.remove_child(frame);
            }
            
            // Release all children first
            for (frame.children.items) |child| {
                self.release_execution_frame(child);
            }
            
            manager.release_frame(frame);
        } else {
            frame.deinit();
            self.allocator.destroy(frame);
        }
    }
    
    pub fn optimize_frame_pools(self: *Vm) !void {
        if (self.frame_pool_manager) |*manager| {
            try manager.auto_tune_pools();
        }
    }
    
    pub fn cleanup_frame_pools(self: *Vm) void {
        if (self.frame_pool_manager) |*manager| {
            manager.cleanup_pools();
        }
    }
    
    pub fn get_frame_pool_statistics(self: *Vm) ?FramePoolManager.PoolStatistics {
        if (self.frame_pool_manager) |*manager| {
            return manager.get_statistics();
        }
        return null;
    }
    
    fn trigger_frame_gc(self: *Vm) void {
        // Trigger garbage collection for frame pools
        if (self.frame_pool_manager) |*manager| {
            manager.cleanup_pools();
        }
    }
};
```

### Task 3: Optimize Call Operations
File: `/src/evm/execution/system.zig` (modify existing)
```zig
pub fn execute_call(frame: *Frame, vm: *Vm) !void {
    // Get call parameters from stack
    const gas = frame.stack.pop_unsafe();
    const to_address = frame.stack.pop_unsafe();
    const value = frame.stack.pop_unsafe();
    const args_offset = frame.stack.pop_unsafe();
    const args_size = frame.stack.pop_unsafe();
    const ret_offset = frame.stack.pop_unsafe();
    const ret_size = frame.stack.pop_unsafe();
    
    // Create call frame using pool
    const call_frame = try vm.create_execution_frame(.Call);
    defer vm.release_execution_frame(call_frame);
    
    // Initialize call frame
    call_frame.initialize(.Call, frame);
    call_frame.gas.set_limit(gas.to_u64());
    
    // Set up call context
    try setup_call_context(call_frame, to_address, value, args_offset, args_size);
    
    // Execute call
    const result = try vm.execute_frame(call_frame);
    
    // Handle return data
    try handle_call_return(frame, call_frame, ret_offset, ret_size, result);
    
    // Push result to stack
    frame.stack.push_unsafe(if (result.is_success()) U256.one() else U256.zero());
}

pub fn execute_create(frame: *Frame, vm: *Vm) !void {
    // Get create parameters from stack
    const value = frame.stack.pop_unsafe();
    const offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();
    
    // Create deployment frame using pool
    const create_frame = try vm.create_execution_frame(.Create);
    defer vm.release_execution_frame(create_frame);
    
    // Initialize create frame
    create_frame.initialize(.Create, frame);
    create_frame.gas.set_limit(frame.gas.remaining() * 63 / 64);  // EIP-150
    
    // Set up creation context
    try setup_create_context(create_frame, value, offset, size);
    
    // Execute contract creation
    const result = try vm.execute_frame(create_frame);
    
    // Push created address or zero on failure
    const created_address = if (result.is_success()) result.created_address else Address.zero();
    frame.stack.push_unsafe(created_address.to_u256());
}
```

## Testing Requirements

### Test File
Create `/test/evm/frame_pool/frame_pool_test.zig`

### Test Cases
```zig
test "frame pool manager initialization and configuration" {
    // Test pool manager creation with different configs
    // Test pool initialization and sizing
    // Test configuration validation
}

test "frame acquisition and release" {
    // Test frame acquisition from pools
    // Test frame release back to pools
    // Test pool hit/miss scenarios
}

test "frame hierarchy management" {
    // Test parent-child frame relationships
    // Test frame cleanup with hierarchy
    // Test deep call stack scenarios
}

test "automatic pool tuning" {
    // Test pool expansion based on demand
    // Test pool shrinkage for unused capacity
    // Test auto-tuning algorithms
}

test "memory pressure and garbage collection" {
    // Test GC trigger conditions
    // Test memory pressure calculation
    // Test cleanup effectiveness
}

test "performance benchmarks" {
    // Benchmark pooled vs direct allocation
    // Test memory usage efficiency
    // Measure allocation/deallocation overhead
}

test "integration with VM execution" {
    // Test VM integration
    // Test execution correctness with pooling
    // Test performance impact on real workloads
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/frame_pool/frame_pool_manager.zig` - Main frame pool management system
- `/src/evm/frame_pool/pooled_frame.zig` - Pooled frame implementation
- `/src/evm/frame_pool/frame_pool.zig` - Individual frame pool implementation
- `/src/evm/frame_pool/pool_statistics.zig` - Performance monitoring and statistics
- `/src/evm/frame_pool/allocation_tracker.zig` - Allocation pattern tracking
- `/src/evm/frame_pool/gc_trigger.zig` - Garbage collection trigger logic
- `/src/evm/execution/system.zig` - Integration with call/create operations
- `/src/evm/vm.zig` - VM integration with frame pooling
- `/test/evm/frame_pool/frame_pool_test.zig` - Comprehensive tests

## Success Criteria

1. **Reduced Allocation Overhead**: 60%+ reduction in frame allocation time
2. **Memory Efficiency**: 30%+ reduction in peak memory usage
3. **High Pool Hit Rate**: 85%+ hit rate for frame acquisition
4. **Automatic Optimization**: Self-tuning pools based on usage patterns
5. **Low Management Overhead**: <3% overhead for pool management
6. **Integration**: Seamless integration with existing execution flow

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Memory safety** - No memory leaks or corruption in pooled frames
3. **Execution correctness** - Pooling must not affect program behavior
4. **Resource cleanup** - Proper cleanup of frame hierarchies
5. **Performance validation** - Must demonstrate measurable improvements
6. **Thread safety** - Concurrent frame operations must be safe

## References

- [Object Pooling](https://en.wikipedia.org/wiki/Object_pool_pattern) - Object pool design patterns
- [Memory Pool](https://en.wikipedia.org/wiki/Memory_pool) - Memory pool allocation techniques
- [Garbage Collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) - Automatic memory management
- [Call Stack](https://en.wikipedia.org/wiki/Call_stack) - Execution stack management
- [Memory Management](https://en.wikipedia.org/wiki/Memory_management) - Efficient memory allocation strategies