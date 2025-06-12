//! Comprehensive tests for database interface implementations
//!
//! This test suite validates that all database implementations correctly
//! implement the database interface and behave consistently.

const std = @import("std");
const testing = std.testing;
const evm = @import("evm");

// Import the database interface and implementations from the state directory
const DatabaseInterface = @import("../../../src/evm/state/database_interface.zig").DatabaseInterface;
const DatabaseError = @import("../../../src/evm/state/database_interface.zig").DatabaseError;
const Account = @import("../../../src/evm/state/database_interface.zig").Account;
const MemoryDatabase = @import("../../../src/evm/state/memory_database.zig").MemoryDatabase;
const database_factory = @import("../../../src/evm/state/database_factory.zig");

// Test helper to create a test address
fn createTestAddress(value: u8) [20]u8 {
    var addr = [_]u8{0} ** 20;
    addr[19] = value;
    return addr;
}

// Test helper to create a test account
fn createTestAccount(balance: u256, nonce: u64) Account {
    return Account{
        .balance = balance,
        .nonce = nonce,
        .code_hash = [_]u8{0} ** 32,
        .storage_root = [_]u8{0} ** 32,
    };
}

// Test interface compliance for any database implementation
fn testDatabaseInterfaceCompliance(db: DatabaseInterface) !void {
    const addr1 = createTestAddress(1);
    const addr2 = createTestAddress(2);
    const account1 = createTestAccount(1000, 1);
    const account2 = createTestAccount(2000, 2);

    // Test account operations
    try testing.expect(!db.account_exists(addr1));
    try testing.expect(try db.get_account(addr1) == null);

    try db.set_account(addr1, account1);
    try testing.expect(db.account_exists(addr1));
    
    const retrieved_account = try db.get_account(addr1);
    try testing.expect(retrieved_account != null);
    try testing.expectEqual(account1.balance, retrieved_account.?.balance);
    try testing.expectEqual(account1.nonce, retrieved_account.?.nonce);

    // Test storage operations
    const storage_value = try db.get_storage(addr1, 0);
    try testing.expectEqual(@as(u256, 0), storage_value);

    try db.set_storage(addr1, 0, 123);
    try db.set_storage(addr1, 1, 456);
    
    try testing.expectEqual(@as(u256, 123), try db.get_storage(addr1, 0));
    try testing.expectEqual(@as(u256, 456), try db.get_storage(addr1, 1));
    try testing.expectEqual(@as(u256, 0), try db.get_storage(addr1, 2));

    // Test code operations
    const test_code = [_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01 }; // Simple bytecode
    const code_hash = try db.set_code(&test_code);
    
    const retrieved_code = try db.get_code(code_hash);
    try testing.expectEqualSlices(u8, &test_code, retrieved_code);

    // Test empty code hash
    const empty_hash = [_]u8{0} ** 32;
    const empty_code = try db.get_code(empty_hash);
    try testing.expectEqual(@as(usize, 0), empty_code.len);

    // Test account deletion
    try db.set_account(addr2, account2);
    try testing.expect(db.account_exists(addr2));
    
    try db.delete_account(addr2);
    try testing.expect(!db.account_exists(addr2));
    try testing.expect(try db.get_account(addr2) == null);
}

// Test snapshot functionality
fn testSnapshotFunctionality(db: DatabaseInterface) !void {
    const addr = createTestAddress(1);
    const account1 = createTestAccount(1000, 1);
    const account2 = createTestAccount(2000, 2);

    // Set initial state
    try db.set_account(addr, account1);
    try db.set_storage(addr, 0, 100);

    // Create snapshot
    const snapshot_id = try db.create_snapshot();

    // Modify state
    try db.set_account(addr, account2);
    try db.set_storage(addr, 0, 200);

    // Verify modified state
    const modified_account = try db.get_account(addr);
    try testing.expectEqual(account2.balance, modified_account.?.balance);
    try testing.expectEqual(@as(u256, 200), try db.get_storage(addr, 0));

    // Revert to snapshot
    try db.revert_to_snapshot(snapshot_id);

    // Verify reverted state
    const reverted_account = try db.get_account(addr);
    try testing.expectEqual(account1.balance, reverted_account.?.balance);
    try testing.expectEqual(@as(u256, 100), try db.get_storage(addr, 0));
}

// Test batch operations
fn testBatchOperations(db: DatabaseInterface) !void {
    const addr1 = createTestAddress(1);
    const addr2 = createTestAddress(2);
    const account1 = createTestAccount(1000, 1);
    const account2 = createTestAccount(2000, 2);

    // Test batch commit
    try db.begin_batch();
    try db.set_account(addr1, account1);
    try db.set_account(addr2, account2);
    try db.set_storage(addr1, 0, 123);
    try db.commit_batch();

    // Verify batch was committed
    try testing.expect(db.account_exists(addr1));
    try testing.expect(db.account_exists(addr2));
    try testing.expectEqual(@as(u256, 123), try db.get_storage(addr1, 0));

    // Test batch rollback
    const original_balance = (try db.get_account(addr1)).?.balance;
    
    try db.begin_batch();
    try db.set_account(addr1, createTestAccount(5000, 5));
    try db.set_storage(addr1, 1, 999);
    try db.rollback_batch();

    // Verify batch was rolled back
    const unchanged_account = try db.get_account(addr1);
    try testing.expectEqual(original_balance, unchanged_account.?.balance);
    try testing.expectEqual(@as(u256, 0), try db.get_storage(addr1, 1));
}

