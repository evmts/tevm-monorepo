# Implement Inspector Framework

You are implementing Inspector Framework for the Tevm EVM written in Zig. Your goal is to implement pluggable inspector framework for execution monitoring following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_inspector_framework` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_inspector_framework feat_implement_inspector_framework`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

## ELI5

Think of the inspector framework like having multiple security cameras and monitoring systems throughout a factory. Each inspector is like a specialized monitoring device - one tracks production speed, another monitors quality control, and others watch for safety violations. These inspectors can observe everything happening on the production line without interfering with the actual work, but they can sound alarms or trigger responses when they detect issues. This lets you add new monitoring capabilities without rewiring the entire factory.

Implement a pluggable inspector framework that allows external analyzers to hook into EVM execution for custom analysis, debugging, and monitoring. This provides a clean interface for tools like gas analyzers, security scanners, performance profilers, and debugging utilities without modifying core VM code.

## Inspector Architecture

### Core Inspector Interface

#### 1. Inspector Trait
```zig
pub const Inspector = struct {
    ptr: *anyopaque,
    vtable: *const VTable,
    
    pub const VTable = struct {
        // VM lifecycle events
        initialize: *const fn(ptr: *anyopaque, vm: *Vm) anyerror!void,
        finalize: *const fn(ptr: *anyopaque, vm: *Vm) anyerror!void,
        
        // Execution hooks
        step_start: *const fn(ptr: *anyopaque, context: *const StepContext) anyerror!InspectorAction,
        step_end: *const fn(ptr: *anyopaque, context: *const StepContext, result: ExecutionResult) anyerror!void,
        
        // Call hooks
        call_start: *const fn(ptr: *anyopaque, context: *const CallContext) anyerror!InspectorAction,
        call_end: *const fn(ptr: *anyopaque, context: *const CallContext, result: CallResult) anyerror!void,
        
        // Memory hooks
        memory_read: *const fn(ptr: *anyopaque, offset: u32, size: u32, data: []const u8) anyerror!void,
        memory_write: *const fn(ptr: *anyopaque, offset: u32, data: []const u8) anyerror!void,
        
        // Storage hooks
        storage_read: *const fn(ptr: *anyopaque, address: Address, key: U256, value: U256) anyerror!void,
        storage_write: *const fn(ptr: *anyopaque, address: Address, key: U256, old_value: U256, new_value: U256) anyerror!void,
        
        // Event hooks
        log_emitted: *const fn(ptr: *anyopaque, log: *const Log) anyerror!void,
        selfdestruct: *const fn(ptr: *anyopaque, address: Address, beneficiary: Address) anyerror!void,
        
        // Error hooks
        execution_error: *const fn(ptr: *anyopaque, error_info: *const ErrorInfo) anyerror!void,
    };
    
    pub fn init(pointer: anytype) Inspector {
        const Ptr = @TypeOf(pointer);
        const ptr_info = @typeInfo(Ptr);
        
        if (ptr_info != .Pointer) @compileError("Expected pointer");
        if (ptr_info.Pointer.size != .One) @compileError("Expected single item pointer");
        
        const alignment = ptr_info.Pointer.alignment;
        const impl = struct {
            fn initialize(ptr: *anyopaque, vm: *Vm) anyerror!void {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.initialize, .{self, vm});
            }
            
            fn finalize(ptr: *anyopaque, vm: *Vm) anyerror!void {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.finalize, .{self, vm});
            }
            
            fn step_start(ptr: *anyopaque, context: *const StepContext) anyerror!InspectorAction {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.step_start, .{self, context});
            }
            
            fn step_end(ptr: *anyopaque, context: *const StepContext, result: ExecutionResult) anyerror!void {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.step_end, .{self, context, result});
            }
            
            fn call_start(ptr: *anyopaque, context: *const CallContext) anyerror!InspectorAction {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.call_start, .{self, context});
            }
            
            fn call_end(ptr: *anyopaque, context: *const CallContext, result: CallResult) anyerror!void {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.call_end, .{self, context, result});
            }
            
            fn memory_read(ptr: *anyopaque, offset: u32, size: u32, data: []const u8) anyerror!void {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.memory_read, .{self, offset, size, data});
            }
            
            fn memory_write(ptr: *anyopaque, offset: u32, data: []const u8) anyerror!void {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.memory_write, .{self, offset, data});
            }
            
            fn storage_read(ptr: *anyopaque, address: Address, key: U256, value: U256) anyerror!void {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.storage_read, .{self, address, key, value});
            }
            
            fn storage_write(ptr: *anyopaque, address: Address, key: U256, old_value: U256, new_value: U256) anyerror!void {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.storage_write, .{self, address, key, old_value, new_value});
            }
            
            fn log_emitted(ptr: *anyopaque, log: *const Log) anyerror!void {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.log_emitted, .{self, log});
            }
            
            fn selfdestruct(ptr: *anyopaque, address: Address, beneficiary: Address) anyerror!void {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.selfdestruct, .{self, address, beneficiary});
            }
            
            fn execution_error(ptr: *anyopaque, error_info: *const ErrorInfo) anyerror!void {
                const self = @ptrCast(@alignCast(ptr), *ptr_info.Pointer.child);
                return @call(.always_inline, ptr_info.Pointer.child.execution_error, .{self, error_info});
            }
        };
        
        return Inspector{
            .ptr = pointer,
            .vtable = &VTable{
                .initialize = impl.initialize,
                .finalize = impl.finalize,
                .step_start = impl.step_start,
                .step_end = impl.step_end,
                .call_start = impl.call_start,
                .call_end = impl.call_end,
                .memory_read = impl.memory_read,
                .memory_write = impl.memory_write,
                .storage_read = impl.storage_read,
                .storage_write = impl.storage_write,
                .log_emitted = impl.log_emitted,
                .selfdestruct = impl.selfdestruct,
                .execution_error = impl.execution_error,
            },
        };
    }
};
```

#### 2. Inspector Context Types
```zig
pub const StepContext = struct {
    vm: *Vm,
    frame: *Frame,
    opcode: u8,
    pc: u32,
    gas_remaining: u64,
    gas_cost: u64,
    depth: u32,
    
    pub fn get_stack_top(self: *const StepContext, count: u32) []const U256 {
        const stack_size = self.frame.stack.size();
        const take = @min(count, stack_size);
        
        var result = self.vm.allocator.alloc(U256, take) catch return &[_]U256{};
        
        for (0..take) |i| {
            result[i] = self.frame.stack.peek_unsafe(i);
        }
        
        return result;
    }
    
    pub fn get_memory_slice(self: *const StepContext, offset: u32, size: u32) []const u8 {
        return self.frame.memory.get_slice(offset, size) catch &[_]u8{};
    }
};

pub const CallContext = struct {
    caller: Address,
    callee: Address,
    value: U256,
    input: []const u8,
    gas: u64,
    call_type: CallType,
    depth: u32,
    is_static: bool,
    
    pub const CallType = enum {
        Call,
        DelegateCall,
        StaticCall,
        CallCode,
        Create,
        Create2,
    };
};

pub const ErrorInfo = struct {
    error_type: ErrorType,
    message: []const u8,
    pc: u32,
    opcode: u8,
    gas_remaining: u64,
    depth: u32,
    address: Address,
    
    pub const ErrorType = enum {
        OutOfGas,
        StackUnderflow,
        StackOverflow,
        InvalidJump,
        InvalidOpcode,
        RevertInstruction,
        InvalidMemoryAccess,
        StaticCallStateChange,
        Other,
    };
};

pub const InspectorAction = enum {
    Continue,     // Continue normal execution
    Skip,         // Skip current operation
    Halt,         // Halt execution immediately
    Revert,       // Revert with error
};
```

## Production-Ready Inspector Patterns

The following sections provide detailed implementation patterns extracted from production EVM implementations (REVM, Geth, EVMOne) for building high-performance inspector frameworks with real-world optimization strategies.

### REVM Inspector Architecture Patterns

<explanation>
REVM demonstrates a sophisticated trait-based inspector system with optional hooks, two-phase execution patterns, context-aware inspection, and override capabilities. Key patterns include default empty implementations for all hooks, rich context passing, and instruction-level granularity with performance optimization through inline hints.
</explanation>

**Core Inspector Trait Pattern** (REVM Approach):
```zig
// Equivalent Zig pattern for REVM's Inspector trait
pub fn Inspector(comptime Context: type, comptime InterpreterType: type) type {
    return struct {
        ptr: *anyopaque,
        vtable: *const VTable,
        
        const Self = @This();
        
        pub const VTable = struct {
            // Pre-execution hooks (REVM pattern)
            initialize_interp: *const fn(ptr: *anyopaque, interp: *InterpreterType, context: *Context) void = noop_initialize,
            
            // Instruction-level hooks (REVM's step pattern)
            step: *const fn(ptr: *anyopaque, interp: *InterpreterType, context: *Context) void = noop_step,
            step_end: *const fn(ptr: *anyopaque, interp: *InterpreterType, context: *Context) void = noop_step_end,
            
            // Transaction/call lifecycle hooks (REVM pattern)
            call: *const fn(ptr: *anyopaque, context: *Context, inputs: *CallInputs) ?CallOutcome = noop_call,
            call_end: *const fn(ptr: *anyopaque, context: *Context, inputs: *const CallInputs, outcome: *CallOutcome) void = noop_call_end,
            
            create: *const fn(ptr: *anyopaque, context: *Context, inputs: *CreateInputs) ?CreateOutcome = noop_create,
            create_end: *const fn(ptr: *anyopaque, context: *Context, inputs: *const CreateInputs, outcome: *CreateOutcome) void = noop_create_end,
            
            // Event hooks (REVM pattern)
            log: *const fn(ptr: *anyopaque, interp: *InterpreterType, context: *Context, log: Log) void = noop_log,
            selfdestruct: *const fn(ptr: *anyopaque, contract: Address, target: Address, value: U256) void = noop_selfdestruct,
            
            // Default empty implementations (REVM pattern)
            fn noop_initialize(ptr: *anyopaque, interp: *InterpreterType, context: *Context) void {
                _ = ptr; _ = interp; _ = context;
            }
            
            fn noop_step(ptr: *anyopaque, interp: *InterpreterType, context: *Context) void {
                _ = ptr; _ = interp; _ = context;
            }
            
            fn noop_step_end(ptr: *anyopaque, interp: *InterpreterType, context: *Context) void {
                _ = ptr; _ = interp; _ = context;
            }
            
            fn noop_call(ptr: *anyopaque, context: *Context, inputs: *CallInputs) ?CallOutcome {
                _ = ptr; _ = context; _ = inputs;
                return null; // No override
            }
            
            fn noop_call_end(ptr: *anyopaque, context: *Context, inputs: *const CallInputs, outcome: *CallOutcome) void {
                _ = ptr; _ = context; _ = inputs; _ = outcome;
            }
            
            fn noop_create(ptr: *anyopaque, context: *Context, inputs: *CreateInputs) ?CreateOutcome {
                _ = ptr; _ = context; _ = inputs;
                return null; // No override
            }
            
            fn noop_create_end(ptr: *anyopaque, context: *Context, inputs: *const CreateInputs, outcome: *CreateOutcome) void {
                _ = ptr; _ = context; _ = inputs; _ = outcome;
            }
            
            fn noop_log(ptr: *anyopaque, interp: *InterpreterType, context: *Context, log: Log) void {
                _ = ptr; _ = interp; _ = context; _ = log;
            }
            
            fn noop_selfdestruct(ptr: *anyopaque, contract: Address, target: Address, value: U256) void {
                _ = ptr; _ = contract; _ = target; _ = value;
            }
        };
        
        // Factory function with compile-time inspection
        pub fn init(pointer: anytype) Self {
            const Ptr = @TypeOf(pointer);
            const ptr_info = @typeInfo(Ptr);
            
            if (ptr_info != .Pointer) @compileError("Expected pointer");
            if (ptr_info.Pointer.size != .One) @compileError("Expected single item pointer");
            
            const Child = ptr_info.Pointer.child;
            
            // Generate vtable based on available methods (compile-time introspection)
            const vtable = VTable{
                .initialize_interp = if (@hasDecl(Child, "initialize_interp")) 
                    struct {
                        fn call(ptr: *anyopaque, interp: *InterpreterType, context: *Context) void {
                            const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                            self.initialize_interp(interp, context);
                        }
                    }.call 
                else VTable.noop_initialize,
                
                .step = if (@hasDecl(Child, "step")) 
                    struct {
                        fn call(ptr: *anyopaque, interp: *InterpreterType, context: *Context) void {
                            const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                            self.step(interp, context);
                        }
                    }.call 
                else VTable.noop_step,
                
                .step_end = if (@hasDecl(Child, "step_end")) 
                    struct {
                        fn call(ptr: *anyopaque, interp: *InterpreterType, context: *Context) void {
                            const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                            self.step_end(interp, context);
                        }
                    }.call 
                else VTable.noop_step_end,
                
                // ... other methods with similar pattern
            };
            
            return Self{
                .ptr = pointer,
                .vtable = &vtable,
            };
        }
        
        // REVM's core inspection loop pattern
        pub inline fn step(self: Self, interp: *InterpreterType, context: *Context) void {
            self.vtable.step(self.ptr, interp, context);
        }
        
        pub inline fn step_end(self: Self, interp: *InterpreterType, context: *Context) void {
            self.vtable.step_end(self.ptr, interp, context);
        }
        
        // Override capability (REVM pattern)
        pub inline fn call(self: Self, context: *Context, inputs: *CallInputs) ?CallOutcome {
            return self.vtable.call(self.ptr, context, inputs);
        }
    };
}
```

**REVM's Inspection Loop Integration**:
```zig
// Core inspection loop (adapted from REVM)
pub fn inspect_instructions(
    context: anytype,
    interpreter: anytype,
    inspector: anytype,
    instructions: anytype,
) InstructionResult {
    var log_count = context.journal().logs().len;
    
    while (interpreter.control.instruction_result().is_continue()) {
        // Pre-instruction hook (REVM pattern)
        inspector.step(interpreter, context);
        if (!interpreter.control.instruction_result().is_continue()) {
            break;
        }
        
        // Execute instruction
        const opcode = interpreter.bytecode.opcode();
        interpreter.bytecode.relative_jump(1);
        instructions[opcode](interpreter, context);
        
        // Check for new logs and emit log hooks (REVM pattern)
        const new_log_count = context.journal().logs().len;
        if (log_count < new_log_count) {
            const log = context.journal().logs()[new_log_count - 1];
            inspector.log(interpreter, context, log);
            log_count = new_log_count;
        }
        
        // Post-instruction hook (REVM pattern)
        inspector.step_end(interpreter, context);
    }
    
    return interpreter.control.instruction_result();
}
```

### Geth's Hook-Based Architecture

<explanation>
Geth provides a comprehensive hook system with granular control over different execution aspects. Key patterns include optional function pointers for hooks, rich context objects providing comprehensive execution state, detailed reason categorization for state changes, and configurable tracing detail levels for performance optimization.
</explanation>

**Comprehensive Hook System** (Geth Pattern):
```zig
// Equivalent Zig pattern for Geth's hook-based tracing
pub const TracingHooks = struct {
    // VM execution hooks (optional function pointers)
    on_tx_start: ?*const fn(vm_context: *const VMContext, tx: *const Transaction, from: Address) void = null,
    on_tx_end: ?*const fn(receipt: *const Receipt, err: ?ExecutionError) void = null,
    on_enter: ?*const fn(depth: u32, call_type: u8, from: Address, to: Address, input: []const u8, gas: u64, value: U256) void = null,
    on_exit: ?*const fn(depth: u32, output: []const u8, gas_used: u64, err: ?ExecutionError, reverted: bool) void = null,
    on_opcode: ?*const fn(pc: u64, op: u8, gas: u64, cost: u64, scope: *const OpContext, data: []const u8, depth: u32, err: ?ExecutionError) void = null,
    on_fault: ?*const fn(pc: u64, op: u8, gas: u64, cost: u64, scope: *const OpContext, depth: u32, err: ExecutionError) void = null,
    
    // State change hooks with detailed reasons (Geth pattern)
    on_balance_change: ?*const fn(addr: Address, prev: U256, new: U256, reason: BalanceChangeReason) void = null,
    on_nonce_change: ?*const fn(addr: Address, prev: u64, new: u64, reason: NonceChangeReason) void = null,
    on_code_change: ?*const fn(addr: Address, prev_code_hash: B256, prev_code: []const u8, code_hash: B256, code: []const u8) void = null,
    on_storage_change: ?*const fn(addr: Address, slot: B256, prev: B256, new: B256) void = null,
    on_log: ?*const fn(log: *const Log) void = null,
    
    // Gas tracking hooks (Geth pattern)
    on_gas_change: ?*const fn(old: u64, new: u64, reason: GasChangeReason) void = null,
    
    // Configurable detail levels (Geth optimization)
    enable_memory: bool = false,
    disable_stack: bool = false,
    disable_storage: bool = false,
    enable_return_data: bool = false,
    
    // Execute hook if present (Geth pattern)
    pub inline fn call_on_opcode(self: *const TracingHooks, pc: u64, op: u8, gas: u64, cost: u64, scope: *const OpContext, data: []const u8, depth: u32, err: ?ExecutionError) void {
        if (self.on_opcode) |hook| {
            hook(pc, op, gas, cost, scope, data, depth, err);
        }
    }
    
    pub inline fn call_on_balance_change(self: *const TracingHooks, addr: Address, prev: U256, new: U256, reason: BalanceChangeReason) void {
        if (self.on_balance_change) |hook| {
            hook(addr, prev, new, reason);
        }
    }
};

// Rich context objects (Geth pattern)
pub const OpContext = struct {
    memory: *const Memory,
    stack: *const Stack,
    caller: Address,
    address: Address,
    call_value: U256,
    call_input: []const u8,
    contract_code: []const u8,
    
    // Geth's interface methods
    pub fn memory_data(self: *const OpContext) []const u8 {
        return self.memory.getData();
    }
    
    pub fn stack_data(self: *const OpContext) []const U256 {
        return self.stack.getData();
    }
    
    pub fn get_caller(self: *const OpContext) Address {
        return self.caller;
    }
    
    pub fn get_address(self: *const OpContext) Address {
        return self.address;
    }
    
    pub fn get_call_value(self: *const OpContext) U256 {
        return self.call_value;
    }
    
    pub fn get_call_input(self: *const OpContext) []const u8 {
        return self.call_input;
    }
    
    pub fn get_contract_code(self: *const OpContext) []const u8 {
        return self.contract_code;
    }
};

// Detailed reason categorization (Geth pattern)
pub const BalanceChangeReason = enum {
    balance_increase_reward_mine_block,
    balance_decrease_gas_buy,
    balance_increase_gas_return,
    balance_change_transfer,
    balance_change_revert,
    balance_increase_reward_mine_uncle,
    balance_increase_reward_mine_subroutine,
    balance_decrease_dao_contract,
    balance_change_genesis_balance,
    balance_increase_dao_refund_contract,
    balance_increase_dao_reward,
    balance_change_genesis_alloc,
    balance_increase_touch_account,
    balance_increase_selfdestruct,
    balance_decrease_selfdestruct_burn,
    balance_change_call,
    balance_change_call_code,
    balance_change_delegate_call,
    balance_change_create,
    balance_change_create2,
};

pub const GasChangeReason = enum {
    gas_change_call_precompile_contract,
    gas_change_call_precompiled_contract,
    gas_change_call_contract,
    gas_change_transaction_execution,
    gas_change_transaction_initial_balance,
    gas_change_vm_error,
    gas_change_touched_account,
    gas_change_internal_call,
    gas_change_external_call,
    gas_change_create_contract,
};
```

### EVMOne's Tracer Chain Pattern

<explanation>
EVMOne implements a sophisticated tracer chaining system allowing multiple tracers to work together. Key patterns include linked-list tracer composition, notification pattern with automatic forwarding, stack-based context management for nested calls, and performance-optimized implementations with noexcept specifications.
</explanation>

**Tracer Chain Implementation** (EVMOne Pattern):
```zig
// Equivalent Zig pattern for EVMOne's tracer chaining
pub const TracerChain = struct {
    allocator: std.mem.Allocator,
    tracers: std.ArrayList(AnyTracer),
    
    pub const AnyTracer = struct {
        ptr: *anyopaque,
        vtable: *const TracerVTable,
        
        pub const TracerVTable = struct {
            on_execution_start: *const fn(ptr: *anyopaque, rev: evmc_revision, msg: *const evmc_message, code: []const u8) void,
            on_instruction_start: *const fn(ptr: *anyopaque, pc: u32, stack_top: *const U256, stack_height: i32, gas: i64, state: *const ExecutionState) void,
            on_execution_end: *const fn(ptr: *anyopaque, result: *const evmc_result) void,
        };
        
        pub fn init(tracer: anytype) AnyTracer {
            const T = @TypeOf(tracer);
            const impl = struct {
                fn on_execution_start(ptr: *anyopaque, rev: evmc_revision, msg: *const evmc_message, code: []const u8) void {
                    const self = @ptrCast(*T, @alignCast(@alignOf(T), ptr));
                    self.on_execution_start(rev, msg, code);
                }
                
                fn on_instruction_start(ptr: *anyopaque, pc: u32, stack_top: *const U256, stack_height: i32, gas: i64, state: *const ExecutionState) void {
                    const self = @ptrCast(*T, @alignCast(@alignOf(T), ptr));
                    self.on_instruction_start(pc, stack_top, stack_height, gas, state);
                }
                
                fn on_execution_end(ptr: *anyopaque, result: *const evmc_result) void {
                    const self = @ptrCast(*T, @alignCast(@alignOf(T), ptr));
                    self.on_execution_end(result);
                }
            };
            
            const vtable = TracerVTable{
                .on_execution_start = impl.on_execution_start,
                .on_instruction_start = impl.on_instruction_start,
                .on_execution_end = impl.on_execution_end,
            };
            
            return AnyTracer{
                .ptr = tracer,
                .vtable = &vtable,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator) TracerChain {
        return TracerChain{
            .allocator = allocator,
            .tracers = std.ArrayList(AnyTracer).init(allocator),
        };
    }
    
    pub fn add_tracer(self: *TracerChain, tracer: anytype) !void {
        try self.tracers.append(AnyTracer.init(tracer));
    }
    
    // Notification pattern with forwarding (EVMOne pattern)
    pub fn notify_execution_start(self: *TracerChain, rev: evmc_revision, msg: *const evmc_message, code: []const u8) void {
        for (self.tracers.items) |tracer| {
            tracer.vtable.on_execution_start(tracer.ptr, rev, msg, code);
        }
    }
    
    pub fn notify_instruction_start(self: *TracerChain, pc: u32, stack_top: *const U256, stack_height: i32, gas: i64, state: *const ExecutionState) void {
        for (self.tracers.items) |tracer| {
            tracer.vtable.on_instruction_start(tracer.ptr, pc, stack_top, stack_height, gas, state);
        }
    }
    
    pub fn notify_execution_end(self: *TracerChain, result: *const evmc_result) void {
        for (self.tracers.items) |tracer| {
            tracer.vtable.on_execution_end(tracer.ptr, result);
        }
    }
};
```

**Concrete Tracer Implementations** (EVMOne Patterns):
```zig
// Histogram tracer for opcode frequency analysis (EVMOne pattern)
pub const HistogramTracer = struct {
    contexts: std.ArrayList(Context),
    allocator: std.mem.Allocator,
    
    pub const Context = struct {
        depth: i32,
        code: []const u8,
        counts: [256]u32, // Opcode frequency counters
        
        pub fn init(depth: i32, code: []const u8) Context {
            return Context{
                .depth = depth,
                .code = code,
                .counts = [_]u32{0} ** 256,
            };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator) HistogramTracer {
        return HistogramTracer{
            .contexts = std.ArrayList(Context).init(allocator),
            .allocator = allocator,
        };
    }
    
    pub fn on_execution_start(self: *HistogramTracer, rev: evmc_revision, msg: *const evmc_message, code: []const u8) void {
        _ = rev;
        const context = Context.init(msg.depth, code);
        self.contexts.append(context) catch return;
    }
    
    pub fn on_instruction_start(self: *HistogramTracer, pc: u32, stack_top: *const U256, stack_height: i32, gas: i64, state: *const ExecutionState) void {
        _ = stack_top; _ = stack_height; _ = gas; _ = state;
        
        if (self.contexts.items.len > 0) {
            var context = &self.contexts.items[self.contexts.items.len - 1];
            if (pc < context.code.len) {
                const opcode = context.code[pc];
                context.counts[opcode] += 1; // Increment opcode counter (EVMOne pattern)
            }
        }
    }
    
    pub fn on_execution_end(self: *HistogramTracer, result: *const evmc_result) void {
        _ = result;
        if (self.contexts.items.len > 0) {
            _ = self.contexts.pop();
        }
    }
    
    // Get opcode statistics
    pub fn get_opcode_counts(self: *const HistogramTracer) ?[256]u32 {
        if (self.contexts.items.len > 0) {
            return self.contexts.items[0].counts;
        }
        return null;
    }
};

// Full instruction tracer with detailed output (EVMOne pattern)
pub const InstructionTracer = struct {
    writer: std.io.Writer(std.fs.File, std.os.WriteError, std.fs.File.write),
    depth: u32 = 0,
    
    pub fn init(writer: anytype) InstructionTracer {
        return InstructionTracer{
            .writer = writer,
        };
    }
    
    pub fn on_execution_start(self: *InstructionTracer, rev: evmc_revision, msg: *const evmc_message, code: []const u8) void {
        _ = rev; _ = code;
        self.depth = @intCast(u32, msg.depth);
        self.writer.print("{{\"depth\":{},\"gas\":\"0x{x}\",\"value\":\"0x{x}\"}}\n", .{
            msg.depth, msg.gas, msg.value
        }) catch {};
    }
    
    pub fn on_instruction_start(self: *InstructionTracer, pc: u32, stack_top: *const U256, stack_height: i32, gas: i64, state: *const ExecutionState) void {
        // Output detailed JSON trace (EVMOne pattern)
        self.writer.print("{{\"pc\":{},\"op\":{},\"gas\":\"0x{x}\",\"gasCost\":\"0x{x}\"", .{
            pc, state.opcode, gas, state.gas_cost
        }) catch {};
        
        // Include stack information
        if (stack_height > 0) {
            self.writer.print(",\"stack\":[", .{}) catch {};
            var i: i32 = 0;
            while (i < @min(stack_height, 10)) : (i += 1) { // Limit stack output
                if (i > 0) self.writer.print(",", .{}) catch {};
                self.writer.print("\"0x{x}\"", .{stack_top.*}) catch {};
            }
            self.writer.print("]", .{}) catch {};
        }
        
        // Include memory size, return data, depth, refunds (EVMOne pattern)
        self.writer.print(",\"memory_size\":{},\"depth\":{}", .{
            state.memory_size, self.depth
        }) catch {};
        
        self.writer.print("}}\n", .{}) catch {};
    }
    
    pub fn on_execution_end(self: *InstructionTracer, result: *const evmc_result) void {
        self.writer.print("{{\"output\":\"0x", .{}) catch {};
        for (result.output_data[0..result.output_size]) |byte| {
            self.writer.print("{x:0>2}", .{byte}) catch {};
        }
        self.writer.print("\",\"gasUsed\":\"0x{x}\",\"time\":{}}}\n", .{
            result.gas_left, std.time.milliTimestamp()
        }) catch {};
    }
};
```

