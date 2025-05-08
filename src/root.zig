//! ZigEVM - High-Performance WebAssembly-Compatible Ethereum Virtual Machine
//! This is the main entry point for the ZigEVM library.
const std = @import("std");
const testing = std.testing;

// Import core modules
const util = @import("util/types.zig");
const memory = @import("memory/memory.zig");
const stack = @import("stack/stack.zig");
const interpreter = @import("interpreter/interpreter.zig");
const wasm = @import("wasm/exports.zig");

// Re-export key types
pub const U256 = util.U256;
pub const Address = util.Address;
pub const Hash = util.Hash;
pub const ExecutionResult = util.ExecutionResult;
pub const Memory = memory.Memory;
pub const Stack = stack.Stack;
pub const Interpreter = interpreter.Interpreter;

// WASM exports
pub usingnamespace wasm;

// For testing purposes
pub fn add(a: i32, b: i32) i32 {
    return a + b;
}

test "basic add functionality" {
    try testing.expect(add(3, 7) == 10);
}
