# Implement Extension Points

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_extension_points` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_extension_points feat_implement_extension_points`
3. **Work in isolation**: `cd g/feat_implement_extension_points`
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

Implement a comprehensive extension points system that allows configurable extension of EVM functionality through plugin-like components. This enables custom opcodes, precompiles, state hooks, execution hooks, and chain-specific behavior to be added without modifying core EVM code. The system should support compile-time and runtime extension registration with type safety and performance optimization.

## ELI5

Extension points are like having electrical outlets throughout the EVM where you can plug in custom functionality. Just like how you can plug different devices into wall outlets to extend what your house can do (lamps, computers, appliances), extension points let you plug in custom code to extend what the EVM can do - like adding new operations, custom processing hooks, or chain-specific features - without having to rewire the core system.

## Extension Points System Specifications

### Core Extension Framework

#### 1. Extension Manager
```zig
pub const ExtensionManager = struct {
    allocator: std.mem.Allocator,
    config: ExtensionConfig,
    extension_registry: ExtensionRegistry,
    hook_manager: HookManager,
    plugin_loader: PluginLoader,
    execution_context: ExtensionExecutionContext,
    performance_tracker: ExtensionPerformanceTracker,
    
    pub const ExtensionConfig = struct {
        enable_extensions: bool,
        enable_runtime_loading: bool,
        enable_hot_reloading: bool,
        enable_sandboxing: bool,
        max_extensions: u32,
        max_hooks_per_point: u32,
        extension_timeout_ms: u64,
        security_level: SecurityLevel,
        
        pub const SecurityLevel = enum {
            None,        // No security restrictions
            Basic,       // Basic validation
            Strict,      // Strict validation and sandboxing
            Paranoid,    // Maximum security with isolation
        };
        
        pub fn production() ExtensionConfig {
            return ExtensionConfig{
                .enable_extensions = true,
                .enable_runtime_loading = false,
                .enable_hot_reloading = false,
                .enable_sandboxing = true,
                .max_extensions = 100,
                .max_hooks_per_point = 10,
                .extension_timeout_ms = 1000,
                .security_level = .Strict,
            };
        }
        
        pub fn development() ExtensionConfig {
            return ExtensionConfig{
                .enable_extensions = true,
                .enable_runtime_loading = true,
                .enable_hot_reloading = true,
                .enable_sandboxing = false,
                .max_extensions = 50,
                .max_hooks_per_point = 20,
                .extension_timeout_ms = 5000,
                .security_level = .Basic,
            };
        }
        
        pub fn testing() ExtensionConfig {
            return ExtensionConfig{
                .enable_extensions = true,
                .enable_runtime_loading = true,
                .enable_hot_reloading = false,
                .enable_sandboxing = true,
                .max_extensions = 10,
                .max_hooks_per_point = 5,
                .extension_timeout_ms = 100,
                .security_level = .Paranoid,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ExtensionConfig) !ExtensionManager {
        return ExtensionManager{
            .allocator = allocator,
            .config = config,
            .extension_registry = try ExtensionRegistry.init(allocator, config),
            .hook_manager = try HookManager.init(allocator, config),
            .plugin_loader = try PluginLoader.init(allocator, config),
            .execution_context = ExtensionExecutionContext.init(),
            .performance_tracker = ExtensionPerformanceTracker.init(allocator),
        };
    }
    
    pub fn deinit(self: *ExtensionManager) void {
        self.extension_registry.deinit();
        self.hook_manager.deinit();
        self.plugin_loader.deinit();
        self.performance_tracker.deinit();
    }
    
    pub fn register_extension(self: *ExtensionManager, extension: Extension) !ExtensionId {
        if (!self.config.enable_extensions) {
            return error.ExtensionsDisabled;
        }
        
        // Validate extension
        try self.validate_extension(&extension);
        
        // Register with registry
        const extension_id = try self.extension_registry.register(extension);
        
        // Register hooks
        try self.hook_manager.register_extension_hooks(extension_id, extension.hooks);
        
        return extension_id;
    }
    
    pub fn unregister_extension(self: *ExtensionManager, extension_id: ExtensionId) !void {
        // Unregister hooks first
        try self.hook_manager.unregister_extension_hooks(extension_id);
        
        // Unregister from registry
        try self.extension_registry.unregister(extension_id);
    }
    
    pub fn execute_hook(self: *ExtensionManager, hook_point: HookPoint, context: *HookContext) !HookResult {
        if (!self.config.enable_extensions) {
            return HookResult.continue_execution();
        }
        
        const start_time = std.time.nanoTimestamp();
        defer {
            const end_time = std.time.nanoTimestamp();
            self.performance_tracker.record_hook_execution(hook_point, end_time - start_time);
        }
        
        return try self.hook_manager.execute_hooks(hook_point, context);
    }
    
    pub fn load_plugin(self: *ExtensionManager, plugin_path: []const u8) !ExtensionId {
        if (!self.config.enable_runtime_loading) {
            return error.RuntimeLoadingDisabled;
        }
        
        const plugin = try self.plugin_loader.load_plugin(plugin_path);
        return try self.register_extension(plugin);
    }
    
    pub fn reload_plugin(self: *ExtensionManager, extension_id: ExtensionId) !void {
        if (!self.config.enable_hot_reloading) {
            return error.HotReloadingDisabled;
        }
        
        const extension = self.extension_registry.get(extension_id) orelse return error.ExtensionNotFound;
        
        // Unregister current extension
        try self.unregister_extension(extension_id);
        
        // Reload and re-register
        const new_plugin = try self.plugin_loader.reload_plugin(extension.plugin_path.?);
        _ = try self.register_extension(new_plugin);
    }
    
    fn validate_extension(self: *ExtensionManager, extension: *const Extension) !void {
        switch (self.config.security_level) {
            .None => {},
            .Basic => try self.basic_validation(extension),
            .Strict => try self.strict_validation(extension),
            .Paranoid => try self.paranoid_validation(extension),
        }
    }
    
    fn basic_validation(self: *ExtensionManager, extension: *const Extension) !void {
        _ = self;
        
        // Basic checks
        if (extension.name.len == 0) {
            return error.InvalidExtensionName;
        }
        
        if (extension.version.len == 0) {
            return error.InvalidExtensionVersion;
        }
        
        // Check for null function pointers
        for (extension.hooks) |hook| {
            if (hook.handler == null) {
                return error.InvalidHookHandler;
            }
        }
    }
    
    fn strict_validation(self: *ExtensionManager, extension: *const Extension) !void {
        try self.basic_validation(extension);
        
        // Check extension signature/hash
        if (extension.signature) |signature| {
            try self.verify_extension_signature(extension, signature);
        }
        
        // Validate hook safety
        for (extension.hooks) |hook| {
            try self.validate_hook_safety(hook);
        }
        
        // Check resource limits
        if (extension.memory_limit) |limit| {
            if (limit > 16 * 1024 * 1024) { // 16MB limit
                return error.ExcessiveMemoryLimit;
            }
        }
    }
    
    fn paranoid_validation(self: *ExtensionManager, extension: *const Extension) !void {
        try self.strict_validation(extension);
        
        // Additional paranoid checks
        try self.scan_for_malicious_patterns(extension);
        try self.verify_extension_isolation(extension);
        try self.check_capability_requirements(extension);
    }
    
    fn verify_extension_signature(self: *ExtensionManager, extension: *const Extension, signature: []const u8) !void {
        _ = self;
        _ = extension;
        _ = signature;
        
        // Cryptographic signature verification would go here
        // For now, placeholder implementation
    }
    
    fn validate_hook_safety(self: *ExtensionManager, hook: Hook) !void {
        _ = self;
        
        // Check hook point validity
        if (!hook.hook_point.is_valid()) {
            return error.InvalidHookPoint;
        }
        
        // Check handler safety attributes
        if (hook.safety_level == .Unsafe and self.config.security_level != .None) {
            return error.UnsafeHookInSecureMode;
        }
    }
    
    fn scan_for_malicious_patterns(self: *ExtensionManager, extension: *const Extension) !void {
        _ = self;
        _ = extension;
        
        // Static analysis for malicious patterns would go here
        // Check for suspicious system calls, buffer overflows, etc.
    }
    
    fn verify_extension_isolation(self: *ExtensionManager, extension: *const Extension) !void {
        _ = self;
        
        // Verify extension can be properly isolated
        if (extension.requires_isolation and !self.config.enable_sandboxing) {
            return error.IsolationRequired;
        }
    }
    
    fn check_capability_requirements(self: *ExtensionManager, extension: *const Extension) !void {
        _ = self;
        
        // Check if extension requires capabilities not available
        for (extension.required_capabilities) |capability| {
            if (!self.is_capability_available(capability)) {
                return error.CapabilityNotAvailable;
            }
        }
    }
    
    fn is_capability_available(self: *ExtensionManager, capability: Capability) bool {
        _ = self;
        _ = capability;
        
        // Check if specific capability is available in current environment
        return true; // Placeholder
    }
    
    pub const ExtensionId = u64;
    
    pub const Extension = struct {
        id: ?ExtensionId,
        name: []const u8,
        version: []const u8,
        description: []const u8,
        author: []const u8,
        hooks: []const Hook,
        custom_opcodes: []const CustomOpcode,
        custom_precompiles: []const CustomPrecompile,
        required_capabilities: []const Capability,
        memory_limit: ?usize,
        signature: ?[]const u8,
        plugin_path: ?[]const u8,
        requires_isolation: bool,
        
        pub fn init(name: []const u8, version: []const u8) Extension {
            return Extension{
                .id = null,
                .name = name,
                .version = version,
                .description = "",
                .author = "",
                .hooks = &[_]Hook{},
                .custom_opcodes = &[_]CustomOpcode{},
                .custom_precompiles = &[_]CustomPrecompile{},
                .required_capabilities = &[_]Capability{},
                .memory_limit = null,
                .signature = null,
                .plugin_path = null,
                .requires_isolation = false,
            };
        }
    };
    
    pub const Capability = enum {
        FileSystemAccess,
        NetworkAccess,
        SystemCalls,
        MemoryAccess,
        CryptoOperations,
        TimeAccess,
        RandomAccess,
        StateModification,
        GasModification,
        Custom,
    };
};
```

