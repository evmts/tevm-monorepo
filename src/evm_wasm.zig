/// WASM-compatible EVM module with minimal dependencies
/// This module provides a subset of EVM functionality that compiles to WASM
/// without any threading or POSIX dependencies.

const std = @import("std");

// Re-export core EVM types that work in WASM
pub const Vm = @import("evm/vm.zig");
pub const Contract = @import("evm/contract/contract.zig");
pub const Stack = @import("evm/stack/stack.zig");
pub const Memory = @import("evm/memory.zig");
pub const Context = @import("evm/context.zig");

// Re-export result types
pub const RunResult = @import("evm/run_result.zig").RunResult;
pub const CallResult = @import("evm/call_result.zig").CallResult;
pub const CreateResult = @import("evm/create_result.zig").CreateResult;

// Re-export constants and utilities
pub const constants = @import("evm/constants/constants.zig");
pub const gas_constants = @import("evm/constants/gas_constants.zig");

// Only export WASM-compatible execution errors
pub const ExecutionError = @import("evm/execution/execution_error.zig");

// Hardfork support
pub const Hardfork = @import("evm/hardforks/hardfork.zig");
pub const ChainRules = @import("evm/hardforks/chain_rules.zig");

// Jump table for opcode dispatch
pub const JumpTable = @import("evm/jump_table/jump_table.zig");
pub const Operation = @import("evm/opcodes/operation.zig");
pub const Opcode = @import("evm/opcodes/opcode.zig");

// Access list for EIP-2929 support
pub const AccessList = @import("evm/access_list/access_list.zig");

// EVM state management
pub const EvmState = @import("evm/state/state.zig");
pub const StorageKey = @import("evm/state/storage_key.zig");
pub const EvmLog = @import("evm/state/evm_log.zig");

// Frame for execution context
pub const Frame = @import("evm/frame.zig");

// Precompiles
pub const precompiles = @import("evm/precompiles/precompiles.zig");

// WASM compatibility stubs
pub const wasm_stubs = @import("evm/wasm_stubs.zig");