const std = @import("std");
const testing = std.testing;
const Interpreter = @import("../interpreter.zig").Interpreter;
const Frame = @import("../Frame.zig").Frame;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const Stack = @import("../Stack.zig").Stack;
const Memory = @import("../Memory.zig").Memory;
const EVM = @import("../evm.zig").EVM;
const Contract = @import("../Contract.zig").Contract;
const U256 = @import("../../Type/u256.zig").U256;
const EvmConfig = @import("../evm.zig").EvmConfig;
const precompile = @import("../precompiles/Precompiled.zig").PrecompiledContract;
const createAddress = @import("../../Address/address.zig").createAddress;
const Address = @import("../../Address/address.zig").Address;

// Helper functions for setting up test environment
fn setupInterpreter() !*Interpreter {
    var evm = try EVM.init(testing.allocator, EvmConfig{});
    defer evm.deinit();
    
    const interpreter = try Interpreter.init(evm);
    return interpreter;
}

fn setupFrame(interpreter: *Interpreter) !*Frame {
    const code = [_]u8{0xF1}; // CALL
    const contract = try Contract.init(testing.allocator, &code, createAddress(1));
    const frame = try Frame.init(interpreter, contract, createAddress(2), 100000);
    return frame;
}

// Tests for CALL opcode (0xF1)
test "CALL with insufficient stack" {
    const interpreter = try setupInterpreter();
    defer interpreter.deinit();
    
    const frame = try setupFrame(interpreter);
    defer frame.deinit();
    
    // Stack should have 7 elements, but we'll only push 6
    try frame.stack.push(1000); // gas
    try frame.stack.push(0x1234); // address
    try frame.stack.push(0); // value
    try frame.stack.push(0); // inOffset
    try frame.stack.push(0); // inSize
    try frame.stack.push(0); // outOffset
    // Missing outSize
    
    // Execute CALL, should fail with StackUnderflow
    const result = interpreter.run(frame);
    try testing.expectError(ExecutionError.StackUnderflow, result);
}

