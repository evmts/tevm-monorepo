/// Comprehensive tests for SHA256 precompile implementation
/// 
/// Tests cover gas calculation, hash correctness, integration with VM,
/// and edge cases to ensure full Ethereum compatibility.

const std = @import("std");
const testing = std.testing;
const expect = testing.expect;
const expectEqual = testing.expectEqual;
const expectEqualSlices = testing.expectEqualSlices;
const expectError = testing.expectError;

const evm = @import("evm");
const sha256 = evm.precompiles.sha256;
const precompiles = evm.precompiles.precompiles;
const PrecompileError = evm.precompiles.PrecompileError;

test "sha256 gas calculation accuracy" {
    // Test gas calculation for various input sizes
    try expectEqual(@as(u64, 60), sha256.calculate_gas(0));    // Empty: base cost only
    try expectEqual(@as(u64, 72), sha256.calculate_gas(1));    // 1 byte: base + 1 word
    try expectEqual(@as(u64, 72), sha256.calculate_gas(31));   // 31 bytes: base + 1 word
    try expectEqual(@as(u64, 72), sha256.calculate_gas(32));   // 32 bytes: base + 1 word
    try expectEqual(@as(u64, 84), sha256.calculate_gas(33));   // 33 bytes: base + 2 words
    try expectEqual(@as(u64, 84), sha256.calculate_gas(64));   // 64 bytes: base + 2 words
    try expectEqual(@as(u64, 96), sha256.calculate_gas(65));   // 65 bytes: base + 3 words
    try expectEqual(@as(u64, 96), sha256.calculate_gas(96));   // 96 bytes: base + 3 words
    
    // Test larger sizes
    try expectEqual(@as(u64, 60 + 12 * 10), sha256.calculate_gas(320));  // 10 words
    try expectEqual(@as(u64, 60 + 12 * 32), sha256.calculate_gas(1024)); // 32 words
}

test "sha256 RFC test vectors" {
    var output: [32]u8 = undefined;
    
    // Test empty string
    // SHA256("") = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    const empty_result = try sha256.execute("", &output, 1000);
    try expectEqual(@as(u64, 60), empty_result.gas_used);
    try expectEqual(@as(usize, 32), empty_result.output_size);
    
    const expected_empty = [_]u8{
        0xe3, 0xb0, 0xc4, 0x42, 0x98, 0xfc, 0x1c, 0x14, 0x9a, 0xfb, 0xf4, 0xc8, 0x99, 0x6f, 0xb9, 0x24,
        0x27, 0xae, 0x41, 0xe4, 0x64, 0x9b, 0x93, 0x4c, 0xa4, 0x95, 0x99, 0x1b, 0x78, 0x52, 0xb8, 0x55
    };
    try expectEqualSlices(u8, &expected_empty, output[0..32]);
    
    // Test "abc"  
    // SHA256("abc") = ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
    const abc_result = try sha256.execute("abc", &output, 1000);
    try expectEqual(@as(u64, 72), abc_result.gas_used);
    try expectEqual(@as(usize, 32), abc_result.output_size);
    
    const expected_abc = [_]u8{
        0xba, 0x78, 0x16, 0xbf, 0x8f, 0x01, 0xcf, 0xea, 0x41, 0x41, 0x40, 0xde, 0x5d, 0xae, 0x22, 0x23,
        0xb0, 0x03, 0x61, 0xa3, 0x96, 0x17, 0x7a, 0x9c, 0xb4, 0x10, 0xff, 0x61, 0xf2, 0x00, 0x15, 0xad
    };
    try expectEqualSlices(u8, &expected_abc, output[0..32]);
    
    // Test "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"
    // SHA256("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq") = 248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1
    const long_input = "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq";
    const long_result = try sha256.execute(long_input, &output, 1000);
    try expectEqual(@as(u64, 84), long_result.gas_used); // 56 bytes = 2 words
    try expectEqual(@as(usize, 32), long_result.output_size);
    
    const expected_long = [_]u8{
        0x24, 0x8d, 0x6a, 0x61, 0xd2, 0x06, 0x38, 0xb8, 0xe5, 0xc0, 0x26, 0x93, 0x0c, 0x3e, 0x60, 0x39,
        0xa3, 0x3c, 0xe4, 0x59, 0x64, 0xff, 0x21, 0x67, 0xf6, 0xec, 0xed, 0xd4, 0x19, 0xdb, 0x06, 0xc1
    };
    try expectEqualSlices(u8, &expected_long, output[0..32]);
}

test "sha256 error conditions" {
    var output: [32]u8 = undefined;
    
    // Test gas limit exceeded
    try expectError(PrecompileError.OutOfGas, sha256.execute("test", &output, 50)); // Need 72 gas
    
    // Test invalid output buffer size
    var small_output: [16]u8 = undefined;
    try expectError(PrecompileError.InvalidOutput, sha256.execute("test", &small_output, 1000));
    
    // Test empty output buffer
    var empty_output: [0]u8 = undefined;
    try expectError(PrecompileError.InvalidOutput, sha256.execute("test", &empty_output, 1000));
}

