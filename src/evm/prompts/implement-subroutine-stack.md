# Implement Subroutine Stack

You are implementing Subroutine Stack for the Tevm EVM written in Zig. Your goal is to implement subroutine stack management for EIP-2315 following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_subroutine_stack` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_subroutine_stack feat_implement_subroutine_stack`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a comprehensive subroutine stack system for EOF (Ethereum Object Format) contracts that supports subroutine calls, returns, and advanced control flow. This enables more efficient contract execution patterns, function-like abstractions, and better code organization within smart contracts while maintaining EVM compatibility and security.

## ELI5

A subroutine stack is like an organized filing system for function calls in smart contracts. Think of it as a stack of sticky notes where each note represents a function call - when you call a function, you put a new note on top with the return address, and when the function finishes, you peel off the top note to know where to go back. This system helps organize complex contract execution by keeping track of nested function calls and ensuring everything returns to the right place safely.

## Subroutine Stack Specifications

### Core Subroutine Framework

#### 1. Subroutine Stack Manager
```zig
pub const SubroutineStackManager = struct {
    allocator: std.mem.Allocator,
    config: SubroutineConfig,
    call_stack: CallStack,
    return_stack: ReturnStack,
    subroutine_registry: SubroutineRegistry,
    execution_context: SubroutineExecutionContext,
    performance_tracker: SubroutinePerformanceTracker,
    
    pub const SubroutineConfig = struct {
        enable_subroutines: bool,
        max_call_depth: u32,
        max_subroutine_count: u32,
        enable_tail_call_optimization: bool,
        enable_inline_optimization: bool,
        enable_return_stack_protection: bool,
        stack_overflow_protection: bool,
        call_stack_size: u32,
        return_stack_size: u32,
        
        pub fn production() SubroutineConfig {
            return SubroutineConfig{
                .enable_subroutines = true,
                .max_call_depth = 1024,
                .max_subroutine_count = 256,
                .enable_tail_call_optimization = true,
                .enable_inline_optimization = true,
                .enable_return_stack_protection = true,
                .stack_overflow_protection = true,
                .call_stack_size = 1024,
                .return_stack_size = 1024,
            };
        }
        
        pub fn development() SubroutineConfig {
            return SubroutineConfig{
                .enable_subroutines = true,
                .max_call_depth = 512,
                .max_subroutine_count = 128,
                .enable_tail_call_optimization = false,
                .enable_inline_optimization = false,
                .enable_return_stack_protection = true,
                .stack_overflow_protection = true,
                .call_stack_size = 512,
                .return_stack_size = 512,
            };
        }
        
        pub fn testing() SubroutineConfig {
            return SubroutineConfig{
                .enable_subroutines = true,
                .max_call_depth = 64,
                .max_subroutine_count = 32,
                .enable_tail_call_optimization = false,
                .enable_inline_optimization = false,
                .enable_return_stack_protection = true,
                .stack_overflow_protection = true,
                .call_stack_size = 64,
                .return_stack_size = 64,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: SubroutineConfig) !SubroutineStackManager {
        return SubroutineStackManager{
            .allocator = allocator,
            .config = config,
            .call_stack = try CallStack.init(allocator, config.call_stack_size),
            .return_stack = try ReturnStack.init(allocator, config.return_stack_size),
            .subroutine_registry = try SubroutineRegistry.init(allocator, config.max_subroutine_count),
            .execution_context = SubroutineExecutionContext.init(),
            .performance_tracker = SubroutinePerformanceTracker.init(),
        };
    }
    
    pub fn deinit(self: *SubroutineStackManager) void {
        self.call_stack.deinit();
        self.return_stack.deinit();
        self.subroutine_registry.deinit();
    }
    
    pub fn call_subroutine(self: *SubroutineStackManager, subroutine_id: u16, args: []const u256) !CallFrame {
        if (!self.config.enable_subroutines) {
            return error.SubroutinesDisabled;
        }
        
        // Check call depth
        if (self.call_stack.depth() >= self.config.max_call_depth) {
            return error.CallStackOverflow;
        }
        
        // Get subroutine definition
        const subroutine = self.subroutine_registry.get_subroutine(subroutine_id) orelse {
            return error.SubroutineNotFound;
        };
        
        // Validate arguments
        if (args.len != subroutine.parameter_count) {
            return error.InvalidArgumentCount;
        }
        
        // Check for tail call optimization
        if (self.config.enable_tail_call_optimization and self.is_tail_call(subroutine_id)) {
            return try self.optimize_tail_call(subroutine_id, args);
        }
        
        // Create call frame
        const call_frame = try CallFrame.init(
            self.allocator,
            subroutine_id,
            subroutine,
            args,
            self.execution_context.current_pc
        );
        
        // Push to call stack
        try self.call_stack.push(call_frame);
        
        // Record performance metrics
        self.performance_tracker.record_call(subroutine_id);
        
        return call_frame;
    }
    
    pub fn return_from_subroutine(self: *SubroutineStackManager, return_values: []const u256) !void {
        if (self.call_stack.is_empty()) {
            return error.CallStackUnderflow;
        }
        
        // Pop call frame
        var call_frame = try self.call_stack.pop();
        defer call_frame.deinit();
        
        // Validate return values
        const subroutine = call_frame.subroutine;
        if (return_values.len != subroutine.return_count) {
            return error.InvalidReturnCount;
        }
        
        // Push return address to return stack if protection enabled
        if (self.config.enable_return_stack_protection) {
            try self.return_stack.push(call_frame.return_address);
        }
        
        // Update execution context
        self.execution_context.current_pc = call_frame.return_address;
        self.execution_context.call_depth -= 1;
        
        // Record performance metrics
        self.performance_tracker.record_return(call_frame.subroutine_id);
    }
    
    pub fn register_subroutine(self: *SubroutineStackManager, subroutine: SubroutineDefinition) !u16 {
        return try self.subroutine_registry.register(subroutine);
    }
    
    pub fn get_current_call_frame(self: *const SubroutineStackManager) ?*const CallFrame {
        return self.call_stack.peek();
    }
    
    pub fn get_call_depth(self: *const SubroutineStackManager) u32 {
        return self.call_stack.depth();
    }
    
    fn is_tail_call(self: *const SubroutineStackManager, subroutine_id: u16) bool {
        // Check if this is the last instruction in the current subroutine
        if (self.call_stack.peek()) |current_frame| {
            const current_subroutine = current_frame.subroutine;
            const next_instruction = self.execution_context.current_pc + 1;
            
            // If next instruction would be a return, this is a tail call
            return next_instruction >= current_subroutine.code_end_offset;
        }
        return false;
    }
    
    fn optimize_tail_call(self: *SubroutineStackManager, subroutine_id: u16, args: []const u256) !CallFrame {
        // Replace current call frame instead of creating new one
        if (self.call_stack.peek()) |current_frame| {
            const new_subroutine = self.subroutine_registry.get_subroutine(subroutine_id).?;
            
            // Update current frame
            current_frame.subroutine_id = subroutine_id;
            current_frame.subroutine = new_subroutine;
            
            // Copy arguments
            for (args, 0..) |arg, i| {
                current_frame.local_variables[i] = arg;
            }
            
            self.performance_tracker.record_tail_call_optimization(subroutine_id);
            return current_frame.*;
        }
        
        return error.NoCurrentFrame;
    }
    
    pub fn validate_return_address(self: *const SubroutineStackManager, address: u32) bool {
        if (!self.config.enable_return_stack_protection) {
            return true;
        }
        
        return self.return_stack.contains(address);
    }
    
    pub fn get_performance_metrics(self: *const SubroutineStackManager) SubroutinePerformanceTracker.Metrics {
        return self.performance_tracker.get_metrics();
    }
};
```

