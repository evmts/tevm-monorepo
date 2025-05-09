//! Integration tests for RETURNDATASIZE and RETURNDATACOPY opcodes
//! Tests the full integration between the interpreter and return data buffer

const std = @import("std");
const testing = std.testing;
const ReturnData = @import("../../interpreter/return_data.zig").ReturnData;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const returndatasize = @import("../../opcodes/return_data.zig").returndatasize;
const returndatacopy = @import("../../opcodes/return_data.zig").returndatacopy;
const Stack = @import("../../stack/stack.zig").Stack;
const Memory = @import("../../memory/memory.zig").Memory;
const types = @import("../../util/types.zig");
const Error = types.Error;
const ExecutionResult = types.ExecutionResult;
const U256 = types.U256;

/// Test direct usage of RETURNDATASIZE opcode
test "RETURNDATASIZE basic functionality" {
    // Initialize the necessary components
    var stack = Stack.init();
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Initial state - empty return data
    try returndatasize(&stack, &return_data);
    try testing.expectEqual(U256.fromU64(0), try stack.peek().*);
    _ = try stack.pop(); // Clean up stack
    
    // Set some return data
    const test_data = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05};
    try return_data.set(&test_data);
    
    // Check RETURNDATASIZE reports correct size
    try returndatasize(&stack, &return_data);
    try testing.expectEqual(U256.fromU64(5), try stack.peek().*);
    _ = try stack.pop(); // Clean up stack
    
    // Set different sized return data
    const larger_data = [_]u8{0xA0, 0xA1, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9};
    try return_data.set(&larger_data);
    
    // Check RETURNDATASIZE reports updated size
    try returndatasize(&stack, &return_data);
    try testing.expectEqual(U256.fromU64(10), try stack.peek().*);
    _ = try stack.pop(); // Clean up stack
    
    // Clear return data
    return_data.clear();
    
    // Check RETURNDATASIZE reports zero after clearing
    try returndatasize(&stack, &return_data);
    try testing.expectEqual(U256.fromU64(0), try stack.peek().*);
}

/// Test direct usage of RETURNDATACOPY opcode
test "RETURNDATACOPY basic functionality" {
    // Initialize the necessary components
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Set some return data
    const test_data = [_]u8{0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88};
    try return_data.set(&test_data);
    
    // RETURNDATACOPY stack parameters: [destOffset, offset, size]
    try stack.push(U256.fromU64(16)); // destOffset - where to store in memory
    try stack.push(U256.fromU64(2));  // offset - which byte in return data to start from
    try stack.push(U256.fromU64(4));  // size - how many bytes to copy
    
    // Execute the RETURNDATACOPY opcode
    try returndatacopy(&stack, &memory, &return_data);
    
    // Verify memory now contains the copied data
    const expected_data = [_]u8{0x33, 0x44, 0x55, 0x66};
    for (0..4) |i| {
        try testing.expectEqual(expected_data[i], memory.page.buffer[16 + i]);
    }
    
    // Test edge case: copying 0 bytes
    try stack.push(U256.fromU64(32)); // destOffset
    try stack.push(U256.fromU64(0));  // offset
    try stack.push(U256.fromU64(0));  // size - 0 bytes
    
    try returndatacopy(&stack, &memory, &return_data);
    
    // Test edge case: copying full return data
    try stack.push(U256.fromU64(64)); // destOffset
    try stack.push(U256.fromU64(0));  // offset - start from beginning
    try stack.push(U256.fromU64(8));  // size - all 8 bytes
    
    try returndatacopy(&stack, &memory, &return_data);
    
    // Verify all data was copied
    for (0..8) |i| {
        try testing.expectEqual(test_data[i], memory.page.buffer[64 + i]);
    }
    
    // Test out-of-bounds error
    try stack.push(U256.fromU64(100)); // destOffset
    try stack.push(U256.fromU64(6));   // offset
    try stack.push(U256.fromU64(4));   // size - would go beyond return data size
    
    try testing.expectError(Error.ReturnDataOutOfBounds, returndatacopy(&stack, &memory, &return_data));
}

