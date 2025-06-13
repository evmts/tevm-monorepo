const std = @import("std");
const testing = std.testing;
const test_helpers = @import("opcodes/test_helpers.zig");

// Test to verify TestVm from test helpers works
test "TestVm from test helpers test" {
    std.debug.print("=== Testing TestVm from test helpers ===\n", .{});
    
    var gpa = std.heap.GeneralPurposeAllocator(.{}){}; 
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    std.debug.print("✅ Allocator created successfully!\n", .{});
    
    // Initialize TestVm using test helpers
    var test_vm = test_helpers.TestVm.init(allocator) catch |err| {
        std.debug.print("Failed to initialize TestVm: {}\n", .{err});
        return err;
    };
    defer test_vm.deinit(allocator);
    
    std.debug.print("✅ TestVm initialized successfully!\n", .{});
    std.debug.print("🎯 TestVm test completed successfully!\n", .{});
}