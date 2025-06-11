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

## References

- [Rust trait objects](https://doc.rust-lang.org/book/ch17-02-trait-objects.html) - Similar pattern
- [Zig interfaces](https://zig.guide/language-basics/interfaces) - Zig interface patterns
- [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) - Design pattern reference
- [REVM Inspector](https://github.com/bluealloy/revm/tree/main/crates/revm/src/inspector) - Reference implementation