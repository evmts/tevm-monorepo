// Simple test for database interface without full EVM integration
const std = @import("std");
const testing = std.testing;

// Import our database modules directly
const DatabaseInterface = @import("src/evm/state/database_interface.zig").DatabaseInterface;
const DatabaseError = @import("src/evm/state/database_interface.zig").DatabaseError;
const Account = @import("src/evm/state/database_interface.zig").Account;
const MemoryDatabase = @import("src/evm/state/memory_database.zig").MemoryDatabase;

// Test helper
fn createTestAddress(value: u8) [20]u8 {
    var addr = [_]u8{0} ** 20;
    addr[19] = value;
    return addr;
}

test "memory database basic operations" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    
    const addr = createTestAddress(1);
    const account = Account{
        .balance = 1000,
        .nonce = 1,
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    };

    // Test account operations
    try testing.expect(!db_interface.account_exists(addr));
    try testing.expect(try db_interface.get_account(addr) == null);

    try db_interface.set_account(addr, account);
    try testing.expect(db_interface.account_exists(addr));
    
    const retrieved_account = try db_interface.get_account(addr);
    try testing.expect(retrieved_account != null);
    try testing.expectEqual(account.balance, retrieved_account.?.balance);
    try testing.expectEqual(account.nonce, retrieved_account.?.nonce);

    // Test storage operations
    try testing.expectEqual(@as(u256, 0), try db_interface.get_storage(addr, 0));
    try db_interface.set_storage(addr, 0, 123);
    try testing.expectEqual(@as(u256, 123), try db_interface.get_storage(addr, 0));

    // Test code operations
    const test_code = [_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01 };
    const code_hash = try db_interface.set_code(&test_code);
    const retrieved_code = try db_interface.get_code(code_hash);
    try testing.expectEqualSlices(u8, &test_code, retrieved_code);
}

test "memory database snapshots" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    
    const addr = createTestAddress(1);
    const account1 = Account{
        .balance = 1000,
        .nonce = 1,
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    };
    const account2 = Account{
        .balance = 2000,
        .nonce = 2,
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    };

    // Set initial state
    try db_interface.set_account(addr, account1);
    try db_interface.set_storage(addr, 0, 100);

    // Create snapshot
    const snapshot_id = try db_interface.create_snapshot();

    // Modify state
    try db_interface.set_account(addr, account2);
    try db_interface.set_storage(addr, 0, 200);

    // Verify modified state
    const modified_account = try db_interface.get_account(addr);
    try testing.expectEqual(account2.balance, modified_account.?.balance);
    try testing.expectEqual(@as(u256, 200), try db_interface.get_storage(addr, 0));

    // Revert to snapshot
    try db_interface.revert_to_snapshot(snapshot_id);

    // Verify reverted state
    const reverted_account = try db_interface.get_account(addr);
    try testing.expectEqual(account1.balance, reverted_account.?.balance);
    try testing.expectEqual(@as(u256, 100), try db_interface.get_storage(addr, 0));
}

test "memory database batch operations" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    
    const addr1 = createTestAddress(1);
    const addr2 = createTestAddress(2);
    const account1 = Account{
        .balance = 1000,
        .nonce = 1,
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    };
    const account2 = Account{
        .balance = 2000,
        .nonce = 2,
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    };

    // Test batch commit
    try db_interface.begin_batch();
    try db_interface.set_account(addr1, account1);
    try db_interface.set_account(addr2, account2);
    try db_interface.set_storage(addr1, 0, 123);
    try db_interface.commit_batch();

    // Verify batch was committed
    try testing.expect(db_interface.account_exists(addr1));
    try testing.expect(db_interface.account_exists(addr2));
    try testing.expectEqual(@as(u256, 123), try db_interface.get_storage(addr1, 0));
}