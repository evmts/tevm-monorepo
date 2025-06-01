const std = @import("std");

/// Memory implementation for efficient EVM call context management.
///
/// This implementation is inspired by revm's Memory design and provides:
/// - Single shared buffer for all contexts (avoids copying on calls)
/// - Checkpointing system for reverting/committing child context changes
/// - Context-relative memory operations
/// - Efficient memory expansion with gas calculation
///
/// Memory Layout Example:
/// ```
/// Shared Buffer: [----ROOT----][---CHILD1---][--GRANDCHILD--]
///                ^             ^             ^
///                |             |             |
///                0             1024          2048
///                (root         (child1       (grandchild
///                 checkpoint)   checkpoint)   checkpoint)
/// ```
const Self = @This();

pub const MemoryError = error{
    OutOfMemory, // Allocation failure for the shared buffer
    InvalidOffset, // Accessing offset outside the current context's bounds
    InvalidSize, // Requested size would cause overflow or is invalid
    MemoryLimitExceeded, // Operation would exceed the global memory_limit
    ChildContextActive, // Attempted to create a new child when one is already active
    NoChildContextToRevertOrCommit, // Attempted to revert/commit with no active child checkpoint
};

/// Calculate number of 32-byte words needed for byte length (rounds up)
pub fn calculate_num_words(len: usize) usize {
    return (len + 31) / 32;
}

/// The single, shared underlying byte buffer. Owned by the root Memory instance.
/// Child contexts will hold a pointer to this.
shared_buffer: std.ArrayList(u8),

/// Allocator used for the shared_buffer. Owned by the root Memory instance.
allocator: std.mem.Allocator,

/// The offset in shared_buffer where this Memory instance's active memory region begins.
/// For the root context, this is 0.
my_checkpoint: usize,

/// If this context is a parent and has created a child, this stores the length of
/// `shared_buffer.items` *before* the child context began its operations.
/// This is the point to revert to if the child call is rolled back.
/// `null` if no child context is currently active from this parent.
child_active_checkpoint: ?usize,

/// Maximum total size (in bytes) the *shared_buffer* can grow to.
/// This limit is shared across all contexts.
memory_limit: u64,

/// Pointer to the root Memory instance, which owns the buffer and allocator.
/// For the root instance, this points to itself.
root_ptr: *Self,

pub const InitialCapacity: usize = 4 * 1024;
pub const DefaultMemoryLimit: u64 = std.math.maxInt(u64);

// Initialization Functions

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
        .child_active_checkpoint = null,
        .memory_limit = memory_limit,
        .root_ptr = undefined, // Must be set by finalize_root()
    };
}

/// Finalizes the root Memory by setting root_ptr to itself.
/// Must be called after init() and the Memory is stored at its final address.
pub fn finalize_root(self: *Self) void {
    self.root_ptr = self;
}

/// Convenience function for default initial capacity and limit.
pub fn init_default(allocator: std.mem.Allocator) !Self {
    return try init(allocator, InitialCapacity, DefaultMemoryLimit);
}

/// Deinitializes the shared_buffer. Should ONLY be called on the root Memory instance.
/// Child contexts should not call this.
pub fn deinit(self: *Self) void {
    // Ensure this is only called on the root
    if (self.my_checkpoint == 0 and self.root_ptr == self) {
        self.shared_buffer.deinit();
    }
    // Child contexts do not own the buffer, so their deinit is a no-op regarding the buffer.
}

// Context Management Functions

/// Creates a new child Memory context.
/// The parent (self) records the current shared_buffer length as the revert point.
/// The returned child Memory operates on the same shared_buffer but with a new
/// `my_checkpoint`.
pub fn new_child_context(self: *Self) MemoryError!Self {
    if (self.child_active_checkpoint != null) {
        return MemoryError.ChildContextActive;
    }
    const new_checkpoint = self.root_ptr.shared_buffer.items.len;
    self.child_active_checkpoint = new_checkpoint;

    return Self{
        .shared_buffer = undefined, // Child does not own, will use root_ptr.shared_buffer
        .allocator = undefined, // Child does not own
        .my_checkpoint = new_checkpoint,
        .child_active_checkpoint = null,
        .memory_limit = self.memory_limit, // Inherit limit
        .root_ptr = self.root_ptr, // Point to the same root
    };
}

