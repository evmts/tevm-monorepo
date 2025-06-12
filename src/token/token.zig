const std = @import("std");

pub fn format_units(
    buf: []u8,
    value: u256,
    decimals: u8,
) ![]u8 {
    const pow10 = try std.math.powi(u256, 10, decimals);
    const whole = value / pow10;

    var fbs = std.io.fixedBufferStream(buf);
    try std.fmt.formatInt(whole, 10, .lower, fbs.writer());

    return fbs.getWritten();
}

pub fn format_ether(
    buf: []u8,
    value: u256,
) ![]u8 {
    return formatUnits(buf, value, 18);
}

pub fn format_gwei(
    buf: []u8,
    value: u256,
) ![]u8 {
    return formatUnits(buf, value, 9);
}
pub fn parse_units(value: []const u8, decimals: u8) !u256 {
    const pow10 = try std.math.powi(u256, 10, decimals);
    const parsed = try std.fmt.parseInt(u256, value, 10);
    return parsed * pow10;
}

pub fn parse_ether(value: []const u8) !u256 {
    return parseUnits(value, 18);
}

pub fn parse_gwei(value: []const u8) !u256 {
    return parseUnits(value, 9);
}
