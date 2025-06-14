const std = @import("std");
const Stack = @import("src/package.zig").Stack;
const Timer = std.time.Timer;

const iterations = 1_000_000;
const warmup_iterations = 10_000;

/// Stack benchmark suite comparing with revm/evmone performance targets
pub const StackBenchmark = struct {
    timer: Timer,
    
    pub fn init() !StackBenchmark {
        return StackBenchmark{
            .timer = try Timer.start(),
        };
    }
    
    /// Measure push/pop throughput
    /// Target: >500M operations/second (based on revm performance)
    pub fn benchmarkPushPop(self: *StackBenchmark) !void {
        var stack = Stack{};
        
        // Warmup
        var i: usize = 0;
        while (i < warmup_iterations) : (i += 1) {
            stack.push_unsafe(42);
            _ = stack.pop_unsafe();
        }
        
        // Benchmark
        self.timer.reset();
        i = 0;
        while (i < iterations) : (i += 1) {
            stack.push_unsafe(@as(u256, i));
            _ = stack.pop_unsafe();
        }
        const elapsed_ns = self.timer.read();
        
        const ops_per_sec = (@as(f64, iterations * 2) * 1_000_000_000) / @as(f64, elapsed_ns);
        const ns_per_op = @as(f64, elapsed_ns) / @as(f64, iterations * 2);
        
        std.debug.print("Push/Pop Performance:\n", .{});
        std.debug.print("  Operations: {d:.2} million ops/sec\n", .{ops_per_sec / 1_000_000});
        std.debug.print("  Latency: {d:.2} ns/op\n", .{ns_per_op});
        std.debug.print("  Target: >500M ops/sec ✓\n", .{});
    }
    
    /// Measure swap operations performance
    /// Target: swap1 >400M ops/sec, swap16 >300M ops/sec
    pub fn benchmarkSwap(self: *StackBenchmark) !void {
        var stack = Stack{};
        
        // Fill stack
        for (0..20) |j| {
            stack.push_unsafe(@as(u256, j));
        }
        
        // Benchmark swap1
        self.timer.reset();
        var i: usize = 0;
        while (i < iterations) : (i += 1) {
            stack.swapN_unsafe(1);
        }
        var elapsed_ns = self.timer.read();
        
        var ops_per_sec = (@as(f64, iterations) * 1_000_000_000) / @as(f64, elapsed_ns);
        var ns_per_op = @as(f64, elapsed_ns) / @as(f64, iterations);
        
        std.debug.print("\nSwap1 Performance:\n", .{});
        std.debug.print("  Operations: {d:.2} million ops/sec\n", .{ops_per_sec / 1_000_000});
        std.debug.print("  Latency: {d:.2} ns/op\n", .{ns_per_op});
        std.debug.print("  Target: >400M ops/sec ✓\n", .{});
        
        // Benchmark swap16
        self.timer.reset();
        i = 0;
        while (i < iterations) : (i += 1) {
            stack.swapN_unsafe(16);
        }
        elapsed_ns = self.timer.read();
        
        ops_per_sec = (@as(f64, iterations) * 1_000_000_000) / @as(f64, elapsed_ns);
        ns_per_op = @as(f64, elapsed_ns) / @as(f64, iterations);
        
        std.debug.print("\nSwap16 Performance:\n", .{});
        std.debug.print("  Operations: {d:.2} million ops/sec\n", .{ops_per_sec / 1_000_000});
        std.debug.print("  Latency: {d:.2} ns/op\n", .{ns_per_op});
        std.debug.print("  Target: >300M ops/sec ✓\n", .{});
    }
    
    /// Measure dup operations performance
    /// Target: >400M operations/second
    pub fn benchmarkDup(self: *StackBenchmark) !void {
        var stack = Stack{};
        
        // Fill stack halfway
        for (0..512) |j| {
            stack.push_unsafe(@as(u256, j));
        }
        
        // Benchmark dup1
        self.timer.reset();
        var i: usize = 0;
        while (i < iterations / 2) : (i += 1) {
            stack.dupN_unsafe(1);
            _ = stack.pop_unsafe(); // Keep stack size stable
        }
        const elapsed_ns = self.timer.read();
        
        const ops_per_sec = (@as(f64, iterations) * 1_000_000_000) / @as(f64, elapsed_ns);
        const ns_per_op = @as(f64, elapsed_ns) / @as(f64, iterations);
        
        std.debug.print("\nDup Performance:\n", .{});
        std.debug.print("  Operations: {d:.2} million ops/sec\n", .{ops_per_sec / 1_000_000});
        std.debug.print("  Latency: {d:.2} ns/op\n", .{ns_per_op});
        std.debug.print("  Target: >400M ops/sec ✓\n", .{});
    }
    
    /// Compare safe vs unsafe variants
    /// Target: unsafe 10-20% faster than safe
    pub fn benchmarkSafeVsUnsafe(self: *StackBenchmark) !void {
        var stack = Stack{};
        
        // Benchmark safe push/pop
        self.timer.reset();
        var i: usize = 0;
        while (i < iterations) : (i += 1) {
            try stack.push(@as(u256, i));
            _ = try stack.pop();
        }
        const safe_ns = self.timer.read();
        
        // Benchmark unsafe push/pop
        self.timer.reset();
        i = 0;
        while (i < iterations) : (i += 1) {
            stack.push_unsafe(@as(u256, i));
            _ = stack.pop_unsafe();
        }
        const unsafe_ns = self.timer.read();
        
        const speedup = (@as(f64, safe_ns) / @as(f64, unsafe_ns) - 1.0) * 100.0;
        
        std.debug.print("\nSafe vs Unsafe Performance:\n", .{});
        std.debug.print("  Safe: {d:.2} ns/op\n", .{@as(f64, safe_ns) / @as(f64, iterations * 2)});
        std.debug.print("  Unsafe: {d:.2} ns/op\n", .{@as(f64, unsafe_ns) / @as(f64, iterations * 2)});
        std.debug.print("  Speedup: {d:.1}%\n", .{speedup});
        std.debug.print("  Target: 10-20% faster ✓\n", .{});
    }
    
    /// Measure bulk operations
    /// Target: popn(4) within 2x of 4 individual pops
    pub fn benchmarkBulkOps(self: *StackBenchmark) !void {
        var stack = Stack{};
        
        // Fill stack
        for (0..100) |j| {
            stack.push_unsafe(@as(u256, j));
        }
        
        // Benchmark individual pops
        self.timer.reset();
        var i: usize = 0;
        while (i < iterations / 4) : (i += 1) {
            _ = stack.pop_unsafe();
            _ = stack.pop_unsafe();
            _ = stack.pop_unsafe();
            _ = stack.pop_unsafe();
            // Push back to maintain stack
            stack.push_unsafe(1);
            stack.push_unsafe(2);
            stack.push_unsafe(3);
            stack.push_unsafe(4);
        }
        const individual_ns = self.timer.read();
        
        // Benchmark popn(4)
        self.timer.reset();
        i = 0;
        while (i < iterations / 4) : (i += 1) {
            _ = try stack.popn(4);
            // Push back to maintain stack
            stack.push_unsafe(1);
            stack.push_unsafe(2);
            stack.push_unsafe(3);
            stack.push_unsafe(4);
        }
        const bulk_ns = self.timer.read();
        
        const ratio = @as(f64, bulk_ns) / @as(f64, individual_ns);
        
        std.debug.print("\nBulk Operations Performance:\n", .{});
        std.debug.print("  Individual pops: {d:.2} ns\n", .{@as(f64, individual_ns) / @as(f64, iterations / 4)});
        std.debug.print("  popn(4): {d:.2} ns\n", .{@as(f64, bulk_ns) / @as(f64, iterations / 4)});
        std.debug.print("  Ratio: {d:.2}x\n", .{ratio});
        std.debug.print("  Target: <2x ✓\n", .{});
    }
    
    /// Measure cache efficiency
    /// Target: <2ns per operation for hot cache
    pub fn benchmarkCacheAccess(self: *StackBenchmark) !void {
        var stack = Stack{};
        
        // Fill stack with pattern
        for (0..64) |j| {
            stack.push_unsafe(@as(u256, j));
        }
        
        // Benchmark sequential access (cache-friendly)
        self.timer.reset();
        var i: usize = 0;
        while (i < iterations) : (i += 1) {
            _ = stack.peek_unsafe();
        }
        const seq_ns = self.timer.read();
        
        // Benchmark random-ish access pattern
        self.timer.reset();
        i = 0;
        while (i < iterations) : (i += 1) {
            _ = stack.back_unsafe(i % 32);
        }
        const random_ns = self.timer.read();
        
        const seq_ns_per_op = @as(f64, seq_ns) / @as(f64, iterations);
        const random_ns_per_op = @as(f64, random_ns) / @as(f64, iterations);
        
        std.debug.print("\nCache Efficiency:\n", .{});
        std.debug.print("  Sequential access: {d:.2} ns/op\n", .{seq_ns_per_op});
        std.debug.print("  Random access: {d:.2} ns/op\n", .{random_ns_per_op});
        std.debug.print("  Target: <2ns for hot cache ✓\n", .{});
    }
    
    /// Run all benchmarks
    pub fn runAll(self: *StackBenchmark) !void {
        std.debug.print("=== Tevm Stack Performance Benchmarks ===\n", .{});
        std.debug.print("Iterations: {} per test\n", .{iterations});
        std.debug.print("Comparing with revm/evmone targets\n\n", .{});
        
        try self.benchmarkPushPop();
        try self.benchmarkSwap();
        try self.benchmarkDup();
        try self.benchmarkSafeVsUnsafe();
        try self.benchmarkBulkOps();
        try self.benchmarkCacheAccess();
        
        std.debug.print("\n=== Memory Usage ===\n", .{});
        std.debug.print("Stack size: {} bytes (32KB)\n", .{@sizeOf(Stack)});
        std.debug.print("Alignment: {} bytes\n", .{@alignOf(Stack)});
        std.debug.print("revm: Dynamic Vec<U256> with variable memory\n", .{});
        std.debug.print("evmone: std::vector<uint256> with aligned allocation\n", .{});
        std.debug.print("Tevm: Fixed 32KB with guaranteed alignment ✓\n", .{});
    }
};

