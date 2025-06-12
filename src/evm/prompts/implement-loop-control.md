# Implement Loop Control

You are implementing Loop Control for the Tevm EVM written in Zig. Your goal is to implement loop control mechanisms for execution safety following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_loop_control` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_loop_control feat_implement_loop_control`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a comprehensive loop control system that provides advanced loop management capabilities including break/continue semantics, loop optimization, nested loop support, and loop-invariant code motion. This enables more efficient contract execution patterns and better optimization opportunities while maintaining EVM compatibility and gas accounting accuracy.

## ELI5

Loop control is like having a smart traffic management system for repetitive operations in smart contracts. Just like traffic lights control the flow of cars through intersections, loop control manages how code repeats and when it should stop, skip ahead, or take detours. This system helps organize complex repetitive tasks and prevents infinite loops that could waste gas, while also optimizing frequently-used patterns to run faster.

## Loop Control Specifications

### Core Loop Framework

#### 1. Loop Control Manager
```zig
pub const LoopControlManager = struct {
    allocator: std.mem.Allocator,
    config: LoopConfig,
    loop_stack: LoopStack,
    loop_registry: LoopRegistry,
    optimization_engine: LoopOptimizationEngine,
    performance_tracker: LoopPerformanceTracker,
    gas_tracker: LoopGasTracker,
    
    pub const LoopConfig = struct {
        enable_loop_control: bool,
        max_loop_depth: u32,
        max_loop_iterations: u64,
        enable_loop_optimization: bool,
        enable_invariant_hoisting: bool,
        enable_loop_unrolling: bool,
        enable_break_continue: bool,
        gas_limit_per_iteration: u64,
        optimization_threshold: u32,
        
        pub fn production() LoopConfig {
            return LoopConfig{
                .enable_loop_control = true,
                .max_loop_depth = 64,
                .max_loop_iterations = 1000000,
                .enable_loop_optimization = true,
                .enable_invariant_hoisting = true,
                .enable_loop_unrolling = true,
                .enable_break_continue = true,
                .gas_limit_per_iteration = 10000,
                .optimization_threshold = 100,
            };
        }
        
        pub fn development() LoopConfig {
            return LoopConfig{
                .enable_loop_control = true,
                .max_loop_depth = 32,
                .max_loop_iterations = 100000,
                .enable_loop_optimization = false,
                .enable_invariant_hoisting = false,
                .enable_loop_unrolling = false,
                .enable_break_continue = true,
                .gas_limit_per_iteration = 5000,
                .optimization_threshold = 50,
            };
        }
        
        pub fn testing() LoopConfig {
            return LoopConfig{
                .enable_loop_control = true,
                .max_loop_depth = 8,
                .max_loop_iterations = 1000,
                .enable_loop_optimization = false,
                .enable_invariant_hoisting = false,
                .enable_loop_unrolling = false,
                .enable_break_continue = true,
                .gas_limit_per_iteration = 1000,
                .optimization_threshold = 10,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: LoopConfig) !LoopControlManager {
        return LoopControlManager{
            .allocator = allocator,
            .config = config,
            .loop_stack = try LoopStack.init(allocator, config.max_loop_depth),
            .loop_registry = try LoopRegistry.init(allocator),
            .optimization_engine = try LoopOptimizationEngine.init(allocator, config),
            .performance_tracker = LoopPerformanceTracker.init(),
            .gas_tracker = LoopGasTracker.init(config.gas_limit_per_iteration),
        };
    }
    
    pub fn deinit(self: *LoopControlManager) void {
        self.loop_stack.deinit();
        self.loop_registry.deinit();
        self.optimization_engine.deinit();
    }
    
    pub fn enter_loop(self: *LoopControlManager, loop_info: LoopInfo) !LoopContext {
        if (!self.config.enable_loop_control) {
            return error.LoopControlDisabled;
        }
        
        // Check loop depth
        if (self.loop_stack.depth() >= self.config.max_loop_depth) {
            return error.LoopDepthExceeded;
        }
        
        // Create loop context
        const loop_id = try self.loop_registry.register_loop(loop_info);
        const loop_context = try LoopContext.init(
            self.allocator,
            loop_id,
            loop_info,
            self.loop_stack.depth()
        );
        
        // Push to loop stack
        try self.loop_stack.push(loop_context);
        
        // Initialize gas tracking
        self.gas_tracker.start_loop(loop_id);
        
        // Check for optimization opportunities
        if (self.config.enable_loop_optimization) {
            try self.optimization_engine.analyze_loop(&loop_context);
        }
        
        self.performance_tracker.record_loop_entry(loop_id);
        
        return loop_context;
    }
    
    pub fn exit_loop(self: *LoopControlManager) !void {
        if (self.loop_stack.is_empty()) {
            return error.NoActiveLoop;
        }
        
        var loop_context = try self.loop_stack.pop();
        defer loop_context.deinit();
        
        // Finalize gas tracking
        const gas_used = self.gas_tracker.end_loop(loop_context.loop_id);
        
        // Record performance metrics
        self.performance_tracker.record_loop_exit(
            loop_context.loop_id,
            loop_context.iteration_count,
            gas_used
        );
        
        // Apply optimizations if beneficial
        if (self.config.enable_loop_optimization and 
            loop_context.iteration_count >= self.config.optimization_threshold) {
            try self.optimization_engine.optimize_loop(loop_context.loop_id);
        }
    }
    
    pub fn execute_iteration(self: *LoopControlManager) !IterationResult {
        const current_loop = self.loop_stack.peek() orelse {
            return error.NoActiveLoop;
        };
        
        // Check iteration limit
        if (current_loop.iteration_count >= self.config.max_loop_iterations) {
            return IterationResult{ .action = .Break, .reason = .IterationLimitExceeded };
        }
        
        // Check gas limit
        if (!self.gas_tracker.check_iteration_gas_limit(current_loop.loop_id)) {
            return IterationResult{ .action = .Break, .reason = .GasLimitExceeded };
        }
        
        // Update iteration count
        current_loop.iteration_count += 1;
        
        // Record iteration metrics
        self.performance_tracker.record_iteration(current_loop.loop_id);
        
        return IterationResult{ .action = .Continue, .reason = .Normal };
    }
    
    pub fn break_loop(self: *LoopControlManager, levels: u32) !void {
        if (!self.config.enable_break_continue) {
            return error.BreakContinueDisabled;
        }
        
        if (levels == 0 or levels > self.loop_stack.depth()) {
            return error.InvalidBreakLevels;
        }
        
        // Break out of specified number of loop levels
        var remaining_levels = levels;
        while (remaining_levels > 0 and !self.loop_stack.is_empty()) {
            try self.exit_loop();
            remaining_levels -= 1;
        }
    }
    
    pub fn continue_loop(self: *LoopControlManager) !void {
        if (!self.config.enable_break_continue) {
            return error.BreakContinueDisabled;
        }
        
        const current_loop = self.loop_stack.peek() orelse {
            return error.NoActiveLoop;
        };
        
        // Mark as continue (affects control flow)
        current_loop.continue_requested = true;
        
        self.performance_tracker.record_continue(current_loop.loop_id);
    }
    
    pub fn get_current_loop(self: *const LoopControlManager) ?*const LoopContext {
        return self.loop_stack.peek();
    }
    
    pub fn get_loop_depth(self: *const LoopControlManager) u32 {
        return self.loop_stack.depth();
    }
    
    pub fn get_performance_metrics(self: *const LoopControlManager) LoopPerformanceTracker.Metrics {
        return self.performance_tracker.get_metrics();
    }
    
    pub const IterationResult = struct {
        action: Action,
        reason: Reason,
        
        pub const Action = enum {
            Continue,
            Break,
            Return,
        };
        
        pub const Reason = enum {
            Normal,
            IterationLimitExceeded,
            GasLimitExceeded,
            BreakRequested,
            ContinueRequested,
            ErrorOccurred,
        };
    };
};
```

