# Implement Memory Allocator Tuning

You are implementing Memory Allocator Tuning for the Tevm EVM written in Zig. Your goal is to implement optimized memory allocator for EVM operations following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_memory_allocator_tuning` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_memory_allocator_tuning feat_implement_memory_allocator_tuning`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement memory allocator tuning optimizations to improve memory allocation patterns, reduce fragmentation, and optimize performance for EVM-specific workloads. This includes custom allocators for different memory usage patterns, pool allocation for frequently used objects, and memory layout optimizations.

## ELI5

Think of memory allocation like organizing a warehouse. A basic warehouse just puts items wherever there's space, which can lead to wasted space and slow retrieval. Memory allocator tuning is like hiring a professional warehouse manager who:

**Reduces Fragmentation**: Instead of leaving small gaps everywhere (like having tiny unusable spaces between boxes), the enhanced allocator groups similar-sized items together and keeps larger spaces available for bigger items.

**Pool Allocation**: Like having dedicated sections for frequently used items (imagine keeping all the popular products near the loading dock), this creates special memory pools for objects that are created and destroyed often, making access much faster.

**Smart Patterns**: The EVM has predictable patterns - like how contracts often need similar types of storage. This enhanced system recognizes these patterns and pre-allocates memory in the most efficient way, like setting up assembly lines for common operations.

**Layout Optimization**: Like organizing a library where related books are shelved together, this system arranges memory so that data that's often accessed together is stored close to each other, reducing the time spent "walking around the warehouse."

Why does this matter? Faster memory access means faster smart contract execution, lower gas costs, and better overall blockchain performance. It's the difference between a chaotic warehouse and a well-oiled distribution center.

## Memory Allocator Tuning Specifications

### Core Allocator Framework

#### 1. Custom EVM Allocator
```zig
pub const EVMAllocator = struct {
    backing_allocator: std.mem.Allocator,
    arena_allocator: std.heap.ArenaAllocator,
    pool_allocators: PoolAllocators,
    frame_allocator: FrameAllocator,
    statistics: AllocationStatistics,
    config: AllocatorConfig,
    
    pub const AllocatorConfig = struct {
        enable_pool_allocation: bool,
        enable_arena_allocation: bool,
        enable_frame_allocation: bool,
        enable_statistics: bool,
        pool_preallocation_size: usize,
        arena_size: usize,
        frame_pool_size: usize,
        alignment_optimization: bool,
        
        pub fn optimized() AllocatorConfig {
            return AllocatorConfig{
                .enable_pool_allocation = true,
                .enable_arena_allocation = true,
                .enable_frame_allocation = true,
                .enable_statistics = true,
                .pool_preallocation_size = 64 * 1024,      // 64KB
                .arena_size = 1024 * 1024,                 // 1MB
                .frame_pool_size = 256,                    // 256 frames
                .alignment_optimization = true,
            };
        }
        
        pub fn minimal() AllocatorConfig {
            return AllocatorConfig{
                .enable_pool_allocation = false,
                .enable_arena_allocation = false,
                .enable_frame_allocation = false,
                .enable_statistics = false,
                .pool_preallocation_size = 0,
                .arena_size = 0,
                .frame_pool_size = 0,
                .alignment_optimization = false,
            };
        }
    };
    
    pub fn init(backing_allocator: std.mem.Allocator, config: AllocatorConfig) EVMAllocator {
        return EVMAllocator{
            .backing_allocator = backing_allocator,
            .arena_allocator = std.heap.ArenaAllocator.init(backing_allocator),
            .pool_allocators = PoolAllocators.init(backing_allocator, config),
            .frame_allocator = FrameAllocator.init(backing_allocator, config.frame_pool_size),
            .statistics = AllocationStatistics.init(),
            .config = config,
        };
    }
    
    pub fn deinit(self: *EVMAllocator) void {
        self.arena_allocator.deinit();
        self.pool_allocators.deinit();
        self.frame_allocator.deinit();
    }
    
    pub fn allocator(self: *EVMAllocator) std.mem.Allocator {
        return std.mem.Allocator{
            .ptr = self,
            .vtable = &.{
                .alloc = alloc,
                .resize = resize,
                .free = free,
            },
        };
    }
    
    fn alloc(ctx: *anyopaque, len: usize, ptr_align: u8, ret_addr: usize) ?[*]u8 {
        const self = @ptrCast(*EVMAllocator, @alignCast(@alignOf(EVMAllocator), ctx));
        _ = ret_addr;
        
        if (self.config.enable_statistics) {
            self.statistics.record_allocation(len, ptr_align);
        }
        
        // Try pool allocation first for common sizes
        if (self.config.enable_pool_allocation) {
            if (self.pool_allocators.try_alloc(len, ptr_align)) |ptr| {
                return ptr;
            }
        }
        
        // Try arena allocation for temporary allocations
        if (self.config.enable_arena_allocation and len < 1024) {
            if (self.arena_allocator.allocator().rawAlloc(len, ptr_align, ret_addr)) |ptr| {
                return ptr;
            }
        }
        
        // Fall back to backing allocator
        return self.backing_allocator.rawAlloc(len, ptr_align, ret_addr);
    }
    
    fn resize(ctx: *anyopaque, buf: []u8, buf_align: u8, new_len: usize, ret_addr: usize) bool {
        const self = @ptrCast(*EVMAllocator, @alignCast(@alignOf(EVMAllocator), ctx));
        _ = ret_addr;
        
        if (self.config.enable_statistics) {
            self.statistics.record_resize(buf.len, new_len);
        }
        
        // Try pool resize first
        if (self.config.enable_pool_allocation) {
            if (self.pool_allocators.try_resize(buf, buf_align, new_len)) {
                return true;
            }
        }
        
        // Fall back to backing allocator
        return self.backing_allocator.rawResize(buf, buf_align, new_len, ret_addr);
    }
    
    fn free(ctx: *anyopaque, buf: []u8, buf_align: u8, ret_addr: usize) void {
        const self = @ptrCast(*EVMAllocator, @alignCast(@alignOf(EVMAllocator), ctx));
        _ = ret_addr;
        
        if (self.config.enable_statistics) {
            self.statistics.record_deallocation(buf.len);
        }
        
        // Try pool deallocation first
        if (self.config.enable_pool_allocation) {
            if (self.pool_allocators.try_free(buf, buf_align)) {
                return;
            }
        }
        
        // Check if it's from arena (arena deallocations are no-ops)
        if (self.config.enable_arena_allocation) {
            if (self.arena_allocator.owns(buf.ptr)) {
                return;
            }
        }
        
        // Fall back to backing allocator
        self.backing_allocator.rawFree(buf, buf_align, ret_addr);
    }
    
    pub fn reset_arena(self: *EVMAllocator) void {
        if (self.config.enable_arena_allocation) {
            _ = self.arena_allocator.reset(.retain_capacity);
        }
    }
    
    pub fn get_statistics(self: *const EVMAllocator) AllocationStatistics {
        return self.statistics;
    }
};
```

#### 2. Pool Allocators for Common Objects
```zig
pub const PoolAllocators = struct {
    u256_pool: ObjectPool(U256),
    hash_pool: ObjectPool(Hash),
    address_pool: ObjectPool(Address),
    frame_pool: ObjectPool(Frame),
    small_buffer_pool: BufferPool(256),    // 256 bytes
    medium_buffer_pool: BufferPool(1024),  // 1KB
    large_buffer_pool: BufferPool(4096),   // 4KB
    
    pub fn init(allocator: std.mem.Allocator, config: EVMAllocator.AllocatorConfig) PoolAllocators {
        const pool_size = config.pool_preallocation_size / 8; // Distribute among pools
        
        return PoolAllocators{
            .u256_pool = ObjectPool(U256).init(allocator, pool_size / @sizeOf(U256)),
            .hash_pool = ObjectPool(Hash).init(allocator, pool_size / @sizeOf(Hash)),
            .address_pool = ObjectPool(Address).init(allocator, pool_size / @sizeOf(Address)),
            .frame_pool = ObjectPool(Frame).init(allocator, 64), // Fixed size for frames
            .small_buffer_pool = BufferPool(256).init(allocator, pool_size / 256),
            .medium_buffer_pool = BufferPool(1024).init(allocator, pool_size / 1024),
            .large_buffer_pool = BufferPool(4096).init(allocator, pool_size / 4096),
        };
    }
    
    pub fn deinit(self: *PoolAllocators) void {
        self.u256_pool.deinit();
        self.hash_pool.deinit();
        self.address_pool.deinit();
        self.frame_pool.deinit();
        self.small_buffer_pool.deinit();
        self.medium_buffer_pool.deinit();
        self.large_buffer_pool.deinit();
    }
    
    pub fn try_alloc(self: *PoolAllocators, len: usize, ptr_align: u8) ?[*]u8 {
        _ = ptr_align;
        
        // Route to appropriate pool based on size
        return switch (len) {
            @sizeOf(U256) => @ptrCast([*]u8, self.u256_pool.acquire()),
            @sizeOf(Hash) => @ptrCast([*]u8, self.hash_pool.acquire()),
            @sizeOf(Address) => @ptrCast([*]u8, self.address_pool.acquire()),
            @sizeOf(Frame) => @ptrCast([*]u8, self.frame_pool.acquire()),
            1...256 => @ptrCast([*]u8, self.small_buffer_pool.acquire()),
            257...1024 => @ptrCast([*]u8, self.medium_buffer_pool.acquire()),
            1025...4096 => @ptrCast([*]u8, self.large_buffer_pool.acquire()),
            else => null,
        };
    }
    
    pub fn try_resize(self: *PoolAllocators, buf: []u8, buf_align: u8, new_len: usize) bool {
        _ = self;
        _ = buf;
        _ = buf_align;
        _ = new_len;
        
        // Pool allocations are fixed size, so resizing is not supported
        return false;
    }
    
    pub fn try_free(self: *PoolAllocators, buf: []u8, buf_align: u8) bool {
        _ = buf_align;
        
        // Route to appropriate pool based on size
        switch (buf.len) {
            @sizeOf(U256) => {
                self.u256_pool.release(@ptrCast(*U256, buf.ptr));
                return true;
            },
            @sizeOf(Hash) => {
                self.hash_pool.release(@ptrCast(*Hash, buf.ptr));
                return true;
            },
            @sizeOf(Address) => {
                self.address_pool.release(@ptrCast(*Address, buf.ptr));
                return true;
            },
            @sizeOf(Frame) => {
                self.frame_pool.release(@ptrCast(*Frame, buf.ptr));
                return true;
            },
            1...256 => {
                self.small_buffer_pool.release(buf.ptr);
                return true;
            },
            257...1024 => {
                self.medium_buffer_pool.release(buf.ptr);
                return true;
            },
            1025...4096 => {
                self.large_buffer_pool.release(buf.ptr);
                return true;
            },
            else => return false,
        }
    }
};

pub fn ObjectPool(comptime T: type) type {
    return struct {
        const Self = @This();
        
        allocator: std.mem.Allocator,
        available: std.ArrayList(*T),
        allocated: std.ArrayList(*T),
        capacity: usize,
        
        pub fn init(allocator: std.mem.Allocator, initial_capacity: usize) Self {
            var pool = Self{
                .allocator = allocator,
                .available = std.ArrayList(*T).init(allocator),
                .allocated = std.ArrayList(*T).init(allocator),
                .capacity = initial_capacity,
            };
            
            // Pre-allocate objects
            pool.preallocate() catch {};
            
            return pool;
        }
        
        pub fn deinit(self: *Self) void {
            // Free all allocated objects
            for (self.allocated.items) |obj| {
                self.allocator.destroy(obj);
            }
            
            self.available.deinit();
            self.allocated.deinit();
        }
        
        fn preallocate(self: *Self) !void {
            for (0..self.capacity) |_| {
                const obj = try self.allocator.create(T);
                try self.available.append(obj);
                try self.allocated.append(obj);
            }
        }
        
        pub fn acquire(self: *Self) ?*T {
            if (self.available.items.len > 0) {
                return self.available.pop();
            }
            
            // Try to allocate a new object if pool is empty
            const obj = self.allocator.create(T) catch return null;
            self.allocated.append(obj) catch {
                self.allocator.destroy(obj);
                return null;
            };
            
            return obj;
        }
        
        pub fn release(self: *Self, obj: *T) void {
            // Clear the object (for security/cleanliness)
            obj.* = std.mem.zeroes(T);
            
            self.available.append(obj) catch {
                // If we can't add back to pool, just keep it allocated
                // This prevents memory leaks but reduces pool efficiency
            };
        }
        
        pub fn get_utilization(self: *const Self) f64 {
            const allocated_count = self.allocated.items.len;
            const available_count = self.available.items.len;
            const in_use = allocated_count - available_count;
            
            return if (allocated_count > 0)
                @as(f64, @floatFromInt(in_use)) / @as(f64, @floatFromInt(allocated_count))
            else
                0.0;
        }
    };
}

pub fn BufferPool(comptime size: usize) type {
    return struct {
        const Self = @This();
        const Buffer = [size]u8;
        
        allocator: std.mem.Allocator,
        available: std.ArrayList(*Buffer),
        allocated: std.ArrayList(*Buffer),
        capacity: usize,
        
        pub fn init(allocator: std.mem.Allocator, initial_capacity: usize) Self {
            var pool = Self{
                .allocator = allocator,
                .available = std.ArrayList(*Buffer).init(allocator),
                .allocated = std.ArrayList(*Buffer).init(allocator),
                .capacity = initial_capacity,
            };
            
            pool.preallocate() catch {};
            
            return pool;
        }
        
        pub fn deinit(self: *Self) void {
            for (self.allocated.items) |buffer| {
                self.allocator.destroy(buffer);
            }
            
            self.available.deinit();
            self.allocated.deinit();
        }
        
        fn preallocate(self: *Self) !void {
            for (0..self.capacity) |_| {
                const buffer = try self.allocator.create(Buffer);
                try self.available.append(buffer);
                try self.allocated.append(buffer);
            }
        }
        
        pub fn acquire(self: *Self) ?*anyopaque {
            if (self.available.items.len > 0) {
                return @ptrCast(*anyopaque, self.available.pop());
            }
            
            const buffer = self.allocator.create(Buffer) catch return null;
            self.allocated.append(buffer) catch {
                self.allocator.destroy(buffer);
                return null;
            };
            
            return @ptrCast(*anyopaque, buffer);
        }
        
        pub fn release(self: *Self, ptr: *anyopaque) void {
            const buffer = @ptrCast(*Buffer, @alignCast(@alignOf(Buffer), ptr));
            
            // Clear the buffer
            @memset(buffer, 0);
            
            self.available.append(buffer) catch {};
        }
    };
}
```

#### 3. Frame-Specific Allocator
```zig
pub const FrameAllocator = struct {
    allocator: std.mem.Allocator,
    frame_pool: ObjectPool(Frame),
    stack_pool: ObjectPool(Stack),
    memory_pool: ObjectPool(Memory),
    active_frames: std.ArrayList(*Frame),
    
    pub fn init(allocator: std.mem.Allocator, pool_size: usize) FrameAllocator {
        return FrameAllocator{
            .allocator = allocator,
            .frame_pool = ObjectPool(Frame).init(allocator, pool_size),
            .stack_pool = ObjectPool(Stack).init(allocator, pool_size),
            .memory_pool = ObjectPool(Memory).init(allocator, pool_size / 4), // Fewer memory objects
            .active_frames = std.ArrayList(*Frame).init(allocator),
        };
    }
    
    pub fn deinit(self: *FrameAllocator) void {
        self.frame_pool.deinit();
        self.stack_pool.deinit();
        self.memory_pool.deinit();
        self.active_frames.deinit();
    }
    
    pub fn acquire_frame(self: *FrameAllocator) !*Frame {
        const frame = self.frame_pool.acquire() orelse return error.OutOfMemory;
        
        // Initialize frame with pooled components
        frame.stack = self.stack_pool.acquire() orelse {
            self.frame_pool.release(frame);
            return error.OutOfMemory;
        };
        
        frame.memory = self.memory_pool.acquire() orelse {
            self.stack_pool.release(frame.stack);
            self.frame_pool.release(frame);
            return error.OutOfMemory;
        };
        
        // Reset frame state
        frame.reset();
        
        try self.active_frames.append(frame);
        return frame;
    }
    
    pub fn release_frame(self: *FrameAllocator, frame: *Frame) void {
        // Remove from active frames
        for (self.active_frames.items, 0..) |active_frame, i| {
            if (active_frame == frame) {
                _ = self.active_frames.swapRemove(i);
                break;
            }
        }
        
        // Return components to pools
        if (frame.memory) |memory| {
            self.memory_pool.release(memory);
        }
        
        if (frame.stack) |stack| {
            self.stack_pool.release(stack);
        }
        
        self.frame_pool.release(frame);
    }
    
    pub fn get_active_frame_count(self: *const FrameAllocator) usize {
        return self.active_frames.items.len;
    }
    
    pub fn get_pool_utilization(self: *const FrameAllocator) PoolUtilization {
        return PoolUtilization{
            .frame_utilization = self.frame_pool.get_utilization(),
            .stack_utilization = self.stack_pool.get_utilization(),
            .memory_utilization = self.memory_pool.get_utilization(),
        };
    }
    
    pub const PoolUtilization = struct {
        frame_utilization: f64,
        stack_utilization: f64,
        memory_utilization: f64,
    };
};
```

#### 4. Allocation Statistics and Monitoring
```zig
pub const AllocationStatistics = struct {
    total_allocations: u64,
    total_deallocations: u64,
    total_bytes_allocated: u64,
    total_bytes_deallocated: u64,
    peak_memory_usage: u64,
    current_memory_usage: u64,
    allocation_size_distribution: SizeDistribution,
    allocation_frequency: AllocationFrequency,
    fragmentation_stats: FragmentationStats,
    
    pub const SizeDistribution = struct {
        small_allocations: u64,      // < 256 bytes
        medium_allocations: u64,     // 256 - 4096 bytes
        large_allocations: u64,      // > 4096 bytes
        
        pub fn record_allocation(self: *SizeDistribution, size: usize) void {
            if (size < 256) {
                self.small_allocations += 1;
            } else if (size <= 4096) {
                self.medium_allocations += 1;
            } else {
                self.large_allocations += 1;
            }
        }
    };
    
    pub const AllocationFrequency = struct {
        allocations_per_second: f64,
        last_update_time: i64,
        allocation_count_window: u64,
        
        pub fn init() AllocationFrequency {
            return AllocationFrequency{
                .allocations_per_second = 0.0,
                .last_update_time = std.time.milliTimestamp(),
                .allocation_count_window = 0,
            };
        }
        
        pub fn update(self: *AllocationFrequency) void {
            const current_time = std.time.milliTimestamp();
            const time_delta = current_time - self.last_update_time;
            
            if (time_delta >= 1000) { // Update every second
                self.allocations_per_second = @as(f64, @floatFromInt(self.allocation_count_window)) / 
                                             (@as(f64, @floatFromInt(time_delta)) / 1000.0);
                self.allocation_count_window = 0;
                self.last_update_time = current_time;
            }
        }
        
        pub fn record_allocation(self: *AllocationFrequency) void {
            self.allocation_count_window += 1;
            self.update();
        }
    };
    
    pub const FragmentationStats = struct {
        external_fragmentation: f64,
        internal_fragmentation: f64,
        fragmentation_ratio: f64,
        
        pub fn init() FragmentationStats {
            return FragmentationStats{
                .external_fragmentation = 0.0,
                .internal_fragmentation = 0.0,
                .fragmentation_ratio = 0.0,
            };
        }
        
        pub fn update(self: *FragmentationStats, total_allocated: u64, actually_used: u64) void {
            if (total_allocated > 0) {
                self.internal_fragmentation = 1.0 - 
                    (@as(f64, @floatFromInt(actually_used)) / @as(f64, @floatFromInt(total_allocated)));
                self.fragmentation_ratio = self.internal_fragmentation + self.external_fragmentation;
            }
        }
    };
    
    pub fn init() AllocationStatistics {
        return AllocationStatistics{
            .total_allocations = 0,
            .total_deallocations = 0,
            .total_bytes_allocated = 0,
            .total_bytes_deallocated = 0,
            .peak_memory_usage = 0,
            .current_memory_usage = 0,
            .allocation_size_distribution = SizeDistribution{
                .small_allocations = 0,
                .medium_allocations = 0,
                .large_allocations = 0,
            },
            .allocation_frequency = AllocationFrequency.init(),
            .fragmentation_stats = FragmentationStats.init(),
        };
    }
    
    pub fn record_allocation(self: *AllocationStatistics, size: usize, alignment: u8) void {
        _ = alignment;
        
        self.total_allocations += 1;
        self.total_bytes_allocated += size;
        self.current_memory_usage += size;
        
        if (self.current_memory_usage > self.peak_memory_usage) {
            self.peak_memory_usage = self.current_memory_usage;
        }
        
        self.allocation_size_distribution.record_allocation(size);
        self.allocation_frequency.record_allocation();
    }
    
    pub fn record_deallocation(self: *AllocationStatistics, size: usize) void {
        self.total_deallocations += 1;
        self.total_bytes_deallocated += size;
        
        if (self.current_memory_usage >= size) {
            self.current_memory_usage -= size;
        }
    }
    
    pub fn record_resize(self: *AllocationStatistics, old_size: usize, new_size: usize) void {
        if (new_size > old_size) {
            self.record_allocation(new_size - old_size, 8);
        } else {
            self.record_deallocation(old_size - new_size);
        }
    }
    
    pub fn get_efficiency_metrics(self: *const AllocationStatistics) EfficiencyMetrics {
        const allocation_efficiency = if (self.total_allocations > 0)
            @as(f64, @floatFromInt(self.total_deallocations)) / @as(f64, @floatFromInt(self.total_allocations))
        else
            0.0;
        
        const memory_efficiency = if (self.total_bytes_allocated > 0)
            @as(f64, @floatFromInt(self.total_bytes_deallocated)) / @as(f64, @floatFromInt(self.total_bytes_allocated))
        else
            0.0;
        
        const average_allocation_size = if (self.total_allocations > 0)
            @as(f64, @floatFromInt(self.total_bytes_allocated)) / @as(f64, @floatFromInt(self.total_allocations))
        else
            0.0;
        
        return EfficiencyMetrics{
            .allocation_efficiency = allocation_efficiency,
            .memory_efficiency = memory_efficiency,
            .average_allocation_size = average_allocation_size,
            .peak_to_current_ratio = if (self.current_memory_usage > 0)
                @as(f64, @floatFromInt(self.peak_memory_usage)) / @as(f64, @floatFromInt(self.current_memory_usage))
            else
                1.0,
            .fragmentation_ratio = self.fragmentation_stats.fragmentation_ratio,
        };
    }
    
    pub const EfficiencyMetrics = struct {
        allocation_efficiency: f64,    // Ratio of deallocations to allocations
        memory_efficiency: f64,        // Ratio of deallocated to allocated bytes
        average_allocation_size: f64,  // Average size of allocations
        peak_to_current_ratio: f64,    // Peak memory usage vs current
        fragmentation_ratio: f64,      // Overall fragmentation
    };
    
    pub fn print_summary(self: *const AllocationStatistics) void {
        const metrics = self.get_efficiency_metrics();
        
        std.log.info("=== MEMORY ALLOCATION STATISTICS ===");
        std.log.info("Total allocations: {}", .{self.total_allocations});
        std.log.info("Total deallocations: {}", .{self.total_deallocations});
        std.log.info("Total bytes allocated: {}", .{self.total_bytes_allocated});
        std.log.info("Total bytes deallocated: {}", .{self.total_bytes_deallocated});
        std.log.info("Current memory usage: {} bytes", .{self.current_memory_usage});
        std.log.info("Peak memory usage: {} bytes", .{self.peak_memory_usage});
        std.log.info("Allocation efficiency: {d:.2}%", .{metrics.allocation_efficiency * 100.0});
        std.log.info("Memory efficiency: {d:.2}%", .{metrics.memory_efficiency * 100.0});
        std.log.info("Average allocation size: {d:.2} bytes", .{metrics.average_allocation_size});
        std.log.info("Fragmentation ratio: {d:.2}%", .{metrics.fragmentation_ratio * 100.0});
        std.log.info("Allocations per second: {d:.2}", .{self.allocation_frequency.allocations_per_second});
        
        std.log.info("Size distribution:");
        std.log.info("  Small (<256 bytes): {}", .{self.allocation_size_distribution.small_allocations});
        std.log.info("  Medium (256-4096 bytes): {}", .{self.allocation_size_distribution.medium_allocations});
        std.log.info("  Large (>4096 bytes): {}", .{self.allocation_size_distribution.large_allocations});
    }
};
```