#### 2. Call Stack Implementation
```zig
pub const CallStack = struct {
    allocator: std.mem.Allocator,
    frames: []CallFrame,
    top: u32,
    capacity: u32,
    
    pub fn init(allocator: std.mem.Allocator, capacity: u32) !CallStack {
        const frames = try allocator.alloc(CallFrame, capacity);
        
        return CallStack{
            .allocator = allocator,
            .frames = frames,
            .top = 0,
            .capacity = capacity,
        };
    }
    
    pub fn deinit(self: *CallStack) void {
        // Clean up any remaining frames
        for (0..self.top) |i| {
            self.frames[i].deinit();
        }
        self.allocator.free(self.frames);
    }
    
    pub fn push(self: *CallStack, frame: CallFrame) !void {
        if (self.top >= self.capacity) {
            return error.StackOverflow;
        }
        
        self.frames[self.top] = frame;
        self.top += 1;
    }
    
    pub fn pop(self: *CallStack) !CallFrame {
        if (self.top == 0) {
            return error.StackUnderflow;
        }
        
        self.top -= 1;
        return self.frames[self.top];
    }
    
    pub fn peek(self: *const CallStack) ?*const CallFrame {
        if (self.top == 0) {
            return null;
        }
        return &self.frames[self.top - 1];
    }
    
    pub fn peek_mutable(self: *CallStack) ?*CallFrame {
        if (self.top == 0) {
            return null;
        }
        return &self.frames[self.top - 1];
    }
    
    pub fn depth(self: *const CallStack) u32 {
        return self.top;
    }
    
    pub fn is_empty(self: *const CallStack) bool {
        return self.top == 0;
    }
    
    pub fn is_full(self: *const CallStack) bool {
        return self.top >= self.capacity;
    }
    
    pub fn clear(self: *CallStack) void {
        // Clean up all frames
        for (0..self.top) |i| {
            self.frames[i].deinit();
        }
        self.top = 0;
    }
    
    pub fn get_frame(self: *const CallStack, index: u32) ?*const CallFrame {
        if (index >= self.top) {
            return null;
        }
        return &self.frames[self.top - 1 - index]; // 0 = top frame
    }
    
    pub fn debug_print(self: *const CallStack) void {
        std.log.debug("=== CALL STACK DEBUG ===");
        std.log.debug("Depth: {}, Capacity: {}", .{ self.top, self.capacity });
        
        var i: u32 = 0;
        while (i < self.top) : (i += 1) {
            const frame = &self.frames[self.top - 1 - i];
            std.log.debug("Frame {}: subroutine_id={}, return_address=0x{X}", .{
                i, frame.subroutine_id, frame.return_address
            });
        }
    }
};
```

