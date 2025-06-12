const std = @import("std");
const zbench = @import("zbench");
const Stack = @import("evm").Stack;

// Benchmark stack push operations (safe version)
fn benchmarkStackPushSafe(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Push 10 values
        for (0..10) |i| {
            stack.append(@intCast(i)) catch break;
        }
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark stack push operations (unsafe version)
fn benchmarkStackPushUnsafe(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Push 10 values
        for (0..10) |i| {
            stack.append_unsafe(@intCast(i));
        }
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark stack pop operations (safe version)
fn benchmarkStackPopSafe(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Pre-populate with 10 values
        for (0..10) |i| {
            stack.append_unsafe(@intCast(i));
        }
        
        // Pop all values
        for (0..10) |_| {
            const value = stack.pop() catch break;
            std.mem.doNotOptimizeAway(value);
        }
    }
}

// Benchmark stack pop operations (unsafe version)
fn benchmarkStackPopUnsafe(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Pre-populate with 10 values
        for (0..10) |i| {
            stack.append_unsafe(@intCast(i));
        }
        
        // Pop all values
        for (0..10) |_| {
            const value = stack.pop_unsafe();
            std.mem.doNotOptimizeAway(value);
        }
    }
}

// Benchmark stack peek operations
fn benchmarkStackPeek(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Pre-populate with values
        for (0..10) |i| {
            stack.append_unsafe(@intCast(i));
        }
        
        // Peek at various positions
        for (0..10) |_| {
            const value = stack.peek_unsafe().*;
            std.mem.doNotOptimizeAway(value);
        }
    }
}

// Benchmark stack swap operations (simulate SWAP1)
fn benchmarkStackSwap(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Pre-populate with values
        for (0..10) |i| {
            stack.append_unsafe(@intCast(i + 100));
        }
        
        // Perform swap operations
        for (0..5) |_| {
            stack.swap_unsafe(1);
        }
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark stack duplicate operations (simulate DUP1)
fn benchmarkStackDup(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Pre-populate with values
        for (0..5) |i| {
            stack.append_unsafe(@intCast(i + 100));
        }
        
        // Perform duplicate operations
        for (0..5) |_| {
            stack.dup_unsafe(1);
        }
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark deep stack operations
fn benchmarkDeepStackOperations(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 100; // Lower iterations for deep operations
    
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Fill stack to significant depth
        for (0..100) |i| {
            stack.append_unsafe(@intCast(i));
        }
        
        // Perform operations at various depths
        for (0..10) |i| {
            const depth = i % 16 + 1; // DUP1-DUP16 range
            stack.dup_unsafe(@intCast(depth));
            stack.pop_unsafe(); // Clean up
        }
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark stack reset operations
fn benchmarkStackReset(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Fill stack with values
        for (0..50) |i| {
            stack.append_unsafe(@intCast(i));
        }
        
        // Reset stack
        stack.reset();
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark mixed stack operations (realistic workload)
fn benchmarkMixedStackOps(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 500;
    
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Simulate typical EVM operations sequence
        stack.append_unsafe(100);  // PUSH
        stack.append_unsafe(200);  // PUSH
        stack.dup_unsafe(1);       // DUP1
        stack.append_unsafe(50);   // PUSH
        stack.swap_unsafe(2);      // SWAP2
        _ = stack.pop_unsafe();    // POP
        stack.dup_unsafe(2);       // DUP2
        _ = stack.pop_unsafe();    // POP
        _ = stack.pop_unsafe();    // POP
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark stack bounds checking overhead
fn benchmarkStackBoundsChecking(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Push values with bounds checking
        for (0..10) |i| {
            stack.append(@intCast(i)) catch break;
        }
        
        // Pop values with bounds checking  
        for (0..10) |_| {
            const value = stack.pop() catch break;
            std.mem.doNotOptimizeAway(value);
        }
    }
}

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Stack Operations Benchmarks\n", .{});
    try stdout.print("============================\n\n", .{});

    var bench = zbench.Benchmark.init(std.heap.page_allocator, .{});
    defer bench.deinit();

    // Basic stack operation benchmarks
    try bench.add("Stack Push (Safe)", benchmarkStackPushSafe, .{});
    try bench.add("Stack Push (Unsafe)", benchmarkStackPushUnsafe, .{});
    try bench.add("Stack Pop (Safe)", benchmarkStackPopSafe, .{});
    try bench.add("Stack Pop (Unsafe)", benchmarkStackPopUnsafe, .{});
    try bench.add("Stack Peek", benchmarkStackPeek, .{});

    // EVM-specific stack operations
    try bench.add("Stack Swap (SWAP1)", benchmarkStackSwap, .{});
    try bench.add("Stack Dup (DUP1)", benchmarkStackDup, .{});
    try bench.add("Deep Stack Operations", benchmarkDeepStackOperations, .{});

    // Utility operations
    try bench.add("Stack Reset", benchmarkStackReset, .{});
    try bench.add("Mixed Stack Operations", benchmarkMixedStackOps, .{});
    try bench.add("Stack Bounds Checking", benchmarkStackBoundsChecking, .{});

    // Run benchmarks
    try stdout.print("Running benchmarks...\n\n", .{});
    try bench.run(stdout);
}