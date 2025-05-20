const std = @import("std");
const testing = std.testing;
const blob = @import("blob.zig");
const utils = @import("test_utils.zig");

// Import needed types
const Frame = utils.Frame;
const Contract = utils.Contract;
const Stack = utils.Stack;
const Memory = utils.Memory;
const Interpreter = utils.Interpreter;
const EVM = utils.Evm;
const ExecutionStatus = utils.ExecutionStatus;
const Log = utils.Log;
const ExecutionError = utils.ExecutionError;

// Alias for the u256 type from Stack
const BigInt = Stack.u256;

/// Helper function to create a test environment for MCOPY tests
fn createTestFrame() !struct {
    frame: *Frame,
    stack: *Stack,
    memory: *Memory,
    interpreter: *Interpreter,
} {
    const allocator = testing.allocator;

    const stack = try allocator.create(Stack);
    const stack_capacity = 1024;
    const stack_data = try allocator.alloc(u64, stack_capacity);
    @memset(stack_data, 0);
    stack.* = Stack{
        .data = stack_data,
        .size = 0,
        .capacity = stack_capacity,
    };

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
        .code = &[_]u8{},
    };

    const frame = try allocator.create(Frame);
    frame.* = Frame{
        .stack = stack.*,
        .memory = memory.*,
        .contract = contract,
        .pc = 0,
        .returnData = null,
    };

    const interpreter = try allocator.create(Interpreter);

    // Create EVM instance with EIP-5656 enabled
    const evm = try allocator.create(EVM);
    evm.* = EVM{
        .chainRules = .{
            .IsEIP5656 = true, // Enable EIP-5656 for MCOPY
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

/// Cleanup the test environment
fn cleanupTestFrame(test_frame: anytype, allocator: std.mem.Allocator) void {
    test_frame.memory.deinit();
    allocator.free(test_frame.stack.data);

    // Deinitialize EVM resources
    test_frame.interpreter.evm.transientStorage.deinit();
    test_frame.interpreter.evm.logs.deinit();

    // Free all allocated memory
    allocator.destroy(test_frame.memory);
    allocator.destroy(test_frame.stack);
    allocator.destroy(test_frame.frame.contract);
    allocator.destroy(test_frame.frame);
    allocator.destroy(test_frame.interpreter.evm);
    allocator.destroy(test_frame.interpreter);
}

/// Test basic MCOPY functionality (copy non-overlapping regions)
test "MCOPY basic non-overlapping copy" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Prepare memory with test data
    try test_frame.memory.resize(128);
    
    // Initialize first 32 bytes with ascending values
    for (0..32) |i| {
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
        // Original data should remain unchanged
        try testing.expectEqual(@as(u8, @truncate(i)), try test_frame.memory.get8(i));
        // Copied data should match the original
        try testing.expectEqual(@as(u8, @truncate(i)), try test_frame.memory.get8(64 + i));
    }
}

/// Test MCOPY with overlapping regions (forward copy)
test "MCOPY overlapping regions (forward copy)" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Prepare memory with test data
    try test_frame.memory.resize(128);
    
    // Initialize first 32 bytes with ascending values
    for (0..32) |i| {
        try test_frame.memory.store8(i, @truncate(i));
    }

    // Setup stack for MCOPY operation test - partially overlapping
    try test_frame.stack.push(16); // destination offset overlaps with latter part of source
    try test_frame.stack.push(0);  // source offset
    try test_frame.stack.push(32); // length

    // Execute MCOPY operation
    _ = try blob.opMcopy(0, test_frame.interpreter, test_frame.frame);

    // Check result - memory should be copied correctly
    // First 16 bytes at destination should match first 16 bytes of original
    for (0..16) |i| {
        try testing.expectEqual(@as(u8, @truncate(i)), try test_frame.memory.get8(16 + i));
    }
    
    // Next 16 bytes should be copied from first 16 bytes of source (after overlap)
    for (16..32) |i| {
        try testing.expectEqual(@as(u8, @truncate(i - 16)), try test_frame.memory.get8(16 + i));
    }
}

