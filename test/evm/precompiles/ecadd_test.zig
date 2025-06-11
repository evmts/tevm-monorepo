/// Comprehensive tests for ECADD precompile (address 0x06)
///
/// Tests the elliptic curve point addition functionality according to EIP-196.
/// Covers gas costs, input/output formats, error handling, and edge cases.

const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Address = @import("Address").Address;

// ECADD precompile address (0x06)
const ECADD_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x06 };

// ============================================================================
// Basic Precompile Interface Tests
// ============================================================================

test "ECADD precompile address recognition" {
    // Check that ECADD is recognized as a precompile
    try testing.expect(evm.Precompiles.is_precompile(ECADD_ADDRESS));
}

test "ECADD availability by hardfork" {
    // ECADD should be available from Byzantium onwards
    const byzantium_rules = evm.chain_rules.for_hardfork(.BYZANTIUM);
    try testing.expect(evm.Precompiles.is_available(ECADD_ADDRESS, byzantium_rules));

    const istanbul_rules = evm.chain_rules.for_hardfork(.ISTANBUL);
    try testing.expect(evm.Precompiles.is_available(ECADD_ADDRESS, istanbul_rules));

    const london_rules = evm.chain_rules.for_hardfork(.LONDON);
    try testing.expect(evm.Precompiles.is_available(ECADD_ADDRESS, london_rules));

    const cancun_rules = evm.chain_rules.for_hardfork(.CANCUN);
    try testing.expect(evm.Precompiles.is_available(ECADD_ADDRESS, cancun_rules));
}

test "ECADD gas estimation by hardfork" {
    // Test gas estimation for different hardforks
    const byzantium_rules = evm.chain_rules.for_hardfork(.BYZANTIUM);
    const istanbul_rules = evm.chain_rules.for_hardfork(.ISTANBUL);

    // Gas cost should be independent of input size
    try testing.expectEqual(@as(u64, 500), try evm.Precompiles.estimate_gas(ECADD_ADDRESS, 0, byzantium_rules));
    try testing.expectEqual(@as(u64, 500), try evm.Precompiles.estimate_gas(ECADD_ADDRESS, 128, byzantium_rules));

    try testing.expectEqual(@as(u64, 150), try evm.Precompiles.estimate_gas(ECADD_ADDRESS, 0, istanbul_rules));
    try testing.expectEqual(@as(u64, 150), try evm.Precompiles.estimate_gas(ECADD_ADDRESS, 128, istanbul_rules));
}

test "ECADD output size" {
    const chain_rules = evm.chain_rules.DEFAULT;

    // ECADD always returns 64 bytes (two 32-byte coordinates)
    try testing.expectEqual(@as(usize, 64), try evm.Precompiles.get_output_size(ECADD_ADDRESS, 0, chain_rules));
    try testing.expectEqual(@as(usize, 64), try evm.Precompiles.get_output_size(ECADD_ADDRESS, 128, chain_rules));
    try testing.expectEqual(@as(usize, 64), try evm.Precompiles.get_output_size(ECADD_ADDRESS, 1000, chain_rules));
}

test "ECADD validate call requirements" {
    const istanbul_rules = evm.chain_rules.for_hardfork(.ISTANBUL);
    const byzantium_rules = evm.chain_rules.for_hardfork(.BYZANTIUM);

    // Test Istanbul gas requirements (150 gas)
    try testing.expect(evm.Precompiles.validate_call(ECADD_ADDRESS, 128, 150, istanbul_rules));  // Exactly enough
    try testing.expect(evm.Precompiles.validate_call(ECADD_ADDRESS, 128, 1000, istanbul_rules)); // More than enough
    try testing.expect(!evm.Precompiles.validate_call(ECADD_ADDRESS, 128, 149, istanbul_rules)); // Not enough

    // Test Byzantium gas requirements (500 gas)
    try testing.expect(evm.Precompiles.validate_call(ECADD_ADDRESS, 128, 500, byzantium_rules));  // Exactly enough
    try testing.expect(evm.Precompiles.validate_call(ECADD_ADDRESS, 128, 1000, byzantium_rules)); // More than enough
    try testing.expect(!evm.Precompiles.validate_call(ECADD_ADDRESS, 128, 499, byzantium_rules)); // Not enough
}

// ============================================================================
// Execution Tests - Point at Infinity
// ============================================================================

