const std = @import("std");

// Direct imports for testing
pub const Frame = @import("../Frame.zig").Frame;
pub const ExecutionError = @import("../Frame.zig").ExecutionError;
pub const Interpreter = @import("../interpreter.zig").Interpreter;
pub const Evm = @import("../evm.zig").Evm;
pub const Contract = @import("../Contract.zig").Contract;
pub const Memory = @import("../Memory.zig").Memory;
pub const Stack = @import("../Stack.zig").Stack;
pub const ExecutionStatus = @import("../evm.zig").ExecutionStatus;
pub const Log = @import("../evm.zig").Log;
pub const Address = @import("../../Address/address.zig").Address;

/// Creates a mock contract for testing
pub fn createMockContract(allocator: std.mem.Allocator, code: []const u8) !*Contract {
    const contract = try allocator.create(Contract);
    
    contract.* = Contract{
        .code = try allocator.dupe(u8, code),
        .input = &[_]u8{},
        .address = Address.zero(),
        .code_address = undefined,
        .value = 0,
        .gas = 1000000,
        .gas_refund = 0,
    };
    return contract;
}

/// Creates a mock EVM instance
pub fn createMockEvm(allocator: std.mem.Allocator) \!*Evm {
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
pub fn createMockInterpreter(allocator: std.mem.Allocator, evm: *Evm) \!*Interpreter {
    const interpreter = try allocator.create(Interpreter);
    interpreter.* = Interpreter{
        .evm = evm,
        .cfg = undefined,
        .readOnly = false,
        .returnData = &[_]u8{},
    };
    return interpreter;
}
EOF < /dev/null