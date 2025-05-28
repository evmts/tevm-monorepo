const std = @import("std");
const journal_mod = @import("Journal.zig");
const Journal = journal_mod.Journal;
const JournalError = journal_mod.JournalError;

// Type definitions - use Journal's types for compatibility
pub const Address = journal_mod.Address;
pub const B256 = journal_mod.B256;

// Helper for zero B256
const ZERO_B256 = B256{ .bytes = [_]u8{0} ** 32 };

/// Error types for StateDB operations
pub const StateDBError = error{
    AccountNotFound,
    InsufficientBalance,
    NonceOverflow,
    CodeTooLarge,
    OutOfMemory,
    InvalidSnapshot,
    InvalidCodePrefix,
};

/// Snapshot identifier for state reversion
pub const Snapshot = u32;

/// Account data structure
pub const Account = struct {
    nonce: u64,
    balance: u256,
    storage_root: B256,
    code_hash: B256,
};

/// Storage implementation
pub const Storage = struct {
    slots: std.AutoHashMap(B256, B256),
    allocator: std.mem.Allocator,
    
    pub fn init(allocator: std.mem.Allocator) !Storage {
        return Storage{
            .slots = std.AutoHashMap(B256, B256).init(allocator),
            .allocator = allocator,
        };
    }
    
    pub fn deinit(self: *Storage) void {
        self.slots.deinit();
    }
    
    pub fn get(self: *const Storage, key: B256) B256 {
        return self.slots.get(key) orelse ZERO_B256;
    }
    
    pub fn set(self: *Storage, key: B256, value: B256) !void {
        if (value.eql(ZERO_B256)) {
            _ = self.slots.remove(key);
        } else {
            try self.slots.put(key, value);
        }
    }
    
    pub fn clear(self: *Storage) void {
        self.slots.clearRetainingCapacity();
    }
};

/// Account state wrapper with caching
pub const AccountState = struct {
    /// The account data
    account: Account,
    /// Storage for this account
    storage: Storage,
    /// Original values for modified storage slots
    original_storage: std.AutoHashMap(B256, B256),
    /// Cached code (loaded on demand)
    code: ?[]const u8,
    /// Dirty flags for optimization
    dirty: bool,
    dirty_code: bool,
    /// Deletion flag
    deleted: bool,
    /// Touch flag for empty account cleanup
    touched: bool,
    /// Storage clear flag
    storage_cleared: bool,
    /// Allocator
    allocator: std.mem.Allocator,

    /// Initialize account state
    pub fn init(allocator: std.mem.Allocator) !AccountState {
        return AccountState{
            .account = Account{
                .nonce = 0,
                .balance = 0,
                .storage_root = StateDB.EMPTY_STORAGE_ROOT,
                .code_hash = StateDB.EMPTY_CODE_HASH,
            },
            .storage = try Storage.init(allocator),
            .original_storage = std.AutoHashMap(B256, B256).init(allocator),
            .code = null,
            .dirty = false,
            .dirty_code = false,
            .deleted = false,
            .touched = false,
            .storage_cleared = false,
            .allocator = allocator,
        };
    }

    /// Clean up resources
    pub fn deinit(self: *AccountState) void {
        self.storage.deinit();
        self.original_storage.deinit();
        if (self.code) |code| {
            self.allocator.free(code);
        }
    }

    /// Mark account as dirty
    pub fn markDirty(self: *AccountState) void {
        self.dirty = true;
    }

    /// Check if account is empty
    pub fn isEmpty(self: *const AccountState) bool {
        return self.account.nonce == 0 and 
               self.account.balance == 0 and
               self.account.code_hash.eql(StateDB.EMPTY_CODE_HASH);
    }

    /// Get storage value with caching
    pub fn getStorage(self: *AccountState, key: B256) B256 {
        return self.storage.get(key);
    }

    /// Set storage value with dirty tracking
    pub fn setStorage(self: *AccountState, key: B256, value: B256) !void {
        // Track original value if not already tracked
        if (!self.original_storage.contains(key)) {
            const original = self.getStorage(key);
            try self.original_storage.put(key, original);
        }
        
        try self.storage.set(key, value);
        self.markDirty();
    }

    /// Get original storage value
    pub fn getOriginalStorage(self: *AccountState, key: B256) B256 {
        if (self.original_storage.get(key)) |original| {
            return original;
        }
        return self.getStorage(key);
    }

    /// Clear all storage
    pub fn clearStorage(self: *AccountState) !void {
        // Save all current values as originals before clearing
        var iter = self.storage.slots.iterator();
        while (iter.next()) |entry| {
            if (!self.original_storage.contains(entry.key_ptr.*)) {
                try self.original_storage.put(entry.key_ptr.*, entry.value_ptr.*);
            }
        }
        
        self.storage.clear();
        self.storage_cleared = true;
        self.markDirty();
    }
};

