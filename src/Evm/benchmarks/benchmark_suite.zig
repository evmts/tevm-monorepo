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
};

/// Benchmark context for EVM operations
const BenchmarkContext = struct {
    allocator: std.mem.Allocator,
    evm: *Evm,
    state_manager: *StateManager,
    interpreter: *Interpreter,
    
    pub fn init(allocator: std.mem.Allocator) !BenchmarkContext {
        // Create EVM instance
        var evm_instance = try allocator.create(Evm);
        evm_instance.* = try Evm.init(null);
        
        // Initialize precompiles
        try evm_instance.initPrecompiles(allocator);
        
        // Create state manager
        const state_manager = try StateManager.init(allocator, .{});
        evm_instance.setStateManager(state_manager);
        
        // Create interpreter
        const interpreter = try allocator.create(Interpreter);
        interpreter.* = try Interpreter.init(allocator, evm_instance);
        
        return BenchmarkContext{
            .allocator = allocator,
            .evm = evm_instance,
            .state_manager = state_manager,
            .interpreter = interpreter,
        };
    }
    
    pub fn deinit(self: *BenchmarkContext) void {
        // Clean up precompiles
        if (self.evm.precompiles) |contracts| {
            contracts.deinit();
            self.allocator.destroy(contracts);
        }
        
        // Clean up state manager
        self.state_manager.deinit();
        
        // Clean up interpreter and evm
        self.allocator.destroy(self.interpreter);
        self.allocator.destroy(self.evm);
    }
    
    pub fn runBytecode(self: *BenchmarkContext, bytecode: []const u8) !void {
        // Create addresses
        const caller = address.addressFromHex("0x1234567890123456789012345678901234567890".*);
        const contract_addr = address.addressFromHex("0x2345678901234567890123456789012345678901".*);
        
        var contract = createContract(
            contract_addr,
            caller,
            0, // value
            1_000_000 // gas
        );
        contract.code = bytecode;
        
        _ = try self.interpreter.run(&contract, &[_]u8{}, false);
    }
};

// zbench benchmark functions
fn benchmarkArithmetic(allocator: std.mem.Allocator) void {
    var ctx = BenchmarkContext.init(allocator) catch {
        std.debug.panic("Failed to initialize benchmark context", .{});
    };
    defer ctx.deinit();
    
    ctx.runBytecode(&BenchmarkSuite.ARITHMETIC_OPS) catch {
        std.debug.panic("Failed to run arithmetic operations", .{});
    };
}

fn benchmarkMemory(allocator: std.mem.Allocator) void {
    var ctx = BenchmarkContext.init(allocator) catch {
        std.debug.panic("Failed to initialize benchmark context", .{});
    };
    defer ctx.deinit();
    
    ctx.runBytecode(&BenchmarkSuite.MEMORY_OPS) catch {
        std.debug.panic("Failed to run memory operations", .{});
    };
}

fn benchmarkStorage(allocator: std.mem.Allocator) void {
    var ctx = BenchmarkContext.init(allocator) catch {
        std.debug.panic("Failed to initialize benchmark context", .{});
    };
    defer ctx.deinit();
    
    ctx.runBytecode(&BenchmarkSuite.STORAGE_OPS) catch {
        std.debug.panic("Failed to run storage operations", .{});
    };
}

fn benchmarkControlFlow(allocator: std.mem.Allocator) void {
    var ctx = BenchmarkContext.init(allocator) catch {
        std.debug.panic("Failed to initialize benchmark context", .{});
    };
    defer ctx.deinit();
    
    ctx.runBytecode(&BenchmarkSuite.CONTROL_FLOW_OPS) catch {
        std.debug.panic("Failed to run control flow operations", .{});
    };
}

