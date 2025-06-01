const Address = @import("Address");

pub const EIP7702_MAGIC_BYTES = [2]u8{ 0xE7, 0x02 };

const Self = @This();

address: Address.Address,

pub fn new(address: Address.Address) Self {
    return .{ .address = address };
}

pub fn newRaw(bytes: []const u8) !Self {
    var address: Address.Address = undefined;
    if (bytes.len > 20) {
        @memcpy(&address, bytes[2..22]);
    }
    return Self.new(address);
}

pub fn raw(self: *const Self) []const u8 {
    _ = self;
    return &[_]u8{};
}
