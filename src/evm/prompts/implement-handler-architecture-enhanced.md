# Implement Handler Architecture

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_handler_architecture` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_handler_architecture feat_implement_handler_architecture`
3. **Work in isolation**: `cd g/feat_implement_handler_architecture`
4. **Commit message**: `✨ feat: implement configurable handler architecture for extensible execution processing`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement a configurable handler architecture that allows pluggable pre-processing and post-processing of EVM operations. This provides extensibility points for custom logic, middleware, logging, metrics collection, and specialized execution behaviors without modifying core EVM code.

## Handler Architecture Specifications

### Core Handler Framework

#### 1. Handler Interface
```zig
pub const Handler = struct {
    ptr: *anyopaque,
    vtable: *const VTable,
    
    pub const VTable = struct {
        // Lifecycle hooks
        initialize: ?*const fn(ptr: *anyopaque, context: *HandlerContext) anyerror!void,
        finalize: ?*const fn(ptr: *anyopaque, context: *HandlerContext) anyerror!void,
        
        // Pre-execution hooks
        pre_execute: ?*const fn(ptr: *anyopaque, context: *ExecutionContext) anyerror!HandlerAction,
        pre_call: ?*const fn(ptr: *anyopaque, context: *CallContext) anyerror!HandlerAction,
        pre_create: ?*const fn(ptr: *anyopaque, context: *CreateContext) anyerror!HandlerAction,
        pre_opcode: ?*const fn(ptr: *anyopaque, context: *OpcodeContext) anyerror!HandlerAction,
        
        // Post-execution hooks
        post_execute: ?*const fn(ptr: *anyopaque, context: *ExecutionContext, result: *ExecutionResult) anyerror!void,
        post_call: ?*const fn(ptr: *anyopaque, context: *CallContext, result: *CallResult) anyerror!void,
        post_create: ?*const fn(ptr: *anyopaque, context: *CreateContext, result: *CreateResult) anyerror!void,
        post_opcode: ?*const fn(ptr: *anyopaque, context: *OpcodeContext, result: *OpcodeResult) anyerror!void,
        
        // State hooks
        on_state_change: ?*const fn(ptr: *anyopaque, change: *StateChange) anyerror!void,
        on_log_emit: ?*const fn(ptr: *anyopaque, log: *EvmLog) anyerror!void,
        on_error: ?*const fn(ptr: *anyopaque, error_info: *ErrorInfo) anyerror!void,
    };
    
    pub fn init(pointer: anytype) Handler {
        const Ptr = @TypeOf(pointer);
        const ptr_info = @typeInfo(Ptr);
        
        if (ptr_info != .Pointer) @compileError("Expected pointer");
        if (ptr_info.Pointer.size != .One) @compileError("Expected single item pointer");
        
        const Child = ptr_info.Pointer.child;
        
        const impl = struct {
            fn initialize(ptr: *anyopaque, context: *HandlerContext) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "initialize")) {
                    return self.initialize(context);
                }
            }
            
            fn finalize(ptr: *anyopaque, context: *HandlerContext) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "finalize")) {
                    return self.finalize(context);
                }
            }
            
            fn pre_execute(ptr: *anyopaque, context: *ExecutionContext) anyerror!HandlerAction {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "pre_execute")) {
                    return self.pre_execute(context);
                }
                return HandlerAction.Continue;
            }
            
            fn pre_call(ptr: *anyopaque, context: *CallContext) anyerror!HandlerAction {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "pre_call")) {
                    return self.pre_call(context);
                }
                return HandlerAction.Continue;
            }
            
            fn pre_create(ptr: *anyopaque, context: *CreateContext) anyerror!HandlerAction {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "pre_create")) {
                    return self.pre_create(context);
                }
                return HandlerAction.Continue;
            }
            
            fn pre_opcode(ptr: *anyopaque, context: *OpcodeContext) anyerror!HandlerAction {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "pre_opcode")) {
                    return self.pre_opcode(context);
                }
                return HandlerAction.Continue;
            }
            
            fn post_execute(ptr: *anyopaque, context: *ExecutionContext, result: *ExecutionResult) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "post_execute")) {
                    return self.post_execute(context, result);
                }
            }
            
            fn post_call(ptr: *anyopaque, context: *CallContext, result: *CallResult) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "post_call")) {
                    return self.post_call(context, result);
                }
            }
            
            fn post_create(ptr: *anyopaque, context: *CreateContext, result: *CreateResult) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "post_create")) {
                    return self.post_create(context, result);
                }
            }
            
            fn post_opcode(ptr: *anyopaque, context: *OpcodeContext, result: *OpcodeResult) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "post_opcode")) {
                    return self.post_opcode(context, result);
                }
            }
            
            fn on_state_change(ptr: *anyopaque, change: *StateChange) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "on_state_change")) {
                    return self.on_state_change(change);
                }
            }
            
            fn on_log_emit(ptr: *anyopaque, log: *EvmLog) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "on_log_emit")) {
                    return self.on_log_emit(log);
                }
            }
            
            fn on_error(ptr: *anyopaque, error_info: *ErrorInfo) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "on_error")) {
                    return self.on_error(error_info);
                }
            }
        };
        
        return Handler{
            .ptr = pointer,
            .vtable = &VTable{
                .initialize = if (@hasDecl(Child, "initialize")) impl.initialize else null,
                .finalize = if (@hasDecl(Child, "finalize")) impl.finalize else null,
                .pre_execute = if (@hasDecl(Child, "pre_execute")) impl.pre_execute else null,
                .pre_call = if (@hasDecl(Child, "pre_call")) impl.pre_call else null,
                .pre_create = if (@hasDecl(Child, "pre_create")) impl.pre_create else null,
                .pre_opcode = if (@hasDecl(Child, "pre_opcode")) impl.pre_opcode else null,
                .post_execute = if (@hasDecl(Child, "post_execute")) impl.post_execute else null,
                .post_call = if (@hasDecl(Child, "post_call")) impl.post_call else null,
                .post_create = if (@hasDecl(Child, "post_create")) impl.post_create else null,
                .post_opcode = if (@hasDecl(Child, "post_opcode")) impl.post_opcode else null,
                .on_state_change = if (@hasDecl(Child, "on_state_change")) impl.on_state_change else null,
                .on_log_emit = if (@hasDecl(Child, "on_log_emit")) impl.on_log_emit else null,
                .on_error = if (@hasDecl(Child, "on_error")) impl.on_error else null,
            },
        };
    }
};

pub const HandlerAction = enum {
    Continue,      // Continue normal execution
    Skip,          // Skip current operation
    Halt,          // Halt execution
    Revert,        // Revert with error
    Modify,        // Modify execution parameters
};
```

#### 2. Context Types
```zig
pub const HandlerContext = struct {
    vm: *Vm,
    chain_id: u64,
    hardfork: Hardfork,
    block_context: *BlockContext,
    tx_context: *TransactionContext,
    allocator: std.mem.Allocator,
};

pub const ExecutionContext = struct {
    handler_context: *HandlerContext,
    caller: Address,
    callee: Address,
    input: []const u8,
    value: U256,
    gas_limit: u64,
    depth: u32,
    is_static: bool,
    is_create: bool,
};

pub const CallContext = struct {
    execution_context: *ExecutionContext,
    call_type: CallType,
    target_address: Address,
    call_data: []const u8,
    call_value: U256,
    gas_limit: u64,
    
    pub const CallType = enum {
        Call,
        CallCode,
        DelegateCall,
        StaticCall,
    };
};

pub const CreateContext = struct {
    execution_context: *ExecutionContext,
    create_type: CreateType,
    init_code: []const u8,
    value: U256,
    salt: ?U256,
    
    pub const CreateType = enum {
        Create,
        Create2,
    };
};

pub const OpcodeContext = struct {
    execution_context: *ExecutionContext,
    frame: *Frame,
    opcode: u8,
    pc: u32,
    gas_remaining: u64,
    gas_cost: u64,
    immediate_data: ?[]const u8,
};

pub const StateChange = struct {
    change_type: StateChangeType,
    address: Address,
    key: ?U256,
    old_value: ?U256,
    new_value: ?U256,
    
    pub const StateChangeType = enum {
        BalanceChange,
        NonceChange,
        CodeChange,
        StorageChange,
        AccountCreation,
        AccountDeletion,
    };
};

pub const ErrorInfo = struct {
    error_type: ErrorType,
    message: []const u8,
    context: *ExecutionContext,
    pc: ?u32,
    opcode: ?u8,
    gas_remaining: u64,
    
    pub const ErrorType = enum {
        OutOfGas,
        StackUnderflow,
        StackOverflow,
        InvalidJump,
        InvalidOpcode,
        InsufficientBalance,
        CallDepthExceeded,
        StaticCallStateChange,
        PrecompileError,
        Custom,
    };
};
```

#### 3. Handler Manager
```zig
pub const HandlerManager = struct {
    handlers: std.ArrayList(Handler),
    allocator: std.mem.Allocator,
    enabled: bool,
    
    pub fn init(allocator: std.mem.Allocator) HandlerManager {
        return HandlerManager{
            .handlers = std.ArrayList(Handler).init(allocator),
            .allocator = allocator,
            .enabled = false,
        };
    }
    
    pub fn deinit(self: *HandlerManager) void {
        self.handlers.deinit();
    }
    
    pub fn add_handler(self: *HandlerManager, handler: Handler) !void {
        try self.handlers.append(handler);
        self.enabled = true;
    }
    
    pub fn remove_handler(self: *HandlerManager, handler: Handler) void {
        for (self.handlers.items, 0..) |item, i| {
            if (item.ptr == handler.ptr) {
                _ = self.handlers.orderedRemove(i);
                break;
            }
        }
        
        if (self.handlers.items.len == 0) {
            self.enabled = false;
        }
    }
    
    pub fn clear_handlers(self: *HandlerManager) void {
        self.handlers.clearRetainingCapacity();
        self.enabled = false;
    }
    
    pub fn is_enabled(self: *const HandlerManager) bool {
        return self.enabled and self.handlers.items.len > 0;
    }
    
    // Lifecycle hooks
    pub fn initialize(self: *HandlerManager, context: *HandlerContext) !void {
        if (!self.is_enabled()) return;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.initialize) |func| {
                func(handler.ptr, context) catch |err| {
                    std.log.warn("Handler initialization failed: {}", .{err});
                };
            }
        }
    }
    
    pub fn finalize(self: *HandlerManager, context: *HandlerContext) !void {
        if (!self.is_enabled()) return;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.finalize) |func| {
                func(handler.ptr, context) catch |err| {
                    std.log.warn("Handler finalization failed: {}", .{err});
                };
            }
        }
    }
    
    // Pre-execution hooks
    pub fn pre_execute(self: *HandlerManager, context: *ExecutionContext) !HandlerAction {
        if (!self.is_enabled()) return HandlerAction.Continue;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.pre_execute) |func| {
                const action = func(handler.ptr, context) catch |err| {
                    std.log.warn("Handler pre_execute failed: {}", .{err});
                    continue;
                };
                
                switch (action) {
                    .Continue => continue,
                    else => return action,
                }
            }
        }
        
        return HandlerAction.Continue;
    }
    
    pub fn pre_call(self: *HandlerManager, context: *CallContext) !HandlerAction {
        if (!self.is_enabled()) return HandlerAction.Continue;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.pre_call) |func| {
                const action = func(handler.ptr, context) catch |err| {
                    std.log.warn("Handler pre_call failed: {}", .{err});
                    continue;
                };
                
                switch (action) {
                    .Continue => continue,
                    else => return action,
                }
            }
        }
        
        return HandlerAction.Continue;
    }
    
    pub fn pre_create(self: *HandlerManager, context: *CreateContext) !HandlerAction {
        if (!self.is_enabled()) return HandlerAction.Continue;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.pre_create) |func| {
                const action = func(handler.ptr, context) catch |err| {
                    std.log.warn("Handler pre_create failed: {}", .{err});
                    continue;
                };
                
                switch (action) {
                    .Continue => continue,
                    else => return action,
                }
            }
        }
        
        return HandlerAction.Continue;
    }
    
    pub fn pre_opcode(self: *HandlerManager, context: *OpcodeContext) !HandlerAction {
        if (!self.is_enabled()) return HandlerAction.Continue;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.pre_opcode) |func| {
                const action = func(handler.ptr, context) catch |err| {
                    std.log.warn("Handler pre_opcode failed: {}", .{err});
                    continue;
                };
                
                switch (action) {
                    .Continue => continue,
                    else => return action,
                }
            }
        }
        
        return HandlerAction.Continue;
    }
    
    // Post-execution hooks
    pub fn post_execute(self: *HandlerManager, context: *ExecutionContext, result: *ExecutionResult) !void {
        if (!self.is_enabled()) return;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.post_execute) |func| {
                func(handler.ptr, context, result) catch |err| {
                    std.log.warn("Handler post_execute failed: {}", .{err});
                };
            }
        }
    }
    
    pub fn post_call(self: *HandlerManager, context: *CallContext, result: *CallResult) !void {
        if (!self.is_enabled()) return;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.post_call) |func| {
                func(handler.ptr, context, result) catch |err| {
                    std.log.warn("Handler post_call failed: {}", .{err});
                };
            }
        }
    }
    
    pub fn post_create(self: *HandlerManager, context: *CreateContext, result: *CreateResult) !void {
        if (!self.is_enabled()) return;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.post_create) |func| {
                func(handler.ptr, context, result) catch |err| {
                    std.log.warn("Handler post_create failed: {}", .{err});
                };
            }
        }
    }
    
    pub fn post_opcode(self: *HandlerManager, context: *OpcodeContext, result: *OpcodeResult) !void {
        if (!self.is_enabled()) return;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.post_opcode) |func| {
                func(handler.ptr, context, result) catch |err| {
                    std.log.warn("Handler post_opcode failed: {}", .{err});
                };
            }
        }
    }
    
    // State change hooks
    pub fn on_state_change(self: *HandlerManager, change: *StateChange) !void {
        if (!self.is_enabled()) return;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.on_state_change) |func| {
                func(handler.ptr, change) catch |err| {
                    std.log.warn("Handler on_state_change failed: {}", .{err});
                };
            }
        }
    }
    
    pub fn on_log_emit(self: *HandlerManager, log: *EvmLog) !void {
        if (!self.is_enabled()) return;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.on_log_emit) |func| {
                func(handler.ptr, log) catch |err| {
                    std.log.warn("Handler on_log_emit failed: {}", .{err});
                };
            }
        }
    }
    
    pub fn on_error(self: *HandlerManager, error_info: *ErrorInfo) !void {
        if (!self.is_enabled()) return;
        
        for (self.handlers.items) |*handler| {
            if (handler.vtable.on_error) |func| {
                func(handler.ptr, error_info) catch |err| {
                    std.log.warn("Handler on_error failed: {}", .{err});
                };
            }
        }
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Pluggable Architecture**: Easy registration and removal of handlers
2. **Comprehensive Hooks**: Cover all major execution phases and events
3. **Action Control**: Handlers can influence execution flow
4. **Error Isolation**: Handler failures don't crash VM execution
5. **Performance**: Minimal overhead when no handlers are registered
6. **Type Safety**: Compile-time checked handler interfaces

## Implementation Tasks

### Task 1: Implement Built-in Handlers
File: `/src/evm/handlers/builtin_handlers.zig`
```zig
const std = @import("std");
const Handler = @import("handler.zig").Handler;
const HandlerAction = @import("handler.zig").HandlerAction;
const HandlerContext = @import("handler.zig").HandlerContext;
const ExecutionContext = @import("handler.zig").ExecutionContext;
const CallContext = @import("handler.zig").CallContext;
const CreateContext = @import("handler.zig").CreateContext;
const OpcodeContext = @import("handler.zig").OpcodeContext;
const StateChange = @import("handler.zig").StateChange;
const ErrorInfo = @import("handler.zig").ErrorInfo;
const ExecutionResult = @import("../execution/execution_result.zig").ExecutionResult;
const CallResult = @import("../execution/call_result.zig").CallResult;
const CreateResult = @import("../execution/create_result.zig").CreateResult;
const OpcodeResult = @import("../execution/opcode_result.zig").OpcodeResult;
const EvmLog = @import("../state/evm_log.zig").Log;
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;

// Logging handler for debugging
pub const LoggingHandler = struct {
    allocator: std.mem.Allocator,
    log_level: LogLevel,
    operation_count: u64,
    
    pub const LogLevel = enum {
        None,
        Error,
        Warn,
        Info,
        Debug,
        Trace,
    };
    
    pub fn init(allocator: std.mem.Allocator, log_level: LogLevel) LoggingHandler {
        return LoggingHandler{
            .allocator = allocator,
            .log_level = log_level,
            .operation_count = 0,
        };
    }
    
    pub fn initialize(self: *LoggingHandler, context: *HandlerContext) !void {
        if (@intFromEnum(self.log_level) >= @intFromEnum(LogLevel.Info)) {
            std.log.info("LoggingHandler: Initialized for chain {}", .{context.chain_id});
        }
        self.operation_count = 0;
    }
    
    pub fn finalize(self: *LoggingHandler, context: *HandlerContext) !void {
        if (@intFromEnum(self.log_level) >= @intFromEnum(LogLevel.Info)) {
            std.log.info("LoggingHandler: Finalized after {} operations", .{self.operation_count});
        }
    }
    
    pub fn pre_execute(self: *LoggingHandler, context: *ExecutionContext) !HandlerAction {
        if (@intFromEnum(self.log_level) >= @intFromEnum(LogLevel.Debug)) {
            std.log.debug("Executing: {} -> {} value={} gas={}", .{
                context.caller,
                context.callee,
                context.value,
                context.gas_limit,
            });
        }
        return HandlerAction.Continue;
    }
    
    pub fn pre_call(self: *LoggingHandler, context: *CallContext) !HandlerAction {
        if (@intFromEnum(self.log_level) >= @intFromEnum(LogLevel.Debug)) {
            std.log.debug("CALL: {} type={s} gas={}", .{
                context.target_address,
                @tagName(context.call_type),
                context.gas_limit,
            });
        }
        return HandlerAction.Continue;
    }
    
    pub fn pre_create(self: *LoggingHandler, context: *CreateContext) !HandlerAction {
        if (@intFromEnum(self.log_level) >= @intFromEnum(LogLevel.Debug)) {
            std.log.debug("CREATE: type={s} value={} code_size={}", .{
                @tagName(context.create_type),
                context.value,
                context.init_code.len,
            });
        }
        return HandlerAction.Continue;
    }
    
    pub fn pre_opcode(self: *LoggingHandler, context: *OpcodeContext) !HandlerAction {
        if (@intFromEnum(self.log_level) >= @intFromEnum(LogLevel.Trace)) {
            std.log.debug("OP: PC={} {s}(0x{x}) gas={}", .{
                context.pc,
                get_opcode_name(context.opcode),
                context.opcode,
                context.gas_remaining,
            });
        }
        self.operation_count += 1;
        return HandlerAction.Continue;
    }
    
    pub fn post_execute(self: *LoggingHandler, context: *ExecutionContext, result: *ExecutionResult) !void {
        if (@intFromEnum(self.log_level) >= @intFromEnum(LogLevel.Info)) {
            std.log.info("Execution completed: success={} gas_used={}", .{
                result.is_success(),
                result.gas_used,
            });
        }
    }
    
    pub fn on_state_change(self: *LoggingHandler, change: *StateChange) !void {
        if (@intFromEnum(self.log_level) >= @intFromEnum(LogLevel.Debug)) {
            std.log.debug("State change: {} type={s}", .{
                change.address,
                @tagName(change.change_type),
            });
        }
    }
    
    pub fn on_log_emit(self: *LoggingHandler, log: *EvmLog) !void {
        if (@intFromEnum(self.log_level) >= @intFromEnum(LogLevel.Info)) {
            std.log.info("LOG: {} topics={} data={} bytes", .{
                log.address,
                log.topics.len,
                log.data.len,
            });
        }
    }
    
    pub fn on_error(self: *LoggingHandler, error_info: *ErrorInfo) !void {
        if (@intFromEnum(self.log_level) >= @intFromEnum(LogLevel.Error)) {
            std.log.err("Execution error: {s} - {s}", .{
                @tagName(error_info.error_type),
                error_info.message,
            });
        }
    }
};

