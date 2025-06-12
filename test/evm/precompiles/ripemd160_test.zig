const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const ripemd160 = evm.precompiles.ripemd160;
const PrecompileOutput = evm.precompiles.PrecompileOutput;
const PrecompileError = evm.precompiles.PrecompileError;

test "RIPEMD160 gas calculation matches Ethereum specification" {
    // Empty input: 600 base gas
    try testing.expectEqual(@as(u64, 600), ripemd160.calculate_gas(0));
    
    // 1 byte: 600 + 120 * 1 = 720
    try testing.expectEqual(@as(u64, 720), ripemd160.calculate_gas(1));
    
    // 32 bytes: 600 + 120 * 1 = 720
    try testing.expectEqual(@as(u64, 720), ripemd160.calculate_gas(32));
    
    // 33 bytes: 600 + 120 * 2 = 840
    try testing.expectEqual(@as(u64, 840), ripemd160.calculate_gas(33));
    
    // 64 bytes: 600 + 120 * 2 = 840
    try testing.expectEqual(@as(u64, 840), ripemd160.calculate_gas(64));
    
    // 65 bytes: 600 + 120 * 3 = 960
    try testing.expectEqual(@as(u64, 960), ripemd160.calculate_gas(65));
}

test "RIPEMD160 gas calculation overflow protection" {
    // Should handle normal sizes without error
    try testing.expectEqual(@as(u64, 600), try ripemd160.calculate_gas_checked(0));
    try testing.expectEqual(@as(u64, 720), try ripemd160.calculate_gas_checked(1));
    
    // Test with large but valid input size
    const large_size = 1024 * 1024; // 1MB
    const expected_gas = 600 + 120 * ((large_size + 31) / 32);
    try testing.expectEqual(expected_gas, try ripemd160.calculate_gas_checked(large_size));
}

test "RIPEMD160 output size is always 32 bytes" {
    try testing.expectEqual(@as(usize, 32), ripemd160.get_output_size(0));
    try testing.expectEqual(@as(usize, 32), ripemd160.get_output_size(1));
    try testing.expectEqual(@as(usize, 32), ripemd160.get_output_size(100));
    try testing.expectEqual(@as(usize, 32), ripemd160.get_output_size(1000));
}

test "RIPEMD160 call validation" {
    // Should succeed with sufficient gas
    try testing.expect(ripemd160.validate_call(0, 600));
    try testing.expect(ripemd160.validate_call(1, 720));
    try testing.expect(ripemd160.validate_call(32, 720));
    
    // Should fail with insufficient gas
    try testing.expect(!ripemd160.validate_call(0, 599));
    try testing.expect(!ripemd160.validate_call(1, 719));
    try testing.expect(!ripemd160.validate_call(33, 839));
}

test "RIPEMD160 execution with sufficient gas returns success" {
    var output: [32]u8 = undefined;
    
    // Test empty input
    const empty_input = &[_]u8{};
    const empty_result = ripemd160.execute(empty_input, &output, 1000);
    try testing.expect(empty_result == .success);
    try testing.expectEqual(@as(u64, 600), empty_result.success.gas_used);
    try testing.expectEqual(@as(usize, 32), empty_result.success.output_size);
    
    // Verify output format: first 12 bytes should be zero (left-padding)
    for (output[0..12]) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
    
    // Test non-empty input
    const test_input = "abc";
    const test_result = ripemd160.execute(test_input, &output, 1000);
    try testing.expect(test_result == .success);
    try testing.expectEqual(@as(u64, 720), test_result.success.gas_used);
    try testing.expectEqual(@as(usize, 32), test_result.success.output_size);
    
    // Verify output format: first 12 bytes should be zero (left-padding)
    for (output[0..12]) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

test "RIPEMD160 execution with insufficient gas returns OutOfGas" {
    var output: [32]u8 = undefined;
    
    // Test with insufficient gas for empty input
    const empty_input = &[_]u8{};
    const empty_result = ripemd160.execute(empty_input, &output, 599);
    try testing.expect(empty_result == .failure);
    try testing.expectEqual(PrecompileError.OutOfGas, empty_result.failure);
    
    // Test with insufficient gas for non-empty input
    const test_input = "abc";
    const test_result = ripemd160.execute(test_input, &output, 719);
    try testing.expect(test_result == .failure);
    try testing.expectEqual(PrecompileError.OutOfGas, test_result.failure);
}

test "RIPEMD160 execution with small output buffer returns ExecutionFailed" {
    var small_output: [31]u8 = undefined; // Too small, needs 32 bytes
    
    const test_input = "abc";
    const result = ripemd160.execute(test_input, &small_output, 1000);
    try testing.expect(result == .failure);
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.failure);
}

