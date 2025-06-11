# Implement Precompile Backend Selection

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_precompile_backend_selection` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_precompile_backend_selection feat_implement_precompile_backend_selection`
3. **Work in isolation**: `cd g/feat_implement_precompile_backend_selection`
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

Implement comprehensive precompile backend selection system that dynamically chooses optimal cryptographic implementations based on input characteristics, runtime environment detection, and performance profiling. This includes native optimized backends, fallback implementations, adaptive switching mechanisms, and performance monitoring to ensure maximum efficiency across different deployment scenarios.

## ELI5

This is like having a smart transmission in a car that automatically chooses the best gear based on road conditions, engine load, and driving style. For cryptographic operations (like verifying signatures), this system detects what platform you're running on and automatically selects the fastest available implementation - whether that's a hardware-accelerated version, an optimized software version, or a reliable fallback. It continuously monitors performance and adapts to ensure you always get the best possible speed for crypto operations.

## Precompile Backend Selection Specifications

### Core Backend Selection Framework

#### 1. Backend Manager
```zig
pub const PrecompileBackendManager = struct {
    allocator: std.mem.Allocator,
    config: BackendConfig,
    backends: BackendRegistry,
    performance_profiler: PerformanceProfiler,
    runtime_detector: RuntimeDetector,
    adaptive_selector: AdaptiveSelector,
    backend_cache: BackendCache,
    
    pub const BackendConfig = struct {
        enable_backend_selection: bool,
        enable_runtime_detection: bool,
        enable_adaptive_switching: bool,
        enable_performance_profiling: bool,
        enable_backend_caching: bool,
        fallback_strategy: FallbackStrategy,
        selection_criteria: SelectionCriteria,
        profiling_window: u32,
        cache_timeout_ms: u64,
        
        pub const FallbackStrategy = enum {
            Pure,           // Pure Zig implementation (always available)
            Native,         // Native optimized implementation
            Hardware,       // Hardware-accelerated implementation
            Hybrid,         // Mixed approach based on input size
            Fastest,        // Always use fastest available
            Most_Reliable,  // Prioritize reliability over speed
        };
        
        pub const SelectionCriteria = struct {
            input_size_threshold: usize,
            performance_weight: f64,
            reliability_weight: f64,
            memory_usage_weight: f64,
            startup_cost_weight: f64,
            
            pub fn balanced() SelectionCriteria {
                return SelectionCriteria{
                    .input_size_threshold = 1024,
                    .performance_weight = 0.4,
                    .reliability_weight = 0.3,
                    .memory_usage_weight = 0.2,
                    .startup_cost_weight = 0.1,
                };
            }
            
            pub fn performance_focused() SelectionCriteria {
                return SelectionCriteria{
                    .input_size_threshold = 512,
                    .performance_weight = 0.7,
                    .reliability_weight = 0.2,
                    .memory_usage_weight = 0.05,
                    .startup_cost_weight = 0.05,
                };
            }
            
            pub fn reliability_focused() SelectionCriteria {
                return SelectionCriteria{
                    .input_size_threshold = 2048,
                    .performance_weight = 0.2,
                    .reliability_weight = 0.6,
                    .memory_usage_weight = 0.1,
                    .startup_cost_weight = 0.1,
                };
            }
        };
        
        pub fn production() BackendConfig {
            return BackendConfig{
                .enable_backend_selection = true,
                .enable_runtime_detection = true,
                .enable_adaptive_switching = true,
                .enable_performance_profiling = true,
                .enable_backend_caching = true,
                .fallback_strategy = .Hybrid,
                .selection_criteria = SelectionCriteria.balanced(),
                .profiling_window = 1000,
                .cache_timeout_ms = 60000, // 60 seconds
            };
        }
        
        pub fn development() BackendConfig {
            return BackendConfig{
                .enable_backend_selection = true,
                .enable_runtime_detection = true,
                .enable_adaptive_switching = true,
                .enable_performance_profiling = true,
                .enable_backend_caching = false,
                .fallback_strategy = .Fastest,
                .selection_criteria = SelectionCriteria.performance_focused(),
                .profiling_window = 100,
                .cache_timeout_ms = 10000, // 10 seconds
            };
        }
        
        pub fn minimal() BackendConfig {
            return BackendConfig{
                .enable_backend_selection = false,
                .enable_runtime_detection = false,
                .enable_adaptive_switching = false,
                .enable_performance_profiling = false,
                .enable_backend_caching = false,
                .fallback_strategy = .Pure,
                .selection_criteria = SelectionCriteria.reliability_focused(),
                .profiling_window = 10,
                .cache_timeout_ms = 1000,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: BackendConfig) !PrecompileBackendManager {
        var manager = PrecompileBackendManager{
            .allocator = allocator,
            .config = config,
            .backends = try BackendRegistry.init(allocator),
            .performance_profiler = PerformanceProfiler.init(allocator, config.profiling_window),
            .runtime_detector = try RuntimeDetector.init(),
            .adaptive_selector = AdaptiveSelector.init(config.selection_criteria),
            .backend_cache = BackendCache.init(allocator, config.cache_timeout_ms),
        };
        
        // Register available backends
        try manager.register_built_in_backends();
        
        return manager;
    }
    
    pub fn deinit(self: *PrecompileBackendManager) void {
        self.backends.deinit();
        self.performance_profiler.deinit();
        self.backend_cache.deinit();
    }
    
    pub fn select_backend(
        self: *PrecompileBackendManager,
        precompile_type: PrecompileType,
        input_characteristics: InputCharacteristics
    ) BackendSelection {
        if (!self.config.enable_backend_selection) {
            return BackendSelection{
                .backend_id = self.get_fallback_backend(precompile_type),
                .selection_reason = .Fallback,
                .confidence = 1.0,
                .estimated_performance = 0.5,
            };
        }
        
        // Check cache first
        if (self.config.enable_backend_caching) {
            const cache_key = self.backend_cache.compute_key(precompile_type, input_characteristics);
            if (self.backend_cache.get(cache_key)) |cached_selection| {
                return cached_selection;
            }
        }
        
        // Perform backend selection
        const selection = self.perform_backend_selection(precompile_type, input_characteristics);
        
        // Cache the result
        if (self.config.enable_backend_caching) {
            const cache_key = self.backend_cache.compute_key(precompile_type, input_characteristics);
            self.backend_cache.put(cache_key, selection);
        }
        
        return selection;
    }
    
    fn perform_backend_selection(
        self: *PrecompileBackendManager,
        precompile_type: PrecompileType,
        input_characteristics: InputCharacteristics
    ) BackendSelection {
        const available_backends = self.backends.get_backends_for_precompile(precompile_type);
        
        if (available_backends.len == 0) {
            return BackendSelection{
                .backend_id = self.get_fallback_backend(precompile_type),
                .selection_reason = .NoBackendsAvailable,
                .confidence = 0.5,
                .estimated_performance = 0.3,
            };
        }
        
        if (available_backends.len == 1) {
            return BackendSelection{
                .backend_id = available_backends[0],
                .selection_reason = .OnlyOptionAvailable,
                .confidence = 1.0,
                .estimated_performance = self.estimate_backend_performance(available_backends[0], input_characteristics),
            };
        }
        
        // Multiple backends available - perform selection
        var best_backend = available_backends[0];
        var best_score: f64 = 0.0;
        var selection_reason = SelectionReason.PerformanceOptimal;
        
        for (available_backends) |backend_id| {
            const score = self.calculate_backend_score(backend_id, input_characteristics);
            
            if (score > best_score) {
                best_score = score;
                best_backend = backend_id;
                
                const backend_info = self.backends.get_backend_info(backend_id);
                selection_reason = switch (backend_info.backend_type) {
                    .Native => .NativeOptimized,
                    .Hardware => .HardwareAccelerated,
                    .Pure => .PureImplementation,
                    .Hybrid => .HybridApproach,
                };
            }
        }
        
        return BackendSelection{
            .backend_id = best_backend,
            .selection_reason = selection_reason,
            .confidence = @min(best_score, 1.0),
            .estimated_performance = self.estimate_backend_performance(best_backend, input_characteristics),
        };
    }
    
    fn calculate_backend_score(
        self: *PrecompileBackendManager,
        backend_id: BackendId,
        input_characteristics: InputCharacteristics
    ) f64 {
        const backend_info = self.backends.get_backend_info(backend_id);
        const criteria = self.config.selection_criteria;
        
        // Get performance metrics
        const perf_metrics = self.performance_profiler.get_backend_metrics(backend_id);
        
        // Calculate component scores
        const performance_score = self.calculate_performance_score(backend_info, perf_metrics, input_characteristics);
        const reliability_score = self.calculate_reliability_score(backend_info, perf_metrics);
        const memory_score = self.calculate_memory_score(backend_info, input_characteristics);
        const startup_score = self.calculate_startup_score(backend_info, perf_metrics);
        
        // Apply weights
        const weighted_score = 
            (performance_score * criteria.performance_weight) +
            (reliability_score * criteria.reliability_weight) +
            (memory_score * criteria.memory_usage_weight) +
            (startup_score * criteria.startup_cost_weight);
        
        // Apply adaptive adjustments
        if (self.config.enable_adaptive_switching) {
            return self.adaptive_selector.adjust_score(weighted_score, backend_id, input_characteristics);
        }
        
        return weighted_score;
    }
    
    fn calculate_performance_score(
        self: *PrecompileBackendManager,
        backend_info: BackendInfo,
        perf_metrics: PerformanceMetrics,
        input_characteristics: InputCharacteristics
    ) f64 {
        _ = self;
        
        // Base score from backend type
        var score: f64 = switch (backend_info.backend_type) {
            .Hardware => 0.95,
            .Native => 0.85,
            .Hybrid => 0.75,
            .Pure => 0.65,
        };
        
        // Adjust based on input size
        if (input_characteristics.input_size > 1024) {
            // Large inputs benefit more from optimized backends
            score *= switch (backend_info.backend_type) {
                .Hardware, .Native => 1.1,
                .Hybrid => 1.05,
                .Pure => 0.9,
            };
        } else {
            // Small inputs might not benefit from optimization overhead
            score *= switch (backend_info.backend_type) {
                .Hardware => 0.9, // Overhead might not be worth it
                .Native => 0.95,
                .Hybrid => 1.0,
                .Pure => 1.05, // Simple and fast for small inputs
            };
        }
        
        // Adjust based on historical performance
        if (perf_metrics.sample_count > 10) {
            const relative_performance = perf_metrics.avg_execution_time_ns / backend_info.baseline_performance_ns;
            if (relative_performance < 1.0) {
                score *= (2.0 - relative_performance); // Better than baseline
            } else {
                score *= (1.0 / relative_performance); // Worse than baseline
            }
        }
        
        return @min(score, 1.0);
    }
    
    fn calculate_reliability_score(
        self: *PrecompileBackendManager,
        backend_info: BackendInfo,
        perf_metrics: PerformanceMetrics
    ) f64 {
        _ = self;
        
        var score: f64 = backend_info.reliability_rating;
        
        // Adjust based on error rate
        if (perf_metrics.total_executions > 0) {
            const error_rate = @as(f64, @floatFromInt(perf_metrics.error_count)) / 
                             @as(f64, @floatFromInt(perf_metrics.total_executions));
            score *= (1.0 - error_rate);
        }
        
        // Penalize backends with recent failures
        if (perf_metrics.consecutive_failures > 0) {
            score *= @exp(-@as(f64, @floatFromInt(perf_metrics.consecutive_failures)) * 0.1);
        }
        
        return @max(score, 0.0);
    }
    
    fn calculate_memory_score(
        self: *PrecompileBackendManager,
        backend_info: BackendInfo,
        input_characteristics: InputCharacteristics
    ) f64 {
        _ = self;
        
        const estimated_memory = backend_info.base_memory_usage + 
                                (input_characteristics.input_size * backend_info.memory_per_byte);
        
        // Prefer backends with lower memory usage
        const max_acceptable_memory = 1024 * 1024; // 1MB
        
        if (estimated_memory <= max_acceptable_memory) {
            return 1.0 - (@as(f64, @floatFromInt(estimated_memory)) / @as(f64, @floatFromInt(max_acceptable_memory)));
        } else {
            return 0.1; // Heavily penalize high memory usage
        }
    }
    
    fn calculate_startup_score(
        self: *PrecompileBackendManager,
        backend_info: BackendInfo,
        perf_metrics: PerformanceMetrics
    ) f64 {
        _ = self;
        _ = perf_metrics;
        
        // Prefer backends with lower startup costs
        const max_acceptable_startup = 1000000; // 1ms in nanoseconds
        
        if (backend_info.startup_cost_ns <= max_acceptable_startup) {
            return 1.0 - (@as(f64, @floatFromInt(backend_info.startup_cost_ns)) / 
                         @as(f64, @floatFromInt(max_acceptable_startup)));
        } else {
            return 0.1; // Heavily penalize high startup costs
        }
    }
    
    fn estimate_backend_performance(
        self: *PrecompileBackendManager,
        backend_id: BackendId,
        input_characteristics: InputCharacteristics
    ) f64 {
        const backend_info = self.backends.get_backend_info(backend_id);
        const perf_metrics = self.performance_profiler.get_backend_metrics(backend_id);
        
        // Use historical data if available
        if (perf_metrics.sample_count > 5) {
            return 1.0 / (perf_metrics.avg_execution_time_ns / 1000000.0); // Convert to relative performance
        }
        
        // Estimate based on backend type and input size
        const base_performance = switch (backend_info.backend_type) {
            .Hardware => 0.9,
            .Native => 0.8,
            .Hybrid => 0.7,
            .Pure => 0.6,
        };
        
        // Adjust for input size
        const size_factor = if (input_characteristics.input_size > 1024) 
            @min(1.2, 1.0 + (@as(f64, @floatFromInt(input_characteristics.input_size)) / 10240.0))
        else 
            1.0;
        
        return base_performance * size_factor;
    }
    
    fn get_fallback_backend(self: *PrecompileBackendManager, precompile_type: PrecompileType) BackendId {
        return switch (self.config.fallback_strategy) {
            .Pure => self.backends.get_pure_backend(precompile_type),
            .Native => self.backends.get_native_backend(precompile_type) orelse 
                      self.backends.get_pure_backend(precompile_type),
            .Hardware => self.backends.get_hardware_backend(precompile_type) orelse
                        self.backends.get_native_backend(precompile_type) orelse
                        self.backends.get_pure_backend(precompile_type),
            .Hybrid => self.backends.get_hybrid_backend(precompile_type) orelse
                      self.backends.get_native_backend(precompile_type) orelse
                      self.backends.get_pure_backend(precompile_type),
            .Fastest => self.backends.get_fastest_backend(precompile_type),
            .Most_Reliable => self.backends.get_most_reliable_backend(precompile_type),
        };
    }
    
    fn register_built_in_backends(self: *PrecompileBackendManager) !void {
        // Register pure Zig backends (always available)
        try self.backends.register_backend(BackendInfo{
            .id = BackendId.ecrecover_pure,
            .name = "ECRECOVER_Pure",
            .precompile_type = .ECRECOVER,
            .backend_type = .Pure,
            .reliability_rating = 1.0,
            .baseline_performance_ns = 1000000, // 1ms baseline
            .base_memory_usage = 1024,
            .memory_per_byte = 1,
            .startup_cost_ns = 0,
            .supported_input_sizes = .{ .min = 128, .max = 128 },
        });
        
        try self.backends.register_backend(BackendInfo{
            .id = BackendId.sha256_pure,
            .name = "SHA256_Pure",
            .precompile_type = .SHA256,
            .backend_type = .Pure,
            .reliability_rating = 1.0,
            .baseline_performance_ns = 500000, // 0.5ms baseline
            .base_memory_usage = 512,
            .memory_per_byte = 1,
            .startup_cost_ns = 0,
            .supported_input_sizes = .{ .min = 0, .max = std.math.maxInt(u32) },
        });
        
        try self.backends.register_backend(BackendInfo{
            .id = BackendId.ripemd160_pure,
            .name = "RIPEMD160_Pure",
            .precompile_type = .RIPEMD160,
            .backend_type = .Pure,
            .reliability_rating = 1.0,
            .baseline_performance_ns = 800000, // 0.8ms baseline
            .base_memory_usage = 512,
            .memory_per_byte = 1,
            .startup_cost_ns = 0,
            .supported_input_sizes = .{ .min = 0, .max = std.math.maxInt(u32) },
        });
        
        try self.backends.register_backend(BackendInfo{
            .id = BackendId.identity_pure,
            .name = "IDENTITY_Pure",
            .precompile_type = .IDENTITY,
            .backend_type = .Pure,
            .reliability_rating = 1.0,
            .baseline_performance_ns = 1000, // 1μs baseline
            .base_memory_usage = 0,
            .memory_per_byte = 1,
            .startup_cost_ns = 0,
            .supported_input_sizes = .{ .min = 0, .max = std.math.maxInt(u32) },
        });
        
        // Register native optimized backends if available
        if (self.runtime_detector.has_native_crypto_support()) {
            try self.register_native_backends();
        }
        
        // Register hardware-accelerated backends if available
        if (self.runtime_detector.has_hardware_crypto_support()) {
            try self.register_hardware_backends();
        }
    }
    
    fn register_native_backends(self: *PrecompileBackendManager) !void {
        // Platform-specific optimized implementations
        if (self.runtime_detector.is_x86_64()) {
            try self.backends.register_backend(BackendInfo{
                .id = BackendId.sha256_native_x86,
                .name = "SHA256_Native_x86",
                .precompile_type = .SHA256,
                .backend_type = .Native,
                .reliability_rating = 0.95,
                .baseline_performance_ns = 100000, // 0.1ms baseline
                .base_memory_usage = 512,
                .memory_per_byte = 1,
                .startup_cost_ns = 50000, // 50μs startup
                .supported_input_sizes = .{ .min = 0, .max = std.math.maxInt(u32) },
            });
        }
        
        if (self.runtime_detector.is_arm64()) {
            try self.backends.register_backend(BackendInfo{
                .id = BackendId.sha256_native_arm,
                .name = "SHA256_Native_ARM",
                .precompile_type = .SHA256,
                .backend_type = .Native,
                .reliability_rating = 0.95,
                .baseline_performance_ns = 150000, // 0.15ms baseline
                .base_memory_usage = 512,
                .memory_per_byte = 1,
                .startup_cost_ns = 30000, // 30μs startup
                .supported_input_sizes = .{ .min = 0, .max = std.math.maxInt(u32) },
            });
        }
    }
    
    fn register_hardware_backends(self: *PrecompileBackendManager) !void {
        // Hardware-accelerated implementations
        if (self.runtime_detector.has_aes_ni()) {
            try self.backends.register_backend(BackendInfo{
                .id = BackendId.sha256_hardware_aes,
                .name = "SHA256_Hardware_AES",
                .precompile_type = .SHA256,
                .backend_type = .Hardware,
                .reliability_rating = 0.98,
                .baseline_performance_ns = 50000, // 0.05ms baseline
                .base_memory_usage = 256,
                .memory_per_byte = 0.5,
                .startup_cost_ns = 100000, // 100μs startup
                .supported_input_sizes = .{ .min = 32, .max = std.math.maxInt(u32) },
            });
        }
        
        if (self.runtime_detector.has_crypto_extensions()) {
            try self.backends.register_backend(BackendInfo{
                .id = BackendId.ecrecover_hardware_crypto,
                .name = "ECRECOVER_Hardware_Crypto",
                .precompile_type = .ECRECOVER,
                .backend_type = .Hardware,
                .reliability_rating = 0.98,
                .baseline_performance_ns = 200000, // 0.2ms baseline
                .base_memory_usage = 1024,
                .memory_per_byte = 1,
                .startup_cost_ns = 200000, // 200μs startup
                .supported_input_sizes = .{ .min = 128, .max = 128 },
            });
        }
    }
    
    pub fn record_execution_result(
        self: *PrecompileBackendManager,
        backend_id: BackendId,
        execution_time_ns: u64,
        input_size: usize,
        success: bool
    ) void {
        if (self.config.enable_performance_profiling) {
            self.performance_profiler.record_execution(backend_id, execution_time_ns, input_size, success);
        }
        
        if (self.config.enable_adaptive_switching) {
            self.adaptive_selector.record_execution_result(backend_id, execution_time_ns, input_size, success);
        }
    }
    
    pub fn get_backend_statistics(self: *const PrecompileBackendManager) BackendStatistics {
        return BackendStatistics{
            .total_backends = self.backends.get_total_backend_count(),
            .active_backends = self.backends.get_active_backend_count(),
            .cache_hit_rate = self.backend_cache.get_hit_rate(),
            .selection_count = self.adaptive_selector.get_total_selections(),
            .profiling_data = self.performance_profiler.get_summary_statistics(),
        };
    }
    
    pub const PrecompileType = enum {
        ECRECOVER,
        SHA256,
        RIPEMD160,
        IDENTITY,
        MODEXP,
        ECADD,
        ECMUL,
        ECPAIRING,
        BLAKE2F,
        KZG_POINT_EVAL,
    };
    
    pub const BackendId = enum {
        // Pure implementations
        ecrecover_pure,
        sha256_pure,
        ripemd160_pure,
        identity_pure,
        modexp_pure,
        
        // Native optimized
        sha256_native_x86,
        sha256_native_arm,
        ecrecover_native_secp256k1,
        ripemd160_native_openssl,
        
        // Hardware accelerated
        sha256_hardware_aes,
        ecrecover_hardware_crypto,
        blake2f_hardware_avx,
        
        // Hybrid implementations
        modexp_hybrid_gmp,
        ecpairing_hybrid_bn254,
    };
    
    pub const BackendSelection = struct {
        backend_id: BackendId,
        selection_reason: SelectionReason,
        confidence: f64,
        estimated_performance: f64,
    };
    
    pub const SelectionReason = enum {
        PerformanceOptimal,
        NativeOptimized,
        HardwareAccelerated,
        PureImplementation,
        HybridApproach,
        Fallback,
        OnlyOptionAvailable,
        NoBackendsAvailable,
        CachedSelection,
        AdaptiveOverride,
    };
    
    pub const InputCharacteristics = struct {
        input_size: usize,
        complexity_hint: ComplexityHint,
        frequency_hint: FrequencyHint,
        latency_requirements: LatencyRequirements,
        
        pub const ComplexityHint = enum {
            Simple,
            Moderate,
            Complex,
            Unknown,
        };
        
        pub const FrequencyHint = enum {
            Rare,
            Occasional,
            Frequent,
            Continuous,
        };
        
        pub const LatencyRequirements = enum {
            BestEffort,
            LowLatency,
            RealTime,
            Interactive,
        };
    };
    
    pub const BackendStatistics = struct {
        total_backends: u32,
        active_backends: u32,
        cache_hit_rate: f64,
        selection_count: u64,
        profiling_data: PerformanceProfiler.SummaryStatistics,
    };
};
```

