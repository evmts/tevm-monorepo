/// Stack manipulation operations module for the EVM
/// 
/// This module defines operations for manipulating the EVM's stack, including:
/// - POP: Remove items from the stack
/// - PUSH0: Push zero onto the stack
/// - DUP1-DUP16: Duplicate stack items
/// - SWAP1-SWAP16: Exchange stack items
/// 
/// The stack is the primary workspace for EVM computation, holding up to 1024
/// 256-bit values. Most operations consume their operands from the stack and
/// push results back onto it.

const std = @import("std");
const Operation = @import("operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const stack_ops = opcodes.stack;

/// POP operation (0x50): Remove Top Stack Item
/// 
/// Removes the top item from the stack and discards it.
/// Used to clean up the stack or discard unneeded values.
/// 
/// Stack: [..., a] → [...]
/// Gas: 2 (GasQuickStep)
/// 
/// Common uses:
/// - Discarding return values from functions
/// - Stack cleanup after computations
/// - Implementing stack-based control flow
pub const POP = Operation{
    .execute = stack_ops.op_pop,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// PUSH0 operation (0x5F): Push Zero
/// 
/// Pushes the value 0 onto the stack.
/// More efficient than PUSH1 0x00 for pushing zero.
/// 
/// Stack: [...] → [..., 0]
/// Gas: 2 (GasQuickStep)
/// 
/// Introduced in Shanghai (EIP-3855) as a gas optimization.
/// Commonly used for:
/// - Initializing values
/// - Boolean false
/// - Zero addresses
pub const PUSH0 = Operation{
    .execute = stack_ops.op_push0,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

/// DUP operations (0x80-0x8F): Duplicate Stack Items
/// 
/// DUP operations duplicate a stack item and push the copy onto the stack.
/// DUPn duplicates the nth stack item (1-indexed from the top).
/// 
/// General pattern for DUPn:
/// Stack: [..., value_n, ..., value_1] → [..., value_n, ..., value_1, value_n]
/// Gas: 3 (GasFastestStep) for all DUP operations

/// DUP1 operation (0x80): Duplicate 1st Stack Item
/// 
/// Duplicates the top stack item.
/// 
/// Stack: [..., a] → [..., a, a]
/// 
/// Most commonly used DUP operation.
pub const DUP1 = Operation{
    .execute = stack_ops.op_dup1,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY - 1,
};

/// DUP2 operation (0x81): Duplicate 2nd Stack Item
/// 
/// Stack: [..., b, a] → [..., b, a, b]
pub const DUP2 = Operation{
    .execute = stack_ops.op_dup2,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY - 1,
};

/// DUP3 operation (0x82): Duplicate 3rd Stack Item
/// 
/// Stack: [..., c, b, a] → [..., c, b, a, c]
pub const DUP3 = Operation{
    .execute = stack_ops.op_dup3,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP4 = Operation{
    .execute = stack_ops.op_dup4,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP5 = Operation{
    .execute = stack_ops.op_dup5,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 5,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP6 = Operation{
    .execute = stack_ops.op_dup6,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP7 = Operation{
    .execute = stack_ops.op_dup7,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP8 = Operation{
    .execute = stack_ops.op_dup8,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 8,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP9 = Operation{
    .execute = stack_ops.op_dup9,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 9,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP10 = Operation{
    .execute = stack_ops.op_dup10,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 10,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP11 = Operation{
    .execute = stack_ops.op_dup11,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 11,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP12 = Operation{
    .execute = stack_ops.op_dup12,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 12,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP13 = Operation{
    .execute = stack_ops.op_dup13,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 13,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP14 = Operation{
    .execute = stack_ops.op_dup14,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 14,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP15 = Operation{
    .execute = stack_ops.op_dup15,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 15,
    .max_stack = Stack.CAPACITY - 1,
};

/// DUP16 operation (0x8F): Duplicate 16th Stack Item
/// 
/// Stack: [..., p, o, n, m, l, k, j, i, h, g, f, e, d, c, b, a] →
///        [..., p, o, n, m, l, k, j, i, h, g, f, e, d, c, b, a, p]
/// 
/// Maximum depth for DUP operations.
pub const DUP16 = Operation{
    .execute = stack_ops.op_dup16,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 16,
    .max_stack = Stack.CAPACITY - 1,
};

/// SWAP operations (0x90-0x9F): Exchange Stack Items
/// 
/// SWAP operations exchange the top stack item with another item deeper in the stack.
/// SWAPn swaps the top item with the (n+1)th item (1-indexed from the top).
/// 
/// General pattern for SWAPn:
/// Stack: [..., value_n+1, ..., value_1] → [..., value_1, ..., value_n+1]
/// Gas: 3 (GasFastestStep) for all SWAP operations

/// SWAP1 operation (0x90): Swap Top Two Stack Items
/// 
/// Exchanges the top two stack items.
/// 
/// Stack: [..., b, a] → [..., a, b]
/// 
/// Most commonly used SWAP operation.
pub const SWAP1 = Operation{
    .execute = stack_ops.op_swap1,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP2 = Operation{
    .execute = stack_ops.op_swap2,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP3 = Operation{
    .execute = stack_ops.op_swap3,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP4 = Operation{
    .execute = stack_ops.op_swap4,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 5,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP5 = Operation{
    .execute = stack_ops.op_swap5,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP6 = Operation{
    .execute = stack_ops.op_swap6,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP7 = Operation{
    .execute = stack_ops.op_swap7,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 8,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP8 = Operation{
    .execute = stack_ops.op_swap8,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 9,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP9 = Operation{
    .execute = stack_ops.op_swap9,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 10,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP10 = Operation{
    .execute = stack_ops.op_swap10,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 11,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP11 = Operation{
    .execute = stack_ops.op_swap11,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 12,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP12 = Operation{
    .execute = stack_ops.op_swap12,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 13,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP13 = Operation{
    .execute = stack_ops.op_swap13,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 14,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP14 = Operation{
    .execute = stack_ops.op_swap14,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 15,
    .max_stack = Stack.CAPACITY,
};

pub const SWAP15 = Operation{
    .execute = stack_ops.op_swap15,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 16,
    .max_stack = Stack.CAPACITY,
};

/// SWAP16 operation (0x9F): Swap Top with 17th Stack Item
/// 
/// Stack: [..., q, p, o, n, m, l, k, j, i, h, g, f, e, d, c, b, a] →
///        [..., a, p, o, n, m, l, k, j, i, h, g, f, e, d, c, b, q]
/// 
/// Maximum depth for SWAP operations.
pub const SWAP16 = Operation{
    .execute = stack_ops.op_swap16,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 17,
    .max_stack = Stack.CAPACITY,
};
