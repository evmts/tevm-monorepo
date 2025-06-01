const std = @import("std");
const zbench = @import("zbench");
const Memory = @import("evm").Memory;

// Benchmark memory initialization
fn benchmarkMemoryInit(allocator: std.mem.Allocator) void {
    var mem = Memory.init(allocator) catch return;
    defer mem.deinit();
    std.mem.doNotOptimizeAway(&mem);
}

// Benchmark memory initialization with custom capacity
fn benchmarkMemoryInitLarge(allocator: std.mem.Allocator) void {
    var mem = Memory.initWithCapacity(allocator, 1024 * 1024) catch return; // 1MB
    defer mem.deinit();
    std.mem.doNotOptimizeAway(&mem);
}

// Benchmark memory initialization with limit
fn benchmarkMemoryInitWithLimit(allocator: std.mem.Allocator) void {
    var mem = Memory.initWithLimit(allocator, 1024 * 1024 * 10) catch return; // 10MB limit
    defer mem.deinit();
    std.mem.doNotOptimizeAway(&mem);
}

// Benchmark memory operations with limit enforcement
fn benchmarkMemoryLimitEnforcement(allocator: std.mem.Allocator) void {
    var mem = Memory.initWithLimit(allocator, 1024 * 64) catch return; // 64KB limit
    defer mem.deinit();
    
    // Try to expand within limit
    for (0..10) |i| {
        const size = (i + 1) * 1024; // 1KB increments
        _ = mem.ensureCapacity(size) catch {
            // Expected to fail after 64KB
            break;
        };
    }
}

// Benchmark single byte read/write
fn benchmarkByteOperations(allocator: std.mem.Allocator) void {
    var mem = Memory.init(allocator) catch return;
    defer mem.deinit();
    
    // Write and read 100 bytes
    for (0..100) |i| {
        mem.setByte(i, @truncate(i)) catch return;
        const byte = mem.getByte(i) catch return;
        std.mem.doNotOptimizeAway(byte);
    }
}

// Benchmark word (32-byte) operations
fn benchmarkWordOperations(allocator: std.mem.Allocator) void {
    var mem = Memory.init(allocator) catch return;
    defer mem.deinit();
    
    const word: [32]u8 = [_]u8{0xFF} ** 32;
    
    // Write and read 32 words
    for (0..32) |i| {
        const offset = i * 32;
        mem.setWord(offset, word) catch return;
        const read_word = mem.getWord(offset) catch return;
        std.mem.doNotOptimizeAway(&read_word);
    }
}

// Benchmark U256 operations
fn benchmarkU256Operations(allocator: std.mem.Allocator) void {
    var mem = Memory.init(allocator) catch return;
    defer mem.deinit();
    
    const value: u256 = 0xDEADBEEF_CAFEBABE_12345678_9ABCDEF0_11111111_22222222_33333333_44444444;
    
    // Write and read 16 U256 values
    for (0..16) |i| {
        const offset = i * 32;
        mem.setU256(offset, value) catch return;
        const read_value = mem.getU256(offset) catch return;
        std.mem.doNotOptimizeAway(read_value);
    }
}

// Benchmark memory expansion
fn benchmarkMemoryExpansion(allocator: std.mem.Allocator) void {
    var mem = Memory.init(allocator) catch return;
    defer mem.deinit();
    
    // Expand memory in steps
    for (0..10) |i| {
        const size = (i + 1) * 1024; // Expand by 1KB each iteration
        _ = mem.ensureCapacity(size) catch return;
        std.mem.doNotOptimizeAway(mem.size());
    }
}

// Benchmark large data copy
fn benchmarkLargeDataCopy(allocator: std.mem.Allocator) void {
    var mem = Memory.init(allocator) catch return;
    defer mem.deinit();
    
    // Create 1KB of data
    var data: [1024]u8 = undefined;
    for (&data, 0..) |*byte, i| {
        byte.* = @truncate(i);
    }
    
    // Copy to memory 10 times at different offsets
    for (0..10) |i| {
        const offset = i * 1024;
        mem.setData(offset, &data) catch return;
    }
}

// Benchmark memory copy (MCOPY operation)
fn benchmarkMemoryCopy(allocator: std.mem.Allocator) void {
    var mem = Memory.init(allocator) catch return;
    defer mem.deinit();
    
    // Initialize some data
    var data: [256]u8 = undefined;
    for (&data, 0..) |*byte, i| {
        byte.* = @truncate(i);
    }
    mem.setData(0, &data) catch return;
    
    // Copy within memory (overlapping and non-overlapping)
    for (0..10) |i| {
        const src = i * 32;
        const dest = i * 48;
        mem.copy(dest, src, 128) catch return;
    }
}

// Benchmark setDataBounded (used by CALLDATACOPY, CODECOPY)
fn benchmarkBoundedCopy(allocator: std.mem.Allocator) void {
    var mem = Memory.init(allocator) catch return;
    defer mem.deinit();
    
    // Source data
    var data: [512]u8 = undefined;
    for (&data, 0..) |*byte, i| {
        byte.* = @truncate(i);
    }
    
    // Test various bounded copies
    for (0..20) |i| {
        const memory_offset = i * 64;
        const data_offset = i * 16;
        const len = 128;
        mem.setDataBounded(memory_offset, &data, data_offset, len) catch return;
    }
}

// Benchmark slice reading
fn benchmarkSliceReading(allocator: std.mem.Allocator) void {
    var mem = Memory.init(allocator) catch return;
    defer mem.deinit();
    
    // Initialize 4KB of data
    _ = mem.ensureCapacity(4096) catch return;
    
    // Read various slices
    for (0..100) |i| {
        const offset = i * 32;
        const len = 64;
        const slice = mem.getSlice(offset, len) catch return;
        std.mem.doNotOptimizeAway(slice);
    }
}

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("EVM Memory Benchmarks\n", .{});
    try stdout.print("====================\n\n", .{});

    var bench = zbench.Benchmark.init(std.heap.page_allocator, .{});
    defer bench.deinit();

    // Register benchmarks
    try bench.add("Memory Init (4KB)", benchmarkMemoryInit, .{});
    try bench.add("Memory Init (1MB)", benchmarkMemoryInitLarge, .{});
    try bench.add("Memory Init With Limit", benchmarkMemoryInitWithLimit, .{});
    try bench.add("Memory Limit Enforcement", benchmarkMemoryLimitEnforcement, .{});
    try bench.add("Byte Operations", benchmarkByteOperations, .{});
    try bench.add("Word Operations", benchmarkWordOperations, .{});
    try bench.add("U256 Operations", benchmarkU256Operations, .{});
    try bench.add("Memory Expansion", benchmarkMemoryExpansion, .{});
    try bench.add("Large Data Copy", benchmarkLargeDataCopy, .{});
    try bench.add("Memory Copy (MCOPY)", benchmarkMemoryCopy, .{});
    try bench.add("Bounded Copy", benchmarkBoundedCopy, .{});
    try bench.add("Slice Reading", benchmarkSliceReading, .{});

    // Run benchmarks
    try stdout.print("Running benchmarks...\n\n", .{});
    try bench.run(stdout);
}