/// Reverts memory changes made by the most recent child context.
/// Truncates the shared_buffer to the length it had before the child context was created.
pub fn revert_child_context(self: *Self) MemoryError!void {
    const revert_to_len = self.child_active_checkpoint orelse
        return MemoryError.NoChildContextToRevertOrCommit;

    // Access shared_buffer via root_ptr to modify it
    // Ensure this doesn't shrink below the current context's my_checkpoint if called on non-root.
    if (revert_to_len < self.my_checkpoint) {
        // This should not happen if logic is correct (parent reverting its own child)
        std.debug.panic("Revert length {d} is less than parent's own checkpoint {d}", .{ revert_to_len, self.my_checkpoint });
    }

    self.root_ptr.shared_buffer.items.len = revert_to_len;
    self.child_active_checkpoint = null;
}

/// Commits memory changes made by the most recent child context.
/// Essentially makes the current shared_buffer length the new baseline.
pub fn commit_child_context(self: *Self) MemoryError!void {
    if (self.child_active_checkpoint == null) {
        return MemoryError.NoChildContextToRevertOrCommit;
    }
    // Committing means the current length of the shared buffer is accepted.
    // We just clear the checkpoint, so the new length persists.
    self.child_active_checkpoint = null;
}

// Memory Query Functions

/// Returns the size of the memory region visible to the current context.
pub fn context_size(self: *const Self) usize {
    const total_len = self.root_ptr.shared_buffer.items.len;
    if (total_len < self.my_checkpoint) {
        // This indicates a bug or inconsistent state
        std.debug.print("Warning: total_len ({d}) < my_checkpoint ({d})\n", .{ total_len, self.my_checkpoint });
        return 0;
    }
    return total_len - self.my_checkpoint;
}

/// Returns the total allocated size of the shared buffer.
pub fn total_shared_buffer_size(self: *const Self) usize {
    return self.root_ptr.shared_buffer.items.len;
}

/// Returns the capacity of the shared buffer.
pub fn total_shared_buffer_capacity(self: *const Self) usize {
    return self.root_ptr.shared_buffer.capacity;
}

pub fn get_memory_limit(self: *const Self) u64 {
    return self.memory_limit;
}

/// Sets the global memory limit. Should ideally be called on the root context.
pub fn set_memory_limit(self: *Self, new_limit: u64) void {
    self.root_ptr.memory_limit = new_limit; // All contexts see the same limit via root_ptr
}

// Memory Modification Functions

/// Resizes the current context's memory region to `new_context_size` bytes.
/// This may involve growing or shrinking the global shared_buffer.
/// If growing, new memory is zero-initialized.
/// Uses 2x growth strategy for the shared_buffer if it needs to expand.
pub fn resize_context(self: *Self, new_context_size: usize) MemoryError!void {
    // @setCold(true); // Not available in Zig 0.14.0
    const new_total_len = self.my_checkpoint + new_context_size;

    if (new_total_len > self.memory_limit) {
        return MemoryError.MemoryLimitExceeded;
    }

    const root = self.root_ptr;
    const old_total_len = root.shared_buffer.items.len;

    // Shrinking the context (or shared buffer if this makes it smaller)
    if (new_total_len <= old_total_len) {
        if (new_total_len < self.my_checkpoint) {
            // Trying to shrink context such that its end is before its start
            return MemoryError.InvalidSize;
        }
        root.shared_buffer.items.len = new_total_len;
        return;
    }

    // Growing the context (and potentially the shared buffer)
    if (new_total_len > root.shared_buffer.capacity) {
        var new_capacity = root.shared_buffer.capacity;
        if (new_capacity == 0) new_capacity = 1; // Handle initial zero capacity
        while (new_capacity < new_total_len) {
            const doubled = @mulWithOverflow(new_capacity, 2);
            if (doubled[1] != 0) {
                // Overflow occurred
                std.debug.print("Capacity calculation overflowed\n", .{});
                return MemoryError.OutOfMemory;
            }
            new_capacity = doubled[0];
        }
        // Ensure new_capacity doesn't exceed memory_limit
        if (new_capacity > self.memory_limit and self.memory_limit <= std.math.maxInt(usize)) {
            new_capacity = @intCast(self.memory_limit);
        }
        if (new_total_len > new_capacity) {
            return MemoryError.MemoryLimitExceeded;
        }
        try root.shared_buffer.ensureTotalCapacity(new_capacity);
    }

    // Set new length and zero-initialize the newly added part
    root.shared_buffer.items.len = new_total_len;
    @memset(root.shared_buffer.items[old_total_len..new_total_len], 0);
}

/// Resizes the context's memory to the smallest multiple of 32 bytes that can contain `min_logical_context_size`.
pub fn resize_context_word_aligned(self: *Self, min_logical_context_size: usize) MemoryError!void {
    const num_words_needed = calculate_num_words(min_logical_context_size);
    const actual_new_context_size = num_words_needed * 32;
    try self.resize_context(actual_new_context_size);
}

