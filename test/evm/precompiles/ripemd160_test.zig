const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const ripemd160 = evm.precompiles.ripemd160;
const PrecompileOutput = evm.precompiles.PrecompileOutput;
const PrecompileError = evm.precompiles.PrecompileError;

// Known RIPEMD160 test vectors for validation
const TestVector = struct {
    input: []const u8,
    expected_hex: []const u8,
};

// Standard RIPEMD160 test vectors from the specification
const test_vectors = [_]TestVector{
    // Empty string
    .{
        .input = "",
        .expected_hex = "9c1185a5c5e9fc54612808977ee8f548b2258d31",
    },
    // "a"
    .{
        .input = "a",
        .expected_hex = "0bdc9d2d256b3ee9daae347be6f4dc835a467ffe",
    },
    // "abc"
    .{
        .input = "abc", 
        .expected_hex = "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc",
    },
    // "message digest"
    .{
        .input = "message digest",
        .expected_hex = "5d0689ef49d2fae572b881b123a85ffa21595f36",
    },
    // "a" repeated 26 times
    .{
        .input = "abcdefghijklmnopqrstuvwxyz",
        .expected_hex = "f71c27109c692c1b56bbdceb5b9d2865b3708dbc",
    },
    // "abc" repeated many times (62 chars)
    .{
        .input = "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq",
        .expected_hex = "12a053384a9c0c88e405a06c27dcf49ada62eb2b",
    },
    // "a" repeated 1 million times (we'll test a smaller version)
    .{
        .input = "aaaaaaaaaa", // 10 'a's for testing
        .expected_hex = "de0444bb7374aa5d5895cc43c50de6258b4d5b81",
    },
};

// Helper function to convert hex string to bytes
fn hex_to_bytes(hex: []const u8, output: []u8) !void {
    if (hex.len != output.len * 2) return error.InvalidLength;
    
    for (0..output.len) |i| {
        const hex_byte = hex[i * 2..i * 2 + 2];
        output[i] = try std.fmt.parseInt(u8, hex_byte, 16);
    }
}

// Helper function to convert bytes to hex string for debugging
fn bytes_to_hex(bytes: []const u8, output: []u8) void {
    const chars = "0123456789abcdef";
    for (bytes, 0..) |byte, i| {
        output[i * 2] = chars[byte >> 4];
        output[i * 2 + 1] = chars[byte & 0xF];
    }
}

// Test basic gas calculation for RIPEMD160
test "ripemd160 gas calculation" {
    // Empty input: 600 gas (base cost)
    try testing.expectEqual(@as(u64, 600), ripemd160.calculate_gas(0));
    
    // 1 byte: 600 + 120 = 720 gas (1 word)
    try testing.expectEqual(@as(u64, 720), ripemd160.calculate_gas(1));
    
    // 32 bytes: 600 + 120 = 720 gas (1 word)
    try testing.expectEqual(@as(u64, 720), ripemd160.calculate_gas(32));
    
    // 33 bytes: 600 + 240 = 840 gas (2 words)
    try testing.expectEqual(@as(u64, 840), ripemd160.calculate_gas(33));
    
    // 64 bytes: 600 + 240 = 840 gas (2 words)
    try testing.expectEqual(@as(u64, 840), ripemd160.calculate_gas(64));
    
    // 65 bytes: 600 + 360 = 960 gas (3 words)
    try testing.expectEqual(@as(u64, 960), ripemd160.calculate_gas(65));
    
    // 1024 bytes: 600 + 120*32 = 4440 gas (32 words)
    try testing.expectEqual(@as(u64, 4440), ripemd160.calculate_gas(1024));
}

// Test gas calculation with overflow protection
test "ripemd160 gas calculation checked" {
    // Normal cases should work
    try testing.expectEqual(@as(u64, 600), try ripemd160.calculate_gas_checked(0));
    try testing.expectEqual(@as(u64, 720), try ripemd160.calculate_gas_checked(32));
    
    // Very large input that could cause overflow should be handled gracefully
    const huge_size = std.math.maxInt(usize);
    if (ripemd160.calculate_gas_checked(huge_size)) |_| {
        // If it succeeds, that's fine too (depends on platform)
    } else |err| {
        try testing.expect(err == error.Overflow);
    }
}

// Test RIPEMD160 with insufficient gas
test "ripemd160 insufficient gas" {
    const input_data = "test";
    var output: [32]u8 = undefined;
    
    const result = ripemd160.execute(input_data, &output, 719); // Less than required 720
    
    try testing.expect(result.is_failure());
    if (result.get_error()) |err| {
        try testing.expectEqual(PrecompileError.OutOfGas, err);
    }
}