test "ECADD point at infinity addition" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);
    
    // Test adding point at infinity to itself (all zeros input)
    const input = [_]u8{0} ** 128; // Two points at infinity
    var output = [_]u8{0} ** 64;

    const result = evm.Precompiles.execute_precompile(
        ECADD_ADDRESS,
        &input,
        &output,
        1000,
        chain_rules
    );

    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());
    try testing.expectEqual(@as(usize, 64), result.get_output_size());

    // Result should be point at infinity (0, 0)
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ECADD generator point plus infinity" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);

    // Test adding generator point (1, 2) to point at infinity
    var input = [_]u8{0} ** 128;
    
    // Set first point to generator (1, 2)
    input[31] = 1; // x1 = 1
    input[63] = 2; // y1 = 2
    // Second point remains at infinity (0, 0)

    var output = [_]u8{0} ** 64;
    const result = evm.Precompiles.execute_precompile(
        ECADD_ADDRESS,
        &input,
        &output,
        1000,
        chain_rules
    );
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());

    // Result should be generator point (1, 2)
    try testing.expectEqual(@as(u8, 1), output[31]); // x coordinate
    try testing.expectEqual(@as(u8, 2), output[63]); // y coordinate
}

test "ECADD infinity plus generator point" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);

    // Test adding point at infinity to generator point (reverse order)
    var input = [_]u8{0} ** 128;
    
    // First point remains at infinity (0, 0)
    // Set second point to generator (1, 2)
    input[95] = 1;  // x2 = 1
    input[127] = 2; // y2 = 2

    var output = [_]u8{0} ** 64;
    const result = evm.Precompiles.execute_precompile(
        ECADD_ADDRESS,
        &input,
        &output,
        1000,
        chain_rules
    );
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());

    // Result should be generator point (1, 2)
    try testing.expectEqual(@as(u8, 1), output[31]); // x coordinate
    try testing.expectEqual(@as(u8, 2), output[63]); // y coordinate
}

// ============================================================================
// Execution Tests - Point Doubling
// ============================================================================

test "ECADD point doubling" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);

    // Test adding generator point (1, 2) to itself
    var input = [_]u8{0} ** 128;
    
    // Set both points to generator (1, 2)
    input[31] = 1;   // x1 = 1
    input[63] = 2;   // y1 = 2
    input[95] = 1;   // x2 = 1
    input[127] = 2;  // y2 = 2

    var output = [_]u8{0} ** 64;
    const result = evm.Precompiles.execute_precompile(
        ECADD_ADDRESS,
        &input,
        &output,
        1000,
        chain_rules
    );
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());

    // Result should be 2*(1, 2) which is a specific point on the curve
    // Verify we got a non-zero result (not point at infinity)
    var all_zero = true;
    for (output) |byte| {
        if (byte != 0) {
            all_zero = false;
            break;
        }
    }
    try testing.expect(!all_zero);
}

// ============================================================================
// Error Handling Tests
// ============================================================================

test "ECADD out of gas" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);

    var input = [_]u8{0} ** 128;
    var output = [_]u8{0} ** 64;

    // Provide insufficient gas (149 < 150 required)
    const result = evm.Precompiles.execute_precompile(
        ECADD_ADDRESS,
        &input,
        &output,
        149,
        chain_rules
    );
    
    try testing.expect(result.is_failure());
    // Note: specific error type checking depends on PrecompileOutput implementation
}

test "ECADD insufficient output buffer" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);

    var input = [_]u8{0} ** 128;
    var small_output = [_]u8{0} ** 32; // Too small (need 64 bytes)

    const result = evm.Precompiles.execute_precompile(
        ECADD_ADDRESS,
        &input,
        &small_output,
        1000,
        chain_rules
    );
    
    try testing.expect(result.is_failure());
}

test "ECADD invalid points" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);

    // Test with invalid point (1, 1) - not on curve y² = x³ + 3
    var input = [_]u8{0} ** 128;
    input[31] = 1; // x1 = 1
    input[63] = 1; // y1 = 1 (invalid, should be 2 for generator)

    var output = [_]u8{0} ** 64;
    const result = evm.Precompiles.execute_precompile(
        ECADD_ADDRESS,
        &input,
        &output,
        1000,
        chain_rules
    );
    
    try testing.expect(result.is_success()); // Should succeed but return (0,0)
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());

    // Result should be point at infinity (0, 0) for invalid input
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ECADD second point invalid" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);

    // Test with valid first point, invalid second point
    var input = [_]u8{0} ** 128;
    
    // First point: valid generator (1, 2)
    input[31] = 1; // x1 = 1
    input[63] = 2; // y1 = 2
    
    // Second point: invalid (1, 1)
    input[95] = 1;  // x2 = 1
    input[127] = 1; // y2 = 1 (invalid)

    var output = [_]u8{0} ** 64;
    const result = evm.Precompiles.execute_precompile(
        ECADD_ADDRESS,
        &input,
        &output,
        1000,
        chain_rules
    );
    
    try testing.expect(result.is_success()); // Should succeed but return (0,0)
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());

    // Result should be point at infinity (0, 0) for invalid input
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

