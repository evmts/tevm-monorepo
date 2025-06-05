const std = @import("std");
const Address = @import("Address");

/// Storage key that combines an address and slot number for indexing VM storage maps
/// This version is used by the VM for generic hashing with external hashers
const Self = @This();

address: Address.Address,
slot: u256,

pub fn hash(self: Self, hasher: anytype) void {
    // Hash the address bytes
    hasher.update(&self.address);
    // Hash the slot as bytes
    var slot_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &slot_bytes, self.slot, .big);
    hasher.update(&slot_bytes);
}

pub fn eql(a: Self, b: Self) bool {
    return std.mem.eql(u8, &a.address, &b.address) and a.slot == b.slot;
}