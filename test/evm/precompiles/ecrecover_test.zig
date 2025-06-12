const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const ecrecover = evm.precompiles.ecrecover;
const PrecompileOutput = evm.precompiles.PrecompileOutput;
const PrecompileError = evm.precompiles.PrecompileError;

// Test basic gas calculation for ECRECOVER
test "ecrecover gas calculation" {
    // ECRECOVER has fixed gas cost regardless of input size
    try testing.expectEqual(@as(u64, 3000), ecrecover.calculate_gas(0));
    try testing.expectEqual(@as(u64, 3000), ecrecover.calculate_gas(128));
    try testing.expectEqual(@as(u64, 3000), ecrecover.calculate_gas(1000));
}

// Test gas calculation with overflow protection
test "ecrecover gas calculation checked" {
    const gas_cost = try ecrecover.calculate_gas_checked(128);
    try testing.expectEqual(@as(u64, 3000), gas_cost);
    
    // Should never overflow since it's a constant
    const large_gas = try ecrecover.calculate_gas_checked(std.math.maxInt(usize));
    try testing.expectEqual(@as(u64, 3000), large_gas);
}

// Test ECRECOVER with insufficient gas
test "ecrecover insufficient gas" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    const result = ecrecover.execute(&input, &output, 2999); // Less than required 3000
    
    try testing.expect(result.is_failure());
    if (result.get_error()) |err| {
        try testing.expectEqual(PrecompileError.OutOfGas, err);
    }
}

// Test ECRECOVER with exact gas requirement
test "ecrecover exact gas" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    const result = ecrecover.execute(&input, &output, 3000); // Exactly required amount
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
    // Should return empty output due to invalid signature (all zeros)
    try testing.expectEqual(@as(usize, 0), result.get_output_size());
}

// Test ECRECOVER with more than sufficient gas
test "ecrecover excess gas" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    const result = ecrecover.execute(&input, &output, 10000); // More than required
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 3000), result.get_gas_used()); // Only consumes what's needed
}

// Test ECRECOVER with invalid input sizes
test "ecrecover invalid input sizes" {
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Too small input
    var small_input: [127]u8 = [_]u8{0} ** 127;
    var result = ecrecover.execute(&small_input, &output, 5000);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
    try testing.expectEqual(@as(usize, 0), result.get_output_size()); // Empty output for invalid input
    
    // Too large input  
    var large_input: [129]u8 = [_]u8{0} ** 129;
    result = ecrecover.execute(&large_input, &output, 5000);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
    try testing.expectEqual(@as(usize, 0), result.get_output_size()); // Empty output for invalid input
    
    // Empty input
    var empty_input: [0]u8 = [_]u8{};
    result = ecrecover.execute(&empty_input, &output, 5000);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
    try testing.expectEqual(@as(usize, 0), result.get_output_size()); // Empty output for invalid input
}

// Test ECRECOVER with invalid output buffer size
test "ecrecover invalid output buffer" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var small_output: [31]u8 = [_]u8{0} ** 31; // Too small for 32-byte output
    
    const result = ecrecover.execute(&input, &small_output, 5000);
    
    try testing.expect(result.is_failure());
    if (result.get_error()) |err| {
        try testing.expectEqual(PrecompileError.ExecutionFailed, err);
    }
}

// Test ECRECOVER with all-zero signature (invalid)
test "ecrecover zero signature" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    const result = ecrecover.execute(&input, &output, 5000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
    try testing.expectEqual(@as(usize, 0), result.get_output_size()); // Empty output for invalid signature
}

// Test ECRECOVER with invalid v values
test "ecrecover invalid v values" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Set valid r and s values (non-zero, less than secp256k1 order)
    // r component (bytes 64-95)
    input[95] = 1; // r = 1
    // s component (bytes 96-127)  
    input[127] = 1; // s = 1
    
    // Test various invalid v values
    const invalid_v_values = [_]u8{ 0, 1, 26, 29, 30 };
    
    for (invalid_v_values) |v_val| {
        // Clear v bytes and set the invalid value
        @memset(input[32..64], 0);
        input[63] = v_val; // v in last byte
        
        const result = ecrecover.execute(&input, &output, 5000);
        
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
        try testing.expectEqual(@as(usize, 0), result.get_output_size()); // Empty output for invalid v
    }
}

