//! Comprehensive test suite for EVM state journaling functionality
//!
//! This test suite validates the journaling system that enables proper
//! snapshot creation, state reversion, and transaction rollback support.
//! Tests cover both individual journal operations and complex nested scenarios.

const std = @import("std");
const testing = std.testing;
const expect = testing.expect;
const expectEqual = testing.expectEqual;
const expectError = testing.expectError;

// Import the modules we're testing
const Journal = @import("../../../src/evm/state/journal.zig").Journal;
const EvmState = @import("../../../src/evm/state/state.zig");
const Address = @import("Address");

// Test helper to create a test address
fn test_address(value: u160) Address.Address {
    return Address.from_u160(value);
}

// Test helper to create test state
fn create_test_state(allocator: std.mem.Allocator) !EvmState {
    return try EvmState.init(allocator);
}

test "Journal: Basic snapshot and commit functionality" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const initial_balance: u256 = 1000;
    const new_balance: u256 = 2000;

    // Set initial balance
    try state.set_balance(addr1, initial_balance);
    try expectEqual(initial_balance, state.get_balance(addr1));

    // Create snapshot
    const snapshot_id = try state.snapshot();

    // Modify state
    try state.set_balance(addr1, new_balance);
    try expectEqual(new_balance, state.get_balance(addr1));

    // Commit changes
    state.commit(snapshot_id);

    // Balance should remain changed after commit
    try expectEqual(new_balance, state.get_balance(addr1));
}

test "Journal: Basic snapshot and revert functionality" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const initial_balance: u256 = 1000;
    const new_balance: u256 = 2000;

    // Set initial balance
    try state.set_balance(addr1, initial_balance);
    try expectEqual(initial_balance, state.get_balance(addr1));

    // Create snapshot
    const snapshot_id = try state.snapshot();

    // Modify state
    try state.set_balance(addr1, new_balance);
    try expectEqual(new_balance, state.get_balance(addr1));

    // Revert changes
    try state.revert(snapshot_id);

    // Balance should be reverted to initial value
    try expectEqual(initial_balance, state.get_balance(addr1));
}

test "Journal: Nested snapshots - commit inner, revert outer" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const initial_balance: u256 = 1000;
    const middle_balance: u256 = 2000;
    const final_balance: u256 = 3000;

    // Set initial balance
    try state.set_balance(addr1, initial_balance);

    // Create outer snapshot
    const outer_snapshot = try state.snapshot();

    // Modify state
    try state.set_balance(addr1, middle_balance);
    try expectEqual(middle_balance, state.get_balance(addr1));

    // Create inner snapshot
    const inner_snapshot = try state.snapshot();

    // Modify state again
    try state.set_balance(addr1, final_balance);
    try expectEqual(final_balance, state.get_balance(addr1));

    // Commit inner snapshot
    state.commit(inner_snapshot);
    try expectEqual(final_balance, state.get_balance(addr1));

    // Revert outer snapshot
    try state.revert(outer_snapshot);

    // Should revert to initial state
    try expectEqual(initial_balance, state.get_balance(addr1));
}

test "Journal: Multiple storage changes and revert" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const slot1: u256 = 100;
    const slot2: u256 = 200;
    const initial_value1: u256 = 10;
    const initial_value2: u256 = 20;
    const new_value1: u256 = 30;
    const new_value2: u256 = 40;

    // Set initial storage values
    try state.set_storage(addr1, slot1, initial_value1);
    try state.set_storage(addr1, slot2, initial_value2);
    try expectEqual(initial_value1, state.get_storage(addr1, slot1));
    try expectEqual(initial_value2, state.get_storage(addr1, slot2));

    // Create snapshot
    const snapshot_id = try state.snapshot();

    // Modify storage
    try state.set_storage(addr1, slot1, new_value1);
    try state.set_storage(addr1, slot2, new_value2);
    try expectEqual(new_value1, state.get_storage(addr1, slot1));
    try expectEqual(new_value2, state.get_storage(addr1, slot2));

    // Revert changes
    try state.revert(snapshot_id);

    // Storage should be reverted
    try expectEqual(initial_value1, state.get_storage(addr1, slot1));
    try expectEqual(initial_value2, state.get_storage(addr1, slot2));
}