#### 2. Backend Registry
```zig
pub const BackendRegistry = struct {
    allocator: std.mem.Allocator,
    backends: std.HashMap(BackendId, BackendInfo, BackendIdContext, std.hash_map.default_max_load_percentage),
    precompile_backends: std.HashMap(PrecompileType, std.ArrayList(BackendId), PrecompileTypeContext, std.hash_map.default_max_load_percentage),
    backend_instances: std.HashMap(BackendId, BackendInstance, BackendIdContext, std.hash_map.default_max_load_percentage),
    
    pub const BackendInfo = struct {
        id: BackendId,
        name: []const u8,
        precompile_type: PrecompileType,
        backend_type: BackendType,
        reliability_rating: f64,
        baseline_performance_ns: u64,
        base_memory_usage: usize,
        memory_per_byte: f64,
        startup_cost_ns: u64,
        supported_input_sizes: InputSizeRange,
        
        pub const BackendType = enum {
            Pure,        // Pure Zig implementation
            Native,      // Platform-optimized native code
            Hardware,    // Hardware-accelerated (AES-NI, etc.)
            Hybrid,      // Mixed approach
        };
        
        pub const InputSizeRange = struct {
            min: usize,
            max: usize,
        };
    };
    
    pub const BackendInstance = struct {
        info: BackendInfo,
        implementation: BackendImplementation,
        state: BackendState,
        initialization_time: i64,
        
        pub const BackendState = enum {
            Uninitialized,
            Initializing,
            Ready,
            Error,
            Disabled,
        };
    };
    
    pub const BackendImplementation = union(enum) {
        pure: PureImplementation,
        native: NativeImplementation,
        hardware: HardwareImplementation,
        hybrid: HybridImplementation,
        
        pub const PureImplementation = struct {
            execute_fn: *const fn(input: []const u8, output: []u8) anyerror!void,
        };
        
        pub const NativeImplementation = struct {
            library_handle: ?*anyopaque,
            execute_fn: *const fn(input: []const u8, output: []u8) anyerror!void,
            cleanup_fn: ?*const fn() void,
        };
        
        pub const HardwareImplementation = struct {
            feature_requirements: FeatureRequirements,
            execute_fn: *const fn(input: []const u8, output: []u8) anyerror!void,
            
            pub const FeatureRequirements = packed struct {
                requires_aes_ni: bool,
                requires_sse4: bool,
                requires_avx2: bool,
                requires_crypto_ext: bool,
                requires_neon: bool,
                _padding: u3 = 0,
            };
        };
        
        pub const HybridImplementation = struct {
            small_input_backend: BackendId,
            large_input_backend: BackendId,
            threshold_size: usize,
        };
    };
    
    pub fn init(allocator: std.mem.Allocator) !BackendRegistry {
        return BackendRegistry{
            .allocator = allocator,
            .backends = std.HashMap(BackendId, BackendInfo, BackendIdContext, std.hash_map.default_max_load_percentage).init(allocator),
            .precompile_backends = std.HashMap(PrecompileType, std.ArrayList(BackendId), PrecompileTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .backend_instances = std.HashMap(BackendId, BackendInstance, BackendIdContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
    }
    
    pub fn deinit(self: *BackendRegistry) void {
        // Clean up backend instances
        var instance_iterator = self.backend_instances.iterator();
        while (instance_iterator.next()) |entry| {
            self.cleanup_backend_instance(entry.value_ptr);
        }
        self.backend_instances.deinit();
        
        // Clean up precompile backend lists
        var precompile_iterator = self.precompile_backends.iterator();
        while (precompile_iterator.next()) |entry| {
            entry.value_ptr.deinit();
        }
        self.precompile_backends.deinit();
        
        self.backends.deinit();
    }
    
    pub fn register_backend(self: *BackendRegistry, backend_info: BackendInfo) !void {
        // Register backend info
        try self.backends.put(backend_info.id, backend_info);
        
        // Add to precompile type mapping
        var backends_for_precompile = self.precompile_backends.getPtr(backend_info.precompile_type) orelse blk: {
            const new_list = std.ArrayList(BackendId).init(self.allocator);
            try self.precompile_backends.put(backend_info.precompile_type, new_list);
            break :blk self.precompile_backends.getPtr(backend_info.precompile_type).?;
        };
        
        try backends_for_precompile.append(backend_info.id);
        
        // Create backend instance
        try self.create_backend_instance(backend_info);
    }
    
    fn create_backend_instance(self: *BackendRegistry, backend_info: BackendInfo) !void {
        const implementation = try self.create_backend_implementation(backend_info);
        
        const instance = BackendInstance{
            .info = backend_info,
            .implementation = implementation,
            .state = .Uninitialized,
            .initialization_time = std.time.milliTimestamp(),
        };
        
        try self.backend_instances.put(backend_info.id, instance);
    }
    
    fn create_backend_implementation(self: *BackendRegistry, backend_info: BackendInfo) !BackendImplementation {
        return switch (backend_info.backend_type) {
            .Pure => BackendImplementation{
                .pure = try self.create_pure_implementation(backend_info),
            },
            .Native => BackendImplementation{
                .native = try self.create_native_implementation(backend_info),
            },
            .Hardware => BackendImplementation{
                .hardware = try self.create_hardware_implementation(backend_info),
            },
            .Hybrid => BackendImplementation{
                .hybrid = try self.create_hybrid_implementation(backend_info),
            },
        };
    }
    
    fn create_pure_implementation(self: *BackendRegistry, backend_info: BackendInfo) !BackendImplementation.PureImplementation {
        _ = self;
        
        const execute_fn = switch (backend_info.id) {
            .ecrecover_pure => &ecrecover_pure_execute,
            .sha256_pure => &sha256_pure_execute,
            .ripemd160_pure => &ripemd160_pure_execute,
            .identity_pure => &identity_pure_execute,
            .modexp_pure => &modexp_pure_execute,
            else => return error.UnsupportedPureBackend,
        };
        
        return BackendImplementation.PureImplementation{
            .execute_fn = execute_fn,
        };
    }
    
    fn create_native_implementation(self: *BackendRegistry, backend_info: BackendInfo) !BackendImplementation.NativeImplementation {
        _ = self;
        
        // Load native library and get function pointers
        const library_handle = switch (backend_info.id) {
            .sha256_native_x86 => try self.load_native_library("libcrypto_x86.so"),
            .sha256_native_arm => try self.load_native_library("libcrypto_arm.so"),
            .ecrecover_native_secp256k1 => try self.load_native_library("libsecp256k1.so"),
            .ripemd160_native_openssl => try self.load_native_library("libssl.so"),
            else => null,
        };
        
        const execute_fn = switch (backend_info.id) {
            .sha256_native_x86 => &sha256_native_x86_execute,
            .sha256_native_arm => &sha256_native_arm_execute,
            .ecrecover_native_secp256k1 => &ecrecover_native_secp256k1_execute,
            .ripemd160_native_openssl => &ripemd160_native_openssl_execute,
            else => return error.UnsupportedNativeBackend,
        };
        
        return BackendImplementation.NativeImplementation{
            .library_handle = library_handle,
            .execute_fn = execute_fn,
            .cleanup_fn = null, // Set if cleanup is needed
        };
    }
    
    fn create_hardware_implementation(self: *BackendRegistry, backend_info: BackendInfo) !BackendImplementation.HardwareImplementation {
        _ = self;
        
        const feature_requirements = switch (backend_info.id) {
            .sha256_hardware_aes => BackendImplementation.HardwareImplementation.FeatureRequirements{
                .requires_aes_ni = true,
                .requires_sse4 = true,
                .requires_avx2 = false,
                .requires_crypto_ext = false,
                .requires_neon = false,
            },
            .ecrecover_hardware_crypto => BackendImplementation.HardwareImplementation.FeatureRequirements{
                .requires_aes_ni = false,
                .requires_sse4 = false,
                .requires_avx2 = false,
                .requires_crypto_ext = true,
                .requires_neon = false,
            },
            .blake2f_hardware_avx => BackendImplementation.HardwareImplementation.FeatureRequirements{
                .requires_aes_ni = false,
                .requires_sse4 = true,
                .requires_avx2 = true,
                .requires_crypto_ext = false,
                .requires_neon = false,
            },
            else => return error.UnsupportedHardwareBackend,
        };
        
        const execute_fn = switch (backend_info.id) {
            .sha256_hardware_aes => &sha256_hardware_aes_execute,
            .ecrecover_hardware_crypto => &ecrecover_hardware_crypto_execute,
            .blake2f_hardware_avx => &blake2f_hardware_avx_execute,
            else => return error.UnsupportedHardwareBackend,
        };
        
        return BackendImplementation.HardwareImplementation{
            .feature_requirements = feature_requirements,
            .execute_fn = execute_fn,
        };
    }
    
    fn create_hybrid_implementation(self: *BackendRegistry, backend_info: BackendInfo) !BackendImplementation.HybridImplementation {
        _ = self;
        
        return switch (backend_info.id) {
            .modexp_hybrid_gmp => BackendImplementation.HybridImplementation{
                .small_input_backend = .modexp_pure,
                .large_input_backend = .modexp_native_gmp,
                .threshold_size = 1024,
            },
            .ecpairing_hybrid_bn254 => BackendImplementation.HybridImplementation{
                .small_input_backend = .ecpairing_pure,
                .large_input_backend = .ecpairing_native_bn254,
                .threshold_size = 2048,
            },
            else => return error.UnsupportedHybridBackend,
        };
    }
    
    fn load_native_library(self: *BackendRegistry, library_name: []const u8) !*anyopaque {
        _ = self;
        _ = library_name;
        
        // Platform-specific library loading
        // This would use dlopen() on Unix, LoadLibrary() on Windows
        // For now, return null as we don't have actual native libraries
        return null;
    }
    
    pub fn get_backends_for_precompile(self: *const BackendRegistry, precompile_type: PrecompileType) []const BackendId {
        if (self.precompile_backends.get(precompile_type)) |backends| {
            return backends.items;
        }
        return &[_]BackendId{};
    }
    
    pub fn get_backend_info(self: *const BackendRegistry, backend_id: BackendId) BackendInfo {
        return self.backends.get(backend_id) orelse BackendInfo{
            .id = backend_id,
            .name = "Unknown",
            .precompile_type = .IDENTITY,
            .backend_type = .Pure,
            .reliability_rating = 0.5,
            .baseline_performance_ns = 1000000,
            .base_memory_usage = 1024,
            .memory_per_byte = 1.0,
            .startup_cost_ns = 0,
            .supported_input_sizes = .{ .min = 0, .max = std.math.maxInt(u32) },
        };
    }
    
    pub fn get_backend_instance(self: *BackendRegistry, backend_id: BackendId) ?*BackendInstance {
        return self.backend_instances.getPtr(backend_id);
    }
    
    pub fn execute_backend(
        self: *BackendRegistry,
        backend_id: BackendId,
        input: []const u8,
        output: []u8
    ) !void {
        const instance = self.backend_instances.getPtr(backend_id) orelse {
            return error.BackendNotFound;
        };
        
        if (instance.state != .Ready) {
            try self.initialize_backend(backend_id);
        }
        
        switch (instance.implementation) {
            .pure => |pure_impl| try pure_impl.execute_fn(input, output),
            .native => |native_impl| try native_impl.execute_fn(input, output),
            .hardware => |hw_impl| try hw_impl.execute_fn(input, output),
            .hybrid => |hybrid_impl| {
                if (input.len < hybrid_impl.threshold_size) {
                    try self.execute_backend(hybrid_impl.small_input_backend, input, output);
                } else {
                    try self.execute_backend(hybrid_impl.large_input_backend, input, output);
                }
            },
        }
    }
    
    fn initialize_backend(self: *BackendRegistry, backend_id: BackendId) !void {
        const instance = self.backend_instances.getPtr(backend_id) orelse {
            return error.BackendNotFound;
        };
        
        if (instance.state == .Initializing) {
            return error.BackendInitializing;
        }
        
        instance.state = .Initializing;
        
        // Perform backend-specific initialization
        switch (instance.implementation) {
            .native => |native_impl| {
                if (native_impl.library_handle == null) {
                    instance.state = .Error;
                    return error.NativeLibraryNotLoaded;
                }
            },
            .hardware => |hw_impl| {
                if (!self.check_hardware_requirements(hw_impl.feature_requirements)) {
                    instance.state = .Error;
                    return error.HardwareRequirementsNotMet;
                }
            },
            .hybrid => |hybrid_impl| {
                // Ensure both sub-backends are initialized
                try self.initialize_backend(hybrid_impl.small_input_backend);
                try self.initialize_backend(hybrid_impl.large_input_backend);
            },
            .pure => {
                // Pure implementations don't need initialization
            },
        }
        
        instance.state = .Ready;
    }
    
    fn check_hardware_requirements(self: *BackendRegistry, requirements: BackendImplementation.HardwareImplementation.FeatureRequirements) bool {
        _ = self;
        
        // Check CPU features - this would be platform-specific
        // For now, assume all requirements are met
        _ = requirements;
        return true;
    }
    
    fn cleanup_backend_instance(self: *BackendRegistry, instance: *BackendInstance) void {
        switch (instance.implementation) {
            .native => |native_impl| {
                if (native_impl.cleanup_fn) |cleanup| {
                    cleanup();
                }
            },
            .hardware => {
                // Hardware backends typically don't need cleanup
            },
            .hybrid => {
                // Hybrid backends delegate cleanup to sub-backends
            },
            .pure => {
                // Pure implementations don't need cleanup
            },
        }
        
        instance.state = .Uninitialized;
    }
    
    pub fn get_pure_backend(self: *const BackendRegistry, precompile_type: PrecompileType) BackendId {
        const backends = self.get_backends_for_precompile(precompile_type);
        for (backends) |backend_id| {
            const info = self.get_backend_info(backend_id);
            if (info.backend_type == .Pure) {
                return backend_id;
            }
        }
        
        // Fallback mapping
        return switch (precompile_type) {
            .ECRECOVER => .ecrecover_pure,
            .SHA256 => .sha256_pure,
            .RIPEMD160 => .ripemd160_pure,
            .IDENTITY => .identity_pure,
            .MODEXP => .modexp_pure,
            else => .identity_pure, // Ultimate fallback
        };
    }
    
    pub fn get_native_backend(self: *const BackendRegistry, precompile_type: PrecompileType) ?BackendId {
        const backends = self.get_backends_for_precompile(precompile_type);
        for (backends) |backend_id| {
            const info = self.get_backend_info(backend_id);
            if (info.backend_type == .Native) {
                return backend_id;
            }
        }
        return null;
    }
    
    pub fn get_hardware_backend(self: *const BackendRegistry, precompile_type: PrecompileType) ?BackendId {
        const backends = self.get_backends_for_precompile(precompile_type);
        for (backends) |backend_id| {
            const info = self.get_backend_info(backend_id);
            if (info.backend_type == .Hardware) {
                return backend_id;
            }
        }
        return null;
    }
    
    pub fn get_hybrid_backend(self: *const BackendRegistry, precompile_type: PrecompileType) ?BackendId {
        const backends = self.get_backends_for_precompile(precompile_type);
        for (backends) |backend_id| {
            const info = self.get_backend_info(backend_id);
            if (info.backend_type == .Hybrid) {
                return backend_id;
            }
        }
        return null;
    }
    
    pub fn get_fastest_backend(self: *const BackendRegistry, precompile_type: PrecompileType) BackendId {
        const backends = self.get_backends_for_precompile(precompile_type);
        var fastest_backend = self.get_pure_backend(precompile_type);
        var best_performance: u64 = std.math.maxInt(u64);
        
        for (backends) |backend_id| {
            const info = self.get_backend_info(backend_id);
            if (info.baseline_performance_ns < best_performance) {
                best_performance = info.baseline_performance_ns;
                fastest_backend = backend_id;
            }
        }
        
        return fastest_backend;
    }
    
    pub fn get_most_reliable_backend(self: *const BackendRegistry, precompile_type: PrecompileType) BackendId {
        const backends = self.get_backends_for_precompile(precompile_type);
        var most_reliable = self.get_pure_backend(precompile_type);
        var best_reliability: f64 = 0.0;
        
        for (backends) |backend_id| {
            const info = self.get_backend_info(backend_id);
            if (info.reliability_rating > best_reliability) {
                best_reliability = info.reliability_rating;
                most_reliable = backend_id;
            }
        }
        
        return most_reliable;
    }
    
    pub fn get_total_backend_count(self: *const BackendRegistry) u32 {
        return @intCast(self.backends.count());
    }
    
    pub fn get_active_backend_count(self: *const BackendRegistry) u32 {
        var count: u32 = 0;
        var iterator = self.backend_instances.iterator();
        while (iterator.next()) |entry| {
            if (entry.value_ptr.state == .Ready) {
                count += 1;
            }
        }
        return count;
    }
    
    pub const BackendIdContext = struct {
        pub fn hash(self: @This(), key: BackendId) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: BackendId, b: BackendId) bool {
            _ = self;
            return a == b;
        }
    };
    
    pub const PrecompileTypeContext = struct {
        pub fn hash(self: @This(), key: PrecompileType) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: PrecompileType, b: PrecompileType) bool {
            _ = self;
            return a == b;
        }
    };
};

// Pure implementation functions (these would be implemented elsewhere)
fn ecrecover_pure_execute(input: []const u8, output: []u8) !void {
    _ = input;
    _ = output;
    // Pure Zig implementation of ECRECOVER
}

fn sha256_pure_execute(input: []const u8, output: []u8) !void {
    _ = input;
    _ = output;
    // Pure Zig implementation of SHA256
}

fn ripemd160_pure_execute(input: []const u8, output: []u8) !void {
    _ = input;
    _ = output;
    // Pure Zig implementation of RIPEMD160
}

fn identity_pure_execute(input: []const u8, output: []u8) !void {
    if (output.len >= input.len) {
        @memcpy(output[0..input.len], input);
    }
}

fn modexp_pure_execute(input: []const u8, output: []u8) !void {
    _ = input;
    _ = output;
    // Pure Zig implementation of MODEXP
}

// Native implementation functions (these would interface with native libraries)
fn sha256_native_x86_execute(input: []const u8, output: []u8) !void {
    _ = input;
    _ = output;
    // Call optimized x86 SHA256 implementation
}

fn sha256_native_arm_execute(input: []const u8, output: []u8) !void {
    _ = input;
    _ = output;
    // Call optimized ARM SHA256 implementation
}

fn ecrecover_native_secp256k1_execute(input: []const u8, output: []u8) !void {
    _ = input;
    _ = output;
    // Call libsecp256k1 ECRECOVER
}

fn ripemd160_native_openssl_execute(input: []const u8, output: []u8) !void {
    _ = input;
    _ = output;
    // Call OpenSSL RIPEMD160
}

// Hardware implementation functions (these would use hardware acceleration)
fn sha256_hardware_aes_execute(input: []const u8, output: []u8) !void {
    _ = input;
    _ = output;
    // Use AES-NI instructions for SHA256
}

fn ecrecover_hardware_crypto_execute(input: []const u8, output: []u8) !void {
    _ = input;
    _ = output;
    // Use crypto extensions for ECRECOVER
}

fn blake2f_hardware_avx_execute(input: []const u8, output: []u8) !void {
    _ = input;
    _ = output;
    // Use AVX instructions for BLAKE2F
}
```

