const std = @import("std");
const Stack = @import("Stack.zig").Stack;
const EVMWord = @import("Stack.zig").EVMWord;
const zbench = @import("zbench");

///////////////////////////////////////////////////////////////////////////////
// OPTIMIZATION RESULTS
// 
// The Stack implementation has been optimized through several steps:
//
// 1. Original (Dynamic Array) Implementation:
//    - Stack.push: 21.568μs ± 10.163μs
//    - Stack.pop: 19.028μs ± 1.319μs
//    - Stack.peek: 20.004μs ± 2.206μs
//    - Stack.peekAt: 16.039μs ± 1.725μs
//    - Stack.swap: 19.567μs ± 2.021μs
//    - Stack.dup: 19.243μs ± 1.417μs
//
// 2. Fixed-Width Array Implementation:
//    - Stack.push: 9.474μs ± 1.238μs
//    - Stack.pop: 15.728μs ± 2.395μs
//    - Stack.peek: 12.42μs ± 2.232μs
//    - Stack.peekAt: 5.958μs ± 0.189μs
//    - Stack.swap: 9.483μs ± 0.333μs
//    - Stack.dup: 8.933μs ± 0.657μs
//
// 3. Inlining + Position Caching Implementation:
//    - Stack.push: 9.419μs ± 1.222μs
//    - Stack.pop: 13.501μs ± 1.559μs
//    - Stack.peek: 11.119μs ± 2.133μs
//    - Stack.peekAt: 6.117μs ± 0.605μs
//    - Stack.swap: 8.332μs ± 0.569μs
//    - Stack.dup: 9.352μs ± 0.725μs
//
// 4. Unsafe Internal Operations Implementation:
//    - Stack.push: 8.477μs ± 1.576μs
//    - Stack.pop: 13.795μs ± 1.562μs
//    - Stack.peek: 10.315μs ± 0.662μs
//    - Stack.peekAt: 6.064μs ± 0.189μs
//    - Stack.swap: 7.829μs ± 0.348μs
//    - Stack.dup: 9.149μs ± 0.598μs
//
// Performance Improvements from Original to Final:
// - Stack.push: 61% faster (21.568μs → 8.477μs)
// - Stack.pop: 28% faster (19.028μs → 13.795μs)
// - Stack.peek: 48% faster (20.004μs → 10.315μs)
// - Stack.peekAt: 62% faster (16.039μs → 6.064μs)
// - Stack.swap: 60% faster (19.567μs → 7.829μs)
// - Stack.dup: 52% faster (19.243μs → 9.149μs)
//
// The optimizations include:
// 1. Replacing dynamic allocation with fixed-width array
// 2. Marking critical functions as inline to reduce function call overhead
// 3. Caching computed positions in swap and dup operations
// 4. Using unsafe operations internally after bounds checking
///////////////////////////////////////////////////////////////////////////////

// Global allocator for benchmarks
var gpa = std.heap.GeneralPurposeAllocator(.{}){};
const allocator = gpa.allocator();

// Constants for benchmark setup
const STACK_OPERATIONS = 1000; // Number of operations to perform in each benchmark
const MAX_DUP_DEPTH = 16; // Maximum depth for dup operations (Ethereum has dup1-dup16)
const MAX_SWAP_DEPTH = 16; // Maximum depth for swap operations (Ethereum has swap1-swap16)

// Benchmark: push
fn benchPush(bench_allocator: std.mem.Allocator) void {
    var stack = Stack.create(bench_allocator) catch @panic("Failed to create stack");
    defer stack.destroy();

    // Push values to the stack
    for (0..STACK_OPERATIONS) |i| {
        stack.push(@intCast(i)) catch @panic("Stack overflow");
    }
}

