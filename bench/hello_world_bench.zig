const std = @import("std");
const zbench = @import("zbench");

// Simple function to benchmark
fn fibonacci(n: u32) u32 {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Benchmark fibonacci function
fn benchmarkFibonacci(allocator: std.mem.Allocator) void {
    _ = allocator;
    const result = fibonacci(20);
    std.mem.doNotOptimizeAway(result);
}

// Hello world string concatenation benchmark
fn benchmarkHelloWorld(allocator: std.mem.Allocator) void {
    const hello = "Hello, ";
    const world = "World!";
    const result = std.fmt.allocPrint(allocator, "{s}{s}", .{ hello, world }) catch return;
    defer allocator.free(result);
    std.mem.doNotOptimizeAway(result);
}

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Starting zBench Hello World Benchmarks\n", .{});

    var bench = zbench.Benchmark.init(std.heap.page_allocator, .{});
    defer bench.deinit();

    // Register benchmarks
    try bench.add("Fibonacci(20)", benchmarkFibonacci, .{});
    try bench.add("Hello World Concat", benchmarkHelloWorld, .{});

    // Run benchmarks
    try stdout.print("\nRunning benchmarks...\n", .{});
    try bench.run(stdout);
}