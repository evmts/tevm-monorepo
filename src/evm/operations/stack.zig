const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const stack_ops = opcodes.stack;

// Stack operation definitions
pub const POP = Operation{
    .execute = stack_ops.op_pop,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const PUSH0 = Operation{
    .execute = stack_ops.op_push0,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// DUP operations
pub const DUP1 = Operation{
    .execute = stack_ops.op_dup1,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DUP2 = Operation{
    .execute = stack_ops.op_dup2,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY - 1,
};

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

pub const DUP16 = Operation{
    .execute = stack_ops.op_dup16,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 16,
    .max_stack = Stack.CAPACITY - 1,
};

// SWAP operations
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

pub const SWAP16 = Operation{
    .execute = stack_ops.op_swap16,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 17,
    .max_stack = Stack.CAPACITY,
};