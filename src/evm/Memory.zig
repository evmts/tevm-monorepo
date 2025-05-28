const std = @import("std");

pub const MemoryError = error{
    OutOfMemory,
    InvalidOffset,
    InvalidSize,
    MemoryLimitExceeded,
};

/// EVM Memory implementation optimized for word-aligned access and efficient resizing.
///
/// The EVM memory is a linear byte array that can be addressed at byte level.
/// It is initialized to zero and reset for each message call. Memory is expanded
/// by word (32-byte) boundaries when accessed beyond its current size.
///
/// This implementation follows the design patterns from revm and evmone:
/// - 4KB initial capacity to reduce early allocations (OS page size)
/// - 2x growth strategy for efficient expansion
/// - Word-aligned operations for common EVM patterns
/// - Zero-initialization on expansion for security
/// - Optional memory limit enforcement
pub const Memory = struct {
    buffer: std.ArrayList(u8),
    memory_limit: u64,

    /// Initialize with default 4KB capacity
    pub fn init(allocator: std.mem.Allocator) !Memory {
        return initWithCapacity(allocator, 4 * 1024);
    }

    /// Initialize with custom capacity
    pub fn initWithCapacity(allocator: std.mem.Allocator, capacity: usize) !Memory {
        var buffer = std.ArrayList(u8).init(allocator);
        errdefer buffer.deinit();

        try buffer.ensureTotalCapacity(capacity);

        return Memory{
            .buffer = buffer,
            .memory_limit = std.math.maxInt(u64),
        };
    }

    /// Initialize with memory limit
    pub fn initWithLimit(allocator: std.mem.Allocator, memory_limit: u64) !Memory {
        var mem = try init(allocator);
        mem.memory_limit = memory_limit;
        return mem;
    }

    /// Clean up
    pub fn deinit(self: *Memory) void {
        self.buffer.deinit();
    }

    /// Get current memory size in bytes
    pub fn size(self: *const Memory) usize {
        return self.buffer.items.len;
    }

    /// Check if memory is empty
    pub fn isEmpty(self: *const Memory) bool {
        return self.buffer.items.len == 0;
    }

    /// Resize memory to new_size bytes (zero-fills new bytes)
    /// Returns error if new_size exceeds memory_limit
    pub fn resize(self: *Memory, new_size: usize) MemoryError!void {
        if (new_size > self.memory_limit) {
            return MemoryError.MemoryLimitExceeded;
        }

        const current_size = self.buffer.items.len;
        if (new_size <= current_size) {
            // Only shrink, don't grow
            try self.buffer.resize(new_size);
            return;
        }

        // Grow with 2x strategy
        var new_capacity = self.buffer.capacity;
        while (new_capacity < new_size) {
            new_capacity *= 2;
        }

        try self.buffer.ensureTotalCapacity(new_capacity);
        const old_len = self.buffer.items.len;
        try self.buffer.resize(new_size);

        // Zero-initialize new memory
        @memset(self.buffer.items[old_len..new_size], 0);
    }

    /// Ensure memory is at least of given size (for gas calculation)
    /// Returns the number of new words allocated (for gas cost)
    pub fn ensureCapacity(self: *Memory, min_size: usize) MemoryError!u64 {
        if (min_size > self.memory_limit) {
            return MemoryError.MemoryLimitExceeded;
        }

        const current_words = calculateNumWords(self.buffer.items.len);

        if (min_size <= self.buffer.items.len) {
            return 0; // No expansion needed
        }

        try self.resize(min_size);

        const new_words = calculateNumWords(min_size);
        return new_words - current_words;
    }

    // Read operations

    /// Read a single byte at offset
    pub fn getByte(self: *const Memory, offset: usize) MemoryError!u8 {
        if (offset >= self.buffer.items.len) {
            return MemoryError.InvalidOffset;
        }
        return self.buffer.items[offset];
    }

    /// Read 32 bytes (word) at offset
    pub fn getWord(self: *const Memory, offset: usize) MemoryError![32]u8 {
        if (offset + 32 > self.buffer.items.len) {
            return MemoryError.InvalidOffset;
        }
        var word: [32]u8 = undefined;
        @memcpy(&word, self.buffer.items[offset .. offset + 32]);
        return word;
    }

    /// Read 32 bytes as u256 at offset
    pub fn getU256(self: *const Memory, offset: usize) MemoryError!u256 {
        const word = try self.getWord(offset);
        // Convert big-endian bytes to u256
        var value: u256 = 0;
        for (word) |byte| {
            value = (value << 8) | byte;
        }
        return value;
    }

    /// Read arbitrary slice
    pub fn getSlice(self: *const Memory, offset: usize, len: usize) MemoryError![]const u8 {
        if (len == 0) {
            return &[_]u8{};
        }

        if (offset >= self.buffer.items.len) {
            return MemoryError.InvalidOffset;
        }

        const end = std.math.add(usize, offset, len) catch return MemoryError.InvalidSize;
        if (end > self.buffer.items.len) {
            return MemoryError.InvalidOffset;
        }

        return self.buffer.items[offset..end];
    }

    // Write operations

    /// Write a single byte at offset
    pub fn setByte(self: *Memory, offset: usize, value: u8) MemoryError!void {
        if (offset >= self.buffer.items.len) {
            _ = try self.ensureCapacity(offset + 1);
        }
        self.buffer.items[offset] = value;
    }

    /// Write 32 bytes (word) at offset
    pub fn setWord(self: *Memory, offset: usize, value: [32]u8) MemoryError!void {
        const end = std.math.add(usize, offset, 32) catch return MemoryError.InvalidSize;
        if (end > self.buffer.items.len) {
            _ = try self.ensureCapacity(end);
        }
        @memcpy(self.buffer.items[offset..end], &value);
    }

    /// Write u256 as 32 bytes at offset
    pub fn setU256(self: *Memory, offset: usize, value: u256) MemoryError!void {
        var word: [32]u8 = [_]u8{0} ** 32;

        // Convert u256 to big-endian bytes
        var v = value;
        var i: usize = 31;
        while (v > 0) : (i -%= 1) {
            word[i] = @truncate(v & 0xFF);
            v >>= 8;
            if (i == 0) break;
        }

        try self.setWord(offset, word);
    }

    /// Write arbitrary data at offset
    pub fn setData(self: *Memory, offset: usize, data: []const u8) MemoryError!void {
        if (data.len == 0) {
            return;
        }

        const end = std.math.add(usize, offset, data.len) catch return MemoryError.InvalidSize;
        if (end > self.buffer.items.len) {
            _ = try self.ensureCapacity(end);
        }

        @memcpy(self.buffer.items[offset..end], data);
    }

    /// Write data with source offset and length (handles partial copies and zero-fills)
    /// Used for CALLDATACOPY, CODECOPY, etc.
    pub fn setDataBounded(self: *Memory, memory_offset: usize, data: []const u8, data_offset: usize, len: usize) MemoryError!void {
        if (len == 0) {
            return;
        }

        const end = std.math.add(usize, memory_offset, len) catch return MemoryError.InvalidSize;
        if (end > self.buffer.items.len) {
            _ = try self.ensureCapacity(end);
        }

        // If source offset is beyond data bounds, fill with zeros
        if (data_offset >= data.len) {
            @memset(self.buffer.items[memory_offset..end], 0);
            return;
        }

        // Calculate how much we can actually copy
        const data_end = @min(data_offset + len, data.len);
        const copy_len = data_end - data_offset;

        // Copy available data
        if (copy_len > 0) {
            @memcpy(self.buffer.items[memory_offset .. memory_offset + copy_len], data[data_offset..data_end]);
        }

        // Zero-fill the rest
        if (copy_len < len) {
            @memset(self.buffer.items[memory_offset + copy_len .. end], 0);
        }
    }

    /// Copy within memory (handles overlapping regions)
    /// Used for MCOPY instruction
    pub fn copy(self: *Memory, dest_offset: usize, src_offset: usize, len: usize) MemoryError!void {
        if (len == 0) {
            return;
        }

        // Check for integer overflow
        const src_end = std.math.add(usize, src_offset, len) catch return MemoryError.InvalidSize;
        const dest_end = std.math.add(usize, dest_offset, len) catch return MemoryError.InvalidSize;

        // Ensure memory is large enough
        const required_size = @max(src_end, dest_end);
        if (required_size > self.buffer.items.len) {
            _ = try self.ensureCapacity(required_size);
        }

        const src_slice = self.buffer.items[src_offset..src_end];
        const dest_slice = self.buffer.items[dest_offset..dest_end];

        // Use optimized copy functions that handle overlapping
        if (dest_offset <= src_offset) {
            std.mem.copyForwards(u8, dest_slice, src_slice);
        } else {
            std.mem.copyBackwards(u8, dest_slice, src_slice);
        }
    }

    // Unsafe operations (no bounds checking, caller ensures validity)

    /// Get raw pointer to memory at offset
    pub fn getPtrUnsafe(self: *Memory, offset: usize) [*]u8 {
        return self.buffer.items.ptr + offset;
    }

    /// Get const raw pointer to memory at offset
    pub fn getConstPtrUnsafe(self: *const Memory, offset: usize) [*]const u8 {
        return self.buffer.items.ptr + offset;
    }

    /// Set bytes without bounds checking
    pub fn setUnsafe(self: *Memory, offset: usize, data: []const u8) void {
        @memcpy(self.buffer.items[offset .. offset + data.len], data);
    }

    // Utility functions

    /// Calculate number of words (32-byte chunks) for given byte size
    pub fn numWords(len: usize) usize {
        return calculateNumWords(len);
    }

    /// Get memory as hex string (for debugging/logging)
    pub fn toHex(self: *const Memory, allocator: std.mem.Allocator) ![]u8 {
        const hex_len = self.buffer.items.len * 2;
        var hex_str = try allocator.alloc(u8, hex_len);

        for (self.buffer.items, 0..) |byte, i| {
            _ = std.fmt.bufPrint(hex_str[i * 2 .. (i + 1) * 2], "{x:0>2}", .{byte}) catch unreachable;
        }

        return hex_str;
    }

    /// Create a snapshot of current memory state
    pub fn snapshot(self: *const Memory, allocator: std.mem.Allocator) ![]u8 {
        const snap = try allocator.alloc(u8, self.buffer.items.len);
        @memcpy(snap, self.buffer.items);
        return snap;
    }

    /// Restore from snapshot
    pub fn restore(self: *Memory, snap: []const u8) MemoryError!void {
        try self.resize(snap.len);
        @memcpy(self.buffer.items, snap);
    }
};

/// Calculate number of words needed for byte length (rounds up)
pub fn calculateNumWords(len: usize) usize {
    return (len + 31) / 32;
}
