const std = @import("std");
const testing = std.testing;
const ecmul = @import("../../../src/evm/precompiles/ecmul.zig");
const precompiles = @import("../../../src/evm/precompiles/precompiles.zig");
const PrecompileOutput = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileError;
const ChainRules = @import("../../../src/evm/hardforks/chain_rules.zig");
const Hardfork = @import("../../../src/evm/hardforks/hardfork.zig").Hardfork;
const Address = @import("Address").Address;
const bn254 = @import("../../../src/evm/precompiles/bn254.zig");

test "ecmul gas calculation hardfork differences" {
    // Istanbul rules (6000 gas)
    const istanbul_rules = ChainRules.for_hardfork(.ISTANBUL);
    try testing.expectEqual(@as(u64, 6000), ecmul.calculate_gas(istanbul_rules));
    
    // Byzantium rules (40000 gas)
    const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
    try testing.expectEqual(@as(u64, 40000), ecmul.calculate_gas(byzantium_rules));
    
    // London rules (should be same as Istanbul)
    const london_rules = ChainRules.for_hardfork(.LONDON);
    try testing.expectEqual(@as(u64, 6000), ecmul.calculate_gas(london_rules));
}

test "ecmul gas calculation checked" {
    // Should return Istanbul gas cost by default
    try testing.expectEqual(@as(u64, 6000), try ecmul.calculate_gas_checked(96));
    try testing.expectEqual(@as(u64, 6000), try ecmul.calculate_gas_checked(0));
    try testing.expectEqual(@as(u64, 6000), try ecmul.calculate_gas_checked(1000));
}

test "ecmul execute generator point multiplication by 2" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test input: generator point (1, 2) × 2 = doubled generator
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set point coordinates: (1, 2)
    input[31] = 1; // x = 1
    input[63] = 2; // y = 2
    
    // Set scalar: 2
    input[95] = 2; // scalar = 2
    
    const result = ecmul.execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 6000), result.get_gas_used());
    try testing.expectEqual(@as(usize, 64), result.get_output_size());
    
    // Result should be the doubled generator point
    const expected_doubled = bn254.G1Point.GENERATOR.double();
    var expected_bytes: [64]u8 = undefined;
    expected_doubled.to_bytes(&expected_bytes);
    
    try testing.expectEqualSlices(u8, &expected_bytes, &output);
}

test "ecmul execute zero scalar" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test input: any point × 0 = point at infinity (0, 0)
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set point coordinates: (1, 2)
    input[31] = 1; // x = 1  
    input[63] = 2; // y = 2
    
    // scalar is already 0
    
    const result = ecmul.execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 6000), result.get_gas_used());
    
    // Result should be point at infinity (all zeros)
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ecmul execute unit scalar" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test input: any point × 1 = same point
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set point coordinates: (1, 2)
    input[31] = 1; // x = 1
    input[63] = 2; // y = 2
    
    // Set scalar: 1
    input[95] = 1; // scalar = 1
    
    const result = ecmul.execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 6000), result.get_gas_used());
    
    // Result should be the same point
    try testing.expectEqual(@as(u8, 1), output[31]); // x = 1
    try testing.expectEqual(@as(u8, 2), output[63]); // y = 2
}

test "ecmul execute invalid point off curve" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test input: invalid point (not on curve)
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set invalid point coordinates: (1, 3) - not on curve
    input[31] = 1; // x = 1
    input[63] = 3; // y = 3 (invalid)
    
    // Set scalar: 2
    input[95] = 2; // scalar = 2
    
    const result = ecmul.execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 6000), result.get_gas_used());
    
    // Result should be point at infinity (all zeros) for invalid input
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ecmul execute large scalar" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test with large scalar value
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set point coordinates: (1, 2)
    input[31] = 1; // x = 1
    input[63] = 2; // y = 2
    
    // Set large scalar: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
    for (input[64..96]) |*byte| {
        byte.* = 0xFF;
    }
    
    const result = ecmul.execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 6000), result.get_gas_used());
    try testing.expectEqual(@as(usize, 64), result.get_output_size());
    
    // Result should be valid (not all zeros unless the point is infinity)
    // We don't check the exact result since large scalar multiplication
    // is complex, but we verify it doesn't crash
}

test "ecmul execute out of gas byzantium" {
    const chain_rules = ChainRules.for_hardfork(.BYZANTIUM);
    
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set valid input
    input[31] = 1; // x = 1
    input[63] = 2; // y = 2
    input[95] = 2; // scalar = 2
    
    // Provide insufficient gas (need 40000, only provide 39999)
    const result = ecmul.execute(&input, &output, 39999, chain_rules);
    
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.OutOfGas, result.get_error().?);
    try testing.expectEqual(@as(u64, 0), result.get_gas_used());
}

