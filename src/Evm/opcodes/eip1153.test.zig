const std = @import("std");
const testing = std.testing;
const interpreter = @import("../interpreter.zig");
const Interpreter = interpreter.Interpreter;
const ExecutionError = interpreter.ExecutionError;
const evm = @import("../evm.zig");
const Frame = @import("../Frame.zig");
const Evm = evm.Evm;
const transient = @import("transient.zig");

// Test setup helper function
fn setupInterpreter(enable_eip1153: bool) !Interpreter {
    // Create an EVM instance with custom chain rules
    var custom_evm = try Evm.init(std.testing.allocator, .{
        .IsEIP1153 = enable_eip1153, // Control EIP-1153 (Transient Storage)
    });
    
    // Create an interpreter with our custom EVM
    var test_interpreter = try Interpreter.init(std.testing.allocator, &custom_evm);
    return test_interpreter;
}

// Test TLOAD opcode with EIP-1153 enabled
test "TLOAD opcode works when EIP-1153 is enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push a key onto the stack
    try frame.stack.push(0x123); // Sample key
    
    // Execute TLOAD operation
    const result = try transient.opTload(0, &test_interpreter, &frame);
    
    // Verify TLOAD executed successfully
    try testing.expectEqualStrings("", result);
    
    // Verify a value was pushed to the stack (should be 0 since no value was stored yet)
    try testing.expectEqual(@as(u256, 0), try frame.stack.peek(0));
}

// Test TSTORE opcode with EIP-1153 enabled
test "TSTORE opcode works when EIP-1153 is enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push value and key onto the stack
    try frame.stack.push(0x456); // Sample value
    try frame.stack.push(0x123); // Sample key
    
    // Execute TSTORE operation
    const result = try transient.opTstore(0, &test_interpreter, &frame);
    
    // Verify TSTORE executed successfully
    try testing.expectEqualStrings("", result);
    
    // Stack should be empty after TSTORE (consumes both key and value)
    try testing.expectEqual(@as(usize, 0), frame.stack.length());
    
    // Now test that we can load the stored value
    try frame.stack.push(0x123); // Same key
    
    // Execute TLOAD operation to retrieve the stored value
    const load_result = try transient.opTload(0, &test_interpreter, &frame);
    
    // Verify TLOAD executed successfully
    try testing.expectEqualStrings("", load_result);
    
    // Verify the loaded value matches what we stored
    try testing.expectEqual(@as(u256, 0x456), try frame.stack.peek(0));
}

// Test TLOAD opcode with EIP-1153 disabled (should fail)
test "TLOAD opcode fails when EIP-1153 is disabled" {
    var test_interpreter = try setupInterpreter(false);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push a key onto the stack
    try frame.stack.push(0x123);
    
    // Execute TLOAD operation - should fail with InvalidOpcode
    try testing.expectError(ExecutionError.InvalidOpcode, transient.opTload(0, &test_interpreter, &frame));
}

// Test TSTORE opcode with EIP-1153 disabled (should fail)
test "TSTORE opcode fails when EIP-1153 is disabled" {
    var test_interpreter = try setupInterpreter(false);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push value and key onto the stack
    try frame.stack.push(0x456);
    try frame.stack.push(0x123);
    
    // Execute TSTORE operation - should fail with InvalidOpcode
    try testing.expectError(ExecutionError.InvalidOpcode, transient.opTstore(0, &test_interpreter, &frame));
}

// Test transient storage is indeed transient (values don't persist across transactions)
test "Transient storage is cleared between transactions" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for the first "transaction"
    var frame1 = try Frame.init(std.testing.allocator);
    defer frame1.deinit();
    
    // Store a value in transient storage
    try frame1.stack.push(0x789); // Sample value
    try frame1.stack.push(0x123); // Sample key
    _ = try transient.opTstore(0, &test_interpreter, &frame1);
    
    // Verify we can read it back
    try frame1.stack.push(0x123);
    _ = try transient.opTload(0, &test_interpreter, &frame1);
    try testing.expectEqual(@as(u256, 0x789), try frame1.stack.peek(0));
    
    // Simulate a new transaction by resetting the transient storage
    if (test_interpreter.evm.transient_storage) |*ts| {
        ts.clear(); // Clear transient storage between transactions
    }
    
    // Create a new frame for the second "transaction"
    var frame2 = try Frame.init(std.testing.allocator);
    defer frame2.deinit();
    
    // Try to load the previously stored value
    try frame2.stack.push(0x123); // Same key
    _ = try transient.opTload(0, &test_interpreter, &frame2);
    
    // Should get 0 since transient storage was cleared
    try testing.expectEqual(@as(u256, 0), try frame2.stack.peek(0));
}