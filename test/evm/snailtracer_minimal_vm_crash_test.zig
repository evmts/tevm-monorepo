const std = @import("std");
const evm = @import("evm");
const testing = std.testing;

// Test to pinpoint the exact location of the VM crash
test "Minimal VM crash test" {
    // Add stderr output to ensure we see this even if stdout is buffered
    const stderr = std.io.getStdErr().writer();
    try stderr.print("🚀 TEST STARTED: Minimal VM crash test\n", .{});
    std.debug.print("🚀 TEST STARTED: Minimal VM crash test\n", .{});
    
    try stderr.print("🔍 Step 1: Creating allocator...\n", .{});
    var gpa = std.heap.GeneralPurposeAllocator(.{}){}; 
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    try stderr.print("✅ Step 1: Allocator created\n", .{});
    
    try stderr.print("🔍 Step 2: Creating MemoryDatabase...\n", .{});
    var memory_db = evm.evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    const db_interface = memory_db.to_database_interface();
    
    try stderr.print("✅ Step 2: Database ready\n", .{});
    
    try stderr.print("🔍 Step 3: About to call VM.init() - THIS IS WHERE CRASH SHOULD OCCUR\n", .{});
    std.debug.print("🔍 Step 3: About to call VM.init() - THIS IS WHERE CRASH SHOULD OCCUR\n", .{});
    
    var vm = evm.evm.Vm.init(allocator, db_interface, null, null) catch |err| {
        try stderr.print("❌ VM.init failed with error: {}\n", .{err});
        return err;
    };
    defer vm.deinit();
    
    try stderr.print("✅ VM.init completed successfully (should not reach here if crashing)\n", .{});
    std.debug.print("✅ VM.init completed successfully (should not reach here if crashing)\n", .{});
}