test "sha256 large input handling" {
    const allocator = testing.allocator;
    var output: [32]u8 = undefined;
    
    // Test with 1KB input (32 words)
    const large_input = try allocator.alloc(u8, 1024);
    defer allocator.free(large_input);
    
    // Fill with pattern
    for (large_input, 0..) |*byte, i| {
        byte.* = @as(u8, @intCast(i & 0xFF));
    }
    
    const expected_gas = 60 + 12 * 32; // Base + 32 words = 444 gas
    const result = try sha256.execute(large_input, &output, expected_gas);
    try expectEqual(expected_gas, result.gas_used);
    try expectEqual(@as(usize, 32), result.output_size);
    
    // Verify output is valid (should be deterministic for same input)
    var output2: [32]u8 = undefined;
    const result2 = try sha256.execute(large_input, &output2, expected_gas);
    try expectEqualSlices(u8, output[0..32], output2[0..32]);
}

test "sha256 wrapped execution" {
    var output: [32]u8 = undefined;
    
    // Test successful wrapped execution
    const success_result = sha256.execute_wrapped("hello", &output, 1000);
    try expect(success_result.is_success());
    try expectEqual(@as(u64, 72), success_result.gas_used());
    try expectEqual(@as(usize, 32), success_result.output_size());
    
    // Test failed wrapped execution (insufficient gas)
    const failure_result = sha256.execute_wrapped("hello", &output, 50);
    try expect(!failure_result.is_success());
    try expectEqual(@as(u64, 0), failure_result.gas_used());
    try expectEqual(@as(usize, 0), failure_result.output_size());
}

test "sha256 precompile integration" {
    var output: [256]u8 = undefined;
    
    // Test via precompile dispatcher
    const sha256_addr = [_]u8{0} ** 19 ++ [_]u8{0x02};
    
    // Test successful execution through dispatcher
    const result = precompiles.execute_precompile(sha256_addr, "hello", &output, 1000, .frontier);
    try expect(result.is_success());
    try expectEqual(@as(u64, 72), result.gas_used());
    try expectEqual(@as(usize, 32), result.output_size());
    
    // Verify hash is correct
    const expected_hello = [_]u8{
        0x2c, 0xf2, 0x4d, 0xba, 0x4f, 0x21, 0xd4, 0x28, 0x8c, 0xfc, 0x0b, 0x94, 0x52, 0xc3, 0x8e, 0xd0,
        0x3f, 0xa8, 0x0e, 0x68, 0x3b, 0xdc, 0xa7, 0x3a, 0x53, 0x3f, 0x0e, 0x69, 0xc7, 0xa3, 0x46, 0x21
    };
    try expectEqualSlices(u8, &expected_hello, output[0..32]);
}

test "sha256 precompile availability" {
    // SHA256 should be available from Frontier onwards
    try expect(precompiles.is_precompile_available(0x02, .frontier));
    try expect(precompiles.is_precompile_available(0x02, .homestead));
    try expect(precompiles.is_precompile_available(0x02, .byzantium));
    try expect(precompiles.is_precompile_available(0x02, .cancun));
    
    // Invalid precompile should not be available
    try expect(!precompiles.is_precompile_available(0xFF, .frontier));
}

test "sha256 gas calculation integration" {
    const sha256_addr = [_]u8{0} ** 19 ++ [_]u8{0x02};
    
    // Test gas calculation through dispatcher
    try expectEqual(@as(u64, 60), precompiles.calculate_precompile_gas(sha256_addr, "", .frontier));
    try expectEqual(@as(u64, 72), precompiles.calculate_precompile_gas(sha256_addr, "hello", .frontier));
    try expectEqual(@as(u64, 84), precompiles.calculate_precompile_gas(sha256_addr, "a" ** 33, .frontier));
    
    // Invalid address should return 0 gas
    const invalid_addr = [_]u8{0x12, 0x34} ++ [_]u8{0} ** 18;
    try expectEqual(@as(u64, 0), precompiles.calculate_precompile_gas(invalid_addr, "hello", .frontier));
}

test "sha256 boundary conditions" {
    var output: [32]u8 = undefined;
    
    // Test exactly 32 bytes (1 word)
    const input_32 = "a" ** 32;
    const result_32 = try sha256.execute(input_32, &output, 1000);
    try expectEqual(@as(u64, 72), result_32.gas_used); // Base + 1 word
    
    // Test 33 bytes (2 words)
    const input_33 = "a" ** 33;
    const result_33 = try sha256.execute(input_33, &output, 1000);
    try expectEqual(@as(u64, 84), result_33.gas_used); // Base + 2 words
    
    // Test maximum reasonable input size
    const allocator = testing.allocator;
    const max_input = try allocator.alloc(u8, 10000); // ~312 words
    defer allocator.free(max_input);
    
    @memset(max_input, 0x42);
    const max_gas = 60 + 12 * 313; // Ceiling division for 10000 bytes
    const max_result = try sha256.execute(max_input, &output, max_gas);
    try expectEqual(max_gas, max_result.gas_used);
    try expectEqual(@as(usize, 32), max_result.output_size);
}