# Implement Interpreter Action System

You are implementing Interpreter Action System for the Tevm EVM written in Zig. Your goal is to implement a modular action system for EVM interpreter operations following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_interpreter_action_system` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_interpreter_action_system feat_implement_interpreter_action_system`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a comprehensive interpreter action system that provides structured handling for calls and creates with built-in validation, optimization, and extensibility. This system enables clean separation of action logic, automatic validation, performance optimization, and easy addition of new action types while maintaining type safety and performance.

## ELI5

Think of the interpreter action system as a sophisticated restaurant with specialized stations - instead of one chef doing everything, you have a pastry chef, a grill chef, a salad chef, etc. In the EVM, different operations (calling other contracts, creating new contracts, reading storage) are like different types of orders that need specialized handling. The enhanced action system is like upgrading from a basic kitchen to a high-end restaurant operation: you get quality control inspectors who check every order before it goes out (validation), efficiency experts who optimize workflows (optimization), and a management system that can easily add new types of cuisine (extensibility). Each "chef" (action handler) is an expert at their specific task, there are safety protocols to prevent mistakes, and the system can automatically route orders to the right specialist while tracking performance metrics to improve service over time.

## Interpreter Action System Specifications

### Core Action Framework

#### 1. Action Manager
```zig
pub const ActionManager = struct {
    allocator: std.mem.Allocator,
    config: ActionConfig,
    action_registry: ActionRegistry,
    validation_engine: ValidationEngine,
    optimization_engine: OptimizationEngine,
    performance_tracker: ActionPerformanceTracker,
    
    pub const ActionConfig = struct {
        enable_action_validation: bool,
        enable_action_optimization: bool,
        enable_action_tracing: bool,
        max_action_depth: u32,
        validation_level: ValidationLevel,
        optimization_level: OptimizationLevel,
        action_cache_size: u32,
        
        pub const ValidationLevel = enum {
            None,           // No validation
            Basic,          // Basic type and parameter validation
            Strict,         // Full validation with gas checks
            Paranoid,       // Maximum validation with security checks
        };
        
        pub const OptimizationLevel = enum {
            None,           // No optimizations
            Basic,          // Basic optimizations
            Aggressive,     // Aggressive optimizations
            Experimental,   // Experimental optimizations
        };
        
        pub fn production() ActionConfig {
            return ActionConfig{
                .enable_action_validation = true,
                .enable_action_optimization = true,
                .enable_action_tracing = false,
                .max_action_depth = 1024,
                .validation_level = .Strict,
                .optimization_level = .Aggressive,
                .action_cache_size = 1000,
            };
        }
        
        pub fn development() ActionConfig {
            return ActionConfig{
                .enable_action_validation = true,
                .enable_action_optimization = false,
                .enable_action_tracing = true,
                .max_action_depth = 512,
                .validation_level = .Strict,
                .optimization_level = .Basic,
                .action_cache_size = 100,
            };
        }
        
        pub fn testing() ActionConfig {
            return ActionConfig{
                .enable_action_validation = true,
                .enable_action_optimization = false,
                .enable_action_tracing = true,
                .max_action_depth = 64,
                .validation_level = .Paranoid,
                .optimization_level = .None,
                .action_cache_size = 10,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: ActionConfig) !ActionManager {
        return ActionManager{
            .allocator = allocator,
            .config = config,
            .action_registry = try ActionRegistry.init(allocator),
            .validation_engine = try ValidationEngine.init(allocator, config.validation_level),
            .optimization_engine = try OptimizationEngine.init(allocator, config.optimization_level),
            .performance_tracker = ActionPerformanceTracker.init(),
        };
    }
    
    pub fn deinit(self: *ActionManager) void {
        self.action_registry.deinit();
        self.validation_engine.deinit();
        self.optimization_engine.deinit();
    }
    
    pub fn execute_action(
        self: *ActionManager,
        action_type: ActionType,
        context: *ExecutionContext,
        parameters: ActionParameters
    ) !ActionResult {
        const start_time = std.time.nanoTimestamp();
        
        // Get action handler
        const handler = self.action_registry.get_handler(action_type) orelse {
            return error.UnknownActionType;
        };
        
        // Create action instance
        var action = try Action.init(
            self.allocator,
            action_type,
            context,
            parameters,
            self.config
        );
        defer action.deinit();
        
        // Validate action if enabled
        if (self.config.enable_action_validation) {
            try self.validation_engine.validate_action(&action);
        }
        
        // Apply optimizations if enabled
        if (self.config.enable_action_optimization) {
            try self.optimization_engine.optimize_action(&action);
        }
        
        // Execute action
        const result = try handler.execute(&action, context);
        
        // Record performance metrics
        const execution_time = std.time.nanoTimestamp() - start_time;
        self.performance_tracker.record_action_execution(
            action_type,
            execution_time,
            result.gas_used,
            result.success
        );
        
        return result;
    }
    
    pub fn register_action_handler(
        self: *ActionManager,
        action_type: ActionType,
        handler: ActionHandler
    ) !void {
        try self.action_registry.register_handler(action_type, handler);
    }
    
    pub fn batch_execute_actions(
        self: *ActionManager,
        actions: []const ActionRequest,
        context: *ExecutionContext
    ) ![]ActionResult {
        var results = try self.allocator.alloc(ActionResult, actions.len);
        errdefer self.allocator.free(results);
        
        for (actions, 0..) |action_request, i| {
            results[i] = try self.execute_action(
                action_request.action_type,
                context,
                action_request.parameters
            );
            
            // Stop on first failure unless configured otherwise
            if (!results[i].success and !self.config.continue_on_failure) {
                // Free successful results
                for (results[0..i]) |*result| {
                    result.deinit();
                }
                self.allocator.free(results);
                return error.BatchExecutionFailed;
            }
        }
        
        return results;
    }
    
    pub fn get_action_statistics(self: *const ActionManager) ActionStatistics {
        return self.performance_tracker.get_statistics();
    }
    
    pub const ActionRequest = struct {
        action_type: ActionType,
        parameters: ActionParameters,
        priority: ActionPriority,
        
        pub const ActionPriority = enum {
            Low,
            Normal,
            High,
            Critical,
        };
    };
};
```

#### 2. Action Type System
```zig
pub const ActionType = enum {
    // Call actions
    Call,
    StaticCall,
    DelegateCall,
    CallCode,
    
    // Create actions
    Create,
    Create2,
    
    // System actions
    SelfDestruct,
    Log,
    Revert,
    Return,
    
    // State actions
    LoadAccount,
    StoreAccount,
    LoadStorage,
    StoreStorage,
    
    // Custom actions
    Custom,
    
    pub fn is_call_action(self: ActionType) bool {
        return switch (self) {
            .Call, .StaticCall, .DelegateCall, .CallCode => true,
            else => false,
        };
    }
    
    pub fn is_create_action(self: ActionType) bool {
        return switch (self) {
            .Create, .Create2 => true,
            else => false,
        };
    }
    
    pub fn is_state_modifying(self: ActionType) bool {
        return switch (self) {
            .Call, .Create, .Create2, .SelfDestruct, .StoreAccount, .StoreStorage => true,
            .StaticCall, .DelegateCall, .CallCode, .LoadAccount, .LoadStorage => false,
            .Log, .Revert, .Return => false,
            .Custom => true, // Conservative assumption
        };
    }
    
    pub fn requires_gas(self: ActionType) bool {
        return switch (self) {
            .Call, .StaticCall, .DelegateCall, .CallCode, .Create, .Create2 => true,
            .SelfDestruct, .Log => true,
            .LoadAccount, .StoreAccount, .LoadStorage, .StoreStorage => false,
            .Revert, .Return => false,
            .Custom => true,
        };
    }
    
    pub fn get_base_gas_cost(self: ActionType) u64 {
        return switch (self) {
            .Call => 700,
            .StaticCall => 700,
            .DelegateCall => 700,
            .CallCode => 700,
            .Create => 32000,
            .Create2 => 32000,
            .SelfDestruct => 5000,
            .Log => 375,
            .LoadAccount => 2600,
            .StoreAccount => 20000,
            .LoadStorage => 2100,
            .StoreStorage => 20000,
            .Revert, .Return => 0,
            .Custom => 100,
        };
    }
};

pub const Action = struct {
    allocator: std.mem.Allocator,
    action_type: ActionType,
    context: *ExecutionContext,
    parameters: ActionParameters,
    config: ActionManager.ActionConfig,
    metadata: ActionMetadata,
    validation_state: ValidationState,
    optimization_state: OptimizationState,
    
    pub const ActionMetadata = struct {
        creation_time: i64,
        execution_count: u32,
        last_execution_time: ?i64,
        estimated_gas_cost: u64,
        optimization_applied: bool,
        validation_passed: bool,
    };
    
    pub const ValidationState = struct {
        is_validated: bool,
        validation_errors: []ValidationError,
        validation_warnings: []ValidationWarning,
        
        pub const ValidationError = struct {
            error_type: ErrorType,
            message: []const u8,
            severity: Severity,
            
            pub const ErrorType = enum {
                InvalidParameters,
                InsufficientGas,
                AccessViolation,
                StackOverflow,
                InvalidAddress,
                StaticCallViolation,
            };
            
            pub const Severity = enum {
                Warning,
                Error,
                Critical,
            };
        };
        
        pub const ValidationWarning = struct {
            warning_type: WarningType,
            message: []const u8,
            
            pub const WarningType = enum {
                PerformanceImpact,
                GasUsageHigh,
                DeprecatedFeature,
                SecurityConcern,
            };
        };
    };
    
    pub const OptimizationState = struct {
        is_optimized: bool,
        optimizations_applied: []OptimizationType,
        optimization_impact: OptimizationImpact,
        
        pub const OptimizationType = enum {
            GasOptimization,
            MemoryOptimization,
            CallOptimization,
            InlineOptimization,
            CacheOptimization,
        };
        
        pub const OptimizationImpact = struct {
            gas_saved: u64,
            memory_saved: usize,
            execution_time_saved_ns: u64,
        };
    };
    
    pub fn init(
        allocator: std.mem.Allocator,
        action_type: ActionType,
        context: *ExecutionContext,
        parameters: ActionParameters,
        config: ActionManager.ActionConfig
    ) !Action {
        return Action{
            .allocator = allocator,
            .action_type = action_type,
            .context = context,
            .parameters = parameters,
            .config = config,
            .metadata = ActionMetadata{
                .creation_time = std.time.milliTimestamp(),
                .execution_count = 0,
                .last_execution_time = null,
                .estimated_gas_cost = action_type.get_base_gas_cost(),
                .optimization_applied = false,
                .validation_passed = false,
            },
            .validation_state = ValidationState{
                .is_validated = false,
                .validation_errors = &[_]ValidationState.ValidationError{},
                .validation_warnings = &[_]ValidationState.ValidationWarning{},
            },
            .optimization_state = OptimizationState{
                .is_optimized = false,
                .optimizations_applied = &[_]OptimizationState.OptimizationType{},
                .optimization_impact = OptimizationState.OptimizationImpact{
                    .gas_saved = 0,
                    .memory_saved = 0,
                    .execution_time_saved_ns = 0,
                },
            },
        };
    }
    
    pub fn deinit(self: *Action) void {
        if (self.validation_state.validation_errors.len > 0) {
            for (self.validation_state.validation_errors) |error_item| {
                self.allocator.free(error_item.message);
            }
            self.allocator.free(self.validation_state.validation_errors);
        }
        
        if (self.validation_state.validation_warnings.len > 0) {
            for (self.validation_state.validation_warnings) |warning| {
                self.allocator.free(warning.message);
            }
            self.allocator.free(self.validation_state.validation_warnings);
        }
        
        if (self.optimization_state.optimizations_applied.len > 0) {
            self.allocator.free(self.optimization_state.optimizations_applied);
        }
        
        self.parameters.deinit();
    }
    
    pub fn estimate_gas_cost(self: *const Action) u64 {
        var gas_cost = self.action_type.get_base_gas_cost();
        
        // Add parameter-specific costs
        switch (self.action_type) {
            .Call, .StaticCall, .DelegateCall, .CallCode => {
                if (self.parameters.call) |call_params| {
                    // Add value transfer cost
                    if (call_params.value > 0) {
                        gas_cost += 9000;
                    }
                    
                    // Add account creation cost if needed
                    if (call_params.create_account) {
                        gas_cost += 25000;
                    }
                    
                    // Add memory expansion cost
                    gas_cost += call_params.memory_expansion_cost;
                }
            },
            .Create, .Create2 => {
                if (self.parameters.create) |create_params| {
                    // Add deployment cost based on code size
                    gas_cost += create_params.code.len * 200;
                    
                    // Add memory expansion cost
                    gas_cost += create_params.memory_expansion_cost;
                }
            },
            else => {},
        }
        
        // Apply optimization impact
        if (self.optimization_state.is_optimized) {
            gas_cost = gas_cost - @min(gas_cost, self.optimization_state.optimization_impact.gas_saved);
        }
        
        return gas_cost;
    }
    
    pub fn can_execute_in_static_context(self: *const Action) bool {
        return !self.action_type.is_state_modifying();
    }
    
    pub fn requires_account_existence(self: *const Action) bool {
        return switch (self.action_type) {
            .Call, .StaticCall, .DelegateCall, .CallCode => true,
            .SelfDestruct => true,
            else => false,
        };
    }
};
```

#### 3. Action Parameters
```zig
pub const ActionParameters = union(enum) {
    call: CallParameters,
    create: CreateParameters,
    system: SystemParameters,
    state: StateParameters,
    custom: CustomParameters,
    
    pub const CallParameters = struct {
        caller: Address,
        target: Address,
        value: u256,
        data: []const u8,
        gas: u64,
        is_static: bool,
        create_account: bool,
        memory_expansion_cost: u64,
    };
    
    pub const CreateParameters = struct {
        caller: Address,
        value: u256,
        code: []const u8,
        salt: ?u256, // For CREATE2
        gas: u64,
        memory_expansion_cost: u64,
    };
    
    pub const SystemParameters = struct {
        target: ?Address,
        data: []const u8,
        topics: []const Hash, // For LOG operations
        reason: []const u8,   // For REVERT operations
    };
    
    pub const StateParameters = struct {
        account: Address,
        storage_key: ?u256,
        value: ?u256,
        is_warm: bool,
    };
    
    pub const CustomParameters = struct {
        data: []const u8,
        metadata: []const u8,
    };
    
    pub fn deinit(self: *ActionParameters) void {
        switch (self.*) {
            .call => |*params| {
                // Data is typically borrowed, but could be owned
                _ = params;
            },
            .create => |*params| {
                // Code is typically borrowed, but could be owned
                _ = params;
            },
            .system => |*params| {
                // Data is typically borrowed, but could be owned
                _ = params;
            },
            .state => |*params| {
                _ = params;
            },
            .custom => |*params| {
                // Custom parameters might own their data
                _ = params;
            },
        }
    }
    
    pub fn validate_basic(self: *const ActionParameters) !void {
        switch (self.*) {
            .call => |*params| {
                if (params.gas == 0 and params.data.len > 0) {
                    return error.InsufficientGasForData;
                }
            },
            .create => |*params| {
                if (params.code.len == 0) {
                    return error.EmptyCreationCode;
                }
                if (params.code.len > 24576) { // EIP-170
                    return error.CodeTooLarge;
                }
            },
            .system => |*params| {
                switch (params.data.len) {
                    0 => if (params.topics.len > 0) return error.InvalidLogParameters,
                    else => {},
                }
            },
            .state => |*params| {
                _ = params; // Basic validation for state parameters
            },
            .custom => |*params| {
                _ = params; // Custom validation would be implemented by handlers
            },
        }
    }
    
    pub fn estimate_complexity(self: *const ActionParameters) u32 {
        return switch (self.*) {
            .call => |*params| @intCast(params.data.len / 32 + 1),
            .create => |*params| @intCast(params.code.len / 32 + 10),
            .system => |*params| @intCast(params.data.len / 32 + params.topics.len),
            .state => 1,
            .custom => |*params| @intCast(params.data.len / 32 + 1),
        };
    }
};
```

#### 4. Action Handlers
```zig
pub const ActionHandler = struct {
    execute_fn: *const fn(*Action, *ExecutionContext) anyerror!ActionResult,
    validate_fn: ?*const fn(*Action) anyerror!void,
    optimize_fn: ?*const fn(*Action) anyerror!void,
    name: []const u8,
    version: []const u8,
    capabilities: HandlerCapabilities,
    
    pub const HandlerCapabilities = struct {
        supports_static_execution: bool,
        supports_batch_execution: bool,
        supports_optimization: bool,
        supports_tracing: bool,
        max_gas_usage: ?u64,
        max_memory_usage: ?usize,
    };
    
    pub fn execute(self: *const ActionHandler, action: *Action, context: *ExecutionContext) !ActionResult {
        return try self.execute_fn(action, context);
    }
    
    pub fn validate(self: *const ActionHandler, action: *Action) !void {
        if (self.validate_fn) |validate_fn| {
            try validate_fn(action);
        }
    }
    
    pub fn optimize(self: *const ActionHandler, action: *Action) !void {
        if (self.optimize_fn) |optimize_fn| {
            try optimize_fn(action);
        }
    }
};

pub const ActionResult = struct {
    success: bool,
    return_data: []const u8,
    gas_used: u64,
    logs: []const Log,
    created_address: ?Address,
    state_changes: []const StateChange,
    error_message: ?[]const u8,
    
    pub const StateChange = struct {
        change_type: ChangeType,
        account: Address,
        storage_key: ?u256,
        old_value: ?u256,
        new_value: ?u256,
        
        pub const ChangeType = enum {
            AccountBalance,
            AccountNonce,
            AccountCode,
            StorageValue,
            AccountCreation,
            AccountDestruction,
        };
    };
    
    pub fn init(allocator: std.mem.Allocator) ActionResult {
        return ActionResult{
            .success = false,
            .return_data = &[_]u8{},
            .gas_used = 0,
            .logs = &[_]Log{},
            .created_address = null,
            .state_changes = &[_]StateChange{},
            .error_message = null,
        };
    }
    
    pub fn deinit(self: *ActionResult) void {
        // Clean up any allocated data
        _ = self;
    }
    
    pub fn success_with_data(allocator: std.mem.Allocator, data: []const u8, gas_used: u64) !ActionResult {
        const return_data = try allocator.dupe(u8, data);
        return ActionResult{
            .success = true,
            .return_data = return_data,
            .gas_used = gas_used,
            .logs = &[_]Log{},
            .created_address = null,
            .state_changes = &[_]StateChange{},
            .error_message = null,
        };
    }
    
    pub fn failure_with_error(allocator: std.mem.Allocator, error_message: []const u8, gas_used: u64) !ActionResult {
        const error_copy = try allocator.dupe(u8, error_message);
        return ActionResult{
            .success = false,
            .return_data = &[_]u8{},
            .gas_used = gas_used,
            .logs = &[_]Log{},
            .created_address = null,
            .state_changes = &[_]StateChange{},
            .error_message = error_copy,
        };
    }
};
```

#### 5. Action Registry
```zig
pub const ActionRegistry = struct {
    allocator: std.mem.Allocator,
    handlers: std.HashMap(ActionType, ActionHandler, ActionTypeContext, std.hash_map.default_max_load_percentage),
    default_handlers: DefaultHandlers,
    
    pub fn init(allocator: std.mem.Allocator) !ActionRegistry {
        var registry = ActionRegistry{
            .allocator = allocator,
            .handlers = std.HashMap(ActionType, ActionHandler, ActionTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            .default_handlers = DefaultHandlers{},
        };
        
        try registry.register_default_handlers();
        return registry;
    }
    
    pub fn deinit(self: *ActionRegistry) void {
        self.handlers.deinit();
    }
    
    pub fn register_handler(self: *ActionRegistry, action_type: ActionType, handler: ActionHandler) !void {
        try self.handlers.put(action_type, handler);
    }
    
    pub fn get_handler(self: *const ActionRegistry, action_type: ActionType) ?*const ActionHandler {
        return self.handlers.getPtr(action_type);
    }
    
    fn register_default_handlers(self: *ActionRegistry) !void {
        // Register default call handler
        try self.handlers.put(.Call, ActionHandler{
            .execute_fn = DefaultHandlers.execute_call,
            .validate_fn = DefaultHandlers.validate_call,
            .optimize_fn = DefaultHandlers.optimize_call,
            .name = "default_call",
            .version = "1.0.0",
            .capabilities = ActionHandler.HandlerCapabilities{
                .supports_static_execution = true,
                .supports_batch_execution = true,
                .supports_optimization = true,
                .supports_tracing = true,
                .max_gas_usage = null,
                .max_memory_usage = null,
            },
        });
        
        // Register default static call handler
        try self.handlers.put(.StaticCall, ActionHandler{
            .execute_fn = DefaultHandlers.execute_static_call,
            .validate_fn = DefaultHandlers.validate_static_call,
            .optimize_fn = DefaultHandlers.optimize_call,
            .name = "default_static_call",
            .version = "1.0.0",
            .capabilities = ActionHandler.HandlerCapabilities{
                .supports_static_execution = true,
                .supports_batch_execution = true,
                .supports_optimization = true,
                .supports_tracing = true,
                .max_gas_usage = null,
                .max_memory_usage = null,
            },
        });
        
        // Register default create handler
        try self.handlers.put(.Create, ActionHandler{
            .execute_fn = DefaultHandlers.execute_create,
            .validate_fn = DefaultHandlers.validate_create,
            .optimize_fn = DefaultHandlers.optimize_create,
            .name = "default_create",
            .version = "1.0.0",
            .capabilities = ActionHandler.HandlerCapabilities{
                .supports_static_execution = false,
                .supports_batch_execution = false,
                .supports_optimization = true,
                .supports_tracing = true,
                .max_gas_usage = null,
                .max_memory_usage = null,
            },
        });
        
        // Register other default handlers...
    }
    
    pub const ActionTypeContext = struct {
        pub fn hash(self: @This(), key: ActionType) u64 {
            _ = self;
            return @intFromEnum(key);
        }
        
        pub fn eql(self: @This(), a: ActionType, b: ActionType) bool {
            _ = self;
            return a == b;
        }
    };
};

pub const DefaultHandlers = struct {
    pub fn execute_call(action: *Action, context: *ExecutionContext) !ActionResult {
        const call_params = action.parameters.call;
        
        // Simulate call execution
        const gas_used = action.estimate_gas_cost();
        
        if (context.gas_remaining < gas_used) {
            return ActionResult.failure_with_error(
                action.allocator,
                "insufficient gas",
                context.gas_remaining
            );
        }
        
        // Execute the call (simplified)
        const return_data = "call executed successfully";
        return ActionResult.success_with_data(
            action.allocator,
            return_data,
            gas_used
        );
    }
    
    pub fn validate_call(action: *Action) !void {
        const call_params = action.parameters.call;
        
        // Validate call parameters
        if (call_params.gas == 0 and call_params.data.len > 0) {
            return error.InsufficientGasForData;
        }
        
        if (call_params.target.is_zero() and call_params.value > 0) {
            return error.ValueToZeroAddress;
        }
        
        action.validation_state.is_validated = true;
        action.metadata.validation_passed = true;
    }
    
    pub fn optimize_call(action: *Action) !void {
        // Apply call optimizations
        if (action.parameters.call.data.len == 0) {
            // Optimize gas for simple value transfers
            var optimizations = try action.allocator.alloc(Action.OptimizationState.OptimizationType, 1);
            optimizations[0] = .GasOptimization;
            
            action.optimization_state.optimizations_applied = optimizations;
            action.optimization_state.optimization_impact.gas_saved = 200;
            action.optimization_state.is_optimized = true;
            action.metadata.optimization_applied = true;
        }
    }
    
    pub fn execute_static_call(action: *Action, context: *ExecutionContext) !ActionResult {
        const call_params = action.parameters.call;
        
        // Ensure no state modifications in static call
        if (call_params.value > 0) {
            return ActionResult.failure_with_error(
                action.allocator,
                "static call cannot transfer value",
                0
            );
        }
        
        // Execute static call
        return execute_call(action, context);
    }
    
    pub fn validate_static_call(action: *Action) !void {
        try validate_call(action);
        
        const call_params = action.parameters.call;
        if (call_params.value > 0) {
            return error.StaticCallWithValue;
        }
    }
    
    pub fn execute_create(action: *Action, context: *ExecutionContext) !ActionResult {
        const create_params = action.parameters.create;
        
        // Simulate contract creation
        const gas_used = action.estimate_gas_cost();
        
        if (context.gas_remaining < gas_used) {
            return ActionResult.failure_with_error(
                action.allocator,
                "insufficient gas for creation",
                context.gas_remaining
            );
        }
        
        // Calculate new contract address
        const created_address = Address.from_create(create_params.caller, context.nonce);
        
        var result = ActionResult.init(action.allocator);
        result.success = true;
        result.gas_used = gas_used;
        result.created_address = created_address;
        result.return_data = try action.allocator.dupe(u8, "contract created");
        
        return result;
    }
    
    pub fn validate_create(action: *Action) !void {
        const create_params = action.parameters.create;
        
        if (create_params.code.len == 0) {
            return error.EmptyCreationCode;
        }
        
        if (create_params.code.len > 24576) { // EIP-170
            return error.CodeTooLarge;
        }
        
        action.validation_state.is_validated = true;
        action.metadata.validation_passed = true;
    }
    
    pub fn optimize_create(action: *Action) !void {
        const create_params = action.parameters.create;
        
        // Optimize for small contracts
        if (create_params.code.len < 1024) {
            var optimizations = try action.allocator.alloc(Action.OptimizationState.OptimizationType, 1);
            optimizations[0] = .GasOptimization;
            
            action.optimization_state.optimizations_applied = optimizations;
            action.optimization_state.optimization_impact.gas_saved = 1000;
            action.optimization_state.is_optimized = true;
            action.metadata.optimization_applied = true;
        }
    }
};
```

