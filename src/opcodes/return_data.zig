//! Return data operations for ZigEVM
//! This module implements the RETURNDATASIZE and RETURNDATACOPY opcodes

const std = @import("std");
const types = @import("../util/types.zig");
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;
const ReturnData = @import("../interpreter/return_data.zig").ReturnData;
const U256 = types.U256;
const Error = types.Error;

/// Implementation of RETURNDATASIZE opcode
/// Pushes the size of the return data buffer onto the stack
pub fn returndatasize(
    stack: *Stack,
    return_data: *const ReturnData,
) Error!void {
    // Push the size of the return data buffer onto the stack
    try stack.push(U256.fromU64(return_data.size()));
}

/// Implementation of RETURNDATACOPY opcode
/// Copies data from the return data buffer to memory
pub fn returndatacopy(
    stack: *Stack,
    memory: *Memory,
    return_data: *const ReturnData,
) Error!void {
    // Pop destination offset, source offset, and size from stack
    const size = try stack.pop();
    const offset = try stack.pop();
    const dest_offset = try stack.pop();
    
    // Ensure the parameters fit in usize
    if (size.words[1] != 0 or size.words[2] != 0 or size.words[3] != 0 or
        offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0 or
        dest_offset.words[1] != 0 or dest_offset.words[2] != 0 or dest_offset.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_size = @as(usize, size.words[0]);
    const mem_offset = @as(usize, offset.words[0]);
    const mem_dest = @as(usize, dest_offset.words[0]);
    
    // Skip operation for zero size
    if (mem_size == 0) {
        return;
    }
    
    // Check bounds - critical security check!
    if (mem_offset + mem_size > return_data.size()) {
        return Error.ReturnDataOutOfBounds;
    }
    
    // Expand memory if needed
    _ = memory.expand(mem_dest + mem_size);
    
    // Get the data from the return data buffer
    const data_slice = try return_data.get(mem_offset, mem_size);
    
    // Copy data to memory
    memory.store(mem_dest, data_slice);
}

// Tests for return data operations
test "returndatasize" {
    // Setup
    var stack = Stack.init();
    var return_data = ReturnData.init(std.testing.allocator);
    defer return_data.deinit();
    
    // Set return data to a test value
    const test_data = [_]u8{0x01, 0x02, 0x03, 0x04};
    try return_data.set(&test_data);
    
    // Execute RETURNDATASIZE
    try returndatasize(&stack, &return_data);
    
    // Check that the correct size was pushed
    try std.testing.expectEqual(@as(usize, 1), stack.getSize());
    try std.testing.expectEqual(U256.fromU64(4), try stack.peek().*);
}

test "returndatacopy" {
    // Setup
    var stack = Stack.init();
    var return_data = ReturnData.init(std.testing.allocator);
    var memory = try Memory.init(std.testing.allocator);
    defer return_data.deinit();
    defer memory.deinit();
    
    // Set return data to a test value
    const test_data = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08};
    try return_data.set(&test_data);
    
    // Push arguments for RETURNDATACOPY
    try stack.push(U256.fromU64(0)); // destination offset
    try stack.push(U256.fromU64(2)); // source offset
    try stack.push(U256.fromU64(4)); // size
    
    // Execute RETURNDATACOPY
    try returndatacopy(&stack, &memory, &return_data);
    
    // Check that the data was copied correctly
    const mem_data = memory.page.buffer;
    try std.testing.expectEqual(@as(u8, 0x03), mem_data[0]);
    try std.testing.expectEqual(@as(u8, 0x04), mem_data[1]);
    try std.testing.expectEqual(@as(u8, 0x05), mem_data[2]);
    try std.testing.expectEqual(@as(u8, 0x06), mem_data[3]);
}

test "returndatacopy out of bounds" {
    // Setup
    var stack = Stack.init();
    var return_data = ReturnData.init(std.testing.allocator);
    var memory = try Memory.init(std.testing.allocator);
    defer return_data.deinit();
    defer memory.deinit();
    
    // Set return data to a test value
    const test_data = [_]u8{0x01, 0x02, 0x03, 0x04};
    try return_data.set(&test_data);
    
    // Push arguments for RETURNDATACOPY - out of bounds
    try stack.push(U256.fromU64(0)); // destination offset
    try stack.push(U256.fromU64(2)); // source offset
    try stack.push(U256.fromU64(6)); // size (too large)
    
    // Execute RETURNDATACOPY - should fail with ReturnDataOutOfBounds
    try std.testing.expectError(Error.ReturnDataOutOfBounds, returndatacopy(&stack, &memory, &return_data));
}