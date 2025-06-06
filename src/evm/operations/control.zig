const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const ExecutionError = @import("../execution_error.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const control = opcodes.control;

// Control operation definitions
pub const STOP = Operation{
    .execute = control.op_stop,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

pub const JUMP = Operation{
    .execute = control.op_jump,
    .constant_gas = opcodes.gas_constants.GasMidStep,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const JUMPI = Operation{
    .execute = control.op_jumpi,
    .constant_gas = opcodes.gas_constants.GasSlowStep,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const PC = Operation{
    .execute = control.op_pc,
    .constant_gas = opcodes.gas_constants.GasQuickStep,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY - 1,
};

pub const JUMPDEST = Operation{
    .execute = control.op_jumpdest,
    .constant_gas = opcodes.gas_constants.JumpdestGas,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

pub const RETURN = Operation{
    .execute = control.op_return,
    .constant_gas = 0,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const REVERT = Operation{
    .execute = control.op_revert,
    .constant_gas = 0,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const INVALID = Operation{
    .execute = control.op_invalid,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
};

pub const SELFDESTRUCT = Operation{
    .execute = control.op_selfdestruct,
    .constant_gas = 5000,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

// SELFDESTRUCT variants for different hardforks
pub const SELFDESTRUCT_FRONTIER_TO_TANGERINE = Operation{
    .execute = control.op_selfdestruct,
    .constant_gas = 0,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const SELFDESTRUCT_TANGERINE_TO_PRESENT = Operation{
    .execute = control.op_selfdestruct,
    .constant_gas = 5000,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};