// Test ECRECOVER with valid v values (legacy format)
test "ecrecover valid v values legacy" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Set valid r and s values (non-zero, less than secp256k1 order)
    input[95] = 1; // r = 1
    input[127] = 1; // s = 1
    
    // Test valid v values (27, 28)
    const valid_v_values = [_]u8{ 27, 28 };
    
    for (valid_v_values) |v_val| {
        // Clear v bytes and set the valid value
        @memset(input[32..64], 0);
        input[63] = v_val; // v in last byte
        
        const result = ecrecover.execute(&input, &output, 5000);
        
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
        // NOTE: With placeholder implementation, we expect 0 output
        // In a real implementation, this would recover the actual address
        try testing.expectEqual(@as(usize, 0), result.get_output_size());
    }
}

// Test ECRECOVER with signature parameters at secp256k1 order boundary
test "ecrecover boundary signature values" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Set v = 27
    input[63] = 27;
    
    // Test r = secp256k1_order (should be invalid)
    const secp256k1_order_bytes = [32]u8{
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE,
        0xBA, 0xAE, 0xDC, 0xE6, 0xAF, 0x48, 0xA0, 0x3B,
        0xBF, 0xD2, 0x5E, 0x8C, 0xD0, 0x36, 0x41, 0x41,
    };
    
    // Set r = secp256k1_order (invalid)
    @memcpy(input[64..96], &secp256k1_order_bytes);
    input[127] = 1; // s = 1 (valid)
    
    var result = ecrecover.execute(&input, &output, 5000);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 0), result.get_output_size()); // Should be invalid
    
    // Test s = secp256k1_order (should be invalid)
    input[95] = 1; // r = 1 (valid)
    @memcpy(input[96..128], &secp256k1_order_bytes); // s = secp256k1_order (invalid)
    
    result = ecrecover.execute(&input, &output, 5000);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 0), result.get_output_size()); // Should be invalid
}

// Test ECRECOVER call validation
test "ecrecover call validation" {
    // Valid call
    try testing.expect(ecrecover.validate_call(128, 3000));
    try testing.expect(ecrecover.validate_call(128, 5000));
    
    // Invalid gas
    try testing.expect(!ecrecover.validate_call(128, 2999));
    
    // Invalid input size
    try testing.expect(!ecrecover.validate_call(127, 5000));
    try testing.expect(!ecrecover.validate_call(129, 5000));
    try testing.expect(!ecrecover.validate_call(0, 5000));
}

// Test ECRECOVER output size
test "ecrecover output size" {
    try testing.expectEqual(@as(usize, 32), ecrecover.get_output_size(0));
    try testing.expectEqual(@as(usize, 32), ecrecover.get_output_size(128));
    try testing.expectEqual(@as(usize, 32), ecrecover.get_output_size(1000));
}

// Test with EIP-155 format v values
test "ecrecover eip155 v values" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Set valid r and s values
    input[95] = 1; // r = 1
    input[127] = 1; // s = 1
    
    // Test EIP-155 v values (chain_id * 2 + 35/36)
    // For chain_id = 1 (mainnet): v = 37 or 38
    const eip155_v_values = [_]u32{ 37, 38, 39, 40 }; // Different chain IDs
    
    for (eip155_v_values) |v_val| {
        // Clear v bytes and set the EIP-155 value
        @memset(input[32..64], 0);
        input[63] = @as(u8, @intCast(v_val)); // v in last byte
        
        const result = ecrecover.execute(&input, &output, 5000);
        
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
        // NOTE: With placeholder implementation, we expect 0 output
        try testing.expectEqual(@as(usize, 0), result.get_output_size());
    }
}

