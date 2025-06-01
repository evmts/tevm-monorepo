const std = @import("std");
const zbench = @import("zbench");
const SharedMemory = @import("evm").SharedMemory;

// Benchmark SharedMemory initialization
fn benchmarkSharedMemoryInit(allocator: std.mem.Allocator) void {
    var mem = SharedMemory.init_default(allocator) catch return;
    defer mem.deinit();
    mem.finalize_root();
    std.mem.doNotOptimizeAway(&mem);
}

// Benchmark SharedMemory initialization with custom capacity
fn benchmarkSharedMemoryInitLarge(allocator: std.mem.Allocator) void {
    var mem = SharedMemory.init(allocator, 1024 * 1024, SharedMemory.DefaultMemoryLimit) catch return; // 1MB
    defer mem.deinit();
    mem.finalize_root();
    std.mem.doNotOptimizeAway(&mem);
}

// Benchmark SharedMemory initialization with limit
fn benchmarkSharedMemoryInitWithLimit(allocator: std.mem.Allocator) void {
    var mem = SharedMemory.init(allocator, 4 * 1024, 1024 * 1024 * 10) catch return; // 10MB limit
    defer mem.deinit();
    mem.finalize_root();
    std.mem.doNotOptimizeAway(&mem);
}

// Benchmark child context creation and revert
fn benchmarkChildContextRevert(allocator: std.mem.Allocator) void {
    var root = SharedMemory.init_default(allocator) catch return;
    defer root.deinit();
    root.finalize_root();
    
    // Create and revert 10 child contexts
    for (0..10) |_| {
        const child = root.new_child_context() catch return;
        _ = child;
        root.revert_child_context() catch return;
    }
}

// Benchmark child context creation and commit
fn benchmarkChildContextCommit(allocator: std.mem.Allocator) void {
    var root = SharedMemory.init_default(allocator) catch return;
    defer root.deinit();
    root.finalize_root();
    
    // Create and commit 10 child contexts
    for (0..10) |_| {
        const child = root.new_child_context() catch return;
        _ = child;
        root.commit_child_context() catch return;
    }
}

// Benchmark nested context operations
fn benchmarkNestedContexts(allocator: std.mem.Allocator) void {
    var root = SharedMemory.init_default(allocator) catch return;
    defer root.deinit();
    root.finalize_root();
    
    // Create 3 levels of nested contexts
    var child1 = root.new_child_context() catch return;
    child1.set_word(0, [_]u8{0xAA} ** 32) catch return;
    
    var child2 = child1.new_child_context() catch return;
    child2.set_word(0, [_]u8{0xBB} ** 32) catch return;
    
    var child3 = child2.new_child_context() catch return;
    child3.set_word(0, [_]u8{0xCC} ** 32) catch return;
    
    // Read from each context
    const root_word = root.get_word(0) catch [_]u8{0} ** 32;
    const child1_word = child1.get_word(0) catch [_]u8{0} ** 32;
    const child2_word = child2.get_word(0) catch [_]u8{0} ** 32;
    const child3_word = child3.get_word(0) catch [_]u8{0} ** 32;
    
    std.mem.doNotOptimizeAway(&root_word);
    std.mem.doNotOptimizeAway(&child1_word);
    std.mem.doNotOptimizeAway(&child2_word);
    std.mem.doNotOptimizeAway(&child3_word);
    
    // Revert all
    child2.revert_child_context() catch return;
    child1.revert_child_context() catch return;
    root.revert_child_context() catch return;
}

// Benchmark single byte read/write in context
fn benchmarkContextByteOperations(allocator: std.mem.Allocator) void {
    var mem = SharedMemory.init_default(allocator) catch return;
    defer mem.deinit();
    mem.finalize_root();
    
    // Write and read 100 bytes
    for (0..100) |i| {
        mem.set_byte(i, @truncate(i)) catch return;
        const byte = mem.get_byte(i) catch return;
        std.mem.doNotOptimizeAway(byte);
    }
}

// Benchmark word (32-byte) operations in context
fn benchmarkContextWordOperations(allocator: std.mem.Allocator) void {
    var mem = SharedMemory.init_default(allocator) catch return;
    defer mem.deinit();
    mem.finalize_root();
    
    const word: [32]u8 = [_]u8{0xFF} ** 32;
    
    // Write and read 32 words
    for (0..32) |i| {
        const offset = i * 32;
        mem.set_word(offset, word) catch return;
        const read_word = mem.get_word(offset) catch return;
        std.mem.doNotOptimizeAway(&read_word);
    }
}

// Benchmark U256 operations in context
fn benchmarkContextU256Operations(allocator: std.mem.Allocator) void {
    var mem = SharedMemory.init_default(allocator) catch return;
    defer mem.deinit();
    mem.finalize_root();
    
    const value: u256 = 0xDEADBEEF_CAFEBABE_12345678_9ABCDEF0_11111111_22222222_33333333_44444444;
    
    // Write and read 16 U256 values
    for (0..16) |i| {
        const offset = i * 32;
        mem.set_u256(offset, value) catch return;
        const read_value = mem.get_u256(offset) catch return;
        std.mem.doNotOptimizeAway(read_value);
    }
}

