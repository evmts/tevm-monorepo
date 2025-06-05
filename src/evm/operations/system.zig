const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const system = opcodes.system;

// System operation definitions
pub const CREATE = Operation{
    .execute = system.op_create,
    .constant_gas = opcodes.gas_constants.CreateGas,
    .min_stack = 3,
    .max_stack = Stack.CAPACITY,
};

pub const CREATE2 = Operation{
    .execute = system.op_create2,
    .constant_gas = opcodes.gas_constants.CreateGas,
    .min_stack = 4,
    .max_stack = Stack.CAPACITY,
};

pub const CALL = Operation{
    .execute = system.op_call,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

pub const CALLCODE = Operation{
    .execute = system.op_callcode,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

pub const DELEGATECALL = Operation{
    .execute = system.op_delegatecall,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

pub const STATICCALL = Operation{
    .execute = system.op_staticcall,
    .constant_gas = opcodes.gas_constants.CallGas,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};

// CALL variants for different hardforks
pub const CALL_FRONTIER_TO_TANGERINE = Operation{
    .execute = system.op_call,
    .constant_gas = opcodes.gas_constants.CallGas, // 40
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

pub const CALL_TANGERINE_TO_PRESENT = Operation{
    .execute = system.op_call,
    .constant_gas = 700,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

// CALLCODE variants
pub const CALLCODE_FRONTIER_TO_TANGERINE = Operation{
    .execute = system.op_callcode,
    .constant_gas = opcodes.gas_constants.CallGas, // 40
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

pub const CALLCODE_TANGERINE_TO_PRESENT = Operation{
    .execute = system.op_callcode,
    .constant_gas = 700,
    .min_stack = 7,
    .max_stack = Stack.CAPACITY,
};

// DELEGATECALL variants
pub const DELEGATECALL_TANGERINE_TO_PRESENT = Operation{
    .execute = system.op_delegatecall,
    .constant_gas = 700,
    .min_stack = 6,
    .max_stack = Stack.CAPACITY,
};