// Test known Ethereum test vector (placeholder for when real crypto is implemented)
test "ecrecover known test vector placeholder" {
    // This test is a placeholder for when real cryptographic implementation is added
    // A real test would use known signature/recovery pairs from Ethereum test suite
    
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Example test vector data (this would be real signature data in production)
    // hash: some message hash
    // v: 28 (recovery id 1)
    // r, s: valid signature components
    
    // For now, just verify the placeholder behavior
    const result = ecrecover.execute(&input, &output, 5000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
    // Placeholder implementation returns empty output
    try testing.expectEqual(@as(usize, 0), result.get_output_size());
    
    // TODO: Replace with real test vectors when cryptographic implementation is added
    // Expected recovered address would be checked here in a real implementation
}

// ============================================================================
// ECRECOVER Precompile Dispatcher Integration Tests
// ============================================================================

test "ecrecover precompile dispatcher integration" {
    const Address = @import("Address").Address;
    const precompiles = @import("../../../src/evm/precompiles/precompiles.zig");
    
    const ecrecover_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x01 };
    
    // Check address detection
    try testing.expect(precompiles.is_precompile(ecrecover_address));
    
    // Check availability (ECRECOVER available from Frontier)
    const ChainRules = evm.chain_rules.ChainRules;
    const frontier_rules = ChainRules.for_hardfork(.FRONTIER);
    const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
    const istanbul_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    try testing.expect(precompiles.is_available(ecrecover_address, frontier_rules));
    try testing.expect(precompiles.is_available(ecrecover_address, byzantium_rules));
    try testing.expect(precompiles.is_available(ecrecover_address, istanbul_rules));
}

test "ecrecover precompile dispatcher execute" {
    const Address = @import("Address").Address;
    const precompiles = @import("../../../src/evm/precompiles/precompiles.zig");
    const ChainRules = evm.chain_rules.ChainRules;
    
    const ecrecover_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x01 };
    
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0xFF} ** 32; // Fill with non-zero to verify clearing
    
    // Set up a basic (invalid) signature for testing
    input[63] = 27; // v = 27
    input[95] = 1;  // r = 1
    input[127] = 1; // s = 1
    
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    const result = precompiles.execute_precompile(
        ecrecover_address,
        &input,
        &output,
        5000,
        chain_rules
    );
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
    // Placeholder implementation returns empty output, so size should be 0
    try testing.expectEqual(@as(usize, 0), result.get_output_size());
}

test "ecrecover precompile dispatcher estimate gas" {
    const Address = @import("Address").Address;
    const precompiles = @import("../../../src/evm/precompiles/precompiles.zig");
    const ChainRules = evm.chain_rules.ChainRules;
    
    const ecrecover_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x01 };
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test gas estimation for various input sizes (should always be 3000)
    try testing.expectEqual(@as(u64, 3000), try precompiles.estimate_gas(ecrecover_address, 0, chain_rules));
    try testing.expectEqual(@as(u64, 3000), try precompiles.estimate_gas(ecrecover_address, 128, chain_rules));
    try testing.expectEqual(@as(u64, 3000), try precompiles.estimate_gas(ecrecover_address, 1000, chain_rules));
}

test "ecrecover precompile dispatcher get output size" {
    const Address = @import("Address").Address;
    const precompiles = @import("../../../src/evm/precompiles/precompiles.zig");
    const ChainRules = evm.chain_rules.ChainRules;
    
    const ecrecover_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x01 };
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    try testing.expectEqual(@as(usize, 32), try precompiles.get_output_size(ecrecover_address, 128, chain_rules));
    try testing.expectEqual(@as(usize, 32), try precompiles.get_output_size(ecrecover_address, 0, chain_rules));
    try testing.expectEqual(@as(usize, 32), try precompiles.get_output_size(ecrecover_address, 1000, chain_rules));
}

test "ecrecover precompile dispatcher validate call" {
    const Address = @import("Address").Address;
    const precompiles = @import("../../../src/evm/precompiles/precompiles.zig");
    const ChainRules = evm.chain_rules.ChainRules;
    
    const ecrecover_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x01 };
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Valid calls
    try testing.expect(precompiles.validate_call(ecrecover_address, 128, 3000, chain_rules));
    try testing.expect(precompiles.validate_call(ecrecover_address, 128, 5000, chain_rules));
    
    // Invalid calls (insufficient gas)
    try testing.expect(!precompiles.validate_call(ecrecover_address, 128, 2999, chain_rules));
    
    // Invalid calls (wrong input size) - Note: validate_call only checks gas, not input size
    // Input size validation happens during execution
    try testing.expect(precompiles.validate_call(ecrecover_address, 127, 5000, chain_rules));
    try testing.expect(precompiles.validate_call(ecrecover_address, 129, 5000, chain_rules));
    try testing.expect(precompiles.validate_call(ecrecover_address, 0, 5000, chain_rules));
}