#### 6. Validation Engine
```zig
pub const ValidationEngine = struct {
    allocator: std.mem.Allocator,
    validation_level: ActionManager.ActionConfig.ValidationLevel,
    validation_rules: ValidationRules,
    custom_validators: CustomValidators,
    
    pub const ValidationRules = struct {
        enable_gas_validation: bool,
        enable_access_validation: bool,
        enable_static_validation: bool,
        enable_depth_validation: bool,
        max_call_depth: u32,
        max_create_depth: u32,
        
        pub fn from_level(level: ActionManager.ActionConfig.ValidationLevel) ValidationRules {
            return switch (level) {
                .None => ValidationRules{
                    .enable_gas_validation = false,
                    .enable_access_validation = false,
                    .enable_static_validation = false,
                    .enable_depth_validation = false,
                    .max_call_depth = 1024,
                    .max_create_depth = 1024,
                },
                .Basic => ValidationRules{
                    .enable_gas_validation = true,
                    .enable_access_validation = false,
                    .enable_static_validation = true,
                    .enable_depth_validation = true,
                    .max_call_depth = 1024,
                    .max_create_depth = 1024,
                },
                .Strict => ValidationRules{
                    .enable_gas_validation = true,
                    .enable_access_validation = true,
                    .enable_static_validation = true,
                    .enable_depth_validation = true,
                    .max_call_depth = 1024,
                    .max_create_depth = 1024,
                },
                .Paranoid => ValidationRules{
                    .enable_gas_validation = true,
                    .enable_access_validation = true,
                    .enable_static_validation = true,
                    .enable_depth_validation = true,
                    .max_call_depth = 512,
                    .max_create_depth = 256,
                },
            };
        }
    };
    
    pub const CustomValidators = struct {
        validators: std.HashMap(ActionType, CustomValidator, ActionRegistry.ActionTypeContext, std.hash_map.default_max_load_percentage),
        
        pub const CustomValidator = struct {
            validate_fn: *const fn(*Action) anyerror!void,
            name: []const u8,
        };
        
        pub fn init(allocator: std.mem.Allocator) CustomValidators {
            return CustomValidators{
                .validators = std.HashMap(ActionType, CustomValidator, ActionRegistry.ActionTypeContext, std.hash_map.default_max_load_percentage).init(allocator),
            };
        }
        
        pub fn deinit(self: *CustomValidators) void {
            self.validators.deinit();
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, level: ActionManager.ActionConfig.ValidationLevel) !ValidationEngine {
        return ValidationEngine{
            .allocator = allocator,
            .validation_level = level,
            .validation_rules = ValidationRules.from_level(level),
            .custom_validators = CustomValidators.init(allocator),
        };
    }
    
    pub fn deinit(self: *ValidationEngine) void {
        self.custom_validators.deinit();
    }
    
    pub fn validate_action(self: *ValidationEngine, action: *Action) !void {
        if (self.validation_level == .None) return;
        
        // Basic parameter validation
        try action.parameters.validate_basic();
        
        // Gas validation
        if (self.validation_rules.enable_gas_validation) {
            try self.validate_gas_requirements(action);
        }
        
        // Static context validation
        if (self.validation_rules.enable_static_validation) {
            try self.validate_static_context(action);
        }
        
        // Access validation
        if (self.validation_rules.enable_access_validation) {
            try self.validate_access_permissions(action);
        }
        
        // Depth validation
        if (self.validation_rules.enable_depth_validation) {
            try self.validate_call_depth(action);
        }
        
        // Custom validation
        if (self.custom_validators.validators.get(action.action_type)) |custom_validator| {
            try custom_validator.validate_fn(action);
        }
        
        action.validation_state.is_validated = true;
        action.metadata.validation_passed = true;
    }
    
    fn validate_gas_requirements(self: *ValidationEngine, action: *Action) !void {
        _ = self;
        
        const estimated_gas = action.estimate_gas_cost();
        const available_gas = action.context.gas_remaining;
        
        if (estimated_gas > available_gas) {
            const error_msg = try std.fmt.allocPrint(
                action.allocator,
                "insufficient gas: need {}, have {}",
                .{ estimated_gas, available_gas }
            );
            
            var errors = try action.allocator.alloc(Action.ValidationState.ValidationError, 1);
            errors[0] = Action.ValidationState.ValidationError{
                .error_type = .InsufficientGas,
                .message = error_msg,
                .severity = .Critical,
            };
            
            action.validation_state.validation_errors = errors;
            return error.InsufficientGas;
        }
    }
    
    fn validate_static_context(self: *ValidationEngine, action: *Action) !void {
        _ = self;
        
        if (action.context.is_static and action.action_type.is_state_modifying()) {
            const error_msg = try action.allocator.dupe(u8, "state modification in static context");
            
            var errors = try action.allocator.alloc(Action.ValidationState.ValidationError, 1);
            errors[0] = Action.ValidationState.ValidationError{
                .error_type = .StaticCallViolation,
                .message = error_msg,
                .severity = .Critical,
            };
            
            action.validation_state.validation_errors = errors;
            return error.StaticCallViolation;
        }
    }
    
    fn validate_access_permissions(self: *ValidationEngine, action: *Action) !void {
        _ = self;
        _ = action;
        
        // Implement access permission validation
        // This would check things like:
        // - Contract permissions
        // - Account access rights
        // - Storage access permissions
    }
    
    fn validate_call_depth(self: *ValidationEngine, action: *Action) !void {
        const max_depth = if (action.action_type.is_call_action())
            self.validation_rules.max_call_depth
        else
            self.validation_rules.max_create_depth;
        
        if (action.context.call_depth >= max_depth) {
            const error_msg = try std.fmt.allocPrint(
                action.allocator,
                "call depth exceeded: {} >= {}",
                .{ action.context.call_depth, max_depth }
            );
            
            var errors = try action.allocator.alloc(Action.ValidationState.ValidationError, 1);
            errors[0] = Action.ValidationState.ValidationError{
                .error_type = .StackOverflow,
                .message = error_msg,
                .severity = .Critical,
            };
            
            action.validation_state.validation_errors = errors;
            return error.StackOverflow;
        }
    }
};
```

#### 7. Performance Tracking
```zig
pub const ActionPerformanceTracker = struct {
    action_counts: std.HashMap(ActionType, u64, ActionRegistry.ActionTypeContext, std.hash_map.default_max_load_percentage),
    execution_times: std.HashMap(ActionType, ExecutionStats, ActionRegistry.ActionTypeContext, std.hash_map.default_max_load_percentage),
    gas_usage_stats: std.HashMap(ActionType, GasStats, ActionRegistry.ActionTypeContext, std.hash_map.default_max_load_percentage),
    success_rates: std.HashMap(ActionType, SuccessStats, ActionRegistry.ActionTypeContext, std.hash_map.default_max_load_percentage),
    
    pub const ExecutionStats = struct {
        total_time_ns: u64,
        min_time_ns: u64,
        max_time_ns: u64,
        execution_count: u64,
        
        pub fn init() ExecutionStats {
            return ExecutionStats{
                .total_time_ns = 0,
                .min_time_ns = std.math.maxInt(u64),
                .max_time_ns = 0,
                .execution_count = 0,
            };
        }
        
        pub fn record_execution(self: *ExecutionStats, time_ns: u64) void {
            self.total_time_ns += time_ns;
            self.execution_count += 1;
            
            if (time_ns < self.min_time_ns) {
                self.min_time_ns = time_ns;
            }
            if (time_ns > self.max_time_ns) {
                self.max_time_ns = time_ns;
            }
        }
        
        pub fn get_average_time(self: *const ExecutionStats) f64 {
            if (self.execution_count == 0) return 0.0;
            return @as(f64, @floatFromInt(self.total_time_ns)) / @as(f64, @floatFromInt(self.execution_count));
        }
    };
    
    pub const GasStats = struct {
        total_gas_used: u64,
        min_gas_used: u64,
        max_gas_used: u64,
        execution_count: u64,
        
        pub fn init() GasStats {
            return GasStats{
                .total_gas_used = 0,
                .min_gas_used = std.math.maxInt(u64),
                .max_gas_used = 0,
                .execution_count = 0,
            };
        }
        
        pub fn record_gas_usage(self: *GasStats, gas_used: u64) void {
            self.total_gas_used += gas_used;
            self.execution_count += 1;
            
            if (gas_used < self.min_gas_used) {
                self.min_gas_used = gas_used;
            }
            if (gas_used > self.max_gas_used) {
                self.max_gas_used = gas_used;
            }
        }
        
        pub fn get_average_gas(self: *const GasStats) f64 {
            if (self.execution_count == 0) return 0.0;
            return @as(f64, @floatFromInt(self.total_gas_used)) / @as(f64, @floatFromInt(self.execution_count));
        }
    };
    
    pub const SuccessStats = struct {
        total_executions: u64,
        successful_executions: u64,
        
        pub fn init() SuccessStats {
            return SuccessStats{
                .total_executions = 0,
                .successful_executions = 0,
            };
        }
        
        pub fn record_execution(self: *SuccessStats, success: bool) void {
            self.total_executions += 1;
            if (success) {
                self.successful_executions += 1;
            }
        }
        
        pub fn get_success_rate(self: *const SuccessStats) f64 {
            if (self.total_executions == 0) return 0.0;
            return @as(f64, @floatFromInt(self.successful_executions)) / @as(f64, @floatFromInt(self.total_executions));
        }
    };
    
    pub const ActionStatistics = struct {
        total_actions: u64,
        actions_by_type: std.HashMap(ActionType, u64, ActionRegistry.ActionTypeContext, std.hash_map.default_max_load_percentage),
        average_execution_time: f64,
        average_gas_usage: f64,
        overall_success_rate: f64,
        most_used_action: ?ActionType,
        fastest_action: ?ActionType,
        most_gas_efficient_action: ?ActionType,
    };
    
    pub fn init() ActionPerformanceTracker {
        return ActionPerformanceTracker{
            .action_counts = std.HashMap(ActionType, u64, ActionRegistry.ActionTypeContext, std.hash_map.default_max_load_percentage).init(std.heap.page_allocator),
            .execution_times = std.HashMap(ActionType, ExecutionStats, ActionRegistry.ActionTypeContext, std.hash_map.default_max_load_percentage).init(std.heap.page_allocator),
            .gas_usage_stats = std.HashMap(ActionType, GasStats, ActionRegistry.ActionTypeContext, std.hash_map.default_max_load_percentage).init(std.heap.page_allocator),
            .success_rates = std.HashMap(ActionType, SuccessStats, ActionRegistry.ActionTypeContext, std.hash_map.default_max_load_percentage).init(std.heap.page_allocator),
        };
    }
    
    pub fn deinit(self: *ActionPerformanceTracker) void {
        self.action_counts.deinit();
        self.execution_times.deinit();
        self.gas_usage_stats.deinit();
        self.success_rates.deinit();
    }
    
    pub fn record_action_execution(
        self: *ActionPerformanceTracker,
        action_type: ActionType,
        execution_time_ns: u64,
        gas_used: u64,
        success: bool
    ) void {
        // Update action count
        const count = self.action_counts.get(action_type) orelse 0;
        self.action_counts.put(action_type, count + 1) catch {};
        
        // Update execution time stats
        var exec_stats = self.execution_times.getPtr(action_type) orelse blk: {
            const new_stats = ExecutionStats.init();
            self.execution_times.put(action_type, new_stats) catch return;
            break :blk self.execution_times.getPtr(action_type).?;
        };
        exec_stats.record_execution(execution_time_ns);
        
        // Update gas usage stats
        var gas_stats = self.gas_usage_stats.getPtr(action_type) orelse blk: {
            const new_stats = GasStats.init();
            self.gas_usage_stats.put(action_type, new_stats) catch return;
            break :blk self.gas_usage_stats.getPtr(action_type).?;
        };
        gas_stats.record_gas_usage(gas_used);
        
        // Update success rate stats
        var success_stats = self.success_rates.getPtr(action_type) orelse blk: {
            const new_stats = SuccessStats.init();
            self.success_rates.put(action_type, new_stats) catch return;
            break :blk self.success_rates.getPtr(action_type).?;
        };
        success_stats.record_execution(success);
    }
    
    pub fn get_statistics(self: *const ActionPerformanceTracker) ActionStatistics {
        var total_actions: u64 = 0;
        var total_time: u64 = 0;
        var total_gas: u64 = 0;
        var total_successful: u64 = 0;
        var total_executions: u64 = 0;
        
        var most_used_action: ?ActionType = null;
        var max_count: u64 = 0;
        
        var fastest_action: ?ActionType = null;
        var min_avg_time: f64 = std.math.inf(f64);
        
        var most_gas_efficient_action: ?ActionType = null;
        var min_avg_gas: f64 = std.math.inf(f64);
        
        // Calculate aggregated statistics
        var count_iter = self.action_counts.iterator();
        while (count_iter.next()) |entry| {
            const action_type = entry.key_ptr.*;
            const count = entry.value_ptr.*;
            total_actions += count;
            
            if (count > max_count) {
                max_count = count;
                most_used_action = action_type;
            }
        }
        
        var time_iter = self.execution_times.iterator();
        while (time_iter.next()) |entry| {
            const action_type = entry.key_ptr.*;
            const stats = entry.value_ptr.*;
            total_time += stats.total_time_ns;
            
            const avg_time = stats.get_average_time();
            if (avg_time < min_avg_time and stats.execution_count > 0) {
                min_avg_time = avg_time;
                fastest_action = action_type;
            }
        }
        
        var gas_iter = self.gas_usage_stats.iterator();
        while (gas_iter.next()) |entry| {
            const action_type = entry.key_ptr.*;
            const stats = entry.value_ptr.*;
            total_gas += stats.total_gas_used;
            
            const avg_gas = stats.get_average_gas();
            if (avg_gas < min_avg_gas and stats.execution_count > 0) {
                min_avg_gas = avg_gas;
                most_gas_efficient_action = action_type;
            }
        }
        
        var success_iter = self.success_rates.iterator();
        while (success_iter.next()) |entry| {
            const stats = entry.value_ptr.*;
            total_successful += stats.successful_executions;
            total_executions += stats.total_executions;
        }
        
        return ActionStatistics{
            .total_actions = total_actions,
            .actions_by_type = self.action_counts, // Reference to existing map
            .average_execution_time = if (total_executions > 0) 
                @as(f64, @floatFromInt(total_time)) / @as(f64, @floatFromInt(total_executions))
            else 0.0,
            .average_gas_usage = if (total_executions > 0)
                @as(f64, @floatFromInt(total_gas)) / @as(f64, @floatFromInt(total_executions))
            else 0.0,
            .overall_success_rate = if (total_executions > 0)
                @as(f64, @floatFromInt(total_successful)) / @as(f64, @floatFromInt(total_executions))
            else 0.0,
            .most_used_action = most_used_action,
            .fastest_action = fastest_action,
            .most_gas_efficient_action = most_gas_efficient_action,
        };
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Structured Action Handling**: Clean separation between different action types with type-safe interfaces
2. **Comprehensive Validation**: Multi-level validation with gas, access, and security checks
3. **Performance Optimization**: Built-in optimization engine with gas and execution optimizations
4. **Extensible Registry**: Easy addition of custom action handlers and validators
5. **Performance Monitoring**: Detailed tracking of action execution metrics and statistics
6. **Batch Processing**: Support for executing multiple actions efficiently

## Implementation Tasks

### Task 1: Integrate with VM Execution
File: `/src/evm/vm.zig` (modify existing)
```zig
const ActionManager = @import("interpreter_action/action_manager.zig").ActionManager;

pub const Vm = struct {
    // Existing fields...
    action_manager: ?ActionManager,
    action_enabled: bool,
    
    pub fn enable_action_system(self: *Vm, config: ActionManager.ActionConfig) !void {
        self.action_manager = try ActionManager.init(self.allocator, config);
        self.action_enabled = true;
    }
    
    pub fn disable_action_system(self: *Vm) void {
        if (self.action_manager) |*manager| {
            manager.deinit();
            self.action_manager = null;
        }
        self.action_enabled = false;
    }
    
    pub fn execute_call_action(
        self: *Vm, 
        caller: Address, 
        target: Address, 
        value: u256, 
        data: []const u8, 
        gas: u64
    ) !ActionResult {
        if (self.action_manager) |*manager| {
            const parameters = ActionParameters{
                .call = ActionParameters.CallParameters{
                    .caller = caller,
                    .target = target,
                    .value = value,
                    .data = data,
                    .gas = gas,
                    .is_static = false,
                    .create_account = false,
                    .memory_expansion_cost = 0,
                },
            };
            
            return try manager.execute_action(.Call, &self.context, parameters);
        }
        return error.ActionSystemNotEnabled;
    }
    
    pub fn execute_create_action(
        self: *Vm,
        caller: Address,
        value: u256,
        code: []const u8,
        gas: u64
    ) !ActionResult {
        if (self.action_manager) |*manager| {
            const parameters = ActionParameters{
                .create = ActionParameters.CreateParameters{
                    .caller = caller,
                    .value = value,
                    .code = code,
                    .salt = null,
                    .gas = gas,
                    .memory_expansion_cost = 0,
                },
            };
            
            return try manager.execute_action(.Create, &self.context, parameters);
        }
        return error.ActionSystemNotEnabled;
    }
    
    pub fn get_action_statistics(self: *Vm) ?ActionPerformanceTracker.ActionStatistics {
        if (self.action_manager) |*manager| {
            return manager.get_action_statistics();
        }
        return null;
    }
};
```

### Task 2: Implement Optimization Engine
File: `/src/evm/interpreter_action/optimization_engine.zig`
```zig
const std = @import("std");
const Action = @import("action.zig").Action;
const ActionManager = @import("action_manager.zig").ActionManager;

