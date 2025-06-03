const std = @import("std");

/// Arena-based memory implementation for EVM that fixes the architectural issues
/// of the previous self-referential design. This implementation:
/// - Uses a single arena allocator for all memory within a transaction
/// - Properly tracks child contexts with RAII cleanup
/// - Prevents memory leaks through automatic cleanup
/// - Avoids self-referential pointers
pub const ArenaMemory = struct {
    const Self = @This();
    
    pub const MemoryError = error{
        OutOfMemory,
        InvalidOffset,
        InvalidSize,
        MemoryLimitExceeded,
        NoActiveContext,
    };
    
    /// Context represents a memory region for a single call frame
    pub const Context = struct {
        /// Start offset in the arena where this context begins
        start_offset: usize,
        /// Current size of this context's memory
        size: usize,
        /// Parent context index (null for root)
        parent: ?usize,
    };
    
    /// The arena allocator that owns all memory
    arena: std.heap.ArenaAllocator,
    /// The actual memory buffer
    buffer: std.ArrayList(u8),
    /// Stack of contexts (call frames)
    contexts: std.ArrayList(Context),
    /// Maximum memory limit
    memory_limit: u64,
    /// Total memory allocated across all contexts
    total_allocated: usize,
    
    pub const DefaultMemoryLimit: u64 = 32 * 1024 * 1024; // 32MB
    
    /// Initialize a new ArenaMemory
    pub fn init(allocator: std.mem.Allocator, memory_limit: u64) !Self {
        var arena = std.heap.ArenaAllocator.init(allocator);
        errdefer arena.deinit();
        
        var buffer = std.ArrayList(u8).init(arena.allocator());
        errdefer buffer.deinit();
        
        var contexts = std.ArrayList(Context).init(arena.allocator());
        errdefer contexts.deinit();
        
        // Create root context
        try contexts.append(Context{
            .start_offset = 0,
            .size = 0,
            .parent = null,
        });
        
        return Self{
            .arena = arena,
            .buffer = buffer,
            .contexts = contexts,
            .memory_limit = memory_limit,
            .total_allocated = 0,
        };
    }
    
    /// Deinitialize and free all memory
    pub fn deinit(self: *Self) void {
        self.arena.deinit();
    }
    
    /// Get the current context
    fn current_context(self: *Self) !*Context {
        if (self.contexts.items.len == 0) {
            return MemoryError.NoActiveContext;
        }
        return &self.contexts.items[self.contexts.items.len - 1];
    }
    
    /// Get the current context (const)
    fn current_context_const(self: *const Self) !Context {
        if (self.contexts.items.len == 0) {
            return MemoryError.NoActiveContext;
        }
        return self.contexts.items[self.contexts.items.len - 1];
    }
    
    /// Push a new context for a child call
    pub fn push_context(self: *Self) !void {
        const parent_idx = self.contexts.items.len - 1;
        const new_start = self.buffer.items.len;
        
        try self.contexts.append(Context{
            .start_offset = new_start,
            .size = 0,
            .parent = parent_idx,
        });
    }
    
    /// Pop the current context and revert changes
    pub fn pop_context(self: *Self) !void {
        if (self.contexts.items.len <= 1) {
            return MemoryError.NoActiveContext; // Can't pop root
        }
        
        const ctx_opt = self.contexts.pop();
        const ctx = ctx_opt.?; // We already checked length > 1
        // Revert buffer to context start
        self.buffer.items.len = ctx.start_offset;
        self.total_allocated -= ctx.size;
    }
    
    /// Commit the current context changes to parent
    pub fn commit_context(self: *Self) !void {
        if (self.contexts.items.len <= 1) {
            return MemoryError.NoActiveContext; // Can't commit root
        }
        
        const child_opt = self.contexts.pop();
        const child = child_opt.?; // We already checked length > 1
        var parent = try self.current_context();
        
        // Update parent size to include child's memory
        const child_end = child.start_offset + child.size;
        const parent_end = parent.start_offset + parent.size;
        if (child_end > parent_end) {
            const growth = child_end - parent_end;
            parent.size += growth;
        }
    }
    
    /// Get the size of the current context
    pub fn context_size(self: *const Self) usize {
        const ctx = self.current_context_const() catch return 0;
        return ctx.size;
    }
    
    /// Resize the current context
    pub fn resize_context(self: *Self, new_size: usize) !void {
        var ctx = try self.current_context();
        const old_size = ctx.size;
        
        if (new_size == old_size) return;
        
        // Check memory limit
        const size_change = if (new_size > old_size) new_size - old_size else 0;
        if (self.total_allocated + size_change > self.memory_limit) {
            return MemoryError.MemoryLimitExceeded;
        }
        
        // Calculate absolute positions
        const ctx_end = ctx.start_offset + new_size;
        const buffer_end = self.buffer.items.len;
        
        if (ctx_end > buffer_end) {
            // Need to grow buffer
            const old_len = self.buffer.items.len;
            try self.buffer.resize(ctx_end);
            // Zero initialize new memory
            @memset(self.buffer.items[old_len..ctx_end], 0);
        }
        
        // Update size tracking
        if (new_size > old_size) {
            self.total_allocated += new_size - old_size;
        } else {
            self.total_allocated -= old_size - new_size;
        }
        ctx.size = new_size;
    }
    
    /// Ensure capacity for the current context
    pub fn ensure_context_capacity(self: *Self, min_size: usize) !u64 {
        const ctx = try self.current_context_const();
        const old_size = ctx.size;
        
        if (old_size >= min_size) return 0;
        
        const old_words = calculate_num_words(old_size);
        try self.resize_context(min_size);
        const new_words = calculate_num_words(min_size);
        
        return new_words - old_words;
    }
    
    /// Read operations
    pub fn get_byte(self: *const Self, offset: usize) !u8 {
        const ctx = try self.current_context_const();
        if (offset >= ctx.size) {
            return MemoryError.InvalidOffset;
        }
        return self.buffer.items[ctx.start_offset + offset];
    }
    
    pub fn get_word(self: *const Self, offset: usize) ![32]u8 {
        const ctx = try self.current_context_const();
        if (offset + 32 > ctx.size) {
            return MemoryError.InvalidOffset;
        }
        
        var word: [32]u8 = undefined;
        const abs_offset = ctx.start_offset + offset;
        @memcpy(&word, self.buffer.items[abs_offset..abs_offset + 32]);
        return word;
    }
    
    pub fn get_slice(self: *const Self, offset: usize, len: usize) ![]const u8 {
        if (len == 0) return &[_]u8{};
        
        const ctx = try self.current_context_const();
        const end = std.math.add(usize, offset, len) catch return MemoryError.InvalidSize;
        if (end > ctx.size) {
            return MemoryError.InvalidOffset;
        }
        
        const abs_offset = ctx.start_offset + offset;
        return self.buffer.items[abs_offset..abs_offset + len];
    }
    
    pub fn get_u256(self: *const Self, offset: usize) !u256 {
        const word = try self.get_word(offset);
        var value: u256 = 0;
        for (word) |byte| {
            value = (value << 8) | byte;
        }
        return value;
    }
    
    /// Write operations
    pub fn set_byte(self: *Self, offset: usize, value: u8) !void {
        _ = try self.ensure_context_capacity(offset + 1);
        const ctx = try self.current_context_const();
        self.buffer.items[ctx.start_offset + offset] = value;
    }
    
    pub fn set_word(self: *Self, offset: usize, value: [32]u8) !void {
        _ = try self.ensure_context_capacity(offset + 32);
        const ctx = try self.current_context_const();
        const abs_offset = ctx.start_offset + offset;
        @memcpy(self.buffer.items[abs_offset..abs_offset + 32], &value);
    }
    
    pub fn set_data(self: *Self, offset: usize, data: []const u8) !void {
        if (data.len == 0) return;
        
        const end = std.math.add(usize, offset, data.len) catch return MemoryError.InvalidSize;
        _ = try self.ensure_context_capacity(end);
        
        const ctx = try self.current_context_const();
        const abs_offset = ctx.start_offset + offset;
        @memcpy(self.buffer.items[abs_offset..abs_offset + data.len], data);
    }
    
    pub fn set_u256(self: *Self, offset: usize, value: u256) !void {
        var word: [32]u8 = [_]u8{0} ** 32;
        var v = value;
        var i: usize = 31;
        while (v > 0) : (i -%= 1) {
            word[i] = @truncate(v & 0xFF);
            v >>= 8;
            if (i == 0) break;
        }
        try self.set_word(offset, word);
    }
    
    pub fn set_data_bounded(
        self: *Self,
        memory_offset: usize,
        data: []const u8,
        data_offset: usize,
        len: usize,
    ) !void {
        if (len == 0) return;
        
        const end = std.math.add(usize, memory_offset, len) catch return MemoryError.InvalidSize;
        _ = try self.ensure_context_capacity(end);
        
        const ctx = try self.current_context_const();
        const abs_offset = ctx.start_offset + memory_offset;
        
        // Calculate how much we can actually copy
        const available = if (data_offset < data.len) data.len - data_offset else 0;
        const to_copy = @min(available, len);
        
        if (to_copy > 0) {
            @memcpy(
                self.buffer.items[abs_offset..abs_offset + to_copy],
                data[data_offset..data_offset + to_copy]
            );
        }
        
        // Zero-fill the rest
        if (to_copy < len) {
            @memset(self.buffer.items[abs_offset + to_copy..abs_offset + len], 0);
        }
    }
    
    /// Copy within current context
    pub fn copy(self: *Self, dst_offset: usize, src_offset: usize, len: usize) !void {
        if (len == 0) return;
        
        const src_end = std.math.add(usize, src_offset, len) catch return MemoryError.InvalidSize;
        const dst_end = std.math.add(usize, dst_offset, len) catch return MemoryError.InvalidSize;
        
        // Ensure destination has capacity
        _ = try self.ensure_context_capacity(dst_end);
        
        const ctx = try self.current_context_const();
        
        // Source must be within current size
        if (src_end > ctx.size) {
            return MemoryError.InvalidOffset;
        }
        
        const src_start = ctx.start_offset + src_offset;
        const dst_start = ctx.start_offset + dst_offset;
        
        // Use memmove for potentially overlapping regions
        std.mem.copyForwards(u8, 
            self.buffer.items[dst_start..dst_start + len],
            self.buffer.items[src_start..src_start + len]
        );
    }
    
    /// Check if current context is empty
    pub fn context_is_empty(self: *const Self) bool {
        return self.context_size() == 0;
    }
    
    /// Get hex representation (for debugging)
    pub fn to_hex(self: *const Self, allocator: std.mem.Allocator) ![]u8 {
        const ctx = try self.current_context_const();
        if (ctx.size == 0) {
            return allocator.alloc(u8, 0);
        }
        
        const hex_len = ctx.size * 2;
        const hex = try allocator.alloc(u8, hex_len);
        
        const abs_start = ctx.start_offset;
        const abs_end = abs_start + ctx.size;
        _ = try std.fmt.bufPrint(hex, "{x}", .{
            std.fmt.fmtSliceHexLower(self.buffer.items[abs_start..abs_end])
        });
        
        return hex;
    }
    
    /// Calculate number of words
    pub fn calculate_num_words(len: usize) usize {
        return (len + 31) / 32;
    }
};