### Performance Optimization Patterns

<explanation>
Production inspector frameworks prioritize performance through various optimization techniques including inline hints for hot paths, configurable detail levels to reduce overhead, zero-cost abstractions with compile-time method resolution, atomic operations for concurrent access, and memory pool reuse for frequent allocations.
</explanation>

**Performance-Optimized Inspector Interface**:
```zig
// High-performance inspector with optimization patterns from all references
pub const HighPerformanceInspector = struct {
    // Pre-allocated buffers to avoid allocations (Geth pattern)
    trace_buffer: std.ArrayList(TraceEntry),
    stack_buffer: [1024]U256,
    memory_buffer: std.ArrayList(u8),
    
    // Configuration for performance tuning (Geth pattern)
    config: InspectorConfig,
    
    // Statistics tracking (performance monitoring)
    stats: InspectorStats,
    
    pub const InspectorConfig = struct {
        enable_step_tracing: bool = false,
        enable_memory_tracing: bool = false,
        enable_stack_tracing: bool = true,
        enable_storage_tracing: bool = false,
        max_stack_depth: u32 = 16,
        max_memory_size: usize = 1024 * 1024, // 1MB
        trace_buffer_size: usize = 10000,
        
        // Performance knobs
        use_pre_allocated_buffers: bool = true,
        atomic_stats: bool = false, // Use atomic operations for thread safety
    };
    
    pub const InspectorStats = struct {
        total_steps: u64 = 0,
        total_calls: u64 = 0,
        total_memory_accesses: u64 = 0,
        total_storage_accesses: u64 = 0,
        
        // Atomic versions for concurrent access (Geth pattern)
        pub fn increment_steps_atomic(self: *InspectorStats) void {
            _ = @atomicRmw(u64, &self.total_steps, .Add, 1, .Monotonic);
        }
        
        pub fn increment_calls_atomic(self: *InspectorStats) void {
            _ = @atomicRmw(u64, &self.total_calls, .Add, 1, .Monotonic);
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: InspectorConfig) !HighPerformanceInspector {
        return HighPerformanceInspector{
            .trace_buffer = try std.ArrayList(TraceEntry).initCapacity(allocator, config.trace_buffer_size),
            .memory_buffer = try std.ArrayList(u8).initCapacity(allocator, config.max_memory_size),
            .config = config,
            .stats = InspectorStats{},
        };
    }
    
    // REVM/EVMOne pattern: inline hints for hot paths
    pub inline fn step(self: *HighPerformanceInspector, interp: anytype, context: anytype) void {
        if (!self.config.enable_step_tracing) return; // Early exit for performance
        
        // Fast path with minimal allocations
        if (self.config.atomic_stats) {
            self.stats.increment_steps_atomic();
        } else {
            self.stats.total_steps += 1;
        }
        
        // Only trace if buffer has space (avoid reallocations)
        if (self.config.use_pre_allocated_buffers and self.trace_buffer.items.len < self.trace_buffer.capacity) {
            self.trace_buffer.appendAssumeCapacity(TraceEntry{
                .pc = interp.pc(),
                .opcode = interp.current_opcode(),
                .gas = interp.gas_remaining(),
                .stack_size = interp.stack_size(),
            });
        }
    }
    
    // Configurable detail level (Geth optimization pattern)
    pub inline fn memory_read(self: *HighPerformanceInspector, offset: u32, size: u32, data: []const u8) void {
        if (!self.config.enable_memory_tracing) return;
        
        // Update stats
        if (self.config.atomic_stats) {
            _ = @atomicRmw(u64, &self.stats.total_memory_accesses, .Add, 1, .Monotonic);
        } else {
            self.stats.total_memory_accesses += 1;
        }
        
        // Only store memory data if under size limit
        if (data.len <= self.config.max_memory_size) {
            // Use pre-allocated buffer to avoid allocations
            if (self.memory_buffer.capacity >= data.len) {
                self.memory_buffer.clearRetainingCapacity();
                self.memory_buffer.appendSliceAssumeCapacity(data);
            }
        }
    }
    
    // Zero-cost abstraction pattern
    pub inline fn call_if_enabled(
        self: *HighPerformanceInspector, 
        comptime method: []const u8, 
        args: anytype
    ) void {
        const enable_field = "enable_" ++ method ++ "_tracing";
        if (@field(self.config, enable_field)) {
            @field(self, method)(args);
        }
    }
};

// Compile-time method resolution (zero-cost abstraction)
pub fn create_optimized_inspector(comptime T: type, comptime config: InspectorConfig) type {
    return struct {
        inner: T,
        
        const Self = @This();
        
        // Only generate methods that are enabled in config
        pub usingnamespace if (config.enable_step_tracing) struct {
            pub inline fn step(self: *Self, interp: anytype, context: anytype) void {
                self.inner.step(interp, context);
            }
        } else struct {};
        
        pub usingnamespace if (config.enable_memory_tracing) struct {
            pub inline fn memory_read(self: *Self, offset: u32, size: u32, data: []const u8) void {
                self.inner.memory_read(offset, size, data);
            }
        } else struct {};
        
        pub usingnamespace if (config.enable_storage_tracing) struct {
            pub inline fn storage_read(self: *Self, address: Address, key: U256, value: U256) void {
                self.inner.storage_read(address, key, value);
            }
        } else struct {};
    };
}
```

### Complete Integration Patterns

<explanation>
The final piece involves complete integration patterns showing how inspectors work within the full execution loop, including atomic interrupt handling for tracer control, memory chunking strategies for large data captures, and comprehensive lifecycle management across frame boundaries.
</explanation>

**REVM's Complete Inspection Loop** (Production Integration Pattern):
```zig
// Complete inspection loop integration (REVM handler pattern)
pub fn inspect_complete_execution_loop(
    context: anytype,
    interpreter: anytype,
    inspector: anytype,
    instructions: anytype,
) InstructionResult {
    interpreter.reset_control();
    
    var log_count = context.journal().logs().len;
    
    // Main inspection loop (REVM pattern)
    while (interpreter.control.instruction_result().is_continue()) {
        // Get current opcode
        const opcode = interpreter.bytecode.opcode();
        
        // Pre-instruction inspector hook (REVM pattern)
        inspector.step(interpreter, context);
        if (interpreter.control.instruction_result() != .Continue) {
            break;
        }
        
        // Safe bytecode advancement (REVM pattern)
        interpreter.bytecode.relative_jump(1);
        
        // Execute instruction with context
        const instruction_context = InstructionContext{
            .interpreter = interpreter,
            .host = context,
        };
        instructions[opcode](instruction_context);
        
        // Check for new logs and emit log hooks (REVM pattern)
        const new_log_count = context.journal().logs().len;
        if (log_count < new_log_count) {
            const log = context.journal().logs().items[new_log_count - 1];
            inspector.log(interpreter, context, log);
            log_count = new_log_count;
        }
        
        // Post-instruction hook (REVM pattern)
        inspector.step_end(interpreter, context);
    }
    
    const next_action = interpreter.take_next_action();
    
    // Handle selfdestruct with inspector notification (REVM pattern)
    if (next_action == .Return and next_action.Return.result == .SelfDestruct) {
        if (context.journal().journal().items.len > 0) {
            const last_entry = context.journal().journal().items[context.journal().journal().items.len - 1];
            switch (last_entry) {
                .AccountDestroyed => |entry| {
                    inspector.selfdestruct(entry.address, entry.target, entry.had_balance);
                },
                .BalanceTransfer => |entry| {
                    inspector.selfdestruct(entry.from, entry.to, entry.balance);
                },
                else => {},
            }
        }
    }
    
    return next_action;
}

// Frame lifecycle management (REVM pattern)
pub fn frame_lifecycle_with_inspection(
    context: anytype,
    inspector: anytype,
    frame_input: anytype,
) FrameResult {
    // Frame start inspection (REVM pattern)
    if (frame_start_inspection(context, inspector, frame_input)) |result| {
        frame_end_inspection(context, inspector, frame_input, result);
        return result;
    }
    
    // Execute frame normally
    const result = execute_frame_normally(context, frame_input);
    
    // Frame end inspection (REVM pattern)
    frame_end_inspection(context, inspector, frame_input, result);
    
    return result;
}

fn frame_start_inspection(
    context: anytype,
    inspector: anytype,
    frame_input: anytype,
) ?FrameResult {
    return switch (frame_input.*) {
        .Call => |*inputs| inspector.call(context, inputs),
        .Create => |*inputs| inspector.create(context, inputs),
        .EOFCreate => |*inputs| inspector.eofcreate(context, inputs),
    };
}

fn frame_end_inspection(
    context: anytype,
    inspector: anytype,
    frame_input: anytype,
    frame_output: anytype,
) void {
    switch (frame_output) {
        .Call => |*outcome| {
            const inputs = &frame_input.Call;
            inspector.call_end(context, inputs, outcome);
        },
        .Create => |*outcome| {
            const inputs = &frame_input.Create;
            inspector.create_end(context, inputs, outcome);
        },
        .EOFCreate => |*outcome| {
            const inputs = &frame_input.EOFCreate;
            inspector.eofcreate_end(context, inputs, outcome);
        },
    }
}
```

**Advanced Structured Logger** (Geth Production Pattern):
```zig
// Advanced structured logger with all Geth optimizations
pub const AdvancedStructLogger = struct {
    allocator: std.mem.Allocator,
    config: LoggerConfig,
    
    // State tracking
    storage: std.HashMap(Address, Storage, AddressContext, std.hash_map.default_max_load_percentage),
    output: std.ArrayList(u8),
    execution_error: ?ExecutionError,
    used_gas: u64,
    
    // Output management (Geth pattern)
    writer: ?std.io.Writer(std.fs.File, std.os.WriteError, std.fs.File.write),
    logs: std.ArrayList(std.json.Value),
    result_size: usize,
    
    // Atomic interrupt handling (Geth pattern)
    interrupt: std.atomic.Atomic(bool),
    reason: ?ExecutionError,
    skip_processing: bool, // For system calls
    
    pub const LoggerConfig = struct {
        enable_memory: bool = false,
        disable_stack: bool = false,
        disable_storage: bool = false,
        enable_return_data: bool = false,
        size_limit: usize = 0, // 0 means unlimited
        
        // Chain overrides for future fork rules
        chain_overrides: ?ChainConfig = null,
    };
    
    pub const StructLogEntry = struct {
        pc: u64,
        op: u8,
        gas: u64,
        gas_cost: u64,
        memory: ?[]u8 = null,
        memory_size: usize,
        stack: ?[]U256 = null,
        return_data: ?[]u8 = null,
        storage: ?std.HashMap(B256, B256, B256Context, std.hash_map.default_max_load_percentage) = null,
        depth: u32,
        refund_counter: u64,
        execution_error: ?ExecutionError = null,
        
        // Human-readable formatting (Geth pattern)
        pub fn write_to(self: *const StructLogEntry, writer: anytype) !void {
            try writer.print("{s:<16} pc={:0>8} gas={} cost={}", .{
                get_opcode_name(self.op), self.pc, self.gas, self.gas_cost
            });
            
            if (self.execution_error) |err| {
                try writer.print(" ERROR: {}", .{err});
            }
            try writer.print("\n", .{});
            
            // Stack output (Geth pattern)
            if (self.stack) |stack| {
                try writer.print("Stack:\n", .{});
                var i: usize = stack.len;
                while (i > 0) : (i -= 1) {
                    try writer.print("{:0>8}  0x{}\n", .{ stack.len - i, stack[i - 1] });
                }
            }
            
            // Memory output with hex dump (Geth pattern)
            if (self.memory) |memory| {
                try writer.print("Memory:\n", .{});
                try writer.print("{s}", .{hex_dump(memory)});
            }
            
            // Storage output (Geth pattern)
            if (self.storage) |storage| {
                try writer.print("Storage:\n", .{});
                var iterator = storage.iterator();
                while (iterator.next()) |entry| {
                    try writer.print("0x{}: 0x{}\n", .{ entry.key_ptr.*, entry.value_ptr.* });
                }
            }
            
            // Return data output (Geth pattern)
            if (self.return_data) |return_data| {
                try writer.print("ReturnData:\n", .{});
                try writer.print("{s}", .{hex_dump(return_data)});
            }
            
            try writer.print("\n", .{});
        }
        
        // Legacy JSON conversion (Geth compatibility pattern)
        pub fn to_legacy_json(self: *const StructLogEntry, allocator: std.mem.Allocator) !std.json.Value {
            var obj = std.json.ObjectMap.init(allocator);
            
            try obj.put("pc", std.json.Value{ .integer = @intCast(i64, self.pc) });
            try obj.put("op", std.json.Value{ .string = get_opcode_name(self.op) });
            try obj.put("gas", std.json.Value{ .integer = @intCast(i64, self.gas) });
            try obj.put("gasCost", std.json.Value{ .integer = @intCast(i64, self.gas_cost) });
            try obj.put("depth", std.json.Value{ .integer = @intCast(i64, self.depth) });
            try obj.put("refund", std.json.Value{ .integer = @intCast(i64, self.refund_counter) });
            
            if (self.execution_error) |err| {
                try obj.put("error", std.json.Value{ .string = @errorName(err) });
            }
            
            // Stack as hex strings (Geth legacy format)
            if (self.stack) |stack| {
                var stack_array = std.json.Array.init(allocator);
                for (stack) |value| {
                    const hex_str = try std.fmt.allocPrint(allocator, "0x{}", .{value});
                    try stack_array.append(std.json.Value{ .string = hex_str });
                }
                try obj.put("stack", std.json.Value{ .array = stack_array });
            }
            
            // Memory as 64-char chunks (Geth legacy format)
            if (self.memory) |memory| {
                var memory_array = std.json.Array.init(allocator);
                var i: usize = 0;
                while (i < memory.len) : (i += 32) {
                    const end = @min(i + 32, memory.len);
                    const chunk_hex = try std.fmt.allocPrint(allocator, "{}", .{std.fmt.fmtSliceHexLower(memory[i..end])});
                    try memory_array.append(std.json.Value{ .string = chunk_hex });
                }
                try obj.put("memory", std.json.Value{ .array = memory_array });
            }
            
            // Storage map (Geth legacy format)
            if (self.storage) |storage| {
                var storage_obj = std.json.ObjectMap.init(allocator);
                var iterator = storage.iterator();
                while (iterator.next()) |entry| {
                    const key_hex = try std.fmt.allocPrint(allocator, "{}", .{entry.key_ptr.*});
                    const value_hex = try std.fmt.allocPrint(allocator, "{}", .{entry.value_ptr.*});
                    try storage_obj.put(key_hex, std.json.Value{ .string = value_hex });
                }
                try obj.put("storage", std.json.Value{ .object = storage_obj });
            }
            
            return std.json.Value{ .object = obj };
        }
    };
    
    pub fn init(allocator: std.mem.Allocator, config: LoggerConfig) AdvancedStructLogger {
        return AdvancedStructLogger{
            .allocator = allocator,
            .config = config,
            .storage = std.HashMap(Address, Storage, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
            .output = std.ArrayList(u8).init(allocator),
            .execution_error = null,
            .used_gas = 0,
            .writer = null,
            .logs = std.ArrayList(std.json.Value).init(allocator),
            .result_size = 0,
            .interrupt = std.atomic.Atomic(bool).init(false),
            .reason = null,
            .skip_processing = false,
        };
    }
    
    // Atomic interrupt handling (Geth pattern)
    pub fn stop(self: *AdvancedStructLogger, reason: ExecutionError) void {
        self.reason = reason;
        self.interrupt.store(true, .Monotonic);
    }
    
    pub fn is_interrupted(self: *const AdvancedStructLogger) bool {
        return self.interrupt.load(.Monotonic);
    }
    
    // Step hook with full Geth functionality
    pub fn step(self: *AdvancedStructLogger, interp: anytype, context: anytype) void {
        // Early exit if interrupted
        if (self.is_interrupted() or self.skip_processing) return;
        
        // Check size limit (Geth optimization)
        if (self.config.size_limit != 0 and self.result_size > self.config.size_limit) {
            return;
        }
        
        const opcode = interp.current_opcode();
        const pc = interp.pc();
        const gas = interp.gas_remaining();
        const gas_cost = interp.gas_cost();
        const depth = context.call_depth();
        const contract_addr = interp.contract_address();
        
        // Create structured log entry
        var log_entry = StructLogEntry{
            .pc = pc,
            .op = opcode,
            .gas = gas,
            .gas_cost = gas_cost,
            .memory_size = interp.memory_size(),
            .depth = depth,
            .refund_counter = context.state_db.get_refund(),
        };
        
        // Capture memory if enabled (Geth pattern)
        if (self.config.enable_memory) {
            const memory_data = interp.memory_data();
            log_entry.memory = self.allocator.dupe(u8, memory_data) catch null;
        }
        
        // Capture stack if not disabled (Geth pattern)
        if (!self.config.disable_stack) {
            const stack_data = interp.stack_data();
            log_entry.stack = self.allocator.dupe(U256, stack_data) catch null;
        }
        
        // Capture storage for SLOAD/SSTORE (Geth pattern)
        if (!self.config.disable_storage and (opcode == 0x54 or opcode == 0x55)) { // SLOAD or SSTORE
            if (self.storage.getPtr(contract_addr) == null) {
                self.storage.put(contract_addr, Storage.init(self.allocator)) catch return;
            }
            
            var contract_storage = self.storage.getPtr(contract_addr).?;
            
            if (opcode == 0x54 and interp.stack_size() >= 1) { // SLOAD
                const key = B256.from_u256(interp.stack_peek(0));
                const value = B256.from_bytes(context.state_db.get_state(contract_addr, key));
                contract_storage.put(key, value) catch return;
            } else if (opcode == 0x55 and interp.stack_size() >= 2) { // SSTORE
                const key = B256.from_u256(interp.stack_peek(0));
                const value = B256.from_u256(interp.stack_peek(1));
                contract_storage.put(key, value) catch return;
            }
            
            // Clone storage for this log entry
            log_entry.storage = contract_storage.clone() catch null;
        }
        
        // Output to writer or store in buffer (Geth pattern)
        if (self.writer) |writer| {
            log_entry.write_to(writer) catch {};
        } else {
            const json_entry = log_entry.to_legacy_json(self.allocator) catch return;
            const json_bytes = std.json.stringify(json_entry, .{}, self.allocator) catch return;
            self.result_size += json_bytes.len;
            self.logs.append(json_entry) catch return;
        }
    }
    
    // System call handling (Geth pattern)
    pub fn on_system_call_start(self: *AdvancedStructLogger) void {
        self.skip_processing = true;
    }
    
    pub fn on_system_call_end(self: *AdvancedStructLogger) void {
        self.skip_processing = false;
    }
    
    // Execution result generation (Geth pattern)
    pub fn get_execution_result(self: *const AdvancedStructLogger) !std.json.Value {
        if (self.reason) |reason| {
            return error.TracingAborted;
        }
        
        const failed = self.execution_error != null;
        var return_data = self.output.items;
        
        // Return empty data for failed execution unless it's a revert
        if (failed and self.execution_error != ExecutionError.Revert) {
            return_data = &[_]u8{};
        }
        
        var result = std.json.ObjectMap.init(self.allocator);
        try result.put("gas", std.json.Value{ .integer = @intCast(i64, self.used_gas) });
        try result.put("failed", std.json.Value{ .bool = failed });
        try result.put("returnValue", std.json.Value{ .string = try std.fmt.allocPrint(self.allocator, "0x{}", .{std.fmt.fmtSliceHexLower(return_data)}) });
        try result.put("structLogs", std.json.Value{ .array = std.json.Array.fromOwnedSlice(self.allocator, try self.allocator.dupe(std.json.Value, self.logs.items)) });
        
        return std.json.Value{ .object = result };
    }
};

// Utility functions
fn hex_dump(data: []const u8) []const u8 {
    // Implementation of hex dump similar to Go's hex.Dump
    // Returns formatted hex dump string
    // ... implementation details ...
    return "hex dump placeholder";
}
```

This comprehensive collection of production-ready patterns provides the foundation for implementing a high-performance, flexible inspector framework in the Zig EVM, drawing from battle-tested approaches while leveraging Zig's unique compile-time capabilities and performance characteristics.

## Implementation Requirements

### Core Functionality
1. **Inspector Management**: Register and manage multiple inspectors
2. **Hook Integration**: Seamlessly integrate hooks into VM execution
3. **Performance**: Minimal overhead when no inspectors are active
4. **Error Handling**: Graceful handling of inspector failures
5. **Composition**: Support multiple inspectors with clear precedence rules
6. **Lifecycle Management**: Proper initialization and cleanup

## Implementation Tasks

