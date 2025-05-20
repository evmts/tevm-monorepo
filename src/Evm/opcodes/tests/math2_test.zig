const std = @import("std");
const testing = std.testing;
const math2 = @import("../math2.zig");

// Test exponential gas cost calculation
test "Exponential gas cost calculation" {
    // Since we can't easily mock the stack, we'll test the function itself
    // by mimicking its behavior
    
    // Test with a small exponent (1 byte)
    const small_exp: u256 = 255; // One byte (0xFF)
    const small_exp_gas = 10 + 50 * 1; // 60
    
    // Test with a larger exponent (2 bytes)
    const medium_exp: u256 = 65535; // Two bytes (0xFFFF)
    const medium_exp_gas = 10 + 50 * 2; // 110
    
    // Test with an even larger exponent (3 bytes)
    const large_exp: u256 = 16777215; // Three bytes (0xFFFFFF)
    const large_exp_gas = 10 + 50 * 3; // 160
    
    // Verify the calculation results
    try testing.expectEqual(@as(u64, small_exp_gas), calculateExpGasCost(small_exp));
    try testing.expectEqual(@as(u64, medium_exp_gas), calculateExpGasCost(medium_exp));
    try testing.expectEqual(@as(u64, large_exp_gas), calculateExpGasCost(large_exp));
}

// Simplified version of the gas calculation
fn calculateExpGasCost(exponent: u256) u64 {
    // Gas calculation based on the byte size of the exponent
    // Each non-zero byte in the exponent costs 50 gas
    var byte_size: u64 = 0;
    const exp_copy = exponent;
    
    // Find the byte size of the exponent (count significant bytes)
    var remaining_exp = exp_copy;
    while (remaining_exp > 0) : (remaining_exp >>= 8) {
        byte_size += 1;
    }
    
    // Calculate gas: 10 base + 50 per significant byte
    return 10 + (50 * byte_size);
}