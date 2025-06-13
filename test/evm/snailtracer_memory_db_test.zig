const std = @import("std");
const evm = @import("evm");
const testing = std.testing;

// Test to verify MemoryDatabase initialization works
test "MemoryDatabase initialization test" {
    std.debug.print("=== Testing MemoryDatabase initialization ===\n", .{});
    
    var gpa = std.heap.GeneralPurposeAllocator(.{}){}; 
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    std.debug.print("✅ Allocator created successfully!\n", .{});
    
    // Try to initialize MemoryDatabase
    var memory_db = evm.evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    
    std.debug.print("✅ MemoryDatabase initialized successfully!\n", .{});
    
    const db_interface = memory_db.to_database_interface();
    _ = db_interface; // Suppress unused variable warning
    
    std.debug.print("✅ Database interface created successfully!\n", .{});
    std.debug.print("🎯 MemoryDatabase test completed successfully!\n", .{});
}