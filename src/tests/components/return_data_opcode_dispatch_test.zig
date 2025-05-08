//! Integration tests for dispatch system with RETURNDATASIZE and RETURNDATACOPY opcodes
//! Tests that these opcodes are properly registered and dispatched from bytecode

const std = @import("std");
const testing = std.testing;
const ReturnData = @import("../../interpreter/return_data.zig").ReturnData;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const Opcode = @import("../../opcodes/opcodes.zig").Opcode;
const OpcodeInfo = @import("../../opcodes/opcodes.zig").OpcodeInfo;
const ExecutionResult = @import("../../util/types.zig").ExecutionResult;

/// Test that RETURNDATASIZE and RETURNDATACOPY opcodes are defined with correct properties
test "Return data opcodes definition" {
    // Verify RETURNDATASIZE opcode
    const returndatasize_op = @intFromEnum(Opcode.RETURNDATASIZE);
    try testing.expectEqual(@as(u8, 0x3D), returndatasize_op);
    
    const returndatasize_info = OpcodeInfo.getInfo(returndatasize_op);
    try testing.expectEqualStrings("RETURNDATASIZE", returndatasize_info.name);
    try testing.expectEqual(@as(u8, 0), returndatasize_info.stack_pops);
    try testing.expectEqual(@as(u8, 1), returndatasize_info.stack_pushes);
    try testing.expect(!returndatasize_info.side_effects);
    
    // Verify RETURNDATACOPY opcode
    const returndatacopy_op = @intFromEnum(Opcode.RETURNDATACOPY);
    try testing.expectEqual(@as(u8, 0x3E), returndatacopy_op);
    
    const returndatacopy_info = OpcodeInfo.getInfo(returndatacopy_op);
    try testing.expectEqualStrings("RETURNDATACOPY", returndatacopy_info.name);
    try testing.expectEqual(@as(u8, 3), returndatacopy_info.stack_pops);
    try testing.expectEqual(@as(u8, 0), returndatacopy_info.stack_pushes);
    try testing.expect(!returndatacopy_info.side_effects);
}

/// Test bytecode execution of RETURNDATASIZE opcode through the dispatch system
test "RETURNDATASIZE opcode execution through dispatch" {
    // Create bytecode that uses RETURNDATASIZE
    const bytecode = [_]u8{
        0x3D,       // RETURNDATASIZE - Get size of return data buffer and push to stack
        0x60, 0x00, // PUSH1 0x00 - Push 0 to stack for comparison
        0x14,       // EQ - Compare if return data size equals 0
        0x60, 0x10, // PUSH1 0x10 - Push jump destination
        0x57,       // JUMPI - Jump if equal
        0x60, 0x01, // PUSH1 0x01 - Push 1 as result
        0x60, 0x00, // PUSH1 0x00 - Memory position
        0x52,       // MSTORE - Store in memory
        0x60, 0x20, // PUSH1 0x20 - Return size (32 bytes)
        0x60, 0x00, // PUSH1 0x00 - Return offset
        0xF3,       // RETURN - Return the result
        0x5B,       // JUMPDEST - Target of successful jump
        0x60, 0x00, // PUSH1 0x00 - Push 0 as result
        0x60, 0x00, // PUSH1 0x00 - Memory position
        0x52,       // MSTORE - Store in memory
        0x60, 0x20, // PUSH1 0x20 - Return size (32 bytes)
        0x60, 0x00, // PUSH1 0x00 - Return offset
        0xF3,       // RETURN - Return the result
    };
    
    // Create interpreter
    var interpreter = try Interpreter.init(testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // First test with empty return data (should return 0)
    const result1 = interpreter.execute();
    
    switch (result1) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 32), success.return_data.len);
            try testing.expectEqual(@as(u8, 0), success.return_data[31]); // Result should be 0
        },
        else => {
            try testing.expect(false); // Should not get here
        },
    }
    
    // Create a new interpreter with the same bytecode but set return data
    var interpreter2 = try Interpreter.init(testing.allocator, &bytecode, 100000, 0);
    defer interpreter2.deinit();
    
    // Set some return data
    try interpreter2.return_data_buffer.set(&[_]u8{0x01, 0x02, 0x03});
    
    // Execute again (should return 1, as return data size is no longer 0)
    const result2 = interpreter2.execute();
    
    switch (result2) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 32), success.return_data.len);
            try testing.expectEqual(@as(u8, 1), success.return_data[31]); // Result should be 1
        },
        else => {
            try testing.expect(false); // Should not get here
        },
    }
}

/// Test bytecode execution of RETURNDATACOPY opcode through the dispatch system
test "RETURNDATACOPY opcode execution through dispatch" {
    // Create bytecode that uses RETURNDATACOPY
    // This bytecode:
    // 1. Sets up initial return data buffer (assumed already set)
    // 2. Copies part of return data to memory using RETURNDATACOPY
    // 3. Returns that memory region
    const bytecode = [_]u8{
        0x60, 0x00, // PUSH1 0x00 - Memory position to copy to
        0x60, 0x01, // PUSH1 0x01 - Skip first byte of return data
        0x60, 0x02, // PUSH1 0x02 - Copy 2 bytes
        0x3E,       // RETURNDATACOPY - Copy return data to memory
        0x60, 0x20, // PUSH1 0x20 - Return 32 bytes
        0x60, 0x00, // PUSH1 0x00 - From memory position 0
        0xF3        // RETURN - Return memory
    };
    
    // Create interpreter and set return data
    var interpreter = try Interpreter.init(testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // Set return data
    const test_data = [_]u8{0xA1, 0xB2, 0xC3, 0xD4};
    try interpreter.return_data_buffer.set(&test_data);
    
    // Execute the bytecode
    const result = interpreter.execute();
    
    // Verify that RETURNDATACOPY worked correctly
    switch (result) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 32), success.return_data.len);
            // Should have copied bytes at offset 1 for length 2 (B2, C3)
            try testing.expectEqual(@as(u8, 0xB2), success.return_data[0]);
            try testing.expectEqual(@as(u8, 0xC3), success.return_data[1]);
        },
        else => {
            try testing.expect(false); // Should not get here
        },
    }
}