// Test error conditions
fn testErrorConditions(db: DatabaseInterface) !void {
    // Test invalid snapshot revert
    const result = db.revert_to_snapshot(999);
    try testing.expectError(DatabaseError.SnapshotNotFound, result);

    // Test batch operations without begin
    const batch_result = db.commit_batch();
    try testing.expectError(DatabaseError.NoBatchInProgress, batch_result);
}

// Test memory database specifically
test "memory database interface compliance" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    try testDatabaseInterfaceCompliance(db_interface);
}

test "memory database snapshots" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    try testSnapshotFunctionality(db_interface);
}

test "memory database batch operations" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    try testBatchOperations(db_interface);
}

test "memory database error conditions" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    try testErrorConditions(db_interface);
}

// Test database factory
test "database factory memory creation" {
    defer database_factory.deinitFactory();
    
    const db = try database_factory.createMemoryDatabase(testing.allocator);
    defer database_factory.destroyDatabase(testing.allocator, db);

    try testDatabaseInterfaceCompliance(db);
    
    // Test factory type detection
    const db_type = database_factory.getDatabaseType(db);
    try testing.expectEqual(database_factory.DatabaseType.Memory, db_type.?);
}

test "database factory configuration" {
    defer database_factory.deinitFactory();
    
    const config = database_factory.DatabaseConfig{ .Memory = {} };
    const db = try database_factory.createDatabase(testing.allocator, config);
    defer database_factory.destroyDatabase(testing.allocator, db);

    try testDatabaseInterfaceCompliance(db);
}

// Test multiple databases simultaneously
test "multiple database instances" {
    defer database_factory.deinitFactory();
    
    const db1 = try database_factory.createMemoryDatabase(testing.allocator);
    defer database_factory.destroyDatabase(testing.allocator, db1);
    
    const db2 = try database_factory.createMemoryDatabase(testing.allocator);
    defer database_factory.destroyDatabase(testing.allocator, db2);

    const addr = createTestAddress(1);
    const account1 = createTestAccount(1000, 1);
    const account2 = createTestAccount(2000, 2);

    // Set different data in each database
    try db1.set_account(addr, account1);
    try db2.set_account(addr, account2);

    // Verify isolation
    const retrieved1 = try db1.get_account(addr);
    const retrieved2 = try db2.get_account(addr);
    
    try testing.expectEqual(account1.balance, retrieved1.?.balance);
    try testing.expectEqual(account2.balance, retrieved2.?.balance);
}

// Test state root operations
test "database state root operations" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    
    // Get initial state root
    const initial_root = try db_interface.get_state_root();
    
    // Add some data
    const addr = createTestAddress(1);
    const account = createTestAccount(1000, 1);
    try db_interface.set_account(addr, account);
    
    // State root should change
    const new_root = try db_interface.get_state_root();
    try testing.expect(!std.mem.eql(u8, &initial_root, &new_root));
    
    // Commit changes
    const committed_root = try db_interface.commit_changes();
    try testing.expectEqualSlices(u8, &new_root, &committed_root);
}

// Test large data handling
test "database large data handling" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    
    // Test with large bytecode
    const large_code = try testing.allocator.alloc(u8, 10000);
    defer testing.allocator.free(large_code);
    
    // Fill with some pattern
    for (large_code, 0..) |*byte, i| {
        byte.* = @intCast(i % 256);
    }
    
    const code_hash = try db_interface.set_code(large_code);
    const retrieved_code = try db_interface.get_code(code_hash);
    
    try testing.expectEqualSlices(u8, large_code, retrieved_code);
}

// Test concurrent-like operations (sequential but interleaved)
test "database interleaved operations" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    
    const addr1 = createTestAddress(1);
    const addr2 = createTestAddress(2);
    
    // Interleave operations on different accounts
    try db_interface.set_storage(addr1, 0, 100);
    try db_interface.set_storage(addr2, 0, 200);
    try db_interface.set_storage(addr1, 1, 300);
    try db_interface.set_storage(addr2, 1, 400);
    
    // Verify all operations succeeded and data is correct
    try testing.expectEqual(@as(u256, 100), try db_interface.get_storage(addr1, 0));
    try testing.expectEqual(@as(u256, 200), try db_interface.get_storage(addr2, 0));
    try testing.expectEqual(@as(u256, 300), try db_interface.get_storage(addr1, 1));
    try testing.expectEqual(@as(u256, 400), try db_interface.get_storage(addr2, 1));
}

// Test edge cases
test "database edge cases" {
    var memory_db = MemoryDatabase.init(testing.allocator);
    defer memory_db.deinit();

    const db_interface = memory_db.to_database_interface();
    
    const addr = createTestAddress(1);
    
    // Test zero values
    const zero_account = Account.zero();
    try db_interface.set_account(addr, zero_account);
    
    const retrieved = try db_interface.get_account(addr);
    try testing.expect(retrieved != null);
    try testing.expect(retrieved.?.is_empty());
    
    // Test maximum values
    const max_account = Account{
        .balance = std.math.maxInt(u256),
        .nonce = std.math.maxInt(u64),
        .code_hash = [_]u8{0xFF} ** 32,
        .storage_root = [_]u8{0xFF} ** 32,
    };
    
    try db_interface.set_account(addr, max_account);
    const max_retrieved = try db_interface.get_account(addr);
    try testing.expectEqual(max_account.balance, max_retrieved.?.balance);
    try testing.expectEqual(max_account.nonce, max_retrieved.?.nonce);
    
    // Test storage with max values
    try db_interface.set_storage(addr, std.math.maxInt(u256), std.math.maxInt(u256));
    const max_storage = try db_interface.get_storage(addr, std.math.maxInt(u256));
    try testing.expectEqual(std.math.maxInt(u256), max_storage);
}