/// Test combined usage of RETURNDATASIZE and RETURNDATACOPY
test "RETURNDATASIZE and RETURNDATACOPY combined usage" {
    // Initialize the necessary components
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Set some return data
    const test_data = [_]u8{0xA1, 0xB2, 0xC3, 0xD4, 0xE5, 0xF6};
    try return_data.set(&test_data);
    
    // Get the size with RETURNDATASIZE and use it for RETURNDATACOPY
    try returndatasize(&stack, &return_data);
    const size = try stack.peek().*;
    
    // Use size for RETURNDATACOPY
    try stack.push(U256.fromU64(32)); // destOffset
    try stack.push(U256.fromU64(0));  // offset
    try stack.push(size);             // size (from RETURNDATASIZE)
    
    try returndatacopy(&stack, &memory, &return_data);
    
    // Verify all data was copied based on the size we got
    const actual_size = @intCast(size.words[0]);
    try testing.expectEqual(test_data.len, actual_size);
    
    for (0..actual_size) |i| {
        try testing.expectEqual(test_data[i], memory.page.buffer[32 + i]);
    }
    
    // Update return data
    const new_data = [_]u8{0x01, 0x02};
    try return_data.set(&new_data);
    
    // Get new size and verify it changed
    try returndatasize(&stack, &return_data);
    const new_size = try stack.peek().*;
    try testing.expectEqual(U256.fromU64(2), new_size);
    
    // Copy from updated return data to a different memory location
    try stack.push(U256.fromU64(64)); // destOffset
    try stack.push(U256.fromU64(0));  // offset
    try stack.push(new_size);         // size
    
    try returndatacopy(&stack, &memory, &return_data);
    
    // Verify new data was copied
    try testing.expectEqual(@as(u8, 0x01), memory.page.buffer[64]);
    try testing.expectEqual(@as(u8, 0x02), memory.page.buffer[65]);
}

