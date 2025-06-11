const std = @import("std");
const testing = std.testing;
const blake2f = @import("src/evm/precompiles/blake2f.zig");

test "blake2f basic functionality" {
    // Simple test to verify our blake2f compiles and basic functionality works
    const rounds = 1;
    var input = [_]u8{0} ** 213;
    
    // Set rounds (big-endian)
    std.mem.writeInt(u32, input[0..4], rounds, .big);
    
    // Set final flag
    input[212] = 0;
    
    var output = [_]u8{0} ** 64;
    const result = blake2f.execute(&input, &output, 1000);
    
    try testing.expect(result.success == true);
    try testing.expectEqual(@as(u64, 1), result.gas_used);
}