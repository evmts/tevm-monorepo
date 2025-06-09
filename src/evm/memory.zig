const std = @import("std");
const Log = @import("log.zig");

/// Memory implementation for EVM execution contexts.
const Self = @This();

pub const MemoryError = error{
    OutOfMemory,
    InvalidOffset,
    InvalidSize,
    MemoryLimitExceeded,
};

/// Calculate number of 32-byte words needed for byte length (rounds up)
pub fn calculate_num_words(len: usize) usize {
    return (len + 31) / 32;
}

shared_buffer: std.ArrayList(u8),
allocator: std.mem.Allocator,
my_checkpoint: usize,
memory_limit: u64,
root_ptr: *Self,

pub const InitialCapacity: usize = 4 * 1024;
pub const DefaultMemoryLimit: u64 = 32 * 1024 * 1024; // 32 MB

/// Initializes the root Memory context. This instance owns the shared_buffer.
/// The caller must ensure the returned Memory is stored at a stable address
/// and call finalize_root() before use.
pub fn init(
    allocator: std.mem.Allocator,
    initial_capacity: usize,
    memory_limit: u64,
) !Self {
    var shared_buffer = std.ArrayList(u8).init(allocator);
    errdefer shared_buffer.deinit();
    try shared_buffer.ensureTotalCapacity(initial_capacity);

    return Self{
        .shared_buffer = shared_buffer,
        .allocator = allocator,
        .my_checkpoint = 0,
        .memory_limit = memory_limit,
        .root_ptr = undefined,
    };
}

/// Finalizes the root Memory by setting root_ptr to itself.
/// Must be called after init() and the Memory is stored at its final address.
pub fn finalize_root(self: *Self) void {
    self.root_ptr = self;
}

pub fn init_default(allocator: std.mem.Allocator) !Self {
    return try init(allocator, InitialCapacity, DefaultMemoryLimit);
}

/// Deinitializes the shared_buffer. Should ONLY be called on the root Memory instance.
pub fn deinit(self: *Self) void {
    if (self.my_checkpoint == 0 and self.root_ptr == self) {
        self.shared_buffer.deinit();
    }
}

/// Returns the size of the memory region visible to the current context.
pub fn context_size(self: *const Self) usize {
    const total_len = self.root_ptr.shared_buffer.items.len;
    if (total_len < self.my_checkpoint) {
        // This indicates a bug or inconsistent state
        return 0;
    }
    return total_len - self.my_checkpoint;
}

/// Ensures the current context's memory region is at least `min_context_size` bytes.
/// Returns the number of *new 32-byte words added to the shared_buffer* if it expanded.
/// This is crucial for EVM gas calculation.
pub fn ensure_context_capacity(self: *Self, min_context_size: usize) MemoryError!u64 {
    const required_total_len = self.my_checkpoint + min_context_size;
    if (required_total_len > self.memory_limit) return MemoryError.MemoryLimitExceeded;

    const root = self.root_ptr;
    const old_total_buffer_len = root.shared_buffer.items.len;
    const old_total_words = calculate_num_words(old_total_buffer_len);

    if (required_total_len <= old_total_buffer_len) {
        // Buffer is already large enough
        return 0;
    }

    // Resize the buffer
    const new_total_len = required_total_len;
    
    if (new_total_len > root.shared_buffer.capacity) {
        var new_capacity = root.shared_buffer.capacity;
        if (new_capacity == 0) new_capacity = 1; // Handle initial zero capacity
        while (new_capacity < new_total_len) {
            const doubled = @mulWithOverflow(new_capacity, 2);
            if (doubled[1] != 0) {
                // Overflow occurred
                return MemoryError.OutOfMemory;
            }
            new_capacity = doubled[0];
        }
        // Ensure new_capacity doesn't exceed memory_limit
        if (new_capacity > self.memory_limit and self.memory_limit <= std.math.maxInt(usize)) {
            new_capacity = @intCast(self.memory_limit);
        }
        if (new_total_len > new_capacity) return MemoryError.MemoryLimitExceeded;
        try root.shared_buffer.ensureTotalCapacity(new_capacity);
    }

    // Set new length and zero-initialize the newly added part
    root.shared_buffer.items.len = new_total_len;
    @memset(root.shared_buffer.items[old_total_buffer_len..new_total_len], 0);

    const new_total_words = calculate_num_words(new_total_len);
    if (new_total_words > old_total_words) return new_total_words - old_total_words else return 0;
}

