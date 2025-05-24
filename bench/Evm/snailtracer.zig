const std = @import("std");
const zbench = @import("zbench");
const evm = @import("evm");
const Evm = evm.Evm;
const Interpreter = evm.Interpreter;
const Contract = evm.Contract;
const createContract = evm.createContract;
const address = @import("address");
const Address = address.Address;
const StateManager = @import("StateManager").StateManager;
const compiler = @import("compiler");

// SnailTracer is a complex contract that exercises many EVM features
// It's commonly used for benchmarking EVM implementations
// This test compiles the real SnailTracer contract from source

// Global variable to store compiled bytecode
var SNAILTRACER_BYTECODE: []const u8 = undefined;
var SNAILTRACER_DEPLOYED_BYTECODE: []const u8 = undefined;

// Compile the SnailTracer contract
fn compileSnailTracer(allocator: std.mem.Allocator) !void {
    const settings = compiler.CompilerSettings{
        .optimizer_enabled = true,
        .optimizer_runs = 200,
        .output_abi = true,
        .output_bytecode = true,
        .output_deployed_bytecode = true,
    };

    // Read the SnailTracer source code
    const source_file = try std.fs.cwd().readFileAlloc(allocator, "src/Solidity/SnailTracer.sol", 1024 * 1024);
    defer allocator.free(source_file);

    // Compile the contract
    var result = try compiler.Compiler.compileSource(
        allocator,
        "SnailTracer.sol",
        source_file,
        settings,
    );
    defer result.deinit();

    if (result.errors.len > 0) {
        std.debug.print("Compilation errors:\n", .{});
        for (result.errors) |err| {
            std.debug.print("  - {s}\n", .{err.message});
        }
        return error.CompilationFailed;
    }

    // Find the SnailTracer contract
    for (result.contracts) |contract| {
        if (std.mem.eql(u8, contract.name, "SnailTracer")) {
            // Convert hex string to bytes
            SNAILTRACER_BYTECODE = try hexToBytes(allocator, contract.bytecode);
            SNAILTRACER_DEPLOYED_BYTECODE = try hexToBytes(allocator, contract.deployed_bytecode);
            std.debug.print("SnailTracer compiled successfully:\n", .{});
            std.debug.print("  - Bytecode length: {} bytes\n", .{SNAILTRACER_BYTECODE.len});
            std.debug.print("  - Deployed bytecode length: {} bytes\n", .{SNAILTRACER_DEPLOYED_BYTECODE.len});
            return;
        }
    }

    return error.SnailTracerNotFound;
}

// Convert hex string to bytes
fn hexToBytes(allocator: std.mem.Allocator, hex: []const u8) ![]u8 {
    // Skip "0x" prefix if present
    const start: usize = if (hex.len >= 2 and hex[0] == '0' and hex[1] == 'x') 2 else 0;
    const hex_without_prefix = hex[start..];
    
    if (hex_without_prefix.len % 2 != 0) {
        return error.InvalidHexLength;
    }
    
    const bytes = try allocator.alloc(u8, hex_without_prefix.len / 2);
    
    var i: usize = 0;
    while (i < hex_without_prefix.len) : (i += 2) {
        const byte_str = hex_without_prefix[i..i + 2];
        bytes[i / 2] = try std.fmt.parseInt(u8, byte_str, 16);
    }
    
    return bytes;
}

// SnailTracer benchmark context
const SnailTracerContext = struct {
    allocator: std.mem.Allocator,
    evm: *Evm,
    interpreter: *Interpreter,
    state_manager: ?*StateManager,
    
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
        contract.code = SNAILTRACER_DEPLOYED_BYTECODE;
        
        // For benchmark function, we need to encode the function selector
        // benchmark() selector = keccak256("benchmark()")[0:4] = 0x4c0e3e7a
        const benchmark_selector = [_]u8{ 0x4c, 0x0e, 0x3e, 0x7a };
        
        // Run the contract with the benchmark function selector
        _ = try self.interpreter.run(&contract, &benchmark_selector, false);
    }
};

// zbench benchmark function for SnailTracer
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
    // Compile the SnailTracer contract first
    try compileSnailTracer(std.testing.allocator);
    defer std.testing.allocator.free(SNAILTRACER_BYTECODE);
    defer std.testing.allocator.free(SNAILTRACER_DEPLOYED_BYTECODE);
    
    var bench = zbench.Benchmark.init(std.testing.allocator, .{
        .iterations = 100, // Run a small number of iterations for testing
    });
    defer bench.deinit();
    
    try bench.add("SnailTracer", benchmarkSnailTracer, .{});
    
    try bench.run(std.io.getStdOut().writer());
}

// Main entry point for running the benchmark
pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    std.debug.print("\n=== Running SnailTracer Benchmark ===\n\n", .{});
    
    // Compile the SnailTracer contract first
    try compileSnailTracer(allocator);
    defer allocator.free(SNAILTRACER_BYTECODE);
    defer allocator.free(SNAILTRACER_DEPLOYED_BYTECODE);
    
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