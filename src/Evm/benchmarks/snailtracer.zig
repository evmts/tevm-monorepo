const std = @import("std");
const evm = @import("evm");
const Evm = evm.Evm;
const Interpreter = evm.Interpreter;
const Contract = evm.Contract;
const createContract = evm.createContract;
const address = @import("address");
const Address = address.Address;
const StateManager = @import("state_manager").StateManager;

// SnailTracer is a complex contract that exercises many EVM features
// It's commonly used for benchmarking EVM implementations
// See: https://github.com/ethereum/tests/tree/develop/GeneralStateTests/stExample

/// SnailTracer bytecode - this is a simplified version for demonstration
/// The full SnailTracer contract is much larger and exercises more opcodes
const SNAILTRACER_BYTECODE = [_]u8{
    // PUSH1 0x60
    0x60, 0x60,
    // PUSH1 0x40
    0x60, 0x40,
    // MSTORE
    0x52,
    // PUSH1 0x00
    0x60, 0x00,
    // DUP1
    0x80,
    // REVERT
    0xFD,
};

pub const SnailTracerBenchmark = struct {
    evm: *Evm,
    interpreter: *Interpreter,
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) !SnailTracerBenchmark {
        // Create EVM instance
        var evm_instance = try allocator.create(Evm);
        evm_instance.* = try Evm.init(null);
        
        // Initialize precompiles
        try evm_instance.initPrecompiles(allocator);
        
        // Create state manager with default options
        const StateOptions = @import("state_manager").StateOptions;
        const state_options = StateOptions{};
        const state_manager = try StateManager.init(allocator, state_options);
        evm_instance.setStateManager(state_manager);
        
        // Create interpreter
        const interpreter = try allocator.create(Interpreter);
        interpreter.* = try Interpreter.init(allocator, evm_instance);
        
        return SnailTracerBenchmark{
            .evm = evm_instance,
            .interpreter = interpreter,
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *SnailTracerBenchmark) void {
        // Clean up precompiles
        if (self.evm.precompiles) |contracts| {
            contracts.deinit();
            self.allocator.destroy(contracts);
        }
        
        // Clean up state manager
        if (self.evm.state_manager) |sm| {
            sm.deinit();
            self.allocator.destroy(sm);
        }
        
        // Clean up interpreter and evm
        // JumpTable doesn't need deinit - it's stack allocated
        self.allocator.destroy(self.interpreter);
        self.allocator.destroy(self.evm);
    }
    
    /// Run a single iteration of the benchmark
    pub fn runIteration(self: *SnailTracerBenchmark) !void {
        // Create contract
        const caller = address.addressFromHex("0x1234567890123456789012345678901234567890".*);
        const contract_addr = address.addressFromHex("0x2345678901234567890123456789012345678901".*);
        
        var contract = createContract(
            contract_addr,
            caller,
            0, // value
            1_000_000 // gas
        );
        contract.code = &SNAILTRACER_BYTECODE;
        
        // Run the contract
        _ = try self.interpreter.run(&contract, &[_]u8{}, false);
    }
    
    /// Run the benchmark for a specified number of iterations
    pub fn run(self: *SnailTracerBenchmark, iterations: u32) !void {
        const start = std.time.nanoTimestamp();
        
        var i: u32 = 0;
        while (i < iterations) : (i += 1) {
            try self.runIteration();
        }
        
        const end = std.time.nanoTimestamp();
        const elapsed_ns = @as(u64, @intCast(end - start));
        const elapsed_ms = @as(f64, @floatFromInt(elapsed_ns)) / 1_000_000.0;
        const ns_per_iteration = elapsed_ns / iterations;
        
        std.debug.print("SnailTracer Benchmark Results:\n", .{});
        std.debug.print("  Iterations: {}\n", .{iterations});
        std.debug.print("  Total time: {d:.2} ms\n", .{elapsed_ms});
        std.debug.print("  Time per iteration: {} ns\n", .{ns_per_iteration});
        std.debug.print("  Iterations per second: {d:.0}\n", .{1_000_000_000.0 / @as(f64, @floatFromInt(ns_per_iteration))});
    }
};

test "SnailTracer benchmark" {
    const allocator = std.testing.allocator;
    
    var benchmark = try SnailTracerBenchmark.init(allocator);
    defer benchmark.deinit();
    
    // Run a small number of iterations for testing
    try benchmark.run(100);
}

/// Main entry point for running the benchmark
pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    var benchmark = try SnailTracerBenchmark.init(allocator);
    defer benchmark.deinit();
    
    // Run benchmark with different iteration counts
    std.debug.print("\n=== Running SnailTracer Benchmark ===\n\n", .{});
    
    // Warmup
    std.debug.print("Warming up...\n", .{});
    try benchmark.run(100);
    
    // Actual benchmarks
    std.debug.print("\nBenchmark runs:\n", .{});
    try benchmark.run(1000);
    try benchmark.run(10000);
    try benchmark.run(100000);
}