#### 2. Hook System
```zig
pub const HookManager = struct {
    allocator: std.mem.Allocator,
    config: ExtensionManager.ExtensionConfig,
    hooks: std.HashMap(HookPoint, std.ArrayList(RegisteredHook), HookPointContext, std.hash_map.default_max_load_percentage),
    hook_execution_order: HookExecutionOrder,
    
    pub const HookPoint = enum {
        // Execution hooks
        PreExecute,           // Before any execution
        PostExecute,          // After execution completion
        PreOpcode,           // Before opcode execution
        PostOpcode,          // After opcode execution
        
        // State hooks
        PreStateChange,      // Before state modification
        PostStateChange,     // After state modification
        PreAccountAccess,    // Before account access
        PostAccountAccess,   // After account access
        
        // Memory hooks
        PreMemoryRead,       // Before memory read
        PostMemoryRead,      // After memory read
        PreMemoryWrite,      // Before memory write
        PostMemoryWrite,     // After memory write
        
        // Gas hooks
        PreGasCalculation,   // Before gas calculation
        PostGasCalculation,  // After gas calculation
        PreGasConsumption,   // Before gas consumption
        PostGasConsumption,  // After gas consumption
        
        // Call hooks
        PreCall,             // Before contract call
        PostCall,            // After contract call
        PreCreate,           // Before contract creation
        PostCreate,          // After contract creation
        
        // Transaction hooks
        PreTransaction,      // Before transaction execution
        PostTransaction,     // After transaction execution
        PreValidation,       // Before transaction validation
        PostValidation,      // After transaction validation
        
        // Block hooks
        PreBlock,            // Before block processing
        PostBlock,           // After block processing
        PreBlockValidation,  // Before block validation
        PostBlockValidation, // After block validation
        
        // Custom hooks
        Custom,              // Custom extension-defined hooks
        
        pub fn is_valid(self: HookPoint) bool {
            return @intFromEnum(self) <= @intFromEnum(HookPoint.Custom);
        }
        
        pub fn is_critical_path(self: HookPoint) bool {
            return switch (self) {
                .PreOpcode, .PostOpcode, .PreGasCalculation, .PostGasCalculation => true,
                else => false,
            };
        }
        
        pub fn execution_priority(self: HookPoint) u8 {
            return switch (self) {
                .PreExecute, .PostExecute => 10,
                .PreOpcode, .PostOpcode => 9,
                .PreGasCalculation, .PostGasCalculation => 8,
                .PreStateChange, .PostStateChange => 7,
                .PreMemoryRead, .PostMemoryRead, .PreMemoryWrite, .PostMemoryWrite => 6,
                .PreCall, .PostCall, .PreCreate, .PostCreate => 5,
                .PreTransaction, .PostTransaction => 4,
                .PreBlock, .PostBlock => 3,
                .PreValidation, .PostValidation, .PreBlockValidation, .PostBlockValidation => 2,
                .PreAccountAccess, .PostAccountAccess, .PreGasConsumption, .PostGasConsumption => 1,
                .Custom => 0,
            };
        }
    };
    
    pub const Hook = struct {
        hook_point: HookPoint,
        handler: ?*const fn(*HookContext) HookResult,
        priority: u8,
        enabled: bool,
        safety_level: SafetyLevel,
        execution_order: ExecutionOrder,
        condition: ?*const fn(*HookContext) bool,
        
        pub const SafetyLevel = enum {
            Safe,      // Safe for all contexts
            Unsafe,    // May have side effects
            Critical,  // Critical system operation
        };
        
        pub const ExecutionOrder = enum {
            First,     // Execute first
            Normal,    // Normal execution order
            Last,      // Execute last
        };
        
        pub fn init(hook_point: HookPoint, handler: *const fn(*HookContext) HookResult) Hook {
            return Hook{
                .hook_point = hook_point,
                .handler = handler,
                .priority = 50,
                .enabled = true,
                .safety_level = .Safe,
                .execution_order = .Normal,
                .condition = null,
            };
        }
    };
    
    pub const RegisteredHook = struct {
        hook: Hook,
        extension_id: ExtensionManager.ExtensionId,
        registration_time: i64,
        execution_count: u64,
        total_execution_time_ns: u64,
        last_execution_time_ns: i64,
        
        pub fn init(hook: Hook, extension_id: ExtensionManager.ExtensionId) RegisteredHook {
            return RegisteredHook{
                .hook = hook,
                .extension_id = extension_id,
                .registration_time = std.time.milliTimestamp(),
                .execution_count = 0,
                .total_execution_time_ns = 0,
                .last_execution_time_ns = 0,
            };
        }
        
        pub fn record_execution(self: *RegisteredHook, execution_time_ns: u64) void {
            self.execution_count += 1;
            self.total_execution_time_ns += execution_time_ns;
            self.last_execution_time_ns = std.time.nanoTimestamp();
        }
        
        pub fn get_average_execution_time(self: *const RegisteredHook) f64 {
            if (self.execution_count == 0) return 0;
            return @as(f64, @floatFromInt(self.total_execution_time_ns)) / @as(f64, @floatFromInt(self.execution_count));
        }
    };
    
    pub const HookContext = struct {
        execution_context: *ExecutionContext,
        opcode: ?u8,
        stack: ?*Stack,
        memory: ?*Memory,
        state: ?*State,
        gas_remaining: ?*u64,
        call_data: ?[]const u8,
        return_data: ?[]const u8,
        custom_data: ?*anyopaque,
        
        pub fn init(execution_context: *ExecutionContext) HookContext {
            return HookContext{
                .execution_context = execution_context,
                .opcode = null,
                .stack = null,
                .memory = null,
                .state = null,
                .gas_remaining = null,
                .call_data = null,
                .return_data = null,
                .custom_data = null,
            };
        }
        
        pub fn with_opcode(self: HookContext, opcode: u8) HookContext {
            var context = self;
            context.opcode = opcode;
            return context;
        }
        
        pub fn with_stack(self: HookContext, stack: *Stack) HookContext {
            var context = self;
            context.stack = stack;
            return context;
        }
        
        pub fn with_memory(self: HookContext, memory: *Memory) HookContext {
            var context = self;
            context.memory = memory;
            return context;
        }
        
        pub fn with_state(self: HookContext, state: *State) HookContext {
            var context = self;
            context.state = state;
            return context;
        }
    };
    
    pub const HookResult = union(enum) {
        Continue: void,                    // Continue normal execution
        Skip: void,                       // Skip remaining hooks
        Abort: HookError,                 // Abort execution with error
        Modify: HookModification,         // Modify execution state
        Replace: HookReplacement,         // Replace operation entirely
        
        pub fn continue_execution() HookResult {
            return HookResult{ .Continue = {} };
        }
        
        pub fn skip_remaining() HookResult {
            return HookResult{ .Skip = {} };
        }
        
        pub fn abort_with_error(err: HookError) HookResult {
            return HookResult{ .Abort = err };
        }
        
        pub fn modify_state(modification: HookModification) HookResult {
            return HookResult{ .Modify = modification };
        }
        
        pub fn replace_operation(replacement: HookReplacement) HookResult {
            return HookResult{ .Replace = replacement };
        }
    };
    
    pub const HookError = struct {
        error_code: u32,
        message: []const u8,
        recoverable: bool,
    };
    
    pub const HookModification = struct {
        modify_gas: ?u64,
        modify_stack: ?StackModification,
        modify_memory: ?MemoryModification,
        modify_state: ?StateModification,
        
        pub const StackModification = struct {
            push_values: []const u256,
            pop_count: u32,
        };
        
        pub const MemoryModification = struct {
            offset: u32,
            data: []const u8,
        };
        
        pub const StateModification = struct {
            account: Address,
            storage_key: u256,
            storage_value: u256,
        };
    };
    
    pub const HookReplacement = struct {
        replacement_type: ReplacementType,
        replacement_data: []const u8,
        gas_cost: u64,
        
        pub const ReplacementType = enum {
            CustomOpcode,     // Replace with custom opcode
            CustomFunction,   // Replace with custom function
            Bytecode,         // Replace with custom bytecode
        };
    };
    
    pub const HookExecutionOrder = enum {
        Priority,         // Execute by priority (high to low)
        Registration,     // Execute by registration order
        Dependency,       // Execute by dependency order
        Performance,      // Execute by performance (fast first)
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ExtensionManager.ExtensionConfig) !HookManager {
        return HookManager{
            .allocator = allocator,
            .config = config,
            .hooks = std.HashMap(HookPoint, std.ArrayList(RegisteredHook), HookPointContext, std.hash_map.default_max_load_percentage).init(allocator),
            .hook_execution_order = .Priority,
        };
    }
    
    pub fn deinit(self: *HookManager) void {
        var iterator = self.hooks.iterator();
        while (iterator.next()) |entry| {
            entry.value_ptr.deinit();
        }
        self.hooks.deinit();
    }
    
    pub fn register_extension_hooks(self: *HookManager, extension_id: ExtensionManager.ExtensionId, hooks: []const Hook) !void {
        for (hooks) |hook| {
            try self.register_hook(extension_id, hook);
        }
    }
    
    pub fn unregister_extension_hooks(self: *HookManager, extension_id: ExtensionManager.ExtensionId) !void {
        var iterator = self.hooks.iterator();
        while (iterator.next()) |entry| {
            var i: usize = 0;
            while (i < entry.value_ptr.items.len) {
                if (entry.value_ptr.items[i].extension_id == extension_id) {
                    _ = entry.value_ptr.swapRemove(i);
                } else {
                    i += 1;
                }
            }
        }
    }
    
    fn register_hook(self: *HookManager, extension_id: ExtensionManager.ExtensionId, hook: Hook) !void {
        var hook_list = self.hooks.getPtr(hook.hook_point) orelse blk: {
            const new_list = std.ArrayList(RegisteredHook).init(self.allocator);
            try self.hooks.put(hook.hook_point, new_list);
            break :blk self.hooks.getPtr(hook.hook_point).?;
        };
        
        // Check hook limit
        if (hook_list.items.len >= self.config.max_hooks_per_point) {
            return error.TooManyHooks;
        }
        
        const registered_hook = RegisteredHook.init(hook, extension_id);
        try hook_list.append(registered_hook);
        
        // Sort hooks by execution order
        self.sort_hooks(hook_list);
    }
    
    pub fn execute_hooks(self: *HookManager, hook_point: HookPoint, context: *HookContext) !HookResult {
        const hook_list = self.hooks.get(hook_point) orelse return HookResult.continue_execution();
        
        for (hook_list.items) |*registered_hook| {
            if (!registered_hook.hook.enabled) continue;
            
            // Check condition if present
            if (registered_hook.hook.condition) |condition| {
                if (!condition(context)) continue;
            }
            
            const start_time = std.time.nanoTimestamp();
            
            // Execute hook with timeout
            const result = if (registered_hook.hook.handler) |handler|
                try self.execute_hook_with_timeout(handler, context)
            else
                HookResult.continue_execution();
            
            const end_time = std.time.nanoTimestamp();
            registered_hook.record_execution(@intCast(end_time - start_time));
            
            // Handle result
            switch (result) {
                .Continue => continue,
                .Skip => return result,
                .Abort => return result,
                .Modify => {
                    try self.apply_modification(context, result.Modify);
                    continue;
                },
                .Replace => return result,
            }
        }
        
        return HookResult.continue_execution();
    }
    
    fn execute_hook_with_timeout(self: *HookManager, handler: *const fn(*HookContext) HookResult, context: *HookContext) !HookResult {
        _ = self;
        
        // Simple timeout implementation - in practice would use proper timeout mechanism
        return handler(context);
    }
    
    fn apply_modification(self: *HookManager, context: *HookContext, modification: HookModification) !void {
        _ = self;
        
        // Apply gas modification
        if (modification.modify_gas) |gas| {
            if (context.gas_remaining) |gas_ptr| {
                gas_ptr.* = gas;
            }
        }
        
        // Apply stack modifications
        if (modification.modify_stack) |stack_mod| {
            if (context.stack) |stack| {
                // Pop values
                for (0..stack_mod.pop_count) |_| {
                    _ = stack.pop() catch break;
                }
                
                // Push values
                for (stack_mod.push_values) |value| {
                    stack.push(value) catch break;
                }
            }
        }
        
        // Apply memory modifications
        if (modification.modify_memory) |mem_mod| {
            if (context.memory) |memory| {
                memory.write(mem_mod.offset, mem_mod.data) catch {};
            }
        }
        
        // Apply state modifications
        if (modification.modify_state) |state_mod| {
            if (context.state) |state| {
                state.set_storage(state_mod.account, state_mod.storage_key, state_mod.storage_value) catch {};
            }
        }
    }
    
    fn sort_hooks(self: *HookManager, hook_list: *std.ArrayList(RegisteredHook)) void {
        std.sort.sort(RegisteredHook, hook_list.items, self.hook_execution_order, struct {
            fn lessThan(order: HookExecutionOrder, lhs: RegisteredHook, rhs: RegisteredHook) bool {
                return switch (order) {
                    .Priority => lhs.hook.priority > rhs.hook.priority,
                    .Registration => lhs.registration_time < rhs.registration_time,
                    .Dependency => false, // Would implement dependency sorting
                    .Performance => lhs.get_average_execution_time() < rhs.get_average_execution_time(),
                };
            }
        }.lessThan);
    }
    
    pub const HookPointContext = struct {
        pub fn hash(self: @This(), key: HookPoint) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: HookPoint, b: HookPoint) bool {
            _ = self;
            return a == b;
        }
    };
};
```