pub const OptimizationEngine = struct {
    allocator: std.mem.Allocator,
    optimization_level: ActionManager.ActionConfig.OptimizationLevel,
    optimization_rules: OptimizationRules,
    cache: OptimizationCache,
    
    pub const OptimizationRules = struct {
        enable_gas_optimization: bool,
        enable_memory_optimization: bool,
        enable_call_optimization: bool,
        enable_inline_optimization: bool,
        enable_cache_optimization: bool,
        
        pub fn from_level(level: ActionManager.ActionConfig.OptimizationLevel) OptimizationRules {
            return switch (level) {
                .None => OptimizationRules{
                    .enable_gas_optimization = false,
                    .enable_memory_optimization = false,
                    .enable_call_optimization = false,
                    .enable_inline_optimization = false,
                    .enable_cache_optimization = false,
                },
                .Basic => OptimizationRules{
                    .enable_gas_optimization = true,
                    .enable_memory_optimization = false,
                    .enable_call_optimization = false,
                    .enable_inline_optimization = false,
                    .enable_cache_optimization = true,
                },
                .Aggressive => OptimizationRules{
                    .enable_gas_optimization = true,
                    .enable_memory_optimization = true,
                    .enable_call_optimization = true,
                    .enable_inline_optimization = false,
                    .enable_cache_optimization = true,
                },
                .Experimental => OptimizationRules{
                    .enable_gas_optimization = true,
                    .enable_memory_optimization = true,
                    .enable_call_optimization = true,
                    .enable_inline_optimization = true,
                    .enable_cache_optimization = true,
                },
            };
        }
    };
    
    pub const OptimizationCache = struct {
        cache: std.HashMap(u64, CacheEntry, HashContext, std.hash_map.default_max_load_percentage),
        
        pub const CacheEntry = struct {
            optimizations: []Action.OptimizationState.OptimizationType,
            impact: Action.OptimizationState.OptimizationImpact,
            hit_count: u64,
        };
        
        pub fn init(allocator: std.mem.Allocator) OptimizationCache {
            return OptimizationCache{
                .cache = std.HashMap(u64, CacheEntry, HashContext, std.hash_map.default_max_load_percentage).init(allocator),
            };
        }
        
        pub fn deinit(self: *OptimizationCache) void {
            var iterator = self.cache.iterator();
            while (iterator.next()) |entry| {
                entry.value_ptr.allocator.free(entry.value_ptr.optimizations);
            }
            self.cache.deinit();
        }
        
        pub const HashContext = struct {
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
    
    pub fn init(allocator: std.mem.Allocator, level: ActionManager.ActionConfig.OptimizationLevel) !OptimizationEngine {
        return OptimizationEngine{
            .allocator = allocator,
            .optimization_level = level,
            .optimization_rules = OptimizationRules.from_level(level),
            .cache = OptimizationCache.init(allocator),
        };
    }
    
    pub fn deinit(self: *OptimizationEngine) void {
        self.cache.deinit();
    }
    
    pub fn optimize_action(self: *OptimizationEngine, action: *Action) !void {
        if (self.optimization_level == .None) return;
        
        // Generate cache key for this action
        const cache_key = self.generate_cache_key(action);
        
        // Check cache first
        if (self.optimization_rules.enable_cache_optimization) {
            if (self.cache.cache.get(cache_key)) |cached| {
                try self.apply_cached_optimizations(action, cached);
                return;
            }
        }
        
        var optimizations = std.ArrayList(Action.OptimizationState.OptimizationType).init(self.allocator);
        defer optimizations.deinit();
        
        var impact = Action.OptimizationState.OptimizationImpact{
            .gas_saved = 0,
            .memory_saved = 0,
            .execution_time_saved_ns = 0,
        };
        
        // Apply gas optimizations
        if (self.optimization_rules.enable_gas_optimization) {
            const gas_saved = try self.optimize_gas_usage(action);
            if (gas_saved > 0) {
                try optimizations.append(.GasOptimization);
                impact.gas_saved += gas_saved;
            }
        }
        
        // Apply memory optimizations
        if (self.optimization_rules.enable_memory_optimization) {
            const memory_saved = try self.optimize_memory_usage(action);
            if (memory_saved > 0) {
                try optimizations.append(.MemoryOptimization);
                impact.memory_saved += memory_saved;
            }
        }
        
        // Apply call optimizations
        if (self.optimization_rules.enable_call_optimization) {
            const call_optimized = try self.optimize_call_pattern(action);
            if (call_optimized) {
                try optimizations.append(.CallOptimization);
                impact.gas_saved += 500; // Estimated savings
            }
        }
        
        // Apply optimizations to action
        if (optimizations.items.len > 0) {
            action.optimization_state.optimizations_applied = try self.allocator.dupe(
                Action.OptimizationState.OptimizationType,
                optimizations.items
            );
            action.optimization_state.optimization_impact = impact;
            action.optimization_state.is_optimized = true;
            action.metadata.optimization_applied = true;
            
            // Cache the optimization result
            if (self.optimization_rules.enable_cache_optimization) {
                try self.cache_optimization_result(cache_key, optimizations.items, impact);
            }
        }
    }
    
    fn optimize_gas_usage(self: *OptimizationEngine, action: *Action) !u64 {
        _ = self;
        
        var gas_saved: u64 = 0;
        
        switch (action.action_type) {
            .Call, .StaticCall => {
                const call_params = action.parameters.call;
                
                // Optimize simple value transfers
                if (call_params.data.len == 0 and call_params.value > 0) {
                    gas_saved += 2300; // Gas saved by using simpler transfer logic
                }
                
                // Optimize calls to precompiled contracts
                if (call_params.target.is_precompiled()) {
                    gas_saved += 100; // Optimized precompile dispatch
                }
            },
            .Create, .Create2 => {
                const create_params = action.parameters.create;
                
                // Optimize small contract creation
                if (create_params.code.len < 1024) {
                    gas_saved += 1000; // Reduced initialization overhead
                }
            },
            else => {},
        }
        
        return gas_saved;
    }
    
    fn optimize_memory_usage(self: *OptimizationEngine, action: *Action) !usize {
        _ = self;
        _ = action;
        
        // Implement memory optimizations
        return 0;
    }
    
    fn optimize_call_pattern(self: *OptimizationEngine, action: *Action) !bool {
        _ = self;
        
        return switch (action.action_type) {
            .Call, .StaticCall => blk: {
                const call_params = action.parameters.call;
                
                // Optimize common call patterns
                if (call_params.data.len == 4) {
                    // Might be a simple function call
                    break :blk true;
                }
                
                break :blk false;
            },
            else => false,
        };
    }
    
    fn generate_cache_key(self: *OptimizationEngine, action: *Action) u64 {
        _ = self;
        
        var hasher = std.hash_map.DefaultHasher.init();
        hasher.update(std.mem.asBytes(&action.action_type));
        
        switch (action.action_type) {
            .Call, .StaticCall => {
                const call_params = action.parameters.call;
                hasher.update(std.mem.asBytes(&call_params.target));
                hasher.update(std.mem.asBytes(&call_params.value));
                hasher.update(call_params.data);
            },
            .Create, .Create2 => {
                const create_params = action.parameters.create;
                hasher.update(std.mem.asBytes(&create_params.value));
                hasher.update(create_params.code);
            },
            else => {},
        }
        
        return hasher.final();
    }
    
    fn apply_cached_optimizations(
        self: *OptimizationEngine,
        action: *Action,
        cached: OptimizationCache.CacheEntry
    ) !void {
        action.optimization_state.optimizations_applied = try self.allocator.dupe(
            Action.OptimizationState.OptimizationType,
            cached.optimizations
        );
        action.optimization_state.optimization_impact = cached.impact;
        action.optimization_state.is_optimized = true;
        action.metadata.optimization_applied = true;
    }
    
    fn cache_optimization_result(
        self: *OptimizationEngine,
        cache_key: u64,
        optimizations: []const Action.OptimizationState.OptimizationType,
        impact: Action.OptimizationState.OptimizationImpact
    ) !void {
        const cached_optimizations = try self.allocator.dupe(
            Action.OptimizationState.OptimizationType,
            optimizations
        );
        
        const cache_entry = OptimizationCache.CacheEntry{
            .optimizations = cached_optimizations,
            .impact = impact,
            .hit_count = 0,
        };
        
        try self.cache.cache.put(cache_key, cache_entry);
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/interpreter_action/interpreter_action_test.zig`

### Test Cases
```zig
test "action manager initialization and configuration" {
    // Test manager creation with different configs
    // Test action registry initialization
    // Test validation and optimization engine setup
}

test "action type system and classification" {
    // Test action type properties
    // Test action type classification methods
    // Test gas cost estimation
}

test "action execution workflow" {
    // Test action creation and execution
    // Test parameter validation
    // Test result handling
}

test "validation engine functionality" {
    // Test multi-level validation
    // Test gas validation
    // Test static context validation
    // Test access permission validation
}

test "optimization engine capabilities" {
    // Test gas optimizations
    // Test memory optimizations
    // Test call pattern optimizations
    // Test optimization caching
}

test "performance tracking and statistics" {
    // Test execution time tracking
    // Test gas usage statistics
    // Test success rate monitoring
    // Test performance reporting
}

test "batch action execution" {
    // Test batch processing
    // Test failure handling in batches
    // Test optimization across batches
}

test "integration with VM execution" {
    // Test VM integration
    // Test action-based opcode execution
    // Test performance impact measurement
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/interpreter_action/action_manager.zig` - Main action management framework
- `/src/evm/interpreter_action/action.zig` - Action type system and structures
- `/src/evm/interpreter_action/action_parameters.zig` - Action parameter definitions
- `/src/evm/interpreter_action/action_handler.zig` - Action handler interfaces and implementations
- `/src/evm/interpreter_action/action_registry.zig` - Action handler registry and management
- `/src/evm/interpreter_action/validation_engine.zig` - Action validation system
- `/src/evm/interpreter_action/optimization_engine.zig` - Action optimization engine
- `/src/evm/interpreter_action/performance_tracker.zig` - Performance monitoring and statistics
- `/src/evm/vm.zig` - VM integration with action system
- `/test/evm/interpreter_action/interpreter_action_test.zig` - Comprehensive tests

## Success Criteria

1. **Clean Architecture**: Well-structured action handling with clear separation of concerns
2. **Type Safety**: All action types and parameters are properly validated at compile time
3. **Performance Optimization**: Measurable improvements through built-in optimization engine
4. **Extensibility**: Easy addition of new action types and custom handlers
5. **Comprehensive Validation**: Multi-level validation prevents invalid operations
6. **Performance Monitoring**: Detailed tracking provides insights for optimization

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

#### 1. **Unit Tests** (`/test/evm/interpreter/action_system_test.zig`)
```zig
// Test basic action system functionality
test "action_manager basic functionality with known scenarios"
test "action_manager handles edge cases correctly"
test "action_manager validates input parameters"
test "action_manager produces correct output format"
test "action_registry handles action registration"
test "validation_engine validates actions correctly"
test "optimization_engine optimizes action execution"
test "performance_tracker tracks action metrics"
```

#### 2. **Integration Tests**
```zig
test "action_system integrates with EVM execution context"
test "action_system works with existing EVM systems"
test "action_system maintains compatibility with hardforks"
test "action_system handles system-level interactions"
test "action_validation integrates with gas accounting"
test "action_optimization preserves execution semantics"
test "action_tracing integrates with debugging systems"
test "action_caching maintains consistency with state"
```

#### 3. **Functional Tests**
```zig
test "action_system end-to-end functionality works correctly"
test "action_system handles realistic usage scenarios"
test "action_system maintains behavior under load"
test "action_system processes complex inputs correctly"
test "call_action executes contract calls correctly"
test "create_action creates contracts correctly" 
test "staticcall_action preserves read-only semantics"
test "delegatecall_action maintains caller context"
```

#### 4. **Performance Tests**
```zig
test "action_system meets performance requirements"
test "action_system memory usage within bounds"
test "action_system scalability with large inputs"
test "action_system benchmark against baseline"
test "action_caching improves performance"
test "action_validation overhead acceptable"
test "action_optimization provides measurable gains"
test "action_depth_limit prevents stack overflow"
```

#### 5. **Error Handling Tests**
```zig
test "action_system error propagation works correctly"
test "action_system proper error types and messages"
test "action_system graceful handling of invalid inputs"
test "action_system recovery from failure states"
test "action_validation rejects invalid actions"
test "action_execution handles gas exhaustion"
test "action_system handles recursive calls correctly"
test "action_system detects and prevents reentrancy"
```

#### 6. **Compatibility Tests**
```zig
test "action_system maintains EVM specification compliance"
test "action_system cross-client behavior consistency"
test "action_system backward compatibility preserved"
test "action_system platform-specific behavior verified"
test "action_results match reference implementations"
test "action_gas_costs match Ethereum specifications"
test "action_validation follows EIP requirements"
test "action_semantics consistent across hardforks"
```

### Test Development Priority
1. **Start with core functionality** - Ensure basic action execution works correctly
2. **Add integration tests** - Verify system-level interactions with EVM context
3. **Implement performance tests** - Meet efficiency requirements for action processing
4. **Add error handling tests** - Robust failure management for invalid actions
5. **Test edge cases** - Handle boundary conditions like maximum call depth
6. **Verify compatibility** - Ensure specification compliance and cross-client consistency

### Test Data Sources
- **EVM specification requirements**: Action behavior and gas cost verification
- **Reference implementation data**: Cross-client compatibility testing
- **Performance benchmarks**: Action execution efficiency baseline
- **Real-world contract scenarios**: Production use case validation
- **Edge case synthetic tests**: Boundary condition and stress testing

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public APIs
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify cross-platform compatibility

### Test-First Examples

**Before writing any implementation:**
```zig
test "action_manager basic functionality" {
    // This test MUST fail initially
    const allocator = testing.allocator;
    const context = test_utils.createTestEVMContext(allocator);
    defer context.deinit();
    
    var action_manager = ActionManager.init(allocator, ActionManager.ActionConfig.default());
    defer action_manager.deinit();
    
    const call_action = CallAction{
        .caller = test_data.caller_address,
        .target = test_data.target_address,
        .value = 0,
        .input = test_data.call_input,
        .gas_limit = 100000,
    };
    
    const result = action_manager.execute(context, Action{ .call = call_action });
    try testing.expectEqual(test_data.expected_result, result);
}
```

**Only then implement:**
```zig
pub const ActionManager = struct {
    pub fn execute(self: *ActionManager, context: *EVMContext, action: Action) !ActionResult {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test action validation logic** - Ensure proper parameter validation
- **Verify action optimization correctness** - Optimizations must preserve semantics
- **Test cross-platform action behavior** - Ensure consistent results across platforms
- **Validate integration points** - Test all external interfaces thoroughly

## References

- [Command Pattern](https://en.wikipedia.org/wiki/Command_pattern) - Design pattern for encapsulating actions
- [Strategy Pattern](https://en.wikipedia.org/wiki/Strategy_pattern) - Pattern for pluggable action handlers
- [Visitor Pattern](https://en.wikipedia.org/wiki/Visitor_pattern) - Pattern for action validation and optimization
- [Chain of Responsibility](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern) - Pattern for validation pipelines
- [Template Method](https://en.wikipedia.org/wiki/Template_method_pattern) - Pattern for action execution workflow

## EVMONE Context

An excellent and detailed prompt. The proposed `ActionManager` system provides a robust framework for encapsulating EVM operations. The design correctly identifies the need for structured parameters, validation, optimization, and handlers, which mirrors patterns in high-performance EVM implementations like `evmone`.

Here are the most relevant code snippets from `evmone` to provide context for this implementation.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_execution.cpp">
```cpp
/// This file demonstrates the core interpreter loop (`dispatch`) and pre-execution validation (`check_requirements`).
/// This is analogous to the proposed `ActionManager.execute_action` and `ValidationEngine.validate_action` logic.

namespace evmone::baseline
{
namespace
{
/// Checks instruction requirements before execution.
///
/// This checks:
/// - if the instruction is defined
/// - if stack height requirements are fulfilled (stack overflow, stack underflow)
/// - charges the instruction base gas cost and checks is there is any gas left.
template <Opcode Op>
inline evmc_status_code check_requirements(const CostTable& cost_table, int64_t& gas_left,
    const uint256* stack_top, const uint256* stack_bottom) noexcept
{
    // ... (implementation for checking if instruction is defined)

    auto gas_cost = instr::gas_costs[EVMC_FRONTIER][Op];  // Init assuming const cost.
    if constexpr (!instr::has_const_gas_cost(Op))
    {
        gas_cost = cost_table[Op];  // If not, load the cost from the table.

        if (INTX_UNLIKELY(gas_cost < 0))
            return EVMC_UNDEFINED_INSTRUCTION;
    }

    // Check stack requirements first.
    if constexpr (instr::traits[Op].stack_height_change > 0)
    {
        if (INTX_UNLIKELY(stack_top == stack_bottom + StackSpace::limit))
            return EVMC_STACK_OVERFLOW;
    }
    if constexpr (instr::traits[Op].stack_height_required > 0)
    {
        static constexpr auto min_offset = instr::traits[Op].stack_height_required - 1;
        if (INTX_UNLIKELY(stack_top <= stack_bottom + min_offset))
            return EVMC_STACK_UNDERFLOW;
    }

    if (INTX_UNLIKELY((gas_left -= gas_cost) < 0))
        return EVMC_OUT_OF_GAS;

    return EVMC_SUCCESS;
}


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
}
}
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_calls.cpp">
```cpp
/// This file shows the implementation logic for CALL, CREATE, and other call-like opcodes.
/// This logic would be encapsulated within your `ActionHandler` implementations.
/// It demonstrates how to handle arguments, calculate dynamic gas costs, and interact with the host.

namespace evmone::instr::core
{
template <Opcode Op>
Result call_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    static_assert(
        Op == OP_CALL || Op == OP_CALLCODE || Op == OP_DELEGATECALL || Op == OP_STATICCALL);

    const auto gas = stack.pop();
    const auto dst = intx::be::trunc<evmc::address>(stack.pop());
    const auto value = (Op == OP_STATICCALL || Op == OP_DELEGATECALL) ? 0 : stack.pop();
    const auto has_value = value != 0;
    const auto input_offset_u256 = stack.pop();
    const auto input_size_u256 = stack.pop();
    const auto output_offset_u256 = stack.pop();
    const auto output_size_u256 = stack.pop();

    stack.push(0);  // Assume failure.
    state.return_data.clear();

    // Access list gas cost (EIP-2929)
    if (state.rev >= EVMC_BERLIN && state.host.access_account(dst) == EVMC_ACCESS_COLD)
    {
        if ((gas_left -= instr::additional_cold_account_access_cost) < 0)
            return {EVMC_OUT_OF_GAS, gas_left};
    }
    
    // ... (memory checks and dynamic gas calculation for memory expansion)

    evmc_message msg{.kind = to_call_kind(Op)};
    msg.flags = (Op == OP_STATICCALL) ? uint32_t{EVMC_STATIC} : state.msg->flags;
    msg.depth = state.msg->depth + 1;
    // ... (setting up other message parameters like recipient, sender, value)
    
    // Dynamic gas calculation for value transfer and account creation
    auto cost = has_value ? CALL_VALUE_COST : 0;
    if constexpr (Op == OP_CALL)
    {
        if (has_value && state.in_static_mode())
            return {EVMC_STATIC_MODE_VIOLATION, gas_left};

        if ((has_value || state.rev < EVMC_SPURIOUS_DRAGON) && !state.host.account_exists(dst))
            cost += ACCOUNT_CREATION_COST;
    }

    if ((gas_left -= cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};

    // Calculate gas to forward to the callee
    msg.gas = std::numeric_limits<int64_t>::max();
    if (gas < msg.gas)
        msg.gas = static_cast<int64_t>(gas);

    if (state.rev >= EVMC_TANGERINE_WHISTLE)
        msg.gas = std::min(msg.gas, gas_left - gas_left / 64);
    else if (msg.gas > gas_left)
        return {EVMC_OUT_OF_GAS, gas_left};
    
    // Pre-execution validation
    if (state.msg->depth >= 1024)
        return {EVMC_SUCCESS, gas_left};  // "Light" failure.

    if (has_value && intx::be::load<uint256>(state.host.get_balance(state.msg->recipient)) < value)
        return {EVMC_SUCCESS, gas_left};  // "Light" failure.

    // Actual call to host
    const auto result = state.host.call(msg);
    state.return_data.assign(result.output_data, result.output_size);
    stack.top() = result.status_code == EVMC_SUCCESS;

    // ... (handling return data and gas refund)

    return {EVMC_SUCCESS, gas_left};
}

template <Opcode Op>
Result create_impl(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    // ... (similar structure: pop args, validate static context, check memory, calculate gas)

    if (state.rev >= EVMC_SHANGHAI && init_code_size > 0xC000)
        return {EVMC_OUT_OF_GAS, gas_left};
    
    const auto init_code_word_cost = 6 * (Op == OP_CREATE2) + 2 * (state.rev >= EVMC_SHANGHAI);
    const auto init_code_cost = num_words(init_code_size) * init_code_word_cost;
    if ((gas_left -= init_code_cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};
    
    // ... (check depth, balance)
    
    evmc_message msg{.kind = to_call_kind(Op)};
    msg.gas = gas_left;
    if (state.rev >= EVMC_TANGERINE_WHISTLE)
        msg.gas = msg.gas - msg.gas / 64;
    
    // ... (setup message and call host)
    
    const auto result = state.host.call(msg);
    gas_left -= msg.gas - result.gas_left;
    state.gas_refund += result.gas_refund;

    if (result.status_code == EVMC_SUCCESS)
        stack.top() = intx::be::load<uint256>(result.create_address);
        
    return {EVMC_SUCCESS, gas_left};
}
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/advanced_analysis.hpp">
```cpp
/// This file shows `evmone`'s "advanced" analysis, which is a form of optimization.
/// It pre-computes information about basic blocks to speed up execution.
/// This is directly relevant to the `OptimizationEngine` concept.

namespace evmone::advanced
{
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

EVMC_EXPORT AdvancedCodeAnalysis analyze(evmc_revision rev, bytes_view code) noexcept;

}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/eof.cpp">
```cpp
/// `evmone`'s EOF validation is a great example of a structured, multi-stage validation pipeline.
/// This logic can inform the implementation of your `ValidationEngine`.

namespace evmone
{
// ... (helper functions and structs for parsing sections)

EOFValidationError validate_eof1(
    evmc_revision rev, ContainerKind main_container_kind, bytes_view main_container) noexcept
{
    // ...

    while (!container_queue.empty())
    {
        const auto& [container, container_kind] = container_queue.front();

        // 1. Validate header structure and section sizes
        auto error_or_header = validate_header(rev, container);
        if (const auto* error = std::get_if<EOFValidationError>(&error_or_header))
            return *error;
        auto& header = std::get<EOF1Header>(error_or_header);

        // 2. Validate type section contents
        if (const auto err = validate_types(container, header); err != EOFValidationError::success)
            return err;
            
        // 3. Validate code sections
        while (!code_sections_queue.empty())
        {
            // ...

            // 3a. Validate individual instructions
            const auto instr_validation_result_or_error =
                validate_instructions(rev, header, container_kind, code_idx, container);
            // ...

            // 3b. Validate relative jump destinations
            if (!validate_rjump_destinations(header.get_code(container, code_idx)))
                return EOFValidationError::invalid_rjump_destination;

            // 3c. Validate stack usage
            const auto shi_or_error = validate_stack_height(
                header.get_code(container, code_idx), code_idx, header, container);
            // ...
        }

        // ... (and so on for all validation rules)
    }

    return EOFValidationError::success;
}
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.hpp">
```cpp
/// The `evmone` tracing interface is a direct parallel to the proposed `ActionPerformanceTracker`.
/// It allows hooking into the execution lifecycle to gather metrics. The `HistogramTracer` is a
/// concrete example of this.

namespace evmone
{
class ExecutionState;

class Tracer
{
public:
    virtual ~Tracer() = default;

    virtual void on_execution_start(
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept = 0;
    virtual void on_instruction_start(uint32_t pc, const intx::uint256* stack_top, int stack_height,
        int64_t gas, const ExecutionState& state) noexcept = 0;
    virtual void on_execution_end(const evmc_result& result) noexcept = 0;
};

/// Creates the "histogram" tracer which counts occurrences of individual opcodes during execution
/// and reports this data in CSV format.
EVMC_EXPORT std::unique_ptr<Tracer> create_histogram_tracer(std::ostream& out);

/// Creates the tracer which prints instruction trace in JSON format.
EVMC_EXPORT std::unique_ptr<Tracer> create_instruction_tracer(std::ostream& out);

}
```
</file>
</evmone>

## Prompt Corrections

Your prompt provides a solid foundation for a new, high-level action system. Here are a few suggestions and corrections based on patterns from production EVMs like `evmone`:

1.  **Performance of `Action` Object Creation**: The proposed design creates an `Action` struct for every operation. In performance-critical loops like the EVM interpreter, this could introduce significant overhead from memory allocation and object construction. `evmone` avoids this by using a tight loop with a jump table of function pointers and passing a single `ExecutionState` object by reference. Consider if your system can reuse `Action` objects or use a more lightweight approach for simple opcodes.

2.  **State Change Tracking**: `ActionResult` includes `state_changes: []const StateChange`. While this is great for observability, collecting a diff of all state changes can be costly. `evmone`'s host interface modifies state directly and uses a "journal" to track changes for reverts. This is often more performant than creating a separate diff structure on every call. Your design could adopt a similar journaling pattern internally.

3.  **Gas Cost Accuracy in `ActionType`**: The `get_base_gas_cost` function in your `ActionType` enum mixes static base costs (e.g., `SSTORE`) with dynamic costs (e.g., `CALL`'s value transfer cost). In a real EVM, these are distinct:
    *   **Static Cost**: A fixed value charged for the opcode itself.
    *   **Dynamic Cost**: Calculated at runtime based on parameters like memory expansion, data size, or state access (cold vs. warm).
    `evmone`'s `call_impl` function (see snippet) shows how these costs are calculated separately and summed up during execution. It would be more accurate to separate these in your design.

4.  **Action Handler vs. Jump Table**: The `ActionHandler` and `ActionRegistry` implement the Command/Strategy pattern. This is functionally equivalent to `evmone`'s `OpTable`, which is a "jump table" of function pointers. The `evmone` approach is extremely low-level and optimized for performance, using a `switch` statement on opcodes that the compiler can often convert to a jump table. Your design is more abstract and extensible, which is a valid trade-off, but be mindful of the performance implications of the added indirection.



## REVM Context

This is an excellent and well-structured prompt. The proposed `Interpreter Action System` closely mirrors the design patterns used in high-performance EVM implementations like `revm`. Specifically, the concepts of an action/instruction table, structured inputs for calls/creates, and a central interpreter loop are key to `revm`'s architecture.

Here are the most relevant code snippets from `revm` that will provide context for implementing this system.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_action.rs">
```rust
//! Defines the [`InterpreterAction`] that is returned by the interpreter.

// ... imports ...
use std::boxed::Box;

/// Represents the input for a new frame, either a call or a create.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum FrameInput {
    /// `CALL`, `CALLCODE`, `DELEGATECALL`, `STATICCALL`
    /// or EOF `EXTCALL`, `EXTDELEGATECALL`, `EXTSTATICCALL` instruction called.
    Call(Box<CallInputs>),
    /// `CREATE` or `CREATE2` instruction called.
    Create(Box<CreateInputs>),
    /// EOF `CREATE` instruction called.
    EOFCreate(Box<EOFCreateInputs>),
}

/// Result of the interpreter execution.
#[derive(Clone, Debug, Default, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum InterpreterAction {
    /// New frame is created, either a call or a create.
    NewFrame(FrameInput),
    /// Interpreter finished execution.
    Return { result: InterpreterResult },
    /// No action, used as a default value.
    #[default]
    None,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_action/call_inputs.rs">
```rust
//! Inputs for a call.

// ... imports ...

/// Inputs for a call.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CallInputs {
    /// The call data of the call.
    pub input: CallInput,
    /// The return memory offset where the output of the call is written.
    pub return_memory_offset: Range<usize>,
    /// The gas limit of the call.
    pub gas_limit: u64,
    /// The account address of bytecode that is going to be executed.
    pub bytecode_address: Address,
    /// Target address, this account storage is going to be modified.
    pub target_address: Address,
    /// This caller is invoking the call.
    pub caller: Address,
    /// Call value.
    pub value: CallValue,
    /// The call scheme.
    pub scheme: CallScheme,
    /// Whether the call is a static call, or is initiated inside a static call.
    pub is_static: bool,
    /// Whether the call is initiated from EOF bytecode.
    pub is_eof: bool,
}

/// Call scheme.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum CallScheme {
    /// `CALL`.
    Call,
    /// `CALLCODE`
    CallCode,
    /// `DELEGATECALL`
    DelegateCall,
    /// `STATICCALL`
    StaticCall,
    // ...
}

/// Call value.
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum CallValue {
    /// Concrete value, transferred from caller to callee at the end of the transaction.
    Transfer(U256),
    /// Apparent value, that is **not** actually transferred.
    ///
    /// Set when in a `DELEGATECALL` call type, and used by the `CALLVALUE` opcode.
    Apparent(U256),
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_action/create_inputs.rs">
```rust
//! Inputs for a create call.

// ... imports ...
use context_interface::CreateScheme;
use primitives::{Address, Bytes, U256};

/// Inputs for a create call
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CreateInputs {
    /// Caller address of the EVM
    pub caller: Address,
    /// The create scheme
    pub scheme: CreateScheme,
    /// The value to transfer
    pub value: U256,
    /// The init code of the contract
    pub init_code: Bytes,
    /// The gas limit of the call
    pub gas_limit: u64,
}

impl CreateInputs {
    /// Returns the address that this create call will create.
    pub fn created_address(&self, nonce: u64) -> Address {
        match self.scheme {
            CreateScheme::Create => self.caller.create(nonce),
            CreateScheme::Create2 { salt } => self
                .caller
                .create2_from_code(salt.to_be_bytes(), &self.init_code),
            CreateScheme::Custom { address } => address,
        }
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs">
```rust
//! Main EVM interpreter.

// ... imports ...

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

// ...

impl<IW: InterpreterTypes> Interpreter<IW> {
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

/// The result of an interpreter operation.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(::serde::Serialize, ::serde::Deserialize))]
pub struct InterpreterResult {
    /// The result of the instruction execution.
    pub result: InstructionResult,
    /// The output of the instruction execution.
    pub output: Bytes,
    /// The gas usage information.
    pub gas: Gas,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions.rs">
```rust
//! EVM opcode implementations.

// ...

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
    table[DIV as usize] = arithmetic::div;
    // ... more opcodes ...
    table[SLOAD as usize] = host::sload;
    table[SSTORE as usize] = host::sstore;
    // ...
    table[CREATE as usize] = contract::create::<_, false, _>;
    table[CALL as usize] = contract::call;
    table[CALLCODE as usize] = contract::call_code;
    table[RETURN as usize] = control::ret;
    table[DELEGATECALL as usize] = contract::delegate_call;
    table[CREATE2 as usize] = contract::create::<_, true, _>;
    // ...
    table[STATICCALL as usize] = contract::static_call;
    table[REVERT as usize] = control::revert;
    table[INVALID as usize] = control::invalid;
    table[SELFDESTRUCT as usize] = host::selfdestruct;
    table
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/host.rs">
```rust
//! Host trait for the EVM interpreter.

// ...

/// Host trait with all methods that are needed by the Interpreter.
///
/// This trait is implemented for all types that have `ContextTr` trait.
///
/// There are few groups of functions which are Block, Transaction, Config, Database and Journal functions.
pub trait Host {
    /* Block */

    /// Block basefee, calls ContextTr::block().basefee()
    fn basefee(&self) -> U256;
    // ... more block methods

    /* Transaction */

    /// Transaction caller, calls `ContextTr::tx().caller()`
    fn caller(&self) -> Address;
    // ... more transaction methods

    /* Database */

    /// Block hash, calls `ContextTr::journal().db().block_hash(number)`
    fn block_hash(&mut self, number: u64) -> Option<B256>;

    /* Journal */

    /// Selfdestruct account, calls `ContextTr::journal().selfdestruct(address, target)`
    fn selfdestruct(
        &mut self,
        address: Address,
        target: Address,
    ) -> Option<StateLoad<SelfDestructResult>>;

    /// Log, calls `ContextTr::journal().log(log)`
    fn log(&mut self, log: Log);
    /// Sstore, calls `ContextTr::journal().sstore(address, key, value)`
    fn sstore(
        &mut self,
        address: Address,
        key: StorageKey,
        value: StorageValue,
    ) -> Option<StateLoad<SStoreResult>>;

    /// Sload, calls `ContextTr::journal().sload(address, key)`
    fn sload(&mut self, address: Address, key: StorageKey) -> Option<StateLoad<StorageValue>>;
    /// Tstore, calls `ContextTr::journal().tstore(address, key, value)`
    fn tstore(&mut self, address: Address, key: StorageKey, value: StorageValue);
    /// Tload, calls `ContextTr::journal().tload(address, key)`
    fn tload(&mut self, address: Address, key: StorageKey) -> StorageValue;
    /// Balance, calls `ContextTr::journal().load_account(address)`
    fn balance(&mut self, address: Address) -> Option<StateLoad<U256>>;
    /// Load account delegated, calls `ContextTr::journal().load_account_delegated(address)`
    fn load_account_delegated(&mut self, address: Address) -> Option<StateLoad<AccountLoad>>;
    /// Load account code, calls `ContextTr::journal().load_account_code(address)`
    fn load_account_code(&mut self, address: Address) -> Option<StateLoad<Bytes>>;
    /// Load account code hash, calls `ContextTr::journal().code_hash(address)`
    fn load_account_code_hash(&mut self, address: Address) -> Option<StateLoad<B256>>;
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instruction_result.rs">
```rust
//! Instruction result constants.

// ...

#[repr(u8)]
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum InstructionResult {
    // Success Codes
    #[default]
    /// Execution should continue to the next one.
    Continue = 0x00,
    /// Encountered a `STOP` opcode
    Stop,
    /// Return from the current call.
    Return,
    /// Self-destruct the current contract.
    SelfDestruct,
    /// Return a contract (used in contract creation).
    ReturnContract,

    // Revert Codes
    /// Revert the transaction.
    Revert = 0x10,
    // ... more revert reasons

    // Action Codes
    /// Indicates a call or contract creation.
    CallOrCreate = 0x20,

    // Error Codes
    /// Out of gas error.
    OutOfGas = 0x50,
    /// Out of gas error encountered during memory expansion.
    MemoryOOG,
    // ... more errors
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/handler.rs">
```rust
//! Main EVM handler.

// ... imports ...

pub trait Handler {
    // ...
    /// Executes the main frame processing loop.
    #[inline]
    fn run_exec_loop(
        &mut self,
        evm: &mut Self::Evm,
        frame: Self::Frame,
    ) -> Result<FrameResult, Self::Error> {
        let mut frame_stack: Vec<Self::Frame> = vec



## EXECUTION-SPECS Context

An analysis of the `execution-specs` codebase reveals several key patterns and implementations that are highly relevant to building the proposed Interpreter Action System. The most relevant logic is found in how the EVM handles different call types (`CALL`, `CREATE`, etc.), manages state transitions, and calculates gas.

The following files from the `cancun` hardfork (the most recent) provide the best reference implementations.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/interpreter.py">
```python
# src/ethereum/cancun/vm/interpreter.py

# ... (other imports)
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

# ...

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
    # ... (logic to decide between create and call)
    if message.target == Bytes0(b""):
        # ...
        evm = process_create_message(message)
    else:
        evm = process_message(message)
    # ... (result handling)
    # ...
    return MessageCallOutput(
        gas_left=evm.gas_left,
        refund_counter=refund_counter,
        logs=logs,
        accounts_to_delete=accounts_to_delete,
        error=evm.error,
    )


def process_create_message(message: Message) -> Evm:
    """
    Executes a call to create a smart contract.
    """
    state = message.block_env.state
    transient_storage = message.tx_env.transient_storage
    # take snapshot of state before processing the message
    begin_transaction(state, transient_storage)

    # ... (destroy storage at address if collision) ...
    destroy_storage(state, message.current_target)

    # ... (track created accounts)
    mark_account_created(state, message.current_target)

    increment_nonce(state, message.current_target)
    evm = process_message(message)
    if not evm.error:
        contract_code = evm.output
        contract_code_gas = Uint(len(contract_code)) * GAS_CODE_DEPOSIT
        try:
            # ... (validations for contract code)
            charge_gas(evm, contract_code_gas)
            if len(contract_code) > MAX_CODE_SIZE:
                raise OutOfGasError
        except ExceptionalHalt as error:
            rollback_transaction(state, transient_storage)
            # ... (error handling)
        else:
            set_code(state, message.current_target, contract_code)
            commit_transaction(state, transient_storage)
    else:
        rollback_transaction(state, transient_storage)
    return evm


def process_message(message: Message) -> Evm:
    """
    Move ether and execute the relevant code.
    """
    state = message.block_env.state
    transient_storage = message.tx_env.transient_storage
    if message.depth > STACK_DEPTH_LIMIT:
        raise StackDepthLimitError("Stack depth limit reached")

    # take snapshot of state before processing the message
    begin_transaction(state, transient_storage)

    if message.should_transfer_value and message.value != 0:
        move_ether(
            state, message.caller, message.current_target, message.value
        )

    evm = execute_code(message)
    if evm.error:
        # revert state to the last saved checkpoint
        # since the message call resulted in an error
        rollback_transaction(state, transient_storage)
    else:
        commit_transaction(state, transient_storage)
    return evm


def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
    """
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        # ... (EVM initialization)
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            # ... (precompile handling)
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            # ... (tracing)
            op_implementation[op](evm)
            # ... (tracing)
    # ... (exception handling)
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/system.py">
```python
# src/ethereum/cancun/vm/instructions/system.py

# ... (imports)

def generic_create(
    evm: Evm,
    endowment: U256,
    contract_address: Address,
    memory_start_position: U256,
    memory_size: U256,
) -> None:
    """
    Core logic used by the `CREATE*` family of opcodes.
    """
    # ...
    # This function shows the core logic for any contract creation,
    # which is what the `Create` and `Create2` actions would encapsulate.
    # Key steps:
    # 1. Check for write protection, depth limit, and sufficient balance.
    # 2. Check for address collisions.
    # 3. Increment sender nonce.
    # 4. Prepare and process the child message (EVM execution).
    # 5. Handle success (set code) or failure (revert).
    # ...
    child_message = Message(
        # ...
    )
    child_evm = process_create_message(child_message)

    if child_evm.error:
        # ... (handle error)
    else:
        # ... (handle success)


def create(evm: Evm) -> None:
    # STACK
    endowment = pop(evm.stack)
    memory_start_position = pop(evm.stack)
    memory_size = pop(evm.stack)

    # GAS
    # ...

    # OPERATION
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

def create2(evm: Evm) -> None:
    # STACK
    endowment = pop(evm.stack)
    memory_start_position = pop(evm.stack)
    memory_size = pop(evm.stack)
    salt = pop(evm.stack).to_be_bytes32()

    # GAS
    # ...

    # OPERATION
    contract_address = compute_create2_contract_address(
        evm.message.current_target,
        salt,
        memory_read_bytes(evm.memory, memory_start_position, memory_size),
    )

    generic_create(
        evm, endowment, contract_address, memory_start_position, memory_size
    )
    # ...

def generic_call(
    evm: Evm,
    gas: Uint,
    value: U256,
    caller: Address,
    to: Address,
    code_address: Address,
    should_transfer_value: bool,
    is_staticcall: bool,
    # ... (memory parameters)
) -> None:
    """
    Perform the core logic of the `CALL*` family of opcodes.
    """
    # ...
    # This function is the template for `Call`, `StaticCall`, etc. actions.
    # Key steps:
    # 1. Check depth limit.
    # 2. Prepare child message with correct context (caller, value, static).
    # 3. Process the message.
    # 4. Handle results (output data, gas refund).
    # ...
    code = get_account(evm.message.block_env.state, code_address).code
    child_message = Message(
        # ...
        gas=gas,
        value=value,
        caller=caller,
        is_static=True if is_staticcall else evm.message.is_static,
        # ...
    )
    child_evm = process_message(child_message)
    # ... (handle result)

def call(evm: Evm) -> None:
    # STACK
    gas = Uint(pop(evm.stack))
    to = to_address(pop(evm.stack))
    value = pop(evm.stack)
    # ... (memory parameters)

    # GAS
    # ... (gas calculation including warm/cold access)

    # OPERATION
    # ... (check static context, balance)
    generic_call(
        evm,
        message_call_gas.sub_call,
        value,
        evm.message.current_target,
        to,
        code_address,
        True,
        False,
        # ... (memory parameters)
    )
    # ...

def delegatecall(evm: Evm) -> None:
    # STACK
    # ...
    # OPERATION
    # Note how the caller and value are passed from the parent context
    generic_call(
        evm,
        message_call_gas.sub_call,
        evm.message.value,
        evm.message.caller,
        evm.message.current_target,
        code_address,
        False,
        False,
        # ... (memory parameters)
    )
    # ...

def staticcall(evm: Evm) -> None:
    # ...
    # Note how value is hardcoded to 0 and is_staticcall is True
    generic_call(
        evm,
        message_call_gas.sub_call,
        U256(0),
        evm.message.current_target,
        to,
        code_address,
        True,
        True,
        # ... (memory parameters)
    )
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
```python
# src/ethereum/cancun/vm/gas.py
# ...

# These constants are highly relevant for validation and gas estimation.
GAS_CALL_VALUE = Uint(9000)
GAS_NEW_ACCOUNT = Uint(25000)
GAS_COLD_ACCOUNT_ACCESS = Uint(2600)
GAS_WARM_ACCESS = Uint(100)
# ...

def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    # ...

def calculate_message_call_gas(
    value: U256,
    gas: Uint,
    gas_left: Uint,
    memory_cost: Uint,
    extra_gas: Uint,
    call_stipend: Uint = GAS_CALL_STIPEND,
) -> MessageCallGas:
    """
    Calculates the MessageCallGas (cost and gas made available to the sub-call)
    for executing call Opcodes.
    """
    call_stipend = Uint(0) if value == 0 else call_stipend
    if gas_left < extra_gas + memory_cost:
        return MessageCallGas(gas + extra_gas, gas + call_stipend)

    gas = min(gas, max_message_call_gas(gas_left - memory_cost - extra_gas))

    return MessageCallGas(gas + extra_gas, gas + call_stipend)


def max_message_call_gas(gas: Uint) -> Uint:
    """
    Calculates the maximum gas that is allowed for making a message call
    (EIP-150 63/64 rule)
    """
    return gas - (gas // Uint(64))
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/__init__.py">
```python
# src/ethereum/cancun/vm/__init__.py

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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/state.py">
```python
# src/ethereum/cancun/state.py
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
    Rollback a state transaction...
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

    transient_storage._tries = transient_storage._snapshots.pop()
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/runtime.py">
```python
# src/ethereum/cancun/vm/runtime.py
def get_valid_jump_destinations(code: Bytes) -> Set[Uint]:
    """
    Analyze the evm code to obtain the set of valid jump destinations.
    ...
    """
    valid_jump_destinations = set()
    pc = Uint(0)

    while pc < ulen(code):
        try:
            current_opcode = Ops(code[pc])
        except ValueError:
            # Skip invalid opcodes...
            pc += Uint(1)
            continue

        if current_opcode == Ops.JUMPDEST:
            valid_jump_destinations.add(pc)
        elif Ops.PUSH1.value <= current_opcode.value <= Ops.PUSH32.value:
            # If PUSH-N opcodes are encountered, skip the data segment
            push_data_size = current_opcode.value - Ops.PUSH1.value + 1
            pc += Uint(push_data_size)

        pc += Uint(1)

    return valid_jump_destinations
```
</file>
</execution-specs>

---

An interpreter action system aims to encapsulate the logic for state-altering operations like `CALL` and `CREATE`. The `execution-specs` provide a clear model for this, particularly in how a `Message` (analogous to an `Action` in the prompt) is processed to execute a call or create a contract.

The most relevant files are:
1.  `vm/interpreter.py`: Shows the high-level control flow for processing calls and creates (`process_message_call`, `process_create_message`). This is the logic that the `ActionManager` would encapsulate.
2.  `vm/instructions/system.py`: Contains the low-level implementation of opcodes like `CALL` and `CREATE`. The `generic_call` and `generic_create` functions are excellent models for the `execute_fn` in the proposed `ActionHandler`.
3.  `vm/__init__.py`: Defines the `Message` and `Evm` dataclasses, which are analogous to the `Action` and `ExecutionContext` in the prompt, providing the necessary context for execution.
4.  `state.py`: Demonstrates the state snapshot and revert mechanism (`begin_transaction`, `commit_transaction`, `rollback_transaction`) that the action system must correctly manage based on success or failure.
5.  `gas.py`: Details the gas calculation logic, which is essential for the `ValidationEngine` and `Action.estimate_gas_cost` method.

These snippets provide a comprehensive blueprint for implementing the action system's core functionality, validation, and state management logic.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
# The process_message_call function is the high-level entry point for
# handling calls and creates. It's analogous to the proposed
# ActionManager.execute_action, determining whether the action is a `CREATE`
# (target is empty) or a `CALL` and dispatching to the appropriate handler.
# This control flow is central to the action system's design.

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
    block_env = message.block_env
    refund_counter = U256(0)
    if message.target == Bytes0(b""):
        is_collision = account_has_code_or_nonce(
            block_env.state, message.current_target
        ) or account_has_storage(block_env.state, message.current_target)
        if is_collision:
            return MessageCallOutput(
                Uint(0), U256(0), tuple(), set(), set(), AddressCollision()
            )
        else:
            evm = process_create_message(message)
    else:
        evm = process_message(message)
        if account_exists_and_is_empty(
            block_env.state, Address(message.target)
        ):
            evm.touched_accounts.add(Address(message.target))

    if evm.error:
        logs: Tuple[Log, ...] = ()
        accounts_to_delete = set()
        touched_accounts = set()
    else:
        logs = evm.logs
        accounts_to_delete = evm.accounts_to_delete
        touched_accounts = evm.touched_accounts
        refund_counter += U256(evm.refund_counter)

    tx_end = TransactionEnd(
        int(message.gas) - int(evm.gas_left), evm.output, evm.error
    )
    evm_trace(evm, tx_end)

    return MessageCallOutput(
        gas_left=evm.gas_left,
        refund_counter=refund_counter,
        logs=logs,
        accounts_to_delete=accounts_to_delete,
        touched_accounts=touched_accounts,
        error=evm.error,
    )


# process_create_message encapsulates the entire lifecycle of a CREATE action.
# This includes state snapshotting, nonce incrementation, code execution,
# gas calculation for code storage, and committing or rolling back state.
# This logic should be modeled within the `Create` action handler.

def process_create_message(message: Message) -> Evm:
    """
    Executes a call to create a smart contract.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: :py:class:`~ethereum.london.vm.Evm`
        Items containing execution specific objects.
    """
    state = message.block_env.state
    # take snapshot of state before processing the message
    begin_transaction(state)

    # ... (storage destruction logic)

    mark_account_created(state, message.current_target)

    increment_nonce(state, message.current_target)
    evm = process_message(message)
    if not evm.error:
        contract_code = evm.output
        contract_code_gas = Uint(len(contract_code)) * GAS_CODE_DEPOSIT
        try:
            if len(contract_code) > 0:
                if contract_code[0] == 0xEF:
                    raise InvalidContractPrefix
            charge_gas(evm, contract_code_gas)
            if len(contract_code) > MAX_CODE_SIZE:
                raise OutOfGasError
        except ExceptionalHalt as error:
            rollback_transaction(state)
            evm.gas_left = Uint(0)
            evm.output = b""
            evm.error = error
        else:
            set_code(state, message.current_target, contract_code)
            commit_transaction(state)
    else:
        rollback_transaction(state)
    return evm


# process_message encapsulates the logic for a standard CALL action.
# It handles state snapshots, value transfers, and code execution,
# serving as a model for the `Call` action handler.

def process_message(message: Message) -> Evm:
    """
    Move ether and execute the relevant code.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: :py:class:`~ethereum.london.vm.Evm`
        Items containing execution specific objects
    """
    state = message.block_env.state
    if message.depth > STACK_DEPTH_LIMIT:
        raise StackDepthLimitError("Stack depth limit reached")

    # take snapshot of state before processing the message
    begin_transaction(state)

    touch_account(state, message.current_target)

    if message.should_transfer_value and message.value != 0:
        move_ether(
            state, message.caller, message.current_target, message.value
        )

    evm = execute_code(message)
    if evm.error:
        # revert state to the last saved checkpoint
        # since the message call resulted in an error
        rollback_transaction(state)
    else:
        commit_transaction(state)
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/system.py">
```python
# The `generic_call` and `generic_create` functions are excellent models for
# what an ActionHandler's `execute` function should do. They take all
# necessary parameters (analogous to ActionParameters), create a new `Message`
# (analogous to an Action), and process the sub-call or creation.
# This logic is exactly what the new action system aims to abstract.

def generic_create(
    evm: Evm,
    endowment: U256,
    contract_address: Address,
    memory_start_position: U256,
    memory_size: U256,
) -> None:
    # ... (validation checks for sender balance, nonce, depth limit)

    # This is the core logic for a `CREATE` action.
    child_message = Message(
        # ... (parameters from parent evm)
        gas=create_message_gas,
        value=endowment,
        code=call_data,
        current_target=contract_address,
        depth=evm.message.depth + Uint(1),
        # ...
    )
    child_evm = process_create_message(child_message)

    # This is how the result is handled.
    if child_evm.error:
        incorporate_child_on_error(evm, child_evm)
        push(evm.stack, U256(0))
    else:
        incorporate_child_on_success(evm, child_evm)
        push(evm.stack, U256.from_be_bytes(child_evm.message.current_target))


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

    # This is the core logic for a `CALL` action.
    child_message = Message(
        caller=caller,
        target=to,
        gas=gas,
        value=value,
        data=call_data,
        code=code,
        depth=evm.message.depth + Uint(1),
        is_static=True if is_staticcall else evm.message.is_static,
        # ...
    )
    child_evm = process_message(child_message)

    if child_evm.error:
        incorporate_child_on_error(evm, child_evm)
        push(evm.stack, U256(0))
    else:
        incorporate_child_on_success(evm, child_evm)
        push(evm.stack, U256(1))

    # This shows how return data is handled, which is crucial for the
    # `ActionResult` struct.
    actual_output_size = min(memory_output_size, U256(len(child_evm.output)))
    memory_write(
        evm.memory,
        memory_output_start_position,
        child_evm.output[:actual_output_size],
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/__init__.py">
```python
# The `Message` dataclass is the execution-specs equivalent of the proposed
# `Action` or `ActionParameters`. It bundles all context and parameters
# required for a call or create, making it a perfect reference for designing
# the `ActionParameters` union and the `Action` struct.

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

# The `Evm` dataclass serves as the execution context, similar to the
# `ExecutionContext` mentioned in the prompt. It holds the stack, memory,
# gas, and the message being processed.

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

# These functions show how the state of a child call is merged back into the
# parent context, which is analogous to how the ActionManager would process
# an `ActionResult` and update the VM's state.

def incorporate_child_on_success(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of a successful `child_evm` into the parent `evm`.
    """
    evm.gas_left += child_evm.gas_left
    evm.logs += child_evm.logs
    evm.refund_counter += child_evm.refund_counter
    # ... and so on for other state changes.
    evm.accessed_addresses.update(child_evm.accessed_addresses)
    evm.accessed_storage_keys.update(child_evm.accessed_storage_keys)


def incorporate_child_on_error(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of an unsuccessful `child_evm` into the parent `evm`.
    """
    # ... logic for reverting touches, etc.
    evm.gas_left += child_evm.gas_left
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/state.py">
```python
# The state snapshotting mechanism is core to how the EVM handles reverts.
# The `begin_transaction`, `commit_transaction`, and `rollback_transaction`
# functions are directly analogous to the state management that the
# `ActionManager` must perform based on the success or failure of an action.
# This ensures that state changes are atomic within a call frame.

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
    Rollback a state transaction.
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
# Gas calculation for calls is complex and a good candidate for the
# `ValidationEngine` and `Action.estimate_gas_cost`. This function shows all
# the components that go into determining the cost of a call, including
# value transfers, account creation, and warm/cold access costs from EIP-2929.
# This is a key piece of logic for validation and optimization.

def calculate_message_call_gas(
    value: U256,
    gas: Uint,
    gas_left: Uint,
    memory_cost: Uint,
    extra_gas: Uint,
    call_stipend: Uint = GAS_CALL_STIPEND,
) -> MessageCallGas:
    """
    Calculates the MessageCallGas (cost and gas made available to the sub-call)
    for executing call Opcodes.
    """
    call_stipend = Uint(0) if value == 0 else call_stipend
    if gas_left < extra_gas + memory_cost:
        return MessageCallGas(gas + extra_gas, gas + call_stipend)

    gas = min(gas, max_message_call_gas(gas_left - memory_cost - extra_gas))

    return MessageCallGas(gas + extra_gas, gas + call_stipend)


def max_message_call_gas(gas: Uint) -> Uint:
    """
    Calculates the maximum gas that is allowed for making a message call
    (the 63/64 rule).
    """
    return gas - (gas // Uint(64))
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/byzantium/blocks.py">
```python
# The `Log` and `Receipt` structures are direct analogues for what the
# `ActionResult` needs to represent. An action's result isn't just a return
# value, but also includes logs emitted and whether it succeeded.

@slotted_freezable
@dataclass
class Log:
    """
    Data record produced during the execution of a transaction.
    """

    address: Address
    topics: Tuple[Hash32, ...]
    data: Bytes


@slotted_freezable
@dataclass
class Receipt:
    """
    Result of a transaction.
    """

    succeeded: bool
    cumulative_gas_used: Uint
    bloom: Bloom
    logs: Tuple[Log, ...]
```
</file>
</execution-specs>

## Prompt Corrections
The provided prompt is very well-structured and detailed, outlining a robust "Command Pattern" style system for EVM actions. There are no major errors, but here are some refinements based on the `execution-specs` that could make it even more aligned with standard EVM behavior:

1.  **`ActionResult` Structure**: The `ActionResult` should explicitly contain a field for `gas_left` in addition to `gas_used`. The calling context (the `ActionManager` or `Vm`) needs `gas_left` to correctly update its own remaining gas. `gas_used` can be derived from `initial_gas - gas_left`, but having both is common.
2.  **State Management**: The prompt implies the `ActionManager` will handle validation and execution. It's crucial to clarify that the `ActionManager` must also manage state reversion. The state snapshot should be taken *before* executing an action, and then committed or rolled back based on the `ActionResult.success` flag. The `state.py` functions (`begin_transaction`, `commit_transaction`, `rollback_transaction`) are the perfect model for this.
3.  **Gas Calculation for Calls**: The `Action.estimate_gas_cost` method for calls should be more nuanced. It's not just a base cost + value transfer. As `gas.py` shows, it depends on:
    *   The gas requested for the sub-call.
    *   The gas remaining in the current context (the 63/64 rule).
    *   Whether the target account exists and a value is being transferred (account creation cost).
    *   Whether the target account is "warm" or "cold" (EIP-2929 access list cost).
    *   Memory expansion cost.
    The proposed `ValidationEngine` should likely be responsible for this complex calculation.
4.  **Static Call Context**: The prompt correctly identifies the `is_static` flag in `CallParameters`. The `ValidationEngine` or the `Call` action handler must rigorously enforce the "no state modification" rule for `STATICCALL`, which includes checks against `SSTORE`, `LOG*`, `CREATE*`, `SELFDESTRUCT`, and any call with `value > 0`. The `system.py` `call` function demonstrates this check: `if evm.message.is_static and value != U256(0): raise WriteInStaticContext`.

These refinements align the proposed system more closely with the detailed behaviors and edge cases defined in the official execution specifications.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object.
type EVM struct {
	// Context provides information about the current chain and header.
	Context BlockContext

	// StateDB gives access to the underlying state.
	StateDB StateDB

	// run is the indicator whether the EVM is running or not.
	run bool // true if run, false if not
	// ...
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed transaction.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to change state in static mode
	if evm.readOnly && value.Sign() > 0 {
		return nil, gas, ErrWriteProtection
	}
	// Ensure the calle's account exists, creating it if necessary
	snapshot := evm.StateDB.Snapshot()
	if !evm.StateDB.Exist(addr) {
		evm.StateDB.CreateAccount(addr)
	}
	transfer(evm.StateDB, caller.Address(), addr, value, vm.BalanceChangeTransfer)

	// Initialise a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	to := AccountRef(addr)
	contract := NewContract(caller, to, value, gas)
	contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), evm.StateDB.GetCode(addr))

	// Even if the account has no code, we have to continue because it might be a precompile
	ret, err = run(evm, contract, input, false)

	// When an error happens, we revert the state and consume all gas,
	// leaving only the refund value.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != errExecutionReverted {
			// In case of a revert, we have already applied the gas cost, so we should
			// not do it again.
			// In other cases, we should charge all gas.
			contract.UseGas(contract.Gas)
		}
	}
	return ret, contract.Gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to exceed the limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if evm.readOnly {
		return nil, common.Address{}, gas, ErrWriteProtection
	}
	// Create a new account with the specified address
	contractAddr = crypto.CreateAddress(caller.Address(), evm.StateDB.GetNonce(caller.Address()))
	evm.StateDB.CreateAccount(contractAddr)

	// Transfer the value to the new account and set the nonce
	snapshot := evm.StateDB.Snapshot()
	transfer(evm.StateDB, caller.Address(), contractAddr, value, vm.BalanceChangeTransfer)

	// initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution context
	// only.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.Code = code

	// We're executing in a create context, the only thing that applied is the init code.
	// After the execution, the evm will return the code that should be used for the
	// contract.
	ret, err = run(evm, contract, nil, true)
	// check whether the max code size is exceeded
	maxCodeSizeExceeded := evm.chainRules.IsEIP170 && len(ret) > params.MaxCodeSize
	// if the contract creation ran out of gas and the reason is not ErrCodeStoreOutOfGas,
	// we fail the entire transaction, otherwise we return the gas remaining and throw an
	// error to indicate that the code was not stored.
	if err == errCodeStoreOutOfGas && !maxCodeSizeExceeded {
		err = nil // eip-2 compatible create, do nothing, contract is empty
	} else if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != errExecutionReverted {
			contract.UseGas(contract.Gas)
		}
	}
	if maxCodeSizeExceeded {
		err = ErrMaxCodeSizeExceeded // Ensure that the error is set
		if evm.chainRules.IsEIP3860 {
			// EIP-3860 makes this an exceptional halt.
			// Revert state and consume all gas.
			evm.StateDB.RevertToSnapshot(snapshot)
			contract.UseGas(contract.Gas)
		}
	}
	// Assign the code to the contract and check for write protection
	if err == nil {
		evm.StateDB.SetCode(contractAddr, ret)
	}
	return ret, contractAddr, contract.Gas, err
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// operation represents a single operation of the machine.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// gasCost is the static gas cost of the operation
	gasCost gasFunc
	// validateStack validates the stack for the operation
	validateStack stackValidationFunc
	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc

	// willWrite indicates whether the operation writes to state
	willWrite bool
	// valid indicates whether the operation is valid
	valid bool
	// constant indicates whether the operation is constant
	constant bool
	// dynamic indicates whether the operation has a dynamic gas cost
	dynamic bool
	// rstack indicates the number of values the operation returns to the stack
	rstack int
	// precompiles are the precompiled contracts that can be called by the operation
	precompiles map[common.Address]precompiledContract
}

// Run executes the given contract and returns the output as a byte slice and
// an error if one occurred.
//
// The readOnly parameter is used to execute the block in a read-only manner.
// In that case state modifications are not performed, but the used gas is still
// calculated and returned.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	for {
		// ...
		// Get the operation from the jump table and validate the stack
		op := contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		if !operation.valid {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Static portion of gas
		cost := operation.gasCost(in.evm.chainRules, contract, stack, mem)
		if err := contract.UseGas(cost); err != nil {
			return nil, ErrOutOfGas
		}

		// ...

		// Execute the operation
		res, err := operation.execute(&pc, in, contract, mem, stack)
		if err != nil {
			return nil, err
		}
		// ...
		pc++
	}
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall is the CALL operation.
func opCall(pc *uint64, interpreter *EVMInterpreter, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, value, args offset, args size, ret offset, ret size
	// and check stack.
	gas, addr, value, argsOffset, argsSize, retOffset, retSize := stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop()
	// Get the arguments from memory
	args := mem.GetPtr(int64(argsOffset.Uint64()), int64(argsSize.Uint64()))

	// EIP-150: call stipend checks. The call stipend is remaining gas that is given
	// to the callee. If the stipend is greater than the current gas, all gas is
	// given to the callee.
	var stipend uint64
	if value.Sign() > 0 {
		stipend = GasCallStipend
	}
	// Gas is capped to 63/64 of the remaining gas.
	availableGas := contract.Gas - stipend
	gas, err := interpreter.callGas(contract.Gas, availableGas, gas.Uint64())
	if err != nil {
		return nil, err
	}

	ret, returnGas, err := interpreter.evm.Call(contract, common.Address(addr.Bytes20()), args, gas, value.ToBig())
	if err != nil {
		stack.Push(common.U2560)
	} else {
		stack.Push(common.U2561)
	}
	contract.Gas += returnGas
	if err == nil {
		mem.Set(retOffset.Uint64(), retSize.Uint64(), ret)
	}
	return nil, nil
}

// opCreate is the CREATE operation.
func opCreate(pc *uint64, interpreter *EVMInterpreter, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	// Pop value, offset and size from the stack.
	value, offset, size := stack.Pop(), stack.Pop(), stack.Pop()
	if !stack.CanTransfer(value.ToBig()) {
		return nil, ErrInsufficientBalance
	}

	initcode := mem.GetPtr(int64(offset.Uint64()), int64(size.Uint64()))
	gas, err := interpreter.createGas(contract.Gas, initcode)
	if err != nil {
		return nil, err
	}
	contract.UseGas(gas)

	addr, _, returnGas, err := interpreter.evm.Create(contract, initcode, gas, value.ToBig())
	if err == nil {
		stack.Push(addr.Bytes20().ToUint256())
	} else {
		stack.Push(common.U2560)
	}
	contract.Gas += returnGas

	return nil, nil
}

// opCreate2 is the CREATE2 operation.
func opCreate2(pc *uint64, interpreter *EVMInterpreter, contract *Contract, mem *Memory, stack *Stack) ([]byte, error) {
	// Pop endowment, offset, size and salt from the stack.
	endowment, offset, size, salt := stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop()
	if !stack.CanTransfer(endowment.ToBig()) {
		return nil, ErrInsufficientBalance
	}
	// Get the arguments from memory
	initcode := mem.GetPtr(int64(offset.Uint64()), int64(size.Uint64()))
	gas, err := interpreter.createGas(contract.Gas, initcode)
	if err != nil {
		return nil, err
	}
	contract.UseGas(gas)

	// Apply EIP-161 to the create2 address generation.
	addr, _, returnGas, err := interpreter.evm.Create2(contract, initcode, gas, endowment.ToBig(), salt.ToBig())
	if err == nil {
		stack.Push(addr.Bytes20().ToUint256())
	} else {
		stack.Push(common.U2560)
	}
	contract.Gas += returnGas

	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// Gas costs
const (
	GasQuickStep   = 2
	GasFastestStep = 3
	GasFastStep    = 5
	GasMidStep     = 8
	GasSlowStep    = 10
	GasExtStep     = 20

	GasReturn       = 0
	GasStop         = 0
	GasRevert       = 0
	GasCallStipend  = 2300
	GasContractByte = 200
)

// gasCall returns the gas required for the call operation.
//
// The cost of gas was changed during the homestead price change HF.
// As part of EIP-150 (TangerineWhistle), the returned gas is capped
// by the total gas available, ensuring that nesting calls cannot result
// in an overall gas overflow.
func gasCall(interpreter *EVMInterpreter, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	// ... (gas calculation logic including memory expansion and value transfer)
	var (
		gas      = stack.Back(0)
		addr     = stack.Back(1)
		value    = stack.Back(2)
		gasPrice = contract.value
	)
	cost, err := memoryCost(mem, stack, 4, 2)
	// ... (additional cost calculations for value transfer and new account creation)
	available := contract.Gas() - cost
	req, err := calculateGas(interpreter.evm.chainRules, available, gas, gasPrice)
	// ...
	return cost + req, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an EVM database for full state processing.
type StateDB struct {
	// ...
}

// Snapshot returns an identifier for the current revision of the state.
func (s *StateDB) Snapshot() int {
	id := s.nextRevisionId
	s.nextRevisionId++
	s.validRevisions = append(s.validRevisions, revision{id, len(s.journal)})
	return id
}

// RevertToSnapshot reverts all state changes made since the given revision.
func (s *StateDB) RevertToSnapshot(revid int) {
	// Find the snapshot in the stack of valid snapshots.
	idx := sort.Search(len(s.validRevisions), func(i int) bool {
		return s.validRevisions[i].id >= revid
	})
	if idx == len(s.validRevisions) || s.validRevisions[idx].id != revid {
		return
	}
	// Revert the journal to the snapshot and discard any snapshots created after.
	snapshot := s.validRevisions[idx].journalIndex
	s.journal.revert(s, snapshot)
	s.validRevisions = s.validRevisions[:idx]
}

// AddLog adds a log to the current transaction's log set.
func (s *StateDB) AddLog(log *types.Log) {
	s.journal.append(addLogChange{txhash: s.thash})
	log.TxHash = s.thash
	log.TxIndex = uint(s.txIndex)
	log.Index = s.logSize
	s.logs[s.thash] = append(s.logs[s.thash], log)
	s.logSize++
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/timer.go">
```go
// Timer captures the duration and rate of events, using a Histogram and a Meter.
type Timer struct {
	histogram Histogram
	meter     *Meter
	mutex     sync.Mutex
}

// NewTimer constructs a new Timer using an exponentially-decaying
// sample with the same reservoir size and alpha as UNIX load averages.
// Be sure to call Stop() once the timer is of no use to allow for garbage collection.
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

// Rate1 returns the one-minute moving average rate of events per second at the
// time the snapshot was taken.
func (t *TimerSnapshot) Rate1() float64 { return t.meter.Rate1() }

// Mean returns the mean value at the time the snapshot was taken.
func (t *TimerSnapshot) Mean() float64 { return t.histogram.Mean() }

// ... and other statistics (Max, Min, StdDev, Percentiles etc.)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
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

// NewMeter constructs a new Meter and launches a goroutine.
func NewMeter() *Meter {
	m := newMeter()
	arbiter.add(m)
	return m
}

// Mark records the occurrence of n events.
func (m *Meter) Mark(n int64) {
	m.uncounted.Add(n)
}

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

// RateMean returns the meter's mean rate of events per second at the time the
// snapshot was taken.
func (m *MeterSnapshot) RateMean() float64 { return m.rateMean }
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/registry.go">
```go
// A Registry holds references to a set of metrics by name and can iterate
// over them, calling callback functions provided by the user.
type Registry interface {
	// Each call the given function for each registered metric.
	Each(func(string, interface{}))

	// Get the metric by the given name or nil if none is registered.
	Get(string) interface{}

	// GetAll metrics in the Registry.
	GetAll() map[string]map[string]interface{}

	// GetOrRegister gets an existing metric or registers the given one.
	// The interface can be the metric to register if not found in registry,
	// or a function returning the metric for lazy instantiation.
	GetOrRegister(string, interface{}) interface{}

	// Register the given metric under the given name.
	Register(string, interface{}) error
}

// GetAll metrics in the Registry
func (r *StandardRegistry) GetAll() map[string]map[string]interface{} {
	data := make(map[string]map[string]interface{})
	r.Each(func(name string, i interface{}) {
		values := make(map[string]interface{})
		switch metric := i.(type) {
		case *Counter:
			values["count"] = metric.Snapshot().Count()
		case *Gauge:
			values["value"] = metric.Snapshot().Value()
		case Histogram:
			h := metric.Snapshot()
			ps := h.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
			values["count"] = h.Count()
			values["min"] = h.Min()
			values["max"] = h.Max()
			values["mean"] = h.Mean()
			values["stddev"] = h.StdDev()
			//...
		case *Meter:
			m := metric.Snapshot()
			values["count"] = m.Count()
			values["1m.rate"] = m.Rate1()
			//...
		case *Timer:
			t := metric.Snapshot()
			ps := t.Percentiles([]float64{0.5, 0.75, 0.95, 0.99, 0.999})
			values["count"] = t.Count()
			values["min"] = t.Min()
			//...
			values["1m.rate"] = t.Rate1()
			//...
		}
		data[name] = values
	})
	return data
}
```
</file>
</go-ethereum>

---

An excellent and detailed prompt. The proposed `Interpreter Action System` is a sophisticated approach that resembles the Command and Strategy patterns, abstracting EVM operations like `CALL` and `CREATE` into manageable, validatable, and optimizable units.

Go-ethereum implements this logic through a combination of the `EVM` object, the `stateTransition` process, and the opcode implementations in the `interpreter`. The following snippets from the go-ethereum codebase provide direct analogues and implementation context for the system you're building.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_transition.go">
```go
// stateTransition represents a state transition. It is the result of a
// transaction being applied to the current world state.
// The state transitioning model does all the necessary work to work out a valid new
// state root.
// This is analogous to your `ActionManager` orchestrating a single action.
type stateTransition struct {
	gp           *GasPool
	msg          Message
	gas          uint64
	initialGas   uint64
	value        *big.Int
	data         []byte
	state        vm.StateDB
	evm          *vm.EVM
	precompiles  []common.Address
	initialAddrs map[common.Address]struct{}
}

// ApplyMessage computes the new state by applying the given message
// against the old state within the environment.
//
// ApplyMessage returns the bytes returned by any EVM execution (if it took place),
// the gas used (which includes gas refunds) and an error if it failed. An error always
// indicates a core error meaning that the message would always fail for that particular
// state and would never be accepted within a block.
// This function is the top-level entry point for executing a transaction, similar to
// your `ActionManager.execute_action`. It handles the entire lifecycle: validation,
// gas payment, execution, and cleanup.
func ApplyMessage(evm *vm.EVM, msg Message, gp *GasPool) (*ExecutionResult, error) {
	return NewStateTransition(evm, msg, gp).TransitionDb()
}

// TransitionDb will transition the state by applying the current message and
// returning the evm execution result with following fields.
//
// - used gas: total gas used (including gas being refunded)
// - returndata: the returned data from evm
// - concrete execution error: various EVM errors which abort the execution, e.g.
//   ErrOutOfGas, ErrExecutionReverted
//
// However if any consensus issue encountered, return the error directly with
// nil evm execution result.
func (st *stateTransition) TransitionDb() (*ExecutionResult, error) {
	// First, validate the transaction sender.
	// The payment for gas is deducted in this step.
	// This is analogous to your `ValidationEngine`'s pre-checks.
	if err := st.preCheck(); err != nil {
		return nil, err
	}
	msg := st.msg
	sender := vm.AccountRef(msg.From())
	contractCreation := msg.To() == nil

	// Pay intrinsic gas.
	gas, err := IntrinsicGas(st.data, st.msg.AccessList(), contractCreation, true, true, st.evm.chainRules.IsEIP2028, st.evm.chainRules.IsShanghai)
	if err != nil {
		return nil, err
	}
	if st.gas < gas {
		return nil, fmt.Errorf("%w: have %d, want %d", ErrIntrinsicGas, st.gas, gas)
	}
	st.gas -= gas

	// Run the EVM execution. This is where the core action (call or create) happens.
	var (
		ret   []byte
		vmerr error // vm errors do not effect consensus and are therefore not assigned to err
	)
	if contractCreation {
		ret, _, st.gas, vmerr = st.evm.Create(sender, st.data, st.gas, st.value)
	} else {
		// Increment the nonce for the next transaction.
		st.state.SetNonce(msg.From(), st.state.GetNonce(sender.Address())+1)
		ret, st.gas, vmerr = st.evm.Call(sender, st.to(), st.data, st.gas, st.value)
	}

	// Refund remaining gas.
	st.refund()
	st.state.AddBalance(st.evm.Context.Coinbase, new(big.Int).Mul(new(big.Int).SetUint64(st.gasUsed()), st.msg.GasPrice()), tracing.BalanceIncreaseRewardTransactionFee)

	// This `ExecutionResult` struct is a direct parallel to your `ActionResult`.
	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}

// preCheck performs a preliminary check, verifies sender's balance and nonce.
// This provides excellent context for your `ValidationEngine`.
func (st *stateTransition) preCheck() error {
	// Make sure this transaction's nonce is correct.
	if st.msg.CheckNonce() {
		nonce := st.state.GetNonce(st.msg.From())
		if nonce < st.msg.Nonce() {
			return fmt.Errorf("%w: address %v, tx: %d state: %d", ErrNonceTooHigh, st.msg.From().Hex(), st.msg.Nonce(), nonce)
		} else if nonce > st.msg.Nonce() {
			return fmt.Errorf("%w: address %v, tx: %d state: %d", ErrNonceTooLow, st.msg.From().Hex(), st.msg.Nonce(), nonce)
		}
	}
	// Make sure the sender is an EOA.
	if !st.msg.skipAccountCheck() && st.state.GetCodeSize(st.msg.From()) > 0 {
		return ErrSenderNoEOA
	}
	// Ensure the sender has enough funds to cover the transaction costs.
	if err := st.buyGas(); err != nil {
		return err
	}
	return nil
}

// ExecutionResult includes all output after executing given evm message no matter
// the execution itself is successful or not.
// This is a direct parallel to your `ActionResult` struct.
type ExecutionResult struct {
	UsedGas    uint64 // Total used gas, not including the refunded gas
	Err        error  // Any error encountered during the execution(listed in core/vm/errors.go)
	ReturnData []byte // Returned data from evm(function result or data supplied with revert opcode)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts of the
// state transition function.
// This is analogous to your `ActionManager`, as it holds context and provides the
// methods to execute `CALL` and `CREATE` actions.
type EVM struct {
	// Context provides information about the current transaction and block.
	Context
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// Depth is the current call stack depth.
	depth int
	// chainRules are the consensus parameters for the current chain.
	chainRules params.Rules
	// chainConfig contains information about the current chain.
	chainConfig *params.ChainConfig
	// readOnly specifies whether the EVM is in read-only mode.
	readOnly bool
	// returnData is the return data of the last call.
	returnData []byte
}

// These functions are the core "Action Handlers" you are looking to implement.
// They manage the setup of a new call frame (a new `Contract` object),
// execute the interpreter, and handle the results.

// Call runs the code of the given account with the given input data and returns
// the return data and an error if one occurred.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() != 0 {
		return nil, gas, ErrWriteProtection
	}
	// ... (snapshotting and value transfer logic) ...

	// Create the new contract reference for the call
	code := evm.StateDB.GetCode(addr)
	if code == nil {
		code = []byte{}
	}
	// Create a new contract object for the execution and run it
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), code)

	// This is the core execution step.
	ret, err = run(evm, contract, input, false)

	// When the execution finishes, retrieve the leftover gas and return it
	return ret, contract.Gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check for create environment.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if evm.readOnly {
		return nil, common.Address{}, gas, ErrWriteProtection
	}
	// ... (value transfer logic) ...

	// Create a new account on the state
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	// ... (collision checks) ...
	
	snapshot := evm.StateDB.Snapshot()

	// Create a new contract reference for the initialization code
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	
	// This is the execution of the `init` code.
	ret, err = run(evm, contract, code, true)

	// Check whether the max code size is exceeded, if the contract creation ran successfully.
	maxCodeSizeExceeded := evm.chainRules.IsEIP170 && len(ret) > params.MaxCodeSize
	
	// If the contract creation succeeds, store the creation code and cost.
	if err == nil && !maxCodeSizeExceeded {
		createDataGas := uint64(len(ret)) * params.CreateDataGas
		if contract.UseGas(createDataGas) {
			evm.StateDB.SetCode(contractAddr, ret)
		} else {
			err = ErrCodeStoreOutOfGas
		}
	}
	// ... (error handling and gas refunding) ...

	return ret, contractAddr, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// These functions are the bridge between the EVM's stack-based instruction set
// and the higher-level "actions" like `evm.Call` or `evm.Create`. They demonstrate
// how parameters for an action are popped from the stack. This is directly
// relevant to your `ActionParameters` struct.

func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, value, arguments offset and size, return offset and size
	gas, addr, value, argsOffset, argsSize, retOffset, retSize := stack.Pop7()
	
	// ... (gas and memory expansion calculations) ...

	// Get the arguments from memory
	args := memory.GetPtr(int64(argsOffset), int64(argsSize))

	// The actual "action" is invoked here.
	ret, returnGas, err := evm.Call(contract, addr.Address(), args, gas.Uint64(), value.ToBig())

	// ... (handling results, pushing to stack) ...
	return nil, nil
}

func opCreate(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop value, offset and size from the stack
	value, offset, size := stack.Pop3()
	
	// Get the initialization code from memory
	code := memory.GetPtr(int64(offset), int64(size))

	// ... (gas calculation) ...
	
	// Execute the CREATE action
	_, address, returnGas, vmerr := evm.Create(contract, code, gas, value.ToBig())
	
	// ... (handle results, push address to stack) ...
	return nil, nil
}

func opStaticCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, arguments offset and size, return offset and size
	gas, addr, argsOffset, argsSize, retOffset, retSize := stack.Pop6()

	// Get arguments from memory
	args := memory.GetPtr(int64(argsOffset), int64(argsSize))

	// Static call is a variant of the CALL action
	ret, returnGas, err := evm.StaticCall(contract, addr.Address(), args, gas.Uint64())
	
	// ... (handle results) ...
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// Contract represents an Ethereum contract in the state machine. It contains the
// code of the contract and the parameters for the current call.
// This is a direct analogue to your proposed `Action` struct, holding the context
// for a single execution instance.
type Contract struct {
	// CallerAddress is the result of the caller stack frame and is used when
	// the CALLER opcode is executed.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	analysis  bitvec         // result of code analysis.

	Code     []byte
	CodeHash common.Hash
	CodeAddr *common.Address
	Input    []byte

	value *big.Int
	Gas   uint64

	// convert a big integer to a 256-bit EVM number
	Args []byte

	// delegateCall tracks whether the current execution is a DELEGATECALL or not.
	delegateCall bool
}

// NewContract returns a new contract environment for the execution of EVM bytecode.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	contract := &Contract{
		caller:        caller,
		self:          object,
		Gas:           gas,
		value:         value,
		CallerAddress: caller.Address(),
	}
	return contract
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// callGas calculates the gas required for calling a contract.
//
// This function is complex because the gas cost depends on a number of factors
// that are only known at runtime.
// This is an excellent reference for your `ValidationEngine` and `Action.estimate_gas_cost`.
func callGas(isEip2929 bool, availableGas uint64, base uint64, callCost *big.Int) (uint64, error) {
	// EIP-150: call costs 63/64ths of available gas.
	//
	// We need to root out the following exceptional cases:
	// 1. The available gas is less than the cost of the call
	// 2. The available gas is less than 1/64th of the available gas.
	//
	// N.B. we're not checking for underflows in the gas defining terms,
	// they are checked above this call.
	gas := availableGas
	if isEip2929 {
		// All but one 64th of the available gas is available to the callee.
		// Attach this extra gas to the call stipend.
		gas = gas - gas/64
	}
	// Make sure we have enough gas to cover the call costs.
	if gas < base {
		return 0, ErrOutOfGas
	}
	gas -= base

	// The call cost is passed as a big integer, if it's not in the
	// uint64 range, the result is computed here.
	if !callCost.IsUint64() {
		// This is guaranteed to be < availableGas, so we can't really
		// overflow here.
		return gas, nil
	}
	cost64 := callCost.Uint64()
	if gas < cost64 {
		return gas, nil // cap gas.
	}
	return cost64, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// This file shows how go-ethereum maps opcodes to their implementations, including
// pre-validation of stack requirements. This is directly analogous to your
// `ActionRegistry` and `ActionHandler` concepts.

// operation is the low level representation of a single opcode.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// gasCost is the gas function for the operation
	gasCost gasFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max stack height after operation
	maxStack int

	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc
}

// JumpTable is a lookup table for EVM opcodes.
type JumpTable [256]*operation

// new...JumpTable functions create the jump table for a specific hard fork.
// Notice how the table is constructed with different operations based on the rules.
func newByzantiumJumpTable() JumpTable {
	// Instructions are inherited from Homestead.
	jt := newHomesteadJumpTable()

	// New instructions are added.
	jt[REVERT] = &operation{
		execute:    opRevert,
		gasCost:    gasRevert,
		minStack:   revertStack,
		maxStack:   revertStack,
		memorySize: memoryRevert,
	}
	// ... other opcodes
	return jt
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interfaces.go">
```go
// This file defines the StateDB interface, which is the abstraction the EVM uses
// to interact with the world state. This is relevant for understanding what
// context your `ExecutionContext` needs to provide and what state changes your
// `ActionResult` needs to represent.

// StateDB is an EVM database for full state processing.
type StateDB interface {
	CreateAccount(common.Address)

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

	// AddAddressToAccessList adds the given address to the access list.
	AddAddressToAccessList(addr common.Address)
	// AddSlotToAccessList adds the given (address, slot) to the access list.
	AddSlotToAccessList(addr common.Address, slot common.Hash)
	// AddressInAccessList returns true if the given address is in the access list.
	AddressInAccessList(addr common.Address) bool
	// SlotInAccessList returns true if the given (address, slot) is in the access list.
	SlotInAccessList(addr common.Address, slot common.Hash) (addressPresent bool, slotPresent bool)

	//...
}
```
</file>
</go-ethereum>

---

An interpreter action system is a design pattern used to encapsulate all information needed to perform an action or trigger an event. In the context of the EVM, this means representing operations like `CALL` or `CREATE` as distinct "action" objects that can be managed, validated, and executed in a structured way. This approach contrasts with a monolithic `switch` statement for opcodes, promoting better separation of concerns and extensibility.

The go-ethereum (Geth) EVM implementation provides excellent context for this task. While it doesn't use the exact "Action" object pattern from the prompt, it employs a highly optimized `JumpTable` that maps opcodes to `Operation` structs. These structs contain function pointers for execution and gas calculation, along with metadata for stack validation. This is functionally equivalent to the prompt's `ActionRegistry` and `ActionHandler` system.

The core logic for handling calls and creates is found within the `EVM` object's methods (`Call`, `Create`, `Create2`, etc.), which are invoked by the opcode implementations. This logic includes crucial validation steps (e.g., stack depth, read-only checks) and state management (e.g., snapshotting for reverts) that are directly relevant to implementing the prompt's `ValidationEngine` and `ActionManager`.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
The interpreter's `Run` method is the heart of the EVM execution loop. It demonstrates the fetch-decode-execute cycle that the proposed `ActionManager` would orchestrate. It shows how an `Operation` (analogous to an `ActionHandler`) is retrieved from a `JumpTable` (analogous to an `ActionRegistry`) and then used to validate stack requirements and execute the instruction.

```go
// Run executes the given code against the present state and returns the result,
// any error that occurred, and the amount of gas left.
//
// Note that the returned gas is the amount of gas remaining after the execution
// and it is up to the caller to re-add the remaining gas to the calling contract
// or collecting it as a refund.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() {
		in.evm.depth--
	}()

	// Make sure the readOnly is only set if we're in a static call
	if in.readOnly && !readOnly {
		panic("Interpreter readOnly is true but readOnly argument is false")
	}
	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		returnData  = []byte{}    // last CALL's return data for subsequent reuse
		callContext = &callCtx{
			memory:   mem,
			stack:    stack,
			rval:     new(uint256.Int),
			contract: contract,
		}
		// For optimisation, reference stack within function calls
		// rather than passing it as a parameter.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64
		gasCopy uint64
		// tracer enabled
		tracer                  vm.EVMLogger
		makeTracer, tracerError = in.evm.NewTracer()
	)
	if tracerError != nil {
		return nil, tracerError
	}
	if makeTracer {
		tracer = makeTracer(in.evm.Context, contract.caller, *contract.Address(), input, contract.value)
	}
	contract.Input = input

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	// It's important that we're sure that `in.readOnly` is not true
	// if we're not in a static call.
	readOnly = readOnly || in.readOnly

	// Retrieve the jump table for the current EVM version.
	var jt = in.evm.jt
	for {
		if tracer != nil {
			pcCopy = pc
			gasCopy = contract.Gas
		}
		// Get the operation from the jump table and validate the stack to ensure
		// there are enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := jt[op]
		if operation == nil {
			return nil, &ErrInvalidOpCode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			if tracer != nil {
				tracer.CaptureFault(pc, op, gasCopy, cost, mem, stack, in.evm.depth, err)
			}
			return nil, err
		}
		// Static call violation check
		if operation.writes && readOnly {
			return nil, ErrWriteProtection
		}

		// Execute the operation
		var memorySize uint64
		// N.B. memorySize is not used for all opcodes.
		if operation.memorySize != nil {
			memSize, overflow := operation.memorySize(stack)
			if overflow {
				return nil, ErrGasUintOverflow
			}
			// memory is expanded in words of 32 bytes. The new size is returned
			// in bytes.
			if memorySize, err = mem.Resize(memSize); err != nil {
				if tracer != nil {
					tracer.CaptureFault(pc, op, gasCopy, cost, mem, stack, in.evm.depth, err)
				}
				return nil, err
			}
		}
		// calculate the new cost and subtract it
		cost, err = operation.gasCost(in.evm.chainRules, in.evm, contract, stack, mem, memorySize)
		if err != nil || !contract.UseGas(cost) {
			if tracer != nil {
				tracer.CaptureFault(pc, op, gasCopy, cost, mem, stack, in.evm.depth, ErrOutOfGas)
			}
			return nil, ErrOutOfGas
		}

		if tracer != nil {
			tracer.CaptureState(pc, op, gasCopy, cost, mem, stack, returnData, in.evm.depth, err)
		}
		// execute the operation
		res, err := operation.execute(&pc, in, callContext)
		if err != nil {
			if tracer != nil {
				tracer.CaptureFault(pc, op, gasCopy, cost, mem, stack, in.evm.depth, err)
			}
			return nil, err
		}
		if len(res) > 0 {
			returnData = res
		}

		switch op {
		case RETURN, REVERT:
			return res, nil
		case STOP:
			return nil, nil
		}
		pc++
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jumptable.go">
Geth's `JumpTable` and `Operation` struct are direct architectural parallels to the prompt's `ActionRegistry` and `ActionHandler`. The `Operation` struct bundles the execution logic, gas calculation functions, and stack validation metadata for each opcode. This demonstrates a structured, extensible way to define EVM instructions, which can be adapted for the proposed "action" system.

```go
// Operation is the virtual machine's representation of an opcode.
type Operation struct {
	// execute is the opcode's execution function.
	execute executionFunc
	// constantGas is the gas that is charged unconditionally.
	constantGas uint64
	// dynamicGas is the gas that is charged based on the stack and memory.
	dynamicGas gasFunc
	// memorySize returns the memory size required for the operation.
	memorySize memorySizeFunc
	// minStack tells how many stack items are required.
	minStack int
	// maxStack specifies the max stack limit for the operation.
	maxStack int

	// Toggles whether the instruction is enabled, and whether it will read or
	// write to the state.
	enabled bool
	writes  bool
	valid   bool // The opcode is valid
}

// JumpTable contains the EVM opcodes supported by a virtual machine.
type JumpTable [256]*Operation

// newLondonInstructionSet returns the London instruction set.
// The RETURN and REVERT opcodes are not included here, since they are handled
// by the interpreter.
func newLondonInstructionSet() JumpTable {
	// Initialise the instruction set with a base of all Byzantium instructions.
	instructionSet := newByzantiumInstructionSet()
	instructionSet[BASEFEE] = &Operation{
		execute:     opBaseFee,
		constantGas: GasQuickStep,
		minStack:    0,
		maxStack:    1,
		enabled:     true,
	}
	return instructionSet
}

// ... (other hardfork initializers) ...

// newByzantiumInstructionSet returns the Byzantium instruction set.
func newByzantiumInstructionSet() JumpTable {
	instructionSet := newSpuriousDragonInstructionSet()
	instructionSet[RETURNDATASIZE] = &Operation{
		execute:     opReturnDataSize,
		constantGas: GasQuickStep,
		minStack:    0,
		maxStack:    1,
		enabled:     true,
	}
	instructionSet[RETURNDATACOPY] = &Operation{
		execute:     opReturnDataCopy,
		constantGas: GasFastestStep,
		dynamicGas:  gasReturnDataCopy,
		minStack:    3,
		maxStack:    3,
		memorySize:  memoryReturnDataCopy,
		enabled:     true,
	}
	instructionSet[STATICCALL] = &Operation{
		execute:     opStaticCall,
		constantGas: GasCall,
		dynamicGas:  gasStaticCall,
		minStack:    6,
		maxStack:    1,
		memorySize:  memoryStaticCall,
		enabled:     true,
	}
	instructionSet[REVERT] = &Operation{
		execute:     opRevert,
		constantGas: GasStop,
		dynamicGas:  gasRevert,
		minStack:    2,
		maxStack:    2,
		memorySize:  memoryRevert,
		enabled:     true,
	}
	return instructionSet
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
The `opCall` and `opCreate` functions are excellent examples of "action handlers" for the respective actions. They show how to:
1.  Pop necessary parameters from the stack.
2.  Perform initial validation (read-only checks, depth limits).
3.  Calculate memory usage and gas costs.
4.  Delegate to the core `EVM.Call` or `EVM.Create` methods.
5.  Handle the result, updating the stack and `returnData` buffer.
This provides a clear template for implementing the `execute_call` and `execute_create` handlers specified in the prompt.

```go
func opCall(pc *uint64, interpreter *EVMInterpreter, callContext *callCtx) ([]byte, error) {
	stack := callContext.stack
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	gas, addr, value, argsOffset, argsSize, retOffset, retSize := stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop()
	// Ensure the address is reasonable, don't waste gas on large number parsing.
	// If it's a stack underflow, we'll already have failed further up
	if !addr.IsUint64() || !gas.IsUint64() {
		return nil, ErrGasUintOverflow
	}
	// Get the arguments from the memory
	args := callContext.memory.GetPtr(int64(argsOffset.Uint64()), int64(argsSize.Uint64()))

	// Static calls can't call with value
	if interpreter.readOnly && value.Sign() != 0 {
		return nil, ErrWriteProtection
	}
	if !interpreter.evm.StateDB.Exist(common.Address(addr.Bytes20())) {
		// Non-existent accounts are only charged if they are accessed with a CALL that transfers value.
		// There are two cases when this can happen:
		// 1. The account is not on the access list and the value is non-zero.
		// 2. The account is on the access list and the value is non-zero and the account is dead.
		isEip2929 := interpreter.evm.chainRules.IsBerlin
		if isEip2929 {
			interpreter.evm.StateDB.AddAddressToAccessList(common.Address(addr.Bytes20()))
		}
		if value.Sign() != 0 && (!isEip2929 || !interpreter.evm.StateDB.HasSuicided(common.Address(addr.Bytes20()))) {
			callContext.gas += GasCallNewAccount
		}
	}
	if value.Sign() != 0 {
		callContext.gas += GasCallValueTransfer
	}
	// Perform the call
	ret, leftOverGas, err := interpreter.evm.Call(callContext.contract, common.Address(addr.Bytes20()), args, callContext.gas, value.ToBig())
	if err != nil {
		stack.Push(uint256.NewInt(0))
	} else {
		stack.Push(uint256.NewInt(1))
	}
	if err == nil || err == ErrExecutionReverted {
		callContext.returnData = ret
		callContext.memory.Set(retOffset.Uint64(), retSize.Uint64(), ret)
	}
	contract.Gas += leftOverGas

	return nil, nil
}

func opCreate(pc *uint64, interpreter *EVMInterpreter, callContext *callCtx) ([]byte, error) {
	if interpreter.readOnly {
		return nil, ErrWriteProtection
	}
	stack := callContext.stack
	value, offset, size := stack.Pop(), stack.Pop(), stack.Pop()
	if !value.IsUint64() || !offset.IsUint64() || !size.IsUint64() {
		return nil, ErrGasUintOverflow
	}
	// Fetch the code from memory
	code := callContext.memory.GetPtr(int64(offset.Uint64()), int64(size.Uint64()))

	// EIP-3860: initcode cost
	if interpreter.evm.chainRules.IsShanghai {
		if err := interpreter.chargeInitCode(uint64(len(code))); err != nil {
			return nil, err
		}
	}
	// make a snapshot of the current state
	interpreter.evm.StateDB.Snapshot()

	// run the code
	addr, _, gasLeft, vmerr := interpreter.evm.Create(callContext.contract, code, callContext.gas, value.ToBig())
	if vmerr != nil && vmerr != ErrExecutionReverted {
		interpreter.evm.StateDB.RevertToSnapshot(interpreter.evm.StateDB.Snapshot())
	}
	// In case of a reversion, we still want to add the created address to the
	// access list.
	interpreter.evm.StateDB.AddAddressToAccessList(addr)
	// check whether the max code size has been exceeded
	if vmerr == nil && interpreter.evm.chainRules.IsEIP170 && len(interpreter.evm.StateDB.GetCode(addr)) > params.MaxCodeSize {
		vmerr = ErrMaxCodeSizeExceeded
		interpreter.evm.StateDB.RevertToSnapshot(interpreter.evm.StateDB.Snapshot())
	}
	// Finalise the create. If the constructor returned successfully, the request
	// is to store the returned data as code.
	if vmerr == nil {
		interpreter.evm.StateDB.Finalise(true)
	}
	// Push the address to the stack
	if vmerr != nil {
		stack.Push(uint256.NewInt(0))
		if vmerr == ErrExecutionReverted {
			// In case of a reversion, the gas left is not consumed, and needs
			// to be added back to the pool.
			callContext.gas += gasLeft
		}
	} else {
		stack.Push(addr.Bytes())
	}
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
The `EVM.Call`, `EVM.Create`, and `EVM.Create2` methods contain the core logic that the prompt's action handlers would need to implement. They are responsible for critical validation checks, state modifications, and managing the execution of sub-contexts. This code is the most direct reference for the actual implementation details required.

```go
// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() != 0 {
		return nil, gas, ErrWriteProtection
	}
	// Make sure we can execute said contract in the current environment
	if !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}
	var (
		to       = AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	if !evm.StateDB.Exist(addr) {
		if !evm.chainRules.IsEIP158 && value.Sign() == 0 {
			// In EIP158, the call to a non-existent account is allowed,
			// but should not be executed. In other forks, the call is
			// simply disallowed.
			evm.StateDB.RevertToSnapshot(snapshot)
			return nil, gas, nil
		}
		// Transfer value, and create account.
		evm.Transfer(evm.StateDB, caller.Address(), to.Address(), value)
		// ...
	} else {
		// Transfer value, which will be reverted if not success
		evm.Transfer(evm.StateDB, caller.Address(), to.Address(), value)
	}
	// check whether the target is a precompiled contract
	if p := evm.precompile(addr); p != nil {
		return RunPrecompiledContract(p, input, gas)
	}
	code, codeHash := evm.StateDB.GetCode(addr), evm.StateDB.GetCodeHash(addr)
	if len(code) == 0 {
		ret, err = nil, nil // treat as no-op
	} else {
		// Initialise a new contract and set the code that is to be used by the
		// EVM. The contract is a scoped environment for this execution.
		contract := NewContract(caller, to, value, gas)
		contract.SetCodeOptional(codeHash, code)
		ret, err = evm.interpreter.Run(contract, input, evm.readOnly)
	}
	// When the execution finishes, we need to accumulate the left over gas
	// and reset the state in case of a revert.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			gas = 0
		}
	}
	return ret, gas, err
}

// Create creates a new contract using the EVM create method.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to create a contract via
	// CREATE in a static call.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if evm.readOnly {
		return nil, common.Address{}, gas, ErrWriteProtection
	}
	// Ensure the originator has enough balance for value transfer.
	// This is not going to be a problem for CREATE, since the net balance change
	// is zero, but is needed for CREATE2 which removes gas from balance.
	// It's also good practice to check it here.
	if !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Increment the nonce of the caller's account
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	// Determine the new contract address
	contractAddr = crypto.CreateAddress(caller.Address(), nonce)

	// Check whether the contract address is safe to use.
	if err := evm.makeAddressUntouchable(evm.StateDB, contractAddr); err != nil {
		return nil, common.Address{}, gas, err
	}
	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr)
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1)
	}
	evm.Transfer(evm.StateDB, caller.Address(), contractAddr, value)

	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCallCode(&contractAddr, crypto.Keccak256Hash(code), code)

	// Even if the interpreter returns an error, we calling contract still has
	// to pay for the gas consumed. The only exception is when the interpreter
	// returns a RevertError, in which case the remaining gas is returned to
	// the caller.
	ret, err = evm.interpreter.Run(contract, nil, false)
	// check whether the max code size has been exceeded
	maxCodeSizeExceeded := evm.chainRules.IsEIP170 && len(ret) > params.MaxCodeSize
	// if the contract creation ran successfully and no errors were returned
	// calculate the gas required to store the code. If the code could not
	// be stored due to not enough gas set an error and let it be handled
	// by the error checking condition below.
	if err == nil && !maxCodeSizeExceeded {
		createDataGas := uint64(len(ret)) * params.CreateDataGas
		if contract.UseGas(createDataGas) {
			evm.StateDB.SetCode(contractAddr, ret)
		} else {
			err = ErrCodeStoreOutOfGas
		}
	}
	// When an error happens we revert the state to where it was
	// before the call execution.
	if maxCodeSizeExceeded || (err != nil && err != ErrExecutionReverted) {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			contract.UseGas(contract.Gas)
		}
	}
	if maxCodeSizeExceeded && err == nil {
		err = ErrMaxCodeSizeExceeded
	}
	return ret, contractAddr, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
The gas calculation functions in Geth are highly detailed and provide a production-grade reference for implementing the `ValidationEngine` and `Action.estimate_gas_cost` method from the prompt. The `gasCall` function, in particular, shows how multiple factors (memory expansion, value transfer, account existence, EIP-2929 access lists) contribute to the total gas cost of a single "action".

```go
// gasCall is the gas function for the CALL opcode.
func gasCall(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	gas, err := evm.callGas(evm.chainRules.IsEIP2929, memorySize)
	if err != nil {
		return 0, err
	}
	evm.gasprice = gas

	var (
		// Pop items from stack together to avoid single pops.
		// We can safely pop elements from the stack, the validateStack function
		// has been called at the top of the Run method.
		_        = stack.pop() // We don't need the actual gas value from the stack
		addr, _  = stack.peek()
		value, _ = stack.peekN(1)
	)
	if evm.chainRules.IsEIP2929 {
		// The call destination is accessed, so it's added to the access list.
		// If it's not already on the access list, it's a cold access.
		if evm.StateDB.AddAddressToAccessList(common.Address(addr.Bytes20())) {
			gas += ColdAccountAccessGas
		}
	}
	if value.Sign() != 0 {
		gas += GasCallValueTransfer
		if !evm.StateDB.Exist(common.Address(addr.Bytes20())) {
			if !evm.chainRules.IsEIP2929 || !evm.StateDB.HasSuicided(common.Address(addr.Bytes20())) {
				gas += GasCallNewAccount
			}
		}
	}
	// Every call costs this much in gas, and since we're not using the
	// consumed gas, we have to subtract it from the contract's gas and
	// not from the returned gas.
	contract.UseGas(gas)
	return gas, nil
}

func gasCreate(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	gas, err := memoryGasCost(mem, memorySize)
	if err != nil {
		return 0, err
	}
	if evm.chainRules.IsShanghai {
		size, _ := stack.peekN(1)
		if !size.IsUint64() {
			return 0, ErrGasUintOverflow
		}
		words := (size.Uint64() + 31) / 32
		gas += words * InitCodeWordGas
	}
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/precompiles.go">
Geth's precompiled contract handling is a prime example of a specialized action dispatch system. The `PrecompiledContract` interface defines a common contract for all precompiles, with methods for gas calculation (`RequiredGas`) and execution (`Run`). The `RunPrecompiledContract` function acts as a dispatcher that first charges gas and then executes the precompile. This pattern is very similar to the `ActionManager` and `ActionHandler` design proposed in the prompt.

```go
// PrecompiledContract is the interface for a native contract.
//
// Note: Precompiled contracts are implemented in Go and integrated as part of
// the EVM. They are not written in EVM bytecode.
type PrecompiledContract interface {
	// RequiredGas returns the gas required to execute the pre-compiled contract.
	RequiredGas(input []byte) uint64
	// Run executes the pre-compiled contract.
	Run(input []byte) ([]byte, error)
}

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

// RunPrecompiledContract runs the precompiled contract.
//
// It is important to note that the input is not guaranteed to be safe and may need
// to be copied before use.
func RunPrecompiledContract(p PrecompiledContract, input []byte, gas uint64) (ret []byte, remainingGas uint64, err error) {
	gasCost := p.RequiredGas(input)
	if gas < gasCost {
		return nil, 0, ErrOutOfGas
	}
	gas -= gasCost

	output, err := p.Run(input)
	if err != nil {
		return nil, gas, err
	}
	return common.CopyBytes(output), gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state_processor.go">
The `StateProcessor` shows how Geth handles the application of state changes within a block. The `Process` method iterates through transactions, creating an `EVM` environment for each, applying state changes via `ApplyMessage`, and handling the results. This provides context on how a series of "actions" (transactions) are managed at a higher level than a single EVM `Run`.

```go
// StateProcessor is a basic Processor, which takes care of transitioning
// state from one point to another.
//
// StateProcessor implements Processor.
type StateProcessor struct {
	config *params.ChainConfig
	bc     *BlockChain
	engine consensus.Engine
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
// transactions failed to execute the state database is reverted to the state
// before the transaction executed and the logs and receipts are returned only
// for the successful transactions.
func (p *StateProcessor) Process(block *types.Block, statedb *state.StateDB, cfg vm.Config) (*ProcessResult, error) {
	var (
		receipts    types.Receipts
		usedGas     = new(uint64)
		header      = block.Header()
		blockHash   = block.Hash()
		blockNumber = block.Number()
		allLogs     []*types.Log
		gp          = new(GasPool).AddGas(block.GasLimit())
		requests    [][]byte
	)
	// Mutate the the statedb and prune out empty objects that have been touched.
	// This is needed to ensure that gas is properly refunded to the account that
	// created the empty object.
	defer statedb.Finalise(p.config.IsEIP158(blockNumber))

	// Iterate over and process the individual transactions
	for i, tx := range block.Transactions() {
		statedb.SetTxContext(tx.Hash(), i)
		res, err := ApplyTransaction(p.config, p.bc, nil, gp, statedb, header, tx, usedGas, cfg)
		if err != nil {
			return nil, err
		}
		receipts = append(receipts, res.receipt)
		allLogs = append(allLogs, res.logs...)
		requests = append(requests, res.requests...)
	}
	// Finalize the block, applying any consensus engine specific rewards
	p.engine.Finalize(p.bc, header, statedb, block.Transactions(), block.Uncles(), receipts, block.Withdrawals())

	return &ProcessResult{
		Receipts: receipts,
		Requests: requests,
		Logs:     allLogs,
		GasUsed:  *usedGas,
	}, nil
}
```
</file>
</go-ethereum>

---

An interpreter action system is a good way to structure the complex logic of EVM calls and contract creations. In go-ethereum, this logic is primarily encapsulated within the `EVM` struct and the `Interpreter` loop. The `EVM` struct handles high-level operations like `CALL` and `CREATE`, managing state and context, while the `Interpreter` executes the bytecode for those operations.

Here are the most relevant code snippets from go-ethereum that will help you implement the requested feature.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
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
	// ... (tracer hooks) ...
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
		// ... (logic for handling non-existent accounts, EIP-4762, EIP-158) ...
		evm.StateDB.CreateAccount(addr)
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
	// When an error was returned by the EVM or when setting the creation code
	// above we revert to the snapshot and consume any gas remaining. Additionally,
	// when we're in homestead this also counts for code storage gas errors.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			gas = 0
		}
	}
	return ret, gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller common.Address, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	contractAddr = crypto.CreateAddress(caller, evm.StateDB.GetNonce(caller))
	return evm.create(caller, code, gas, value, contractAddr, CREATE)
}

// create creates a new contract using code as deployment code.
func (evm *EVM) create(caller common.Address, code []byte, gas uint64, value *uint256.Int, address common.Address, typ OpCode) (ret []byte, createAddress common.Address, leftOverGas uint64, err error) {
	// ... (tracer hooks) ...
	// Depth check execution. Fail if we're trying to execute above the limit.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if !evm.Context.CanTransfer(evm.StateDB, caller, value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	nonce := evm.StateDB.GetNonce(caller)
	if nonce+1 < nonce {
		return nil, common.Address{}, gas, ErrNonceUintOverflow
	}
	evm.StateDB.SetNonce(caller, nonce+1, tracing.NonceChangeContractCreator)

	// ... (EIP-2929 access list logic) ...
	
	// Ensure there's no existing contract already at the designated address.
	contractHash := evm.StateDB.GetCodeHash(address)
	storageRoot := evm.StateDB.GetStorageRoot(address)
	if evm.StateDB.GetNonce(address) != 0 ||
		(contractHash != (common.Hash{}) && contractHash != types.EmptyCodeHash) ||
		(storageRoot != (common.Hash{}) && storageRoot != types.EmptyRootHash) {
		return nil, common.Address{}, 0, ErrContractAddressCollision
	}
	// Create a new account on the state only if the object was not present.
	snapshot := evm.StateDB.Snapshot()
	if !evm.StateDB.Exist(address) {
		evm.StateDB.CreateAccount(address)
	}
	evm.StateDB.CreateContract(address)

	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(address, 1, tracing.NonceChangeNewContract)
	}
	evm.Context.Transfer(evm.StateDB, caller, address, value)

	// Initialise a new contract and set the code that is to be used by the EVM.
	contract := NewContract(caller, address, value, gas, evm.jumpDests)
	contract.SetCallCode(common.Hash{}, code)
	contract.IsDeployment = true

	ret, err = evm.initNewContract(contract, address)
	if err != nil && (evm.chainRules.IsHomestead || err != ErrCodeStoreOutOfGas) {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			contract.UseGas(contract.Gas, evm.Config.Tracer, tracing.GasChangeCallFailedExecution)
		}
	}
	return ret, address, contract.Gas, err
}

// initNewContract runs a new contract's creation code, performs checks on the
// resulting code that is to be deployed, and consumes necessary gas.
func (evm *EVM) initNewContract(contract *Contract, address common.Address) ([]byte, error) {
	ret, err := evm.interpreter.Run(contract, nil, false)
	if err != nil {
		return ret, err
	}

	// Check whether the max code size has been exceeded, assign err if the case.
	if evm.chainRules.IsEIP158 && len(ret) > params.MaxCodeSize {
		return ret, ErrMaxCodeSizeExceeded
	}

	// Reject code starting with 0xEF if EIP-3541 is enabled.
	if len(ret) >= 1 && ret[0] == 0xEF && evm.chainRules.IsLondon {
		return ret, ErrInvalidCode
	}

	// ... (gas calculation for code storage) ...

	evm.StateDB.SetCode(address, ret)
	return ret, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
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
	// ... (setup and readOnly checks) ...

	// Reset the previous call's return data.
	in.returnData = nil

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
		pc   = uint64(0) // program counter
		cost uint64
		// ... (tracer variables) ...
		res []byte // result of the opcode execution function
	)
	// ... (defer pool returns) ...
	contract.Input = input

	// ... (defer tracer hooks) ...

	// The Interpreter main run loop.
	for {
		// ... (tracer hooks) ...
		
		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.table[op]
		cost = operation.constantGas // For tracing
		
		// Validate stack
		if sLen := stack.len(); sLen < operation.minStack {
			return nil, &ErrStackUnderflow{stackLen: sLen, required: operation.minStack}
		} else if sLen > operation.maxStack {
			return nil, &ErrStackOverflow{stackLen: sLen, limit: operation.maxStack}
		}
		// Consume gas.
		if contract.Gas < cost {
			return nil, ErrOutOfGas
		}
		contract.Gas -= cost

		// Calculate dynamic gas cost and expand memory if necessary
		var memorySize uint64
		if operation.dynamicGas != nil {
			var dynamicCost uint64
			dynamicCost, err = operation.dynamicGas(in.evm, contract, stack, mem, memorySize)
			cost += dynamicCost 
			if err != nil {
				return nil, fmt.Errorf("%w: %v", ErrOutOfGas, err)
			}
			if contract.Gas < dynamicCost {
				return nil, ErrOutOfGas
			}
			contract.Gas -= dynamicCost
		}

		if memorySize > 0 {
			mem.Resize(memorySize)
		}
		
		// ... (tracing) ...

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
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef
type Contract struct {
	// caller is the result of the caller which initialised this
	// contract. However, when the "call method" is delegated this
	// value needs to be initialised to that of the caller's caller.
	caller  common.Address
	address common.Address

	jumpdests map[common.Hash]bitvec // Aggregated result of JUMPDEST analysis.
	analysis  bitvec                 // Locally cached result of JUMPDEST analysis

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	// is the execution frame represented by this object a contract deployment
	IsDeployment bool
	IsSystemCall bool

	Gas   uint64
	value *uint256.Int
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller common.Address, address common.Address, value *uint256.Int, gas uint64, jumpDests map[common.Hash]bitvec) *Contract {
	// Initialize the jump analysis map if it's nil, mostly for tests
	if jumpDests == nil {
		jumpDests = make(map[common.Hash]bitvec)
	}
	return &Contract{
		caller:    caller,
		address:   address,
		jumpdests: jumpDests,
		Gas:       gas,
		value:     value,
	}
}

func (c *Contract) validJumpdest(dest *uint256.Int) bool {
	udest, overflow := dest.Uint64WithOverflow()
	// PC cannot go beyond len(code) and certainly can't be bigger than 63bits.
	// Don't bother checking for JUMPDEST in that case.
	if overflow || udest >= uint64(len(c.Code)) {
		return false
	}
	// Only JUMPDESTs allowed for destinations
	if OpCode(c.Code[udest]) != JUMPDEST {
		return false
	}
	return c.isCode(udest)
}

// isCode returns true if the provided PC location is an actual opcode, as
// opposed to a data-segment following a PUSHN operation.
func (c *Contract) isCode(udest uint64) bool {
	// Do we already have an analysis laying around?
	if c.analysis != nil {
		return c.analysis.codeSegment(udest)
	}
	// Do we have a contract hash already?
	// If we do have a hash, that means it's a 'regular' contract. For regular
	// contracts ( not temporary initcode), we store the analysis in a map
	if c.CodeHash != (common.Hash{}) {
		// Does parent context have the analysis?
		analysis, exist := c.jumpdests[c.CodeHash]
		if !exist {
			// Do the analysis and save in parent context
			// We do not need to store it in c.analysis
			analysis = codeBitmap(c.Code)
			c.jumpdests[c.CodeHash] = analysis
		}
		// Also stash it in current contract for faster access
		c.analysis = analysis
		return analysis.codeSegment(udest)
	}
	// We don't have the code hash, most likely a piece of initcode not already
	// in state trie. In that case, we do an analysis, and save it locally, so
	// we don't have to recalculate it for every JUMP instruction in the execution
	// However, we don't save it within the parent context
	if c.analysis == nil {
		c.analysis = codeBitmap(c.Code)
	}
	return c.analysis.codeSegment(udest)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// JumpTable contains the EVM opcodes supported at a given fork.
type JumpTable [256]*operation

type (
	executionFunc func(pc *uint64, interpreter *EVMInterpreter, callContext *ScopeContext) ([]byte, error)
	gasFunc       func(*EVM, *Contract, *Stack, *Memory, uint64) (uint64, error) // last parameter is the requested memory size as a uint64
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

// newLondonInstructionSet returns the frontier, homestead, byzantium,
// constantinople, istanbul, petersburg, berlin and london instructions.
func newLondonInstructionSet() JumpTable {
	instructionSet := newBerlinInstructionSet()
	enable3529(&instructionSet) // EIP-3529: Reduction in refunds https://eips.ethereum.org/EIPS/eip-3529
	enable3198(&instructionSet) // Base fee opcode https://eips.ethereum.org/EIPS/eip-3198
	return validate(instructionSet)
}

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
        // ... more opcodes ...
		CREATE: {
			execute:     opCreate,
			constantGas: params.CreateGas,
			dynamicGas:  gasCreate,
			minStack:    minStack(3, 1),
			maxStack:    maxStack(3, 1),
			memorySize:  memoryCreate,
		},
		CALL: {
			execute:     opCall,
			constantGas: params.CallGasFrontier,
			dynamicGas:  gasCall,
			minStack:    minStack(7, 1),
			maxStack:    maxStack(7, 1),
			memorySize:  memoryCall,
		},
		// ... more opcodes ...
	}
	// ... (fill undefined slots) ...
	return validate(tbl)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// gasSStoreEIP2200 implements the gas cost rules for SSTORE from EIP-2200.
func gasSStoreEIP2200(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	// ... (Sentry gas check) ...
	var (
		y, x    = stack.Back(1), stack.Back(0)
		current = evm.StateDB.GetState(contract.Address(), x.Bytes32())
	)
	value := common.Hash(y.Bytes32())

	if current == value { // noop (1)
		return params.SloadGasEIP2200, nil
	}
	original := evm.StateDB.GetCommittedState(contract.Address(), x.Bytes32())
	if original == current {
		if original == (common.Hash{}) { // create slot (2.1.1)
			return params.SstoreSetGasEIP2200, nil
		}
		if value == (common.Hash{}) { // delete slot (2.1.2b)
			evm.StateDB.AddRefund(params.SstoreClearsScheduleRefundEIP2200)
		}
		return params.SstoreResetGasEIP2200, nil // write existing slot (2.1.2)
	}
	// ... (more refund logic) ...
	return params.SloadGasEIP2200, nil // dirty update (2.2)
}

func gasCall(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	var (
		gas            uint64
		transfersValue = !stack.Back(2).IsZero()
		address        = common.Address(stack.Back(1).Bytes20())
	)
	if evm.chainRules.IsEIP158 {
		if transfersValue && evm.StateDB.Empty(address) {
			gas += params.CallNewAccountGas
		}
	} else if !evm.StateDB.Exist(address) {
		gas += params.CallNewAccountGas
	}
	if transfersValue && !evm.chainRules.IsEIP4762 {
		gas += params.CallValueTransferGas
	}
	memoryGas, err := memoryGasCost(mem, memorySize)
	if err != nil {
		return 0, err
	}
	var overflow bool
	if gas, overflow = math.SafeAdd(gas, memoryGas); overflow {
		return 0, ErrGasUintOverflow
	}

	evm.callGasTemp, err = callGas(evm.chainRules.IsEIP150, contract.Gas, gas, stack.Back(0))
	if err != nil {
		return 0, err
	}
	if gas, overflow = math.SafeAdd(gas, evm.callGasTemp); overflow {
		return 0, ErrGasUintOverflow
	}
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// journal contains the list of state modifications applied since the last state
// commit. These are tracked to be able to be reverted in the case of an execution
// exception or request for reversal.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes

	validRevisions []revision
	nextRevisionId int
}

// journalEntry is a modification entry in the state change journal that can be
// reverted on demand.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)

	// dirtied returns the Ethereum address modified by this journal entry.
	dirtied() *common.Address
}

// ... implementations for balanceChange, nonceChange, storageChange, codeChange, etc. ...

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
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/errors.go">
```go
// List evm execution errors
var (
	ErrOutOfGas                 = errors.New("out of gas")
	ErrCodeStoreOutOfGas        = errors.New("contract creation code storage out of gas")
	ErrDepth                    = errors.New("max call depth exceeded")
	ErrInsufficientBalance      = errors.New("insufficient balance for transfer")
	ErrContractAddressCollision = errors.New("contract address collision")
	ErrExecutionReverted        = errors.New("execution reverted")
	ErrMaxCodeSizeExceeded      = errors.New("max code size exceeded")
	ErrInvalidJump              = errors.New("invalid jump destination")
	ErrWriteProtection          = errors.New("write protection")
	// ... and more
)
// ErrStackUnderflow wraps an evm error when the items on the stack less
// than the minimal requirement.
type ErrStackUnderflow struct {
	stackLen int
	required int
}
// ErrStackOverflow wraps an evm error when the items on the stack exceeds
// the maximum allowance.
type ErrStackOverflow struct {
	stackLen int
	limit    int
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
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

// activePrecompiledContracts returns a copy of precompiled contracts enabled
// with the current configuration.
func activePrecompiledContracts(rules params.Rules) PrecompiledContracts {
	switch {
	case rules.IsVerkle:
		return PrecompiledContractsVerkle
	case rules.IsPrague:
		return PrecompiledContractsPrague
	// ... more forks
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
	suppliedGas -= gasCost
	output, err := p.Run(input)
	return output, suppliedGas, err
}
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt is excellent and very detailed. It outlines a modern, modular design for an EVM's action system, inspired by patterns like Command and Strategy. The proposed Zig structs are well-thought-out.

One minor point of clarification based on the Go-Ethereum implementation:

-   **State Modification Logic**: The prompt's `ActionType.is_state_modifying` is a good simplification. In Geth, this logic is more nuanced. For example, a `CALL` only modifies state if `value > 0` or if the callee's code performs state-modifying operations (like `SSTORE`). The `STATICCALL` opcode was introduced specifically to create a context where state modifications are verifiably disallowed. Your implementation should consider that the *parameters* of an action can determine if it's state-modifying, not just the action type itself. The `readOnly` flag in Geth's `Interpreter` is a good pattern to follow for this.

This is not a correction but an enhancement suggestion based on Geth's design. The prompt as-is is a solid foundation. The provided Geth snippets will be invaluable for filling in the "how" for each of the "what"s you've defined.

---

An interpreter action system is a good way to structure the execution of complex EVM operations like `CALL` and `CREATE`. In `go-ethereum`, this logic is encapsulated within the `EVM` object and the opcode implementations.

Here are the most relevant code snippets to guide your implementation:

1.  **Core EVM Object and Call/Create Logic**: The `EVM` struct and its methods for `Call`, `Create`, etc., show the high-level orchestration of these actions, including setup, value transfer, gas calculation, and handling results.
2.  **Opcode Implementations**: The `opCall`, `opCreate`, and `opCreate2` functions demonstrate how parameters are read from the stack and used to invoke the core EVM methods.
3.  **Gas Calculation**: The `callGas` and `createGas` functions provide a detailed reference for gas cost validation and estimation, including EIP-2929 warm/cold access costs.
4.  **Interpreter Loop**: The `Interpreter.Run` method shows the main execution loop, including stack validation and `readOnly` checks, which are central to your `ValidationEngine`.
5.  **Contract Context**: The `Contract` object in `go-ethereum` is the execution context for a call, analogous to your `Action` and `ExecutionContext` structs.

These snippets provide a solid foundation for implementing the semantics of your action handlers and the logic for your validation and optimization engines.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current transaction and block.
	TxContext
	// BlockContext provides information about the current block.
	BlockContext

	// StateDB gives access to the underlying state.
	StateDB StateDB
	// Depth is the current call stack depth.
	depth int

	// chainConfig contains information about the current chain.
	chainConfig *params.ChainConfig
	// chainRules contains the chain rules for the current epoch.
	chainRules params.Rules
	// vmConfig contains configuration options for the EVM.
	vmConfig Config
	// interpreter is the contract interpreter.
	interpreter *Interpreter
	// readOnly is true if the EVM is executing in read-only mode.
	readOnly bool
	// returnData is the return data of the last call.
	returnData []byte
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single goroutine.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		BlockContext: blockCtx,
		TxContext:    txCtx,
		StateDB:      statedb,
		chainConfig:  chainConfig,
		vmConfig:     vmConfig,
		interpreter:  NewInterpreter(vmConfig),
		readOnly:     false,
	}
	// The interpreter is registered as a state object.
	// This allows it to be reused for nested calls.
	evm.interpreter.evm = evm
	return evm
}

// Call executes the contract associated with the destination address. It is a
// convenience function for executing transactions that are not creating a new
// contract.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.vmConfig.NoRecursion && evm.depth > 0 {
		return nil, gas, nil
	}
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() > 0 {
		return nil, gas, ErrWriteProtection
	}
	// Make sure the caller has enough balance to send the value.
	// This check is not performed is the caller is a precompile.
	if !caller.Address().IsPrecompile() && evm.StateDB.GetBalance(caller.Address()).Lt(value) {
		return nil, gas, fmt.Errorf("%w: address %v have %v want %v", ErrInsufficientBalance, caller.Address().Hex(), evm.StateDB.GetBalance(caller.Address()), value)
	}

	snapshot := evm.StateDB.Snapshot()
	p, isPrecompile := evm.precompile(addr)

	// Transfer value from caller to called account
	evm.StateDB.Transfer(caller.Address(), addr, value, evm.vmConfig.Tracer)

	if isPrecompile {
		ret, leftOverGas, err = RunPrecompiledContract(p, input, gas)
	} else {
		// Initialise a new contract and set the code that is to be used by the EVM.
		// The contract is a scoped environment for this execution context only.
		code := evm.StateDB.GetCode(addr)
		if len(code) == 0 {
			ret, leftOverGas, err = nil, gas, nil // success
		} else {
			contract := NewContract(caller, AccountRef(addr), value, gas)
			contract.Code = code

			// If the tracer is tracking the call, save the input for it.
			if evm.vmConfig.Tracer != nil {
				evm.vmConfig.Tracer.CaptureEnter(vm.CALL, caller.Address(), addr, input, gas, value)
			}
			ret, leftOverGas, err = evm.interpreter.Run(contract, input, false)
		}
	}
	// When the execution finishes, retrieve the created output and return it.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if !errors.Is(err, vm.ErrExecutionReverted) {
			leftOverGas = 0
		}
		if evm.vmConfig.Tracer != nil {
			evm.vmConfig.Tracer.CaptureExit(ret, leftOverGas, err)
		}
	} else if evm.vmConfig.Tracer != nil {
		evm.vmConfig.Tracer.CaptureExit(ret, leftOverGas, nil)
	}
	return ret, leftOverGas, err
}

// Create creates a new contract using the data passed in as corresponding input.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the
	// limit.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if !evm.Context().CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Ensure there's no existing contract already at the designated address
	nonce := evm.StateDB.GetNonce(caller.Address())
	contractAddr = crypto.CreateAddress(caller.Address(), nonce)

	// Check whether the contract address is safe to deploy to.
	if err := evm.checkDeployment(contractAddr); err != nil {
		return nil, common.Address{}, gas, err
	}
	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr)
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1, evm.vmConfig.Tracer)
	}
	evm.StateDB.Transfer(caller.Address(), contractAddr, value, evm.vmConfig.Tracer)

	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution context
	// only.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.Code = code

	// If the tracer is tracking the call, save the input for it.
	if evm.vmConfig.Tracer != nil {
		evm.vmConfig.Tracer.CaptureEnter(vm.CREATE, caller.Address(), contractAddr, code, gas, value)
	}
	// Fire up the interpreter with the given code.
	//
	// In case of an error, the error will be returned and the state will be
	// reverted. Otherwise, the code will be set and the gas returned.
	ret, _, err = evm.interpreter.Run(contract, nil, false)
	if err == nil {
		// contract creation shouldn't return anything, but there's no need to fail if it does
		leftOverGas = contract.Gas
	} else {
		// In case of an error, revert the snapshot and consume all gas.
		evm.StateDB.RevertToSnapshot(snapshot)
		leftOverGas = 0
	}
	// Assign the code to the contract to be saved in the state.
	// We might need to evict the FFS rule according to EIP-3541.
	maxCodeSize := evm.chainConfig.MaxCodeSize
	if err == nil && len(ret) > maxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}
	// EIP-3860: Refund initcode gas in case of large contract creation.
	if err == nil {
		// Any returned code of which the size exceeds the reserved gas for normal
		// contract is not chargeable, the cost will only be deducted from the
		// initcode gas.
		deployGas, err := core.CreateCost(ret, evm.chainRules.IsEIP3860)
		if err != nil {
			return nil, common.Address{}, 0, err
		}
		if leftOverGas < deployGas {
			err = ErrCodeStoreOutOfGas
		} else {
			leftOverGas -= deployGas
			evm.StateDB.SetCode(contractAddr, ret)
		}
	}
	// When the execution finishes, retrieve the created output and return it.
	if err != nil && !errors.Is(err, vm.ErrExecutionReverted) {
		leftOverGas = 0
	}
	if evm.vmConfig.Tracer != nil {
		evm.vmConfig.Tracer.CaptureExit(ret, leftOverGas, err)
	}
	return ret, contractAddr, leftOverGas, err
}

// Create2 creates a new contract using the data passed in as corresponding input.
//
// It is similar to Create, but uses keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))
// instead of the usual sender-and-nonce-hash as the address where the contract is
// stored.
func (evm *EVM) Create2(caller ContractRef, code []byte, gas uint64, endowment *uint256.Int, salt common.Hash) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the
	// limit.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if !evm.Context().CanTransfer(evm.StateDB, caller.Address(), endowment) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Ensure there's no existing contract already at the designated address
	address := crypto.CreateAddress2(caller.Address(), salt, code)

	// Check whether the contract address is safe to deploy to.
	if err := evm.checkDeployment(address); err != nil {
		return nil, common.Address{}, gas, err
	}
	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(address)
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(address, 1, evm.vmConfig.Tracer)
	}
	evm.StateDB.Transfer(caller.Address(), address, endowment, evm.vmConfig.Tracer)

	// Initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution context
	// only.
	contract := NewContract(caller, AccountRef(address), endowment, gas)
	contract.Code = code

	// If the tracer is tracking the call, save the input for it.
	if evm.vmConfig.Tracer != nil {
		evm.vmConfig.Tracer.CaptureEnter(vm.CREATE2, caller.Address(), address, code, gas, endowment)
	}
	// Fire up the interpreter with the given code.
	ret, _, err = evm.interpreter.Run(contract, nil, false)
	// check against the max code size limit
	if err == nil && len(ret) > evm.chainConfig.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}
	// If the contract returns code, set the code of the new account to the returned code.
	// And if the init code returns no error, the specified gas will be charged from the balance of
	// the caller.
	if err == nil {
		// contract creation shouldn't return anything, but there's no need to fail if it does
		leftOverGas = contract.Gas
		createGas, err := core.CreateCost(ret, evm.chainRules.IsEIP3860)
		if err != nil {
			return nil, common.Address{}, 0, err
		}
		if leftOverGas < createGas {
			err = ErrCodeStoreOutOfGas
		} else {
			leftOverGas -= createGas
			evm.StateDB.SetCode(address, ret)
		}
	}
	// When the execution finishes, retrieve the created output and return it.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if !errors.Is(err, vm.ErrExecutionReverted) {
			leftOverGas = 0
		}
	}
	if evm.vmConfig.Tracer != nil {
		evm.vmConfig.Tracer.CaptureExit(ret, leftOverGas, err)
	}
	return ret, address, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Interpreter is a simple interpreter for executing contract code.
type Interpreter struct {
	evm *EVM
}

// NewInterpreter returns a new instance of the interpreter.
func NewInterpreter(vmConfig Config) *Interpreter {
	return &Interpreter{
		evm: &EVM{ // evm is a field inside interpreter, but needs a reference to it
			vmConfig:   vmConfig,
			interpreter: nil, // This will be set to self after initialization
		},
	}
}

// Run executes the given contract against the state database.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, leftOverGas uint64, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() {
		in.evm.depth--
	}()

	// Make sure the readOnly is only set if we aren't in a readOnly context yet.
	// If we are in a readOnly context, it also means we can't have a value transfer
	// and we can't touch the state.
	if readOnly && !in.evm.readOnly {
		in.evm.readOnly = true
		defer func() { in.evm.readOnly = false }()
	}
	// Reset the previous call's return data. It's important to do this before
	// starting the loop since the interpreter could be called recursively.
	in.evm.returnData = nil

	// Don't bother changing the stack if we're not going to run an opcode.
	if len(contract.Code) == 0 {
		return nil, contract.Gas, nil
	}
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallCtx()
		// For performance consideration, the returned data copy is done only
		// when the given input is not nil.
		inputData []byte
		pc        = uint64(0) // program counter
		cost      uint64
		res       []byte
	)
	if input != nil {
		inputData = make([]byte, len(input))
		copy(inputData, input)
	}
	contract.Input = inputData

	// The Interpreter main loop. This loop will continue until execution ends
	// with STOP, RETURN, SELFDESTRUCT, REVERT or an error.
	for {
		// Get the operation from the jump table and validate the stack to ensure there are
		// enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := in.evm.vmConfig.JumpTable[op]
		if !operation.valid {
			return nil, 0, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err = operation.validateStack(stack); err != nil {
			return nil, 0, err
		}
		// Execute the operation
		if err = operation.execute(&pc, in.evm, contract, mem, stack, callContext); err != nil {
			return nil, 0, err
		}
		pc++

		// If the operation clears the return data, do it.
		if operation.returns {
			in.evm.returnData = callContext.ret
		}

		switch {
		case err != nil:
			return nil, 0, err
		case operation.reverts:
			return callContext.ret, contract.Gas, ErrExecutionReverted
		case operation.halts:
			return callContext.ret, contract.Gas, nil
		case !operation.jumps:
			pc++
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall is the general CALL operation.
func opCall(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, callContext *callCtx) (err error) {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	gas, addr, value, inOffset, inSize, retOffset, retSize := stack.pop7()

	// Ensure the call is allowed in the current context
	if err := evm.checkCall(stack, contract.Gas, gas.Uint64()); err != nil {
		return err
	}
	// Get the arguments from memory
	args, err := mem.GetPtr(inOffset.Uint64(), inSize.Uint64())
	if err != nil {
		return err
	}
	// Execute the call
	ret, leftOverGas, err := evm.Call(contract, addr.Address(), args, gas.Uint64(), value)
	if err != nil {
		callContext.ret = nil
		stack.push(zero)
		return err
	}
	stack.push(one)

	// Put the return data into memory and also into the return data buffer
	if err := mem.Set(retOffset.Uint64(), retSize.Uint64(), ret); err != nil {
		return err
	}
	callContext.ret = ret
	contract.Gas = leftOverGas
	return nil
}


// opCreate is the CREATE opcode.
func opCreate(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, callContext *callCtx) (err error) {
	// Pop value, offset and size from the stack
	value, offset, size := stack.pop3()

	// Ensure the call is allowed in the current context
	if err := evm.checkCreate(value); err != nil {
		return err
	}
	// Retrieve the initialization code from memory
	code, err := mem.GetPtr(offset.Uint64(), size.Uint64())
	if err != nil {
		return err
	}
	// Execute the create operation
	ret, addr, gas, err := evm.Create(contract, code, contract.Gas, value)
	if err != nil {
		stack.push(zero)
	} else {
		stack.push(new(uint256.Int).SetBytes(addr.Bytes()))
	}
	callContext.ret = ret
	contract.Gas = gas
	return err
}

// opCreate2 is the CREATE2 opcode.
func opCreate2(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, callContext *callCtx) (err error) {
	// Pop endowment, offset, size and salt from the stack
	endowment, offset, size, salt := stack.pop4()

	// Ensure the call is allowed in the current context
	if err := evm.checkCreate(endowment); err != nil {
		return err
	}
	// Retrieve the initialization code from memory
	code, err := mem.GetPtr(offset.Uint64(), size.Uint64())
	if err != nil {
		return err

	}
	// Execute the create2 operation
	ret, addr, gas, err := evm.Create2(contract, code, contract.Gas, endowment, salt.Bytes32())
	if err != nil {
		stack.push(zero)
	} else {
		stack.push(new(uint256.Int).SetBytes(addr.Bytes()))
	}
	callContext.ret = ret
	contract.Gas = gas
	return err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// Gas costs
const (
	GasQuickStep   uint64 = 2
	GasFastestStep uint64 = 3
	GasFastStep    uint64 = 5
	GasMidStep     uint64 = 8
	GasSlowStep    uint64 = 10
	GasExtStep     uint64 = 20
)

// callGas returns the gas required for calling a contract.
//
// The cost of gas was changed during the Homestead transition.
//
// Note: This function is `lcall` in the yellow paper.
func callGas(rules params.Rules, gas, availableGas uint64, value *uint256.Int) (uint64, error) {
	if rules.IsEIP150 {
		availableGas = availableGas - availableGas/64
		if gas > availableGas {
			gas = availableGas
		}
	}
	cost := gas
	// EIP-2929: Add 2300 gas stipend if value is transferred
	if value.Sign() > 0 {
		var overflow bool
		cost, overflow = math.SafeAdd(cost, params.CallStipend)
		if overflow {
			return 0, ErrGasUintOverflow
		}
	}
	return cost, nil
}

// gasCreateEIP3860 calculates the gas given the init code. This is the format
// of the memory expansion cost since EIP-3860.
func gasCreateEIP3860(size uint64) (uint64, error) {
	words := (size + 31) / 32
	cost, overflow := math.SafeMul(words, params.InitCodeWordGas)
	if overflow {
		return 0, ErrGasUintOverflow
	}
	return cost, nil
}

// createGas calculates the gas required for contract creation.
func createGas(rules params.Rules, input []byte, hasCost bool) (uint64, error) {
	cost := params.TxGasContractCreation
	if hasCost && rules.IsEIP3860 {
		var overflow bool
		cost, overflow = math.SafeAdd(cost, uint64(len(input)))
		if overflow {
			return 0, ErrGasUintOverflow
		}
		initCodeGas, err := gasCreateEIP3860(uint64(len(input)))
		if err != nil {
			return 0, err
		}
		cost, overflow = math.SafeAdd(cost, initCodeGas)
		if overflow {
			return 0, ErrGasUintOverflow
		}
	}
	return cost, nil
}

// CreateCost calculates the gas required for contract creation.
func CreateCost(input []byte, hasCost bool) (uint64, error) {
	return createGas(params.Rules{}, input, hasCost)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// AccountRef implements ContractRef.
//
// AccountRef is used by the vm to operate on accounts and contracts.
type AccountRef common.Address

// Address returns the address of the contract
func (ar AccountRef) Address() common.Address {
	return common.Address(ar)
}

// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the caller stack.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	Code      []byte
	CodeHash  common.Hash
	Input     []byte
	Gas       uint64
	value     *uint256.Int
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller ContractRef, object ContractRef, value *uint256.Int, gas uint64) *Contract {
	c := &Contract{caller: caller, self: object, value: value, Gas: gas}

	if parent, ok := caller.(*Contract); ok {
		// If the caller is also a contract, retain the caller's address.
		// This is important for DELEGATECALL, where the original caller
		// address is kept.
		c.CallerAddress = parent.CallerAddress
	} else {
		c.CallerAddress = caller.Address()
	}
	return c
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jumptable.go">
```go
// JumpTable is a map of opcodes to their metadata and execution functions.
type JumpTable [256]operation

// NewLondonInstructionSet returns the London instruction set.
func NewLondonInstructionSet() JumpTable {
	return NewIstanbulInstructionSet()
}

// newPreBerlinInstructionSet returns the instruction set before the Berlin hard fork.
func newPreBerlinInstructionSet() JumpTable {
	// The newInstructionSet is a copy of the Istanbul instruction set
	// with the addition of the access-list opcodes.
	instructionSet := newIstanbulInstructionSet()
	return instructionSet
}

// NewBerlinInstructionSet returns the Berlin instruction set.
func NewBerlinInstructionSet() JumpTable {
	// The newInstructionSet is a copy of the Istanbul instruction set
	// with the addition of the access-list opcodes.
	instructionSet := newPreBerlinInstructionSet()
	// EIP-2929: Gas cost increases for state access opcodes
	instructionSet[SLOAD] = operation{
		execute:     opSload,
		constantGas: 0,
		minStack:    1,
		maxStack:    1,
	}
	// ... other opcodes ...
	return instructionSet
}

// NewIstanbulInstructionSet returns the instruction set for the Istanbul hard fork.
func newIstanbulInstructionSet() JumpTable {
	instructionSet := newConstantinopleInstructionSet()
	instructionSet[BALANCE] = operation{
		execute:     opBalance,
		constantGas: GasExtStep,
		minStack:    1,
		maxStack:    2,
	}
	// ... other opcodes ...
	return instructionSet
}
```
</file>

## Prompt Corrections

Your prompt outlines a sophisticated and well-structured "Action System". This is an excellent architectural pattern, but it's a higher-level abstraction than what `go-ethereum`'s EVM implementation uses internally. Geth's `EVM` and `Interpreter` are more direct, processing opcodes in a loop.

Here are a few points to consider, based on `go-ethereum`'s implementation, that could refine your system's design:

1.  **Gas Estimation vs. Calculation**: Your `Action.estimate_gas_cost` is a good starting point, but the actual gas cost is more complex, especially after the Berlin hardfork (EIP-2929). The true cost depends on whether an account or storage slot is "warm" or "cold" (i.e., whether it has been accessed before in the same transaction). The `core/vm/gas.go` file in Geth, particularly the `callGas` function, provides a much more detailed model for this calculation. Your `ValidationEngine` would need to perform these more complex checks for gas validation.

2.  **State-Modifying Actions**: Your `ActionType.is_state_modifying` is a crucial check. In Geth, this is handled by a simple `readOnly` flag in the `EVM` and `Interpreter`. Before any state-modifying opcode (like `SSTORE`, `CREATE`, `LOG*`, etc.) is executed, it checks `if evm.readOnly { return err }`. This is a simple and effective way to enforce static call semantics.

3.  **Action Parameters**: Your `ActionParameters` union is a clean way to represent parameters. In Geth, these parameters are popped directly from the `Stack` within the opcode's implementation function (e.g., `opCall`). The provided snippets from `core/vm/instructions.go` show exactly how this is done.

4.  **Action Result**: Your `ActionResult` struct is comprehensive. In Geth, the `EVM.Call` and `EVM.Create` methods return multiple values (`ret []byte, leftOverGas uint64, err error`), which your `ActionResult` neatly encapsulates. This is a good abstraction.

5.  **Performance Tracking**: The `ActionPerformanceTracker` is a powerful feature for monitoring and diagnostics. While Geth doesn't have a direct equivalent at the action level, its `ethstats` package serves a similar purpose at a higher (node/network) level by reporting statistics like `blockStats` and `pendStats`. This shows that tracking metrics is valuable, and your approach of doing it per-action is a solid design choice for a detailed EVM implementation.

---

An excellent and well-structured prompt. The proposed `Action` system is a great abstraction over raw EVM opcodes. The go-ethereum codebase provides battle-tested implementations of the core concepts you're building. Here are some relevant snippets that will be helpful.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current transaction and block.
	Context BlockContext

	// StateDB gives access to the underlying state.
	StateDB StateDB

	// Depth is the current call stack depth.
	depth int

	// Interpreter is the evm interpreter.
	interpreter *EVMInterpreter

	// readOnly is the readonly flag, which is inherited from the parent and
	// can only be true if parent is also readOnly.
	readOnly bool
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single goroutine.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// ...
}

// Call executes the contract associated with the destination address. It is a
// convenience function around executing the EVM.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ...
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() > 0 {
		return nil, gas, ErrWriteProtection
	}
	// ...
	// Ensure the destination has code, otherwise fail
	code := evm.StateDB.GetCode(addr)
	if len(code) == 0 {
		return nil, gas, nil
	}
	// ...
	snapshot := evm.StateDB.Snapshot()

	// Create a new contract and execute the code
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.Code = code
	// ...
	ret, err = evm.interpreter.Run(contract, input, evm.readOnly)
	// ...
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
	}
	return ret, contract.Gas, err
}

// StaticCall executes the contract associated with the destination address with
// restricted state access. The primary difference between a static call and a
// regular call is that it can not alter the state.
func (evm *EVM) StaticCall(caller ContractRef, addr common.Address, input []byte, gas uint64) (ret []byte, leftOverGas uint64, err error) {
	// ...
	// Set the readOnly flag. In a real world senario this is inherited from the parent
	// context and it's not possible to set it to false if the parent was readOnly.
	readOnly := evm.readOnly
	evm.readOnly = true

	// Execute the call
	ret, leftOverGas, err = evm.Call(caller, addr, input, gas, big.NewInt(0))

	// Revert the readOnly flag.
	evm.readOnly = readOnly
	return ret, leftOverGas, err
}


// Create creates a new contract using the data passed as the input.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the
	// limit.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if evm.readOnly {
		return nil, common.Address{}, gas, ErrWriteProtection
	}
	// ...
	// Create a new account on the state
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	// ...
	// Create a new contract and execute the code
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.Code = code
	// ...
	ret, err = evm.interpreter.Run(contract, nil, false)
	// ...
	// check whether the max code size limit is exceeded
	maxCodeSizeExceeded := evm.chainRules.IsEIP170 && len(ret) > params.MaxCodeSize
	// if the code is large, charge extra gas
	if err == nil && !maxCodeSizeExceeded {
		createDataGas := uint64(len(ret)) * params.CreateDataGas
		if contract.UseGas(createDataGas) {
			evm.StateDB.SetCode(contractAddr, ret)
		} else {
			err = ErrCodeStoreOutOfGas
		}
	}
	// ...
	return ret, contractAddr, contract.Gas, err
}

// Create2 creates a new contract using the data passed as the input with CREATE2 opcode.
func (evm *EVM) Create2(caller ContractRef, code []byte, gas uint64, endowment *big.Int, salt *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ...
	// Create a new account on the state
	codeHash := crypto.Keccak256Hash(code)
	contractAddr = crypto.CreateAddress2(caller.Address(), salt.Bytes32(), codeHash.Bytes())
	// ...
	// Execute the code
	contract := NewContract(caller, AccountRef(contractAddr), endowment, gas)
	contract.Code = code
	// ...
	ret, err = evm.interpreter.Run(contract, nil, false)
	// ...
	// check whether the max code size limit is exceeded
	if err == nil && evm.chainRules.IsEIP170 && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}
	// ...
	return ret, contractAddr, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm      *EVM
	gasTable params.GasTable
	// ...
}

// Run executes the given contract against the state database.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallCtx()
		pc          = uint64(0) // program counter
		// ...
	)
	// ...
	// The Interpreter main loop. This loop will continue until execution ends
	// with STOP, RETURN, SELFDESTRUCT, REVERT or an error.
	for {
		// ...
		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.gasTable[op]
		// ...
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Execute the operation
		res, err := operation.execute(&pc, in, callContext)
		// ...
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// operation is the low level representation of a single opcode.
type operation struct {
	// execute is the operation function
	execute executionFunc
	// constantGas is the static gas usage of the instruction
	constantGas uint64
	// dynamicGas is the dynamic gas usage of the instruction
	dynamicGas gasFunc
	// minStack tells how many stack items are required
	minStack int
	// maxStack specifies the max stack height after executing the instruction.
	maxStack int

	// memorySize returns the memory size required for the operation
	memorySize memorySizeFunc
	// ...
}

// JumpTable contains the EVM instructions disassembled into a format easier to
// execute.
type JumpTable [256]*operation

// newByzantiumInstructionSet returns the instruction set for the Byzantium hard fork.
func newByzantiumInstructionSet() JumpTable {
	// This is a simplified version of how Geth constructs its jump table.
	// It shows how different opcodes are mapped to their implementation and metadata.
	var jt JumpTable
	jt[STOP] = &operation{execute: opStop}
	jt[ADD] = &operation{execute: opAdd, constantGas: GasFastestStep, minStack: 2, maxStack: 1024}
	// ...
	jt[REVERT] = &operation{execute: opRevert, constantGas: 0, dynamicGas: gasRevert, minStack: 2, maxStack: 1024, memorySize: memoryRevert}
	jt[STATICCALL] = &operation{execute: opStaticCall, constantGas: GasCall, dynamicGas: gasStaticCall, minStack: 6, maxStack: 1024, memorySize: memoryCall}
	// ...
	return jt
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an Ethereum contract in the state machine.
type Contract struct {
	// CallerAddress is the result of the CALLER opcode (repeated for tracing)
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	analysis  codeAnalysis // result of code analysis.

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	value *big.Int
	Gas   uint64

	//unktab contains the analysis result of the contract code.
	// This is used by the JUMP/JUMPI instructions to check for valid
	// jump destinations.
	jumpdests destinations // result of JUMPDEST analysis.

	//...
}


// NewContract returns a new contract environment for the execution of EVM bytecode.
func NewContract(caller, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{
		caller:        caller,
		self:          object,
		value:         value,
		Gas:           gas,
		CallerAddress: caller.Address(),
	}
	// ...
	return c
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// codeAnalysis contains meta-information about a contract code.
type codeAnalysis struct {
	jumpdests destinations
}

// destinations is a sorted list of valid jump destinations.
type destinations map[uint64]struct{}


// Analyse analyses the given code and returns the destinations.
// In case of an error, the returned analysis may not be complete.
func Analyse(code []byte) destinations {
	// Don't waste time on empty code
	if len(code) == 0 {
		return destinations{}
	}
	// ...
	var (
		dests = make(destinations)
		i     = uint64(0)
	)
	for i < uint64(len(code)) {
		op := OpCode(code[i])
		if op == JUMPDEST {
			dests[i] = struct{}{}
		} else if op.IsPush() {
			i += uint64(op - PUSH1 + 1)
		}
		i++
	}
	return dests
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// callGas returns the gas required for calling a contract.
func callGas(gasTable params.GasTable, gas uint64, value *big.Int, isEIP150, isEIP2929, coldAccess bool) (uint64, error) {
	// ...
	gas += gasTable.Call
	if isEIP2929 && coldAccess {
		gas += params.ColdAccountAccessCostEIP2929
	}
	if value.Sign() > 0 {
		gas += gasTable.CallValue
		// ...
	}
	return gas, nil
}

// memoryGasCost calculates the gas cost for memory expansion.
func memoryGasCost(mem *Memory, newSize uint64) (uint64, error) {
	if newSize == 0 {
		return 0, nil
	}
	// ...
	// The cost of memory is calculated as:
	// Gmemory = Gmem * m_i + m_i^2 / 512
	// where m_i is the highest accessed memory address.
	// All memory addresses are accessed in words.
	size := wordsForBytes(newSize)
	// ...
	cost := size*params.MemoryGas + (size*size)/params.QuadCoeffDiv
	// ...
	return cost, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// Gas cost changes for some opcodes by hard fork
	SloadGasFrontier             uint64 = 50
	SloadGasEIP150               uint64 = 200
	SloadGasEIP1884              uint64 = 800  // Cost of SLOAD after EIP 1884 (part of Istanbul)
	SloadGasEIP2200              uint64 = 800  // Cost of SLOAD after EIP 2200 (part of Istanbul)
	ColdSloadCostEIP2929         = uint64(2100)
	WarmStorageReadCostEIP2929   = uint64(100)

	CallGasFrontier              uint64 = 40  // Once per CALL operation & message call transaction.
	CallGasEIP150                uint64 = 700 // Static portion of gas for CALL-derivates after EIP 150 (Tangerine)
	ColdAccountAccessCostEIP2929 = uint64(2600)

	CreateGas      uint64 = 32000 // Once per CREATE operation & contract-creation transaction.
	Create2Gas     uint64 = 32000 // Once per CREATE2 operation

	LogGas                uint64 = 375   // Per LOG* operation.
	LogDataGas            uint64 = 8     // Per byte in a LOG* operation's data.
	LogTopicGas           uint64 = 375   // Multiplied by the * of the LOG*, per LOG transaction.

	SelfdestructGasEIP150        uint64 = 5000  // Cost of SELFDESTRUCT post EIP 150 (Tangerine)
	SelfdestructRefundGas uint64 = 24000 // Refunded following a selfdestruct operation.
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// JournalEntry is a modification to the state that can be reverted.
type journalEntry interface {
	// revert reverses the effects of the journal entry.
	revert(db *StateDB)

	// dirtied returns the address that was modified.
	dirtied() *common.Address
}

// The journal holds the list of state modifications that can be reverted.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// Some journal entry types.
type (
	createObjectChange struct {
		account *common.Address
	}
	resetObjectChange struct {
		prev *stateObject
	}
	suicideChange struct {
		account      *common.Address
		prev         bool // whether account had already been suicided
		prevbalance  *big.Int
	}
	balanceChange struct {
		account *common.Address
		prev    *big.Int
	}
	nonceChange struct {
		account *common.Address
		prev    uint64
	}
	storageChange struct {
		account       *common.Address
		key           common.Hash
		prevval       common.Hash
	}
	codeChange struct {
		account  *common.Address
		prevcode []byte
		prevhash common.Hash
	}
	refundChange struct {
		prev uint64
	}
	addLogChange struct {
		txhash common.Hash
	}
	//...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/types/log.go">
```go
// Log represents a contract log event. These events are generated by the LOG opcode and
// stored/indexed by the node.
type Log struct {
	// address of the contract that generated the event
	Address common.Address `json:"address" gencodec:"required"`

	// list of topics provided by the contract.
	Topics []common.Hash `json:"topics" gencodec:"required"`

	// supplied by the contract, usually ABI-encoded
	Data []byte `json:"data" gencodec:"required"`

	// block in which the transaction was included
	BlockNumber uint64 `json:"blockNumber"`
	// hash of the transaction
	TxHash common.Hash `json:"transactionHash" gencodec:"required"`
	// index of the transaction in the block
	TxIndex uint `json:"transactionIndex"`
	// hash of the block in which the transaction was included
	BlockHash common.Hash `json:"blockHash"`
	// index of the log in the block
	Index uint `json:"logIndex" gencodec:"required"`

	// The Removed field is true if this log was reverted due to a chain reorganisation.
	// You must pay attention to this field if you receive logs through a filter query.
	Removed bool `json:"removed"`
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt is excellent and very well-defined. The proposed architecture is clean and modern. The only minor point of feedback is regarding gas costs:

*   **Hardfork-dependent Gas Costs**: The `ActionType.get_base_gas_cost` function uses hardcoded constants. Many of these costs have changed throughout Ethereum's history with different hardforks (e.g., `SLOAD`, `BALANCE`, `EXTCODESIZE`). When implementing, consider making these gas costs dependent on the active hardfork rules, similar to how go-ethereum's `JumpTable` is constructed based on the `ChainConfig`. This will be critical for correctness if your EVM needs to process historical blocks or support multiple networks. The provided go-ethereum snippets for `jump_table.go` and `protocol_params.go` illustrate this concept.

---

An "Interpreter Action System" is a good way to structure the complex operations within an EVM. In go-ethereum, these actions are implemented as methods on the `EVM` object and as functions inside the `core/vm/instructions.go` file. The context for each action is held in a `Contract` object.

Here are the most relevant Go-Ethereum code snippets to help you implement this system.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm *EVM
	cfg InterpreterConfig
}

// Run loops and executes the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (error handling setup)

	// Don't bother with the execution loop if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallcontext()
		// For performance reason, we store a pointer to the current interpreter
		// and the contract object. In the actual loop, we will use this pointer
		// to avoid passing them as parameters.
		//
		// Though it's not a very good practice, it can save us some overhead
		// on each step of the loop.
		it         = in
		pc         = uint64(0) // program counter
		cost       uint64
		pcCopy     uint64 // needed for the defer
		gas        = contract.Gas
		prevOp     OpCode // previously executed operation
		timeout    = in.cfg.ExecutionTimeout
		deadline   time.Time
	)
	// ... (timeout setup)

	contract.Input = input
	// The Interpreter main run loop. This loop will continue until execution of
	// the contract is completed or an error occurs.
	for {
		// ... (check for timeout, context done, etc)

		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := it.cfg.JumpTable[op]
		if operation == nil {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Execute the operation
		res, err := operation.execute(&pc, it, contract, mem, stack)
		// ... (error handling and result processing)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the verifier.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context vm.BlockContext
	// StateDB provides access to the world state
	StateDB vm.StateDB
	// depth is the current call stack
	depth int
	// chainRules are the consensus parameters for the current chain
	chainRules params.Rules
	// chainConfig is the chain configuration object
	chainConfig *params.ChainConfig
	// vmConfig is the configuration for the EVM
	vmConfig vm.Config
	// interpreter is the contract interpreter
	interpreter *EVMInterpreter
	// readOnly is the read-only indicator, which is true if we are in a static call
	readOnly bool
	// returnData is the return data of the last call, which is persisted until the
	// next call.
	returnData []byte
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single goroutine.
func NewEVM(blockCtx vm.BlockContext, txCtx vm.TxContext, statedb vm.StateDB, chainConfig *params.ChainConfig, vmConfig vm.Config) *EVM {
	evm := &EVM{
		Context:     blockCtx,
		StateDB:     statedb,
		chainConfig: chainConfig,
		chainRules:  chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time),
		vmConfig:    vmConfig,
	}
	evm.interpreter = NewEVMInterpreter(evm, vmConfig)
	return evm
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes

// the necessary steps to create accounts and send funds if during a homestead
// transaction.
func (evm *EVM) Call(caller vm.ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.vmConfig.NoRecursion && evm.depth > 0 {
		return nil, gas, nil
	}

	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() > 0 {
		return nil, gas, ErrWriteProtection
	}
	// Fail if we're trying to transfer more than the available balance
	if !evm.Context.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}

	var (
		to       = vm.AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	if !evm.StateDB.Exist(addr) {
		precompiles := vm.ActivePrecompiles(evm.chainRules)
		if precompiles[addr] == nil && evm.chainRules.IsEIP158 && value.Sign() == 0 {
			// Calling a non existing account, don't do anything, but ping the tracer
			if evm.vmConfig.Tracer != nil {
				evm.vmConfig.Tracer.CaptureEnter(vm.CALL, caller.Address(), addr, input, gas, value)
				evm.vmConfig.Tracer.CaptureExit(nil, 0, nil, false)
			}
			return nil, gas, nil
		}
		evm.StateDB.CreateAccount(addr)
	}
	// Attempt to run the block processing (including the VM)
	// If the caller has sufficient balance, transfer the value.
	// This may fail when the caller doesn't have enough balance to pay for the gas.
	// In that case, we revert to the snapshot and consume all the gas.
	evm.Context.Transfer(evm.StateDB, caller.Address(), to.Address(), value)

	// Ensure the called account is warm.
	evm.StateDB.AddAddressToAccessList(addr)

	// set the last seen block hash to the current block hash
	p, isPrecompile := evm.precompile(addr)
	if !isPrecompile {
		// POP a new instance of the interpreter. The interpreter is pointer-to-struct
		// so the pointer can be used to run another environment, but the evm should
		// not be indented to be used concurrently.
		code := evm.StateDB.GetCode(addr)
		codeHash := evm.StateDB.GetCodeHash(addr)

		// If there's no code, don't do anything useful
		if len(code) == 0 {
			ret, err = nil, nil
		} else {
			// Create a new contract from the fetched data
			contract := vm.NewContract(caller, to, value, gas)
			contract.SetCode(addr, code, codeHash)

			// Execute the code.
			ret, err = evm.interpreter.Run(contract, input, evm.readOnly)
		}
		leftOverGas = contract.Gas
	} else {
		// Execute precompiled contract
		ret, leftOverGas, err = vm.RunPrecompiledContract(p, input, gas)
	}

	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if !errors.Is(err, vm.ErrExecutionReverted) {
			// In case of a revert, we also need to restore the gas available to the call,
			// otherwise we'll have consumed gas which should be returned.
			// ErrExecutionReverted is not a VM error, so it should not e.g. trigger OOG.
			leftOverGas = 0
		}
	}
	return ret, leftOverGas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller vm.ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution.
	if evm.depth > int(params.CallDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if !caller.CanTransfer(evm.StateDB, value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Ensure the new account is warm.
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	evm.StateDB.AddAddressToAccessList(contractAddr)

	snapshot := evm.StateDB.Snapshot()

	// Create a new account on the state
	evm.StateDB.CreateAccount(contractAddr)
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1)
	}
	evm.Context.Transfer(evm.StateDB, caller.Address(), contractAddr, value)

	// Create a new contract and execute the code.
	contract := vm.NewContract(caller, vm.AccountRef(contractAddr), value, gas)
	contract.SetCodeOptionalHash(&contractAddr, crypto.Keccak256Hash(code), code)

	if evm.vmConfig.Tracer != nil {
		evm.vmConfig.Tracer.CaptureEnter(vm.CREATE, caller.Address(), contractAddr, code, gas, value)
	}
	// Max code size check
	if evm.chainRules.IsEIP170 {
		if len(code) > params.MaxCodeSize {
			return nil, contractAddr, 0, ErrMaxCodeSizeExceeded
		}
	}
	ret, err = evm.interpreter.Run(contract, nil, false)

	// check whether the max code size is exceeded
	maxCodeSizeExceeded := evm.chainRules.IsEIP170 && len(ret) > params.MaxCodeSize
	// if the contract creation ran out of gas or requires more than available gas,
	// restore the state and consume all the gas.
	if err == vm.ErrOutOfGas || maxCodeSizeExceeded {
		leftOverGas = 0
		if err == vm.ErrOutOfGas { // TODO: this is ugly, fix
			err = nil
		}
	} else {
		leftOverGas = contract.Gas
	}
	// apply refund counter
	if evm.chainRules.IsEIP3529 {
		// EIP-3529: max refund is gasused / 5
		leftOverGas += evm.StateDB.GetRefund()
	}

	// When the max code size rule was not in effect, and the deployed code is
	// too large, the contract will be created successfully with the code stored
	// but the transaction will be marked as failed.
	if !evm.chainRules.IsEIP170 && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}

	// TODO: maybe move to vm.EVM ?
	// if the contract creation failed, restore the state and consume all the gas
	if err != nil || maxCodeSizeExceeded {
		evm.StateDB.RevertToSnapshot(snapshot)
		if !errors.Is(err, vm.ErrExecutionReverted) {
			leftOverGas = 0
		}
	}
	if maxCodeSizeExceeded {
		err = ErrMaxCodeSizeExceeded
	}
	// Assign whatever is left to the caller.
	if evm.vmConfig.Tracer != nil {
		evm.vmConfig.Tracer.CaptureExit(ret, leftOverGas, err, false)
	}
	return ret, contractAddr, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// AccountRef implements ContractRef.
//
// AccountRef is used to refer to accounts that are not executing code,
// but rather being modified by the code of some other account.
type AccountRef common.Address

// Address returns the address of the contract.
func (ar AccountRef) Address() common.Address {
	return (common.Address)(ar)
}

// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of address(this) and indicates the address
	// of the current contract.
	//
	// The native ethereum address of this contract.
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	code      []byte
	codeHash  common.Hash
	input     []byte

	value *big.Int
	Gas   uint64

	//契約固有のコンテキスト
	created bool // whether this contract is created in this transaction
}

// NewContract returns a new contract environment for the execution of EVM bytecode.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	c := &Contract{
		caller: caller,
		self:   object,
		value:  value,
		Gas:    gas,
	}

	// This is ugly, but to avoid breaking the top-level API users, we have
	// to do this.
	if AccountRef, ok := object.(AccountRef); ok {
		c.CallerAddress = common.Address(AccountRef)
	} else {
		c.CallerAddress = object.Address()
	}

	return c
}

// SetCode sets the code of the contract.
func (c *Contract) SetCode(addr common.Address, hash common.Hash, code []byte) {
	c.self = AccountRef(addr)
	c.code = code
	c.codeHash = hash
	c.jumpdests = analyseJumpDests(code)
}

// UseGas reduces the amount of gas available by the given amount and returns
// whether it could be done.
func (c *Contract) UseGas(gas uint64) bool {
	if c.Gas < gas {
		return false
	}
	c.Gas -= gas
	return true
}

// Address returns the contracts address
func (c *Contract) Address() common.Address {
	return c.self.Address()
}

// Value returns the contracts value
func (c *Contract) Value() *big.Int {
	return c.value
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall is the generic call operation.
func opCall(pc *uint64, interpreter *EVMInterpreter, contract *Contract, mem *Memory, stack *Stack) error {
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	gas, to, value, inoffset, insize, retoffset, retsize := stack.Pop6()
	if !gas.IsUint64() {
		return ErrGasUintOverflow
	}
	toAddr := common.Address(to.Bytes20())

	// Get the arguments from the memory and push them to the stack.
	args := mem.GetPtr(int64(inoffset.Uint64()), int64(insize.Uint64()))

	// The call is going to be executed in a new EVM, we need to pass the caller's
	// read-only flag down, and also reset it to false for the new EVM.
	ret, returnGas, err := interpreter.evm.Call(contract, toAddr, args, gas.Uint64(), value)
	if err != nil {
		return err
	}
	stack.Push(uint256.NewInt(1))
	contract.Gas += returnGas

	if len(ret) > 0 {
		mem.Set(retoffset.Uint64(), retsize.Uint64(), ret)
	}
	interpreter.evm.returnData = ret

	return nil
}

// opCreate is the opcode for creating a new account with associated code.
func opCreate(pc *uint64, interpreter *EVMInterpreter, contract *Contract, mem *Memory, stack *Stack) error {
	// Pop value, offset and size from the stack
	value, offset, size := stack.Pop3()
	if !offset.IsUint64() || !size.IsUint64() {
		return ErrGasUintOverflow
	}
	// get the code from memory
	code := mem.GetPtr(int64(offset.Uint64()), int64(size.Uint64()))

	// check whether the interpreter is in readonly mode
	if contract.interpreter.readOnly {
		return ErrWriteProtection
	}
	// The CREATE operation is quite complex, logic is handled by the EVM
	_, address, returnGas, err := interpreter.evm.Create(contract, code, contract.Gas, value)
	// check for errors
	if err != nil {
		stack.Push(uint256.NewInt(0))
		return err
	}
	stack.Push(uint256.NewInt(0).SetBytes(address.Bytes()))
	contract.Gas = returnGas

	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// Gas costs
const (
	GasQuickStep   uint64 = 2
	GasFastestStep uint64 = 3
	GasFastStep    uint64 = 5
	GasMidStep     uint64 = 8
	GasSlowStep    uint64 = 10
	GasExtStep     uint64 = 20
)

// calcGas calculates the gas requirement for a given operation.
func calcGas(gas, cost, provided uint64, newMemSize uint64) (uint64, error) {
	// Test if there's enough gas for the operation.
	if gas < cost {
		return 0, ErrOutOfGas
	}
	gas -= cost

	// Test if there's enough gas for memory expansion.
	var memoryGas uint64
	if newMemSize > 0 {
		var err error
		if memoryGas, err = memoryGasCost(newMemSize); err != nil {
			return 0, err
		}
		if gas < memoryGas {
			return 0, ErrOutOfGas
		}
		gas -= memoryGas
	}
	// Test if there's enough gas for the call.
	// N.B. we are providing whole gas to the call, that's why we are not checking for it.
	if provided > gas {
		return 0, ErrOutOfGas
	}
	gas -= provided
	return gas, nil
}

// memoryGasCost calculates the gas cost for memory expansion.
func memoryGasCost(memSize uint64) (uint64, error) {
	// The sum of all memory expansion gas costs must not exceed the execution gas limit.
	// Additions to memory have a quadratic cost, defined as Cmem = M*Gmem + (M*M)/Gmemquad,
	// where M is the new memory size in words. The Geth implementation does not match
	// this formula exactly, so it must not be used to calculate memory gas.
	const (
		maxGas = math.MaxUint64 / 2 // gas < 2^63 so that it doesn't overflow when doubling
	)
	if memSize > maxGas {
		return 0, ErrGasUintOverflow
	}
	words := toWordSize(memSize)
	// check for overflow
	if words > 0xFFFFFFFFFFFFFFF {
		return 0, ErrGasUintOverflow
	}
	// Cmem = M_new * G_memory + floor(M_new^2 / G_quadcoeff) - C_mem(M_old)
	// where M is in words
	var cost uint64
	cost = words*params.MemoryGas + words*words/params.QuadCoeffDiv
	if cost > maxGas {
		return 0, ErrGasUintOverflow
	}
	return cost, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// StructLogger is an EVM state logger and implements EVMLogger.
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

// ...

// OnOpcode logs a new structured log message and pushes it out to the environment
//
// OnOpcode also tracks SLOAD/SSTORE ops to track storage change.
func (l *StructLogger) OnOpcode(pc uint64, opcode byte, gas, cost uint64, scope tracing.OpContext, rData []byte, depth int, err error) {
	// ... (implementation to capture opcode-level data)
	log := StructLog{pc, op, gas, cost, nil, len(memory), nil, nil, nil, depth, l.env.StateDB.GetRefund(), err}
	// ...
}

// OnEnter is called when EVM enters a new scope (via call, create or selfdestruct).
func (l *StructLogger) OnEnter(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	if l.skip {
		return
	}
	// The OnEnter hook is not enabled by default.
}

// OnExit is called when EVM exits a scope, even if the scope didn't
// execute any code.
func (l *StructLogger) OnExit(depth int, output []byte, gasUsed uint64, err error, reverted bool) {
	if depth != 0 {
		return
	}
	if l.skip {
		return
	}
	l.output = output
	l.err = err
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/native/call.go">
```go
// callFrame is the container for a single call trace.
type callFrame struct {
	Type         vm.OpCode       `json:"-"`
	From         common.Address  `json:"from"`
	Gas          uint64          `json:"gas"`
	GasUsed      uint64          `json:"gasUsed"`
	To           *common.Address `json:"to,omitempty" rlp:"optional"`
	Input        []byte          `json:"input" rlp:"optional"`
	Output       []byte          `json:"output,omitempty" rlp:"optional"`
	Error        string          `json:"error,omitempty" rlp:"optional"`
	RevertReason string          `json:"revertReason,omitempty"`
	Calls        []callFrame     `json:"calls,omitempty" rlp:"optional"`
	Logs         []callLog       `json:"logs,omitempty" rlp:"optional"`
	// Placed at end on purpose. The RLP will be decoded to 0 instead of
	// nil if there are non-empty elements after in the struct.
	Value            *big.Int `json:"value,omitempty" rlp:"optional"`
	revertedSnapshot bool
}

type callTracer struct {
	callstack []callFrame
	config    callTracerConfig
	gasLimit  uint64
	depth     int
	interrupt atomic.Bool // Atomic flag to signal execution interruption
	reason    error       // Textual reason for the interruption
}

// OnEnter is called when EVM enters a new scope (via call, create or selfdestruct).
func (t *callTracer) OnEnter(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	t.depth = depth
	if t.config.OnlyTopCall && depth > 0 {
		return
	}
	// Skip if tracing was interrupted
	if t.interrupt.Load() {
		return
	}

	toCopy := to
	call := callFrame{
		Type:  vm.OpCode(typ),
		From:  from,
		To:    &toCopy,
		Input: common.CopyBytes(input),
		Gas:   gas,
		Value: value,
	}
	if depth == 0 {
		call.Gas = t.gasLimit
	}
	t.callstack = append(t.callstack, call)
}

// OnExit is called when EVM exits a scope, even if the scope didn't
// execute any code.
func (t *callTracer) OnExit(depth int, output []byte, gasUsed uint64, err error, reverted bool) {
	if depth == 0 {
		t.captureEnd(output, gasUsed, err, reverted)
		return
	}

	t.depth = depth - 1
	if t.config.OnlyTopCall {
		return
	}

	size := len(t.callstack)
	if size <= 1 {
		return
	}
	// Pop call.
	call := t.callstack[size-1]
	t.callstack = t.callstack[:size-1]
	size -= 1

	call.GasUsed = gasUsed
	call.processOutput(output, err, reverted)
	// Nest call into parent.
	t.callstack[size-1].Calls = append(t.callstack[size-1].Calls, call)
}

// OnLog is called when a LOG opcode is executed.
func (t *callTracer) OnLog(log *types.Log) {
	// Only logs need to be captured via opcode processing
	if !t.config.WithLog {
		return
	}
	// Avoid processing nested calls when only caring about top call
	if t.config.OnlyTopCall && t.depth > 0 {
		return
	}
	// Skip if tracing was interrupted
	if t.interrupt.Load() {
		return
	}
	l := callLog{
		Address:  log.Address,
		Topics:   log.Topics,
		Data:     log.Data,
		Position: hexutil.Uint(len(t.callstack[len(t.callstack)-1].Calls)),
	}
	t.callstack[len(t.callstack)-1].Logs = append(t.callstack[len(t.callstack)-1].Logs, l)
}
```
</file>
</go-ethereum>

---

An analysis of the `go-ethereum` codebase reveals several key areas that are highly relevant to implementing the proposed Interpreter Action System. The most pertinent code snippets are from the `core/vm` package, which handles EVM execution, and the `core/state` package, which defines the state database interface.

The following Go code provides a reference for the core logic of calls, creations, state modifications, and gas calculations, which can be adapted into the structured Zig action handlers and engines as specified in the prompt.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object and provides
// the necessary tools to run a contract on the given state with
// given virtual machine settings.
type EVM struct {
	// Context provides information about the transaction and block
	TxContext
	// BlockContext provides information about the current block
	BlockContext
	// Interpreter is the EVM interpreter
	interpreter *EVMInterpreter
	// StateDB gives access to the underlying state
	StateDB StateDB
	// depth is the current call stack
	depth int
	// readOnly denotes whether the EVM is in read only mode
	readOnly bool
	// rules stores the chain configuration rules.
	chainRules params.Rules
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and reverses the state in case of an
// error.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() > 0 {
		return nil, gas, ErrWriteProtection
	}
	// Ensure the calle's account exists, creating it if necessary.
	snapshot := evm.StateDB.Snapshot()

	// ... (precompile check and execution logic)

	// It's a non-precompile, non-empty contract.
	// The 'call' is a ContractRef, and the 'addr' is the to-address.
	// The 'evm' is the state of the caller, which will be used to instantiate
	// the new scoped 'vm'.
	code, codeHash := evm.StateDB.GetCode(addr), evm.StateDB.GetCodeHash(addr)
	
	// ... (empty code check)

	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCodeOptionalHash(&addr, &codeAndHash{code: code, hash: codeHash})

	// ... (interpreter run logic)
	ret, gas, err = evm.interpreter.Run(contract, input, evm.readOnly)
	
	// When an error occurs, we revert to the snapshot and consume all gas.
	// However, if the calling contract doesn't have enough gas, we revert and
	// only charge the gas needed for the call.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			gas = 0
		}
	}
	return ret, gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if evm.readOnly {
		return nil, common.Address{}, gas, ErrWriteProtection
	}
	// Ensure the provided code is valid according to the current rules.
	if err := evm.validateCode(code); err != nil {
		return nil, common.Address{}, gas, err
	}
	// Create a new account on the state
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)

	// Check whether there's already a contract at the new address.
	contractHash := evm.StateDB.GetCodeHash(contractAddr)
	if evm.StateDB.GetNonce(contractAddr) != 0 || (contractHash != types.EmptyCodeHash && contractHash != (common.Hash{})) {
		return nil, common.Address{}, gas, ErrContractAddressCollision
	}
	// Make sure the sender has enough balance to cover the value transfer.
	if err := evm.CanTransfer(evm.StateDB, caller.Address(), value); err != nil {
		return nil, common.Address{}, gas, err
	}
	// Create a new account with the specified address
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr, evm.readOnly)

	transfer(evm.StateDB, caller.Address(), contractAddr, value)

	// initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution context
	// only.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCodeOptionalHash(&contractAddr, &codeAndHash{code: code})

	ret, gas, err = evm.interpreter.Run(contract, nil, evm.readOnly)
	// check whether the max code size has been exceeded
	if err == nil && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}
	// If the contract creation ran successfully and no errors were returned,
	// calculate the gas required to store the code. If the code could not
	// be stored due to not enough gas, we revert the state back to the original
	// and return an error.
	if err == nil {
		createDataGas := uint64(len(ret)) * params.CreateDataGas
		if gas < createDataGas {
			err = ErrCodeStoreOutOfGas
		} else {
			gas -= createDataGas
			evm.StateDB.SetCode(contractAddr, ret)
		}
	}
	// When an error happens, we revert the state and consume all gas.
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
		if err != ErrExecutionReverted {
			gas = 0
		}
	}
	return ret, contractAddr, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
