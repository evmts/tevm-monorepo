const std = @import("std");
const c = @cImport({
    @cInclude("foundry_wrapper.h");
});

pub fn main() !void {
    std.debug.print("Testing Zig-Rust linking\n", .{});
    
    // Try to call a simple Rust function
    const version = c.foundry_get_version();
    if (version != null) {
        std.debug.print("Foundry version: {s}\n", .{version});
        c.foundry_free_string(version);
    }
}

test "simple test" {
    try std.testing.expect(true);
}