// Metrics collection handler
pub const MetricsHandler = struct {
    allocator: std.mem.Allocator,
    metrics: Metrics,
    
    pub const Metrics = struct {
        total_executions: u64,
        total_calls: u64,
        total_creates: u64,
        total_opcodes: u64,
        total_gas_used: u64,
        execution_time_ns: i128,
        error_count: u64,
        state_changes: u64,
        logs_emitted: u64,
        
        pub fn init() Metrics {
            return std.mem.zeroes(Metrics);
        }
        
        pub fn print_summary(self: *const Metrics) void {
            std.log.info("=== EXECUTION METRICS ===");
            std.log.info("Executions: {}", .{self.total_executions});
            std.log.info("Calls: {}", .{self.total_calls});
            std.log.info("Creates: {}", .{self.total_creates});
            std.log.info("Opcodes: {}", .{self.total_opcodes});
            std.log.info("Gas used: {}", .{self.total_gas_used});
            std.log.info("Execution time: {d:.2}ms", .{@as(f64, @floatFromInt(self.execution_time_ns)) / 1_000_000.0});
            std.log.info("Errors: {}", .{self.error_count});
            std.log.info("State changes: {}", .{self.state_changes});
            std.log.info("Logs emitted: {}", .{self.logs_emitted});
        }
    };
    
    pub fn init(allocator: std.mem.Allocator) MetricsHandler {
        return MetricsHandler{
            .allocator = allocator,
            .metrics = Metrics.init(),
        };
    }
    
    pub fn initialize(self: *MetricsHandler, context: *HandlerContext) !void {
        _ = context;
        self.metrics = Metrics.init();
    }
    
    pub fn pre_execute(self: *MetricsHandler, context: *ExecutionContext) !HandlerAction {
        _ = context;
        self.metrics.total_executions += 1;
        return HandlerAction.Continue;
    }
    
    pub fn pre_call(self: *MetricsHandler, context: *CallContext) !HandlerAction {
        _ = context;
        self.metrics.total_calls += 1;
        return HandlerAction.Continue;
    }
    
    pub fn pre_create(self: *MetricsHandler, context: *CreateContext) !HandlerAction {
        _ = context;
        self.metrics.total_creates += 1;
        return HandlerAction.Continue;
    }
    
    pub fn pre_opcode(self: *MetricsHandler, context: *OpcodeContext) !HandlerAction {
        _ = context;
        self.metrics.total_opcodes += 1;
        return HandlerAction.Continue;
    }
    
    pub fn post_execute(self: *MetricsHandler, context: *ExecutionContext, result: *ExecutionResult) !void {
        _ = context;
        self.metrics.total_gas_used += result.gas_used;
        self.metrics.execution_time_ns += result.execution_time_ns orelse 0;
    }
    
    pub fn on_state_change(self: *MetricsHandler, change: *StateChange) !void {
        _ = change;
        self.metrics.state_changes += 1;
    }
    
    pub fn on_log_emit(self: *MetricsHandler, log: *EvmLog) !void {
        _ = log;
        self.metrics.logs_emitted += 1;
    }
    
    pub fn on_error(self: *MetricsHandler, error_info: *ErrorInfo) !void {
        _ = error_info;
        self.metrics.error_count += 1;
    }
    
    pub fn get_metrics(self: *const MetricsHandler) *const Metrics {
        return &self.metrics;
    }
};

// Security monitoring handler
pub const SecurityHandler = struct {
    allocator: std.mem.Allocator,
    config: SecurityConfig,
    alerts: std.ArrayList(SecurityAlert),
    
    pub const SecurityConfig = struct {
        max_call_depth: u32,
        max_gas_limit: u64,
        max_value_transfer: U256,
        monitor_external_calls: bool,
        monitor_storage_writes: bool,
        monitor_selfdestructs: bool,
        
        pub fn default() SecurityConfig {
            return SecurityConfig{
                .max_call_depth = 1024,
                .max_gas_limit = 30_000_000,
                .max_value_transfer = U256.from_u64(std.math.maxInt(u64)),
                .monitor_external_calls = true,
                .monitor_storage_writes = true,
                .monitor_selfdestructs = true,
            };
        }
    };
    
    pub const SecurityAlert = struct {
        alert_type: AlertType,
        severity: Severity,
        message: []const u8,
        context: []const u8,
        timestamp: i64,
        
        pub const AlertType = enum {
            CallDepthExceeded,
            GasLimitExceeded,
            LargeValueTransfer,
            ExternalCall,
            StorageWrite,
            SelfDestruct,
            ReentrancyRisk,
        };
        
        pub const Severity = enum {
            Low,
            Medium,
            High,
            Critical,
        };
    };
    
    pub fn init(allocator: std.mem.Allocator, config: SecurityConfig) SecurityHandler {
        return SecurityHandler{
            .allocator = allocator,
            .config = config,
            .alerts = std.ArrayList(SecurityAlert).init(allocator),
        };
    }
    
    pub fn deinit(self: *SecurityHandler) void {
        for (self.alerts.items) |alert| {
            self.allocator.free(alert.message);
            self.allocator.free(alert.context);
        }
        self.alerts.deinit();
    }
    
    pub fn pre_execute(self: *SecurityHandler, context: *ExecutionContext) !HandlerAction {
        // Check gas limit
        if (context.gas_limit > self.config.max_gas_limit) {
            try self.add_alert(.GasLimitExceeded, .High, 
                "Gas limit exceeds maximum allowed", "");
        }
        
        // Check value transfer
        if (context.value > self.config.max_value_transfer) {
            try self.add_alert(.LargeValueTransfer, .Medium, 
                "Large value transfer detected", "");
        }
        
        // Check call depth
        if (context.depth > self.config.max_call_depth) {
            try self.add_alert(.CallDepthExceeded, .Critical, 
                "Call depth exceeded maximum", "");
            return HandlerAction.Halt;
        }
        
        return HandlerAction.Continue;
    }
    
    pub fn pre_call(self: *SecurityHandler, context: *CallContext) !HandlerAction {
        if (self.config.monitor_external_calls) {
            try self.add_alert(.ExternalCall, .Low, 
                "External call detected", "");
        }
        
        return HandlerAction.Continue;
    }
    
    pub fn pre_opcode(self: *SecurityHandler, context: *OpcodeContext) !HandlerAction {
        switch (context.opcode) {
            0x55 => { // SSTORE
                if (self.config.monitor_storage_writes) {
                    try self.add_alert(.StorageWrite, .Low, 
                        "Storage write operation", "");
                }
            },
            0xFF => { // SELFDESTRUCT
                if (self.config.monitor_selfdestructs) {
                    try self.add_alert(.SelfDestruct, .High, 
                        "SELFDESTRUCT operation detected", "");
                }
            },
            else => {},
        }
        
        return HandlerAction.Continue;
    }
    
    fn add_alert(
        self: *SecurityHandler, 
        alert_type: SecurityAlert.AlertType, 
        severity: SecurityAlert.Severity,
        message: []const u8,
        context: []const u8
    ) !void {
        const alert = SecurityAlert{
            .alert_type = alert_type,
            .severity = severity,
            .message = try self.allocator.dupe(u8, message),
            .context = try self.allocator.dupe(u8, context),
            .timestamp = std.time.milliTimestamp(),
        };
        
        try self.alerts.append(alert);
        
        // Log high severity alerts immediately
        if (@intFromEnum(severity) >= @intFromEnum(SecurityAlert.Severity.High)) {
            std.log.warn("Security Alert: {s} - {s}", .{
                @tagName(alert_type), message
            });
        }
    }
    
    pub fn get_alerts(self: *const SecurityHandler) []const SecurityAlert {
        return self.alerts.items;
    }
    
    pub fn clear_alerts(self: *SecurityHandler) void {
        for (self.alerts.items) |alert| {
            self.allocator.free(alert.message);
            self.allocator.free(alert.context);
        }
        self.alerts.clearRetainingCapacity();
    }
};

// Profiling handler for performance analysis
pub const ProfilingHandler = struct {
    allocator: std.mem.Allocator,
    enabled: bool,
    profiles: std.HashMap([]const u8, ProfileData, std.hash_map.StringContext, std.hash_map.default_max_load_percentage),
    current_operation: ?ProfileEntry,
    
    pub const ProfileData = struct {
        total_time_ns: i128,
        call_count: u64,
        min_time_ns: i128,
        max_time_ns: i128,
        total_gas_used: u64,
        
        pub fn init() ProfileData {
            return ProfileData{
                .total_time_ns = 0,
                .call_count = 0,
                .min_time_ns = std.math.maxInt(i128),
                .max_time_ns = 0,
                .total_gas_used = 0,
            };
        }
        
        pub fn update(self: *ProfileData, time_ns: i128, gas_used: u64) void {
            self.total_time_ns += time_ns;
            self.call_count += 1;
            self.min_time_ns = @min(self.min_time_ns, time_ns);
            self.max_time_ns = @max(self.max_time_ns, time_ns);
            self.total_gas_used += gas_used;
        }
        
        pub fn avg_time_ns(self: *const ProfileData) i128 {
            return if (self.call_count > 0) @divTrunc(self.total_time_ns, @as(i128, @intCast(self.call_count))) else 0;
        }
    };
    
    pub const ProfileEntry = struct {
        name: []const u8,
        start_time: i128,
        start_gas: u64,
    };
    
    pub fn init(allocator: std.mem.Allocator) ProfilingHandler {
        return ProfilingHandler{
            .allocator = allocator,
            .enabled = true,
            .profiles = std.HashMap([]const u8, ProfileData, std.hash_map.StringContext, std.hash_map.default_max_load_percentage).init(allocator),
            .current_operation = null,
        };
    }
    
    pub fn deinit(self: *ProfilingHandler) void {
        var iterator = self.profiles.iterator();
        while (iterator.next()) |entry| {
            self.allocator.free(entry.key_ptr.*);
        }
        self.profiles.deinit();
    }
    
    pub fn pre_execute(self: *ProfilingHandler, context: *ExecutionContext) !HandlerAction {
        if (self.enabled) {
            self.current_operation = ProfileEntry{
                .name = try self.allocator.dupe(u8, "execute"),
                .start_time = std.time.nanoTimestamp(),
                .start_gas = context.gas_limit,
            };
        }
        return HandlerAction.Continue;
    }
    
    pub fn post_execute(self: *ProfilingHandler, context: *ExecutionContext, result: *ExecutionResult) !void {
        if (self.enabled and self.current_operation != null) {
            const operation = self.current_operation.?;
            const end_time = std.time.nanoTimestamp();
            const duration = end_time - operation.start_time;
            
            var profile = self.profiles.get(operation.name) orelse ProfileData.init();
            profile.update(duration, result.gas_used);
            
            try self.profiles.put(operation.name, profile);
            self.current_operation = null;
        }
    }
    
    pub fn print_profile_report(self: *const ProfilingHandler) void {
        std.log.info("=== PROFILING REPORT ===");
        
        var iterator = self.profiles.iterator();
        while (iterator.next()) |entry| {
            const name = entry.key_ptr.*;
            const data = entry.value_ptr.*;
            
            std.log.info("{s}:", .{name});
            std.log.info("  Calls: {}", .{data.call_count});
            std.log.info("  Total time: {d:.2}ms", .{@as(f64, @floatFromInt(data.total_time_ns)) / 1_000_000.0});
            std.log.info("  Avg time: {d:.2}μs", .{@as(f64, @floatFromInt(data.avg_time_ns())) / 1000.0});
            std.log.info("  Min time: {d:.2}μs", .{@as(f64, @floatFromInt(data.min_time_ns)) / 1000.0});
            std.log.info("  Max time: {d:.2}μs", .{@as(f64, @floatFromInt(data.max_time_ns)) / 1000.0});
            std.log.info("  Total gas: {}", .{data.total_gas_used});
        }
    }
};

fn get_opcode_name(opcode: u8) []const u8 {
    return switch (opcode) {
        0x00 => "STOP",
        0x01 => "ADD",
        0x02 => "MUL",
        0x03 => "SUB",
        0x04 => "DIV",
        0x05 => "SDIV",
        0x06 => "MOD",
        0x07 => "SMOD",
        0x08 => "ADDMOD",
        0x09 => "MULMOD",
        0x0A => "EXP",
        0x0B => "SIGNEXTEND",
        // ... continue for all opcodes
        0x54 => "SLOAD",
        0x55 => "SSTORE",
        0xF1 => "CALL",
        0xFF => "SELFDESTRUCT",
        else => "UNKNOWN",
    };
}
```

### Task 2: Integrate Handlers with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const HandlerManager = @import("handlers/handler_manager.zig").HandlerManager;
const Handler = @import("handlers/handler.zig").Handler;
const HandlerContext = @import("handlers/handler.zig").HandlerContext;
const ExecutionContext = @import("handlers/handler.zig").ExecutionContext;

pub const Vm = struct {
    // Existing fields...
    handler_manager: HandlerManager,
    handler_context: HandlerContext,
    
    pub fn init(allocator: std.mem.Allocator, chain_id: u64) !Vm {
        var vm = Vm{
            // Existing initialization...
            .handler_manager = HandlerManager.init(allocator),
            .handler_context = undefined, // Will be initialized below
        };
        
        // Initialize handler context
        vm.handler_context = HandlerContext{
            .vm = &vm,
            .chain_id = chain_id,
            .hardfork = Hardfork.Cancun, // Default
            .block_context = &vm.context.block,
            .tx_context = &vm.context.tx,
            .allocator = allocator,
        };
        
        return vm;
    }
    
    pub fn deinit(self: *Vm) void {
        // Existing cleanup...
        self.handler_manager.deinit();
    }
    
    pub fn add_handler(self: *Vm, handler: Handler) !void {
        try self.handler_manager.add_handler(handler);
        
        // Initialize the handler
        try self.handler_manager.initialize(&self.handler_context);
    }
    
    pub fn remove_handler(self: *Vm, handler: Handler) void {
        self.handler_manager.remove_handler(handler);
    }
    
    pub fn execute_with_handlers(
        self: *Vm,
        caller: Address,
        callee: Address,
        value: U256,
        input: []const u8,
        gas_limit: u64
    ) !ExecutionResult {
        // Create execution context
        var exec_context = ExecutionContext{
            .handler_context = &self.handler_context,
            .caller = caller,
            .callee = callee,
            .input = input,
            .value = value,
            .gas_limit = gas_limit,
            .depth = self.call_depth,
            .is_static = self.is_static_call,
            .is_create = false,
        };
        
        // Pre-execution handlers
        const pre_action = try self.handler_manager.pre_execute(&exec_context);
        switch (pre_action) {
            .Continue => {},
            .Skip => return ExecutionResult.halt,
            .Halt => return ExecutionResult.halt,
            .Revert => return ExecutionResult.revert,
            .Modify => {}, // Context may have been modified
        }
        
        // Execute normally
        const result = try self.execute_internal(caller, callee, value, input, gas_limit);
        
        // Post-execution handlers
        var mutable_result = result;
        try self.handler_manager.post_execute(&exec_context, &mutable_result);
        
        return mutable_result;
    }
    
    pub fn execute_opcode_with_handlers(
        self: *Vm,
        frame: *Frame,
        opcode: u8
    ) !ExecutionResult {
        // Create opcode context
        var opcode_context = OpcodeContext{
            .execution_context = &ExecutionContext{
                .handler_context = &self.handler_context,
                .caller = frame.context.caller,
                .callee = frame.context.address,
                .input = frame.context.call_data,
                .value = frame.context.call_value,
                .gas_limit = frame.gas_limit,
                .depth = self.call_depth,
                .is_static = self.is_static_call,
                .is_create = false,
            },
            .frame = frame,
            .opcode = opcode,
            .pc = frame.pc,
            .gas_remaining = frame.gas_remaining,
            .gas_cost = self.calculate_gas_cost(frame, opcode),
            .immediate_data = self.get_immediate_data(frame, opcode),
        };
        
        // Pre-opcode handlers
        const pre_action = try self.handler_manager.pre_opcode(&opcode_context);
        switch (pre_action) {
            .Continue => {},
            .Skip => {
                frame.pc += 1;
                return ExecutionResult.continue_execution;
            },
            .Halt => return ExecutionResult.halt,
            .Revert => return ExecutionResult.revert,
            .Modify => {}, // Context may have been modified
        }
        
        // Execute opcode
        const result = try self.execute_opcode_internal(frame, opcode);
        
        // Post-opcode handlers
        var opcode_result = OpcodeResult{
            .execution_result = result,
            .gas_used = opcode_context.gas_cost,
            .pc_increment = 1,
        };
        try self.handler_manager.post_opcode(&opcode_context, &opcode_result);
        
        return opcode_result.execution_result;
    }
    
    fn notify_state_change(self: *Vm, change: StateChange) void {
        self.handler_manager.on_state_change(&change) catch |err| {
            std.log.warn("Failed to notify handlers of state change: {}", .{err});
        };
    }
    
    fn notify_log_emit(self: *Vm, log: EvmLog) void {
        var mutable_log = log;
        self.handler_manager.on_log_emit(&mutable_log) catch |err| {
            std.log.warn("Failed to notify handlers of log emit: {}", .{err});
        };
    }
    
    fn notify_error(self: *Vm, error_info: ErrorInfo) void {
        var mutable_error = error_info;
        self.handler_manager.on_error(&mutable_error) catch |err| {
            std.log.warn("Failed to notify handlers of error: {}", .{err});
        };
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/handlers/handler_architecture_test.zig`

