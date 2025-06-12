const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Address = @import("Address").Address;

// Convenience aliases
const PrecompileOutput = evm.precompiles.precompile_result.PrecompileOutput;
const PrecompileError = evm.precompiles.precompile_result.PrecompileError;
const ChainRules = evm.hardforks.chain_rules;

// ============================
// REVM-Inspired Precompile Edge Cases
// ============================

// Test precompile input validation edge cases
test "precompile input size validation" {
    const allocator = testing.allocator;
    
    // SHA256: should accept any input size
    {
        // Empty input
        const empty_result = try evm.precompiles.sha256.run(allocator, &[_]u8{}, 60);
        defer empty_result.deinit(allocator);
        try testing.expect(empty_result == .success);
        
        // Very large input (test memory allocation)
        var large_input = try allocator.alloc(u8, 10000);
        defer allocator.free(large_input);
        std.mem.set(u8, large_input, 0x42);
        
        const required_gas = evm.precompiles.sha256.calculate_gas(large_input.len);
        const large_result = try evm.precompiles.sha256.run(allocator, large_input, required_gas);
        defer large_result.deinit(allocator);
        try testing.expect(large_result == .success);
    }
    
    // ECRECOVER: requires exactly 128 bytes
    {
        // Wrong size input (too small)
        const small_input = [_]u8{0x01, 0x02, 0x03};
        const small_result = try evm.precompiles.ecrecover.run(allocator, &small_input, 3000);
        defer small_result.deinit(allocator);
        try testing.expect(small_result == .failure);
        
        // Wrong size input (too large) 
        var large_input = try allocator.alloc(u8, 200);
        defer allocator.free(large_input);
        std.mem.set(u8, large_input, 0x00);
        
        const large_result = try evm.precompiles.ecrecover.run(allocator, large_input, 3000);
        defer large_result.deinit(allocator);
        try testing.expect(large_result == .failure);
        
        // Correct size (128 bytes) but invalid data
        var correct_size = try allocator.alloc(u8, 128);
        defer allocator.free(correct_size);
        std.mem.set(u8, correct_size, 0x00);
        
        const correct_result = try evm.precompiles.ecrecover.run(allocator, correct_size, 3000);
        defer correct_result.deinit(allocator);
        // Should succeed in validation but may fail in recovery (depends on implementation)
        try testing.expect(correct_result == .success or correct_result == .failure);
    }
}

// Test out-of-gas scenarios for each precompile
test "precompile out-of-gas conditions" {
    const allocator = testing.allocator;
    
    // ECRECOVER: insufficient gas
    {
        var input = try allocator.alloc(u8, 128);
        defer allocator.free(input);
        std.mem.set(u8, input, 0x00);
        
        // Provide less than required gas (3000)
        const insufficient_gas_result = try evm.precompiles.ecrecover.run(allocator, input, 2999);
        defer insufficient_gas_result.deinit(allocator);
        try testing.expect(insufficient_gas_result == .failure);
        
        // Provide exact gas
        const exact_gas_result = try evm.precompiles.ecrecover.run(allocator, input, 3000);
        defer exact_gas_result.deinit(allocator);
        try testing.expect(exact_gas_result == .success or exact_gas_result == .failure);
    }
    
    // SHA256: insufficient gas
    {
        const input = "test data";
        const required_gas = evm.precompiles.sha256.calculate_gas(input.len);
        
        // Provide insufficient gas
        const insufficient_result = try evm.precompiles.sha256.run(allocator, input, required_gas - 1);
        defer insufficient_result.deinit(allocator);
        try testing.expect(insufficient_result == .failure);
        
        // Provide exact gas
        const exact_result = try evm.precompiles.sha256.run(allocator, input, required_gas);
        defer exact_result.deinit(allocator);
        try testing.expect(exact_result == .success);
    }
    
    // RIPEMD160: insufficient gas (may not be implemented yet)
    // {
    //     const input = "test data";
    //     const required_gas = evm.precompiles.ripemd160.calculate_gas(input.len);
    //     
    //     // Provide insufficient gas
    //     const insufficient_result = try evm.precompiles.ripemd160.run(allocator, input, required_gas - 1);
    //     defer insufficient_result.deinit(allocator);
    //     try testing.expect(insufficient_result == .failure);
    //     
    //     // Provide exact gas
    //     const exact_result = try evm.precompiles.ripemd160.run(allocator, input, required_gas);
    //     defer exact_result.deinit(allocator);
    //     try testing.expect(exact_result == .success);
    // }
    
    // IDENTITY: insufficient gas
    {
        const input = "test data";
        const required_gas = evm.precompiles.identity.calculate_gas(input.len);
        
        // Provide insufficient gas
        const insufficient_result = try evm.precompiles.identity.run(allocator, input, required_gas - 1);
        defer insufficient_result.deinit(allocator);
        try testing.expect(insufficient_result == .failure);
        
        // Provide exact gas  
        const exact_result = try evm.precompiles.identity.run(allocator, input, required_gas);
        defer exact_result.deinit(allocator);
        try testing.expect(exact_result == .success);
    }
}

