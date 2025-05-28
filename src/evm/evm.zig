// EVM module exports
const memory_mod = @import("Memory.zig");
pub const Memory = memory_mod.Memory;
pub const MemoryError = memory_mod.MemoryError;
pub const calculateNumWords = memory_mod.calculateNumWords;

const stack_mod = @import("Stack.zig");
pub const Stack = stack_mod.Stack;
pub const StackError = stack_mod.StackError;
pub const STACK_LIMIT = stack_mod.STACK_LIMIT;
pub const makeSwapN = stack_mod.makeSwapN;

// EVM structure that would typically be passed in from outside
const Evm = struct { depth: u16 };
