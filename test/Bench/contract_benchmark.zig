const std = @import("std");
const Contract = @import("evm").Contract;
const constants = @import("evm").constants;
const Timer = std.time.Timer;

/// Benchmark configuration
const ITERATIONS = 100_000;
const WARMUP_ITERATIONS = 1000;

/// Generate realistic bytecode with multiple JUMPDESTs
fn generateBytecode(allocator: std.mem.Allocator, size: usize, jumpdest_count: usize) ![]u8 {
    var code = try allocator.alloc(u8, size);
    var rng = std.rand.DefaultPrng.init(@intCast(u64, std.time.timestamp()));
    const random = rng.random();
    
    // Fill with random opcodes
    for (code, 0..) |*byte, i| {
        byte.* = random.intRangeAtMost(u8, 0x00, 0xFE);
    }
    
    // Place JUMPDESTs at regular intervals
    if (jumpdest_count > 0) {
        const interval = size / jumpdest_count;
        var i: usize = 0;
        while (i < jumpdest_count and i * interval < size) : (i += 1) {
            code[i * interval] = constants.JUMPDEST;
        }
    }
    
    // Add some PUSH instructions with data
    var pos: usize = 0;
    while (pos + 5 < size) : (pos += 50) {
        code[pos] = constants.PUSH4;
        // Next 4 bytes are push data
        pos += 5;
    }
    
    return code;
}

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    var timer = try Timer.start();
    
    std.debug.print("Contract Benchmark\n", .{});
    std.debug.print("==================\n\n", .{});
    
    // Benchmark 1: Contract initialization
    {
        std.debug.print("1. Contract initialization:\n", .{});
        
        const code = try generateBytecode(allocator, 1024, 10);
        defer allocator.free(code);
        
        // Warmup
        for (0..WARMUP_ITERATIONS) |_| {
            _ = Contract.init(
                [_]u8{0xaa} ** 20,
                [_]u8{0xbb} ** 20,
                1000,
                21000,
                code,
                [_]u8{0xcc} ** 32,
                &[_]u8{},
                false,
            );
        }
        
        // Benchmark
        timer.reset();
        for (0..ITERATIONS) |_| {
            _ = Contract.init(
                [_]u8{0xaa} ** 20,
                [_]u8{0xbb} ** 20,
                1000,
                21000,
                code,
                [_]u8{0xcc} ** 32,
                &[_]u8{},
                false,
            );
        }
        const init_time = timer.read();
        
        std.debug.print("   Time per init: {} ns\n", .{init_time / ITERATIONS});
        std.debug.print("   Inits per second: {d:.0}\n\n", .{1e9 / (@intToFloat(f64, init_time) / ITERATIONS)});
    }
    
    // Benchmark 2: JUMPDEST validation (small contract)
    {
        std.debug.print("2. JUMPDEST validation (1KB contract, 10 JUMPDESTs):\n", .{});
        
        const code = try generateBytecode(allocator, 1024, 10);
        defer allocator.free(code);
        
        var contract = Contract.init(
            [_]u8{0} ** 20,
            [_]u8{0} ** 20,
            0,
            21000,
            code,
            [_]u8{0x12} ** 32,
            &[_]u8{},
            false,
        );
        
        // Force analysis
        _ = contract.validJumpdest(0);
        
        // Warmup
        for (0..WARMUP_ITERATIONS) |_| {
            _ = contract.validJumpdest(512);
        }
        
        // Benchmark valid JUMPDEST lookup
        timer.reset();
        for (0..ITERATIONS) |_| {
            _ = contract.validJumpdest(500); // Middle of contract
        }
        const valid_time = timer.read();
        
        std.debug.print("   Time per valid JUMPDEST check: {} ns\n", .{valid_time / ITERATIONS});
        std.debug.print("   Checks per second: {d:.0}\n\n", .{1e9 / (@intToFloat(f64, valid_time) / ITERATIONS)});
    }
    
    // Benchmark 3: JUMPDEST validation (large contract)
    {
        std.debug.print("3. JUMPDEST validation (24KB contract, 100 JUMPDESTs):\n", .{});
        
        const code = try generateBytecode(allocator, 24576, 100);
        defer allocator.free(code);
        
        var contract = Contract.init(
            [_]u8{0} ** 20,
            [_]u8{0} ** 20,
            0,
            21000,
            code,
            [_]u8{0x34} ** 32,
            &[_]u8{},
            false,
        );
        
        // Force analysis
        _ = contract.validJumpdest(0);
        
        // Warmup
        for (0..WARMUP_ITERATIONS) |_| {
            _ = contract.validJumpdest(12288);
        }
        
        // Benchmark
        timer.reset();
        for (0..ITERATIONS) |_| {
            _ = contract.validJumpdest(12288); // Middle of contract
        }
        const large_time = timer.read();
        
        std.debug.print("   Time per valid JUMPDEST check: {} ns\n", .{large_time / ITERATIONS});
        std.debug.print("   Checks per second: {d:.0}\n\n", .{1e9 / (@intToFloat(f64, large_time) / ITERATIONS)});
    }
    
    // Benchmark 4: Gas operations
    {
        std.debug.print("4. Gas operations:\n", .{});
        
        var contract = Contract.init(
            [_]u8{0} ** 20,
            [_]u8{0} ** 20,
            0,
            1_000_000,
            &[_]u8{},
            [_]u8{0} ** 32,
            &[_]u8{},
            false,
        );
        
        // Warmup
        for (0..WARMUP_ITERATIONS) |_| {
            _ = contract.useGas(100);
            contract.gas = 1_000_000; // Reset
        }
        
        // Benchmark useGas
        timer.reset();
        for (0..ITERATIONS) |_| {
            _ = contract.useGas(100);
            contract.gas = 1_000_000; // Reset
        }
        const use_gas_time = timer.read();
        
        std.debug.print("   Time per useGas: {} ns\n", .{use_gas_time / ITERATIONS});
        std.debug.print("   Operations per second: {d:.0}\n\n", .{1e9 / (@intToFloat(f64, use_gas_time) / ITERATIONS)});
    }
    
    // Benchmark 5: Storage access tracking
    {
        std.debug.print("5. Storage access tracking:\n", .{});
        
        var pool = Contract.StoragePool.init(allocator);
        defer pool.deinit();
        
        var contract = Contract.init(
            [_]u8{0} ** 20,
            [_]u8{0} ** 20,
            0,
            21000,
            &[_]u8{},
            [_]u8{0} ** 32,
            &[_]u8{},
            false,
        );
        defer contract.deinit(&pool);
        
        // Warmup
        for (0..WARMUP_ITERATIONS) |i| {
            _ = try contract.markStorageSlotWarm(@intCast(u128, i), &pool);
        }
        
        // Clear for benchmark
        contract.deinit(&pool);
        contract = Contract.init(
            [_]u8{0} ** 20,
            [_]u8{0} ** 20,
            0,
            21000,
            &[_]u8{},
            [_]u8{0} ** 32,
            &[_]u8{},
            false,
        );
        
        // Benchmark cold slot access
        timer.reset();
        for (0..1000) |i| { // Fewer iterations due to allocation
            _ = try contract.markStorageSlotWarm(@intCast(u128, i * 100), &pool);
        }
        const cold_time = timer.read();
        
        std.debug.print("   Time per cold slot marking: {} ns\n", .{cold_time / 1000});
        
        // Benchmark warm slot access
        timer.reset();
        for (0..ITERATIONS) |_| {
            _ = try contract.markStorageSlotWarm(500, &pool); // Already warm
        }
        const warm_time = timer.read();
        
        std.debug.print("   Time per warm slot check: {} ns\n", .{warm_time / ITERATIONS});
        std.debug.print("   Warm checks per second: {d:.0}\n\n", .{1e9 / (@intToFloat(f64, warm_time) / ITERATIONS)});
    }
    
    // Benchmark 6: getOp performance
    {
        std.debug.print("6. Opcode access (getOp):\n", .{});
        
        const code = try generateBytecode(allocator, 1024, 0);
        defer allocator.free(code);
        
        const contract = Contract.init(
            [_]u8{0} ** 20,
            [_]u8{0} ** 20,
            0,
            21000,
            code,
            [_]u8{0} ** 32,
            &[_]u8{},
            false,
        );
        
        // Warmup
        for (0..WARMUP_ITERATIONS) |_| {
            _ = contract.getOp(512);
        }
        
        // Benchmark with bounds checking
        timer.reset();
        var sum: u64 = 0;
        for (0..ITERATIONS) |i| {
            sum +%= contract.getOp(i % 1024);
        }
        const getop_time = timer.read();
        
        std.debug.print("   Time per getOp: {} ns\n", .{getop_time / ITERATIONS});
        std.debug.print("   Operations per second: {d:.0}\n", .{1e9 / (@intToFloat(f64, getop_time) / ITERATIONS)});
        
        // Benchmark without bounds checking
        timer.reset();
        sum = 0;
        for (0..ITERATIONS) |i| {
            sum +%= contract.getOpUnchecked(i % 1024);
        }
        const getop_unchecked_time = timer.read();
        
        std.debug.print("   Time per getOpUnchecked: {} ns\n", .{getop_unchecked_time / ITERATIONS});
        std.debug.print("   Operations per second: {d:.0}\n", .{1e9 / (@intToFloat(f64, getop_unchecked_time) / ITERATIONS)});
        std.debug.print("   Speedup: {d:.1}x\n\n", .{@intToFloat(f64, getop_time) / @intToFloat(f64, getop_unchecked_time)});
        
        _ = sum; // Use sum to prevent optimization
    }
    
    // Benchmark 7: Analysis caching effectiveness
    {
        std.debug.print("7. Code analysis caching:\n", .{});
        
        const code = try generateBytecode(allocator, 4096, 50);
        defer allocator.free(code);
        
        // Clear cache
        Contract.clearAnalysisCache();
        
        // First analysis (cold)
        timer.reset();
        var contract1 = Contract.init(
            [_]u8{0} ** 20,
            [_]u8{0} ** 20,
            0,
            21000,
            code,
            [_]u8{0x56} ** 32,
            &[_]u8{},
            false,
        );
        _ = contract1.validJumpdest(2048); // Force analysis
        const cold_analysis_time = timer.read();
        
        // Second analysis (cached)
        timer.reset();
        var contract2 = Contract.init(
            [_]u8{0} ** 20,
            [_]u8{0} ** 20,
            0,
            21000,
            code,
            [_]u8{0x56} ** 32, // Same hash
            &[_]u8{},
            false,
        );
        _ = contract2.validJumpdest(2048); // Should use cache
        const cached_analysis_time = timer.read();
        
        std.debug.print("   Cold analysis time: {} µs\n", .{cold_analysis_time / 1000});
        std.debug.print("   Cached analysis time: {} µs\n", .{cached_analysis_time / 1000});
        std.debug.print("   Cache speedup: {d:.1}x\n\n", .{@intToFloat(f64, cold_analysis_time) / @intToFloat(f64, cached_analysis_time)});
    }
    
    std.debug.print("Benchmark complete!\n", .{});
}