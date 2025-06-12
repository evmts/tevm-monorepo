/// ECPAIRING precompile implementation (address 0x08)
///
/// Implements elliptic curve pairing check on the BN254 (alt_bn128) curve
/// according to EIP-197. This precompile verifies that the product of pairings
/// equals the identity element, which is fundamental for zkSNARK verification.
///
/// ## Operation
/// - **Input**: 192k bytes (k pairs of G1 and G2 points)
/// - **Output**: 32 bytes (1 if pairing product equals identity, 0 otherwise)
/// - **Gas Cost**: 45,000 + 34,000×k (Istanbul+) or 100,000 + 80,000×k (Byzantium)
///
/// ## Input Format
/// For each pair (k pairs total):
/// - G1 point: 64 bytes (32-byte x, 32-byte y coordinates)
/// - G2 point: 128 bytes (64-byte x, 64-byte y coordinates in Fq2)
/// Total: 192 bytes per pair
///
/// ## Output Format
/// - 32 bytes: 0x00...01 if verification succeeds, 0x00...00 if fails
///
/// ## Examples
/// ```zig
/// // Single pair verification
/// const input = [192]u8{ /* G1 point (64 bytes) + G2 point (128 bytes) */ };
/// const result = execute(input, output, 100000, .ISTANBUL);
/// // output[31] will be 1 if pairing check succeeds
/// ```

const std = @import("std");
const bn254 = @import("bn254.zig");
const pairing = @import("pairing.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const ChainRules = @import("../hardforks/chain_rules.zig");

/// Calculate gas cost for ECPAIRING with hardfork awareness
///
/// Gas cost depends on the number of pairs and the hardfork:
/// - Istanbul and later: 45,000 + 34,000 × pairs
/// - Pre-Istanbul: 100,000 + 80,000 × pairs
///
/// @param input_size Size of input data in bytes (must be multiple of 192)
/// @param chain_rules Current chain rules defining the hardfork
/// @return Gas cost for the operation
pub fn calculate_gas(input_size: usize, chain_rules: ChainRules) u64 {
    if (input_size % 192 != 0) return 0; // Invalid input size
    const num_pairs = input_size / 192;

    if (chain_rules.IsIstanbul) {
        return gas_constants.ECPAIRING_BASE_GAS + 
               gas_constants.ECPAIRING_PAIR_GAS * @as(u64, @intCast(num_pairs));
    } else {
        return gas_constants.ECPAIRING_BASE_GAS_BYZANTIUM + 
               gas_constants.ECPAIRING_PAIR_GAS_BYZANTIUM * @as(u64, @intCast(num_pairs));
    }
}

/// Calculate gas cost with input size and hardfork awareness (for dispatcher)
///
/// ECPAIRING has dynamic gas cost based on number of pairs and hardfork.
/// Since we don't have access to ChainRules in this function signature, we return
/// the Istanbul gas cost as the default (more common case).
///
/// @param input_size Size of input data in bytes
/// @return Gas cost (Istanbul rates, may be adjusted by dispatcher)
pub fn calculate_gas_checked(input_size: usize) !u64 {
    if (input_size % 192 != 0) return error.InvalidInputSize;
    const num_pairs = input_size / 192;
    
    // Return Istanbul gas cost as default since we can't access ChainRules here
    return gas_constants.ECPAIRING_BASE_GAS + 
           gas_constants.ECPAIRING_PAIR_GAS * @as(u64, @intCast(num_pairs));
}

/// Execute ECPAIRING precompile
///
/// Performs elliptic curve pairing check on BN254 curve pairs.
/// Validates all input points and computes the pairing product.
/// Gas costs are hardfork-aware: higher for pre-Istanbul hardforks.
///
/// @param input Input data (192k bytes: k pairs of G1+G2 points)
/// @param output Output buffer (must be >= 32 bytes)
/// @param gas_limit Available gas for execution
/// @param chain_rules Current chain rules defining the hardfork
/// @return PrecompileOutput with success/failure and gas usage
pub fn execute(input: []const u8, output: []u8, gas_limit: u64, chain_rules: ChainRules) PrecompileOutput {
    const gas_cost = calculate_gas(input.len, chain_rules);
    
    // Check gas limit
    if (gas_cost > gas_limit) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    }
    
    // Validate output buffer size
    if (output.len < 32) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Input must be multiple of 192 bytes (192 bytes per pair)
    if (input.len % 192 != 0) {
        @branchHint(.cold);
        // Invalid input length: return false (all zeros)
        @memset(output[0..32], 0);
        return PrecompileOutput.success_result(gas_cost, 32);
    }
    
    const num_pairs = input.len / 192;
    
    // Handle empty input (should return true)
    if (num_pairs == 0) {
        @branchHint(.unlikely);
        @memset(output[0..32], 0);
        output[31] = 1; // Empty pairing check returns true
        return PrecompileOutput.success_result(gas_cost, 32);
    }
    
    // Parse all pairs from input
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    var pairs = std.ArrayList(pairing.PairingInput).init(allocator);
    defer pairs.deinit();
    
    // Parse each pair
    var i: usize = 0;
    while (i < num_pairs) : (i += 1) {
        @branchHint(.likely);
        const offset = i * 192;
        
        // Parse G1 point (64 bytes)
        const g1 = bn254.G1Point.from_bytes(input[offset..offset + 64]) catch {
            @branchHint(.cold);
            // Invalid G1 point: return false
            @memset(output[0..32], 0);
            return PrecompileOutput.success_result(gas_cost, 32);
        };
        
        // Parse G2 point (128 bytes)
        const g2 = bn254.G2Point.from_bytes(input[offset + 64..offset + 192]) catch {
            @branchHint(.cold);
            // Invalid G2 point: return false
            @memset(output[0..32], 0);
            return PrecompileOutput.success_result(gas_cost, 32);
        };
        
        pairs.append(pairing.PairingInput{ .g1 = g1, .g2 = g2 }) catch {
            @branchHint(.cold);
            // Memory allocation failed
            return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
        };
    }
    
    // Perform pairing check
    const result = pairing.pairing_check(pairs.items);
    
    // Write result to output
    @memset(output[0..32], 0);
    if (result) {
        output[31] = 1; // Pairing check succeeded
    }
    // If result is false, output remains all zeros
    
    return PrecompileOutput.success_result(gas_cost, 32);
}

