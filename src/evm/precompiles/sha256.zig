const std = @import("std");
const Sha256 = std.crypto.hash.sha2.Sha256;
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const gas_utils = @import("precompile_gas.zig");
const gas_constants = @import("../constants/gas_constants.zig");

/// SHA256 precompile implementation (address 0x02)
///
/// The SHA256 precompile provides SHA-256 hash functionality for smart contracts.
/// It is essential for Ethereum ecosystem compatibility and is used by smart contracts
/// for data integrity verification, commitment schemes, and interoperability with
/// Bitcoin and other systems.
///
/// ## Gas Cost
/// 
/// The gas cost follows the standard linear formula:
/// - Base cost: 60 gas
/// - Per-word cost: 12 gas per 32-byte word (rounded up)
/// - Total: 60 + 12 * ceil(input_size / 32)
///
/// ## Security
///
/// Uses Zig's standard library implementation which is:
/// - FIPS 180-4 compliant
/// - Constant-time execution resistant to timing attacks
/// - Memory-safe through Zig's safety features
/// - Well-tested and audited
///
/// ## Examples
///
/// ```zig
/// // Empty input: 60 gas, hash of empty string
/// const result1 = execute(&[_]u8{}, &output, 100);
///
/// // 32 bytes input: 60 + 12 = 72 gas, hash of input
/// const result2 = execute(&[_]u8{1, 2, 3, ...}, &output, 100);
///
/// // 33 bytes input: 60 + 12*2 = 84 gas (2 words), hash of input
/// const result3 = execute(&[_]u8{1, 2, 3, ..., 33}, &output, 100);
/// ```

/// Calculates the gas cost for SHA256 precompile execution
///
/// Uses the standard linear gas calculation: base + word_cost * word_count
/// Where word_count = ceil(input_size / 32)
///
/// @param input_size Size of the input data in bytes
/// @return Gas cost for processing the given input size
pub fn calculate_gas(input_size: usize) u64 {
    return gas_utils.calculate_linear_cost(
        input_size, 
        gas_constants.SHA256_BASE_COST, 
        gas_constants.SHA256_WORD_COST
    );
}

/// Calculates the gas cost with overflow protection
///
/// Same as calculate_gas but returns an error if the calculation would overflow.
/// Important for very large input sizes in adversarial scenarios.
///
/// @param input_size Size of the input data in bytes
/// @return Gas cost or error if calculation overflows
pub fn calculate_gas_checked(input_size: usize) !u64 {
    return gas_utils.calculate_linear_cost_checked(
        input_size, 
        gas_constants.SHA256_BASE_COST, 
        gas_constants.SHA256_WORD_COST
    );
}

/// Executes the SHA256 precompile
///
/// This is the main entry point for SHA256 precompile execution. It performs
/// the following steps:
///
/// 1. Calculate the required gas cost
/// 2. Validate that the gas limit is sufficient
/// 3. Validate that output buffer is large enough (32 bytes)
/// 4. Compute SHA256 hash of input data
/// 5. Write hash to output buffer
/// 6. Return success result with gas used and output size
///
/// The function assumes that the output buffer is at least 32 bytes.
/// This is the caller's responsibility to ensure.
///
/// @param input Input data to be hashed
/// @param output Output buffer to write the result (must be >= 32 bytes)
/// @param gas_limit Maximum gas available for this operation
/// @return PrecompileOutput containing success/failure and gas usage
pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileOutput {
    // Calculate gas cost for this input size
    const gas_cost = calculate_gas_checked(input.len) catch {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    };
    
    // Check if we have enough gas
    if (gas_cost > gas_limit) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    }
    
    // Validate output buffer size - SHA256 always produces 32 bytes
    if (output.len < 32) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Compute SHA256 hash using Zig's standard library
    // This implementation is:
    // - FIPS 180-4 compliant
    // - Constant-time execution
    // - Memory safe
    // - Well-tested and audited
    var hasher = Sha256.init(.{});
    hasher.update(input);
    const hash = hasher.finalResult();
    
    // Copy hash to output buffer
    // SHA256 always produces exactly 32 bytes
    @memcpy(output[0..32], &hash);
    
    return PrecompileOutput.success_result(gas_cost, 32);
}

/// Validates the gas requirement without executing
///
/// This function can be used to check if a call would succeed without actually
/// performing the operation. Useful for gas estimation and validation.
///
/// @param input_size Size of the input data
/// @param gas_limit Available gas limit
/// @return true if the operation would succeed, false if out of gas
pub fn validate_gas_requirement(input_size: usize, gas_limit: u64) bool {
    const gas_cost = calculate_gas_checked(input_size) catch {
        @branchHint(.cold);
        return false;
    };
    return gas_cost <= gas_limit;
}

/// Gets the expected output size for given input
///
/// For SHA256, the output size is always 32 bytes regardless of input size.
/// This function is provided for consistency with other precompiles.
///
/// @param input_size Size of the input data (unused for SHA256)
/// @return Expected output size (always 32 for SHA256)
pub fn get_output_size(input_size: usize) usize {
    _ = input_size; // SHA256 output is always 32 bytes
    return 32;
}