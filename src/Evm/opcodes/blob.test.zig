const std = @import("std");
const testing = std.testing;
const test_utils = @import("test_utils.zig");
const blob = @import("blob.zig");

// Import types from test_utils
const Frame = test_utils.Frame;
const Contract = test_utils.Contract;
const Stack = test_utils.Stack;
const Memory = test_utils.Memory;
const Interpreter = test_utils.Interpreter;
const Evm = test_utils.Evm;
const ExecutionError = test_utils.ExecutionError;
const JumpTable = test_utils.JumpTable;
const Address = test_utils.Address;

// Helper to create test environment
fn createTestEnv(allocator: std.mem.Allocator) !struct {
    evm: *Evm,
    frame: *Frame,
    interpreter: *Interpreter,
} {
    // Create mock EVM with blob support
    const evm = try test_utils.createMockEvm(allocator);
    evm.chainRules.IsEIP4844 = true;
    evm.chainRules.IsEIP5656 = true;
    
    // Create mock contract
    const contract = try test_utils.createMockContract(allocator, &[_]u8{});
    
    // Create frame
    const frame = try test_utils.createMockFrame(allocator, contract);
    
    // Create interpreter
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    
    return .{
        .evm = evm,
        .frame = frame,
        .interpreter = interpreter,
    };
}

fn cleanupTestEnv(test_env: anytype, allocator: std.mem.Allocator) void {
    test_utils.cleanupMockFrame(test_env.frame, allocator);
    test_utils.cleanupMockInterpreter(test_env.interpreter, allocator);
    test_utils.cleanupMockEvm(test_env.evm, allocator);
}

test "BLOBHASH basic operation" {
    const allocator = testing.allocator;
    const test_env = try createTestEnv(allocator);
    defer cleanupTestEnv(test_env, allocator);
    
    // Set up test blob hashes
    const test_hashes = [_][32]u8{
        [_]u8{0x11} ** 32,
        [_]u8{0x22} ** 32,
        [_]u8{0x33} ** 32,
    };
    test_env.evm.setBlobHashes(&test_hashes);

    // Test index 0
    try test_env.frame.stack.push(0);
    _ = try blob.opBlobHash(0, test_env.interpreter, test_env.frame);
    try testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);
    const hash0 = try test_env.frame.stack.pop();
    // Expected: 0x1111...1111 (32 bytes of 0x11)
    const expected0: u256 = 0x1111111111111111111111111111111111111111111111111111111111111111;
    try testing.expectEqual(expected0, hash0);
    
    // Test index 1
    try test_env.frame.stack.push(1);
    _ = try blob.opBlobHash(0, test_env.interpreter, test_env.frame);
    const hash1 = try test_env.frame.stack.pop();
    const expected1: u256 = 0x2222222222222222222222222222222222222222222222222222222222222222;
    try testing.expectEqual(expected1, hash1);
    
    // Test out of bounds index (should return 0)
    try test_env.frame.stack.push(5);
    _ = try blob.opBlobHash(0, test_env.interpreter, test_env.frame);
    const hash_oob = try test_env.frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), hash_oob);
}

test "BLOBBASEFEE basic operation" {
    const allocator = testing.allocator;
    const test_env = try createTestEnv(allocator);
    defer cleanupTestEnv(test_env, allocator);
    
    // Set blob base fee
    const test_blob_base_fee: u256 = 123456789;
    test_env.evm.setBlobBaseFee(test_blob_base_fee);

    // Execute BLOBBASEFEE operation
    _ = try blob.opBlobBaseFee(0, test_env.interpreter, test_env.frame);

    // Check result - should have one item on stack
    try testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);
    try testing.expectEqual(test_blob_base_fee, test_env.frame.stack.data[0]);
}

test "MCOPY basic operation" {
    const allocator = testing.allocator;
    const test_env = try createTestEnv(allocator);
    defer cleanupTestEnv(test_env, allocator);

    // Prepare memory with test data
    try test_env.frame.memory.resize(128);
    // Set memory data using safe methods
    for (0..64) |i| {
        try test_env.frame.memory.store8(i, @truncate(i));
    }

    // Setup stack for MCOPY operation test
    try test_env.frame.stack.push(64); // destination offset
    try test_env.frame.stack.push(0); // source offset
    try test_env.frame.stack.push(32); // length

    // Execute MCOPY operation
    _ = try blob.opMcopy(0, test_env.interpreter, test_env.frame);

    // Check result - memory should be copied correctly
    for (0..32) |i| {
        try testing.expectEqual(@as(u8, @truncate(i)), test_env.frame.memory.get8(64 + i));
    }
}

test "MCOPY memory size calculation" {
    const allocator = testing.allocator;
    const test_env = try createTestEnv(allocator);
    defer cleanupTestEnv(test_env, allocator);

    // Setup stack for MCOPY memory size test
    try test_env.frame.stack.push(64); // destination offset
    try test_env.frame.stack.push(0); // source offset
    try test_env.frame.stack.push(32); // length

    // Test memory size calculation
    const mem_size = blob.mcopyMemorySize(&test_env.frame.stack);
    try testing.expectEqual(@as(u64, 96), mem_size.size); // 64 + 32 = 96
    try testing.expect(!mem_size.overflow);

    // Test with extreme values to trigger overflow
    _ = try test_env.frame.stack.pop();
    _ = try test_env.frame.stack.pop();
    _ = try test_env.frame.stack.pop();

    try test_env.frame.stack.push(0xFFFFFFFFFFFFFFFF); // dest - max u64
    try test_env.frame.stack.push(0); // source
    try test_env.frame.stack.push(1); // length - adding 1 would overflow

    const overflow_mem_size = blob.mcopyMemorySize(&test_env.frame.stack);
    try testing.expect(overflow_mem_size.overflow);
}

test "MCOPY dynamic gas calculation" {
    const allocator = testing.allocator;
    const test_env = try createTestEnv(allocator);
    defer cleanupTestEnv(test_env, allocator);

    // Prepare memory with enough capacity for test
    try test_env.frame.memory.resize(64);

    // Setup stack for MCOPY gas calculation test
    try test_env.frame.stack.push(0); // destination offset
    try test_env.frame.stack.push(0); // source offset
    try test_env.frame.stack.push(32); // length

    // Calculate MCOPY gas
    // Base cost: CopyGas (3) + 1 word cost (1) = 4
    const mcopy_gas = try blob.mcopyDynamicGas(test_env.interpreter, test_env.frame, &test_env.frame.stack, &test_env.frame.memory, 0);
    try testing.expectEqual(@as(u64, 4), mcopy_gas);

    // Test with larger memory expansion
    _ = try test_env.frame.stack.pop();
    _ = try test_env.frame.stack.pop();
    _ = try test_env.frame.stack.pop();

    try test_env.frame.stack.push(100); // destination offset
    try test_env.frame.stack.push(0); // source offset
    try test_env.frame.stack.push(32); // length

    // Calculate MCOPY gas with memory expansion
    // Base cost: CopyGas (3) + 1 word cost (1) = 4
    // Plus memory expansion cost
    const mcopy_gas_with_expansion = try blob.mcopyDynamicGas(test_env.interpreter, test_env.frame, &test_env.frame.stack, &test_env.frame.memory, 0);
    try testing.expect(mcopy_gas_with_expansion > 4); // Should be more due to memory expansion
}
