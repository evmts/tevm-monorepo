const std = @import("std");
const evm = @import("evm");
const testing = std.testing;

// Test to debug VM initialization step by step
test "Debug VM initialization step by step" {
    std.debug.print("=== Debugging VM initialization step by step ===\n", .{});
    
    var gpa = std.heap.GeneralPurposeAllocator(.{}){}; 
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    std.debug.print("✅ Step 1: Allocator created successfully!\n", .{});
    
    // Step 2: Initialize MemoryDatabase
    var memory_db = evm.evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    
    std.debug.print("✅ Step 2: MemoryDatabase initialized successfully!\n", .{});
    
    // Step 3: Get database interface
    const db_interface = memory_db.to_database_interface();
    
    std.debug.print("✅ Step 3: Database interface created successfully!\n", .{});
    
    // Step 4: Try to initialize EvmState directly
    std.debug.print("🔍 Step 4: Attempting to initialize EvmState...\n", .{});
    var state = evm.evm.EvmState.init(allocator, db_interface) catch |err| {
        std.debug.print("❌ Step 4: EvmState initialization failed: {}\n", .{err});
        return err;
    };
    defer state.deinit();
    
    std.debug.print("✅ Step 4: EvmState initialized successfully!\n", .{});
    
    // Step 5: Now try the actual VM.init call that was crashing
    std.debug.print("🔍 Step 5: Attempting VM.init (the actual call that crashes)...\n", .{});
    var vm = evm.evm.Vm.init(allocator, db_interface, null, null) catch |err| {
        std.debug.print("❌ Step 5: VM.init failed: {}\n", .{err});
        return err;
    };
    defer vm.deinit();
    
    std.debug.print("✅ Step 5: VM.init completed successfully!\n", .{});
    std.debug.print("🎯 VM initialization debug test completed successfully!\n", .{});
}