// opCall implements the CALL opcode.
func opCall(pc *uint64, i *EVMInterpreter, scope *ScopeContext) error {
	stack := scope.Stack
	// Pop gas, address, value, argument offset, argument length, return offset, return length
	gas, addr, value, inoffset, insize, retoffset, retsize :=
		stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop(), stack.Pop()

	// Get arguments from memory
	args := scope.Memory.GetPtr(inoffset.Uint64(), insize.Uint64())
	
	// ... (complex gas calculation logic)

	// Execute the call
	ret, returnGas, err := i.evm.Call(scope.Contract, common.Address(addr.Bytes20()), args, gas.Uint64(), value)
	
	// ... (handle result, return data, and gas)
	
	if err != nil {
		stack.Push(uint256.NewInt(0))
	} else {
		stack.Push(uint256.NewInt(1))
	}
	scope.Contract.Gas += returnGas
	return nil
}

// opSstore implements the SSTORE opcode.
func opSstore(pc *uint64, i *EVMInterpreter, scope *ScopeContext) error {
	stack := scope.Stack
	loc := stack.Pop()
	val := stack.Pop()
	// ... (gas calculation logic)
	scope.StateDB.SetState(scope.Contract.Address(), loc.Bytes32(), val.Bytes32())
	return nil
}

