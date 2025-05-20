const std = @import("std");
const testing = std.testing;
const memory_ops = @import("memory.zig");

// Direct imports for testing purposes only
const Contract = @import("../Contract.zig").Contract;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const Interpreter = @import("../interpreter.zig").Interpreter;
const Evm = @import("../evm.zig").Evm;
const ChainRules = @import("../evm.zig").ChainRules;
const Memory = @import("../Memory.zig").Memory;
const Stack = @import("../Stack.zig").Stack;
const JumpTable = @import("../JumpTable.zig");
const Address = @import("../../Address/address.zig").Address;

/// Creates a mock contract for testing
fn createMockContract(allocator: std.mem.Allocator) !*Contract {
    const code = &[_]u8{0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
                      0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f,
                      0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f};
    
    const contract = try allocator.create(Contract);
    contract.* = Contract{
        .code = code,
        .input = &[_]u8{},
        .address = Address.zero(),
        .code_address = Address.zero(),
        .value = 0,
        .gas = 100000,
        .gas_refund = 0,
    };
    return contract;
}

/// Creates a mock EVM instance
fn createMockEvm(allocator: std.mem.Allocator) !*Evm {
    const evm = try allocator.create(Evm);
    evm.* = Evm{
        .depth = 0,
        .readOnly = false,
        .chainRules = ChainRules{
            .IsHomestead = true,
            .IsEIP150 = true,
            .IsEIP158 = true,
            .IsEIP1559 = true,
            .IsEIP3855 = true, // Enable PUSH0
        },
        .state_manager = null,
    };
    return evm;
}

/// Creates a mock interpreter for testing
fn createMockInterpreter(allocator: std.mem.Allocator) !*Interpreter {
    // Create mock EVM
    const evm = try createMockEvm(allocator);
    
    // Create and initialize an interpreter
    const interpreter = try allocator.create(Interpreter);
    interpreter.* = Interpreter{
        .allocator = allocator,
        .evm = evm,
        .table = JumpTable.JumpTable.init(),
        .readOnly = false,
        .returnData = null,
        .logger = undefined,
    };
    
    return interpreter;
}

test "MLOAD and MSTORE operations" {
    const allocator = testing.allocator;
    
    // Create mock objects
    const contract = try createMockContract(allocator);
    defer allocator.destroy(contract);
    
    const interpreter = try createMockInterpreter(allocator);
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