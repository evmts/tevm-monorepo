// Package file for opcodes modules
// This file serves as the entry point for importing opcode modules

// Re-export all opcode modules for easy access
pub const arithmetic = @import("arithmetic.zig");
pub const bitwise = @import("bitwise.zig");
pub const block = @import("block.zig");
pub const comparison = @import("comparison.zig");
pub const control = @import("control.zig");
pub const crypto = @import("crypto.zig");
pub const environment = @import("environment.zig");
pub const log = @import("log.zig");
pub const memory = @import("memory.zig");
pub const stack = @import("stack.zig");
pub const storage = @import("storage.zig");
pub const system = @import("system.zig");

// Re-export common types
pub const Operation = @import("../operation.zig");
pub const ExecutionError = @import("../execution_error.zig");
pub const Frame = @import("../frame.zig");
pub const Stack = @import("../stack.zig");
pub const Memory = @import("../memory.zig");
pub const Vm = @import("../vm.zig");
pub const Contract = @import("../contract.zig");
pub const gas_constants = @import("../constants/gas_constants.zig");
