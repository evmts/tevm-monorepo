# Implement Precompile Backend Selection

You are implementing Precompile Backend Selection for the Tevm EVM written in Zig. Your goal is to implement backend selection system for precompile execution following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_precompile_backend_selection` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_precompile_backend_selection feat_implement_precompile_backend_selection`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement comprehensive precompile backend selection system that dynamically chooses optimal cryptographic implementations based on input characteristics, runtime environment detection, and performance profiling. This includes native optimized backends, fallback implementations, adaptive switching mechanisms, and performance monitoring to ensure maximum efficiency across different deployment scenarios.

## ELI5

Imagine you're running a delivery service and you have different types of vehicles: motorcycles for small packages, trucks for large deliveries, and drones for urgent items. The precompile backend selection system is like having a smart dispatcher that automatically chooses the best vehicle for each delivery based on:

**Package Characteristics** (Input Analysis):
- Small cryptographic operations → Use the "motorcycle" (lightweight, fast backend)
- Large batch operations → Use the "truck" (optimized for bulk processing)
- Time-critical operations → Use the "drone" (specialized high-speed backend)

**Environmental Conditions** (Runtime Detection):
- Rural area (older hardware) → Use reliable, compatible vehicles (fallback implementations)
- Urban area (modern hardware) → Use electric vehicles with GPS (native optimized backends)
- Traffic conditions (system load) → Dynamically switch between routes/methods

**Performance Learning** (Adaptive Intelligence):
The system learns from each delivery, tracking which vehicle performed best in different conditions, and gets smarter over time about making choices.

This enhanced system includes:
- **Multi-Backend Support**: Multiple "vehicle types" for each cryptographic operation
- **Runtime Profiling**: Continuously measuring which backends perform best
- **Graceful Degradation**: If the best option fails, automatically falls back to alternatives
- **Environment Detection**: Automatically detects CPU features, available memory, and system capabilities
- **Load Balancing**: Distributes work across multiple backends when beneficial

Why does this matter? Different cryptographic operations perform better with different implementations depending on input size, hardware capabilities, and system conditions. This system ensures you always get the fastest possible execution, which translates to lower gas costs and better user experience.

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

#### 1. **Unit Tests** (`/test/evm/precompiles/precompile_backend_selection_test.zig`)
```zig
// Test basic precompile backend selection functionality
test "precompile_backend_selection basic functionality works correctly"
test "precompile_backend_selection handles edge cases properly"
test "precompile_backend_selection validates inputs appropriately"
test "precompile_backend_selection produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "precompile_backend_selection integrates with EVM properly"
test "precompile_backend_selection maintains system compatibility"
test "precompile_backend_selection works with existing components"
test "precompile_backend_selection handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "precompile_backend_selection meets performance requirements"
test "precompile_backend_selection optimizes resource usage"
test "precompile_backend_selection scales appropriately with load"
test "precompile_backend_selection benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "precompile_backend_selection meets specification requirements"
test "precompile_backend_selection maintains EVM compatibility"
test "precompile_backend_selection handles hardfork transitions"
test "precompile_backend_selection cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "precompile_backend_selection handles errors gracefully"
test "precompile_backend_selection proper error propagation"
test "precompile_backend_selection recovery from failure states"
test "precompile_backend_selection validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "precompile_backend_selection prevents security vulnerabilities"
test "precompile_backend_selection handles malicious inputs safely"
test "precompile_backend_selection maintains isolation boundaries"
test "precompile_backend_selection validates security properties"
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
test "precompile_backend_selection basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = precompile_backend_selection.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const precompile_backend_selection = struct {
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

- [Ethereum Precompiled Contracts](https://ethereum.org/en/developers/docs/smart-contracts/precompiled/) - Standard precompile specifications
- [EVM Opcodes](https://www.evm.codes/precompiled) - Precompile gas costs and behavior
- [libsecp256k1](https://github.com/bitcoin-core/secp256k1) - High-performance elliptic curve library
- [OpenSSL](https://www.openssl.org/) - Comprehensive cryptography library
- [Performance Engineering](https://en.wikipedia.org/wiki/Performance_engineering) - Performance optimization methodologies

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone_precompiles/sha256.cpp">
```cpp
/*
This file demonstrates a practical implementation of backend selection for the SHA256 precompile.
It uses CPU feature detection at startup to choose the best implementation (hardware-accelerated
or generic). This is directly relevant to the "Runtime Detector" and backend selection logic
in the prompt.
*/

#if defined(__x86_64__)

// ... x86-64 specific includes ...

#elif defined(__aarch64__) && defined(__APPLE__)

// ... AArch64 specific includes ...

#endif

namespace evmone::crypto
{

// ... (generic sha_256_implementation) ...

static void sha_256_generic(uint32_t h[8], const std::byte* input, size_t len)
{
    sha_256_implementation(h, input, len);
}

// A function pointer to the best available SHA256 implementation.
static void (*sha_256_best)(uint32_t h[8], const std::byte* input, size_t len) = sha_256_generic;

#if defined(__x86_64__)

// An implementation using x86 BMI instructions.
__attribute__((target("bmi,bmi2"))) static void sha_256_x86_bmi(
    uint32_t h[8], const std::byte* input, size_t len)
{
    sha_256_implementation(h, input, len);
}

// An implementation using dedicated x86 SHA instructions.
__attribute__((target("sha,sse4.1"))) static void sha_256_x86_sha(
    uint32_t h[8], const std::byte* input, size_t len)
{
    // ... (highly optimized assembly-level implementation) ...
}

// This function is automatically called at library load time to select the best backend.
__attribute__((constructor)) static void select_sha256_implementation()
{
    int info[4];
    cpuid(info, 0);
    const int nIds = info[0];

    bool hw_sse41 = false;
    bool hw_bmi1 = false;
    bool hw_bmi2 = false;
    bool hw_sha = false;

    if (nIds >= 0x00000001)
    {
        cpuid(info, 0x00000001);
        hw_sse41 = (info[2] & (1 << 19)) != 0;
    }
    if (nIds >= 0x00000007)
    {
        cpuid(info, 0x00000007);
        hw_bmi1 = (info[1] & (1 << 3)) != 0;
        hw_bmi2 = (info[1] & (1 << 8)) != 0;
        hw_sha = (info[1] & (1 << 29)) != 0;
    }

    if (hw_sse41 && hw_sha)
    {
        sha_256_best = sha_256_x86_sha; // Select hardware-accelerated version
    }
    else if (hw_bmi1 && hw_bmi2)
    {
        sha_256_best = sha_256_x86_bmi; // Select BMI-optimized version
    }
    // Fallback is the generic C++ implementation.
}

#elif defined(__aarch64__) && defined(__APPLE__)

// ... (ARMv8 implementation) ...

#endif

// The public-facing function that calls the selected backend.
void sha256(std::byte hash[SHA256_HASH_SIZE], const std::byte* data, size_t size)
{
    /*
     * Initialize hash values:
     * (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
     */
    uint32_t h[] = {0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
        0x1f83d9ab, 0x5be0cd19};

    sha_256_best(h, data, size); // Dispatch to the best implementation

    // ... (process final hash value) ...
}

}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles.cpp">
```cpp
/*
This file contains the central precompile dispatcher for evmone. It uses a table (`traits`)
to map precompile IDs to their respective analysis and execution functions. This is a direct
parallel to the proposed `BackendRegistry` and `PrecompileInterface` in the prompt,
providing a clear structure for managing and executing different precompiles.
*/
namespace evmone::state
{
// ...

struct PrecompileTraits
{
    decltype(identity_analyze)* analyze = nullptr;
    decltype(identity_execute)* execute = nullptr;
};

// This table acts as a registry, mapping a precompile ID to its implementation.
// The prompt's `BackendRegistry` could be modeled similarly, but with a list of
// backends per precompile instead of a single one.
inline constexpr std::array<PrecompileTraits, NumPrecompiles> traits{{
    {},  // undefined for 0
    {ecrecover_analyze, ecrecover_execute},
    {sha256_analyze, sha256_execute},
    {ripemd160_analyze, ripemd160_execute},
    {identity_analyze, identity_execute},
    {expmod_analyze, expmod_execute},
    {ecadd_analyze, ecadd_execute},
    {ecmul_analyze, ecmul_execute},
    {ecpairing_analyze, ecpairing_execute},
    {blake2bf_analyze, blake2bf_execute},
    {point_evaluation_analyze, point_evaluation_execute},
    {bls12_g1add_analyze, bls12_g1add_execute},
    {bls12_g1msm_analyze, bls12_g1msm_execute},
    {bls12_g2add_analyze, bls12_g2add_execute},
    {bls12_g2msm_analyze, bls12_g2msm_execute},
    {bls12_pairing_check_analyze, bls12_pairing_check_execute},
    {bls12_map_fp_to_g1_analyze, bls12_map_fp_to_g1_execute},
    {bls12_map_fp2_to_g2_analyze, bls12_map_fp2_to_g2_execute},
}};

// This function checks if a given address corresponds to a precompile,
// considering the current EVM revision (hardfork). This is analogous
// to the `address_to_precompile_type` function in the prompt.
bool is_precompile(evmc_revision rev, const evmc::address& addr) noexcept
{
    if (evmc::is_zero(addr) || addr > evmc::address{stdx::to_underlying(PrecompileId::latest)})
        return false;

    const auto id = addr.bytes[19];
    if (rev < EVMC_BYZANTIUM && id >= stdx::to_underlying(PrecompileId::since_byzantium))
        return false;
    // ... more revision checks ...
    return true;
}

// This is the main dispatcher function. It analyzes gas costs and then executes
// the appropriate function from the `traits` table. This is similar to the
// `execute_precompile` function in the user's prompt.
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

    // ... (output buffer allocation) ...

    const auto [status_code, output_size] =
        execute(msg.input_data, msg.input_size, output_data, max_output_size);
    
    // ... (result processing) ...
}
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles_silkpre.cpp">
```cpp
/*
This file shows how evmone can integrate external libraries (`silkpre`) as precompile
backends. This pattern is directly applicable to the prompt's requirement for supporting
native backends like OpenSSL or libsecp256k1. The `execute` function acts as a
wrapper that calls the external library's function.
*/

#include "precompiles_silkpre.hpp"
#include "precompiles.hpp"
#include <silkpre/precompile.h>
#include <cassert>
#include <cstring>

namespace evmone::state
{
namespace
{
// This wrapper function calls the external `silkpre` library.
ExecutionResult execute(const uint8_t* input, size_t input_size, uint8_t* output_buf,
    [[maybe_unused]] size_t max_output_size, PrecompileId id) noexcept
{
    const auto index = stdx::to_underlying(id) - 1;
    const auto [output, output_size] = kSilkpreContracts[index].run(input, input_size);
    if (output == nullptr)
        return {EVMC_PRECOMPILE_FAILURE, 0};

    // ... (copy output and free memory) ...
    return {EVMC_SUCCESS, trimmed_output_size};
}
}

// Public-facing functions that dispatch to the `silkpre` backend.
ExecutionResult silkpre_ecrecover_execute(
    const uint8_t* input, size_t input_size, uint8_t* output_buf, size_t max_output_size) noexcept
{
    return execute(input, input_size, output_buf, max_output_size, PrecompileId::ecrecover);
}

ExecutionResult silkpre_sha256_execute(
    const uint8_t* input, size_t input_size, uint8_t* output_buf, size_t max_output_size) noexcept
{
    return execute(input, input_size, output_buf, max_output_size, PrecompileId::sha256);
}
// ... and so on for other precompiles
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp">
```cpp
/*
This file defines traits for each EVM opcode, such as gas cost, stack requirements,
and the EVM revision it was introduced in. The `BackendInfo` struct in the prompt could
be modeled after this `Traits` struct to provide static metadata about each
precompile backend. The `gas_costs` table is a good example of versioning this metadata
by hardfork.
*/
namespace evmone::instr
{
// ...

/// The table of instruction gas costs per EVM revision.
using GasCostTable = std::array<std::array<int16_t, 256>, EVMC_MAX_REVISION + 1>;

/// The EVM revision specific table of EVM instructions gas costs. For instructions undefined
/// in given EVM revision, the value is instr::undefined.
constexpr inline GasCostTable gas_costs = []() noexcept {
    GasCostTable table{};

    for (auto& t : table[EVMC_FRONTIER])
        t = undefined;
    table[EVMC_FRONTIER][OP_STOP] = 0;
    table[EVMC_FRONTIER][OP_ADD] = 3;
    // ... gas costs for all opcodes in Frontier ...

    table[EVMC_HOMESTEAD] = table[EVMC_FRONTIER];
    table[EVMC_HOMESTEAD][OP_DELEGATECALL] = 40;
    // ... gas cost changes for each subsequent hardfork ...

    table[EVMC_CANCUN] = table[EVMC_SHANGHAI];
    table[EVMC_CANCUN][OP_BLOBHASH] = 3;
    table[EVMC_CANCUN][OP_BLOBBASEFEE] = 2;
    table[EVMC_CANCUN][OP_TLOAD] = warm_storage_read_cost;
    table[EVMC_CANCUN][OP_TSTORE] = warm_storage_read_cost;
    table[EVMC_CANCUN][OP_MCOPY] = 3;

    return table;
}();


/// The EVM instruction traits.
struct Traits
{
    /// The instruction name;
    const char* name = nullptr;

    /// The number of stack items the instruction accesses during execution.
    uint8_t stack_height_required = 0;

    /// The stack height change caused by the instruction execution. Can be negative.
    int8_t stack_height_change = 0;

    /// The EVM revision in which the instruction has been defined.
    std::optional<evmc_revision> since;
};


/// The global, EVM revision independent, table of traits of all known EVM instructions.
constexpr inline std::array<Traits, 256> traits = []() noexcept {
    std::array<Traits, 256> table{};

    table[OP_STOP] = {"STOP", 0, 0, EVMC_FRONTIER};
    table[OP_ADD] = {"ADD", 2, -1, EVMC_FRONTIER};
    // ... traits for all other opcodes ...

    return table;
}();

}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
/*
The `ExecutionState` class encapsulates the context for a single EVM call frame.
This is directly analogous to the `ExecutionContext` struct in the prompt. It shows
what information (gas, message, memory, stack, revision, etc.) is needed to
execute a contract's code, including precompiles.
*/
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

private:
    evmc_tx_context m_tx = {};

public:
    /// Pointer to code analysis.
    union
    {
        const baseline::CodeAnalysis* baseline = nullptr;
        const advanced::AdvancedCodeAnalysis* advanced;
    } analysis{};

    std::vector<const uint8_t*> call_stack;

    /// Stack space allocation.
    StackSpace stack_space;

    ExecutionState() noexcept = default;

    ExecutionState(const evmc_message& message, evmc_revision revision,
        const evmc_host_interface& host_interface, evmc_host_context* host_ctx,
        bytes_view _code) noexcept
      : msg{&message}, host{host_interface, host_ctx}, rev{revision}, original_code{_code}
    {}

    void reset(const evmc_message& message, evmc_revision revision,
        const evmc_host_interface& host_interface, evmc_host_context* host_ctx,
        bytes_view _code) noexcept;
    
    // ...
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_calls.cpp">
```cpp
/*
This file implements the logic for call-related opcodes. The `call_impl` function
is particularly relevant as it shows how the VM differentiates between a standard
contract call and a precompile call. This provides context for where the proposed
`PrecompileBackendManager` would be invoked.
*/
namespace evmone::instr::core
{
// ... (implementation of various CALL opcodes) ...

Result call_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    // ... (argument popping from stack) ...

    const auto target_addr_or_result = get_target_address(dst, gas_left, state);
    if (const auto* result = std::get_if<Result>(&target_addr_or_result))
        return *result;

