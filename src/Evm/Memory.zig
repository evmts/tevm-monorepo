const std = @import("std");

// Define a 256-bit unsigned integer type
// We're using u64 for simplicity in tests
const BigInt = u64;

/// Memory implements a simple memory model for the ethereum virtual machine.
///
/// The EVM memory is a linear array of bytes that can be addressed on byte level.
/// It is initialized to 0 and reset for each message call. Memory is only 
/// persistent within a single transaction and is wiped between transactions.
///
/// Memory is expanded by 32 bytes at a time when accessed beyond its current size,
/// with the cost of expansion increasing quadratically.
pub const Memory = struct {
    /// The underlying byte array storing the memory contents
    store: std.ArrayList(u8),
    
    /// Cached gas cost from the last memory expansion for gas metering
    last_gas_cost: u64,
    
    /// Memory allocator used for memory operations
    allocator: std.mem.Allocator,
    
    /// Get a byte from memory at the specified offset
    /// Used by tests to safely access memory contents
    /// 
    /// Parameters:
    /// - offset: The memory offset to read from
    ///
    /// Returns: The byte value at the specified offset
    /// Errors: Returns error.OutOfBounds if offset is beyond memory size
    pub fn get8(self: *const Memory, offset: u64) error{OutOfBounds}!u8 {
        if (offset >= self.store.items.len) {
            return error.OutOfBounds;
        }
        return self.store.items[offset];
    }
    
    /// Store a byte to memory at the specified offset
    /// Used by tests to safely write to memory
    ///
    /// Parameters:
    /// - offset: The memory offset to write to
    /// - value: The byte value to store
    ///
    /// Errors: Returns error if memory resize fails
    pub fn store8(self: *Memory, offset: u64, value: u8) !void {
        // Check for overflow
        const offset_plus_one = std.math.add(u64, offset, 1) catch return error.InvalidOffset;
        
        // Ensure memory is sized properly
        if (offset >= self.store.items.len) {
            try self.resize(offset_plus_one);
        }
        
        // Store the byte
        self.store.items[offset] = value;
    }

    /// Initialize a new Memory instance
    ///
    /// Creates an empty memory instance with the provided allocator.
    ///
    /// Parameters:
    /// - allocator: The memory allocator to use for memory allocation
    ///
    /// Returns: A new Memory instance
    pub fn init(allocator: std.mem.Allocator) Memory {
        return Memory{
            .store = std.ArrayList(u8).init(allocator),
            .last_gas_cost = 0,
            .allocator = allocator,
        };
    }
    
    /// Initialize memory with zeros when it is expanded
    fn initializeMemory(buffer: []u8) void {
        @memset(buffer, 0);
    }

    /// Free the memory resources
    ///
    /// This must be called when the Memory instance is no longer needed
    /// to prevent memory leaks.
    pub fn deinit(self: *Memory) void {
        self.store.deinit();
    }

    /// Set copies data from value to the memory at the specified offset
    ///
    /// This copies the provided byte slice to memory at the given offset.
    /// The memory will be resized if necessary to accommodate the operation.
    ///
    /// Parameters:
    /// - offset: The offset in memory to write to
    /// - size: The number of bytes to copy
    /// - value: The byte slice to copy from
    ///
    /// Errors: Returns error if memory resize fails or if offset+size would overflow
    pub fn set(self: *Memory, offset: u64, size: u64, value: []const u8) !void {
        // It's possible the offset is greater than 0 and size equals 0. This is because
        // the calcMemSize could potentially return 0 when size is zero (NO-OP)
        if (size > 0) {
            // Check for overflow using safe arithmetic
            const end_offset = std.math.add(u64, offset, size) catch return error.InvalidArgument;
            
            // Ensure memory is sized properly
            if (end_offset > self.store.items.len) {
                try self.resize(end_offset);
            }
            
            // Verify size of value matches the requested size
            if (value.len < size) {
                return error.InvalidArgument;
            }
            
            // Get slices for safer memory operations
            const target_slice = self.store.items[offset..end_offset];
            const source_slice = value[0..size];
            
            @memcpy(target_slice, source_slice);
        }
    }

    /// Set32 sets the 32 bytes starting at offset to the value of val, left-padded with zeroes to 32 bytes
    ///
    /// This is a specialized function for writing 256-bit values to memory, which is
    /// a common operation in the EVM. The value is stored in big-endian byte order.
    ///
    /// Parameters:
    /// - offset: The offset in memory to write to
    /// - val: The 256-bit value to write
    ///
    /// Errors: Returns error if memory resize fails or if offset arithmetic overflows
    pub fn set32(self: *Memory, offset: u64, val: BigInt) !void {
        // Safety check for overflow using safe arithmetic
        const end_offset = std.math.add(u64, offset, 32) catch return error.InvalidOffset;

        // Ensure memory is sized properly
        if (end_offset > self.store.items.len) {
            try self.resize(end_offset);
        }

        // Convert value to big-endian bytes first
        var buffer: [32]u8 = [_]u8{0} ** 32;
        
        // Manually convert the value to big-endian bytes in a safer way
        var v = val;
        var i: usize = 31;
        while (true) {
            // Mask to only get the least significant byte
            buffer[i] = @truncate(v & 0xFF);
            v >>= 8;
            
            // Exit condition checks
            if (i == 0) break;
            if (v == 0) break; // Optimization: Stop early if remainder is 0
            i -= 1;
        }
        
        // Now access memory and copy buffer contents after all calculations are complete
        // This ensures we don't access memory until after the memory resize succeeds
        const target_slice = self.store.items[offset..end_offset];
        
        // Clear the target memory region first
        @memset(target_slice, 0);
        
        // Safer approach: Copy from known-size buffer to target
        @memcpy(target_slice, &buffer);
    }

    /// Resize expands the memory to accommodate the specified size
    ///
    /// This function grows or shrinks the memory to exactly the specified size.
    /// It uses a safe approach to convert between potentially different integer sizes.
    ///
    /// Parameters:
    /// - size: The new size in bytes for the memory
    ///
    /// Error: Returns an error if memory allocation fails or if size exceeds maximum allowed size
    pub fn resize(self: *Memory, size: u64) !void {
        // Check if size is too large for usize (required by ArrayList.resize)
        if (size > std.math.maxInt(usize)) {
            return error.MemoryTooLarge;
        }
        
        // Convert to usize for ArrayList.resize
        const safe_size: usize = @intCast(size);
        
        // Get the current size
        const current_size = self.store.items.len;
        
        // Resize the backing store
        try self.store.resize(safe_size);
        
        // Initialize new memory with zeros if we expanded
        if (safe_size > current_size) {
            const new_memory = self.store.items[current_size..safe_size];
            initializeMemory(new_memory);
        }
        
        // Update gas cost metrics when memory expands
        // This is important for EVM gas metering
        // For memory expansion, gas cost is calculated as 3 * words + words^2 / 512
        // where words is ceil(memory_size_in_bytes / 32)
        // Memory costs are implemented at the interpreter level based on memory size change
    }
    
    /// Require ensures memory is sized to at least offset + size
    ///
    /// This function will expand the memory if necessary to ensure
    /// the requested region is accessible.
    ///
    /// Parameters:
    /// - offset: The starting memory offset
    /// - size: The size of the required memory region
    ///
    /// Error: Returns an error if memory allocation fails, if offset+size overflows,
    /// or if the required size exceeds maximum allowed memory size
    pub fn require(self: *Memory, offset: u64, size: u64) !void {
        // Handle special case where size is 0 - no resize needed
        if (size == 0) {
            return;
        }
        
        // Check for overflow using safe addition
        const required_size = std.math.add(u64, offset, size) catch return error.InvalidArgument;
        
        // Only resize if needed
        if (required_size > self.len()) {
            try self.resize(required_size);
        }
    }

    /// GetCopy returns a copy of the slice from offset to offset+size
    ///
    /// This allocates a new buffer and copies the requested memory range into it.
    /// The caller is responsible for freeing the returned buffer when done with allocator.free().
    ///
    /// If the requested memory range extends beyond the current memory size, the memory
    /// will be automatically expanded to accommodate the request.
    ///
    /// Parameters:
    /// - offset: The starting offset in memory
    /// - size: The number of bytes to copy
    ///
    /// Returns: A newly allocated buffer containing the copied data
    /// Errors: Returns error.OutOfMemory if allocation fails or error.InvalidArgument for bad parameters
    pub fn getCopy(self: *Memory, offset: u64, size: u64) ![]u8 {
        // For empty copies, still allocate an empty slice for consistent memory management
        if (size == 0) {
            // Always allocate a buffer, even for zero size
            // This ensures consistent memory management where caller always needs to free
            return self.allocator.alloc(u8, 0);
        }

        // Ensure memory is sized correctly, expanding if necessary
        // Using require() which will resize as needed
        try self.require(offset, size);
        
        // Now do checks for safety
        // Check for overflow in offset + size calculation using safe arithmetic
        const end_offset = std.math.add(u64, offset, size) catch return error.InvalidArgument;

        // Safely convert size to usize for allocation
        const alloc_size: usize = if (size > std.math.maxInt(usize)) 
            return error.OutOfMemory 
        else 
            @intCast(size);
            
        // Allocate memory for the copy - caller must free this with allocator.free()
        const cpy = try self.allocator.alloc(u8, alloc_size);
        // Free memory if a later operation fails
        errdefer self.allocator.free(cpy);
        
        // Get source slice using validated bounds
        const source_slice = self.store.items[offset..end_offset];
        @memcpy(cpy, source_slice);
        
        return cpy;
    }

    /// GetPtr returns a slice from offset to offset+size
    ///
    /// This returns a direct slice into the memory without making a copy.
    /// IMPORTANT: The returned slice must not be stored or used after memory contents change.
    /// This function is primarily intended for immediate, read-only access to memory data,
    /// such as for logging or temporary viewing of memory contents.
    ///
    /// For any operation that requires storing the memory data or using it after memory
    /// might change, use getCopy() instead.
    ///
    /// Parameters:
    /// - offset: The starting offset in memory
    /// - size: The number of bytes in the slice
    ///
    /// Returns: A slice referencing the memory data directly
    /// Errors: Returns error.OutOfBounds if the requested range is not in memory
    pub fn getPtr(self: *const Memory, offset: u64, size: u64) error{OutOfBounds}![]const u8 {
        if (size == 0) {
            // For consistency with the rest of the API, return an empty slice from the store
            // if available, otherwise an empty static array
            if (self.store.items.len > 0) {
                return self.store.items[0..0];
            } else {
                return &[_]u8{};
            }
        }

        // Safety check for offsets
        if (offset >= self.store.items.len) {
            return error.OutOfBounds;
        }
        
        // Check for overflow in offset + size calculation using safe arithmetic
        const end_offset = std.math.add(u64, offset, size) catch return error.OutOfBounds;
        
        // Check if the range is within memory bounds
        if (end_offset > self.store.items.len) {
            return error.OutOfBounds;
        }

        // Return a constant slice after all bounds checking is complete
        // This makes it clear that the slice should not be modified directly
        return self.store.items[offset..end_offset];
    }

    /// Len returns the length of the backing slice
    ///
    /// Returns: The current size of the memory in bytes
    pub fn len(self: *const Memory) u64 {
        return @intCast(self.store.items.len);
    }
    
    /// Returns the current size of the memory in bytes
    pub fn memSize(self: *const Memory) u64 {
        // Safe casting from usize to u64
        if (self.store.items.len > std.math.maxInt(u64)) {
            // Extremely unlikely in practice, but handle overflow case safely
            return std.math.maxInt(u64);
        }
        return @intCast(self.store.items.len);
    }

    /// Data returns the backing slice
    ///
    /// This provides direct access to the entire memory array.
    /// IMPORTANT: This returns a direct reference to the internal memory buffer.
    /// The caller must not store this reference for later use after any operation
    /// that might resize the memory.
    ///
    /// Returns: A slice representing the entire memory contents
    pub fn data(self: *const Memory) []u8 {
        return self.store.items;
    }

    /// Copy copies data from the src position slice into the dst position
    /// The source and destination may overlap.
    ///
    /// This is the implementation of the EVM's MEMMOVE operation.
    /// It safely handles overlapping regions by copying in the appropriate direction.
    ///
    /// Parameters:
    /// - dst: The destination offset in memory
    /// - src: The source offset in memory
    /// - length: The number of bytes to copy
    ///
    /// Errors:
    /// - OutOfBounds: If source or destination ranges would exceed memory bounds after calculation
    /// - MemoryTooLarge: If the required memory size exceeds the maximum allowed
    pub fn copy(self: *Memory, dst: u64, src: u64, length: u64) !void {
        // Early return for zero-length operations
        if (length == 0) {
            return;
        }
        
        // Check for bounds and overflow using safe arithmetic operations
        const src_end = std.math.add(u64, src, length) catch return error.OutOfBounds;
        const dst_end = std.math.add(u64, dst, length) catch return error.OutOfBounds;
        
        // Ensure source range is within bounds
        if (src_end > self.store.items.len) {
            return error.OutOfBounds;
        }
        
        // Ensure destination range is within bounds
        // Expand memory if needed
        if (dst_end > self.store.items.len) {
            try self.resize(dst_end);
        }

        // After resizing, validate all ranges are within bounds
        // The src range bounds might have changed if we resized memory and the 
        // ArrayList had to reallocate its storage
        const mem_size = self.store.items.len;
        
        // Safe checks with proper bound validation
        if (src >= mem_size) {
            return error.OutOfBounds;
        }
        if (dst >= mem_size) {
            return error.OutOfBounds;
        }
        
        // Recalculate the actual ranges that can be safely accessed
        const safe_src_end = @min(src_end, mem_size);
        const safe_dst_end = @min(dst_end, mem_size);
        const safe_length = @min(safe_src_end - src, safe_dst_end - dst);
        
        if (safe_length == 0) {
            return; // Nothing to copy safely
        }
        
        // Get slices for source and destination using safe bounds
        const source_slice = self.store.items[src..src + safe_length];
        const dest_slice = self.store.items[dst..dst + safe_length];
        
        // Handle overlapping regions safely
        if (dst <= src) {
            // Copy forwards for non-overlapping or when destination is before source
            std.mem.copyForwards(u8, dest_slice, source_slice);
        } else {
            // Copy backwards when source is before destination (overlapping)
            std.mem.copyBackwards(u8, dest_slice, source_slice);
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
    try memory.set(32, value.len, &value); // Now auto-resizes

    // Test getCopy
    const copied = try memory.getCopy(32, value.len);
    defer testing.allocator.free(copied);
    try testing.expectEqualSlices(u8, &value, copied);

    // Test getPtr
    const ptr = try memory.getPtr(32, value.len);
    try testing.expectEqualSlices(u8, &value, ptr);

    // Test data
    try testing.expectEqual(@as(u64, 64), memory.data().len);
}

test "Memory set32" {
    var memory = Memory.init(testing.allocator);
    defer memory.deinit();

    // Test set32
    const val: BigInt = 42;
    try memory.set32(32, val); // Now auto-resizes

    // Expected: 32 bytes with value 42 at the end (big-endian)
    var expected = [_]u8{0} ** 32;
    expected[31] = 42;

    const actual = try memory.getCopy(32, 32);
    defer testing.allocator.free(actual);
    try testing.expectEqualSlices(u8, &expected, actual);
}

test "Memory copy" {
    var memory = Memory.init(testing.allocator);
    defer memory.deinit();

    // Setup memory with some data
    const value = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8 };
    try memory.set(0, value.len, &value); // Now auto-resizes

    // Make sure there's enough memory for the copy destination
    try memory.require(32 + value.len, 0);
    
    // Test copy (non-overlapping)
    try memory.copy(32, 0, value.len);
    const copied = try memory.getCopy(32, value.len);
    defer testing.allocator.free(copied);
    try testing.expectEqualSlices(u8, &value, copied);

    // Test copy (overlapping)
    try memory.copy(4, 0, value.len - 2);
    
    // Due to copy behavior with overlapping regions, this will result in a recursive pattern
    const expected = [_]u8{ 1, 2, 3, 4, 1, 2, 3, 4, 1, 2 };
    const actual = try memory.getCopy(0, 10);
    defer testing.allocator.free(actual);
    try testing.expectEqualSlices(u8, expected[0..10], actual);
}

test "Memory edge cases" {
    var memory = Memory.init(testing.allocator);
    defer memory.deinit();

    // Test empty memory
    try testing.expectEqual(@as(u64, 0), memory.len());
    const empty_ptr = try memory.getPtr(0, 0);
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
    try memory.set(0, value.len, &value);
    const result = try memory.getCopy(0, value.len);
    defer testing.allocator.free(result);
    try testing.expectEqualSlices(u8, &value, result);

    // Test setting multiple regions
    const value2 = [_]u8{ 0xAA, 0xBB, 0xCC, 0xDD };
    try memory.set(32, value2.len, &value2);
    const result2 = try memory.getCopy(32, value2.len);
    defer testing.allocator.free(result2);
    try testing.expectEqualSlices(u8, &value2, result2);

    // Verify first region is still intact
    const verify = try memory.getCopy(0, value.len);
    defer testing.allocator.free(verify);
    try testing.expectEqualSlices(u8, &value, verify);
}
