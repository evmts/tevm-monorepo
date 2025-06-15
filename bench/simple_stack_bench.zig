const std = @import("std");
const zbench = @import("zbench");

// Simple stack implementation to benchmark stack operations
const SimpleStack = struct {
    const CAPACITY = 1024;
    data: [CAPACITY]u256 = [_]u256{0} ** CAPACITY,
    size: usize = 0,

    fn push(self: *SimpleStack, value: u256) bool {
        if (self.size >= CAPACITY) return false;
        self.data[self.size] = value;
        self.size += 1;
        return true;
    }

    fn pop(self: *SimpleStack) ?u256 {
        if (self.size == 0) return null;
        self.size -= 1;
        const value = self.data[self.size];
        self.data[self.size] = 0; // Clear for security
        return value;
    }

    fn peek(self: *const SimpleStack) ?u256 {
        if (self.size == 0) return null;
        return self.data[self.size - 1];
    }

    fn swap(self: *SimpleStack, depth: usize) bool {
        if (self.size <= depth) return false;
        const top_idx = self.size - 1;
        const swap_idx = self.size - 1 - depth;
        const temp = self.data[top_idx];
        self.data[top_idx] = self.data[swap_idx];
        self.data[swap_idx] = temp;
        return true;
    }

    fn dup(self: *SimpleStack, depth: usize) bool {
        if (self.size <= depth or self.size >= CAPACITY) return false;
        const dup_idx = self.size - 1 - depth;
        const value = self.data[dup_idx];
        self.data[self.size] = value;
        self.size += 1;
        return true;
    }

    fn reset(self: *SimpleStack) void {
        self.size = 0;
        // Clear all data for security
        self.data = [_]u256{0} ** CAPACITY;
    }
};

// Benchmark stack push operations
fn benchmarkStackPush(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = SimpleStack{};
        
        // Push 10 values
        for (0..10) |i| {
            _ = stack.push(@intCast(i));
        }
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark stack pop operations
fn benchmarkStackPop(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = SimpleStack{};
        
        // Pre-populate with 10 values
        for (0..10) |i| {
            _ = stack.push(@intCast(i));
        }
        
        // Pop all values
        for (0..10) |_| {
            const value = stack.pop();
            std.mem.doNotOptimizeAway(value);
        }
    }
}

// Benchmark stack peek operations
fn benchmarkStackPeek(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = SimpleStack{};
        
        // Pre-populate with values
        for (0..10) |i| {
            _ = stack.push(@intCast(i));
        }
        
        // Peek at top
        for (0..100) |_| {
            const value = stack.peek();
            std.mem.doNotOptimizeAway(value);
        }
    }
}

// Benchmark stack swap operations (simulate SWAP1, SWAP2, etc.)
fn benchmarkStackSwap(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = SimpleStack{};
        
        // Pre-populate with values
        for (0..10) |i| {
            _ = stack.push(@intCast(i + 100));
        }
        
        // Perform swap operations at different depths
        for (1..6) |depth| {
            _ = stack.swap(depth);
        }
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark stack duplicate operations (simulate DUP1, DUP2, etc.)
fn benchmarkStackDup(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = SimpleStack{};
        
        // Pre-populate with values
        for (0..5) |i| {
            _ = stack.push(@intCast(i + 100));
        }
        
        // Perform duplicate operations at different depths
        for (0..5) |depth| {
            _ = stack.dup(depth);
        }
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark deep stack operations (DUP16, SWAP16)
fn benchmarkDeepStackOperations(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 500; // Lower iterations for deep operations
    
    for (0..iterations) |_| {
        var stack = SimpleStack{};
        
        // Fill stack to significant depth
        for (0..50) |i| {
            _ = stack.push(@intCast(i));
        }
        
        // Perform operations at various depths
        for (1..17) |depth| { // DUP1-DUP16 / SWAP1-SWAP16 range
            _ = stack.dup(depth - 1);
            _ = stack.pop(); // Clean up
            _ = stack.swap(depth - 1);
        }
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark stack reset operations
fn benchmarkStackReset(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = SimpleStack{};
        
        // Fill stack with values
        for (0..100) |i| {
            _ = stack.push(@intCast(i));
        }
        
        // Reset stack
        stack.reset();
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark mixed stack operations (realistic EVM workload)
fn benchmarkMixedStackOps(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 500;
    
    for (0..iterations) |_| {
        var stack = SimpleStack{};
        
        // Simulate typical EVM operations sequence
        _ = stack.push(100);       // PUSH1 100
        _ = stack.push(200);       // PUSH1 200  
        _ = stack.dup(0);          // DUP1
        _ = stack.push(50);        // PUSH1 50
        _ = stack.swap(2);         // SWAP3
        _ = stack.pop();           // POP
        _ = stack.dup(1);          // DUP2
        _ = stack.pop();           // POP
        _ = stack.pop();           // POP
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark stack overflow handling
fn benchmarkStackOverflow(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 100; // Lower iterations for expensive operation
    
    for (0..iterations) |_| {
        var stack = SimpleStack{};
        
        // Try to push beyond capacity
        for (0..1030) |i| { // Beyond 1024 capacity
            if (!stack.push(@intCast(i))) {
                break; // Overflow handled
            }
        }
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

// Benchmark memory usage patterns
fn benchmarkMemoryPattern(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |_| {
        var stack = SimpleStack{};
        
        // Pattern: push many, pop many (like function calls)
        for (0..20) |i| {
            _ = stack.push(@intCast(i * 0x123456789ABCDEF));
        }
        
        for (0..20) |_| {
            _ = stack.pop();
        }
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Simple Stack Operations Benchmarks\n", .{});
    try stdout.print("===================================\n\n", .{});

    var bench = zbench.Benchmark.init(std.heap.page_allocator, .{});
    defer bench.deinit();

    // Basic stack operation benchmarks
    try bench.add("Stack Push", benchmarkStackPush, .{});
    try bench.add("Stack Pop", benchmarkStackPop, .{});
    try bench.add("Stack Peek", benchmarkStackPeek, .{});

    // EVM-specific stack operations
    try bench.add("Stack Swap (SWAP1-5)", benchmarkStackSwap, .{});
    try bench.add("Stack Dup (DUP1-5)", benchmarkStackDup, .{});
    try bench.add("Deep Stack Operations", benchmarkDeepStackOperations, .{});

    // Utility operations
    try bench.add("Stack Reset", benchmarkStackReset, .{});
    try bench.add("Mixed Stack Operations", benchmarkMixedStackOps, .{});
    try bench.add("Stack Overflow Handling", benchmarkStackOverflow, .{});
    try bench.add("Memory Access Patterns", benchmarkMemoryPattern, .{});

    // Run benchmarks
    try stdout.print("Running benchmarks...\n\n", .{});
    try bench.run(stdout);
}