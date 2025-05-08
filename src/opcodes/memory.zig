//! Memory operation handlers for ZigEVM
//! This module implements handlers for memory opcodes

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;

/// Load a 32-byte word from memory (MLOAD)
pub fn mload(stack: *Stack, memory: *Memory) !void {
    // Get the offset from the stack
    const offset = try stack.pop();
    
    // Ensure the offset fits in usize
    if (offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_offset = @intCast(offset.words[0]);
    
    // Load from memory (memory will expand as needed)
    const value = memory.load32(mem_offset);
    
    // Push the value to the stack
    try stack.push(value);
}

/// Store a 32-byte word to memory (MSTORE)
pub fn mstore(stack: *Stack, memory: *Memory) !void {
    // Get the offset and value from the stack
    const offset = try stack.pop();
    const value = try stack.pop();
    
    // Ensure the offset fits in usize
    if (offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_offset = @intCast(offset.words[0]);
    
    // Store to memory (memory will expand as needed)
    memory.store32(mem_offset, value);
}

/// Store a single byte to memory (MSTORE8)
pub fn mstore8(stack: *Stack, memory: *Memory) !void {
    // Get the offset and value from the stack
    const offset = try stack.pop();
    const value = try stack.pop();
    
    // Ensure the offset fits in usize
    if (offset.words[1] != 0 or offset.words[2] != 0 or offset.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const mem_offset = @intCast(offset.words[0]);
    
    // Get the least significant byte
    const byte = @intCast(value.words[0] & 0xFF);
    
    // Store to memory (memory will expand as needed)
    memory.store8(mem_offset, byte);
}

/// Get the size of memory in bytes (MSIZE)
pub fn msize(stack: *Stack, memory: *Memory) !void {
    // Push the current memory size to the stack
    try stack.push(U256.fromU64(memory.getSize()));
}

/// Copy data within memory (MCOPY - introduced in Cancun)
pub fn mcopy(stack: *Stack, memory: *Memory) !void {
    // Get the parameters from the stack
    const dest_offset = try stack.pop();
    const source_offset = try stack.pop();
    const size = try stack.pop();
    
    // Ensure all parameters fit in usize
    if (dest_offset.words[1] != 0 or dest_offset.words[2] != 0 or dest_offset.words[3] != 0 or
        source_offset.words[1] != 0 or source_offset.words[2] != 0 or source_offset.words[3] != 0 or
        size.words[1] != 0 or size.words[2] != 0 or size.words[3] != 0) {
        return Error.InvalidOffset;
    }
    
    // Convert to usize
    const dest = @intCast(dest_offset.words[0]);
    const source = @intCast(source_offset.words[0]);
    const len = @intCast(size.words[0]);
    
    // Perform the copy (memory will expand as needed)
    memory.copy(dest, source, len);
}

// Tests
test "memory operations" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Test MSTORE and MLOAD
    try stack.push(U256.fromU64(0)); // Offset
    try stack.push(U256.fromU64(0xDEADBEEF)); // Value
    try mstore(&stack, &memory);
    
    try stack.push(U256.fromU64(0)); // Offset
    try mload(&stack, &memory);
    try std.testing.expectEqual(U256.fromU64(0xDEADBEEF), try stack.pop());
    
    // Test MSTORE8
    try stack.push(U256.fromU64(32)); // Offset
    try stack.push(U256.fromU64(0xAB)); // Value
    try mstore8(&stack, &memory);
    
    try stack.push(U256.fromU64(32)); // Offset
    try mload(&stack, &memory);
    try std.testing.expectEqual(U256.fromU64(0xAB00000000000000000000000000000000000000000000000000000000000000), try stack.pop());
    
    // Test MSIZE
    try msize(&stack, &memory);
    try std.testing.expect((try stack.pop()).words[0] >= 64); // Should be at least 64 bytes now
    
    // Test MCOPY
    try stack.push(U256.fromU64(0)); // Source offset
    try stack.push(U256.fromU64(0xABCDEF)); // Value at source
    try mstore(&stack, &memory);
    
    try stack.push(U256.fromU64(64)); // Destination offset
    try stack.push(U256.fromU64(0)); // Source offset
    try stack.push(U256.fromU64(32)); // Size
    try mcopy(&stack, &memory);
    
    try stack.push(U256.fromU64(64)); // Offset
    try mload(&stack, &memory);
    try std.testing.expectEqual(U256.fromU64(0xABCDEF), try stack.pop());
}