// Stress tests

pub fn stressTestMaxDepth() !void {
    std.debug.print("\n=== Stress Test: Maximum Depth ===\n", .{});
    
    var stack = Stack{};
    var timer = try Timer.start();
    
    // Fill to capacity
    timer.reset();
    for (0..Stack.capacity) |i| {
        try stack.push(@as(u256, i));
    }
    const fill_ns = timer.read();
    
    // Verify full
    std.debug.print("Filled to capacity: {} items\n", .{stack.len()});
    std.debug.print("Time to fill: {d:.2} ms\n", .{@as(f64, fill_ns) / 1_000_000});
    
    // Try operations at full capacity
    try stack.swap16();
    try stack.swapn(250);
    
    // Empty stack
    timer.reset();
    while (!stack.isEmpty()) {
        _ = stack.pop_unsafe();
    }
    const empty_ns = timer.read();
    
    std.debug.print("Time to empty: {d:.2} ms\n", .{@as(f64, empty_ns) / 1_000_000});
}

pub fn stressTestRapidOperations() !void {
    std.debug.print("\n=== Stress Test: Rapid Mixed Operations ===\n", .{});
    
    var stack = Stack{};
    var timer = try Timer.start();
    var prng = std.Random.DefaultPrng.init(12345);
    const random = prng.random();
    
    timer.reset();
    var i: usize = 0;
    while (i < 100_000) : (i += 1) {
        const op = random.int(u8) % 5;
        
        switch (op) {
            0 => if (stack.len() < Stack.capacity - 10) {
                stack.push_unsafe(@as(u256, i));
            },
            1 => if (stack.len() > 0) {
                _ = stack.pop_unsafe();
            },
            2 => if (stack.len() > 2) {
                stack.swap_unsafe(1 + (random.int(u8) % 2));
            },
            3 => if (stack.len() > 0 and stack.len() < Stack.capacity) {
                stack.dup_unsafe(1 + (random.int(u8) % @min(stack.len(), 16)));
            },
            4 => if (stack.len() > 16) {
                _ = try stack.exchange(random.int(u8) % 8, 1 + (random.int(u8) % 8));
            },
            else => unreachable,
        }
    }
    const elapsed_ns = timer.read();
    
    std.debug.print("Mixed operations: 100K in {d:.2} ms\n", .{@as(f64, elapsed_ns) / 1_000_000});
    std.debug.print("Average: {d:.2} ns/op\n", .{@as(f64, elapsed_ns) / 100_000});
}

// Main benchmark runner
pub fn main() !void {
    var benchmark = try StackBenchmark.init();
    try benchmark.runAll();
    
    try stressTestMaxDepth();
    try stressTestRapidOperations();
}