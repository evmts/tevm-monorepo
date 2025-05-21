const std = @import("std");

const Allocator = std.mem.Allocator;

pub const Frame = struct {
    const Self = @This();

    allocator: Allocator,

    pc: usize = undefined,

    pub fn create(allocator: Allocator) Self {
        return Frame{ .allocator = allocator };
    }

    pub fn destroy() void {}
};
