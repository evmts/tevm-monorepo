const std = @import("std");
const zbench = @import("zbench");
const Frame = @import("evm").Frame;
const Stack = @import("evm").Stack;
const Memory = @import("evm").Memory;
const Contract = @import("evm").Contract;
const Bytecode = @import("evm").Bytecode;
const Address = @import("Address");
const Operation = @import("evm").opcodes.Operation;

// Helper to create a mock frame for testing opcodes
fn create_mock_frame(allocator: std.mem.Allocator) !Frame {
    var frame = Frame.init_default(allocator) catch return error.OutOfMemory;
    
    // Initialize with a simple contract
    const bytecode = Bytecode.init(&[_]u8{0x60, 0x01, 0x60, 0x02, 0x01}, allocator) catch return error.OutOfMemory;
    frame.contract = Contract.init(
        Address.fromHex("0x1234567890123456789012345678901234567890") catch Address.zero(),
        Address.fromHex("0x1234567890123456789012345678901234567890") catch Address.zero(),
        Address.fromHex("0x1234567890123456789012345678901234567890") catch Address.zero(),
        0,
        bytecode,
        0,
        false,
        false,
    );
    
    return frame;
}

// Benchmark arithmetic operations
fn benchmarkArithmeticAdd(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    // Pre-populate stack with test values
    frame.stack.append(100) catch return;
    frame.stack.append(200) catch return;
    
    const iterations = 1000;
    for (0..iterations) |_| {
        // Reset stack state
        frame.stack.reset();
        frame.stack.append(100) catch return;
        frame.stack.append(200) catch return;
        
        // Execute ADD operation
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.arithmetic.op_add(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkArithmeticMul(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(123) catch return;
        frame.stack.append(456) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.arithmetic.op_mul(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkArithmeticDiv(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(1000000) catch return;
        frame.stack.append(456) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.arithmetic.op_div(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkArithmeticMod(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(1000000) catch return;
        frame.stack.append(456) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.arithmetic.op_mod(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkArithmeticSub(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(1000) catch return;
        frame.stack.append(300) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.arithmetic.op_sub(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

// Benchmark bitwise operations
fn benchmarkBitwiseAnd(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(0xFF00FF00FF00FF00) catch return;
        frame.stack.append(0x00FF00FF00FF00FF) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.bitwise.op_and(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkBitwiseOr(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(0xFF00FF00FF00FF00) catch return;
        frame.stack.append(0x00FF00FF00FF00FF) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.bitwise.op_or(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkBitwiseXor(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(0xFF00FF00FF00FF00) catch return;
        frame.stack.append(0x00FF00FF00FF00FF) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.bitwise.op_xor(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkBitwiseNot(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(0xFF00FF00FF00FF00) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.bitwise.op_not(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

// Benchmark comparison operations
fn benchmarkComparisonLt(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(100) catch return;
        frame.stack.append(200) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.comparison.op_lt(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkComparisonGt(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(200) catch return;
        frame.stack.append(100) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.comparison.op_gt(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkComparisonEq(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(200) catch return;
        frame.stack.append(200) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.comparison.op_eq(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkComparisonIsZero(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(0) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.comparison.op_iszero(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

// Benchmark stack operations (DUP, SWAP)
fn benchmarkStackDup1(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(12345) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.stack.op_dup1(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
        _ = frame.stack.pop() catch return; // Clean up duplicated value
    }
}

fn benchmarkStackSwap1(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(12345) catch return;
        frame.stack.append(67890) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.stack.op_swap1(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkStackPop(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(12345) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.stack.op_pop(0, &interpreter, state) catch return;
        
        std.mem.doNotOptimizeAway(&frame.stack);
    }
}

fn benchmarkStackPush1(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.stack.make_push(1)(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

// Benchmark complex arithmetic operations
fn benchmarkArithmeticAddMod(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(100) catch return;
        frame.stack.append(200) catch return;
        frame.stack.append(250) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.arithmetic.op_addmod(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

fn benchmarkArithmeticMulMod(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 1000;
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(123) catch return;
        frame.stack.append(456) catch return;
        frame.stack.append(1000) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.arithmetic.op_mulmod(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

// Benchmark 256-bit intensive operations
fn benchmarkLargeNumberArithmetic(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 500;
    const large_num1: u256 = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    const large_num2: u256 = 0x8000000000000000000000000000000000000000000000000000000000000000;
    
    for (0..iterations) |_| {
        frame.stack.reset();
        frame.stack.append(large_num1) catch return;
        frame.stack.append(large_num2) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        _ = @import("evm").execution.arithmetic.op_mul(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
    }
}

// Benchmark mixed operations (realistic workload)
fn benchmarkMixedOperations(allocator: std.mem.Allocator) void {
    var frame = create_mock_frame(allocator) catch return;
    defer frame.deinit();
    
    const iterations = 200;
    for (0..iterations) |_| {
        frame.stack.reset();
        
        // Sequence: PUSH 10, PUSH 20, ADD, DUP1, PUSH 5, MUL, SWAP1, SUB
        frame.stack.append(10) catch return;
        frame.stack.append(20) catch return;
        
        const state: *Operation.State = @ptrCast(&frame);
        const interpreter: Operation.Interpreter = undefined;
        
        // ADD
        _ = @import("evm").execution.arithmetic.op_add(0, &interpreter, state) catch return;
        
        // DUP1
        _ = @import("evm").execution.stack.op_dup1(0, &interpreter, state) catch return;
        
        // PUSH 5 (simulated)
        frame.stack.append(5) catch return;
        
        // MUL
        _ = @import("evm").execution.arithmetic.op_mul(0, &interpreter, state) catch return;
        
        // SWAP1
        _ = @import("evm").execution.stack.op_swap1(0, &interpreter, state) catch return;
        
        // SUB
        _ = @import("evm").execution.arithmetic.op_sub(0, &interpreter, state) catch return;
        
        const result = frame.stack.peek_unsafe().*;
        std.mem.doNotOptimizeAway(result);
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
    try bench.add("Arithmetic ADDMOD", benchmarkArithmeticAddMod, .{});
    try bench.add("Arithmetic MULMOD", benchmarkArithmeticMulMod, .{});

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
    try bench.add("Stack PUSH1", benchmarkStackPush1, .{});

    // Complex operation benchmarks
    try bench.add("Large Number Arithmetic", benchmarkLargeNumberArithmetic, .{});
    try bench.add("Mixed Operations", benchmarkMixedOperations, .{});

    // Run benchmarks
    try stdout.print("Running benchmarks...\n\n", .{});
    try bench.run(stdout);
}