#### 3. Call Frame Structure
```zig
pub const CallFrame = struct {
    allocator: std.mem.Allocator,
    subroutine_id: u16,
    subroutine: *const SubroutineDefinition,
    local_variables: []u256,
    return_address: u32,
    stack_offset: u32,
    memory_offset: u32,
    gas_checkpoint: u64,
    creation_time: u64,
    
    pub fn init(
        allocator: std.mem.Allocator,
        subroutine_id: u16,
        subroutine: *const SubroutineDefinition,
        args: []const u256,
        return_address: u32
    ) !CallFrame {
        const local_variables = try allocator.alloc(u256, subroutine.local_variable_count);
        
        // Initialize arguments
        for (args, 0..) |arg, i| {
            if (i < local_variables.len) {
                local_variables[i] = arg;
            }
        }
        
        // Zero-initialize remaining local variables
        for (args.len..local_variables.len) |i| {
            local_variables[i] = 0;
        }
        
        return CallFrame{
            .allocator = allocator,
            .subroutine_id = subroutine_id,
            .subroutine = subroutine,
            .local_variables = local_variables,
            .return_address = return_address,
            .stack_offset = 0,
            .memory_offset = 0,
            .gas_checkpoint = 0,
            .creation_time = @intCast(std.time.milliTimestamp()),
        };
    }
    
    pub fn deinit(self: *CallFrame) void {
        self.allocator.free(self.local_variables);
    }
    
    pub fn get_local_variable(self: *const CallFrame, index: u16) ?u256 {
        if (index >= self.local_variables.len) {
            return null;
        }
        return self.local_variables[index];
    }
    
    pub fn set_local_variable(self: *CallFrame, index: u16, value: u256) !void {
        if (index >= self.local_variables.len) {
            return error.InvalidLocalVariableIndex;
        }
        self.local_variables[index] = value;
    }
    
    pub fn get_parameter_count(self: *const CallFrame) u16 {
        return self.subroutine.parameter_count;
    }
    
    pub fn get_return_count(self: *const CallFrame) u16 {
        return self.subroutine.return_count;
    }
    
    pub fn get_execution_time(self: *const CallFrame) u64 {
        const current_time = @as(u64, @intCast(std.time.milliTimestamp()));
        return current_time - self.creation_time;
    }
    
    pub fn clone(self: *const CallFrame) !CallFrame {
        const local_variables = try self.allocator.dupe(u256, self.local_variables);
        
        return CallFrame{
            .allocator = self.allocator,
            .subroutine_id = self.subroutine_id,
            .subroutine = self.subroutine,
            .local_variables = local_variables,
            .return_address = self.return_address,
            .stack_offset = self.stack_offset,
            .memory_offset = self.memory_offset,
            .gas_checkpoint = self.gas_checkpoint,
            .creation_time = self.creation_time,
        };
    }
};
```