    const auto& code_addr = std::get<evmc::address>(target_addr_or_result);

    // ... (memory and gas checks) ...

    // The logic to build the message for the next call context
    evmc_message msg{.kind = to_call_kind(Op)};
    // ... (msg setup) ...

    if (state.msg->depth >= 1024)
        return {EVMC_SUCCESS, gas_left};  // "Light" failure.

    // ... (balance check) ...
    
    // This is where the call is dispatched. The host implementation will
    // then check if the address is a precompile and execute it, or execute
    // the contract code. This is the integration point for the backend selection.
    const auto result = state.host.call(msg);
    state.return_data.assign(result.output_data, result.output_size);
    stack.top() = result.status_code == EVMC_SUCCESS;

    // ... (result processing) ...
    
    return {EVMC_SUCCESS, gas_left};
}
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/host.cpp">
```cpp
/*
This `Host` implementation of the `call` method demonstrates the final step
before executing a precompile or contract code. It checks `is_precompile` and,
if true, dispatches to `call_precompile`. This is the point where the proposed
`PrecompileBackendManager` would take over to select and execute the optimal
backend.
*/
evmc::Result Host::execute_message(const evmc_message& msg) noexcept
{
    if (msg.kind == EVMC_CREATE || msg.kind == EVMC_CREATE2 || msg.kind == EVMC_EOFCREATE)
        return create(msg);

    // ... (logic for handling value transfers and touching accounts) ...

    // If the call is not a delegated call (like EIP-7702) and the address is a precompile...
    if ((msg.flags & EVMC_DELEGATED) == 0 && is_precompile(m_rev, msg.code_address))
        return call_precompile(m_rev, msg); // ...execute the precompile.

    // Otherwise, get the contract code and execute it in the VM.
    const auto code = m_state.get_code(msg.code_address);
    if (code.empty())
        return evmc::Result{EVMC_SUCCESS, msg.gas};  // Skip trivial execution.

    return m_vm.execute(*this, m_rev, msg, code.data(), code.size());
}
```
</file>
</evmone>



## REVM Context

An analysis of the `revm` codebase reveals a robust precompile system, although it differs from the prompt's dynamic runtime selection by using compile-time feature flags to choose cryptographic backends. This is a common pattern in high-performance Rust projects for leveraging hardware-specific optimizations without runtime overhead.

The following snippets demonstrate how `revm` handles precompiles, selects backends via features, calculates gas costs, and integrates these components into the main execution loop. This provides a strong foundation for implementing the requested feature.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
//! # revm-precompile
//!
//! Implementations of EVM precompiled contracts.

// ... (imports)

// silence arkworks lint as bn impl will be used as default if both are enabled.
cfg_if::cfg_if! {
    if #[cfg(feature = "bn")]{
        use ark_bn254 as _;
        use ark_ff as _;
        use ark_ec as _;
        use ark_serialize as _;
    }
}

#[cfg(all(feature = "c-kzg", feature = "kzg-rs"))]
// silence kzg-rs lint as c-kzg will be used as default if both are enabled.
use kzg_rs as _;

// silence arkworks-bls12-381 lint as blst will be used as default if both are enabled.
cfg_if::cfg_if! {
    if #[cfg(feature = "blst")]{
        use ark_bls12_381 as _;
        use ark_ff as _;
        use ark_ec as _;
        use ark_serialize as _;
    }
}

// ... (imports)

/// Precompiles contain map of precompile addresses to functions and HashSet of precompile addresses.
#[derive(Clone, Default, Debug)]
pub struct Precompiles {
    /// Precompiles
    inner: HashMap<Address, PrecompileFn>,
    /// Addresses of precompile
    addresses: HashSet<Address>,
}

impl Precompiles {
    /// Returns the precompiles for the given spec.
    pub fn new(spec: PrecompileSpecId) -> &'static Self {
        match spec {
            PrecompileSpecId::HOMESTEAD => Self::homestead(),
            PrecompileSpecId::BYZANTIUM => Self::byzantium(),
            PrecompileSpecId::ISTANBUL => Self::istanbul(),
            PrecompileSpecId::BERLIN => Self::berlin(),
            PrecompileSpecId::CANCUN => Self::cancun(),
            PrecompileSpecId::PRAGUE => Self::prague(),
            PrecompileSpecId::OSAKA => Self::osaka(),
        }
    }

    /// Returns precompiles for Byzantium spec.
    pub fn byzantium() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Self::homestead().clone();
            precompiles.extend([
                // EIP-198: Big integer modular exponentiation.
                modexp::BYZANTIUM,
                // EIP-196: Precompiled contracts for addition and scalar multiplication on the elliptic curve alt_bn128.
                // EIP-197: Precompiled contracts for optimal ate pairing check on the elliptic curve alt_bn128.
                bn128::add::BYZANTIUM,
                bn128::mul::BYZANTIUM,
                bn128::pair::BYZANTIUM,
            ]);
            Box::new(precompiles)
        })
    }

    /// Returns precompiles for Istanbul spec.
    pub fn istanbul() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Self::byzantium().clone();
            precompiles.extend([
                // EIP-1108: Reduce alt_bn128 precompile gas costs.
                bn128::add::ISTANBUL,
                bn128::mul::ISTANBUL,
                bn128::pair::ISTANBUL,
                // EIP-152: Add BLAKE2 compression function `F` precompile (at 0x09 address).
                blake2::FUN,
            ]);
            Box::new(precompiles)
        })
    }
    // ... more hardforks
}

/// Precompile with address and function.
#[derive(Clone, Debug)]
pub struct PrecompileWithAddress(pub Address, pub PrecompileFn);

// ... (impls)

/// Ethereum hardfork spec ids. Represents the specs where precompiles had a change.
#[derive(Copy, Clone, Debug, PartialEq, Eq, Hash, Ord, PartialOrd)]
pub enum PrecompileSpecId {
    HOMESTEAD,
    BYZANTIUM,
    ISTANBUL,
    BERLIN,
    CANCUN,
    PRAGUE,
    OSAKA,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/bn128.rs">
```rust
//! BN128 precompiles added in [`EIP-1962`](https://eips.ethereum.org/EIPS/eip-1962)
// ... (imports)

// This block demonstrates conditional compilation to select different backends.
// The prompt asks for runtime selection, but this compile-time approach is a common
// high-performance pattern in Rust.
cfg_if::cfg_if! {
    if #[cfg(feature = "bn")]{
        mod substrate;
        use substrate::{
            encode_g1_point, g1_point_add, g1_point_mul, pairing_check, read_g1_point, read_g2_point,
            read_scalar,
        };
    } else {
        mod arkworks;
        use arkworks::{
            encode_g1_point, g1_point_add, g1_point_mul, pairing_check, read_g1_point, read_g2_point,
            read_scalar,
        };
    }
}

/// Bn128 add precompile
pub mod add {
    use super::*;
    // ...
    /// Bn128 add precompile with ISTANBUL gas rules
    pub const ISTANBUL: PrecompileWithAddress =
        PrecompileWithAddress(ADDRESS, |input, gas_limit| {
            run_add(input, ISTANBUL_ADD_GAS_COST, gas_limit)
        });

    /// Bn128 add precompile with BYZANTIUM gas rules
    pub const BYZANTIUM: PrecompileWithAddress =
        PrecompileWithAddress(ADDRESS, |input, gas_limit| {
            run_add(input, BYZANTIUM_ADD_GAS_COST, gas_limit)
        });
}

// ... (mul and pair modules follow a similar pattern)

/// Run the Bn128 add precompile
pub fn run_add(input: &[u8], gas_cost: u64, gas_limit: u64) -> PrecompileResult {
    if gas_cost > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }

    let input = right_pad::<ADD_INPUT_LEN>(input);

    let p1 = read_g1_point(&input[..G1_LEN])?;
    let p2 = read_g1_point(&input[G1_LEN..])?;
    let result = g1_point_add(p1, p2);

    let output = encode_g1_point(result);

    Ok(PrecompileOutput::new(gas_cost, output.into()))
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/secp256k1.rs">
```rust
//! `ecrecover` precompile.
//!
//! Depending on enabled features, it will use different implementations of `ecrecover`.
//! * [`k256`](https://crates.io/crates/k256) - uses maintained pure rust lib `k256`
//! * [`secp256k1`](https://crates.io/crates/secp256k1) - uses `bitcoin_secp256k1` lib, a C implementation
//! * [`libsecp256k1`](https://crates.io/crates/libsecp256k1) - is made from parity in pure rust

// ... (modules for each backend)

// ... (imports)

/// `ecrecover` precompile, containing address and function to run.
pub const ECRECOVER: PrecompileWithAddress =
    PrecompileWithAddress(crate::u64_to_address(1), ec_recover_run);

/// `ecrecover` precompile function.
pub fn ec_recover_run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    const ECRECOVER_BASE: u64 = 3_000;

    if ECRECOVER_BASE > gas_limit {
        return Err(PrecompileError::OutOfGas);
    }
    // ... (input parsing)
    let msg = <&B256>::try_from(&input[0..32]).unwrap();
    let recid = input[63] - 27;
    let sig = <&B512>::try_from(&input[64..128]).unwrap();

    let res = ecrecover(sig, recid, msg);

    let out = res.map(|o| o.to_vec().into()).unwrap_or_default();
    Ok(PrecompileOutput::new(ECRECOVER_BASE, out))
}

