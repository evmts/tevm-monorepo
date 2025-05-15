const std = @import("std");
const evm = @import("evm.zig");
const frame = @import("frame.zig");
const address = @import("Address");
const benchmark = @import("../Utils/benchmark.zig");

// Sample bytecode for benchmarking
const simple_push_add = [_]u8{
    0x60, 0x01, // PUSH1 1
    0x60, 0x02, // PUSH1 2
    0x01,       // ADD
    0x60, 0x01, // PUSH1 1
    0x01,       // ADD
    0x00,       // STOP
};

const loop_code = [_]u8{
    0x60, 0x00, // PUSH1 0 (counter)
    0x60, 0xff, // PUSH1 255 (max)
    0x5b,       // JUMPDEST
    0x80,       // DUP1 (duplicate counter)
    0x11,       // GT (counter > max?)
    0x60, 0x0e, // PUSH1 14 (exit address)
    0x57,       // JUMPI (conditional jump to exit)
    0x60, 0x01, // PUSH1 1
    0x01,       // ADD (increment counter)
    0x60, 0x02, // PUSH1 2 (jumpdest address)
    0x56,       // JUMP (back to loop start)
    0x5b,       // JUMPDEST (exit)
    0x00,       // STOP
};

const memory_code = [_]u8{
    0x60, 0x00, // PUSH1 0 (memory offset)
    0x60, 0x20, // PUSH1 32 (size)
    0x60, 0xff, // PUSH1 0xff (value to store)
    0x60, 0x00, // PUSH1 0 (target offset)
    0x52,       // MSTORE
    0x60, 0x00, // PUSH1 0 (offset)
    0x60, 0x20, // PUSH1 32 (size)
    0x60, 0x00, // PUSH1 0 (dest offset)
    0x59,       // MSIZE (get current memory size)
    0x51,       // MLOAD (load from memory)
    0x00,       // STOP
};

const storage_code = [_]u8{
    0x60, 0x01, // PUSH1 1 (value)
    0x60, 0x00, // PUSH1 0 (key)
    0x55,       // SSTORE
    0x60, 0x00, // PUSH1 0 (key)
    0x54,       // SLOAD
    0x00,       // STOP
};

pub fn main() !void {
    // Setup allocator
    var general_purpose_allocator = std.heap.GeneralPurposeAllocator(.{}){};
    const gpa = general_purpose_allocator.allocator();
    defer _ = general_purpose_allocator.deinit();

    // Create state manager (mock for benchmarking)
    var state_manager = frame.StateManager{};

    // Setup EVM
    var vm = evm.Evm.init(gpa, &state_manager);

    // Setup benchmark runner
    var bench_runner = try benchmark.Benchmark.init(gpa, .{
        .warmup_iterations = 3,
        .iterations = 20,
        .print_results = true,
    });

    // Benchmark simple operations
    std.debug.print("\n--- EVM Benchmarks ---\n", .{});

    try runEvmBenchmark(
        &bench_runner, 
        &vm, 
        &simple_push_add, 
        "Simple (PUSH, ADD)",
    );

    try runEvmBenchmark(
        &bench_runner, 
        &vm, 
        &loop_code, 
        "Loop (255 iterations)",
    );

    try runEvmBenchmark(
        &bench_runner, 
        &vm, 
        &memory_code, 
        "Memory operations",
    );

    try runEvmBenchmark(
        &bench_runner, 
        &vm, 
        &storage_code, 
        "Storage operations",
    );

    // Compare all operations
    const funcs = [_]struct { name: []const u8, func: benchmark.BenchmarkFn }{
        .{ .name = "Simple (PUSH, ADD)", .func = createBenchmarkFn(&vm, &simple_push_add) },
        .{ .name = "Loop (255 iterations)", .func = createBenchmarkFn(&vm, &loop_code) },
        .{ .name = "Memory operations", .func = createBenchmarkFn(&vm, &memory_code) },
        .{ .name = "Storage operations", .func = createBenchmarkFn(&vm, &storage_code) },
    };

    try bench_runner.compare("EVM Operations", &funcs);
}

// Helper to create a benchmark function for a specific bytecode
fn createBenchmarkFn(vm: *evm.Evm, code: []const u8) benchmark.BenchmarkFn {
    const BenchContext = struct {
        vm: *evm.Evm,
        code: []const u8,
        
        fn run() void {
            // Setup state manager to return our test code
            @This().vm.stateManager.mockCode = @This().code;

            // Create a simple call input
            const input = frame.FrameInput{
                .Call = .{
                    .callData = &[_]u8{},
                    .gasLimit = 100000,
                    .target = address.ZERO_ADDRESS,
                    .codeAddress = address.ZERO_ADDRESS,
                    .caller = address.ZERO_ADDRESS,
                    .value = 0,
                    .callType = .Call,
                    .isStatic = false,
                },
            };

            // Execute the EVM (ignore result for benchmark)
            _ = @This().vm.execute(input) catch {};
            std.mem.doNotOptimizeAway({});
        }
    };

    return BenchContext{ .vm = vm, .code = code }.run;
}

// Run a specific EVM benchmark
fn runEvmBenchmark(
    bench_runner: *benchmark.Benchmark,
    vm: *evm.Evm,
    code: []const u8,
    name: []const u8,
) !void {
    const bench_fn = createBenchmarkFn(vm, code);
    const result = try bench_runner.run(name, bench_fn);
    defer result.deinit();

    // Calculate instructions per second
    const instr_per_ns = @as(f64, @floatFromInt(code.len)) / @as(f64, @floatFromInt(result.median()));
    const instr_per_sec = instr_per_ns * 1_000_000_000;

    std.debug.print("{s}: ~{d:.2} bytecode instructions/sec\n", .{name, instr_per_sec});
}