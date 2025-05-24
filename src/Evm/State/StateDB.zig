const std = @import("std");
const testing = std.testing;

// Import B256 from unified Types
pub const B256 = @import("utils").B256;

// Import Address type
const Address = @import("address").Address;

// Define u256 for testing


// Import local modules
const Account = @import("Account.zig").Account;
const Storage = @import("Storage.zig").Storage;
const Journal = @import("Journal.zig").Journal;
const JournalEntry = @import("Journal.zig").JournalEntry;

// Helper function for tests to create an address from a hex string
fn addressFromHexString(hex: []const u8) !Address {
    if (hex.len < 2 or !std.mem.eql(u8, hex[0..2], "0x"))
        return error.InvalidAddressFormat;
    
    if (hex.len != 42)
        return error.InvalidAddressLength;
    
    var addr: Address = undefined;
    const hex_without_prefix = hex[2..];
    _ = try std.fmt.hexToBytes(&addr, hex_without_prefix);
    return addr;
}

// StateDB is the main state database that tracks account states
pub const StateDB = struct {
    /// Map of addresses to accounts
    accounts: std.AutoHashMap(Address, *Account),
    
    /// Map of addresses to storage
    storage: std.AutoHashMap(Address, *Storage),
    
    /// Journal for tracking changes
    journal: Journal,
    
    /// Gas refund counter
    refund: u64,
    
    /// Allocator for memory management
    allocator: std.mem.Allocator,
    
    /// Initialize a new StateDB
    pub fn init(allocator: std.mem.Allocator) StateDB {
        return StateDB{
            .accounts = std.AutoHashMap(Address, *Account).init(allocator),
            .storage = std.AutoHashMap(Address, *Storage).init(allocator),
            .journal = Journal.init(allocator),
            .refund = 0,
            .allocator = allocator,
        };
    }
    
    /// Clean up resources
    pub fn deinit(self: *StateDB) void {
        // Free all accounts
        var it = self.accounts.iterator();
        while (it.next()) |entry| {
            entry.value_ptr.*.deinit(self.allocator);
            self.allocator.destroy(entry.value_ptr.*);
        }
        self.accounts.deinit();
        
        // Free all storage
        var storage_it = self.storage.iterator();
        while (storage_it.next()) |entry| {
            entry.value_ptr.*.deinit();
            self.allocator.destroy(entry.value_ptr.*);
        }
        self.storage.deinit();
        
        // Free journal
        self.journal.deinit();
    }
    
    /// Create a new account
    pub fn createAccount(self: *StateDB, address: Address) !void {
        // If account already exists, nothing to do
        if (self.accounts.contains(address)) {
            return;
        }
        
        // Create a new account
        const account = try self.allocator.create(Account);
        account.* = Account.init();
        
        // Store in accounts map
        try self.accounts.put(address, account);
        
        // Record in journal
        try self.journal.append(.{ .CreateAccount = .{ .address = address } });
    }
    
    /// Delete an account
    pub fn deleteAccount(self: *StateDB, address: Address) !void {
        // If account doesn't exist, nothing to do
        const account_ptr = self.accounts.get(address) orelse return;
        
        // Get current account state before deleting
        const balance = account_ptr.getBalance();
        const nonce = account_ptr.getNonce();
        const has_code = account_ptr.hasCode();
        
        // Record in journal before deletion
        try self.journal.append(.{ .SelfDestruct = .{
            .address = address,
            .prev_balance = balance,
            .prev_nonce = nonce,
            .had_code = has_code,
        }});
        
        // Delete the account
        account_ptr.deinit(self.allocator);
        self.allocator.destroy(account_ptr);
        _ = self.accounts.remove(address);
        
        // Delete any associated storage
        if (self.storage.get(address)) |storage_ptr| {
            storage_ptr.deinit();
            self.allocator.destroy(storage_ptr);
            _ = self.storage.remove(address);
        }
    }
    
    /// Get an account
    pub fn getAccount(self: *StateDB, address: Address) ?*Account {
        return self.accounts.get(address);
    }
    
    /// Get or create an account
    pub fn getOrCreateAccount(self: *StateDB, address: Address) !*Account {
        // If account exists, return it
        if (self.accounts.get(address)) |account| {
            return account;
        }
        
        // Otherwise create a new account
        try self.createAccount(address);
        return self.accounts.get(address).?;
    }
    
    /// Check if an account exists
    pub fn accountExists(self: *const StateDB, address: Address) bool {
        return self.accounts.contains(address);
    }
    
    /// Check if an account is empty (can be deleted)
    pub fn isEmpty(self: *StateDB, address: Address) bool {
        const account = self.accounts.get(address) orelse return true;
        return account.isEmpty();
    }
    
    /// Get account balance
    pub fn getBalance(self: *StateDB, address: Address) u256 {
        const account = self.accounts.get(address) orelse return 0;
        return account.getBalance();
    }
    
    /// Set account balance
    pub fn setBalance(self: *StateDB, address: Address, balance: u256) !void {
        var account = try self.getOrCreateAccount(address);
        
        // Record original balance in journal
        try self.journal.append(.{ .BalanceChange = .{
            .address = address,
            .prev_balance = account.getBalance(),
        }});
        
        // Update balance
        account.setBalance(balance);
    }
    
    /// Add to account balance
    pub fn addBalance(self: *StateDB, address: Address, amount: u256) !void {
        var account = try self.getOrCreateAccount(address);
        
        // Record original balance in journal
        try self.journal.append(.{ .BalanceChange = .{
            .address = address,
            .prev_balance = account.getBalance(),
        }});
        
        // Add to balance
        account.addBalance(amount);
    }
    
    /// Subtract from account balance
    pub fn subBalance(self: *StateDB, address: Address, amount: u256) !void {
        var account = try self.getOrCreateAccount(address);
        
        // Record original balance in journal
        try self.journal.append(.{ .BalanceChange = .{
            .address = address,
            .prev_balance = account.getBalance(),
        }});
        
        // Subtract from balance
        try account.subBalance(amount);
    }
    
    /// Get account nonce
    pub fn getNonce(self: *StateDB, address: Address) u64 {
        const account = self.accounts.get(address) orelse return 0;
        return account.getNonce();
    }
    
    /// Set account nonce
    pub fn setNonce(self: *StateDB, address: Address, nonce: u64) !void {
        var account = try self.getOrCreateAccount(address);
        
        // Record original nonce in journal
        try self.journal.append(.{ .NonceChange = .{
            .address = address,
            .prev_nonce = account.getNonce(),
        }});
        
        // Update nonce
        account.setNonce(nonce);
    }
    
    /// Increment account nonce
    pub fn incrementNonce(self: *StateDB, address: Address) !void {
        var account = try self.getOrCreateAccount(address);
        
        // Record original nonce in journal
        try self.journal.append(.{ .NonceChange = .{
            .address = address,
            .prev_nonce = account.getNonce(),
        }});
        
        // Increment nonce
        account.incrementNonce();
    }
    
    /// Get account code
    pub fn getCode(self: *StateDB, address: Address) ?[]const u8 {
        const account = self.accounts.get(address) orelse return null;
        return account.getCode();
    }
    
    /// Set account code
    pub fn setCode(self: *StateDB, address: Address, code: []const u8) !void {
        var account = try self.getOrCreateAccount(address);
        
        // Get the code hash as raw bytes
        const codeHashAB = account.getCodeHash();
        
        // Create a raw B256 array for the journal
        var codeHashRaw: [32]u8 = undefined;
        @memcpy(&codeHashRaw, &codeHashAB.bytes);
        
        // Record original code hash in journal
        try self.journal.append(.{ .CodeChange = .{
            .address = address,
            .prev_code_hash = codeHashRaw,
        }});
        
        // Update code
        try account.setCode(self.allocator, code);
    }
    
    /// Get account code hash
    pub fn getCodeHash(self: *StateDB, address: Address) B256 {
        const account = self.accounts.get(address) orelse return B256.zero();
        return account.getCodeHash();
    }
    
    /// Get account code size
    pub fn getCodeSize(self: *StateDB, address: Address) usize {
        const account = self.accounts.get(address) orelse return 0;
        return account.getCodeSize();
    }
    
    /// Get storage value
    pub fn getState(self: *StateDB, address: Address, key: B256) !B256 {
        // Get or create storage for this account
        var storage = try self.getOrCreateStorage(address);
        const storageKey = key;
        const result = storage.get(storageKey);
        return result;
    }
    
    /// Set storage value
    pub fn setState(self: *StateDB, address: Address, key: B256, value: B256) !void {
        // Get or create storage for this account
        var storage = try self.getOrCreateStorage(address);
        
        // Convert key and value to Storage.B256
        const storageKey = key;
        const storageValue = value;
        
        // Get current value
        const currentStorage = storage.get(storageKey);
        const current = currentStorage;
        
        // If no change, nothing to do
        if (B256.equal(current, value)) {
            return;
        }
        
        // Create raw B256 arrays for journal
        var keyRaw: [32]u8 = undefined;
        var valueRaw: [32]u8 = undefined;
        @memcpy(&keyRaw, &key.bytes);
        @memcpy(&valueRaw, &current.bytes);
        
        // Record change in journal
        try self.journal.append(.{ .StorageChange = .{
            .address = address,
            .key = keyRaw,
            .prev_value = valueRaw,
        }});
        
        // Update storage
        try storage.set(storageKey, storageValue);
        
        // Mark account storage as dirty
        var account = try self.getOrCreateAccount(address);
        account.dirty_storage = true;
    }
    
    /// Get or create storage for an account
    fn getOrCreateStorage(self: *StateDB, address: Address) !*Storage {
        // If storage exists, return it
        if (self.storage.get(address)) |storage| {
            return storage;
        }
        
        // Otherwise create new storage
        const storage = try self.allocator.create(Storage);
        storage.* = Storage.init(self.allocator);
        
        // Store in storage map
        try self.storage.put(address, storage);
        
        return storage;
    }
    
    /// Create a snapshot of the current state
    pub fn snapshot(self: *StateDB) !u64 {
        return self.journal.snapshot();
    }
    
    /// Revert to a previous snapshot
    pub fn revertToSnapshot(self: *StateDB, id: u64) !void {
        // Get all journal entries since the snapshot
        const entries = try self.journal.entriesSinceSnapshot(id);
        
        // Process entries in reverse order
        var i: usize = entries.len;
        while (i > 0) {
            i -= 1;
            try self.revertJournalEntry(entries[i]);
        }
        
        // Remove entries from the journal
        try self.journal.revertToSnapshot(id);
    }
    
    /// Revert a single journal entry
    fn revertJournalEntry(self: *StateDB, entry: JournalEntry) !void {
        switch (entry) {
            .BalanceChange => |change| {
                if (self.accounts.get(change.address)) |account| {
                    account.setBalance(change.prev_balance);
                }
            },
            .NonceChange => |change| {
                if (self.accounts.get(change.address)) |account| {
                    account.setNonce(change.prev_nonce);
                }
            },
            .StorageChange => |change| {
                if (self.storage.get(change.address)) |storage| {
                    // Convert raw arrays to our B256 type
                    const keyStruct = B256{ .bytes = change.key };
                    const valueStruct = B256{ .bytes = change.prev_value };
                    
                    // Then convert to Storage.B256
                    const storageKey = keyStruct;
                    const storageValue = valueStruct;
                    try storage.set(storageKey, storageValue);
                }
            },
            .CodeChange => |change| {
                // Code changes are complex to revert since we need the original code
                // For now, we'll just restore the code hash and clear the code
                if (self.accounts.get(change.address)) |account| {
                    account.code_hash = @import("Account.zig").B256{ .bytes = change.prev_code_hash };
                    if (account.code) |code| {
                        self.allocator.free(code);
                        account.code = null;
                    }
                }
            },
            .CreateAccount => |change| {
                // If the account was newly created, delete it
                try self.deleteAccount(change.address);
            },
            .SelfDestruct => |change| {
                // Recreate the account
                try self.createAccount(change.address);
                
                // Restore previous state
                if (self.accounts.get(change.address)) |account| {
                    account.setBalance(change.prev_balance);
                    account.setNonce(change.prev_nonce);
                    // Code restoration would be more complex and require keeping the actual bytecode
                    // For now, just set a flag if code existed
                    if (change.had_code) {
                        account.dirty_code = true;
                    }
                }
            },
            .AccountChange => |change| {
                // Account changed from empty to non-empty or vice versa
                // No specific action needed, other entries will handle the details
                _ = change;
            },
            .AddLog => |change| {
                // Logs would be removed from a separate log structure
                _ = change;
            },
            .RefundChange => |change| {
                self.refund = change.prev_refund;
            },
            .AccessListChange => |change| {
                // This would typically update an access list warm/cold tracking
                _ = change;
            },
            .StorageAccessChange => |change| {
                // This would typically update a storage access list warm/cold tracking
                _ = change;
            },
            .Snapshot => {
                // Snapshot markers don't need any specific revert action
            },
        }
    }
    
    /// Get the current refund counter
    pub fn getRefund(self: *const StateDB) u64 {
        return self.refund;
    }
    
    /// Add to the refund counter
    pub fn addRefund(self: *StateDB, amount: u64) !void {
        // Record original refund in journal
        try self.journal.append(.{ .RefundChange = .{
            .prev_refund = self.refund,
        }});
        
        // Add to refund
        self.refund += amount;
    }
    
    /// Subtract from the refund counter
    pub fn subRefund(self: *StateDB, amount: u64) !void {
        // Record original refund in journal
        try self.journal.append(.{ .RefundChange = .{
            .prev_refund = self.refund,
        }});
        
        // Subtract from refund, but don't go below zero
        self.refund = if (amount > self.refund) 0 else self.refund - amount;
    }
    
    /// Get the number of accounts
    pub fn accountCount(self: *const StateDB) usize {
        return self.accounts.count();
    }
};