#### 4. Subroutine Registry
```zig
pub const SubroutineRegistry = struct {
    allocator: std.mem.Allocator,
    subroutines: std.HashMap(u16, SubroutineDefinition, SubroutineContext, std.hash_map.default_max_load_percentage),
    next_id: u16,
    max_subroutines: u32,
    inline_cache: InlineCache,
    
    pub const InlineCache = struct {
        candidates: std.HashMap(u16, InlineCandidate, SubroutineContext, std.hash_map.default_max_load_percentage),
        inlined_subroutines: std.HashMap(u16, []const u8, SubroutineContext, std.hash_map.default_max_load_percentage),
        
        pub const InlineCandidate = struct {
            subroutine_id: u16,
            call_count: u64,
            code_size: u32,
            inline_benefit_score: f64,
        };
        
        pub fn init(allocator: std.mem.Allocator) InlineCache {
            return InlineCache{
                .candidates = std.HashMap(u16, InlineCandidate, SubroutineContext, std.hash_map.default_max_load_percentage).init(allocator),
                .inlined_subroutines = std.HashMap(u16, []const u8, SubroutineContext, std.hash_map.default_max_load_percentage).init(allocator),
            };
        }
        
        pub fn deinit(self: *InlineCache) void {
            var iterator = self.inlined_subroutines.iterator();
            while (iterator.next()) |entry| {
                self.candidates.allocator.free(entry.value_ptr.*);
            }
            self.candidates.deinit();
            self.inlined_subroutines.deinit();
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, max_subroutines: u32) !SubroutineRegistry {
        return SubroutineRegistry{
            .allocator = allocator,
            .subroutines = std.HashMap(u16, SubroutineDefinition, SubroutineContext, std.hash_map.default_max_load_percentage).init(allocator),
            .next_id = 1, // Start from 1, 0 reserved for main
            .max_subroutines = max_subroutines,
            .inline_cache = InlineCache.init(allocator),
        };
    }
    
    pub fn deinit(self: *SubroutineRegistry) void {
        var iterator = self.subroutines.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.deinit();
        }
        self.subroutines.deinit();
        self.inline_cache.deinit();
    }
    
    pub fn register(self: *SubroutineRegistry, definition: SubroutineDefinition) !u16 {
        if (self.subroutines.count() >= self.max_subroutines) {
            return error.TooManySubroutines;
        }
        
        const id = self.next_id;
        self.next_id += 1;
        
        // Validate subroutine definition
        try self.validate_subroutine(&definition);
        
        // Clone definition for storage
        var stored_definition = try definition.clone(self.allocator);
        stored_definition.id = id;
        
        try self.subroutines.put(id, stored_definition);
        
        // Check if subroutine is candidate for inlining
        if (self.is_inline_candidate(&stored_definition)) {
            try self.add_inline_candidate(id, &stored_definition);
        }
        
        return id;
    }
    
    pub fn get_subroutine(self: *const SubroutineRegistry, id: u16) ?*const SubroutineDefinition {
        return self.subroutines.getPtr(id);
    }
    
    pub fn unregister(self: *SubroutineRegistry, id: u16) !void {
        if (self.subroutines.fetchRemove(id)) |entry| {
            entry.value.deinit();
            
            // Remove from inline cache
            _ = self.inline_cache.candidates.remove(id);
            if (self.inline_cache.inlined_subroutines.fetchRemove(id)) |inlined| {
                self.allocator.free(inlined.value);
            }
        } else {
            return error.SubroutineNotFound;
        }
    }
    
    pub fn get_inline_code(self: *const SubroutineRegistry, id: u16) ?[]const u8 {
        return self.inline_cache.inlined_subroutines.get(id);
    }
    
    pub fn update_call_count(self: *SubroutineRegistry, id: u16) void {
        if (self.inline_cache.candidates.getPtr(id)) |candidate| {
            candidate.call_count += 1;
            
            // Recalculate inline benefit score
            candidate.inline_benefit_score = self.calculate_inline_benefit(candidate);
        }
    }
    
    fn validate_subroutine(self: *const SubroutineRegistry, definition: *const SubroutineDefinition) !void {
        _ = self;
        
        // Validate basic constraints
        if (definition.parameter_count > 256) {
            return error.TooManyParameters;
        }
        
        if (definition.return_count > 256) {
            return error.TooManyReturns;
        }
        
        if (definition.local_variable_count > 1024) {
            return error.TooManyLocalVariables;
        }
        
        if (definition.code.len == 0) {
            return error.EmptySubroutine;
        }
        
        // Validate that subroutine ends with return instruction
        const last_instruction = definition.code[definition.code.len - 1];
        if (last_instruction != 0xB0) { // RETSUB opcode
            return error.MissingReturnInstruction;
        }
    }
    
    fn is_inline_candidate(self: *const SubroutineRegistry, definition: *const SubroutineDefinition) bool {
        _ = self;
        
        // Small subroutines are good candidates for inlining
        const max_inline_size = 32; // bytes
        if (definition.code.len > max_inline_size) {
            return false;
        }
        
        // No recursive calls
        if (definition.is_recursive) {
            return false;
        }
        
        // No complex control flow
        if (definition.has_complex_control_flow) {
            return false;
        }
        
        return true;
    }
    
    fn add_inline_candidate(self: *SubroutineRegistry, id: u16, definition: *const SubroutineDefinition) !void {
        const candidate = InlineCache.InlineCandidate{
            .subroutine_id = id,
            .call_count = 0,
            .code_size = @intCast(definition.code.len),
            .inline_benefit_score = 0.0,
        };
        
        try self.inline_cache.candidates.put(id, candidate);
    }
    
    fn calculate_inline_benefit(self: *const SubroutineRegistry, candidate: *const InlineCache.InlineCandidate) f64 {
        _ = self;
        
        // Simple heuristic: benefit = call_count / code_size
        if (candidate.code_size == 0) return 0.0;
        
        return @as(f64, @floatFromInt(candidate.call_count)) / @as(f64, @floatFromInt(candidate.code_size));
    }
    
    pub fn optimize_inlining(self: *SubroutineRegistry, threshold: f64) !void {
        var iterator = self.inline_cache.candidates.iterator();
        
        while (iterator.next()) |entry| {
            const candidate = entry.value_ptr;
            
            if (candidate.inline_benefit_score >= threshold) {
                try self.inline_subroutine(candidate.subroutine_id);
            }
        }
    }
    
    fn inline_subroutine(self: *SubroutineRegistry, id: u16) !void {
        const subroutine = self.get_subroutine(id) orelse return error.SubroutineNotFound;
        
        // Create optimized inline code
        const inline_code = try self.create_inline_code(subroutine);
        
        try self.inline_cache.inlined_subroutines.put(id, inline_code);
    }
    
    fn create_inline_code(self: *SubroutineRegistry, subroutine: *const SubroutineDefinition) ![]u8 {
        // Simplified inline code generation
        // Remove CALLSUB/RETSUB instructions and inline the code directly
        var inline_code = try self.allocator.alloc(u8, subroutine.code.len);
        @memcpy(inline_code, subroutine.code);
        
        // Replace RETSUB with NOP or appropriate instruction
        for (inline_code) |*instruction| {
            if (instruction.* == 0xB0) { // RETSUB
                instruction.* = 0x5B; // JUMPDEST (safe placeholder)
            }
        }
        
        return inline_code;
    }
    
    pub const SubroutineContext = struct {
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
```