#### 3. Performance Profiler
```zig
pub const PerformanceProfiler = struct {
    allocator: std.mem.Allocator,
    backend_metrics: std.HashMap(BackendId, PerformanceMetrics, BackendIdContext, std.hash_map.default_max_load_percentage),
    execution_history: std.ArrayList(ExecutionRecord),
    profiling_window: u32,
    
    pub const PerformanceMetrics = struct {
        backend_id: BackendId,
        total_executions: u64,
        successful_executions: u64,
        error_count: u64,
        consecutive_failures: u32,
        total_execution_time_ns: u64,
        min_execution_time_ns: u64,
        max_execution_time_ns: u64,
        avg_execution_time_ns: u64,
        sample_count: u32,
        last_execution_time: i64,
        
        // Input size statistics
        min_input_size: usize,
        max_input_size: usize,
        avg_input_size: f64,
        
        // Performance trends
        recent_avg_time_ns: u64,
        performance_trend: PerformanceTrend,
        reliability_score: f64,
        
        pub const PerformanceTrend = enum {
            Improving,
            Stable,
            Degrading,
            Unknown,
        };
        
        pub fn init(backend_id: BackendId) PerformanceMetrics {
            return PerformanceMetrics{
                .backend_id = backend_id,
                .total_executions = 0,
                .successful_executions = 0,
                .error_count = 0,
                .consecutive_failures = 0,
                .total_execution_time_ns = 0,
                .min_execution_time_ns = std.math.maxInt(u64),
                .max_execution_time_ns = 0,
                .avg_execution_time_ns = 0,
                .sample_count = 0,
                .last_execution_time = 0,
                .min_input_size = std.math.maxInt(usize),
                .max_input_size = 0,
                .avg_input_size = 0.0,
                .recent_avg_time_ns = 0,
                .performance_trend = .Unknown,
                .reliability_score = 1.0,
            };
        }
        
        pub fn update_with_execution(
            self: *PerformanceMetrics,
            execution_time_ns: u64,
            input_size: usize,
            success: bool
        ) void {
            self.total_executions += 1;
            self.last_execution_time = std.time.milliTimestamp();
            
            if (success) {
                self.successful_executions += 1;
                self.consecutive_failures = 0;
                
                // Update timing statistics
                self.total_execution_time_ns += execution_time_ns;
                self.min_execution_time_ns = @min(self.min_execution_time_ns, execution_time_ns);
                self.max_execution_time_ns = @max(self.max_execution_time_ns, execution_time_ns);
                self.avg_execution_time_ns = self.total_execution_time_ns / self.successful_executions;
                
                // Update input size statistics
                self.min_input_size = @min(self.min_input_size, input_size);
                self.max_input_size = @max(self.max_input_size, input_size);
                
                const total_input_size = self.avg_input_size * @as(f64, @floatFromInt(self.sample_count)) + @as(f64, @floatFromInt(input_size));
                self.sample_count += 1;
                self.avg_input_size = total_input_size / @as(f64, @floatFromInt(self.sample_count));
            } else {
                self.error_count += 1;
                self.consecutive_failures += 1;
            }
            
            // Update reliability score
            self.reliability_score = @as(f64, @floatFromInt(self.successful_executions)) / 
                                   @as(f64, @floatFromInt(self.total_executions));
            
            // Update performance trend (simplified)
            if (self.sample_count > 10) {
                const recent_performance = execution_time_ns;
                if (recent_performance < self.avg_execution_time_ns * 0.9) {
                    self.performance_trend = .Improving;
                } else if (recent_performance > self.avg_execution_time_ns * 1.1) {
                    self.performance_trend = .Degrading;
                } else {
                    self.performance_trend = .Stable;
                }
                
                // Update recent average (exponential moving average)
                const alpha = 0.2;
                self.recent_avg_time_ns = @intFromFloat(
                    alpha * @as(f64, @floatFromInt(recent_performance)) + 
                    (1.0 - alpha) * @as(f64, @floatFromInt(self.recent_avg_time_ns))
                );
            }
        }
        
        pub fn get_error_rate(self: *const PerformanceMetrics) f64 {
            return if (self.total_executions > 0)
                @as(f64, @floatFromInt(self.error_count)) / @as(f64, @floatFromInt(self.total_executions))
            else
                0.0;
        }
        
        pub fn get_success_rate(self: *const PerformanceMetrics) f64 {
            return 1.0 - self.get_error_rate();
        }
        
        pub fn is_performing_well(self: *const PerformanceMetrics) bool {
            return self.reliability_score > 0.95 and
                   self.consecutive_failures == 0 and
                   self.performance_trend != .Degrading;
        }
    };
    
    pub const ExecutionRecord = struct {
        backend_id: BackendId,
        timestamp: i64,
        execution_time_ns: u64,
        input_size: usize,
        success: bool,
        precompile_type: PrecompileType,
    };
    
    pub const SummaryStatistics = struct {
        total_executions: u64,
        total_backends_profiled: u32,
        avg_execution_time_ns: u64,
        fastest_backend: BackendId,
        most_reliable_backend: BackendId,
        overall_success_rate: f64,
        profiling_window_size: u32,
    };
    
    pub fn init(allocator: std.mem.Allocator, profiling_window: u32) PerformanceProfiler {
        return PerformanceProfiler{
            .allocator = allocator,
            .backend_metrics = std.HashMap(BackendId, PerformanceMetrics, BackendIdContext, std.hash_map.default_max_load_percentage).init(allocator),
            .execution_history = std.ArrayList(ExecutionRecord).init(allocator),
            .profiling_window = profiling_window,
        };
    }
    
    pub fn deinit(self: *PerformanceProfiler) void {
        self.backend_metrics.deinit();
        self.execution_history.deinit();
    }
    
    pub fn record_execution(
        self: *PerformanceProfiler,
        backend_id: BackendId,
        execution_time_ns: u64,
        input_size: usize,
        success: bool
    ) void {
        // Update backend-specific metrics
        var metrics = self.backend_metrics.getPtr(backend_id) orelse blk: {
            const new_metrics = PerformanceMetrics.init(backend_id);
            self.backend_metrics.put(backend_id, new_metrics) catch return;
            break :blk self.backend_metrics.getPtr(backend_id).?;
        };
        
        metrics.update_with_execution(execution_time_ns, input_size, success);
        
        // Add to execution history
        const record = ExecutionRecord{
            .backend_id = backend_id,
            .timestamp = std.time.milliTimestamp(),
            .execution_time_ns = execution_time_ns,
            .input_size = input_size,
            .success = success,
            .precompile_type = self.infer_precompile_type(backend_id),
        };
        
        self.execution_history.append(record) catch return;
        
        // Maintain window size
        if (self.execution_history.items.len > self.profiling_window) {
            _ = self.execution_history.orderedRemove(0);
        }
    }
    
    pub fn get_backend_metrics(self: *const PerformanceProfiler, backend_id: BackendId) PerformanceMetrics {
        return self.backend_metrics.get(backend_id) orelse PerformanceMetrics.init(backend_id);
    }
    
    pub fn get_summary_statistics(self: *const PerformanceProfiler) SummaryStatistics {
        var total_executions: u64 = 0;
        var total_execution_time: u64 = 0;
        var total_successes: u64 = 0;
        var fastest_backend = BackendId.identity_pure;
        var fastest_time: u64 = std.math.maxInt(u64);
        var most_reliable_backend = BackendId.identity_pure;
        var best_reliability: f64 = 0.0;
        
        var iterator = self.backend_metrics.iterator();
        while (iterator.next()) |entry| {
            const metrics = entry.value_ptr;
            total_executions += metrics.total_executions;
            total_execution_time += metrics.total_execution_time_ns;
            total_successes += metrics.successful_executions;
            
            if (metrics.avg_execution_time_ns < fastest_time and metrics.sample_count > 5) {
                fastest_time = metrics.avg_execution_time_ns;
                fastest_backend = metrics.backend_id;
            }
            
            if (metrics.reliability_score > best_reliability) {
                best_reliability = metrics.reliability_score;
                most_reliable_backend = metrics.backend_id;
            }
        }
        
        const avg_execution_time = if (total_successes > 0) 
            total_execution_time / total_successes 
        else 
            0;
        
        const overall_success_rate = if (total_executions > 0)
            @as(f64, @floatFromInt(total_successes)) / @as(f64, @floatFromInt(total_executions))
        else
            0.0;
        
        return SummaryStatistics{
            .total_executions = total_executions,
            .total_backends_profiled = @intCast(self.backend_metrics.count()),
            .avg_execution_time_ns = avg_execution_time,
            .fastest_backend = fastest_backend,
            .most_reliable_backend = most_reliable_backend,
            .overall_success_rate = overall_success_rate,
            .profiling_window_size = self.profiling_window,
        };
    }
    
    pub fn get_performance_comparison(
        self: *const PerformanceProfiler,
        backend_a: BackendId,
        backend_b: BackendId
    ) PerformanceComparison {
        const metrics_a = self.get_backend_metrics(backend_a);
        const metrics_b = self.get_backend_metrics(backend_b);
        
        const speed_ratio = if (metrics_b.avg_execution_time_ns > 0)
            @as(f64, @floatFromInt(metrics_a.avg_execution_time_ns)) / @as(f64, @floatFromInt(metrics_b.avg_execution_time_ns))
        else
            1.0;
        
        const reliability_diff = metrics_a.reliability_score - metrics_b.reliability_score;
        
        const faster_backend = if (metrics_a.avg_execution_time_ns < metrics_b.avg_execution_time_ns)
            backend_a
        else
            backend_b;
        
        const more_reliable_backend = if (metrics_a.reliability_score > metrics_b.reliability_score)
            backend_a
        else
            backend_b;
        
        return PerformanceComparison{
            .backend_a = backend_a,
            .backend_b = backend_b,
            .speed_ratio = speed_ratio,
            .reliability_difference = reliability_diff,
            .faster_backend = faster_backend,
            .more_reliable_backend = more_reliable_backend,
            .significant_difference = @abs(speed_ratio - 1.0) > 0.1 or @abs(reliability_diff) > 0.05,
        };
    }
    
    pub const PerformanceComparison = struct {
        backend_a: BackendId,
        backend_b: BackendId,
        speed_ratio: f64,
        reliability_difference: f64,
        faster_backend: BackendId,
        more_reliable_backend: BackendId,
        significant_difference: bool,
    };
    
    fn infer_precompile_type(self: *const PerformanceProfiler, backend_id: BackendId) PrecompileType {
        _ = self;
        
        return switch (backend_id) {
            .ecrecover_pure, .ecrecover_native_secp256k1, .ecrecover_hardware_crypto => .ECRECOVER,
            .sha256_pure, .sha256_native_x86, .sha256_native_arm, .sha256_hardware_aes => .SHA256,
            .ripemd160_pure, .ripemd160_native_openssl => .RIPEMD160,
            .identity_pure => .IDENTITY,
            .modexp_pure, .modexp_hybrid_gmp => .MODEXP,
            .blake2f_hardware_avx => .BLAKE2F,
            else => .IDENTITY,
        };
    }
    
    pub const BackendIdContext = struct {
        pub fn hash(self: @This(), key: BackendId) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: BackendId, b: BackendId) bool {
            _ = self;
            return a == b;
        }
    };
};
```

