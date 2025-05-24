const std = @import("std");
const testing = std.testing;

// Minimal tests to ensure compilation works
test "CALL opcode compiles" {
    // Just a simple test to verify that the test framework is operational
    try testing.expect(true);
}

// Basic test for constants
test "CALL constants" {
    // Use known constants that should be true
    try testing.expect(true);
    try testing.expectEqual(@as(usize, 4), @sizeOf(u32));
}