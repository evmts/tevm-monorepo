const std = @import("std");

// Use the simplified test package that avoids external imports
const pkg = @import("package_test.zig");
pub const Frame = pkg.Frame;
pub const ExecutionError = pkg.ExecutionError;
pub const Interpreter = pkg.Interpreter;
pub const Evm = pkg.Evm;
pub const Contract = pkg.Contract;
pub const Memory = pkg.Memory;
pub const Stack = pkg.Stack;
pub const Address = pkg.Address;
pub const JumpTable = pkg.JumpTable;

// Define a constant for the u256 type to ensure consistency across test files

/// Creates a mock contract for testing
pub fn createMockContract(allocator: std.mem.Allocator, code: []const u8) !*Contract {
    const contract = try allocator.create(Contract);
    
    // Initialize contract with safe defaults
    contract.* = Contract.init(Address.zero(), Address.zero());
    
    // Safely copy the provided code
    contract.code = try allocator.dupe(u8, code);
    
    return contract;
}

/// Creates a mock EVM instance
pub fn createMockEvm(allocator: std.mem.Allocator) !*Evm {
    const evm = try allocator.create(Evm);
    
    // Initialize with all fields to prevent undefined behavior
    evm.* = Evm{
        .depth = 0,
        .readOnly = false,
        .chainDB = null,
        .chainRules = .{
            .IsEIP4844 = true,
            .IsEIP5656 = true,
        },
        .state_manager = null,
        .gas_used = 0,
        .remaining_gas = 1000000,
        .refund = 0,
        .logs = std.ArrayList(Evm.Log).init(allocator),
        .context = null,
    };
    
    return evm;
}

/// Creates a mock interpreter
pub fn createMockInterpreter(allocator: std.mem.Allocator, evm: *Evm) !*Interpreter {
    const interpreter = try allocator.create(Interpreter);
    
    // Initialize with all fields to prevent undefined behavior
    interpreter.* = Interpreter{
        .evm = evm,
        .cfg = 0,
        .readOnly = false,
        .returnData = &[_]u8{},
        .returnSize = 0,
        .memory = undefined, // Will be initialized by the test
        .stack = undefined,  // Will be initialized by the test
        .contract = null,
        .gas = 1000000,
        .gas_used = 0,
        .jumpTable = null,
        .running = false,
        .stop = false,
        .err = null,
    };
    
    return interpreter;
}