const std = @import("std");
const testing = std.testing;

// Import the Evm module using the global import path
const EvmModule = @import("Evm");
// Get blob opcodes functions from the Evm module
const blob = EvmModule.opcodes.blob;
const Frame = EvmModule.Frame;
const Contract = EvmModule.Contract;
const Stack = EvmModule.Stack;
const Memory = EvmModule.Memory;
const Interpreter = EvmModule.Interpreter;
const Evm = EvmModule.Evm;
const ExecutionError = EvmModule.InterpreterError;
const ExecutionStatus = EvmModule.ExecutionStatus;
const JumpTable = EvmModule.JumpTable;

// Import the Address module
const AddressModule = @import("Address");

// Use the actual u256 type
const BigInt = u256;

// Mock implementation for testing
fn createTestFrame() !struct {
    frame: *Frame,
    stack: *Stack,
    memory: *Memory,
    interpreter: *Interpreter,
} {
    const allocator = testing.allocator;

    // Initialize EVM
    const evm = try Evm.init(allocator, null);

    // Create a stack
    const stack_ptr = try allocator.create(Stack);
    stack_ptr.* = Stack.init(allocator);

    // Create memory
    const memory_ptr = try allocator.create(Memory);
    memory_ptr.* = try Memory.init(allocator);

    // Create contract
    const contract = EvmModule.createContract(std.mem.zeroes(AddressModule.Address), std.mem.zeroes(AddressModule.Address), 0, 100000);
    contract.code = &[_]u8{};
    contract.input = &[_]u8{};
    const contract_ptr = try allocator.create(Contract);
    contract_ptr.* = contract;

    // Create frame
    const frame_ptr = try allocator.create(Frame);
    frame_ptr.* = try Frame.init(allocator, contract_ptr);

    // Create jump table
    const jump_table = try EvmModule.JumpTable.init(allocator);
    
    // Create interpreter
    const interpreter = try Interpreter.create(allocator, &evm, jump_table);
    interpreter.returnData = &[_]u8{};

    return .{
        .frame = frame_ptr,
        .stack = stack_ptr,
        .memory = memory_ptr,
        .interpreter = interpreter,
    };
}

fn cleanupTestFrame(test_frame: anytype, allocator: std.mem.Allocator) void {
    // Proper cleanup using Evm module's cleanup methods
    test_frame.frame.deinit();
    
    // Free the memory we allocated
    allocator.destroy(test_frame.memory);
    allocator.destroy(test_frame.stack);
    allocator.destroy(test_frame.frame.contract);
    allocator.destroy(test_frame.frame);
    
    // Deinitialize the interpreter and its EVM
    test_frame.interpreter.deinit();
    allocator.destroy(test_frame.interpreter);
}

test "BLOBHASH basic operation" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Setup stack for BLOBHASH operation test
    try test_frame.stack.push(0); // Index 0

    // Execute BLOBHASH operation
    _ = try blob.opBlobHash(0, test_frame.interpreter, test_frame.frame);

    // Check result - should have one item on stack
    try testing.expectEqual(@as(usize, 1), test_frame.stack.size);
    try testing.expectEqual(@as(BigInt, 0), test_frame.stack.data[0]);
}

test "BLOBBASEFEE basic operation" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Execute BLOBBASEFEE operation
    _ = try blob.opBlobBaseFee(0, test_frame.interpreter, test_frame.frame);

    // Check result - should have one item on stack
    try testing.expectEqual(@as(usize, 1), test_frame.stack.size);
    // Our placeholder value is 1000000
    try testing.expectEqual(@as(BigInt, 1000000), test_frame.stack.data[0]);
}

test "MCOPY basic operation" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Prepare memory with test data
    try test_frame.memory.resize(128);
    // Set memory data using safe methods
    for (0..64) |i| {
        try test_frame.memory.store8(i, @truncate(i));
    }

    // Setup stack for MCOPY operation test
    try test_frame.stack.push(64); // destination offset
    try test_frame.stack.push(0); // source offset
    try test_frame.stack.push(32); // length

    // Execute MCOPY operation
    _ = try blob.opMcopy(0, test_frame.interpreter, test_frame.frame);

    // Check result - memory should be copied correctly
    for (0..32) |i| {
        try testing.expectEqual(@as(u8, @truncate(i)), test_frame.memory.get8(64 + i));
    }
}

test "MCOPY memory size calculation" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Setup stack for MCOPY memory size test
    try test_frame.stack.push(64); // destination offset
    try test_frame.stack.push(0); // source offset
    try test_frame.stack.push(32); // length

    // Test memory size calculation
    const mem_size = blob.mcopyMemorySize(test_frame.stack);
    try testing.expectEqual(@as(u64, 96), mem_size.size); // 64 + 32 = 96
    try testing.expect(!mem_size.overflow);

    // Test with extreme values to trigger overflow
    try test_frame.stack.pop();
    try test_frame.stack.pop();
    try test_frame.stack.pop();

    try test_frame.stack.push(0xFFFFFFFFFFFFFFFF); // dest - max u64
    try test_frame.stack.push(0); // source
    try test_frame.stack.push(1); // length - adding 1 would overflow

    const overflow_mem_size = blob.mcopyMemorySize(test_frame.stack);
    try testing.expect(overflow_mem_size.overflow);
}

test "MCOPY dynamic gas calculation" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Prepare memory with enough capacity for test
    try test_frame.memory.resize(64);

    // Setup stack for MCOPY gas calculation test
    try test_frame.stack.push(0); // destination offset
    try test_frame.stack.push(0); // source offset
    try test_frame.stack.push(32); // length

    // Calculate MCOPY gas
    // Base cost: CopyGas (3) + 1 word cost (1) = 4
    const mcopy_gas = try blob.mcopyDynamicGas(test_frame.interpreter, test_frame.frame, test_frame.stack, test_frame.memory, 0);
    try testing.expectEqual(@as(u64, 4), mcopy_gas);

    // Test with larger memory expansion
    try test_frame.stack.pop();
    try test_frame.stack.pop();
    try test_frame.stack.pop();

    try test_frame.stack.push(100); // destination offset
    try test_frame.stack.push(0); // source offset
    try test_frame.stack.push(32); // length

    // Calculate MCOPY gas with memory expansion
    // Base cost: CopyGas (3) + 1 word cost (1) = 4
    // Plus memory expansion cost
    const mcopy_gas_with_expansion = try blob.mcopyDynamicGas(test_frame.interpreter, test_frame.frame, test_frame.stack, test_frame.memory, 0);
    try testing.expect(mcopy_gas_with_expansion > 4); // Should be more due to memory expansion
}