// Tests
test "StateDB initialization" {
    const allocator = testing.allocator;
    var state = StateDB.init(allocator);
    defer state.deinit();
    
    try testing.expectEqual(@as(usize, 0), state.accountCount());
    try testing.expectEqual(@as(u64, 0), state.getRefund());
}

test "Account creation and retrieval" {
    const allocator = testing.allocator;
    var state = StateDB.init(allocator);
    defer state.deinit();
    
    const addr = try addressFromHexString("0x1234567890123456789012345678901234567890");
    
    // Initially account should not exist
    try testing.expect(!state.accountExists(addr));
    
    // Create account
    try state.createAccount(addr);
    try testing.expect(state.accountExists(addr));
    
    // Get the account
    const account = state.getAccount(addr);
    try testing.expect(account != null);
    try testing.expectEqual(@as(u256, 0), account.?.getBalance());
    try testing.expectEqual(@as(u64, 0), account.?.getNonce());
}

test "Account balance operations" {
    const allocator = testing.allocator;
    var state = StateDB.init(allocator);
    defer state.deinit();
    
    const addr = try addressFromHexString("0x1234567890123456789012345678901234567890");
    
    // Initially balance should be 0
    try testing.expectEqual(@as(u256, 0), state.getBalance(addr));
    
    // Set balance
    try state.setBalance(addr, 1000);
    try testing.expectEqual(@as(u256, 1000), state.getBalance(addr));
    try testing.expect(state.accountExists(addr));
    
    // Add to balance
    try state.addBalance(addr, 500);
    try testing.expectEqual(@as(u256, 1500), state.getBalance(addr));
    
    // Subtract from balance
    try state.subBalance(addr, 200);
    try testing.expectEqual(@as(u256, 1300), state.getBalance(addr));
    
    // Cannot subtract more than balance
    try testing.expectError(error.InsufficientBalance, state.subBalance(addr, 2000));
    try testing.expectEqual(@as(u256, 1300), state.getBalance(addr));
}

