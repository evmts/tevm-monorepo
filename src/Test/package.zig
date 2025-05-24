const std = @import("std");

pub const SimpleContract = @import("simple_contract.zig").SimpleContract;
pub const BlockReader = @import("block_reader.zig").BlockReader;
pub const TestERC20 = @import("oz.zig").TestERC20;
pub const TestERC721 = @import("oz.zig").TestERC721;

// Export transports functionality
pub const EnvUrls = @import("transports.zig").EnvUrls;
pub const getTransports = @import("transports.zig").getTransports;

// Main test utility package
pub const Test = struct {
    /// Initialize Test utilities
    pub fn init(allocator: std.mem.Allocator) !void {
        _ = allocator;
        // Initialize any test resources if needed
    }

    /// Clean up Test utilities
    pub fn deinit() void {
        // Clean up any test resources if needed
    }
};