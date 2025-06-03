const std = @import("std");
const ArenaMemory = @import("arena_memory.zig").ArenaMemory;

/// Memory V2 - Compatibility wrapper around ArenaMemory
pub const MemoryV2 = struct {
    const Self = @This();
    
    pub const MemoryError = ArenaMemory.MemoryError;
    
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
    ) !Self {
        _ = initial_capacity;
        
        const arena = try allocator.create(ArenaMemory);
        errdefer allocator.destroy(arena);
        
        arena.* = try ArenaMemory.init(allocator, memory_limit);
        
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
    pub fn init_default(allocator: std.mem.Allocator) !Self {
        return try init(allocator, InitialCapacity, DefaultMemoryLimit);
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
    pub fn new_child_context(self: *Self) !Self {
        try self.arena.push_context();
        return Self{
            .arena = self.arena,
            .owns_arena = false,
            .is_child = true,
        };
    }
    
    /// Revert child context changes
    pub fn revert_child_context(self: *Self) !void {
        if (!self.is_child) {
            try self.arena.pop_context();
        }
    }
    
    /// Commit child context changes
    pub fn commit_child_context(self: *Self) !void {
        if (!self.is_child) {
            try self.arena.commit_context();
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
    pub fn resize_context(self: *Self, new_size: usize) !void {
        try self.arena.resize_context(new_size);
    }
    
    /// Resize to word-aligned size
    pub fn resize_context_word_aligned(self: *Self, min_size: usize) !void {
        const num_words = calculate_num_words(min_size);
        const actual_size = num_words * 32;
        try self.arena.resize_context(actual_size);
    }
    
    /// Ensure capacity and return new words added
    pub fn ensure_context_capacity(self: *Self, min_size: usize) !u64 {
        return try self.arena.ensure_context_capacity(min_size);
    }
    
    // Data access methods - delegate to arena
    
    pub fn get_byte(self: *const Self, offset: usize) !u8 {
        return try self.arena.get_byte(offset);
    }
    
    pub fn set_byte(self: *Self, offset: usize, value: u8) !void {
        try self.arena.set_byte(offset, value);
    }
    
    pub fn get_word(self: *const Self, offset: usize) ![32]u8 {
        return try self.arena.get_word(offset);
    }
    
    pub fn set_word(self: *Self, offset: usize, value: [32]u8) !void {
        try self.arena.set_word(offset, value);
    }
    
    pub fn get_u256(self: *const Self, offset: usize) !u256 {
        return try self.arena.get_u256(offset);
    }
    
    pub fn set_u256(self: *Self, offset: usize, value: u256) !void {
        try self.arena.set_u256(offset, value);
    }
    
    pub fn get_slice(self: *const Self, offset: usize, len: usize) ![]const u8 {
        return try self.arena.get_slice(offset, len);
    }
    
    pub fn set_data(self: *Self, offset: usize, data: []const u8) !void {
        try self.arena.set_data(offset, data);
    }
    
    pub fn set_data_bounded(
        self: *Self,
        memory_offset: usize,
        data: []const u8,
        data_offset: usize,
        len: usize,
    ) !void {
        try self.arena.set_data_bounded(memory_offset, data, data_offset, len);
    }
    
    pub fn copy(self: *Self, dst_offset: usize, src_offset: usize, len: usize) !void {
        try self.arena.copy(dst_offset, src_offset, len);
    }
    
    /// Get hex representation
    pub fn to_hex(self: *const Self, allocator: std.mem.Allocator) ![]u8 {
        return try self.arena.to_hex(allocator);
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
    
    pub fn snapshot_context(self: *Self, allocator: std.mem.Allocator) ![]u8 {
        _ = self;
        // For compatibility, return empty snapshot
        return allocator.alloc(u8, 0);
    }
    
    pub fn restore_context(self: *Self, snapshot: []const u8) !void {
        _ = self;
        _ = snapshot;
        // No-op for compatibility
    }
    
    // Unsafe operations - implement safely
    
    pub fn set_unsafe(self: *Self, offset: usize, data: []const u8) void {
        self.set_data(offset, data) catch @panic("Memory operation failed");
    }
    
    pub fn get_ptr_unsafe(self: *Self, offset: usize) [*]u8 {
        const slice = self.arena.get_slice(offset, 1) catch @panic("Invalid offset");
        return @constCast(@ptrCast(slice.ptr));
    }
    
    pub fn get_const_ptr_unsafe(self: *const Self, offset: usize) [*]const u8 {
        const slice = self.arena.get_slice(offset, 1) catch @panic("Invalid offset");
        return slice.ptr;
    }
};