test "Account nonce operations" {
    const allocator = testing.allocator;
    var state = StateDB.init(allocator);
    defer state.deinit();
    
    const addr = try addressFromHexString("0x1234567890123456789012345678901234567890");
    
    // Initially nonce should be 0
    try testing.expectEqual(@as(u64, 0), state.getNonce(addr));
    
    // Set nonce
    try state.setNonce(addr, 5);
    try testing.expectEqual(@as(u64, 5), state.getNonce(addr));
    try testing.expect(state.accountExists(addr));
    
    // Increment nonce
    try state.incrementNonce(addr);
    try testing.expectEqual(@as(u64, 6), state.getNonce(addr));
}

test "Account code operations" {
    const allocator = testing.allocator;
    var state = StateDB.init(allocator);
    defer state.deinit();
    
    const addr = try addressFromHexString("0x1234567890123456789012345678901234567890");
    
    // Initially code should be null
    try testing.expect(state.getCode(addr) == null);
    try testing.expectEqual(@as(usize, 0), state.getCodeSize(addr));
    try testing.expect(B256.isZero(state.getCodeHash(addr)));
    
    // Set code
    const code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0x52 }; // PUSH1 0 PUSH1 0 MSTORE
    try state.setCode(addr, &code);
    
    // Check code was set
    try testing.expect(state.getCode(addr) != null);
    try testing.expectEqual(code.len, state.getCodeSize(addr));
    try testing.expect(!B256.isZero(state.getCodeHash(addr)));
    
    // Check code content
    const stored_code = state.getCode(addr).?;
    try testing.expectEqualSlices(u8, &code, stored_code);
}

