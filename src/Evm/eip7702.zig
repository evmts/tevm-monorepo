const Address = @import("Address");

pub const EIP7702_MAGIC_BYTES = [2]u8{0xE7, 0x02};

pub const Eip7702Bytecode = struct {
    address: Address.Address,
    
    pub fn new(address: Address.Address) Eip7702Bytecode {
        return .{ .address = address };
    }
    
    pub fn newRaw(bytes: []const u8) !Eip7702Bytecode {
        var address: Address.Address = undefined;
        if (bytes.len > 20) {
            @memcpy(&address, bytes[2..22]);
        }
        return Eip7702Bytecode.new(address);
    }
    
    pub fn raw(self: *const Eip7702Bytecode) []const u8 {
        _ = self;
        return &[_]u8{};
    }
};