## Production-Ready Memory Allocation Patterns

The following sections provide detailed implementation patterns extracted from production EVM implementations (REVM, EVMOne, Geth) and our existing Zig codebase for building high-performance memory allocator tuning.

### Geth Object Pool Patterns

<explanation>
Go-Ethereum demonstrates sophisticated object pooling with sync.Pool for Stack, Memory, and buffer reuse. Key patterns include capacity-based retention policies, size filtering for pool efficiency, and automatic pool management with garbage collection integration.
</explanation>

**Stack Pool Implementation** (Geth Pattern):
```zig
// Equivalent Zig pattern for Geth's stack pooling
pub const StackPool = struct {
    const POOL_CAPACITY = 1024; // Fixed capacity from Geth
    const MAX_STACK_ITEMS = 1024; // Standard EVM stack limit
    
    pool: std.ArrayList(*Stack),
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) StackPool {
        return StackPool{
            .pool = std.ArrayList(*Stack).init(allocator),
            .allocator = allocator,
        };
    }
    
    pub fn get(self: *StackPool) !*Stack {
        if (self.pool.items.len > 0) {
            const stack = self.pool.pop();
            stack.reset(); // Clear but retain capacity
            return stack;
        }
        
        // Create new stack if pool is empty
        const stack = try self.allocator.create(Stack);
        stack.* = try Stack.init(self.allocator, MAX_STACK_ITEMS);
        return stack;
    }
    
    pub fn put(self: *StackPool, stack: *Stack) void {
        // Geth pattern: only retain if under capacity
        if (self.pool.items.len < POOL_CAPACITY) {
            self.pool.append(stack) catch {
                // If append fails, destroy the stack
                stack.deinit();
                self.allocator.destroy(stack);
                return;
            };
        } else {
            // Pool is full, destroy the stack
            stack.deinit();
            self.allocator.destroy(stack);
        }
    }
};
```

**Memory Pool with Size-Based Retention** (Geth Pattern):
```zig
// Geth retains Memory objects only if they're under 16KB
pub const MemoryPool = struct {
    const MAX_RETAINED_SIZE = 16 * 1024; // 16KB limit from Geth
    const POOL_CAPACITY = 512;
    
    pool: std.ArrayList(*Memory),
    allocator: std.mem.Allocator,
    
    pub fn put(self: *MemoryPool, memory: *Memory) void {
        // Geth pattern: size-based retention
        if (memory.capacity() <= MAX_RETAINED_SIZE and self.pool.items.len < POOL_CAPACITY) {
            memory.reset(); // Clear but retain capacity
            self.pool.append(memory) catch {
                self.destroyMemory(memory);
                return;
            };
        } else {
            self.destroyMemory(memory);
        }
    }
    
    fn destroyMemory(self: *MemoryPool, memory: *Memory) void {
        memory.deinit();
        self.allocator.destroy(memory);
    }
};
```

**Buffer Pool with Capacity Filtering** (Geth Pattern):
```zig
// Geth's buffer pool with 3x size tolerance
pub const BufferPool = struct {
    const SIZE_TOLERANCE_FACTOR = 3; // From Geth implementation
    
    // Separate pools for different size classes
    small_buffers: std.ArrayList([]u8),    // < 1KB
    medium_buffers: std.ArrayList([]u8),   // 1KB - 8KB  
    large_buffers: std.ArrayList([]u8),    // 8KB - 64KB
    
    allocator: std.mem.Allocator,
    
    pub fn get(self: *BufferPool, size: usize) ![]u8 {
        const pool = self.selectPool(size);
        
        // Find buffer with acceptable size (Geth's 3x tolerance)
        for (pool.items, 0..) |buffer, i| {
            if (buffer.len >= size and buffer.len <= size * SIZE_TOLERANCE_FACTOR) {
                return pool.swapRemove(i);
            }
        }
        
        // No suitable buffer found, allocate new
        return try self.allocator.alloc(u8, size);
    }
    
    pub fn put(self: *BufferPool, buffer: []u8) void {
        const pool = self.selectPool(buffer.len);
        pool.append(buffer) catch {
            // If append fails, free the buffer
            self.allocator.free(buffer);
        };
    }
    
    fn selectPool(self: *BufferPool, size: usize) *std.ArrayList([]u8) {
        if (size < 1024) return &self.small_buffers;
        if (size < 8192) return &self.medium_buffers;
        return &self.large_buffers;
    }
};
```

### REVM Shared Memory Architecture

<explanation>
REVM demonstrates sophisticated shared memory management using Rc<RefCell<Vec<u8>>> for reference-counted shared buffers with context checkpoints. This enables efficient memory sharing across call frames while maintaining isolation through checkpoint-based context management.
</explanation>

**Shared Memory with Context Checkpoints** (REVM Pattern):
```zig
// Equivalent Zig pattern for REVM's shared memory
pub const SharedMemory = struct {
    buffer: std.ArrayList(u8),
    contexts: std.ArrayList(ContextCheckpoint),
    allocator: std.mem.Allocator,
    
    pub const ContextCheckpoint = struct {
        size: usize,
        context_id: u32,
    };
    
    pub fn init(allocator: std.mem.Allocator) SharedMemory {
        return SharedMemory{
            .buffer = std.ArrayList(u8).init(allocator),
            .contexts = std.ArrayList(ContextCheckpoint).init(allocator),
            .allocator = allocator,
        };
    }
    
    // REVM pattern: create checkpoint for new context
    pub fn createContext(self: *SharedMemory, context_id: u32) !void {
        try self.contexts.append(ContextCheckpoint{
            .size = self.buffer.items.len,
            .context_id = context_id,
        });
    }
    
    // REVM pattern: expand shared buffer for context
    pub fn expandTo(self: *SharedMemory, new_size: usize) !void {
        if (new_size > self.buffer.items.len) {
            try self.buffer.resize(new_size);
            // Zero-initialize new memory
            @memset(self.buffer.items[self.buffer.items.len - (new_size - self.buffer.items.len)..], 0);
        }
    }
    
    // REVM pattern: revert to parent context
    pub fn revertContext(self: *SharedMemory, context_id: u32) void {
        // Find and remove the context checkpoint
        var i: usize = self.contexts.items.len;
        while (i > 0) {
            i -= 1;
            if (self.contexts.items[i].context_id == context_id) {
                const checkpoint = self.contexts.orderedRemove(i);
                // Revert buffer size to checkpoint
                self.buffer.shrinkRetainingCapacity(checkpoint.size);
                break;
            }
        }
    }
    
    // Get slice for current context (immutable view)
    pub fn getSlice(self: *const SharedMemory, offset: usize, len: usize) []const u8 {
        const end = @min(offset + len, self.buffer.items.len);
        if (offset >= self.buffer.items.len) return &[_]u8{};
        return self.buffer.items[offset..end];
    }
    
    // Get mutable slice for current context
    pub fn getMutableSlice(self: *SharedMemory, offset: usize, len: usize) []u8 {
        const end = @min(offset + len, self.buffer.items.len);
        if (offset >= self.buffer.items.len) return &[_]u8{};
        return self.buffer.items[offset..end];
    }
};
```

### EVMOne Cache-Optimized Allocation

<explanation>
EVMOne demonstrates cache-line aligned allocation strategies and memory layout optimizations. Key patterns include 32-byte alignment for 256-bit operations, initial capacity sizing with page alignment, and growth strategies optimized for cache efficiency.
</explanation>

**Cache-Line Aligned Stack** (EVMOne Pattern):
```zig
// EVMOne's 256-bit aligned stack for cache efficiency
pub const AlignedStack = struct {
    const ALIGNMENT = 32; // 32-byte alignment for cache lines
    const CAPACITY = 1024; // EVM stack limit
    
    // Aligned data array for optimal cache performance
    data: [CAPACITY]u256 align(ALIGNMENT) = [_]u256{0} ** CAPACITY,
    size: usize = 0,
    
    pub fn push(self: *AlignedStack, value: u256) !void {
        if (self.size >= CAPACITY) return error.StackOverflow;
        self.data[self.size] = value;
        self.size += 1;
    }
    
    pub fn pop(self: *AlignedStack) !u256 {
        if (self.size == 0) return error.StackUnderflow;
        self.size -= 1;
        return self.data[self.size];
    }
    
    // EVMOne pattern: direct access for performance
    pub fn peek(self: *const AlignedStack, index: usize) u256 {
        return self.data[self.size - 1 - index];
    }
    
    pub fn set(self: *AlignedStack, index: usize, value: u256) void {
        self.data[self.size - 1 - index] = value;
    }
};
```

**Page-Aligned Memory Growth** (EVMOne Pattern):
```zig
// EVMOne's memory growth with page alignment
pub const PageAlignedMemory = struct {
    const PAGE_SIZE = 4096; // 4KB pages
    const INITIAL_CAPACITY = PAGE_SIZE; // Start with one page
    const GROWTH_FACTOR = 2; // Double capacity on growth
    
    buffer: []u8,
    size: usize = 0,
    capacity: usize,
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) !PageAlignedMemory {
        const buffer = try allocator.alignedAlloc(u8, PAGE_SIZE, INITIAL_CAPACITY);
        return PageAlignedMemory{
            .buffer = buffer,
            .capacity = INITIAL_CAPACITY,
            .allocator = allocator,
        };
    }
    
    // EVMOne pattern: page-aligned growth
    pub fn expandTo(self: *PageAlignedMemory, new_size: usize) !void {
        if (new_size <= self.capacity) {
            self.size = new_size;
            return;
        }
        
        // Calculate new capacity with page alignment
        var new_capacity = self.capacity;
        while (new_capacity < new_size) {
            new_capacity *= GROWTH_FACTOR;
        }
        
        // Round up to page boundary
        new_capacity = ((new_capacity + PAGE_SIZE - 1) / PAGE_SIZE) * PAGE_SIZE;
        
        // Reallocate with page alignment
        const new_buffer = try self.allocator.alignedAlloc(u8, PAGE_SIZE, new_capacity);
        @memcpy(new_buffer[0..self.size], self.buffer[0..self.size]);
        
        self.allocator.free(self.buffer);
        self.buffer = new_buffer;
        self.capacity = new_capacity;
        self.size = new_size;
    }
};
```

### Our Existing StoragePool Optimization

<explanation>
Our current Zig codebase demonstrates typed object pools with capacity retention and graceful degradation. This pattern provides type safety while maintaining high performance through specialized pools for different hash map types.
</explanation>

**Typed Object Pools** (Our Pattern):
```zig
// Enhanced version of our existing StoragePool
pub const TypedObjectPools = struct {
    // Separate pools for different hash map types
    account_pool: ObjectPool(AccountMap),
    storage_pool: ObjectPool(StorageMap),
    code_pool: ObjectPool(CodeMap),
    log_pool: ObjectPool(LogVector),
    
    allocator: std.mem.Allocator,
    
    pub const AccountMap = std.HashMap(Address, Account, AddressContext, std.hash_map.default_max_load_percentage);
    pub const StorageMap = std.HashMap(StorageKey, U256, StorageKeyContext, std.hash_map.default_max_load_percentage);
    pub const CodeMap = std.HashMap(B256, Bytecode, B256Context, std.hash_map.default_max_load_percentage);
    pub const LogVector = std.ArrayList(Log);
    
    pub fn init(allocator: std.mem.Allocator) TypedObjectPools {
        return TypedObjectPools{
            .account_pool = ObjectPool(AccountMap).init(allocator, 32),
            .storage_pool = ObjectPool(StorageMap).init(allocator, 64),
            .code_pool = ObjectPool(CodeMap).init(allocator, 16),
            .log_pool = ObjectPool(LogVector).init(allocator, 16),
            .allocator = allocator,
        };
    }
    
    // Get account map with optimal pre-sizing
    pub fn getAccountMap(self: *TypedObjectPools, expected_size: usize) !*AccountMap {
        var map = try self.account_pool.get();
        if (map.capacity() < expected_size) {
            try map.ensureTotalCapacity(expected_size);
        }
        return map;
    }
    
    // Return with capacity retention (our pattern)
    pub fn putAccountMap(self: *TypedObjectPools, map: *AccountMap) void {
        map.clearRetainingCapacity(); // Our optimization
        self.account_pool.put(map);
    }
    
    // Specialized pool for storage maps (high-frequency usage)
    pub fn getStorageMap(self: *TypedObjectPools, expected_size: usize) !*StorageMap {
        var map = try self.storage_pool.get();
        if (map.capacity() < expected_size) {
            try map.ensureTotalCapacity(expected_size);
        }
        return map;
    }
    
    pub fn putStorageMap(self: *TypedObjectPools, map: *StorageMap) void {
        map.clearRetainingCapacity();
        self.storage_pool.put(map);
    }
};
```

### Memory Hierarchy and Allocation Strategy

<explanation>
Production EVMs use hierarchical allocation strategies with different allocators optimized for different use cases. This includes L1 fixed arrays for hot paths, L2 object pools for frequent allocations, L3 arena allocators for call frames, and L4 general allocators for infrequent operations.
</explanation>

**Hierarchical Allocation Framework**:
```zig
pub const MemoryHierarchy = struct {
    // L1: Fixed arrays for hot paths (fastest)
    stack_storage: AlignedStack,
    small_buffers: [16][64]u8,  // Pre-allocated 64-byte buffers
    
    // L2: Object pools for frequent allocations
    typed_pools: TypedObjectPools,
    buffer_pool: BufferPool,
    
    // L3: Arena allocators for call frames
    frame_arena: std.heap.ArenaAllocator,
    temp_arena: std.heap.ArenaAllocator,
    
    // L4: General allocator for infrequent operations
    general_allocator: std.mem.Allocator,
    
    // Allocation strategy selection
    pub fn selectAllocator(self: *MemoryHierarchy, size: usize, lifetime: AllocationLifetime) std.mem.Allocator {
        return switch (lifetime) {
            .hot_path => if (size <= 64) self.getSmallBufferAllocator() else self.buffer_pool.allocator(),
            .call_frame => self.frame_arena.allocator(),
            .temporary => self.temp_arena.allocator(),
            .persistent => self.general_allocator,
        };
    }
    
    pub const AllocationLifetime = enum {
        hot_path,    // Stack operations, immediate computation
        call_frame,  // Lifetime of a single EVM call
        temporary,   // Short-lived intermediate results
        persistent,  // Long-lived data (code, account state)
    };
    
    // Reset arenas after call completion
    pub fn resetCallFrame(self: *MemoryHierarchy) void {
        _ = self.frame_arena.reset(.retain_capacity);
        _ = self.temp_arena.reset(.retain_capacity);
    }
};
```

### Allocation Size Class Optimization

<explanation>
Production allocators use size classes to minimize fragmentation and optimize allocation speed. Different size ranges use different strategies: small allocations use object pools, medium allocations use arena allocators with size classes, and large allocations go directly to the system.
</explanation>

**Size Class Based Allocation**:
```zig
pub const SizeClassAllocator = struct {
    // Size class boundaries (powers of 2 and common sizes)
    const SIZE_CLASSES = [_]usize{ 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536 };
    
    small_pools: [SIZE_CLASSES.len]ObjectPool([]u8),
    medium_arena: std.heap.ArenaAllocator,
    large_allocator: std.mem.Allocator,
    
    pub fn alloc(self: *SizeClassAllocator, size: usize) ![]u8 {
        // Small allocations: use size class pools
        if (size <= 65536) {
            const class_index = self.findSizeClass(size);
            const class_size = SIZE_CLASSES[class_index];
            
            var buffer = try self.small_pools[class_index].get();
            if (buffer.len == 0) {
                // Pool is empty, allocate new buffer
                buffer = try self.large_allocator.alloc(u8, class_size);
            }
            return buffer[0..size]; // Return only requested size
        }
        
        // Medium allocations: use arena with page alignment
        if (size <= 1024 * 1024) { // 1MB
            return try self.medium_arena.allocator().alloc(u8, size);
        }
        
        // Large allocations: direct allocation
        return try self.large_allocator.alloc(u8, size);
    }
    
    pub fn free(self: *SizeClassAllocator, buffer: []u8) void {
        if (buffer.len <= 65536) {
            // Return to appropriate size class pool
            const class_index = self.findSizeClass(buffer.len);
            const class_size = SIZE_CLASSES[class_index];
            
            // Only return if it's the exact class size
            if (buffer.len == class_size) {
                self.small_pools[class_index].put(buffer);
                return;
            }
        }
        
        // For arena or large allocations, check ownership
        if (buffer.len > 1024 * 1024) {
            self.large_allocator.free(buffer);
        }
        // Arena allocations are freed in bulk
    }
    
    fn findSizeClass(self: *SizeClassAllocator, size: usize) usize {
        for (SIZE_CLASSES, 0..) |class_size, i| {
            if (size <= class_size) return i;
        }
        return SIZE_CLASSES.len - 1; // Largest class
    }
};
```

### Performance Monitoring and Tuning

<explanation>
Production memory allocators include comprehensive monitoring to guide optimization decisions. Key metrics include pool hit/miss ratios, allocation size distributions, peak memory usage, and fragmentation levels.
</explanation>

**Allocation Performance Metrics**:
```zig
pub const AllocationMetrics = struct {
    // Pool performance metrics
    pool_hits: [PoolType.count]u64,
    pool_misses: [PoolType.count]u64,
    pool_evictions: [PoolType.count]u64,
    
    // Size distribution metrics
    size_histogram: [16]u64, // Powers of 2 from 1 byte to 32KB
    large_allocations: u64,   // > 32KB
    
    // Memory usage metrics
    peak_memory_usage: usize,
    current_memory_usage: usize,
    total_allocations: u64,
    total_deallocations: u64,
    
    // Fragmentation metrics
    fragmentation_ratio: f64,
    largest_free_block: usize,
    
    pub const PoolType = enum(u8) {
        stack,
        memory,
        account_map,
        storage_map,
        code_map,
        small_buffer,
        medium_buffer,
        large_buffer,
        
        pub const count = @typeInfo(PoolType).Enum.fields.len;
    };
    
    pub fn recordAllocation(self: *AllocationMetrics, size: usize, pool_type: ?PoolType) void {
        self.total_allocations += 1;
        self.current_memory_usage += size;
        self.peak_memory_usage = @max(self.peak_memory_usage, self.current_memory_usage);
        
        // Update size histogram
        const size_class = self.getSizeClass(size);
        if (size_class < self.size_histogram.len) {
            self.size_histogram[size_class] += 1;
        } else {
            self.large_allocations += 1;
        }
        
        // Update pool metrics
        if (pool_type) |pool| {
            self.pool_hits[@intFromEnum(pool)] += 1;
        }
    }
    
    pub fn recordPoolMiss(self: *AllocationMetrics, pool_type: PoolType) void {
        self.pool_misses[@intFromEnum(pool_type)] += 1;
    }
    
    pub fn getPoolHitRatio(self: *const AllocationMetrics, pool_type: PoolType) f64 {
        const hits = self.pool_hits[@intFromEnum(pool_type)];
        const misses = self.pool_misses[@intFromEnum(pool_type)];
        const total = hits + misses;
        return if (total > 0) @as(f64, @floatFromInt(hits)) / @as(f64, @floatFromInt(total)) else 0.0;
    }
    
    pub fn getAverageAllocationSize(self: *const AllocationMetrics) f64 {
        if (self.total_allocations == 0) return 0.0;
        return @as(f64, @floatFromInt(self.current_memory_usage)) / @as(f64, @floatFromInt(self.total_allocations));
    }
    
    fn getSizeClass(self: *AllocationMetrics, size: usize) usize {
        if (size == 0) return 0;
        return @min(63 - @clz(size), 15); // log2 with max of 15
    }
};
```

This comprehensive collection of production-ready patterns provides the foundation for implementing high-performance memory allocator tuning in the Zig EVM, drawing from battle-tested approaches while adapting to Zig's unique features and our specific architecture requirements.

## Implementation Requirements

### Core Functionality
1. **Custom EVM Allocator**: Specialized allocator optimized for EVM workloads
2. **Pool Allocation**: Object pools for frequently allocated types (U256, Hash, Address, Frame)
3. **Arena Allocation**: Fast allocation for temporary objects with bulk deallocation
4. **Frame Management**: Specialized allocation for execution frames and stacks
5. **Statistics Collection**: Comprehensive allocation monitoring and analysis
6. **Memory Layout Optimization**: Alignment and locality optimizations

## Implementation Tasks

### Task 1: Implement Core Allocator Framework
File: `/src/evm/memory/evm_allocator.zig`
```zig
const std = @import("std");
const U256 = @import("../../Types/U256.ts").U256;
const Hash = @import("../../Hash/Keccak256.ts").Hash;
const Address = @import("../../Address/Address.ts").Address;
const Frame = @import("../frame.zig").Frame;

pub const EVMAllocator = struct {
    // Implementation based on the specification above
    // ... (full implementation details)
};
```

### Task 2: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const EVMAllocator = @import("memory/evm_allocator.zig").EVMAllocator;

