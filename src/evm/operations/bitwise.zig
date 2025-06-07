/// Bitwise operations module for the EVM
/// 
/// This module defines all bitwise logic operations for manipulating 256-bit values
/// at the bit level. These operations are fundamental for bit manipulation,
/// masking, and efficient mathematical operations in smart contracts.

const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const bitwise = opcodes.bitwise;

/// AND operation (0x16): Bitwise AND
/// 
/// Performs a bitwise AND operation on two 256-bit values.
/// Each bit in the result is 1 only if both corresponding bits are 1.
/// 
/// Stack: [..., a, b] → [..., a & b]
/// Gas: 3 (GasFastestStep)
/// 
/// Example: 0xFF00 & 0x0FF0 = 0x0F00
pub const AND = Operation{
    .execute = bitwise.op_and,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// OR operation (0x17): Bitwise OR
/// 
/// Performs a bitwise OR operation on two 256-bit values.
/// Each bit in the result is 1 if at least one corresponding bit is 1.
/// 
/// Stack: [..., a, b] → [..., a | b]
/// Gas: 3 (GasFastestStep)
/// 
/// Example: 0xFF00 | 0x0FF0 = 0xFFF0
pub const OR = Operation{
    .execute = bitwise.op_or,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// XOR operation (0x18): Bitwise XOR (Exclusive OR)
/// 
/// Performs a bitwise XOR operation on two 256-bit values.
/// Each bit in the result is 1 if the corresponding bits are different.
/// 
/// Stack: [..., a, b] → [..., a ^ b]
/// Gas: 3 (GasFastestStep)
/// 
/// Example: 0xFF00 ^ 0x0FF0 = 0xF0F0
pub const XOR = Operation{
    .execute = bitwise.op_xor,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// NOT operation (0x19): Bitwise NOT
/// 
/// Performs a bitwise NOT operation (one's complement) on a 256-bit value.
/// Flips all bits: 0 becomes 1, 1 becomes 0.
/// 
/// Stack: [..., a] → [..., ~a]
/// Gas: 3 (GasFastestStep)
/// 
/// Example: ~0x00FF = 0xFFFF...FF00 (for 256-bit values)
pub const NOT = Operation{
    .execute = bitwise.op_not,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

/// BYTE operation (0x1A): Extract Byte
/// 
/// Extracts a single byte from a 256-bit value at the specified position.
/// Byte 0 is the most significant byte (leftmost), byte 31 is the least significant.
/// 
/// Stack: [..., i, x] → [..., byte_at_position_i_of_x]
/// Gas: 3 (GasFastestStep)
/// 
/// If i ≥ 32, returns 0.
/// Example: BYTE(1, 0xAABBCC...00) = 0xBB
pub const BYTE = Operation{
    .execute = bitwise.op_byte,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// SHL operation (0x1B): Shift Left
/// 
/// Performs a logical left shift on a 256-bit value.
/// Shifts bits to the left by the specified amount, filling with zeros from the right.
/// 
/// Stack: [..., shift, value] → [..., value << shift]
/// Gas: 3 (GasFastestStep)
/// 
/// If shift ≥ 256, returns 0.
/// Introduced in Constantinople (EIP-145).
pub const SHL = Operation{
    .execute = bitwise.op_shl,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// SHR operation (0x1C): Logical Shift Right
/// 
/// Performs a logical right shift on a 256-bit value.
/// Shifts bits to the right by the specified amount, filling with zeros from the left.
/// 
/// Stack: [..., shift, value] → [..., value >> shift]
/// Gas: 3 (GasFastestStep)
/// 
/// If shift ≥ 256, returns 0.
/// Introduced in Constantinople (EIP-145).
pub const SHR = Operation{
    .execute = bitwise.op_shr,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// SAR operation (0x1D): Arithmetic Shift Right
/// 
/// Performs an arithmetic right shift on a 256-bit value.
/// Shifts bits to the right, preserving the sign bit (most significant bit).
/// Used for signed integer division by powers of 2.
/// 
/// Stack: [..., shift, value] → [..., value SAR shift]
/// Gas: 3 (GasFastestStep)
/// 
/// If shift ≥ 256, returns 0 (positive) or -1 (negative).
/// Introduced in Constantinople (EIP-145).
pub const SAR = Operation{
    .execute = bitwise.op_sar,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};
