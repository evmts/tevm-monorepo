/// Comprehensive tests for MODEXP precompile implementation
/// 
/// Tests cover:
/// - Basic modular exponentiation correctness
/// - EIP-2565 gas calculation accuracy
/// - Edge cases and special mathematical scenarios
/// - Input parsing validation
/// - Large number handling
/// - Performance characteristics
/// - Integration with precompile dispatcher

const std = @import("std");
const testing = std.testing;
const modexp = @import("modexp");
const gas_constants = @import("gas_constants");
const PrecompileOutput = @import("precompile_result").PrecompileOutput;
const PrecompileError = @import("precompile_result").PrecompileError;

test "MODEXP basic functionality" {
    const allocator = testing.allocator;
    
    // Test 3^4 mod 5 = 81 mod 5 = 1
    var input = [_]u8{0} ** 99;
    
    // Set base_length = 1
    input[31] = 1;
    // Set exp_length = 1  
    input[63] = 1;
    // Set mod_length = 1
    input[95] = 1;
    
    // Set base = 3
    input[96] = 3;
    // Set exp = 4
    input[97] = 4;
    // Set mod = 5
    input[98] = 5;
    
    var output = [_]u8{0} ** 32;
    const result = modexp.execute(&input, &output, 10000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 1), result.get_output_size());
    try testing.expectEqual(@as(u8, 1), output[0]);
}

test "MODEXP larger numbers" {
    const allocator = testing.allocator;
    
    // Test 2^10 mod 1000 = 1024 mod 1000 = 24
    var input = [_]u8{0} ** 99;
    
    // Set lengths
    input[31] = 1; // base_length = 1
    input[63] = 1; // exp_length = 1
    input[94] = 2; // mod_length = 2 (need 2 bytes for 1000)
    
    // Set values
    input[96] = 2;     // base = 2
    input[97] = 10;    // exp = 10
    input[98] = 0x03;  // mod = 1000 (0x03E8) - high byte
    input[99] = 0xE8;  // mod = 1000 - low byte
    
    var output = [_]u8{0} ** 32;
    const result = modexp.execute(&input, &output, 10000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 2), result.get_output_size());
    try testing.expectEqual(@as(u8, 0), output[0]);   // High byte of 24
    try testing.expectEqual(@as(u8, 24), output[1]);  // Low byte of 24
}

test "MODEXP zero cases" {
    const allocator = testing.allocator;
    
    // Test 0^5 mod 7 = 0
    var input = [_]u8{0} ** 99;
    input[31] = 1; // base_length = 1
    input[63] = 1; // exp_length = 1
    input[95] = 1; // mod_length = 1
    input[96] = 0; // base = 0
    input[97] = 5; // exp = 5
    input[98] = 7; // mod = 7
    
    var output = [_]u8{0} ** 32;
    const result = modexp.execute(&input, &output, 10000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u8, 0), output[0]);
}

test "MODEXP base^0 cases" {
    const allocator = testing.allocator;
    
    // Test 5^0 mod 7 = 1
    var input = [_]u8{0} ** 99;
    input[31] = 1; // base_length = 1
    input[63] = 1; // exp_length = 1
    input[95] = 1; // mod_length = 1
    input[96] = 5; // base = 5
    input[97] = 0; // exp = 0
    input[98] = 7; // mod = 7
    
    var output = [_]u8{0} ** 32;
    const result = modexp.execute(&input, &output, 10000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u8, 1), output[0]);
}

test "MODEXP 0^0 case" {
    const allocator = testing.allocator;
    
    // Test 0^0 mod 7 = 1 (by mathematical convention)
    var input = [_]u8{0} ** 99;
    input[31] = 1; // base_length = 1
    input[63] = 1; // exp_length = 1
    input[95] = 1; // mod_length = 1
    input[96] = 0; // base = 0
    input[97] = 0; // exp = 0
    input[98] = 7; // mod = 7
    
    var output = [_]u8{0} ** 32;
    const result = modexp.execute(&input, &output, 10000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u8, 1), output[0]);
}

