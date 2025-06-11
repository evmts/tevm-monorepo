# Implement Handler Architecture

You are implementing Handler Architecture for the Tevm EVM written in Zig. Your goal is to implement modular handler architecture for extensibility following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_handler_architecture` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_handler_architecture feat_implement_handler_architecture`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement a modular handler architecture for opcodes that provides pluggable handler system for opcode execution.

## File Structure

**Primary Files to Modify:**
- `/src/evm/jump_table/jump_table.zig` - Opcode dispatch table
- `/src/evm/opcodes/operation.zig` - Operation definitions
- `/src/evm/vm.zig` - VM execution dispatch

**Supporting Files:**
- `/src/evm/execution/` (directory) - All execution handlers for different opcode types
- `/src/evm/frame.zig` - Execution context management

**Test Files:**
- `/test/evm/jump_table_test.zig` - Jump table tests
- `/test/evm/vm_opcode_test.zig` - Opcode execution tests

**Why These Files:**
- Jump table provides the main dispatch mechanism for routing opcodes to handlers
- Operation definitions specify the structure and behavior of each opcode
- VM execution coordinates the handler architecture
- Modular execution handlers allow pluggable opcode implementations

## ELI5

Think of the handler architecture like a restaurant's quality control system. Instead of having to modify the kitchen every time you want to add a new quality check, you set up inspection stations along the line where different specialists can examine and process each dish. Some inspectors check temperature, others check presentation, and some just count portions. Each handler can observe what's happening, make modifications, or even stop the process if something's wrong. This way, you can easily add new quality controls without rebuilding the entire kitchen.

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

#### 1. **Unit Tests** (`/test/evm/handler/handler_architecture_test.zig`)
```zig
// Test basic handler_architecture functionality
test "handler_architecture basic functionality works correctly"
test "handler_architecture handles edge cases properly"
test "handler_architecture validates inputs appropriately"
test "handler_architecture produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "handler_architecture integrates with EVM properly"
test "handler_architecture maintains system compatibility"
test "handler_architecture works with existing components"
test "handler_architecture handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "handler_architecture meets performance requirements"
test "handler_architecture optimizes resource usage"
test "handler_architecture scales appropriately with load"
test "handler_architecture benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "handler_architecture meets specification requirements"
test "handler_architecture maintains EVM compatibility"
test "handler_architecture handles hardfork transitions"
test "handler_architecture cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "handler_architecture handles errors gracefully"
test "handler_architecture proper error propagation"
test "handler_architecture recovery from failure states"
test "handler_architecture validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "handler_architecture prevents security vulnerabilities"
test "handler_architecture handles malicious inputs safely"
test "handler_architecture maintains isolation boundaries"
test "handler_architecture validates security properties"
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
test "handler_architecture basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = handler_architecture.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const handler_architecture = struct {
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

- [Middleware Pattern](https://en.wikipedia.org/wiki/Middleware) - Design pattern inspiration
- [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern) - Event notification pattern
- [Chain of Responsibility](https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern) - Handler chaining
- [Plugin Architecture](https://en.wikipedia.org/wiki/Plug-in_(computing)) - Extensibility patterns
- [REVM Inspector](https://github.com/bluealloy/revm/tree/main/crates/revm/src/inspector) - Reference implementation