/// Arithmetic operations module for the EVM
/// 
/// This module defines all arithmetic-related EVM operations, mapping them to their
/// implementation functions and gas costs. These operations perform mathematical
/// calculations on unsigned 256-bit integers with wrapping overflow semantics.

const std = @import("std");
const Operation = @import("operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const arithmetic = opcodes.arithmetic;

/// ADD operation (0x01): Addition
/// 
/// Pops two values from the stack and pushes their sum.
/// All arithmetic in the EVM uses wrapping overflow semantics.
/// 
/// Stack: [..., a, b] → [..., (a + b) mod 2^256]
/// Gas: 3 (GasFastestStep)
pub const ADD = Operation{
    .execute = arithmetic.op_add,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// MUL operation (0x02): Multiplication
/// 
/// Pops two values from the stack and pushes their product.
/// Uses wrapping overflow semantics for results exceeding 256 bits.
/// 
/// Stack: [..., a, b] → [..., (a × b) mod 2^256]
/// Gas: 5 (GasFastStep)
pub const MUL = Operation{
    .execute = arithmetic.op_mul,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// SUB operation (0x03): Subtraction
/// 
/// Pops two values from the stack and pushes their difference.
/// Uses wrapping underflow semantics if b > a.
/// 
/// Stack: [..., a, b] → [..., (a - b) mod 2^256]
/// Gas: 3 (GasFastestStep)
pub const SUB = Operation{
    .execute = arithmetic.op_sub,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// DIV operation (0x04): Integer Division
/// 
/// Pops two values from the stack and pushes the integer quotient.
/// Division by zero yields zero (not an error in EVM).
/// 
/// Stack: [..., a, b] → [..., a ÷ b] (b ≠ 0) or [..., 0] (b = 0)
/// Gas: 5 (GasFastStep)
pub const DIV = Operation{
    .execute = arithmetic.op_div,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// SDIV operation (0x05): Signed Integer Division
/// 
/// Pops two values from the stack, interprets them as signed integers,
/// and pushes the signed quotient. Division by zero yields zero.
/// 
/// Stack: [..., a, b] → [..., a ÷ b] (signed)
/// Gas: 5 (GasFastStep)
/// 
/// Note: The only overflow case is -2^255 ÷ -1 = -2^255
pub const SDIV = Operation{
    .execute = arithmetic.op_sdiv,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// MOD operation (0x06): Modulo Operation
/// 
/// Pops two values from the stack and pushes the remainder of their division.
/// Modulo by zero yields zero (not an error in EVM).
/// 
/// Stack: [..., a, b] → [..., a mod b] (b ≠ 0) or [..., 0] (b = 0)
/// Gas: 5 (GasFastStep)
pub const MOD = Operation{
    .execute = arithmetic.op_mod,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// SMOD operation (0x07): Signed Modulo Operation
/// 
/// Pops two values from the stack, interprets them as signed integers,
/// and pushes the signed remainder. The sign of the result matches the sign
/// of the dividend (a). Modulo by zero yields zero.
/// 
/// Stack: [..., a, b] → [..., a mod b] (signed)
/// Gas: 5 (GasFastStep)
pub const SMOD = Operation{
    .execute = arithmetic.op_smod,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// ADDMOD operation (0x08): Addition Modulo
/// 
/// Pops three values from the stack and pushes (a + b) mod n.
/// Performs the addition with arbitrary precision before the modulo,
/// avoiding overflow issues. Modulo by zero yields zero.
/// 
/// Stack: [..., a, b, n] → [..., (a + b) mod n]
/// Gas: 8 (GasMidStep)
pub const ADDMOD = Operation{
    .execute = arithmetic.op_addmod,
    .constant_gas = opcodes.gas_constants.GasMidStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

/// MULMOD operation (0x09): Multiplication Modulo
/// 
/// Pops three values from the stack and pushes (a × b) mod n.
/// Performs the multiplication with arbitrary precision before the modulo,
/// avoiding overflow issues. Modulo by zero yields zero.
/// 
/// Stack: [..., a, b, n] → [..., (a × b) mod n]
/// Gas: 8 (GasMidStep)
pub const MULMOD = Operation{
    .execute = arithmetic.op_mulmod,
    .constant_gas = opcodes.gas_constants.GasMidStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

/// EXP operation (0x0A): Exponentiation
/// 
/// Pops two values from the stack and pushes a^b.
/// Uses binary exponentiation for efficiency.
/// 
/// Stack: [..., a, b] → [..., a^b mod 2^256]
/// Gas: 10 + 50 × byte_size_of(exponent)
/// 
/// Note: Dynamic gas cost depends on the size of the exponent
pub const EXP = Operation{
    .execute = arithmetic.op_exp,
    .constant_gas = 10,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// SIGNEXTEND operation (0x0B): Sign Extension
/// 
/// Extends the sign bit of a value from a given byte position.
/// Used to convert smaller signed integers to 256-bit representation.
/// 
/// Stack: [..., b, x] → [..., SIGNEXTEND(x, b)]
/// Gas: 5 (GasFastStep)
/// 
/// Where b is the byte position (0-31) of the sign bit to extend.
/// If b ≥ 31, returns x unchanged.
pub const SIGNEXTEND = Operation{
    .execute = arithmetic.op_signextend,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};