#### 4. Runtime Detector
```zig
pub const RuntimeDetector = struct {
    cpu_features: CpuFeatures,
    runtime_info: RuntimeInfo,
    performance_baseline: PerformanceBaseline,
    
    pub const CpuFeatures = struct {
        has_aes_ni: bool,
        has_sse4_1: bool,
        has_sse4_2: bool,
        has_avx: bool,
        has_avx2: bool,
        has_sha_ext: bool,
        has_crypto_ext: bool, // ARM crypto extensions
        has_neon: bool,       // ARM NEON
        architecture: CpuArchitecture,
        
        pub const CpuArchitecture = enum {
            x86_64,
            aarch64,
            wasm32,
            unknown,
        };
    };
    
    pub const RuntimeInfo = struct {
        is_wasm: bool,
        is_nodejs: bool,
        is_browser: bool,
        is_native: bool,
        available_memory: usize,
        thread_count: u32,
        endianness: std.builtin.Endian,
    };
    
    pub const PerformanceBaseline = struct {
        simple_hash_ns: u64,
        memory_copy_gbps: f64,
        cpu_intensive_score: f64,
        memory_latency_ns: u64,
    };
    
    pub fn init() !RuntimeDetector {
        var detector = RuntimeDetector{
            .cpu_features = try detect_cpu_features(),
            .runtime_info = try detect_runtime_info(),
            .performance_baseline = PerformanceBaseline{
                .simple_hash_ns = 0,
                .memory_copy_gbps = 0.0,
                .cpu_intensive_score = 0.0,
                .memory_latency_ns = 0,
            },
        };
        
        detector.performance_baseline = try detector.benchmark_performance();
        
        return detector;
    }
    
    fn detect_cpu_features() !CpuFeatures {
        var features = CpuFeatures{
            .has_aes_ni = false,
            .has_sse4_1 = false,
            .has_sse4_2 = false,
            .has_avx = false,
            .has_avx2 = false,
            .has_sha_ext = false,
            .has_crypto_ext = false,
            .has_neon = false,
            .architecture = .unknown,
        };
        
        // Detect architecture
        features.architecture = switch (std.builtin.cpu.arch) {
            .x86_64 => .x86_64,
            .aarch64 => .aarch64,
            .wasm32 => .wasm32,
            else => .unknown,
        };
        
        // Detect CPU features based on architecture
        switch (features.architecture) {
            .x86_64 => {
                // Use CPUID to detect x86 features
                features.has_aes_ni = std.Target.x86.featureSetHas(std.builtin.cpu.features, .aes);
                features.has_sse4_1 = std.Target.x86.featureSetHas(std.builtin.cpu.features, .sse4_1);
                features.has_sse4_2 = std.Target.x86.featureSetHas(std.builtin.cpu.features, .sse4_2);
                features.has_avx = std.Target.x86.featureSetHas(std.builtin.cpu.features, .avx);
                features.has_avx2 = std.Target.x86.featureSetHas(std.builtin.cpu.features, .avx2);
                features.has_sha_ext = std.Target.x86.featureSetHas(std.builtin.cpu.features, .sha);
            },
            .aarch64 => {
                // Detect ARM features
                features.has_crypto_ext = std.Target.aarch64.featureSetHas(std.builtin.cpu.features, .aes);
                features.has_neon = std.Target.aarch64.featureSetHas(std.builtin.cpu.features, .neon);
            },
            .wasm32 => {
                // WASM doesn't have specialized crypto instructions
            },
            .unknown => {
                // Unknown architecture - assume no special features
            },
        }
        
        return features;
    }
    
    fn detect_runtime_info() !RuntimeInfo {
        var info = RuntimeInfo{
            .is_wasm = false,
            .is_nodejs = false,
            .is_browser = false,
            .is_native = false,
            .available_memory = 0,
            .thread_count = 1,
            .endianness = std.builtin.endian,
        };
        
        // Detect runtime environment
        info.is_wasm = std.builtin.cpu.arch == .wasm32;
        info.is_native = !info.is_wasm;
        
        // Detect available memory (simplified)
        info.available_memory = if (info.is_wasm) 
            16 * 1024 * 1024  // 16MB for WASM
        else 
            1024 * 1024 * 1024; // 1GB for native
        
        // Detect thread count
        info.thread_count = @intCast(std.Thread.getCpuCount() catch 1);
        
        return info;
    }
    
    fn benchmark_performance(self: *RuntimeDetector) !PerformanceBaseline {
        var baseline = PerformanceBaseline{
            .simple_hash_ns = 0,
            .memory_copy_gbps = 0.0,
            .cpu_intensive_score = 0.0,
            .memory_latency_ns = 0,
        };
        
        // Benchmark simple hash operation
        baseline.simple_hash_ns = try self.benchmark_simple_hash();
        
        // Benchmark memory copy bandwidth
        baseline.memory_copy_gbps = try self.benchmark_memory_copy();
        
        // Benchmark CPU-intensive operation
        baseline.cpu_intensive_score = try self.benchmark_cpu_intensive();
        
        // Benchmark memory latency
        baseline.memory_latency_ns = try self.benchmark_memory_latency();
        
        return baseline;
    }
    
    fn benchmark_simple_hash(self: *RuntimeDetector) !u64 {
        _ = self;
        
        const iterations = 1000;
        const data = [_]u8{0x42} ** 64;
        
        const start_time = std.time.nanoTimestamp();
        
        var i: u32 = 0;
        while (i < iterations) : (i += 1) {
            var hasher = std.crypto.hash.sha2.Sha256.init(.{});
            hasher.update(&data);
            const result = hasher.finalResult();
            _ = result; // Prevent optimization
        }
        
        const end_time = std.time.nanoTimestamp();
        
        return @intCast((end_time - start_time) / iterations);
    }
    
    fn benchmark_memory_copy(self: *RuntimeDetector) !f64 {
        _ = self;
        
        const size = 1024 * 1024; // 1MB
        const iterations = 100;
        
        var source = try std.testing.allocator.alloc(u8, size);
        defer std.testing.allocator.free(source);
        
        var dest = try std.testing.allocator.alloc(u8, size);
        defer std.testing.allocator.free(dest);
        
        // Fill source with some data
        for (source, 0..) |*byte, i| {
            byte.* = @intCast(i & 0xFF);
        }
        
        const start_time = std.time.nanoTimestamp();
        
        var i: u32 = 0;
        while (i < iterations) : (i += 1) {
            @memcpy(dest, source);
        }
        
        const end_time = std.time.nanoTimestamp();
        
        const total_bytes = size * iterations;
        const time_seconds = @as(f64, @floatFromInt(end_time - start_time)) / 1_000_000_000.0;
        const gbps = (@as(f64, @floatFromInt(total_bytes)) / (1024.0 * 1024.0 * 1024.0)) / time_seconds;
        
        return gbps;
    }
    
    fn benchmark_cpu_intensive(self: *RuntimeDetector) !f64 {
        _ = self;
        
        const iterations = 100000;
        
        const start_time = std.time.nanoTimestamp();
        
        var result: u64 = 1;
        var i: u32 = 0;
        while (i < iterations) : (i += 1) {
            // Simple CPU-intensive operation
            result = result *% 1103515245 +% 12345; // Linear congruential generator
            result ^= result >> 16;
            result *%= 2147483647;
        }
        
        const end_time = std.time.nanoTimestamp();
        
        // Prevent optimization
        if (result == 0) unreachable;
        
        const time_ns = end_time - start_time;
        const ops_per_second = (@as(f64, @floatFromInt(iterations)) * 1_000_000_000.0) / @as(f64, @floatFromInt(time_ns));
        
        return ops_per_second / 1_000_000.0; // Convert to millions of ops per second
    }
    
    fn benchmark_memory_latency(self: *RuntimeDetector) !u64 {
        _ = self;
        
        const size = 1024 * 1024; // 1MB
        const iterations = 1000;
        
        var data = try std.testing.allocator.alloc(u64, size / 8);
        defer std.testing.allocator.free(data);
        
        // Create random access pattern
        for (data, 0..) |*value, i| {
            value.* = (i + 1) % data.len;
        }
        
        const start_time = std.time.nanoTimestamp();
        
        var index: usize = 0;
        var i: u32 = 0;
        while (i < iterations) : (i += 1) {
            index = data[index];
        }
        
        const end_time = std.time.nanoTimestamp();
        
        // Prevent optimization
        if (index >= data.len) unreachable;
        
        return @intCast((end_time - start_time) / iterations);
    }
    
    pub fn has_native_crypto_support(self: *const RuntimeDetector) bool {
        return switch (self.cpu_features.architecture) {
            .x86_64 => self.cpu_features.has_aes_ni or self.cpu_features.has_sha_ext,
            .aarch64 => self.cpu_features.has_crypto_ext,
            else => false,
        };
    }
    
    pub fn has_hardware_crypto_support(self: *const RuntimeDetector) bool {
        return self.has_native_crypto_support() and 
               (self.cpu_features.has_aes_ni or 
                self.cpu_features.has_crypto_ext or 
                self.cpu_features.has_sha_ext);
    }
    
    pub fn is_x86_64(self: *const RuntimeDetector) bool {
        return self.cpu_features.architecture == .x86_64;
    }
    
    pub fn is_arm64(self: *const RuntimeDetector) bool {
        return self.cpu_features.architecture == .aarch64;
    }
    
    pub fn is_wasm(self: *const RuntimeDetector) bool {
        return self.cpu_features.architecture == .wasm32;
    }
    
    pub fn has_aes_ni(self: *const RuntimeDetector) bool {
        return self.cpu_features.has_aes_ni;
    }
    
    pub fn has_crypto_extensions(self: *const RuntimeDetector) bool {
        return self.cpu_features.has_crypto_ext;
    }
    
    pub fn has_avx2(self: *const RuntimeDetector) bool {
        return self.cpu_features.has_avx2;
    }
    
    pub fn get_performance_category(self: *const RuntimeDetector) PerformanceCategory {
        const hash_threshold_fast = 100000; // 100μs
        const hash_threshold_slow = 1000000; // 1ms
        const memory_threshold_fast = 10.0; // 10 GB/s
        const memory_threshold_slow = 1.0;  // 1 GB/s
        
        const hash_fast = self.performance_baseline.simple_hash_ns < hash_threshold_fast;
        const hash_slow = self.performance_baseline.simple_hash_ns > hash_threshold_slow;
        const memory_fast = self.performance_baseline.memory_copy_gbps > memory_threshold_fast;
        const memory_slow = self.performance_baseline.memory_copy_gbps < memory_threshold_slow;
        
        if (hash_fast and memory_fast) {
            return .HighPerformance;
        } else if (hash_slow or memory_slow) {
            return .LowPerformance;
        } else {
            return .MediumPerformance;
        }
    }
    
    pub const PerformanceCategory = enum {
        HighPerformance,
        MediumPerformance,
        LowPerformance,
    };
    
    pub fn get_recommended_backends(self: *const RuntimeDetector, precompile_type: PrecompileType) []const BackendId {
        const perf_category = self.get_performance_category();
        
        return switch (precompile_type) {
            .SHA256 => switch (perf_category) {
                .HighPerformance => if (self.has_hardware_crypto_support())
                    &[_]BackendId{ .sha256_hardware_aes, .sha256_native_x86, .sha256_pure }
                else
                    &[_]BackendId{ .sha256_native_x86, .sha256_native_arm, .sha256_pure },
                .MediumPerformance => &[_]BackendId{ .sha256_native_x86, .sha256_native_arm, .sha256_pure },
                .LowPerformance => &[_]BackendId{ .sha256_pure },
            },
            .ECRECOVER => switch (perf_category) {
                .HighPerformance => if (self.has_hardware_crypto_support())
                    &[_]BackendId{ .ecrecover_hardware_crypto, .ecrecover_native_secp256k1, .ecrecover_pure }
                else
                    &[_]BackendId{ .ecrecover_native_secp256k1, .ecrecover_pure },
                .MediumPerformance => &[_]BackendId{ .ecrecover_native_secp256k1, .ecrecover_pure },
                .LowPerformance => &[_]BackendId{ .ecrecover_pure },
            },
            .RIPEMD160 => switch (perf_category) {
                .HighPerformance => &[_]BackendId{ .ripemd160_native_openssl, .ripemd160_pure },
                .MediumPerformance => &[_]BackendId{ .ripemd160_native_openssl, .ripemd160_pure },
                .LowPerformance => &[_]BackendId{ .ripemd160_pure },
            },
            .IDENTITY => &[_]BackendId{ .identity_pure },
            else => &[_]BackendId{},
        };
    }
};
```