#### 3. Custom Opcodes and Precompiles
```zig
pub const CustomOpcode = struct {
    opcode: u8,
    name: []const u8,
    gas_cost: GasCost,
    stack_input: u8,
    stack_output: u8,
    implementation: OpcodeImplementation,
    validation: ?ValidationFunction,
    availability: Availability,
    
    pub const GasCost = union(enum) {
        Static: u64,
        Dynamic: *const fn(*ExecutionContext) u64,
        Complex: *const fn(*ExecutionContext, []const u256) u64,
    };
    
    pub const OpcodeImplementation = *const fn(*ExecutionContext, []const u256) OpcodeError![]const u256;
    pub const ValidationFunction = *const fn(*ExecutionContext, []const u256) bool;
    
    pub const Availability = struct {
        hardfork: ?Hardfork,
        chain_types: []const ChainType,
        conditions: []const AvailabilityCondition,
    };
    
    pub const AvailabilityCondition = *const fn(*ExecutionContext) bool;
    
    pub const OpcodeError = error{
        StackUnderflow,
        StackOverflow,
        InvalidInput,
        InsufficientGas,
        ExecutionFailed,
        NotImplemented,
    };
    
    pub fn init(opcode: u8, name: []const u8, implementation: OpcodeImplementation) CustomOpcode {
        return CustomOpcode{
            .opcode = opcode,
            .name = name,
            .gas_cost = GasCost{ .Static = 3 },
            .stack_input = 0,
            .stack_output = 0,
            .implementation = implementation,
            .validation = null,
            .availability = Availability{
                .hardfork = null,
                .chain_types = &[_]ChainType{},
                .conditions = &[_]AvailabilityCondition{},
            },
        };
    }
    
    pub fn calculate_gas(self: *const CustomOpcode, context: *ExecutionContext, inputs: []const u256) u64 {
        return switch (self.gas_cost) {
            .Static => |cost| cost,
            .Dynamic => |func| func(context),
            .Complex => |func| func(context, inputs),
        };
    }
    
    pub fn is_available(self: *const CustomOpcode, context: *ExecutionContext) bool {
        // Check hardfork
        if (self.availability.hardfork) |hardfork| {
            if (!context.hardfork_active(hardfork)) return false;
        }
        
        // Check chain type
        if (self.availability.chain_types.len > 0) {
            var chain_supported = false;
            for (self.availability.chain_types) |chain_type| {
                if (context.is_chain_type(chain_type)) {
                    chain_supported = true;
                    break;
                }
            }
            if (!chain_supported) return false;
        }
        
        // Check custom conditions
        for (self.availability.conditions) |condition| {
            if (!condition(context)) return false;
        }
        
        return true;
    }
    
    pub fn execute(self: *const CustomOpcode, context: *ExecutionContext, inputs: []const u256) OpcodeError![]const u256 {
        // Validate if validator is present
        if (self.validation) |validator| {
            if (!validator(context, inputs)) {
                return OpcodeError.InvalidInput;
            }
        }
        
        // Check availability
        if (!self.is_available(context)) {
            return OpcodeError.NotImplemented;
        }
        
        // Execute implementation
        return try self.implementation(context, inputs);
    }
};

pub const CustomPrecompile = struct {
    address: Address,
    name: []const u8,
    gas_calculation: GasCalculation,
    implementation: PrecompileImplementation,
    validation: ?PrecompileValidation,
    availability: Availability,
    
    pub const GasCalculation = *const fn([]const u8) u64;
    pub const PrecompileImplementation = *const fn([]const u8, std.mem.Allocator) PrecompileError![]const u8;
    pub const PrecompileValidation = *const fn([]const u8) bool;
    
    pub const PrecompileError = error{
        InvalidInput,
        InsufficientGas,
        ExecutionFailed,
        NotImplemented,
        OutOfMemory,
    };
    
    pub const Availability = CustomOpcode.Availability;
    
    pub fn init(address: Address, name: []const u8, implementation: PrecompileImplementation) CustomPrecompile {
        return CustomPrecompile{
            .address = address,
            .name = name,
            .gas_calculation = default_gas_calculation,
            .implementation = implementation,
            .validation = null,
            .availability = Availability{
                .hardfork = null,
                .chain_types = &[_]ChainType{},
                .conditions = &[_]AvailabilityCondition{},
            },
        };
    }
    
    pub fn calculate_gas(self: *const CustomPrecompile, input: []const u8) u64 {
        return self.gas_calculation(input);
    }
    
    pub fn is_available(self: *const CustomPrecompile, context: *ExecutionContext) bool {
        // Same availability logic as CustomOpcode
        return self.availability.hardfork == null or context.hardfork_active(self.availability.hardfork.?);
    }
    
    pub fn execute(self: *const CustomPrecompile, input: []const u8, allocator: std.mem.Allocator, context: *ExecutionContext) PrecompileError![]const u8 {
        // Validate input if validator is present
        if (self.validation) |validator| {
            if (!validator(input)) {
                return PrecompileError.InvalidInput;
            }
        }
        
        // Check availability
        if (!self.is_available(context)) {
            return PrecompileError.NotImplemented;
        }
        
        // Execute implementation
        return try self.implementation(input, allocator);
    }
    
    fn default_gas_calculation(input: []const u8) u64 {
        return 15 + (input.len * 3); // Base cost + per-byte cost
    }
};
```

