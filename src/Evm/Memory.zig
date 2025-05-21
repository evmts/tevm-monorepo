const std = @import("std");

const Allocator = std.mem.Allocator;

/// Memory implements a byte-addressable memory model for the Ethereum Virtual Machine.
///
/// The EVM memory is a linear array of bytes that can be addressed at byte level.
/// It is initialized to 0 and expanded as needed during execution.
/// Memory is only persistent within a single transaction and is wiped between transactions.
///
/// Memory is expanded by 32 bytes at a time when accessed beyond its current size,
/// with the cost of expansion increasing quadratically.
///
/// PERFORMANCE OPTIMIZATION NOTES:
/// 
/// Based on analysis of evmone and revm implementations:
/// 
/// 1. INITIAL ALLOCATION SIZE:
///    - Consider increasing initial allocation to 4KB (4096 bytes) instead of 64 bytes
///    - This matches evmone and revm and reduces early reallocations for common operations
///
/// 2. PAGE-ALIGNED GROWTH:
///    - Consider growing in multiples of 4KB (page size) for better memory efficiency
///    - Currently we double the size which is good, but aligning to page boundaries may help
///
/// 3. MEMORY SHARING (for nested calls):
///    - revm uses a sophisticated memory sharing approach with reference counting and checkpoints
///    - For nested EVM calls, consider implementing a checkpoint-based memory sharing model
///    - This would allow child execution contexts to share the parent's memory without copying
///
/// 4. 32-BYTE ALIGNMENT:
///    - evmone ensures memory size is always a multiple of 32 bytes (EVM word size)
///    - Current implementation already handles this in ensure() with rounding up to 32 bytes
pub const Memory = struct {
    const Self = @This();

    /// The allocator used for memory operations
    allocator: Allocator,
    
    /// The underlying byte array storing the memory contents
    buffer: []u8,
    
    /// The current size of memory in bytes (may be smaller than buffer capacity)
    size: usize,
    
    /// Cached gas cost from the last memory expansion for gas metering
    last_gas_cost: u64 = 0,

    /// Creates a new memory instance with the provided allocator
    pub fn create(allocator: Allocator) !Self {
        // Start with a reasonable buffer size (64 bytes)
        // OPTIMIZATION: Consider increasing to 4KB (4096 bytes) as in evmone/revm
        // This would reduce the number of early reallocations for typical EVM operations
        const buffer = try allocator.alloc(u8, 64);
        
        // Initialize buffer to zero
        for (buffer, 0..) |_, i| {
            buffer[i] = 0;
        }
        
        // OPTIMIZATION: Could use std.mem.set(u8, buffer, 0) for potential SIMD optimization
        
        return Self{
            .allocator = allocator,
            .buffer = buffer,
            .size = 0,
        };
    }

    /// Destroys the memory instance, freeing allocated memory
    pub fn destroy(self: *Self) void {
        self.allocator.free(self.buffer);
        self.buffer = &[_]u8{};
        self.size = 0;
    }

    /// Returns the current memory data as a slice
    pub fn data(self: *const Self) []u8 {
        return self.buffer[0..self.size];
    }

    /// Returns the current size of the memory in bytes
    pub fn len(self: *const Self) usize {
        return self.size;
    }

    /// Calculates the gas cost for memory expansion
    /// Returns the current gas cost after expansion
    pub fn calculateGasCost(self: *Self, new_size: usize) u64 {
        // Gas cost is calculated as:
        // 3 * words + words^2 / 512
        // where words is ceil(memory_size_in_bytes / 32)
        const new_words = (new_size + 31) / 32;
        const gas_cost: u64 = 3 * @as(u64, new_words) + (@as(u64, new_words) * @as(u64, new_words)) / 512;
        
        // Cache the gas cost for the interpreter to use
        self.last_gas_cost = gas_cost;
        
        return gas_cost;
    }

    /// Returns the last calculated gas cost
    pub fn getLastGasCost(self: *const Self) u64 {
        return self.last_gas_cost;
    }

    /// Ensures memory is large enough to accommodate the given offset + size
    /// Returns true if memory was expanded, false otherwise
    /// Also calculates gas cost if memory is expanded
    pub fn ensure(self: *Self, offset: usize, size: usize) !bool {
        // If size is 0, no memory expansion is needed
        if (size == 0) return false;
        
        // Check for overflow using checked addition
        var required_size: usize = undefined;
        required_size = offset;
        const overflow = @addWithOverflow(&required_size, size);
        if (overflow) {
            return error.MemoryOverflow;
        }
        
        // If memory is already large enough, no expansion needed
        if (required_size <= self.size) return false;
        
        // Calculate new memory size rounded up to the next word (32 bytes)
        const new_size = (required_size + 31) / 32 * 32;
        
        // Calculate gas cost for the new memory size
        _ = self.calculateGasCost(new_size);
        
        // If the buffer is not large enough, reallocate
        if (new_size > self.buffer.len) {
            // Double the buffer size until it's large enough
            var new_capacity = self.buffer.len;
            while (new_capacity < new_size) {
                new_capacity *= 2;
            }
            
            // OPTIMIZATION: Consider page-aligned growth
            // In evmone, if doubling is not enough, they round up to multiple of page_size (4KB)
            // const page_size = 4096;
            // new_capacity = ((new_size + (page_size - 1)) / page_size) * page_size;
            
            // Reallocate the buffer
            const new_buffer = try self.allocator.realloc(self.buffer, new_capacity);
            
            // Zero out the newly allocated memory
            for (self.buffer.len..new_capacity) |i| {
                new_buffer[i] = 0;
            }
            // OPTIMIZATION: Could use std.mem.set(u8, new_buffer[self.buffer.len..], 0)
            
            self.buffer = new_buffer;
        }
        
        // Update the memory size
        self.size = new_size;
        
        return true;
    }

    /// Stores a value at the given offset
    /// Expands memory if necessary
    pub fn store(self: *Self, offset: usize, value: []const u8) !void {
        if (value.len == 0) return;
        
        // Ensure memory is large enough
        try self.ensure(offset, value.len);
        
        // Copy data using std.mem.copy for efficiency
        std.mem.copy(u8, self.buffer[offset..offset + value.len], value);
    }
    
    /// Stores a single byte at the given offset
    /// Used by MSTORE8 operation
    pub fn store8(self: *Self, offset: usize, value: u8) !void {
        // Ensure memory is large enough
        try self.ensure(offset, 1);
        
        // Store the byte
        self.buffer[offset] = value;
    }
    
    /// Stores a 32-byte value at the given offset (for 256-bit values)
    /// Used by MSTORE operation
    pub fn store32(self: *Self, offset: usize, value: u256) !void {
        // Ensure memory is large enough
        try self.ensure(offset, 32);
        
        // Convert value to bytes and store in big-endian order
        var i: usize = 0;
        while (i < 32) : (i += 1) {
            // Extract each byte, starting from the most significant byte (big-endian)
            const shift = (31 - i) * 8;
            const byte_val = @as(u8, @truncate((value >> shift) & 0xFF));
            self.buffer[offset + i] = byte_val;
        }
    }

    /// Loads bytes from the given offset with the given size
    /// Expands memory if necessary
    pub fn load(self: *Self, offset: usize, size: usize) ![]u8 {
        // Ensure memory is large enough
        try self.ensure(offset, size);
        
        // Return a slice of the requested memory region
        return self.buffer[offset..offset + size];
    }
    
    /// Loads a 32-byte value from the given offset (for 256-bit values)
    /// Used by MLOAD operation
    pub fn load32(self: *Self, offset: usize) !u256 {
        // Ensure memory is large enough
        try self.ensure(offset, 32);
        
        // Convert bytes to a 256-bit value in big-endian order
        var result: u256 = 0;
        var i: usize = 0;
        while (i < 32) : (i += 1) {
            // Shift the result left by 8 bits and add the next byte
            result = (result << 8) | @as(u256, self.buffer[offset + i]);
        }
        
        return result;
    }
    
    /// Returns a copy of the memory region from offset to offset+size
    /// The caller is responsible for freeing the returned memory
    pub fn getCopy(self: *Self, offset: usize, size: usize) ![]u8 {
        // Handle empty copy case
        if (size == 0) {
            return self.allocator.alloc(u8, 0);
        }
        
        // Ensure memory is large enough
        try self.ensure(offset, size);
        
        // Allocate a new buffer for the copy
        const result_copy = try self.allocator.alloc(u8, size);
        errdefer self.allocator.free(result_copy);
        
        // Copy the data using std.mem.copy for efficiency
        std.mem.copy(u8, result_copy, self.buffer[offset..offset + size]);
        
        return result_copy;
    }
    
    /// Copies memory from source to destination within the same memory
    /// Handles overlapping regions correctly (like memmove)
    /// Used by MCOPY operation
    ///
    /// OPTIMIZATION NOTE: For nested EVM calls, revm uses a checkpoint system
    /// instead of copying memory between parent and child contexts.
    /// Consider implementing a similar approach if supporting nested calls:
    /// - Track a "checkpoint" offset for each call frame
    /// - Use reference counting to share the underlying buffer
    /// - This avoids copying memory between parent and child contexts
    pub fn copy(self: *Self, dst: usize, src: usize, length: usize) !void {
        // Early return for zero-length copy
        if (length == 0) return;
        
        // Check for overflow in source end calculation
        var src_end: usize = undefined;
        src_end = src;
        const src_overflow = @addWithOverflow(&src_end, length);
        if (src_overflow) {
            return error.MemoryOverflow;
        }
        
        // Check for overflow in destination end calculation
        var dst_end: usize = undefined;
        dst_end = dst;
        const dst_overflow = @addWithOverflow(&dst_end, length);
        if (dst_overflow) {
            return error.MemoryOverflow;
        }
        
        // Ensure memory is large enough for both source and destination
        try self.ensure(src, length); // Ensure source range is valid
        try self.ensure(dst, length); // Ensure destination range is valid
        
        // Copy the memory, handling overlapping regions correctly
        if (dst <= src) {
            // Use std.mem.copyForwards for non-overlapping or when dst before src
            std.mem.copyForwards(u8, self.buffer[dst..dst_end], self.buffer[src..src_end]);
        } else {
            // Use std.mem.copyBackwards when src before dst (overlapping)
            std.mem.copyBackwards(u8, self.buffer[dst..dst_end], self.buffer[src..src_end]);
        }
    }
};