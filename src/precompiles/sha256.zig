const std = @import("std");
const Sha256 = std.crypto.hash.sha2.Sha256;

/// SHA256 precompile implementation using Zig standard library
/// 
/// Computes the SHA-256 hash of the input data according to Ethereum specifications.
/// This is a straightforward implementation that leverages Zig's built-in SHA-256 hasher.
/// 
/// Input: Any length byte array
/// Output: 32 bytes (SHA-256 hash)
/// Gas cost: 60 + 12 * ceil(input_len / 32)
///
/// This precompile is available in all Ethereum hardforks since Frontier.
pub fn sha256(input: []const u8, allocator: std.mem.Allocator) ![]u8 {
    // Compute SHA-256 hash using Zig's standard library
    var hash_result: [32]u8 = undefined;
    Sha256.hash(input, &hash_result, .{});
    
    // Allocate result buffer and copy hash
    const result = try allocator.alloc(u8, 32);
    std.mem.copy(u8, result, &hash_result);
    
    return result;
}

/// Calculate gas cost for SHA256 precompile
/// 
/// Gas cost formula from Ethereum Yellow Paper:
/// - Base cost: 60 gas
/// - Per-word cost: 12 gas per 32-byte word (rounded up)
/// 
/// This pricing reflects the computational cost of SHA-256 hashing,
/// with a base overhead plus a linear cost based on input size.
pub fn gasCost(input: []const u8) u64 {
    // Calculate number of 32-byte words (rounded up)
    const words = (input.len + 31) / 32;
    
    // Base cost (60) + per-word cost (12 * words)
    return 60 + 12 * @as(u64, @intCast(words));
}

// Tests with known test vectors
const testing = std.testing;

test "sha256 with empty input" {
    const allocator = testing.allocator;
    
    const empty_input: []const u8 = "";
    const result = try sha256(empty_input, allocator);
    defer allocator.free(result);
    
    // Expected SHA-256 of empty string
    // echo -n "" | sha256sum
    const expected = [_]u8{
        0xe3, 0xb0, 0xc4, 0x42, 0x98, 0xfc, 0x1c, 0x14,
        0x9a, 0xfb, 0xf4, 0xc8, 0x99, 0x6f, 0xb9, 0x24,
        0x27, 0xae, 0x41, 0xe4, 0x64, 0x9b, 0x93, 0x4c,
        0xa4, 0x95, 0x99, 0x1b, 0x78, 0x52, 0xb8, 0x55,
    };
    
    try testing.expectEqualSlices(u8, &expected, result);
}

test "sha256 with hello world" {
    const allocator = testing.allocator;
    
    const input = "hello world";
    const result = try sha256(input, allocator);
    defer allocator.free(result);
    
    // Expected SHA-256 of "hello world"
    // echo -n "hello world" | sha256sum
    const expected = [_]u8{
        0xb9, 0x4d, 0x27, 0xb9, 0x93, 0x4d, 0x3e, 0x08,
        0xa5, 0x2e, 0x52, 0xd7, 0xda, 0x7d, 0xab, 0xfa,
        0xc4, 0x84, 0xef, 0xe3, 0x7a, 0x53, 0x80, 0xee,
        0x90, 0x88, 0xf7, 0xac, 0xe2, 0xef, 0xcd, 0xe9,
    };
    
    try testing.expectEqualSlices(u8, &expected, result);
}

test "sha256 with longer input" {
    const allocator = testing.allocator;
    
    // Test with input longer than 32 bytes to verify gas calculation
    const input = "The quick brown fox jumps over the lazy dog";
    const result = try sha256(input, allocator);
    defer allocator.free(result);
    
    // Expected SHA-256 of the fox sentence
    // echo -n "The quick brown fox jumps over the lazy dog" | sha256sum
    const expected = [_]u8{
        0xd7, 0xa8, 0xfb, 0xb3, 0x07, 0xd7, 0x80, 0x94,
        0x69, 0xca, 0x9a, 0xbc, 0xb0, 0x08, 0x2e, 0x4f,
        0x8d, 0x56, 0x51, 0xe4, 0x6d, 0x3c, 0xdb, 0x76,
        0x2d, 0x02, 0xd0, 0xbf, 0x37, 0xc9, 0xe5, 0x92,
    };
    
    try testing.expectEqualSlices(u8, &expected, result);
}

test "sha256 gas cost calculation" {
    // Test gas cost for various input sizes
    
    // Empty input: 0 bytes = 0 words -> 60 + 12*0 = 60 gas
    try testing.expect(gasCost("") == 60);
    
    // 1 byte: 1 word -> 60 + 12*1 = 72 gas
    try testing.expect(gasCost("a") == 72);
    
    // 32 bytes: 1 word -> 60 + 12*1 = 72 gas
    const input32 = "a" ** 32;
    try testing.expect(gasCost(input32) == 72);
    
    // 33 bytes: 2 words -> 60 + 12*2 = 84 gas
    const input33 = "a" ** 33;
    try testing.expect(gasCost(input33) == 84);
    
    // 64 bytes: 2 words -> 60 + 12*2 = 84 gas
    const input64 = "a" ** 64;
    try testing.expect(gasCost(input64) == 84);
    
    // 65 bytes: 3 words -> 60 + 12*3 = 96 gas
    const input65 = "a" ** 65;
    try testing.expect(gasCost(input65) == 96);
}

test "sha256 deterministic output" {
    const allocator = testing.allocator;
    
    const input = "test data";
    
    // Hash the same input multiple times
    const result1 = try sha256(input, allocator);
    defer allocator.free(result1);
    
    const result2 = try sha256(input, allocator);
    defer allocator.free(result2);
    
    // Results should be identical
    try testing.expectEqualSlices(u8, result1, result2);
}

test "sha256 output length" {
    const allocator = testing.allocator;
    
    // Test various input sizes all produce 32-byte output
    const inputs = [_][]const u8{
        "",
        "a",
        "hello",
        "a" ** 100,
        "a" ** 1000,
    };
    
    for (inputs) |input| {
        const result = try sha256(input, allocator);
        defer allocator.free(result);
        
        try testing.expect(result.len == 32);
    }
}

test "sha256 edge cases" {
    const allocator = testing.allocator;
    
    // Test with binary data (not just text)
    const binary_input = [_]u8{ 0x00, 0x01, 0x02, 0xFF, 0xFE, 0xFD };
    const result = try sha256(&binary_input, allocator);
    defer allocator.free(result);
    
    try testing.expect(result.len == 32);
    
    // Should be deterministic
    const result2 = try sha256(&binary_input, allocator);
    defer allocator.free(result2);
    
    try testing.expectEqualSlices(u8, result, result2);
}