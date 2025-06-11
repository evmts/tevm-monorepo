/// ECMUL precompile implementation (address 0x07)
///
/// Implements elliptic curve scalar multiplication on the BN254 (alt_bn128) curve
/// according to EIP-196. This precompile multiplies a point on the curve by a scalar
/// value and is fundamental for zero-knowledge proof systems.
///
/// ## Operation
/// - **Input**: 96 bytes (32-byte x, 32-byte y, 32-byte scalar)
/// - **Output**: 64 bytes (32-byte x, 32-byte y coordinates of result)
/// - **Gas Cost**: 6,000 (Istanbul+) or 40,000 (Byzantium-Constantinople)
///
/// ## Mathematical Operation
/// Given point P = (x, y) and scalar s, computes Q = s × P where:
/// - If s = 0 or P is point at infinity, result is (0, 0)
/// - If P is not on curve, result is (0, 0) 
/// - Otherwise result is the scalar multiplication s × P
///
/// ## Examples
/// ```zig
/// // Multiply generator point by 2
/// const input = [96]u8{ /* (1, 2, 2) */ };
/// const result = execute(input, output, 10000, .ISTANBUL);
/// // output contains doubled generator point
/// ```

const std = @import("std");
const bn254 = @import("bn254.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const ChainRules = @import("../hardforks/chain_rules.zig");
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;

/// Calculate gas cost for ECMUL with hardfork awareness
///
/// Returns the appropriate gas cost based on the hardfork:
/// - Byzantium to Berlin: 40,000 gas
/// - Istanbul and later: 6,000 gas (EIP-1108)
///
/// @param chain_rules Current chain rules defining the hardfork
/// @return Hardfork-specific gas cost for ECMUL operation
pub fn calculate_gas(chain_rules: ChainRules) u64 {
    if (chain_rules.IsIstanbul) {
        return gas_constants.ECMUL_GAS_COST;
    } else {
        return gas_constants.ECMUL_GAS_COST_BYZANTIUM;
    }
}

/// Calculate gas cost with input size and hardfork awareness
///
/// ECMUL has fixed gas cost regardless of input size, but varies by hardfork.
///
/// @param input_size Size of input data (ignored)
/// @param chain_rules Current chain rules defining the hardfork
/// @return Fixed gas cost for current hardfork
pub fn calculate_gas_checked(input_size: usize, chain_rules: ChainRules) !u64 {
    _ = input_size;
    return calculate_gas(chain_rules);
}

/// Execute ECMUL precompile
///
/// Performs elliptic curve scalar multiplication on BN254 curve.
/// Input validation ensures only valid curve points are processed.
/// Gas costs are hardfork-aware: 40,000 (Byzantium) vs 6,000 (Istanbul+).
///
/// @param input Input data (96 bytes: x, y, scalar)
/// @param output Output buffer (must be >= 64 bytes)
/// @param gas_limit Available gas for execution
/// @param chain_rules Current chain rules defining the hardfork
/// @return PrecompileOutput with success/failure and gas usage
pub fn execute(input: []const u8, output: []u8, gas_limit: u64, chain_rules: ChainRules) PrecompileOutput {
    const gas_cost = calculate_gas(chain_rules);
    
    // Check gas limit
    if (gas_cost > gas_limit) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    }
    
    // Validate output buffer size
    if (output.len < 64) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Pad input to 96 bytes if shorter (remaining bytes are zero)
    var padded_input: [96]u8 = [_]u8{0} ** 96;
    const copy_len = @min(input.len, 96);
    @memcpy(padded_input[0..copy_len], input[0..copy_len]);
    
    // Parse input components
    const point = bn254.G1Point.from_bytes(padded_input[0..64]) catch {
        @branchHint(.cold);
        // Invalid point: return point at infinity (0, 0)
        @memset(output[0..64], 0);
        return PrecompileOutput.success_result(gas_cost, 64);
    };
    
    const scalar = bytes_to_u256(padded_input[64..96]);
    
    // Perform scalar multiplication
    const result_point = point.scalar_multiply(scalar);
    
    // Write result to output
    result_point.to_bytes(output[0..64]);
    
    return PrecompileOutput.success_result(gas_cost, 64);
}

/// Get expected output size for ECMUL
///
/// ECMUL always returns 64 bytes (two 32-byte coordinates).
///
/// @param input_size Size of input data (ignored)
/// @return Fixed output size of 64 bytes
pub fn get_output_size(input_size: usize) usize {
    _ = input_size;
    return 64;
}

