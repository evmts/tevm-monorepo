const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const environment = opcodes.environment;

// Environment operation definitions
pub const ADDRESS = Operation{
    .execute = environment.op_address,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const BALANCE = Operation{
    .execute = environment.op_balance,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const ORIGIN = Operation{
    .execute = environment.op_origin,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const CALLER = Operation{
    .execute = environment.op_caller,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const CALLVALUE = Operation{
    .execute = environment.op_callvalue,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const CALLDATALOAD = Operation{
    .execute = environment.op_calldataload,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const CALLDATASIZE = Operation{
    .execute = environment.op_calldatasize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const CODESIZE = Operation{
    .execute = environment.op_codesize,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const CODECOPY = Operation{
    .execute = environment.op_codecopy,
    .constant_gas = opcodes.gas_constants.GasFastestStep,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const GASPRICE = Operation{
    .execute = environment.op_gasprice,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const EXTCODESIZE = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const EXTCODECOPY = Operation{
    .execute = environment.op_extcodecopy,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

pub const EXTCODEHASH = Operation{
    .execute = environment.op_extcodehash,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const CHAINID = Operation{
    .execute = environment.op_chainid,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const SELFBALANCE = Operation{
    .execute = environment.op_selfbalance,
    .constant_gas = opcodes.gas_constants.GasFastStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

// BALANCE variants for different hardforks
pub const BALANCE_FRONTIER_TO_TANGERINE = Operation{
    .execute = environment.op_balance,
    .constant_gas = opcodes.gas_constants.GasExtStep, // 20
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const BALANCE_TANGERINE_TO_ISTANBUL = Operation{
    .execute = environment.op_balance,
    .constant_gas = 400,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const BALANCE_ISTANBUL_TO_BERLIN = Operation{
    .execute = environment.op_balance,
    .constant_gas = 700,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const BALANCE_BERLIN_TO_PRESENT = Operation{
    .execute = environment.op_balance,
    .constant_gas = 0, // Dynamic gas in Berlin+
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// EXTCODESIZE variants
pub const EXTCODESIZE_FRONTIER_TO_TANGERINE = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = opcodes.gas_constants.GasExtStep, // 20
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const EXTCODESIZE_TANGERINE_TO_BERLIN = Operation{
    .execute = environment.op_extcodesize,
    .constant_gas = 700,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// EXTCODECOPY variants
pub const EXTCODECOPY_FRONTIER_TO_TANGERINE = Operation{
    .execute = environment.op_extcodecopy,
    .constant_gas = opcodes.gas_constants.GasExtStep, // 20
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

pub const EXTCODECOPY_TANGERINE_TO_BERLIN = Operation{
    .execute = environment.op_extcodecopy,
    .constant_gas = 700,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};