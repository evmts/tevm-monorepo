const std = @import("std");
const controlflow = @import("controlflow.zig");
const test_utils = @import("test_utils.zig");

// Import everything via test_utils
const Frame = test_utils.Frame;
const ExecutionError = test_utils.ExecutionError;
const Interpreter = test_utils.Interpreter;
const Evm = test_utils.Evm;
const Contract = test_utils.Contract;
const Memory = test_utils.Memory;
const Stack = test_utils.Stack;

// Use the test_utils module for creating mock objects

// Test the JUMP opcode
test "JUMP opcode" {
    const allocator = std.testing.allocator;
    
    // Create a simple contract with JUMPDEST at position 3
    const code = [_]u8{ 0x60, 0x03, 0x56, 0x5B, 0x00 }; // PUSH1 0x03, JUMP, JUMPDEST, STOP
    const contract = try test_utils.createMockContract(allocator, &code);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up the stack with a jump destination
    try frame.stack.push(3); // Destination is position 3 (JUMPDEST)
    frame.pc = 2; // PC is at the JUMP opcode
    
    // Create a mock EVM and interpreter
    const evm = try test_utils.createMockEvm(allocator);
    defer allocator.destroy(evm);
    
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    defer allocator.destroy(interpreter);
    
    // Execute the JUMP opcode
    _ = try controlflow.opJump(frame.pc, interpreter, &frame);
    
    // Check if PC was updated correctly (should be at JUMPDEST)
    try std.testing.expectEqual(@as(usize, 2), frame.pc); // One less because interpreter will increment
}

// Test the JUMPI opcode with condition true
test "JUMPI opcode - condition true" {
    const allocator = std.testing.allocator;
    
    // Create a simple contract with JUMPDEST at position 4
    const code = [_]u8{ 0x60, 0x04, 0x60, 0x01, 0x57, 0x5B, 0x00 }; // PUSH1 0x04, PUSH1 0x01, JUMPI, JUMPDEST, STOP
    const contract = try test_utils.createMockContract(allocator, &code);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up the stack with destination and condition
    try frame.stack.push(4); // Destination is position 4 (JUMPDEST)
    try frame.stack.push(1); // Condition is true (non-zero)
    frame.pc = 4; // PC is at the JUMPI opcode
    
    // Create a mock EVM and interpreter
    const evm = try test_utils.createMockEvm(allocator);
    defer allocator.destroy(evm);
    
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    defer allocator.destroy(interpreter);
    
    // Execute the JUMPI opcode
    _ = try controlflow.opJumpi(frame.pc, interpreter, &frame);
    
    // Check if PC was updated correctly (should be at JUMPDEST)
    try std.testing.expectEqual(@as(usize, 3), frame.pc); // One less because interpreter will increment
}

// Test the JUMPI opcode with condition false
test "JUMPI opcode - condition false" {
    const allocator = std.testing.allocator;
    
    // Create a simple contract with JUMPDEST at position 4
    const code = [_]u8{ 0x60, 0x04, 0x60, 0x00, 0x57, 0x5B, 0x00 }; // PUSH1 0x04, PUSH1 0x00, JUMPI, JUMPDEST, STOP
    const contract = try test_utils.createMockContract(allocator, &code);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up the stack with destination and condition
    try frame.stack.push(4); // Destination is position 4 (JUMPDEST)
    try frame.stack.push(0); // Condition is false (zero)
    frame.pc = 4; // PC is at the JUMPI opcode
    
    // Create a mock EVM and interpreter
    const evm = try test_utils.createMockEvm(allocator);
    defer allocator.destroy(evm);
    
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    defer allocator.destroy(interpreter);
    
    // Execute the JUMPI opcode
    _ = try controlflow.opJumpi(frame.pc, interpreter, &frame);
    
    // Check if PC was not updated (should remain at JUMPI)
    try std.testing.expectEqual(@as(usize, 4), frame.pc);
}

// Test the PC opcode
test "PC opcode" {
    const allocator = std.testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0x58, 0x00 }; // PC, STOP
    const contract = try test_utils.createMockContract(allocator, &code);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    frame.pc = 0; // PC is at the PC opcode
    
    // Create a mock EVM and interpreter
    const evm = try test_utils.createMockEvm(allocator);
    defer allocator.destroy(evm);
    
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    defer allocator.destroy(interpreter);
    
    // Execute the PC opcode
    _ = try controlflow.opPc(frame.pc, interpreter, &frame);
    
    // Check if the stack contains the correct PC value
    try std.testing.expectEqual(@as(usize, 1), frame.stack.size);
    const pc_value = frame.stack.data[0];
    try std.testing.expectEqual(@as(u64, 0), pc_value); // PC was 0 before execution
}

