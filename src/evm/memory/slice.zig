const Memory = @import("./memory.zig").Memory;
const context = @import("context.zig");

/// Get a mutable slice to the entire memory buffer (context-relative)
pub fn slice(self: *Memory) []u8 {
    const ctx_size = self.context_size();
    const abs_start = self.my_checkpoint;
    const abs_end = abs_start + ctx_size;
    return self.root_ptr.shared_buffer.items[abs_start..abs_end];
}
