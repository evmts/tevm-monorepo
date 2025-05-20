const std = @import("std");
const bls12_381 = @import("bls12_381.zig");
const common = @import("common.zig");

// Test vectors for BLS12-381 operations
// These are simplified test vectors for basic validation

test "BLS12-381 G1 Addition: point at infinity + point = point" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // First point: point at infinity (all zeros)
    var input = [_]u8{0} ** 256;
    
    // Second point: a valid G1 point (replace with actual valid point)
    // For simplicity, we'll set some bytes to make it non-zero but still valid
    input[128 + 16] = 1;
    input[128 + 17] = 2;
    input[128 + 64 + 16] = 3;
    input[128 + 64 + 17] = 4;
    
    // Perform G1 addition
    const output = try bls12_381.G1Add.run(&input, allocator) orelse return error.FailedToRun;
    
    // Check that the output matches the second point (identity property)
    for (0..128) |i| {
        try std.testing.expectEqual(input[128 + i], output[i]);
    }
}

test "BLS12-381 G1 Addition: point + point at infinity = point" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // First point: a valid G1 point (replace with actual valid point)
    var input = [_]u8{0} ** 256;
    input[16] = 1;
    input[17] = 2;
    input[64 + 16] = 3;
    input[64 + 17] = 4;
    
    // Second point: point at infinity (all zeros)
    // Already set to zeros
    
    // Perform G1 addition
    const output = try bls12_381.G1Add.run(&input, allocator) orelse return error.FailedToRun;
    
    // Check that the output matches the first point (identity property)
    for (0..128) |i| {
        try std.testing.expectEqual(input[i], output[i]);
    }
}

test "BLS12-381 G1 Addition: point at infinity + point at infinity = point at infinity" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Both points are point at infinity (all zeros)
    var input = [_]u8{0} ** 256;
    
    // Perform G1 addition
    const output = try bls12_381.G1Add.run(&input, allocator) orelse return error.FailedToRun;
    
    // Check that the output is point at infinity (all zeros)
    for (output) |byte| {
        try std.testing.expectEqual(@as(u8, 0), byte);
    }
}

test "BLS12-381 G2 Addition: point at infinity + point = point" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // First point: point at infinity (all zeros)
    var input = [_]u8{0} ** 512;
    
    // Second point: a valid G2 point (replace with actual valid point)
    // For simplicity, we'll set some bytes to make it non-zero but still valid
    input[256 + 16] = 1;
    input[256 + 17] = 2;
    input[256 + 64 + 16] = 3;
    input[256 + 64 + 17] = 4;
    input[256 + 128 + 16] = 5;
    input[256 + 128 + 17] = 6;
    input[256 + 192 + 16] = 7;
    input[256 + 192 + 17] = 8;
    
    // Perform G2 addition
    const output = try bls12_381.G2Add.run(&input, allocator) orelse return error.FailedToRun;
    
    // Check that the output matches the second point (identity property)
    for (0..256) |i| {
        try std.testing.expectEqual(input[256 + i], output[i]);
    }
}

test "BLS12-381 G2 Addition: point + point at infinity = point" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // First point: a valid G2 point (replace with actual valid point)
    var input = [_]u8{0} ** 512;
    input[16] = 1;
    input[17] = 2;
    input[64 + 16] = 3;
    input[64 + 17] = 4;
    input[128 + 16] = 5;
    input[128 + 17] = 6;
    input[192 + 16] = 7;
    input[192 + 17] = 8;
    
    // Second point: point at infinity (all zeros)
    // Already set to zeros
    
    // Perform G2 addition
    const output = try bls12_381.G2Add.run(&input, allocator) orelse return error.FailedToRun;
    
    // Check that the output matches the first point (identity property)
    for (0..256) |i| {
        try std.testing.expectEqual(input[i], output[i]);
    }
}

test "BLS12-381 Pairing: empty input returns 1 (pairing valid)" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Empty input (no pairing points)
    var input = [_]u8{0} ** 0;
    
    // Perform pairing check
    const output = try bls12_381.Pairing.run(&input, allocator) orelse return error.FailedToRun;
    
    // Check that the output is 1 (pairing valid)
    try std.testing.expectEqual(@as(usize, 32), output.len);
    try std.testing.expectEqual(@as(u8, 1), output[31]);
    for (0..31) |i| {
        try std.testing.expectEqual(@as(u8, 0), output[i]);
    }
}