### Task 1: Implement Core Inspector Framework
File: `/src/evm/inspector/inspector.zig`
```zig
const std = @import("std");
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const Vm = @import("../vm.zig").Vm;
const Frame = @import("../frame.zig").Frame;
const ExecutionResult = @import("../execution/execution_result.zig").ExecutionResult;
const Log = @import("../state/evm_log.zig").Log;

pub const InspectorAction = enum {
    Continue,
    Skip,
    Halt,
    Revert,
};

pub const StepContext = struct {
    vm: *Vm,
    frame: *Frame,
    opcode: u8,
    pc: u32,
    gas_remaining: u64,
    gas_cost: u64,
    depth: u32,
    
    pub fn get_stack_top(self: *const StepContext, count: u32) ![]U256 {
        const stack_size = self.frame.stack.size();
        const take = @min(count, stack_size);
        
        var result = try self.vm.allocator.alloc(U256, take);
        
        for (0..take) |i| {
            result[i] = self.frame.stack.peek_unsafe(i);
        }
        
        return result;
    }
    
    pub fn get_memory_slice(self: *const StepContext, offset: u32, size: u32) []const u8 {
        return self.frame.memory.get_slice(offset, size) catch &[_]u8{};
    }
    
    pub fn get_opcode_name(self: *const StepContext) []const u8 {
        return get_opcode_name(self.opcode);
    }
};

pub const CallContext = struct {
    caller: Address,
    callee: Address,
    value: U256,
    input: []const u8,
    gas: u64,
    call_type: CallType,
    depth: u32,
    is_static: bool,
    
    pub const CallType = enum {
        Call,
        DelegateCall,
        StaticCall,
        CallCode,
        Create,
        Create2,
    };
};

pub const CallResult = struct {
    success: bool,
    gas_used: u64,
    output: []const u8,
    error_message: ?[]const u8,
};

pub const ErrorInfo = struct {
    error_type: ErrorType,
    message: []const u8,
    pc: u32,
    opcode: u8,
    gas_remaining: u64,
    depth: u32,
    address: Address,
    
    pub const ErrorType = enum {
        OutOfGas,
        StackUnderflow,
        StackOverflow,
        InvalidJump,
        InvalidOpcode,
        RevertInstruction,
        InvalidMemoryAccess,
        StaticCallStateChange,
        Other,
    };
};

pub const Inspector = struct {
    ptr: *anyopaque,
    vtable: *const VTable,
    
    pub const VTable = struct {
        // VM lifecycle events
        initialize: ?*const fn(ptr: *anyopaque, vm: *Vm) anyerror!void,
        finalize: ?*const fn(ptr: *anyopaque, vm: *Vm) anyerror!void,
        
        // Execution hooks
        step_start: ?*const fn(ptr: *anyopaque, context: *const StepContext) anyerror!InspectorAction,
        step_end: ?*const fn(ptr: *anyopaque, context: *const StepContext, result: ExecutionResult) anyerror!void,
        
        // Call hooks
        call_start: ?*const fn(ptr: *anyopaque, context: *const CallContext) anyerror!InspectorAction,
        call_end: ?*const fn(ptr: *anyopaque, context: *const CallContext, result: CallResult) anyerror!void,
        
        // Memory hooks
        memory_read: ?*const fn(ptr: *anyopaque, offset: u32, size: u32, data: []const u8) anyerror!void,
        memory_write: ?*const fn(ptr: *anyopaque, offset: u32, data: []const u8) anyerror!void,
        
        // Storage hooks
        storage_read: ?*const fn(ptr: *anyopaque, address: Address, key: U256, value: U256) anyerror!void,
        storage_write: ?*const fn(ptr: *anyopaque, address: Address, key: U256, old_value: U256, new_value: U256) anyerror!void,
        
        // Event hooks
        log_emitted: ?*const fn(ptr: *anyopaque, log: *const Log) anyerror!void,
        selfdestruct: ?*const fn(ptr: *anyopaque, address: Address, beneficiary: Address) anyerror!void,
        
        // Error hooks
        execution_error: ?*const fn(ptr: *anyopaque, error_info: *const ErrorInfo) anyerror!void,
    };
    
    pub fn init(pointer: anytype) Inspector {
        const Ptr = @TypeOf(pointer);
        const ptr_info = @typeInfo(Ptr);
        
        if (ptr_info != .Pointer) @compileError("Expected pointer");
        if (ptr_info.Pointer.size != .One) @compileError("Expected single item pointer");
        
        const Child = ptr_info.Pointer.child;
        
        const impl = struct {
            fn initialize(ptr: *anyopaque, vm: *Vm) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "initialize")) {
                    return self.initialize(vm);
                }
            }
            
            fn finalize(ptr: *anyopaque, vm: *Vm) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "finalize")) {
                    return self.finalize(vm);
                }
            }
            
            fn step_start(ptr: *anyopaque, context: *const StepContext) anyerror!InspectorAction {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "step_start")) {
                    return self.step_start(context);
                }
                return InspectorAction.Continue;
            }
            
            fn step_end(ptr: *anyopaque, context: *const StepContext, result: ExecutionResult) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "step_end")) {
                    return self.step_end(context, result);
                }
            }
            
            fn call_start(ptr: *anyopaque, context: *const CallContext) anyerror!InspectorAction {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "call_start")) {
                    return self.call_start(context);
                }
                return InspectorAction.Continue;
            }
            
            fn call_end(ptr: *anyopaque, context: *const CallContext, result: CallResult) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "call_end")) {
                    return self.call_end(context, result);
                }
            }
            
            fn memory_read(ptr: *anyopaque, offset: u32, size: u32, data: []const u8) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "memory_read")) {
                    return self.memory_read(offset, size, data);
                }
            }
            
            fn memory_write(ptr: *anyopaque, offset: u32, data: []const u8) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "memory_write")) {
                    return self.memory_write(offset, data);
                }
            }
            
            fn storage_read(ptr: *anyopaque, address: Address, key: U256, value: U256) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "storage_read")) {
                    return self.storage_read(address, key, value);
                }
            }
            
            fn storage_write(ptr: *anyopaque, address: Address, key: U256, old_value: U256, new_value: U256) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "storage_write")) {
                    return self.storage_write(address, key, old_value, new_value);
                }
            }
            
            fn log_emitted(ptr: *anyopaque, log: *const Log) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "log_emitted")) {
                    return self.log_emitted(log);
                }
            }
            
            fn selfdestruct(ptr: *anyopaque, address: Address, beneficiary: Address) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "selfdestruct")) {
                    return self.selfdestruct(address, beneficiary);
                }
            }
            
            fn execution_error(ptr: *anyopaque, error_info: *const ErrorInfo) anyerror!void {
                const self = @ptrCast(*Child, @alignCast(@alignOf(Child), ptr));
                if (@hasDecl(Child, "execution_error")) {
                    return self.execution_error(error_info);
                }
            }
        };
        
        return Inspector{
            .ptr = pointer,
            .vtable = &VTable{
                .initialize = if (@hasDecl(Child, "initialize")) impl.initialize else null,
                .finalize = if (@hasDecl(Child, "finalize")) impl.finalize else null,
                .step_start = if (@hasDecl(Child, "step_start")) impl.step_start else null,
                .step_end = if (@hasDecl(Child, "step_end")) impl.step_end else null,
                .call_start = if (@hasDecl(Child, "call_start")) impl.call_start else null,
                .call_end = if (@hasDecl(Child, "call_end")) impl.call_end else null,
                .memory_read = if (@hasDecl(Child, "memory_read")) impl.memory_read else null,
                .memory_write = if (@hasDecl(Child, "memory_write")) impl.memory_write else null,
                .storage_read = if (@hasDecl(Child, "storage_read")) impl.storage_read else null,
                .storage_write = if (@hasDecl(Child, "storage_write")) impl.storage_write else null,
                .log_emitted = if (@hasDecl(Child, "log_emitted")) impl.log_emitted else null,
                .selfdestruct = if (@hasDecl(Child, "selfdestruct")) impl.selfdestruct else null,
                .execution_error = if (@hasDecl(Child, "execution_error")) impl.execution_error else null,
            },
        };
    }
    
    // Convenience methods
    pub fn call_initialize(self: *const Inspector, vm: *Vm) !void {
        if (self.vtable.initialize) |func| {
            return func(self.ptr, vm);
        }
    }
    
    pub fn call_finalize(self: *const Inspector, vm: *Vm) !void {
        if (self.vtable.finalize) |func| {
            return func(self.ptr, vm);
        }
    }
    
    pub fn call_step_start(self: *const Inspector, context: *const StepContext) !InspectorAction {
        if (self.vtable.step_start) |func| {
            return func(self.ptr, context);
        }
        return InspectorAction.Continue;
    }
    
    pub fn call_step_end(self: *const Inspector, context: *const StepContext, result: ExecutionResult) !void {
        if (self.vtable.step_end) |func| {
            return func(self.ptr, context, result);
        }
    }
    
    pub fn call_call_start(self: *const Inspector, context: *const CallContext) !InspectorAction {
        if (self.vtable.call_start) |func| {
            return func(self.ptr, context);
        }
        return InspectorAction.Continue;
    }
    
    pub fn call_call_end(self: *const Inspector, context: *const CallContext, result: CallResult) !void {
        if (self.vtable.call_end) |func| {
            return func(self.ptr, context, result);
        }
    }
    
    pub fn call_memory_read(self: *const Inspector, offset: u32, size: u32, data: []const u8) !void {
        if (self.vtable.memory_read) |func| {
            return func(self.ptr, offset, size, data);
        }
    }
    
    pub fn call_memory_write(self: *const Inspector, offset: u32, data: []const u8) !void {
        if (self.vtable.memory_write) |func| {
            return func(self.ptr, offset, data);
        }
    }
    
    pub fn call_storage_read(self: *const Inspector, address: Address, key: U256, value: U256) !void {
        if (self.vtable.storage_read) |func| {
            return func(self.ptr, address, key, value);
        }
    }
    
    pub fn call_storage_write(self: *const Inspector, address: Address, key: U256, old_value: U256, new_value: U256) !void {
        if (self.vtable.storage_write) |func| {
            return func(self.ptr, address, key, old_value, new_value);
        }
    }
    
    pub fn call_log_emitted(self: *const Inspector, log: *const Log) !void {
        if (self.vtable.log_emitted) |func| {
            return func(self.ptr, log);
        }
    }
    
    pub fn call_selfdestruct(self: *const Inspector, address: Address, beneficiary: Address) !void {
        if (self.vtable.selfdestruct) |func| {
            return func(self.ptr, address, beneficiary);
        }
    }
    
    pub fn call_execution_error(self: *const Inspector, error_info: *const ErrorInfo) !void {
        if (self.vtable.execution_error) |func| {
            return func(self.ptr, error_info);
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
        0x10 => "LT",
        0x11 => "GT",
        0x12 => "SLT",
        0x13 => "SGT",
        0x14 => "EQ",
        0x15 => "ISZERO",
        0x16 => "AND",
        0x17 => "OR",
        0x18 => "XOR",
        0x19 => "NOT",
        0x1A => "BYTE",
        0x1B => "SHL",
        0x1C => "SHR",
        0x1D => "SAR",
        0x20 => "KECCAK256",
        0x30 => "ADDRESS",
        0x31 => "BALANCE",
        0x32 => "ORIGIN",
        0x33 => "CALLER",
        0x34 => "CALLVALUE",
        0x35 => "CALLDATALOAD",
        0x36 => "CALLDATASIZE",
        0x37 => "CALLDATACOPY",
        0x38 => "CODESIZE",
        0x39 => "CODECOPY",
        0x3A => "GASPRICE",
        0x3B => "EXTCODESIZE",
        0x3C => "EXTCODECOPY",
        0x3D => "RETURNDATASIZE",
        0x3E => "RETURNDATACOPY",
        0x3F => "EXTCODEHASH",
        0x40 => "BLOCKHASH",
        0x41 => "COINBASE",
        0x42 => "TIMESTAMP",
        0x43 => "NUMBER",
        0x44 => "PREVRANDAO",
        0x45 => "GASLIMIT",
        0x46 => "CHAINID",
        0x47 => "SELFBALANCE",
        0x48 => "BASEFEE",
        0x49 => "BLOBHASH",
        0x4A => "BLOBBASEFEE",
        0x50 => "POP",
        0x51 => "MLOAD",
        0x52 => "MSTORE",
        0x53 => "MSTORE8",
        0x54 => "SLOAD",
        0x55 => "SSTORE",
        0x56 => "JUMP",
        0x57 => "JUMPI",
        0x58 => "PC",
        0x59 => "MSIZE",
        0x5A => "GAS",
        0x5B => "JUMPDEST",
        0x5C => "TLOAD",
        0x5D => "TSTORE",
        0x5E => "MCOPY",
        0x5F => "PUSH0",
        0x60...0x7F => "PUSH",
        0x80...0x8F => "DUP",
        0x90...0x9F => "SWAP",
        0xA0 => "LOG0",
        0xA1 => "LOG1",
        0xA2 => "LOG2",
        0xA3 => "LOG3",
        0xA4 => "LOG4",
        0xF0 => "CREATE",
        0xF1 => "CALL",
        0xF2 => "CALLCODE",
        0xF3 => "RETURN",
        0xF4 => "DELEGATECALL",
        0xF5 => "CREATE2",
        0xFA => "STATICCALL",
        0xFD => "REVERT",
        0xFE => "INVALID",
        0xFF => "SELFDESTRUCT",
        else => "UNKNOWN",
    };
}
```

### Task 2: Implement Inspector Manager
File: `/src/evm/inspector/inspector_manager.zig`
```zig
const std = @import("std");
const Inspector = @import("inspector.zig").Inspector;
const InspectorAction = @import("inspector.zig").InspectorAction;
const StepContext = @import("inspector.zig").StepContext;
const CallContext = @import("inspector.zig").CallContext;
const CallResult = @import("inspector.zig").CallResult;
const ErrorInfo = @import("inspector.zig").ErrorInfo;
const Vm = @import("../vm.zig").Vm;
const Log = @import("../state/evm_log.zig").Log;
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const ExecutionResult = @import("../execution/execution_result.zig").ExecutionResult;

pub const InspectorManager = struct {
    inspectors: std.ArrayList(Inspector),
    allocator: std.mem.Allocator,
    enabled: bool,
    
    pub fn init(allocator: std.mem.Allocator) InspectorManager {
        return InspectorManager{
            .inspectors = std.ArrayList(Inspector).init(allocator),
            .allocator = allocator,
            .enabled = false,
        };
    }
    
    pub fn deinit(self: *InspectorManager) void {
        self.inspectors.deinit();
    }
    
    pub fn add_inspector(self: *InspectorManager, inspector: Inspector) !void {
        try self.inspectors.append(inspector);
        self.enabled = true;
    }
    
    pub fn remove_inspector(self: *InspectorManager, inspector: Inspector) void {
        // Find and remove inspector by comparing pointers
        for (self.inspectors.items, 0..) |item, i| {
            if (item.ptr == inspector.ptr) {
                _ = self.inspectors.orderedRemove(i);
                break;
            }
        }
        
        if (self.inspectors.items.len == 0) {
            self.enabled = false;
        }
    }
    
    pub fn clear_inspectors(self: *InspectorManager) void {
        self.inspectors.clearRetainingCapacity();
        self.enabled = false;
    }
    
    pub fn is_enabled(self: *const InspectorManager) bool {
        return self.enabled and self.inspectors.items.len > 0;
    }
    
    // VM lifecycle events
    pub fn initialize(self: *InspectorManager, vm: *Vm) !void {
        if (!self.is_enabled()) return;
        
        for (self.inspectors.items) |*inspector| {
            inspector.call_initialize(vm) catch |err| {
                // Log error but continue with other inspectors
                std.log.warn("Inspector initialization failed: {}", .{err});
            };
        }
    }
    
    pub fn finalize(self: *InspectorManager, vm: *Vm) !void {
        if (!self.is_enabled()) return;
        
        for (self.inspectors.items) |*inspector| {
            inspector.call_finalize(vm) catch |err| {
                // Log error but continue with other inspectors
                std.log.warn("Inspector finalization failed: {}", .{err});
            };
        }
    }
    
    // Execution hooks
    pub fn step_start(self: *InspectorManager, context: *const StepContext) !InspectorAction {
        if (!self.is_enabled()) return InspectorAction.Continue;
        
        for (self.inspectors.items) |*inspector| {
            const action = inspector.call_step_start(context) catch |err| {
                std.log.warn("Inspector step_start failed: {}", .{err});
                continue;
            };
            
            // If any inspector says to halt/skip/revert, respect that
            switch (action) {
                .Continue => continue,
                else => return action,
            }
        }
        
        return InspectorAction.Continue;
    }
    
    pub fn step_end(self: *InspectorManager, context: *const StepContext, result: ExecutionResult) !void {
        if (!self.is_enabled()) return;
        
        for (self.inspectors.items) |*inspector| {
            inspector.call_step_end(context, result) catch |err| {
                std.log.warn("Inspector step_end failed: {}", .{err});
            };
        }
    }
    
    // Call hooks
    pub fn call_start(self: *InspectorManager, context: *const CallContext) !InspectorAction {
        if (!self.is_enabled()) return InspectorAction.Continue;
        
        for (self.inspectors.items) |*inspector| {
            const action = inspector.call_call_start(context) catch |err| {
                std.log.warn("Inspector call_start failed: {}", .{err});
                continue;
            };
            
            switch (action) {
                .Continue => continue,
                else => return action,
            }
        }
        
        return InspectorAction.Continue;
    }
    
    pub fn call_end(self: *InspectorManager, context: *const CallContext, result: CallResult) !void {
        if (!self.is_enabled()) return;
        
        for (self.inspectors.items) |*inspector| {
            inspector.call_call_end(context, result) catch |err| {
                std.log.warn("Inspector call_end failed: {}", .{err});
            };
        }
    }
    
    // Memory hooks
    pub fn memory_read(self: *InspectorManager, offset: u32, size: u32, data: []const u8) !void {
        if (!self.is_enabled()) return;
        
        for (self.inspectors.items) |*inspector| {
            inspector.call_memory_read(offset, size, data) catch |err| {
                std.log.warn("Inspector memory_read failed: {}", .{err});
            };
        }
    }
    
    pub fn memory_write(self: *InspectorManager, offset: u32, data: []const u8) !void {
        if (!self.is_enabled()) return;
        
        for (self.inspectors.items) |*inspector| {
            inspector.call_memory_write(offset, data) catch |err| {
                std.log.warn("Inspector memory_write failed: {}", .{err});
            };
        }
    }
    
    // Storage hooks
    pub fn storage_read(self: *InspectorManager, address: Address, key: U256, value: U256) !void {
        if (!self.is_enabled()) return;
        
        for (self.inspectors.items) |*inspector| {
            inspector.call_storage_read(address, key, value) catch |err| {
                std.log.warn("Inspector storage_read failed: {}", .{err});
            };
        }
    }
    
    pub fn storage_write(self: *InspectorManager, address: Address, key: U256, old_value: U256, new_value: U256) !void {
        if (!self.is_enabled()) return;
        
        for (self.inspectors.items) |*inspector| {
            inspector.call_storage_write(address, key, old_value, new_value) catch |err| {
                std.log.warn("Inspector storage_write failed: {}", .{err});
            };
        }
    }
    
    // Event hooks
    pub fn log_emitted(self: *InspectorManager, log: *const Log) !void {
        if (!self.is_enabled()) return;
        
        for (self.inspectors.items) |*inspector| {
            inspector.call_log_emitted(log) catch |err| {
                std.log.warn("Inspector log_emitted failed: {}", .{err});
            };
        }
    }
    
    pub fn selfdestruct(self: *InspectorManager, address: Address, beneficiary: Address) !void {
        if (!self.is_enabled()) return;
        
        for (self.inspectors.items) |*inspector| {
            inspector.call_selfdestruct(address, beneficiary) catch |err| {
                std.log.warn("Inspector selfdestruct failed: {}", .{err});
            };
        }
    }
    
    // Error hooks
    pub fn execution_error(self: *InspectorManager, error_info: *const ErrorInfo) !void {
        if (!self.is_enabled()) return;
        
        for (self.inspectors.items) |*inspector| {
            inspector.call_execution_error(error_info) catch |err| {
                std.log.warn("Inspector execution_error failed: {}", .{err});
            };
        }
    }
};
```

### Task 3: Implement Example Inspectors
File: `/src/evm/inspector/builtin_inspectors.zig`
```zig
const std = @import("std");
const Inspector = @import("inspector.zig").Inspector;
const InspectorAction = @import("inspector.zig").InspectorAction;
const StepContext = @import("inspector.zig").StepContext;
const CallContext = @import("inspector.zig").CallContext;
const CallResult = @import("inspector.zig").CallResult;
const ErrorInfo = @import("inspector.zig").ErrorInfo;
const Vm = @import("../vm.zig").Vm;
const Log = @import("../state/evm_log.zig").Log;
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const ExecutionResult = @import("../execution/execution_result.zig").ExecutionResult;

// Basic logging inspector
pub const LoggingInspector = struct {
    allocator: std.mem.Allocator,
    step_count: u64,
    
    pub fn init(allocator: std.mem.Allocator) LoggingInspector {
        return LoggingInspector{
            .allocator = allocator,
            .step_count = 0,
        };
    }
    
    pub fn initialize(self: *LoggingInspector, vm: *Vm) !void {
        _ = vm;
        std.log.info("LoggingInspector: VM execution started", .{});
        self.step_count = 0;
    }
    
    pub fn finalize(self: *LoggingInspector, vm: *Vm) !void {
        _ = vm;
        std.log.info("LoggingInspector: VM execution finished after {} steps", .{self.step_count});
    }
    
    pub fn step_start(self: *LoggingInspector, context: *const StepContext) !InspectorAction {
        self.step_count += 1;
        
        std.log.debug("Step {}: PC={} OP={s} GAS={} DEPTH={}", .{
            self.step_count,
            context.pc,
            context.get_opcode_name(),
            context.gas_remaining,
            context.depth
        });
        
        return InspectorAction.Continue;
    }
    
    pub fn call_start(self: *LoggingInspector, context: *const CallContext) !InspectorAction {
        std.log.info("CALL: {} -> {} VALUE={} GAS={} TYPE={s}", .{
            context.caller,
            context.callee,
            context.value,
            context.gas,
            @tagName(context.call_type)
        });
        
        return InspectorAction.Continue;
    }
    
    pub fn execution_error(self: *LoggingInspector, error_info: *const ErrorInfo) !void {
        std.log.err("EXECUTION ERROR: {} at PC={} OP={s}: {s}", .{
            @tagName(error_info.error_type),
            error_info.pc,
            get_opcode_name(error_info.opcode),
            error_info.message
        });
    }
};

// Gas consumption tracker
pub const GasInspector = struct {
    allocator: std.mem.Allocator,
    total_gas_used: u64,
    gas_by_opcode: std.HashMap(u8, u64, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage),
    
    pub fn init(allocator: std.mem.Allocator) GasInspector {
        return GasInspector{
            .allocator = allocator,
            .total_gas_used = 0,
            .gas_by_opcode = std.HashMap(u8, u64, std.hash_map.DefaultContext(u8), std.hash_map.default_max_load_percentage).init(allocator),
        };
    }
    
    pub fn deinit(self: *GasInspector) void {
        self.gas_by_opcode.deinit();
    }
    
    pub fn initialize(self: *GasInspector, vm: *Vm) !void {
        _ = vm;
        self.total_gas_used = 0;
        self.gas_by_opcode.clearRetainingCapacity();
    }
    
    pub fn step_start(self: *GasInspector, context: *const StepContext) !InspectorAction {
        // Track gas consumption by opcode
        const existing = self.gas_by_opcode.get(context.opcode) orelse 0;
        try self.gas_by_opcode.put(context.opcode, existing + context.gas_cost);
        
        self.total_gas_used += context.gas_cost;
        
        return InspectorAction.Continue;
    }
    
    pub fn get_total_gas_used(self: *const GasInspector) u64 {
        return self.total_gas_used;
    }
    
    pub fn get_gas_by_opcode(self: *const GasInspector, opcode: u8) u64 {
        return self.gas_by_opcode.get(opcode) orelse 0;
    }
    
    pub fn print_gas_report(self: *const GasInspector) void {
        std.log.info("Gas Report:");
        std.log.info("Total Gas Used: {}", .{self.total_gas_used});
        std.log.info("Gas by Opcode:");
        
        var iterator = self.gas_by_opcode.iterator();
        while (iterator.next()) |entry| {
            std.log.info("  {s}: {}", .{ get_opcode_name(entry.key_ptr.*), entry.value_ptr.* });
        }
    }
};

// Memory access tracker
pub const MemoryInspector = struct {
    allocator: std.mem.Allocator,
    memory_reads: u64,
    memory_writes: u64,
    max_memory_size: u32,
    
    pub fn init(allocator: std.mem.Allocator) MemoryInspector {
        return MemoryInspector{
            .allocator = allocator,
            .memory_reads = 0,
            .memory_writes = 0,
            .max_memory_size = 0,
        };
    }
    
    pub fn initialize(self: *MemoryInspector, vm: *Vm) !void {
        _ = vm;
        self.memory_reads = 0;
        self.memory_writes = 0;
        self.max_memory_size = 0;
    }
    
    pub fn memory_read(self: *MemoryInspector, offset: u32, size: u32, data: []const u8) !void {
        _ = data;
        self.memory_reads += 1;
        self.max_memory_size = @max(self.max_memory_size, offset + size);
        
        std.log.debug("MEMORY READ: offset={} size={}", .{ offset, size });
    }
    
    pub fn memory_write(self: *MemoryInspector, offset: u32, data: []const u8) !void {
        self.memory_writes += 1;
        self.max_memory_size = @max(self.max_memory_size, offset + @as(u32, @intCast(data.len)));
        
        std.log.debug("MEMORY WRITE: offset={} size={}", .{ offset, data.len });
    }
    
    pub fn get_memory_stats(self: *const MemoryInspector) struct { reads: u64, writes: u64, max_size: u32 } {
        return .{
            .reads = self.memory_reads,
            .writes = self.memory_writes,
            .max_size = self.max_memory_size,
        };
    }
};

// Storage access tracker
pub const StorageInspector = struct {
    allocator: std.mem.Allocator,
    storage_reads: std.HashMap(Address, u64, AddressContext, std.hash_map.default_max_load_percentage),
    storage_writes: std.HashMap(Address, u64, AddressContext, std.hash_map.default_max_load_percentage),
    
    pub fn init(allocator: std.mem.Allocator) StorageInspector {
        return StorageInspector{
            .allocator = allocator,
            .storage_reads = std.HashMap(Address, u64, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
            .storage_writes = std.HashMap(Address, u64, AddressContext, std.hash_map.default_max_load_percentage).init(allocator),
        };
    }
    
    pub fn deinit(self: *StorageInspector) void {
        self.storage_reads.deinit();
        self.storage_writes.deinit();
    }
    
    pub fn initialize(self: *StorageInspector, vm: *Vm) !void {
        _ = vm;
        self.storage_reads.clearRetainingCapacity();
        self.storage_writes.clearRetainingCapacity();
    }
    
    pub fn storage_read(self: *StorageInspector, address: Address, key: U256, value: U256) !void {
        const existing = self.storage_reads.get(address) orelse 0;
        try self.storage_reads.put(address, existing + 1);
        
        std.log.debug("STORAGE READ: {} key=0x{x} value=0x{x}", .{ address, key, value });
    }
    
    pub fn storage_write(self: *StorageInspector, address: Address, key: U256, old_value: U256, new_value: U256) !void {
        const existing = self.storage_writes.get(address) orelse 0;
        try self.storage_writes.put(address, existing + 1);
        
        std.log.debug("STORAGE WRITE: {} key=0x{x} old=0x{x} new=0x{x}", .{ address, key, old_value, new_value });
    }
    
    pub fn get_reads_for_address(self: *const StorageInspector, address: Address) u64 {
        return self.storage_reads.get(address) orelse 0;
    }
    
    pub fn get_writes_for_address(self: *const StorageInspector, address: Address) u64 {
        return self.storage_writes.get(address) orelse 0;
    }
};

// Utility for opcode name lookup
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
        0x10 => "LT",
        0x11 => "GT",
        0x12 => "SLT",
        0x13 => "SGT",
        0x14 => "EQ",
        0x15 => "ISZERO",
        0x16 => "AND",
        0x17 => "OR",
        0x18 => "XOR",
        0x19 => "NOT",
        0x1A => "BYTE",
        0x1B => "SHL",
        0x1C => "SHR",
        0x1D => "SAR",
        0x20 => "KECCAK256",
        0x30 => "ADDRESS",
        0x31 => "BALANCE",
        0x32 => "ORIGIN",
        0x33 => "CALLER",
        0x34 => "CALLVALUE",
        0x35 => "CALLDATALOAD",
        0x36 => "CALLDATASIZE",
        0x37 => "CALLDATACOPY",
        0x38 => "CODESIZE",
        0x39 => "CODECOPY",
        0x3A => "GASPRICE",
        0x3B => "EXTCODESIZE",
        0x3C => "EXTCODECOPY",
        0x3D => "RETURNDATASIZE",
        0x3E => "RETURNDATACOPY",
        0x3F => "EXTCODEHASH",
        0x40 => "BLOCKHASH",
        0x41 => "COINBASE",
        0x42 => "TIMESTAMP",
        0x43 => "NUMBER",
        0x44 => "PREVRANDAO",
        0x45 => "GASLIMIT",
        0x46 => "CHAINID",
        0x47 => "SELFBALANCE",
        0x48 => "BASEFEE",
        0x49 => "BLOBHASH",
        0x4A => "BLOBBASEFEE",
        0x50 => "POP",
        0x51 => "MLOAD",
        0x52 => "MSTORE",
        0x53 => "MSTORE8",
        0x54 => "SLOAD",
        0x55 => "SSTORE",
        0x56 => "JUMP",
        0x57 => "JUMPI",
        0x58 => "PC",
        0x59 => "MSIZE",
        0x5A => "GAS",
        0x5B => "JUMPDEST",
        0x5C => "TLOAD",
        0x5D => "TSTORE",
        0x5E => "MCOPY",
        0x5F => "PUSH0",
        0x60...0x7F => "PUSH",
        0x80...0x8F => "DUP",
        0x90...0x9F => "SWAP",
        0xA0 => "LOG0",
        0xA1 => "LOG1",
        0xA2 => "LOG2",
        0xA3 => "LOG3",
        0xA4 => "LOG4",
        0xF0 => "CREATE",
        0xF1 => "CALL",
        0xF2 => "CALLCODE",
        0xF3 => "RETURN",
        0xF4 => "DELEGATECALL",
        0xF5 => "CREATE2",
        0xFA => "STATICCALL",
        0xFD => "REVERT",
        0xFE => "INVALID",
        0xFF => "SELFDESTRUCT",
        else => "UNKNOWN",
    };
}

// Address context for HashMap
const AddressContext = struct {
    pub fn hash(self: @This(), addr: Address) u64 {
        _ = self;
        return std.hash_map.hashString(addr.bytes[0..]);
    }
    
    pub fn eql(self: @This(), a: Address, b: Address) bool {
        _ = self;
        return std.mem.eql(u8, &a.bytes, &b.bytes);
    }
};
```

