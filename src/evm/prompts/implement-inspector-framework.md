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