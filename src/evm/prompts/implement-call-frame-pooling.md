# Implement Call Frame Pooling

You are implementing Call Frame Pooling for the Tevm EVM written in Zig. Your goal is to implement memory-efficient call frame pooling system following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_call_frame_pooling` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_call_frame_pooling feat_implement_call_frame_pooling`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement comprehensive call frame pooling to efficiently manage frame allocation and deallocation during EVM execution. This includes pooled frame allocation, stack management, memory reuse optimization, and automated pool sizing based on execution patterns to minimize garbage collection pressure and improve execution performance.

## ELI5

Think of call frame pooling like a smart office building that reuses conference rooms efficiently. Instead of building a new conference room every time someone needs a meeting and then tearing it down afterward, you have a pool of pre-built rooms that can be quickly configured and reused.

In the EVM:
- **Call Frames**: Like conference rooms for contract execution - each contract call needs its own "workspace"
- **Traditional Approach**: Build a new workspace for every call, tear it down when done (expensive and slow)
- **Pooling Approach**: Keep a collection of ready-to-use workspaces that can be quickly assigned and cleaned for reuse

The benefits:
- **Faster Execution**: No time wasted setting up and tearing down workspaces
- **Less Memory Pressure**: Reusing memory instead of constantly allocating and deallocating
- **Better Performance**: Reduced garbage collection because we're not creating and destroying objects constantly
- **Predictable Costs**: More consistent performance because allocation costs are amortized

The enhanced version includes:
- **Smart Sizing**: Automatically adjusts the pool size based on usage patterns (like having more conference rooms during busy periods)
- **Memory Optimization**: Efficiently manages memory within pooled frames
- **Stack Management**: Proper handling of execution contexts and call stacks
- **Performance Monitoring**: Tracks pool efficiency and adjusts accordingly

Real-world analogy: It's like the difference between a hotel that builds new rooms for each guest vs. one that maintains and reuses existing rooms - the latter is much more efficient and provides better service.

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

#### 1. **Unit Tests** (`/test/evm/frame/call_frame_pooling_test.zig`)
```zig
// Test basic call frame pooling functionality
test "call_frame_pooling basic functionality works correctly"
test "call_frame_pooling handles edge cases properly"
test "call_frame_pooling validates inputs appropriately"
test "call_frame_pooling produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "call_frame_pooling integrates with EVM properly"
test "call_frame_pooling maintains system compatibility"
test "call_frame_pooling works with existing components"
test "call_frame_pooling handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "call_frame_pooling meets performance requirements"
test "call_frame_pooling optimizes resource usage"
test "call_frame_pooling scales appropriately with load"
test "call_frame_pooling benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "call_frame_pooling meets specification requirements"
test "call_frame_pooling maintains EVM compatibility"
test "call_frame_pooling handles hardfork transitions"
test "call_frame_pooling cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "call_frame_pooling handles errors gracefully"
test "call_frame_pooling proper error propagation"
test "call_frame_pooling recovery from failure states"
test "call_frame_pooling validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "call_frame_pooling prevents security vulnerabilities"
test "call_frame_pooling handles malicious inputs safely"
test "call_frame_pooling maintains isolation boundaries"
test "call_frame_pooling validates security properties"
```

### Test Development Priority
1. **Core functionality** - Basic feature operation
2. **Specification compliance** - Meet requirements
3. **Integration** - System-level correctness
4. **Performance** - Efficiency targets
5. **Error handling** - Robust failures
6. **Security** - Vulnerability prevention

### Test Data Sources
- **Specification documents**: Official requirements and test vectors
- **Reference implementations**: Cross-client compatibility
- **Performance baselines**: Optimization targets
- **Real-world data**: Production scenarios
- **Synthetic cases**: Edge conditions and stress testing

### Continuous Testing
- Run `zig build test-all` after every change
- Maintain 100% test coverage for public APIs
- Validate performance regression prevention
- Test both debug and release builds
- Verify cross-platform behavior

### Test-First Examples

**Before implementation:**
```zig
test "call_frame_pooling basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = call_frame_pooling.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const call_frame_pooling = struct {
    pub fn process(input: InputType) !OutputType {
        return error.NotImplemented; // Initially
    }
};
```

### Critical Requirements
- **Never commit without passing tests**
- **Test all configuration paths**
- **Verify specification compliance**
- **Validate performance implications**
- **Ensure cross-platform compatibility**

## References

- [Object Pooling](https://en.wikipedia.org/wiki/Object_pool_pattern) - Object pool design patterns
- [Memory Pool](https://en.wikipedia.org/wiki/Memory_pool) - Memory pool allocation techniques
- [Garbage Collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) - Automatic memory management
- [Call Stack](https://en.wikipedia.org/wiki/Call_stack) - Execution stack management
- [Memory Management](https://en.wikipedia.org/wiki/Memory_management) - Efficient memory allocation strategies

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <evmc/evmc.hpp>
#include <intx/intx.hpp>
#include <exception>
#include <memory>
#include <string>
#include <vector>

namespace evmone
{
// ... (forward declarations)

using evmc::bytes;
using evmc::bytes_view;
using intx::uint256;


/// Provides memory for EVM stack.
class StackSpace
{
    // ...
public:
    /// The maximum number of EVM stack items.
    static constexpr auto limit = 1024;

    StackSpace() noexcept : m_stack_space{allocate()} {}

    /// Returns the pointer to the "bottom", i.e. below the stack space.
    [[nodiscard]] uint256* bottom() noexcept { return m_stack_space.get(); }
};


/// The EVM memory.
class Memory
{
    // ...
public:
    /// Creates Memory object with initial capacity allocation.
    Memory() noexcept { allocate_capacity(); }
    // ...
    /// Virtually clears the memory by setting its size to 0. The capacity stays unchanged.
    void clear() noexcept { m_size = 0; }
};

// ... (TransactionInitcode struct)

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
    // ... (analysis union)

    std::vector<const uint8_t*> call_stack;

    /// Stack space allocation.
    StackSpace stack_space;

    ExecutionState() noexcept = default;

    ExecutionState(const evmc_message& message, evmc_revision revision,
        const evmc_host_interface& host_interface, evmc_host_context* host_ctx,
        bytes_view _code) noexcept
      : msg{&message}, host{host_interface, host_ctx}, rev{revision}, original_code{_code}
    {}

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
        deploy_container = {};
        m_tx = {};
        m_initcodes.reset();
        call_stack = {};
    }
    // ...
};
}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/vm.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2021 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "execution_state.hpp"
#include "tracing.hpp"
#include <evmc/evmc.h>
#include <vector>

// ...

namespace evmone
{
/// The evmone EVMC instance.
class VM : public evmc_vm
{
public:
    // ...

private:
    std::vector<ExecutionState> m_execution_states;
    std::unique_ptr<Tracer> m_first_tracer;

public:
    VM() noexcept;

    [[nodiscard]] ExecutionState& get_execution_state(size_t depth) noexcept;

    // ... (tracer methods)
};
}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/vm.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2018 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "vm.hpp"
// ...
#include <cassert>
#include <iostream>

namespace evmone
{
// ... (destroy, get_capabilities, set_option)

VM::VM() noexcept
  : evmc_vm{
        EVMC_ABI_VERSION,
        "evmone",
        PROJECT_VERSION,
        evmone::destroy,
        evmone::baseline::execute,
        evmone::get_capabilities,
        evmone::set_option,
    }
{
    m_execution_states.reserve(1025);
}

ExecutionState& VM::get_execution_state(size_t depth) noexcept
{
    // Vector already has the capacity for all possible depths,
    // so reallocation never happens (therefore: noexcept).
    // The ExecutionStates are lazily created because they pre-allocate EVM memory and stack.
    assert(depth < m_execution_states.capacity());
    if (m_execution_states.size() <= depth)
        m_execution_states.resize(depth + 1);
    return m_execution_states[depth];
}

}  // namespace evmone

// ...
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_calls.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "delegation.hpp"
#include "eof.hpp"
#include "instructions.hpp"
#include <variant>

// ... (constants)

namespace evmone::instr::core
{
// ... (get_target_address, to_call_kind)

template <Opcode Op>
Result call_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    static_assert(
        Op == OP_CALL || Op == OP_CALLCODE || Op == OP_DELEGATECALL || Op == OP_STATICCALL);

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

    // ... (gas checks and memory checks)

    const auto input_offset = static_cast<size_t>(input_offset_u256);
    const auto input_size = static_cast<size_t>(input_size_u256);
    const auto output_offset = static_cast<size_t>(output_offset_u256);
    const auto output_size = static_cast<size_t>(output_size_u256);

    evmc_message msg{.kind = to_call_kind(Op)};
    msg.flags = (Op == OP_STATICCALL) ? uint32_t{EVMC_STATIC} : state.msg->flags;
    // ... (message setup)

    // ... (cost calculation)
    
    // ... (gas calculation)
    
    // ... (pre-call checks like depth and balance)
    
    const auto result = state.host.call(msg);
    state.return_data.assign(result.output_data, result.output_size);
    stack.top() = result.status_code == EVMC_SUCCESS;

    if (const auto copy_size = std::min(output_size, result.output_size); copy_size > 0)
        std::memcpy(&state.memory[output_offset], result.output_data, copy_size);

    const auto gas_used = msg.gas - result.gas_left;
    gas_left -= gas_used;
    state.gas_refund += result.gas_refund;
    return {EVMC_SUCCESS, gas_left};
}

// ... (template instantiations and other call/create implementations)
}  // namespace evmone::instr::core
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/lru_cache.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2024 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <cassert>
#include <list>
#include <optional>
#include <unordered_map>

namespace evmone
{
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
        // ... (implementation detail)
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
            // ... (eviction logic)
            auto lru_it = lru_list_.begin();

            auto node = map_.extract(lru_it->key);
            // ... (rest of eviction logic)
        }
        else
        {
            if (const auto [it, inserted] = map_.try_emplace(std::move(key)); !inserted)
            {
                // ... (update existing)
            }
            else
            {
                // ... (insert new)
                it->second =
                    lru_list_.emplace(lru_list_.end(), LRUEntry{it->first, std::move(value)});
            }
        }
    }
};

}  // namespace evmone
```
</file>
</evmone>



## REVM Context

An analysis of the `revm` codebase reveals a sophisticated approach to managing execution contexts, which offers valuable patterns for implementing call frame pooling. Instead of a traditional object pool for entire frames, `revm` achieves high performance through a shared, resizable memory buffer (`SharedMemory`) and a journaling system (`Journal`) to manage state changes within nested calls.

When a sub-call is made, a new "context" is created on top of the shared memory buffer by simply moving a checkpoint pointer. This avoids new heap allocations for memory. Upon return, the checkpoint is moved back, effectively freeing the memory used by the sub-call. This "arena-like" memory management is a core concept that aligns with the goals of call frame pooling.

The `Interpreter` in `revm` can be seen as the equivalent of the proposed `PooledFrame`, as it encapsulates the stack, memory, program counter, and other execution-related states for a single call context. The `handler` crate then manages a stack of these `Interpreter` frames.

The following snippets from `revm` provide a robust reference for implementing an efficient frame management system.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/shared_memory.rs">
```rust
//! This file contains the `SharedMemory` struct, which is a key component for efficient memory
//! management in `revm`. It's a sequential memory buffer shared between calls.

use core::{cell::RefCell, ops::Range};
use std::rc::Rc;

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
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs">
```rust
//! This file defines the `Interpreter` struct, which is the core execution unit. It is analogous
//! to the proposed `PooledFrame`.

use crate::{
    host::DummyHost, instruction_context::InstructionContext, interpreter_types::*, CallInput, Gas,
    Host, InstructionResult, InstructionTable, InterpreterAction,
};
use bytecode::Bytecode;
use primitives::{hardfork::SpecId, Address, Bytes, U256};

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

// ... implementation details ...

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

impl<IW: InterpreterTypes> Interpreter<IW> {
    /// Resets the control to the initial state. so that we can run the interpreter again.
    #[inline]
    pub fn reset_control(&mut self) {
        self.control
            .set_next_action(InterpreterAction::None, InstructionResult::Continue);
    }

    /// Takes the next action from the control and returns it.
    #[inline]
    pub fn take_next_action(&mut self) -> InterpreterAction {
        // ...
    }

    /// Executes the instruction at the current instruction pointer.
    #[inline]
    pub fn step<H: ?Sized>(&mut self, instruction_table: &InstructionTable<IW, H>, host: &mut H) {
        // ...
    }

    /// Executes the interpreter until it returns or stops.
    #[inline]
    pub fn run_plain<H: ?Sized>(
        &mut self,
        instruction_table: &InstructionTable<IW, H>,
        host: &mut H,
    ) -> InterpreterAction {
        self.reset_control();

        while self.control.instruction_result().is_continue() {
            let context = InstructionContext {
                interpreter: self,
                host,
            };
            context.step(instruction_table);
        }

        self.take_next_action()
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/frame.rs">
```rust
//! This file shows how `revm` structures a `Frame` and manages the call stack. The `run_exec_loop`
//! from `handler.rs` is the best reference for managing a stack of frames.

use crate::{
    instructions::InstructionProvider, precompile_provider::PrecompileProvider, EvmTr,
    FrameInitOrResult, FrameOrResult, ItemOrResult,
};
use interpreter::{
    CallInputs, CallOutcome, CreateInputs, CreateOutcome, FrameInput, Gas, InstructionResult,
    Interpreter, InterpreterAction, InterpreterResult, SharedMemory,
};
use primitives::{Bytes, U256};
use std::boxed::Box;

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
    // ...
    pub interpreter: Interpreter<IW>,
    // ...
}

