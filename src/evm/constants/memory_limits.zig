const std = @import("std");

/// EVM Memory Limit Constants
/// 
/// The EVM doesn't have a hard memory limit in the specification, but practical
/// limits exist due to gas costs. Memory expansion has quadratic gas costs that
/// make extremely large allocations prohibitively expensive.
///
/// Most production EVMs implement practical memory limits to prevent DoS attacks
/// and ensure predictable resource usage.

/// Maximum memory size in bytes (32 MB)
/// This is a reasonable limit that matches many production EVM implementations.
/// At 32 MB, the gas cost would be approximately:
/// - Words: 1,048,576 (32 MB / 32 bytes)
/// - Linear cost: 3 * 1,048,576 = 3,145,728 gas
/// - Quadratic cost: (1,048,576^2) / 512 = 2,147,483,648 gas
/// - Total: ~2.15 billion gas (far exceeding any reasonable block gas limit)
pub const MAX_MEMORY_SIZE: u64 = 32 * 1024 * 1024; // 32 MB

/// Alternative reasonable limits used by other implementations:
/// - 16 MB: More conservative limit
pub const CONSERVATIVE_MEMORY_LIMIT: u64 = 16 * 1024 * 1024;

/// - 64 MB: More permissive limit
pub const PERMISSIVE_MEMORY_LIMIT: u64 = 64 * 1024 * 1024;

/// Calculate the gas cost for a given memory size
pub fn calculate_memory_gas_cost(size_bytes: u64) u64 {
    const words = (size_bytes + 31) / 32;
    const linear_cost = 3 * words;
    const quadratic_cost = (words * words) / 512;
    return linear_cost + quadratic_cost;
}

/// Check if a memory size would exceed reasonable gas limits
pub fn is_memory_size_reasonable(size_bytes: u64, available_gas: u64) bool {
    const gas_cost = calculate_memory_gas_cost(size_bytes);
    return gas_cost <= available_gas;
}

test "memory gas costs" {
    const testing = std.testing;
    
    // Test small allocations
    try testing.expectEqual(@as(u64, 3), calculate_memory_gas_cost(32)); // 1 word
    try testing.expectEqual(@as(u64, 6), calculate_memory_gas_cost(64)); // 2 words
    
    // Test 1 KB
    const kb_cost = calculate_memory_gas_cost(1024);
    try testing.expect(kb_cost > 96); // Should be more than linear cost alone
    
    // Test 1 MB - should be very expensive
    const mb_cost = calculate_memory_gas_cost(1024 * 1024);
    try testing.expect(mb_cost > 1_000_000); // Over 1 million gas
    
    // Test 32 MB - should be prohibitively expensive
    const limit_cost = calculate_memory_gas_cost(MAX_MEMORY_SIZE);
    try testing.expect(limit_cost > 2_000_000_000); // Over 2 billion gas
}

test "reasonable memory sizes" {
    const testing = std.testing;
    
    // With 10 million gas (reasonable for a transaction)
    const available_gas: u64 = 10_000_000;
    
    // Small sizes should be reasonable
    try testing.expect(is_memory_size_reasonable(1024, available_gas)); // 1 KB
    try testing.expect(is_memory_size_reasonable(10 * 1024, available_gas)); // 10 KB
    
    // Large sizes should not be reasonable
    try testing.expect(!is_memory_size_reasonable(10 * 1024 * 1024, available_gas)); // 10 MB
    try testing.expect(!is_memory_size_reasonable(MAX_MEMORY_SIZE, available_gas)); // 32 MB
}
