const std = @import("std");
const evm = @import("evm");
const Journal = evm.Journal;
const Change = evm.Change;
const Checkpoint = evm.Checkpoint;
const LogEntry = evm.LogEntry;
const JournalError = evm.JournalError;
const Address = evm.Address;
const B256 = evm.B256;
const testing = std.testing;

test "Journal: initialization and cleanup" {
    const allocator = testing.allocator;
    
    // Test basic initialization
    {
        var journal = try Journal.init(allocator);
        defer journal.deinit();
        
        try testing.expectEqual(@as(usize, 0), journal.changeCount());
        try testing.expect(journal.isEmpty());
        try testing.expectEqual(@as(usize, 0), journal.depth());
        try testing.expectEqual(@as(u64, 0), journal.getRefund());
        try testing.expectEqual(@as(usize, 0), journal.getLogs().len);
    }
    
    // Test initialization with capacity
    {
        var journal = try Journal.initWithCapacity(allocator, 100);
        defer journal.deinit();
        
        try testing.expect(journal.changes.capacity >= 100);
        try testing.expect(journal.checkpoints.capacity >= 10);
        try testing.expect(journal.logs.capacity >= 20);
    }
}

test "Journal: checkpoint management" {
    const allocator = testing.allocator;
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    // Test checkpoint creation
    try journal.checkpoint();
    try testing.expectEqual(@as(usize, 1), journal.depth());
    
    // Test nested checkpoints
    try journal.checkpoint();
    try journal.checkpoint();
    try testing.expectEqual(@as(usize, 3), journal.depth());
    
    // Test commit
    try journal.commit();
    try testing.expectEqual(@as(usize, 2), journal.depth());
    
    // Test revert
    try journal.revert();
    try testing.expectEqual(@as(usize, 1), journal.depth());
    
    // Test revert all
    try journal.revert();
    try testing.expectEqual(@as(usize, 0), journal.depth());
    
    // Test error on revert without checkpoint
    try testing.expectError(JournalError.NoCheckpoint, journal.revert());
    
    // Test error on commit without checkpoint
    try testing.expectError(JournalError.NoCheckpoint, journal.commit());
}

test "Journal: state change recording" {
    const allocator = testing.allocator;
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    const test_address = [_]u8{1} ** 20;
    const test_address2 = [_]u8{2} ** 20;
    
    // Record various changes
    try journal.recordAccountCreated(test_address);
    try testing.expectEqual(@as(usize, 1), journal.changeCount());
    
    try journal.recordBalanceChange(test_address, 1000);
    try testing.expectEqual(@as(usize, 2), journal.changeCount());
    
    try journal.recordNonceChange(test_address, 5);
    try testing.expectEqual(@as(usize, 3), journal.changeCount());
    
    const test_code_hash = B256{ .bytes = [_]u8{0xaa} ** 32 };
    try journal.recordAccountDestroyed(test_address2, 5000, 10, test_code_hash);
    try testing.expectEqual(@as(usize, 4), journal.changeCount());
    
    // Test code change
    const prev_code = "old code";
    const prev_hash = B256{ .bytes = [_]u8{0xbb} ** 32 };
    try journal.recordCodeChange(test_address, prev_hash, prev_code);
    try testing.expectEqual(@as(usize, 5), journal.changeCount());
    
    // Test storage change
    const storage_key = B256{ .bytes = [_]u8{0xcc} ** 32 };
    const prev_value = B256{ .bytes = [_]u8{0xdd} ** 32 };
    try journal.recordStorageChange(test_address, storage_key, prev_value);
    try testing.expectEqual(@as(usize, 6), journal.changeCount());
    
    // Test touched
    try journal.recordTouched(test_address);
    try testing.expectEqual(@as(usize, 7), journal.changeCount());
}

