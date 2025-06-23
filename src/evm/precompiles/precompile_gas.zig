const std = @import("std");

/// Gas calculation utilities for precompiles
///
/// This module provides common gas calculation patterns used by precompiles.
/// Many precompiles use linear gas costs (base + per_word * word_count) or other
/// standard patterns defined here.

/// Calculates linear gas cost: base_cost + per_word_cost * ceil(input_size / 32)
///
/// This is the most common gas calculation pattern for precompiles. The cost consists
/// of a base cost plus a per-word cost for each 32-byte word of input data.
/// Partial words are rounded up to full words.
///
/// @param input_size Size of the input data in bytes
/// @param base_cost Base gas cost regardless of input size
/// @param per_word_cost Gas cost per 32-byte word of input
/// @return Total gas cost for the operation
pub fn calculate_linear_cost(input_size: usize, base_cost: u64, per_word_cost: u64) u64 {
    const word_count = (input_size + 31) / 32;
    return base_cost + per_word_cost * @as(u64, @intCast(word_count));
}

/// Calculates linear gas cost with checked arithmetic to prevent overflow
///
/// Same as calculate_linear_cost but returns an error if the calculation would overflow.
/// This is important for very large input sizes that could cause integer overflow.
///
/// @param input_size Size of the input data in bytes
/// @param base_cost Base gas cost regardless of input size
/// @param per_word_cost Gas cost per 32-byte word of input
/// @return Total gas cost or error if overflow occurs
pub fn calculate_linear_cost_checked(input_size: usize, base_cost: u64, per_word_cost: u64) !u64 {
    const word_count = (input_size + 31) / 32;
    const word_count_u64 = std.math.cast(u64, word_count) orelse {
        @branchHint(.cold);
        return error.Overflow;
    };
    
    const word_cost = std.math.mul(u64, per_word_cost, word_count_u64) catch {
        @branchHint(.cold);
        return error.Overflow;
    };
    const total_cost = std.math.add(u64, base_cost, word_cost) catch {
        @branchHint(.cold);
        return error.Overflow;
    };
    
    return total_cost;
}

/// Validates that the gas limit is sufficient for the calculated cost
///
/// This is a convenience function that combines gas calculation with validation.
/// It calculates the required gas and checks if the provided limit is sufficient.
///
/// @param input_size Size of the input data in bytes
/// @param base_cost Base gas cost regardless of input size
/// @param per_word_cost Gas cost per 32-byte word of input
/// @param gas_limit Maximum gas available for the operation
/// @return The calculated gas cost if within limit, error otherwise
pub fn validate_gas_limit(input_size: usize, base_cost: u64, per_word_cost: u64, gas_limit: u64) !u64 {
    const gas_cost = try calculate_linear_cost_checked(input_size, base_cost, per_word_cost);
    
    if (gas_cost > gas_limit) {
        @branchHint(.cold);
        return error.OutOfGas;
    }
    
    return gas_cost;
}

/// Calculates the number of 32-byte words for a given byte size
///
/// This is a utility function for converting byte sizes to word counts.
/// Used when precompiles need to know the exact word count for other calculations.
///
/// @param byte_size Size in bytes
/// @return Number of 32-byte words (rounded up)
pub fn bytes_to_words(byte_size: usize) usize {
    return (byte_size + 31) / 32;
}

/// Calculates gas cost for dynamic-length operations
///
/// Some precompiles have more complex gas calculations that depend on the
/// content of the input data, not just its size. This provides a framework
/// for such calculations.
///
/// @param input_data The input data to analyze
/// @param base_cost Base gas cost
/// @param calculate_dynamic_cost Function to calculate additional cost based on input
/// @return Total gas cost
pub fn calculate_dynamic_cost(
    input_data: []const u8, 
    base_cost: u64, 
    calculate_dynamic_cost_fn: fn([]const u8) u64
) u64 {
    const dynamic_cost = calculate_dynamic_cost_fn(input_data);
    return base_cost + dynamic_cost;
}