#### 2. Loop Context and Stack
```zig
pub const LoopContext = struct {
    allocator: std.mem.Allocator,
    loop_id: u32,
    loop_info: LoopInfo,
    depth: u32,
    iteration_count: u64,
    continue_requested: bool,
    break_requested: bool,
    entry_pc: u32,
    exit_pc: u32,
    condition_pc: u32,
    increment_pc: u32,
    local_variables: std.HashMap(u16, u256, VariableContext, std.hash_map.default_max_load_percentage),
    invariant_values: std.HashMap(u16, u256, VariableContext, std.hash_map.default_max_load_percentage),
    gas_checkpoint: u64,
    creation_time: u64,
    
    pub fn init(
        allocator: std.mem.Allocator,
        loop_id: u32,
        loop_info: LoopInfo,
        depth: u32
    ) !LoopContext {
        return LoopContext{
            .allocator = allocator,
            .loop_id = loop_id,
            .loop_info = loop_info,
            .depth = depth,
            .iteration_count = 0,
            .continue_requested = false,
            .break_requested = false,
            .entry_pc = loop_info.entry_pc,
            .exit_pc = loop_info.exit_pc,
            .condition_pc = loop_info.condition_pc,
            .increment_pc = loop_info.increment_pc,
            .local_variables = std.HashMap(u16, u256, VariableContext, std.hash_map.default_max_load_percentage).init(allocator),
            .invariant_values = std.HashMap(u16, u256, VariableContext, std.hash_map.default_max_load_percentage).init(allocator),
            .gas_checkpoint = 0,
            .creation_time = @intCast(std.time.milliTimestamp()),
        };
    }
    
    pub fn deinit(self: *LoopContext) void {
        self.local_variables.deinit();
        self.invariant_values.deinit();
    }
    
    pub fn set_local_variable(self: *LoopContext, index: u16, value: u256) !void {
        try self.local_variables.put(index, value);
    }
    
    pub fn get_local_variable(self: *const LoopContext, index: u16) ?u256 {
        return self.local_variables.get(index);
    }
    
    pub fn set_invariant(self: *LoopContext, index: u16, value: u256) !void {
        try self.invariant_values.put(index, value);
    }
    
    pub fn get_invariant(self: *const LoopContext, index: u16) ?u256 {
        return self.invariant_values.get(index);
    }
    
    pub fn should_continue(self: *const LoopContext) bool {
        return !self.break_requested;
    }
    
    pub fn should_skip_to_condition(self: *const LoopContext) bool {
        return self.continue_requested;
    }
    
    pub fn reset_control_flags(self: *LoopContext) void {
        self.continue_requested = false;
        self.break_requested = false;
    }
    
    pub fn get_execution_time(self: *const LoopContext) u64 {
        const current_time = @as(u64, @intCast(std.time.milliTimestamp()));
        return current_time - self.creation_time;
    }
    
    pub const VariableContext = struct {
        pub fn hash(self: @This(), key: u16) u64 {
            _ = self;
            return key;
        }
        
        pub fn eql(self: @This(), a: u16, b: u16) bool {
            _ = self;
            return a == b;
        }
    };
};

pub const LoopStack = struct {
    allocator: std.mem.Allocator,
    contexts: []LoopContext,
    top: u32,
    capacity: u32,
    
    pub fn init(allocator: std.mem.Allocator, capacity: u32) !LoopStack {
        const contexts = try allocator.alloc(LoopContext, capacity);
        
        return LoopStack{
            .allocator = allocator,
            .contexts = contexts,
            .top = 0,
            .capacity = capacity,
        };
    }
    
    pub fn deinit(self: *LoopStack) void {
        // Clean up any remaining contexts
        for (0..self.top) |i| {
            self.contexts[i].deinit();
        }
        self.allocator.free(self.contexts);
    }
    
    pub fn push(self: *LoopStack, context: LoopContext) !void {
        if (self.top >= self.capacity) {
            return error.LoopStackOverflow;
        }
        
        self.contexts[self.top] = context;
        self.top += 1;
    }
    
    pub fn pop(self: *LoopStack) !LoopContext {
        if (self.top == 0) {
            return error.LoopStackUnderflow;
        }
        
        self.top -= 1;
        return self.contexts[self.top];
    }
    
    pub fn peek(self: *const LoopStack) ?*const LoopContext {
        if (self.top == 0) {
            return null;
        }
        return &self.contexts[self.top - 1];
    }
    
    pub fn peek_mutable(self: *LoopStack) ?*LoopContext {
        if (self.top == 0) {
            return null;
        }
        return &self.contexts[self.top - 1];
    }
    
    pub fn depth(self: *const LoopStack) u32 {
        return self.top;
    }
    
    pub fn is_empty(self: *const LoopStack) bool {
        return self.top == 0;
    }
    
    pub fn get_context(self: *const LoopStack, depth: u32) ?*const LoopContext {
        if (depth >= self.top) {
            return null;
        }
        return &self.contexts[self.top - 1 - depth]; // 0 = current loop
    }
};
```

