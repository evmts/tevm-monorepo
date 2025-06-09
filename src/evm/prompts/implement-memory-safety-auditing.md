# Implement Memory Safety Auditing

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_memory_safety_auditing` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_memory_safety_auditing feat_implement_memory_safety_auditing`
3. **Work in isolation**: `cd g/feat_implement_memory_safety_auditing`
4. **Commit message**: `✨ feat: implement comprehensive memory safety auditing system for EVM implementation`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement a comprehensive memory safety auditing system to provide additional bounds checking, memory access monitoring, and safety verification for the EVM implementation. This system adds an extra layer of protection beyond the normal safe/unsafe operation patterns, enabling detailed memory usage analysis and preventing potential memory-related vulnerabilities.

## Memory Safety Auditing Specifications

### Core Auditing Framework

#### 1. Memory Access Monitor
```zig
pub const MemoryAccessMonitor = struct {
    allocator: std.mem.Allocator,
    enabled: bool,
    access_history: std.ArrayList(MemoryAccess),
    allocation_tracking: AllocationTracking,
    bounds_checking: BoundsChecking,
    memory_patterns: MemoryPatternDetection,
    
    pub const MemoryAccess = struct {
        access_type: AccessType,
        address: usize,
        size: usize,
        timestamp: i64,
        context: AccessContext,
        stack_trace: ?[]const usize,
        
        pub const AccessType = enum {
            Read,
            Write,
            Allocate,
            Deallocate,
            Expand,
            Shrink,
        };
        
        pub const AccessContext = struct {
            operation: []const u8,
            pc: u32,
            frame_depth: u32,
            vm_context: []const u8,
        };
    };
    
    pub const AuditConfig = struct {
        enable_access_tracking: bool,
        enable_bounds_checking: bool,
        enable_pattern_detection: bool,
        enable_leak_detection: bool,
        enable_stack_traces: bool,
        max_access_history: u32,
        audit_level: AuditLevel,
        
        pub const AuditLevel = enum {
            Disabled,
            Basic,
            Standard,
            Comprehensive,
            Paranoid,
        };
        
        pub fn production() AuditConfig {
            return AuditConfig{
                .enable_access_tracking = true,
                .enable_bounds_checking = true,
                .enable_pattern_detection = true,
                .enable_leak_detection = true,
                .enable_stack_traces = false, // Too expensive for production
                .max_access_history = 10000,
                .audit_level = .Standard,
            };
        }
        
        pub fn development() AuditConfig {
            return AuditConfig{
                .enable_access_tracking = true,
                .enable_bounds_checking = true,
                .enable_pattern_detection = true,
                .enable_leak_detection = true,
                .enable_stack_traces = true,
                .max_access_history = 100000,
                .audit_level = .Comprehensive,
            };
        }
        
        pub fn testing() AuditConfig {
            return AuditConfig{
                .enable_access_tracking = true,
                .enable_bounds_checking = true,
                .enable_pattern_detection = true,
                .enable_leak_detection = true,
                .enable_stack_traces = true,
                .max_access_history = 1000000,
                .audit_level = .Paranoid,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: AuditConfig) MemoryAccessMonitor {
        return MemoryAccessMonitor{
            .allocator = allocator,
            .enabled = config.audit_level != .Disabled,
            .access_history = std.ArrayList(MemoryAccess).init(allocator),
            .allocation_tracking = AllocationTracking.init(allocator, config),
            .bounds_checking = BoundsChecking.init(config),
            .memory_patterns = MemoryPatternDetection.init(allocator, config),
        };
    }
    
    pub fn deinit(self: *MemoryAccessMonitor) void {
        self.access_history.deinit();
        self.allocation_tracking.deinit();
        self.memory_patterns.deinit();
    }
    
    pub fn audit_memory_access(
        self: *MemoryAccessMonitor,
        access_type: MemoryAccess.AccessType,
        address: usize,
        size: usize,
        context: MemoryAccess.AccessContext
    ) !void {
        if (!self.enabled) return;
        
        // Perform bounds checking
        try self.bounds_checking.check_access(access_type, address, size);
        
        // Track allocation/deallocation
        try self.allocation_tracking.track_access(access_type, address, size);
        
        // Detect patterns and anomalies
        try self.memory_patterns.analyze_access(access_type, address, size, context);
        
        // Record access in history
        const access = MemoryAccess{
            .access_type = access_type,
            .address = address,
            .size = size,
            .timestamp = std.time.milliTimestamp(),
            .context = context,
            .stack_trace = if (self.allocation_tracking.config.enable_stack_traces) 
                try self.capture_stack_trace() 
            else 
                null,
        };
        
        try self.add_access_record(access);
    }
    
    pub fn audit_stack_access(
        self: *MemoryAccessMonitor,
        stack_ptr: usize,
        stack_size: usize,
        access_offset: usize,
        access_size: usize,
        context: MemoryAccess.AccessContext
    ) !void {
        if (!self.enabled) return;
        
        // Check stack bounds
        if (access_offset + access_size > stack_size) {
            return MemorySafetyError.StackBoundsViolation;
        }
        
        // Check stack overflow potential
        if (stack_size > MAX_SAFE_STACK_SIZE) {
            return MemorySafetyError.StackOverflowRisk;
        }
        
        // Check for stack underflow
        if (access_offset < stack_ptr) {
            return MemorySafetyError.StackUnderflowDetected;
        }
        
        try self.audit_memory_access(.Read, stack_ptr + access_offset, access_size, context);
    }
    
    pub fn audit_memory_expansion(
        self: *MemoryAccessMonitor,
        old_size: usize,
        new_size: usize,
        context: MemoryAccess.AccessContext
    ) !void {
        if (!self.enabled) return;
        
        // Check expansion ratio
        const expansion_ratio = if (old_size > 0) 
            @as(f64, @floatFromInt(new_size)) / @as(f64, @floatFromInt(old_size))
        else 
            std.math.inf(f64);
        
        if (expansion_ratio > MAX_MEMORY_EXPANSION_RATIO) {
            return MemorySafetyError.ExcessiveMemoryExpansion;
        }
        
        // Check absolute size limits
        if (new_size > MAX_MEMORY_SIZE) {
            return MemorySafetyError.MemorySizeLimit;
        }
        
        try self.audit_memory_access(.Expand, 0, new_size - old_size, context);
    }
    
    fn add_access_record(self: *MemoryAccessMonitor, access: MemoryAccess) !void {
        // Maintain circular buffer of access history
        if (self.access_history.items.len >= self.allocation_tracking.config.max_access_history) {
            _ = self.access_history.orderedRemove(0);
        }
        
        try self.access_history.append(access);
    }
    
    fn capture_stack_trace(self: *MemoryAccessMonitor) ![]const usize {
        // Simplified stack trace capture
        // In a real implementation, this would use debug info
        var stack_trace = try self.allocator.alloc(usize, 16);
        
        // Placeholder implementation
        for (stack_trace, 0..) |*addr, i| {
            addr.* = @intFromPtr(@returnAddress()) + i * 8;
        }
        
        return stack_trace;
    }
    
    pub fn generate_audit_report(self: *MemoryAccessMonitor) !AuditReport {
        return AuditReport{
            .total_accesses = self.access_history.items.len,
            .allocation_stats = try self.allocation_tracking.get_statistics(),
            .bounds_violations = self.bounds_checking.get_violation_count(),
            .pattern_anomalies = try self.memory_patterns.get_anomalies(),
            .memory_leaks = try self.allocation_tracking.detect_leaks(),
            .peak_memory_usage = self.allocation_tracking.get_peak_usage(),
        };
    }
    
    const MAX_SAFE_STACK_SIZE = 1024 * 32; // 32KB stack
    const MAX_MEMORY_EXPANSION_RATIO = 4.0;
    const MAX_MEMORY_SIZE = 128 * 1024 * 1024; // 128MB
};
```

