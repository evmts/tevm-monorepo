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

const constants_mod = @import("constants.zig");
// Re-export all constants and utilities
pub const constants = constants_mod;

// Re-export commonly used items directly
pub const EvmError = constants_mod.EvmError;
pub const MemorySize = constants_mod.MemorySize;
pub const GasResult = constants_mod.GasResult;

// EVM structure that would typically be passed in from outside
const Evm = struct { depth: u16 };
