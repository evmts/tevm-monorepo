# Implement Memory Allocator Tuning

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_memory_allocator_tuning` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_memory_allocator_tuning feat_implement_memory_allocator_tuning`
3. **Work in isolation**: `cd g/feat_implement_memory_allocator_tuning`
4. **Commit message**: `⚡ perf: implement memory allocator tuning for optimized allocation patterns`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement memory allocator tuning optimizations to improve memory allocation patterns, reduce fragmentation, and optimize performance for EVM-specific workloads. This includes custom allocators for different memory usage patterns, pool allocation for frequently used objects, and memory layout optimizations.

## ELI5

Think of memory allocation like managing parking in a busy city. A basic allocator is like having people park randomly wherever they find space, leading to wasted spots and traffic jams. Memory allocator tuning is like having a smart parking system that knows common patterns - keeping spots ready for regular commuters, grouping similar-sized cars together, and avoiding fragmentation. This makes parking (memory allocation) faster and more efficient.

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

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Memory safety** - No leaks or corruption with optimized allocators
3. **Fallback compatibility** - Must work with any standard allocator
4. **Performance validation** - Must demonstrate measurable improvements
5. **Statistical accuracy** - Allocation statistics must be precise
6. **Thread safety** - Concurrent allocation must be safe if needed

## References

- [Memory Pool Allocation](https://en.wikipedia.org/wiki/Memory_pool) - Pool allocation strategies
- [Arena Allocation](https://en.wikipedia.org/wiki/Region-based_memory_management) - Arena memory management
- [Memory Fragmentation](https://en.wikipedia.org/wiki/Fragmentation_(computing)) - Fragmentation analysis and mitigation
- [Zig Allocators](https://ziglang.org/documentation/master/#Allocators) - Zig allocator interface
- [High-Performance Memory Management](https://www.memorymanagement.org/) - Advanced memory management techniques