test "Storage operations" {
    const allocator = testing.allocator;
    var state = StateDB.init(allocator);
    defer state.deinit();
    
    const addr = try addressFromHexString("0x1234567890123456789012345678901234567890");
    const key = B256.fromInt(123);
    const value = B256.fromInt(456);
    
    // Initially storage should be zero
    const initial = try state.getState(addr, key);
    try testing.expect(B256.isZero(initial));
    
    // Set storage
    try state.setState(addr, key, value);
    const stored = try state.getState(addr, key);
    try testing.expect(B256.equal(value, stored));
    
    // Change storage value
    const value2 = B256.fromInt(789);
    try state.setState(addr, key, value2);
    const stored2 = try state.getState(addr, key);
    try testing.expect(B256.equal(value2, stored2));
}

test "Snapshots and reverts" {
    const allocator = testing.allocator;
    var state = StateDB.init(allocator);
    defer state.deinit();
    
    const addr = try addressFromHexString("0x1234567890123456789012345678901234567890");
    
    // Set initial state
    try state.setBalance(addr, 1000);
    try state.setNonce(addr, 5);
    
    // Create snapshot
    const snapshot1 = try state.snapshot();
    
    // Modify state
    try state.addBalance(addr, 500);
    try state.incrementNonce(addr);
    
    // Verify modifications
    try testing.expectEqual(@as(u256, 1500), state.getBalance(addr));
    try testing.expectEqual(@as(u64, 6), state.getNonce(addr));
    
    // Revert to snapshot
    try state.revertToSnapshot(snapshot1);
    
    // Verify state was reverted
    try testing.expectEqual(@as(u256, 1000), state.getBalance(addr));
    try testing.expectEqual(@as(u64, 5), state.getNonce(addr));
}