/// Get expected output size for ECPAIRING
///
/// ECPAIRING always returns 32 bytes regardless of input size.
///
/// @param input_size Size of input data (ignored)
/// @return Fixed output size of 32 bytes
pub fn get_output_size(input_size: usize) usize {
    _ = input_size;
    return 32;
}

/// Validate gas requirement without executing
///
/// Checks if ECPAIRING would succeed with the given gas limit and hardfork.
///
/// @param input_size Size of input data
/// @param gas_limit Available gas limit
/// @param chain_rules Current chain rules defining the hardfork
/// @return true if operation would succeed
pub fn validate_gas_requirement(input_size: usize, gas_limit: u64, chain_rules: ChainRules) bool {
    const gas_cost = calculate_gas(input_size, chain_rules);
    return gas_cost <= gas_limit;
}

// Tests
test "ECPAIRING gas calculation" {
    const istanbul_rules = ChainRules.for_hardfork(.ISTANBUL);
    const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
    
    // Test gas for empty input
    const empty_gas_istanbul = calculate_gas(0, istanbul_rules);
    const empty_gas_byzantium = calculate_gas(0, byzantium_rules);
    try std.testing.expectEqual(gas_constants.ECPAIRING_BASE_GAS, empty_gas_istanbul);
    try std.testing.expectEqual(gas_constants.ECPAIRING_BASE_GAS_BYZANTIUM, empty_gas_byzantium);
    
    // Test gas for single pair
    const single_gas_istanbul = calculate_gas(192, istanbul_rules);
    const single_gas_byzantium = calculate_gas(192, byzantium_rules);
    try std.testing.expectEqual(
        gas_constants.ECPAIRING_BASE_GAS + gas_constants.ECPAIRING_PAIR_GAS, 
        single_gas_istanbul
    );
    try std.testing.expectEqual(
        gas_constants.ECPAIRING_BASE_GAS_BYZANTIUM + gas_constants.ECPAIRING_PAIR_GAS_BYZANTIUM, 
        single_gas_byzantium
    );
    
    // Test invalid input size
    try std.testing.expectEqual(@as(u64, 0), calculate_gas(100, istanbul_rules));
}

test "ECPAIRING empty input" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    var output: [32]u8 = [_]u8{0} ** 32;
    
    const result = execute(&[_]u8{}, &output, 100000, chain_rules);
    try std.testing.expect(result.is_success());
    try std.testing.expectEqual(@as(usize, 32), result.get_output_size());
    
    // Empty input should return true (all zeros except last byte = 1)
    for (output[0..31]) |byte| {
        try std.testing.expectEqual(@as(u8, 0), byte);
    }
    try std.testing.expectEqual(@as(u8, 1), output[31]);
}

test "ECPAIRING invalid input length" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Input length not multiple of 192
    const invalid_input = [_]u8{0} ** 100;
    const result = execute(&invalid_input, &output, 100000, chain_rules);
    try std.testing.expect(result.is_success());
    
    // Invalid input should return false (all zeros)
    for (output) |byte| {
        try std.testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ECPAIRING insufficient gas" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    var output: [32]u8 = [_]u8{0} ** 32;
    
    const result = execute(&[_]u8{}, &output, 1000, chain_rules); // Too little gas
    try std.testing.expect(!result.is_success());
    try std.testing.expectEqual(PrecompileError.OutOfGas, result.get_error().?);
}

test "ECPAIRING output size" {
    try std.testing.expectEqual(@as(usize, 32), get_output_size(0));
    try std.testing.expectEqual(@as(usize, 32), get_output_size(192));
    try std.testing.expectEqual(@as(usize, 32), get_output_size(1000));
}