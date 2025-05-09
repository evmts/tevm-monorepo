# Error Handling and Status Codes in ZigEVM

This directory contains the implementation of the error handling and status code system for ZigEVM.

## Overview

Error handling in an Ethereum Virtual Machine (EVM) implementation is critical for:

1. **Security**: Ensuring contract execution halts appropriately on error conditions
2. **Compatibility**: Matching Ethereum's error handling semantics precisely
3. **Debugging**: Providing clear information about what went wrong and why
4. **State Management**: Handling reverts and state changes correctly

## Key Components

### `error_handling.zig`

This file implements comprehensive error handling with:

- **`StatusCode` enum**: An expanded status code system based on revm's `InstructionResult`, covering:
  - Success states (Stop, Return, SelfDestruct)
  - Reversion states (Revert)
  - Error states (OutOfGas, InvalidOpcode, StackOverflow, etc.)

- **`ExecutionStatus` struct**: For propagating execution status and results, with methods:
  - `shouldContinue()`: Checks if execution should continue
  - `isSuccess()`: Checks if execution terminated successfully
  - `isRevert()`: Checks if execution reverted
  - `isError()`: Checks if an error occurred
  - `fromError()`: Converts ZigEVM `Error` to `StatusCode`
  - `toError()`: Converts `StatusCode` to ZigEVM `Error`
  - `toExecutionResult()`: Converts to the final `ExecutionResult` type

- **`CallResult` struct**: For handling errors when calling external contracts

## Error Propagation

Errors in ZigEVM are propagated through the call stack:

1. **Execution Level**: Opcodes return `Error` values which are caught by the interpreter
2. **Interpreter Level**: The interpreter converts errors to `ExecutionResult`
3. **Call Stack Level**: Errors propagate upward through nested calls

## Implementation Standards

Our error handling implementation follows these key principles:

1. **Early Detection**: Check for errors as early as possible
2. **Complete Coverage**: Handle all possible error conditions
3. **Clear Messaging**: Provide specific error types
4. **Consistent Handling**: Ensure errors are handled consistently throughout the codebase
5. **State Reversion**: Properly revert state changes on errors

## Error Types

The following error types are defined in `types.zig`:

```zig
pub const Error = error{
    // Stack-related errors
    StackOverflow,
    StackUnderflow,
    
    // Gas-related errors
    OutOfGas,
    
    // Instruction-related errors
    InvalidOpcode,
    InvalidJump,
    InvalidJumpDest,
    
    // State-related errors
    WriteProtection,
    
    // Memory-related errors
    ReturnDataOutOfBounds,
    InvalidOffset,
    
    // Call-related errors
    CallDepthExceeded,
    
    // Format-related errors
    InvalidAddressLength,
    InvalidHashLength,
    InvalidU256Length,
    InvalidHexString,
    
    // State-related errors
    AccountNotFound,
    
    // Other errors
    InternalError,
};
```

## Usage Examples

### Handling Errors in Opcode Implementations

```zig
pub fn div(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) Error!void {
    // Check gas
    if (gas_left.* < 5) {
        return Error.OutOfGas;
    }
    gas_left.* -= 5;
    
    // Pop values from stack (may throw StackUnderflow)
    const divisor = try stack.pop();
    const dividend = try stack.pop();
    
    // Handle division by zero (with special EVM semantics)
    var result = U256.zero();
    if (!divisor.isZero()) {
        // Only perform the division if divisor is not zero
        // This implements the EVM spec where division by zero returns zero
        // instead of throwing an error
        result = dividend.div(divisor);
    }
    
    // Push result to stack (may throw StackOverflow)
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}
```

### Handling Errors in the Interpreter

```zig
pub fn execute(self: *Interpreter) ExecutionResult {
    // ... code ...
    
    // Execute instruction
    dispatch.executeInstruction(...) catch |err| {
        // Handle execution errors
        switch (err) {
            Error.OutOfGas => {
                return .{
                    .Error = .{
                        .error_type = err,
                        .gas_used = self.original_gas,
                    }
                };
            },
            // Handle other errors
            // ...
        }
    };
    
    // ... more code ...
}
```

## Testing

Comprehensive tests for error handling are provided in:

1. `src/tests/components/error_handling_test.zig` - Basic error handling functionality
2. `src/tests/components/error_propagation_test.zig` - Error propagation through call stack
3. `src/tests/components/state_reversion_test.zig` - State reversion on errors
4. `src/tests/components/error_handling_integration_test.zig` - Integration tests
5. `src/tests/components/error_case_opcodes_test.zig` - Error cases for specific opcodes
6. `src/tests/components/error_handling_context_test.zig` - Context-specific error handling

These tests ensure that the error handling system correctly detects, propagates, and handles all error conditions in the EVM.