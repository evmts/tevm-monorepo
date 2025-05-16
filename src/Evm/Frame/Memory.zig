const std = @import("std");

/// Memory context for a frame
pub const Memory = struct {
    data: std.ArrayList(u8),
    
    pub fn init(allocator: std.mem.Allocator) Memory {
        return Memory{
            .data = std.ArrayList(u8).init(allocator),
        };
    }
    
    pub fn deinit(self: *Memory) void {
        self.data.deinit();
    }
    
    pub fn store(self: *Memory, offset: usize, value: []const u8) !void {
        // Expand memory if needed
        const requiredSize = offset + value.len;
        if (requiredSize > self.data.items.len) {
            try self.data.resize(requiredSize);
        }
        
        @memcpy(self.data.items[offset..offset+value.len], value);
    }
    
    pub fn load(self: *const Memory, offset: usize, length: usize) []const u8 {
        if (offset >= self.data.items.len) {
            return &[_]u8{};
        }
        
        const end = @min(offset + length, self.data.items.len);
        return self.data.items[offset..end];
    }
};