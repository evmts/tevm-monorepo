const std = @import("std");

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
///
/// Memory Sizing Approaches:
/// - `resize(n)`: Sets memory to exactly n bytes (byte-exact sizing)
/// - `resizeWordAligned(n)`: Rounds up to the nearest word boundary
/// - `ensureCapacity(n)`: Ensures at least n bytes, returns new words for gas
///
/// Gas costs are always calculated based on word boundaries regardless of
/// the exact memory size, matching the behavior of production EVMs like revm.
const Self = @This();

pub const Error = error{
    OutOfMemory,
    InvalidOffset,
    InvalidSize,
    MemoryLimitExceeded,
};

/// Calculate number of words needed for byte length (rounds up)
pub fn calculateNumWords(len: usize) usize {
    return (len + 31) / 32;
}

buffer: std.ArrayList(u8),
memory_limit: u64,

/// Initialize memory with default 4KB capacity.
/// This is the recommended initialization method for most use cases.
pub fn init(allocator: std.mem.Allocator) !Self {
    return initWithCapacity(allocator, 4 * 1024);
}

/// Initialize memory with a custom initial capacity.
/// Useful when the expected memory usage is known in advance.
pub fn initWithCapacity(allocator: std.mem.Allocator, capacity: usize) !Self {
    var buffer = std.ArrayList(u8).init(allocator);
    errdefer buffer.deinit();
    try buffer.ensureTotalCapacity(capacity);
    return Self{
        .buffer = buffer,
        .memory_limit = std.math.maxInt(u64),
    };
}

/// Initialize memory with a maximum size limit.
/// Uses default 4KB initial capacity but enforces the specified limit.
pub fn initWithLimit(allocator: std.mem.Allocator, limit: u64) !Self {
    return initWithCapacityAndLimit(allocator, 4 * 1024, limit);
}

/// Initialize memory with both custom capacity and size limit.
/// Fails if the initial capacity exceeds the limit.
pub fn initWithCapacityAndLimit(allocator: std.mem.Allocator, capacity: usize, limit: u64) !Self {
    if (capacity > limit) return Error.MemoryLimitExceeded;
    var buffer = std.ArrayList(u8).init(allocator);
    errdefer buffer.deinit();
    try buffer.ensureTotalCapacity(capacity);
    return Self{
        .buffer = buffer,
        .memory_limit = limit,
    };
}

/// Free all allocated memory.
pub fn deinit(self: *Self) void {
    self.buffer.deinit();
}

/// Get the current size of memory in bytes.
/// Note: This may not be word-aligned. Use numWords() for gas calculations.
pub fn size(self: *const Self) usize {
    return self.buffer.items.len;
}

/// Check if memory is empty (size is zero).
pub fn isEmpty(self: *const Self) bool {
    return self.buffer.items.len == 0;
}

/// Resize memory to the specified byte size.
/// 
/// The EVM allows byte-level addressing, so memory size can be any value.
/// Gas costs are calculated based on word boundaries in ensureCapacity().
/// 
/// Growth strategy:
/// - Doubles capacity when growing to minimize allocations
/// - Zero-initializes new memory for security
/// - Preserves existing data when shrinking
pub fn resize(self: *Self, new_size: usize) Error!void {
    // Note: This is a cold path - memory expansion is relatively infrequent
    // @setCold is not available in Zig 0.14.0
    
    if (new_size > self.memory_limit) return Error.MemoryLimitExceeded;
    
    const old_size = self.buffer.items.len;
    
    // Shrinking: just update size
    if (new_size <= old_size) {
        self.buffer.items.len = new_size;
        return;
    }
    
    // Growing: ensure capacity with 2x strategy
    if (new_size > self.buffer.capacity) {
        var new_capacity = self.buffer.capacity;
        // Double capacity until it fits new_size
        while (new_capacity < new_size) {
            new_capacity = std.math.shl(usize, new_capacity, 1);
        }
        try self.buffer.ensureTotalCapacity(new_capacity);
    }
    
    // Expand items and zero-initialize new memory
    self.buffer.items.len = new_size;
    @memset(self.buffer.items[old_size..new_size], 0);
}

/// Resize memory to word-aligned size (alternative implementation).
/// Ensures memory size is always a multiple of 32 bytes.
pub fn resizeWordAligned(self: *Self, min_size: usize) Error!void {
    const aligned_size = calculateNumWords(min_size) * 32;
    try self.resize(aligned_size);
}

/// Ensure memory is at least of given size (for gas calculation).
/// Returns the number of new words allocated (for gas cost).
/// This is the primary method used by EVM operations to expand memory.
pub fn ensureCapacity(self: *Self, min_size: usize) Error!u64 {
    if (min_size > self.memory_limit) {
        return Error.MemoryLimitExceeded;
    }
    const current_words = calculateNumWords(self.buffer.items.len);
    if (min_size <= self.buffer.items.len) {
        return 0; // No expansion needed
    }
    try self.resize(min_size);
    const new_words = calculateNumWords(min_size);
    return new_words - current_words;
    }

/// Read a single byte at offset.
/// Returns InvalidOffset error if offset is out of bounds.
pub fn getByte(self: *const Self, offset: usize) Error!u8 {
    if (offset >= self.buffer.items.len) {
        return Error.InvalidOffset;
    }
    return self.buffer.items[offset];
    }

/// Read 32 bytes (word) at offset.
/// Returns InvalidOffset error if the range [offset, offset+32) is out of bounds.
pub fn getWord(self: *const Self, offset: usize) Error![32]u8 {
    if (offset + 32 > self.buffer.items.len) {
        return Error.InvalidOffset;
    }
    var word: [32]u8 = undefined;
    @memcpy(&word, self.buffer.items[offset .. offset + 32]);
    return word;
    }