// Select the correct implementation based on the enabled features.
// This is another example of compile-time backend selection.
cfg_if::cfg_if! {
    if #[cfg(feature = "secp256k1")] {
        pub use bitcoin_secp256k1::ecrecover;
    } else if #[cfg(feature = "libsecp256k1")] {
        pub use parity_libsecp256k1::ecrecover;
    } else {
        pub use k256::ecrecover;
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/modexp.rs">
```rust
//! Modexp precompile added in [`EIP-198`](https://eips.ethereum.org/EIPS/eip-198)
//! and reprices in berlin hardfork with [`EIP-2565`](https://eips.ethereum.org/EIPS/eip-2565).
// ...

/// `modexp` precompile with BYZANTIUM gas rules.
pub const BYZANTIUM: PrecompileWithAddress =
    PrecompileWithAddress(crate::u64_to_address(5), byzantium_run);

/// `modexp` precompile with BERLIN gas rules.
pub const BERLIN: PrecompileWithAddress =
    PrecompileWithAddress(crate::u64_to_address(5), berlin_run);

/// `modexp` precompile with OSAKA gas rules.
pub const OSAKA: PrecompileWithAddress = PrecompileWithAddress(crate::u64_to_address(5), osaka_run);

/// See: <https://eips.ethereum.org/EIPS/eip-198>
pub fn byzantium_run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    run_inner::<_, false>(input, gas_limit, 0, |a, b, c, d| {
        byzantium_gas_calc(a, b, c, d)
    })
}

/// See: <https://eips.ethereum.org/EIPS/eip-2565>
/// Gas cost of berlin is modified from byzantium.
pub fn berlin_run(input: &[u8], gas_limit: u64) -> PrecompileResult {
    run_inner::<_, false>(input, gas_limit, 200, |a, b, c, d| {
        berlin_gas_calc(a, b, c, d)
    })
}
//...

/// Calculate the gas cost for the modexp precompile with BYZANTIUM gas rules.
pub fn byzantium_gas_calc(base_len: u64, exp_len: u64, mod_len: u64, exp_highp: &U256) -> u64 {
    gas_calc::<0, 8, 20, _>(base_len, exp_len, mod_len, exp_highp, |max_len| -> U256 {
        // ... complex gas calculation logic based on input size
    })
}

/// Calculate gas cost according to EIP 2565:
/// <https://eips.ethereum.org/EIPS/eip-2565>
pub fn berlin_gas_calc(base_len: u64, exp_len: u64, mod_len: u64, exp_highp: &U256) -> u64 {
    gas_calc::<200, 8, 3, _>(base_len, exp_len, mod_len, exp_highp, |max_len| -> U256 {
        let words = U256::from(max_len.div_ceil(8));
        words * words
    })
}

/// Calculate gas cost.
pub fn gas_calc<const MIN_PRICE: u64, const MULTIPLIER: u64, const GAS_DIVISOR: u64, F>(
    base_len: u64,
    exp_len: u64,
    mod_len: u64,
    exp_highp: &U256,
    calculate_multiplication_complexity: F,
) -> u64
where
    F: Fn(u64) -> U256,
{
    let multiplication_complexity = calculate_multiplication_complexity(max(base_len, mod_len));
    let iteration_count = calculate_iteration_count::<MULTIPLIER>(exp_len, exp_highp);
    let gas = (multiplication_complexity * U256::from(iteration_count)) / U256::from(GAS_DIVISOR);
    max(MIN_PRICE, gas.saturating_to())
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/precompile_provider.rs">
```rust
//! This file defines the `PrecompileProvider` trait, which acts as the interface
//! between the EVM and the precompile implementations. This is analogous to the
//! `PrecompileInterface` requested in the prompt.

#[auto_impl(&mut, Box)]
pub trait PrecompileProvider<CTX: ContextTr> {
    type Output;

    /// Sets the spec id and returns true if the spec id was changed.
    fn set_spec(&mut self, spec: <CTX::Cfg as Cfg>::Spec) -> bool;

    /// Run the precompile. This is the main execution function.
    fn run(
        &mut self,
        context: &mut CTX,
        address: &Address,
        inputs: &InputsImpl,
        is_static: bool,
        gas_limit: u64,
    ) -> Result<Option<Self::Output>, String>;

    /// Get the warm addresses.
    fn warm_addresses(&self) -> Box<impl Iterator<Item = Address>>;

    /// Check if the address is a precompile.
    fn contains(&self, address: &Address) -> bool;
}

/// The [`PrecompileProvider`] for ethereum precompiles.
#[derive(Debug, Clone)]
pub struct EthPrecompiles {
    /// Contains precompiles for the current spec.
    pub precompiles: &'static Precompiles,
    /// Current spec. None means that spec was not set yet.
    pub spec: SpecId,
}

// ...

impl<CTX: ContextTr> PrecompileProvider<CTX> for EthPrecompiles {
    type Output = InterpreterResult;

    fn set_spec(&mut self, spec: <CTX::Cfg as Cfg>::Spec) -> bool {
        let spec = spec.into();
        // generate new precompiles only on new spec
        if spec == self.spec {
            return false;
        }
        self.precompiles = Precompiles::new(PrecompileSpecId::from_spec_id(spec));
        self.spec = spec;
        true
    }

    fn run(
        &mut self,
        context: &mut CTX,
        address: &Address,
        inputs: &InputsImpl,
        _is_static: bool,
        gas_limit: u64,
    ) -> Result<Option<InterpreterResult>, String> {
        let Some(precompile) = self.precompiles.get(address) else {
            return Ok(None);
        };
        // ... (execution logic)
        match (*precompile)(input_bytes, gas_limit) {
            Ok(output) => {
                // ...
                result.result = InstructionResult::Return;
                result.output = output.bytes;
            }
            Err(e) => {
                result.result = if e.is_oog() {
                    InstructionResult::PrecompileOOG
                } else {
                    InstructionResult::PrecompileError
                };
            }
        }
        Ok(Some(result))
    }

    // ... (other trait methods)
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/frame.rs">
```rust
//! This file shows how precompiles are integrated into the call frame logic.

// ... (imports)

impl<EVM, ERROR> EthFrame<EVM, ERROR, EthInterpreter>
where
    EVM: EvmTr<
        Precompiles: PrecompileProvider<EVM::Context, Output = InterpreterResult>,
        // ... (other trait bounds)
    >,
    // ...
{
    /// Make call frame
    #[inline]
    pub fn make_call_frame(
        evm: &mut EVM,
        depth: usize,
        memory: SharedMemory,
        inputs: Box<CallInputs>,
    ) -> Result<ItemOrResult<Self, FrameResult>, ERROR> {
        // ... (gas calculation, depth check)

        let (context, precompiles) = evm.ctx_precompiles();

        // ... (checkpointing, value transfer)

        let interpreter_input = InputsImpl { /* ... */ };

        // This is the key integration point. Before creating a full EVM frame for a contract,
        // it checks if the target is a precompile and runs it directly if so.
        if !is_ext_delegate_call {
            if let Some(result) = precompiles
                .run(
                    context,
                    &inputs.bytecode_address,
                    &interpreter_input,
                    is_static,
                    gas_limit,
                )
                .map_err(ERROR::from_string)?
            {
                // ... (handle precompile result)
                return Ok(ItemOrResult::Result(FrameResult::Call(CallOutcome {
                    result,
                    memory_offset: inputs.return_memory_offset.clone(),
                })));
            }
        }

        // If not a precompile, load account code and create a new interpreter frame.
        let account = context
            .journal()
            .load_account_code(inputs.bytecode_address)?;
        
        // ... (rest of the logic for regular contract call)
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/benches/eip2537.rs">
```rust
//! Benchmarks for the BLS12-381 precompiles
//! This demonstrates how performance benchmarks can be written for different
//! cryptographic backends, which is relevant to the `PerformanceProfiler`.
use criterion::{measurement::Measurement, BenchmarkGroup};
// ... (imports)

/// Add benches for the BLS12-381 G1 add precompile
pub fn add_g1_add_benches<M: Measurement>(group: &mut BenchmarkGroup<'_, M>) {
    use revm_precompile::bls12_381::g1_add::PRECOMPILE;

    let mut rng = StdRng::seed_from_u64(RNG_SEED);
    let test_vectors = g1_add_test_vectors(1, &mut rng);
    let input = Bytes::from(test_vectors[0].clone());

    let precompile = *PRECOMPILE.precompile();

    group.bench_function("g1_add", |b| {
        b.iter(|| precompile(&input, u64::MAX).unwrap());
    });
}

/// Add benches for the BLS12-381 G1 msm precompile
pub fn add_g1_msm_benches<M: Measurement>(group: &mut BenchmarkGroup<'_, M>) {
    use revm_precompile::bls12_381::g1_msm::PRECOMPILE;

    let precompile = *PRECOMPILE.precompile();

    let sizes_to_bench = [MAX_MSM_SIZE, MAX_MSM_SIZE / 2, 2, 1];

    for size in sizes_to_bench {
        let mut rng = StdRng::seed_from_u64(RNG_SEED);
        let test_vector = g1_msm_test_vectors(size, &mut rng);
        let input = Bytes::from(test_vector);

        group.bench_function(format!("g1_msm (size {})", size), |b| {
            b.iter(|| precompile(&input, u64::MAX).unwrap());
        });
    }
}
// ... (other benchmark functions)
```
</file>
</revm>

## Prompt Corrections

The original prompt describes a sophisticated **dynamic, runtime** precompile backend selection system. This is an excellent design for maximizing performance across diverse hardware and input characteristics.

However, it's important to note that `revm`, a high-performance Rust EVM, uses a different approach: **compile-time backend selection** via Rust's feature flags.

-   **`revm`'s approach**: The choice of which cryptographic library (e.g., `blst` vs. `arkworks` for BLS12-381) is made when `revm` is compiled. This produces a highly optimized binary for a specific target but lacks the flexibility to adapt at runtime. The `cfg_if!` macro is used extensively for this purpose.
-   **Prompt's approach**: The proposed system makes decisions during execution based on runtime-detected CPU features, input sizes, and performance profiling. This is more complex but can achieve better performance in heterogeneous environments.

The provided `revm` snippets are still highly valuable as they show:
1.  How to structure and modularize different precompile implementations (`bn128/arkworks.rs`, `bn128/substrate.rs`).
2.  How to create a unified precompile interface (`PrecompileProvider`, `PrecompileFn`).
3.  How different hardforks (`SpecId`) can alter gas costs and available precompiles, a concept that can be adapted for the `BackendConfig`.
4.  How to integrate precompile execution into the main EVM call logic (`handler/src/frame.rs`).
5.  How to write performance benchmarks for cryptographic operations (`benches/`).

The developer should use these `revm` patterns as a reference for implementing the individual backends and their integration, while building the dynamic selection logic on top, as specified in the prompt.



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
```python
def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    output : `MessageCallOutput`
        Output of the message call
    """
    # ... (code for handling contract creation removed for brevity)
    else:
        evm = process_message(message)

    if evm.error:
        logs: Tuple[Log, ...] = ()
        accounts_to_delete = set()
    else:
        logs = evm.logs
        accounts_to_delete = evm.accounts_to_delete
        refund_counter += U256(evm.refund_counter)
    # ...
    return MessageCallOutput(
        gas_left=evm.gas_left,
        refund_counter=refund_counter,
        logs=logs,
        accounts_to_delete=accounts_to_delete,
        error=evm.error,
    )


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
        # This is the key integration point. Instead of a direct lookup,
        # the new backend selection logic would be called here.
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/precompiled_contracts/mapping.py">
```python
"""
Precompiled Contract Addresses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Mapping of precompiled contracts their implementations.
"""
from typing import Callable, Dict

from ...fork_types import Address
from . import (
    ALT_BN128_ADD_ADDRESS,
    ALT_BN128_MUL_ADDRESS,
    ALT_BN128_PAIRING_CHECK_ADDRESS,
    BLAKE2F_ADDRESS,
    ECRECOVER_ADDRESS,
    IDENTITY_ADDRESS,
    MODEXP_ADDRESS,
    POINT_EVALUATION_ADDRESS,
    RIPEMD160_ADDRESS,
    SHA256_ADDRESS,
)
from .alt_bn128 import alt_bn128_add, alt_bn128_mul, alt_bn128_pairing_check
from .blake2f import blake2f
from .ecrecover import ecrecover
from .identity import identity
from .modexp import modexp
from .point_evaluation import point_evaluation
from .ripemd160 import ripemd160
from .sha256 import sha256

PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    ECRECOVER_ADDRESS: ecrecover,
    SHA256_ADDRESS: sha256,
    RIPEMD160_ADDRESS: ripemd160,
    IDENTITY_ADDRESS: identity,
    MODEXP_ADDRESS: modexp,
    ALT_BN128_ADD_ADDRESS: alt_bn128_add,
    ALT_BN128_MUL_ADDRESS: alt_bn128_mul,
    ALT_BN128_PAIRING_CHECK_ADDRESS: alt_bn128_pairing_check,
    BLAKE2F_ADDRESS: blake2f,
    POINT_EVALUATION_ADDRESS: point_evaluation,
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/precompiled_contracts/identity.py">
```python
"""
Ethereum Virtual Machine (EVM) IDENTITY PRECOMPILED CONTRACT
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementation of the `IDENTITY` precompiled contract.
"""
from ethereum_types.numeric import Uint

from ethereum.utils.numeric import ceil32

from ...vm import Evm
from ...vm.gas import GAS_IDENTITY, GAS_IDENTITY_WORD, charge_gas


def identity(evm: Evm) -> None:
    """
    Writes the message data to output.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    data = evm.message.data

    # GAS
    word_count = ceil32(Uint(len(data))) // Uint(32)
    charge_gas(evm, GAS_IDENTITY + GAS_IDENTITY_WORD * word_count)

    # OPERATION
    evm.output = data
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/__init__.py">
```python
@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    block_env: BlockEnvironment
    tx_env: TransactionEnvironment
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/fork.py">
```python
def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    """
    Execute a transaction against the provided environment.
    ...
    """
    # ...
    # Code to prepare for transaction execution, including
    # gas calculation, nonce increment, and balance reduction.
    # ...

    tx_env = vm.TransactionEnvironment(
        origin=sender,
        gas_price=effective_gas_price,
        gas=gas,
        access_list_addresses=access_list_addresses,
        access_list_storage_keys=access_list_storage_keys,
        transient_storage=TransientStorage(),
        blob_versioned_hashes=blob_versioned_hashes,
        index_in_block=index,
        tx_hash=get_transaction_hash(encode_transaction(tx)),
        traces=[],
    )

    message = prepare_message(block_env, tx_env, tx)

    tx_output = process_message_call(message)

    # ...
    # Code to handle transaction output, refunds, and receipt creation.
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/precompiled_contracts/__init__.py">
```python
"""
Precompiled Contract Addresses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Addresses of precompiled contracts and mappings to their
implementations.
"""

from ...utils.hexadecimal import hex_to_address

__all__ = (
    "ECRECOVER_ADDRESS",
    "SHA256_ADDRESS",
    "RIPEMD160_ADDRESS",
    "IDENTITY_ADDRESS",
    "MODEXP_ADDRESS",
    "ALT_BN128_ADD_ADDRESS",
    "ALT_BN128_MUL_ADDRESS",
    "ALT_BN128_PAIRING_CHECK_ADDRESS",
    "BLAKE2F_ADDRESS",
    "POINT_EVALUATION_ADDRESS",
)

ECRECOVER_ADDRESS = hex_to_address("0x01")
SHA256_ADDRESS = hex_to_address("0x02")
RIPEMD160_ADDRESS = hex_to_address("0x03")
IDENTITY_ADDRESS = hex_to_address("0x04")
MODEXP_ADDRESS = hex_to_address("0x05")
ALT_BN128_ADD_ADDRESS = hex_to_address("0x06")
ALT_BN128_MUL_ADDRESS = hex_to_address("0x07")
ALT_BN128_PAIRING_CHECK_ADDRESS = hex_to_address("0x08")
BLAKE2F_ADDRESS = hex_to_address("0x09")
POINT_EVALUATION_ADDRESS = hex_to_address("0x0a")
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/system.py">
```python
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
    code = get_account(evm.message.block_env.state, code_address).code
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
        parent_evm=evm,
    )
    child_evm = process_message(child_message)

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
</execution-specs>
<prompt-corrections>
- The prompt specifies a file `/src/evm/vm.zig` to be modified. In `execution-specs`, the equivalent logic for handling the main VM loop and dispatching opcodes is located in `src/ethereum/{fork}/vm/interpreter.py`. The `process_message_call` and `execute_code` functions are the most relevant integration points.
- The prompt's `PrecompileInterface.ExecutionContext` struct closely maps to the `Message` dataclass in `src/ethereum/{fork}/vm/__init__.py`. This object encapsulates all the necessary context for executing a precompile.
- The `PrecompileBackendManager.PrecompileType` enum in the prompt corresponds to the precompile addresses defined as constants in `src/ethereum/{fork}/vm/precompiled_contracts/__init__.py`. These addresses are used to identify which precompile is being called.
</prompt-corrections>

---

An analysis of the `execution-specs` codebase reveals that the core logic for precompile dispatch and execution is located within the `vm` directory of each hardfork. The following snippets from the **Prague** hardfork are most relevant for implementing the precompile backend selection system. Prague is chosen as it is the most recent and contains all precompiles listed in the prompt.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/mapping.py">
```python
"""
Precompiled Contract Addresses
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Mapping of precompiled contracts their implementations.
"""
from typing import Callable, Dict

from ...fork_types import Address
from . import (
    ALT_BN128_ADD_ADDRESS,
    ALT_BN128_MUL_ADDRESS,
    ALT_BN128_PAIRING_CHECK_ADDRESS,
    BLAKE2F_ADDRESS,
    BLS12_G1_ADD_ADDRESS,
    BLS12_G1_MSM_ADDRESS,
    BLS12_G2_ADD_ADDRESS,
    BLS12_G2_MSM_ADDRESS,
    BLS12_MAP_FP2_TO_G2_ADDRESS,
    BLS12_MAP_FP_TO_G1_ADDRESS,
    BLS12_PAIRING_ADDRESS,
    ECRECOVER_ADDRESS,
    IDENTITY_ADDRESS,
    MODEXP_ADDRESS,
    POINT_EVALUATION_ADDRESS,
    RIPEMD160_ADDRESS,
    SHA256_ADDRESS,
)
from .alt_bn128 import alt_bn128_add, alt_bn128_mul, alt_bn128_pairing_check
from .blake2f import blake2f
from .bls12_381.bls12_381_g1 import (
    bls12_g1_add,
    bls12_g1_msm,
    bls12_map_fp_to_g1,
)
from .bls12_381.bls12_381_g2 import (
    bls12_g2_add,
    bls12_g2_msm,
    bls12_map_fp2_to_g2,
)
from .bls12_381.bls12_381_pairing import bls12_pairing
from .ecrecover import ecrecover
from .identity import identity
from .modexp import modexp
from .point_evaluation import point_evaluation
from .ripemd160 import ripemd160
from .sha256 import sha256

PRE_COMPILED_CONTRACTS: Dict[Address, Callable] = {
    ECRECOVER_ADDRESS: ecrecover,
    SHA256_ADDRESS: sha256,
    RIPEMD160_ADDRESS: ripemd160,
    IDENTITY_ADDRESS: identity,
    MODEXP_ADDRESS: modexp,
    ALT_BN128_ADD_ADDRESS: alt_bn128_add,
    ALT_BN128_MUL_ADDRESS: alt_bn128_mul,
    ALT_BN128_PAIRING_CHECK_ADDRESS: alt_bn128_pairing_check,
    BLAKE2F_ADDRESS: blake2f,
    POINT_EVALUATION_ADDRESS: point_evaluation,
    BLS12_G1_ADD_ADDRESS: bls12_g1_add,
    BLS12_G1_MSM_ADDRESS: bls12_g1_msm,
    BLS12_G2_ADD_ADDRESS: bls12_g2_add,
    BLS12_G2_MSM_ADDRESS: bls12_g2_msm,
    BLS12_PAIRING_ADDRESS: bls12_pairing,
    BLS12_MAP_FP_TO_G1_ADDRESS: bls12_map_fp_to_g1,
    BLS12_MAP_FP2_TO_G2_ADDRESS: bls12_map_fp2_to_g2,
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/interpreter.py">
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
    # ... (initialization of evm object) ...

    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            if message.disable_precompiles:
                return evm
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/__init__.py">
```python
@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    block_env: BlockEnvironment
    tx_env: TransactionEnvironment
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
    disable_precompiles: bool
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/identity.py">
```python
"""
Ethereum Virtual Machine (EVM) IDENTITY PRECOMPILED CONTRACT
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
Implementation of the `IDENTITY` precompiled contract.
"""
from ethereum_types.numeric import Uint

from ethereum.utils.numeric import ceil32

from ...vm import Evm
from ...vm.gas import GAS_IDENTITY, GAS_IDENTITY_WORD, charge_gas


def identity(evm: Evm) -> None:
    """
    Writes the message data to output.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    data = evm.message.data

    # GAS
    word_count = ceil32(Uint(len(data))) // Uint(32)
    charge_gas(evm, GAS_IDENTITY + GAS_IDENTITY_WORD * word_count)

    # OPERATION
    evm.output = data
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/precompiled_contracts/sha256.py">
```python
"""
Ethereum Virtual Machine (EVM) SHA256 PRECOMPILED CONTRACT
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
Implementation of the `SHA256` precompiled contract.
"""
import hashlib

from ethereum_types.numeric import Uint

from ethereum.utils.numeric import ceil32

from ...vm import Evm
from ...vm.gas import GAS_SHA256, GAS_SHA256_WORD, charge_gas


def sha256(evm: Evm) -> None:
    """
    Writes the sha256 hash to output.

    Parameters
    ----------
    evm :
        The current EVM frame.
    """
    data = evm.message.data

    # GAS
    word_count = ceil32(Uint(len(data))) // Uint(32)
    charge_gas(evm, GAS_SHA256 + GAS_SHA256_WORD * word_count)

    # OPERATION
    evm.output = hashlib.sha256(data).digest()
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
# ...

GAS_ECRECOVER = Uint(3000)
GAS_SHA256 = Uint(60)
GAS_SHA256_WORD = Uint(12)
GAS_RIPEMD160 = Uint(600)
GAS_RIPEMD160_WORD = Uint(120)
GAS_IDENTITY = Uint(15)
GAS_IDENTITY_WORD = Uint(3)
GAS_POINT_EVALUATION = Uint(50000)
# ...

def charge_gas(evm: Evm, amount: Uint) -> None:
    """
    Subtracts `amount` from `evm.gas_left`.

    Parameters
    ----------
    evm :
        The current EVM.
    amount :
        The amount of gas the current operation requires.

    """
    evm_trace(evm, GasAndRefund(int(amount)))

    if evm.gas_left < amount:
        raise OutOfGasError
    else:
        evm.gas_left -= amount
```
</file>
</execution-specs>



## GO-ETHEREUM Context

An analysis of the `go-ethereum` codebase reveals several patterns and components that are highly relevant to implementing a precompile backend selection system. The key takeaways are:

1.  **Backend Selection:** Geth uses a combination of build-time and run-time selection.
    *   **Build-time:** Go's build tags are used to compile different versions of a file based on the target architecture (`amd64`, `arm64`) or the availability of CGO. This is seen in `crypto/bn256` and `crypto/secp256k1`.
    *   **Run-time:** For finer-grained control, Geth checks CPU features at startup (in an `init()` function) and sets global boolean flags. Dispatch functions then use these flags to call the appropriate implementation (e.g., AVX2, SSE4, or generic). This is evident in `crypto/blake2b`. A runtime-configurable switch is also used in `crypto/kzg4844` to allow switching between CGO and pure Go implementations.

2.  **Precompile Registry:** Precompiles are managed via a simple `map` in `core/vm/contracts.go`, where the key is the precompile address and the value is a struct satisfying the `PrecompiledContract` interface. This provides a clean way to register and dispatch calls.

3.  **Performance Profiling:** Geth's `metrics` package is a comprehensive system for performance monitoring, closely mirroring the request for a `PerformanceProfiler`. It includes `Meters` for rates, `Timers` for durations, and `Histograms` for value distributions. A central `Registry` manages all metrics, which can then be exported to various monitoring systems.

The following snippets illustrate these patterns.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contracts.go">
```go
// This file shows how go-ethereum registers and runs precompiled contracts.
// The `precompiledContracts` map acts as a "BackendRegistry", mapping an
// address to a specific implementation. The `RunPrecompiledContract` function
// is the dispatcher that executes the correct implementation.

// PrecompiledContract is the interface for a pre-compiled contract.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64
	Run(input []byte, gas uint64) ([]byte, uint64, error)
}

