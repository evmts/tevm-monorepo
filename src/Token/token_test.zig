const std = @import("std");
const token = @import("token.zig");

test "format functions" {
    var buffer: [100]u8 = undefined;
    
    // Create a dummy U256 value
    const dummy_value = token.U256{ .limbs = &[_]usize{1230000000000000000}, .positive = true };
    
    // Test formatEther function
    const ether_result = try token.formatEther(&buffer, dummy_value);
    try std.testing.expectEqualStrings("1230000000000000000", ether_result);
    
    // Test formatGwei function  
    const gwei_result = try token.formatGwei(&buffer, dummy_value);
    try std.testing.expectEqualStrings("1230000000000000000", gwei_result);
}

test "parse functions" {
    // Test parseEther function
    const ether_value = try token.parseEther("1.23");
    try std.testing.expect(ether_value.positive);
    
    // Test parseGwei function
    const gwei_value = try token.parseGwei("1.23");
    try std.testing.expect(gwei_value.positive);
}