#### 3. Loop Information and Registry
```zig
pub const LoopInfo = struct {
    loop_type: LoopType,
    entry_pc: u32,
    exit_pc: u32,
    condition_pc: u32,
    increment_pc: u32,
    estimated_iterations: u64,
    loop_body_size: u32,
    has_break: bool,
    has_continue: bool,
    has_nested_loops: bool,
    variables_modified: []const u16,
    variables_read: []const u16,
    optimization_hints: OptimizationHints,
    
    pub const LoopType = enum {
        While,      // while (condition) { body }
        For,        // for (init; condition; increment) { body }
        DoWhile,    // do { body } while (condition)
        Infinite,   // loop { body } (with break/continue)
        Counted,    // for i in 0..n { body }
    };
    
    pub const OptimizationHints = struct {
        is_invariant_heavy: bool,    // Many loop-invariant operations
        is_short_body: bool,         // Small loop body (good for unrolling)
        is_high_iteration: bool,     // Expected high iteration count
        memory_access_pattern: MemoryAccessPattern,
        
        pub const MemoryAccessPattern = enum {
            Sequential,     // Sequential memory access
            Strided,       // Fixed stride access
            Random,        // Random access pattern
            None,          // No memory access
        };
    };
    
    pub fn analyze_optimization_potential(self: *LoopInfo) f64 {
        var score: f64 = 0;
        
        // Short body with high iterations = good for unrolling
        if (self.optimization_hints.is_short_body and self.optimization_hints.is_high_iteration) {
            score += 0.3;
        }
        
        // Invariant-heavy loops benefit from hoisting
        if (self.optimization_hints.is_invariant_heavy) {
            score += 0.2;
        }
        
        // Sequential memory access is optimization-friendly
        if (self.optimization_hints.memory_access_pattern == .Sequential) {
            score += 0.15;
        }
        
        // Nested loops have more complex optimization potential
        if (self.has_nested_loops) {
            score += 0.1;
        }
        
        // Break/continue reduces optimization potential
        if (self.has_break or self.has_continue) {
            score -= 0.1;
        }
        
        return @max(0, @min(1, score));
    }
};

pub const LoopRegistry = struct {
    allocator: std.mem.Allocator,
    loops: std.HashMap(u32, RegisteredLoop, LoopIdContext, std.hash_map.default_max_load_percentage),
    next_id: u32,
    optimization_cache: OptimizationCache,
    
    pub const RegisteredLoop = struct {
        id: u32,
        info: LoopInfo,
        execution_count: u64,
        total_iterations: u64,
        total_gas_used: u64,
        optimization_applied: bool,
        optimization_type: ?OptimizationType,
        performance_score: f64,
        
        pub const OptimizationType = enum {
            Unrolling,
            InvariantHoisting,
            StrengthReduction,
            VectorizationPrep,
        };
    };
    
    pub const OptimizationCache = struct {
        unrolled_loops: std.HashMap(u32, UnrolledLoop, LoopIdContext, std.hash_map.default_max_load_percentage),
        hoisted_invariants: std.HashMap(u32, []const InvariantOperation, LoopIdContext, std.hash_map.default_max_load_percentage),
        
        pub const UnrolledLoop = struct {
            original_loop_id: u32,
            unroll_factor: u32,
            unrolled_bytecode: []const u8,
            estimated_speedup: f64,
        };
        
        pub const InvariantOperation = struct {
            operation_type: u8, // opcode
            operands: []const u256,
            result_storage: u16, // where to store the computed result
        };
        
        pub fn init(allocator: std.mem.Allocator) OptimizationCache {
            return OptimizationCache{
                .unrolled_loops = std.HashMap(u32, UnrolledLoop, LoopIdContext, std.hash_map.default_max_load_percentage).init(allocator),
                .hoisted_invariants = std.HashMap(u32, []const InvariantOperation, LoopIdContext, std.hash_map.default_max_load_percentage).init(allocator),
            };
        }
        
        pub fn deinit(self: *OptimizationCache) void {
            // Clean up unrolled bytecode
            var unroll_iter = self.unrolled_loops.iterator();
            while (unroll_iter.next()) |entry| {
                self.unrolled_loops.allocator.free(entry.value_ptr.unrolled_bytecode);
            }
            
            // Clean up invariant operations
            var invariant_iter = self.hoisted_invariants.iterator();
            while (invariant_iter.next()) |entry| {
                for (entry.value_ptr.*) |operation| {
                    self.hoisted_invariants.allocator.free(operation.operands);
                }
                self.hoisted_invariants.allocator.free(entry.value_ptr.*);
            }
            
            self.unrolled_loops.deinit();
            self.hoisted_invariants.deinit();
        }
    };
    
    pub fn init(allocator: std.mem.Allocator) !LoopRegistry {
        return LoopRegistry{
            .allocator = allocator,
            .loops = std.HashMap(u32, RegisteredLoop, LoopIdContext, std.hash_map.default_max_load_percentage).init(allocator),
            .next_id = 1,
            .optimization_cache = OptimizationCache.init(allocator),
        };
    }
    
    pub fn deinit(self: *LoopRegistry) void {
        self.loops.deinit();
        self.optimization_cache.deinit();
    }
    
    pub fn register_loop(self: *LoopRegistry, info: LoopInfo) !u32 {
        const id = self.next_id;
        self.next_id += 1;
        
        const registered = RegisteredLoop{
            .id = id,
            .info = info,
            .execution_count = 0,
            .total_iterations = 0,
            .total_gas_used = 0,
            .optimization_applied = false,
            .optimization_type = null,
            .performance_score = info.analyze_optimization_potential(),
        };
        
        try self.loops.put(id, registered);
        return id;
    }
    
    pub fn get_loop(self: *const LoopRegistry, id: u32) ?*const RegisteredLoop {
        return self.loops.getPtr(id);
    }
    
    pub fn update_loop_stats(self: *LoopRegistry, id: u32, iterations: u64, gas_used: u64) void {
        if (self.loops.getPtr(id)) |loop| {
            loop.execution_count += 1;
            loop.total_iterations += iterations;
            loop.total_gas_used += gas_used;
        }
    }
    
    pub fn get_optimization(self: *const LoopRegistry, id: u32) ?OptimizationInfo {
        if (self.optimization_cache.unrolled_loops.get(id)) |unrolled| {
            return OptimizationInfo{
                .type = .Unrolling,
                .unrolled_code = unrolled.unrolled_bytecode,
                .speedup_estimate = unrolled.estimated_speedup,
            };
        }
        
        if (self.optimization_cache.hoisted_invariants.get(id)) |invariants| {
            return OptimizationInfo{
                .type = .InvariantHoisting,
                .hoisted_operations = invariants,
                .speedup_estimate = @as(f64, @floatFromInt(invariants.len)) * 0.1,
            };
        }
        
        return null;
    }
    
    pub const OptimizationInfo = struct {
        type: RegisteredLoop.OptimizationType,
        unrolled_code: ?[]const u8 = null,
        hoisted_operations: ?[]const OptimizationCache.InvariantOperation = null,
        speedup_estimate: f64,
    };
    
    pub const LoopIdContext = struct {
        pub fn hash(self: @This(), key: u32) u64 {
            _ = self;
            return key;
        }
        
        pub fn eql(self: @This(), a: u32, b: u32) bool {
            _ = self;
            return a == b;
        }
    };
};
```