#### 5. Adaptive Selector
```zig
pub const AdaptiveSelector = struct {
    selection_criteria: PrecompileBackendManager.BackendConfig.SelectionCriteria,
    backend_scores: std.HashMap(BackendId, AdaptiveScore, BackendIdContext, std.hash_map.default_max_load_percentage),
    selection_history: std.ArrayList(SelectionHistory),
    total_selections: u64,
    learning_rate: f64,
    
    pub const AdaptiveScore = struct {
        base_score: f64,
        adaptive_adjustment: f64,
        recent_performance: f64,
        usage_count: u64,
        last_updated: i64,
        confidence: f64,
        
        pub fn get_final_score(self: *const AdaptiveScore) f64 {
            return @max(0.0, @min(1.0, self.base_score + self.adaptive_adjustment));
        }
    };
    
    pub const SelectionHistory = struct {
        backend_id: BackendId,
        input_characteristics: PrecompileBackendManager.InputCharacteristics,
        actual_performance: f64,
        predicted_performance: f64,
        timestamp: i64,
        satisfaction_score: f64,
    };
    
    pub fn init(selection_criteria: PrecompileBackendManager.BackendConfig.SelectionCriteria) AdaptiveSelector {
        return AdaptiveSelector{
            .selection_criteria = selection_criteria,
            .backend_scores = std.HashMap(BackendId, AdaptiveScore, BackendIdContext, std.hash_map.default_max_load_percentage).init(std.heap.page_allocator),
            .selection_history = std.ArrayList(SelectionHistory).init(std.heap.page_allocator),
            .total_selections = 0,
            .learning_rate = 0.1,
        };
    }
    
    pub fn deinit(self: *AdaptiveSelector) void {
        self.backend_scores.deinit();
        self.selection_history.deinit();
    }
    
    pub fn adjust_score(
        self: *AdaptiveSelector,
        base_score: f64,
        backend_id: BackendId,
        input_characteristics: PrecompileBackendManager.InputCharacteristics
    ) f64 {
        var adaptive_score = self.backend_scores.getPtr(backend_id) orelse blk: {
            const new_score = AdaptiveScore{
                .base_score = base_score,
                .adaptive_adjustment = 0.0,
                .recent_performance = 0.5,
                .usage_count = 0,
                .last_updated = std.time.milliTimestamp(),
                .confidence = 0.5,
            };
            self.backend_scores.put(backend_id, new_score) catch return base_score;
            break :blk self.backend_scores.getPtr(backend_id).?;
        };
        
        // Update base score
        adaptive_score.base_score = base_score;
        adaptive_score.last_updated = std.time.milliTimestamp();
        
        // Apply adaptive adjustments based on historical performance
        const historical_adjustment = self.calculate_historical_adjustment(backend_id, input_characteristics);
        adaptive_score.adaptive_adjustment = historical_adjustment;
        
        // Apply exploration bonus for less-used backends
        const exploration_bonus = self.calculate_exploration_bonus(adaptive_score.usage_count);
        
        // Apply input-specific adjustments
        const input_adjustment = self.calculate_input_specific_adjustment(backend_id, input_characteristics);
        
        const final_score = adaptive_score.get_final_score() + exploration_bonus + input_adjustment;
        
        return @max(0.0, @min(1.0, final_score));
    }
    
    fn calculate_historical_adjustment(
        self: *AdaptiveSelector,
        backend_id: BackendId,
        input_characteristics: PrecompileBackendManager.InputCharacteristics
    ) f64 {
        var total_adjustment: f64 = 0.0;
        var sample_count: u32 = 0;
        
        // Look at recent history for similar input characteristics
        for (self.selection_history.items) |history| {
            if (history.backend_id == backend_id and 
                self.inputs_are_similar(history.input_characteristics, input_characteristics)) {
                
                const performance_ratio = history.actual_performance / @max(0.1, history.predicted_performance);
                
                // If actual performance exceeded prediction, give positive adjustment
                if (performance_ratio > 1.0) {
                    total_adjustment += (performance_ratio - 1.0) * 0.1;
                } else {
                    total_adjustment -= (1.0 - performance_ratio) * 0.1;
                }
                
                sample_count += 1;
            }
        }
        
        return if (sample_count > 0) total_adjustment / @as(f64, @floatFromInt(sample_count)) else 0.0;
    }
    
    fn calculate_exploration_bonus(self: *AdaptiveSelector, usage_count: u64) f64 {
        // Give bonus to less-used backends to encourage exploration
        const avg_usage = if (self.total_selections > 0) 
            @as(f64, @floatFromInt(self.total_selections)) / @as(f64, @floatFromInt(self.backend_scores.count()))
        else 
            1.0;
        
        const usage_ratio = @as(f64, @floatFromInt(usage_count)) / @max(1.0, avg_usage);
        
        if (usage_ratio < 0.5) {
            return 0.1 * (0.5 - usage_ratio); // Bonus for underutilized backends
        } else {
            return 0.0;
        }
    }
    
    fn calculate_input_specific_adjustment(
        self: *AdaptiveSelector,
        backend_id: BackendId,
        input_characteristics: PrecompileBackendManager.InputCharacteristics
    ) f64 {
        _ = self;
        
        // Adjust based on input size preferences for different backends
        var adjustment: f64 = 0.0;
        
        switch (backend_id) {
            .ecrecover_hardware_crypto, .sha256_hardware_aes => {
                // Hardware backends prefer larger inputs to amortize setup costs
                if (input_characteristics.input_size > 1024) {
                    adjustment += 0.05;
                } else {
                    adjustment -= 0.05;
                }
            },
            .identity_pure, .sha256_pure, .ripemd160_pure => {
                // Pure backends are consistent across all input sizes
                adjustment += 0.0;
            },
            else => {
                // Native backends perform well on medium to large inputs
                if (input_characteristics.input_size > 256 and input_characteristics.input_size < 4096) {
                    adjustment += 0.03;
                }
            },
        }
        
        // Adjust based on frequency requirements
        switch (input_characteristics.frequency_hint) {
            .Continuous, .Frequent => {
                // Prefer reliable backends for frequent operations
                switch (backend_id) {
                    .ecrecover_pure, .sha256_pure, .ripemd160_pure, .identity_pure => adjustment += 0.02,
                    else => {},
                }
            },
            .Rare => {
                // For rare operations, optimize for peak performance
                switch (backend_id) {
                    .ecrecover_hardware_crypto, .sha256_hardware_aes => adjustment += 0.03,
                    else => {},
                }
            },
            else => {},
        }
        
        // Adjust based on latency requirements
        switch (input_characteristics.latency_requirements) {
            .RealTime, .Interactive => {
                // Prefer backends with predictable performance
                switch (backend_id) {
                    .identity_pure => adjustment += 0.05,
                    .sha256_pure, .ripemd160_pure, .ecrecover_pure => adjustment += 0.02,
                    else => adjustment -= 0.01,
                }
            },
            .BestEffort => {
                // Allow more experimental backends
                adjustment += 0.0;
            },
            else => {},
        }
        
        return adjustment;
    }
    
    fn inputs_are_similar(
        self: *AdaptiveSelector,
        a: PrecompileBackendManager.InputCharacteristics,
        b: PrecompileBackendManager.InputCharacteristics
    ) bool {
        _ = self;
        
        // Consider inputs similar if they're in the same size range
        const size_diff = if (a.input_size > b.input_size) 
            a.input_size - b.input_size 
        else 
            b.input_size - a.input_size;
        
        const size_ratio = @as(f64, @floatFromInt(size_diff)) / @as(f64, @floatFromInt(@max(a.input_size, b.input_size)));
        
        return size_ratio < 0.5 and 
               a.complexity_hint == b.complexity_hint and
               a.frequency_hint == b.frequency_hint;
    }
    
    pub fn record_execution_result(
        self: *AdaptiveSelector,
        backend_id: BackendId,
        execution_time_ns: u64,
        input_size: usize,
        success: bool
    ) void {
        // Update backend usage count
        if (self.backend_scores.getPtr(backend_id)) |score| {
            score.usage_count += 1;
            
            // Update recent performance (exponential moving average)
            const performance = if (success) 
                1.0 / (@as(f64, @floatFromInt(execution_time_ns)) / 1000000.0) // Inverse of execution time in ms
            else 
                0.0;
            
            score.recent_performance = 0.8 * score.recent_performance + 0.2 * performance;
            score.last_updated = std.time.milliTimestamp();
        }
        
        self.total_selections += 1;
        
        // Add to selection history (keep last 1000 entries)
        const characteristics = PrecompileBackendManager.InputCharacteristics{
            .input_size = input_size,
            .complexity_hint = .Unknown,
            .frequency_hint = .Occasional,
            .latency_requirements = .BestEffort,
        };
        
        const actual_performance = if (success) 
            1000000.0 / @as(f64, @floatFromInt(execution_time_ns)) // Operations per second
        else 
            0.0;
        
        const history = SelectionHistory{
            .backend_id = backend_id,
            .input_characteristics = characteristics,
            .actual_performance = actual_performance,
            .predicted_performance = 0.5, // Would use actual prediction
            .timestamp = std.time.milliTimestamp(),
            .satisfaction_score = if (success) 1.0 else 0.0,
        };
        
        self.selection_history.append(history) catch return;
        
        // Limit history size
        if (self.selection_history.items.len > 1000) {
            _ = self.selection_history.orderedRemove(0);
        }
    }
    
    pub fn get_total_selections(self: *const AdaptiveSelector) u64 {
        return self.total_selections;
    }
    
    pub fn get_backend_usage_stats(self: *const AdaptiveSelector) std.HashMap(BackendId, UsageStats, BackendIdContext, std.hash_map.default_max_load_percentage) {
        var stats = std.HashMap(BackendId, UsageStats, BackendIdContext, std.hash_map.default_max_load_percentage).init(std.heap.page_allocator);
        
        var iterator = self.backend_scores.iterator();
        while (iterator.next()) |entry| {
            const usage_percentage = if (self.total_selections > 0)
                (@as(f64, @floatFromInt(entry.value_ptr.usage_count)) / @as(f64, @floatFromInt(self.total_selections))) * 100.0
            else
                0.0;
            
            const stat = UsageStats{
                .usage_count = entry.value_ptr.usage_count,
                .usage_percentage = usage_percentage,
                .recent_performance = entry.value_ptr.recent_performance,
                .confidence = entry.value_ptr.confidence,
                .last_used = entry.value_ptr.last_updated,
            };
            
            stats.put(entry.key_ptr.*, stat) catch continue;
        }
        
        return stats;
    }
    
    pub const UsageStats = struct {
        usage_count: u64,
        usage_percentage: f64,
        recent_performance: f64,
        confidence: f64,
        last_used: i64,
    };
    
    pub const BackendIdContext = struct {
        pub fn hash(self: @This(), key: BackendId) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: BackendId, b: BackendId) bool {
            _ = self;
            return a == b;
        }
    };
};
```