pub const Vm = struct {
    // Existing fields...
    evm_allocator: ?EVMAllocator,
    
    pub fn init_with_optimized_allocator(
        backing_allocator: std.mem.Allocator,
        config: Config
    ) !Vm {
        var evm_allocator = EVMAllocator.init(
            backing_allocator, 
            EVMAllocator.AllocatorConfig.optimized()
        );
        
        var vm = Vm{
            // Initialize with optimized allocator
            .allocator = evm_allocator.allocator(),
            .evm_allocator = evm_allocator,
            // ... other fields
        };
        
        return vm;
    }
    
    pub fn deinit(self: *Vm) void {
        if (self.evm_allocator) |*allocator| {
            allocator.deinit();
        }
        // ... existing cleanup
    }
    
    pub fn get_allocation_statistics(self: *const Vm) ?EVMAllocator.AllocationStatistics {
        if (self.evm_allocator) |*allocator| {
            return allocator.get_statistics();
        }
        return null;
    }
    
    pub fn reset_arena_allocator(self: *Vm) void {
        if (self.evm_allocator) |*allocator| {
            allocator.reset_arena();
        }
    }
};
```

### Task 3: Memory Layout Optimization
File: `/src/evm/memory/layout_optimizer.zig`
```zig
const std = @import("std");

pub const LayoutOptimizer = struct {
    pub fn optimize_struct_layout(comptime T: type) type {
        // Analyze struct fields and reorder for optimal alignment
        const fields = std.meta.fields(T);
        var optimized_fields: [fields.len]std.builtin.Type.StructField = undefined;
        
        // Sort fields by alignment requirements (largest first)
        var sorted_indices: [fields.len]usize = undefined;
        for (fields, 0..) |_, i| {
            sorted_indices[i] = i;
        }
        
        std.sort.sort(usize, &sorted_indices, fields, struct {
            fn lessThan(context: []const std.builtin.Type.StructField, lhs: usize, rhs: usize) bool {
                return @alignOf(context[lhs].type) > @alignOf(context[rhs].type);
            }
        }.lessThan);
        
        // Create optimized field layout
        for (sorted_indices, 0..) |original_index, new_index| {
            optimized_fields[new_index] = fields[original_index];
        }
        
        return @Type(.{
            .Struct = .{
                .layout = .Auto,
                .fields = &optimized_fields,
                .decls = &[_]std.builtin.Type.Declaration{},
                .is_tuple = false,
            },
        });
    }
    
    pub fn calculate_padding(comptime T: type) usize {
        const size = @sizeOf(T);
        var actual_size: usize = 0;
        
        const fields = std.meta.fields(T);
        for (fields) |field| {
            actual_size += @sizeOf(field.type);
        }
        
        return size - actual_size;
    }
    
    pub fn suggest_optimizations(comptime T: type) OptimizationSuggestions {
        const current_size = @sizeOf(T);
        const OptimizedT = optimize_struct_layout(T);
        const optimized_size = @sizeOf(OptimizedT);
        const padding = calculate_padding(T);
        
        return OptimizationSuggestions{
            .current_size = current_size,
            .optimized_size = optimized_size,
            .size_reduction = current_size - optimized_size,
            .padding_bytes = padding,
            .efficiency_gain = if (current_size > 0)
                @as(f64, @floatFromInt(current_size - optimized_size)) / @as(f64, @floatFromInt(current_size))
            else
                0.0,
        };
    }
    
    pub const OptimizationSuggestions = struct {
        current_size: usize,
        optimized_size: usize,
        size_reduction: usize,
        padding_bytes: usize,
        efficiency_gain: f64,
    };
};
```

## Testing Requirements

### Test File
Create `/test/evm/memory/memory_allocator_tuning_test.zig`

### Test Cases
```zig
test "EVM allocator basic functionality" {
    // Test allocator initialization
    // Test basic allocation and deallocation
    // Test allocator efficiency
}

test "pool allocation performance" {
    // Test pool allocation vs standard allocation
    // Test pool utilization
    // Test pool overflow handling
}

test "arena allocation patterns" {
    // Test arena allocation for temporary objects
    // Test arena reset functionality
    // Test arena memory usage
}

test "frame allocator optimization" {
    // Test frame pool allocation
    // Test frame lifecycle management
    // Test frame pool efficiency
}

test "allocation statistics and monitoring" {
    // Test statistics collection
    // Test memory usage tracking
    // Test fragmentation analysis
}

test "memory layout optimization" {
    // Test struct layout optimization
    // Test padding calculation
    // Test optimization suggestions
}

test "performance benchmarks" {
    // Benchmark allocator performance
    // Compare with standard allocators
    // Measure real-world improvements
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/memory/evm_allocator.zig` - Main optimized allocator implementation
- `/src/evm/memory/pool_allocators.zig` - Object pool implementations
- `/src/evm/memory/frame_allocator.zig` - Frame-specific allocation optimization
- `/src/evm/memory/allocation_statistics.zig` - Statistics collection and analysis
- `/src/evm/memory/layout_optimizer.zig` - Memory layout optimization utilities
- `/src/evm/vm.zig` - VM integration with optimized allocator
- `/src/evm/frame.zig` - Frame integration with pool allocation
- `/test/evm/memory/memory_allocator_tuning_test.zig` - Comprehensive tests

## Success Criteria

1. **Performance Improvement**: 10-30% reduction in allocation overhead
2. **Memory Efficiency**: Reduced memory fragmentation and better utilization
3. **Reduced Allocation Count**: Fewer allocations through effective pooling
4. **Predictable Performance**: More consistent allocation timing
5. **Statistical Insights**: Comprehensive allocation monitoring and analysis
6. **Zero Overhead When Disabled**: No performance impact when optimizations are disabled

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

#### 1. **Unit Tests** (`/test/evm/memory/memory_allocator_test.zig`)
```zig
// Test basic memory allocator functionality
test "memory_allocator basic allocation patterns with known scenarios"
test "memory_allocator handles fragmentation correctly"
test "memory_allocator validates allocation sizes"
test "memory_allocator produces expected memory layouts"
```

#### 2. **Integration Tests**
```zig
test "memory_allocator integrates with EVM memory operations"
test "memory_allocator works with existing stack operations"
test "memory_allocator maintains gas calculation compatibility"
test "memory_allocator handles memory expansion correctly"
```

#### 3. **Performance Tests**
```zig
test "memory_allocator meets allocation speed targets"
test "memory_allocator memory usage optimization vs baseline"
test "memory_allocator scalability under high allocation load"
test "memory_allocator benchmark fragmentation overhead"
```

#### 4. **Error Handling Tests**
```zig
test "memory_allocator proper out-of-memory error handling"
test "memory_allocator handles invalid allocation requests"
test "memory_allocator graceful degradation on memory pressure"
test "memory_allocator recovery from allocation failures"
```

#### 5. **Compliance Tests**
```zig
test "memory_allocator EVM memory model compliance"
test "memory_allocator cross-platform memory behavior"
test "memory_allocator hardfork memory rule compatibility"
test "memory_allocator gas cost calculation accuracy"
```

#### 6. **Security Tests**
```zig
test "memory_allocator handles malicious allocation patterns safely"
test "memory_allocator prevents memory exhaustion attacks"
test "memory_allocator validates memory access boundaries"
test "memory_allocator maintains memory isolation properties"
```

### Test Development Priority
1. **Core allocation functionality tests** - Ensure basic memory allocation works
2. **Compliance tests** - Meet EVM memory specification requirements
3. **Performance tests** - Achieve memory efficiency targets
4. **Security tests** - Prevent memory-related vulnerabilities
5. **Error handling tests** - Robust memory failure management
6. **Edge case tests** - Handle memory boundary conditions

### Test Data Sources
- **EVM specification**: Official memory model requirements
- **Reference implementations**: Cross-client memory compatibility data
- **Performance baselines**: Memory allocation and deallocation benchmarks
- **Security test vectors**: Memory exhaustion and overflow prevention
- **Real-world scenarios**: Production memory usage pattern validation

### Continuous Testing
- Run `zig build test-all` after every code change
- Maintain 100% test coverage for public memory allocator APIs
- Validate memory performance regression prevention
- Test debug and release builds with different memory patterns
- Verify cross-platform memory compatibility

### Test-First Examples

**Before writing any implementation:**
```zig
test "memory_allocator basic allocation and deallocation" {
    // This test MUST fail initially
    const allocator = test_utils.createMemoryAllocator();
    const size: u64 = 1024;
    
    const ptr = memory_allocator.allocate(allocator, size);
    try testing.expect(ptr != null);
    
    memory_allocator.deallocate(allocator, ptr, size);
    try testing.expect(memory_allocator.isEmpty(allocator));
}
```

**Only then implement:**
```zig
pub const memory_allocator = struct {
    pub fn allocate(allocator: *MemoryAllocator, size: u64) !?[]u8 {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
    
    pub fn deallocate(allocator: *MemoryAllocator, ptr: []u8, size: u64) void {
        // Minimal implementation
    }
};
```

### Critical Testing Notes
- **Never commit without passing tests** (`zig build test-all`)
- **Test all allocator configuration combinations** - Especially for tuning parameters
- **Verify EVM memory specification compliance** - Critical for protocol correctness
- **Test memory performance implications** - Especially for allocation speed optimizations
- **Validate memory security properties** - Prevent memory-related vulnerabilities

## References

- [Memory Pool Allocation](https://en.wikipedia.org/wiki/Memory_pool) - Pool allocation strategies
- [Arena Allocation](https://en.wikipedia.org/wiki/Region-based_memory_management) - Arena memory management
- [Memory Fragmentation](https://en.wikipedia.org/wiki/Fragmentation_(computing)) - Fragmentation analysis and mitigation
- [Zig Allocators](https://ziglang.org/documentation/master/#Allocators) - Zig allocator interface
- [High-Performance Memory Management](https://www.memorymanagement.org/) - Advanced memory management techniques

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
/// Provides memory for EVM stack.
class StackSpace
{
    static uint256* allocate() noexcept
    {
        static constexpr auto alignment = sizeof(uint256);
        static constexpr auto size = limit * sizeof(uint256);
#ifdef _MSC_VER
        // MSVC doesn't support aligned_alloc() but _aligned_malloc() can be used instead.
        const auto p = _aligned_malloc(size, alignment);
#else
        const auto p = std::aligned_alloc(alignment, size);
#endif
        return static_cast<uint256*>(p);
    }

    struct Deleter
    {
        // TODO(C++23): static
        void operator()(void* p) noexcept
        {
#ifdef _MSC_VER
            // For MSVC the _aligned_malloc() must be paired with _aligned_free().
            _aligned_free(p);
#else
            std::free(p);
#endif
        }
    };

    /// The storage allocated for maximum possible number of items.
    /// Items are aligned to 256 bits for better packing in cache lines.
    std::unique_ptr<uint256, Deleter> m_stack_space;

public:
    /// The maximum number of EVM stack items.
    static constexpr auto limit = 1024;

    StackSpace() noexcept : m_stack_space{allocate()} {}

    /// Returns the pointer to the "bottom", i.e. below the stack space.
    [[nodiscard]] uint256* bottom() noexcept { return m_stack_space.get(); }
};


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

    [[noreturn, gnu::cold]] static void handle_out_of_memory() noexcept { std::terminate(); }

    void allocate_capacity() noexcept
    {
        m_data.reset(static_cast<uint8_t*>(std::realloc(m_data.release(), m_capacity)));
        if (!m_data) [[unlikely]]
            handle_out_of_memory();
    }

public:
    /// Creates Memory object with initial capacity allocation.
    Memory() noexcept { allocate_capacity(); }

    uint8_t& operator[](size_t index) noexcept { return m_data[index]; }

    [[nodiscard]] const uint8_t* data() const noexcept { return m_data.get(); }
    [[nodiscard]] size_t size() const noexcept { return m_size; }

    /// Grows the memory to the given size. The extent is filled with zeros.
    ///
    /// @param new_size  New memory size. Must be larger than the current size and multiple of 32.
    void grow(size_t new_size) noexcept
    {
        // Restriction for future changes. EVM always has memory size as multiple of 32 bytes.
        INTX_REQUIRE(new_size % 32 == 0);

        // Allow only growing memory. Include hint for optimizing compiler.
        INTX_REQUIRE(new_size > m_size);

        if (new_size > m_capacity)
        {
            m_capacity *= 2;  // Double the capacity.

            if (m_capacity < new_size)  // If not enough.
            {
                // Set capacity to required size rounded to multiple of page_size.
                m_capacity = ((new_size + (page_size - 1)) / page_size) * page_size;
            }

            allocate_capacity();
        }
        std::memset(&m_data[m_size], 0, new_size - m_size);
        m_size = new_size;
    }

    /// Virtually clears the memory by setting its size to 0. The capacity stays unchanged.
    void clear() noexcept { m_size = 0; }
};

/// Generic execution state for generic instructions implementations.
// NOLINTNEXTLINE(clang-analyzer-optin.performance.Padding)
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
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/vm.hpp">
```cpp
namespace evmone
{
/// The evmone EVMC instance.
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

    [[nodiscard]] ExecutionState& get_execution_state(size_t depth) noexcept;

    void add_tracer(std::unique_ptr<Tracer> tracer) noexcept
    {
        // Find the first empty unique_ptr and assign the new tracer to it.
        auto* end = &m_first_tracer;
        while (*end)
            end = &(*end)->m_next_tracer;
        *end = std::move(tracer);
    }

    void remove_tracers() noexcept { m_first_tracer.reset(); }

    [[nodiscard]] Tracer* get_tracer() const noexcept { return m_first_tracer.get(); }
};
}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/vm.cpp">
```cpp
namespace evmone
{
// ...

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
```
</file>
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
            // ... (complex eviction logic)
        }
        else
        {
            // ... (insertion logic)
        }
    }
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.hpp">
```cpp
namespace evmone
{
using evmc::bytes_view;
class ExecutionState;

class Tracer
{
    friend class VM;  // Has access the m_next_tracer to traverse the list forward.
    std::unique_ptr<Tracer> m_next_tracer;

public:
    virtual ~Tracer() = default;

    void notify_execution_start(  // NOLINT(misc-no-recursion)
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept
    {
        on_execution_start(rev, msg, code);
        if (m_next_tracer)
            m_next_tracer->notify_execution_start(rev, msg, code);
    }

    void notify_execution_end(const evmc_result& result) noexcept  // NOLINT(misc-no-recursion)
    {
        on_execution_end(result);
        if (m_next_tracer)
            m_next_tracer->notify_execution_end(result);
    }

    void notify_instruction_start(  // NOLINT(misc-no-recursion)
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

/// Creates the "histogram" tracer which counts occurrences of individual opcodes during execution
/// and reports this data in CSV format.
EVMC_EXPORT std::unique_ptr<Tracer> create_histogram_tracer(std::ostream& out);

EVMC_EXPORT std::unique_ptr<Tracer> create_instruction_tracer(std::ostream& out);

}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.cpp">
```cpp
/// @see create_histogram_tracer()
class HistogramTracer : public Tracer
{
    struct Context
    {
        const int32_t depth;
        const uint8_t* const code;
        uint32_t counts[256]{};

        Context(int32_t _depth, const uint8_t* _code) noexcept : depth{_depth}, code{_code} {}
    };

    std::stack<Context> m_contexts;
    std::ostream& m_out;

    void on_execution_start(
        evmc_revision /*rev*/, const evmc_message& msg, bytes_view code) noexcept override
    {
        m_contexts.emplace(msg.depth, code.data());
    }

    void on_instruction_start(uint32_t pc, const intx::uint256* /*stack_top*/, int /*stack_height*/,
        int64_t /*gas*/, const ExecutionState& /*state*/) noexcept override
    {
        auto& ctx = m_contexts.top();
        ++ctx.counts[ctx.code[pc]];
    }

    void on_execution_end(const evmc_result& /*result*/) noexcept override
    {
        const auto& ctx = m_contexts.top();

        m_out << "--- # HISTOGRAM depth=" << ctx.depth << "\nopcode,count\n";
        for (size_t i = 0; i < std::size(ctx.counts); ++i)
        {
            if (ctx.counts[i] != 0)
                m_out << get_name(static_cast<uint8_t>(i)) << ',' << ctx.counts[i] << '\n';
        }

        m_contexts.pop();
    }

public:
    explicit HistogramTracer(std::ostream& out) noexcept : m_out{out} {}
};


class InstructionTracer : public Tracer
{
    // ...
    void on_instruction_start(uint32_t pc, const intx::uint256* stack_top, int stack_height,
        int64_t gas, const ExecutionState& state) noexcept override
    {
        const auto& ctx = m_contexts.top();

        const auto opcode = ctx.code[pc];
        m_out << "{";
        m_out << R"("pc":)" << std::dec << pc;
        m_out << R"(,"op":)" << std::dec << int{opcode};
        m_out << R"(,"gas":"0x)" << std::hex << gas << '"';
        m_out << R"(,"gasCost":"0x)" << std::hex << instr::gas_costs[state.rev][opcode] << '"';

        // Full memory can be dumped as evmc::hex({state.memory.data(), state.memory.size()}),
        // but this should not be done by default. Adding --tracing=+memory option would be nice.
        m_out << R"(,"memSize":)" << std::dec << state.memory.size();

        output_stack(stack_top, stack_height);
        if (!state.return_data.empty())
            m_out << R"(,"returnData":"0x)" << evmc::hex(state.return_data) << '"';
        m_out << R"(,"depth":)" << std::dec << (ctx.depth + 1);
        m_out << R"(,"refund":)" << std::dec << state.gas_refund;
        m_out << R"(,"opName":")" << get_name(opcode) << '"';

        m_out << "}\n";
    }
    // ...
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
static_assert(sizeof(BlockInfo) == 8);
```
</file>
</evmone>
## Prompt Corrections
The prompt contains several struct definitions that are intended for different files (`PoolAllocators`, `FrameAllocator`, `AllocationStatistics`). The instructions in the prompt, however, suggest implementing all of these within a single file: `/src/evm/memory/evm_allocator.zig`.

**Correction:**
The implementation should be split across the files as described in the "Integration Points" section. The main `EVMAllocator` struct should be in `evm_allocator.zig`, but the supporting structs should be in their respective files (`pool_allocators.zig`, `frame_allocator.zig`, etc.) and imported. This improves modularity and matches the file breakdown provided later in the prompt.

**Example Correction for `evm_allocator.zig`:**
```zig
const std = @import("std");
const PoolAllocators = @import("pool_allocators.zig").PoolAllocators;
const FrameAllocator = @import("frame_allocator.zig").FrameAllocator;
const AllocationStatistics = @import("allocation_statistics.zig").AllocationStatistics;
// ... other imports

pub const EVMAllocator = struct {
    backing_allocator: std.mem.Allocator,
    arena_allocator: std.heap.ArenaAllocator,
    pool_allocators: PoolAllocators,
    frame_allocator: FrameAllocator,
    statistics: AllocationStatistics,
    config: AllocatorConfig,

    // ... rest of EVMAllocator implementation
};
```



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/shared_memory.rs">
```rust
//! A sequential memory shared between calls, which uses
//! a `Vec` for internal representation.
//! A [SharedMemory] instance should always be obtained using
//! the `new` static method to ensure memory safety.
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

// ...

impl SharedMemory {
    /// Creates a new memory instance that can be shared between calls.
    ///
    /// The default initial capacity is 4KiB.
    #[inline]
    pub fn new() -> Self {
        Self::with_capacity(4 * 1024) // from evmone
    }

    // ...

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

    // ...

