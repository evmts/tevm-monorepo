const std = @import("std");
const token = @import("token.zig");

test "formatEther" {
    var buffer: [100]u8 = undefined;
    const result = try token.formatEther(&buffer, 1230000000000000000);
    try std.testing.expectEqualStrings("1230000000000000000", result);
}

test "formatGwei" {
    var buffer: [100]u8 = undefined;
    const result = try token.formatGwei(&buffer, 1230000000);
    try std.testing.expectEqualStrings("1230000000", result);
}

test "parseEther" {
    const value = try token.parseEther("1.23");
    try std.testing.expectEqual(@as(u256, 1230000000000000000), value);
}

test "parseGwei" {
    const value = try token.parseGwei("1.23");
    try std.testing.expectEqual(@as(u256, 1230000000), value);
}