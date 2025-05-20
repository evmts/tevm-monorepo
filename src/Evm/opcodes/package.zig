// Package entry point for opcodes
// For test files, we need to use direct imports

// Import directly from implementation files - this works with 'zig test' command
pub const Frame = @import("../Frame.zig").Frame;
pub const ExecutionError = @import("../Frame.zig").ExecutionError;
pub const Interpreter = @import("../interpreter.zig").Interpreter;
pub const Evm = @import("../evm.zig").Evm;
pub const Contract = @import("../Contract.zig").Contract;
pub const Memory = @import("../Memory.zig").Memory;
pub const Stack = @import("../Stack.zig").Stack;
pub const JumpTable = @import("../JumpTable.zig");
pub const ChainRules = @import("../evm.zig").ChainRules;
pub const EvmLogger = @import("../EvmLogger.zig");

// Import Address directly for tests
pub const Address = @import("../../Address/address.zig").Address;

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