#### 4. Loop Optimization Engine
```zig
pub const LoopOptimizationEngine = struct {
    allocator: std.mem.Allocator,
    config: LoopControlManager.LoopConfig,
    unroller: LoopUnroller,
    invariant_analyzer: InvariantAnalyzer,
    strength_reducer: StrengthReducer,
    
    pub fn init(allocator: std.mem.Allocator, config: LoopControlManager.LoopConfig) !LoopOptimizationEngine {
        return LoopOptimizationEngine{
            .allocator = allocator,
            .config = config,
            .unroller = LoopUnroller.init(allocator),
            .invariant_analyzer = InvariantAnalyzer.init(allocator),
            .strength_reducer = StrengthReducer.init(),
        };
    }
    
    pub fn deinit(self: *LoopOptimizationEngine) void {
        self.unroller.deinit();
        self.invariant_analyzer.deinit();
    }
    
    pub fn analyze_loop(self: *LoopOptimizationEngine, loop_context: *const LoopContext) !void {
        if (!self.config.enable_loop_optimization) return;
        
        // Analyze for different optimization opportunities
        if (self.config.enable_loop_unrolling) {
            try self.unroller.analyze(loop_context);
        }
        
        if (self.config.enable_invariant_hoisting) {
            try self.invariant_analyzer.analyze(loop_context);
        }
    }
    
    pub fn optimize_loop(self: *LoopOptimizationEngine, loop_id: u32) !void {
        // Apply optimizations based on analysis results
        if (self.unroller.should_unroll(loop_id)) {
            try self.unroller.create_unrolled_version(loop_id);
        }
        
        if (self.invariant_analyzer.has_invariants(loop_id)) {
            try self.invariant_analyzer.hoist_invariants(loop_id);
        }
    }
    
    pub const LoopUnroller = struct {
        allocator: std.mem.Allocator,
        unroll_candidates: std.HashMap(u32, UnrollCandidate, LoopRegistry.LoopIdContext, std.hash_map.default_max_load_percentage),
        
        pub const UnrollCandidate = struct {
            loop_id: u32,
            body_size: u32,
            estimated_iterations: u64,
            unroll_factor: u32,
            benefit_score: f64,
        };
        
        pub fn init(allocator: std.mem.Allocator) LoopUnroller {
            return LoopUnroller{
                .allocator = allocator,
                .unroll_candidates = std.HashMap(u32, UnrollCandidate, LoopRegistry.LoopIdContext, std.hash_map.default_max_load_percentage).init(allocator),
            };
        }
        
        pub fn deinit(self: *LoopUnroller) void {
            self.unroll_candidates.deinit();
        }
        
        pub fn analyze(self: *LoopUnroller, loop_context: *const LoopContext) !void {
            const loop_info = loop_context.loop_info;
            
            // Determine if loop is suitable for unrolling
            if (loop_info.loop_body_size <= 64 and // Small body
                loop_info.estimated_iterations <= 16 and // Few iterations
                !loop_info.has_break and !loop_info.has_continue) // No complex control flow
            {
                const unroll_factor = self.calculate_unroll_factor(&loop_info);
                const benefit_score = self.calculate_unroll_benefit(&loop_info, unroll_factor);
                
                const candidate = UnrollCandidate{
                    .loop_id = loop_context.loop_id,
                    .body_size = loop_info.loop_body_size,
                    .estimated_iterations = loop_info.estimated_iterations,
                    .unroll_factor = unroll_factor,
                    .benefit_score = benefit_score,
                };
                
                try self.unroll_candidates.put(loop_context.loop_id, candidate);
            }
        }
        
        pub fn should_unroll(self: *const LoopUnroller, loop_id: u32) bool {
            if (self.unroll_candidates.get(loop_id)) |candidate| {
                return candidate.benefit_score > 0.5; // Threshold for profitability
            }
            return false;
        }
        
        pub fn create_unrolled_version(self: *LoopUnroller, loop_id: u32) !void {
            const candidate = self.unroll_candidates.get(loop_id) orelse return;
            
            // Create unrolled bytecode
            // This is a simplified implementation - would need actual bytecode manipulation
            const unrolled_size = candidate.body_size * candidate.unroll_factor;
            const unrolled_code = try self.allocator.alloc(u8, unrolled_size);
            
            // Fill with unrolled loop body (simplified)
            var offset: usize = 0;
            var i: u32 = 0;
            while (i < candidate.unroll_factor) {
                // Copy loop body (would need actual bytecode here)
                @memset(unrolled_code[offset..offset + candidate.body_size], 0x60); // PUSH1 placeholder
                offset += candidate.body_size;
                i += 1;
            }
            
            // Store in registry (would need access to registry)
            // This is where the unrolled code would be stored for later use
            _ = unrolled_code; // Prevent unused variable warning
        }
        
        fn calculate_unroll_factor(self: *LoopUnroller, loop_info: *const LoopInfo) u32 {
            _ = self;
            
            // Simple heuristic for unroll factor
            if (loop_info.loop_body_size <= 16) {
                return @min(8, @as(u32, @intCast(loop_info.estimated_iterations)));
            } else if (loop_info.loop_body_size <= 32) {
                return @min(4, @as(u32, @intCast(loop_info.estimated_iterations)));
            } else {
                return @min(2, @as(u32, @intCast(loop_info.estimated_iterations)));
            }
        }
        
        fn calculate_unroll_benefit(self: *LoopUnroller, loop_info: *const LoopInfo, unroll_factor: u32) f64 {
            _ = self;
            
            // Estimate benefit based on reduced loop overhead
            const loop_overhead_per_iteration = 10; // gas cost of loop control
            const total_overhead_saved = loop_overhead_per_iteration * (unroll_factor - 1);
            const code_size_increase = loop_info.loop_body_size * (unroll_factor - 1);
            
            // Benefit = saved overhead - increased code size penalty
            const benefit = @as(f64, @floatFromInt(total_overhead_saved)) - 
                           @as(f64, @floatFromInt(code_size_increase)) * 0.1;
            
            return @max(0, benefit / 100.0); // Normalize to 0-1 range
        }
    };
    
    pub const InvariantAnalyzer = struct {
        allocator: std.mem.Allocator,
        invariant_candidates: std.HashMap(u32, []const InvariantCandidate, LoopRegistry.LoopIdContext, std.hash_map.default_max_load_percentage),
        
        pub const InvariantCandidate = struct {
            operation_pc: u32,
            opcode: u8,
            operand_indices: []const u16,
            is_definitely_invariant: bool,
            benefit_score: f64,
        };
        
        pub fn init(allocator: std.mem.Allocator) InvariantAnalyzer {
            return InvariantAnalyzer{
                .allocator = allocator,
                .invariant_candidates = std.HashMap(u32, []const InvariantCandidate, LoopRegistry.LoopIdContext, std.hash_map.default_max_load_percentage).init(allocator),
            };
        }
        
        pub fn deinit(self: *InvariantAnalyzer) void {
            var iterator = self.invariant_candidates.iterator();
            while (iterator.next()) |entry| {
                for (entry.value_ptr.*) |candidate| {
                    self.allocator.free(candidate.operand_indices);
                }
                self.allocator.free(entry.value_ptr.*);
            }
            self.invariant_candidates.deinit();
        }
        
        pub fn analyze(self: *InvariantAnalyzer, loop_context: *const LoopContext) !void {
            // Analyze loop body for invariant operations
            // This would require bytecode analysis to identify operations
            // that don't depend on loop variables
            
            var candidates = std.ArrayList(InvariantCandidate).init(self.allocator);
            defer candidates.deinit();
            
            // Simplified analysis - look for common invariant patterns
            const loop_info = loop_context.loop_info;
            
            // Check for arithmetic operations that don't involve modified variables
            for (loop_info.variables_read) |var_index| {
                var is_modified = false;
                for (loop_info.variables_modified) |modified_var| {
                    if (var_index == modified_var) {
                        is_modified = true;
                        break;
                    }
                }
                
                if (!is_modified) {
                    // This variable is read but not modified - potential invariant
                    const operand_indices = try self.allocator.dupe(u16, &[_]u16{var_index});
                    
                    try candidates.append(InvariantCandidate{
                        .operation_pc = 0, // Would be determined by bytecode analysis
                        .opcode = 0x01, // ADD example
                        .operand_indices = operand_indices,
                        .is_definitely_invariant = true,
                        .benefit_score = 0.8,
                    });
                }
            }
            
            if (candidates.items.len > 0) {
                const candidates_copy = try self.allocator.dupe(InvariantCandidate, candidates.items);
                try self.invariant_candidates.put(loop_context.loop_id, candidates_copy);
            }
        }
        
        pub fn has_invariants(self: *const InvariantAnalyzer, loop_id: u32) bool {
            if (self.invariant_candidates.get(loop_id)) |candidates| {
                return candidates.len > 0;
            }
            return false;
        }
        
        pub fn hoist_invariants(self: *InvariantAnalyzer, loop_id: u32) !void {
            const candidates = self.invariant_candidates.get(loop_id) orelse return;
            
            // Create hoisted operations
            var hoisted_ops = std.ArrayList(LoopRegistry.OptimizationCache.InvariantOperation).init(self.allocator);
            defer hoisted_ops.deinit();
            
            for (candidates) |candidate| {
                if (candidate.is_definitely_invariant and candidate.benefit_score > 0.5) {
                    const operands = try self.allocator.alloc(u256, candidate.operand_indices.len);
                    // Would populate operands with actual values
                    
                    try hoisted_ops.append(LoopRegistry.OptimizationCache.InvariantOperation{
                        .operation_type = candidate.opcode,
                        .operands = operands,
                        .result_storage = candidate.operand_indices[0], // Simplified
                    });
                }
            }
            
            // Store hoisted operations (would need access to registry)
            _ = hoisted_ops; // Prevent unused variable warning
        }
    };
    
    pub const StrengthReducer = struct {
        pub fn init() StrengthReducer {
            return StrengthReducer{};
        }
        
        pub fn analyze_strength_reduction(self: *StrengthReducer, loop_context: *const LoopContext) StrengthReductionOpportunities {
            _ = self;
            _ = loop_context;
            
            // Analyze for strength reduction opportunities
            // e.g., i * 2 -> i << 1, i * constant -> i + i + ... (if constant is small)
            
            return StrengthReductionOpportunities{
                .multiplication_to_shift = 0,
                .multiplication_to_addition = 0,
                .division_to_shift = 0,
                .modulo_to_and = 0,
            };
        }
        
        pub const StrengthReductionOpportunities = struct {
            multiplication_to_shift: u32,
            multiplication_to_addition: u32,
            division_to_shift: u32,
            modulo_to_and: u32,
        };
    };
};
```

