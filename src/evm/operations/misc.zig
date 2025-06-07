/// Miscellaneous operations module for the EVM
/// 
/// This module contains historical variants of operations that had different
/// gas costs in different hardforks. These are now defined in instruction_sets.zig
/// along with all other operation definitions.
///
/// NOTE: This module is kept for reference but the actual operations are
/// defined in instruction_sets.zig to avoid duplication.

const std = @import("std");
const Operation = @import("operation.zig");
const Stack = @import("../stack.zig");
const ExecutionError = @import("../execution_error.zig");
const Frame = @import("../frame.zig");
const opcodes = @import("../opcodes/package.zig");

// Historical operation variants are now defined in instruction_sets.zig
// This file is kept as a placeholder for the operations package structure