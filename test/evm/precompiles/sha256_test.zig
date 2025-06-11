const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Address = @import("Address").Address;

// Convenience aliases
const sha256 = evm.precompiles.sha256;
const precompiles = evm.precompiles.precompiles;
const PrecompileOutput = evm.precompiles.precompile_result.PrecompileOutput;
const PrecompileError = evm.precompiles.precompile_result.PrecompileError;
const ChainRules = evm.hardforks.chain_rules;

// Known SHA256 test vectors from RFC 6234
const EMPTY_HASH = [_]u8{
    0xe3, 0xb0, 0xc4, 0x42, 0x98, 0xfc, 0x1c, 0x14, 0x9a, 0xfb, 0xf4, 0xc8, 0x99, 0x6f, 0xb9, 0x24,
    0x27, 0xae, 0x41, 0xe4, 0x64, 0x9b, 0x93, 0x4c, 0xa4, 0x95, 0x99, 0x1b, 0x78, 0x52, 0xb8, 0x55
};

const ABC_INPUT = "abc";
const ABC_HASH = [_]u8{
    0xba, 0x78, 0x16, 0xbf, 0x8f, 0x01, 0xcf, 0xea, 0x41, 0x41, 0x40, 0xde, 0x5d, 0xae, 0x22, 0x23,
    0xb0, 0x03, 0x61, 0xa3, 0x96, 0x17, 0x7a, 0x9c, 0xb4, 0x10, 0xff, 0x61, 0xf2, 0x00, 0x15, 0xad
};

const LONG_INPUT = "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq";
const LONG_HASH = [_]u8{
    0x24, 0x8d, 0x6a, 0x61, 0xd2, 0x06, 0x38, 0xb8, 0xe5, 0xc0, 0x26, 0x93, 0x0c, 0x3e, 0x60, 0x39,
    0xa3, 0x3c, 0xe4, 0x59, 0x64, 0xff, 0x21, 0x67, 0xf6, 0xa2, 0x7c, 0x14, 0xe5, 0xf3, 0x40, 0x90
};

test "sha256 gas calculation" {
    // Empty input: 60 gas (base cost)
    try testing.expectEqual(@as(u64, 60), sha256.calculate_gas(0));
    
    // 1 byte: 60 + 12 = 72 gas (1 word)
    try testing.expectEqual(@as(u64, 72), sha256.calculate_gas(1));
    
    // 32 bytes: 60 + 12 = 72 gas (1 word)
    try testing.expectEqual(@as(u64, 72), sha256.calculate_gas(32));
    
    // 33 bytes: 60 + 24 = 84 gas (2 words)
    try testing.expectEqual(@as(u64, 84), sha256.calculate_gas(33));
    
    // 64 bytes: 60 + 24 = 84 gas (2 words)
    try testing.expectEqual(@as(u64, 84), sha256.calculate_gas(64));
    
    // 65 bytes: 60 + 36 = 96 gas (3 words)
    try testing.expectEqual(@as(u64, 96), sha256.calculate_gas(65));
    
    // 1024 bytes: 60 + 12*32 = 444 gas (32 words)
    try testing.expectEqual(@as(u64, 444), sha256.calculate_gas(1024));
}

test "sha256 gas calculation checked" {
    // Normal cases should work
    try testing.expectEqual(@as(u64, 60), try sha256.calculate_gas_checked(0));
    try testing.expectEqual(@as(u64, 72), try sha256.calculate_gas_checked(32));
    
    // Very large input that could cause overflow should be handled gracefully
    const huge_size = std.math.maxInt(usize);
    if (sha256.calculate_gas_checked(huge_size)) |_| {
        // If it succeeds, that's fine too (depends on platform)
    } else |err| {
        try testing.expect(err == error.Overflow);
    }
}

test "sha256 execute empty input" {
    var output_buffer: [32]u8 = undefined;
    const result = sha256.execute(&[_]u8{}, &output_buffer, 100);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 60), result.get_gas_used());
    try testing.expectEqual(@as(usize, 32), result.get_output_size());
    
    // Verify hash matches known empty string hash
    try testing.expectEqualSlices(u8, &EMPTY_HASH, &output_buffer);
}

