const std = @import("std");
const zigevm = @import("zigevm");

const stdout = std.io.getStdOut().writer();
const stderr = std.io.getStdErr().writer();

pub fn main() !void {
    try stdout.print("Hello world from zigevm {s}\n", .{@typeName(@TypeOf(zigevm.evm))});
}