/// StateDB - Primary interface for managing Ethereum state
pub const StateDB = struct {
    /// Account states indexed by address
    accounts: std.AutoHashMap(Address, *AccountState),
    /// Journal for tracking changes
    journal: *Journal,
    /// Code storage indexed by code hash
    codes: std.AutoHashMap(B256, []const u8),
    /// Snapshot counter
    snapshot_id: u32,
    /// Allocator for memory management
    allocator: std.mem.Allocator,
    
    /// Empty code hash constant
    pub const EMPTY_CODE_HASH = B256{ .bytes = [_]u8{
        0xc5, 0xd2, 0x46, 0x01, 0x86, 0xf7, 0x23, 0x3c,
        0x92, 0x7e, 0x7d, 0xb2, 0xdc, 0xc7, 0x03, 0xc0,
        0xe5, 0x00, 0xb6, 0x53, 0xca, 0x82, 0x27, 0x3b,
        0x7b, 0xfa, 0xd8, 0x04, 0x5d, 0x85, 0xa4, 0x70
    }};
    
    /// Empty storage root constant
    pub const EMPTY_STORAGE_ROOT = B256{ .bytes = [_]u8{
        0x56, 0xe8, 0x1f, 0x17, 0x1b, 0xcc, 0x55, 0xa6,
        0xff, 0x83, 0x45, 0xe6, 0x92, 0xc0, 0xf8, 0x6e,
        0x5b, 0x48, 0xe0, 0x1b, 0x99, 0x6c, 0xad, 0xc0,
        0x01, 0x62, 0x2f, 0xb5, 0xe3, 0x63, 0xb4, 0x21
    }};

    // Initialization

    /// Create a new StateDB
    pub fn init(allocator: std.mem.Allocator, journal: *Journal) !StateDB {
        return StateDB{
            .accounts = std.AutoHashMap(Address, *AccountState).init(allocator),
            .journal = journal,
            .codes = std.AutoHashMap(B256, []const u8).init(allocator),
            .snapshot_id = 0,
            .allocator = allocator,
        };
    }

    /// Clean up resources
    pub fn deinit(self: *StateDB) void {
        // Clean up all account states
        var iter = self.accounts.iterator();
        while (iter.next()) |entry| {
            entry.value_ptr.*.deinit();
            self.allocator.destroy(entry.value_ptr.*);
        }
        self.accounts.deinit();
        
        // Clean up code storage
        var code_iter = self.codes.iterator();
        while (code_iter.next()) |entry| {
            self.allocator.free(entry.value_ptr.*);
        }
        self.codes.deinit();
    }

    // Account Management

    /// Get or create account state
    pub fn getAccount(self: *StateDB, address: Address) !*AccountState {
        // Check cache first
        if (self.accounts.get(address)) |account| {
            return account;
        }
        
        // Create new account state
        const account_state = try self.allocator.create(AccountState);
        account_state.* = try AccountState.init(self.allocator);
        
        // Record creation in journal
        try self.journal.recordAccountCreated(address);
        
        // Add to cache
        try self.accounts.put(address, account_state);
        
        return account_state;
    }

    /// Check if account exists
    pub fn accountExists(self: *const StateDB, address: Address) bool {
        if (self.accounts.get(address)) |account| {
            return !account.deleted;
        }
        return false;
    }

    /// Check if account is empty (no balance, nonce, code)
    pub fn isEmpty(self: *const StateDB, address: Address) bool {
        if (self.accounts.get(address)) |account| {
            return account.isEmpty();
        }
        return true;
    }

    /// Create a new account
    pub fn createAccount(self: *StateDB, address: Address) !void {
        const account = try self.getAccount(address);
        
        // If account already exists with state, record for journal
        if (!account.isEmpty() or account.code != null) {
            try self.journal.recordAccountDestroyed(
                address,
                account.account.balance,
                account.account.nonce,
                account.account.code_hash,
            );
        }
        
        // Reset account to new state
        account.account = Account{
            .nonce = 0,
            .balance = 0,
            .storage_root = StateDB.EMPTY_STORAGE_ROOT,
            .code_hash = StateDB.EMPTY_CODE_HASH,
        };
        account.storage.clear();
        account.code = null;
        account.deleted = false;
        account.markDirty();
    }

    /// Delete an account (SELFDESTRUCT)
    pub fn deleteAccount(self: *StateDB, address: Address) !void {
        const account = try self.getAccount(address);
        
        if (!account.deleted) {
            // Record deletion in journal
            try self.journal.recordAccountDestroyed(
                address,
                account.account.balance,
                account.account.nonce,
                account.account.code_hash,
            );
            
            account.deleted = true;
            account.markDirty();
        }
    }

    // Balance Operations

    /// Get account balance
    pub fn getBalance(self: *StateDB, address: Address) u256 {
        const account = self.getAccount(address) catch return 0;
        return if (account.deleted) 0 else account.account.balance;
    }

    /// Set account balance
    pub fn setBalance(self: *StateDB, address: Address, balance: u256) !void {
        const account = try self.getAccount(address);
        
        if (account.account.balance != balance) {
            // Record change in journal
            try self.journal.recordBalanceChange(address, account.account.balance);
            
            account.account.balance = balance;
            account.markDirty();
        }
    }

    /// Add to balance
    pub fn addBalance(self: *StateDB, address: Address, amount: u256) !void {
        const account = try self.getAccount(address);
        const new_balance = account.account.balance + amount;
        try self.setBalance(address, new_balance);
    }

    /// Subtract from balance (with underflow check)
    pub fn subBalance(self: *StateDB, address: Address, amount: u256) StateDBError!void {
        const account = try self.getAccount(address);
        
        if (account.account.balance < amount) {
            return error.InsufficientBalance;
        }
        
        const new_balance = account.account.balance - amount;
        try self.setBalance(address, new_balance);
    }

    /// Transfer balance between accounts
    pub fn transfer(self: *StateDB, from: Address, to: Address, amount: u256) StateDBError!void {
        // Check and subtract from sender
        try self.subBalance(from, amount);
        
        // Add to recipient
        try self.addBalance(to, amount);
    }

    // Nonce Operations

    /// Get account nonce
    pub fn getNonce(self: *StateDB, address: Address) u64 {
        const account = self.getAccount(address) catch return 0;
        return if (account.deleted) 0 else account.account.nonce;
    }

    /// Set account nonce
    pub fn setNonce(self: *StateDB, address: Address, nonce: u64) !void {
        const account = try self.getAccount(address);
        
        if (account.account.nonce != nonce) {
            // Record change in journal
            try self.journal.recordNonceChange(address, account.account.nonce);
            
            account.account.nonce = nonce;
            account.markDirty();
        }
    }

    /// Increment nonce (with overflow check)
    pub fn incrementNonce(self: *StateDB, address: Address) StateDBError!void {
        const account = try self.getAccount(address);
        
        if (account.account.nonce == std.math.maxInt(u64)) {
            return error.NonceOverflow;
        }
        
        try self.setNonce(address, account.account.nonce + 1);
    }

    // Code Operations

    /// Get account code
    pub fn getCode(self: *StateDB, address: Address) []const u8 {
        const account = self.getAccount(address) catch return &[_]u8{};
        
        if (account.deleted) return &[_]u8{};
        
        // Return cached code if available
        if (account.code) |code| {
            return code;
        }
        
        // Load code from storage
        if (self.codes.get(account.account.code_hash)) |code| {
            return code;
        }
        
        return &[_]u8{};
    }

    /// Get account code hash
    pub fn getCodeHash(self: *StateDB, address: Address) B256 {
        const account = self.getAccount(address) catch return StateDB.EMPTY_CODE_HASH;
        return if (account.deleted) StateDB.EMPTY_CODE_HASH else account.account.code_hash;
    }

    /// Get account code size
    pub fn getCodeSize(self: *StateDB, address: Address) usize {
        return self.getCode(address).len;
    }

    /// Set account code
    pub fn setCode(self: *StateDB, address: Address, code: []const u8) StateDBError!void {
        // Check code size limit (EIP-3541)
        if (code.len > 0 and code[0] == 0xEF) {
            return error.InvalidCodePrefix;
        }
        
        // Check max code size (EIP-170)
        if (code.len > 24576) {
            return error.CodeTooLarge;
        }
        
        const account = try self.getAccount(address);
        
        // Calculate code hash
        var hash: B256 = undefined;
        if (code.len == 0) {
            hash = StateDB.EMPTY_CODE_HASH;
        } else {
            // TODO: Implement Keccak256
            // For now, use a placeholder
            hash = B256{ .bytes = [_]u8{1} ** 32 };
        }
        
        // Store code in global code storage
        if (code.len > 0) {
            const code_copy = try self.allocator.dupe(u8, code);
            try self.codes.put(hash, code_copy);
        }
        
        // Record change in journal
        try self.journal.recordCodeChange(address, account.account.code_hash, account.code orelse &[_]u8{});
        
        // Update account
        account.account.code_hash = hash;
        account.code = if (code.len > 0) code else null;
        account.dirty_code = true;
        account.markDirty();
    }

    // Storage Operations

    /// Get storage value
    pub fn getStorage(self: *StateDB, address: Address, key: B256) B256 {
        const account = self.getAccount(address) catch return ZERO_B256;
        
        // Access tracking for EIP-2929
        _ = self.journal.accessStorage(address, key) catch {};
        
        return account.getStorage(key);
    }

    /// Get committed (original) storage value
    pub fn getCommittedStorage(self: *StateDB, address: Address, key: B256) B256 {
        const account = self.getAccount(address) catch return ZERO_B256;
        return account.getOriginalStorage(key);
    }

    /// Set storage value
    pub fn setStorage(self: *StateDB, address: Address, key: B256, value: B256) !void {
        const account = try self.getAccount(address);
        
        // Get current value for journaling
        const current = account.getStorage(key);
        
        if (!current.eql(value)) {
            // Record change in journal
            try self.journal.recordStorageChange(address, key, current);
            
            // Update storage
            try account.setStorage(key, value);
        }
    }

    /// Clear all storage for an account
    pub fn clearStorage(self: *StateDB, address: Address) !void {
        const account = try self.getAccount(address);
        
        // Record in journal with current storage
        try self.journal.recordStorageCleared(address, account.storage.slots);
        
        // Clear storage
        try account.clearStorage();
    }

    // Access List Operations (EIP-2929)

    /// Add account to access list
    pub fn accessAccount(self: *StateDB, address: Address) !bool {
        return try self.journal.accessAccount(address);
    }

    /// Add storage slot to access list
    pub fn accessStorage(self: *StateDB, address: Address, key: B256) !bool {
        return try self.journal.accessStorage(address, key);
    }

    // Snapshot Operations

    /// Create a snapshot of current state
    pub fn snapshot(self: *StateDB) !Snapshot {
        // Create journal checkpoint
        try self.journal.checkpoint();
        
        // Return snapshot ID
        const snap = self.snapshot_id;
        self.snapshot_id += 1;
        
        return snap;
    }

    /// Revert to a snapshot
    pub fn revertToSnapshot(self: *StateDB, snap: Snapshot) !void {
        // Validate snapshot
        if (snap >= self.snapshot_id) {
            return error.InvalidSnapshot;
        }
        
        // Revert journal to checkpoint
        try self.journal.revert();
        
        // Apply reverted changes to state
        // Journal revert will call back into StateDB to apply changes
    }

    /// Commit current changes
    pub fn commit(self: *StateDB) !void {
        // Commit journal
        try self.journal.commit();
    }

    // State Root Operations

    /// Calculate current state root
    pub fn stateRoot(self: *StateDB) !B256 {
        _ = self;
        // TODO: Implement merkle trie calculation
        return ZERO_B256;
    }

    /// Intermediate state root (for debugging)
    pub fn intermediateRoot(self: *StateDB) !B256 {
        _ = self;
        // TODO: Implement merkle trie calculation
        return ZERO_B256;
    }

    // Utility Operations

    /// Touch account for EIP-158 empty account cleanup
    pub fn touch(self: *StateDB, address: Address) !void {
        const account = try self.getAccount(address);
        
        if (!account.touched) {
            // Record in journal
            try self.journal.recordTouched(address);
            
            account.touched = true;
            account.markDirty();
        }
    }

    /// Check if account is marked for deletion
    pub fn isDeleted(self: *const StateDB, address: Address) bool {
        if (self.accounts.get(address)) |account| {
            return account.deleted;
        }
        return false;
    }

    /// Get refund counter
    pub fn getRefund(self: *const StateDB) u64 {
        return self.journal.getRefund();
    }

    /// Add to refund counter
    pub fn addRefund(self: *StateDB, amount: u64) !void {
        try self.journal.addRefund(amount);
    }

    /// Subtract from refund counter
    pub fn subRefund(self: *StateDB, amount: u64) !void {
        try self.journal.subRefund(amount);
    }

    /// Finalize state after block execution
    pub fn finalize(self: *StateDB) !void {
        // Clean up empty accounts touched during execution
        var to_delete = std.ArrayList(Address).init(self.allocator);
        defer to_delete.deinit();
        
        var iter = self.accounts.iterator();
        while (iter.next()) |entry| {
            const account = entry.value_ptr.*;
            if (account.touched and account.isEmpty() and !account.deleted) {
                try to_delete.append(entry.key_ptr.*);
            }
        }
        
        // Delete empty touched accounts
        for (to_delete.items) |address| {
            try self.deleteAccount(address);
        }
    }

    /// Iterate over all accounts (for debugging)
    pub fn iterateAccounts(self: *StateDB, callback: fn(Address, *AccountState) void) void {
        var iter = self.accounts.iterator();
        while (iter.next()) |entry| {
            callback(entry.key_ptr.*, entry.value_ptr.*);
        }
    }

    /// Get dirty accounts (modified in current transaction)
    pub fn getDirtyAccounts(self: *StateDB) ![]const Address {
        var dirty = std.ArrayList(Address).init(self.allocator);
        defer dirty.deinit();
        
        var iter = self.accounts.iterator();
        while (iter.next()) |entry| {
            if (entry.value_ptr.*.dirty) {
                try dirty.append(entry.key_ptr.*);
            }
        }
        
        return dirty.toOwnedSlice();
    }
};