#### 4. Extension Registry
```zig
pub const ExtensionRegistry = struct {
    allocator: std.mem.Allocator,
    config: ExtensionManager.ExtensionConfig,
    extensions: std.HashMap(ExtensionManager.ExtensionId, StoredExtension, ExtensionIdContext, std.hash_map.default_max_load_percentage),
    extension_by_name: std.HashMap([]const u8, ExtensionManager.ExtensionId, StringContext, std.hash_map.default_max_load_percentage),
    next_id: ExtensionManager.ExtensionId,
    
    pub const StoredExtension = struct {
        extension: ExtensionManager.Extension,
        metadata: ExtensionMetadata,
        runtime_data: ExtensionRuntimeData,
        
        pub const ExtensionMetadata = struct {
            registration_time: i64,
            last_update_time: i64,
            load_count: u64,
            execution_count: u64,
            total_execution_time_ns: u64,
            memory_usage: usize,
            status: ExtensionStatus,
            
            pub const ExtensionStatus = enum {
                Loaded,
                Active,
                Suspended,
                Failed,
                Unloading,
            };
        };
        
        pub const ExtensionRuntimeData = struct {
            allocated_memory: std.ArrayList([]u8),
            open_handles: std.ArrayList(Handle),
            active_threads: std.ArrayList(ThreadId),
            
            pub const Handle = union(enum) {
                File: FileHandle,
                Network: NetworkHandle,
                Timer: TimerHandle,
            };
            
            pub const FileHandle = struct {
                path: []const u8,
                mode: FileMode,
                
                pub const FileMode = enum {
                    Read,
                    Write,
                    ReadWrite,
                };
            };
            
            pub const NetworkHandle = struct {
                address: []const u8,
                port: u16,
                protocol: NetworkProtocol,
                
                pub const NetworkProtocol = enum {
                    TCP,
                    UDP,
                    HTTP,
                    HTTPS,
                };
            };
            
            pub const TimerHandle = struct {
                id: u64,
                interval_ms: u64,
                callback: *const fn() void,
            };
            
            pub const ThreadId = u64;
        };
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ExtensionManager.ExtensionConfig) !ExtensionRegistry {
        return ExtensionRegistry{
            .allocator = allocator,
            .config = config,
            .extensions = std.HashMap(ExtensionManager.ExtensionId, StoredExtension, ExtensionIdContext, std.hash_map.default_max_load_percentage).init(allocator),
            .extension_by_name = std.HashMap([]const u8, ExtensionManager.ExtensionId, StringContext, std.hash_map.default_max_load_percentage).init(allocator),
            .next_id = 1,
        };
    }
    
    pub fn deinit(self: *ExtensionRegistry) void {
        // Clean up all extensions
        var iterator = self.extensions.iterator();
        while (iterator.next()) |entry| {
            self.cleanup_extension_resources(&entry.value_ptr.runtime_data);
        }
        
        self.extensions.deinit();
        self.extension_by_name.deinit();
    }
    
    pub fn register(self: *ExtensionRegistry, extension: ExtensionManager.Extension) !ExtensionManager.ExtensionId {
        if (self.extensions.count() >= self.config.max_extensions) {
            return error.TooManyExtensions;
        }
        
        // Check for name conflicts
        if (self.extension_by_name.contains(extension.name)) {
            return error.ExtensionNameConflict;
        }
        
        const extension_id = self.next_id;
        self.next_id += 1;
        
        var stored_extension = StoredExtension{
            .extension = extension,
            .metadata = StoredExtension.ExtensionMetadata{
                .registration_time = std.time.milliTimestamp(),
                .last_update_time = std.time.milliTimestamp(),
                .load_count = 1,
                .execution_count = 0,
                .total_execution_time_ns = 0,
                .memory_usage = 0,
                .status = .Loaded,
            },
            .runtime_data = StoredExtension.ExtensionRuntimeData{
                .allocated_memory = std.ArrayList([]u8).init(self.allocator),
                .open_handles = std.ArrayList(StoredExtension.ExtensionRuntimeData.Handle).init(self.allocator),
                .active_threads = std.ArrayList(StoredExtension.ExtensionRuntimeData.ThreadId).init(self.allocator),
            },
        };
        
        stored_extension.extension.id = extension_id;
        
        try self.extensions.put(extension_id, stored_extension);
        try self.extension_by_name.put(extension.name, extension_id);
        
        return extension_id;
    }
    
    pub fn unregister(self: *ExtensionRegistry, extension_id: ExtensionManager.ExtensionId) !void {
        const stored_extension = self.extensions.getPtr(extension_id) orelse return error.ExtensionNotFound;
        
        // Update status
        stored_extension.metadata.status = .Unloading;
        
        // Clean up resources
        self.cleanup_extension_resources(&stored_extension.runtime_data);
        
        // Remove from registries
        _ = self.extension_by_name.remove(stored_extension.extension.name);
        _ = self.extensions.remove(extension_id);
    }
    
    pub fn get(self: *ExtensionRegistry, extension_id: ExtensionManager.ExtensionId) ?*StoredExtension {
        return self.extensions.getPtr(extension_id);
    }
    
    pub fn get_by_name(self: *ExtensionRegistry, name: []const u8) ?*StoredExtension {
        const extension_id = self.extension_by_name.get(name) orelse return null;
        return self.get(extension_id);
    }
    
    pub fn update_metadata(self: *ExtensionRegistry, extension_id: ExtensionManager.ExtensionId, execution_time_ns: u64) void {
        if (self.extensions.getPtr(extension_id)) |stored| {
            stored.metadata.execution_count += 1;
            stored.metadata.total_execution_time_ns += execution_time_ns;
            stored.metadata.last_update_time = std.time.milliTimestamp();
            stored.metadata.status = .Active;
        }
    }
    
    pub fn suspend_extension(self: *ExtensionRegistry, extension_id: ExtensionManager.ExtensionId) !void {
        const stored = self.extensions.getPtr(extension_id) orelse return error.ExtensionNotFound;
        stored.metadata.status = .Suspended;
    }
    
    pub fn resume_extension(self: *ExtensionRegistry, extension_id: ExtensionManager.ExtensionId) !void {
        const stored = self.extensions.getPtr(extension_id) orelse return error.ExtensionNotFound;
        stored.metadata.status = .Active;
    }
    
    pub fn get_extension_stats(self: *ExtensionRegistry) ExtensionStats {
        var stats = ExtensionStats{
            .total_extensions = self.extensions.count(),
            .active_extensions = 0,
            .suspended_extensions = 0,
            .failed_extensions = 0,
            .total_memory_usage = 0,
            .total_execution_time_ns = 0,
        };
        
        var iterator = self.extensions.iterator();
        while (iterator.next()) |entry| {
            const metadata = &entry.value_ptr.metadata;
            
            switch (metadata.status) {
                .Active, .Loaded => stats.active_extensions += 1,
                .Suspended => stats.suspended_extensions += 1,
                .Failed => stats.failed_extensions += 1,
                .Unloading => {},
            }
            
            stats.total_memory_usage += metadata.memory_usage;
            stats.total_execution_time_ns += metadata.total_execution_time_ns;
        }
        
        return stats;
    }
    
    fn cleanup_extension_resources(self: *ExtensionRegistry, runtime_data: *StoredExtension.ExtensionRuntimeData) void {
        // Free allocated memory
        for (runtime_data.allocated_memory.items) |memory| {
            self.allocator.free(memory);
        }
        runtime_data.allocated_memory.deinit();
        
        // Close handles
        runtime_data.open_handles.deinit();
        
        // Clean up threads
        runtime_data.active_threads.deinit();
    }
    
    pub const ExtensionStats = struct {
        total_extensions: u32,
        active_extensions: u32,
        suspended_extensions: u32,
        failed_extensions: u32,
        total_memory_usage: usize,
        total_execution_time_ns: u64,
    };
    
    pub const ExtensionIdContext = struct {
        pub fn hash(self: @This(), key: ExtensionManager.ExtensionId) u64 {
            _ = self;
            return key;
        }
        
        pub fn eql(self: @This(), a: ExtensionManager.ExtensionId, b: ExtensionManager.ExtensionId) bool {
            _ = self;
            return a == b;
        }
    };
    
    pub const StringContext = struct {
        pub fn hash(self: @This(), key: []const u8) u64 {
            _ = self;
            return std.hash_map.hashString(key);
        }
        
        pub fn eql(self: @This(), a: []const u8, b: []const u8) bool {
            _ = self;
            return std.mem.eql(u8, a, b);
        }
    };
};
```

