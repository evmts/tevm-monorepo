const std = @import("std");
const evm = @import("evm");
const Evm = evm.Evm;
const Interpreter = evm.Interpreter;
const Contract = evm.Contract;
const createContract = evm.createContract;
const address = @import("address");
const Address = address.Address;
const StateManager = @import("state_manager").StateManager;
const Compiler = @import("compiler").Compiler;
const utils = @import("utils");

/// Benchmark different types of EVM operations
pub const BenchmarkSuite = struct {
    /// Arithmetic operations benchmark (ADD, MUL, DIV, etc.)
    pub const ARITHMETIC_OPS = [_]u8{
        // PUSH1 10
        0x60, 0x0A,
        // PUSH1 20
        0x60, 0x14,
        // ADD
        0x01,
        // PUSH1 5
        0x60, 0x05,
        // MUL
        0x02,
        // PUSH1 3
        0x60, 0x03,
        // DIV
        0x04,
        // PUSH1 7
        0x60, 0x07,
        // MOD
        0x06,
        // PUSH1 2
        0x60, 0x02,
        // EXP
        0x0A,
        // STOP
        0x00,
    };
    
    /// Memory operations benchmark (MLOAD, MSTORE, etc.)
    pub const MEMORY_OPS = [_]u8{
        // Store value at memory[0]
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x00, // PUSH1 0x00
        0x52,       // MSTORE
        
        // Load from memory[0]
        0x60, 0x00, // PUSH1 0x00
        0x51,       // MLOAD
        
        // Store at memory[32]
        0x60, 0x20, // PUSH1 0x20
        0x52,       // MSTORE
        
        // MCOPY from 0 to 64 (32 bytes)
        0x60, 0x20, // PUSH1 32 (size)
        0x60, 0x00, // PUSH1 0 (source)
        0x60, 0x40, // PUSH1 64 (dest)
        0x5E,       // MCOPY
        
        // STOP
        0x00,
    };
    
    /// Storage operations benchmark (SLOAD, SSTORE)
    pub const STORAGE_OPS = [_]u8{
        // Store value 0x42 at storage[0]
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x00, // PUSH1 0x00
        0x55,       // SSTORE
        
        // Load from storage[0]
        0x60, 0x00, // PUSH1 0x00
        0x54,       // SLOAD
        
        // Store at storage[1]
        0x60, 0x01, // PUSH1 0x01
        0x55,       // SSTORE
        
        // Transient storage operations (if EIP-1153 is enabled)
        0x60, 0x99, // PUSH1 0x99
        0x60, 0x00, // PUSH1 0x00
        0x5C,       // TSTORE
        
        0x60, 0x00, // PUSH1 0x00
        0x5D,       // TLOAD
        
        // STOP
        0x00,
    };
    
    /// Control flow operations benchmark (JUMP, JUMPI) - simplified version
    pub const CONTROL_FLOW_OPS = [_]u8{
        // Simple unconditional jump
        0x60, 0x05, // PUSH1 5 (jump to position 5)
        0x56,       // JUMP (position 2)
        0x00,       // STOP (position 3, unreachable)
        0x00,       // STOP (position 4, unreachable)
        0x5B,       // JUMPDEST (position 5)
        0x00,       // STOP (position 6)
    };
    
    /// Cryptographic operations benchmark (SHA3/KECCAK256)
    pub const CRYPTO_OPS = [_]u8{
        // Store data in memory
        0x60, 0x42, // PUSH1 0x42
        0x60, 0x00, // PUSH1 0x00
        0x52,       // MSTORE
        
        // Calculate SHA3 of memory[0:32]
        0x60, 0x20, // PUSH1 32 (size)
        0x60, 0x00, // PUSH1 0 (offset)
        0x20,       // SHA3
        
        // STOP
        0x00,
    };
    
    pub fn runBenchmark(name: []const u8, bytecode: []const u8, iterations: u32, allocator: std.mem.Allocator) !void {
        // Create EVM instance
        var evm_instance = try Evm.init(null);
        
        // Initialize precompiles
        try evm_instance.initPrecompiles(allocator);
        defer {
            if (evm_instance.precompiles) |contracts| {
                contracts.deinit();
                allocator.destroy(contracts);
            }
        }
        
        // Create state manager
        var state_manager = try StateManager.init(allocator, .{});
        defer state_manager.deinit();
        evm_instance.setStateManager(state_manager);
        
        // Create interpreter
        var interpreter = try Interpreter.init(allocator, &evm_instance);
        // JumpTable doesn't need deinit - it's stack allocated
        
        // Create addresses
        const caller = address.addressFromHex("0x1234567890123456789012345678901234567890".*);
        const contract_addr = address.addressFromHex("0x2345678901234567890123456789012345678901".*);
        
        // Run benchmark
        const start = std.time.nanoTimestamp();
        
        var i: u32 = 0;
        while (i < iterations) : (i += 1) {
            var contract = createContract(
                contract_addr,
                caller,
                0, // value
                1_000_000 // gas
            );
            contract.code = bytecode;
            
            _ = try interpreter.run(&contract, &[_]u8{}, false);
        }
        
        const end = std.time.nanoTimestamp();
        const elapsed_ns = @as(u64, @intCast(end - start));
        const elapsed_ms = @as(f64, @floatFromInt(elapsed_ns)) / 1_000_000.0;
        const ns_per_iteration = elapsed_ns / iterations;
        
        std.debug.print("{s} Benchmark:\n", .{name});
        std.debug.print("  Iterations: {}\n", .{iterations});
        std.debug.print("  Total time: {d:.2} ms\n", .{elapsed_ms});
        std.debug.print("  Time per iteration: {} ns\n", .{ns_per_iteration});
        std.debug.print("  Iterations per second: {d:.0}\n", .{1_000_000_000.0 / @as(f64, @floatFromInt(ns_per_iteration))});
        std.debug.print("\n", .{});
    }
    
    pub fn runSnailTracerBenchmark(allocator: std.mem.Allocator) !void {
        std.debug.print("=== SnailTracer Contract Benchmark ===\n\n", .{});
        
        // Read the SnailTracer contract
        const snailtracer_path = "src/Solidity/SnailTracer.sol";
        
        // Compile the contract
        var result = try Compiler.compileFile(allocator, snailtracer_path, .{
            .optimizer_enabled = true,
            .optimizer_runs = 200,
        });
        defer result.deinit();
        
        if (result.errors.len > 0) {
            std.debug.print("Compilation errors:\n", .{});
            for (result.errors) |err| {
                std.debug.print("  {s}\n", .{err.message});
            }
            return error.CompilationFailed;
        }
        
        if (result.contracts.len == 0) {
            return error.NoContractsCompiled;
        }
        
        // Get the deployed bytecode
        const contract = result.contracts[0];
        std.debug.print("Compiled contract: {s}\n", .{contract.name});
        std.debug.print("Bytecode length: {} bytes\n", .{contract.deployed_bytecode.len});
        
        // Convert hex string to bytes
        // Skip "0x" prefix if present
        var hex_start: usize = 0;
        if (contract.deployed_bytecode.len >= 2 and 
            contract.deployed_bytecode[0] == '0' and 
            (contract.deployed_bytecode[1] == 'x' or contract.deployed_bytecode[1] == 'X')) {
            hex_start = 2;
        }
        
        const hex_len = contract.deployed_bytecode.len - hex_start;
        const bytecode_len = (hex_len + 1) / 2;
        const bytecode = try allocator.alloc(u8, bytecode_len);
        defer allocator.free(bytecode);
        
        const actual_len = utils.hex.hexToBytes(
            contract.deployed_bytecode.ptr,
            contract.deployed_bytecode.len,
            bytecode.ptr
        );
        
        // Use only the actual converted bytes
        const actual_bytecode = bytecode[0..actual_len];
        
        // Run benchmark with the compiled bytecode
        try runBenchmark("SnailTracer Contract", actual_bytecode, 1000, allocator);
    }

    pub fn runAllBenchmarks(allocator: std.mem.Allocator) !void {
        std.debug.print("=== EVM Benchmark Suite ===\n\n", .{});
        
        const iterations = 10000;
        
        try runBenchmark("Arithmetic Operations", &ARITHMETIC_OPS, iterations, allocator);
        // TODO: Fix these benchmarks after fixing opcode modules
        // try runBenchmark("Memory Operations", &MEMORY_OPS, iterations, allocator);
        // try runBenchmark("Storage Operations", &STORAGE_OPS, iterations, allocator);
        // try runBenchmark("Control Flow Operations", &CONTROL_FLOW_OPS, iterations, allocator);
        // try runBenchmark("Cryptographic Operations", &CRYPTO_OPS, iterations, allocator);
        
        // TODO: Fix SnailTracer benchmark - need to properly deploy contract first
        // The compiled bytecode includes constructor logic and needs proper deployment
        // try runSnailTracerBenchmark(allocator);
        std.debug.print("\n[SKIPPED] SnailTracer Contract Benchmark - needs proper contract deployment\n", .{});
    }
};

test "Run all benchmarks" {
    const allocator = std.testing.allocator;
    try BenchmarkSuite.runAllBenchmarks(allocator);
}

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    try BenchmarkSuite.runAllBenchmarks(allocator);
}