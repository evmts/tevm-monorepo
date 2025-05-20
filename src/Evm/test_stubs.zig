// This file contains stubs for external dependencies used in tests

// Stub Address module
pub const address = struct {
    pub const Address = [20]u8;
};

// Stub StateManager
pub const StateManager = struct {
    pub const B256 = [32]u8;

    // Stub implementation for tests
    pub fn isForkEnabled(self: *StateManager) !bool {
        _ = self;
        return false;
    }
};