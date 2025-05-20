const std = @import("std");

// Direct imports for better compatibility
pub const Frame = @import("../../Evm/Frame.zig").Frame;
pub const ExecutionError = @import("../../Evm/Frame.zig").ExecutionError;
pub const Interpreter = @import("../../Evm/interpreter.zig").Interpreter;
pub const Evm = @import("../../Evm/evm.zig").Evm;
pub const Contract = @import("../../Evm/Contract.zig").Contract;
pub const Memory = @import("../../Evm/Memory.zig").Memory;
pub const Stack = @import("../../Evm/Stack.zig").Stack;
pub const ExecutionStatus = @import("../../Evm/evm.zig").ExecutionStatus;
pub const Log = @import("../../Evm/evm.zig").Log;
pub const JumpTable = @import("../../Evm/JumpTable.zig");

// Address is a separate import
pub const Address = @import("../../Address/address.zig").Address;

/// Creates a mock contract for testing
pub fn createMockContract(allocator: std.mem.Allocator, code: []const u8) !*Contract {
    const contract = try allocator.create(Contract);
    
    contract.* = Contract{
        .code = try allocator.dupe(u8, code),
        .input = &[_]u8{},
        .address = Address.zero(),
        .code_address = Address.zero(),
        .value = 0,
        .gas = 1000000,
        .gas_refund = 0,
    };
    return contract;
}

/// Creates a mock EVM instance
pub fn createMockEvm(allocator: std.mem.Allocator) !*Evm {
    const evm = try allocator.create(Evm);
    evm.* = Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = .{
            .IsHomestead = true,
            .IsEIP150 = true,
            .IsEIP158 = true,
            .IsEIP1559 = true,
            .IsEIP3855 = true, // Needed for PUSH0
        },
        .state_manager = null,
    };
    return evm;
}

/// Creates a mock interpreter
pub fn createMockInterpreter(allocator: std.mem.Allocator, evm: *Evm) *Interpreter {
    const interpreter = try allocator.create(Interpreter);
    interpreter.* = Interpreter{
        .evm = evm,
        .cfg = undefined,
        .readOnly = false,
        .returnData = &[_]u8{},
    };
    return interpreter;
}
