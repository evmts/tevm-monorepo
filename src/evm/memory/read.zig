const std = @import("std");
const Log = @import("../log.zig");
const Memory = @import("./memory.zig").Memory;
const MemoryError = @import("errors.zig").MemoryError;
const context = @import("context.zig");

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

/// Read a single byte at context-relative offset (for test compatibility)
pub fn get_byte(self: *const Memory, relative_offset: usize) MemoryError!u8 {
    if (relative_offset >= self.context_size()) return MemoryError.InvalidOffset;
    const abs_offset = self.my_checkpoint + relative_offset;
    return self.root_ptr.shared_buffer.items[abs_offset];
}
