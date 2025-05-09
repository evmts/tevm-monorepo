//! Return data buffer implementation for Zig EVM
//! This module implements the return data buffer for RETURNDATASIZE and RETURNDATACOPY opcodes

const std = @import("std");

/// ReturnData manages the buffer for call return data
pub const ReturnData = struct {
    /// Buffer holding the actual return data
    buffer: []u8,
    /// Allocator for the buffer
    allocator: std.mem.Allocator,

    /// Initialize a new ReturnData instance
    pub fn init(allocator: std.mem.Allocator) ReturnData {
        return ReturnData{
            .buffer = &[_]u8{},
            .allocator = allocator,
        };
    }

    /// Clean up resources
    pub fn deinit(self: *ReturnData) void {
        if (self.buffer.len > 0) {
            self.allocator.free(self.buffer);
            self.buffer = &[_]u8{};
        }
    }

    /// Set the return data to a new value
    pub fn set(self: *ReturnData, data: []const u8) !void {
        // Free old buffer if it exists
        if (self.buffer.len > 0) {
            self.allocator.free(self.buffer);
            self.buffer = &[_]u8{};
        }

        // Allocate new buffer and copy data
        if (data.len > 0) {
            var new_buffer = try self.allocator.alloc(u8, data.len);
            @memcpy(new_buffer, data);
            self.buffer = new_buffer;
        }
    }

    /// Get current buffer size
    pub fn size(self: *const ReturnData) usize {
        return self.buffer.len;
    }

    /// Copy data from the return buffer to a destination buffer
    /// Returns error if offset + size exceeds buffer size
    pub fn copy(self: *const ReturnData, dest: []u8, offset: usize, size: usize) !void {
        if (offset + size > self.buffer.len) {
            return error.ReturnDataOutOfBounds;
        }

        if (size > 0) {
            @memcpy(dest[0..size], self.buffer[offset..][0..size]);
        }
    }
};

// Tests
test "ReturnData initialization" {
    var return_data = ReturnData.init(std.testing.allocator);
    defer return_data.deinit();

    try std.testing.expectEqual(@as(usize, 0), return_data.size());
}

test "ReturnData set and copy" {
    var return_data = ReturnData.init(std.testing.allocator);
    defer return_data.deinit();

    // Set some data
    const test_data = [_]u8{ 0x01, 0x02, 0x03, 0x04 };
    try return_data.set(&test_data);

    // Check size
    try std.testing.expectEqual(@as(usize, 4), return_data.size());

    // Test copying
    var dest_buffer = [_]u8{0} ** 2;
    try return_data.copy(&dest_buffer, 1, 2);
    try std.testing.expectEqual(@as(u8, 0x02), dest_buffer[0]);
    try std.testing.expectEqual(@as(u8, 0x03), dest_buffer[1]);

    // Test out of bounds
    var large_buffer = [_]u8{0} ** 10;
    try std.testing.expectError(error.ReturnDataOutOfBounds, return_data.copy(&large_buffer, 2, 3));
}

test "ReturnData update" {
    var return_data = ReturnData.init(std.testing.allocator);
    defer return_data.deinit();

    // Set initial data
    const test_data1 = [_]u8{ 0x01, 0x02, 0x03, 0x04 };
    try return_data.set(&test_data1);
    try std.testing.expectEqual(@as(usize, 4), return_data.size());

    // Update with new data
    const test_data2 = [_]u8{ 0xAA, 0xBB, 0xCC };
    try return_data.set(&test_data2);
    try std.testing.expectEqual(@as(usize, 3), return_data.size());

    // Check data was updated
    var dest_buffer = [_]u8{0} ** 3;
    try return_data.copy(&dest_buffer, 0, 3);
    try std.testing.expectEqual(@as(u8, 0xAA), dest_buffer[0]);
    try std.testing.expectEqual(@as(u8, 0xBB), dest_buffer[1]);
    try std.testing.expectEqual(@as(u8, 0xCC), dest_buffer[2]);

    // Set to empty
    try return_data.set(&[_]u8{});
    try std.testing.expectEqual(@as(usize, 0), return_data.size());
}