#### 5. Subroutine Definition
```zig
pub const SubroutineDefinition = struct {
    allocator: std.mem.Allocator,
    id: u16,
    name: []const u8,
    code: []const u8,
    parameter_count: u16,
    return_count: u16,
    local_variable_count: u16,
    code_start_offset: u32,
    code_end_offset: u32,
    stack_height_delta: i16,
    gas_cost_estimate: u64,
    is_recursive: bool,
    has_complex_control_flow: bool,
    optimization_hints: OptimizationHints,
    
    pub const OptimizationHints = struct {
        is_pure: bool,          // No side effects
        is_view: bool,          // Only reads state
        is_inline_candidate: bool,
        is_hot_path: bool,      // Frequently called
        memory_usage: MemoryUsage,
        
        pub const MemoryUsage = enum {
            None,
            Light,      // < 1KB
            Moderate,   // 1KB - 10KB
            Heavy,      // > 10KB
        };
    };
    
    pub fn init(
        allocator: std.mem.Allocator,
        name: []const u8,
        code: []const u8,
        parameter_count: u16,
        return_count: u16,
        local_variable_count: u16
    ) !SubroutineDefinition {
        const name_copy = try allocator.dupe(u8, name);
        const code_copy = try allocator.dupe(u8, code);
        
        return SubroutineDefinition{
            .allocator = allocator,
            .id = 0, // Will be set by registry
            .name = name_copy,
            .code = code_copy,
            .parameter_count = parameter_count,
            .return_count = return_count,
            .local_variable_count = local_variable_count,
            .code_start_offset = 0,
            .code_end_offset = @intCast(code.len),
            .stack_height_delta = @as(i16, @intCast(return_count)) - @as(i16, @intCast(parameter_count)),
            .gas_cost_estimate = 0,
            .is_recursive = false,
            .has_complex_control_flow = false,
            .optimization_hints = OptimizationHints{
                .is_pure = false,
                .is_view = false,
                .is_inline_candidate = false,
                .is_hot_path = false,
                .memory_usage = .None,
            },
        };
    }
    
    pub fn deinit(self: *SubroutineDefinition) void {
        self.allocator.free(self.name);
        self.allocator.free(self.code);
    }
    
    pub fn clone(self: *const SubroutineDefinition, allocator: std.mem.Allocator) !SubroutineDefinition {
        const name_copy = try allocator.dupe(u8, self.name);
        const code_copy = try allocator.dupe(u8, self.code);
        
        return SubroutineDefinition{
            .allocator = allocator,
            .id = self.id,
            .name = name_copy,
            .code = code_copy,
            .parameter_count = self.parameter_count,
            .return_count = self.return_count,
            .local_variable_count = self.local_variable_count,
            .code_start_offset = self.code_start_offset,
            .code_end_offset = self.code_end_offset,
            .stack_height_delta = self.stack_height_delta,
            .gas_cost_estimate = self.gas_cost_estimate,
            .is_recursive = self.is_recursive,
            .has_complex_control_flow = self.has_complex_control_flow,
            .optimization_hints = self.optimization_hints,
        };
    }
    
    pub fn analyze_control_flow(self: *SubroutineDefinition) !void {
        // Analyze the bytecode to determine control flow characteristics
        var has_jumps = false;
        var has_loops = false;
        var call_count = 0;
        
        var i: usize = 0;
        while (i < self.code.len) {
            const opcode = self.code[i];
            
            switch (opcode) {
                0x56, 0x57 => { // JUMP, JUMPI
                    has_jumps = true;
                },
                0x5D => { // CALLSUB
                    call_count += 1;
                    i += 2; // Skip subroutine ID
                },
                0xB0 => { // RETSUB
                    // Return instruction
                },
                else => {},
            }
            
            i += 1;
        }
        
        // Simple loop detection heuristic
        if (has_jumps and call_count > 0) {
            has_loops = true;
        }
        
        self.has_complex_control_flow = has_jumps or has_loops;
        self.is_recursive = self.detect_recursion();
    }
    
    fn detect_recursion(self: *const SubroutineDefinition) bool {
        // Simple recursion detection by looking for CALLSUB to self
        var i: usize = 0;
        while (i < self.code.len - 2) {
            if (self.code[i] == 0x5D) { // CALLSUB
                const subroutine_id = (@as(u16, self.code[i + 1]) << 8) | self.code[i + 2];
                if (subroutine_id == self.id) {
                    return true;
                }
                i += 3;
            } else {
                i += 1;
            }
        }
        return false;
    }
    
    pub fn estimate_gas_cost(self: *SubroutineDefinition) !void {
        // Simple gas cost estimation based on instruction count and complexity
        var gas_cost: u64 = 0;
        
        for (self.code) |opcode| {
            // Basic gas costs (simplified)
            gas_cost += switch (opcode) {
                0x00...0x0F => 3,   // Arithmetic
                0x10...0x1F => 3,   // Comparison
                0x20 => 30,         // KECCAK256
                0x30...0x3F => 2,   // Environmental
                0x50...0x5F => 3,   // Stack/Memory/Storage
                0x5D => 100,        // CALLSUB
                0xB0 => 50,         // RETSUB
                else => 1,
            };
        }
        
        // Adjust for complexity
        if (self.has_complex_control_flow) {
            gas_cost = @intFromFloat(@as(f64, @floatFromInt(gas_cost)) * 1.5);
        }
        
        if (self.is_recursive) {
            gas_cost = @intFromFloat(@as(f64, @floatFromInt(gas_cost)) * 2.0);
        }
        
        self.gas_cost_estimate = gas_cost;
    }
    
    pub fn set_optimization_hints(self: *SubroutineDefinition, hints: OptimizationHints) void {
        self.optimization_hints = hints;
        
        // Update inline candidate status
        self.optimization_hints.is_inline_candidate = 
            !self.is_recursive and 
            !self.has_complex_control_flow and 
            self.code.len <= 32 and
            hints.memory_usage == .None or hints.memory_usage == .Light;
    }
};
```

