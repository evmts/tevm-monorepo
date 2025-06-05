const std = @import("std");
const ArenaMemory = @import("arena_memory.zig").ArenaMemory;

/// Memory V2 - Compatibility wrapper around ArenaMemory
pub const MemoryV2 = struct {
    const Self = @This();

    pub const MemoryError = ArenaMemory.MemoryError;

    /// Error union for all possible memory operation errors
    pub const MemoryOperationError = ArenaMemory.MemoryError || std.mem.Allocator.Error;

    arena: *ArenaMemory,
    owns_arena: bool,
    is_child: bool,

    pub const InitialCapacity: usize = 4 * 1024;
    pub const DefaultMemoryLimit: u64 = ArenaMemory.DefaultMemoryLimit;

    /// Initialize a new root memory context
    pub fn init(
        allocator: std.mem.Allocator,
        initial_capacity: usize,
        memory_limit: u64,
    ) MemoryOperationError!Self {
        _ = initial_capacity;

        const arena = allocator.create(ArenaMemory) catch |err| {
            std.log.debug("Failed to allocate ArenaMemory: {any}", .{err});
            return switch (err) {
                std.mem.Allocator.Error.OutOfMemory => MemoryError.OutOfMemory,
            };
        };
        errdefer allocator.destroy(arena);

        arena.* = ArenaMemory.init(allocator, memory_limit) catch |err| {
            std.log.debug("Failed to initialize ArenaMemory: {any}", .{err});
            return err;
        };

        return Self{
            .arena = arena,
            .owns_arena = true,
            .is_child = false,
        };
    }

    pub fn finalize_root(self: *Self) void {
        _ = self;
    }

    /// Convenience function for default initialization
    pub fn init_default(allocator: std.mem.Allocator) MemoryOperationError!Self {
        return init(allocator, InitialCapacity, DefaultMemoryLimit) catch |err| {
            std.log.debug("Failed to initialize default memory: {any}", .{err});
            return err;
        };
    }

    /// Deinitialize the memory
    pub fn deinit(self: *Self) void {
        if (self.owns_arena) {
            const allocator = self.arena.arena.child_allocator;
            self.arena.deinit();
            allocator.destroy(self.arena);
        }
    }

    /// Create a new child context
    pub fn new_child_context(self: *Self) MemoryError!Self {
        self.arena.push_context() catch |err| {
            std.log.debug("Failed to push arena context: {any}", .{err});
            return err;
        };
        return Self{
            .arena = self.arena,
            .owns_arena = false,
            .is_child = true,
        };
    }

    /// Revert child context changes
    pub fn revert_child_context(self: *Self) MemoryError!void {
        if (!self.is_child) {
            self.arena.pop_context() catch |err| {
                std.log.debug("Failed to pop arena context: {any}", .{err});
                return err;
            };
        }
    }

    /// Commit child context changes
    pub fn commit_child_context(self: *Self) MemoryError!void {
        if (!self.is_child) {
            self.arena.commit_context() catch |err| {
                std.log.debug("Failed to commit arena context: {any}", .{err});
                return err;
            };
        }
    }

    /// Get the current context size
    pub fn context_size(self: *const Self) usize {
        return self.arena.context_size();
    }

    /// Check if context is empty
    pub fn context_is_empty(self: *const Self) bool {
        return self.arena.context_is_empty();
    }

    /// Resize the current context
    pub fn resize_context(self: *Self, new_size: usize) MemoryError!void {
        self.arena.resize_context(new_size) catch |err| {
            std.log.debug("Failed to resize arena context to {d}: {any}", .{ new_size, err });
            return err;
        };
    }

    /// Resize to word-aligned size
    pub fn resize_context_word_aligned(self: *Self, min_size: usize) MemoryError!void {
        const num_words = calculate_num_words(min_size);
        const actual_size = num_words * 32;
        self.arena.resize_context(actual_size) catch |err| {
            std.log.debug("Failed to resize arena context to word-aligned size {d}: {any}", .{ actual_size, err });
            return err;
        };
    }

    /// Ensure capacity and return new words added
    pub fn ensure_context_capacity(self: *Self, min_size: usize) MemoryError!u64 {
        return self.arena.ensure_context_capacity(min_size) catch |err| {
            std.log.debug("Failed to ensure arena context capacity {d}: {any}", .{ min_size, err });
            return err;
        };
    }

    // Data access methods - delegate to arena

    pub fn get_byte(self: *const Self, offset: usize) MemoryError!u8 {
        return self.arena.get_byte(offset) catch |err| {
            std.log.debug("Failed to get byte at offset {d}: {any}", .{ offset, err });
            return err;
        };
    }

    pub fn set_byte(self: *Self, offset: usize, value: u8) MemoryError!void {
        self.arena.set_byte(offset, value) catch |err| {
            std.log.debug("Failed to set byte at offset {d} to {d}: {any}", .{ offset, value, err });
            return err;
        };
    }

    pub fn get_word(self: *const Self, offset: usize) MemoryError![32]u8 {
        return self.arena.get_word(offset) catch |err| {
            std.log.debug("Failed to get word at offset {d}: {any}", .{ offset, err });
            return err;
        };
    }

    pub fn set_word(self: *Self, offset: usize, value: [32]u8) MemoryError!void {
        self.arena.set_word(offset, value) catch |err| {
            std.log.debug("Failed to set word at offset {d}: {any}", .{ offset, err });
            return err;
        };
    }

    pub fn get_u256(self: *const Self, offset: usize) MemoryError!u256 {
        return self.arena.get_u256(offset) catch |err| {
            std.log.debug("Failed to get u256 at offset {d}: {any}", .{ offset, err });
            return err;
        };
    }

    pub fn set_u256(self: *Self, offset: usize, value: u256) MemoryError!void {
        self.arena.set_u256(offset, value) catch |err| {
            std.log.debug("Failed to set u256 at offset {d}: {any}", .{ offset, err });
            return err;
        };
    }

    pub fn get_slice(self: *const Self, offset: usize, len: usize) MemoryError![]const u8 {
        return self.arena.get_slice(offset, len) catch |err| {
            std.log.debug("Failed to get slice at offset {d} length {d}: {any}", .{ offset, len, err });
            return err;
        };
    }

    pub fn set_data(self: *Self, offset: usize, data: []const u8) MemoryError!void {
        self.arena.set_data(offset, data) catch |err| {
            std.log.debug("Failed to set data at offset {d} length {d}: {any}", .{ offset, data.len, err });
            return err;
        };
    }

    pub fn set_data_bounded(
        self: *Self,
        memory_offset: usize,
        data: []const u8,
        data_offset: usize,
        len: usize,
    ) MemoryError!void {
        self.arena.set_data_bounded(memory_offset, data, data_offset, len) catch |err| {
            std.log.debug("Failed to set bounded data at memory_offset {d}, data_offset {d}, len {d}: {any}", .{ memory_offset, data_offset, len, err });
            return err;
        };
    }

    pub fn copy(self: *Self, dst_offset: usize, src_offset: usize, len: usize) MemoryError!void {
        self.arena.copy(dst_offset, src_offset, len) catch |err| {
            std.log.debug("Failed to copy from {d} to {d} length {d}: {any}", .{ src_offset, dst_offset, len, err });
            return err;
        };
    }

    /// Get hex representation
    pub fn to_hex(self: *const Self, allocator: std.mem.Allocator) MemoryOperationError![]u8 {
        return self.arena.to_hex(allocator) catch |err| {
            std.log.debug("Failed to convert memory to hex: {any}", .{err});
            return switch (err) {
                MemoryError.NoActiveContext => MemoryError.NoActiveContext,
                MemoryError.InvalidOffset => MemoryError.InvalidOffset,
                MemoryError.InvalidSize => MemoryError.InvalidSize,
                MemoryError.MemoryLimitExceeded => MemoryError.MemoryLimitExceeded,
                MemoryError.OutOfMemory => MemoryError.OutOfMemory,
            };
        };
    }

    /// Calculate number of words
    pub fn calculate_num_words(len: usize) usize {
        return ArenaMemory.calculate_num_words(len);
    }

    // Compatibility methods that don't apply to ArenaMemory

    pub fn total_shared_buffer_size(self: *const Self) usize {
        _ = self;
        return 0; // Not applicable
    }

    pub fn total_shared_buffer_capacity(self: *const Self) usize {
        _ = self;
        return 0; // Not applicable
    }

    pub fn get_memory_limit(self: *const Self) u64 {
        return self.arena.memory_limit;
    }

    pub fn set_memory_limit(self: *Self, new_limit: u64) void {
        self.arena.memory_limit = new_limit;
    }

    // Snapshot methods - implement using context push/pop

    pub fn snapshot_context(self: *Self, allocator: std.mem.Allocator) std.mem.Allocator.Error![]u8 {
        _ = self;
        // For compatibility, return empty snapshot
        return allocator.alloc(u8, 0) catch |err| {
            std.log.debug("Failed to allocate memory for snapshot: {any}", .{err});
            return err;
        };
    }

    pub fn restore_context(self: *Self, snapshot: []const u8) MemoryError!void {
        _ = self;
        _ = snapshot;
        // No-op for compatibility
    }

    // Unsafe operations - implement safely

    pub fn set_unsafe(self: *Self, offset: usize, data: []const u8) void {
        self.set_data(offset, data) catch |err| {
            std.log.err("Memory operation failed in unsafe context: {any}", .{err});
            @panic("Memory operation failed");
        };
    }

    pub fn get_ptr_unsafe(self: *Self, offset: usize) [*]u8 {
        const slice = self.arena.get_slice(offset, 1) catch |err| {
            std.log.err("Invalid offset {d} in unsafe ptr access: {any}", .{ offset, err });
            @panic("Invalid offset");
        };
        return @constCast(@ptrCast(slice.ptr));
    }

    pub fn get_const_ptr_unsafe(self: *const Self, offset: usize) [*]const u8 {
        const slice = self.arena.get_slice(offset, 1) catch |err| {
            std.log.err("Invalid offset {d} in unsafe const ptr access: {any}", .{ offset, err });
            @panic("Invalid offset");
        };
        return slice.ptr;
    }
};