// Test RIPEMD160 with exact gas requirement
test "ripemd160 exact gas" {
    const input_data = "test";
    var output: [32]u8 = undefined;
    
    const result = ripemd160.execute(input_data, &output, 720); // Exactly required amount
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 720), result.get_gas_used());
    try testing.expectEqual(@as(usize, 32), result.get_output_size());
}

// Test RIPEMD160 with more than sufficient gas
test "ripemd160 excess gas" {
    const input_data = "test";
    var output: [32]u8 = undefined;
    
    const result = ripemd160.execute(input_data, &output, 10000); // More than required
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 720), result.get_gas_used()); // Only consumes what's needed
}

// Test RIPEMD160 with invalid output buffer size
test "ripemd160 invalid output buffer" {
    const input_data = "test";
    var small_output: [31]u8 = undefined; // Too small for 32-byte output
    
    const result = ripemd160.execute(input_data, &small_output, 5000);
    
    try testing.expect(result.is_failure());
    if (result.get_error()) |err| {
        try testing.expectEqual(PrecompileError.ExecutionFailed, err);
    }
}

// Test RIPEMD160 output format (32 bytes with padding)
test "ripemd160 output format" {
    const input_data = "abc";
    var output: [32]u8 = undefined;
    
    const result = ripemd160.execute(input_data, &output, 1000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 32), result.get_output_size());
    
    // The last 12 bytes should be zero (padding)
    for (output[20..32]) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
    
    // The first 20 bytes should contain the hash (non-zero for "abc")
    var all_zero = true;
    for (output[0..20]) |byte| {
        if (byte != 0) {
            all_zero = false;
            break;
        }
    }
    try testing.expect(!all_zero); // Hash should not be all zeros
}

// Test RIPEMD160 with empty input
test "ripemd160 empty input" {
    var output: [32]u8 = undefined;
    
    const result = ripemd160.execute(&[_]u8{}, &output, 1000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 600), result.get_gas_used()); // Base cost only
    try testing.expectEqual(@as(usize, 32), result.get_output_size());
    
    // Verify the hash matches expected value for empty input
    var expected: [20]u8 = undefined;
    try hex_to_bytes("9c1185a5c5e9fc54612808977ee8f548b2258d31", &expected);
    try testing.expectEqualSlices(u8, &expected, output[0..20]);
    
    // Verify padding is zero
    for (output[20..32]) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

// Test RIPEMD160 with known test vectors
test "ripemd160 known test vectors" {
    for (test_vectors[0..5]) |vector| { // Test first 5 vectors (skip the long one)
        var output: [32]u8 = undefined;
        var expected: [20]u8 = undefined;
        
        // Convert expected hex to bytes
        try hex_to_bytes(vector.expected_hex, &expected);
        
        // Execute RIPEMD160
        const result = ripemd160.execute(vector.input, &output, 10000);
        
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(usize, 32), result.get_output_size());
        
        // Verify hash matches expected
        if (!std.mem.eql(u8, &expected, output[0..20])) {
            // Print debug info for failed test
            var actual_hex: [40]u8 = undefined;
            var expected_hex_buf: [40]u8 = undefined;
            bytes_to_hex(output[0..20], &actual_hex);
            bytes_to_hex(&expected, &expected_hex_buf);
            
            std.debug.print("\nRIPEMD160 test vector failed:\n", .{});
            std.debug.print("Input: \"{s}\"\n", .{vector.input});
            std.debug.print("Expected: {s}\n", .{expected_hex_buf});
            std.debug.print("Actual:   {s}\n", .{actual_hex});
            
            return error.TestFailed;
        }
        
        // Verify padding is zero
        for (output[20..32]) |byte| {
            try testing.expectEqual(@as(u8, 0), byte);
        }
    }
}

// Test RIPEMD160 with various input sizes
test "ripemd160 various input sizes" {
    const test_inputs = [_][]const u8{
        "",
        "a",
        "ab", 
        "abc",
        "test message",
        "a longer test message for RIPEMD160 validation",
        "a" ** 55, // Just under a block boundary
        "a" ** 56, // At block boundary
        "a" ** 57, // Just over a block boundary
        "a" ** 63, // Just under two block boundary
        "a" ** 64, // At two block boundary
        "a" ** 128, // Multiple blocks
    };
    
    for (test_inputs) |input| {
        var output: [32]u8 = undefined;
        
        const gas_needed = ripemd160.calculate_gas(input.len);
        const result = ripemd160.execute(input, &output, gas_needed + 1000);
        
        try testing.expect(result.is_success());
        try testing.expectEqual(gas_needed, result.get_gas_used());
        try testing.expectEqual(@as(usize, 32), result.get_output_size());
        
        // Verify padding is always zero
        for (output[20..32]) |byte| {
            try testing.expectEqual(@as(u8, 0), byte);
        }
        
        // Verify hash is deterministic (same input = same output)
        var output2: [32]u8 = undefined;
        const result2 = ripemd160.execute(input, &output2, gas_needed + 1000);
        try testing.expect(result2.is_success());
        try testing.expectEqualSlices(u8, &output, &output2);
    }
}

