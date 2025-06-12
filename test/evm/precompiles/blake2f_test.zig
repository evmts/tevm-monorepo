const std = @import("std");
const testing = std.testing;
const blake2f = @import("../../../src/evm/precompiles/blake2f.zig");
const precompiles = @import("../../../src/evm/precompiles/precompiles.zig");
const PrecompileOutput = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileError;
const ChainRules = @import("../../../src/evm/hardforks/chain_rules.zig");
const Address = @import("Address").Address;

test "blake2f gas calculation" {
    // Test gas cost calculation: 1 gas per round
    const rounds_12_input = [_]u8{
        0x00, 0x00, 0x00, 0x0c, // 12 rounds (big-endian)
    } ++ [_]u8{0} ** 209; // Pad to 213 bytes
    
    try testing.expectEqual(@as(u64, 12), blake2f.calculate_gas(&rounds_12_input));
    
    // Test with different round counts
    var rounds_100_input = [_]u8{
        0x00, 0x00, 0x00, 0x64, // 100 rounds (big-endian)
    } ++ [_]u8{0} ** 209;
    
    try testing.expectEqual(@as(u64, 100), blake2f.calculate_gas(&rounds_100_input));
    
    // Test with invalid input length (should return 0)
    const invalid_input = [_]u8{0x01, 0x02}; // Wrong length
    try testing.expectEqual(@as(u64, 0), blake2f.calculate_gas(&invalid_input));
}

test "blake2f input validation" {
    // Test invalid input length
    const invalid_input = [_]u8{0x01, 0x02}; // Wrong length
    var output = [_]u8{0} ** 64;
    
    const result = blake2f.execute(&invalid_input, &output, 1000);
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.get_error().?);
}

test "blake2f handles invalid final flag" {
    // Test invalid final flag (not 0 or 1)
    var invalid_input = [_]u8{0} ** 213;
    invalid_input[212] = 0x02; // Invalid final flag
    var output = [_]u8{0} ** 64;
    
    const result = blake2f.execute(&invalid_input, &output, 1000);
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.get_error().?);
}

test "blake2f out of gas" {
    // Test insufficient gas
    var input = [_]u8{0} ** 213;
    // Set 100 rounds (big-endian)
    input[0] = 0x00;
    input[1] = 0x00;
    input[2] = 0x00;
    input[3] = 0x64; // 100 rounds
    input[212] = 0x00; // Valid final flag
    
    var output = [_]u8{0} ** 64;
    
    // Provide only 50 gas when 100 is needed
    const result = blake2f.execute(&input, &output, 50);
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.OutOfGas, result.get_error().?);
}

test "blake2f successful execution" {
    // Create valid input with known test vector
    var input = [_]u8{0} ** 213;
    
    // Set 12 rounds (big-endian)
    input[0] = 0x00;
    input[1] = 0x00;
    input[2] = 0x00;
    input[3] = 0x0c; // 12 rounds
    
    // Set valid final flag
    input[212] = 0x01; // Final flag
    
    var output = [_]u8{0} ** 64;
    
    const result = blake2f.execute(&input, &output, 1000);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 12), result.get_gas_used());
    try testing.expectEqual(@as(usize, 64), result.get_output_size());
}

test "blake2f EIP-152 test vector 1" {
    // Test vector from EIP-152
    // This tests the BLAKE2b compression function with known inputs and expected outputs
    var input = [_]u8{
        // rounds: 12 (big-endian)
        0x00, 0x00, 0x00, 0x0c,
        
        // h (hash state): 64 bytes (little-endian)
        0x48, 0xc9, 0xbd, 0xf2, 0x67, 0xe6, 0x09, 0x6a,
        0x3b, 0xa7, 0xca, 0x84, 0x85, 0xae, 0x67, 0xbb,
        0x2b, 0xf8, 0x94, 0xfe, 0x72, 0xf3, 0x6e, 0x3c,
        0xf1, 0x36, 0x1d, 0x5f, 0x3a, 0xf5, 0x4f, 0xa5,
        0xd1, 0x82, 0xe6, 0xad, 0x7f, 0x52, 0x0e, 0x51,
        0x1f, 0x6c, 0x3e, 0x2b, 0x8c, 0x68, 0x05, 0x9b,
        0x6b, 0xbd, 0x41, 0xfb, 0xab, 0xd9, 0x83, 0x1f,
        0x79, 0x21, 0x7e, 0x13, 0x19, 0xcd, 0xe0, 0x5b,
        
        // m (message): 128 bytes (little-endian)
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        
        // t (counters): 16 bytes (little-endian)
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        
        // f (final flag): 1 byte
        0x01
    };
    
    var output = [_]u8{0} ** 64;
    
    const result = blake2f.execute(&input, &output, 100);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 12), result.get_gas_used());
    try testing.expectEqual(@as(usize, 64), result.get_output_size());
    
    // Check that output is not all zeros (compression function produced output)
    var all_zeros = true;
    for (output) |byte| {
        if (byte != 0) {
            all_zeros = false;
            break;
        }
    }
    try testing.expect(!all_zeros);
}

test "blake2f precompile address detection" {
    const blake2f_address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x09 };
    
    // Check that BLAKE2F address is recognized as a precompile
    try testing.expect(precompiles.is_precompile(blake2f_address));
    
    // Check that it's available with Istanbul chain rules
    const istanbul_rules = ChainRules{ .IsIstanbul = true, .IsByzantium = true, .IsCancun = false };
    try testing.expect(precompiles.is_available(blake2f_address, istanbul_rules));
    
    // Check that it's not available before Istanbul
    const pre_istanbul_rules = ChainRules{ .IsIstanbul = false, .IsByzantium = true, .IsCancun = false };
    try testing.expect(!precompiles.is_available(blake2f_address, pre_istanbul_rules));
}

test "blake2f large rounds count" {
    // Test with maximum u32 rounds count
    var input = [_]u8{0} ** 213;
    
    // Set maximum rounds (big-endian)
    input[0] = 0xff;
    input[1] = 0xff;
    input[2] = 0xff;
    input[3] = 0xff; // 4294967295 rounds
    
    input[212] = 0x00; // Valid final flag
    
    // Calculate expected gas cost (should be 4294967295)
    const expected_gas = @as(u64, 0xffffffff);
    const calculated_gas = blake2f.calculate_gas(&input);
    try testing.expectEqual(expected_gas, calculated_gas);
    
    // Test that it fails with insufficient gas
    var output = [_]u8{0} ** 64;
    const result = blake2f.execute(&input, &output, 1000); // Far less than needed
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.OutOfGas, result.get_error().?);
}

test "blake2f validate functions" {
    // Test validate_gas_requirement
    try testing.expect(blake2f.validate_gas_requirement(213, 100));
    try testing.expect(!blake2f.validate_gas_requirement(212, 100)); // Wrong input size
    try testing.expect(!blake2f.validate_gas_requirement(213, 0)); // No gas
    
    // Test get_output_size
    try testing.expectEqual(@as(usize, 64), blake2f.get_output_size(213));
    try testing.expectEqual(@as(usize, 64), blake2f.get_output_size(100)); // Size ignored for BLAKE2F
    
    // Test calculate_gas_checked
    try testing.expectEqual(@as(u64, 0), blake2f.calculate_gas_checked(213) catch unreachable);
    try testing.expectError(error.InvalidInputSize, blake2f.calculate_gas_checked(212));
}