#### 2. Allocation Tracking System
```zig
pub const AllocationTracking = struct {
    allocator: std.mem.Allocator,
    config: MemoryAccessMonitor.AuditConfig,
    active_allocations: std.HashMap(usize, AllocationInfo, std.hash_map.AutoContext(usize), std.hash_map.default_max_load_percentage),
    allocation_stats: AllocationStatistics,
    leak_detector: LeakDetector,
    
    pub const AllocationInfo = struct {
        size: usize,
        timestamp: i64,
        context: MemoryAccessMonitor.MemoryAccess.AccessContext,
        stack_trace: ?[]const usize,
        lifetime_ms: i64,
        
        pub fn is_leaked(self: *const AllocationInfo, current_time: i64) bool {
            const age_ms = current_time - self.timestamp;
            return age_ms > LEAK_DETECTION_THRESHOLD_MS;
        }
        
        const LEAK_DETECTION_THRESHOLD_MS = 60000; // 1 minute
    };
    
    pub const AllocationStatistics = struct {
        total_allocations: u64,
        total_deallocations: u64,
        total_bytes_allocated: u64,
        total_bytes_deallocated: u64,
        peak_concurrent_allocations: u64,
        peak_memory_usage: u64,
        current_memory_usage: u64,
        average_allocation_size: f64,
        allocation_frequency: f64,
        
        pub fn init() AllocationStatistics {
            return std.mem.zeroes(AllocationStatistics);
        }
        
        pub fn update_allocation(self: *AllocationStatistics, size: usize) void {
            self.total_allocations += 1;
            self.total_bytes_allocated += size;
            self.current_memory_usage += size;
            
            if (self.current_memory_usage > self.peak_memory_usage) {
                self.peak_memory_usage = self.current_memory_usage;
            }
            
            self.average_allocation_size = @as(f64, @floatFromInt(self.total_bytes_allocated)) / @as(f64, @floatFromInt(self.total_allocations));
        }
        
        pub fn update_deallocation(self: *AllocationStatistics, size: usize) void {
            self.total_deallocations += 1;
            self.total_bytes_deallocated += size;
            if (self.current_memory_usage >= size) {
                self.current_memory_usage -= size;
            }
        }
        
        pub fn get_memory_efficiency(self: *const AllocationStatistics) f64 {
            return if (self.total_bytes_allocated > 0)
                @as(f64, @floatFromInt(self.total_bytes_deallocated)) / @as(f64, @floatFromInt(self.total_bytes_allocated))
            else
                0.0;
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: MemoryAccessMonitor.AuditConfig) AllocationTracking {
        return AllocationTracking{
            .allocator = allocator,
            .config = config,
            .active_allocations = std.HashMap(usize, AllocationInfo, std.hash_map.AutoContext(usize), std.hash_map.default_max_load_percentage).init(allocator),
            .allocation_stats = AllocationStatistics.init(),
            .leak_detector = LeakDetector.init(allocator),
        };
    }
    
    pub fn deinit(self: *AllocationTracking) void {
        // Clean up stack traces
        var iterator = self.active_allocations.iterator();
        while (iterator.next()) |entry| {
            if (entry.value_ptr.stack_trace) |trace| {
                self.allocator.free(trace);
            }
        }
        
        self.active_allocations.deinit();
        self.leak_detector.deinit();
    }
    
    pub fn track_access(
        self: *AllocationTracking,
        access_type: MemoryAccessMonitor.MemoryAccess.AccessType,
        address: usize,
        size: usize
    ) !void {
        switch (access_type) {
            .Allocate => try self.track_allocation(address, size),
            .Deallocate => try self.track_deallocation(address),
            .Read, .Write => try self.track_access_to_allocation(address, size),
            .Expand => try self.track_expansion(address, size),
            .Shrink => try self.track_shrink(address, size),
        }
    }
    
    fn track_allocation(self: *AllocationTracking, address: usize, size: usize) !void {
        const context = MemoryAccessMonitor.MemoryAccess.AccessContext{
            .operation = "allocation",
            .pc = 0,
            .frame_depth = 0,
            .vm_context = "memory_allocator",
        };
        
        const allocation_info = AllocationInfo{
            .size = size,
            .timestamp = std.time.milliTimestamp(),
            .context = context,
            .stack_trace = null, // Would capture if enabled
            .lifetime_ms = 0,
        };
        
        try self.active_allocations.put(address, allocation_info);
        self.allocation_stats.update_allocation(size);
        
        try self.leak_detector.register_allocation(address, size);
    }
    
    fn track_deallocation(self: *AllocationTracking, address: usize) !void {
        if (self.active_allocations.get(address)) |allocation_info| {
            self.allocation_stats.update_deallocation(allocation_info.size);
            
            // Calculate lifetime
            const current_time = std.time.milliTimestamp();
            const lifetime = current_time - allocation_info.timestamp;
            
            // Clean up stack trace
            if (allocation_info.stack_trace) |trace| {
                self.allocator.free(trace);
            }
            
            _ = self.active_allocations.remove(address);
            try self.leak_detector.unregister_allocation(address, @as(i64, @intCast(lifetime)));
        } else {
            // Double-free or invalid free
            return MemorySafetyError.InvalidDeallocation;
        }
    }
    
    fn track_access_to_allocation(self: *AllocationTracking, address: usize, size: usize) !void {
        // Find which allocation this access belongs to
        var found_allocation = false;
        var iterator = self.active_allocations.iterator();
        
        while (iterator.next()) |entry| {
            const alloc_start = entry.key_ptr.*;
            const alloc_end = alloc_start + entry.value_ptr.size;
            
            if (address >= alloc_start and address + size <= alloc_end) {
                found_allocation = true;
                break;
            }
        }
        
        if (!found_allocation) {
            // Access to unallocated memory
            return MemorySafetyError.UseAfterFree;
        }
    }
    
    pub fn detect_leaks(self: *AllocationTracking) ![]const MemoryLeak {
        return self.leak_detector.detect_leaks();
    }
    
    pub fn get_statistics(self: *const AllocationTracking) AllocationStatistics {
        return self.allocation_stats;
    }
    
    pub fn get_peak_usage(self: *const AllocationTracking) usize {
        return self.allocation_stats.peak_memory_usage;
    }
};

pub const LeakDetector = struct {
    allocator: std.mem.Allocator,
    tracked_allocations: std.ArrayList(TrackedAllocation),
    suspected_leaks: std.ArrayList(MemoryLeak),
    
    pub const TrackedAllocation = struct {
        address: usize,
        size: usize,
        timestamp: i64,
        access_count: u32,
        last_access: i64,
    };
    
    pub fn init(allocator: std.mem.Allocator) LeakDetector {
        return LeakDetector{
            .allocator = allocator,
            .tracked_allocations = std.ArrayList(TrackedAllocation).init(allocator),
            .suspected_leaks = std.ArrayList(MemoryLeak).init(allocator),
        };
    }
    
    pub fn deinit(self: *LeakDetector) void {
        self.tracked_allocations.deinit();
        self.suspected_leaks.deinit();
    }
    
    pub fn register_allocation(self: *LeakDetector, address: usize, size: usize) !void {
        const tracked = TrackedAllocation{
            .address = address,
            .size = size,
            .timestamp = std.time.milliTimestamp(),
            .access_count = 0,
            .last_access = std.time.milliTimestamp(),
        };
        
        try self.tracked_allocations.append(tracked);
    }
    
    pub fn unregister_allocation(self: *LeakDetector, address: usize, lifetime: i64) !void {
        for (self.tracked_allocations.items, 0..) |allocation, i| {
            if (allocation.address == address) {
                _ = self.tracked_allocations.swapRemove(i);
                break;
            }
        }
    }
    
    pub fn detect_leaks(self: *LeakDetector) ![]const MemoryLeak {
        self.suspected_leaks.clearRetainingCapacity();
        
        const current_time = std.time.milliTimestamp();
        
        for (self.tracked_allocations.items) |allocation| {
            const age = current_time - allocation.timestamp;
            const idle_time = current_time - allocation.last_access;
            
            // Heuristics for leak detection
            if (age > LEAK_AGE_THRESHOLD and 
                idle_time > LEAK_IDLE_THRESHOLD and
                allocation.access_count < MIN_ACCESS_COUNT) {
                
                const leak = MemoryLeak{
                    .address = allocation.address,
                    .size = allocation.size,
                    .age_ms = age,
                    .idle_time_ms = idle_time,
                    .access_count = allocation.access_count,
                    .leak_confidence = calculate_leak_confidence(allocation),
                };
                
                try self.suspected_leaks.append(leak);
            }
        }
        
        return self.suspected_leaks.items;
    }
    
    fn calculate_leak_confidence(allocation: TrackedAllocation) f64 {
        const current_time = std.time.milliTimestamp();
        const age = @as(f64, @floatFromInt(current_time - allocation.timestamp));
        const idle_time = @as(f64, @floatFromInt(current_time - allocation.last_access));
        const access_frequency = @as(f64, @floatFromInt(allocation.access_count)) / age;
        
        // Higher confidence for older, rarely accessed allocations
        var confidence: f64 = 0.0;
        
        // Age factor (older = more suspicious)
        confidence += @min(age / LEAK_AGE_THRESHOLD, 1.0) * 0.4;
        
        // Idle factor (longer idle = more suspicious)
        confidence += @min(idle_time / LEAK_IDLE_THRESHOLD, 1.0) * 0.4;
        
        // Access frequency factor (less frequent = more suspicious)
        confidence += (1.0 - @min(access_frequency * 1000, 1.0)) * 0.2;
        
        return @min(confidence, 1.0);
    }
    
    const LEAK_AGE_THRESHOLD = 300000; // 5 minutes
    const LEAK_IDLE_THRESHOLD = 60000; // 1 minute
    const MIN_ACCESS_COUNT = 5;
};

pub const MemoryLeak = struct {
    address: usize,
    size: usize,
    age_ms: i64,
    idle_time_ms: i64,
    access_count: u32,
    leak_confidence: f64,
    
    pub fn is_likely_leak(self: *const MemoryLeak) bool {
        return self.leak_confidence > 0.7;
    }
};
```

