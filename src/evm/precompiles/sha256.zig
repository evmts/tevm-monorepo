const std = @import("std");
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const gas_utils = @import("../constants/gas_constants.zig");

/// SHA256 precompile implementation
///
/// This module implements the SHA256 cryptographic hash function precompile at address 0x02.
/// The precompile follows the Ethereum specification:
/// 
/// - Address: 0x0000000000000000000000000000000000000002
/// - Gas cost: 60 + 12 * ceil(input_size / 32)
/// - Output: Always 32 bytes (SHA256 hash)
/// - Available: From Frontier hardfork onwards
///
/// ## Gas Calculation
/// The gas cost is calculated as a base cost of 60 gas plus 12 gas per 32-byte word.
/// This reflects the computational cost of hashing data.
///
/// ## Implementation
/// Uses Zig's standard library `std.crypto.hash.sha2.Sha256` for the actual cryptographic operation.
/// This ensures security, correctness, and performance while maintaining minimal code complexity.
///
/// ## Security
/// SHA256 is a cryptographically secure hash function that produces a 256-bit (32-byte) digest.
/// The implementation is resistant to length extension attacks and produces deterministic output.

/// Base gas cost for SHA256 precompile
/// This is the minimum cost regardless of input size
const SHA256_BASE_COST: u64 = 60;

/// Gas cost per 32-byte word for SHA256 precompile  
/// Total cost = SHA256_BASE_COST + (word_count * SHA256_WORD_COST)
const SHA256_WORD_COST: u64 = 12;

/// SHA256 always outputs exactly 32 bytes
const SHA256_OUTPUT_SIZE: usize = 32;

/// Calculate gas cost for SHA256 precompile
///
/// The gas cost follows the formula: 60 + 12 * ceil(input_size / 32)
/// This provides a base cost plus a linear cost based on the number of 32-byte words.
///
/// @param input_size Size of input data in bytes
/// @return Gas cost for processing this input
pub fn calculate_gas(input_size: usize) u64 {
    const word_count = (input_size + 31) / 32; // Ceiling division
    return SHA256_BASE_COST + SHA256_WORD_COST * word_count;
}

/// Calculate gas cost with overflow checking
///
/// Same as calculate_gas but returns an error if the calculation would overflow.
/// This is important for very large inputs that could cause arithmetic overflow.
///
/// @param input_size Size of input data in bytes
/// @return Gas cost or error.Overflow if calculation overflows
pub fn calculate_gas_checked(input_size: usize) !u64 {
    // Check for potential overflow in word count calculation
    if (input_size > std.math.maxInt(usize) - 31) {
        return error.Overflow;
    }
    
    const word_count = (input_size + 31) / 32;
    
    // Check for potential overflow in gas calculation
    const gas_from_words = std.math.mul(u64, SHA256_WORD_COST, word_count) catch {
        return error.Overflow;
    };
    
    const total_gas = std.math.add(u64, SHA256_BASE_COST, gas_from_words) catch {
        return error.Overflow;
    };
    
    return total_gas;
}

/// Execute SHA256 precompile
///
/// Computes the SHA256 hash of the input data and writes it to the output buffer.
/// Performs gas checking and validates output buffer size before execution.
///
/// @param input Input data to hash
/// @param output Output buffer for the 32-byte hash (must be at least 32 bytes)
/// @param gas_limit Maximum gas available for execution
/// @return PrecompileOutput with success/failure status and gas usage
pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileOutput {
    // Calculate required gas
    const required_gas = calculate_gas(input.len);
    
    // Check if we have enough gas
    if (required_gas > gas_limit) {
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    }
    
    // Validate output buffer size
    if (output.len < SHA256_OUTPUT_SIZE) {
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Compute SHA256 hash using Zig standard library
    var hasher = std.crypto.hash.sha2.Sha256.init(.{});
    hasher.update(input);
    hasher.final(output[0..SHA256_OUTPUT_SIZE]);
    
    return PrecompileOutput.success_result(required_gas, SHA256_OUTPUT_SIZE);
}

/// Validate that sufficient gas is available for the given input size
///
/// @param input_size Size of input data in bytes
/// @param available_gas Available gas limit
/// @return true if gas is sufficient, false otherwise
pub fn validate_gas_requirement(input_size: usize, available_gas: u64) bool {
    const required_gas = calculate_gas(input_size);
    return required_gas <= available_gas;
}

/// Get the output size for SHA256 precompile
///
/// SHA256 always produces exactly 32 bytes of output regardless of input size.
/// This function is provided for consistency with other precompiles.
///
/// @param input_size Size of input data (unused for SHA256)
/// @return Always returns 32 (SHA256_OUTPUT_SIZE)
pub fn get_output_size(input_size: usize) usize {
    _ = input_size; // SHA256 output size is always 32 bytes
    return SHA256_OUTPUT_SIZE;
}