const std = @import("std");
const testing = std.testing;

// Import the unified B256 type
pub const B256 = @import("../../Types/B256.zig").B256;

/// Storage represents the contract storage state
/// It maps 256-bit keys to 256-bit values
pub const Storage = struct {
    /// The actual storage data
    data: std.AutoHashMap(B256, B256),
    
    /// Track which keys have been changed (dirty)
    dirty_keys: std.AutoHashMap(B256, void),
    
    /// Track original values for dirty keys (for reverts)
    original_values: std.AutoHashMap(B256, B256),
    
    /// Allocator for memory management
    allocator: std.mem.Allocator,
    
    /// Initialize a new storage
    pub fn init(allocator: std.mem.Allocator) Storage {
        return Storage{
            .data = std.AutoHashMap(B256, B256).init(allocator),
            .dirty_keys = std.AutoHashMap(B256, void).init(allocator),
            .original_values = std.AutoHashMap(B256, B256).init(allocator),
            .allocator = allocator,
        };
    }
    
    /// Clean up resources
    pub fn deinit(self: *Storage) void {
        self.data.deinit();
        self.dirty_keys.deinit();
        self.original_values.deinit();
    }
    
    /// Get a value from storage
    pub fn get(self: *const Storage, key: B256) B256 {
        return self.data.get(key) orelse B256.zero();
    }
    
    /// Set a value in storage
    pub fn set(self: *Storage, key: B256, value: B256) !void {
        // If key doesn't exist, it's a new key
        if (!self.data.contains(key)) {
            try self.data.put(key, value);
            try self.markDirty(key, B256.zero());
            return;
        }
        
        // If key already exists, get the current value
        const current = self.data.get(key).?;
        
        // No change, nothing to do
        if (B256.equal(current, value)) {
            return;
        }
        
        // Value is changing, track the change
        try self.markDirty(key, current);
        try self.data.put(key, value);
    }
    
    /// Mark a key as dirty, tracking the original value
    fn markDirty(self: *Storage, key: B256, original: B256) !void {
        // Skip if already marked dirty
        if (self.dirty_keys.contains(key)) {
            return;
        }
        
        // Mark as dirty and save original value
        try self.dirty_keys.put(key, {});
        try self.original_values.put(key, original);
    }
    
    /// Check if a key is dirty
    pub fn isDirty(self: *const Storage, key: B256) bool {
        return self.dirty_keys.contains(key);
    }
    
    /// Get all dirty keys
    pub fn getDirtyKeys(self: *const Storage) ![]B256 {
        const keys = try self.allocator.alloc(B256, self.dirty_keys.count());
        var i: usize = 0;
        
        var it = self.dirty_keys.keyIterator();
        while (it.next()) |key| {
            keys[i] = key.*;
            i += 1;
        }
        
        return keys;
    }
    
    /// Get the original value for a key
    pub fn getOriginal(self: *const Storage, key: B256) ?B256 {
        return self.original_values.get(key);
    }
    
    /// Reset dirty tracking
    pub fn clearDirty(self: *Storage) void {
        self.dirty_keys.clearRetainingCapacity();
        self.original_values.clearRetainingCapacity();
    }
    
    /// Delete a value from storage
    pub fn delete(self: *Storage, key: B256) !void {
        // If key doesn't exist, nothing to do
        if (!self.data.contains(key)) {
            return;
        }
        
        // Get current value for dirty tracking
        const current = self.data.get(key).?;
        
        // Track change and remove the key
        try self.markDirty(key, current);
        _ = self.data.remove(key);
    }
    
    /// Check if storage contains a key
    pub fn contains(self: *const Storage, key: B256) bool {
        return self.data.contains(key);
    }
    
    /// Get the number of entries in storage
    pub fn len(self: *const Storage) usize {
        return self.data.count();
    }
    
    /// Clone the storage
    pub fn clone(self: *const Storage) !Storage {
        var new_storage = Storage.init(self.allocator);
        errdefer new_storage.deinit();
        
        var it = self.data.iterator();
        while (it.next()) |entry| {
            try new_storage.data.put(entry.key_ptr.*, entry.value_ptr.*);
        }
        
        var dirty_it = self.dirty_keys.keyIterator();
        while (dirty_it.next()) |key| {
            try new_storage.dirty_keys.put(key.*, {});
        }
        
        var orig_it = self.original_values.iterator();
        while (orig_it.next()) |entry| {
            try new_storage.original_values.put(entry.key_ptr.*, entry.value_ptr.*);
        }
        
        return new_storage;
    }
};