#### 6. Backend Cache
```zig
pub const BackendCache = struct {
    allocator: std.mem.Allocator,
    cache_entries: std.HashMap(u64, CacheEntry, CacheKeyContext, std.hash_map.default_max_load_percentage),
    cache_timeout_ms: u64,
    hit_count: u64,
    miss_count: u64,
    
    pub const CacheEntry = struct {
        selection: PrecompileBackendManager.BackendSelection,
        timestamp: i64,
        access_count: u32,
        
        pub fn is_expired(self: *const CacheEntry, timeout_ms: u64) bool {
            const now = std.time.milliTimestamp();
            return (now - self.timestamp) > @as(i64, @intCast(timeout_ms));
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, cache_timeout_ms: u64) BackendCache {
        return BackendCache{
            .allocator = allocator,
            .cache_entries = std.HashMap(u64, CacheEntry, CacheKeyContext, std.hash_map.default_max_load_percentage).init(allocator),
            .cache_timeout_ms = cache_timeout_ms,
            .hit_count = 0,
            .miss_count = 0,
        };
    }
    
    pub fn deinit(self: *BackendCache) void {
        self.cache_entries.deinit();
    }
    
    pub fn compute_key(
        self: *BackendCache,
        precompile_type: PrecompileBackendManager.PrecompileType,
        input_characteristics: PrecompileBackendManager.InputCharacteristics
    ) u64 {
        _ = self;
        
        // Create a hash key from precompile type and input characteristics
        var hasher = std.hash.Wyhash.init(0);
        
        // Hash precompile type
        hasher.update(std.mem.asBytes(&precompile_type));
        
        // Hash input characteristics
        hasher.update(std.mem.asBytes(&input_characteristics.input_size));
        hasher.update(std.mem.asBytes(&input_characteristics.complexity_hint));
        hasher.update(std.mem.asBytes(&input_characteristics.frequency_hint));
        hasher.update(std.mem.asBytes(&input_characteristics.latency_requirements));
        
        return hasher.final();
    }
    
    pub fn get(self: *BackendCache, key: u64) ?PrecompileBackendManager.BackendSelection {
        if (self.cache_entries.getPtr(key)) |entry| {
            if (!entry.is_expired(self.cache_timeout_ms)) {
                entry.access_count += 1;
                self.hit_count += 1;
                return entry.selection;
            } else {
                // Remove expired entry
                _ = self.cache_entries.remove(key);
                self.miss_count += 1;
                return null;
            }
        }
        
        self.miss_count += 1;
        return null;
    }
    
    pub fn put(
        self: *BackendCache,
        key: u64,
        selection: PrecompileBackendManager.BackendSelection
    ) void {
        const entry = CacheEntry{
            .selection = selection,
            .timestamp = std.time.milliTimestamp(),
            .access_count = 1,
        };
        
        self.cache_entries.put(key, entry) catch return;
        
        // Cleanup old entries if cache is getting too large
        if (self.cache_entries.count() > 1000) {
            self.cleanup_expired_entries();
        }
    }
    
    fn cleanup_expired_entries(self: *BackendCache) void {
        var keys_to_remove = std.ArrayList(u64).init(self.allocator);
        defer keys_to_remove.deinit();
        
        var iterator = self.cache_entries.iterator();
        while (iterator.next()) |entry| {
            if (entry.value_ptr.is_expired(self.cache_timeout_ms)) {
                keys_to_remove.append(entry.key_ptr.*) catch continue;
            }
        }
        
        for (keys_to_remove.items) |key| {
            _ = self.cache_entries.remove(key);
        }
    }
    
    pub fn get_hit_rate(self: *const BackendCache) f64 {
        const total_requests = self.hit_count + self.miss_count;
        return if (total_requests > 0)
            @as(f64, @floatFromInt(self.hit_count)) / @as(f64, @floatFromInt(total_requests))
        else
            0.0;
    }
    
    pub fn clear(self: *BackendCache) void {
        self.cache_entries.clearAndFree();
        self.hit_count = 0;
        self.miss_count = 0;
    }
    
    pub fn get_cache_statistics(self: *const BackendCache) CacheStatistics {
        return CacheStatistics{
            .total_entries = @intCast(self.cache_entries.count()),
            .hit_count = self.hit_count,
            .miss_count = self.miss_count,
            .hit_rate = self.get_hit_rate(),
            .cache_timeout_ms = self.cache_timeout_ms,
        };
    }
    
    pub const CacheStatistics = struct {
        total_entries: u32,
        hit_count: u64,
        miss_count: u64,
        hit_rate: f64,
        cache_timeout_ms: u64,
    };
    
    pub const CacheKeyContext = struct {
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

## Implementation Requirements

### Core Functionality
1. **Dynamic Backend Selection**: Choose optimal implementations based on runtime characteristics
2. **Performance Profiling**: Track execution metrics for all backends
3. **Runtime Detection**: Detect hardware features and runtime environment
4. **Adaptive Learning**: Improve selection decisions based on historical performance
5. **Fallback Management**: Ensure graceful degradation when preferred backends fail
6. **Caching System**: Cache selection decisions to reduce overhead

## Implementation Tasks

### Task 1: Implement Precompile Interface
File: `/src/evm/precompiles/precompile_interface.zig`
```zig
const std = @import("std");
const PrecompileBackendManager = @import("backend_selection/precompile_backend_manager.zig").PrecompileBackendManager;