#### 5. Performance Tracking and Gas Management
```zig
pub const LoopPerformanceTracker = struct {
    loop_metrics: std.HashMap(u32, LoopMetrics, LoopRegistry.LoopIdContext, std.hash_map.default_max_load_percentage),
    global_stats: GlobalStats,
    
    pub const LoopMetrics = struct {
        loop_id: u32,
        entry_count: u64,
        exit_count: u64,
        total_iterations: u64,
        total_gas_used: u64,
        total_execution_time: u64,
        break_count: u64,
        continue_count: u64,
        average_iterations_per_execution: f64,
        average_gas_per_iteration: f64,
        
        pub fn init(loop_id: u32) LoopMetrics {
            return LoopMetrics{
                .loop_id = loop_id,
                .entry_count = 0,
                .exit_count = 0,
                .total_iterations = 0,
                .total_gas_used = 0,
                .total_execution_time = 0,
                .break_count = 0,
                .continue_count = 0,
                .average_iterations_per_execution = 0,
                .average_gas_per_iteration = 0,
            };
        }
        
        pub fn update_averages(self: *LoopMetrics) void {
            if (self.exit_count > 0) {
                self.average_iterations_per_execution = 
                    @as(f64, @floatFromInt(self.total_iterations)) / @as(f64, @floatFromInt(self.exit_count));
            }
            
            if (self.total_iterations > 0) {
                self.average_gas_per_iteration = 
                    @as(f64, @floatFromInt(self.total_gas_used)) / @as(f64, @floatFromInt(self.total_iterations));
            }
        }
    };
    
    pub const GlobalStats = struct {
        total_loops_executed: u64,
        total_iterations: u64,
        total_gas_used: u64,
        total_breaks: u64,
        total_continues: u64,
        deepest_nesting: u32,
        
        pub fn init() GlobalStats {
            return std.mem.zeroes(GlobalStats);
        }
    };
    
    pub const Metrics = struct {
        global_stats: GlobalStats,
        hot_loops: []const HotLoop,
        optimization_effectiveness: OptimizationEffectiveness,
        
        pub const HotLoop = struct {
            loop_id: u32,
            execution_count: u64,
            total_iterations: u64,
            average_gas_per_iteration: f64,
            optimization_applied: bool,
        };
        
        pub const OptimizationEffectiveness = struct {
            unrolled_loops: u32,
            unrolling_speedup: f64,
            hoisted_invariants: u32,
            hoisting_speedup: f64,
        };
    };
    
    pub fn init() LoopPerformanceTracker {
        return LoopPerformanceTracker{
            .loop_metrics = std.HashMap(u32, LoopMetrics, LoopRegistry.LoopIdContext, std.hash_map.default_max_load_percentage).init(std.heap.page_allocator),
            .global_stats = GlobalStats.init(),
        };
    }
    
    pub fn deinit(self: *LoopPerformanceTracker) void {
        self.loop_metrics.deinit();
    }
    
    pub fn record_loop_entry(self: *LoopPerformanceTracker, loop_id: u32) void {
        var metrics = self.loop_metrics.getPtr(loop_id) orelse blk: {
            const new_metrics = LoopMetrics.init(loop_id);
            self.loop_metrics.put(loop_id, new_metrics) catch return;
            break :blk self.loop_metrics.getPtr(loop_id).?;
        };
        
        metrics.entry_count += 1;
        self.global_stats.total_loops_executed += 1;
    }
    
    pub fn record_loop_exit(self: *LoopPerformanceTracker, loop_id: u32, iterations: u64, gas_used: u64) void {
        if (self.loop_metrics.getPtr(loop_id)) |metrics| {
            metrics.exit_count += 1;
            metrics.total_iterations += iterations;
            metrics.total_gas_used += gas_used;
            metrics.update_averages();
            
            self.global_stats.total_iterations += iterations;
            self.global_stats.total_gas_used += gas_used;
        }
    }
    
    pub fn record_iteration(self: *LoopPerformanceTracker, loop_id: u32) void {
        _ = loop_id;
        // Iteration counting is handled in record_loop_exit for efficiency
    }
    
    pub fn record_break(self: *LoopPerformanceTracker, loop_id: u32) void {
        if (self.loop_metrics.getPtr(loop_id)) |metrics| {
            metrics.break_count += 1;
        }
        self.global_stats.total_breaks += 1;
    }
    
    pub fn record_continue(self: *LoopPerformanceTracker, loop_id: u32) void {
        if (self.loop_metrics.getPtr(loop_id)) |metrics| {
            metrics.continue_count += 1;
        }
        self.global_stats.total_continues += 1;
    }
    
    pub fn get_metrics(self: *const LoopPerformanceTracker) Metrics {
        // Create hot loops list
        var hot_loops = std.ArrayList(Metrics.HotLoop).init(std.heap.page_allocator);
        defer hot_loops.deinit();
        
        var iterator = self.loop_metrics.iterator();
        while (iterator.next()) |entry| {
            const metrics = entry.value_ptr.*;
            
            if (metrics.entry_count >= 10) { // Threshold for "hot"
                hot_loops.append(Metrics.HotLoop{
                    .loop_id = metrics.loop_id,
                    .execution_count = metrics.entry_count,
                    .total_iterations = metrics.total_iterations,
                    .average_gas_per_iteration = metrics.average_gas_per_iteration,
                    .optimization_applied = false, // Would check optimization status
                }) catch continue;
            }
        }
        
        return Metrics{
            .global_stats = self.global_stats,
            .hot_loops = hot_loops.toOwnedSlice() catch &[_]Metrics.HotLoop{},
            .optimization_effectiveness = Metrics.OptimizationEffectiveness{
                .unrolled_loops = 0, // Would track from optimization engine
                .unrolling_speedup = 0,
                .hoisted_invariants = 0,
                .hoisting_speedup = 0,
            },
        };
    }
};

pub const LoopGasTracker = struct {
    gas_limit_per_iteration: u64,
    loop_gas_usage: std.HashMap(u32, LoopGasUsage, LoopRegistry.LoopIdContext, std.hash_map.default_max_load_percentage),
    
    pub const LoopGasUsage = struct {
        loop_id: u32,
        gas_at_entry: u64,
        gas_used_this_loop: u64,
        iterations_this_execution: u64,
        gas_limit_exceeded: bool,
    };
    
    pub fn init(gas_limit_per_iteration: u64) LoopGasTracker {
        return LoopGasTracker{
            .gas_limit_per_iteration = gas_limit_per_iteration,
            .loop_gas_usage = std.HashMap(u32, LoopGasUsage, LoopRegistry.LoopIdContext, std.hash_map.default_max_load_percentage).init(std.heap.page_allocator),
        };
    }
    
    pub fn deinit(self: *LoopGasTracker) void {
        self.loop_gas_usage.deinit();
    }
    
    pub fn start_loop(self: *LoopGasTracker, loop_id: u32) void {
        const usage = LoopGasUsage{
            .loop_id = loop_id,
            .gas_at_entry = 0, // Would get from execution context
            .gas_used_this_loop = 0,
            .iterations_this_execution = 0,
            .gas_limit_exceeded = false,
        };
        
        self.loop_gas_usage.put(loop_id, usage) catch {};
    }
    
    pub fn end_loop(self: *LoopGasTracker, loop_id: u32) u64 {
        if (self.loop_gas_usage.fetchRemove(loop_id)) |entry| {
            return entry.value.gas_used_this_loop;
        }
        return 0;
    }
    
    pub fn check_iteration_gas_limit(self: *LoopGasTracker, loop_id: u32) bool {
        if (self.loop_gas_usage.getPtr(loop_id)) |usage| {
            usage.iterations_this_execution += 1;
            
            // Simple check: iterations * limit
            const estimated_gas = usage.iterations_this_execution * self.gas_limit_per_iteration;
            
            if (estimated_gas > 1000000) { // 1M gas limit for loop
                usage.gas_limit_exceeded = true;
                return false;
            }
        }
        
        return true;
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Loop Stack Management**: Efficient nested loop tracking with overflow protection
2. **Break/Continue Support**: Proper implementation of loop control flow statements
3. **Loop Optimization**: Unrolling, invariant hoisting, and strength reduction
4. **Gas Tracking**: Per-iteration gas limits and loop-level gas accounting
5. **Performance Monitoring**: Comprehensive metrics and optimization effectiveness tracking
6. **Integration with EVM**: Seamless integration with existing execution flow

## Implementation Tasks

### Task 1: Implement Loop Control Opcodes
File: `/src/evm/execution/loop_control.zig`
```zig
const std = @import("std");
const LoopControlManager = @import("../loop_control/loop_control_manager.zig").LoopControlManager;

