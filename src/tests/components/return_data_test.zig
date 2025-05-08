//! Tests for the ReturnData module
//! Verifies the proper implementation of the return data buffer, RETURNDATASIZE and RETURNDATACOPY

const std = @import("std");
const testing = std.testing;
const ReturnData = @import("../../interpreter/return_data.zig").ReturnData;
const types = @import("../../util/types.zig");
const Error = types.Error;
const U256 = types.U256;
const Stack = @import("../../stack/stack.zig").Stack;
const Memory = @import("../../memory/memory.zig").Memory;

/// Basic ReturnData operations test
test "ReturnData basic operations" {
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Test initial empty state
    try testing.expect(return_data.size() == 0);
    
    // Set data and check size
    const test_data = [_]u8{0x01, 0x02, 0x03, 0x04};
    try return_data.set(&test_data);
    try testing.expect(return_data.size() == 4);
    
    // Get a slice of the data
    const slice = try return_data.get(1, 2);
    try testing.expectEqualSlices(u8, &[_]u8{0x02, 0x03}, slice);
    
    // Test out-of-bounds access
    try testing.expectError(Error.ReturnDataOutOfBounds, return_data.get(2, 3));
    
    // Update with new data
    const new_data = [_]u8{0xAA, 0xBB, 0xCC};
    try return_data.set(&new_data);
    try testing.expect(return_data.size() == 3);
    try testing.expectEqual(@as(u8, 0xBB), (try return_data.get(1, 1))[0]);
    
    // Clear the data
    return_data.clear();
    try testing.expect(return_data.size() == 0);
}

/// Test creating a return data buffer from call results
test "ReturnData from call results" {
    // Simulate a contract call that returns data
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Pretend this is data returned from a call
    const call_result = [_]u8{0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09};
    try return_data.set(&call_result);
    
    try testing.expect(return_data.size() == 10);
    try testing.expectEqualSlices(u8, &call_result, return_data.buffer);
    
    // Get a slice in the middle
    const middle_slice = try return_data.get(3, 4);
    try testing.expectEqualSlices(u8, &[_]u8{0x03, 0x04, 0x05, 0x06}, middle_slice);
}

/// Test ResurnData buffer when setting to empty
test "ReturnData empty operations" {
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Set non-empty data first
    const test_data = [_]u8{0x01, 0x02, 0x03, 0x04};
    try return_data.set(&test_data);
    try testing.expect(return_data.size() == 4);
    
    // Now set to empty
    try return_data.set(&[_]u8{});
    try testing.expect(return_data.size() == 0);
    
    // Setting to empty again should not crash
    try return_data.set(&[_]u8{});
    try testing.expect(return_data.size() == 0);
}

/// Complex test case for integrating with memory and stack operations
test "ReturnData integration with memory and stack" {
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    var stack = Stack.init();
    var memory = try Memory.init(testing.allocator);
    defer memory.deinit();
    
    // Set return data from a simulated call
    const call_result = [_]u8{0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88};
    try return_data.set(&call_result);
    
    // Simulate RETURNDATASIZE opcode - pushes size to stack
    try stack.push(U256.fromU64(return_data.size()));
    try testing.expectEqual(U256.fromU64(8), try stack.pop());
    
    // Simulate RETURNDATACOPY - copies from return data to memory
    // Args: destOffset, offset, size
    const dest_offset: usize = 16;
    const data_offset: usize = 2;
    const copy_size: usize = 4;
    
    // Get the data to copy
    const data_to_copy = try return_data.get(data_offset, copy_size);
    
    // Copy to memory (ensure it expands as needed)
    memory.store(dest_offset, data_to_copy);
    
    // Verify memory has the correct data
    const expected = [_]u8{0x33, 0x44, 0x55, 0x66};
    for (0..copy_size) |i| {
        try testing.expectEqual(expected[i], memory.page.buffer[dest_offset + i]);
    }
    
    // Test out-of-bounds handling
    try testing.expectError(Error.ReturnDataOutOfBounds, return_data.get(7, 2));
}

/// Test multiple updates to return data buffer
test "ReturnData multiple updates" {
    var return_data = ReturnData.init(testing.allocator);
    defer return_data.deinit();
    
    // Multiple updates to test proper memory management
    for (0..10) |i| {
        const size = i + 1;
        var data = try testing.allocator.alloc(u8, size);
        defer testing.allocator.free(data);
        
        @memset(data, @intCast(i + 0xA0));
        try return_data.set(data);
        try testing.expect(return_data.size() == size);
        
        // Verify all bytes are set correctly
        const buffer = return_data.buffer;
        for (0..size) |j| {
            try testing.expectEqual(@as(u8, @intCast(i + 0xA0)), buffer[j]);
        }
    }
}