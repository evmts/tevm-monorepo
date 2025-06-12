const std = @import("std");
const testing = std.testing;
const bls12_381_g2msm = @import("../../../src/evm/precompiles/bls12_381_g2msm.zig");
const PrecompileError = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileError;

/// Test basic functionality with single pair (scalar, G2 point)
test "G2MSM: basic functionality - single pair" {
    // Single pair: 32 bytes (scalar) + 256 bytes (G2 point) = 288 bytes
    var input: [288]u8 = std.mem.zeroes([288]u8);
    var output: [256]u8 = undefined;
    
    // Test with all zeros (zero scalar + point at infinity)
    const result = bls12_381_g2msm.execute(&input, &output, 100000);
    
    // Should succeed 
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 256), result.get_output_size());
    
    // Output should be point at infinity (all zeros for placeholder implementation)
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

/// Test basic functionality with multiple pairs
test "G2MSM: basic functionality - multiple pairs" {
    // Two pairs: 2 * 288 = 576 bytes
    var input: [576]u8 = std.mem.zeroes([576]u8);
    var output: [256]u8 = undefined;
    
    // Test with all zeros 
    const result = bls12_381_g2msm.execute(&input, &output, 200000);
    
    // Should succeed
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 256), result.get_output_size());
}

/// Test gas calculation for single pair
test "G2MSM: gas calculation - single pair" {
    const input_size: usize = 288; // One pair
    
    // Expected: base_cost (55000) + (1 * per_pair_cost * discount_1000/1000)
    // = 55000 + (1 * 32000 * 1000/1000) = 55000 + 32000 = 87000
    const expected_gas: u64 = 87000;
    
    try testing.expectEqual(expected_gas, bls12_381_g2msm.calculate_gas(input_size));
    try testing.expectEqual(expected_gas, try bls12_381_g2msm.calculate_gas_checked(input_size));
}

/// Test gas calculation for multiple pairs with discount
test "G2MSM: gas calculation - multiple pairs with discount" {
    // Test 2 pairs (discount should be 1000 for index 1)
    const input_size_2: usize = 576; // Two pairs
    const expected_gas_2: u64 = 55000 + (2 * 32000 * 1000 / 1000); // = 119000
    try testing.expectEqual(expected_gas_2, bls12_381_g2msm.calculate_gas(input_size_2));
    
    // Test 3 pairs (discount should be 923 for index 2)
    const input_size_3: usize = 864; // Three pairs
    const expected_gas_3: u64 = 55000 + (3 * 32000 * 923 / 1000); // = 55000 + 88608 = 143608
    try testing.expectEqual(expected_gas_3, bls12_381_g2msm.calculate_gas(input_size_3));
}

/// Test input validation - length requirements
test "G2MSM: input validation - length requirements" {
    var output: [256]u8 = undefined;
    
    // Test with empty input
    var empty_input: [0]u8 = undefined;
    const result1 = bls12_381_g2msm.execute(&empty_input, &output, 100000);
    try testing.expect(result1.is_failure());
    try testing.expectEqual(PrecompileError.InvalidInput, result1.get_error().?);
    
    // Test with input not multiple of 288 bytes
    var invalid_input: [287]u8 = undefined; // 287 is not multiple of 288
    const result2 = bls12_381_g2msm.execute(&invalid_input, &output, 100000);
    try testing.expect(result2.is_failure());
    try testing.expectEqual(PrecompileError.InvalidInput, result2.get_error().?);
    
    // Test with input not multiple of 288 bytes (too long)
    var invalid_input2: [289]u8 = undefined; // 289 is not multiple of 288
    const result3 = bls12_381_g2msm.execute(&invalid_input2, &output, 100000);
    try testing.expect(result3.is_failure());
    try testing.expectEqual(PrecompileError.InvalidInput, result3.get_error().?);
}

/// Test gas limit validation
test "G2MSM: gas limit validation" {
    var input: [288]u8 = std.mem.zeroes([288]u8); // Single pair
    var output: [256]u8 = undefined;
    
    // Calculate required gas for single pair
    const required_gas = bls12_381_g2msm.calculate_gas(288); // Should be 87000
    
    // Test with insufficient gas
    const result1 = bls12_381_g2msm.execute(&input, &output, required_gas - 1);
    try testing.expect(result1.is_failure());
    try testing.expectEqual(PrecompileError.OutOfGas, result1.get_error().?);
    
    // Test with exact gas requirement
    const result2 = bls12_381_g2msm.execute(&input, &output, required_gas);
    try testing.expect(result2.is_success());
    try testing.expectEqual(required_gas, result2.get_gas_used());
    
    // Test with excess gas
    const result3 = bls12_381_g2msm.execute(&input, &output, required_gas + 1000);
    try testing.expect(result3.is_success());
    try testing.expectEqual(required_gas, result3.get_gas_used());
}

/// Test output buffer validation
test "G2MSM: output buffer validation" {
    var input: [288]u8 = std.mem.zeroes([288]u8);
    var small_output: [255]u8 = undefined; // Too small, needs 256 bytes
    
    // Should fail with insufficient output buffer
    const result = bls12_381_g2msm.execute(&input, &small_output, 100000);
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.get_error().?);
}

/// Test output size calculation
test "G2MSM: output size calculation" {
    // Output size should always be 256 bytes regardless of input size
    try testing.expectEqual(@as(usize, 256), bls12_381_g2msm.get_output_size(288));  // 1 pair
    try testing.expectEqual(@as(usize, 256), bls12_381_g2msm.get_output_size(576));  // 2 pairs
    try testing.expectEqual(@as(usize, 256), bls12_381_g2msm.get_output_size(864));  // 3 pairs
}

