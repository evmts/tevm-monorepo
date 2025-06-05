const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const block = opcodes.block;

// Block operation definitions
pub const BLOCKHASH = Operation{
    .execute = block.op_blockhash,
    .constant_gas = opcodes.gas_constants.GasExtStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const COINBASE = Operation{
    .execute = block.op_coinbase,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const TIMESTAMP = Operation{
    .execute = block.op_timestamp,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const NUMBER = Operation{
    .execute = block.op_number,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const DIFFICULTY = Operation{
    .execute = block.op_difficulty,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const GASLIMIT = Operation{
    .execute = block.op_gaslimit,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const BASEFEE = Operation{
    .execute = block.op_basefee,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const BLOBHASH = Operation{
    .execute = block.op_blobhash,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const BLOBBASEFEE = Operation{
    .execute = block.op_blobbasefee,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};