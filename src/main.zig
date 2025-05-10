const std = @import("std");

const stdout = std.io.getStdOut().writer();
const stderr = std.io.getStdErr().writer();

pub fn main() !void {
    try stdout.print("Hello world", .{});
}