#### 3. Memory Pattern Detection
```zig
pub const MemoryPatternDetection = struct {
    allocator: std.mem.Allocator,
    config: MemoryAccessMonitor.AuditConfig,
    access_patterns: std.ArrayList(AccessPattern),
    anomaly_detector: AnomalyDetector,
    
    pub const AccessPattern = struct {
        pattern_type: PatternType,
        frequency: u32,
        last_occurrence: i64,
        severity: Severity,
        description: []const u8,
        
        pub const PatternType = enum {
            BufferOverflow,
            UseAfterFree,
            MemoryLeak,
            DoubleFree,
            StackOverflow,
            HeapCorruption,
            WildPointer,
            MemoryFragmentation,
        };
        
        pub const Severity = enum {
            Low,
            Medium,
            High,
            Critical,
        };
    };
    
    pub fn init(allocator: std.mem.Allocator, config: MemoryAccessMonitor.AuditConfig) MemoryPatternDetection {
        return MemoryPatternDetection{
            .allocator = allocator,
            .config = config,
            .access_patterns = std.ArrayList(AccessPattern).init(allocator),
            .anomaly_detector = AnomalyDetector.init(allocator),
        };
    }
    
    pub fn deinit(self: *MemoryPatternDetection) void {
        for (self.access_patterns.items) |pattern| {
            self.allocator.free(pattern.description);
        }
        self.access_patterns.deinit();
        self.anomaly_detector.deinit();
    }
    
    pub fn analyze_access(
        self: *MemoryPatternDetection,
        access_type: MemoryAccessMonitor.MemoryAccess.AccessType,
        address: usize,
        size: usize,
        context: MemoryAccessMonitor.MemoryAccess.AccessContext
    ) !void {
        if (!self.config.enable_pattern_detection) return;
        
        // Detect various patterns
        try self.detect_buffer_overflow(address, size, context);
        try self.detect_memory_access_patterns(access_type, address, size);
        try self.anomaly_detector.record_access(access_type, address, size);
        
        // Update existing pattern frequencies
        try self.update_pattern_frequencies();
    }
    
    fn detect_buffer_overflow(
        self: *MemoryPatternDetection,
        address: usize,
        size: usize,
        context: MemoryAccessMonitor.MemoryAccess.AccessContext
    ) !void {
        // Check for suspicious access patterns that might indicate buffer overflow
        if (size > SUSPICIOUS_ACCESS_SIZE or 
            address == 0 or 
            address > MAX_REASONABLE_ADDRESS) {
            
            const pattern = AccessPattern{
                .pattern_type = .BufferOverflow,
                .frequency = 1,
                .last_occurrence = std.time.milliTimestamp(),
                .severity = .High,
                .description = try std.fmt.allocPrint(self.allocator, 
                    "Suspicious memory access at 0x{x}, size {}, operation: {s}", 
                    .{ address, size, context.operation }),
            };
            
            try self.add_or_update_pattern(pattern);
        }
    }
    
    fn detect_memory_access_patterns(
        self: *MemoryPatternDetection,
        access_type: MemoryAccessMonitor.MemoryAccess.AccessType,
        address: usize,
        size: usize
    ) !void {
        // Detect sequential access patterns
        if (self.anomaly_detector.is_sequential_access(address, size)) {
            // This might be normal or could indicate a leak pattern
        }
        
        // Detect repeated access to same location
        if (self.anomaly_detector.is_repeated_access(address)) {
            // Could indicate inefficient code or potential issue
        }
        
        // Detect unusual allocation sizes
        if (access_type == .Allocate and self.anomaly_detector.is_unusual_size(size)) {
            const pattern = AccessPattern{
                .pattern_type = .MemoryFragmentation,
                .frequency = 1,
                .last_occurrence = std.time.milliTimestamp(),
                .severity = .Medium,
                .description = try std.fmt.allocPrint(self.allocator, 
                    "Unusual allocation size: {} bytes", .{size}),
            };
            
            try self.add_or_update_pattern(pattern);
        }
    }
    
    fn add_or_update_pattern(self: *MemoryPatternDetection, new_pattern: AccessPattern) !void {
        // Check if pattern already exists
        for (self.access_patterns.items) |*pattern| {
            if (pattern.pattern_type == new_pattern.pattern_type and
                std.mem.eql(u8, pattern.description, new_pattern.description)) {
                
                pattern.frequency += 1;
                pattern.last_occurrence = new_pattern.last_occurrence;
                
                // Free the new description since we're reusing the existing one
                self.allocator.free(new_pattern.description);
                return;
            }
        }
        
        // Add new pattern
        try self.access_patterns.append(new_pattern);
    }
    
    fn update_pattern_frequencies(self: *MemoryPatternDetection) !void {
        const current_time = std.time.milliTimestamp();
        
        // Decay pattern frequencies over time
        for (self.access_patterns.items) |*pattern| {
            const age = current_time - pattern.last_occurrence;
            if (age > PATTERN_DECAY_TIME) {
                if (pattern.frequency > 1) {
                    pattern.frequency -= 1;
                }
            }
        }
    }
    
    pub fn get_anomalies(self: *MemoryPatternDetection) ![]const AccessPattern {
        var anomalies = std.ArrayList(AccessPattern).init(self.allocator);
        defer anomalies.deinit();
        
        for (self.access_patterns.items) |pattern| {
            if (pattern.severity == .High or pattern.severity == .Critical or
                pattern.frequency > ANOMALY_FREQUENCY_THRESHOLD) {
                try anomalies.append(pattern);
            }
        }
        
        return anomalies.toOwnedSlice();
    }
    
    const SUSPICIOUS_ACCESS_SIZE = 1024 * 1024; // 1MB
    const MAX_REASONABLE_ADDRESS = 0x7FFFFFFF;
    const PATTERN_DECAY_TIME = 60000; // 1 minute
    const ANOMALY_FREQUENCY_THRESHOLD = 10;
};

pub const AnomalyDetector = struct {
    allocator: std.mem.Allocator,
    recent_accesses: std.ArrayList(AccessRecord),
    size_statistics: SizeStatistics,
    
    pub const AccessRecord = struct {
        address: usize,
        size: usize,
        timestamp: i64,
    };
    
    pub const SizeStatistics = struct {
        total_accesses: u64,
        size_sum: u64,
        size_squared_sum: u64,
        min_size: usize,
        max_size: usize,
        
        pub fn init() SizeStatistics {
            return SizeStatistics{
                .total_accesses = 0,
                .size_sum = 0,
                .size_squared_sum = 0,
                .min_size = std.math.maxInt(usize),
                .max_size = 0,
            };
        }
        
        pub fn update(self: *SizeStatistics, size: usize) void {
            self.total_accesses += 1;
            self.size_sum += size;
            self.size_squared_sum += size * size;
            self.min_size = @min(self.min_size, size);
            self.max_size = @max(self.max_size, size);
        }
        
        pub fn get_mean(self: *const SizeStatistics) f64 {
            return if (self.total_accesses > 0)
                @as(f64, @floatFromInt(self.size_sum)) / @as(f64, @floatFromInt(self.total_accesses))
            else
                0.0;
        }
        
        pub fn get_std_deviation(self: *const SizeStatistics) f64 {
            if (self.total_accesses <= 1) return 0.0;
            
            const mean = self.get_mean();
            const variance = (@as(f64, @floatFromInt(self.size_squared_sum)) / @as(f64, @floatFromInt(self.total_accesses))) - (mean * mean);
            return @sqrt(variance);
        }
    };
    
    pub fn init(allocator: std.mem.Allocator) AnomalyDetector {
        return AnomalyDetector{
            .allocator = allocator,
            .recent_accesses = std.ArrayList(AccessRecord).init(allocator),
            .size_statistics = SizeStatistics.init(),
        };
    }
    
    pub fn deinit(self: *AnomalyDetector) void {
        self.recent_accesses.deinit();
    }
    
    pub fn record_access(
        self: *AnomalyDetector,
        access_type: MemoryAccessMonitor.MemoryAccess.AccessType,
        address: usize,
        size: usize
    ) !void {
        const record = AccessRecord{
            .address = address,
            .size = size,
            .timestamp = std.time.milliTimestamp(),
        };
        
        // Maintain sliding window of recent accesses
        if (self.recent_accesses.items.len >= MAX_RECENT_ACCESSES) {
            _ = self.recent_accesses.orderedRemove(0);
        }
        
        try self.recent_accesses.append(record);
        self.size_statistics.update(size);
    }
    
    pub fn is_sequential_access(self: *AnomalyDetector, address: usize, size: usize) bool {
        if (self.recent_accesses.items.len < 2) return false;
        
        const last_access = self.recent_accesses.items[self.recent_accesses.items.len - 1];
        const expected_address = last_access.address + last_access.size;
        
        return address == expected_address;
    }
    
    pub fn is_repeated_access(self: *AnomalyDetector, address: usize) bool {
        var count: u32 = 0;
        
        for (self.recent_accesses.items) |access| {
            if (access.address == address) {
                count += 1;
                if (count >= REPEATED_ACCESS_THRESHOLD) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    pub fn is_unusual_size(self: *AnomalyDetector, size: usize) bool {
        if (self.size_statistics.total_accesses < MIN_SAMPLES_FOR_ANALYSIS) {
            return false;
        }
        
        const mean = self.size_statistics.get_mean();
        const std_dev = self.size_statistics.get_std_deviation();
        const size_f64 = @as(f64, @floatFromInt(size));
        
        // Consider sizes more than 3 standard deviations from mean as unusual
        return @abs(size_f64 - mean) > 3.0 * std_dev;
    }
    
    const MAX_RECENT_ACCESSES = 1000;
    const REPEATED_ACCESS_THRESHOLD = 5;
    const MIN_SAMPLES_FOR_ANALYSIS = 50;
};
```