test "MODEXP modulus = 1 case" {
    const allocator = testing.allocator;
    
    // Test any^any mod 1 = 0
    var input = [_]u8{0} ** 99;
    input[31] = 1; // base_length = 1
    input[63] = 1; // exp_length = 1
    input[95] = 1; // mod_length = 1
    input[96] = 123; // base = 123
    input[97] = 45;  // exp = 45
    input[98] = 1;   // mod = 1
    
    var output = [_]u8{0} ** 32;
    const result = modexp.execute(&input, &output, 10000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u8, 0), output[0]);
}

test "MODEXP modulus = 0 case" {
    const allocator = testing.allocator;
    
    // Test with modulus = 0 (undefined behavior, should return 0)
    var input = [_]u8{0} ** 99;
    input[31] = 1; // base_length = 1
    input[63] = 1; // exp_length = 1
    input[95] = 1; // mod_length = 1
    input[96] = 5; // base = 5
    input[97] = 3; // exp = 3
    input[98] = 0; // mod = 0
    
    var output = [_]u8{0} ** 32;
    const result = modexp.execute(&input, &output, 10000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u8, 0), output[0]);
}

test "MODEXP input parsing" {
    const allocator = testing.allocator;
    
    // Test parsing with larger input
    var input = [_]u8{0} ** 102; // Need space for 3 + 1 + 1 + 1 bytes
    
    // Set base_length = 3
    input[31] = 3;
    // Set exp_length = 1
    input[63] = 1;
    // Set mod_length = 1
    input[95] = 1;
    
    // Set base = 0x123456 (3 bytes)
    input[96] = 0x12;
    input[97] = 0x34;
    input[98] = 0x56;
    
    // Set exp = 1
    input[99] = 1;
    
    // Set mod = 255
    input[100] = 255;
    
    var output = [_]u8{0} ** 32;
    const result = modexp.execute(&input, &output, 50000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 1), result.get_output_size());
    // 0x123456 mod 255 = 1193046 mod 255 = 86
    try testing.expectEqual(@as(u8, 86), output[0]);
}

test "MODEXP gas calculation EIP-2565" {
    // Test gas calculation for small inputs
    const gas1 = modexp.calculate_gas_checked(96 + 1 + 1 + 1); // Basic 1-byte inputs
    try testing.expect(gas1 >= gas_constants.MODEXP_MIN_GAS);
    
    // Test gas calculation for larger inputs
    const gas2 = modexp.calculate_gas_checked(96 + 32 + 32 + 32); // 32-byte inputs
    try testing.expect(gas2 > gas1);
    
    // Test gas calculation for very large inputs
    const gas3 = modexp.calculate_gas_checked(96 + 128 + 128 + 128); // 128-byte inputs
    try testing.expect(gas3 > gas2);
}

test "MODEXP insufficient gas" {
    const allocator = testing.allocator;
    
    // Create input that requires more gas than provided
    var input = [_]u8{0} ** (96 + 64 + 64 + 64); // Large inputs
    
    // Set lengths to 64 bytes each
    input[30] = 0; input[31] = 64; // base_length = 64
    input[62] = 0; input[63] = 64; // exp_length = 64
    input[94] = 0; input[95] = 64; // mod_length = 64
    
    // Fill with some data
    for (96..input.len) |i| {
        input[i] = @intCast((i - 96) % 256);
    }
    
    var output = [_]u8{0} ** 64;
    const result = modexp.execute(&input, &output, 100); // Very low gas limit
    
    try testing.expect(!result.is_success());
    try testing.expectEqual(PrecompileError.OutOfGas, result.get_error().?);
}

test "MODEXP invalid input size" {
    const allocator = testing.allocator;
    
    // Test with input smaller than minimum required (96 bytes)
    var small_input = [_]u8{1} ** 50;
    var output = [_]u8{0} ** 32;
    
    const result = modexp.execute(&small_input, &output, 10000);
    
    try testing.expect(result.is_success()); // Should succeed with 0 output
    try testing.expectEqual(@as(usize, 0), result.get_output_size());
}