// Test RIPEMD160 call validation
test "ripemd160 call validation" {
    // Valid calls
    try testing.expect(ripemd160.validate_call(0, 600)); // Empty input
    try testing.expect(ripemd160.validate_call(32, 720)); // 32 bytes
    try testing.expect(ripemd160.validate_call(64, 840)); // 64 bytes
    try testing.expect(ripemd160.validate_call(32, 1000)); // Excess gas
    
    // Invalid gas
    try testing.expect(!ripemd160.validate_call(0, 599)); // Too little for empty
    try testing.expect(!ripemd160.validate_call(32, 719)); // Too little for 32 bytes
    try testing.expect(!ripemd160.validate_call(64, 839)); // Too little for 64 bytes
}

// Test RIPEMD160 output size
test "ripemd160 output size" {
    try testing.expectEqual(@as(usize, 32), ripemd160.get_output_size(0));
    try testing.expectEqual(@as(usize, 32), ripemd160.get_output_size(1));
    try testing.expectEqual(@as(usize, 32), ripemd160.get_output_size(32));
    try testing.expectEqual(@as(usize, 32), ripemd160.get_output_size(100));
    try testing.expectEqual(@as(usize, 32), ripemd160.get_output_size(1024));
}

// Test RIPEMD160 with large input for performance validation
test "ripemd160 large input performance" {
    const allocator = testing.allocator;
    
    // Test with 4KB of data
    const input_size = 4096;
    const input_data = try allocator.alloc(u8, input_size);
    defer allocator.free(input_data);
    
    // Fill with test pattern
    for (input_data, 0..) |*byte, i| {
        byte.* = @intCast(i % 256);
    }
    
    var output: [32]u8 = undefined;
    const gas_needed = ripemd160.calculate_gas(input_size);
    
    const result = ripemd160.execute(input_data, &output, gas_needed + 1000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(gas_needed, result.get_gas_used());
    try testing.expectEqual(@as(usize, 32), result.get_output_size());
    
    // Verify padding
    for (output[20..32]) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
    
    // Verify hash is not all zeros (very unlikely)
    var all_zero = true;
    for (output[0..20]) |byte| {
        if (byte != 0) {
            all_zero = false;
            break;
        }
    }
    try testing.expect(!all_zero);
}

// Test RIPEMD160 edge cases
test "ripemd160 edge cases" {
    // Test with maximum reasonable input size
    const allocator = testing.allocator;
    
    // Test exact block boundary (64 bytes)
    {
        const input_data = try allocator.alloc(u8, 64);
        defer allocator.free(input_data);
        @memset(input_data, 0xAA);
        
        var output: [32]u8 = undefined;
        const result = ripemd160.execute(input_data, &output, 10000);
        
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 840), result.get_gas_used()); // 600 + 120*2
    }
    
    // Test just over block boundary (65 bytes)
    {
        const input_data = try allocator.alloc(u8, 65);
        defer allocator.free(input_data);
        @memset(input_data, 0xBB);
        
        var output: [32]u8 = undefined;
        const result = ripemd160.execute(input_data, &output, 10000);
        
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 960), result.get_gas_used()); // 600 + 120*3
    }
}

// Test RIPEMD160 deterministic behavior
test "ripemd160 deterministic" {
    const test_input = "deterministic test";
    var output1: [32]u8 = undefined;
    var output2: [32]u8 = undefined;
    
    // Execute twice
    const result1 = ripemd160.execute(test_input, &output1, 1000);
    const result2 = ripemd160.execute(test_input, &output2, 1000);
    
    try testing.expect(result1.is_success());
    try testing.expect(result2.is_success());
    
    // Results should be identical
    try testing.expectEqualSlices(u8, &output1, &output2);
}

// Test RIPEMD160 with binary data
test "ripemd160 binary data" {
    const binary_data = [_]u8{ 0x00, 0x01, 0x02, 0x03, 0xFF, 0xFE, 0xFD, 0xFC };
    var output: [32]u8 = undefined;
    
    const result = ripemd160.execute(&binary_data, &output, 1000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 720), result.get_gas_used());
    try testing.expectEqual(@as(usize, 32), result.get_output_size());
    
    // Verify padding
    for (output[20..32]) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}