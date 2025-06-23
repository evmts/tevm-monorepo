# Implement Extension Points

You are implementing Extension Points for the Tevm EVM written in Zig. Your goal is to implement extension points for custom EVM functionality following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_extension_points` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_extension_points feat_implement_extension_points`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a comprehensive extension points system that allows configurable extension of EVM functionality through plugin-like components. This enables custom opcodes, precompiles, state hooks, execution hooks, and chain-specific behavior to be added without modifying core EVM code. The system should support compile-time and runtime extension registration with type safety and performance optimization.

## ELI5

Think of extension points like electrical outlets in your house - they're standardized connection points where you can plug in different devices without rewiring the entire house. This system creates "plugin outlets" throughout the EVM where developers can connect custom functionality (like new operations, custom logic, or chain-specific features) without touching the core code. Just like how you can plug a lamp, phone charger, or microwave into the same outlet, this system lets different chains plug in their unique features safely and efficiently.

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

#### 1. **Unit Tests** (`/test/evm/extension/extension_points_test.zig`)
```zig
// Test basic extension points functionality
test "extension_points basic functionality works correctly"
test "extension_points handles edge cases properly"
test "extension_points validates inputs appropriately"
test "extension_points produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "extension_points integrates with EVM properly"
test "extension_points maintains system compatibility"
test "extension_points works with existing components"
test "extension_points handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "extension_points meets performance requirements"
test "extension_points optimizes resource usage"
test "extension_points scales appropriately with load"
test "extension_points benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "extension_points meets specification requirements"
test "extension_points maintains EVM compatibility"
test "extension_points handles hardfork transitions"
test "extension_points cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "extension_points handles errors gracefully"
test "extension_points proper error propagation"
test "extension_points recovery from failure states"
test "extension_points validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "extension_points prevents security vulnerabilities"
test "extension_points handles malicious inputs safely"
test "extension_points maintains isolation boundaries"
test "extension_points validates security properties"
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
test "extension_points basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = extension_points.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const extension_points = struct {
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

- [Plugin Architecture](https://en.wikipedia.org/wiki/Plug-in_(computing)) - Software plugin design patterns
- [Hook System Design](https://en.wikipedia.org/wiki/Hooking) - Event hook implementation patterns
- [Dynamic Loading](https://en.wikipedia.org/wiki/Dynamic_loading) - Runtime code loading techniques
- [Sandboxing](https://en.wikipedia.org/wiki/Sandbox_(computer_security)) - Security isolation mechanisms
- [Extension Points](https://martinfowler.com/articles/extension-object.html) - Extensible software design

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2021 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <evmc/bytes.hpp>
#include <evmc/evmc.h>
#include <evmc/utils.h>
#include <intx/intx.hpp>
#include <memory>
#include <ostream>
#include <string_view>

namespace evmone
{
using evmc::bytes_view;
class ExecutionState;

class Tracer
{
    friend class VM;  // Has access the m_next_tracer to traverse the list forward.
    std::unique_ptr<Tracer> m_next_tracer;

public:
    virtual ~Tracer() = default;

    void notify_execution_start(  // NOLINT(misc-no-recursion)
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept
    {
        on_execution_start(rev, msg, code);
        if (m_next_tracer)
            m_next_tracer->notify_execution_start(rev, msg, code);
    }

    void notify_execution_end(const evmc_result& result) noexcept  // NOLINT(misc-no-recursion)
    {
        on_execution_end(result);
        if (m_next_tracer)
            m_next_tracer->notify_execution_end(result);
    }

    void notify_instruction_start(  // NOLINT(misc-no-recursion)
        uint32_t pc, intx::uint256* stack_top, int stack_height, int64_t gas,
        const ExecutionState& state) noexcept
    {
        on_instruction_start(pc, stack_top, stack_height, gas, state);
        if (m_next_tracer)
            m_next_tracer->notify_instruction_start(pc, stack_top, stack_height, gas, state);
    }

private:
    virtual void on_execution_start(
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept = 0;
    virtual void on_instruction_start(uint32_t pc, const intx::uint256* stack_top, int stack_height,
        int64_t gas, const ExecutionState& state) noexcept = 0;
    virtual void on_execution_end(const evmc_result& result) noexcept = 0;
};

/// Creates the "histogram" tracer which counts occurrences of individual opcodes during execution
/// and reports this data in CSV format.
///
/// @param out  Report output stream.
/// @return     Histogram tracer object.
EVMC_EXPORT std::unique_ptr<Tracer> create_histogram_tracer(std::ostream& out);

EVMC_EXPORT std::unique_ptr<Tracer> create_instruction_tracer(std::ostream& out);

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
using GasCostTable = std::array<std::array<int16_t, 256>, EVMC_MAX_REVISION + 1>;

/// The EVM revision specific table of EVM instructions gas costs. For instructions undefined
/// in given EVM revision, the value is instr::undefined.
constexpr inline GasCostTable gas_costs = []() noexcept {
    GasCostTable table{};
    // ... (initialization of gas costs for all opcodes and revisions)
    table[EVMC_FRONTIER][OP_ADD] = 3;
    table[EVMC_FRONTIER][OP_MUL] = 5;
    // ...
    return table;
}();


/// The EVM instruction traits.
struct Traits
{
    /// The instruction name;
    const char* name = nullptr;

    /// Size of the immediate argument in bytes.
    uint8_t immediate_size = 0;

    /// Whether the instruction terminates execution.
    /// This is false for undefined instructions but this can be changed if desired.
    bool is_terminating = false;

    /// The number of stack items the instruction accesses during execution.
    uint8_t stack_height_required = 0;

    /// The stack height change caused by the instruction execution. Can be negative.
    int8_t stack_height_change = 0;

    /// The EVM revision in which the instruction has been defined. For instructions available in
    /// every EVM revision the value is ::EVMC_FRONTIER. For undefined instructions the value is not
    /// available.
    std::optional<evmc_revision> since;

    /// The EVM revision in which the instruction has become valid in EOF. For instructions invalid
    /// in EOF the value is not available.
    std::optional<evmc_revision> eof_since;
};

/// The global, EVM revision independent, table of traits of all known EVM instructions.
constexpr inline std::array<Traits, 256> traits = []() noexcept {
    std::array<Traits, 256> table{};

    table[OP_STOP] = {"STOP", 0, true, 0, 0, EVMC_FRONTIER, REV_EOF1};
    table[OP_ADD] = {"ADD", 0, false, 2, -1, EVMC_FRONTIER, REV_EOF1};
    table[OP_MUL] = {"MUL", 0, false, 2, -1, EVMC_FRONTIER, REV_EOF1};
    // ... (initialization of traits for all opcodes)
    return table;
}();

}  // namespace evmone::instr
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/vm.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2021 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "execution_state.hpp"
#include "tracing.hpp"
#include <evmc/evmc.h>
#include <evmc/utils.h>
#include <vector>

#if defined(_MSC_VER) && !defined(__clang__)
#define EVMONE_CGOTO_SUPPORTED 0
#else
#define EVMONE_CGOTO_SUPPORTED 1
#endif

namespace evmone
{
/// The evmone EVMC instance.
class VM : public evmc_vm
{
public:
    bool cgoto = EVMONE_CGOTO_SUPPORTED;
    bool validate_eof = false;

private:
    std::vector<ExecutionState> m_execution_states;
    std::unique_ptr<Tracer> m_first_tracer;

public:
    VM() noexcept;

    [[nodiscard]] ExecutionState& get_execution_state(size_t depth) noexcept;

    void add_tracer(std::unique_ptr<Tracer> tracer) noexcept
    {
        // Find the first empty unique_ptr and assign the new tracer to it.
        auto* end = &m_first_tracer;
        while (*end)
            end = &(*end)->m_next_tracer;
        *end = std::move(tracer);
    }

    void remove_tracers() noexcept { m_first_tracer.reset(); }

    [[nodiscard]] Tracer* get_tracer() const noexcept { return m_first_tracer.get(); }
};
}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_execution.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2020 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "baseline.hpp"
#include "baseline_instruction_table.hpp"
#include "eof.hpp"
#include "execution_state.hpp"
#include "instructions.hpp"
#include "vm.hpp"
#include <memory>
// ...

namespace evmone::baseline
{
namespace
{
// ... (check_requirements and invoke helpers)

template <bool TracingEnabled>
int64_t dispatch(const CostTable& cost_table, ExecutionState& state, int64_t gas,
    const uint8_t* code, Tracer* tracer = nullptr) noexcept
{
    const auto stack_bottom = state.stack_space.bottom();

    // Code iterator and stack top pointer for interpreter loop.
    Position position{code, stack_bottom};

    while (true)  // Guaranteed to terminate because padded code ends with STOP.
    {
        if constexpr (TracingEnabled)
        {
            const auto offset = static_cast<uint32_t>(position.code_it - code);
            const auto stack_height = static_cast<int>(position.stack_end - stack_bottom);
            if (offset < state.original_code.size())  // Skip STOP from code padding.
            {
                // This is the hook point for PreOpcode execution.
                tracer->notify_instruction_start(
                    offset, position.stack_end - 1, stack_height, gas, state);
            }
        }

        const auto op = *position.code_it;
        switch (op)
        {
#define ON_OPCODE(OPCODE)                                                                     \
    case OPCODE:                                                                              \
        ASM_COMMENT(OPCODE);                                                                  \
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
        break;

            MAP_OPCODES
#undef ON_OPCODE
        // A PostOpcode hook would go here, before the next iteration.

        default:
            state.status = EVMC_UNDEFINED_INSTRUCTION;
            return gas;
        }
    }
    intx::unreachable();
}
// ... (rest of the file)
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/precompiles.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2022 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "precompiles.hpp"
// ... (includes for precompile implementations)

namespace evmone::state
{
// ... (gas cost helpers)

struct PrecompileTraits
{
    decltype(identity_analyze)* analyze = nullptr;
    decltype(identity_execute)* execute = nullptr;
};

// This array acts as a registry for precompiles, mapping an ID to its implementation.
// A similar approach can be used for custom precompiles.
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
    // ... (other precompiles)
}};

// ...

evmc::Result call_precompile(evmc_revision rev, const evmc_message& msg) noexcept
{
    assert(msg.gas >= 0);

    const auto id = msg.code_address.bytes[19];
    const auto [analyze, execute] = traits[id]; // Dispatch to the correct precompile

    const bytes_view input{msg.input_data, msg.input_size};
    const auto [gas_cost, max_output_size] = analyze(input, rev);
    const auto gas_left = msg.gas - gas_cost;
    if (gas_left < 0)
        return evmc::Result{EVMC_OUT_OF_GAS};

    const auto output_data = new (std::nothrow) uint8_t[max_output_size];
    const auto [status_code, output_size] =
        execute(msg.input_data, msg.input_size, output_data, max_output_size);
    
    // ... (result handling)
}
}  // namespace evmone::state
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/unittests/main.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "vm_loader.hpp"
#include <evmc/loader.h>
// ... (includes)

/// The loaded EVMC module.
static evmc::VM evmc_module;

// ...

int main(int argc, char* argv[])
{
    // ... (CLI parsing)
    
    const auto& evmc_config = cli.arguments[0];
    evmc_loader_error_code ec;

    // This shows how a VM implementation can be loaded from a dynamic library.
    // A similar mechanism can be used to load extension plugins.
    evmc_module = evmc::VM{evmc_load_and_configure(evmc_config.c_str(), &ec)};

    if (ec != EVMC_LOADER_SUCCESS)
    {
        if (const auto error = evmc_last_error_msg())
            std::cerr << "EVMC loading error: " << error << "\n";
        else
            std::cerr << "EVMC loading error " << ec << "\n";
        return static_cast<int>(ec);
    }

    // ... (rest of main)
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <evmc/evmc.hpp>
// ... (other includes)

namespace evmone
{
// ... (forward declarations)

/// Generic execution state for generic instructions implementations.
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
    
    // ...

    /// Pointer to code analysis.
    union
    {
        const baseline::CodeAnalysis* baseline = nullptr;
        const advanced::AdvancedCodeAnalysis* advanced;
    } analysis{};

    std::vector<const uint8_t*> call_stack;

    /// Stack space allocation.
    StackSpace stack_space;

    // ... (constructors and methods)
};
}  // namespace evmone
```
</file>
</evmone>



## REVM Context