#### 5. Plugin Loader
```zig
pub const PluginLoader = struct {
    allocator: std.mem.Allocator,
    config: ExtensionManager.ExtensionConfig,
    loaded_plugins: std.HashMap([]const u8, LoadedPlugin, StringContext, std.hash_map.default_max_load_percentage),
    plugin_cache: PluginCache,
    
    pub const LoadedPlugin = struct {
        path: []const u8,
        handle: ?*anyopaque,
        symbols: PluginSymbols,
        metadata: PluginMetadata,
        
        pub const PluginSymbols = struct {
            init_fn: ?*const fn() callconv(.C) c_int,
            deinit_fn: ?*const fn() callconv(.C) void,
            get_extension_fn: ?*const fn() callconv(.C) ExtensionManager.Extension,
            execute_hook_fn: ?*const fn(*HookManager.HookContext) callconv(.C) HookManager.HookResult,
        };
        
        pub const PluginMetadata = struct {
            version: []const u8,
            api_version: []const u8,
            author: []const u8,
            description: []const u8,
            load_time: i64,
            file_size: usize,
            checksum: []const u8,
        };
    };
    
    pub const PluginCache = struct {
        allocator: std.mem.Allocator,
        cache_entries: std.HashMap([]const u8, CacheEntry, StringContext, std.hash_map.default_max_load_percentage),
        
        pub const CacheEntry = struct {
            plugin_data: []u8,
            metadata: LoadedPlugin.PluginMetadata,
            last_access: i64,
            access_count: u64,
        };
        
        pub fn init(allocator: std.mem.Allocator) PluginCache {
            return PluginCache{
                .allocator = allocator,
                .cache_entries = std.HashMap([]const u8, CacheEntry, StringContext, std.hash_map.default_max_load_percentage).init(allocator),
            };
        }
        
        pub fn deinit(self: *PluginCache) void {
            var iterator = self.cache_entries.iterator();
            while (iterator.next()) |entry| {
                self.allocator.free(entry.value_ptr.plugin_data);
            }
            self.cache_entries.deinit();
        }
        
        pub fn get(self: *PluginCache, path: []const u8) ?*CacheEntry {
            const entry = self.cache_entries.getPtr(path) orelse return null;
            entry.last_access = std.time.milliTimestamp();
            entry.access_count += 1;
            return entry;
        }
        
        pub fn put(self: *PluginCache, path: []const u8, plugin_data: []const u8, metadata: LoadedPlugin.PluginMetadata) !void {
            const cached_data = try self.allocator.dupe(u8, plugin_data);
            const entry = CacheEntry{
                .plugin_data = cached_data,
                .metadata = metadata,
                .last_access = std.time.milliTimestamp(),
                .access_count = 1,
            };
            
            try self.cache_entries.put(path, entry);
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ExtensionManager.ExtensionConfig) !PluginLoader {
        return PluginLoader{
            .allocator = allocator,
            .config = config,
            .loaded_plugins = std.HashMap([]const u8, LoadedPlugin, StringContext, std.hash_map.default_max_load_percentage).init(allocator),
            .plugin_cache = PluginCache.init(allocator),
        };
    }
    
    pub fn deinit(self: *PluginLoader) void {
        // Unload all plugins
        var iterator = self.loaded_plugins.iterator();
        while (iterator.next()) |entry| {
            self.unload_plugin_internal(entry.value_ptr);
        }
        
        self.loaded_plugins.deinit();
        self.plugin_cache.deinit();
    }
    
    pub fn load_plugin(self: *PluginLoader, plugin_path: []const u8) !ExtensionManager.Extension {
        // Check if already loaded
        if (self.loaded_plugins.get(plugin_path)) |existing| {
            return try self.create_extension_from_plugin(&existing);
        }
        
        // Check cache first
        if (self.plugin_cache.get(plugin_path)) |cached| {
            return try self.load_from_cache(plugin_path, cached);
        }
        
        // Load plugin from file
        const plugin = try self.load_plugin_from_file(plugin_path);
        try self.loaded_plugins.put(plugin_path, plugin);
        
        return try self.create_extension_from_plugin(&plugin);
    }
    
    pub fn unload_plugin(self: *PluginLoader, plugin_path: []const u8) !void {
        const plugin = self.loaded_plugins.getPtr(plugin_path) orelse return error.PluginNotFound;
        
        self.unload_plugin_internal(plugin);
        _ = self.loaded_plugins.remove(plugin_path);
    }
    
    pub fn reload_plugin(self: *PluginLoader, plugin_path: []const u8) !ExtensionManager.Extension {
        // Unload existing plugin
        self.unload_plugin(plugin_path) catch {};
        
        // Remove from cache
        _ = self.plugin_cache.cache_entries.remove(plugin_path);
        
        // Load fresh copy
        return try self.load_plugin(plugin_path);
    }
    
    fn load_plugin_from_file(self: *PluginLoader, plugin_path: []const u8) !LoadedPlugin {
        // Read plugin file
        const file = std.fs.cwd().openFile(plugin_path, .{}) catch |err| switch (err) {
            error.FileNotFound => return error.PluginNotFound,
            else => return err,
        };
        defer file.close();
        
        const file_size = try file.getEndPos();
        const plugin_data = try self.allocator.alloc(u8, file_size);
        defer self.allocator.free(plugin_data);
        
        _ = try file.readAll(plugin_data);
        
        // Calculate checksum
        const checksum = try self.calculate_checksum(plugin_data);
        
        // Load dynamic library (platform-specific)
        const handle = try self.load_dynamic_library(plugin_path);
        
        // Resolve symbols
        const symbols = try self.resolve_plugin_symbols(handle);
        
        // Create metadata
        const metadata = LoadedPlugin.PluginMetadata{
            .version = "1.0.0", // Would read from plugin
            .api_version = "1.0.0",
            .author = "Unknown",
            .description = "Loaded plugin",
            .load_time = std.time.milliTimestamp(),
            .file_size = file_size,
            .checksum = checksum,
        };
        
        // Cache plugin data
        try self.plugin_cache.put(plugin_path, plugin_data, metadata);
        
        return LoadedPlugin{
            .path = try self.allocator.dupe(u8, plugin_path),
            .handle = handle,
            .symbols = symbols,
            .metadata = metadata,
        };
    }
    
    fn load_from_cache(self: *PluginLoader, plugin_path: []const u8, cached: *PluginCache.CacheEntry) !ExtensionManager.Extension {
        // Verify cached data is still valid
        const current_checksum = try self.calculate_checksum(cached.plugin_data);
        if (!std.mem.eql(u8, current_checksum, cached.metadata.checksum)) {
            return error.CacheInvalid;
        }
        
        // Load from cached data
        const handle = try self.load_dynamic_library(plugin_path);
        const symbols = try self.resolve_plugin_symbols(handle);
        
        const plugin = LoadedPlugin{
            .path = try self.allocator.dupe(u8, plugin_path),
            .handle = handle,
            .symbols = symbols,
            .metadata = cached.metadata,
        };
        
        try self.loaded_plugins.put(plugin_path, plugin);
        return try self.create_extension_from_plugin(&plugin);
    }
    
    fn create_extension_from_plugin(self: *PluginLoader, plugin: *const LoadedPlugin) !ExtensionManager.Extension {
        _ = self;
        
        // Call plugin's get_extension function
        if (plugin.symbols.get_extension_fn) |get_extension| {
            return get_extension();
        }
        
        // Create basic extension from plugin metadata
        return ExtensionManager.Extension{
            .id = null,
            .name = plugin.path,
            .version = plugin.metadata.version,
            .description = plugin.metadata.description,
            .author = plugin.metadata.author,
            .hooks = &[_]HookManager.Hook{},
            .custom_opcodes = &[_]CustomOpcode{},
            .custom_precompiles = &[_]CustomPrecompile{},
            .required_capabilities = &[_]ExtensionManager.Capability{},
            .memory_limit = null,
            .signature = null,
            .plugin_path = plugin.path,
            .requires_isolation = true,
        };
    }
    
    fn unload_plugin_internal(self: *PluginLoader, plugin: *LoadedPlugin) void {
        // Call plugin's deinit function
        if (plugin.symbols.deinit_fn) |deinit| {
            deinit();
        }
        
        // Unload dynamic library
        if (plugin.handle) |handle| {
            self.unload_dynamic_library(handle);
        }
        
        // Free path
        self.allocator.free(plugin.path);
    }
    
    fn load_dynamic_library(self: *PluginLoader, path: []const u8) !*anyopaque {
        _ = self;
        _ = path;
        
        // Platform-specific dynamic library loading
        // On Unix: dlopen()
        // On Windows: LoadLibrary()
        // For now, return placeholder
        return @ptrFromInt(0x1000);
    }
    
    fn unload_dynamic_library(self: *PluginLoader, handle: *anyopaque) void {
        _ = self;
        _ = handle;
        
        // Platform-specific dynamic library unloading
        // On Unix: dlclose()
        // On Windows: FreeLibrary()
    }
    
    fn resolve_plugin_symbols(self: *PluginLoader, handle: *anyopaque) !LoadedPlugin.PluginSymbols {
        _ = self;
        _ = handle;
        
        // Platform-specific symbol resolution
        // On Unix: dlsym()
        // On Windows: GetProcAddress()
        // For now, return empty symbols
        return LoadedPlugin.PluginSymbols{
            .init_fn = null,
            .deinit_fn = null,
            .get_extension_fn = null,
            .execute_hook_fn = null,
        };
    }
    
    fn calculate_checksum(self: *PluginLoader, data: []const u8) ![]const u8 {
        _ = self;
        
        // Calculate SHA-256 checksum
        var hasher = std.crypto.hash.sha2.Sha256.init(.{});
        hasher.update(data);
        const hash = hasher.finalResult();
        
        // Convert to hex string
        var checksum = try self.allocator.alloc(u8, hash.len * 2);
        for (hash, 0..) |byte, i| {
            _ = std.fmt.bufPrint(checksum[i*2..i*2+2], "{:02x}", .{byte}) catch unreachable;
        }
        
        return checksum;
    }
    
    pub const StringContext = ExtensionRegistry.StringContext;
};
```