test "Journal: Transient storage changes and revert" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const slot1: u256 = 100;
    const initial_value: u256 = 10;
    const new_value: u256 = 30;

    // Set initial transient storage value
    try state.set_transient_storage(addr1, slot1, initial_value);
    try expectEqual(initial_value, state.get_transient_storage(addr1, slot1));

    // Create snapshot
    const snapshot_id = try state.snapshot();

    // Modify transient storage
    try state.set_transient_storage(addr1, slot1, new_value);
    try expectEqual(new_value, state.get_transient_storage(addr1, slot1));

    // Revert changes
    try state.revert(snapshot_id);

    // Transient storage should be reverted
    try expectEqual(initial_value, state.get_transient_storage(addr1, slot1));
}

test "Journal: Account nonce changes and revert" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const initial_nonce: u64 = 5;
    const new_nonce: u64 = 10;

    // Set initial nonce
    try state.set_nonce(addr1, initial_nonce);
    try expectEqual(initial_nonce, state.get_nonce(addr1));

    // Create snapshot
    const snapshot_id = try state.snapshot();

    // Modify nonce
    try state.set_nonce(addr1, new_nonce);
    try expectEqual(new_nonce, state.get_nonce(addr1));

    // Revert changes
    try state.revert(snapshot_id);

    // Nonce should be reverted
    try expectEqual(initial_nonce, state.get_nonce(addr1));
}

test "Journal: Increment nonce and revert" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const initial_nonce: u64 = 5;

    // Set initial nonce
    try state.set_nonce(addr1, initial_nonce);
    try expectEqual(initial_nonce, state.get_nonce(addr1));

    // Create snapshot
    const snapshot_id = try state.snapshot();

    // Increment nonce
    const returned_nonce = try state.increment_nonce(addr1);
    try expectEqual(initial_nonce, returned_nonce);
    try expectEqual(initial_nonce + 1, state.get_nonce(addr1));

    // Revert changes
    try state.revert(snapshot_id);

    // Nonce should be reverted to initial value
    try expectEqual(initial_nonce, state.get_nonce(addr1));
}

test "Journal: Contract code changes and revert" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const initial_code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0xF3 }; // Simple contract
    const new_code = [_]u8{ 0x60, 0x01, 0x60, 0x01, 0xF3 }; // Different contract

    // Set initial code
    try state.set_code(addr1, &initial_code);
    try expectEqual(initial_code.len, state.get_code(addr1).len);
    try expect(std.mem.eql(u8, &initial_code, state.get_code(addr1)));

    // Create snapshot
    const snapshot_id = try state.snapshot();

    // Modify code
    try state.set_code(addr1, &new_code);
    try expectEqual(new_code.len, state.get_code(addr1).len);
    try expect(std.mem.eql(u8, &new_code, state.get_code(addr1)));

    // Revert changes
    try state.revert(snapshot_id);

    // Code should be reverted
    try expectEqual(initial_code.len, state.get_code(addr1).len);
    try expect(std.mem.eql(u8, &initial_code, state.get_code(addr1)));
}

test "Journal: Log emission and revert" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const topics = [_]u256{ 0x1111, 0x2222 };
    const data = [_]u8{ 0xAA, 0xBB, 0xCC };

    // Initially no logs
    try expectEqual(@as(usize, 0), state.logs.items.len);

    // Create snapshot
    const snapshot_id = try state.snapshot();

    // Emit log
    try state.emit_log(addr1, &topics, &data);
    try expectEqual(@as(usize, 1), state.logs.items.len);

    // Verify log content
    const emitted_log = state.logs.items[0];
    try expectEqual(addr1, emitted_log.address);
    try expectEqual(@as(usize, 2), emitted_log.topics.len);
    try expectEqual(@as(u256, 0x1111), emitted_log.topics[0]);
    try expectEqual(@as(u256, 0x2222), emitted_log.topics[1]);
    try expectEqual(@as(usize, 3), emitted_log.data.len);
    try expectEqual(@as(u8, 0xAA), emitted_log.data[0]);
    try expectEqual(@as(u8, 0xBB), emitted_log.data[1]);
    try expectEqual(@as(u8, 0xCC), emitted_log.data[2]);

    // Revert changes
    try state.revert(snapshot_id);

    // Logs should be reverted
    try expectEqual(@as(usize, 0), state.logs.items.len);
}

