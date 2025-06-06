/// Arithmetic operations module for the EVM
/// 
/// This module defines all arithmetic-related EVM operations, mapping them to their
/// implementation functions and gas costs. These operations perform mathematical
/// calculations on unsigned 256-bit integers with wrapping overflow semantics.

const std = @import("std");
const Operation = @import("../operation.zig");
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

pub const MUL = Operation{
    .execute = arithmetic.op_mul,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SUB = Operation{
    .execute = arithmetic.op_sub,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const DIV = Operation{
    .execute = arithmetic.op_div,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SDIV = Operation{
    .execute = arithmetic.op_sdiv,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const MOD = Operation{
    .execute = arithmetic.op_mod,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SMOD = Operation{
    .execute = arithmetic.op_smod,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const ADDMOD = Operation{
    .execute = arithmetic.op_addmod,
    .constant_gas = opcodes.gas_constants.GasMidStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const MULMOD = Operation{
    .execute = arithmetic.op_mulmod,
    .constant_gas = opcodes.gas_constants.GasMidStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const EXP = Operation{
    .execute = arithmetic.op_exp,
    .constant_gas = 10,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SIGNEXTEND = Operation{
    .execute = arithmetic.op_signextend,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};