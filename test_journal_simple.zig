const std = @import("std");
const testing = std.testing;

const test_allocator = testing.allocator;

fn create_test_address(seed: u8) Address.Address {
    var addr: Address.Address = [_]u8{0} ** 20;
    addr[19] = seed;
    return addr;
}

test "journal: basic functionality" {
    var state = try EvmState.init(test_allocator);
    defer state.deinit();

    const addr = create_test_address(1);

    // Set initial balance
    try state.set_balance(addr, 1000);
    try testing.expectEqual(@as(u256, 1000), state.get_balance(addr));

    // Create snapshot
    const snapshot_id = try state.create_snapshot();

    // Change balance
    try state.set_balance(addr, 2000);
    try testing.expectEqual(@as(u256, 2000), state.get_balance(addr));

    // Revert to snapshot
    try state.revert_to_snapshot(snapshot_id);
    try testing.expectEqual(@as(u256, 1000), state.get_balance(addr));
}

test "journal: storage changes" {
    var state = try EvmState.init(test_allocator);
    defer state.deinit();

    const addr = create_test_address(1);
    const slot: u256 = 42;

    // Set initial storage
    try state.set_storage(addr, slot, 100);
    try testing.expectEqual(@as(u256, 100), state.get_storage(addr, slot));

    // Create snapshot
    const snapshot_id = try state.create_snapshot();

    // Change storage
    try state.set_storage(addr, slot, 200);
    try testing.expectEqual(@as(u256, 200), state.get_storage(addr, slot));

    // Revert to snapshot
    try state.revert_to_snapshot(snapshot_id);
    try testing.expectEqual(@as(u256, 100), state.get_storage(addr, slot));
}

test "journal: multiple changes" {
    var state = try EvmState.init(test_allocator);
    defer state.deinit();

    const addr1 = create_test_address(1);
    const addr2 = create_test_address(2);

    // Initial state
    try state.set_balance(addr1, 1000);
    try state.set_nonce(addr2, 5);

    // Create snapshot
    const snapshot_id = try state.create_snapshot();

    // Multiple changes
    try state.set_balance(addr1, 2000);
    try state.set_balance(addr2, 500);
    try state.set_nonce(addr2, 10);
    try state.set_storage(addr1, 42, 123);

    // Verify changes
    try testing.expectEqual(@as(u256, 2000), state.get_balance(addr1));
    try testing.expectEqual(@as(u256, 500), state.get_balance(addr2));
    try testing.expectEqual(@as(u64, 10), state.get_nonce(addr2));
    try testing.expectEqual(@as(u256, 123), state.get_storage(addr1, 42));

    // Revert all changes
    try state.revert_to_snapshot(snapshot_id);

    // Verify revert
    try testing.expectEqual(@as(u256, 1000), state.get_balance(addr1));
    try testing.expectEqual(@as(u256, 0), state.get_balance(addr2)); // Default value
    try testing.expectEqual(@as(u64, 5), state.get_nonce(addr2));
    try testing.expectEqual(@as(u256, 0), state.get_storage(addr1, 42)); // Default value
}