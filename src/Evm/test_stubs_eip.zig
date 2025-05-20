// Stub file specifically for EIP tests
const std = @import("std");
const Address = @import("test_stubs.zig").address.Address;

// More complete stubs for EIP tests
pub const StateManager = struct {
    pub fn init(allocator: std.mem.Allocator, options: struct {}) !StateManager {
        _ = allocator;
        _ = options;
        return StateManager{};
    }
    
    pub fn deinit(self: *StateManager) void {
        _ = self;
    }
    
    pub fn isForkEnabled(self: *StateManager) !bool {
        _ = self;
        return false;
    }
};