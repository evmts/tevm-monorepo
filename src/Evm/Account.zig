const std = @import("std");
const testing = std.testing;

// Import the unified B256 type
pub const B256 = @import("utils").B256;


/// Account represents an Ethereum account
/// Includes balance, nonce, code hash, and storage root
pub const Account = struct {
    /// Account balance in wei
    balance: u256,
    
    /// Account nonce (number of transactions sent from this account)
    nonce: u64,
    
    /// Root hash of the storage trie for this account
    storage_root: B256,
    
    /// Hash of the account's code
    code_hash: B256,
    
    /// Cached code for the account
    code: ?[]u8,
    
    /// Dirty tracking for optimization
    dirty_code: bool,
    dirty_balance: bool,
    dirty_nonce: bool,
    dirty_storage: bool,
    
    /// Create a new empty account
    pub fn init() Account {
        return Account{
            .balance = 0,
            .nonce = 0,
            .storage_root = B256.zero(),
            .code_hash = B256.zero(),
            .code = null,
            .dirty_code = false,
            .dirty_balance = false,
            .dirty_nonce = false,
            .dirty_storage = false,
        };
    }
    
    /// Create a new account with given balance
    pub fn initWithBalance(balance: u256) Account {
        var account = Account.init();
        account.balance = balance;
        account.dirty_balance = true;
        return account;
    }
    
    /// Get the account balance
    pub fn getBalance(self: *const Account) u256 {
        return self.balance;
    }
    
    /// Set the account balance
    pub fn setBalance(self: *Account, balance: u256) void {
        self.balance = balance;
        self.dirty_balance = true;
    }
    
    /// Add to the account balance
    pub fn addBalance(self: *Account, amount: u256) void {
        self.balance += amount;
        self.dirty_balance = true;
    }
    
    /// Subtract from the account balance
    pub fn subBalance(self: *Account, amount: u256) !void {
        if (self.balance < amount) {
            return error.InsufficientBalance;
        }
        self.balance -= amount;
        self.dirty_balance = true;
    }
    
    /// Get the account nonce
    pub fn getNonce(self: *const Account) u64 {
        return self.nonce;
    }
    
    /// Set the account nonce
    pub fn setNonce(self: *Account, nonce: u64) void {
        self.nonce = nonce;
        self.dirty_nonce = true;
    }
    
    /// Increment the account nonce
    pub fn incrementNonce(self: *Account) void {
        self.nonce += 1;
        self.dirty_nonce = true;
    }
    
    /// Get the code hash
    pub fn getCodeHash(self: *const Account) B256 {
        return self.code_hash;
    }
    
    /// Set the code and update the code hash
    pub fn setCode(self: *Account, allocator: std.mem.Allocator, code: []const u8) !void {
        // Free old code if it exists
        if (self.code) |old_code| {
            allocator.free(old_code);
        }
        
        // Copy new code
        if (code.len > 0) {
            self.code = try allocator.alloc(u8, code.len);
            @memcpy(self.code.?, code);
            
            // Calculate code hash
            var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
            hasher.update(code);
            var hash_result: [32]u8 = undefined;
            hasher.final(&hash_result);
            self.code_hash = B256.fromBytes(hash_result);
        } else {
            self.code = null;
            self.code_hash = B256.zero();
        }
        
        self.dirty_code = true;
    }
    
    /// Get the code
    pub fn getCode(self: *const Account) ?[]const u8 {
        if (self.code) |code| {
            return code;
        }
        return null;
    }
    
    /// Get the code size
    pub fn getCodeSize(self: *const Account) usize {
        if (self.code) |code| {
            return code.len;
        }
        return 0;
    }
    
    /// Check if the account is empty (has no balance, no nonce, and no code)
    pub fn isEmpty(self: *const Account) bool {
        return self.balance == 0 and
               self.nonce == 0 and
               B256.isZero(self.code_hash);
    }
    
    /// Check if the account has code
    pub fn hasCode(self: *const Account) bool {
        return !B256.isZero(self.code_hash);
    }
    
    /// Clean up resources
    pub fn deinit(self: *Account, allocator: std.mem.Allocator) void {
        if (self.code) |code| {
            allocator.free(code);
            self.code = null;
        }
    }
    
    /// Deep copy the account
    pub fn clone(self: *const Account, allocator: std.mem.Allocator) !Account {
        var new_account = Account{
            .balance = self.balance,
            .nonce = self.nonce,
            .storage_root = self.storage_root,
            .code_hash = self.code_hash,
            .code = null,
            .dirty_code = self.dirty_code,
            .dirty_balance = self.dirty_balance,
            .dirty_nonce = self.dirty_nonce,
            .dirty_storage = self.dirty_storage,
        };
        
        if (self.code) |code| {
            new_account.code = try allocator.alloc(u8, code.len);
            @memcpy(new_account.code.?, code);
        }
        
        return new_account;
    }
};

