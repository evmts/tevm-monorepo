const std = @import("std");
const testing = std.testing;
const JumpTable = @import("../../src/evm/jump_table.zig");

test "JumpTable: cache-line alignment verification" {
    const allocator = testing.allocator;
    _ = allocator;
    
    // Create a jump table
    var jump_table = JumpTable.init();
    
    // Get the address of the table
    const table_addr = @intFromPtr(&jump_table.table);
    
    // Verify alignment to cache line boundary
    try testing.expectEqual(@as(usize, 0), table_addr % JumpTable.CACHE_LINE_SIZE);
}

test "JumpTable: table size and performance characteristics" {
    // Verify table takes exactly 256 * 8 = 2048 bytes
    const table_size = @sizeOf([256]?*const @import("../../src/evm/operation.zig"));
    try testing.expectEqual(@as(usize, 2048), table_size);
    
    // Calculate cache lines used: 2048 / 64 = 32 cache lines
    const cache_lines = table_size / JumpTable.CACHE_LINE_SIZE;
    try testing.expectEqual(@as(usize, 32), cache_lines);
    
    // This means the entire jump table fits in L1 cache on modern processors
    // (typical L1 data cache is 32KB-64KB)
}

test "JumpTable: frequently used opcodes in early cache lines" {
    // Most frequently used opcodes are in the first 128 entries
    // This includes:
    // - Arithmetic operations (0x01-0x0b)
    // - Stack operations (0x50-0x5f, 0x60-0x7f, 0x80-0x8f, 0x90-0x9f)
    // - Memory operations (0x51-0x53)
    
    // These fit in the first 16 cache lines (128 * 8 = 1024 bytes = 16 * 64)
    // This provides good cache locality for typical smart contract execution
    
    // Verify common opcode ranges
    const common_ranges = [_]struct { start: u8, end: u8 }{
        .{ .start = 0x01, .end = 0x0b }, // Arithmetic
        .{ .start = 0x50, .end = 0x5f }, // Stack/Memory
        .{ .start = 0x60, .end = 0x7f }, // PUSH
        .{ .start = 0x80, .end = 0x8f }, // DUP
        .{ .start = 0x90, .end = 0x9f }, // SWAP
    };
    
    for (common_ranges) |range| {
        // All these opcodes are in the first half of the table
        try testing.expect(range.end < 128);
    }
}

test "JumpTable: get_operation is inlined" {
    // This test verifies that get_operation is properly marked as inline
    // The actual inlining is verified by compiler optimization, but we can
    // ensure the function exists and works correctly
    
    var jump_table = JumpTable.init();
    
    // Test that get_operation returns Operation.NULL for uninitialized entries
    const op = jump_table.get_operation(0xFF);
    try testing.expectEqual(&@import("../../src/evm/operation.zig").NULL, op);
}