## Implementation Requirements

### Core Functionality
1. **Flexible Extension Registration**: Support compile-time and runtime extension registration
2. **Hook System**: Comprehensive hook points throughout EVM execution flow
3. **Custom Opcodes**: Registration and execution of custom opcodes with proper validation
4. **Custom Precompiles**: Custom precompiled contracts with chain-specific behavior
5. **Plugin Loading**: Dynamic loading and unloading of extension plugins
6. **Security and Sandboxing**: Configurable security levels with proper isolation

## Implementation Tasks

### Task 1: Implement Extension Performance Tracker
File: `/src/evm/extension_points/extension_performance_tracker.zig`
```zig
const std = @import("std");
const ExtensionManager = @import("extension_manager.zig").ExtensionManager;
const HookManager = @import("hook_manager.zig").HookManager;

pub const ExtensionPerformanceTracker = struct {
    allocator: std.mem.Allocator,
    hook_metrics: std.HashMap(HookManager.HookPoint, HookMetrics, HookPointContext, std.hash_map.default_max_load_percentage),
    extension_metrics: std.HashMap(ExtensionManager.ExtensionId, ExtensionMetrics, ExtensionIdContext, std.hash_map.default_max_load_percentage),
    global_metrics: GlobalMetrics,
    
    pub const HookMetrics = struct {
        total_executions: u64,
        total_time_ns: u64,
        min_time_ns: u64,
        max_time_ns: u64,
        average_time_ns: f64,
        failure_count: u64,
        timeout_count: u64,
        
        pub fn init() HookMetrics {
            return HookMetrics{
                .total_executions = 0,
                .total_time_ns = 0,
                .min_time_ns = std.math.maxInt(u64),
                .max_time_ns = 0,
                .average_time_ns = 0,
                .failure_count = 0,
                .timeout_count = 0,
            };
        }
        
        pub fn record_execution(self: *HookMetrics, execution_time_ns: u64, failed: bool, timed_out: bool) void {
            self.total_executions += 1;
            self.total_time_ns += execution_time_ns;
            
            if (execution_time_ns < self.min_time_ns) {
                self.min_time_ns = execution_time_ns;
            }
            if (execution_time_ns > self.max_time_ns) {
                self.max_time_ns = execution_time_ns;
            }
            
            self.average_time_ns = @as(f64, @floatFromInt(self.total_time_ns)) / @as(f64, @floatFromInt(self.total_executions));
            
            if (failed) self.failure_count += 1;
            if (timed_out) self.timeout_count += 1;
        }
        
        pub fn get_success_rate(self: *const HookMetrics) f64 {
            if (self.total_executions == 0) return 1.0;
            const successful = self.total_executions - self.failure_count;
            return @as(f64, @floatFromInt(successful)) / @as(f64, @floatFromInt(self.total_executions));
        }
    };
    
    pub const ExtensionMetrics = struct {
        registration_time: i64,
        total_hook_executions: u64,
        total_execution_time_ns: u64,
        memory_allocations: u64,
        memory_usage_peak: usize,
        memory_usage_current: usize,
        error_count: u64,
        last_error_time: i64,
        
        pub fn init() ExtensionMetrics {
            return ExtensionMetrics{
                .registration_time = std.time.milliTimestamp(),
                .total_hook_executions = 0,
                .total_execution_time_ns = 0,
                .memory_allocations = 0,
                .memory_usage_peak = 0,
                .memory_usage_current = 0,
                .error_count = 0,
                .last_error_time = 0,
            };
        }
        
        pub fn record_hook_execution(self: *ExtensionMetrics, execution_time_ns: u64) void {
            self.total_hook_executions += 1;
            self.total_execution_time_ns += execution_time_ns;
        }
        
        pub fn record_memory_allocation(self: *ExtensionMetrics, size: usize) void {
            self.memory_allocations += 1;
            self.memory_usage_current += size;
            
            if (self.memory_usage_current > self.memory_usage_peak) {
                self.memory_usage_peak = self.memory_usage_current;
            }
        }
        
        pub fn record_memory_deallocation(self: *ExtensionMetrics, size: usize) void {
            if (self.memory_usage_current >= size) {
                self.memory_usage_current -= size;
            } else {
                self.memory_usage_current = 0;
            }
        }
        
        pub fn record_error(self: *ExtensionMetrics) void {
            self.error_count += 1;
            self.last_error_time = std.time.milliTimestamp();
        }
        
        pub fn get_average_execution_time(self: *const ExtensionMetrics) f64 {
            if (self.total_hook_executions == 0) return 0;
            return @as(f64, @floatFromInt(self.total_execution_time_ns)) / @as(f64, @floatFromInt(self.total_hook_executions));
        }
        
        pub fn get_error_rate(self: *const ExtensionMetrics) f64 {
            if (self.total_hook_executions == 0) return 0;
            return @as(f64, @floatFromInt(self.error_count)) / @as(f64, @floatFromInt(self.total_hook_executions));
        }
    };
    
    pub const GlobalMetrics = struct {
        total_extensions: u32,
        active_extensions: u32,
        total_hooks: u32,
        total_executions: u64,
        total_execution_time_ns: u64,
        overhead_percentage: f64,
        
        pub fn init() GlobalMetrics {
            return std.mem.zeroes(GlobalMetrics);
        }
        
        pub fn update_overhead(self: *GlobalMetrics, base_execution_time_ns: u64, extension_execution_time_ns: u64) void {
            if (base_execution_time_ns == 0) return;
            
            const overhead = @as(f64, @floatFromInt(extension_execution_time_ns)) / @as(f64, @floatFromInt(base_execution_time_ns));
            
            // Exponential moving average
            const alpha = 0.1;
            self.overhead_percentage = (1.0 - alpha) * self.overhead_percentage + alpha * overhead * 100.0;
        }
    };
    
    pub fn init(allocator: std.mem.Allocator) ExtensionPerformanceTracker {
        return ExtensionPerformanceTracker{
            .allocator = allocator,
            .hook_metrics = std.HashMap(HookManager.HookPoint, HookMetrics, HookPointContext, std.hash_map.default_max_load_percentage).init(allocator),
            .extension_metrics = std.HashMap(ExtensionManager.ExtensionId, ExtensionMetrics, ExtensionIdContext, std.hash_map.default_max_load_percentage).init(allocator),
            .global_metrics = GlobalMetrics.init(),
        };
    }
    
    pub fn deinit(self: *ExtensionPerformanceTracker) void {
        self.hook_metrics.deinit();
        self.extension_metrics.deinit();
    }
    
    pub fn record_hook_execution(self: *ExtensionPerformanceTracker, hook_point: HookManager.HookPoint, execution_time_ns: u64) void {
        // Update hook metrics
        var hook_metrics = self.hook_metrics.getPtr(hook_point) orelse blk: {
            const new_metrics = HookMetrics.init();
            self.hook_metrics.put(hook_point, new_metrics) catch return;
            break :blk self.hook_metrics.getPtr(hook_point).?;
        };
        
        hook_metrics.record_execution(execution_time_ns, false, false);
        
        // Update global metrics
        self.global_metrics.total_executions += 1;
        self.global_metrics.total_execution_time_ns += execution_time_ns;
    }
    
    pub fn record_extension_execution(self: *ExtensionPerformanceTracker, extension_id: ExtensionManager.ExtensionId, execution_time_ns: u64) void {
        var extension_metrics = self.extension_metrics.getPtr(extension_id) orelse blk: {
            const new_metrics = ExtensionMetrics.init();
            self.extension_metrics.put(extension_id, new_metrics) catch return;
            break :blk self.extension_metrics.getPtr(extension_id).?;
        };
        
        extension_metrics.record_hook_execution(execution_time_ns);
    }
    
    pub fn record_extension_error(self: *ExtensionPerformanceTracker, extension_id: ExtensionManager.ExtensionId) void {
        if (self.extension_metrics.getPtr(extension_id)) |metrics| {
            metrics.record_error();
        }
    }
    
    pub fn get_hook_performance_summary(self: *ExtensionPerformanceTracker) HookPerformanceSummary {
        var summary = HookPerformanceSummary{
            .total_hook_types = self.hook_metrics.count(),
            .fastest_hook = null,
            .slowest_hook = null,
            .most_executed_hook = null,
            .least_reliable_hook = null,
        };
        
        var fastest_time: f64 = std.math.inf(f64);
        var slowest_time: f64 = 0;
        var most_executions: u64 = 0;
        var worst_success_rate: f64 = 1.0;
        
        var iterator = self.hook_metrics.iterator();
        while (iterator.next()) |entry| {
            const hook_point = entry.key_ptr.*;
            const metrics = entry.value_ptr.*;
            
            if (metrics.average_time_ns < fastest_time) {
                fastest_time = metrics.average_time_ns;
                summary.fastest_hook = hook_point;
            }
            
            if (metrics.average_time_ns > slowest_time) {
                slowest_time = metrics.average_time_ns;
                summary.slowest_hook = hook_point;
            }
            
            if (metrics.total_executions > most_executions) {
                most_executions = metrics.total_executions;
                summary.most_executed_hook = hook_point;
            }
            
            const success_rate = metrics.get_success_rate();
            if (success_rate < worst_success_rate) {
                worst_success_rate = success_rate;
                summary.least_reliable_hook = hook_point;
            }
        }
        
        return summary;
    }
    
    pub fn print_performance_report(self: *ExtensionPerformanceTracker) void {
        std.log.info("=== EXTENSION PERFORMANCE REPORT ===");
        std.log.info("Total extensions: {}", .{self.global_metrics.total_extensions});
        std.log.info("Active extensions: {}", .{self.global_metrics.active_extensions});
        std.log.info("Total hook executions: {}", .{self.global_metrics.total_executions});
        std.log.info("Average overhead: {d:.2}%", .{self.global_metrics.overhead_percentage});
        
        std.log.info("\n=== HOOK PERFORMANCE ===");
        var hook_iterator = self.hook_metrics.iterator();
        while (hook_iterator.next()) |entry| {
            const hook_point = entry.key_ptr.*;
            const metrics = entry.value_ptr.*;
            
            std.log.info("Hook {}: {} executions, avg {d:.2}ns, success rate {d:.2}%", .{
                hook_point,
                metrics.total_executions,
                metrics.average_time_ns,
                metrics.get_success_rate() * 100.0,
            });
        }
        
        std.log.info("\n=== EXTENSION PERFORMANCE ===");
        var ext_iterator = self.extension_metrics.iterator();
        while (ext_iterator.next()) |entry| {
            const extension_id = entry.key_ptr.*;
            const metrics = entry.value_ptr.*;
            
            std.log.info("Extension {}: {} executions, avg {d:.2}ns, {d:.2}% error rate", .{
                extension_id,
                metrics.total_hook_executions,
                metrics.get_average_execution_time(),
                metrics.get_error_rate() * 100.0,
            });
        }
    }
    
    pub const HookPerformanceSummary = struct {
        total_hook_types: u32,
        fastest_hook: ?HookManager.HookPoint,
        slowest_hook: ?HookManager.HookPoint,
        most_executed_hook: ?HookManager.HookPoint,
        least_reliable_hook: ?HookManager.HookPoint,
    };
    
    pub const HookPointContext = HookManager.HookPointContext;
    pub const ExtensionIdContext = ExtensionRegistry.ExtensionIdContext;
};
```