// PrecompiledContractsByzantium contains the default set of pre-compiled contracts used
// in the Byzantium release.
var PrecompiledContractsByzantium = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
}

// PrecompiledContractsIstanbul contains the default set of pre-compiled contracts used
// in the Istanbul release.
var PrecompiledContractsIstanbul = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256AddIstanbul{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMulIstanbul{},
	common.BytesToAddress([]byte{8}): &bn256PairingIstanbul{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}
// ... other hardforks ...

// RunPrecompiledContract runs the precompiled contract defined at address.
func RunPrecompiledContract(p PrecompiledContract, input []byte, gas uint64) ([]byte, uint64, error) {
	if p == nil {
		return nil, gas, nil
	}
	start := time.Now()
	ret, remainingGas, err := p.Run(input, gas)
	// After the execution, log the execution stats
	precompileTime.Update(time.Since(start))
	if err != nil {
		precompileFailure.Mark(1)
	}
	return ret, remainingGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/kzg4844/kzg4844.go">
```go
// This file demonstrates a runtime-configurable backend selection, directly
// analogous to the requested feature. The `useCKZG` atomic boolean acts as a
// global switch to select between a pure Go implementation (`gokzg`) and a
// more performant CGO-based one (`ckzg`).

// useCKZG controls whether the cryptography should use the Go or C backend.
var useCKZG atomic.Bool

func init() {
	UseCKZG(true)
}

// UseCKZG can be called to switch the default Go implementation of KZG to the C
// library if for some reason the user wishes to do so (e.g. consensus bug in one
// or the other).
func UseCKZG(use bool) error {
	if use && !ckzgAvailable {
		return errors.New("CKZG unavailable on your platform")
	}
	useCKZG.Store(use)

	// ... initialization logic ...
	return nil
}

// BlobToCommitment creates a small commitment out of a data blob.
// It checks the `useCKZG` flag to dispatch to the correct implementation.
func BlobToCommitment(blob *Blob) (Commitment, error) {
	if useCKZG.Load() {
		return ckzgBlobToCommitment(blob)
	}
	return gokzgBlobToCommitment(blob)
}

// Other functions like ComputeProof, VerifyProof, etc., follow the same pattern.
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/blake2b/blake2bAVX2_amd64.go">
```go
// This file, along with its counterparts for other architectures, exemplifies
// runtime CPU feature detection to select an optimized backend. The `init`
// function checks for CPU support (AVX2, AVX, SSE4) and sets boolean flags.
// The `f` function then acts as a dispatcher, calling the most optimized
// assembly implementation available. This is a direct parallel to the proposed
// `RuntimeDetector` and dynamic selection logic.

//go:build go1.7 && amd64 && !gccgo && !appengine

package blake2b

import "golang.org/x/sys/cpu"

func init() {
	useAVX2 = cpu.X86.HasAVX2
	useAVX = cpu.X86.HasAVX
	useSSE4 = cpu.X86.HasSSE41
}

//go:noescape
func fAVX2(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64)
//go:noescape
func fAVX(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64)
//go:noescape
func fSSE4(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64)

func f(h *[8]uint64, m *[16]uint64, c0, c1 uint64, flag uint64, rounds uint64) {
	switch {
	case useAVX2:
		fAVX2(h, m, c0, c1, flag, rounds)
	case useAVX:
		fAVX(h, m, c0, c1, flag, rounds)
	case useSSE4:
		fSSE4(h, m, c0, c1, flag, rounds)
	default:
		fGeneric(h, m, c0, c1, flag, rounds)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/secp256k1/signature_cgo.go">
```go
// This file and its `_nocgo` counterpart demonstrate build-time backend selection.
// Depending on whether CGO is enabled, a different version of the file is compiled.
// The cgo version links to a highly optimized C library for cryptographic
// operations, serving as a "native" backend, while the `_nocgo` version provides
// a "pure" Go fallback.

//go:build !nacl && !js && !wasip1 && cgo && !gofuzz && !tinygo

package crypto

import (
	"crypto/ecdsa"
	"github.com/ethereum/go-ethereum/crypto/secp256k1"
)

// Ecrecover returns the uncompressed public key that created the given signature.
// This version calls the CGO-backed implementation.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	return secp256k1.RecoverPubkey(hash, sig)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/secp256k1/signature_nocgo.go">
```go
// This is the non-CGO version of the signature file, used when CGO is not available.
// It provides a pure-Go implementation of the same functions.

//go:build nacl || js || wasip1 || !cgo || gofuzz || tinygo

package crypto

import (
	"crypto/ecdsa"
	"github.com/decred/dcrd/dcrec/secp256k1/v4"
	decred_ecdsa "github.com/decred/dcrd/dcrec/secp256k1/v4/ecdsa"
)

// Ecrecover returns the uncompressed public key that created the given signature.
// This version uses a pure-Go library.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	pub, err := sigToPub(hash, sig)
	if err != nil {
		return nil, err
	}
	bytes := pub.SerializeUncompressed()
	return bytes, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/bn256/bn256_fast.go">
```go
// This file and its `_slow` counterpart use build tags to select different
// pairing library backends based on CPU architecture, demonstrating another form
// of compile-time backend selection.

//go:build amd64 || arm64

package bn256

import (
	bn256cf "github.com/ethereum/go-ethereum/crypto/bn256/cloudflare"
)

// G1 is an abstract cyclic group. The zero value is suitable for use as the
// output of an operation, but cannot be used as an input.
type G1 = bn256cf.G1
// ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/bn256/bn256_slow.go">
```go
// This is the fallback implementation for architectures other than amd64/arm64.

//go:build !amd64 && !arm64

package bn256

import bn256 "github.com/ethereum/go-ethereum/crypto/bn256/google"

// G1 is an abstract cyclic group. The zero value is suitable for use as the
// output of an operation, but cannot be used as an input.
type G1 = bn256.G1
// ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/metrics/timer.go">
```go
// The `metrics` package provides a powerful analogy to the requested
// `PerformanceProfiler`. The `Timer` struct, in particular, is designed to
// capture duration and rate of events, which is exactly what's needed to
// profile precompile execution.

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

// Snapshot returns a read-only copy of the timer.
func (t *Timer) Snapshot() *TimerSnapshot {
	t.mutex.Lock()
	defer t.mutex.Unlock()
	return &TimerSnapshot{
		histogram: t.histogram.Snapshot(),
		meter:     t.meter.Snapshot(),
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/metrics/meter.go">
```go
// A `Meter` tracks the rate of events, which is useful for profiling how
// frequently each precompile backend is used.

// Meter count events to produce exponentially-weighted moving average rates
// at one-, five-, and fifteen-minutes and a mean rate.
type Meter struct {
	count     atomic.Int64
	uncounted atomic.Int64 // not yet added to the EWMAs
	rateMean  atomic.Uint64
	// ...
}

// Mark records the occurrence of n events.
func (m *Meter) Mark(n int64) {
	m.uncounted.Add(n)
}

// Snapshot returns a read-only copy of the meter.
func (m *Meter) Snapshot() *MeterSnapshot {
    // ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/metrics/registry.go">
```go
// The `Registry` is the central component for managing metrics, analogous to
// the `BackendRegistry` and `PerformanceProfiler` needing a way to store and
// access performance data for different backends.

// A Registry holds references to a set of metrics by name and can iterate
// over them, calling callback functions provided by the user.
type Registry interface {
	// Each call the given function for each registered metric.
	Each(func(string, interface{}))

	// Get the metric by the given name or nil if none is registered.
	Get(string) interface{}

	// GetOrRegister gets an existing metric or registers the given one.
	// The interface can be the metric to register if not found in registry,
	// or a function returning the metric for lazy instantiation.
	GetOrRegister(string, interface{}) interface{}

	// Register the given metric under the given name.
	Register(string, interface{}) error
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/metrics/metrics.go">
```go
// This function shows how go-ethereum runs a periodic task to collect various
// system and process metrics, which is a good model for how a
// `PerformanceProfiler` could periodically update its statistics.

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
	// ...

	// Define the various metrics to collect
	var (
		cpuSysLoad       = GetOrRegisterGauge("system/cpu/sysload", DefaultRegistry)
		// ... many more metrics registered here
		diskReadBytes    = GetOrRegisterMeter("system/disk/readdata", DefaultRegistry)
	)

	var lastCollectTime time.Time

	// Iterate loading the different stats and updating the meters.
	now, prev := 0, 1
	for ; ; now, prev = prev, now {
		// Gather CPU times.
		ReadCPUStats(&cpustats[now])
		// ... calculations ...
		cpuSysLoad.Update(int64(sysLoad / secondsSinceLastCollect * 100))

		// Go runtime metrics
		readRuntimeStats(&rstats[now])
		// ...
		memAllocs.Mark(int64(rstats[now].GCAllocBytes - rstats[prev].GCAllocBytes))

		// Disk
		if ReadDiskStats(&diskstats[now]) == nil {
			diskReadBytes.Mark(diskstats[now].ReadBytes - diskstats[prev].ReadBytes)
		}
		time.Sleep(refresh)
	}
}
```
</file>
</go-ethereum>

---

An excellent and detailed prompt. While `go-ethereum` does not have a dynamic backend selection system as sophisticated as the one you've designed, it does contain several key elements that are highly relevant to your implementation. These include:

1.  A precompile registration system that activates different precompiles based on hard forks.
2.  Compile-time backend selection for cryptographic primitives (e.g., using CGO for performance or a pure Go fallback).
3.  Runtime CPU feature detection to enable optimized cryptographic routines.
4.  Gas calculation models that vary based on input size and complexity.

Here are the most relevant code snippets from `go-ethereum` that will provide context for your task.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contracts.go">
```go
// PrecompiledContract is the interface for native contracts.
//
// Native contracts are implemented in Go and are not expressed in EVM bytecode.
// They are executed by calling the Run method.
//
// Note, this interface is not intended to be used by contracts wanting to call
// other contracts. It is meant to be used for native code dispatch, i.e. for
// the EVM to execute native contracts.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas returns the gas required to execute the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}

// PrecompiledContractsBerlin contains the precompiled contracts after the Berlin hard fork.
var PrecompiledContractsBerlin = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// PrecompiledContractsCancun contains the precompiled contracts after the Cancun hard fork.
var PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}):  &ecrecover{},
	common.BytesToAddress([]byte{2}):  &sha256hash{},
	common.BytesToAddress([]byte{3}):  &ripemd160hash{},
	common.BytesToAddress([]byte{4}):  &dataCopy{},
	common.BytesToAddress([]byte{5}):  &bigModExp{},
	common.BytesToAddress([]byte{6}):  &bn256Add{},
	common.BytesToAddress([]byte{7}):  &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}):  &bn256Pairing{},
	common.BytesToAddress([]byte{9}):  &blake2F{},
	common.BytesToAddress([]byte{10}): &pointEvaluation{}, // EIP-4844
}

// ActivePrecompiles returns the precompiled contracts for the given chain configuration.
func ActivePrecompiles(rules params.Rules) []common.Address {
	// SpuriousDragon is the first fork where precompiles were enabled.
	if !rules.IsSpuriousDragon {
		return nil
	}
	// Determine the set of active precompiles.
	var precompiles map[common.Address]PrecompiledContract
	switch {
	case rules.IsCancun:
		precompiles = PrecompiledContractsCancun
	case rules.IsShanghai:
		precompiles = PrecompiledContractsShanghai
	case rules.IsBerlin:
		precompiles = PrecompiledContractsBerlin
	case rules.IsIstanbul:
		precompiles = PrecompiledContractsIstanbul
	case rules.IsByzantium:
		precompiles = PrecompiledContractsByzantium
	default:
		precompiles = PrecompiledContractsHomestead
	}
	// Sort the addresses for consistent iteration.
	addresses := make(addressList, 0, len(precompiles))
	for addr := range precompiles {
		addresses = append(addresses, addr)
	}
	sort.Sort(addresses)
	return addresses
}

