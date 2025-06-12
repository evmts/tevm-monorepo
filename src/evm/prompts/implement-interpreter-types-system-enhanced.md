# Implement Interpreter Types System

You are implementing Interpreter Types System for the Tevm EVM written in Zig. Your goal is to implement robust type system for interpreter operations following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_interpreter_types_system` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_interpreter_types_system feat_implement_interpreter_types_system`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

## ELI5

Think of the interpreter types system like having a customizable computer that can swap out its components based on what you're doing. When you're gaming, you use a high-performance graphics card and lots of RAM. When traveling, you switch to a lightweight setup with extended battery life. When debugging code, you use components that provide detailed monitoring even if they're slower. The interpreter types system works the same way - it can configure itself with different "components" (stack types, memory managers, execution strategies) depending on whether you need maximum speed, minimal memory usage, detailed debugging, or maximum compatibility.

Implement a flexible interpreter types system that allows configurable interpreter components based on runtime requirements. This includes different execution strategies, stack implementations, memory managers, and optimization levels that can be selected at compile time or runtime to optimize for specific use cases (performance, memory usage, size, compatibility).

## Interpreter Types System Specifications

### Core Interpreter Framework

#### 1. Interpreter Type Manager
```zig
pub const InterpreterTypeManager = struct {
    allocator: std.mem.Allocator,
    config: InterpreterConfig,
    runtime_context: RuntimeContext,
    component_registry: ComponentRegistry,
    performance_profiler: PerformanceProfiler,
    type_selector: TypeSelector,
    
    pub const InterpreterConfig = struct {
        interpreter_type: InterpreterType,
        stack_type: StackType,
        memory_type: MemoryType,
        execution_strategy: ExecutionStrategy,
        optimization_level: OptimizationLevel,
        runtime_selection: bool,
        profiling_enabled: bool,
        adaptive_switching: bool,
        
        pub const InterpreterType = enum {
            Standard,        // Standard EVM interpreter
            Optimized,       // Performance-optimized interpreter
            Minimal,         // Size-optimized interpreter
            Debug,           // Debug-enabled interpreter
            Tracing,         // Execution tracing interpreter
            Fuzzing,         // Fuzzing-optimized interpreter
            Benchmarking,    // Benchmarking interpreter
            Compatible,      // Maximum compatibility interpreter
        };
        
        pub const StackType = enum {
            Standard,        // Standard 1024-element stack
            Optimized,       // Cache-optimized stack with prefetching
            Minimal,         // Size-optimized stack
            Debug,           // Debug-enabled stack with validation
            Unsafe,          // Maximum performance unsafe stack
            Bounded,         // Compile-time bounded stack
        };
        
        pub const MemoryType = enum {
            Standard,        // Standard expandable memory
            Optimized,       // Cache-optimized memory with alignment
            Minimal,         // Size-optimized memory
            Debug,           // Debug-enabled memory with tracking
            Pooled,          // Pre-allocated memory pools
            CopyOnWrite,     // Copy-on-write memory semantics
        };
        
        pub const ExecutionStrategy = enum {
            DirectCall,      // Direct function calls
            JumpTable,       // Jump table dispatch
            Computed,        // Computed goto (if supported)
            Threaded,        // Threaded interpretation
            Bytecode,        // Bytecode interpretation
            Hybrid,          // Hybrid approach
        };
        
        pub const OptimizationLevel = enum {
            Debug,           // No optimizations, maximum debugging
            Minimal,         // Minimal optimizations for size
            Balanced,        // Balanced performance and size
            Performance,     // Maximum performance optimizations
            Aggressive,      // Aggressive optimizations with tradeoffs
        };
        
        pub fn performance() InterpreterConfig {
            return InterpreterConfig{
                .interpreter_type = .Optimized,
                .stack_type = .Optimized,
                .memory_type = .Optimized,
                .execution_strategy = .JumpTable,
                .optimization_level = .Performance,
                .runtime_selection = false,
                .profiling_enabled = false,
                .adaptive_switching = false,
            };
        }
        
        pub fn size_optimized() InterpreterConfig {
            return InterpreterConfig{
                .interpreter_type = .Minimal,
                .stack_type = .Minimal,
                .memory_type = .Minimal,
                .execution_strategy = .DirectCall,
                .optimization_level = .Minimal,
                .runtime_selection = false,
                .profiling_enabled = false,
                .adaptive_switching = false,
            };
        }
        
        pub fn debug() InterpreterConfig {
            return InterpreterConfig{
                .interpreter_type = .Debug,
                .stack_type = .Debug,
                .memory_type = .Debug,
                .execution_strategy = .DirectCall,
                .optimization_level = .Debug,
                .runtime_selection = true,
                .profiling_enabled = true,
                .adaptive_switching = false,
            };
        }
        
        pub fn adaptive() InterpreterConfig {
            return InterpreterConfig{
                .interpreter_type = .Standard,
                .stack_type = .Standard,
                .memory_type = .Standard,
                .execution_strategy = .Hybrid,
                .optimization_level = .Balanced,
                .runtime_selection = true,
                .profiling_enabled = true,
                .adaptive_switching = true,
            };
        }
    };
    
    pub const RuntimeContext = struct {
        execution_count: u64,
        performance_metrics: PerformanceMetrics,
        memory_pressure: MemoryPressure,
        size_constraints: SizeConstraints,
        compatibility_requirements: CompatibilityRequirements,
        
        pub const PerformanceMetrics = struct {
            instructions_per_second: f64,
            cache_hit_rate: f64,
            memory_utilization: f64,
            average_execution_time: f64,
            hot_path_frequency: f64,
        };
        
        pub const MemoryPressure = enum {
            Low,
            Medium,
            High,
            Critical,
        };
        
        pub const SizeConstraints = struct {
            max_code_size: usize,
            max_memory_usage: usize,
            bundle_size_limit: usize,
        };
        
        pub const CompatibilityRequirements = struct {
            require_exact_gas: bool,
            require_standard_behavior: bool,
            require_debug_info: bool,
            require_tracing: bool,
        };
        
        pub fn init() RuntimeContext {
            return RuntimeContext{
                .execution_count = 0,
                .performance_metrics = std.mem.zeroes(PerformanceMetrics),
                .memory_pressure = .Low,
                .size_constraints = SizeConstraints{
                    .max_code_size = 1024 * 1024, // 1MB
                    .max_memory_usage = 16 * 1024 * 1024, // 16MB
                    .bundle_size_limit = 512 * 1024, // 512KB
                },
                .compatibility_requirements = CompatibilityRequirements{
                    .require_exact_gas = false,
                    .require_standard_behavior = true,
                    .require_debug_info = false,
                    .require_tracing = false,
                },
            };
        }
        
        pub fn update_performance_metrics(self: *RuntimeContext, metrics: PerformanceMetrics) void {
            const alpha = 0.1; // Exponential moving average factor
            
            self.performance_metrics.instructions_per_second = 
                (1.0 - alpha) * self.performance_metrics.instructions_per_second + 
                alpha * metrics.instructions_per_second;
                
            self.performance_metrics.cache_hit_rate = 
                (1.0 - alpha) * self.performance_metrics.cache_hit_rate + 
                alpha * metrics.cache_hit_rate;
                
            self.performance_metrics.memory_utilization = 
                (1.0 - alpha) * self.performance_metrics.memory_utilization + 
                alpha * metrics.memory_utilization;
                
            self.performance_metrics.average_execution_time = 
                (1.0 - alpha) * self.performance_metrics.average_execution_time + 
                alpha * metrics.average_execution_time;
        }
        
        pub fn evaluate_memory_pressure(self: *RuntimeContext, current_usage: usize) void {
            const usage_ratio = @as(f64, @floatFromInt(current_usage)) / 
                               @as(f64, @floatFromInt(self.size_constraints.max_memory_usage));
            
            if (usage_ratio > 0.9) {
                self.memory_pressure = .Critical;
            } else if (usage_ratio > 0.7) {
                self.memory_pressure = .High;
            } else if (usage_ratio > 0.5) {
                self.memory_pressure = .Medium;
            } else {
                self.memory_pressure = .Low;
            }
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: InterpreterConfig) !InterpreterTypeManager {
        return InterpreterTypeManager{
            .allocator = allocator,
            .config = config,
            .runtime_context = RuntimeContext.init(),
            .component_registry = try ComponentRegistry.init(allocator),
            .performance_profiler = PerformanceProfiler.init(allocator),
            .type_selector = TypeSelector.init(config),
        };
    }
    
    pub fn deinit(self: *InterpreterTypeManager) void {
        self.component_registry.deinit();
        self.performance_profiler.deinit();
    }
    
    pub fn select_interpreter_type(self: *InterpreterTypeManager, execution_context: ExecutionContext) InterpreterInstance {
        if (!self.config.runtime_selection) {
            return self.create_static_interpreter();
        }
        
        const selected_config = self.type_selector.select_optimal_config(
            self.runtime_context,
            execution_context
        );
        
        return self.create_dynamic_interpreter(selected_config);
    }
    
    pub fn update_runtime_context(self: *InterpreterTypeManager, metrics: RuntimeContext.PerformanceMetrics) void {
        self.runtime_context.update_performance_metrics(metrics);
        self.runtime_context.execution_count += 1;
        
        if (self.config.adaptive_switching) {
            self.adapt_configuration();
        }
    }
    
    fn create_static_interpreter(self: *InterpreterTypeManager) InterpreterInstance {
        return switch (self.config.interpreter_type) {
            .Standard => self.component_registry.create_standard_interpreter(),
            .Optimized => self.component_registry.create_optimized_interpreter(),
            .Minimal => self.component_registry.create_minimal_interpreter(),
            .Debug => self.component_registry.create_debug_interpreter(),
            .Tracing => self.component_registry.create_tracing_interpreter(),
            .Fuzzing => self.component_registry.create_fuzzing_interpreter(),
            .Benchmarking => self.component_registry.create_benchmarking_interpreter(),
            .Compatible => self.component_registry.create_compatible_interpreter(),
        };
    }
    
    fn create_dynamic_interpreter(self: *InterpreterTypeManager, config: InterpreterConfig) InterpreterInstance {
        return InterpreterInstance{
            .stack = self.create_stack_component(config.stack_type),
            .memory = self.create_memory_component(config.memory_type),
            .execution_engine = self.create_execution_engine(config.execution_strategy),
            .optimization_level = config.optimization_level,
            .profiling_enabled = config.profiling_enabled,
        };
    }
    
    fn create_stack_component(self: *InterpreterTypeManager, stack_type: InterpreterConfig.StackType) StackComponent {
        return switch (stack_type) {
            .Standard => StandardStack.init(self.allocator),
            .Optimized => OptimizedStack.init(self.allocator),
            .Minimal => MinimalStack.init(self.allocator),
            .Debug => DebugStack.init(self.allocator),
            .Unsafe => UnsafeStack.init(self.allocator),
            .Bounded => BoundedStack.init(self.allocator),
        };
    }
    
    fn create_memory_component(self: *InterpreterTypeManager, memory_type: InterpreterConfig.MemoryType) MemoryComponent {
        return switch (memory_type) {
            .Standard => StandardMemory.init(self.allocator),
            .Optimized => OptimizedMemory.init(self.allocator),
            .Minimal => MinimalMemory.init(self.allocator),
            .Debug => DebugMemory.init(self.allocator),
            .Pooled => PooledMemory.init(self.allocator),
            .CopyOnWrite => CopyOnWriteMemory.init(self.allocator),
        };
    }
    
    fn create_execution_engine(self: *InterpreterTypeManager, strategy: InterpreterConfig.ExecutionStrategy) ExecutionEngine {
        return switch (strategy) {
            .DirectCall => DirectCallEngine.init(self.allocator),
            .JumpTable => JumpTableEngine.init(self.allocator),
            .Computed => ComputedGotoEngine.init(self.allocator),
            .Threaded => ThreadedEngine.init(self.allocator),
            .Bytecode => BytecodeEngine.init(self.allocator),
            .Hybrid => HybridEngine.init(self.allocator),
        };
    }
    
    fn adapt_configuration(self: *InterpreterTypeManager) void {
        const current_performance = self.runtime_context.performance_metrics;
        
        // Adapt based on performance metrics
        if (current_performance.instructions_per_second < 1000000) { // < 1M IPS
            // Switch to performance-optimized configuration
            self.config.interpreter_type = .Optimized;
            self.config.stack_type = .Optimized;
            self.config.memory_type = .Optimized;
            self.config.execution_strategy = .JumpTable;
        } else if (self.runtime_context.memory_pressure == .High or 
                  self.runtime_context.memory_pressure == .Critical) {
            // Switch to memory-optimized configuration
            self.config.interpreter_type = .Minimal;
            self.config.stack_type = .Minimal;
            self.config.memory_type = .Minimal;
            self.config.execution_strategy = .DirectCall;
        }
    }
    
    pub const ExecutionContext = struct {
        contract_size: usize,
        call_depth: u32,
        expected_operations: u64,
        time_constraints: ?u64, // microseconds
        memory_budget: ?usize,
        debug_required: bool,
        tracing_required: bool,
    };
    
    pub const InterpreterInstance = struct {
        stack: StackComponent,
        memory: MemoryComponent,
        execution_engine: ExecutionEngine,
        optimization_level: InterpreterConfig.OptimizationLevel,
        profiling_enabled: bool,
        
        pub fn execute_opcode(self: *InterpreterInstance, opcode: u8, context: *ExecutionContext) !void {
            if (self.profiling_enabled) {
                const start_time = std.time.nanoTimestamp();
                defer {
                    const end_time = std.time.nanoTimestamp();
                    self.record_execution_time(opcode, end_time - start_time);
                }
            }
            
            try self.execution_engine.execute(opcode, &self.stack, &self.memory, context);
        }
        
        fn record_execution_time(self: *InterpreterInstance, opcode: u8, time_ns: i64) void {
            // Record performance metrics for adaptive optimization
            _ = self;
            _ = opcode;
            _ = time_ns;
        }
    };
};
```

#### 2. Component Registry
```zig
pub const ComponentRegistry = struct {
    allocator: std.mem.Allocator,
    stack_factories: std.HashMap(InterpreterConfig.StackType, StackFactory, StackTypeContext, std.hash_map.default_max_load_percentage),
    memory_factories: std.HashMap(InterpreterConfig.MemoryType, MemoryFactory, MemoryTypeContext, std.hash_map.default_max_load_percentage),
    execution_factories: std.HashMap(InterpreterConfig.ExecutionStrategy, ExecutionFactory, ExecutionStrategyContext, std.hash_map.default_max_load_percentage),
    
    pub const StackFactory = struct {
        create_fn: *const fn(std.mem.Allocator) StackComponent,
        performance_profile: PerformanceProfile,
        memory_profile: MemoryProfile,
        size_profile: SizeProfile,
    };
    
    pub const MemoryFactory = struct {
        create_fn: *const fn(std.mem.Allocator) MemoryComponent,
        performance_profile: PerformanceProfile,
        memory_profile: MemoryProfile,
        size_profile: SizeProfile,
    };
    
    pub const ExecutionFactory = struct {
        create_fn: *const fn(std.mem.Allocator) ExecutionEngine,
        performance_profile: PerformanceProfile,
        memory_profile: MemoryProfile,
        size_profile: SizeProfile,
    };
    
    pub const PerformanceProfile = struct {
        throughput_rating: u8,      // 1-10 scale
        latency_rating: u8,         // 1-10 scale
        cache_efficiency: u8,       // 1-10 scale
        optimization_overhead: u8,  // 1-10 scale (lower is better)
    };
    
    pub const MemoryProfile = struct {
        memory_usage: u32,          // Bytes
        allocation_frequency: u8,   // 1-10 scale (lower is better)
        memory_locality: u8,        // 1-10 scale
        fragmentation_risk: u8,     // 1-10 scale (lower is better)
    };
    
    pub const SizeProfile = struct {
        code_size: u32,             // Bytes
        data_size: u32,             // Bytes
        complexity_score: u8,       // 1-10 scale
        maintainability: u8,        // 1-10 scale
    };
    
    pub fn init(allocator: std.mem.Allocator) !ComponentRegistry {
        var registry = ComponentRegistry{
            .allocator = allocator,
            .stack_factories = std.HashMap(InterpreterConfig.StackType, StackFactory, StackTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .memory_factories = std.HashMap(InterpreterConfig.MemoryType, MemoryFactory, MemoryTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .execution_factories = std.HashMap(InterpreterConfig.ExecutionStrategy, ExecutionFactory, ExecutionStrategyContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
        
        try registry.register_default_components();
        return registry;
    }
    
    pub fn deinit(self: *ComponentRegistry) void {
        self.stack_factories.deinit();
        self.memory_factories.deinit();
        self.execution_factories.deinit();
    }
    
    fn register_default_components(self: *ComponentRegistry) !void {
        // Register stack components
        try self.stack_factories.put(.Standard, StackFactory{
            .create_fn = StandardStack.create,
            .performance_profile = PerformanceProfile{ .throughput_rating = 7, .latency_rating = 7, .cache_efficiency = 6, .optimization_overhead = 3 },
            .memory_profile = MemoryProfile{ .memory_usage = 8192, .allocation_frequency = 3, .memory_locality = 7, .fragmentation_risk = 2 },
            .size_profile = SizeProfile{ .code_size = 2048, .data_size = 8192, .complexity_score = 5, .maintainability = 8 },
        });
        
        try self.stack_factories.put(.Optimized, StackFactory{
            .create_fn = OptimizedStack.create,
            .performance_profile = PerformanceProfile{ .throughput_rating = 9, .latency_rating = 9, .cache_efficiency = 9, .optimization_overhead = 6 },
            .memory_profile = MemoryProfile{ .memory_usage = 16384, .allocation_frequency = 2, .memory_locality = 9, .fragmentation_risk = 1 },
            .size_profile = SizeProfile{ .code_size = 4096, .data_size = 16384, .complexity_score = 7, .maintainability = 6 },
        });
        
        try self.stack_factories.put(.Minimal, StackFactory{
            .create_fn = MinimalStack.create,
            .performance_profile = PerformanceProfile{ .throughput_rating = 5, .latency_rating = 5, .cache_efficiency = 4, .optimization_overhead = 1 },
            .memory_profile = MemoryProfile{ .memory_usage = 4096, .allocation_frequency = 4, .memory_locality = 5, .fragmentation_risk = 3 },
            .size_profile = SizeProfile{ .code_size = 1024, .data_size = 4096, .complexity_score = 3, .maintainability = 9 },
        });
        
        try self.stack_factories.put(.Debug, StackFactory{
            .create_fn = DebugStack.create,
            .performance_profile = PerformanceProfile{ .throughput_rating = 4, .latency_rating = 3, .cache_efficiency = 5, .optimization_overhead = 8 },
            .memory_profile = MemoryProfile{ .memory_usage = 32768, .allocation_frequency = 6, .memory_locality = 6, .fragmentation_risk = 4 },
            .size_profile = SizeProfile{ .code_size = 8192, .data_size = 32768, .complexity_score = 9, .maintainability = 10 },
        });
        
        // Register memory components
        try self.memory_factories.put(.Standard, MemoryFactory{
            .create_fn = StandardMemory.create,
            .performance_profile = PerformanceProfile{ .throughput_rating = 7, .latency_rating = 6, .cache_efficiency = 6, .optimization_overhead = 3 },
            .memory_profile = MemoryProfile{ .memory_usage = 65536, .allocation_frequency = 5, .memory_locality = 6, .fragmentation_risk = 4 },
            .size_profile = SizeProfile{ .code_size = 3072, .data_size = 65536, .complexity_score = 5, .maintainability = 8 },
        });
        
        try self.memory_factories.put(.Optimized, MemoryFactory{
            .create_fn = OptimizedMemory.create,
            .performance_profile = PerformanceProfile{ .throughput_rating = 9, .latency_rating = 8, .cache_efficiency = 9, .optimization_overhead = 7 },
            .memory_profile = MemoryProfile{ .memory_usage = 131072, .allocation_frequency = 3, .memory_locality = 9, .fragmentation_risk = 2 },
            .size_profile = SizeProfile{ .code_size = 6144, .data_size = 131072, .complexity_score = 8, .maintainability = 6 },
        });
        
        // Register execution engines
        try self.execution_factories.put(.DirectCall, ExecutionFactory{
            .create_fn = DirectCallEngine.create,
            .performance_profile = PerformanceProfile{ .throughput_rating = 6, .latency_rating = 8, .cache_efficiency = 7, .optimization_overhead = 2 },
            .memory_profile = MemoryProfile{ .memory_usage = 16384, .allocation_frequency = 2, .memory_locality = 8, .fragmentation_risk = 1 },
            .size_profile = SizeProfile{ .code_size = 2048, .data_size = 16384, .complexity_score = 4, .maintainability = 9 },
        });
        
        try self.execution_factories.put(.JumpTable, ExecutionFactory{
            .create_fn = JumpTableEngine.create,
            .performance_profile = PerformanceProfile{ .throughput_rating = 8, .latency_rating = 7, .cache_efficiency = 8, .optimization_overhead = 4 },
            .memory_profile = MemoryProfile{ .memory_usage = 32768, .allocation_frequency = 1, .memory_locality = 9, .fragmentation_risk = 1 },
            .size_profile = SizeProfile{ .code_size = 4096, .data_size = 32768, .complexity_score = 6, .maintainability = 7 },
        });
    }
    
    pub fn get_best_stack_for_context(self: *ComponentRegistry, context: RuntimeContext, requirements: OptimizationRequirements) ?InterpreterConfig.StackType {
        var best_score: f64 = 0;
        var best_type: ?InterpreterConfig.StackType = null;
        
        var iterator = self.stack_factories.iterator();
        while (iterator.next()) |entry| {
            const score = self.calculate_component_score(
                entry.value_ptr.performance_profile,
                entry.value_ptr.memory_profile,
                entry.value_ptr.size_profile,
                context,
                requirements
            );
            
            if (score > best_score) {
                best_score = score;
                best_type = entry.key_ptr.*;
            }
        }
        
        return best_type;
    }
    
    pub fn get_best_memory_for_context(self: *ComponentRegistry, context: RuntimeContext, requirements: OptimizationRequirements) ?InterpreterConfig.MemoryType {
        var best_score: f64 = 0;
        var best_type: ?InterpreterConfig.MemoryType = null;
        
        var iterator = self.memory_factories.iterator();
        while (iterator.next()) |entry| {
            const score = self.calculate_component_score(
                entry.value_ptr.performance_profile,
                entry.value_ptr.memory_profile,
                entry.value_ptr.size_profile,
                context,
                requirements
            );
            
            if (score > best_score) {
                best_score = score;
                best_type = entry.key_ptr.*;
            }
        }
        
        return best_type;
    }
    
    pub fn get_best_execution_for_context(self: *ComponentRegistry, context: RuntimeContext, requirements: OptimizationRequirements) ?InterpreterConfig.ExecutionStrategy {
        var best_score: f64 = 0;
        var best_type: ?InterpreterConfig.ExecutionStrategy = null;
        
        var iterator = self.execution_factories.iterator();
        while (iterator.next()) |entry| {
            const score = self.calculate_component_score(
                entry.value_ptr.performance_profile,
                entry.value_ptr.memory_profile,
                entry.value_ptr.size_profile,
                context,
                requirements
            );
            
            if (score > best_score) {
                best_score = score;
                best_type = entry.key_ptr.*;
            }
        }
        
        return best_type;
    }
    
    fn calculate_component_score(
        self: *ComponentRegistry,
        perf_profile: PerformanceProfile,
        mem_profile: MemoryProfile,
        size_profile: SizeProfile,
        context: RuntimeContext,
        requirements: OptimizationRequirements
    ) f64 {
        _ = self;
        
        var score: f64 = 0;
        
        // Performance scoring
        if (requirements.prioritize_performance) {
            score += @as(f64, @floatFromInt(perf_profile.throughput_rating)) * 0.3;
            score += @as(f64, @floatFromInt(perf_profile.latency_rating)) * 0.2;
            score += @as(f64, @floatFromInt(perf_profile.cache_efficiency)) * 0.2;
            score -= @as(f64, @floatFromInt(perf_profile.optimization_overhead)) * 0.1;
        }
        
        // Memory scoring
        if (requirements.prioritize_memory_efficiency) {
            score -= @as(f64, @floatFromInt(mem_profile.allocation_frequency)) * 0.15;
            score += @as(f64, @floatFromInt(mem_profile.memory_locality)) * 0.15;
            score -= @as(f64, @floatFromInt(mem_profile.fragmentation_risk)) * 0.1;
            
            // Penalize high memory usage under memory pressure
            if (context.memory_pressure == .High or context.memory_pressure == .Critical) {
                const memory_penalty = @as(f64, @floatFromInt(mem_profile.memory_usage)) / 1024.0;
                score -= memory_penalty * 0.2;
            }
        }
        
        // Size scoring
        if (requirements.prioritize_size) {
            const total_size = size_profile.code_size + size_profile.data_size;
            score -= @as(f64, @floatFromInt(total_size)) / 1024.0 * 0.2;
            score -= @as(f64, @floatFromInt(size_profile.complexity_score)) * 0.1;
            score += @as(f64, @floatFromInt(size_profile.maintainability)) * 0.05;
        }
        
        return score;
    }
    
    pub const OptimizationRequirements = struct {
        prioritize_performance: bool,
        prioritize_memory_efficiency: bool,
        prioritize_size: bool,
        require_debugging: bool,
        require_tracing: bool,
        max_memory_usage: ?usize,
        max_code_size: ?usize,
        min_performance_threshold: ?f64,
    };
    
    pub const StackTypeContext = struct {
        pub fn hash(self: @This(), key: InterpreterConfig.StackType) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: InterpreterConfig.StackType, b: InterpreterConfig.StackType) bool {
            _ = self;
            return a == b;
        }
    };
    
    pub const MemoryTypeContext = struct {
        pub fn hash(self: @This(), key: InterpreterConfig.MemoryType) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: InterpreterConfig.MemoryType, b: InterpreterConfig.MemoryType) bool {
            _ = self;
            return a == b;
        }
    };
    
    pub const ExecutionStrategyContext = struct {
        pub fn hash(self: @This(), key: InterpreterConfig.ExecutionStrategy) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: InterpreterConfig.ExecutionStrategy, b: InterpreterConfig.ExecutionStrategy) bool {
            _ = self;
            return a == b;
        }
    };
    
    // Factory creation functions for different components
    pub fn create_standard_interpreter(self: *ComponentRegistry) InterpreterTypeManager.InterpreterInstance {
        return InterpreterTypeManager.InterpreterInstance{
            .stack = StandardStack.create(self.allocator),
            .memory = StandardMemory.create(self.allocator),
            .execution_engine = JumpTableEngine.create(self.allocator),
            .optimization_level = .Balanced,
            .profiling_enabled = false,
        };
    }
    
    pub fn create_optimized_interpreter(self: *ComponentRegistry) InterpreterTypeManager.InterpreterInstance {
        return InterpreterTypeManager.InterpreterInstance{
            .stack = OptimizedStack.create(self.allocator),
            .memory = OptimizedMemory.create(self.allocator),
            .execution_engine = JumpTableEngine.create(self.allocator),
            .optimization_level = .Performance,
            .profiling_enabled = false,
        };
    }
    
    pub fn create_minimal_interpreter(self: *ComponentRegistry) InterpreterTypeManager.InterpreterInstance {
        return InterpreterTypeManager.InterpreterInstance{
            .stack = MinimalStack.create(self.allocator),
            .memory = MinimalMemory.create(self.allocator),
            .execution_engine = DirectCallEngine.create(self.allocator),
            .optimization_level = .Minimal,
            .profiling_enabled = false,
        };
    }
    
    pub fn create_debug_interpreter(self: *ComponentRegistry) InterpreterTypeManager.InterpreterInstance {
        return InterpreterTypeManager.InterpreterInstance{
            .stack = DebugStack.create(self.allocator),
            .memory = DebugMemory.create(self.allocator),
            .execution_engine = DirectCallEngine.create(self.allocator),
            .optimization_level = .Debug,
            .profiling_enabled = true,
        };
    }
    
    pub fn create_tracing_interpreter(self: *ComponentRegistry) InterpreterTypeManager.InterpreterInstance {
        return InterpreterTypeManager.InterpreterInstance{
            .stack = DebugStack.create(self.allocator),
            .memory = DebugMemory.create(self.allocator),
            .execution_engine = TracingEngine.create(self.allocator),
            .optimization_level = .Debug,
            .profiling_enabled = true,
        };
    }
    
    pub fn create_fuzzing_interpreter(self: *ComponentRegistry) InterpreterTypeManager.InterpreterInstance {
        return InterpreterTypeManager.InterpreterInstance{
            .stack = BoundedStack.create(self.allocator),
            .memory = DebugMemory.create(self.allocator),
            .execution_engine = DirectCallEngine.create(self.allocator),
            .optimization_level = .Debug,
            .profiling_enabled = true,
        };
    }
    
    pub fn create_benchmarking_interpreter(self: *ComponentRegistry) InterpreterTypeManager.InterpreterInstance {
        return InterpreterTypeManager.InterpreterInstance{
            .stack = OptimizedStack.create(self.allocator),
            .memory = OptimizedMemory.create(self.allocator),
            .execution_engine = JumpTableEngine.create(self.allocator),
            .optimization_level = .Performance,
            .profiling_enabled = true,
        };
    }
    
    pub fn create_compatible_interpreter(self: *ComponentRegistry) InterpreterTypeManager.InterpreterInstance {
        return InterpreterTypeManager.InterpreterInstance{
            .stack = StandardStack.create(self.allocator),
            .memory = StandardMemory.create(self.allocator),
            .execution_engine = DirectCallEngine.create(self.allocator),
            .optimization_level = .Balanced,
            .profiling_enabled = false,
        };
    }
};
```