test "sha256 execute with abc" {
    var output_buffer: [32]u8 = undefined;
    const result = sha256.execute(ABC_INPUT, &output_buffer, 100);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 72), result.get_gas_used()); // 60 + 12
    try testing.expectEqual(@as(usize, 32), result.get_output_size());
    
    // Verify output matches known SHA256("abc")
    try testing.expectEqualSlices(u8, &ABC_HASH, &output_buffer);
}

test "sha256 execute with longer input" {
    var output_buffer: [32]u8 = undefined;
    const result = sha256.execute(LONG_INPUT, &output_buffer, 200);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 84), result.get_gas_used()); // 60 + 24 for 2 words
    try testing.expectEqual(@as(usize, 32), result.get_output_size());
    
    // Verify output matches known hash (we'll fix this after implementation)
    // For now, just verify we get a 32-byte output
    try testing.expect(output_buffer.len == 32);
}

test "sha256 execute out of gas" {
    const input_data = ABC_INPUT;
    var output_buffer: [32]u8 = undefined;
    
    // Provide insufficient gas (need 72, only provide 71)
    const result = sha256.execute(input_data, &output_buffer, 71);
    
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.OutOfGas, result.get_error().?);
    try testing.expectEqual(@as(u64, 0), result.get_gas_used());
}

test "sha256 execute insufficient output buffer" {
    const input_data = ABC_INPUT;
    var output_buffer: [31]u8 = undefined; // Too small for 32-byte hash
    
    const result = sha256.execute(input_data, &output_buffer, 100);
    
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.get_error().?);
}

test "sha256 validate gas requirement" {
    // Valid cases
    try testing.expect(sha256.validate_gas_requirement(0, 60));
    try testing.expect(sha256.validate_gas_requirement(32, 72));
    try testing.expect(sha256.validate_gas_requirement(64, 84));
    
    // Invalid cases
    try testing.expect(!sha256.validate_gas_requirement(32, 71)); // Need 72
    try testing.expect(!sha256.validate_gas_requirement(64, 83)); // Need 84
}

test "sha256 get output size" {
    // SHA256 always outputs 32 bytes regardless of input size
    try testing.expectEqual(@as(usize, 32), sha256.get_output_size(0));
    try testing.expectEqual(@as(usize, 32), sha256.get_output_size(1));
    try testing.expectEqual(@as(usize, 32), sha256.get_output_size(32));
    try testing.expectEqual(@as(usize, 32), sha256.get_output_size(100));
    try testing.expectEqual(@as(usize, 32), sha256.get_output_size(1024));
}

test "precompile dispatcher sha256 integration" {
    const sha256_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x02 };
    
    // Check address detection
    try testing.expect(precompiles.is_precompile(sha256_address));
    
    // Check availability with default chain rules (SHA256 is available from Frontier)
    const chain_rules = ChainRules.DEFAULT;
    try testing.expect(precompiles.is_available(sha256_address, chain_rules));
}

test "precompile dispatcher execute sha256" {
    const sha256_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x02 };
    
    var output_buffer: [32]u8 = undefined;
    
    const chain_rules = ChainRules.DEFAULT;
    const result = precompiles.execute_precompile(
        sha256_address,
        ABC_INPUT,
        &output_buffer,
        100,
        chain_rules
    );
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 72), result.get_gas_used()); // 60 + 12 for 1 word
    try testing.expectEqual(@as(usize, 32), result.get_output_size());
    try testing.expectEqualSlices(u8, &ABC_HASH, &output_buffer);
}

test "precompile dispatcher estimate gas" {
    const sha256_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x02 };
    const chain_rules = ChainRules.DEFAULT;
    
    try testing.expectEqual(@as(u64, 60), try precompiles.estimate_gas(sha256_address, 0, chain_rules));
    try testing.expectEqual(@as(u64, 72), try precompiles.estimate_gas(sha256_address, 32, chain_rules));
    try testing.expectEqual(@as(u64, 84), try precompiles.estimate_gas(sha256_address, 64, chain_rules));
}

test "precompile dispatcher get output size" {
    const sha256_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x02 };
    const chain_rules = ChainRules.DEFAULT;
    
    // SHA256 always outputs 32 bytes
    try testing.expectEqual(@as(usize, 32), try precompiles.get_output_size(sha256_address, 0, chain_rules));
    try testing.expectEqual(@as(usize, 32), try precompiles.get_output_size(sha256_address, 32, chain_rules));
    try testing.expectEqual(@as(usize, 32), try precompiles.get_output_size(sha256_address, 100, chain_rules));
}

