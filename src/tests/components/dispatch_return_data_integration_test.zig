//! Integration test for the complete flow of return data between dispatch and interpreter
//! Tests the end-to-end functionality of return data with properly integrated dispatch system

const std = @import("std");
const testing = std.testing;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const ReturnData = @import("../../interpreter/return_data.zig").ReturnData;
const dispatch = @import("../../opcodes/dispatch.zig");
const Opcode = @import("../../opcodes/opcodes.zig").Opcode;
const types = @import("../../util/types.zig");
const ExecutionResult = types.ExecutionResult;
const U256 = types.U256;
const Error = types.Error;

/// Test the integration between dispatch system and interpreter
test "Integrated dispatch and interpreter return data operations" {
    // Setup
    var allocator = testing.allocator;
    
    // Create bytecode that uses RETURNDATASIZE and RETURNDATACOPY
    const bytecode = [_]u8{
        @intFromEnum(Opcode.RETURNDATASIZE),     // Get size of return data
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push memory destination
        @intFromEnum(Opcode.PUSH1), 0x01,        // Push return data offset
        @intFromEnum(Opcode.PUSH1), 0x02,        // Push size to copy
        @intFromEnum(Opcode.RETURNDATACOPY),     // Copy from return data to memory
        @intFromEnum(Opcode.PUSH1), 0x20,        // Push return size (32 bytes)
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push return offset
        @intFromEnum(Opcode.RETURN),             // Return the memory
    };
    
    // Create an interpreter to execute the bytecode
    var interpreter = try Interpreter.init(allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // Set test data in the interpreter's return data buffer
    const test_data = [_]u8{0xA1, 0xB2, 0xC3, 0xD4};
    try interpreter.return_data_buffer.set(&test_data);
    
    // Execute the bytecode using the interpreter
    const result = interpreter.execute();
    
    // Verify execution succeeded and the return data copied correctly
    switch (result) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 32), success.return_data.len);
            // Check that the expected bytes were copied to memory and returned
            try testing.expectEqual(@as(u8, 0xB2), success.return_data[0]); // Byte from offset 1
            try testing.expectEqual(@as(u8, 0xC3), success.return_data[1]); // Byte from offset 2
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test multiple bytecode executions with changing return data
test "Multiple interpreter executions with changing return data" {
    // Setup
    var allocator = testing.allocator;
    
    // Create two different bytecode snippets
    
    // Bytecode 1: Returns a specific value directly
    const bytecode1 = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xAA,        // Push value 0xAA
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push memory offset 0
        @intFromEnum(Opcode.MSTORE),             // Store the value in memory
        @intFromEnum(Opcode.PUSH1), 0x20,        // Push size 32
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push offset 0
        @intFromEnum(Opcode.RETURN),             // Return the memory
    };
    
    // Bytecode 2: Uses RETURNDATASIZE and RETURNDATACOPY to process return data
    const bytecode2 = [_]u8{
        @intFromEnum(Opcode.RETURNDATASIZE),     // Get size of return data
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push memory destination
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push return data offset
        @intFromEnum(Opcode.RETURNDATASIZE),     // Get size again for RETURNDATACOPY
        @intFromEnum(Opcode.RETURNDATACOPY),     // Copy all return data to memory
        @intFromEnum(Opcode.RETURNDATASIZE),     // Get size for return
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push memory offset
        @intFromEnum(Opcode.RETURN),             // Return the memory
    };
    
    // Execute Bytecode 1
    var interpreter1 = try Interpreter.init(allocator, &bytecode1, 100000, 0);
    defer interpreter1.deinit();
    
    const result1 = interpreter1.execute();
    
    // Extract return data from the execution of Bytecode 1
    var return_data1: []const u8 = undefined;
    switch (result1) {
        .Success => |success| {
            return_data1 = success.return_data;
            try testing.expectEqual(@as(usize, 32), success.return_data.len);
            try testing.expectEqual(@as(u8, 0xAA), success.return_data[31]); // Last byte should be 0xAA
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
    
    // Execute Bytecode 2 with return data from Bytecode 1
    var interpreter2 = try Interpreter.init(allocator, &bytecode2, 100000, 0);
    defer interpreter2.deinit();
    
    // Set the return data buffer using data from the first execution
    try interpreter2.return_data_buffer.set(return_data1);
    
    // Execute Bytecode 2
    const result2 = interpreter2.execute();
    
    // Verify Bytecode 2 correctly used the return data from Bytecode 1
    switch (result2) {
        .Success => |success| {
            try testing.expectEqualSlices(u8, return_data1, success.return_data);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test error handling in integrated return data operations
test "Error handling in integrated return data operations" {
    // Setup
    var allocator = testing.allocator;
    
    // Create bytecode that attempts invalid return data access
    const bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push memory destination
        @intFromEnum(Opcode.PUSH1), 0x02,        // Push return data offset (2)
        @intFromEnum(Opcode.PUSH1), 0x03,        // Push size to copy (3 bytes, which would be out of bounds for 4-byte data)
        @intFromEnum(Opcode.RETURNDATACOPY),     // This should fail with out-of-bounds error
        @intFromEnum(Opcode.PUSH1), 0x20,        // Push return size
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push return offset
        @intFromEnum(Opcode.RETURN),             // Return the memory
    };
    
    // Create an interpreter to execute the bytecode
    var interpreter = try Interpreter.init(allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    // Set 4 bytes of return data
    const test_data = [_]u8{0xA1, 0xB2, 0xC3, 0xD4};
    try interpreter.return_data_buffer.set(&test_data);
    
    // Execute the bytecode using the interpreter
    const result = interpreter.execute();
    
    // Verify execution failed with the expected error
    switch (result) {
        .Error => |err| {
            try testing.expectEqual(Error.ReturnDataOutOfBounds, err.error_type);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test RETURNDATASIZE behavior with varying return data sizes
test "RETURNDATASIZE with varying return data sizes" {
    // Setup
    var allocator = testing.allocator;
    
    // Create bytecode that simply gets RETURNDATASIZE and returns it
    const bytecode = [_]u8{
        @intFromEnum(Opcode.RETURNDATASIZE),     // Get size of return data
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push memory offset
        @intFromEnum(Opcode.MSTORE),             // Store the value in memory
        @intFromEnum(Opcode.PUSH1), 0x20,        // Push size 32
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push offset 0
        @intFromEnum(Opcode.RETURN),             // Return the memory
    };
    
    // Test different sizes
    const test_sizes = [_]usize{0, 1, 32, 64, 128};
    
    for (test_sizes) |size| {
        // Create an interpreter for each test case
        var interpreter = try Interpreter.init(allocator, &bytecode, 100000, 0);
        defer interpreter.deinit();
        
        // Create test data of the specified size
        var test_data = try allocator.alloc(u8, size);
        defer allocator.free(test_data);
        
        // Fill with a pattern for identification
        for (0..size) |i| {
            test_data[i] = @truncate(i);
        }
        
        // Set the return data
        try interpreter.return_data_buffer.set(test_data);
        
        // Execute the bytecode
        const result = interpreter.execute();
        
        // Verify RETURNDATASIZE returned the correct size
        switch (result) {
            .Success => |success| {
                try testing.expectEqual(@as(usize, 32), success.return_data.len);
                
                // The return data should be a 32-byte word containing the size
                // Extract the size from the last 8 bytes (for a u64)
                var returned_size: u64 = 0;
                for (0..8) |i| {
                    returned_size = (returned_size << 8) | success.return_data[24 + i];
                }
                
                try testing.expectEqual(@as(u64, size), returned_size);
            },
            else => {
                try testing.expect(false); // This should not happen
            },
        }
    }
}