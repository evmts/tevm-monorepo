const std = @import("std");
const zbench = @import("zbench");

// Benchmark basic u256 arithmetic operations
fn benchmarkU256Add(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    const a: u256 = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0;
    const b: u256 = 0xFEDCBA0987654321FEDCBA0987654321FEDCBA0987654321FEDCBA0987654321;
    
    for (0..iterations) |_| {
        const result = a +% b;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkU256Mul(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    const a: u256 = 0x123456789ABCDEF;
    const b: u256 = 0xFEDCBA0987654321;
    
    for (0..iterations) |_| {
        const result = a *% b;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkU256Div(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    const a: u256 = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0;
    const b: u256 = 0x123456789ABCDEF;
    
    for (0..iterations) |_| {
        const result = if (b == 0) 0 else a / b;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkU256Mod(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    const a: u256 = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0;
    const b: u256 = 0x987654321;
    
    for (0..iterations) |_| {
        const result = if (b == 0) 0 else a % b;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkU256BitwiseAnd(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    const a: u256 = 0xFF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00;
    const b: u256 = 0x00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF;
    
    for (0..iterations) |_| {
        const result = a & b;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkU256BitwiseOr(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    const a: u256 = 0xFF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00;
    const b: u256 = 0x00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF;
    
    for (0..iterations) |_| {
        const result = a | b;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkU256BitwiseXor(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    const a: u256 = 0xFF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00;
    const b: u256 = 0x00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF00FF;
    
    for (0..iterations) |_| {
        const result = a ^ b;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkU256Comparison(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    const a: u256 = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0;
    const b: u256 = 0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF1;
    
    for (0..iterations) |_| {
        const result_lt = a < b;
        const result_eq = a == b;
        const result_gt = a > b;
        std.mem.doNotOptimizeAway(result_lt);
        std.mem.doNotOptimizeAway(result_eq);
        std.mem.doNotOptimizeAway(result_gt);
    }
}

fn benchmarkBinaryExponentiation(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 100; // Lower iterations for expensive operation
    const base: u256 = 3;
    const exp: u256 = 100;
    
    for (0..iterations) |_| {
        var result: u256 = 1;
        var b = base;
        var e = exp;
        
        while (e > 0) {
            if ((e & 1) == 1) {
                result *%= b;
            }
            b *%= b;
            e >>= 1;
        }
        
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkSignExtension(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    
    for (0..iterations) |i| {
        const byte_num: u8 = @intCast(i % 32);
        const x: u256 = @as(u256, 0x80) << @as(u8, @intCast(byte_num * 8));
        
        var result: u256 = undefined;
        
        if (byte_num >= 31) {
            result = x;
        } else {
            const sign_bit_pos = byte_num * 8 + 7;
            const sign_bit = (x >> @intCast(sign_bit_pos)) & 1;
            
            if (sign_bit == 1) {
                const mask = (@as(u256, 1) << @intCast(sign_bit_pos + 1)) - 1;
                const sign_extension = (~@as(u256, 0)) & (~mask);
                result = x | sign_extension;
            } else {
                const mask = (@as(u256, 1) << @intCast(sign_bit_pos + 1)) - 1;
                result = x & mask;
            }
        }
        
        std.mem.doNotOptimizeAway(result);
    }
}

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Simple Math Benchmarks\n", .{});
    try stdout.print("=======================\n\n", .{});

    var bench = zbench.Benchmark.init(std.heap.page_allocator, .{});
    defer bench.deinit();

    // Basic arithmetic benchmarks
    try bench.add("U256 Addition", benchmarkU256Add, .{});
    try bench.add("U256 Multiplication", benchmarkU256Mul, .{});
    try bench.add("U256 Division", benchmarkU256Div, .{});
    try bench.add("U256 Modulo", benchmarkU256Mod, .{});

    // Bitwise operation benchmarks
    try bench.add("U256 Bitwise AND", benchmarkU256BitwiseAnd, .{});
    try bench.add("U256 Bitwise OR", benchmarkU256BitwiseOr, .{});
    try bench.add("U256 Bitwise XOR", benchmarkU256BitwiseXor, .{});

    // Comparison benchmarks
    try bench.add("U256 Comparisons", benchmarkU256Comparison, .{});

    // Complex operation benchmarks
    try bench.add("Binary Exponentiation", benchmarkBinaryExponentiation, .{});
    try bench.add("Sign Extension", benchmarkSignExtension, .{});

    // Run benchmarks
    try stdout.print("Running benchmarks...\n\n", .{});
    try bench.run(stdout);
}