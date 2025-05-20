const std = @import("std");

// Import from packages provided by build.zig
pub const Frame = @import("Evm").Frame.Frame;
pub const ExecutionError = @import("Evm").Frame.ExecutionError;
pub const Interpreter = @import("Evm").interpreter.Interpreter;
pub const Evm = @import("Evm").evm.Evm;
pub const Contract = @import("Evm").Contract.Contract;
pub const Memory = @import("Evm").Memory.Memory;
pub const Stack = @import("Evm").Stack.Stack;
pub const ExecutionStatus = @import("Evm").evm.ExecutionStatus;
pub const Log = @import("Evm").evm.Log;
pub const Address = @import("Address").Address;
pub const JumpTable = @import("Evm").JumpTable;
pub const ChainRules = @import("Evm").evm.ChainRules;

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

/// Creates a simple mock contract with predefined code for basic testing
pub fn createBasicMockContract(allocator: std.mem.Allocator) !*Contract {
    const code = &[_]u8{0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
                      0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f,
                      0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f};
    return createMockContract(allocator, code);
}

/// Creates a mock EVM instance
pub fn createMockEvm(allocator: std.mem.Allocator) !*Evm {
    const evm = try allocator.create(Evm);
    evm.* = Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = ChainRules{
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
pub fn createMockInterpreter(allocator: std.mem.Allocator, evm: *Evm) !*Interpreter {
    const interpreter = try allocator.create(Interpreter);
    interpreter.* = Interpreter{
        .evm = evm,
        .table = JumpTable.JumpTable.init(),
        .allocator = allocator,
        .readOnly = false,
        .returnData = null,
    };
    return interpreter;
}

/// Creates a simple interpreter with a new EVM instance for basic testing
pub fn createBasicMockInterpreter(allocator: std.mem.Allocator) !*Interpreter {
    // Create mock EVM
    const evm = try createMockEvm(allocator);
    
    // Create and initialize an interpreter
    return createMockInterpreter(allocator, evm);
}