// opLog0 implements the LOG0 opcode.
func opLog0(pc *uint64, i *EVMInterpreter, scope *ScopeContext) error {
	stack := scope.Stack
	offset, size := stack.Pop(), stack.Pop()
	// ... (gas calculation logic)
	
	data := scope.Memory.Get(offset.Uint64(), size.Uint64())
	i.evm.StateDB.AddLog(&types.Log{
		Address: scope.Contract.Address(),
		Topics:  []common.Hash{},
		Data:    data,
		// ...
	})
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// Gas costs for basic operations.
const (
	GasQuickStep   = 2
	GasFastestStep = 3
	GasFastStep    = 5
	GasMidStep     = 8
	GasSlowStep    = 10
	GasExtStep     = 20
)

// Gas costs for instructions
var (
	// ...
	GasCreate = uint64(32000)
	// ...
)

// gasCall calculates the gas cost for a CALL operation.
func gasCall(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	var (
		gas            = stack.peek(0)
		addr           = stack.peek(1)
		value          = stack.peek(2)
		isEIP150       = evm.chainRules.IsEIP150
		cost     uint64
	)
	// ... (gas calculation logic including memory expansion)

	// Add gas if the account does not exist and is being transferred value.
	// This is charged by the CALL opcode, not the transfer itself.
	if !evm.StateDB.Exist(toAddress(addr)) {
		if hasValue(value) {
			cost += params.CallNewAccountGas
		}
	}
	if hasValue(value) {
		cost += params.CallValueTransferGas
	}
	// ...
	availableGas := contract.Gas() - cost
	// ...
	return cost, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// StateDB is an EVM database for full state processing.
type StateDB interface {
	CreateAccount(common.Address)
	SubBalance(common.Address, *big.Int)
	AddBalance(common.Address, *big.Int)
	GetBalance(common.Address) *big.Int

	GetNonce(common.Address) uint64
	SetNonce(common.Address, uint64)

	GetCodeHash(common.Address) common.Hash
	GetCode(common.Address) []byte
	SetCode(common.Address, []byte)
	GetCodeSize(common.Address) int

	AddLog(*types.Log)
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

	RevertToSnapshot(int)
	Snapshot() int

	AddPreimage(common.Hash, []byte)
	ForEachStorage(common.Address, func(common.Hash, common.Hash) bool) error
}
```
</file>
</go-ethereum>

