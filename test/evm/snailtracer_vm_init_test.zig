const std = @import("std");
const evm = @import("evm");
const testing = std.testing;

// Test to verify VM initialization works
test "VM initialization test" {
    std.debug.print("=== Testing VM initialization ===\n", .{});
    
    var gpa = std.heap.GeneralPurposeAllocator(.{}){}; 
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    std.debug.print("✅ Allocator created successfully!\n", .{});
    
    // Initialize MemoryDatabase using the same pattern as benchmark runner
    var memory_db = evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    const db_interface = memory_db.to_database_interface();
    
    std.debug.print("✅ MemoryDatabase initialized successfully!\n", .{});
    
    // Initialize VM using the same pattern as benchmark runner
    var vm = evm.Vm.init(allocator, db_interface, null, null) catch |err| {
        std.debug.print("Failed to initialize VM: {}\n", .{err});
        return err;
    };
    defer vm.deinit();
    
    std.debug.print("✅ VM initialized successfully!\n", .{});
    std.debug.print("🎯 VM initialization test completed successfully!\n", .{});
}