/// Test gas requirement validation
test "G2MSM: gas requirement validation" {
    // Single pair requires 87000 gas
    try testing.expect(bls12_381_g2msm.validate_gas_requirement(288, 87000));
    try testing.expect(bls12_381_g2msm.validate_gas_requirement(288, 100000));
    
    // Should return false when gas limit is insufficient
    try testing.expect(!bls12_381_g2msm.validate_gas_requirement(288, 86999));
    try testing.expect(!bls12_381_g2msm.validate_gas_requirement(288, 50000));
    
    // Invalid input size should return false
    try testing.expect(!bls12_381_g2msm.validate_gas_requirement(287, 100000)); // Not multiple of 288
    try testing.expect(!bls12_381_g2msm.validate_gas_requirement(0, 100000));   // Empty input
}

/// Test gas calculation edge cases
test "G2MSM: gas calculation edge cases" {
    // Invalid input sizes should return max gas
    try testing.expectEqual(std.math.maxInt(u64), bls12_381_g2msm.calculate_gas(0));
    try testing.expectEqual(std.math.maxInt(u64), bls12_381_g2msm.calculate_gas(287));
    try testing.expectEqual(std.math.maxInt(u64), bls12_381_g2msm.calculate_gas(289));
    
    // Checked version should return errors for invalid input
    try testing.expectError(error.InvalidInput, bls12_381_g2msm.calculate_gas_checked(0));
    try testing.expectError(error.InvalidInput, bls12_381_g2msm.calculate_gas_checked(287));
}

/// Test field element validation functionality
test "G2MSM: field element validation" {
    // Test with valid field element (all zeros)
    const valid_element = std.mem.zeroes([64]u8);
    try testing.expect(bls12_381_g2msm.validate_field_element(&valid_element));
    
    // Test with invalid field element length
    const invalid_length: [63]u8 = undefined;
    try testing.expect(!bls12_381_g2msm.validate_field_element(&invalid_length));
}

/// Test large batch efficiency
test "G2MSM: large batch gas efficiency" {
    // Test that larger batches get better gas efficiency due to discount table
    
    // 1 pair: base + 1 * per_pair * 1000/1000
    const gas_1 = bls12_381_g2msm.calculate_gas(288);
    const per_pair_1 = (gas_1 - 55000) / 1;
    
    // 10 pairs: base + 10 * per_pair * discount/1000 (discount should be 770)
    const gas_10 = bls12_381_g2msm.calculate_gas(2880); // 10 * 288
    const per_pair_10 = (gas_10 - 55000) / 10;
    
    // Per-pair cost should be lower for larger batches due to discount
    try testing.expect(per_pair_10 < per_pair_1);
    
    // Verify the discount is working as expected
    // For 10 pairs (index 9), discount should be 770
    const expected_gas_10 = 55000 + (10 * 32000 * 770 / 1000);
    try testing.expectEqual(expected_gas_10, gas_10);
}

/// Test scalar and point parsing edge cases
test "G2MSM: scalar and point parsing" {
    var input: [288]u8 = std.mem.zeroes([288]u8);
    var output: [256]u8 = undefined;
    
    // All zeros should be valid (zero scalar, point at infinity)
    const result1 = bls12_381_g2msm.execute(&input, &output, 100000);
    try testing.expect(result1.is_success());
    
    // Test with non-zero scalar (placeholder implementation should handle)
    input[31] = 1; // Set last byte of scalar to 1
    const result2 = bls12_381_g2msm.execute(&input, &output, 100000);
    try testing.expect(result2.is_success());
}

/// Test maximum reasonable input size
test "G2MSM: maximum input handling" {
    // Test with a reasonable maximum number of pairs (e.g., 100 pairs)
    const max_pairs = 100;
    const max_input_size = max_pairs * 288;
    
    // Should be able to calculate gas without overflow
    const gas_cost = bls12_381_g2msm.calculate_gas(max_input_size);
    try testing.expect(gas_cost < std.math.maxInt(u64));
    
    // Checked version should also work
    const checked_gas = try bls12_381_g2msm.calculate_gas_checked(max_input_size);
    try testing.expectEqual(gas_cost, checked_gas);
}

/// Test checked gas calculation overflow protection
test "G2MSM: gas calculation overflow protection" {
    // Test with extremely large input that could cause overflow
    const huge_input_size = std.math.maxInt(usize) - 1000;
    
    // Should return error for input too large
    try testing.expectError(error.InputTooLarge, bls12_381_g2msm.calculate_gas_checked(huge_input_size));
}

/// Test gas discount table bounds
test "G2MSM: gas discount table bounds" {
    // Test that discount table works for edge cases
    
    // Single pair (index 0) - should use first discount value (1000)
    const gas_1 = bls12_381_g2msm.calculate_gas(288);
    const expected_1 = 55000 + (1 * 32000 * 1000 / 1000);
    try testing.expectEqual(expected_1, gas_1);
    
    // More pairs than discount table length should use last discount value
    const pairs_beyond_table = 200; // Assuming discount table has < 200 entries
    const gas_large = bls12_381_g2msm.calculate_gas(pairs_beyond_table * 288);
    
    // Should not crash and should return reasonable value
    try testing.expect(gas_large > 55000);
    try testing.expect(gas_large < std.math.maxInt(u64));
}