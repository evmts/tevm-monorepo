const std = @import("std");
const environment = @import("environment.zig");

// For testing, we need to use direct file imports rather than module paths
// This avoids build system dependency issues during testing
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const Memory = @import("../Memory.zig").Memory;
const Stack = @import("../Stack.zig").Stack;
const Contract = @import("../Contract.zig").Contract;
const Address = @import("../../Address/address.zig").Address;
const Evm = @import("../evm.zig").Evm;
const JumpTable = @import("../JumpTable.zig");

// Test setup: Create a frame and contract for testing opcodes
// For simplicity, we'll create minimal stubs rather than using the actual types
fn setupTestEnvironment(allocator: std.mem.Allocator) !struct {
    frame: *Frame,
    evm: Evm,
    interpreter: *Interpreter
} {
    // Create test EVM
    var evm = Evm.init();
    
    // Create a simple memory for frame
    var memory = Memory.init(allocator);
    
    // Create a simple stack for frame
    var stack = Stack.init();
    
    // Create a simplified frame for testing
    var frame = try allocator.create(Frame);
    frame.* = .{
        .memory = memory,
        .stack = stack,
        .gas = 1000000,
    };
    
    // Create interpreter with jump table
    var jumpTable = JumpTable.JumpTable.init();
    try environment.registerEnvironmentOpcodes(allocator, &jumpTable);
    
    var interpreter = try allocator.create(Interpreter);
    interpreter.* = .{
        .allocator = allocator,
        .evm = evm,
    };
    
    return .{ 
        .frame = frame, 
        .evm = evm,
        .interpreter = interpreter
    };
}

// Test the ADDRESS opcode
test "environment - ADDRESS opcode" {
    const allocator = std.testing.allocator;
    
    var test_env = try setupTestEnvironment(allocator);
    defer test_env.frame.deinit();
    defer test_env.interpreter.deinit();
    
    // Execute ADDRESS opcode
    _ = try environment.opAddress(0, &test_env.interpreter, &test_env.frame);
    
    // Check stack has one item
    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);
    
    // Convert the contract address to u256 for comparison
    var expected_value: u256 = 0;
    for (test_env.contract.address.bytes) |byte| {
        expected_value = (expected_value << 8) | byte;
    }
    
    // Check the stack value matches the contract address
    try std.testing.expectEqual(expected_value, test_env.frame.stack.data[0]);
}

// Test the CALLER opcode
test "environment - CALLER opcode" {
    const allocator = std.testing.allocator;
    
    var test_env = try setupTestEnvironment(allocator);
    defer test_env.frame.deinit();
    defer test_env.interpreter.deinit();
    
    // Execute CALLER opcode
    _ = try environment.opCaller(0, &test_env.interpreter, &test_env.frame);
    
    // Check stack has one item
    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);
    
    // Convert the caller address to u256 for comparison
    var expected_value: u256 = 0;
    for (test_env.contract.caller.bytes) |byte| {
        expected_value = (expected_value << 8) | byte;
    }
    
    // Check the stack value matches the caller address
    try std.testing.expectEqual(expected_value, test_env.frame.stack.data[0]);
}

// Test the CALLVALUE opcode
test "environment - CALLVALUE opcode" {
    const allocator = std.testing.allocator;
    
    var test_env = try setupTestEnvironment(allocator);
    defer test_env.frame.deinit();
    defer test_env.interpreter.deinit();
    
    // Execute CALLVALUE opcode
    _ = try environment.opCallValue(0, &test_env.interpreter, &test_env.frame);
    
    // Check stack has one item
    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);
    
    // Check the stack value matches the contract value
    try std.testing.expectEqual(test_env.contract.value, test_env.frame.stack.data[0]);
}

// Test the CALLDATASIZE opcode
test "environment - CALLDATASIZE opcode" {
    const allocator = std.testing.allocator;
    
    var test_env = try setupTestEnvironment(allocator);
    defer test_env.frame.deinit();
    defer test_env.interpreter.deinit();
    
    // Execute CALLDATASIZE opcode
    _ = try environment.opCalldatasize(0, &test_env.interpreter, &test_env.frame);
    
    // Check stack has one item
    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);
    
    // Check the stack value matches the input data length
    try std.testing.expectEqual(@as(u256, 4), test_env.frame.stack.data[0]);
}

// Test the CALLDATALOAD opcode
test "environment - CALLDATALOAD opcode" {
    const allocator = std.testing.allocator;
    
    var test_env = try setupTestEnvironment(allocator);
    defer test_env.frame.deinit();
    defer test_env.interpreter.deinit();
    
    // Push an offset onto the stack
    try test_env.frame.stack.push(0);
    
    // Execute CALLDATALOAD opcode
    _ = try environment.opCalldataload(0, &test_env.interpreter, &test_env.frame);
    
    // Check stack has one item
    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);
    
    // Calculate expected value: our calldata (0xAABBCCDD) padded with zeros
    const expected_value: u256 = 0xAABBCCDD00000000000000000000000000000000000000000000000000000000;
    
    // Check the stack value matches the expected padded data
    try std.testing.expectEqual(expected_value, test_env.frame.stack.data[0]);
}

// Test the CODESIZE opcode
test "environment - CODESIZE opcode" {
    const allocator = std.testing.allocator;
    
    var test_env = try setupTestEnvironment(allocator);
    defer test_env.frame.deinit();
    defer test_env.interpreter.deinit();
    
    // Execute CODESIZE opcode
    _ = try environment.opCodesize(0, &test_env.interpreter, &test_env.frame);
    
    // Check stack has one item
    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);
    
    // Check the stack value matches the code length
    try std.testing.expectEqual(@as(u256, 5), test_env.frame.stack.data[0]);
}

