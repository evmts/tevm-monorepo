const std = @import("std");

/// Composite key for EVM storage operations combining address and slot.
///
/// The StorageKey uniquely identifies a storage location within the EVM by
/// combining a contract address with a 256-bit storage slot number. This is
/// fundamental to how the EVM organizes persistent contract storage.
///
/// ## Design Rationale
/// Each smart contract has its own isolated storage space addressed by 256-bit
/// slots. To track storage across multiple contracts in a single VM instance,
/// we need a composite key that includes both the contract address and the
/// slot number.
///
/// ## Storage Model
/// In the EVM:
/// - Each contract has 2^256 storage slots
/// - Each slot can store a 256-bit value
/// - Slots are initially zero and only consume gas when first written
///
/// ## Usage
/// ```zig
/// const key = StorageKey{
///     .address = contract_address,
///     .slot = 0x0, // First storage slot
/// };
///
/// // Use in hash maps for storage tracking
/// var storage = std.AutoHashMap(StorageKey, u256).init(allocator);
/// try storage.put(key, value);
/// ```
///
/// ## Hashing Strategy
/// The key implements a generic hash function that works with any hasher
/// implementing the standard update() interface. The address is hashed first,
/// followed by the slot number in big-endian format.
const StorageKey = @This();

/// The contract address that owns this storage slot.
/// Standard 20-byte Ethereum address.
address: [20]u8,

/// The 256-bit storage slot number within the contract's storage space.
/// Slots are sparsely allocated - most remain at zero value.
slot: u256,

/// Compute a hash of this storage key for use in hash maps.
///
/// This function is designed to work with Zig's AutoHashMap and any
/// hasher that implements the standard `update([]const u8)` method.
///
/// The hash combines both the address and slot to ensure unique hashes
/// for different storage locations. The slot is converted to big-endian
/// bytes to ensure consistent hashing across different architectures.
///
/// @param self The storage key to hash
/// @param hasher Any hasher with an update() method
///
/// Example:
/// ```zig
/// var map = std.AutoHashMap(StorageKey, u256).init(allocator);
/// const key = StorageKey{ .address = addr, .slot = slot };
/// try map.put(key, value); // Uses hash() internally
/// ```
pub fn hash(self: StorageKey, hasher: anytype) void {
    // Hash the address bytes
    hasher.update(&self.address);
    // Hash the slot as bytes in big-endian format for consistency
    var slot_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &slot_bytes, self.slot, .big);
    hasher.update(&slot_bytes);
}

/// Check equality between two storage keys.
///
/// Two storage keys are equal if and only if both their address and
/// slot number match exactly. This is used by hash maps to resolve
/// collisions and find exact matches.
///
/// @param a First storage key
/// @param b Second storage key
/// @return true if both address and slot match
///
/// Example:
/// ```zig
/// const key1 = StorageKey{ .address = addr, .slot = 0 };
/// const key2 = StorageKey{ .address = addr, .slot = 0 };
/// if (!StorageKey.eql(key1, key2)) unreachable;
/// ```
pub fn eql(a: StorageKey, b: StorageKey) bool {
    // Fast path for identical keys (likely in hot loops)
    if (std.mem.eql(u8, &a.address, &b.address) and a.slot == b.slot) {
        @branchHint(.likely);
        return true;
    } else {
        @branchHint(.cold);
        return false;
    }
}
