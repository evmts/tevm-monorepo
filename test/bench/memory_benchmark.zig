const std = @import("std");
const evm = @import("evm");

// Basic memory benchmarks without zbench dependency
// This is a simple performance test for memory operations

fn basicMemoryTest() !void {
    const allocator = std.heap.page_allocator;
    const stdout = std.io.getStdOut().writer();
    
    try stdout.print("Basic Memory Performance Test\n", .{});
    try stdout.print("==============================\n\n", .{});
    
    // Test 1: Memory initialization
    const start_time = std.time.nanoTimestamp();
    
    var mem = try evm.Memory.init_default(allocator);
    defer mem.deinit();
    mem.finalize_root();
    
    const init_time = std.time.nanoTimestamp();
    try stdout.print("Memory initialization: {}ns\n", .{init_time - start_time});
    
    // Test 2: Memory expansion
    const expansion_start = std.time.nanoTimestamp();
    _ = try mem.ensure_context_capacity(1024 * 1024); // 1MB
    const expansion_time = std.time.nanoTimestamp();
    try stdout.print("Memory expansion to 1MB: {}ns\n", .{expansion_time - expansion_start});
    
    // Test 3: U256 operations
    const u256_start = std.time.nanoTimestamp();
    const test_value: u256 = 0xDEADBEEF_CAFEBABE_12345678_9ABCDEF0_11111111_22222222_33333333_44444444;
    
    for (0..1000) |i| {
        const offset = i * 32;
        try mem.set_u256(offset, test_value);
        const read_value = try mem.get_u256(offset);
        std.mem.doNotOptimizeAway(read_value);
    }
    
    const u256_time = std.time.nanoTimestamp();
    try stdout.print("1000 U256 write/read cycles: {}ns\n", .{u256_time - u256_start});
    
    // Test 4: Byte operations  
    const byte_start = std.time.nanoTimestamp();
    
    for (0..1000) |i| {
        const byte_data = [_]u8{@truncate(i)};
        try mem.set_data(i, &byte_data);
        const read_byte = try mem.get_byte(i);
        std.mem.doNotOptimizeAway(read_byte);
    }
    
    const byte_time = std.time.nanoTimestamp();
    try stdout.print("1000 byte write/read cycles: {}ns\n", .{byte_time - byte_start});
    
    // Test 5: Large data copy
    const copy_start = std.time.nanoTimestamp();
    var large_data: [4096]u8 = undefined;
    for (&large_data, 0..) |*byte, i| {
        byte.* = @truncate(i);
    }
    
    try mem.set_data(100000, &large_data);
    const copy_slice = try mem.get_slice(100000, 4096);
    std.mem.doNotOptimizeAway(copy_slice);
    
    const copy_time = std.time.nanoTimestamp();
    try stdout.print("4KB data copy: {}ns\n", .{copy_time - copy_start});
    
    try stdout.print("\nMemory performance test completed successfully!\n", .{});
}

pub fn main() !void {
    try basicMemoryTest();
}