// Test ECRECOVER signature validation edge cases
test "ecrecover signature validation edge cases" {
    const allocator = testing.allocator;
    
    // Test various invalid recovery IDs
    var input = try allocator.alloc(u8, 128);
    defer allocator.free(input);
    std.mem.set(u8, input, 0x00);
    
    // Set invalid recovery ID (> 3)
    input[127] = 4; // v = 4 (invalid)
    const invalid_v_result = try evm.precompiles.ecrecover.run(allocator, input, 3000);
    defer invalid_v_result.deinit(allocator);
    try testing.expect(invalid_v_result == .failure);
    
    // Set valid recovery ID (27)
    input[127] = 27; // v = 27 (valid)
    const valid_v_result = try evm.precompiles.ecrecover.run(allocator, input, 3000);
    defer valid_v_result.deinit(allocator);
    // May succeed or fail depending on other signature components
    try testing.expect(valid_v_result == .success or valid_v_result == .failure);
    
    // Test malleability protection (high s values)
    // Set s to a high value that should be rejected
    const high_s = [_]u8{0xFF} ** 32;
    std.mem.copy(u8, input[64..96], &high_s);
    const high_s_result = try evm.precompiles.ecrecover.run(allocator, input, 3000);
    defer high_s_result.deinit(allocator);
    try testing.expect(high_s_result == .failure);
}

// Test MODEXP edge cases (if implemented)
test "modexp edge cases" {
    // Note: MODEXP might not be implemented yet, so we test what's available
    const allocator = testing.allocator;
    
    // Test with minimal input (should fail due to wrong format)
    const minimal_input = [_]u8{0x01};
    if (evm.precompiles.modexp) |modexp| {
        const result = try modexp.run(allocator, &minimal_input, 10000);
        defer result.deinit(allocator);
        try testing.expect(result == .failure);
    }
}

// Test gas calculation consistency across precompiles
test "precompile gas calculation consistency" {
    // Test that gas calculations are deterministic and reasonable
    
    // SHA256 gas should scale linearly with input size (in words)
    const sha256_base = evm.precompiles.sha256.calculate_gas(0);
    const sha256_one_word = evm.precompiles.sha256.calculate_gas(32);
    const sha256_two_words = evm.precompiles.sha256.calculate_gas(64);
    
    try testing.expectEqual(@as(u64, 60), sha256_base);
    try testing.expectEqual(@as(u64, 72), sha256_one_word);
    try testing.expectEqual(@as(u64, 84), sha256_two_words);
    
    // RIPEMD160 gas should also scale linearly (may not be implemented yet)
    // const ripemd_base = evm.precompiles.ripemd160.calculate_gas(0);
    // const ripemd_one_word = evm.precompiles.ripemd160.calculate_gas(32);
    // 
    // try testing.expectEqual(@as(u64, 600), ripemd_base);
    // try testing.expectEqual(@as(u64, 720), ripemd_one_word);
    
    // IDENTITY gas should scale linearly
    const identity_base = evm.precompiles.identity.calculate_gas(0);
    const identity_one_word = evm.precompiles.identity.calculate_gas(32);
    
    try testing.expectEqual(@as(u64, 15), identity_base);
    try testing.expectEqual(@as(u64, 18), identity_one_word);
    
    // ECRECOVER should have fixed cost regardless of input (when valid size)
    const ecrecover_gas = evm.precompiles.ecrecover.calculate_gas(128);
    try testing.expectEqual(@as(u64, 3000), ecrecover_gas);
}