/// Ensures the current context's memory region is at least `min_context_size` bytes.
/// Returns the number of *new 32-byte words added to the shared_buffer* if it expanded.
/// This is crucial for EVM gas calculation.
pub fn ensure_context_capacity(self: *Self, min_context_size: usize) MemoryError!u64 {
    const required_total_len = self.my_checkpoint + min_context_size;
    if (required_total_len > self.memory_limit) {
        return MemoryError.MemoryLimitExceeded;
    }

    const root = self.root_ptr;
    const old_total_buffer_len = root.shared_buffer.items.len;
    const old_total_words = calculate_num_words(old_total_buffer_len);

    if (required_total_len <= old_total_buffer_len) {
        // Buffer is already large enough
        return 0;
    }

    // Call resize_context to potentially expand the shared buffer
    try self.resize_context(min_context_size);

    const new_total_buffer_len = root.shared_buffer.items.len;
    const new_total_words = calculate_num_words(new_total_buffer_len);

    if (new_total_words > old_total_words) {
        return new_total_words - old_total_words;
    } else {
        return 0;
    }
}

// Data Access Functions

/// Read a single byte at context-relative offset.
pub fn get_byte(self: *const Self, relative_offset: usize) MemoryError!u8 {
    if (relative_offset >= self.context_size()) {
        return MemoryError.InvalidOffset;
    }
    const abs_offset = self.my_checkpoint + relative_offset;
    return self.root_ptr.shared_buffer.items[abs_offset];
}

/// Write a single byte at context-relative offset.
pub fn set_byte(self: *Self, relative_offset: usize, value: u8) MemoryError!void {
    const required_context_len = relative_offset + 1;
    _ = try self.ensure_context_capacity(required_context_len);

    const abs_offset = self.my_checkpoint + relative_offset;
    self.root_ptr.shared_buffer.items[abs_offset] = value;
}

/// Read 32 bytes (word) at context-relative offset.
pub fn get_word(self: *const Self, relative_offset: usize) MemoryError![32]u8 {
    if (relative_offset + 32 > self.context_size()) {
        return MemoryError.InvalidOffset;
    }
    var word: [32]u8 = undefined;
    const abs_offset = self.my_checkpoint + relative_offset;
    @memcpy(&word, self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + 32]);
    return word;
}

/// Write 32 bytes (word) at context-relative offset.
pub fn set_word(self: *Self, relative_offset: usize, value: [32]u8) MemoryError!void {
    const required_context_len = relative_offset + 32;
    _ = try self.ensure_context_capacity(required_context_len);

    const abs_offset = self.my_checkpoint + relative_offset;
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + 32], &value);
}

/// Read 32 bytes as u256 at context-relative offset.
pub fn get_u256(self: *const Self, relative_offset: usize) MemoryError!u256 {
    const word = try self.get_word(relative_offset);
    // Convert big-endian bytes to u256
    var value: u256 = 0;
    for (word) |byte| {
        value = (value << 8) | byte;
    }
    return value;
}

/// Write u256 as 32 bytes at context-relative offset.
pub fn set_u256(self: *Self, relative_offset: usize, value: u256) MemoryError!void {
    var word: [32]u8 = [_]u8{0} ** 32;

    // Convert u256 to big-endian bytes
    var v = value;
    var i: usize = 31;
    while (v > 0) : (i -%= 1) {
        word[i] = @truncate(v & 0xFF);
        v >>= 8;
        if (i == 0) break;
    }

    try self.set_word(relative_offset, word);
}

/// Read arbitrary slice of memory at context-relative offset.
pub fn get_slice(self: *const Self, relative_offset: usize, len: usize) MemoryError![]const u8 {
    if (len == 0) {
        return &[_]u8{};
    }
    const end = std.math.add(usize, relative_offset, len) catch return MemoryError.InvalidSize;
    if (end > self.context_size()) {
        return MemoryError.InvalidOffset;
    }
    const abs_offset = self.my_checkpoint + relative_offset;
    const abs_end = abs_offset + len;
    return self.root_ptr.shared_buffer.items[abs_offset..abs_end];
}