    /// Resizes the memory in-place so that `len` is equal to `new_len`.
    #[inline]
    pub fn resize(&mut self, new_size: usize) {
        self.buffer
            .borrow_mut()
            .resize(self.my_checkpoint + new_size, 0);
    }

    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/stack.rs">
```rust
/// EVM interpreter stack limit.
pub const STACK_LIMIT: usize = 1024;

/// EVM stack with [STACK_LIMIT] capacity of words.
#[derive(Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize))]
pub struct Stack {
    /// The underlying data of the stack.
    data: Vec<U256>,
}

// ...

impl Stack {
    /// Instantiate a new stack with the [default stack limit][STACK_LIMIT].
    #[inline]
    pub fn new() -> Self {
        Self {
            // SAFETY: Expansion functions assume that capacity is `STACK_LIMIT`.
            data: Vec::with_capacity(STACK_LIMIT),
        }
    }

    /// Returns the length of the stack in words.
    #[inline]
    pub fn len(&self) -> usize {
        self.data.len()
    }
    
    // ...

    /// Push a new value onto the stack.
    ///
    /// If it will exceed the stack limit, returns false and leaves the stack
    /// unchanged.
    #[inline]
    #[must_use]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn push(&mut self, value: U256) -> bool {
        // Allows the compiler to optimize out the `Vec::push` capacity check.
        assume!(self.data.capacity() == STACK_LIMIT);
        if self.data.len() == STACK_LIMIT {
            return false;
        }
        self.data.push(value);
        true
    }

    /// Removes the topmost element from the stack and returns it, or `StackUnderflow` if it is
    /// empty.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn pop(&mut self) -> Result<U256, InstructionResult> {
        self.data.pop().ok_or(InstructionResult::StackUnderflow)
    }

    /// Duplicates the `N`th value from the top of the stack.
    ///
    /// # Panics
    ///
    /// Panics if `n` is 0.
    #[inline]
    #[must_use]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn dup(&mut self, n: usize) -> bool {
        assume!(n > 0, "attempted to dup 0");
        let len = self.data.len();
        if len < n || len + 1 > STACK_LIMIT {
            false
        } else {
            // SAFETY: Check for out of bounds is done above and it makes this safe to do.
            unsafe {
                let ptr = self.data.as_mut_ptr().add(len);
                ptr::copy_nonoverlapping(ptr.sub(n), ptr, 1);
                self.data.set_len(len + 1);
            }
            true
        }
    }
    
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/frame.rs">
```rust
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
    phantom: core::marker::PhantomData<(EVM, ERROR)>,
    /// Data of the frame.
    data: FrameData,
    /// Input data for the frame.
    pub input: FrameInput,
    /// Depth of the call frame.
    depth: usize,
    /// Journal checkpoint.
    pub checkpoint: JournalCheckpoint,
    /// Interpreter.
    pub interpreter: Interpreter<IW>,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/handler.rs">
```rust
    // ...

    /// Executes the main frame processing loop.
    ///
    /// This loop manages the frame stack, processing each frame until execution completes.
    /// For each iteration:
    /// 1. Calls the current frame
    /// 2. Handles the returned frame input or result
    /// 3. Creates new frames or propagates results as needed
    #[inline]
    fn run_exec_loop(
        &mut self,
        evm: &mut Self::Evm,
        frame: Self::Frame,
    ) -> Result<FrameResult, Self::Error> {
        let mut frame_stack: Vec<Self::Frame> = vec



## EXECUTION-SPECS Context

An analysis of the existing codebase reveals several key areas relevant to implementing a new memory allocator. The current implementation uses a simple, resizable memory buffer (`src/evm/memory.zig`) and relies on a standard Zig allocator passed down through various components. The most sophisticated memory management pattern currently in use is a `StoragePool` for reusing `HashMap`s, which provides a strong precedent for the proposed `EVMAllocator`.

### Key Areas for Integration
1.  **`src/evm/vm.zig`**: The primary integration point. The new `EVMAllocator` will replace the `std.mem.Allocator` currently passed during `Vm` initialization.
2.  **`src/evm/frame.zig`**: `Frame` objects are the main consumers of memory for stack, memory buffer, and return data. The proposed `FrameAllocator` will manage the lifecycle of these objects.
3.  **`src/evm/memory.zig`**: The existing memory model. The new allocator can either wrap this or replace it to provide more granular control and statistics.
4.  **`src/evm/contract/contract.zig` and `storage_pool.zig`**: This file contains a `StoragePool`, a pattern directly analogous to the proposed `PoolAllocators`. This existing pool should be integrated into or replaced by the new, more comprehensive `EVMAllocator`.

<execution-specs>
<file path="https://github.com/Zellic/zig-evm/blob/main/src/evm/vm.zig">
```zig
const std = @import("std");
const Contract = @import("contract/contract.zig");
const Stack = @import("stack/stack.zig");
const JumpTable = @import("jump_table/jump_table.zig");
const Frame = @import("frame.zig");
const Operation = @import("opcodes/operation.zig");
// ... (other imports)
const EvmState = @import("state/state.zig");
// ...

pub const Vm = @This();

/// Memory allocator for VM operations
allocator: std.mem.Allocator,
/// Return data from the most recent operation
return_data: []u8 = &[_]u8{},
/// Legacy stack field (unused in current implementation)
stack: Stack = .{},
/// Opcode dispatch table for the configured hardfork
table: JumpTable,
/// Protocol rules for the current hardfork
chain_rules: ChainRules,
// ...
/// World state including accounts, storage, and code
state: EvmState,
// ...

/// Initialize VM with a jump table and corresponding chain rules.
pub fn init(allocator: std.mem.Allocator, database: @import("state/database_interface.zig").DatabaseInterface, jump_table: ?*const JumpTable, chain_rules: ?*const ChainRules) !Vm {
    Log.debug("VM.init: Initializing VM with allocator and database", .{});

    var state = try EvmState.init(allocator, database);
    errdefer state.deinit();

    var access_list = AccessList.init(allocator);
    errdefer access_list.deinit();

    Log.debug("VM.init: VM initialization complete", .{});
    return Vm{
        .allocator = allocator,
        .table = (jump_table orelse &JumpTable.DEFAULT).*,
        .chain_rules = (chain_rules orelse &ChainRules.DEFAULT).*,
        .state = state,
        .context = Context.init(),
        .access_list = access_list,
    };
}

/// Free all VM resources.
/// Must be called when finished with the VM to prevent memory leaks.
pub fn deinit(self: *Vm) void {
    self.state.deinit();
    self.access_list.deinit();
    Contract.clear_analysis_cache(self.allocator);
}

/// Core bytecode execution with configurable static context.
/// Runs the main VM loop, executing opcodes sequentially while tracking
/// gas consumption and handling control flow changes.
pub fn interpret_with_context(self: *Vm, contract: *Contract, input: []const u8, is_static: bool) ExecutionError.Error!RunResult {
    // ...
    var frame = try Frame.init(self.allocator, contract);
    defer frame.deinit();
    // ...

    const interpreter_ptr = @as(*Operation.Interpreter, @ptrCast(self));
    const state_ptr = @as(*Operation.State, @ptrCast(&frame));

    while (pc < contract.code_size) {
        @branchHint(.likely);
        const opcode = contract.get_op(pc);
        frame.pc = pc;

        const result = self.table.execute(pc, interpreter_ptr, state_ptr, opcode) catch |err| {
            // ... (error handling)
        };
        // ... (pc update)
    }

    // ...

    const return_data = frame.return_data.get();
    const output: ?[]const u8 = if (return_data.len > 0) try self.allocator.dupe(u8, return_data) else null;

    return RunResult.init(
        initial_gas,
        frame.gas_remaining,
        .Success,
        null,
        output,
    );
}
```
</file>
<file path="https://github.com/Zellic/zig-evm/blob/main/src/evm/frame.zig">
```zig
const std = @import("std");
const Memory = @import("memory.zig");
const Stack = @import("stack/stack.zig");
const Contract = @import("contract/contract.zig");
const ExecutionError = @import("execution/execution_error.zig");
const Log = @import("log.zig");
const ReturnData = @import("return_data.zig").ReturnData;

/// EVM execution frame representing a single call context.
const Frame = @This();

// ...
/// Frame's memory space for temporary data storage.
memory: Memory,
/// Operand stack for the stack machine.
stack: Stack,
/// Contract being executed in this frame.
contract: *Contract,
/// Allocator for dynamic memory allocations.
allocator: std.mem.Allocator,
// ...
/// Return data from child calls.
return_data: ReturnData,
/// Input data for this call (calldata).
input: []const u8 = &[_]u8{},
// ...

/// Create a new execution frame with default settings.
pub fn init(allocator: std.mem.Allocator, contract: *Contract) !Frame {
    return Frame{
        .allocator = allocator,
        .contract = contract,
        .memory = try Memory.init_default(allocator),
        .stack = .{},
        .return_data = ReturnData.init(allocator),
    };
}

/// Clean up frame resources.
pub fn deinit(self: *Frame) void {
    self.memory.deinit();
    self.return_data.deinit();
}
```
</file>
<file path="https://github.com/Zellic/zig-evm/blob/main/src/evm/memory.zig">
```zig
const std = @import("std");
const Log = @import("log.zig");

/// Memory implementation for EVM execution contexts.
const Memory = @This();

pub const MemoryError = error{
    OutOfMemory,
    InvalidOffset,
    InvalidSize,
    MemoryLimitExceeded,
};

/// Calculate number of 32-byte words needed for byte length (rounds up)
pub fn calculate_num_words(len: usize) usize {
    return (len + 31) / 32;
}

shared_buffer: std.ArrayList(u8),
allocator: std.mem.Allocator,
my_checkpoint: usize,
memory_limit: u64,
root_ptr: *Memory,

pub const InitialCapacity: usize = 4 * 1024;
pub const DefaultMemoryLimit: u64 = 32 * 1024 * 1024; // 32 MB

/// Initializes the root Memory context.
pub fn init(
    allocator: std.mem.Allocator,
    initial_capacity: usize,
    memory_limit: u64,
) !Memory {
    // ...
    var shared_buffer = std.ArrayList(u8).init(allocator);
    // ...
}

/// Ensures the current context's memory region is at least `min_context_size` bytes.
/// Returns the number of *new 32-byte words added to the shared_buffer* if it expanded.
pub fn ensure_context_capacity(self: *Memory, min_context_size: usize) MemoryError!u64 {
    const required_total_len = self.my_checkpoint + min_context_size;
    // ... (error checking and limit validation)

    const root = self.root_ptr;
    const old_total_buffer_len = root.shared_buffer.items.len;
    const old_total_words = calculate_num_words(old_total_buffer_len);

    if (required_total_len <= old_total_buffer_len) {
        return 0;
    }

    // Resize the buffer
    // ... (resizing logic)
    try root.shared_buffer.ensureTotalCapacity(new_capacity);

    // Set new length and zero-initialize the newly added part
    root.shared_buffer.items.len = new_total_len;
    @memset(root.shared_buffer.items[old_total_buffer_len..new_total_len], 0);

    const new_total_words = calculate_num_words(new_total_len);
    const words_added = if (new_total_words > old_total_words) new_total_words - old_total_words else 0;
    return words_added;
}

/// Read 32 bytes as u256 at context-relative offset.
pub fn get_u256(self: *const Memory, relative_offset: usize) MemoryError!u256 {
    // ...
}

/// Write arbitrary data at context-relative offset.
pub fn set_data(self: *Memory, relative_offset: usize, data: []const u8) MemoryError!void {
    // ...
}
```
</file>
<file path="https://github.com/Zellic/zig-evm/blob/main/src/evm/contract/storage_pool.zig">
```zig
const std = @import("std");

/// Object pool for EVM storage-related hash maps to reduce allocation pressure.
const StoragePool = @This();

/// Pool of reusable access tracking maps (slot -> accessed flag)
access_maps: std.ArrayList(*std.AutoHashMap(u256, bool)),
/// Pool of reusable storage value maps (slot -> value)
storage_maps: std.ArrayList(*std.AutoHashMap(u256, u256)),
/// Allocator used for creating new maps when pool is empty
allocator: std.mem.Allocator,

pub fn init(allocator: std.mem.Allocator) StoragePool {
    return .{
        .access_maps = std.ArrayList(*std.AutoHashMap(u256, bool)).init(allocator),
        .storage_maps = std.ArrayList(*std.AutoHashMap(u256, u256)).init(allocator),
        .allocator = allocator,
    };
}

pub fn deinit(self: *StoragePool) void {
    // Clean up any remaining maps
    for (self.access_maps.items) |map| {
        map.deinit();
        self.allocator.destroy(map);
    }
    for (self.storage_maps.items) |map| {
        map.deinit();
        self.allocator.destroy(map);
    }
    self.access_maps.deinit();
    self.storage_maps.deinit();
}

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
// ... (similar borrow/return for storage_maps)
```
</file>
<file path="https://github.com/Zellic/zig-evm/blob/main/src/evm/constants/gas_constants.zig">
```zig
/// Calculate memory expansion gas cost
pub fn memory_gas_cost(current_size: u64, new_size: u64) u64 {
    if (new_size <= current_size) return 0;
    
    const current_words = (current_size + 31) / 32;
    const new_words = (new_size + 31) / 32;
    
    // Use lookup table for common cases (up to 32KB)
    if (new_words < MEMORY_EXPANSION_LUT.len) {
        const current_cost = if (current_words < MEMORY_EXPANSION_LUT.len)
            MEMORY_EXPANSION_LUT[current_words]
        else
            MemoryGas * current_words + (current_words * current_words) / QuadCoeffDiv;
            
        return MEMORY_EXPANSION_LUT[new_words] - current_cost;
    }
    
    // Fall back to calculation for larger sizes
    const current_cost = MemoryGas * current_words + (current_words * current_words) / QuadCoeffDiv;
    const new_cost = MemoryGas * new_words + (new_words * new_words) / QuadCoeffDiv;
    return new_cost - current_cost;
}
```
</file>
</execution-specs>

## Prompt Corrections
The original prompt is well-structured but contains some inaccuracies regarding the Zig project's file structure and type naming.

1.  **Incorrect File Extensions**: The prompt specifies TypeScript (`.ts`) file extensions for Zig type imports. This should be corrected to `.zig`.
    -   **Correction**: `const U256 = @import("../../Types/U256.zig").U256;`
2.  **File Organization**: The prompt specifies creating several new files under a `/src/evm/memory/` directory. While the current `memory.zig` is in `/src/evm/`, creating a subdirectory for the new allocator framework is a good organizational choice and aligns with the prompt's intent. This is more of a clarification than a correction.
3.  **Existing Pooling Mechanism**: The codebase already has a `StoragePool` in `src/evm/contract/storage_pool.zig` for pooling `HashMap`s used in storage access tracking. The new `PoolAllocators` should either replace, expand, or integrate this existing logic rather than creating a completely parallel system. The prompt should be updated to reflect this.
    -   **Suggestion**: The `PoolAllocators` struct should absorb the functionality of `StoragePool` and be made more generic to handle `U256`, `Hash`, `Address`, `Frame`, and buffers as specified.
4.  **Frame Allocation**: The `Frame` object is currently stack-allocated within the `interpret_with_context` function in `vm.zig`. The proposed `FrameAllocator` implies a shift to heap allocation for frames, which will be a significant change to the `Vm`'s execution loop. The implementation will need to modify this part of `vm.zig` to acquire and release frames from the new pool. This is a critical detail for the developer to be aware of.

---

An analysis of the `execution-specs` has identified several key files that provide context for implementing a custom memory allocator. The Python implementation uses a `bytearray` for memory and a `list` for the stack, both managed within an `Evm` dataclass that represents an execution frame. The custom allocator in Zig will need to provide and manage the memory for these core data structures.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/__init__.py">
```python
# execution-specs/src/ethereum/london/vm/__init__.py

# This file defines the core `Evm` and `Message` dataclasses.
# The `Evm` class is analogous to the `Frame` in the prompt, containing
# the stack, memory, and other execution-related state. The new allocator
# will be responsible for managing the memory for these objects.

from dataclasses import dataclass, field
from typing import List, Optional, Set, Tuple, Union

# ... imports

@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    # ... fields
    caller: Address
    target: Union[Bytes0, Address]
    gas: Uint
    value: U256
    data: Bytes
    code: Bytes
    depth: Uint
    # ... more fields


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

# This function shows how child EVM frames are managed. The `FrameAllocator`
# in the prompt is intended to optimize the creation and destruction of these
# `Evm` objects and their components.
def incorporate_child_on_success(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of a successful `child_evm` into the parent `evm`.
    """
    evm.gas_left += child_evm.gas_left
    evm.logs += child_evm.logs
    evm.refund_counter += child_evm.refund_counter
    evm.accounts_to_delete.update(child_evm.accounts_to_delete)
    evm.touched_accounts.update(child_evm.touched_accounts)
    if account_exists_and_is_empty(
        evm.message.block_env.state, child_evm.message.current_target
    ):
        evm.touched_accounts.add(child_evm.message.current_target)
    evm.accessed_addresses.update(child_evm.accessed_addresses)
    evm.accessed_storage_keys.update(child_evm.accessed_storage_keys)

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/memory.py">
```python
# execution-specs/src/ethereum/london/vm/memory.py

# This file demonstrates the fundamental memory model in the Python specs.
# The EVM memory is a simple, dynamically expanding `bytearray`. The custom
# allocator will need to manage the underlying buffer for this array to
# implement pooling and reduce fragmentation.

from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256, Uint

from ethereum.utils.byte import right_pad_zero_bytes


def memory_write(
    memory: bytearray, start_position: U256, value: Bytes
) -> None:
    """
    Writes to memory.
    """
    memory[start_position : int(start_position) + len(value)] = value


def memory_read_bytes(
    memory: bytearray, start_position: U256, size: U256
) -> bytearray:
    """
    Read bytes from memory.
    """
    return memory[start_position : Uint(start_position) + Uint(size)]


def buffer_read(buffer: Bytes, start_position: U256, size: U256) -> Bytes:
    """
    Read bytes from a buffer. Padding with zeros if necessary.
    """
    return right_pad_zero_bytes(
        buffer[start_position : Uint(start_position) + Uint(size)], size
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
# execution-specs/src/ethereum/london/vm/gas.py

# This file is critical as it defines the gas cost for memory expansion.
# The quadratic nature of this cost is a primary motivation for memory
# allocator tuning. The new allocator must efficiently handle memory
# growth to minimize these costs.

from dataclasses import dataclass
from typing import List, Tuple

from ethereum_types.numeric import U256, Uint

from ethereum.utils.numeric import ceil32

# ...

GAS_MEMORY = Uint(3)


@dataclass
class ExtendMemory:
    """
    Define the parameters for memory extension in opcodes
    """

    cost: Uint
    expand_by: Uint


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
    try:
        return total_gas_cost
    except ValueError:
        raise OutOfGasError


def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    """
    Calculates the gas amount to extend memory
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/memory.py">
```python
# execution-specs/src/ethereum/london/vm/instructions/memory.py

# This file shows how memory operations like MSTORE and MLOAD are implemented.
# They rely on `calculate_gas_extend_memory` and then write to or read from
# the `evm.memory` bytearray. The custom allocator will sit underneath these
# operations.

from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256, Uint

from .. import Evm
from ..gas import (
    GAS_BASE,
    GAS_VERY_LOW,
    calculate_gas_extend_memory,
    charge_gas,
)
from ..memory import memory_read_bytes, memory_write
from ..stack import pop, push


def mstore(evm: Evm) -> None:
    """
    Stores a word to memory.
    This also expands the memory, if the memory is
    insufficient to store the word.
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


def msize(evm: Evm) -> None:
    """
    Push the size of active memory in bytes onto the stack.
    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_BASE)

    # OPERATION
    push(evm.stack, U256(len(evm.memory)))

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/state.py">
```python
# execution-specs/src/ethereum/london/state.py

# This file shows the state snapshotting mechanism (`begin_transaction`,
# `commit_transaction`, `rollback_transaction`). This is conceptually
# similar to the arena allocation reset feature requested in the prompt.
# An arena can be used for all state changes within a transaction, and then
# reset on rollback or committed by moving its data to the parent state.

from dataclasses import dataclass, field
from typing import Callable, Dict, Iterable, List, Optional, Set, Tuple

# ... imports

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

```
</file>
</execution-specs>

## Prompt Corrections
The original prompt contains several struct definitions (`EVMAllocator`, `PoolAllocators`, `FrameAllocator`) that are well-suited for a Zig implementation. However, there are some conceptual differences compared to the Python `execution-specs` that are important to note:

1.  **`Frame` vs. `Evm` Object**: The prompt's `FrameAllocator` is designed to pool `Frame`, `Stack`, and `Memory` objects. In the `execution-specs`, the `Evm` dataclass (from `src/ethereum/london/vm/__init__.py`) serves the role of an execution frame. It directly contains the `stack` (as a `List[U256]`) and `memory` (as a `bytearray`). The Zig implementation should pool the equivalent of the `Evm` object itself, rather than trying to pool its individual components separately, to more closely match the spec's design.

2.  **Arena Allocation for State Changes**: The prompt mentions an arena allocator for temporary objects. A key use case for this in a real EVM is to handle state changes within a transaction that might be reverted. The `state.py` file shows this is done with `begin_transaction` and `rollback_transaction`, which create deep copies of the state tries. A high-performance Zig implementation could use an `ArenaAllocator` for all state modifications within a single transaction scope. On `commit`, the data would be moved to a more permanent allocator. On `revert`, the arena would simply be deinitialized, which is much faster than unwinding individual changes.

3.  **Memory Model**: The spec's `memory` is a simple `bytearray`. The Zig `EVMAllocator` will likely manage the backing buffer for a `std.ArrayList(u8)` to achieve the desired pooling and performance benefits. The `calculate_gas_extend_memory` function in `gas.py` is the key driver for why this is important, as it shows the quadratic cost that efficient memory management aims to mitigate.



## GO-ETHEREUM Context

<go-ethereum>
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

// rlpHash encodes x and hashes the encoded bytes.
func rlpHash(x interface{}) (h common.Hash) {
	sha := hasherPool.Get().(crypto.KeccakState)
	defer hasherPool.Put(sha)
	sha.Reset()
	rlp.Encode(sha, x)
	sha.Read(h[:])
	return h
}

// prefixedRlpHash writes the prefix into the hasher before rlp-encoding x.
// It's used for typed transactions.
func prefixedRlpHash(prefix byte, x interface{}) (h common.Hash) {
	sha := hasherPool.Get().(crypto.KeccakState)
	defer hasherPool.Put(sha)
	sha.Reset()
	sha.Write([]byte{prefix})
	rlp.Encode(sha, x)
	sha.Read(h[:])
	return h
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/cmd/evm/runner.go">
```go
type execStats struct {
	Time           time.Duration `json:"time"`           // The execution Time.
	Allocs         int64         `json:"allocs"`         // The number of heap allocations during execution.
	BytesAllocated int64         `json:"bytesAllocated"` // The cumulative number of bytes allocated during execution.
	GasUsed        uint64        `json:"gasUsed"`        // the amount of gas used during execution
}

func timedExec(bench bool, execFunc func() ([]byte, uint64, error)) ([]byte, execStats, error) {
	if bench {
		testing.Init()
		// Do one warm-up run
		output, gasUsed, err := execFunc()
		result := testing.Benchmark(func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				haveOutput, haveGasUsed, haveErr := execFunc()
				if !bytes.Equal(haveOutput, output) {
					panic(fmt.Sprintf("output differs\nhave %x\nwant %x\n", haveOutput, output))
				}
				if haveGasUsed != gasUsed {
					panic(fmt.Sprintf("gas differs, have %v want %v", haveGasUsed, gasUsed))
				}
				if haveErr != err {
					panic(fmt.Sprintf("err differs, have %v want %v", haveErr, err))
				}
			}
		})
		// Get the average execution time from the benchmarking result.
		// There are other useful stats here that could be reported.
		stats := execStats{
			Time:           time.Duration(result.NsPerOp()),
			Allocs:         result.AllocsPerOp(),
			BytesAllocated: result.AllocedBytesPerOp(),
			GasUsed:        gasUsed,
		}
		return output, stats, err
	}
	var memStatsBefore, memStatsAfter goruntime.MemStats
	goruntime.ReadMemStats(&memStatsBefore)
	t0 := time.Now()
	output, gasUsed, err := execFunc()
	duration := time.Since(t0)
	goruntime.ReadMemStats(&memStatsAfter)
	stats := execStats{
		Time:           duration,
		Allocs:         int64(memStatsAfter.Mallocs - memStatsBefore.Mallocs),
		BytesAllocated: int64(memStatsAfter.TotalAlloc - memStatsBefore.TotalAlloc),
		GasUsed:        gasUsed,
	}
	return output, stats, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/metrics.go">
```go
// CollectProcessMetrics periodically collects various metrics about the running process.
func CollectProcessMetrics(refresh time.Duration) {
	// Short circuit if the metrics system is disabled
	if !metricsEnabled {
		return
	}

	// Create the various data collectors
	var (
		cpustats  = make([]CPUStats, 2)
		diskstats = make([]DiskStats, 2)
		rstats    = make([]runtimeStats, 2)
	)

	// This scale factor is used for the runtime's time metrics. It's useful to convert to
	// ns here because the runtime gives times in float seconds, but runtimeHistogram can
	// only provide integers for the minimum and maximum values.
	const secondsToNs = float64(time.Second)

	// Define the various metrics to collect
	var (
		cpuSysLoad            = GetOrRegisterGauge("system/cpu/sysload", DefaultRegistry)
		cpuSysWait            = GetOrRegisterGauge("system/cpu/syswait", DefaultRegistry)
		cpuProcLoad           = GetOrRegisterGauge("system/cpu/procload", DefaultRegistry)
		cpuSysLoadTotal       = GetOrRegisterCounterFloat64("system/cpu/sysload/total", DefaultRegistry)
		cpuSysWaitTotal       = GetOrRegisterCounterFloat64("system/cpu/syswait/total", DefaultRegistry)
		cpuProcLoadTotal      = GetOrRegisterCounterFloat64("system/cpu/procload/total", DefaultRegistry)
		cpuThreads            = GetOrRegisterGauge("system/cpu/threads", DefaultRegistry)
		cpuGoroutines         = GetOrRegisterGauge("system/cpu/goroutines", DefaultRegistry)
		cpuSchedLatency       = getOrRegisterRuntimeHistogram("system/cpu/schedlatency", secondsToNs, nil)
		memPauses             = getOrRegisterRuntimeHistogram("system/memory/pauses", secondsToNs, nil)
		memAllocs             = GetOrRegisterMeter("system/memory/allocs", DefaultRegistry)
		memFrees              = GetOrRegisterMeter("system/memory/frees", DefaultRegistry)
		memTotal              = GetOrRegisterGauge("system/memory/held", DefaultRegistry)
		heapUsed              = GetOrRegisterGauge("system/memory/used", DefaultRegistry)
		heapObjects           = GetOrRegisterGauge("system/memory/objects", DefaultRegistry)
		diskReads             = GetOrRegisterMeter("system/disk/readcount", DefaultRegistry)
		diskReadBytes         = GetOrRegisterMeter("system/disk/readdata", DefaultRegistry)
		diskReadBytesCounter  = GetOrRegisterCounter("system/disk/readbytes", DefaultRegistry)
		diskWrites            = GetOrRegisterMeter("system/disk/writecount", DefaultRegistry)
		diskWriteBytes        = GetOrRegisterMeter("system/disk/writedata", DefaultRegistry)
		diskWriteBytesCounter = GetOrRegisterCounter("system/disk/writebytes", DefaultRegistry)
	)

	var lastCollectTime time.Time

	// Iterate loading the different stats and updating the meters.
	now, prev := 0, 1
	for ; ; now, prev = prev, now {
		// Gather CPU times.
		ReadCPUStats(&cpustats[now])
		collectTime := time.Now()
		secondsSinceLastCollect := collectTime.Sub(lastCollectTime).Seconds()
		lastCollectTime = collectTime
		if secondsSinceLastCollect > 0 {
			// ... CPU stats update ...
		}

		// Threads
		cpuThreads.Update(int64(threadCreateProfile.Count()))

		// Go runtime metrics
		readRuntimeStats(&rstats[now])

		cpuGoroutines.Update(int64(rstats[now].Goroutines))
		cpuSchedLatency.update(rstats[now].SchedLatency)
		memPauses.update(rstats[now].GCPauses)

		memAllocs.Mark(int64(rstats[now].GCAllocBytes - rstats[prev].GCAllocBytes))
		memFrees.Mark(int64(rstats[now].GCFreedBytes - rstats[prev].GCFreedBytes))

		memTotal.Update(int64(rstats[now].MemTotal))
		heapUsed.Update(int64(rstats[now].MemTotal - rstats[now].HeapUnused - rstats[now].HeapFree - rstats[now].HeapReleased))
		heapObjects.Update(int64(rstats[now].HeapObjects))

		// Disk
		if ReadDiskStats(&diskstats[now]) == nil {
			// ... disk stats update ...
		}

		time.Sleep(refresh)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/counter.go">
```go
package metrics

import (
	"sync/atomic"
)

// GetOrRegisterCounter returns an existing Counter or constructs and registers
// a new Counter.
func GetOrRegisterCounter(name string, r Registry) *Counter {
	if r == nil {
		r = DefaultRegistry
	}
	return r.GetOrRegister(name, NewCounter).(*Counter)
}

// NewCounter constructs a new Counter.
func NewCounter() *Counter {
	return new(Counter)
}

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

// GetOrRegisterGauge returns an existing Gauge or constructs and registers a
// new Gauge.
func GetOrRegisterGauge(name string, r Registry) *Gauge {
	if r == nil {
		r = DefaultRegistry
	}
	return r.GetOrRegister(name, NewGauge).(*Gauge)
}

// NewGauge constructs a new Gauge.
func NewGauge() *Gauge {
	return &Gauge{}
}

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

// UpdateIfGt updates the gauge's value if v is larger then the current value.
func (g *Gauge) UpdateIfGt(v int64) {
	value := (*atomic.Int64)(g)
	for {
		exist := value.Load()
		if exist >= v {
			break
		}
		if value.CompareAndSwap(exist, v) {
			break
		}
	}
}

// Dec decrements the gauge's current value by the given amount.
func (g *Gauge) Dec(i int64) {
	(*atomic.Int64)(g).Add(-i)
}

// Inc increments the gauge's current value by the given amount.
func (g *Gauge) Inc(i int64) {
	(*atomic.Int64)(g).Add(i)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/histogram.go">
```go
package metrics

type HistogramSnapshot interface {
	Count() int64
	Max() int64
	Mean() float64
	Min() int64
	Percentile(float64) float64
	Percentiles([]float64) []float64
	Size() int
	StdDev() float64
	Sum() int64
	Variance() float64
}

// Histogram calculates distribution statistics from a series of int64 values.
type Histogram interface {
	Clear()
	Update(int64)
	Snapshot() HistogramSnapshot
}

// GetOrRegisterHistogram returns an existing Histogram or constructs and
// registers a new StandardHistogram.
func GetOrRegisterHistogram(name string, r Registry, s Sample) Histogram {
	if nil == r {
		r = DefaultRegistry
	}
	return r.GetOrRegister(name, func() Histogram { return NewHistogram(s) }).(Histogram)
}

// NewHistogram constructs a new StandardHistogram from a Sample.
func NewHistogram(s Sample) Histogram {
	return &StandardHistogram{s}
}

// StandardHistogram is the standard implementation of a Histogram and uses a
// Sample to bound its memory use.
type StandardHistogram struct {
	sample Sample
}

// Clear clears the histogram and its sample.
func (h *StandardHistogram) Clear() { h.sample.Clear() }

// Snapshot returns a read-only copy of the histogram.
func (h *StandardHistogram) Snapshot() HistogramSnapshot {
	return h.sample.Snapshot()
}

// Update samples a new value.
func (h *StandardHistogram) Update(v int64) { h.sample.Update(v) }
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

// GetOrRegisterMeter returns an existing Meter or constructs and registers a
// new Meter.
func GetOrRegisterMeter(name string, r Registry) *Meter {
	if r == nil {
		r = DefaultRegistry
	}
	return r.GetOrRegister(name, NewMeter).(*Meter)
}

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

// Rate5 returns the five-minute moving average rate of events per second at
// the time the snapshot was taken.
func (m *MeterSnapshot) Rate5() float64 { return m.rate5 }

// Rate15 returns the fifteen-minute moving average rate of events per second
// at the time the snapshot was taken.
func (m *MeterSnapshot) Rate15() float64 { return m.rate15 }

// RateMean returns the meter's mean rate of events per second at the time the
// snapshot was taken.
func (m *MeterSnapshot) RateMean() float64 { return m.rateMean }

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
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/writer.go">
```go
package metrics

import (
	"fmt"
	"io"
	"slices"
	"strings"
	"time"
)

// Write sorts writes each metric in the given registry periodically to the
// given io.Writer.
func Write(r Registry, d time.Duration, w io.Writer) {
	for range time.Tick(d) {
		WriteOnce(r, w)
	}
}

// WriteOnce sorts and writes metrics in the given registry to the given
// io.Writer.
func WriteOnce(r Registry, w io.Writer) {
	var namedMetrics []namedMetric
	r.Each(func(name string, i interface{}) {
		namedMetrics = append(namedMetrics, namedMetric{name, i})
	})
	slices.SortFunc(namedMetrics, namedMetric.cmp)
	for _, namedMetric := range namedMetrics {
		switch metric := namedMetric.m.(type) {
		case *Counter:
			fmt.Fprintf(w, "counter %s\n", namedMetric.name)
			fmt.Fprintf(w, "  count:       %9d\n", metric.Snapshot().Count())
		case *Gauge:
			fmt.Fprintf(w, "gauge %s\n", namedMetric.name)
			fmt.Fprintf(w, "  value:       %9d\n", metric.Snapshot().Value())
		case Histogram:
			h := metric.Snapshot()
			ps := h.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
			fmt.Fprintf(w, "histogram %s\n", namedMetric.name)
			fmt.Fprintf(w, "  count:       %9d\n", h.Count())
			fmt.Fprintf(w, "  min:         %9d\n", h.Min())
			fmt.Fprintf(w, "  max:         %9d\n", h.Max())
			fmt.Fprintf(w, "  mean:        %12.2f\n", h.Mean())
			fmt.Fprintf(w, "  stddev:      %12.2f\n", h.StdDev())
			fmt.Fprintf(w, "  median:      %12.2f\n", ps[0])
			fmt.Fprintf(w, "  75%%:         %12.2f\n", ps[1])
			fmt.Fprintf(w, "  95%%:         %12.2f\n", ps[2])
			fmt.Fprintf(w, "  99%%:         %12.2f\n", ps[3])
			fmt.Fprintf(w, "  99.9%%:       %12.2f\n", ps[4])
		case *Meter:
			m := metric.Snapshot()
			fmt.Fprintf(w, "meter %s\n", namedMetric.name)
			fmt.Fprintf(w, "  count:       %9d\n", m.Count())
			fmt.Fprintf(w, "  1-min rate:  %12.2f\n", m.Rate1())
			fmt.Fprintf(w, "  5-min rate:  %12.2f\n", m.Rate5())
			fmt.Fprintf(w, "  15-min rate: %12.2f\n", m.Rate15())
			fmt.Fprintf(w, "  mean rate:   %12.2f\n", m.RateMean())
        // ... other types
		}
	}
}
```
</file>
</go-ethereum>
<prompt-improvements>
- The `Memory Layout Optimization` section and `LayoutOptimizer` struct are highly specific to low-level languages like Zig, C, C++, and Rust. In Go, the compiler manages struct memory layout, and developers have no direct control over field reordering for padding optimization. This section should be removed or noted as not applicable when using Go as a reference, as there is no equivalent concept or code to extract.
</prompt-improvements>

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

	"github.com/holiman/uint256"
)

// intPool is a pool of big integers that can be reused to avoid frequent allocs.
type intPool struct {
	pool *sync.Pool
}

// newIntPool creates a new big integer pool.
func newIntPool() *intPool {
	return &intPool{
		pool: &sync.Pool{
			New: func() interface{} {
				return new(uint256.Int)
			},
		},
	}
}

// get retrieves a big integer from the pool.
func (p *intPool) get() *uint256.Int {
	return p.pool.Get().(*uint256.Int)
}

// get puts a big integer back into the pool.
func (p *intPool) put(is ...*uint256.Int) {
	for _, i := range is {
		p.pool.Put(i)
	}
}

// The following are methods for big.Int, which is used for EVM 256-bit integers.
// These methods are used by the EVM stack.

var (
	big32 = new(big.Int).SetUint64(32)
)

// bigPool is a pool of big.Ints.
type bigPool struct {
	pool *sync.Pool
}

func newBigPool() *bigPool {
	return &bigPool{
		pool: &sync.Pool{
			New: func() interface{} {
				return new(big.Int)
			},
		},
	}
}

// get retrieves a big integer from the pool.
func (p *bigPool) get() *big.Int {
	return p.pool.Get().(*big.Int)
}

// get puts a big integer back into the pool.
func (p *bigPool) put(i *big.Int) {
	p.pool.Put(i)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Copyright 2013 The go-ethereum Authors
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
	"fmt"

	"github.com/holiman/uint256"
)

// Stack is a last-in-first-out stack for the EVM.
type Stack struct {
	data []*uint256.Int
	pool *intPool
}

// newStack returns a new stack with the specified capacity.
func newStack(pool *intPool) *Stack {
	return &Stack{
		data: make([]*uint256.Int, 0, 16),
		pool: pool,
	}
}

// Data returns the underlying uint256.Int array.
func (st *Stack) Data() []*uint256.Int {
	return st.data
}

// push pushes an element to the top of the stack.
func (st *Stack) push(d *uint256.Int) {
	st.data = append(st.data, d)
}

// Pop pops the top element from the stack and returns it.
func (st *Stack) pop() (ret *uint256.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// Len returns the number of elements in the stack.
func (st *Stack) len() int {
	return len(st.data)
}

// swap swaps the top element with the n-th element from the top.
func (st *Stack) swap(n int) {
	st.data[len(st.data)-1], st.data[len(st.data)-n-1] = st.data[len(st.data)-n-1], st.data[len(st.data)-1]
}

// dup duplicates the n-th element from the top of the stack and pushes it on top.
func (st *Stack) dup(n int) {
	st.push(st.data[len(st.data)-n])
}

// peek returns the n-th element from the top of the stack without removing it.
func (st *Stack) peek(n int) *uint256.Int {
	return st.data[len(st.data)-n-1]
}

// require ensures that the stack has at least n elements.
func (st *Stack) require(n int) error {
	if st.len() < n {
		return fmt.Errorf("stack underflow (%d < %d)", st.len(), n)
	}
	return nil
}

// Print dumps the content of the stack to the logger.
func (st *Stack) Print() {
	fmt.Println("### STACK ###")
	if len(st.data) > 0 {
		for i, val := range st.data {
			fmt.Printf("%-3d  %v\n", i, val)
		}
	} else {
		fmt.Println("-- empty --")
	}
	fmt.Println("#############")
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_pool.go">
```go
// Copyright 2018 The go-ethereum Authors
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

package core

import (
	"sync"

	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/ethdb"
)

// StatePool is a pool of state.StateDBs. It's used to avoid re-allocating
// states between transactions.
type StatePool struct {
	pool *sync.Pool
}

// NewStatePool creates a new state pool.
func NewStatePool() *StatePool {
	return &StatePool{
		pool: new(sync.Pool),
	}
}

// Get retrieves a state from the pool.
func (p *StatePool) Get(db ethdb.Database, root common.Hash) (*state.StateDB, error) {
	if v := p.pool.Get(); v != nil {
		if s, ok := v.(*state.StateDB); ok {
			if err := s.Reset(root); err != nil {
				return nil, err
			}
			return s, nil
		}
	}
	return state.New(root, state.NewDatabase(rawdb.NewTable(db, "state"), nil))
}

// Put returns a state to the pool.
func (p *StatePool) Put(s *state.StateDB) {
	p.pool.Put(s)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// ... (copyright header)

// Reset clears out all ephemeral state objects from the state db, but keeps
// the underlying state trie to avoid reloading data for the next operations.
func (s *StateDB) Reset(root common.Hash) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// If the snapshot is not nil, we need to check the root hash
	if s.snapshot != nil {
		if s.snapshot.Root() != root {
			// The provided root hash is different from the snapshot root.
			// In this case, we have to reload the trie from the database.
			s.snapshot = nil
		}
	}
	// If snapshot is nil, we have to load the trie from database.
	if s.snapshot == nil {
		tr, err := s.db.OpenTrie(root)
		if err != nil {
			return err
		}
		s.trie = tr
	} else {
		// The snapshot is consistent with the provided root, we can reuse it.
		s.trie = s.snapshot.RevertTo(root)
	}
	s.stateObjects = make(map[common.Address]*stateObject)
	s.stateObjectsDirty = make(map[common.Address]struct{})
	s.thash = common.Hash{}
	s.txIndex = 0
	s.logs = make(map[common.Hash][]*types.Log)
	s.logSize = 0
	s.preimages = make(map[common.Hash][]byte)
	s.journal = newJournal()
	s.transientStorage = make(map[common.Address]map[common.Hash]common.Hash)
	s.clearRevertLog()

	return nil
}

// ... (rest of the file)
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt is well-structured and detailed, providing an excellent specification for implementing a sophisticated memory management system in a Zig-based EVM. The proposed design with `EVMAllocator`, object/buffer pools, and frame-specific allocators is robust. The go-ethereum snippets above validate the core ideas, particularly the use of object pooling for performance.

Here are some minor points of context and potential refinement based on `go-ethereum`'s implementation:

1.  **Direct vs. Indirect Pooling**: The prompt suggests a central `EVMAllocator` that routes allocations. In `go-ethereum`, pooling is more decentralized. For instance, the `Stack` manages its own pool of `*big.Int` objects (`intPool`), and the top-level transaction processor uses a `StatePool`. This approach can be effective as each component manages the lifecycle of the objects it's responsible for. The proposed centralized `EVMAllocator` is also a valid and potentially cleaner design, but it's worth noting the alternative.

2.  **`FrameAllocator` Analogy**: The `FrameAllocator` in the prompt is an excellent idea. The closest parallel in `go-ethereum` is the `StatePool` (`core/state_pool.go`), which pools `state.StateDB` objects. A `StateDB` is a much heavier object than a single call frame, encompassing the entire world state for a transaction. Pooling these objects avoids significant overhead between transactions. This supports the prompt's idea of pooling complex, expensive-to-create objects like `Frame`s.

3.  **Reset vs. Deinit**: A critical part of any pooling system is preparing an object for reuse. In `go-ethereum`, the `StatePool.Get` method calls `s.Reset(root)` on the `StateDB` object. The `Reset` method (included from `core/state/statedb.go`) is a perfect example of what needs to happen when an object is retrieved from a pool: clear ephemeral data (like `stateObjects`, `logs`, `journal`) but keep the underlying allocated resources (like the trie structure). This pattern is crucial for the `release` methods in the proposed `ObjectPool` and for resetting `Frame`s from the `FrameAllocator`.

4.  **Go's `sync.Pool`**: `go-ethereum` heavily leverages Go's built-in `sync.Pool` (as seen in `int_pool.go`). This provides a thread-safe pool of temporary objects that would otherwise be garbage collected. For a Zig implementation, which lacks a garbage collector, the proposed `ObjectPool` and `BufferPool` are the correct manual-memory-management equivalents. The Go code serves as a good reference for *what* to pool (frequently allocated, fixed-size, or expensive-to-create objects) rather than *how* to implement the pool itself.

In summary, the prompt's design is excellent and aligns with performance optimization strategies used in production-grade EVMs like `go-ethereum`. The provided snippets offer concrete examples of these strategies in action.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Copyright 2018 The go-ethereum Authors
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
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// Config are the configuration options for the Interpreter
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op code logger
	Tracer EVMLogger
	// NoBaseFee forces the EIP-1559 base fee to 0 (needed for 0 price calls)
	NoBaseFee bool
	// EnableJit enables the JIT VM
	EnableJit bool
	// AllowUnprotectedTxs allows unprotected transactions to be executed
	AllowUnprotectedTxs bool
	// Per-EVM-instance stack that is used for execution.
	// If it's nil, a new stack is created for each execution.
	Stack *Stack
	// Per-EVM-instance memory that is used for execution.
	// If it's nil, a new memory is created for each execution.
	Memory *Memory
}

// interpreterPool is a pool of interpreters, used to avoid constant heap
// allocations during EVM execution.
//
// The pool is not enormous, and might not be sufficient for highly concurrent
// nodes processing a lot of transactions. It is a simple tuning knob that can
// be tweaked if needed.
var interpreterPool = &sync.Pool{
	New: func() interface{} {
		return new(Interpreter)
	},
}

// Interpreter is an EVM interpreter for executing Ethereum contracts.
type Interpreter struct {
	evm *EVM
	cfg Config

	stack  *Stack
	memory *Memory

	// static is a flag that forbids the interpreter from making any state changes.
	// This is primarily used for STATICCALL to prevent state modifications.
	static bool

	// returnData is the buffer to be used for return data.
	// It has a default capacity of 32 bytes, but can be grown if needed.
	returnData []byte
}

// NewInterpreter returns a new interpreter
func NewInterpreter(evm *EVM, cfg Config) *Interpreter {
	var (
		stack  *Stack
		memory *Memory
	)
	// If the caller provided a stack and memory, use them
	if cfg.Stack != nil {
		stack = cfg.Stack
	} else {
		stack = newstack()
	}
	if cfg.Memory != nil {
		memory = cfg.Memory
	} else {
		memory = NewMemory()
	}
	return &Interpreter{
		evm:    evm,
		cfg:    cfg,
		stack:  stack,
		memory: memory,
	}
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, no refunds whatsoever.
func (in *Interpreter) Run(contract *Contract, input []byte, static bool) (ret []byte, err error) {
	// ... (code omitted for brevity)

	// Don't bother with the execution loop if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	// ... (code omitted for brevity)
	
	// The Interpreter main run loop
	for {
		// ... (code omitted for brevity)

		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.evm.jumpTable[op]

		// ... (code omitted for brevity)
		
		// If the operation is valid, execute it
		res, err := operation.execute(&pc, in, contract)
		
		// ... (code omitted for brevity)
	}

	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// ... (imports)

// EVM is the Ethereum Virtual Machine base object and provides
// the necessary tools to run a contract on the given state with
// the provided context. It should be noted that the EVM is fully
// re-entrant.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	// StateDB gives access to the underlying state
	StateDB StateDB
	// Depth is the call depth, which is restricted to 1024
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig
	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules
	// virtual machine configuration options used to initialise the
	// evm.
	vmConfig Config
	// global gas pool for the transaction
	gasPool *GasPool
	// interpreter is the contract interpreter
	interpreter *Interpreter
	// searcher is the JIT code searcher
	searcher *codeSearcher

	// readOnly is a flag indicating whether the EVM is in read-only mode.
	readOnly bool

	// returnData is the return data of the last call.
	returnData []byte

	// interpreterPool is a pool of interpreters, used to avoid constant heap
	// allocations during EVM execution.
	interpreterPool *sync.Pool
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// ...
	evm := &EVM{
		Context:         blockCtx,
		TxContext:       txCtx,
		StateDB:         statedb,
		chainConfig:     chainConfig,
		vmConfig:        vmConfig,
		interpreter:     NewInterpreter(nil, vmConfig), // Initial interpreter, will be replaced from pool
		interpreterPool: interpreterPool,
	}
	evm.interpreter.evm = evm // Wire up the initial interpreter
	// ...
	return evm
}

// run executes the given contract and returns the gas used and the returned data.
func run(evm *EVM, contract *Contract, input []byte, static bool) (ret []byte, remainingGas uint64, err error) {
	// ...
	// If the interpreter is not in read-only mode, create a snapshot of the state.
	// This is needed to revert any changes that are made during the execution of
	// the contract.
	if !evm.readOnly {
		evm.StateDB.Snapshot()
	}

	var (
		op    OpCode        // current opcode
		mem   = NewMemory() // bound memory
		stack = newstack()  // local stack
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go beyond 2^64. The YP defines the PC
		// to be uint256. Practically, this will not be a problem.
		pc   = uint64(0)
		gas  = contract.Gas
		cost uint64
		// ...
	)
	// Grab an interpreter from the pool.
	interpreter := evm.interpreterPool.Get().(*Interpreter)
	interpreter.evm = evm
	interpreter.static = static
	interpreter.returnData = nil

	// We are using a pooled interpreter, which comes with a memory and a stack.
	// These might have been used before and need to be reset.
	interpreter.memory.Resize(0)
	interpreter.stack.Reset()
	
	// ... execution loop ...

	// Return the interpreter to the pool.
	interpreter.returnData = nil // Don't hold on to old return data
	evm.interpreterPool.Put(interpreter)

	return ret, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// ... (imports)

const (
	// MaxMemorySize is the maximum size of the memory, in bytes.
	// The Yellow Paper specifies this as 2^256, but we're using a more
	// reasonable jumbo capacity of 4GB.
	MaxMemorySize = 4 * 1024 * 1024 * 1024
)

// Memory represents a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{store: make([]byte, 0, 1024)}
}

// Set sets the 32 bytes starting at offset to value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	// ...
}

// Resize resizes the memory to a new size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// newMemSize calculates the new memory size required for an operation.
// The given size is padded to a multiple of 32 bytes.
func newMemSize(size uint64) uint64 {
	if size > MaxMemorySize {
		size = MaxMemorySize
	}
	return (size + 31) / 32 * 32
}

// memoryGasCost calculates the gas cost for memory expansion.
func memoryGasCost(memSize uint64) (gas uint64) {
	// This is the memory gas cost formula from the yellow paper.
	// It's a bit of a mess, but it's the spec.
	memSizeWords := memSize / 32
	memGas := (memSizeWords*memSizeWords)/512 + (3 * memSizeWords)
	return memGas
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ... (imports)

// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements the ContractRef
// interface.
type Contract struct {
	// CallerAddress is the result of the caller stack frame and is used to
	// initialize the contract's CALLER opcode, a pannable operation.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	analysis  atomic.Value // a pointer to an analysis.

	Code     []byte
	CodeHash common.Hash
	CodeAddr *common.Address
	Input    []byte

	Gas   uint64
	value *big.Int

	// DelegateCall is a flag which indicates that the contract is being called
	// through a DELEGATECALL. In this case, the contract's code is executed
	// in the context of the caller's contract.
	DelegateCall bool
}

// destinations is a sorted list of JUMPDEST locations.
type destinations []uint64

// NewContract returns a new contract environment for the execution of EVM codes.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// ... (imports)

// EVMLogger is an interface to trace execution of EVM.
//
// The EVMLogger interface can be used to watch the EVM execute instructions.
// It is most often used for debugging, but can also be used to collect data about
// the execution of a contract.
type EVMLogger interface {
	// CaptureStart is called when an execution starts.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	// CaptureState is called after an opcode has been executed.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	// CaptureFault is called when an error occurs during execution.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	// CaptureEnd is called when an execution has finished.
	CaptureEnd(output []byte, gasUsed uint64, err error)
	// CaptureEnter is called when the EVM is about to enter a new sub-scope.
	CaptureEnter(typ, from, to common.Address, input []byte, gas uint64, value *big.Int)
	// CaptureExit is called when the EVM is about to exit a sub-scope.
	CaptureExit(output []byte, gasUsed uint64, err error)
}

// StructLogger is an EVMLogger that captures execution steps and converts them to
// a JSON object.
//
// Note, the captured logs are not thread-safe.
type StructLogger struct {
	// ... (fields omitted)
}

// StructLog is a structured log message used by the EVMLogger.
type StructLog struct {
	Pc            uint64              `json:"pc"`
	Op            OpCode              `json:"op"`
	Gas           uint64              `json:"gas"`
	GasCost       uint64              `json:"gasCost"`
	Memory        []byte              `json:"memory"`
	MemorySize    int                 `json:"memSize"`
	Stack         []*big.Int          `json:"stack"`
	ReturnData    []byte              `json:"returnData"`
	Storage       map[common.Hash]common.Hash `json:"-"`
	Depth         int                 `json:"depth"`
	RefundCounter uint64              `json:"refund"`
	Err           error               `json:"-"`
	OpName        string              `json:"opName"`
	ErrorString   string              `json:"error,omitempty"`
}

// ...
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt provides a well-thought-out design for a high-performance memory allocator in Zig. The use of object pools, arena allocation, and frame-specific management are excellent strategies. The go-ethereum codebase offers some interesting alternative perspectives and implementation details:

1.  **Pooled Object**: In your design, you propose pooling the `Frame` object itself. Geth takes a slightly different approach: it pools the `Interpreter` object, which is the stateful *engine* that executes a frame's context. The `Contract` object, which holds the context (caller, value, code - analogous to your `Frame`), is allocated for each call. This separates the reusable execution machinery from the per-call context, which might be a simpler pattern to manage. Consider if this separation makes sense for your implementation. The included snippet from `interpreter.go` shows this `sync.Pool` pattern.

2.  **Memory Management**: Your design includes an `ArenaAllocator`. Geth achieves a similar goal by tying a `Memory` object to the pooled `Interpreter`. When an `Interpreter` is reused from the pool, its `memory` is reset to zero length. This effectively creates a temporary, per-call allocation arena that is automatically cleared for the next use. The snippets from `memory.go` show how this memory is implemented and how its quadratic gas cost is calculated, which is a critical detail for EVM correctness.

3.  **Statistics Collection**: Your `AllocationStatistics` struct is focused on the performance of the allocator itself (allocation counts, sizes, fragmentation). Geth's `EVMLogger` (from `logger.go`) is focused on tracing the *execution* of the EVM (opcodes, gas, stack contents). While the goals are different, the Geth `EVMLogger` provides a great pattern for how to hook into the EVM's execution loop at each step to gather data, which is directly applicable to how you would implement your statistics collection.

4.  **Frame (`Contract`) Content**: The `Contract` struct from `contract.go` is included as a reference for what constitutes an execution frame's context in Geth. A notable feature is the `jumpdests` analysis, where the bytecode is pre-scanned to find all valid jump locations. This is a performance optimization that amortizes the cost of jump validation over many executions, similar in spirit to the memory optimizations you are implementing.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
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

// Resize resizes the memory to size
func (m *Memory) Resize(size uint64) {
	if uint64(m.Len()) < size {
		m.store = append(m.store, make([]byte, size-uint64(m.Len()))...)
	}
}

// GetPtr returns the offset + size
func (m *Memory) GetPtr(offset, size uint64) []byte {
	if size == 0 {
		return nil
	}

	// memory is always resized before being accessed, no need to check bounds
	return m.store[offset : offset+size]
}

// Len returns the length of the backing slice
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation except for
// ErrExecutionReverted which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() { in.evm.depth-- }()

	// Make sure the readOnly is only set if we aren't in readOnly yet.
	// This also makes sure that the readOnly flag isn't removed for child calls.
	if readOnly && !in.readOnly {
		in.readOnly = true
		defer func() { in.readOnly = false }()
	}

	// Reset the previous call's return data. It's unimportant to preserve the old buffer
	// as every returning call will return new data anyway.
	in.returnData = nil

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go above 2^64. The YP defines the PC
		// to be uint256. Practically much less so feasible.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the deferred EVMLogger
		gasCopy uint64 // for EVMLogger to log gas remaining before execution
		logged  bool   // deferred EVMLogger should ignore already logged steps
		res     []byte // result of the opcode execution function
		debug   = in.evm.Config.Tracer != nil
	)
	// Don't move this deferred function, it's placed before the OnOpcode-deferred method,
	// so that it gets executed _after_: the OnOpcode needs the stacks before
	// they are returned to the pools
	defer func() {
		returnStack(stack)
		mem.Free()
	}()
	contract.Input = input
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
type revision struct {
	id           int
	journalIndex int
}

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

// newJournal creates a new initialized journal.
func newJournal() *journal {
	return &journal{
		dirties: make(map[common.Address]int),
	}
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

// Len implements sort.Interface as part of heap.Interface, returning the number
// of accounts in the pool which can be considered for eviction.
func (h *evictHeap) Len() int {
	return len(h.addrs)
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

// Push implements heap.Interface, appending an item to the end of the account
// ordering as well as the address to item slot mapping.
func (h *evictHeap) Push(x any) {
	h.index[x.(common.Address)] = len(h.addrs)
	h.addrs = append(h.addrs, x.(common.Address))
}

// Pop implements heap.Interface, removing and returning the last element of the
// heap.
//
// Note, use `heap.Pop`, not `evictHeap.Pop`. This method is used by Go's heap,
// to provide the functionality, it does not embed it.
func (h *evictHeap) Pop() any {
	// Remove the last element from the heap
	size := len(h.addrs)
	addr := h.addrs[size-1]
	h.addrs = h.addrs[:size-1]

	// Unindex the removed element and return
	delete(h.index, addr)
	return addr
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/txpool/blobpool/blobpool.go">
```go
type BlobPool struct {
...
	index  map[common.Address][]*blobTxMeta // Blob transactions grouped by accounts, sorted by nonce
	spent  map[common.Address]*uint256.Int  // Expenditure tracking for individual accounts
	evict  *evictHeap                       // Heap of cheapest accounts for eviction when full
...
}

// drop removes the worst transaction from the pool. It is primarily used when a
// freshly added transaction overflows the pool and needs to evict something. The
// method is also called on startup if the user resizes their storage, might be an
// expensive run but it should be fine-ish.
func (p *BlobPool) drop() {
	// Peek at the account with the worse transaction set to evict from (Go's heap
	// stores the minimum at index zero of the heap slice) and retrieve it's last
	// transaction.
	var (
		from = p.evict.addrs[0] // cannot call drop on empty pool

		txs  = p.index[from]
		drop = txs[len(txs)-1]
		last = len(txs) == 1
	)
	// Remove the transaction from the pool's index
	if last {
		delete(p.index, from)
		delete(p.spent, from)
		p.reserver.Release(from)
	} else {
		txs[len(txs)-1] = nil
		txs = txs[:len(txs)-1]

		p.index[from] = txs
		p.spent[from] = new(uint256.Int).Sub(p.spent[from], drop.costCap)
	}
...
	// Remove the transaction from the pool's eviction heap:
	//   - If the entire account was dropped, pop off the address
	//   - Otherwise, if the new tail has better eviction caps, fix the heap
	if last {
		heap.Pop(p.evict)
	} else {
...
		if evictionExecFeeDiff > 0.001 || evictionBlobFeeDiff > 0.001 { // no need for math.Abs, monotonic decreasing
			heap.Fix(p.evict, 0)
		}
	}
...
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt provides a very solid and detailed specification for implementing a custom memory allocator in Zig for an EVM. The breakdown of components like `EVMAllocator`, `PoolAllocators`, `FrameAllocator`, and `AllocationStatistics` is well-thought-out and covers key optimization areas. There are no major errors, but here are a few suggestions and clarifications inspired by go-ethereum's implementation patterns:

1.  **Memory Arena Scope**: The current `EVMAllocator` uses `std.heap.ArenaAllocator` for temporary allocations. While good, its lifecycle isn't explicitly tied to a specific execution scope (like a single call frame). The `reset_arena` function is a manual operation. A more robust pattern, as seen in Geth's `interpreter.go`, is to create and destroy/reset the arena (or in Geth's case, the `Memory` object) with the lifecycle of an execution frame (`ScopeContext`). This ensures temporary memory is automatically reclaimed after each call, preventing leaks and simplifying memory management. It would be beneficial to tie the `reset_arena` call to the end of a `Frame`'s execution.

2.  **`ObjectPool` Design**: The prompt's `ObjectPool(T)` is a good generic implementation. However, for EVM objects like `Stack` and `Memory` which can have highly variable capacities, a simple pool might not be optimal. Geth's `memory.go` shows a `Free` method that only returns buffers to the pool if they are under a certain size (`maxBufferSize`). This prevents very large, atypical objects from being pooled and consuming excessive memory while idle. The `ObjectPool` or `BufferPool` could benefit from a similar "return-to-pool" policy based on capacity to avoid memory bloat.

3.  **Frame Object Complexity**: The prompt's `Frame` object is a good start. In Geth, the execution context is split across a few objects: `EVM` (context), `Contract` (code, address), and `ScopeContext` (stack, memory). The `FrameAllocator` in the prompt correctly identifies that `Frame`, `Stack`, and `Memory` are often allocated together. Geth's `interpreter.go` shows how these are created at the start of `Run` and returned to their respective pools via `defer`. This pattern is very efficient and should be a primary inspiration for the `FrameAllocator` implementation.

4.  **`u256` Pooling**: The prompt correctly identifies `U256` as a candidate for pooling. While Geth doesn't pool `uint256.Int` directly (as it's a value type array `[4]uint64`), the principle is sound for a Zig implementation where `U256` might be a heap-allocated object or a large struct. The benefit depends heavily on Zig's memory model for `U256`. If it's a stack-allocated value type, pooling might not provide significant benefits unless they are frequently passed by pointer to functions that escape them to the heap. This is a detail worth considering during implementation.

Overall, the prompt is excellent. The provided go-ethereum snippets should offer valuable, battle-tested patterns for implementing the specified features effectively.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory implements a simple memory model for the EVM.
//
// Memory is a linear byte array which is separated into 32-byte words.
// It is initialised to all zeros and can be extended by referencing a byte
// beyond the current size. The cost of extension is proportional to the
// square of the size and is paid on top of the cost of the referencing
// operation.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset to value
func (m *Memory) Set(offset, size uint64, value []byte) {
	// length of store may never be less than offset + size.
	// The store should be resized PRIOR to calling set.
	if size > 0 {
		copy(m.store[offset:offset+size], value)
	}
}

// Set32 sets the 32 bytes starting at offset to the value of val.
func (m *Memory) Set32(offset uint64, val *uint256.Int) {
	// length of store may never be less than offset + 32.
	// The store should be resized PRIOR to calling set.
	val.WriteToSlice(m.store[offset : offset+32])
}

// Resize resizes the memory to the given size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// Get returns offset + size as a new slice.
func (m *Memory) Get(offset, size uint64) []byte {
	if size == 0 {
		return nil
	}
	// If the offset is larger than the memory size, all zero bytes are returned.
	if offset > uint64(len(m.store)) {
		return common.Zeros(int(size))
	}
	// If the memory is insufficient, return the missing part with zero bytes.
	if end := offset + size; end > uint64(len(m.store)) {
		ret := make([]byte, size)
		copy(ret, m.store[offset:])
		return ret
	}
	return m.store[offset : offset+size]
}

// GetPtr returns the offset + size slice of memory.
//
// Note, the returned slice is not a copy and the caller must not make any
// modifications to the slice.
func (m *Memory) GetPtr(offset, size uint64) []byte {
	if size == 0 {
		return nil
	}
	if offset > uint64(len(m.store)) {
		return nil
	}
	if end := offset + size; end > uint64(len(m.store)) {
		// The returned slice is not a copy, so we must not return a new slice.
		// In this case, we can't fulfil the request, and must return nil.
		return nil
	}
	return m.store[offset : offset+size]
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// A Stack is a 256-bit word stack for the EVM.
type Stack struct {
	data []*uint256.Int
}

// stackPool is a pool of *Stack to be used and reused.
var stackPool = sync.Pool{
	New: func() interface{} {
		return &Stack{data: make([]*uint256.Int, 0, 16)}
	},
}

// newstack returns a new stack from the pool.
func newstack() *Stack {
	return stackPool.Get().(*Stack)
}

// returnStack returns a stack to the pool.
func returnStack(s *Stack) {
	s.data = s.data[:0]
	stackPool.Put(s)
}

// Data returns the underlying uint256.Int array for the stack.
func (st *Stack) Data() []*uint256.Int {
	return st.data
}

// Push pushes an item onto the stack.
func (st *Stack) Push(d *uint256.Int) {
	st.data = append(st.data, d)
}

// PushN pushes N items onto the stack.
// The values are read from the given 'items' slice, from left to right.
// So items[0] is pushed first, then items[1], etc.
// Therefore, after N items have been pushed, items[N-1] is at the top
// of the stack.
func (st *Stack) PushN(items ...*uint256.Int) {
	st.data = append(st.data, items...)
}

// Pop pops the top item off the stack and returns it.
func (st *Stack) Pop() (ret *uint256.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// Len returns the number of items on the stack.
func (st *Stack) Len() int {
	return len(st.data)
}

// Swap swaps the top two items on the stack.
func (st *Stack) Swap(n int) {
	st.data[st.len()-1], st.data[st.len()-n-1] = st.data[st.len()-n-1], st.data[st.len()-1]
}

// Dup duplicates the nth item on the stack.
func (st *Stack) Dup(n int) {
	st.Push(st.data[st.len()-n])
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
var (
	// vmPool holds reusable EVM objects.
	vmPool = sync.Pool{
		New: func() interface{} {
			return new(vm.EVM)
		},
	}
)
// ApplyTransaction attempts to apply a transaction to the given state database
// and uses the input parameters for its environment. It returns the receipt
// for the transaction, interface-wrapped logs and the total amount of gas
// used in the transaction. If the transaction fails, the web3-internal error
// code along with a suitable message is returned.
func ApplyTransaction(config *params.ChainConfig, bc ChainContext, author *common.Address, gp *GasPool, statedb *state.StateDB, header *types.Header, tx *types.Transaction, usedGas *uint64, evmConfig vm.Config) (*types.Receipt, error) {
	// ... (omitted)

	// Create a new context to be used in the EVM environment.
	vmenv := vmPool.Get().(*vm.EVM)
	defer vmPool.Put(vmenv)

	// ... (omitted)

	// Apply the transaction to the current state (included in the env).
	receipt, err := applyTransaction(vmenv, tx, usedGas, gp, statedb, msg, config, header)
	if err != nil {
		return nil, err
	}
	return receipt, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// memoryGasCost calculates the quadratic gas cost of memory expansion.
func memoryGasCost(mem *Memory, newMemSize uint64) (uint64, error) {
	if newMemSize == 0 {
		return 0, nil
	}
	// The maximum newMemSize is practically limited by the gas available in a block.
	// For a block with 30M gas, the max memory size is slightly less than 9.7MB.
	// The memory size could be at most a 26-bit number, so it's safe to use uint64.
	// If the new memory size is smaller than the existing one, there is no cost.
	if newMemSize <= uint64(mem.Len()) {
		return 0, nil
	}
	// The cost of memory expansion is paid when the memory is first accessed.
	// The cost is calculated based on the number of words, where a word is 32 bytes.
	// The cost is calculated as follows:
	// memory_cost = (new_mem_size_word ** 2) / 512 + 3 * new_mem_size_word
	// new_mem_size_word = (new_mem_size + 31) / 32
	// old_mem_size_word = (mem.Len() + 31) / 32
	// cost = new_memory_cost - old_memory_cost
	newMemSizeWords := (newMemSize + 31) / 32
	oldMemSizeWords := (uint64(mem.Len()) + 31) / 32

	// We can use the cached gas cost to avoid recalculation
	if mem.lastGasCost != 0 {
		// When the new gas cost is smaller than the cached one, it means the memory
		// size has been reduced. There is no cost for this operation, but we need
		// to invalidate the cached gas cost.
		if newMemSizeWords == oldMemSizeWords {
			return 0, nil
		}
	}
	// Calculate the gas cost for the new memory size
	newCost, overflow := quadraticGasCost(newMemSizeWords, params.MemoryGas, params.QuadCoeffDiv)
	if overflow {
		return 0, ErrGasUintOverflow
	}
	// Calculate the gas cost for the old memory size
	oldCost, overflow := quadraticGasCost(oldMemSizeWords, params.MemoryGas, params.QuadCoeffDiv)
	if overflow {
		// This should not happen since the old memory size is smaller than the new one.
		return 0, ErrGasUintOverflow
	}
	// The final cost is the difference between the new and old cost.
	cost := newCost - oldCost
	mem.lastGasCost = newCost

	return cost, nil
}

// quadraticGasCost calculates the quadratic gas cost with the given coefficient.
func quadraticGasCost(words, coefficient, quadCoeffDiv uint64) (uint64, bool) {
	// The quadratic term is words * words / quadCoeffDiv, where words is the number of words.
	// We can use bits.Mul64 to calculate words * words, which returns the high and low 64 bits.
	// This can avoid overflow when words is large.
	hi, lo := bits.Mul64(words, words)

	// If hi is not zero, it means the result has overflown the uint64. But if the quadCoeffDiv
	// is large enough, the final result may still be within the range.
	if hi != 0 {
		if hi > math.MaxUint64/quadCoeffDiv {
			return 0, true
		}
	}
	quadratic := hi*math.MaxUint64/quadCoeffDiv + (lo/quadCoeffDiv + (hi%quadCoeffDiv)*math.MaxUint64/quadCoeffDiv)

	// The linear term is words * coefficient
	linear, overflow := bits.Mul64(words, coefficient)
	if overflow {
		return 0, true
	}
	// The total cost is the sum of the linear and quadratic terms
	cost, overflow := bits.Add64(linear, quadratic, 0)
	return cost, overflow != 0
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/internal/debug/api.go">
```go
// MemStats returns detailed runtime memory statistics.
func (*HandlerT) MemStats() *runtime.MemStats {
	s := new(runtime.MemStats)
	runtime.ReadMemStats(s)
	return s
}

// GcStats returns GC statistics.
func (*HandlerT) GcStats() *debug.GCStats {
	s := new(debug.GCStats)
	debug.ReadGCStats(s)
	return s
}

// SetGCPercent sets the garbage collection target percentage. It returns the previous
// setting. A negative value disables GC.
func (*HandlerT) SetGCPercent(v int) int {
	return debug.SetGCPercent(v)
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
// AccountRef is a ContractRef that represents an account which can be called.
type AccountRef common.Address

// Address returns the address of the contract
func (ar AccountRef) Address() common.Address {
	return (common.Address)(ar)
}

// Contract represents a contract call stack
type Contract struct {
	// CallerAddress is the result of the caller stack frame and is used to assist
	// in determining the caller's address. It's quite complicated getting the
	// address of the caller of the current context. It's not as simple as just
	// getting the parent from the call stack.
	//
	// CallerAddress returns the address of the contract that initiated the call.
	// For a regular call, it's the same as the caller. For a delegatecall, it's
	// the caller of the caller (i.e. the original caller).
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests map[common.Hash]bitvec // Aggregated result of JUMPDEST analysis.
	analysis  bitvec                 // JUMPDEST analysis.

	Code     []byte
	CodeHash common.Hash
	Input    []byte
	Gas      uint64
	value    *big.Int
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{CallerAddress: caller.Address(), caller: caller, self: object, value: value, Gas: gas}
	return c
}

// AsDelegate sets the contract to be a delegate call and returns the contract.
//
// Delegate call sets the caller of the child frame to the caller of the parent frame
// and the value of the child frame to the value of the parent frame.
func (c *Contract) AsDelegate() *Contract {
	c.CallerAddress = c.caller.Address()
	// NOTE: caller contains the address of the caller, but self is the address
	// of the current context which is the contract being executed.
	return c
}

// GetOp returns the n'th element in the contract's byte code.
func (c *Contract) GetOp(n uint64) vm.OpCode {
	if n < uint64(len(c.Code)) {
		return vm.OpCode(c.Code[n])
	}
	return vm.STOP
}
```
</file>

## Prompt Corrections
The original prompt specifies a very detailed and layered approach to memory allocation, including custom allocators for `U256`, `Hash`, and `Address`. This is characteristic of languages with manual memory management like C++, Rust, or Zig.

In Go, memory management is handled by the garbage collector. The primary performance optimization is to reduce GC pressure by reusing objects via pools (`sync.Pool`). Go-ethereum uses this pattern for larger, frequently allocated objects like the `EVM` interpreter state and `Stack`, but not for small, fixed-size value types like `common.Address` or `common.Hash` (which are just byte arrays).

Therefore, the implementation should focus on:
1.  **`sync.Pool` for complex objects**: The most idiomatic and effective Go pattern. The `vmPool` in `state_processor.go` and the `stackPool` in `stack.go` are excellent examples.
2.  **Efficient `Memory` management**: The `Memory` object in `memory.go` acts like a resizable arena for a single call frame. It's a large byte slice that is expanded as needed and then discarded, which is a very effective pattern in Go.
3.  **Statistics through `go-metrics` and `debug` API**: Geth doesn't track raw `malloc`/`free` counts. Instead, it exposes Go's runtime memory stats (`runtime.MemStats`, `debug.GCStats`) via its `debug` RPC API. This is the correct place to source statistics from.

The prompt's `LayoutOptimizer` is not applicable to Go, as struct layout is managed by the Go compiler and is not something a developer typically optimizes manually. The focus should be on algorithmic efficiency and reducing GC overhead, which the go-ethereum examples demonstrate well.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
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
	"math/big"
	"sync"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/params"
)

var (
	interpreterPool = sync.Pool{
		New: func() interface{} {
			return new(Interpreter)
		},
	}
)

// Interpreter is an EVM interpreter for executing EVM code.
type Interpreter struct {
	evm *EVM
	cfg Config

	// Scope contains the interpreter's call context.
	Scope ScopeContext

	gas         uint64
	readOnly    bool   // Whether to throw on state changing opcodes
	returnData  []byte // Last CALL's return data for subsequent reuse
	activeJumps map[common.Hash]map[uint64]bitvec
}

// NewEVMInterpreter returns a new interpreter for executing EVM code.
func NewEVMInterpreter(evm *EVM, cfg Config) *Interpreter {
	in := interpreterPool.Get().(*Interpreter)
	in.evm = evm
	in.cfg = cfg
	in.activeJumps = make(map[common.Hash]map[uint64]bitvec)
	return in
}

// Run executes the given contract and returns the results.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() {
		in.evm.depth--
	}()

	// Reset the previous state if the interpreter is being reused
	in.returnData = nil
	in.gas = contract.Gas
	in.readOnly = readOnly
	in.Scope.Stack = newStack(true)
	in.Scope.Memory = newMemory(true)
	in.Scope.Contract = contract

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = in.Scope.Memory // allocated memory
		stack       = in.Scope.Stack  // local stack
		callContext = in.evm.callContext()
		// For optimisation, referenceCode directly, https://github.com/ethereum/go-ethereum/pull/14482
		code     = contract.Code
		codeHash = contract.CodeHash
		pc       = uint64(0) // program counter
		cost     uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the deferred logger
		gasCopy uint64 // needed for the deferred logger
		logged  bool   // deferred logger should ignore already logged steps
	)
	contract.Input = input

	// Don't bother with the execution if there's no code.
	if len(code) == 0 {
		return nil, nil
	}

	// Make sure the interpreter is cleaned up in case of a panic.
	defer func() {
		// Return the stack to the pool if not in a snapshot.
		if in.evm.snapshot == nil {
			returnStack(stack, true)
			returnMemory(mem, true)
			interpreterPool.Put(in)
		}
	}()
	[...]
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

import (
	"fmt"
	"math/big"
	"sync"
)

var stackPool = sync.Pool{
	New: func() interface{} {
		return &Stack{data: make([]*big.Int, 0, 16)}
	},
}

func newStack(pooled bool) *Stack {
	if pooled {
		return stackPool.Get().(*Stack)
	}
	return new(Stack)
}

func returnStack(s *Stack, pooled bool) {
	if pooled {
		s.data = s.data[:0]
		stackPool.Put(s)
	}
}

// Stack is a stack of 256 bit words.
type Stack struct {
	data []*big.Int
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []*big.Int {
	return st.data
}

// push pushes a new element to the stack.
// Note: this method is not thread safe and it's up to the caller to ensure that there are no
// concurrent modification to the stack.
func (st *Stack) push(d *big.Int) {
	st.data = append(st.data, d)
}

// Pop pops the top element from the stack and returns it.
func (st *Stack) pop() *big.Int {
	val := st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return val
}

// Len returns the number of elements in the stack.
func (st *Stack) len() int {
	return len(st.data)
}

// Swap swaps the top two elements of the stack.
func (st *Stack) swap(n int) {
	st.data[st.len()-n], st.data[st.len()-1] = st.data[st.len()-1], st.data[st.len()-n]
}

// Dup duplicates the nth element from the top of the stack and pushes it on top.
func (st *Stack) dup(n int) {
	st.push(st.data[st.len()-n])
}

// Peek returns the nth element from the top of the stack without removing it.
func (st *Stack) peek() *big.Int {
	return st.data[st.len()-1]
}

// Back returns the nth element from the stack.
func (st *Stack) Back(n int) *big.Int {
	return st.data[st.len()-1-n]
}

// require ensures that the stack has at least n elements.
func (st *Stack) require(n int) error {
	if st.len() < n {
		return fmt.Errorf("stack underflow (%d < %d)", st.len(), n)
	}
	return nil
}
[...]
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
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
	"fmt"
	"math/big"
	"sync"
)

var memoryPool = sync.Pool{
	New: func() interface{} {
		return &Memory{}
	},
}

func newMemory(pooled bool) *Memory {
	if pooled {
		return memoryPool.Get().(*Memory)
	}
	return new(Memory)
}

func returnMemory(mem *Memory, pooled bool) {
	if pooled {
		mem.store = nil
		memoryPool.Put(mem)
	}
}

// Memory defines a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// Set sets offset + size to value
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size > 0 {
		// length of store may be smaller than offset + size.
		// In that case, we need to resize store to required size.
		if offset+size > uint64(len(m.store)) {
			panic("INVALID memory access")
		}
		copy(m.store[offset:offset+size], value)
	}
}

// Set32 sets the 32 bytes starting at offset to value. value will be left-padded
// with zeroes if it's shorter than 32 bytes.
func (m *Memory) Set32(offset uint64, val *big.Int) {
	// length of store may be smaller than offset + size.
	// In that case, we need to resize store to required size.
	if offset+32 > uint64(len(m.store)) {
		panic("INVALID memory access")
	}
	// `big.Int.Bytes()` will not include leading zeros
	val.FillBytes(m.store[offset : offset+32])
}

// Resize resizes the memory to size
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// Get returns offset + size as a new slice
func (m *Memory) Get(offset, size int64) []byte {
	return m.GetPtr(offset, size)
}

// GetPtr returns a slice that references the underlying memory
func (m *Memory) GetPtr(offset, size int64) []byte {
	if size == 0 {
		return nil
	}

	if int64(len(m.store)) < offset+size {
		return common.RightPadBytes(m.store[offset:], int(size))
	}
	return m.store[offset : offset+size]
}
[...]
// Len returns the length of the memory
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// Copyright 2016 The go-ethereum Authors
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

	"github.com/ethereum/go-ethereum/params"
)

// memoryGasCost calculates the quadratic gas for memory expansion.
func memoryGasCost(memSize, newMemSize uint64) (uint64, error) {
	if newMemSize == 0 {
		return 0, nil
	}
	// memory is measured in words.
	words := newMemSize / 32
	// (words*words)/512 + 3*words
	// since we are using big integer, we can ignore overflow checks
	memSize, overflow := words*params.MemoryGas+words*words/params.QuadCoeffDiv, words > 0xffffffff
	if overflow {
		memSize = 0xffffffffffffffff
	}

	// prevent overflow
	if memSize > ^uint64(0) {
		return 0, ErrGasUintOverflow
	}
	return uint64(memSize), nil
}
[...]
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
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
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// AccountRef implements ContractRef.
//
// AccountRef is used to refer to the contract's backing object
// when it is clear that the backing object is a VM account.
type AccountRef common.Address

// Address returns the contract address
func (ar AccountRef) Address() common.Address {
	return (common.Address)(ar)
}

// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the caller stack.
	//
	// Note: This is not the actual caller of the call. It is the caller of the
	// caller, stack-wise. E.g. the one that is referenced by the CALLER opcode,
	// not the one that is referenced by the ADDRESS opcode.
	//
	// CallerAddress is an optional field. In order to use this field, it must
	// be set to a non-nil value.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests map[common.Hash]bitvec // Aggregated result of JUMPDEST analysis.
	analysis  map[common.Hash]bitvec // JUMPDEST analysis result for given code.

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	Gas   uint64
	value *big.Int
}

// NewContract returns a new contract environment for the execution of EVM without
// a backing state object. The returned contract is a 'pre-construction' contract
// without code or input defined.
//
// The Contract has an optional endowment which is moved from the caller to the
// contract's account.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{
		caller: caller,
		self:   object,
		Gas:    gas,
		value:  new(big.Int),
	}
	if value != nil {
		c.value.Set(value)
	}
	return c
}

// AsDelegate creates a new contract with the destination address as the contract address
// but sets the caller to the original caller and sets the value to the original value.
func (c *Contract) AsDelegate() *Contract {
	// NOTE: caller must, in the current design, be a
	//       AccountRef but we can't force this in the type system.
	return &Contract{
		caller: c.caller,
		self:   c.self,
		value:  c.value,
		Gas:    c.Gas,
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
// Caller will Panic if the caller is not set.
func (c *Contract) Caller() common.Address {
	return c.caller.Address()
}

// UseGas attempts to use gas and returns true if it thinks it is successful.
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

// SetCallCode sets the code and code hash of the contract.
// It is used for callcode operations.
func (c *Contract) SetCallCode(addr *common.Address, hash common.Hash, code []byte) {
	c.self = AccountRef(*addr)
	c.Code = code
	c.CodeHash = hash
}
[...]
```
</file>
</go-ethereum>
```

In []:Geth, memory management is performance-critical and heavily optimized, especially for objects that are frequently created and destroyed during EVM execution.

### Object Pooling for Execution Frames (`Interpreter`)

Geth uses `sync.Pool` to manage and reuse `Interpreter` objects, which are analogous to the `Frame` objects in the prompt. This avoids constant allocation and garbage collection for each new call in the call stack.

-   **`interpreterPool`**: A global pool to store and retrieve `Interpreter` instances.
-   **`NewEVMInterpreter`**: This acts as a factory function. Instead of creating a new `Interpreter` from scratch every time, it first tries to get one from the pool.
-   **`Run` Method**: After the `Run` method completes, the `Interpreter` object (along with its `Stack` and `Memory`) is put back into the appropriate pool for reuse. This "acquire-release" pattern is central to Geth's performance.

```go
// From: core/vm/interpreter.go

var (
	interpreterPool = sync.Pool{
		New: func() interface{} {
			return new(Interpreter)
		},
	}
)

// Interpreter is an EVM interpreter for executing EVM code.
type Interpreter struct {
	evm *EVM
	cfg Config

	// Scope contains the interpreter's call context.
	Scope ScopeContext
	// ...
}

// NewEVMInterpreter returns a new interpreter for executing EVM code.
func NewEVMInterpreter(evm *EVM, cfg Config) *Interpreter {
	in := interpreterPool.Get().(*Interpreter)
	in.evm = evm
	in.cfg = cfg
	in.activeJumps = make(map[common.Hash]map[uint64]bitvec)
	return in
}

// Run executes the given contract and returns the results.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (execution logic) ...

	// Make sure the interpreter is cleaned up in case of a panic.
	defer func() {
		// Return the stack and memory to their pools
		returnStack(stack, true)
		returnMemory(mem, true)
		interpreterPool.Put(in)
	}()
    // ...
}
```

### Object Pooling for `Stack` and `Memory`

Similarly, the `Stack` and `Memory` objects, which are part of each execution frame, are also pooled.

-   **`stackPool`**: A `sync.Pool` specifically for `Stack` objects. `newStack` acquires from the pool, and `returnStack` releases back to it.
-   **`memoryPool`**: A `sync.Pool` for `Memory` objects. The `newMemory` and `returnMemory` functions manage its lifecycle.

This strategy directly corresponds to the `FrameAllocator` and `ObjectPool` requirements in the prompt.

```go
// From: core/vm/stack.go

var stackPool = sync.Pool{
	New: func() interface{} {
		return &Stack{data: make([]*big.Int, 0, 16)}
	},
}

func newStack(pooled bool) *Stack {
	if pooled {
		return stackPool.Get().(*Stack)
	}
	return new(Stack)
}

func returnStack(s *Stack, pooled bool) {
	if pooled {
		s.data = s.data[:0]
		stackPool.Put(s)
	}
}

// Stack is a stack of 256 bit words.
type Stack struct {
	data []*big.Int
}
```

```go
// From: core/vm/memory.go

var memoryPool = sync.Pool{
	New: func() interface{} {
		return &Memory{}
	},
}

func newMemory(pooled bool) *Memory {
	if pooled {
		return memoryPool.Get().(*Memory)
	}
	return new(Memory)
}

func returnMemory(mem *Memory, pooled bool) {
	if pooled {
		mem.store = nil
		memoryPool.Put(mem)
	}
}

// Memory defines a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// Resize resizes the memory to size
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// Len returns the length of the memory
func (m *Memory) Len() int {
	return len(m.store)
}
```

### Arena-like Memory Expansion and Gas Cost

Geth's `Memory` object behaves like an arena allocator for a single execution frame. It's a contiguous slice of memory that can only grow. It is not freed until the entire frame is complete. The cost of this expansion is quadratic, which is a critical detail for any EVM implementation.

```go
// From: core/vm/gas.go

// memoryGasCost calculates the quadratic gas for memory expansion.
func memoryGasCost(memSize, newMemSize uint64) (uint64, error) {
	if newMemSize == 0 {
		return 0, nil
	}
	// memory is measured in words.
	words := newMemSize / 32
	// (words*words)/512 + 3*words
	memSize, overflow := words*params.MemoryGas+words*words/params.QuadCoeffDiv, words > 0xffffffff
	if overflow {
		memSize = 0xffffffffffffffff
	}

	// prevent overflow
	if memSize > ^uint64(0) {
		return 0, ErrGasUintOverflow
	}
	return uint64(memSize), nil
}
```

### `Contract` as Context Holder

The `Contract` object in Geth holds the context for an execution, such as the code to be run and the input data. It is created for each call and provides the necessary parameters to the pooled `Interpreter` object.

```go
// From: core/vm/contract.go

// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the caller stack.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests map[common.Hash]bitvec // Aggregated result of JUMPDEST analysis.
	analysis  map[common.Hash]bitvec // JUMPDEST analysis result for given code.

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	Gas   uint64
	value *big.Int
}

// NewContract returns a new contract environment for the execution of EVM without
// a backing state object.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{
		caller: caller,
		self:   object,
		Gas:    gas,
		value:  new(big.Int),
	}
	if value != nil {
		c.value.Set(value)
	}
	return c
}
```

---

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
		// allow value to be nil, which is semantically identical to a slice of zeros
		if len(value) == 0 {
			value = nil
		}
		m.resize(offset + size)
		copy(m.store[offset:], value)
	}
}

// Set32 sets the 32 bytes starting at offset to value.
// The value is left-padded with zeros if it's shorter than 32 bytes.
func (m *Memory) Set32(offset uint64, value *uint256.Int) {
	m.resize(offset + 32)
	value.WriteToSlice(m.store[offset : offset+32])
}

// resize resizes the memory to size, which must be a multiple of 32.
func (m *Memory) resize(size uint64) {
	if uint64(len(m.store)) < size {
		// In the common case, the size difference is small and we can do one
		// allocation. Otherwise, we have to loop.
		if size > uint64(len(m.store)+1024) {
			// Big growth, allocate in chunks of 256k.
			grown := make([]byte, size-uint64(len(m.store)))
			m.store = append(m.store, grown...)
		} else {
			m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
		}
	}
}

// Get returns size bytes starting at offset.
func (m *Memory) Get(offset, size uint64) (cpy []byte) {
	if size == 0 {
		return nil
	}
	if uint64(len(m.store)) > offset {
		cpy = make([]byte, size)
		copy(cpy, m.store[offset:offset+size])
		return
	}
	return nil
}

// GetPtr returns a slice that points to the memory data from offset.
// The returned slice is not a copy and changes to it will be reflected in the memory.
func (m *Memory) GetPtr(offset, size uint64) []byte {
	if uint64(len(m.store)) < offset+size {
		m.resize(offset + size)
	}
	return m.store[offset : offset+size]
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a simple stack implementation for the EVM.
type Stack struct {
	data []*uint256.Int
}

// NewStack returns a new stack with a maximum capacity of n.
func NewStack(n int) *Stack {
	return &Stack{data: make([]*uint256.Int, 0, n)}
}

// Data returns the underlying uint256.Int array.
func (st *Stack) Data() []*uint256.Int {
	return st.data
}

// Push pushes a value onto the stack.
func (st *Stack) Push(d *uint256.Int) {
	st.data = append(st.data, d)
}

// Pop pops a value from the stack.
func (st *Stack) Pop() (ret *uint256.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// Len returns the number of elements on the stack.
func (st *Stack) Len() int {
	return len(st.data)
}

// Swap swaps the top two values on the stack.
func (st *Stack) Swap(n int) {
	st.data[st.len()-n], st.data[st.len()-1] = st.data[st.len()-1], st.data[st.len()-n]
}

// Dup duplicates the nth value on the stack.
func (st *Stack) Dup(n int) {
	st.Push(st.data[st.len()-n])
}

// Peek returns the nth value on the stack without removing it.
func (st *Stack) Peek(n int) *uint256.Int {
	return st.data[st.len()-n-1]
}

// Back returns the n'th item in stack
func (st *Stack) Back(n int) *uint256.Int {
	return st.data[st.len()-n-1]
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
// First you need to obtain a state object.
//   obj := newObject(db, ...)
// Then you can use your retrieved state object with the following methods.
//   - GetBalance()
//   - GetNonce()
//   - GetCode()
//   - GetState()
//   - SetState()
//
// Then, call CommitTrie to write the modified storage trie to the database.
//   root, err := obj.CommitTrie(db)
//
// Finally, update the object hash in the containing trie.
//   state.Update(obj.Address(), obj.data)
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.StateAccount
	db       *StateDB

	// Write caches.
	originStorage Storage // Storage cache of original entries to dedup rewrites, updated only if state is dirty
	pendingStorage Storage // Storage entries that need to be flushed to disk, at the end of a transaction
	dirtyStorage   Storage // Storage entries that have been modified in the current transaction execution
...
}

var stateObjectPool = sync.Pool{
	New: func() interface{} {
		return new(stateObject)
	},
}

// newObject creates a state object.
func newObject(db *StateDB, address common.Address, data types.StateAccount) *stateObject {
	// If the object is being created, all fields will be nil.
	// The dirtyStorage is only used for the duration of the state transition,
	// and will be reset to nil at the end of the state transition.
	obj := stateObjectPool.Get().(*stateObject)
	obj.db = db
	obj.address = address
	obj.addrHash = crypto.Keccak256Hash(address[:])
	obj.data = data
	obj.originStorage = nil
	obj.pendingStorage = nil
	obj.dirtyStorage = make(Storage)
	obj.dirtyCode = nil
	obj.suicided = false
	obj.deleted = false
	return obj
}

// returnObjectToPool returns a state object to the pool.
//
// After returned, the object should not be used anymore.
func returnObjectToPool(obj *stateObject) {
	// The fields of the returned object will be overwritten by the next
	// invocation of newObject.
	stateObjectPool.Put(obj)
}

// GetState retrieves a value from the account storage trie.
func (s *stateObject) GetState(key common.Hash) common.Hash {
	// If the value was loaded before, return the cached value
	if value, dirty := s.dirtyStorage[key]; dirty {
		return value
	}
	// If we have a pending storage modification, that's the one to use
	if value, pending := s.pendingStorage[key]; pending {
		return value
	}
	// If we have a live original storage, that's the one to use
	if value, fresh := s.originStorage[key]; fresh {
		return value
	}
	// If the contract was destructed, the storage is empty
	if s.suicided {
		return common.Hash{}
	}
	// If the object was just created, all storage slots are empty
	if s.data.Root == types.EmptyRootHash {
		return common.Hash{}
	}
	// If the storage was not loaded yet, load it now and cache
	if s.originStorage == nil {
		s.originStorage = make(Storage)
	}
	val, _ := s.db.GetCommittedState(s.address, key) // TODO(karalabe): this is a problem
	s.originStorage[key] = val
	return val
}

// SetState updates a value in the account storage trie.
func (s *stateObject) SetState(key, value common.Hash) {
	// If the new value is the same as old, don't set
	if s.GetState(key) == value {
		return
	}
	// New value is different, update the dirty storage
	s.db.journal.append(storageChange{
		account:  &s.address,
		key:      key,
		prevalue: s.GetState(key),
	})
	s.setState(key, value)
}

func (s *stateObject) setState(key, value common.Hash) {
	s.dirtyStorage[key] = value
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// JUMPDEST analysis.
//
// The code below is a replica of the contents of `go-ethereum/core/vm/analysis.go`.
// The only things that have been changed are:
//   - `isPush` and `isterminating` were inlined
//   - `OpCode` was replaced by `byte`
//
// The purpose of the duplication is to demonstrate that it is possible to create a
// version of the analysis code which is not dependent on `go-ethereum/core/vm`.
// The goal is to move the analysis code to a location where it can be used by
// other packages without introducing a dependency on `core/vm`.

var (
	analysedCode      = make(map[common.Hash][]byte)
	analysedCodeMutex sync.RWMutex
)

// validJumpdest returns a bit vector of valid jump destinations.
// The returned bit vector is a copy, so it's safe to use it without locking.
func validJumpdests(code []byte) []byte {
	h := crypto.Keccak256Hash(code)
	analysedCodeMutex.RLock()
	// This is the common case, we'll have a cached result for this
	if bitvec, ok := analysedCode[h]; ok {
		analysedCodeMutex.RUnlock()
		return bitvec
	}
	analysedCodeMutex.RUnlock()
	// We don't have a cached version, do it now
	// It's possible that we do the same work twice, if two threads enter
	// this path, but it's not a problem.
	bitvec := codeAnalysis(code)
	analysedCodeMutex.Lock()
	analysedCode[h] = bitvec
	analysedCodeMutex.Unlock()
	return bitvec
}

// codeAnalysis performs aues validity analysis on a given code base.
func codeAnalysis(code []byte) []byte {
	// The bit vector of valid jump destinations
	bitvec := make([]byte, len(code)/8+1)

	// Iterate over the code and find JUMPDEST instructions
	for i := 0; i < len(code); {
		// If the instruction is a JUMPDEST, set it in the bit vector
		if OpCode(code[i]) == JUMPDEST {
			set(bitvec, uint64(i))
		}
		// If the instruction is a PUSH, skip over its data
		if OpCode(code[i]).isPush() {
			i += int(code[i] - PUSH1 + 2)
		} else {
			i++
		}
	}
	return bitvec
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
var (
	// table is the list of functions which implement the EVM opcodes.
	table [256]*operation
	// pool is a pool of uint256.Int to be used throughout the execution of the
	// EVM.
	pool = new(intpool)
)

func init() {
	// Fills the jump table with the opcodes.
	// This can be done only once.
	table = [256]*operation{
		// 0x0 range - arithmetic ops
		STOP: {
			execute:     opStop,
			gas:         0,
			writes:      true,
			valid:       true,
			returns:     true,
			memorySize:  nil,
			halts:       true,
			minStack:    minStack(0, 0),
			maxStack:    maxStack(0, 0),
			constantGas: true,
		},
		ADD: {
			execute:     opAdd,
			gas:         GasFastestStep,
			valid:       true,
			memorySize:  nil,
			minStack:    minStack(2, 1),
			maxStack:    maxStack(2, 1),
			constantGas: true,
		},
...
// And so on for all opcodes
...
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/txpool/pool.go">
```go
import (
	"errors"
	"fmt"
	"math/big"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
	"github.com/ethereum/go-ethereum/metrics"
)
...
var (
	// txPoolLabels are the labels used to numerate the transactions in the current pool.
	txPoolLabels = []string{"pending", "queued"}

	// transaction discard reasons for metering.
	discardReasons = []string{
		"invalid",
		"invalid sender",
		"bad nonce",
		"too cheap",
		"limit exceeded",
	}
)
...
// TxPool implements the transaction pool.
type TxPool struct {
...
	txFeed event.Feed
	scope  event.SubscriptionScope
	chain  ChainReader

	mu              sync.RWMutex
	currentHead     atomic.Pointer[types.Header]
	reqResetCh      chan *txpoolResetRequest
	reqPromoteCh    chan *accountPromoteRequest
	queueTxEventCh  chan *types.Transaction
	reorgDoneCh     chan chan struct{}
	quitCh          chan struct{}
	processTxCh     chan *types.Transaction
	processSubPools []SubPool
...
	// transaction pool object for GC'ing, etc.
	txs *txpool.Transactions

	// Hooks for testing.
	priced txSortedMap
}
...
// newTxPool creates a new transaction pool.
func newTxPool(config TxPoolConfig, chain ChainReader, subPools []SubPool) *TxPool {
	// Sanitize the input to ensure no crashes occur
	config = config.sanitize()
	if subPools == nil {
		subPools = []SubPool{newLegacySubPool(config, chain)}
	}
	// Create the transaction pool
	pool := &TxPool{
		config:          config,
		chain:           chain,
		processSubPools: subPools,
		reqResetCh:      make(chan *txpoolResetRequest),
		reqPromoteCh:    make(chan *accountPromoteRequest),
		queueTxEventCh:  make(chan *types.Transaction),
		reorgDoneCh:     make(chan chan struct{}),
		quitCh:          make(chan struct{}),
		processTxCh:     make(chan *types.Transaction, processChCapacity),
		txs:             txpool.NewTransactions(config.AccountSlots, config.GlobalSlots, config.GlobalQueue, config.MinSlotGas),
		priced:          newTxSortedMap(),
	}
...
	return pool
}

// sanitize checks the provided user configurations and changes anything that's
// unreasonable or unworkable.
func (config *TxPoolConfig) sanitize() TxPoolConfig {
	conf := *config
	if conf.AccountSlots == 0 {
		conf.AccountSlots = defaultAccountSlots
	}
	if conf.GlobalSlots == 0 {
		conf.GlobalSlots = defaultGlobalSlots
	}
	if conf.GlobalQueue == 0 {
		conf.GlobalQueue = defaultGlobalQueue
	}
	if conf.Lifetime == 0 {
		conf.Lifetime = defaultLifetime
	}
	return conf
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
//
// When a contract is created, it is created with an initial gas limit, which is
// then decreased with each executed instruction. If the gas limit is reached,
// any changes made by the contract are reverted and the contract is out of gas.
type Contract struct {
	// CallerAddress is the result of the caller stack.
	// e.g. the address of the EOA or the address of the contract that
	// is executing this contract.
	//
	// CallerAddress is not cleared after a call returns and will be incorrect
	// if the contract is reused. The caller may need to explicitly set this
	// field.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	analysis  bitvec       // result of CODE analysis.

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	value *uint256.Int
	Gas   uint64

	// контракт может быть настроен так, чтобы вызывать себя,
	// и это поле используется для предотвращения его случайного
	// возврата в пул sync.Pool.
	inPool bool
}

// AsDelegate sets the contract to be a delegate call and returns the contract.
// It is used to chain calls.
func (c *Contract) AsDelegate() *Contract {
	c.caller = c.self
	// NOTE: gas is not reset
	return c
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/intpool.go">
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
	"sync"

	"github.com/holiman/uint256"
)

// intPool is a pool of uint256.Int
type intPool struct {
	pool *sync.Pool
}

// newintpool creates a new intPool.
func newIntPool() *intPool {
	return &intPool{pool: new(sync.Pool)}
}

// get returns a uint256.Int from the pool.
func (p *intPool) get() *uint256.Int {
	if v := p.pool.Get(); v != nil {
		return v.(*uint256.Int)
	}
	return new(uint256.Int)
}

// getZ gets a uint256.Int from the pool and sets it to zero.
func (p *intPool) getZ() *uint256.Int {
	v := p.get()
	v.Clear()
	return v
}

// put returns a uint256.Int to the pool.
func (p *intPool) put(is ...*uint256.Int) {
	for _, i := range is {
		p.pool.Put(i)
	}
}

// pool is the global intPool.
var pool = newIntPool()
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/miner/worker.go">
```go
type task struct {
	receipts    types.Receipts
	state       *state.StateDB
	block       *types.Block
	unconfirmed *unconfirmedBlocks
	createdAt   time.Time
}

// worker is the main object which takes care of applying messages to the new state.
type worker struct {
	config      *Config
	engine      consensus.Engine
	eth         Backend
	mux         *event.TypeMux
	chain       *core.BlockChain
	localTxs    *locals.Manager
	remoteTxs   *txpool.TxPool
	unconfirmed *unconfirmedBlocks

	mu sync.RWMutex

	current      *task
	newWorkCh    chan *task
	newTxsSub    event.Subscription
	newLogsSub   event.Subscription
	chainHeadSub event.Subscription
	chainSideSub event.Subscription
	resubmitSub  *event.Resubscription
	fetcherSub   *event.Resubscription

	snapshotMu     sync.RWMutex
	snapshotState  *state.StateDB
	snapshotBlock  *types.Block
	snapshotReceipts types.Receipts
	snapshotTxs    []*types.Transaction

	possibleReorg bool
	pendingLogs   []*types.Log

	txsCh  chan core.NewTxsEvent
	wg     sync.WaitGroup
	quitCh chan struct{}

	isLocalBlock func(header *types.Header) (common.Address, bool)

	// Hooks for testing
	newWorkHook        func(task *task)            // Method to call upon receiving new work
	resubmitHook       func(time.Duration)        // Method to call upon resubmitting a sealing work
	fullTaskHook       func()                     // Method to call when a new sealing task is generated
	skipSealHook       func(task *task) bool       // Method to call to decide whether to seal the block or not
	pendingBlockHook   func()                     // Method to call when a new pending block is generated
}

// newWorker creates a new worker instance.
func newWorker(config *Config, engine consensus.Engine, eth Backend) *worker {
...
	worker := &worker{
		config:         config,
		engine:         engine,
		eth:            eth,
		mux:            eth.EventMux(),
		chain:          eth.BlockChain(),
		localTxs:       eth.LocalTxs(),
		remoteTxs:      eth.TxPool(),
		unconfirmed:    newUnconfirmedBlocks(eth.BlockChain(), config.Recommit),
		newWorkCh:      make(chan *task, 1),
		txsCh:          make(chan core.NewTxsEvent, txsChSize),
		quitCh:         make(chan struct{}),
		isLocalBlock:   eth.IsLocalBlock,
	}
...
	worker.newTxsSub = eth.TxPool().SubscribeTransactions(worker.txsCh, true)
	// Subscribe to chain events to trigger new work and abort any stale work.
	worker.chainHeadSub = eth.BlockChain().SubscribeChainHeadEvent(make(chan core.ChainHeadEvent, chainHeadChSize))
	worker.chainSideSub = eth.BlockChain().SubscribeChainSideEvent(make(chan core.ChainSideEvent, chainSideChSize))
	worker.newLogsSub = eth.BlockChain().SubscribeLogsEvent(make(chan []*types.Log, newLogsChSize))
...
	return worker
}
...
// commit runs a single block sealing, returning whether a block was produced.
func (w *worker) commit(task *task, seal bool) bool {
	start := time.Now()

	// If we are consuming the last unconfirmed block, note it as such
	unconfirmed := task.unconfirmed
	if unconfirmed != nil && len(unconfirmed.blocks) > 0 {
		block := unconfirmed.blocks[0]
		w.eth.SetSynced() // The node is in sync when the first unconfirmed block is processed.
		log.Info("Committing reorg-ed block", "number", block.Number(), "hash", block.Hash(), "parent", block.ParentHash())
	} else if task.block.NumberU64() == 0 {
		w.eth.SetSynced() // The node is in sync when the genesis block is processed.
		log.Info("Committing genesis block", "hash", task.block.Hash())
	} else {
		log.Info("Committing new work", "number", task.block.Number(), "sealhash", task.block.Hash(), "uncles", len(task.block.Uncles()), "txs", len(task.block.Transactions()), "gas", task.block.GasUsed(), "fees", task.block.Fee(), "elapsed", common.PrettyDuration(time.Since(task.createdAt)))
	}
	// Finalize and seal the block
	if seal {
		if _, err := w.engine.Seal(w.chain, task.block, w.quitCh, nil); err != nil {
			log.Warn("Block sealing failed", "err", err)
			return false
		}
	}
	// If we're testing and asked to skip sealing, wait for an external trigger
	if w.skipSealHook != nil && w.skipSealHook(task) {
		return false
	}
	// Now that the block is sealed, we have a "final" block that can be inserted
	// into the canonical chain.
	fullBlock := types.NewBlockWithHeader(task.block.Header())
	fullBlock = fullBlock.WithBody(task.block.Body())

	// Write the block to the chain.
	if _, err := w.chain.WriteBlockWithState(fullBlock, task.receipts, task.state); err != nil {
		log.Crit("Failed to write block to chain", "err", err)
		return false
	}
	log.Info("Successfully sealed new block", "number", fullBlock.Number(), "hash", fullBlock.Hash(), "age", common.PrettyAge(time.Unix(int64(fullBlock.Time()), 0)), "gas", fullBlock.GasUsed(), "fees", task.block.Fee())

	// Broadcast the block and announce chain insertion event
	w.mux.Post(core.NewMinedBlockEvent{Block: fullBlock})

	// Insert the block into the set of pending ones to wait for confirmations
	w.unconfirmed.Insert(fullBlock.NumberU64(), fullBlock.Hash())

	// Print some statistics for the user to see what's going on
	var (
		txs = task.block.Transactions()
		gas = task.block.GasUsed()
	)
	if unconfirmed != nil && len(unconfirmed.blocks) > 0 {
		unconfirmed.Shift()
	}
	log.Info("Commit new mining work", "number", fullBlock.Number()+1, "sealhash", fullBlock.Hash(), "txs", len(txs), "gas", gas, "fees", task.block.Fee(), "elapsed", common.PrettyDuration(time.Since(start)))
	return true
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/internal/ethapi/api.go">
```go
// Package ethapi provides the implementation of the `eth` namespace RPC API.
// It is separated from the `eth` package so that other packages can also use
// this API implementation.
package ethapi

import (
	"context"
	"errors"
	"fmt"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/consensus"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/core/bloombits"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/eth/gasprice"
	"github.com/ethereum/go-ethereum/eth/tracers"
	"github.com/ethereum/go-ethereum/ethdb"
	"github.com/ethereum/go-ethereum/event"
	"github.com/ethereum/go-ethereum/internal/ethapi/override"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/p2p"
	"github.com/ethereum/go-ethereum/rpc"
)

// Backend interface provides the common API services (that are provided by
// both full and light clients) with access to necessary functions.
type Backend interface {
	// General Ethereum API
	SyncProgress(ctx context.Context) ethereum.SyncProgress
	SuggestGasTipCap(ctx context.Context) (*big.Int, error)
	FeeHistory(ctx context.Context, blockCount uint64, lastBlock rpc.BlockNumber, rewardPercentiles []float64) (*big.Int, [][]*big.Int, []*big.Int, []float64, []*big.Int, []float64, error)
	BlobBaseFee(ctx context.Context) *big.Int
	ChainDb() ethdb.Database
	AccountManager() *accounts.Manager
	ExtRPCEnabled() bool
	RPCGasCap() uint64            // global gas cap for eth_call over rpc: DoS protection
	RPCEVMTimeout() time.Duration // global timeout for eth_call over rpc: DoS protection
	RPCTxFeeCap() float64         // global tx fee cap for all transaction related APIs
	UnprotectedAllowed() bool     // returns true if unprotected transactions are allowed

	// Blockchain API
	SetHead(number uint64)
	HeaderByNumber(ctx context.Context, number rpc.BlockNumber) (*types.Header, error)
	HeaderByHash(ctx context.Context, hash common.Hash) (*types.Header, error)
	HeaderByNumberOrHash(ctx context.Context, blockNrOrHash rpc.BlockNumberOrHash) (*types.Header, error)
	BlockByNumber(ctx context.Context, number rpc.BlockNumber) (*types.Block, error)
	BlockByHash(ctx context.Context, hash common.Hash) (*types.Block, error)
	BlockByNumberOrHash(ctx context.Context, blockNrOrHash rpc.BlockNumberOrHash) (*types.Block, error)
	GetReceipts(ctx context.Context, hash common.Hash) (types.Receipts, error)
	GetLogs(ctx context.Context, hash common.Hash, number uint64) ([][]*types.Log, error)
	GetEVM(ctx context.Context, state *state.StateDB, header *types.Header, vmConfig *vm.Config, blockCtx *vm.BlockContext) *vm.EVM
	Pending() (*types.Block, types.Receipts, *state.StateDB)

	// Transaction Pool API
	SendTx(ctx context.Context, signedTx *types.Transaction) error
	GetPoolTransactions() (types.Transactions, error)
	GetPoolTransaction(txHash common.Hash) *types.Transaction
	GetPoolNonce(ctx context.Context, addr common.Address) (uint64, error)
	Stats() (pending int, queued int)
	TxPoolContent() (map[common.Address][]*types.Transaction, map[common.Address][]*types.Transaction)
	TxPoolContentFrom(addr common.Address) ([]*types.Transaction, []*types.Transaction)
	SubscribeNewTxsEvent(chan<- core.NewTxsEvent) event.Subscription
	ChainConfig() *params.ChainConfig
	Engine() consensus.Engine
}
...
// PublicTransactionPoolAPI exposes methods for the RPC interface
type PublicTransactionPoolAPI struct {
	b         Backend
	events    *events
	nonceLock *AddrLocker
}

// NewPublicTransactionPoolAPI creates a new RPC service with methods for interacting with the transaction pool.
func NewPublicTransactionPoolAPI(b Backend) *PublicTransactionPoolAPI {
	return &PublicTransactionPoolAPI{
		b:         b,
		events:    newEvents(b),
		nonceLock: newAddrLocker(),
	}
}

// GetBlockTransactionCountByNumber returns the number of transactions in the block with the given block number.
func (s *PublicTransactionPoolAPI) GetBlockTransactionCountByNumber(ctx context.Context, blockNr rpc.BlockNumber) *hexutil.Uint {
	if block, _ := s.b.BlockByNumber(ctx, blockNr); block != nil {
		n := hexutil.Uint(len(block.Transactions()))
		return &n
	}
	return nil
}
```

</go-ethereum>

---

An excellent and well-structured prompt. The plan to implement a sophisticated, multi-layered memory allocator is a significant performance optimization for an EVM. Go-ethereum uses `sync.Pool` extensively to achieve similar goals by reusing frequently allocated objects, which directly maps to your `ObjectPool` concept.

Here are the most relevant code snippets from go-ethereum to provide context for your implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// core/vm/stack.go

// Stack is a main-memory stack for the Ethereum Virtual Machine.
type Stack struct {
	data []uint256.Int
	// Note: consider using a slice allocated with make([]uint256.Int, 0, 1024)
	// to prevent reallocations. This is not required for correctness but is a
	// performance optimization.
}

// stackPool is a global pool of stack objects
var stackPool = new(sync.Pool)

// newstack returns a new stack from the pool.
func newstack() *Stack {
	if s := stackPool.Get(); s != nil {
		st := s.(*Stack)
		st.data = st.data[:0] // The stack-pointer is reset to zero, but the backing array is reused.
		return st
	}
	// The pool was empty, allocate a new stack.
	// The size 1024 is the maximum stack depth allowed by the EVM.
	return &Stack{data: make([]uint256.Int, 0, 1024)}
}

// returnStack returns a stack to the pool.
func returnStack(s *Stack) {
	// The stack is not reset here explicitly. Instead, the newstack function is
	// responsible for resetting the stack pointer.
	stackPool.Put(s)
}

// Data returns the underlying data slice of the stack.
func (st *Stack) Data() []uint256.Int {
	return st.data
}
```
**Relevance:** This file demonstrates the core concept of object pooling for a critical EVM component, the `Stack`. The use of `sync.Pool` with `newstack` and `returnStack` functions is a direct parallel to your proposed `ObjectPool(Stack)` and `FrameAllocator` which would manage `Stack` objects. This shows that pooling these objects is a proven optimization in a production EVM. Notice how `newstack` reuses the underlying array by resetting the slice length, a common Go optimization pattern.

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// core/vm/memory.go

// Memory is a simple memory model for the Ethereum Virtual Machine.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset to value
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size > 0 {
		// length of memory may be bigger than offset + size.
		// So we must take the maximum of slice length and offset + size.
		if newSize := offset + size; newSize > uint64(len(m.store)) {
			// The memory needs to be resized, and the new data needs to be copied over.
			// This is an expensive operation and should be avoided as much as possible.
			m.resize(newSize)
		}
		copy(m.store[offset:offset+size], value)
	}
}

// Resize resizes the memory to the given size.
func (m *Memory) resize(size uint64) {
	if size > uint64(cap(m.store)) {
		// The requested size is greater than the capacity of the backing store.
		// A new backing store must be allocated.
		newSize := size + 256 // grow in chunks to avoid constant resizing.
		if newSize > params.MaxMemorySize {
			newSize = params.MaxMemorySize
		}
		newmem := make([]byte, newSize)
		copy(newmem, m.store)
		m.store = newmem
	}
	// The new size is greater than the current length but less than the capacity.
	// We can simply expand the slice's length.
	m.store = m.store[:size]
}

// GasCost returns the gas cost of the last memory expansion
func (m *Memory) GasCost() uint64 {
	return m.lastGasCost
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}
```
**Relevance:** This snippet shows the `Memory` struct and its `resize` logic. While go-ethereum doesn't pool the `Memory` struct itself in this file (see `interpreter.go` for that), this implementation is key. Your `EVMAllocator` will need to manage byte slices for various purposes (including the EVM memory). Geth's strategy of growing memory in chunks (`size + 256`) and checking against a `MaxMemorySize` is a valuable pattern for reducing re-allocation overhead and preventing DoS attacks, which is directly applicable to your `BufferPool` and general allocation logic.

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// core/vm/interpreter.go

// Config are the configuration options for the Interpreter.
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op code logger
	Tracer Tracer
	// NoBaseFee should be set to true if the London hard fork is not active
	NoBaseFee bool
	// EnablePreimageRecording should be set to true if the preimages of SHA3 and KECCAK256
	// operations should be recorded
	EnablePreimageRecording bool

	// JumpTable contains the EVM instructions for the specified rules.
	JumpTable [256]*operation

	// Type of the EWASM interpreter
	EWASMInterpreter string

	// Type of the EVM interpreter
	EVMInterpreter string
}

// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm *EVM
	cfg Config

	stackPool  *sync.Pool // Pool of stack objects
	memoryPool *sync.Pool // Pool of memory objects
	intPool    *intPool   // Pool of reusable 256-bit integers

	readOnly   bool   // Whether to throw on state modifying opcodes
	returnData []byte // Last CALL's return data for subsequent reuse
}

// NewEVMInterpreter returns a new instance of the Interpreter.
func NewEVMInterpreter(evm *EVM, cfg Config) *EVMInterpreter {
	return &EVMInterpreter{
		evm: evm,
		cfg: cfg,

		stackPool: &sync.Pool{
			New: func() interface{} {
				// The size 1024 is the maximum stack depth allowed by the EVM.
				return &Stack{data: make([]uint256.Int, 0, 1024)}
			},
		},
		memoryPool: &sync.Pool{
			New: func() interface{} { return new(Memory) },
		},
		intPool: newIntPool(),
	}
}

// Run implements Interpreter, running the given contract against the state database.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	// Get a stack from the pool
	stack := in.stackPool.Get().(*Stack)
	// Get a memory instance from the pool
	mem := in.memoryPool.Get().(*Memory)
	mem.Resize(0) // Ensure memory is clean

	// ... main execution loop ...

	// Return the stack and memory to the pool
	in.stackPool.Put(stack)
	in.memoryPool.Put(mem)

	return ret, err
}
```
**Relevance:** This is a crucial file. It explicitly shows that both `Stack` and `Memory` objects are pooled using `sync.Pool`. This directly validates your proposed `ObjectPool(Stack)` and `ObjectPool(Memory)`. The `NewEVMInterpreter` function initializes these pools, and the `Run` method demonstrates the lifecycle: acquire from pool -> use -> return to pool. This is the exact pattern your `FrameAllocator` and `EVMAllocator` will implement.

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// core/vm/contract.go

// ContractRef is a reference to the contract's backing object.
//
// In the current implementation, this is the jumping-off point for accessing
// the contract's code and storage.
type ContractRef interface {
	Address() common.Address
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of CALLER opcode, but could be overwritten by
	// a DELEGATECALL instruction.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	analysis  bitvec       // bitvec of valid jump destinations.

	Code     []byte
	CodeHash common.Hash
	Input    []byte
	Args     []byte // After the first 4 bytes of input

	value *big.Int
	Gas   uint64

	// contract fields available in interpreter
	DelegateCall bool
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{caller: caller, self: object, value: value, Gas: gas}

	if object != nil {
		// The following two values are nil for CREATE, which is fine.
		c.Code = object.Code(c.CodeHash)
		c.CodeHash = object.CodeHash()
	}
	return c
}
```
**Relevance:** The `Contract` struct in Geth is the equivalent of your `Frame` struct. It encapsulates the context for a single call (caller, self, code, input, value, gas). Understanding its fields is essential for designing your `Frame` and the `FrameAllocator` that will manage it. While Geth doesn't pool `Contract` objects, your proposed `ObjectPool(Frame)` is a logical extension of Geth's pooling patterns for performance in a non-GC language like Zig.

</file>
</go-ethereum>

