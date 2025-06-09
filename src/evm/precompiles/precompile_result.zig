/// Precompile execution result types and error handling
/// 
/// This module defines the result types and error conditions for precompile execution.
/// Precompiles can succeed with gas consumption and output data, or fail with specific errors.

const std = @import("std");

/// Errors that can occur during precompile execution
pub const PrecompileError = error {
    /// Insufficient gas provided for the operation
    OutOfGas,
    
    /// Invalid input data provided to precompile
    InvalidInput,
    
    /// Output buffer is too small for the result
    InvalidOutput,
    
    /// Input data is too large to process
    InputTooLarge,
    
    /// Precompile-specific computation error
    ComputationError,
    
    /// Memory allocation failure
    OutOfMemory,
};

/// Successful precompile execution result
pub const PrecompileResult = struct {
    /// Gas consumed by the precompile operation
    gas_used: u64,
    
    /// Number of bytes written to the output buffer
    output_size: usize,
    
    /// Create a successful precompile result
    /// 
    /// ## Parameters
    /// - `gas_used`: Amount of gas consumed
    /// - `output_size`: Bytes written to output
    /// 
    /// ## Returns
    /// - PrecompileResult instance
    pub fn success(gas_used: u64, output_size: usize) PrecompileResult {
        return PrecompileResult{
            .gas_used = gas_used,
            .output_size = output_size,
        };
    }
};

/// Complete precompile execution result (success or error)
pub const PrecompileExecutionResult = union(enum) {
    /// Successful execution with gas consumption and output
    success: PrecompileResult,
    
    /// Failed execution with error details
    failure: PrecompileError,
    
    /// Create a successful result
    pub fn ok(gas_amount: u64, output_len: usize) PrecompileExecutionResult {
        return PrecompileExecutionResult{ 
            .success = PrecompileResult.success(gas_amount, output_len) 
        };
    }
    
    /// Create a failure result
    pub fn err(error_code: PrecompileError) PrecompileExecutionResult {
        return PrecompileExecutionResult{ .failure = error_code };
    }
    
    /// Check if result represents success
    pub fn is_success(self: PrecompileExecutionResult) bool {
        return switch (self) {
            .success => true,
            .failure => false,
        };
    }
    
    /// Get gas used if successful, 0 if failed
    pub fn gas_used(self: PrecompileExecutionResult) u64 {
        return switch (self) {
            .success => |result| result.gas_used,
            .failure => 0,
        };
    }
    
    /// Get output size if successful, 0 if failed
    pub fn output_size(self: PrecompileExecutionResult) usize {
        return switch (self) {
            .success => |result| result.output_size,
            .failure => 0,
        };
    }
};

test "precompile result creation and inspection" {
    const testing = std.testing;
    
    // Test successful result
    const success_result = PrecompileExecutionResult.ok(100, 32);
    try testing.expect(success_result.is_success());
    try testing.expectEqual(@as(u64, 100), success_result.gas_used());
    try testing.expectEqual(@as(usize, 32), success_result.output_size());
    
    // Test failure result
    const failure_result = PrecompileExecutionResult.err(PrecompileError.OutOfGas);
    try testing.expect(!failure_result.is_success());
    try testing.expectEqual(@as(u64, 0), failure_result.gas_used());
    try testing.expectEqual(@as(usize, 0), failure_result.output_size());
    
    // Test PrecompileResult direct creation
    const direct_result = PrecompileResult.success(250, 64);
    try testing.expectEqual(@as(u64, 250), direct_result.gas_used);
    try testing.expectEqual(@as(usize, 64), direct_result.output_size);
}