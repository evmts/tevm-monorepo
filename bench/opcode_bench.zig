const std = @import("std");
const zbench = @import("zbench");
const evm_root = @import("evm");
const Address = @import("Address");

// Import EVM components
const evm = evm_root.evm;
const Stack = evm.Stack;
const Memory = evm.Memory;

// Benchmark arithmetic operations directly on stack
fn benchmarkArithmeticAdd(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Pre-populate stack with test values
        stack.append_unsafe(100);
        stack.append_unsafe(200);
        
        // Perform ADD operation manually: pop two values, add, push result
        const b = stack.pop_unsafe();
        const a = stack.pop_unsafe();
        const result = a +% b; // Wrapping addition like EVM
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

fn benchmarkArithmeticMul(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(123);
        stack.append_unsafe(456);
        
        const b = stack.pop_unsafe();
        const a = stack.pop_unsafe();
        const result = a *% b; // Wrapping multiplication like EVM
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

fn benchmarkArithmeticDiv(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(1000000);
        stack.append_unsafe(456);
        
        const b = stack.pop_unsafe();
        const a = stack.pop_unsafe();
        const result = if (b == 0) 0 else a / b; // EVM div by zero behavior
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

fn benchmarkArithmeticMod(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(1000000);
        stack.append_unsafe(456);
        
        const b = stack.pop_unsafe();
        const a = stack.pop_unsafe();
        const result = if (b == 0) 0 else a % b; // EVM mod by zero behavior
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

fn benchmarkArithmeticSub(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(1000);
        stack.append_unsafe(300);
        
        const b = stack.pop_unsafe();
        const a = stack.pop_unsafe();
        const result = a -% b; // Wrapping subtraction like EVM
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

// Benchmark bitwise operations
fn benchmarkBitwiseAnd(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(0xFF00FF00FF00FF00);
        stack.append_unsafe(0x00FF00FF00FF00FF);
        
        const b = stack.pop_unsafe();
        const a = stack.pop_unsafe();
        const result = a & b;
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

fn benchmarkBitwiseOr(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(0xFF00FF00FF00FF00);
        stack.append_unsafe(0x00FF00FF00FF00FF);
        
        const b = stack.pop_unsafe();
        const a = stack.pop_unsafe();
        const result = a | b;
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

fn benchmarkBitwiseXor(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(0xFF00FF00FF00FF00);
        stack.append_unsafe(0x00FF00FF00FF00FF);
        
        const b = stack.pop_unsafe();
        const a = stack.pop_unsafe();
        const result = a ^ b;
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

fn benchmarkBitwiseNot(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(0xFF00FF00FF00FF00);
        
        const a = stack.pop_unsafe();
        const result = ~a;
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

// Benchmark comparison operations
fn benchmarkComparisonLt(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(100);
        stack.append_unsafe(200);
        
        const b = stack.pop_unsafe();
        const a = stack.pop_unsafe();
        const result: u256 = if (a < b) 1 else 0;
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

fn benchmarkComparisonGt(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(200);
        stack.append_unsafe(100);
        
        const b = stack.pop_unsafe();
        const a = stack.pop_unsafe();
        const result: u256 = if (a > b) 1 else 0;
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

fn benchmarkComparisonEq(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(200);
        stack.append_unsafe(200);
        
        const b = stack.pop_unsafe();
        const a = stack.pop_unsafe();
        const result: u256 = if (a == b) 1 else 0;
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

fn benchmarkComparisonIsZero(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(0);
        
        const a = stack.pop_unsafe();
        const result: u256 = if (a == 0) 1 else 0;
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

// Benchmark stack operations
fn benchmarkStackDup1(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(12345);
        
        // DUP1: duplicate top stack item
        const top = stack.peek_unsafe().*;
        stack.append_unsafe(top);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
        _ = stack.pop_unsafe(); // Clean up duplicated value
    }
}

fn benchmarkStackSwap1(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(12345);
        stack.append_unsafe(67890);
        
        // SWAP1: swap top two stack items
        const top = stack.pop_unsafe();
        const second = stack.pop_unsafe();
        stack.append_unsafe(top);
        stack.append_unsafe(second);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

fn benchmarkStackPop(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(12345);
        
        // POP: remove top stack item
        _ = stack.pop_unsafe();
        
        std.mem.doNotOptimizeAway(&stack);
    }
}

fn benchmarkStackPush(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // PUSH: add value to stack
        stack.append_unsafe(0xDEADBEEF);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

// Benchmark memory operations
fn benchmarkMemoryExpansion(allocator: std.mem.Allocator) void {
    const iterations = 1000;
    for (0..iterations) |_| {
        var memory = Memory.init_default(allocator) catch return;
        memory.finalize_root();
        defer memory.deinit();
        
        // Simulate memory expansion by ensuring capacity for offset 64
        _ = memory.ensure_context_capacity(96) catch return; // 64 + 32 bytes
        
        // Convert u256 to big-endian bytes for storage
        const value: u256 = 0xDEADBEEFCAFEBABE;
        var bytes: [32]u8 = [_]u8{0} ** 32;
        var temp_value = value;
        var i: usize = 32;
        while (i > 0) {
            i -= 1;
            bytes[i] = @truncate(temp_value);
            temp_value >>= 8;
        }
        
        memory.set_data(64, &bytes) catch return;
        const result = memory.get_u256(64) catch return;
        
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkMemoryStoreLoad(allocator: std.mem.Allocator) void {
    const iterations = 1000;
    for (0..iterations) |_| {
        var memory = Memory.init_default(allocator) catch return;
        memory.finalize_root();
        defer memory.deinit();
        
        // Ensure capacity for offset 0
        _ = memory.ensure_context_capacity(32) catch return;
        
        // Convert u256 to big-endian bytes for storage
        const value: u256 = 0x123456789ABCDEF0;
        var bytes: [32]u8 = [_]u8{0} ** 32;
        var temp_value = value;
        var i: usize = 32;
        while (i > 0) {
            i -= 1;
            bytes[i] = @truncate(temp_value);
            temp_value >>= 8;
        }
        
        memory.set_data(0, &bytes) catch return;
        const result = memory.get_u256(0) catch return;
        
        std.mem.doNotOptimizeAway(result);
    }
}

// Benchmark 256-bit arithmetic
fn benchmarkLargeNumberArithmetic(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 500;
    const large_num1: u256 = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    const large_num2: u256 = 0x8000000000000000000000000000000000000000000000000000000000000000;
    
    for (0..iterations) |_| {
        var stack = Stack{};
        
        stack.append_unsafe(large_num1);
        stack.append_unsafe(large_num2);
        
        const b = stack.pop_unsafe();
        const a = stack.pop_unsafe();
        const result = a *% b; // Large number multiplication
        stack.append_unsafe(result);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

// Benchmark mixed operations (realistic workload)
fn benchmarkMixedOperations(allocator: std.mem.Allocator) void {
    _ = allocator;
    
    const iterations = 200;
    for (0..iterations) |_| {
        var stack = Stack{};
        
        // Sequence: PUSH 10, PUSH 20, ADD, DUP1, PUSH 5, MUL, SWAP1, SUB
        stack.append_unsafe(10);
        stack.append_unsafe(20);
        
        // ADD
        const b1 = stack.pop_unsafe();
        const a1 = stack.pop_unsafe();
        stack.append_unsafe(a1 +% b1);
        
        // DUP1
        const top = stack.peek_unsafe().*;
        stack.append_unsafe(top);
        
        // PUSH 5
        stack.append_unsafe(5);
        
        // MUL
        const b2 = stack.pop_unsafe();
        const a2 = stack.pop_unsafe();
        stack.append_unsafe(a2 *% b2);
        
        // SWAP1
        const top2 = stack.pop_unsafe();
        const second = stack.pop_unsafe();
        stack.append_unsafe(top2);
        stack.append_unsafe(second);
        
        // SUB
        const b3 = stack.pop_unsafe();
        const a3 = stack.pop_unsafe();
        stack.append_unsafe(a3 -% b3);
        
        std.mem.doNotOptimizeAway(stack.peek_unsafe().*);
    }
}

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Opcode Benchmarks\n", .{});
    try stdout.print("===================\n\n", .{});

    var bench = zbench.Benchmark.init(std.heap.page_allocator, .{});
    defer bench.deinit();

    // Arithmetic operation benchmarks
    try bench.add("Arithmetic ADD", benchmarkArithmeticAdd, .{});
    try bench.add("Arithmetic MUL", benchmarkArithmeticMul, .{});
    try bench.add("Arithmetic DIV", benchmarkArithmeticDiv, .{});
    try bench.add("Arithmetic MOD", benchmarkArithmeticMod, .{});
    try bench.add("Arithmetic SUB", benchmarkArithmeticSub, .{});

    // Bitwise operation benchmarks
    try bench.add("Bitwise AND", benchmarkBitwiseAnd, .{});
    try bench.add("Bitwise OR", benchmarkBitwiseOr, .{});
    try bench.add("Bitwise XOR", benchmarkBitwiseXor, .{});
    try bench.add("Bitwise NOT", benchmarkBitwiseNot, .{});

    // Comparison operation benchmarks
    try bench.add("Comparison LT", benchmarkComparisonLt, .{});
    try bench.add("Comparison GT", benchmarkComparisonGt, .{});
    try bench.add("Comparison EQ", benchmarkComparisonEq, .{});
    try bench.add("Comparison ISZERO", benchmarkComparisonIsZero, .{});

    // Stack operation benchmarks
    try bench.add("Stack DUP1", benchmarkStackDup1, .{});
    try bench.add("Stack SWAP1", benchmarkStackSwap1, .{});
    try bench.add("Stack POP", benchmarkStackPop, .{});
    try bench.add("Stack PUSH", benchmarkStackPush, .{});

    // Memory operation benchmarks
    try bench.add("Memory Expansion", benchmarkMemoryExpansion, .{});
    try bench.add("Memory Store/Load", benchmarkMemoryStoreLoad, .{});

    // Complex operation benchmarks
    try bench.add("Large Number Arithmetic", benchmarkLargeNumberArithmetic, .{});
    try bench.add("Mixed Operations", benchmarkMixedOperations, .{});

    // Run benchmarks
    try stdout.print("Running benchmarks...\n\n", .{});
    try bench.run(stdout);
}