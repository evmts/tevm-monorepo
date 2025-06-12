const std = @import("std");
const StorageKey = @import("../state/storage_key.zig");

/// Hash map context for StorageKey used in original value tracking.
///
/// This context provides the hash and equality functions needed by
/// std.HashMap to use StorageKey as a key type. It leverages the
/// existing hash and eql methods from StorageKey.
pub const StorageKeyContext = struct {
    /// Hash a StorageKey for use in hash maps.
    ///
    /// @param self Context instance (unused)
    /// @param key Storage key to hash
    /// @return Hash value for the key
    pub fn hash(self: @This(), key: StorageKey) u64 {
        _ = self;
        var hasher = std.hash.Wyhash.init(0);
        key.hash(&hasher);
        return hasher.final();
    }
    
    /// Check equality between two StorageKey instances.
    ///
    /// @param self Context instance (unused)
    /// @param a First storage key
    /// @param b Second storage key
    /// @return True if keys are equal
    pub fn eql(self: @This(), a: StorageKey, b: StorageKey) bool {
        _ = self;
        return StorageKey.eql(a, b);
    }
};

/// Hash map type for tracking original storage values within a transaction.
///
/// The StorageOriginalValues map stores the original value of each storage
/// slot at the beginning of a transaction. This is critical for implementing
/// EIP-2200 SSTORE gas calculations and refund logic, which depend on comparing
/// the current value, new value, and original value.
///
/// ## Usage in SSTORE Gas Calculation
/// EIP-2200 defines complex gas costs based on three values:
/// - **Original**: Value at transaction start (stored here)
/// - **Current**: Value at the moment of SSTORE execution
/// - **New**: Value being written by SSTORE
///
/// ## Memory Management
/// This map should be cleared at the end of each transaction to prevent
/// memory leaks and ensure fresh state for the next transaction.
///
/// ## Example
/// ```zig
/// var original_values = StorageOriginalValues.init(allocator);
/// defer original_values.deinit();
/// 
/// const key = StorageKey{ .address = contract_addr, .slot = 0 };
/// 
/// // First access to this slot - store original value
/// if (!original_values.contains(key)) {
///     const original = vm.state.get_storage(key.address, key.slot);
///     try original_values.put(key, original);
/// }
/// 
/// // Later access can retrieve the original value
/// const original = original_values.get(key).?;
/// ```
pub const StorageOriginalValues = std.HashMap(
    StorageKey,
    u256,
    StorageKeyContext,
    std.hash_map.default_max_load_percentage
);

/// Convenience function to create a new StorageOriginalValues map.
///
/// @param allocator Memory allocator for the hash map
/// @return Initialized empty hash map
pub fn init(allocator: std.mem.Allocator) StorageOriginalValues {
    return StorageOriginalValues.init(allocator);
}

/// Get the original value for a storage slot, storing it if not already tracked.
///
/// This function implements the "store-on-first-access" pattern for original
/// values. If the storage slot has not been accessed before in this transaction,
/// it fetches the current value from state and stores it as the original value.
///
/// @param original_values Mutable reference to the original values map
/// @param state VM state interface for reading storage
/// @param address Contract address
/// @param slot Storage slot number
/// @return Original value of the storage slot
/// @throws std.mem.Allocator.Error if memory allocation fails
///
/// Example:
/// ```zig
/// const original = try get_or_store_original(
///     &vm.original_storage_values,
///     &vm.state,
///     contract_address,
///     storage_slot
/// );
/// ```
pub fn get_or_store_original(
    original_values: *StorageOriginalValues,
    state: anytype, // Generic state interface with get_storage method
    address: [20]u8,
    slot: u256,
) std.mem.Allocator.Error!u256 {
    const storage_key = StorageKey{
        .address = address,
        .slot = slot,
    };
    
    // Check if we already have the original value
    if (original_values.get(storage_key)) |original_value| {
        return original_value;
    }
    
    // First access - fetch and store the original value
    const original_value = state.get_storage(address, slot);
    try original_values.put(storage_key, original_value);
    return original_value;
}