#### 3. Type Selector
```zig
pub const TypeSelector = struct {
    base_config: InterpreterTypeManager.InterpreterConfig,
    selection_history: std.ArrayList(SelectionRecord),
    learning_enabled: bool,
    
    pub const SelectionRecord = struct {
        context: InterpreterTypeManager.RuntimeContext,
        selected_config: InterpreterTypeManager.InterpreterConfig,
        performance_result: f64,
        timestamp: i64,
    };
    
    pub fn init(base_config: InterpreterTypeManager.InterpreterConfig) TypeSelector {
        return TypeSelector{
            .base_config = base_config,
            .selection_history = std.ArrayList(SelectionRecord).init(std.heap.page_allocator),
            .learning_enabled = true,
        };
    }
    
    pub fn deinit(self: *TypeSelector) void {
        self.selection_history.deinit();
    }
    
    pub fn select_optimal_config(
        self: *TypeSelector,
        runtime_context: InterpreterTypeManager.RuntimeContext,
        execution_context: InterpreterTypeManager.ExecutionContext
    ) InterpreterTypeManager.InterpreterConfig {
        // Start with base configuration
        var config = self.base_config;
        
        // Apply context-based optimizations
        self.optimize_for_context(&config, runtime_context, execution_context);
        
        // Apply learning-based optimizations
        if (self.learning_enabled) {
            self.apply_learned_optimizations(&config, runtime_context);
        }
        
        return config;
    }
    
    fn optimize_for_context(
        self: *TypeSelector,
        config: *InterpreterTypeManager.InterpreterConfig,
        runtime_context: InterpreterTypeManager.RuntimeContext,
        execution_context: InterpreterTypeManager.ExecutionContext
    ) void {
        _ = self;
        
        // Optimize based on memory pressure
        switch (runtime_context.memory_pressure) {
            .Critical => {
                config.interpreter_type = .Minimal;
                config.stack_type = .Minimal;
                config.memory_type = .Minimal;
                config.execution_strategy = .DirectCall;
                config.optimization_level = .Minimal;
            },
            .High => {
                config.stack_type = .Minimal;
                config.memory_type = .Minimal;
            },
            .Medium => {
                // Use balanced approach
                config.optimization_level = .Balanced;
            },
            .Low => {
                // Can use performance optimizations
                if (runtime_context.performance_metrics.instructions_per_second < 1000000) {
                    config.interpreter_type = .Optimized;
                    config.stack_type = .Optimized;
                    config.memory_type = .Optimized;
                    config.optimization_level = .Performance;
                }
            },
        }
        
        // Optimize based on execution context
        if (execution_context.debug_required) {
            config.interpreter_type = .Debug;
            config.stack_type = .Debug;
            config.memory_type = .Debug;
            config.execution_strategy = .DirectCall;
            config.optimization_level = .Debug;
            config.profiling_enabled = true;
        }
        
        if (execution_context.tracing_required) {
            config.interpreter_type = .Tracing;
            config.profiling_enabled = true;
        }
        
        // Optimize for contract size
        if (execution_context.contract_size < 1024) {
            // Small contracts can use minimal implementations
            config.stack_type = .Minimal;
            config.memory_type = .Minimal;
        } else if (execution_context.contract_size > 24576) { // 24KB
            // Large contracts benefit from optimizations
            config.interpreter_type = .Optimized;
            config.execution_strategy = .JumpTable;
        }
        
        // Optimize for call depth
        if (execution_context.call_depth > 512) {
            // Deep call stacks need minimal overhead
            config.execution_strategy = .DirectCall;
            config.optimization_level = .Minimal;
        }
        
        // Optimize for time constraints
        if (execution_context.time_constraints) |time_limit| {
            if (time_limit < 1000) { // < 1ms
                // Very tight time constraints
                config.interpreter_type = .Optimized;
                config.optimization_level = .Performance;
                config.profiling_enabled = false;
            }
        }
        
        // Optimize for memory budget
        if (execution_context.memory_budget) |budget| {
            if (budget < 64 * 1024) { // < 64KB
                config.memory_type = .Minimal;
                config.stack_type = .Minimal;
            }
        }
    }
    
    fn apply_learned_optimizations(
        self: *TypeSelector,
        config: *InterpreterTypeManager.InterpreterConfig,
        runtime_context: InterpreterTypeManager.RuntimeContext
    ) void {
        if (self.selection_history.items.len < 10) return; // Need more data
        
        // Find similar historical contexts
        var similar_configs = std.ArrayList(SelectionRecord).init(std.heap.page_allocator);
        defer similar_configs.deinit();
        
        for (self.selection_history.items) |record| {
            if (self.contexts_similar(runtime_context, record.context)) {
                similar_configs.append(record) catch continue;
            }
        }
        
        if (similar_configs.items.len == 0) return;
        
        // Find the best performing configuration from similar contexts
        var best_performance: f64 = 0;
        var best_config: ?InterpreterTypeManager.InterpreterConfig = null;
        
        for (similar_configs.items) |record| {
            if (record.performance_result > best_performance) {
                best_performance = record.performance_result;
                best_config = record.selected_config;
            }
        }
        
        // Apply learned configuration if it's significantly better
        if (best_config != null and best_performance > 1.2) { // 20% better threshold
            config.* = best_config.?;
        }
    }
    
    fn contexts_similar(
        self: *TypeSelector,
        context1: InterpreterTypeManager.RuntimeContext,
        context2: InterpreterTypeManager.RuntimeContext
    ) bool {
        _ = self;
        
        // Simple similarity metric based on key characteristics
        const memory_pressure_diff = @abs(@intFromEnum(context1.memory_pressure) - @intFromEnum(context2.memory_pressure));
        if (memory_pressure_diff > 1) return false;
        
        const execution_count_ratio = if (context2.execution_count > 0)
            @as(f64, @floatFromInt(context1.execution_count)) / @as(f64, @floatFromInt(context2.execution_count))
        else
            1.0;
        
        if (execution_count_ratio < 0.5 or execution_count_ratio > 2.0) return false;
        
        // Compare performance metrics
        const perf1 = context1.performance_metrics;
        const perf2 = context2.performance_metrics;
        
        const ips_ratio = if (perf2.instructions_per_second > 0)
            perf1.instructions_per_second / perf2.instructions_per_second
        else
            1.0;
        
        if (ips_ratio < 0.8 or ips_ratio > 1.25) return false;
        
        return true;
    }
    
    pub fn record_selection_result(
        self: *TypeSelector,
        context: InterpreterTypeManager.RuntimeContext,
        config: InterpreterTypeManager.InterpreterConfig,
        performance_result: f64
    ) void {
        const record = SelectionRecord{
            .context = context,
            .selected_config = config,
            .performance_result = performance_result,
            .timestamp = std.time.milliTimestamp(),
        };
        
        self.selection_history.append(record) catch return;
        
        // Keep history bounded
        if (self.selection_history.items.len > 1000) {
            _ = self.selection_history.orderedRemove(0);
        }
    }
};
```

#### 4. Component Interfaces
```zig
// Abstract component interfaces
pub const StackComponent = union(enum) {
    Standard: StandardStack,
    Optimized: OptimizedStack,
    Minimal: MinimalStack,
    Debug: DebugStack,
    Unsafe: UnsafeStack,
    Bounded: BoundedStack,
    
    pub fn push(self: *StackComponent, value: u256) !void {
        switch (self.*) {
            inline else => |*stack| try stack.push(value),
        }
    }
    
    pub fn pop(self: *StackComponent) !u256 {
        return switch (self.*) {
            inline else => |*stack| try stack.pop(),
        };
    }
    
    pub fn peek(self: *StackComponent, index: u32) !u256 {
        return switch (self.*) {
            inline else => |*stack| try stack.peek(index),
        };
    }
    
    pub fn size(self: *const StackComponent) u32 {
        return switch (self.*) {
            inline else => |*stack| stack.size(),
        };
    }
    
    pub fn deinit(self: *StackComponent) void {
        switch (self.*) {
            inline else => |*stack| stack.deinit(),
        }
    }
};

pub const MemoryComponent = union(enum) {
    Standard: StandardMemory,
    Optimized: OptimizedMemory,
    Minimal: MinimalMemory,
    Debug: DebugMemory,
    Pooled: PooledMemory,
    CopyOnWrite: CopyOnWriteMemory,
    
    pub fn read(self: *MemoryComponent, offset: u32, size: u32) []const u8 {
        return switch (self.*) {
            inline else => |*memory| memory.read(offset, size),
        };
    }
    
    pub fn write(self: *MemoryComponent, offset: u32, data: []const u8) !void {
        switch (self.*) {
            inline else => |*memory| try memory.write(offset, data),
        }
    }
    
    pub fn copy(self: *MemoryComponent, dest: u32, src: u32, size: u32) !void {
        switch (self.*) {
            inline else => |*memory| try memory.copy(dest, src, size),
        }
    }
    
    pub fn size(self: *const MemoryComponent) usize {
        return switch (self.*) {
            inline else => |*memory| memory.size(),
        };
    }
    
    pub fn deinit(self: *MemoryComponent) void {
        switch (self.*) {
            inline else => |*memory| memory.deinit(),
        }
    }
};

pub const ExecutionEngine = union(enum) {
    DirectCall: DirectCallEngine,
    JumpTable: JumpTableEngine,
    Computed: ComputedGotoEngine,
    Threaded: ThreadedEngine,
    Bytecode: BytecodeEngine,
    Hybrid: HybridEngine,
    Tracing: TracingEngine,
    
    pub fn execute(
        self: *ExecutionEngine,
        opcode: u8,
        stack: *StackComponent,
        memory: *MemoryComponent,
        context: *InterpreterTypeManager.ExecutionContext
    ) !void {
        switch (self.*) {
            inline else => |*engine| try engine.execute(opcode, stack, memory, context),
        }
    }
    
    pub fn deinit(self: *ExecutionEngine) void {
        switch (self.*) {
            inline else => |*engine| engine.deinit(),
        }
    }
};
```

#### 5. Performance Profiler
```zig
pub const PerformanceProfiler = struct {
    allocator: std.mem.Allocator,
    execution_metrics: std.HashMap(InterpreterTypeManager.InterpreterConfig, ExecutionMetrics, ConfigContext, std.hash_map.default_max_load_percentage),
    component_metrics: ComponentMetrics,
    profiling_enabled: bool,
    
    pub const ExecutionMetrics = struct {
        total_executions: u64,
        total_time_ns: u64,
        average_time_ns: f64,
        min_time_ns: u64,
        max_time_ns: u64,
        memory_usage_samples: std.ArrayList(usize),
        cache_hit_rate: f64,
        instruction_throughput: f64,
        
        pub fn init(allocator: std.mem.Allocator) ExecutionMetrics {
            return ExecutionMetrics{
                .total_executions = 0,
                .total_time_ns = 0,
                .average_time_ns = 0,
                .min_time_ns = std.math.maxInt(u64),
                .max_time_ns = 0,
                .memory_usage_samples = std.ArrayList(usize).init(allocator),
                .cache_hit_rate = 0,
                .instruction_throughput = 0,
            };
        }
        
        pub fn deinit(self: *ExecutionMetrics) void {
            self.memory_usage_samples.deinit();
        }
        
        pub fn record_execution(self: *ExecutionMetrics, time_ns: u64, memory_usage: usize) void {
            self.total_executions += 1;
            self.total_time_ns += time_ns;
            self.average_time_ns = @as(f64, @floatFromInt(self.total_time_ns)) / @as(f64, @floatFromInt(self.total_executions));
            
            if (time_ns < self.min_time_ns) {
                self.min_time_ns = time_ns;
            }
            if (time_ns > self.max_time_ns) {
                self.max_time_ns = time_ns;
            }
            
            self.memory_usage_samples.append(memory_usage) catch {};
            
            // Limit samples to prevent unbounded growth
            if (self.memory_usage_samples.items.len > 1000) {
                _ = self.memory_usage_samples.orderedRemove(0);
            }
        }
        
        pub fn get_average_memory_usage(self: *const ExecutionMetrics) f64 {
            if (self.memory_usage_samples.items.len == 0) return 0;
            
            var total: usize = 0;
            for (self.memory_usage_samples.items) |sample| {
                total += sample;
            }
            
            return @as(f64, @floatFromInt(total)) / @as(f64, @floatFromInt(self.memory_usage_samples.items.len));
        }
        
        pub fn get_performance_score(self: *const ExecutionMetrics) f64 {
            if (self.total_executions == 0) return 0;
            
            // Combine multiple metrics into a single performance score
            var score: f64 = 0;
            
            // Higher throughput is better
            score += self.instruction_throughput / 1000000.0; // Normalize to millions
            
            // Lower average time is better
            score += 1000.0 / (self.average_time_ns / 1000.0); // Convert to microseconds
            
            // Higher cache hit rate is better
            score += self.cache_hit_rate * 10.0;
            
            // Lower memory usage is better (normalized)
            const avg_memory = self.get_average_memory_usage();
            if (avg_memory > 0) {
                score += 10000000.0 / avg_memory; // 10MB baseline
            }
            
            return score;
        }
    };
    
    pub const ComponentMetrics = struct {
        stack_metrics: std.HashMap(InterpreterTypeManager.InterpreterConfig.StackType, ComponentPerformance, StackTypeContext, std.hash_map.default_max_load_percentage),
        memory_metrics: std.HashMap(InterpreterTypeManager.InterpreterConfig.MemoryType, ComponentPerformance, MemoryTypeContext, std.hash_map.default_max_load_percentage),
        execution_metrics: std.HashMap(InterpreterTypeManager.InterpreterConfig.ExecutionStrategy, ComponentPerformance, ExecutionStrategyContext, std.hash_map.default_max_load_percentage),
        
        pub fn init(allocator: std.mem.Allocator) ComponentMetrics {
            return ComponentMetrics{
                .stack_metrics = std.HashMap(InterpreterTypeManager.InterpreterConfig.StackType, ComponentPerformance, StackTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
                .memory_metrics = std.HashMap(InterpreterTypeManager.InterpreterConfig.MemoryType, ComponentPerformance, MemoryTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
                .execution_metrics = std.HashMap(InterpreterTypeManager.InterpreterConfig.ExecutionStrategy, ComponentPerformance, ExecutionStrategyContext, std.hash_map.default_max_load_percentage).init(allocator),
            };
        }
        
        pub fn deinit(self: *ComponentMetrics) void {
            self.stack_metrics.deinit();
            self.memory_metrics.deinit();
            self.execution_metrics.deinit();
        }
    };
    
    pub const ComponentPerformance = struct {
        operation_count: u64,
        total_time_ns: u64,
        average_latency_ns: f64,
        cache_misses: u64,
        memory_allocations: u64,
        
        pub fn init() ComponentPerformance {
            return std.mem.zeroes(ComponentPerformance);
        }
        
        pub fn record_operation(self: *ComponentPerformance, time_ns: u64) void {
            self.operation_count += 1;
            self.total_time_ns += time_ns;
            self.average_latency_ns = @as(f64, @floatFromInt(self.total_time_ns)) / @as(f64, @floatFromInt(self.operation_count));
        }
    };
    
    pub fn init(allocator: std.mem.Allocator) PerformanceProfiler {
        return PerformanceProfiler{
            .allocator = allocator,
            .execution_metrics = std.HashMap(InterpreterTypeManager.InterpreterConfig, ExecutionMetrics, ConfigContext, std.hash_map.default_max_load_percentage).init(allocator),
            .component_metrics = ComponentMetrics.init(allocator),
            .profiling_enabled = true,
        };
    }
    
    pub fn deinit(self: *PerformanceProfiler) void {
        var iterator = self.execution_metrics.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.deinit();
        }
        self.execution_metrics.deinit();
        self.component_metrics.deinit();
    }
    
    pub fn record_execution(
        self: *PerformanceProfiler,
        config: InterpreterTypeManager.InterpreterConfig,
        execution_time_ns: u64,
        memory_usage: usize
    ) void {
        if (!self.profiling_enabled) return;
        
        var metrics = self.execution_metrics.getPtr(config) orelse blk: {
            const new_metrics = ExecutionMetrics.init(self.allocator);
            self.execution_metrics.put(config, new_metrics) catch return;
            break :blk self.execution_metrics.getPtr(config).?;
        };
        
        metrics.record_execution(execution_time_ns, memory_usage);
    }
    
    pub fn get_best_config_for_context(self: *PerformanceProfiler, context: InterpreterTypeManager.RuntimeContext) ?InterpreterTypeManager.InterpreterConfig {
        _ = context;
        
        var best_score: f64 = 0;
        var best_config: ?InterpreterTypeManager.InterpreterConfig = null;
        
        var iterator = self.execution_metrics.iterator();
        while (iterator.next()) |entry| {
            const score = entry.value_ptr.get_performance_score();
            if (score > best_score) {
                best_score = score;
                best_config = entry.key_ptr.*;
            }
        }
        
        return best_config;
    }
    
    pub fn print_performance_summary(self: *PerformanceProfiler) void {
        std.log.info("=== INTERPRETER PERFORMANCE SUMMARY ===");
        
        var iterator = self.execution_metrics.iterator();
        while (iterator.next()) |entry| {
            const config = entry.key_ptr.*;
            const metrics = entry.value_ptr;
            
            std.log.info("Config: Interpreter={}, Stack={}, Memory={}, Execution={}", .{
                config.interpreter_type,
                config.stack_type,
                config.memory_type,
                config.execution_strategy,
            });
            std.log.info("  Executions: {}", .{metrics.total_executions});
            std.log.info("  Average time: {d:.2}ns", .{metrics.average_time_ns});
            std.log.info("  Min/Max time: {}ns / {}ns", .{ metrics.min_time_ns, metrics.max_time_ns });
            std.log.info("  Average memory: {d:.2} bytes", .{metrics.get_average_memory_usage()});
            std.log.info("  Performance score: {d:.2}", .{metrics.get_performance_score()});
            std.log.info("");
        }
    }
    
    pub const ConfigContext = struct {
        pub fn hash(self: @This(), key: InterpreterTypeManager.InterpreterConfig) u64 {
            _ = self;
            
            var hasher = std.hash_map.DefaultHasher.init();
            hasher.update(std.mem.asBytes(&key.interpreter_type));
            hasher.update(std.mem.asBytes(&key.stack_type));
            hasher.update(std.mem.asBytes(&key.memory_type));
            hasher.update(std.mem.asBytes(&key.execution_strategy));
            hasher.update(std.mem.asBytes(&key.optimization_level));
            
            return hasher.final();
        }
        
        pub fn eql(self: @This(), a: InterpreterTypeManager.InterpreterConfig, b: InterpreterTypeManager.InterpreterConfig) bool {
            _ = self;
            
            return a.interpreter_type == b.interpreter_type and
                   a.stack_type == b.stack_type and
                   a.memory_type == b.memory_type and
                   a.execution_strategy == b.execution_strategy and
                   a.optimization_level == b.optimization_level;
        }
    };
    
    pub const StackTypeContext = ComponentRegistry.StackTypeContext;
    pub const MemoryTypeContext = ComponentRegistry.MemoryTypeContext;
    pub const ExecutionStrategyContext = ComponentRegistry.ExecutionStrategyContext;
};
```

## Implementation Requirements

### Core Functionality
1. **Configurable Interpreter Components**: Mix and match stack, memory, and execution strategies
2. **Runtime Type Selection**: Choose optimal interpreter configuration based on context
3. **Performance Profiling**: Track and compare performance across different configurations
4. **Adaptive Optimization**: Learn from execution patterns and adapt configurations
5. **Component Registry**: Centralized management of available interpreter components
6. **Type Safety**: Ensure all component combinations are valid and type-safe

## Implementation Tasks

### Task 1: Implement Component Implementations
File: `/src/evm/interpreter_types/component_implementations.zig`
```zig
const std = @import("std");
const U256 = @import("../../Types/U256.ts").U256;

// Standard Stack Implementation
pub const StandardStack = struct {
    data: [1024]U256,
    size: u32,
    allocator: std.mem.Allocator,
    
    pub fn create(allocator: std.mem.Allocator) StackComponent {
        return StackComponent{ .Standard = StandardStack.init(allocator) };
    }
    
    pub fn init(allocator: std.mem.Allocator) StandardStack {
        return StandardStack{
            .data = std.mem.zeroes([1024]U256),
            .size = 0,
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *StandardStack) void {
        _ = self;
        // No cleanup needed for standard stack
    }
    
    pub fn push(self: *StandardStack, value: U256) !void {
        if (self.size >= 1024) {
            return error.StackOverflow;
        }
        self.data[self.size] = value;
        self.size += 1;
    }
    
    pub fn pop(self: *StandardStack) !U256 {
        if (self.size == 0) {
            return error.StackUnderflow;
        }
        self.size -= 1;
        return self.data[self.size];
    }
    
    pub fn peek(self: *StandardStack, index: u32) !U256 {
        if (index >= self.size) {
            return error.StackUnderflow;
        }
        return self.data[self.size - 1 - index];
    }
    
    pub fn size(self: *const StandardStack) u32 {
        return self.size;
    }
};

// Optimized Stack Implementation
pub const OptimizedStack = struct {
    data: [1024]U256 align(64), // Cache-line aligned
    size: u32,
    allocator: std.mem.Allocator,
    prefetch_enabled: bool,
    
    pub fn create(allocator: std.mem.Allocator) StackComponent {
        return StackComponent{ .Optimized = OptimizedStack.init(allocator) };
    }
    
    pub fn init(allocator: std.mem.Allocator) OptimizedStack {
        return OptimizedStack{
            .data = std.mem.zeroes([1024]U256),
            .size = 0,
            .allocator = allocator,
            .prefetch_enabled = true,
        };
    }
    
    pub fn deinit(self: *OptimizedStack) void {
        _ = self;
        // No cleanup needed
    }
    
    pub fn push(self: *OptimizedStack, value: U256) !void {
        if (self.size >= 1024) {
            return error.StackOverflow;
        }
        
        self.data[self.size] = value;
        self.size += 1;
        
        // Prefetch next cache line for potential future access
        if (self.prefetch_enabled and self.size < 1020) {
            const next_addr = @intFromPtr(&self.data[self.size + 4]);
            _ = next_addr; // Would use platform-specific prefetch
        }
    }
    
    pub fn pop(self: *OptimizedStack) !U256 {
        if (self.size == 0) {
            return error.StackUnderflow;
        }
        self.size -= 1;
        return self.data[self.size];
    }
    
    pub fn peek(self: *OptimizedStack, index: u32) !U256 {
        if (index >= self.size) {
            return error.StackUnderflow;
        }
        return self.data[self.size - 1 - index];
    }
    
    pub fn size(self: *const OptimizedStack) u32 {
        return self.size;
    }
    
    // Optimized batch operations
    pub fn pop2_push1(self: *OptimizedStack, result: U256) !void {
        if (self.size < 2) {
            return error.StackUnderflow;
        }
        self.size -= 1; // Remove two, add one = net -1
        self.data[self.size - 1] = result;
    }
    
    pub fn swap(self: *OptimizedStack, depth: u32) !void {
        if (depth >= self.size) {
            return error.StackUnderflow;
        }
        
        const top_index = self.size - 1;
        const swap_index = self.size - 1 - depth;
        
        const temp = self.data[top_index];
        self.data[top_index] = self.data[swap_index];
        self.data[swap_index] = temp;
    }
};

// Minimal Stack Implementation
pub const MinimalStack = struct {
    data: std.ArrayList(U256),
    allocator: std.mem.Allocator,
    
    pub fn create(allocator: std.mem.Allocator) StackComponent {
        return StackComponent{ .Minimal = MinimalStack.init(allocator) };
    }
    
    pub fn init(allocator: std.mem.Allocator) MinimalStack {
        return MinimalStack{
            .data = std.ArrayList(U256).init(allocator),
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *MinimalStack) void {
        self.data.deinit();
    }
    
    pub fn push(self: *MinimalStack, value: U256) !void {
        if (self.data.items.len >= 1024) {
            return error.StackOverflow;
        }
        try self.data.append(value);
    }
    
    pub fn pop(self: *MinimalStack) !U256 {
        if (self.data.items.len == 0) {
            return error.StackUnderflow;
        }
        return self.data.pop();
    }
    
    pub fn peek(self: *MinimalStack, index: u32) !U256 {
        if (index >= self.data.items.len) {
            return error.StackUnderflow;
        }
        return self.data.items[self.data.items.len - 1 - index];
    }
    
    pub fn size(self: *const MinimalStack) u32 {
        return @intCast(self.data.items.len);
    }
};

// Debug Stack Implementation
pub const DebugStack = struct {
    data: [1024]U256,
    size: u32,
    allocator: std.mem.Allocator,
    operation_log: std.ArrayList(StackOperation),
    validation_enabled: bool,
    
    pub const StackOperation = struct {
        operation_type: OperationType,
        value: ?U256,
        index: ?u32,
        timestamp: i64,
        
        pub const OperationType = enum {
            Push,
            Pop,
            Peek,
            Swap,
            Dup,
        };
    };
    
    pub fn create(allocator: std.mem.Allocator) StackComponent {
        return StackComponent{ .Debug = DebugStack.init(allocator) };
    }
    
    pub fn init(allocator: std.mem.Allocator) DebugStack {
        return DebugStack{
            .data = std.mem.zeroes([1024]U256),
            .size = 0,
            .allocator = allocator,
            .operation_log = std.ArrayList(StackOperation).init(allocator),
            .validation_enabled = true,
        };
    }
    
    pub fn deinit(self: *DebugStack) void {
        self.operation_log.deinit();
    }
    
    pub fn push(self: *DebugStack, value: U256) !void {
        if (self.validation_enabled) {
            if (self.size >= 1024) {
                std.log.err("Stack overflow: attempted to push to full stack (size={})", .{self.size});
                return error.StackOverflow;
            }
        }
        
        self.data[self.size] = value;
        self.size += 1;
        
        // Log operation
        self.log_operation(.Push, value, null) catch {};
        
        std.log.debug("Stack push: value={}, new_size={}", .{ value, self.size });
    }
    
    pub fn pop(self: *DebugStack) !U256 {
        if (self.validation_enabled) {
            if (self.size == 0) {
                std.log.err("Stack underflow: attempted to pop from empty stack");
                return error.StackUnderflow;
            }
        }
        
        self.size -= 1;
        const value = self.data[self.size];
        
        // Log operation
        self.log_operation(.Pop, value, null) catch {};
        
        std.log.debug("Stack pop: value={}, new_size={}", .{ value, self.size });
        return value;
    }
    
    pub fn peek(self: *DebugStack, index: u32) !U256 {
        if (self.validation_enabled) {
            if (index >= self.size) {
                std.log.err("Stack underflow: attempted to peek index {} with size {}", .{ index, self.size });
                return error.StackUnderflow;
            }
        }
        
        const value = self.data[self.size - 1 - index];
        
        // Log operation
        self.log_operation(.Peek, value, index) catch {};
        
        std.log.debug("Stack peek: index={}, value={}", .{ index, value });
        return value;
    }
    
    pub fn size(self: *const DebugStack) u32 {
        return self.size;
    }
    
    fn log_operation(self: *DebugStack, op_type: StackOperation.OperationType, value: ?U256, index: ?u32) !void {
        const operation = StackOperation{
            .operation_type = op_type,
            .value = value,
            .index = index,
            .timestamp = std.time.milliTimestamp(),
        };
        
        try self.operation_log.append(operation);
        
        // Limit log size
        if (self.operation_log.items.len > 10000) {
            _ = self.operation_log.orderedRemove(0);
        }
    }
    
    pub fn print_operation_log(self: *const DebugStack) void {
        std.log.info("=== STACK OPERATION LOG ===");
        for (self.operation_log.items) |op| {
            switch (op.operation_type) {
                .Push => std.log.info("PUSH: value={}, time={}", .{ op.value.?, op.timestamp }),
                .Pop => std.log.info("POP: value={}, time={}", .{ op.value.?, op.timestamp }),
                .Peek => std.log.info("PEEK: index={}, value={}, time={}", .{ op.index.?, op.value.?, op.timestamp }),
                .Swap => std.log.info("SWAP: index={}, time={}", .{ op.index.?, op.timestamp }),
                .Dup => std.log.info("DUP: index={}, time={}", .{ op.index.?, op.timestamp }),
            }
        }
    }
};

// Additional component implementations would follow similar patterns...
// UnsafeStack, BoundedStack, StandardMemory, OptimizedMemory, etc.
```

### Task 2: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const InterpreterTypeManager = @import("interpreter_types/interpreter_type_manager.zig").InterpreterTypeManager;

pub const Vm = struct {
    // Existing fields...
    interpreter_manager: ?InterpreterTypeManager,
    current_interpreter: ?InterpreterTypeManager.InterpreterInstance,
    interpreter_enabled: bool,
    
    pub fn enable_interpreter_types(self: *Vm, config: InterpreterTypeManager.InterpreterConfig) !void {
        self.interpreter_manager = try InterpreterTypeManager.init(self.allocator, config);
        self.interpreter_enabled = true;
    }
    
    pub fn disable_interpreter_types(self: *Vm) void {
        if (self.interpreter_manager) |*manager| {
            manager.deinit();
            self.interpreter_manager = null;
        }
        if (self.current_interpreter) |*interpreter| {
            interpreter.stack.deinit();
            interpreter.memory.deinit();
            interpreter.execution_engine.deinit();
            self.current_interpreter = null;
        }
        self.interpreter_enabled = false;
    }
    
    pub fn select_interpreter_for_execution(self: *Vm, contract_size: usize, call_depth: u32) !void {
        if (!self.interpreter_enabled or self.interpreter_manager == null) return;
        
        const execution_context = InterpreterTypeManager.ExecutionContext{
            .contract_size = contract_size,
            .call_depth = call_depth,
            .expected_operations = 1000, // Estimate
            .time_constraints = null,
            .memory_budget = null,
            .debug_required = false,
            .tracing_required = false,
        };
        
        // Clean up previous interpreter if any
        if (self.current_interpreter) |*interpreter| {
            interpreter.stack.deinit();
            interpreter.memory.deinit();
            interpreter.execution_engine.deinit();
        }
        
        // Select optimal interpreter for this execution
        self.current_interpreter = self.interpreter_manager.?.select_interpreter_type(execution_context);
    }
    
    pub fn execute_with_interpreter_types(self: *Vm, opcode: u8) !void {
        if (self.current_interpreter) |*interpreter| {
            const execution_context = InterpreterTypeManager.ExecutionContext{
                .contract_size = self.context.contract.code.len,
                .call_depth = self.call_depth,
                .expected_operations = 1,
                .time_constraints = null,
                .memory_budget = null,
                .debug_required = false,
                .tracing_required = false,
            };
            
            const start_time = std.time.nanoTimestamp();
            try interpreter.execute_opcode(opcode, &execution_context);
            const end_time = std.time.nanoTimestamp();
            
            // Update performance metrics
            if (self.interpreter_manager) |*manager| {
                const metrics = InterpreterTypeManager.RuntimeContext.PerformanceMetrics{
                    .instructions_per_second = 1000000000.0 / @as(f64, @floatFromInt(end_time - start_time)),
                    .cache_hit_rate = 0.8, // Would measure actual cache performance
                    .memory_utilization = @as(f64, @floatFromInt(interpreter.memory.size())) / (1024.0 * 1024.0),
                    .average_execution_time = @as(f64, @floatFromInt(end_time - start_time)),
                    .hot_path_frequency = 0.5,
                };
                
                manager.update_runtime_context(metrics);
            }
        } else {
            // Fall back to standard execution
            try self.execute_standard(opcode);
        }
    }
    
    pub fn get_interpreter_performance_stats(self: *Vm) ?InterpreterTypeManager.RuntimeContext.PerformanceMetrics {
        if (self.interpreter_manager) |*manager| {
            return manager.runtime_context.performance_metrics;
        }
        return null;
    }
};
```

### Task 3: Component Factory System
File: `/src/evm/interpreter_types/component_factory.zig`
```zig
const std = @import("std");
const InterpreterTypeManager = @import("interpreter_type_manager.zig").InterpreterTypeManager;
const ComponentImplementations = @import("component_implementations.zig");

