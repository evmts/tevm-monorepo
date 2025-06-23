/// ECADD precompile implementation (address 0x06)
///
/// Implements elliptic curve point addition on the BN254 (alt_bn128) curve according to EIP-196.
/// This precompile adds two points on the elliptic curve and is used for zkSNARK verification
/// and other cryptographic applications requiring elliptic curve operations.
///
/// ## Gas Cost
/// - Byzantium to Berlin: 500 gas
/// - Istanbul onwards: 150 gas (EIP-1108 optimization)
///
/// ## Input Format
/// - 128 bytes total (4 × 32-byte fields)
/// - Bytes 0-31: x1 coordinate (big-endian)
/// - Bytes 32-63: y1 coordinate (big-endian)  
/// - Bytes 64-95: x2 coordinate (big-endian)
/// - Bytes 96-127: y2 coordinate (big-endian)
/// - Shorter inputs are zero-padded
///
/// ## Output Format
/// - 64 bytes (2 × 32-byte coordinates)
/// - Bytes 0-31: x coordinate of result (big-endian)
/// - Bytes 32-63: y coordinate of result (big-endian)
/// - Point at infinity represented as (0, 0)
///
/// ## Error Handling
/// - Invalid points (not on curve): Return (0, 0)
/// - Malformed input: Return (0, 0)
/// - Out of gas: Standard precompile error

const std = @import("std");
const bn254 = @import("bn254.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const ChainRules = @import("../hardforks/chain_rules.zig");

/// Calculate gas cost for ECADD based on chain rules
///
/// Gas costs changed with EIP-1108 (Istanbul hardfork) to make elliptic curve
/// operations more affordable for zkSNARK applications.
///
/// @param chain_rules Current chain configuration
/// @return Gas cost for ECADD operation
pub fn calculate_gas(chain_rules: ChainRules) u64 {
    if (chain_rules.IsIstanbul) {
        @branchHint(.likely);
        return gas_constants.ECADD_GAS_COST;
    } else {
        @branchHint(.cold);
        return gas_constants.ECADD_GAS_COST_BYZANTIUM;
    }
}

/// Calculate gas cost with overflow protection (for precompile dispatcher)
///
/// This is a compatibility function for the precompile dispatcher system.
/// Since ECADD has fixed gas costs that depend on hardfork rules rather than input size,
/// this function returns the modern (Istanbul+) gas cost as the default.
///
/// @param input_size Size of input data (not used for ECADD)
/// @return Gas cost for ECADD operation
pub fn calculate_gas_checked(input_size: usize) !u64 {
    _ = input_size; // ECADD has fixed gas cost regardless of input size
    // Return Istanbul gas cost as default (most common case)
    // The actual hardfork-specific gas cost will be calculated in execute()
    return gas_constants.ECADD_GAS_COST;
}

/// Execute ECADD precompile
///
/// This is the main entry point for ECADD execution. It performs:
/// 1. Gas cost validation
/// 2. Input parsing and padding
/// 3. Point validation
/// 4. Elliptic curve point addition
/// 5. Result formatting
///
/// @param input Input data (up to 128 bytes)
/// @param output Output buffer (must be >= 64 bytes)  
/// @param gas_limit Maximum gas available
/// @param chain_rules Current chain configuration
/// @return PrecompileOutput with success/failure and gas usage
pub fn execute(input: []const u8, output: []u8, gas_limit: u64, chain_rules: ChainRules) PrecompileOutput {
    // Calculate and validate gas cost
    const gas_cost = calculate_gas(chain_rules);
    if (gas_cost > gas_limit) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    }

    // Validate output buffer size
    if (output.len < 64) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }

    // Pad input to exactly 128 bytes (zero-padding for shorter inputs)
    var padded_input: [128]u8 = [_]u8{0} ** 128;
    const copy_len = @min(input.len, 128);
    @memcpy(padded_input[0..copy_len], input[0..copy_len]);

    // Parse first point (bytes 0-63)
    const point1 = bn254.G1Point.from_bytes(padded_input[0..64]) catch {
        @branchHint(.cold);
        // Invalid points result in point at infinity (0, 0)
        @memset(output[0..64], 0);
        return PrecompileOutput.success_result(gas_cost, 64);
    };

    // Parse second point (bytes 64-127)
    const point2 = bn254.G1Point.from_bytes(padded_input[64..128]) catch {
        @branchHint(.cold);
        // Invalid points result in point at infinity (0, 0)
        @memset(output[0..64], 0);
        return PrecompileOutput.success_result(gas_cost, 64);
    };

    // Perform elliptic curve point addition
    const result_point = point1.add(point2);

    // Convert result to bytes and write to output
    result_point.to_bytes(output[0..64]);

    return PrecompileOutput.success_result(gas_cost, 64);
}

