const std = @import("std");
const testing = std.testing;
const precompiles = @import("src/evm/precompiles/precompiles.zig");
const addresses = @import("src/evm/precompiles/precompile_addresses.zig");
const ChainRules = @import("src/evm/hardforks/chain_rules.zig");

test "blake2f precompile integration test" {
    // Test precompile address
    const blake2f_address = addresses.BLAKE2F_ADDRESS;
    
    // Verify it's recognized as a precompile
    try testing.expect(precompiles.is_precompile(blake2f_address));
    
    // Verify availability with Istanbul rules
    const istanbul_rules = ChainRules{ .IsIstanbul = true, .IsByzantium = true, .IsCancun = false };
    try testing.expect(precompiles.is_available(blake2f_address, istanbul_rules));
    
    // Verify not available pre-Istanbul
    const pre_istanbul_rules = ChainRules{ .IsIstanbul = false, .IsByzantium = true, .IsCancun = false };
    try testing.expect(!precompiles.is_available(blake2f_address, pre_istanbul_rules));
    
    // Create valid input
    var input = [_]u8{0} ** 213;
    std.mem.writeInt(u32, input[0..4], 12, .big); // 12 rounds
    input[212] = 1; // Final flag
    
    var output = [_]u8{0} ** 64;
    
    // Test execution through precompile dispatcher
    const result = precompiles.execute_precompile(blake2f_address, &input, &output, 1000, istanbul_rules);
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u64, 12), result.get_gas_used());
    try testing.expectEqual(@as(usize, 64), result.get_output_size());
    
    // Test gas estimation
    const estimated_gas = precompiles.estimate_gas(blake2f_address, 213, istanbul_rules);
    try testing.expect(estimated_gas != null);
    
    // Test output size query
    const expected_output_size = precompiles.get_output_size(blake2f_address, 213, istanbul_rules);
    try testing.expectEqual(@as(usize, 64), expected_output_size catch unreachable);
    
    std.debug.print("✅ BLAKE2F precompile integration test passed!\n", .{});
}