#### 6. Return Stack Protection
```zig
pub const ReturnStack = struct {
    allocator: std.mem.Allocator,
    addresses: []u32,
    top: u32,
    capacity: u32,
    
    pub fn init(allocator: std.mem.Allocator, capacity: u32) !ReturnStack {
        const addresses = try allocator.alloc(u32, capacity);
        
        return ReturnStack{
            .allocator = allocator,
            .addresses = addresses,
            .top = 0,
            .capacity = capacity,
        };
    }
    
    pub fn deinit(self: *ReturnStack) void {
        self.allocator.free(self.addresses);
    }
    
    pub fn push(self: *ReturnStack, address: u32) !void {
        if (self.top >= self.capacity) {
            return error.ReturnStackOverflow;
        }
        
        self.addresses[self.top] = address;
        self.top += 1;
    }
    
    pub fn pop(self: *ReturnStack) !u32 {
        if (self.top == 0) {
            return error.ReturnStackUnderflow;
        }
        
        self.top -= 1;
        return self.addresses[self.top];
    }
    
    pub fn contains(self: *const ReturnStack, address: u32) bool {
        for (0..self.top) |i| {
            if (self.addresses[i] == address) {
                return true;
            }
        }
        return false;
    }
    
    pub fn peek(self: *const ReturnStack) ?u32 {
        if (self.top == 0) {
            return null;
        }
        return self.addresses[self.top - 1];
    }
    
    pub fn clear(self: *ReturnStack) void {
        self.top = 0;
    }
    
    pub fn depth(self: *const ReturnStack) u32 {
        return self.top;
    }
    
    pub fn is_empty(self: *const ReturnStack) bool {
        return self.top == 0;
    }
    
    pub fn validate_return(self: *const ReturnStack, address: u32) bool {
        // Check if return address is in the stack (ROP protection)
        return self.contains(address);
    }
};
```

#### 7. Performance Tracking
```zig
pub const SubroutinePerformanceTracker = struct {
    call_counts: std.HashMap(u16, u64, SubroutineContext, std.hash_map.default_max_load_percentage),
    execution_times: std.HashMap(u16, ExecutionTimeStats, SubroutineContext, std.hash_map.default_max_load_percentage),
    tail_call_optimizations: u64,
    inline_optimizations: u64,
    total_calls: u64,
    total_returns: u64,
    
    pub const ExecutionTimeStats = struct {
        total_time_ns: u64,
        min_time_ns: u64,
        max_time_ns: u64,
        call_count: u64,
        
        pub fn init() ExecutionTimeStats {
            return ExecutionTimeStats{
                .total_time_ns = 0,
                .min_time_ns = std.math.maxInt(u64),
                .max_time_ns = 0,
                .call_count = 0,
            };
        }
        
        pub fn record_execution(self: *ExecutionTimeStats, time_ns: u64) void {
            self.total_time_ns += time_ns;
            self.call_count += 1;
            
            if (time_ns < self.min_time_ns) {
                self.min_time_ns = time_ns;
            }
            if (time_ns > self.max_time_ns) {
                self.max_time_ns = time_ns;
            }
        }
        
        pub fn get_average_time(self: *const ExecutionTimeStats) f64 {
            if (self.call_count == 0) return 0.0;
            return @as(f64, @floatFromInt(self.total_time_ns)) / @as(f64, @floatFromInt(self.call_count));
        }
    };
    
    pub const Metrics = struct {
        total_calls: u64,
        total_returns: u64,
        tail_call_optimizations: u64,
        inline_optimizations: u64,
        average_call_depth: f64,
        hot_subroutines: []const HotSubroutine,
        
        pub const HotSubroutine = struct {
            id: u16,
            call_count: u64,
            average_execution_time: f64,
        };
    };
    
    pub fn init() SubroutinePerformanceTracker {
        return SubroutinePerformanceTracker{
            .call_counts = std.HashMap(u16, u64, SubroutineContext, std.hash_map.default_max_load_percentage).init(std.heap.page_allocator),
            .execution_times = std.HashMap(u16, ExecutionTimeStats, SubroutineContext, std.hash_map.default_max_load_percentage).init(std.heap.page_allocator),
            .tail_call_optimizations = 0,
            .inline_optimizations = 0,
            .total_calls = 0,
            .total_returns = 0,
        };
    }
    
    pub fn deinit(self: *SubroutinePerformanceTracker) void {
        self.call_counts.deinit();
        self.execution_times.deinit();
    }
    
    pub fn record_call(self: *SubroutinePerformanceTracker, subroutine_id: u16) void {
        self.total_calls += 1;
        
        const count = self.call_counts.get(subroutine_id) orelse 0;
        self.call_counts.put(subroutine_id, count + 1) catch {};
    }
    
    pub fn record_return(self: *SubroutinePerformanceTracker, subroutine_id: u16) void {
        self.total_returns += 1;
        
        // Record execution time if we have timing data
        // This would be implemented with actual timing measurement
        _ = subroutine_id;
    }
    
    pub fn record_tail_call_optimization(self: *SubroutinePerformanceTracker, subroutine_id: u16) void {
        _ = subroutine_id;
        self.tail_call_optimizations += 1;
    }
    
    pub fn record_inline_optimization(self: *SubroutinePerformanceTracker, subroutine_id: u16) void {
        _ = subroutine_id;
        self.inline_optimizations += 1;
    }
    
    pub fn get_metrics(self: *const SubroutinePerformanceTracker) Metrics {
        // Create hot subroutines list
        var hot_subroutines = std.ArrayList(Metrics.HotSubroutine).init(std.heap.page_allocator);
        defer hot_subroutines.deinit();
        
        var iterator = self.call_counts.iterator();
        while (iterator.next()) |entry| {
            const subroutine_id = entry.key_ptr.*;
            const call_count = entry.value_ptr.*;
            
            if (call_count > 10) { // Threshold for "hot"
                const execution_stats = self.execution_times.get(subroutine_id) orelse ExecutionTimeStats.init();
                
                hot_subroutines.append(Metrics.HotSubroutine{
                    .id = subroutine_id,
                    .call_count = call_count,
                    .average_execution_time = execution_stats.get_average_time(),
                }) catch continue;
            }
        }
        
        return Metrics{
            .total_calls = self.total_calls,
            .total_returns = self.total_returns,
            .tail_call_optimizations = self.tail_call_optimizations,
            .inline_optimizations = self.inline_optimizations,
            .average_call_depth = if (self.total_calls > 0) 
                @as(f64, @floatFromInt(self.total_calls)) / @as(f64, @floatFromInt(self.total_returns))
            else 0.0,
            .hot_subroutines = hot_subroutines.toOwnedSlice() catch &[_]Metrics.HotSubroutine{},
        };
    }
    
    pub const SubroutineContext = struct {
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
```