// Test the CALLDATACOPY opcode
test "environment - CALLDATACOPY opcode" {
    const allocator = std.testing.allocator;
    
    var test_env = try setupTestEnvironment(allocator);
    defer test_env.frame.deinit();
    defer test_env.interpreter.deinit();
    
    // Push parameters onto the stack (size, offset, destOffset)
    try test_env.frame.stack.push(0x20); // Size: 32 bytes
    try test_env.frame.stack.push(0);    // Offset: 0
    try test_env.frame.stack.push(0);    // Destination offset: 0
    
    // Execute CALLDATACOPY opcode
    _ = try environment.opCalldatacopy(0, &test_env.interpreter, &test_env.frame);
    
    // Check that memory has been expanded to at least 32 bytes
    try std.testing.expect(test_env.frame.memory.len() >= 32);
    
    // Check that the first 4 bytes of memory match our calldata
    try std.testing.expectEqual(@as(u8, 0xAA), test_env.frame.memory.data()[0]);
    try std.testing.expectEqual(@as(u8, 0xBB), test_env.frame.memory.data()[1]);
    try std.testing.expectEqual(@as(u8, 0xCC), test_env.frame.memory.data()[2]);
    try std.testing.expectEqual(@as(u8, 0xDD), test_env.frame.memory.data()[3]);
    
    // The rest should be padded with zeros
    for (4..32) |i| {
        try std.testing.expectEqual(@as(u8, 0), test_env.frame.memory.data()[i]);
    }
}

// Test the CODECOPY opcode
test "environment - CODECOPY opcode" {
    const allocator = std.testing.allocator;
    
    var test_env = try setupTestEnvironment(allocator);
    defer test_env.frame.deinit();
    defer test_env.interpreter.deinit();
    
    // Push parameters onto the stack (size, offset, destOffset)
    try test_env.frame.stack.push(0x20); // Size: 32 bytes
    try test_env.frame.stack.push(0);    // Offset: 0
    try test_env.frame.stack.push(0);    // Destination offset: 0
    
    // Execute CODECOPY opcode
    _ = try environment.opCodecopy(0, &test_env.interpreter, &test_env.frame);
    
    // Check that memory has been expanded to at least 32 bytes
    try std.testing.expect(test_env.frame.memory.len() >= 32);
    
    // Check that the first 5 bytes of memory match our code
    try std.testing.expectEqual(@as(u8, 0x60), test_env.frame.memory.data()[0]);
    try std.testing.expectEqual(@as(u8, 0x01), test_env.frame.memory.data()[1]);
    try std.testing.expectEqual(@as(u8, 0x60), test_env.frame.memory.data()[2]);
    try std.testing.expectEqual(@as(u8, 0x02), test_env.frame.memory.data()[3]);
    try std.testing.expectEqual(@as(u8, 0x01), test_env.frame.memory.data()[4]);
    
    // The rest should be padded with zeros
    for (5..32) |i| {
        try std.testing.expectEqual(@as(u8, 0), test_env.frame.memory.data()[i]);
    }
}

// Test the RETURNDATASIZE and RETURNDATACOPY opcodes
test "environment - RETURNDATASIZE and RETURNDATACOPY opcodes" {
    const allocator = std.testing.allocator;
    
    var test_env = try setupTestEnvironment(allocator);
    defer test_env.frame.deinit();
    defer test_env.interpreter.deinit();
    
    // Set return data in the frame
    const return_data = [_]u8{ 0x12, 0x34, 0x56, 0x78 };
    try test_env.frame.setReturnData(&return_data);
    
    // Execute RETURNDATASIZE opcode
    _ = try environment.opReturndatasize(0, &test_env.interpreter, &test_env.frame);
    
    // Check stack has one item
    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);
    
    // Check the stack value matches the return data length
    try std.testing.expectEqual(@as(u256, 4), test_env.frame.stack.data[0]);
    
    // Clear the stack
    _ = try test_env.frame.stack.pop();
    
    // Push parameters onto the stack for RETURNDATACOPY (size, offset, destOffset)
    try test_env.frame.stack.push(4);    // Size: 4 bytes
    try test_env.frame.stack.push(0);    // Offset: 0
    try test_env.frame.stack.push(0);    // Destination offset: 0
    
    // Execute RETURNDATACOPY opcode
    _ = try environment.opReturndatacopy(0, &test_env.interpreter, &test_env.frame);
    
    // Check that memory has been expanded to at least 4 bytes
    try std.testing.expect(test_env.frame.memory.len() >= 4);
    
    // Check that the first 4 bytes of memory match our return data
    try std.testing.expectEqual(@as(u8, 0x12), test_env.frame.memory.data()[0]);
    try std.testing.expectEqual(@as(u8, 0x34), test_env.frame.memory.data()[1]);
    try std.testing.expectEqual(@as(u8, 0x56), test_env.frame.memory.data()[2]);
    try std.testing.expectEqual(@as(u8, 0x78), test_env.frame.memory.data()[3]);
}

// Test the GASPRICE opcode
test "environment - GASPRICE opcode" {
    const allocator = std.testing.allocator;
    
    var test_env = try setupTestEnvironment(allocator);
    defer test_env.frame.deinit();
    defer test_env.interpreter.deinit();
    
    // Execute GASPRICE opcode
    _ = try environment.opGasprice(0, &test_env.interpreter, &test_env.frame);
    
    // Check stack has one item
    try std.testing.expectEqual(@as(usize, 1), test_env.frame.stack.size);
    
    // For our implementation, we expect a hardcoded value of 1 gwei
    try std.testing.expectEqual(@as(u256, 1000000000), test_env.frame.stack.data[0]);
}