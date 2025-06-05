const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const comparison = opcodes.comparison;

// Comparison operation definitions
pub const LT = Operation{
    .execute = comparison.op_lt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const GT = Operation{
    .execute = comparison.op_gt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SLT = Operation{
    .execute = comparison.op_slt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const SGT = Operation{
    .execute = comparison.op_sgt,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const EQ = Operation{
    .execute = comparison.op_eq,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const ISZERO = Operation{
    .execute = comparison.op_iszero,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};