test "RIPEMD160 placeholder implementation is deterministic" {
    var output1: [32]u8 = undefined;
    var output2: [32]u8 = undefined;
    
    const test_input = "test input";
    
    // Execute same input twice
    const result1 = ripemd160.execute(test_input, &output1, 1000);
    const result2 = ripemd160.execute(test_input, &output2, 1000);
    
    // Results should be identical
    try testing.expect(result1 == .success);
    try testing.expect(result2 == .success);
    try testing.expectEqualSlices(u8, &output1, &output2);
}

test "RIPEMD160 placeholder produces different outputs for different inputs" {
    var output1: [32]u8 = undefined;
    var output2: [32]u8 = undefined;
    
    const input1 = "input1";
    const input2 = "input2";
    
    _ = ripemd160.execute(input1, &output1, 1000);
    _ = ripemd160.execute(input2, &output2, 1000);
    
    // Different inputs should produce different outputs
    try testing.expect(!std.mem.eql(u8, &output1, &output2));
}

test "RIPEMD160 test vectors are correctly defined" {
    // Verify test vector structure is correct
    try testing.expectEqual(@as(usize, 3), ripemd160.test_vectors.len);
    
    // Check empty string test vector
    const empty_vector = ripemd160.test_vectors[0];
    try testing.expectEqualStrings("", empty_vector.input);
    try testing.expectEqual(@as(u8, 0x9c), empty_vector.expected_hash[0]);
    try testing.expectEqual(@as(u8, 0x11), empty_vector.expected_hash[1]);
    
    // Check "a" test vector
    const a_vector = ripemd160.test_vectors[1];
    try testing.expectEqualStrings("a", a_vector.input);
    try testing.expectEqual(@as(u8, 0x0b), a_vector.expected_hash[0]);
    try testing.expectEqual(@as(u8, 0xdc), a_vector.expected_hash[1]);
    
    // Check "abc" test vector
    const abc_vector = ripemd160.test_vectors[2];
    try testing.expectEqualStrings("abc", abc_vector.input);
    try testing.expectEqual(@as(u8, 0x8e), abc_vector.expected_hash[0]);
    try testing.expectEqual(@as(u8, 0xb2), abc_vector.expected_hash[1]);
}

test "RIPEMD160 placeholder output format matches Ethereum specification" {
    var output: [32]u8 = undefined;
    
    const test_input = "test";
    const result = ripemd160.execute(test_input, &output, 1000);
    
    try testing.expect(result == .success);
    try testing.expectEqual(@as(usize, 32), result.success.output_size);
    
    // First 12 bytes should be zero (left-padding per Ethereum spec)
    for (output[0..12]) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
    
    // Last 20 bytes should contain the hash (non-zero for most inputs)
    // At least some bytes should be non-zero to indicate hash presence
    var has_nonzero = false;
    for (output[12..32]) |byte| {
        if (byte != 0) {
            has_nonzero = true;
            break;
        }
    }
    try testing.expect(has_nonzero);
}

test "RIPEMD160 precompile integration" {
    // This test validates that the precompile can be called through the EVM infrastructure
    var output: [32]u8 = undefined;
    const test_input = "integration test";
    
    // Test basic execution
    const result = ripemd160.execute(test_input, &output, 2000);
    try testing.expect(result == .success);
    
    // Validate gas cost calculation
    const expected_gas = ripemd160.calculate_gas(test_input.len);
    try testing.expectEqual(expected_gas, result.success.gas_used);
    
    // Validate output size
    try testing.expectEqual(@as(usize, 32), result.success.output_size);
    
    // Validate output format (left-padded)
    for (output[0..12]) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}