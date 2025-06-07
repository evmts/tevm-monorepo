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

// DUP operations (0x80-0x8F) are now generated directly in jump_table.zig using make_dup()

// SWAP operations (0x90-0x9F) are now generated directly in jump_table.zig using make_swap()
