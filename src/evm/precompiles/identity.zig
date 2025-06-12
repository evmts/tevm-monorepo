const std = @import("std");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const gas_utils = @import("precompile_gas.zig");

/// IDENTITY precompile implementation (address 0x04)
///
/// The IDENTITY precompile is the simplest of all precompiles. It returns the input
/// data unchanged (identity function). Despite its simplicity, it serves important
/// purposes:
///
/// 1. **Data copying**: Efficiently copy data between different memory contexts
/// 2. **Gas measurement**: Provides predictable gas costs for data operations
/// 3. **Testing**: Simple precompile for testing the precompile infrastructure
/// 4. **Specification compliance**: Required by Ethereum specification
///
/// ## Gas Cost
/// 
/// The gas cost follows the standard linear formula:
/// - Base cost: 15 gas
/// - Per-word cost: 3 gas per 32-byte word (rounded up)
/// - Total: 15 + 3 * ceil(input_size / 32)
///
/// ## Examples
///
/// ```zig
/// // Empty input: 15 gas, empty output
/// const result1 = execute(&[_]u8{}, &output, 100);
///
/// // 32 bytes input: 15 + 3 = 18 gas, same output as input
/// const result2 = execute(&[_]u8{1, 2, 3, ...}, &output, 100);
///
/// // 33 bytes input: 15 + 3*2 = 21 gas (2 words), same output as input
/// const result3 = execute(&[_]u8{1, 2, 3, ..., 33}, &output, 100);
/// ```

/// Gas constants for IDENTITY precompile
/// These values are defined in the Ethereum specification and must match exactly
pub const IDENTITY_BASE_COST: u64 = 15;
pub const IDENTITY_WORD_COST: u64 = 3;

/// Calculates the gas cost for IDENTITY precompile execution
///
/// Uses the standard linear gas calculation: base + word_cost * word_count
/// Where word_count = ceil(input_size / 32)
///
/// @param input_size Size of the input data in bytes
/// @return Gas cost for processing the given input size
pub fn calculate_gas(input_size: usize) u64 {
    return gas_utils.calculate_linear_cost(input_size, IDENTITY_BASE_COST, IDENTITY_WORD_COST);
}

/// Calculates the gas cost with overflow protection
///
/// Same as calculate_gas but returns an error if the calculation would overflow.
/// Important for very large input sizes in adversarial scenarios.
///
/// @param input_size Size of the input data in bytes
/// @return Gas cost or error if calculation overflows
pub fn calculate_gas_checked(input_size: usize) !u64 {
    return gas_utils.calculate_linear_cost_checked(input_size, IDENTITY_BASE_COST, IDENTITY_WORD_COST);
}

/// Executes the IDENTITY precompile
///
/// This is the main entry point for IDENTITY precompile execution. It performs
/// the following steps:
///
/// 1. Calculate the required gas cost
/// 2. Validate that the gas limit is sufficient
/// 3. Copy input data to output buffer
/// 4. Return success result with gas used and output size
///
/// The function assumes that the output buffer is large enough to hold the input data.
/// This is the caller's responsibility to ensure.
///
/// @param input Input data to be copied (identity operation)
/// @param output Output buffer to write the result (must be >= input.len)
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
    
    // Validate output buffer size
    if (output.len < input.len) {
        @branchHint(.cold);
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Identity operation: copy input to output
    // This is the core functionality - simply copy the input unchanged
    if (input.len > 0) {
        @branchHint(.likely);
        @memcpy(output[0..input.len], input);
    }
    
    return PrecompileOutput.success_result(gas_cost, input.len);
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
/// For IDENTITY, the output size is always equal to the input size.
/// This function is provided for consistency with other precompiles.
///
/// @param input_size Size of the input data
/// @return Expected output size (same as input for IDENTITY)
pub fn get_output_size(input_size: usize) usize {
    return input_size;
}