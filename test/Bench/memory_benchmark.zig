const std = @import("std");
const Memory = @import("evm").Memory;

/// Memory benchmark suite comparing against baseline and targets
pub const MemoryBenchmark = struct {
    allocator: std.mem.Allocator,
    timer: std.time.Timer,
    
    pub fn init(allocator: std.mem.Allocator) !MemoryBenchmark {
        return MemoryBenchmark{
            .allocator = allocator,
            .timer = try std.time.Timer.start(),
        };
    }
    
    /// Measure memory expansion cost
    /// Target: <100ns for small expansions (<1KB)
    /// Target: <1µs for medium expansions (<1MB)
    pub fn benchmarkExpansion(self: *MemoryBenchmark) !void {
        const iterations = 1000;
        
        // Small expansion benchmark (<1KB)
        {
            var total_ns: u64 = 0;
            for (0..iterations) |_| {
                var mem = try Memory.init(self.allocator);
                defer mem.deinit();
                
                self.timer.reset();
                _ = try mem.ensureCapacity(512); // 512 bytes
                const elapsed = self.timer.read();
                total_ns += elapsed;
            }
            
            const avg_ns = total_ns / iterations;
            std.debug.print("Small expansion (<1KB): {d}ns avg (target: <100ns)\n", .{avg_ns});
            std.debug.assert(avg_ns < 100); // Target assertion
        }
        
        // Medium expansion benchmark (<1MB)
        {
            var total_ns: u64 = 0;
            for (0..iterations) |_| {
                var mem = try Memory.init(self.allocator);
                defer mem.deinit();
                
                self.timer.reset();
                _ = try mem.ensureCapacity(512 * 1024); // 512KB
                const elapsed = self.timer.read();
                total_ns += elapsed;
            }
            
            const avg_ns = total_ns / iterations;
            std.debug.print("Medium expansion (<1MB): {d}ns avg (target: <1000ns)\n", .{avg_ns});
            std.debug.assert(avg_ns < 1000); // Target assertion
        }
    }
    
    /// Measure word read/write throughput
    /// Target: >1GB/s throughput for sequential word access
    pub fn benchmarkWordOperations(self: *MemoryBenchmark) !void {
        var mem = try Memory.init(self.allocator);
        defer mem.deinit();
        
        const size_mb = 10;
        const size_bytes = size_mb * 1024 * 1024;
        const num_words = size_bytes / 32;
        
        // Pre-allocate memory
        try mem.resize(size_bytes);
        
        // Write benchmark
        {
            const word = [_]u8{0xFF} ** 32;
            self.timer.reset();
            
            for (0..num_words) |i| {
                try mem.setWord(i * 32, word);
            }
            
            const elapsed_ns = self.timer.read();
            const throughput_gbps = @as(f64, @floatFromInt(size_bytes)) / @as(f64, @floatFromInt(elapsed_ns));
            
            std.debug.print("Word write throughput: {d:.2} GB/s (target: >1GB/s)\n", .{throughput_gbps});
            std.debug.assert(throughput_gbps > 1.0); // Target assertion
        }
        
        // Read benchmark
        {
            self.timer.reset();
            
            for (0..num_words) |i| {
                _ = try mem.getWord(i * 32);
            }
            
            const elapsed_ns = self.timer.read();
            const throughput_gbps = @as(f64, @floatFromInt(size_bytes)) / @as(f64, @floatFromInt(elapsed_ns));
            
            std.debug.print("Word read throughput: {d:.2} GB/s (target: >1GB/s)\n", .{throughput_gbps});
            std.debug.assert(throughput_gbps > 1.0); // Target assertion
        }
    }
    
    /// Measure bulk copy performance
    /// Target: >5GB/s for large copies (>1MB)
    pub fn benchmarkCopy(self: *MemoryBenchmark) !void {
        var mem = try Memory.init(self.allocator);
        defer mem.deinit();
        
        const size_mb = 10;
        const size_bytes = size_mb * 1024 * 1024;
        
        // Pre-allocate memory
        try mem.resize(size_bytes * 2);
        
        // Initialize source data
        for (0..size_bytes) |i| {
            try mem.setByte(i, @truncate(i));
        }
        
        self.timer.reset();
        try mem.copy(size_bytes, 0, size_bytes);
        const elapsed_ns = self.timer.read();
        
        const throughput_gbps = @as(f64, @floatFromInt(size_bytes)) / @as(f64, @floatFromInt(elapsed_ns));
        
        std.debug.print("Bulk copy throughput: {d:.2} GB/s (target: >5GB/s)\n", .{throughput_gbps});
        std.debug.assert(throughput_gbps > 5.0); // Target assertion
    }
    
    /// Measure random access patterns
    /// Target: <50ns per word access
    pub fn benchmarkRandomAccess(self: *MemoryBenchmark) !void {
        var mem = try Memory.init(self.allocator);
        defer mem.deinit();
        
        const size_bytes = 10 * 1024 * 1024; // 10MB
        try mem.resize(size_bytes);
        
        const num_accesses = 10000;
        var prng = std.Random.DefaultPrng.init(12345);
        const rand = prng.random();
        
        // Generate random offsets
        const offsets = try self.allocator.alloc(usize, num_accesses);
        defer self.allocator.free(offsets);
        
        for (offsets) |*offset| {
            offset.* = rand.uintLessThan(usize, size_bytes / 32) * 32;
        }
        
        // Benchmark random reads
        self.timer.reset();
        for (offsets) |offset| {
            _ = try mem.getWord(offset);
        }
        const elapsed_ns = self.timer.read();
        
        const ns_per_access = elapsed_ns / num_accesses;
        std.debug.print("Random access latency: {d}ns per word (target: <50ns)\n", .{ns_per_access});
        std.debug.assert(ns_per_access < 50); // Target assertion
    }
    
    /// Compare against theoretical memcpy speed
    /// Target: Within 20% of raw memcpy for large operations
    pub fn benchmarkAgainstMemcpy(self: *MemoryBenchmark) !void {
        const size_mb = 10;
        const size_bytes = size_mb * 1024 * 1024;
        
        // Raw memcpy benchmark
        const src = try self.allocator.alloc(u8, size_bytes);
        defer self.allocator.free(src);
        const dst = try self.allocator.alloc(u8, size_bytes);
        defer self.allocator.free(dst);
        
        // Initialize source
        for (src, 0..) |*byte, i| {
            byte.* = @truncate(i);
        }
        
        self.timer.reset();
        @memcpy(dst, src);
        const memcpy_ns = self.timer.read();
        
        // Memory module copy benchmark
        var mem = try Memory.init(self.allocator);
        defer mem.deinit();
        
        try mem.resize(size_bytes * 2);
        try mem.setData(0, src);
        
        self.timer.reset();
        try mem.copy(size_bytes, 0, size_bytes);
        const memory_copy_ns = self.timer.read();
        
        const overhead_percent = (@as(f64, @floatFromInt(memory_copy_ns)) / @as(f64, @floatFromInt(memcpy_ns)) - 1.0) * 100.0;
        
        std.debug.print("Memory copy overhead vs memcpy: {d:.1}% (target: <20%)\n", .{overhead_percent});
        std.debug.assert(overhead_percent < 20.0); // Target assertion
    }
};

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    var benchmark = try MemoryBenchmark.init(allocator);
    
    std.debug.print("\n=== Memory Benchmark Suite ===\n\n", .{});
    
    try benchmark.benchmarkExpansion();
    std.debug.print("\n", .{});
    
    try benchmark.benchmarkWordOperations();
    std.debug.print("\n", .{});
    
    try benchmark.benchmarkCopy();
    std.debug.print("\n", .{});
    
    try benchmark.benchmarkRandomAccess();
    std.debug.print("\n", .{});
    
    try benchmark.benchmarkAgainstMemcpy();
    
    std.debug.print("\n=== All benchmarks completed ===\n", .{});
}

test "Memory benchmark tests" {
    var benchmark = try MemoryBenchmark.init(std.testing.allocator);
    
    // Run all benchmarks
    try benchmark.benchmarkExpansion();
    try benchmark.benchmarkWordOperations();
    try benchmark.benchmarkCopy();
    try benchmark.benchmarkRandomAccess();
    try benchmark.benchmarkAgainstMemcpy();
}