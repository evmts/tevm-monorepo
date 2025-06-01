// EVM module exports
const memory_mod = @import("Memory.zig");
pub const Memory = memory_mod.Memory;

pub const Stack = @import("Stack.zig").Stack;

// EVM structure that would typically be passed in from outside
const Evm = struct { depth: u16 };