### Task 4: Integrate Inspector Framework with VM
File: `/src/evm/vm.zig` (modify existing)
```zig
const InspectorManager = @import("inspector/inspector_manager.zig").InspectorManager;
const Inspector = @import("inspector/inspector.zig").Inspector;
const StepContext = @import("inspector/inspector.zig").StepContext;
const CallContext = @import("inspector/inspector.zig").CallContext;

pub const Vm = struct {
    // Existing fields...
    inspector_manager: InspectorManager,
    
    pub fn init(allocator: std.mem.Allocator) !Vm {
        var vm = Vm{
            // Existing initialization...
            .inspector_manager = InspectorManager.init(allocator),
        };
        
        return vm;
    }
    
    pub fn deinit(self: *Vm) void {
        // Existing cleanup...
        self.inspector_manager.deinit();
    }
    
    pub fn add_inspector(self: *Vm, inspector: Inspector) !void {
        try self.inspector_manager.add_inspector(inspector);
    }
    
    pub fn remove_inspector(self: *Vm, inspector: Inspector) void {
        self.inspector_manager.remove_inspector(inspector);
    }
    
    pub fn execute_with_inspectors(
        self: *Vm,
        address: Address,
        input: []const u8,
        gas: u64
    ) !ExecutionResult {
        // Initialize inspectors
        try self.inspector_manager.initialize(self);
        
        // Execute normally with inspector hooks
        const result = try self.execute_internal(address, input, gas);
        
        // Finalize inspectors
        try self.inspector_manager.finalize(self);
        
        return result;
    }
    
    pub fn step_with_inspectors(
        self: *Vm,
        frame: *Frame,
        opcode: u8
    ) !ExecutionResult {
        // Create step context
        const step_context = StepContext{
            .vm = self,
            .frame = frame,
            .opcode = opcode,
            .pc = frame.pc,
            .gas_remaining = frame.gas_remaining,
            .gas_cost = self.calculate_gas_cost(frame, opcode),
            .depth = self.call_depth,
        };
        
        // Pre-execution inspector hook
        const action = try self.inspector_manager.step_start(&step_context);
        
        switch (action) {
            .Continue => {},
            .Skip => {
                frame.pc += 1;
                return ExecutionResult.continue_execution;
            },
            .Halt => return ExecutionResult.halt,
            .Revert => return ExecutionResult.revert,
        }
        
        // Execute the opcode
        const result = try self.execute_opcode(frame, opcode);
        
        // Post-execution inspector hook
        try self.inspector_manager.step_end(&step_context, result);
        
        return result;
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/inspector/inspector_test.zig`

### Test Cases
```zig
test "inspector framework initialization" {
    // Test inspector registration and management
    // Test multiple inspectors
    // Test inspector removal
}

test "step hooks" {
    // Test step_start and step_end hooks
    // Test inspector actions (Continue, Skip, Halt, Revert)
    // Test error handling in hooks
}

test "call hooks" {
    // Test call_start and call_end hooks
    // Test different call types
    // Test nested calls
}

test "memory and storage hooks" {
    // Test memory read/write hooks
    // Test storage read/write hooks
    // Test hook accuracy
}

test "builtin inspectors" {
    // Test LoggingInspector
    // Test GasInspector
    // Test MemoryInspector
    // Test StorageInspector
}

test "inspector composition" {
    // Test multiple inspectors working together
    // Test inspector precedence
    // Test error isolation
}

test "performance impact" {
    // Test overhead when no inspectors are active
    // Test performance with multiple inspectors
    // Test memory usage
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/inspector/inspector.zig` - Core inspector interface
- `/src/evm/inspector/inspector_manager.zig` - Inspector management
- `/src/evm/inspector/builtin_inspectors.zig` - Example inspectors
- `/src/evm/vm.zig` - VM integration with inspectors
- `/src/evm/execution/` - Add inspector hooks to operations
- `/test/evm/inspector/inspector_test.zig` - Comprehensive tests

## Success Criteria

1. **Pluggable Architecture**: Clean interface for external analyzers
2. **Complete Coverage**: Hooks for all major EVM operations
3. **Performance**: Zero overhead when no inspectors are active
4. **Composition**: Multiple inspectors work together seamlessly
5. **Error Isolation**: Inspector failures don't crash VM execution
6. **Ease of Use**: Simple API for implementing custom inspectors

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

#### 1. **Unit Tests** (`/test/evm/inspector/inspector_framework_test.zig`)
```zig
// Test basic inspector_framework functionality
test "inspector_framework basic functionality works correctly"
test "inspector_framework handles edge cases properly"
test "inspector_framework validates inputs appropriately"
test "inspector_framework produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "inspector_framework integrates with EVM properly"
test "inspector_framework maintains system compatibility"
test "inspector_framework works with existing components"
test "inspector_framework handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "inspector_framework meets performance requirements"
test "inspector_framework optimizes resource usage"
test "inspector_framework scales appropriately with load"
test "inspector_framework benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "inspector_framework meets specification requirements"
test "inspector_framework maintains EVM compatibility"
test "inspector_framework handles hardfork transitions"
test "inspector_framework cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "inspector_framework handles errors gracefully"
test "inspector_framework proper error propagation"
test "inspector_framework recovery from failure states"
test "inspector_framework validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "inspector_framework prevents security vulnerabilities"
test "inspector_framework handles malicious inputs safely"
test "inspector_framework maintains isolation boundaries"
test "inspector_framework validates security properties"
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
test "inspector_framework basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = inspector_framework.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const inspector_framework = struct {
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

- [Rust trait objects](https://doc.rust-lang.org/book/ch17-02-trait-objects.html) - Similar pattern
- [Zig interfaces](https://zig.guide/language-basics/interfaces) - Zig interface patterns
- [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) - Design pattern reference
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
...
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
#include <intx/intx.hpp>
#include <exception>
#include <memory>
#include <string>
#include <vector>

namespace evmone
{
...
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
...
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

    ExecutionState() noexcept = default;

    ExecutionState(const evmc_message& message, evmc_revision revision,
        const evmc_host_interface& host_interface, evmc_host_context* host_ctx,
        bytes_view _code) noexcept
      : msg{&message}, host{host_interface, host_ctx}, rev{revision}, original_code{_code}
    {}
...
};
}
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
...
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
}
...
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_execution.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2020 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
...
namespace evmone::baseline
{
namespace
{
...
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
...
} // namespace

evmc_result execute(VM& vm, const evmc_host_interface& host, evmc_host_context* ctx,
    evmc_revision rev, const evmc_message& msg, const CodeAnalysis& analysis) noexcept
{
    ...
    auto* tracer = vm.get_tracer();
    if (INTX_UNLIKELY(tracer != nullptr))
    {
        tracer->notify_execution_start(state.rev, *state.msg, code);
        gas = dispatch<true>(cost_table, state, gas, code_begin, tracer);
    }
    ...
    const auto result = ...

    if (INTX_UNLIKELY(tracer != nullptr))
        tracer->notify_execution_end(result);

    return result;
}
...
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/state/host.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2022 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "host.hpp"
#include "precompiles.hpp"
#include <evmone/constants.hpp>
#include <evmone/eof.hpp>

namespace evmone::state
{
...
evmc_storage_status Host::set_storage(
    const address& addr, const bytes32& key, const bytes32& value) noexcept
{
    // In Berlin this is handled in access_storage().
    if (m_rev < EVMC_BERLIN)
        m_state.journal_storage_change(addr, key, storage_slot);
    storage_slot.current = value;  // Update current value.
    return status;
}

bool Host::selfdestruct(const address& addr, const address& beneficiary) noexcept
{
    ...
    if (!acc.destructed)
    {
        m_state.journal_destruct(addr);
        acc.destructed = true;
        return true;
    }
    return false;
}

evmc::Result Host::call(const evmc_message& orig_msg) noexcept
{
    const auto msg = prepare_message(orig_msg);
    if (!msg.has_value())
        return evmc::Result{EVMC_FAILURE, orig_msg.gas};  // Light exception.

    const auto logs_checkpoint = m_logs.size();
    const auto state_checkpoint = m_state.checkpoint();

    auto result = execute_message(*msg);

    if (result.status_code != EVMC_SUCCESS)
    {
        ...
        // Revert.
        m_state.rollback(state_checkpoint);
        m_logs.resize(logs_checkpoint);
        ...
    }
    return result;
}

void Host::emit_log(const address& addr, const uint8_t* data, size_t data_size,
    const bytes32 topics[], size_t topics_count) noexcept
{
    m_logs.push_back({addr, {data, data_size}, {topics, topics + topics_count}});
}
...
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/include/evmone/vm.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2021 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include "execution_state.hpp"
#include "tracing.hpp"
#include <evmc/evmc.h>
#include <vector>

...
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
</evmone>
<PromptCorrections>
The Zig implementation in the prompt defines `storage_write` with `old_value` and `new_value`. The `evmone` equivalent in `Host::set_storage` returns an `evmc_storage_status` enum which contains more detailed information about the state transition (e.g., `EVMC_STORAGE_ADDED`, `EVMC_STORAGE_MODIFIED_DELETED`). This is a more expressive pattern than just providing old/new values and might be worth considering for the Zig implementation for more detailed tracing. The current Zig implementation would need to derive the old value from a host call before the new value is set.
</PromptCorrections>



## REVM Context

An excellent and well-structured prompt. The request to implement a pluggable inspector framework is a core feature for any modern EVM, and referencing `revm`'s design is a solid approach. The following `revm` code snippets provide direct reference implementations for the `Inspector` trait, its integration into the execution loop, and the management of call/create frames.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/inspector/src/inspector.rs">
```rust
//! Inspector trait definition.
use auto_impl::auto_impl;
use context::{Database, Journal, JournalEntry};
use interpreter::{
    interpreter::EthInterpreter, CallInputs, CallOutcome, CreateInputs, CreateOutcome,
    EOFCreateInputs, Interpreter, InterpreterTypes,
};
use primitives::{Address, Log, U256};
use state::EvmState;

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
    
    // ... selfdestruct hook ...
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
//! This file contains the main inspector handler logic.

// ... imports ...

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

// ... other functions ...

pub fn frame_start<CTX, INTR: InterpreterTypes>(
    context: &mut CTX,
    inspector: &mut impl Inspector<CTX, INTR>,
    frame_input: &mut FrameInput,
) -> Option<FrameResult> {
    match frame_input {
        FrameInput::Call(i) => {
            if let Some(output) = inspector.call(context, i) {
                return Some(FrameResult::Call(output));
            }
        }
        FrameInput::Create(i) => {
            if let Some(output) = inspector.create(context, i) {
                return Some(FrameResult::Create(output));
            }
        }
        FrameInput::EOFCreate(i) => {
            if let Some(output) = inspector.eofcreate(context, i) {
                return Some(FrameResult::EOFCreate(output));
            }
        }
    }
    None
}

pub fn frame_end<CTX, INTR: InterpreterTypes>(
    context: &mut CTX,
    inspector: &mut impl Inspector<CTX, INTR>,
    frame_input: &FrameInput,
    frame_output: &mut FrameResult,
) {
    match frame_output {
        FrameResult::Call(outcome) => {
            let FrameInput::Call(i) = frame_input else {
                panic!("FrameInput::Call expected");
            };
            inspector.call_end(context, i, outcome);
        }
        FrameResult::Create(outcome) => {
            let FrameInput::Create(i) = frame_input else {
                panic!("FrameInput::Create expected");
            };
            inspector.create_end(context, i, outcome);
        }
        FrameResult::EOFCreate(outcome) => {
            let FrameInput::EOFCreate(i) = frame_input else {
                panic!("FrameInput::EofCreate expected");
            };
            inspector.eofcreate_end(context, i, outcome);
        }
    }
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
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter_action/create_inputs.rs">
```rust
//! Create inputs.
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

// ... imports ...

#[repr(u8)]
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum InstructionResult {
    // ... success codes ...
    #[default]
    Continue = 0x00,
    Stop,
    Return,
    SelfDestruct,
    // ... revert codes ...
    Revert = 0x10,
    // ... action codes ...
    CallOrCreate = 0x20,
    // ... error codes ...
    OutOfGas = 0x50,
    OpcodeNotFound,
    InvalidJump,
    StackOverflow,
    // ... and many more
}

// ... impls ...

impl InstructionResult {
    /// Returns whether the result is a success.
    #[inline]
    pub const fn is_ok(self) -> bool {
        matches!(self, crate::return_ok!())
    }

    /// Returns whether the result is a continue.
    #[inline]
    pub const fn is_continue(self) -> bool {
        matches!(self, InstructionResult::Continue)
    }

    /// Returns whether the result is a revert.
    #[inline]
    pub const fn is_revert(self) -> bool {
        matches!(self, crate::return_revert!())
    }

    /// Returns whether the result is an error.
    #[inline]
    pub const fn is_error(self) -> bool {
        matches!(self, return_error!())
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/inspector/src/noop.rs">
```rust
//! No-op inspector.
use crate::inspector::Inspector;
use interpreter::InterpreterTypes;

/// Dummy [Inspector], helpful as standalone replacement.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct NoOpInspector;

impl<CTX, INTR: InterpreterTypes> Inspector<CTX, INTR> for NoOpInspector {}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/inspector/src/gas.rs">
```rust
//! GasInspector. Helper Inspector to calculate gas for others.
use interpreter::{CallOutcome, CreateOutcome, Gas};

/// Helper that keeps track of gas.
#[allow(dead_code)]
#[derive(Clone, Copy, Debug)]
pub struct GasInspector {
    gas_remaining: u64,
    last_gas_cost: u64,
}

impl Default for GasInspector {
    fn default() -> Self {
        Self::new()
    }
}

impl GasInspector {
    /// Returns the remaining gas.
    #[inline]
    pub fn gas_remaining(&self) -> u64 {
        self.gas_remaining
    }

    /// Returns the last gas cost.
    #[inline]
    pub fn last_gas_cost(&self) -> u64 {
        self.last_gas_cost
    }

    /// Create a new gas inspector.
    pub fn new() -> Self {
        Self {
            gas_remaining: 0,
            last_gas_cost: 0,
        }
    }

    /// Sets remaining gas to gas limit.
    #[inline]
    pub fn initialize_interp(&mut self, gas: &Gas) {
        self.gas_remaining = gas.limit();
    }

    /// Sets the remaining gas.
    #[inline]
    pub fn step(&mut self, gas: &Gas) {
        self.gas_remaining = gas.remaining();
    }

    /// calculate last gas cost and remaining gas.
    #[inline]
    pub fn step_end(&mut self, gas: &mut Gas) {
        let remaining = gas.remaining();
        self.last_gas_cost = self.gas_remaining.saturating_sub(remaining);
        self.gas_remaining = remaining;
    }

    // ... call_end and create_end hooks to manage gas on failure ...
}
```
</file>
</revm>



## EXECUTION-SPECS Context

An analysis of the `execution-specs` codebase reveals a tracing mechanism that is highly relevant to implementing an inspector framework. The core components are the `TraceEvent`s and the `evm_trace` function, which are called at various points during EVM execution. These locations are ideal for integrating the requested inspector hooks.

The following snippets highlight the most relevant parts of the `execution-specs` that demonstrate where and how to hook into the EVM lifecycle.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
# src/ethereum/london/vm/interpreter.py
# This file contains the main execution loop of the EVM. It's the most
# critical location for placing hooks like `step_start`, `step_end`,
# and `execution_error`.

def execute_code(message: Message) -> Evm:
    # ... (initialization of evm object)

    try:
        # This pre-compiled contract check is a good place to add a `call_start`
        # hook for precompiles.
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            evm_trace(evm, PrecompileStart(evm.message.code_address))
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            evm_trace(evm, PrecompileEnd())
            return evm

        # This is the main execution loop.
        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            # The `step_start` hook should be placed here, before opcode execution.
            # The `evm_trace` call with `OpStart` confirms this is the correct location.
            # The `evm` object contains all the context needed for `StepContext`.
            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            # The `step_end` hook should be placed here, after opcode execution.
            evm_trace(evm, OpEnd())

        # ...

    # This exception handling block is where an `execution_error` hook
    # should be placed. The `error` object contains the information for `ErrorInfo`.
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
# src/ethereum/trace.py
# This file defines the existing tracing infrastructure, which is a perfect
# analogue for an inspector framework. The various `TraceEvent` types
# directly map to the desired inspector hooks.

from typing import Optional, Union

# ... (other imports)

# These dataclasses define the context available at each event (hook).
# They are analogous to the `StepContext`, `CallContext`, and `ErrorInfo`
# structs in the prompt.

@dataclass
class OpStart:
    """
    Trace event that is triggered before executing an opcode.
    Maps to `step_start`.
    """
    op: enum.Enum

@dataclass
class OpEnd:
    """
    Trace event that is triggered after executing an opcode.
    Maps to `step_end`.
    """

@dataclass
class OpException:
    """
    Trace event that is triggered when an opcode raises an exception.
    Maps to `execution_error`.
    """
    error: Exception

@dataclass
class TransactionStart:
    """
    Trace event that is triggered at the start of a transaction.
    Maps to `initialize`.
    """

@dataclass
class TransactionEnd:
    """
    Trace event that is triggered at the end of a transaction.
    Maps to `finalize`.
    """
    gas_used: int
    output: Bytes
    error: Optional[EthereumException]

# ... (other event types)

# The `TraceEvent` union shows all possible hook points.
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

# The `evm_trace` function is the global dispatcher, similar to how an
# `InspectorManager` would call all registered inspectors.
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/system.py">
```python
# src/ethereum/london/vm/instructions/system.py
# This file shows the implementation of CALL, CREATE, and SELFDESTRUCT,
# which are key locations for inspector hooks.

# The `generic_call` function is the core logic for all CALL-like opcodes.
# This is the ideal place to insert `call_start` and `call_end` hooks.
def generic_call(
    evm: Evm,
    gas: Uint,
    value: U256,
    caller: Address,
    to: Address,
    code_address: Address,
    should_transfer_value: bool,
    is_staticcall: bool,
    # ... (memory arguments)
) -> None:
    # ...
    from ...vm.interpreter import STACK_DEPTH_LIMIT, process_message

    # A `call_start` hook would go here, before the child message is processed.
    # The `Message` object contains all context for the `CallContext` struct.
    child_message = Message(
        # ...
    )
    child_evm = process_message(child_message)

    # A `call_end` hook would go here, after the child message is processed.
    # `child_evm` contains the result of the call.
    if child_evm.error:
        incorporate_child_on_error(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(0))
    else:
        incorporate_child_on_success(evm, child_evm)
        evm.return_data = child_evm.output
        push(evm.stack, U256(1))

    # ...


def selfdestruct(evm: Evm) -> None:
    """
    Halt execution and register account for later deletion.
    """
    beneficiary = to_address(pop(evm.stack))
    originator = evm.message.current_target

    # The `selfdestruct` hook should be placed here, before the state is
    # modified, capturing the originator and beneficiary addresses.
    # ... (gas calculation and state modification)

    # register account for deletion
    evm.accounts_to_delete.add(originator)

    # HALT the execution
    evm.running = False
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/log.py">
```python
# src/ethereum/london/vm/instructions/log.py
# This file implements the LOG* opcodes.

def log_n(evm: Evm, num_topics: int) -> None:
    """
    Appends a log entry, having `num_topics` topics, to the evm logs.
    """
    # ... (stack and gas logic)
    
    # The `log_emitted` hook should be placed here.
    # The `Log` object is created with all necessary context.
    log_entry = Log(
        address=evm.message.current_target,
        topics=tuple(topics),
        data=memory_read_bytes(evm.memory, memory_start_index, size),
    )

    evm.logs = evm.logs + (log_entry,)
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/storage.py">
```python
# src/ethereum/london/vm/instructions/storage.py
# This file implements the SLOAD and SSTORE opcodes, which are the
# locations for the `storage_read` and `storage_write` hooks.

def sload(evm: Evm) -> None:
    """
    Loads to the stack, the value corresponding to a certain key from the
    storage of the current account.
    """
    key = pop(evm.stack).to_be_bytes32()
    # ... (gas logic)

    # The `storage_read` hook goes here, after getting the value.
    value = get_storage(
        evm.message.block_env.state, evm.message.current_target, key
    )

    push(evm.stack, value)
    # ...

def sstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's storage.
    """
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)
    # ... (gas logic)

    # `storage_write` hook would go here. We have access to the address
    # (evm.message.current_target), key, new_value, and can get the old_value.
    current_value = get_storage(state, evm.message.current_target, key)
    set_storage(state, evm.message.current_target, key, new_value)
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/memory.py">
```python
# src/ethereum/london/vm/memory.py
# This file provides the memory operations. `memory_read_bytes` and
# `memory_write` are the ideal places to insert `memory_read` and
# `memory_write` hooks, respectively.

def memory_write(
    memory: bytearray, start_position: U256, value: Bytes
) -> None:
    """
    Writes to memory. A `memory_write` hook should be placed here.
    """
    memory[start_position : int(start_position) + len(value)] = value


def memory_read_bytes(
    memory: bytearray, start_position: U256, size: U256
) -> bytearray:
    """
    Read bytes from memory. A `memory_read` hook should be placed here.
    """
    return memory[start_position : Uint(start_position) + Uint(size)]
```
</file>
</execution-specs>
```

In []:
**Our current Zig EVM implementation does not have an inspector framework.** The following snippets are from the `execution-specs` codebase and show the ideal integration points for the inspector hooks.

## `src/ethereum/trace.py`
This file is the most direct reference for an inspector framework. It defines `TraceEvent`s that map directly to the desired inspector hooks and an `evm_trace` function that acts as a central dispatcher, similar to an `InspectorManager`.

```python
@dataclass
class OpStart:
    """
    Trace event that is triggered before executing an opcode.
    Maps to `step_start`.
    """
    op: enum.Enum

@dataclass
class OpEnd:
    """
    Trace event that is triggered after executing an opcode.
    Maps to `step_end`.
    """

@dataclass
class OpException:
    """
    Trace event that is triggered when an opcode raises an exception.
    Maps to `execution_error`.
    """
    error: Exception

@dataclass
class TransactionStart:
    """
    Trace event that is triggered at the start of a transaction.
    Maps to `initialize`.
    """

@dataclass
class TransactionEnd:
    """
    Trace event that is triggered at the end of a transaction.
    Maps to `finalize`.
    """
    gas_used: int
    output: Bytes
    error: Optional[EthereumException]

# The `TraceEvent` union shows all possible hook points.
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
```

## `src/ethereum/london/vm/interpreter.py`
This file contains the main execution loop (`execute_code`) and call/create logic, showing precisely where to integrate the inspector hooks.

```python
def execute_code(message: Message) -> Evm:
    # ... (initialization of evm object)

    try:
        # Pre-compiled contract check: a good place for a `call_start` hook.
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            evm_trace(evm, PrecompileStart(evm.message.code_address))
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            evm_trace(evm, PrecompileEnd())
            return evm

        # Main execution loop.
        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            # `step_start` hook here. `evm` object provides all needed context.
            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            # `step_end` hook here.
            evm_trace(evm, OpEnd())

    # `execution_error` hook here.
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

## `src/ethereum/london/vm/instructions/system.py`
This file implements `CALL`, `CREATE`, and `SELFDESTRUCT`, which are key locations for inspector hooks.

```python
def generic_call(
    evm: Evm,
    gas: Uint,
    value: U256,
    caller: Address,
    to: Address,
    # ... other parameters
) -> None:
    from ...vm.interpreter import STACK_DEPTH_LIMIT, process_message

    # `call_start` hook goes here. `Message` contains context for `CallContext`.
    child_message = Message(
        # ...
    )
    child_evm = process_message(child_message)

    # `call_end` hook goes here. `child_evm` contains the result.
    if child_evm.error:
        # ...
    else:
        # ...

def selfdestruct(evm: Evm) -> None:
    beneficiary = to_address(pop(evm.stack))
    originator = evm.message.current_target

    # `selfdestruct` hook goes here, capturing originator and beneficiary.
    # ... (state modification)
    evm.accounts_to_delete.add(originator)
    evm.running = False
```

## `src/ethereum/london/vm/instructions/log.py`
This file implements the `LOG*` opcodes, which is where the `log_emitted` hook belongs.

```python
def log_n(evm: Evm, num_topics: int) -> None:
    # ... (stack and gas logic)
    
    # `log_emitted` hook goes here. `Log` object is created with full context.
    log_entry = Log(
        address=evm.message.current_target,
        topics=tuple(topics),
        data=memory_read_bytes(evm.memory, memory_start_index, size),
    )

    evm.logs = evm.logs + (log_entry,)
```

## `src/ethereum/london/vm/instructions/storage.py`
This file implements `SLOAD` and `SSTORE`, providing the locations for `storage_read` and `storage_write` hooks.

```python
def sload(evm: Evm) -> None:
    key = pop(evm.stack).to_be_bytes32()
    # ... (gas logic)

    # `storage_read` hook goes here.
    value = get_storage(
        evm.message.block_env.state, evm.message.current_target, key
    )
    push(evm.stack, value)

def sstore(evm: Evm) -> None:
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)
    # ... (gas logic)

    # `storage_write` hook goes here.
    # `current_value` and `new_value` are both available.
    current_value = get_storage(state, evm.message.current_target, key)
    set_storage(state, evm.message.current_target, key, new_value)