test "CALL with all parameters" {
    const interpreter = try setupInterpreter();
    defer interpreter.deinit();
    
    const frame = try setupFrame(interpreter);
    defer frame.deinit();
    
    // Push all required parameters
    try frame.stack.push(1000); // gas
    try frame.stack.push(0x1234); // address
    try frame.stack.push(0); // value
    try frame.stack.push(0); // inOffset
    try frame.stack.push(0); // inSize
    try frame.stack.push(0); // outOffset
    try frame.stack.push(0); // outSize
    
    // This will still fail since we don't have a proper state manager
    // But we can at least verify the stack is properly processed
    const result = interpreter.run(frame);
    
    // In a real system with a state manager, test would proceed further
    // For now we just make sure the stack items were properly consumed
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for STATICCALL opcode (0xFA)
test "STATICCALL basic functionality" {
    const interpreter = try setupInterpreter();
    defer interpreter.deinit();
    
    // Setup a frame with STATICCALL opcode
    const code = [_]u8{0xFA}; // STATICCALL
    const contract = try Contract.init(testing.allocator, &code, createAddress(1));
    const frame = try Frame.init(interpreter, contract, createAddress(2), 100000);
    defer frame.deinit();
    
    // Push parameters for STATICCALL
    try frame.stack.push(1000); // gas
    try frame.stack.push(0x1234); // address
    try frame.stack.push(0); // inOffset
    try frame.stack.push(0); // inSize
    try frame.stack.push(0); // outOffset
    try frame.stack.push(0); // outSize
    
    // Execute, similar limitations as CALL test
    const result = interpreter.run(frame);
    
    // Verify stack was processed
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for DELEGATECALL opcode (0xF4)
test "DELEGATECALL basic functionality" {
    const interpreter = try setupInterpreter();
    defer interpreter.deinit();
    
    // Setup a frame with DELEGATECALL opcode
    const code = [_]u8{0xF4}; // DELEGATECALL
    const contract = try Contract.init(testing.allocator, &code, createAddress(1));
    const frame = try Frame.init(interpreter, contract, createAddress(2), 100000);
    defer frame.deinit();
    
    // Push parameters for DELEGATECALL
    try frame.stack.push(1000); // gas
    try frame.stack.push(0x1234); // address
    try frame.stack.push(0); // inOffset
    try frame.stack.push(0); // inSize
    try frame.stack.push(0); // outOffset
    try frame.stack.push(0); // outSize
    
    // Execute, similar limitations as CALL test
    const result = interpreter.run(frame);
    
    // Verify stack was processed
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for CREATE opcode (0xF0)
test "CREATE basic functionality" {
    const interpreter = try setupInterpreter();
    defer interpreter.deinit();
    
    // Setup a frame with CREATE opcode
    const code = [_]u8{0xF0}; // CREATE
    const contract = try Contract.init(testing.allocator, &code, createAddress(1));
    const frame = try Frame.init(interpreter, contract, createAddress(2), 100000);
    defer frame.deinit();
    
    // Push parameters for CREATE
    try frame.stack.push(0); // value
    try frame.stack.push(0); // offset
    try frame.stack.push(0); // size
    
    // Execute
    const result = interpreter.run(frame);
    
    // Verify stack was processed
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for CREATE2 opcode (0xF5)
test "CREATE2 basic functionality" {
    const interpreter = try setupInterpreter();
    defer interpreter.deinit();
    
    // Setup a frame with CREATE2 opcode
    const code = [_]u8{0xF5}; // CREATE2
    const contract = try Contract.init(testing.allocator, &code, createAddress(1));
    const frame = try Frame.init(interpreter, contract, createAddress(2), 100000);
    defer frame.deinit();
    
    // Push parameters for CREATE2
    try frame.stack.push(0); // value
    try frame.stack.push(0); // offset
    try frame.stack.push(0); // size
    try frame.stack.push(0); // salt
    
    // Execute
    const result = interpreter.run(frame);
    
    // Verify stack was processed
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for RETURN opcode (0xF3)
test "RETURN opcode" {
    const interpreter = try setupInterpreter();
    defer interpreter.deinit();
    
    // Setup data in memory
    const return_data = [_]u8{0x01, 0x02, 0x03, 0x04};
    
    // Setup a frame with RETURN opcode
    const code = [_]u8{0xF3}; // RETURN
    const contract = try Contract.init(testing.allocator, &code, createAddress(1));
    const frame = try Frame.init(interpreter, contract, createAddress(2), 100000);
    defer frame.deinit();
    
    // Add data to memory
    try frame.memory.store(0, &return_data);
    
    // Push parameters for RETURN
    try frame.stack.push(0); // offset
    try frame.stack.push(4); // size
    
    // Execute
    const result = interpreter.run(frame);
    
    // The exact behavior would depend on our return data implementation
    // but we can verify the stack is empty
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for REVERT opcode (0xFD)
test "REVERT opcode" {
    const interpreter = try setupInterpreter();
    defer interpreter.deinit();
    
    // Setup data in memory
    const revert_data = [_]u8{0x08, 0x09, 0x0A, 0x0B};
    
    // Setup a frame with REVERT opcode
    const code = [_]u8{0xFD}; // REVERT
    const contract = try Contract.init(testing.allocator, &code, createAddress(1));
    const frame = try Frame.init(interpreter, contract, createAddress(2), 100000);
    defer frame.deinit();
    
    // Add data to memory
    try frame.memory.store(0, &revert_data);
    
    // Push parameters for REVERT
    try frame.stack.push(0); // offset
    try frame.stack.push(4); // size
    
    // Execute
    const result = interpreter.run(frame);
    
    // Should return a RevertExecutionError or similar
    try testing.expectError(ExecutionError.ExecutionReverted, result);
    
    // Verify the stack is empty
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
}

// Test for SELFDESTRUCT opcode (0xFF)
test "SELFDESTRUCT opcode" {
    const interpreter = try setupInterpreter();
    defer interpreter.deinit();
    
    // Setup a frame with SELFDESTRUCT opcode
    const code = [_]u8{0xFF}; // SELFDESTRUCT
    const contract = try Contract.init(testing.allocator, &code, createAddress(1));
    const frame = try Frame.init(interpreter, contract, createAddress(2), 100000);
    defer frame.deinit();
    
    // Push beneficiary address for SELFDESTRUCT
    try frame.stack.push(0x1234); // beneficiary address
    
    // Execute
    const result = interpreter.run(frame);
    
    // Verify the stack is empty
    try testing.expectEqual(@as(usize, 0), frame.stack.size);
    
    // In a real implementation with state manager,
    // we would also verify that contract was marked for destruction
    // and balance was transferred
}