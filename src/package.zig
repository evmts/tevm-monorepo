// Root package for zigevm
// This file re-exports all components of the project
const std = @import("std");

// Import components directly from their files
// This avoids relying on the build-provided imports
pub const evm = @import("Evm/package.zig");
pub const utils = @import("Utils/package.zig");
pub const address = @import("Address/package.zig");
pub const abi = @import("Abi/package.zig");
pub const block = @import("Block/package.zig");
pub const bytecode = @import("Bytecode/package.zig");
pub const compiler = @import("Compiler/package.zig");
pub const rlp = @import("Rlp/package.zig");
pub const token = @import("Token/package.zig");
pub const trie = @import("Trie/package.zig");
pub const types = @import("Types/package.zig");
pub const state_manager = @import("StateManager/package.zig");
pub const test_utils = @import("Test/test.zig");

// Re-export the EvmState struct from root.zig
pub const EvmState = @import("root.zig").EvmState;

// Re-export the WASM exported functions
pub const keccak256 = @import("root.zig").keccak256;
pub const loadBytecode = @import("root.zig").loadBytecode;
pub const resetEvm = @import("root.zig").resetEvm;
pub const stepEvm = @import("root.zig").stepEvm;
pub const toggleRunPause = @import("root.zig").toggleRunPause;
pub const getEvmState = @import("root.zig").getEvmState;