```

## `src/ethereum/london/vm/memory.py`
This file provides memory operations, ideal for placing `memory_read` and `memory_write` hooks.

```python
def memory_write(
    memory: bytearray, start_position: U256, value: Bytes
) -> None:
    """
    A `memory_write` hook should be placed here.
    """
    memory[start_position : int(start_position) + len(value)] = value


def memory_read_bytes(
    memory: bytearray, start_position: U256, size: U256
) -> bytearray:
    """
    A `memory_read` hook should be placed here.
    """
    return memory[start_position : Uint(start_position) + Uint(size)]
```

## `src/ethereum/london/vm/__init__.py`
This file defines the `Evm` and `Message` data classes, which are the primary sources of context for the inspector hooks.

```python
@dataclass
class Evm:
    """The internal state of the virtual machine."""

    pc: Uint
    stack: List[U256]
    memory: bytearray
    code: Bytes
    gas_left: Uint
    # ... other fields

@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """
    caller: Address
    target: Union[Bytes0, Address]
    current_target: Address
    gas: Uint
    value: U256
    data: Bytes
    # ... other fields
```

These snippets from `execution-specs` provide a clear blueprint for integrating a comprehensive inspector framework into the Zig EVM, ensuring compatibility with established patterns.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/arrow_glacier/vm/__init__.py">
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
    touched_accounts: Set[Address]
    return_data: Bytes
    error: Optional[EthereumException]
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]


def incorporate_child_on_success(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of a successful `child_evm` into the parent `evm`.

    Parameters
    ----------
    evm :
        The parent `EVM`.
    child_evm :
        The child evm to incorporate.
    """
    evm.gas_left += child_evm.gas_left
    evm.logs += child_evm.logs
    evm.refund_counter += child_evm.refund_counter
    evm.accounts_to_delete.update(child_evm.accounts_to_delete)
    evm.touched_accounts.update(child_evm.touched_accounts)
    if account_exists_and_is_empty(
        evm.message.block_env.state, child_evm.message.current_target
    ):
        evm.touched_accounts.add(child_evm.message.current_target)
    evm.accessed_addresses.update(child_evm.accessed_addresses)
    evm.accessed_storage_keys.update(child_evm.accessed_storage_keys)


def incorporate_child_on_error(evm: Evm, child_evm: Evm) -> None:
    """
    Incorporate the state of an unsuccessful `child_evm` into the parent `evm`.

    Parameters
    ----------
    evm :
        The parent `EVM`.
    child_evm :
        The child evm to incorporate.
    """
    # In block 2675119, the empty account at 0x3 (the RIPEMD160 precompile) was
    # cleared despite running out of gas. This is an obscure edge case that can
    # only happen to a precompile.
    # According to the general rules governing clearing of empty accounts, the
    # touch should have been reverted. Due to client bugs, this event went
    # unnoticed and 0x3 has been exempted from the rule that touches are
    # reverted in order to preserve this historical behaviour.
    if RIPEMD160_ADDRESS in child_evm.touched_accounts:
        evm.touched_accounts.add(RIPEMD160_ADDRESS)
    if child_evm.message.current_target == RIPEMD160_ADDRESS:
        if account_exists_and_is_empty(
            evm.message.block_env.state, child_evm.message.current_target
        ):
            evm.touched_accounts.add(RIPEMD160_ADDRESS)
    evm.gas_left += child_evm.gas_left
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/arrow_glacier/vm/interpreter.py">
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

        # This is the main execution loop. The inspector's `step` hooks
        # should be called at the beginning and end of this loop.
        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            # The `OpStart` trace is equivalent to the `step_start` inspector hook.
            # It provides access to the entire `evm` object before instruction execution.
            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            # The `OpEnd` trace is equivalent to the `step_end` inspector hook.
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    # The exception handling block is where an `execution_error` hook would be called.
    except ExceptionalHalt as error:
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        evm_trace(evm, OpException(error))
        evm.error = error
    return evm

def process_message(message: Message) -> Evm:
    """
    Move ether and execute the relevant code.
    This function represents the start of a call frame, making it a
    suitable place to trigger a `call_start` hook.
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
    # The end of this function is where a `call_end` hook would be triggered,
    # after the state has been committed or reverted.
    if evm.error:
        # revert state to the last saved checkpoint
        # since the message call resulted in an error
        rollback_transaction(state)
    else:
        commit_transaction(state)
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/arrow_glacier/vm/instructions/system.py">
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
    A `call_start` hook would be triggered before creating the `child_message`.
    A `call_end` hook would be triggered after `process_message` returns.
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

def selfdestruct(evm: Evm) -> None:
    """
    Halt execution and register account for later deletion.
    The `selfdestruct` inspector hook should be called here, before halting.
    """
    # ... (gas calculation)

    # register account for deletion
    evm.accounts_to_delete.add(originator)

    # ... (state modifications)

    # HALT the execution
    evm.running = False
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/arrow_glacier/state.py">
```python
def begin_transaction(state: State) -> None:
    """
    Start a state transaction.
    This corresponds to the beginning of a call frame, relevant for `call_start`.
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
    This corresponds to a successful end of a call frame, relevant for `call_end`.
    """
    state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()


def rollback_transaction(state: State) -> None:
    """
    Rollback a state transaction.
    This corresponds to an unsuccessful end of a call frame, relevant for `call_end`.
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

def get_storage(state: State, address: Address, key: Bytes32) -> U256:
    """
    Get a value at a storage key on an account.
    This is the hook point for `storage_read`.
    """
    # ...
    value = trie_get(trie, key)
    # ...
    return value


def set_storage(
    state: State, address: Address, key: Bytes32, value: U256
) -> None:
    """
    Set a value at a storage key on an account.
    This is the hook point for `storage_write`.
    """
    # ...
    trie_set(trie, key, value)
    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/arrow_glacier/vm/instructions/log.py">
```python
def log_n(evm: Evm, num_topics: int) -> None:
    """
    Appends a log entry, having `num_topics` topics, to the evm logs.
    The `log_emitted` hook would be called here.
    """
    # ... (stack and gas logic) ...

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    if evm.message.is_static:
        raise WriteInStaticContext
    log_entry = Log(
        address=evm.message.current_target,
        topics=tuple(topics),
        data=memory_read_bytes(evm.memory, memory_start_index, size),
    )

    evm.logs = evm.logs + (log_entry,)

    # ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/arrow_glacier/vm/memory.py">
```python
def memory_write(
    memory: bytearray, start_position: U256, value: Bytes
) -> None:
    """
    Writes to memory.
    The `memory_write` hook would be called here.
    """
    memory[start_position : int(start_position) + len(value)] = value


def memory_read_bytes(
    memory: bytearray, start_position: U256, size: U256
) -> bytearray:
    """
    Read bytes from memory.
    The `memory_read` hook would be called here.
    """
    return memory[start_position : Uint(start_position) + Uint(size)]
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/trace.py">
```python
"""
Tracing tools for logging EVM execution.
This entire module provides an example of a simple inspector/tracer.
"""
# ... (Dataclass definitions for Start, End, Gas, etc.) ...

def evm_trace(evm: Evm, trace_type: object) -> None:
    """
    Record a trace of the execution of the EVM.
    """
    if evm.message.tx_env.traces is not None:
        if isinstance(trace_type, OpStart):
            # This shows what information is available at the `step_start` hook point.
            trace = {
                "pc": int(evm.pc),
                "op": trace_type.op.name,
                "gas": str(evm.gas_left),
                "stack": [str(item) for item in evm.stack],
                "memory": evm.memory.hex(),
                "depth": int(evm.message.depth),
            }
            evm.message.tx_env.traces.append(trace)
        # ... (other trace types like OpEnd, OpException, etc.) ...
```
</file>
</execution-specs>

## Prompt Corrections
The provided prompt is of high quality and does not contain significant errors. The architecture proposed is sound and aligns well with established patterns in other EVM implementations like REVM and Geth. The "Production-Ready Inspector Patterns" section provides excellent high-level guidance. The extracted `execution-specs` code above serves to ground these patterns in the concrete, step-by-step logic of the EVM as defined in the specification, reinforcing the proposed hook points.

A minor clarification:
- The prompt's `StepContext` includes `gas_cost`, which is calculated *before* an instruction executes. The `execution-specs` `trace.py` shows that for `OpStart`, they trace `gas` (which is `gas_left` before the instruction) but not the cost. The cost is calculated within the instruction implementation (see `charge_gas`). Including `gas_cost` in the `StepContext` is a valid and useful design choice, but it's worth noting it requires pre-calculating the gas cost for the upcoming instruction, which the core `execution-specs` interpreter does within each `op_` function rather than before it. This is a minor implementation detail and does not affect the overall correctness of the prompt.



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/hooks.go">
```go
// Copyright 2024 The go-ethereum Authors
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
// along with go-ethereum. If not, see <http://www.gnu.org/licenses/>.

// Package tracing defines hooks for 'live tracing' of block processing and transaction
// execution. Here we define the low-level [Hooks] object that carries hooks which are
// invoked by the go-ethereum core at various points in the state transition.
//
// To create a tracer that can be invoked with Geth, you need to register it using
// [github.com/ethereum/go-ethereum/eth/tracers.LiveDirectory.Register].
//
// See https://geth.ethereum.org/docs/developers/evm-tracing/live-tracing for a tutorial.
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
	//
	// Take note that EnterHook, when in the context of a live tracer, can be invoked
	// outside of the `OnTxStart` and `OnTxEnd` hooks when dealing with system calls,
	// see [OnSystemCallStartHook] and [OnSystemCallEndHook] for more information.
	EnterHook = func(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// ExitHook is invoked when the processing of a message ends.
	// `revert` is true when there was an error during the execution.
	// Exceptionally, before the homestead hardfork a contract creation that
	// ran out of gas when attempting to persist the code to database did not
	// count as a call failure and did not cause a revert of the call. This will
	// be indicated by `reverted == false` and `err == ErrCodeStoreOutOfGas`.
	//
	// Take note that ExitHook, when in the context of a live tracer, can be invoked
	// outside of the `OnTxStart` and `OnTxEnd` hooks when dealing with system calls,
	// see [OnSystemCallStartHook] and [OnSystemCallEndHook] for more information.
	ExitHook = func(depth int, output []byte, gasUsed uint64, err error, reverted bool)

	// OpcodeHook is invoked just prior to the execution of an opcode.
	OpcodeHook = func(pc uint64, op byte, gas, cost uint64, scope OpContext, rData []byte, depth int, err error)

	// FaultHook is invoked when an error occurs during the execution of an opcode.
	FaultHook = func(pc uint64, op byte, gas, cost uint64, scope OpContext, depth int, err error)

	// GasChangeHook is invoked when the gas changes.
	GasChangeHook = func(old, new uint64, reason GasChangeReason)

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

	// LogHook is called when a log is emitted.
	LogHook = func(log *types.Log)
)

// Hooks is a container for all hooks that can be attached to the core.
// These hooks are still under development and might change in the future.
// When a hook is not set, it is simply ignored.
type Hooks struct {
	// VM events
	OnTxStart   TxStartHook
	OnTxEnd     TxEndHook
	OnEnter     EnterHook
	OnExit      ExitHook
	OnOpcode    OpcodeHook
	OnFault     FaultHook
	OnGasChange GasChangeHook
	// ... (other hooks like chain events omitted for brevity)
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
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interfaces.go">
```go
// Tracer is an interface to trace execution of EVM.
//
// It is the old tracer API, and is being replaced by the Hooks struct.
//
// Capturing state transitions can be done with the following methods:
//
// - CaptureStart: The execution of a new transaction starts.
// - CaptureState: A new opcode is about to be executed.
// - CaptureFault: An error has occurred during the execution of an opcode.
// - CaptureEnd: The execution of a transaction has failed.
//
// Capturing the scope requires the following methods:
//
// - CaptureEnter: Entering a new scope (via call, create or selfdestruct).
// - CaptureExit: Exiting a scope.
type Tracer interface {
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	CaptureEnd(output []byte, gasUsed uint64, err error)
	CaptureEnter(typ int, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	CaptureExit(output []byte, gasUsed uint64, err error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run runs the given contract's code with the given input data and returns the
// return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for
// errExecutionReverted which means revert-and-keep-gas-left.
func (in *Interpreter) Run(contract *Contract, input []byte, static bool) (ret []byte, err error) {
	// ... (initialization)

	// Don't bother with the execution loop if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	// Main loop
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
		// For optimisation, we have a stack index for the top of the stack.
		stackidx int
	)
	// The Interpreter main run loop. Note that we're using goto statements to
	// avoid nested logic for calculating jump destinations.
	for {
		// ... (gas checks)

		// Get the operation from the jump table and validate the stack to ensure there are
		// enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := in.opFn(op)
		// ... (stack validation)

		// If the operation is valid, Capture the state via the tracer
		if in.tracer != nil {
			in.tracer.CaptureState(pc, op, gas, cost, callContext, in.readOnly, int(in.depth), err)
		}
		// Execute the operation
		res, err = operation(pc, in, callContext)
		// ... (error handling)

		pc++
	}

	// ... (different loop exit conditions like STOP, RETURN, REVERT)

fault:
	// Handle an error by capturing it with the tracer and returning it.
	if err != nil {
		if in.tracer != nil {
			in.tracer.CaptureFault(pc, op, gas, cost, callContext, int(in.depth), err)
		}
	}
	return ret, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// Copyright 2018 The go-ethereum Authors
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

package logger

import (
	"encoding/json"
	"io"
	"math/big"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/eth/tracers"
	"github.comcom/holiman/uint256"
)

func init() {
	tracers.DefaultDirectory.Register("structLogger", newStructLogger)
}

// StructLogger is a tracer that collects all structured logs during the execution of a
// transaction and returns them as a JSON object.
//
// This logger is the old implementation and is being replaced by the Hooks struct.
// It is only kept around for backwards compatibility with the old tracers.
type StructLogger struct {
	env         *tracing.VMContext
	cfg         *Config
	storage     map[common.Address]types.Storage
	logs        []*StructLog
	output      []byte
	err         error
	reverted    bool
	gas         uint64
	frameData   *callFrameData
	callFrames  *CallFrame
	callStack   []*callFrameData
	interrupt   atomic.Bool
	reason      error
	mu          sync.Mutex
	currentTime int64
}

// ... (other methods)

// OnOpcode is called before the execution of an opcode.
func (l *StructLogger) OnOpcode(pc uint64, op byte, gas, cost uint64, scope tracing.OpContext, rData []byte, depth int, err error) {
	if l.cfg.EnableCallFrames {
		l.frameData.lastOp = op
	}
	l.capture(pc, op, gas, cost, scope, rData, depth, err)
}

// capture captures the system state at a certain point in time.
func (l *StructLogger) capture(pc uint64, op byte, gas, cost uint64, scope tracing.OpContext, rData []byte, depth int, err error) {
	// ... (interrupt and size limit checks)

	// memory
	var memory []byte
	if l.cfg.EnableMemory {
		memory = make([]byte, len(scope.MemoryData()))
		copy(memory, scope.MemoryData())
	}

	// stack
	var stack []uint256.Int
	if !l.cfg.DisableStack {
		stack = make([]uint256.Int, len(scope.StackData()))
		copy(stack, scope.StackData())
	}
	// return data
	var returnData []byte
	if l.cfg.EnableReturnData {
		returnData = make([]byte, len(rData))
		copy(returnData, rData)
	}

	// storage
	var storage map[common.Hash]common.Hash
	if !l.cfg.DisableStorage {
		// get statedb
		statedb := l.env.StateDB
		// get storage of current contract, if any
		if l.storage[scope.Address()] == nil {
			l.storage[scope.Address()] = make(types.Storage)
		}
		// no need to copy, we're not using these maps concurrently
		storage = l.storage[scope.Address()]
		// if the current opcode is one of SLOAD, SSTORE, SMOD, read/write into storage and update
		switch op {
		case 0x54: // SLOAD
			if len(scope.StackData()) >= 1 {
				var key common.Hash
				scope.StackData()[len(scope.StackData())-1].WriteToSlice(key[:])
				storage[key] = statedb.GetState(scope.Address(), key)
			}
		case 0x55: // SSTORE
			if len(scope.StackData()) >= 2 {
				var key common.Hash
				scope.StackData()[len(scope.StackData())-1].WriteToSlice(key[:])
				storage[key] = statedb.GetState(scope.Address(), key)
			}
		case 0x5d: // TSTORE
			if len(scope.StackData()) >= 2 {
				var key common.Hash
				scope.StackData()[len(scope.StackData())-1].WriteToSlice(key[:])
				storage[key] = statedb.GetTransientState(scope.Address(), key)
			}
		}
	}
	var errString string
	if err != nil {
		errString = err.Error()
	}
	log := &StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Memory:     memory,
		MemorySize: len(scope.MemoryData()),
		Stack:      stack,
		ReturnData: returnData,
		Storage:    storage,
		Depth:      depth,
		Err:        errString,
	}
	l.logs = append(l.logs, log)
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
	if hooks == nil {
		return nil, fmt.Errorf("wrapping nil tracer")
	}
	// No state change to journal, return the wrapped hooks as is
	if hooks.OnBalanceChange == nil && hooks.OnNonceChange == nil && hooks.OnNonceChangeV2 == nil && hooks.OnCodeChange == nil && hooks.OnStorageChange == nil {
		return hooks, nil
	}
	if hooks.OnNonceChange != nil && hooks.OnNonceChangeV2 != nil {
		return nil, fmt.Errorf("cannot have both OnNonceChange and OnNonceChangeV2")
	}

	// Create a new Hooks instance and copy all hooks
	wrapped := *hooks

	// Create journal
	j := &journal{hooks: hooks}
	// Scope hooks need to be re-implemented.
	wrapped.OnTxEnd = j.OnTxEnd
	wrapped.OnEnter = j.OnEnter
	wrapped.OnExit = j.OnExit
	// ... (wrap other state change hooks)

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

func (j *journal) OnStorageChange(addr common.Address, slot common.Hash, prev, new common.Hash) {
	j.entries = append(j.entries, storageChange{addr: addr, slot: slot, prev: prev, new: new})
	if j.hooks.OnStorageChange != nil {
		j.hooks.OnStorageChange(addr, slot, prev, new)
	}
}

type (
	storageChange struct {
		addr common.Address
		slot common.Hash
		prev common.Hash
		new  common.Hash
	}
)

func (s storageChange) revert(hooks *Hooks) {
	if hooks.OnStorageChange != nil {
		hooks.OnStorageChange(s.addr, s.slot, s.new, s.prev)
	}
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interfaces.go">
```go
// Copyright 2018 The go-ethereum Authors
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
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/holiman/uint256"
)

// Tracer is the interface for state transaction tracing.
//
// A Tracer has access to the full EVM stack, memory and contract code, and is
// called on each step of the EVM execution loop.
//
// Implementations of this interface should not retain the byte slices passed
// into the interface functions, but make copies if they need to be held after
// the function returns.
type Tracer interface {
	// CaptureStart is called once at the beginning of a new transaction, before any
	// execution occurs.
	CaptureStart(from common.Address, to common.Address, call bool, input []byte, gas uint64, value *big.Int)

	// CaptureState is called on each step of the EVM execution loop.
	// It is called just before the opcode is executed.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It is called with the program counter, the failed opcode, the remaining gas,
	// the cost of the opcode and the error.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnd is called after the call finishes to report the amount of gas
	// used and the return data.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureEnter is called when the EVM enters a new frame, either through a
	// CALL, CREATE or SELFDESTRUCT instruction.
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits a frame, either through a RETURN,
	// REVERT, STOP or SELFDESTRUCT instruction.
	CaptureExit(output []byte, gasUsed uint64, err error)
}

// EVMLogger is a deprecated interface. Use Tracer instead.
type EVMLogger = Tracer

// ScopeContext contains the things that are per-call, such as stack and memory,
// but not the StateDB.
type ScopeContext struct {
	Memory   *Memory
	Stack    *Stack
	Contract *Contract
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/logger.go">
```go
// StructLogger is an EVM state logger and implements Tracer.
//
// StructLogger can be used to capture execution traces of a transaction, and
// supports running in a fault-tolerant mode.
type StructLogger struct {
	cfg *Config // Config to be used during the logging

	storage map[common.Address]types.Storage
	logs    []StructLog
	output  []byte
	err     error

	gasUsed uint64

	pending map[uint64]uint64 // Holds the gas cost of the words to be charged for memory expansion

	mu sync.Mutex // guards the following fields
	// interned addresses and hashes, to avoid hex-encoding them many times
	addresses map[common.Address]string
	hashes    map[common.Hash]string

	reason   error         // Whatever error caused the logger to stop capturing
	interrupt atomic.Bool // Atomic flag to signal execution interruption
}

// StructLog is a structured log collected during the execution of the EVM.
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
	Err           error                       `json:"-"`
}

// CaptureState captures the system state at a particular point in time.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// ... (error handling and config checks omitted for brevity)

	// Create the basic struct log object
	log := StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           gas,
		GasCost:       cost,
		Depth:         depth,
		RefundCounter: scope.Contract.Gas, // This is the refund counter
	}
	// Capture memory if requested
	if !l.cfg.DisableMemory {
		log.Memory = make([]byte, len(scope.Memory.Data()))
		copy(log.Memory, scope.Memory.Data())
		log.MemorySize = scope.Memory.Len()
	}
	// Capture stack if requested
	if !l.cfg.DisableStack {
		log.Stack = scope.Stack.Back(int(scope.Stack.len()))
	}
	// Capture return data if requested
	if l.cfg.EnableReturnData {
		log.ReturnData = common.CopyBytes(rData)
	}
	// Capture storage if requested
	if !l.cfg.DisableStorage {
		if l.storage == nil {
			l.storage = make(map[common.Address]types.Storage)
		}
		// SLOAD happens to be the only opcode that explicitly pops the key from
		// the stack, all other opcodes use a calculated value.
		if op == SLOAD {
			var (
				address  = scope.Contract.Address()
				slot     = common.BigToHash(scope.Stack.Back(0))
				val      = scope.Contract.GetState(l.cfg.EVM.StateDB, slot)
				storage  = l.storage[address]
			)
			if storage == nil {
				storage = make(types.Storage)
				l.storage[address] = storage
			}
			storage[slot] = val
		}
		// SSTORE pops two items from the stack, the key and the value.
		if op == SSTORE {
			var (
				address = scope.Contract.Address()
				key     = common.BigToHash(scope.Stack.Back(0))
				val     = common.BigToHash(scope.Stack.Back(1))
				storage = l.storage[address]
			)
			if storage == nil {
				storage = make(types.Storage)
				l.storage[address] = storage
			}
			storage[key] = val
		}
		// Make a copy of the captured storage if it exists, so that the result
		// is not altered by the next log capturing.
		if storage, ok := l.storage[scope.Contract.Address()]; ok {
			log.Storage = storage.Copy()
		}
	}
	l.logs = append(l.logs, log)
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the consensus engine.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// Config contains parameters for contract execution.
	Config Config

	// ... (other fields)
}

// Config are the configuration options for the EVM.
type Config struct {
	// Tracer is the tracer that will be used during the execution.
	Tracer Tracer
	// ...
}

// Run executes the given contract and returns the gas used and the returned data.
func (evm *EVM) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup omitted)

	// Capture the tracer start, if any
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureStart(from, to, contractCreation, input, contract.Gas, contract.value)
	}

	// The main execution loop
	for {
		// ...
		// Capture the current state if we have a tracer
		if evm.Config.Tracer != nil {
			evm.Config.Tracer.CaptureState(pc, op, gas, cost, &ScopeContext{mem, stack, contract}, evm.interpreter.returnData, evm.depth, err)
		}
		// Get next opcode
		op = contract.GetOp(pc)
		// ... (execute opcode)
	}

