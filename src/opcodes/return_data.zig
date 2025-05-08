//! Return data related opcodes for ZigEVM
//! This module implements the RETURNDATASIZE and RETURNDATACOPY opcodes

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;
const ReturnData = @import("../interpreter/return_data.zig").ReturnData;

/// Implementation of the RETURNDATASIZE opcode
/// Pushes the size of the return data buffer to the stack
pub fn returndatasize(
    stack: *Stack,
    return_data: *const ReturnData,
) !void {
    // Push return data buffer size to stack
    try stack.push(U256.fromU64(return_data.size()));
}

/// Implementation of the RETURNDATACOPY opcode
/// Copies data from the return data buffer to memory
/// Stack: [destOffset, offset, size] -> []
pub fn returndatacopy(
    stack: *Stack,
    memory: *Memory,
    return_data: *const ReturnData,
) !void {
    // Pop parameters from stack
    const size = try stack.pop();
    const offset = try stack.pop();
    const dest_offset = try stack.pop();
    
    // Validate parameters (ensure they fit in usize)
    if (size.words[1] != 0 or size.words[2] != 0 or size.words[3] != 0 or
        offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0 or
        dest_offset.words[1] != 0 or dest_offset.words[2] != 0 or dest_offset.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_size = @intCast(size.words[0]);
    const mem_offset = @intCast(offset.words[0]);
    const mem_dest = @intCast(dest_offset.words[0]);
    
    // Skip operation for zero size
    if (mem_size == 0) {
        return;
    }
    
    // Get data from return data buffer
    const data = return_data.get(mem_offset, mem_size) catch |err| {
        // Handle out-of-bounds access
        if (err == Error.ReturnDataOutOfBounds) {
            return Error.ReturnDataOutOfBounds;
        }
        return err;
    };
    
    // Copy to memory
    memory.store(mem_dest, data);
}

// Tests
test "return data opcodes" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    var return_data = ReturnData.init(std.testing.allocator);
    defer return_data.deinit();
    
    // Test with empty return data
    try returndatasize(&stack, &return_data);
    try std.testing.expectEqual(U256.fromU64(0), try stack.pop());
    
    // Set some return data
    const test_data = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05};
    try return_data.set(&test_data);
    
    // Test RETURNDATASIZE with data
    try returndatasize(&stack, &return_data);
    try std.testing.expectEqual(U256.fromU64(5), try stack.pop());
    
    // Test RETURNDATACOPY
    // Setup stack: [destOffset, offset, size]
    try stack.push(U256.fromU64(10)); // destOffset
    try stack.push(U256.fromU64(1));  // offset
    try stack.push(U256.fromU64(3));  // size
    
    try returndatacopy(&stack, &memory, &return_data);
    
    // Verify memory contains copied data
    try std.testing.expectEqual(@as(u8, 0x02), memory.page.buffer[10]);
    try std.testing.expectEqual(@as(u8, 0x03), memory.page.buffer[11]);
    try std.testing.expectEqual(@as(u8, 0x04), memory.page.buffer[12]);
    
    // Test out-of-bounds error
    try stack.push(U256.fromU64(20)); // destOffset
    try stack.push(U256.fromU64(3));  // offset
    try stack.push(U256.fromU64(3));  // size (would go beyond return data size)
    
    try std.testing.expectError(Error.ReturnDataOutOfBounds, returndatacopy(&stack, &memory, &return_data));
}