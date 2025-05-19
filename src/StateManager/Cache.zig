const std = @import("std");

// Cache types (matching JS implementation)
pub const CacheType = enum {
    LRU,     // Least Recently Used eviction policy
    Ordered, // Maintains order for checkpoint/revert
};

// Generic cache implementation supporting LRU and checkpoint/revert functionality
pub fn Cache(comptime K: type, comptime V: type) type {
    return struct {
        const Self = @This();
        
        // LRU node for cache entries
        const Node = struct {
            key: K,
            value: V,
            prev: ?*Node,
            next: ?*Node,
        };
        
        // Checkpoint data structure
        const CheckpointData = struct {
            entries: std.ArrayList(struct {
                key: K,
                value: ?V,  // null means the entry was deleted
            }),
        };
        
        allocator: std.mem.Allocator,
        cacheType: CacheType,
        maxSize: usize,
        map: std.HashMap(K, *Node, struct {
            pub fn hash(context: void, key: K) u64 {
                _ = context;
                return @intCast(std.hash.Wyhash.hash(0, std.mem.asBytes(&key)));
            }
            pub fn eql(context: void, a: K, b: K) bool {
                _ = context;
                return std.meta.eql(a, b);
            }
        }, std.hash_map.default_max_load_percentage),
        checkpoints: std.ArrayList(CheckpointData),
        
        // LRU tracking
        head: ?*Node, // Most recently used
        tail: ?*Node, // Least recently used
        
        // Create a new cache
        pub fn init(allocator: std.mem.Allocator, cacheType: CacheType, maxSize: usize) Self {
            return Self{
                .allocator = allocator,
                .cacheType = cacheType,
                .maxSize = maxSize,
                .map = std.HashMap(K, *Node, struct {
                    pub fn hash(context: void, key: K) u64 {
                        _ = context;
                        return @intCast(std.hash.Wyhash.hash(0, std.mem.asBytes(&key)));
                    }
                    pub fn eql(context: void, a: K, b: K) bool {
                        _ = context;
                        return std.meta.eql(a, b);
                    }
                }, std.hash_map.default_max_load_percentage).init(allocator),
                .checkpoints = std.ArrayList(CheckpointData).init(allocator),
                .head = null,
                .tail = null,
            };
        }
        
        // Free all resources
        pub fn deinit(self: *Self) void {
            // Free all nodes
            var it = self.map.iterator();
            while (it.next()) |entry| {
                self.allocator.destroy(entry.value_ptr.*);
            }
            
            // Free map
            self.map.deinit();
            
            // Free checkpoints
            for (self.checkpoints.items) |*cp| {
                cp.entries.deinit();
            }
            self.checkpoints.deinit();
        }
        
        // Get a value from the cache
        pub fn get(self: *Self, key: K) ?V {
            const entry = self.map.get(key) orelse return null;
            
            // Move to front of LRU if using LRU cache
            if (self.cacheType == .LRU) {
                self.moveToFront(entry);
            }
            
            return entry.value;
        }
        
        // Put a value into the cache
        pub fn put(self: *Self, key: K, value: V) !void {
            // If we have active checkpoints, record the old value
            if (self.checkpoints.items.len > 0) {
                const cp = &self.checkpoints.items[self.checkpoints.items.len - 1];
                
                // Check if we already recorded this key in the current checkpoint
                var found = false;
                for (cp.entries.items) |entry| {
                    if (std.meta.eql(entry.key, key)) {
                        found = true;
                        break;
                    }
                }
                
                // If not found, record the current value before changing it
                if (!found) {
                    const oldValue = self.get(key);
                    try cp.entries.append(.{
                        .key = key,
                        .value = oldValue,
                    });
                }
            }
            
            // Update the existing entry if it exists
            if (self.map.get(key)) |existingNode| {
                existingNode.value = value;
                
                // Move to front of LRU if using LRU cache
                if (self.cacheType == .LRU) {
                    self.moveToFront(existingNode);
                }
                return;
            }
            
            // Check if we need to evict an entry
            if (self.map.count() >= self.maxSize and self.cacheType == .LRU) {
                if (self.tail) |leastUsed| {
                    _ = self.map.remove(leastUsed.key);
                    
                    // Update LRU pointers
                    self.tail = leastUsed.prev;
                    if (self.tail) |newTail| {
                        newTail.next = null;
                    } else {
                        // Cache is now empty
                        self.head = null;
                    }
                    
                    // Free the evicted node
                    self.allocator.destroy(leastUsed);
                }
            }
            
            // Create a new node
            const node = try self.allocator.create(Node);
            node.key = key;
            node.value = value;
            node.prev = null;
            node.next = null;
            
            // Add to the hash map
            try self.map.put(key, node);
            
            // Update LRU pointers if using LRU cache
            if (self.cacheType == .LRU) {
                // If this is the first entry
                if (self.head == null) {
                    self.head = node;
                    self.tail = node;
                } else {
                    // Add to the front of the list
                    node.next = self.head;
                    if (self.head) |oldHead| {
                        oldHead.prev = node;
                    }
                    self.head = node;
                }
            }
        }
        
        // Delete a value from the cache
        pub fn delete(self: *Self, key: K) void {
            // If we have active checkpoints, record the deletion
            if (self.checkpoints.items.len > 0) {
                const cp = &self.checkpoints.items[self.checkpoints.items.len - 1];
                
                // Check if we already recorded this key in the current checkpoint
                var found = false;
                for (cp.entries.items) |entry| {
                    if (std.meta.eql(entry.key, key)) {
                        found = true;
                        break;
                    }
                }
                
                // If not found, record the current value before deleting
                if (!found) {
                    const oldValue = self.get(key);
                    try cp.entries.append(.{
                        .key = key,
                        .value = oldValue,
                    });
                }
            }
            
            // Remove from the map
            const node = self.map.get(key) orelse return;
            _ = self.map.remove(key);
            
            // Update LRU pointers
            if (node.prev) |prev| {
                prev.next = node.next;
            } else if (self.head == node) {
                self.head = node.next;
            }
            
            if (node.next) |next| {
                next.prev = node.prev;
            } else if (self.tail == node) {
                self.tail = node.prev;
            }
            
            // Free the node
            self.allocator.destroy(node);
        }
        
        // Create a checkpoint
        pub fn checkpoint(self: *Self) void {
            self.checkpoints.append(CheckpointData{
                .entries = std.ArrayList(struct {
                    key: K,
                    value: ?V,
                }).init(self.allocator),
            }) catch {};
        }
        
        // Commit the latest checkpoint (discard it)
        pub fn commit(self: *Self) void {
            if (self.checkpoints.items.len == 0) {
                return;
            }
            
            const cp = self.checkpoints.pop();
            cp.entries.deinit();
        }
        
        // Revert to the latest checkpoint
        pub fn revert(self: *Self) void {
            if (self.checkpoints.items.len == 0) {
                return;
            }
            
            const cp = self.checkpoints.pop();
            
            // Apply the checkpoint changes in reverse order
            var i: usize = cp.entries.items.len;
            while (i > 0) {
                i -= 1;
                const entry = cp.entries.items[i];
                
                if (entry.value) |value| {
                    // Key existed before, restore it
                    self.put(entry.key, value) catch {};
                } else {
                    // Key didn't exist before, delete it
                    self.delete(entry.key);
                }
            }
            
            cp.entries.deinit();
        }
        
        // Clear the cache
        pub fn clear(self: *Self) void {
            // Free all nodes
            var it = self.map.iterator();
            while (it.next()) |entry| {
                self.allocator.destroy(entry.value_ptr.*);
            }
            
            // Clear the map
            self.map.clearRetainingCapacity();
            
            // Reset LRU pointers
            self.head = null;
            self.tail = null;
        }
        
        // Get the size of the cache
        pub fn size(self: *Self) usize {
            return self.map.count();
        }
        
        // Move a node to the front of the LRU list
        fn moveToFront(self: *Self, node: *Node) void {
            if (self.head == node) {
                // Already at the front
                return;
            }
            
            // Remove from current position
            if (node.prev) |prev| {
                prev.next = node.next;
            }
            
            if (node.next) |next| {
                next.prev = node.prev;
            } else if (self.tail == node) {
                // This was the tail, update tail
                self.tail = node.prev;
            }
            
            // Move to front
            node.prev = null;
            node.next = self.head;
            
            if (self.head) |head| {
                head.prev = node;
            }
            
            self.head = node;
            
            // If this is the only entry, it's also the tail
            if (self.tail == null) {
                self.tail = node;
            }
        }
    };
}

