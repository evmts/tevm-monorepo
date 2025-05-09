//! Return data buffer implementation for ZigEVM
//! This module implements the EVM return data buffer with support for RETURNDATASIZE and RETURNDATACOPY opcodes

const std = @import("std");
const types = @import("../util/types.zig");
const Error = types.Error;

/// ReturnData manages the return data buffer used to store data returned from EVM calls
/// This allows data to be accessed via RETURNDATASIZE and RETURNDATACOPY
pub const ReturnData = struct {
    /// Buffer holding the return data
    buffer: []u8,
    /// Allocator used for the buffer
    allocator: std.mem.Allocator,
    
    /// Initialize an empty return data buffer
    pub fn init(allocator: std.mem.Allocator) ReturnData {
        return ReturnData{
            .buffer = &[_]u8{},
            .allocator = allocator,
        };
    }
    
    /// Clean up the return data buffer
    pub fn deinit(self: *ReturnData) void {
        if (self.buffer.len > 0) {
            self.allocator.free(self.buffer);
            self.buffer = &[_]u8{};
        }
    }
    
    /// Set return data to a new value
    /// Frees any existing buffer and allocates a new one
    pub fn set(self: *ReturnData, data: []const u8) !void {
        // Free previous buffer if any
        if (self.buffer.len > 0) {
            self.allocator.free(self.buffer);
        }
        
        // Allocate and copy new buffer
        if (data.len > 0) {
            const new_buffer = try self.allocator.alloc(u8, data.len);
            @memcpy(new_buffer, data);
            self.buffer = new_buffer;
        } else {
            self.buffer = &[_]u8{};
        }
    }
    
    /// Get a slice of return data (bounds-checked)
    /// Implements the behavior of RETURNDATACOPY
    pub fn get(self: *const ReturnData, offset: usize, length: usize) ![]const u8 {
        // Check for out-of-bounds
        if (offset + length > self.buffer.len) {
            return Error.ReturnDataOutOfBounds;
        }
        
        // Return slice of the buffer
        return self.buffer[offset..][0..length];
    }
    
    /// Get the size of the return data
    /// Implements the behavior of RETURNDATASIZE
    pub fn size(self: *const ReturnData) usize {
        return self.buffer.len;
    }
    
    /// Reset the return data buffer to empty
    pub fn clear(self: *ReturnData) void {
        if (self.buffer.len > 0) {
            self.allocator.free(self.buffer);
            self.buffer = &[_]u8{};
        }
    }
};

// Tests
test "ReturnData basic operations" {
    var return_data = ReturnData.init(std.testing.allocator);
    defer return_data.deinit();
    
    // Test initial empty state
    try std.testing.expectEqual(@as(usize, 0), return_data.size());
    
    // Set some data
    const test_data = [_]u8{0x01, 0x02, 0x03, 0x04};
    try return_data.set(&test_data);
    try std.testing.expectEqual(@as(usize, 4), return_data.size());
    
    // Get a slice
    const slice = try return_data.get(1, 2);
    try std.testing.expectEqualSlices(u8, &[_]u8{0x02, 0x03}, slice);
    
    // Test out-of-bounds access
    try std.testing.expectError(Error.ReturnDataOutOfBounds, return_data.get(2, 3));
    
    // Clear the buffer
    return_data.clear();
    try std.testing.expectEqual(@as(usize, 0), return_data.size());
}

test "ReturnData update behavior" {
    var return_data = ReturnData.init(std.testing.allocator);
    defer return_data.deinit();
    
    // Set initial data
    const test_data1 = [_]u8{0x01, 0x02, 0x03};
    try return_data.set(&test_data1);
    try std.testing.expectEqual(@as(usize, 3), return_data.size());
    
    // Update with new data
    const test_data2 = [_]u8{0xA1, 0xB2, 0xC3, 0xD4};
    try return_data.set(&test_data2);
    try std.testing.expectEqual(@as(usize, 4), return_data.size());
    try std.testing.expectEqualSlices(u8, &test_data2, return_data.buffer);
    
    // Update with empty data
    try return_data.set(&[_]u8{});
    try std.testing.expectEqual(@as(usize, 0), return_data.size());
}