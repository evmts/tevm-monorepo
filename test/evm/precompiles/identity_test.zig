const std = @import("std");
const testing = std.testing;
const identity = @import("../../../src/evm/precompiles/identity.zig");
const precompiles = @import("../../../src/evm/precompiles/precompiles.zig");
const PrecompileOutput = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileError;
const ChainRules = @import("../../../src/evm/hardforks/chain_rules.zig");
const Address = @import("Address").Address;

test "identity gas calculation" {
    // Empty input: 15 gas (base cost)
    try testing.expectEqual(@as(u64, 15), identity.calculate_gas(0));
    
    // 1 byte: 15 + 3 = 18 gas (1 word)
    try testing.expectEqual(@as(u64, 18), identity.calculate_gas(1));
    
    // 32 bytes: 15 + 3 = 18 gas (1 word)
    try testing.expectEqual(@as(u64, 18), identity.calculate_gas(32));
    
    // 33 bytes: 15 + 6 = 21 gas (2 words)
    try testing.expectEqual(@as(u64, 21), identity.calculate_gas(33));
    
    // 64 bytes: 15 + 6 = 21 gas (2 words)
    try testing.expectEqual(@as(u64, 21), identity.calculate_gas(64));
    
    // 65 bytes: 15 + 9 = 24 gas (3 words)
    try testing.expectEqual(@as(u64, 24), identity.calculate_gas(65));
    
    // 1024 bytes: 15 + 3*32 = 111 gas (32 words)
    try testing.expectEqual(@as(u64, 111), identity.calculate_gas(1024));
}

test "identity gas calculation checked" {
    // Normal cases should work
    try testing.expectEqual(@as(u64, 15), try identity.calculate_gas_checked(0));
    try testing.expectEqual(@as(u64, 18), try identity.calculate_gas_checked(32));
    
    // Very large input that could cause overflow should be handled gracefully
    const huge_size = std.math.maxInt(usize);
    if (identity.calculate_gas_checked(huge_size)) |_| {
        // If it succeeds, that's fine too (depends on platform)
    } else |err| {
        try testing.expect(err == error.Overflow);
    }
}

test "identity execute empty input" {
    var output_buffer: [0]u8 = undefined;
    const result = identity.execute(&[_]u8{}, &output_buffer, 100);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 15), result.get_gas_used());
    try testing.expectEqual(@as(usize, 0), result.get_output_size());
}

test "identity execute with data" {
    const allocator = testing.allocator;
    
    // Test with 32 bytes of data
    const input_data = [_]u8{1} ** 32;
    var output_buffer = try allocator.alloc(u8, 32);
    defer allocator.free(output_buffer);
    
    const result = identity.execute(&input_data, output_buffer, 100);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 18), result.get_gas_used()); // 15 + 3
    try testing.expectEqual(@as(usize, 32), result.get_output_size());
    
    // Verify output matches input exactly
    try testing.expectEqualSlices(u8, &input_data, output_buffer[0..32]);
}

test "identity execute data integrity" {
    const allocator = testing.allocator;
    
    // Test with sequential data
    var input_data: [100]u8 = undefined;
    for (input_data, 0..) |*byte, i| {
        byte.* = @intCast(i % 256);
    }
    
    var output_buffer = try allocator.alloc(u8, 100);
    defer allocator.free(output_buffer);
    
    const result = identity.execute(&input_data, output_buffer, 1000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 24), result.get_gas_used()); // 15 + 3*3 (for 100 bytes = 4 words)
    try testing.expectEqual(@as(usize, 100), result.get_output_size());
    
    // Verify output matches input exactly
    try testing.expectEqualSlices(u8, &input_data, output_buffer[0..100]);
}

test "identity execute out of gas" {
    const input_data = [_]u8{1} ** 32;
    var output_buffer: [32]u8 = undefined;
    
    // Provide insufficient gas (need 18, only provide 17)
    const result = identity.execute(&input_data, &output_buffer, 17);
    
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.OutOfGas, result.get_error().?);
    try testing.expectEqual(@as(u64, 0), result.get_gas_used());
}

test "identity execute insufficient output buffer" {
    const input_data = [_]u8{1} ** 32;
    var output_buffer: [31]u8 = undefined; // Too small for 32-byte input
    
    const result = identity.execute(&input_data, &output_buffer, 100);
    
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.get_error().?);
}

test "identity validate gas requirement" {
    // Valid cases
    try testing.expect(identity.validate_gas_requirement(0, 15));
    try testing.expect(identity.validate_gas_requirement(32, 18));
    try testing.expect(identity.validate_gas_requirement(64, 21));
    
    // Invalid cases
    try testing.expect(!identity.validate_gas_requirement(32, 17)); // Need 18
    try testing.expect(!identity.validate_gas_requirement(64, 20)); // Need 21
}

test "identity get output size" {
    try testing.expectEqual(@as(usize, 0), identity.get_output_size(0));
    try testing.expectEqual(@as(usize, 1), identity.get_output_size(1));
    try testing.expectEqual(@as(usize, 32), identity.get_output_size(32));
    try testing.expectEqual(@as(usize, 100), identity.get_output_size(100));
    try testing.expectEqual(@as(usize, 1024), identity.get_output_size(1024));
}

