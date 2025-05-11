const std = @import("std");

// Import our organized modules
pub const evm = @import("evm/evm.zig");
pub const utils = struct {
    pub const hex = @import("utils/hex.zig");
    pub const keccak256 = @import("utils/keccak256.zig");
};

// Define a conditional compilation check for WASM
const is_wasm = @import("builtin").target.cpu.arch == .wasm32;

// This function is only included when not compiling for WASM
pub fn main() void {
    if (!is_wasm) {
        _ = evm.runEvm();
    }
}