test "Account deletion" {
    const allocator = testing.allocator;
    var state = StateDB.init(allocator);
    defer state.deinit();
    
    const addr = try addressFromHexString("0x1234567890123456789012345678901234567890");
    
    // Create and set up account
    try state.createAccount(addr);
    try state.setBalance(addr, 1000);
    try state.setNonce(addr, 5);
    try testing.expect(state.accountExists(addr));
    
    // Delete account
    try state.deleteAccount(addr);
    try testing.expect(!state.accountExists(addr));
    try testing.expectEqual(@as(u256, 0), state.getBalance(addr));
    try testing.expectEqual(@as(u64, 0), state.getNonce(addr));
}

test "Refund operations" {
    const allocator = testing.allocator;
    var state = StateDB.init(allocator);
    defer state.deinit();
    
    // Initially refund should be 0
    try testing.expectEqual(@as(u64, 0), state.getRefund());
    
    // Add to refund
    try state.addRefund(500);
    try testing.expectEqual(@as(u64, 500), state.getRefund());
    
    // Add more to refund
    try state.addRefund(300);
    try testing.expectEqual(@as(u64, 800), state.getRefund());
    
    // Subtract from refund
    try state.subRefund(200);
    try testing.expectEqual(@as(u64, 600), state.getRefund());
    
    // Subtract more than refund clamps to 0
    try state.subRefund(1000);
    try testing.expectEqual(@as(u64, 0), state.getRefund());
}