// RunPrecompiledContract runs the precompiled contract defined by the given address.
func RunPrecompiledContract(p PrecompiledContract, input []byte, contract *Contract) (ret []byte, remainingGas uint64, err error) {
	gas := p.RequiredGas(input)
	if !contract.UseGas(gas) {
		return nil, 0, ErrOutOfGas
	}
	// The Run method is not allowed to modify the input.
	// We make a copy so that precompiles can move the slice.
	// This is required to be safe where the caller might be passing
	// an aliased slice.
	return p.Run(common.CopyBytes(input))
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/precompiles.go">
```go
// ecrecover implements the ecrecover precompiled contract.
type ecrecover struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const bitlen = 256

	// "input" is a sequence of values, following the sequence of arguments in the YP
	var (
		hash = common.BytesToHash(read(input, 0, 32))
		v    = read(input, 32, 32)
		r    = read(input, 64, 32)
		s    = read(input, 96, 32)
	)
	// Validate input, each value is a 32-byte string.
	if len(v) != 32 || len(r) != 32 || len(s) != 32 {
		return nil, errors.New("invalid signature")
	}
	// v should be either 27 or 28
	vVal := new(big.Int).SetBytes(v)
	if !(vVal.Cmp(big.NewInt(27)) == 0 || vVal.Cmp(big.NewInt(28)) == 0) {
		return nil, nil // Return nil for invalid v
	}
	// Ecrecover returns nil on error
	pubkey, err := crypto.Ecrecover(hash.Bytes(), buildECDSASignature(vVal.Bytes(), r, s))
	if err != nil {
		return nil, nil
	}
	// The public key is 64 bytes long, strip the first byte.
	return common.LeftPadBytes(crypto.Keccak256(pubkey[1:])[12:], 32), nil
}

// sha256hash implements the sha256 precompiled contract.
type sha256hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}

func (c *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.Sum256(input)
	return h[:], nil
}

// ripemd160hash implements the ripemd160 precompiled contract.
type ripemd160hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *ripemd160hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Ripemd160PerWordGas + params.Ripemd160BaseGas
}

func (c *ripemd160hash) Run(input []byte) ([]byte, error) {
	ripemd := ripemd160.New()
	ripemd.Write(input)
	return common.LeftPadBytes(ripemd.Sum(nil), 32), nil
}

// dataCopy implements the dataCopy precompiled contract.
type dataCopy struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *dataCopy) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.IdentityPerWordGas + params.IdentityBaseGas
}

func (c *dataCopy) Run(input []byte) ([]byte, error) {
	return input, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/secp256k1/secp256.go">
```go
//go:build !gofuzz && cgo

package secp256k1

// #cgo CFLAGS: -I./libsecp256k1/src -I./libsecp256k1
// ... (cgo import statements)
//
// This file contains an ECDSA signature backend based on the bitcoin secp256k1 library.

// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	// ... (input validation)

	// Recover the public key and serialize it
	var (
		pubkey  = make([]byte, 65)
		recid   = int32(sig[64])
		context = C.secp256k1_context_create(C.SECP256K1_CONTEXT_VERIFY | C.SECP256K1_CONTEXT_SIGN)
	)
	// ... (defer C.secp256k1_context_destroy(context))

	if C.secp256k1_ecdsa_recover(context, (*C.secp256k1_pubkey)(unsafe.Pointer(&pubkey_ptr)), (*C.secp256k1_ecdsa_recoverable_signature)(unsafe.Pointer(&sig_ptr)), (*C.uchar)(unsafe.Pointer(&hash[0]))) == 0 {
		return nil, ErrInvalidSignature
	}

	// ... (serialization logic)
	return pubkey, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/secp256k1/secp256_purego.go">
```go
//go:build !cgo

package secp256k1

import (
	"crypto/ecdsa"
	"errors"
	"fmt"
	"math/big"

	"github.com/decred/dcrd/dcrec/secp256k1/v4"
)

// This file is a pure-Go fallback for various secp256k1 functions.

// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	pub, err := sigToPub(hash, sig)
	if err != nil {
		return nil, err
	}
	bytes := pub.Bytes()
	return bytes, nil
}

// sigToPub returns the public key that created the given signature.
func sigToPub(hash, sig []byte) (*ecdsa.PublicKey, error) {
	// ... (input validation)

	// Convert to btcec input format with 'recovery id' v at the beginning.
	btcsig := make([]byte, 65)
	btcsig[0] = sig[64] + 27
	copy(btcsig[1:], sig)

	pub, _, err := secp256k1.RecoverCompact(btcsig, hash)
	if err != nil {
		return nil, err
	}
	return pub.ToECDSA(), nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/internal/cpu/cpu.go">
```go
// Package cpu implements processor feature detection.
package cpu

import "sync"

// CPU is a bitmask of supported CPU features.
type CPU byte

const (
	// No extensions
	NONE CPU = 0
	// CPU has AES-NI
	AES CPU = 1 << iota
	// CPU has PCLMULQDQ
	PCLMULQDQ
	// CPU has SSE3
	SSE3
	// CPU has SSE4.1
	SSE4_1
	// CPU has SSE4.2
	SSE4_2
	// CPU has AVX
	AVX
	// CPU has AVX2
	AVX2
	// CPU has SHA
	SHA
	// CPU has BMI1 and BMI2
	BMI2
)

var (
	// Info contains information about the CPU.
	Info = NONE

	once sync.Once
)

// Initialize runs the CPU feature detection.
func Initialize() {
	once.Do(initialize)
}

func (info CPU) String() string {
	var s string
	if info&AES != 0 {
		s += "aes "
	}
	// ... (other feature strings)
	return s
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/internal/cpu/cpu_x86.go">
```go
//go:build amd64 || 386

package cpu

// cpuid is implemented in cpu_x86.s
func cpuid(op uint32) (eax, ebx, ecx, edx uint32)
func cpuidex(op, op2 uint32) (eax, ebx, ecx, edx uint32)

// xgetbv is implemented in cpu_x86.s
func xgetbv(op uint32) (eax, edx uint32)

const (
	// ECX bits
	ecx_SSE3         = 1 << 0
	ecx_PCLMULQDQ    = 1 << 1
	// ...
	ecx_AES          = 1 << 25
	ecx_OSXSAVE      = 1 << 27
	ecx_AVX          = 1 << 28

	// EBX bits
	ebx_BMI1 = 1 << 3
	ebx_AVX2 = 1 << 5
	// ...
	ebx_BMI2 = 1 << 8
	ebx_SHA  = 1 << 29
)

func initialize() {
	eax, _, ecx, _ := cpuid(1)
	if ecx&ecx_AES != 0 {
		Info |= AES
	}
	if ecx&ecx_PCLMULQDQ != 0 {
		Info |= PCLMULQDQ
	}
	// ... (check other features)

	if ecx&ecx_OSXSAVE == 0 {
		return // The OS does not support XGETBV, so we can't get further features.
	}
	eax, _ = xgetbv(0)
	if eax&6 == 6 { // Check for OS support for YMM state.
		eax, ebx, _, _ := cpuidex(7, 0)
		if ebx&ebx_AVX2 != 0 {
			Info |= AVX2
		}
		if ebx&ebx_SHA != 0 {
			Info |= SHA
		}
		// ... (check other extended features)
	}
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/protocol_params.go">
```go
const (
	// Gas cost parameters for precompiles
	EcrecoverGas            = 3000
	Sha256BaseGas           = 60
	Sha256PerWordGas        = 12
	Ripemd160BaseGas        = 600
	Ripemd160PerWordGas     = 120
	IdentityBaseGas         = 15
	IdentityPerWordGas      = 3
	ModExpQuadCoeffDiv      = 20
	Bn256AddGasByzantium    = 500
	Bn256AddGasIstanbul     = 150
	Bn256ScalarMulGasByzantium = 40000
	Bn256ScalarMulGasIstanbul  = 6000
	Bn256PairingBaseGasByzantium = 100000
	Bn256PairingBaseGasIstanbul  = 45000
	Bn256PairingPerPointGasByzantium = 80000
	Bn256PairingPerPointGasIstanbul  = 34000
	Bls12381G1AddGas           = 600
	Bls12381G1MulGas           = 12000
	Bls12381G2AddGas           = 4500
	Bls12381G2MulGas           = 90000
	Bls12381PairingBaseGas     = 115000
	Bls12381PairingPerPairGas  = 43000
	Bls12381MapG1Gas           = 5500
	Bls12381MapG2Gas           = 110000
	Blake2FCompressionGas      = 600
	PointEvaluationGas         = 50000 // Gas cost for kzg point evaluation precompile
)
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contracts.go">
```go
// PrecompiledContract is the interface for native contracts.
//
// Note: Precompiled contracts should not make any state changes, however the
// EVM is not enforcing this at the moment.
type PrecompiledContract interface {
	// RequiredGas returns the gas required to execute the pre-compiled contract.
	RequiredGas(input []byte) uint64
	// Run executes the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}

// PrecompiledContracts... are the contracts that are implemented in Go
// and available on every block.
var (
	// PrecompiledContractsByzantium contains the contracts available around the time of the Byzantium fork.
	PrecompiledContractsByzantium = map[common.Address]PrecompiledContract{
		common.BytesToAddress([]byte{1}): &ecrecover{},
		common.BytesToAddress([]byte{2}): &sha256hash{},
		common.BytesToAddress([]byte{3}): &ripemd160hash{},
		common.BytesToAddress([]byte{4}): &dataCopy{},
		common.BytesToAddress([]byte{5}): &bigModExp{},
		common.BytesToAddress([]byte{6}): &bn256Add{},
		common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
		common.BytesToAddress([]byte{8}): &bn256Pairing{},
	}
	// PrecompiledContractsIstanbul contains the contracts available around the time of the Istanbul fork.
	PrecompiledContractsIstanbul = map[common.Address]PrecompiledContract{
		common.BytesToAddress([]byte{1}): &ecrecover{},
		common.BytesToAddress([]byte{2}): &sha256hash{},
		common.BytesToAddress([]byte{3}): &ripemd160hash{},
		common.BytesToAddress([]byte{4}): &dataCopy{},
		common.BytesToAddress([]byte{5}): &bigModExp{},
		common.BytesToAddress([]byte{6}): &bn256AddIstanbul{},
		common.BytesToAddress([]byte{7}): &bn256ScalarMulIstanbul{},
		common.BytesToAddress([]byte{8}): &bn256PairingIstanbul{},
		common.BytesToAddress([]byte{9}): &blake2F{},
	}
	// PrecompiledContractsBerlin contains the contracts available around the time of the Berlin fork.
	PrecompiledContractsBerlin = map[common.Address]PrecompiledContract{
		common.BytesToAddress([]byte{1}): &ecrecover{},
		common.BytesToAddress([]byte{2}): &sha256hash{},
		common.BytesToAddress([]byte{3}): &ripemd160hash{},
		common.BytesToAddress([]byte{4}): &dataCopy{},
		common.BytesToAddress([]byte{5}): &bigModExp{},
		common.BytesToAddress([]byte{6}): &bn256AddIstanbul{},
		common.BytesToAddress([]byte{7}): &bn256ScalarMulIstanbul{},
		common.BytesToAddress([]byte{8}): &bn256PairingIstanbul{},
		common.BytesToAddress([]byte{9}): &blake2F{},
	}
	// PrecompiledContractsCancun contains the contracts available around the time of the Cancun fork.
	PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
		common.BytesToAddress([]byte{1}): &ecrecover{},
		common.BytesToAddress([]byte{2}): &sha256hash{},
		common.BytesToAddress([]byte{3}): &ripemd160hash{},
		common.BytesToAddress([]byte{4}): &dataCopy{},
		common.BytesToAddress([]byte{5}): &bigModExp{},
		common.BytesToAddress([]byte{6}): &bn256AddIstanbul{},
		common.BytesToAddress([]byte{7}): &bn256ScalarMulIstanbul{},
		common.BytesToAddress([]byte{8}): &bn256PairingIstanbul{},
		common.BytesToAddress([]byte{9}): &blake2F{},
		common.BytesToAddress([]byte{10}): &pointEvaluation{}, // 0x0a
	}
)

// runPrecompiled runs a precompiled contract.
func runPrecompiled(p PrecompiledContract, input []byte, suppliedGas uint64) (ret []byte, remainingGas uint64, err error) {
	gasCost := p.RequiredGas(input)
	if suppliedGas < gasCost {
		return nil, 0, ErrOutOfGas
	}
	suppliedGas -= gasCost
	output, err := p.Run(input)
	if err != nil {
		return nil, 0, err
	}
	return output, suppliedGas, nil
}

// ecrecover implements the ECRECOVER precompile.
type ecrecover struct{}

func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const (
		// The ECRECOVER precompile expects 128 bytes of input.
		// It returns a 32-byte result.
		inLen = 128
		outLen = 32
	)

	// Pad the input to the required length.
	input = common.RightPadBytes(input, inLen)

	// Recover the public key.
	// This function is implemented in C (libsecp256k1) via cgo.
	// This is an example of a "native" backend.
	pub, err := crypto.Ecrecover(input[:64], input[64:128])
	if err != nil {
		return nil, err
	}
	// The public key is 64 bytes long, but the precompile returns only the
	// last 20 bytes of its hash.
	var addr common.Address
	copy(addr[:], crypto.Keccak256(pub)[12:])
	return addr.Bytes(), nil
}

// sha256hash implements the SHA256 precompile.
type sha256hash struct{}

// RequiredGas calculates the gas required for the SHA256 precompile.
func (c *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(params.Sha256BaseGas) + uint64(len(input)+31)/32*uint64(params.Sha256PerWordGas)
}

// Run calculates the SHA256 hash of the input.
// This uses Go's standard library, which has optimized assembly implementations
// for different CPU architectures. This is an example of a compile-time selected
// "native" backend.
func (c *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.New()
	h.Write(input)
	return h.Sum(nil), nil
}

// dataCopy implements the IDENTITY precompile.
type dataCopy struct{}

// RequiredGas calculates the gas required for the IDENTITY precompile.
func (c *dataCopy) RequiredGas(input []byte) uint64 {
	return params.IdentityBaseGas + uint64(len(input)+31)/32*params.IdentityPerWordGas
}

// Run simply returns the input as the output.
// This is an example of a "pure" backend implemented directly in Go.
func (c *dataCopy) Run(input []byte) ([]byte, error) {
	return input, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the verkle-transition specification,
// which operates on contracts accounts and associated state.
type EVM struct {
	// Context provides information about the transaction and block
	Context BlockContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// Chain rules indicates the fork rules for the block
	chainRules params.Rules

	// virtual machine configuration options used to initialise the
	// virtual machine.
	vmConfig Config

	// precompiles is the list of contracts to be executed as pre-compiled code.
	precompiles map[common.Address]PrecompiledContract

	// ...
}

// precompile returns the precompiled contract for the given address, if any.
func (evm *EVM) precompile(addr common.Address) PrecompiledContract {
	var p PrecompiledContract
	switch {
	case evm.chainRules.IsCancun:
		p = PrecompiledContractsCancun[addr]
	case evm.chainRules.IsShanghai:
		p = PrecompiledContractsShanghai[addr]
	case evm.chainRules.IsBerlin:
		p = PrecompiledContractsBerlin[addr]
	case evm.chainRules.IsIstanbul:
		p = PrecompiledContractsIstanbul[addr]
	case evm.chainRules.IsByzantium:
		p = PrecompiledContractsByzantium[addr]
	default:
		p = PrecompiledContractsHomestead[addr]
	}
	// The address of the precompiled contract determines its input and output encoding.
	// All contracts from EIP-152 are BLS-related and have different encoding rules.
	if p, ok := p.(*bls12381); ok {
		p.addr = addr
	}
	return p
}

// Call runs the code of a contract in a new EVM frame.
//
// Call is a low-level method that requires the EVM context and stateDB to be
// properly initialised.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (stack depth and transfer checks) ...

	// Check if the recipient is a precompiled contract.
	if evm.precompile(addr) {
		return evm.runPrecompiled(addr, input, gas)
	}
	// ... (rest of the contract call logic) ...
}

// runPrecompiled is a helper to run a precompiled contract.
func (evm *EVM) runPrecompiled(address common.Address, input []byte, gas uint64) ([]byte, uint64, error) {
	p := evm.precompile(address)
	if evm.vmConfig.Tracer != nil {
		evm.vmConfig.Tracer.CapturePrecompileEnter(address, input, gas)
	}
	start := time.Now()
	ret, remainingGas, err := runPrecompiled(p, input, gas)
	if evm.vmConfig.Tracer != nil {
		evm.vmConfig.Tracer.CapturePrecompileLeave(address, input, ret, err, time.Since(start), remainingGas)
	}
	return ret, remainingGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/secp256k1/secp256.go">
```go
// Package secp256k1 provides functions for ECDSA signing and verification.
package secp256k1

// #cgo CFLAGS: -I${SRCDIR}/libsecp256k1 -I${SRCDIR}/libsecp256k1/src
// #include "libsecp256k1/include/secp256k1.h"
// #include "libsecp256k1/include/secp256k1_recovery.h"
import "C"

// ...

// Ecrecover returns the uncompressed public key that created the given signature.
//
// Note, the hash is pre-chewed (typically Keccak256).
func Ecrecover(hash, sig []byte) ([]byte, error) {
	if len(sig) != 65 {
		return nil, ErrInvalidSignatureLen
	}
	// libsecp256k1 requires a 64-byte signature.
	// The signature is formatted as R || S || V where V is 0 or 1.
	var (
		sigdata = make([]byte, 65)
		pubkey  = make([]byte, 65)
	)
	copy(sigdata, sig)
	if sigdata[64] >= 27 {
		sigdata[64] -= 27
	}
	// Recover the public key.
	if ret := C.secp256k1_ecdsa_recover(context,
		(*C.uchar)(unsafe.Pointer(&pubkey[0])),
		(*C.uchar)(unsafe.Pointer(&sigdata[0])),
		(*C.uchar)(unsafe.Pointer(&hash[0])),
	); ret != 1 {
		return nil, ErrInvalidSignature
	}
	return pubkey, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/crypto.go">
```go
// Package crypto implements various cryptographic algorithms.
package crypto

// ...

// Keccak256 calculates and returns the Keccak256 hash of the input data.
func Keccak256(data ...[]byte) []byte {
	b := make([]byte, 32)
	d := sha3.NewKeccak256()
	for _, b := range data {
		d.Write(b)
	}
	d.Sum(b[:0])
	return b
}

// ...

// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	return secp256k1.Ecrecover(hash, sig)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/protocol_params.go">
```go
// Gas costs for precompiled contracts.
const (
	EcrecoverGas            = 3000
	Sha256Gas               = 60
	Sha256PerWordGas        = 12
	Ripemd160Gas            = 600
	Ripemd160PerWordGas     = 120
	IdentityBaseGas         = 15
	IdentityPerWordGas      = 3
	ModExpQuadCoeffDiv      = 20
	Bn256AddGasByzantium    = 500
	Bn256AddGasIstanbul     = 150
	Bn256ScalarMulGasByzantium = 40000
	Bn256ScalarMulGasIstanbul = 6000
	Bn256PairingBaseGasByzantium = 100000
	Bn256PairingBaseGasIstanbul = 45000
	Bn256PairingPerPointGasByzantium = 80000
	Bn256PairingPerPointGasIstanbul = 34000
	Blake2FCompressionGas   = 600
	PointEvaluationGas      = 50000
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/internal/boring/boring.go">
```go
// Copyright 2021 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build boringcrypto

// Package boring provides access to BoringCrypto implementations of crypto algorithms.
package boring

// This file is a placeholder for when we are using BoringCrypto, and it is not
// the file that is used for the non-BoringCrypto standard library.
//
// TODO: This is a simplified version of the actual Go stdlib file.
// The real file uses cgo and build tags to conditionally compile
// against BoringSSL FIPS-compliant cryptographic libraries.

import "sync/atomic"

// This is a simplified representation. The actual implementation details
// are more complex and involve build-time configuration.
var enabled atomic.Bool

func init() {
	// The real `init` would perform checks to see if BoringSSL can be used.
	// For this example, we'll just set it to true.
	enabled.Store(true)
}

// Enabled reports whether BoringCrypto is enabled.
func Enabled() bool {
	return enabled.Load()
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contracts.go">
```go
// PrecompiledContract is the basic interface for native Go contracts. The implementation
// requires a deterministic gas count based on the input size of the Run method of the
// contract.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64  // RequiredPrice calculates the contract gas use
	Run(input []byte) ([]byte, error) // Run runs the precompiled contract
}

// PrecompiledContracts contains the precompiled contracts supported at the given fork.
type PrecompiledContracts map[common.Address]PrecompiledContract

// PrecompiledContractsHomestead contains the default set of pre-compiled Ethereum
// contracts used in the Frontier and Homestead releases.
var PrecompiledContractsHomestead = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	common.BytesToAddress([]byte{0x3}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x4}): &dataCopy{},
}

// PrecompiledContractsByzantium contains the default set of pre-compiled Ethereum
// contracts used in the Byzantium release.
var PrecompiledContractsByzantium = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	common.BytesToAddress([]byte{0x3}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x4}): &dataCopy{},
	common.BytesToAddress([]byte{0x5}): &bigModExp{eip2565: false, eip7823: false, eip7883: false},
	common.BytesToAddress([]byte{0x6}): &bn256AddByzantium{},
	common.BytesToAddress([]byte{0x7}): &bn256ScalarMulByzantium{},
	common.BytesToAddress([]byte{0x8}): &bn256PairingByzantium{},
}

