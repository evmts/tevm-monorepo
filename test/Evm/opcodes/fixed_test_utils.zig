// Utility for tests that exports test types
// Bridge between test code and fixed_package_test.zig

const std = @import("std");
const fixed_pkg = @import("fixed_package_test.zig");

// Re-export all the types needed for tests
pub const Frame = fixed_pkg.Frame;
pub const ExecutionError = fixed_pkg.ExecutionError;
pub const Interpreter = fixed_pkg.Interpreter; 
pub const Evm = fixed_pkg.Evm;
pub const Contract = fixed_pkg.Contract;
pub const Memory = fixed_pkg.Memory;
pub const Stack = fixed_pkg.Stack;
pub const JumpTable = fixed_pkg.JumpTable;
pub const Address = fixed_pkg.Address;

// Helper for tests to create a mock contract
pub fn createMockContract(allocator: std.mem.Allocator, code: []const u8) !*Contract {
    const contract = try allocator.create(Contract);
    const code_copy = try allocator.alloc(u8, code.len);
    @memcpy(code_copy, code);
    
    contract.* = Contract{
        .code = code_copy,
        .address = Address.zero(), // Just a placeholder
        .code_address = Address.zero(), // Just a placeholder
        .input = &[_]u8{},
        .value = 0,
        .gas = 1000000,
    };
    
    return contract;
}

// Helper for tests to create a mock EVM
pub fn createMockEvm(allocator: std.mem.Allocator) !*Evm {
    const evm = try allocator.create(Evm);
    
    // Create an empty logs array
    const logs = std.ArrayList(Evm.Log).init(allocator);
    
    evm.* = Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = .{
            .IsEIP4844 = true,
            .IsEIP5656 = true,
        },
        .gas_used = 0,
        .remaining_gas = 10000000, // Enough gas for tests
        .refund = 0,
        .chainDB = null,
        .state_manager = null,
        .context = null,
        .logs = logs,
    };
    
    return evm;
}

// Helper for tests to create a mock Interpreter
pub fn createMockInterpreter(allocator: std.mem.Allocator, evm: *Evm) !*Interpreter {
    const interpreter = try allocator.create(Interpreter);
    interpreter.* = Interpreter{
        .evm = evm,
        .readOnly = false,
    };
    
    return interpreter;
}