#### 4. Memory Safety Error Types
```zig
pub const MemorySafetyError = error{
    // Bounds checking errors
    StackBoundsViolation,
    StackOverflowRisk,
    StackUnderflowDetected,
    MemoryBoundsViolation,
    BufferOverflow,
    BufferUnderflow,
    
    // Allocation errors
    InvalidDeallocation,
    DoubleFree,
    UseAfterFree,
    MemoryLeakDetected,
    AllocationFailure,
    
    // Memory access errors
    NullPointerAccess,
    WildPointerAccess,
    AlignmentViolation,
    UnauthorizedAccess,
    
    // Memory integrity errors
    MemoryCorruption,
    ExcessiveMemoryExpansion,
    MemorySizeLimit,
    MemoryFragmentation,
    
    // System errors
    AuditSystemFailure,
    InsufficientPrivileges,
    ResourceExhaustion,
};

pub const AuditReport = struct {
    total_accesses: usize,
    allocation_stats: AllocationTracking.AllocationStatistics,
    bounds_violations: u64,
    pattern_anomalies: []const MemoryPatternDetection.AccessPattern,
    memory_leaks: []const MemoryLeak,
    peak_memory_usage: usize,
    audit_timestamp: i64,
    
    pub fn init() AuditReport {
        return AuditReport{
            .total_accesses = 0,
            .allocation_stats = AllocationTracking.AllocationStatistics.init(),
            .bounds_violations = 0,
            .pattern_anomalies = &[_]MemoryPatternDetection.AccessPattern{},
            .memory_leaks = &[_]MemoryLeak{},
            .peak_memory_usage = 0,
            .audit_timestamp = std.time.milliTimestamp(),
        };
    }
    
    pub fn print_summary(self: *const AuditReport) void {
        std.log.info("=== MEMORY SAFETY AUDIT REPORT ===");
        std.log.info("Total memory accesses: {}", .{self.total_accesses});
        std.log.info("Peak memory usage: {} bytes", .{self.peak_memory_usage});
        std.log.info("Bounds violations: {}", .{self.bounds_violations});
        std.log.info("Pattern anomalies: {}", .{self.pattern_anomalies.len});
        std.log.info("Suspected memory leaks: {}", .{self.memory_leaks.len});
        std.log.info("Memory efficiency: {d:.2}%", .{self.allocation_stats.get_memory_efficiency() * 100.0});
        std.log.info("Average allocation size: {d:.2} bytes", .{self.allocation_stats.average_allocation_size});
        
        if (self.memory_leaks.len > 0) {
            std.log.warn("MEMORY LEAKS DETECTED:");
            for (self.memory_leaks) |leak| {
                std.log.warn("  Leak at 0x{x}: {} bytes, confidence: {d:.2}%", 
                    .{ leak.address, leak.size, leak.leak_confidence * 100.0 });
            }
        }
        
        if (self.pattern_anomalies.len > 0) {
            std.log.warn("PATTERN ANOMALIES:");
            for (self.pattern_anomalies) |anomaly| {
                std.log.warn("  {s}: {s} (frequency: {})", 
                    .{ @tagName(anomaly.pattern_type), anomaly.description, anomaly.frequency });
            }
        }
    }
    
    pub fn get_overall_safety_score(self: *const AuditReport) f64 {
        var score: f64 = 100.0; // Start with perfect score
        
        // Deduct for violations
        score -= @as(f64, @floatFromInt(self.bounds_violations)) * 5.0;
        
        // Deduct for memory leaks
        for (self.memory_leaks) |leak| {
            score -= leak.leak_confidence * 10.0;
        }
        
        // Deduct for anomalies
        for (self.pattern_anomalies) |anomaly| {
            const severity_multiplier: f64 = switch (anomaly.severity) {
                .Low => 1.0,
                .Medium => 2.0,
                .High => 5.0,
                .Critical => 10.0,
            };
            score -= severity_multiplier;
        }
        
        // Deduct for memory inefficiency
        const efficiency = self.allocation_stats.get_memory_efficiency();
        if (efficiency < 0.9) {
            score -= (0.9 - efficiency) * 20.0;
        }
        
        return @max(score, 0.0);
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Comprehensive Monitoring**: Track all memory operations and access patterns
2. **Real-time Analysis**: Detect issues as they occur during execution
3. **Pattern Recognition**: Identify common memory safety violations
4. **Leak Detection**: Sophisticated leak detection with confidence scoring
5. **Performance Monitoring**: Track memory usage and allocation patterns
6. **Detailed Reporting**: Generate comprehensive audit reports with actionable insights

## Implementation Tasks

### Task 1: Implement Core Memory Auditing System
File: `/src/evm/memory_safety/memory_auditor.zig`
```zig
const std = @import("std");
const MemoryAccessMonitor = @import("memory_access_monitor.zig").MemoryAccessMonitor;
const AllocationTracking = @import("allocation_tracking.zig").AllocationTracking;
const MemoryPatternDetection = @import("memory_pattern_detection.zig").MemoryPatternDetection;
const MemorySafetyError = @import("memory_safety_error.zig").MemorySafetyError;
const AuditReport = @import("audit_report.zig").AuditReport;