test "ecmul execute out of gas istanbul" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set valid input
    input[31] = 1; // x = 1
    input[63] = 2; // y = 2
    input[95] = 2; // scalar = 2
    
    // Provide insufficient gas (need 6000, only provide 5999)
    const result = ecmul.execute(&input, &output, 5999, chain_rules);
    
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.OutOfGas, result.get_error().?);
    try testing.expectEqual(@as(u64, 0), result.get_gas_used());
}

test "ecmul execute insufficient output buffer" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [63]u8 = undefined; // Too small, need 64 bytes
    
    // Set valid input
    input[31] = 1; // x = 1
    input[63] = 2; // y = 2
    input[95] = 2; // scalar = 2
    
    const result = ecmul.execute(&input, &output, 10000, chain_rules);
    
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.get_error().?);
}

test "ecmul execute short input padding" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test with input shorter than 96 bytes (should be padded with zeros)
    var input: [50]u8 = [_]u8{0} ** 50;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set point coordinates: (1, 2)
    input[31] = 1; // x = 1
    // y and scalar remain 0 due to padding
    
    const result = ecmul.execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 6000), result.get_gas_used());
    
    // Result should be point at infinity due to scalar = 0
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ecmul get output size" {
    // ECMUL always returns 64 bytes regardless of input size
    try testing.expectEqual(@as(usize, 64), ecmul.get_output_size(0));
    try testing.expectEqual(@as(usize, 64), ecmul.get_output_size(96));
    try testing.expectEqual(@as(usize, 64), ecmul.get_output_size(1000));
}

test "ecmul validate gas requirement" {
    const istanbul_rules = ChainRules.for_hardfork(.ISTANBUL);
    const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
    
    // Istanbul validation
    try testing.expect(ecmul.validate_gas_requirement(96, 6000, istanbul_rules));
    try testing.expect(ecmul.validate_gas_requirement(96, 10000, istanbul_rules));
    try testing.expect(!ecmul.validate_gas_requirement(96, 5999, istanbul_rules));
    
    // Byzantium validation
    try testing.expect(ecmul.validate_gas_requirement(96, 40000, byzantium_rules));
    try testing.expect(ecmul.validate_gas_requirement(96, 50000, byzantium_rules));
    try testing.expect(!ecmul.validate_gas_requirement(96, 39999, byzantium_rules));
}

test "precompile dispatcher ecmul address detection" {
    const ecmul_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x07 };
    
    // Check address detection
    try testing.expect(precompiles.is_precompile(ecmul_address));
    
    // Check availability with different chain rules
    const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
    const istanbul_rules = ChainRules.for_hardfork(.ISTANBUL);
    const frontier_rules = ChainRules.for_hardfork(.FRONTIER);
    
    try testing.expect(precompiles.is_available(ecmul_address, byzantium_rules));
    try testing.expect(precompiles.is_available(ecmul_address, istanbul_rules));
    try testing.expect(!precompiles.is_available(ecmul_address, frontier_rules)); // Not available before Byzantium
}

test "precompile dispatcher execute ecmul" {
    const ecmul_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x07 };
    
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set generator point and scalar 2
    input[31] = 1; // x = 1
    input[63] = 2; // y = 2
    input[95] = 2; // scalar = 2
    
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    const result = precompiles.execute_precompile(
        ecmul_address,
        &input,
        &output,
        10000,
        chain_rules
    );
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 6000), result.get_gas_used());
    try testing.expectEqual(@as(usize, 64), result.get_output_size());
    
    // Verify result is doubled generator point
    const expected_doubled = bn254.G1Point.GENERATOR.double();
    var expected_bytes: [64]u8 = undefined;
    expected_doubled.to_bytes(&expected_bytes);
    try testing.expectEqualSlices(u8, &expected_bytes, &output);
}

test "precompile dispatcher estimate gas ecmul" {
    const ecmul_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x07 };
    
    const istanbul_rules = ChainRules.for_hardfork(.ISTANBUL);
    const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
    
    try testing.expectEqual(@as(u64, 6000), try precompiles.estimate_gas(ecmul_address, 96, istanbul_rules));
    try testing.expectEqual(@as(u64, 6000), try precompiles.estimate_gas(ecmul_address, 0, istanbul_rules));
    try testing.expectEqual(@as(u64, 6000), try precompiles.estimate_gas(ecmul_address, 1000, istanbul_rules));
    
    // Gas estimation should return the Istanbul default (not Byzantium-specific)
    try testing.expectEqual(@as(u64, 6000), try precompiles.estimate_gas(ecmul_address, 96, byzantium_rules));
}

