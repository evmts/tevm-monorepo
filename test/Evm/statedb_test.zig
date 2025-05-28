const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const StateDB = evm.StateDB;
const Journal = evm.Journal;
const B256 = evm.B256;
const Address = evm.Address;

// Helper for zero B256
const ZERO_B256 = B256{ .bytes = [_]u8{0} ** 32 };

test "StateDB: init and deinit" {
    const allocator = testing.allocator;
    
    // Create journal
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    // Create StateDB
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    // Verify initial state
    try testing.expectEqual(@as(usize, 0), state_db.accounts.count());
    try testing.expectEqual(@as(usize, 0), state_db.codes.count());
}

test "StateDB: account creation and existence" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    const address: Address = [_]u8{0x11} ** 20;
    
    // Account should not exist initially
    try testing.expect(!state_db.accountExists(address));
    try testing.expect(state_db.isEmpty(address));
    
    // Get or create account
    const account = try state_db.getAccount(address);
    try testing.expectEqual(@as(u64, 0), account.account.nonce);
    try testing.expectEqual(@as(u256, 0), account.account.balance);
    try testing.expect(account.account.code_hash.eql(StateDB.EMPTY_CODE_HASH));
    
    // Account should exist after creation
    try testing.expect(state_db.accountExists(address));
    try testing.expect(state_db.isEmpty(address));
}

test "StateDB: balance operations" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    const address: Address = [_]u8{0x22} ** 20;
    
    // Initial balance should be 0
    try testing.expectEqual(@as(u256, 0), state_db.getBalance(address));
    
    // Set balance
    try state_db.setBalance(address, 1000);
    try testing.expectEqual(@as(u256, 1000), state_db.getBalance(address));
    
    // Add balance
    try state_db.addBalance(address, 500);
    try testing.expectEqual(@as(u256, 1500), state_db.getBalance(address));
    
    // Subtract balance
    try state_db.subBalance(address, 500);
    try testing.expectEqual(@as(u256, 1000), state_db.getBalance(address));
    
    // Test insufficient balance
    try testing.expectError(error.InsufficientBalance, state_db.subBalance(address, 2000));
}

test "StateDB: nonce operations" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    const address: Address = [_]u8{0x33} ** 20;
    
    // Initial nonce should be 0
    try testing.expectEqual(@as(u64, 0), state_db.getNonce(address));
    
    // Set nonce
    try state_db.setNonce(address, 5);
    try testing.expectEqual(@as(u64, 5), state_db.getNonce(address));
    
    // Increment nonce
    try state_db.incrementNonce(address);
    try testing.expectEqual(@as(u64, 6), state_db.getNonce(address));
}

test "StateDB: transfer operations" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    const sender: Address = [_]u8{0x44} ** 20;
    const recipient: Address = [_]u8{0x55} ** 20;
    
    // Set initial balance for sender
    try state_db.setBalance(sender, 1000);
    
    // Transfer
    try state_db.transfer(sender, recipient, 300);
    
    // Check balances
    try testing.expectEqual(@as(u256, 700), state_db.getBalance(sender));
    try testing.expectEqual(@as(u256, 300), state_db.getBalance(recipient));
    
    // Test insufficient balance transfer
    try testing.expectError(error.InsufficientBalance, state_db.transfer(sender, recipient, 1000));
}

test "StateDB: account deletion" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    const address: Address = [_]u8{0x66} ** 20;
    
    // Create account with balance
    try state_db.setBalance(address, 1000);
    try testing.expect(state_db.accountExists(address));
    
    // Delete account
    try state_db.deleteAccount(address);
    
    // Check deletion
    try testing.expect(!state_db.accountExists(address));
    try testing.expect(state_db.isDeleted(address));
    
    // Deleted account should return 0 balance
    try testing.expectEqual(@as(u256, 0), state_db.getBalance(address));
}