pub const MemoryAuditor = struct {
    allocator: std.mem.Allocator,
    monitor: MemoryAccessMonitor,
    enabled: bool,
    
    pub fn init(allocator: std.mem.Allocator, config: MemoryAccessMonitor.AuditConfig) MemoryAuditor {
        return MemoryAuditor{
            .allocator = allocator,
            .monitor = MemoryAccessMonitor.init(allocator, config),
            .enabled = config.audit_level != .Disabled,
        };
    }
    
    pub fn deinit(self: *MemoryAuditor) void {
        self.monitor.deinit();
    }
    
    pub fn enable(self: *MemoryAuditor) void {
        self.enabled = true;
    }
    
    pub fn disable(self: *MemoryAuditor) void {
        self.enabled = false;
    }
    
    pub fn audit_stack_operation(
        self: *MemoryAuditor,
        operation: []const u8,
        stack_ptr: usize,
        stack_size: usize,
        access_details: StackAccessDetails
    ) !void {
        if (!self.enabled) return;
        
        const context = MemoryAccessMonitor.MemoryAccess.AccessContext{
            .operation = operation,
            .pc = access_details.pc,
            .frame_depth = access_details.frame_depth,
            .vm_context = "stack_operation",
        };
        
        try self.monitor.audit_stack_access(
            stack_ptr,
            stack_size,
            access_details.offset,
            access_details.size,
            context
        );
    }
    
    pub fn audit_memory_operation(
        self: *MemoryAuditor,
        operation: []const u8,
        memory_details: MemoryAccessDetails
    ) !void {
        if (!self.enabled) return;
        
        const context = MemoryAccessMonitor.MemoryAccess.AccessContext{
            .operation = operation,
            .pc = memory_details.pc,
            .frame_depth = memory_details.frame_depth,
            .vm_context = "memory_operation",
        };
        
        try self.monitor.audit_memory_access(
            memory_details.access_type,
            memory_details.address,
            memory_details.size,
            context
        );
    }
    
    pub fn audit_memory_expansion(
        self: *MemoryAuditor,
        old_size: usize,
        new_size: usize,
        expansion_context: ExpansionContext
    ) !void {
        if (!self.enabled) return;
        
        const context = MemoryAccessMonitor.MemoryAccess.AccessContext{
            .operation = "memory_expansion",
            .pc = expansion_context.pc,
            .frame_depth = expansion_context.frame_depth,
            .vm_context = expansion_context.operation,
        };
        
        try self.monitor.audit_memory_expansion(old_size, new_size, context);
    }
    
    pub fn generate_report(self: *MemoryAuditor) !AuditReport {
        return self.monitor.generate_audit_report();
    }
    
    pub const StackAccessDetails = struct {
        pc: u32,
        frame_depth: u32,
        offset: usize,
        size: usize,
    };
    
    pub const MemoryAccessDetails = struct {
        pc: u32,
        frame_depth: u32,
        access_type: MemoryAccessMonitor.MemoryAccess.AccessType,
        address: usize,
        size: usize,
    };
    
    pub const ExpansionContext = struct {
        pc: u32,
        frame_depth: u32,
        operation: []const u8,
    };
};
```

### Task 2: Integrate with VM and Memory Systems
File: `/src/evm/vm.zig` (modify existing)
```zig
const MemoryAuditor = @import("memory_safety/memory_auditor.zig").MemoryAuditor;
const MemoryAccessMonitor = @import("memory_safety/memory_access_monitor.zig").MemoryAccessMonitor;

