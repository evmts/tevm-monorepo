const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const crypto = opcodes.crypto;

// Crypto operation definitions
pub const SHA3 = Operation{
    .execute = crypto.op_sha3,
    .constant_gas = opcodes.gas_constants.Keccak256Gas,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};