fn benchmarkCrypto(allocator: std.mem.Allocator) void {
    var ctx = BenchmarkContext.init(allocator) catch {
        std.debug.panic("Failed to initialize benchmark context", .{});
    };
    defer ctx.deinit();
    
    ctx.runBytecode(&BenchmarkSuite.CRYPTO_OPS) catch {
        std.debug.panic("Failed to run crypto operations", .{});
    };
}

fn benchmarkSnailTracer(allocator: std.mem.Allocator) void {
    var ctx = BenchmarkContext.init(allocator) catch {
        std.debug.panic("Failed to initialize benchmark context", .{});
    };
    defer ctx.deinit();
    
    // Read the SnailTracer contract
    const snailtracer_path = "src/Solidity/SnailTracer.sol";
    
    // Compile the contract
    var result = Compiler.compileFile(allocator, snailtracer_path, .{
        .optimizer_enabled = true,
        .optimizer_runs = 200,
    }) catch {
        std.debug.print("[SKIPPED] SnailTracer compilation failed\n", .{});
        return;
    };
    defer result.deinit();
    
    if (result.errors.len > 0 or result.contracts.len == 0) {
        std.debug.print("[SKIPPED] SnailTracer compilation had errors or no contracts\n", .{});
        return;
    }
    
    // Get the deployed bytecode
    const contract = result.contracts[0];
    
    // Convert hex string to bytes
    var hex_start: usize = 0;
    if (contract.deployed_bytecode.len >= 2 and 
        contract.deployed_bytecode[0] == '0' and 
        (contract.deployed_bytecode[1] == 'x' or contract.deployed_bytecode[1] == 'X')) {
        hex_start = 2;
    }
    
    const hex_len = contract.deployed_bytecode.len - hex_start;
    const bytecode_len = (hex_len + 1) / 2;
    const bytecode = allocator.alloc(u8, bytecode_len) catch {
        std.debug.panic("Failed to allocate bytecode memory", .{});
    };
    defer allocator.free(bytecode);
    
    const actual_len = utils.hex.hexToBytes(
        contract.deployed_bytecode.ptr,
        contract.deployed_bytecode.len,
        bytecode.ptr
    );
    
    // Use only the actual converted bytes
    const actual_bytecode = bytecode[0..actual_len];
    
    ctx.runBytecode(actual_bytecode) catch {
        std.debug.panic("Failed to run SnailTracer", .{});
    };
}

test "Run all benchmarks with zbench" {
    var bench = zbench.Benchmark.init(std.testing.allocator, .{});
    defer bench.deinit();
    
    try bench.add("Arithmetic Operations", benchmarkArithmetic, .{});
    // TODO: Fix these benchmarks after fixing opcode modules
    // try bench.add("Memory Operations", benchmarkMemory, .{});
    // try bench.add("Storage Operations", benchmarkStorage, .{});
    // try bench.add("Control Flow Operations", benchmarkControlFlow, .{});
    // try bench.add("Cryptographic Operations", benchmarkCrypto, .{});
    // try bench.add("SnailTracer Contract", benchmarkSnailTracer, .{});
    
    try bench.run(std.io.getStdOut().writer());
}

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    var bench = zbench.Benchmark.init(allocator, .{});
    defer bench.deinit();
    
    std.debug.print("=== EVM Benchmark Suite ===\n\n", .{});
    
    try bench.add("Arithmetic Operations", benchmarkArithmetic, .{});
    // TODO: Fix these benchmarks after fixing opcode modules
    // try bench.add("Memory Operations", benchmarkMemory, .{});
    // try bench.add("Storage Operations", benchmarkStorage, .{});
    // try bench.add("Control Flow Operations", benchmarkControlFlow, .{});
    // try bench.add("Cryptographic Operations", benchmarkCrypto, .{});
    
    try bench.run(std.io.getStdOut().writer());
    
    std.debug.print("\n[SKIPPED] Other benchmarks - need opcode fixes\n", .{});
    std.debug.print("[SKIPPED] SnailTracer Contract Benchmark - needs proper contract deployment\n", .{});
}