test "StateDB: code operations" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    const address: Address = [_]u8{0x77} ** 20;
    const code = [_]u8{0x60, 0x80, 0x60, 0x40}; // PUSH1 0x80 PUSH1 0x40
    
    // Initial code should be empty
    try testing.expectEqual(@as(usize, 0), state_db.getCodeSize(address));
    try testing.expect(state_db.getCodeHash(address).eql(StateDB.EMPTY_CODE_HASH));
    
    // Set code
    try state_db.setCode(address, &code);
    
    // Check code
    try testing.expectEqual(@as(usize, 4), state_db.getCodeSize(address));
    try testing.expectEqualSlices(u8, &code, state_db.getCode(address));
    
    // Code hash should change
    try testing.expect(!state_db.getCodeHash(address).eql(StateDB.EMPTY_CODE_HASH));
    
    // Test code size limit (EIP-170)
    const large_code = try allocator.alloc(u8, 24577);
    defer allocator.free(large_code);
    @memset(large_code, 0x00);
    
    try testing.expectError(error.CodeTooLarge, state_db.setCode(address, large_code));
    
    // Test invalid code prefix (EIP-3541)
    const invalid_code = [_]u8{0xEF, 0x00};
    try testing.expectError(error.InvalidCodePrefix, state_db.setCode(address, &invalid_code));
}

test "StateDB: storage operations" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    const address: Address = [_]u8{0x88} ** 20;
    const key = B256{ .bytes = [_]u8{0x01} ** 32 };
    const value = B256{ .bytes = [_]u8{0x02} ** 32 };
    
    // Initial storage should be zero
    try testing.expect(state_db.getStorage(address, key).eql(ZERO_B256));
    
    // Set storage
    try state_db.setStorage(address, key, value);
    try testing.expect(state_db.getStorage(address, key).eql(value));
    
    // Get committed storage (original value)
    try testing.expect(state_db.getCommittedStorage(address, key).eql(ZERO_B256));
    
    // Clear storage
    try state_db.clearStorage(address);
    try testing.expect(state_db.getStorage(address, key).eql(ZERO_B256));
}

test "StateDB: snapshot and revert" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    const address: Address = [_]u8{0x99} ** 20;
    
    // Set initial state
    try state_db.setBalance(address, 1000);
    try state_db.setNonce(address, 5);
    
    // Create snapshot
    const snap = try state_db.snapshot();
    
    // Modify state
    try state_db.setBalance(address, 2000);
    try state_db.setNonce(address, 10);
    
    // Verify changes
    try testing.expectEqual(@as(u256, 2000), state_db.getBalance(address));
    try testing.expectEqual(@as(u64, 10), state_db.getNonce(address));
    
    // Revert to snapshot
    try state_db.revertToSnapshot(snap);
    
    // Debug: print values after revert
    const balance_after = state_db.getBalance(address);
    const nonce_after = state_db.getNonce(address);
    if (balance_after != 1000 or nonce_after != 5) {
        std.debug.print("\nSnapshot revert failed: balance={}, nonce={}, expected balance=1000, nonce=5\n", .{balance_after, nonce_after});
        std.debug.print("Journal checkpoints: {}, changes: {}, snap={}\n", .{journal.checkpoints.items.len, journal.changes.items.len, snap});
    }
    
    // State should be reverted
    try testing.expectEqual(@as(u256, 1000), state_db.getBalance(address));
    try testing.expectEqual(@as(u64, 5), state_db.getNonce(address));
    
    // Test invalid snapshot
    try testing.expectError(error.InvalidSnapshot, state_db.revertToSnapshot(999));
}

test "StateDB: touch and empty account cleanup" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    const address: Address = [_]u8{0xAA} ** 20;
    
    // Touch an empty account
    try state_db.touch(address);
    
    // Account should exist but be empty
    try testing.expect(state_db.accountExists(address));
    try testing.expect(state_db.isEmpty(address));
    
    // Get the account and verify it's touched
    const account = try state_db.getAccount(address);
    try testing.expect(account.touched);
    
    // Finalize should remove touched empty accounts
    try state_db.finalize();
    
    // Account should be marked for deletion
    try testing.expect(state_db.isDeleted(address));
}

