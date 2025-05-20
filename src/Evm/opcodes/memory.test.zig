const std = @import("std");
const testing = std.testing;
const memory_ops = @import("memory.zig");
const test_utils = @import("test_utils.zig");
const Frame = test_utils.Frame;
const Contract = test_utils.Contract;
const Interpreter = test_utils.Interpreter;
const Memory = test_utils.Memory;
const Stack = test_utils.Stack;
const Evm = test_utils.Evm;
const JumpTable = test_utils.JumpTable;

test "MLOAD and MSTORE operations" {
    const allocator = testing.allocator;
    
    // Create mock objects
    const contract = try test_utils.createBasicMockContract(allocator);
    defer allocator.destroy(contract);
    
    const interpreter = try test_utils.createBasicMockInterpreter(allocator);
    defer allocator.destroy(interpreter);
    
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Test MSTORE first to set a value in memory
    try frame.stack.push(0);  // memory offset
    try frame.stack.push(42); // value to store
    try frame.memory.resize(32); // make sure memory is initialized
    
    // Execute MSTORE
    _ = try memory_ops.opMstore(0, interpreter, &frame);
    
    // Now check the memory content
    const memory_content = frame.memory.getPtr(0, 32);
    
    // The value 42 should be stored in big-endian format at offset 0
    const expected_value: u256 = 42;
    var expected_bytes: [32]u8 = [_]u8{0} ** 32;
    expected_bytes[31] = 42; // Lowest byte of 42 in big-endian
    
    // Test that the memory contains the expected value
    try testing.expectEqualSlices(u8, &expected_bytes, memory_content);
    
    // Now test MLOAD to retrieve the value
    try frame.stack.push(0); // memory offset to load from
    
    // Execute MLOAD
    _ = try memory_ops.opMload(0, interpreter, &frame);
    
    // Verify the loaded value
    const loaded_value = try frame.stack.pop();
    try testing.expectEqual(expected_value, loaded_value);
}

test "MSTORE8 operation" {
    const allocator = testing.allocator;
    
    // Create mock objects
    const contract = try test_utils.createBasicMockContract(allocator);
    defer allocator.destroy(contract);
    
    const interpreter = try test_utils.createBasicMockInterpreter(allocator);
    defer allocator.destroy(interpreter);
    
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Test MSTORE8 to store a single byte
    try frame.stack.push(10);     // memory offset
    try frame.stack.push(0xABCD); // value to store (only lowest byte 0xCD will be used)
    try frame.memory.resize(32);  // make sure memory is initialized
    
    // Execute MSTORE8
    _ = try memory_ops.opMstore8(0, interpreter, &frame);
    
    // Now check the memory content
    const memory_byte = frame.memory.getPtr(10, 1)[0];
    
    // Only the lowest byte 0xCD should be stored
    const expected_byte: u8 = 0xCD;
    
    // Test that the memory contains the expected byte
    try testing.expectEqual(expected_byte, memory_byte);
}

test "MSIZE operation" {
    const allocator = testing.allocator;
    
    // Create mock objects
    const contract = try test_utils.createBasicMockContract(allocator);
    defer allocator.destroy(contract);
    
    const interpreter = try test_utils.createBasicMockInterpreter(allocator);
    defer allocator.destroy(interpreter);
    
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Resize memory to a specific size
    const expected_size: u64 = 96; // 3 words
    try frame.memory.resize(expected_size);
    
    // Execute MSIZE
    _ = try memory_ops.opMsize(0, interpreter, &frame);
    
    // Verify the stack has the correct memory size
    const mem_size = try frame.stack.pop();
    try testing.expectEqual(@as(u256, expected_size), mem_size);
}

test "POP operation" {
    const allocator = testing.allocator;
    
    // Create mock objects
    const contract = try test_utils.createBasicMockContract(allocator);
    defer allocator.destroy(contract);
    
    const interpreter = try test_utils.createBasicMockInterpreter(allocator);
    defer allocator.destroy(interpreter);
    
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Push some values onto the stack
    try frame.stack.push(123);
    try frame.stack.push(456);
    
    // Initial stack size should be 2
    try testing.expectEqual(@as(usize, 2), frame.stack.size);
    
    // Execute POP
    _ = try memory_ops.opPop(0, interpreter, &frame);
    
    // Stack size should be 1
    try testing.expectEqual(@as(usize, 1), frame.stack.size);
    
    // Top of stack should now be 123
    const top = try frame.stack.peek();
    try testing.expectEqual(@as(u256, 123), top.*);
}

