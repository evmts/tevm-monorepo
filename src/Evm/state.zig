// Export all state management related types
pub const Account = @import("Account.zig").Account;
pub const Storage = @import("Storage.zig").Storage;
pub const Journal = @import("Journal.zig").Journal;
pub const JournalEntry = @import("Journal.zig").JournalEntry;
pub const StateDB = @import("StateDB.zig").StateDB;

// Re-export B256 for compatibility
pub const B256 = @import("StateDB.zig").B256;