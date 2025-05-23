// This file is the entry point for the opcodes module
// It allows proper imports for tests and code
const std = @import("std");

// Re-export core EVM types needed by opcode implementations
pub const Frame = @import("../../Frame.zig").Frame;
pub const ExecutionError = @import("../../Frame.zig").ExecutionError;
pub const Interpreter = @import("../../interpreter.zig").Interpreter;
pub const EVM = @import("../../evm.zig").EVM;
pub const Contract = @import("../../Contract.zig").Contract;
pub const Memory = @import("../../Memory.zig").Memory;
pub const Stack = @import("../../Stack.zig").Stack;
pub const ExecutionStatus = @import("../../evm.zig").ExecutionStatus;
pub const Log = @import("../../evm.zig").Log;

// Export the BigInt alias for use in tests
pub const BigInt = Stack.u256;

// Other types needed by opcodes

// Test utility functions
pub fn createMockContract(allocator: std.mem.Allocator, code: []const u8) !*Contract {
    const contract = try allocator.create(Contract);
    
    // Create a zero address
    const zero_addr = [_]u8{0} ** 20;
    
    contract.* = Contract{
        .code = try allocator.dupe(u8, code),
        .input = &[_]u8{},
        .address = zero_addr,
        .code_address = undefined,
        .value = 0,
        .gas = 1000000,
        .gas_refund = 0,
    };
    return contract;
}

/// Creates a mock EVM instance
pub fn createMockEvm(allocator: std.mem.Allocator) !*EVM {
    const evm = try allocator.create(EVM);
    evm.* = EVM{
        .depth = 0,
        .readOnly = false,
        .chainRules = .{
            .IsEIP4844 = true,
            .IsEIP5656 = true,
        },
        .state_manager = null,
    };
    return evm;
}

/// Creates a mock interpreter
pub fn createMockInterpreter(allocator: std.mem.Allocator, evm: *EVM) !*Interpreter {
    const interpreter = try allocator.create(Interpreter);
    interpreter.* = Interpreter{
        .evm = evm,
        .cfg = undefined,
        .readOnly = false,
        .returnData = &[_]u8{},
    };
    return interpreter;
}