/// Test MCOPY with overlapping regions (backward copy)
test "MCOPY overlapping regions (backward copy)" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Prepare memory with test data
    try test_frame.memory.resize(128);
    
    // Initialize memory region [16..48] with ascending values
    for (0..32) |i| {
        try test_frame.memory.store8(16 + i, @truncate(i));
    }

    // Setup stack for MCOPY operation test - backward overlapping
    try test_frame.stack.push(0);  // destination offset
    try test_frame.stack.push(16); // source offset 
    try test_frame.stack.push(32); // length

    // Execute MCOPY operation - copying from offset 16 to offset 0
    _ = try blob.opMcopy(0, test_frame.interpreter, test_frame.frame);

    // Check result - memory should be copied correctly
    for (0..32) |i| {
        try testing.expectEqual(@as(u8, @truncate(i)), try test_frame.memory.get8(i));
    }
}

/// Test MCOPY with zero length
test "MCOPY zero length" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Prepare memory with test data
    try test_frame.memory.resize(64);
    
    // Initialize first 32 bytes with ascending values
    for (0..32) |i| {
        try test_frame.memory.store8(i, @truncate(i));
    }

    // Setup stack for MCOPY operation test with zero length
    try test_frame.stack.push(32); // destination offset
    try test_frame.stack.push(0);  // source offset
    try test_frame.stack.push(0);  // length - zero!

    // Execute MCOPY operation
    _ = try blob.opMcopy(0, test_frame.interpreter, test_frame.frame);

    // Verify memory is unchanged at destination
    // Memory at destination should be initialized to zero
    try testing.expectEqual(@as(u8, 0), try test_frame.memory.get8(32));
}

/// Test MCOPY with exact memory size (no expansion)
test "MCOPY without memory expansion" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Prepare memory with exact size needed
    try test_frame.memory.resize(96); // Enough for source (32 bytes) + destination (32 bytes starting at 64)
    
    // Initialize first 32 bytes with ascending values
    for (0..32) |i| {
        try test_frame.memory.store8(i, @truncate(i));
    }

    // Track initial memory size
    const initial_size = test_frame.memory.len();

    // Setup stack for MCOPY operation test
    try test_frame.stack.push(64); // destination offset
    try test_frame.stack.push(0);  // source offset
    try test_frame.stack.push(32); // length

    // Execute MCOPY operation
    _ = try blob.opMcopy(0, test_frame.interpreter, test_frame.frame);

    // Check result - memory should be copied correctly
    for (0..32) |i| {
        try testing.expectEqual(@as(u8, @truncate(i)), try test_frame.memory.get8(64 + i));
    }
    
    // Verify memory size didn't change
    try testing.expectEqual(initial_size, test_frame.memory.len());
}

/// Test MCOPY with memory expansion
test "MCOPY with memory expansion" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Prepare memory with limited size
    try test_frame.memory.resize(32); // Only enough for source data
    
    // Initialize first 32 bytes with ascending values
    for (0..32) |i| {
        try test_frame.memory.store8(i, @truncate(i));
    }

    // Track initial memory size
    const initial_size = test_frame.memory.len();

    // Setup stack for MCOPY operation test requiring expansion
    try test_frame.stack.push(64); // destination offset beyond current memory size
    try test_frame.stack.push(0);  // source offset
    try test_frame.stack.push(32); // length

    // Execute MCOPY operation
    _ = try blob.opMcopy(0, test_frame.interpreter, test_frame.frame);

    // Check result - memory should be copied correctly
    for (0..32) |i| {
        try testing.expectEqual(@as(u8, @truncate(i)), try test_frame.memory.get8(64 + i));
    }
    
    // Verify memory expanded
    try testing.expect(test_frame.memory.len() > initial_size);
    try testing.expectEqual(@as(u64, 96), test_frame.memory.len()); // 64 + 32 = 96
}

