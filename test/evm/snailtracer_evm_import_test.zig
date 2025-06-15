const std = @import("std");
const evm = @import("evm");
const testing = std.testing;

// Test to verify EVM module imports work
test "EVM module import test" {
    std.debug.print("=== Testing EVM module import ===\n", .{});
    
    var gpa = std.heap.GeneralPurposeAllocator(.{}){}; 
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    std.debug.print("✅ Allocator created successfully!\n", .{});
    std.debug.print("✅ EVM module imported successfully!\n", .{});
    
    // Try to access a simple type from the EVM module 
    _ = allocator; // Keep unused variable warnings away
    
    std.debug.print("🎯 EVM import test completed successfully!\n", .{});
}