An analysis of the `revm` codebase reveals several architectural patterns that are highly relevant to implementing a configurable extension system. The most pertinent concepts are the `Inspector` trait for hooks, the `Precompiles` registry for custom functions, and the `InstructionTable` for opcode dispatch.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/inspector/src/inspector.rs">
```rust
//! Inspector trait definition.

use crate::interpreter_types::{
    CallInputs, CallOutcome, CreateInputs, CreateOutcome, EOFCreateInputs, Interpreter,
    InterpreterTypes,
};
use auto_impl::auto_impl;
use context::ContextTr;
use primitives::{Address, Log, U256};

/// EVM hooks into execution.
///
/// This trait is used to enabled tracing of the EVM execution.
///
/// Object that is implemented this trait is used in `InspectorHandler` to trace the EVM execution.
/// And API that allow calling the inspector can be found in [`crate::InspectEvm`] and [`crate::InspectCommitEvm`].
#[auto_impl(&mut, Box)]
pub trait Inspector<CTX, INTR: InterpreterTypes = EthInterpreter> {
    /// Called before the interpreter is initialized.
    ///
    /// If `interp.instruction_result` is set to anything other than [`interpreter::InstructionResult::Continue`]
    /// then the execution of the interpreter is skipped.
    #[inline]
    fn initialize_interp(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        let _ = interp;
        let _ = context;
    }

    /// Called on each step of the interpreter.
    ///
    /// Information about the current execution, including the memory, stack and more is available
    /// on `interp` (see [Interpreter]).
    ///
    /// # Example
    ///
    /// To get the current opcode, use `interp.current_opcode()`.
    #[inline]
    fn step(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        let _ = interp;
        let _ = context;
    }

    /// Called after `step` when the instruction has been executed.
    ///
    /// Setting `interp.instruction_result` to anything other than [`interpreter::InstructionResult::Continue`]
    /// alters the execution of the interpreter.
    #[inline]
    fn step_end(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        let _ = interp;
        let _ = context;
    }

    /// Called when a log is emitted.
    #[inline]
    fn log(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX, log: Log) {
        let _ = interp;
        let _ = context;
        let _ = log;
    }

    /// Called whenever a call to a contract is about to start.
    ///
    /// InstructionResulting anything other than [`interpreter::InstructionResult::Continue`] overrides the result of the call.
    #[inline]
    fn call(&mut self, context: &mut CTX, inputs: &mut CallInputs) -> Option<CallOutcome> {
        let _ = context;
        let _ = inputs;
        None
    }

    /// Called when a call to a contract has concluded.
    ///
    /// The returned [CallOutcome] is used as the result of the call.
    ///
    /// This allows the inspector to modify the given `result` before returning it.
    #[inline]
    fn call_end(&mut self, context: &mut CTX, inputs: &CallInputs, outcome: &mut CallOutcome) {
        let _ = context;
        let _ = inputs;
        let _ = outcome;
    }

    /// Called when a contract is about to be created.
    ///
    /// If this returns `Some` then the [CreateOutcome] is used to override the result of the creation.
    ///
    /// If this returns `None` then the creation proceeds as normal.
    #[inline]
    fn create(&mut self, context: &mut CTX, inputs: &mut CreateInputs) -> Option<CreateOutcome> {
        let _ = context;
        let _ = inputs;
        None
    }

    /// Called when a contract has been created.
    ///
    /// InstructionResulting anything other than the values passed to this function (`(ret, remaining_gas,
    /// address, out)`) will alter the result of the create.
    #[inline]
    fn create_end(
        &mut self,
        context: &mut CTX,
        inputs: &CreateInputs,
        outcome: &mut CreateOutcome,
    ) {
        let _ = context;
        let _ = inputs;
        let _ = outcome;
    }

    /// Called when a contract has been self-destructed with funds transferred to target.
    #[inline]
    fn selfdestruct(&mut self, contract: Address, target: Address, value: U256) {
        let _ = contract;
        let _ = target;
        let _ = value;
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/inspector/src/handler.rs">
```rust
//! Trait that extends [`Handler`] with inspection functionality.

/// Run Interpreter loop with inspection support.
///
/// This function is used to inspect the Interpreter loop.
/// It will call [`Inspector::step`] and [`Inspector::step_end`] after each instruction.
/// And [`Inspector::log`],[`Inspector::selfdestruct`] for each log and selfdestruct instruction.
pub fn inspect_instructions<CTX, IT>(
    context: &mut CTX,
    interpreter: &mut Interpreter<IT>,
    mut inspector: impl Inspector<CTX, IT>,
    instructions: &InstructionTable<IT, CTX>,
) -> InterpreterAction
where
    CTX: ContextTr<Journal: JournalExt> + Host,
    IT: InterpreterTypes,
{
    interpreter.reset_control();

    let mut log_num = context.journal().logs().len();
    // Main loop
    while interpreter.control.instruction_result().is_continue() {
        // Get current opcode.
        let opcode = interpreter.bytecode.opcode();

        // Call Inspector step.
        inspector.step(interpreter, context);
        if interpreter.control.instruction_result() != InstructionResult::Continue {
            break;
        }

        // SAFETY: In analysis we are doing padding of bytecode so that we are sure that last
        // byte instruction is STOP so we are safe to just increment program_counter bcs on last instruction
        // it will do noop and just stop execution of this contract
        interpreter.bytecode.relative_jump(1);

        // Execute instruction.
        let instruction_context = InstructionContext {
            interpreter,
            host: context,
        };
        instructions[opcode as usize](instruction_context);

        // check if new log is added
        let new_log = context.journal().logs().len();
        if log_num < new_log {
            // as there is a change in log number this means new log is added
            let log = context.journal().logs().last().unwrap().clone();
            inspector.log(interpreter, context, log);
            log_num = new_log;
        }

        // Call step_end.
        inspector.step_end(interpreter, context);
    }
    // ... selfdestruct handling ...
    interpreter.take_next_action()
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/lib.rs">
```rust
//! # revm-precompile
//!
//! Implementations of EVM precompiled contracts.

// ... imports ...

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

    // ... other hardforks ...

    /// Is the given address a precompile.
    #[inline]
    pub fn contains(&self, address: &Address) -> bool {
        self.inner.contains_key(address)
    }

    /// Returns the precompile for the given address.
    #[inline]
    pub fn get(&self, address: &Address) -> Option<&PrecompileFn> {
        self.inner.get(address)
    }
    
    /// Extends the precompiles with the given precompiles.
    ///
    /// Other precompiles with overwrite existing precompiles.
    #[inline]
    pub fn extend(&mut self, other: impl IntoIterator<Item = PrecompileWithAddress>) {
        let items: Vec<PrecompileWithAddress> = other.into_iter().collect::<Vec<_>>();
        self.addresses.extend(items.iter().map(|p| *p.address()));
        self.inner.extend(items.into_iter().map(|p| (p.0, p.1)));
    }
}

/// Precompile with address and function.
#[derive(Clone, Debug)]
pub struct PrecompileWithAddress(pub Address, pub PrecompileFn);

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
<file path="https://github.com/bluealloy/revm/blob/main/crates/precompile/src/interface.rs">
```rust
//! Interface for the precompiles. It contains the precompile result type,
//! the precompile output type, and the precompile error type.
use core::fmt;
use primitives::Bytes;
use std::string::String;

/// A precompile operation result type
///
/// Returns either `Ok((gas_used, return_bytes))` or `Err(error)`.
pub type PrecompileResult = Result<PrecompileOutput, PrecompileError>;

/// Precompile execution output
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct PrecompileOutput {
    /// Gas used by the precompile
    pub gas_used: u64,
    /// Output bytes
    pub bytes: Bytes,
}

impl PrecompileOutput {
    /// Returns new precompile output with the given gas used and output bytes.
    pub fn new(gas_used: u64, bytes: Bytes) -> Self {
        Self { gas_used, bytes }
    }
}

/// Precompile function type. Takes input and gas limit and returns precompile result.
pub type PrecompileFn = fn(&[u8], u64) -> PrecompileResult;

/// Precompile error type.
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub enum PrecompileError {
    /// out of gas is the main error. Others are here just for completeness
    OutOfGas,
    // ... other errors
    Fatal(String),
    /// Catch-all variant for other errors
    Other(String),
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions.rs">
```rust
//! EVM opcode implementations.

// ... imports ...

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
    table[DIV as usize] = arithmetic::div;
    // ...
    table[PUSH1 as usize] = stack::push::<1, _, _>;
    table[PUSH2 as usize] = stack::push::<2, _, _>;
    // ...
    table[PUSH32 as usize] = stack::push::<32, _, _>;
    // ...
    table[DUP1 as usize] = stack::dup::<1, _, _>;
    // ...
    table[SWAP1 as usize] = stack::swap::<1, _, _>;
    // ...
    table[LOG0 as usize] = host::log::<0, _>;
    // ...
    table[CREATE as usize] = contract::create::<_, false, _>;
    table[CALL as usize] = contract::call;
    // ...
    table[SELFDESTRUCT as usize] = host::selfdestruct;
    table
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/host.rs">
```rust
//! Host trait with all methods that are needed by the Interpreter.

/// Host trait with all methods that are needed by the Interpreter.
///
/// This trait is implemented for all types that have `ContextTr` trait.
///
/// There are few groups of functions which are Block, Transaction, Config, Database and Journal functions.
pub trait Host {
    /* Block */
    fn basefee(&self) -> U256;
    fn blob_gasprice(&self) -> U256;
    // ... other block environment methods

    /* Transaction */
    fn effective_gas_price(&self) -> U256;
    fn caller(&self) -> Address;
    // ... other transaction environment methods

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
    fn tstore(&mut self, address: Address, key: StorageKey, value: StorageValue);
    fn tload(&mut self, address: Address, key: StorageKey) -> StorageValue;
    fn balance(&mut self, address: Address) -> Option<StateLoad<U256>>;
    fn load_account_delegated(&mut self, address: Address) -> Option<StateLoad<AccountLoad>>;
    fn load_account_code(&mut self, address: Address) -> Option<StateLoad<Bytes>>;
    fn load_account_code_hash(&mut self, address: Address) -> Option<StateLoad<B256>>;
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas.rs">
```rust
//! EVM gas calculation utilities.

/// Represents the state of gas during execution.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Gas {
    /// The initial gas limit. This is constant throughout execution.
    limit: u64,
    /// The remaining gas.
    remaining: u64,
    /// Refunded gas. This is used only at the end of execution.
    refunded: i64,
    /// Memoisation of values for memory expansion cost.
    memory: MemoryGas,
}

impl Gas {
    /// ... methods for managing gas ...

    /// Returns the amount of gas remaining.
    #[inline]
    pub const fn remaining(&self) -> u64 {
        self.remaining
    }

    /// Erases a gas cost from the totals.
    #[inline]
    pub fn erase_cost(&mut self, returned: u64) {
        self.remaining += returned;
    }

    /// Records a refund value.
    ///
    /// `refund` can be negative but `self.refunded` should always be positive
    /// at the end of transact.
    #[inline]
    pub fn record_refund(&mut self, refund: i64) {
        self.refunded += refund;
    }

    /// Records an explicit cost.
    ///
    /// Returns `false` if the gas limit is exceeded.
    #[inline]
    #[must_use = "prefer using `gas!` instead to return an out-of-gas error on failure"]
    pub fn record_cost(&mut self, cost: u64) -> bool {
        if let Some(new_remaining) = self.remaining.checked_sub(cost) {
            self.remaining = new_remaining;
            return true;
        }
        false
    }
}
```
</file>
</revm>



## EXECUTION-SPECS Context

An extension system requires touching many parts of the EVM. The following snippets from `execution-specs` show how different components like the main execution loop, opcode implementations, state management, and precompiles are structured. This will be crucial for understanding where to place hooks and how to integrate custom functionality.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/paris/vm/interpreter.py">
This file contains the main execution loop of the EVM. The `execute_code` function is the core of the interpreter. This is the ideal place to add `PreOpcode` and `PostOpcode` hooks, right before and after the `op_implementation[op](evm)` call. The exception handling logic here is also relevant for the `Abort` functionality in the proposed `HookResult`.

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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/paris/vm/instructions/__init__.py">
This file shows how opcodes are mapped to their implementations. A custom opcode system can be built by modifying this mapping at runtime, which is analogous to the `custom_opcodes` field in the proposed `Extension` struct.

```python
op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    Ops.MUL: arithmetic_instructions.mul,
    Ops.SUB: arithmetic_instructions.sub,
    # ... more opcodes
    Ops.CREATE: system_instructions.create,
    Ops.RETURN: system_instructions.return_,
    Ops.CALL: system_instructions.call,
    Ops.CALLCODE: system_instructions.callcode,
    Ops.DELEGATECALL: system_instructions.delegatecall,
    Ops.SELFDESTRUCT: system_instructions.selfdestruct,
    Ops.STATICCALL: system_instructions.staticcall,
    Ops.REVERT: system_instructions.revert,
    Ops.CREATE2: system_instructions.create2,
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/paris/vm/precompiled_contracts/mapping.py">
This file demonstrates how precompiled contracts are mapped to their addresses. A custom precompile system would extend this mapping. This is directly relevant to the `custom_precompiles` field in the prompt's `Extension` struct.

```python
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
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/paris/vm/instructions/system.py">
The `CALL` and `CREATE` opcode implementations are complex and involve multiple steps where hooks could be inserted (`PreCall`, `PostCall`, `PreCreate`, `PostCreate`). The `generic_call` and `generic_create` functions show the core logic for these operations.

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
    # ...
    # Code for handling depth limit, getting code, creating child message
    # ...
    child_message = Message(
        # ...
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

    # ...

def create(evm: Evm) -> None:
    # ... (stack operations and gas calculation)
    contract_address = compute_contract_address(
        evm.message.current_target,
        get_account(
            evm.message.block_env.state, evm.message.current_target
        ).nonce,
    )

    generic_create(
        evm, endowment, contract_address, memory_start_position, memory_size
    )
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/paris/state.py">
The state transition functions are where hooks like `PreStateChange` and `PostStateChange` would be placed. The `begin_transaction` and `rollback_transaction` functions are particularly relevant, as they show how state changes can be reverted, a key feature for robust extensions.

```python
def begin_transaction(state: State) -> None:
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

def commit_transaction(state: State) -> None:
    """
    Commit a state transaction.
    ...
    """
    state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

def rollback_transaction(state: State) -> None:
    """
    Rollback a state transaction...
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

def set_storage(
    state: State, address: Address, key: Bytes32, value: U256
) -> None:
    """
    Set a value at a storage key on an account.
    """
    # ... implementation details
    trie_set(trie, key, value)
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/trace.py">
The tracing module provides a model for how to instrument the EVM to collect data at various points. This is directly analogous to the proposed `ExtensionPerformanceTracker`. The `evm_trace` function is called from various points in the interpreter, and `TraceEvent` types show what information is available at each point.

```python
@dataclass
class OpStart:
    """
    Trace event that is triggered before executing an opcode.
    """
    op: enum.Enum
    # ...

@dataclass
class OpEnd:
    """
    Trace event that is triggered after executing an opcode.
    """

@dataclass
class GasAndRefund:
    """
    Trace event that is triggered when gas is deducted.
    """
    gas_cost: int
    # ...

TraceEvent = Union[
    # ...
    OpStart,
    OpEnd,
    GasAndRefund,
]

# ...

_evm_trace: EvmTracer = discard_evm_trace

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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/paris/vm/__init__.py">
The `Evm` dataclass defines the state available during execution. This is a good reference for what should be included in the `HookContext` struct, as it contains the stack, memory, program counter, and message-specific information like caller, target, and value.

```python
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
</execution-specs>
## Prompt Corrections
The prompt's requirements are extensive and well-defined. The proposed structs like `ExtensionManager`, `HookManager`, `CustomOpcode`, etc., provide a solid architectural foundation. No corrections are necessary, but here are some suggestions based on the `execution-specs` review:

1.  **HookContext Richness**: The `HookContext` is good. Consider ensuring it has access to the full `ExecutionContext` (equivalent to `Evm` in the specs), which includes not just `stack` and `memory` but also `pc`, `gas_left`, and message-specific data (`caller`, `value`, etc.) for maximum flexibility in hook implementations. The current prompt does this well by including `*ExecutionContext`.
2.  **State Revertibility**: The `execution-specs` use a snapshotting mechanism (`begin_transaction`, `rollback_transaction`) to revert state changes. When implementing hooks that can modify state (e.g., via `HookResult.Modify`), integrating with a similar journaling or snapshot system will be critical to ensure that if a later part of the execution fails, the state changes made by the hook can also be correctly reverted. The current prompt does not explicitly mention this, but it's a critical detail for correctness.
3.  **Dynamic Gas in Opcodes**: The prompt specifies dynamic gas calculation for custom opcodes. The `EXP` opcode implementation in `ethereum/constantinople/vm/instructions/arithmetic.py` is a good reference. It calculates a dynamic gas cost based on the exponent's size and charges it before proceeding with the main operation. This pattern should be adopted for custom opcodes with dynamic gas costs.

---

An extension system requires hooking into various parts of the EVM's execution flow. The Python implementation in `execution-specs` provides clear examples of where these hooks can be placed.

The most relevant concepts are:
1.  **The Main Execution Loop**: `interpreter.py` contains the `execute_code` function, which is the heart of the EVM. This is where `PreOpcode` and `PostOpcode` hooks would be placed.
2.  **State Management**: `state.py` defines functions for modifying state (`set_storage`, `set_account`, etc.) and managing state transactions (`begin_transaction`, `commit_transaction`, `rollback_transaction`). These are the ideal locations for state-related and transaction-level hooks.
3.  **Custom Opcodes & Precompiles**: The `instructions/__init__.py` and `precompiled_contracts/mapping.py` files show how opcodes and precompiles are dispatched via dictionaries. This pattern is directly applicable to registering custom opcodes and precompiles.
4.  **Call/Create Operations**: `system.py` implements the `CALL` and `CREATE` families of opcodes, showing the logic for entering new execution frames. This is relevant for `PreCall`/`PostCall` and `PreCreate`/`PostCreate` hooks.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
# execution-specs/src/ethereum/london/vm/interpreter.py

def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.
    """
    # ...
    # This is the entry point for a call or create operation.
    # PRE-CALL or PRE-CREATE hooks would go here.
    # ...
    if message.target == Bytes0(b""):
        # ...
        evm = process_create_message(message)
    else:
        evm = process_message(message)
    # ...
    # POST-CALL or POST-CREATE hooks would go here, with access to the `evm` result.
    # ...
    return MessageCallOutput(...)


def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
    """
    # ...
    evm = Evm(...)
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            # PRE-PRECOMPILE hook could go here
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            # POST-PRECOMPILE hook could go here
            return evm

        # This is the main execution loop.
        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            # PRE-OPCODE hook would go here, with access to `evm` and `op`.

            op_implementation[op](evm)

            # POST-OPCODE hook would go here, with access to `evm` and `op`.

    except ExceptionalHalt as error:
        # HOOK for exceptional halt could go here.
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        # HOOK for REVERT could go here.
        evm.error = error
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/state.py">
```python
# execution-specs/src/ethereum/london/state.py

def begin_transaction(state: State) -> None:
    """
    Start a state transaction.
    # A PRE-TRANSACTION hook could be placed here.
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
    # A POST-TRANSACTION hook (on success) could be placed here.
    """
    state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()


def rollback_transaction(state: State) -> None:
    """
    Rollback a state transaction...
    # A POST-TRANSACTION hook (on failure/revert) could be placed here.
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

def set_storage(
    state: State, address: Address, key: Bytes32, value: U256
) -> None:
    """
    Set a value at a storage key on an account.
    # PRE-STATE-CHANGE and POST-STATE-CHANGE hooks for SSTORE would wrap this call.
    """
    assert trie_get(state._main_trie, address) is not None

    trie = state._storage_tries.get(address)
    if trie is None:
        trie = Trie(secured=True, default=U256(0))
        state._storage_tries[address] = trie
    trie_set(trie, key, value)
    if trie._data == {}:
        del state._storage_tries[address]
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/__init__.py">
```python
# execution-specs/src/ethereum/london/vm/instructions/__init__.py

class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """
    # ... (all opcodes defined here) ...

# This dictionary directly maps opcodes to their implementation functions.
# A similar map can be used to register and dispatch custom opcodes.
op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    # ...
    Ops.CREATE: system_instructions.create,
    Ops.CALL: system_instructions.call,
    # ... (all opcodes mapped here) ...
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/precompiled_contracts/mapping.py">
```python
# execution-specs/src/ethereum/london/vm/precompiled_contracts/mapping.py
from ...fork_types import Address
from . import (
    ALT_BN128_ADD_ADDRESS,
    ECRECOVER_ADDRESS,
    IDENTITY_ADDRESS,
    MODEXP_ADDRESS,
    RIPEMD160_ADDRESS,
    SHA256_ADDRESS,
)
from .alt_bn128 import alt_bn128_add, alt_bn128_mul, alt_bn128_pairing_check
from .ecrecover import ecrecover
from .identity import identity
from .modexp import modexp
from .ripemd160 import ripemd160
from .sha256 import sha256