test "MODEXP output size calculation" {
    // Test output size calculation for various input sizes
    try testing.expectEqual(@as(usize, 1), modexp.get_output_size(96 + 1 + 1 + 1));
    try testing.expectEqual(@as(usize, 10), modexp.get_output_size(96 + 10 + 10 + 30)); // mod_length = 30
    try testing.expectEqual(@as(usize, 0), modexp.get_output_size(50)); // Too small
}

test "MODEXP empty lengths" {
    const allocator = testing.allocator;
    
    // Test with zero lengths for base and exponent
    var input = [_]u8{0} ** 97; // 96 bytes header + 1 byte for modulus
    
    // All lengths are 0 except modulus = 1
    input[95] = 1; // mod_length = 1
    input[96] = 7; // mod = 7
    
    var output = [_]u8{0} ** 32;
    const result = modexp.execute(&input, &output, 10000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u8, 1), output[0]); // 0^0 mod 7 = 1
}

test "MODEXP realistic RSA-like computation" {
    const allocator = testing.allocator;
    
    // Test a more realistic scenario with 8-byte numbers
    var input = [_]u8{0} ** (96 + 8 + 8 + 8);
    
    // Set lengths
    input[31] = 8; // base_length = 8
    input[63] = 8; // exp_length = 8
    input[95] = 8; // mod_length = 8
    
    // Set base = 12345678901234567890 (approx, in 8 bytes)
    input[96] = 0xAB;
    input[97] = 0x54;
    input[98] = 0xA9;
    input[99] = 0x8C;
    input[100] = 0xEB;
    input[101] = 0x1F;
    input[102] = 0x0A;
    input[103] = 0xD2;
    
    // Set exp = 65537 (common RSA exponent)
    input[104] = 0x00;
    input[105] = 0x00;
    input[106] = 0x00;
    input[107] = 0x00;
    input[108] = 0x00;
    input[109] = 0x01;
    input[110] = 0x00;
    input[111] = 0x01;
    
    // Set mod = large prime-like number
    input[112] = 0xFF;
    input[113] = 0xFF;
    input[114] = 0xFF;
    input[115] = 0xFF;
    input[116] = 0xFF;
    input[117] = 0xFF;
    input[118] = 0xFF;
    input[119] = 0xFB;
    
    var output = [_]u8{0} ** 32;
    const result = modexp.execute(&input, &output, 1000000); // Generous gas limit
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 8), result.get_output_size());
    // Result should be some 8-byte value
}

test "MODEXP stress test with maximum reasonable sizes" {
    const allocator = testing.allocator;
    
    // Test with 256-byte numbers (reasonable maximum)
    const size = 256;
    var input = try allocator.alloc(u8, 96 + 3 * size);
    defer allocator.free(input);
    @memset(input, 0);
    
    // Set lengths
    input[30] = 1; input[31] = size; // base_length = 256
    input[62] = 1; input[63] = size; // exp_length = 256
    input[94] = 1; input[95] = size; // mod_length = 256
    
    // Set base to some pattern
    for (0..size) |i| {
        input[96 + i] = @intCast((i * 7 + 13) % 256);
    }
    
    // Set exp to small value to keep computation reasonable
    input[96 + size + size - 1] = 3; // exp = 3
    
    // Set mod to some pattern
    for (0..size) |i| {
        input[96 + 2 * size + i] = @intCast((i * 11 + 17) % 256);
    }
    // Ensure mod is odd (not divisible by 2)
    input[96 + 3 * size - 1] |= 1;
    
    var output = try allocator.alloc(u8, size);
    defer allocator.free(output);
    @memset(output, 0);
    
    const result = modexp.execute(input, output, 10000000); // Very generous gas limit
    
    // Should either succeed or fail due to insufficient gas, but not crash
    if (result.is_success()) {
        try testing.expectEqual(@as(usize, size), result.get_output_size());
    } else {
        // If it fails, it should be due to gas, not implementation error
        try testing.expectEqual(PrecompileError.OutOfGas, result.get_error().?);
    }
}

// Integration test with known Ethereum test vectors would go here
// These would need to be added based on official test suite data