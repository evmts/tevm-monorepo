const std = @import("std");

/// PrecompileError represents error conditions that can occur during precompile execution
///
/// Precompiles have different error conditions from regular EVM execution:
/// - OutOfGas: Gas limit exceeded during execution
/// - InvalidInput: Input data is malformed or invalid for the precompile
/// - ExecutionFailed: The precompile operation itself failed
pub const PrecompileError = error{
    /// Insufficient gas provided to complete the precompile operation
    /// This occurs when the calculated gas cost exceeds the provided gas limit
    OutOfGas,
    
    /// Input data is invalid for the specific precompile
    /// Each precompile has its own input validation requirements
    InvalidInput,
    
    /// The precompile operation failed during execution
    /// This covers cryptographic failures, computation errors, etc.
    ExecutionFailed,
    
    /// Memory allocation failed during precompile execution
    /// Not a normal precompile error - indicates system resource exhaustion
    OutOfMemory,
};

/// PrecompileResult represents the successful result of a precompile execution
///
/// Contains the gas consumed and the output data produced by the precompile.
/// Output data is owned by the caller and must be managed appropriately.
pub const PrecompileResult = struct {
    /// Amount of gas consumed by the precompile execution
    gas_used: u64,
    
    /// Length of the output data produced
    /// The actual output data is written to the provided output buffer
    output_size: usize,
};

/// PrecompileOutput represents the complete result of precompile execution
///
/// This is a union type that represents either success or failure of precompile execution.
/// Success contains gas usage and output size, while failure contains the specific error.
pub const PrecompileOutput = union(enum) {
    /// Successful execution with gas usage and output
    success: PrecompileResult,
    
    /// Failed execution with specific error
    failure: PrecompileError,
    
    /// Creates a successful result
    /// @param gas_used The amount of gas consumed
    /// @param output_size The size of the output data
    /// @return A successful PrecompileOutput
    pub fn success_result(gas_used: u64, output_size: usize) PrecompileOutput {
        return PrecompileOutput{ 
            .success = PrecompileResult{ 
                .gas_used = gas_used, 
                .output_size = output_size 
            } 
        };
    }
    
    /// Creates a failure result
    /// @param err The error that occurred
    /// @return A failed PrecompileOutput
    pub fn failure_result(err: PrecompileError) PrecompileOutput {
        return PrecompileOutput{ .failure = err };
    }
    
    /// Checks if the result represents success
    /// @return true if successful, false if failed
    pub fn is_success(self: PrecompileOutput) bool {
        return switch (self) {
            .success => true,
            .failure => false,
        };
    }
    
    /// Checks if the result represents failure
    /// @return true if failed, false if successful
    pub fn is_failure(self: PrecompileOutput) bool {
        return !self.is_success();
    }
    
    /// Gets the gas used from a successful result
    /// @return The gas used, or 0 if the result is a failure
    pub fn get_gas_used(self: PrecompileOutput) u64 {
        return switch (self) {
            .success => |result| {
                @branchHint(.likely);
                return result.gas_used;
            },
            .failure => {
                @branchHint(.cold);
                return 0;
            },
        };
    }
    
    /// Gets the output size from a successful result
    /// @return The output size, or 0 if the result is a failure
    pub fn get_output_size(self: PrecompileOutput) usize {
        return switch (self) {
            .success => |result| {
                @branchHint(.likely);
                return result.output_size;
            },
            .failure => {
                @branchHint(.cold);
                return 0;
            },
        };
    }
    
    /// Gets the error from a failed result
    /// @return The error, or null if the result is successful
    pub fn get_error(self: PrecompileOutput) ?PrecompileError {
        return switch (self) {
            .success => {
                @branchHint(.likely);
                return null;
            },
            .failure => |err| {
                @branchHint(.cold);
                return err;
            },
        };
    }
};

/// Get a human-readable description for a precompile error
///
/// Provides detailed descriptions of what each error means and when it occurs.
/// Useful for debugging, logging, and error reporting.
///
/// @param err The precompile error to describe
/// @return A string slice containing a human-readable description of the error
pub fn get_error_description(err: PrecompileError) []const u8 {
    return switch (err) {
        PrecompileError.OutOfGas => "Precompile execution ran out of gas",
        PrecompileError.InvalidInput => "Invalid input data for precompile",
        PrecompileError.ExecutionFailed => "Precompile execution failed",
        PrecompileError.OutOfMemory => "Out of memory during precompile execution",
    };
}