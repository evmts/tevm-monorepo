const std = @import("std");
const Address = @import("Address");

/// Storage slot key combining address and slot for access list operations
/// This version provides direct hash output for use with HashMap
const Self = @This();

address: Address.Address,
slot: u256,

pub fn hash(self: Self) u64 {
    var hasher = std.hash.Wyhash.init(0);
    hasher.update(&self.address);
    hasher.update(std.mem.asBytes(&self.slot));
    return hasher.final();
}

pub fn eql(self: Self, other: Self) bool {
    return std.mem.eql(u8, &self.address, &other.address) and self.slot == other.slot;
}
