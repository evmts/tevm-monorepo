const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const memory_ops = opcodes.memory;

// Memory operation definitions
pub const MLOAD = Operation{
    .execute = memory_ops.op_mload,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const MSTORE = Operation{
    .execute = memory_ops.op_mstore,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const MSTORE8 = Operation{
    .execute = memory_ops.op_mstore8,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const MSIZE = Operation{
    .execute = memory_ops.op_msize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const MCOPY = Operation{
    .execute = memory_ops.op_mcopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const CALLDATACOPY = Operation{
    .execute = memory_ops.op_calldatacopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const RETURNDATASIZE = Operation{
    .execute = memory_ops.op_returndatasize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const RETURNDATACOPY = Operation{
    .execute = memory_ops.op_returndatacopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};