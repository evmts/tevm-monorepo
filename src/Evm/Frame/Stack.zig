const std = @import("std");

/// Stack implementation for EVM
pub const Stack = struct {
    data: [1024]u256,
    size: usize,

    pub fn init(allocator: std.mem.Allocator) Stack {
        _ = allocator;
        return Stack{
            .data = undefined,
            .size = 0,
        };
    }

    pub fn push(self: *Stack, value: u256) !void {
        if (self.size >= 1024) {
            return error.StackOverflow;
        }
        self.data[self.size] = value;
        self.size += 1;
    }

    pub fn pop(self: *Stack) !u256 {
        if (self.size == 0) {
            return error.StackUnderflow;
        }
        self.size -= 1;
        return self.data[self.size];
    }
};
