const std = @import("std");
const testing = std.testing;
const bls12_381_g1add = @import("../../../src/evm/precompiles/bls12_381_g1add.zig");
const PrecompileError = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileError;

test "G1ADD: basic functionality tests" {
    var input: [256]u8 = std.mem.zeroes([256]u8);
    var output: [128]u8 = undefined;
    
    // Test with all zeros (point at infinity + point at infinity)
    const result = bls12_381_g1add.execute(&input, &output, 1000);
    
    // Should succeed and consume 375 gas
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 375), result.get_gas_used());
    try testing.expectEqual(@as(usize, 128), result.get_output_size());
    
    // Output should be point at infinity (all zeros)
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

/// Test gas calculation
test "G1ADD: gas calculation" {
    // Gas cost should be fixed at 375 regardless of input size
    try testing.expectEqual(@as(u64, 375), bls12_381_g1add.calculate_gas(0));
    try testing.expectEqual(@as(u64, 375), bls12_381_g1add.calculate_gas(256));
    try testing.expectEqual(@as(u64, 375), bls12_381_g1add.calculate_gas(1000));
    
    // Checked version should also work
    try testing.expectEqual(@as(u64, 375), try bls12_381_g1add.calculate_gas_checked(256));
}

/// Test input validation
test "G1ADD: input validation" {
    var output: [128]u8 = undefined;
    
    // Test with invalid input length (too short)
    var short_input: [100]u8 = undefined;
    const result1 = bls12_381_g1add.execute(&short_input, &output, 1000);
    try testing.expect(result1.is_failure());
    try testing.expectEqual(PrecompileError.InvalidInput, result1.get_error().?);
    
    // Test with invalid input length (too long)
    var long_input: [300]u8 = undefined;
    const result2 = bls12_381_g1add.execute(&long_input, &output, 1000);
    try testing.expect(result2.is_failure());
    try testing.expectEqual(PrecompileError.InvalidInput, result2.get_error().?);
}

/// Test gas limit validation
test "G1ADD: gas limit validation" {
    var input: [256]u8 = std.mem.zeroes([256]u8);
    var output: [128]u8 = undefined;
    
    // Test with insufficient gas
    const result = bls12_381_g1add.execute(&input, &output, 300); // Less than 375
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.OutOfGas, result.get_error().?);
    
    // Test with exact gas requirement
    const result2 = bls12_381_g1add.execute(&input, &output, 375);
    try testing.expect(result2.is_success());
}

/// Test output buffer validation
test "G1ADD: output buffer validation" {
    var input: [256]u8 = std.mem.zeroes([256]u8);
    var small_output: [64]u8 = undefined; // Too small
    
    // Should fail with insufficient output buffer
    const result = bls12_381_g1add.execute(&input, &small_output, 1000);
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.get_error().?);
}

/// Test output size calculation
test "G1ADD: output size calculation" {
    // Output size should always be 128 bytes regardless of input size
    try testing.expectEqual(@as(usize, 128), bls12_381_g1add.get_output_size(0));
    try testing.expectEqual(@as(usize, 128), bls12_381_g1add.get_output_size(256));
    try testing.expectEqual(@as(usize, 128), bls12_381_g1add.get_output_size(1000));
}

/// Test gas requirement validation
test "G1ADD: gas requirement validation" {
    // Should return true when gas limit is sufficient
    try testing.expect(bls12_381_g1add.validate_gas_requirement(256, 375));
    try testing.expect(bls12_381_g1add.validate_gas_requirement(256, 1000));
    
    // Should return false when gas limit is insufficient
    try testing.expect(!bls12_381_g1add.validate_gas_requirement(256, 300));
    try testing.expect(!bls12_381_g1add.validate_gas_requirement(256, 374));
}

/// Test field element validation (internal function testing)
test "G1ADD: field element validation" {
    // Test with valid field element (all zeros)
    const valid_element = std.mem.zeroes([64]u8);
    try testing.expect(bls12_381_g1add.validate_field_element(&valid_element));
    
    // TODO: Add tests with actual field elements near the modulus
    // This would require implementing proper field arithmetic
}

/// Test G1 point parsing
test "G1ADD: G1 point parsing" {
    var input: [256]u8 = std.mem.zeroes([256]u8);
    
    // Parse point at infinity (all zeros)
    const point1 = try bls12_381_g1add.parse_g1_point(&input, 0);
    try testing.expect(point1.is_infinity());
    
    const point2 = try bls12_381_g1add.parse_g1_point(&input, 128);
    try testing.expect(point2.is_infinity());
}

/// Test with BLS12-381 generator point (this would require proper implementation)
test "G1ADD: PLACEHOLDER test with generator point" {
    // NOTE: This test demonstrates what proper testing would look like
    // The values below are the BLS12-381 G1 generator point coordinates
    // For a real implementation, this would test actual point addition
    
    var input: [256]u8 = std.mem.zeroes([256]u8);
    var output: [128]u8 = undefined;
    
    // BLS12-381 G1 generator point coordinates (big-endian, 64 bytes each)
    // x: 0x0abc...def (would be the actual generator x coordinate)
    // y: 0x1234...567 (would be the actual generator y coordinate)
    
    // For now, test with zeros (point at infinity)
    const result = bls12_381_g1add.execute(&input, &output, 1000);
    
    // Should succeed (point at infinity + point at infinity = point at infinity)
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 375), result.get_gas_used());
    
    // TODO: Add real test vectors from EIP-2537 specification
    // TODO: Test with actual generator point addition
    // TODO: Test with edge cases (point doubling, inverse points)
}