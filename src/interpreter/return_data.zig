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
            var new_buffer = try self.allocator.alloc(u8, data.len);
            @memcpy(new_buffer, data);
            self.buffer = new_buffer;
        } else {
            self.buffer = &[_]u8{};
        }
    }
    
    /// Get a slice of return data (bounds-checked)
    /// Implements the behavior of RETURNDATACOPY
    pub fn get(self: *const ReturnData, offset: usize, size: usize) ![]const u8 {
        // Check for out-of-bounds
        if (offset + size > self.buffer.len) {
            return Error.ReturnDataOutOfBounds;
        }
        
        // Return slice of the buffer
        return self.buffer[offset..][0..size];
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

// OPCODE placeholder implementations (to be integrated with dispatch)

/// Implementation for RETURNDATASIZE opcode
pub fn returndatasize() Error!void {
    // TODO: Implement this function
    return Error.InvalidOpcode;
}

/// Implementation for RETURNDATACOPY opcode
pub fn returndatacopy() Error!void {
    // TODO: Implement this function
    return Error.InvalidOpcode;
}