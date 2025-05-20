// Package entry point for opcodes
// For test files, we need to use direct imports

// Import from parent directory
const evm_pkg = @import("../package.zig");

pub const Frame = evm_pkg.Frame;
pub const ExecutionError = evm_pkg.ExecutionError;
pub const Interpreter = evm_pkg.Interpreter;
pub const Evm = evm_pkg.Evm;
pub const Contract = evm_pkg.Contract;
pub const Memory = evm_pkg.Memory;
pub const Stack = evm_pkg.Stack;
pub const JumpTable = evm_pkg.JumpTable;
pub const ChainRules = evm_pkg.ExecutionStatus;
pub const EvmLogger = evm_pkg.EvmLogger;

// Import Address
pub const Address = evm_pkg.Address;

// Re-export modules - these are all local to the opcodes directory
pub const bitwise = @import("bitwise.zig");
pub const blob = @import("blob.zig");
pub const block = @import("block.zig");
pub const calls = @import("calls.zig");
pub const comparison = @import("comparison.zig");
pub const controlflow = @import("controlflow.zig");
pub const crypto = @import("crypto.zig");
pub const environment = @import("environment.zig");
pub const log = @import("log.zig");
pub const math = @import("math.zig");
pub const math2 = @import("math2.zig");
pub const memory = @import("memory.zig");
pub const storage = @import("storage.zig");
pub const transient = @import("transient.zig");
pub const test_utils = @import("test_utils.zig");