### Task 2: Integrate with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const ExtensionManager = @import("extension_points/extension_manager.zig").ExtensionManager;
const HookManager = @import("extension_points/hook_manager.zig").HookManager;

pub const Vm = struct {
    // Existing fields...
    extension_manager: ?ExtensionManager,
    extensions_enabled: bool,
    
    pub fn enable_extensions(self: *Vm, config: ExtensionManager.ExtensionConfig) !void {
        self.extension_manager = try ExtensionManager.init(self.allocator, config);
        self.extensions_enabled = true;
    }
    
    pub fn disable_extensions(self: *Vm) void {
        if (self.extension_manager) |*manager| {
            manager.deinit();
            self.extension_manager = null;
        }
        self.extensions_enabled = false;
    }
    
    pub fn register_extension(self: *Vm, extension: ExtensionManager.Extension) !ExtensionManager.ExtensionId {
        if (self.extension_manager) |*manager| {
            return try manager.register_extension(extension);
        }
        return error.ExtensionsDisabled;
    }
    
    // Override opcode execution to include extension hooks
    pub fn execute_opcode_with_extensions(self: *Vm, opcode: u8) !void {
        if (self.extension_manager) |*manager| {
            // Pre-opcode hook
            var hook_context = HookManager.HookContext.init(&self.execution_context);
            hook_context = hook_context.with_opcode(opcode);
            hook_context = hook_context.with_stack(&self.stack);
            hook_context = hook_context.with_memory(&self.memory);
            hook_context = hook_context.with_state(&self.state);
            
            const pre_result = try manager.execute_hook(.PreOpcode, &hook_context);
            switch (pre_result) {
                .Continue => {},
                .Skip => return,
                .Abort => |err| return self.handle_hook_error(err),
                .Modify => |mod| try self.apply_hook_modification(mod),
                .Replace => |rep| return try self.execute_hook_replacement(rep),
            }
        }
        
        // Execute standard opcode
        try self.execute_standard_opcode(opcode);
        
        if (self.extension_manager) |*manager| {
            // Post-opcode hook
            var hook_context = HookManager.HookContext.init(&self.execution_context);
            hook_context = hook_context.with_opcode(opcode);
            hook_context = hook_context.with_stack(&self.stack);
            hook_context = hook_context.with_memory(&self.memory);
            hook_context = hook_context.with_state(&self.state);
            
            const post_result = try manager.execute_hook(.PostOpcode, &hook_context);
            switch (post_result) {
                .Continue => {},
                .Skip => {},
                .Abort => |err| return self.handle_hook_error(err),
                .Modify => |mod| try self.apply_hook_modification(mod),
                .Replace => {}, // Post-execution replacement not applicable
            }
        }
    }
    
    fn handle_hook_error(self: *Vm, err: HookManager.HookError) !void {
        _ = self;
        
        std.log.err("Extension hook error: {} - {s}", .{ err.error_code, err.message });
        
        if (!err.recoverable) {
            return error.ExtensionExecutionFailed;
        }
    }
    
    fn apply_hook_modification(self: *Vm, modification: HookManager.HookModification) !void {
        if (modification.modify_gas) |gas| {
            self.gas_remaining = gas;
        }
        
        if (modification.modify_stack) |stack_mod| {
            for (0..stack_mod.pop_count) |_| {
                _ = self.stack.pop() catch break;
            }
            
            for (stack_mod.push_values) |value| {
                self.stack.push(value) catch break;
            }
        }
        
        if (modification.modify_memory) |mem_mod| {
            self.memory.write(mem_mod.offset, mem_mod.data) catch {};
        }
        
        if (modification.modify_state) |state_mod| {
            self.state.set_storage(state_mod.account, state_mod.storage_key, state_mod.storage_value) catch {};
        }
    }
    
    fn execute_hook_replacement(self: *Vm, replacement: HookManager.HookReplacement) !void {
        _ = self;
        _ = replacement;
        
        // Execute replacement operation
        // Implementation depends on replacement type
    }
    
    pub fn get_extension_statistics(self: *Vm) ?ExtensionManager.ExtensionPerformanceTracker.HookPerformanceSummary {
        if (self.extension_manager) |*manager| {
            return manager.performance_tracker.get_hook_performance_summary();
        }
        return null;
    }
};
```

### Task 3: Example Extensions
File: `/src/evm/extension_points/example_extensions.zig`
```zig
const std = @import("std");
const ExtensionManager = @import("extension_manager.zig").ExtensionManager;
const HookManager = @import("hook_manager.zig").HookManager;
const CustomOpcode = @import("extension_manager.zig").CustomOpcode;