// ============================================================================
// Input Format Tests
// ============================================================================

test "ECADD empty input handling" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);

    // Test with empty input (should be zero-padded)
    const input: [0]u8 = .{};
    var output = [_]u8{0} ** 64;

    const result = evm.Precompiles.execute_precompile(
        ECADD_ADDRESS,
        &input,
        &output,
        1000,
        chain_rules
    );
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());
    
    // Result should be point at infinity (0, 0)
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ECADD short input handling" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);

    // Test with short input (should be zero-padded)
    const input = [_]u8{1, 2, 3, 4}; // Only 4 bytes
    var output = [_]u8{0} ** 64;

    const result = evm.Precompiles.execute_precompile(
        ECADD_ADDRESS,
        &input,
        &output,
        1000,
        chain_rules
    );
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());

    // Should treat as mostly zero input and return point at infinity
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ECADD oversized input handling" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);

    // Test with oversized input (should be truncated to 128 bytes)
    var input = [_]u8{0} ** 200; // 200 bytes
    
    // Set first point to generator (1, 2) within the first 128 bytes
    input[31] = 1; // x1 = 1
    input[63] = 2; // y1 = 2
    // Second point remains at infinity
    
    var output = [_]u8{0} ** 64;
    const result = evm.Precompiles.execute_precompile(
        ECADD_ADDRESS,
        &input,
        &output,
        1000,
        chain_rules
    );
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 150), result.get_gas_used());
    
    // Result should be generator point (1, 2)
    try testing.expectEqual(@as(u8, 1), output[31]); // x coordinate
    try testing.expectEqual(@as(u8, 2), output[63]); // y coordinate
}

// ============================================================================
// Gas Cost Consistency Tests
// ============================================================================

test "ECADD gas cost hardfork consistency" {
    // Test that gas costs are consistent across hardforks where they shouldn't change
    const istanbul_rules = evm.chain_rules.for_hardfork(.ISTANBUL);
    const london_rules = evm.chain_rules.for_hardfork(.LONDON);
    const cancun_rules = evm.chain_rules.for_hardfork(.CANCUN);

    // All these hardforks should have the same ECADD gas cost (150)
    try testing.expectEqual(
        try evm.Precompiles.estimate_gas(ECADD_ADDRESS, 128, istanbul_rules),
        try evm.Precompiles.estimate_gas(ECADD_ADDRESS, 128, london_rules)
    );
    
    try testing.expectEqual(
        try evm.Precompiles.estimate_gas(ECADD_ADDRESS, 128, london_rules),
        try evm.Precompiles.estimate_gas(ECADD_ADDRESS, 128, cancun_rules)
    );
}

test "ECADD gas cost input size independence" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);

    // Gas cost should be the same regardless of input size
    const gas_empty = try evm.Precompiles.estimate_gas(ECADD_ADDRESS, 0, chain_rules);
    const gas_partial = try evm.Precompiles.estimate_gas(ECADD_ADDRESS, 64, chain_rules);
    const gas_full = try evm.Precompiles.estimate_gas(ECADD_ADDRESS, 128, chain_rules);
    const gas_large = try evm.Precompiles.estimate_gas(ECADD_ADDRESS, 1000, chain_rules);
    
    try testing.expectEqual(gas_empty, gas_partial);
    try testing.expectEqual(gas_partial, gas_full);
    try testing.expectEqual(gas_full, gas_large);
    try testing.expectEqual(@as(u64, 150), gas_empty);
}

// ============================================================================
// Stress Tests
// ============================================================================

test "ECADD multiple successive operations" {
    const chain_rules = evm.chain_rules.for_hardfork(.ISTANBUL);
    
    // Perform multiple ECADD operations to ensure consistency
    var input = [_]u8{0} ** 128;
    var output = [_]u8{0} ** 64;
    
    // Set up generator point addition
    input[31] = 1; // x1 = 1
    input[63] = 2; // y1 = 2
    // Second point remains at infinity
    
    // Execute the same operation multiple times
    for (0..10) |_| {
        @memset(&output, 0); // Clear output buffer
        
        const result = evm.Precompiles.execute_precompile(
            ECADD_ADDRESS,
            &input,
            &output,
            1000,
            chain_rules
        );
        
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 150), result.get_gas_used());
        
        // Should always return generator point
        try testing.expectEqual(@as(u8, 1), output[31]);
        try testing.expectEqual(@as(u8, 2), output[63]);
    }
}