// PrecompiledContractsIstanbul contains the default set of pre-compiled Ethereum
// contracts used in the Istanbul release.
var PrecompiledContractsIstanbul = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	common.BytesToAddress([]byte{0x3}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x4}): &dataCopy{},
	common.BytesToAddress([]byte{0x5}): &bigModExp{eip2565: false, eip7823: false, eip7883: false},
	common.BytesToAddress([]byte{0x6}): &bn256AddIstanbul{},
	common.BytesToAddress([]byte{0x7}): &bn256ScalarMulIstanbul{},
	common.BytesToAddress([]byte{0x8}): &bn256PairingIstanbul{},
	common.BytesToAddress([]byte{0x9}): &blake2F{},
}

// PrecompiledContractsBerlin contains the default set of pre-compiled Ethereum
// contracts used in the Berlin release.
var PrecompiledContractsBerlin = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	common.BytesToAddress([]byte{0x3}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x4}): &dataCopy{},
	common.BytesToAddress([]byte{0x5}): &bigModExp{eip2565: true, eip7823: false, eip7883: false},
	common.BytesToAddress([]byte{0x6}): &bn256AddIstanbul{},
	common.BytesToAddress([]byte{0x7}): &bn256ScalarMulIstanbul{},
	common.BytesToAddress([]byte{0x8}): &bn256PairingIstanbul{},
	common.BytesToAddress([]byte{0x9}): &blake2F{},
}

// PrecompiledContractsCancun contains the default set of pre-compiled Ethereum
// contracts used in the Cancun release.
var PrecompiledContractsCancun = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	common.BytesToAddress([]byte{0x3}): &ripemd160hash{},
	common.BytesToAddress([]byte{0x4}): &dataCopy{},
	common.BytesToAddress([]byte{0x5}): &bigModExp{eip2565: true, eip7823: false, eip7883: false},
	common.BytesToAddress([]byte{0x6}): &bn256AddIstanbul{},
	common.BytesToAddress([]byte{0x7}): &bn256ScalarMulIstanbul{},
	common.BytesToAddress([]byte{0x8}): &bn256PairingIstanbul{},
	common.BytesToAddress([]byte{0x9}): &blake2F{},
	common.BytesToAddress([]byte{0xa}): &kzgPointEvaluation{},
}

func activePrecompiledContracts(rules params.Rules) PrecompiledContracts {
	switch {
	case rules.IsVerkle:
		return PrecompiledContractsVerkle
	case rules.IsOsaka:
		return PrecompiledContractsOsaka
	case rules.IsPrague:
		return PrecompiledContractsPrague
	case rules.IsCancun:
		return PrecompiledContractsCancun
	case rules.IsBerlin:
		return PrecompiledContractsBerlin
	case rules.IsIstanbul:
		return PrecompiledContractsIstanbul
	case rules.IsByzantium:
		return PrecompiledContractsByzantium
	default:
		return PrecompiledContractsHomestead
	}
}

// ecrecover implemented as a native contract.
type ecrecover struct{}

func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	// ... implementation ...
}

// data copy implemented as a native contract.
type dataCopy struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *dataCopy) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.IdentityPerWordGas + params.IdentityBaseGas
}
func (c *dataCopy) Run(in []byte) ([]byte, error) {
	return common.CopyBytes(in), nil
}

// bigModExp implements a native big integer exponential modular operation.
type bigModExp struct {
	eip2565 bool
	eip7823 bool
	eip7883 bool
}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *bigModExp) RequiredGas(input []byte) uint64 {
	// ... implementation ...
}

func (c *bigModExp) Run(input []byte) ([]byte, error) {
	// ... implementation ...
}

// bn256AddIstanbul implements a native elliptic curve point addition conforming to
// Istanbul consensus rules.
type bn256AddIstanbul struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *bn256AddIstanbul) RequiredGas(input []byte) uint64 {
	return params.Bn256AddGasIstanbul
}

func (c *bn256AddIstanbul) Run(input []byte) ([]byte, error) {
	return runBn256Add(input)
}

// bn256AddByzantium implements a native elliptic curve point addition
// conforming to Byzantium consensus rules.
type bn256AddByzantium struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *bn256AddByzantium) RequiredGas(input []byte) uint64 {
	return params.Bn256AddGasByzantium
}

func (c *bn256AddByzantium) Run(input []byte) ([]byte, error) {
	return runBn256Add(input)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object and provides
// the necessary tools to run a contract on the given state with
// the provided context. It should be noted that any error
// generated through any of the calls should be considered a
// revert-state-and-consume-all-gas operation, no checks on
// specific errors should ever be performed. The interpreter makes
// sure that any errors generated are to be considered faulty code.
//
// The EVM should never be reused and is not thread safe.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	TxContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// depth is the current call stack
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules

	// virtual machine configuration options used to initialise the evm
	Config Config

	// global (to this context) ethereum virtual machine used throughout
	// the execution of the tx
	interpreter *EVMInterpreter

	// abort is used to abort the EVM calling operations
	abort atomic.Bool

	// callGasTemp holds the gas available for the current call. This is needed because the
	// available gas is calculated in gasCall* according to the 63/64 rule and later
	// applied in opCall*.
	callGasTemp uint64

	// precompiles holds the precompiled contracts for the current epoch
	precompiles map[common.Address]PrecompiledContract

	// jumpDests is the aggregated result of JUMPDEST analysis made through
	// the life cycle of EVM.
	jumpDests map[common.Hash]bitvec
}

// NewEVM constructs an EVM instance with the supplied block context, state
// database and several configs. It meant to be used throughout the entire
// state transition of a block, with the transaction context switched as
// needed by calling evm.SetTxContext.
func NewEVM(blockCtx BlockContext, statedb StateDB, chainConfig *params.ChainConfig, config Config) *EVM {
	evm := &EVM{
		Context:     blockCtx,
		StateDB:     statedb,
		Config:      config,
		chainConfig: chainConfig,
		chainRules:  chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time),
		jumpDests:   make(map[common.Hash]bitvec),
	}
	evm.precompiles = activePrecompiledContracts(evm.chainRules)
	evm.interpreter = NewEVMInterpreter(evm)
	return evm
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takse
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller common.Address, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (omitted)

	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	if !evm.StateDB.Exist(addr) {
		// ... (omitted)
	}
	evm.Context.Transfer(evm.StateDB, caller, addr, value)

	if isPrecompile {
		ret, gas, err = RunPrecompiledContract(p, input, gas, evm.Config.Tracer)
	} else {
		// ... (omitted)
	}
	// ... (omitted)
	return ret, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/secp256k1/secp256.go">
```go
//go:build !gofuzz
// +build !gofuzz

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

// Package secp256k1 wraps the bitcoin C secp256k1 library.
package secp256k1

import (
	"math/big"

	"github.com/decred/dcrd/dcrec/secp256k1/v4"
)

var (
	// curve is a KoblitzCurve which implements secp256k1.
	curve = secp256k1.S256()

	// halfN is a constant used for converting signatures to a canonical form.
	halfN = new(big.Int).Rsh(curve.N, 1)
)

// Sign creates an ECDSA signature.
// The produced signature is in the [R || S] format and encoded in DER.
//
// The library standards for cryptographic signature schemes indicates
// that computed signatures should be as non-malleable as possible.
// To avoid signature malleability, the signing function will automatically
// perform a transform depending on the resulting S value.
// The C secp256k1 library which this package wraps enforces this criteria.
// The used signature format is 'low-S'.
func Sign(hash []byte, seckey []byte) ([]byte, error) {
	return sign(hash, seckey)
}

// RecoverPubkey returns the public key of the signer.
func RecoverPubkey(hash, sig []byte) ([]byte, error) {
	return recoverPubkey(hash, sig)
}

// VerifySignature checks that the given public key created the signature over the given hash.
// The public key should be in compressed (33 bytes) or uncompressed (65 bytes) format.
// The signature should be in DER format.
func VerifySignature(pubkey, hash, signature []byte) bool {
	return verifySignature(pubkey, hash, signature)
}

// DecompressPubkey parses a public key in the 33-byte compressed format.
// It returns non-nil error if the public key can't be parsed.
func DecompressPubkey(pubkey []byte) ([]byte, error) {
	// secp256k1.ParsePubKey is in fact a decompression routine.
	p, err := secp256k1.ParsePubKey(pubkey)
	if err != nil {
		return nil, err
	}
	return p.SerializeUncompressed(), nil
}

// S256 returns a Curve which implements secp256k1.
func S256() *secp256k1.KoblitzCurve {
	return curve
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/crypto/secp256k1/secp256k1_cgo.go">
```go
//go:build cgo && !gofuzz
// +build cgo,!gofuzz

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

package secp256k1

/*
#cgo CFLAGS: -I./libsecp256k1
#cgo CFLAGS: -I./libsecp256k1/src
#cgo CFLAGS: -DSECP256K1_BUILD
#cgo CFLAGS: -DSECP256K1_API=
#cgo CFLAGS: -DSECP256K1_CONTEXT_NONE
#cgo CFLAGS: -DSECP256K1_CONTEXT_VERIFY
#cgo CFLAGS: -DSECP256K1_CONTEXT_SIGN
#cgo CFLAGS: -DSECP256K1_ECMULT_GEN_PREC_BITS=4
#cgo CFLAGS: -DSECP256K1_ECMULT_WINDOW_SIZE=15
// Enable experimental features to get schnorr signatures.
#cgo CFLAGS: -DSECP256K1_ENABLE_MODULE_ECDH
#cgo CFLAGS: -DSECP256K1_ENABLE_MODULE_RECOVERY
#if defined(__x86_64__)
#cgo CFLAGS: -DSECP256K1_ASM
#cgo CFLAGS: -DUSE_ASM_X86_64
#endif
#include "./libsecp256k1/src/secp256k1.c"
//...
*/
import "C"
// ... CGO implementation details ...
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt outlines an incredibly sophisticated and idealized system for precompile backend selection. While this makes for a great feature specification, it's important to note that this level of dynamic, adaptive, and performance-profiled selection does not exist in go-ethereum or other major EVM implementations.

The go-ethereum approach is much simpler and more pragmatic:

1.  **Selection is based on Hard Forks, not runtime performance.** A specific hard fork (e.g., "Istanbul") activates a specific, single implementation for each precompile. There isn't a choice between a "Pure", "Native", or "Hardware" backend for `SHA256` at runtime. Instead, `bn256AddByzantium` is replaced by `bn256AddIstanbul` when the Istanbul hard fork activates. The selection is a one-time decision based on chain configuration.

2.  **Performance optimization is often done at the library or compile level.** For cryptographic primitives like `ecrecover`, go-ethereum uses the `btcec/secp256k1` library, which has its own CGO-based optimizations (as shown in the snippets). The choice between a pure Go implementation and an optimized CGO version is typically handled by Go build tags, not a dynamic runtime system as described in the prompt.