// Tests
test "Account initialization" {
    const account = Account.init();
    try testing.expectEqual(@as(u256, 0), account.balance);
    try testing.expectEqual(@as(u64, 0), account.nonce);
    try testing.expect(B256.isZero(account.storage_root));
    try testing.expect(B256.isZero(account.code_hash));
    try testing.expect(account.code == null);
    try testing.expect(!account.dirty_code);
    try testing.expect(!account.dirty_balance);
    try testing.expect(!account.dirty_nonce);
    try testing.expect(!account.dirty_storage);
}

test "Account with balance" {
    const balance: u256 = 1000;
    const account = Account.initWithBalance(balance);
    try testing.expectEqual(balance, account.balance);
    try testing.expect(account.dirty_balance);
}

test "Account balance operations" {
    var account = Account.init();
    
    // Test getBalance
    try testing.expectEqual(@as(u256, 0), account.getBalance());
    
    // Test setBalance
    account.setBalance(500);
    try testing.expectEqual(@as(u256, 500), account.getBalance());
    try testing.expect(account.dirty_balance);
    
    // Test addBalance
    account.addBalance(300);
    try testing.expectEqual(@as(u256, 800), account.getBalance());
    
    // Test subBalance
    try account.subBalance(300);
    try testing.expectEqual(@as(u256, 500), account.getBalance());
    
    // Test insufficient balance
    try testing.expectError(error.InsufficientBalance, account.subBalance(1000));
}

test "Account nonce operations" {
    var account = Account.init();
    
    // Test getNonce
    try testing.expectEqual(@as(u64, 0), account.getNonce());
    
    // Test setNonce
    account.setNonce(5);
    try testing.expectEqual(@as(u64, 5), account.getNonce());
    try testing.expect(account.dirty_nonce);
    
    // Test incrementNonce
    account.incrementNonce();
    try testing.expectEqual(@as(u64, 6), account.getNonce());
}

test "Account code operations" {
    const allocator = testing.allocator;
    var account = Account.init();
    defer account.deinit(allocator);
    
    // Test initial state
    try testing.expect(account.getCode() == null);
    try testing.expectEqual(@as(usize, 0), account.getCodeSize());
    try testing.expect(!account.hasCode());
    
    // Test setting code
    const code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0x52 }; // PUSH1 0 PUSH1 0 MSTORE
    try account.setCode(allocator, &code);
    
    // Verify code is set
    try testing.expect(account.getCode() != null);
    try testing.expectEqual(code.len, account.getCodeSize());
    try testing.expect(account.hasCode());
    try testing.expect(account.dirty_code);
    
    // Verify code content
    const stored_code = account.getCode().?;
    try testing.expectEqualSlices(u8, &code, stored_code);
    
    // Test setting empty code
    try account.setCode(allocator, &[_]u8{});
    try testing.expect(account.getCode() == null);
    try testing.expectEqual(@as(usize, 0), account.getCodeSize());
    try testing.expect(!account.hasCode());
}

test "Account isEmpty check" {
    const allocator = testing.allocator;
    var account = Account.init();
    defer account.deinit(allocator);
    
    // Initial account should be empty
    try testing.expect(account.isEmpty());
    
    // Account with balance should not be empty
    account.setBalance(1);
    try testing.expect(!account.isEmpty());
    account.setBalance(0);
    
    // Account with nonce should not be empty
    account.setNonce(1);
    try testing.expect(!account.isEmpty());
    account.setNonce(0);
    
    // Account with code should not be empty
    try account.setCode(allocator, &[_]u8{0x60});
    try testing.expect(!account.isEmpty());
}

test "Account clone" {
    const allocator = testing.allocator;
    var account = Account.init();
    defer account.deinit(allocator);
    
    // Setup account with data
    account.setBalance(1000);
    account.setNonce(5);
    try account.setCode(allocator, &[_]u8{ 0x60, 0x00, 0x60, 0x00, 0x52 });
    
    // Clone the account
    var cloned = try account.clone(allocator);
    defer cloned.deinit(allocator);
    
    // Verify clone has same data
    try testing.expectEqual(account.balance, cloned.balance);
    try testing.expectEqual(account.nonce, cloned.nonce);
    try testing.expectEqual(account.code_hash.bytes, cloned.code_hash.bytes);
    try testing.expectEqual(account.storage_root.bytes, cloned.storage_root.bytes);
    try testing.expectEqual(account.getCodeSize(), cloned.getCodeSize());
    
    if (account.code != null and cloned.code != null) {
        try testing.expectEqualSlices(u8, account.code.?, cloned.code.?);
    }
    
    // Verify clone and original are independent
    cloned.setBalance(2000);
    try testing.expectEqual(@as(u256, 1000), account.balance);
    try testing.expectEqual(@as(u256, 2000), cloned.balance);
}