// Tests for the Cache implementation
test "Cache - basic operations" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var cache = Cache([]const u8, u32).init(allocator, .LRU, 100);
    defer cache.deinit();
    
    // Put and get
    try cache.put("key1", 42);
    try cache.put("key2", 100);
    
    try testing.expectEqual(@as(?u32, 42), cache.get("key1"));
    try testing.expectEqual(@as(?u32, 100), cache.get("key2"));
    try testing.expectEqual(@as(?u32, null), cache.get("nonexistent"));
    
    // Update
    try cache.put("key1", 43);
    try testing.expectEqual(@as(?u32, 43), cache.get("key1"));
    
    // Delete
    cache.delete("key1");
    try testing.expectEqual(@as(?u32, null), cache.get("key1"));
    try testing.expectEqual(@as(?u32, 100), cache.get("key2"));
    
    // Clear
    cache.clear();
    try testing.expectEqual(@as(?u32, null), cache.get("key2"));
    try testing.expectEqual(@as(usize, 0), cache.size());
}

test "Cache - LRU eviction" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    // Create a cache with only 2 slots
    var cache = Cache([]const u8, u32).init(allocator, .LRU, 2);
    defer cache.deinit();
    
    // Fill the cache
    try cache.put("key1", 1);
    try cache.put("key2", 2);
    try testing.expectEqual(@as(usize, 2), cache.size());
    
    // Access key1 to make it more recently used than key2
    _ = cache.get("key1");
    
    // Add a third key, which should evict key2 (least recently used)
    try cache.put("key3", 3);
    try testing.expectEqual(@as(usize, 2), cache.size());
    try testing.expectEqual(@as(?u32, 1), cache.get("key1"));
    try testing.expectEqual(@as(?u32, null), cache.get("key2")); // Evicted
    try testing.expectEqual(@as(?u32, 3), cache.get("key3"));
}