// ============================================================================
// ECRECOVER Edge Cases and Stress Tests
// ============================================================================

test "ecrecover signature parameter edge cases" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Test r = 0 (invalid)
    @memset(input[64..96], 0); // r = 0
    input[63] = 27; // v = 27
    input[127] = 1; // s = 1
    
    var result = ecrecover.execute(&input, &output, 5000);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 0), result.get_output_size());
    
    // Test s = 0 (invalid)
    input[95] = 1; // r = 1
    @memset(input[96..128], 0); // s = 0
    
    result = ecrecover.execute(&input, &output, 5000);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 0), result.get_output_size());
    
    // Test r = secp256k1_order - 1 (valid)
    const secp256k1_order_minus_1 = [32]u8{
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE,
        0xBA, 0xAE, 0xDC, 0xE6, 0xAF, 0x48, 0xA0, 0x3B,
        0xBF, 0xD2, 0x5E, 0x8C, 0xD0, 0x36, 0x41, 0x40,
    };
    
    @memcpy(input[64..96], &secp256k1_order_minus_1); // r = secp256k1_order - 1
    input[127] = 1; // s = 1
    
    result = ecrecover.execute(&input, &output, 5000);
    try testing.expect(result.is_success());
    // With placeholder implementation, still returns empty output
    try testing.expectEqual(@as(usize, 0), result.get_output_size());
}

test "ecrecover v parameter comprehensive tests" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Set valid r and s
    input[95] = 1; // r = 1
    input[127] = 1; // s = 1
    
    // Test comprehensive v value scenarios
    const test_cases = [_]struct {
        v: u32,
        description: []const u8,
        should_be_valid: bool,
    }{
        .{ .v = 0, .description = "v = 0 (invalid)", .should_be_valid = false },
        .{ .v = 1, .description = "v = 1 (invalid)", .should_be_valid = false },
        .{ .v = 26, .description = "v = 26 (invalid)", .should_be_valid = false },
        .{ .v = 27, .description = "v = 27 (legacy valid)", .should_be_valid = true },
        .{ .v = 28, .description = "v = 28 (legacy valid)", .should_be_valid = true },
        .{ .v = 29, .description = "v = 29 (invalid)", .should_be_valid = false },
        .{ .v = 34, .description = "v = 34 (invalid)", .should_be_valid = false },
        .{ .v = 35, .description = "v = 35 (EIP-155 chain_id=0)", .should_be_valid = true },
        .{ .v = 36, .description = "v = 36 (EIP-155 chain_id=0)", .should_be_valid = true },
        .{ .v = 37, .description = "v = 37 (EIP-155 chain_id=1)", .should_be_valid = true },
        .{ .v = 38, .description = "v = 38 (EIP-155 chain_id=1)", .should_be_valid = true },
        .{ .v = 100, .description = "v = 100 (EIP-155 large chain_id)", .should_be_valid = true },
        .{ .v = 255, .description = "v = 255 (EIP-155 max u8)", .should_be_valid = true },
    };
    
    for (test_cases) |test_case| {
        // Clear v bytes and set test value
        @memset(input[32..64], 0);
        input[63] = @as(u8, @intCast(test_case.v & 0xFF));
        if (test_case.v > 255) {
            input[62] = @as(u8, @intCast((test_case.v >> 8) & 0xFF));
        }
        
        const result = ecrecover.execute(&input, &output, 5000);
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
        
        // With placeholder implementation, all return empty output
        // In a real implementation, valid v values might produce different results
        try testing.expectEqual(@as(usize, 0), result.get_output_size());
    }
}

test "ecrecover input size stress test" {
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Test various input sizes to ensure robust handling
    const test_sizes = [_]usize{ 0, 1, 32, 64, 96, 127, 128, 129, 256, 1000 };
    
    for (test_sizes) |size| {
        var input = std.testing.allocator.alloc(u8, size) catch unreachable;
        defer std.testing.allocator.free(input);
        @memset(input, 0);
        
        // For inputs >= 128 bytes, set up a basic signature
        if (input.len >= 128) {
            input[63] = 27; // v = 27
            input[95] = 1;  // r = 1
            input[127] = 1; // s = 1
        }
        
        const result = ecrecover.execute(input, &output, 5000);
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
        
        if (size == 128) {
            // Only exactly 128 bytes might produce valid output (with real crypto)
            // For placeholder, still returns 0
            try testing.expectEqual(@as(usize, 0), result.get_output_size());
        } else {
            // Invalid input sizes should return empty output
            try testing.expectEqual(@as(usize, 0), result.get_output_size());
        }
    }
}