# This dictionary maps precompile addresses to their implementation functions.
# A similar map can be used to register and dispatch custom precompiles.
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
}
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/precompiled_contracts/identity.py">
```python
# execution-specs/src/ethereum/london/vm/precompiled_contracts/identity.py

# This file is a good example of a simple precompile implementation.
# It shows how gas is charged and how input is processed to produce output.

from ethereum_types.numeric import Uint
from ethereum.utils.numeric import ceil32
from ...vm import Evm
from ...vm.gas import GAS_IDENTITY, GAS_IDENTITY_WORD, charge_gas

def identity(evm: Evm) -> None:
    """
    Writes the message data to output.
    """
    data = evm.message.data

    # GAS
    word_count = ceil32(Uint(len(data))) // Uint(32)
    charge_gas(evm, GAS_IDENTITY + GAS_IDENTITY_WORD * word_count)

    # OPERATION
    evm.output = data
```
</file>
</execution-specs>

## Prompt Corrections
The original prompt provides a robust and well-designed architecture for an extension system. The following points are not errors, but rather notes on how the `execution-specs` relate to the proposed design, which may be helpful during implementation:

1.  **Hook Context**: The prompt's `HookContext` struct is very detailed. In the `execution-specs`, the equivalent context is the `Evm` object itself, which is passed to every instruction and precompile. The `Evm` dataclass (in `vm/__init__.py`) contains the stack, memory, gas, and a `Message` object, which in turn holds all contextual information like `caller`, `target`, `value`, etc. This confirms that passing a rich context object into hooks is a sound design that mirrors the reference implementation.

2.  **Hook Results**: The prompt's `HookResult` union is powerful, allowing hooks to modify or replace execution. In the `execution-specs`, control flow changes (like `STOP`, `REVERT`, `INVALID`) are handled via Python exceptions (`ExceptionalHalt`, `Revert`). The main execution loop in `interpreter.py` wraps the `op_implementation[op](evm)` call in a `try...except` block to catch these. This is where the logic for your `HookResult.Abort`, `.Skip`, and `.Replace` would be implemented—by handling the hook's return value within the execution loop before or after dispatching the opcode.

3.  **Plugin Loading**: The `execution-specs` do not contain an equivalent for the `PluginLoader` since it's a monolithic Python application. The proposed design for loading dynamic libraries (`.so`, `.dll`) is a feature that must be designed specifically for the target environment (Zig) and does not have a direct parallel in the specs.



## GO-ETHEREUM Context

An extensible system is crucial for a modern EVM implementation to support custom features, sidechains, and Layer 2 solutions without forking the core codebase. Geth's architecture, particularly its tracing and metrics systems, provides excellent patterns for building such a system.

The `tracing.Hooks` in `core/tracing/hooks.go` serves as a direct inspiration for your `HookManager`. It defines a set of function pointers that can be implemented by a "tracer" (or in your case, an "extension") to listen for specific VM events like opcode execution, call frame entry/exit, and state changes. Integrating this into your VM's main execution loop, similar to how Geth does in `core/vm/evm.go`, will be the core of your extension system.

For custom precompiles, Geth's `vm.PrecompiledContract` interface in `core/vm/contracts.go` is the template to follow. It defines the necessary methods for gas calculation and execution, which maps directly to your `CustomPrecompile` struct.

Finally, the `metrics` package in Geth offers a robust framework for performance tracking. The `Timer`, `Meter`, and `Registry` types are perfect references for implementing your `ExtensionPerformanceTracker`, allowing you to measure execution counts, rates, and timings with high precision and low overhead.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/hooks.go">
```go
// Copyright 2024 The go-ethereum Authors
// This file is part of the go-ethereum library.
// ... (license header)
package tracing

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/params"
	"github.com/holiman/uint256"
)

// OpContext provides the context at which the opcode is being
// executed in, including the memory, stack and various contract-level information.
type OpContext interface {
	MemoryData() []byte
	StackData() []uint256.Int
	Caller() common.Address
	Address() common.Address
	CallValue() *uint256.Int
	CallInput() []byte
	ContractCode() []byte
}

// StateDB gives tracers access to the whole state.
type StateDB interface {
	GetBalance(common.Address) *uint256.Int
	GetNonce(common.Address) uint64
	GetCode(common.Address) []byte
	GetCodeHash(common.Address) common.Hash
	GetState(common.Address, common.Hash) common.Hash
	GetTransientState(common.Address, common.Hash) common.Hash
	Exist(common.Address) bool
	GetRefund() uint64
}

// VMContext provides the context for the EVM execution.
type VMContext struct {
	Coinbase    common.Address
	BlockNumber *big.Int
	Time        uint64
	Random      *common.Hash
	BaseFee     *big.Int
	StateDB     StateDB
}

type (
	/*
		- VM events -
	*/

	// TxStartHook is called before the execution of a transaction starts.
	// Call simulations don't come with a valid signature. `from` field
	// to be used for address of the caller.
	TxStartHook = func(vm *VMContext, tx *types.Transaction, from common.Address)

	// TxEndHook is called after the execution of a transaction ends.
	TxEndHook = func(receipt *types.Receipt, err error)

	// EnterHook is invoked when the processing of a message starts.
	EnterHook = func(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// ExitHook is invoked when the processing of a message ends.
	// `revert` is true when there was an error during the execution.
	ExitHook = func(depth int, output []byte, gasUsed uint64, err error, reverted bool)

	// OpcodeHook is invoked just prior to the execution of an opcode.
	OpcodeHook = func(pc uint64, op byte, gas, cost uint64, scope OpContext, rData []byte, depth int, err error)

	// FaultHook is invoked when an error occurs during the execution of an opcode.
	FaultHook = func(pc uint64, op byte, gas, cost uint64, scope OpContext, depth int, err error)

	/*
		- State events -
	*/

	// BalanceChangeHook is called when the balance of an account changes.
	BalanceChangeHook = func(addr common.Address, prev, new *big.Int, reason BalanceChangeReason)

	// NonceChangeHookV2 is called when the nonce of an account changes.
	NonceChangeHookV2 = func(addr common.Address, prev, new uint64, reason NonceChangeReason)

	// CodeChangeHook is called when the code of an account changes.
	CodeChangeHook = func(addr common.Address, prevCodeHash common.Hash, prevCode []byte, codeHash common.Hash, code []byte)

	// StorageChangeHook is called when the storage of an account changes.
	StorageChangeHook = func(addr common.Address, slot common.Hash, prev, new common.Hash)
)

type Hooks struct {
	// VM events
	OnTxStart   TxStartHook
	OnTxEnd     TxEndHook
	OnEnter     EnterHook
	OnExit      ExitHook
	OnOpcode    OpcodeHook
	OnFault     FaultHook
    // ... other hooks ...

	// State events
	OnBalanceChange OnBalanceChange
	OnNonceChangeV2 OnNonceChangeV2
	OnCodeChange    OnCodeChange
	OnStorageChange OnStorageChange
	// ... other hooks ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/journal.go">
```go
// Copyright 2025 The go-ethereum Authors
// ... (license header)

package tracing

// ... (imports)

// journal is a state change journal to be wrapped around a tracer.
// It will emit the state change hooks with reverse values when a call reverts.
type journal struct {
	hooks     *Hooks
	entries   []entry
	revisions []int
}

type entry interface {
	revert(tracer *Hooks)
}

// WrapWithJournal wraps the given tracer with a journaling layer.
func WrapWithJournal(hooks *Hooks) (*Hooks, error) {
    // ...
	// Create a new Hooks instance and copy all hooks
	wrapped := *hooks

	// Create journal
	j := &journal{hooks: hooks}
	// Scope hooks need to be re-implemented.
	wrapped.OnEnter = j.OnEnter
	wrapped.OnExit = j.OnExit
	// Wrap state change hooks.
    // ... (wrapping logic)
	return &wrapped, nil
}

// snapshot records a revision and stores it to the revision stack.
func (j *journal) snapshot() {
	rev := len(j.entries)
	j.revisions = append(j.revisions, rev)
}

// revert reverts all state changes up to the last tracked revision.
func (j *journal) revert(hooks *Hooks) {
	// Replay the journal entries above the last revision to undo changes,
	// then remove the reverted changes from the journal.
	rev := j.revisions[len(j.revisions)-1]
	for i := len(j.entries) - 1; i >= rev; i-- {
		j.entries[i].revert(hooks)
	}
	j.entries = j.entries[:rev]
	j.popRevision()
}

// OnEnter is invoked for each EVM call frame and records a journal revision.
func (j *journal) OnEnter(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	j.snapshot()
	if j.hooks.OnEnter != nil {
		j.hooks.OnEnter(depth, typ, from, to, input, gas, value)
	}
}

// OnExit is invoked when an EVM call frame ends.
// If the call has reverted, all state changes made by that frame are undone.
// If the call did not revert, we forget about changes in that revision.
func (j *journal) OnExit(depth int, output []byte, gasUsed uint64, err error, reverted bool) {
	if reverted {
		j.revert(j.hooks)
	} else {
		j.popRevision()
	}
	if j.hooks.OnExit != nil {
		j.hooks.OnExit(depth, output, gasUsed, err, reverted)
	}
}
// ... (implementations for OnBalanceChange, OnNonceChangeV2, etc.)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// Copyright 2014 The go-ethereum Authors
// ... (license header)
package vm

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/params"
)

// PrecompiledContract is the interface for native contracts.
// Implementations will receive full gas for the call frame, and are responsible
// for charging gas themselves.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas calculates the gas required to execute the pre-compiled contract
	Run(input []byte) ([]byte, error)   // Run runs the pre-compiled contract
}

// PrecompiledContracts contains the default set of pre-compiled contracts used
// in the Ethereum mainnet.
var PrecompiledContracts = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &identity{},
	common.BytesToAddress([]byte{5}): &modexp{},
	common.BytesToAddress([]byte{6}): &ecAdd{},
	common.BytesToAddress([]byte{7}): &ecMul{},
	common.BytesToAddress([]byte{8}): &ecPairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}
// ...
// identity implements the precompiled contract for the identity function.
type identity struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *identity) RequiredGas(input []byte) uint64 {
	return params.IdentityBaseGas + uint64(len(input)+31)/32*params.IdentityPerWordGas
}

// Run run the identity pre-compiled contract.
func (c *identity) Run(input []byte) ([]byte, error) {
	return input, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Copyright 2014 The go-ethereum Authors
// ... (license header)
package vm

// ... (imports)

// Run loops and executes the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
func (in *interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup)

	// Don't bother with the execution loop if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallCtx()
		pc          = uint64(0) // program counter
		cost        uint64
		// ...
	)
	// ...
	if in.cfg.Tracer != nil {
		in.cfg.Tracer.OnEnter(in.depth, contract.Address(), input, contract.Gas, contract.value)
	}
	defer func() {
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.OnExit(in.depth, ret, contract.Gas-gas, err, err != nil)
		}
	}()

	for {
		// ... (gas checks)

		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.evm.chainRules.GetOpcode(op)
		// ... (stack validation)

		// Static portion of gas
		cost = operation.constantGas
		// ... (dynamic gas calculation)

		//
		// VIRTUAL MACHINE EXECUTION LOOP
		//
		switch op {
        // ... (opcode implementations)

		case CALL, CALLCODE, DELEGATECALL, STATICCALL:
			// ...
			// If the tracer has a hook for this exact opcode, call it
			if in.cfg.Tracer != nil {
				in.cfg.Tracer.OnOpcode(pc, op, gas, cost, callContext, ret, in.depth, err)
			}
			// ... (call logic)

		// Default case for unhandled opcodes. This is very important for tracing.
		default:
			// For any other opcode, both valid and invalid ones, call the tracer,
			if in.cfg.Tracer != nil {
				in.cfg.Tracer.OnOpcode(pc, op, gas, cost, callContext, ret, in.depth, err)
			}
		}
		// ... (update pc, etc.)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/timer.go">
```go
// Copyright 2014 The go-ethereum Authors
// ... (license header)
package metrics

import (
	"sync"
	"time"
)
// ...

// Timer captures the duration and rate of events, using a Histogram and a Meter.
type Timer struct {
	histogram Histogram
	meter     *Meter
	mutex     sync.Mutex
}

// NewTimer constructs a new Timer using an exponentially-decaying
// sample with the same reservoir size and alpha as UNIX load averages.
func NewTimer() *Timer {
	return &Timer{
		histogram: NewHistogram(NewExpDecaySample(1028, 0.015)),
		meter:     NewMeter(),
	}
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

// Update the duration of an event, in nanoseconds.
func (t *Timer) Update(d time.Duration) {
	t.mutex.Lock()
	defer t.mutex.Unlock()
	t.histogram.Update(d.Nanoseconds())
	t.meter.Mark(1)
}

// ...

// TimerSnapshot is a read-only copy of another Timer.
type TimerSnapshot struct {
	histogram HistogramSnapshot
	meter     *MeterSnapshot
}

// Count returns the number of events recorded at the time the snapshot was
// taken.
func (t *TimerSnapshot) Count() int64 { return t.histogram.Count() }

// Max returns the maximum value at the time the snapshot was taken.
func (t *TimerSnapshot) Max() int64 { return t.histogram.Max() }

// Mean returns the mean value at the time the snapshot was taken.
func (t *TimerSnapshot) Mean() float64 { return t.histogram.Mean() }

// Min returns the minimum value at the time the snapshot was taken.
func (t *TimerSnapshot) Min() int64 { return t.histogram.Min() }

// Rate1 returns the one-minute moving average rate of events per second at the
// time the snapshot was taken.
func (t *TimerSnapshot) Rate1() float64 { return t.meter.Rate1() }

// ... (other rate and percentile methods)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/registry.go">
```go
// Copyright 2014 The go-ethereum Authors
// ... (license header)
package metrics

// ...

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

	// Unregister the metric with the given name.
	Unregister(string)
    // ...
}

// NewRegistry creates a new registry.
func NewRegistry() Registry {
	return new(StandardRegistry)
}

// StandardRegistry the standard implementation of a Registry uses sync.map
// of names to metrics.
type StandardRegistry struct {
	metrics sync.Map
}

// GetOrRegister gets an existing metric or creates and registers a new one. Threadsafe
// alternative to calling Get and Register on failure.
// The interface can be the metric to register if not found in registry,
// or a function returning the metric for lazy instantiation.
func (r *StandardRegistry) GetOrRegister(name string, i interface{}) interface{} {
	// fast path
	cached, ok := r.metrics.Load(name)
	if ok {
		return cached
	}
	if v := reflect.ValueOf(i); v.Kind() == reflect.Func {
		i = v.Call(nil)[0].Interface()
	}
	item, _, ok := r.loadOrRegister(name, i)
	if !ok {
		return i
	}
	return item
}

// ...
```
</file>
</go-ethereum>
```



---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/tracer.go">
```go
// Tracer is the interface for EVM loggers.
//
// Note: This interface has been evolving over time, and is not yet stable.
// The go-ethereum team is working on a new, standardised API. This is the
// new API, which is still considered experimental.
//
// The old API is EVMLogger, and is located in logger.go
type Tracer interface {
	// CaptureStart is called once at the beginning of a new transaction, before any
	// execution occurs.
	CaptureStart(from common.Address, to common.Address, call bool, input []byte, gas uint64, value *big.Int)

	// CaptureEnd is called once at the end of a transaction, after all execution
	// has concluded.
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)

	// CaptureState is called before each opcode is executed.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It is called with the stack, memory and scope of the faulting execution context.
	//
	// The err parameter is non-nil and is the same access as the error returned by
	// EVM.Call method.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope ScopeContext, depth int, err error)

	// CaptureEnter is called when the EVM enters a new execution scope (via call, create
	// or create2).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits an execution scope.
	CaptureExit(output []byte, gasUsed uint64, err error)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, no gas refund should be
// provided, and the code should execution should be stopped on the first error.
func (in *Interpreter) Run(contract *Contract, input []byte) (ret []byte, err error) {
	// ... (initialization code) ...

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
		// For optimisation, reference the opcodes list directly
		opcodes = in.opcodes
		// ...
	)
	// Don't heap allocate stuff for tracers if there's no tracer
	if in.cfg.Tracer != nil {
		in.cfg.Tracer.CaptureStart(in.evm.TxContext.Origin, contract.Address(), contract.Address() != contract.Caller(), input, contract.Gas, contract.Value())
		defer func() {
			// As per the EIP-3155, the returned gas is not part of the 'used gas'.
			//
			// For backward compatibility, we have to add it here to report the used gas
			// including the refunded gas.
			//
			// TODO(holiman): When/if we get a chance to change the API, this should be
			// changed, and the 'gas used' should be the actual used gas.
			in.cfg.Tracer.CaptureEnd(ret, contract.Gas-contract.Gas, time.Since(in.startTime), err)
		}()
	}
	for {
		// Capture pre-execution state.
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureState(in.pc, op, contract.Gas, 0, callContext, in.returnData, in.evm.depth, err)
		}
		op = contract.GetOp(in.pc)
		operation := opcodes[op]
		// ... (gas cost calculation) ...

		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			// ... (handle error) ...
		}
		// Validate memory
		// ...

		// Execute the operation
		res, err = operation.execute(&in.pc, in, callContext)
		
		// ... (handle result and errors) ...
	}
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// StructLogger is an EVMLogger that captures execution steps and converts them to
// a JSON object.
//
// Note, the StructLogger is not safe for concurrent use.
type StructLogger struct {
	cfg *Config // shouldn't be mutated during execution

	storage map[common.Hash]common.Hash
	logs    []*StructLog
	gas     uint64
	err     error

	logLock sync.Mutex // lock for list of logs
}

// StructLog is a structured log message used by the EVM's tracing system.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            string                      `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []string                    `json:"memory"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*uint256.Int              `json:"stack"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           string                      `json:"error,omitempty"`
}