pub const Vm = struct {
    // Existing fields...
    memory_auditor: ?MemoryAuditor,
    audit_enabled: bool,
    
    pub fn init(allocator: std.mem.Allocator, chain_id: u64) !Vm {
        var vm = Vm{
            // Existing initialization...
            .memory_auditor = null,
            .audit_enabled = false,
        };
        
        return vm;
    }
    
    pub fn enable_memory_auditing(
        self: *Vm,
        config: MemoryAccessMonitor.AuditConfig
    ) !void {
        self.memory_auditor = MemoryAuditor.init(self.allocator, config);
        self.audit_enabled = true;
    }
    
    pub fn disable_memory_auditing(self: *Vm) void {
        if (self.memory_auditor) |*auditor| {
            auditor.deinit();
            self.memory_auditor = null;
        }
        self.audit_enabled = false;
    }
    
    pub fn get_memory_audit_report(self: *Vm) !?MemoryAuditor.AuditReport {
        if (self.memory_auditor) |*auditor| {
            return auditor.generate_report();
        }
        return null;
    }
    
    // Audit stack operations
    fn audit_stack_operation(
        self: *Vm,
        operation: []const u8,
        frame: *Frame
    ) void {
        if (self.memory_auditor) |*auditor| {
            const details = MemoryAuditor.StackAccessDetails{
                .pc = frame.pc,
                .frame_depth = self.call_depth,
                .offset = 0, // Would be calculated based on operation
                .size = 32, // Most operations are 32 bytes
            };
            
            auditor.audit_stack_operation(
                operation,
                @intFromPtr(frame.stack.items.ptr),
                frame.stack.items.len * 32,
                details
            ) catch |err| {
                std.log.warn("Memory audit failed for stack operation {s}: {}", .{ operation, err });
            };
        }
    }
    
    // Audit memory operations
    fn audit_memory_operation(
        self: *Vm,
        operation: []const u8,
        frame: *Frame,
        address: usize,
        size: usize,
        access_type: MemoryAccessMonitor.MemoryAccess.AccessType
    ) void {
        if (self.memory_auditor) |*auditor| {
            const details = MemoryAuditor.MemoryAccessDetails{
                .pc = frame.pc,
                .frame_depth = self.call_depth,
                .access_type = access_type,
                .address = address,
                .size = size,
            };
            
            auditor.audit_memory_operation(operation, details) catch |err| {
                std.log.warn("Memory audit failed for memory operation {s}: {}", .{ operation, err });
            };
        }
    }
};
```

### Task 3: Implement Memory Safety Hooks
File: `/src/evm/memory.zig` (modify existing)
```zig
// Add auditing hooks to memory operations
pub fn expand_with_audit(
    self: *Memory,
    new_size: u64,
    auditor: ?*MemoryAuditor,
    context: MemoryAuditor.ExpansionContext
) !void {
    const old_size = self.data.items.len;
    
    // Audit the expansion
    if (auditor) |audit| {
        try audit.audit_memory_expansion(old_size, @as(usize, new_size), context);
    }
    
    // Perform normal expansion
    try self.expand(new_size);
}