fault:
	// The execution failed with a vm error.
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureFault(pc, op, gas, cost, &ScopeContext{mem, stack, contract}, evm.depth, err)
	}
	// ... (error handling)

done:
	// The execution has completed.
	// Don't capture the result on a read-only call.
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnd(ret, gas-gas, err)
	}

	return ret, err
}

// Call runs the code of the given account.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (setup omitted)

	// Capture the tracer start, if any
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(CALL, caller.Address(), addr, input, gas, value)
	}
	// Run the evm
	ret, err = evm.Run(code, input, readOnly)

	// ...

	// Capture the exit frame.
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureExit(ret, gas-leftOverGas, err)
	}
	return ret, leftOverGas, err
}

// Create creates a new contract using the data passed as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (setup omitted)

	// Create a new contract
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCodeOptionalHash(&contractAddr, codeAndHash)

	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(CREATE, caller.Address(), contractAddr, code, gas, value)
	}
	// ...
	// Run the EVM.
	ret, err = evm.Run(contract, nil, false)
	// ...

	// Capture the exit frame
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureExit(ret, gas-leftOverGas, err)
	}
	return ret, contractAddr, leftOverGas, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/state_transition.go">
```go
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
	// ... (pre-check logic)

	// Prepare access list and transient storage
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
		
		// ... (EIP-7702 auth logic)

		// Execute the transaction's call.
		ret, st.gasRemaining, vmerr = st.evm.Call(msg.From, st.to(), msg.Data, st.gasRemaining, value)
	}
	// ... (post-execution logic: refunds, fee payment)

	return &ExecutionResult{
		UsedGas:    st.gasUsed(),
		MaxUsedGas: peakGasUsed,
		Err:        vmerr,
		ReturnData: ret,
	}, nil
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/tracer.go">
```go
// Copyright 2018 The go-ethereum Authors
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
	"math/big"

	"github.com/ethereum/go-ethereum/common"
)

// Tracer is a EVM state logger.
type Tracer interface {
	// CaptureStart is called once at the beginning of an EVM transaction.
	CaptureStart(from common.Address, to common.Address, call bool, input []byte, gas uint64, value *big.Int)

	// CaptureState is called on each step of the VM execution.
	// Note that the scope object is not valid after the call has returned.
	// It is not safe to put the scope object into a goroutine.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It is not called if `CaptureState` returns an error.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnd is called once at the end of an EVM transaction.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits a scope.
	CaptureExit(output []byte, gasUsed uint64, err error)
}

// ScopeContext contains the things that are per-call-scope.
type ScopeContext struct {
	// Memory returns the memory of the current execution scope.
	// The returned memory is not a copy and is only valid during the execution
	// of the current step.
	Memory *Memory

	// Stack returns the stack of the current execution scope.
	// The returned stack is not a copy and is only valid during the execution

	// of the current step.
	Stack *Stack

	// Contract returns the contract of the current execution scope.
	// The returned contract is not a copy and is only valid during the execution
	// of the current step.
	Contract *Contract
}

// MultiTracer is a Tracer that can be used to wrap multiple tracers.
//
// It is not safe to modify the list of tracers concurrently.
type MultiTracer struct {
	tracers []Tracer
}

// NewMultiTracer returns a new tracer that wraps the given tracers.
func NewMultiTracer(tracers ...Tracer) *MultiTracer {
	return &MultiTracer{tracers: tracers}
}

// CaptureStart is called once at the beginning of an EVM transaction.
func (mt *MultiTracer) CaptureStart(from common.Address, to common.Address, call bool, input []byte, gas uint64, value *big.Int) {
	for _, t := range mt.tracers {
		t.CaptureStart(from, to, call, input, gas, value)
	}
}

// CaptureState is called on each step of the VM execution.
func (mt *MultiTracer) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	for _, t := range mt.tracers {
		t.CaptureState(pc, op, gas, cost, scope, rData, depth, err)
	}
}

// CaptureFault is called when an error occurs during the execution of an opcode.
func (mt *MultiTracer) CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error) {
	for _, t := range mt.tracers {
		t.CaptureFault(pc, op, gas, cost, scope, depth, err)
	}
}

// CaptureEnd is called once at the end of an EVM transaction.
func (mt *MultiTracer) CaptureEnd(output []byte, gasUsed uint64, err error) {
	for _, t := range mt.tracers {
		t.CaptureEnd(output, gasUsed, err)
	}
}

// CaptureEnter is called when EVM enters a new scope (via call, create or selfdestruct).
func (mt *MultiTracer) CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	for _, t := range mt.tracers {
		t.CaptureEnter(typ, from, to, input, gas, value)
	}
}

// CaptureExit is called when EVM exits a scope.
func (mt *MultiTracer) CaptureExit(output []byte, gasUsed uint64, err error) {
	for _, t := range mt.tracers {
		t.CaptureExit(output, gasUsed, err)
	}
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
	"encoding/json"
	"io"
	"math/big"
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/state"
	"github.com/ethereum/go-ethereum/core/types"
)

// Config are the configuration options for the logger
type Config struct {
	EnableMemory     bool // enable memory capture
	DisableStack     bool // disable stack capture
	DisableStorage   bool // disable storage capture
	EnableReturnData bool // enable return data capture
	Debug            bool // print output during capture end
	Limit            int  // maximum length of output, but zero means unlimited
}

// StructLogger is an EVM state logger that captures execution steps and
// produces a structured log of the execution.
//
// Note, this logger is not thread safe.
type StructLogger struct {
	cfg Config // Struct logger configuration

	storage map[common.Address]types.Storage
	logs    []StructLog
	output  []byte
	err     error

	gas         uint64
	refund      uint64
	memory      *Memory
	stack       *Stack
	rData       []byte
	callData    []byte
	contract    *Contract
	statedb     StateDB
	depth       int
	pc          uint64
	op          OpCode
	interrupt   *atomic.Bool
	reason      error // Any error reported by the tracer
	skip        bool  // whether to skip the next opcode
	journal     *state.Journal
	journalAddr common.Address
}

// StructLog is a structured log message captured by the logger.
type StructLog struct {
	Pc            uint64                  `json:"pc"`
	Op            OpCode                  `json:"op"`
	Gas           uint64                  `json:"gas"`
	GasCost       uint64                  `json:"gasCost"`
	Memory        []byte                  `json:"memory,omitempty"`
	MemorySize    int                     `json:"memSize"`
	Stack         []*big.Int              `json:"stack,omitempty"`
	ReturnData    []byte                  `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                     `json:"depth"`
	RefundCounter uint64                  `json:"refund"`
	Err           error                   `json:"-"`
	ErrString     string                  `json:"error,omitempty"`
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
```go
// Run loops and executes the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() {
		in.evm.depth--
	}()

	// Make sure the readOnly is only set if we aren't in a readOnly context already.
	if readOnly && !in.readOnly {
		in.readOnly = true
		defer func() { in.readOnly = false }()
	}
	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}
	// Make sure the interpreter is using the correct jump table.
	in.setInterpreter(contract)

	var (
		op    OpCode        // current opcode
		mem   = NewMemory() // bound memory
		stack = newstack()  // local stack
		// For optimisation, we have a contract and scope context that are created
		// once, and exposed to the tracers.
		scope = &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for CaptureFault
		gasCopy uint64 // needed for CaptureFault
		res     []byte
	)
	contract.Input = input

	// Don't capture any trace of operations if we're running under a higher level
	// tracer that's already doing it.
	if in.hasTracer {
		defer func() {
			if err != nil {
				if !errors.Is(err, ErrExecutionReverted) {
					scope.Contract.Gas = 0
				}
				scope.Contract.Gas += cost
			}
			// The `if` is needed here because of an edge case, where the execution is
			// being aborted via `go-ethereum: KILLED` error and the tracer is not being
			// notified about the exit, which may cause it to be in an inconsistent state.
			if in.cfg.Tracer != nil {
				in.cfg.Tracer.CaptureExit(ret, scope.Contract.Gas-gas, err)
			}
		}()
	}
	// The EVM should never be invoked with an empty code container.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	for {
		if in.evm.Cancelled() {
			return nil, ErrCancelled
		}
		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		if !operation.valid {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		//...
		// If the tracer is enabled, capture the state.
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureState(pc, op, gas, cost, scope, in.returnData, in.evm.depth, err)
		}
		// Execute the operation
		res, err = operation.execute(&pc, in, scope)
		// If the operation clears the return data, do it.
		if operation.returns {
			in.returnData = nil
		}
		if err != nil {
			goto fault
		}
		// Every step, the buffer may be expanded, so we need to these
		// two variables.
		in.returnData = res
		pc++
	}
fault:
	// The 'fault' label is the destination for any error returning operation.
	//
	// It's important to copy the scope since the err parameter might be used in
	// the capture which might need the vm state at the point of the error.
	if err != nil && in.cfg.Tracer != nil {
		in.cfg.Tracer.CaptureFault(pcCopy, op, gasCopy, cost, scope, in.evm.depth, err)
	}
	return ret, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/evm.go">
```go
// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the return data from the executed contract.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetAddress(addr)
	}
	// Fail if we're trying to execute above the call depth limit
	if evm.depth > int(params.CallCreateDepth) {
		return nil, gas, ErrDepth
	}
	// Fail if we're trying to transfer more than the available balance
	if !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, gas, ErrInsufficientBalance
	}
	var (
		to       = AccountRef(addr)
		snapshot = evm.StateDB.Snapshot()
	)
	if !evm.StateDB.Exist(addr) {
		precompiles := PrecompiledContractsBerlin
		if evm.chainRules.IsIstanbul {
			precompiles = PrecompiledContractsIstanbul
		}
		if precompiles[addr] == nil && evm.chainRules.IsEIP158 && value.Sign() == 0 {
			// Calling a non-existing account, don't do anything, but ping the tracer
			if evm.tracer != nil {
				evm.tracer.CaptureEnter(CALL, caller.Address(), addr, input, gas, value)
				evm.tracer.CaptureExit(nil, 0, nil)
			}
			return nil, gas, nil
		}
		evm.StateDB.CreateAccount(addr)
	}
	evm.Transfer(evm.StateDB, caller.Address(), to.Address(), value)

	// Capture the tracer start/end events in case of a top-level call
	if evm.depth == 0 {
		if evm.tracer != nil {
			evm.tracer.CaptureStart(caller.Address(), addr, true, input, gas, value)
			// The defer and the CaptureEnd should not be nested, because that would
			// cause the CaptureEnd to be called before the CaptureExit of the call,
			// which is not the desired behaviour.
		}
		defer func() {
			if evm.tracer != nil {
				evm.tracer.CaptureEnd(ret, gas-leftOverGas, err)
			}
		}()
	}

	// Enter a new scope for tracing
	if evm.tracer != nil {
		evm.tracer.CaptureEnter(CALL, caller.Address(), addr, input, gas, value)
	}
	defer func() {
		// The `if` is needed here because of an edge case, where the execution is
		// being aborted via `go-ethereum: KILLED` error and the tracer is not being
		// notified about the exit, which may cause it to be in an inconsistent state.
		if evm.tracer != nil {
			evm.tracer.CaptureExit(ret, leftOverGas, err)
		}
	}()
	//...
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Depth check execution. Fail if we're trying to execute above the
	// limit.
	if evm.depth > int(params.CallCreateDepth) {
		return nil, common.Address{}, gas, ErrDepth
	}
	if !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// Ensure there's no existing contract already at the designated address
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	contractAddr = CreateAddress(caller.Address(), nonce)
	if evm.StateDB.GetCodeSize(contractAddr) > 0 {
		return nil, common.Address{}, 0, ErrContractAddressCollision
	}
	// Create a new account on the state
	snapshot := evm.StateDB.Snapshot()
	evm.StateDB.CreateAccount(contractAddr)
	if evm.chainRules.IsEIP158 {
		evm.StateDB.SetNonce(contractAddr, 1)
	}
	evm.Transfer(evm.StateDB, caller.Address(), contractAddr, value)

	// initialise a new contract and set the code that is to be used by the
	// EVM. The contract is a scoped environment for this execution context
	// only.
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	contract.SetCodeOptionalHash(&contractAddr, anlyzeCode(code))

	// Enter a new scope for tracing
	if evm.tracer != nil {
		evm.tracer.CaptureEnter(CREATE, caller.Address(), contractAddr, code, gas, value)
	}
	defer func() {
		if evm.tracer != nil {
			evm.tracer.CaptureExit(ret, leftOverGas, err)
		}
	}()
    // ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of CALLER opcode (e.g. msg.sender)
	CallerAddress common.Address
	caller        ContractRef
	self          ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	analysis  atomic.Value // a cache of the contract analysis->analysis

	Code     []byte
	CodeHash common.Hash
	CodeAddr *common.Address
	Input    []byte

	value *big.Int
	gas   uint64

	// Senders stashes the senders in a stack. The senders are cleared after
	// a call has returned and the last sender is popped from the stack.
	//
	// This is only used for backward compatibility with an old LOG tracer format.
	senders []common.Address
}

// NewContract returns a new contract environment for the execution of EVM.
func NewContract(caller ContractRef, object ContractRef, value *big.Int, gas uint64) *Contract {
	contract := &Contract{
		caller:        caller,
		CallerAddress: caller.Address(),
		self:          object,
		gas:           gas,
		value:         value,
	}
	// Check if the inherited-from contract is a read-only one.
	if parent, ok := caller.(*Contract); ok {
		contract.senders = parent.senders
	}
	return contract
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides an excellent foundation for a Zig-based inspector framework. The proposed `Inspector` and context structs are well-designed and idiomatic for Zig. The analysis of production patterns from REVM and EVMOne is also very insightful.

The added context from `go-ethereum` complements this by providing a third, battle-tested reference implementation, specifically for:

1.  **A simpler, more generalized `Tracer` interface**: Geth's `Tracer` interface (`CaptureState`, `CaptureFault`, `CaptureEnter`, `CaptureExit`) is less granular than the prompt's proposed `Inspector` but covers all essential events. This provides a valuable alternative design pattern that might be simpler to integrate initially. `CaptureState` is a powerful, all-in-one hook called for every opcode.

2.  **`ScopeContext` as a model for `StepContext`**: The `go-ethereum` `ScopeContext` struct, which provides access to the current `Memory`, `Stack`, and `Contract`, is a great model for the prompt's `StepContext`. It shows how to provide access to the core EVM components without exposing the entire VM, which is a good encapsulation practice.

3.  **`StructLogger` as a concrete implementation**: The `StructLogger` is a perfect, non-trivial example of a tracer. It demonstrates:
    *   How to implement the `Tracer` interface.
    *   A `Config` struct for enabling/disabling features (like memory or stack capture), which is a key performance optimization pattern mentioned in the prompt.
    *   The `StructLog` type, which is the data structure it builds at each step. This can directly inspire the implementation of the data passed to hooks like `step_end`.

4.  **`MultiTracer` for composition**: The prompt requires inspector composition. `go-ethereum`'s `MultiTracer` provides a clean, simple pattern for this, where a single "manager" tracer iterates over a list of other tracers and calls their respective hooks. This is a direct parallel to the `InspectorManager` proposed in the prompt.

By studying these `go-ethereum` patterns, the developer can gain a more rounded view of production-grade inspector/tracer architectures and make more informed design decisions for the Zig EVM.

---

An excellent and detailed prompt. Go-ethereum's tracing/inspector framework, while having evolved over time, provides robust patterns for execution monitoring. The most relevant component is the `Tracer` interface (formerly `EVMLogger`) and its integration into the `EVM` and `StateDB`.

Here are the most relevant code snippets from the go-ethereum codebase to guide your implementation.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/hooks.go">
```go
// Hooks is a collection of callback methods that are used to instrument the
// EVM and track events that occur during a state transition.
type Hooks struct {
	OnTxStart func(vmctx *VMContext, tx *types.Transaction, from common.Address)
	OnTxEnd   func(receipt *types.Receipt, err error)

	// OnEnter is called when the EVM enters a new frame, either through a CALL or CREATE.
	OnEnter func(depth int, typ byte, from, to common.Address, input []byte, gas uint64, value *big.Int)

	// OnExit is called when the EVM exits a frame, either through a RETURN, REVERT or error.
	OnExit func(depth int, output []byte, gasUsed uint64, err error, reverted bool)

	// OnOpcode is called for each EVM opcode executed.
	OnOpcode func(pc uint64, op byte, gas, cost uint64, scope OpContext, rData []byte, depth int, err error)

	// OnFault is called for each EVM opcode executed that faults.
	OnFault func(pc uint64, op byte, gas, cost uint64, scope OpContext, depth int, err error)

	// OnBalanceChange is called when the balance of an account changes.
	OnBalanceChange func(addr common.Address, prev, new *big.Int, reason BalanceChangeReason)

	// OnNonceChange is called when the nonce of an account changes.
	OnNonceChange func(addr common.Address, prev, new uint64)

	// OnNonceChangeV2 is called when the nonce of an account changes.
	OnNonceChangeV2 func(addr common.Address, prev, new uint64, reason NonceChangeReason)

	// OnCodeChange is called when the code of an account changes.
	OnCodeChange func(addr, prevCodeHash common.Hash, prevCode, codeHash common.Hash, code []byte)

	// OnStorageChange is called when the storage of an account changes.
	OnStorageChange func(addr common.Address, slot, prev, new common.Hash)

	// OnLog is called when a log is emitted.
	OnLog func(*types.Log)

	// OnGasChange is called when the amount of available gas changes.
	OnGasChange func(old, new uint64, reason GasChangeReason)

	// OnBlockchainInit is called when the blockchain is initialized.
	OnBlockchainInit func(*params.ChainConfig)

	// OnGenesisBlock is called when the genesis block is processed.
	OnGenesisBlock func(*types.Block, types.GenesisAlloc)

	// OnBlockStart is called when a new block is being processed.
	OnBlockStart func(event BlockEvent)

	// OnBlockEnd is called when the processing of a block has ended.
	OnBlockEnd func(err error)

	// OnSkippedBlock is called when a block is skipped during import.
	OnSkippedBlock func(event BlockEvent)

	// OnClose is called when the tracer is closed.
	OnClose func()
}

// OpContext provides the context for the opcode capture method.
type OpContext interface {
	// MemoryData returns the memory data. Callers must not modify the contents
	// of the returned data.
	MemoryData() []byte
	// StackData returns the stack data. Callers must not modify the contents

	// of the returned data.
	StackData() []uint256.Int
	// Caller returns the current caller.
	Caller() common.Address
	// Address returns the address where this scope of execution is taking place.
	Address() common.Address
	// CallValue returns the value supplied with this call.
	CallValue() *uint256.Int
	// CallInput returns the input/calldata with this call. Callers must not modify
	// the contents of the returned data.
	CallInput() []byte
	// ContractCode returns the code of the contract being executed.
	ContractCode() []byte
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
	// ... (setup code)

	// The Interpreter main run loop (contextual). This loop runs until either an
	// explicit STOP, RETURN or SELFDESTRUCT is executed, an error occurred during
	// the execution of one of the operations or until the done flag is set by the
	// parent context.
	for {
		if debug {
			// Capture pre-execution values for tracing.
			logged, pcCopy, gasCopy = false, pc, contract.Gas
		}

        // ... (gas calculation and other pre-execution checks)

		// Get the operation from the jump table and validate the stack to ensure there are
		// enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := in.table[op]
		cost = operation.constantGas // For tracing
		
        // ... (stack validation and gas deduction)
		
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
		// ... (memory expansion)

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
// Config are the configuration options for the Interpreter
type Config struct {
	Tracer                  *tracing.Hooks // EVM execution tracer for debugging
	NoBaseFee               bool           // Forces the EIP-1559 baseFee to 0 (needed for 0 price calls)
	EnablePreimageRecording bool           // Enables recording of SHA3/keccak preimages
	ExtraEips               []int          // Additional EIPS that are to be enabled

	StatelessSelfValidation bool // Generate execution witnesses and self-check against them (testing purpose)
}

// Call executes the contract associated with the addr with the given input as
// parameters.
func (evm *EVM) Call(caller common.Address, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// Capture the tracer start/end events in debug mode
	if evm.Config.Tracer != nil {
		evm.captureBegin(evm.depth, CALL, caller, addr, input, gas, value.ToBig())
		defer func(startGas uint64) {
			evm.captureEnd(evm.depth, startGas, leftOverGas, ret, err)
		}(gas)
	}
	// ... (call logic) ...
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller common.Address, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (tracer capture similar to Call) ...
}

// captureBegin is a helper function to call the OnEnter hook of the tracer.
func (evm *EVM) captureBegin(depth int, typ OpCode, from common.Address, to common.Address, input []byte, startGas uint64, value *big.Int) {
	tracer := evm.Config.Tracer
	if tracer.OnEnter != nil {
		tracer.OnEnter(depth, byte(typ), from, to, input, startGas, value)
	}
	// ...
}

// captureEnd is a helper function to call the OnExit hook of the tracer.
func (evm *EVM) captureEnd(depth int, startGas uint64, leftOverGas uint64, ret []byte, err error) {
	tracer := evm.Config.Tracer
	// ...
	if tracer.OnExit != nil {
		tracer.OnExit(depth, ret, startGas-leftOverGas, VMErrorFromErr(err), reverted)
	}
}

```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/statedb_hooked.go">
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

// SetState updates a value in account storage.
func (s *hookedStateDB) SetState(address common.Address, key common.Hash, value common.Hash) common.Hash {
	prev := s.inner.SetState(address, key, value)
	if s.hooks.OnStorageChange != nil && prev != value {
		s.hooks.OnStorageChange(address, key, prev, value)
	}
	return prev
}

// SetNonce sets the nonce for the given address.
func (s *hookedStateDB) SetNonce(address common.Address, nonce uint64, reason tracing.NonceChangeReason) {
	prev := s.inner.GetNonce(address)
	s.inner.SetNonce(address, nonce, reason)
	if s.hooks.OnNonceChangeV2 != nil {
		s.hooks.OnNonceChangeV2(address, prev, nonce, reason)
	} else if s.hooks.OnNonceChange != nil {
		s.hooks.OnNonceChange(address, prev, nonce)
	}
}

// AddBalance adds amount to the account associated with addr.
func (s *hookedStateDB) AddBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) uint256.Int {
	prev := s.inner.AddBalance(addr, amount, reason)
	if s.hooks.OnBalanceChange != nil && !amount.IsZero() {
		newBalance := new(uint256.Int).Add(&prev, amount)
		s.hooks.OnBalanceChange(addr, prev.ToBig(), newBalance.ToBig(), reason)
	}
	return prev
}

// AddLog adds a new log to the state and returns the salt.
func (s *hookedStateDB) AddLog(log *types.Log) {
	// The inner will modify the log (add fields), so invoke that first
	s.inner.AddLog(log)
	if s.hooks.OnLog != nil {
		s.hooks.OnLog(log)
	}
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/structlogger.go">
```go
// StructLogger is a EVM state logger and implements Tracer.
//
// StructLogger can be used to capture execution traces of a transaction on
// top of a given state.
type StructLogger struct {
	cfg Config

	storage map[common.Address]types.Storage
	logs    []*StructLog
	output  []byte
	err     error

	inInterp bool
	reason   error // Any error reported by the tracer internally

	// The following fields are used to track an interrupting Stop
	interrupt *atomic.Bool
	stopCh    chan bool

	// KeccakTriple is a special feature which is mainly used for testing,
	// which will store the input, output and the resulting hash of each
	// keccak operation.
	KeccakTriple [][3]string `json:"-"`
}

// StructLog is a structured log collected by the logger.
type StructLog struct {
	Pc            uint64             `json:"pc"`
	Op            vm.OpCode          `json:"op"`
	Gas           uint64             `json:"gas"`
	GasCost       uint64             `json:"gasCost"`
	Memory        *hexutil.Bytes     `json:"memory,omitempty"`
	MemorySize    int                `json:"memSize"`
	Stack         *[]hexutil.U256    `json:"stack,omitempty"`
	ReturnData    *hexutil.Bytes     `json:"returnData,omitempty"`
	Storage       *types.Storage     `json:"storage,omitempty"`
	Depth         int                `json:"depth"`
	RefundCounter uint64             `json:"refund"`
	Err           string             `json:"error,omitempty"`
	OpName        string             `json:"opName"` // TODO: To be removed
	ErrorString   string             `json://TODO: remove this, its a duplicate of Err, see https://github.com/ethereum/go-ethereum/pull/29037"`
	ReturnStack   *[]hexutil.U256    `json:"returnStack,omitempty"` // EIP-7620
	GasEIP3198    uint64             `json:"gas_eip3198"`           // EIP-7620
	Result        *ExecutionResultV2 `json:"result,omitempty"`      // EIP-7620
	memorySlice   memorySlice
}

// CaptureState is called for each step of the VM and captures the current state.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope tracing.OpContext, rData []byte, depth int, err error) {
	// ... (internal logic)

	// copy stack if needed
	var stack *[]hexutil.U256
	if !l.cfg.DisableStack {
		s := scope.StackData()
		cpy := make([]hexutil.U256, len(s))
		for i, item := range s {
			cpy[i] = hexutil.U256(item)
		}
		stack = &cpy
	}

	// copy memory if needed
	var memory *hexutil.Bytes
	if l.cfg.EnableMemory {
		mem := hexutil.Bytes(scope.MemoryData())
		memory = &mem
	}

	// copy return data if needed
	var returnData *hexutil.Bytes
	if l.cfg.EnableReturnData {
		rd := hexutil.Bytes(rData)
		returnData = &rd
	}

	// capture storage if needed
	var storage *types.Storage
	if !l.cfg.DisableStorage {
		if sto, ok := l.storage[scope.Address()]; ok {
			storage = &sto
		}
	}
	// ... (error handling)

	// create the log item
	log := &StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Memory:     memory,
		MemorySize: scope.MemoryDataLength(),
		Stack:      stack,
		ReturnData: returnData,
		Storage:    storage,
		Depth:      depth,
		// ...
	}
	l.logs = append(l.logs, log)
}

