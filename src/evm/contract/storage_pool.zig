const std = @import("std");

/// Object pool for EVM storage-related hash maps to reduce allocation pressure.
///
/// The StoragePool manages reusable hash maps for storage slot tracking and access
/// patterns, significantly reducing allocation/deallocation overhead during EVM
/// execution. This is particularly important for contracts that make heavy use
/// of storage operations.
///
/// ## Design Rationale
/// EVM execution frequently creates and destroys hash maps for:
/// - Tracking which storage slots have been accessed (warm/cold for EIP-2929)
/// - Storing original storage values for gas refund calculations
///
/// Rather than allocating new maps for each contract call, this pool maintains
/// a cache of cleared maps ready for reuse.
///
/// ## Usage Pattern
/// ```zig
/// var pool = StoragePool.init(allocator);
/// defer pool.deinit();
///
/// // Borrow a map
/// const map = try pool.borrow_storage_map();
/// defer pool.return_storage_map(map);
///
/// // Use the map for storage operations
/// try map.put(slot, value);
/// ```
///
/// ## Thread Safety
/// This pool is NOT thread-safe. Each thread should maintain its own pool
/// or use external synchronization.
const StoragePool = @This();

/// Pool of reusable access tracking maps (slot -> accessed flag)
access_maps: std.ArrayList(*std.AutoHashMap(u256, bool)),
/// Pool of reusable storage value maps (slot -> value)
storage_maps: std.ArrayList(*std.AutoHashMap(u256, u256)),
/// Allocator used for creating new maps when pool is empty
allocator: std.mem.Allocator,

/// Initialize a new storage pool.
///
/// @param allocator The allocator to use for creating new maps
/// @return A new StoragePool instance
///
/// Example:
/// ```zig
/// var pool = StoragePool.init(allocator);
/// defer pool.deinit();
/// ```
pub fn init(allocator: std.mem.Allocator) StoragePool {
    return .{
        .access_maps = std.ArrayList(*std.AutoHashMap(u256, bool)).init(allocator),
        .storage_maps = std.ArrayList(*std.AutoHashMap(u256, u256)).init(allocator),
        .allocator = allocator,
    };
}

/// Clean up the storage pool and all contained maps.
///
/// This function destroys all pooled maps and frees their memory.
/// After calling deinit, the pool should not be used.
///
/// Note: Any maps currently borrowed from the pool will become invalid
/// after deinit. Ensure all borrowed maps are returned before calling this.
pub fn deinit(self: *StoragePool) void {
    // Clean up any remaining maps
    for (self.access_maps.items) |map| {
        map.deinit();
        self.allocator.destroy(map);
    }
    for (self.storage_maps.items) |map| {
        map.deinit();
        self.allocator.destroy(map);
    }
    self.access_maps.deinit();
    self.storage_maps.deinit();
}

/// Error type for access map borrowing operations
pub const BorrowAccessMapError = error{
    /// Allocator failed to allocate memory for a new map
    OutOfAllocatorMemory,
};

/// Borrow an access tracking map from the pool.
///
/// Access maps track which storage slots have been accessed during execution,
/// used for EIP-2929 warm/cold access gas pricing.
///
/// If the pool has available maps, one is returned immediately.
/// Otherwise, a new map is allocated.
///
/// @return A cleared hash map ready for use
/// @throws OutOfAllocatorMemory if allocation fails
///
/// Example:
/// ```zig
/// const access_map = try pool.borrow_access_map();
/// defer pool.return_access_map(access_map);
///
/// // Track storage slot access
/// try access_map.put(slot, true);
/// const was_accessed = access_map.get(slot) orelse false;
/// ```
pub fn borrow_access_map(self: *StoragePool) BorrowAccessMapError!*std.AutoHashMap(u256, bool) {
    if (self.access_maps.items.len > 0) return self.access_maps.pop() orelse unreachable;
    const map = self.allocator.create(std.AutoHashMap(u256, bool)) catch {
        return BorrowAccessMapError.OutOfAllocatorMemory;
    };
    map.* = std.AutoHashMap(u256, bool).init(self.allocator);
    return map;
}

/// Return an access map to the pool for reuse.
///
/// The map is cleared but its capacity is retained to avoid
/// reallocation on next use. If the pool fails to store the
/// returned map (due to memory pressure), it is silently discarded.
///
/// @param map The map to return to the pool
///
/// Note: The map should not be used after returning it to the pool.
pub fn return_access_map(self: *StoragePool, map: *std.AutoHashMap(u256, bool)) void {
    map.clearRetainingCapacity();
    self.access_maps.append(map) catch {};
}

/// Error type for storage map borrowing operations
pub const BorrowStorageMapError = error{
    /// Allocator failed to allocate memory for a new map
    OutOfAllocatorMemory,
};

/// Borrow a storage value map from the pool.
///
/// Storage maps store slot values, typically used for tracking original
/// values to calculate gas refunds or implement storage rollback.
///
/// If the pool has available maps, one is returned immediately.
/// Otherwise, a new map is allocated.
///
/// @return A cleared hash map ready for use
/// @throws OutOfAllocatorMemory if allocation fails
///
/// Example:
/// ```zig
/// const storage_map = try pool.borrow_storage_map();
/// defer pool.return_storage_map(storage_map);
///
/// // Store original value before modification
/// try storage_map.put(slot, original_value);
/// ```
pub fn borrow_storage_map(self: *StoragePool) BorrowStorageMapError!*std.AutoHashMap(u256, u256) {
    if (self.storage_maps.pop()) |map| {
        return map;
    }
    const map = self.allocator.create(std.AutoHashMap(u256, u256)) catch {
        return BorrowStorageMapError.OutOfAllocatorMemory;
    };
    map.* = std.AutoHashMap(u256, u256).init(self.allocator);
    return map;
}

/// Return a storage map to the pool for reuse.
///
/// The map is cleared but its capacity is retained to avoid
/// reallocation on next use. If the pool fails to store the
/// returned map (due to memory pressure), it is silently discarded.
///
/// @param map The map to return to the pool
///
/// Note: The map should not be used after returning it to the pool.
pub fn return_storage_map(self: *StoragePool, map: *std.AutoHashMap(u256, u256)) void {
    map.clearRetainingCapacity();
    self.storage_maps.append(map) catch {};
}
