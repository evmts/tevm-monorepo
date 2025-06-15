const std = @import("std");
const testing = std.testing;
const bls12_381_g2msm = @import("../../../src/evm/precompiles/bls12_381_g2msm.zig");
const PrecompileError = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileError;

/// Test basic functionality with single pair
test "G2MSM: basic functionality - single pair" {
    var input: [288]u8 = std.mem.zeroes([288]u8);
    var output: [256]u8 = undefined;
    
    const result = bls12_381_g2msm.execute(&input, &output, 100000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(usize, 256), result.get_output_size());
    
    for (output) |byte| {
        try testing.expectEqual(@as(u8, 0), byte);
    }
}

/// Test gas calculation for single pair
test "G2MSM: gas calculation - single pair" {
    const input_size: usize = 288;
    const expected_gas: u64 = 87000; // 55000 + 32000
    
    try testing.expectEqual(expected_gas, bls12_381_g2msm.calculate_gas(input_size));
    try testing.expectEqual(expected_gas, try bls12_381_g2msm.calculate_gas_checked(input_size));
}

/// Test input validation
test "G2MSM: input validation" {
    var output: [256]u8 = undefined;
    
    var empty_input: [0]u8 = undefined;
    const result1 = bls12_381_g2msm.execute(&empty_input, &output, 100000);
    try testing.expect(result1.is_failure());
    try testing.expectEqual(PrecompileError.InvalidInput, result1.get_error().?);
    
    var invalid_input: [287]u8 = undefined;
    const result2 = bls12_381_g2msm.execute(&invalid_input, &output, 100000);
    try testing.expect(result2.is_failure());
    try testing.expectEqual(PrecompileError.InvalidInput, result2.get_error().?);
}

/// Test gas limit validation
test "G2MSM: gas limit validation" {
    var input: [288]u8 = std.mem.zeroes([288]u8);
    var output: [256]u8 = undefined;
    
    const required_gas = bls12_381_g2msm.calculate_gas(288);
    
    const result1 = bls12_381_g2msm.execute(&input, &output, required_gas - 1);
    try testing.expect(result1.is_failure());
    try testing.expectEqual(PrecompileError.OutOfGas, result1.get_error().?);
    
    const result2 = bls12_381_g2msm.execute(&input, &output, required_gas);
    try testing.expect(result2.is_success());
    try testing.expectEqual(required_gas, result2.get_gas_used());
}

/// Test output size calculation
test "G2MSM: output size calculation" {
    try testing.expectEqual(@as(usize, 256), bls12_381_g2msm.get_output_size(288));
    try testing.expectEqual(@as(usize, 256), bls12_381_g2msm.get_output_size(576));
}

/// Test gas requirement validation
test "G2MSM: gas requirement validation" {
    try testing.expect(bls12_381_g2msm.validate_gas_requirement(288, 87000));
    try testing.expect(!bls12_381_g2msm.validate_gas_requirement(288, 86999));
    try testing.expect(!bls12_381_g2msm.validate_gas_requirement(287, 100000));
}