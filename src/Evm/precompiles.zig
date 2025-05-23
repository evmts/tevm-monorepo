const std = @import("std");
const PrecompiledContract = @import("precompiles/Precompiled.zig").PrecompiledContract;
const PrecompiledContractImpl = @import("precompiles/Contract.zig").Contract;
const B256 = @import("../Types/B256.ts");
const Address = @import("../../Address/address.zig").Address;
const ExecutionError = @import("Frame.zig").ExecutionError;

/// Checks if an address corresponds to a precompiled contract
///
/// Precompiled contracts are special contracts built into Ethereum at
/// addresses 1-9, providing optimized implementations of cryptographic
/// and utility functions.
///
/// Parameters:
/// - addr: The address to check
///
/// Returns: true if the address is a precompiled contract, false otherwise
pub fn isPrecompiled(addr: Address) bool {
    const address_bytes = addr.toBytes();
    
    // Create a B256 from the address
    var bytes32: [32]u8 = [_]u8{0} ** 32;
    @memcpy(bytes32[12..32], &address_bytes);
    
    const b256_addr = B256.fromBytes(&bytes32);
    return PrecompiledContract.isPrecompiled(b256_addr);
}

/// Get the precompiled contract at the specified address
///
/// Parameters:
/// - addr: The address of the precompiled contract
/// - allocator: Memory allocator to use for contract operations
///
/// Returns: An optional precompiled contract wrapper, or null if not a precompiled contract
pub fn getPrecompiledContract(addr: Address, allocator: std.mem.Allocator) ?PrecompiledContractImpl {
    const address_bytes = addr.toBytes();
    
    // Create a B256 from the address
    var bytes32: [32]u8 = [_]u8{0} ** 32;
    @memcpy(bytes32[12..32], &address_bytes);
    
    const b256_addr = B256.fromBytes(&bytes32);
    return PrecompiledContractImpl.fromAddress(b256_addr, allocator);
}

/// Run a precompiled contract with the given input data
///
/// This function handles execution of all precompiled contracts in Ethereum.
/// It automatically determines which precompiled contract to run based on the address.
///
/// Parameters:
/// - addr: The address of the precompiled contract to run
/// - input: The input data for the contract
/// - gas: The gas available for execution
/// - allocator: Memory allocator to use for contract operations
///
/// Returns: The result data from the contract execution
/// Error: OutOfGas if not enough gas, or other execution errors
pub fn runPrecompiled(addr: Address, input: []const u8, gas: u64, allocator: std.mem.Allocator) (ExecutionError || std.mem.Allocator.Error)![]u8 {
    // Get the precompiled contract
    const contract = getPrecompiledContract(addr, allocator) orelse {
        return ExecutionError.INVALID;
    };
    
    // Check if we have enough gas
    const gas_cost = contract.gasCost(input);
    if (gas < gas_cost) {
        return ExecutionError.OutOfGas;
    }
    
    // Run the contract
    const result = try contract.run(input);
    
    return result;
}

// Tests
const testing = std.testing;

test "precompiles.zig compiles" {
    // This is a basic test to ensure the module compiles
    // The actual functionality is tested through the precompiles/Precompiled.zig tests
    try testing.expect(true);
}