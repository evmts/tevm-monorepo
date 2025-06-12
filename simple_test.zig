const std = @import("std");
const testing = std.testing;

test "simple test" {
    const a: u32 = 42;
    try testing.expectEqual(@as(u32, 42), a);
}