/// Test behavior with bytecode that uses RETURNDATASIZE and RETURNDATACOPY opcodes
test "Bytecode execution with RETURNDATASIZE and RETURNDATACOPY" {
    // This bytecode does:
    // 1. Assume return data is already set (would be set by a previous call)
    // 2. RETURNDATASIZE - Gets size of return data buffer
    // 3. Push memory destination (0x00)
    // 4. Push return data source offset (0x00)
    // 5. RETURNDATACOPY - Copy return data to memory
    // 6. Push return size (same as return data size)
    // 7. Push return offset (0x00)
    // 8. RETURN - Return copied data from memory
    const bytecode = [_]u8{
        0x3D,       // RETURNDATASIZE
        0x60, 0x00, // PUSH1 0x00 (memory destination)
        0x60, 0x00, // PUSH1 0x00 (return data offset)
        0x3E,       // RETURNDATACOPY
        0x3D,       // RETURNDATASIZE (again for return size)
        0x60, 0x00, // PUSH1 0x00 (memory offset for return)
        0xF3,       // RETURN
    };
    
    // Create interpreter
    var interpreter = try Interpreter.init(testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // Set mock return data (as if it came from a previous call)
    const mock_return_data = [_]u8{0xCA, 0xFE, 0xBA, 0xBE};
    try interpreter.return_data_buffer.set(&mock_return_data);
    
    // Execute the bytecode
    const result = interpreter.execute();
    
    // Verify execution succeeded
    switch (result) {
        .Success => |success| {
            // The return data should match what we copied
            try testing.expectEqualSlices(u8, &mock_return_data, success.return_data);
        },
        .Revert, .Error => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test complex scenario: updating return data between calls
test "Updating return data between calls" {
    // Create two separate interpreters to simulate two different contract calls
    
    // First contract - returns some data
    const contract1_code = [_]u8{
        0x60, 0xAA, // PUSH1 0xAA (data to return)
        0x60, 0x00, // PUSH1 0x00 (memory position)
        0x52,       // MSTORE
        0x60, 0x20, // PUSH1 0x20 (return 32 bytes)
        0x60, 0x00, // PUSH1 0x00 (from memory position 0)
        0xF3,       // RETURN
    };
    
    // Second contract - uses return data from first contract call
    const contract2_code = [_]u8{
        0x3D,       // RETURNDATASIZE - Get size of return data
        0x60, 0x00, // PUSH1 0x00 - Memory position to copy to
        0x60, 0x00, // PUSH1 0x00 - Offset in return data
        0x3E,       // RETURNDATACOPY - Copy return data to memory
        0x60, 0x20, // PUSH1 0x20 - Size to return (32 bytes)
        0x60, 0x00, // PUSH1 0x00 - From memory position 0
        0xF3,       // RETURN - Return the copied data
    };
    
    // Create interpreters for both contracts
    var interpreter1 = try Interpreter.init(testing.allocator, &contract1_code, 100000, 0);
    defer interpreter1.deinit();
    
    var interpreter2 = try Interpreter.init(testing.allocator, &contract2_code, 100000, 0);
    defer interpreter2.deinit();
    
    // Execute first contract
    const result1 = interpreter1.execute();
    
    // Extract return data from first contract
    const first_return_data = switch (result1) {
        .Success => |success| success.return_data,
        .Revert, .Error => {
            try testing.expect(false); // This should not happen
            return;
        },
    };
    
    // Setup return data in second contract (simulating a call from contract1 to contract2)
    try interpreter2.return_data_buffer.set(first_return_data);
    
    // Execute second contract
    const result2 = interpreter2.execute();
    
    // Check that second contract copied and returned the data correctly
    switch (result2) {
        .Success => |success| {
            try testing.expectEqualSlices(u8, first_return_data, success.return_data);
            // Value 0xAA should be in the last byte of the 32-byte word
            try testing.expectEqual(@as(u8, 0xAA), success.return_data[31]);
        },
        .Revert, .Error => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test error handling with RETURNDATACOPY
test "RETURNDATACOPY error handling" {
    // Initialize components
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Set small return data
    const small_data = [_]u8{0x01, 0x02, 0x03};
    try return_data.set(&small_data);
    
    // Test case 1: offset beyond buffer size
    try stack.push(U256.fromU64(0)); // destOffset
    try stack.push(U256.fromU64(3)); // offset - equal to length, just past the end
    try stack.push(U256.fromU64(1)); // size
    
    try testing.expectError(Error.ReturnDataOutOfBounds, returndatacopy(&stack, &memory, &return_data));
    
    // Clear stack
    while (stack.getSize() > 0) _ = try stack.pop();
    
    // Test case 2: offset + size beyond buffer size
    try stack.push(U256.fromU64(0)); // destOffset
    try stack.push(U256.fromU64(2)); // offset - valid
    try stack.push(U256.fromU64(2)); // size - would go beyond buffer
    
    try testing.expectError(Error.ReturnDataOutOfBounds, returndatacopy(&stack, &memory, &return_data));
    
    // Clear stack
    while (stack.getSize() > 0) _ = try stack.pop();
    
    // Test case 3: empty return data
    return_data.clear();
    
    try stack.push(U256.fromU64(0)); // destOffset
    try stack.push(U256.fromU64(0)); // offset
    try stack.push(U256.fromU64(1)); // size - greater than 0 for empty buffer
    
    try testing.expectError(Error.ReturnDataOutOfBounds, returndatacopy(&stack, &memory, &return_data));
    
    // Test case 4: very large offset (valid with size 0)
    while (stack.getSize() > 0) _ = try stack.pop();
    
    try stack.push(U256.fromU64(0)); // destOffset
    try stack.push(U256.fromU64(1000000)); // offset - very large
    try stack.push(U256.fromU64(0)); // size - 0 is valid regardless of offset
    
    // This should succeed since size is 0
    try returndatacopy(&stack, &memory, &return_data);
}