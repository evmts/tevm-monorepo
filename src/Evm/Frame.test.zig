const std = @import("std");
const Frame = @import("Frame.zig").Frame;
const ExecutionError = @import("Frame.zig").ExecutionError;
const Contract = @import("Contract.zig").Contract;
const Address = @import("Address");

test "Frame initialization and basic operations" {
    const allocator = std.testing.allocator;
    
    // Create a test contract
    const caller = Address.createAddress("0x1111111111111111111111111111111111111111");
    const contract_addr = Address.createAddress("0x2222222222222222222222222222222222222222");
    var contract = Contract.init(caller, contract_addr, 100, 1000, null);
    
    // Initialize a frame with the contract
    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    
    // Test initial state
    try std.testing.expectEqual(@as(usize, 0), frame.pc);
    try std.testing.expectEqual(@as(u64, 0), frame.cost);
    try std.testing.expect(frame.err == null);
    
    // Test memory operations
    try frame.memory.resize(64);
    try std.testing.expectEqual(@as(u64, 64), frame.memory.len());
    
    // Test stack operations
    try frame.stack.push(42);
    try std.testing.expectEqual(@as(usize, 1), frame.stack.len());
    
    // Test return data
    const test_data = [_]u8{ 1, 2, 3, 4 };
    try frame.setReturnData(&test_data);
    try std.testing.expectEqual(@as(usize, 4), frame.returnSize);
    try std.testing.expectEqualSlices(u8, &test_data, frame.returnData.?);
    
    // Test contract access
    try std.testing.expectEqual(caller, frame.caller());
    try std.testing.expectEqual(contract_addr, frame.address());
    try std.testing.expectEqual(@as(u256, 100), frame.callValue());
}

test "Frame memory and stack access" {
    const allocator = std.testing.allocator;
    
    // Create a test contract
    const caller = Address.createAddress("0x1111111111111111111111111111111111111111");
    const contract_addr = Address.createAddress("0x2222222222222222222222222222222222222222");
    var contract = Contract.init(caller, contract_addr, 100, 1000, null);
    
    // Initialize a frame with the contract
    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    
    // Test memory operations
    try frame.memory.resize(32);
    const data = [_]u8{0xFF} ** 8;
    frame.memory.set(0, data.len, &data);
    
    const mem_data = frame.memoryData();
    try std.testing.expectEqualSlices(u8, &data, mem_data[0..data.len]);
    
    // Test stack operations
    try frame.stack.push(123);
    try frame.stack.push(456);
    
    const stack_data = frame.stackData();
    try std.testing.expectEqual(@as(usize, 2), stack_data.len);
    try std.testing.expectEqual(@as(u256, 123), stack_data[0]);
    try std.testing.expectEqual(@as(u256, 456), stack_data[1]);
}

test "Frame error handling" {
    const allocator = std.testing.allocator;
    
    // Create a test contract
    const caller = Address.createAddress("0x1111111111111111111111111111111111111111");
    const contract_addr = Address.createAddress("0x2222222222222222222222222222222222222222");
    var contract = Contract.init(caller, contract_addr, 100, 1000, null);
    
    // Initialize a frame with the contract
    var frame = try Frame.init(allocator, &contract);
    defer frame.deinit();
    
    // Set error
    frame.err = ExecutionError.OutOfGas;
    
    // Verify error
    try std.testing.expectEqual(ExecutionError.OutOfGas, frame.err.?);
}