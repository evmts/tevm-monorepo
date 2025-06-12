const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Address = @import("Address").Address;

test "sha256 precompile basic functionality" {
    const sha256_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x02 };
    
    // Check that SHA256 is recognized as a precompile
    try testing.expect(evm.Precompiles.is_precompile(sha256_address));
    
    // Check that SHA256 is available with default chain rules
    const chain_rules = evm.ChainRules.DEFAULT;
    try testing.expect(evm.Precompiles.is_available(sha256_address, chain_rules));
    
    // Test gas estimation for different input sizes
    try testing.expectEqual(@as(u64, 60), try evm.Precompiles.estimate_gas(sha256_address, 0, chain_rules));
    try testing.expectEqual(@as(u64, 72), try evm.Precompiles.estimate_gas(sha256_address, 32, chain_rules));
    try testing.expectEqual(@as(u64, 84), try evm.Precompiles.estimate_gas(sha256_address, 64, chain_rules));
    
    // Test output size (SHA256 always returns 32 bytes)
    try testing.expectEqual(@as(usize, 32), try evm.Precompiles.get_output_size(sha256_address, 0, chain_rules));
    try testing.expectEqual(@as(usize, 32), try evm.Precompiles.get_output_size(sha256_address, 100, chain_rules));
}

test "sha256 precompile execution" {
    const sha256_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x02 };
    const chain_rules = evm.ChainRules.DEFAULT;
    
    // Test with empty input
    {
        const input = "";
        var output: [32]u8 = undefined;
        
        const result = evm.Precompiles.execute_precompile(
            sha256_address,
            input,
            &output,
            100,
            chain_rules
        );
        
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 60), result.get_gas_used());
        try testing.expectEqual(@as(usize, 32), result.get_output_size());
        
        // Check that we got the expected SHA256 hash of empty string
        const expected_empty = [_]u8{
            0xe3, 0xb0, 0xc4, 0x42, 0x98, 0xfc, 0x1c, 0x14,
            0x9a, 0xfb, 0xf4, 0xc8, 0x99, 0x6f, 0xb9, 0x24,
            0x27, 0xae, 0x41, 0xe4, 0x64, 0x9b, 0x93, 0x4c,
            0xa4, 0x95, 0x99, 0x1b, 0x78, 0x52, 0xb8, 0x55
        };
        try testing.expectEqualSlices(u8, &expected_empty, &output);
    }
    
    // Test with "abc"
    {
        const input = "abc";
        var output: [32]u8 = undefined;
        
        const result = evm.Precompiles.execute_precompile(
            sha256_address,
            input,
            &output,
            100,
            chain_rules
        );
        
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 72), result.get_gas_used()); // 60 + 12 * 1
        try testing.expectEqual(@as(usize, 32), result.get_output_size());
        
        // Check that we got the expected SHA256 hash of "abc"
        const expected_abc = [_]u8{
            0xba, 0x78, 0x16, 0xbf, 0x8f, 0x01, 0xcf, 0xea,
            0x41, 0x41, 0x40, 0xde, 0x5d, 0xae, 0x22, 0x23,
            0xb0, 0x03, 0x61, 0xa3, 0x96, 0x17, 0x7a, 0x9c,
            0xb4, 0x10, 0xff, 0x61, 0xf2, 0x00, 0x15, 0xad
        };
        try testing.expectEqualSlices(u8, &expected_abc, &output);
    }
}

test "sha256 precompile out of gas" {
    const sha256_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x02 };
    const chain_rules = evm.ChainRules.DEFAULT;
    
    const input = "test";
    var output: [32]u8 = undefined;
    
    // Should fail with insufficient gas (need 72 for 4 bytes)
    const result = evm.Precompiles.execute_precompile(
        sha256_address,
        input,
        &output,
        50, // Insufficient gas
        chain_rules
    );
    
    try testing.expect(result.is_failure());
    try testing.expectEqual(@as(u64, 0), result.get_gas_used());
}

test "sha256 precompile validation" {
    const sha256_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x02 };
    const chain_rules = evm.ChainRules.DEFAULT;
    
    // Valid calls
    try testing.expect(evm.Precompiles.validate_call(sha256_address, 0, 60, chain_rules));
    try testing.expect(evm.Precompiles.validate_call(sha256_address, 32, 72, chain_rules));
    try testing.expect(evm.Precompiles.validate_call(sha256_address, 64, 84, chain_rules));
    
    // Invalid calls (insufficient gas)
    try testing.expect(!evm.Precompiles.validate_call(sha256_address, 32, 71, chain_rules));
    try testing.expect(!evm.Precompiles.validate_call(sha256_address, 64, 83, chain_rules));
}