/// Validate gas requirement without executing
///
/// Checks if ECMUL would succeed with the given gas limit.
///
/// @param input_size Size of input data (ignored)
/// @param gas_limit Available gas limit
/// @param chain_rules Current chain rules defining the hardfork
/// @return true if operation would succeed
pub fn validate_gas_requirement(input_size: usize, gas_limit: u64, chain_rules: ChainRules) bool {
    _ = input_size;
    const gas_cost = calculate_gas(chain_rules);
    return gas_cost <= gas_limit;
}

/// Convert 32-byte big-endian byte array to u256
fn bytes_to_u256(bytes: []const u8) u256 {
    if (bytes.len != 32) return 0;
    
    var result: u256 = 0;
    for (bytes) |byte| {
        result = (result << 8) | @as(u256, byte);
    }
    return result;
}

// Tests
test "ECMUL basic functionality" {
    const testing = std.testing;
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL); // Use Istanbul rules
    
    // Test input: generator point (1, 2) × 2 = doubled generator
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set point coordinates: (1, 2)
    input[31] = 1; // x = 1
    input[63] = 2; // y = 2
    
    // Set scalar: 2
    input[95] = 2; // scalar = 2
    
    const result = execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 64), result.get_output_size());
    
    // Result should be the doubled generator point
    const expected_doubled = bn254.G1Point.GENERATOR.double();
    var expected_bytes: [64]u8 = undefined;
    expected_doubled.to_bytes(&expected_bytes);
    
    try testing.expectEqualSlices(u8, &expected_bytes, &output);
}

test "ECMUL zero scalar" {
    const testing = std.testing;
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test input: any point × 0 = point at infinity (0, 0)
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set point coordinates: (1, 2)
    input[31] = 1; // x = 1  
    input[63] = 2; // y = 2
    
    // scalar is already 0
    
    const result = execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    
    // Result should be point at infinity (all zeros)
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ECMUL unit scalar" {
    const testing = std.testing;
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test input: any point × 1 = same point
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set point coordinates: (1, 2)
    input[31] = 1; // x = 1
    input[63] = 2; // y = 2
    
    // Set scalar: 1
    input[95] = 1; // scalar = 1
    
    const result = execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    
    // Result should be the same point
    try testing.expectEqual(@as(u8, 1), output[31]); // x = 1
    try testing.expectEqual(@as(u8, 2), output[63]); // y = 2
}

test "ECMUL invalid point" {
    const testing = std.testing;
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test input: invalid point (not on curve)
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set invalid point coordinates: (1, 3) - not on curve
    input[31] = 1; // x = 1
    input[63] = 3; // y = 3 (invalid)
    
    // Set scalar: 2
    input[95] = 2; // scalar = 2
    
    const result = execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    
    // Result should be point at infinity (all zeros) for invalid input
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ECMUL gas costs" {
    const testing = std.testing;
    
    // Test Istanbul gas cost
    const istanbul_rules = ChainRules.for_hardfork(.ISTANBUL);
    const istanbul_cost = calculate_gas(istanbul_rules);
    try testing.expectEqual(gas_constants.ECMUL_GAS_COST, istanbul_cost);
    
    // Test Byzantium gas cost
    const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
    const byzantium_cost = calculate_gas(byzantium_rules);
    try testing.expectEqual(gas_constants.ECMUL_GAS_COST_BYZANTIUM, byzantium_cost);
    
    // Test gas limit validation
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    const result = execute(&input, &output, 1000, istanbul_rules); // Insufficient gas
    try testing.expect(!result.is_success());
    try testing.expectEqual(PrecompileError.OutOfGas, result.get_error().?);
}

test "ECMUL short input padding" {
    const testing = std.testing;
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test with input shorter than 96 bytes (should be padded with zeros)
    var input: [50]u8 = [_]u8{0} ** 50;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set point coordinates: (1, 2)
    input[31] = 1; // x = 1
    // y and scalar remain 0 due to padding
    
    const result = execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    
    // Result should be point at infinity due to scalar = 0
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ECMUL windowed vs binary method consistency" {
    const testing = std.testing;
    
    // Test that windowed and binary methods give same results
    const point = bn254.G1Point.GENERATOR;
    const scalar: u256 = 123456789;
    
    const result1 = point.scalar_multiply(scalar);
    const result2 = point.scalar_multiply_windowed(scalar);
    
    try testing.expectEqual(result1.x, result2.x);
    try testing.expectEqual(result1.y, result2.y);
}