// CaptureState captures the contract's state at a given execution step.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope ScopeContext, rData []byte, depth int, err error) {
	// ... (implementation to capture state into a StructLog)
}

// ... other capture methods
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContract is the interface for native contracts.
//
// Native contracts are implemented in Go and are assigned specific addresses that are
// not otherwise occupied. The call costs are not based on EVM gas limits but are
// instead hard-coded for the operation.
type PrecompiledContract interface {
	// RequiredGas returns the gas required to execute the pre-compiled contract.
	RequiredGas(input []byte) uint64

	// Run executes the pre-compiled contract.
	// It is important that the returned error is either nil or an
	// error defined in the vm package, because otherwise the error will be
	// replaced with vm.ErrExecutionReverted.
	Run(input []byte) ([]byte, error)
}

// PrecompiledContractsBerlin contains the precompiled contracts after the Berlin fork.
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

// ActivePrecompiles returns the precompiled contracts for the given chain configuration.
func ActivePrecompiles(rules params.Rules) map[common.Address]PrecompiledContract {
	// ... (logic to return correct map based on hardfork) ...
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiles.go">
```go
// ecrecover implements the ecrecover precompiled contract.
type ecrecover struct{}

func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const bitlen = 256

	// "input" is a 128-byte byte array.
	//
	// It consists of:
	//   - h: 32-byte message hash
	//   - v: 32-byte recovery id
	//   - r: 32-byte signature val
	//   - s: 32-byte signature val
	input = common.RightPadBytes(input, 128)

	// Recover the public key.
	// This is the same as in `core/types/transaction_signing.go`.
	h := input[:32]
	v := new(big.Int).SetBytes(input[32:64])
	r := new(big.Int).SetBytes(input[64:96])
	s := new(big.Int).SetBytes(input[96:128])

	// After the Homestead hard fork, we have to validate `s` value.
	// Before that, we can just pass what we have to the ecrecover function.
	if s.Cmp(crypto.HalfN) > 0 {
		return nil, nil // Return nil to indicate failure, but not an error
	}
	// v needs to be 27 or 28.
	if v.Cmp(big.NewInt(27)) != 0 && v.Cmp(big.NewInt(28)) != 0 {
		return nil, nil // Return nil to indicate failure, but not an error
	}

	sig := make([]byte, 65)
	copy(sig[32-len(r.Bytes()):32], r.Bytes())
	copy(sig[64-len(s.Bytes()):64], s.Bytes())
	sig[64] = byte(v.Uint64() - 27)

	// ecrecover returns a 65-byte array of public key.
	pub, err := crypto.Ecrecover(h, sig)
	// Make sure the public key is a valid one.
	if err != nil {
		return nil, nil // Return nil to indicate failure, but not an error
	}

	// The public key is 64 bytes long, beginning with a 0x04 prefix.
	// The address is the rightmost 20 bytes of the Keccak hash of the public key.
	return common.LeftPadBytes(crypto.Keccak256(pub[1:])[12:], 32), nil
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
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max length the stack can have for this operation
	// to not overflow the stack.
	maxStack int

	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc
}

// JumpTable contains the EVM opcodes supported by a given fork.
type JumpTable [256]*operation

// newHomesteadInstructionSet returns the opcode table for the Homestead fork.
func newHomesteadInstructionSet() JumpTable {
	// The homestead instruction set is the same as the frontier set
	// except for the DELEGATECALL instruction.
	instructionSet := newFrontierInstructionSet()
	instructionSet[DELEGATECALL] = &operation{
		execute:    opDelegateCall,
		gasCost:    gasDelegateCall,
		minStack:   6,
		maxStack:   1017,
		memorySize: memoryCall,
	}
	return instructionSet
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
// Please consult the yellow paper for more details/exact gas costs
//
// Naming convention:
//
//	opX = instruction with opcode X
//	gasX = gas cost of opX
//
var (
	opStop                 = &operation{execute: opstop, gasCost: gasStop, minStack: 0, maxStack: 0}
	opAdd                  = &operation{execute: opadd, gasCost: gasFastestStep, minStack: 2, maxStack: 1023}
	opMul                  = &operation{execute: opmul, gasCost: gasFastStep, minStack: 2, maxStack: 1023}
	// ... and so on for all opcodes
)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// stateTransition represents a state transition.
// ... (omitted for brevity)
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
		
		// ...
		
		ret, st.gasRemaining, vmerr = st.evm.Call(msg.From, st.to(), msg.Data, st.gasRemaining, value)
	}

	// ... (gas refund and fee logic) ...

	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		MaxUsedGas: peakGasUsed,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/statedb.go">
```go
// StateDB is an EVM database for full state querying.
type StateDB interface {
	CreateAccount(common.Address, bool)
	SubBalance(common.Address, *uint256.Int, tracing.BalanceChangeReason)
	AddBalance(common.Address, *uint256.Int, tracing.BalanceChangeReason)
	GetBalance(common.Address) *uint256.Int

	GetNonce(common.Address) uint64
	SetNonce(common.Address, uint64, tracing.NonceChangeReason)

	GetCodeHash(common.Address) common.Hash
	GetCode(common.Address) []byte
	SetCode(common.Address, []byte)
	GetCodeSize(common.Address) int

	AddRefund(uint64)
	SubRefund(uint64)
	GetRefund() uint64

	GetCommittedState(common.Address, common.Hash) common.Hash
	GetState(common.Address, common.Hash) common.Hash
	SetState(common.Address, common.Hash, common.Hash)

	Suicide(common.Address) bool
	HasSuicided(common.Address) bool

	// Exist reports whether the given account exists in state.
	// Notably this should also return true for suicided accounts.
	Exist(common.Address) bool
	// Empty returns whether the given account is empty. Empty
	// is defined according to EIP161 (balance = nonce = code = 0).
	Empty(common.Address) bool

	// Prepare handles the preparatory steps for a state transition with regard to
	// EIP-158 and EIP-2929. It should be called before the state transition is
	// initiated.
	Prepare(rules params.Rules, sender, coinbase common.Address, dst *common.Address, precompiles []common.Address, txAccesses types.AccessList)

	AddressInAccessList(addr common.Address) bool
	SlotInAccessList(addr common.Address, slot common.Hash) (addressPresent bool, slotPresent bool)
	// AddAddressToAccessList adds the given address to the access list. This operation is safe to perform
	// even if the feature/fork is not active yet.
	AddAddressToAccessList(addr common.Address)
	// AddSlotToAccessList adds the given (address, slot) to the access list. This operation is safe to perform
	// even if the feature/fork is not active yet.
	AddSlotToAccessList(addr common.Address, slot common.Hash)

	RevertToSnapshot(int)
	Snapshot() int

	// ... other methods ...
}
```
</file>
</go-ethereum>

---

This is a great, detailed prompt. The architecture you've outlined for the extension system is robust and covers all the necessary components. The Go-Ethereum codebase provides excellent real-world examples for many of these concepts, especially for the hook system (tracers), precompiles, and the core VM execution loop.

Here are the most relevant code snippets from Go-Ethereum to guide your implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm *EVM
	cfg Config

	hasher    crypto.KeccakState // Keccak256 hasher instance for the SHA3 opcode
	hasherBuf common.Hash        // Keccak256 hasher buffer for the SHA3 opcode

	readOnly   bool   // whether to throw on state modifying opcodes
	returnData []byte // last CALL's return data for subsequent reuse
}
...

// Run implements the EVM interpreter interface. It executes the given contract
// bytecode and returns the transformed output and a potential error.
//
// The interpreter will revert all changes made to the state and return the
// error if an execution error occurs.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (initial setup)

	// Make sure the readOnly is only set if we aren't in readOnly yet.
	// This makes also sure that the readOnly flag is accumulated,
	// and cannot be unset.
	if readOnly && !in.readOnly {
		in.readOnly = true
		defer func() { in.readOnly = false }()
	}

	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() { in.evm.depth-- }()

	// Reset the previous return data. It's persistent across calls
	// to permit RETURNDATACOPY to be used in the caller.
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
		// For optimisation, reference the opcodes table directly.
		opcodes = in.evm.opcodes
		pc      = uint64(0) // program counter
		cost    uint64
		// copies used by tracer
		pcCopy  uint64
		gasCopy uint64
		res     []byte
	)
	contract.Input = input

	// The Interpreter main loop. This loop will continue until execution of
	// the contract is completed or an error is encountered.
	for {
		if in.cfg.Tracer != nil {
			pcCopy = pc
			gasCopy = contract.Gas
		}
		// Get the operation from the jump table and validate the stack.
		// We use jumpOnly because we don't want to execution trace each opcode,
		// but only the ones necessary.
		op = contract.GetOp(pc)
		operation := opcodes.get(op, in.evm.chainRules.IsCancun)
		// ... (stack validation)

		// Static portion of gas cost
		cost = operation.constantGas
		// ... (dynamic gas calculation)

		if err := contract.UseGas(cost); err != nil {
			return nil, err
		}

		// Reserving memory expansion gas.
		if operation.memorySize > 0 {
			// ... (memory expansion logic)
		}
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureState(in.evm, pcCopy, op, gasCopy, cost, mem, stack, callContext, in.returnData, in.evm.depth, err)
		}

		// Execute the operation
		res, err = operation.execute(&pc, in, callContext, mem, stack)
		if err != nil {
			break
		}
		pc++
	}
	// When the loop terminates, the contents of `ret` become the return value.
	if err == errStopToken {
		return nil, nil // Terminates execution, returns empty byte array
	}
	if err != nil {
		if errors.Is(err, ErrExecutionReverted) {
			return res, err
		}
		return nil, err
	}
	return res, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVMLogger is used to collect execution traces from an EVM transaction.
// EVMLogger is not safe for concurrent use.
type EVMLogger = Tracer

// Tracer is used to collect execution traces from an EVM transaction.
// It is the successor of EVMLogger, and replaces it. For backward-compatibility,
// EVMLogger is kept as an alias.
// Tracer is not safe for concurrent use.
type Tracer interface {
	// CaptureStart is called once at the beginning of a new transaction to let the
	// tracer know to start capturing states. It's also used to pass the destination
	// contract and call data to the tracer.
	// It's not expected for the tracer to do any mutation on the passed-in memory.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureState is called on each step of the interpreter. It's up to the
	// tracer to decide what to do with the state.
	// It's not expected for the tracer to do any mutation on the passed-in memory.
	// The memory may also be reused across steps, so the tracer should make a copy
	// if it wants to retain it.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It's up to the tracer to decide what to do with the fault.
	// It's not expected for the tracer to do any mutation on the passed-in memory.
	// The memory may also be reused across steps, so the tracer should make a copy
	// if it wants to retain it.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnter is called when the EVM enters a new execution scope (CALL, CREATE).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits an execution scope with a success status.
	CaptureExit(output []byte, gasUsed uint64, err error)

	// CaptureEnd is called once at the end of a transaction to let the tracer know
	// that the transaction has been ended.
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContract is the interface for a native contract.
//
// The native contracts are contracts that are implemented in Go instead of EVM
// bytecode. They are useful for implementing functionality that is too complex
// or computationally expensive to be implemented in EVM bytecode.
//
// The precompiled contracts are called in the same way as regular contracts.
// The EVM checks if the call destination is one of the precompiled contracts
// and if so, calls the contract's Run method.
type PrecompiledContract interface {
	// RequiredGas returns the gas required to execute the pre-compiled contract.
	RequiredGas(input []byte) uint64

	// Run executes the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}
...

// PrecompiledContractsBerlin contains the default pre-compiled contracts for
// the Berlin hard-fork.
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

// PrecompiledContractsCancun contains the default pre-compiled contracts for
// the Cancun hard-fork.
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
	common.BytesToAddress([]byte{10}): &pointEvaluation{},
}

// ActivePrecompiles returns the precompiled contracts for the given chain configuration.
func ActivePrecompiles(rules params.Rules) []common.Address {
	// ... (logic to select precompiles based on hardfork)
}

// RunPrecompiledContract runs the precompiled contract specified by the address.
func RunPrecompiledContract(p PrecompiledContract, input []byte, contract *Contract) (ret []byte, err error) {
	gas := p.RequiredGas(input)
	if contract.UseGas(gas) {
		return p.Run(input)
	}
	return nil, ErrOutOfGas
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// operation represents an instruction in the EVM.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// constantGas is the gas that is taken on top of dynamic gas
	constantGas uint64
	// dynamicGas is the dynamic gas function
	dynamicGas gasFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max stack height after execution
	maxStack int
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc

	// Common instruction attributes for optimization
	jumps     bool // is a jump instruction
	writes    bool // writes to state
	valid     bool // is a valid instruction
	reverts   bool // instruction reverts
	returns   bool // instruction returns
	halts     bool // instruction halts execution
	pushes    bool // instruction pushes onto stack
	reads     bool // instruction reads from state
	allocates bool // instruction allocates memory
}

// JumpTable contains the EVM opcodes supported by the interpreter.
type JumpTable [256]*operation

// newCancunInstructionSet returns the instruction set for the Cancun hard-fork.
func newCancunInstructionSet() JumpTable {
	// Create a jump table with the instructions supported by the Homestead HF.
	jt := newShanghaiInstructionSet()

	// Update the jump table with the instructions supported by Cancun.
	jt[TLOAD] = &operation{
		execute:     opTload,
		constantGas: GasWarmAccess,
		minStack:    1,
		maxStack:    1,
		reads:       true,
	}
	jt[TSTORE] = &operation{
		execute:     opTstore,
		constantGas: GasWarmAccess,
		minStack:    2,
		maxStack:    0,
		writes:      true,
	}
	jt[MCOPY] = &operation{
		execute:     opMcopy,
		constantGas: GasVeryLow,
		dynamicGas:  gasMcopy,
		minStack:    3,
		maxStack:    0,
		memorySize:  memoryMcopy,
		allocates:   true,
	}
	jt[BLOBHASH] = &operation{
		execute:     opBlobHash,
		constantGas: GasBlobHash,
		minStack:    1,
		maxStack:    1,
	}
	return jt
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a contract's computational stack.
type Stack struct {
	data []*big.Int
	// It's cheaper to have a local copy of the pointer, rather than constantly
	// retrieving it from the array.
	last *big.Int
}

// NewStack returns a new stack with a backing store of size.
func newstack() *Stack {
	return &Stack{data: make([]*big.Int, 0, 16)} // Start with a small capacity
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []*big.Int {
	return st.data
}

// Push pushes a value onto the stack.
func (st *Stack) Push(d *big.Int) {
	st.data = append(st.data, d)
	st.last = d
}
...
// Pop pops a value from the stack.
func (st *Stack) Pop() (ret *big.Int) {
	ret = st.last
	st.data = st.data[:len(st.data)-1]
	if len(st.data) > 0 {
		st.last = st.data[len(st.data)-1]
	} else {
		st.last = nil
	}
	return
}
...
// Len returns the number of items on the stack.
func (st *Stack) len() int {
	return len(st.data)
}
...
// require tells the stack that it is required to have at least n elements.
// If the stack is not large enough, an error is returned.
func (st *Stack) require(n int) error {
	if len(st.data) < n {
		return fmt.Errorf("%w: require %d, have %d", ErrStackUnderflow, n, len(st.data))
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
...
// Set sets the memory at a given offset to a specified value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	// ... (implementation)
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}
...
// Get returns a slice of memory.
func (m *Memory) Get(offset, size int64) (cpy []byte) {
	// ... (implementation)
}
...
// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
</go-ethereum>

## Prompt Corrections

Your prompt is exceptionally well-structured and detailed. It outlines a modern, flexible, and powerful extension system. The Go-Ethereum snippets above validate many of your design choices and provide a solid reference. Here are a few minor suggestions based on Go-Ethereum's production experience:

1.  **Hook Context (`HookContext`)**: The `HookContext` struct is well-designed. In `go-ethereum`, the equivalent `ScopeContext` is passed by value to tracers. Consider if passing the context by value or by pointer makes more sense in Zig's memory model, especially for performance-critical hooks like `PreOpcode`. Passing a pointer might be more efficient if the context is large.

2.  **Hook Result (`HookResult`)**: The `HookResult` union is very expressive. `go-ethereum`'s `Tracer` interface doesn't return values; it modifies state or logs information via its methods. Your design of returning a `union` is more powerful and allows hooks to directly influence execution flow (e.g., `Abort`, `Replace`). This is a great feature.

3.  **Custom Opcodes (`CustomOpcode`)**: Your `CustomOpcode` struct is more flexible than `go-ethereum`'s internal `operation` struct, especially with dynamic gas cost functions and detailed availability rules. In `go-ethereum`, gas costs and availability are often hard-coded or selected at jump table creation time. Your design is more amenable to runtime registration and plugins.

4.  **Plugin Loader**: The dynamic plugin loading via shared libraries is a powerful feature not present for low-level EVM extensions in `go-ethereum`. Be mindful of the security implications, as outlined in your `ExtensionManager`'s validation logic. The sandboxing and capability system you've designed will be critical here. `go-ethereum`'s tracer/logger "plugins" are compile-time dependencies, which is a safer but less flexible model. Your approach is more ambitious and powerful.

The provided Go-Ethereum context should serve as a strong foundation for implementing your specified features. Good luck

---

<go-ethereum>
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
	// Capture the tracer start/end events in debug mode
	if evm.Config.Tracer != nil {
		evm.captureBegin(evm.depth, CALL, caller, addr, input, gas, value.ToBig())
		defer func(startGas uint64) {
			evm.captureEnd(evm.depth, startGas, leftOverGas, ret, err)
		}(gas)
	}
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if !value.IsZero() && !evm.Context.CanTransfer(evm.StateDB, caller, value) {
		return nil, gas, ErrInsufficientBalance
	}
	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	if !evm.StateDB.Exist(addr) {
		// ... (account creation logic)
	}
	evm.Context.Transfer(evm.StateDB, caller, addr, value)

	if isPrecompile {
		ret, gas, err = RunPrecompiledContract(p, input, gas, evm.Config.Tracer)
	} else {
		// Initialise a new contract and set the code that is to be used by the EVM.
		code := evm.resolveCode(addr)
		if len(code) == 0 {
			ret, err = nil, nil // gas is unchanged
		} else {
			// The contract is a scoped environment for this execution context only.
			contract := NewContract(caller, addr, value, gas, evm.jumpDests)
			contract.IsSystemCall = isSystemCall(caller)
			contract.SetCallCode(evm.resolveCodeHash(addr), code)
			ret, err = evm.interpreter.Run(contract, input, false)
			gas = contract.Gas
		}
	}
	// ... (error handling and snapshot revert)
	return ret, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
```go
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
	// ... (setup logic)

	// The Interpreter main run loop (contextual). This loop runs until either an
	// explicit STOP, RETURN or SELFDESTRUCT is executed, an error occurred during
	// the execution of one of the operations or until the done flag is set by the
	// parent context.
	for {
		if debug {
			// Capture pre-execution values for tracing.
			logged, pcCopy, gasCopy = false, pc, contract.Gas
		}

        // ... (pre-opcode logic, e.g., Verkle gas charging)

		// Get the operation from the jump table and validate the stack ...
		op = contract.GetOp(pc)
		operation := in.table[op]
		cost = operation.constantGas
		// Validate stack
		// ...

		// for tracing: this gas consumption event is emitted below in the debug section.
		if contract.Gas < cost {
			return nil, ErrOutOfGas
		} else {
			contract.Gas -= cost
		}

		// Calculate dynamic gas cost
		if operation.dynamicGas != nil {
            // ... (dynamic gas calculation logic)
		}

		// Do tracing before potential memory expansion
		if debug {
			if in.evm.Config.Tracer.OnGasChange != nil {
				in.evm.Config.Tracer.OnGasChange(gasCopy, gasCopy-cost, tracing.GasChangeCallOpCode)
			}
			if in.evm.Config.Tracer.OnOpcode != nil {
				in.evm.Config.Tracer.OnOpcode(pc, byte(op), gasCopy, cost, callContext, in.returnData, in.evm.depth, VMErrorFromErr(err))
				logged = true
			}
		}
		
        // ... (memory expansion logic)

		// execute the operation
		res, err = operation.execute(&pc, in, callContext)
		if err != nil {
			break
		}
		pc++
	}

	if err == errStopToken {
		err = nil // clear stop token error
	}

	return res, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state/statedb_hooked.go">
```go
// hookedStateDB represents a statedb which emits calls to tracing-hooks
// on state operations.
type hookedStateDB struct {
	inner *StateDB
	hooks *tracing.Hooks
}

// NewHookedState wraps the given stateDb with the given hooks
func NewHookedState(stateDb *StateDB, hooks *tracing.Hooks) *hookedStateDB {
	s := &hookedStateDB{stateDb, hooks}
	if s.hooks == nil {
		s.hooks = new(tracing.Hooks)
	}
	return s
}

func (s *hookedStateDB) SubBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) uint256.Int {
	prev := s.inner.SubBalance(addr, amount, reason)
	if s.hooks.OnBalanceChange != nil && !amount.IsZero() {
		newBalance := new(uint256.Int).Sub(&prev, amount)
		s.hooks.OnBalanceChange(addr, prev.ToBig(), newBalance.ToBig(), reason)
	}
	return prev
}

func (s *hookedStateDB) AddBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) uint256.Int {
	prev := s.inner.AddBalance(addr, amount, reason)
	if s.hooks.OnBalanceChange != nil && !amount.IsZero() {
		newBalance := new(uint256.Int).Add(&prev, amount)
		s.hooks.OnBalanceChange(addr, prev.ToBig(), newBalance.ToBig(), reason)
	}
	return prev
}

func (s *hookedStateDB) SetNonce(address common.Address, nonce uint64, reason tracing.NonceChangeReason) {
	prev := s.inner.GetNonce(address)
	s.inner.SetNonce(address, nonce, reason)
	if s.hooks.OnNonceChangeV2 != nil {
		s.hooks.OnNonceChangeV2(address, prev, nonce, reason)
	} else if s.hooks.OnNonceChange != nil {
		s.hooks.OnNonceChange(address, prev, nonce)
	}
}

func (s *hookedStateDB) SetCode(address common.Address, code []byte) []byte {
	prev := s.inner.SetCode(address, code)
	if s.hooks.OnCodeChange != nil {
		prevHash := types.EmptyCodeHash
		if len(prev) != 0 {
			prevHash = crypto.Keccak256Hash(prev)
		}
		s.hooks.OnCodeChange(address, prevHash, prev, crypto.Keccak256Hash(code), code)
	}
	return prev
}

func (s *hookedStateDB) SetState(address common.Address, key common.Hash, value common.Hash) common.Hash {
	prev := s.inner.SetState(address, key, value)
	if s.hooks.OnStorageChange != nil && prev != value {
		s.hooks.OnStorageChange(address, key, prev, value)
	}
	return prev
}

func (s *hookedStateDB) AddLog(log *types.Log) {
	// The inner will modify the log (add fields), so invoke that first
	s.inner.AddLog(log)
	if s.hooks.OnLog != nil {
		s.hooks.OnLog(log)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/jump_table.go">
```go
type (
	executionFunc func(pc *uint64, interpreter *EVMInterpreter, callContext *ScopeContext) ([]byte, error)
	gasFunc       func(*EVM, *Contract, *Stack, *Memory, uint64) (uint64, error) // last parameter is the requested memory size as a uint64
	// memorySizeFunc returns the required size, and whether the operation overflowed a uint64
	memorySizeFunc func(*Stack) (size uint64, overflow bool)
)

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

// JumpTable contains the EVM opcodes supported at a given fork.
type JumpTable [256]*operation

// newFrontierInstructionSet returns the frontier instructions
// that can be executed during the frontier phase.
func newFrontierInstructionSet() JumpTable {
	tbl := JumpTable{
		STOP: {
			execute:     opStop,
			constantGas: 0,
			minStack:    minStack(0, 0),
			maxStack:    maxStack(0, 0),
		},
		ADD: {
			execute:     opAdd,
			constantGas: GasFastestStep,
			minStack:    minStack(2, 1),
			maxStack:    maxStack(2, 1),
		},
        // ... (all other opcodes)
    }
    // ...
	return validate(tbl)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/eips.go">
```go
var activators = map[int]func(*JumpTable){
	5656: enable5656,
	6780: enable6780,
	3855: enable3855,
	// ... (other EIPs)
}

// EnableEIP enables the given EIP on the config.
// This operation writes in-place, and callers need to ensure that the globally
// defined jump tables are not polluted.
func EnableEIP(eipNum int, jt *JumpTable) error {
	enablerFn, ok := activators[eipNum]
	if !ok {
		return fmt.Errorf("undefined eip %d", eipNum)
	}
	enablerFn(jt)
	return nil
}

// enable3855 applies EIP-3855 (PUSH0 opcode)
func enable3855(jt *JumpTable) {
	// New opcode
	jt[PUSH0] = &operation{
		execute:     opPush0,
		constantGas: GasQuickStep,
		minStack:    minStack(0, 1),
		maxStack:    maxStack(0, 1),
	}
}
```
</file>
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

// ... (other hardfork precompile sets)

func activePrecompiledContracts(rules params.Rules) PrecompiledContracts {
	switch {
	case rules.IsVerkle:
		return PrecompiledContractsVerkle
	// ... (logic for other hardforks)
	default:
		return PrecompiledContractsHomestead
	}
}

// RunPrecompiledContract runs and evaluates the output of a precompiled contract.
// It returns
// - the returned bytes,
// - the _remaining_ gas,
// - any error that occurred
func RunPrecompiledContract(p PrecompiledContract, input []byte, suppliedGas uint64, logger *tracing.Hooks) (ret []byte, remainingGas uint64, err error) {
	gasCost := p.RequiredGas(input)
	if suppliedGas < gasCost {
		return nil, 0, ErrOutOfGas
	}
	if logger != nil && logger.OnGasChange != nil {
		logger.OnGasChange(suppliedGas, suppliedGas-gasCost, tracing.GasChangeCallPrecompiledContract)
	}
	suppliedGas -= gasCost
	output, err := p.Run(input)
	return output, suppliedGas, err
}

// data copy implemented as a native contract.
type dataCopy struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *dataCopy) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.IdentityPerWordGas + params.IdentityBaseGas
}
func (c *dataCopy) Run(in []byte) ([]byte, error) {
	return common.CopyBytes(in), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state/journal.go">
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

// ... (journal methods: snapshot, revertToSnapshot, append)

type (
	// Changes to individual accounts.
	balanceChange struct {
		account common.Address
		prev    *uint256.Int
	}
	nonceChange struct {
		account common.Address
		prev    uint64
	}
	storageChange struct {
		account   common.Address
		key       common.Hash
		prevvalue common.Hash
		origvalue common.Hash
	}
	codeChange struct {
		account  common.Address
		prevCode []byte
	}
	// ... (other change types)
)

func (ch balanceChange) revert(s *StateDB) {
	s.getStateObject(ch.account).setBalance(ch.prev)
}

func (ch storageChange) revert(s *StateDB) {
	s.getStateObject(ch.account).setState(ch.key, ch.prevvalue, ch.origvalue)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/blockchain.go">
```go
// Metrics for the blockchain
var (
	headBlockGauge          = metrics.NewRegisteredGauge("chain/head/block", nil)
	headHeaderGauge         = metrics.NewRegisteredGauge("chain/head/header", nil)
	// ... (other gauges)

	blockInsertTimer          = metrics.NewRegisteredResettingTimer("chain/inserts", nil)
	blockValidationTimer      = metrics.NewRegisteredResettingTimer("chain/validation", nil)
	blockExecutionTimer       = metrics.NewRegisteredResettingTimer("chain/execution", nil)
	blockWriteTimer           = metrics.NewRegisteredResettingTimer("chain/write", nil)
	
	// ... (other meters and timers)
)

// In an import loop, e.g. insertChain:
func (bc *BlockChain) insertChain(chain types.Blocks, setHead bool, makeWitness bool) (*stateless.Witness, int, error) {
    // ...
	for ; block != nil && err == nil || errors.Is(err, ErrKnownBlock); block, err = it.next() {
        // ... (processing logic)

        // The traced section of block import.
		start := time.Now()
		res, err := bc.processBlock(parent.Root, block, setHead, makeWitness && len(chain) == 1)
        // ...
        ptime := time.Since(start)

        // ... (update various metrics)
        blockExecutionTimer.Update(ptime - (statedb.AccountReads + statedb.StorageReads)) // The time spent on EVM processing
		blockValidationTimer.Update(vtime - (triehash + trieUpdate))                      // The time spent on block validation
		blockInsertTimer.UpdateSince(startTime)
    }
    // ...
}
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt is excellent and provides a very detailed specification for a modern, extensible EVM. It's more of a design document than a typical implementation prompt. There are no "errors," but here are a few observations and suggestions based on go-ethereum's design principles that might be considered:

1.  **Dynamic Loading (`PluginLoader`) vs. Compile-time Configuration**: The prompt specifies a `PluginLoader` for dynamically loading shared libraries (`.so`, `.dll`). While this offers maximum runtime flexibility, it introduces significant complexity and potential security risks (sandboxing, symbol resolution, ABI stability). Geth avoids this for core EVM logic. Instead, it achieves extensibility through:
    *   **Compile-time configuration**: Using `params.ChainConfig` and build tags to create different versions of the EVM for different chains/hardforks.
    *   **Interfaces**: Passing implementations of interfaces like `tracing.Hooks` or `consensus.Engine` during the `EVM`'s construction.
    *   **Recommendation**: For core functionalities like custom opcodes, a compile-time registration system (similar to Geth's jump tables and hardfork configuration) is often safer and more performant. For tracing and external monitoring, a hook/interface-based system is ideal. Dynamic library loading is powerful but might be better suited for non-critical or highly specialized extensions where the performance/security trade-off is acceptable.

2.  **Hook System Granularity**: The proposed `HookPoint` enum is extremely comprehensive. When implementing, it's crucial to consider the performance impact of the most frequently called hooks, such as `PreOpcode` and `PostOpcode`. In Geth, the `tracing.Hooks` are only enabled when a tracer is active (`if debug` checks), minimizing overhead for normal execution. The proposed `ExtensionManager.execute_hook` correctly checks `if (!self.config.enable_extensions)`, which is the right approach.

3.  **Custom Opcodes and Gas Calculation**: The prompt's `CustomOpcode` struct with a `GasCost` union is a great design. It mirrors the reality that gas costs can be static or dynamic. Geth implements this with a `constantGas` field and an optional `dynamicGas` function pointer in its `operation` struct. This is a well-vetted pattern.

Overall, the prompt describes a very robust and feature-rich system. The provided go-ethereum snippets should offer a solid architectural reference for implementing it.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/tracer.go">
```go
// Tracer is a generic interface to trace contract execution.
type Tracer interface {
	// OnTxStart is called at the beginning of transaction processing.
	// It is called once per transaction.
	OnTxStart(tx *types.Transaction, from common.Address)

	// OnEnter is called when the EVM enters a new frame, either through a CALL, CREATE or SELFDESTRUCT.
	// This method is called once per frame.
	//
	// It's not possible to use this method to implement an opcode-level tracer,
	// but it can be used to track call frames. For opcode-level tracing, use
	// an EVM with a `Tracer` logger.
	OnEnter(depth int, typ byte, from, to common.Address, input []byte, gas uint64, value *big.Int)

	// OnExit is called when the EVM exits a frame, either through a RETURN, REVERT,
	// or an error. This method is called once per frame.
	OnExit(depth int, output []byte, gasUsed uint64, err error)

	// OnOpcode is called for each opcode that is executed.
	OnOpcode(pc uint64, op byte, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// OnTxEnd is called at the end of transaction processing.
	// It is called once per transaction.
	OnTxEnd(receipt *types.Receipt, err error)
}

// StructLogger is a default implementation of the Tracer interface that logs all
// events to a struct that can be easily marshalled into a JSON object.
type StructLogger struct {
	cfg             *logger.Config
	storage         map[common.Address]map[common.Hash]common.Hash
	logs            []*types.Log
	output          []byte
	gas             uint64
	reverted        bool
	err             error
	skipCapture     atomic.Bool
	callstack       []callFrame
	receipt         *types.Receipt
	interrupt       *atomic.Bool
	interruptReason error
	reason          string
}

// NewStructLogger returns a new logger that is used for structured logging.
func NewStructLogger(cfg *logger.Config, interrupt *atomic.Bool, reason error) *StructLogger {
	logger := &StructLogger{
		cfg:             cfg,
		storage:         make(map[common.Address]map[common.Hash]common.Hash),
		callstack:       make([]callFrame, 0),
		interrupt:       interrupt,
		interruptReason: reason,
	}
	if cfg == nil {
		logger.cfg = &logger.Config{}
	}
	return logger
}

// OnEnter is called when the EVM enters a new frame.
func (l *StructLogger) OnEnter(depth int, typ byte, from, to common.Address, input []byte, gas uint64, value *big.Int) {
	if l.skipCapture.Load() {
		return
	}
	// Skip if tracing is disabled
	if !l.cfg.EnableMemory && !l.cfg.EnableStack {
		l.skipCapture.Store(true)
		return
	}
	// The call stack is represented as a slice of call frames.
	// We therefore need to look at the length of the slice to determine the
	// true call depth.
	if len(l.callstack) != depth {
		// This should not happen, but it's better to be safe than sorry.
		// If it does happen, we'll just stop capturing.
		l.err = fmt.Errorf("incorrect call depth: have %d, want %d", len(l.callstack), depth)
		l.skipCapture.Store(true)
		return
	}
	// We need to copy the input because it may be modified by the EVM.
	l.callstack = append(l.callstack, callFrame{
		typ:     typ,
		from:    from,
		to:      to,
		input:   common.CopyBytes(input),
		gas:     gas,
		value:   value,
		storage: make(map[common.Hash]common.Hash),
	})
}

// OnExit is called when the EVM exits a frame.
func (l *StructLogger) OnExit(depth int, output []byte, gasUsed uint64, err error) {
	if l.skipCapture.Load() {
		return
	}
	// When the call finishes, we need to pop the last call frame from the
	// stack. In case of an error, we don't care about the output.
	if err != nil || l.cfg.DisableStorage {
		l.callstack = l.callstack[:len(l.callstack)-1]
		return
	}
	// Otherwise, we need to copy the storage changes from the child frame
	// to the parent frame.
	frame := l.callstack[len(l.callstack)-1]
	l.callstack = l.callstack[:len(l.callstack)-1]

	if len(l.callstack) > 0 {
		l.callstack[len(l.callstack)-1].merge(frame)
	} else {
		// We are at the end of the call, so we need to merge the storage
		// changes into the global storage.
		for k, v := range frame.storage {
			l.storage[frame.to][k] = v
		}
	}
}

// OnOpcode is called for each opcode that is executed.
func (l *StructLogger) OnOpcode(pc uint64, op byte, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	if l.skipCapture.Load() {
		return
	}
	// Check for interruption
	if l.interrupt != nil && l.interrupt.Load() {
		l.err = l.interruptReason
		l.skipCapture.Store(true)
		return
	}
	if !l.cfg.EnableMemory {
		scope.Memory = nil
	}
	if !l.cfg.EnableStack {
		scope.Stack = nil
	}
	if !l.cfg.EnableReturnData {
		rData = nil
	}

	log := &logger.StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Memory:     scope.Memory,
		Stack:      scope.Stack,
		ReturnData: rData,
		Depth:      depth,
		Err:        err,
	}
	// Add storage if it was changed
	if l.cfg.DisableStorage {
		log.Storage = make(map[common.Hash]common.Hash)
	} else {
		// get current call frame
		frame := &l.callstack[len(l.callstack)-1]
		// take a snapshot of the current storage and check for changes
		if !l.cfg.DisableStorage {
			log.Storage = frame.snapshot(scope.StateDB)
		}
	}
	frame := &l.callstack[len(l.callstack)-1]
	frame.logs = append(frame.logs, log)
	frame.memory.resize(l.cfg.MemoryLimit)
}
```

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContract is the interface for native contracts.
//
// Native contracts are implemented in Go and are assigned specific addresses on the
// blockchain. These contracts can be called from the EVM like any other contract,
// but their execution logic is handled by the Go runtime instead of EVM instructions.
type PrecompiledContract interface {
	// RequiredGas calculates the gas required for executing the precompiled contract.
	RequiredGas(input []byte) uint64

	// Run executes the precompiled contract and returns the output and an error if any.
	//
	// Note: The returned error will be a EVM revert if it has the `revert()` method.
	Run(input []byte) ([]byte, error)
}

// PrecompiledContracts contains the default set of pre-compiled contracts used in the Ethereum VM.
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
// current chain configuration.
func ActivePrecompiledContracts(rules params.Rules) map[common.Address]PrecompiledContract {
	// The istanbul precompiles are continually active after that fork.
	if rules.IsIstanbul {
		return PrecompiledContracts
	}
	// The byzantium precompiles are continually active after that fork.
	if rules.IsByzantium {
		return byzantiumPrecompiles
	}
	// Pre-byzantium precompiles are active on any fork.
	return homesteadPrecompiles
}

// ecrecover implements the ecrecover precompiled contract.
type ecrecover struct{}

// RequiredGas returns the gas required to execute the precompiled contract.
func (c *ecrecover) RequiredGas(input []byte) uint64 {
	return params.EcrecoverGas
}

func (c *ecrecover) Run(input []byte) ([]byte, error) {
	const (
		size = 128
	)
	input = common.RightPadBytes(input, size)

	// "input" is (hash, v, r, s), each 32 bytes
	// but for ecrecover we want (hash, r, s, v)

	r := new(big.Int).SetBytes(input[64:96])
	s := new(big.Int).SetBytes(input[96:128])
	v := input[63] - 27

	// tighter checking allows upper bound check in Ecrecover
	if !crypto.ValidateSignatureValues(v, r, s, false) {
		return nil, nil
	}
	pubkey, err := crypto.Ecrecover(input[:32], append(input[64:128], v))
	//go:nocheckptr
	if err != nil {
		return nil, nil
	}

	return common.LeftPadBytes(crypto.Keccak256(pubkey[1:])[12:], 32), nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// Operation is a type that represents a single operation in the EVM.
type Operation struct {
	// execute is the operation function
	execute executionFunc
	// constantGas is the static gas cost of the operation
	constantGas uint64
	// dynamicGas is the dynamic gas cost of the operation
	dynamicGas dynamicGasFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max stack items required
	maxStack int

	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc
}

// jumpTable contains the EVM opcodes supported at a given fork.
type jumpTable [256]*Operation

// newEVMInstructionSet returns the function to generate an instruction set for a given fork.
func newEVMInstructionSet(config *params.ChainConfig) jumpTable {
	// initiate the jump table with only legacy pay-to-access opcodes.
	jt := jumpTable{
        // ...
		STOP: {
			execute:     opStop,
			constantGas: 0,
			minStack:    0,
			maxStack:    0,
		},
		ADD: {
			execute:     opAdd,
			constantGas: params.GasFastestStep,
			minStack:    2,
			maxStack:    1024,
		},
		// ... other opcodes
    }
    // ... hardfork specific opcode changes
    return jt
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opAdd implements the ADD operation.
func opAdd(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	x, y := stack.pop(), stack.peek()
	y.Add(&y, &x)
	return nil, nil
}

// opSub implements the SUB operation.
func opSub(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	x, y := stack.pop(), stack.peek()
	y.Sub(&y, &x)
	return nil, nil
}

// opMul implements the MUL operation.
func opMul(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	x, y := stack.pop(), stack.peek()
	y.Mul(&y, &x)
	return nil, nil
}

// opSstore implements the SSTORE operation.
func opSstore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	loc := stack.pop()
	val := stack.pop()
	// The gas calculation is a bit complex and needs the use of a special
	// utility function
	err := evm.StateDB.SetState(contract.Address(), loc.Bytes32(), val.Bytes32())
	return nil, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current execution environment
	Context BlockContext

	// StateDB gives access to the underlying state.
	StateDB StateDB

	// depth is the current call stack
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig
	// chainRules contains the chain rules for the current epoch
	chainRules params.Rules
	// vmConfig contains configuration options for the EVM
	vmConfig Config
	// interpreter is the interpreter used to execute the code
	interpreter *Interpreter
	// search is used to search for a contract's code if the code is not provided
	// in the contract object. This is only used in tests.
	search *contractSearch
}

// Config are the configuration options for the EVM
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op code logger
	Tracer Tracer
	// NoBaseFee forces the EIP-1559 base fee to 0 (needed for 0 price calls)
	NoBaseFee bool
	// EnablePreimageRecording switches on SHA3 pre-image recording during execution
	EnablePreimageRecording bool
	// JumpTable contains the EVM instruction table.
	// If this is set to nil, the EVM will use a default jump table.
	JumpTable *[256]OpCode
	// Type of the EWASM interpreter
	EWASMInterpreter string
	// Type of the EVM interpreter
	EVMInterpreter string
	// Hook before and after each instruction
	Hooks *Hooks
	// Precompiled contracts that are active in the EVM
	precompiles vm.PrecompiledContracts
	// Initial authorization list for EIP-7702
	InitialAuthorizations []types.SetCodeAuthorization
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by a single thread.
func NewEVM(blockCtx BlockContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// The following check is actually not a problem. The EIP-1559 implementation has
	// special code to check for this and not subtract gas from the sender, but instead
	// just use the gas that's available.
	// if blockCtx.GasLimit < blockCtx.BaseFee.Uint64() {
	//	 panic(fmt.Sprintf("Gas limit below base fee: %d < %d", blockCtx.GasLimit, blockCtx.BaseFee))
	// }
	var (
		isEcotone = chainConfig.IsEcotone(blockCtx.Time)
	)
	evm := &EVM{
		Context:     blockCtx,
		StateDB:     statedb,
		chainConfig: chainConfig,
		chainRules:  chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time),
		vmConfig:    vmConfig,
	}

	if vmConfig.EVMInterpreter != "" {
		evm.interpreter = NewInterpreter(evm, &vmConfig)
	}
	if isEcotone {
		statedb.SetTxContext(common.Hash{}, -1)
	}
	return evm
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// GasLimitBoundDivisor is the bound divisor of the gas limit, used in header validation.
	GasLimitBoundDivisor uint64 = 1024

	// MinGasLimit is the lowest allowed gas limit to be included in a block.
	MinGasLimit uint64 = 5000

	// GenesisGasLimit is the default gas limit of the Genesis block.
	GenesisGasLimit uint64 = 30_000_000

	// Maximum extra data size in a block header.
	MaximumExtraDataSize uint64 = 32

	// ExpByte gas parameter for the EXP instruction, used in gas calculations.
	ExpByte uint64 = 50

	// SloadGas is the gas consumption of the SLOAD instruction.
	SloadGas uint64 = 200

	// CallValueTransferGas is the gas consumption of a CALL instruction that transfers value.
	CallValueTransferGas uint64 = 9000

	// CallNewAccountGas is the gas consumption of a CALL instruction that creates a new account.
	CallNewAccountGas uint64 = 25000

	// TxGas is the gas consumption of a transaction.
	TxGas uint64 = 21000

	// TxGasContractCreation is the gas consumption of a contract creation transaction.
	TxGasContractCreation uint64 = 53000

	// TxDataZeroGas is the gas consumption of a single zero byte in a transaction's data.
	TxDataZeroGas uint64 = 4

	// TxDataNonZeroGasEIP2028 is the gas consumption of a single non-zero byte in a transaction's
	// data in the Istanbul fork.
	TxDataNonZeroGasEIP2028 uint64 = 16

	// ...
)

// Gas costs for precompiled contracts.
const (
	EcrecoverGas            uint64 = 3000
	Sha256Gas               uint64 = 60
	Sha256WordGas           uint64 = 12
	Ripemd160Gas            uint64 = 600
	Ripemd160WordGas        uint64 = 120
	IdentityGas             uint64 = 15
	IdentityWordGas         uint64 = 3
	ModExpQuadCoeffDiv      uint64 = 20
	Bn256AddGas             uint64 = 150 // Replacing EIP-1108's value of 500
	Bn256ScalarMulGas       uint64 = 6000 // Replacing EIP-1108's value of 40000
	Bn256PairingBaseGas     uint64 = 45000
	Bn256PairingPerPointGas uint64 = 34000
	Blake2FCompressionGas   uint64 = 0
)
```
</file>
</go-ethereum>

---

An excellent and detailed prompt. Go-ethereum's `EVMLogger` interface and the structure of its `JumpTable` and precompiled contracts provide highly relevant context for implementing this extension points system.

The `EVMLogger` acts as a hook system, allowing external components to observe the EVM's execution state at various points, which directly parallels the `HookManager` specification. The way precompiles are registered and opcodes are defined will also be very helpful.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/logger.go">
```go
// EVMLogger is an interface that can be used to debug the EVM.
//
// Implementations of this interface can be used to hook into the EVM and get
// structured logging of everything that happens inside the EVM.
type EVMLogger interface {
	// Execution-start hook
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// Execution-end hook
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// Hooks for individual opcode executions
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// Hooks for sub-scope execution
	CaptureEnter(typ int, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	CaptureExit(output []byte, gasUsed uint64, err error)
}
```
*Correction/Note: The `EVMLogger` in go-ethereum is for observation only and cannot modify execution flow. The requested `HookResult` in your prompt (with `Modify`, `Abort`, etc.) is more powerful and will require a different implementation strategy, but the hook points themselves are analogous.*

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
```go
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm *EVM
	cfg Config

	hasher    crypto.KeccakState // Keccak256 hasher instance for the SHA3 opcode
	hasherBuf common.Hash        // Keccak256 hasher buffer for the SHA3 opcode

	readOnly   bool   // whether to throw on state modifying opcodes
	returnData []byte // last CALL's return data for subsequent reuse
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, no gas is refunded. Here are
// the gotcha's to be aware of:
//
// 1. If the interpreter returns an error, all gas is consumed and the state is reverted.
// 2. It's up to the caller to refund the leftover gas to the caller.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (initialization code omitted for brevity)

	// The logger may be hooked, check on every step
	var (
		op          OpCode
		mem         = NewMemory()
		stack       = newstack()
		callGasTemp = uint64(0)
	)
	// Don't bother with the logger if we're running inside the EVM
	if in.cfg.Logger != nil {
		in.cfg.Logger.CaptureStart(in.evm, contract.caller, contract.Address(), contract.value, input, contract.Gas, contract.value)
	}

	// Main loop dispatching operations.
	for {
		// If the logger is tracing, capture the current state.
		if in.cfg.Logger != nil {
			in.cfg.Logger.CaptureState(pc, op, gas, cost, &ScopeContext{
				Memory:   mem,
				Stack:    stack,
				Contract: contract,
			}, in.returnData, in.evm.depth, err)
		}
		// Get next opcode from the jump table
		op = contract.GetOp(pc)
		operation := in.evm.oplookup[op]
		if operation == nil {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate the stack
		if err = operation.validateStack(stack); err != nil {
			goto Failure
		}
		// Execute the operation
		// ...
		res, err = operation.execute(&pc, in, contract, mem, stack)
		// ...
	}

	// ...

Failure:
	// If the logger is tracing, capture the fault.
	if in.cfg.Logger != nil {
		in.cfg.Logger.CaptureFault(pc, op, gas, cost, &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}, in.evm.depth, err)
	}
	return nil, err
}
```
*This `Run` loop is the heart of the EVM. It shows exactly where to place `PreOpcode` and `PostOpcode` hooks. The `CaptureState` call is the model for a `PreOpcode` hook, and `CaptureFault` can inform error handling in your hooks.*

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/jump_table.go">
```go
// opCode is the internal representation of an EVM opcode.
type opCode struct {
	// execute is the opcode's execution function.
	execute executionFunc
	// gasCost is the gas cost of the opcode.
	gasCost gasFunc
	// minStack tells how many stack items are required.
	minStack int
	// maxStack specifies the max number of items on the stack after execution.
	maxStack int

	// returns indicates whether the opcode returns data to its parent.
	returns bool
	// valid indicates whether the opcode is valid.
	valid bool
	// memorySize computes the amount of memory needed for the operation.
	memorySize memorySizeFunc
}

// newOpCode creates a new opCode with the given arguments.
func newOpCode(execute executionFunc, gasCost gasFunc, minStack, maxStack int, returns bool, memorySize memorySizeFunc) *opCode {
	return &opCode{
		execute:    execute,
		gasCost:    gasCost,
		minStack:   minStack,
		maxStack:   maxStack,
		returns:    returns,
		valid:      true,
		memorySize: memorySize,
	}
}
```
*The `opCode` struct in Geth is an excellent model for your `CustomOpcode` struct. It defines the core properties of an instruction: its execution logic, gas cost function, and stack validation requirements. Your `GasCost` union is a more advanced version of Geth's `gasFunc`.*

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contracts.go">
```go
// PrecompiledContract is the interface for native contracts that are executed by the EVM.
//
// Note, this interface is different from account.Contract in that it represents a
// code snippet that is focused on a single purpose and is not necessarily a general
// purpose contract.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64 // RequiredGas returns the gas required to execute the pre-compiled contract.
	Run(input []byte) ([]byte, error) // Run runs the pre-compiled contract.
}

// PrecompiledContractsCancun contains the default set of pre-compiled contracts used
// in the Istanbul release.
var PrecompiledContractsCancun = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &identity{},
	common.BytesToAddress([]byte{5}): &modExp{},
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
	// EIP-4844: Point evaluation precompile
	common.BytesToAddress([]byte{10}): &pointEvaluation{},
}

// identity implements the Identity precompile contract.
type identity struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
func (c *identity) RequiredGas(input []byte) uint64 {
	return params.IdentityBaseGas + uint64(len(input)+31)/32*params.IdentityPerWordGas
}

// Run runs the pre-compiled contract.
func (c *identity) Run(input []byte) ([]byte, error) {
	return input, nil
}
```
*The `PrecompiledContract` interface is the perfect blueprint for your `CustomPrecompile` system. It defines the two essential methods: one to calculate the gas cost (`RequiredGas`) and one to execute the logic (`Run`). The `PrecompiledContractsCancun` map shows how these contracts are registered at specific addresses, which is exactly what your system needs to do.*

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current execution context
	Context BlockContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// Depth is the current call stack
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules

	// virtual machine configuration options used to constructor the vm
	vmConfig Config

	// interpreter is the contract interpreter
	interpreter *EVMInterpreter

	// readOnly denotes whether the EVM is in read-only simulation mode
	readOnly bool

	// returnData is the returned data from the last call.
	returnData []byte
}

// ScopeContext contains the things that are per-call, such as stack and memory,
// and are shared between instructions in the same call.
type ScopeContext struct {
	// Memory is the memory of the vm
	Memory *Memory
	// Stack is the stack of the vm
	Stack *Stack
	// Contract is the contract being executed
	Contract *Contract
}
```
*This snippet shows the `EVM` struct, which contains the full state context (`StateDB`, `Context`, etc.), and the `ScopeContext`, which contains the per-call state (`Memory`, `Stack`, `Contract`). Your `HookContext` should be designed to provide safe, read-only (or controlled write) access to these components.*

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/stack.go">
```go
// Stack is a last-in-first-out stack for the EVM.
type Stack struct {
	data []*big.Int
	// Note: consider using a slice backed by a larger array for less GC pressure
}

// NewStack returns a new stack with a maximum capacity of 1024
func newstack() *Stack {
	return &Stack{data: make([]*big.Int, 0, 1024)}
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []*big.Int {
	return st.data
}

// Push pushes a new element to the stack.
func (st *Stack) Push(d *big.Int) {
	st.data = append(st.data, d)
}
//... (other stack operations)
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

// Set sets offset to value
func (m *Memory) Set(offset, size uint64, value []byte) {
	// ... (implementation)
}

// Get returns offset + size as a new slice.
func (m *Memory) Get(offset, size int64) (cpy []byte) {
	// ... (implementation)
}

// Resize resizes the memory to size
func (m *Memory) Resize(size uint64) {
	// ... (implementation)
}
// ... (other memory operations)
```
*These final snippets define the core `Stack` and `Memory` data structures that your extension hooks will need to inspect and potentially modify through the `HookContext`.*

</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm      *EVM
	pc       uint64 // program counter
	op       vm.OpCode
	gas      uint64 // available gas
	mem      *vm.Memory
	stack    *vm.Stack
	rstack   *vm.ReturnStack // return stack
	depth    int
	readOnly bool
	err      error

	opFn     func(vm.OpCode) *operation
	gasPool  *core.GasPool
	hooks    *tracing.Hooks
	input    []byte
	jumpdests vm.JumpdestSet
	analysis  vm.CodeAnalysis
}

// ...

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
func (in *EVMInterpreter) Run(contract *vm.Contract, input []byte, readOnly bool) (ret []byte, err error) {
	//...
	in.readOnly = readOnly

	// The Interpreter main run loop
	for {
		// The in.hooks can be installed on the EVM and used to trace execution.
		// The OnOpcode hook is called for each opcode. If any of the hooks return
		// an error, the EVM will be aborted.
		if in.hooks != nil {
			if err := in.hooks.OnOpcode(in.pc, op, in.gas, operation.cost, in, in.returnData); err != nil {
				return nil, err
			}
		}
		// Execute the operation.
		err = operation.execute(&in.pc, in, contract)
		// if the operation clears the return data, do it
		if operation.clearsReturnData {
			in.returnData.Reset()
		}
		// update PC if not modified by the operation
		if err == nil && !operation.jumps {
			in.pc++
		}
		if err != nil {
			return nil, err
		}
	}
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/hooks.go">
```go
// Hooks are the hooks that can be installed on the EVM.
//
// Every method is called on each step of the EVM, except for OnTxStart and
// OnTxEnd, which are called before and after the transaction, respectively.
// If any of the methods return an error, the EVM will be aborted.
type Hooks struct {
	// OnTxStart is called before the transaction is executed.
	OnTxStart func(env *VMContext, tx *types.Transaction, from common.Address)
	// OnTxEnd is called after the transaction has been executed. The receipt and error are available.
	OnTxEnd func(receipt *types.Receipt, err error)
	// OnEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	OnEnter func(depth int, typ byte, from, to common.Address, input []byte, gas uint64, value *big.Int)
	// OnExit is called when the EVM exits a scope.
	OnExit func(depth int, output []byte, gasUsed uint64, err error, reverted bool)
	// OnOpcode is called for each opcode.
	OnOpcode func(pc uint64, op byte, gas, cost uint64, scope OpContext, rData []byte, depth int, err error)
	// OnFault is called when the EVM returns an error.
	OnFault func(pc uint64, op byte, gas, cost uint64, scope OpContext, depth int, err error)
	// OnGasChange is called whenever the gas changes.
	OnGasChange func(old, new uint64, reason GasChangeReason)
	// OnBlockchainInit is called when the blockchain is initialized.
	OnBlockchainInit func(chainConfig *params.ChainConfig)
	// OnBlockStart is called when the EVM starts processing a block.
	OnBlockStart func(ev BlockEvent)
	// OnBlockEnd is called when the EVM has finished processing a block.
	OnBlockEnd func(err error)
	// OnSkippedBlock is called for each block that is not processed by the EVM.
	OnSkippedBlock func(ev BlockEvent)
	// OnGenesisBlock is called when the genesis block is processed.
	OnGenesisBlock func(b *types.Block, alloc types.GenesisAlloc)
	// OnBalanceChange is called when the balance of an account changes.
	OnBalanceChange func(a common.Address, prev, new *big.Int, reason BalanceChangeReason)
	// OnNonceChange is called when the nonce of an account changes.
	OnNonceChange func(a common.Address, prev, new uint64)
	// OnCodeChange is called when the code of an account changes.
	OnCodeChange func(a common.Address, prevCodeHash common.Hash, prev []byte, codeHash common.Hash, code []byte)
	// OnStorageChange is called when the storage of an account changes.
	OnStorageChange func(a common.Address, slot, prev, new common.Hash)
	// OnLog is called when a log is emitted.
	OnLog func(log *types.Log)
	// OnBlockHashRead is called when the EVM reads the hash of a block.
	OnBlockHashRead func(number uint64, hash common.Hash)
	// OnClose is called when the EVM's database is closed.
	OnClose func()
}

// OpContext provides read-only access to the execution state of the EVM at a given
// time.
type OpContext interface {
	// PC returns the program counter.
	PC() uint64
	// Opcode returns the opcode.
	Opcode() vm.OpCode
	// StackData returns the stack data.
	StackData() []uint256.Int
	// MemoryData returns the memory data.
	MemoryData() []byte
	// Address returns the contract address.
	Address() common.Address
	// Caller returns the caller address.
	Caller() common.Address
	// CallValue returns the value of the call.
	CallValue() *uint256.Int
	// CallInput returns the input of the call.
	CallInput() []byte
}

// VMContext provides read-only access to the VMEvnv of the EVM at a given time.
type VMContext struct {
	StateDB    StateDB
	BlockNumber *big.Int
	Time        uint64
	Difficulty  *big.Int
	BaseFee     *big.Int
	Random      *common.Hash
	Coinbase    common.Address
	GasLimit    uint64
	CanTransfer func(StateDB, common.Address, *big.Int) bool
	Transfer    func(StateDB, common.Address, common.Address, *big.Int)
	GetHash     func(uint64) common.Hash
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContract is the interface for native contracts.
//
// Implementations will be removed in favour of using vm.PrecompiledContract,
// which is a superset of this interface.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64
	Run(input []byte) ([]byte, error)
}

// PrecompiledContracts is a map of addresses to their implementations.
var PrecompiledContracts = map[common.Address]PrecompiledContract{
	common.BytesToAddress([]byte{1}): &ecrecover{},
	common.BytesToAddress([]byte{2}): &sha256hash{},
	common.BytesToAddress([]byte{3}): &ripemd160hash{},
	common.BytesToAddress([]byte{4}): &dataCopy{},
}

// PrecompiledContractsHomestead contains the default set of pre-compiled contracts used
// in the Homestead release.
var PrecompiledContractsHomestead = PrecompiledContracts

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
	common.BytesToAddress([]byte{6}): &bn256Add{},
	common.BytesToAddress([]byte{7}): &bn256ScalarMul{},
	common.BytesToAddress([]byte{8}): &bn256Pairing{},
	common.BytesToAddress([]byte{9}): &blake2F{},
}

// PrecompiledContractsCancun contains the precompiled contracts after the Cancun fork.
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
	common.BytesToAddress([]byte{10}): &bls12381PointEvaluation{},
}

