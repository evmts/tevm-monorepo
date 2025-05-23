const std = @import("std");
const evm = @import("evm");
const Evm = evm.Evm;
const Interpreter = evm.interpreter.Interpreter;
const Contract = evm.Contract;
const createContract = evm.createContract;
const Frame = evm.Frame;
const address = @import("address");
const Address = address.Address;
const createAddress = address.createAddress;

/// A minimal benchmark that only uses working opcodes
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

pub fn runMinimalBenchmark(allocator: std.mem.Allocator) !void {
    std.debug.print("\n=== Minimal EVM Benchmark ===\n", .{});
    
    // Create EVM instance
    var evm_instance = try Evm.init(null);
    defer evm_instance.deinit();
    
    // Create a minimal state manager (if needed)
    // For now, we'll use the test stub which is enough for basic operations
    
    // Create interpreter
    var interpreter = try Interpreter.init(allocator, &evm_instance);
    defer interpreter.deinit();
    
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
    defer frame.stack.deinit();
    defer frame.memory.deinit();
    
    // Run benchmark
    const iterations = 10000;
    const start = std.time.nanoTimestamp();
    
    var i: u32 = 0;
    while (i < iterations) : (i += 1) {
        // Reset frame for each iteration
        frame.pc = 0;
        frame.gas_remaining = 1000000;
        frame.stack.size = 0;
        
        // Execute bytecode
        while (frame.pc < MINIMAL_BYTECODE.len) {
            const opcode = MINIMAL_BYTECODE[frame.pc];
            const operation = interpreter.table.getOperation(opcode);
            
            // Check gas
            if (frame.gas_remaining < operation.constant_gas) {
                break;
            }
            frame.gas_remaining -= operation.constant_gas;
            
            // Execute operation
            const result = operation.execute(frame.pc, &interpreter, &frame) catch |err| {
                if (err == error.STOP) {
                    break;
                }
                return err;
            };
            
            _ = result;
            
            // Advance PC (most opcodes advance by 1, PUSH opcodes handle their own advancement)
            if (opcode != 0x57 and opcode != 0x56) { // not JUMPI or JUMP
                frame.pc += 1;
            }
        }
    }
    
    const end = std.time.nanoTimestamp();
    const elapsed_ns = @as(u64, @intCast(end - start));
    const elapsed_ms = elapsed_ns / 1_000_000;
    const ops_per_sec = (iterations * MINIMAL_BYTECODE.len * 1_000_000_000) / elapsed_ns;
    
    std.debug.print("Iterations: {}\n", .{iterations});
    std.debug.print("Time elapsed: {} ms\n", .{elapsed_ms});
    std.debug.print("Operations per second: {}\n", .{ops_per_sec});
    std.debug.print("=========================\n\n", .{});
}

test "minimal benchmark" {
    try runMinimalBenchmark(std.testing.allocator);
}