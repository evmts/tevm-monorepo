# Error Handling Standardization

This document outlines the standardized error handling patterns for the EVM implementation.

## Current Error Types

### 1. ExecutionError.Error
Main error type for EVM execution errors, defined in `execution_error.zig`:
- STOP, REVERT, INVALID (control flow)
- OutOfGas, GasUintOverflow (gas-related)
- StackUnderflow, StackOverflow (stack-related)
- InvalidJump, InvalidOpcode (execution-related)
- StaticStateChange, WriteProtection (state modification)
- OutOfOffset, OutOfMemory, InvalidOffset, InvalidSize, MemoryLimitExceeded (memory-related)
- ReturnDataOutOfBounds, DeployCodeTooBig, MaxCodeSizeExceeded (contract-related)
- DepthLimit (call depth)
- ChildContextActive, NoChildContextToRevertOrCommit (memory context)

### 2. Stack.Error
Stack-specific errors, defined in `stack.zig`:
- Overflow (stack has 1024 elements)
- Underflow (pop from empty stack)
- OutOfBounds (invalid index access)
- InvalidPosition (invalid DUP/SWAP position)

### 3. Memory.MemoryError
Memory-specific errors, defined in `memory.zig`:
- OutOfMemory (allocation failure)
- InvalidOffset (offset outside bounds)
- InvalidSize (size exceeds limits)
- MemoryLimitExceeded (exceeds configured limit)
- ChildContextActive (operation on parent with active child)
- NoChildContextToRevertOrCommit (no child to revert/commit)

### 4. VM-level errors
Errors returned directly by VM methods:
- error.OutOfMemory (allocation failures in storage/balances)
- error.WriteProtection (static context violations)

## Current Error Handling Patterns

### 1. Stack Error Mapping
All opcode files use helper functions to map Stack errors to ExecutionError:
```zig
fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| switch (err) {
        Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
        else => return ExecutionError.Error.StackUnderflow,
    };
}
```

### 2. Memory Error Mapping
Memory errors are mapped to ExecutionError.Error.OutOfOffset:
```zig
frame.memory.set_word(offset_usize, value) catch return ExecutionError.Error.OutOfOffset;
```

### 3. VM Error Mapping
VM allocation errors are mapped to OutOfGas:
```zig
vm.set_storage(address, slot, value) catch |err| switch (err) {
    error.OutOfMemory => return ExecutionError.Error.OutOfGas,
    else => return err,
};
```

## Identified Inconsistencies

1. **Incomplete error mapping**: Some error mappings only handle specific cases and use "else => return same_error"
2. **Different mapping patterns**: Some use inline catch, others use explicit switch statements
3. **VM errors not standardized**: VM methods return raw errors that need mapping in each opcode
4. **Memory error mappings too generic**: All memory errors map to OutOfOffset, losing specificity
5. **No centralized error mapping**: Each opcode file has its own helper functions

## Standardization Recommendations

### 1. Centralized Error Mapping Module
Create `error_mapping.zig` with standardized mapping functions:
```zig
pub fn map_stack_error(err: Stack.Error) ExecutionError.Error {
    return switch (err) {
        Stack.Error.Overflow => ExecutionError.Error.StackOverflow,
        Stack.Error.Underflow => ExecutionError.Error.StackUnderflow,
        Stack.Error.OutOfBounds => ExecutionError.Error.StackUnderflow,
        Stack.Error.InvalidPosition => ExecutionError.Error.StackUnderflow,
    };
}

pub fn map_memory_error(err: Memory.MemoryError) ExecutionError.Error {
    return switch (err) {
        Memory.MemoryError.OutOfMemory => ExecutionError.Error.OutOfMemory,
        Memory.MemoryError.InvalidOffset => ExecutionError.Error.InvalidOffset,
        Memory.MemoryError.InvalidSize => ExecutionError.Error.InvalidSize,
        Memory.MemoryError.MemoryLimitExceeded => ExecutionError.Error.MemoryLimitExceeded,
        Memory.MemoryError.ChildContextActive => ExecutionError.Error.ChildContextActive,
        Memory.MemoryError.NoChildContextToRevertOrCommit => ExecutionError.Error.NoChildContextToRevertOrCommit,
    };
}

pub fn map_vm_error(err: anyerror) ExecutionError.Error {
    return switch (err) {
        error.OutOfMemory => ExecutionError.Error.OutOfGas,
        error.WriteProtection => ExecutionError.Error.WriteProtection,
        else => ExecutionError.Error.OutOfGas, // Conservative default
    };
}
```

### 2. Standardized Helper Functions
Replace local helpers with centralized ones:
```zig
const error_mapping = @import("../error_mapping.zig");

// Use standardized stack operations
pub fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| error_mapping.map_stack_error(err);
}

pub fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| error_mapping.map_stack_error(err);
}
```

### 3. Consistent Error Propagation
Use consistent patterns for error handling:
```zig
// For operations that should map errors
const result = try operation() catch |err| return error_mapping.map_type_error(err);

// For operations that should propagate as-is
const result = try operation();
```

### 4. VM Method Error Standardization
Update VM methods to return ExecutionError.Error directly:
```zig
// Instead of returning error.OutOfMemory
pub fn set_storage(self: *Self, address: Address.Address, slot: u256, value: u256) ExecutionError.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    self.storage.put(key, value) catch return ExecutionError.Error.OutOfGas;
}
```

## Implementation Plan

1. Create `error_mapping.zig` with all mapping functions
2. Update all opcode files to use centralized error mapping
3. Update VM methods to return ExecutionError.Error
4. Remove local error helper functions
5. Ensure all error paths are properly mapped
6. Add tests for error mapping functions

## Benefits

1. **Consistency**: All errors handled the same way across the codebase
2. **Maintainability**: Single place to update error mappings
3. **Clarity**: Clear separation between error types and their meanings
4. **Debugging**: Proper error types preserved for better diagnostics
5. **Type Safety**: Compiler ensures all error cases are handled