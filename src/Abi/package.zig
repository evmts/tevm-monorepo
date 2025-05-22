const std = @import("std");

/// Export the ABI module
pub const Abi = @import("abi.zig").Abi;
pub const parseAbi = @import("abi.zig").parseAbi;

test {
    std.testing.refAllDecls(@This());
}