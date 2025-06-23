const std = @import("std");
const Log = @import("../log.zig");
const Memory = @import("./memory.zig").Memory;
const MemoryError = @import("errors.zig").MemoryError;
const context = @import("context.zig");

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
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + 32], &bytes);
}
