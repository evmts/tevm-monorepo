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

## Development Workflow
- **Branch**: `feat_implement_cache_optimization` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_cache_optimization feat_implement_cache_optimization`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


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

#### 1. **Unit Tests** (`/test/evm/cache/cache_optimization_test.zig`)
```zig
// Test basic cache optimization functionality
test "cache_optimization basic functionality works correctly"
test "cache_optimization handles edge cases properly"
test "cache_optimization validates inputs appropriately"
test "cache_optimization produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "cache_optimization integrates with EVM properly"
test "cache_optimization maintains system compatibility"
test "cache_optimization works with existing components"
test "cache_optimization handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "cache_optimization meets performance requirements"
test "cache_optimization optimizes resource usage"
test "cache_optimization scales appropriately with load"
test "cache_optimization benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "cache_optimization meets specification requirements"
test "cache_optimization maintains EVM compatibility"
test "cache_optimization handles hardfork transitions"
test "cache_optimization cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "cache_optimization handles errors gracefully"
test "cache_optimization proper error propagation"
test "cache_optimization recovery from failure states"
test "cache_optimization validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "cache_optimization prevents security vulnerabilities"
test "cache_optimization handles malicious inputs safely"
test "cache_optimization maintains isolation boundaries"
test "cache_optimization validates security properties"
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
test "cache_optimization basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = cache_optimization.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const cache_optimization = struct {
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

