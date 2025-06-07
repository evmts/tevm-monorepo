/// Miscellaneous operations module for the EVM
/// 
/// This module contains operations that don't fit neatly into other categories,
/// including the GAS operation for querying remaining gas, undefined operation
/// handling, and historical variants of operations like SLOAD.

const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const ExecutionError = @import("../execution_error.zig");
const Frame = @import("../frame.zig");
const opcodes = @import("../opcodes/package.zig");

/// UNDEFINED operation: Placeholder for Invalid Opcodes
/// 
/// This operation is used in the jump table for opcodes that are not
/// assigned to any valid operation. Executing an undefined opcode always
/// results in an error and consumes all remaining gas.
/// 
/// Stack: [...] → [] (execution fails)
/// Gas: All remaining gas
/// 
/// Any opcode not explicitly defined in the EVM specification behaves
/// as UNDEFINED, causing immediate failure of the transaction.
pub const UNDEFINED = Operation{
    .execute = undefined_execute,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
    .undefined = true,
};

/// Implementation function for UNDEFINED operation
/// 
/// Always returns InvalidOpcode error when executed.
/// This ensures that any attempt to execute an undefined opcode
/// properly fails the transaction.
fn undefined_execute(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    return ExecutionError.Error.InvalidOpcode;
}

/// GAS operation (0x5A): Get Remaining Gas
/// 
/// Pushes the amount of gas remaining in the current call frame onto the stack.
/// This is the gas available after deducting the cost of the GAS operation itself.
/// 
/// Stack: [...] → [..., gas_remaining]
/// Gas: 2 (GasQuickStep)
/// 
/// Note: The value pushed is the gas remaining AFTER this operation,
/// so it will be at least 2 less than the gas before the operation.
/// 
/// Common uses:
/// - Gas introspection for optimization
/// - Conditional logic based on available gas
/// - Ensuring sufficient gas for subsequent operations
pub const GAS = Operation{
    .execute = gas_op,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// Implementation function for GAS operation
/// 
/// Retrieves the remaining gas from the current frame and pushes it to the stack.
fn gas_op(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try stack_push(&frame.stack, @as(u256, @intCast(frame.gas_remaining)));

    return Operation.ExecutionResult{};
}

/// Helper function to push values to the stack with proper error handling
/// 
/// Converts Stack errors to ExecutionError for consistent error handling
/// throughout the EVM implementation.
inline fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| switch (err) {
        Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
        else => return ExecutionError.Error.StackOverflow,
    };
}

/// SLOAD operation for Frontier to Tangerine Whistle
/// 
/// Early version of storage load with low gas cost.
/// This variant was susceptible to DoS attacks due to the low cost
/// of accessing storage.
/// 
/// Stack: [..., key] → [..., value]
/// Gas: 50 (SloadGas)
/// 
/// Used in hardforks: Frontier, Homestead
pub const SLOAD_FRONTIER_TO_TANGERINE = Operation{
    .execute = opcodes.storage.op_sload,
    .constant_gas = opcodes.gas_constants.SloadGas, // 50
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// SLOAD operation for Tangerine Whistle to Istanbul
/// 
/// Increased gas cost to mitigate storage-based DoS attacks.
/// This made storage access more expensive to prevent abuse.
/// 
/// Stack: [..., key] → [..., value]
/// Gas: 200
/// 
/// Used in hardforks: Tangerine Whistle through Byzantium
pub const SLOAD_TANGERINE_TO_ISTANBUL = Operation{
    .execute = opcodes.storage.op_sload,
    .constant_gas = 200,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// SLOAD operation for Istanbul to Berlin
/// 
/// Further increased gas cost as part of ongoing gas repricing efforts.
/// Istanbul introduced many gas cost changes to better reflect actual costs.
/// 
/// Stack: [..., key] → [..., value]
/// Gas: 800
/// 
/// Used in hardforks: Istanbul, Muir Glacier
/// 
/// Note: Berlin introduces access lists and warm/cold storage distinction,
/// so this is the last version with a fixed gas cost.
pub const SLOAD_ISTANBUL_TO_BERLIN = Operation{
    .execute = opcodes.storage.op_sload,
    .constant_gas = 800,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};