## Implementation Requirements

### Core Functionality
1. **EOF Subroutine Support**: Complete implementation of CALLSUB/RETSUB instructions
2. **Call Stack Management**: Efficient call stack with overflow protection
3. **Return Stack Protection**: Security against ROP attacks
4. **Local Variable Management**: Proper scoping and lifecycle management
5. **Performance Optimization**: Tail call optimization and inlining
6. **Integration with EVM**: Seamless integration with existing EVM execution

## Implementation Tasks

### Task 1: Implement Subroutine Opcodes
File: `/src/evm/execution/subroutine.zig`
```zig
const std = @import("std");
const SubroutineStackManager = @import("../subroutine_stack/subroutine_stack_manager.zig").SubroutineStackManager;

pub fn execute_callsub(context: *ExecutionContext, manager: *SubroutineStackManager) !void {
    // Get subroutine ID from bytecode
    const subroutine_id = try context.read_u16_from_bytecode();
    
    // Get arguments from stack
    const subroutine = manager.subroutine_registry.get_subroutine(subroutine_id) orelse {
        return error.SubroutineNotFound;
    };
    
    var args = try context.allocator.alloc(u256, subroutine.parameter_count);
    defer context.allocator.free(args);
    
    // Pop arguments in reverse order
    var i: usize = subroutine.parameter_count;
    while (i > 0) {
        i -= 1;
        args[i] = try context.stack.pop();
    }
    
    // Call subroutine
    const call_frame = try manager.call_subroutine(subroutine_id, args);
    
    // Update execution context
    context.pc = subroutine.code_start_offset;
    context.call_depth += 1;
    
    // Consume gas
    try context.consume_gas(subroutine.gas_cost_estimate);
}

pub fn execute_retsub(context: *ExecutionContext, manager: *SubroutineStackManager) !void {
    // Get current call frame
    const call_frame = manager.get_current_call_frame() orelse {
        return error.NoActiveSubroutine;
    };
    
    // Get return values from stack
    var return_values = try context.allocator.alloc(u256, call_frame.subroutine.return_count);
    defer context.allocator.free(return_values);
    
    // Pop return values in reverse order
    var i: usize = call_frame.subroutine.return_count;
    while (i > 0) {
        i -= 1;
        return_values[i] = try context.stack.pop();
    }
    
    // Return from subroutine
    try manager.return_from_subroutine(return_values);
    
    // Push return values back to stack
    for (return_values) |value| {
        try context.stack.push(value);
    }
    
    // Update execution context
    context.call_depth -= 1;
    
    // Consume gas for return
    try context.consume_gas(50);
}
```

### Task 2: Integrate with Jump Table
File: `/src/evm/jump_table/jump_table.zig` (modify existing)
```zig
const SubroutineOpcodes = @import("../execution/subroutine.zig");

pub fn init_subroutine_opcodes(jump_table: *JumpTable, hardfork: Hardfork) void {
    if (hardfork.supports_eof()) {
        // CALLSUB - 0x5D
        jump_table.operations[0x5D] = OperationConfig{
            .gas_cost = 100,
            .stack_input = 0, // Variable based on subroutine
            .stack_output = 0, // Variable based on subroutine
            .memory_size_offset = null,
            .memory_size_size = null,
            .writes_memory = false,
            .reads_memory = false,
            .execution_fn = execute_callsub_wrapper,
        };
        
        // RETSUB - 0xB0
        jump_table.operations[0xB0] = OperationConfig{
            .gas_cost = 50,
            .stack_input = 0, // Variable based on subroutine
            .stack_output = 0, // Variable based on subroutine
            .memory_size_offset = null,
            .memory_size_size = null,
            .writes_memory = false,
            .reads_memory = false,
            .execution_fn = execute_retsub_wrapper,
        };
    }
}

fn execute_callsub_wrapper(context: *ExecutionContext) !void {
    if (context.subroutine_manager) |*manager| {
        try SubroutineOpcodes.execute_callsub(context, manager);
    } else {
        return error.SubroutinesNotEnabled;
    }
}

fn execute_retsub_wrapper(context: *ExecutionContext) !void {
    if (context.subroutine_manager) |*manager| {
        try SubroutineOpcodes.execute_retsub(context, manager);
    } else {
        return error.SubroutinesNotEnabled;
    }
}
```

### Task 3: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const SubroutineStackManager = @import("subroutine_stack/subroutine_stack_manager.zig").SubroutineStackManager;

