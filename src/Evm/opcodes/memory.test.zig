const std = @import("std");
const testing = std.testing;

// Just test a simple standalone part of memory.zig
test "Memory gas cost calculations" {
    const memoryGasCost = @import("memory.zig").memoryGasCost;
    
    // Test basic memory expansion gas cost calculation
    const old_size: u64 = 0;
    const new_size: u64 = 32; // 1 word
    
    const gas_cost = memoryGasCost(old_size, new_size);
    
    // For 1 word, cost should be: 1*1*3 + 1*3 = 6
    try testing.expectEqual(@as(u64, 6), gas_cost);
    
    // Test larger expansion
    const old_size2: u64 = 32;
    const new_size2: u64 = 96; // 3 words
    
    const gas_cost2 = memoryGasCost(old_size2, new_size2);
    
    // For expanding from 1 word to 3 words:
    // new cost = 3*3*3 + 3*3 = 36
    // old cost = 1*1*3 + 1*3 = 6
    // difference = 30
    try testing.expectEqual(@as(u64, 30), gas_cost2);
}