### Test Cases
```zig
test "handler registration and removal" {
    // Test handler registration
    // Test handler removal
    // Test multiple handlers
}

test "handler execution flow" {
    // Test pre/post execution hooks
    // Test handler action responses
    // Test handler composition
}

test "builtin handlers functionality" {
    // Test LoggingHandler
    // Test MetricsHandler
    // Test SecurityHandler
    // Test ProfilingHandler
}

test "handler error isolation" {
    // Test handler failure handling
    // Test VM stability with failing handlers
    // Test error recovery
}

test "handler performance impact" {
    // Test performance with no handlers
    // Test performance with multiple handlers
    // Test handler overhead measurement
}

test "custom handler implementation" {
    // Test custom handler creation
    // Test handler interface compliance
    // Test dynamic handler behavior
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/handlers/handler.zig` - Core handler interface and types
- `/src/evm/handlers/handler_manager.zig` - Handler management system
- `/src/evm/handlers/builtin_handlers.zig` - Built-in handler implementations
- `/src/evm/handlers/context_types.zig` - Handler context definitions
- `/src/evm/vm.zig` - VM integration with handlers
- `/src/evm/execution/` - Add handler hooks to operations
- `/src/evm/state/` - Add state change notifications
- `/test/evm/handlers/handler_architecture_test.zig` - Comprehensive tests

## Success Criteria

1. **Pluggable Architecture**: Easy to add and remove handlers without VM changes
2. **Comprehensive Hooks**: Cover all major execution events and phases
3. **Action Control**: Handlers can influence execution flow appropriately
4. **Error Isolation**: Handler failures don't affect VM stability
5. **Performance**: Zero overhead when no handlers are registered
6. **Extensibility**: Easy to create custom handlers for specific needs

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Zero overhead principle** - No performance impact when handlers are disabled
3. **Error isolation** - Handler failures must not crash VM execution
4. **Type safety** - Compile-time checked handler interfaces
5. **Memory safety** - Proper lifetime management of handler data
6. **Backward compatibility** - Existing VM code should work without handlers

## References

- [Middleware Pattern](https://en.wikipedia.org/wiki/Middleware) - Design pattern inspiration
- [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern) - Event notification pattern
- [Chain of Responsibility](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern) - Handler chaining
- [Plugin Architecture](https://en.wikipedia.org/wiki/Plug-in_(computing)) - Extensibility patterns
- [REVM Inspector](https://github.com/bluealloy/revm/tree/main/crates/revm/src/inspector) - Reference implementation

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/include/evmone/tracing.hpp">
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
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2021 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "tracing.hpp"
#include "execution_state.hpp"
#include "instructions_traits.hpp"
#include <evmc/hex.hpp>
#include <stack>

namespace evmone
{
namespace
{
std::string get_name(uint8_t opcode)
{
    // TODO: Create constexpr tables of names (maybe even per revision).
    const auto name = instr::traits[opcode].name;
    return (name != nullptr) ? name : "0x" + evmc::hex(opcode);
}

/// @see create_histogram_tracer()
class HistogramTracer : public Tracer
{
    struct Context
    {
        const int32_t depth;
        const uint8_t* const code;
        uint32_t counts[256]{};

        Context(int32_t _depth, const uint8_t* _code) noexcept : depth{_depth}, code{_code} {}
    };

    std::stack<Context> m_contexts;
    std::ostream& m_out;

    void on_execution_start(
        evmc_revision /*rev*/, const evmc_message& msg, bytes_view code) noexcept override
    {
        m_contexts.emplace(msg.depth, code.data());
    }

    void on_instruction_start(uint32_t pc, const intx::uint256* /*stack_top*/, int /*stack_height*/,
        int64_t /*gas*/, const ExecutionState& /*state*/) noexcept override
    {
        auto& ctx = m_contexts.top();
        ++ctx.counts[ctx.code[pc]];
    }

    void on_execution_end(const evmc_result& /*result*/) noexcept override
    {
        const auto& ctx = m_contexts.top();

        m_out << "--- # HISTOGRAM depth=" << ctx.depth << "\nopcode,count\n";
        for (size_t i = 0; i < std::size(ctx.counts); ++i)
        {
            if (ctx.counts[i] != 0)
                m_out << get_name(static_cast<uint8_t>(i)) << ',' << ctx.counts[i] << '\n';
        }

        m_contexts.pop();
    }

public:
    explicit HistogramTracer(std::ostream& out) noexcept : m_out{out} {}
};


class InstructionTracer : public Tracer
{
    struct Context
    {
        const int32_t depth;
        const uint8_t* const code;  ///< Reference to the code being executed.
        const int64_t start_gas;

        Context(int32_t d, const uint8_t* c, int64_t g) noexcept : depth{d}, code{c}, start_gas{g}
        {}
    };

    std::stack<Context> m_contexts;
    std::ostream& m_out;  ///< Output stream.

    void output_stack(const intx::uint256* stack_top, int stack_height)
    {
        m_out << R"(,"stack":[)";
        const auto stack_end = stack_top + 1;
        const auto stack_begin = stack_end - stack_height;
        for (auto it = stack_begin; it != stack_end; ++it)
        {
            if (it != stack_begin)
                m_out << ',';
            m_out << R"("0x)" << to_string(*it, 16) << '"';
        }
        m_out << ']';
    }

    void on_execution_start(
        evmc_revision /*rev*/, const evmc_message& msg, bytes_view code) noexcept override
    {
        m_contexts.emplace(msg.depth, code.data(), msg.gas);
    }

    void on_instruction_start(uint32_t pc, const intx::uint256* stack_top, int stack_height,
        int64_t gas, const ExecutionState& state) noexcept override
    {
        const auto& ctx = m_contexts.top();

        const auto opcode = ctx.code[pc];
        m_out << "{";
        m_out << R"("pc":)" << std::dec << pc;
        m_out << R"(,"op":)" << std::dec << int{opcode};
        m_out << R"(,"gas":"0x)" << std::hex << gas << '"';
        m_out << R"(,"gasCost":"0x)" << std::hex << instr::gas_costs[state.rev][opcode] << '"';

        // Full memory can be dumped as evmc::hex({state.memory.data(), state.memory.size()}),
        // but this should not be done by default. Adding --tracing=+memory option would be nice.
        m_out << R"(,"memSize":)" << std::dec << state.memory.size();

        output_stack(stack_top, stack_height);
        if (!state.return_data.empty())
            m_out << R"(,"returnData":"0x)" << evmc::hex(state.return_data) << '"';
        m_out << R"(,"depth":)" << std::dec << (ctx.depth + 1);
        m_out << R"(,"refund":)" << std::dec << state.gas_refund;
        m_out << R"(,"opName":")" << get_name(opcode) << '"';

        m_out << "}\n";
    }

    void on_execution_end(const evmc_result& /*result*/) noexcept override { m_contexts.pop(); }

public:
    explicit InstructionTracer(std::ostream& out) noexcept : m_out{out}
    {
        m_out << std::dec;  // Set number formatting to dec, JSON does not support other forms.
    }
};
}  // namespace

std::unique_ptr<Tracer> create_histogram_tracer(std::ostream& out)
{
    return std::make_unique<HistogramTracer>(out);
}

std::unique_ptr<Tracer> create_instruction_tracer(std::ostream& out)
{
    return std::make_unique<InstructionTracer>(out);
}
}  // namespace evmone
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
#include <exception>
#include <memory>
#include <string>
#include <vector>

namespace evmone
{
namespace advanced
{
struct AdvancedCodeAnalysis;
}
namespace baseline
{
class CodeAnalysis;
}

using evmc::bytes;
using evmc::bytes_view;
using intx::uint256;


/// Provides memory for EVM stack.
class StackSpace
{
    static uint256* allocate() noexcept
    {
        static constexpr auto alignment = sizeof(uint256);
        static constexpr auto size = limit * sizeof(uint256);
#ifdef _MSC_VER
        // MSVC doesn't support aligned_alloc() but _aligned_malloc() can be used instead.
        const auto p = _aligned_malloc(size, alignment);
#else
        const auto p = std::aligned_alloc(alignment, size);
#endif
        return static_cast<uint256*>(p);
    }

    struct Deleter
    {
        // TODO(C++23): static
        void operator()(void* p) noexcept
        {
#ifdef _MSC_VER
            // For MSVC the _aligned_malloc() must be paired with _aligned_free().
            _aligned_free(p);
#else
            std::free(p);
#endif
        }
    };

    /// The storage allocated for maximum possible number of items.
    /// Items are aligned to 256 bits for better packing in cache lines.
    std::unique_ptr<uint256, Deleter> m_stack_space;

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
    // ... (implementation details not relevant for the handler context)
public:
    /// The size of allocation "page".
    static constexpr size_t page_size = 4 * 1024;

    uint8_t& operator[](size_t index) noexcept;
    [[nodiscard]] const uint8_t* data() const noexcept;
    [[nodiscard]] size_t size() const noexcept;
    void grow(size_t new_size) noexcept;
    void clear() noexcept;
};


/// Generic execution state for generic instructions implementations.
// NOLINTNEXTLINE(clang-analyzer-optin.performance.Padding)
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
    /// For legacy code this is a reference to entire original code.
    /// For EOF-formatted code this is a reference to entire container.
    bytes_view original_code;

    evmc_status_code status = EVMC_SUCCESS;
    size_t output_offset = 0;
    size_t output_size = 0;

    /// Container to be deployed returned from RETURNCODE, used only inside EOFCREATE execution.
    std::optional<bytes> deploy_container;

private:
    evmc_tx_context m_tx = {};
    std::optional<std::unordered_map<evmc::bytes32, TransactionInitcode>> m_initcodes;

public:
    /// Pointer to code analysis.
    /// This should be set and used internally by execute() function of a particular interpreter.
    union
    {
        const baseline::CodeAnalysis* baseline = nullptr;
        const advanced::AdvancedCodeAnalysis* advanced;
    } analysis{};

    std::vector<const uint8_t*> call_stack;

    /// Stack space allocation.
    ///
    /// This is the last field to make other fields' offsets of reasonable values.
    StackSpace stack_space;

    // ... (constructors and reset methods) ...

    [[nodiscard]] bool in_static_mode() const { return (msg->flags & EVMC_STATIC) != 0; }

    const evmc_tx_context& get_tx_context() noexcept;
    
    // ...
};
}  // namespace evmone
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

        default:
            state.status = EVMC_UNDEFINED_INSTRUCTION;
            return gas;
        }
    }
    intx::unreachable();
}

// ... (cgoto dispatch implementation)
}  // namespace

evmc_result execute(VM& vm, const evmc_host_interface& host, evmc_host_context* ctx,
    evmc_revision rev, const evmc_message& msg, const CodeAnalysis& analysis) noexcept
{
    const auto code = analysis.executable_code();
    const auto code_begin = code.data();
    auto gas = msg.gas;

    auto& state = vm.get_execution_state(static_cast<size_t>(msg.depth));
    state.reset(msg, rev, host, ctx, analysis.raw_code());

    state.analysis.baseline = &analysis;  // Assign code analysis for instruction implementations.

    const auto& cost_table = get_baseline_cost_table(state.rev, analysis.eof_header().version);

    auto* tracer = vm.get_tracer();
    if (INTX_UNLIKELY(tracer != nullptr))
    {
        tracer->notify_execution_start(state.rev, *state.msg, code);
        gas = dispatch<true>(cost_table, state, gas, code_begin, tracer);
    }
    else
    {
#if EVMONE_CGOTO_SUPPORTED
        if (vm.cgoto)
            gas = dispatch_cgoto(cost_table, state, gas, code_begin);
        else
#endif
            gas = dispatch<false>(cost_table, state, gas, code_begin);
    }

    const auto gas_left = (state.status == EVMC_SUCCESS || state.status == EVMC_REVERT) ? gas : 0;
    const auto gas_refund = (state.status == EVMC_SUCCESS) ? state.gas_refund : 0;

    assert(state.output_size != 0 || state.output_offset == 0);
    const auto result =
        (state.deploy_container.has_value() ?
                evmc::make_result(state.status, gas_left, gas_refund,
                    state.deploy_container->data(), state.deploy_container->size()) :
                evmc::make_result(state.status, gas_left, gas_refund,
                    state.output_size != 0 ? &state.memory[state.output_offset] : nullptr,
                    state.output_size));

    if (INTX_UNLIKELY(tracer != nullptr))
        tracer->notify_execution_end(result);

    return result;
}

// ...

}  // namespace evmone::baseline
```
</file>
</evmone>



## REVM Context

An excellent and well-structured prompt. The request for a configurable handler architecture mirrors `revm`'s `Inspector` trait, which is a powerful feature for tracing and extending EVM behavior.

Here are the most relevant code snippets from the `revm` codebase to guide the implementation.

<revm>
<file path="httpshttps://github.com/bluealloy/revm/blob/main/crates/inspector/src/inspector.rs">
```rust
//! Inspector trait definition.

use crate::{
    interpreter::{
        opcode, CallInputs, CallOutcome, CreateInputs, CreateOutcome, EOFCreateInputs, Gas,
        InstructionResult, Interpreter, InterpreterTypes,
    },
    primitives::{Address, Log, U256},
    JournalExt,
};
use auto_impl::auto_impl;
use context_interface::ContextTr;

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
    // If `interp.instruction_result` is set to anything other than [`interpreter::InstructionResult::Continue`]
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
//! This module contains the `InspectorHandler` that is used to inspect the EVM.
//!
//! It contains the logic for running the interpreter with an inspector.

use crate::{Inspector, InspectorEvmTr, InspectorFrame, JournalExt};
// ... imports ...
use interpreter::{
    instructions::InstructionTable,
    interpreter_types::{Jumps, LoopControl},
    FrameInput, Host, InitialAndFloorGas, InstructionContext, InstructionResult, Interpreter,
    InterpreterAction, InterpreterTypes,
};
// ... imports ...

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

    let next_action = interpreter.take_next_action();

    // handle selfdestruct
    if let InterpreterAction::Return { result } = &next_action {
        if result.result == InstructionResult::SelfDestruct {
            match context.journal().journal().last() {
                Some(JournalEntry::AccountDestroyed {
                    address,
                    target,
                    had_balance,
                    ..
                }) => {
                    inspector.selfdestruct(*address, *target, *had_balance);
                }
                Some(JournalEntry::BalanceTransfer {
                    from, to, balance, ..
                }) => {
                    inspector.selfdestruct(*from, *to, *balance);
                }
                _ => {}
            }
        }
    }

    next_action
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs">
```rust
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

// ... implementation ...

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
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_action/call_inputs.rs">
```rust
//! Inputs for a call.

use context_interface::{ContextTr, LocalContextTr};
use core::ops::Range;
use primitives::{Address, Bytes, U256};

// ... CallInput implementation ...

/// Inputs for a call.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CallInputs {
    /// The call data of the call.
    pub input: CallInput,
    /// The return memory offset where the output of the call is written.
    ///
    /// In EOF, this range is invalid as EOF calls do not write output to memory.
    pub return_memory_offset: Range<usize>,
    /// The gas limit of the call.
    pub gas_limit: u64,
    /// The account address of bytecode that is going to be executed.
    ///
    /// Previously `context.code_address`.
    pub bytecode_address: Address,
    /// Target address, this account storage is going to be modified.
    ///
    /// Previously `context.address`.
    pub target_address: Address,
    /// This caller is invoking the call.
    ///
    /// Previously `context.caller`.
    pub caller: Address,
    /// Call value.
    ///
    /// **Note**: This value may not necessarily be transferred from caller to callee, see [`CallValue`].
    ///
    /// Previously `transfer.value` or `context.apparent_value`.
    pub value: CallValue,
    /// The call scheme.
    ///
    /// Previously `context.scheme`.
    pub scheme: CallScheme,
    /// Whether the call is a static call, or is initiated inside a static call.
    pub is_static: bool,
    /// Whether the call is initiated from EOF bytecode.
    pub is_eof: bool,
}

// ... CallScheme and CallValue enums ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_action/create_inputs.rs">
```rust
//! Inputs for a create call.

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
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_action/call_outcome.rs">
```rust
//! Call outcome.

use crate::{Gas, InstructionResult, InterpreterResult};
use core::ops::Range;
use primitives::Bytes;

/// Represents the outcome of a call operation in a virtual machine.
///
/// This struct encapsulates the result of executing an instruction by an interpreter, including
/// the result itself, gas usage information, and the memory offset where output data is stored.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CallOutcome {
    pub result: InterpreterResult,
    pub memory_offset: Range<usize>,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_action/create_outcome.rs">
```rust
//! Create outcome.

use crate::{Gas, InstructionResult, InterpreterResult};
use primitives::{Address, Bytes};

/// Represents the outcome of a create operation in an interpreter.
///
/// This struct holds the result of the operation along with an optional address.
#[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CreateOutcome {
    /// The result of the interpreter operation
    pub result: InterpreterResult,
    /// An optional address associated with the create operation
    pub address: Option<Address>,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instruction_result.rs">
```rust
//! Instruction result.

use context_interface::{
    journaled_state::TransferError,
    result::{HaltReason, OutOfGasError, SuccessReason},
};
// ... imports ...

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
    // ... other revert reasons ...

    // Action Codes
    /// Indicates a call or contract creation.
    CallOrCreate = 0x20,

    // Error Codes
    /// Out of gas error.
    OutOfGas = 0x50,
    // ... other error reasons ...
}

// ... implementation ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/handler/src/handler.rs">
```rust
// ... imports ...

/// The main implementation of Ethereum Mainnet transaction execution.
///
/// The handler logic consists of four phases:
///   * Validation - Validates tx/block/config fields and loads caller account and validates initial gas requirements and
///     balance checks.
///   * Pre-execution - Loads and warms accounts, deducts initial gas
///   * Execution - Executes the main frame loop, delegating to [`Frame`] for sub-calls
///   * Post-execution - Calculates final refunds, validates gas floor, reimburses caller,
///     and rewards beneficiary
pub trait Handler {
    /// The EVM type containing Context, Instruction, and Precompiles implementations.
    type Evm: EvmTr<Context: ContextTr<Journal: JournalTr<State = EvmState>>>;
    // ... other types ...

    /// The main entry point for transaction execution.
    #[inline]
    fn run(
        &mut self,
        evm: &mut Self::Evm,
    ) -> Result<ExecutionResult<Self::HaltReason>, Self::Error> {
        // Run inner handler and catch all errors to handle cleanup.
        match self.run_without_catch_error(evm) {
            Ok(output) => Ok(output),
            Err(e) => self.catch_error(evm, e),
        }
    }

    /// Called by [`Handler::run`] to execute the core handler logic.
    #[inline]
    fn run_without_catch_error(
        &mut self,
        evm: &mut Self::Evm,
    ) -> Result<ExecutionResult<Self::HaltReason>, Self::Error> {
        let init_and_floor_gas = self.validate(evm)?;
        let eip7702_refund = self.pre_execution(evm)? as i64;
        let mut exec_result = self.execution(evm, &init_and_floor_gas)?;
        self.post_execution(evm, &mut exec_result, init_and_floor_gas, eip7702_refund)?;

        // Prepare the output
        self.execution_result(evm, exec_result)
    }

    /// Validates the execution environment and transaction parameters.
    #[inline]
    fn validate(&self, evm: &mut Self::Evm) -> Result<InitialAndFloorGas, Self::Error> {
        self.validate_env(evm)?;
        self.validate_initial_tx_gas(evm)
    }

    /// Prepares the EVM state for execution.
    #[inline]
    fn pre_execution(&self, evm: &mut Self::Evm) -> Result<u64, Self::Error> {
        self.validate_against_state_and_deduct_caller(evm)?;
        self.load_accounts(evm)?;
        self.apply_eip7873_eof_initcodes(evm)?;
        let gas = self.apply_eip7702_auth_list(evm)?;
        Ok(gas)
    }

    /// Creates and executes the initial frame, then processes the execution loop.
    #[inline]
    fn execution(
        &mut self,
        evm: &mut Self::Evm,
        init_and_floor_gas: &InitialAndFloorGas,
    ) -> Result<FrameResult, Self::Error> {
        let gas_limit = evm.ctx().tx().gas_limit() - init_and_floor_gas.initial_gas;

        let first_frame_input = self.first_frame_input(evm, gas_limit)?;
        let first_frame = self.first_frame_init(evm, first_frame_input)?;
        let mut frame_result = match first_frame {
            ItemOrResult::Item(frame) => self.run_exec_loop(evm, frame)?,
            ItemOrResult::Result(result) => result,
        };

        self.last_frame_result(evm, &mut frame_result)?;
        Ok(frame_result)
    }

    /// Handles the final steps of transaction execution.
    #[inline]
    fn post_execution(
        &self,
        evm: &mut Self::Evm,
        exec_result: &mut <Self::Frame as Frame>::FrameResult,
        init_and_floor_gas: InitialAndFloorGas,
        eip7702_gas_refund: i64,
    ) -> Result<(), Self::Error> {
        self.refund(evm, exec_result, eip7702_gas_refund);
        self.eip7623_check_gas_floor(evm, exec_result, init_and_floor_gas);
        self.reimburse_caller(evm, exec_result)?;
        self.reward_beneficiary(evm, exec_result)?;
        Ok(())
    }
    // ... other methods ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/journal/entry.rs">
```rust
//! Contains the journal entry trait and implementations.