test "Journal: checkpoint and revert with changes" {
    const allocator = testing.allocator;
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    const test_address = [_]u8{1} ** 20;
    
    // Make some changes
    try journal.recordAccountCreated(test_address);
    try journal.recordBalanceChange(test_address, 1000);
    try testing.expectEqual(@as(usize, 2), journal.changeCount());
    
    // Create checkpoint
    try journal.checkpoint();
    try testing.expectEqual(@as(usize, 1), journal.depth());
    
    // Make more changes after checkpoint
    try journal.recordNonceChange(test_address, 5);
    try journal.recordTouched(test_address);
    try testing.expectEqual(@as(usize, 4), journal.changeCount());
    
    // Revert to checkpoint
    try journal.revert();
    try testing.expectEqual(@as(usize, 0), journal.depth());
    try testing.expectEqual(@as(usize, 2), journal.changeCount());
    
    // Verify changes after checkpoint were reverted
    const changes = journal.changes.items;
    try testing.expectEqual(@as(usize, 2), changes.len);
}

test "Journal: access list management (EIP-2929)" {
    const allocator = testing.allocator;
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    const test_address = [_]u8{1} ** 20;
    const test_address2 = [_]u8{2} ** 20;
    const storage_key1 = B256{ .bytes = [_]u8{0x11} ** 32 };
    const storage_key2 = B256{ .bytes = [_]u8{0x22} ** 32 };
    
    // Test account access
    try testing.expect(!journal.isWarmAccount(test_address));
    const was_cold = try journal.accessAccount(test_address);
    try testing.expect(was_cold);
    try testing.expect(journal.isWarmAccount(test_address));
    
    // Accessing again should return warm
    const was_cold2 = try journal.accessAccount(test_address);
    try testing.expect(!was_cold2);
    
    // Test storage access
    try testing.expect(!journal.isWarmStorage(test_address, storage_key1));
    const slot_was_cold = try journal.accessStorage(test_address, storage_key1);
    try testing.expect(slot_was_cold);
    try testing.expect(journal.isWarmStorage(test_address, storage_key1));
    
    // Accessing same slot again should return warm
    const slot_was_cold2 = try journal.accessStorage(test_address, storage_key1);
    try testing.expect(!slot_was_cold2);
    
    // Different slot should be cold
    const slot_was_cold3 = try journal.accessStorage(test_address, storage_key2);
    try testing.expect(slot_was_cold3);
    
    // Test checkpoint and revert of access list
    try journal.checkpoint();
    
    // Add new accesses
    _ = try journal.accessAccount(test_address2);
    _ = try journal.accessStorage(test_address2, storage_key1);
    try testing.expect(journal.isWarmAccount(test_address2));
    try testing.expect(journal.isWarmStorage(test_address2, storage_key1));
    
    // Revert should remove new accesses
    try journal.revert();
    try testing.expect(!journal.isWarmAccount(test_address2));
    try testing.expect(!journal.isWarmStorage(test_address2, storage_key1));
    
    // Original accesses should remain
    try testing.expect(journal.isWarmAccount(test_address));
    try testing.expect(journal.isWarmStorage(test_address, storage_key1));
    try testing.expect(journal.isWarmStorage(test_address, storage_key2));
}

test "Journal: log management" {
    const allocator = testing.allocator;
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    const test_address = [_]u8{1} ** 20;
    const topic1 = B256{ .bytes = [_]u8{0x11} ** 32 };
    const topic2 = B256{ .bytes = [_]u8{0x22} ** 32 };
    const log_data = "log data content";
    
    // Record logs
    try journal.recordLog(test_address, &[_]B256{topic1}, log_data);
    try testing.expectEqual(@as(usize, 1), journal.getLogs().len);
    
    try journal.recordLog(test_address, &[_]B256{ topic1, topic2 }, "more data");
    try testing.expectEqual(@as(usize, 2), journal.getLogs().len);
    
    // Verify log contents
    const logs = journal.getLogs();
    try testing.expectEqual(test_address, logs[0].address);
    try testing.expectEqual(@as(usize, 1), logs[0].topics.len);
    try testing.expectEqualSlices(u8, log_data, logs[0].data);
    
    // Test checkpoint and revert
    try journal.checkpoint();
    try journal.recordLog(test_address, &[_]B256{}, "checkpoint log");
    try testing.expectEqual(@as(usize, 3), journal.getLogs().len);
    
    try journal.revert();
    try testing.expectEqual(@as(usize, 2), journal.getLogs().len);
    
    // Test clear logs
    journal.clearLogs();
    try testing.expectEqual(@as(usize, 0), journal.getLogs().len);
}

