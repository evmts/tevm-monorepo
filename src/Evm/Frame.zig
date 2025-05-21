const std = @import("std");
const Contract = @import("Contract.zig").Contract;

const Allocator = std.mem.Allocator;

pub const Frame = struct {
    const Self = @This();

    allocator: Allocator,
    contract: *const Contract,
    pc: usize = 0,

    pub fn create(allocator: Allocator, contract: *const Contract) Self {
        return Frame{
            .allocator = allocator,
            .contract = contract,
        };
    }

    pub fn destroy(self: *Self) void {
        _ = self;
        // Cleanup will happen here in the future
    }
};