test "StateDB: refund operations" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    // Initial refund should be 0
    try testing.expectEqual(@as(u64, 0), state_db.getRefund());
    
    // Add refund
    try state_db.addRefund(1000);
    try testing.expectEqual(@as(u64, 1000), state_db.getRefund());
    
    // Add more refund
    try state_db.addRefund(500);
    try testing.expectEqual(@as(u64, 1500), state_db.getRefund());
    
    // Subtract refund
    try state_db.subRefund(300);
    try testing.expectEqual(@as(u64, 1200), state_db.getRefund());
}

test "StateDB: dirty accounts tracking" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    const address1: Address = [_]u8{0xBB} ** 20;
    const address2: Address = [_]u8{0xCC} ** 20;
    
    // Initially no dirty accounts
    const initial_dirty = try state_db.getDirtyAccounts();
    defer allocator.free(initial_dirty);
    try testing.expectEqual(@as(usize, 0), initial_dirty.len);
    
    // Modify accounts
    try state_db.setBalance(address1, 1000);
    try state_db.setNonce(address2, 5);
    
    // Check dirty accounts
    const dirty = try state_db.getDirtyAccounts();
    defer allocator.free(dirty);
    try testing.expectEqual(@as(usize, 2), dirty.len);
}

test "StateDB: access list operations" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    const address: Address = [_]u8{0xDD} ** 20;
    const storage_key = B256{ .bytes = [_]u8{0x03} ** 32 };
    
    // Access account (should return true for first access)
    const account_cold = try state_db.accessAccount(address);
    try testing.expect(account_cold);
    
    // Access again (should return false for warm access)
    const account_warm = try state_db.accessAccount(address);
    try testing.expect(!account_warm);
    
    // Access storage (should return true for first access)
    const storage_cold = try state_db.accessStorage(address, storage_key);
    try testing.expect(storage_cold);
    
    // Access again (should return false for warm access)
    const storage_warm = try state_db.accessStorage(address, storage_key);
    try testing.expect(!storage_warm);
}

test "StateDB: complex scenario with multiple operations" {
    const allocator = testing.allocator;
    
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    var state_db = try StateDB.init(allocator, &journal);
    defer state_db.deinit();
    
    const deployer: Address = [_]u8{0xEE} ** 20;
    const contract: Address = [_]u8{0xFF} ** 20;
    const user: Address = [_]u8{0x11, 0x11} ** 10;
    
    // Deploy contract scenario
    try state_db.setBalance(deployer, 10000);
    
    // Create snapshot before deployment
    _ = try state_db.snapshot();
    
    // Deploy contract
    try state_db.createAccount(contract);
    const bytecode = [_]u8{0x60, 0x80, 0x60, 0x40, 0x52}; // Simple bytecode
    try state_db.setCode(contract, &bytecode);
    try state_db.setNonce(contract, 1);
    
    // Transfer some ETH to contract
    try state_db.transfer(deployer, contract, 1000);
    
    // Contract stores some data
    const storage_key = B256{ .bytes = [_]u8{0x04} ** 32 };
    const storage_value = B256{ .bytes = [_]u8{0x05} ** 32 };
    try state_db.setStorage(contract, storage_key, storage_value);
    
    // User interacts with contract
    try state_db.setBalance(user, 500);
    try state_db.transfer(user, contract, 100);
    
    // Verify state
    try testing.expectEqual(@as(u256, 9000), state_db.getBalance(deployer));
    try testing.expectEqual(@as(u256, 1100), state_db.getBalance(contract));
    try testing.expectEqual(@as(u256, 400), state_db.getBalance(user));
    try testing.expectEqual(@as(usize, bytecode.len), state_db.getCodeSize(contract));
    try testing.expect(state_db.getStorage(contract, storage_key).eql(storage_value));
    
    // Test revert scenario
    const before_fail = try state_db.snapshot();
    
    // Simulate failed transaction
    try testing.expectError(error.InsufficientBalance, state_db.transfer(user, contract, 1000));
    
    // Even though transfer failed, user's nonce might have increased
    try state_db.incrementNonce(user);
    
    // Revert failed transaction
    try state_db.revertToSnapshot(before_fail);
    
    // Verify state is correct after revert
    try testing.expectEqual(@as(u256, 400), state_db.getBalance(user));
    try testing.expectEqual(@as(u64, 0), state_db.getNonce(user));
}