/// Write arbitrary data at context-relative offset.
pub fn set_data(self: *Self, relative_offset: usize, data: []const u8) MemoryError!void {
    if (data.len == 0) {
        return;
    }

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
    if (len == 0) {
        return;
    }

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

/// Copy within memory (handles overlapping regions correctly).
pub fn copy(self: *Self, relative_dest: usize, relative_src: usize, len: usize) MemoryError!void {
    if (len == 0) {
        return;
    }

    // Check for integer overflow
    const src_end = std.math.add(usize, relative_src, len) catch return MemoryError.InvalidSize;
    const dest_end = std.math.add(usize, relative_dest, len) catch return MemoryError.InvalidSize;

    // Ensure memory is large enough
    const required_size = @max(src_end, dest_end);
    _ = try self.ensure_context_capacity(required_size);

    const abs_src = self.my_checkpoint + relative_src;
    const abs_dest = self.my_checkpoint + relative_dest;
    const abs_src_end = abs_src + len;
    const abs_dest_end = abs_dest + len;

    const src_slice = self.root_ptr.shared_buffer.items[abs_src..abs_src_end];
    const dest_slice = self.root_ptr.shared_buffer.items[abs_dest..abs_dest_end];

    // Use optimized copy functions that handle overlapping
    if (abs_dest <= abs_src) {
        std.mem.copyForwards(u8, dest_slice, src_slice);
    } else {
        std.mem.copyBackwards(u8, dest_slice, src_slice);
    }
}

// Unsafe Operations

/// Get raw pointer to memory at context-relative offset.
/// WARNING: No bounds checking - caller must ensure offset is valid.
pub fn get_ptr_unsafe(self: *Self, relative_offset: usize) [*]u8 {
    @setRuntimeSafety(false);
    return self.root_ptr.shared_buffer.items.ptr + self.my_checkpoint + relative_offset;
}

/// Get const raw pointer to memory at context-relative offset.
/// WARNING: No bounds checking - caller must ensure offset is valid.
pub fn get_const_ptr_unsafe(self: *const Self, relative_offset: usize) [*]const u8 {
    @setRuntimeSafety(false);
    return self.root_ptr.shared_buffer.items.ptr + self.my_checkpoint + relative_offset;
}

/// Set bytes without bounds checking.
/// WARNING: No bounds checking - caller must ensure memory has sufficient size.
pub fn set_unsafe(self: *Self, relative_offset: usize, data: []const u8) void {
    @setRuntimeSafety(false);
    const abs_offset = self.my_checkpoint + relative_offset;
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + data.len], data);
}

// Utility Functions

/// Returns a hex string representation of the *current context's memory*.
pub fn to_hex(self: *const Self, output_allocator: std.mem.Allocator) MemoryError![]u8 {
    const ctx_slice = self.context_slice() catch return MemoryError.InvalidOffset;
    const hex_len = ctx_slice.len * 2;
    if (hex_len == 0) return output_allocator.alloc(u8, 0) catch return MemoryError.OutOfMemory;

    const hex_str = output_allocator.alloc(u8, hex_len) catch return MemoryError.OutOfMemory;
    for (ctx_slice, 0..) |byte, i| {
        _ = std.fmt.bufPrint(hex_str[i * 2 .. (i + 1) * 2], "{x:0>2}", .{byte}) catch unreachable;
    }
    return hex_str;
}

/// Creates a snapshot of the *current context's memory region*.
/// The snapshot is a copy and is independent of the Memory.
pub fn snapshot_context(self: *const Self, output_allocator: std.mem.Allocator) MemoryError![]u8 {
    const ctx_slice = self.context_slice() catch return MemoryError.InvalidOffset;
    const snap = output_allocator.alloc(u8, ctx_slice.len) catch return MemoryError.OutOfMemory;
    @memcpy(snap, ctx_slice);
    return snap;
}

/// Restores the *current context's memory region* from a snapshot.
/// This may resize the context.
pub fn restore_context(self: *Self, snapshot: []const u8) MemoryError!void {
    try self.resize_context(snapshot.len);
    const abs_offset_start = self.my_checkpoint;
    const abs_offset_end = self.my_checkpoint + snapshot.len;
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset_start..abs_offset_end], snapshot);
}

// Helper to get a slice of the current context's memory
fn context_slice(self: *const Self) MemoryError![]const u8 {
    const total_len = self.root_ptr.shared_buffer.items.len;
    if (self.my_checkpoint > total_len) return MemoryError.InvalidOffset;
    return self.root_ptr.shared_buffer.items[self.my_checkpoint..total_len];
}

// Aliases for API compatibility with existing Memory module
pub const size = context_size;
pub const is_empty = context_is_empty;

/// Check if context memory is empty.
pub fn context_is_empty(self: *const Self) bool {
    return self.context_size() == 0;
}

/// Resize memory (alias for resize_context for compatibility).
pub fn resize(self: *Self, new_size: usize) MemoryError!void {
    return self.resize_context(new_size);
}

/// Ensure capacity (alias for ensure_context_capacity for compatibility).
pub fn ensure_capacity(self: *Self, min_size: usize) MemoryError!u64 {
    return self.ensure_context_capacity(min_size);
}

/// Resize word aligned (alias for compatibility).
pub fn resize_word_aligned(self: *Self, min_size: usize) MemoryError!void {
    return self.resize_context_word_aligned(min_size);
}