pub fn execute_loop_start(context: *ExecutionContext, manager: *LoopControlManager) !void {
    // Read loop information from bytecode
    const loop_type = try context.read_u8_from_bytecode();
    const entry_pc = context.pc;
    const exit_pc = try context.read_u32_from_bytecode();
    const condition_pc = try context.read_u32_from_bytecode();
    const increment_pc = try context.read_u32_from_bytecode();
    
    const loop_info = LoopInfo{
        .loop_type = @enumFromInt(loop_type),
        .entry_pc = entry_pc,
        .exit_pc = exit_pc,
        .condition_pc = condition_pc,
        .increment_pc = increment_pc,
        .estimated_iterations = 100, // Default estimate
        .loop_body_size = exit_pc - entry_pc,
        .has_break = false, // Would be determined by analysis
        .has_continue = false,
        .has_nested_loops = false,
        .variables_modified = &[_]u16{},
        .variables_read = &[_]u16{},
        .optimization_hints = LoopInfo.OptimizationHints{
            .is_invariant_heavy = false,
            .is_short_body = exit_pc - entry_pc <= 64,
            .is_high_iteration = false,
            .memory_access_pattern = .None,
        },
    };
    
    // Enter loop
    const loop_context = try manager.enter_loop(loop_info);
    _ = loop_context;
    
    // Consume gas for loop setup
    try context.consume_gas(50);
}