/// Read 32 bytes as u256 at context-relative offset.
pub fn get_u256(self: *const Self, relative_offset: usize) MemoryError!u256 {
    if (relative_offset + 32 > self.context_size()) return MemoryError.InvalidOffset;
    const abs_offset = self.my_checkpoint + relative_offset;
    const bytes = self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + 32];
    
    // Convert big-endian bytes to u256
    var value: u256 = 0;
    for (bytes) |byte| {
        value = (value << 8) | byte;
    }
    return value;
}

/// Read arbitrary slice of memory at context-relative offset.
pub fn get_slice(self: *const Self, relative_offset: usize, len: usize) MemoryError![]const u8 {
    if (len == 0) return &[_]u8{};
    const end = std.math.add(usize, relative_offset, len) catch return MemoryError.InvalidSize;
    if (end > self.context_size()) return MemoryError.InvalidOffset;
    const abs_offset = self.my_checkpoint + relative_offset;
    const abs_end = abs_offset + len;
    return self.root_ptr.shared_buffer.items[abs_offset..abs_end];
}

/// Write arbitrary data at context-relative offset.
pub fn set_data(self: *Self, relative_offset: usize, data: []const u8) MemoryError!void {
    if (data.len == 0) return;

    const end = std.math.add(usize, relative_offset, data.len) catch return MemoryError.InvalidSize;
    _ = try self.ensure_context_capacity(end);

    const abs_offset = self.my_checkpoint + relative_offset;
    const abs_end = abs_offset + data.len;
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset..abs_end], data);
}

/// Write data with source offset and length (handles partial copies and zero-fills).
pub fn set_data_bounded(
    self: *Self,
    relative_memory_offset: usize,
    data: []const u8,
    data_offset: usize,
    len: usize,
) MemoryError!void {
    if (len == 0) return;

    const end = std.math.add(usize, relative_memory_offset, len) catch return MemoryError.InvalidSize;
    _ = try self.ensure_context_capacity(end);

    const abs_offset = self.my_checkpoint + relative_memory_offset;
    const abs_end = abs_offset + len;

    // If source offset is beyond data bounds, fill with zeros
    if (data_offset >= data.len) {
        @memset(self.root_ptr.shared_buffer.items[abs_offset..abs_end], 0);
        return;
    }

    // Calculate how much we can actually copy
    const data_end = @min(data_offset + len, data.len);
    const copy_len = data_end - data_offset;

    // Copy available data
    if (copy_len > 0) {
        @memcpy(
            self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + copy_len],
            data[data_offset..data_end],
        );
    }

    // Zero-fill the rest
    if (copy_len < len) {
        @memset(self.root_ptr.shared_buffer.items[abs_offset + copy_len .. abs_end], 0);
    }
}

/// Get total size of memory (context size)
pub fn total_size(self: *const Self) usize {
    return self.context_size();
}

/// Get a mutable slice to the entire memory buffer (context-relative)
pub fn slice(self: *Self) []u8 {
    const ctx_size = self.context_size();
    const abs_start = self.my_checkpoint;
    const abs_end = abs_start + ctx_size;
    return self.root_ptr.shared_buffer.items[abs_start..abs_end];
}

/// Read a single byte at context-relative offset (for test compatibility)
pub fn get_byte(self: *const Self, relative_offset: usize) MemoryError!u8 {
    if (relative_offset >= self.context_size()) return MemoryError.InvalidOffset;
    const abs_offset = self.my_checkpoint + relative_offset;
    return self.root_ptr.shared_buffer.items[abs_offset];
}

/// Resize the context to the specified size (for test compatibility)
pub fn resize_context(self: *Self, new_size: usize) MemoryError!void {
    _ = try self.ensure_context_capacity(new_size);
}

/// Get the memory size (alias for context_size for test compatibility)
pub fn size(self: *const Self) usize {
    return self.context_size();
}

/// Write u256 value at context-relative offset (for test compatibility)
pub fn set_u256(self: *Self, relative_offset: usize, value: u256) MemoryError!void {
    _ = try self.ensure_context_capacity(relative_offset + 32);
    const abs_offset = self.my_checkpoint + relative_offset;
    
    // Convert u256 to big-endian bytes
    var bytes: [32]u8 = undefined;
    var val = value;
    var i: usize = 32;
    while (i > 0) {
        i -= 1;
        bytes[i] = @intCast(val & 0xFF);
        val >>= 8;
    }
    
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset..abs_offset + 32], &bytes);
}

