const std = @import("std");

/// IDENTITY precompile implementation using pure Zig
/// 
/// The simplest Ethereum precompile that returns input data unchanged.
/// This precompile is used for copying data with predictable gas costs.
/// 
/// Input: Any length byte array
/// Output: Exact copy of input data (same length)
/// Gas cost: 15 + 3 * ceil(input_len / 32)
///
/// This precompile is available in all Ethereum hardforks since Frontier.
pub fn identity(input: []const u8, allocator: std.mem.Allocator) ![]u8 {
    // Allocate memory for the result
    const result = try allocator.alloc(u8, input.len);
    
    // Copy input data to result (identity operation)
    if (input.len > 0) {
        @memcpy(result, input);
    }
    
    return result;
}

/// Calculate gas cost for IDENTITY precompile
/// 
/// Gas cost formula from Ethereum Yellow Paper:
/// - Base cost: 15 gas
/// - Per-word cost: 3 gas per 32-byte word (rounded up)
/// 
/// This is the cheapest precompile for data copying operations.
pub fn gasCost(input: []const u8) u64 {
    // Calculate number of 32-byte words (rounded up)
    const words = (input.len + 31) / 32;
    
    // Base cost (15) + per-word cost (3 * words)
    return 15 + 3 * @as(u64, @intCast(words));
}

// Tests - written first following TDD
const testing = std.testing;

test "identity with empty input" {
    const allocator = testing.allocator;
    
    const empty_input: []const u8 = "";
    const result = try identity(empty_input, allocator);
    defer allocator.free(result);
    
    // Should return empty slice for empty input
    try testing.expect(result.len == 0);
    try testing.expectEqualSlices(u8, empty_input, result);
}

test "identity with single byte" {
    const allocator = testing.allocator;
    
    const input = [_]u8{0x42};
    const result = try identity(&input, allocator);
    defer allocator.free(result);
    
    // Should return exact copy
    try testing.expectEqualSlices(u8, &input, result);
}

test "identity with hello world" {
    const allocator = testing.allocator;
    
    const input = "hello world";
    const result = try identity(input, allocator);
    defer allocator.free(result);
    
    // Should return exact copy
    try testing.expectEqualSlices(u8, input, result);
}

test "identity with binary data" {
    const allocator = testing.allocator;
    
    const input = [_]u8{ 0x00, 0x01, 0x02, 0xFF, 0xFE, 0xFD, 0x80, 0x7F };
    const result = try identity(&input, allocator);
    defer allocator.free(result);
    
    // Should return exact copy including binary values
    try testing.expectEqualSlices(u8, &input, result);
}

test "identity with large input" {
    const allocator = testing.allocator;
    
    // Create 1000-byte input
    var large_input: [1000]u8 = undefined;
    for (&large_input, 0..) |*byte, i| {
        byte.* = @as(u8, @intCast(i % 256));
    }
    
    const result = try identity(&large_input, allocator);
    defer allocator.free(result);
    
    // Should return exact copy of large data
    try testing.expectEqualSlices(u8, &large_input, result);
}

test "identity gas cost calculation" {
    // Test gas cost for various input sizes
    
    // Empty input: 0 bytes = 0 words -> 15 + 3*0 = 15 gas
    try testing.expect(gasCost("") == 15);
    
    // 1 byte: 1 word -> 15 + 3*1 = 18 gas
    try testing.expect(gasCost("a") == 18);
    
    // 32 bytes: 1 word -> 15 + 3*1 = 18 gas
    const input32 = "a" ** 32;
    try testing.expect(gasCost(input32) == 18);
    
    // 33 bytes: 2 words -> 15 + 3*2 = 21 gas
    const input33 = "a" ** 33;
    try testing.expect(gasCost(input33) == 21);
    
    // 64 bytes: 2 words -> 15 + 3*2 = 21 gas
    const input64 = "a" ** 64;
    try testing.expect(gasCost(input64) == 21);
    
    // 65 bytes: 3 words -> 15 + 3*3 = 24 gas
    const input65 = "a" ** 65;
    try testing.expect(gasCost(input65) == 24);
}

test "identity deterministic output" {
    const allocator = testing.allocator;
    
    const input = "test data for determinism";
    
    // Call identity multiple times
    const result1 = try identity(input, allocator);
    defer allocator.free(result1);
    
    const result2 = try identity(input, allocator);
    defer allocator.free(result2);
    
    // Results should be identical
    try testing.expectEqualSlices(u8, result1, result2);
    try testing.expectEqualSlices(u8, input, result1);
    try testing.expectEqualSlices(u8, input, result2);
}

test "identity memory isolation" {
    const allocator = testing.allocator;
    
    var original = [_]u8{ 1, 2, 3, 4, 5 };
    const result = try identity(&original, allocator);
    defer allocator.free(result);
    
    // Modify original after copying
    original[0] = 99;
    
    // Result should be unchanged (independent memory)
    try testing.expect(result[0] == 1);
    try testing.expect(original[0] == 99);
}

test "identity edge cases" {
    const allocator = testing.allocator;
    
    // Test with different data patterns
    const test_cases = [_][]const u8{
        &[_]u8{}, // Empty
        &[_]u8{0x00}, // Single zero
        &[_]u8{0xFF}, // Single max byte
        &[_]u8{ 0x00, 0xFF, 0x00, 0xFF }, // Alternating pattern
        "UTF-8: Hello 🌍", // UTF-8 text
    };
    
    for (test_cases) |test_input| {
        const result = try identity(test_input, allocator);
        defer allocator.free(result);
        
        try testing.expect(result.len == test_input.len);
        try testing.expectEqualSlices(u8, test_input, result);
    }
}