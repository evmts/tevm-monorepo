//! Test for Return Data Buffer Management (Issue #21)
//! This test validates the solution for Issue #21 from ISSUES.md which requires
//! proper implementation of the return data buffer with support for RETURNDATASIZE
//! and RETURNDATACOPY opcodes across call frames.

const std = @import("std");
const testing = std.testing;
const ReturnData = @import("../../interpreter/return_data.zig").ReturnData;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const dispatch = @import("../../opcodes/dispatch.zig");
const return_data_ops = @import("../../opcodes/return_data.zig");
const Stack = @import("../../stack/stack.zig").Stack;
const Memory = @import("../../memory/memory.zig").Memory;
const types = @import("../../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Opcode = @import("../../opcodes/opcodes.zig").Opcode;

/// Test the complete lifecycle of return data across nested call contexts
test "Return data lifecycle across call frames" {
    // Setup
    var allocator = testing.allocator;

    // Create a "callee" bytecode that returns some data
    const callee_code = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xAA,        // Push 0xAA
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push memory position 0
        @intFromEnum(Opcode.MSTORE),             // Store 0xAA in memory
        @intFromEnum(Opcode.PUSH1), 0x20,        // Push size 32
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push offset 0
        @intFromEnum(Opcode.RETURN),             // Return 32 bytes from memory
    };

    // Create a "caller" bytecode that uses the return data
    const caller_code = [_]u8{
        // This would normally make a call to the callee
        // For this test, we'll manually set the return data instead
        
        // Check the size of return data
        @intFromEnum(Opcode.RETURNDATASIZE),     // Get return data size
        
        // Copy return data to memory
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push memory destination
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push return data offset
        @intFromEnum(Opcode.RETURNDATASIZE),     // Get size again
        @intFromEnum(Opcode.RETURNDATACOPY),     // Copy return data to memory
        
        // Return the memory
        @intFromEnum(Opcode.RETURNDATASIZE),     // Get size for return
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push offset for return
        @intFromEnum(Opcode.RETURN),             // Return the memory
    };

    // First execute the callee to get the return data
    var callee = try Interpreter.init(allocator, &callee_code, 100000, 0);
    defer callee.deinit();
    
    const callee_result = callee.execute();
    
    // Extract return data
    var return_data: []const u8 = undefined;
    switch (callee_result) {
        .Success => |success| {
            return_data = success.return_data;
            try testing.expectEqual(@as(usize, 32), success.return_data.len);
            try testing.expectEqual(@as(u8, 0xAA), success.return_data[31]);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
    
    // Now execute the caller with the return data from the callee
    var caller = try Interpreter.init(allocator, &caller_code, 100000, 0);
    defer caller.deinit();
    
    // Set the return data buffer to simulate a call that just returned
    try caller.return_data_buffer.set(return_data);
    
    // Execute the caller
    const caller_result = caller.execute();
    
    // Verify that the caller correctly accessed and used the return data
    switch (caller_result) {
        .Success => |success| {
            try testing.expectEqualSlices(u8, return_data, success.return_data);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test handling of successful calls and return data propagation
test "Return data propagation for successful calls" {
    // Setup
    var allocator = testing.allocator;

    // Simulate a successful call by executing a contract that returns data
    const successful_code = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xCC,        // Push 0xCC
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push memory position 0
        @intFromEnum(Opcode.MSTORE),             // Store 0xCC in memory
        @intFromEnum(Opcode.PUSH1), 0x01,        // Push size 1 byte
        @intFromEnum(Opcode.PUSH1), 0x1F,        // Push offset 31 (last byte of word)
        @intFromEnum(Opcode.RETURN),             // Return 1 byte from memory
    };

    // Execute the contract
    var interpreter = try Interpreter.init(allocator, &successful_code, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Verify the return data
    switch (result) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 1), success.return_data.len);
            try testing.expectEqual(@as(u8, 0xCC), success.return_data[0]);
            
            // The return data should also be in the return data buffer
            try testing.expectEqual(@as(usize, 1), interpreter.return_data_buffer.size());
            try testing.expectEqual(@as(u8, 0xCC), interpreter.return_data_buffer.buffer[0]);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test handling of reverted calls and return data propagation
test "Return data propagation for reverted calls" {
    // Setup
    var allocator = testing.allocator;

    // Simulate a reverted call by executing a contract that reverts with data
    const revert_code = [_]u8{
        @intFromEnum(Opcode.PUSH1), 0xDD,        // Push 0xDD
        @intFromEnum(Opcode.PUSH1), 0x00,        // Push memory position 0
        @intFromEnum(Opcode.MSTORE),             // Store 0xDD in memory
        @intFromEnum(Opcode.PUSH1), 0x01,        // Push size 1 byte
        @intFromEnum(Opcode.PUSH1), 0x1F,        // Push offset 31 (last byte of word)
        @intFromEnum(Opcode.REVERT),             // Revert with 1 byte from memory
    };

    // Execute the contract
    var interpreter = try Interpreter.init(allocator, &revert_code, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Verify the return data
    switch (result) {
        .Revert => |revert| {
            try testing.expectEqual(@as(usize, 1), revert.return_data.len);
            try testing.expectEqual(@as(u8, 0xDD), revert.return_data[0]);
            
            // The return data should also be in the return data buffer
            try testing.expectEqual(@as(usize, 1), interpreter.return_data_buffer.size());
            try testing.expectEqual(@as(u8, 0xDD), interpreter.return_data_buffer.buffer[0]);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test integration with setReturnData method
test "Integration with setReturnData method" {
    // Setup
    var allocator = testing.allocator;
    var interpreter = try Interpreter.init(allocator, &[_]u8{}, 100000, 0);
    defer interpreter.deinit();
    
    // Test data
    const test_data = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05};
    
    // Call setReturnData to simulate setting return data
    try interpreter.setReturnData(0, test_data.len);
    
    // Verify that return_data_buffer was also updated
    try testing.expectEqual(@as(usize, test_data.len), interpreter.return_data_buffer.size());
    
    // Now try retrieving from return data buffer
    const slice = try interpreter.return_data_buffer.get(0, test_data.len);
    try testing.expectEqual(@as(usize, test_data.len), slice.len);
}

/// Test memory management in ReturnData - ensure proper cleanup
test "ReturnData memory management" {
    // This test ensures that ReturnData properly cleans up allocated memory
    // Setup
    var allocator = testing.allocator;
    var return_data = ReturnData.init(allocator);
    defer return_data.deinit();
    
    // Set data of various sizes and ensure memory is properly freed
    {
        // Allocate a small buffer
        const small_data = [_]u8{0x01, 0x02, 0x03};
        try return_data.set(&small_data);
        try testing.expectEqual(@as(usize, 3), return_data.size());
        
        // Allocate a larger buffer (should free the previous one)
        const large_data = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08};
        try return_data.set(&large_data);
        try testing.expectEqual(@as(usize, 8), return_data.size());
        
        // Set to empty (should free the previous buffer)
        try return_data.set(&[_]u8{});
        try testing.expectEqual(@as(usize, 0), return_data.size());
        
        // Set data again
        const medium_data = [_]u8{0x0A, 0x0B, 0x0C, 0x0D, 0x0E};
        try return_data.set(&medium_data);
        try testing.expectEqual(@as(usize, 5), return_data.size());
    }
    
    // Clear and ensure memory is freed
    return_data.clear();
    try testing.expectEqual(@as(usize, 0), return_data.size());
}

/// Test gas accounting for RETURNDATASIZE and RETURNDATACOPY
test "Gas accounting for return data operations" {
    // Setup
    var allocator = testing.allocator;
    
    // Create bytecode that uses both RETURNDATASIZE and RETURNDATACOPY
    const code = [_]u8{
        @intFromEnum(Opcode.RETURNDATASIZE),     // RETURNDATASIZE - costs 2 gas
        @intFromEnum(Opcode.PUSH1), 0x00,        // PUSH1 - costs 3 gas
        @intFromEnum(Opcode.PUSH1), 0x00,        // PUSH1 - costs 3 gas
        @intFromEnum(Opcode.PUSH1), 0x20,        // PUSH1 - costs 3 gas
        @intFromEnum(Opcode.RETURNDATACOPY),     // RETURNDATACOPY - costs 3 gas + memory expansion
        @intFromEnum(Opcode.PUSH1), 0x00,        // PUSH1 - costs 3 gas
        @intFromEnum(Opcode.MSTORE),             // MSTORE - costs 3 gas
        @intFromEnum(Opcode.PUSH1), 0x20,        // PUSH1 - costs 3 gas
        @intFromEnum(Opcode.PUSH1), 0x00,        // PUSH1 - costs 3 gas
        @intFromEnum(Opcode.RETURN),             // RETURN - costs 0 gas (handled by interpreter)
    };
    
    // Set up test data
    const test_data = [_]u8{0xA1, 0xB2, 0xC3, 0xD4, 0xE5, 0xF6, 0xA7, 0xB8};
    
    // Initialize interpreter with plenty of gas
    const gas_limit: u64 = 100000;
    var interpreter = try Interpreter.init(allocator, &code, gas_limit, 0);
    defer interpreter.deinit();
    
    // Set return data
    try interpreter.return_data_buffer.set(&test_data);
    
    // Execute the bytecode
    const result = interpreter.execute();
    
    // Verify gas consumption
    switch (result) {
        .Success => |success| {
            // Ensure some gas was used
            try testing.expect(success.gas_used > 0);
            try testing.expect(success.gas_used < gas_limit);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}