test "Journal: Complex mixed state changes and revert" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const addr2 = test_address(0x5678);
    const slot1: u256 = 100;
    const slot2: u256 = 200;
    const code = [_]u8{ 0x60, 0x00, 0x60, 0x00, 0xF3 };
    const topics = [_]u256{0x1111};
    const data = [_]u8{ 0xAA, 0xBB };

    // Set initial state
    try state.set_balance(addr1, 1000);
    try state.set_balance(addr2, 2000);
    try state.set_storage(addr1, slot1, 10);
    try state.set_storage(addr1, slot2, 20);
    try state.set_nonce(addr1, 5);
    try state.set_code(addr2, &code);

    // Verify initial state
    try expectEqual(@as(u256, 1000), state.get_balance(addr1));
    try expectEqual(@as(u256, 2000), state.get_balance(addr2));
    try expectEqual(@as(u256, 10), state.get_storage(addr1, slot1));
    try expectEqual(@as(u256, 20), state.get_storage(addr1, slot2));
    try expectEqual(@as(u64, 5), state.get_nonce(addr1));
    try expect(std.mem.eql(u8, &code, state.get_code(addr2)));

    // Create snapshot
    const snapshot_id = try state.snapshot();

    // Make many changes
    try state.set_balance(addr1, 3000);
    try state.set_balance(addr2, 4000);
    try state.set_storage(addr1, slot1, 30);
    try state.set_storage(addr1, slot2, 40);
    try state.set_nonce(addr1, 10);
    try state.set_code(addr2, &[_]u8{ 0xFF, 0xFF });
    try state.emit_log(addr1, &topics, &data);
    try state.set_transient_storage(addr1, slot1, 99);

    // Verify changes
    try expectEqual(@as(u256, 3000), state.get_balance(addr1));
    try expectEqual(@as(u256, 4000), state.get_balance(addr2));
    try expectEqual(@as(u256, 30), state.get_storage(addr1, slot1));
    try expectEqual(@as(u256, 40), state.get_storage(addr1, slot2));
    try expectEqual(@as(u64, 10), state.get_nonce(addr1));
    try expectEqual(@as(usize, 2), state.get_code(addr2).len);
    try expectEqual(@as(usize, 1), state.logs.items.len);
    try expectEqual(@as(u256, 99), state.get_transient_storage(addr1, slot1));

    // Revert all changes
    try state.revert(snapshot_id);

    // Verify everything is reverted
    try expectEqual(@as(u256, 1000), state.get_balance(addr1));
    try expectEqual(@as(u256, 2000), state.get_balance(addr2));
    try expectEqual(@as(u256, 10), state.get_storage(addr1, slot1));
    try expectEqual(@as(u256, 20), state.get_storage(addr1, slot2));
    try expectEqual(@as(u64, 5), state.get_nonce(addr1));
    try expect(std.mem.eql(u8, &code, state.get_code(addr2)));
    try expectEqual(@as(usize, 0), state.logs.items.len);
    try expectEqual(@as(u256, 0), state.get_transient_storage(addr1, slot1)); // Should be 0 (uninitialized)
}

test "Journal: Deep nested snapshots - complex scenario" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const initial_balance: u256 = 1000;

    // Set initial state
    try state.set_balance(addr1, initial_balance);

    // Level 0: outer snapshot
    const snapshot_0 = try state.snapshot();
    try state.set_balance(addr1, 2000);

    // Level 1: middle snapshot
    const snapshot_1 = try state.snapshot();
    try state.set_balance(addr1, 3000);

    // Level 2: inner snapshot
    const snapshot_2 = try state.snapshot();
    try state.set_balance(addr1, 4000);

    try expectEqual(@as(u256, 4000), state.get_balance(addr1));

    // Commit innermost
    state.commit(snapshot_2);
    try expectEqual(@as(u256, 4000), state.get_balance(addr1));

    // Revert middle
    try state.revert(snapshot_1);
    try expectEqual(@as(u256, 2000), state.get_balance(addr1));

    // Commit outer
    state.commit(snapshot_0);
    try expectEqual(@as(u256, 2000), state.get_balance(addr1));
}

