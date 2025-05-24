const std = @import("std");
const zbench = @import("zbench");
const evm = @import("evm");
const Evm = evm.Evm;
const Interpreter = evm.interpreter.Interpreter;
const Contract = evm.Contract;
const createContract = evm.createContract;
const Frame = evm.Frame;
const address = @import("address");
const Address = address.Address;
const createAddress = address.createAddress;

// A minimal benchmark that only uses working opcodes
const MINIMAL_BYTECODE = [_]u8{
    // PUSH1 10
    0x60, 0x0A,
    // PUSH1 20  
    0x60, 0x14,
    // ADD
    0x01,
    // PUSH1 30
    0x60, 0x1E,
    // EQ (check if 10+20 == 30)
    0x14,
    // PUSH1 0 (jump destination if true)
    0x60, 0x00,
    // JUMPI (conditional jump)
    0x57,
    // If we get here, test failed
    // PUSH1 0
    0x60, 0x00,
    // PUSH1 0
    0x60, 0x00,
    // REVERT
    0xFD,
    // Jump destination (success case)
    // JUMPDEST
    0x5B,
    // STOP
    0x00,
};

// Benchmark context to hold EVM state
const BenchmarkContext = struct {
    evm_instance: Evm,
    interpreter: Interpreter,
    contract: Contract,
    frame: Frame,
    
    pub fn init(allocator: std.mem.Allocator) !BenchmarkContext {
        // Create EVM instance
        var evm_instance = try Evm.init(null);
        
        // Create interpreter
        var interpreter = try Interpreter.init(allocator, &evm_instance);
        
        // Create contract
        const contract_address = createAddress("0x1000000000000000000000000000000000000000");
        const caller_address = createAddress("0x2000000000000000000000000000000000000000");
        
        var contract = createContract(
            contract_address,
            caller_address,
            0, // value
            &MINIMAL_BYTECODE,
            1000000, // gas
            false, // is_static
        );
        
        // Create frame
        var frame = Frame{
            .contract = &contract,
            .stack = evm.Stack.init(allocator),
            .memory = evm.Memory.init(),
            .return_data = &[_]u8{},
            .gas_remaining = 1000000,
            .pc = 0,
        };
        
        return BenchmarkContext{
            .evm_instance = evm_instance,
            .interpreter = interpreter,
            .contract = contract,
            .frame = frame,
        };
    }
    
    pub fn deinit(self: *BenchmarkContext) void {
        self.frame.stack.deinit();
        self.frame.memory.deinit();
        self.interpreter.deinit();
        self.evm_instance.deinit();
    }
};

// zbench benchmark function for minimal EVM operations
fn benchmarkMinimalEvm(allocator: std.mem.Allocator) void {
    var ctx = BenchmarkContext.init(allocator) catch {
        std.debug.panic("Failed to initialize benchmark context", .{});
    };
    defer ctx.deinit();
    
    // Reset frame for each iteration
    ctx.frame.pc = 0;
    ctx.frame.gas_remaining = 1000000;
    ctx.frame.stack.size = 0;
    
    // Execute bytecode
    while (ctx.frame.pc < MINIMAL_BYTECODE.len) {
        const opcode = MINIMAL_BYTECODE[ctx.frame.pc];
        const operation = ctx.interpreter.table.getOperation(opcode);
        
        // Check gas
        if (ctx.frame.gas_remaining < operation.constant_gas) {
            break;
        }
        ctx.frame.gas_remaining -= operation.constant_gas;
        
        // Execute operation
        const result = operation.execute(ctx.frame.pc, &ctx.interpreter, &ctx.frame) catch |err| {
            if (err == error.STOP) {
                break;
            }
            std.debug.panic("Execution error: {}", .{err});
        };
        
        _ = result;
        
        // Advance PC (most opcodes advance by 1, PUSH opcodes handle their own advancement)
        if (opcode != 0x57 and opcode != 0x56) { // not JUMPI or JUMP
            ctx.frame.pc += 1;
        }
    }
}

test "minimal EVM benchmark with zbench" {
    var bench = zbench.Benchmark.init(std.testing.allocator, .{});
    defer bench.deinit();
    
    try bench.add("Minimal EVM Operations", benchmarkMinimalEvm, .{});
    
    try bench.run(std.io.getStdOut().writer());
}

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    
    var bench = zbench.Benchmark.init(allocator, .{});
    defer bench.deinit();
    
    try bench.add("Minimal EVM Operations", benchmarkMinimalEvm, .{});
    
    std.debug.print("\n=== Minimal EVM Benchmark ===\n", .{});
    try bench.run(std.io.getStdOut().writer());
}