// OnStorageChange is called when a storage slot is changed.
func (l *StructLogger) OnStorageChange(addr common.Address, slot, prev, new common.Hash) {
	if l.storage == nil {
		l.storage = make(map[common.Address]types.Storage)
	}
	if _, ok := l.storage[addr]; !ok {
		l.storage[addr] = make(types.Storage)
	}
	l.storage[addr][slot] = new
}
```
</file>

</go-ethereum>
## Prompt Corrections
The original prompt is excellent and very comprehensive. The proposed Zig interface is well-designed and covers all essential EVM events. The Geth snippets above provide a robust, production-tested reference for how such a framework is architected and integrated.

One minor suggestion for the `Inspector` interface in the prompt:

- **State Change Hooks**: The prompt has hooks for `storage_read` and `storage_write`. Geth's `hookedStateDB` pattern shows that it can be cleaner to have hooks for all state-modifying operations (`SetBalance`, `SetNonce`, `SetCode`, etc.) rather than just storage. This makes the inspector more powerful as it can react to a wider range of state changes directly. While the current hooks are good, extending them to cover all state object modifications could be beneficial. The `hookedStateDB.go` file is a perfect reference for this pattern.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// EVMLogger is an interface to capture execution states.
//
// CaptureState is invoked for every opcode that is about to be executed.
// Note that CaptureState is not invoked for failure cases. CaptureFault
// is invoked for that.
type EVMLogger interface {
	// CaptureStart is called when EVM execution starts.
	CaptureStart(from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	// CaptureState is called for each step of the VM, excluding errors.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It is not called if `step` returns an error.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	// CaptureEnd is called when EVM execution terminates.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	// CaptureExit is called when the EVM exits a scope, even if the scope came from a CaptureEnter that was never reported.
	CaptureExit(output []byte, gasUsed uint64, err error)

	// CaptureTxStart is called when a transaction starts to be executed.
	CaptureTxStart(tx *types.Transaction)
	// CaptureTxEnd is called when a transaction has been fully executed.
	CaptureTxEnd(receipt *types.Receipt)
}

// StructLogger is an EVMLogger that captures execution steps and converts them to
// a format that can be used by other tools to structured trace transactions.
type StructLogger struct {
	cfg *Config

	storage state.Storage
	logs    []*StructLog
	output  []byte
	err     error

	reverted bool

	// This field is used to disable the memory capture.
	// It is set to true after the first memory capture because we only need to
	// capture the memory *before* the execution of the opcode.
	memcapture bool

	stack Stacker
	pc    uint64
	op    OpCode
	gas   uint64
	cost  uint64
	depth int

	// The following fields are kept since a CaptureState can be called from within
	// a Capture-method.
	prevLogs    []*StructLog
	prevStorage state.Storage

	journal         *journal
	journalAddr     common.Address // The address where the journal is located
	journalIndex    int            // The index in the journal
	firstJournalIdx int            // The index of first journal entry that is not yet snapshotted
}

// CaptureState captures the system state before executing the opcode.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// If the scope is intentionally nil, we're not tracing
	if scope == nil {
		return
	}
	// Copy a snapshot of the current journal, so that we can filter out any
	// state changes that happened during this opcode execution
	l.journalAddr = scope.Contract.Address()
	l.journalIndex = scope.StateDB.JournalIndex()

	// Initialise the prev storage and logs from the current state
	if l.prevLogs == nil {
		l.prevLogs = l.logs
		l.prevStorage = l.storage
	}

	// Capture the memory if configured
	var memory *Memory
	if l.cfg.EnableMemory {
		memory = scope.Memory
		l.memcapture = true
	}

	// Capture the stack if configured
	var stack *Stack
	if !l.cfg.DisableStack {
		stack = scope.Stack
	}

	// Capture the storage if configured
	var storage state.Storage
	if !l.cfg.DisableStorage {
		if l.storage == nil {
			l.storage = make(state.Storage)
		}
		// When the new storage is different then the old one, it means the old one
		// is a snapshot of the parent and we need to create a new storage for this scope.
		if scope.StateDB.Storage(scope.Contract.Address()) != l.storage {
			l.storage = scope.StateDB.Storage(scope.Contract.Address()).Copy()
		}
	}

	// Create the log, and optional add it to the list
	log := StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           gas,
		GasCost:       cost,
		Depth:         depth,
		Memory:        memory,
		Stack:         stack,
		Storage:       storage,
		RefundCounter: scope.StateDB.GetRefund(),
	}
	if l.cfg.EnableReturnData {
		log.ReturnData = rData
	}
	if err != nil {
		log.Error = err
	}
	l.logs = append(l.logs, &log)
}

// CaptureFault implements the EVMLogger interface to trace an execution fault.
func (l *StructLogger) CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error) {
	if scope == nil {
		return
	}
	l.CaptureState(pc, op, gas, cost, scope, nil, depth, err)
}

// CaptureEnter is called when EVM enters a new scope (via call, create or selfdestruct).
func (l *StructLogger) CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	// Skip if tracing was interrupted
	if l.reverted {
		return
	}
	// The call is initialised, but not executed yet.
	// The StruckLogger will be called by 'CaptureState', and we can do a lot
	// of the preparation there already.
	// For that reason, we don't clear the 'memcapture' flag
	l.stack = NewStack()
	l.pc = 0
	l.op = 0
	l.gas = 0
	l.cost = 0

	// We need to keep a snapshot of the journal, so that any state changes
	// that happen in this scope can be reverted on exit.
	// The reason we do this, instead of just using the stateDB's snapshot/revert
	// is that those will revert any changes that have happened _before_ the scope
	// was entered, but which have not yet been snapshotted.
	// An example:
	// - SSTORE
	//  - pushes a new journal entry
	// - CALL
	//  - enters scope
	//  - CALL fails
	//  - exits scope
	// In exit, if we do a 'revert', we will revert the SSTORE too.
	// The journal contains all operations, but not their results.
	l.journal = newJournal()
}

// CaptureExit is called when EVM exits a scope, even if the scope came
// from a CaptureEnter that was never reported.
func (l *StructLogger) CaptureExit(output []byte, gasUsed uint64, err error) {
	// Skip if tracing was interrupted
	if l.reverted {
		return
	}
	// On exit, we can re-enable memory capture
	l.memcapture = false

	if err != nil || l.reverted {
		// The call errored, so we can't process any of the logs that were generated
		// during this scope.
		// We can't just do `l.logs = l.prevLogs`, since that would also discard any
		// modifications that happened to the journalled entries.
		// Instead, we need to truncate to the old size, but retain whatever has been
		// added to the items.
		if len(l.logs) > len(l.prevLogs) {
			l.logs = l.logs[:len(l.prevLogs)]
		}
	}
	// However, if the call was reverted, we need to revert the state changes too
	if err != nil {
		l.reverted = true
	}
	if l.reverted && l.journal != nil {
		// Any changes that were made to the stateDB are rolled back now
		l.journal.revert(l.cfg.state)
	}
	// Restore previous logs and storage.
	l.logs = l.prevLogs
	l.storage = l.prevStorage
	l.prevLogs = nil
	l.prevStorage = nil
}

```

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and executes operations until the VM has returned or an error
// occurred.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	//...
	var (
		op    OpCode        // current opcode
		mem   = NewMemory() // bound memory
		stack = newstack()  // local stack
		// For gas refund counter
		callContext = &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
			StateDB:  in.evm.StateDB,
		}
	)
	//...
	for {
		//...
		// Get operation from the jump table
		op = contract.GetOp(pc)
		operation := in.evm.interpreter.opTable[op]

		//...
		// Capture the state of the VM before the opcode is executed
		if in.evm.Tracer != nil {
			in.evm.Tracer.CaptureState(pc, op, gas, cost, callContext, in.evm.returnData, in.evm.depth, err)
		}
		//...
		// execute the operation
		res, err = operation.execute(&pc, in.evm, callContext)
		//...
	}
	//...
}

```

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current EVM call and is updated
	// on every call.
	Context
	// StateDB gives access to the underlying state.
	StateDB StateDB
	// Config includes the chain rules for the current epoch.
	Config
	// Interpreter is used to execute the instructions.
	interpreter *EVMInterpreter
	//...
	// Tracer is the op code logger
	Tracer EVMLogger
	//...
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used from a single thread.
func NewEVM(blockCtx BlockContext, stateDB StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	//...
	evm := &EVM{
		Context:     Context{Block: blockCtx},
		StateDB:     stateDB,
		Config:      vmConfig,
		interpreter: NewEVMInterpreter(&Context{Block: blockCtx}, stateDB, &vmConfig, chainConfig),
		//...
	}
	//...
	return evm
}


// Call executes the contract associated with the destination address.
//
// It returns the retrieved data, the gas remaining after the execution, and an error if one occurred.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	//...
	if evm.Tracer != nil {
		evm.Tracer.CaptureEnter(CALL, caller.Address(), addr, input, gas, value)
		defer func() {
			evm.Tracer.CaptureExit(ret, leftOverGas, err)
		}()
	}
	//...
	// Create a new account on the state
	evm.StateDB.CreateAccount(addr, false)
	if err := evm.transfer(evm.StateDB, caller.Address(), addr, value, true); err != nil {
		return nil, gas, err
	}
	//...
	// Run the code-based contract
	ret, leftOverGas, err = evm.interpreter.Run(contract, input, false)
	return
}

// Create executes a new contract creation, taking the code from the input
// and storing it at the destination address.
//
// The new contract is created using the EVM's CREATE operation. The destination
// address is computed based on the sender's nonce and optionally a salt.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	//...
	// Ensure there's no existing contract already at the designated address
	contractAddr = crypto.CreateAddress(caller.Address(), evm.StateDB.GetNonce(caller.Address()))
	
	// Trace the call
	if evm.Tracer != nil {
		evm.Tracer.CaptureEnter(CREATE, caller.Address(), contractAddr, code, gas, value)
		defer func() {
			evm.Tracer.CaptureExit(ret, leftOverGas, err)
		}()
	}
	//...
	// Execute the code.
	output, err = evm.interpreter.Run(contract, nil, false)
	//...
	return output, contractAddr, gas, err
}

```

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a contract's computational stack.
type Stack struct {
	data []*big.Int
	//...
}