impl<EVM, ERROR> Frame for EthFrame<EVM, ERROR, EthInterpreter>
where
    /* ... */
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

    fn run(&mut self, context: &mut Self::Evm) -> Result<FrameInitOrResult<Self>, Self::Error> {
        let next_action = context.run_interpreter(&mut self.interpreter);
        self.process_next_action(context, next_action)
    }

    fn return_result(
        &mut self,
        context: &mut Self::Evm,
        result: Self::FrameResult,
    ) -> Result<(), Self::Error> {
        self.return_result(context, result)
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/handler.rs">
```rust
//! The `run_exec_loop` function from the `Handler` trait demonstrates how to manage a stack of frames.
//! This is the core logic for handling nested calls and their results.

// ... imports ...

impl<EVM, ERROR, FRAME> Handler for MainnetHandler<EVM, ERROR, FRAME>
where
    /* ... */
{
    // ...
    #[inline]
    fn run_exec_loop(
        &mut self,
        evm: &mut Self::Evm,
        frame: Self::Frame,
    ) -> Result<FrameResult, Self::Error> {
        let mut frame_stack: Vec<Self::Frame> = vec



## EXECUTION-SPECS Context

An excellent and detailed prompt. The call frame is a critical component of the EVM, and managing its allocation efficiently is a significant performance optimization.

The provided `execution-specs` codebase uses a combination of an `Evm` object and a `Message` object to represent what the prompt calls a "Call Frame". A new `Evm` object is instantiated for each new message call (e.g., `CALL`, `CREATE`). The pooling mechanism would intercept this instantiation to reuse objects.

Here are the most relevant code snippets from the `execution-specs` to guide this implementation.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/__init__.py">
```python
# src/ethereum/cancun/vm/__init__.py

# ... (other imports)

@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    # ... (other fields)
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


def incorporate_child_on_success(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of a successful `child_evm` into the parent `evm`.
    """
    evm.gas_left += child_evm.gas_left
    evm.logs += child_evm.logs
    evm.refund_counter += child_evm.refund_counter
    evm.accounts_to_delete.update(child_evm.accounts_to_delete)
    evm.accessed_addresses.update(child_evm.accessed_addresses)
    evm.accessed_storage_keys.update(child_evm.accessed_storage_keys)


def incorporate_child_on_error(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of an unsuccessful `child_evm` into the parent `evm`.
    """
    evm.gas_left += child_evm.gas_left
```
**Relevance**: These dataclasses (`Message` and `Evm`) represent the state of a single "Call Frame". Your `PooledFrame` will need to manage and reset these fields. The `incorporate_child_*` functions show how results from a child frame are merged back into the parent, which is relevant for managing the frame hierarchy.

</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
```python
# src/ethereum/cancun/vm/interpreter.py

# ... (other imports)

def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.
    """
    # ...
    if message.target == Bytes0(b""):
        # ... (address collision check)
        evm = process_create_message(message)
    else:
        evm = process_message(message)
    # ...

    # ... (process results)
    return MessageCallOutput(
        gas_left=evm.gas_left,
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
    begin_transaction(state, message.tx_env.transient_storage)

    # ... (move ether)

    evm = execute_code(message)
    if evm.error:
        # revert state to the last saved checkpoint
        # since the message call resulted in an error
        rollback_transaction(state, message.tx_env.transient_storage)
    else:
        commit_transaction(state, message.tx_env.transient_storage)
    return evm

def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
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
    # ... (main execution loop)
    return evm
```
**Relevance**: This file contains the core execution loop. The `execute_code` function is where a new `Evm` object (your `PooledFrame`) is created. This is the primary location for inserting the `acquire_frame` logic. The `process_message` function shows the lifecycle, including the crucial state snapshotting (`begin_transaction`) and finalization (`commit`/`rollback`), which must be handled when releasing a frame back to the pool.

</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/system.py">
```python
# src/ethereum/cancun/vm/instructions/system.py

# ... (other imports)

def generic_create(
    evm: Evm,
    endowment: U256,
    contract_address: Address,
    memory_start_position: U256,
    memory_size: U256,
) -> None:
    # ...
    # This import causes a circular import error
    # if it's not moved inside this method
    from ...vm.interpreter import STACK_DEPTH_LIMIT, process_create_message

    # ...

    child_message = Message(
        # ...
    )
    child_evm = process_create_message(child_message)

    if child_evm.error:
        incorporate_child_on_error(evm, child_evm)
        # ...
    else:
        incorporate_child_on_success(evm, child_evm)
        # ...


def generic_call(
    evm: Evm,
    gas: Uint,
    # ...
) -> None:
    # ...
    from ...vm.interpreter import STACK_DEPTH_LIMIT, process_message

    # ... (prepare call)

    child_message = Message(
        # ...
    )
    child_evm = process_message(child_message)

    if child_evm.error:
        incorporate_child_on_error(evm, child_evm)
        # ...
    else:
        incorporate_child_on_success(evm, child_evm)
        # ...
```
**Relevance**: The `generic_create` and `generic_call` functions are invoked by opcodes like `CREATE` and `CALL`. They are responsible for creating a `Message` for a sub-call and then executing it via `process_create_message` or `process_message`. This is where you would use the `FramePoolManager` to `get_or_create_frame` for the child call.

</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/state.py">
```python
# src/ethereum/cancun/state.py

# ... (other imports)

@dataclass
class State:
    # ...
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
    Rollback a state transaction, resetting the state to the point when the
    corresponding `start_transaction()` call was made.
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    # ...
```
**Relevance**: This demonstrates the state snapshotting mechanism. When a call frame is released to the pool, any uncommitted state changes must be reverted. This is typically done by rolling back the state to the snapshot taken at the beginning of the call. Your `release_frame` implementation must ensure this happens to guarantee that a reused frame is in a clean state.

</file>
</execution-specs>

## Prompt Corrections
The provided prompt is exceptionally well-structured and detailed, essentially providing a complete design document for the feature. There are no major corrections needed, but a few points of clarification based on the `execution-specs` codebase might be helpful:

1.  **Frame Object:** In the `execution-specs`, the concept of a "call frame" is not a single object. It's a combination of the `Evm` dataclass (which holds the PC, stack, memory, gas) and the `Message` dataclass (which holds the caller, target, value, data). Your `PooledFrame` struct is a good abstraction that combines these two concepts into a single manageable unit.
2.  **State Management:** The `PooledFrame.reset()` function in your prompt should be implemented carefully. It's not just about clearing lists and resetting values. As seen in `interpreter.py`, every message call is wrapped in a state transaction (`begin_transaction`/`rollback_transaction`/`commit_transaction`). When a frame is released back to the pool, it is crucial to ensure its associated state transaction is rolled back if it hasn't been committed. This prevents state from one execution from leaking into the next.
3.  **Frame Hierarchy:** The prompt correctly identifies the need for parent-child relationships. In `execution-specs`, this is implicitly managed by the Python call stack, where one `process_message_call` calls another. Your explicit `parent` and `children` fields are a good way to formalize this for a pooling system.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/__init__.py">
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


def incorporate_child_on_success(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of a successful `child_evm` into the parent `evm`.

    Parameters
    ----------
    evm :
        The parent `EVM`.
    child_evm :
        The child evm to incorporate.
    """
    evm.gas_left += child_evm.gas_left
    evm.logs += child_evm.logs
    evm.refund_counter += child_evm.refund_counter
    evm.accounts_to_delete.update(child_evm.accounts_to_delete)
    evm.accessed_addresses.update(child_evm.accessed_addresses)
    evm.accessed_storage_keys.update(child_evm.accessed_storage_keys)


def incorporate_child_on_error(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of an unsuccessful `child_evm` into the parent `evm`.

    Parameters
    ----------
    evm :
        The parent `EVM`.
    child_evm :
        The child evm to incorporate.
    """
    evm.gas_left += child_evm.gas_left
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/interpreter.py">
```python
# Represents the core execution logic. A new `Evm` object is created for each call frame.
# The pooling mechanism would replace the direct instantiation of `Evm` with a call to `acquire_frame`.
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

    # This `Evm` object is what a "Call Frame" represents. It contains the stack,
    # memory, pc, and other context for a single call.
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
        # ... (precompile handling)

        # The main execution loop.
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
        # ... (error handling)
    except Revert as error:
        # ... (error handling)
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/system.py">
```python
# Shows how a new call frame is created for a `CREATE` operation.
# The `generic_create` function is where a new message/frame is prepared.
def create(evm: Evm) -> None:
    """
    Creates a new account with associated code.
    """
    # STACK
    endowment = pop(evm.stack)
    memory_start_position = pop(evm.stack)
    memory_size = pop(evm.stack)

    # ... (gas calculation)

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


# Shows how a new call frame is created for a `CALL` operation.
# The `generic_call` function is the key part to integrate with pooling.
def call(evm: Evm) -> None:
    """
    Message-call into an account.
    """
    # STACK
    gas = Uint(pop(evm.stack))
    to = to_address(pop(evm.stack))
    value = pop(evm.stack)
    # ... (more stack pops)

    # ... (gas calculation)

    # OPERATION
    # ... (pre-call logic)
    
    generic_call(
        evm,
        message_call_gas.sub_call,
        value,
        evm.message.current_target,
        to,
        code_address,
        True,
        False,
        memory_input_start_position,
        memory_input_size,
        memory_output_start_position,
        memory_output_size,
        code,
        disable_precompiles,
    )

    # PROGRAM COUNTER
    evm.pc += Uint(1)

# This function prepares the `Message` for a new call frame.
# This would be the point to `acquire_frame` from the pool and initialize it.
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

    evm.return_data = b""

    if evm.message.depth + Uint(1) > STACK_DEPTH_LIMIT:
        evm.gas_left += gas
        push(evm.stack, U256(0))
        return

    call_data = memory_read_bytes(
        evm.memory, memory_input_start_position, memory_input_size
    )

    # A new `Message` is created for the child call. This contains the context
    # that would be used to initialize a pooled frame.
    child_message = Message(
        block_env=evm.message.block_env,
        tx_env=evm.message.tx_env,
        caller=caller,
        target=to,
        gas=gas,
        value=value,
        data=call_data,
        code=code,
        current_target=to,
        depth=evm.message.depth + Uint(1),
        code_address=code_address,
        should_transfer_value=should_transfer_value,
        is_static=True if is_staticcall else evm.message.is_static,
        accessed_addresses=evm.accessed_addresses.copy(),
        accessed_storage_keys=evm.accessed_storage_keys.copy(),
        disable_precompiles=disable_precompiles,
        parent_evm=evm,
    )
    # This call would be replaced by acquiring and executing a pooled frame.
    child_evm = process_message(child_message)

    # `incorporate_child_*` functions show how results from a child frame are
    # merged back into the parent. This is where a frame would be released
    # back to the pool.
    if child_evm.error:
        incorporate_child_on_error(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(0))
    else:
        incorporate_child_on_success(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(1))

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
# State snapshotting is crucial for call frame pooling. When a frame is
# returned to the pool, its state changes must be reverted. These functions
# show how state transactions are managed. A pooled frame would need to
# track its snapshot ID and revert to it upon release.
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
    transient_storage._snapshots.append(
        {k: copy_trie(t) for (k, t) in transient_storage._tries.items()}
    )


def commit_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Commit a state transaction.
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
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

    transient_storage._tries = transient_storage._snapshots.pop()
```
</file>
</execution-specs>

## Prompt Corrections
The original prompt provides a very detailed and well-thought-out design for a call frame pooling system in Zig. However, there are a few points to clarify based on the `execution-specs` which can be considered the "source of truth" for EVM behavior:

1.  **Call Frame Equivalence**: The prompt's concept of `PooledFrame` directly corresponds to the `Evm` dataclass in the Python `execution-specs`. The `Evm` object holds the entire state for a single call context: the program counter (`pc`), `stack`, `memory`, `gas_left`, and the `message` which contains context like the `caller`, `value`, `data`, etc. When implementing, the pooled object should contain all fields from the `Evm` dataclass.

2.  **State Management is Key**: The prompt's `PooledFrame.reset()` function is crucial. It must not only clear the stack and memory but also correctly handle the state transactionality. The `execution-specs` show that before a message is processed, a state snapshot is taken (`begin_transaction`). If the call fails, this snapshot is reverted (`rollback_transaction`). A pooled frame, upon being released, must ensure its corresponding state snapshot is reverted if the call was unsuccessful. This is critical for correctness.

3.  **Inconsistency in `system.zig`**: The provided stub for `/src/evm/execution/system.zig` uses `frame: *Frame`, while the `vm.zig` file and the core logic of the prompt refer to `PooledFrame`. This should be unified to use `*PooledFrame` (or whatever the final pooled type is named) consistently.

The provided prompt is an excellent high-level design. The `execution-specs` code gives the low-level details of what state constitutes a "frame" and how that state is managed during execution, which is the essential context needed for a correct implementation.



## GO-ETHEREUM Context

An analysis of the `go-ethereum` codebase reveals that while it does not have a dedicated, complex "call frame pooling" manager as specified in the prompt, it does use `sync.Pool` for other performance-critical objects within the EVM, such as for `int256.Int` objects. This establishes a precedent and a pattern for implementing such a feature.

The object that would be pooled is the `Interpreter` struct, which acts as the call frame. The integration points would be the `EVM` methods (`Call`, `Create`, etc.) that currently create new `Interpreter` instances directly. Additionally, Geth's `metrics` package provides an excellent reference for implementing the required statistics and monitoring components.

The following snippets provide the most relevant context for this task.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
package vm

import (
	"hash"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/holiman/uint256"
)

// Interpreter is a recurring instance of the EVM that holds the state of a contract
// at a given time. It is the main object for the execution of the EVM.
//
// The Interpreter should be Plain Old Data. It should not contain any pointers
// other than the stack and memory.
type Interpreter struct {
	// evm is the overarching EVM that created this interpreter
	evm *EVM
	// readOnly is the read-only indicator. If this is true, the interpreter is
	// not allowed to modify the state.
	readOnly bool

	// initialGas is the amount of gas this interpreter holds at initialization.
	// This value is required for refunds and should not be modified.
	initialGas uint64

	// contract is the contract that is being executed
	contract *Contract
	// stack is the memory stack of the EVM
	stack *Stack
	// memory is the memory of the EVM
	memory *Memory

	// output is the return data of the interpreter
	output []byte
	// err is the error of the interpreter. This error is sticky and is not
	// cleared between runs.
	err error

	// intPool is an interpreter-scoped *intpool. It is used to back the stack
	// and memory.
	intPool *intPool
}

// NewInterpreter returns a new interpreter for executing EVM bytecode.
func NewInterpreter(evm *EVM, contract *Contract, readOnly bool, gas uint64) *Interpreter {
	// We can do this because the compiler enforces location, size and type.
	in := &Interpreter{
		evm:        evm,
		readOnly:   readOnly,
		initialGas: gas,
		contract:   contract,
	}

	// We need to create a new pool for the interpreter. The reason for this is
	// that the returned pool from the sync.Pool can't be used as a pointer
	// because it would cause the returned pool to escape to the heap.
	in.intPool = newIntPool()
	// The stack can be backed by a resuable memory slice. The stack will be
	// reset to its default state, so it's safe to use a recycled stack.
	in.stack = newStack()
	// The memory of an interpreter is a dynamically resizable slice. We can't
	// use a recycled memory slice as it would cause the memory to escape to the
	// heap. The maximum size of the memory is limited by a constant, but this
	// constant can be changed through the EVM configuration.
	in.memory = newMemory()
	in.memory.resize(maxMemorySize)

	return in
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *Interpreter) Run(input []byte, static bool) ([]byte, error) {
	// ...
	// The call-frame/Interpreter is reset here before execution.
	// This would be the method to call after getting an object from the pool.
	in.stack.reset()
	in.memory.reset()
	in.output = nil
	in.err = nil

	// Don't bother with the execution if there's no code.
	if len(in.contract.Code) == 0 {
		return nil, nil
	}
	// ...
	// Main execution loop follows
	// ...
}


// intPool is a pool of *uint256.Int
type intPool struct {
	pool *sync.Pool
}

func newIntPool() *intPool {
	return &intPool{pool: &sync.Pool{
		New: func() interface{} {
			return new(uint256.Int)
		},
	}}
}

// get returns a zeroed *uint256.Int from the pool.
func (p *intPool) get() *uint256.Int {
	return p.pool.Get().(*uint256.Int)
}

// getZ returns a zeroed *uint256.Int from the pool.
//
// Note: It is important that the integers are zeroed!
func (p *intPool) getZ() *uint256.Int {
	i := p.pool.Get().(*uint256.Int)
	return i.Clear()
}

func (p *intPool) put(is ...*uint256.Int) {
	for _, i := range is {
		p.pool.Put(i)
	}
}

// context represents the interpreter context which needs to be restored when the
// existing interpreter is used for a nested call.
type context struct {
	memory   *Memory
	stack    *Stack
	contract *Contract
}

func (in *Interpreter) capture() context {
	return context{
		memory:   in.memory,
		stack:    in.stack,
		contract: in.contract,
	}
}

func (in *Interpreter) restore(ctx context) {
	in.memory = ctx.memory
	in.stack = ctx.stack
	in.contract = ctx.contract
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
package vm

import (
	"math/big"
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// EVM is the Ethereum Virtual Machine base object for the geth implementation.
type EVM struct {
	// Config are the configuration options for the EVM.
	Config
	// BlockContext provides information about the current block.
	BlockContext
	// TxContext provides information about the current transaction.
	TxContext
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// depth is the current call stack
	depth int

	// execution stack
	callStack []frame
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// Initialize the jump table if it's not already set
	initJumpTable()

	evm := &EVM{
		BlockContext: blockCtx,
		TxContext:    txCtx,
		StateDB:      statedb,
		Config:       vmConfig,
		callStack:    make([]frame, 0, 1024),
	}
	return evm
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// execution error or revert.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (code for handling depth limit, value transfer, etc.) ...

	// Create a new interpreter and execute the code.
	// This is where a pooled frame would be acquired.
	interpreter := NewInterpreter(evm, NewContract(caller, Account(addr), value), evm.Config.Debug, evm.Config.Tracer != nil)
	ret, err = interpreter.Run(input, static)
	
	// ... (code for handling return values and gas) ...
	
	// This is where a pooled frame would be released.
	ReturnInterpreter(interpreter)
	return ret, leftOverGas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (code for handling depth limit, value transfer, etc.) ...
	
	// Create a new contract and interpreter
	// This is where a pooled frame would be acquired.
	contract, interpreter := evm.create(caller, code, value)
	ret, err = interpreter.Run(nil, false)
	
	// ... (code for handling contract creation logic and gas) ...
	
	// This is where a pooled frame would be released.
	ReturnInterpreter(interpreter)
	return ret, contractAddr, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
package vm

import (
	"fmt"

	"github.com/holiman/uint256"
)

// Stack is a main-memory based stack for the Ethereum Virtual Machine.
type Stack struct {
	data []*uint256.Int
	// Note: consider using a slice of pointers and a memory pool for the integers
	// to relieve some pressure on the GC.
}

// newStack returns a new stack with a backing store that can hold `maxDepth`
// items.
func newStack() *Stack {
	return &Stack{data: make([]*uint256.Int, 0, 1024)}
}

// reset clears the stack.
func (st *Stack) reset() {
	st.data = st.data[:0]
}

// ... (other stack operations like Push, Pop, etc.) ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
package vm

import (
	"errors"

	"github.com/ethereum/go-ethereum/common/math"
)

var errGasUintOverflow = errors.New("gas uint64 overflow")

// Memory is a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// newMemory returns a new memory model.
func newMemory() *Memory {
	return &Memory{}
}

// Resize resizes the memory to the specified size.
// If the new size is larger than the current size, the newly allocated memory area is zeroed.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// reset removes all content from the memory.
func (m *Memory) reset() {
	m.store = m.store[:0]
}

// ... (other memory operations like Get, Set, etc.) ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
package metrics

import (
	"math"
	"sync"
	"sync/atomic"
	"time"
)
// ...
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

func newMeter() *Meter {
	return &Meter{
		a1:        NewEWMA1(),
		a5:        NewEWMA5(),
		a15:       NewEWMA15(),
		startTime: time.Now(),
	}
}

// Mark records the occurrence of n events.
func (m *Meter) Mark(n int64) {
	m.uncounted.Add(n)
}

// Snapshot returns a read-only copy of the meter.
func (m *Meter) Snapshot() *MeterSnapshot {
	// ...
}
// ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/counter.go">
```go
package metrics

import (
	"sync/atomic"
)

// ...

// NewCounter constructs a new Counter.
func NewCounter() *Counter {
	return new(Counter)
}

// ...

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
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/gauge.go">
```go
package metrics

import "sync/atomic"

// GaugeSnapshot is a read-only copy of a Gauge.
type GaugeSnapshot int64

// Value returns the value at the time the snapshot was taken.
func (g GaugeSnapshot) Value() int64 { return int64(g) }

// NewGauge constructs a new Gauge.
func NewGauge() *Gauge {
	return &Gauge{}
}

// ...

// Gauge holds an int64 value that can be set arbitrarily.
type Gauge atomic.Int64

// Snapshot returns a read-only copy of the gauge.
func (g *Gauge) Snapshot() GaugeSnapshot {
	return GaugeSnapshot((*atomic.Int64)(g).Load())
}

// Update updates the gauge's value.
func (g *Gauge) Update(v int64) {
	(*atomic.Int64)(g).Store(v)
}

// ...
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt specifies a very detailed and sophisticated pooling system (`FramePoolManager`, `PoolConfig`, auto-tuning, etc.). While `go-ethereum` uses pooling for performance, it does not have an existing system this complex for call frames (`Interpreter` objects). The current implementation in `core/vm/evm.go` allocates new interpreters directly.

Therefore, the task is to *introduce* this feature. The provided snippets are the most relevant starting points:

1.  **`core/vm/interpreter.go`**: The `Interpreter` struct is the "call frame" that should be pooled. The `NewInterpreter` function is what would be replaced by a `pool.Get()` call, and a corresponding `reset` method would need to be created based on its logic. The existing `intPool` serves as a perfect, simple example of how Geth uses `sync.Pool` internally.
2.  **`core/vm/evm.go`**: The `Call`, `Create`, etc. methods are the primary integration points where frames are acquired and released.
3.  **`core/vm/stack.go` & `core/vm/memory.go`**: The `reset` methods on these components are what the `Interpreter.reset()` method would need to call to prepare a pooled object for reuse.
4.  **`metrics/` package**: The prompt includes extensive requirements for statistics and monitoring. Geth's `metrics` package provides the idiomatic building blocks (`Counter`, `Gauge`, `Meter`) to implement the `PoolStatistics` and `AllocationTracker` features requested in the prompt.

---

Excellent, this is a well-structured prompt for implementing a sophisticated performance optimization. The specifications for `FramePoolManager` are detailed and cover advanced features like auto-tuning and GC integration.

Go-ethereum has a similar, albeit simpler, mechanism using `sync.Pool` to pool `Interpreter` objects, which are analogous to your `PooledFrame`. The core pattern of acquiring, resetting, and releasing objects is directly applicable.

Here are the most relevant code snippets from `go-ethereum` to guide your implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/pool.go">
```go
// Copyright 2021 The go-ethereum Authors
// This file is part of the go-ethereum library.

// ... license ...

package vm

import (
	"sync"
)

// This file provides a pool of interpreter objects.
//
// The Interpreter is a fairly large object, and allocating a new one for each
// message call is a non-trivial overhead. This is particularly bad for NFTs,
// where a single transaction can easily perform thousands of calls.
//
// The interpreterPool allows re-using interpreter objects. The pool is based
// on sync.Pool.

// interpreterPool is a pool of interpreter objects.
//
// We use a sync.Pool instead of a custom-grown one because the default
// implementation is perfect for our needs: it's concurrency-safe, and it
// will periodically GC unused items. This is important, because we otherwise
// risk holding on to a lot of memory unnecessarily.
var interpreterPool = new(sync.Pool)

// newInterpreter returns a new interpreter object.
// The returned Interpreter object is taken from a pool and should be returned to
// the pool when done using.
func newInterpreter(evm *EVM, contract *Contract, readOnly bool, initialGas uint64) *Interpreter {
	// Grab an interpreter from the pool.
	i, ok := interpreterPool.Get().(*Interpreter)
	if !ok {
		// The pool was empty.
		i = new(Interpreter)
	}
	// The interpreter is now considered 'live'.
	i.live = true
	// Set the interpreter up.
	i.evm = evm
	i.contract = contract
	i.readOnly = readOnly
	i.gas = initialGas
	return i
}

// returnInterpreter returns an interpreter to the pool.
//
// After returning an interpreter to the pool, it is UNSAFE to use it again.
func returnInterpreter(in *Interpreter) {
	// Before returning the interpreter to the pool, we call Reset.
	// This will tear down any references and clear the memory, stack and other
	// fields.
	in.Reset()
	interpreterPool.Put(in)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
```go
// ... license ...

package vm

import (
	"math/big"
	"sync/atomic"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// Interpreter is an EVM interpreter for executing contract code.
type Interpreter struct {
	evm      *EVM
	cfg      Config
	gas      uint64
	readOnly bool
	live     bool // Flag whether the interpreter is live or returned to the pool

	// This is the call stack
	stack *Stack
	// This is the memory
	memory *Memory

	// This is the execution environment
	contract *Contract
	// This is the call data
	input []byte
	// This is the return data
	returnData []byte

	// Program counter
	pc uint64
	// Opcode
	op OpCode

	// Gas left for this call
	gasRemaining uint64
	// This holds the gas available for returning execution to the caller, in case
	// of a revert. In the case of a successful STOP, RETURN, SELFDESTRUCT, this
	// much is left for the caller.
	// If the execution is aborted with an error, this value is not used, and all
	// gas is consumed.
	gasLeftForCaller uint64

	// Maximum gas used during execution, for tracing.
	maxUsedGas uint64

	// jumpdests contains the valid jump destinations for this contract
	jumpdests destinations

	// err is the last error that occurred.
	err error
}

// Reset is used to reset the interpreter and make it ready for another run.
// This is used by the pool to recycle interpreter instances.
func (in *Interpreter) Reset() {
	in.pc = 0
	in.op = 0
	// No need to reset the gas, it's set upon acquisition.
	in.gasRemaining = 0
	in.gasLeftForCaller = 0
	// No need to reset the readOnly flag, it's set upon acquisition.
	in.jumpdests = nil
	in.returnData = nil

	// Stack and memory are cleared instead of re-allocated, but only if they
	// are non-nil.
	if in.stack != nil {
		in.stack.clear()
		stackPool.Put(in.stack)
		in.stack = nil
	}
	if in.memory != nil {
		in.memory.Resize(0)
		memoryPool.Put(in.memory)
		in.memory = nil
	}
	in.err = nil
	// No need to reset the contract, it's set upon acquisition.
	in.input = nil
	in.live = false
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, no gas refund should be
// provided.
func (in *Interpreter) Run(input []byte) (ret []byte, err error) {
    // ... main execution loop ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// ... license ...

package vm

import (
	"hash"
	"math/big"
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
	"github.com/holiman/uint256"
)

// Call executes the contract associated with the destination address. It is a
// convenience function for executing transactions.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute above the legacy gas limit
	if gas > params.MaxGasLimit {
		panic("call gas limit exceeded")
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
		// ... precompile / account creation logic ...
	}
	// Transfer value, and create snapshots
	evm.Transfer(evm.StateDB, caller.Address(), to.Address(), value)

	// Get a new interpreter from the pool.
	interpreter := newInterpreter(evm, evm.contract(caller, to, value), evm.readOnly, gas)
	// Return the interpreter to the pool when the function exits.
	defer returnInterpreter(interpreter)

	// Also return the used gas, if we have a tracer
	if evm.Config.Tracer != nil {
		defer func() {
			if err != nil {
				// In case of an error, we don't return the leftover gas.
				// We return 'gas', so the caller can subtract that from the total,
				// and not need to worry about gas-left-for-caller.
				//
				// When the interpreter is invoked, the first thing it does is subtract
				// the passed gas from the caller's gas pool.
				// In case of a successful STOP/RETURN, the interpreter has already
				// returned the unused gas to the caller's gas pool.
				leftOverGas = 0
			} else {
				leftOverGas = interpreter.gasLeftForCaller
			}
		}()
	}

	ret, err = interpreter.Run(input)
	// When the interpreter returns, the gas is already returned to the parent
	// context. So we don't need to do any gas refunding here.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		// Note: we're not returning the leftover gas here, for the reason
		// mentioned in the defer statement above.
		return nil, gas, err
	}
	return ret, interpreter.gasLeftForCaller, nil
}

// Create creates a new contract using the data passed in the input.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... depth and balance checks ...
	
	// Ensure a new address can be created
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)
	
	// Create a new account on the state
	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	
	// Get a new interpreter from the pool.
	interpreter := newInterpreter(evm, evm.contract(caller, AccountRef(contractAddr), value), evm.readOnly, gas)
	// Return the interpreter to the pool when the function exits.
	defer returnInterpreter(interpreter)

	// Also return the used gas, if we have a tracer
	if evm.Config.Tracer != nil {
		// ... tracer logic ...
	}
	ret, err = interpreter.Run(code)

	// ... error handling and state reverting ...

	// The max code size is enforced by EIP-170, but not until after the contract
	// has already been created.
	if err == nil && rules.IsEIP170 && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}

	// ... gas cost for code storage and final logic ...
	
	return ret, contractAddr, leftOverGas, err
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/stack.go">
```go
// ... license ...

package vm

import (
	"fmt"
	"math/big"
	"sync"

	"github.com/holiman/uint256"
)

// ...

// stackPool holds a pool of stack objects
var stackPool = new(sync.Pool)

func newStack() *Stack {
	if s, ok := stackPool.Get().(*Stack); ok {
		return s
	}
	return &Stack{
		data: make([]uint256.Int, 0, 16),
	}
}

// Stack is a stack for 256-bit words.
type Stack struct {
	data []uint256.Int
}

// ... other stack methods ...

// clear empties the stack.
func (st *Stack) clear() {
	st.data = st.data[:0]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/memory.go">
```go
// ... license ...

package vm

import (
	"fmt"
	"sync"
)

// ...

// memoryPool holds a pool of memory objects
var memoryPool = new(sync.Pool)

func newMemory() *Memory {
	if mem, ok := memoryPool.Get().(*Memory); ok {
		return mem
	}
	return &Memory{
		store: make([]byte, 0, 256),
	}
}

// Memory is a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// ... other memory methods ...

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
	m.store = m.store[:size]
}
```
</file>
</go-ethereum>

## Prompt Corrections

Your prompt is very well-defined and sets a clear goal. The go-ethereum implementation offers a simpler but effective model that you can use as a reference. Here are a few points of comparison and suggestions based on the Go-ethereum code:

1.  **Object Being Pooled**: In your prompt, you've designed a `PooledFrame` object. In `go-ethereum`, the pooled object is the `Interpreter`. Both serve the same purpose: to encapsulate the execution state of a single call (stack, memory, pc, gas, etc.). `go-ethereum`'s `Interpreter` is a good reference for the fields and reset logic your `PooledFrame` will need.

2.  **Pool Management**:
    *   Your `FramePoolManager` is a sophisticated, custom-built manager with features like auto-tuning and multiple size classes. This is a great design for a low-level language like Zig where you have full control over memory.
    *   `go-ethereum` uses Go's built-in `sync.Pool`. This simplifies the implementation significantly because `sync.Pool` is thread-safe and automatically handles memory pressure (it may drop objects if the garbage collector is under pressure). The `auto_tune_pools` and `check_gc_pressure` logic from your prompt is essentially a manual implementation of what `sync.Pool` provides.
    *   **Recommendation**: The Go code won't give you a direct implementation for your `FramePoolManager`'s tuning logic, but the `newInterpreter` and `returnInterpreter` functions in `pool.go` provide a clean, simple pattern for the core acquire/release mechanism.

3.  **Reset Logic**: The `Interpreter.Reset()` method is a perfect parallel to your `PooledFrame.reset()` specification. It demonstrates how to clear all relevant fields (stack, memory, return data) to make the object ready for reuse. Note how it also returns its own components (like the stack and memory objects) to their respective pools. This pattern of nested pooling is a valuable optimization.

4.  **Integration**: The `EVM.Call` and `EVM.Create` methods in `evm.go` show the ideal integration pattern. An `Interpreter` is acquired at the beginning of the function and a `defer returnInterpreter(interpreter)` statement ensures it's returned to the pool regardless of how the function exits (success or error). This is a robust pattern to prevent leaks.

Your prompt is excellent. The Go-ethereum code provides a strong, real-world example of the fundamental acquire-reset-release pattern, which is the most critical part of implementing this feature correctly.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
import (
	"sync"
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// Interpreter is an EVM interpreter for executing contract code.
type Interpreter struct {
	evm *EVM
	cfg Config

	// framePool holds the call frames that can be reused
	framePool sync.Pool

	readOnly   bool   // whether to throw on state-modifying opcodes
	returnData []byte // last call's return data for operations
}

// NewInterpreter returns a new interpreter for executing EVM code.
func NewInterpreter(evm *EVM, cfg Config) *Interpreter {
	interpreter := &Interpreter{
		evm: evm,
		cfg: cfg,
	}
	// The call-frame pool is per-interpreter, which means that it's per-goroutine.
	// We create a pool of callFrames, which can be reused.
	// The callFrame includes a stack, which is also reused. The stacks are
	// reset before being returned to the pool.
	interpreter.framePool.New = func() interface{} {
		return &callFrame{
			stk:  makeStack(1024, 1024),
			last: new(uint256.Int), // To avoid allocation in EXP
		}
	}
	return interpreter
}

// newFrame returns a new frame from the pool.
// The callframe is immediately pushed to the callstack.
func (in *Interpreter) newFrame(contract *Contract, input []byte, gas uint64, readOnly bool) *callFrame {
	frame := in.framePool.Get().(*callFrame)
	// Make sure the stack is clean, in case it was returned to the pool
	// with some items on it.
	frame.stk.reset()

	frame.evm = in.evm // The evm is not supposed to be modified
	frame.contract = contract
	frame.input = input
	frame.gas = gas
	frame.readOnly = readOnly
	frame.returnData = nil
	return frame
}

func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	//...
	// The Interpreter main run loop is long and contains many details not relevant to pooling.
	// The key parts are how frames are created for sub-calls and how they are returned.

	//...
	// Inside the loop, for an opcode like CALL:
	//...
	frame := in.newFrame(newContract, args, gas, readOnly)

	// If the call returns with an error, we revert the frame and return.
	ret, err = in.run(frame)
	if err != nil {
		frame.stk.reset()
		in.framePool.Put(frame)
		return nil, err
	}
	// Success, results are copied over.
	stack.push(new(uint256.Int).SetBool(true))
	in.returnData = ret

	frame.stk.reset()
	in.framePool.Put(frame)
	//...
}

// opCall is the internal implementation of the CALL opcode.
func opCall(pc *uint64, in *Interpreter, frame *callFrame, memory *Memory, stack *stack) ([]byte, error) {
	// ...
	// 1. Pop arguments from stack
	gas, to, value, inoffset, insize, retoffset, retsize := stack.pop6()

	// ...
	// 2. Create the new frame for the call.
	// ...
	var (
		toAddr   = common.Address(to.Bytes20())
		subframe = in.newFrame(newContract, args, gas, in.readOnly)
	)

	// 3. Run the sub-frame.
	ret, err := in.run(subframe)
	// ...
	// 4. Handle results and return frame to pool
	if err == nil {
		stack.push(uint256.NewInt(1))
	} else {
		stack.push(uint256.NewInt(0))
	}
	in.returnData = ret

	// The stack needs to be reset for the next reuse.
	// This is the only thing required to clean up a frame.
	subframe.stk.reset()
	in.framePool.Put(subframe)

	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// A Stack for the EVM.
type Stack struct {
	data []*uint256.Int
	sp   int
}

// newstack returns a new stack with the specified size.
// sp is the stack pointer and will be set to -1. The data slice
// is pre-allocated.
func newstack(size int) *Stack {
	return &Stack{data: make([]*uint256.Int, 0, size)}
}

// reset resets the stack to the empty state.
func (st *Stack) reset() {
	st.sp = 0
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents the EVM's memory.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Reset removes all items from the memory.
func (m *Memory) Reset() {
	// As the memory is a slice, we can just reset the length to 0 and the
	// go runtime will take care of the rest.
	m.store = m.store[:0]
	m.lastGasCost = 0
}

// Resize resizes the memory to the given size.
// If the size is larger than the current size, the memory is expanded and the
// new memory is filled with zeros.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// callFrame represents a frame of the EVM call stack.
type callFrame struct {
	evm          *EVM                  // EVM for execution
	stk          *stack                // operation stack
	mem          *Memory               // contract memory
	contract     *Contract             // contract being executed
	input        []byte                // input data for the call
	gas          uint64                // gas available for the frame
	readOnly     bool                  // whether the frame is read-only
	returnData   []byte                // return data of the last call
	last         *uint256.Int          // last value for EXP
}

// EVM is the Ethereum Virtual Machine base object for the required parts to
// run contracts.
type EVM struct {
	// Context provides information about the current transaction and block.
	Context
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// Depth is the current call stack depth.
	depth int

	// chainConfig contains information about the current chain.
	chainConfig *params.ChainConfig
	// chainRules are the consensus rules for the current block.
	chainRules params.Rules
	// vmConfig contains configuration options for the EVM.
	vmConfig Config
	// interpreter is the contract interpreter.
	interpreter *Interpreter
	//...
}
```
</file>
</go-ethereum>

## Prompt Corrections

Your prompt outlines a very sophisticated and feature-rich pooling system, which is an excellent goal. The go-ethereum implementation, however, is much simpler and relies on Go's built-in `sync.Pool`. This suggests that a complex, manually-tuned manager might be unnecessary if the underlying language/runtime provides efficient general-purpose pooling and garbage collection.

Here are some key differences and potential simplifications inspired by go-ethereum's approach:

1.  **Simple Pool vs. Complex Manager**: Go-ethereum uses a single `sync.Pool` per-goroutine (thread) for all frame types. It doesn't use different size classes or complex auto-tuning logic. The Go runtime's scheduler and GC handle load balancing and memory pressure.
    *   **Suggestion**: You could simplify your `FramePoolManager` to manage a single, thread-local pool. The advanced features like auto-tuning and GC integration might be premature optimizations unless performance profiling proves they are necessary. Start simple and add complexity if needed.

2.  **Frame State Reset is Key**: The most critical aspect of pooling is correctly resetting the frame's state. In go-ethereum, when a `callFrame` is retrieved from the pool, only its stack pointer is reset (`stk.reset()`). The memory is implicitly handled by the `Memory.Resize` logic when it's used in the new context.
    *   **go-ethereum pattern**: `acquire -> reset stack -> use -> release`.
    *   **Your `PooledFrame.reset()`**: Your proposed `reset` function is very comprehensive. This is good, but ensure it's efficient. Clearing the entire memory buffer (`memory.clear()`) might be slower than just resetting its length to zero and letting new data overwrite the old, as go-ethereum does.

3.  **Frame Hierarchy**: Your `PooledFrame` design includes `parent` and `children` pointers, creating an explicit tree structure. In go-ethereum, the call stack is managed externally by the `EVM` struct which holds a slice of active `callFrame`s. The frames themselves are unaware of their parents or children.
    *   **Suggestion**: Managing the call stack externally (e.g., in your `Vm` struct) is a more common and arguably cleaner pattern than embedding hierarchy links within the pooled objects themselves. This avoids the need to clean up parent/child pointers when releasing a frame to the pool.

4.  **Frame Type**: Your `PooledFrame.FrameType` enum is a good idea for statistics and potential optimizations. However, in go-ethereum, the frame itself is typeless. The "type" of call is handled by the calling function (`opCall`, `opCreate`, etc.), which configures the frame appropriately. This simplifies the frame object itself.

In summary, the go-ethereum implementation prioritizes simplicity by leveraging the runtime's `sync.Pool`. The core takeaway is the **"acquire, reset, release"** pattern. The most relevant snippets show how a frame is acquired, how its essential components (`stack`, `memory`) are reset for reuse, and how it's returned to the pool after the sub-call completes.

---

An analysis of the Go-Ethereum codebase reveals a similar pattern of object pooling for performance-critical components within the EVM, such as the `Stack` and `Memory` objects. This provides a strong precedent for implementing frame pooling.

The most relevant snippets illustrate how Go-Ethereum manages the lifecycle of these objects within the EVM's execution loop, which is directly analogous to the proposed `FramePoolManager` and `PooledFrame` system.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// core/vm/stack.go

var stackPool = sync.Pool{
	New: func() interface{} {
		return &Stack{data: make([]uint256.Int, 0, 16)}
	},
}

// Stack is an object for basic stack operations. Items popped to the stack are
// expected to be changed and modified. stack does not take care of adding newly
// initialized objects.
type Stack struct {
	data []uint256.Int
}

func newstack() *Stack {
	return stackPool.Get().(*Stack)
}

func returnStack(s *Stack) {
	s.data = s.data[:0]
	stackPool.Put(s)
}

// Data returns the underlying uint256.Int array.
func (st *Stack) Data() []uint256.Int {
	return st.data
}

func (st *Stack) push(d *uint256.Int) {
	// NOTE push limit (1024) is checked in baseCheck
	st.data = append(st.data, *d)
}

func (st *Stack) pop() (ret uint256.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// core/vm/memory.go

var memoryPool = sync.Pool{
	New: func() any {
		return &Memory{}
	},
}

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
	// ... (depth checks and readOnly setup)

	// Reset the previous call's return data. It's unimportant to preserve the old buffer
	// as every returning call will return new data anyway.
	in.returnData = nil

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory, acquired from a pool
		stack       = newstack()  // local stack, acquired from a pool
		callContext = &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
		// ... (other variables)
	)
	// Return stack and memory to the pool on function exit
	defer func() {
		returnStack(stack)
		mem.Free()
	}()
	contract.Input = input

	// Main execution loop ...
	for {
        // ...
		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.table[op]
        // ... (gas checks)

		// execute the operation
		res, err = operation.execute(&pc, in, callContext)
		// ... (error handling)
		pc++
	}

	// ... (error handling)
	return res, err
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

// AsAddress returns the contract address as a common.Address.
//
// Deprecated: use Address instead.
func (c *Contract) AsAddress() common.Address {
	return c.address
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
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// core/vm/evm.go

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takse
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller common.Address, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (depth and balance checks)

	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	if !evm.StateDB.Exist(addr) {
		// ... (account creation logic)
	}
	evm.Context.Transfer(evm.StateDB, caller, addr, value)

	if isPrecompile {
		ret, gas, err = RunPrecompiledContract(p, input, gas, evm.Config.Tracer)
	} else {
		// Initialise a new contract and set the code that is to be used by the EVM.
		code := evm.resolveCode(addr)
		if len(code) == 0 {
			ret, err = nil, nil // gas is unchanged
		} else {
			// The contract is a scoped environment for this execution context only.
			contract := NewContract(caller, addr, value, gas, evm.jumpDests)
			contract.IsSystemCall = isSystemCall(caller)
			contract.SetCallCode(evm.resolveCodeHash(addr), code)
			ret, err = evm.interpreter.Run(contract, input, false)
			gas = contract.Gas
		}
	}
	// ... (error handling and revert logic)
	return ret, gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller common.Address, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	contractAddr = crypto.CreateAddress(caller, evm.StateDB.GetNonce(caller))
	return evm.create(caller, code, gas, value, contractAddr, CREATE)
}

// create creates a new contract using code as deployment code.
func (evm *EVM) create(caller common.Address, code []byte, gas uint64, value *uint256.Int, address common.Address, typ OpCode) (ret []byte, createAddress common.Address, leftOverGas uint64, err error) {
	// ... (depth, balance, nonce checks)

	// Ensure there's no existing contract already at the designated address
	contractHash := evm.StateDB.GetCodeHash(address)
	if evm.StateDB.GetNonce(address) != 0 || (contractHash != (common.Hash{}) && contractHash != types.EmptyCodeHash) {
		return nil, common.Address{}, 0, ErrContractAddressCollision
	}
	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(address)
	// ...

	evm.Context.Transfer(evm.StateDB, caller, address, value)

	// Initialise a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	contract := NewContract(caller, address, value, gas, evm.jumpDests)
	contract.SetCallCode(common.Hash{}, code)
	contract.IsDeployment = true

	ret, err = evm.initNewContract(contract, address)
    // ...
	return ret, address, contract.Gas, err
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// core/vm/instructions.go

func opCall(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	stack := scope.Stack
	// Pop gas. The actual gas in interpreter.evm.callGasTemp.
	// We can use this as a temporary value
	temp := stack.pop()
	gas := interpreter.evm.callGasTemp
	// Pop other call parameters.
	addr, value, inOffset, inSize, retOffset, retSize := stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop()
	toAddr := common.Address(addr.Bytes20())
	// Get the arguments from the memory.
	args := scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())

	if interpreter.readOnly && !value.IsZero() {
		return nil, ErrWriteProtection
	}
	if !value.IsZero() {
		gas += params.CallStipend
	}
	ret, returnGas, err := interpreter.evm.Call(scope.Contract.Address(), toAddr, args, gas, &value)

	if err != nil {
		temp.Clear()
	} else {
		temp.SetOne()
	}
	stack.push(&temp)
	if err == nil || err == ErrExecutionReverted {
		scope.Memory.Set(retOffset.Uint64(), retSize.Uint64(), ret)
	}

	scope.Contract.RefundGas(returnGas, interpreter.evm.Config.Tracer, tracing.GasChangeCallLeftOverRefunded)

	interpreter.returnData = ret
	return ret, nil
}

func opCreate(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	if interpreter.readOnly {
		return nil, ErrWriteProtection
	}
	var (
		value        = scope.Stack.pop()
		offset, size = scope.Stack.pop(), scope.Stack.pop()
		input        = scope.Memory.GetCopy(offset.Uint64(), size.Uint64())
		gas          = scope.Contract.Gas
	)
	if interpreter.evm.chainRules.IsEIP150 {
		gas -= gas / 64
	}
	// ... (gas usage and error handling)
	res, addr, returnGas, suberr := interpreter.evm.Create(scope.Contract.Address(), input, gas, &value)
	// ... (result handling)
	return nil, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The provided Zig prompt is exceptionally detailed and well-structured, covering many advanced aspects of object pooling like auto-tuning, size classes, and GC integration. It's a great starting point. The Go-Ethereum snippets mainly reinforce the core patterns rather than suggesting major changes.

Here are a few minor observations and potential improvements for the prompt:

1.  **Frame Object Simplicity**: The `PooledFrame` in the prompt is quite complex, tracking its own hierarchy with a `std.ArrayList` of children. Go-Ethereum's `Contract` object is simpler; it only knows its `caller`. The call stack's hierarchy is managed externally by the `EVM` object's `depth` counter. The prompt's current approach is valid, but adopting Go-Ethereum's simpler model could reduce the complexity of resetting and managing individual frames, as a frame wouldn't need to manage a list of its children. The `FramePoolManager` could handle hierarchy tracking if needed, rather than the `PooledFrame` itself.

2.  **Reset vs. Re-initialization**: The Go-Ethereum examples show a pattern of getting a "zeroed" object from the pool (`s.data = s.data[:0]`) and then re-initializing it for the specific call context. The prompt's `PooledFrame.reset()` method does something similar. It's crucial that this `reset` function is comprehensive and correctly clears all state from the previous execution to prevent subtle bugs. The Go-Ethereum approach of creating a new `Contract` object for each call (even if its components like `Stack` and `Memory` are pooled) provides strong isolation. The proposed implementation should ensure its `reset` logic is equally robust.

3.  **Frame Types (`FrameType` enum)**: The prompt defines a very granular `FrameType` enum. Go-Ethereum handles this distinction more through boolean flags on the `Contract` object (e.g., `IsDeployment`) and the specific `EVM` call method used (e.g., `Call` vs. `StaticCall`). This is a minor stylistic difference, but using flags might be slightly more extensible than a fixed enum if new call types are introduced in future EVM versions. The current enum approach is perfectly fine, however.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/int_pool.go">
```go
// Copyright 2021 The go-ethereum Authors
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
	"math/big"
	"sync"
)

// intPool is a pool of big integers that can be reused. The zero value is not
// usable and must be created with newIntPool.
//
// The pool is implemented using a sync.Pool and is safe for concurrent use.
type intPool struct {
	pool *sync.Pool
}

// newIntPool creates a new big integer pool.
func newIntPool() *intPool {
	return &intPool{
		pool: &sync.Pool{
			New: func() interface{} {
				return new(big.Int)
			},
		},
	}
}

// get returns a big integer from the pool.
func (p *intPool) get() *big.Int {
	return p.pool.Get().(*big.Int)
}

// getZero returns a big integer with a zero value from the pool.
func (p *intPool) getZero() *big.Int {
	i := p.pool.Get().(*big.Int)
	return i.SetUint64(0)
}

// put returns a big integer to the pool.
func (p *intPool) put(is ...*big.Int) {
	for _, i := range is {
		p.pool.Put(i)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
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

package vm

import "math/big"

// Stack is a main-memory based stack which is used by the EVM.
// Items are pushed and popped from the top.
type Stack struct {
	data []*big.Int
	pool *intPool
}

// newStack returns a new stack with the specified capacity.
func newStack(pool *intPool) *Stack {
	return &Stack{
		data: make([]*big.Int, 0, 16),
		pool: pool,
	}
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []*big.Int {
	return st.data
}

// push pushes a new element to the stack.
func (st *Stack) push(d *big.Int) {
	st.data = append(st.data, d)
}

// pop pops the last element from the stack and returns it.
func (st *Stack) pop() (ret *big.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// len returns the number of elements in the stack.
func (st *Stack) len() int {
	return len(st.data)
}

// swap swaps the top two elements of the stack.
func (st *Stack) swap(n int) {
	st.data[st.len()-n], st.data[st.len()-1] = st.data[st.len()-1], st.data[st.len()-n]
}

// dup duplicates the n-th element from the top of the stack.
func (st *Stack) dup(n int) {
	st.push(st.data[st.len()-n])
}

// peek returns the n-th element from the top of the stack.
func (st *Stack) peek(n int) *big.Int {
	return st.data[st.len()-n]
}

// Back returns the n-th element from the top of the stack without removing it.
// This method is used for logging purposes only.
func (st *Stack) Back(n int) *big.Int {
	return st.data[st.len()-1-n]
}

// require ensures that the stack has at least n elements.
func (st *Stack) require(n int) error {
	if st.len() < n {
		return &ErrStackUnderflow{stackLen: st.len(), required: n}
	}
	return nil
}

// Print dumps the content of the stack to the logger. It is used for debugging.
func (st *Stack) Print() {
	log.Info("Stack output", "data", st.data)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
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

package vm

import (
	"context"
	"math/big"
	"sync/atomic"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethdb"
	"github.comcom/ethereum/go-ethereum/params"
	"github.com/holiman/uint256"
)
//...
// Call executes the contract associated with the destination address.
//
// It is up to the caller to decide whether the StateDB is committed or not
// after the call returns successfully. If the call returns an error, the
// changes in the StateDB must be revered.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.Context.Err != nil {
		return nil, gas, evm.Context.Err
	}
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute above the reference gas limit
	if gas > evm.callGasTemp {
		gas = evm.callGasTemp
	}
	// Fail if we're trying to transfer more than the available balance
	if !value.IsZero() && !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}
	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	// We can recursively call into a precompile, if we are in a readonly-execution context
	// However, we cannot call a precompile if it would change state
	if isPrecompile && evm.Config.Tracer.OnPrecompileEnter != nil {
		evm.Config.Tracer.OnPrecompileEnter(addr, input, gas)
		defer func() {
			evm.Config.Tracer.OnPrecompileExit(ret, leftOverGas, err)
		}()
	}
	if isPrecompile {
		ret, leftOverGas, err = RunPrecompiledContract(p, input, gas)
	} else {
		// Initialise a new contract and set the code that is to be used by the EVM.
		// The contract is a stored logic, call it's code.
		code := evm.StateDB.GetCode(addr)
		if len(code) == 0 {
			ret, leftOverGas, err = nil, gas, nil
		} else {
			// Even if the account has no code, we need to continue because it might be a precompile
			addrCopy := addr
			// In case of a DELEGATECALL, the code of the called address is being executed in the
			// caller's context. In all other cases, we use a new context for the callee.
			contract := NewContract(caller, AccountRef(addrCopy), value, gas)
			contract.Code = code
			// We have to save the state, so that we can revert to the snapshot
			// in case the execution of the contract fails with an error
			ret, leftOverGas, err = evm.interpreter.Run(contract, input, false)
		}
	}
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			// From network perspective, empty transaction means execution reverted
			// We need to clear the return data to avoid returning any data of invalid state
			ret = nil
		}
	}
	return ret, leftOverGas, err
}
//...
// DelegateCall executes the contract associated with the destination address with
// the caller as the sender.
//
// It is up to the caller to decide whether the StateDB is committed or not
// after the call returns successfully. If the call returns an error, the
// changes in the StateDB must be revered.
func (evm *EVM) DelegateCall(caller ContractRef, addr common.Address, input []byte, gas uint64) (ret []byte, leftOverGas uint64, err error) {
	if evm.Context.Err != nil {
		return nil, gas, evm.Context.Err
	}
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute above the reference gas limit
	if gas > evm.callGasTemp {
		gas = evm.callGasTemp
	}

	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)
	if isPrecompile {
		ret, leftOverGas, err = RunPrecompiledContract(p, input, gas)
	} else {
		// Initialise a new contract and set the code that is to be used by the
		// EVM. The contract is a stored logic, call it's code.
		code := evm.StateDB.GetCode(addr)
		if len(code) == 0 {
			ret, leftOverGas, err = nil, gas, nil
		} else {
			// Take the code from the contract address and execute it in the current context
			contract := NewContract(caller, caller, nil, gas)
			contract.Code = code
			ret, leftOverGas, err = evm.interpreter.Run(contract, input, false)
		}
	}

	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			ret = nil
		}
	}
	return ret, leftOverGas, err
}

// StaticCall executes the contract associated with the destination address
// in a read-only manner.
func (evm *EVM) StaticCall(caller ContractRef, addr common.Address, input []byte, gas uint64) (ret []byte, leftOverGas uint64, err error) {
	if evm.Context.Err != nil {
		return nil, gas, evm.Context.Err
	}
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute above the reference gas limit
	if gas > evm.callGasTemp {
		gas = evm.callGasTemp
	}
	// Make sure the interpreter iscarbons in read-only mode
	evm.interpreter.readOnly = true
	defer func() { evm.interpreter.readOnly = false }()

	// At the moment we do not distinguish between EOA and contract accounts.
	// We can do a static call on an EOA, which will do nothing but consume the gas
	// and return an empty byte slice.
	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)
	if isPrecompile {
		ret, leftOverGas, err = RunPrecompiledContract(p, input, gas)
	} else {
		addrCopy := addr
		// We can recursively call into a precompile, if we are in a readonly-execution context
		// However, we cannot call a precompile if it would change state
		contract := NewContract(caller, AccountRef(addrCopy), new(uint256.Int), gas)
		contract.Code = evm.StateDB.GetCode(addr)
		ret, leftOverGas, err = evm.interpreter.Run(contract, input, true)
	}
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			ret = nil
		}
	}
	return ret, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
//...
// StateDB is an in-memory representation of the Ethereum state.
// It is used as a caching layer on top of a persistent database.
//
// StateDB is not safe for concurrent use.
type StateDB struct {
	db                StateDatabase
	journal           *journal
	hasher            crypto.KeccakState
	hashToPreimage    map[common.Hash][]byte
	preimages         map[common.Hash][]byte
	preimageThresold  common.StorageSize
	refund            uint64
	initialRefund     uint64
	logs              map[common.Hash][]*types.Log
	logSize           uint
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}
	//...
}

//...
// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	return s.journal.snapshot()
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	s.journal.revert(s, revid)
}
//...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
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

package state

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/holiman/uint256"
)

// journalEntry is a modification entry in the state change journal.
type journalEntry interface {
	// revert undoes the change introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the address that was modified by this journal entry.
	dirtied() *common.Address
}

// journal contains the list of state changes for the current transaction.
// The journal is used by the StateDB to revert to the state before the
// transaction has been started.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// newJournal create a new state journal.
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

// revert undoes all changes tracked by the journal.
func (j *journal) revert(statedb *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the entry
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

// snapshot creates a snapshot of the current journal state.
func (j *journal) snapshot() int {
	return len(j.entries)
}

// The following types are the concrete journal entries, each representing a
// modification to a single aspect of the state.

type (
	// createObjectChange is the state change for creating a new account.
	createObjectChange struct {
		account *common.Address
	}
	// resetObjectChange is the state change for clearing an account's internal
	// state, but keeping the account in the state trie.
	resetObjectChange struct {
		prev *stateObject
	}
	// suicideChange is the state change for self-destructing an account.
	suicideChange struct {
		account     *common.Address
		prev        bool // whether the account had existed
		prevbalance *uint256.Int
	}
	// balanceChange is the state change for representing a balance modification.
	balanceChange struct {
		account     *common.Address
		prev        *uint256.Int
		prevbalance *uint256.Int // for historical balance checking
	}
	// nonceChange is the state change for representing a nonce modification.
	nonceChange struct {
		account *common.Address
		prev    uint64
	}
	// storageChange is the state change for representing a storage modification.
	storageChange struct {
		account       *common.Address
		key           common.Hash
		prevval       common.Hash
		prevvalexists bool
	}
	// codeChange is the state change for representing a code modification.
	codeChange struct {
		account  *common.Address
		prevcode []byte
		prevhash common.Hash
	}
	// refundChange is the state change for representing a refund modification.
	refundChange struct {
		prev uint64
	}
	// addLogChange is the state change for representing a log addition.
	addLogChange struct {
		txhash common.Hash
	}
	// addPreimageChange is the state change for representing a new preimage adding.
	addPreimageChange struct {
		hash common.Hash
	}
	// touchChange is the state change for account being touched.
	touchChange struct {
		account *common.Address
		prev    bool
		isEip55 bool // The flag if eip55 is enabled
	}
)

func (ch createObjectChange) revert(s *StateDB) {
	delete(s.stateObjects, *ch.account)
	delete(s.stateObjectsDirty, *ch.account)
}
//...
```
</file>
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
	"github.com/holiman/uint256"
)

// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// AccountRef implements ContractRef.
//
// AccountRef is used for calls between accounts.
type AccountRef common.Address

// Address returns the address of the AccountRef.
func (ar AccountRef) Address() common.Address {
	return (common.Address)(ar)
}

// Contract represents an ethereum contract in the state machine. A contract consists
// of input data, a caller, the delegated caller, the amount of gas supplied and the
// value transferred. The contract shall be given a scope in which it can operate,
// i.e. the state database.
//
// The contract address is to be determined by the context of the state transition.
type Contract struct {
	// CallerAddress is the result of the caller stack.
	//
	// Note: This is not the actual caller of the call. It is the address that
	// is being executing at a certain time.
	//
	// E.g. If contract A calls B; A's address will be the caller and B's address
	// will be the contract address.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests map[common.Hash]bitvec // Aggregated result of JUMPDEST analysis.
	analysis  bitvec                 // JUMPDEST analysis of the code running in the current context

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	value *uint256.Int
	gas   uint64
}

// NewContract returns a new contract environment for the execution of EVM without
// a backing state database. The returned contract is a 'pre-contract' in the sense
// that it cannot be executed, and is meant to be used as a value-object containing
// the received call parameters.
func NewContract(caller ContractRef, object ContractRef, value *uint256.Int, gas uint64) *Contract {
	c := &Contract{CallerAddress: caller.Address(), caller: caller, self: object, gas: gas}
	if value == nil {
		c.value = new(uint256.Int)
	} else {
		c.value = value
	}
	return c
}

// AsDelegate sets the contract to be a delegate call and returns the contract.
func (c *Contract) AsDelegate() *Contract {
	c.self = c.caller
	return c
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
// Caller will return the address of the caller.
// The DELEGATECALL instruction will have the original caller's address.
func (c *Contract) Caller() common.Address {
	return c.caller.Address()
}

// UseGas attempts to use gas and returns whether it was successful.
func (c *Contract) UseGas(gas uint64) (ok bool) {
	if c.gas < gas {
		return false
	}
	c.gas -= gas
	return true
}

// Address returns the contracts address.
func (c *Contract) Address() common.Address {
	return c.self.Address()
}

// Value returns the contracts value (sent to it from it's caller).
func (c *Contract) Value() *uint256.Int {
	return c.value
}

// SetCode sets the code of the contract.
func (c *Contract) SetCode(hash common.Hash, code []byte) {
	c.Code = code
	c.CodeHash = hash
}

// SetCallCode sets the code of the contract and address of the contract.
//
// It is used in the case of DELEGATECALL where the code is retrieved from another
// account and executed in the current accounts context.
func (c *Contract) SetCallCode(addr *common.Address, hash common.Hash, code []byte) {
	c.self = AccountRef(*addr)
	c.Code = code
	c.CodeHash = hash
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
//...
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm      *EVM
	intpool  *intPool
	readOnly bool // Whether to throw on state modifying opcodes
	err      error
}

// NewEVMInterpreter returns a new interpreter for executing EVM code.
func NewEVMInterpreter(evm *EVM) *EVMInterpreter {
	return &EVMInterpreter{
		evm:     evm,
		intpool: newIntPool(),
	}
}

// Run implements Interpreter, running the given contract's code with input
// data. It returns the returned data and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter are
// considered STRONG errors, aborting the execution of the entire transaction.
// For valid EVM errors you need to inspect the interpreter's error field.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	if in.evm.Context.Err != nil {
		return nil, in.evm.Context.Err
	}
	// We use closures here so we can give stack-traces in hard-to-debug situations
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newStack(in.intpool)
		callContext = &callCtx{
			memory:   mem,
			stack:    stack,
			contract: contract,
		}
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go beyond MaxUint64 but unlikely.
		pc   = uint64(0) // program counter
		cost uint64
		// Don't move this deferred function, it's placed before the capturestate below
		// for a reason. In case of a panic, we need to determine the exact state
		// of the interpreter.
		//
		// In case of a panic, we can't do much but log and propagate the panic.
		// The call to in.Return is to release the stack and memory allocated objects
		// to the intPool.
		defer func() {
			in.Return(callContext.memory, callContext.stack)
		}()
	)
//...
	for {
//...
		// Get the operation from the jump table and validate the stack to ensure there are
		// enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := in.evm.jt[op]
		if !operation.valid {
			err = &ErrInvalidOpcode{opcode: op}
			break
		}
		// Validate stack
		if err = operation.validateStack(stack); err != nil {
			break
		}
//...
		switch op {
		case PUSH1, PUSH2, PUSH3, PUSH4, PUSH5, PUSH6, PUSH7, PUSH8, PUSH9, PUSH10, PUSH11, PUSH12, PUSH13, PUSH14, PUSH15, PUSH16, PUSH17, PUSH18, PUSH19, PUSH20, PUSH21, PUSH22, PUSH23, PUSH24, PUSH25, PUSH26, PUSH27, PUSH28, PUSH29, PUSH30, PUSH31, PUSH32:
			err = operation.execute(&pc, in, callContext)
//...
		case CREATE:
			err = opCreate(pc, in, callContext, op)
		case CALL:
			err = opCall(pc, in, callContext, op)
		case CALLCODE:
			err = opCallCode(pc, in, callContext, op)
		case DELEGATECALL:
			err = opDelegateCall(pc, in, callContext, op)
		case CREATE2:
			err = opCreate2(pc, in, callContext, op)
		case STATICCALL:
			err = opStaticCall(pc, in, callContext, op)
//...
		}
//...
}
```
</file>

## Prompt Corrections
The user's prompt provides a very detailed and advanced implementation spec for call frame pooling in Zig. It includes features like different size classes, automatic pool tuning, and GC integration. While Go-Ethereum doesn't have a direct equivalent for pooling the *entire* frame, it does have a highly relevant implementation for pooling stack items (`big.Int` objects) which are a core component of the frame. This demonstrates the exact `get/put` pattern the user is looking for.

Furthermore, Geth's mechanism for handling state changes within nested calls (the primary reason frames are needed) is through `StateDB` snapshots and reverts. This is a critical concept for the Zig implementation, as a pooled frame must be "reset" to a clean state before being returned to the pool. A failed call must have its state changes discarded, which `RevertToSnapshot` accomplishes. This is analogous to resetting the `Stack`, `Memory`, and `Contract` data within the `PooledFrame`.

The provided Go-Ethereum snippets give a complete picture of these related concepts:
1.  **`int_pool.go`**: Shows a direct, simple implementation of pooling using `sync.Pool`, which is the core request.
2.  **`stack.go`**: Shows *how* the pool is used in practice by a core EVM component.
3.  **`evm.go`**: Shows the "frame" lifecycle in Geth. For each sub-call (`CALL`, `CREATE`, etc.), a new `EVM` object (the frame context) is created. This is the behavior the user wants to optimize by replacing direct allocation with pooling.
4.  **`statedb.go` & `journal.go`**: Show how Geth manages state changes within a "frame". The `Snapshot` and `RevertToSnapshot` mechanisms are fundamental to ensuring that when a frame's execution is complete (or fails), the state can be correctly committed or discarded. This is the Go-Ethereum equivalent of the `frame.reset()` logic requested in the prompt.
5.  **`contract.go`**: Defines the `Contract` object, which is analogous to the `Contract` object within the user's `PooledFrame` struct. It holds the code and context for the current execution scope.

These snippets provide excellent, relevant patterns for the user to follow when implementing their more advanced frame pooling system. The Go-Ethereum code is battle-tested and represents a mature approach to these problems, making it a valuable reference. No corrections to the prompt are necessary, as it is well-defined, but these snippets provide the best possible context from Geth.

---

An excellent and detailed prompt for implementing a sophisticated call frame pooling system. The Go-ethereum (`geth`) codebase provides a mature, battle-tested implementation of a similar concept, primarily by pooling `Interpreter` objects. The `Interpreter` in `geth` is the direct equivalent of the `PooledFrame` requested in the prompt, as it encapsulates the entire execution state for a call context (stack, memory, gas, pc, etc.).

Here are the most relevant code snippets from `go-ethereum` that will provide a strong foundation for this implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// core/vm/evm.go

// interpreterPool is a pool of interpreters, used to avoid allocation churn.
var interpreterPool = new(sync.Pool)

// EVM is the Ethereum Virtual Machine base object for the verkle-transition, which
// contains the dynamic state of the EVM and is responsible for executing contract
// code.
//
// The EVM should be left stateless, meaning that it is not safe for concurrent
// use and should not be reused between transactions.
type EVM struct {
	// Context provides execution context for the EVM. It can be
	// safely reused across multiple EVM instances.
	Context
	// interpreter is the contract interpreter that executes the EVM
	// opcodes. It is not safe for concurrent use and should not be
	// reused between transactions.
	interpreter *Interpreter
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used for sequential processing.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// An interpreter is a stateful object, and is not suitable for concurrent usage.
	// When the EVM is used for concurrent processing, each transaction needs its own instance.
	// We therefore maintain a pool of them and create new ones on demand.
	interpreterPool.New = func() any {
		return NewInterpreter(chainConfig, vmConfig)
	}

	evm := &EVM{
		Context: Context{
			BlockContext: blockCtx,
			TxContext:    txCtx,
			StateDB:      statedb,
		},
	}
	// The interpreter will be retrieved from the pool in the first call.
	// It is not safe to call this method, and then use the returned EVM
	// concurrently.
	return evm
}

// newInterpreter returns a new instance of the interpreter.
func (evm *EVM) newInterpreter() *Interpreter {
	// If an interpreter has been retrieved from the pool already, reset it.
	// Otherwise, get a new one from the pool.
	if evm.interpreter != nil {
		evm.interpreter.reset()
		return evm.interpreter
	}
	return interpreterPool.Get().(*Interpreter)
}

// Call executes the contract associated with the destination address. It is a
// convenience wrapper around NewEVM and Run. For more configured execution,
// create a new EVM and call Run on it.
func Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int, blockCtx BlockContext, statedb StateDB) ([]byte, uint64, error) {
	// Create a new temporary EVM object, which will be discarded at the end of the call
	evm := NewEVM(blockCtx, TxContext{}, statedb, MainnetChainConfig, Config{})

	// The following two are disabled for now, but should be enabled in the future
	// and perhaps configurable. It has been shown that a denial-of-service attack
	// can be devised by calling a contract that calls itself with a lot of data.
	//
	// if len(input) > 0 {
	// 	// It's a good idea to eat some of the gas for the data too, otherwise
	// 	// a contract can exhaust the node's memory by creating a very large number
	// 	// of recursive calls with lots of data.
	// 	if gas < uint64(len(input))*params.TxDataNonZeroGasEIP2028 {
	// 		return nil, gas, ErrOutOfGas
	// 	}
	// 	gas -= uint64(len(input)) * params.TxDataNonZeroGasEIP2028
	// }
	ret, gasLeft, err := evm.Call(caller, addr, input, gas, value)
	return ret, gasLeft, err
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.Context.StateDB == nil {
		return nil, gas, ErrNoStateDB
	}
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if !evm.Context.CanTransfer(caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}
	var (
		to       = NewContract(caller, AccountRef(addr), value, gas)
		snapshot = evm.StateDB.Snapshot()
	)
	// Even on a zero-value transfer, the notion of 'touched' may be relevant,
	// so we need to track it, and in case of an error, we need to roll it back.
	if !evm.Context.StateDB.Exist(addr) && value.Sign() == 0 {
		if !evm.chainRules.IsEIP158 {
			evm.StateDB.CreateAccount(addr)
		}
	}
	// In case of an error, revert the changes.
	// It's important to do this only *after* the transfer is done,
	// so that the callee has the funds available to spend.
	// But it's also important that if the call fails, the transfer is reverted.
	evm.Context.Transfer(caller.Address(), to.Address(), value)

	// In case of an error, revert the changes.
	// It's important to do this only *after* the transfer is done,
	// so that the callee has the funds available to spend.
	// But it's also important that if the call fails, the transfer is reverted.
	defer func() {
		if err != nil {
			evm.StateDB.RevertToSnapshot(snapshot)
		}
	}()
	// Initialise a new interpreter and execute the contract code
	interpreter := evm.newInterpreter()
	ret, err = interpreter.Run(to, input, false)

	// When the interpreter returns, we want to clear the return data, whether is errored
	// or not.
	evm.interpreter.returnData = nil
	interpreterPool.Put(interpreter)

	// If the execution failed, all gas is consumed.
	if err != nil {
		return nil, 0, err
	}
	return ret, to.Gas(), err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Can't create a contract above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	// Create a new account with the specified code
	contractAddr = crypto.CreateAddress(caller.Address(), evm.StateDB.GetNonce(caller.Address()))
	contractHash := evm.StateDB.GetCodeHash(contractAddr)
	if evm.StateDB.GetNonce(contractAddr) != 0 || (contractHash != (common.Hash{}) && contractHash != emptyCodeHash) {
		return nil, common.Address{}, 0, ErrContractAddressCollision
	}
	// In case of an error, revert the nonce change
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.SetNonce(caller.Address(), evm.StateDB.GetNonce(caller.Address())+1)
	evm.StateDB.CreateAccount(contractAddr)

	defer func() {
		if err != nil {
			evm.StateDB.RevertToSnapshot(snapshot)
		}
	}()
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1)
	}

	evm.Context.Transfer(caller.Address(), contractAddr, value)

	// Initialise a new interpreter and execute the contract code
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.Code = code

	interpreter := evm.newInterpreter()
	ret, err = interpreter.Run(contract, nil, true)
	// When the interpreter returns, we want to clear the return data, whether is errored
	// or not.
	evm.interpreter.returnData = nil
	interpreterPool.Put(interpreter)

	// Check whether the max code size is exceeded, assign err if the case
	if err == nil && len(ret) > evm.interpreter.maxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}

	// If the contract creation ran out of gas, revert all state changes.
	// This includes the nonce increment and value transfer.
	if err == ErrOutOfGas {
		evm.StateDB.RevertToSnapshot(snapshot)
		return nil, common.Address{}, 0, ErrOutOfGas
	}
	// Finalise the created contract. If the code is empty, it means the contract is a suicide,
	// no code should be persisted.
	if err == nil && len(ret) > 0 {
		evm.StateDB.SetCode(contractAddr, ret)
	}
	return ret, contractAddr, contract.Gas(), err
}

// Create2 creates a new contract using code as deployment code.
//
// The different between Create2 and Create is Create2 uses sha3(0xff + sender_address + salt + code_hash) instead of the
// usual sender-and-nonce-hash as the address where the contract is initialized at.
func (evm *EVM) Create2(caller ContractRef, code []byte, gas uint64, endowment *big.Int, salt *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Can't create a contract above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	// Create a new account with the specified code
	codeHash := crypto.Keccak256Hash(code)
	contractAddr = crypto.CreateAddress2(caller.Address(), salt, codeHash.Bytes())
	// ... (similar logic to Create, using an interpreter from the pool) ...
	// ...
	interpreter := evm.newInterpreter()
	ret, err = interpreter.Run(contract, nil, true)
	// When the interpreter returns, we want to clear the return data, whether is errored
	// or not.
	evm.interpreter.returnData = nil
	interpreterPool.Put(interpreter)
	// ...
	return ret, contractAddr, contract.Gas(), err
}
```

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// core/vm/interpreter.go

// Interpreter is an EVM interpreter for use with the EVM object.
type Interpreter struct {
	evm *EVM

	stack *Stack   // Operand stack
	mem   *Memory  // EVM memory
	pc    uint64   // Program counter
	gas   uint64   // Gas left
	depth int      // Call depth
	read  readOnly // Readonly indicator, true if we're in a STATICCALL context

	contract *Contract // The contract currently being executed

	callStack  callStack  // Call stack, with the executing contract on top
	returnData []byte     // Last call's return data for subsequent reuse

	// maxCodeSize is the maximum code size allowed.
	// The value is defined by EIP-170 and EIP-3860.
	maxCodeSize int
}

// NewInterpreter returns a new interpreter for executing EVM code.
func NewInterpreter(evm *EVM, cfg Config) *Interpreter {
	var maxCodeSize int
	// ... (logic to set maxCodeSize based on hardfork) ...

	return &Interpreter{
		evm:         evm,
		maxCodeSize: maxCodeSize,
	}
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
    // ...
    // There's no need to save the interpreter state on the run method, the `evm` object
    // is always a new one, created in the `Call` frame.
	// ...

	in.evm.depth++ // EIP-150: Increase depth before executing, & decrease when not executing
	defer func() {
		in.evm.depth--
	}()

    // ... (rest of the run loop) ...
}


// reset is used to clear an interpreter for reuse.
func (in *Interpreter) reset() {
	in.pc = 0
	in.gas = 0
	in.callStack = callStack{}
	in.mem.Resize(0)
	in.stack = newstack()
	in.returnData = nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// core/vm/stack.go

// callStack: a stack of frames
type callStack struct {
	data []*frame
}

func newcallstack() *callStack {
	return &callStack{}
}

func (s *callStack) push(f *frame) {
	s.data = append(s.data, f)
}

func (s *callStack) pop() {
	s.data = s.data[:len(s.data)-1]
}

func (s *callStack) back() *frame {
	if len(s.data) > 0 {
		return s.data[len(s.data)-1]
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// core/vm/instructions.go

// opCall is the internal implementation of the CALL opcode.
func opCall(pc *uint64, interpreter *Interpreter) ([]byte, error) {
	// ... (stack popping logic to get gas, addr, value, args, etc.) ...
	
	// Get a new interpreter from the pool and try to execute the call
	ret, _, err := interpreter.evm.Call(interpreter.contract, addr, args, gas, value)
	if err != nil {
		// ...
		return nil, err
	}
	interpreter.returnData = ret
	stack.push(retSuccess)
	return nil, nil
}

// opCreate is the internal implementation of the CREATE opcode.
func opCreate(pc *uint64, interpreter *Interpreter) ([]byte, error) {
	// ... (stack popping logic) ...
	
	// Create the new contract
	contractAddr, _, err := interpreter.evm.Create(interpreter.contract, initCode, gas, value)
	if err != nil {
		// ...
		return nil, err
	}
	stack.push(contractAddr.Address().toWord())
	return nil, nil
}

// opDelegateCall is the internal implementation of the DELEGATECALL opcode.
func opDelegateCall(pc *uint64, interpreter *Interpreter) ([]byte, error) {
	// ... (stack popping logic) ...

	ret, _, err := interpreter.evm.DelegateCall(interpreter.contract, addr, args, gas)
	if err != nil {
		//...
		return nil, err
	}
	interpreter.returnData = ret
	stack.push(retSuccess)
	return nil, nil
}

// opStaticCall is the internal implementation of the STATICCALL opcode.
func opStaticCall(pc *uint64, interpreter *Interpreter) ([]byte, error) {
	// ... (stack popping logic) ...

	ret, _, err := interpreter.evm.StaticCall(interpreter.contract, addr, args, gas)
	if err != nil {
		// ...
		return nil, err
	}
	interpreter.returnData = ret
	stack.push(retSuccess)
	return nil, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections

Your prompt outlines a very comprehensive and advanced pooling system. The Go-ethereum implementation provides a simpler but effective real-world example of this pattern. Here are a few points of comparison and potential adjustments to your prompt's specification based on `geth`:

1.  **Pooled Object**: In `geth`, the object being pooled is the `Interpreter`, which encapsulates the *entire* execution state (stack, memory, pc, gas, program, etc.). This is a direct parallel to your `PooledFrame`. The key takeaway is that pooling the entire interpreter/frame context is a viable and performant strategy.

2.  **Pool Management**: `geth` uses Go's built-in `sync.Pool`, which is a single, concurrency-safe pool. Your specification for `FramePoolManager` with different size classes, auto-tuning, and explicit GC integration is more sophisticated. While the `geth` model is simpler, it delegates much of the memory management and sizing logic to the Go runtime's garbage collector, which is also a valid design choice. You could consider if `sync.Pool`'s behavior is sufficient or if the custom manager is truly needed for your use case.

3.  **Frame Hierarchy (`parent`/`children`)**: Your `PooledFrame` tracks its position in the call stack via `parent` and `children` pointers. In contrast, `geth`'s `Interpreter` uses an explicit `callStack` data structure to manage the hierarchy of frames. This is an alternative implementation pattern that avoids direct pointers between pooled objects, which can sometimes simplify reset logic and reduce the chance of memory leaks if a child is not properly released.

4.  **Acquire/Release Lifecycle**: The `EVM.Call` and `EVM.Create` methods in `geth` are perfect real-world examples of the acquire-use-release pattern. An interpreter is retrieved from the pool, used for the sub-call, and then put back into the pool. This is a critical pattern to replicate for correctness and efficiency. Note that `geth` does not use `defer` for returning the interpreter to the pool, but handles it explicitly at the end of the function, which is also a valid approach.

The provided `geth` snippets offer a robust, minimalist reference for the core pooling mechanism. Your proposed design builds upon this with more advanced features like auto-tuning and size classes, which would be excellent additions.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// framePool holds reusable frame objects
var framePool = sync.Pool{
	New: func() interface{} {
		return new(frame)
	},
}

// newFrame returns a new frame from the pool and initializes it
func newFrame(stk *stack, mem *Memory, contract *Contract, input []byte, gas uint64, returnDataPool *ReturnDataPool) *frame {
	f := framePool.Get().(*frame)
	f.stk = stk
	f.mem = mem
	f.contract = contract
	f.input = input
	f.gas = gas
	f.returnDataPool = returnDataPool
	return f
}

// returnFrame returns a frame to the pool.
//
// After a frame is returned no-one should be holding a reference to it.
func returnFrame(f *frame) {
	f.reset()
	framePool.Put(f)
}

// frame is a frame in the call stack.
type frame struct {
	// call data
	input []byte
	gas   uint64
	// contract data
	contract *Contract
	// interpreter data
	pc             uint64
	stk            *stack
	mem            *Memory
	rdat           []byte
	returnDataPool *ReturnDataPool
	// error
	err error
	// return gas
	gasUsed uint64
}

// reset resets the frame to its defaults.
func (f *frame) reset() {
	f.input = nil
	f.gas = 0
	f.contract = nil
	f.pc = 0
	f.stk.reset()
	f.mem.Resize(0)
	f.rdat = nil
	f.returnDataPool = nil
	f.err = nil
	f.gasUsed = 0
}

// Call executes a message call transaction and returns the execution output and
// remaining gas.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	evm.depth++
	defer func() { evm.depth-- }()

	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(evm.chainRules.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.Context.IsStatic && value.Sign() != 0 {
		return nil, gas, ErrWriteProtection
	}

	// Capture the tracer start/end events in case of a subcall
	if evm.vm.Config.Tracer != nil {
		evm.vm.Config.Tracer.CaptureEnter(vm.CALL, caller.Address(), addr, input, gas, value)
		defer func() {
			evm.vm.Config.Tracer.CaptureExit(ret, gas-leftOverGas, err)
		}()
	}
	ret, leftOverGas, err = evm.call(caller, addr, input, gas, value)
	return
}

// call executes a new message call and returns the results.
func (evm *EVM) call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// Reset the previous error.
	evm.err = nil

	// check if the destination address is a precompiled contract.
	if evm.precompile(addr) {
		p := evm.precompiles[addr]
		ret, gas, err = RunPrecompiledContract(p, input, gas)
		return ret, gas, err
	}
	// ensure the destination is a contract
	code := evm.StateDB.GetCode(addr)
	if len(code) == 0 {
		return nil, gas, nil
	}
	// Create the contract object.
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, crypto.Keccak256Hash(code), code)

	// Create a new frame for the call.
	// The stack and memory are passed but retained by the caller.
	// This allows the sub-call to use its caller's stack and memory
	// and changes within the sub-call to be reflected in the caller's
	// scope.
	f := newFrame(evm.interpreter.Stack(), evm.interpreter.Memory(), contract, input, gas, evm.interpreter.ReturnDataPool())
	defer returnFrame(f)

	// Don't have to worry about the call depth, just execute the call.
	// The return data of the call is held by the frame.
	evm.interpreter.Run(contract, f.input, false)

	return f.rdat, f.gas, f.err
}

// create executes a new contract creation transaction and returns the contract
// address, the execution output and remaining gas.
func (evm *EVM) create(caller ContractRef, code []byte, gas uint64, value *big.Int, address common.Address) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Reset the previous error.
	evm.err = nil

	// Create a new frame for the call.
	contract := NewContract(caller, AccountRef(address), value, gas)
	contract.Code = code

	// The stack and memory are passed but retained by the caller.
	// This allows the sub-call to use its caller's stack and memory
	// and changes within the sub-call to be reflected in the caller's
	// scope.
	f := newFrame(evm.interpreter.Stack(), evm.interpreter.Memory(), contract, code, gas, evm.interpreter.ReturnDataPool())
	defer returnFrame(f)

	// Don't have to worry about the call depth, just execute the call.
	// The return data of the call is held by the frame.
	if evm.vm.Config.Tracer != nil {
		evm.vm.Config.Tracer.CaptureEnter(vm.CREATE, caller.Address(), address, code, gas, value)
	}
	// Run the interpreter
	evm.interpreter.Run(contract, f.input, true)

	// Check whether the max code size restriction is violated.
	if contract.Err == nil && evm.chainRules.IsEIP170 && len(f.rdat) > params.MaxCodeSize {
		contract.Err = ErrMaxCodeSizeExceeded
	}
	// if the contract creation ran out of gas, we need to consume any gas
	// that was should have been consumed in the constructor execution.
	if contract.Err == ErrExecutionReverted {
		// Note, f.gas is the amount of gas left after the constructor execution.
		// So the cost of execution is contract.Gas - f.gas.
		// We need to deduct that from the caller.
		gas = gas - (contract.Gas - f.gas)
	}
	if contract.Err != nil {
		if evm.vm.Config.Tracer != nil {
			evm.vm.Config.Tracer.CaptureExit(f.rdat, gas-f.gas, contract.Err)
		}
		return nil, common.Address{}, gas, contract.Err
	}
	// Finalise the created contract.
	gas = f.gas
	if err := evm.finalise(contract, f.rdat, &gas); err != nil {
		if evm.vm.Config.Tracer != nil {
			evm.vm.Config.Tracer.CaptureExit(f.rdat, gas, err)
		}
		return nil, address, gas, err
	}
	// The contract creation was successful. The remaining gas is the amount
	// of gas left after the constructor execution plus the gas stipend for
	// the data storage fee.
	if evm.vm.Config.Tracer != nil {
		evm.vm.Config.Tracer.CaptureExit(f.rdat, gas, nil)
	}
	return contract.Code, address, contract.Gas, contract.Err
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// Contract represents an ethereum contract in the state machine.
type Contract struct {
	// CallerAddress is the result of the CALLER opcode.
	// This is the address of the contract that initiated the current execution.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	analysis  bitvec       // bitvec of valid jump destinations

	Code     []byte
	CodeHash common.Hash
	CodeAddr *common.Address
	Input    []byte

	value *big.Int
	Gas   uint64

	// contractPool is the contract pool to be used by this contract and any
	// sub-calls made by this contract.
	contractPool *ContractPool
}

// NewContract returns a new contract environment for the execution of EVM bytecode.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	var c *Contract
	if inst, ok := caller.(interface{ contractPool() *ContractPool }); ok {
		// an existing contract is making a subcall.
		// note: the returned contract is not associated with the pool yet
		// until it's returned.
		c = inst.contractPool().acquire()
	} else {
		// toplevel call, not from a contract
		c = new(Contract)
	}

	c.caller = caller
	c.CallerAddress = caller.Address()
	c.self = object
	c.value = value
	c.Gas = gas
	if pool, ok := caller.(interface {
		contractPool() *ContractPool
	}); ok {
		c.contractPool = pool.contractPool()
	} else {
		c.contractPool = NewContractPool()
	}
	return c
}
//...
// ContractPool is a pool of contracts objects that can be reused to avoid
// allocations.
type ContractPool struct {
	pool *sync.Pool
}

// NewContractPool creates a new contract pool.
func NewContractPool() *ContractPool {
	return &ContractPool{pool: new(sync.Pool)}
}

// acquire returns a contract from the pool.
func (p *ContractPool) acquire() *Contract {
	c := p.pool.Get()
	if c == nil {
		return new(Contract)
	}
	return c.(*Contract)
}

// release adds a contract to the pool.
func (p *ContractPool) release(c *Contract) {
	p.pool.Put(c)
}

```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt specifies a highly advanced pooling system with features like automatic pool tuning, multiple size classes, and explicit garbage collection integration. 

The `go-ethereum` implementation is significantly simpler and serves as a good reference for a baseline implementation:

1.  **Single Pool for Frames**: Go-ethereum uses a single `sync.Pool` named `framePool` for all execution frames (`frame` struct). It does not use different pools for different sizes or types of calls.
2.  **No Automatic Tuning**: The pool size is managed automatically by Go's `sync.Pool`, which is sensitive to garbage collection cycles. There is no explicit logic for expanding or shrinking the pool based on hit/miss rates as detailed in the prompt's `auto_tune_pools` specification.
3.  **Frame Object**: The object being pooled is an internal `frame` struct which encapsulates the execution context (stack, memory, pc, contract reference, etc.), not just the `Contract` object itself. This is very similar to the proposed `PooledFrame` in the Zig implementation.
4.  **Contract Object Pooling**: Go-ethereum also employs a *second* pool for `Contract` objects (`ContractPool`), which are part of the `frame`. This is a nested pooling strategy that might be relevant for further memory optimization.
5.  **No Complex Statistics**: There is no built-in `PoolStatistics` or `AllocationTracker` framework. Performance is monitored through general metrics rather than a dedicated pool management system.

The provided `go-ethereum` snippets show a lean, effective implementation that relies on Go's standard library for pooling, which could be a valuable starting point before implementing the more complex features outlined in the prompt.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// execution error.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute above the legacy gas limit
	if gas > evm.gaslimit {
		return nil, gas, errGasLimitReached
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
		precompiles := PrecompiledContractsCleanRoom
		if evm.chainRules.IsBerlin {
			precompiles = PrecompiledContractsBerlin
		}
		if precompiles[addr] == nil && evm.chainRules.IsEIP158(evm.Context.BlockNumber) && value.Sign() == 0 {
			// Calling a non existing account, don't do anything, but ping the tracer
			if evm.CanDebug() {
				evm.CaptureState(pc, CALL, gas, 0, memory, stack, contract, evm.depth, ErrExecutionReverted)
			}
			return nil, gas, nil
		}
		evm.StateDB.CreateAccount(addr)
	}
	evm.Context.Transfer(evm.StateDB, caller.Address(), to.Address(), value)

	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution context
	// only.
	code, codeHash := evm.StateDB.GetCode(addr), evm.StateDB.GetCodeHash(addr)

	// Even if the account has no code, we need to continue because it might be a precompile
	contract := NewContract(caller, to, value, gas)
	contract.SetCallCode(&addr, codeHash, code)

	// If the destination has no code and no precompile is available, return
	if len(code) == 0 {
		precompiles := evm.interpreter.precompiles
		if precompiles.Get(addr) == nil {
			return nil, gas, nil
		}
	}
	// If the endowment brings the balance of the new account over zero, the debitor
	// might be rebound, so we need to check again.
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		evm.StateDB.RevertToSnapshot(snapshot)
		return nil, gas, ErrInsufficientBalance
	}

	start := time.Now()
	ret, err = evm.interpreter.Run(contract, input, false)

	// When the interpreter returns, the gas is consumed and the state is reverted
	// in case of an error.
	leftOverGas = contract.Gas

	if evm.vmMetrics != nil {
		evm.vmMetrics.Call(time.Since(start), err)
	}
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
	}
	return ret, leftOverGas, err
}

// Create creates a new contract using the data passed as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (depth and gas checks) ...

	// Ensure the contract address is correct
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)

	// ... (collision checks) ...
	
	// Create a new contract so that the caller's state is not altered
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr)
	if evm.chainRules.IsEIP158(evm.Context.BlockNumber) {
		evm.StateDB.SetNonce(contractAddr, 1)
	}
	evm.Context.Transfer(evm.StateDB, caller.Address(), contractAddr, value)

	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution context
	// only.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCodeOptionalHash(&contractAddr, &codeAndHash{code: code})
	
	// ... (interpreter run and deployment cost logic) ...

	return ret, contractAddr, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contract.go">
```go
// ContractRef is an interface for basic contract type introspection.
type ContractRef interface {
	Address() common.Address
}

// AccountRef implements ContractRef.
//
// It's a reference to the account, and not the account itself to make it possible
// to cached flattened accounts in the stateDB.
type AccountRef common.Address

// Address returns the address of the contract.
func (ar AccountRef) Address() common.Address {
	return (common.Address)(ar)
}

// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the caller stack.
	//
	// N.B. This should be renamed to 'caller'.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	code      []byte
	codeHash  common.Hash
	input     []byte

	value *big.Int
	Gas   uint64

	// contract Code and CodeHash should be readonly.
	// They're stored here for caching purposes.
	codeAndHash *codeAndHash
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{
		caller:        caller,
		self:          object,
		value:         value,
		Gas:           gas,
		CallerAddress: caller.Address(),
	}
	// Check whether the caller is a contract or a "precompiled"
	// implementation of a contract.
	if c, ok := caller.(*Contract); ok {
		// The caller is a contract, and we need to pass on the context call
		// address.
		c.CallerAddress = c.CallerAddress
	}
	return c
}

// AsDelegate creates a new contract with the caller as the recipient of the
// code but the contract itself as the execution scope.
func (c *Contract) AsDelegate() *Contract {
	// NOTE: The constructor is not used here because it would set the caller
	// to the contract code's caller.
	return &Contract{
		caller:        c.caller,
		self:          c.self,
		value:         c.value,
		Gas:           c.Gas,
		CallerAddress: c.CallerAddress,
	}
}

// GetOp returns the n'th element in the contract's byte code.
func (c *Contract) GetOp(n uint64) OpCode {
	if n < uint64(len(c.code)) {
		return OpCode(c.code[n])
	}
	return STOP
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
```go
// intPool is a pool of big integers to be used by the interpreter.
type intPool struct {
	pool *sync.Pool
}

// newIntPool creates a new big integer pool.
func newIntPool() *intPool {
	return &intPool{pool: new(sync.Pool)}
}

// get returns a big integer from the pool.
func (p *intPool) get() *big.Int {
	if v := p.pool.Get(); v != nil {
		return v.(*big.Int)
	}
	return new(big.Int)
}

// getZ returns a big integer from the pool, zero-ed.
func (p *intPool) getZ() *big.Int {
	if v := p.pool.Get(); v != nil {
		return v.(*big.Int).SetInt64(0)
	}
	return new(big.Int)
}

// put returns a big integer to the pool.
func (p *intPool) put(is ...*big.Int) {
	for _, i := range is {
		p.pool.Put(i)
	}
}

// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm *EVM
	cfg Config

	hasher    crypto.KeccakState // Keccak256 hasher instance for the SHA3 opcode
	hasherBuf common.Hash        // Keccak256 hasher buffer for the SHA3 opcode

	readOnly   bool   // whether to throw on state modifying opcodes
	returnData []byte // last CALL's return data for subsequent reuse

	pool *intPool // big integer pool
}

// ...

// Run loops and executes the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() {
		in.evm.depth--
	}()

	// Make sure the readOnly is only set if we aren't in readOnly yet.
	// This makes sure that the readOnly flag is sticky, and prevents a read-only
	// call from being executed as a read-write call.
	if readOnly && !in.readOnly {
		in.readOnly = true
		defer func() { in.readOnly = false }()
	}

	// Reset the previous call's return data. It's important to do this immediately
	// in order to prevent obtaining stale data from a deeply nested call.
	in.returnData = nil

	// Don't bother with the execution if the contract is empty
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallCtx()

		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go beyond 2^64. The YP defines the PC
		// to be uint256. Practically, this will not be a problem.
		pc   = uint64(0) // program counter
		gas  = contract.Gas
		cost uint64
		// copies used by tracer
		pcCopy  uint64
		gasCopy uint64
		// in.pool is the *intPool
		intbuf = make([]*big.Int, 0, 16)
	)
	// Don't pool memory and stack during debug tracing.
	if !in.cfg.Debug {
		defer func() {
			in.pool.put(stack.data...)
			in.pool.put(intbuf...)
			returnPool(mem)
		}()
	}
	contract.Input = input

	// The Interpreter main run loop. This loop will continue until execution of
	// the contract is completed or an error is returned.
	for {
		// ...
		// Get next opcode
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]

		// ... (stack validation) ...

		// Static portion of gas
		cost = operation.constantGas
		if err := contract.UseGas(cost); err != nil {
			return nil, err
		}

		// ... (dynamic gas calculation) ...

		// Execute the operation
		err = operation.execute(&pc, in, contract, mem, stack)
		
		// ... (error handling and loop termination) ...
	}
	return
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/jump.go">
```go
func opCall(pc *uint64, i *EVMInterpreter, contract *Contract, memory *Memory, stack *stack) error {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	gas, to, value, inoffset, inlen, retoffset, retlen := stack.pop7()
	// ...

	// Get the arguments from buffer
	args := memory.GetPtr(int64(inoffset.Uint64()), int64(inlen.Uint64()))

	// Ensure that gas is not negative and that there's enough gas left for the call.
	if gas.BitLen() > 64 {
		return ErrGasUintOverflow
	}
	var (
		gasUint = gas.Uint64()
		err     error
	)
	// ... (gas calculation) ...
	
	// Call the contract
	ret, returnGas, err := i.evm.Call(contract, to.Address(), args, gasUint, value)
	
	// ... (handle results, push to stack, manage memory and return data) ...

	return nil
}

func opCreate(pc *uint64, i *EVMInterpreter, contract *Contract, memory *Memory, stack *stack) error {
	// Pop value, offset and size from the stack
	value, offset, size := stack.pop3()
	// ...

	// Get the code from memory
	code := memory.GetPtr(int64(offset.Uint64()), int64(size.Uint64()))
	
	// ... (gas calculation) ...
	
	// Call the contract
	_, address, returnGas, err := i.evm.Create(contract, code, gas, value)
	
	// ... (handle results and push to stack) ...

	return nil
}

func opCreate2(pc *uint64, i *EVMInterpreter, contract *Contract, memory *Memory, stack *stack) error {
	// Pop value, offset, size and salt from the stack
	value, offset, size, salt := stack.pop4()
	// ...
	
	// Get the code from memory
	code := memory.GetPtr(int64(offset.Uint64()), int64(size.Uint64()))

	// ... (gas calculation) ...
	
	// Call the contract
	_, address, returnGas, err := i.evm.Create2(contract, code, gas, salt.Uint64(), value)

	// ... (handle results and push to stack) ...
	
	return nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt specifies a `PooledFrame` with fields like `stack`, `memory`, and `gas`. In go-ethereum, these are not part of the `Contract` (frame) object itself. Instead, the `stack` and `memory` are created as local variables within the `EVMInterpreter.Run` method for each execution. The `gas` is passed into the `Contract` but is also managed locally within `Run`.

This is a key architectural difference. The Geth approach keeps the `Contract` object lightweight, holding only the essential *context* (caller, address, value, input, code). The Zig implementation in the prompt proposes a more monolithic `PooledFrame` that contains the execution state as well.

This distinction is important. The provided go-ethereum snippets show:
1.  The `Contract` struct is the "frame context" object that would be pooled.
2.  The `Run` method in `EVMInterpreter` is where the per-call `stack` and `memory` are allocated. A pooled implementation would instead get these from the pooled frame object.
3.  The `defer in.pool.put(stack.data...)` pattern shows how Geth returns pooled `big.Int` objects at the end of the `Run` scope, which is analogous to how a pooled frame would be released.

Therefore, when implementing the `PooledFrame` in Zig, it's useful to understand that in Geth, the `stack` and `memory` are managed by the interpreter loop, not inside the `Contract` object itself. The proposed `PooledFrame` combines both concepts. This is a valid design choice, but the Geth code provides a clear separation of concerns that is valuable for context.