test "Cache - checkpoint and revert" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var cache = Cache([]const u8, u32).init(allocator, .LRU, 100);
    defer cache.deinit();
    
    // Initial state
    try cache.put("key1", 1);
    try cache.put("key2", 2);
    
    // Create checkpoint
    cache.checkpoint();
    
    // Modify state
    try cache.put("key1", 11);    // Modify existing
    try cache.put("key3", 3);     // Add new
    cache.delete("key2");       // Delete existing
    
    // Verify modified state
    try testing.expectEqual(@as(?u32, 11), cache.get("key1"));
    try testing.expectEqual(@as(?u32, null), cache.get("key2"));
    try testing.expectEqual(@as(?u32, 3), cache.get("key3"));
    
    // Revert checkpoint
    cache.revert();
    
    // Verify reverted state
    try testing.expectEqual(@as(?u32, 1), cache.get("key1"));   // Back to original
    try testing.expectEqual(@as(?u32, 2), cache.get("key2"));   // Restored
    try testing.expectEqual(@as(?u32, null), cache.get("key3")); // Removed
}

test "Cache - nested checkpoints" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var cache = Cache([]const u8, u32).init(allocator, .LRU, 100);
    defer cache.deinit();
    
    // Initial state
    try cache.put("key1", 1);
    
    // Checkpoint 1
    cache.checkpoint();
    try cache.put("key1", 2);
    try cache.put("key2", 2);
    
    // Checkpoint 2
    cache.checkpoint();
    try cache.put("key1", 3);
    try cache.put("key3", 3);
    
    // Verify current state
    try testing.expectEqual(@as(?u32, 3), cache.get("key1"));
    try testing.expectEqual(@as(?u32, 2), cache.get("key2"));
    try testing.expectEqual(@as(?u32, 3), cache.get("key3"));
    
    // Revert checkpoint 2
    cache.revert();
    
    // Verify state after first revert
    try testing.expectEqual(@as(?u32, 2), cache.get("key1"));
    try testing.expectEqual(@as(?u32, 2), cache.get("key2"));
    try testing.expectEqual(@as(?u32, null), cache.get("key3"));
    
    // Revert checkpoint 1
    cache.revert();
    
    // Verify state after second revert
    try testing.expectEqual(@as(?u32, 1), cache.get("key1"));
    try testing.expectEqual(@as(?u32, null), cache.get("key2"));
    try testing.expectEqual(@as(?u32, null), cache.get("key3"));
}

test "Cache - commit" {
    const testing = std.testing;
    const allocator = testing.allocator;
    
    var cache = Cache([]const u8, u32).init(allocator, .LRU, 100);
    defer cache.deinit();
    
    // Initial state
    try cache.put("key1", 1);
    
    // Checkpoint
    cache.checkpoint();
    try cache.put("key1", 2);
    try cache.put("key2", 2);
    
    // Commit checkpoint
    cache.commit();
    
    // Changes should be permanent
    try testing.expectEqual(@as(?u32, 2), cache.get("key1"));
    try testing.expectEqual(@as(?u32, 2), cache.get("key2"));
    
    // No checkpoints to revert
    cache.revert(); // Should do nothing
    
    // State should remain committed
    try testing.expectEqual(@as(?u32, 2), cache.get("key1"));
    try testing.expectEqual(@as(?u32, 2), cache.get("key2"));
}