pub fn execute_loop_end(context: *ExecutionContext, manager: *LoopControlManager) !void {
    // Exit current loop
    try manager.exit_loop();
    
    // Consume gas for loop cleanup
    try context.consume_gas(25);
}

pub fn execute_loop_break(context: *ExecutionContext, manager: *LoopControlManager) !void {
    // Get break levels from bytecode (default 1)
    const levels = try context.read_u8_from_bytecode();
    
    // Break out of loops
    try manager.break_loop(if (levels == 0) 1 else levels);
    
    // Jump to exit point of the target loop
    if (manager.get_current_loop()) |current_loop| {
        context.pc = current_loop.exit_pc;
    }
    
    // Consume gas for break
    try context.consume_gas(10);
}

pub fn execute_loop_continue(context: *ExecutionContext, manager: *LoopControlManager) !void {
    // Continue current loop
    try manager.continue_loop();
    
    // Jump to condition check or increment
    if (manager.get_current_loop()) |current_loop| {
        context.pc = current_loop.condition_pc;
    }
    
    // Consume gas for continue
    try context.consume_gas(10);
}

pub fn execute_loop_iteration(context: *ExecutionContext, manager: *LoopControlManager) !void {
    // Check if iteration should continue
    const result = try manager.execute_iteration();
    
    switch (result.action) {
        .Break => {
            // Jump to loop exit
            if (manager.get_current_loop()) |current_loop| {
                context.pc = current_loop.exit_pc;
            }
        },
        .Continue => {
            // Continue with loop body
        },
        .Return => {
            // Handle early return from function
            return error.EarlyReturn;
        },
    }
    
    // Consume gas for iteration check
    try context.consume_gas(5);
}
```

### Task 2: Integrate with Jump Table
File: `/src/evm/jump_table/jump_table.zig` (modify existing)
```zig
const LoopControlOpcodes = @import("../execution/loop_control.zig");

pub fn init_loop_control_opcodes(jump_table: *JumpTable, hardfork: Hardfork) void {
    if (hardfork.supports_advanced_features()) {
        // LOOP_START - 0xE0
        jump_table.operations[0xE0] = OperationConfig{
            .gas_cost = 50,
            .stack_input = 0,
            .stack_output = 0,
            .memory_size_offset = null,
            .memory_size_size = null,
            .writes_memory = false,
            .reads_memory = false,
            .execution_fn = execute_loop_start_wrapper,
        };
        
        // LOOP_END - 0xE1
        jump_table.operations[0xE1] = OperationConfig{
            .gas_cost = 25,
            .stack_input = 0,
            .stack_output = 0,
            .memory_size_offset = null,
            .memory_size_size = null,
            .writes_memory = false,
            .reads_memory = false,
            .execution_fn = execute_loop_end_wrapper,
        };
        
        // LOOP_BREAK - 0xE2
        jump_table.operations[0xE2] = OperationConfig{
            .gas_cost = 10,
            .stack_input = 0,
            .stack_output = 0,
            .memory_size_offset = null,
            .memory_size_size = null,
            .writes_memory = false,
            .reads_memory = false,
            .execution_fn = execute_loop_break_wrapper,
        };
        
        // LOOP_CONTINUE - 0xE3
        jump_table.operations[0xE3] = OperationConfig{
            .gas_cost = 10,
            .stack_input = 0,
            .stack_output = 0,
            .memory_size_offset = null,
            .memory_size_size = null,
            .writes_memory = false,
            .reads_memory = false,
            .execution_fn = execute_loop_continue_wrapper,
        };
    }
}

