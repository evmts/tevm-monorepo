/// Comparison operations module for the EVM
/// 
/// This module defines all comparison operations for evaluating relationships
/// between 256-bit values. These operations are essential for conditional logic,
/// bounds checking, and implementing control flow in smart contracts.
/// All comparisons return 1 for true and 0 for false.

const std = @import("std");
const Operation = @import("operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const comparison = opcodes.comparison;

/// LT operation (0x10): Less Than (Unsigned)
/// 
/// Compares two unsigned 256-bit integers and returns 1 if the first
/// is less than the second, 0 otherwise.
/// 
/// Stack: [..., a, b] → [..., a < b ? 1 : 0]
/// Gas: 3 (GasFastestStep)
/// 
/// Example: LT(5, 10) = 1, LT(10, 5) = 0
pub const LT = Operation{
    .execute = comparison.op_lt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// GT operation (0x11): Greater Than (Unsigned)
/// 
/// Compares two unsigned 256-bit integers and returns 1 if the first
/// is greater than the second, 0 otherwise.
/// 
/// Stack: [..., a, b] → [..., a > b ? 1 : 0]
/// Gas: 3 (GasFastestStep)
/// 
/// Example: GT(10, 5) = 1, GT(5, 10) = 0
pub const GT = Operation{
    .execute = comparison.op_gt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// SLT operation (0x12): Signed Less Than
/// 
/// Compares two signed 256-bit integers (two's complement) and returns 1
/// if the first is less than the second, 0 otherwise.
/// 
/// Stack: [..., a, b] → [..., a < b ? 1 : 0] (signed comparison)
/// Gas: 3 (GasFastestStep)
/// 
/// Example: SLT(-5, 5) = 1, SLT(5, -5) = 0
/// Note: In two's complement, 0xFF...FF represents -1
pub const SLT = Operation{
    .execute = comparison.op_slt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// SGT operation (0x13): Signed Greater Than
/// 
/// Compares two signed 256-bit integers (two's complement) and returns 1
/// if the first is greater than the second, 0 otherwise.
/// 
/// Stack: [..., a, b] → [..., a > b ? 1 : 0] (signed comparison)
/// Gas: 3 (GasFastestStep)
/// 
/// Example: SGT(5, -5) = 1, SGT(-5, 5) = 0
/// Note: In two's complement, 0xFF...FF represents -1
pub const SGT = Operation{
    .execute = comparison.op_sgt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// EQ operation (0x14): Equality
/// 
/// Compares two 256-bit values for equality and returns 1 if they are equal,
/// 0 otherwise. Works for both signed and unsigned interpretations.
/// 
/// Stack: [..., a, b] → [..., a == b ? 1 : 0]
/// Gas: 3 (GasFastestStep)
/// 
/// Example: EQ(42, 42) = 1, EQ(42, 43) = 0
/// Commonly used in conditional jumps and validation logic.
pub const EQ = Operation{
    .execute = comparison.op_eq,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// ISZERO operation (0x15): Is Zero
/// 
/// Tests if a value equals zero and returns 1 if true, 0 if false.
/// This is equivalent to EQ(value, 0) but more efficient.
/// 
/// Stack: [..., a] → [..., a == 0 ? 1 : 0]
/// Gas: 3 (GasFastestStep)
/// 
/// Example: ISZERO(0) = 1, ISZERO(42) = 0
/// Commonly used for:
/// - Checking empty addresses (0x0)
/// - Testing boolean conditions
/// - Implementing NOT logic (since NOT(x) = ISZERO(ISZERO(x)))
pub const ISZERO = Operation{
    .execute = comparison.op_iszero,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};
