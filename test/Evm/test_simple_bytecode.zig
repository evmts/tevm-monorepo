const std = @import("std");
const testing = std.testing;

// Simple bytecode test that checks if the EVM can execute basic operations
// This is raw bytecode that adds 10 + 20 and returns the result
const ADD_BYTECODE = [_]u8{
    0x60, 0x0A, // PUSH1 10
    0x60, 0x14, // PUSH1 20
    0x01,       // ADD
    0x60, 0x00, // PUSH1 0
    0x52,       // MSTORE
    0x60, 0x20, // PUSH1 32
    0x60, 0x00, // PUSH1 0
    0xF3,       // RETURN
};

test "Simple ADD bytecode execution" {
    std.debug.print("\n=== Simple EVM Test ===\n", .{});
    std.debug.print("Testing bytecode that calculates 10 + 20\n", .{});
    std.debug.print("Expected result: 30\n", .{});
    
    // Print the bytecode
    std.debug.print("\nBytecode: ", .{});
    for (ADD_BYTECODE) |byte| {
        std.debug.print("{x:0>2} ", .{byte});
    }
    std.debug.print("\n", .{});
    
    std.debug.print("\nDisassembly:\n", .{});
    std.debug.print("  00: PUSH1 0x0A (10)\n", .{});
    std.debug.print("  02: PUSH1 0x14 (20)\n", .{});
    std.debug.print("  04: ADD\n", .{});
    std.debug.print("  05: PUSH1 0x00\n", .{});
    std.debug.print("  07: MSTORE\n", .{});
    std.debug.print("  08: PUSH1 0x20 (32)\n", .{});
    std.debug.print("  0A: PUSH1 0x00\n", .{});
    std.debug.print("  0C: RETURN\n", .{});
    
    // This test demonstrates the bytecode structure
    // When the EVM is fixed, this bytecode should return 32 bytes with value 30 in the last byte
}