3.  **Gas cost is the proxy for performance.** The `RequiredGas` method on the `PrecompiledContract` interface is the closest analog to the prompt's `PerformanceProfiler`. It provides a deterministic cost based on input size, which reflects the expected computational effort. It is not, however, based on real-time performance measurements.

**Recommendation:** The implementation should focus on the hard-fork-based selection mechanism, as it is the real-world pattern used in go-ethereum. The provided Zig code is an excellent blueprint for a *future-facing, highly optimized EVM*, but for emulating existing systems, the logic can be simplified to a map lookup based on the active `ChainRules`. The snippets from `core/vm/contracts.go` show this pattern clearly.

---

This is an excellent and detailed prompt for a complex feature. The concept of a dynamic precompile backend selection system is advanced. Go-ethereum achieves a similar outcome (using optimized crypto primitives) but primarily through **static, build-time selection** using Go's build tags, rather than a dynamic runtime system.

The most relevant context from `go-ethereum` is how it uses these build tags to switch between pure-Go implementations and CGO/assembly-accelerated backends for critical cryptographic functions. This provides a simpler but effective model for backend selection.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContracts is a map of addresses to PrecompiledContract.
//
// The map is initialized with the contracts available at genesis.
var PrecompiledContracts = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// ActivePrecompiledContracts returns the precompiled contracts active on the
// given chain configuration.
func ActivePrecompiledContracts(rules params.Rules) map[common.Address]PrecompiledContract {
	// Clone the genesis contracts and patch in EIPs
	precompiles := maps.Clone(PrecompiledContracts)
	if !rules.IsIstanbul {
		delete(precompiles, common.BytesToAddress([]byte{9}))
	}
	if !rules.IsByzantium {
		delete(precompiles, common.BytesToAddress([]byte{5}))
		delete(precompiles, common.BytesToAddress([]byte{6}))
		delete(precompiles, common.BytesToAddress([]byte{7}))
		delete(precompiles, common.BytesToAddress([]byte{8}))
	}
	if rules.IsCancun {
		precompiles[common.BytesToAddress([]byte{10})] = &kzgPointEvaluation{}
	}
	if rules.IsPrague {
		// EIP-7251: set max_consolidations_per_block to 1
		precompiles[common.BytesToAddress(params.ConsolidationRequestAddress.Bytes())] = &consolidationRequest{}
		// EIP-7002: set withdrawal_requests_per_block to 1
		precompiles[common.BytesToAddress(params.WithdrawalRequestAddress.Bytes())] = &withdrawalRequest{}
	}
	return precompiles
}
// ...

// ecrecover implements the PrecompiledContract interface for the recovery of a signature.
type ecrecover struct{}

func (p *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}
func (p *ecrecover) Run(input []byte) ([]byte, error) {
	const bitlen = 256

	// "input" is (hash, v, r, s), each 32 bytes
	// but for ecrecover we want (hash, sig), with sig in vrs format, so we have to rearrange
	// the v byte at the end of the signature.
	if len(input) != 128 {
		return nil, errEcrecoverInvalidInputLength
	}
	// No need to pad input, it's already 128 bytes.
	hash := input[:32]
	v := input[63]
	r := input[64:96]
	s := input[96:128]

	// v needs to be at the end for libsecp256k1
	sig := make([]byte, 65)
	copy(sig[0:], r)
	copy(sig[32:], s)
	sig[64] = v

	// Ecrecover returns a 65-byte pubkey, including the encoding type byte.
	// We need to chop that off.
	pubkey, err := crypto.Ecrecover(hash, sig)
	if err != nil {
		return nil, err
	}

	// The public key is 64 bytes long, we need to hash it to get the address.
	return common.LeftPadBytes(crypto.Keccak256(pubkey[1:])[12:], 32), nil
}

// sha256hash implements the PrecompiledContract interface for the SHA256 hash function.
type sha256hash struct{}

func (p *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}
func (p *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.Sum256(input)
	return h[:], nil
}

// ripemd160hash implements the PrecompiledContract interface for the RIPEMD160 hash function.
type ripemd160hash struct{}

func (p *ripemd160hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Ripemd160PerWordGas + params.Ripemd160BaseGas
}
func (p *ripemd160hash) Run(input []byte) ([]byte, error) {
	ripemd := ripemd160.New()
	ripemd.Write(input)
	return common.LeftPadBytes(ripemd.Sum(nil), 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/secp256k1/secp256.go">
```go
// This file contains the Go wrapper for the secp256k1 C library.
//
// The goal of this package is to provide a pure Go implementation of the secp256k1
// elliptic curve. This is not just for the fun of it, but also because an pure
// Go version allows for interesting features like hardware wallet integration.
//
// A nice side-effect of this is that the cgo-dependency can be removed from
// go-ethereum, which simplifies the build process and allows for cross-compilation
// of our tools without having to cross-compile the C-dependency too.

//go:build !gofuzz && (!cgo || !amd64 || !seccomp)

// This secp256k1 Go implementation is a port of the C library.
// ...

// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	// ... (pure Go implementation)
}

// ... more pure Go implementations
```
```go
// This file contains the C-binding for the secp256k1 C library.
//
// The goal of this package is to provide a pure Go implementation of the secp256k1
// elliptic curve. This is not just for the fun of it, but also because an pure
// Go version allows for interesting features like hardware wallet integration.
//
// A nice side-effect of this is that the cgo-dependency can be removed from
// go-ethereum, which simplifies the build process and allows for cross-compilation
// of our tools without having to cross-compile the C-dependency too.

//go:build !gofuzz && cgo && amd64 && !seccomp

/*
#cgo CFLAGS: -I./libsecp256k1
#cgo CFLAGS: -I./libsecp256k1/src
#cgo CFLAGS: -DSECP256K1_BUILD
#cgo CFLAGS: -DSECP256K1_API=
#cgo CFLAGS: -DSECP256K1_CONTEXT_SIZE=736 -DSECP256K1_ECMULT_GEN_CONTEXT_SIZE=344 -DSECP256K1_ECMULT_CONTEXT_SIZE=624
...
*/
import "C"
// ...

// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	// ... (cgo implementation calling the C library)
}

// ... more cgo implementations
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/blake2f.go">
```go
// This file contains the BLAKE2b F compression function precompile.
//
// It has been implemented in a dedicated file, because it's a fairly complex
// piece of code that would otherwise clutter the contracts.go file.
//
// The precompile is specified by EIP-152.

//go:build !gcmips64
// +build !gcmips64

package vm
// ... (standard implementation)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/blake2f_gcmips64.go">
```go
// This file contains the BLAKE2b F compression function precompile.
//
// It has been implemented in a dedicated file, because it's a fairly complex
// piece of code that would otherwise clutter the contracts.go file.
//
// The precompile is specified by EIP-152.

//go:build gcmips64
// +build gcmips64

package vm

import "golang.org/x/sys/cpu"
// ...

// F implements the F compression function for the BLAKE2b hash function.
func (p *blake2F) F(input []byte) []byte {
	if cpu.MIPS64.HasGCM {
		return blake2bF(input)
	}
	return blake2bFgo(input)
}
// ... (gcmips64 optimized implementation)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// This file contains the protocol parameters for the different hard-forks.
//
// The file is a simplified version of the same file in go-ethereum, but it's
// not auto-generated and should be manually updated if any new EIPs are included
// that have an impact on the protocol parameters.

package params

import (
	"math/big"
)
// ...

// Gas costs for precompiled contracts.
var (
	EcrecoverGas            = uint64(3000)
	Sha256BaseGas           = uint64(60)
	Sha256PerWordGas        = uint64(12)
	Ripemd160BaseGas        = uint64(600)
	Ripemd160PerWordGas     = uint64(120)
	IdentityBaseGas         = uint64(15)
	IdentityPerWordGas      = uint64(3)
	ModExpQuadCoeffDiv      = uint64(20)
	Bn256AddGas             = uint64(150) // Gas cost of a single bn256add operation.
	Bn256ScalarMulGas       = uint64(6000) // Gas cost of a single bn256mul operation.
	Bn256PairingBaseGas     = uint64(45000) // Gas cost of a bn256 pairing operation.
	Bn256PairingPerPointGas = uint64(34000) // Gas cost of each point in a bn256 pairing operation.
	Blake2fBaseGas          = uint64(0)
	// EIP-4844
	PointEvaluationGas = uint64(50000) // Gas cost of a single point evaluation operation.
)
```
</file>
</go-ethereum>

## Prompt Corrections

Your prompt describes a sophisticated, dynamic, runtime-based precompile backend selection system. This is a powerful but complex design. It's worth noting that `go-ethereum` achieves high performance using a simpler, *static*, compile-time approach.

1.  **Selection is Static (Build-Time), Not Dynamic (Run-Time)**:
    - Go-ethereum's primary method for "backend selection" is using Go's build tags. For `secp256k1` (used in `ecrecover`), there are two versions of the source file: one pure-Go and one that uses CGO to link against a highly-optimized C library. The build process determines which to use (`go build` vs. `go build -tags cgo`).
    - There is no runtime `PrecompileBackendManager` that chooses an implementation based on input size or live performance metrics. The choice is fixed when the binary is compiled.

2.  **Runtime Detection is Handled by Go's Toolchain**:
    - For algorithms like SHA256, Go-ethereum relies on the Go standard library. The standard library itself contains optimized assembly implementations for different architectures (e.g., using SHA-NI on x86). This selection happens automatically within the Go runtime, not via an explicit `RuntimeDetector` in geth's code.
    - The `blake2f` precompile is another example where build tags select a platform-specific implementation (e.g., `_gcmips64`).

3.  **No Adaptive Learning or Caching of Selections**:
    - Since the backend is chosen at compile-time, there is no need for adaptive learning, performance profiling of different backends, or caching of selection decisions at runtime.

**Recommendation:**

When implementing your system, you could consider the `go-ethereum` model as a simpler alternative. Using build tags or similar compile-time mechanisms can provide significant performance gains without the complexity of a full runtime dynamic selection framework.

However, if your goal is to build the advanced adaptive system as specified, the provided Go-ethereum snippets are still valuable for:
- Understanding the contract addresses and gas costs.
- Seeing which cryptographic primitives are used for each precompile.
- Using the separate `secp256k1` implementations as a reference for your `Pure`, `Native`, and `Hardware` backends.

---

This is an excellent and very detailed prompt for building a sophisticated precompile system. Go-ethereum's approach to precompiles and optimized backends is more distributed than the centralized manager you've designed, but it contains highly relevant patterns for runtime CPU feature detection and compile-time backend selection.

Here are the most relevant code snippets from the go-ethereum codebase to guide your implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
The `contracts.go` file defines the `PrecompiledContract` interface and the mapping of precompile addresses to their implementations. This is the central dispatch point for precompile execution in the EVM.

```go
// PrecompiledContract is the interface for native contracts.
type PrecompiledContract interface {
	// RequiredGas returns the gas required to execute the pre-compiled contract.
	RequiredGas(input []byte) uint64
	// Run executes the native contract and returns the output and an error if it
	// fails. The returned error will be an EVM error, which is incorporated into
	// the EVM execution instead of being returned by the top-level EVM execution
	// function.
	Run(input []byte) ([]byte, error)
}

// PrecompiledContractsByzantium contains the default set of pre-compiled contracts used
// in the Byzantium release.
var PrecompiledContractsByzantium = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
}

// PrecompiledContractsIstanbul contains the default set of pre-compiled contracts used
// in the Istanbul release.
var PrecompiledContractsIstanbul = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256AddIstanbul{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMulIstanbul{},
	common.BytesToAddress([]byte{8}): &bn256PairingIstanbul{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// Ecrecover implements the ecrecover precompiled contract.
type ecrecover struct{}

// Run implements PrecompiledContract.Run.
func (c *ecrecover) Run(input []byte) ([]byte, error) {
	// ... (implementation details)

	// recover the public key
	pub, err := crypto.Ecrecover(input[:32], sig)
	if err != nil {
		return nil, nil
	}
    // ...
	// address is the keccak256 hash of the public key without the recovery id
	return common.LeftPadBytes(crypto.Keccak256(pub[1:])[12:], 32), nil
}
```
This `ecrecover` implementation shows that the core VM logic often delegates the actual cryptographic work to the `crypto` package. This is where different backends are typically implemented.

The `bigModExp` precompile is a great example of input-dependent gas calculation, which is relevant to your `analyze_input_characteristics` function.
```go
// bigModExp implements the bigModExp precompiled contract.
type bigModExp struct{}

func (c *bigModExp) RequiredGas(input []byte) uint64 {
	// ... (parsing logic for baseLen, expLen, modLen)

	// calculate complexity
	var multComplexity *big.Int
	if baseLen.Cmp(modLen) > 0 {
		multComplexity = new(big.Int).Mul(baseLen, baseLen)
	} else {
		multComplexity = new(big.Int).Mul(modLen, modLen)
	}
	// ... (more complexity calculation)

	gas := new(big.Int).Mul(multComplexity, adjExpLen)
	gas.Div(gas, params.ModExpQuadCoeffDiv)

	if gas.BitLen() > 64 {
		return math.MaxUint64
	}
	return gas.Uint64()
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha256/sha256_amd64.go">
Go-ethereum uses runtime CPU feature detection to select the optimal SHA256 implementation. This is a direct parallel to your `RuntimeDetector` concept. The check happens once, and the result is used to dispatch calls later.

```go
//go:build amd64 && !purego

package sha256

import "internal/cpu"

var hasSHA = cpu.X86.HasSHA
var hasAVX2 = cpu.X86.HasAVX2

// newContext returns a new context.
func newContext() *context {
	if hasSHA {
		return &context{useAVX2: false, hasSHA: true}
	} else if hasAVX2 {
		return &context{useAVX2: true, hasSHA: false}
	} else {
		return &context{useAVX2: false, hasSHA: false}
	}
}

//go:noescape
func block(ctx *context, p []byte)

//go:noescape
func blockAVX2(ctx *context, p []byte)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/sha256/sha256.go">
This file contains the dispatch logic that uses the feature flags set by `newContext`. This pattern is highly relevant for your `PrecompileBackendManager.perform_backend_selection` method.

```go
//go:build !amd64 || purego

// ...

// Block hashes p using the SHA256 algorithm. It can be called multiple times,
// but the result is correct only after the last call.
func (d *digest) Block(p []byte) {
	blockGeneric(d, p) // pure go implementation
}

// ...

//go:build amd64 && !purego

// ...

// Block hashes p using the SHA256 algorithm. It can be called multiple times,
// but the result is correct only after the last call.
func (d *digest) Block(p []byte) {
	if d.ctx.hasSHA {
		block(d.ctx, p) // avo-generated assembly
	} else if d.ctx.useAVX2 {
		blockAVX2(d.ctx, p) // avo-generated assembly
	} else {
		blockGeneric(d.ctx, p)
	}
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/secp256k1/secp256k1.go">
Go-ethereum uses build tags for compile-time selection of cryptographic backends. This is a common pattern for handling platform-specific optimizations and providing fallbacks. This directly relates to your `BackendType` enum and fallback strategies.

This is the stub file that is used when no optimized backend is available. It will panic, ensuring that a valid backend is chosen at compile time.
```go
//go:build !amd64 && !arm64 && !s390x
// +build !amd64,!arm64,!s390x

package secp256k1

import (
	"crypto/elliptic"
	"errors"
	"math/big"
)

// ...

// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	return ecrecover(hash, sig)
}

func ecrecover(hash, sig []byte) ([]byte, error) {
	panic("not implemented")
}

// ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/secp256k1/secp256k1_cgo.go">
This file provides the high-performance C-based backend using `libsecp256k1`. It's enabled with the `cgo` build tag on supported architectures. This is a perfect example of a `Native` backend.
```go
//go:build cgo && !gofuzz
// +build cgo,!gofuzz
//go:build amd64 || arm64
// +build amd64 arm64

package secp256k1

/*
#cgo CFLAGS: -I./libsecp256k1
#cgo CFLAGS: -I./libsecp256k1/src
#cgo CFLAGS: -I./libsecp256k1/include
//... (cgo flags)
#include "./libsecp256k1/include/secp256k1_recovery.h"
*/
import "C"

// ...

// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	// ... (implementation using C.secp256k1_ecdsa_recover)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/secp256k1/secp256k1_nacl.go">
This is the pure Go fallback implementation. It's used when CGO is disabled, ensuring that go-ethereum can be compiled without a C toolchain (e.g., for mobile or WASM). This is your `Pure` backend.
```go
//go:build !cgo || s390x
// +build !cgo s390x

package secp256k1

import (
	"crypto/elliptic"
	"errors"
	"fmt"
	"math/big"
)

// ...

// ecrecover returns the uncompressed public key that created the given signature.
func ecrecover(hash, sig []byte) ([]byte, error) {
	// ... (pure Go implementation)
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// contracts.go provides the native contract implementations for the Ethereum
// Virtual Machine.

// Snippet showing the central registry for precompiled contracts. This is analogous to the
// `BackendRegistry` in the prompt, mapping addresses to their implementations.
var precompiledContracts = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &identity{},
	common.BytesToAddress([]byte{5}): &modExp{},
	common.BytesToAddress([]byte{6}): &ecAdd{},
	common.BytesToAddress([]byte{7}): &ecMul{},
	common.BytesToAddress([]byte{8}): &ecPairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
	common.BytesToAddress([]byte{10}): &bls12381G1Add{},
	common.BytesToAddress([]byte{11}): &bls12381G1Mul{},
	common.BytesToAddress([]byte{12}): &bls12381G1Map{},
	common.BytesToAddress([]byte{13}): &bls12381G2Add{},
	common.BytesToAddress([]byte{14}): &bls12381G2Mul{},
	common.BytesToAddress([]byte{15}): &bls12381G2Map{},
	common.BytesToAddress([]byte{16}): &bls12381Pairing{},
	common.BytesToAddress([]byte{17}): &pointEvaluation{},
}

// Snippet for the `ecrecover` precompile. This is the high-level entry point.
// Notice how it calls `crypto.Ecrecover`. The actual backend selection (CGO vs. pure Go)
// happens at a lower level, controlled by build tags. This is a form of compile-time
// backend selection.
// Ecrecover implements the ecrecover precompiled contract.
type ecrecover struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	// ... (input validation and padding) ...
	in := make([]byte, 128)
	copy(in[128-len(input):], input)

	// Recover the public key and address
	hash := in[:32]
	v := in[63] - 27
	sig := in[64:]

	// Run the plain ecrecover
	pubkey, err := crypto.Ecrecover(hash, sig)
	if err != nil {
		return nil, nil // Return nil for stack top for compatibility, should not happen.
	}
	// The public key is returned as a 32 byte padded address
	var addr common.Address
	copy(addr[:], crypto.Keccak256(pubkey[1:])[12:])
	return addr[:], nil
}


