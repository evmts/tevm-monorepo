const std = @import("std");
const evm = @import("evm");
const Address = @import("Address");
const testing = std.testing;

// Simple test to verify the test infrastructure works
test "Simple benchmark setup test" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    std.debug.print("=== Testing simple EVM setup ===\n", .{});

    // Initialize memory database
    var memory_db = evm.evm.MemoryDatabase.init(allocator);
    defer memory_db.deinit();
    const db_interface = memory_db.to_database_interface();

    // Initialize VM
    var vm = evm.evm.Vm.init(allocator, db_interface, null, null) catch |err| {
        std.debug.print("Failed to initialize VM: {}\n", .{err});
        return err;
    };
    defer vm.deinit();

    std.debug.print("✅ EVM VM initialized successfully!\n", .{});

    // Use exact same addresses as the benchmark
    const CREATOR_ADDRESS: [20]u8 = [_]u8{0x10} ++ [_]u8{0x00} ** 19;

    // Set up creator account with sufficient balance
    try vm.state.set_balance(CREATOR_ADDRESS, std.math.maxInt(u256));

    std.debug.print("✅ Creator account set up with balance!\n", .{});
    std.debug.print("🎯 Basic test infrastructure verified!\n", .{});
}