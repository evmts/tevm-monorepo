// This file contains stubs for external dependencies used in tests

// Import unified B256 type
const B256 = @import("../Types/B256.ts").B256;

// Stub Address module
pub const address = struct {
    pub const Address = [20]u8;
};

// Stub StateManager
pub const StateManager = struct {
    pub const B160 = [20]u8;

    // Stub implementation for tests
    pub fn isForkEnabled(self: *StateManager) !bool {
        _ = self;
        return false;
    }

    pub fn getAccount(self: *StateManager, addr: B160) !?struct { balance: u256, codeHash: B256 } {
        _ = self;
        _ = addr;
        return .{ .balance = 0, .codeHash = B256{ .bytes = [_]u8{0} ** 32 } };
    }

    pub fn getContractCode(self: *StateManager, addr: B160) ![]const u8 {
        _ = self;
        _ = addr;
        return &[_]u8{};
    }

    pub fn getContractStorage(self: *StateManager, addr: B160, key: B256) !B256 {
        _ = self;
        _ = addr;
        _ = key;
        return B256{ .bytes = [_]u8{0} ** 32 };
    }

    pub fn putContractStorage(self: *StateManager, addr: B160, key: B256, value: B256) !void {
        _ = self;
        _ = addr;
        _ = key;
        _ = value;
    }
};