const std = @import("std");
const testing = std.testing;
const interpreter_mod = @import("../interpreter.zig");
const Interpreter = interpreter_mod.Interpreter;
const ExecutionError = @import("../Frame.zig").ExecutionError;
const evm_mod = @import("../evm.zig");
const Frame = @import("../Frame.zig").Frame;
const Evm = evm_mod.Evm;
const JumpTable = @import("../JumpTable.zig");
const calls = @import("../opcodes/calls.zig");

// Test setup helper function
fn setupInterpreter(enable_eip3541: bool) !Interpreter {
    // Create a custom chain rules configuration
    var custom_rules = evm_mod.ChainRules{};
    custom_rules.IsEIP3541 = enable_eip3541; // Control EIP-3541 (Reject new contracts starting with 0xEF)
    
    // Create an EVM instance with custom chain rules
    var custom_evm = try Evm.init(std.testing.allocator, custom_rules);
    
    // Create an interpreter with our custom EVM
    var test_interpreter = try Interpreter.init(std.testing.allocator, &custom_evm);
    return test_interpreter;
}

// Test that CREATE rejects contracts starting with 0xEF when EIP-3541 is enabled
test "CREATE rejects contracts starting with 0xEF with EIP-3541 enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push parameters for CREATE: value, offset, size
    try frame.stack.push(0);          // value: 0
    try frame.stack.push(0);          // offset: 0
    try frame.stack.push(10);         // size: 10 (small contract)
    
    // We need to make sure memory is allocated and contains 0xEF at the first byte
    try frame.memory.resize(10);
    var mem = frame.memory.data();
    mem[0] = 0xEF; // First byte is 0xEF
    
    // Execute CREATE operation
    const result = try calls.opCreate(0, &test_interpreter, &frame);
    
    // Verify CREATE executed (returned an empty string) but pushed 0 (failure) to the stack
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(u256, 0), try frame.stack.peek(0)); // Should return 0 (failure)
}

// Test that CREATE accepts contracts not starting with 0xEF with EIP-3541 enabled
test "CREATE accepts contracts not starting with 0xEF with EIP-3541 enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push parameters for CREATE: value, offset, size
    try frame.stack.push(0);          // value: 0
    try frame.stack.push(0);          // offset: 0
    try frame.stack.push(10);         // size: 10 (small contract)
    
    // We need to make sure memory is allocated and contains something other than 0xEF
    try frame.memory.resize(10);
    var mem = frame.memory.data();
    mem[0] = 0x60; // First byte is not 0xEF
    
    // Execute CREATE operation
    const result = try calls.opCreate(0, &test_interpreter, &frame);
    
    // Verify CREATE executed successfully
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(u256, 0x1234), try frame.stack.peek(0)); // Using our stub's fake address
}

// Test that CREATE2 rejects contracts starting with 0xEF when EIP-3541 is enabled
test "CREATE2 rejects contracts starting with 0xEF with EIP-3541 enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push parameters for CREATE2: value, offset, size, salt
    try frame.stack.push(0);          // value: 0
    try frame.stack.push(0);          // offset: 0
    try frame.stack.push(10);         // size: 10 (small contract)
    try frame.stack.push(0);          // salt: 0
    
    // We need to make sure memory is allocated and contains 0xEF at the first byte
    try frame.memory.resize(10);
    var mem = frame.memory.data();
    mem[0] = 0xEF; // First byte is 0xEF
    
    // Execute CREATE2 operation
    const result = try calls.opCreate2(0, &test_interpreter, &frame);
    
    // Verify CREATE2 executed (returned an empty string) but pushed 0 (failure) to the stack
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(u256, 0), try frame.stack.peek(0)); // Should return 0 (failure)
}

// Test that CREATE2 accepts contracts not starting with 0xEF with EIP-3541 enabled
test "CREATE2 accepts contracts not starting with 0xEF with EIP-3541 enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push parameters for CREATE2: value, offset, size, salt
    try frame.stack.push(0);          // value: 0
    try frame.stack.push(0);          // offset: 0
    try frame.stack.push(10);         // size: 10 (small contract)
    try frame.stack.push(0);          // salt: 0
    
    // We need to make sure memory is allocated and contains something other than 0xEF
    try frame.memory.resize(10);
    var mem = frame.memory.data();
    mem[0] = 0x60; // First byte is not 0xEF
    
    // Execute CREATE2 operation
    const result = try calls.opCreate2(0, &test_interpreter, &frame);
    
    // Verify CREATE2 executed successfully
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(u256, 0x5678), try frame.stack.peek(0)); // Using our stub's fake address
}

// Test that CREATE accepts contracts starting with 0xEF when EIP-3541 is disabled
test "CREATE accepts contracts starting with 0xEF with EIP-3541 disabled" {
    var test_interpreter = try setupInterpreter(false);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push parameters for CREATE: value, offset, size
    try frame.stack.push(0);          // value: 0
    try frame.stack.push(0);          // offset: 0
    try frame.stack.push(10);         // size: 10 (small contract)
    
    // We need to make sure memory is allocated and contains 0xEF at the first byte
    try frame.memory.resize(10);
    var mem = frame.memory.data();
    mem[0] = 0xEF; // First byte is 0xEF
    
    // Execute CREATE operation
    const result = try calls.opCreate(0, &test_interpreter, &frame);
    
    // Verify CREATE executed successfully even with 0xEF as first byte
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(u256, 0x1234), try frame.stack.peek(0)); // Using our stub's fake address
}

// Test that CREATE2 accepts contracts starting with 0xEF when EIP-3541 is disabled
test "CREATE2 accepts contracts starting with 0xEF with EIP-3541 disabled" {
    var test_interpreter = try setupInterpreter(false);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push parameters for CREATE2: value, offset, size, salt
    try frame.stack.push(0);          // value: 0
    try frame.stack.push(0);          // offset: 0
    try frame.stack.push(10);         // size: 10 (small contract)
    try frame.stack.push(0);          // salt: 0
    
    // We need to make sure memory is allocated and contains 0xEF at the first byte
    try frame.memory.resize(10);
    var mem = frame.memory.data();
    mem[0] = 0xEF; // First byte is 0xEF
    
    // Execute CREATE2 operation
    const result = try calls.opCreate2(0, &test_interpreter, &frame);
    
    // Verify CREATE2 executed successfully even with 0xEF as first byte
    try testing.expectEqualStrings("", result);
    try testing.expectEqual(@as(u256, 0x5678), try frame.stack.peek(0)); // Using our stub's fake address
}