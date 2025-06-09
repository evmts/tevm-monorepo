/// SHA256 precompile implementation for Ethereum Virtual Machine
/// 
/// This precompile provides SHA-256 hash functionality at address 0x02.
/// It's available from the Frontier hardfork and uses Zig's standard library
/// crypto implementation for secure and efficient hashing.
///
/// ## Ethereum Specification
/// - Address: 0x0000000000000000000000000000000000000002
/// - Gas Cost: 60 + 12 * ceil(input_size / 32)
/// - Function: Returns SHA256 hash (32 bytes) of input data
/// - Available: All hardforks (Frontier onwards)
/// - Output: Always 32 bytes regardless of input size

const std = @import("std");
const Sha256 = std.crypto.hash.sha2.Sha256;
const gas_constants = @import("../constants/gas_constants.zig");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const PrecompileExecutionResult = @import("precompile_result.zig").PrecompileExecutionResult;

/// Calculate gas cost for SHA256 precompile
/// 
/// Gas cost follows the formula: 60 + 12 * ceil(input_size / 32)
/// This accounts for a base cost plus per-word processing cost.
/// 
/// ## Parameters
/// - `input_size`: Size of input data in bytes
/// 
/// ## Returns
/// - Total gas cost for the operation
/// 
/// ## Examples
/// ```zig
/// try testing.expectEqual(@as(u64, 60), calculate_gas(0));   // Empty input
/// try testing.expectEqual(@as(u64, 72), calculate_gas(1));   // 1 byte = 1 word
/// try testing.expectEqual(@as(u64, 72), calculate_gas(32));  // 32 bytes = 1 word  
/// try testing.expectEqual(@as(u64, 84), calculate_gas(33));  // 33 bytes = 2 words
/// ```
pub fn calculate_gas(input_size: usize) u64 {
    // Calculate number of 32-byte words (ceiling division)
    const word_count = (input_size + 31) / 32;
    return gas_constants.SHA256_BASE_COST + gas_constants.SHA256_WORD_COST * @as(u64, @intCast(word_count));
}

/// Execute SHA256 precompile
/// 
/// Computes SHA256 hash of input data and writes the 32-byte result to output buffer.
/// Checks gas limit before execution and validates output buffer size.
/// 
/// ## Parameters
/// - `input`: Input data to hash
/// - `output`: Output buffer (must be at least 32 bytes)
/// - `gas_limit`: Maximum gas that can be consumed
/// 
/// ## Returns
/// - PrecompileResult with gas consumption and output size, or error
/// 
/// ## Errors
/// - `OutOfGas`: Gas limit exceeded
/// - `InvalidOutput`: Output buffer too small
/// 
/// ## Examples
/// ```zig
/// var output: [32]u8 = undefined;
/// const result = try execute("hello", &output, 1000);
/// try testing.expectEqual(@as(u64, 72), result.gas_used);
/// try testing.expectEqual(@as(usize, 32), result.output_size);
/// ```
pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileError!PrecompileResult {
    // Check input size doesn't cause integer overflow in gas calculation
    if (input.len > std.math.maxInt(u32)) {
        return PrecompileError.InputTooLarge;
    }
    
    // Calculate gas cost
    const gas_cost = calculate_gas(input.len);
    if (gas_cost > gas_limit) {
        return PrecompileError.OutOfGas;
    }
    
    // Validate output buffer size
    if (output.len < 32) {
        return PrecompileError.InvalidOutput;
    }
    
    // Compute SHA256 hash using Zig's standard library
    var hasher = Sha256.init(.{});
    hasher.update(input);
    const hash = hasher.finalResult();
    
    // Copy hash to output buffer
    @memcpy(output[0..32], &hash);
    
    return PrecompileResult.success(gas_cost, 32);
}

/// Execute SHA256 precompile with result wrapper
/// 
/// Convenience function that wraps the result in PrecompileExecutionResult
/// for consistent error handling across the precompile system.
/// 
/// ## Parameters
/// - `input`: Input data to hash
/// - `output`: Output buffer (must be at least 32 bytes)
/// - `gas_limit`: Maximum gas that can be consumed
/// 
/// ## Returns
/// - PrecompileExecutionResult (success or failure)
pub fn execute_wrapped(input: []const u8, output: []u8, gas_limit: u64) PrecompileExecutionResult {
    const result = execute(input, output, gas_limit) catch |err| {
        return PrecompileExecutionResult.err(err);
    };
    return PrecompileExecutionResult.ok(result.gas_used, result.output_size);
}

