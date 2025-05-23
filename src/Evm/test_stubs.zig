// This file contains stubs for external dependencies used in tests

// Stub Address module
pub const address = struct {
    pub const Address = [20]u8;
};

// Stub StateManager
pub const StateManager = struct {
    pub const B256 = [32]u8;
    pub const B160 = [20]u8;

    // Stub implementation for tests
    pub fn isForkEnabled(self: *StateManager) !bool {
        _ = self;
        return false;
    }

    pub fn getAccount(self: *StateManager, addr: B160) !?struct { balance: u256, codeHash: struct { bytes: [32]u8 } } {
        _ = self;
        _ = addr;
        return .{ .balance = 0, .codeHash = .{ .bytes = [_]u8{0} ** 32 } };
    }

    pub fn getContractCode(self: *StateManager, addr: B160) ![]const u8 {
        _ = self;
        _ = addr;
        return &[_]u8{};
    }

    pub fn getContractStorage(self: *StateManager, addr: B160, key: B256) ![32]u8 {
        _ = self;
        _ = addr;
        _ = key;
        return [_]u8{0} ** 32;
    }

    pub fn putContractStorage(self: *StateManager, addr: B160, key: B256, value: *const [32]u8) !void {
        _ = self;
        _ = addr;
        _ = key;
        _ = value;
    }
};