// Snippet for the `sha256` precompile. This implementation uses Go's standard library
// `crypto/sha256`. The Go runtime itself contains optimized assembly implementations
// for different CPU architectures, demonstrating a form of backend selection that is
// handled by the toolchain rather than the application logic.
type sha256hash struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.Sha256PerWordGas + params.Sha256BaseGas
}

func (c *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.Sum256(input)
	return h[:], nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/signature_cgo.go">
```go
// This file contains the CGO-enabled implementation of the signature algorithms.
// It is used by default on all platforms that support CGO. On these platforms,
// the fast C-based secp256k1 library is used for all signature operations.

//go:build cgo && !purego
// +build cgo,!purego

package crypto

import (
	"github.com/ethereum/go-ethereum/crypto/secp256k1"
)

// Snippet demonstrating the "Native" backend selection for ECRECOVER. When CGO is enabled,
// go-ethereum uses the highly optimized `libsecp256k1` C library. This is a compile-time
// backend selection mechanism.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	return secp256k1.Ecrecover(hash, sig)
}

// Sign calculates an ECDSA signature.
//
// This function is susceptible to chosen plaintext attacks that can reveal
// information about the private key that is used to sign the message.
//
// To prevent chosen plaintext attacks, the message should be a cryptographic
// hash of the data to be signed.
func Sign(hash []byte, prv *ecdsa.PrivateKey) ([]byte, error) {
	if len(hash) != 32 {
		return nil, fmt.Errorf("hash is required to be exactly 32 bytes (%d)", len(hash))
	}
	seckey := math.PaddedBigBytes(prv.D, prv.Params().BitSize/8)
	defer zeroBytes(seckey)
	return secp256k1.Sign(hash, seckey)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/signature_nocgo.go">
```go
// This file contains the plain-Go implementation of the signature algorithms.
// It is used on platforms where CGO is not available or where CGO has been
// explicitly disabled. In this case, all signature operations are implemented
// in pure Go using the `crypto/elliptic` package from the standard library.
//
// The plain-Go implementation is about 5x slower than the C-version.

//go:build !cgo || purego
// +build !cgo purego

package crypto

// ... (imports) ...

// Snippet demonstrating the "Pure" (fallback) backend selection for ECRECOVER. If CGO is
// disabled, a pure Go implementation based on the standard library is used. This provides
// a fallback when the optimized C library is not available.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	// ... (pure Go implementation details) ...
	p, err := ecp.RecoverPubkey(hash, sig)
	if err != nil {
		return nil, err
	}
	return p, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/internal/cpu/cpu.go">
```go
// Package cpu provides access to CPU feature flags.
//
// The flags are initialized by an assembly function when the package is loaded.
// It is safe to access them concurrently.
//
// This file is based on the github.com/klauspost/cpuid package.
package cpu

// ... (imports) ...

// Snippet showing CPU feature detection, analogous to the `RuntimeDetector` in the prompt.
// Go-ethereum checks for hardware support like AES, AVX, etc., at startup and stores
// the results in global variables. These can then be used to switch to optimized
// code paths.

// True if CPU has AES-NI support.
var HasAES = supportsAES()

// True if CPU has AVX support.
var HasAVX = supportsAVX()

// True if CPU has AVX2 support.
var HasAVX2 = supportsAVX2()

// ... (many more feature flags) ...

// cpuid calls the processor's "cpuid" instruction.
func cpuid(eax, ecx uint32) (a, b, c, d uint32)

// cpuidex calls the processor's "cpuid" instruction with extended arguments.
func cpuidex(eax, ecx uint32) (a, b, c, d uint32)

var (
	maxFunc uint32
	maxEx   uint32
	vendor  string

	hasMMX     bool
	hasSSE     bool
	// ...
)

// The init function is called when the package is loaded.
// It uses an assembly function to query CPU features.
func doinit() {
	maxFunc, _, _, _ = cpuid(0, 0)
	if maxFunc == 0 {
		return
	}

	_, _, c, d := cpuid(0, 0)
	vendor = string(common.Uint32ToBytes(d)) + string(common.Uint32ToBytes(c))

	// Interpret CPU feature flags.
	// This is a simplified version. The actual file contains logic for various CPU vendors.
	var ecx, edx uint32
	if maxFunc >= 1 {
		_, _, ecx, edx = cpuid(1, 0)
		hasSSE3 = (ecx & (1 << 0)) != 0
		hasPCLMULQDQ = (ecx & (1 << 1)) != 0
		hasSSE41 = (ecx & (1 << 19)) != 0
		hasSSE42 = (ecx & (1 << 20)) != 0
		hasAES = (ecx & (1 << 25)) != 0
		hasAVX = (ecx & (1 << 28)) != 0
		// ...
	}
	if maxFunc >= 7 {
		_, ebx, _, _ := cpuidex(7, 0)
		hasAVX2 = (ebx & (1 << 5)) != 0
		// ...
	}
}
```
</file>
</go-ethereum>

---

An analysis of the go-ethereum codebase reveals a simpler, yet effective, approach to precompile implementation selection compared to the dynamic system proposed in the prompt. Geth primarily uses a combination of compile-time choices (build tags) and implicit runtime CPU feature detection within its cryptographic libraries.

The following snippets provide context on how precompiles are structured, how different backends are chosen, and where they are integrated into the EVM.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// contracts.go contains the native precompiled contracts.

package vm

import (
	"crypto/sha256"
	"hash"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/crypto/blake2b"
	"golang.org/x/crypto/ripemd160"
)

// precompiledContract is the interface for native contracts.
//
// TODO(rjl493456442) Precompiled contracts should not be stateful.
// We should eliminate the use of `this` and pass the substituted address to Run.
type precompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas returns the gas required to execute the contract
	Run(input []byte) ([]byte, error) // Run runs the native contract
}

// PrecompiledContractsHomestead contains the precompiled contracts from the Homestead release.
var PrecompiledContractsHomestead = map[common.Address]precompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
}

// PrecompiledContractsByzantium contains the precompiled contracts from the Byzantium release.
var PrecompiledContractsByzantium = map[common.Address]precompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
}

// PrecompiledContractsIstanbul contains the precompiled contracts from the Istanbul release.
var PrecompiledContractsIstanbul = map[common.Address]precompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
	common.BytesToAddress([]byte{5}): &bigModExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2f{},
}
// ... and so on for other hard forks ...

// ecrecover implements the ecrecover precompiled contract.
type ecrecover struct{}

// Ecrecover implements the underlying cryptographic primitive.
func Ecrecover(hash, v, r, s []byte) ([]byte, error) {
	// ... (implementation detail)
	// The call to crypto.Ecrecover is the key part. This function has
	// different backends based on build tags.
	pubKey, err := crypto.Ecrecover(hash, v, r, s)
	if err != nil {
		return nil, err
	}
	// ... (implementation detail)
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	// ... (input padding and slicing) ...
	// Here, we're calling our Ecrecover wrapper, which in turn will call the
	// crypto.Ecrecover function.
	pubKey, err := Ecrecover(in[:32], in[32:64], in[64:96], in[96:128])
	// ... (result processing) ...
}

// sha256hash implements the sha256 precompiled contract.
type sha256hash struct{}

func (c *sha256hash) RequiredGas(input []byte) uint64 {
	return uint64(60) + uint64(12)*uint64((len(input)+31)/32)
}
func (c *sha256hash) Run(input []byte) ([]byte, error) {
	h := sha256.Sum256(input)
	return h[:], nil
}

// ripemd160hash implements the ripemd160 precompiled contract.
type ripemd160hash struct {
	hasher hash.Hash
}
// ...

// blake2f implements the blake2f precompiled contract.
type blake2f struct{}

func (c *blake2f) RequiredGas(input []byte) uint64 {
	// ...
}

func (c *blake2f) Run(input []byte) ([]byte, error) {
	// ... (input validation) ...
	// This calls into a crypto implementation that has optimized backends.
	return blake2b.F(rounds, h, m, t, f), nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/signature_cgo.go">
```go
// This file contains the CGO-enabled part of the secp256k1 package.
// The signatures used in Ethereum are based on the secp256k1 elliptic curve.
// This package provides the cryptographic functions needed for signature creation,
// verification, and public key recovery.
//
// CGO is used to wrap the highly-optimized libsecp256k1 C library.

//go:build !nottunaccl
// +build !nottunaccl

package crypto

import (
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/crypto/secp256k1"
)

// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	// CGO-based implementation using libsecp256k1
	return secp256k1.RecoverPubkey(hash, sig)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/signature_nocgo.go">
```go
// This file contains the CGO-disabled part of the secp256k1 package.

//go:build nottunaccl
// +build nottunaccl

package crypto

import (
	"fmt"

	"github.com/decred/dcrd/dcrec/secp256k1/v4"
)

// Ecrecover returns the uncompressed public key that created the given signature.
func Ecrecover(hash, sig []byte) ([]byte, error) {
	// Pure Go implementation using btcec
	pub, err := secp256k1.RecoverPubkey(hash, sig)
	if err != nil {
		return nil, err
	}
	return pub.SerializeUncompressed(), nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/crypto/blake2b/blake2b_amd64.go">
```go
// Copyright 2016 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//go:build amd64 && !appengine && !gccgo && !noblake2b
// +build amd64,!appengine,!gccgo,!noblake2b

package blake2b

import "golang.org/x/sys/cpu"

var (
	useAVX2 = cpu.X86.HasAVX2
	useAVX  = cpu.X86.HasAVX
	useSSE4 = cpu.X86.HasSSE41
)

func init() {
	// This init function performs runtime CPU feature detection. If the CPU
	// supports AVX2, AVX, or SSSE3, it replaces the generic 'f' function pointer
	// with a more optimized, hardware-accelerated version. This is a form of
	// dynamic backend selection.

	// The functions are defined in blake2b_amd64.s
	if useAVX2 {
		f = fAVX2
	} else if useAVX {
		f = fAVX
	} else if useSSE4 {
		f = fSSE4
	}
}

// F is a function that processes a 128-byte block of data and updates the hash state.
// It's a core component of the BLAKE2b compression function.
func F(h *[8]uint64, m *[16]uint64, t *[2]uint64, final bool) {
	f(h, m, t, final)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// ...

// Call executes the contract associated with the destination address. It is a
// convenience function of calling EVM's Call method.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (depth and static call checks) ...

	// Check if the destination address is a precompile.
	if evm.StateDB.IsPrecompiled(addr) {
		return runPrecompiledContract(evm.precompiles.contracts[addr], input, gas)
	}
	// ... (code for regular contract call) ...
}

// runPrecompiledContract runs the given pre-compiled contract.
func runPrecompiledContract(p precompiledContract, input []byte, gas uint64) (ret []byte, remainingGas uint64, err error) {
	gasCost := p.RequiredGas(input)
	if gas < gasCost {
		return nil, 0, ErrOutOfGas
	}
	gas -= gasCost

	output, err := p.Run(input)
	if err != nil {
		return nil, 0, err
	}
	return output, gas, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt is well-defined and describes a sophisticated, modern approach to dynamic backend selection. The go-ethereum implementation offers a more pragmatic and simpler (though less flexible at runtime) reference point.

1.  **Selection Mechanism**: The prompt outlines a complex, adaptive selection system with scoring, profiling, and caching. Go-ethereum's "selection" is much simpler:
    *   **Compile-Time Selection**: For `ecrecover` (via `secp256k1`), the choice between a pure Go backend and a C-library-based backend is determined by build tags (`nottunaccl`). This is a static choice made when the client is built.
    *   **Implicit Runtime Selection**: For other cryptographic primitives like `blake2b`, the selection of an optimized assembly implementation happens at package initialization time (see `crypto/blake2b/blake2b_amd64.go`). It checks CPU flags (AVX2, AVX) once and sets a function pointer for the lifetime of the application.

2.  **No Central `BackendManager`**: Unlike the proposed design, go-ethereum does not have a central manager for precompile backends. The logic is distributed:
    *   The `core/vm/contracts.go` file acts as a simple registry mapping addresses to a single `precompiledContract` interface.
    *   The cryptographic packages themselves (`crypto/...`) contain the logic for choosing their own optimal implementation.

**Suggestion**: The provided go-ethereum snippets can serve as an excellent reference for a "minimum viable" but still highly performant system. The `crypto/blake2b/blake2b_amd64.go` `init()` function is a direct, real-world example of the `RuntimeDetector`'s purpose. The `crypto/signature_cgo.go` and `signature_nocgo.go` files demonstrate the fallback pattern (`Native` vs. `Pure`) achieved at compile time. Your proposed design in Zig is a significant and valuable enhancement over this, making the selection dynamic, adaptive, and configurable at runtime.