// newstack returns a new stack with the default stack size.
func newstack() *Stack {
	return &Stack{data: make([]*big.Int, 0, 1024)}
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []*big.Int {
	return st.data
}

```

</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory defines a contract's memory.
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
	//...
}

// Get returns offset + size as a new slice.
func (m *Memory) Get(offset, size int64) []byte {
	//...
}

// Len returns the length of the backing slice.
func (m *Memory) Len() int {
	return len(m.store)
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
// AccountRef is used for calls between contracts
type AccountRef common.Address

// Address returns the contracts address
func (ar AccountRef) Address() common.Address {
	return (common.Address)(ar)
}

// Contract represents an Ethereum contract in the state database. It contains
// the contract code, calling arguments. Contract implements ContractRef.
type Contract struct {
	// CallerAddress is the result of the CALLER opcode (certain native contracts
	// will push a different value).
	CallerAddress common.Address
	// caller is the contract that initiated the call. Can be changed through
	// DELEGATECALL.
	caller ContractRef
	// self is the contract that is executing the current code.
	self ContractRef

	jumpdests destinations // result of JUMPDEST analysis.
	analysis  []byte

	Code     []byte
	CodeHash common.Hash
	Input    []byte

	Gas   uint64
	value *big.Int

	//...
}

```

</file>
</go-ethereum>

---

An analysis of the go-ethereum codebase reveals a robust tracing framework centered around the `EVMLogger` interface. This interface is integrated directly into the EVM's interpreter loop, providing hooks for major lifecycle and execution events. The following snippets from go-ethereum are highly relevant for implementing a compatible and full-featured inspector framework.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
The `EVMLogger` interface is the heart of Geth's tracing system. It defines the set of hooks an external tracer can implement to monitor EVM execution. This is directly analogous to the proposed `Inspector` trait.

```go
// core/vm/logger.go

// EVMLogger is an interface used to collect execution traces from the EVM.
//
// Note that the EVMLogger is stateful, but each call receives the logging
// context on a call-by-call basis. Implementations should not store 'pc'
// and other context information, but use the supplied values.
//
// The EVMLogger is not thread-safe and should only be used by a single EVM
// on a single thread.
type EVMLogger interface {
	// CaptureStart is called once before the start of execution.
	CaptureStart(evm *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureEnd is called once after termination of the execution, before the state is
	// reverted. It is called even if the scope of the EVM didn't finish normally.
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)

	// CaptureState is called for each step of the VM. It captures the current execution
	// context. This includes the memory, stack and other things.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It is not called for errors occurring during scope initialization or teardown.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits a scope, even if the scope didn't
	// execute successfully.
	CaptureExit(output []byte, gasUsed uint64, err error)
}

// ScopeContext contains the things that are per-call-scope.
type ScopeContext struct {
	Memory   *Memory
	Stack    *Stack
	Contract *Contract
}

// ...

// Config are the configuration options for the Interpreter.
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op code logger
	Tracer EVMLogger
	// NoBaseFee removes the fee burning in London, and the transaction fee is assigned to the coinbase.
	NoBaseFee bool
	// EnablePreimageRecording switches on EIP-161 precompile consensus checking.
	// When enabled, the C++ definition of the Homestead precompiles is used which are
	// safe against certain edge cases missed by the Go implementation.
	EnablePreimageRecording bool

	// ExtraEips contains the EIPs to enable in addition to the ones activated by defined forks.
	ExtraEips []int
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
The `Interpreter.Run` method demonstrates how the `EVMLogger` hooks are integrated into the core execution loop. This is the most critical reference for where to place the inspector calls.

```go
// core/vm/interpreter.go

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
// ...
func (in *Interpreter) Run(contract *Contract, input []byte) (ret []byte, err error) {
	// ...
	// Make sure the logger is initialized, if it's enabled
	if in.cfg.Tracer != nil {
		in.cfg.Tracer.CaptureStart(in.evm, contract.Address(), contract.caller.Address(), false, input, contract.Gas, contract.value)
		defer func() {
			in.cfg.Tracer.CaptureEnd(ret, gas, time.Since(start), err)
		}()
	}

	for {
		// Capture the current state and trace it, if required
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureState(pc, op, gas, cost, &ScopeContext{in.memory, in.stack, contract}, in.returnData, in.evm.depth, err)
		}
		// ...
		// Execute the operation
		res, err = op.execute(&pc, in, contract)
		// ...
		// If the operation clears the return data, do it
		if op.clearsReturnData {
			in.returnData = nil
		}
		if err != nil {
			if in.cfg.Tracer != nil {
				in.cfg.Tracer.CaptureFault(pc, op, gas, cost, &ScopeContext{in.memory, in.stack, contract}, in.evm.depth, err)
			}
			return nil, err
		}
		// ...
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
The `EVM`'s `Call` and `Create` methods show how `CaptureEnter` and `CaptureExit` hooks are used to trace the lifecycle of sub-calls and contract creations.

```go
// core/vm/evm.go

// Call runs the code of the given account with the given input data and returns
// the returned data and error status.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ...
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(CALL, caller.Address(), addr, input, gas, value)
		defer func() {
			evm.Config.Tracer.CaptureExit(ret, leftOverGas, err)
		}()
	}
	// ...
	// Run the interpreter
	ret, err = run(evm, contract, input, false)
	return ret, contract.Gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ...
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(CREATE, caller.Address(), contractAddr, code, gas, value)
		defer func() {
			evm.Config.Tracer.CaptureExit(ret, leftOverGas, err)
		}()
	}
	// ...
	// Run the interpreter
	ret, err = run(evm, contract, nil, false)
	// ...
	return ret, contractAddr, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
The `StructLogger` is a concrete implementation of `EVMLogger` that provides `debug_traceTransaction` functionality. It is an excellent reference for how to build a stateful tracer. The `StructLog` and `Config` structs define what data is captured and how tracing can be configured for performance.

```go
// eth/tracers/logger/logger.go

// Config are the options for tracing
type Config struct {
	EnableMemory     bool `json:"enableMemory"`
	DisableStack     bool `json:"disableStack"`
	DisableStorage   bool `json:"disableStorage"`
	EnableReturnData bool `json:"enableReturnData"`
	Debug            bool `json:"debug"`
	Limit            int  `json:"limit"`
	// ...
}

// StructLogger is a EVMLogger that captures full trace of the EVM's state
// during the execution of a transaction.
type StructLogger struct {
	cfg              Config
	logs             []StructLog
	// ...
	callStack        []callFrame
	// ...
}

// StructLog is a EVM state log for a single step.
type StructLog struct {
	Pc            uint64                  `json:"pc"`
	Op            vm.OpCode               `json:"op"`
	Gas           uint64                  `json:"gas"`
	GasCost       uint64                  `json:"gasCost"`
	Memory        []byte                  `json:"memory,omitempty"`
	MemorySize    int                     `json:"memSize"`
	Stack         []*big.Int              `json:"stack,omitempty"`
	ReturnData    []byte                  `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                     `json:"depth"`
	RefundCounter uint64                  `json:"refund"`
	Err           error                   `json:"-"`
	OpName        string                  `json:"opName"` 
	ErrorString   string                  `json:"error,omitempty"`
}

// CaptureState captures the contract state at the given moment in the EVM execution.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	// ...
	// Create the basic struct log object
	log := StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           gas,
		GasCost:       cost,
		Depth:         depth,
		RefundCounter: scope.Contract.Refund,
		OpName:        op.String(),
		ErrorString:   formatError(err),
	}
	// Capture memory if requested
	if l.cfg.EnableMemory {
		log.Memory = common.CopyBytes(scope.Memory.Data())
		log.MemorySize = scope.Memory.Len()
	}
	// Capture stack if requested
	if !l.cfg.DisableStack {
		log.Stack = make([]*big.Int, len(scope.Stack.Data()))
		for i, item := range scope.Stack.Data() {
			log.Stack[i] = new(big.Int).Set(item)
		}
	}
	// Capture return data if requested
	if l.cfg.EnableReturnData {
		log.ReturnData = common.CopyBytes(rData)
	}
	// Capture storage if requested
	if !l.cfg.DisableStorage {
		if !op.IsStatic() {
			l.changed[scope.Contract.Address()] = struct{}{}
		}
	}
	l.logs = append(l.logs, log)
	l.lastOp = op
}

// callFrame contains the useful information about a call environment
// for the structured logger.
type callFrame struct {
	callType    vm.OpCode
	from        common.Address
	to          common.Address
	value       *big.Int
	gas         uint64
	input       []byte
	err         error
	output      []byte
	gasUsed     uint64
	extra       interface{}
	isPrecompile bool
}

// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
func (l *StructLogger) CaptureEnter(typ vm.OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	// ...
	l.callStack = append(l.callStack, callFrame{
		callType:     typ,
		from:         from,
		to:           to,
		input:        common.CopyBytes(input),
		gas:          gas,
		value:        value,
		// ...
	})
}

// CaptureExit is called when the EVM exits a scope, even if the scope didn't
// execute successfully.
func (l *StructLogger) CaptureExit(output []byte, gasUsed uint64, err error) {
	// ...
	// Pop the last call frame and update fields
	l.reverted = err != nil
	l.output = common.CopyBytes(output)

	frame := l.callStack[len(l.callStack)-1]
	frame.output = common.CopyBytes(output)
	frame.gasUsed = gasUsed
	frame.err = err
	l.callStack[len(l.callStack)-1] = frame
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt outlines an excellent inspector framework, drawing heavily from the robust patterns seen in REVM. The `go-ethereum` (`geth`) implementation offers a slightly different but equally valid perspective that can enrich the final design.

Here are a few observations based on `geth`'s approach:

1.  **Single vs. Multiple Inspectors**: The prompt suggests an `InspectorManager` to handle multiple inspectors, similar to REVM's composable model. Geth, by contrast, injects a single `EVMLogger` interface into the `EVM` configuration. While a single logger is simpler, a manager provides greater flexibility for users to chain multiple independent analysis tools. The proposed manager approach is powerful and should be kept.

2.  **Granularity of Hooks**:
    *   The prompt proposes explicit hooks for memory and storage (`memory_read`, `storage_write`, etc.). Geth's `EVMLogger` does not have these. Instead, it provides a single `CaptureState` hook that is called for **every single opcode**.
    *   Inside `CaptureState`, the tracer can inspect the current `OpCode`. If it's an `MLOAD` or `SSTORE`, the tracer can then look at the `Stack` (via `ScopeContext`) to find the memory/storage addresses being accessed and then inspect the `Memory` or query the `StateDB`.
    *   This approach is less explicit but equally powerful. The `StructLogger` in Geth uses this method to track storage changes by marking contract addresses as "dirty" when state-changing opcodes are encountered, and then dumping their storage at the end of the transaction. This is a highly effective pattern for storage analysis without needing a hook on every `SSTORE`.

3.  **Context Objects**: Geth's `ScopeContext` is a lean struct that provides pointers to the `Memory`, `Stack`, and `Contract`. This gives the tracer immense power to inspect the full state of the current execution frame. The prompt's `StepContext` and `CallContext` are well-designed and combine details from the `ScopeContext` with other relevant data like `pc`, `gas`, and `depth`, which is a great approach.

4.  **Configuration**: The `StructLogger`'s `Config` struct (`EnableMemory`, `DisableStack`, etc.) is a critical pattern for performance. By allowing users to disable costly data captures (like full memory dumps on every step), the tracer can be tuned for specific use cases, minimizing overhead. This is a valuable feature to include in the Tevm inspector framework.

In summary, the provided Geth code complements the existing prompt by offering battle-tested examples of a tracer interface, its integration points, and concrete implementations that balance detail with performance.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/hooks.go">
```go
// Copyright 2024 The go-ethereum Authors
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
	"github.com/holiman/uint256"
)

// Hooks are the hooks that can be installed on the EVM.
// If a hook is nil, it is not called.
//
// Any hook function can return an error, and the error will be propagated by
// the EVM and returned to the caller.
//
// The hooks are not thread-safe. A EVM can only be used by a single thread at
// a time.
type Hooks struct {
	// OnTxStart is called when a transaction starts.
	OnTxStart func(env *VMContext, tx *types.Transaction, from common.Address)
	// OnTxEnd is called when a transaction ends.
	OnTxEnd func(receipt *types.Receipt, err error)
	// OnEnter is called when the EVM enters a new frame.
	OnEnter func(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	// OnExit is called when the EVM exits a frame.
	OnExit func(depth int, output []byte, gasUsed uint64, err error, reverted bool)
	// OnOpcode is called before each opcode is executed.
	OnOpcode func(pc uint64, op byte, gas, cost uint64, scope OpContext, rData []byte, depth int, err error)
	// OnFault is called when the EVM returns an error.
	OnFault func(pc uint64, op byte, gas, cost uint64, scope OpContext, depth int, err error)
	// OnGasChange is called when the gas changes.
	OnGasChange func(old, new uint64, reason GasChangeReason)
	// OnBalanceChange is called when the balance of an account changes.
	OnBalanceChange func(addr common.Address, prev, new *big.Int, reason BalanceChangeReason)
	// OnNonceChange is called when the nonce of an account changes.
	OnNonceChange func(addr common.Address, prev, new uint64)
	// OnCodeChange is called when the code of an account changes.
	OnCodeChange func(addr common.Address, prevCodeHash common.Hash, prevCode []byte, codeHash common.Hash, code []byte)
	// OnStorageChange is called when the storage of an account changes.
	OnStorageChange func(addr common.Address, slot, prev, new common.Hash)
	// OnLog is called when a log is emitted.
	OnLog func(*types.Log)
	// OnBlockHash is called when a block hash is read.
	OnBlockHashRead func(number uint64, hash common.Hash)
	// OnClose is called when the tracer is closed.
	OnClose func()
}

// OpContext is the context for the OnOpcode hook.
type OpContext interface {
	MemorySize() int
	MemoryData() []byte
	StackSize() int
	StackData() []uint256.Int
	PC() uint64
	Opcode() byte
	Gas() uint64
	RemainingGas() uint64
	Address() common.Address
	Caller() common.Address
	CallValue() *uint256.Int
	CallInput() []byte
	ContractCode() []byte
}

// VMContext is the context for the OnTxStart hook.
type VMContext interface {
	GetHash(uint64) common.Hash
	StateDB
}

// StateDB is a subset of the methods of state.StateDB interface that a tracer
// has access to.
type StateDB interface {
	GetBalance(common.Address) *uint256.Int
	GetNonce(common.Address) uint64
	GetCode(common.Address) []byte
	GetCodeHash(common.Address) common.Hash
	GetCodeSize(common.Address) int
	GetState(common.Address, common.Hash) common.Hash
	GetCommittedState(common.Address, common.Hash) common.Hash
	GetRefund() uint64
	Exist(common.Address) bool
	Empty(common.Address) bool
}

// GasChangeReason represents the reason for a gas change.
type GasChangeReason string

const (
	GasChangeUnspecified                GasChangeReason = ""
	GasChangeCall                       GasChangeReason = "call"
	GasChangeCallCode                   GasChangeReason = "call_code"
	GasChangeDelegateCall               GasChangeReason = "delegate_call"
	GasChangeStaticCall                 GasChangeReason = "static_call"
	GasChangeCreate                     GasChangeReason = "create"
	GasChangeCreate2                    GasChangeReason = "create2"
	GasChangeSelfdestruct               GasChangeReason = "selfdestruct"
	GasChangeRefund                     GasChangeReason = "refund"
	GasChangeEip2929ColdAccountAccess   GasChangeReason = "eip_2929_cold_account_access"
	GasChangeEip2929ColdStorageAccess   GasChangeReason = "eip_2929_cold_storage_access"
	GasChangeEip2929WarmStorageRead     GasChangeReason = "eip_2929_warm_storage_read"
	GasChangeEip3529SStoreClear         GasChangeReason = "eip_3529_sstore_clear"
	GasChangeEip3860InitCode            GasChangeReason = "eip_3860_init_code"
	GasChangeEip3540                             = "eip_3540" // a.k.a. eof create
	GasChangeEip4844Data                         = "eip_4844_data"
	GasChangeOpCodeLog                           = "opcode_log"
	GasChangeOpCodeSha3                          = "opcode_sha3"
	GasChangeOpCodeExtCodeCopy                   = "opcode_extcodecopy"
	GasChangeOpCodeReturnDataCopy                = "opcode_returndatacopy"
	GasChangeOpCodeCallDataCopy                  = "opcode_calldatacopy"
	GasChangeOpCodeCodeCopy                      = "opcode_codecopy"
	GasChangeOpCodeExp                           = "opcode_exp"
	GasChangeOpCodeSStore                        = "opcode_sstore"
	GasChangeUnused                              = "unused_gas"
	GasChangePrecompileSha256                    = "precompile_sha256"
	GasChangePrecompileRipemd160                 = "precompile_ripemd160"
	GasChangePrecompileBlake2f                   = "precompile_blake2f"
	GasChangePrecompileIdentity                  = "precompile_identity"
	GasChangePrecompileModexp                    = "precompile_modexp"
	GasChangePrecompileBn256Pairing              = "precompile_bn256_pairing"
	GasChangePrecompileBn256Add                  = "precompile_bn256_add"
	GasChangePrecompileBn256ScalarMul            = "precompile_bn256_scalar_mul"
	GasChangePrecompilePointEvaluation           = "precompile_point_evaluation"
	GasChangeEip6493SStore                       = "eip6493_sstore"
)

// BalanceChangeReason represents the reason for a balance change.
type BalanceChangeReason string

const (
	BalanceChangeUnspecified      BalanceChangeReason = ""
	BalanceChangeRewardMineUncle  BalanceChangeReason = "reward_mine_uncle"
	BalanceChangeRewardMineBlock  BalanceChangeReason = "reward_mine_block"
	BalanceChangeSelfdestruct     BalanceChangeReason = "selfdestruct"
	BalanceChangeSelfdestructBurn BalanceChangeReason = "selfdestruct_burn"
	BalanceChangeCall             BalanceChangeReason = "call"
	BalanceChangeCreate           BalanceChangeReason = "create"
	BalanceChangeCreate2          BalanceChangeReason = "create2"
	BalanceChangeFee              BalanceChangeReason = "fee"
	BalanceChangeFeeBlob          BalanceChangeReason = "fee_blob"
	BalanceChangeRefund           BalanceChangeReason = "refund"
	BalanceChangeWithdrawal       BalanceChangeReason = "withdrawal"
	BalanceChangeEofCreate        BalanceChangeReason = "eof_create"
	BalanceChangeAuth             BalanceChangeReason = "auth"
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
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

package logger

import (
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"maps"
	"sync/atomic"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/math"
	"github.com/ethereum/go-ethereum/core/tracing"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/holiman/uint256"
)

// Storage represents a contract's storage.
type Storage map[common.Hash]common.Hash

// Config are the configuration options for structured logger the EVM
type Config struct {
	EnableMemory     bool `json:"enableMemory"`     // enable memory capture
	DisableStack     bool `json:"disableStack"`     // disable stack capture
	DisableStorage   bool `json:"disableStorage"`   // disable storage capture
	EnableReturnData bool `json:"enableReturnData"` // enable return data capture
	Limit            int  `json:"limit"`            // maximum size of output, but zero means unlimited
	// Chain overrides, can be used to execute a trace using future fork rules
	Overrides *params.ChainConfig `json:"overrides,omitempty"`
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
	Stack         []uint256.Int               `json:"stack"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"-"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"`
}

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

// ... (constructor and other methods) ...

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
	// check if already accumulated the size of the response.
	if l.cfg.Limit != 0 && l.resultSize > l.cfg.Limit {
		return
	}
	var (
		op           = vm.OpCode(opcode)
		memory       = scope.MemoryData()
		contractAddr = scope.Address()
		stack        = scope.StackData()
		stackLen     = len(stack)
	)
	log := StructLog{pc, op, gas, cost, nil, len(memory), nil, nil, nil, depth, l.env.StateDB.GetRefund(), err}
	if l.cfg.EnableMemory {
		log.Memory = memory
	}
	if !l.cfg.DisableStack {
		log.Stack = scope.StackData()
	}
	if l.cfg.EnableReturnData {
		log.ReturnData = rData
	}

	// Copy a snapshot of the current storage to a new container
	var storage Storage
	if !l.cfg.DisableStorage && (op == vm.SLOAD || op == vm.SSTORE) {
		// initialise new changed values storage container for this contract
		// if not present.
		if l.storage[contractAddr] == nil {
			l.storage[contractAddr] = make(Storage)
		}
		// capture SLOAD opcodes and record the read entry in the local storage
		if op == vm.SLOAD && stackLen >= 1 {
			var (
				address = common.Hash(stack[stackLen-1].Bytes32())
				value   = l.env.StateDB.GetState(contractAddr, address)
			)
			l.storage[contractAddr][address] = value
			storage = maps.Clone(l.storage[contractAddr])
		} else if op == vm.SSTORE && stackLen >= 2 {
			// capture SSTORE opcodes and record the written entry in the local storage.
			var (
				value   = common.Hash(stack[stackLen-2].Bytes32())
				address = common.Hash(stack[stackLen-1].Bytes32())
			)
			l.storage[contractAddr][address] = value
			storage = maps.Clone(l.storage[contractAddr])
		}
	}
	log.Storage = storage

	// create a log
	if l.writer == nil {
		entry := log.toLegacyJSON()
		l.resultSize += len(entry)
		l.logs = append(l.logs, entry)
		return
	}
	log.WriteTo(l.writer)
}

// ... (other hook implementations) ...

// ExecutionResult groups all structured logs emitted by the EVM
// while replaying a transaction in debug mode as well as transaction
// execution status, the amount of gas used and the return value
type ExecutionResult struct {
	Gas         uint64            `json:"gas"`
	Failed      bool              `json:"failed"`
	ReturnValue hexutil.Bytes     `json:"returnValue"`
	StructLogs  []json.RawMessage `json:"structLogs"`
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// ...

// EVM is the Ethereum Virtual Machine base object for the geth implementation.
type EVM struct {
	// Context provides information about the current execution environment
	Context vm.BlockContext
	// StateDB gives access to the underlying state object
	StateDB vm.StateDB
	// depth is the current call stack depth
	depth int

	// chain rules
	chainRules params.Rules

	// virtual machine configuration options used to run the contract
	vmConfig vm.Config

	// global (to this context) ethereum virtual machine
	// used throughout the execution of the tx.
	interpreter *Interpreter
	// a shared cache for gas costs of simple opcodes
	gasCache gasCache

	// chain context operations
	chain chainCtx

	// The following fields are copied from the parent when a new memory is created
	// and are not changed during execution.
	readOnly   bool   // whether to throw unable to writing to state
	origin     common.Address
	gasPrice   *big.Int
	gasInitial uint64

	// The following fields are reset when the call stack returns.
	gas          uint64
	reverted     bool
	output       []byte
	err          error
	snapshot     int
	returnGas    uint64
	inJump       bool
	jumpDests    bitvec // Aggregated jump destination analysis of all contracts
	activePre    common.Address
	activePreGas uint64

	// The following fields are used for tracing and are nil if tracing is not enabled.
	hooks *tracing.Hooks
}

// ...

// run runs the EVM code with the given input and returns the final gas
// consumption and output. It's the main entry point for EVM execution.
func (evm *EVM) run(contract *Contract, input []byte) (ret []byte, err error) {
	// The call is prepared for execution. The 'gas' is set and the 'input' is set.
	// This function returns with an error if the contract execution requires more gas
	// than is available in the call.
	//
	// No important changes have been made in this method.
	//
	// Note, that even if the initial gas might be not enough, the EVM needs to be
	// executed so that the remaining gas can be returned to the caller.
	// An error will be returned in that case.
	contract.Input = input
	if contract.Gas > evm.gas {
		return nil, vm.ErrOutOfGas
	}
	evm.gas -= contract.Gas

	// In case of a tracer is configured, call start.
	if evm.hooks != nil {
		evm.hooks.OnEnter(evm.depth, contract.opCode.ToUint8(), contract.caller, contract.Address(), input, contract.Gas, contract.value.ToBig())
		defer func() {
			evm.hooks.OnExit(evm.depth, ret, contract.Gas-evm.gas, err, evm.reverted)
		}()
	}
	// Make a snapshot of the current state and temporary revert to it
	// in case of an error.
	evm.snapshot = evm.StateDB.Snapshot()

	// Don't abort on pre-existing error
	var (
		op          vm.OpCode        // current opcode
		mem         = NewMemory()    // bound memory
		stack       = newstack()     // local stack
		callContext = &ScopeContext{ // a context which we can pass to all the operations
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
	)

	// run the evm
	for {
		// Check for execution cancellation in between opcodes
		if evm.interpreter.cancelled() {
			return nil, vm.ErrExecutionAborted
		}
		// Opcode execution hooks
		if evm.hooks != nil {
			evm.hooks.OnOpcode(contract.PC(), op.ToUint8(), evm.gas, 0, callContext, evm.interpreter.returnData.data(), evm.depth, evm.err)
		}

		// fetch the next opcode from the contract
		op = contract.GetOp(contract.PC())

		// gas setup and get the operation from the jump table
		operation := evm.interpreter.exec[op]
		if operation == nil {
			return nil, vm.ErrInvalidOpcode
		}
		// validate the stack
		if err = operation.validateStack(stack); err != nil {
			return nil, err
		}
		// execute the operation
		var (
			gas      = operation.constantGas // For tracing only
			gasCost  = gas                   // For tracing only
			cost     = gas
			afterGas = evm.gas
		)
		if dynamic, ok := operation.dynamicGas.(GasFunc); ok {
			var memorySize uint64
			// All ops with a dynamic gas cost are memory-related.
			// However, some like SHA3 are memory-related but have a fixed cost.
			if operation.memorySize != nil {
				memorySize, err = operation.memorySize(stack)
				if err != nil {
					return nil, err
				}
			}
			// calculate the dynamic gas, and handle any errors
			var dynamicCost uint64
			dynamicCost, err = dynamic(evm, contract, stack, mem, memorySize)
			if err != nil {
				return nil, err
			}
			cost += dynamicCost
			gasCost = cost
		}
		if evm.gas < cost {
			return nil, vm.ErrOutOfGas
		}
		evm.gas -= cost
		afterGas = evm.gas

		// execute the operation
		res, err := operation.execute(&contract.pc, evm, callContext)
		if err != nil {
			return nil, err
		}
		// if the operation is a JUMP, we need to check if the destination is valid
		evm.inJump = op == vm.JUMP || op == vm.JUMPI

		// increment the program counter
		contract.pc++

		// if the program counter is returned, set it
		if len(res) > 0 {
			contract.pc = uint64(new(uint256.Int).SetBytes(res).Uint64())
		}
		// If the operation has a return value, it is pushed on top of the stack.
		if operation.returns {
			// A copy of the return value is made because it is not allowed to alias
			// the memory of the interpreter.
			var rval [32]byte
			new(uint256.Int).SetBytes(res).WriteToSlice(rval[:])
			stack.push(&rval)
		}

		if err = evm.interpreter.readInstructionResult(mem, stack, &contract.pc, contract, &evm.reverted, &evm.gas); err != nil {
			return nil, err
		}
		if evm.interpreter.stopped {
			break
		}
	}
	return evm.interpreter.returnData.data(), evm.err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/api.go">
```go
// ... (imports) ...

// txTraceResult is the result of a single transaction trace.
type txTraceResult struct {
	TxHash common.Hash `json:"txHash"`           // transaction hash
	Result interface{} `json:"result,omitempty"` // Trace results produced by the tracer
	Error  string      `json:"error,omitempty"`  // Trace failure produced by the tracer
}

// ...

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
	tracingStateDB := state.NewHookedState(statedb, tracer.Hooks)
	evm := vm.NewEVM(vmctx, tracingStateDB, api.backend.ChainConfig(), vm.Config{Tracer: tracer.Hooks, NoBaseFee: true})
	if precompiles != nil {
		evm.SetPrecompiles(precompiles)
	}

	// Define a meaningful timeout of a single transaction trace
	if config.Timeout != nil {
		if timeout, err = time.ParseDuration(*config.Timeout); err != nil {
			return nil, err
		}
	}
	deadlineCtx, cancel := context.WithTimeout(ctx, timeout)
	go func() {
		<-deadlineCtx.Done()
		if errors.Is(deadlineCtx.Err(), context.DeadlineExceeded) {
			tracer.Stop(errors.New("execution timeout"))
			// Stop evm execution. Note cancellation is not necessarily immediate.
			evm.Cancel()
		}
	}()
	defer cancel()

	// Call Prepare to clear out the statedb access list
	statedb.SetTxContext(txctx.TxHash, txctx.TxIndex)
	_, err = core.ApplyTransactionWithEVM(message, new(core.GasPool).AddGas(message.GasLimit), statedb, vmctx.BlockNumber, txctx.BlockHash, vmctx.Time, tx, &usedGas, evm)
	if err != nil {
		return nil, fmt.Errorf("tracing failed: %w", err)
	}
	return tracer.GetResult()
}
```
</file>
</go-ethereum>
<prompt-corrections>
- The original prompt used the term "Inspector" which is common in other EVM implementations like REVM. In go-ethereum, the equivalent concepts are `Tracer` and `EVMLogger`. The more modern and relevant interface is the `Hooks` struct in `core/tracing/hooks.go`.
- The prompt defined an `InspectorAction` enum with `Continue`, `Skip`, `Halt`, `Revert`. Geth's tracing framework is observational and does not allow modifying execution flow (like `Skip`). Execution termination (`Halt`, `Revert`) is signaled via returned errors from the EVM's `run` loop, which the tracer can then capture in its `OnFault` or `OnExit` hooks.
- The prompt's `StepContext` and `CallContext` are well-defined. The go-ethereum equivalent for `StepContext` is the `OpContext` interface, and for `CallContext` it's the arguments passed to the `OnEnter` hook.
- Geth's tracing framework includes detailed reasons for state changes (e.g., `BalanceChangeReason`), which is a valuable pattern to include for providing rich contextual information to tracers. This was not explicitly requested but is a best-practice from a production implementation.
</prompt-corrections>

---

Here are the most relevant code snippets from the go-ethereum codebase to help implement the Inspector Framework.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// Tracer is a generic interface for logging/tracing execution steps of the EVM.
//
// Implementations of this interface can be used to capture execution state on a
// step-by-step basis, for debugging or analysis purposes.
type Tracer interface {
	// CaptureStart is called once at the beginning of a new transaction, before any
	// execution of EVM code has taken place.
	CaptureStart(from common.Address, to common.Address, call []byte, gas uint64, value *big.Int)

	// CaptureEnd is called once at the end of a transaction, after all EVM code has
	// been executed.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureState is called on each step of the VM, just before the execution of an
	// opcode.
	//
	// Note that the scope parameter is not persisted and can only be used within this
	// call. It is not safe to be stored and used afterwards.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called on each step of the VM that results in an error.
	//
	// It is invoked only when an error happens, after CaptureState.
	// This method is not called if an error happens in a call to an external contract or
	// precompiled contract.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits a scope, returning to the previous one.
	CaptureExit(output []byte, gasUsed uint64, err error)
}

// StructLogger is a Tracer that records execution of an EVM contract into a series
// of structs, one for each step.
//
// StructLogger can be configured to disable some of the expensive data collecting
// operations.
type StructLogger struct {
	cfg *Config // Config can be used to disable parts of the logger

	// Struct logger options
	storage map[common.Hash]types.Storage // Current contract's storage, taking into account the prior modifications
	logs    []StructLog
	output  []byte
	err     error

	// low level execution state
	gas         uint64
	memory      *Memory
	stack       *Stack
	rData       []byte
	callStack   []common.Address // Call stack of the logger, different from the EVM call stack
	txStart     time.Time
	mu          sync.Mutex // mu protects the struct logger
	interrupt   atomic.Bool
	reason      error // reason for interrupt
	skip        atomic.Bool
	reverted    bool
	systemCall  bool // Whether we are in a system call.
	currentTime int64
}

// StructLog is a structured log message used in the EVM tracer.
type StructLog struct {
	Pc            uint64                  `json:"pc"`
	Op            string                  `json:"op"`
	Gas           uint64                  `json:"gas"`
	GasCost       uint64                  `json:"gasCost"`
	Memory        hexutil.Bytes           `json:"memory"`
	MemorySize    int                     `json:"memSize"`
	Stack         []hexutil.U256          `json:"stack"`
	ReturnData    hexutil.Bytes           `json:"returnData"`
	Storage       map[common.Hash]common.Hash `json:"storage"`
	Depth         int                     `json:"depth"`
	RefundCounter uint64                  `json:"refund"`
	Err           string                  `json:"error,omitempty"`
}

// CaptureState captures the contract's state at a particular point in time.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// ... (implementation details)
}

// CaptureEnter is called when the EVM enters a new scope (via call, create or selfdestruct).
func (l *StructLogger) CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	// ... (implementation details)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Config are the configuration options for the EVM.
type Config struct {
	// Tracer is an EVM state logger/tracer.
	Tracer Tracer

	// NoBaseFee forces the EIP-1559 base fee to 0 (needed for 0 price calls)
	NoBaseFee bool

	// EnablePreimageRecording switches on SHA3 preimages recording during execution.
	EnablePreimageRecording bool

	// ExtraEips lists the EIPs that are enabled in addition to the ones defined
	// by the chain configuration.
	ExtraEips []int
}


// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes
// the necessary steps to create accounts and initialize the code if necessary.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *big.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (setup code)

	// Capture the tracer start/end events in case of a top-level call
	if evm.depth == 0 {
		if evm.Config.Tracer != nil {
			evm.Config.Tracer.CaptureStart(caller.Address(), addr, input, gas, value)
		}
		defer func() {
			if evm.Config.Tracer != nil {
				evm.Config.Tracer.CaptureEnd(ret, gas-leftOverGas, err)
			}
		}()
	}
	// ... (precompile checks and other logic)

	// Create a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, codeAndHash.Hash, codeAndHash.Code)

	// Even if the account has no code, we have to handle the native token transfer.
	if len(contract.Code) == 0 {
		transfer(evm.StateDB, caller.Address(), addr, value)
		// Don't capture any enter/exit events for non-contract calls
		return nil, gas, nil
	}
	// Capture the tracer enter/exit events for contract calls
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(CALL, caller.Address(), addr, input, gas, value)
	}
	// Run the EVM code and capture the tracer exit event.
	ret, err = run(evm, contract, input)
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureExit(ret, gas-contract.Gas, err)
	}
	return ret, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm *EVM
	// ...
}

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
func (in *EVMInterpreter) Run(contract *Contract, input []byte) (ret []byte, err error) {
	// ... (setup)
	var (
		op    OpCode        // current opcode
		mem   = NewMemory() // bound memory
		stack = newstack()  // local stack
		// ...
		pc   = uint64(0) // program counter
		// ...
	)
	// ...

	// The execution loop
	for {
		// Capture the current state and trace it if required
		if in.evm.Config.Tracer != nil {
			in.evm.Config.Tracer.CaptureState(pc, op, gas, cost, scope, in.evm.interpreter.returnData, in.evm.depth, err)
		}
		// ... (gas checks)

		// Get the operation from the jump table and validate the stack
		op = contract.GetOp(pc)
		operation := in.opFn[op]
		// ... (stack validation)

		// Execute the operation
		res, err = operation.execute(&pc, in, scope)

		// ... (handle results and errors)
		pc++
	}
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a main-memory based stack which is used by the EVM.
// Items are pushed on top and can be popped off.
type Stack struct {
	data []*uint256.Int
}

// newstack creates a new stack with a backing store of size 1024.
func newstack() *Stack {
	return &Stack{data: make([]*uint256.Int, 0, 1024)}
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []*uint256.Int {
	return st.data
}

// Push pushes a new element on the stack.
func (st *Stack) Push(d *uint256.Int) {
	st.data = append(st.data, d)
}

// Pop pops the last-pushed element from the stack.
func (st *Stack) Pop() (ret *uint256.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory is a simple memory model for the EVM.
type Memory struct {
	store []byte
	// ...
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset + size to value. If value is larger than size, the value is cropped.
func (m *Memory) Set(offset, size uint64, value []byte) {
	// ... (implementation)
}

// Get returns a slice of memory starting at offset up to size.
func (m *Memory) Get(offset, size uint64) []byte {
	// ... (implementation)
	return m.get(offset, size)
}

// Data returns the full memory backing store.
func (m *Memory) Data() []byte {
	return m.store
}

// Len returns the length of the backing slice.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provides an excellent and comprehensive overview of inspector patterns from various EVM implementations. The proposed Zig interface is well-structured and covers all the necessary hooks. No significant corrections are needed for the prompt's structure or goals. The go-ethereum snippets above serve to reinforce and provide a canonical reference for these patterns, particularly:

1.  **Unified `Tracer` Interface**: Geth uses a single `Tracer` interface, which is passed in the EVM `Config`. This is slightly different from the `InspectorManager` pattern proposed but achieves a similar goal. A "multi-inspector" can be implemented as a single `Tracer` that internally delegates to a list of other tracers.
2.  **`StructLogger` as a Canonical Example**: The `StructLogger` is Geth's built-in implementation for `debug_traceTransaction`. It serves as a perfect, production-grade example of a complex inspector. It shows how to capture rich context at each step, including memory, stack, and storage.
3.  **Step-based vs. Hook-based Tracing**: The go-ethereum snippets highlight that much of the detailed tracing (like storage access) is often handled within the `CaptureState` (step) hook by inspecting the stack and contract state, rather than through dedicated `storage_read`/`storage_write` hooks. The prompt's inclusion of explicit hooks is a valid and potentially more efficient design, similar to `revm`'s approach. Both patterns are valid, and the choice depends on the desired granularity and performance trade-offs.
4.  **`ScopeContext`**: The context object passed to tracers in Geth is called `ScopeContext`. It contains references to the live `Stack`, `Memory`, and `Contract` objects. This is analogous to the prompt's `StepContext` and provides a good reference for what data is essential for an inspector to have.

