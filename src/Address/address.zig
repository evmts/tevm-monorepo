const std = @import("std");

pub const Address = [20]u8;
pub const ZeroAddress: Address = [_]u8{0} ** 20;

pub fn addressFromHex(comptime hex: [42]u8) Address {
    if (!std.mem.startsWith(u8, hex, "0x"))
        @compileError("hex must start with '0x'");

    var out: Address = undefined;
    std.fmt.hexToBytes(&out, hex[2..]) catch unreachable;
    return out;
}