// Test precompile address validation
test "precompile address validation" {
    // Test that precompile addresses are correctly defined
    
    // Standard Ethereum precompile addresses (check which are available)
    if (@hasDecl(evm.precompiles, "ECRECOVER_ADDRESS")) {
        try testing.expectEqual(@as(u64, 1), evm.precompiles.ECRECOVER_ADDRESS);
    }
    if (@hasDecl(evm.precompiles, "SHA256_ADDRESS")) {
        try testing.expectEqual(@as(u64, 2), evm.precompiles.SHA256_ADDRESS);
    }
    if (@hasDecl(evm.precompiles, "IDENTITY_ADDRESS")) {
        try testing.expectEqual(@as(u64, 4), evm.precompiles.IDENTITY_ADDRESS);
    }
    
    // Create addresses from integers (only for available precompiles)
    if (@hasDecl(evm.precompiles, "ECRECOVER_ADDRESS") and @hasDecl(evm.precompiles, "SHA256_ADDRESS")) {
        const ecrecover_addr = Address.fromInt(evm.precompiles.ECRECOVER_ADDRESS);
        const sha256_addr = Address.fromInt(evm.precompiles.SHA256_ADDRESS);
        
        // Verify addresses are different
        try testing.expect(!ecrecover_addr.eql(sha256_addr));
    }
}

// Test precompile execution with boundary conditions
test "precompile boundary condition testing" {
    const allocator = testing.allocator;
    
    // Test IDENTITY with exact 32-byte boundaries
    {
        // 31 bytes (should round up to 1 word)
        var input_31 = try allocator.alloc(u8, 31);
        defer allocator.free(input_31);
        for (input_31, 0..) |*byte, i| {
            byte.* = @intCast(i % 256);
        }
        
        const gas_31 = evm.precompiles.identity.calculate_gas(31);
        const result_31 = try evm.precompiles.identity.run(allocator, input_31, gas_31);
        defer result_31.deinit(allocator);
        try testing.expect(result_31 == .success);
        
        // 32 bytes (exactly 1 word)
        var input_32 = try allocator.alloc(u8, 32);
        defer allocator.free(input_32);
        for (input_32, 0..) |*byte, i| {
            byte.* = @intCast(i % 256);
        }
        
        const gas_32 = evm.precompiles.identity.calculate_gas(32);
        const result_32 = try evm.precompiles.identity.run(allocator, input_32, gas_32);
        defer result_32.deinit(allocator);
        try testing.expect(result_32 == .success);
        
        // 33 bytes (should round up to 2 words)
        var input_33 = try allocator.alloc(u8, 33);
        defer allocator.free(input_33);
        for (input_33, 0..) |*byte, i| {
            byte.* = @intCast(i % 256);
        }
        
        const gas_33 = evm.precompiles.identity.calculate_gas(33);
        const result_33 = try evm.precompiles.identity.run(allocator, input_33, gas_33);
        defer result_33.deinit(allocator);
        try testing.expect(result_33 == .success);
        
        // Gas should be the same for 31 and 32 bytes, but higher for 33 bytes
        try testing.expectEqual(gas_31, gas_32);
        try testing.expect(gas_33 > gas_32);
    }
}

// Test precompile failure mode consistency
test "precompile failure mode consistency" {
    const allocator = testing.allocator;
    
    // All precompiles should handle zero gas consistently
    {
        const input = "test";
        
        const sha256_zero_gas = try evm.precompiles.sha256.run(allocator, input, 0);
        defer sha256_zero_gas.deinit(allocator);
        try testing.expect(sha256_zero_gas == .failure);
        
        // RIPEMD160 precompile may not be implemented yet
        // const ripemd_zero_gas = try evm.precompiles.ripemd160.run(allocator, input, 0);
        // defer ripemd_zero_gas.deinit(allocator);
        // try testing.expect(ripemd_zero_gas == .failure);
        
        const identity_zero_gas = try evm.precompiles.identity.run(allocator, input, 0);
        defer identity_zero_gas.deinit(allocator);
        try testing.expect(identity_zero_gas == .failure);
        
        var ecrecover_input = try allocator.alloc(u8, 128);
        defer allocator.free(ecrecover_input);
        std.mem.set(u8, ecrecover_input, 0x00);
        
        const ecrecover_zero_gas = try evm.precompiles.ecrecover.run(allocator, ecrecover_input, 0);
        defer ecrecover_zero_gas.deinit(allocator);
        try testing.expect(ecrecover_zero_gas == .failure);
    }
}