// ============================================================================
// Tests
// ============================================================================

test "sha256 gas calculation" {
    const testing = std.testing;
    
    // Test gas calculation for various input sizes
    try testing.expectEqual(@as(u64, 60), calculate_gas(0));    // Empty: base cost only
    try testing.expectEqual(@as(u64, 72), calculate_gas(1));    // 1 byte: base + 1 word
    try testing.expectEqual(@as(u64, 72), calculate_gas(32));   // 32 bytes: base + 1 word
    try testing.expectEqual(@as(u64, 84), calculate_gas(33));   // 33 bytes: base + 2 words
    try testing.expectEqual(@as(u64, 84), calculate_gas(64));   // 64 bytes: base + 2 words
    try testing.expectEqual(@as(u64, 96), calculate_gas(65));   // 65 bytes: base + 3 words
}

test "sha256 known test vectors" {
    const testing = std.testing;
    var output: [32]u8 = undefined;
    
    // Test empty string
    // SHA256("") = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    const empty_result = try execute("", &output, 1000);
    try testing.expectEqual(@as(u64, 60), empty_result.gas_used);
    try testing.expectEqual(@as(usize, 32), empty_result.output_size);
    
    const expected_empty = [_]u8{
        0xe3, 0xb0, 0xc4, 0x42, 0x98, 0xfc, 0x1c, 0x14, 0x9a, 0xfb, 0xf4, 0xc8, 0x99, 0x6f, 0xb9, 0x24,
        0x27, 0xae, 0x41, 0xe4, 0x64, 0x9b, 0x93, 0x4c, 0xa4, 0x95, 0x99, 0x1b, 0x78, 0x52, 0xb8, 0x55
    };
    try testing.expectEqualSlices(u8, &expected_empty, output[0..32]);
    
    // Test "abc"  
    // SHA256("abc") = ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
    const abc_result = try execute("abc", &output, 1000);
    try testing.expectEqual(@as(u64, 72), abc_result.gas_used);
    try testing.expectEqual(@as(usize, 32), abc_result.output_size);
    
    const expected_abc = [_]u8{
        0xba, 0x78, 0x16, 0xbf, 0x8f, 0x01, 0xcf, 0xea, 0x41, 0x41, 0x40, 0xde, 0x5d, 0xae, 0x22, 0x23,
        0xb0, 0x03, 0x61, 0xa3, 0x96, 0x17, 0x7a, 0x9c, 0xb4, 0x10, 0xff, 0x61, 0xf2, 0x00, 0x15, 0xad
    };
    try testing.expectEqualSlices(u8, &expected_abc, output[0..32]);
}

test "sha256 gas limit exceeded" {
    const testing = std.testing;
    var output: [32]u8 = undefined;
    
    // Test with insufficient gas
    const result = execute("test", &output, 50); // Need 72 gas, only provide 50
    try testing.expectError(PrecompileError.OutOfGas, result);
}

test "sha256 invalid output buffer" {
    const testing = std.testing;
    var small_output: [16]u8 = undefined; // Too small for 32-byte hash
    
    const result = execute("test", &small_output, 1000);
    try testing.expectError(PrecompileError.InvalidOutput, result);
}

test "sha256 large input" {
    const testing = std.testing;
    const allocator = testing.allocator;
    var output: [32]u8 = undefined;
    
    // Test with larger input (1024 bytes = 32 words)
    const large_input = try allocator.alloc(u8, 1024);
    defer allocator.free(large_input);
    
    // Fill with test pattern
    for (large_input, 0..) |*byte, i| {
        byte.* = @as(u8, @intCast(i & 0xFF));
    }
    
    const expected_gas = 60 + 12 * 32; // Base + 32 words
    const result = try execute(large_input, &output, expected_gas);
    try testing.expectEqual(expected_gas, result.gas_used);
    try testing.expectEqual(@as(usize, 32), result.output_size);
}

test "sha256 wrapped execution" {
    const testing = std.testing;
    var output: [32]u8 = undefined;
    
    // Test successful wrapped execution
    const success_result = execute_wrapped("test", &output, 1000);
    try testing.expect(success_result.is_success());
    try testing.expectEqual(@as(u64, 72), success_result.gas_used());
    
    // Test failed wrapped execution
    const failure_result = execute_wrapped("test", &output, 50);
    try testing.expect(!failure_result.is_success());
    try testing.expectEqual(@as(u64, 0), failure_result.gas_used());
}