// ActivePrecompiles returns the precompiled contracts for the given chain configuration.
func ActivePrecompiles(rules *params.Rules) []common.Address {
	// TODO: This can be implemented more nicely as a single map-copy and delete.
	// But that requires https://github.com/golang/go/issues/51522
	precompiles := make([]common.Address, 0, len(PrecompiledContractsCancun))
	switch {
	case rules.IsCancun:
		for addr := range PrecompiledContractsCancun {
			precompiles = append(precompiles, addr)
		}
	case rules.IsIstanbul:
		for addr := range PrecompiledContractsIstanbul {
			precompiles = append(precompiles, addr)
		}
	case rules.IsByzantium:
		for addr := range PrecompiledContractsByzantium {
			precompiles = append(precompiles, addr)
		}
	default:
		for addr := range PrecompiledContractsHomestead {
			precompiles = append(precompiles, addr)
		}
	}
	sort.Slice(precompiles, func(i, j int) bool {
		return bytes.Compare(precompiles[i][:], precompiles[j][:]) < 0
	})
	return precompiles
}

// runPrecompiledContract runs the given pre-compiled contract.
func runPrecompiledContract(p PrecompiledContract, input []byte, gas uint64) (ret []byte, remainingGas uint64, err error) {
	start := time.Now()
	if metrics.Enabled() {
		defer func() {
			precompiledTimers[p.String()].Update(time.Since(start))
		}()
	}
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
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack_table.go">
```go
// operation is the low level representation of a single opcode.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// gasCost is the static gas cost of the operation
	constantGas uint64
	// dynamicGas is the dynamic gas cost of the operation
	dynamicGas gasFunc
	// minStack specifies the minimum number of stack items required
	minStack int
	// maxStack specifies the maximum number of stack items allowed
	maxStack int
	// rstack returns the number of items that are popped from stack and pushed to return stack
	rstack int
	// minRStack specifies the minimum number of return stack items required
	minRStack int
	// maxRStack specifies the maximum number of return stack items allowed
	maxRStack int

	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc

	// These fields are provided by the compiler, and are used by the
	// tracer.
	halts            bool // indicates whether the operation should halt execution
	jumps            bool // indicates whether the program counter should be updated
	writes           bool // indicates whether this op writes to memory
	reverts          bool // indicates whether the operation reverts state (e.g. REVERT)
	returns          bool // indicates whether the operation sets the return data
	clearsReturnData bool // indicates whether the operation clears the return data
}

// JumpTable is the EVM execution main loop table.
type JumpTable [256]operation
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
// opCodeArray is the collection of all defined op-codes, this is used by the
// disassembler and for debugging tracing.
var opCodeArray [256]*operation

// opCodeSizes contains the size of the immediate data for each opcode.
var opCodeSizes [256]int

// opCodeNonces contains the number of values an opcode adds to the stack.
var opCodeNonces [256]uint8

func init() {
	opCodeArray[STOP] = &operation{
		execute:     opStop,
		constantGas: GasStop,
		minStack:    minStack(0, 0),
		maxStack:    maxStack(0, 0),
		halts:       true,
		name:        "STOP",
	}
	opCodeArray[ADD] = &operation{
		execute:     opAdd,
		constantGas: GasFastestStep,
		minStack:    minStack(2, 1),
		maxStack:    maxStack(2, 1),
		name:        "ADD",
	}
    // ... and so on for all opcodes
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/api.go">
```go
// TraceConfig holds extra parameters to trace functions.
type TraceConfig struct {
	*logger.Config
	Tracer  *string
	Timeout *string
	Reexec  *uint64
	// Config specific to given tracer. Note struct logger
	// config are historically embedded in main object.
	TracerConfig json.RawMessage
}

// ...

// traceTx configures a new tracer according to the provided configuration, and
// executes the given message in the provided environment. The return value will
// be tracer dependent.
func (api *API) traceTx(ctx context.Context, tx *types.Transaction, message *core.Message, txctx *Context, vmctx vm.BlockContext, statedb *state.StateDB, config *TraceConfig, precompiles vm.PrecompiledContracts) (interface{}, error) {
	var (
		tracer  *Tracer
		err     error
		timeout = defaultTraceTimeout
		usedGas uint64
	)
	if config == nil {
		config = &TraceConfig{}
	}
	// Default tracer is the struct logger
	if config.Tracer == nil {
		logger := logger.NewStructLogger(config.Config)
		tracer = &Tracer{
			Hooks:     logger.Hooks(),
			GetResult: logger.GetResult,
			Stop:      logger.Stop,
		}
	} else {
		tracer, err = DefaultDirectory.New(*config.Tracer, txctx, config.TracerConfig, api.backend.ChainConfig())
		if err != nil {
			return nil, err
		}
	}
	// ... execution logic ...
	return tracer.GetResult()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/dir.go">
```go
// DefaultDirectory is the collection of tracers bundled by default.
var DefaultDirectory = directory{elems: make(map[string]elem)}

// directory provides functionality to lookup a tracer by name
// and a function to instantiate it. It falls back to a JS code evaluator
// if no tracer of the given name exists.
type directory struct {
	elems  map[string]elem
	jsEval jsCtorFn
}

// Register registers a method as a lookup for tracers, meaning that
// users can invoke a named tracer through that lookup.
func (d *directory) Register(name string, f ctorFn, isJS bool) {
	d.elems[name] = elem{ctor: f, isJS: isJS}
}

// New returns a new instance of a tracer, by iterating through the
// registered lookups. Name is either name of an existing tracer
// or an arbitrary JS code.
func (d *directory) New(name string, ctx *Context, cfg json.RawMessage, chainConfig *params.ChainConfig) (*Tracer, error) {
	if len(cfg) == 0 {
		cfg = json.RawMessage("{}")
	}
	if elem, ok := d.elems[name]; ok {
		return elem.ctor(ctx, cfg, chainConfig)
	}
	// Assume JS code
	return d.jsEval(name, ctx, cfg, chainConfig)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// StructLogger is an EVM state logger and implements EVMLogger.
//
// StructLogger can capture state based on the given Log configuration and also keeps
// a track record of modified storage which is used in reporting snapshots of the
// contract their storage.
//
// A StructLogger can either yield it's output immediately (streaming) or store for
// later output.
type StructLogger struct {
	cfg Config
	env *tracing.VMContext

	storage map[common.Address]Storage
	output  []byte
	err     error
	usedGas uint64

	writer     io.Writer         // If set, the logger will stream instead of store logs
	logs       []json.RawMessage // buffer of json-encoded logs
	resultSize int

	interrupt atomic.Bool // Atomic flag to signal execution interruption
	reason    error       // Textual reason for the interruption
	skip      bool        // skip processing hooks.
}


// OnOpcode logs a new structured log message and pushes it out to the environment
//
// OnOpcode also tracks SLOAD/SSTORE ops to track storage change.
func (l *StructLogger) OnOpcode(pc uint64, opcode byte, gas, cost uint64, scope tracing.OpContext, rData []byte, depth int, err error) {
	// ... (implementation to capture stack, memory, etc.)
	var (
		op           = vm.OpCode(opcode)
		memory       = scope.MemoryData()
		contractAddr = scope.Address()
		stack        = scope.StackData()
		stackLen     = len(stack)
	)
	log := StructLog{pc, op, gas, cost, nil, len(memory), nil, nil, nil, depth, l.env.StateDB.GetRefund(), err}

    // ...

	// capture SLOAD opcodes and record the read entry in the local storage
	if op == vm.SLOAD && stackLen >= 1 {
		var (
			address = common.Hash(stack[stackLen-1].Bytes32())
			value   = l.env.StateDB.GetState(contractAddr, address)
		)
		l.storage[contractAddr][address] = value
		storage = maps.Clone(l.storage[contractAddr])
	}
    // ...
}
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt provides a very detailed and well-thought-out specification for an extension system in Zig. While comprehensive, it might be slightly over-engineered for an initial implementation. The go-ethereum codebase offers a more battle-tested, albeit simpler, model for some of these features.

Here are a few suggestions based on go-ethereum's design:

1.  **Simplify the Hook System**: Instead of a complex `HookManager` with various `HookResult` types (`Modify`, `Replace`), consider adopting go-ethereum's simpler `Tracer/Hooks` model.
    *   In Geth, hooks are for *observation*, not *modification*. They receive a read-only context (`OpContext`) and can log data or signal an error to halt execution. They cannot directly modify the stack, memory, or gas.
    *   This "read-only" approach to hooks dramatically simplifies the core EVM logic, as the main execution loop doesn't need to handle complex state modifications originating from extensions. It enhances security and predictability.
    *   Modification capabilities can still be achieved through custom opcodes and precompiles, which are more explicit extension points for altering state.

2.  **Model Custom Opcodes on Geth's `JumpTable`**:
    *   The prompt's `CustomOpcode` struct is excellent. The way Geth builds its `JumpTable` for different hardforks is a perfect real-world parallel. Instead of a runtime `register_extension` for opcodes, consider a compile-time or startup-time configuration that builds a single, immutable `JumpTable` for the VM's lifetime, similar to Geth. This is more performant and avoids complexities with runtime opcode changes.
    *   The `operation` struct in `go-ethereum/core/vm/opcodes.go` is a great reference for the metadata an opcode needs (gas cost, stack requirements, etc.).

3.  **Model Custom Precompiles on Geth's `PrecompiledContract`**:
    *   The prompt's `CustomPrecompile` is very similar to Geth's `PrecompiledContract` interface. Geth's model of a simple map from `address -> implementation` that can be switched out based on hardfork rules is a robust and simple pattern to follow.

4.  **Refine the `ExtensionManager` and `Registry`**:
    *   The concept of a central `ExtensionManager` is good. Geth has a similar pattern with its `eth/tracers/api.go` and `eth/tracers/dir.go` files, which act as a factory and registry for different "tracer" plugins. This is a lighter-weight model than a full-blown plugin system and might be a good starting point. It uses a simple string name to look up and instantiate the correct tracer (extension).

By focusing on these battle-tested patterns from `go-ethereum`, the initial implementation can be simpler, more secure, and more aligned with established EVM architecture, while still providing powerful extension capabilities. The more complex features like runtime plugin loading and hot-reloading can be added later on top of this solid foundation.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/logger.go">
```go
// EVMLogger is an interface that can be used to debug the EVM.
//
// Implementations of this interface can be used to hook into the EVM and expose
// granular information about its execution. This can be used for debugging,
// tracing, and analysis purposes.
//
// The EVMLogger interface provides a wide range of hooks that are called at
// different points in the EVM's execution cycle. These hooks allow you to
// capture information about the stack, memory, storage, and other aspects of
// the EVM's state.
//
// The EVMLogger is a powerful tool for understanding and debugging the EVM.
// However, it is important to use it carefully, as it can have a significant
// performance impact on the EVM.
type EVMLogger interface {
	// CaptureStart is called when the EVM starts executing a new transaction.
	// It is called once per transaction.
	//
	// Note that this is not called for calls or creates within a transaction.
	// For that, see CaptureEnter.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureEnd is called when the EVM finishes executing a transaction.
	// It is called once per transaction.
	//
	// Note that this is not called for calls or creates within a transaction.
	// For that, see CaptureExit.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureEnter is called when the EVM enters a new frame, either through a
	// call or a create.
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits a frame, either through a return
	// or a revert.
	CaptureExit(output []byte, gasUsed uint64, err error)

	// CaptureState is called before each opcode is executed.
	// It is called on the same level as the opcode is executed.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an
	// opcode.
	// It is called on the same level as the failing opcode.
	//
	// Note that this is not called for returns and reverts.
	// For that, see CaptureExit.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
}

// StructLogger is an EVMLogger that captures execution steps and converts them to
// a JSON object.
//
// The struct logger is a powerful tool for tracing and debugging the EVM. It can
// be used to generate detailed traces of EVM execution, which can be used to
// analyze performance, identify bugs, and understand the behavior of smart
// contracts.
//
// The struct logger is also highly configurable. It can be configured to capture
// only the information that is relevant to your needs. This can be useful for
// reducing the size of the trace and for improving performance.
type StructLogger struct {
	cfg StructLogConfig

	logs          []StructLog
	changed       map[common.Address]struct{}
	gas           uint64
	err           error
	output        []byte
	storage       map[common.Hash]common.Hash
	loggedStorage map[common.Hash]map[common.Hash]struct{}
	mu            sync.Mutex // mu protects the shared fields
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
```go
// run runs the EVM code with the given input and returns the trailing output
// data, the amount of gas leftover, and any eventual error.
//
// It's important to note that due to EIP-150, the returned gas is not Refunds +
// gasUsed. It is the amount of gas left in the current context, and this is
// what should be Refunds when the context ends.
func (in *Interpreter) run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
...
	// The Interpreter main run loop. Note that contract.code contains run-time code not init code.
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallcontext(in.evm, contract, input, stack)
		// For tracing
		pcout  = uint64(0)
		pc     = uint64(0)
		cost   = uint64(0)
		logged = false
	)
...
	for {
		// Dump stack and memory to the logger if enabled
		if cfg.Tracer != nil && !logged {
			cfg.Tracer.CaptureState(pc, op, gas, cost, callContext, in.returnData, in.evm.depth, err)
			logged = true
		}
...
		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.opFncs[op]
		if operation == nil {
			err = &ErrInvalidOpcode{opcode: op}
			break
		}
...
		// Static calls can't write to state
		if readOnly && in.readOnly && operation.writes {
			err = ErrWriteProtection
			break
		}
...
		// Execute the operation
		ret, err = operation.execute(&pc, in, callContext)
...
	}
...
	if err != nil {
		log.Trace("EVM fault", "err", err)
		// Consider the captured state of the interpreter as a fault.
		// The error will be propagated outwards and eventually be returned
		// by the initial call.
		if cfg.Tracer != nil {
			cfg.Tracer.CaptureFault(pc, op, gas, cost, callContext, in.evm.depth, err)
		}
	}
	return ret, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contracts.go">
```go
// PrecompiledContract is the interface for a native contract.
//
// A precompiled contract is a contract that is implemented in Go rather than
// in EVM bytecode. Precompiled contracts can be used to implement complex
// cryptographic operations that would be too expensive to implement in EVM
// bytecode.
//
// The precompiled contract interface is simple. It takes a byte slice as
// input and returns a byte slice as output. The contract is responsible for
// parsing the input and generating the output.
type PrecompiledContract interface {
	// RequiredGas calculates the gas required for the operation.
	//
	// The gas cost is calculated as a base cost plus a variable cost that
	// depends on the input.
	RequiredGas(input []byte) uint64

	// Run runs the precompiled contract.
	Run(input []byte) ([]byte, error)
}
...
// PrecompiledContractsBerlin contains the precompiled contracts starting from the
// Berlin hard fork.
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
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/jumptable.go">
```go
// JumpTable is a lookup table for each opcode.
type JumpTable [256]*operation

// operation is the low-level representation of a single opcode.
//
// The operation struct is a simple struct that contains the following
// information about an opcode:
//
// - execute: a function that executes the opcode
// - gasCost: the gas cost of the opcode
// - validateStack: a function that validates the stack for the opcode
// - memorySize: a function that calculates the memory size for the opcode
// - writes: a boolean that indicates whether the opcode writes to state
// - valid: a boolean that indicates whether the opcode is valid
// - constant: a boolean that indicates whether the opcode is a constant
type operation struct {
	// execute is the operation function
	execute executionFunc
	// gasCost is the gas function for the operation
	gasCost gasFunc
	// validateStack is the stack validation function
	validateStack stackValidateFunc
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc

	// writes tracks whether the operation writes to state.
	writes bool
	// valid indicates whether the opcode is valid.
	valid bool
	// constant indicates whether the opcode is a constant.
	constant bool
}

// newFrontierInstructionSet returns the frontier instruction set.
func newFrontierInstructionSet() JumpTable {
	// Note: We use the Frontier instruction set as a template and implement
	// the newer hardforks on top of it.
	return JumpTable{
		PUSH1: {
			execute:       opPush1,
			gasCost:       constGasFunc(GasFastestStep),
			validateStack: makeStackFunc(0, 1),
			constant:      true,
		},
		ADD: {
			execute:       opAdd,
			gasCost:       constGasFunc(GasFastestStep),
			validateStack: makeStackFunc(2, 1),
		},
...
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// Config are the configuration options for the EVM.
type Config struct {
	// Debug enables debugging Interpreter options.
	Debug bool
	// Tracer is the op code logger
	Tracer EVMLogger
	// NoBaseFee disables charging of base fee.
	NoBaseFee bool
	// EnablePreimageRecording switches on SHA3 pre-image recording.
	EnablePreimageRecording bool
	// JumpTable contains the EVM instruction table. If nil, the EVM will use
	// the instruction set of the current hard fork.
	JumpTable *JumpTable
	// ExternalLogic is an interface that provides miscellaneous external logic
	// for the EVM.
	ExternalLogic ExternalLogic
	// Witness is an optional witness for stateless execution.
	Witness *stateless.Witness
}

// EVM is the Ethereum Virtual Machine base object for the required
// information to run operations. It's the receiver of all the EVM state operations.
type EVM struct {
	// Config includes logging and debugging options.
	Config
	// ChainConfig contains information about the current chain.
	ChainConfig *params.ChainConfig
	// BlockContext provides information about the current block.
	BlockContext
	// StateDB gives access to the underlying state.
	StateDB state.StateDB

	// depth is the current call stack
	depth int

	// execution logic
	interpreter *Interpreter
	precompiles map[common.Address]PrecompiledContract
}

// NewEVM creates a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(blockCtx BlockContext, statedb state.StateDB, chainConfig *params.ChainConfig, evmConfig Config) *EVM {
	evm := &EVM{
		BlockContext: blockCtx,
		StateDB:      statedb,
		ChainConfig:  chainConfig,
		Config:       evmConfig,
	}
	// If a jump table was provided, that will be used. Otherwise, the current
	// hard fork is used to determine the set of instructions.
	jumpTable := evmConfig.JumpTable
	if jumpTable == nil {
		switch {
		case chainConfig.IsCancun(blockCtx.Number, blockCtx.Time):
			jumpTable = cancunInstructionSet
		case chainConfig.IsShanghai(blockCtx.Number, blockCtx.Time):
			jumpTable = shanghaiInstructionSet
...
		default:
			jumpTable = frontierInstructionSet
		}
	}
	evm.interpreter = NewInterpreter(evm, evmConfig, jumpTable)

	// In addition to the instruction set, the precompiled contracts are also
	// versioned depending on the hard fork.
	switch {
	case chainConfig.IsCancun(blockCtx.Number, blockCtx.Time):
		evm.precompiles = PrecompiledContractsCancun
	case chainConfig.IsShanghai(blockCtx.Number, blockCtx.Time):
		evm.precompiles = PrecompiledContractsShanghai
...
	default:
		evm.precompiles = PrecompiledContractsHomestead
	}
	return evm
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/console/bridge.go">
```go
// bridge is a collection of JavaScript utility methods to bride the .js runtime
// environment and the Go RPC connection backing the remote method calls.
type bridge struct {
	client   *rpc.Client         // RPC client to execute Ethereum requests through
	prompter prompt.UserPrompter // Input prompter to allow interactive user feedback
	printer  io.Writer           // Output writer to serialize any display strings to
}

// newBridge creates a new JavaScript wrapper around an RPC client.
func newBridge(client *rpc.Client, prompter prompt.UserPrompter, printer io.Writer) *bridge {
	return &bridge{
		client:   client,
		prompter: prompter,
		printer:  printer,
	}
}

// ... other methods ...

type jsonrpcCall struct {
	ID     int64
	Method string
	Params []interface{}
}

// Send implements the web3 provider "send" method. This is a good example of how
// a "plugin" (the JS environment) can call back into the host application (Go)
// to perform actions.
func (b *bridge) Send(call jsre.Call) (goja.Value, error) {
	// Remarshal the request into a Go value.
	reqVal, err := call.Argument(0).ToObject(call.VM).MarshalJSON()
	if err != nil {
		return nil, err
	}

	var (
		rawReq = string(reqVal)
		dec    = json.NewDecoder(strings.NewReader(rawReq))
		reqs   []jsonrpcCall
		batch  bool
	)
...
	if rawReq[0] == '[' {
		batch = true
		dec.Decode(&reqs)
	} else {
		batch = false
		reqs = make([]jsonrpcCall, 1)
		dec.Decode(&reqs[0])
	}

	// Execute the requests.
	var resps []*goja.Object
	for _, req := range reqs {
		resp := call.VM.NewObject()
...
		var result json.RawMessage
		// **This is the core interaction**: the bridge calls the RPC client, which
		// is part of the host Go application.
		if err = b.client.Call(&result, req.Method, req.Params...); err == nil {
			if result == nil {
...
			} else {
				// The result from the Go application is marshalled back into a
				// JavaScript object for the "plugin" to use.
				JSON := call.VM.Get("JSON").ToObject(call.VM)
				parse, callable := goja.AssertFunction(JSON.Get("parse"))
				if !callable {
					return nil, errors.New("JSON.parse is not a function")
				}
				resultVal, err := parse(goja.Null(), call.VM.ToValue(string(result)))
...
				resp.Set("result", resultVal)
			}
		}
...
		resps = append(resps, resp)
	}
...
	return result, nil
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt provides a very detailed and well-structured set of requirements for an EVM extension system. It's an excellent starting point. The main correction or point of clarification is regarding the "Plugin Loader".

The prompt specifies a system for dynamically loading extensions from shared libraries (`.so`, `.dll`). While this is a common pattern in general software engineering, it's not a pattern that `go-ethereum` uses for *low-level EVM extensions* like custom opcodes or precompiles.

- **Geth's Approach**: In `go-ethereum`, new opcodes and precompiles are added at compile-time by modifying the Go source code (specifically `core/vm/jumptable.go` and `core/vm/contracts.go`). This ensures performance and type safety.
- **Analogy**: The closest analogy in `go-ethereum` to a "plugin" system is the JavaScript console (`console/`). It dynamically exposes Go functions (APIs) to an external scripting environment. The provided `console/bridge.go` snippet demonstrates this "API bridging" pattern, which is a highly relevant model for how a loaded plugin would need to interact with the core EVM.

**Recommendation**: When implementing the `PluginLoader`, consider the `go-ethereum` console architecture as a reference for how to safely expose a limited, well-defined API to the dynamically loaded code, rather than attempting to directly modify the EVM's core `JumpTable` at runtime, which can be complex and unsafe. The provided snippets for the `EVMLogger` (hooks), `JumpTable` (custom opcodes), and `PrecompiledContract` (precompiles) show the more conventional, compile-time extension patterns used in production EVM implementations.