test "Journal: refund management" {
    const allocator = testing.allocator;
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    // Test add refund
    try journal.addRefund(1000);
    try testing.expectEqual(@as(u64, 1000), journal.getRefund());
    
    try journal.addRefund(500);
    try testing.expectEqual(@as(u64, 1500), journal.getRefund());
    
    // Test subtract refund
    try journal.subRefund(300);
    try testing.expectEqual(@as(u64, 1200), journal.getRefund());
    
    // Test underflow protection
    try journal.subRefund(5000);
    try testing.expectEqual(@as(u64, 0), journal.getRefund());
    
    // Test checkpoint and revert
    try journal.addRefund(2000);
    try testing.expectEqual(@as(u64, 2000), journal.getRefund());
    
    try journal.checkpoint();
    try journal.addRefund(1000);
    try testing.expectEqual(@as(u64, 3000), journal.getRefund());
    
    try journal.revert();
    try testing.expectEqual(@as(u64, 2000), journal.getRefund());
}

test "Journal: storage cleared" {
    const allocator = testing.allocator;
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    const test_address = [_]u8{1} ** 20;
    
    // Create a storage map to clear
    var storage = std.AutoHashMap(B256, B256).init(allocator);
    defer storage.deinit();
    
    const key1 = B256{ .bytes = [_]u8{0x11} ** 32 };
    const key2 = B256{ .bytes = [_]u8{0x22} ** 32 };
    const val1 = B256{ .bytes = [_]u8{0xaa} ** 32 };
    const val2 = B256{ .bytes = [_]u8{0xbb} ** 32 };
    
    try storage.put(key1, val1);
    try storage.put(key2, val2);
    
    // Record storage cleared
    try journal.recordStorageCleared(test_address, storage);
    try testing.expectEqual(@as(usize, 1), journal.changeCount());
    
    // Verify the change was recorded
    const change = journal.changes.items[0];
    switch (change) {
        .StorageCleared => |c| {
            try testing.expectEqual(test_address, c.address);
            try testing.expectEqual(@as(u32, 2), c.storage.count());
            try testing.expectEqual(val1, c.storage.get(key1).?);
            try testing.expectEqual(val2, c.storage.get(key2).?);
        },
        else => unreachable,
    }
}

test "Journal: clear operation" {
    const allocator = testing.allocator;
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    const test_address = [_]u8{1} ** 20;
    
    // Add various data
    try journal.checkpoint();
    try journal.recordAccountCreated(test_address);
    try journal.recordBalanceChange(test_address, 1000);
    try journal.addRefund(500);
    _ = try journal.accessAccount(test_address);
    try journal.recordLog(test_address, &[_]B256{}, "test log");
    
    // Verify data exists
    try testing.expect(!journal.isEmpty());
    try testing.expectEqual(@as(usize, 1), journal.depth());
    try testing.expectEqual(@as(usize, 4), journal.changeCount()); // 4 changes: create, balance, refund, access
    try testing.expectEqual(@as(u64, 500), journal.getRefund());
    try testing.expectEqual(@as(usize, 1), journal.getLogs().len);
    try testing.expect(journal.isWarmAccount(test_address));
    
    // Clear everything
    journal.clear();
    
    // Verify everything is cleared
    try testing.expect(journal.isEmpty());
    try testing.expectEqual(@as(usize, 0), journal.depth());
    try testing.expectEqual(@as(usize, 0), journal.changeCount());
    try testing.expectEqual(@as(u64, 0), journal.getRefund());
    try testing.expectEqual(@as(usize, 0), journal.getLogs().len);
    try testing.expect(!journal.isWarmAccount(test_address));
}

