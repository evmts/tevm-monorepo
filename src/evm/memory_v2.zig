const std = @import("std");

/// Memory V2 - Uses Zig's built-in ArenaAllocator
pub const MemoryV2 = struct {
    const Self = @This();

    pub const MemoryError = error{
        OutOfMemory,
        InvalidOffset,
        InvalidSize,
        MemoryLimitExceeded,
        NoActiveContext,
    };

    /// Error union for all possible memory operation errors
    pub const MemoryOperationError = MemoryError || std.mem.Allocator.Error;

    pub const Context = struct {
        start_offset: usize,
        size: usize,
        parent: ?usize,
    };

    arena: std.heap.ArenaAllocator,
    buffer: std.ArrayList(u8),
    contexts: std.ArrayList(Context),
    memory_limit: u64,
    total_allocated: usize,
    is_child: bool,
    owns_arena: bool,

    pub const InitialCapacity: usize = 4 * 1024;
    pub const DefaultMemoryLimit: u64 = 32 * 1024 * 1024; // 32MB

    /// Initialize a new root memory context
    pub fn init(
        allocator: std.mem.Allocator,
        initial_capacity: usize,
        memory_limit: u64,
    ) MemoryOperationError!Self {
        _ = initial_capacity;

        var arena = std.heap.ArenaAllocator.init(allocator);
        errdefer arena.deinit();

        var buffer = std.ArrayList(u8).init(arena.allocator());
        errdefer buffer.deinit();

        var contexts = std.ArrayList(Context).init(arena.allocator());
        errdefer contexts.deinit();

        // Create root context
        contexts.append(Context{
            .start_offset = 0,
            .size = 0,
            .parent = null,
        }) catch |err| {
            std.log.debug("Failed to append root context: {any}", .{err});
            return switch (err) {
                std.mem.Allocator.Error.OutOfMemory => MemoryError.OutOfMemory,
            };
        };

        return Self{
            .arena = arena,
            .buffer = buffer,
            .contexts = contexts,
            .memory_limit = memory_limit,
            .total_allocated = 0,
            .is_child = false,
            .owns_arena = true,
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
            self.arena.deinit();
        }
    }

    /// Create a new child context
    pub fn new_child_context(self: *Self) MemoryError!Self {
        self.push_context() catch |err| {
            std.log.debug("Failed to push context: {any}", .{err});
            return err;
        };
        return Self{
            .arena = self.arena,
            .buffer = self.buffer,
            .contexts = self.contexts,
            .memory_limit = self.memory_limit,
            .total_allocated = self.total_allocated,
            .owns_arena = false,
            .is_child = true,
        };
    }

    /// Revert child context changes
    pub fn revert_child_context(self: *Self) MemoryError!void {
        if (!self.is_child) {
            self.pop_context() catch |err| {
                std.log.debug("Failed to pop context: {any}", .{err});
                return err;
            };
        }
    }

    /// Commit child context changes
    pub fn commit_child_context(self: *Self) MemoryError!void {
        if (!self.is_child) {
            self.commit_context() catch |err| {
                std.log.debug("Failed to commit context: {any}", .{err});
                return err;
            };
        }
    }

    /// Get the current context
    fn current_context(self: *Self) MemoryError!*Context {
        if (self.contexts.items.len == 0) {
            std.log.debug("No active context available", .{});
            return MemoryError.NoActiveContext;
        }
        return &self.contexts.items[self.contexts.items.len - 1];
    }

    /// Get the current context (const)
    fn current_context_const(self: *const Self) MemoryError!Context {
        if (self.contexts.items.len == 0) {
            std.log.debug("No active context available (const)", .{});
            return MemoryError.NoActiveContext;
        }
        return self.contexts.items[self.contexts.items.len - 1];
    }

    /// Push a new context for a child call
    pub fn push_context(self: *Self) MemoryOperationError!void {
        const parent_idx = self.contexts.items.len - 1;
        const new_start = self.buffer.items.len;

        self.contexts.append(Context{
            .start_offset = new_start,
            .size = 0,
            .parent = parent_idx,
        }) catch |err| {
            std.log.debug("Failed to push new context: {any}", .{err});
            return switch (err) {
                std.mem.Allocator.Error.OutOfMemory => MemoryError.OutOfMemory,
            };
        };
    }

    /// Pop the current context and revert changes
    pub fn pop_context(self: *Self) MemoryError!void {
        if (self.contexts.items.len <= 1) {
            std.log.debug("Cannot pop root context", .{});
            return MemoryError.NoActiveContext; // Can't pop root
        }

        const ctx_opt = self.contexts.pop();
        const ctx = ctx_opt.?;
        self.buffer.items.len = ctx.start_offset;
        self.total_allocated -= ctx.size;
    }

    /// Commit the current context changes to parent
    pub fn commit_context(self: *Self) MemoryError!void {
        if (self.contexts.items.len <= 1) {
            std.log.debug("Cannot commit root context", .{});
            return MemoryError.NoActiveContext; // Can't commit root
        }

        const child_opt = self.contexts.pop();
        const child = child_opt.?;
        var parent = self.current_context() catch |err| {
            std.log.debug("Failed to get parent context for commit: {any}", .{err});
            return err;
        };

        const child_end = child.start_offset + child.size;
        const parent_end = parent.start_offset + parent.size;
        if (child_end > parent_end) {
            const growth = child_end - parent_end;
            parent.size += growth;
        }
    }

    /// Get the current context size
    pub fn context_size(self: *const Self) usize {
        const ctx = self.current_context_const() catch return 0;
        return ctx.size;
    }

    /// Check if context is empty
    pub fn context_is_empty(self: *const Self) bool {
        return self.context_size() == 0;
    }

    /// Resize the current context
    pub fn resize_context(self: *Self, new_size: usize) MemoryOperationError!void {
        var ctx = self.current_context() catch |err| {
            std.log.debug("Failed to get current context for resize: {any}", .{err});
            return err;
        };
        const old_size = ctx.size;

        if (new_size == old_size) return;

        // Check memory limit
        const size_change = if (new_size > old_size) new_size - old_size else 0;
        if (self.total_allocated + size_change > self.memory_limit) {
            std.log.debug("Memory limit exceeded: current {d} + change {d} > limit {d}", .{ self.total_allocated, size_change, self.memory_limit });
            return MemoryError.MemoryLimitExceeded;
        }

        // Calculate absolute positions
        const ctx_end = ctx.start_offset + new_size;
        const buffer_end = self.buffer.items.len;

        if (ctx_end > buffer_end) {
            // Need to grow buffer
            const old_len = self.buffer.items.len;
            self.buffer.resize(ctx_end) catch |err| {
                std.log.debug("Failed to resize buffer from {d} to {d}: {any}", .{ old_len, ctx_end, err });
                return switch (err) {
                    std.mem.Allocator.Error.OutOfMemory => MemoryError.OutOfMemory,
                };
            };
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

    /// Resize to word-aligned size
    pub fn resize_context_word_aligned(self: *Self, min_size: usize) MemoryError!void {
        const num_words = calculate_num_words(min_size);
        const actual_size = num_words * 32;
        self.resize_context(actual_size) catch |err| {
            std.log.debug("Failed to resize context to word-aligned size {d}: {any}", .{ actual_size, err });
            return err;
        };
    }

    /// Ensure capacity and return new words added
    pub fn ensure_context_capacity(self: *Self, min_size: usize) MemoryOperationError!u64 {
        const ctx = self.current_context_const() catch |err| {
            std.log.debug("Failed to get current context for capacity check: {any}", .{err});
            return err;
        };
        const old_logical_size_for_context = ctx.size;

        // Calculate gas based on highest word accessed *before* this operation
        // for the current context's contribution to overall memory.
        const old_highest_abs_addr_for_gas = ctx.start_offset + old_logical_size_for_context;
        const old_gas_words = calculate_num_words(old_highest_abs_addr_for_gas);

        // Calculate highest word accessed *after* this operation (if it expands)
        const new_highest_abs_addr_for_gas = ctx.start_offset + min_size;
        const new_gas_words = calculate_num_words(new_highest_abs_addr_for_gas);

        var words_added_for_gas_calc: u64 = 0;
        if (new_gas_words > old_gas_words) {
            words_added_for_gas_calc = new_gas_words - old_gas_words;
        }

        // Ensure the context's logical size is updated and physical buffer is sufficient
        // We only need to call resize_context if the logical size actually needs to increase.
        if (min_size > old_logical_size_for_context) {
            // This will update ctx.size to min_size (logical)
            // and ensure the physical buffer can hold up to ctx.start_offset + min_size.
            self.resize_context(min_size) catch |err| {
                std.log.debug("Failed to resize context to {d}: {any}", .{ min_size, err });
                return err;
            };
        }

        return words_added_for_gas_calc;
    }

    // Data access methods

    pub fn get_byte(self: *const Self, offset: usize) MemoryError!u8 {
        const ctx = self.current_context_const() catch |err| {
            std.log.debug("Failed to get current context for byte read: {any}", .{err});
            return err;
        };
        if (offset >= ctx.size) {
            std.log.debug("Byte read out of bounds: offset {d} >= size {d}", .{ offset, ctx.size });
            return MemoryError.InvalidOffset;
        }
        return self.buffer.items[ctx.start_offset + offset];
    }

    pub fn set_byte(self: *Self, offset: usize, value: u8) MemoryOperationError!void {
        _ = self.ensure_context_capacity(offset + 1) catch |err| {
            std.log.debug("Failed to ensure capacity for byte write at offset {d}: {any}", .{ offset, err });
            return err;
        };
        const ctx = self.current_context_const() catch |err| {
            std.log.debug("Failed to get current context for byte write: {any}", .{err});
            return err;
        };
        self.buffer.items[ctx.start_offset + offset] = value;
    }

    pub fn get_word(self: *const Self, offset: usize) MemoryError![32]u8 {
        const ctx = self.current_context_const() catch |err| {
            std.log.debug("Failed to get current context for word read: {any}", .{err});
            return err;
        };
        if (offset + 32 > ctx.size) {
            std.log.debug("Word read out of bounds: offset {d} + 32 > size {d}", .{ offset, ctx.size });
            return MemoryError.InvalidOffset;
        }

        var word: [32]u8 = undefined;
        const abs_offset = ctx.start_offset + offset;
        @memcpy(&word, self.buffer.items[abs_offset .. abs_offset + 32]);
        return word;
    }

    pub fn set_word(self: *Self, offset: usize, value: [32]u8) MemoryOperationError!void {
        _ = self.ensure_context_capacity(offset + 32) catch |err| {
            std.log.debug("Failed to ensure capacity for word write at offset {d}: {any}", .{ offset, err });
            return err;
        };
        const ctx = self.current_context_const() catch |err| {
            std.log.debug("Failed to get current context for word write: {any}", .{err});
            return err;
        };
        const abs_offset = ctx.start_offset + offset;
        @memcpy(self.buffer.items[abs_offset .. abs_offset + 32], &value);
    }

    pub fn get_u256(self: *const Self, offset: usize) MemoryError!u256 {
        const word = self.get_word(offset) catch |err| {
            std.log.debug("Failed to get word for u256 at offset {d}: {any}", .{ offset, err });
            return err;
        };
        var value: u256 = 0;
        for (word) |byte| {
            value = (value << 8) | byte;
        }
        return value;
    }

    pub fn set_u256(self: *Self, offset: usize, value: u256) MemoryOperationError!void {
        var word: [32]u8 = [_]u8{0} ** 32;
        var v = value;
        var i: usize = 31;
        while (v > 0) : (i -%= 1) {
            word[i] = @truncate(v & 0xFF);
            v >>= 8;
            if (i == 0) break;
        }
        self.set_word(offset, word) catch |err| {
            std.log.debug("Failed to set word for u256 at offset {d}: {any}", .{ offset, err });
            return err;
        };
    }

    pub fn get_slice(self: *const Self, offset: usize, len: usize) MemoryError![]const u8 {
        if (len == 0) return &[_]u8{};

        const ctx = self.current_context_const() catch |err| {
            std.log.debug("Failed to get current context for slice read: {any}", .{err});
            return err;
        };
        const end = std.math.add(usize, offset, len) catch {
            std.log.debug("Slice read size overflow: offset {d} + len {d}", .{ offset, len });
            return MemoryError.InvalidSize;
        };
        if (end > ctx.size) {
            std.log.debug("Slice read out of bounds: end {d} > size {d}", .{ end, ctx.size });
            return MemoryError.InvalidOffset;
        }

        const abs_offset = ctx.start_offset + offset;
        return self.buffer.items[abs_offset .. abs_offset + len];
    }

    pub fn set_data(self: *Self, offset: usize, data: []const u8) MemoryOperationError!void {
        if (data.len == 0) return;

        const end = std.math.add(usize, offset, data.len) catch {
            std.log.debug("Data write size overflow: offset {d} + len {d}", .{ offset, data.len });
            return MemoryError.InvalidSize;
        };
        _ = self.ensure_context_capacity(end) catch |err| {
            std.log.debug("Failed to ensure capacity for data write at offset {d}, len {d}: {any}", .{ offset, data.len, err });
            return err;
        };

        const ctx = self.current_context_const() catch |err| {
            std.log.debug("Failed to get current context for data write: {any}", .{err});
            return err;
        };
        const abs_offset = ctx.start_offset + offset;
        @memcpy(self.buffer.items[abs_offset .. abs_offset + data.len], data);
    }

    pub fn set_data_bounded(
        self: *Self,
        memory_offset: usize,
        data: []const u8,
        data_offset: usize,
        len: usize,
    ) MemoryOperationError!void {
        if (len == 0) return;

        const end = std.math.add(usize, memory_offset, len) catch {
            std.log.debug("Bounded data write size overflow: memory_offset {d} + len {d}", .{ memory_offset, len });
            return MemoryError.InvalidSize;
        };
        _ = self.ensure_context_capacity(end) catch |err| {
            std.log.debug("Failed to ensure capacity for bounded data write: {any}", .{err});
            return err;
        };

        const ctx = self.current_context_const() catch |err| {
            std.log.debug("Failed to get current context for bounded data write: {any}", .{err});
            return err;
        };
        const abs_offset = ctx.start_offset + memory_offset;

        // Calculate how much we can actually copy
        const available = if (data_offset < data.len) data.len - data_offset else 0;
        const to_copy = @min(available, len);

        if (to_copy > 0) {
            @memcpy(self.buffer.items[abs_offset .. abs_offset + to_copy], data[data_offset .. data_offset + to_copy]);
        }

        // Zero-fill the rest
        if (to_copy < len) {
            @memset(self.buffer.items[abs_offset + to_copy .. abs_offset + len], 0);
        }
    }

    pub fn copy(self: *Self, dst_offset: usize, src_offset: usize, len: usize) MemoryOperationError!void {
        if (len == 0) return;

        const src_end = std.math.add(usize, src_offset, len) catch {
            std.log.debug("Copy src size overflow: src_offset {d} + len {d}", .{ src_offset, len });
            return MemoryError.InvalidSize;
        };
        const dst_end = std.math.add(usize, dst_offset, len) catch {
            std.log.debug("Copy dst size overflow: dst_offset {d} + len {d}", .{ dst_offset, len });
            return MemoryError.InvalidSize;
        };

        // Ensure destination has capacity
        _ = self.ensure_context_capacity(dst_end) catch |err| {
            std.log.debug("Failed to ensure capacity for copy destination: {any}", .{err});
            return err;
        };

        const ctx = self.current_context_const() catch |err| {
            std.log.debug("Failed to get current context for copy: {any}", .{err});
            return err;
        };

        // Source must be within current size
        if (src_end > ctx.size) {
            std.log.debug("Copy source out of bounds: src_end {d} > size {d}", .{ src_end, ctx.size });
            return MemoryError.InvalidOffset;
        }

        const src_start = ctx.start_offset + src_offset;
        const dst_start = ctx.start_offset + dst_offset;

        // Use memmove for potentially overlapping regions
        std.mem.copyForwards(u8, self.buffer.items[dst_start .. dst_start + len], self.buffer.items[src_start .. src_start + len]);
    }

    /// Get hex representation
    pub fn to_hex(self: *const Self, allocator: std.mem.Allocator) MemoryOperationError![]u8 {
        const ctx = self.current_context_const() catch |err| {
            std.log.debug("Failed to get current context for hex conversion: {any}", .{err});
            return err;
        };
        if (ctx.size == 0) {
            return allocator.alloc(u8, 0) catch |err| {
                std.log.debug("Failed to allocate empty hex string: {any}", .{err});
                return switch (err) {
                    std.mem.Allocator.Error.OutOfMemory => MemoryError.OutOfMemory,
                };
            };
        }

        const hex_len = ctx.size * 2;
        const hex = allocator.alloc(u8, hex_len) catch |err| {
            std.log.debug("Failed to allocate hex string of length {d}: {any}", .{ hex_len, err });
            return switch (err) {
                std.mem.Allocator.Error.OutOfMemory => MemoryError.OutOfMemory,
            };
        };

        const abs_start = ctx.start_offset;
        const abs_end = abs_start + ctx.size;
        _ = std.fmt.bufPrint(hex, "{x}", .{std.fmt.fmtSliceHexLower(self.buffer.items[abs_start..abs_end])}) catch |err| {
            std.log.debug("Failed to format hex string: {any}", .{err});
            allocator.free(hex);
            return switch (err) {
                error.NoSpaceLeft => MemoryError.InvalidSize,
            };
        };

        return hex;
    }

    /// Calculate number of words
    pub fn calculate_num_words(len: usize) usize {
        return (len + 31) / 32;
    }

    // Compatibility methods that don't apply to ArenaAllocator

    pub fn total_shared_buffer_size(self: *const Self) usize {
        _ = self;
        return 0; // Not applicable
    }

    pub fn total_shared_buffer_capacity(self: *const Self) usize {
        _ = self;
        return 0; // Not applicable
    }

    pub fn get_memory_limit(self: *const Self) u64 {
        return self.memory_limit;
    }

    pub fn set_memory_limit(self: *Self, new_limit: u64) void {
        self.memory_limit = new_limit;
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
        const slice = self.get_slice(offset, 1) catch |err| {
            std.log.err("Invalid offset {d} in unsafe ptr access: {any}", .{ offset, err });
            @panic("Invalid offset");
        };
        return @constCast(@ptrCast(slice.ptr));
    }

    pub fn get_const_ptr_unsafe(self: *const Self, offset: usize) [*]const u8 {
        const slice = self.get_slice(offset, 1) catch |err| {
            std.log.err("Invalid offset {d} in unsafe const ptr access: {any}", .{ offset, err });
            @panic("Invalid offset");
        };
        return slice.ptr;
    }
};