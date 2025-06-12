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

/// Test with actual BLS12-381 test vectors  
test "G1ADD: test with known G1 generator point" {
    var input: [256]u8 = std.mem.zeroes([256]u8);
    var output: [128]u8 = undefined;
    
    // BLS12-381 G1 generator point coordinates (big-endian, 64 bytes each)
    // x = 0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb
    // y = 0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1
    
    // Point 1: BLS12-381 generator G
    // x coordinate (64 bytes, big-endian with 16-byte padding)
    const g_x = [_]u8{
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // padding
        0x17, 0xf1, 0xd3, 0xa7, 0x31, 0x97, 0xd7, 0x94, 0x26, 0x95, 0x63, 0x8c, 0x4f, 0xa9, 0xac, 0x0f,
        0xc3, 0x68, 0x8c, 0x4f, 0x97, 0x74, 0xb9, 0x05, 0xa1, 0x4e, 0x3a, 0x3f, 0x17, 0x1b, 0xac, 0x58,
        0x6c, 0x55, 0xe8, 0x3f, 0xf9, 0x7a, 0x1a, 0xef, 0xfb, 0x3a, 0xf0, 0x0a, 0xdb, 0x22, 0xc6, 0xbb,
    };
    
    // y coordinate (64 bytes, big-endian with 16-byte padding)
    const g_y = [_]u8{
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // padding
        0x08, 0xb3, 0xf4, 0x81, 0xe3, 0xaa, 0xa0, 0xf1, 0xa0, 0x9e, 0x30, 0xed, 0x74, 0x1d, 0x8a, 0xe4,
        0xfc, 0xf5, 0xe0, 0x95, 0xd5, 0xd0, 0x0a, 0xf6, 0x00, 0xdb, 0x18, 0xcb, 0x2c, 0x04, 0xb3, 0xed,
        0xd0, 0x3c, 0xc7, 0x44, 0xa2, 0x88, 0x8a, 0xe4, 0x0c, 0xaa, 0x23, 0x29, 0x46, 0xc5, 0xe7, 0xe1,
    };
    
    // Point 2: Same as Point 1 (G + G = 2G, point doubling case)
    @memcpy(input[0..64], &g_x);
    @memcpy(input[64..128], &g_y);
    @memcpy(input[128..192], &g_x);
    @memcpy(input[192..256], &g_y);
    
    const result = bls12_381_g1add.execute(&input, &output, 1000);
    
    // Should succeed and consume 375 gas
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 375), result.get_gas_used());
    
    // With current placeholder implementation, this doesn't compute 2G correctly
    // but at least validates that the generator point is accepted as valid input
    
    // TODO: Verify output equals 2G when proper arithmetic is implemented
    // Expected 2G coordinates would be computed by real crypto library
}