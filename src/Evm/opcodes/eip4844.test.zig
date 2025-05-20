const std = @import("std");
const testing = std.testing;
const interpreter = @import("../interpreter.zig");
const Interpreter = interpreter.Interpreter;
const ExecutionError = interpreter.ExecutionError;
const evm = @import("../evm.zig");
const Frame = @import("../Frame.zig");
const Evm = evm.Evm;
const blob = @import("blob.zig");

// Test setup helper function
fn setupInterpreter(enable_eip4844: bool) !Interpreter {
    // Create an EVM instance with custom chain rules
    var custom_evm = try Evm.init(std.testing.allocator, .{
        .IsEIP4844 = enable_eip4844, // Control EIP-4844 (Shard Blob Transactions)
    });
    
    // Create an interpreter with our custom EVM
    var test_interpreter = try Interpreter.init(std.testing.allocator, &custom_evm);
    return test_interpreter;
}

// Test BLOBHASH opcode with EIP-4844 enabled
test "BLOBHASH opcode works when EIP-4844 is enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push a blob index onto the stack
    try frame.stack.push(0); // Index 0
    
    // Execute BLOBHASH operation
    const result = try blob.opBlobHash(0, &test_interpreter, &frame);
    
    // Verify BLOBHASH executed successfully
    try testing.expectEqualStrings("", result);
    
    // Verify a value was pushed to the stack (should be a placeholder value in our implementation)
    try testing.expectEqual(@as(u256, 0), try frame.stack.peek(0));
}

// Test BLOBHASH opcode with EIP-4844 disabled (should still work since it doesn't check for EIP-4844)
test "BLOBHASH opcode works when EIP-4844 is disabled" {
    var test_interpreter = try setupInterpreter(false);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Push a blob index onto the stack
    try frame.stack.push(0); // Index 0
    
    // Execute BLOBHASH operation - should still work even if EIP-4844 is disabled
    // since our implementation doesn't check for the flag
    const result = try blob.opBlobHash(0, &test_interpreter, &frame);
    
    // Verify BLOBHASH executed successfully
    try testing.expectEqualStrings("", result);
    
    // Verify a value was pushed to the stack
    try testing.expectEqual(@as(u256, 0), try frame.stack.peek(0));
}

// Test BLOBBASEFEE opcode with EIP-4844 enabled
test "BLOBBASEFEE opcode works when EIP-4844 is enabled" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Execute BLOBBASEFEE operation
    const result = try blob.opBlobBaseFee(0, &test_interpreter, &frame);
    
    // Verify BLOBBASEFEE executed successfully
    try testing.expectEqualStrings("", result);
    
    // Verify a value was pushed to the stack (should be our placeholder value of 1000000)
    try testing.expectEqual(@as(u256, 1000000), try frame.stack.peek(0));
}

// Test BLOBBASEFEE opcode with EIP-4844 disabled (should still work since it doesn't check for EIP-4844)
test "BLOBBASEFEE opcode works when EIP-4844 is disabled" {
    var test_interpreter = try setupInterpreter(false);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Execute BLOBBASEFEE operation - should still work even if EIP-4844 is disabled
    // since our implementation doesn't check for the flag
    const result = try blob.opBlobBaseFee(0, &test_interpreter, &frame);
    
    // Verify BLOBBASEFEE executed successfully
    try testing.expectEqualStrings("", result);
    
    // Verify a value was pushed to the stack
    try testing.expectEqual(@as(u256, 1000000), try frame.stack.peek(0));
}

// Test stack underflow handling in BLOBHASH
test "BLOBHASH handles stack underflow" {
    var test_interpreter = try setupInterpreter(true);
    defer test_interpreter.deinit();
    
    // Create a frame for execution
    var frame = try Frame.init(std.testing.allocator);
    defer frame.deinit();
    
    // Don't push any value to the stack
    // Execute BLOBHASH operation - should fail with StackUnderflow
    try testing.expectError(ExecutionError.StackUnderflow, blob.opBlobHash(0, &test_interpreter, &frame));
}

// Test KZG precompile gas cost (Point Evaluation precompile)
test "KZG Point Evaluation precompile gas cost" {
    const kzg = @import("../precompile/kzg.zig");
    const required_gas = kzg.PointEvaluation.requiredGas(&[_]u8{0} ** 192);
    
    // Gas cost should match the BlobTxPointEvaluationPrecompileGas constant
    try testing.expectEqual(@as(u64, 50000), required_gas);
}

// Test KZG precompile input validation
test "KZG Point Evaluation precompile input validation" {
    const kzg = @import("../precompile/kzg.zig");
    const allocator = std.testing.allocator;
    
    // Valid input (exactly 192 bytes)
    const valid_input = try allocator.alloc(u8, 192);
    defer allocator.free(valid_input);
    @memset(valid_input, 0);
    
    // Should succeed with valid input length
    const result = try kzg.PointEvaluation.run(valid_input, allocator);
    defer if (result) |r| allocator.free(r);
    try testing.expect(result != null);
    
    // Invalid input (not 192 bytes)
    const invalid_input = try allocator.alloc(u8, 100);
    defer allocator.free(invalid_input);
    @memset(invalid_input, 0);
    
    // Should fail with invalid input length
    try testing.expectError(error.InvalidInputLength, kzg.PointEvaluation.run(invalid_input, allocator));
}