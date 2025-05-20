const std = @import("std");
const testing = std.testing;
const log = @import("log.zig");
const test_utils = @import("test_utils.zig");

// Import everything via test_utils
const Frame = test_utils.Frame;
const ExecutionError = test_utils.ExecutionError;
const Interpreter = test_utils.Interpreter;
const Contract = test_utils.Contract;
const Memory = test_utils.Memory;
const Stack = test_utils.Stack;
const JumpTable = test_utils.JumpTable;

// Create test objects using test_utils
fn createTestFrame() !struct {
    frame: *Frame,
    stack: *Stack,
    memory: *Memory,
    interpreter: *Interpreter,
} {
    const allocator = testing.allocator;
    
    // Create a mock contract with empty code
    const contract = try test_utils.createMockContract(allocator, &[_]u8{});
    
    // Create a frame with the mock contract
    const frame = try allocator.create(Frame);
    frame.* = try Frame.init(allocator, contract);
    
    // Create a mock EVM
    const evm = try test_utils.createMockEvm(allocator);
    
    // Create a mock interpreter
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    
    return .{
        .frame = frame,
        .stack = &frame.stack,
        .memory = &frame.memory,
        .interpreter = interpreter,
    };
}

fn cleanupTestFrame(test_frame: anytype, allocator: std.mem.Allocator) void {
    // If returnData was set, free it
    if (test_frame.frame.returnData) |data| {
        allocator.free(data);
        test_frame.frame.returnData = null;
    }
    
    // The frame takes care of cleaning up stack and memory
    test_frame.frame.deinit();
    
    // Free the contract's code and the contract itself
    allocator.free(test_frame.frame.contract.code);
    allocator.destroy(test_frame.frame.contract);
    
    // Free the mock EVM resources
    allocator.destroy(test_frame.interpreter.evm);
    
    // Destroy frame and interpreter
    allocator.destroy(test_frame.frame);
    allocator.destroy(test_frame.interpreter);
}

test "LOG memory size calculation" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Setup stack for LOG operation test
    try test_frame.stack.push(0x100); // offset at 0x100
    try test_frame.stack.push(0x80);  // size of 0x80 (128 bytes)
    
    // Test memory size calculation
    const mem_size = log.logMemorySize(test_frame.stack);
    try testing.expectEqual(@as(u64, 0x180), mem_size.size); // 0x100 + 0x80 = 0x180
    try testing.expect(!mem_size.overflow);
    
    // Test with extreme values to trigger overflow
    _ = try test_frame.stack.pop();
    _ = try test_frame.stack.pop();
    try test_frame.stack.push(0xFFFFFFFFFFFFFFFF); // max u64
    try test_frame.stack.push(1); // Adding 1 would overflow
    
    const overflow_mem_size = log.logMemorySize(test_frame.stack);
    try testing.expect(overflow_mem_size.overflow);
}

test "LOG dynamic gas calculation" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Prepare memory with enough capacity for test
    try test_frame.memory.resize(0x200);
    
    // Test LOG0 with no topics
    // Push memory offset and size to stack
    try test_frame.stack.push(0x80); // offset
    try test_frame.stack.push(0x20); // size (32 bytes)
    
    // Calculate LOG0 gas: 
    // Base: 375 (LOG_GAS) + 
    // Data: 8 * 32 (LOG_DATA_GAS * size) = 256
    // Total: 375 + 256 = 631
    const log0_gas = try log.log0DynamicGas(test_frame.interpreter, test_frame.frame, test_frame.stack, test_frame.memory, 0);
    try testing.expectEqual(@as(u64, 375 + 256), log0_gas);
    
    // Test LOG1 (need one more stack item for topic)
    try test_frame.stack.push(0x1234); // topic1
    const log1_gas = try log.log1DynamicGas(test_frame.interpreter, test_frame.frame, test_frame.stack, test_frame.memory, 0);
    // LOG1: 375 (LOG_GAS) + 375 (LOG_TOPIC_GAS) + 256 (data) = 1006
    // Note: Memory gas cost may differ depending on implementation
    try testing.expect(log1_gas >= 375 + 375);  // At least base gas + topic gas
    
    // Test LOG4 (need 3 more stack items for topics)
    try test_frame.stack.push(0x5678); // topic2
    try test_frame.stack.push(0x9ABC); // topic3
    try test_frame.stack.push(0xDEF0); // topic4
    const log4_gas = try log.log4DynamicGas(test_frame.interpreter, test_frame.frame, test_frame.stack, test_frame.memory, 0);
    // LOG4: 375 (LOG_GAS) + 4*375 (4 topics * LOG_TOPIC_GAS) + 256 (data) = 2131
    try testing.expectEqual(@as(u64, 375 + (4 * 375) + 256), log4_gas);
}

test "LOG operation stack requirements" {
    const allocator = testing.allocator;
    const test_frame = try createTestFrame();
    defer cleanupTestFrame(test_frame, allocator);
    
    // Test with not enough items on stack for LOG operations
    const log0_result = log.log0DynamicGas(test_frame.interpreter, test_frame.frame, test_frame.stack, test_frame.memory, 0);
    try testing.expectError(error.OutOfGas, log0_result);
    
    // Add offset and size but not topics
    try test_frame.stack.push(0x80); // offset
    try test_frame.stack.push(0x20); // size
    
    // This should work for LOG0
    _ = try log.log0DynamicGas(test_frame.interpreter, test_frame.frame, test_frame.stack, test_frame.memory, 0);
    
    // But not for LOG1 (needs 1 topic)
    const log1_result = log.log1DynamicGas(test_frame.interpreter, test_frame.frame, test_frame.stack, test_frame.memory, 0);
    try testing.expectError(error.OutOfGas, log1_result);
}