test "Journal: Multiple snapshots and selective reverts" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const addr2 = test_address(0x5678);
    const addr3 = test_address(0x9ABC);

    // Set initial balances
    try state.set_balance(addr1, 1000);
    try state.set_balance(addr2, 2000);
    try state.set_balance(addr3, 3000);

    // Create multiple snapshots and modify different accounts
    const snapshot_a = try state.snapshot();
    try state.set_balance(addr1, 1500); // Modify addr1

    const snapshot_b = try state.snapshot();
    try state.set_balance(addr2, 2500); // Modify addr2

    const snapshot_c = try state.snapshot();
    try state.set_balance(addr3, 3500); // Modify addr3

    // Verify all changes
    try expectEqual(@as(u256, 1500), state.get_balance(addr1));
    try expectEqual(@as(u256, 2500), state.get_balance(addr2));
    try expectEqual(@as(u256, 3500), state.get_balance(addr3));

    // Revert snapshot_c (only addr3 should revert)
    try state.revert(snapshot_c);
    try expectEqual(@as(u256, 1500), state.get_balance(addr1)); // Still modified
    try expectEqual(@as(u256, 2500), state.get_balance(addr2)); // Still modified
    try expectEqual(@as(u256, 3000), state.get_balance(addr3)); // Reverted

    // Commit snapshot_b
    state.commit(snapshot_b);
    try expectEqual(@as(u256, 1500), state.get_balance(addr1)); // Still modified
    try expectEqual(@as(u256, 2500), state.get_balance(addr2)); // Still modified

    // Revert snapshot_a (both addr1 and addr2 should revert)
    try state.revert(snapshot_a);
    try expectEqual(@as(u256, 1000), state.get_balance(addr1)); // Reverted
    try expectEqual(@as(u256, 2000), state.get_balance(addr2)); // Reverted
    try expectEqual(@as(u256, 3000), state.get_balance(addr3)); // Remains reverted
}

test "Journal: Performance - many snapshots and changes" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);
    const num_snapshots = 100;
    const num_changes_per_snapshot = 10;

    var snapshots: [num_snapshots]usize = undefined;

    // Create many nested snapshots with changes
    for (0..num_snapshots) |i| {
        snapshots[i] = try state.snapshot();
        
        // Make several changes
        for (0..num_changes_per_snapshot) |j| {
            const slot = @as(u256, @intCast(i * num_changes_per_snapshot + j));
            const value = @as(u256, @intCast((i + 1) * (j + 1)));
            try state.set_storage(addr1, slot, value);
        }
    }

    // Verify final state has all changes
    for (0..num_snapshots) |i| {
        for (0..num_changes_per_snapshot) |j| {
            const slot = @as(u256, @intCast(i * num_changes_per_snapshot + j));
            const expected_value = @as(u256, @intCast((i + 1) * (j + 1)));
            try expectEqual(expected_value, state.get_storage(addr1, slot));
        }
    }

    // Revert all snapshots in reverse order
    var i = num_snapshots;
    while (i > 0) {
        i -= 1;
        try state.revert(snapshots[i]);
    }

    // Verify all changes are reverted
    for (0..num_snapshots) |snap_i| {
        for (0..num_changes_per_snapshot) |change_j| {
            const slot = @as(u256, @intCast(snap_i * num_changes_per_snapshot + change_j));
            try expectEqual(@as(u256, 0), state.get_storage(addr1, slot));
        }
    }
}

test "Journal: Journal entry counting" {
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var state = try create_test_state(allocator);
    defer state.deinit();

    const addr1 = test_address(0x1234);

    // Initially no journal entries
    try expectEqual(@as(usize, 0), state.journal.entry_count());
    try expectEqual(@as(usize, 0), state.journal.snapshot_count());

    // Create snapshot
    const snapshot_id = try state.snapshot();
    try expectEqual(@as(usize, 0), state.journal.entry_count());
    try expectEqual(@as(usize, 1), state.journal.snapshot_count());

    // Make changes
    try state.set_balance(addr1, 1000);
    try expectEqual(@as(usize, 1), state.journal.entry_count());

    try state.set_storage(addr1, 100, 200);
    try expectEqual(@as(usize, 2), state.journal.entry_count());

    try state.set_nonce(addr1, 5);
    try expectEqual(@as(usize, 3), state.journal.entry_count());

    // Revert and check counts
    try state.revert(snapshot_id);
    try expectEqual(@as(usize, 0), state.journal.entry_count());
    try expectEqual(@as(usize, 0), state.journal.snapshot_count());
}