use primitives::{Address, StorageKey, StorageValue, U256};
use state::{EvmState, TransientStorage};

// ... JournalEntryTr trait ...

/// Journal entries that are used to track changes to the state and are used to revert it.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum JournalEntry {
    /// Used to mark account that is warm inside EVM in regard to EIP-2929 AccessList.
    AccountWarmed { address: Address },
    /// Mark account to be destroyed and journal balance to be reverted
    AccountDestroyed {
        had_balance: U256,
        address: Address,
        target: Address,
        was_destroyed: bool,
    },
    /// Only when account is called (to execute contract or transfer balance) only then account is made touched.
    AccountTouched { address: Address },
    /// Balance changed
    BalanceChange { old_balance: U256, address: Address },
    /// Transfer balance between two accounts
    BalanceTransfer {
        balance: U256,
        from: Address,
        to: Address,
    },
    /// Increment nonce
    NonceChange { address: Address },
    /// Create account:
    AccountCreated { address: Address },
    /// Entry used to track storage changes
    StorageChanged {
        key: StorageKey,
        had_value: StorageValue,
        address: Address,
    },
    /// Entry used to track storage warming introduced by EIP-2929.
    StorageWarmed { key: StorageKey, address: Address },
    /// It is used to track an EIP-1153 transient storage change.
    TransientStorageChange {
        key: StorageKey,
        had_value: StorageValue,
        address: Address,
    },
    /// Code changed
    CodeChange { address: Address },
}
```
</file>
</revm>

## Prompt Corrections

Your prompt is very well-defined and closely mirrors the `revm` `Inspector` architecture. The provided Zig code is a solid foundation. Here are a few minor corrections and suggestions based on `revm`'s implementation:

1.  **Context Object Granularity**: In `revm`, the `Interpreter` object itself is often passed to hooks (`step`, `step_end`). It contains the stack, memory, program counter, gas, etc. The `Host` trait provides access to the database and block/tx context. Your approach of creating specific context structs (`OpcodeContext`, `ExecutionContext`) is also excellent and might be cleaner. The key is to ensure all necessary data is available. The `Interpreter` from `revm` is a good reference for what to include.

2.  **`HandlerAction` Return Types**:
    *   In `revm`, pre-execution hooks like `call` and `create` can return a `Some(CallOutcome)` or `Some(CreateOutcome)`. This allows the inspector to completely override the execution and provide a custom result, which is more powerful than just `Skip` or `Halt`. You might consider allowing your `pre_` hooks to return an optional `*<ResultType>` to achieve similar functionality.
    *   The `post_` hooks in `revm` directly mutate the `&mut CallOutcome` or `&mut CreateOutcome`. This is a good pattern as it allows modification of the return data, gas, and status. Your prompt correctly uses pointers for this (`result: *ExecutionResult`).

3.  **Error Handling**: The prompt mentions "error isolation" and logs handler errors. This is a good approach. In `revm`, `Inspector` methods don't return `Result`s; instead, they might modify the `InterpreterResult` to signal an error. Your design of having handler hooks return `anyerror!T` and catching the error in the `HandlerManager` is robust and isolates handler logic effectively.

4.  **State Change Hooks**: The `on_state_change` hook is a great idea. In `revm`, this is achieved by observing the `JournalEntry` enum, which tracks every state change (balance, nonce, storage, etc.). Providing a `StateChange` struct as you have done is a clean abstraction over this. I've included `revm`'s `JournalEntry` enum for reference as it's a comprehensive list of all possible state changes that can be tracked.



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/__init__.py">
```python
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
class TransactionEnvironment:
    """
    Items that are used by contract creation or message call.
    """

    origin: Address
    gas_price: Uint
    gas: Uint
    access_list_addresses: Set[Address]
    access_list_storage_keys: Set[Tuple[Address, Bytes32]]
    index_in_block: Optional[Uint]
    tx_hash: Optional[Hash32]
    traces: List[dict]


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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
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
    # ... (initialization)

    if message.target == Bytes0(b""):
        # ... contract creation logic
        evm = process_create_message(message)
    else:
        evm = process_message(message)
        # ...

    if evm.error:
        # ... error handling
    else:
        # ... success handling

    tx_end = TransactionEnd(
        int(message.gas) - int(evm.gas_left), evm.output, evm.error
    )
    evm_trace(evm, tx_end)

    return MessageCallOutput(
        gas_left=evm.gas_left,
        # ...
    )


def process_message(message: Message) -> Evm:
    # ...
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


def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
    ...
    """
    # ... (EVM initialization) ...

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
    ...
    """


@dataclass
class PrecompileStart:
    """
    Trace event that is triggered before executing a precompile.
    """

    address: Bytes
    """
    Precompile that is about to be executed.
    """


@dataclass
class PrecompileEnd:
    """
    Trace event that is triggered after executing a precompile.
    """


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
class OpEnd:
    """
    Trace event that is triggered after executing an opcode.
    """


@dataclass
class OpException:
    """
    Trace event that is triggered when an opcode raises an exception.
    """

    error: Exception
    """
    Exception that was raised.
    ...
    """


@dataclass
class EvmStop:
    """
    Trace event that is triggered when the EVM stops.
    """

    op: enum.Enum
    """
    Last opcode executed.
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

# ...

_evm_trace: EvmTracer = discard_evm_trace
"""
Active [`EvmTracer`] that is used for generating traces.

