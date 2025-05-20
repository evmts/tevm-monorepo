const std = @import("std");
const testing = std.testing;
const interpreter = @import("../interpreter.zig");
const Interpreter = interpreter.Interpreter;
const ExecutionError = interpreter.ExecutionError;
const evm = @import("../evm.zig");
const Frame = @import("../Frame.zig");
const Evm = evm.Evm;
const JumpTable = @import("../JumpTable.zig");
const calls = @import("../opcodes/calls.zig");

// Test setup helper function
fn setupInterpreter(enable_eip3860: bool) !Interpreter {
    // Create an EVM instance with custom chain rules
    var custom_evm = try Evm.init(std.testing.allocator, .{
        .IsEIP3860 = enable_eip3860, // Control EIP-3860 (Limit and meter initcode)
    });
    
    // Create an interpreter with our custom EVM
    var test_interpreter = try Interpreter.init(std.testing.allocator, &custom_evm);
    return test_interpreter;
}

// Test initcode size limit enforcement in CREATE with EIP-3860 enabled
test "CREATE rejects oversized initcode with EIP-3860 enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push parameters for CREATE: value, offset, size
    try frame.stack.push(0);          // value: 0
    try frame.stack.push(0);          // offset: 0
    try frame.stack.push(50000);      // size: 50000 (exceeds MAX_INITCODE_SIZE of 49152)
    
    // Execute CREATE operation
    const result = try calls.opCreate(0, &test_interpreter, &frame);
    
    // Verify CREATE executed (returned an empty string) but pushed 0 (failure) to the stack
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(u256, 0), try frame.stack.peek(0)); // Should return 0 (failure)
}

// Test that CREATE accepts initcode size within limit with EIP-3860 enabled
test "CREATE accepts valid initcode size with EIP-3860 enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push parameters for CREATE: value, offset, size
    try frame.stack.push(0);          // value: 0
    try frame.stack.push(0);          // offset: 0
    try frame.stack.push(49152);      // size: 49152 (exactly MAX_INITCODE_SIZE)
    
    // We need to make sure memory is allocated for the initcode
    try frame.memory.resize(49152);
    
    // Execute CREATE operation
    const result = try calls.opCreate(0, &test_interpreter, &frame);
    
    // Verify CREATE executed successfully
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(u256, 0x1234), try frame.stack.peek(0)); // Using our stub's fake address
}

// Test initcode size limit enforcement in CREATE2 with EIP-3860 enabled
test "CREATE2 rejects oversized initcode with EIP-3860 enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push parameters for CREATE2: value, offset, size, salt
    try frame.stack.push(0);          // value: 0
    try frame.stack.push(0);          // offset: 0
    try frame.stack.push(50000);      // size: 50000 (exceeds MAX_INITCODE_SIZE of 49152)
    try frame.stack.push(0);          // salt: 0
    
    // Execute CREATE2 operation
    const result = try calls.opCreate2(0, &test_interpreter, &frame);
    
    // Verify CREATE2 executed (returned an empty string) but pushed 0 (failure) to the stack
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(u256, 0), try frame.stack.peek(0)); // Should return 0 (failure)
}

// Test that CREATE2 accepts initcode size within limit with EIP-3860 enabled
test "CREATE2 accepts valid initcode size with EIP-3860 enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push parameters for CREATE2: value, offset, size, salt
    try frame.stack.push(0);          // value: 0
    try frame.stack.push(0);          // offset: 0
    try frame.stack.push(49152);      // size: 49152 (exactly MAX_INITCODE_SIZE)
    try frame.stack.push(0);          // salt: 0
    
    // We need to make sure memory is allocated for the initcode
    try frame.memory.resize(49152);
    
    // Execute CREATE2 operation
    const result = try calls.opCreate2(0, &test_interpreter, &frame);
    
    // Verify CREATE2 executed successfully
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(u256, 0x5678), try frame.stack.peek(0)); // Using our stub's fake address
}

// Test that CREATE accepts any size with EIP-3860 disabled
test "CREATE accepts any initcode size with EIP-3860 disabled" {
    var test_interpreter = try setupInterpreter(false);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push parameters for CREATE: value, offset, size
    try frame.stack.push(0);          // value: 0
    try frame.stack.push(0);          // offset: 0
    try frame.stack.push(100000);     // size: 100000 (well above MAX_INITCODE_SIZE)
    
    // We need to make sure memory is allocated for the initcode (or at least enough to not crash)
    try frame.memory.resize(1000); // Only allocate a small amount since we won't actually access it
    
    // Execute CREATE operation
    const result = try calls.opCreate(0, &test_interpreter, &frame);
    
    // Verify CREATE executed successfully
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(u256, 0x1234), try frame.stack.peek(0)); // Using our stub's fake address
}

// Test gas cost calculation for CREATE with EIP-3860
test "CREATE gas cost includes initcode gas with EIP-3860 enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Create a memory and stack for gas calculation
    var memory = try std.testing.allocator.create(Memory);
    memory.* = Memory.init(std.testing.allocator);
    defer memory.deinit();
    defer std.testing.allocator.destroy(memory);
    
    var stack = try std.testing.allocator.create(Stack);
    stack.* = Stack.init(std.testing.allocator);
    defer stack.deinit();
    defer std.testing.allocator.destroy(stack);
    
    // Push a size value onto the stack (32 bytes = 1 word)
    try stack.push(32);
    
    // Calculate gas cost
    const gas_cost = try calls.createGas(&test_interpreter, &frame, stack, memory, 0);
    
    // Expected gas cost = CREATE_GAS + 1 word * INITCODE_WORD_GAS
    //                   = 32000 + 1 * 2 = 32002
    try testing.expectEqual(JumpTable.CreateGas + JumpTable.InitcodeWordGas, gas_cost);
    
    // Try with 64 bytes (2 words)
    _ = try stack.pop();
    try stack.push(64);
    
    const gas_cost2 = try calls.createGas(&test_interpreter, &frame, stack, memory, 0);
    
    // Expected gas cost = CREATE_GAS + 2 words * INITCODE_WORD_GAS
    //                   = 32000 + 2 * 2 = 32004
    try testing.expectEqual(JumpTable.CreateGas + 2 * JumpTable.InitcodeWordGas, gas_cost2);
}

// Test gas cost calculation for CREATE with EIP-3860 disabled
test "CREATE gas cost does not include initcode gas with EIP-3860 disabled" {
    var test_interpreter = try setupInterpreter(false);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Create a memory and stack for gas calculation
    var memory = try std.testing.allocator.create(Memory);
    memory.* = Memory.init(std.testing.allocator);
    defer memory.deinit();
    defer std.testing.allocator.destroy(memory);
    
    var stack = try std.testing.allocator.create(Stack);
    stack.* = Stack.init(std.testing.allocator);
    defer stack.deinit();
    defer std.testing.allocator.destroy(stack);
    
    // Push a size value onto the stack (64 bytes = 2 words)
    try stack.push(64);
    
    // Calculate gas cost
    const gas_cost = try calls.createGas(&test_interpreter, &frame, stack, memory, 0);
    
    // Expected gas cost = CREATE_GAS only (32000), no additional cost for initcode
    try testing.expectEqual(JumpTable.CreateGas, gas_cost);
}