const std = @import("std");
const params = @import("params.zig");

/// Identity (data copy) precompiled contract
pub const DataCopy = PrecompiledContract{
    .requiredGas = dataCopyRequiredGas,
    .run = dataCopyRun,
};

/// Calculate required gas for the identity (data copy) precompile
/// Gas cost: 15 + 3 * ((len + 31) / 32)
fn dataCopyRequiredGas(input: []const u8) u64 {
    return (@as(u64, input.len) + 31) / 32 * params.IdentityPerWordGas + params.IdentityBaseGas;
}

/// Execute the identity (data copy) precompile
/// Simply returns a copy of the input data
fn dataCopyRun(input: []const u8, allocator: std.mem.Allocator) !?[]u8 {
    const output = try allocator.alloc(u8, input.len);
    @memcpy(output, input);
    return output;
}

/// Helper to extract data from a byte array with bounds checking
pub fn getData(input: []const u8, offset: usize, length: usize) []const u8 {
    if (offset >= input.len) {
        return &[_]u8{};
    }
    
    const available = input.len - offset;
    const to_copy = if (length > available) available else length;
    
    return input[offset..offset+to_copy];
}

/// Left pad a byte array with zeros to the desired length
pub fn leftPadBytes(allocator: std.mem.Allocator, data: []const u8, length: usize) ![]u8 {
    if (data.len >= length) {
        // If data is already the desired length or longer, just copy the rightmost bytes
        const result = try allocator.alloc(u8, length);
        const start = data.len - length;
        @memcpy(result, data[start..]);
        return result;
    }
    
    // Otherwise pad with zeros
    const result = try allocator.alloc(u8, length);
    // Initialize to zeros
    @memset(result, 0);
    // Copy data to the right side
    @memcpy(result[length - data.len..], data);
    
    return result;
}

/// Right pad a byte array with zeros to the desired length
pub fn rightPadBytes(allocator: std.mem.Allocator, data: []const u8, length: usize) ![]u8 {
    if (data.len >= length) {
        // If data is already the desired length or longer, just copy the leftmost bytes
        const result = try allocator.alloc(u8, length);
        @memcpy(result, data[0..length]);
        return result;
    }
    
    // Otherwise pad with zeros
    const result = try allocator.alloc(u8, length);
    // Initialize to zeros
    @memset(result, 0);
    // Copy data to the left side
    @memcpy(result, data);
    
    return result;
}

/// Check if a byte array is all zeros
pub fn allZero(data: []const u8) bool {
    for (data) |b| {
        if (b != 0) {
            return false;
        }
    }
    return true;
}

/// PrecompiledContract struct definition
pub const PrecompiledContract = struct {
    /// Calculate required gas for execution
    requiredGas: fn (input: []const u8) u64,
    
    /// Execute the precompiled contract
    run: fn (input: []const u8, allocator: std.mem.Allocator) anyerror!?[]u8,
};

// Tests
test "Identity/DataCopy precompile" {
    const allocator = std.testing.allocator;
    
    const input = [_]u8{1, 2, 3, 4, 5};
    
    // Test gas calculation
    const gas = dataCopyRequiredGas(&input);
    try std.testing.expect(gas >= params.IdentityBaseGas);
    
    // Test execution
    const output = try dataCopyRun(&input, allocator);
    defer if (output) |data| allocator.free(data);
    
    try std.testing.expectEqualSlices(u8, &input, output.?);
}

test "leftPadBytes and rightPadBytes" {
    const allocator = std.testing.allocator;
    
    const input = [_]u8{1, 2, 3, 4};
    
    // Test left padding
    {
        const padded = try leftPadBytes(allocator, &input, 8);
        defer allocator.free(padded);
        
        try std.testing.expectEqual(@as(usize, 8), padded.len);
        try std.testing.expectEqualSlices(u8, &[_]u8{0, 0, 0, 0, 1, 2, 3, 4}, padded);
    }
    
    // Test right padding
    {
        const padded = try rightPadBytes(allocator, &input, 8);
        defer allocator.free(padded);
        
        try std.testing.expectEqual(@as(usize, 8), padded.len);
        try std.testing.expectEqualSlices(u8, &[_]u8{1, 2, 3, 4, 0, 0, 0, 0}, padded);
    }
    
    // Test padding with shorter length (should truncate)
    {
        const padded = try leftPadBytes(allocator, &input, 2);
        defer allocator.free(padded);
        
        try std.testing.expectEqual(@as(usize, 2), padded.len);
        try std.testing.expectEqualSlices(u8, &[_]u8{3, 4}, padded);
    }
}

test "getData" {
    const input = [_]u8{1, 2, 3, 4, 5, 6, 7, 8};
    
    // Test normal case
    {
        const data = getData(&input, 2, 3);
        try std.testing.expectEqualSlices(u8, &[_]u8{3, 4, 5}, data);
    }
    
    // Test out of bounds
    {
        const data = getData(&input, 10, 2);
        try std.testing.expectEqualSlices(u8, &[_]u8{}, data);
    }
    
    // Test partial out of bounds
    {
        const data = getData(&input, 6, 4);
        try std.testing.expectEqualSlices(u8, &[_]u8{7, 8}, data);
    }
}