pub fn store_with_audit(
    self: *Memory,
    offset: u64,
    value: []const u8,
    auditor: ?*MemoryAuditor,
    pc: u32,
    frame_depth: u32
) !void {
    // Audit the memory write
    if (auditor) |audit| {
        const details = MemoryAuditor.MemoryAccessDetails{
            .pc = pc,
            .frame_depth = frame_depth,
            .access_type = .Write,
            .address = @as(usize, offset),
            .size = value.len,
        };
        
        try audit.audit_memory_operation("MSTORE", details);
    }
    
    // Perform normal store
    try self.store(offset, value);
}

pub fn load_with_audit(
    self: *Memory,
    offset: u64,
    size: u64,
    auditor: ?*MemoryAuditor,
    pc: u32,
    frame_depth: u32
) ![]const u8 {
    // Audit the memory read
    if (auditor) |audit| {
        const details = MemoryAuditor.MemoryAccessDetails{
            .pc = pc,
            .frame_depth = frame_depth,
            .access_type = .Read,
            .address = @as(usize, offset),
            .size = @as(usize, size),
        };
        
        try audit.audit_memory_operation("MLOAD", details);
    }
    
    // Perform normal load
    return self.load(offset, size);
}
```

## Testing Requirements

### Test File
Create `/test/evm/memory_safety/memory_safety_auditing_test.zig`

### Test Cases
```zig
test "memory auditor initialization and configuration" {
    // Test auditor creation with different configs
    // Test enable/disable functionality
    // Test configuration validation
}

