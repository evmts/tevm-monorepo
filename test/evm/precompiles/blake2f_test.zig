const std = @import("std");
const testing = std.testing;
const blake2f = @import("../../../src/evm/precompiles/blake2f.zig");
const precompiles = @import("../../../src/evm/precompiles/precompiles.zig");
const PrecompileOutput = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileError;
const ChainRules = @import("../../../src/evm/hardforks/chain_rules.zig");
const Address = @import("Address").Address;

/// Helper to create a valid BLAKE2F input for testing
fn create_blake2f_input(rounds: u32, final_flag: u8) [213]u8 {
    var input = [_]u8{0} ** 213;
    
    // Set rounds (big-endian)
    std.mem.writeInt(u32, input[0..4], rounds, .big);
    
    // Set final flag
    input[212] = final_flag;
    
    return input;
}

test "blake2f gas calculation with valid input" {
    const rounds_12_input = create_blake2f_input(12, 0);
    try testing.expectEqual(@as(u64, 12), blake2f.calculate_gas(&rounds_12_input));
    
    const rounds_100_input = create_blake2f_input(100, 0);
    try testing.expectEqual(@as(u64, 100), blake2f.calculate_gas(&rounds_100_input));
    
    const rounds_1_input = create_blake2f_input(1, 1);
    try testing.expectEqual(@as(u64, 1), blake2f.calculate_gas(&rounds_1_input));
}

test "blake2f gas calculation with invalid input length" {
    const invalid_input = [_]u8{0x01, 0x02}; // Wrong length
    try testing.expectEqual(@as(u64, 0), blake2f.calculate_gas(&invalid_input));
}

test "blake2f calculate_gas_checked with valid input size" {
    const gas_cost = blake2f.calculate_gas_checked(213) catch unreachable;
    try testing.expectEqual(@as(u64, 0), gas_cost); // Returns 0 as placeholder
}

test "blake2f calculate_gas_checked with invalid input size" {
    const result = blake2f.calculate_gas_checked(100);
    try testing.expectError(error.InvalidInputSize, result);
}

test "blake2f execution with invalid input length" {
    const invalid_input = [_]u8{0x01, 0x02}; // Wrong length
    var output = [_]u8{0} ** 64;
    
    const result = blake2f.execute(&invalid_input, &output, 1000);
    try testing.expect(result.success == false);
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.error_type);
}

test "blake2f execution with insufficient output buffer" {
    const valid_input = create_blake2f_input(1, 0);
    var output = [_]u8{0} ** 32; // Too small (need 64 bytes)
    
    const result = blake2f.execute(&valid_input, &output, 1000);
    try testing.expect(result.success == false);
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.error_type);
}

test "blake2f execution with insufficient gas" {
    const input = create_blake2f_input(100, 0); // Needs 100 gas
    var output = [_]u8{0} ** 64;
    
    const result = blake2f.execute(&input, &output, 50); // Only 50 gas available
    try testing.expect(result.success == false);
    try testing.expectEqual(PrecompileError.OutOfGas, result.error_type);
}

test "blake2f execution with invalid final flag" {
    var input = create_blake2f_input(1, 0);
    input[212] = 0x02; // Invalid final flag (must be 0 or 1)
    var output = [_]u8{0} ** 64;
    
    const result = blake2f.execute(&input, &output, 1000);
    try testing.expect(result.success == false);
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.error_type);
}

test "blake2f successful execution with minimal valid input" {
    const input = create_blake2f_input(1, 0);
    var output = [_]u8{0} ** 64;
    
    const result = blake2f.execute(&input, &output, 1000);
    try testing.expect(result.success == true);
    try testing.expectEqual(@as(u64, 1), result.gas_used);
    try testing.expectEqual(@as(usize, 64), result.output_len);
}

test "blake2f successful execution with final flag set" {
    const input = create_blake2f_input(12, 1);
    var output = [_]u8{0} ** 64;
    
    const result = blake2f.execute(&input, &output, 1000);
    try testing.expect(result.success == true);
    try testing.expectEqual(@as(u64, 12), result.gas_used);
    try testing.expectEqual(@as(usize, 64), result.output_len);
}

test "blake2f output size calculation" {
    try testing.expectEqual(@as(usize, 64), blake2f.get_output_size(213));
    try testing.expectEqual(@as(usize, 64), blake2f.get_output_size(100)); // Size ignored
}

test "blake2f validate gas requirement" {
    try testing.expect(blake2f.validate_gas_requirement(213, 100) == true);
    try testing.expect(blake2f.validate_gas_requirement(213, 0) == false);
    try testing.expect(blake2f.validate_gas_requirement(100, 100) == false); // Wrong input size
}

// EIP-152 test vector (minimal test case from the EIP)
test "blake2f eip-152 basic test vector" {
    // This is a minimal test vector to verify our implementation produces output
    // For full compatibility, we'd need the complete EIP-152 test vectors
    var input = [_]u8{0} ** 213;
    
    // Set rounds = 12
    std.mem.writeInt(u32, input[0..4], 12, .big);
    
    // Set h (initial state) - using BLAKE2b IV for simplicity
    const blake2b_iv = [_]u64{
        0x6a09e667f3bcc908, 0xbb67ae8584caa73b, 0x3c6ef372fe94f82b, 0xa54ff53a5f1d36f1,
        0x510e527fade682d1, 0x9b05688c2b3e6c1f, 0x1f83d9abfb41bd6b, 0x5be0cd19137e2179,
    };
    
    for (0..8) |i| {
        const offset = 4 + i * 8;
        std.mem.writeInt(u64, input[offset..offset + 8], blake2b_iv[i], .little);
    }
    
    // m (message) stays zero
    // t (counter) stays zero  
    // f (final flag) = 0
    input[212] = 0;
    
    var output = [_]u8{0} ** 64;
    const result = blake2f.execute(&input, &output, 1000);
    
    try testing.expect(result.success == true);
    try testing.expectEqual(@as(u64, 12), result.gas_used);
    try testing.expectEqual(@as(usize, 64), result.output_len);
    
    // Verify output is not all zeros (compression should produce different result)
    var all_zeros = true;
    for (output) |byte| {
        if (byte != 0) {
            all_zeros = false;
            break;
        }
    }
    try testing.expect(!all_zeros);
}

test "blake2f precompile integration via precompiles dispatcher" {
    const blake2f_address = Address.fromInt(0x09);
    const chain_rules = ChainRules{ .IsIstanbul = true, .IsCancun = true };
    
    // Test precompile availability
    try testing.expect(precompiles.is_precompile(blake2f_address));
    try testing.expect(precompiles.is_available(blake2f_address, chain_rules));
    
    // Test execution through dispatcher
    const input = create_blake2f_input(1, 0);
    var output = [_]u8{0} ** 64;
    
    const result = precompiles.execute_precompile(blake2f_address, &input, &output, 1000, chain_rules);
    try testing.expect(result.success == true);
    try testing.expectEqual(@as(u64, 1), result.gas_used);
}

test "blake2f precompile unavailable before istanbul" {
    const blake2f_address = Address.fromInt(0x09);
    const chain_rules = ChainRules{ .IsIstanbul = false }; // Before Istanbul
    
    try testing.expect(!precompiles.is_available(blake2f_address, chain_rules));
    
    const input = create_blake2f_input(1, 0);
    var output = [_]u8{0} ** 64;
    
    const result = precompiles.execute_precompile(blake2f_address, &input, &output, 1000, chain_rules);
    try testing.expect(result.success == false);
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.error_type);
}