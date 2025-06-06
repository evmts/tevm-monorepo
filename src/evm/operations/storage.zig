const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const storage = opcodes.storage;

// Storage operation definitions
pub const SLOAD = Operation{
    .execute = storage.op_sload,
    .constant_gas = 0, // Gas handled dynamically in operation (cold/warm access)
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const SSTORE = Operation{
    .execute = storage.op_sstore,
    .constant_gas = 0, // Gas handled dynamically in operation
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

pub const TLOAD = Operation{
    .execute = storage.op_tload,
    .constant_gas = 100,
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};

pub const TSTORE = Operation{
    .execute = storage.op_tstore,
    .constant_gas = 100,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};