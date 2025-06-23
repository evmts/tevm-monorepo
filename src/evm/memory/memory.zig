const std = @import("std");
const Log = @import("../log.zig");
const constants = @import("constants.zig");

/// Memory implementation for EVM execution contexts.
pub const Memory = @This();

// Re-export error types and constants for convenience
pub const MemoryError = @import("errors.zig").MemoryError;
pub const InitialCapacity = constants.InitialCapacity;
pub const DefaultMemoryLimit = constants.DefaultMemoryLimit;
pub const calculate_num_words = constants.calculate_num_words;

// Core memory struct fields
shared_buffer: std.ArrayList(u8),
allocator: std.mem.Allocator,
my_checkpoint: usize,
memory_limit: u64,
root_ptr: *Memory,

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

// Import and re-export all method implementations
const context_ops = @import("context.zig");
const read_ops = @import("read.zig");
const write_ops = @import("write.zig");
const slice_ops = @import("slice.zig");

// Context operations
pub const context_size = context_ops.context_size;
pub const ensure_context_capacity = context_ops.ensure_context_capacity;
pub const resize_context = context_ops.resize_context;
pub const size = context_ops.size;
pub const total_size = context_ops.total_size;

// Read operations
pub const get_u256 = read_ops.get_u256;
pub const get_slice = read_ops.get_slice;
pub const get_byte = read_ops.get_byte;

// Write operations
pub const set_data = write_ops.set_data;
pub const set_data_bounded = write_ops.set_data_bounded;
pub const set_u256 = write_ops.set_u256;

// Slice operations
pub const slice = slice_ops.slice;