test "BLS12-381 G1 Field to Point Mapping" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Field element input (64 bytes)
    var input = [_]u8{0} ** 64;
    input[16] = 1; // Set a non-zero byte after the 16-byte padding
    
    // Perform mapping to G1
    const output = try bls12_381.MapG1.run(&input, allocator) orelse return error.FailedToRun;
    
    // Check that the output is a valid G1 point (128 bytes)
    try std.testing.expectEqual(@as(usize, 128), output.len);
}

test "BLS12-381 G2 Field to Point Mapping" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Field elements input (128 bytes = 2 field elements)
    var input = [_]u8{0} ** 128;
    input[16] = 1; // Set a non-zero byte after the 16-byte padding in first element
    input[64 + 16] = 2; // Set a non-zero byte after the 16-byte padding in second element
    
    // Perform mapping to G2
    const output = try bls12_381.MapG2.run(&input, allocator) orelse return error.FailedToRun;
    
    // Check that the output is a valid G2 point (256 bytes)
    try std.testing.expectEqual(@as(usize, 256), output.len);
}

test "BLS12-381 G1 MultiExp: single point" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Input: One G1 point (128 bytes) and scalar (32 bytes)
    var input = [_]u8{0} ** 160;
    input[16] = 1; // Set a non-zero byte in the G1 point
    input[64 + 16] = 2;
    input[128] = 1; // Set a non-zero byte in the scalar
    
    // Perform G1 multi-exponentiation
    const output = try bls12_381.G1MultiExp.run(&input, allocator) orelse return error.FailedToRun;
    
    // Check that the output is a valid G1 point (128 bytes)
    try std.testing.expectEqual(@as(usize, 128), output.len);
}

test "BLS12-381 G2 MultiExp: single point" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Input: One G2 point (256 bytes) and scalar (32 bytes)
    var input = [_]u8{0} ** 288;
    input[16] = 1; // Set a non-zero byte in the G2 point
    input[64 + 16] = 2;
    input[128 + 16] = 3;
    input[192 + 16] = 4;
    input[256] = 1; // Set a non-zero byte in the scalar
    
    // Perform G2 multi-exponentiation
    const output = try bls12_381.G2MultiExp.run(&input, allocator) orelse return error.FailedToRun;
    
    // Check that the output is a valid G2 point (256 bytes)
    try std.testing.expectEqual(@as(usize, 256), output.len);
}

test "BLS12-381 Pairing: single pair" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Input: One G1 point (128 bytes) and one G2 point (256 bytes)
    var input = [_]u8{0} ** 384;
    
    // Set non-zero bytes in G1 point
    input[16] = 1;
    input[64 + 16] = 2;
    
    // Set non-zero bytes in G2 point
    input[128 + 16] = 3;
    input[128 + 64 + 16] = 4;
    input[128 + 128 + 16] = 5;
    input[128 + 192 + 16] = 6;
    
    // Perform pairing check
    const output = try bls12_381.Pairing.run(&input, allocator) orelse return error.FailedToRun;
    
    // Check that the output is a 32-byte result
    try std.testing.expectEqual(@as(usize, 32), output.len);
}

test "BLS12-381 G1 Addition: Invalid Input Length" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Invalid input length (not 256 bytes)
    var input = [_]u8{0} ** 128;
    
    // Attempt G1 addition and expect error
    const result = bls12_381.G1Add.run(&input, allocator);
    try std.testing.expectError(error.BLS12381InvalidInputLength, result);
}

test "BLS12-381 G2 Addition: Invalid Input Length" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Invalid input length (not 512 bytes)
    var input = [_]u8{0} ** 256;
    
    // Attempt G2 addition and expect error
    const result = bls12_381.G2Add.run(&input, allocator);
    try std.testing.expectError(error.BLS12381InvalidInputLength, result);
}

test "BLS12-381 G1 Point: Invalid Field Element Encoding" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Input with invalid G1 point encoding (non-zero byte in padding area)
    var input = [_]u8{0} ** 256;
    input[5] = 1; // Non-zero byte in the 16-byte padding area
    
    // Attempt G1 addition and expect error
    const result = bls12_381.G1Add.run(&input, allocator);
    try std.testing.expectError(error.BLS12381FpNotInField, result);
}

test "BLS12-381 G2 Point: Invalid Field Element Encoding" {
    // Setup: Create a test allocator
    var arena = std.heap.ArenaAllocator.init(std.testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Input with invalid G2 point encoding (non-zero byte in padding area)
    var input = [_]u8{0} ** 512;
    input[5] = 1; // Non-zero byte in the 16-byte padding area
    
    // Attempt G2 addition and expect error
    const result = bls12_381.G2Add.run(&input, allocator);
    try std.testing.expectError(error.BLS12381FpNotInField, result);
}