// Example: Debugging Extension
pub fn create_debug_extension() ExtensionManager.Extension {
    var extension = ExtensionManager.Extension.init("DebugExtension", "1.0.0");
    extension.description = "Provides debugging hooks and custom opcodes";
    extension.author = "Tevm Team";
    
    const hooks = [_]HookManager.Hook{
        HookManager.Hook.init(.PreOpcode, debug_pre_opcode_hook),
        HookManager.Hook.init(.PostOpcode, debug_post_opcode_hook),
    };
    
    extension.hooks = &hooks;
    return extension;
}

fn debug_pre_opcode_hook(context: *HookManager.HookContext) HookManager.HookResult {
    if (context.opcode) |opcode| {
        std.log.debug("Executing opcode: 0x{:02x}", .{opcode});
    }
    return HookManager.HookResult.continue_execution();
}

fn debug_post_opcode_hook(context: *HookManager.HookContext) HookManager.HookResult {
    if (context.stack) |stack| {
        std.log.debug("Stack size after opcode: {}", .{stack.size()});
    }
    return HookManager.HookResult.continue_execution();
}

// Example: Custom Math Extension
pub fn create_math_extension() ExtensionManager.Extension {
    var extension = ExtensionManager.Extension.init("MathExtension", "1.0.0");
    extension.description = "Provides additional mathematical operations";
    extension.author = "Tevm Team";
    
    const opcodes = [_]CustomOpcode{
        CustomOpcode.init(0xF0, "SQRT", sqrt_implementation),
        CustomOpcode.init(0xF1, "POW", pow_implementation),
    };
    
    extension.custom_opcodes = &opcodes;
    return extension;
}

fn sqrt_implementation(context: *ExecutionContext, inputs: []const u256) CustomOpcode.OpcodeError![]const u256 {
    if (inputs.len != 1) return CustomOpcode.OpcodeError.InvalidInput;
    
    const value = inputs[0];
    const result = integer_sqrt(value);
    
    var results = try context.allocator.alloc(u256, 1);
    results[0] = result;
    return results;
}

fn pow_implementation(context: *ExecutionContext, inputs: []const u256) CustomOpcode.OpcodeError![]const u256 {
    if (inputs.len != 2) return CustomOpcode.OpcodeError.InvalidInput;
    
    const base = inputs[0];
    const exponent = inputs[1];
    const result = modular_pow(base, exponent, std.math.maxInt(u256));
    
    var results = try context.allocator.alloc(u256, 1);
    results[0] = result;
    return results;
}

fn integer_sqrt(value: u256) u256 {
    if (value == 0) return 0;
    
    var x = value;
    var y = (value + 1) / 2;
    
    while (y < x) {
        x = y;
        y = (x + value / x) / 2;
    }
    
    return x;
}

fn modular_pow(base: u256, exponent: u256, modulus: u256) u256 {
    if (modulus == 1) return 0;
    
    var result: u256 = 1;
    var base_mod = base % modulus;
    var exp = exponent;
    
    while (exp > 0) {
        if (exp % 2 == 1) {
            result = (result * base_mod) % modulus;
        }
        exp = exp >> 1;
        base_mod = (base_mod * base_mod) % modulus;
    }
    
    return result;
}
```

## Testing Requirements

### Test File
Create `/test/evm/extension_points/extension_points_test.zig`

### Test Cases
```zig
test "extension manager initialization and configuration" {
    // Test manager creation with different configs
    // Test extension registration and validation
    // Test hook registration and execution
}

test "hook system functionality" {
    // Test hook point registration
    // Test hook execution order
    // Test hook result handling
}

test "custom opcode registration and execution" {
    // Test custom opcode registration
    // Test opcode availability checking
    // Test opcode execution with validation
}

test "custom precompile functionality" {
    // Test precompile registration
    // Test precompile gas calculation
    // Test precompile execution
}

test "plugin loading and management" {
    // Test plugin loading from file
    // Test plugin caching
    // Test hot reloading
}

test "extension performance tracking" {
    // Test performance metric collection
    // Test extension profiling
    // Test overhead measurement
}

test "security and sandboxing" {
    // Test extension validation
    // Test security level enforcement
    // Test isolation mechanisms
}

test "integration with VM execution" {
    // Test VM integration
    // Test extension hook execution during EVM operations
    // Test performance impact measurement
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/extension_points/extension_manager.zig` - Main extension management framework
- `/src/evm/extension_points/hook_manager.zig` - Hook system implementation
- `/src/evm/extension_points/extension_registry.zig` - Extension registration and management
- `/src/evm/extension_points/plugin_loader.zig` - Dynamic plugin loading system
- `/src/evm/extension_points/extension_performance_tracker.zig` - Performance monitoring
- `/src/evm/extension_points/example_extensions.zig` - Example extension implementations
- `/src/evm/vm.zig` - VM integration with extension points
- `/test/evm/extension_points/extension_points_test.zig` - Comprehensive tests

## Success Criteria

1. **Flexible Extension System**: Support multiple types of extensions with easy registration
2. **Comprehensive Hook Points**: Cover all major EVM execution points for extension integration
3. **Type Safety**: All extension interfaces are properly typed and validated
4. **Performance Efficiency**: <3% overhead for extension system when no extensions are active
5. **Security**: Proper validation and sandboxing of extensions based on security level
6. **Ease of Use**: Simple API for registering and managing extensions

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Security validation** - All extensions must be properly validated based on security level
3. **Performance monitoring** - Extension overhead must be tracked and minimized
4. **Type safety** - All extension interfaces must be properly typed
5. **Memory safety** - No memory leaks or corruption in extension management
6. **Backwards compatibility** - Extensions must not break existing EVM functionality

## References

- [Plugin Architecture](https://en.wikipedia.org/wiki/Plug-in_(computing)) - Software plugin design patterns
- [Hook System Design](https://en.wikipedia.org/wiki/Hooking) - Event hook implementation patterns
- [Dynamic Loading](https://en.wikipedia.org/wiki/Dynamic_loading) - Runtime code loading techniques
- [Sandboxing](https://en.wikipedia.org/wiki/Sandbox_(computer_security)) - Security isolation mechanisms
- [Extension Points](https://martinfowler.com/articles/extension-object.html) - Extensible software design