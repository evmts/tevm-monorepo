const std = @import("std");

pub fn main() \!void {
    const max_offset = std.math.maxInt(usize) - 32;
    std.debug.print("max_offset = {d}\n", .{max_offset});
    std.debug.print("max_offset > maxInt(u256)? {}\n", .{max_offset > std.math.maxInt(u256)});
}
