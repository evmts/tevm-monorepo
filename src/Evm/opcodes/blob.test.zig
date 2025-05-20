const std = @import("std");
const testing = std.testing;
const blob = @import("blob.zig");
const utils = @import("test_utils.zig");

// Import needed types from test_utils to ensure consistent imports
const Frame = utils.Frame;
const Contract = utils.Contract;
const Stack = utils.Stack;
const Memory = utils.Memory;
const Interpreter = utils.Interpreter;
const EVM = utils.Evm;
const ExecutionStatus = utils.ExecutionStatus;
const Log = utils.Log;
const ExecutionError = utils.ExecutionError;

// Use the u256 type but aliased to avoid shadowing primitive
const BigInt = utils.Stack.@"u256";

// Mock implementation for testing
fn createTestFrame() !struct {
    frame: *Frame,
    stack: *Stack,
    memory: *Memory,
    interpreter: *Interpreter,
} {
    const allocator = testing.allocator;
    
    const stack = try allocator.create(Stack);
    stack.* = Stack.init(allocator);
    
    const memory = try allocator.create(Memory);
    memory.* = Memory.init(allocator);
    
    const contract = try allocator.create(Contract);
    contract.* = Contract{
        .gas = 100000,
        .code_address = undefined,
        .address = undefined,
        .input = &[_]u8{},
        .value = 0,
        .gas_refund = 0,
    };
    
    const frame = try allocator.create(Frame);
    frame.* = Frame{
        .stack = stack,
        .memory = memory,
        .contract = contract,
        .ret_data = undefined,
        .return_data_size = 0,
        .pc = 0,
        .gas_remaining = 100000,
        .err = null,
        .depth = 0,
        .ret_offset = 0,
        .ret_size = 0,
        .call_depth = 0,
    };
    
    const interpreter = try allocator.create(Interpreter);
    
    // Create EVM instance
    
    const evm = try allocator.create(EVM);
    evm.* = EVM{
        .chainRules = .{
            .IsEIP4844 = true,  // Enable EIP-4844 for BLOBHASH and BLOBBASEFEE
            .IsEIP5656 = true,  // Enable EIP-5656 for MCOPY
            // Add other necessary rules
        },
        .allocator = allocator,
        .transientStorage = std.StringHashMap(std.StringHashMap([]u8)).init(allocator),
        .contracts = undefined,
        .returnValue = undefined,
        .status = ExecutionStatus.Success,
        .gasUsed = 0,
        .gasRefund = 0,
        .depth = 0,
        .logs = std.ArrayList(Log).init(allocator),
        .accounts = undefined,
        .accessList = undefined,
        .storageAccessList = undefined,
    };
    
    interpreter.* = Interpreter{
        .evm = evm,
        .cfg = undefined,
        .readOnly = false,
        .returnData = &[_]u8{},
    };
    
    return .{
        .frame = frame,
        .stack = stack,
        .memory = memory,
        .interpreter = interpreter,
    };
}

fn cleanupTestFrame(test_frame: anytype, allocator: std.mem.Allocator) void {
    test_frame.memory.deinit();
    test_frame.stack.deinit();
    
    // Deinitialize EVM resources
    test_frame.interpreter.evm.transientStorage.deinit();
    test_frame.interpreter.evm.logs.deinit();
    
    // Free all allocated memory
    allocator.destroy(test_frame.memory);
    allocator.destroy(test_frame.stack);
    allocator.destroy(test_frame.frame.contract);
    allocator.destroy(test_frame.frame);
    allocator.destroy(test_frame.interpreter.evm); // Free the EVM we created
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
    try testing.expectEqual(@as(u64, 0), test_frame.stack.data[0]);
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
    try testing.expectEqual(@as(u64, 1000000), test_frame.stack.data[0]);
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
    try test_frame.stack.push(0);  // source offset
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
    try test_frame.stack.push(0);  // source offset
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
    try test_frame.stack.push(0);  // destination offset
    try test_frame.stack.push(0);  // source offset
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
    try test_frame.stack.push(0);   // source offset
    try test_frame.stack.push(32);  // length
    
    // Calculate MCOPY gas with memory expansion
    // Base cost: CopyGas (3) + 1 word cost (1) = 4
    // Plus memory expansion cost
    const mcopy_gas_with_expansion = try blob.mcopyDynamicGas(test_frame.interpreter, test_frame.frame, test_frame.stack, test_frame.memory, 0);
    try testing.expect(mcopy_gas_with_expansion > 4); // Should be more due to memory expansion
}