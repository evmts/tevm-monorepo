const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const log = opcodes.log;

// LOG operations are created dynamically in the jump table
// Here we expose the implementation functions for use
pub const op_log0 = log.op_log0;
pub const op_log1 = log.op_log1;
pub const op_log2 = log.op_log2;
pub const op_log3 = log.op_log3;
pub const op_log4 = log.op_log4;