/// Read 32 bytes as u256 at offset.
/// The bytes are interpreted as big-endian (most significant byte first).
pub fn getU256(self: *const Self, offset: usize) Error!u256 {
    const word = try self.getWord(offset);
    // Convert big-endian bytes to u256
    var value: u256 = 0;
    for (word) |byte| {
        value = (value << 8) | byte;
    }
    return value;
    }

/// Read arbitrary slice of memory.
/// Returns empty slice for zero length, InvalidOffset for out of bounds access.
pub fn getSlice(self: *const Self, offset: usize, len: usize) Error![]const u8 {
    if (len == 0) {
        return &[_]u8{};
    }
    if (offset >= self.buffer.items.len) {
        return Error.InvalidOffset;
    }
    const end = std.math.add(usize, offset, len) catch return Error.InvalidSize;
    if (end > self.buffer.items.len) {
        return Error.InvalidOffset;
    }
    return self.buffer.items[offset..end];
    }

/// Write a single byte at offset.
/// Automatically expands memory if needed.
pub fn setByte(self: *Self, offset: usize, value: u8) Error!void {
    if (offset >= self.buffer.items.len) {
        _ = try self.ensureCapacity(offset + 1);
    }
    self.buffer.items[offset] = value;
    }

/// Write 32 bytes (word) at offset.
/// Automatically expands memory if needed.
pub fn setWord(self: *Self, offset: usize, value: [32]u8) Error!void {
    const end = std.math.add(usize, offset, 32) catch return Error.InvalidSize;
    if (end > self.buffer.items.len) {
        _ = try self.ensureCapacity(end);
    }
    @memcpy(self.buffer.items[offset..end], &value);
    }

/// Write u256 as 32 bytes at offset.
/// The value is stored in big-endian format (most significant byte first).
/// Automatically expands memory if needed.
pub fn setU256(self: *Self, offset: usize, value: u256) Error!void {
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

/// Write arbitrary data at offset.
/// Automatically expands memory if needed.
/// No-op for empty data.
pub fn setData(self: *Self, offset: usize, data: []const u8) Error!void {
    if (data.len == 0) {
        return;
    }

    const end = std.math.add(usize, offset, data.len) catch return Error.InvalidSize;
    if (end > self.buffer.items.len) {
        _ = try self.ensureCapacity(end);
    }

    @memcpy(self.buffer.items[offset..end], data);
    }

/// Write data with source offset and length (handles partial copies and zero-fills).
/// Used for CALLDATACOPY, CODECOPY, EXTCODECOPY, and RETURNDATACOPY.
/// If data_offset is beyond data bounds, fills with zeros.
/// If data ends before len bytes, remaining bytes are zero-filled.
pub fn setDataBounded(self: *Self, memory_offset: usize, data: []const u8, data_offset: usize, len: usize) Error!void {
    if (len == 0) {
        return;
    }

    const end = std.math.add(usize, memory_offset, len) catch return Error.InvalidSize;
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

/// Copy within memory (handles overlapping regions correctly).
/// Used for MCOPY instruction (EIP-5656).
/// Automatically expands memory to accommodate the operation.
pub fn copy(self: *Self, dest_offset: usize, src_offset: usize, len: usize) Error!void {
    if (len == 0) {
        return;
    }

    // Check for integer overflow
    const src_end = std.math.add(usize, src_offset, len) catch return Error.InvalidSize;
    const dest_end = std.math.add(usize, dest_offset, len) catch return Error.InvalidSize;

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

/// Get raw pointer to memory at offset.
/// WARNING: No bounds checking - caller must ensure offset is valid.
pub fn getPtrUnsafe(self: *Self, offset: usize) [*]u8 {
    return self.buffer.items.ptr + offset;
    }

/// Get const raw pointer to memory at offset.
/// WARNING: No bounds checking - caller must ensure offset is valid.
pub fn getConstPtrUnsafe(self: *const Self, offset: usize) [*]const u8 {
    return self.buffer.items.ptr + offset;
    }

/// Set bytes without bounds checking.
/// WARNING: No bounds checking - caller must ensure memory has sufficient size.
pub fn setUnsafe(self: *Self, offset: usize, data: []const u8) void {
    @memcpy(self.buffer.items[offset .. offset + data.len], data);
    }

// Utility functions

/// Calculate number of words (32-byte chunks) for given byte size.
/// Rounds up to the nearest word boundary.
pub fn numWords(len: usize) usize {
    return calculateNumWords(len);
    }

/// Get memory contents as hex string (for debugging/logging).
/// Caller owns the returned memory and must free it.
pub fn toHex(self: *const Self, allocator: std.mem.Allocator) ![]u8 {
    const hex_len = self.buffer.items.len * 2;
    var hex_str = try allocator.alloc(u8, hex_len);

    for (self.buffer.items, 0..) |byte, i| {
        _ = std.fmt.bufPrint(hex_str[i * 2 .. (i + 1) * 2], "{x:0>2}", .{byte}) catch unreachable;
    }

    return hex_str;
    }

/// Create a snapshot of current memory state.
/// Caller owns the returned memory and must free it.
/// Used for state checkpointing and reverting.
pub fn snapshot(self: *const Self, allocator: std.mem.Allocator) ![]u8 {
    const snap = try allocator.alloc(u8, self.buffer.items.len);
    @memcpy(snap, self.buffer.items);
    return snap;
    }

/// Restore memory from a previously created snapshot.
/// Resizes memory to match snapshot size and copies all data.
pub fn restore(self: *Self, snap: []const u8) Error!void {
    try self.resize(snap.len);
    @memcpy(self.buffer.items, snap);
}