// Benchmark: pop
fn benchPop(bench_allocator: std.mem.Allocator) void {
    var stack = Stack.create(bench_allocator) catch @panic("Failed to create stack");
    defer stack.destroy();

    // Prepare stack with values
    for (0..STACK_OPERATIONS) |i| {
        stack.push(@intCast(i)) catch @panic("Stack overflow");
    }

    // Pop values from the stack
    for (0..STACK_OPERATIONS) |_| {
        _ = stack.pop() catch @panic("Stack underflow");
    }
}

// Benchmark: peek
fn benchPeek(bench_allocator: std.mem.Allocator) void {
    var stack = Stack.create(bench_allocator) catch @panic("Failed to create stack");
    defer stack.destroy();

    // Prepare stack with values
    for (0..STACK_OPERATIONS) |i| {
        stack.push(@intCast(i)) catch @panic("Stack overflow");
    }

    // Peek at the top value multiple times
    for (0..STACK_OPERATIONS) |_| {
        _ = stack.peek() catch @panic("Stack underflow");
    }
}

// Benchmark: peekAt
fn benchPeekAt(bench_allocator: std.mem.Allocator) void {
    var stack = Stack.create(bench_allocator) catch @panic("Failed to create stack");
    defer stack.destroy();

    // Prepare stack with more values than we'll peek at
    for (0..MAX_SWAP_DEPTH + 10) |i| {
        stack.push(@intCast(i)) catch @panic("Stack overflow");
    }

    // Peek at different depths within the stack
    for (0..STACK_OPERATIONS) |i| {
        const depth = i % MAX_SWAP_DEPTH;
        _ = stack.peekAt(depth) catch @panic("Stack underflow");
    }
}

// Benchmark: swap
fn benchSwap(bench_allocator: std.mem.Allocator) void {
    var stack = Stack.create(bench_allocator) catch @panic("Failed to create stack");
    defer stack.destroy();

    // Prepare stack with values
    for (0..MAX_SWAP_DEPTH + 10) |i| {
        stack.push(@intCast(i)) catch @panic("Stack overflow");
    }

    // Perform swap operations at different depths
    for (0..STACK_OPERATIONS) |i| {
        const depth = (i % MAX_SWAP_DEPTH) + 1; // swap depths are 1-16, not 0-15
        stack.swap(depth) catch @panic("Stack underflow");
    }
}

// Benchmark: dup
fn benchDup(bench_allocator: std.mem.Allocator) void {
    var stack = Stack.create(bench_allocator) catch @panic("Failed to create stack");
    defer stack.destroy();

    // Prepare stack with initial values
    for (0..MAX_DUP_DEPTH + 1) |i| {
        stack.push(@intCast(i)) catch @panic("Stack overflow");
    }

    // Keep the stack from getting too large by popping occasionally
    var op_count: usize = 0;
    while (op_count < STACK_OPERATIONS) : (op_count += 1) {
        // Pop if stack is getting too large
        if (stack.size > 900) {
            for (0..400) |_| {
                _ = stack.pop() catch @panic("Stack underflow");
            }
        }

        const depth = op_count % MAX_DUP_DEPTH;
        stack.dup(depth) catch @panic("Stack operation failed");
    }
}

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();

    var bench = zbench.Benchmark.init(allocator, .{
        .iterations = 1000, // Run each benchmark 1000 times for good measurement
    });
    defer {
        bench.deinit();
        const deinit_status = gpa.deinit();
        if (deinit_status == .leak) std.debug.panic("Memory leak detected", .{});
    }

    // Add basic operations benchmarks
    try bench.add("Stack.push", benchPush, .{});
    try bench.add("Stack.pop", benchPop, .{});
    
    // Add peek operations benchmarks
    try bench.add("Stack.peek", benchPeek, .{});
    try bench.add("Stack.peekAt", benchPeekAt, .{});
    
    // Add swap and dup operations benchmarks
    try bench.add("Stack.swap", benchSwap, .{});
    try bench.add("Stack.dup", benchDup, .{});

    try stdout.writeAll("\n== Stack Benchmarks (Fully Optimized Implementation) ==\n\n");
    try bench.run(stdout);
}