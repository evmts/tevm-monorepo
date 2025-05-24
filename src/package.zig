/// ZigEVM package exports
const std = @import("std");

/// EVM module
pub const evm = @import("evm");

/// Exported Memory type from EVM module
pub const Memory = evm.Memory;
