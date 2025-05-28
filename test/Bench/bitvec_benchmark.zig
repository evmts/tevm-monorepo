/// BitVec Benchmark Suite
/// 
/// Performance targets based on reference implementations:
/// - BitVec operations: <10ns per operation
/// - Bytecode analysis: <1µs per KB of bytecode
/// - Serialization: <100ns per KB

const std = @import("std");
const BitVec = @import("evm").BitVec;
const constants = @import("evm").constants;
const analyzeCode = @import("evm").analyzeCode;
const analyzeJumpdests = @import("evm").analyzeJumpdests;
const analyzeBytecode = @import("evm").analyzeBytecode;
const analyzeWithPadding = @import("evm").analyzeWithPadding;

pub const BitVecBenchmark = struct {
    allocator: std.mem.Allocator,
    timer: std.time.Timer,
    
    pub fn init(allocator: std.mem.Allocator) !BitVecBenchmark {
        return BitVecBenchmark{
            .allocator = allocator,
            .timer = try std.time.Timer.start(),
        };
    }
    
    /// Benchmark basic bit operations
    /// Target: <10ns per operation
    pub fn benchmarkBitOperations(self: *BitVecBenchmark) !void {
        const iterations = 100_000;
        const sizes = [_]usize{ 100, 1000, 10_000, 24_576 };
        
        std.debug.print("\n=== BitVec Operation Benchmarks ===\n", .{});
        
        for (sizes) |size| {
            var bv = try BitVec.init(self.allocator, size);
            defer bv.deinit(self.allocator);
            
            // Pre-populate some bits
            var i: usize = 0;
            while (i < size) : (i += 7) {
                bv.set(i);
            }
            
            const test_index = size / 2;
            
            // Benchmark set with bounds checking
            {
                var total_ns: u64 = 0;
                for (0..iterations) |_| {
                    self.timer.reset();
                    bv.set(test_index);
                    total_ns += self.timer.read();
                }
                const avg_ns = total_ns / iterations;
                std.debug.print("  BitVec.set (size={d}): {d}ns avg (target: <10ns)\n", .{ size, avg_ns });
            }
            
            // Benchmark setUnchecked
            {
                var total_ns: u64 = 0;
                for (0..iterations) |_| {
                    self.timer.reset();
                    bv.setUnchecked(test_index);
                    total_ns += self.timer.read();
                }
                const avg_ns = total_ns / iterations;
                std.debug.print("  BitVec.setUnchecked (size={d}): {d}ns avg (target: <5ns)\n", .{ size, avg_ns });
            }
            
            // Benchmark isSet with bounds checking
            {
                var total_ns: u64 = 0;
                for (0..iterations) |_| {
                    self.timer.reset();
                    _ = bv.isSet(test_index);
                    total_ns += self.timer.read();
                }
                const avg_ns = total_ns / iterations;
                std.debug.print("  BitVec.isSet (size={d}): {d}ns avg (target: <10ns)\n", .{ size, avg_ns });
            }
            
            // Benchmark isSetUnchecked
            {
                var total_ns: u64 = 0;
                for (0..iterations) |_| {
                    self.timer.reset();
                    _ = bv.isSetUnchecked(test_index);
                    total_ns += self.timer.read();
                }
                const avg_ns = total_ns / iterations;
                std.debug.print("  BitVec.isSetUnchecked (size={d}): {d}ns avg (target: <5ns)\n", .{ size, avg_ns });
            }
        }
    }
    
    /// Benchmark bytecode analysis
    /// Target: <1µs per KB of bytecode
    pub fn benchmarkBytecodeAnalysis(self: *BitVecBenchmark) !void {
        const iterations = 1000;
        const sizes = [_]usize{ 1024, 10_240, 24_576 }; // 1KB, 10KB, 24KB
        
        std.debug.print("\n=== Bytecode Analysis Benchmarks ===\n", .{});
        
        for (sizes) |size| {
            // Generate realistic bytecode
            var bytecode = try self.allocator.alloc(u8, size);
            defer self.allocator.free(bytecode);
            
            var j: usize = 0;
            while (j < size) {
                if (j % 10 == 0) {
                    bytecode[j] = constants.JUMPDEST;
                    j += 1;
                } else if (j % 5 == 0 and j + 2 < size) {
                    bytecode[j] = constants.PUSH1;
                    j += 1;
                    if (j < size) bytecode[j] = 0xFF;
                    j += 1;
                } else {
                    bytecode[j] = constants.ADD;
                    j += 1;
                }
            }
            
            // Benchmark analyzeCode
            {
                var total_ns: u64 = 0;
                for (0..iterations) |_| {
                    self.timer.reset();
                    var bitmap = try analyzeCode(self.allocator, bytecode);
                    const elapsed = self.timer.read();
                    bitmap.deinit(self.allocator);
                    total_ns += elapsed;
                }
                const avg_ns = total_ns / iterations;
                const ns_per_kb = avg_ns * 1024 / size;
                std.debug.print("  analyzeCode ({d}KB): {d}ns avg, {d}ns/KB (target: <1000ns/KB)\n", .{ 
                    size / 1024, avg_ns, ns_per_kb 
                });
            }
            
            // Benchmark analyzeJumpdests
            {
                var total_ns: u64 = 0;
                for (0..iterations) |_| {
                    self.timer.reset();
                    var jumpdests = try analyzeJumpdests(self.allocator, bytecode);
                    const elapsed = self.timer.read();
                    jumpdests.deinit(self.allocator);
                    total_ns += elapsed;
                }
                const avg_ns = total_ns / iterations;
                const ns_per_kb = avg_ns * 1024 / size;
                std.debug.print("  analyzeJumpdests ({d}KB): {d}ns avg, {d}ns/KB (target: <1000ns/KB)\n", .{ 
                    size / 1024, avg_ns, ns_per_kb 
                });
            }
            
            // Benchmark analyzeBytecode (combined)
            {
                var total_ns: u64 = 0;
                for (0..iterations) |_| {
                    self.timer.reset();
                    var analysis = try analyzeBytecode(self.allocator, bytecode);
                    const elapsed = self.timer.read();
                    analysis.deinit(self.allocator);
                    total_ns += elapsed;
                }
                const avg_ns = total_ns / iterations;
                const ns_per_kb = avg_ns * 1024 / size;
                std.debug.print("  analyzeBytecode ({d}KB): {d}ns avg, {d}ns/KB (target: <1500ns/KB)\n", .{ 
                    size / 1024, avg_ns, ns_per_kb 
                });
            }
            
            // Benchmark analyzeWithPadding
            {
                var total_ns: u64 = 0;
                for (0..iterations) |_| {
                    self.timer.reset();
                    var analysis = try analyzeWithPadding(self.allocator, bytecode);
                    const elapsed = self.timer.read();
                    analysis.deinit(self.allocator);
                    total_ns += elapsed;
                }
                const avg_ns = total_ns / iterations;
                const ns_per_kb = avg_ns * 1024 / size;
                std.debug.print("  analyzeWithPadding ({d}KB): {d}ns avg, {d}ns/KB (target: <1500ns/KB)\n", .{ 
                    size / 1024, avg_ns, ns_per_kb 
                });
            }
        }
    }
    
    /// Benchmark serialization and deserialization
    /// Target: <100ns per KB
    pub fn benchmarkSerialization(self: *BitVecBenchmark) !void {
        const iterations = 10_000;
        const sizes = [_]usize{ 1024 * 8, 10_240 * 8, 24_576 * 8 }; // bits
        
        std.debug.print("\n=== Serialization Benchmarks ===\n", .{});
        
        for (sizes) |size| {
            var bv = try BitVec.init(self.allocator, size);
            defer bv.deinit(self.allocator);
            
            // Set some bits in a pattern
            var i: usize = 0;
            while (i < size) : (i += 13) {
                bv.set(i);
            }
            
            // Benchmark serialization
            {
                var total_ns: u64 = 0;
                for (0..iterations) |_| {
                    self.timer.reset();
                    const bytes = bv.asSlice();
                    _ = bytes;
                    total_ns += self.timer.read();
                }
                const avg_ns = total_ns / iterations;
                const kb_size = size / (8 * 1024);
                const ns_per_kb = if (kb_size > 0) avg_ns / kb_size else avg_ns;
                std.debug.print("  asSlice ({d}KB): {d}ns avg, {d}ns/KB (target: <100ns/KB)\n", .{ 
                    kb_size, avg_ns, ns_per_kb 
                });
            }
            
            // Benchmark deserialization
            {
                const bytes = bv.asSlice();
                var total_ns: u64 = 0;
                for (0..iterations) |_| {
                    self.timer.reset();
                    var bv2 = try BitVec.fromBytes(self.allocator, bytes, size);
                    const elapsed = self.timer.read();
                    bv2.deinit(self.allocator);
                    total_ns += elapsed;
                }
                const avg_ns = total_ns / iterations;
                const kb_size = size / (8 * 1024);
                const ns_per_kb = if (kb_size > 0) avg_ns / kb_size else avg_ns;
                std.debug.print("  fromBytes ({d}KB): {d}ns avg, {d}ns/KB (target: <100ns/KB)\n", .{ 
                    kb_size, avg_ns, ns_per_kb 
                });
            }
        }
    }
    
    /// Benchmark special cases
    pub fn benchmarkSpecialCases(self: *BitVecBenchmark) !void {
        const iterations = 10_000;
        
        std.debug.print("\n=== Special Case Benchmarks ===\n", .{});
        
        // Empty bytecode
        {
            const empty_code = &[_]u8{};
            var total_ns: u64 = 0;
            for (0..iterations) |_| {
                self.timer.reset();
                var analysis = try analyzeWithPadding(self.allocator, empty_code);
                const elapsed = self.timer.read();
                analysis.deinit(self.allocator);
                total_ns += elapsed;
            }
            const avg_ns = total_ns / iterations;
            std.debug.print("  analyzeWithPadding (empty): {d}ns avg\n", .{avg_ns});
        }
        
        // Incomplete PUSH32
        {
            const incomplete_push = &[_]u8{ constants.PUSH32, 0x01 };
            var total_ns: u64 = 0;
            for (0..iterations) |_| {
                self.timer.reset();
                var analysis = try analyzeWithPadding(self.allocator, incomplete_push);
                const elapsed = self.timer.read();
                analysis.deinit(self.allocator);
                total_ns += elapsed;
            }
            const avg_ns = total_ns / iterations;
            std.debug.print("  analyzeWithPadding (incomplete PUSH32): {d}ns avg\n", .{avg_ns});
        }
        
        // All JUMPDESTs
        {
            const all_jumpdests = try self.allocator.alloc(u8, 1024);
            defer self.allocator.free(all_jumpdests);
            @memset(all_jumpdests, constants.JUMPDEST);
            
            var total_ns: u64 = 0;
            for (0..iterations) |_| {
                self.timer.reset();
                var analysis = try analyzeJumpdests(self.allocator, all_jumpdests);
                const elapsed = self.timer.read();
                analysis.deinit(self.allocator);
                total_ns += elapsed;
            }
            const avg_ns = total_ns / iterations;
            std.debug.print("  analyzeJumpdests (all JUMPDESTs): {d}ns avg\n", .{avg_ns});
        }
    }
    
    pub fn runAll(self: *BitVecBenchmark) !void {
        try self.benchmarkBitOperations();
        try self.benchmarkBytecodeAnalysis();
        try self.benchmarkSerialization();
        try self.benchmarkSpecialCases();
    }
};

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    std.debug.print("\n=== BitVec Performance Benchmarks ===\n", .{});
    std.debug.print("Running benchmarks with ReleaseFast optimization...\n", .{});
    
    var benchmark = try BitVecBenchmark.init(allocator);
    try benchmark.runAll();
    
    std.debug.print("\n=== Benchmark Complete ===\n", .{});
}