test "ecrecover output buffer stress test" {
    var input: [128]u8 = [_]u8{0} ** 128;
    
    // Set up basic signature
    input[63] = 27; // v = 27
    input[95] = 1;  // r = 1
    input[127] = 1; // s = 1
    
    // Test various output buffer sizes
    const buffer_sizes = [_]usize{ 0, 16, 31, 32, 33, 64, 100 };
    
    for (buffer_sizes) |size| {
        const output = std.testing.allocator.alloc(u8, size) catch unreachable;
        defer std.testing.allocator.free(output);
        @memset(output, 0xFF); // Fill with non-zero to test clearing
        
        const result = ecrecover.execute(&input, output, 5000);
        
        if (size < 32) {
            // Should fail with insufficient buffer
            try testing.expect(result.is_failure());
            if (result.get_error()) |err| {
                try testing.expectEqual(PrecompileError.ExecutionFailed, err);
            }
        } else {
            // Should succeed
            try testing.expect(result.is_success());
            try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
            // Placeholder implementation returns empty output
            try testing.expectEqual(@as(usize, 0), result.get_output_size());
        }
    }
}

test "ecrecover gas boundary tests" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Set up basic signature
    input[63] = 27; // v = 27
    input[95] = 1;  // r = 1
    input[127] = 1; // s = 1
    
    // Test exact gas boundary
    var result = ecrecover.execute(&input, &output, 3000);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
    
    // Test one less gas than required
    result = ecrecover.execute(&input, &output, 2999);
    try testing.expect(result.is_failure());
    if (result.get_error()) |err| {
        try testing.expectEqual(PrecompileError.OutOfGas, err);
    }
    
    // Test with zero gas
    result = ecrecover.execute(&input, &output, 0);
    try testing.expect(result.is_failure());
    if (result.get_error()) |err| {
        try testing.expectEqual(PrecompileError.OutOfGas, err);
    }
    
    // Test with maximum gas
    result = ecrecover.execute(&input, &output, std.math.maxInt(u64));
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 3000), result.get_gas_used()); // Still only uses what it needs
}

test "ecrecover performance benchmark" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output: [32]u8 = [_]u8{0} ** 32;
    
    // Set up basic signature
    input[63] = 27; // v = 27
    input[95] = 1;  // r = 1
    input[127] = 1; // s = 1
    
    const iterations = 1000;
    var timer = try std.time.Timer.start();
    
    for (0..iterations) |_| {
        const result = ecrecover.execute(&input, &output, 5000);
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 3000), result.get_gas_used());
    }
    
    const elapsed_ns = timer.read();
    const ns_per_op = elapsed_ns / iterations;
    
    // ECRECOVER should be fast even with placeholder implementation
    // Adjust threshold based on expected performance characteristics
    try testing.expect(ns_per_op < 100_000); // 100 microseconds per operation
}

test "ecrecover consistency test" {
    var input: [128]u8 = [_]u8{0} ** 128;
    var output1: [32]u8 = [_]u8{0} ** 32;
    var output2: [32]u8 = [_]u8{0} ** 32;
    
    // Set up signature
    input[63] = 27; // v = 27
    input[95] = 1;  // r = 1
    input[127] = 1; // s = 1
    
    // Execute twice with identical input
    const result1 = ecrecover.execute(&input, &output1, 5000);
    const result2 = ecrecover.execute(&input, &output2, 5000);
    
    try testing.expect(result1.is_success());
    try testing.expect(result2.is_success());
    try testing.expectEqual(result1.get_gas_used(), result2.get_gas_used());
    try testing.expectEqual(result1.get_output_size(), result2.get_output_size());
    
    // Results should be identical
    try testing.expectEqualSlices(u8, &output1, &output2);
}