test "Empty account checks" {
    const allocator = testing.allocator;
    var state = StateDB.init(allocator);
    defer state.deinit();
    
    const addr = try addressFromHexString("0x1234567890123456789012345678901234567890");
    
    // Initially account is empty (doesn't exist)
    try testing.expect(state.isEmpty(addr));
    
    // Create account
    try state.createAccount(addr);
    
    // New account with no balance, nonce, or code is empty
    try testing.expect(state.isEmpty(addr));
    
    // Account with balance is not empty
    try state.setBalance(addr, 1);
    try testing.expect(!state.isEmpty(addr));
    try state.setBalance(addr, 0);
    
    // Account with nonce is not empty
    try state.setNonce(addr, 1);
    try testing.expect(!state.isEmpty(addr));
    try state.setNonce(addr, 0);
    
    // Account with code is not empty
    try state.setCode(addr, &[_]u8{0x60});
    try testing.expect(!state.isEmpty(addr));
}

test "Complex state transitions with snapshots" {
    const allocator = testing.allocator;
    var state = StateDB.init(allocator);
    defer state.deinit();
    
    const addr1 = try addressFromHexString("0x1111111111111111111111111111111111111111");
    const addr2 = try addressFromHexString("0x2222222222222222222222222222222222222222");
    const key = B256.fromInt(123);
    
    // Initial setup
    try state.createAccount(addr1);
    try state.setBalance(addr1, 1000);
    try state.setNonce(addr1, 1);
    
    try state.createAccount(addr2);
    try state.setBalance(addr2, 500);
    
    // Create snapshot 1
    const snapshot1 = try state.snapshot();
    
    // Perform operations
    try state.addBalance(addr1, 200);
    try state.incrementNonce(addr1);
    try state.setState(addr1, key, B256.fromInt(100));
    
    try state.subBalance(addr2, 100);
    
    // Create snapshot 2
    const snapshot2 = try state.snapshot();
    
    // More operations
    try state.addBalance(addr1, 300);
    try state.deleteAccount(addr2);
    
    // Verify current state
    try testing.expectEqual(@as(u256, 1500), state.getBalance(addr1));
    try testing.expectEqual(@as(u64, 2), state.getNonce(addr1));
    try testing.expect(!state.accountExists(addr2));
    
    // Revert to snapshot 2
    try state.revertToSnapshot(snapshot2);
    
    // Verify state after revert to snapshot 2
    try testing.expectEqual(@as(u256, 1200), state.getBalance(addr1));
    try testing.expectEqual(@as(u64, 2), state.getNonce(addr1));
    try testing.expect(state.accountExists(addr2));
    try testing.expectEqual(@as(u256, 400), state.getBalance(addr2));
    
    // Revert to snapshot 1
    try state.revertToSnapshot(snapshot1);
    
    // Verify state after revert to snapshot 1
    try testing.expectEqual(@as(u256, 1000), state.getBalance(addr1));
    try testing.expectEqual(@as(u64, 1), state.getNonce(addr1));
    
    const initial_storage = try state.getState(addr1, key);
    try testing.expect(B256.isZero(initial_storage));
    
    try testing.expectEqual(@as(u256, 500), state.getBalance(addr2));
}