[`EvmTracer`]: ref:ethereum.trace.EvmTracer
"""


def set_evm_trace(tracer: EvmTracer) -> EvmTracer:
    """
    Change the active [`EvmTracer`] that is used for generating traces.

    [`EvmTracer`]: ref:ethereum.trace.EvmTracer
    """
    global _evm_trace
    old = _evm_trace
    _evm_trace = tracer
    return old


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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/system.py">
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

## Prompt Corrections
The provided prompt outlines a robust and extensible handler architecture that is more aligned with interceptor/middleware patterns seen in clients like `revm` and `geth` than the simpler observer pattern found in `execution-specs`. The `execution-specs` codebase provides an excellent reference for defining the *events* and the *context* available at each hook, but it does not support modifying execution flow.

### Key Differences and Recommendations:

1.  **Execution Control (`HandlerAction`)**: The `execution-specs` `trace` module is purely for observation. It cannot alter the flow of execution (e.g., `Skip`, `Halt`, `Modify`). The proposed `HandlerAction` enum is a significant enhancement that turns the observer into a more powerful interceptor. The implementation of this control flow will need to be carefully integrated into the VM's main loop (`execute_opcode_with_handlers` in the prompt) and call sites.

2.  **Context Objects**:
    *   The prompt correctly identifies the need for structured context objects (`ExecutionContext`, `CallContext`, etc.). This is a good design choice that improves upon the `execution-specs` approach where the entire `Evm` object is passed to the tracer.
    *   The `Evm` and `Message` dataclasses from `src/ethereum/london/vm/__init__.py` are the best reference for what data is available to populate these new context structs. For example, `ExecutionContext` can be built from `evm.message` and its nested `block_env` and `tx_env` objects.

3.  **Hook Placement**:
    *   The `execute_code` function in `src/ethereum/london/vm/interpreter.py` is the ideal reference for placing opcode-level hooks (`pre_opcode`, `post_opcode`, `on_error`).
    *   The `process_message_call` function is the right place to hook `post_execute`.
    *   The `pre_execute` hook can be triggered at the start of `process_message_call`.
    *   `pre_call` and `pre_create` hooks should be placed within the respective system opcodes (`CALL`, `CREATE`, etc.) in `src/ethereum/london/vm/instructions/system.py` before the `generic_call` or `generic_create` functions are invoked.

4.  **Error Handling**: The prompt specifies that handler errors should not crash the VM. The `execution-specs` tracer has no error handling as it's assumed to be infallible for the purpose of the spec. The proposed implementation of catching errors within the `HandlerManager` is a crucial real-world requirement and a good design.

In summary, the prompt describes a superior architecture to what's in `execution-specs`. The provided `execution-specs` snippets are valuable for:
-   Defining the **data and context** available at each execution step.
-   Identifying the precise **locations within the VM's execution flow** to insert the handler hooks.
-   Modeling the types of **events** (`OpStart`, `TransactionEnd`, etc.) that the handlers should listen for.

---

An excellent and detailed prompt. The proposed handler architecture is very similar to the "Inspector" or "Tracer" patterns found in other high-performance EVM implementations. The execution-specs provide a clear, high-level model that will be very helpful for this task.

Here are the most relevant code snippets from the `execution-specs` codebase that will help in implementing the handler architecture.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/__init__.py">
```python
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
    prev_randao: Bytes32
    excess_blob_gas: U64
    parent_beacon_block_root: Root


@dataclass
class TransactionEnvironment:
    """
    Items that are used by contract creation or message call.
    """

    origin: Address
    gas_price: Uint
    gas: Uint
    access_list_addresses: Set[Address]
    access_list_storage_keys: Set[Tuple[Address, Bytes32]]
    transient_storage: TransientStorage
    blob_versioned_hashes: Tuple[VersionedHash, ...]
    authorizations: Tuple[Authorization, ...]
    index_in_block: Optional[Uint]
    tx_hash: Optional[Hash32]
    traces: List[dict]


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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/fork.py">
```python
def state_transition(chain: BlockChain, block: Block) -> None:
    # ...
    # This is the entry point for processing a block.
    # `pre_initialize` and `post_finalize` hooks could be placed here.
    # ...
    block_env = vm.BlockEnvironment(
        chain_id=chain.chain_id,
        state=chain.state,
        # ... other fields
    )

    block_output = apply_body(
        block_env=block_env,
        transactions=block.transactions,
        withdrawals=block.withdrawals,
    )
    # ...


def apply_body(
    block_env: vm.BlockEnvironment,
    transactions: Tuple[Union[LegacyTransaction, Bytes], ...],
    withdrawals: Tuple[Withdrawal, ...],
) -> vm.BlockOutput:
    # ...
    # This function processes all transactions in a block.
    for i, tx in enumerate(map(decode_transaction, transactions)):
        process_transaction(block_env, block_output, tx, Uint(i))
    # ...


def process_transaction(
    block_env: vm.BlockEnvironment,
    block_output: vm.BlockOutput,
    tx: Transaction,
    index: Uint,
) -> None:
    """
    Execute a transaction against the provided environment.
    """
    # A `pre_execute` hook would fit well here, after validation
    # and context setup.
    intrinsic_gas, calldata_floor_gas_cost = validate_transaction(tx)

    (
        sender,
        effective_gas_price,
        blob_versioned_hashes,
        tx_blob_gas_used,
    ) = check_transaction(
        block_env=block_env,
        block_output=block_output,
        tx=tx,
    )

    # ... gas deduction and nonce increment ...

    tx_env = vm.TransactionEnvironment(
        origin=sender,
        gas_price=effective_gas_price,
        gas=gas,
        # ... other fields
    )

    message = prepare_message(block_env, tx_env, tx)

    # The main execution for the transaction.
    tx_output = process_message_call(message)

    # A `post_execute` hook would fit here, with access to `tx_output`
    # which contains the result of the execution (gas used, logs, error, etc).

    # ... gas refund and fee transfer logic ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/interpreter.py">
```python
def process_message_call(message: Message) -> MessageCallOutput:
    """
    If `message.current` is empty then it creates a smart contract
    else it executes a call from the `message.caller` to the `message.target`.
    """
    # `pre_call` or `pre_create` hooks can be placed here, using `message` for context.
    # The distinction between call and create is made by checking `message.target`.
    
    # ...
    if message.target == Bytes0(b""):
        # ...
        evm = process_create_message(message)
    else:
        # ...
        evm = process_message(message)

    # `post_call` or `post_create` hooks can be placed here, using `evm` for results.
    if evm.error:
        # ...
    else:
        # ...

    return MessageCallOutput(
        gas_left=evm.gas_left,
        refund_counter=refund_counter,
        logs=logs,
        accounts_to_delete=accounts_to_delete,
        error=evm.error,
        return_data=evm.output,
    )

def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
    """
    # ... EVM object initialization ...
    evm = Evm(
        pc=Uint(0),
        stack=[],
        memory=bytearray(),
        code=code,
        # ... other fields
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            # `pre_call` for precompiles would go here.
            # ...
            return evm

        # This is the main opcode processing loop.
        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            # `pre_opcode` hook fits here, with access to `evm` (for Frame, pc, etc) and `op`.
            # A handler returning `Skip` would `continue` here.
            # A handler returning `Halt` or `Revert` would `raise` here.
            
            op_implementation[op](evm)
            
            # `post_opcode` hook fits here.

        evm_trace(evm, EvmStop(Ops.STOP))

    except ExceptionalHalt as error:
        # `on_error` hook fits here, with access to the `error`.
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        # `on_error` (specifically for reverts) fits here.
        evm_trace(evm, OpException(error))
        evm.error = error
    return evm

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/state.py">
```python
def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Start a state transaction.
    This is analogous to taking a snapshot before a call that might be reverted.
    """
    state._snapshots.append(
        (
            copy_trie(state._main_trie),
            {k: copy_trie(t) for (k, t) in state._storage_tries.items()},
        )
    )
    # ...

def rollback_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Rollback a state transaction.
    This is analogous to reverting to a snapshot.
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    # ...

def set_storage(
    state: State, address: Address, key: Bytes32, value: U256
) -> None:
    """
    Set a value at a storage key on an account.
    A hook for `on_state_change` (StorageChange) would be placed here, before
    the `trie_set` call, to capture the old and new values.
    """
    # ...
    trie_set(trie, key, value)
    # ...

def move_ether(
    state: State,
    sender_address: Address,
    recipient_address: Address,
    amount: U256,
) -> None:
    """
    Move funds between accounts.
    This is the perfect place for `on_state_change` (BalanceChange) hooks for
    both the sender and recipient.
    """
    # ...
    modify_state(state, sender_address, reduce_sender_balance)
    modify_state(state, recipient_address, increase_recipient_balance)

def increment_nonce(state: State, address: Address) -> None:
    """
    Increments the nonce of an account.
    A hook for `on_state_change` (NonceChange) would be placed here.
    """
    #...

def set_code(state: State, address: Address, code: Bytes) -> None:
    """
    Sets Account code.
    A hook for `on_state_change` (CodeChange) would be placed here.
    """
    #...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/log.py">
```python
def log_n(evm: Evm, num_topics: int) -> None:
    """
    Appends a log entry, having `num_topics` topics, to the evm logs.
    """
    # ... stack and gas logic ...
    
    # An `on_log_emit` hook would be placed right before this block.
    log_entry = Log(
        address=evm.message.current_target,
        topics=tuple(topics),
        data=memory_read_bytes(evm.memory, memory_start_index, size),
    )

    evm.logs = evm.logs + (log_entry,)

    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/exceptions.py">
```python
class ExceptionalHalt(EthereumException):
    """
    Indicates that the EVM has experienced an exceptional halt. This causes
    execution to immediately end with all gas being consumed.
    """

class Revert(EthereumException):
    """
    Raised by the `REVERT` opcode.
    """
    pass

class OutOfGasError(ExceptionalHalt):
    """
    Occurs when an operation costs more than the amount of gas left in the
    frame.
    """
    pass

class InvalidOpcode(ExceptionalHalt):
    """
    Raised when an invalid opcode is encountered.
    """
    # ...

class StackUnderflowError(ExceptionalHalt):
    """
    Occurs when a pop is executed on an empty stack.
    """
    pass

# ... and many others. These map well to the `ErrorInfo.ErrorType` enum.
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/__init__.py">
```python
class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """
    STOP = 0x00
    ADD = 0x01
    MUL = 0x02
    SUB = 0x03
    # ... all other opcodes

op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    # ... all other implementations
}
```
</file>
</execution-specs>

## Prompt Corrections

The provided prompt is very well-structured and aligns closely with modern EVM tracing and inspection APIs. There are no major errors, but here are a few notes and clarifications that might be helpful:

1.  **Context Struct Mapping**: The prompt's context structs (`HandlerContext`, `ExecutionContext`, etc.) are excellent. The provided `execution-specs` code gives a clear path to populating them:
    *   `HandlerContext` fields can be sourced from the `BlockEnvironment` and `TransactionEnvironment` dataclasses.
    *   `ExecutionContext` fields map well to the `Message` and `Evm` dataclasses.
    *   `OpcodeContext` fields are available within the `execute_code` loop in `interpreter.py`.

2.  **`HandlerAction` Control Flow**: The `execution-specs` primarily use Python exceptions for control flow (e.g., `raise Revert`, `raise OutOfGasError`). The implementation of the `HandlerAction` enum (especially `Skip`, `Halt`, `Revert`) will require adding new control flow logic to the main interpreter loop (`execute_code`). The provided snippets clearly show where this logic can be inserted. For example, a `pre_opcode` handler returning `HandlerAction.Skip` could simply `continue` the loop after advancing the PC.

3.  **Result Structs**: The prompt defines several result structs (`ExecutionResult`, `CallResult`, `CreateResult`). The specs use a more consolidated `MessageCallOutput` for call/create results. Mapping these is straightforward: `MessageCallOutput.gas_left` -> `CallResult.gas_left`, `MessageCallOutput.return_data` -> `CallResult.output`, and `MessageCallOutput.error` -> `CallResult.success`. The Zig implementation can follow the prompt's more granular design, using the data from the specs' `MessageCallOutput` as the source.

4.  **Unecessary File**: The prompt lists a file `/src/evm/handlers/context_types.zig`. To better match the proposed `handler.zig` structure, the context types could be defined directly within `handler.zig`, making the architecture more self-contained and removing the need for an extra file. This is a minor structural suggestion.

The provided specifications from `execution-specs` are an excellent reference for this task, as their high-level, clear structure makes it easy to see where the various hooks should be integrated.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/tracer.go">
```go
// Tracer is used to trace the execution of the EVM.
//
// The Capture* methods are called during execution. They are not guaranteed
// to be called in any particular order. If the EVM returns an error, CaptureEnd
// is called with that error.
type Tracer interface {
	// CaptureStart is called at the very start of the EVM execution.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	// CaptureEnd is called at the very end of the EVM execution.
	CaptureEnd(output []byte, gasUsed uint64, err error)
	// CaptureState is called before each opcode is executed.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	// CaptureFault is called when an error occurs during the execution of an opcode.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	// CaptureEnter is called when the EVM is about to enter a new sub-scope (via call, create or self-destruct).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	// CaptureExit is called when the EVM is about to exit a sub-scope.
	CaptureExit(output []byte, gasUsed uint64, err error)
	// CaptureTxStart is called when a new transaction is started. It is not called for
	// internal transactions (i.e. if one contract calls another).
	CaptureTxStart(tx *types.Transaction)
	// CaptureTxEnd is called when a transaction is ended.
	CaptureTxEnd(receipt *types.Receipt)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Config are the configuration options for the Interpreter.
type Config struct {
	// Tracer is the tracer that will be invoked during the execution of a
	// transaction in the EVM
	Tracer Tracer

	// ... other fields
}


// EVM is the Ethereum Virtual Machine base object.
type EVM struct {
	// ...
	// Config includes logging and debugging options.
	Config Config

	// ...
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// ...
}


// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and returns the address of the new
// account if everything goes well.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ...
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(CALL, caller.Address(), addr, input, gas, value)
	}

	p, err := evm.precompile(addr)
	if err == nil {
		// ... (precompile logic)
	} else {
		// ... (regular contract call logic)
	}

	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureExit(ret, gasUsed, err)
	}
	return ret, gas, err
}

// Create creates a new contract using the data passed as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ...
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(CREATE, caller.Address(), contractAddr, code, gas, value)
	}
	// ...
	ret, err = run(evm, contract, nil, false)
	// ...
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureExit(ret, gasUsed, err)
	}
	return ret, contractAddr, gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered vm specific errors and therefore should not be exposed to the
// external user.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallcontext(in.evm, contract, input, in.evm.chainRules)
		pc          = uint64(0) // program counter
		cost        uint64
		// ...
	)
	// ...

	if in.cfg.Tracer != nil {
		in.cfg.Tracer.CaptureStart(in.evm, contract.caller, contract.Address(), contract.value.Sign() != 0, input, in.evm.gas, contract.value)
	}
	defer func() {
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureEnd(ret, contract.Gas-in.evm.gas, err)
		}
	}()

	// The Interpreter main run loop. It will execute instructions until an error
	// occurs, the gas tank is empty, a STOP, RETURN or REVERT opcode is
	// encountered, or the abort channel is closed.
	for {
		// ...

		// Get the operation from the jump table and validate the stack.
		op = contract.GetOp(pc)
		operation := in.evm.opcodes[op]
		// ... (gas calculation) ...

		// If the tracer is enabled, capture the state.
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureState(pc, op, gas, cost, in.evm.scope, in.returnData, in.evm.depth, err)
		}
		// Execute the operation.
		res, err = operation.execute(&pc, in, &gas)

		// ... (handle returns and errors) ...
	}
fault:
	if err != nil {
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureFault(pc, op, gas, cost, in.evm.scope, in.evm.depth, err)
		}
	}
	// ...
	return ret, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// StructLogger is a EVM state logger and implements Tracer.
//
// It's a simple logger that prints all opcodes and their arguments, program
// counter, gas left, memory and stack. It's a useful tool for debugging contracts.
type StructLogger struct {
	cfg             Config
	logs            []StructLog
	capturing       bool
	inMessage       bool // whether the logger is capturing a new message
	callstack       []common.Address
	output          []byte // a buffer for the output of the previous call
	err             error
	storage         map[common.Hash]common.Hash
	loggedStorage   map[common.Hash]struct{}
	mu              sync.Mutex
	blockContext    *tracing.BlockContext // Block context for the tracer
	txContext       *tracing.TxContext    // Transaction context for the tracer
	memory          *vm.Memory            // a reference to the memory of the current call
	stack           *vm.Stack             // a reference to the stack of the current call
	callData        []byte                // the input of the current call
	loggedPreimages map[common.Hash]struct{}
	preimages       map[common.Hash][]byte
}

// StructLog is a structured log message used by the logger.
type StructLog struct {
	Pc            uint64             `json:"pc"`
	Op            vm.OpCode          `json:"op"`
	Gas           uint64             `json:"gas"`
	GasCost       uint64             `json:"gasCost"`
	Memory        hexutil.Bytes      `json:"memory,omitempty"`
	MemorySize    int                `json:"memSize"`
	Stack         []*uint256.Int     `json:"stack,omitempty"`
	ReturnData    hexutil.Bytes      `json:"returnData,omitempty"`
	Depth         int                `json:"depth"`
	RefundCounter uint64             `json:"refund"`
	Err           error              `json:"-"`
	OpName        string             `json:"opName"` // Added to improve readability of trace
	ErrorString   string             `json:"error,omitempty"`
	Storage       map[string]string  `json:"storage,omitempty"`
	Preimages     map[string]string  `json:"preimages,omitempty"`
	CallStack     []common.Address   `json:"callStack,omitempty"`
	Output        string             `json:"output,omitempty"`
	GasChange     string             `json:"gasChange,omitempty"`
	MemoryChange  string             `json:"memChange,omitempty"`
	StorageChange *StorageChangeData `json:"storageChange,omitempty"`
}

// CaptureState is called before each opcode is executed.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	// ... (implementation detail on capturing memory, stack, etc.)
}

// GetResult returns the structured logs collected during the execution.
func (l *StructLogger) GetResult() (json.RawMessage, error) {
	return json.Marshal(l.logs)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/counter.go">
```go
// GetOrRegisterCounter returns an existing Counter or constructs and registers
// a new Counter.
func GetOrRegisterCounter(name string, r Registry) *Counter {
	if r == nil {
		r = DefaultRegistry
	}
	return r.GetOrRegister(name, NewCounter).(*Counter)
}

// Counter hold an int64 value that can be incremented and decremented.
type Counter atomic.Int64

// Clear sets the counter to zero.
func (c *Counter) Clear() {
	(*atomic.Int64)(c).Store(0)
}

// Dec decrements the counter by the given amount.
func (c *Counter) Dec(i int64) {
	(*atomic.Int64)(c).Add(-i)
}

// Inc increments the counter by the given amount.
func (c *Counter) Inc(i int64) {
	(*atomic.Int64)(c).Add(i)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/meter.go">
```go
// GetOrRegisterMeter returns an existing Meter or constructs and registers a
// new Meter.
func GetOrRegisterMeter(name string, r Registry) *Meter {
	if r == nil {
		r = DefaultRegistry
	}
	return r.GetOrRegister(name, NewMeter).(*Meter)
}

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
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/metrics/timer.go">
```go
// NewTimer constructs a new Timer using an exponentially-decaying
// sample with the same reservoir size and alpha as UNIX load averages.
func NewTimer() *Timer {
	return &Timer{
		histogram: NewHistogram(NewExpDecaySample(1028, 0.015)),
		meter:     NewMeter(),
	}
}

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
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/hooks.go">
```go
// BalanceChangeReason is used to indicate the reason for a balance change, useful
// for tracing and reporting.
type BalanceChangeReason byte

//go:generate go run golang.org/x/tools/cmd/stringer -type=BalanceChangeReason -trimprefix=BalanceChange -output gen_balance_change_reason_stringer.go

const (
	BalanceChangeUnspecified BalanceChangeReason = 0

	// Issuance
	// BalanceIncreaseRewardMineUncle is a reward for mining an uncle block.
	BalanceIncreaseRewardMineUncle BalanceChangeReason = 1
	// ... (other reasons)
)

// GasChangeReason is used to indicate the reason for a gas change, useful
// for tracing and reporting.
type GasChangeReason byte

//go:generate go run golang.org/x/tools/cmd/stringer -type=GasChangeReason -trimprefix=GasChange -output gen_gas_change_reason_stringer.go

const (
	GasChangeUnspecified GasChangeReason = 0
	// ... (other reasons)
)

// NonceChangeReason is used to indicate the reason for a nonce change.
type NonceChangeReason byte

//go:generate go run golang.org/x/tools/cmd/stringer -type=NonceChangeReason -trimprefix NonceChange -output gen_nonce_change_reason_stringer.go

const (
	NonceChangeUnspecified NonceChangeReason = 0
	// ... (other reasons)
)


type Hooks struct {
	// ...
	// State events
	OnBalanceChange BalanceChangeHook
	OnNonceChange   NonceChangeHook
	OnNonceChangeV2 NonceChangeHookV2
	OnCodeChange    CodeChangeHook
	OnStorageChange StorageChangeHook
	OnLog           LogHook
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/journal.go">
```go
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
	// Create journal
	j := &journal{hooks: hooks}
	// Scope hooks need to be re-implemented.
	wrapped.OnTxEnd = j.OnTxEnd
	wrapped.OnEnter = j.OnEnter
	wrapped.OnExit = j.OnExit
	// Wrap state change hooks.
	if hooks.OnBalanceChange != nil {
		wrapped.OnBalanceChange = j.OnBalanceChange
	}
    // ...
	return &wrapped, nil
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
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt specifies a `HandlerAction` enum that includes `Continue`, `Skip`, `Halt`, `Revert`, and `Modify`. The `go-ethereum` tracer (`Tracer`) is a passive observer and does not have the ability to directly control the execution flow in this manner. It can only observe and record data. If the ability for a handler to halt or modify execution is a strict requirement, the `go-ethereum` `Tracer` model is insufficient. However, it provides an excellent reference for a passive, low-overhead observation and instrumentation system, which covers all other aspects of the prompt.

The `on_state_change` hook is also implemented differently in `go-ethereum`. Instead of a single generic hook, there are specific hooks for each type of state change (`OnBalanceChange`, `OnNonceChange`, `OnCodeChange`, `OnStorageChange`). I've included a snippet from `core/tracing/hooks.go` to demonstrate this pattern.

The prompt also includes a `SecurityHandler` and `ProfilingHandler`. While `go-ethereum` doesn't have these as built-in tracers with those exact names, the `callTracer` provides a good structural example for how to build a call-stack-aware handler, and the `metrics` package provides the building blocks for any profiling or metrics collection system. The combination of these two serves as a strong reference.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/tracer.go">
```go
// This file defines the Tracer interface, which is the direct equivalent of the
// proposed `Handler` interface. It provides hooks for capturing various EVM
// execution events.

// Tracer is the interface for EVM tracing.
//
// A Tracer has a life-cycle of a single transaction.
//
// CaptureTxStart and CaptureTxEnd are called at the start and end of a transaction.
// CaptureStart and CaptureEnd are called at the start and end of a call.
// CaptureState is called before each opcode execution.
// CaptureFault is called when an opcode execution fails.
//
// Implementations of this interface are not thread-safe and are expected to be
// used by a single transaction tracer.
type Tracer interface {
	// CaptureTxStart is called at the start of a transaction.
	CaptureTxStart(tx *types.Transaction)

	// CaptureTxEnd is called at the end of a transaction.
	CaptureTxEnd(receipt *types.Receipt)

	// CaptureStart is called at the start of a call.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *uint256.Int)

	// CaptureEnd is called at the end of a call.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureState is called before each opcode execution.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an opcode execution fails.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
}

// StructLogger is a default implementation of the Tracer interface, which is
// very similar to the `LoggingHandler` requested in the prompt. It captures
// granular details of EVM execution.

// StructLogger is a Tracer that records execution of EVM opcodes into a format
// that can be consumed by back-end tools.
//
// StructLogger is not safe for concurrent use.
type StructLogger struct {
	cfg              *Config
	storage          map[common.Hash]common.Hash
	logs             []StructLog
	err              error
	captureNextLine  bool
	captureNextStop  bool
	returned         []byte // The return data of the last call
	output           []byte
	gas              uint64
	lastOp           OpCode
	lastCaptureState time.Time
	start            time.Time
}

// NewStructLogger returns a new logger that is used for recording structured
// data of the EVM execution.
func NewStructLogger(cfg *Config) *StructLogger {
	if cfg == nil {
		cfg = &DefaultConfig
	}
	return &StructLogger{cfg: cfg, storage: make(map[common.Hash]common.Hash)}
}

// ... implementation of StructLogger methods ...

// CaptureState is invoked for each step of the EVM, excluding errors.
// This is the equivalent of the `pre_opcode` hook.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// ... (implementation details)
	stack := scope.Stack.copy()
	memory := scope.Memory.copy()

	// ...

	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Memory:     memory.data,
		MemorySize: memory.len(),
		Stack:      stack.data,
		Depth:      depth,
		Err:        err,
	}
	// ...
	l.logs = append(l.logs, log)
}

// CaptureFault is invoked when an instruction returned an error and would
// cause the EVM to abort execution.
// This is the equivalent of the `on_error` hook.
func (l *StructLogger) CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error) {
	l.gas = gas
	l.lastOp = op
	if l.err != nil {
		return
	}
	l.err = err
}

// CaptureEnter is called when the EVM is about to start a new call.
// This is the equivalent of `pre_call` or `pre_create`.
func (l *StructLogger) CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *uint256.Int) {
	// ... (implementation details)
}

// CaptureExit is called when the EVM has returned from a call.
// This is the equivalent of `post_call` or `post_create`.
func (l *StructLogger) CaptureExit(output []byte, gasUsed uint64, err error) {
	// ... (implementation details)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// This file shows how the `Tracer` is integrated into the main `EVM` struct
// and used in high-level operations like `Call` and `Create`. This corresponds
// to the request to integrate a `HandlerManager` into the `Vm` struct.

// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Tracer is the tracer that will be used to trace the execution of the EVM.
	// It is nil if tracing is disabled.
	Tracer Tracer
	// ... other fields
	StateDB StateDB
	// ... other fields
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by a single thread.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	// ...
	evm := &EVM{
		// ...
		Tracer:    vmConfig.Tracer,
		// ...
	}
	return evm
}

// Call executes the contract associated with the destination address. It is used
// for standard calls and delegate calls.
// This function shows the invocation of `pre_call` and `post_call` equivalent hooks.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ...
	if evm.Tracer != nil {
		evm.Tracer.CaptureStart(evm, caller.Address(), addr, false, input, gas, value)
		defer func() {
			evm.Tracer.CaptureEnd(ret, gas-leftOverGas, err)
		}()
	}
	// ...
	// (Actual call logic)
	// ...
	return ret, leftOverGas, err
}

// Create creates a new contract using code as deployment code.
// This function shows the invocation of `pre_create` and `post_create` equivalent hooks.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ...
	contractAddr = crypto.CreateAddress(caller.Address(), evm.StateDB.GetNonce(caller.Address()))
	if evm.Tracer != nil {
		evm.Tracer.CaptureStart(evm, caller.Address(), contractAddr, true, code, gas, value)
		defer func() {
			evm.Tracer.CaptureEnd(ret, gas-leftOverGas, err)
		}()
	}
	// ...
	// (Actual create logic)
	// ...
	return ret, contractAddr, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
```go
// This file contains the core execution loop of the EVM. It demonstrates where
// the opcode-level hooks (`pre_opcode` and `on_error`) are invoked.

// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm *EVM
	// ... other fields
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte slice, gas left and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for
// vm.ErrExecutionReverted which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newcallcontext()
		// For optimisation, we have a jump table and evm object
		opExecution func(pc *uint64, interpreter *EVMInterpreter, callContext *callCtx) ([]byte, error)
		// ...
	)
	// Don't capture any errors from the running VM. We're running step-by-step, and it's
	// the event loop's responsibility to catch errors, not the tracer's.
	if in.evm.Tracer != nil {
		in.evm.Tracer.CaptureState(0, contract.Code[0], 0, 0, callContext, nil, in.evm.depth, nil)
	}

	for {
		// Capture the state on each iteration.
		// This is the `pre_opcode` hook point.
		if in.evm.Tracer != nil {
			in.evm.Tracer.CaptureState(pc, op, gas, cost, callContext, rData, in.evm.depth, err)
		}
		// Get next execution function
		op = contract.GetOp(pc)
		opExecution = in.execFuncs[op]
		// ...

		// execute the operation
		res, err = opExecution(&pc, in, callContext)

		// ...
		// If the Tracy has a fault, that means the error needs to be returned
		// This is the `on_error` hook point.
		if err != nil {
			if in.evm.Tracer != nil {
				in.evm.Tracer.CaptureFault(pc, op, gas, cost, callContext, in.evm.depth, err)
			}
			return nil, err
		}
		// ...
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state_transition.go">
```go
// This file shows the highest level of transaction processing. It demonstrates where
// top-level `pre_execute` and `post_execute` hooks would be placed.

// ApplyMessage computes the new state by applying the given message
// against the old state within the environment.
//
// ApplyMessage returns the bytes returned by any EVM execution (if it took place),
// the gas used (which includes gas refunds) and an error if it failed. An error always
// indicates a core error meaning that the message would always fail for that particular
// state and would never be accepted within a block.
func ApplyMessage(evm *vm.EVM, msg *Message, gp *GasPool) (*ExecutionResult, error) {
	return NewStateTransition(evm, msg, gp).TransitionDb()
}

// TransitionDb will transition the state by applying the current message and
// returning the evm execution result with following fields.
func (st *stateTransition) TransitionDb() (ret *ExecutionResult, err error) {
	// ...
	if st.evm.Tracer != nil {
		// This corresponds to `pre_execute`.
		st.evm.Tracer.CaptureTxStart(st.tx)
		// The defer below corresponds to `post_execute`.
		defer func() {
			if st.evm.Tracer != nil {
				// The receipt is not fully initialised, so we can't capture it
				// all yet. The missing fields are filled in by the consensus
				// engine.
				st.evm.Tracer.CaptureTxEnd(st.receipt)
			}
		}()
	}
	// ...
	// (Actual transaction execution logic)
	// ...
	return ret, err
}
```
</file>
</go-ethereum>

## Prompt Corrections
The provided prompt outlines a "Handler" architecture that is a hybrid of two models found in different EVM implementations:

1.  **Geth's `Tracer`**: This is an *observational* model. The hooks (`CaptureState`, `CaptureEnter`, etc.) are called by the EVM, but they don't return any value that can influence or alter the EVM's execution flow. It's excellent for logging, metrics, and debugging, as it simply "watches" what the EVM is doing. The Geth snippets provided above are a perfect reference for where to place the *hooks* in your EVM.

2.  **REVM's `Inspector`**: This is an *interventional* model. The `Inspector`'s methods can return an `Action` enum (e.g., `Continue`, `Skip`, `Revert`), which tells the EVM how to proceed. This allows for powerful features like on-the-fly modification, security checks that halt execution, and custom precompile implementations.

Your prompt's `HandlerAction` enum (`Continue`, `Skip`, `Halt`, etc.) indicates a desire for an *interventional* model like REVM's.

**Recommendation:**
*   Use the **go-ethereum** code provided above as a reference for *where* to place your handler calls within the EVM lifecycle (`pre_execute`, `pre_call`, `pre_opcode`, etc.). The integration points in `state_transition.go`, `evm.go`, and `interpreter.go` are canonical examples.
*   Refer to the [**REVM `Inspector` trait**](https://github.com/bluealloy/revm/blob/main/crates/revm/src/inspector.rs) for the logic of how to handle the `HandlerAction` return values from your hooks. Geth's `Tracer` does not have this return-and-act mechanism, so the REVM code will be a better guide for implementing the `switch` statements that process the `Continue`, `Skip`, `Halt` actions.

---

An excellent and detailed prompt. The proposed handler architecture is very similar to Go-Ethereum's `vm.Tracer` (formerly `EVMLogger`) interface, which is used for tracing, debugging, and collecting execution data.

The most relevant Go-Ethereum code snippets are related to the `Tracer` interface, its integration into the `EVM` and `Interpreter`, and the `StructLogger` which is a concrete implementation that captures the kind of data you've specified in your context structs.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/interfaces.go">
```go
// Tracer is a generic interface for tracing EVM execution.
//
// A tracer has a number of methods that are called during EVM execution. These
// methods are called synchronously and are not allowed to be blocking.
//
// The execution of the EVM is done in steps. A step is a single opcode.
// The tracer is called before and after each step.
//
// The tracer is also called when the EVM enters and exits a new scope. A new
// scope is created when the EVM executes a CREATE, CREATE2, CALL, CALLCODE or
// DELEGATECALL opcode.
//
// The tracer is also called when a transaction execution starts and ends.
type Tracer interface {
	// CaptureStart is called at the very start of a transaction execution.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureEnd is called at the very end of a transaction execution.
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)

	// CaptureState is called before each opcode execution.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during opcode execution.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits a scope.
	CaptureExit(output []byte, gasUsed uint64, err error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the consensus engine.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext

	// StateDB gives access to the underlying state repository
	StateDB StateDB

	// depth is the current call stack
	depth int

	// chain rules
	chainRules params.Rules

	// chain ID
	chainID *big.Int

	// virtual machine configuration options used to run the contract.
	vmConfig Config

	// interpreter is the contract interpreter instance.
	interpreter *Interpreter

	// readOnly is a flag indicating whether state modifications are allowed
	readOnly bool
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the return data from the executed contract.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// Pass depth and readOnly mode to the interpreter.
	evm.depth++
	defer func() { evm.depth-- }()

	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.readOnly && value.Sign() > 0 {
		return nil, gas, ErrWriteProtection
	}

	// Tracer hooks.
	if evm.vmConfig.Tracer != nil {
		evm.vmConfig.Tracer.CaptureEnter(CALL, caller.Address(), addr, input, gas, value)
		defer func() {
			if err != nil {
				// In case of an error, the CaptureExit hook is not called, but the
				// CaptureEnd hook is. The Call function is not a transaction boundary
				// so we don't need to call CaptureEnd here. It is called in the
				// StateTransition.TransitionDb function.
			} else {
				evm.vmConfig.Tracer.CaptureExit(ret, leftOverGas, err)
			}
		}()
	}

	// ... [precompile handling and account existence checks] ...

	// Initialise a new contract and set the code that is to be used by the
	// interpreter. EVM rules allow for Execution of code of another contract
	// with this contracts context through DELEGATECALL and CALLCODE.
	snapshot := evm.StateDB.Snapshot()
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, codehash, code)

	// Even if the account has no code, we have to handle the value transfer.
	if len(code) == 0 {
		ret, err = nil, nil
	} else {
		ret, err = evm.interpreter.Run(contract, input, evm.readOnly)
	}

	// When the operation finishes, add the gas it used to the total gas costs and
	//
	// a. set the left over gas to the contract
	// b. set the left over gas to the evm
	leftOverGas = contract.Gas
	if err != nil {
		evm.StateDB.RevertToSnapshot(snapshot)
	}
	return ret, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/interpreter.go">
```go
// Run runs the EVM code with the given input and returns the final output and
// potential error.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = &ScopeContext{ // a context for call-specific data.
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go beyond 2^64. The YP defines the PC
		// to be uint256. Practically much less so.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for CaptureFault
		gasCopy uint64 // needed for CaptureFault
		logged  bool   // needed for CaptureFault
		res     []byte // result of the opcode execution function
	)
	contract.Input = input

	// The Interpreter main run loop. This loop will continue until execution of
	// the contract is halted or an error is returned.
	for {
		if in.cfg.Tracer != nil && !logged {
			in.cfg.Tracer.CaptureState(pc, op, contract.Gas, cost, callContext, in.returnData, in.evm.depth, err)
		}
		// ...

		// Get the operation from the jump table and validate the stack to ensure there are
		// enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		// ...

		// If the operation is valid, deduct the required gas
		cost = operation.constantGas // For tracing
		// ...

		// If the tracer hooks are installed, capture the fault.
		if err != nil {
			if in.cfg.Tracer != nil {
				if !logged {
					in.cfg.Tracer.CaptureFault(pc, op, gasCopy, cost, callContext, in.evm.depth, err)
				}
			}
			return nil, err
		}
		// ...

		// execute the operation
		res, err = operation.execute(&pc, in, callContext)
		// ...

		// op is STOP, RETURN, REVERT, INVALID...
		// In these cases, the loop will exit, and the result will be returned.
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.13.12/core/vm/logger.go">
```go
// StructLogger is a structured logger for EVM state transitions.
//
// StructLogger enables the capture of EVM state information on a per-opcode basis.
// It is used by the EVM to trace execution and can be configured to varying
// levels of verbosity.
type StructLogger struct {
	cfg Config

	storage map[common.Hash]common.Hash
	logs    []*types.Log
	err     error

	stack  []*big.Int
	memory []byte

	// output needs to be allocated once and suggested as a buffer to the EVM
	output []byte
	// last찍Data is the return data of the last call
	lastReturnData []byte

	gas          uint64
	cost         uint64
	pc           uint64
	op           OpCode
	depth        int
	refund       uint64
	rData        []byte
	callData     []byte
	contractAddr common.Address
}

// StructLog is a structured log message capturing the output of a single EVM
// instruction.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            OpCode                      `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory,omitempty"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*big.Int                  `json:"stack,omitempty"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"err,omitempty"`
	OpName        string                      `json:"opName"` // TODO: remove this redundant field
	ErrorString   string                      `json:"error,omitempty"`
}

// CaptureState captures the EVM state before the execution of an opcode.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// ... [omitted logic for capturing memory, stack, etc.]

	// Capture the contract storage if the logger is configured to do so
	var storage map[common.Hash]common.Hash
	if !l.cfg.DisableStorage {
		storage = scope.Contract.State()
	}

	// Create the log item
	log := StructLog{
		Pc:             pc,
		Op:             op,
		Gas:            gas,
		GasCost:        cost,
		Memory:         capturedMemory,
		MemorySize:     scope.Memory.Len(),
		Stack:          capturedStack,
		ReturnData:     capturedRData,
		Storage:        storage,
		Depth:          depth,
		RefundCounter:  scope.Contract.Gas, // This is the refund counter
		Err:            err,
		OpName:         op.String(), // TODO: remove this redundant field
		ErrorString:    formatError(err),
	}

	l.cfg.emitter(log)
}

// CaptureFault captures an execution error for structured logging.
func (l *StructLogger) CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error) {
	l.err = err
	if l.cfg.Debug {
		log.Warn("EVM fault", "pc", pc, "op", op, "err", err, "gas", gas, "cost", cost)
	}
}

// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
func (l *StructLogger) CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	if l.cfg.Debug {
		log.Info("EVM enter", "type", typ, "from", from, "to", to, " gas", gas, "value", value)
	}
}

// CaptureExit is called when the EVM exits a scope.
func (l *StructLogger) CaptureExit(output []byte, gasUsed uint64, err error) {
	if l.cfg.Debug {
		log.Info("EVM exit", "output", hex.EncodeToString(output), "gasUsed", gasUsed, "err", err)
	}
	l.output = output
	l.err = err
}
```
</file>

## Prompt Corrections

Your prompt is well-structured and clear. The proposed architecture is sound and aligns with best practices seen in other EVM implementations. The only minor point of feedback relates to how Geth's `Tracer` differs from your proposed `Handler`.

*   **Active vs. Passive Handlers**: Your `HandlerAction` enum (`Continue`, `Skip`, `Halt`, etc.) implies that a handler can actively modify the EVM's control flow. In Go-Ethereum, the `Tracer` interface is **passive**. Its methods have a `void` return type and cannot halt or skip execution. Their purpose is observation and data collection, not intervention. If an error occurs *within* a tracer, it's logged, but it doesn't stop the EVM.

    This is a design choice. A passive observer model guarantees that tracing/logging/metrics code cannot introduce new side effects or attack vectors into the core execution. Your proposed active model offers more power and flexibility, which may be desirable for your use case (e.g., a `SecurityHandler` that can halt on reentrancy detection). It's a valid design, but it's worth noting the difference from the Geth reference. The provided Go code will show you *where* to check the `HandlerAction` return value, even if Geth itself doesn't have a return value to check.

---

An excellent and well-defined prompt. The request for a pluggable "Handler" architecture is very similar to `go-ethereum`'s `Tracer` and `Hooks` system. The primary difference is that the requested handlers can modify execution flow, whereas geth's tracers are read-only observers. However, the hook points and context provided are conceptually identical.

The following `go-ethereum` snippets will be highly relevant for implementing this feature, particularly for understanding where to place the hooks in the EVM's execution lifecycle and what context to provide them.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/hooks.go">
```go
// Hooks can be used to install callbacks for state operations.
// It's used for tracing and debugging.
type Hooks struct {
	// OnBalanceChange is called when the balance of an account changes.
	OnBalanceChange func(addr common.Address, prev, new *big.Int, reason BalanceChangeReason)

	// OnNonceChange is called when the nonce of an account changes.
	// This hook is DEPRECATED. Please use OnNonceChangeV2 instead.
	OnNonceChange func(addr common.Address, prev, new uint64)

	// OnNonceChangeV2 is called when the nonce of an account changes.
	OnNonceChangeV2 func(addr common.Address, prev, new uint64, reason NonceChangeReason)

	// OnCodeChange is called when the code of an account changes.
	OnCodeChange func(addr common.Address, prevCodeHash common.Hash, prevCode []byte, codeHash common.Hash, code []byte)

	// OnStorageChange is called when the storage of an account changes.
	OnStorageChange func(addr common.Address, slot, prev, new common.Hash)

	// OnLog is called when a log is emitted.
	OnLog func(*types.Log)

	// OnClose is called when the tracer is closed. It can be used to release
	// resources.
	OnClose func()

	// OnBlockchainInit is called when a blockchain object is initialized.
	OnBlockchainInit func(config *params.ChainConfig)

	// OnGenesisBlock is called when a blockchain is being initialized.
	OnGenesisBlock func(*types.Block, types.GenesisAlloc)

	// OnNewBlock is called when a new block is being processed. It's called
	// before any transactions are applied.
	OnNewBlock func(block *types.Block)

	// OnSkippedBlock is called when a known block is being skipped during
	// block processing. It's called before any transactions are applied.
	OnSkippedBlock func(blockEvent BlockEvent)

	// OnTxStart is called before a transaction is executed.
	OnTxStart func(vmctx *VMContext, tx *types.Transaction, from common.Address)

	// OnTxEnd is called after a transaction has been executed. It is passed
	// the receipt. If an error occurred, the receipt may be nil.
	OnTxEnd func(receipt *types.Receipt, err error)

	// OnEnter is called when the EVM enters a new frame, either through a
	// CALL, CREATE or SELFDESTRUCT operation.
	OnEnter func(depth int, typ byte, from, to common.Address, input []byte, gas uint64, value *big.Int)

	// OnExit is called when the EVM exits a frame, either through a RETURN,
	// REVERT, SELFDESTRUCT operation or an error.
	OnExit func(depth int, output []byte, gasUsed uint64, err error, reverted bool)

	// OnOpcode is called for each opcode that is executed.
	OnOpcode func(pc uint64, op byte, gas, cost uint64, scope ScopeContext, rData []byte, depth int, err error)

	// OnFault is called when the EVM returns with an error.
	OnFault func(pc uint64, op byte, gas, cost uint64, scope ScopeContext, depth int, err error)

	// OnGasChange is called when the available gas of the EVM changes.
	OnGasChange func(old, new uint64, reason GasChangeReason)

	// OnBlockHashRead is called when the BLOCKHASH opcode is executed.
	OnBlockHashRead func(blockNumber uint64, blockHash common.Hash)

	// OnGethWork is called by geth sync service when a new mining work is received.
	OnGethWork func(block *types.Block, root common.Hash, uncles []*types.Header)

	// OnGethUnwork is called by geth sync service when a mining work is interrupted.
	OnGethUnwork func(block *types.Block)

	// OnGethSubmit is called by geth sync service when a mining work is submitting.
	OnGethSubmit func(block *types.Block)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm   *EVM
	table *JumpTable
	// ...
	readOnly   bool   // Whether to throw on stateful modifications
	returnData []byte // Last CALL's return data for subsequent reuse
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	if readOnly && !in.readOnly {
		in.readOnly = true
		defer func() { in.readOnly = false }()
	}
	// ...
	var (
		op          OpCode        // current opcode
		// ...
		pc   = uint64(0) // program counter
		cost uint64
		// ...
		res    []byte // result of the opcode execution function
		debug  = in.evm.Config.Tracer != nil
	)
	// ...
	if debug {
		defer func() { // this deferred method handles exit-with-error
			if err == nil {
				return
			}
			if !logged && in.evm.Config.Tracer.OnOpcode != nil {
				in.evm.Config.Tracer.OnOpcode(pcCopy, byte(op), gasCopy, cost, callContext, in.returnData, in.evm.depth, VMErrorFromErr(err))
			}
			if logged && in.evm.Config.Tracer.OnFault != nil {
				in.evm.Config.Tracer.OnFault(pcCopy, byte(op), gasCopy, cost, callContext, in.evm.depth, VMErrorFromErr(err))
			}
		}()
	}

	// The Interpreter main run loop
	for {
		if debug {
			// Capture pre-execution values for tracing.
			logged, pcCopy, gasCopy = false, pc, contract.Gas
		}

		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.table[op]
		cost = operation.constantGas
		// ... stack validation ...
		// ... gas consumption ...
		
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
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object
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
	
	// ...
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
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
	// ...
	// Business logic for the call
	// ...
	if isPrecompile {
		ret, gas, err = RunPrecompiledContract(p, input, gas, evm.Config.Tracer)
	} else {
		// ...
		ret, err = evm.interpreter.Run(contract, input, false)
		gas = contract.Gas
	}
	// ...
	// Error handling and state reversion
	// ...
	return ret, gas, err
}


// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller common.Address, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	contractAddr = crypto.CreateAddress(caller, evm.StateDB.GetNonce(caller))
	return evm.create(caller, code, gas, value, contractAddr, CREATE)
}

// create creates a new contract using code as deployment code.
func (evm *EVM) create(caller common.Address, code []byte, gas uint64, value *uint256.Int, address common.Address, typ OpCode) (ret []byte, createAddress common.Address, leftOverGas uint64, err error) {
	if evm.Config.Tracer != nil {
		evm.captureBegin(evm.depth, typ, caller, address, code, gas, value.ToBig())
		defer func(startGas uint64) {
			evm.captureEnd(evm.depth, startGas, leftOverGas, ret, err)
		}(gas)
	}
	// ...
	// Business logic for create
	// ...
	ret, err = evm.initNewContract(contract, address)
	// ...
	return ret, address, contract.Gas, err
}

func (evm *EVM) captureBegin(depth int, typ OpCode, from, to common.Address, input []byte, startGas uint64, value *big.Int) {
	tracer := evm.Config.Tracer
	if tracer.OnEnter != nil {
		tracer.OnEnter(depth, byte(typ), from, to, input, startGas, value)
	}
	// ...
}

func (evm *EVM) captureEnd(depth int, startGas uint64, leftOverGas uint64, ret []byte, err error) {
	tracer := evm.Config.Tracer
	// ...
	if tracer.OnExit != nil {
		tracer.OnExit(depth, ret, startGas-leftOverGas, VMErrorFromErr(err), reverted)
	}
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb_hooked.go">
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
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// PrecompiledContract is the basic interface for native Go contracts.
type PrecompiledContract interface {
	RequiredGas(input []byte) uint64  // RequiredPrice calculates the contract gas use
	Run(input []byte) ([]byte, error) // Run runs the precompiled contract
}

// RunPrecompiledContract runs and evaluates the output of a precompiled contract.
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
```
</file>
</go-ethereum>

## Prompt Corrections

The original prompt is very well-structured and detailed. There are no major corrections needed. The specified `Handler` architecture is clear and comprehensive. The reference to `REVM Inspector` is appropriate, and the `go-ethereum` `Tracer` implementation provides an excellent, battle-tested blueprint for where to place the necessary hooks within an EVM's execution flow.

**One minor clarification:**

*   **`on_state_change` Granularity**: The prompt defines a single `on_state_change` hook that receives a `StateChange` struct. This is a good design for simplicity. The `go-ethereum` reference (`statedb_hooked.go`) shows an alternative where specific hooks exist for each type of state change (`OnBalanceChange`, `OnNonceChange`, etc.). The provided geth snippets demonstrate how these specific state-mutating methods can be wrapped to emit events. The Zig implementation can adapt this pattern to emit its single, more generic `on_state_change` event from each of these specific state-modifying functions.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/tracer.go">
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

package tracing

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
)

// Tracer is the interface for EVM execution tracing.
//
// A Tracer has access to the EVM stack, memory, and contract details. It is
// called for each step of the EVM execution.
//
// Implementations of this interface are not thread-safe and are expected
// to be run within a single EVM execution.
//
// The tracer has the ability to intrusively stop the EVM execution by returning
// an error. The EVM will then abort the execution and return the error to the caller.
//
// All the Capture* methods are guaranteed to be called in the order of execution.
// For example, if a call is made, the execution order will be:
//   CaptureEnter
//   CaptureState for the first opcode of the callee
//   ...
//   CaptureExit
// If the call is a create, the execution order will be:
//   CaptureEnter
//   CaptureState for the first opcode of the initcode
//   ...
//   CaptureExit (this will be called with the deployed code)
type Tracer interface {
	// CaptureStart is called once at the very beginning of a transaction.
	CaptureStart(env *vm.EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureEnd is called once at the very end of a transaction.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureEnter is called when the EVM enters a new scope (via call, create or deploy).
	CaptureEnter(typ vm.OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits a scope, even if the scope came from
	// a create execution.
	CaptureExit(output []byte, gasUsed uint64, err error)

	// CaptureState is called for each step of the EVM execution.
	// It's not named "Step" because that would be a bit confusing with the
	// existing vm.Tracer.
	CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an opcode
	// which wasn't reported on CaptureState.
	CaptureFault(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, depth int, err error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	// Don't bother with the tracer if there's no contract code
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = new(ScopeContext)
		// For optimisation, hide the return data slices pointing to memory from
		// an inner call. Thus the sub-call's data is not copied back to the calling
		// frame, and also the gas consumption is not charged.
		returnData = new(ReturnData)

		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the defer
		gasCopy uint64 // for tracer
	)
	contract.Input = input

	// ...

	// The Interpreter main loop. This loop will continue until execution ends
	// with STOP, RETURN, SELFDESTRUCT, REVERT or an error.
	for {
		// ...
		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		// ...
		// If the operation is valid, capture the state.
		if in.evm.Config.Tracer != nil {
			in.evm.Config.Tracer.CaptureState(pc, op, gas, cost, callContext, in.returnData, in.evm.depth, err)
		}
		// Execute the operation
		res, err = operation.execute(&pc, in, callContext)
		// ...
	}
// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call runs the code of a contract in a new EVM frame.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(CALL, caller.Address(), addr, input, gas, value)
		defer func() {
			evm.Config.Tracer.CaptureExit(ret, leftOverGas, err)
		}()
	}
	// ...
	// Create a new frame for the call.
	// ...
	subevm := NewEVM(evm.Context, evm.StateDB, evm.chainConfig, newConfig)
	subevm.depth = evm.depth + 1
	subevm.readOnly = evm.readOnly

	subcontract := NewContract(caller, AccountRef(addr), value, gas)
	subcontract.SetCode(snapshot.CodeHash, snapshot.Code)

	ret, _, err = subevm.interpreter.Run(subcontract, msg.data, false)
	// ...
	return ret, subcontract.Gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ...
	contractAddr = crypto.CreateAddress(caller.Address(), evm.StateDB.GetNonce(caller.Address()))
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(CREATE, caller.Address(), contractAddr, code, gas, value)
		defer func() {
			evm.Config.Tracer.CaptureExit(ret, leftOverGas, err)
		}()
	}
	// ...
	// Create a new EVM for the execution of the CRATE contract
	newConfig := evm.Config
	if evm.Config.Tracer != nil {
		newConfig.Tracer = evm.Config.Tracer.NewTracer(txctx.TraceID)
	}

	subevm := NewEVM(evm.Context, evm.StateDB, evm.chainConfig, newConfig)
	subevm.depth = evm.depth + 1
	subevm.readOnly = evm.readOnly

	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCodeOptionalHash(&contractAddr, codeAndHash)
	// ...
	ret, _, err = subevm.interpreter.Run(contract, nil, false)
	// ...
	return ret, contractAddr, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/eth/tracers/native/call.go">
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

package native

import (
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/core/vm"
)

// callTracer is a native go tracer which tracks all state transitions, including inner calls.
type callTracer struct {
	env           *vm.EVM
	from          common.Address
	to            common.Address
	gas           uint64
	gasUsed       uint64
	input         []byte
	output        []byte
	value         *big.Int
	calls         []Call // Call stack, with the current call being the last element
	err           error
	txStart       time.Time
	precompiles   map[common.Address]vm.PrecompiledContract
	timeout       time.Duration // The timeout specified for the tracer
	interrupt     chan struct{} // The channel to signal an interrupt
	reason        error         // The reason for the interrupt
	onlyTopCall   bool          // Only trace the top-level call
	inMessageCall bool          // Whether the tracer is in a message call, it can be false during tx pre-checks
}

// ...

// CaptureEnter is called when the EVM enters a new scope (via call, create or deploy).
func (t *callTracer) CaptureEnter(typ vm.OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	if t.onlyTopCall {
		return
	}
	// Skip if the depth of call stack is already exceeding the limit.
	if len(t.calls) >= int(t.cfg.limit) {
		t.reason = errTraceLimitReached
		t.interrupt <- struct{}{}
		return
	}
	t.calls = append(t.calls, &Call{
		Type:  typ,
		From:  from,
		To:    to,
		Input: common.CopyBytes(input),
		Gas:   gas,
		Value: value,
	})
}

// CaptureExit is called when the EVM exits a scope, even if the scope came from
// a create execution.
func (t *callTracer) CaptureExit(output []byte, gasUsed uint64, err error) {
	if t.onlyTopCall {
		return
	}
	// Pop the current call frame
	call := t.calls[len(t.calls)-1]
	t.calls = t.calls[:len(t.calls)-1]

	call.GasUsed = gasUsed
	call.Output = common.CopyBytes(output)
	if err != nil {
		call.Error = err.Error()
		// Clear out any calls made by the possibly-failed call
		call.Calls = nil
	}
	// If the call stack is not empty, push the completed call into parent
	if len(t.calls) > 0 {
		parent := t.calls[len(t.calls)-1]
		parent.Calls = append(parent.Calls, *call)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/core/vm/logger.go">
```go
// ScopeContext contains the things that are per-call, such as stack and memory,
// but not transient things like pc and gas
type ScopeContext struct {
	Stack    *Stack
	Memory   *Memory
	Contract *Contract
}

// EVMLogger is an interface providing hooks for logging EVM execution.
//
// Implementations of this interface are not thread-safe and are expected
// to be run within a single EVM execution.
type EVMLogger interface {
	// CaptureStart is called when an EVM execution is started.
	CaptureStart(evm *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	// CaptureEnd is called when an EVM execution has ended.
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)
	// CaptureState is called for each step of the EVM execution.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	// CaptureFault is called when an error occurs during the execution of an opcode.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
}
```
</file>

## Prompt Corrections
The provided Zig implementation in the prompt is excellent and closely mirrors modern EVM inspector architectures like that of `revm`. However, a direct comparison to `go-ethereum` reveals some differences in philosophy and implementation that are worth noting:

1.  **Control Flow vs. Observation**: The Geth `Tracer`/`EVMLogger` interface is primarily for *observation* and does not provide a mechanism for handlers to alter the execution flow (like `Skip`, `Halt`, `Revert` in the prompt's `HandlerAction`). This is a significant design difference. The prompt's design is more powerful but also more complex to implement safely.
2.  **Hook Granularity**:
    -   The prompt specifies distinct `pre_call`/`post_call` and `pre_create`/`post_create` hooks. In Geth, this is handled by `CaptureEnter`/`CaptureExit` on a sub-EVM instance that is created for the call/create. The concept is similar, but the implementation differs.
    -   Geth does not have an explicit `post_opcode` hook that can inspect the result of an opcode. Information is captured *before* the opcode executes.
3.  **State Change Hooks**: The prompt includes an `on_state_change` hook. Geth's tracers do not have this explicit hook. Instead, they can inspect the `StateDB` within `CaptureState` (before and after, if they cache the state) to determine what has changed. The `StructLogger` is a good example of this, as it can be configured to dump storage at each step.
4.  **Handler Management**: The prompt's `HandlerManager` supports multiple, chainable handlers. Geth's `EVM` struct supports only a single `Tracer`. To achieve multiple tracing behaviors, Geth often uses a single "multiplexer" tracer that dispatches events to multiple sub-tracers.

These are not "errors" in the prompt but rather design choices. The provided Go-Ethereum snippets offer a production-proven perspective on implementing a similar, albeit more observation-focused, architecture. The Zig `Handler` can be seen as a more advanced version of Geth's `Tracer`.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/tracer.go">
```go
package vm

import (
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

// EVMLogger is an interface providing hooks for the EVM instruction cycle.
// Implementations of this interface can be used to gather execution-time
// information about EVM contracts.
//
// Note that the EVMLogger interface is not a stable API and may change at any
// time to accommodate new EVM features.
type EVMLogger interface {
	// Execution-start hook
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	// Execution-end hook
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)
	// Hooks for each opcode
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	// Hooks for transaction events
	CaptureTxStart(tx *types.Transaction)
	CaptureTxEnd(receipt *types.Receipt)
	// Hooks for enter/exit of sub-scopes (CALL/CREATE)
	CaptureEnter(typ int, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	CaptureExit(output []byte, gasUsed uint64, err error)
}

// ScopeContext contains the things that are per-call, such as stack and memory,
// but not pc and gas, which are per-step.
type ScopeContext struct {
	Memory   *Memory
	Stack    *Stack
	Contract *Contract
}

// StructLogger is an EVMLogger that captures full trace data of a transaction
// execution. The number of logs captured can be limited by number of instructions
// and by memory.
//
// StructLogger can be run in two modes:
//   - standalone mode, where it is used to instrument a single transaction
//   - node-wide mode, where it is used to instrument all transactions that
//     are being processed by the node
//
// In standalone mode, the user is expected to call Stop() when the logger is no
// longer needed. This will trigger a final garbage collection of any remaining
- // data.
// In node-wide mode, the node will do a garbage collection periodically by calling
// gc(), based on a timer. The user is not expected to call Stop() in this mode.
type StructLogger struct {
	cfg *Config

	storage Storages
	logs    []StructLog
	// ...
}

// CaptureState is called for each step of the EVM interpretation.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// ...
	// capture stack
	stack := scope.Stack.Data()
	// capture memory
	memory := scope.Memory.Data()

	// create the log item
	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		MemorySize: len(memory),
		Depth:      depth,
		Err:        err,
		Stack:      make([]*big.Int, len(stack)),
	}
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
package vm

// EVM is the Ethereum Virtual Machine base object for the required
// computation settings and executing the state transition function.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	TxContext
	StateDB StateDB

	// Deps includes the chain rules and tracer configuration
	Config

	// virtual machine configuration options used to initialise the
	// evm.
	vmConfig Config
	// Tracer is the op code logger
	Tracer EVMLogger
	// ...
}

// ...

// run runs the given contract and takes care of running precompiles.
//
// It returns the caller's gas back to the caller and returns the output if any.
func (in *interpreter) run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	for {
		// ...
		// Capture the state before the opcode execution
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureState(pc, op, gas, cost, in.scope, in.returnData, in.evm.depth, err)
		}
		// Execute the operation
		res, err = op.execute(&pc, in, contract)
		// ...
	}
}

// Call executes the contract associated with the destination address. It is up to the caller to
// decide which parameters to use, but the simplest call can be done by passing an
// address and non-nil `input`. The call returns the specified return data and the
// amount of gas remaining. If an error occurred, it will be returned and the can be
// checked using `errors.Is`.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ...
	if evm.Tracer != nil {
		evm.Tracer.CaptureStart(evm, caller.Address(), addr, false, input, gas, value)

		// The defer is responsible for capturing the final state of the execution.
		// This includes the return data, the gas used, and any error that occurred.
		defer func() {
			evm.Tracer.CaptureEnd(ret, gas-leftOverGas, 0, err)
		}()
	}
	// ...
	// Run the interpreter
	ret, err = run(evm, contract, input, readOnly)
	return ret, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
package vm

// ...

func opCall(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop gas, address, value, input offset, input size, output offset, output size
	gas, addr, value, in, inSize, ret, retSize := stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop(), stack.pop()
	to := common.BigToAddress(addr)

	// Get the arguments from the memory
	args := memory.GetPtr(in.Uint64(), inSize.Uint64())

	// Call the contract, accounting for gas costs and value transfer
	var (
		returnGas = uint64(0)
		err       error
	)
	if evm.Tracer != nil {
		evm.Tracer.CaptureEnter(int(CALL), contract.Address(), to, args, gas.Uint64(), value)
	}
	// The call method will call with the evm's own depth which is one greater than the contracts.
	// We need to decrease the depth here so that it is the same as the contracts.
	if evm.depth > 1 {
		evm.depth--
	}
	ret, returnGas, err = evm.Call(contract, to, args, gas.Uint64(), value)
	if evm.depth > 0 {
		evm.depth++
	}
	if evm.Tracer != nil {
		evm.Tracer.CaptureExit(ret, returnGas, err)
	}
	// ...
}

func opCreate(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// ...
	value, offset, size := stack.pop(), stack.pop(), stack.pop()
	initcode := memory.GetPtr(offset.Uint64(), size.Uint64())
	// ...
	var (
		ret         []byte
		addr        common.Address
		returnGas   uint64
		err         error
	)
	if evm.Tracer != nil {
		evm.Tracer.CaptureEnter(int(CREATE), contract.Address(), common.Address{}, initcode, gas, value)
	}
	ret, addr, returnGas, err = evm.Create(contract, initcode, gas, value)
	if evm.Tracer != nil {
		evm.Tracer.CaptureExit(ret, returnGas, err)
	}
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
package state

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

// journalEntry is a modification entry in the state journal.
type journalEntry interface {
	// revert undoes the changes introduced by this journal entry.
	revert(*StateDB)
	// dirtied returns the address that was modified by this journal entry.
	dirtied() *common.Address
}

// journal contains the list of state modifications applied through the current
// transaction. These are tracked to be able to revert them in case of an execution
// exception or revertal request.
type journal struct {
	entries []journalEntry         // Current changes tracked by the journal
	dirties map[common.Address]int // Dirty accounts and the number of changes
}

// ...

type (
	// Changes to the account trie.
	createObjectChange struct {
		account *common.Address
	}
	resetObjectChange struct {
		prev *stateObject
	}
	suicideChange struct {
		account     *common.Address
		prev        bool // whether account had already suicided
		prevbalance *big.Int
	}

	// Changes to individual accounts.
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
		key, prevalue common.Hash
	}
	codeChange struct {
		account            *common.Address
		prevcode, prevhash common.Hash
	}

	// Transient changes.
	addLogChange struct {
		txhash common.Hash
	}
	addPreimageChange struct {
		hash common.Hash
	}
	touchChange struct {
		account *common.Address
	}
)
```
</file>
</go-ethereum>

---

An excellent and well-specified prompt. The "Handler Architecture" you've designed is very similar to the `Tracer` (formerly `EVMLogger`) mechanism in `go-ethereum`. The code snippets below will provide a solid reference for implementing this feature, showing how `go-ethereum` defines its hooks, how they are integrated into the EVM execution loop, and how concrete tracers (handlers) are implemented.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/tracer.go">
```go
// Tracer is the interface that must be implemented by a custom EVM logger.
//
// Deprecated: Please use the new interface in go-ethereum/core/tracing.
// This interface will be removed in the future.
type Tracer = tracing.Tracer

// OpCode is a EVM opcode.
//
// Deprecated: Please use the new type in go-ethereum/core/vm.
// This type will be removed in the future.
type OpCode = vm.OpCode

// TracerConfig are the configuration options for the tracer
//
// Deprecated: Please use the new type in go-ethereum/eth/tracers/logger.
// This type will be removed in the future.
type TracerConfig = logger.Config
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/hooks.go">
```go
// This file contains the EVM hooks for tracing.
// It is used by the EVM and the RPC tracer.
// The hooks are implemented in the various tracer implementations.

package tracing

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
)

// Hooks is a container for all the callback functions that can be used to hook
// into the EVM execution.
type Hooks struct {
	// OnTxStart is called at the beginning of transaction processing.
	OnTxStart func(env *VMContext, tx *types.Transaction, from common.Address)
	// OnTxEnd is called at the end of transaction processing.
	OnTxEnd func(receipt *types.Receipt, err error)
	// OnEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	OnEnter func(depth int, typ byte, from, to common.Address, input []byte, gas uint64, value *big.Int)
	// OnExit is called when the EVM exits a scope, even if the scope didn't
	// execute any code.
	OnExit func(depth int, output []byte, gasUsed uint64, err error, reverted bool)
	// OnOpcode is called for each opcode that is executed.
	OnOpcode func(pc uint64, op byte, gas, cost uint64, scope OpContext, rData []byte, depth int, err error)
	// OnFault is called when the EVM returns with an error.
	OnFault func(pc uint64, op byte, gas, cost uint64, scope OpContext, depth int, err error)
	// OnGasChange is called when the amount of available gas changes.
	OnGasChange func(old, new uint64, reason GasChangeReason)
	// OnBlockchainInit is called at the beginning of blockchain processing.
	OnBlockchainInit func(config *params.ChainConfig)
	// OnBlockStart is called at the beginning of block processing.
	OnBlockStart func(ev BlockEvent)
	// OnBlockEnd is called at the end of block processing.
	OnBlockEnd func(err error)
	// OnSkippedBlock is called for each block that is skipped during processing.
	OnSkippedBlock func(ev BlockEvent)
	// OnGenesisBlock is called for the genesis block.
	OnGenesisBlock func(b *types.Block, alloc types.GenesisAlloc)
	// OnBalanceChange is called when the balance of an account changes.
	OnBalanceChange func(addr common.Address, prev, new *big.Int, reason BalanceChangeReason)
	// OnNonceChange is called when the nonce of an account changes.
	OnNonceChange func(addr common.Address, prev, new uint64)
	// OnCodeChange is called when the code of an account changes.
	OnCodeChange func(addr common.Address, prevCodeHash, prevCode, codeHash common.Hash, code []byte)
	// OnStorageChange is called when the storage of an account changes.
	OnStorageChange func(addr common.Address, slot, prev, new common.Hash)
	// OnLog is called when a log is emitted.
	OnLog func(log *types.Log)
	// OnBlockHashRead is called when a block hash is read.
	OnBlockHashRead func(number uint64, hash common.Hash)
	// OnClose is called when the tracer is closed.
	OnClose func()
}

// OpContext is the context in which the opcode is executed.
type OpContext interface {
	// PC returns the program counter.
	PC() uint64
	// Op returns the opcode.
	Op() vm.OpCode
	// Gas returns the available gas.
	Gas() uint64
	// Cost returns the gas cost of the opcode.
	Cost() uint64
	// Depth returns the call depth.
	Depth() int
	// Err returns the error.
	Err() error
	// Address returns the contract address.
	Address() common.Address
	// Caller returns the caller address.
	Caller() common.Address
	// CallValue returns the value of the call.
	CallValue() *uint256.Int
	// CallInput returns the input of the call.
	CallInput() []byte
	// MemoryData returns the memory data.
	MemoryData() []byte
	// StackData returns the stack data.
	StackData() []uint256.Int
	// ReturnData returns the return data.
	ReturnData() []byte
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

// NewStructLogger construct a new (non-streaming) struct logger.
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{
		storage: make(map[common.Address]Storage),
		logs:    make([]json.RawMessage, 0),
	}
	if cfg != nil {
		logger.cfg = *cfg
	}
	return logger
}

func (l *StructLogger) Hooks() *tracing.Hooks {
	return &tracing.Hooks{
		OnTxStart:           l.OnTxStart,
		OnTxEnd:             l.OnTxEnd,
		OnSystemCallStartV2: l.OnSystemCallStart,
		OnSystemCallEnd:     l.OnSystemCallEnd,
		OnExit:              l.OnExit,
		OnOpcode:            l.OnOpcode,
	}
}

// OnOpcode logs a new structured log message and pushes it out to the environment
//
// OnOpcode also tracks SLOAD/SSTORE ops to track storage change.
func (l *StructLogger) OnOpcode(pc uint64, opcode byte, gas, cost uint64, scope tracing.OpContext, rData []byte, depth int, err error) {
	// If tracing was interrupted, exit
	if l.interrupt.Load() {
		return
	}
	// Processing a system call.
	if l.skip {
		return
	}
	// ... (rest of the logic)
}

// OnExit is called a call frame finishes processing.
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

// OnTxEnd is called at the end of transaction processing.
func (l *StructLogger) OnTxEnd(receipt *types.Receipt, err error) {
	if err != nil {
		// Don't override vm error
		if l.err == nil {
			l.err = err
		}
		return
	}
	if receipt != nil {
		l.usedGas = receipt.GasUsed
	}
}

// GetResult returns the json-encoded nested list of call traces, and any
// error arising from the encoding or forceful termination (via `Stop`).
func (l *StructLogger) GetResult() (json.RawMessage, error) {
	// Tracing aborted
	if l.reason != nil {
		return nil, l.reason
	}
	failed := l.err != nil
	returnData := common.CopyBytes(l.output)
	// Return data when successful and revert reason when reverted, otherwise empty.
	if failed && !errors.Is(l.err, vm.ErrExecutionReverted) {
		returnData = []byte{}
	}
	return json.Marshal(&ExecutionResult{
		Gas:         l.usedGas,
		Failed:      failed,
		ReturnValue: returnData,
		StructLogs:  l.logs,
	})
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/native/mux.go">
```go
func init() {
	tracers.DefaultDirectory.Register("muxTracer", newMuxTracer, false)
}

// muxTracer is a go implementation of the Tracer interface which
// runs multiple tracers in one go.
type muxTracer struct {
	names   []string
	tracers []*tracers.Tracer
}

// newMuxTracer returns a new mux tracer.
func newMuxTracer(ctx *tracers.Context, cfg json.RawMessage, chainConfig *params.ChainConfig) (*tracers.Tracer, error) {
	var config map[string]json.RawMessage
	if err := json.Unmarshal(cfg, &config); err != nil {
		return nil, err
	}
	objects := make([]*tracers.Tracer, 0, len(config))
	names := make([]string, 0, len(config))
	for k, v := range config {
		t, err := tracers.DefaultDirectory.New(k, ctx, v, chainConfig)
		if err != nil {
			return nil, err
		}
		objects = append(objects, t)
		names = append(names, k)
	}

	t := &muxTracer{names: names, tracers: objects}
	return &tracers.Tracer{
		Hooks: &tracing.Hooks{
			OnTxStart:       t.OnTxStart,
			OnTxEnd:         t.OnTxEnd,
			OnEnter:         t.OnEnter,
			OnExit:          t.OnExit,
			OnOpcode:        t.OnOpcode,
			OnFault:         t.OnFault,
			// ... other hooks ...
		},
		GetResult: t.GetResult,
		Stop:      t.Stop,
	}, nil
}

func (t *muxTracer) OnOpcode(pc uint64, op byte, gas, cost uint64, scope tracing.OpContext, rData []byte, depth int, err error) {
	for _, t := range t.tracers {
		if t.OnOpcode != nil {
			t.OnOpcode(pc, op, gas, cost, scope, rData, depth, err)
		}
	}
}
// ... other hook implementations that call the corresponding hook on each tracer ...

// GetResult returns an empty json object.
func (t *muxTracer) GetResult() (json.RawMessage, error) {
	resObject := make(map[string]json.RawMessage)
	for i, tt := range t.tracers {
		r, err := tt.GetResult()
		if err != nil {
			return nil, err
		}
		resObject[t.names[i]] = r
	}
	res, err := json.Marshal(resObject)
	if err != nil {
		return nil, err
	}
	return res, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call runs the contract associated with the start gas and the given input data
// and returns the returned data on success and an error if the call failed,
// returning the remaining gas.
//
// The method is based on the consensus rules of Frontier.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.chainRules.IsEIP158 {
		evm.StateDB.Prepare(addr, caller.Address(), vm.PrecompiledAddressesBerlin)
	}
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer value in a static call
	if evm.Context.IsStatic && value.BitLen() > 0 && !value.IsZero() {
		return nil, gas, ErrWriteProtection
	}
	// ... (value transfer logic) ...

	// Initialise a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	evm.interpreter.tracer.OnEnter(evm.depth, byte(CALL), caller.Address(), addr, input, gas, value.ToBig())
	ret, err = evm.interpreter.Run(contract, input, false)
	
	// When the interpreter returns, make sure the gas is returned and the context is cleansed
	leftOverGas = contract.Gas
	evm.interpreter.tracer.OnExit(evm.depth, ret, leftOverGas, err, err != nil && err != ErrExecutionReverted)

	return ret, leftOverGas, err
}

// Create creates a new contract using the EVM.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int, address common.Address) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (depth and static call checks) ...

	// Ensure the contract address is set. The address is derived from
	// the creator and the nonce, and can also be pre-calculated.
	contractAddr = address
	
	// Create a new contract from the caller
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCode(code)

	evm.interpreter.tracer.OnEnter(evm.depth, byte(CREATE), caller.Address(), contractAddr, code, gas, value.ToBig())
	
	// ... (initcode size checks) ...

	ret, err = evm.interpreter.Run(contract, nil, true)
	
	// check whether the max code size has been exceeded
	if err == nil && len(ret) > params.MaxCodeSize {
		err = ErrMaxCodeSizeExceeded
	}
	// ... (gas cost for code storage logic) ...

	// if the contract creation ran successfully then attempt to create the contract in the state
	if err == nil {
		evm.StateDB.SetCode(contractAddr, ret)
	}

	evm.interpreter.tracer.OnExit(evm.depth, ret, leftOverGas, err, err != nil && err != ErrExecutionReverted)
	return ret, contractAddr, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and executes the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for
// ErrExecutionReverted which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (initialization) ...

	// The main loop of the EVM. It will be run until an error occurs or the
	// EVM returns a result.
	for {
		// If the tracer is enabled, capture the state of the EVM.
		if in.tracer != nil {
			in.tracer.OnOpcode(in.pc, op, in.gas, cost, in, in.returnData, in.depth, err)
		}
		// ... (opcode execution logic) ...

		switch op {
		// ... (cases for each opcode) ...

		default: // Polling for interrupts is required for gas-metered execution, so we do it here.
			if err := in.checkInterrupt(); err != nil {
				return nil, err
			}
		}
	}
}

// checkInterrupt checks for execution interruptions and returns an error if an
// interrupt is detected.
//
// This function is called once per iteration of the EVM run loop and is the
// only place where execution interruptions are checked.
func (in *EVMInterpreter) checkInterrupt() error {
	select {
	case <-in.cancel:
		return errStopToken
	case <-in.ctx.Done():
		// Check for timeout.
		if deadline, hasDeadline := in.ctx.Deadline(); hasDeadline {
			if time.Now().After(deadline) {
				return context.DeadlineExceeded
			}
		}
		// If not a timeout, just an ordinary cancellation.
		return in.ctx.Err()
	default:
		return nil
	}
}
```
</file>

## Prompt Corrections

Your prompt is very well-structured and clearly inspired by modern EVM implementations like `REVM`. Here are a few notes based on the `go-ethereum` implementation that might be helpful:

1.  **Error Handling vs. Action Control**: In your `HandlerAction` enum, you have actions like `Halt`, `Revert`, `Skip`. In `go-ethereum`, flow control is primarily managed by returning specific error types from the `Tracer` methods (e.g., `vm.ErrExecutionReverted`, or a custom error to halt execution). The EVM loop then catches these errors and acts accordingly. This is a slightly different pattern but achieves a similar goal. `REVM`'s `Inspector` is closer to your `HandlerAction` design.
2.  **Post-Opcode Hook**: `go-ethereum` does not have an explicit `post_opcode` hook. State is captured *before* each opcode executes via `OnOpcode` (your `pre_opcode`). The result of an operation (e.g., stack changes, memory writes) is visible in the context of the *next* `OnOpcode` call. The `OnFault` hook is triggered if an opcode causes an error, which can serve as a "post-opcode-on-error" hook. Your design with `post_opcode` is valid and useful, but this is a point of difference.
3.  **Handler Manager**: `go-ethereum`'s `EVM` struct holds a single `Tracer`. To use multiple tracers, they are composed into a single "mux tracer" (see `eth/tracers/native/mux.go`) which then dispatches calls to each of its children. Your `HandlerManager` design is a clean way to implement this composition directly in the VM.
4.  **State Change Hooks**: Your `on_state_change` hook is a great abstraction. In `go-ethereum`, this is implemented with more granular hooks (`OnBalanceChange`, `OnStorageChange`, etc.) which are called from within the `StateDB` implementation. The `StructLogger` in `go-ethereum` actually infers storage changes by watching for `SLOAD`/`SSTORE` opcodes, which is another valid approach.

These are just observations on implementation differences. Your proposed architecture is robust and clear. The provided Go snippets should serve as an excellent guide for where to inject the hook calls within the VM's execution flow.

---

An excellent and well-specified prompt for implementing a handler architecture. The go-ethereum `vm.Tracer` interface and its implementations provide a powerful and battle-tested reference for this task.

The `Tracer` interface is designed for observing EVM execution and is a direct parallel to the proposed `Handler` interface. Key components from `go-ethereum` are provided below to guide the implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interfaces.go">
```go
// Tracer is used to trace the execution of the EVM.
//
// The Capture* methods are called during the execution of the EVM and provide
// information about the current state of the EVM.
//
// The reason for the EVM parameter in the tracer is that the tracer is in the
// driver seat. It can interrupt the execution of the EVM by returning an error.
// The EVM parameter is used to query the current state of the EVM.
//
// Please note that the vm.EVM is not a thread-safe type. It is only safe to
// use the vm.EVM from the same goroutine that is executing the tracer.
type Tracer interface {
	// CaptureStart is called once at the beginning of the execution of a transaction.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureEnd is called once at the end of the execution of a transaction.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureState is called for each step of the VM, excluding errors.
	// It's not called when geth is configured with --nodiscardcode.
	// Note that this method is not called for CREATE, CREATE2, CALL, CALLCODE,
	// DELEGATECALL, STATICCALL, since CaptureEnter is called for those opcodes.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It's called with the program counter, the opcode, the gas, the cost of the operation
	// and the error.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits a scope (via call, create or selfdestruct).
	CaptureExit(output []byte, gasUsed uint64, err error)

	// CaptureTxStart is called when a transaction starts to be executed.
	CaptureTxStart(tx *types.Transaction)

	// CaptureTxEnd is called when a transaction has been executed.
	CaptureTxEnd(receipt *types.Receipt)
}

// ScopeContext contains the memory, stack and contract of the current scope.
type ScopeContext struct {
	Memory   *Memory
	Stack    *Stack
	Contract *Contract
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
// provided, and the code should execution should be halted.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
    // ... initial setup ...

	// Don't bother with the execution loop if there's no code.
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
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go beyond 2^64. The YP defines the PC
		// to be uint256. Practically much smaller gas limits are applied.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for tracer
		gasCopy uint64 // needed for tracer
		logged  bool   // needed for tracer
	)
    // ...
	if in.cfg.Tracer != nil {
		in.cfg.Tracer.CaptureStart(in.evm, contract.Address(), contract.Address(), false, input, contract.Gas, contract.value)
		defer func() {
			if err != nil {
				in.cfg.Tracer.CaptureEnd(ret, contract.Gas, err)
			} else {
				in.cfg.Tracer.CaptureEnd(ret, contract.Gas-gas, nil)
			}
		}()
	}

	for {
		if in.cfg.Tracer != nil {
			// Note that the gas is the amount of gas before the execution of the
			// opcode.
			gasCopy = contract.Gas
			pcCopy = pc
			logged = false
		}
		// Get the operation from the jump table and validate the stack to ensure
		// there are enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
        // ...
		
        // If the operation is valid, subtract the constant gas cost
		cost = operation.constantGas
		if err := contract.UseGas(cost); err != nil {
			if in.cfg.Tracer != nil {
				in.cfg.Tracer.CaptureFault(pc, op, gasCopy, cost, callContext, in.depth, err)
			}
			return nil, err
		}

		// ... execute opcode ...

		if in.cfg.Tracer != nil && !logged {
			in.cfg.Tracer.CaptureState(pcCopy, op, gasCopy, cost, callContext, in.readOnly, in.depth, err)
		}

		pc++
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the consensus engine.
type EVM struct {
	// Context provides information about the current transaction and block.
	Context
	// BlockChain provides access to the blockchain.
	chain BlockChain
	// StateDB gives access to the underlying state.
	StateDB StateDB

	// depth is the current call stack
	depth int

	// chain rules
	chainRules params.Rules

	// virtual machine configuration
	vmConfig Config

	// interpreter is the contract interpreter
	interpreter *Interpreter
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes

// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ...
	if evm.vmConfig.Tracer != nil {
		evm.vmConfig.Tracer.CaptureEnter(CALL, caller.Address(), addr, input, gas, value)
		defer func() {
			if err != nil {
				evm.vmConfig.Tracer.CaptureExit(ret, leftOverGas, err)
			} else {
				evm.vmConfig.Tracer.CaptureExit(ret, leftOverGas, nil)
			}
		}()
	}
	// ...
	ret, err = run(evm, contract, input, false)
	// ...
	return
}


// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ...
	contractAddr = CreateAddress(caller.Address(), evm.StateDB.GetNonce(caller.Address()))

	if evm.vmConfig.Tracer != nil {
		evm.vmConfig.Tracer.CaptureEnter(CREATE, caller.Address(), contractAddr, code, gas, value)
		defer func() {
			if err != nil {
				evm.vmConfig.Tracer.CaptureExit(ret, leftOverGas, err)
			} else {
				evm.vmConfig.Tracer.CaptureExit(ret, leftOverGas, nil)
			}
		}()
	}
	// ...
	// The new contract's code is the return value of the constructor
	ret, err = run(evm, contract, nil, false)
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// StructLogger is a Tracer that records execution states as structured objects.
type StructLogger struct {
	cfg              Config
	storage          map[common.Hash]common.Hash
	logs             []*StructLog
	err              error
	captureNextLine  bool
	captureNextFault bool
	output           []byte
	gasUsed          uint64

	mu sync.Mutex
}

// ...

// CaptureState captures the system state and the opcode being executed.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// ...
	// Capture the opcode and it's associated data
	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Memory:     memory,
		MemorySize: mem.Len(),
		Stack:      stack,
		ReturnData: returnData,
		Depth:      depth,
		Err:        err,
	}
	// When tracing is enabled, each line is captured
	if l.cfg.EnableTrace {
		l.logs = append(l.logs, &log)
		return
	}
    // ...
}

// CaptureFault captures an execution fault.
func (l *StructLogger) CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error) {
	// ...
	log := StructLog{
		Pc:      pc,
		Op:      op,
		Gas:     gas,
		GasCost: cost,
		Depth:   depth,
		Err:     err,
	}
	l.logs = append(l.logs, &log)
}

// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
func (l *StructLogger) CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	if !l.cfg.EnableTrace {
		return
	}
	l.mu.Lock()
	defer l.mu.Unlock()

	l.logs = append(l.logs, &StructLog{
		Op:    typ,
		Depth: len(l.storage) + 1,
		Gas:   gas,
		Stack: newstack(),
		Err:   ErrTraceEnter,
	})
}

// CaptureExit is called when the EVM exits a scope (via call, create or selfdestruct).
func (l *StructLogger) CaptureExit(output []byte, gasUsed uint64, err error) {
	if !l.cfg.EnableTrace {
		return
	}
	l.mu.Lock()
	defer l.mu.Unlock()

	l.logs = append(l.logs, &StructLog{
		Depth: len(l.storage),
		Err:   ErrTraceExit,
	})
	// The final trace needs to have the output and gas used.
	if len(l.storage) == 0 {
		l.output = output
		l.gasUsed = gasUsed
		l.err = err
	}
}
```
</file>
</go-ethereum>

## Prompt Corrections

The provided prompt is very well-structured. The go-ethereum codebase offers strong precedents for this kind of observability architecture. Here are a few points of comparison and suggestions based on the Geth implementation:

1.  **Handler Control Flow (`HandlerAction`)**: Your `HandlerAction` enum (`Continue`, `Skip`, `Halt`, `Revert`) proposes giving handlers direct control over the EVM's execution flow. This is a powerful feature that goes beyond Geth's `Tracer`. In Geth, a tracer is primarily an *observer*; it can halt execution by returning an error, but it cannot instruct the EVM to take other actions like skipping an opcode. This is a significant design decision:
    *   **Geth's Observer Model**: Simpler, lower risk. Ensures tracers can't introduce complex, unexpected state changes or control flow bugs.
    *   **Your Controller Model**: More powerful and flexible, enabling use cases like on-the-fly instruction replacement, security policies that prevent certain opcodes, or custom gas metering. However, it also introduces more complexity and potential for handlers to destabilize the VM if not written carefully. Your implementation of the VM's main loop will need to explicitly check the `HandlerAction` after `pre_opcode` and branch accordingly.

2.  **Handler Management (`HandlerManager`)**: Your prompt suggests a `HandlerManager` that iterates through a list of handlers. Geth's `EVM` struct holds a single `Tracer`. To support multiple tracers, Geth uses a wrapper pattern. For instance, a `MultiTracer` can be created that holds a slice of `Tracer`s and forwards calls to each one. This is a clean way to compose handlers without adding complexity to the core EVM loop. You might consider a similar pattern for your `HandlerManager`.

    *Example Geth Multi-Tracer Pattern:*
    ```go
    // MultiTracer is a wrapper for multiple tracers.
    type MultiTracer []Tracer

    func (t MultiTracer) CaptureStart(...) {
        for _, t := range t {
            t.CaptureStart(...)
        }
    }
    // ... other methods follow the same pattern
    ```

3.  **Opcode Hook Timing**: Geth's `CaptureState` hook is called *before* the opcode's constant gas is deducted and before the opcode itself is executed. This makes it a true `pre_opcode` hook. Your `OpcodeContext` correctly includes fields like `gas_cost`, which is excellent for providing handlers with the context of what *will* happen. The Geth `interpreter.go` snippet shows this exact pattern.

4.  **State Change Hooks**:
    *   **`on_log_emit`**: The Geth `Tracer` has a `CaptureLog` method. This is typically called from within the `LOG0-4` opcode implementations themselves.
    *   **`on_state_change`**: Geth has `CaptureStorageChange`, called from `SSTORE`. For other state changes (balance, nonce), these are usually captured by tracing the opcodes that cause them (e.g., `CALL` for balance changes, or by observing the stateDB directly). Your approach of a single `on_state_change` hook is a valid alternative, but it will require instrumenting every state-mutating function in your state manager to emit these events.

The provided Geth snippets should serve as a solid foundation for implementing your specified architecture, offering battle-tested patterns for observability in an EVM.

