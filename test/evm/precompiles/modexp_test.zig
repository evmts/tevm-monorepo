const std = @import("std");
const testing = std.testing;
const modexp = @import("../../../src/evm/precompiles/modexp.zig");
const PrecompileOutput = @import("../../../src/evm/precompiles/precompile_result.zig").PrecompileOutput;

/// Test basic MODEXP functionality with simple cases
test "MODEXP basic functionality" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Test case: 3^2 mod 5 = 9 mod 5 = 4
    // Input format: 32 bytes base_len + 32 bytes exp_len + 32 bytes mod_len + base + exp + mod
    var input = try allocator.alloc(u8, 96 + 3); // 96 header + 3 data bytes
    defer allocator.free(input);
    
    // Clear input
    @memset(input, 0);
    
    // Set lengths: base_len=1, exp_len=1, mod_len=1
    input[31] = 1; // base_len = 1 (last byte of first 32-byte field)
    input[63] = 1; // exp_len = 1 (last byte of second 32-byte field)
    input[95] = 1; // mod_len = 1 (last byte of third 32-byte field)
    
    // Set values: base=3, exp=2, mod=5
    input[96] = 3; // base
    input[97] = 2; // exp  
    input[98] = 5; // mod
    
    var output = try allocator.alloc(u8, 1);
    defer allocator.free(output);
    
    const result = modexp.execute(input, output, 10000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u8, 4), output[0]);
    try testing.expectEqual(@as(usize, 1), result.get_output_size());
}

/// Test MODEXP with zero values and edge cases
test "MODEXP special cases" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Test case: base=0, exp=5, mod=7 -> result should be 0
    var input = try allocator.alloc(u8, 96 + 3);
    defer allocator.free(input);
    @memset(input, 0);
    
    // Set lengths: base_len=1, exp_len=1, mod_len=1  
    input[31] = 1; 
    input[63] = 1;
    input[95] = 1;
    
    // Set values: base=0, exp=5, mod=7
    input[96] = 0; // base
    input[97] = 5; // exp
    input[98] = 7; // mod
    
    var output = try allocator.alloc(u8, 1);
    defer allocator.free(output);
    
    const result = modexp.execute(input, output, 10000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u8, 0), output[0]);
}

/// Test MODEXP with exp=0 case (anything^0 = 1)
test "MODEXP exponent zero" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Test case: base=123, exp=0, mod=7 -> result should be 1
    var input = try allocator.alloc(u8, 96 + 3);
    defer allocator.free(input);
    @memset(input, 0);
    
    // Set lengths
    input[31] = 1;
    input[63] = 1; 
    input[95] = 1;
    
    // Set values: base=123, exp=0, mod=7
    input[96] = 123; // base
    input[97] = 0;   // exp
    input[98] = 7;   // mod
    
    var output = try allocator.alloc(u8, 1);
    defer allocator.free(output);
    
    const result = modexp.execute(input, output, 10000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u8, 1), output[0]);
}

/// Test MODEXP with larger numbers
test "MODEXP larger numbers" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Test case: 2^10 mod 1000 = 1024 mod 1000 = 24
    var input = try allocator.alloc(u8, 96 + 6); // 2 bytes each for base, exp, mod
    defer allocator.free(input);
    @memset(input, 0);
    
    // Set lengths: base_len=2, exp_len=2, mod_len=2
    input[31] = 2;
    input[63] = 2;
    input[95] = 2;
    
    // Set values: base=2, exp=10, mod=1000 (big-endian)
    input[96] = 0;  // base high byte
    input[97] = 2;  // base low byte
    input[98] = 0;  // exp high byte
    input[99] = 10; // exp low byte
    input[100] = (1000 >> 8) & 0xFF; // mod high byte
    input[101] = 1000 & 0xFF;        // mod low byte
    
    var output = try allocator.alloc(u8, 2);
    defer allocator.free(output);
    
    const result = modexp.execute(input, output, 10000);
    
    try testing.expect(result.is_success());
    try testing.expectEqual(@as(u8, 0), output[0]); // high byte of 24
    try testing.expectEqual(@as(u8, 24), output[1]); // low byte of 24
}

/// Test gas calculation
test "MODEXP gas calculation" {
    const gas1 = modexp.calculate_gas(1, 1, 1, &[_]u8{1});
    try testing.expect(gas1 >= modexp.MODEXP_MIN_GAS);
    
    // Larger inputs should cost more gas
    const gas2 = modexp.calculate_gas(32, 32, 32, &[_]u8{0xFF} ** 32);
    try testing.expect(gas2 > gas1);
    
    // Very large exponent should cost more
    const large_exp = [_]u8{0xFF} ** 32;
    const gas3 = modexp.calculate_gas(32, 100, 32, &large_exp);
    try testing.expect(gas3 > gas2);
}

/// Test insufficient gas
test "MODEXP insufficient gas" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    var input = try allocator.alloc(u8, 96 + 3);
    defer allocator.free(input);
    @memset(input, 0);
    
    // Set up a valid input
    input[31] = 1;
    input[63] = 1;
    input[95] = 1;
    input[96] = 2;
    input[97] = 3;
    input[98] = 5;
    
    var output = try allocator.alloc(u8, 1);
    defer allocator.free(output);
    
    // Try with insufficient gas
    const result = modexp.execute(input, output, 10); // Very low gas limit
    
    try testing.expect(result.is_failure());
}

/// Test invalid input (too short)
test "MODEXP invalid input" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    
    // Input too short (missing header)
    var input = try allocator.alloc(u8, 50);
    defer allocator.free(input);
    @memset(input, 0);
    
    var output = try allocator.alloc(u8, 32);
    defer allocator.free(output);
    
    const result = modexp.execute(input, output, 10000);
    
    try testing.expect(result.is_failure());
}