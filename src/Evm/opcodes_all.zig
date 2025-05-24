const std = @import("std");

// Import from package to avoid circular dependencies
const pkg = @import("package.zig");

// Re-export types from package.zig
pub const interpreter = pkg.interpreter;
pub const Stack = pkg.Stack;
pub const JumpTable = pkg.jumpTable;
pub const Memory = pkg.Memory;
pub const Frame = pkg.Frame;
pub const Contract = pkg.Contract;
pub const Evm = pkg.Evm;

// Re-export from package imports
pub const utils = pkg.utils;
pub const address = pkg.address;

// Import all opcode modules from the opcodes directory
// These are local imports - not part of the package system
pub usingnamespace @import("opcodes.zig");

// This module serves as a consolidated access point for all opcode implementations.
// It uses the existing opcodes.zig file but provides a cleaner interface for importing
// all opcode-related functionality in one place.
//
// Usage example:
// ```zig
// const opcodes_all = @import("opcodes_all.zig");
// const jump_table = opcodes_all.JumpTable.createJumpTable(allocator);
// ```