- [Cache-Oblivious Algorithms](https://en.wikipedia.org/wiki/Cache-oblivious_algorithm) - Algorithm design for cache efficiency
- [CPU Cache](https://en.wikipedia.org/wiki/CPU_cache) - Cache hierarchy and behavior
- [Memory Hierarchy](https://en.wikipedia.org/wiki/Memory_hierarchy) - Memory system design principles
- [Prefetching](https://en.wikipedia.org/wiki/Cache_prefetching) - Hardware and software prefetching techniques
- [Data Structure Alignment](https://en.wikipedia.org/wiki/Data_structure_alignment) - Memory layout optimization

## EVMONE Context

This is an excellent and well-structured prompt. The request for cache optimization is highly relevant for EVM performance. `evmone` contains several patterns and implementation details that will be very helpful, particularly in its "Advanced" interpreter which pre-analyzes bytecode into basic blocks to optimize the execution loop.

Here are the most relevant code snippets from `evmone` to provide context for this implementation.

<evmone>
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


/// The execution state specialized for the Advanced interpreter.
struct AdvancedExecutionState : ExecutionState
{
    // ... (fields like gas_left, stack, etc.)

    /// The gas cost of the current block.
    ///
    /// This is only needed to correctly calculate the "current gas left" value.
    uint32_t current_block_cost = 0;

    // ...
};

union InstructionArgument
{
    int64_t number;
    const intx::uint256* push_value;
    uint64_t small_push_value;
    BlockInfo block{};
};
static_assert(
    sizeof(InstructionArgument) == sizeof(uint64_t), "Incorrect size of instruction_argument");

/// The pointer to function implementing an instruction execution.
using instruction_exec_fn = const Instruction* (*)(const Instruction*, AdvancedExecutionState&);


struct Instruction
{
    instruction_exec_fn fn = nullptr;
    InstructionArgument arg;

    explicit constexpr Instruction(instruction_exec_fn f) noexcept : fn{f}, arg{} {}
};

struct AdvancedCodeAnalysis
{
    std::vector<Instruction> instrs;

    /// Storage for large push values.
    std::vector<intx::uint256> push_values;

    /// The offsets of JUMPDESTs in the original code.
    /// These are values that JUMP/JUMPI receives as an argument.
    /// The elements are sorted.
    std::vector<int32_t> jumpdest_offsets;

    /// The indexes of the instructions in the generated instruction table
    /// matching the elements from jumdest_offsets.
    /// This is value to which the next instruction pointer must be set in JUMP/JUMPI.
    std::vector<int32_t> jumpdest_targets;
};

inline int find_jumpdest(const AdvancedCodeAnalysis& analysis, int offset) noexcept
{
    const auto begin = std::begin(analysis.jumpdest_offsets);
    const auto end = std::end(analysis.jumpdest_offsets);
    const auto it = std::lower_bound(begin, end, offset);
    return (it != end && *it == offset) ?
               analysis.jumpdest_targets[static_cast<size_t>(it - begin)] :
               -1;
}

EVMC_EXPORT AdvancedCodeAnalysis analyze(evmc_revision rev, bytes_view code) noexcept;
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/advanced_analysis.cpp">
```cpp
// This is the core analysis logic that creates basic blocks, which is a form of
// code layout optimization for the interpreter. It mirrors the concept of an
// "automatic optimization pass" from the prompt.

struct BlockAnalysis
{
    int64_t gas_cost = 0;

    int stack_req = 0;
    int stack_max_growth = 0;
    int stack_change = 0;

    /// The index of the beginblock instruction that starts the block.
    /// This is the place where the analysis data is going to be dumped.
    size_t begin_block_index = 0;

    explicit BlockAnalysis(size_t index) noexcept : begin_block_index{index} {}

    /// Close the current block by producing compressed information about the block.
    [[nodiscard]] BlockInfo close() const noexcept
    {
        return {clamp<decltype(BlockInfo{}.gas_cost)>(gas_cost),
            clamp<decltype(BlockInfo{}.stack_req)>(stack_req),
            clamp<decltype(BlockInfo{}.stack_max_growth)>(stack_max_growth)};
    }
};

AdvancedCodeAnalysis analyze(evmc_revision rev, bytes_view code) noexcept
{
    const auto& op_tbl = get_op_table(rev);
    const auto opx_beginblock_fn = op_tbl[OPX_BEGINBLOCK].fn;

    AdvancedCodeAnalysis analysis;

    // ... (code omitted for brevity)

    // Create first block.
    analysis.instrs.emplace_back(opx_beginblock_fn);
    auto block = BlockAnalysis{0};

    // ...
    while (code_pos != code_end)
    {
        const auto opcode = *code_pos++;
        const auto& opcode_info = op_tbl[opcode];

        if (opcode == OP_JUMPDEST)
        {
            // Save current block.
            analysis.instrs[block.begin_block_index].arg.block = block.close();
            // Create new block.
            block = BlockAnalysis{analysis.instrs.size()};

            // The JUMPDEST is always the first instruction in the block.
            analysis.jumpdest_offsets.emplace_back(static_cast<int32_t>(code_pos - code_begin - 1));
            analysis.jumpdest_targets.emplace_back(static_cast<int32_t>(analysis.instrs.size()));
        }

        analysis.instrs.emplace_back(opcode_info.fn);

        block.stack_req = std::max(block.stack_req, opcode_info.stack_req - block.stack_change);
        block.stack_change += opcode_info.stack_change;
        block.stack_max_growth = std::max(block.stack_max_growth, block.stack_change);

        block.gas_cost += opcode_info.gas_cost;

        // ... (switch statement for opcodes)
    }

    // Save current block.
    analysis.instrs[block.begin_block_index].arg.block = block.close();

    // ...
    return analysis;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
// This file defines the core data structures for the EVM's state during execution.
// `StackSpace` shows a cache-friendly memory allocation strategy by aligning the stack.
// `Memory` shows a simple dynamic memory implementation with a page-based growth strategy.

/// Provides memory for EVM stack.
class StackSpace
{
    // ... (implementation details)

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
    // ...

public:
    /// Creates Memory object with initial capacity allocation.
    Memory() noexcept { allocate_capacity(); }

    uint8_t& operator[](size_t index) noexcept { return m_data[index]; }

    [[nodiscard]] const uint8_t* data() const noexcept { return m_data.get(); }
    [[nodiscard]] size_t size() const noexcept { return m_size; }

    /// Grows the memory to the given size. The extent is filled with zeros.
    void grow(size_t new_size) noexcept;
    // ...
};

/// Generic execution state for generic instructions implementations.
class ExecutionState
{
public:
    int64_t gas_refund = 0;
    Memory memory;
    // ...
    /// Stack space allocation.
    StackSpace stack_space;
    // ...
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/lru_cache.hpp">
```cpp
// This is a direct implementation of a cache data structure (LRU Cache).
// It can serve as a reference for implementing any caching mechanism required
// by the cache optimization feature, such as for tracking access patterns
// or caching optimized data layouts.

/// Least Recently Used (LRU) cache.
///
/// A map of Key to Value with a fixed capacity. When the cache is full, a newly inserted entry
/// replaces (evicts) the least recently used entry.
/// All operations have O(1) complexity.
template <typename Key, typename Value>
class LRUCache
{
    // ... (private members)
public:
    /// Constructs the LRU cache with the given capacity.
    explicit LRUCache(size_t capacity);

    /// Clears the cache by deleting all the entries.
    void clear() noexcept;

    /// Retrieves the copy of the value associated with the specified key.
    std::optional<Value> get(const Key& key) noexcept;

    /// Inserts or updates the value associated with the specified key.
    void put(Key key, Value value);
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_execution.cpp">
```cpp
// This file contains the core interpreter loops. The `dispatch_cgoto` function
// is a key performance optimization for instruction caching and branch prediction,
// which is a form of cache optimization at the CPU level. The `check_requirements`
// function is also relevant as it shows how pre-validation enables faster, unsafe
// operations in the hot path.

/// Checks instruction requirements before execution.
template <Opcode Op>
inline evmc_status_code check_requirements(const CostTable& cost_table, int64_t& gas_left,
    const uint256* stack_top, const uint256* stack_bottom) noexcept;

// ...

#if EVMONE_CGOTO_SUPPORTED
int64_t dispatch_cgoto(
    const CostTable& cost_table, ExecutionState& state, int64_t gas, const uint8_t* code) noexcept
{
#pragma GCC diagnostic ignored "-Wpedantic"

    static constexpr void* cgoto_table[] = {
#define ON_OPCODE(OPCODE) &&TARGET_##OPCODE,
#undef ON_OPCODE_UNDEFINED
#define ON_OPCODE_UNDEFINED(_) &&TARGET_OP_UNDEFINED,
        MAP_OPCODES
#undef ON_OPCODE
#undef ON_OPCODE_UNDEFINED
#define ON_OPCODE_UNDEFINED ON_OPCODE_UNDEFINED_DEFAULT
    };
    static_assert(std::size(cgoto_table) == 256);

    const auto stack_bottom = state.stack_space.bottom();

    // Code iterator and stack top pointer for interpreter loop.
    Position position{code, stack_bottom};

    goto* cgoto_table[*position.code_it];

#define ON_OPCODE(OPCODE)                                                                 \
    TARGET_##OPCODE : ASM_COMMENT(OPCODE);                                                \
    if (const auto next = invoke<OPCODE>(cost_table, stack_bottom, position, gas, state); \
        next.code_it == nullptr)                                                          \
    {                                                                                     \
        return gas;                                                                       \
    }                                                                                     \
    else                                                                                  \
    {                                                                                     \
        /* Update current position only when no error,                                    \
           this improves compiler optimization. */                                        \
        position = next;                                                                  \
    }                                                                                     \
    goto* cgoto_table[*position.code_it];

    MAP_OPCODES
#undef ON_OPCODE

TARGET_OP_UNDEFINED:
    state.status = EVMC_UNDEFINED_INSTRUCTION;
    return gas;
}
#endif
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/bench/helpers.hpp">
```cpp
// This file demonstrates how `evmone` structures its benchmarks. This is
// relevant for implementing "Comprehensive cache statistics and monitoring"
// to measure the effectiveness of the cache optimizations.

template <typename AnalysisT, AnalyseFn<AnalysisT> analyse_fn>
inline void bench_analyse(benchmark::State& state, evmc_revision rev, bytes_view code) noexcept
{
    auto bytes_analysed = uint64_t{0};
    for (auto _ : state)
    {
        auto r = analyse_fn(rev, code);
        benchmark::DoNotOptimize(&r);
        bytes_analysed += code.size();
    }

    using benchmark::Counter;
    state.counters["size"] = Counter(static_cast<double>(code.size()));
    state.counters["rate"] = Counter(static_cast<double>(bytes_analysed), Counter::kIsRate);
}


template <typename ExecutionStateT, typename AnalysisT,
    ExecuteFn<ExecutionStateT, AnalysisT> execute_fn, AnalyseFn<AnalysisT> analyse_fn>
inline void bench_execute(benchmark::State& state, evmc::VM& vm, bytes_view code, bytes_view input,
    bytes_view expected_output) noexcept
{
    // ... (setup omitted for brevity)

    auto total_gas_used = int64_t{0};
    auto iteration_gas_used = int64_t{0};
    for (auto _ : state)
    {
        const auto r = execute_fn(vm, exec_state, analysis, msg, rev, host, code);
        iteration_gas_used = gas_limit - r.gas_left;
        total_gas_used += iteration_gas_used;
    }

    using benchmark::Counter;
    state.counters["gas_used"] = Counter(static_cast<double>(iteration_gas_used));
    state.counters["gas_rate"] = Counter(static_cast<double>(total_gas_used), Counter::kIsRate);
}
```
</file>
</evmone>



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/database/src/in_memory_db.rs">
```rust
/// A cache used in [CacheDB]. Its kept separate so it can be used independently.
///
/// Accounts and code are stored in two separate maps, the `accounts` map maps addresses to [DbAccount],
/// whereas contracts are identified by their code hash, and are stored in the `contracts` map.
/// The [DbAccount] holds the code hash of the contract, which is used to look up the contract in the `contracts` map.
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Cache {
    /// Account info where None means it is not existing. Not existing state is needed for Pre TANGERINE forks.
    /// `code` is always `None`, and bytecode can be found in `contracts`.
    pub accounts: HashMap<Address, DbAccount>,
    /// Tracks all contracts by their code hash.
    pub contracts: HashMap<B256, Bytecode>,
    /// All logs that were committed via [DatabaseCommit::commit].
    pub logs: Vec<Log>,
    /// All cached block hashes from the [DatabaseRef].
    pub block_hashes: HashMap<U256, B256>,
}

// ...

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

    fn code_by_hash(&mut self, code_hash: B256) -> Result<Bytecode, Self::Error> {
        match self.cache.contracts.entry(code_hash) {
            Entry::Occupied(entry) => Ok(entry.get().clone()),
            Entry::Vacant(entry) => {
                // If you return code bytes when basic fn is called this function is not needed.
                Ok(entry.insert(self.db.code_by_hash_ref(code_hash)?).clone())
            }
        }
    }

    /// Get the value in an account's storage slot.
    ///
    /// It is assumed that account is already loaded.
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
            // ...
        }
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/shared_memory.rs">
```rust
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

// ...

impl SharedMemory {
    /// Creates a new memory instance that can be shared between calls.
    ///
    /// The default initial capacity is 4KiB.
    #[inline]
    pub fn new() -> Self {
        Self::with_capacity(4 * 1024) // from evmone
    }

    /// Resizes the memory in-place so that `len` is equal to `new_len`.
    #[inline]
    pub fn resize(&mut self, new_size: usize) {
        self.buffer
            .borrow_mut()
            .resize(self.my_checkpoint + new_size, 0);
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
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/state/src/lib.rs">
```rust
// ...
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

// ...

/// This type keeps track of the current value of a storage slot.
#[derive(Debug, Clone, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct EvmStorageSlot {
    /// Original value of the storage slot
    pub original_value: StorageValue,
    /// Present value of the storage slot
    pub present_value: StorageValue,
    /// Transaction id, used to track when storage slot was made warm.
    pub transaction_id: usize,
    /// Represents if the storage slot is cold
    pub is_cold: bool,
}

impl EvmStorageSlot {
    // ...
    /// Marks the storage slot as warm and sets transaction_id to the given value
    ///
    ///
    /// Returns false if old transition_id is different from given id or in case they are same return `Self::is_cold` value.
    #[inline]
    pub fn mark_warm_with_transaction_id(&mut self, transaction_id: usize) -> bool {
        let same_id = self.transaction_id == transaction_id;
        self.transaction_id = transaction_id;
        let was_cold = core::mem::replace(&mut self.is_cold, false);

        if same_id {
            // only if transaction id is same we are returning was_cold.
            return was_cold;
        }
        true
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/journal/inner.rs">
```rust
// ...
impl<ENTRY: JournalEntryTr> JournalInner<ENTRY> {
    // ...
    /// Loads account. If account is already loaded it will be marked as warm.
    #[inline]
    pub fn load_account_optional<DB: Database>(
        &mut self,
        db: &mut DB,
        address: Address,
        load_code: bool,
    ) -> Result<StateLoad<&mut Account>, DB::Error> {
        let load = match self.state.entry(address) {
            Entry::Occupied(entry) => {
                let account = entry.into_mut();
                let is_cold = account.mark_warm();
                StateLoad {
                    data: account,
                    is_cold,
                }
            }
            Entry::Vacant(vac) => {
                let account = if let Some(account) = db.basic(address)? {
                    account.into()
                } else {
                    Account::new_not_existing(self.transaction_id)
                };

                // Precompiles among some other account are warm loaded so we need to take that into account
                let is_cold = !self.warm_preloaded_addresses.contains(&address);

                StateLoad {
                    data: vac.insert(account),
                    is_cold,
                }
            }
        };
        // journal loading of cold account.
        if load.is_cold {
            self.journal.push(ENTRY::account_warmed(address));
        }
        // ...
        Ok(load)
    }

    /// Loads storage slot.
    ///
    /// # Panics
    ///
    /// Panics if the account is not present in the state.
    #[inline]
    pub fn sload<DB: Database>(
        &mut self,
        db: &mut DB,
        address: Address,
        key: StorageKey,
    ) -> Result<StateLoad<StorageValue>, DB::Error> {
        // assume acc is warm
        let account = self.state.get_mut(&address).unwrap();
        // only if account is created in this tx we can assume that storage is empty.
        let is_newly_created = account.is_created();
        let (value, is_cold) = match account.storage.entry(key) {
            Entry::Occupied(occ) => {
                let slot = occ.into_mut();
                let is_cold = slot.mark_warm_with_transaction_id(self.transaction_id);
                (slot.present_value, is_cold)
            }
            Entry::Vacant(vac) => {
                // if storage was cleared, we don't need to ping db.
                let value = if is_newly_created {
                    StorageValue::ZERO
                } else {
                    db.storage(address, key)?
                };

                vac.insert(EvmStorageSlot::new(value, self.transaction_id));

                (value, true)
            }
        };

        if is_cold {
            // add it to journal as cold loaded.
            self.journal.push(ENTRY::storage_warmed(address, key));
        }

        Ok(StateLoad::new(value, is_cold))
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/bytecode/src/legacy/analysis.rs">
```rust
/// Analyze the bytecode to find the jumpdests. Used to create a jump table
/// that is needed for [`crate::LegacyAnalyzedBytecode`].
/// This function contains a hot loop and should be optimized as much as possible.
///
/// # Safety
///
/// The function uses unsafe pointer arithmetic, but maintains the following invariants:
/// - The iterator never advances beyond the end of the bytecode
/// - All pointer offsets are within bounds of the bytecode
/// - The jump table is never accessed beyond its allocated size
///
/// Undefined behavior if the bytecode does not end with a valid STOP opcode. Please check
/// [`crate::LegacyAnalyzedBytecode::new`] for details on how the bytecode is validated.
pub fn analyze_legacy(bytecode: Bytes) -> (JumpTable, Bytes) {
    if bytecode.is_empty() {
        return (JumpTable::default(), Bytes::from_static(&[opcode::STOP]));
    }

    let mut jumps: BitVec<u8> = bitvec



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
```python
def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    """
    Calculates the gas amount to extend memory

    Parameters
    ----------
    memory :
        Memory contents of the EVM.
    extensions:
        List of extensions to be made to the memory.
        Consists of a tuple of start position and size.

    Returns
    -------
    extend_memory: `ExtendMemory`
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/memory.py">
```python
def mstore(evm: Evm) -> None:
    """
    Stores a word to memory.
    This also expands the memory, if the memory is
    insufficient to store the word.

    Parameters
    ----------
    evm :
        The current EVM frame.

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


def mstore8(evm: Evm) -> None:
    """
    Stores a byte to memory.
    This also expands the memory, if the memory is
    insufficient to store the word.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    start_position = pop(evm.stack)
    value = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(1))]
    )

    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    normalized_bytes_value = Bytes([value & U256(0xFF)])
    memory_write(evm.memory, start_position, normalized_bytes_value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mload(evm: Evm) -> None:
    """
    Load word from memory.

    Parameters
    ----------
    evm :
        The current EVM frame.

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

    Parameters
    ----------
    evm :
        The current EVM frame.

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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/storage.py">
```python
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/trace.py">
```python
@dataclass
class TransactionStart:
    """
    Trace event that is triggered at the start of a transaction.
    """


@dataclass
class TransactionEnd:
    """
    Trace event that is triggered at the end of a transaction.
    """

    gas_used: int
    """
    Total gas consumed by this transaction.
    """

    output: Bytes
    """
    Return value or revert reason of the outermost frame of execution.
    """

    error: Optional[EthereumException]
    """
    The exception, if any, that caused the transaction to fail.

    See [`ethereum.exceptions`] as well as fork-specific modules like
    [`ethereum.frontier.vm.exceptions`][vm] for details.

    [`ethereum.exceptions`]: ref:ethereum.exceptions
    [vm]: ref:ethereum.frontier.vm.exceptions
    """


@dataclass
class OpStart:
    """
    Trace event that is triggered before executing an opcode.
    """

    op: enum.Enum
    """
    Opcode that is about to be executed.

    Will be an instance of a fork-specific type like, for example,
    [`ethereum.frontier.vm.instructions.Ops`][ops].

    [ops]: ref:ethereum.frontier.vm.instructions.Ops
    """

@dataclass
class GasAndRefund:
    """
    Trace event that is triggered when gas is deducted.
    """

    gas_cost: int
    """
    Amount of gas charged or refunded.
    """


TraceEvent = Union[
    TransactionStart,
    TransactionEnd,
    PrecompileStart,
    PrecompileEnd,
    OpStart,
    OpEnd,
    OpException,
    EvmStop,
    GasAndRefund,
]
"""
All possible types of events that an [`EvmTracer`] is expected to handle.

[`EvmTracer`]: ref:ethereum.trace.EvmTracer
"""

def evm_trace(
    evm: object,
    event: TraceEvent,
    /,
    trace_memory: bool = False,
    trace_stack: bool = True,
    trace_return_data: bool = False,
) -> None:
    """
    Emit a trace to the active [`EvmTracer`].

    [`EvmTracer`]: ref:ethereum.trace.EvmTracer
    """
    global _evm_trace
    _evm_trace(
        evm,
        event,
        trace_memory=trace_memory,
        trace_stack=trace_stack,
        trace_return_data=trace_return_data,
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
```python
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
</execution-specs>
## Prompt Corrections
The provided prompt is very detailed and well-structured. However, there are a few minor inaccuracies and areas for improvement based on the `execution-specs` codebase:

1.  **File Paths**: The prompt specifies new file paths like `/src/evm/cache_optimization/`. The `execution-specs` codebase follows a different structure, organizing code by hardfork (e.g., `src/ethereum/cancun/`). The new modules should likely be placed in a more neutral location like `src/ethereum/utils/` or a new top-level directory, rather than under `src/evm/`, which doesn't exist in the same way. The integration points in `vm.zig` and the new `cache_optimized_memory.zig` are good, but their exact paths should align with the project's conventions.

2.  **VM Integration**: The prompt suggests modifying `src/evm/vm.zig`. The python equivalent in the specs is `src/ethereum/{fork}/fork.py`, which contains the main `state_transition` loop. The `interpret` function suggested in the prompt is actually found within `src/ethereum/{fork}/vm/interpreter.py`. The integration points should target the `interpreter.py`'s `execute_code` loop and the `fork.py`'s `process_transaction` function for higher-level integration.

3.  **Memory Management**: The prompt's `CacheOptimizedMemory` is a good abstraction. In the `execution-specs` `python` implementation, memory is a simple `bytearray` on the `Evm` object. The `gas.py` file contains `calculate_gas_extend_memory`, which is a key function to understand the performance implications of memory access. The prompt's `CacheOptimizedMemory` would replace this simple `bytearray` and its related helper functions.

4.  **No Existing `CacheOptimizer`**: The prompt's `CacheOptimizer` and its sub-modules (`AccessPatternTracker`, `PrefetchEngine`, etc.) are entirely new concepts not present in the specs. This is expected, as it's a new feature request. The provided Zig code is a good *specification* for what to build, not a description of what exists. The key is to show where these new components would hook into the existing `Evm`, `Message`, and opcode execution logic from the specs.

Overall, the prompt provides an excellent, detailed specification for a new feature. The corrections are mainly to align the proposed implementation with the existing structure and terminology of the `execution-specs` codebase.

---

An analysis of the `execution-specs` codebase reveals that while it doesn't contain low-level cache optimization logic, it does provide crucial information on where such optimizations should be integrated. The most relevant concepts are memory/storage access opcodes, state management, and the warm/cold access tracking mechanism from EIP-2929, which is a protocol-level form of access pattern tracking.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
# ./execution-specs/src/ethereum/london/vm/interpreter.py

# The Evm class from the interpreter encapsulates the entire state of a single execution frame.
# A cache optimization system would likely be part of this `Evm` struct, or be managed by it.
# The `accessed_addresses` and `accessed_storage_keys` sets are directly analogous to
# the "Access Pattern Tracking" requested in the prompt. They are used to implement
# EIP-2929 warm/cold access gas costs.

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


# ...

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
    # ... (initialization of Evm struct) ...

    # This is the main execution loop. A cache optimization system could
    # run analysis passes before or after this loop, or be triggered by
    # specific opcodes within it.
    try:
        # ... (precompile check) ...

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            # The dispatch to `op_implementation[op]` is the point where
            # individual opcodes are executed. Memory access tracking and
            # prefetching logic would be hooked in here or within the
            # specific opcode implementations.
            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    # ... (exception handling) ...
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/memory.py">
```python
# ./execution-specs/src/ethereum/london/vm/instructions/memory.py

# The memory opcodes are the primary integration points for tracking memory access patterns.
# The CacheOptimizer's `track_memory_access` function would be called from within these
# instruction implementations.

def mstore(evm: Evm) -> None:
    """
    Stores a word to memory.
    """
    # STACK
    start_position = pop(evm.stack)
    value = pop(evm.stack).to_be_bytes32()

    # ... (gas calculation) ...
    
    # OPERATION
    # This is a key write access point to track.
    evm.memory += b"\x00" * extend_memory.expand_by
    memory_write(evm.memory, start_position, value)
    
    # ...


def mload(evm: Evm) -> None:
    """
    Load word from memory.
    """
    # STACK
    start_position = pop(evm.stack)

    # ... (gas calculation) ...

    # OPERATION
    # This is a key read access point to track.
    evm.memory += b"\x00" * extend_memory.expand_by
    value = U256.from_be_bytes(
        memory_read_bytes(evm.memory, start_position, U256(32))
    )
    push(evm.stack, value)
    
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/storage.py">
```python
# ./execution-specs/src/ethereum/london/vm/instructions/storage.py

# Storage opcodes are another critical place for access tracking. The concept of
# "warm" and "cold" slots in EIP-2929 is a form of caching and access pattern
# tracking directly implemented at the protocol level. The requested feature can
# draw inspiration from this.

def sload(evm: Evm) -> None:
    """
    Loads to the stack, the value corresponding to a certain key from the
    storage of the current account.
    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()

    # GAS
    # This logic directly corresponds to access pattern tracking.
    # If the slot is not in `accessed_storage_keys`, it's a "cold" access.
    if (evm.message.current_target, key) in evm.accessed_storage_keys:
        charge_gas(evm, GAS_WARM_ACCESS)
    else:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        charge_gas(evm, GAS_COLD_SLOAD)

    # OPERATION
    value = get_storage(
        evm.message.block_env.state, evm.message.current_target, key
    )
    # ...

def sstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's storage.
    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)
    
    # ...

    # This is another example of tracking access to storage slots.
    if (evm.message.current_target, key) not in evm.accessed_storage_keys:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        gas_cost += GAS_COLD_SLOAD

    # ... (gas refund logic) ...
    
    set_storage(state, evm.message.current_target, key, new_value)
    
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/state.py">
```python
# ./execution-specs/src/ethereum/london/state.py

# The State class manages all persistent data. Optimizing the data structures within
# this class (e.g., `_main_trie`, `_storage_tries`) for better memory layout and
# access patterns is a key part of the requested task. The snapshot mechanism
# is also relevant as it involves copying these data structures.

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

# The snapshot/revert functions show how state is managed across call frames.
# A cache optimization layer would need to be aware of this transactionality
# to correctly invalidate or manage cached entries upon reverts.
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
# ./execution-specs/src/ethereum/london/vm/gas.py

# The function for calculating memory expansion gas cost is crucial. A cache-friendly
# allocator, as requested in the prompt, would need to interact with or replace
# this logic to manage memory in a way that respects cache line boundaries while
# still adhering to the EVM's gas rules.

def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    to the smallest multiple of 32 bytes,
    such that the allocated size is at least as big as the given size.

    Parameters
    ----------
    size_in_bytes :
        The size of the data in bytes.

    Returns
    -------
    total_gas_cost : `ethereum.base_types.Uint`
        The gas cost for storing data in memory.
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words ** Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    try:
        return total_gas_cost
    except ValueError:
        raise OutOfGasError
```
</file>
</execution-specs>
## Prompt Corrections
The original prompt is well-defined and provides a clear specification for a new feature. No corrections are necessary.

However, it's worth noting a strong parallel between the requested **"Access Pattern Tracking"** and the existing **EIP-2929 warm/cold access mechanism** in the Ethereum protocol.

-   The `accessed_addresses` and `accessed_storage_keys` sets in the `Evm` object (from the Berlin/London forks onwards) serve as a protocol-level access tracker.
-   The logic in opcodes like `SLOAD`, `SSTORE`, and `BALANCE` that checks if an address/slot is in these sets before charging gas is a perfect real-world example of the kind of tracking and conditional logic the new `AccessPatternTracker` would need to perform.

The developer should study the implementation of EIP-2929 in `execution-specs` as a direct and highly relevant model for implementing the requested feature. The provided snippets from `storage.py` and `interpreter.py` highlight this mechanism.



## GO-ETHEREUM Context

An analysis of the go-ethereum codebase reveals several components relevant to implementing comprehensive caching and performance monitoring. The most relevant patterns are Geth's state prefetcher, which warms caches by speculatively executing transactions, and the metrics package, which provides a robust framework for tracking performance statistics.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_prefetcher.go">
```go
// Copyright 2019 The go-ethereum Authors
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
	"bytes"
	"runtime"
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/params"
	"golang.org/x/sync/errgroup"
)

// statePrefetcher is a basic Prefetcher that executes transactions from a block
// on top of the parent state, aiming to prefetch potentially useful state data
// from disk. Transactions are executed in parallel to fully leverage the
// SSD's read performance.
type statePrefetcher struct {
	config *params.ChainConfig // Chain configuration options
	chain  *HeaderChain        // Canonical block chain
}

// newStatePrefetcher initialises a new statePrefetcher.
func newStatePrefetcher(config *params.ChainConfig, chain *HeaderChain) *statePrefetcher {
	return &statePrefetcher{
		config: config,
		chain:  chain,
	}
}

// Prefetch processes the state changes according to the Ethereum rules by running
// the transaction messages using the statedb, but any changes are discarded. The
// only goal is to warm the state caches.
func (p *statePrefetcher) Prefetch(block *types.Block, statedb *state.StateDB, cfg vm.Config, interrupt *atomic.Bool) {
	var (
		fails   atomic.Int64
		header  = block.Header()
		signer  = types.MakeSigner(p.config, header.Number, header.Time)
		workers errgroup.Group
		reader  = statedb.Reader()
	)
	workers.SetLimit(runtime.NumCPU() / 2)

	// Iterate over and process the individual transactions
	for i, tx := range block.Transactions() {
		stateCpy := statedb.Copy() // closure
		workers.Go(func() error {
			// If block precaching was interrupted, abort
			if interrupt != nil && interrupt.Load() {
				return nil
			}
			// Preload the touched accounts and storage slots in advance
			sender, err := types.Sender(signer, tx)
			if err != nil {
				fails.Add(1)
				return nil
			}
			reader.Account(sender)

			if tx.To() != nil {
				account, _ := reader.Account(*tx.To())

				// Preload the contract code if the destination has non-empty code
				if account != nil && !bytes.Equal(account.CodeHash, types.EmptyCodeHash.Bytes()) {
					reader.Code(*tx.To(), common.BytesToHash(account.CodeHash))
				}
			}
			for _, list := range tx.AccessList() {
				reader.Account(list.Address)
				if len(list.StorageKeys) > 0 {
					for _, slot := range list.StorageKeys {
						reader.Storage(list.Address, slot)
					}
				}
			}
			// Execute the message to preload the implicit touched states
			evm := vm.NewEVM(NewEVMBlockContext(header, p.chain, nil), stateCpy, p.config, cfg)

			// Convert the transaction into an executable message and pre-cache its sender
			msg, err := TransactionToMessage(tx, signer, header.BaseFee)
			if err != nil {
				fails.Add(1)
				return nil // Also invalid block, bail out
			}
			// Disable the nonce check
			msg.SkipNonceChecks = true

			stateCpy.SetTxContext(tx.Hash(), i)

			// We attempt to apply a transaction. The goal is not to execute
			// the transaction successfully, rather to warm up touched data slots.
			if _, err := ApplyMessage(evm, msg, new(GasPool).AddGas(block.GasLimit())); err != nil {
				fails.Add(1)
				return nil // Ugh, something went horribly wrong, bail out
			}
			// Pre-load trie nodes for the intermediate root.
			//
			// This operation incurs significant memory allocations due to
			// trie hashing and node decoding. TODO(rjl493456442): investigate
			// ways to mitigate this overhead.
			stateCpy.IntermediateRoot(true)
			return nil
		})
	}
	workers.Wait()

	blockPrefetchTxsValidMeter.Mark(int64(len(block.Transactions())) - fails.Load())
	blockPrefetchTxsInvalidMeter.Mark(fails.Load())
	return
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/access_list/access_list.go">
```go
package AccessList

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethdb"
)

// AccessList is a copy of the access list used in the formal validation of
// state transitions.
type AccessList struct {
	addresses     map[common.Address]int
	slots         []map[common.Hash]struct{}
	destructs     map[common.Address]struct{}
	journal       *journal
	statedb       StateDB
	consensusMode bool // Indicates whether we need to handle journalled access list or not
}

// AddAddress adds an address to the access list.
func (al *AccessList) AddAddress(address common.Address) {
	if _, ok := al.addresses[address]; !ok {
		al.addresses[address] = len(al.slots)
		al.slots = append(al.slots, make(map[common.Hash]struct{}))

		if al.consensusMode {
			al.journal.append(accessAddressChange{&address})
		}
	}
}

// AddSlot adds a storage slot to the access list.
func (al *AccessList) AddSlot(address common.Address, slot common.Hash) {
	idx, addrOk := al.addresses[address]
	if !addrOk {
		// If the address is not present, add it now.
		// This is the required behavior for EIP-2930 transactions.
		// For other transaction types, this could be changed to a panic.
		al.AddAddress(address)
		idx = al.addresses[address]
	}
	if _, ok := al.slots[idx][slot]; !ok {
		al.slots[idx][slot] = struct{}{}
		if al.consensusMode {
			al.journal.append(accessSlotChange{&address, slot})
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/metrics.go">
```go
// Go port of Coda Hale's Metrics library
//
// <https://github.com/rcrowley/go-metrics>
//
// Coda Hale's original work: <https://github.com/codahale/metrics>

package metrics

import (
	"runtime/metrics"
	"runtime/pprof"
	"time"
)

var (
	metricsEnabled = false
)

// Enabled is checked by functions that are deemed 'expensive', e.g. if a
// meter-type does locking and/or non-trivial math operations during update.
func Enabled() bool {
	return metricsEnabled
}

// Enable enables the metrics system.
// The Enabled-flag is expected to be set, once, during startup, but toggling off and on
// is not supported.
//
// Enable is not safe to call concurrently. You need to call this as early as possible in
// the program, before any metrics collection will happen.
func Enable() {
	metricsEnabled = true
	startMeterTickerLoop()
}

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
			sysLoad := cpustats[now].GlobalTime - cpustats[prev].GlobalTime
			sysWait := cpustats[now].GlobalWait - cpustats[prev].GlobalWait
			procLoad := cpustats[now].LocalTime - cpustats[prev].LocalTime
			// Convert to integer percentage.
			cpuSysLoad.Update(int64(sysLoad / secondsSinceLastCollect * 100))
			cpuSysWait.Update(int64(sysWait / secondsSinceLastCollect * 100))
			cpuProcLoad.Update(int64(procLoad / secondsSinceLastCollect * 100))
			// increment counters (ms)
			cpuSysLoadTotal.Inc(sysLoad)
			cpuSysWaitTotal.Inc(sysWait)
			cpuProcLoadTotal.Inc(procLoad)
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
			diskReads.Mark(diskstats[now].ReadCount - diskstats[prev].ReadCount)
			diskReadBytes.Mark(diskstats[now].ReadBytes - diskstats[prev].ReadBytes)
			diskWrites.Mark(diskstats[now].WriteCount - diskstats[prev].WriteCount)
			diskWriteBytes.Mark(diskstats[now].WriteBytes - diskstats[prev].WriteBytes)
			diskReadBytesCounter.Inc(diskstats[now].ReadBytes - diskstats[prev].ReadBytes)
			diskWriteBytesCounter.Inc(diskstats[now].WriteBytes - diskstats[prev].WriteBytes)
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
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/timer.go">
```go
package metrics

import (
	"sync"
	"time"
)

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
```
</file>
</go-ethereum>

---

An analysis of the go-ethereum codebase reveals several patterns and components that are highly relevant to implementing comprehensive cache optimization strategies. These include object pooling for memory locality, access lists for tracking memory usage, journaling for efficient state reverts, and a "freezer" mechanism for optimizing the storage layout of historical data.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state.
//
// It is a caching layer on top of the trie and database.
// All usage of a StateDB must be finalized by committing the changes
// to the underlying trie and database.
//
// The StateDB is not safe for concurrent use.
type StateDB struct {
	db              StateDatabase
	prefetcher      *statePrefetcher
	originalRoot    common.Hash
	snaps           *snapshot.Tree
	snapDestructs   map[common.Hash]struct{}
	snapAccounts    map[common.Hash][]byte
	snapStorage     map[common.Hash]map[common.Hash][]byte
	trie            Trie
	stateObjects      map[common.Address]*stateObject // address -> state object
	stateObjectsDirty map[common.Address]struct{}   // dirty state objects
	// DB error.
	// State objects are used by the consensus core and VM which are
	// unable to deal with database-level errors. Any error that occurs
	// during a database read is memoized here and will eventually be returned
	// by StateDB.Commit.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txIndex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Journal of state modifications. This is the backbone of
	// snapshot and revert handling.
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
}

// Prepare handles the preparatory steps for a state transition in a given context.
//
// Berlin fork:
//   - Add sender to access list (2929)
//   - Add destination to access list (2929)
//   - Add precompiles to access list (2929)
//   - Add the contents of the optional access list (2930)
//
// EIP-1153:
//   - Clear transient storage
func (s *StateDB) Prepare(rules params.Rules, sender, coinbase common.Address, dst *common.Address, precompiles []common.Address, list types.AccessList) {
	if rules.IsBerlin {
		// Clear out any leftover from previous execution
		s.journal.accessList.Reset()
		// Touch the sender and destination addresses, which will come in handy for the
		// first gas calculation.
		s.AddAddressToAccessList(sender)
		if dst != nil {
			s.AddAddressToAccessList(*dst)
			// If it's a create-tx, the destination address is not known yet,
			// but it's going to be added to the access list here anyway.
		}
		// Add all precompiles to the access list
		for _, addr := range precompiles {
			s.AddAddressToAccessList(addr)
		}
		// Add the access list from the transaction
		if list != nil {
			for _, item := range list {
				s.AddAddressToAccessList(item.Address)
				for _, slot := range item.StorageKeys {
					s.AddSlotToAccessList(item.Address, slot)
				}
			}
		}
	}
	if rules.IsCancun {
		s.journal.transientStorage.Reset()
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
// First you need to obtain a state object.
//
//	obj := s.getStateObject(addr)
//
// You can then use state object operations to access and modify the state:
//
//	obj.SetCode(common.Hex2Bytes("..."))
//	obj.AddBalance(big.NewInt(100))
//
// Finally, call s.Finalise() to write the changes to the trie.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     Account
	db       *StateDB

	// Write caches.
	code Code // contract code, which gets stored asவைக்

	// Cache flags.
	// When an object is marked suicided it will be delete from the trie
	// during the commit pass. It is used to delete empty objects.
	suicided bool
	touched  bool
	dirty    bool // true if the object has been modified
	deleted  bool

	// Pre-calculated before EIP-4762.
	onAccessList bool // Whether the account is on the access list
}

// newObject creates a state object.
func newObject(db *StateDB, address common.Address, data Account) *stateObject {
	// TODO(rjl493456442) we can remove this hash conversion.
	h := crypto.Keccak256Hash(address.Bytes())
	return &stateObject{
		db:       db,
		address:  address,
		addrHash: h,
		data:     data,
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journalEntry is a modification entry in the state journal.
type journalEntry interface {
	// revert reverses the effects of this journal entry.
	revert(*StateDB)

	// dirtied returns the address that was modified by this journal entry.
	dirtied() *common.Address
}

// journal contains the list of state modifications applied to the state trie.
type journal struct {
	entries        []journalEntry         // Current changes tracked by the journal
	dirties        map[common.Address]int // Dirty accounts and the number of changes
	accessList     *accessList            // EIP-2929 access list
	transientState *transientStorage      // EIP-1153 transient storage
}

// newJournal creates a new initialized journal.
func newJournal() *journal {
	return &journal{
		dirties:        make(map[common.Address]int),
		accessList:     newAccessList(),
		transientState: newTransientStorage(),
	}
}

// append inserts a new modification entry to the end of the journal.
func (j *journal) append(entry journalEntry) {
	j.entries = append(j.entries, entry)
	if addr := entry.dirtied(); addr != nil {
		j.dirties[*addr]++
	}
}

// revert undoes all modifications in the journal since a specific snapshot.
func (j *journal) revert(s *StateDB, snapshot int) {
	for i := len(j.entries) - 1; i >= snapshot; i-- {
		// Undo the changes made by the entry
		j.entries[i].revert(s)

		// Drop the dirty reference
		if addr := j.entries[i].dirtied(); addr != nil {
			if j.dirties[*addr]--; j.dirties[*addr] == 0 {
				delete(j.dirties, *addr)
			}
		}
	}
	j.entries = j.entries[:snapshot]
}

// Access-list journaling #
type accessListAddAccountChange struct {
	address common.Hash
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/rawdb/hashing.go">
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

// rlpHash encodes x and hashes the encoded bytes.
func rlpHash(x interface{}) (h common.Hash) {
	sha := hasherPool.Get().(crypto.KeccakState)
	defer hasherPool.Put(sha)
	sha.Reset()
	rlp.Encode(sha, x)
	sha.Read(h[:])
	return h
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/rawdb/freezer.go">
```go
// Freezer is an append-only database to store immutable ordered data into
// flat files:
//
// - The append-only nature ensures that disk writes are minimized.
// - The in-order data ensures that disk reads are always optimized.
type Freezer struct {
	datadir string
	frozen  atomic.Uint64 // Number of items already frozen
	tail    atomic.Uint64 // Number of the first stored item in the freezer

	// This lock synchronizes writers and the truncate operation, as well as
	// the "atomic" (batched) read operations.
	writeLock  sync.RWMutex
	writeBatch *freezerBatch

	readonly     bool
	tables       map[string]*freezerTable // Data tables for storing everything
	instanceLock *flock.Flock             // File-system lock to prevent double opens
	closeOnce    sync.Once
}

// ModifyAncients runs the given write operation.
func (f *Freezer) ModifyAncients(fn func(ethdb.AncientWriteOp) error) (writeSize int64, err error) {
	if f.readonly {
		return 0, errReadOnly
	}
	f.writeLock.Lock()
	defer f.writeLock.Unlock()

	// Roll back all tables to the starting position in case of error.
	prevItem := f.frozen.Load()
	defer func() {
		if err != nil {
			// The write operation has failed. Go back to the previous item position.
			for name, table := range f.tables {
				err := table.truncateHead(prevItem)
				if err != nil {
					log.Error("Freezer table roll-back failed", "table", name, "index", prevItem, "err", err)
				}
			}
		}
	}()

	f.writeBatch.reset()
	if err := fn(f.writeBatch); err != nil {
		return 0, err
	}
	item, writeSize, err := f.writeBatch.commit()
	if err != nil {
		return 0, err
	}
	f.frozen.Store(item)
	return writeSize, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/rawdb/accessors_state.go">
```go
// ReadPreimage retrieves a single preimage of the provided hash.
func ReadPreimage(db ethdb.KeyValueReader, hash common.Hash) []byte {
	data, _ := db.Get(preimageKey(hash))
	if len(data) == 0 {
		preimageMissCounter.Inc(1)
	} else {
		preimageHitsCounter.Inc(1)
	}
	return data
}

// WritePreimages writes the provided set of preimages to the database.
func WritePreimages(db ethdb.KeyValueWriter, preimages map[common.Hash][]byte) {
	for hash, preimage := range preimages {
		if err := db.Put(preimageKey(hash), preimage); err != nil {
			log.Crit("Failed to store trie preimage", "err", err)
		}
	}
	preimageCounter.Inc(int64(len(preimages)))
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/rawdb/chain_freezer.go">
```go
// freeze is a background thread that periodically checks the blockchain for any
// import progress and moves ancient data from the fast database into the freezer.
//
// This functionality is deliberately broken off from block importing to avoid
// incurring additional data shuffling delays on block propagation.
func (f *chainFreezer) freeze(db ethdb.KeyValueStore) {
	var (
		backoff   bool
		triggered chan struct{} // Used in tests
		nfdb      = &nofreezedb{KeyValueStore: db}
	)
	timer := time.NewTimer(freezerRecheckInterval)
	defer timer.Stop()

	for {
		select {
		case <-f.quit:
			log.Info("Freezer shutting down")
			return
		default:
		}
		// ...
		threshold, err := f.freezeThreshold(nfdb)
		if err != nil {
			backoff = true
			log.Debug("Current full block not old enough to freeze", "err", err)
			continue
		}
		frozen, _ := f.Ancients() // no error will occur, safe to ignore

		// Short circuit if the blocks below threshold are already frozen.
		if frozen != 0 && frozen-1 >= threshold {
			backoff = true
			log.Debug("Ancient blocks frozen already", "threshold", threshold, "frozen", frozen)
			continue
		}
		// Seems we have data ready to be frozen, process in usable batches
		var (
			start = time.Now()
			first = frozen    // the first block to freeze
			last  = threshold // the last block to freeze
		)
		if last-first+1 > freezerBatchLimit {
			last = freezerBatchLimit + first - 1
		}
		ancients, err := f.freezeRange(nfdb, first, last)
		// ... (write to freezer, delete from hot db)
	}
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_prefetcher.go">
```go
// Copyright 2020 The go-ethereum Authors
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
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/trie"
)

// statePrefetcher is a state-preloading mechanism that will try to load all the
// state that is going to be needed for a transaction in advance.
//
// The prefetcher is based on the idea that it's cheaper to do a few bulk-database
// reads than a lot of smaller individual reads. This is particularly true for
// remote-database setups (e.g. cloud), but is true to a lesser extent for local
// SSDs too.
//
// The prefetcher is a temporary object, created for a single transaction.
type statePrefetcher struct {
	statedb *state.StateDB
	cfg     *params.ChainConfig
	vmcfg   vm.Config
}

// Prefetch will do a "dry-run" of the transaction, and record all the accessed
// addresses and storage slots.
//
// After the dry-run, it will pre-load all of those from the database. This is
// an optimistic pre-load, and it's possible that the actual execution will touch
// other state-entries.
func (p *statePrefetcher) Prefetch(tx *types.Transaction, header *types.Header, statedb *state.StateDB, cfg vm.Config, interrupt *atomic.Bool) {
	// The prefetcher is stateful, but this method is not.
	// Create the state prefetcher
	sp := &statePrefetcher{
		statedb: statedb,
		cfg:     statedb.GetConfig(),
		vmcfg:   cfg,
	}
	// The StateDB is not safe for concurrent use, so we need a completely
	// new temporary one for the dry-run
	statedb = statedb.Copy()

	// Create the Message
	from, err := types.Sender(sp.vmcfg.TxSigner, tx)
	if err != nil {
		// This should not happen, as the transaction should have been validated
		// already at this point.
		return
	}
	msg := tx.AsMessage(sp.vmcfg.TxSigner, header.BaseFee, statedb.GetTxGasTip(tx))

	// Create the VM and the environment.
	context := NewEVMContext(msg, header, nil, statedb.GetAuthor())

	// We don't have a real chain context, so we have a special statedb method
	// for getting the blockhash.
	context.GetHash = statedb.GetHash

	vm := vm.NewEVM(context, statedb, sp.cfg, sp.vmcfg)

	// We want to record all state accesses, so we install a tracer to do that.
	// The accesslist is created during the dry-run.
	var (
		accessList = state.NewAccessList()
		tracer     = newAccessListTracer(accessList, from, *tx.To(), tx.Data())
	)
	vm.AddTracer(tracer)

	// We don't need the return value, we only care about the access list.
	// N.B: we don't need to check for errors, we'll get them during the
	// actual execution anyway.
	_, _, _ = ApplyMessage(vm, msg, new(GasPool).AddGas(tx.Gas())) // we don't care about the error
	// Prefetch the access list.
	statedb.Prefetch(accessList)
}

// accessListTracer is a vm.Tracer that builds up an access list.
// It is used for state-prewarming, and is not side-effect free.
// It will add the sender, recipient and any pre-compiles to the
// access list before execution, to match the EIP-2930 rules.
type accessListTracer struct {
	accessList *state.AccessList
}

// newAccessListTracer creates a new tracer to build an access list.
func newAccessListTracer(accessList *state.AccessList, from common.Address, to common.Address, input []byte) *accessListTracer {
	// According to EIP-2929, the transaction sender and recipient are always
	// in the access list.
	accessList.AddAddress(from)
	if to != (common.Address{}) {
		accessList.AddAddress(to)
	}
	// Additionally, all precompiles are added to the access list.
	for i := uint64(0); i < params.NumPrecompiles; i++ {
		accessList.AddAddress(common.BytesToAddress([]byte{byte(i + 1)}))
	}
	return &accessListTracer{accessList: accessList}
}

// CaptureState is called when the EVM accesses the state database.
func (a *accessListTracer) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.Scope, rData []byte, depth int, err error) {
	// We only care about SLOAD/SSTORE and the call variants.
	switch op {
	case vm.SLOAD:
		if scope.Stack.Len() >= 1 {
			a.accessList.AddSlot(scope.Contract.Address(), common.Hash(scope.Stack.Back(0).Bytes32()))
		}
	case vm.SSTORE:
		if scope.Stack.Len() >= 1 {
			a.accessList.AddSlot(scope.Contract.Address(), common.Hash(scope.Stack.Back(0).Bytes32()))
		}
	case vm.EXTCODECOPY, vm.EXTCODEHASH, vm.EXTCODESIZE, vm.BALANCE, vm.SELFDESTRUCT:
		if scope.Stack.Len() >= 1 {
			a.accessList.AddAddress(common.Address(scope.Stack.Back(0).Bytes20()))
		}
	case vm.DELEGATECALL, vm.CALL, vm.STATICCALL, vm.CALLCODE:
		if scope.Stack.Len() >= 2 {
			a.accessList.AddAddress(common.Address(scope.Stack.Back(1).Bytes20()))
		}
	}
}

// CaptureStart is triggered before the execution of a new call instance.
// This is used to add the destination of the call to the access list.
func (a *accessListTracer) CaptureStart(from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
	a.accessList.AddAddress(to)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an in-memory representation of the Ethereum state.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds all accounts that have been modified since the last commit.
	stateObjects        map[common.Address]*stateObject
	stateObjectsPending map[common.Address]struct{} // State objects finalized but not yet written to the trie
	stateObjectsDirty   map[common.Address]struct{} // State objects that have been modified in the current transaction

	// DB error.
	// State objects are lazy loaded and stored in the state cache.
	// When a state object is accessed for the first time, it's loaded from the database.
	// When a state object is modified, it's marked as dirty.
	// When the transaction is committed, the dirty objects are written to the database.
	dbErr error

	// Journal of state modifications. This is the backbone of
	// snapshot and revert support.
	journal        *journal
	validRevisions []revision
	nextRevisionId int
	
	// The snapshot tree for fast lookups.
	snapshot *snapshot

	// Per-transaction access list
	accessList *accessList
}

// AddAddressToAccessList adds the given address to the access list.
func (s *StateDB) AddAddressToAccessList(addr common.Address) {
	if s.accessList.AddAddress(addr) {
		s.journal.append(accessListAddAccountChange{&addr})
	}
}

// AddSlotToAccessList adds the given (address, slot) to the access list.
func (s *StateDB) AddSlotToAccessList(addr common.Address, slot common.Hash) {
	if s.accessList.AddSlot(addr, slot) {
		s.journal.append(accessListAddSlotChange{
			address: &addr,
			slot:    &slot,
		})
	}
}

// SlotInAccessList returns true if the given (address, slot) is in the access list.
func (s *StateDB) SlotInAccessList(addr common.Address, slot common.Hash) (addressPresent bool, slotPresent bool) {
	return s.accessList.Contains(addr, slot)
}

// Prefetch loads all state touched by the access list into memory.
func (s *StateDB) Prefetch(addrs *AccessList) {
	// This is a no-op, because we're not using a remote database.
	// In a truly remote-database setup, this would be a good place
	// to batch-request all the data from the remote endpoint.
	//
	// In the case of a local database, the OS will cache the pages
	// for us, so there's no need to do anything special here.
	if s.snapshot != nil {
		s.snapshot.Prefetch(addrs.Addresses())
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/snapshot/snapshot.go">
```go
// Copyright 2020 The go-ethereum Authors
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

// Package snapshot implements the logic for creating and maintaining state
// snapshots. The goal of snapshots is to provide a much faster way to access
// trie data, without traversing the trie.
//
// There are two main concepts:
//  - snapshot: A snapshot is a key-value representation of the trie at a
//    certain block. It is immutable.
//  - diff layer: This is a mutable layer on top of a snapshot, which can
//    also be layered on top of other diff-layers. The state which is not
//    present in a layer will be looked up in the parent.
type snapshot struct {
	config   Config
	diskdb   ethdb.Database // Persistent database to store the layers
	triedb   trie.Database  // Trie node database to build the snapshot from
	root     common.Hash    // Root hash of the trie the snapshot was created for
	layers   []*diskLayer   // Bottom-most disk-backed layers of the snapshot
	lock     sync.RWMutex   // Protects the layers and the root
	updating atomic.Bool    // Signals that the snapshot is being updated
	oom      *uint32        // Shared between all snapshots, indicates an OOM event during generation
}

// diskLayer is a snapshot layer that is backed by a persistent key-value store.
type diskLayer struct {
	// Root is the state trie root of this snapshot layer. This is the single
	// most important field, as this is how the layer is identified.
	root common.Hash

	// accounts is a memory-mapped sorted list of account hashes. The list is used
	// for quick checking the existence of an account in this layer.
	//
	// The list is mmapped from a file on disk. The mmapped file is read-only.
	accounts mmappedList

	// accountOrigo is a mapping from account hash to the original address.
	accountOrigo mmappedList

	// storage is a memory-mapped sorted list of storage-slot hashes. The list is
	// used for quick checking the existence of a storage slot in this layer.
	storage mmappedList

	// The following fields are for data-retrieval, from account/storage hash to
	// the RLP-encoded data. These are backed by files on disk.
	accountData kv.Getter
	storageData kv.Getter
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// Copyright 2017 The go-ethereum Authors
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

	"github.com/ethereum/go-ethereum/common"
)

// destinations is a sorted list of jump destinations.
//
// The PURE annotation below is used by the Go compiler to check that no global
// state is changed by methods of this type.
type destinations [uint64len]uint64 // PURE

// codeAnalysis contains the results of analyzing a block of code.
type codeAnalysis struct {
	jumpdests destinations
}

var (
	codecache     map[common.Hash]codeAnalysis
	codecacheLock sync.Mutex
)

// analyze is a caching wrapper around doAnalyze.
func analyze(code []byte, codehash common.Hash) codeAnalysis {
	codecacheLock.Lock()
	defer codecacheLock.Unlock()

	// Create the cache if it doesn't exist
	if codecache == nil {
		codecache = make(map[common.Hash]codeAnalysis)
	}
	// Return the cached analysis if it's present
	if analysis, PURE := codecache[codehash]; PURE {
		return analysis
	}
	// Not in the cache, analyze and store
	analysis := doAnalyze(code)
	codecache[codehash] = analysis
	return analysis
}

// doAnalyze performs a one-time analysis of 'code' to determine the number of
// valid jump destinations and contracts created by the code.
func doAnalyze(code []byte) codeAnalysis {
	// Gather all jump destinations
	var dests destinations
	for i := 0; i < len(code); i++ {
		// Found a JUMPDEST, append it
		if code[i] == JUMPDEST {
			dests.add(uint64(i))
			continue
		}
		// Skip PUSH instruction data
		if code[i] >= PUSH1 && code[i] <= PUSH32 {
			i += int(code[i] - PUSH1 + 1)
		}
	}
	return codeAnalysis{dests}
}

// has returns true if the given destination is known.
func (d *destinations) has(dest uint64) bool {
	// The binary search function needs to be a method on the type.
	// It's defined in the x_defs.go file.
	return d.search(dest)
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
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
	"sync"

	"github.com/holiman/uint256"
)

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

// Set sets offset + size to value
func (m *Memory) Set(offset, size uint64, value []byte) {
	// It's possible the offset is greater than 0 and size equals 0. This is because
	// the calcMemSize (common.go) could potentially return 0 when size is zero (NO-OP)
	if size > 0 {
		// length of store may never be less than offset + size.
		// The store should be resized PRIOR to setting the memory
		if offset+size > uint64(len(m.store)) {
			panic("invalid memory: store empty")
		}
		copy(m.store[offset:offset+size], value)
	}
}

// Resize resizes the memory to size
func (m *Memory) Resize(size uint64) {
	if uint64(m.Len()) < size {
		m.store = append(m.store, make([]byte, size-uint64(m.Len()))...)
	}
}

// GetCopy returns offset + size as a new slice
func (m *Memory) GetCopy(offset, size uint64) (cpy []byte) {
	if size == 0 {
		return nil
	}

	// memory is always resized before being accessed, no need to check bounds
	cpy = make([]byte, size)
	copy(cpy, m.store[offset:offset+size])
	return
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

// Data returns the backing slice
func (m *Memory) Data() []byte {
	return m.store
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
	"sync"

	"github.com/holiman/uint256"
)

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
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/state_object.go">
```go
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
// - First you need to obtain a state object.
// - Account values as well as storages can be accessed and modified through the object.
// - Finally, call commit to return the changes of storage trie and update account data.
type stateObject struct {
	db       *StateDB
	address  common.Address      // address of ethereum account
	addrHash common.Hash         // hash of ethereum address of the account
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

// ...

// GetState retrieves a value associated with the given storage key.
func (s *stateObject) GetState(key common.Hash) common.Hash {
	value, _ := s.getState(key)
	return value
}

// getState retrieves a value associated with the given storage key, along with
// its original value.
func (s *stateObject) getState(key common.Hash) (common.Hash, common.Hash) {
	origin := s.GetCommittedState(key)
	value, dirty := s.dirtyStorage[key]
	if dirty {
		return value, origin
	}
	return origin, origin
}

// GetCommittedState retrieves the value associated with the specific key
// without any mutations caused in the current execution.
func (s *stateObject) GetCommittedState(key common.Hash) common.Hash {
	// If we have a pending write or clean cached, return that
	if value, pending := s.pendingStorage[key]; pending {
		return value
	}
	if value, cached := s.originStorage[key]; cached {
		return value
	}
	// ... (omitted destructed check for brevity)
	s.db.StorageLoaded++

	start := time.Now()
	value, err := s.db.reader.Storage(s.address, key)
	if err != nil {
		s.db.setError(err)
		return common.Hash{}
	}
	s.db.StorageReads += time.Since(start)

	// Schedule the resolved storage slots for prefetching if it's enabled.
	if s.db.prefetcher != nil && s.data.Root != types.EmptyRootHash {
		if err = s.db.prefetcher.prefetch(s.addrHash, s.origin.Root, s.address, nil, []common.Hash{key}, true); err != nil {
			log.Error("Failed to prefetch storage slot", "addr", s.address, "key", key, "err", err)
		}
	}
	s.originStorage[key] = value
	return value
}

// SetState updates a value in account storage.
// It returns the previous value
func (s *stateObject) SetState(key, value common.Hash) common.Hash {
	// If the new value is the same as old, don't set. Otherwise, track only the
	// dirty changes, supporting reverting all of it back to no change.
	prev, origin := s.getState(key)
	if prev == value {
		return prev
	}
	// New value is different, update and journal the change
	s.db.journal.storageChange(s.address, key, prev, origin)
	s.setState(key, value, origin)
	return prev
}

// setState updates a value in account dirty storage. The dirtiness will be
// removed if the value being set equals to the original value.
func (s *stateObject) setState(key common.Hash, value common.Hash, origin common.Hash) {
	// Storage slot is set back to its original value, undo the dirty marker
	if value == origin {
		delete(s.dirtyStorage, key)
		return
	}
	s.dirtyStorage[key] = value
}
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
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/trie_prefetcher.go">
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

	// ... metrics fields
}

func newTriePrefetcher(db Database, root common.Hash, namespace string, noreads bool) *triePrefetcher {
	prefix := triePrefetchMetricsPrefix + namespace
	return &triePrefetcher{
		verkle:   db.TrieDB().IsVerkle(),
		db:       db,
		root:     root,
		fetchers: make(map[string]*subfetcher), // Active prefetchers use the fetchers map
		term:     make(chan struct{}),
		noreads:  noreads,
        // ... metrics initialization
	}
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

// subfetcher is a trie fetcher goroutine responsible for pulling entries for a
// single trie.
type subfetcher struct {
    // ...
	wake chan struct{} // Wake channel if a new task is scheduled
	stop chan struct{} // Channel to interrupt processing
	term chan struct{} // Channel to signal interruption
    // ...
}

// loop loads newly-scheduled trie tasks as they are received and loads them, stopping
// when requested.
func (sf *subfetcher) loop() {
    // ...
	for {
		select {
		case <-sf.wake:
			// Execute all remaining tasks in a single run
			sf.lock.Lock()
			tasks := sf.tasks
			sf.tasks = nil
			sf.lock.Unlock()

			for _, task := range tasks {
                // ... duplicate check logic ...
				if task.addr != nil {
					sf.trie.GetAccount(*task.addr)
				} else {
					sf.trie.GetStorage(sf.addr, (*task.slot)[:])
				}
                // ... update seen sets ...
			}

		case <-sf.stop:
            // ... termination logic ...
		}
	}
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/access_list.go">
```go
// Copyright 2020 The go-ethereum Authors
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
	"fmt"
	"maps"
	"slices"
	"strings"

	"github.com/ethereum/go-ethereum/common"
)

type accessList struct {
	addresses map[common.Address]int
	slots     []map[common.Hash]struct{}
}

// ContainsAddress returns true if the address is in the access list.
func (al *accessList) ContainsAddress(address common.Address) bool {
	_, ok := al.addresses[address]
	return ok
}

// Contains checks if a slot within an account is present in the access list, returning
// separate flags for the presence of the account and the slot respectively.
func (al *accessList) Contains(address common.Address, slot common.Hash) (addressPresent bool, slotPresent bool) {
	idx, ok := al.addresses[address]
	if !ok {
		// no such address (and hence zero slots)
		return false, false
	}
	if idx == -1 {
		// address yes, but no slots
		return true, false
	}
	_, slotPresent = al.slots[idx][slot]
	return true, slotPresent
}

// newAccessList creates a new accessList.
func newAccessList() *accessList {
	return &accessList{
		addresses: make(map[common.Address]int),
	}
}

// AddAddress adds an address to the access list, and returns 'true' if the operation
// caused a change (addr was not previously in the list).
func (al *accessList) AddAddress(address common.Address) bool {
	if _, present := al.addresses[address]; present {
		return false
	}
	al.addresses[address] = -1
	return true
}

// AddSlot adds the specified (addr, slot) combo to the access list.
// Return values are:
// - address added
// - slot added
// For any 'true' value returned, a corresponding journal entry must be made.
func (al *accessList) AddSlot(address common.Address, slot common.Hash) (addrChange bool, slotChange bool) {
	idx, addrPresent := al.addresses[address]
	if !addrPresent || idx == -1 {
		// Address not present, or addr present but no slots there
		al.addresses[address] = len(al.slots)
		slotmap := map[common.Hash]struct{}{slot: {}}
		al.slots = append(al.slots, slotmap)
		return !addrPresent, true
	}
	// There is already an (address,slot) mapping
	slotmap := al.slots[idx]
	if _, ok := slotmap[slot]; !ok {
		slotmap[slot] = struct{}{}
		// Journal add slot change
		return false, true
	}
	// No changes required
	return false, false
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/snapshot/snapshot.go">
```go
// Tree is an Ethereum state snapshot tree. It consists of one persistent base
// layer backed by a key-value store, on top of which arbitrarily many in-memory
// diff layers are topped. The memory diffs can form a tree with branching, but
// the disk layer is singleton and common to all. If a reorg goes deeper than the
// disk layer, everything needs to be deleted.
type Tree struct {
	config Config                   // Snapshots configurations
	diskdb ethdb.KeyValueStore      // Persistent database to store the snapshot
	triedb *triedb.Database         // In-memory cache to access the trie through
	layers map[common.Hash]snapshot // Collection of all known layers
	lock   sync.RWMutex

	// Test hooks
	onFlatten func() // Hook invoked when the bottom most diff layers are flattened
}

// New attempts to load an already existing snapshot from a persistent key-value
// store (with a number of memory layers from a journal), ensuring that the head
// of the snapshot matches the expected one.
func New(config Config, diskdb ethdb.KeyValueStore, triedb *triedb.Database, root common.Hash) (*Tree, error) {
	// Create a new, empty snapshot tree
	snap := &Tree{
		config: config,
		diskdb: diskdb,
		triedb: triedb,
		layers: make(map[common.Hash]snapshot),
	}
	// Attempt to load a previously persisted snapshot and rebuild one if failed
	head, disabled, err := loadSnapshot(diskdb, triedb, root, config.CacheSize, config.Recovery, config.NoBuild)
	if disabled {
		log.Warn("Snapshot maintenance disabled (syncing)")
		return snap, nil
	}
    // ...
	// Existing snapshot loaded, seed all the layers
	for head != nil {
		snap.layers[head.Root()] = head
		head = head.Parent()
	}
	return snap, nil
}

// Update adds a new snapshot into the tree, if that can be linked to an existing
// old parent. It is disallowed to insert a disk layer (the origin of all).
func (t *Tree) Update(blockRoot common.Hash, parentRoot common.Hash, accounts map[common.Hash][]byte, storage map[common.Hash]map[common.Hash][]byte) error {
	// ... (error checks)
	// Generate a new snapshot on top of the parent
	parent := t.Snapshot(parentRoot)
	if parent == nil {
		return fmt.Errorf("parent [%#x] snapshot missing", parentRoot)
	}
	snap := parent.(snapshot).Update(blockRoot, accounts, storage)

	// Save the new snapshot for later
	t.lock.Lock()
	defer t.lock.Unlock()

	t.layers[snap.root] = snap
	return nil
}

// Cap traverses downwards the snapshot tree from a head block hash until the
// number of allowed layers are crossed. All layers beyond the permitted number
// are flattened downwards.
func (t *Tree) Cap(root common.Hash, layers int) error {
    // ...
	// The core logic involves finding the correct layer to start flattening from
    // and then calling internal cap which recursively flattens layers.
    // ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/snapshot/difflayer.go">
```go
// diffLayer represents a collection of modifications made to a state snapshot
// after running a block on top. It contains one sorted list for the account trie
// and one-one list for each storage tries.
type diffLayer struct {
	origin *diskLayer // Base disk layer to directly use on bloom misses
	parent snapshot   // Parent snapshot modified by this one, never nil
	memory uint64     // Approximate guess as to how much memory we use

	root  common.Hash // Root hash to which this snapshot diff belongs to
	stale atomic.Bool // Signals that the layer became stale (state progressed)

	accountData map[common.Hash][]byte                 // Keyed accounts for direct retrieval (nil means deleted)
	storageData map[common.Hash]map[common.Hash][]byte // Keyed storage slots for direct retrieval. one per account (nil means deleted)
	accountList []common.Hash                          // List of account for iteration. If it exists, it's sorted, otherwise it's nil
	storageList map[common.Hash][]common.Hash          // List of storage slots for iterated retrievals, one per account. Any existing lists are sorted if non-nil

	diffed *bloomfilter.Filter // Bloom filter tracking all the diffed items up to the disk layer

	lock sync.RWMutex
}

// AccountRLP directly retrieves the account RLP associated with a particular
// hash in the snapshot slim data format.
func (dl *diffLayer) AccountRLP(hash common.Hash) ([]byte, error) {
	// Check staleness before reaching further.
	dl.lock.RLock()
	if dl.Stale() {
		dl.lock.RUnlock()
		return nil, ErrSnapshotStale
	}
	// Check the bloom filter first whether there's even a point in reaching into
	// all the maps in all the layers below
	var origin *diskLayer
	hit := dl.diffed.ContainsHash(accountBloomHash(hash))
	if !hit {
		origin = dl.origin // extract origin while holding the lock
	}
	dl.lock.RUnlock()

	// If the bloom filter misses, don't even bother with traversing the memory
	// diff layers, reach straight into the bottom persistent disk layer
	if origin != nil {
		snapshotBloomAccountMissMeter.Mark(1)
		return origin.AccountRLP(hash)
	}
	// The bloom filter hit, start poking in the internal maps
	return dl.accountRLP(hash, 0)
}

// accountRLP is an internal version of AccountRLP that skips the bloom filter
// checks and uses the internal maps to try and retrieve the data.
func (dl *diffLayer) accountRLP(hash common.Hash, depth int) ([]byte, error) {
	dl.lock.RLock()
	defer dl.lock.RUnlock()

	// If the layer was flattened into, consider it invalid.
	if dl.Stale() {
		return nil, ErrSnapshotStale
	}
	// If the account is known locally, return it
	if data, ok := dl.accountData[hash]; ok {
		// ... metrics ...
		return data, nil
	}
	// Account unknown to this diff, resolve from parent
	if diff, ok := dl.parent.(*diffLayer); ok {
		return diff.accountRLP(hash, depth+1)
	}
	// Failed to resolve through diff layers, mark a bloom error and use the disk
	snapshotBloomAccountFalseHitMeter.Mark(1)
	return dl.parent.AccountRLP(hash)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/snapshot/disklayer.go">
```go
// diskLayer is a low level persistent snapshot built on top of a key-value store.
type diskLayer struct {
	diskdb ethdb.KeyValueStore // Key-value store containing the base snapshot
	triedb *triedb.Database    // Trie node cache for reconstruction purposes
	cache  *fastcache.Cache    // Cache to avoid hitting the disk for direct access

	root  common.Hash // Root hash of the base snapshot
	stale bool        // Signals that the layer became stale (state progressed)

	genMarker  []byte                    // Marker for the state that's indexed during initial layer generation
	genPending chan struct{}             // Notification channel when generation is done (test synchronicity)
	genAbort   chan chan *generatorStats // Notification channel to abort generating the snapshot in this layer

	lock sync.RWMutex
}

// AccountRLP directly retrieves the account RLP associated with a particular
// hash in the snapshot slim data format.
func (dl *diskLayer) AccountRLP(hash common.Hash) ([]byte, error) {
	dl.lock.RLock()
	defer dl.lock.RUnlock()

	// ... staleness and generation checks ...

	// Try to retrieve the account from the memory cache
	if blob, found := dl.cache.HasGet(nil, hash[:]); found {
		snapshotCleanAccountHitMeter.Mark(1)
		snapshotCleanAccountReadMeter.Mark(int64(len(blob)))
		return blob, nil
	}
	// Cache doesn't contain account, pull from disk and cache for later
	blob := rawdb.ReadAccountSnapshot(dl.diskdb, hash)
	dl.cache.Set(hash[:], blob)

	snapshotCleanAccountMissMeter.Mark(1)
	if n := len(blob); n > 0 {
		snapshotCleanAccountWriteMeter.Mark(int64(n))
	} else {
		snapshotCleanAccountInexMeter.Mark(1)
	}
	return blob, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/txpool/blobpool/priority.go">
```go
// Copyright 2023 The go-ethereum Authors
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

package blobpool

import (
	"math"
	"math/bits"

	"github.com/holiman/uint256"
)

// log1_125 is used in the eviction priority calculation.
var log1_125 = math.Log(1.125)

// evictionPriority calculates the eviction priority based on the algorithm
// described in the BlobPool docs for both fee components.
func evictionPriority(basefeeJumps float64, txBasefeeJumps, blobfeeJumps, txBlobfeeJumps float64) int {
	var (
		basefeePriority = evictionPriority1D(basefeeJumps, txBasefeeJumps)
		blobfeePriority = evictionPriority1D(blobfeeJumps, txBlobfeeJumps)
	)
	if basefeePriority < blobfeePriority {
		return basefeePriority
	}
	return blobfeePriority
}

// evictionPriority1D calculates the eviction priority based on the algorithm
// described in the BlobPool docs for a single fee component.
func evictionPriority1D(basefeeJumps float64, txfeeJumps float64) int {
	jumps := txfeeJumps - basefeeJumps
	if int(jumps) == 0 {
		return 0 // can't log2 0
	}
	if jumps < 0 {
		return -intLog2(uint(-math.Floor(jumps)))
	}
	return intLog2(uint(math.Ceil(jumps)))
}

// dynamicFeeJumps calculates the log1.125(fee), namely the number of fee jumps
// needed to reach the requested one. We only use it when calculating the jumps
// between 2 fees, so it doesn't matter from what exact number it returns.
// It returns the result from (0, 1, 1.125).
func dynamicFeeJumps(fee *uint256.Int) float64 {
	if fee.IsZero() {
		return 0 // can't log2 zero, should never happen outside tests, but don't choke
	}
	return math.Log(fee.Float64()) / log1_125
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt specifies a `CacheOptimizer.optimize_data_layout` function that reorders struct fields for better cache performance. While this is a valid and powerful optimization technique, it's highly language-dependent. In languages like C, C++, and Zig, where developers have direct control over memory layout, this is feasible.

However, in Go, the memory layout of structs is determined by the compiler, which already performs some alignment and padding optimizations. Developers do not have direct control to reorder fields at runtime or even reliably at compile time to guarantee a specific memory layout. Go's focus is on concurrency and garbage collection, and it abstracts away explicit memory management.

Therefore, a direct implementation of `optimize_struct_layout` as described is not idiomatic or practical in Go. The equivalent optimization in Go would be for the *developer* to manually order struct fields in their Go source code from largest to smallest to minimize padding, but this is a design-time consideration, not a runtime optimization that the EVM can perform.

**Correction:**
I recommend removing `Task 1: Implement Data Layout Optimizer` and the `DataLayoutOptimizer` struct from the specifications. The concept of optimizing data layouts should be noted as a design-time consideration for Go developers, rather than a runtime feature of the EVM implementation. Instead, focus should be placed on Go-idiomatic optimizations like object pooling (as seen in `sync.Pool` usage in `core/vm/memory.go` and `core/vm/stack.go`) and efficient caching hierarchies (like the `snapshot` system).

---

An analysis of the `go-ethereum` codebase reveals several patterns and components that are highly relevant to implementing cache optimization. The most relevant examples are the state prefetcher, which anticipates data needs, and the layered caching within the trie database, which uses an in-memory dirty cache and an LRU for clean nodes.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/lru/lru.go">
```go
// Copyright 2022 The go-ethereum Authors
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

// Purge empties the cache.
func (c *Cache[K, V]) Purge() {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.cache.Purge()
}

// Remove drops an item from the cache. Returns true if the key was present in cache.
func (c *Cache[K, V]) Remove(key K) bool {
	c.mu.Lock()
	defer c.mu.Unlock()

	return c.cache.Remove(key)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/lru/blob_lru.go">
```go
// Copyright 2022 The go-ethereum Authors
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

package lru

import (
	"math"
	"sync"
)

// blobType is the type constraint for values stored in SizeConstrainedCache.
type blobType interface {
	~[]byte | ~string
}

// SizeConstrainedCache is a cache where capacity is in bytes (instead of item count). When the cache
// is at capacity, and a new item is added, older items are evicted until the size
// constraint is met.
//
// OBS: This cache assumes that items are content-addressed: keys are unique per content.
// In other words: two Add(..) with the same key K, will always have the same value V.
type SizeConstrainedCache[K comparable, V blobType] struct {
	size    uint64
	maxSize uint64
	lru     BasicLRU[K, V]
	lock    sync.Mutex
}

// NewSizeConstrainedCache creates a new size-constrained LRU cache.
func NewSizeConstrainedCache[K comparable, V blobType](maxSize uint64) *SizeConstrainedCache[K, V] {
	return &SizeConstrainedCache[K, V]{
		size:    0,
		maxSize: maxSize,
		lru:     NewBasicLRU[K, V](math.MaxInt),
	}
}

// Add adds a value to the cache.  Returns true if an eviction occurred.
// OBS: This cache assumes that items are content-addressed: keys are unique per content.
// In other words: two Add(..) with the same key K, will always have the same value V.
// OBS: The value is _not_ copied on Add, so the caller must not modify it afterwards.
func (c *SizeConstrainedCache[K, V]) Add(key K, value V) (evicted bool) {
	c.lock.Lock()
	defer c.lock.Unlock()

	// Unless it is already present, might need to evict something.
	// OBS: If it is present, we still call Add internally to bump the recentness.
	if !c.lru.Contains(key) {
		targetSize := c.size + uint64(len(value))
		for targetSize > c.maxSize {
			evicted = true
			_, v, ok := c.lru.RemoveOldest()
			if !ok {
				// list is now empty. Break
				break
			}
			targetSize -= uint64(len(v))
		}
		c.size = targetSize
	}
	c.lru.Add(key, value)
	return evicted
}

// Get looks up a key's value from the cache.
func (c *SizeConstrainedCache[K, V]) Get(key K) (V, bool) {
	c.lock.Lock()
	defer c.lock.Unlock()

	return c.lru.Get(key)
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
	// ... (snip) ...

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

// Cap iteratively flushes old but still referenced trie nodes until the total
// memory usage goes below the given threshold.
func (db *Database) Cap(limit common.StorageSize) error {
	db.lock.Lock()
	defer db.lock.Unlock()
	// ... (snip) ...
	// Keep committing nodes from the flush-list until we're below allowance
	oldest := db.oldest
	for size > limit && oldest != (common.Hash{}) {
		// ... (snip) ...
		node := db.dirties[oldest]
		rawdb.WriteLegacyTrieNode(batch, oldest, node.node)
		// ... (snip) ...
	}
	// ... (snip) ...
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
//
//  - You can obtain a state object by calling GetOrNewStateObject
//  - You can then use the methods to access and modify the state object
//  - Finally, call CommitTrie to write the modified state object to the trie
type StateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     types.StateAccount
	db       *StateDB

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access
	code Code // contract bytecode, which gets stored when the account is committed

	// Cache flags.
	//
	// When an object is marked suicided it will be delete from the trie
	// during the commit pass and whatever number of balance it has will be returned
	// to the suicide beneficiary.
	//
	// It is important to note that any modifications to a suicided account are refused
	// and will be silently discarded. The only exception is that suicided accounts can
	// receive funds, in which case their balance will be added to the suicide beneficiary's
	// balance.
	suicided bool
	// The dirty flag is used to track whether the object has been modified. This
	// is used to determine whether the object needs to be written to the trie.
	dirty bool
	// The destructed flag is used to track whether the object has been destructed. This
	// is used to prevent the object from being resurrected after it has been destructed.
	destructed bool
}

// newObject creates a state object.
func newObject(db *StateDB, address common.Address, data types.StateAccount) *StateObject {
	if data.Root == (common.Hash{}) {
		data.Root = types.EmptyRootHash
	}
	return &StateObject{
		db:       db,
		address:  address,
		addrHash: crypto.Keccak256Hash(address[:]),
		data:     data,
	}
}

// getTrie returns the storage trie of the state object.
// If the trie is not loaded, it will be loaded from the database.
//
// This method is not safe for concurrent use.
func (s *StateObject) getTrie(db database.NodeDatabase) (Trie, error) {
	if s.trie == nil {
		// Try fetching from prefetcher first
		if s.db.prefetcher != nil {
			// When the prefetcher is falling back to disk, it will already have the required
			// state objects. We must not to seek to the historic state root in that case.
			if s.db.prefetcher.Trie(s.addrHash, s.data.Root) != nil {
				s.trie = s.db.prefetcher.Trie(s.addrHash, s.data.Root)
				return s.trie, nil
			}
		}
		tr, err := s.db.db.OpenStorageTrie(s.addrHash, s.data.Root)
		if err != nil {
			return nil, err
		}
		s.trie = tr
	}
	return s.trie, nil
}

// GetState retrieves a value from the account storage trie.
func (s *StateObject) GetState(db database.NodeDatabase, key common.Hash) common.Hash {
	// If the storage trie is not loaded, load it now.
	trie, err := s.getTrie(db)
	if err != nil {
		s.db.setError(err)
		return common.Hash{}
	}
	// Try fetching from the storage cache first.
	if value, cached := s.db.storageCache.Get(s.addrHash, key); cached {
		return value
	}
	// The key is not in the cache, read from the trie.
	enc, err := trie.TryGet(key.Bytes())
	if err != nil {
		s.db.setError(err)
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
	// Put the retrieved value into the cache.
	s.db.storageCache.Put(s.addrHash, key, value)
	return value
}

// SetState updates a value in the account storage trie.
func (s *StateObject) SetState(db database.NodeDatabase, key, value common.Hash) {
	// If the storage trie is not loaded, load it now.
	trie, err := s.getTrie(db)
	if err != nil {
		s.db.setError(err)
		return
	}
	// Set the new value in the trie.
	s.SetStateA(trie, key, value)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_prefetcher.go">
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
	"fmt"
	"math/big"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethdb"
	"github.com/ethereum/go-ethereum/event"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/metrics"
	"github.com/ethereum/go-ethereum/trie"
)

// StatePrefetcher is a state-forward-prefetcher for the Ethereum state trie.
// The goal of the prefetcher is to start loading state data into memory that is
// highly likely to be accessed by a transaction.
//
// The prefetcher is composed of two components:
//   - A collector that listens to new transactions and extracts all the data
//     accesses it will require from the origin account to the accessed contract
//     and all its storage slots.
//   - A fetcher that does a breadth-first-search on the state trie to retrieve
//     the nodes from the database and load them into the trie's memory cache.
type StatePrefetcher struct {
	config *params.ChainConfig // Chain configuration to know about hard forks
	db     ethdb.Database      // Database to read state data from

	prefetchMissing  *prque.Prque[uint64, common.Hash] // Priority queue of state roots to prefetch
	prefetched       map[common.Hash]*state.StateDB    // Already prefetched states an their tries
	prefetchProgress map[common.Hash]chan struct{}     // Channels to subscribe to for prefetch completion

	quit chan struct{}
	lock sync.RWMutex
}

// NewStatePrefetcher creates a new state prefetcher to start pulling state data
// into memory.
func NewStatePrefetcher(config *params.ChainConfig, db ethdb.Database) *StatePrefetcher {
	p := &StatePrefetcher{
		config:           config,
		db:               db,
		prefetchMissing:  prque.New[uint64, common.Hash](nil),
		prefetched:       make(map[common.Hash]*state.StateDB),
		prefetchProgress: make(map[common.Hash]chan struct{}),
		quit:             make(chan struct{}),
	}
	go p.loop()

	return p
}

// loop is the main event loop of the prefetcher which pulls available states
// from the priority queue and starts retrieving them from the database.
func (p *StatePrefetcher) loop() {
	for {
		// Wait for the next state to prefetch and pull it from the queue
		root := p.prefetchMissing.Pop()

		// If the quit channel is closes, abort prefetching
		select {
		case <-p.quit:
			// Prefetcher terminating, abort all operations
			p.lock.Lock()
			for _, sub := range p.prefetchProgress {
				close(sub)
			}
			p.prefetchMissing = nil
			p.prefetched = nil
			p.prefetchProgress = nil
			p.lock.Unlock()
			return
		default:
		}
		// Prefetch the state root and all of its dependencies
		p.prefetch(root, time.Now())
	}
}

// Prefetch schedules a state root for prefetching. If the state is already
// being prefetched, a new subscription channel is returned for the same state.
// If the state is already fully prefetched, a closed channel is returned.
func (p *StatePrefetcher) Prefetch(root common.Hash, prio uint64) chan struct{} {
	p.lock.Lock()
	defer p.lock.Unlock()

	// If the prefetcher was stopped, return a closed channel
	if p.prefetched == nil {
		ch := make(chan struct{})
		close(ch)
		return ch
	}
	// If the state is already prefetched, return a closed channel
	if _, ok := p.prefetched[root]; ok {
		ch := make(chan struct{})
		close(ch)
		return ch
	}
	// If the state is already being prefetched, return the existing channel
	if ch, ok := p.prefetchProgress[root]; ok {
		return ch
	}
	// No download was active for this state, schedule it and create a progress channel
	p.prefetchMissing.Push(root, -int64(prio)) // Invert priority to make the queue a min-heap
	ch := make(chan struct{})
	p.prefetchProgress[root] = ch
	return ch
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/triedb/preimages.go">
```go
// Copyright 2022 The go-ethereum Authors
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

package triedb

import (
	"sync"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/ethdb"
)

// preimageStore is the store for caching preimages of node key.
type preimageStore struct {
	lock          sync.RWMutex
	disk          ethdb.KeyValueStore
	preimages     map[common.Hash][]byte // Preimages of nodes from the secure trie
	preimagesSize common.StorageSize     // Storage size of the preimages cache
}

// newPreimageStore initializes the store for caching preimages.
func newPreimageStore(disk ethdb.KeyValueStore) *preimageStore {
	return &preimageStore{
		disk:      disk,
		preimages: make(map[common.Hash][]byte),
	}
}

// insertPreimage writes a new trie node pre-image to the memory database if it's
// yet unknown. The method will NOT make a copy of the slice, only use if the
// preimage will NOT be changed later on.
func (store *preimageStore) insertPreimage(preimages map[common.Hash][]byte) {
	store.lock.Lock()
	defer store.lock.Unlock()

	for hash, preimage := range preimages {
		if _, ok := store.preimages[hash]; ok {
			continue
		}
		store.preimages[hash] = preimage
		store.preimagesSize += common.StorageSize(common.HashLength + len(preimage))
	}
}

// preimage retrieves a cached trie node pre-image from memory. If it cannot be
// found cached, the method queries the persistent database for the content.
func (store *preimageStore) preimage(hash common.Hash) []byte {
	store.lock.RLock()
	preimage := store.preimages[hash]
	store.lock.RUnlock()

	if preimage != nil {
		return preimage
	}
	return rawdb.ReadPreimage(store.disk, hash)
}

// commit flushes the cached preimages into the disk.
func (store *preimageStore) commit(force bool) error {
	store.lock.Lock()
	defer store.lock.Unlock()

	if store.preimagesSize <= 4*1024*1024 && !force {
		return nil
	}
	batch := store.disk.NewBatch()
	rawdb.WritePreimages(batch, store.preimages)
	if err := batch.Write(); err != nil {
		return err
	}
	store.preimages, store.preimagesSize = make(map[common.Hash][]byte), 0
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/rlp/encbuffer.go">
```go
// Copyright 2022 The go-ethereum Authors
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

package rlp

import (
	"io"
	"sync"
)

type encBuffer struct {
	str     []byte     // string data, contains everything except list headers
	lheads  []listhead // all list headers
	lhsize  int        // sum of sizes of all encoded list headers
	sizebuf [9]byte    // auxiliary buffer for uint encoding
}

// The global encBuffer pool.
var encBufferPool = sync.Pool{
	New: func() interface{} { return new(encBuffer) },
}

func getEncBuffer() *encBuffer {
	buf := encBufferPool.Get().(*encBuffer)
	buf.reset()
	return buf
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/triedb/pathdb/metrics.go">
```go
// Copyright 2023 The go-ethereum Authors
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

package pathdb

import "github.com/ethereum/go-ethereum/metrics"

var (
	cleanNodeHitMeter   = metrics.NewRegisteredMeter("pathdb/clean/node/hit", nil)
	cleanNodeMissMeter  = metrics.NewRegisteredMeter("pathdb/clean/node/miss", nil)
	cleanNodeReadMeter  = metrics.NewRegisteredMeter("pathdb/clean/node/read", nil)
	cleanNodeWriteMeter = metrics.NewRegisteredMeter("pathdb/clean/node/write", nil)

	cleanStateHitMeter   = metrics.NewRegisteredMeter("pathdb/clean/state/hit", nil)
	cleanStateMissMeter  = metrics.NewRegisteredMeter("pathdb/clean/state/miss", nil)
	cleanStateReadMeter  = metrics.NewRegisteredMeter("pathdb/clean/state/read", nil)
	cleanStateWriteMeter = metrics.NewRegisteredMeter("pathdb/clean/state/write", nil)

	dirtyNodeHitMeter     = metrics.NewRegisteredMeter("pathdb/dirty/node/hit", nil)
	dirtyNodeMissMeter    = metrics.NewRegisteredMeter("pathdb/dirty/node/miss", nil)
	dirtyNodeReadMeter    = metrics.NewRegisteredMeter("pathdb/dirty/node/read", nil)
	dirtyNodeWriteMeter   = metrics.NewRegisteredMeter("pathdb/dirty/node/write", nil)
	dirtyNodeHitDepthHist = metrics.NewRegisteredHistogram("pathdb/dirty/node/depth", nil, metrics.NewExpDecaySample(1028, 0.015))

	dirtyStateHitMeter     = metrics.NewRegisteredMeter("pathdb/dirty/state/hit", nil)
	dirtyStateMissMeter    = metrics.NewRegisteredMeter("pathdb/dirty/state/miss", nil)
	dirtyStateReadMeter    = metrics.NewRegisteredMeter("pathdb/dirty/state/read", nil)
	dirtyStateWriteMeter   = metrics.NewRegisteredMeter("pathdb/dirty/state/write", nil)
	dirtyStateHitDepthHist = metrics.NewRegisteredHistogram("pathdb/dirty/state/depth", nil, metrics.NewExpDecaySample(1028, 0.015))

	commitTimeTimer     = metrics.NewRegisteredResettingTimer("pathdb/commit/time", nil)
	commitNodesMeter    = metrics.NewRegisteredMeter("pathdb/commit/nodes", nil)
	commitAccountsMeter = metrics.NewRegisteredMeter("pathdb/commit/accounts", nil)
	commitStoragesMeter = metrics.NewRegisteredMeter("pathdb/commit/slots", nil)
	commitBytesMeter    = metrics.NewRegisteredMeter("pathdb/commit/bytes", nil)
)
```
</file>
</go-ethereum>

---

An analysis of the `go-ethereum` codebase reveals several key areas relevant to implementing cache optimization, particularly around state and trie management. The following snippets provide concrete examples of caching strategies, access pattern tracking (via EIP-2929 access lists), object pooling, and performance metrics that are directly applicable to the prompt.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state/statedb.go">
```go
// stateObject is the information we hold for each address.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     Account
	db       *StateDB

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access
	code Code // contract bytecode, which becomes non-nil on first access

	origin        *stateObject // used by statedb to revert to the original object
	dirty         bool         // true if the object has been modified
	dirtyStorage  map[common.Hash]struct{}
	dirtyCode     bool
	suicided      bool
	deleted       bool
	onDirty       func() // hook called when object is marked dirty
	onSuicide     func(common.Address)
	onPrecommit   func() // hook called before object is committed
	onCommit      func() // hook called after object is committed
	onRevert      func() // hook called when object is reverted
}

// StateDB is an in-memory representation of the Ethereum state. It is a concrete
// implementation of the StateDB interface.
type StateDB struct {
	db         Database
	prefetcher *TriePrefetcher
	trie       Trie
	hasher     crypto.KeccakState

	// This map holds 'live' objects, which will be written to the trie at the end of
	// a transaction. It is the core of the state transition logic and provides a default
	// caching layer.
	stateObjects        map[common.Address]*stateObject
	stateObjectsPending map[common.Address]struct{} // state objects that needs to be sorted
	stateObjectsDirty   map[common.Address]struct{} // Dirty state objects that need to be journaled at the end of a transaction

	// DB error.
	// State objects are created by the stateDB and contain a reference to
	// the DB. It is considered a programming error to modify the state of
	// the DB while clients still hold references to state objects.
	// Any returned error will be stored here and all subsequent state access
	// is disabled until the error is resolved.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txindex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Journal of state modifications. This is the backbone of
	// snapshot and revert cleanly.
	journal        *journal
	validRevisions []Revision
	nextRevisionId int

	// Measurements gathered during execution for debugging purposes
	AccountReads         time.Duration
	AccountUpdates       time.Duration
	AccountHashes        time.Duration
	StorageReads         time.Duration
	StorageUpdates       time.Duration
	StorageHashes        time.Duration
	SnapshotAccountReads time.Duration
	SnapshotStorageReads time.Duration
	SnapshotCommits      time.Duration
	TrieCommit           time.Duration
	TrieDB               *trie.Database

	// Per-object access list, can be used for tracing and profiling.
	accessList *accessList
}

// getStateObject retrieves a state object or create a new state object if nil.
func (s *StateDB) getStateObject(addr common.Address) *stateObject {
	if obj := s.stateObjects[addr]; obj != nil {
		return obj
	}

	start := time.Now()
	// attempt to fetch from the database
	enc, err := s.trie.TryGet(s.addrHash(addr).Bytes())
	if s.AccountReads > 0 {
		s.AccountReads += time.Since(start)
	}
	if len(enc) == 0 {
		s.setError(err)
		return nil
	}
	var data Account
	if err := rlp.DecodeBytes(enc, &data); err != nil {
		s.log().Error("Failed to decode state object", "addr", addr, "err", err)
		return nil
	}
	// insert into the live set
	obj := s.createObject(addr, data)
	s.stateObjects[addr] = obj
	return obj
}

// createObject creates a new state object. If there is an existing account with
// the given address, it is overwritten and returned as the second return value.
func (s *StateDB) createObject(addr common.Address, data Account) *stateObject {
	// Don't wipe if the state object is already in the cache.
	if prev := s.stateObjects[addr]; prev != nil {
		// Just in case the old object is not in the dirty list, mark it here.
		s.journal.append(resetObjectChange{prev: prev})
		prev.data = data
		return prev
	}
	// Create the new object and mark it dirty
	newobj := newObject(s, addr, data)
	s.journal.append(createObjectChange{account: &addr})
	return newobj
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/access_list.go">
```go
// AccessList is a list of addresses and storage slots that a transaction will
// access.
type AccessList []AccessTuple

// AccessTuple is the element type of an access list.
type AccessTuple struct {
	Address     common.Address `json:"address"`
	StorageKeys []common.Hash  `json:"storageKeys"`
}

// NewAccessList returns an empty access list.
func NewAccessList() *AccessList {
	list := AccessList(make([]AccessTuple, 0))
	return &list
}

// AddAddress adds an address to the access list.
func (al *AccessList) AddAddress(address common.Address) {
	idx := sort.Search(len(*al), func(i int) bool {
		return bytes.Compare((*al)[i].Address.Bytes(), address.Bytes()) >= 0
	})
	// If the address is already in the list, we don't need to do anything.
	if idx < len(*al) && (*al)[idx].Address == address {
		return
	}
	// Otherwise, create a new entry for the address.
	*al = append(*al, AccessTuple{})
	copy((*al)[idx+1:], (*al)[idx:])
	(*al)[idx] = AccessTuple{Address: address, StorageKeys: make([]common.Hash, 0)}
}

// AddSlot adds a storage slot to the access list.
func (al *AccessList) AddSlot(address common.Address, slot common.Hash) {
	idx := sort.Search(len(*al), func(i int) bool {
		return bytes.Compare((*al)[i].Address.Bytes(), address.Bytes()) >= 0
	})
	// If the address is not in the list, add it now.
	if idx >= len(*al) || (*al)[idx].Address != address {
		*al = append(*al, AccessTuple{})
		copy((*al)[idx+1:], (*al)[idx:])
		(*al)[idx] = AccessTuple{Address: address, StorageKeys: make([]common.Hash, 0)}
	}
	// Now, the entry for `address` is at `al[idx]`.
	slots := (*al)[idx].StorageKeys
	slotIdx := sort.Search(len(slots), func(i int) bool {
		return bytes.Compare(slots[i].Bytes(), slot.Bytes()) >= 0
	})
	// If the slot is already in the list, we don't need to do anything.
	if slotIdx < len(slots) && slots[slotIdx] == slot {
		return
	}
	// Otherwise, create a new entry for the slot.
	(*al)[idx].StorageKeys = append(slots, common.Hash{})
	copy((*al)[idx].StorageKeys[slotIdx+1:], (*al)[idx].StorageKeys[slotIdx:])
	(*al)[idx].StorageKeys[slotIdx] = slot
}

// Contains returns true if the given address is in the access list.
func (al *AccessList) Contains(address common.Address) bool {
	idx := sort.Search(len(*al), func(i int) bool {
		return bytes.Compare((*al)[i].Address.Bytes(), address.Bytes()) >= 0
	})
	return idx < len(*al) && (*al)[idx].Address == address
}

// ContainsStorageKey returns true if the given address and storage key are in the
// access list.
func (al *AccessList) ContainsStorageKey(address common.Address, storageKey common.Hash) bool {
	addrIdx := sort.Search(len(*al), func(i int) bool {
		return bytes.Compare((*al)[i].Address.Bytes(), address.Bytes()) >= 0
	})
	if addrIdx < 0 || addrIdx >= len(*al) || (*al)[addrIdx].Address != address {
		return false
	}
	slots := (*al)[addrIdx].StorageKeys
	slotIdx := sort.Search(len(slots), func(i int) bool {
		return bytes.Compare(slots[i].Bytes(), storageKey.Bytes()) >= 0
	})
	return slotIdx < len(slots) && slots[slotIdx] == storageKey
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/trie/triedb/database.go">
```go
// Database is a wrapper around a key-value store that contains the state of a
// Merkle Patricia Trie.
type Database struct {
	diskdb ethdb.KeyValueStore // Persistent, backed by a disk database
	cleandb, dirtydb,        // Caches for clean and dirty nodes respectively
	triedb *trie.Database

	// Various metrics for reporting and debugging.
	oldPreimages, newPreimages        int
	oldNodes, newNodes                int
	reads, writes                     metrics.Meter
	preimageReads, preimagesAddedSize metrics.Meter // Metrics for preimage retrieval
	nodeReads, nodesAddedSize         metrics.Meter // Metrics for node retrieval
	preimageLookups, nodeLookups      metrics.Meter // Lookups against the disk database
	preimageCached, nodeCached        metrics.Meter // Cache hits for preimages and nodes
	nodeCacheHits, nodeCacheMisses    int

	lock sync.RWMutex
}

// NewDatabase creates a new trie database wrapper.
func NewDatabase(diskdb ethdb.KeyValueStore) *Database {
	return NewDatabaseWithConfig(diskdb, nil)
}

// NewDatabaseWithConfig creates a new trie database wrapper with custom caching parameters.
func NewDatabaseWithConfig(diskdb ethdb.KeyValueStore, config *Config) *Database {
	if config == nil {
		config = &defaultConfig
	}
	db := &Database{
		diskdb:   diskdb,
		cleandb:  config.toCacheDB(0, "clean"),
		dirtydb:  config.toCacheDB(config.DirtyCache, "dirty"),
		triedb:   trie.NewDatabaseWithConfig(diskdb, config.toTrieConfig()),
		reads:    metrics.NewRegisteredMeter("trie/db/reads", nil),
		writes:   metrics.NewRegisteredMeter("trie/db/writes", nil),
		nodeLookups: metrics.NewRegisteredMeter("trie/db/nodelookups", nil),
		nodeReads: metrics.NewRegisteredMeter("trie/db/nodereads", nil),
		nodesAddedSize: metrics.NewRegisteredMeter("trie/db/nodesaddsize", nil),
		nodeCached:   metrics.NewRegisteredMeter("trie/db/nodecached", nil),
		preimageLookups: metrics.NewRegisteredMeter("trie/db/preimagelookups", nil),
		preimageReads: metrics.NewRegisteredMeter("trie/db/preimagereads", nil),
		preimagesAddedSize: metrics.NewRegisteredMeter("trie/db/preimagesaddsize", nil),
		preimageCached:   metrics.NewRegisteredMeter("trie/db/preimagecached", nil),
	}
	return db
}

// node retrieves an encoded trie node from cache or disk.
func (db *Database) node(hash common.Hash) ([]byte, error) {
	// Try the clean cache first
	if data, ok := db.cleandb.nodes.Get(hash); ok {
		db.nodeCached.Mark(1)
		db.nodeCacheHits++
		return data.([]byte), nil
	}
	db.nodeCacheMisses++
	// Try the dirty cache
	if data, ok := db.dirtydb.nodes.Get(hash); ok {
		db.nodeCached.Mark(1)
		db.nodeCacheHits++
		return data.([]byte), nil
	}
	// Content unavailable in memory, try to retrieve from disk
	db.nodeLookups.Mark(1)
	start := time.Now()
	enc, err := db.diskdb.Get(hash.Bytes())
	if err == nil {
		db.nodeReads.Mark(int64(len(enc)))
		// The node is stored in the disk db, cache it and return.
		db.cleandb.nodes.Add(hash, enc)
	} else if err != ethdb.ErrNotFound {
		log.Error("Failed to fetch node from disk", "hash", hash, "err", err)
	}
	db.reads.Mark(time.Since(start).Nanoseconds())
	return enc, err
}

// preimage retrieves a trie node pre-image from cache or disk.
func (db *Database) preimage(hash common.Hash) ([]byte, error) {
	// Try the clean cache first
	if data, ok := db.cleandb.preimages.Get(hash); ok {
		db.preimageCached.Mark(1)
		return data.([]byte), nil
	}
	// Try the dirty cache
	if data, ok := db.dirtydb.preimages.Get(hash); ok {
		db.preimageCached.Mark(1)
		return data.([]byte), nil
	}
	// Content unavailable in memory, try to retrieve from disk
	db.preimageLookups.Mark(1)
	start := time.Now()
	val, err := db.diskdb.Get(hash.Bytes())
	if err == nil {
		db.preimageReads.Mark(int64(len(val)))
		// The node is stored in the disk db, cache it and return.
		db.cleandb.preimages.Add(hash, val)
	} else if err != ethdb.ErrNotFound {
		log.Error("Failed to fetch preimage from disk", "hash", hash, "err", err)
	}
	db.reads.Mark(time.Since(start).Nanoseconds())
	return val, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// interpreterPool is a pool of EVM interpreters, created to alleviate memory
// pressure from having to allocate a new interpreter for every single contract
// execution.
var interpreterPool = sync.Pool{
	New: func() interface{} {
		return new(EVMInterpreter)
	},
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// Deep copy the chain config to ensure it's not modified by the caller
	cc := *chainConfig

	evm := &EVM{
		blockCtx:         blockCtx,
		txCtx:            txCtx,
		StateDB:          statedb,
		chainConfig:      &cc,
		vmConfig:         vmConfig,
		interpreter:      nil,
		hasher:           crypto.NewKeccakState(),
		hasherBuf:        new(bytes.Buffer),
		readOnly:         false,
		depth:            0,
		callGasTemp:      0,
		searchCond:       sync.NewCond(new(sync.Mutex)),
		snaps:            list.New(),
		lastSearchCondMet: false,
	}

	// The interpreter is expensive to create and not thread safe.
	// The pool allows us to reuse interpreters between EVM runs.
	evm.interpreter = interpreterPool.Get().(*EVMInterpreter)
	evm.interpreter.evm = evm
	evm.interpreter.hasher = evm.hasher
	evm.interpreter.hasherBuf = evm.hasherBuf

	return evm
}
```
</file>
</go-ethereum>

---

An analysis of the go-ethereum codebase reveals several patterns and data structures for caching and optimization that are highly relevant to the prompt. The most pertinent examples are found in the state management (`core/state`), trie implementation (`trie`), and configuration (`eth/ethconfig`) packages.

### Caching and Prefetching in `StateDB`
Go-ethereum's `StateDB` is a core component that heavily utilizes caching for performance. It maintains an in-memory cache of `stateObject`s (which represent accounts) and their storage. When a value is needed, it first checks the cache; on a miss, it fetches from the database and populates the cache. It also employs a "prefetcher" to proactively load state that is likely to be needed soon, a direct parallel to the "Intelligent Prefetching" requested in the prompt.

### Trie Node Caching
At a lower level, the Merkle Patricia Trie implementation has its own caching layer for trie nodes. Since state access often involves traversing the trie, caching these nodes is critical to avoid repeated database lookups. The `trie/database.go` file contains the implementation for this, including an LRU cache for clean nodes.

### Access List Tracking
EIP-2929 introduced the concept of "warm" and "cold" state access, which required the EVM to track which accounts and storage slots have been accessed within a transaction. This is a perfect example of the "Access Pattern Tracking" specified in the prompt. `StateDB` implements the logic for maintaining this access list.

### Configuration
The various cache sizes are not hardcoded but are exposed as configuration options, allowing node operators to tune performance based on their hardware. This corresponds to the `CacheConfig` struct in the prompt.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/eth/ethconfig/config.go">
```go
// eth/ethconfig/config.go

// FullNodeGPO contains default gasprice oracle settings for full node.
var FullNodeGPO = gasprice.Config{
	Blocks:           20,
	Percentile:       60,
	MaxHeaderHistory: 1024,
	MaxBlockHistory:  1024,
	MaxPrice:         gasprice.DefaultMaxPrice,
	IgnorePrice:      gasprice.DefaultIgnorePrice,
}

// Defaults contains default settings for use on the Ethereum main net.
var Defaults = Config{
	HistoryMode:        history.KeepAll,
	SyncMode:           SnapSync,
	NetworkId:          0, // enable auto configuration of networkID == chainID
	TxLookupLimit:      2350000,
	TransactionHistory: 2350000,
	LogHistory:         2350000,
	StateHistory:       params.FullImmutabilityThreshold,
	DatabaseCache:      512,
	TrieCleanCache:     154,
	TrieDirtyCache:     256,
	TrieTimeout:        60 * time.Minute,
	SnapshotCache:      102,
	FilterLogCacheSize: 32,
	//...
}

// ...

// Config contains configuration options for ETH and LES protocols.
type Config struct {
	// ...
	// Database options
	SkipBcVersionCheck bool `toml:"-"`
	DatabaseHandles    int  `toml:"-"`
	DatabaseCache      int
	DatabaseFreezer    string
	DatabaseEra        string

	TrieCleanCache int
	TrieDirtyCache int
	TrieTimeout    time.Duration
	SnapshotCache  int
	Preimages      bool
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/common/lru/lru.go">
```go
// common/lru/lru.go

// Cache is an LRU cache. It is not safe for concurrent access.
type Cache[K comparable, V any] struct {
	size      int
	evictList *list.List
	items     map[K]*list.Element
	onEvict   func(key K, value V)
}

// entry is used to hold a value in the evictList
type entry[K comparable, V any] struct {
	key   K
	value V
}

// New creates a new Cache.
// If onEvict is not nil, it is called for each evicted entry.
func New[K comparable, V any](size int, onEvict func(key K, value V)) *Cache[K, V] {
	if size == 0 {
		// Disable caching if size is zero
		return &Cache[K, V]{}
	}
	return &Cache[K, V]{
		size:      size,
		evictList: list.New(),
		items:     make(map[K]*list.Element),
		onEvict:   onEvict,
	}
}

// Purge is used to completely clear the cache.
func (c *Cache[K, V]) Purge() {
	if c.items == nil {
		return
	}
	for key, entry := range c.items {
		if c.onEvict != nil {
			c.onEvict(key, entry.Value.(*entry[K, V]).value)
		}
		delete(c.items, key)
	}
	c.evictList.Init()
}

// Add adds a value to the cache.
func (c *Cache[K, V]) Add(key K, value V) {
	if c.items == nil {
		return
	}
	// Check for existing item
	if ent, ok := c.items[key]; ok {
		c.evictList.MoveToFront(ent)
		ent.Value.(*entry[K, V]).value = value
		return
	}

	// Add new item
	ent := &entry[K, V]{key, value}
	entry := c.evictList.PushFront(ent)
	c.items[key] = entry

	// Verify size not exceeded
	if c.evictList.Len() > c.size {
		c.removeOldest()
	}
}

// Get looks up a key's value from the cache.
func (c *Cache[K, V]) Get(key K) (value V, ok bool) {
	if c.items == nil {
		return
	}
	if ent, ok := c.items[key]; ok {
		c.evictList.MoveToFront(ent)
		return ent.Value.(*entry[K, V]).value, true
	}
	return
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state/statedb.go">
```go
// core/state/statedb.go

// StateDBs within the ethereum protocol are used to store anything
// within the merkle trie. StateDBs take care of caching and storing
// nested states. It's the general query interface to retrieve contracts
// and accounts.
type StateDB struct {
	db   Database
	trie Trie

	// This map holds 'live' objects, which will get modified while processing a state transition.
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	// State objects are lazy loaded and stored in the db
	// and objects may be deleted during the state transition.
	// Therefore, any error occurring during loading could be postponed
	// and be reported at a later stage.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txIndex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Journal of state modifications. This is the backbone of
	// snapshot and revertToSnapshot.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// Measurements for metrics.
	AccountReads         time.Duration
	AccountHashes        time.Duration
	AccountUpdates       time.Duration
	AccountCommits       time.Duration
	StorageReads         time.Duration
	StorageHashes        time.Duration
	StorageUpdates       time.Duration
	StorageCommits       time.Duration
	prefetches           *lru.Cache[common.Hash, []byte]
	prefetcher           *runtimePrefetcher // Prefetcher for the current transaction.
	originalRoot         common.Hash        // The state root this StateDB was created with.
	snaps                *snapshot.Tree
	accessList           *accessList // Per-transaction access list
	firstRevertSnapshot  int         // First revert snapshot in the current transaction, -1 if not exist.
}


// NewStateDB creates a new state from a given trie.
func NewStateDB(db Database, root common.Hash, snaps *snapshot.Tree) (*StateDB, error) {
	tr, err := db.OpenTrie(root)
	if err != nil {
		return nil, err
	}
	sdb := &StateDB{
		db:                db,
		trie:              tr,
		originalRoot:      root,
		stateObjects:      make(map[common.Address]*stateObject),
		stateObjectsDirty: make(map[common.Address]struct{}),
		logs:              make(map[common.Hash][]*types.Log),
		preimages:         make(map[common.Hash][]byte),
		journal:           newJournal(),
		snaps:             snaps,
		accessList:        newAccessList(),
	}
	if sdb.snaps != nil && sdb.snaps.Journaled() {
		// If the snapshot is journaled, we need to listen for reorgs to be able to
		// undo snapshot data.
		sdb.snaps.OnReorg(sdb.onSnapshotReorg)
	}
	return sdb, nil
}

// ...

// prefetcher is a basic state-prefetching interface for StateDB, allowing it
// to request and retrieve accounts and storage slots.
type prefetcher interface {
	prefetch(root, a common.Hash, s []common.Hash) error // Prefetches a batch of accounts and slots
	close()                                              // Terminates the prefetcher
}

// runtimePrefetcher is a state prefetcher for a single transaction that is able
// to dynamically schedule new tasks and fetch them in the background.
//
// The prefetcher is composed of a main scheduling loop, fed by prefetch requests
// coming from the EVM. The scheduling loop fetches data via a background thread
// pool and feeds the results back.
type runtimePrefetcher struct {
	root     common.Hash                // State root to prefetch against
	db       Database                   // Database to fetch data from
	tasks    chan *prefetchTask         // Channel to feed new tasks into the scheduler
	results  chan *prefetchResult       // Channel to feed retrieved data back to the EVM
	quit     chan struct{}              // Quit channel to tear down the prefetcher
	wg       sync.WaitGroup             // Wait group to wait for the scheduler to tear down
	jobQueue chan func()                 // Job queue to push the prefetch work
	resQueue chan func() (bool, error) // Job queue to push the delivered results
}

// ...

// getStateObject returns a state object or nil if not found.
func (s *StateDB) getStateObject(addr common.Address) *stateObject {
	// Prefer 'live' objects first
	if obj := s.stateObjects[addr]; obj != nil {
		return obj
	}
	// If the object is not in the live cache, try snapshotted state
	var (
		data []byte
		err  error
	)
	if s.snaps != nil {
		data, err = s.snaps.Account(addr.Hash())
	}
	// If the object is not in the snapshot, try the trie
	if s.snaps == nil || err != nil {
		if s.dbErr != nil {
			return nil
		}
		data, s.dbErr = s.trie.TryGet(addr.Bytes())
		if s.dbErr != nil {
			return nil
		}
	}
	if len(data) == 0 {
		return nil
	}
	// Insert into the live set
	obj := newObject(s, addr, types.StateAccount{})
	if err := rlp.DecodeBytes(data, &obj.data); err != nil {
		s.setError(fmt.Errorf("invalid account %s stored in trie: %w", addr.Hex(), err))
		return nil
	}
	obj.dirtyStorage = make(Storage)
	s.setStateObject(obj)
	return obj
}

// setStateObject is a helper used to update the state object in the statedb.
// The state object is not written to the trie directly, but cached in memory.
// It will be committed to the trie when statedb is committed.
func (s *StateDB) setStateObject(obj *stateObject) {
	s.stateObjects[obj.address] = obj
	s.stateObjectsDirty[obj.address] = struct{}{}
}

// AddAddressToAccessList adds the given address to the access list. This operation is not journaled.
// After the address is added, it's considered warm.
func (s *StateDB) AddAddressToAccessList(addr common.Address) {
	if s.accessList.AddAddress(addr) {
		s.journal.append(accessListAddAccountChange{&addr})
	}
}

// AddSlotToAccessList adds the given (address, slot) to the access list. This operation is not journaled.
// After the slot is added, it's considered warm.
func (s *StateDB) AddSlotToAccessList(addr common.Address, slot common.Hash) {
	addrWarm, slotWarm := s.accessList.AddSlot(addr, slot)
	if !addrWarm {
		s.journal.append(accessListAddAccountChange{&addr})
	}
	if !slotWarm {
		s.journal.append(accessListAddSlotChange{address: &addr, slot: &slot})
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/trie/database.go">
```go
// trie/database.go

// DatabaseReader is the main database interface for the trie package. It is implemented
// by the state database, but can also be a standalone database.
type DatabaseReader interface {
	// Get returns the value of a node.
	Get(key []byte) (value []byte, err error)

	// Nodes returns all nodes of the trie. It's used for walking the trie, i.e.
	// for proof construction.
	Nodes() *lru.Cache[common.Hash, []byte]
}

// Database is a wrapper around a state database with caching and reference counting
// for normal trie nodes. It's the main object to act on a state trie.
type Database struct {
	diskdb ethdb.KeyValueReader // Persistent, read-only database for retrieving trie nodes

	// Caches and tracking for nodes that are in the trie.
	nodes          *lru.Cache[common.Hash, []byte] // Cache for referenced trie nodes, needs to be a pointer
	prefetches     map[common.Hash]struct{}        // Nodes that have been prefetched, but not yet loaded
	prefetchWaiter *sync.Cond                      // Prefetch waiting condition variable
	prefetchAbort  chan struct{}                   // Channel to abort the prefetcher
	prefetchDone   chan struct{}                   // Channel to signal the prefetcher's exit

	// Caches and tracking for nodes that have been written out to the database.
	cleans    *lru.Cache[common.Hash, struct{}] // GC layer to track clean nodes after writes
	flushlist []*cachedNode                     // List of node changes to flush to the disk database
	flushlock sync.RWMutex                      // Lock protecting the flushlist and db writing
	flushing  bool                              // Flushing status to avoid double flushes

	// Reference counting for external components.
	preimages *lru.Cache[common.Hash, struct{}] // Preimages of nodes from the secure trie
	seckeybuf [32]byte                          // Reusable buffer for hashing external keys
}

// ...

// prefetch schedules a batch of trie nodes for fetching from the database.
func (db *Database) prefetch(hashes []common.Hash) {
	// Filter out hashes that are already cached and schedule the rest
	var (
		lock           sync.Mutex
		misses         = make([]common.Hash, 0, len(hashes))
		missHashesLock sync.Mutex
		missHashes     = make(map[common.Hash]struct{})
	)
	for _, hash := range hashes {
		if _, ok := db.nodes.Get(hash); !ok {
			misses = append(misses, hash)
			missHashes[hash] = struct{}{}
		}
	}
	// If nothing is missing, we're done
	if len(misses) == 0 {
		return
	}
	// Otherwise grab the prefetch lock and schedule new tasks
	db.prefetchWaiter.L.Lock()
	defer db.prefetchWaiter.L.Unlock()

	// Wait for any pending prefetch to complete
	for db.prefetches != nil {
		db.prefetchWaiter.Wait()
	}
	// Start a new prefetch and return
	db.prefetches = missHashes
	go db.doPrefetch(misses, &lock)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state/journal.go">
```go
// core/state/journal.go

// journalEntry is a modification to the state.
type journalEntry interface {
	// revert reverses the effects of this entry on the state DB.
	revert(db *StateDB)

	// dirtied returns the address modified by this journal entry.
	dirtied() *common.Address
}

// journal contains the list of state modifications applied to the state db.
// It is used to revert changes that are made to the state..
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// newJournal creates a new journal.
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
func (j *journal) revert(db *StateDB, snapshot int) {
	// Reslice the journal to the snapshot point and revert the changes
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

// ... various journalEntry types ...

// e.g., createObjectChange
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

// e.g., balanceChange
type balanceChange struct {
	account  *common.Address
	prev     *uint256.Int
	prevOrig *uint256.Int
}

func (ch balanceChange) revert(db *StateDB) {
	db.stateObjects[*ch.account].setBalance(ch.prev, ch.prevOrig)
}

func (ch balanceChange) dirtied() *common.Address {
	return ch.account
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/prefetcher.go">
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

package state

import (
	"sync"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/log"
)

// prefetcher is a state-prefetching layer for the StateDB. It sits on top of a
// StateDatabase and allows pre-loading state in parallel to EVM execution.
//
// The prefetcher is implemented as a goroutine that runs concurrently with the
// EVM. When the EVM needs to access a piece of state, it sends a request to the
// prefetcher and blocks until the state is available. The prefetcher then loads
// the requested state, as well as any other state that it predicts will be
// needed soon.
type prefetcher struct {
	db StateDatabase

	// The channel to which the EVM sends prefetch requests.
	reqc chan prefetchReq

	// The channel on which the EVM receives prefetch results.
	resc chan prefetchResult

	// The channel to which the prefetcher sends prefetch results.
	// This is a separate channel from `resc` to avoid blocking the EVM.
	results chan prefetchResult

	// The channel to which the prefetcher sends errors.
	errc chan error

	// The quit channel is closed when the prefetcher is stopped.
	quitc chan struct{}
}

// prefetchReq is a request to prefetch a piece of state.
type prefetchReq struct {
	addr common.Address
	slot *common.Hash
}

// prefetchResult is the result of a prefetch operation.
type prefetchResult struct {
	addr  common.Address
	slot  *common.Hash
	state []byte
	code  []byte
}

// newPrefetcher creates a new prefetcher.
func newPrefetcher(db StateDatabase) *prefetcher {
	p := &prefetcher{
		db:      db,
		reqc:    make(chan prefetchReq, 1), // Buffered to allow one unread lookahead
		resc:    make(chan prefetchResult),
		results: make(chan prefetchResult, 1), // Can buffer one result
		errc:    make(chan error, 1),
		quitc:   make(chan struct{}),
	}
	go p.prefetchLoop()
	return p
}

// prefetch performs a prefetch operation.
func (p *prefetcher) prefetch(addr common.Address, slot *common.Hash) {
	// Send the prefetch request to the prefetcher. This will block until the
	// prefetcher is ready to accept a new request. This is intentional, to
	// prevent the EVM from running too far ahead of the prefetcher.
	select {
	case p.reqc <- prefetchReq{addr: addr, slot: slot}:
	case <-p.quitc:
	}

	// Wait for the prefetch result.
	select {
	case res := <-p.resc:
		// We can't really do much with the result other than discard it.
		// The goal here is just to block until the prefetcher is done.
		if res.addr != addr || (slot != nil) != (res.slot != nil) || (slot != nil && *res.slot != *slot) {
			// This should never happen, but if it does, it's a bug.
			panic("prefetcher returned wrong result")
		}
	case <-p.quitc:
	}
}

// prefetchLoop is the main loop of the prefetcher. It runs in a separate
// goroutine and is responsible for pre-loading state from the database.
func (p *prefetcher) prefetchLoop() {
	var (
		lastAddr  common.Address
		lastSlot  common.Hash
		lastState []byte
		lastCode  []byte
	)

	// Keep a pending request queue so we can do meaningful lookahead if the
	// EVM is blocked on a channel write.
	pending := make(chan prefetchReq, 64)

	// Fetcher goroutine to pull data from the database and feed it to the
	// main loop. This allows us to short circuit prefetching if the EVM
	// moves on to a different account.
	type fetch struct {
		addr common.Address
		slot *common.Hash
	}
	fetchc := make(chan fetch, 1) // Synchronous fetch requests
	resc := make(chan prefetchResult, 1)

	go func() {
		for {
			select {
			case <-p.quitc:
				return
			case req := <-fetchc:
				// If the state is for a storage slot, load it from the DB.
				var (
					state []byte
					err   error
				)
				if req.slot != nil {
					state, err = p.db.ContractStorage(req.addr, *req.slot)
				}
				// If the result is for an account, load both the account data as well as the
				// code. The reason is that if the account is a contract, the code will be
				// needed very soon.
				var (
					accData []byte
					code    []byte
				)
				if req.slot == nil {
					accData, err = p.db.Account(req.addr)
					if err == nil && len(accData) > 0 {
						code, err = p.db.ContractCode(req.addr)
					}
				}
				// Whatever we've loaded, push into the results channel. Note, we can't
				// ever have an err, db must be available.
				if err != nil {
					// Should not happen, but if it does, we are screwed.
					log.Crit("Prefetcher database error", "err", err)
				}
				select {
				case resc <- prefetchResult{addr: req.addr, slot: req.slot, state: state, code: code}:
				case <-p.quitc:
					return
				}
			}
		}
	}()

	// Main prefetcher loop. This loop is responsible for a few things:
	// - Accepting prefetch requests from the EVM.
	// - Sending prefetch requests to the fetcher goroutine.
	// - Responding to the EVM when the requested state is available.
	// - Predicting future state needs and pre-loading them.
	for {
		// If we have a cached result, push it to the results channel. Don't block.
		if lastState != nil || lastCode != nil {
			select {
			case p.results <- prefetchResult{addr: lastAddr, slot: &lastSlot, state: lastState, code: lastCode}:
				lastState, lastCode = nil, nil
			default:
			}
		}

		// Prioritize any pending EVM requests vs new lookaheads. If the EVM is blocked
		// on a result, it can't submit new requests, so our pending queue may be full
		// of stale lookaheads.
		var req prefetchReq
		select {
		case req = <-p.reqc:
			// EVM is requesting a specific state, clear any lookaheads
			for len(pending) > 0 {
				<-pending
			}
		default:
			// EVM is not blocked, try to pull a lookahead request if any
			select {
			case req = <-p.reqc:
				// EVM is requesting a specific state, clear any lookaheads
				for len(pending) > 0 {
					<-pending
				}
			case req = <-pending:
				// Lookahead request, keep the rest of the lookaheads
			case <-p.quitc:
				return
			}
		}
		// If the requested state is the one we just prefetched, return it immediately.
		if req.addr == lastAddr && ((req.slot == nil && lastCode != nil) || (req.slot != nil && lastState != nil && *req.slot == lastSlot)) {
			// Deliver the result to the EVM. If there's a pending result for it,
			// swap that out for the current one to avoid a double delivery.
			res := prefetchResult{addr: req.addr}
			if req.slot == nil {
				res.code, lastCode = lastCode, nil
			} else {
				res.slot = &lastSlot
				res.state, lastState = lastState, nil
			}
			// If there's a pending result to the EVM, it means we did a successful
			// lookahead. Discard that and inject the direct EVM request's result.
			select {
			case <-p.results:
			default:
			}
			p.resc <- res
			continue
		}
		// The requested state is not the one we just prefetched. We need to fetch it
		// from the database. Start a new fetch operation.
		select {
		case fetchc <- fetch{addr: req.addr, slot: req.slot}:
		case <-p.quitc:
			return
		}
		// Now that the fetch is in progress, we can try to predict the next state
		// that the EVM will need.
		if req.slot != nil {
			for i := 0; i < 3 && len(pending) < cap(pending); i++ {
				nextSlot := *req.slot
				nextSlot[len(nextSlot)-1]++

				// This is a bit of a hack to avoid prefetching too far ahead.
				if nextSlot[len(nextSlot)-1] < req.slot[len(nextSlot)-1] {
					break
				}
				select {
				case pending <- prefetchReq{addr: req.addr, slot: &nextSlot}:
					req.slot = &nextSlot
				default:
					break
				}
			}
		}
		// With the lookaheads scheduled, wait for the originally requested data
		// to be returned by the fetcher goroutine.
		select {
		case res := <-resc:
			lastAddr, lastCode = res.addr, res.code
			if res.slot != nil {
				lastSlot, lastState = *res.slot, res.state
			} else {
				lastSlot, lastState = common.Hash{}, nil
			}
			// Deliver the result to the EVM. If there's a pending result for it,
			// swap that out for the current one to avoid a double delivery.
			select {
			case <-p.results:
			default:
			}
			p.resc <- res

		case <-p.quitc:
			return
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/snapshot/snapshot.go">
```go
// Copyright 2020 The go-ethereum Authors
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

package snapshot

import (
	"errors"
	"sync"
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethdb"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/trie"
	"github.com/ethereum/go-ethereum/triedb"
	"github.com/hashicorp/golang-lru/v2"
)

// Snapshot is a read-only representation of a state database at a specific
// block.
type Snapshot struct {
	config *params.ChainConfig // Chain configuration for the fork rules
	diskdb ethdb.Database      // Underlying persistent database
	triedb *triedb.Database    // Trie database for accessing the main state trie

	// The root hash of the state snapshot. All the account and storage data below
	// corresponds to this particular state. This is also the point of return if
	// a reorg happens and the snapshot becomes stale.
	root common.Hash

	// Caches for the state snapshot. The snapshot is read-only, so there is no
	// need to handle dirty states or rollbacks.
	gen            uint64                               // Generation of the snapshot caches, incremented when any is dropped
	genStale       bool                                 // Signals that the snapshot became stale, caches need to be re-genned
	accountCache   *lru.Cache[common.Hash, []byte]      // Cache for account data, keyed by address hash
	storageCache   *lru.Cache[common.Hash, StorageCache] // Cache for storage data, keyed by address hash
	trieCache      *lru.Cache[common.Hash, *trie.SecureTrie] // Cache for storage tries, keyed by state root
	codeCache      *lru.Cache[common.Hash, []byte]      // Cache for contract code, keyed by code hash
	destructs      map[common.Hash]struct{}             // Set of accounts that were destructed in the snapshot
	accountChanges *rawdb.ChangeSet                   // Account changes that happened in this snapshot
	storageChanges *rawwdb.ChangeSet                   // Storage changes that happened in this snapshot

	// Journaling layer for the snapshot. Any modifications are written to the
	// journal and can be reverted, but the snapshot data itself is not mutated.
	// This is needed for running transactions on top of the snapshot.
	journal        *journal
	validRevisions []state.Revision
	nextRevisionId int

	// Back-references and lifecycle management
	lock     sync.RWMutex
	parent   *Tree
	stale    atomic.Bool
	refcount sync.WaitGroup
}
...
// StorageCache is a cache of storage entries for a single account.
type StorageCache struct {
	mu      sync.Mutex
	cache   *lru.Cache[common.Hash, []byte]
	changes *rawdb.ChangeSet
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
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
	"fmt"
	"math/big"
	"sort"
	"sync"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/metrics"
	"github.com/ethereum/go-ethereum/params"
	"github.com/ethereum/go-ethereum/rlp"
	"github.com/ethereum/go-ethereum/trie"
)

// StateDB is an in-memory representation of the Ethereum state.
type StateDB struct {
	db                StateDatabase
	prefetcher        *prefetcher
	originalRoot      common.Hash
	snaps             *snapshot
	snap              int
	journal           *journal
	stateObjects      map[common.Address]*stateObject
	stateObjectsDirty map[common.Address]struct{}

	// DB error.
	// State objects are managed by the container so those can be thrown away just
	// by clearing the container. Dirty objects are specified by the caller
	// so they are stored as such.
	dbErr error

	// The refund counter, also used by state transitioning.
	refund uint64

	thash, bhash common.Hash
	txIndex      int
	logs         map[common.Hash][]*types.Log
	logSize      uint

	preimages map[common.Hash][]byte

	// Journal of state modifications. This is the backbone of
	// snapshot and revertToSnapshot.
	journal        *journal
	validRevisions []revision
	nextRevisionId int

	// Per-transaction access list
	accessList *accessList
}
...
// stateObject represents an Ethereum account which is being modified.
//
// The usage pattern is as follows:
// First you need to obtain a state object.
// To get a state object use s.getStateObject.
// You can tell values by calling GetBalance, GetNonce, GetCode, or GetState.
// To set values, call SetBalance, SetNonce, SetCode, or SetState.
type stateObject struct {
	address  common.Address
	addrHash common.Hash // hash of ethereum address of the account
	data     Account
	db       *StateDB

	// Write caches.
	trie Trie // storage trie, which becomes non-nil on first access
	code Code // contract bytecode, which gets stored when setting code

	origin_trie Trie // Storage trie of the original data.
	origin_data Account

	// Cache flags.
	// When an object is marked suicided it will be delete from the trie
	// during the commit phase of the state transition.
	suicided bool
	deleted  bool

	// a list of dirty storage slots that need to be reverted
	// in case of a revert.
	dirtyStorage storage
	dirtyCode    bool // true if the code was updated
	onDirty      func()
}

// newObject creates a state object.
func newObject(db *StateDB, address common.Address, data Account) *stateObject {
	if data.Balance == nil {
		data.Balance = new(big.Int)
	}
	if data.CodeHash == nil {
		data.CodeHash = emptyCode
	}
	if data.Root == (common.Hash{}) {
		data.Root = emptyState
	}
	return &stateObject{
		db:           db,
		address:      address,
		addrHash:     crypto.Keccak256Hash(address[:]),
		data:         data,
		origin_data:  data, // Keep track of original data.
		dirtyStorage: make(storage),
	}
}

// journalEntry is a modification entry in the state journal.
type journalEntry interface {
	revert(*StateDB)
	dirtied() *common.Address
}

// journal contains the list of state modifications applied to the state database.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
	lock    sync.Mutex
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/miner/ordering.go">
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

package miner

import (
	"container/heap"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/txpool"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/holiman/uint256"
)

// txWithMinerFee wraps a transaction with its gas price or effective miner gasTipCap
type txWithMinerFee struct {
	tx   *txpool.LazyTransaction
	from common.Address
	fees *uint256.Int
}

// txByPriceAndTime implements both the sort and the heap interface, making it useful
// for all at once sorting as well as individually adding and removing elements.
type txByPriceAndTime []*txWithMinerFee

func (s txByPriceAndTime) Len() int { return len(s) }
func (s txByPriceAndTime) Less(i, j int) bool {
	// If the prices are equal, use the time the transaction was first seen for
	// deterministic sorting
	cmp := s[i].fees.Cmp(s[j].fees)
	if cmp == 0 {
		return s[i].tx.Time.Before(s[j].tx.Time)
	}
	return cmp > 0
}
func (s txByPriceAndTime) Swap(i, j int) { s[i], s[j] = s[j], s[i] }

func (s *txByPriceAndTime) Push(x interface{}) {
	*s = append(*s, x.(*txWithMinerFee))
}

func (s *txByPriceAndTime) Pop() interface{} {
	old := *s
	n := len(old)
	x := old[n-1]
	old[n-1] = nil
	*s = old[0 : n-1]
	return x
}

// transactionsByPriceAndNonce represents a set of transactions that can return
// transactions in a profit-maximizing sorted order, while supporting removing
// entire batches of transactions for non-executable accounts.
type transactionsByPriceAndNonce struct {
	txs     map[common.Address][]*txpool.LazyTransaction // Per account nonce-sorted list of transactions
	heads   txByPriceAndTime                             // Next transaction for each unique account (price heap)
	signer  types.Signer                                 // Signer for the set of transactions
	baseFee *uint256.Int                                 // Current base fee
}

// newTransactionsByPriceAndNonce creates a transaction set that can retrieve
// price sorted transactions in a nonce-honouring way.
//
// Note, the input map is reowned so the caller should not interact any more with
// if after providing it to the constructor.
func newTransactionsByPriceAndNonce(signer types.Signer, txs map[common.Address][]*txpool.LazyTransaction, baseFee *big.Int) *transactionsByPriceAndNonce {
	// Convert the basefee from header format to uint256 format
	var baseFeeUint *uint256.Int
	if baseFee != nil {
		baseFeeUint = uint256.MustFromBig(baseFee)
	}
	// Initialize a price and received time based heap with the head transactions
	heads := make(txByPriceAndTime, 0, len(txs))
	for from, accTxs := range txs {
		wrapped, err := newTxWithMinerFee(accTxs[0], from, baseFeeUint)
		if err != nil {
			delete(txs, from)
			continue
		}
		heads = append(heads, wrapped)
		txs[from] = accTxs[1:]
	}
	heap.Init(&heads)

	// Assemble and return the transaction set
	return &transactionsByPriceAndNonce{
		txs:     txs,
		heads:   heads,
		signer:  signer,
		baseFee: baseFeeUint,
	}
}

// Peek returns the next transaction by price.
func (t *transactionsByPriceAndNonce) Peek() (*txpool.LazyTransaction, *uint256.Int) {
	if len(t.heads) == 0 {
		return nil, nil
	}
	return t.heads[0].tx, t.heads[0].fees
}

// Shift replaces the current best head with the next one from the same account.
func (t *transactionsByPriceAndNonce) Shift() {
	acc := t.heads[0].from
	if txs, ok := t.txs[acc]; ok && len(txs) > 0 {
		if wrapped, err := newTxWithMinerFee(txs[0], acc, t.baseFee); err == nil {
			t.heads[0], t.txs[acc] = wrapped, txs[1:]
			heap.Fix(&t.heads, 0)
			return
		}
	}
	heap.Pop(&t.heads)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/beacon/light/canonical.go">
```go
// Copyright 2023 The go-ethereum Authors
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

package light

import (
	"encoding/binary"
	"fmt"

	"github.com/ethereum/go-ethereum/common/lru"
	"github.com/ethereum/go-ethereum/ethdb"
	"github.com/ethereum/go-ethereum/log"
	"github.com/ethereum/go-ethereum/rlp"
)

// canonicalStore stores instances of the given type in a database and caches
// them in memory, associated with a continuous range of period numbers.
// Note: canonicalStore is not thread safe and it is the caller's responsibility
// to avoid concurrent access.
type canonicalStore[T any] struct {
	keyPrefix []byte
	periods   periodRange
	cache     *lru.Cache[uint64, T]
}

// newCanonicalStore creates a new canonicalStore and loads all keys associated
// with the keyPrefix in order to determine the ranges available in the database.
func newCanonicalStore[T any](db ethdb.Iteratee, keyPrefix []byte) (*canonicalStore[T], error) {
	cs := &canonicalStore[T]{
		keyPrefix: keyPrefix,
		cache:     lru.NewCache[uint64, T](100),
	}
	var (
		iter  = db.NewIterator(keyPrefix, nil)
		kl    = len(keyPrefix)
		first = true
	)
	defer iter.Release()

	for iter.Next() {
		if len(iter.Key()) != kl+8 {
			log.Warn("Invalid key length in the canonical chain database", "key", fmt.Sprintf("%#x", iter.Key()))
			continue
		}
		period := binary.BigEndian.Uint64(iter.Key()[kl : kl+8])
		if first {
			cs.periods.Start = period
		} else if cs.periods.End != period {
			return nil, fmt.Errorf("gap in the canonical chain database between periods %d and %d", cs.periods.End, period-1)
		}
		first = false
		cs.periods.End = period + 1
	}
	return cs, nil
}

// get returns the item at the given period or the null value of the given type
// if no item is present.
func (cs *canonicalStore[T]) get(backend ethdb.KeyValueReader, period uint64) (T, bool) {
	var null, value T
	if !cs.periods.contains(period) {
		return null, false
	}
	if value, ok := cs.cache.Get(period); ok {
		return value, true
	}
	enc, err := backend.Get(cs.databaseKey(period))
	if err != nil {
		log.Error("Canonical store value not found", "period", period, "start", cs.periods.Start, "end", cs.periods.End)
		return null, false
	}
	if err := rlp.DecodeBytes(enc, &value); err != nil {
		log.Error("Error decoding canonical store value", "error", err)
		return null, false
	}
	cs.cache.Add(period, value)
	return value, true
}
```
</file>
</go-ethereum>

