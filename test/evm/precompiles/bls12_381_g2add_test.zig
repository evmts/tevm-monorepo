const std = @import("std");
const testing = std.testing;
const bls12_381_g2add = @import("../../../src/evm/precompiles/bls12_381_g2add.zig");
const PrecompileError = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileError;

test "G2ADD: basic functionality tests" {
    var input: [512]u8 = std.mem.zeroes([512]u8);
    var output: [256]u8 = undefined;
    
    // Test with all zeros (point at infinity + point at infinity)
    const result = bls12_381_g2add.execute(&input, &output, 1000);
    
    // Should succeed and consume 600 gas
    try testing.expect(result.output != .revert);
    try testing.expectEqual(@as(u64, 600), result.gas_used);
    
    // Output should be point at infinity (all zeros) for G2
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

// Test gas calculation
test "G2ADD: gas calculation" {
    // Test checked version with valid input size
    try testing.expectEqual(@as(u64, 600), try bls12_381_g2add.calculate_gas_checked(512));
    
    // Test with invalid input size should return error
    try testing.expectError(PrecompileError.InvalidInput, bls12_381_g2add.calculate_gas_checked(256));
    try testing.expectError(PrecompileError.InvalidInput, bls12_381_g2add.calculate_gas_checked(1000));
}

// Test direct gas cost function
test "G2ADD: direct gas cost" {
    try testing.expectEqual(@as(u64, 600), bls12_381_g2add.gas_cost());
}

// Test input validation
test "G2ADD: input validation" {
    var output: [256]u8 = undefined;
    
    // Test with invalid input length (too short)
    var short_input: [256]u8 = undefined; // G1 size instead of G2
    const result1 = bls12_381_g2add.execute(&short_input, &output, 1000);
    try testing.expect(result1.output == .revert);
    
    // Test with invalid input length (too long)
    var long_input: [600]u8 = undefined;
    const result2 = bls12_381_g2add.execute(&long_input, &output, 1000);
    try testing.expect(result2.output == .revert);
    
    // Test with zero input length
    var empty_input: [0]u8 = undefined;
    const result3 = bls12_381_g2add.execute(&empty_input, &output, 1000);
    try testing.expect(result3.output == .revert);
}

// Test gas limit validation
test "G2ADD: gas limit validation" {
    var input: [512]u8 = std.mem.zeroes([512]u8);
    var output: [256]u8 = undefined;
    
    // Test with insufficient gas
    const result = bls12_381_g2add.execute(&input, &output, 500); // Less than 600
    try testing.expect(result.output == .revert);
    try testing.expectEqual(@as(u64, 500), result.gas_used); // Should consume all available gas
    
    // Test with exact gas requirement
    const result2 = bls12_381_g2add.execute(&input, &output, 600);
    try testing.expect(result2.output != .revert);
    try testing.expectEqual(@as(u64, 600), result2.gas_used);
    
    // Test with more than required gas
    const result3 = bls12_381_g2add.execute(&input, &output, 1000);
    try testing.expect(result3.output != .revert);
    try testing.expectEqual(@as(u64, 600), result3.gas_used); // Should only consume 600
}

// Test output buffer validation
test "G2ADD: output buffer validation" {
    var input: [512]u8 = std.mem.zeroes([512]u8);
    var small_output: [128]u8 = undefined; // G1 size instead of G2
    
    // Should fail with insufficient output buffer
    const result = bls12_381_g2add.execute(&input, &small_output, 1000);
    try testing.expect(result.output == .revert);
    try testing.expectEqual(@as(u64, 600), result.gas_used);
}

// Test output size calculation
test "G2ADD: output size calculation" {
    // Output size should always be 256 bytes regardless of input size
    try testing.expectEqual(@as(usize, 256), bls12_381_g2add.get_output_size(0));
    try testing.expectEqual(@as(usize, 256), bls12_381_g2add.get_output_size(512));
    try testing.expectEqual(@as(usize, 256), bls12_381_g2add.get_output_size(1000));
}

// Test direct output size function
test "G2ADD: direct output size" {
    try testing.expectEqual(@as(usize, 256), bls12_381_g2add.output_size());
}

// Test Fp element validation
test "G2ADD: Fp element validation" {
    // Test with valid field element (all zeros)
    const valid_element_bytes = std.mem.zeroes([64]u8);
    const valid_element = bls12_381_g2add.FieldElement.from_bytes(valid_element_bytes);
    
    try testing.expect(valid_element.is_zero());
    try testing.expect(valid_element.is_valid());
}

// Test Fp2 element validation
test "G2ADD: Fp2 element validation" {
    // Test with valid Fp2 element (all zeros)
    const valid_fp2_bytes = std.mem.zeroes([128]u8);
    const valid_fp2 = bls12_381_g2add.Fp2Element.from_bytes(valid_fp2_bytes);
    
    try testing.expect(valid_fp2.is_zero());
    try testing.expect(valid_fp2.is_valid());
    
    // Test round-trip conversion
    const converted_bytes = valid_fp2.to_bytes();
    try testing.expectEqualSlices(u8, &valid_fp2_bytes, &converted_bytes);
}

// Test G2 point validation
test "G2ADD: G2 point validation" {
    // Test with point at infinity (all zeros)
    const infinity_bytes = std.mem.zeroes([256]u8);
    const infinity_point = bls12_381_g2add.G2Point.from_bytes(infinity_bytes);
    
    try testing.expect(infinity_point.is_infinity());
    try testing.expect(infinity_point.has_valid_coordinates());
    try testing.expect(infinity_point.is_on_curve());
    try testing.expect(infinity_point.is_in_subgroup());
    
    // Test round-trip conversion
    const converted_bytes = infinity_point.to_bytes();
    try testing.expectEqualSlices(u8, &infinity_bytes, &converted_bytes);
}

// Test input parsing with valid points
test "G2ADD: valid input parsing" {
    // Create input with two points at infinity
    var input: [512]u8 = std.mem.zeroes([512]u8);
    
    // Parse should succeed
    const points = bls12_381_g2add.parse_input(&input) catch |err| {
        try testing.expect(false); // Should not fail
        return err;
    };
    
    try testing.expect(points[0].is_infinity());
    try testing.expect(points[1].is_infinity());
}

// Test field modulus boundary conditions
test "G2ADD: field modulus validation" {
    // Test with field modulus (should be invalid as it equals the modulus)
    var modulus_bytes: [64]u8 = undefined;
    @memcpy(&modulus_bytes, &bls12_381_g2add.BLS12_381_FIELD_MODULUS);
    
    const modulus_element = bls12_381_g2add.FieldElement.from_bytes(modulus_bytes);
    try testing.expect(!modulus_element.is_valid()); // Should be invalid
    
    // Test with modulus - 1 (should be valid)
    var modulus_minus_one = modulus_bytes;
    // Subtract 1 from the least significant byte
    if (modulus_minus_one[47] > 0) {
        modulus_minus_one[47] -= 1;
    } else {
        // Need to borrow - this is a simplified test, actual arithmetic would be more complex
        modulus_minus_one[47] = 0xFF;
        modulus_minus_one[46] -= 1;
    }
    
    const valid_element = bls12_381_g2add.FieldElement.from_bytes(modulus_minus_one);
    try testing.expect(valid_element.is_valid()); // Should be valid
}

// Test G2 addition with point at infinity
test "G2ADD: point at infinity addition" {
    // Test infinity + infinity = infinity
    const infinity_point = bls12_381_g2add.G2Point.from_bytes(std.mem.zeroes([256]u8));
    const result = bls12_381_g2add.g2_add(infinity_point, infinity_point);
    
    try testing.expect(result.is_infinity());
}

// Test various input sizes for calculate_gas_checked
test "G2ADD: calculate_gas_checked input validation" {
    // Valid input size (512 bytes)
    try testing.expectEqual(@as(u64, 600), try bls12_381_g2add.calculate_gas_checked(512));
    
    // Invalid input sizes
    try testing.expectError(PrecompileError.InvalidInput, bls12_381_g2add.calculate_gas_checked(0));
    try testing.expectError(PrecompileError.InvalidInput, bls12_381_g2add.calculate_gas_checked(256));
    try testing.expectError(PrecompileError.InvalidInput, bls12_381_g2add.calculate_gas_checked(511));
    try testing.expectError(PrecompileError.InvalidInput, bls12_381_g2add.calculate_gas_checked(513));
    try testing.expectError(PrecompileError.InvalidInput, bls12_381_g2add.calculate_gas_checked(1024));
}

// Test availability function
test "G2ADD: availability check" {
    // Currently should return false since EIP-2537 is not active
    try testing.expect(!bls12_381_g2add.is_available(null));
}

// Test constants validation
test "G2ADD: constants validation" {
    try testing.expectEqual(@as(u64, 600), bls12_381_g2add.G2ADD_GAS_COST);
    try testing.expectEqual(@as(usize, 512), bls12_381_g2add.G2ADD_INPUT_SIZE);
    try testing.expectEqual(@as(usize, 256), bls12_381_g2add.G2ADD_OUTPUT_SIZE);
    try testing.expectEqual(@as(usize, 256), bls12_381_g2add.G2_POINT_SIZE);
    try testing.expectEqual(@as(usize, 128), bls12_381_g2add.FP2_COORDINATE_SIZE);
    try testing.expectEqual(@as(usize, 64), bls12_381_g2add.FP_ELEMENT_SIZE);
}

// Test with non-zero but valid field elements
test "G2ADD: non-zero valid elements" {
    // Create a valid but non-zero field element (small value)
    var small_value_bytes: [64]u8 = std.mem.zeroes([64]u8);
    small_value_bytes[63] = 1; // Set least significant byte to 1
    
    const small_element = bls12_381_g2add.FieldElement.from_bytes(small_value_bytes);
    try testing.expect(!small_element.is_zero());
    try testing.expect(small_element.is_valid());
}

// Test execution with minimal valid input
test "G2ADD: execution with valid minimal input" {
    var input: [512]u8 = std.mem.zeroes([512]u8);
    var output: [256]u8 = undefined;
    
    const result = bls12_381_g2add.execute(&input, &output, 600);
    
    // Should succeed
    try testing.expect(result.output != .revert);
    try testing.expectEqual(@as(u64, 600), result.gas_used);
    
    // Result should be deterministic for same input
    var output2: [256]u8 = undefined;
    const result2 = bls12_381_g2add.execute(&input, &output2, 600);
    
    try testing.expect(result2.output != .revert);
    try testing.expectEqualSlices(u8, &output, &output2);
}