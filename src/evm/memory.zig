const std = @import("std");
const Log = @import("log.zig");

/// Memory implementation for EVM execution contexts.
const Memory = @This();

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
root_ptr: *Memory,

pub const InitialCapacity: usize = 4 * 1024;
pub const DefaultMemoryLimit: u64 = 32 * 1024 * 1024; // 32 MB

/// Initializes the root Memory context. This instance owns the shared_buffer.
/// The caller must ensure the returned Memory is stored at a stable address
/// and call finalize_root() before use.
pub fn init(
    allocator: std.mem.Allocator,
    initial_capacity: usize,
    memory_limit: u64,
) !Memory {
    Log.debug("Memory.init: Initializing memory, initial_capacity={}, memory_limit={}", .{ initial_capacity, memory_limit });
    var shared_buffer = std.ArrayList(u8).init(allocator);
    errdefer shared_buffer.deinit();
    try shared_buffer.ensureTotalCapacity(initial_capacity);

    Log.debug("Memory.init: Memory initialized successfully", .{});
    return Memory{
        .shared_buffer = shared_buffer,
        .allocator = allocator,
        .my_checkpoint = 0,
        .memory_limit = memory_limit,
        .root_ptr = undefined,
    };
}

/// Finalizes the root Memory by setting root_ptr to itself.
/// Must be called after init() and the Memory is stored at its final address.
pub fn finalize_root(self: *Memory) void {
    Log.debug("Memory.finalize_root: Finalizing root memory pointer", .{});
    self.root_ptr = self;
}

pub fn init_default(allocator: std.mem.Allocator) !Memory {
    return try init(allocator, InitialCapacity, DefaultMemoryLimit);
}

/// Deinitializes the shared_buffer. Should ONLY be called on the root Memory instance.
pub fn deinit(self: *Memory) void {
    if (self.my_checkpoint == 0 and self.root_ptr == self) {
        Log.debug("Memory.deinit: Deinitializing root memory, buffer_size={}", .{self.shared_buffer.items.len});
        self.shared_buffer.deinit();
    } else {
        Log.debug("Memory.deinit: Skipping deinit for non-root memory context, checkpoint={}", .{self.my_checkpoint});
    }
}

/// Returns the size of the memory region visible to the current context.
pub fn context_size(self: *const Memory) usize {
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
pub fn ensure_context_capacity(self: *Memory, min_context_size: usize) MemoryError!u64 {
    const required_total_len = self.my_checkpoint + min_context_size;
    Log.debug("Memory.ensure_context_capacity: Ensuring capacity, min_context_size={}, required_total_len={}, memory_limit={}", .{ min_context_size, required_total_len, self.memory_limit });
    
    if (required_total_len > self.memory_limit) {
        Log.debug("Memory.ensure_context_capacity: Memory limit exceeded, required={}, limit={}", .{ required_total_len, self.memory_limit });
        return MemoryError.MemoryLimitExceeded;
    }

    const root = self.root_ptr;
    const old_total_buffer_len = root.shared_buffer.items.len;
    const old_total_words = calculate_num_words(old_total_buffer_len);

    if (required_total_len <= old_total_buffer_len) {
        // Buffer is already large enough
        Log.debug("Memory.ensure_context_capacity: Buffer already large enough, no expansion needed", .{});
        return 0;
    }

    // Resize the buffer
    const new_total_len = required_total_len;
    Log.debug("Memory.ensure_context_capacity: Expanding buffer from {} to {} bytes", .{ old_total_buffer_len, new_total_len });
    
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
    const words_added = if (new_total_words > old_total_words) new_total_words - old_total_words else 0;
    Log.debug("Memory.ensure_context_capacity: Expansion complete, old_words={}, new_words={}, words_added={}", .{ old_total_words, new_total_words, words_added });
    return words_added;
}

/// Read 32 bytes as u256 at context-relative offset.
pub fn get_u256(self: *const Memory, relative_offset: usize) MemoryError!u256 {
    Log.debug("Memory.get_u256: Reading u256 at relative_offset={}, context_size={}", .{ relative_offset, self.context_size() });
    if (relative_offset + 32 > self.context_size()) {
        Log.debug("Memory.get_u256: Invalid offset, offset+32={} > context_size={}", .{ relative_offset + 32, self.context_size() });
        return MemoryError.InvalidOffset;
    }
    const abs_offset = self.my_checkpoint + relative_offset;
    const bytes = self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + 32];
    
    // Convert big-endian bytes to u256
    var value: u256 = 0;
    for (bytes) |byte| {
        value = (value << 8) | byte;
    }
    Log.debug("Memory.get_u256: Read value={} from offset={}", .{ value, relative_offset });
    return value;
}