// Benchmark memory expansion with gas calculation
fn benchmarkContextExpansion(allocator: std.mem.Allocator) void {
    var mem = SharedMemory.init_default(allocator) catch return;
    defer mem.deinit();
    mem.finalize_root();
    
    // Expand memory in steps
    for (0..10) |i| {
        const size = (i + 1) * 1024; // Expand by 1KB each iteration
        const new_words = mem.ensure_context_capacity(size) catch return;
        std.mem.doNotOptimizeAway(new_words);
        std.mem.doNotOptimizeAway(mem.context_size());
    }
}

// Benchmark large data copy in context
fn benchmarkContextLargeDataCopy(allocator: std.mem.Allocator) void {
    var mem = SharedMemory.init_default(allocator) catch return;
    defer mem.deinit();
    mem.finalize_root();
    
    // Create 1KB of data
    var data: [1024]u8 = undefined;
    for (&data, 0..) |*byte, i| {
        byte.* = @truncate(i);
    }
    
    // Copy to memory 10 times at different offsets
    for (0..10) |i| {
        const offset = i * 1024;
        mem.set_data(offset, &data) catch return;
    }
}

// Benchmark memory copy (MCOPY operation) in context
fn benchmarkContextMemoryCopy(allocator: std.mem.Allocator) void {
    var mem = SharedMemory.init_default(allocator) catch return;
    defer mem.deinit();
    mem.finalize_root();
    
    // Initialize some data
    var data: [256]u8 = undefined;
    for (&data, 0..) |*byte, i| {
        byte.* = @truncate(i);
    }
    mem.set_data(0, &data) catch return;
    
    // Copy within memory (overlapping and non-overlapping)
    for (0..10) |i| {
        const src = i * 32;
        const dest = i * 48;
        mem.copy(dest, src, 128) catch return;
    }
}

// Benchmark setDataBounded in context
fn benchmarkContextBoundedCopy(allocator: std.mem.Allocator) void {
    var mem = SharedMemory.init_default(allocator) catch return;
    defer mem.deinit();
    mem.finalize_root();
    
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
        mem.set_data_bounded(memory_offset, &data, data_offset, len) catch return;
    }
}

// Benchmark slice reading in context
fn benchmarkContextSliceReading(allocator: std.mem.Allocator) void {
    var mem = SharedMemory.init_default(allocator) catch return;
    defer mem.deinit();
    mem.finalize_root();
    
    // Initialize 4KB of data
    _ = mem.ensure_context_capacity(4096) catch return;
    
    // Read various slices
    for (0..100) |i| {
        const offset = i * 32;
        const len = 64;
        const slice = mem.get_slice(offset, len) catch return;
        std.mem.doNotOptimizeAway(slice);
    }
}

// Benchmark deep context operations (simulating deep call stack)
fn benchmarkDeepContextOperations(allocator: std.mem.Allocator) void {
    var root = SharedMemory.init_default(allocator) catch return;
    defer root.deinit();
    root.finalize_root();
    
    // Create a chain of 5 contexts
    var current = root.new_child_context() catch return;
    for (0..4) |_| {
        current = current.new_child_context() catch return;
    }
    
    // Perform operations at the deepest level
    for (0..20) |i| {
        current.set_word(i * 32, [_]u8{@truncate(i)} ** 32) catch return;
        const word = current.get_word(i * 32) catch return;
        std.mem.doNotOptimizeAway(&word);
    }
}

// Benchmark memory limit enforcement in context
fn benchmarkContextLimitEnforcement(allocator: std.mem.Allocator) void {
    var mem = SharedMemory.init(allocator, 4 * 1024, 1024 * 64) catch return; // 64KB limit
    defer mem.deinit();
    mem.finalize_root();
    
    // Try to expand within limit
    for (0..10) |i| {
        const size = (i + 1) * 1024; // 1KB increments
        _ = mem.ensure_context_capacity(size) catch {
            // Expected to fail after 64KB
            break;
        };
    }
}

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("SharedMemory Benchmarks\n", .{});
    try stdout.print("=======================\n\n", .{});

    var bench = zbench.Benchmark.init(std.heap.page_allocator, .{});
    defer bench.deinit();

    // Register benchmarks
    try bench.add("SharedMemory Init (4KB)", benchmarkSharedMemoryInit, .{});
    try bench.add("SharedMemory Init (1MB)", benchmarkSharedMemoryInitLarge, .{});
    try bench.add("SharedMemory Init With Limit", benchmarkSharedMemoryInitWithLimit, .{});
    try bench.add("Child Context Revert", benchmarkChildContextRevert, .{});
    try bench.add("Child Context Commit", benchmarkChildContextCommit, .{});
    try bench.add("Nested Contexts", benchmarkNestedContexts, .{});
    try bench.add("Context Byte Operations", benchmarkContextByteOperations, .{});
    try bench.add("Context Word Operations", benchmarkContextWordOperations, .{});
    try bench.add("Context U256 Operations", benchmarkContextU256Operations, .{});
    try bench.add("Context Memory Expansion", benchmarkContextExpansion, .{});
    try bench.add("Context Large Data Copy", benchmarkContextLargeDataCopy, .{});
    try bench.add("Context Memory Copy (MCOPY)", benchmarkContextMemoryCopy, .{});
    try bench.add("Context Bounded Copy", benchmarkContextBoundedCopy, .{});
    try bench.add("Context Slice Reading", benchmarkContextSliceReading, .{});
    try bench.add("Deep Context Operations", benchmarkDeepContextOperations, .{});
    try bench.add("Context Limit Enforcement", benchmarkContextLimitEnforcement, .{});

    // Run benchmarks
    try stdout.print("Running benchmarks...\n\n", .{});
    try bench.run(stdout);
}