const std = @import("std");

pub const evm = @import("Evm/evm.zig");
pub const utils = struct {
    pub const hex = @import("Utils/hex.zig");
    pub const keccak256 = @import("Utils/keccak256.zig");
};

pub fn main() void {
    _ = evm.Evm.execute(evm.ExecuteParams{
        .data = &[_]u8{},
        .code = &[_]u8{},
        .value = 0,
    }) catch unreachable;
}
