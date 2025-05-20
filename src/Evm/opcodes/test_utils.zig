const std = @import("std");

// These imports work when using the build system
pub const pkg = if (@hasDecl(@import("root"), "Evm")) 
    @import("root").Evm 
else 
    @import("../package.zig");

pub const Frame = pkg.Frame;
pub const ExecutionError = pkg.ExecutionError;
pub const Interpreter = pkg.Interpreter;
pub const Evm = pkg.EVM;
pub const Contract = pkg.Contract;
pub const Memory = pkg.Memory;
pub const Stack = pkg.Stack;
pub const ExecutionStatus = pkg.ExecutionStatus;
pub const Log = pkg.Log;

// Conditionally import Address
pub const Address = if (@hasDecl(@import("root"), "Address")) 
    @import("root").Address 
else 
    @import("../../Address/package.zig");

/// Creates a mock contract for testing
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
pub fn createMockEvm(allocator: std.mem.Allocator) !*Evm {
    const evm = try allocator.create(Evm);
    evm.* = Evm{
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
pub fn createMockInterpreter(allocator: std.mem.Allocator, evm: *Evm) !*Interpreter {
    const interpreter = try allocator.create(Interpreter);
    interpreter.* = Interpreter{
        .evm = evm,
        .cfg = undefined,
        .readOnly = false,
        .returnData = &[_]u8{},
    };
    return interpreter;
}