test "Journal: nested checkpoints" {
    const allocator = testing.allocator;
    var journal = try Journal.init(allocator);
    defer journal.deinit();
    
    const addr1 = [_]u8{1} ** 20;
    const addr2 = [_]u8{2} ** 20;
    const addr3 = [_]u8{3} ** 20;
    
    // Level 0 changes
    try journal.recordAccountCreated(addr1);
    try testing.expectEqual(@as(usize, 1), journal.changeCount());
    
    // Checkpoint 1
    try journal.checkpoint();
    try journal.recordAccountCreated(addr2);
    try testing.expectEqual(@as(usize, 2), journal.changeCount());
    
    // Checkpoint 2
    try journal.checkpoint();
    try journal.recordAccountCreated(addr3);
    try testing.expectEqual(@as(usize, 3), journal.changeCount());
    
    // Commit checkpoint 2 (merges with checkpoint 1)
    try journal.commit();
    try testing.expectEqual(@as(usize, 1), journal.depth());
    try testing.expectEqual(@as(usize, 3), journal.changeCount());
    
    // Revert checkpoint 1
    try journal.revert();
    try testing.expectEqual(@as(usize, 0), journal.depth());
    try testing.expectEqual(@as(usize, 1), journal.changeCount());
    
    // Only first change should remain
    const changes = journal.changes.items;
    try testing.expectEqual(@as(usize, 1), changes.len);
    switch (changes[0]) {
        .AccountCreated => |c| try testing.expectEqual(addr1, c.address),
        else => unreachable,
    }
}

test "Journal: memory leak detection" {
    const allocator = testing.allocator;
    
    // This test uses the testing allocator which will detect memory leaks
    {
        var journal = try Journal.init(allocator);
        defer journal.deinit();
        
        const test_address = [_]u8{1} ** 20;
        
        // Test operations that allocate memory
        const code = "test contract code that needs to be allocated";
        const code_hash = B256{ .bytes = [_]u8{0xcc} ** 32 };
        try journal.recordCodeChange(test_address, code_hash, code);
        
        const topics = [_]B256{
            B256{ .bytes = [_]u8{0x11} ** 32 },
            B256{ .bytes = [_]u8{0x22} ** 32 },
        };
        const log_data = "log data that will be allocated";
        try journal.recordLog(test_address, &topics, log_data);
        
        // Create and clear storage
        var storage = std.AutoHashMap(B256, B256).init(allocator);
        defer storage.deinit();
        
        const key = B256{ .bytes = [_]u8{0x33} ** 32 };
        const val = B256{ .bytes = [_]u8{0x44} ** 32 };
        try storage.put(key, val);
        try journal.recordStorageCleared(test_address, storage);
        
        // Add to access lists
        _ = try journal.accessAccount(test_address);
        _ = try journal.accessStorage(test_address, key);
        
        // Clear should free all memory
        journal.clear();
    }
    
    // Test with checkpoints and reverts
    {
        var journal = try Journal.init(allocator);
        defer journal.deinit();
        
        const test_address = [_]u8{1} ** 20;
        
        try journal.checkpoint();
        
        // Allocate memory after checkpoint
        const code = "code to be reverted";
        const code_hash = B256{ .bytes = [_]u8{0xdd} ** 32 };
        try journal.recordCodeChange(test_address, code_hash, code);
        
        const log_data = "log to be reverted";
        try journal.recordLog(test_address, &[_]B256{}, log_data);
        
        // Revert should free allocated memory
        try journal.revert();
    }
}