/// Test MCOPY with large memory region
test "MCOPY with large memory region" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Define a large region size
    const large_size: u64 = 1024;
    
    // Prepare memory with large size
    try test_frame.memory.resize(large_size * 2); // Enough for source + destination
    
    // Initialize source region with a pattern
    for (0..large_size) |i| {
        try test_frame.memory.store8(i, @truncate(i % 256));
    }

    // Setup stack for MCOPY operation test
    try test_frame.stack.push(large_size); // destination offset
    try test_frame.stack.push(0);          // source offset
    try test_frame.stack.push(large_size); // length

    // Execute MCOPY operation
    _ = try blob.opMcopy(0, test_frame.interpreter, test_frame.frame);

    // Check result - memory should be copied correctly
    // Verify a sample of the data to avoid excessive testing
    for (0..100) |i| {
        try testing.expectEqual(
            try test_frame.memory.get8(i), 
            try test_frame.memory.get8(large_size + i)
        );
    }
    
    // Check end of the copied region
    try testing.expectEqual(
        try test_frame.memory.get8(large_size - 1), 
        try test_frame.memory.get8(large_size * 2 - 1)
    );
}

/// Test MCOPY with specific EIP-5656 test vectors
/// Based on test vectors from the EIP specification
test "MCOPY with EIP-5656 test vectors" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Prepare memory with test data
    try test_frame.memory.resize(128);
    
    // Initialize memory with known pattern
    // Region 1: 0x00-0x1F filled with 0xAA
    for (0..32) |i| {
        try test_frame.memory.store8(i, 0xAA);
    }
    
    // Region 2: 0x20-0x3F filled with 0xBB
    for (32..64) |i| {
        try test_frame.memory.store8(i, 0xBB);
    }
    
    // Region 3: 0x40-0x5F filled with 0xCC
    for (64..96) |i| {
        try test_frame.memory.store8(i, 0xCC);
    }

    // Test Vector 1: Copy 32 bytes from offset 0x00 to offset 0x60
    try test_frame.stack.push(0x60); // destination offset
    try test_frame.stack.push(0x00); // source offset
    try test_frame.stack.push(0x20); // length (32 bytes)

    // Execute MCOPY operation
    _ = try blob.opMcopy(0, test_frame.interpreter, test_frame.frame);

    // Verify the copy - region at 0x60 should contain 0xAA
    for (0x60..0x80) |i| {
        try testing.expectEqual(@as(u8, 0xAA), try test_frame.memory.get8(i));
    }
    
    // Clear stack for next test
    test_frame.stack.size = 0;
    
    // Test Vector 2: Copy 16 bytes from offset 0x20 to offset 0x80
    try test_frame.stack.push(0x80); // destination offset
    try test_frame.stack.push(0x20); // source offset
    try test_frame.stack.push(0x10); // length (16 bytes)

    // Execute MCOPY operation
    _ = try blob.opMcopy(0, test_frame.interpreter, test_frame.frame);

    // Verify the copy - region at 0x80 should contain 0xBB
    for (0x80..0x90) |i| {
        try testing.expectEqual(@as(u8, 0xBB), try test_frame.memory.get8(i));
    }
}

/// Test MCOPY is disabled when EIP-5656 is not active
test "MCOPY disabled without EIP-5656" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Disable EIP-5656
    test_frame.interpreter.evm.chainRules.IsEIP5656 = false;

    // Prepare memory with test data
    try test_frame.memory.resize(128);
    
    // Initialize first 32 bytes
    for (0..32) |i| {
        try test_frame.memory.store8(i, @truncate(i));
    }

    // Setup stack for MCOPY operation test
    try test_frame.stack.push(64); // destination offset
    try test_frame.stack.push(0);  // source offset
    try test_frame.stack.push(32); // length

    // Execute MCOPY operation - should fail with InvalidOpcode
    const result = blob.opMcopy(0, test_frame.interpreter, test_frame.frame);
    
    // Verify operation failed with InvalidOpcode error
    try testing.expectError(ExecutionError.InvalidOpcode, result);
}