fn execute_loop_start_wrapper(context: *ExecutionContext) !void {
    if (context.loop_manager) |*manager| {
        try LoopControlOpcodes.execute_loop_start(context, manager);
    } else {
        return error.LoopControlNotEnabled;
    }
}

fn execute_loop_end_wrapper(context: *ExecutionContext) !void {
    if (context.loop_manager) |*manager| {
        try LoopControlOpcodes.execute_loop_end(context, manager);
    } else {
        return error.LoopControlNotEnabled;
    }
}

fn execute_loop_break_wrapper(context: *ExecutionContext) !void {
    if (context.loop_manager) |*manager| {
        try LoopControlOpcodes.execute_loop_break(context, manager);
    } else {
        return error.LoopControlNotEnabled;
    }
}

fn execute_loop_continue_wrapper(context: *ExecutionContext) !void {
    if (context.loop_manager) |*manager| {
        try LoopControlOpcodes.execute_loop_continue(context, manager);
    } else {
        return error.LoopControlNotEnabled;
    }
}
```

### Task 3: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const LoopControlManager = @import("loop_control/loop_control_manager.zig").LoopControlManager;

pub const Vm = struct {
    // Existing fields...
    loop_manager: ?LoopControlManager,
    loop_control_enabled: bool,
    
    pub fn enable_loop_control(self: *Vm, config: LoopControlManager.LoopConfig) !void {
        self.loop_manager = try LoopControlManager.init(self.allocator, config);
        self.loop_control_enabled = true;
    }
    
    pub fn disable_loop_control(self: *Vm) void {
        if (self.loop_manager) |*manager| {
            manager.deinit();
            self.loop_manager = null;
        }
        self.loop_control_enabled = false;
    }
    
    pub fn get_loop_performance_metrics(self: *Vm) ?LoopControlManager.LoopPerformanceTracker.Metrics {
        if (self.loop_manager) |*manager| {
            return manager.get_performance_metrics();
        }
        return null;
    }
    
    pub fn optimize_loops(self: *Vm) !void {
        if (self.loop_manager) |*manager| {
            // Trigger loop optimizations
            var iterator = manager.loop_registry.loops.iterator();
            while (iterator.next()) |entry| {
                const loop_id = entry.key_ptr.*;
                try manager.optimization_engine.optimize_loop(loop_id);
            }
        }
    }
    
    pub fn get_current_loop_depth(self: *Vm) u32 {
        if (self.loop_manager) |*manager| {
            return manager.get_loop_depth();
        }
        return 0;
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/loop_control/loop_control_test.zig`

### Test Cases
```zig
test "loop control manager initialization" {
    // Test manager creation with different configs
    // Test loop stack initialization
    // Test optimization engine setup
}

test "loop stack operations" {
    // Test loop entry and exit
    // Test nested loop handling
    // Test stack overflow protection
}

test "break and continue semantics" {
    // Test single-level break/continue
    // Test multi-level break
    // Test break/continue in nested loops
}

test "loop optimization" {
    // Test loop unrolling detection
    // Test invariant hoisting
    // Test optimization effectiveness
}

test "performance tracking" {
    // Test loop metrics collection
    // Test gas tracking
    // Test performance analysis
}

test "integration with VM execution" {
    // Test VM integration
    // Test loop control opcodes
    // Test performance impact measurement
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/loop_control/loop_control_manager.zig` - Main loop control management
- `/src/evm/loop_control/loop_context.zig` - Loop context and stack
- `/src/evm/loop_control/loop_registry.zig` - Loop registration and tracking
- `/src/evm/loop_control/loop_optimization_engine.zig` - Loop optimization system
- `/src/evm/loop_control/loop_performance_tracker.zig` - Performance monitoring
- `/src/evm/loop_control/loop_gas_tracker.zig` - Gas management for loops
- `/src/evm/execution/loop_control.zig` - Loop control opcodes
- `/src/evm/jump_table/jump_table.zig` - Opcode integration
- `/src/evm/vm.zig` - VM integration
- `/test/evm/loop_control/loop_control_test.zig` - Comprehensive tests

## Success Criteria

1. **Complete Loop Support**: Full implementation of break/continue semantics with nested loop support
2. **Optimization Effectiveness**: Measurable performance improvements through loop unrolling and invariant hoisting
3. **Gas Safety**: Proper gas tracking and limits to prevent infinite loop attacks
4. **Performance Monitoring**: Comprehensive metrics and optimization effectiveness tracking
5. **EVM Integration**: Seamless integration with existing EVM execution without regression
6. **Memory Efficiency**: Minimal overhead when loop control features are not used

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

#### 1. **Unit Tests** (`/test/evm/loop/loop_control_test.zig`)
```zig
// Test basic loop_control functionality
test "loop_control basic functionality works correctly"
test "loop_control handles edge cases properly"
test "loop_control validates inputs appropriately"
test "loop_control produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "loop_control integrates with EVM properly"
test "loop_control maintains system compatibility"
test "loop_control works with existing components"
test "loop_control handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "loop_control meets performance requirements"
test "loop_control optimizes resource usage"
test "loop_control scales appropriately with load"
test "loop_control benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "loop_control meets specification requirements"
test "loop_control maintains EVM compatibility"
test "loop_control handles hardfork transitions"
test "loop_control cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "loop_control handles errors gracefully"
test "loop_control proper error propagation"
test "loop_control recovery from failure states"
test "loop_control validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "loop_control prevents security vulnerabilities"
test "loop_control handles malicious inputs safely"
test "loop_control maintains isolation boundaries"
test "loop_control validates security properties"
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
test "loop_control basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = loop_control.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const loop_control = struct {
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

- [Loop Optimization Techniques](https://en.wikipedia.org/wiki/Loop_optimization) - Compiler optimization strategies
- [Control Flow Analysis](https://en.wikipedia.org/wiki/Control-flow_analysis) - Program analysis techniques
- [Gas Limit Considerations](https://ethereum.org/en/developers/docs/gas/) - Ethereum gas mechanics
- [Loop Unrolling](https://en.wikipedia.org/wiki/Loop_unrolling) - Performance optimization technique
- [Invariant Hoisting](https://en.wikipedia.org/wiki/Loop-invariant_code_motion) - Code motion optimization