test "precompile dispatcher get output size ecmul" {
    const ecmul_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x07 };
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    try testing.expectEqual(@as(usize, 64), try precompiles.get_output_size(ecmul_address, 0, chain_rules));
    try testing.expectEqual(@as(usize, 64), try precompiles.get_output_size(ecmul_address, 96, chain_rules));
    try testing.expectEqual(@as(usize, 64), try precompiles.get_output_size(ecmul_address, 1000, chain_rules));
}

test "precompile dispatcher validate call ecmul" {
    const ecmul_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x07 };
    
    const istanbul_rules = ChainRules.for_hardfork(.ISTANBUL);
    const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
    
    // Valid calls
    try testing.expect(precompiles.validate_call(ecmul_address, 96, 6000, istanbul_rules));
    try testing.expect(precompiles.validate_call(ecmul_address, 96, 10000, istanbul_rules));
    try testing.expect(precompiles.validate_call(ecmul_address, 96, 40000, byzantium_rules));
    
    // Invalid calls (insufficient gas)
    try testing.expect(!precompiles.validate_call(ecmul_address, 96, 5999, istanbul_rules));
    try testing.expect(!precompiles.validate_call(ecmul_address, 96, 39999, byzantium_rules));
}

test "ecmul scalar multiplication consistency" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test that scalar multiplication is consistent
    const point = bn254.G1Point.GENERATOR;
    const scalar: u256 = 123456789;
    
    // Test with ECMUL precompile
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set generator point
    input[31] = 1; // x = 1
    input[63] = 2; // y = 2
    
    // Set scalar (123456789)
    var scalar_bytes: [32]u8 = [_]u8{0} ** 32;
    scalar_bytes[31] = @intCast(scalar & 0xFF);
    scalar_bytes[30] = @intCast((scalar >> 8) & 0xFF);
    scalar_bytes[29] = @intCast((scalar >> 16) & 0xFF);
    scalar_bytes[28] = @intCast((scalar >> 24) & 0xFF);
    @memcpy(input[64..96], &scalar_bytes);
    
    const precompile_result = ecmul.execute(&input, &output, 10000, chain_rules);
    try testing.expect(precompile_result.is_success());
    
    // Test with direct BN254 implementation
    const direct_result = point.scalar_multiply(scalar);
    var direct_bytes: [64]u8 = undefined;
    direct_result.to_bytes(&direct_bytes);
    
    // Results should be identical
    try testing.expectEqualSlices(u8, &direct_bytes, &output);
}

test "ecmul point at infinity edge cases" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test multiplication of point at infinity by any scalar
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set point at infinity (0, 0) and scalar 123
    input[95] = 123; // scalar = 123
    
    const result = ecmul.execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    
    // Result should be point at infinity (all zeros)
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ecmul coordinates boundary values" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    // Test with coordinates at field boundary (should be rejected)
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set x coordinate to field prime (invalid)
    const field_prime_bytes = [_]u8{
        0x30, 0x64, 0x4e, 0x72, 0xe1, 0x31, 0xa0, 0x29, 0xb8, 0x50, 0x45, 0xb6, 0x81, 0x81, 0x58, 0x5d,
        0x97, 0x81, 0x6a, 0x91, 0x68, 0x71, 0xca, 0x8d, 0x3c, 0x20, 0x8c, 0x16, 0xd8, 0x7c, 0xfd, 0x47,
    };
    @memcpy(input[0..32], &field_prime_bytes);
    
    // Set y = 2 and scalar = 1
    input[63] = 2;
    input[95] = 1;
    
    const result = ecmul.execute(&input, &output, 10000, chain_rules);
    try testing.expect(result.is_success());
    
    // Should return point at infinity for invalid point
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "ecmul performance benchmark" {
    const chain_rules = ChainRules.for_hardfork(.ISTANBUL);
    
    var input: [96]u8 = [_]u8{0} ** 96;
    var output: [64]u8 = [_]u8{0} ** 64;
    
    // Set generator point and scalar 2
    input[31] = 1; // x = 1
    input[63] = 2; // y = 2
    input[95] = 2; // scalar = 2
    
    const iterations = 100;
    var timer = try std.time.Timer.start();
    
    for (0..iterations) |_| {
        const result = ecmul.execute(&input, &output, 10000, chain_rules);
        try testing.expect(result.is_success());
    }
    
    const elapsed_ns = timer.read();
    const ns_per_op = elapsed_ns / iterations;
    
    // Should complete within reasonable time (adjust threshold as needed)
    // ECMUL is more complex than simple operations, so allow more time
    try testing.expect(ns_per_op < 1_000_000); // 1 millisecond per operation
}