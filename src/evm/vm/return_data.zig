const std = @import("std");

/// Return data buffer for EVM call operations
/// 
/// Manages return data from CALL, DELEGATECALL, STATICCALL, and CALLCODE operations.
/// This data is accessible via RETURNDATASIZE and RETURNDATACOPY opcodes.
/// The buffer is cleared on each new call and persists for the remainder of the frame.
/// 
/// ## EIP-211: New opcodes RETURNDATASIZE and RETURNDATACOPY
/// 
/// These opcodes were introduced in the Byzantium hardfork to allow contracts
/// to access return data from external calls, enabling better error handling
/// and more sophisticated contract interactions.
/// 
/// ## Usage
/// ```zig
/// var return_data = ReturnData.init(allocator);
/// defer return_data.deinit();
/// 
/// // Set return data after a call
/// try return_data.set(output_data);
/// 
/// // Access return data
/// const size = return_data.size();
/// const data = return_data.get();
/// ```
pub const ReturnData = struct {
    /// Dynamic buffer storing the return data
    data: std.ArrayList(u8),
    
    /// Memory allocator for buffer management
    allocator: std.mem.Allocator,
    
    /// Initialize return data buffer
    /// 
    /// Creates an empty return data buffer ready for use.
    /// 
    /// @param allocator Memory allocator for buffer operations
    /// @return New ReturnData instance
    pub fn init(allocator: std.mem.Allocator) ReturnData {
        return ReturnData{
            .data = std.ArrayList(u8).init(allocator),
            .allocator = allocator,
        };
    }
    
    /// Clean up return data buffer
    /// 
    /// Releases all memory allocated by the buffer.
    /// Must be called to prevent memory leaks.
    /// 
    /// @param self The ReturnData instance to clean up
    pub fn deinit(self: *ReturnData) void {
        self.data.deinit();
    }
    
    /// Set return data from call result
    /// 
    /// Replaces current return data with new data from a call operation.
    /// This is called after each CALL, DELEGATECALL, STATICCALL, or CALLCODE.
    /// 
    /// @param self The ReturnData instance
    /// @param new_data New return data to store (may be empty)
    /// @throws OutOfMemory if buffer allocation fails
    /// 
    /// Example:
    /// ```zig
    /// // Set return data after successful call
    /// try return_data.set(call_result.output);
    /// 
    /// // Clear return data (empty slice)
    /// try return_data.set(&[_]u8{});
    /// ```
    pub fn set(self: *ReturnData, new_data: []const u8) !void {
        // Clear existing data while retaining capacity
        self.data.clearRetainingCapacity();
        
        // Append new data
        try self.data.appendSlice(new_data);
    }
    
    /// Get current return data
    /// 
    /// Returns a read-only view of the current return data.
    /// The returned slice is valid until the next set() call.
    /// 
    /// @param self The ReturnData instance
    /// @return Slice containing current return data
    /// 
    /// Example:
    /// ```zig
    /// const data = return_data.get();
    /// if (data.len > 0) {
    ///     // Process return data
    ///     std.log.debug("Return data: {}", .{data});
    /// }
    /// ```
    pub fn get(self: *const ReturnData) []const u8 {
        return self.data.items;
    }
    
    /// Get current return data size
    /// 
    /// Returns the number of bytes in the current return data buffer.
    /// This corresponds to the value returned by the RETURNDATASIZE opcode.
    /// 
    /// @param self The ReturnData instance
    /// @return Size of return data in bytes
    /// 
    /// Example:
    /// ```zig
    /// const size = return_data.size();
    /// try stack.push(size); // RETURNDATASIZE implementation
    /// ```
    pub fn size(self: *const ReturnData) usize {
        return self.data.items.len;
    }
    
    /// Copy return data to destination buffer
    /// 
    /// Copies a range of return data to the provided buffer.
    /// Used by RETURNDATACOPY opcode implementation.
    /// 
    /// @param self The ReturnData instance
    /// @param dest Destination buffer to copy to
    /// @param src_offset Offset in return data to start copying from
    /// @param copy_size Number of bytes to copy
    /// @throws InvalidReturnDataAccess if range is out of bounds
    /// 
    /// Example:
    /// ```zig
    /// // RETURNDATACOPY implementation
    /// const dest_offset = try stack.pop();
    /// const src_offset = try stack.pop(); 
    /// const copy_size = try stack.pop();
    /// 
    /// var dest_buffer = memory.slice()[dest_offset..dest_offset + copy_size];
    /// try return_data.copy_to(dest_buffer, src_offset, copy_size);
    /// ```
    pub fn copy_to(
        self: *const ReturnData,
        dest: []u8,
        src_offset: usize,
        copy_size: usize,
    ) error{InvalidReturnDataAccess}!void {
        const return_data = self.data.items;
        
        // Validate bounds
        if (src_offset + copy_size > return_data.len) {
            return error.InvalidReturnDataAccess;
        }
        
        if (copy_size > dest.len) {
            return error.InvalidReturnDataAccess;
        }
        
        // Copy data
        const source_slice = return_data[src_offset..src_offset + copy_size];
        @memcpy(dest[0..copy_size], source_slice);
    }
    
    /// Clear return data buffer
    /// 
    /// Removes all return data, setting size to 0.
    /// This is automatically called before each new call operation.
    /// 
    /// @param self The ReturnData instance
    pub fn clear(self: *ReturnData) void {
        self.data.clearRetainingCapacity();
    }
    
    /// Check if return data buffer is empty
    /// 
    /// @param self The ReturnData instance
    /// @return true if buffer contains no data
    pub fn is_empty(self: *const ReturnData) bool {
        return self.data.items.len == 0;
    }
};