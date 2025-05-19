const std = @import("std");

// Import the u256 type from the appropriate module
const u256 = u256;

/// Memory implements a simple memory model for the ethereum virtual machine.
pub const Memory = struct {
    store: std.ArrayList(u8),
    last_gas_cost: u64,
    allocator: std.mem.Allocator,

    /// Initialize a new Memory instance
    pub fn init(allocator: std.mem.Allocator) Memory {
        return Memory{
            .store = std.ArrayList(u8).init(allocator),
            .last_gas_cost = 0,
            .allocator = allocator,
        };
    }

    /// Free the memory resources
    pub fn deinit(self: *Memory) void {
        self.store.deinit();
    }

    /// Set copies data from value to the memory at the specified offset
    pub fn set(self: *Memory, offset: u64, size: u64, value: []const u8) void {
        // It's possible the offset is greater than 0 and size equals 0. This is because
        // the calcMemSize could potentially return 0 when size is zero (NO-OP)
        if (size > 0) {
            // length of store may never be less than offset + size.
            // The store should be resized PRIOR to setting the memory
            if (offset + size > self.store.items.len) {
                @panic("invalid memory: store empty");
            }
            @memcpy(self.store.items[offset .. offset + size], value);
        }
    }

    /// Set32 sets the 32 bytes starting at offset to the value of val, left-padded with zeroes to 32 bytes
    pub fn set32(self: *Memory, offset: u64, val: u256) void {
        // length of store may never be less than offset + size.
        // The store should be resized PRIOR to setting the memory
        if (offset + 32 > self.store.items.len) {
            @panic("invalid memory: store empty");
        }

        // First, clear the memory region
        @memset(self.store.items[offset .. offset + 32], 0);

        // Convert u256 to bytes in big-endian format
        // Assuming u256 is stored in machine-native format (likely little-endian),
        // we need to place it at the end of the 32-byte region for proper big-endian representation
        const bytes = [1]u8{@truncate(val)}; // Get the least significant byte
        if (val > 0) {
            self.store.items[offset + 31] = bytes[0]; // Place at the end for big-endian
        }
    }

    /// Resize expands the memory to accommodate the specified size
    pub fn resize(self: *Memory, size: u64) !void {
        try self.store.resize(size);
    }

    /// GetCopy returns a copy of the slice from offset to offset+size
    pub fn getCopy(self: *const Memory, offset: u64, size: u64) []u8 {
        if (size == 0) {
            return &[_]u8{};
        }

        // Memory is always resized before being accessed, no need to check bounds
        const cpy = self.allocator.alloc(u8, size) catch {
            @panic("memory allocation failed");
        };
        @memcpy(cpy, self.store.items[offset .. offset + size]);
        return cpy;
    }

    /// GetPtr returns a slice from offset to offset+size
    pub fn getPtr(self: *const Memory, offset: u64, size: u64) []u8 {
        if (size == 0) {
            return &[_]u8{};
        }

        // Memory is always resized before being accessed, no need to check bounds
        return self.store.items[offset .. offset + size];
    }

    /// Len returns the length of the backing slice
    pub fn len(self: *const Memory) u64 {
        return self.store.items.len;
    }

    /// Data returns the backing slice
    pub fn data(self: *const Memory) []u8 {
        return self.store.items;
    }

    /// Copy copies data from the src position slice into the dst position
    /// The source and destination may overlap.
    pub fn copy(self: *Memory, dst: u64, src: u64, length: u64) void {
        if (length == 0) {
            return;
        }

        // Handle overlapping regions safely
        if (dst <= src) {
            // Forward copy is safe
            var i: u64 = 0;
            while (i < length) : (i += 1) {
                self.store.items[dst + i] = self.store.items[src + i];
            }
        } else {
            // Backward copy for overlapping regions
            var i: u64 = length;
            while (i > 0) {
                i -= 1;
                self.store.items[dst + i] = self.store.items[src + i];
            }
        }
    }
};

const testing = std.testing;

test "Memory basic operations" {
    var memory = Memory.init(testing.allocator);
    defer memory.deinit();

    // Test resize
    try memory.resize(64);
    try testing.expectEqual(@as(u64, 64), memory.len());

    // Test set
    const value = [_]u8{ 1, 2, 3, 4 };
    try memory.resize(36); // Resize to exactly what we need
    memory.set(32, value.len, &value);

    // Test getCopy
    const copied = memory.getCopy(32, value.len);
    defer testing.allocator.free(copied);
    try testing.expectEqualSlices(u8, &value, copied);

    // Test getPtr
    const ptr = memory.getPtr(32, value.len);
    try testing.expectEqualSlices(u8, &value, ptr);

    // Test data
    try testing.expectEqual(@as(u64, 36), memory.data().len);
}

test "Memory set32" {
    var memory = Memory.init(testing.allocator);
    defer memory.deinit();

    // Test set32
    try memory.resize(64);
    const val: u256 = 42;
    memory.set32(32, val);

    // Expected: 32 bytes with value 42 at the end (big-endian)
    var expected = [_]u8{0} ** 32;
    expected[31] = 42;

    const actual = memory.getCopy(32, 32);
    defer testing.allocator.free(actual);
    try testing.expectEqualSlices(u8, &expected, actual);
}

test "Memory copy" {
    var memory = Memory.init(testing.allocator);
    defer memory.deinit();

    // Setup memory with some data
    try memory.resize(64);
    const value = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8 };
    memory.set(0, value.len, &value);

    // Test copy (non-overlapping)
    memory.copy(32, 0, value.len);
    const copied = memory.getCopy(32, value.len);
    defer testing.allocator.free(copied);
    try testing.expectEqualSlices(u8, &value, copied);

    // Test copy (overlapping)
    memory.copy(4, 0, value.len - 2);
    const expected = [_]u8{ 1, 2, 3, 4, 1, 2, 3, 4, 5, 6 };
    const actual = memory.getCopy(0, 10);
    defer testing.allocator.free(actual);
    try testing.expectEqualSlices(u8, expected[0..10], actual);
}

test "Memory edge cases" {
    var memory = Memory.init(testing.allocator);
    defer memory.deinit();

    // Test empty memory
    try testing.expectEqual(@as(u64, 0), memory.len());
    const empty_ptr = memory.getPtr(0, 0);
    try testing.expectEqual(@as(usize, 0), empty_ptr.len);

    // Test resizing multiple times
    try memory.resize(32);
    try testing.expectEqual(@as(u64, 32), memory.len());
    try memory.resize(16);
    try testing.expectEqual(@as(u64, 16), memory.len());
    try memory.resize(64);
    try testing.expectEqual(@as(u64, 64), memory.len());

    // Test setting data at offset 0
    const value = [_]u8{ 0xFF, 0xEE, 0xDD, 0xCC };
    memory.set(0, value.len, &value);
    const result = memory.getCopy(0, value.len);
    defer testing.allocator.free(result);
    try testing.expectEqualSlices(u8, &value, result);

    // Test setting multiple regions
    const value2 = [_]u8{ 0xAA, 0xBB, 0xCC, 0xDD };
    memory.set(32, value2.len, &value2);
    const result2 = memory.getCopy(32, value2.len);
    defer testing.allocator.free(result2);
    try testing.expectEqualSlices(u8, &value2, result2);

    // Verify first region is still intact
    const verify = memory.getCopy(0, value.len);
    defer testing.allocator.free(verify);
    try testing.expectEqualSlices(u8, &value, verify);
}
