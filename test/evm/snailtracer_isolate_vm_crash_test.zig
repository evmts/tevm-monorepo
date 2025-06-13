const std = @import("std");
const evm = @import("evm");
const testing = std.testing;

// Test to isolate exactly what step in VM.init is causing the crash
test "Isolate VM init crash step by step" {
    std.debug.print("=== Isolating VM init crash ===\n", .{});
    
    var gpa = std.heap.GeneralPurposeAllocator(.{}){}; 
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    std.debug.print("✅ Step 1: Allocator created\n", .{});
    
    // Step 2: Initialize MemoryDatabase
    var memory_db = evm.evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    const db_interface = memory_db.to_database_interface();
    
    std.debug.print("✅ Step 2: MemoryDatabase created\n", .{});
    
    // Step 3: Test EvmState initialization separately
    std.debug.print("🔍 Step 3: Testing EvmState.init...\n", .{});
    var state = evm.evm.EvmState.init(allocator, db_interface) catch |err| {
        std.debug.print("❌ Step 3: EvmState.init failed: {}\n", .{err});
        return err;
    };
    defer state.deinit();
    std.debug.print("✅ Step 3: EvmState.init successful\n", .{});
    
    // Let's test if accessing the defaults causes issues
    std.debug.print("🔍 Step 4a: Testing JumpTable.DEFAULT access...\n", .{});
    const jump_table = &evm.evm.JumpTable.DEFAULT;
    std.debug.print("✅ Step 4a: JumpTable.DEFAULT accessed successfully\n", .{});
    
    std.debug.print("🔍 Step 4b: Testing ChainRules.DEFAULT access...\n", .{});  
    const chain_rules = &evm.evm.chain_rules.DEFAULT;
    std.debug.print("✅ Step 4b: ChainRules.DEFAULT accessed successfully\n", .{});
    
    std.debug.print("🔍 Step 4c: Testing Context.init()...\n", .{});
    const context = evm.evm.Context.init();
    std.debug.print("✅ Step 4c: Context.init() successful\n", .{});
    
    // Step 5: Now test VM.init() directly as in the debug test
    std.debug.print("🔍 Step 5: Testing VM.init() directly...\n", .{});
    var vm = evm.evm.Vm.init(allocator, db_interface, null, null) catch |err| {
        std.debug.print("❌ Step 5: VM.init failed: {}\n", .{err});
        return err;
    };
    defer vm.deinit();
    std.debug.print("✅ Step 5: VM.init() successful\n", .{});
    
    std.debug.print("🎯 VM isolation test completed successfully!\n", .{});
}