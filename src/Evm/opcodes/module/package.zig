// This file allows importing from the opcodes module
pub const test_utils = @import("../test_utils.zig");

// Core EVM components
pub const Contract = struct {
    pub const Contract = @import("../../Contract.zig").Contract;
};

pub const Frame = struct {
    pub const Frame = @import("../../Frame.zig").Frame;
    pub const ExecutionError = @import("../../Frame.zig").ExecutionError;
};

pub const interpreter = struct {
    pub const Interpreter = @import("../../interpreter.zig").Interpreter;
};

pub const evm = struct {
    pub const Evm = @import("../../evm.zig").EVM;
    pub const ExecutionStatus = @import("../../evm.zig").ExecutionStatus;
    pub const Log = @import("../../evm.zig").Log;
};

pub const Memory = struct {
    pub const Memory = @import("../../Memory.zig").Memory;
};

pub const Stack = struct {
    pub const Stack = @import("../../Stack.zig").Stack;
    pub const u256 = @import("../../Stack.zig").@"u256";
};

pub const Address = struct {
    pub const Address = @import("../../Address/address.zig").Address;
};

pub const JumpTable = @import("../../JumpTable.zig");

// Opcode modules
pub const opcodes = @import("opcodes.zig");