/// Read arbitrary slice of memory at context-relative offset.
pub fn get_slice(self: *const Memory, relative_offset: usize, len: usize) MemoryError![]const u8 {
    Log.debug("Memory.get_slice: Reading slice at relative_offset={}, len={}", .{ relative_offset, len });
    if (len == 0) return &[_]u8{};
    const end = std.math.add(usize, relative_offset, len) catch {
        Log.debug("Memory.get_slice: Invalid size overflow, offset={}, len={}", .{ relative_offset, len });
        return MemoryError.InvalidSize;
    };
    if (end > self.context_size()) {
        Log.debug("Memory.get_slice: Invalid offset, end={} > context_size={}", .{ end, self.context_size() });
        return MemoryError.InvalidOffset;
    }
    const abs_offset = self.my_checkpoint + relative_offset;
    const abs_end = abs_offset + len;
    Log.debug("Memory.get_slice: Returning slice [{}..{}]", .{ abs_offset, abs_end });
    return self.root_ptr.shared_buffer.items[abs_offset..abs_end];
}

/// Write arbitrary data at context-relative offset.
pub fn set_data(self: *Memory, relative_offset: usize, data: []const u8) MemoryError!void {
    Log.debug("Memory.set_data: Writing data at relative_offset={}, data_len={}", .{ relative_offset, data.len });
    if (data.len == 0) return;

    const end = std.math.add(usize, relative_offset, data.len) catch {
        Log.debug("Memory.set_data: Invalid size overflow, offset={}, data_len={}", .{ relative_offset, data.len });
        return MemoryError.InvalidSize;
    };
    _ = try self.ensure_context_capacity(end);

    const abs_offset = self.my_checkpoint + relative_offset;
    const abs_end = abs_offset + data.len;
    Log.debug("Memory.set_data: Writing to buffer [{}..{}]", .{ abs_offset, abs_end });
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset..abs_end], data);
}

/// Write data with source offset and length (handles partial copies and zero-fills).
pub fn set_data_bounded(
    self: *Memory,
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
pub fn total_size(self: *const Memory) usize {
    return self.context_size();
}

/// Get a mutable slice to the entire memory buffer (context-relative)
pub fn slice(self: *Memory) []u8 {
    const ctx_size = self.context_size();
    const abs_start = self.my_checkpoint;
    const abs_end = abs_start + ctx_size;
    return self.root_ptr.shared_buffer.items[abs_start..abs_end];
}

/// Read a single byte at context-relative offset (for test compatibility)
pub fn get_byte(self: *const Memory, relative_offset: usize) MemoryError!u8 {
    if (relative_offset >= self.context_size()) return MemoryError.InvalidOffset;
    const abs_offset = self.my_checkpoint + relative_offset;
    return self.root_ptr.shared_buffer.items[abs_offset];
}

/// Resize the context to the specified size (for test compatibility)
pub fn resize_context(self: *Memory, new_size: usize) MemoryError!void {
    _ = try self.ensure_context_capacity(new_size);
}

/// Get the memory size (alias for context_size for test compatibility)
pub fn size(self: *const Memory) usize {
    return self.context_size();
}

/// Write u256 value at context-relative offset (for test compatibility)
pub fn set_u256(self: *Memory, relative_offset: usize, value: u256) MemoryError!void {
    Log.debug("Memory.set_u256: Writing u256 value={} at relative_offset={}", .{ value, relative_offset });
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
    
    Log.debug("Memory.set_u256: Writing bytes to buffer at abs_offset={}", .{abs_offset});
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset..abs_offset + 32], &bytes);
}