/// Test MCOPY memory size calculation function
test "MCOPY memory size calculation" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Test Case 1: Simple memory size
    try test_frame.stack.push(64); // destination offset
    try test_frame.stack.push(0);  // source offset
    try test_frame.stack.push(32); // length

    const mem_size1 = blob.mcopyMemorySize(test_frame.stack);
    try testing.expectEqual(@as(u64, 96), mem_size1.size); // 64 + 32 = 96
    try testing.expect(!mem_size1.overflow);

    // Clear stack
    test_frame.stack.size = 0;

    // Test Case 2: Different offsets
    try test_frame.stack.push(32);  // destination offset
    try test_frame.stack.push(128); // source offset - this is larger
    try test_frame.stack.push(64);  // length

    const mem_size2 = blob.mcopyMemorySize(test_frame.stack);
    try testing.expectEqual(@as(u64, 192), mem_size2.size); // max(128+64, 32+64) = 192
    try testing.expect(!mem_size2.overflow);

    // Clear stack
    test_frame.stack.size = 0;

    // Test Case 3: Overflow detection (source)
    try test_frame.stack.push(0);                   // destination offset
    try test_frame.stack.push(0xFFFFFFFFFFFFFFFF);  // source offset - max u64
    try test_frame.stack.push(1);                   // length - adding 1 would overflow

    const mem_size3 = blob.mcopyMemorySize(test_frame.stack);
    try testing.expect(mem_size3.overflow);

    // Clear stack
    test_frame.stack.size = 0;

    // Test Case 4: Overflow detection (destination)
    try test_frame.stack.push(0xFFFFFFFFFFFFFFFF);  // destination offset - max u64
    try test_frame.stack.push(0);                   // source offset 
    try test_frame.stack.push(1);                   // length - adding 1 would overflow

    const mem_size4 = blob.mcopyMemorySize(test_frame.stack);
    try testing.expect(mem_size4.overflow);
}

/// Test MCOPY dynamic gas calculation
test "MCOPY dynamic gas calculation" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Prepare memory with initial capacity
    try test_frame.memory.resize(64);

    // Test Case 1: Basic gas calculation for a single word (32 bytes)
    try test_frame.stack.push(0);  // destination offset
    try test_frame.stack.push(0);  // source offset
    try test_frame.stack.push(32); // length (1 word)

    // Calculate gas cost - no expansion needed
    // Base cost: CopyGas (3) + 1 word cost (1) = 4
    const gas1 = try blob.mcopyDynamicGas(test_frame.interpreter, test_frame.frame, test_frame.stack, test_frame.memory, 0);
    try testing.expectEqual(@as(u64, 4), gas1);

    // Clear stack
    test_frame.stack.size = 0;

    // Test Case 2: Gas calculation for multi-word copy
    try test_frame.stack.push(0);   // destination offset
    try test_frame.stack.push(0);   // source offset
    try test_frame.stack.push(100); // length (4 words = 4 gas)

    // Calculate gas cost - no expansion needed
    // Base cost: CopyGas (3) + 4 word cost (4) = 7
    const gas2 = try blob.mcopyDynamicGas(test_frame.interpreter, test_frame.frame, test_frame.stack, test_frame.memory, 0);
    try testing.expectEqual(@as(u64, 7), gas2);

    // Clear stack
    test_frame.stack.size = 0;

    // Test Case 3: Gas calculation with memory expansion
    try test_frame.stack.push(100); // destination offset - requires expansion
    try test_frame.stack.push(0);   // source offset
    try test_frame.stack.push(32);  // length (1 word)

    // Calculate gas cost with memory expansion
    // Base cost: CopyGas (3) + 1 word cost (1) = 4
    // Plus memory expansion cost
    const gas3 = try blob.mcopyDynamicGas(test_frame.interpreter, test_frame.frame, test_frame.stack, test_frame.memory, 0);
    try testing.expect(gas3 > 4); // Should be more due to memory expansion
}

/// Test same offset for source and destination (no-op)
test "MCOPY with same source and destination" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);

    // Prepare memory with test data
    try test_frame.memory.resize(64);
    
    // Initialize memory with pattern
    for (0..32) |i| {
        try test_frame.memory.store8(i, @truncate(i));
    }

    // Setup stack for MCOPY operation with same source and destination
    try test_frame.stack.push(0); // destination offset
    try test_frame.stack.push(0); // source offset - same as destination
    try test_frame.stack.push(32); // length

    // Execute MCOPY operation
    _ = try blob.opMcopy(0, test_frame.interpreter, test_frame.frame);

    // Check result - memory should remain unchanged
    for (0..32) |i| {
        try testing.expectEqual(@as(u8, @truncate(i)), try test_frame.memory.get8(i));
    }
}