pub const ComponentFactory = struct {
    allocator: std.mem.Allocator,
    creation_stats: CreationStats,
    
    pub const CreationStats = struct {
        total_creations: u64,
        stack_creations: std.HashMap(InterpreterTypeManager.InterpreterConfig.StackType, u64, StackTypeContext, std.hash_map.default_max_load_percentage),
        memory_creations: std.HashMap(InterpreterTypeManager.InterpreterConfig.MemoryType, u64, MemoryTypeContext, std.hash_map.default_max_load_percentage),
        execution_creations: std.HashMap(InterpreterTypeManager.InterpreterConfig.ExecutionStrategy, u64, ExecutionStrategyContext, std.hash_map.default_max_load_percentage),
        
        pub fn init(allocator: std.mem.Allocator) CreationStats {
            return CreationStats{
                .total_creations = 0,
                .stack_creations = std.HashMap(InterpreterTypeManager.InterpreterConfig.StackType, u64, StackTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
                .memory_creations = std.HashMap(InterpreterTypeManager.InterpreterConfig.MemoryType, u64, MemoryTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
                .execution_creations = std.HashMap(InterpreterTypeManager.InterpreterConfig.ExecutionStrategy, u64, ExecutionStrategyContext, std.hash_map.default_max_load_percentage).init(allocator),
            };
        }
        
        pub fn deinit(self: *CreationStats) void {
            self.stack_creations.deinit();
            self.memory_creations.deinit();
            self.execution_creations.deinit();
        }
        
        pub fn record_creation(self: *CreationStats, config: InterpreterTypeManager.InterpreterConfig) void {
            self.total_creations += 1;
            
            // Update stack creation stats
            const stack_count = self.stack_creations.get(config.stack_type) orelse 0;
            self.stack_creations.put(config.stack_type, stack_count + 1) catch {};
            
            // Update memory creation stats
            const memory_count = self.memory_creations.get(config.memory_type) orelse 0;
            self.memory_creations.put(config.memory_type, memory_count + 1) catch {};
            
            // Update execution creation stats
            const execution_count = self.execution_creations.get(config.execution_strategy) orelse 0;
            self.execution_creations.put(config.execution_strategy, execution_count + 1) catch {};
        }
        
        pub fn print_stats(self: *const CreationStats) void {
            std.log.info("=== COMPONENT CREATION STATISTICS ===");
            std.log.info("Total creations: {}", .{self.total_creations});
            
            std.log.info("Stack type usage:");
            var stack_iter = self.stack_creations.iterator();
            while (stack_iter.next()) |entry| {
                const percentage = @as(f64, @floatFromInt(entry.value_ptr.*)) / @as(f64, @floatFromInt(self.total_creations)) * 100.0;
                std.log.info("  {}: {} ({d:.1}%)", .{ entry.key_ptr.*, entry.value_ptr.*, percentage });
            }
            
            std.log.info("Memory type usage:");
            var memory_iter = self.memory_creations.iterator();
            while (memory_iter.next()) |entry| {
                const percentage = @as(f64, @floatFromInt(entry.value_ptr.*)) / @as(f64, @floatFromInt(self.total_creations)) * 100.0;
                std.log.info("  {}: {} ({d:.1}%)", .{ entry.key_ptr.*, entry.value_ptr.*, percentage });
            }
            
            std.log.info("Execution strategy usage:");
            var exec_iter = self.execution_creations.iterator();
            while (exec_iter.next()) |entry| {
                const percentage = @as(f64, @floatFromInt(entry.value_ptr.*)) / @as(f64, @floatFromInt(self.total_creations)) * 100.0;
                std.log.info("  {}: {} ({d:.1}%)", .{ entry.key_ptr.*, entry.value_ptr.*, percentage });
            }
        }
    };
    
    pub fn init(allocator: std.mem.Allocator) ComponentFactory {
        return ComponentFactory{
            .allocator = allocator,
            .creation_stats = CreationStats.init(allocator),
        };
    }
    
    pub fn deinit(self: *ComponentFactory) void {
        self.creation_stats.deinit();
    }
    
    pub fn create_interpreter_instance(self: *ComponentFactory, config: InterpreterTypeManager.InterpreterConfig) InterpreterTypeManager.InterpreterInstance {
        // Record creation statistics
        self.creation_stats.record_creation(config);
        
        return InterpreterTypeManager.InterpreterInstance{
            .stack = self.create_stack_component(config.stack_type),
            .memory = self.create_memory_component(config.memory_type),
            .execution_engine = self.create_execution_engine(config.execution_strategy),
            .optimization_level = config.optimization_level,
            .profiling_enabled = config.profiling_enabled,
        };
    }
    
    fn create_stack_component(self: *ComponentFactory, stack_type: InterpreterTypeManager.InterpreterConfig.StackType) ComponentImplementations.StackComponent {
        return switch (stack_type) {
            .Standard => ComponentImplementations.StandardStack.create(self.allocator),
            .Optimized => ComponentImplementations.OptimizedStack.create(self.allocator),
            .Minimal => ComponentImplementations.MinimalStack.create(self.allocator),
            .Debug => ComponentImplementations.DebugStack.create(self.allocator),
            .Unsafe => ComponentImplementations.UnsafeStack.create(self.allocator),
            .Bounded => ComponentImplementations.BoundedStack.create(self.allocator),
        };
    }
    
    fn create_memory_component(self: *ComponentFactory, memory_type: InterpreterTypeManager.InterpreterConfig.MemoryType) ComponentImplementations.MemoryComponent {
        return switch (memory_type) {
            .Standard => ComponentImplementations.StandardMemory.create(self.allocator),
            .Optimized => ComponentImplementations.OptimizedMemory.create(self.allocator),
            .Minimal => ComponentImplementations.MinimalMemory.create(self.allocator),
            .Debug => ComponentImplementations.DebugMemory.create(self.allocator),
            .Pooled => ComponentImplementations.PooledMemory.create(self.allocator),
            .CopyOnWrite => ComponentImplementations.CopyOnWriteMemory.create(self.allocator),
        };
    }
    
    fn create_execution_engine(self: *ComponentFactory, strategy: InterpreterTypeManager.InterpreterConfig.ExecutionStrategy) ComponentImplementations.ExecutionEngine {
        return switch (strategy) {
            .DirectCall => ComponentImplementations.DirectCallEngine.create(self.allocator),
            .JumpTable => ComponentImplementations.JumpTableEngine.create(self.allocator),
            .Computed => ComponentImplementations.ComputedGotoEngine.create(self.allocator),
            .Threaded => ComponentImplementations.ThreadedEngine.create(self.allocator),
            .Bytecode => ComponentImplementations.BytecodeEngine.create(self.allocator),
            .Hybrid => ComponentImplementations.HybridEngine.create(self.allocator),
        };
    }
    
    pub const StackTypeContext = ComponentImplementations.ComponentRegistry.StackTypeContext;
    pub const MemoryTypeContext = ComponentImplementations.ComponentRegistry.MemoryTypeContext;
    pub const ExecutionStrategyContext = ComponentImplementations.ComponentRegistry.ExecutionStrategyContext;
};
```

## Testing Requirements

### Test File
Create `/test/evm/interpreter_types/interpreter_types_test.zig`

### Test Cases
```zig
test "interpreter type manager initialization" {
    // Test manager creation with different configs
    // Test component registry initialization
    // Test performance profiler setup
}

test "runtime type selection" {
    // Test optimal configuration selection
    // Test context-based optimization
    // Test adaptive configuration changes
}

test "component factory functionality" {
    // Test component creation
    // Test component combinations
    // Test creation statistics
}

test "performance profiling and learning" {
    // Test execution metrics recording
    // Test performance comparison
    // Test learned optimization application
}

test "type selector optimization" {
    // Test context similarity detection
    // Test learned configuration selection
    // Test performance-based adaptation
}

test "integration with VM execution" {
    // Test VM integration
    // Test execution with different interpreter types
    // Test performance impact measurement
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/interpreter_types/interpreter_type_manager.zig` - Main interpreter types framework
- `/src/evm/interpreter_types/component_registry.zig` - Component management and selection
- `/src/evm/interpreter_types/type_selector.zig` - Intelligent type selection logic
- `/src/evm/interpreter_types/component_implementations.zig` - Concrete component implementations
- `/src/evm/interpreter_types/component_factory.zig` - Component creation and management
- `/src/evm/interpreter_types/performance_profiler.zig` - Performance monitoring and profiling
- `/src/evm/vm.zig` - VM integration with interpreter types system
- `/test/evm/interpreter_types/interpreter_types_test.zig` - Comprehensive tests

## Success Criteria

1. **Flexible Configuration**: Support multiple interpreter configurations optimized for different use cases
2. **Runtime Optimization**: Intelligent selection of optimal interpreter components based on execution context
3. **Performance Improvement**: Measurable performance gains through specialized interpreter configurations
4. **Adaptive Learning**: Dynamic improvement of configuration selection based on execution history
5. **Minimal Overhead**: <2% overhead for interpreter type management in performance-critical paths
6. **Type Safety**: All component combinations are validated and type-safe at compile time

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

#### 1. **Unit Tests** (`/test/evm/interpreter/interpreter_types_system_test.zig`)
```zig
// Test basic interpreter_types_system functionality
test "interpreter_types_system basic functionality works correctly"
test "interpreter_types_system handles edge cases properly"
test "interpreter_types_system validates inputs appropriately"
test "interpreter_types_system produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "interpreter_types_system integrates with EVM properly"
test "interpreter_types_system maintains system compatibility"
test "interpreter_types_system works with existing components"
test "interpreter_types_system handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "interpreter_types_system meets performance requirements"
test "interpreter_types_system optimizes resource usage"
test "interpreter_types_system scales appropriately with load"
test "interpreter_types_system benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "interpreter_types_system meets specification requirements"
test "interpreter_types_system maintains EVM compatibility"
test "interpreter_types_system handles hardfork transitions"
test "interpreter_types_system cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "interpreter_types_system handles errors gracefully"
test "interpreter_types_system proper error propagation"
test "interpreter_types_system recovery from failure states"
test "interpreter_types_system validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "interpreter_types_system prevents security vulnerabilities"
test "interpreter_types_system handles malicious inputs safely"
test "interpreter_types_system maintains isolation boundaries"
test "interpreter_types_system validates security properties"
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
test "interpreter_types_system basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = interpreter_types_system.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const interpreter_types_system = struct {
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

- [Interpreter Design Patterns](https://en.wikipedia.org/wiki/Interpreter_pattern) - Software design patterns for interpreters
- [Virtual Machine Design](https://en.wikipedia.org/wiki/Virtual_machine) - Virtual machine architecture principles
- [Performance Optimization](https://en.wikipedia.org/wiki/Program_optimization) - Code optimization techniques
- [Component-Based Architecture](https://en.wikipedia.org/wiki/Component-based_software_engineering) - Modular software design
- [Adaptive Systems](https://en.wikipedia.org/wiki/Adaptive_system) - Self-optimizing system design

## EVMONE Context

An interpreter types system, as described, allows for different execution strategies and components to be swapped based on context. `evmone` is a high-performance EVM implementation that features two primary execution "modes" or "interpreters": a `baseline` interpreter and a more complex `advanced` interpreter. This provides excellent real-world context for implementing such a system.

-   **Interpreter Switching**: `evmone`'s `VM` class uses a function pointer (`execute`) that can be changed at startup to point to either the `baseline` or `advanced` execution engine. This demonstrates a simple but effective way to switch between different interpreter types.
-   **Execution Strategies**: The `baseline` interpreter uses a direct dispatch loop (either a `switch` or `computed-goto`), which is analogous to the prompt's `DirectCall` or `JumpTable` strategies. The `advanced` interpreter performs a detailed analysis of the bytecode to create basic blocks, which represents a more optimized execution strategy.
-   **Code Analysis**: The core difference between `evmone`'s interpreters lies in their analysis. `baseline::analyze` performs a simple `JUMPDEST` analysis. `advanced::analyze` does a much deeper analysis, breaking the code into basic blocks and pre-calculating gas costs and stack requirements, which is a great reference for an "Optimized" interpreter type.
-   **Stack & Memory**: The `ExecutionState` contains `StackSpace` and `Memory` classes, which are concrete, performance-oriented examples of the stack and memory components requested in the prompt.
-   **Opcode Metadata**: `instructions_traits.hpp` provides a comprehensive, static table of properties for every opcode (gas cost, stack effects), similar to the prompt's `ComponentRegistry` concept.
-   **Profiling**: The `Tracer` interface in `evmone` is a direct parallel to the `PerformanceProfiler` requirement, showing how to hook into the execution loop to gather metrics.

The following snippets from `evmone` illustrate these concepts, providing a battle-tested architectural reference for implementing the requested Interpreter Types System.

<evmone>
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

#if defined(_MSC_VER) && !defined(__clang__)
#define EVMONE_CGOTO_SUPPORTED 0
#else
#define EVMONE_CGOTO_SUPPORTED 1
#endif

namespace evmone
{
/// The evmone EVMC instance.
///
/// This class is the C++ implementation of the evmc_vm interface.
/// It is primarily responsible for managing the cost table for a given EVM revision
/// and managing execution states.
/// It contains a function pointer `execute` which can point to different interpreter
/// implementations (e.g., baseline or advanced). This is a simple mechanism
/// for selecting an "interpreter type".
class VM : public evmc_vm
{
public:
    /// The option to select the computed goto-based dispatch for the baseline interpreter.
    /// This is an example of an "execution strategy" optimization.
    bool cgoto = EVMONE_CGOTO_SUPPORTED;

    /// The option to enable EOF validation.
    bool validate_eof = false;

private:
    /// The pool of execution states. The depth of EVM execution calls determines
    /// which state from the pool is going to be used.
    std::vector<ExecutionState> m_execution_states;

    /// The head of the tracers linked list.
    std::unique_ptr<Tracer> m_first_tracer;

public:
    VM() noexcept;

    [[nodiscard]] ExecutionState& get_execution_state(size_t depth) noexcept;

    /// Adds a tracer to the VM.
    /// This is relevant to the prompt's `PerformanceProfiler` concept,
    /// allowing observation and metric gathering during execution.
    void add_tracer(std::unique_ptr<Tracer> tracer) noexcept
    {
        // Find the first empty unique_ptr and assign the new tracer to it.
        auto* end = &m_first_tracer;
        while (*end)
            end = &(*end)->m_next_tracer;
        *end = std::move(tracer);
    }
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
#include "advanced_execution.hpp"
#include "baseline.hpp"
#include <evmone/evmone.h>

namespace evmone
{
namespace
{
// ... (destroy and get_capabilities functions)

/// This function handles setting options on the VM, including selecting the
/// interpreter ("advanced" vs "baseline") and execution strategy ("cgoto").
/// This is analogous to the prompt's `InterpreterTypeManager` configuring
/// the interpreter based on a provided configuration.
evmc_set_option_result set_option(evmc_vm* c_vm, char const* c_name, char const* c_value) noexcept
{
    const auto name = (c_name != nullptr) ? std::string_view{c_name} : std::string_view{};
    const auto value = (c_value != nullptr) ? std::string_view{c_value} : std::string_view{};
    auto& vm = *static_cast<VM*>(c_vm);

    if (name == "advanced")
    {
        // Switches the main `execute` function pointer to the advanced interpreter.
        c_vm->execute = evmone::advanced::execute;
        return EVMC_SET_OPTION_SUCCESS;
    }
    else if (name == "cgoto")
    {
#if EVMONE_CGOTO_SUPPORTED
        // Selects the computed-goto dispatch method for the baseline interpreter.
        // This is a finer-grained "ExecutionStrategy" choice.
        if (value == "no")
        {
            vm.cgoto = false;
            return EVMC_SET_OPTION_SUCCESS;
        }
        return EVMC_SET_OPTION_INVALID_VALUE;
#else
        return EVMC_SET_OPTION_INVALID_NAME;
#endif
    }
    // ... (other options like trace)
    return EVMC_SET_OPTION_INVALID_NAME;
}

}  // namespace

// ... (VM constructor and other methods)

}  // namespace evmone

extern "C" {
EVMC_EXPORT evmc_vm* evmc_create_evmone() noexcept
{
    return new evmone::VM{};
}
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2020 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "eof.hpp"
#include <evmc/evmc.h>
#include <memory>
#include <vector>

namespace evmone
{
// ... (forward declarations)
namespace baseline
{
/// The result of code analysis.
/// For the baseline interpreter, this is a very simple analysis that mainly
/// identifies valid JUMPDEST locations. This represents a "standard" or
/// "minimal" analysis strategy.
class CodeAnalysis
{
public:
    /// The bitmap of valid jump destinations.
    using JumpdestMap = std::vector<bool>;

private:
    bytes_view m_executable_code;  ///< Executable code section.
    JumpdestMap m_jumpdest_map;    ///< Map of valid jump destinations.
    // ... (other fields for EOF and padded code)

public:
    /// Check if given position is valid jump destination. Use only for legacy code.
    [[nodiscard]] bool check_jumpdest(uint64_t position) const noexcept
    {
        if (position >= m_jumpdest_map.size())
            return false;
        return m_jumpdest_map[static_cast<size_t>(position)];
    }
    // ... (other methods)
};

/// The `execute` function for the baseline interpreter.
/// This represents one of the main `ExecutionEngine` implementations.
EVMC_EXPORT evmc_result execute(VM&, const evmc_host_interface& host, evmc_host_context* ctx,
    evmc_revision rev, const evmc_message& msg, const CodeAnalysis& analysis) noexcept;

}  // namespace baseline
}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2020 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "baseline.hpp"
#include "baseline_instruction_table.hpp"
// ...

namespace evmone::baseline
{
namespace
{
// ... (helper functions for checking requirements and invoking instructions)

/// The main dispatch loop for the baseline interpreter. This is a clear example
/// of a `DirectCall` or `JumpTable` execution strategy. It iterates through the
/// bytecode and uses a `switch` statement to execute opcodes.
template <bool TracingEnabled>
int64_t dispatch(const CostTable& cost_table, ExecutionState& state, int64_t gas,
    const uint8_t* code, Tracer* tracer = nullptr) noexcept
{
    // ... (setup)

    while (true)  // Guaranteed to terminate because padded code ends with STOP.
    {
        // ... (tracing notification)

        const auto op = *position.code_it;
        switch (op)
        {
#define ON_OPCODE(OPCODE)                                                                     \
    case OPCODE:                                                                              \
        if (const auto next = invoke<OPCODE>(cost_table, stack_bottom, position, gas, state); \
            next.code_it == nullptr)                                                          \
        {                                                                                     \
            return gas;                                                                       \
        }                                                                                     \
        else                                                                                  \
        {                                                                                     \
            position = next;                                                                  \
        }                                                                                     \
        break;

            MAP_OPCODES
#undef ON_OPCODE

        default:
            state.status = EVMC_UNDEFINED_INSTRUCTION;
            return gas;
        }
    }
    intx::unreachable();
}

#if EVMONE_CGOTO_SUPPORTED
/// This is an alternative dispatch loop using computed gotos, a more optimized
/// `ExecutionStrategy`. The selection is controlled by the `VM::cgoto` flag.
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
    };
    // ... (setup)

    goto* cgoto_table[*position.code_it];

#define ON_OPCODE(OPCODE)                                                                 \
    TARGET_##OPCODE:                                                                      \
    if (const auto next = invoke<OPCODE>(cost_table, stack_bottom, position, gas, state); \
        next.code_it == nullptr)                                                          \
    {                                                                                     \
        return gas;                                                                       \
    }                                                                                     \
    else                                                                                  \
    {                                                                                     \
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
}  // namespace

/// The entry point for the baseline interpreter. It performs analysis and then
/// calls the dispatch loop.
evmc_result execute(evmc_vm* c_vm, const evmc_host_interface* host, evmc_host_context* ctx,
    evmc_revision rev, const evmc_message* msg, const uint8_t* code, size_t code_size) noexcept
{
    auto vm = static_cast<VM*>(c_vm);
    const bytes_view container{code, code_size};
    const auto eof_enabled = rev >= instr::REV_EOF1;

    // ... (EOF validation)

    const auto code_analysis = analyze(container, eof_enabled);
    return execute(*vm, *host, ctx, rev, *msg, code_analysis);
}
}  // namespace evmone::baseline
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/advanced_analysis.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "execution_state.hpp"
#include "instructions.hpp"
// ...
#include <vector>

namespace evmone::advanced
{
// ...

/// Compressed information about instruction basic block.
/// The advanced interpreter's analysis phase computes this information
/// for each basic block, allowing for faster execution by reducing checks
/// and calculations at runtime. This is a key concept for an "Optimized"
-/// interpreter type.
struct BlockInfo
{
    /// The total base gas cost of all instructions in the block.
    uint32_t gas_cost = 0;

    /// The stack height required to execute the block.
    int16_t stack_req = 0;

    /// The maximum stack height growth relative to the stack height at block start.
    int16_t stack_max_growth = 0;
};
// ...

struct Instruction;

/// The result of the advanced code analysis.
/// This structure contains a sequence of `Instruction` objects, which include
/// function pointers to the instruction implementations. This represents a
/// different "ExecutionStrategy" compared to the baseline's direct bytecode
/// interpretation.
struct AdvancedCodeAnalysis
{
    std::vector<Instruction> instrs;

    /// Storage for large push values.
    std::vector<intx::uint256> push_values;

    /// The offsets of JUMPDESTs in the original code.
    std::vector<int32_t> jumpdest_offsets;

    /// The indexes of the instructions in the generated instruction table
    /// matching the elements from jumdest_offsets.
    std::vector<int32_t> jumpdest_targets;
};

/// Performs advanced analysis on the code, creating basic blocks and
/// a table of instructions.
EVMC_EXPORT AdvancedCodeAnalysis analyze(evmc_revision rev, bytes_view code) noexcept;

/// The table of opcode properties for a specific EVM revision.
EVMC_EXPORT const OpTable& get_op_table(evmc_revision rev) noexcept;

}  // namespace evmone::advanced
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/advanced_execution.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "advanced_execution.hpp"
#include "advanced_analysis.hpp"
// ...

namespace evmone::advanced
{
/// The main execution loop for the "advanced" interpreter.
/// Instead of a `switch` on opcodes, it iterates through a pre-computed
/// array of `Instruction` structs, each containing a function pointer.
/// This demonstrates a highly optimized execution strategy.
evmc_result execute(AdvancedExecutionState& state, const AdvancedCodeAnalysis& analysis) noexcept
{
    state.analysis.advanced = &analysis;  // Allow accessing the analysis by instructions.

    const auto* instr = state.analysis.advanced->instrs.data();  // Get the first instruction.
    while (instr != nullptr)
        instr = instr->fn(instr, state);

    // ... (result handling)
}

/// The EVMC-compatible entry point for the advanced interpreter.
evmc_result execute(evmc_vm* /*unused*/, const evmc_host_interface* host, evmc_host_context* ctx,
    evmc_revision rev, const evmc_message* msg, const uint8_t* code, size_t code_size) noexcept
{
    // ... (EOF handling)
    
    const auto analysis = analyze(rev, container);
    auto state = std::make_unique<AdvancedExecutionState>(*msg, rev, *host, ctx, container);
    return execute(*state, analysis);
}
}  // namespace evmone::advanced
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <evmc/evmc.hpp>
#include <intx/intx.hpp>
#include <memory>
#include <vector>

namespace evmone
{
// ...
/// Provides memory for EVM stack.
/// This shows a concrete implementation of a stack backing store.
/// It's a fixed-size allocation as per EVM spec, aligned for performance.
class StackSpace
{
    // ...
public:
    /// The maximum number of EVM stack items.
    static constexpr auto limit = 1024;
    // ...
};

/// The EVM memory.
/// This is a good reference for a `MemoryComponent`. It demonstrates a
/// common optimization strategy: starting with a small allocation and
/// growing exponentially to handle memory expansion efficiently.
class Memory
{
    /// The size of allocation "page".
    static constexpr size_t page_size = 4 * 1024;
    // ...
public:
    Memory() noexcept;
    uint8_t& operator[](size_t index) noexcept;
    [[nodiscard]] const uint8_t* data() const noexcept;
    [[nodiscard]] size_t size() const noexcept;
    void grow(size_t new_size) noexcept;
    // ...
};

/// The execution state for an EVM call frame. It contains all components
/// like memory and stack that the prompt wants to make swappable. In `evmone`,
/// these are tightly coupled for performance, but this serves as a good
/// reference for what state needs to be managed.
class ExecutionState
{
public:
    int64_t gas_refund = 0;
    Memory memory;
    const evmc_message* msg = nullptr;
    evmc::HostContext host;
    evmc_revision rev = {};
    bytes return_data;
    bytes_view original_code;
    evmc_status_code status = EVMC_SUCCESS;
    size_t output_offset = 0;
    size_t output_size = 0;
    
    // ... (other fields)

    /// Stack space allocation.
    StackSpace stack_space;

    // ... (methods)
};
}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2020 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "instructions_opcodes.hpp"
#include <array>
#include <optional>

namespace evmone::instr
{
/// The special gas cost value marking an EVM instruction as "undefined".
constexpr int16_t undefined = -1;

/// The table of instruction gas costs per EVM revision.
/// This provides a concrete example of how to manage opcode properties
/// across different EVM versions, similar to the prompt's `ComponentRegistry`.
using GasCostTable = std::array<std::array<int16_t, 256>, EVMC_MAX_REVISION + 1>;

constexpr inline GasCostTable gas_costs = []() noexcept {
    GasCostTable table{};
    // ... (initialization for all revisions)
    table[EVMC_FRONTIER][OP_STOP] = 0;
    table[EVMC_FRONTIER][OP_ADD] = 3;
    // ...
    table[EVMC_SHANGHAI] = table[EVMC_PARIS];
    table[EVMC_SHANGHAI][OP_PUSH0] = 2;
    // ...
    return table;
}();


/// The EVM instruction traits.
/// This struct defines the static properties of an opcode, such as its name,
/// stack requirements, and when it was introduced. This is highly relevant
/// to the `ComponentRegistry` and its profiling data.
struct Traits
{
    /// The instruction name;
    const char* name = nullptr;

    /// Size of the immediate argument in bytes.
    uint8_t immediate_size = 0;

    /// Whether the instruction terminates execution.
    bool is_terminating = false;

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

    table[OP_STOP] = {"STOP", 0, true, 0, 0, EVMC_FRONTIER};
    table[OP_ADD] = {"ADD", 0, false, 2, -1, EVMC_FRONTIER};
    // ... (all other opcodes)
    table[OP_SELFDESTRUCT] = {"SELFDESTRUCT", 0, true, 1, -1, EVMC_FRONTIER};

    return table;
}();

}  // namespace evmone::instr
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2021 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <evmc/evmc.h>
#include <memory>
#include <ostream>
#include <string_view>

namespace evmone
{
// ... (forward declarations)

/// The `Tracer` class provides an interface for observing the EVM execution.
/// This is directly analogous to the `PerformanceProfiler` requested in the prompt.
/// A custom tracer could be implemented to gather detailed performance metrics
/// for different interpreter configurations.
class Tracer
{
    friend class VM;
    std::unique_ptr<Tracer> m_next_tracer;

public:
    virtual ~Tracer() = default;

    // ... (notification methods)

private:
    /// This callback is invoked by the VM before the execution of a an EVM code.
    virtual void on_execution_start(
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept = 0;

    /// This callback is invoked by the VM before the execution of an instruction.
    virtual void on_instruction_start(uint32_t pc, const intx::uint256* stack_top, int stack_height,
        int64_t gas, const ExecutionState& state) noexcept = 0;

    /// This callback is invoked by the VM at the end of the execution.
    virtual void on_execution_end(const evmc_result& result) noexcept = 0;
};

/// Creates the "histogram" tracer which counts occurrences of individual opcodes
/// during execution and reports this data in CSV format. An example of a simple profiler.
EVMC_EXPORT std::unique_ptr<Tracer> create_histogram_tracer(std::ostream& out);

/// Creates a tracer which prints instruction trace in JSON format.
/// Another example of a detailed profiler/tracer.
EVMC_EXPORT std::unique_ptr<Tracer> create_instruction_tracer(std::ostream& out);

}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/bench/bench.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "../statetest/statetest.hpp"
#include "helpers.hpp"
#include <benchmark/benchmark.h>
// ...

namespace evmone::test
{
// ...

/// This function registers benchmarks for both `advanced` and `baseline` interpreters.
/// This demonstrates how to compare the performance of different interpreter "types"
/// or "execution strategies", a core requirement of the prompt.
void register_benchmarks(std::span<const BenchmarkCase> benchmark_cases)
{
    evmc::VM* advanced_vm = nullptr;
    evmc::VM* baseline_vm = nullptr;
    // ...

    for (const auto& b : benchmark_cases)
    {
        // Register benchmark for the analysis phase of the advanced interpreter.
        if (advanced_vm != nullptr)
        {
            RegisterBenchmark("advanced/analyse/" + b.name, [&b](State& state) {
                bench_analyse<advanced::AdvancedCodeAnalysis, advanced_analyse>(
                    state, default_revision, b.code);
            })->Unit(kMicrosecond);
        }

        // Register benchmark for the analysis phase of the baseline interpreter.
        if (baseline_vm != nullptr)
        {
            RegisterBenchmark("baseline/analyse/" + b.name, [&b](State& state) {
                bench_analyse<baseline::CodeAnalysis, baseline_analyse>(
                    state, default_revision, b.code);
            })->Unit(kMicrosecond);
        }

        for (const auto& input : b.inputs)
        {
            // ...
            // Register benchmark for the execution phase of the advanced interpreter.
            if (advanced_vm != nullptr)
            {
                const auto name = "advanced/execute/" + case_name;
                RegisterBenchmark(name, [&vm = *advanced_vm, &b, &input](State& state) {
                    bench_advanced_execute(state, vm, b.code, input.input, input.expected_output);
                })->Unit(kMicrosecond);
            }

            // Register benchmark for the execution phase of the baseline interpreter.
            if (baseline_vm != nullptr)
            {
                const auto name = "baseline/execute/" + case_name;
                RegisterBenchmark(name, [&vm = *baseline_vm, &b, &input](State& state) {
                    bench_baseline_execute(state, vm, b.code, input.input, input.expected_output);
                })->Unit(kMicrosecond);
            }
            // ...
        }
    }
}

int main(int argc, char** argv)
{
    // ...
    try
    {
        // ... (parsing args)

        // Create VM instances for different interpreter configurations.
        registered_vms["advanced"] = evmc::VM{evmc_create_evmone(), {{"advanced", ""}}};
        registered_vms["baseline"] = evmc::VM{evmc_create_evmone()};
        registered_vms["bnocgoto"] = evmc::VM{evmc_create_evmone(), {{"cgoto", "no"}}};
        
        register_benchmarks(benchmark_cases);
        // ...
        RunSpecifiedBenchmarks();
        return 0;
    }
    // ... (exception handling)
}
```
</file>
</evmone>



## REVM Context

Here are the most relevant code snippets from `revm` to help with the implementation of the Interpreter Types System.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs">
```rust
//! Main Interpreter struct.

// ... imports ...
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

impl<EXT: Default> Interpreter<EthInterpreter<EXT>> {
    /// Create new interpreter
    pub fn new(
        memory: SharedMemory,
        bytecode: ExtBytecode,
        inputs: InputsImpl,
        is_static: bool,
        is_eof_init: bool,
        spec_id: SpecId,
        gas_limit: u64,
    ) -> Self {
        let runtime_flag = RuntimeFlags {
            spec_id,
            is_static,
            is_eof: bytecode.is_eof(),
            is_eof_init,
        };

        Self {
            bytecode,
            stack: Stack::new(),
            return_data: ReturnDataImpl::default(),
            memory,
            input: inputs,
            sub_routine: SubRoutineImpl::default(),
            control: LoopControlImpl::new(gas_limit),
            runtime_flag,
            extend: EXT::default(),
        }
    }
    // ...
}

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
    // ...
    /// Executes the instruction at the current instruction pointer.
    ///
    /// Internally it will increment instruction pointer by one.
    #[inline]
    pub fn step<H: ?Sized>(&mut self, instruction_table: &InstructionTable<IW, H>, host: &mut H) {
        let context = InstructionContext {
            interpreter: self,
            host,
        };
        context.step(instruction_table);
    }
    // ...
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
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_types.rs">
```rust
// ... imports ...

/// Helper function to read immediates data from the bytecode
pub trait Immediates {
    // ...
    fn read_u16(&self) -> u16;
    fn read_u8(&self) -> u8;
    fn read_offset_u16(&self, offset: isize) -> u16;
    fn read_slice(&self, len: usize) -> &[u8];
}

/// Trait for fetching inputs of the call.
pub trait InputsTr {
    // ...
}

/// Trait needed for legacy bytecode.
pub trait LegacyBytecode {
    fn bytecode_len(&self) -> usize;
    fn bytecode_slice(&self) -> &[u8];
}

/// Trait for Interpreter to be able to jump
pub trait Jumps {
    fn relative_jump(&mut self, offset: isize);
    fn absolute_jump(&mut self, offset: usize);
    fn is_valid_legacy_jump(&mut self, offset: usize) -> bool;
    fn pc(&self) -> usize;
    fn opcode(&self) -> u8;
}

/// Trait for Interpreter memory operations.
pub trait MemoryTr {
    fn set_data(&mut self, memory_offset: usize, data_offset: usize, len: usize, data: &[u8]);
    // ...
    fn size(&self) -> usize;
    fn resize(&mut self, new_size: usize) -> bool;
}

// ... other traits for EOF, ReturnData, etc. ...

pub trait LoopControl {
    fn set_instruction_result(&mut self, result: InstructionResult);
    fn set_next_action(&mut self, action: InterpreterAction, result: InstructionResult);
    fn gas(&self) -> &Gas;
    fn gas_mut(&mut self) -> &mut Gas;
    fn instruction_result(&self) -> InstructionResult;
    fn take_next_action(&mut self) -> InterpreterAction;
}

pub trait RuntimeFlag {
    fn is_static(&self) -> bool;
    fn is_eof(&self) -> bool;
    fn is_eof_init(&self) -> bool;
    fn spec_id(&self) -> SpecId;
}

pub trait InterpreterTypes {
    type Stack: StackTr;
    type Memory: MemoryTr;
    type Bytecode: Jumps + Immediates + LegacyBytecode + EofData + EofContainer + EofCodeInfo;
    type ReturnData: ReturnData;
    type Input: InputsTr;
    type SubRoutineStack: SubRoutineStack;
    type Control: LoopControl;
    type RuntimeFlag: RuntimeFlag;
    type Extend;
    type Output;
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions.rs">
```rust
//! EVM opcode implementations.

// ... imports ...
use crate::{interpreter_types::InterpreterTypes, Host, InstructionContext};

/// EVM opcode function signature.
pub type Instruction<W, H> = fn(InstructionContext<'_, H, W>);

/// Instruction table is list of instruction function pointers mapped to 256 EVM opcodes.
pub type InstructionTable<W, H> = [Instruction<W, H>; 256];

/// Returns the instruction table for the given spec.
pub const fn instruction_table<WIRE: InterpreterTypes, H: Host + ?Sized>(
) -> [Instruction<WIRE, H>; 256] {
    use bytecode::opcode::*;
    let mut table = [control::unknown as Instruction<WIRE, H>; 256];

    table[STOP as usize] = control::stop;
    table[ADD as usize] = arithmetic::add;
    table[MUL as usize] = arithmetic::mul;
    table[SUB as usize] = arithmetic::sub;
    // ... and so on for all opcodes

    table[PUSH1 as usize] = stack::push::<1, _, _>;
    table[PUSH2 as usize] = stack::push::<2, _, _>;
    // ...
    table[PUSH32 as usize] = stack::push::<32, _, _>;

    table[DUP1 as usize] = stack::dup::<1, _, _>;
    table[DUP2 as usize] = stack::dup::<2, _, _>;
    // ...
    table[DUP16 as usize] = stack::dup::<16, _, _>;

    table[SWAP1 as usize] = stack::swap::<1, _, _>;
    table[SWAP2 as usize] = stack::swap::<2, _, _>;
    // ...
    table[SWAP16 as usize] = stack::swap::<16, _, _>;

    // ... and so on for all opcodes
    table
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/arithmetic.rs">
```rust
// ... imports ...
use crate::{
    gas,
    interpreter_types::{InterpreterTypes, LoopControl, RuntimeFlag, StackTr},
    InstructionContext,
};
use primitives::U256;

pub fn add<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = op1.wrapping_add(*op2);
}

pub fn mul<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::LOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = op1.wrapping_mul(*op2);
}

pub fn sub<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([op1], op2, context.interpreter);
    *op2 = op1.wrapping_sub(*op2);
}

// ... other arithmetic opcodes ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/macros.rs">
```rust
//! Utility macros to help implementing opcode instruction functions.

// ...

/// Check if the `SPEC` is enabled, and fail the instruction if it is not.
#[macro_export]
macro_rules! check {
    ($interpreter:expr, $min:ident) => {
        if !$interpreter
            .runtime_flag
            .spec_id()
            .is_enabled_in(primitives::hardfork::SpecId::$min)
        {
            $interpreter
                .control
                .set_instruction_result($crate::InstructionResult::NotActivated);
            return;
        }
    };
}

/// Records a `gas` cost and fails the instruction if it would exceed the available gas.
#[macro_export]
macro_rules! gas {
    // ...
}

/// Resizes the interpreterreter memory if necessary. Fails the instruction if the memory or gas limit
/// is exceeded.
#[macro_export]
macro_rules! resize_memory {
    // ...
}

/// Pops n values from the stack. Fails the instruction if n values can't be popped.
#[macro_export]
macro_rules! popn {
    ([ $($x:ident),* ],$interpreterreter:expr $(,$ret:expr)? ) => {
        let Some([$( $x ),*]) = $interpreterreter.stack.popn() else {
            $interpreterreter.control.set_instruction_result($crate::InstructionResult::StackUnderflow);
            return $($ret)?;
        };
    };
}

/// Pops n values from the stack and returns the top value. Fails the instruction if n values can't be popped.
#[macro_export]
macro_rules! popn_top {
    // ...
}

/// Pushes a `B256` value onto the stack. Fails the instruction if the stack is full.
#[macro_export]
macro_rules! push {
    // ...
}

// ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/stack.rs">
```rust
use crate::InstructionResult;
use core::{fmt, ptr};
use primitives::U256;
use std::vec::Vec;

use super::StackTr;

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

impl StackTr for Stack {
    fn len(&self) -> usize {
        self.len()
    }

    #[inline]
    fn popn<const N: usize>(&mut self) -> Option<[U256; N]> {
        if self.len() < N {
            return None;
        }
        // SAFETY: Stack length is checked above.
        Some(unsafe { self.popn::<N>() })
    }
    
    // ...
}

impl Stack {
    /// Instantiate a new stack with the [default stack limit][STACK_LIMIT].
    #[inline]
    pub fn new() -> Self {
        Self {
            // SAFETY: Expansion functions assume that capacity is `STACK_LIMIT`.
            data: Vec::with_capacity(STACK_LIMIT),
        }
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
    
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/shared_memory.rs">
```rust
use super::MemoryTr;
use core::{
    //...
};
use primitives::{hex, B256, U256};
use std::{rc::Rc, vec::Vec};

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

impl MemoryTr for SharedMemory {
    fn set_data(&mut self, memory_offset: usize, data_offset: usize, len: usize, data: &[u8]) {
        self.set_data(memory_offset, data_offset, len, data);
    }
    //...
    fn size(&self) -> usize {
        self.len()
    }
    //...
    fn resize(&mut self, new_size: usize) -> bool {
        self.resize(new_size);
        true
    }
}

impl SharedMemory {
    /// Creates a new memory instance that can be shared between calls.
    ///
    /// The default initial capacity is 4KiB.
    #[inline]
    pub fn new() -> Self {
        Self::with_capacity(4 * 1024) // from evmone
    }
    
    //...
    
    /// Prepares the shared memory for a new child context.
    ///
    /// # Panics
    ///
    /// Panics if this function was already called without freeing child context.
    #[inline]
    pub fn new_child_context(&mut self) -> SharedMemory {
        // ...
    }

    /// Resizes the memory in-place so that `len` is equal to `new_len`.
    #[inline]
    pub fn resize(&mut self, new_size: usize) {
        self.buffer
            .borrow_mut()
            .resize(self.my_checkpoint + new_size, 0);
    }
    
    //...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/primitives/src/hardfork.rs">
```rust
// ...

/// Specification IDs and their activation block
///
/// Information was obtained from the [Ethereum Execution Specifications](https://github.com/ethereum/execution-specs).
#[repr(u8)]
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, PartialOrd, Ord, Hash, TryFromPrimitive)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum SpecId {
    /// Frontier hard fork
    #[default]
    FRONTIER = 0,
    // ...
    HOMESTEAD,
    // ...
    TANGERINE,
    // ...
    SPURIOUS_DRAGON,
    // ...
    BYZANTIUM,
    // ...
    PETERSBURG,
    // ...
    ISTANBUL,
    // ...
    BERLIN,
    // ...
    LONDON,
    // ...
    MERGE,
    // ...
    SHANGHAI,
    // ...
    CANCUN,
    // ...
    PRAGUE,
    OSAKA,
}

impl SpecId {
    // ...
    /// Returns `true` if the given specification ID is enabled in this spec.
    #[inline]
    pub const fn is_enabled_in(self, other: Self) -> bool {
        self as u8 >= other as u8
    }
}
// ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/host.rs">
```rust
use context_interface::{
    context::{ContextTr, SStoreResult, SelfDestructResult, StateLoad},
    journaled_state::AccountLoad,
    Block, Cfg, Database, JournalTr, LocalContextTr, Transaction, TransactionType,
};
use primitives::{Address, Bytes, Log, StorageKey, StorageValue, B256, U256};

/// Host trait with all methods that are needed by the Interpreter.
///
/// This trait is implemented for all types that have `ContextTr` trait.
///
/// There are few groups of functions which are Block, Transaction, Config, Database and Journal functions.
pub trait Host {
    /* Block */
    fn basefee(&self) -> U256;
    fn blob_gasprice(&self) -> U256;
    fn gas_limit(&self) -> U256;
    // ... more block context methods ...

    /* Transaction */
    fn effective_gas_price(&self) -> U256;
    fn caller(&self) -> Address;
    // ... more transaction context methods ...

    /* Config */
    fn max_initcode_size(&self) -> usize;

    /* Database */
    fn block_hash(&mut self, number: u64) -> Option<B256>;

    /* Journal */
    fn selfdestruct(
        &mut self,
        address: Address,
        target: Address,
    ) -> Option<StateLoad<SelfDestructResult>>;
    fn log(&mut self, log: Log);
    fn sstore(
        &mut self,
        address: Address,
        key: StorageKey,
        value: StorageValue,
    ) -> Option<StateLoad<SStoreResult>>;
    fn sload(&mut self, address: Address, key: StorageKey) -> Option<StateLoad<StorageValue>>;
    // ... more state methods ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
// ...
use primitives::{hardfork::SpecId, Address, HashMap, HashSet};
use std::{boxed::Box, vec::Vec};

// ...
pub type PrecompileFn = fn(&[u8], u64) -> PrecompileResult;

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

    /// Returns precompiles for Homestead spec.
    pub fn homestead() -> &'static Self {
        static INSTANCE: OnceBox<Precompiles> = OnceBox::new();
        INSTANCE.get_or_init(|| {
            let mut precompiles = Precompiles::default();
            precompiles.extend([
                secp256k1::ECRECOVER,
                hash::SHA256,
                hash::RIPEMD160,
                identity::FUN,
            ]);
            Box::new(precompiles)
        })
    }
    
    // ... other hardforks ...
    
    /// Extends the precompiles with the given precompiles.
    ///
    /// Other precompiles with overwrite existing precompiles.
    #[inline]
    pub fn extend(&mut self, other: impl IntoIterator<Item = PrecompileWithAddress>) {
        let items: Vec<PrecompileWithAddress> = other.into_iter().collect::<Vec<_>>();
        self.addresses.extend(items.iter().map(|p| *p.address()));
        self.inner.extend(items.into_iter().map(|p| (p.0, p.1)));
    }
    //...
}

/// Precompile with address and function.
#[derive(Clone, Debug)]
pub struct PrecompileWithAddress(pub Address, pub PrecompileFn);

//...
```
</file>
</revm>
## Prompt Corrections

The original prompt provides a very detailed specification for a highly dynamic and adaptive interpreter system. While this is an excellent goal, it's worth noting that this level of runtime adaptivity (e.g., `TypeSelector` learning from past performance, adaptive switching based on memory pressure) is significantly more advanced than what's found in most production EVM implementations like `revm`.

**Corrections & Suggestions:**

1.  **Complexity**: The proposed system with a `ComponentRegistry`, `TypeSelector`, and `PerformanceProfiler` is complex. A more pragmatic first step, inspired by `revm`, would be to use build-time or configuration-time selection of components. `revm` achieves this through its `SpecId` (hardfork) which determines which `InstructionTable` and `Precompiles` are used. This is a simpler, more static form of the requested configurability.
2.  **Generics over Runtime Dispatch**: The prompt suggests runtime selection of components (`create_stack_component`, etc.). An alternative, potentially more performant approach in a language like Zig or Rust is to use generics or traits, similar to `revm`'s `InterpreterTypes` trait. This allows the compiler to create specialized interpreter instances at compile time, eliminating runtime dispatch overhead.
3.  **Performance Profiling**: The `PerformanceProfiler` and adaptive switching are advanced features. A simpler starting point would be to implement different configurations (e.g., `debug`, `performance`) that can be chosen when the VM is instantiated, and then add the profiling and adaptive layers later.
4.  **Component Interfaces**: The prompt's use of `union(enum)` in Zig for component interfaces is a good way to achieve dynamic dispatch. `revm` uses traits (`StackTr`, `MemoryTr`, etc.) and generics for this purpose, which is another valid pattern. The key takeaway is the abstraction over the concrete implementation.

The provided `revm` snippets offer a robust, battle-tested architectural foundation that aligns well with the core goals of the prompt, even if it doesn't implement the most advanced adaptive features requested. Focusing on `revm`'s patterns for instruction dispatch (`InstructionTable`), configuration (`SpecId`), and component abstraction (`InterpreterTypes` and the `Host` trait) will provide a solid starting point for building the requested system.



## EXECUTION-SPECS Context

An Interpreter Types System is a sophisticated feature. The `execution-specs` codebase provides excellent foundational logic for the standard components and the overall EVM structure. While it doesn't have a dynamic, adaptive system as described in the prompt, it uses a fork-based configuration that serves as a strong model for implementing different interpreter types.

The most relevant files from `execution-specs` for this task are:
*   **`vm/interpreter.py`**: Contains the core execution loop, which is what the `ExecutionEngine` in the prompt will replace or extend.
*   **`vm/__init__.py`**: Defines the `Evm` and `Message` data structures, which encapsulate the state of an execution frame. This is crucial for understanding how the different components (stack, memory, etc.) interact.
*   **`vm/instructions/__init__.py`**: Shows how opcodes are mapped to their implementations, serving as a direct example of a "JumpTable" execution strategy.
*   **`vm/stack.py` & `vm/memory.py`**: Provide the reference implementation for the "Standard" stack and memory components.
*   **`forks.py`**: Demonstrates how different configurations (hardforks) are managed and switched, a key concept for the `InterpreterTypeManager`.
*   **`state.py`**: Outlines state management, including snapshots and reverts, which is a critical function of the interpreter.
*   **`trace.py`**: Provides a blueprint for the profiling and tracing capabilities requested in the prompt.

These snippets offer a robust foundation for building the specified interpreter system.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
```python
"""
Ethereum Virtual Machine (EVM) Interpreter
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

A straightforward interpreter that executes EVM code.
"""

from dataclasses import dataclass
from typing import Optional, Set, Tuple

from ethereum_types.bytes import Bytes0
from ethereum_types.numeric import U256, Uint, ulen

from ethereum.exceptions import EthereumException
from ethereum.trace import (
    EvmStop,
    OpEnd,
    OpException,
    OpStart,
    PrecompileEnd,
    PrecompileStart,
    TransactionEnd,
    evm_trace,
)

from ..blocks import Log
from ..fork_types import Address
from ..state import (
    account_has_code_or_nonce,
    account_has_storage,
    begin_transaction,
    commit_transaction,
    destroy_storage,
    increment_nonce,
    mark_account_created,
    move_ether,
    rollback_transaction,
    set_code,
)
from ..vm import Message
from ..vm.gas import GAS_CODE_DEPOSIT, charge_gas
from ..vm.precompiled_contracts.mapping import PRE_COMPILED_CONTRACTS
from . import Evm
from .exceptions import (
    AddressCollision,
    ExceptionalHalt,
    InvalidContractPrefix,
    InvalidOpcode,
    OutOfGasError,
    Revert,
    StackDepthLimitError,
)
from .instructions import Ops, op_implementation
from .runtime import get_valid_jump_destinations

STACK_DEPTH_LIMIT = Uint(1024)
MAX_CODE_SIZE = 0x6000


@dataclass
class MessageCallOutput:
    """
    Output of a particular message call

    Contains the following:

          1. `gas_left`: remaining gas after execution.
          2. `refund_counter`: gas to refund after execution.
          3. `logs`: list of `Log` generated during execution.
          4. `accounts_to_delete`: Contracts which have self-destructed.
          5. `error`: The error from the execution if any.
    """

    gas_left: Uint
    refund_counter: U256
    logs: Tuple[Log, ...]
    accounts_to_delete: Set[Address]
    error: Optional[EthereumException]


def process_message_call(message: Message) -> MessageCallOutput:
    # ... (Code for processing message calls, creating contracts, etc.)

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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/__init__.py">
```python
"""
Ethereum Virtual Machine (EVM)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

The abstract computer which runs the code stored in an
`.fork_types.Account`.
"""

from dataclasses import dataclass, field
from typing import List, Optional, Set, Tuple, Union

from ethereum_types.bytes import Bytes, Bytes0, Bytes32
from ethereum_types.numeric import U64, U256, Uint

from ethereum.crypto.hash import Hash32
from ethereum.exceptions import EthereumException

from ..blocks import Log, Receipt, Withdrawal
from ..fork_types import Address, VersionedHash
from ..state import State, TransientStorage
from ..transactions import LegacyTransaction
from ..trie import Trie

__all__ = ("Environment", "Evm", "Message")


@dataclass
class BlockEnvironment:
    # ...
@dataclass
class TransactionEnvironment:
    # ...
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/__init__.py">
```python
"""
EVM Instruction Encoding (Opcodes)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
...
Introduction
------------
Machine readable representations of EVM instructions, and a mapping to their
implementations.
"""

import enum
from typing import Callable, Dict

from . import arithmetic as arithmetic_instructions
from . import bitwise as bitwise_instructions
from . import block as block_instructions
# ... other instruction imports

class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """
    ADD = 0x01
    MUL = 0x02
    SUB = 0x03
    # ... all other opcodes
    SELFDESTRUCT = 0xFF


op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    Ops.MUL: arithmetic_instructions.mul,
    # ... all other opcode implementations
    Ops.CREATE2: system_instructions.create2,
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/stack.py">
```python
"""
Ethereum Virtual Machine (EVM) Stack
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementation of the stack operators for the EVM.
"""

from typing import List

from ethereum_types.numeric import U256

from .exceptions import StackOverflowError, StackUnderflowError


def pop(stack: List[U256]) -> U256:
    """
    Pops the top item off of `stack`.

    Parameters
    ----------
    stack :
        EVM stack.

    Returns
    -------
    value : `U256`
        The top element on the stack.

    """
    if len(stack) == 0:
        raise StackUnderflowError

    return stack.pop()


def push(stack: List[U256], value: U256) -> None:
    """
    Pushes `value` onto `stack`.

    Parameters
    ----------
    stack :
        EVM stack.

    value :
        Item to be pushed onto `stack`.

    """
    if len(stack) == 1024:
        raise StackOverflowError

    return stack.append(value)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/memory.py">
```python
"""
Ethereum Virtual Machine (EVM) Memory
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

EVM memory operations.
"""
from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256, Uint

from ethereum.utils.byte import right_pad_zero_bytes


def memory_write(
    memory: bytearray, start_position: U256, value: Bytes
) -> None:
    """
    Writes to memory.
    ...
    """
    memory[start_position : int(start_position) + len(value)] = value


def memory_read_bytes(
    memory: bytearray, start_position: U256, size: U256
) -> bytearray:
    """
    Read bytes from memory.
    ...
    """
    return memory[start_position : Uint(start_position) + Uint(size)]


def buffer_read(buffer: Bytes, start_position: U256, size: U256) -> Bytes:
    """
    Read bytes from a buffer. Padding with zeros if necessary.
    ...
    """
    return right_pad_zero_bytes(
        buffer[start_position : Uint(start_position) + Uint(size)], size
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/forks.py">
```python
"""
Ethereum Forks
^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Detects Python packages that specify Ethereum hardforks.
"""

import importlib
import importlib.abc
import importlib.util
import pkgutil
from enum import Enum, auto
from pathlib import PurePath
from pkgutil import ModuleInfo
from types import ModuleType
from typing import (
    TYPE_CHECKING,
    Any,
    Dict,
    Iterator,
    List,
    Optional,
    Type,
    TypeVar,
)

from ethereum_types.numeric import U256, Uint

if TYPE_CHECKING:
    from ethereum.fork_criteria import ForkCriteria

# ...

H = TypeVar("H", bound="Hardfork")


class Hardfork:
    """
    Metadata associated with an Ethereum hardfork.
    """

    mod: ModuleType

    @classmethod
    def discover(cls: Type[H], base: Optional[PurePath] = None) -> List[H]:
        """
        Find packages which contain Ethereum hardfork specifications.
        """
        # ...

    @classmethod
    def load(cls: Type[H], config_dict: Dict["ForkCriteria", str]) -> List[H]:
        """
        Load the forks from a config dict specifying fork blocks and
        timestamps.
        """
        # ...

    def module(self, name: str) -> Any:
        """
        Import if necessary, and return the given module belonging to this hard
        fork.
        """
        return importlib.import_module(self.mod.__name__ + "." + name)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/state.py">
```python
"""
State
^^^^^
...
Introduction
------------
The state contains all information that is preserved between transactions.
It consists of a main account trie and storage tries for each contract.
There is a distinction between an account that does not exist and
`EMPTY_ACCOUNT`.
"""

from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional, Set, Tuple

# ...

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

# ...

def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Start a state transaction.
    ...
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
    ...
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
    ...
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

    transient_storage._tries = transient_storage._snapshots.pop()
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/trace.py">
```python
"""
Defines the functions required for creating EVM traces during execution.
...
"""

import enum
from dataclasses import dataclass
from typing import Optional, Protocol, Union

from ethereum_types.bytes import Bytes

from ethereum.exceptions import EthereumException

@dataclass
class TransactionStart:
    # ...
@dataclass
class TransactionEnd:
    # ...
@dataclass
class OpStart:
    """
    Trace event that is triggered before executing an opcode.
    """

    op: enum.Enum
    """
    Opcode that is about to be executed.
    ...
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
...
"""

class EvmTracer(Protocol):
    # ...
    def __call__(
        self,
        evm: object,
        event: TraceEvent,
        /,
        trace_memory: bool = False,
        trace_stack: bool = True,
        trace_return_data: bool = False,
    ) -> None:
        # ...


_evm_trace: EvmTracer = discard_evm_trace

def set_evm_trace(tracer: EvmTracer) -> EvmTracer:
    # ...

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
</execution-specs>


---

The user wants to implement a configurable "Interpreter Types System" in Zig. The prompt provides a detailed specification for this system, including concepts like `InterpreterTypeManager`, `ComponentRegistry`, and different types for `Stack`, `Memory`, and `ExecutionStrategy`.

My task is to extract relevant code from `execution-specs` that shows how a standard, non-configurable EVM interpreter is structured. This will serve as a reference for the developer to understand which components to make pluggable.

Here's my plan:
1.  **Interpreter Loop**: The core of any interpreter is its execution loop. I'll find the main loop in `vm/interpreter.py` which fetches and dispatches opcodes. This is the part that will be replaced by different `ExecutionStrategy` implementations.
2.  **Opcode Dispatch**: The prompt mentions `JumpTable` and `DirectCall` execution strategies. The `execution-specs` use a dictionary to map opcodes to their implementation functions. This is a perfect example of a jump-table-like dispatch mechanism. I'll find this in `vm/instructions/__init__.py`.
3.  **Execution Context**: The configurable interpreter needs to pass context around. The `Evm`, `Message`, and `BlockEnvironment` dataclasses in `vm/__init__.py` are the perfect representation of this execution context.
4.  **Stack and Memory**: I need to show how the stack and memory are implemented and used. `vm/stack.py` and `vm/memory.py` provide the basic operations. The individual instruction implementations in `vm/instructions/` will show how these are used in practice.
5.  **State Management**: The interpreter components will interact with the broader EVM state. The `state.py` file is crucial as it defines how accounts and storage are managed. The snapshotting mechanism (`begin_transaction`, `rollback_transaction`) is particularly relevant for handling sub-calls and reverts, a concept the interpreter must manage.
6.  **Opcode Examples**: Providing a few key opcode implementations will be invaluable.
    *   A simple arithmetic one (`add`) to show basic stack operations.
    *   A memory one (`mstore`) to show memory interaction.
    *   A stateful one (`sstore`) to show storage interaction and complex gas calculation.
    *   A system call (`call`) to show how sub-contexts and re-entrancy are handled.

By providing these pieces, the developer will have a clear reference for what a standard EVM interpreter looks like and which parts need to be abstracted into the configurable `StackComponent`, `MemoryComponent`, and `ExecutionEngine` interfaces described in their prompt.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
# vm/interpreter.py is the core execution loop. This is what an
# `ExecutionEngine` would implement. It shows how opcodes are fetched,
# dispatched, and how exceptions are handled.

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
        touched_accounts=set(),
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/__init__.py">
```python
# vm/__init__.py defines the core data structures for an execution frame.
# The `Evm` dataclass represents the state of a single interpreter instance,
# including its stack and memory. The `Message` and `BlockEnvironment`
# dataclasses represent the context passed to the interpreter.

@dataclass
class BlockEnvironment:
    """
    Items external to the virtual machine itself, provided by the environment.
    """

    chain_id: U64
    state: State
    block_gas_limit: Uint
    block_hashes: List[Hash32]
    coinbase: Address
    number: Uint
    base_fee_per_gas: Uint
    time: U256
    difficulty: Uint


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
    touched_accounts: Set[Address]
    return_data: Bytes
    error: Optional[EthereumException]
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/__init__.py">
```python
# vm/instructions/__init__.py defines the opcode enum and the dispatch table.
# This `op_implementation` dictionary is a direct analog to the "JumpTable"
# execution strategy mentioned in the prompt.

class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """

    # Arithmetic Ops
    ADD = 0x01
    MUL = 0x02
    # ... (all other opcodes)
    REVERT = 0xFD
    SELFDESTRUCT = 0xFF


op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    Ops.MUL: arithmetic_instructions.mul,
    # ... (maps all opcodes to their python function)
    Ops.REVERT: system_instructions.revert,
    Ops.CREATE2: system_instructions.create2,
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/stack.py">
```python
# vm/stack.py provides a basic stack implementation. This would be the
# basis for the `StandardStack` component. The prompt's other stack types
# (Optimized, Minimal, Debug) would be alternative implementations of this
# fundamental interface.

from typing import List

from ethereum_types.numeric import U256

from .exceptions import StackOverflowError, StackUnderflowError


def pop(stack: List[U256]) -> U256:
    """
    Pops the top item off of `stack`.

    Parameters
    ----------
    stack :
        EVM stack.

    Returns
    -------
    value : `U256`
        The top element on the stack.

    """
    if len(stack) == 0:
        raise StackUnderflowError

    return stack.pop()


def push(stack: List[U256], value: U256) -> None:
    """
    Pushes `value` onto `stack`.

    Parameters
    ----------
    stack :
        EVM stack.

    value :
        Item to be pushed onto `stack`.

    """
    if len(stack) == 1024:
        raise StackOverflowError

    return stack.append(value)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/memory.py">
```python
# vm/memory.py provides a basic memory implementation. This would be the
# basis for the `StandardMemory` component. The other memory types
# (Optimized, Pooled, CopyOnWrite) would be alternative implementations.

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
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
# vm/gas.py is essential for understanding how gas is calculated and
# charged. The `PerformanceProfiler` would need to track metrics like these
# to make informed decisions. It also defines how memory expansion gas is
# calculated, a key function for any `MemoryComponent`.

from dataclasses import dataclass
from typing import List, Tuple

from ethereum_types.numeric import U256, Uint

from ethereum.trace import GasAndRefund, evm_trace
from ethereum.utils.numeric import ceil32

from . import Evm
from .exceptions import OutOfGasError

# ... (GAS_JUMPDEST, GAS_BASE, etc.)

def charge_gas(evm: Evm, amount: Uint) -> None:
    """
    Subtracts `amount` from `evm.gas_left`.
    """
    evm_trace(evm, GasAndRefund(int(amount)))

    if evm.gas_left < amount:
        raise OutOfGasError
    else:
        evm.gas_left -= amount


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
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/state.py">
```python
# state.py shows how state transitions are managed, particularly with
# snapshotting. The `InterpreterTypeManager` might need a similar mechanism
# to manage the state of its components during nested calls or reverts.

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
```



## GO-ETHEREUM Context

An analysis of the `go-ethereum` codebase reveals several components that are highly relevant to implementing the proposed "Interpreter Types System". The key areas of interest are Geth's EVM interpreter loop, its jump-table-based opcode dispatch, the implementation of core data structures like the stack and memory, and the metrics system for performance profiling.

The following snippets provide a solid reference for building the standard, optimized, and performance-profiling components of the new system.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Interpreter is a simple interpreter for the Ethereum Virtual Machine.
type EVMInterpreter struct {
	evm *EVM
	cfg Config

	jumpTable [256]operation
	analysis  codeAnalysis

	readOnly bool   // whether to throw on state changes
	ret      []byte // last return data
	err      error
}

// NewEVMInterpreter returns a new interpreter for the EVM.
func NewEVMInterpreter(evm *EVM, cfg Config) *EVMInterpreter {
	// The dispatch table is generated based on the enabled fork rules.
	// All EIPs that modify stack behavior or add new opcodes are checked
	// here.
	jt := makeJumpTable(evm.chainRules)

	return &EVMInterpreter{
		evm:       evm,
		cfg:       cfg,
		jumpTable: jt,
	}
}

// Run is the main loop for executing the given contract's code.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (error and state setup)

	// The `analysis` is a pre-run analysis of the code to determine
	// valid JUMPDESTs.
	if in.analysis.jumpdests == nil {
		in.analysis = codeAnalysis{
			jumpdests: contract.validJumpdests(),
		}
	}

	// Main loop dispatching operations
	var (
		op    OpCode        // current opcode
		mem   = NewMemory() // bound memory
		stack = newstack()  // local stack
		// For performance consideration, the stack and memory are created using
		// sync.Pool to reduce garbage collection overhead.
		callContext = &callCtx{
			memory:   mem,
			stack:    stack,
			contract: contract,
		}
	)
	defer func() {
		returnStack(stack)
		returnMemory(mem)
	}()

	// Don't bother with the execution loop if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}
	// ... (tracer setup)

	for {
		// Get next operation from the dispatch table
		op = contract.GetOp(pc)
		operation := &in.jumpTable[op]

		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Execute the operation
		res, err := operation.execute(&pc, in, callContext)

		// ... (tracer and error handling)
	}

}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jumptable.go">
```go
// operation represents an instruction in the EVM.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// gasCost is the static gas cost of the operation
	gasCost gasFunc
	// validateStack validates the stack for the operation
	validateStack stackValidationFunc
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc

	// ... other fields for debugging and control flow
}

// JumpTable contains the EVM opcodes and their corresponding operations.
type JumpTable [256]operation

// The dispatch table for the EVM opcodes, created based on the active fork rules.
// This directly corresponds to the prompt's `ExecutionStrategy.JumpTable`.
func makeJumpTable(rules params.Rules) JumpTable {
	// Note: Constantinople is used as a shorthand for Petersburg because all concrete
	// opcode changes were introduced in Constantinople.
	var jt JumpTable = jumpTableHomestead
	if rules.IsByzantium {
		jt = jumpTableByzantium
	}
	if rules.IsConstantinople {
		jt = jumpTableConstantinople
	}
	if rules.IsIstanbul {
		jt = jumpTableIstanbul
	}
	if rules.IsBerlin {
		jt = jumpTableBerlin
	}
	if rules.IsLondon {
		jt = jumpTableLondon
	}
	if rules.IsShanghai {
		jt = jumpTableShanghai
	}
	if rules.IsCancun {
		jt = jumpTableCancun
	}
	return jt
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a no-reference type for EVM stack operations.
type Stack struct {
	data []uint256.Int
	// Note: consider that this is a slice, not a fixed-size array.
	// The go-ethereum implementation sets a cap and manages length manually.
	// A fixed-size array as proposed in the Zig implementation is a valid and
	// potentially more performant choice.
}

// newstack returns a new stack that can be used in the EVM.
// Stacks are pooled to reduce garbage collection pressure.
func newstack() *Stack {
	return stackPool.Get().(*Stack)
}

// Data returns the underlying uint256.Int array for the stack.
func (st *Stack) Data() []uint256.Int {
	return st.data
}

// push pushes an element to the top of the stack.
func (st *Stack) push(d *uint256.Int) {
	st.data = append(st.data, *d)
}

// Pop pops the top element from the stack and returns it.
func (st *Stack) Pop() (ret uint256.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// Peek returns the top element of the stack without popping it.
func (st *Stack) Peek() *uint256.Int {
	return &st.data[len(st.data)-1]
}

// Back returns the n'th element from the back of the stack without popping it.
func (st *Stack) Back(n int) *uint256.Int {
	return &st.data[len(st.data)-1-n]
}

// Swap swaps the top element with the n'th element from the top of the stack.
func (st *Stack) Swap(n int) {
	st.data[len(st.data)-1], st.data[len(st.data)-1-n] = st.data[len(st.data)-1-n], st.data[len(st.data)-1]
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory_table.go">
```go
// Memory is a simple memory model for the EVM.
// Geth uses a single, highly optimized memory implementation rather than multiple
// swappable types. Its design can serve as a reference for the `Standard` and
// `Optimized` memory types in the prompt.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{store: make([]byte, 0, 1024)}
}

// Set sets offset to value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	// ... (bounds checking and resize logic)
	copy(m.store[offset:offset+size], value)
}

// Set32 sets the 32 bytes starting at offset to value.
func (m *Memory) Set32(offset uint64, val *uint256.Int) {
	// ... (bounds checking and resize logic)
	val.WriteToSlice(m.store[offset:])
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		// In go-ethereum, memory is a byte slice that grows dynamically.
		// A Zig implementation could use a fixed-size array with a growable
		// allocator for a similar effect, or pre-allocate to a max size.
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// Get returns offset + size as a new slice.
func (m *Memory) Get(offset, size int64) (cpy []byte) {
	// ... (logic to get a slice of memory, handling out-of-bounds reads by padding with zeros)
	return
}

// GetPtr returns a slice that points to the memory data.
func (m *Memory) GetPtr(offset, size int64) []byte {
	// ... (logic to get a direct pointer/slice into the memory)
	return m.store[offset : offset+size]
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/tracer.go">
```go
// The EVM tracer interface is the primary mechanism in go-ethereum for instrumenting
// the EVM. Different tracers can be "plugged in" to the EVM to achieve different
// goals, such as debugging, logging, or performance analysis. This is analogous to
// the `InterpreterType` enum in the prompt.

// Tracer is the interface for EVM state logging.
//
// A Tracer has access to the full EVM environment, including the state database,
// and can subscribe to specific events.
type Tracer interface {
	// CaptureStart is called before the EVM execution starts.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	// CaptureState is called for each step of the EVM execution.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	// CaptureFault is called when an error occurs during the execution of an opcode.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	// CaptureEnd is called after the EVM execution terminates.
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)
	// CaptureEnter is called when the EVM enters a new scope (via call, create, etc.).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	// CaptureExit is called when the EVM exits a scope.
	CaptureExit(output []byte, gasUsed uint64, err error)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// StructLogger is an EVM state logger that captures execution traces and
// produces structured logs for each step. This is a perfect reference for the
// `Debug` and `Tracing` interpreter types in the prompt.

// StructLogger is a EVM state logger and implements the Tracer interface
// to be used with the EVM. It's main purpose is to track all call frames
// and return them as a structured list.
//
// StructLogger can be configured to not store all information. By default
// memory, stack and storage are disabled.
type StructLogger struct {
	cfg Config

	storage map[common.Hash]common.Hash
	logs    []*StructLog
	// ... other fields
}

// NewStructLogger returns a new logger that is used to structured trace EVM
// execution.
func NewStructLogger(cfg *Config) *StructLogger {
	// ... (initialization)
}

// CaptureState is called for each step of the EVM execution.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// ... (logic to capture memory, stack, and other state)
	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Memory:     memory,
		Stack:      stack,
		ReturnData: returnData,
		Depth:      depth,
		Err:        err,
	}
	l.logs = append(l.logs, &log)
}

// GetResult returns the structured logs collected during the execution.
func (l *StructLogger) GetResult() (json.RawMessage, error) {
	return json.Marshal(l.logs)
}

// StructLog is emitted for each step of the EVM execution.
type StructLog struct {
	Pc         uint64             `json:"pc"`
	Op         OpCode             `json:"op"`
	Gas        uint64             `json:"gas"`
	GasCost    uint64             `json:"gasCost"`
	Memory     hexutil.Bytes      `json:"memory,omitempty"`
	MemorySize int                `json:"memSize"`
	Stack      []*hexutil.Big     `json:"stack,omitempty"`
	ReturnData hexutil.Bytes      `json:"returnData,omitempty"`
	Storage    map[common.Hash]common.Hash `json:"-"`
	Depth      int                `json:"depth"`
	Err        error              `json:"-"`
	OpName     string             `json:"opName"` // Added for web-viewer
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/registry.go">
```go
// The `metrics` package provides a system for performance profiling that closely
// mirrors the requirements of the prompt's `PerformanceProfiler`.

// A Registry holds references to a set of metrics by name and can iterate
// over them, calling callback functions provided by the user.
type Registry interface {
	// Each calls the given function for each registered metric.
	Each(func(string, interface{}))

	// Get the metric by the given name or nil if none is registered.
	Get(string) interface{}

	// GetOrRegister gets an existing metric or registers the given one.
	GetOrRegister(string, interface{}) interface{}

	// Register the given metric under the given name.
	Register(string, interface{}) error

	// Unregister the metric with the given name.
	Unregister(string)

	// ... other utility methods
}

// StandardRegistry is the standard implementation of a Registry.
type StandardRegistry struct {
	metrics sync.Map
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
// MeterSnapshot is a read-only copy of the meter's internal values.
type MeterSnapshot struct {
	count                          int64
	rate1, rate5, rate15, rateMean float64
}

// Meter counts events to produce exponentially-weighted moving average rates
// at one-, five-, and fifteen-minutes and a mean rate. This is ideal for
// tracking metrics like "instructions per second".
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

<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/histogram.go">
```go
// HistogramSnapshot is a read-only copy of a histogram.
type HistogramSnapshot interface {
	Count() int64
	Max() int64
	Mean() float64
	Min() int64
	Percentile(float64) float64
	// ... other statistical methods
}

// Histogram calculates distribution statistics from a series of int64 values.
// This is useful for tracking distributions of execution times or gas usage.
type Histogram interface {
	Clear()
	Update(int64)
	Snapshot() HistogramSnapshot
}

// StandardHistogram is the standard implementation of a Histogram and uses a
// Sample to bound its memory use.
type StandardHistogram struct {
	sample Sample
}
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt is well-structured and detailed. It describes a very advanced, adaptable EVM interpreter design. The go-ethereum codebase does not contain a direct equivalent to this adaptive system, but it provides excellent, battle-tested reference implementations for the individual components (`StandardStack`, `JumpTable`, etc.) and a robust metrics system that can be used as a model for the `PerformanceProfiler`.

There are no significant errors in the prompt. The proposed architecture is a valid and interesting direction for a high-performance, flexible EVM. The use of Zig-specific features like `union` for component interfaces is appropriate for the target language. The specified components and their configuration options are logical and cover the main areas of EVM optimization and instrumentation.

One minor point of clarification: Geth's `Stack` and `Memory` implementations are already highly optimized. The prompt's distinction between `Standard` and `Optimized` components might, in practice, be less about the core data structure and more about additional layers of functionality (e.g., adding pre-fetching for an "OptimizedStack" or extra validation and logging for a "DebugStack"), which the prompt's specifications seem to correctly imply.

---

An analysis of the `go-ethereum` codebase reveals a highly optimized, but less configurable, interpreter design compared to the system requested in the prompt. Geth's EVM primarily uses a single interpreter implementation that is configured at startup based on the chain's hard fork rules.

However, several components provide excellent context for implementing the proposed system:
- **Interpreter Loop (`interpreter.go`)**: The core execution loop in Geth is a strong foundation for any execution strategy. It shows the fundamental interactions between the program counter, opcodes, stack, and memory.
- **Pluggable Logger (`logger.go`)**: The `EVMLogger` interface is the best example of a component-based design in Geth's EVM. It allows different tracers (e.g., for debugging, profiling) to be attached to the EVM, directly inspiring the `Debug` and `Tracing` interpreter types requested.
- **Jump Table (`jumptable.go`)**: This is a direct implementation of the `JumpTable` execution strategy. The way it's populated based on `params.Rules` (hard fork configuration) provides a model for how different component sets could be selected.
- **Stack & Memory (`stack.go`, `memory.go`)**: Geth's implementations of the stack and memory are highly optimized and serve as a perfect reference for the `Standard` or `Optimized` component types in the prompt. The memory expansion and gas calculation logic is particularly critical for compatibility.
- **EVM and State Transition (`evm.go`, `state_transition.go`)**: These files show how the interpreter is "managed" and what context (state, block parameters) it needs to operate. This provides a model for the `InterpreterTypeManager`'s role in setting up an execution environment.

The following snippets are extracted to provide a solid foundation for building the specified Interpreter Types System.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
```go
// Interpreter is an EVM interpreter for executing contract code.
type Interpreter struct {
	evm *EVM
	cfg Config

	hasher    crypto.KeccakState
	hasherBuf common.Hash

	readOnly   bool   // Whether to throw on state modifying opcodes
	returnData []byte // Last CALL's return data for subsequent reuse
}

// NewInterpreter returns a new interpreter for executing EVM code.
func NewInterpreter(evm *EVM, cfg Config) *Interpreter {
	return &Interpreter{
		evm: evm,
		cfg: cfg,
	}
}

// Run executes the given contract's code with the given input data. It returns the
// return data and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered vm execution errors and therefore should not be checked against the
// interpreter's own error list.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() {
		in.evm.depth--
	}()

	// Make sure the readOnly is only set if we aren't in readOnly yet.
	// This also makes sure that the readOnly flag is accumulated, the literal
	// any sub-call made from a readOnly call is also readOnly.
	if readOnly && !in.readOnly {
		in.readOnly = true
		defer func() { in.readOnly = false }()
	}

	// Reset the previous return value. It's important to do this before
	// starting the execution in order to avoid issues with read-only EVM
	// calls coming from RPC testing which carry over the previous returndata.
	in.returnData = nil

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallCtx()
		// For optimisation, we have a jump table that maps opcodes to their functions.
		opd  = op*OpCode(len(in.evm.jumpTable))
		jt   = in.evm.jumpTable[opd : opd+256]
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the defer
		gasCopy uint64 // for tracer
		logged  bool   // deferred tracer should ignore already logged steps
		res     []byte // result of the opcode execution function
	)
	contract.Input = input

	// Don't trace if we're not configured to per instruction.
	if in.cfg.Tracer != nil && !in.cfg.Tracer.IsTracing() {
		in.cfg.Tracer = nil
	}
	if in.cfg.Tracer != nil {
		defer func() {
			if err != nil {
				if !logged {
					in.cfg.Tracer.CaptureState(in.evm, pcCopy, op, gasCopy, cost, mem, stack, callContext, in.returnData, in.evm.depth, err)
				}
			} else if in.cfg.Debug {
				in.cfg.Tracer.CaptureEnd(ret, err)
			}
		}()
	}

	// The Interpreter main loop. This loop will continue until execution of
	// operations is done either for a STOP, RETURN or REVERT opcode, an error
	// happened during the execution of operations or infinite loop detected.
	for {
		if in.cfg.Tracer != nil {
			// Note that the following message is emitted using the parent's tracer
			// if the call is a C-C-C-Call, but the execution is done using the child's
			// tracer. It's a bit subtle, but this is the requirement.
			logged = false
			pcCopy = pc
			gasCopy = contract.Gas
			in.cfg.Tracer.CaptureState(in.evm, pc, op, gasCopy, cost, mem, stack, callContext, in.returnData, in.evm.depth, err)
			logged = true
		}
		// Get next opcode
		op = contract.GetOp(pc)
		// execute the operation
		cost, res, err = jt[op](pc, in, callContext, mem, stack)

		// If the operation clears the return data, do it.
		// This is not perfectly accurate, in that the EVM may have other
		// ways of affecting the return data (e.g. other calls).
		// For tracing, however, this is good enough.
		if opClearReturnData(op) {
			in.returnData = nil
		}
		// if the gas cost is 0, it means the operation is dynamic, otherwise it's
		// a static gas cost.
		if cost > 0 {
			if !contract.UseGas(cost) {
				return nil, ErrOutOfGas
			}
		}

		if err != nil {
			return nil, err
		}
		pc++

		// When the operation is a call, the result will be the data that is returned
		// from the call. We need to cleared the returnDataBuffer and set it to the
		// new return data.
		if opCall(op) {
			in.returnData = res
			// Don't need to do anything with pc, it's handled by the already called
			// operation.
			continue
		}
		// check if the interpreter is marked as stopped
		if callContext.isDone() {
			return res, nil
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/logger.go">
```go
// EVMLogger is an interface providing hooks for tracing EVM execution.
//
// The EVMLogger is called on each step of the EVM execution cycle and can be used
// to record execution traces for debugging or analysis.
//
// Implementations of EVMLogger can also be used to interrupt execution by returning
// an error from any of its methods.
//
// The default implementation is [EVMLogger], which does nothing. It is used when
// tracing is disabled. For a logger that prints complete execution traces, see
// [StructLogger].
type EVMLogger interface {
	// IsTracing indicates whether this tracer is tracing. This is used by the EVM
	// to avoid constructing expensive arguments for the Capture* methods.
	IsTracing() bool

	// CaptureStart is called once at the beginning of an EVM execution.
	// The gas limit parameter is the final gas limit for the transaction, having
	// taken into account gas refunds.
	CaptureStart(evm *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureEnd is called once at the end of an EVM execution.
	CaptureEnd(output []byte, err error)

	// CaptureState is called on each step of the EVM, either before the opcode is
	// executed (if IsTracing is on) or after (if IsTracing is off).
	CaptureState(evm *EVM, pc uint64, op OpCode, gas, cost uint64, memory *Memory, stack *Stack, callContext *callCtx, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It is not called for valid stoppages such as STOP, RETURN, or valid REVERT.
	CaptureFault(evm *EVM, pc uint64, op OpCode, gas, cost uint64, memory *Memory, stack *Stack, callContext *callCtx, depth int, err error)

	// CaptureEnter is called when the EVM is about to enter a new sub-call, either
	// through CALL, CREATE, or some other variation.
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM is about to exit a sub-call, either through
	// returning or faulting.
	CaptureExit(output []byte, err error)

	// OnGasChange is called whenever the gas counter is changed. This is a best-effort
	// event, and may not be emitted for all gas changes.
	OnGasChange(old, new uint64, reason GasChangeReason)
}

// Config are the configuration options for the Interpreter.
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op code logger
	Tracer EVMLogger
	// NoBaseFee may be used to temporary disable LondonHF rules, allowing for transactions without
	// base fee. This is a temporary flag, and will be removed in the future. It is only meant to
	// be used for debugging.
	NoBaseFee bool
}

// Tracer is a EVM logger that captures execution steps and faults.
// It is used for debugging and tracing.
type Tracer struct {
	cfg logger.Config
	log *logger.StructLogger
	err error

	// OnGasChange is an optional callback that will be invoked whenever the gas
	// counter changes.
	OnGasChange func(old, new uint64, reason GasChangeReason)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/jumptable.go">
```go
// A jumpTable contains the list of valid jump destinations for a given contract.
type jumpTable []bool

// opCode is the plain list of valid opcodes and their corresponding functions.
// This is used when the opCode is not a jump destination.
type opCode struct {
	execute    executionFunc
	constant   bool   // whether the returned gas is constant
	returns    bool   // whether the operation returns data on account of StopExecution
	valid      bool   // whether the opcode is valid
	dynamic    bool   // whether the opcode has dynamic gas
	jumps      bool   // whether the opcode is a jump
	writes     bool   // whether the opcode writes to state
	reverts    bool   // whether the opcode reverts state
	returnsGas bool   // whether the gas is returned instead of consumed
	tier       gasTier
}

var (
	opCodeList [256]opCode
	// Gas Tiers
	gasTierZero   = new(gasTier)
	gasTierBase   = new(gasTier)
	gasTierVer...
)

// newEVMCopy returns a copy of the EVM for the current scope.
// The returned EVM is not safe for concurrent use.
func (evm *EVM) newEVMCopy() *EVM {
	// ...
}

// newJumpTable returns a new jump table for the given EVM configuration.
func newJumpTable(rules params.Rules) (jt [256]executionFunc) {
	// ... (opcode definitions)
	for i, op := range opCodeList {
		// Only implement the valid opcodes
		if !op.valid {
			jt[i] = opInvalid
			continue
		}
		// Set the jumptable for the given opcode
		jt[i] = op.execute
	}
	// ... (hardfork specific overrides)
	if rules.IsShanghai {
		jt[PUSH0] = opPush0
	}
	if rules.IsCancun {
		jt[TLOAD] = opTload
		jt[TSTORE] = opTstore
		jt[MCOPY] = opMcopy
		jt[BLOBHASH] = opBlobHash
		jt[BLOBBASEFEE] = opBlobBaseFee
	}
	return
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/stack.go">
```go
// Stack is a last-in-first-out stack for the EVM.
type Stack struct {
	data []*uint256.Int
}

// newstack returns a new stack with the default size.
func newstack() *Stack {
	return &Stack{data: make([]*uint256.Int, 0, 16)}
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []*uint256.Int {
	return st.data
}

// push pushes an element to the top of the stack.
func (st *Stack) push(d *uint256.Int) {
	st.data = append(st.data, d)
}

// pop pops the top element from the stack and returns it.
func (st *Stack) pop() (ret *uint256.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// len returns the number of elements in the stack.
func (st *Stack) len() int {
	return len(st.data)
}

// swap swaps the top element with the n-th element from the top.
func (st *Stack) swap(n int) {
	st.data[st.len()-1], st.data[st.len()-n-1] = st.data[st.len()-n-1], st.data[st.len()-1]
}

// dup duplicates the n-th element from the top of the stack and pushes it on top.
func (st *Stack) dup(n int) {
	st.push(st.data[st.len()-n])
}

// peek returns the n-th element from the top of the stack without removing it.
func (st *Stack) peek(n int) *uint256.Int {
	return st.data[st.len()-1-n]
}

// require ensures that the stack has at least n elements.
func (st *Stack) require(n int) error {
	if st.len() < n {
		return fmt.Errorf("stack underflow (%d < %d)", st.len(), n)
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/memory.go">
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
	// It's possible the offset is greater than the size of the memory. In that case
	// we need to resize the memory to allow for the writing of the value.
	if offset+size > uint64(len(m.store)) {
		m.resize(offset + size)
	}
	copy(m.store[offset:offset+size], value)
}

// Resize resizes the memory to the given size.
func (m *Memory) Resize(size uint64) {
	m.resize(size)
}

// Get returns a slice of memory.
func (m *Memory) Get(offset, size uint64) (cpy []byte) {
	if size == 0 {
		return nil
	}
	if offset+size > uint64(len(m.store)) {
		m.resize(offset + size)
	}
	return common.CopyBytes(m.store[offset : offset+size])
}

// GetPtr returns a slice of memory.
//
// GetPtr will return the underlying slice of the memory, which is not protected
// from modification. It's up to the caller to ensure that the returned slice
// is not modified.
func (m *Memory) GetPtr(offset, size uint64) []byte {
	if size == 0 {
		return nil
	}
	if offset+size > uint64(len(m.store)) {
		m.resize(offset + size)
	}
	return m.store[offset : offset+size]
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}

// Data returns the underlying slice of the memory.
func (m *Memory) Data() []byte {
	return m.store
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/gas.go">
```go
// gas various gas costs.
const (
	GasQuickStep   uint64 = 2
	GasFastestStep uint64 = 3
	GasFastStep    uint64 = 5
	GasMidStep     uint64 = 8
	GasSlowStep    uint64 = 10
	GasExtStep     uint64 = 20
)

// memoryGasCost calculates the gas cost for memory expansion.
func memoryGasCost(mem *Memory, newMemSize uint64) (uint64, error) {
	if newMemSize == 0 {
		return 0, nil
	}
	// The maximum newMemSize is bound by the offset + size of the arguments,
	// which is 2*256 bit, thus cannot overflow uint64.
	// We need to include the possibility of memory size uint64 wrapping-around,
	// in which case we might allocated a very small amount of memory and cross
	// the uint64 boundary and get a very large new size.
	if newMemSize > uint64(mem.Len()) {
		// Calculate the gas cost for the new memory size.
		newWords := (newMemSize + 31) / 32
		newCost, overflow := calcMemGas(newWords)
		if overflow {
			return 0, ErrGasUintOverflow
		}
		// In case of a new allocation, the old memory cost is calculated
		// and subtracted from the new cost. The last gas cost is stored
		// in the Memory object.
		oldCost := mem.lastGasCost
		mem.lastGasCost = newCost

		return newCost - oldCost, nil
	}
	return 0, nil
}

// calcMemGas calculates the gas cost of memory size in words.
func calcMemGas(newMemSizeInWords uint64) (uint64, bool) {
	// memory gas = (mem_size_word ** 2) / 512 + 3 * mem_size_word
	// This is the same as C^2/512 + 3C, where C is number of words.
	// Let's do the C^2 calculation first.
	square := newMemSizeInWords * newMemSizeInWords
	// Then the C^2/512
	cost := square / 512
	// And finally 3*C.
	linCost, overflow := math.SafeMul(newMemSizeInWords, 3)
	if overflow {
		return 0, true
	}
	// Add them together.
	// The addition can't overflow, because the square-part is at most
	// (2^64-1)^2/512 = 2^128/512 = 2^119
	// and the linear part is at most 3*(2^64-1), which is ~2^66.
	// So the total is far from 2^64.
	return cost + linCost, false
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state_transition.go">
```go
// stateTransition represents a state transition.
type stateTransition struct {
	gp           *GasPool
	msg          *Message
	gasRemaining uint64
	initialGas   uint64
	state        vm.StateDB
	evm          *vm.EVM
}

// ApplyMessage computes the new state by applying the given message
// against the old state within the environment.
//
// ApplyMessage returns the bytes returned by any EVM execution (if it took place),
// the gas used (which includes gas refunds) and an error if it failed. An error always
// indicates a core error meaning that the message would always fail for that particular
// state and would never be accepted within a block.
func ApplyMessage(evm *vm.EVM, msg *Message, gp *GasPool) (*ExecutionResult, error) {
	evm.SetTxContext(NewEVMTxContext(msg))
	return newStateTransition(evm, msg, gp).execute()
}

// execute will transition the state by applying the current message and
// returning the evm execution result with following fields.
func (st *stateTransition) execute() (*ExecutionResult, error) {
	// ... (pre-check and gas buying logic) ...

	var (
		msg              = st.msg
		rules            = st.evm.ChainConfig().Rules(st.evm.Context.BlockNumber, st.evm.Context.Random != nil, st.evm.Context.Time)
		contractCreation = msg.To == nil
		floorDataGas     uint64
	)

	// ... (intrinsic gas calculation) ...

	// ... (state preparation logic) ...
	st.state.Prepare(rules, msg.From, st.evm.Context.Coinbase, msg.To, vm.ActivePrecompiles(rules), msg.AccessList)

	var (
		ret   []byte
		vmerr error // vm errors do not effect consensus and are therefore not assigned to err
	)
	if contractCreation {
		ret, _, st.gasRemaining, vmerr = st.evm.Create(msg.From, msg.Data, st.gasRemaining, value)
	} else {
		// Increment the nonce for the next transaction.
		st.state.SetNonce(msg.From, st.state.GetNonce(msg.From)+1, tracing.NonceChangeEoACall)
		// ... (EIP-7702 authorization logic) ...
		ret, st.gasRemaining, vmerr = st.evm.Call(msg.From, st.to(), msg.Data, st.gasRemaining, value)
	}

	// ... (refund and fee logic) ...

	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		MaxUsedGas: peakGasUsed,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required
// computation settings and executing the state transition..
type EVM struct {
	// Context provides auxiliary information for the current call frame
	Context
	// StateDB gives access to the underlying state
	StateDB StateDB
	// Depth is the current call stack
	depth int
	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig
	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules
	// vmConfig contains configuration for the EVM
	Config Config
	// interpreter is the contract interpreter
	interpreter *Interpreter
	// GasPool tracks the gas available for the current call.
	GasPool *core.GasPool
	// AccessEvents contains the accounts and storage slots touched during execution
	AccessEvents *accesslist.Events
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(blockCtx Context, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		Context:      blockCtx,
		StateDB:      statedb,
		chainConfig:  chainConfig,
		chainRules:   chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time),
		Config:       vmConfig,
		AccessEvents: accesslist.NewEvents(),
	}
	evm.interpreter = NewInterpreter(evm, vmConfig)
	return evm
}

// Call executes the contract associated with the destination address. It is a
// convenience wrapper around executing a message.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to execute above the carry gas limit of 63/64ths
	if gas < callGasTemp {
		return nil, gas, fmt.Errorf("%w: have %d, want %d", ErrOutOfGas, gas, callGasTemp)
	}
	// Fail if we're trying to transfer more than the available balance
	if !value.IsZero() {
		evm.StateDB.AddAddressToAccessList(caller.Address())
		evm.StateDB.AddAddressToAccessList(addr)
	}
	snapshot := evm.StateDB.Snapshot()

	if !evm.StateDB.Exist(addr) {
		precompiles := ActivePrecompiles(evm.chainRules)
		if precompiles.Address(addr) {
			// Special case for call to precompiled contract.
			// The gas cost is based on the input size and the specific precompile.
			// Add the call to the journal so it can be reverted if there is an error.
			evm.journal.append(callPrecompileChange{
				caller: caller.Address(),
				addr:   addr,
				value:  new(uint256.Int).Set(value),
				gas:    gas,
			})
			return runPrecompiledContract(precompiles.Precompile(addr), input, gas)
		}
	}
	// Transfer value from caller to called account
	if !value.IsZero() {
		if err := transfer(evm.StateDB, caller.Address(), addr, value); err != nil {
			evm.StateDB.RevertToSnapshot(snapshot)
			return nil, gas, err
		}
	}
	// Initialise a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	code := evm.StateDB.GetCode(addr)
	if len(code) == 0 {
		ret, leftOverGas = nil, gas-callGasTemp
	} else {
		contract := NewContract(caller, AccountRef(addr), value, gas-callGasTemp)
		contract.SetCode(&addr, code, evm.StateDB.GetCodeHash(addr))
		ret, err = evm.interpreter.Run(contract, input, false)
		leftOverGas = contract.Gas
	}
	// When the execution finishes, the gas is returned to the starting account and
	// the snapshot is reverted in case of an error.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			// In case of a reversion, we also need to add the gas
			// to the gas pool.
			gas += leftOverGas
		}
	}
	return ret, gas, err
}

// Create creates a new contract using the EVM.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if !value.IsZero() {
		// We are creating a new account, need to add both sender and receiver to access list
		// in order to avoid the penalty.
		evm.StateDB.AddAddressToAccessList(caller.Address())
	}
	// Ensure there's no existing contract already at the designated address
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1, NonceChangeCreate)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	// Add the new account to the access-list, since EIP-2929.
	evm.StateDB.AddAddressToAccessList(contractAddr)

	contractHash := evm.StateDB.GetCodeHash(contractAddr)
	if evm.StateDB.GetNonce(contractAddr) != 0 || (contractHash != (common.Hash{}) && contractHash != emptyCodeHash) {
		return nil, common.Address{}, 0, ErrContractAddressCollision
	}
	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr)
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1, NonceChangeCreate)
	}
	// Transfer value from caller to called account
	if err := transfer(evm.StateDB, caller.Address(), contractAddr, value); err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		return nil, common.Address{}, gas, err
	}
	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution context
	// only.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCallCode(&contractAddr, code, nil)

	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(CREATE, caller.Address(), contractAddr, code, gas, value.ToBig())
	}
	ret, err = evm.interpreter.Run(contract, nil, false)

	// Check whether the max code size has been exceeded, assign err if the
	// size is larger than the limit.
	if err == nil && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}
	// If the contract creation ran successfully and the contract code was returned,
	// set the code for the contract.
	if err == nil {
		createDataGas := uint64(len(ret)) * params.CreateDataGas
		if contract.UseGas(createDataGas) {
			evm.StateDB.SetCode(contractAddr, ret)
		} else {
			err = ErrCodeStoreOutOfGas
		}
	}
	// When the execution finishes, the gas is returned to the starting account and
	// the snapshot is reverted in case of an error.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			// In case of a reversion, we also need to add the gas
			// to the gas pool.
			contract.Gas += gas
		}
	}
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureExit(ret, err)
	}
	return ret, contractAddr, contract.Gas, err
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Interpreter is a state object for go-ethereum's EVM implementation.
type Interpreter struct {
	// The read-only contract calling this EVM context. This is needed for anything
	// that needs to access call specific information (e.g. sender, value)
	callCtx *callCtx

	// EVM is the environment that the interpreter runs in.
	evm *EVM

	// Config are the configuration options for the EVM.
	cfg Config

	// gasPool contains the gas available for the current execution.
	gasPool *GasPool

	// ReadOnly makes the state modifications to be disallowed.
	readOnly bool
}

// Config are the configuration options for the Interpreter.
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op code logger
	Tracer EVMLogger
	// NoBaseFee forces the EIP-1559 base fee to be ignored
	NoBaseFee bool
	// EnablePreimageRecording switches on DAG pre-image recording
	EnablePreimageRecording bool
	// JumpTable contains the EVM instruction table.
	// If nil, the EVM default jump table will be used.
	JumpTable *JumpTable
	// EWASMInterpreter is the interpreter used for EWASM transactions.
	EWASMInterpreter string
	// EIP1352Disabler is the config setting which when committing a block will disable
	// the EIP-1352 rules previously applied to the block.
	EIP1352Disabler *uint64
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (initialization code) ...

	// Grab the EVM execution rules for the current block
	rules := in.evm.chainRules

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = &callCtx{
			memory:   mem,
			stack:    stack,
			contract: contract,
		}
		// For optimisation, reference the jump table directly
		jt = in.cfg.JumpTable
	)
	// ... (tracer initialization) ...

	// The Interpreter main loop. This loop will continue until execution ends
	// with STOP, RETURN, REVERT or an error.
	for {
		// ... (tracer hooks) ...

		// Get the next op code from the contract context
		op = contract.GetOp(pc)
		operation := jt[op]
		if operation == nil {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Execute the operation
		res, err := operation.execute(&pc, in, callContext)
		if err != nil {
			return nil, err
		}
		// ... (gas handling) ...

		switch {
		case operation.returns:
			// Operations with returns are HALT instructions, so we stop.
			return res, nil
		case operation.reverts:
			return res, ErrExecutionReverted
		case operation.jumps:
			// Don't increment PC for jumps
		default:
			pc++
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// EVMLogger is used to collect execution traces from an EVM transaction
// execution. The EVM-calling code makes real-time decisions based on the
// collected information.
//
// Note, the interface is stateful.
// The EVM implementations will not re-use the same EVMLogger instance.
type EVMLogger interface {
	// CaptureStart is called when an EVM begins executing. This can be
	// executed more than once per call frame, if the child EVM is running
	// in a separate go-routine.
	CaptureStart(evm *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureState is called for each step of the EVM OP-code execution.
	// It is called just before the actual execution of an OP-code.
	//
	// Note that opcodes returning errors are not captured, as any errors are
	// considered exceptional and roll back the state to the last valid state.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an
	// OP-code. It is called when the error is returned from the OP-code itself,
	// rather than from the EVM before executing the OP-code.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnd is called when an EVM finishes executing. This can be
	// executed more than once per call frame, if the child EVM is running
	// in a separate go-routine.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureEnter is called when this EVM calls a new account, i.e. via
	// CALL, CALLCODE, DELEGATECALL, CREATE, CREATE2.
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when this EVM returns from a sub-call.
	CaptureExit(output []byte, gasUsed uint64, err error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a contract's computational stack.
type Stack struct {
	data []*big.Int
}

// newstack returns a new stack with the default 1024 slots pre-allocated.
func newstack() *Stack {
	return &Stack{data: make([]*big.Int, 0, 1024)}
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []*big.Int {
	return st.data
}

// push pushes a new element to the stack.
func (st *Stack) push(d *big.Int) {
	st.data = append(st.data, d)
}

// pop pops the last-pushed element from the stack.
func (st *Stack) pop() (ret *big.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// Len returns the number of elements in the stack.
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
func (st *Stack) peek() *big.Int {
	return st.data[st.len()-1]
}

// Back returns the n-th element from the top of the stack without removing it.
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
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents a contract's memory.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset + size to value. If value is larger than size, the
// last size bytes are used.
func (m *Memory) Set(offset, size uint64, value []byte) {
	// ... (implementation) ...
}

// Set32 sets the 32 bytes starting at offset to value.
func (m *Memory) Set32(offset uint64, value *big.Int) {
	// ... (implementation) ...
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = common.Extend(m.store, int(size-uint64(len(m.store))))
	}
}

// Get returns offset + size as a new slice.
func (m *Memory) Get(offset, size int64) (cpy []byte) {
	// ... (implementation) ...
}

// GetPtr returns a slice that references the memory.
func (m *Memory) GetPtr(offset, size int64) []byte {
	// ... (implementation) ...
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}

// Data returns the contents of the memory as a byte slice.
func (m *Memory) Data() []byte {
	return m.store
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jumptable.go">
```go
// JumpTable is a jump table for the EVM functions.
type JumpTable [256]*operation

// newJumpTable returns a new initialized jump table.
func newJumpTable(rules *params.Rules) *JumpTable {
	// The dispatch table for the EVM opcodes
	var jt = JumpTable{
		STOP: {
			execute:     opStop,
			gasCost:     constGas(0),
			validate:    stackValidation(0, 0),
			returns:     true,
			halts:       true,
			valid:       true,
			writes:      false,
			ripemd:      false,
			data:        false,
			precompiled: false,
		},
		ADD: {
			execute:     opAdd,
			gasCost:     constGas(params.GasFastestStep),
			validate:    stackValidation(2, 1),
			valid:       true,
			writes:      false,
			ripemd:      false,
			data:        false,
			precompiled: false,
		},
		// ... more opcodes ...
	}
	// Post-Constantinople opcodes
	if rules.IsConstantinople {
		jt[SHL] = &operation{
			// ...
		}
		// ...
	}
	// Post-Istanbul opcodes
	if rules.IsIstanbul {
		jt[CHAINID] = &operation{
			// ...
		}
		// ...
	}
	// Post-Berlin opcodes
	if rules.IsBerlin {
		// ...
	}
	// Post-London opcodes
	if rules.IsLondon {
		jt[BASEFEE] = &operation{
			// ...
		}
	}
	// Post-Shanghai opcodes
	if rules.IsShanghai {
		jt[PUSH0] = &operation{
			// ...
		}
	}
	// Post-Cancun opcodes
	if rules.IsCancun {
		jt[TLOAD] = &operation{
			// ...
		}
		// ...
	}
	return &jt
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object and provides
// the necessary tools to run a contract on a given state with
// a given context. It should be noted that the EVM is not thread safe.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// chainRules are the consensus parameters for the current chain
	chainRules params.Rules

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// virtual machine configuration options used to initialise the
	// evm.
	vmConfig Config

	// interpreter is the contract interpreter.
	interpreter *Interpreter

	// callGasTemp is a temporary variable to store the gas of a call to be available
	// for a later call if the keeper has been drained of all gas.
	callGasTemp uint64
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		Context:     blockCtx,
		StateDB:     statedb,
		chainConfig: chainConfig,
		vmConfig:    vmConfig,
	}

	evm.interpreter = NewInterpreter(evm, vmConfig)
	return evm
}

// Interpreter returns the EVM interpreter.
func (evm *EVM) Interpreter() *Interpreter {
	return evm.interpreter
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether an uncle can be produced on the DAO fork block

	// EIP150 implements the Gas price changes for IO-heavy operations.
	// EIP-150 HF block (nil = no fork)
	EIP150Block *big.Int `json:"eip150Block,omitempty"`
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"` // EIP150 HF hash (needed for header only clients as only gas pricing changed)

	// EIP155 implements replay-protected transaction signatures.
	// EIP-155 HF block
	EIP155Block *big.Int `json:"eip155Block,omitempty"`

	// EIP158 implements state clearing (https://github.com/ethereum/EIPs/issues/158).
	// EIP-158 HF block
	EIP158Block *big.Int `json:"eip158Block,omitempty"`

	// Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ByzantiumBlock *big.Int `json:"byzantiumBlock,omitempty"`

	// Constantinople switch block (nil = no fork, 0 = already activated)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`

	// Petersburg switch block (nil = no fork, 0 = already activated)
	PetersburgBlock *big.Int `json:"petersburgBlock,omitempty"`

	// Istanbul switch block (nil = no fork, 0 = already on istanbul)
	IstanbulBlock *big.Int `json:"istanbulBlock,omitempty"`

	// Muir Glacier switch block (nil = no fork, 0 = already on muirglacier)
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`

	// Berlin switch block (nil = no fork, 0 = already on berlin)
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`

	// London switch block (nil = no fork, 0 = already on london)
	LondonBlock *big.Int `json:"londonBlock,omitempty"`

	// Arrow Glacier switch block (nil = no fork, 0 = already on arrowglacier)
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`

	// Gray Glacier switch block (nil = no fork, 0 = already on grayglacier)
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`

	// MergeNetsplit switch block (nil = no fork, 0 = already on merge netsplit)
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// TerminalTotalDifficulty is the total difficulty for the merge fork..
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag specifying that the network has passed the TTD.
	// It is needed to make the rule IsTTD check effective.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Shanghai switch time (nil = no fork, 0 = already on shanghai)
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// Cancun switch time (nil = no fork, 0 = already on cancun)
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// Prague switch time (nil = no fork, 0 = already on prague)
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// FutureEIPS switch time (nil = no fork, 0 = already on future EIPs)
	FutureEipsTime *uint64 `json:"futureEipsTime,omitempty"`

	// Engine is the consensus engine configuration.
	Engine any `json:"engine"`
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
```go
// StateProcessor is a basic Processor, which takes care of transitioning
// state from one point to another.
//
// StateProcessor implements Processor.
type StateProcessor struct {
	config *params.ChainConfig // Chain configuration options
	bc     *BlockChain         // Canonical block chain
	engine consensus.Engine    // Consensus engine
}

// NewStateProcessor initialises a new state processor.
func NewStateProcessor(config *params.ChainConfig, bc *BlockChain, engine consensus.Engine) *StateProcessor {
	return &StateProcessor{
		config: config,
		bc:     bc,
		engine: engine,
	}
}

// Process processes the state changes according to the Ethereum rules by running
// the transaction messages using the statedb and applying any rewards to both
// the processor (coinbase) and any included uncles.
//
// Process returns the receipts and logs accumulated during the process and
// returns the amount of gas that was used in the process. If any of the
// transactions failed to execute due to insufficient gas it will return an error.
func (p *StateProcessor) Process(block *types.Block, statedb *state.StateDB, cfg vm.Config) (*ProcessResult, error) {
	var (
		receipts types.Receipts
		usedGas  = new(uint64)
		header   = block.Header()
		allLogs  []*types.Log
		gp       = new(GasPool).AddGas(header.GasLimit)
	)
	// Iterate over and process the individual transactions
	for i, tx := range block.Transactions() {
		statedb.SetTxContext(tx.Hash(), i)
		receipt, err := applyTransaction(p.config, p.bc, nil, gp, statedb, header, tx, usedGas, cfg)
		if err != nil {
			return nil, err
		}
		receipts = append(receipts, receipt)
		allLogs = append(allLogs, receipt.Logs...)
	}
	// Finalize the block, applying any consensus engine specific extras (e.g. block rewards)
	accumulateRewards(p.config, statedb, header, block.Uncles())

	return &ProcessResult{
		Receipts: receipts,
		Logs:     allLogs,
		GasUsed:  *usedGas,
	}, nil
}
```
</file>
</go-ethereum>
<prompt-corrections>
The original prompt is very well-structured and detailed, outlining an ambitious but coherent design for a highly modular EVM interpreter. There are no direct corrections needed, as it describes a desired future state rather than attempting to replicate an existing implementation.

However, it's worth noting the following for context:
1.  **Complexity**: The proposed system is significantly more complex than existing production EVMs like go-ethereum's. The dynamic selection and adaptive switching of core components like the stack and memory manager introduce considerable overhead and complexity. While powerful, this may be an over-optimization unless the performance benefits for specific use-cases are substantial.
2.  **Go-Ethereum's Approach**: Go-ethereum achieves different "modes" (like `Debug`, `Tracing`) not by swapping out core components, but by attaching a `Tracer` (also known as `EVMLogger`) to the interpreter via its `Config`. This is a less invasive and more common approach to instrumenting a VM. The `Tracer` receives hooks/callbacks at each step of the execution, allowing it to record detailed information without changing the core execution logic. This is a pattern worth considering as a potentially simpler alternative to some of the proposed `InterpreterType` variants.
3.  **Configuration Scope**: In go-ethereum, the primary configuration mechanism is the `ChainConfig`, which defines the active hardfork and its associated rules. This determines which `JumpTable` is used and how opcodes behave. The proposed `InterpreterConfig` is much more granular, allowing for fine-tuning beyond what hardfork rules specify. This is a key difference in design philosophy.

These points are not corrections but rather contextual notes that might help refine the implementation strategy by contrasting it with a mature, battle-tested EVM. The prompt's design is innovative and could lead to a highly optimized, special-purpose EVM if implemented successfully.

---

This is an excellent and well-thought-out prompt. The concept of a highly configurable and adaptive EVM interpreter is powerful. While go-ethereum doesn't implement this exact component-swapping architecture at runtime, it uses several key patterns to achieve similar goals (e.g., debugging, performance, hardfork compatibility) that will be highly relevant.

Here are the most relevant code snippets from go-ethereum to provide context for your implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
The `EVM` struct is the primary entry point for execution. Its `Config` field is crucial, as it holds the `Tracer`, which is how go-ethereum injects debugging and tracing logic into the execution loop without changing the core interpreter. This is directly analogous to your `Debug` or `Tracing` interpreter types.

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
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
The `EVMInterpreter` and its `Run` method contain the main execution loop. Notice the checks for `in.evm.Config.Tracer != nil`. This is how different behaviors are injected. You can adapt this pattern to switch between your standard, debug, and tracing components based on the `InterpreterConfig`. Instead of `if` statements, you could have function pointers or interface methods that point to the currently selected component's implementation.

```go
// Config are the configuration options for the Interpreter
type Config struct {
	Tracer                  *tracing.Hooks
	NoBaseFee               bool  // Forces the EIP-1559 baseFee to 0 (needed for 0 price calls)
	EnablePreimageRecording bool  // Enables recording of SHA3/keccak preimages
	ExtraEips               []int // Additional EIPS that are to be enabled

	StatelessSelfValidation bool // Generate execution witnesses and self-check against them (testing purpose)
}

// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm   *EVM
	table *JumpTable

	hasher    crypto.KeccakState // Keccak256 hasher instance shared across opcodes
	hasherBuf common.Hash        // Keccak256 hasher result array shared across opcodes

	readOnly   bool   // Whether to throw on stateful modifications
	returnData []byte // Last CALL's return data for subsequent reuse
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (depth checks, readOnly setup, etc.) ...

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
		// ... (pc, cost, etc.) ...
		debug   = in.evm.Config.Tracer != nil
	)
    // ...
	// The Interpreter main run loop
	for {
		if debug {
			// Capture pre-execution values for tracing.
			logged, pcCopy, gasCopy = false, pc, contract.Gas
		}
        // ... (opcode fetch, stack validation, gas calculation) ...
		if debug {
			if in.evm.Config.Tracer.OnGasChange != nil {
				in.evm.Config.Tracer.OnGasChange(gasCopy, gasCopy-cost, tracing.GasChangeCallOpCode)
			}
			if in.evm.Config.Tracer.OnOpcode != nil {
				in.evm.Config.Tracer.OnOpcode(pc, byte(op), gasCopy, cost, callContext, in.returnData, in.evm.depth, VMErrorFromErr(err))
				logged = true
			}
		}

		// execute the operation
		res, err = operation.execute(&pc, in, callContext)
        // ... (error handling, pc increment) ...
	}
    // ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
Go-ethereum's `JumpTable` is a direct parallel to your `ExecutionStrategy` concept. It's an array of `operation` structs, where each struct contains a function pointer (`execute`) for the opcode's logic. Different jump tables are created for different hardforks, effectively changing the execution strategy based on the chain's state. This is a form of compile-time configuration that you can adapt for runtime selection.

```go
// JumpTable contains the EVM opcodes supported at a given fork.
type JumpTable [256]*operation

type operation struct {
	// execute is the operation function
	execute     executionFunc
	constantGas uint64
	dynamicGas  gasFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max length the stack can have for this operation
	// to not overflow the stack.
	maxStack int

	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc

	// undefined denotes if the instruction is not officially defined in the jump table
	undefined bool
}

// ... pre-generated instruction sets for different forks
var (
	frontierInstructionSet         = newFrontierInstructionSet()
	homesteadInstructionSet        = newHomesteadInstructionSet()
    // ...
	shanghaiInstructionSet         = newShanghaiInstructionSet()
	cancunInstructionSet           = newCancunInstructionSet()
)

// newCancunInstructionSet returns the frontier, homestead, byzantium,
// constantinople, istanbul, petersburg, berlin, london, merge, shanghai
// and cancun instructions.
func newCancunInstructionSet() JumpTable {
	instructionSet := newShanghaiInstructionSet()
	enable4844(&instructionSet) // EIP-4844 (BLOBHASH opcode)
	enable7516(&instructionSet) // EIP-7516 (BLOBBASEFEE opcode)
	enable1153(&instructionSet) // EIP-1153 "Transient Storage"
	enable5656(&instructionSet) // EIP-5656 (MCOPY opcode)
	enable6780(&instructionSet) // EIP-6780 SELFDESTRUCT only in same transaction
	return validate(instructionSet)
}

// ... other new*InstructionSet functions ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
The precompiled contract system in go-ethereum is a good reference for a `ComponentRegistry`. A map of addresses to `PrecompiledContract` interface implementations is maintained, and different maps are activated based on the hardfork rules. This is very similar to your idea of registering different component implementations (stack, memory, etc.) and selecting them based on a configuration.

```go
// PrecompiledContract is the basic interface for native Go contracts.
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

// ... other precompiled contract sets for different forks ...

// PrecompiledContractsCancun contains the default set of pre-compiled Ethereum
// contracts used in the Cancun release.
var PrecompiledContractsCancun = PrecompiledContracts{
	common.BytesToAddress([]byte{0x1}): &ecrecover{},
	common.BytesToAddress([]byte{0x2}): &sha256hash{},
	// ...
	common.BytesToAddress([]byte{0x9}): &blake2F{},
	common.BytesToAddress([]byte{0xa}): &kzgPointEvaluation{},
}

func activePrecompiledContracts(rules params.Rules) PrecompiledContracts {
	switch {
	// ...
	case rules.IsCancun:
		return PrecompiledContractsCancun
	case rules.IsShanghai:
		return PrecompiledContractsBerlin // Shanghai reuses Berlin contracts
	// ...
	default:
		return PrecompiledContractsHomestead
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
This is the standard `Stack` implementation in go-ethereum. It's a good reference for your `Standard` and `Optimized` stack types. It uses a backing slice and a pool to reuse stack objects, which is a key performance optimization.

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

func (st *Stack) len() int {
	return len(st.data)
}
// ... and other stack operations (swap, dup, peek)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
This is go-ethereum's implementation of the EVM's linear, volatile memory, corresponding to your `MemoryType`. It handles dynamic resizing and has an associated gas cost calculation. Note the use of a `sync.Pool` for optimization, which is relevant for your `Optimized` or `Pooled` memory types.

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

// Set sets offset + size to value
func (m *Memory) Set(offset, size uint64, value []byte) {
    // ...
	copy(m.store[offset:offset+size], value)
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
	return m.store[offset : offset+size]
}

// Len returns the length of the backing slice
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
The journaling system in `StateDB` is an excellent reference for how to implement revertible operations, which is a core feature of the EVM. Your `Debug` stack/memory types could use a similar pattern to log operations for later inspection. The journal tracks every state change and can revert them to a specific snapshot ID.

```go
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

// ... specific journal entry types (createObjectChange, balanceChange, etc.) ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/metrics.go">
This file shows the kind of metrics go-ethereum collects for state operations. These metrics could serve as the input for your `PerformanceProfiler` and `TypeSelector` to make adaptive decisions. For example, a high number of `storageReadMeters` or `accountReadMeters` might suggest switching to a configuration optimized for read performance.

```go
var (
	accountReadMeters        = metrics.NewRegisteredMeter("state/read/account", nil)
	storageReadMeters        = metrics.NewRegisteredMeter("state/read/storage", nil)
	accountUpdatedMeter      = metrics.NewRegisteredMeter("state/update/account", nil)
	storageUpdatedMeter      = metrics.NewRegisteredMeter("state/update/storage", nil)
	accountDeletedMeter      = metrics.NewRegisteredMeter("state/delete/account", nil)
	storageDeletedMeter      = metrics.NewRegisteredMeter("state/delete/storage", nil)
	accountTrieUpdatedMeter  = metrics.NewRegisteredMeter("state/update/accountnodes", nil)
	storageTriesUpdatedMeter = metrics.NewRegisteredMeter("state/update/storagenodes", nil)
	accountTrieDeletedMeter  = metrics.NewRegisteredMeter("state/delete/accountnodes", nil)
	storageTriesDeletedMeter = metrics.NewRegisteredMeter("state/delete/storagenodes", nil)
)
```
</file>

## Prompt Corrections
The provided prompt is very well-structured and detailed. It presents an advanced, abstract design. My only suggestion would be to clarify the distinction between the EVM's linear, volatile memory (what `MSTORE`, `MLOAD` operate on, implemented in `core/vm/memory.go`) and the persistent world state (accounts, nonces, storage slots, implemented in `core/state/statedb.go`).

The `MemoryType` enum in your prompt seems to refer to the linear memory. The concept of a `CopyOnWrite` or `Pooled` memory manager could apply there. However, concepts like a `Debug` memory manager with change tracking are more analogous to how `StateDB` uses a `journal` to track changes to the world state. Your implementation will benefit from clearly separating these two types of memory.

I have updated the provided context to include relevant Zig code snippets from the current Tevm codebase. This will help you better integrate the new interpreter type system.

### Our Current Zig EVM Implementation
<src/evm/run_result.zig>
<src/evm/transaction/index.zig>
<src/evm/transaction/blob_transaction.zig>
<src/evm/create_result.zig>
<src/evm/jump_table/operation_config.zig>
<src/evm/jump_table/jump_table.zig>
<src/evm/contract/bitvec.zig>
<src/evm/contract/eip_7702_bytecode.zig>
<src/evm/contract/storage_pool.zig>
<src/evm/contract/contract.zig>
<src/evm/contract/code_analysis.zig>
<src/evm/memory_size.zig>
<src/evm/wasm_stubs.zig>
<src/evm/precompiles/kzg_point_evaluation.zig>
<src/evm/precompiles/precompile_addresses.zig>
<src/evm/precompiles/precompiles.zig>
<src/evm/precompiles/precompile_result.zig>
<src/evm/precompiles/precompile_gas.zig>
<src/evm/precompiles/identity.zig>
<src/evm/constants/memory_limits.zig>
<src/evm/constants/constants.zig>
<src/evm/constants/gas_constants.zig>
<src/evm/fee_market.zig>
<src/evm/state/evm_log.zig>
<src/evm/state/memory_database.zig>
<src/evm/state/database_factory.zig>
<src/evm/state/database_interface.zig>
<src/evm/state/storage_key.zig>
<src/evm/state/state.zig>
<src/evm/state/journal.zig>
<src/evm/vm.zig>
<src/evm/return_data.zig>
<src/evm/frame.zig>
<src/evm/execution/comparison.zig>
<src/evm/execution/system.zig>
<src/evm/execution/execution_result.zig>
<src/evm/execution/arithmetic.zig>
<src/evm/execution/control.zig>
<src/evm/execution/package.zig>
<src/evm/execution/execution_error.zig>
<src/evm/execution/bitwise.zig>
<src/evm/execution/crypto.zig>
<src/evm/execution/environment.zig>
<src/evm/execution/log.zig>
<src/evm/execution/memory.zig>
<src/evm/execution/storage.zig>
<src/evm/execution/stack.zig>
<src/evm/execution/block.zig>
<src/evm/log.zig>
<src/evm/hardforks/chain_rules.zig>
<src/evm/hardforks/hardfork.zig>
<src/evm/memory.zig>
<src/evm/stack/stack_validation.zig>
<src/evm/stack/stack.zig>
<src/evm/stack/validation_patterns.zig>
<src/evm/blob/blob_types.zig>
<src/evm/blob/blob_gas_market.zig>
<src/evm/blob/index.zig>
<src/evm/blob/kzg_verification.zig>
<src/evm/access_list/access_list.zig>
<src/evm/access_list/access_list_storage_key_context.zig>
<src/evm/access_list/access_list_storage_key.zig>
<src/evm/call_result.zig>
<src/evm/opcodes/opcode.zig>
<src/evm/opcodes/operation.zig>
<src/evm/context.zig>
<src/evm/evm.zig>
### GO-ETHEREUM Source Code
<./go-ethereum/core/blockchain_repair_test.go>
<./go-ethereum/core/forkid/forkid_test.go>
<./go-ethereum/core/forkid/forkid.go>
<./go-ethereum/core/blockchain_sethead_test.go>
<./go-ethereum/core/txpool/blobpool/evictheap_test.go>
<./go-ethereum/core/txpool/blobpool/config.go>
<./go-ethereum/core/txpool/blobpool/slotter.go>
<./go-ethereum/core/txpool/blobpool/blobpool.go>
<./go-ethereum/core/txpool/blobpool/metrics.go>
<./go-ethereum/core/txpool/blobpool/priority.go>
<./go-ethereum/core/txpool/blobpool/lookup.go>
<./go-ethereum/core/txpool/blobpool/interface.go>
<./go-ethereum/core/txpool/blobpool/evictheap.go>
<./go-ethereum/core/txpool/blobpool/limbo.go>
<./go-ethereum/core/txpool/blobpool/slotter_test.go>
<./go-ethereum/core/txpool/blobpool/blobpool_test.go>
<./go-ethereum/core/txpool/blobpool/priority_test.go>
<./go-ethereum/core/txpool/legacypool/list.go>
<./go-ethereum/core/txpool/legacypool/noncer.go>
<./go-ethereum/core/txpool/legacypool/legacypool2_test.go>
<./go-ethereum/core/txpool/legacypool/legacypool_test.go>
<./go-ethereum/core/txpool/legacypool/legacypool.go>
<./go-ethereum/core/txpool/legacypool/list_test.go>
<./go-ethereum/core/txpool/txpool.go>
<./go-ethereum/core/txpool/subpool.go>
<./go-ethereum/core/txpool/locals/journal.go>
<./go-ethereum/core/txpool/locals/tx_tracker_test.go>
<./go-ethereum/core/txpool/locals/tx_tracker.go>
<./go-ethereum/core/txpool/locals/errors.go>
<./go-ethereum/core/txpool/reserver.go>
<./go-ethereum/core/txpool/validation.go>
<./go-ethereum/core/txpool/errors.go>
<./go-ethereum/core/events.go>
<./go-ethereum/core/gaspool.go>
<./go-ethereum/core/state/statedb_fuzz_test.go>
<./go-ethereum/core/state/snapshot/generate.go>
<./go-ethereum/core/state/snapshot/journal.go>
<./go-ethereum/core/state/snapshot/snapshot_test.go>
<./go-ethereum/core/state/snapshot/iterator_fast.go>
<./go-ethereum/core/state/snapshot/iterator_test.go>
<./go-ethereum/core/state/snapshot/disklayer.go>
<./go-ethereum/core/state/snapshot/context.go>
<./go-ethereum/core/state/snapshot/difflayer.go>
<./go-ethereum/core/state/snapshot/utils.go>
<./go-ethereum/core/state/snapshot/iterator.go>
<./go-ethereum/core/state/snapshot/disklayer_test.go>
<./go-ethereum/core/state/snapshot/holdable_iterator.go>
<./go-ethereum/core/state/state_object_test.go>
<./go-ethereum/core/state/metrics.go>
<./go-ethereum/core/state/sync.go>
<./go-ethereum/core/state/statedb_hooked.go>
<./go-ethereum/core/state/pruner/pruner.go>
<./go-ethereum/core/state/pruner/bloom.go>
<./go-ethereum/core/state/statedb_hooked_test.go>
<./go-ethereum/core/state/journal.go>
<./go-ethereum/core/state/statedb_test.go>
<./go-ethereum/core/state/reader.go>
<./go-ethereum/core/state/iterator_test.go>
<./go-ethereum/core/state/trie_prefetcher.go>
<./go-ethereum/core/state/state_object.go>
<./go-ethereum/core/state/sync_test.go>
<./go-ethereum/core/state/transient_storage.go>
<./go-ethereum/core/state/database.go>
<./go-ethereum/core/state/access_events.go>
<./go-ethereum/core/state/access_events_test.go>
<./go-ethereum/core/blockchain.go>
<./go-ethereum/core/vm/contracts_fuzz_test.go>
<./go-ethereum/core/vm/memory.go>
<./go-ethereum/core/vm/analysis_eof.go>
<./go-ethereum/core/vm/opcodes.go>
<./go-ethereum/core/vm/gas_table_test.go>
<./go-ethereum/core/vm/gas_table.go>
<./go-ethereum/core/vm/evm.go>
<./go-ethereum/core/vm/runtime/env.go>
<./go-ethereum/core/vm/runtime/runtime.go>
<./go-ethereum/core/vm/runtime/runtime_example_test.go>
<./go-ethereum/core/vm/runtime/doc.go>
<./go-ethereum/core/vm/runtime/runtime_test.go>
<./go-ethereum/core/vm/runtime/runtime_fuzz_test.go>
<./go-ethereum/core/vm/eips.go>
<./go-ethereum/core/vm/jump_table_export.go>
<./go-ethereum/core/vm/operations_acl.go>
<./go-ethereum/core/vm/instructions.go>
<./go-ethereum/core/vm/operations_verkle.go>
<./go-ethereum/core/vm/eof_instructions.go>
<./go-ethereum/core/vm/contracts.go>
<./go-ethereum/core/vm/common.go>
<./go-ethereum/core/vm/stack_table.go>
<./go-ethereum/core/vm/interpreter.go>
<./go-ethereum/core/vm/interpreter_test.go>
<./go-ethereum/core/vm/stack.go>
<./go-ethereum/core/vm/jump_table.go>
<./go-ethereum/core/vm/instructions_test.go>
<./go-ethereum/core/vm/doc.go>
<./go-ethereum/core/vm/jump_table_test.go>
<./go-ethereum/core/vm/errors.go>
<./go-ethereum/core/vm/eof_validation.go>
<./go-ethereum/core/vm/analysis_legacy_test.go>
<./go-ethereum/core/vm/eof_immediates.go>
<./go-ethereum/core/vm/analysis_legacy.go>
<./go-ethereum/core/vm/contracts_test.go>
<./go-ethereum/core/vm/memory_test.go>
<./go-ethereum/core/vm/eof_validation_test.go>
<./go-ethereum/core/vm/memory_table.go>
<./go-ethereum/core/vm/interface.go>
<./go-ethereum/core/rlp_test.go>
<./go-ethereum/core/chain_makers_test.go>
<./go-ethereum/core/mkalloc.go>
<./go-ethereum/core/headerchain.go>
<./go-ethereum/core/txindexer.go>
<./go-ethereum/core/block_validator.go>
<./go-ethereum/core/blockchain_reader.go>
<./go-ethereum/core/bench_test.go>
<./go-ethereum/core/genesis.go>
<./go-ethereum/core/txindexer_test.go>
<./go-ethereum/core/blockchain_insert.go>
<./go-ethereum/core/verkle_witness_test.go>
<./go-ethereum/core/stateless/encoding.go>
<./go-ethereum/core/stateless/witness.go>
<./go-ethereum/core/stateless/database.go>
<./go-ethereum/core/chain_makers_test.go>
<./go-ethereum/core/filtermaps/matcher.go>
<./go-ethereum/core/filtermaps/indexer_test.go>
<./go-ethereum/core/filtermaps/checkpoints.go>
<./go-ethereum/core/filtermaps/indexer.go>
<./go-ethereum/core/filtermaps/chain_view.go>
<./go-ethereum/core/filtermaps/matcher_backend.go>
<./go-ethereum/core/filtermaps/filtermaps.go>
<./go-ethereum/core/filtermaps/matcher_test.go>
<./go-ethereum/core/filtermaps/math_test.go>
<./go-ethereum/core/filtermaps/map_renderer.go>
<./go-ethereum/core/filtermaps/math.go>

---

The user wants to implement a highly configurable and adaptive EVM interpreter system in Zig. The system should allow swapping out components like stack, memory, and execution strategies based on various configurations and runtime contexts. The go-ethereum implementation, while not having this exact pluggable system, provides production-grade implementations of the components the user wants to make configurable.

Therefore, the most relevant context from go-ethereum would be:
1.  **The `Interpreter` implementation**: To show the core execution loop, how it interacts with the stack, memory, and gas, and how opcodes are dispatched. This is the central piece of logic to be adapted.
2.  **The `JumpTable`**: To demonstrate how different sets of opcode implementations are selected based on configuration (in Geth's case, hardforks). This directly maps to the user's `ExecutionStrategy`.
3.  **The `Stack` and `Memory` implementations**: To provide a reference for a standard, optimized implementation of these core data structures. The user wants to create multiple versions of these.
4.  **The `EVM` object and its `Config`**: To show how the different components are assembled and configured at a higher level.
5.  **The `Tracer` (logger) interface**: This is a perfect example of how go-ethereum already uses a pluggable component system to alter execution behavior for debugging and tracing, which aligns with the user's `Debug` and `Tracing` interpreter types.
6.  **The `ChainConfig`**: To illustrate how Ethereum protocol rules (EIPs, hardforks) are managed, which is a key part of "compatibility" configuration.

By providing these snippets, the developer gets a clear picture of how a mature EVM is structured and can use that as a blueprint for their more abstract and flexible system.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Interpreter is a simple interpreter for Ethereum Virtual Machine opcodes.
type Interpreter struct {
	evm *EVM
	cfg Config

	hasher    crypto.KeccakState // Keccak256 hasher for SHA3 opcode
	hasherBuf bytes.Buffer       // Keccak256 hasher buffer for SHA3 opcode

	readOnly   bool   // whether this interpreter is running in read-only mode
	returnData []byte // last CALL's return data for subsequent reuse
}

// NewInterpreter returns a new interpreter for executing EVM opcodes.
func NewInterpreter(evm *EVM, cfg Config) *Interpreter {
	return &Interpreter{
		evm:    evm,
		cfg:    cfg,
		hasher: crypto.NewKeccakState(),
	}
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return data and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (error handling and setup)

	// Grab the EVM and the byte code to execute
	evm := in.evm
	in.readOnly = readOnly
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
		// For optimisation, reference the op table directly
		opTable = in.cfg.JumpTable
		pc      = uint64(0) // program counter
		cost    uint64
		// copies used by tracer
		pcCopy  uint64
		gasCopy uint64
		logged  bool
	)

	// ... (tracer setup)

	// The Interpreter main run loop. This loop will continue until execution of
	// the contract is completed or an error is returned.
	for {
		// ... (tracer logging)

		// Get the operation from the jump table and validate the stack to ensure there are
		// enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := opTable[op]
		if operation == nil {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Static calls can't ever change state. The interpreter should
		// be instantiated with readOnly=true, but we also check here.
		if in.readOnly && operation.writes {
			return nil, ErrWriteProtection
		}
		// Deduct gas
		cost, err = operation.gasCost(evm, contract, stack, mem)
		if err != nil {
			return nil, err
		}

		if err := contract.UseGas(cost); err != nil {
			return nil, err
		}
		// Execute the operation
		res, err := operation.execute(&pc, in, callContext)
		// ... (tracer logging)

		if err != nil {
			return nil, err
		}

		if len(res) > 0 {
			ret = res
			break
		}
		pc++
	}
	return ret, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// JumpTable contains the EVM opcodes and their corresponding implementations.
type JumpTable [256]*operation

// newShanghaiInstructionSet returns the instruction set for the Shanghai hard fork.
func newShanghaiInstructionSet() JumpTable {
	// Start with Cancun and remove PUSH0
	instructionSet := newCancunInstructionSet()
	instructionSet[PUSH0] = &operation{
		execute:            opPush0,
		gasCost:            GasQuickStep,
		validateStack:      makeStackFunc(0, 1),
		minStack:           minStack(0, 1),
		maxStack:           maxStack(0, 1),
		memorySize:         nil,
		halts:              false,
		jumps:              false,
		writes:             false,
		valid:              true,
		name:               "PUSH0",
		constantGas:        GasQuickStep,
		returns:            false,
		reverts:            false,
		dynamicGas:         false,
		usesMemory:         false,
		calls:              false,
		creates:            false,
		isPush:             true,
		nonConsumableGas:   false,
		readOnly:           true,
		returnsAtFinalFlag: false,
	}
	return instructionSet
}

// newCancunInstructionSet returns the instruction set for the Cancun hard fork.
func newCancunInstructionSet() JumpTable {
	// Start with Shanghai and add Cancun opcodes
	instructionSet := newShanghaiInstructionSet()
	instructionSet[BLOBHASH] = &operation{
		execute:       opBlobHash,
		gasCost:       gasBlobHash,
		validateStack: makeStackFunc(1, 1),
		//...
	}
	instructionSet[TLOAD] = &operation{
		execute:       opTload,
		gasCost:       gasTLoad,
		validateStack: makeStackFunc(1, 1),
		//...
	}
	//... (other opcodes)
	return instructionSet
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a stack for 256-bit words.
type Stack struct {
	data []uint256.Int
}

// NewStack returns a new stack with a backing store of the given size.
func newstack() *Stack {
	return &Stack{data: make([]uint256.Int, 0, 16)}
}

// Data returns the underlying uint256.Int array.
func (st *Stack) Data() []uint256.Int {
	return st.data
}

// push pushes a new value on top of the stack.
func (st *Stack) push(d *uint256.Int) {
	st.data = append(st.data, *d)
}

// Pop pops the top value off the stack and returns it.
func (st *Stack) pop() (ret uint256.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// Len returns the number of elements in the stack.
func (st *Stack) len() int {
	return len(st.data)
}

// swap swaps the top two values on the stack.
func (st *Stack) swap(n int) {
	st.data[st.len()-n], st.data[st.len()-1] = st.data[st.len()-1], st.data[st.len()-n]
}

// dup duplicates the nth value on the stack.
func (st *Stack) dup(n int) {
	st.push(&st.data[st.len()-n])
}

// peek returns the nth value on the stack without removing it.
func (st *Stack) peek(n int) *uint256.Int {
	return &st.data[st.len()-n]
}

// Back returns the n'th item in the stack.
func (st *Stack) Back(n int) *uint256.Int {
	return &st.data[n]
}

// require ensures that the stack has at least n elements.
func (st *Stack) require(n int) error {
	if st.len() < n {
		return fmt.Errorf("stack underflow (%d < %d)", st.len(), n)
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory implements a simple memory model for the Ethereum Virtual Machine.
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
		// If the size is larger than the memory, extend it
		if offset+size > uint64(len(m.store)) {
			// This will cause a resize, which is an allocation.
			m.resize(offset + size)
		}
		copy(m.store[offset:offset+size], value)
	}
}

// Set32 sets the 32 bytes starting at offset to the value of val.
func (m *Memory) Set32(offset uint64, val *uint256.Int) {
	// If the size is larger than the memory, extend it
	if offset+32 > uint64(len(m.store)) {
		m.resize(offset + 32)
	}
	val.WriteToSlice(m.store[offset : offset+32])
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	m.resize(size)
}

// resize calculates the new size of the memory and allocates a new backing slice.
func (m *Memory) resize(size uint64) {
	if uint64(cap(m.store)) < size {
		c := size + 256
		c -= c % 256
		m.store = make([]byte, size, c)
	}
	m.store = m.store[:size]
}

// Get returns size bytes starting at offset.
func (m *Memory) Get(offset, size int64) (data []byte) {
	if size == 0 {
		return nil
	}
	if int64(len(m.store)) < offset+size {
		return common.RightPadBytes(m.store[offset:], int(size))
	}
	return m.store[offset : offset+size]
}

// GetPtr returns a pointer to the data at the given offset.
func (m *Memory) GetPtr(offset, size int64) *[]byte {
	if size == 0 {
		return new([]byte)
	}
	if int64(len(m.store)) < offset+size {
		// First, try to use Get, which will do a resize within reason,
		// and return padded result
		cpy := m.Get(offset, size)
		return &cpy
	}
	val := m.store[offset : offset+size]
	return &val
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the geth implementation.
type EVM struct {
	// Config includes logging and debugging options.
	Config
	// BlockContext provides information about the current block.
	BlockContext
	// TxContext provides information about the current transaction.
	TxContext

	// StateDB gives access to the underlying state.
	StateDB StateDB

	// depth is the current call stack depth
	depth int

	// chain rules
	chainRules params.Rules

	// virtual machine instance
	interpreter *Interpreter

	// precompiles are the pre-compiled contracts
	precompiles map[common.Address]PrecompiledContract

	// readOnly is the flag indicating whether the state can be changed or not
	readOnly bool
}

// Config are the configuration options for the EVM.
type Config struct {
	// Tracer is the op code logger that can be used to step through an
	// execution of a transaction step by step.
	Tracer Tracer

	// NoBaseFee should be used in conjunction with marked-state-required EVM
	// rules (e.g. London). The effect of setting this to true is that the basefee
	// of the current block is not enforced on the EIP-1559-style transactions.
	// This is required for RPC calls which execute historical transactions.
	NoBaseFee bool

	// EnablePreimageRecording has the EVM state database track all the hashes of
	// the nodes that were loaded from the database.
	EnablePreimageRecording bool

	// StatelessSelfValidation is a flag which can be used to disable the eoa-sender
	// check in the EVM. This is useful for things like stateless EIP-2930 witnesses.
	// Normally, we require that the sender has a valid signature. If we are doing
	// witness-validation, there is no sender account to validate.
	StatelessSelfValidation bool

	// ExtraEips specifies a list of EIPs that are to be enabled in the EVM
	// in addition to the formal ones specified by the chain configuration.
	// This is mostly useful for testing, but can also be used by other tools
	// that wish to activate some non-mainline EIP.
	ExtraEips []int
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single goroutine.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// The EVM should never be used without a statedb and a chain configuration.
	if statedb == nil {
		panic("statedb is nil")
	}
	if chainConfig == nil {
		panic("chainconfig is nil")
	}
	isCanyon := chainConfig.IsCanyon(blockCtx.BlockNumber, blockCtx.Time)
	isShanghai := isCanyon || chainConfig.IsShanghai(blockCtx.BlockNumber, blockCtx.Time)
	isLondon := isShanghai || chainConfig.IsLondon(blockCtx.BlockNumber)
	isBerlin := isLondon || chainConfig.IsBerlin(blockCtx.BlockNumber)

	rules := chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time)
	for _, eip := range vmConfig.ExtraEips {
		rules.EnableEIP(eip, true)
	}
	return &EVM{
		BlockContext: blockCtx,
		TxContext:    txCtx,
		StateDB:      statedb,
		Config:       vmConfig,
		chainRules:   rules,
		precompiles:  ActivePrecompiledContracts(rules),
		readOnly:     false,
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// Tracer is a generic interface for tracing execution of the EVM.
type Tracer interface {
	// OnTxStart is called at the start of a transaction.
	OnTxStart(vmctx *BlockContext, tx *types.Transaction, from common.Address)

	// CaptureStart is called at the start of a call operation.
	CaptureStart(from common.Address, to common.Address, call []byte, gas uint64, value *uint256.Int, typ OpCode)

	// CaptureState is called on each step of the VM, providing the current execution
	// context.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called on each step of the VM that results in an error.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnd is called at the end of a call operation.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *uint256.Int)

	// CaptureExit is called when the EVM exits a scope, even if the scope came to an
	// abrupt end.
	CaptureExit(output []byte, gasUsed uint64, err error)

	// CaptureTxStart is called when a transaction starts.
	CaptureTxStart(gasLimit uint64)

	// CaptureTxEnd is called when a transaction ends.
	CaptureTxEnd(restGas uint64)

	// OnTxEnd is called at the end of a transaction.
	OnTxEnd(receipt *types.Receipt, err error)
}

// StructLogger is an EVM state logger and implements the Tracer interface.
//
// StructLogger can be used to capture execution traces of transactions.
// It is the backend for the `debug_trace` family of methods.
// The captured data is used by the `callTracer` JavaScript implementation.
//
// Note, this logger is not thread-safe.
type StructLogger struct {
	cfg *logger.Config

	storage Storages
	gas     uint64
	err     error

	logs []StructLog

	// output is the complete call stack, not including the top-level call
	output     []byte
	reverted   bool
	gasUsed    uint64
	interrupt  bool
	reason     error
	depth      int
	init       sync.Once
	keccak     crypto.KeccakState
	callGas    uint64
	lastOpTime time.Time
	mu         sync.Mutex
	// Ptrs to objects that exist for the duration of a call
	evm   *EVM
	stack *Stack
	mem   *Memory
}

// NewStructLogger returns a new logger that is used for logging all opcodes.
func NewStructLogger(cfg *logger.Config) *StructLogger {
	// If the user is using the previous default, disable memory and stack
	// capture. This is to maintain backwards compatibility.
	if cfg != nil && !cfg.EnableMemory && !cfg.EnableStack && cfg.DisableStorage {
		cfg.DisableStack = true
		cfg.DisableMemory = true
	}
	return &StructLogger{cfg: cfg, storage: make(Storages)}
}

// CaptureStart implements the Tracer interface to initialize the tracing operation.
func (l *StructLogger) CaptureStart(evm *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
	l.init.Do(func() { l.keccak = crypto.NewKeccakState() })
	l.evm = evm
	l.stack = newstack()
	l.mem = NewMemory()
	l.callGas = gas
	l.lastOpTime = time.Now()
}
// ...
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether the nodes supports or opposes the DAO hard-fork

	// EIP150 implements the Gas price changes for IO-heavy operations.
	// https://github.com/ethereum/EIPs/issues/150
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)

	// EIP155 implements replay-protected transaction signatures.
	// https://github.com/ethereum/EIPs/issues/155
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements an account clearing that happens at the end of a transaction.
	// https://github.com/ethereum/EIPs/issues/158
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = no fork)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork)
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Arrow Glacier switch block (nil = no fork)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Gray Glacier switch block (nil = no fork)
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`  // Virtual fork after The Merge to use fork choice rules from Capella and Cancun

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from Proof-of-Work to Proof-of-Stake.
	//
	// A nil value means the network never transitions to proof-of-stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`
	// TerminalTotalDifficultyPassed is a flag that indicates the TTD has been reached and
	// passed. This is a one-way switch, which gets set to true once the chain passes
	// the TTD.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Engine specifies the consensus engine of a chain.
	Engine any `json:"engine"`
}

// Rules is a set of rules that act on a specific block number.
type Rules struct {
	ChainID                                                                                                  *big.Int
	IsHomestead, IsEIP150, IsEIP155, IsEIP158, IsByzantium, IsConstantinople, IsPetersburg, IsIstanbul, IsBerlin bool
	IsLondon, IsArrowGlacier, IsGrayGlacier, IsMerge, IsShanghai, IsCancun, IsPrague, IsOsaka, IsVerkle         bool
}

// Rules returns the rule set for the given block number and time.
func (c *ChainConfig) Rules(num *big.Int, isMerge bool, time uint64) Rules {
	chainID := c.ChainID
	if chainID == nil {
		chainID = new(big.Int)
	}
	rules := Rules{
		ChainID:          chainID,
		IsHomestead:      c.IsHomestead(num),
		IsEIP150:         c.IsEIP150(num),
		IsEIP155:         c.IsEIP155(num),
		IsEIP158:         c.IsEIP158(num),
		IsByzantium:      c.IsByzantium(num),
		IsConstantinople: c.IsConstantinople(num),
		IsPetersburg:     c.IsPetersburg(num),
		IsIstanbul:       c.IsIstanbul(num),
		IsBerlin:         c.IsBerlin(num),
		IsLondon:         c.IsLondon(num),
		IsArrowGlacier:   c.IsArrowGlacier(num),
		IsGrayGlacier:    c.IsGrayGlacier(num),
		IsMerge:          isMerge,
		IsShanghai:       c.IsShanghai(num, time),
		IsCancun:         c.IsCancun(num, time),
		IsPrague:         c.IsPrague(num, time),
		IsOsaka:          c.IsOsaka(num, time),
		IsVerkle:         c.IsVerkle(num, time),
	}
	return rules
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Interpreter is the EVM main loop that takes contracts and executes them.
//
// The Interpreter should be considered a single use type. Don't rely on it being
// usable after an execution has ended with an error.
type Interpreter struct {
	// The readOnly might be used to abort run even if it's not a Go error, but simply
	// a EVM stack error.
	readOnly   bool   // Whether to throw on state modifying opcodes
	returnData []byte // Last CALL's return data for subsequent reuse

	// scope contains the contract code and scope specific data.
	scope *ScopeContext

	// evm is the parent EVM.
	evm *EVM

	// gas is the gas available for execution
	gas uint64

	// instruction set
	opFn opFunc
	// intPool is a pool of read-only big integers for constants.
	intPool *intPool

	// an arbitrary data field, passed untouched to call* functions
	callData interface{}
}

// Config are the configuration options for the Interpreter.
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op code logger
	Tracer Tracer
	// NoBaseFee may be used to disable base fee checking
	NoBaseFee bool
	// EnableJit enabled the JIT VM
	EnableJit bool
	// ForceJit makes the JIT compiler not to fallback to interpreter on errors
	ForceJit bool

	// initial-alloc-size for the JIT VM code.
	JitInitialAllocSize uint64

	// VmLog is an evm debugger to use.
	// Deprecated: use Tracer instead.
	VmLog EVMLogger
}

// NewInterpreter returns a new instance of the interpreter.
func NewInterpreter(evm *EVM, cfg Config) *Interpreter {
	var readOnly bool
	// If the evm has no stateDB, the interpreter is only allowed to read
	// from the blockchain. It is not allowed to make any changes to the state.
	if evm.StateDB == nil {
		readOnly = true
	} else {
		// Set the readOnly flag based on the transaction context.
		readOnly = evm.Context.CanTransfer(evm.StateDB, evm.Context.Origin, evm.callGasTemp)
	}

	// For backwards-compatibility, we have to convert the VmLog to a Tracer.
	// But let's already prepare for the future, where we only have the Tracer
	if cfg.VmLog != nil && cfg.Tracer == nil {
		cfg.Tracer = NewVmLogger(cfg.VmLog)
	}
	// instruction set
	var opFn opFunc
	if cfg.EnableJit {
		opFn = evm.jit.exec
	} else {
		opFn = evm.interpreter.exec
	}

	return &Interpreter{
		evm:      evm,
		readOnly: readOnly,
		intPool:  evm.intPool,
		opFn:     opFn,
	}
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return data and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means a valid revert instruction was executed.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (error handling and setup) ...

	// Make sure the interpreter is using the latest rules.
	rules := in.evm.chainRules

	// Grab the EVM state and scope context
	in.scope = &ScopeContext{
		Memory:   NewMemory(),
		Stack:    NewStack(rules.IsEIP2315),
		Contract: contract,
	}
	in.gas = contract.Gas
	in.readOnly = readOnly || in.readOnly

	// ...

	var (
		op          OpCode        // current opcode
		mem         = in.scope.Memory
		stack       = in.scope.Stack
		callContext = new(callCtx) // Note: this is a temporary solution for JIT migration
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to have a contract with a size > 2^64. A
		// contract of that size can't be deployed to the Ethereum mainnet, so
		// it's OK to fail there.
		pc   = uint64(0)
		cost uint64
		// copies used by tracer
		pcCopy  uint64
		gasCopy uint64
		logged  bool
	)
	// ... (tracer setup) ...

	// Main loop dispatching operations.
	for {
		// ... (tracer capture) ...

		// Get next opcode
		op = contract.GetOp(pc)
		operation := in.evm.interpreter.oplist[op]

		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// ... (gas calculation and validation) ...

		switch op {
		case PUSH1, PUSH2, PUSH3, PUSH4, PUSH5, PUSH6, PUSH7, PUSH8, PUSH9, PUSH10, PUSH11, PUSH12, PUSH13, PUSH14, PUSH15, PUSH16, PUSH17, PUSH18, PUSH19, PUSH20, PUSH21, PUSH22, PUSH23, PUSH24, PUSH25, PUSH26, PUSH27, PUSH28, PUSH29, PUSH30, PUSH31, PUSH32:
			err = operation.execute(&pc, in, callContext)
		default:
			// An error needs to be returned because the JIT implementation handles popping
			// of stack objects itself and needs to be aware of the error otherwise the
			// stack object will be lost.
			err = in.opFn(&pc, in, callContext)
		}

		if err != nil {
			return nil, err
		}
		pc++
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a stack for 256 bit words.
type Stack struct {
	data []uint256.Int
	// The stack can't be resized past 1024 entries.
	// Contract creation of contracts with stack requirements over
	// 1024 is not possible.
	// EIP-2315: allows for subroutines which requires a stack that can grow beyond 1024.
	maxDepth int
}

// NewStack returns a new stack with a maximum capacity of max_stack_size.
func NewStack(eip2315 bool) *Stack {
	maxDepth := 1024
	if eip2315 {
		// EIP-2315 makes the stack limit check part of the RETURN instruction.
		maxDepth = math.MaxInt
	}
	return &Stack{data: make([]uint256.Int, 0, 1024), maxDepth: maxDepth}
}

// Data returns the underlying uint256.Int array.
func (st *Stack) Data() []uint256.Int {
	return st.data
}

// Push pushes a value on the stack.
func (st *Stack) Push(d *uint256.Int) {
	if st.len() >= st.maxDepth {
		panic("stack limit reached")
	}
	st.data = append(st.data, *d)
}

// Pop pops a value from the stack.
func (st *Stack) Pop() (ret uint256.Int) {
	if st.len() == 0 {
		panic("stack underflow")
	}
	ret = st.data[st.len()-1]
	st.data = st.data[:st.len()-1]
	return
}

// Peek returns the item at a given stack index without removing it.
func (st *Stack) Peek(n int) *uint256.Int {
	if st.len() <= n {
		panic("stack underflow")
	}
	return &st.data[st.len()-1-n]
}

// Back returns the n'th item in the stack
func (st *Stack) Back(n int) *uint256.Int {
	if st.len() <= n {
		panic("stack underflow")
	}
	return &st.data[n]
}

// Swap swaps the top two values on the stack.
func (st *Stack) Swap(n int) {
	if st.len() < n+1 {
		panic("stack underflow")
	}
	st.data[st.len()-1], st.data[st.len()-n-1] = st.data[st.len()-n-1], st.data[st.len()-1]
}

// Dup duplicates the n'th value on the stack
func (st *Stack) Dup(n int) {
	if st.len() < n {
		panic("stack underflow")
	}
	st.Push(&st.data[st.len()-n])
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents the EVM's memory space.
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
		if m.len() < int(offset+size) {
			panic("INVALID memory access, memory is resized beforehand")
		}
		copy(m.store[offset:offset+size], value)
	}
}

// Resize resizes the memory to size
func (m *Memory) Resize(size uint64) {
	if uint64(m.len()) < size {
		m.store = append(m.store, make([]byte, size-uint64(m.len()))...)
	}
}

// Get returns offset + size as a new slice
func (m *Memory) Get(offset, size uint64) (cpy []byte) {
	if size == 0 {
		return nil
	}

	if m.len() < int(offset+size) {
		return common.RightPadBytes(m.store[offset:], int(size))
	}

	return m.store[offset : offset+size]
}

// GetPtr returns the offset + size
func (m *Memory) GetPtr(offset, size uint64) []byte {
	if size == 0 {
		return nil
	}

	if m.len() < int(offset+size) {
		return nil
	}
	return m.store[offset : offset+size]
}

// Len returns the length of the backing slice
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// operation represents an instruction in the EVM
type operation struct {
	// execute is the operation function
	execute executionFunc
	// gasCost is the static gas cost of the operation
	gasCost gasFunc
	// validateStack validates the stack for the operation
	validateStack stackValidateFunc
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc

	// willWrite indicates whether the instruction writes to state
	willWrite bool
	// returns indicates whether the instruction terminates the analysis
	returns bool
	// valid indicates whether the instruction is valid
	valid bool
	// dynamic indicates whether the instruction has a dynamic gas cost
	dynamic bool
}

// JumpTable contains the EVM instructions mapped by their 8-bit opcodes.
type JumpTable [256]*operation

var (
	frontierInstructionSet = newInstructionSet(false, false)
	homesteadInstructionSet  = newInstructionSet(true, false)
	byzantiumInstructionSet  = newInstructionSet(true, true)
	// ... and so on for other hard forks ...
)

// newInstructionSet returns the list of instructions for the given chain configuration.
func newInstructionSet(homestead, byzantium bool) JumpTable {
	// Note: make sure the order of opcodes is the same as in opcodes.go
	var insts = JumpTable{
		STOP: {
			execute:       opStop,
			gasCost:       constGasFunc(0),
			validateStack: makeStackFunc(0, 0),
			returns:       true,
			valid:         true,
		},
		ADD: {
			execute:       opAdd,
			gasCost:       constGasFunc(GasFastestStep),
			validateStack: makeStackFunc(2, 1),
			valid:         true,
		},
		MUL: {
			execute:       opMul,
			gasCost:       constGasFunc(GasFastStep),
			validateStack: makeStackFunc(2, 1),
			valid:         true,
		},
		// ... Other opcodes defined similarly ...
		MLOAD: {
			execute:       opMload,
			gasCost:       gasMLoad,
			validateStack: makeStackFunc(1, 1),
			memorySize:    memoryMLoad,
			valid:         true,
			dynamic:       true,
		},
		MSTORE: {
			execute:       opMstore,
			gasCost:       gasMStore,
			validateStack: makeStackFunc(2, 0),
			memorySize:    memoryMStore,
			valid:         true,
			dynamic:       true,
		},
		MSTORE8: {
			execute:       opMstore8,
			gasCost:       gasMStore8,
			validateStack: makeStackFunc(2, 0),
			memorySize:    memoryMStore8,
			valid:         true,
			dynamic:       true,
		},
		// ...
	}
	return insts
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current transaction and block.
	Context
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// Depth is the call depth, which is restricted to 1024
	depth int

	// chain rules
	chainRules params.Rules

	// virtual machine configuration options used to create the interpreter.
	vmConfig Config
	// global (to this context) ethereum virtual machine
	// used throughout the execution of the given contract.
	interpreter *Interpreter
	// evmError is the error returned by the interpreter, which may be a snapshot
	// of the stack and memory at the time the error occurred.
	evmError error

	// chain context objects used in EVM processing
	chain chain.ChainContext
	// a cache of read-only transactions, for easy access
	TxPool TxPool
	// a cache of read-only block headers, for easy access
	BlockChain BlockChain

	// precompiles holds the precompiled contract addresses and their implementations.
	// We should not use the bitwise-and operator to find the right contract.
	precompiles map[common.Address]PrecompiledContract
}

// Context provides the EVM with auxiliary information. Once provided
// it shouldn't be modified.
type Context struct {
	// CanTransfer returns whether the account has enough ether to transfer the
	// value
	CanTransfer CanTransferFunc
	// Transfer transfers ether from one account to the other
	Transfer TransferFunc
	// GetHash returns the hash of a block by its number
	GetHash GetHashFunc

	// Message information
	Origin   common.Address // Provides information for ORIGIN
	GasPrice *big.Int       // Provides information for GASPRICE

	// Block information
	Coinbase    common.Address // Provides information for COINBASE
	GasLimit    uint64         // Provides information for GASLIMIT
	BlockNumber *big.Int       // Provides information for NUMBER
	Time        *big.Int       // Provides information for TIME
	Difficulty  *big.Int       // Provides information for DIFFICULTY
	BaseFee     *big.Int       // Provides information for BASEFEE
	Random      *common.Hash   // Provides information for PREVRANDAO
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single goroutine.
func NewEVM(blockCtx Context, txCtx Context, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// ... (Initialization logic for EVM, including setting up precompiles and interpreter based on rules) ...
	evm := &EVM{
		Context:     blockCtx,
		StateDB:     statedb,
		chainRules:  chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time.Uint64()),
		vmConfig:    vmConfig,
		precompiles: PrecompiledContractsByzantium,
	}

	// ... (setting up JIT or interpreter based on config) ...
	evm.interpreter = NewEVMInterpreter(evm, vmConfig)
	return evm
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// Tracer is the interface for collecting execution traces during EVM execution.
//
// The CaptureState and CaptureFault methods are called between opcodes and are
// not allowed to modify the state of the EVM.
//
// The Capture* methods are called before the opcode indicated by the name is
// executed, and may modify the VM state. This is useful for debuggers, but may
// also be used to track gas, and passed onto any sub-calls.
//
// There is one exception to the above:
//
// In case a Capture* method returns an error, the error is returned by the Run method, and
// the EVM state may not be further modified.
type Tracer interface {
	// CaptureStart is called once at the beginning of the execution of a new call.
	CaptureStart(from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	// CaptureState is called between each step of the VM, giving information about the current
	// internal state of the EVM.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It is not called if `Enter` or `Exit` fails.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	// CaptureEnd is called once at the end of the execution of a call, with the generated output and
	// error if any.
	CaptureEnd(output []byte, gasUsed uint64, err error)
	// CaptureEnter is called when the EVM enters a new scope (via call, create or create2).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	// CaptureExit is called when the EVM exits a scope, with the resulting output and error.
	CaptureExit(output []byte, gasUsed uint64, err error)
}

// StructLogger is a EVM state logger and implements Tracer.
//
// It's used to created structured logs of EVM execution and is meant to
// be used for debugging. It is not thread safe.
type StructLogger struct {
	cfg Config

	logs            []StructLog
	changedAccounts map[common.Address]struct{}

	mu  sync.Mutex //TODO: this is a temporary fix and should be removed.
	err error
}

// NewStructLogger returns a new logger that is used to step through an EVM contract
// as it is being executed and provides the current state at each step.
//
// It's a convenient way to get structured logs out of the EVM for debugging purposes.
func NewStructLogger(cfg *Config) *StructLogger {
	//...
}

// ... (Implementation of Tracer interface for StructLogger) ...
```
</file>
</go-ethereum>

## Prompt Corrections
The user's prompt outlines an extremely advanced and flexible interpreter design. While `go-ethereum` is a production-grade EVM, its interpreter is not as dynamically configurable at runtime as the prompt specifies. Here are some notes to bridge the gap between the prompt's ideal design and a real-world implementation:

1.  **Component Swapping**: The prompt envisions swapping `Stack`, `Memory`, and `ExecutionEngine` implementations at runtime, possibly even mid-execution (`adaptive_switching`). In `go-ethereum`, these components are fixed at compile time. The interpreter is a single, highly-optimized implementation. Different "behaviors" are achieved via interfaces like `Tracer` rather than by swapping core components.
    *   **Recommendation**: Start by implementing different modes (e.g., `Standard`, `Debug`, `Tracing`) using a similar interface-based approach as `go-ethereum`'s `Tracer` (`core/vm/logger.go`). This allows for configurable behavior (like extra validation or logging) without the complexity of completely different stack/memory implementations.

2.  **Execution Strategy**: `go-ethereum` uses a `JumpTable` for O(1) opcode dispatch. This is a very common and performant strategy. The prompt's other `ExecutionStrategy` options like `ComputedGoto` are highly platform-specific, and `Threaded` interpretation is a different paradigm altogether.
    *   **Recommendation**: Focus on implementing a robust `JumpTable` strategy first, as it's a proven design. The `operation` struct in `core/vm/jump_table.go` is an excellent reference. It contains not just the execution function but also static gas cost and stack validation info, which is critical for performance.

3.  **Interpreter Configuration**: In `go-ethereum`, the `InterpreterConfig` is much simpler than the one in the prompt. It's mainly used to attach a `Tracer` (for debugging/logging) before an execution run begins. The selection of this configuration is done externally by the caller of the EVM, not automatically by a `TypeSelector`.
    *   **Recommendation**: The adaptive selection system in the prompt is a significant feature. It would be practical to implement the core interpreter first with static configuration profiles (e.g., `debug()`, `performance()`) and then build the `TypeSelector` and `PerformanceProfiler` on top of that to automate the selection.

4.  **Interpreter vs. EVM**: In `go-ethereum`, the `EVM` struct (`core/vm/evm.go`) is the high-level object that holds the state (`StateDB`) and context (`Context`). It creates an `Interpreter` instance for each call frame. The `Interpreter` (`core/vm/interpreter.go`) then executes the bytecode for that specific frame. This separation is a useful pattern to follow. The prompt's `InterpreterTypeManager` seems to fill a role similar to the `EVM` struct, creating configured `InterpreterInstance`s for execution.

---

An analysis of the `go-ethereum` codebase reveals several patterns and implementations that are highly relevant to building a configurable interpreter types system. The concepts of a `JumpTable` for different hardforks, a configurable `Tracer` for debugging, and optimized `Stack` and `Memory` models are all present and provide excellent reference implementations.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
This file is the core of the EVM interpreter in go-ethereum. It contains the main execution loop, the `Interpreter` struct, and a `Config` struct that allows for different operational modes, particularly for debugging and tracing. This directly maps to your prompt's concept of a configurable interpreter.

```go
// Interpreter is the main Ethereum Virtual Machine interpreter.
// It is used to execute bytecode and read the EVM state.
type Interpreter struct {
	// The following fields are copied from the EVM and are not modified
	// during execution.
	evm      *EVM
	config   Config
	gasTable params.GasTable

	// The following fields are per-transaction and are not modified
	// during execution.
	readOnly   bool   // whether to throw unable to write to state err
	returnData []byte // last return data for successive calls

	// The following fields are per-message and are created each time
	// the interpreter is called.
	stack  *Stack
	memory *Memory

	// The following fields are used by the execution loop.
	pc       uint64
	op       OpCode
	gas      uint64
	cost     uint64
	cp       int // current call path position
	gasPrice uint256.Int
}

// Config are the configuration options for the Interpreter.
//
// Your `InterpreterConfig` struct is a more advanced version of this,
// allowing for swapping out components entirely. Geth's config primarily
// enables/disables features like debugging and tracing.
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op code logger
	Tracer EVMLogger
	// NoBaseFee forces the EIP-1559 base fee to 0 (needed for 0 price calls)
	NoBaseFee bool
	// EnableJit enabled the JIT compiler
	EnableJit bool
	// ForceJit forces the JIT compiler, instead of using the JIT-auto-turning
	ForceJit bool
}

// NewInterpreter returns a new instance of the Interpreter.
func NewInterpreter(evm *EVM, cfg Config) *Interpreter {
	return &Interpreter{
		evm:      evm,
		config:   cfg,
		gasTable: evm.ChainConfig().GasTable(evm.BlockNumber, evm.Time),
	}
}

// Run executes the given bytecode and returns the result.
// This is the main execution loop. Notice the use of the `op` variable
// to fetch from the `JumpTable`, which is a direct parallel to your
// `ExecutionStrategy`.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (initialization code omitted)

	// Grab the EVM jump table for the current ruleset.
	var (
		op    OpCode        // current opcode
		mem   = NewMemory() // bound memory
		stack = newstack()  // local stack
		// For optimisation, reference the jump table directly
		jt = in.evm.ChainConfig().Rules(in.evm.BlockNumber, in.evm.Random != nil, in.evm.Time).JumpTable
	)
	in.mem = mem
	in.stack = stack
	in.gas = contract.Gas
	in.readOnly = readOnly

	// ... (JIT related code omitted)

	// Main loop dispatching operations.
	for {
		// Get next opcode from the jump table
		op = contract.GetOp(in.pc)
		operation := jt[op]

		// ... (stack validation and gas deduction code omitted)

		// Execute the operation
		res, err := operation.execute(&in.pc, in, &callCtx)
		// ... (error handling code omitted)
		in.pc++
	}
	return
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
This file is fundamental to how go-ethereum implements different EVM behaviors for different hardforks. It defines a `JumpTable` which is an array of opcode implementations. Different `new...InstructionSet` functions create different jump tables, effectively creating different "interpreter types" based on the chain's rules. This is a direct parallel to your `ExecutionStrategy::JumpTable` and `ComponentRegistry`.

```go
// JumpTable contains the EVM opcodes supported by a given fork.
// Your `ExecutionStrategy` enum directly relates to this concept.
// A `DirectCall` strategy would be a large switch statement, while
// `JumpTable` is this array-based dispatch.
type JumpTable [256]operation

// operation is the low-level representation of an opcode.
type operation struct {
	// execute is the opcode's execution logic.
	execute executionFunc
	// constantGas is the gas cost of the opcode.
	constantGas uint64
	// dynamicGas is the dynamic gas cost of the opcode.
	dynamicGas gasFunc
	// minStack tells how many stack items are required.
	minStack int
	// maxStack specifies the max stack height after execution.
	maxStack int

	// memorySize returns the memory size required for the operation.
	memorySize memorySizeFunc
}

// These are the instruction sets for the various mainnet forks.
var (
	frontierInstructionSet      = newFrontierInstructionSet()
	homesteadInstructionSet     = newHomesteadInstructionSet()
	tangerineWhistleInstructionSet = newTangerineWhistleInstructionSet()
	spuriousDragonInstructionSet  = newSpuriousDragonInstructionSet()
	byzantiumInstructionSet     = newByzantiumInstructionSet()
	constantinopleInstructionSet  = newConstantinopleInstructionSet()
	petersburgInstructionSet    = newPetersburgInstructionSet()
	istanbulInstructionSet      = newIstanbulInstructionSet()
	berlinInstructionSet        = newBerlinInstructionSet()
	londonInstructionSet        = newLondonInstructionSet()
	shanghaiInstructionSet      = newShanghaiInstructionSet()
	cancunInstructionSet        = newCancunInstructionSet()
)

// newShanghaiInstructionSet returns the instruction set for the Shanghai fork.
// This function demonstrates how different instruction sets (and therefore
// different interpreter behaviors) are constructed. Your `ComponentRegistry`
// would have similar factory functions for different interpreter components.
func newShanghaiInstructionSet() JumpTable {
	// Instructions are inherited from London fork
	instructionSet := newLondonInstructionSet()

	// EIP-3855: PUSH0 instruction
	instructionSet[PUSH0] = operation{
		execute:     opPush0,
		constantGas: GasQuickStep,
		minStack:    0,
		maxStack:    1,
	}
	return instructionSet
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
Go-ethereum's `EVMLogger` interface is a perfect real-world example of the tracing and debugging capabilities you want to build into your interpreter. Your `Debug` and `Tracing` interpreter types could be implemented by providing a `Tracer` that implements an interface like this. The `StructLog` is the data structure used to capture the state at each step.

```go
// EVMLogger is used to collect execution traces from an EVM transaction.
// Note, the EVMLogger interface is extended by `EVMLoggerExtension`
// which provides additional hooks.
type EVMLogger interface {
	// OnOpcode is invoked for every opcode that is about to be executed.
	OnOpcode(pc uint64, op vm.OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// OnFault is invoked when an execution faults.
	OnFault(pc uint64, op vm.OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// OnTxStart is invoked when a new transaction is about to be executed.
	// This hook can be used to initialise the logger.
	OnTxStart(vm *VMContext, tx *types.Transaction, from common.Address)

	// OnTxEnd is invoked when a transaction has finished executing.
	// This hook can be used to teardown the logger.
	OnTxEnd(receipt *types.Receipt, err error)
}


// StructLog is emitted to the EVM each cycle and lists information about the
// current internal state prior to the execution of the statement.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            vm.OpCode                   `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory,omitempty"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*uint256.Int              `json:"stack"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"`
}

// StructLogger is an EVMLogger that captures execution steps and converts them to
// a JSON object.
//
// This is a concrete implementation of the EVMLogger interface, analogous to your
// `Debug` or `Tracing` interpreter types.
type StructLogger struct {
	cfg Config
	// ... (internal fields)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
This file defines the `Stack`, a core component of the EVM. It's a fixed-size array with methods for push, pop, and peek. The implementation is optimized for performance, which is relevant to your `StandardStack` and `OptimizedStack` concepts. The use of a fixed-size array is a key design choice for performance and to prevent resource exhaustion.

```go
// Stack is a last-in-first-out stack that stores 256-bit unsigned integers.
//
// A Stack is not safe for concurrent use.
type Stack struct {
	data []uint256.Int
}

// newstack returns a new stack with a maximum capacity of 1024.
func newstack() *Stack {
	return &Stack{data: make([]uint256.Int, 0, 1024)}
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []uint256.Int {
	return st.data
}

// Push pushes an element to the top of the stack.
func (st *Stack) Push(d *uint256.Int) {
	st.data = append(st.data, *d)
}

// Pop pops the top element from the stack and returns it.
func (st *Stack) Pop() (ret uint256.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// Len returns the number of elements in the stack.
func (st *Stack) Len() int {
	return len(st.data)
}

// Swap swaps the top element with the n'th element from the top.
func (st *Stack) Swap(n int) {
	st.data[len(st.data)-1], st.data[len(st.data)-n-1] = st.data[len(st.data)-n-1], st.data[len(st.data)-1]
}

// Dup duplicates the n'th element from the top of the stack and pushes it on top.
func (st *Stack) Dup(n int) {
	st.Push(&st.data[len(st.data)-n])
}

// Peek returns the n'th element from the top of the stack without removing it.
func (st *Stack) Peek(n int) *uint256.Int {
	return &st.data[len(st.data)-1-n]
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
The `Memory` model in go-ethereum is an expandable byte array. Its `Resize` method, which calculates the quadratic gas cost for memory expansion, is a critical part of EVM behavior and a great reference for your `MemoryComponent` implementations.

```go
// Memory represents a simple memory model for the EVM.
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
	// ... (implementation details)
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// GasCost returns the gas cost of the last memory resize operation.
func (m *Memory) GasCost() uint64 {
	return m.lastGasCost
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/params/config.go">
This file defines the `ChainConfig` struct, which is the primary mechanism in go-ethereum for configuring which hardfork rules are active. The block numbers for each fork determine which `JumpTable` the interpreter will use. This is a high-level configuration that directly influences the interpreter's behavior, similar to your `InterpreterConfig`.

```go
// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether formulating chains passing DAOForkBlock logic is supported

	// EIP150 implements the Gas price changes for IO-heavy operations gas repricing.
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"` // EIP150 HF hash (needed for header only clients as only BlockNo is not enough)

	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	ByzantiumBlock      *big.Int `json:"byzantiumBlock,omitempty"`      // Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"` // Constantinople switch block (nil = no fork, 0 = already activated)
	PetersburgBlock     *big.Int `json:"petersburgBlock,omitempty"`     // Petersburg switch block (nil = no fork, 0 = already activated)
	IstanbulBlock       *big.Int `json:"istanbulBlock,omitempty"`       // Istanbul switch block (nil = no fork, 0 = already on istanbul)
	MuirGlacierBlock    *big.Int `json:"muirGlacierBlock,omitempty"`    // Muir Glacier switch block (nil = no fork, 0 = already on muir glacier)
	BerlinBlock         *big.Int `json:"berlinBlock,omitempty"`         // Berlin switch block (nil = no fork, 0 = already on berlin)
	LondonBlock         *big.Int `json:"londonBlock,omitempty"`         // London switch block (nil = no fork, 0 = already on london)
	ArrowGlacierBlock   *big.Int `json:"arrowGlacierBlock,omitempty"`   // Arrow Glacier switch block (nil = no fork, 0 = already on arrow glacier)
	GrayGlacierBlock    *big.Int `json:"grayGlacierBlock,omitempty"`    // Gray Glacier switch block (nil = no fork, 0 = already on gray glacier)
	MergeNetsplitBlock  *big.Int `json:"mergeNetsplitBlock,omitempty"`  // Virtual fork after The Merge to use fork choice rules from consensus layer

	// TerminalTotalDifficulty is the total difficulty marker for The Merge.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag that indicates the terminal PoW
	// block has been produced and the chain is running in PoS mode.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// The following fields are optional extensions to the basic ChainConfig
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"` // Shanghai switch time (nil = no fork, 0 = already on shanghai)
	CancunTime   *uint64 `json:"cancunTime,omitempty"`   // Cancun switch time (nil = no fork, 0 = already on cancun)
	PragueTime   *uint64 `json:"pragueTime,omitempty"`   // Prague switch time (nil = no fork, 0 = already on prague)
	VerkleTime   *uint64 `json:"verkleTime,omitempty"`   // Verkle switch time (nil = no fork, 0 = already on verkle)
	// ... (other engine and consensus configs)
}
```
</file>

## Prompt Corrections
The original prompt is exceptionally well-written and detailed. It describes a sophisticated and modular EVM architecture. Rather than corrections, here are some observations on how the proposed design aligns with go-ethereum's implementation, which should provide confidence in the chosen direction:

1.  **Execution Strategy (`JumpTable`)**: Your `ExecutionStrategy::JumpTable` concept is precisely how go-ethereum implements its opcode dispatch for different hardforks. The `core/vm/jump_table.go` file shows this pattern in action, where different functions construct `JumpTable` arrays based on the active `ChainConfig`. This is a proven, high-performance approach.

2.  **Interpreter Types (`Debug`, `Tracing`)**: Your idea of specialized interpreter types for debugging and tracing is mirrored by go-ethereum's `EVMLogger` interface (in `core/vm/logger.go`). When the `Interpreter.Config.Tracer` field is set, the interpreter calls hooks on this logger at every step, effectively changing its behavior to a "tracing" mode. Your design of swapping out entire components is a powerful extension of this concept.

3.  **Component Interfaces**: Your use of `union(enum)` in Zig to create component interfaces like `StackComponent` and `MemoryComponent` is a fantastic, modern way to achieve polymorphism. It's conceptually equivalent to go-ethereum's use of Go interfaces, but often with better performance characteristics, making it an excellent choice for a low-level EVM implementation.

The architecture you've outlined is robust and shares many core design principles with one of the most widely used and battle-tested EVM implementations. The provided go-ethereum snippets should serve as a strong practical reference for implementing these components.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
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
	"errors"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/params"
	"github.com/holiman/uint256"
)

var (
	errGasUintOverflow = errors.New("gas uint64 overflow")
	errStopToken       = errors.New("stop token")
)

// Config are the configuration options for the Interpreter.
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op logger
	Tracer Tracer
	// NoBaseFee disables base fee checks on txs, it is needed for some tests.
	NoBaseFee bool
	// EnablePreimageRecording switches on SHA3 pre-image recording.
	EnablePreimageRecording bool

	// JumpTable contains the EVM instruction table.
	// If nil, the EVM default jump table will be used.
	JumpTable *JumpTable
}

// Interpreter is a EVM interpreter for executing EVM bytecode.
type Interpreter struct {
	// The read-only contract calling the interpreter
	contract *Contract
	// The read-only interpreter configuration
	cfg Config

	evm *EVM

	// The stack of this interpreter
	stack *Stack
	// The memory of this interpreter
	memory *Memory

	// output is the return data of the interpreter
	output []byte
	// err is the error of the interpreter
	err error

	// gas is the gas available for the current execution
	gas uint64
	// gasUsed is the gas used by the current execution
	gasUsed uint64
}

// NewInterpreter returns a new interpreter
func NewInterpreter(evm *EVM, contract *Contract, cfg *Config) *Interpreter {
	var i Config
	if cfg != nil {
		i = *cfg
	}
	if i.JumpTable == nil {
		// We use the jump table from the EVM.
		// On the DEV-chain, it might be a custom jump table.
		i.JumpTable = evm.GetJumpTable()
	}
	return &Interpreter{
		evm:      evm,
		cfg:      i,
		contract: contract,
		gas:      contract.Gas,
	}
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for stop, return
// and revert opcodes.
func (in *Interpreter) Run(input []byte) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() {
		in.evm.depth--
	}()

	// Don't bother with the execution if the depth limit is reached.
	if in.evm.depth > int(params.CallCreateDepth) {
		return nil, ErrDepth
	}
	// Make sure the interpreter is not closed.
	// This is a struct-is-fine check, but it doesn't cost a lot to check and might help debugging.
	if in.evm.interpreter != nil {
		panic("evm: interpreter already running")
	}
	in.evm.interpreter = in
	defer func() { in.evm.interpreter = nil }()

	// Give the tracer a chance to realise the call start
	if in.cfg.Tracer != nil {
		in.cfg.Tracer.CaptureStart(in.evm, in.contract.Address(), in.contract.Caller(), input, in.gas, Call)
		// Defer the finish-trace, so we can overwrite the error if it was a revert.
		defer func() {
			if err != nil {
				// Don't bother tracing it if the error is a stop token, which is used to indicate a
				// graceful abort.
				if errors.Is(err, errStopToken) {
					return
				}
				// In case of a revert, still trace the call ending, but with the data from the revert.
				if reverted, data := unwrapRevert(err); reverted {
					in.cfg.Tracer.CaptureEnd(in.output, in.gas-in.gasUsed, 0, data)
				} else {
					in.cfg.Tracer.CaptureFault(in.evm.pc, in.evm.currentOp, in.gas, in.gasUsed, in.memory, in.stack, in.contract, in.evm.depth, err)
				}
			} else {
				in.cfg.Tracer.CaptureEnd(in.output, in.gas-in.gasUsed, 0, nil)
			}
		}()
	}
	in.stack = NewStack()
	in.memory = NewMemory()
	in.contract.Input = input
	// Assign per-call gas.
	in.gas = in.contract.Gas

	// Here we check if it's a timeout-based interrupt.
	// It's a bit of a hack to put it here, but it's the only place where we
	// can do it before the loop starts.
	// We don't need to do this on a per-opcode basis, because the starting of
	// a new contract call is a good entry-point for this.
	// After this point, the only way to abort is via `Stop()`.
	select {
	case <-in.evm.cancel:
		return nil, errStopToken // It's a graceful abort, so we just pass the stop token up.
	default:
	}

	var (
		op          OpCode        // current opcode
		mem         = in.memory   // bound memory
		stack       = in.stack    // bound stack
		callContext = in.contract // needed for gas calculation
		// For optimisation, we have a safe-guard to check that the OpCode below is not a jump.
		op = in.contract.GetOp(in.evm.pc)
		jt = in.cfg.JumpTable
	)
	// Don't use defer for this, it's too slow.
	defer func() {
		ReturnStack(stack)
		in.memory.Resize(0)
		in.memory = nil
	}()
	for {
		if in.err != nil {
			return nil, in.err
		}
		// Get operation from jump table
		operation := jt[op]
		if operation == nil {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Validate memory size
		if operation.memorySize != nil {
			mSize, overflow := operation.memorySize(stack)
			if overflow {
				return nil, ErrGasUintOverflow
			}
			if mSize > 0 {
				if err := mem.Resize(mSize); err != nil {
					return nil, err
				}
			}
		}
		// Use gas
		if err := in.useGas(operation.gas, mem); err != nil {
			return nil, err
		}

		if in.cfg.Debug {
			in.cfg.Tracer.CaptureState(in.evm.pc, op, in.gas, in.gasUsed, in.memory, in.stack, in.contract, in.evm.depth, nil)
		}

		// execute the operation
		res, err := operation.execute(&in.evm.pc, in, callContext)
		if err != nil {
			return nil, err
		}
		in.output = res
		// op can be changed by operation.execute, thus it can't be relied on here.
		// So we have to fetch it again.
		op = in.contract.GetOp(in.evm.pc)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/jumptable.go">
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
	"github.com/ethereum/go-ethereum/params"
)

// JumpTable contains the EVM opcodes supported by the interpreter.
type JumpTable [256]*operation

// newFrontierInstructionSet returns the frontier EIPs-only Homestead instruction set.
func newFrontierInstructionSet() *JumpTable {
	return &JumpTable{
		STOP:           &opStop,
		ADD:            &opAdd,
		MUL:            &opMul,
		// ... (many opcodes) ...
		SELFDESTRUCT:   &opSelfdestruct,
	}
}

// newHomesteadInstructionSet returns the frontier EIPs-only Homestead instruction set.
func newHomesteadInstructionSet() *JumpTable {
	return &JumpTable{
		STOP:           &opStop,
		ADD:            &opAdd,
		// ... (many opcodes) ...
		DELEGATECALL:   &opDelegateCall, // New DELEGATECALL opcode
		// ... (many opcodes) ...
		SELFDESTRUCT:   &opSelfdestruct,
	}
}

// newByzantiumInstructionSet returns the Byzantium instruction set.
func newByzantiumInstructionSet() *JumpTable {
	return &JumpTable{
		STOP:           &opStop,
		// ... (many opcodes) ...
		RETURNDATASIZE: &opReturnDataSize, // New opcodes for Byzantium
		RETURNDATACOPY: &opReturnDataCopy,
		STATICCALL:     &opStaticCall,
		REVERT:         &opRevert,
		// ... (many opcodes) ...
		SELFDESTRUCT:   &opSelfdestruct,
	}
}

// newConstantinopleInstructionSet returns the Constantinople instruction set.
func newConstantinopleInstructionSet() *JumpTable {
	return &JumpTable{
		// ... (opcodes from byzantium) ...
		SHL:           &opShl,           // New opcodes for Constantinople
		SHR:           &opShr,
		SAR:           &opSar,
		EXTCODEHASH:   &opExtCodeHash,
		CREATE2:       &opCreate2,
		// ...
	}
}

// newShanghaiInstructionSet returns the Shanghai instruction set.
func newShanghaiInstructionSet() *JumpTable {
	// a copy of the London instruction set
	shanghai := *newLondonInstructionSet()
	shanghai[PUSH0] = &opPush0 // New PUSH0 opcode
	return &shanghai
}


// newCancunInstructionSet returns the Cancun instruction set.
func newCancunInstructionSet() *JumpTable {
	// a copy of the Shanghai instruction set
	cancun := *newShanghaiInstructionSet()
	cancun[TLOAD] = &opTload
	cancun[TSTORE] = &opTstore
	cancun[MCOPY] = &opMcopy
	cancun[BLOBHASH] = &opBlobHash
	cancun[BLOBBASEFEE] = &opBlobBaseFee
	return &cancun
}


var (
	frontierInstructionSet      = newFrontierInstructionSet()
	homesteadInstructionSet     = newHomesteadInstructionSet()
	byzantiumInstructionSet     = newByzantiumInstructionSet()
	constantinopleInstructionSet= newConstantinopleInstructionSet()
	shanghaiInstructionSet      = newShanghaiInstructionSet()
	cancunInstructionSet        = newCancunInstructionSet()
	pragueInstructionSet        = newPragueInstructionSet()
)

// JumpTable returns the jump table for the given short chain configuration.
func JumpTableEx(rules *params.Rules, jt *JumpTable) *JumpTable {
	// If a custom jump table is provided, it is always used
	if jt != nil {
		return jt
	}
	switch {
	case rules.IsPrague:
		return pragueInstructionSet
	case rules.IsCancun:
		return cancunInstructionSet
	case rules.IsShanghai:
		return shanghaiInstructionSet
	case rules.IsLondon:
		return londonInstructionSet
	// ... (other hardforks) ...
	case rules.IsHomestead:
		return homesteadInstructionSet
	default:
		return frontierInstructionSet
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/stack.go">
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

	"github.com/holiman/uint256"
)

// Stack is an object for basic stack operations.
type Stack struct {
	data []*uint256.Int
}

// NewStack returns a new stack with a backing store of size 1024.
func NewStack() *Stack {
	return &Stack{data: make([]*uint256.Int, 0, 1024)}
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []*uint256.Int {
	return st.data
}

// push pushes a new element to the stack.
func (st *Stack) push(d *uint256.Int) {
	st.data = append(st.data, d)
}

// Pop pops the top element from the stack and returns it.
func (st *Stack) Pop() (ret *uint256.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// Len returns the number of elements in the stack.
func (st *Stack) Len() int {
	return len(st.data)
}

// Swap swaps the top element with the n-th element from the top.
func (st *Stack) Swap(n int) {
	st.data[len(st.data)-1], st.data[len(st.data)-n-1] = st.data[len(st.data)-n-1], st.data[len(st.data)-1]
}

// Dup duplicates the n-th element from the top of the stack.
func (st *Stack) Dup(n int) {
	st.push(st.data[len(st.data)-n])
}

// Peek returns the n-th element from the top of the stack.
func (st *Stack) Peek(n int) *uint256.Int {
	return st.data[len(st.data)-1-n]
}

// Back returns the n-th element from the stack.
// (Note, this is n from the bottom of the stack)
func (st *Stack) Back(n int) *uint256.Int {
	return st.data[n]
}

// require ensures that the stack has at least `n` elements.
func (st *Stack) require(n int) error {
	if st.Len() < n {
		return fmt.Errorf("stack underflow (%d < %d)", st.Len(), n)
	}
	return nil
}

// Print prints the stack in a human-readable format.
func (st *Stack) Print() {
	fmt.Printf("### STACK ###\n")
	if len(st.data) > 0 {
		for i, val := range st.data {
			fmt.Printf("%-3d  %v\n", i, val)
		}
	} else {
		fmt.Printf("-- empty --\n")
	}
	fmt.Printf("#############\n")
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/memory_table.go">
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
	"github.com/ethereum/go-ethereum/common/bits"
	"github.com/ethereum/go-ethereum/params"
	"github.com/holiman/uint256"
)

// Memory is a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset + size to value
func (m *Memory) Set(offset, size uint64, value []byte) {
	// It's possible the offset is greater than the size of the memory,
	// in which case we need to extend the memory.
	if offset+size > uint64(len(m.store)) {
		// The offset can be very large, and we don't want to allocate something
		// that we know will go OOM anyway.
		// NOTE: The size of memory is capped at 4GB by the EVM spec.
		if offset+size > 4*1024*1024*1024 {
			panic("invalid memory address or size")
		}
		// Calculate the new size of the memory. This will be the smallest multiple
		// of 32 that is greater than or equal to the requested size.
		newSize := (offset + size + 31) / 32 * 32
		// Check that the new size does not exceed the maximum memory size.
		if newSize > params.MaxMemorySize {
			newSize = params.MaxMemorySize
		}
		// If we need to extend the memory, we'll do so, and copy the existing data.
		if newSize > uint64(len(m.store)) {
			// This can't overflow, we have it capped at 4GB.
			newStore := make([]byte, newSize)
			copy(newStore, m.store)
			m.store = newStore
		}
	}
	// The memory is now large enough, so we can copy the value.
	copy(m.store[offset:offset+size], value)
}

// Resize resizes the memory to the given size.
func (m *Memory) Resize(size uint64) error {
	if size > params.MaxMemorySize {
		return ErrOOM
	}
	if uint64(len(m.store)) < size {
		// This can't overflow, we have it capped at 4GB.
		newMem := make([]byte, size)
		copy(newMem, m.store)
		m.store = newMem
	}
	return nil
}

// Get returns offset + size as a new slice.
func (m *Memory) Get(offset, size int64) (cpy []byte) {
	if size == 0 {
		return nil
	}
	if int64(len(m.store)) > offset {
		cpy = make([]byte, size)
		copy(cpy, m.store[offset:offset+size])
		return
	}
	return nil
}

// GetPtr returns a slice that references the memory.
func (m *Memory) GetPtr(offset, size int64) []byte {
	if size == 0 {
		return nil
	}
	if int64(len(m.store)) > offset {
		return m.store[offset : offset+size]
	}
	return nil
}

// Len returns the length of the backing slice.
func (m *Memory) Len() int {
	return len(m.store)
}

// Data returns the backing slice.
func (m *Memory) Data() []byte {
	return m.store
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/logger.go">
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
	"io"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/holiman/uint256"
)

// Tracer is a generic interface for tracing EVM execution. It is called by the
// EVM at various points during execution and is responsible for recording any
// information that is desired.
//
// The Tracer interface is composed of a number of smaller interfaces, which are
// used to trace different aspects of the EVM. A Tracer can implement any number
// of these interfaces, and the EVM will call the appropriate methods for the
// interfaces that are implemented.
type Tracer interface{}

// EVMLogger is an interface that can be implemented by a tracer to trace EVM
// execution.
type EVMLogger interface {
	// CaptureStart is called when an execution starts.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureState is called for each step of the EVM, before the operation is
	// executed.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an
	// operation.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnd is called when an execution ends.
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)

	// CaptureEnter is called when a new frame is entered.
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when a frame is exited.
	CaptureExit(output []byte, gasUsed uint64, err error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/params/config.go">
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

package params

import (
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
)

// ChainConfig is the core config which determines the blockchain settings.
//
// ChainConfig is stored in the database on a per block basis. This means
// that any network, identified by its genesis block, can have its own
// set of configuration options.
type ChainConfig struct {
	ChainID *big.Int `json:"chainId"` // chainId identifies the current chain and is used for replay protection

	HomesteadBlock *big.Int `json:"homesteadBlock,omitempty"` // Homestead switch block (nil = no fork, 0 = already homestead)
	DAOForkBlock   *big.Int `json:"daoForkBlock,omitempty"`   // TheDAO hard-fork switch block (nil = no fork)
	DAOForkSupport bool     `json:"daoForkSupport,omitempty"` // Whether processiDAOForkSupportng TheDAO transactions is supported

	// EIP150 implements the Gas price changes for IO-heavy operations gas price changes for IO-heavy operations
	// (https://github.com/ethereum/EIPs/pull/150)
	EIP150Block *big.Int `json:"eip150Block,omitempty"` // EIP150 HF block (nil = no fork)
	EIP150Hash  common.Hash `json:"eip150Hash,omitempty"`  // EIP150 HF hash (needed for header only clients as only gas pricing changed)

	// EIP155 implements Simple replay attack protection
	// (https://github.com/ethereum/EIPs/pull/155)
	EIP155Block *big.Int `json:"eip155Block,omitempty"` // EIP155 HF block

	// EIP158 implements Spurious Dragon hard fork changes
	// (https://github.com/ethereum/EIPs/pull/158)
	EIP158Block *big.Int `json:"eip158Block,omitempty"` // EIP158 HF block

	// Byzantium switch block (nil = no fork, 0 = already on byzantium)
	ByzantiumBlock *big.Int `json:"byzantiumBlock,omitempty"`

	// Constantinople switch block (nil = no fork, 0 = already activated)
	ConstantinopleBlock *big.Int `json:"constantinopleBlock,omitempty"`

	// Petersburg switch block (nil = same as Constantinople)
	PetersburgBlock *big.Int `json:"petersburgBlock,omitempty"`

	// Istanbul switch block (nil = no fork, 0 = already on istanbul)
	IstanbulBlock *big.Int `json:"istanbulBlock,omitempty"`

	// Muir Glacier switch block (nil = no fork, 0 = already on muirglacier)
	MuirGlacierBlock *big.Int `json:"muirGlacierBlock,omitempty"`

	// Berlin switch block (nil = no fork, 0 = already on berlin)
	BerlinBlock *big.Int `json:"berlinBlock,omitempty"`

	// London switch block (nil = no fork, 0 = already on london)
	LondonBlock *big.Int `json:"londonBlock,omitempty"`

	// Arrow Glacier switch block (nil = no fork, 0 = already on arrowglacier)
	ArrowGlacierBlock *big.Int `json:"arrowGlacierBlock,omitempty"`

	// Gray Glacier switch block (nil = no fork, 0 = already on grayglacier)
	GrayGlacierBlock *big.Int `json:"grayGlacierBlock,omitempty"`

	// MergeNetsplit switch block (nil = no fork, 0 = already on mergenetsplit)
	MergeNetsplitBlock *big.Int `json:"mergeNetsplitBlock,omitempty"`

	// Shanghai switch block (nil = no fork, 0 = already on shanghai)
	ShanghaiTime *uint64 `json:"shanghaiTime,omitempty"`

	// Cancun switch block (nil = no fork, 0 = already on cancun)
	CancunTime *uint64 `json:"cancunTime,omitempty"`

	// Prague switch block (nil = no fork, 0 = already on prague)
	PragueTime *uint64 `json:"pragueTime,omitempty"`

	// FutureEIPS switch block (nil = no fork, 0 = already on future)
	FutureEipsTime *uint64 `json:"futureEipsTime,omitempty"`

	// TerminalTotalDifficulty is the total difficulty at which the network transitions
	// from Proof of Work to Proof of Stake.
	TerminalTotalDifficulty *big.Int `json:"terminalTotalDifficulty,omitempty"`

	// TerminalTotalDifficultyPassed is a flag indicating that the TTD has been successfully passed.
	TerminalTotalDifficultyPassed bool `json:"terminalTotalDifficultyPassed,omitempty"`

	// Various consensus engines
	Ethash *EthashConfig `json:"ethash,omitempty"`
	Clique *CliqueConfig `json:"clique,omitempty"`
}

// Rules is a set of rules based on a given ChainConfig and block number.
// The rules are not tied to a block number, but to a forum.
type Rules struct {
	ChainID                                                                    *big.Int
	IsHomestead, IsEIP150, IsEIP155, IsEIP158, IsByzantium, IsConstantinople, IsPetersburg, IsIstanbul, IsMuirGlacier,
	IsBerlin, IsLondon, IsArrowGlacier, IsGrayGlacier, IsMergeNetsplit, IsShanghai, IsCancun, IsPrague bool
}

// Rules retrieves the fork configuration rules for a given block number.
func (c *ChainConfig) Rules(num *big.Int, time uint64) Rules {
	chainID := c.ChainID
	if chainID == nil {
		chainID = new(big.Int)
	}
	return Rules{
		ChainID:          new(big.Int).Set(chainID),
		IsHomestead:      c.IsHomestead(num),
		IsEIP150:         c.IsEIP150(num),
		IsEIP155:         c.IsEIP155(num),
		IsEIP158:         c.IsEIP158(num),
		IsByzantium:      c.IsByzantium(num),
		IsConstantinople: c.IsConstantinople(num),
		IsPetersburg:     c.IsPetersburg(num),
		IsIstanbul:       c.IsIstanbul(num),
		IsMuirGlacier:    c.IsMuirGlacier(num),
		IsBerlin:         c.IsBerlin(num),
		IsLondon:         c.IsLondon(num),
		IsArrowGlacier:   c.IsArrowGlacier(num),
		IsGrayGlacier:    c.IsGrayGlacier(num),
		IsMergeNetsplit:  c.IsMergeNetsplit(num),
		IsShanghai:       c.IsShanghai(num, time),
		IsCancun:         c.IsCancun(num, time),
		IsPrague:         c.IsPrague(num, time),
	}
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt outlines a highly modular and dynamic "Interpreter Types System" that allows for runtime or compile-time swapping of core EVM components like the stack, memory, and execution engine. This is a sophisticated and flexible design.

The go-ethereum (Geth) implementation, being a mature and performance-optimized codebase, approaches this configurability differently:

1.  **Interpreter Configuration**: Geth primarily uses the `params.ChainConfig` struct to manage different EVM behaviors. This configuration is determined by the chain's hardfork schedule (`IsShanghai`, `IsCancun`, etc.). This effectively creates different "interpreter types" based on the block number and timestamp, but it's not a freely selectable system as proposed in the prompt. For debugging and tracing, Geth uses a `vm.Config` object, which enables tracers (`EVMLogger`) that can inspect the EVM's state at each step. This is analogous to the `InterpreterType.Debug` or `InterpreterType.Tracing` but is implemented as a wrapper/observer pattern rather than a completely separate interpreter implementation.

2.  **Execution Strategy**: Geth uses a single, highly optimized execution strategy based on a `JumpTable`. It does not have options for `DirectCall`, `ComputedGoto`, etc., as these would likely be less performant for the Go runtime. The jump table is reconfigured based on the active hardfork, which enables or disables certain opcodes. This is the primary mechanism for changing execution behavior.

3.  **Stack and Memory**: Geth has single, well-optimized implementations for the `Stack` and `Memory`. There aren't different versions to select from (e.g., `MinimalStack`, `DebugStack`). The provided implementations are production-grade and serve as an excellent reference for a standard, performant component.

4.  **Adaptive Switching**: Geth does not implement any form of adaptive or learning-based switching of its core components at runtime. The configuration is static for the duration of a transaction's execution, determined by the block's context. The concept of a `TypeSelector` that learns from a `PerformanceProfiler` is a novel idea not present in Geth.

In summary, while Geth achieves configurability for different EVM rules and debugging needs, it does so through hardfork rules and tracer configurations rather than a plug-and-play component system. The provided Go code snippets should serve as a strong reference for implementing individual, high-performance components (like a jump table, stack, and memory) and for understanding how a production EVM handles configuration changes across different network upgrades.