// Tests
test "Storage initialization" {
    const allocator = testing.allocator;
    var storage = Storage.init(allocator);
    defer storage.deinit();
    
    try testing.expectEqual(@as(usize, 0), storage.len());
}

test "Storage get/set operations" {
    const allocator = testing.allocator;
    var storage = Storage.init(allocator);
    defer storage.deinit();
    
    // Test get on empty storage
    const key = B256.fromInt(123);
    try testing.expect(B256.isZero(storage.get(key)));
    
    // Test set and get
    const value = B256.fromInt(456);
    try storage.set(key, value);
    try testing.expect(B256.equal(value, storage.get(key)));
    try testing.expectEqual(@as(usize, 1), storage.len());
    
    // Test dirty tracking on new key
    try testing.expect(storage.isDirty(key));
    const original = storage.getOriginal(key).?;
    try testing.expect(B256.isZero(original));
    
    // Test updating an existing key
    const new_value = B256.fromInt(789);
    try storage.set(key, new_value);
    try testing.expect(B256.equal(new_value, storage.get(key)));
    try testing.expectEqual(@as(usize, 1), storage.len());
    
    // Original value should still be zero (first value)
    try testing.expect(B256.isZero(storage.getOriginal(key).?));
    
    // Setting same value should not mark dirty again
    storage.clearDirty();
    try storage.set(key, new_value);
    try testing.expect(!storage.isDirty(key));
}

test "Storage delete operations" {
    const allocator = testing.allocator;
    var storage = Storage.init(allocator);
    defer storage.deinit();
    
    // Add a key to delete
    const key = B256.fromInt(123);
    const value = B256.fromInt(456);
    try storage.set(key, value);
    try testing.expect(storage.contains(key));
    
    // Clear dirty tracking
    storage.clearDirty();
    try testing.expect(!storage.isDirty(key));
    
    // Delete the key
    try storage.delete(key);
    try testing.expect(!storage.contains(key));
    try testing.expect(storage.isDirty(key));
    
    // Original value should be tracked
    const original = storage.getOriginal(key).?;
    try testing.expect(B256.equal(value, original));
    
    // Deleting non-existent key should be no-op
    storage.clearDirty();
    try storage.delete(key);
    try testing.expect(!storage.isDirty(key));
}

test "Storage dirty keys" {
    const allocator = testing.allocator;
    var storage = Storage.init(allocator);
    defer storage.deinit();
    
    // Add multiple keys
    const key1 = B256.fromInt(1);
    const key2 = B256.fromInt(2);
    const key3 = B256.fromInt(3);
    
    try storage.set(key1, B256.fromInt(100));
    try storage.set(key2, B256.fromInt(200));
    try storage.set(key3, B256.fromInt(300));
    
    // All keys should be dirty
    try testing.expect(storage.isDirty(key1));
    try testing.expect(storage.isDirty(key2));
    try testing.expect(storage.isDirty(key3));
    
    // Get dirty keys
    const dirty_keys = try storage.getDirtyKeys();
    defer allocator.free(dirty_keys);
    
    try testing.expectEqual(@as(usize, 3), dirty_keys.len);
    
    // Clear dirty tracking
    storage.clearDirty();
    try testing.expect(!storage.isDirty(key1));
    try testing.expect(!storage.isDirty(key2));
    try testing.expect(!storage.isDirty(key3));
    
    const empty_dirty = try storage.getDirtyKeys();
    defer allocator.free(empty_dirty);
    try testing.expectEqual(@as(usize, 0), empty_dirty.len);
}

test "Storage clone" {
    const allocator = testing.allocator;
    var storage = Storage.init(allocator);
    defer storage.deinit();
    
    // Add data to storage
    try storage.set(B256.fromInt(1), B256.fromInt(100));
    try storage.set(B256.fromInt(2), B256.fromInt(200));
    
    // Clone the storage
    var cloned = try storage.clone();
    defer cloned.deinit();
    
    // Verify clone has same data
    try testing.expectEqual(storage.len(), cloned.len());
    try testing.expect(B256.equal(B256.fromInt(100), cloned.get(B256.fromInt(1))));
    try testing.expect(B256.equal(B256.fromInt(200), cloned.get(B256.fromInt(2))));
    
    // Verify dirty keys were copied
    try testing.expect(cloned.isDirty(B256.fromInt(1)));
    try testing.expect(cloned.isDirty(B256.fromInt(2)));
    
    // Verify clones are independent
    try storage.set(B256.fromInt(3), B256.fromInt(300));
    try testing.expect(!cloned.contains(B256.fromInt(3)));
    try testing.expectEqual(@as(usize, 3), storage.len());
    try testing.expectEqual(@as(usize, 2), cloned.len());
}