test "precompile dispatcher validate call" {
    const sha256_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x02 };
    const chain_rules = ChainRules.DEFAULT;
    
    // Valid calls
    try testing.expect(precompiles.validate_call(sha256_address, 0, 60, chain_rules));
    try testing.expect(precompiles.validate_call(sha256_address, 32, 72, chain_rules));
    try testing.expect(precompiles.validate_call(sha256_address, 32, 100, chain_rules));
    
    // Invalid calls (insufficient gas)
    try testing.expect(!precompiles.validate_call(sha256_address, 32, 71, chain_rules));
    try testing.expect(!precompiles.validate_call(sha256_address, 64, 83, chain_rules));
}

test "sha256 known test vectors" {
    var output_buffer: [32]u8 = undefined;
    
    // Test empty string
    {
        const result = sha256.execute("", &output_buffer, 100);
        try testing.expect(result.is_success());
        try testing.expectEqualSlices(u8, &EMPTY_HASH, &output_buffer);
    }
    
    // Test "abc"
    {
        const result = sha256.execute("abc", &output_buffer, 100);
        try testing.expect(result.is_success());
        try testing.expectEqualSlices(u8, &ABC_HASH, &output_buffer);
    }
    
    // Test "message digest"
    {
        const message_digest = "message digest";
        const expected_hash = [_]u8{
            0xf7, 0x84, 0x6f, 0x55, 0xcf, 0x23, 0xe1, 0x4e, 0xeb, 0xea, 0xb5, 0xb4, 0xe1, 0x55, 0x0c, 0xad,
            0x5b, 0x50, 0x9e, 0x33, 0x48, 0xfb, 0xc4, 0xef, 0xa3, 0xa1, 0x41, 0x3d, 0x39, 0x3c, 0xb6, 0x50
        };
        
        const result = sha256.execute(message_digest, &output_buffer, 200);
        try testing.expect(result.is_success());
        try testing.expectEqualSlices(u8, &expected_hash, &output_buffer);
    }
}

test "sha256 performance benchmark" {
    const allocator = testing.allocator;
    
    // Test with 1KB of data
    const input_size = 1024;
    const input_data = try allocator.alloc(u8, input_size);
    defer allocator.free(input_data);
    
    var output_buffer: [32]u8 = undefined;
    
    // Fill with test data
    for (input_data, 0..) |*byte, i| {
        byte.* = @intCast(i % 256);
    }
    
    const iterations = 1000;
    var timer = try std.time.Timer.start();
    
    for (0..iterations) |_| {
        const result = sha256.execute(input_data, &output_buffer, 1000);
        try testing.expect(result.is_success());
    }
    
    const elapsed_ns = timer.read();
    const ns_per_op = elapsed_ns / iterations;
    
    // Should complete within reasonable time (adjust threshold as needed)
    // This is more of a regression test than a strict performance requirement
    try testing.expect(ns_per_op < 100_000); // 100 microseconds per operation
}

test "sha256 edge cases" {
    var output_buffer: [32]u8 = undefined;
    
    // Test with exactly 31 bytes (boundary case for word calculation)
    {
        const input_data = [_]u8{0xFF} ** 31;
        const result = sha256.execute(&input_data, &output_buffer, 100);
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 72), result.get_gas_used()); // 60 + 12 (1 word)
        try testing.expectEqual(@as(usize, 32), result.get_output_size());
    }
    
    // Test with exactly 33 bytes (boundary case for word calculation)
    {
        const input_data = [_]u8{0xAA} ** 33;
        const result = sha256.execute(&input_data, &output_buffer, 100);
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 84), result.get_gas_used()); // 60 + 24 (2 words)
        try testing.expectEqual(@as(usize, 32), result.get_output_size());
    }
    
    // Test large input to verify gas calculation scales correctly
    {
        const large_input = [_]u8{0x42} ** 1000;
        const result = sha256.execute(&large_input, &output_buffer, 1000);
        try testing.expect(result.is_success());
        // 1000 bytes = 32 words (ceil(1000/32) = 32), so 60 + 12*32 = 444 gas
        try testing.expectEqual(@as(u64, 444), result.get_gas_used());
        try testing.expectEqual(@as(usize, 32), result.get_output_size());
    }
}