/// Test bytecode execution that combines RETURNDATASIZE and RETURNDATACOPY
test "Combined RETURNDATASIZE and RETURNDATACOPY execution" {
    // Create bytecode that:
    // 1. Gets size of return data with RETURNDATASIZE
    // 2. Copies all return data to memory using RETURNDATACOPY
    // 3. Returns the memory region containing the copied data
    const bytecode = [_]u8{
        0x3D,       // RETURNDATASIZE - Get size of return data
        0x60, 0x00, // PUSH1 0x00 - Memory position to copy to
        0x60, 0x00, // PUSH1 0x00 - Return data offset
        0x3D,       // RETURNDATASIZE - Get size again for RETURNDATACOPY
        0x3E,       // RETURNDATACOPY - Copy all return data to memory
        0x3D,       // RETURNDATASIZE - Get size for return
        0x60, 0x00, // PUSH1 0x00 - From memory position 0
        0xF3        // RETURN - Return memory
    };
    
    // Create interpreter and set return data
    var interpreter = try Interpreter.init(testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // Set return data
    const test_data = [_]u8{0xA1, 0xB2, 0xC3, 0xD4};
    try interpreter.return_data_buffer.set(&test_data);
    
    // Execute the bytecode
    const result = interpreter.execute();
    
    // Verify that the combined operations worked correctly
    switch (result) {
        .Success => |success| {
            try testing.expectEqual(test_data.len, success.return_data.len);
            try testing.expectEqualSlices(u8, &test_data, success.return_data);
        },
        else => {
            try testing.expect(false); // Should not get here
        },
    }
}

/// Test error handling with RETURNDATACOPY out-of-bounds access
test "RETURNDATACOPY out-of-bounds error" {
    // Create bytecode that attempts to read beyond return data bounds
    const bytecode = [_]u8{
        0x60, 0x00, // PUSH1 0x00 - Memory position to copy to
        0x60, 0x02, // PUSH1 0x02 - Return data offset
        0x60, 0x03, // PUSH1 0x03 - Size (3 bytes starting at offset 2 would be out of bounds for 4-byte data)
        0x3E,       // RETURNDATACOPY - Should fail with out of bounds error
        0x60, 0x20, // PUSH1 0x20 - Return 32 bytes
        0x60, 0x00, // PUSH1 0x00 - From memory position 0
        0xF3        // RETURN - Return memory
    };
    
    // Create interpreter and set 4 bytes of return data
    var interpreter = try Interpreter.init(testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // Set return data of 4 bytes
    const test_data = [_]u8{0xA1, 0xB2, 0xC3, 0xD4};
    try interpreter.return_data_buffer.set(&test_data);
    
    // Execute the bytecode - should fail with ReturnDataOutOfBounds
    const result = interpreter.execute();
    
    // Verify we got the correct error
    switch (result) {
        .Error => |error_result| {
            try testing.expectEqual(@import("../../util/types.zig").Error.ReturnDataOutOfBounds, error_result.error_type);
        },
        else => {
            try testing.expect(false); // Should not get here
        },
    }
}

/// Test valid edge case: empty return data
test "RETURNDATASIZE and RETURNDATACOPY with empty return data" {
    // Create bytecode that:
    // 1. Gets size of return data with RETURNDATASIZE (should be 0)
    // 2. Attempts to copy 0 bytes from return data (should work even if empty)
    // 3. Returns a constant value to indicate success
    const bytecode = [_]u8{
        0x3D,       // RETURNDATASIZE - Get size of return data
        0x60, 0x00, // PUSH1 0x00 - Memory position to copy to
        0x60, 0x00, // PUSH1 0x00 - Return data offset
        0x60, 0x00, // PUSH1 0x00 - Copy 0 bytes (should work with empty return data)
        0x3E,       // RETURNDATACOPY - Copy 0 bytes (no-op)
        0x60, 0xAA, // PUSH1 0xAA - Success value
        0x60, 0x00, // PUSH1 0x00 - Memory position to store
        0x52,       // MSTORE - Store in memory
        0x60, 0x20, // PUSH1 0x20 - Return 32 bytes
        0x60, 0x00, // PUSH1 0x00 - From memory position 0
        0xF3        // RETURN - Return memory with success indicator
    };
    
    // Create interpreter with empty return data
    var interpreter = try Interpreter.init(testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // Set empty return data
    try interpreter.return_data_buffer.set(&[_]u8{});
    
    // Execute the bytecode
    const result = interpreter.execute();
    
    // Verify that the operations worked correctly with empty return data
    switch (result) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 32), success.return_data.len);
            try testing.expectEqual(@as(u8, 0xAA), success.return_data[31]); // Success value
        },
        else => {
            try testing.expect(false); // Should not get here
        },
    }
}