test "PUSH operations" {
    const allocator = testing.allocator;
    
    // Create mock objects
    const contract = try test_utils.createBasicMockContract(allocator);
    defer allocator.destroy(contract);
    
    const interpreter = try test_utils.createBasicMockInterpreter(allocator);
    defer allocator.destroy(interpreter);
    
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Test PUSH0
    _ = try memory_ops.opPush0(0, interpreter, &frame);
    
    // Verify stack has a zero
    var value = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), value);
    
    // Test PUSH1 - should push the byte at pc+1
    const pc = 0; // First byte in code is 0x00
    _ = try memory_ops.opPush1(pc, interpreter, &frame);
    
    // Verify stack has the correct value
    value = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0), value);
    
    // Test PUSH2 - should push two bytes at pc+1 and pc+2
    _ = try memory_ops.opPush2(pc, interpreter, &frame);
    
    // Verify stack has the correct value (bytes 0x00 and 0x01 = 0x0001)
    value = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 0x0001), value);
}

test "DUP operations" {
    const allocator = testing.allocator;
    
    // Create mock objects
    const contract = try test_utils.createBasicMockContract(allocator);
    defer allocator.destroy(contract);
    
    const interpreter = try test_utils.createBasicMockInterpreter(allocator);
    defer allocator.destroy(interpreter);
    
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Push some values onto the stack
    try frame.stack.push(111);
    try frame.stack.push(222);
    try frame.stack.push(333);
    
    // Test DUP1 - should duplicate the top value
    _ = try memory_ops.opDup1(0, interpreter, &frame);
    
    // Verify stack size and values
    try testing.expectEqual(@as(usize, 4), frame.stack.size);
    
    var value = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 333), value);
    
    value = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 333), value);
    
    // Test DUP2 - should duplicate the second value
    _ = try memory_ops.opDup2(0, interpreter, &frame);
    
    // Verify stack size and values
    try testing.expectEqual(@as(usize, 3), frame.stack.size);
    
    value = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 222), value);
}

test "SWAP operations" {
    const allocator = testing.allocator;
    
    // Create mock objects
    const contract = try test_utils.createBasicMockContract(allocator);
    defer allocator.destroy(contract);
    
    const interpreter = try test_utils.createBasicMockInterpreter(allocator);
    defer allocator.destroy(interpreter);
    
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Push some values onto the stack
    try frame.stack.push(111);
    try frame.stack.push(222);
    try frame.stack.push(333);
    
    // Test SWAP1 - should swap the top value with the second value
    _ = try memory_ops.opSwap1(0, interpreter, &frame);
    
    // Verify stack size and values
    try testing.expectEqual(@as(usize, 3), frame.stack.size);
    
    var value = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 222), value);
    
    value = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 333), value);
    
    // Test SWAP2 - should swap the top value with the third value
    try frame.stack.push(222);
    try frame.stack.push(333);
    _ = try memory_ops.opSwap2(0, interpreter, &frame);
    
    // Verify stack values
    value = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 111), value);
    
    value = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 222), value);
    
    value = try frame.stack.pop();
    try testing.expectEqual(@as(u256, 333), value);
}

test "Memory expansion gas calculation" {
    // Test basic memory expansion gas cost calculation
    const old_size: u64 = 0;
    const new_size: u64 = 32; // 1 word
    
    const gas_cost = memory_ops.memoryGasCost(old_size, new_size);
    
    // For 1 word, cost should be: 1*1*3 + 1*3 = 6
    try testing.expectEqual(@as(u64, 6), gas_cost);
    
    // Test larger expansion
    const old_size2: u64 = 32;
    const new_size2: u64 = 96; // 3 words
    
    const gas_cost2 = memory_ops.memoryGasCost(old_size2, new_size2);
    
    // For expanding from 1 word to 3 words:
    // new cost = 3*3*3 + 3*3 = 36
    // old cost = 1*1*3 + 1*3 = 6
    // difference = 30
    try testing.expectEqual(@as(u64, 30), gas_cost2);
}

test "Memory size calculations" {
    var stack = Stack{};
    
    // Test MLOAD memory size - empty stack
    var result = memory_ops.mloadMemorySize(&stack);
    try testing.expectEqual(@as(u64, 0), result.size);
    try testing.expectEqual(false, result.overflow);
    
    // Test MLOAD memory size - with value
    try stack.push(64); // Offset 64
    result = memory_ops.mloadMemorySize(&stack);
    try testing.expectEqual(@as(u64, 64 + 32), result.size);
    try testing.expectEqual(false, result.overflow);
    
    // Test MSTORE memory size
    _ = try stack.pop();
    try stack.push(100); // Value
    try stack.push(32); // Offset
    result = memory_ops.mstoreMemorySize(&stack);
    try testing.expectEqual(@as(u64, 32 + 32), result.size);
    try testing.expectEqual(false, result.overflow);
    
    // Test MSTORE8 memory size
    _ = try stack.pop();
    _ = try stack.pop();
    try stack.push(100); // Value
    try stack.push(128); // Offset
    result = memory_ops.mstore8MemorySize(&stack);
    try testing.expectEqual(@as(u64, 128 + 1), result.size);
    try testing.expectEqual(false, result.overflow);
}