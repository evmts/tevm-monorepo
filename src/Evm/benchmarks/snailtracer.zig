const std = @import("std");
const zbench = @import("zbench");
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

/// SnailTracer benchmark context
const SnailTracerContext = struct {
    allocator: std.mem.Allocator,
    evm: *Evm,
    interpreter: *Interpreter,
    state_manager: ?StateManager,
    
    pub fn init(allocator: std.mem.Allocator) !SnailTracerContext {
        // Create EVM instance
        var evm_instance = try allocator.create(Evm);
        evm_instance.* = try Evm.init(null);
        
        // Initialize precompiles
        try evm_instance.initPrecompiles(allocator);
        
        // Create state manager with default options
        const state_manager = try StateManager.init(allocator, .{});
        evm_instance.setStateManager(state_manager);
        
        // Create interpreter
        const interpreter = try allocator.create(Interpreter);
        interpreter.* = try Interpreter.init(allocator, evm_instance);
        
        return SnailTracerContext{
            .allocator = allocator,
            .evm = evm_instance,
            .interpreter = interpreter,
            .state_manager = state_manager,
        };
    }
    
    pub fn deinit(self: *SnailTracerContext) void {
        // Clean up precompiles
        if (self.evm.precompiles) |contracts| {
            contracts.deinit();
            self.allocator.destroy(contracts);
        }
        
        // Clean up state manager
        if (self.state_manager) |sm| {
            sm.deinit();
        }
        
        // Clean up interpreter and evm
        self.allocator.destroy(self.interpreter);
        self.allocator.destroy(self.evm);
    }
    
    /// Run a single iteration of the benchmark
    pub fn runIteration(self: *SnailTracerContext) !void {
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
};

/// zbench benchmark function for SnailTracer
fn benchmarkSnailTracer(allocator: std.mem.Allocator) void {
    var ctx = SnailTracerContext.init(allocator) catch {
        std.debug.panic("Failed to initialize SnailTracer context", .{});
    };
    defer ctx.deinit();
    
    ctx.runIteration() catch {
        std.debug.panic("Failed to run SnailTracer iteration", .{});
    };
}

test "SnailTracer benchmark with zbench" {
    var bench = zbench.Benchmark.init(std.testing.allocator, .{
        .iterations = 100, // Run a small number of iterations for testing
    });
    defer bench.deinit();
    
    try bench.add("SnailTracer", benchmarkSnailTracer, .{});
    
    try bench.run(std.io.getStdOut().writer());
}

/// Main entry point for running the benchmark
pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    std.debug.print("\n=== Running SnailTracer Benchmark ===\n\n", .{});
    
    // Warmup run
    {
        var bench = zbench.Benchmark.init(allocator, .{
            .iterations = 100,
        });
        defer bench.deinit();
        
        std.debug.print("Warming up...\n", .{});
        try bench.add("SnailTracer Warmup", benchmarkSnailTracer, .{});
        try bench.run(std.io.getStdOut().writer());
    }
    
    // Actual benchmark runs with different configurations
    std.debug.print("\nBenchmark runs:\n", .{});
    
    // Run with default settings (automatic iterations)
    {
        var bench = zbench.Benchmark.init(allocator, .{});
        defer bench.deinit();
        
        try bench.add("SnailTracer", benchmarkSnailTracer, .{});
        try bench.run(std.io.getStdOut().writer());
    }
}