/// Get expected output size for ECADD
///
/// ECADD always produces 64 bytes of output (two 32-byte coordinates).
///
/// @param input_size Size of input data (unused)
/// @return Fixed output size of 64 bytes
pub fn get_output_size(input_size: usize) usize {
    _ = input_size; // Output size is fixed regardless of input
    return 64;
}

/// Validate gas requirement without executing
///
/// Checks if an ECADD call would succeed with the given gas limit.
///
/// @param input_size Size of input data (unused)
/// @param gas_limit Available gas limit
/// @param chain_rules Current chain configuration
/// @return true if operation would succeed
pub fn validate_gas_requirement(input_size: usize, gas_limit: u64, chain_rules: ChainRules) bool {
    _ = input_size; // Gas cost is fixed regardless of input size
    const gas_cost = calculate_gas(chain_rules);
    return gas_cost <= gas_limit;
}

// Tests
const testing = std.testing;

test "ECADD basic point addition" {
    // Create chain rules for Istanbul hardfork (150 gas cost)
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);

    // Test adding point at infinity to itself
    var input = [_]u8{0} ** 128; // All zeros = two points at infinity
    var output = [_]u8{0} ** 64;

    const result = execute(&input, &output, 1000, chain_rules);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());
    try testing.expectEqual(@as(usize, 64), result.get_output_size());

    // Result should be point at infinity (0, 0)
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ECADD generator point addition" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);

    // Test adding generator point (1, 2) to point at infinity
    var input = [_]u8{0} ** 128;
    
    // Set first point to (1, 2)
    input[31] = 1; // x1 = 1
    input[63] = 2; // y1 = 2
    // Second point remains (0, 0)

    var output = [_]u8{0} ** 64;
    const result = execute(&input, &output, 1000, chain_rules);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());

    // Result should be (1, 2)
    try testing.expectEqual(@as(u8, 1), output[31]); // x coordinate
    try testing.expectEqual(@as(u8, 2), output[63]); // y coordinate
}

test "ECADD point doubling" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);

    // Test adding point (1, 2) to itself
    var input = [_]u8{0} ** 128;
    
    // Set both points to (1, 2)
    input[31] = 1; // x1 = 1
    input[63] = 2; // y1 = 2
    input[95] = 1; // x2 = 1
    input[127] = 2; // y2 = 2

    var output = [_]u8{0} ** 64;
    const result = execute(&input, &output, 1000, chain_rules);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());

    // Result should be 2*(1, 2) which is a specific point on the curve
    // The exact coordinates depend on the curve arithmetic
    // Just verify we got a non-zero result
    var all_zero = true;
    for (output) |byte| {
        if (byte != 0) {
            all_zero = false;
            break;
        }
    }
    try testing.expect(!all_zero);
}

test "ECADD invalid points" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);

    // Test with invalid point (1, 1) - not on curve
    var input = [_]u8{0} ** 128;
    input[31] = 1; // x1 = 1
    input[63] = 1; // y1 = 1 (invalid)

    var output = [_]u8{0} ** 64;
    const result = execute(&input, &output, 1000, chain_rules);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());

    // Result should be point at infinity (0, 0)
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ECADD gas costs by hardfork" {
    // Test Byzantium gas cost (before Istanbul)
    const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
    const byzantium_gas = calculate_gas(byzantium_rules);
    try testing.expectEqual(@as(u64, 500), byzantium_gas);

    // Test Istanbul gas cost (reduced costs)
    const istanbul_rules = ChainRules.for_hardfork(.ISTANBUL);
    const istanbul_gas = calculate_gas(istanbul_rules);
    try testing.expectEqual(@as(u64, 150), istanbul_gas);
}

test "ECADD out of gas" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);

    var input = [_]u8{0} ** 128;
    var output = [_]u8{0} ** 64;

    // Provide insufficient gas
    const result = execute(&input, &output, 100, chain_rules);
    
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.OutOfGas, result.get_error().?);
}

test "ECADD short input handling" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);

    // Test with short input (should be zero-padded)
    var input = [_]u8{1, 2, 3}; // Only 3 bytes
    var output = [_]u8{0} ** 64;

    const result = execute(&input, &output, 1000, chain_rules);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());

    // Should treat as mostly zero input and return point at infinity
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}