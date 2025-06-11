# Implement Cache Optimization

## What
<eli5>
Think of your computer's cache like your desk workspace. Items on your desk (cache) can be grabbed instantly, but items in filing cabinets across the room (main memory) take time to fetch. Cache optimization is like organizing your desk so the things you need most often are within arm's reach. When data is organized well and we can predict what you'll need next, we can pre-fetch it to your desk, making everything much faster.
</eli5>

Implement comprehensive cache optimization strategies to maximize memory locality, minimize cache misses, and improve overall EVM execution performance. This includes data structure optimization, access pattern analysis, cache-friendly memory layouts, and intelligent prefetching mechanisms.

## Why
Cache optimization can provide 15-30% improvement in cache hit rates and overall execution performance by improving memory locality and reducing costly cache misses. This is critical for EVM performance as memory access patterns significantly impact execution speed, especially for complex smart contracts with large state requirements.

## How
1. Implement cache-aware data structures with memory alignment and layout optimization
2. Create access pattern tracking to analyze and predict memory usage patterns
3. Build intelligent prefetching engine with adaptive strategies based on observed patterns
4. Add cache-friendly allocator and memory management optimized for cache line boundaries
5. Integrate comprehensive cache statistics and monitoring for performance analysis
6. Implement automatic optimization passes that adjust strategies based on runtime patterns

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_cache_optimization` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_cache_optimization feat_implement_cache_optimization`
3. **Work in isolation**: `cd g/feat_implement_cache_optimization`
4. **Commit message**: Use the following XML format:

```
✨ feat: brief description of the change

<summary>
<what>
- Bullet point summary of what was changed
- Key implementation details and files modified
</what>

<why>
- Motivation and reasoning behind the changes
- Problem being solved or feature being added
</why>

<how>
- Technical approach and implementation strategy
- Important design decisions or trade-offs made
</how>
</summary>

<prompt>
Condensed version of the original prompt that includes:
- The core request or task
- Essential context needed to re-execute
- Replace large code blocks with <github>url</github> or <docs>description</docs>
- Remove redundant examples but keep key technical details
- Ensure someone could understand and repeat the task from this prompt alone
</prompt>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive cache optimization strategies to maximize memory locality, minimize cache misses, and improve overall EVM execution performance. This includes data structure optimization, access pattern analysis, cache-friendly memory layouts, and intelligent prefetching mechanisms.

## ELI5

Think of your computer's cache like your desk workspace. Items on your desk (cache) can be grabbed instantly, but items in filing cabinets across the room (main memory) take time to fetch. Cache optimization is like organizing your desk so the things you need most often are within arm's reach. When data is organized well and we can predict what you'll need next, we can pre-fetch it to your desk, making everything much faster.

## Cache Optimization Specifications

### Core Cache Framework

#### 1. Cache-Aware Data Structures
```zig
pub const CacheOptimizer = struct {
    allocator: std.mem.Allocator,
    config: CacheConfig,
    access_tracker: AccessPatternTracker,
    layout_optimizer: DataLayoutOptimizer,
    prefetch_engine: PrefetchEngine,
    cache_statistics: CacheStatistics,
    
    pub const CacheConfig = struct {
        enable_cache_optimization: bool,
        enable_access_tracking: bool,
        enable_prefetching: bool,
        enable_layout_optimization: bool,
        cache_line_size: u32,
        l1_cache_size: u32,
        l2_cache_size: u32,
        l3_cache_size: u32,
        prefetch_distance: u32,
        optimization_frequency: u32,
        
        pub fn production() CacheConfig {
            return CacheConfig{
                .enable_cache_optimization = true,
                .enable_access_tracking = true,
                .enable_prefetching = true,
                .enable_layout_optimization = true,
                .cache_line_size = 64,      // Typical cache line size
                .l1_cache_size = 32 * 1024, // 32KB
                .l2_cache_size = 256 * 1024, // 256KB
                .l3_cache_size = 8 * 1024 * 1024, // 8MB
                .prefetch_distance = 4,
                .optimization_frequency = 1000,
            };
        }
        
        pub fn development() CacheConfig {
            return CacheConfig{
                .enable_cache_optimization = true,
                .enable_access_tracking = true,
                .enable_prefetching = true,
                .enable_layout_optimization = true,
                .cache_line_size = 64,
                .l1_cache_size = 32 * 1024,
                .l2_cache_size = 256 * 1024,
                .l3_cache_size = 4 * 1024 * 1024,
                .prefetch_distance = 2,
                .optimization_frequency = 100,
            };
        }
        
        pub fn testing() CacheConfig {
            return CacheConfig{
                .enable_cache_optimization = false,
                .enable_access_tracking = true,
                .enable_prefetching = false,
                .enable_layout_optimization = false,
                .cache_line_size = 64,
                .l1_cache_size = 16 * 1024,
                .l2_cache_size = 128 * 1024,
                .l3_cache_size = 1024 * 1024,
                .prefetch_distance = 1,
                .optimization_frequency = 10,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: CacheConfig) CacheOptimizer {
        return CacheOptimizer{
            .allocator = allocator,
            .config = config,
            .access_tracker = AccessPatternTracker.init(allocator, config),
            .layout_optimizer = DataLayoutOptimizer.init(allocator, config),
            .prefetch_engine = PrefetchEngine.init(allocator, config),
            .cache_statistics = CacheStatistics.init(),
        };
    }
    
    pub fn deinit(self: *CacheOptimizer) void {
        self.access_tracker.deinit();
        self.layout_optimizer.deinit();
        self.prefetch_engine.deinit();
    }
    
    pub fn optimize_data_layout(self: *CacheOptimizer, comptime T: type) type {
        if (!self.config.enable_layout_optimization) {
            return T;
        }
        
        return self.layout_optimizer.optimize_struct_layout(T);
    }
    
    pub fn track_memory_access(self: *CacheOptimizer, address: usize, size: usize, access_type: AccessType) void {
        if (!self.config.enable_access_tracking) return;
        
        self.access_tracker.record_access(address, size, access_type);
        self.cache_statistics.record_access(access_type);
        
        // Trigger prefetching if enabled
        if (self.config.enable_prefetching) {
            self.prefetch_engine.analyze_and_prefetch(address, size, access_type);
        }
    }
    
    pub fn optimize_array_access(self: *CacheOptimizer, comptime T: type, array: []T) CacheOptimizedArray(T) {
        return CacheOptimizedArray(T).init(self.allocator, array, self.config);
    }
    
    pub fn get_cache_friendly_allocator(self: *CacheOptimizer) CacheFriendlyAllocator {
        return CacheFriendlyAllocator.init(self.allocator, self.config);
    }
    
    pub fn run_optimization_pass(self: *CacheOptimizer) !void {
        // Analyze access patterns
        const patterns = self.access_tracker.analyze_patterns();
        
        // Update prefetch strategies
        try self.prefetch_engine.update_strategies(patterns);
        
        // Optimize data layouts based on access patterns
        try self.layout_optimizer.optimize_based_on_patterns(patterns);
        
        self.cache_statistics.record_optimization_pass();
    }
    
    pub fn get_cache_statistics(self: *const CacheOptimizer) CacheStatistics {
        return self.cache_statistics;
    }
};

pub const AccessType = enum {
    Read,
    Write,
    ReadWrite,
    Sequential,
    Random,
    Prefetch,
};
```

#### 2. Access Pattern Tracking
```zig
pub const AccessPatternTracker = struct {
    allocator: std.mem.Allocator,
    config: CacheOptimizer.CacheConfig,
    access_history: std.ArrayList(MemoryAccess),
    pattern_cache: std.HashMap(u64, AccessPattern, PatternContext, std.hash_map.default_max_load_percentage),
    temporal_tracker: TemporalTracker,
    spatial_tracker: SpatialTracker,
    
    pub const MemoryAccess = struct {
        address: usize,
        size: usize,
        access_type: AccessType,
        timestamp: u64,
        thread_id: u32,
        instruction_pointer: usize,
        
        pub fn get_cache_line(self: *const MemoryAccess, cache_line_size: u32) u64 {
            return self.address / cache_line_size;
        }
        
        pub fn overlaps_cache_line(self: *const MemoryAccess, other: *const MemoryAccess, cache_line_size: u32) bool {
            const self_line = self.get_cache_line(cache_line_size);
            const other_line = other.get_cache_line(cache_line_size);
            return self_line == other_line;
        }
    };
    
    pub const AccessPattern = struct {
        pattern_type: PatternType,
        frequency: u64,
        last_seen: u64,
        stride: i64,
        confidence: f64,
        cache_efficiency: f64,
        
        pub const PatternType = enum {
            Sequential,
            Strided,
            Random,
            Temporal,
            Spatial,
            Circular,
        };
        
        pub fn is_predictable(self: *const AccessPattern) bool {
            return self.confidence > 0.7 and 
                   (self.pattern_type == .Sequential or self.pattern_type == .Strided);
        }
        
        pub fn get_prefetch_addresses(self: *const AccessPattern, base_address: usize, count: u32) []usize {
            // Generate prefetch addresses based on pattern
            var addresses = std.ArrayList(usize).init(std.heap.page_allocator);
            
            switch (self.pattern_type) {
                .Sequential => {
                    for (0..count) |i| {
                        addresses.append(base_address + (i + 1) * @abs(self.stride)) catch break;
                    }
                },
                .Strided => {
                    for (0..count) |i| {
                        const next_addr = @as(i64, @intCast(base_address)) + (@as(i64, @intCast(i)) + 1) * self.stride;
                        if (next_addr >= 0) {
                            addresses.append(@intCast(next_addr)) catch break;
                        }
                    }
                },
                else => {
                    // For random patterns, don't prefetch
                },
            }
            
            return addresses.toOwnedSlice() catch &[_]usize{};
        }
    };
    
    pub const TemporalTracker = struct {
        recent_accesses: std.ArrayList(usize),
        access_intervals: std.HashMap(usize, std.ArrayList(u64), AddressContext, std.hash_map.default_max_load_percentage),
        max_history: u32,
        
        pub fn init(allocator: std.mem.Allocator, max_history: u32) TemporalTracker {
            return TemporalTracker{
                .recent_accesses = std.ArrayList(usize).init(allocator),
                .access_intervals = std.HashMap(usize, std.ArrayList(u64), AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
                .max_history = max_history,
            };
        }
        
        pub fn deinit(self: *TemporalTracker) void {
            self.recent_accesses.deinit();
            
            var iterator = self.access_intervals.iterator();
            while (iterator.next()) |entry| {
                entry.value_ptr.deinit();
            }
            self.access_intervals.deinit();
        }
        
        pub fn record_access(self: *TemporalTracker, address: usize, timestamp: u64) !void {
            // Track recent accesses
            try self.recent_accesses.append(address);
            if (self.recent_accesses.items.len > self.max_history) {
                _ = self.recent_accesses.orderedRemove(0);
            }
            
            // Track access intervals for this address
            var intervals = self.access_intervals.getPtr(address) orelse blk: {
                const new_intervals = std.ArrayList(u64).init(self.recent_accesses.allocator);
                try self.access_intervals.put(address, new_intervals);
                break :blk self.access_intervals.getPtr(address).?;
            };
            
            try intervals.append(timestamp);
            if (intervals.items.len > self.max_history) {
                _ = intervals.orderedRemove(0);
            }
        }
        
        pub fn detect_temporal_patterns(self: *TemporalTracker, address: usize) ?AccessPattern {
            const intervals = self.access_intervals.get(address) orelse return null;
            if (intervals.items.len < 3) return null;
            
            // Calculate average interval
            var total_interval: u64 = 0;
            for (1..intervals.items.len) |i| {
                total_interval += intervals.items[i] - intervals.items[i-1];
            }
            
            const avg_interval = total_interval / (intervals.items.len - 1);
            
            // Check for regular temporal pattern
            var variance: f64 = 0;
            for (1..intervals.items.len) |i| {
                const interval = intervals.items[i] - intervals.items[i-1];
                const diff = @as(f64, @floatFromInt(interval)) - @as(f64, @floatFromInt(avg_interval));
                variance += diff * diff;
            }
            variance /= @as(f64, @floatFromInt(intervals.items.len - 1));
            
            const std_dev = @sqrt(variance);
            const coefficient_of_variation = std_dev / @as(f64, @floatFromInt(avg_interval));
            
            // If coefficient of variation is low, we have a regular temporal pattern
            if (coefficient_of_variation < 0.3) {
                return AccessPattern{
                    .pattern_type = .Temporal,
                    .frequency = intervals.items.len,
                    .last_seen = intervals.items[intervals.items.len - 1],
                    .stride = @intCast(avg_interval),
                    .confidence = 1.0 - coefficient_of_variation,
                    .cache_efficiency = self.estimate_cache_efficiency(avg_interval),
                };
            }
            
            return null;
        }
        
        fn estimate_cache_efficiency(self: *TemporalTracker, interval: u64) f64 {
            _ = self;
            
            // Estimate cache efficiency based on access interval
            // Shorter intervals = better cache efficiency
            const cache_retention_cycles = 1000; // Approximate cache retention time
            
            if (interval < cache_retention_cycles / 4) {
                return 0.9; // Very likely to be in cache
            } else if (interval < cache_retention_cycles / 2) {
                return 0.7; // Likely to be in cache
            } else if (interval < cache_retention_cycles) {
                return 0.4; // Possible cache hit
            } else {
                return 0.1; // Unlikely cache hit
            }
        }
    };
    
    pub const SpatialTracker = struct {
        address_regions: std.HashMap(u64, RegionInfo, RegionContext, std.hash_map.default_max_load_percentage),
        cache_line_size: u32,
        
        pub const RegionInfo = struct {
            base_address: usize,
            size: usize,
            access_count: u64,
            last_access: u64,
            access_density: f64,
            hot_spots: std.ArrayList(usize),
            
            pub fn update_density(self: *RegionInfo) void {
                self.access_density = @as(f64, @floatFromInt(self.access_count)) / @as(f64, @floatFromInt(self.size));
            }
        };
        
        pub fn init(allocator: std.mem.Allocator, cache_line_size: u32) SpatialTracker {
            return SpatialTracker{
                .address_regions = std.HashMap(u64, RegionInfo, RegionContext, std.hash_map.default_max_load_percentage).init(allocator),
                .cache_line_size = cache_line_size,
            };
        }
        
        pub fn deinit(self: *SpatialTracker) void {
            var iterator = self.address_regions.iterator();
            while (iterator.next()) |entry| {
                entry.value_ptr.hot_spots.deinit();
            }
            self.address_regions.deinit();
        }
        
        pub fn record_access(self: *SpatialTracker, address: usize, timestamp: u64) !void {
            const region_id = self.get_region_id(address);
            
            var region = self.address_regions.getPtr(region_id) orelse blk: {
                const new_region = RegionInfo{
                    .base_address = self.align_to_region(address),
                    .size = self.cache_line_size * 16, // 16 cache lines per region
                    .access_count = 0,
                    .last_access = 0,
                    .access_density = 0.0,
                    .hot_spots = std.ArrayList(usize).init(self.address_regions.allocator),
                };
                try self.address_regions.put(region_id, new_region);
                break :blk self.address_regions.getPtr(region_id).?;
            };
            
            region.access_count += 1;
            region.last_access = timestamp;
            region.update_density();
            
            // Track hot spots within the region
            const offset = address - region.base_address;
            if (offset < region.size) {
                // Check if this is a new hot spot
                var is_hot_spot = false;
                for (region.hot_spots.items) |hot_spot| {
                    if (@abs(@as(i64, @intCast(address)) - @as(i64, @intCast(hot_spot))) < self.cache_line_size) {
                        is_hot_spot = true;
                        break;
                    }
                }
                
                if (!is_hot_spot) {
                    try region.hot_spots.append(address);
                }
            }
        }
        
        pub fn detect_spatial_patterns(self: *SpatialTracker) std.ArrayList(AccessPattern) {
            var patterns = std.ArrayList(AccessPattern).init(self.address_regions.allocator);
            
            var iterator = self.address_regions.iterator();
            while (iterator.next()) |entry| {
                const region = entry.value_ptr;
                
                // High-density regions indicate spatial locality
                if (region.access_density > 0.5 and region.access_count > 10) {
                    const pattern = AccessPattern{
                        .pattern_type = .Spatial,
                        .frequency = region.access_count,
                        .last_seen = region.last_access,
                        .stride = @intCast(self.cache_line_size),
                        .confidence = @min(region.access_density, 1.0),
                        .cache_efficiency = self.estimate_spatial_efficiency(region),
                    };
                    
                    patterns.append(pattern) catch continue;
                }
            }
            
            return patterns;
        }
        
        fn get_region_id(self: *SpatialTracker, address: usize) u64 {
            const region_size = self.cache_line_size * 16;
            return address / region_size;
        }
        
        fn align_to_region(self: *SpatialTracker, address: usize) usize {
            const region_size = self.cache_line_size * 16;
            return (address / region_size) * region_size;
        }
        
        fn estimate_spatial_efficiency(self: *SpatialTracker, region: *const RegionInfo) f64 {
            _ = self;
            
            // High access density = better spatial locality = better cache efficiency
            const base_efficiency = @min(region.access_density, 1.0);
            
            // Bonus for having multiple hot spots (indicates good spatial locality)
            const hot_spot_bonus = @min(@as(f64, @floatFromInt(region.hot_spots.items.len)) * 0.1, 0.3);
            
            return @min(base_efficiency + hot_spot_bonus, 1.0);
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: CacheOptimizer.CacheConfig) AccessPatternTracker {
        return AccessPatternTracker{
            .allocator = allocator,
            .config = config,
            .access_history = std.ArrayList(MemoryAccess).init(allocator),
            .pattern_cache = std.HashMap(u64, AccessPattern, PatternContext, std.hash_map.default_max_load_percentage).init(allocator),
            .temporal_tracker = TemporalTracker.init(allocator, 1000),
            .spatial_tracker = SpatialTracker.init(allocator, config.cache_line_size),
        };
    }
    
    pub fn deinit(self: *AccessPatternTracker) void {
        self.access_history.deinit();
        self.pattern_cache.deinit();
        self.temporal_tracker.deinit();
        self.spatial_tracker.deinit();
    }
    
    pub fn record_access(self: *AccessPatternTracker, address: usize, size: usize, access_type: AccessType) void {
        const timestamp = @as(u64, @intCast(std.time.milliTimestamp()));
        
        const access = MemoryAccess{
            .address = address,
            .size = size,
            .access_type = access_type,
            .timestamp = timestamp,
            .thread_id = 0, // Would get actual thread ID
            .instruction_pointer = 0, // Would get actual IP if available
        };
        
        self.access_history.append(access) catch return;
        
        // Limit history size
        if (self.access_history.items.len > 10000) {
            _ = self.access_history.orderedRemove(0);
        }
        
        // Update trackers
        self.temporal_tracker.record_access(address, timestamp) catch {};
        self.spatial_tracker.record_access(address, timestamp) catch {};
    }
    
    pub fn analyze_patterns(self: *AccessPatternTracker) AnalysisResult {
        var result = AnalysisResult{
            .sequential_patterns = std.ArrayList(AccessPattern).init(self.allocator),
            .temporal_patterns = std.ArrayList(AccessPattern).init(self.allocator),
            .spatial_patterns = self.spatial_tracker.detect_spatial_patterns(),
            .cache_efficiency = self.calculate_overall_cache_efficiency(),
        };
        
        // Detect sequential patterns
        self.detect_sequential_patterns(&result.sequential_patterns);
        
        // Detect temporal patterns
        self.detect_temporal_patterns(&result.temporal_patterns);
        
        return result;
    }
    
    pub const AnalysisResult = struct {
        sequential_patterns: std.ArrayList(AccessPattern),
        temporal_patterns: std.ArrayList(AccessPattern),
        spatial_patterns: std.ArrayList(AccessPattern),
        cache_efficiency: f64,
        
        pub fn deinit(self: *AnalysisResult) void {
            self.sequential_patterns.deinit();
            self.temporal_patterns.deinit();
            self.spatial_patterns.deinit();
        }
    };
    
    fn detect_sequential_patterns(self: *AccessPatternTracker, patterns: *std.ArrayList(AccessPattern)) void {
        if (self.access_history.items.len < 3) return;
        
        var i: usize = 0;
        while (i < self.access_history.items.len - 2) {
            const access1 = &self.access_history.items[i];
            const access2 = &self.access_history.items[i + 1];
            const access3 = &self.access_history.items[i + 2];
            
            const stride1 = @as(i64, @intCast(access2.address)) - @as(i64, @intCast(access1.address));
            const stride2 = @as(i64, @intCast(access3.address)) - @as(i64, @intCast(access2.address));
            
            // Check for consistent stride
            if (stride1 == stride2 and stride1 != 0) {
                // Found potential pattern, look for more evidence
                var pattern_length: u32 = 3;
                var confidence: f64 = 0.6;
                
                // Extend pattern as far as possible
                var j = i + 3;
                while (j < self.access_history.items.len) {
                    const prev_access = &self.access_history.items[j - 1];
                    const curr_access = &self.access_history.items[j];
                    const stride = @as(i64, @intCast(curr_access.address)) - @as(i64, @intCast(prev_access.address));
                    
                    if (stride == stride1) {
                        pattern_length += 1;
                        confidence += 0.1;
                        j += 1;
                    } else {
                        break;
                    }
                }
                
                if (pattern_length >= 3) {
                    const pattern = AccessPattern{
                        .pattern_type = if (stride1 > 0) .Sequential else .Strided,
                        .frequency = pattern_length,
                        .last_seen = self.access_history.items[i + pattern_length - 1].timestamp,
                        .stride = stride1,
                        .confidence = @min(confidence, 1.0),
                        .cache_efficiency = self.estimate_pattern_cache_efficiency(stride1),
                    };
                    
                    patterns.append(pattern) catch {};
                    i += pattern_length;
                } else {
                    i += 1;
                }
            } else {
                i += 1;
            }
        }
    }
    
    fn detect_temporal_patterns(self: *AccessPatternTracker, patterns: *std.ArrayList(AccessPattern)) void {
        // Group accesses by address
        var address_accesses = std.HashMap(usize, std.ArrayList(*const MemoryAccess), AddressContext, std.hash_map.default_max_load_percentage).init(self.allocator);
        defer {
            var iterator = address_accesses.iterator();
            while (iterator.next()) |entry| {
                entry.value_ptr.deinit();
            }
            address_accesses.deinit();
        }
        
        for (self.access_history.items) |*access| {
            var accesses = address_accesses.getPtr(access.address) orelse blk: {
                const new_list = std.ArrayList(*const MemoryAccess).init(self.allocator);
                address_accesses.put(access.address, new_list) catch continue;
                break :blk address_accesses.getPtr(access.address).?;
            };
            
            accesses.append(access) catch continue;
        }
        
        // Analyze temporal patterns for each address
        var iterator = address_accesses.iterator();
        while (iterator.next()) |entry| {
            if (const pattern = self.temporal_tracker.detect_temporal_patterns(entry.key_ptr.*)) {
                patterns.append(pattern) catch continue;
            }
        }
    }
    
    fn estimate_pattern_cache_efficiency(self: *AccessPatternTracker, stride: i64) f64 {
        const abs_stride = @abs(stride);
        const cache_line_size = self.config.cache_line_size;
        
        if (abs_stride <= cache_line_size) {
            return 0.9; // Excellent spatial locality
        } else if (abs_stride <= cache_line_size * 2) {
            return 0.7; // Good spatial locality
        } else if (abs_stride <= cache_line_size * 4) {
            return 0.5; // Moderate spatial locality
        } else {
            return 0.2; // Poor spatial locality
        }
    }
    
    fn calculate_overall_cache_efficiency(self: *AccessPatternTracker) f64 {
        if (self.access_history.items.len < 2) return 0.5;
        
        var cache_hits: u64 = 0;
        var total_accesses: u64 = 0;
        
        for (1..self.access_history.items.len) |i| {
            const prev_access = &self.access_history.items[i - 1];
            const curr_access = &self.access_history.items[i];
            
            total_accesses += 1;
            
            // Estimate cache hit based on temporal and spatial locality
            const time_delta = curr_access.timestamp - prev_access.timestamp;
            const addr_delta = @abs(@as(i64, @intCast(curr_access.address)) - @as(i64, @intCast(prev_access.address)));
            
            // Temporal locality check
            if (time_delta < 1000) { // Within 1 second
                cache_hits += 1;
                continue;
            }
            
            // Spatial locality check
            if (addr_delta < self.config.cache_line_size) {
                cache_hits += 1;
                continue;
            }
            
            // Check if addresses are in same cache line
            if (prev_access.overlaps_cache_line(curr_access, self.config.cache_line_size)) {
                cache_hits += 1;
            }
        }
        
        return @as(f64, @floatFromInt(cache_hits)) / @as(f64, @floatFromInt(total_accesses));
    }
    
    pub const PatternContext = struct {
        pub fn hash(self: @This(), key: u64) u64 {
            _ = self;
            return key;
        }
        
        pub fn eql(self: @This(), a: u64, b: u64) bool {
            _ = self;
            return a == b;
        }
    };
    
    pub const AddressContext = struct {
        pub fn hash(self: @This(), key: usize) u64 {
            _ = self;
            return @intCast(key);
        }
        
        pub fn eql(self: @This(), a: usize, b: usize) bool {
            _ = self;
            return a == b;
        }
    };
    
    pub const RegionContext = struct {
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

#### 3. Prefetch Engine
```zig
pub const PrefetchEngine = struct {
    allocator: std.mem.Allocator,
    config: CacheOptimizer.CacheConfig,
    prefetch_strategies: std.ArrayList(PrefetchStrategy),
    prefetch_queue: std.ArrayList(PrefetchRequest),
    prefetch_statistics: PrefetchStatistics,
    
    pub const PrefetchStrategy = struct {
        strategy_type: StrategyType,
        pattern_type: AccessPatternTracker.AccessPattern.PatternType,
        distance: u32,
        confidence_threshold: f64,
        effectiveness: f64,
        
        pub const StrategyType = enum {
            NextLine,      // Prefetch next cache line
            Stride,        // Prefetch based on stride pattern
            Stream,        // Stream prefetching for sequential access
            Indirect,      // Indirect prefetching for pointer chasing
            Adaptive,      // Adaptive based on observed patterns
        };
        
        pub fn should_prefetch(self: *const PrefetchStrategy, pattern: *const AccessPatternTracker.AccessPattern) bool {
            return pattern.confidence >= self.confidence_threshold and
                   pattern.pattern_type == self.pattern_type and
                   self.effectiveness > 0.5;
        }
    };
    
    pub const PrefetchRequest = struct {
        address: usize,
        size: usize,
        priority: PrefetchPriority,
        strategy: PrefetchStrategy.StrategyType,
        timestamp: u64,
        
        pub const PrefetchPriority = enum {
            Low,
            Medium,
            High,
            Critical,
        };
        
        pub fn is_expired(self: *const PrefetchRequest, current_time: u64, timeout_ms: u64) bool {
            return (current_time - self.timestamp) > timeout_ms;
        }
    };
    
    pub const PrefetchStatistics = struct {
        total_prefetches: u64,
        successful_prefetches: u64,
        wasted_prefetches: u64,
        prefetch_accuracy: f64,
        cache_pollution: u64,
        
        pub fn init() PrefetchStatistics {
            return std.mem.zeroes(PrefetchStatistics);
        }
        
        pub fn record_prefetch_success(self: *PrefetchStatistics) void {
            self.total_prefetches += 1;
            self.successful_prefetches += 1;
            self.update_accuracy();
        }
        
        pub fn record_prefetch_waste(self: *PrefetchStatistics) void {
            self.total_prefetches += 1;
            self.wasted_prefetches += 1;
            self.cache_pollution += 1;
            self.update_accuracy();
        }
        
        fn update_accuracy(self: *PrefetchStatistics) void {
            if (self.total_prefetches > 0) {
                self.prefetch_accuracy = @as(f64, @floatFromInt(self.successful_prefetches)) / 
                                       @as(f64, @floatFromInt(self.total_prefetches));
            }
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: CacheOptimizer.CacheConfig) PrefetchEngine {
        var engine = PrefetchEngine{
            .allocator = allocator,
            .config = config,
            .prefetch_strategies = std.ArrayList(PrefetchStrategy).init(allocator),
            .prefetch_queue = std.ArrayList(PrefetchRequest).init(allocator),
            .prefetch_statistics = PrefetchStatistics.init(),
        };
        
        // Initialize default strategies
        engine.init_default_strategies() catch {};
        
        return engine;
    }
    
    pub fn deinit(self: *PrefetchEngine) void {
        self.prefetch_strategies.deinit();
        self.prefetch_queue.deinit();
    }
    
    fn init_default_strategies(self: *PrefetchEngine) !void {
        // Next-line prefetching for sequential access
        try self.prefetch_strategies.append(PrefetchStrategy{
            .strategy_type = .NextLine,
            .pattern_type = .Sequential,
            .distance = 1,
            .confidence_threshold = 0.7,
            .effectiveness = 0.8,
        });
        
        // Stride prefetching for strided access
        try self.prefetch_strategies.append(PrefetchStrategy{
            .strategy_type = .Stride,
            .pattern_type = .Strided,
            .distance = self.config.prefetch_distance,
            .confidence_threshold = 0.8,
            .effectiveness = 0.7,
        });
        
        // Stream prefetching for large sequential access
        try self.prefetch_strategies.append(PrefetchStrategy{
            .strategy_type = .Stream,
            .pattern_type = .Sequential,
            .distance = self.config.prefetch_distance * 2,
            .confidence_threshold = 0.9,
            .effectiveness = 0.9,
        });
        
        // Adaptive prefetching
        try self.prefetch_strategies.append(PrefetchStrategy{
            .strategy_type = .Adaptive,
            .pattern_type = .Temporal,
            .distance = 1,
            .confidence_threshold = 0.6,
            .effectiveness = 0.6,
        });
    }
    
    pub fn analyze_and_prefetch(self: *PrefetchEngine, address: usize, size: usize, access_type: AccessType) void {
        _ = size;
        _ = access_type;
        
        if (!self.config.enable_prefetching) return;
        
        // Simple heuristic prefetching
        // In a real implementation, this would use pattern analysis
        const prefetch_addr = address + self.config.cache_line_size;
        
        const request = PrefetchRequest{
            .address = prefetch_addr,
            .size = self.config.cache_line_size,
            .priority = .Medium,
            .strategy = .NextLine,
            .timestamp = @intCast(std.time.milliTimestamp()),
        };
        
        self.add_prefetch_request(request);
    }
    
    pub fn update_strategies(self: *PrefetchEngine, patterns: AccessPatternTracker.AnalysisResult) !void {
        // Update strategy effectiveness based on observed patterns
        for (self.prefetch_strategies.items) |*strategy| {
            // Find matching patterns and update effectiveness
            var pattern_count: u32 = 0;
            var total_confidence: f64 = 0;
            
            // Check sequential patterns
            for (patterns.sequential_patterns.items) |pattern| {
                if (strategy.pattern_type == pattern.pattern_type) {
                    pattern_count += 1;
                    total_confidence += pattern.confidence;
                }
            }
            
            // Check temporal patterns
            for (patterns.temporal_patterns.items) |pattern| {
                if (strategy.pattern_type == pattern.pattern_type) {
                    pattern_count += 1;
                    total_confidence += pattern.confidence;
                }
            }
            
            // Check spatial patterns
            for (patterns.spatial_patterns.items) |pattern| {
                if (strategy.pattern_type == pattern.pattern_type) {
                    pattern_count += 1;
                    total_confidence += pattern.confidence;
                }
            }
            
            // Update effectiveness
            if (pattern_count > 0) {
                const avg_confidence = total_confidence / @as(f64, @floatFromInt(pattern_count));
                strategy.effectiveness = strategy.effectiveness * 0.9 + avg_confidence * 0.1;
            } else {
                // Decay effectiveness if no matching patterns
                strategy.effectiveness *= 0.95;
            }
        }
        
        // Add new strategies for highly confident patterns
        self.adapt_strategies(patterns) catch {};
    }
    
    fn adapt_strategies(self: *PrefetchEngine, patterns: AccessPatternTracker.AnalysisResult) !void {
        // Look for new patterns that don't have corresponding strategies
        for (patterns.sequential_patterns.items) |pattern| {
            if (pattern.confidence > 0.9 and !self.has_strategy_for_pattern(pattern)) {
                try self.create_adaptive_strategy(pattern);
            }
        }
        
        for (patterns.temporal_patterns.items) |pattern| {
            if (pattern.confidence > 0.9 and !self.has_strategy_for_pattern(pattern)) {
                try self.create_adaptive_strategy(pattern);
            }
        }
        
        for (patterns.spatial_patterns.items) |pattern| {
            if (pattern.confidence > 0.9 and !self.has_strategy_for_pattern(pattern)) {
                try self.create_adaptive_strategy(pattern);
            }
        }
    }
    
    fn has_strategy_for_pattern(self: *PrefetchEngine, pattern: AccessPatternTracker.AccessPattern) bool {
        for (self.prefetch_strategies.items) |strategy| {
            if (strategy.pattern_type == pattern.pattern_type and
                strategy.confidence_threshold <= pattern.confidence) {
                return true;
            }
        }
        return false;
    }
    
    fn create_adaptive_strategy(self: *PrefetchEngine, pattern: AccessPatternTracker.AccessPattern) !void {
        const distance = if (pattern.stride > 0) 
            @min(@as(u32, @intCast(@divTrunc(pattern.stride, @as(i64, self.config.cache_line_size)))), self.config.prefetch_distance)
        else 
            1;
        
        const strategy = PrefetchStrategy{
            .strategy_type = .Adaptive,
            .pattern_type = pattern.pattern_type,
            .distance = distance,
            .confidence_threshold = pattern.confidence * 0.9,
            .effectiveness = pattern.cache_efficiency,
        };
        
        try self.prefetch_strategies.append(strategy);
    }
    
    pub fn add_prefetch_request(self: *PrefetchEngine, request: PrefetchRequest) void {
        // Check if request already exists
        for (self.prefetch_queue.items) |existing| {
            if (existing.address == request.address) {
                return; // Already queued
            }
        }
        
        self.prefetch_queue.append(request) catch return;
        
        // Sort by priority and timestamp
        std.sort.sort(PrefetchRequest, self.prefetch_queue.items, {}, struct {
            fn lessThan(context: void, lhs: PrefetchRequest, rhs: PrefetchRequest) bool {
                _ = context;
                if (@intFromEnum(lhs.priority) != @intFromEnum(rhs.priority)) {
                    return @intFromEnum(lhs.priority) > @intFromEnum(rhs.priority);
                }
                return lhs.timestamp < rhs.timestamp;
            }
        }.lessThan);
        
        // Limit queue size
        if (self.prefetch_queue.items.len > 100) {
            _ = self.prefetch_queue.pop();
        }
    }
    
    pub fn process_prefetch_queue(self: *PrefetchEngine) void {
        const current_time = @as(u64, @intCast(std.time.milliTimestamp()));
        const timeout_ms = 100; // 100ms timeout
        
        var i: usize = 0;
        while (i < self.prefetch_queue.items.len) {
            const request = &self.prefetch_queue.items[i];
            
            if (request.is_expired(current_time, timeout_ms)) {
                _ = self.prefetch_queue.swapRemove(i);
                self.prefetch_statistics.record_prefetch_waste();
                continue;
            }
            
            // Attempt prefetch (platform-specific implementation)
            if (self.execute_prefetch(request)) {
                _ = self.prefetch_queue.swapRemove(i);
                self.prefetch_statistics.record_prefetch_success();
            } else {
                i += 1;
            }
        }
    }
    
    fn execute_prefetch(self: *PrefetchEngine, request: *const PrefetchRequest) bool {
        _ = self;
        _ = request;
        
        // Platform-specific prefetch instruction
        // On x86: __builtin_prefetch(address, 0, 3)
        // On ARM: __builtin_prefetch(address, 0, 3)
        
        // For now, return true (would use actual prefetch instructions)
        return true;
    }
    
    pub fn get_statistics(self: *const PrefetchEngine) PrefetchStatistics {
        return self.prefetch_statistics;
    }
};
```

#### 4. Cache-Friendly Data Structures
```zig
pub fn CacheOptimizedArray(comptime T: type) type {
    return struct {
        const Self = @This();
        
        allocator: std.mem.Allocator,
        data: []T,
        config: CacheOptimizer.CacheConfig,
        block_size: usize,
        
        pub fn init(allocator: std.mem.Allocator, size: usize, config: CacheOptimizer.CacheConfig) !Self {
            // Align allocation to cache line boundaries
            const cache_line_size = config.cache_line_size;
            const block_size = cache_line_size / @sizeOf(T);
            const aligned_size = ((size + block_size - 1) / block_size) * block_size;
            
            const data = try allocator.alignedAlloc(T, cache_line_size, aligned_size);
            
            return Self{
                .allocator = allocator,
                .data = data,
                .config = config,
                .block_size = block_size,
            };
        }
        
        pub fn deinit(self: *Self) void {
            self.allocator.free(self.data);
        }
        
        pub fn get(self: *Self, index: usize) ?T {
            if (index >= self.data.len) return null;
            
            // Prefetch next cache line if sequential access detected
            if (index + self.block_size < self.data.len) {
                const next_block_addr = @intFromPtr(&self.data[index + self.block_size]);
                _ = next_block_addr; // Would use platform-specific prefetch
            }
            
            return self.data[index];
        }
        
        pub fn set(self: *Self, index: usize, value: T) bool {
            if (index >= self.data.len) return false;
            
            self.data[index] = value;
            return true;
        }
        
        pub fn iterate_cache_friendly(self: *Self, callback: *const fn(T, usize) void) void {
            // Iterate in cache-friendly order (by blocks)
            var block: usize = 0;
            while (block * self.block_size < self.data.len) {
                const start = block * self.block_size;
                const end = @min((block + 1) * self.block_size, self.data.len);
                
                for (start..end) |i| {
                    callback(self.data[i], i);
                }
                
                block += 1;
            }
        }
        
        pub fn sort_cache_friendly(self: *Self) void {
            // Use cache-oblivious sorting algorithm
            self.cache_oblivious_sort(0, self.data.len);
        }
        
        fn cache_oblivious_sort(self: *Self, start: usize, end: usize) void {
            if (end - start <= 1) return;
            if (end - start <= self.block_size) {
                // Use insertion sort for small arrays
                std.sort.insertion(T, self.data[start..end], {}, struct {
                    fn lessThan(context: void, lhs: T, rhs: T) bool {
                        _ = context;
                        return lhs < rhs; // Assumes T supports comparison
                    }
                }.lessThan);
                return;
            }
            
            const mid = start + (end - start) / 2;
            self.cache_oblivious_sort(start, mid);
            self.cache_oblivious_sort(mid, end);
            self.cache_oblivious_merge(start, mid, end);
        }
        
        fn cache_oblivious_merge(self: *Self, start: usize, mid: usize, end: usize) void {
            // Simplified cache-oblivious merge
            // In practice, would use more sophisticated algorithm
            var temp = self.allocator.alloc(T, end - start) catch return;
            defer self.allocator.free(temp);
            
            var i = start;
            var j = mid;
            var k: usize = 0;
            
            while (i < mid and j < end) {
                if (self.data[i] <= self.data[j]) {
                    temp[k] = self.data[i];
                    i += 1;
                } else {
                    temp[k] = self.data[j];
                    j += 1;
                }
                k += 1;
            }
            
            while (i < mid) {
                temp[k] = self.data[i];
                i += 1;
                k += 1;
            }
            
            while (j < end) {
                temp[k] = self.data[j];
                j += 1;
                k += 1;
            }
            
            std.mem.copy(T, self.data[start..end], temp);
        }
    };
}

pub const CacheFriendlyAllocator = struct {
    backing_allocator: std.mem.Allocator,
    config: CacheOptimizer.CacheConfig,
    aligned_allocations: std.ArrayList(AlignedAllocation),
    
    pub const AlignedAllocation = struct {
        ptr: [*]u8,
        size: usize,
        alignment: usize,
    };
    
    pub fn init(backing_allocator: std.mem.Allocator, config: CacheOptimizer.CacheConfig) CacheFriendlyAllocator {
        return CacheFriendlyAllocator{
            .backing_allocator = backing_allocator,
            .config = config,
            .aligned_allocations = std.ArrayList(AlignedAllocation).init(backing_allocator),
        };
    }
    
    pub fn deinit(self: *CacheFriendlyAllocator) void {
        // Free all aligned allocations
        for (self.aligned_allocations.items) |allocation| {
            self.backing_allocator.rawFree(allocation.ptr[0..allocation.size], @intCast(@ctz(allocation.alignment)), 0);
        }
        self.aligned_allocations.deinit();
    }
    
    pub fn allocator(self: *CacheFriendlyAllocator) std.mem.Allocator {
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
        const self = @ptrCast(*CacheFriendlyAllocator, @alignCast(@alignOf(CacheFriendlyAllocator), ctx));
        
        // Ensure alignment is at least cache line size for better performance
        const cache_align = @ctz(self.config.cache_line_size);
        const final_align = @max(ptr_align, cache_align);
        
        const ptr = self.backing_allocator.rawAlloc(len, final_align, ret_addr) orelse return null;
        
        // Track allocation
        const allocation = AlignedAllocation{
            .ptr = ptr,
            .size = len,
            .alignment = @as(usize, 1) << final_align,
        };
        
        self.aligned_allocations.append(allocation) catch {
            // If tracking fails, still return the allocation
        };
        
        return ptr;
    }
    
    fn resize(ctx: *anyopaque, buf: []u8, buf_align: u8, new_len: usize, ret_addr: usize) bool {
        const self = @ptrCast(*CacheFriendlyAllocator, @alignCast(@alignOf(CacheFriendlyAllocator), ctx));
        return self.backing_allocator.rawResize(buf, buf_align, new_len, ret_addr);
    }
    
    fn free(ctx: *anyopaque, buf: []u8, buf_align: u8, ret_addr: usize) void {
        const self = @ptrCast(*CacheFriendlyAllocator, @alignCast(@alignOf(CacheFriendlyAllocator), ctx));
        
        // Remove from tracking
        for (self.aligned_allocations.items, 0..) |allocation, i| {
            if (allocation.ptr == buf.ptr) {
                _ = self.aligned_allocations.swapRemove(i);
                break;
            }
        }
        
        self.backing_allocator.rawFree(buf, buf_align, ret_addr);
    }
};
```

#### 5. Cache Statistics and Monitoring
```zig
pub const CacheStatistics = struct {
    l1_accesses: u64,
    l1_hits: u64,
    l1_misses: u64,
    l2_accesses: u64,
    l2_hits: u64,
    l2_misses: u64,
    l3_accesses: u64,
    l3_hits: u64,
    l3_misses: u64,
    
    memory_accesses: u64,
    cache_friendly_accesses: u64,
    sequential_accesses: u64,
    random_accesses: u64,
    
    optimization_passes: u64,
    prefetch_requests: u64,
    prefetch_hits: u64,
    
    start_time: i64,
    
    pub fn init() CacheStatistics {
        return CacheStatistics{
            .l1_accesses = 0,
            .l1_hits = 0,
            .l1_misses = 0,
            .l2_accesses = 0,
            .l2_hits = 0,
            .l2_misses = 0,
            .l3_accesses = 0,
            .l3_hits = 0,
            .l3_misses = 0,
            .memory_accesses = 0,
            .cache_friendly_accesses = 0,
            .sequential_accesses = 0,
            .random_accesses = 0,
            .optimization_passes = 0,
            .prefetch_requests = 0,
            .prefetch_hits = 0,
            .start_time = std.time.milliTimestamp(),
        };
    }
    
    pub fn record_access(self: *CacheStatistics, access_type: AccessType) void {
        self.memory_accesses += 1;
        
        switch (access_type) {
            .Sequential => self.sequential_accesses += 1,
            .Random => self.random_accesses += 1,
            else => {},
        }
    }
    
    pub fn record_cache_hit(self: *CacheStatistics, level: CacheLevel) void {
        switch (level) {
            .L1 => {
                self.l1_accesses += 1;
                self.l1_hits += 1;
            },
            .L2 => {
                self.l2_accesses += 1;
                self.l2_hits += 1;
            },
            .L3 => {
                self.l3_accesses += 1;
                self.l3_hits += 1;
            },
        }
    }
    
    pub fn record_cache_miss(self: *CacheStatistics, level: CacheLevel) void {
        switch (level) {
            .L1 => {
                self.l1_accesses += 1;
                self.l1_misses += 1;
            },
            .L2 => {
                self.l2_accesses += 1;
                self.l2_misses += 1;
            },
            .L3 => {
                self.l3_accesses += 1;
                self.l3_misses += 1;
            },
        }
    }
    
    pub fn record_optimization_pass(self: *CacheStatistics) void {
        self.optimization_passes += 1;
    }
    
    pub fn record_prefetch_request(self: *CacheStatistics) void {
        self.prefetch_requests += 1;
    }
    
    pub fn record_prefetch_hit(self: *CacheStatistics) void {
        self.prefetch_hits += 1;
    }
    
    pub fn get_l1_hit_rate(self: *const CacheStatistics) f64 {
        return if (self.l1_accesses > 0)
            @as(f64, @floatFromInt(self.l1_hits)) / @as(f64, @floatFromInt(self.l1_accesses))
        else
            0.0;
    }
    
    pub fn get_l2_hit_rate(self: *const CacheStatistics) f64 {
        return if (self.l2_accesses > 0)
            @as(f64, @floatFromInt(self.l2_hits)) / @as(f64, @floatFromInt(self.l2_accesses))
        else
            0.0;
    }
    
    pub fn get_l3_hit_rate(self: *const CacheStatistics) f64 {
        return if (self.l3_accesses > 0)
            @as(f64, @floatFromInt(self.l3_hits)) / @as(f64, @floatFromInt(self.l3_accesses))
        else
            0.0;
    }
    
    pub fn get_overall_hit_rate(self: *const CacheStatistics) f64 {
        const total_hits = self.l1_hits + self.l2_hits + self.l3_hits;
        const total_accesses = self.l1_accesses + self.l2_accesses + self.l3_accesses;
        
        return if (total_accesses > 0)
            @as(f64, @floatFromInt(total_hits)) / @as(f64, @floatFromInt(total_accesses))
        else
            0.0;
    }
    
    pub fn get_prefetch_effectiveness(self: *const CacheStatistics) f64 {
        return if (self.prefetch_requests > 0)
            @as(f64, @floatFromInt(self.prefetch_hits)) / @as(f64, @floatFromInt(self.prefetch_requests))
        else
            0.0;
    }
    
    pub fn get_access_pattern_ratio(self: *const CacheStatistics) f64 {
        return if (self.memory_accesses > 0)
            @as(f64, @floatFromInt(self.sequential_accesses)) / @as(f64, @floatFromInt(self.memory_accesses))
        else
            0.0;
    }
    
    pub fn get_uptime_seconds(self: *const CacheStatistics) f64 {
        const now = std.time.milliTimestamp();
        return @as(f64, @floatFromInt(now - self.start_time)) / 1000.0;
    }
    
    pub fn print_summary(self: *const CacheStatistics) void {
        const l1_hit_rate = self.get_l1_hit_rate() * 100.0;
        const l2_hit_rate = self.get_l2_hit_rate() * 100.0;
        const l3_hit_rate = self.get_l3_hit_rate() * 100.0;
        const overall_hit_rate = self.get_overall_hit_rate() * 100.0;
        const prefetch_effectiveness = self.get_prefetch_effectiveness() * 100.0;
        const sequential_ratio = self.get_access_pattern_ratio() * 100.0;
        
        std.log.info("=== CACHE OPTIMIZATION STATISTICS ===");
        std.log.info("L1 Cache: {} accesses, {} hits ({d:.2}%)", .{ self.l1_accesses, self.l1_hits, l1_hit_rate });
        std.log.info("L2 Cache: {} accesses, {} hits ({d:.2}%)", .{ self.l2_accesses, self.l2_hits, l2_hit_rate });
        std.log.info("L3 Cache: {} accesses, {} hits ({d:.2}%)", .{ self.l3_accesses, self.l3_hits, l3_hit_rate });
        std.log.info("Overall hit rate: {d:.2}%", .{overall_hit_rate});
        std.log.info("Memory accesses: {}", .{self.memory_accesses});
        std.log.info("Sequential accesses: {} ({d:.2}%)", .{ self.sequential_accesses, sequential_ratio });
        std.log.info("Random accesses: {}", .{self.random_accesses});
        std.log.info("Prefetch requests: {}, hits: {} ({d:.2}%)", .{ self.prefetch_requests, self.prefetch_hits, prefetch_effectiveness });
        std.log.info("Optimization passes: {}", .{self.optimization_passes});
        std.log.info("Uptime: {d:.2}s", .{self.get_uptime_seconds()});
    }
    
    pub const CacheLevel = enum {
        L1,
        L2,
        L3,
    };
};
```

## Implementation Requirements

### Core Functionality
1. **Access Pattern Analysis**: Track and analyze memory access patterns for optimization
2. **Intelligent Prefetching**: Predict and prefetch data based on access patterns
3. **Cache-Friendly Layouts**: Optimize data structure layouts for better cache performance
4. **Memory Alignment**: Align data structures to cache line boundaries
5. **Performance Monitoring**: Track cache performance metrics and optimization effectiveness
6. **Adaptive Optimization**: Dynamically adjust optimization strategies based on observed patterns

## Implementation Tasks

### Task 1: Implement Data Layout Optimizer
File: `/src/evm/cache_optimization/data_layout_optimizer.zig`
```zig
const std = @import("std");

pub const DataLayoutOptimizer = struct {
    allocator: std.mem.Allocator,
    config: CacheOptimizer.CacheConfig,
    layout_cache: std.HashMap(type, OptimizedLayout, TypeContext, std.hash_map.default_max_load_percentage),
    
    pub const OptimizedLayout = struct {
        original_size: usize,
        optimized_size: usize,
        field_order: []u32,
        padding_bytes: usize,
        cache_efficiency: f64,
    };
    
    pub fn init(allocator: std.mem.Allocator, config: CacheOptimizer.CacheConfig) DataLayoutOptimizer {
        return DataLayoutOptimizer{
            .allocator = allocator,
            .config = config,
            .layout_cache = std.HashMap(type, OptimizedLayout, TypeContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
    }
    
    pub fn deinit(self: *DataLayoutOptimizer) void {
        var iterator = self.layout_cache.iterator();
        while (iterator.next()) |entry| {
            self.allocator.free(entry.value_ptr.field_order);
        }
        self.layout_cache.deinit();
    }
    
    pub fn optimize_struct_layout(self: *DataLayoutOptimizer, comptime T: type) type {
        // Analyze struct fields and reorder for optimal cache usage
        const fields = std.meta.fields(T);
        if (fields.len <= 1) return T;
        
        // Check cache for existing optimization
        if (self.layout_cache.get(T)) |cached| {
            return self.create_optimized_type(T, cached.field_order);
        }
        
        // Perform optimization
        const optimized = self.optimize_field_order(T);
        self.layout_cache.put(T, optimized) catch {};
        
        return self.create_optimized_type(T, optimized.field_order);
    }
    
    fn optimize_field_order(self: *DataLayoutOptimizer, comptime T: type) OptimizedLayout {
        const fields = std.meta.fields(T);
        var field_order = self.allocator.alloc(u32, fields.len) catch return self.default_layout(T);
        
        // Initialize with original order
        for (0..fields.len) |i| {
            field_order[i] = @intCast(i);
        }
        
        // Sort fields by alignment requirements (largest first) to minimize padding
        std.sort.sort(u32, field_order, fields, struct {
            fn lessThan(context: []const std.builtin.Type.StructField, lhs: u32, rhs: u32) bool {
                const lhs_align = @alignOf(context[lhs].type);
                const rhs_align = @alignOf(context[rhs].type);
                
                if (lhs_align != rhs_align) {
                    return lhs_align > rhs_align;
                }
                
                // If alignment is same, sort by size
                const lhs_size = @sizeOf(context[lhs].type);
                const rhs_size = @sizeOf(context[rhs].type);
                return lhs_size > rhs_size;
            }
        }.lessThan);
        
        const original_size = @sizeOf(T);
        const optimized_size = self.calculate_optimized_size(T, field_order);
        const padding_bytes = self.calculate_padding(T, field_order);
        
        return OptimizedLayout{
            .original_size = original_size,
            .optimized_size = optimized_size,
            .field_order = field_order,
            .padding_bytes = padding_bytes,
            .cache_efficiency = self.estimate_cache_efficiency(optimized_size),
        };
    }
    
    fn default_layout(self: *DataLayoutOptimizer, comptime T: type) OptimizedLayout {
        const fields = std.meta.fields(T);
        var field_order = self.allocator.alloc(u32, fields.len) catch &[_]u32{};
        
        for (0..fields.len) |i| {
            field_order[i] = @intCast(i);
        }
        
        return OptimizedLayout{
            .original_size = @sizeOf(T),
            .optimized_size = @sizeOf(T),
            .field_order = field_order,
            .padding_bytes = 0,
            .cache_efficiency = 0.5,
        };
    }
    
    fn create_optimized_type(self: *DataLayoutOptimizer, comptime T: type, field_order: []const u32) type {
        _ = self;
        
        const fields = std.meta.fields(T);
        var optimized_fields: [fields.len]std.builtin.Type.StructField = undefined;
        
        for (field_order, 0..) |original_index, new_index| {
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
    
    fn calculate_optimized_size(self: *DataLayoutOptimizer, comptime T: type, field_order: []const u32) usize {
        _ = self;
        _ = T;
        _ = field_order;
        
        // Simplified calculation - would implement proper size calculation
        return @sizeOf(T);
    }
    
    fn calculate_padding(self: *DataLayoutOptimizer, comptime T: type, field_order: []const u32) usize {
        _ = self;
        _ = field_order;
        
        const fields = std.meta.fields(T);
        var field_size_sum: usize = 0;
        
        for (fields) |field| {
            field_size_sum += @sizeOf(field.type);
        }
        
        return @sizeOf(T) - field_size_sum;
    }
    
    fn estimate_cache_efficiency(self: *DataLayoutOptimizer, size: usize) f64 {
        const cache_line_size = self.config.cache_line_size;
        
        if (size <= cache_line_size) {
            return 0.9; // Fits in one cache line
        } else if (size <= cache_line_size * 2) {
            return 0.7; // Spans two cache lines
        } else if (size <= cache_line_size * 4) {
            return 0.5; // Spans multiple cache lines
        } else {
            return 0.3; // Large structure
        }
    }
    
    pub const TypeContext = struct {
        pub fn hash(self: @This(), key: type) u64 {
            _ = self;
            return @intFromPtr(&key);
        }
        
        pub fn eql(self: @This(), a: type, b: type) bool {
            _ = self;
            return a == b;
        }
    };
};
```

### Task 2: Integrate with VM Memory Operations
File: `/src/evm/vm.zig` (modify existing)
```zig
const CacheOptimizer = @import("cache_optimization/cache_optimizer.zig").CacheOptimizer;

pub const Vm = struct {
    // Existing fields...
    cache_optimizer: ?CacheOptimizer,
    cache_enabled: bool,
    
    pub fn enable_cache_optimization(self: *Vm, config: CacheOptimizer.CacheConfig) !void {
        self.cache_optimizer = CacheOptimizer.init(self.allocator, config);
        self.cache_enabled = true;
    }
    
    pub fn disable_cache_optimization(self: *Vm) void {
        if (self.cache_optimizer) |*optimizer| {
            optimizer.deinit();
            self.cache_optimizer = null;
        }
        self.cache_enabled = false;
    }
    
    // Override memory access functions to track patterns
    pub fn read_memory_optimized(self: *Vm, offset: u32, size: u32) []const u8 {
        const data = self.memory.read(offset, size);
        
        if (self.cache_optimizer) |*optimizer| {
            optimizer.track_memory_access(@intFromPtr(data.ptr), size, .Read);
        }
        
        return data;
    }
    
    pub fn write_memory_optimized(self: *Vm, offset: u32, data: []const u8) !void {
        try self.memory.write(offset, data);
        
        if (self.cache_optimizer) |*optimizer| {
            optimizer.track_memory_access(@intFromPtr(data.ptr), data.len, .Write);
        }
    }
    
    pub fn get_cache_statistics(self: *Vm) ?CacheOptimizer.CacheStatistics {
        if (self.cache_optimizer) |*optimizer| {
            return optimizer.get_cache_statistics();
        }
        return null;
    }
    
    pub fn run_cache_optimization(self: *Vm) !void {
        if (self.cache_optimizer) |*optimizer| {
            try optimizer.run_optimization_pass();
        }
    }
};
```

### Task 3: Cache-Optimized EVM Memory
File: `/src/evm/memory/cache_optimized_memory.zig`
```zig
const std = @import("std");
const CacheOptimizer = @import("../cache_optimization/cache_optimizer.zig").CacheOptimizer;

pub const CacheOptimizedMemory = struct {
    allocator: std.mem.Allocator,
    data: []u8,
    cache_optimizer: *CacheOptimizer,
    cache_line_size: u32,
    prefetch_enabled: bool,
    
    pub fn init(
        allocator: std.mem.Allocator, 
        initial_size: usize,
        cache_optimizer: *CacheOptimizer
    ) !CacheOptimizedMemory {
        const cache_line_size = cache_optimizer.config.cache_line_size;
        
        // Align memory to cache line boundaries
        const aligned_size = ((initial_size + cache_line_size - 1) / cache_line_size) * cache_line_size;
        const data = try allocator.alignedAlloc(u8, cache_line_size, aligned_size);
        
        return CacheOptimizedMemory{
            .allocator = allocator,
            .data = data,
            .cache_optimizer = cache_optimizer,
            .cache_line_size = cache_line_size,
            .prefetch_enabled = cache_optimizer.config.enable_prefetching,
        };
    }
    
    pub fn deinit(self: *CacheOptimizedMemory) void {
        self.allocator.free(self.data);
    }
    
    pub fn read(self: *CacheOptimizedMemory, offset: u32, size: u32) []const u8 {
        if (offset + size > self.data.len) {
            return &[_]u8{};
        }
        
        const start_addr = @intFromPtr(&self.data[offset]);
        self.cache_optimizer.track_memory_access(start_addr, size, .Read);
        
        // Prefetch next cache line if sequential access is likely
        if (self.prefetch_enabled and size > 0) {
            const next_offset = offset + size;
            if (next_offset + self.cache_line_size <= self.data.len) {
                const prefetch_addr = @intFromPtr(&self.data[next_offset]);
                self.cache_optimizer.track_memory_access(prefetch_addr, self.cache_line_size, .Prefetch);
            }
        }
        
        return self.data[offset..offset + size];
    }
    
    pub fn write(self: *CacheOptimizedMemory, offset: u32, data: []const u8) !void {
        const end_offset = offset + data.len;
        
        // Expand memory if needed (cache-line aligned)
        if (end_offset > self.data.len) {
            try self.expand_to_fit(end_offset);
        }
        
        const start_addr = @intFromPtr(&self.data[offset]);
        self.cache_optimizer.track_memory_access(start_addr, data.len, .Write);
        
        @memcpy(self.data[offset..offset + data.len], data);
        
        // Prefetch for potential future writes
        if (self.prefetch_enabled and data.len >= self.cache_line_size) {
            const next_offset = offset + @as(u32, @intCast(data.len));
            if (next_offset + self.cache_line_size <= self.data.len) {
                const prefetch_addr = @intFromPtr(&self.data[next_offset]);
                self.cache_optimizer.track_memory_access(prefetch_addr, self.cache_line_size, .Prefetch);
            }
        }
    }
    
    pub fn copy(self: *CacheOptimizedMemory, dest_offset: u32, src_offset: u32, size: u32) !void {
        if (src_offset + size > self.data.len or dest_offset + size > self.data.len) {
            const max_needed = @max(src_offset + size, dest_offset + size);
            try self.expand_to_fit(max_needed);
        }
        
        // Track both read and write access
        const src_addr = @intFromPtr(&self.data[src_offset]);
        const dest_addr = @intFromPtr(&self.data[dest_offset]);
        
        self.cache_optimizer.track_memory_access(src_addr, size, .Read);
        self.cache_optimizer.track_memory_access(dest_addr, size, .Write);
        
        // Use cache-friendly copy for large data
        if (size >= self.cache_line_size * 4) {
            self.cache_friendly_copy(dest_offset, src_offset, size);
        } else {
            std.mem.copy(u8, self.data[dest_offset..dest_offset + size], self.data[src_offset..src_offset + size]);
        }
    }
    
    fn expand_to_fit(self: *CacheOptimizedMemory, needed_size: usize) !void {
        const current_size = self.data.len;
        if (needed_size <= current_size) return;
        
        // Align new size to cache lines
        const aligned_size = ((needed_size + self.cache_line_size - 1) / self.cache_line_size) * self.cache_line_size;
        
        // Allocate new aligned memory
        const new_data = try self.allocator.alignedAlloc(u8, self.cache_line_size, aligned_size);
        
        // Copy existing data
        @memcpy(new_data[0..current_size], self.data);
        
        // Initialize new memory to zero
        @memset(new_data[current_size..], 0);
        
        // Replace old memory
        self.allocator.free(self.data);
        self.data = new_data;
    }
    
    fn cache_friendly_copy(self: *CacheOptimizedMemory, dest_offset: u32, src_offset: u32, size: u32) void {
        const cache_line_size = self.cache_line_size;
        var remaining = size;
        var src_pos = src_offset;
        var dest_pos = dest_offset;
        
        // Copy cache line by cache line for better performance
        while (remaining >= cache_line_size) {
            const chunk_size = @min(remaining, cache_line_size * 4); // Copy 4 cache lines at a time
            
            @memcpy(
                self.data[dest_pos..dest_pos + chunk_size],
                self.data[src_pos..src_pos + chunk_size]
            );
            
            src_pos += chunk_size;
            dest_pos += chunk_size;
            remaining -= chunk_size;
        }
        
        // Copy remaining bytes
        if (remaining > 0) {
            @memcpy(
                self.data[dest_pos..dest_pos + remaining],
                self.data[src_pos..src_pos + remaining]
            );
        }
    }
    
    pub fn clear(self: *CacheOptimizedMemory) void {
        @memset(self.data, 0);
        
        // Track memory write for the entire cleared region
        const start_addr = @intFromPtr(self.data.ptr);
        self.cache_optimizer.track_memory_access(start_addr, self.data.len, .Write);
    }
    
    pub fn size(self: *const CacheOptimizedMemory) usize {
        return self.data.len;
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/cache_optimization/cache_optimization_test.zig`

### Test Cases
```zig
test "cache optimizer initialization and configuration" {
    // Test optimizer creation with different configs
    // Test enable/disable functionality
    // Test configuration validation
}

test "access pattern tracking" {
    // Test sequential access pattern detection
    // Test random access pattern detection
    // Test stride pattern detection
}

test "prefetch engine functionality" {
    // Test prefetch request generation
    // Test prefetch effectiveness
    // Test adaptive prefetch strategies
}

test "cache-friendly data structures" {
    // Test cache-optimized arrays
    // Test cache-friendly allocator
    // Test memory alignment
}

test "data layout optimization" {
    // Test struct layout optimization
    // Test field reordering for cache efficiency
    // Test padding reduction
}

test "integration with VM memory operations" {
    // Test VM integration
    // Test memory access tracking
    // Test performance impact
}

test "performance benchmarks" {
    // Benchmark cache optimization effectiveness
    // Compare optimized vs non-optimized performance
    // Measure cache hit rates
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/cache_optimization/cache_optimizer.zig` - Main cache optimization framework
- `/src/evm/cache_optimization/access_pattern_tracker.zig` - Memory access pattern analysis
- `/src/evm/cache_optimization/prefetch_engine.zig` - Intelligent prefetching system
- `/src/evm/cache_optimization/data_layout_optimizer.zig` - Data structure layout optimization
- `/src/evm/cache_optimization/cache_statistics.zig` - Performance monitoring and statistics
- `/src/evm/memory/cache_optimized_memory.zig` - Cache-optimized memory implementation
- `/src/evm/vm.zig` - VM integration with cache optimization
- `/test/evm/cache_optimization/cache_optimization_test.zig` - Comprehensive tests

## Success Criteria

1. **Improved Cache Performance**: 15-30% improvement in cache hit rates
2. **Better Memory Locality**: Optimized data layouts and access patterns
3. **Effective Prefetching**: High prefetch accuracy with minimal cache pollution
4. **Adaptive Optimization**: Dynamic adjustment based on observed patterns
5. **Minimal Overhead**: <5% performance overhead when optimization is enabled
6. **Comprehensive Monitoring**: Detailed cache performance metrics and analysis

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Performance validation** - Must demonstrate measurable cache improvements
3. **Memory safety** - No corruption or leaks in optimized data structures
4. **Platform compatibility** - Work across different CPU architectures
5. **Correctness** - Optimizations must not change program behavior
6. **Resource efficiency** - Optimization overhead must be justified by gains

## References

- [Cache-Oblivious Algorithms](https://en.wikipedia.org/wiki/Cache-oblivious_algorithm) - Algorithm design for cache efficiency
- [CPU Cache](https://en.wikipedia.org/wiki/CPU_cache) - Cache hierarchy and behavior
- [Memory Hierarchy](https://en.wikipedia.org/wiki/Memory_hierarchy) - Memory system design principles
- [Prefetching](https://en.wikipedia.org/wiki/Cache_prefetching) - Hardware and software prefetching techniques
- [Data Structure Alignment](https://en.wikipedia.org/wiki/Data_structure_alignment) - Memory layout optimization