test "precompile dispatcher identity integration" {
    const identity_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x04 };
    
    // Check address detection
    try testing.expect(precompiles.is_precompile(identity_address));
    
    // Check availability with default chain rules (IDENTITY is available from Frontier)
    const chain_rules = ChainRules.DEFAULT;
    try testing.expect(precompiles.is_available(identity_address, chain_rules));
}

test "precompile dispatcher execute identity" {
    const allocator = testing.allocator;
    const identity_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x04 };
    
    const input_data = [_]u8{ 0xDE, 0xAD, 0xBE, 0xEF };
    var output_buffer = try allocator.alloc(u8, 4);
    defer allocator.free(output_buffer);
    
    const chain_rules = ChainRules.DEFAULT;
    const result = precompiles.execute_precompile(
        identity_address,
        &input_data,
        output_buffer,
        100,
        chain_rules
    );
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 18), result.get_gas_used()); // 15 + 3 for 1 word
    try testing.expectEqual(@as(usize, 4), result.get_output_size());
    try testing.expectEqualSlices(u8, &input_data, output_buffer[0..4]);
}

test "precompile dispatcher estimate gas" {
    const identity_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x04 };
    const chain_rules = ChainRules.DEFAULT;
    
    try testing.expectEqual(@as(u64, 15), try precompiles.estimate_gas(identity_address, 0, chain_rules));
    try testing.expectEqual(@as(u64, 18), try precompiles.estimate_gas(identity_address, 32, chain_rules));
    try testing.expectEqual(@as(u64, 21), try precompiles.estimate_gas(identity_address, 64, chain_rules));
}

test "precompile dispatcher get output size" {
    const identity_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x04 };
    const chain_rules = ChainRules.DEFAULT;
    
    try testing.expectEqual(@as(usize, 0), try precompiles.get_output_size(identity_address, 0, chain_rules));
    try testing.expectEqual(@as(usize, 32), try precompiles.get_output_size(identity_address, 32, chain_rules));
    try testing.expectEqual(@as(usize, 100), try precompiles.get_output_size(identity_address, 100, chain_rules));
}

test "precompile dispatcher validate call" {
    const identity_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x04 };
    const chain_rules = ChainRules.DEFAULT;
    
    // Valid calls
    try testing.expect(precompiles.validate_call(identity_address, 0, 15, chain_rules));
    try testing.expect(precompiles.validate_call(identity_address, 32, 18, chain_rules));
    try testing.expect(precompiles.validate_call(identity_address, 32, 100, chain_rules));
    
    // Invalid calls (insufficient gas)
    try testing.expect(!precompiles.validate_call(identity_address, 32, 17, chain_rules));
    try testing.expect(!precompiles.validate_call(identity_address, 64, 20, chain_rules));
}

test "precompile dispatcher invalid address" {
    const invalid_address: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xFF };
    var output_buffer: [32]u8 = undefined;
    const chain_rules = ChainRules.DEFAULT;
    
    // Should not be detected as precompile
    try testing.expect(!precompiles.is_precompile(invalid_address));
    
    // Execution should fail
    const result = precompiles.execute_precompile(
        invalid_address,
        &[_]u8{1, 2, 3},
        &output_buffer,
        100,
        chain_rules
    );
    
    try testing.expect(result.is_failure());
    try testing.expectEqual(PrecompileError.ExecutionFailed, result.get_error().?);
}

test "identity performance benchmark" {
    const allocator = testing.allocator;
    
    // Test with 1KB of data
    const input_size = 1024;
    var input_data = try allocator.alloc(u8, input_size);
    defer allocator.free(input_data);
    
    var output_buffer = try allocator.alloc(u8, input_size);
    defer allocator.free(output_buffer);
    
    // Fill with test data
    for (input_data, 0..) |*byte, i| {
        byte.* = @intCast(i % 256);
    }
    
    const iterations = 1000;
    var timer = try std.time.Timer.start();
    
    for (0..iterations) |_| {
        const result = identity.execute(input_data, output_buffer, 1000);
        try testing.expect(result.is_success());
    }
    
    const elapsed_ns = timer.read();
    const ns_per_op = elapsed_ns / iterations;
    
    // Should complete within reasonable time (adjust threshold as needed)
    // This is more of a regression test than a strict performance requirement
    try testing.expect(ns_per_op < 100_000); // 100 microseconds per operation
}

test "identity edge cases" {
    const allocator = testing.allocator;
    
    // Test with exactly 31 bytes (boundary case for word calculation)
    {
        const input_data = [_]u8{0xFF} ** 31;
        var output_buffer = try allocator.alloc(u8, 31);
        defer allocator.free(output_buffer);
        
        const result = identity.execute(&input_data, output_buffer, 100);
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 18), result.get_gas_used()); // 15 + 3 (1 word)
        try testing.expectEqualSlices(u8, &input_data, output_buffer);
    }
    
    // Test with exactly 33 bytes (boundary case for word calculation)
    {
        const input_data = [_]u8{0xAA} ** 33;
        var output_buffer = try allocator.alloc(u8, 33);
        defer allocator.free(output_buffer);
        
        const result = identity.execute(&input_data, output_buffer, 100);
        try testing.expect(result.is_success());
        try testing.expectEqual(@as(u64, 21), result.get_gas_used()); // 15 + 6 (2 words)
        try testing.expectEqualSlices(u8, &input_data, output_buffer);
    }
}