pub const Vm = struct {
    // Existing fields...
    subroutine_manager: ?SubroutineStackManager,
    subroutine_enabled: bool,
    
    pub fn enable_subroutines(self: *Vm, config: SubroutineStackManager.SubroutineConfig) !void {
        self.subroutine_manager = try SubroutineStackManager.init(self.allocator, config);
        self.subroutine_enabled = true;
    }
    
    pub fn disable_subroutines(self: *Vm) void {
        if (self.subroutine_manager) |*manager| {
            manager.deinit();
            self.subroutine_manager = null;
        }
        self.subroutine_enabled = false;
    }
    
    pub fn register_subroutine(self: *Vm, definition: SubroutineDefinition) !u16 {
        if (self.subroutine_manager) |*manager| {
            return try manager.register_subroutine(definition);
        }
        return error.SubroutinesNotEnabled;
    }
    
    pub fn get_subroutine_metrics(self: *Vm) ?SubroutinePerformanceTracker.Metrics {
        if (self.subroutine_manager) |*manager| {
            return manager.get_performance_metrics();
        }
        return null;
    }
    
    pub fn optimize_subroutines(self: *Vm) !void {
        if (self.subroutine_manager) |*manager| {
            try manager.subroutine_registry.optimize_inlining(2.0); // Threshold
        }
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/subroutine_stack/subroutine_stack_test.zig`

### Test Cases
```zig
test "subroutine stack manager initialization" {
    // Test manager creation with different configs
    // Test call stack and return stack initialization
    // Test subroutine registry setup
}

test "subroutine registration and lookup" {
    // Test subroutine registration
    // Test subroutine retrieval
    // Test duplicate registration handling
}

test "call stack operations" {
    // Test call stack push/pop
    // Test stack overflow protection
    // Test call frame management
}

test "subroutine call and return" {
    // Test CALLSUB instruction execution
    // Test RETSUB instruction execution
    // Test parameter and return value handling
}

test "return stack protection" {
    // Test return address validation
    // Test ROP attack prevention
    // Test return stack overflow
}

test "tail call optimization" {
    // Test tail call detection
    // Test optimization application
    // Test performance improvement measurement
}

test "subroutine inlining" {
    // Test inline candidate detection
    // Test inline code generation
    // Test performance benefits
}

test "integration with VM execution" {
    // Test VM integration
    // Test EOF contract execution
    // Test performance impact measurement
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/subroutine_stack/subroutine_stack_manager.zig` - Main subroutine management
- `/src/evm/subroutine_stack/call_stack.zig` - Call stack implementation
- `/src/evm/subroutine_stack/call_frame.zig` - Call frame structure
- `/src/evm/subroutine_stack/subroutine_registry.zig` - Subroutine management
- `/src/evm/subroutine_stack/subroutine_definition.zig` - Subroutine definitions
- `/src/evm/subroutine_stack/return_stack.zig` - Return stack protection
- `/src/evm/subroutine_stack/performance_tracker.zig` - Performance monitoring
- `/src/evm/execution/subroutine.zig` - Subroutine opcodes
- `/src/evm/jump_table/jump_table.zig` - Opcode integration
- `/src/evm/vm.zig` - VM integration
- `/test/evm/subroutine_stack/subroutine_stack_test.zig` - Comprehensive tests

## Success Criteria

1. **Complete EOF Support**: Full implementation of CALLSUB/RETSUB instructions
2. **Security**: Return stack protection against ROP attacks
3. **Performance**: Tail call optimization and inlining capabilities
4. **Compatibility**: Seamless integration with existing EVM execution
5. **Efficiency**: Minimal overhead when subroutines are not used
6. **Robust Error Handling**: Proper validation and error recovery

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

#### 1. **Unit Tests** (`/test/evm/subroutine/subroutine_stack_test.zig`)
```zig
// Test basic subroutine_stack functionality
test "subroutine_stack basic functionality works correctly"
test "subroutine_stack handles edge cases properly"
test "subroutine_stack validates inputs appropriately"
test "subroutine_stack produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "subroutine_stack integrates with EVM properly"
test "subroutine_stack maintains system compatibility"
test "subroutine_stack works with existing components"
test "subroutine_stack handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "subroutine_stack meets performance requirements"
test "subroutine_stack optimizes resource usage"
test "subroutine_stack scales appropriately with load"
test "subroutine_stack benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "subroutine_stack meets specification requirements"
test "subroutine_stack maintains EVM compatibility"
test "subroutine_stack handles hardfork transitions"
test "subroutine_stack cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "subroutine_stack handles errors gracefully"
test "subroutine_stack proper error propagation"
test "subroutine_stack recovery from failure states"
test "subroutine_stack validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "subroutine_stack prevents security vulnerabilities"
test "subroutine_stack handles malicious inputs safely"
test "subroutine_stack maintains isolation boundaries"
test "subroutine_stack validates security properties"
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
test "subroutine_stack basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = subroutine_stack.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const subroutine_stack = struct {
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

- [EIP-4200: EOF - Static relative jumps](https://eips.ethereum.org/EIPS/eip-4200) - Foundation for EOF
- [EIP-4750: EOF - Functions](https://eips.ethereum.org/EIPS/eip-4750) - Subroutine specifications
- [EOF Specification](https://notes.ethereum.org/@ipsilon/eof1-checklist) - Complete EOF design
- [Return-Oriented Programming](https://en.wikipedia.org/wiki/Return-oriented_programming) - Security considerations
- [Tail Call Optimization](https://en.wikipedia.org/wiki/Tail_call) - Performance optimization techniques