// Test the JUMPDEST opcode
test "JUMPDEST opcode" {
    const allocator = std.testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0x5B, 0x00 }; // JUMPDEST, STOP
    const contract = try test_utils.createMockContract(allocator, &code);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    frame.pc = 0; // PC is at the JUMPDEST opcode
    
    // Create a mock EVM and interpreter
    const evm = try test_utils.createMockEvm(allocator);
    defer allocator.destroy(evm);
    
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    defer allocator.destroy(interpreter);
    
    // Execute the JUMPDEST opcode
    _ = try controlflow.opJumpdest(frame.pc, interpreter, &frame);
    
    // JUMPDEST does nothing, just check that it doesn't crash
    try std.testing.expect(true);
}

// Test the STOP opcode
test "STOP opcode" {
    const allocator = std.testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0x00 }; // STOP
    const contract = try test_utils.createMockContract(allocator, &code);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Create a mock EVM and interpreter
    const evm = try test_utils.createMockEvm(allocator);
    defer allocator.destroy(evm);
    
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    defer allocator.destroy(interpreter);
    
    // Execute the STOP opcode and expect STOP error
    const result = controlflow.opStop(0, interpreter, &frame);
    try std.testing.expectError(ExecutionError.STOP, result);
}

// Test the RETURN opcode
test "RETURN opcode" {
    const allocator = std.testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0xF3 }; // RETURN
    const contract = try test_utils.createMockContract(allocator, &code);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up memory with some data
    for (0..4) |i| {
        try frame.memory.store8(i, @truncate(0xaa + i));
    }
    
    // Set up the stack with offset and size
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(4); // size: 4 bytes
    
    // Create a mock EVM and interpreter
    const evm = try test_utils.createMockEvm(allocator);
    defer allocator.destroy(evm);
    
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    defer allocator.destroy(interpreter);
    
    // Execute the RETURN opcode and expect STOP error
    const result = controlflow.opReturn(0, interpreter, &frame);
    try std.testing.expectError(ExecutionError.STOP, result);
    
    // Check that return data was set correctly
    try std.testing.expect(frame.returnData != null);
    if (frame.returnData) |data| {
        try std.testing.expectEqualSlices(u8, &[_]u8{ 0xaa, 0xab, 0xac, 0xad }, data);
    }
}

// Test the REVERT opcode
test "REVERT opcode" {
    const allocator = std.testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0xFD }; // REVERT
    const contract = try test_utils.createMockContract(allocator, &code);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up memory with some data
    for (0..4) |i| {
        try frame.memory.store8(i, @truncate(0xaa + i));
    }
    
    // Set up the stack with offset and size
    try frame.stack.push(0); // offset: 0
    try frame.stack.push(4); // size: 4 bytes
    
    // Create a mock EVM and interpreter
    const evm = try test_utils.createMockEvm(allocator);
    defer allocator.destroy(evm);
    
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    defer allocator.destroy(interpreter);
    
    // Execute the REVERT opcode and expect REVERT error
    const result = controlflow.opRevert(0, interpreter, &frame);
    try std.testing.expectError(ExecutionError.REVERT, result);
    
    // Check that return data was set correctly
    try std.testing.expect(frame.returnData != null);
    if (frame.returnData) |data| {
        try std.testing.expectEqualSlices(u8, &[_]u8{ 0xaa, 0xab, 0xac, 0xad }, data);
    }
}

// Test the INVALID opcode
test "INVALID opcode" {
    const allocator = std.testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0xFE }; // INVALID
    const contract = try test_utils.createMockContract(allocator, &code);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Create a mock EVM and interpreter
    const evm = try test_utils.createMockEvm(allocator);
    defer allocator.destroy(evm);
    
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    defer allocator.destroy(interpreter);
    
    // Execute the INVALID opcode and expect INVALID error
    const result = controlflow.opInvalid(0, interpreter, &frame);
    try std.testing.expectError(ExecutionError.INVALID, result);
}

// Test the SELFDESTRUCT opcode
test "SELFDESTRUCT opcode" {
    const allocator = std.testing.allocator;
    
    // Create a simple contract
    const code = [_]u8{ 0xFF }; // SELFDESTRUCT
    const contract = try test_utils.createMockContract(allocator, &code);
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Set up the stack with beneficiary address
    try frame.stack.push(0x1234); // Some beneficiary address
    
    // Create a mock EVM and interpreter
    const evm = try test_utils.createMockEvm(allocator);
    defer allocator.destroy(evm);
    
    const interpreter = try test_utils.createMockInterpreter(allocator, evm);
    defer allocator.destroy(interpreter);
    
    // Execute the SELFDESTRUCT opcode and expect STOP error
    const result = controlflow.opSelfdestruct(0, interpreter, &frame);
    try std.testing.expectError(ExecutionError.STOP, result);
    
    // Test with readOnly=true
    try frame.stack.push(0x1234); // Push beneficiary address again
    interpreter.readOnly = true;
    const readonly_result = controlflow.opSelfdestruct(0, interpreter, &frame);
    try std.testing.expectError(ExecutionError.StaticStateChange, readonly_result);
}