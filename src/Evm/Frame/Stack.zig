const std = @import("std");

/// Stack implementation for EVM
pub const Stack = struct {
    data: std.ArrayList(u256),
    
    pub fn init(allocator: std.mem.Allocator) Stack {
        return Stack{
            .data = std.ArrayList(u256).init(allocator),
        };
    }
    
    pub fn deinit(self: *Stack) void {
        self.data.deinit();
    }
    
    pub fn push(self: *Stack, value: u256) !void {
        if (self.data.items.len >= 1024) {
            return error.StackOverflow;
        }
        try self.data.append(value);
    }
    
    pub fn pop(self: *Stack) !u256 {
        if (self.data.items.len == 0) {
            return error.StackUnderflow;
        }
        return self.data.pop() orelse return error.StackUnderflow;
    }
};