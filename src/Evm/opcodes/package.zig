// Package entry point for opcodes
// For test files, we need to use direct imports

// For test compatibility, use a simplified test interface
// Import frames and EVM modules from their locations
const frameMod = struct {
    const Frame = @import("package_test.zig").Frame;
    const ExecutionError = @import("package_test.zig").ExecutionError;
};
const evm_mod = struct {
    const Evm = @import("package_test.zig").Evm;
    const ExecutionStatus = struct {
        IsEIP4844: bool = true,
        IsEIP5656: bool = true,
    };
};
const interpreterMod = struct {
    const Interpreter = @import("package_test.zig").Interpreter;
};
const contractMod = struct {
    const Contract = @import("package_test.zig").Contract;
};
const memoryMod = struct {
    const Memory = @import("package_test.zig").Memory;
};
const stackMod = struct {
    const Stack = @import("package_test.zig").Stack;
    const @"u256" = @import("package_test.zig").@"u256";
};
const jumpTableMod = @import("package_test.zig").JumpTable;
const loggerMod = struct {};
const addressMod = @import("package_test.zig").Address;

// Re-export the type definitions
pub const Frame = frameMod.Frame;
pub const ExecutionError = frameMod.ExecutionError;
pub const Interpreter = interpreterMod.Interpreter;
pub const Evm = evm_mod.Evm;
pub const Contract = contractMod.Contract;
pub const Memory = memoryMod.Memory;
pub const Stack = stackMod.Stack;
pub const JumpTable = jumpTableMod;
pub const ExecutionStatus = evm_mod.ExecutionStatus;
pub const EvmLogger = loggerMod;

// Import Address and other types
pub const Address = addressMod;
pub const @"u256" = stackMod.@"u256";

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