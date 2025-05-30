// EVM module exports
const memory_mod = @import("Memory.zig");
pub const Memory = memory_mod.Memory;
pub const MemoryError = memory_mod.MemoryError;
pub const calculateNumWords = memory_mod.calculateNumWords;

// EVM structure that would typically be passed in from outside
const Evm = struct { depth: u16 };
