const std = @import("std");

/// Storage pool for reducing allocations
const Self = @This();

access_maps: std.ArrayList(*std.AutoHashMap(u256, bool)),
storage_maps: std.ArrayList(*std.AutoHashMap(u256, u256)),
allocator: std.mem.Allocator,

pub fn init(allocator: std.mem.Allocator) Self {
    return .{
        .access_maps = std.ArrayList(*std.AutoHashMap(u256, bool)).init(allocator),
        .storage_maps = std.ArrayList(*std.AutoHashMap(u256, u256)).init(allocator),
        .allocator = allocator,
    };
}

pub fn deinit(self: *Self) void {
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

pub const BorrowAccessMapError = error{
    OutOfAllocatorMemory,
};

pub fn borrow_access_map(self: *Self) BorrowAccessMapError!*std.AutoHashMap(u256, bool) {
    if (self.access_maps.items.len > 0) {
        return self.access_maps.pop() orelse unreachable;
    }
    const map = self.allocator.create(std.AutoHashMap(u256, bool)) catch |err| {
        std.debug.print("StoragePool.borrow_access_map: allocation failed: {}\n", .{err});
        return BorrowAccessMapError.OutOfAllocatorMemory;
    };
    map.* = std.AutoHashMap(u256, bool).init(self.allocator);
    return map;
}

pub fn return_access_map(self: *Self, map: *std.AutoHashMap(u256, bool)) void {
    map.clearRetainingCapacity();
    self.access_maps.append(map) catch {};
}

pub const BorrowStorageMapError = error{
    OutOfAllocatorMemory,
};

pub fn borrow_storage_map(self: *Self) BorrowStorageMapError!*std.AutoHashMap(u256, u256) {
    if (self.storage_maps.pop()) |map| {
        return map;
    }
    const map = self.allocator.create(std.AutoHashMap(u256, u256)) catch |err| {
        std.debug.print("StoragePool.borrow_storage_map: allocation failed: {}\n", .{err});
        return BorrowStorageMapError.OutOfAllocatorMemory;
    };
    map.* = std.AutoHashMap(u256, u256).init(self.allocator);
    return map;
}

pub fn return_storage_map(self: *Self, map: *std.AutoHashMap(u256, u256)) void {
    map.clearRetainingCapacity();
    self.storage_maps.append(map) catch {};
}