pub const PrecompileInterface = struct {
    backend_manager: *PrecompileBackendManager,
    execution_context: ExecutionContext,
    
    pub const ExecutionContext = struct {
        gas_limit: u64,
        gas_used: *u64,
        caller: [20]u8,
        value: [32]u8,
        input_data: []const u8,
        output_buffer: []u8,
        static_call: bool,
    };
    
    pub fn init(backend_manager: *PrecompileBackendManager) PrecompileInterface {
        return PrecompileInterface{
            .backend_manager = backend_manager,
            .execution_context = undefined,
        };
    }
    
    pub fn execute_precompile(
        self: *PrecompileInterface,
        precompile_type: PrecompileBackendManager.PrecompileType,
        context: ExecutionContext
    ) !PrecompileResult {
        self.execution_context = context;
        
        // Analyze input characteristics
        const input_characteristics = self.analyze_input_characteristics(
            precompile_type,
            context.input_data
        );
        
        // Select optimal backend
        const selection = self.backend_manager.select_backend(
            precompile_type,
            input_characteristics
        );
        
        // Execute with selected backend
        const start_time = std.time.nanoTimestamp();
        const result = self.execute_with_backend(selection.backend_id, context) catch |err| {
            // Record execution failure
            self.backend_manager.record_execution_result(
                selection.backend_id,
                std.time.nanoTimestamp() - start_time,
                context.input_data.len,
                false
            );
            
            // Try fallback if available
            return self.execute_with_fallback(precompile_type, context, err);
        };
        
        const execution_time = std.time.nanoTimestamp() - start_time;
        
        // Record successful execution
        self.backend_manager.record_execution_result(
            selection.backend_id,
            execution_time,
            context.input_data.len,
            true
        );
        
        return PrecompileResult{
            .success = true,
            .gas_used = result.gas_used,
            .output_data = result.output_data,
            .backend_used = selection.backend_id,
            .execution_time_ns = execution_time,
            .selection_reason = selection.selection_reason,
        };
    }
    
    fn analyze_input_characteristics(
        self: *PrecompileInterface,
        precompile_type: PrecompileBackendManager.PrecompileType,
        input_data: []const u8
    ) PrecompileBackendManager.InputCharacteristics {
        _ = self;
        
        var characteristics = PrecompileBackendManager.InputCharacteristics{
            .input_size = input_data.len,
            .complexity_hint = .Unknown,
            .frequency_hint = .Occasional,
            .latency_requirements = .BestEffort,
        };
        
        // Analyze complexity based on precompile type and input size
        characteristics.complexity_hint = switch (precompile_type) {
            .IDENTITY => .Simple,
            .SHA256, .RIPEMD160 => if (input_data.len < 256) .Simple else if (input_data.len < 1024) .Moderate else .Complex,
            .ECRECOVER => .Moderate,
            .MODEXP => if (input_data.len < 1024) .Moderate else .Complex,
            .ECADD, .ECMUL => .Moderate,
            .ECPAIRING => .Complex,
            .BLAKE2F => .Moderate,
            .KZG_POINT_EVAL => .Complex,
        };
        
        // Infer frequency based on precompile type (could be enhanced with runtime tracking)
        characteristics.frequency_hint = switch (precompile_type) {
            .IDENTITY => .Frequent,
            .SHA256, .ECRECOVER => .Frequent,
            .RIPEMD160 => .Occasional,
            .MODEXP, .ECADD, .ECMUL => .Occasional,
            .ECPAIRING, .KZG_POINT_EVAL => .Rare,
            .BLAKE2F => .Occasional,
        };
        
        return characteristics;
    }
    
    fn execute_with_backend(
        self: *PrecompileInterface,
        backend_id: PrecompileBackendManager.BackendId,
        context: ExecutionContext
    ) !ExecutionResult {
        const registry = &self.backend_manager.backends;
        
        try registry.execute_backend(
            backend_id,
            context.input_data,
            context.output_buffer
        );
        
        // Calculate gas usage based on precompile and backend
        const gas_used = self.calculate_gas_usage(backend_id, context.input_data.len);
        
        return ExecutionResult{
            .gas_used = gas_used,
            .output_data = context.output_buffer, // Would be sized appropriately
        };
    }
    
    fn execute_with_fallback(
        self: *PrecompileInterface,
        precompile_type: PrecompileBackendManager.PrecompileType,
        context: ExecutionContext,
        original_error: anyerror
    ) !PrecompileResult {
        // Get pure fallback backend
        const fallback_backend = self.backend_manager.backends.get_pure_backend(precompile_type);
        
        const start_time = std.time.nanoTimestamp();
        const result = self.execute_with_backend(fallback_backend, context) catch {
            // If even the fallback fails, return the original error
            return original_error;
        };
        
        const execution_time = std.time.nanoTimestamp() - start_time;
        
        // Record fallback execution
        self.backend_manager.record_execution_result(
            fallback_backend,
            execution_time,
            context.input_data.len,
            true
        );
        
        return PrecompileResult{
            .success = true,
            .gas_used = result.gas_used,
            .output_data = result.output_data,
            .backend_used = fallback_backend,
            .execution_time_ns = execution_time,
            .selection_reason = .Fallback,
        };
    }
    
    fn calculate_gas_usage(self: *PrecompileInterface, backend_id: PrecompileBackendManager.BackendId, input_size: usize) u64 {
        _ = self;
        _ = backend_id;
        
        // Simplified gas calculation - would be more sophisticated in practice
        return @intCast(15 + (input_size * 3));
    }
    
    pub const ExecutionResult = struct {
        gas_used: u64,
        output_data: []u8,
    };
    
    pub const PrecompileResult = struct {
        success: bool,
        gas_used: u64,
        output_data: []u8,
        backend_used: PrecompileBackendManager.BackendId,
        execution_time_ns: u64,
        selection_reason: PrecompileBackendManager.SelectionReason,
    };
};
```

### Task 2: Integrate with VM Precompile Execution
File: `/src/evm/vm.zig` (modify existing)
```zig
const PrecompileBackendManager = @import("precompiles/backend_selection/precompile_backend_manager.zig").PrecompileBackendManager;
const PrecompileInterface = @import("precompiles/precompile_interface.zig").PrecompileInterface;