test "stack access auditing" {
    // Test stack bounds checking
    // Test stack overflow detection
    // Test stack underflow detection
}

test "memory access pattern detection" {
    // Test buffer overflow detection
    // Test use-after-free detection
    // Test memory leak detection
}

test "allocation tracking and leak detection" {
    // Test allocation tracking accuracy
    // Test leak detection algorithms
    // Test leak confidence scoring
}

test "audit report generation" {
    // Test report completeness
    // Test report accuracy
    // Test safety score calculation
}

test "integration with VM operations" {
    // Test VM integration
    // Test performance impact
    // Test error isolation
}

test "memory safety violation detection" {
    // Test various violation scenarios
    // Test violation reporting
    // Test recovery mechanisms
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/memory_safety/memory_auditor.zig` - Main auditing coordinator
- `/src/evm/memory_safety/memory_access_monitor.zig` - Memory access monitoring
- `/src/evm/memory_safety/allocation_tracking.zig` - Allocation and leak tracking
- `/src/evm/memory_safety/memory_pattern_detection.zig` - Pattern analysis
- `/src/evm/memory_safety/bounds_checking.zig` - Additional bounds validation
- `/src/evm/memory_safety/memory_safety_error.zig` - Memory safety error types
- `/src/evm/memory_safety/audit_report.zig` - Audit reporting system
- `/src/evm/vm.zig` - VM integration with auditing
- `/src/evm/memory.zig` - Memory system auditing hooks
- `/src/evm/stack/stack.zig` - Stack auditing integration
- `/test/evm/memory_safety/memory_safety_auditing_test.zig` - Comprehensive tests

## Success Criteria

1. **Comprehensive Monitoring**: Detect all classes of memory safety violations
2. **Accurate Detection**: High precision with minimal false positives
3. **Performance**: <5% overhead when enabled, zero overhead when disabled
4. **Integration**: Seamless integration with existing VM components
5. **Reporting**: Detailed, actionable audit reports with safety scoring
6. **Configurability**: Flexible configuration for different use cases and environments

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Zero performance impact when disabled** - No overhead for production use
3. **Memory safety** - Auditing system must not introduce memory issues
4. **Error isolation** - Auditing failures must not crash VM execution
5. **Accurate detection** - Minimize false positives while catching real issues
6. **Comprehensive coverage** - Monitor all memory operations and patterns

## References

- [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) - Memory error detector inspiration
- [Valgrind Memcheck](https://valgrind.org/docs/manual/mc-manual.html) - Memory debugging tool
- [Intel Inspector](https://www.intel.com/content/www/us/en/develop/documentation/inspector-user-guide-linux/) - Memory and threading error checker
- [LLVM MemorySanitizer](https://clang.llvm.org/docs/MemorySanitizer.html) - Uninitialized memory detector
- [Google Sanitizers](https://github.com/google/sanitizers) - Family of memory safety tools