pub const Vm = struct {
    // Existing fields...
    precompile_backend_manager: ?PrecompileBackendManager,
    precompile_interface: ?PrecompileInterface,
    precompile_backend_enabled: bool,
    
    pub fn enable_precompile_backend_selection(self: *Vm, config: PrecompileBackendManager.BackendConfig) !void {
        self.precompile_backend_manager = try PrecompileBackendManager.init(self.allocator, config);
        if (self.precompile_backend_manager) |*manager| {
            self.precompile_interface = PrecompileInterface.init(manager);
        }
        self.precompile_backend_enabled = true;
    }
    
    pub fn disable_precompile_backend_selection(self: *Vm) void {
        if (self.precompile_backend_manager) |*manager| {
            manager.deinit();
            self.precompile_backend_manager = null;
            self.precompile_interface = null;
        }
        self.precompile_backend_enabled = false;
    }
    
    pub fn execute_precompile_optimized(
        self: *Vm,
        address: [20]u8,
        input_data: []const u8,
        gas_limit: u64
    ) !PrecompileInterface.PrecompileResult {
        if (!self.precompile_backend_enabled or self.precompile_interface == null) {
            return error.PrecompileBackendNotEnabled;
        }
        
        const precompile_type = self.address_to_precompile_type(address) orelse {
            return error.UnknownPrecompile;
        };
        
        var output_buffer = try self.allocator.alloc(u8, 1024); // Adjust size as needed
        defer self.allocator.free(output_buffer);
        
        var gas_used: u64 = 0;
        
        const context = PrecompileInterface.ExecutionContext{
            .gas_limit = gas_limit,
            .gas_used = &gas_used,
            .caller = [_]u8{0} ** 20, // Would get from call context
            .value = [_]u8{0} ** 32,  // Would get from call context
            .input_data = input_data,
            .output_buffer = output_buffer,
            .static_call = false, // Would get from call context
        };
        
        return self.precompile_interface.?.execute_precompile(precompile_type, context);
    }
    
    fn address_to_precompile_type(self: *Vm, address: [20]u8) ?PrecompileBackendManager.PrecompileType {
        _ = self;
        
        // Map precompile addresses to types
        if (std.mem.eql(u8, &address, &[_]u8{0} ** 19 ++ [_]u8{1})) { // 0x01
            return .ECRECOVER;
        } else if (std.mem.eql(u8, &address, &[_]u8{0} ** 19 ++ [_]u8{2})) { // 0x02
            return .SHA256;
        } else if (std.mem.eql(u8, &address, &[_]u8{0} ** 19 ++ [_]u8{3})) { // 0x03
            return .RIPEMD160;
        } else if (std.mem.eql(u8, &address, &[_]u8{0} ** 19 ++ [_]u8{4})) { // 0x04
            return .IDENTITY;
        } else if (std.mem.eql(u8, &address, &[_]u8{0} ** 19 ++ [_]u8{5})) { // 0x05
            return .MODEXP;
        } else if (std.mem.eql(u8, &address, &[_]u8{0} ** 19 ++ [_]u8{6})) { // 0x06
            return .ECADD;
        } else if (std.mem.eql(u8, &address, &[_]u8{0} ** 19 ++ [_]u8{7})) { // 0x07
            return .ECMUL;
        } else if (std.mem.eql(u8, &address, &[_]u8{0} ** 19 ++ [_]u8{8})) { // 0x08
            return .ECPAIRING;
        } else if (std.mem.eql(u8, &address, &[_]u8{0} ** 19 ++ [_]u8{9})) { // 0x09
            return .BLAKE2F;
        } else if (std.mem.eql(u8, &address, &[_]u8{0} ** 19 ++ [_]u8{10})) { // 0x0A
            return .KZG_POINT_EVAL;
        }
        
        return null;
    }
    
    pub fn get_precompile_backend_statistics(self: *Vm) ?PrecompileBackendManager.BackendStatistics {
        if (self.precompile_backend_manager) |*manager| {
            return manager.get_backend_statistics();
        }
        return null;
    }
    
    pub fn benchmark_precompile_backends(self: *Vm, precompile_type: PrecompileBackendManager.PrecompileType) !void {
        if (!self.precompile_backend_enabled or self.precompile_backend_manager == null) {
            return error.PrecompileBackendNotEnabled;
        }
        
        const test_data = try self.generate_test_data(precompile_type);
        defer self.allocator.free(test_data);
        
        const available_backends = self.precompile_backend_manager.?.backends.get_backends_for_precompile(precompile_type);
        
        std.log.info("Benchmarking {} backends for precompile {}", .{ available_backends.len, precompile_type });
        
        for (available_backends) |backend_id| {
            try self.benchmark_single_backend(backend_id, test_data);
        }
    }
    
    fn generate_test_data(self: *Vm, precompile_type: PrecompileBackendManager.PrecompileType) ![]u8 {
        const size = switch (precompile_type) {
            .ECRECOVER => 128,
            .SHA256, .RIPEMD160 => 256,
            .IDENTITY => 64,
            .MODEXP => 512,
            else => 128,
        };
        
        var data = try self.allocator.alloc(u8, size);
        
        // Fill with pseudo-random data
        for (data, 0..) |*byte, i| {
            byte.* = @intCast((i * 17 + 42) & 0xFF);
        }
        
        return data;
    }
    
    fn benchmark_single_backend(self: *Vm, backend_id: PrecompileBackendManager.BackendId, test_data: []const u8) !void {
        const iterations = 100;
        var total_time: u64 = 0;
        var success_count: u32 = 0;
        
        var output_buffer = try self.allocator.alloc(u8, 1024);
        defer self.allocator.free(output_buffer);
        
        for (0..iterations) |_| {
            const start_time = std.time.nanoTimestamp();
            
            const success = blk: {
                self.precompile_backend_manager.?.backends.execute_backend(
                    backend_id,
                    test_data,
                    output_buffer
                ) catch break :blk false;
                break :blk true;
            };
            
            const end_time = std.time.nanoTimestamp();
            
            if (success) {
                total_time += @intCast(end_time - start_time);
                success_count += 1;
            }
        }
        
        if (success_count > 0) {
            const avg_time = total_time / success_count;
            const success_rate = (@as(f64, @floatFromInt(success_count)) / @as(f64, @floatFromInt(iterations))) * 100.0;
            
            std.log.info("Backend {}: {} iterations, {d:.1}% success rate, {} ns avg", .{
                backend_id, iterations, success_rate, avg_time
            });
        } else {
            std.log.warn("Backend {}: All executions failed", .{backend_id});
        }
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/precompiles/precompile_backend_selection_test.zig`

### Test Cases
```zig
test "precompile backend manager initialization" {
    // Test manager creation with different configurations
    // Test backend registration and discovery
    // Test runtime detection functionality
}

test "backend selection logic" {
    // Test backend selection for different input characteristics
    // Test fallback selection when backends fail
    // Test adaptive selection based on performance history
}

test "performance profiling" {
    // Test execution time tracking
    // Test error rate monitoring
    // Test performance trend analysis
}

test "runtime detection" {
    // Test CPU feature detection
    // Test runtime environment detection
    // Test performance baseline measurement
}

test "adaptive learning" {
    // Test score adjustment based on historical performance
    // Test exploration vs exploitation balance
    // Test input-specific optimizations
}

test "backend caching" {
    // Test cache hit/miss functionality
    // Test cache expiration
    // Test cache key generation
}

test "precompile execution integration" {
    // Test end-to-end precompile execution
    // Test fallback mechanisms
    // Test gas calculation accuracy
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/precompiles/backend_selection/precompile_backend_manager.zig` - Main backend selection framework
- `/src/evm/precompiles/backend_selection/backend_registry.zig` - Backend registration and management
- `/src/evm/precompiles/backend_selection/performance_profiler.zig` - Performance monitoring and analysis
- `/src/evm/precompiles/backend_selection/runtime_detector.zig` - Runtime environment detection
- `/src/evm/precompiles/backend_selection/adaptive_selector.zig` - Adaptive selection algorithms
- `/src/evm/precompiles/backend_selection/backend_cache.zig` - Selection result caching
- `/src/evm/precompiles/precompile_interface.zig` - High-level precompile execution interface
- `/src/evm/vm.zig` - VM integration with backend selection
- `/test/evm/precompiles/precompile_backend_selection_test.zig` - Comprehensive tests

## Success Criteria

1. **Optimal Performance**: 20-50% performance improvement for crypto operations through backend selection
2. **Reliable Fallback**: 100% reliability through pure Zig fallback implementations
3. **Adaptive Optimization**: Measurable improvement in selection accuracy over time
4. **Low Overhead**: <2% performance overhead for selection logic
5. **Comprehensive Coverage**: Support for all standard Ethereum precompiles
6. **Runtime Flexibility**: Seamless operation across different deployment environments

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Fallback safety** - Pure implementations must always be available and functional
3. **Performance validation** - Must demonstrate measurable performance improvements
4. **Memory safety** - No corruption in backend switching or caching
5. **Error handling** - Graceful degradation when backends fail
6. **Platform compatibility** - Work across x86_64, ARM64, and WASM environments

## References

- [Ethereum Precompiled Contracts](https://ethereum.org/en/developers/docs/smart-contracts/precompiled/) - Standard precompile specifications
- [EVM Opcodes](https://www.evm.codes/precompiled) - Precompile gas costs and behavior
- [libsecp256k1](https://github.com/bitcoin-core/secp256k1) - High-performance elliptic curve library
- [OpenSSL](https://www.openssl.org/) - Comprehensive cryptography library
- [Performance Engineering](https://en.wikipedia.org/wiki/Performance_engineering) - Performance optimization methodologies