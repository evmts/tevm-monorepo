const std = @import("std");
const testing = std.testing;
const EvmState = @import("evm").evm_state;
const Address = @import("Address");

test "journaling: revert single state change" {
    var state = try EvmState.init(testing.allocator);
    defer state.deinit();

    const addr1 = [20]u8{1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1};
    const slot1: u256 = 1;
    const value1: u256 = 123;

    try state.checkpoint();

    try state.set_storage(addr1, slot1, value1);
    try testing.expectEqual(value1, state.get_storage(addr1, slot1));

    try state.revert();

    try testing.expectEqual(@as(u256, 0), state.get_storage(addr1, slot1));
}

test "journaling: revert multiple state changes" {
    var state = try EvmState.init(testing.allocator);
    defer state.deinit();

    const addr1 = [20]u8{1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1};
    const addr2 = [20]u8{2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2};
    const slot1: u256 = 1;
    const value1: u256 = 123;
    const balance1: u256 = 456;

    try state.checkpoint();

    try state.set_storage(addr1, slot1, value1);
    try state.set_balance(addr2, balance1);

    try testing.expectEqual(value1, state.get_storage(addr1, slot1));
    try testing.expectEqual(balance1, state.get_balance(addr2));

    try state.revert();

    try testing.expectEqual(@as(u256, 0), state.get_storage(addr1, slot1));
    try testing.expectEqual(@as(u256, 0), state.get_balance(addr2));
}

test "journaling: nested checkpoints with revert" {
    var state = try EvmState.init(testing.allocator);
    defer state.deinit();

    const addr1 = [20]u8{1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1};
    const addr2 = [20]u8{2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2};

    try state.set_balance(addr1, 1000);

    // Checkpoint 1
    try state.checkpoint();
    try state.set_balance(addr1, 900); // Change A

    // Checkpoint 2
    try state.checkpoint();
    try state.set_balance(addr2, 200); // Change B

    try testing.expectEqual(@as(u256, 900), state.get_balance(addr1));
    try testing.expectEqual(@as(u256, 200), state.get_balance(addr2));

    // Revert Checkpoint 2
    try state.revert();

    // Check that Change B is reverted, but Change A remains
    try testing.expectEqual(@as(u256, 900), state.get_balance(addr1));
    try testing.expectEqual(@as(u256, 0), state.get_balance(addr2));

    // Revert Checkpoint 1
    try state.revert();

    // Check that Change A is reverted
    try testing.expectEqual(@as(u256, 1000), state.get_balance(addr1));
}

test "journaling: nested checkpoints with commit" {
    var state = try EvmState.init(testing.allocator);
    defer state.deinit();

    const addr1 = [20]u8{1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1};
    const addr2 = [20]u8{2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2};

    // Checkpoint 1
    try state.checkpoint();
    try state.set_balance(addr1, 100); // Change A

    // Checkpoint 2
    try state.checkpoint();
    try state.set_balance(addr2, 200); // Change B

    // Commit Checkpoint 2
    try state.commit();

    // State should reflect both changes
    try testing.expectEqual(@as(u256, 100), state.get_balance(addr1));
    try testing.expectEqual(@as(u256, 200), state.get_balance(addr2));

    // Revert Checkpoint 1
    try state.revert();

    // Both Change A and the committed Change B should be reverted
    try testing.expectEqual(@as(u256, 0), state.get_balance(addr1));
    try testing.expectEqual(@as(u256, 0), state.get_balance(addr2));
}

test "journaling: account creation revert" {
    var state = try EvmState.init(testing.allocator);
    defer state.deinit();

    const addr1 = [20]u8{1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1};

    try state.checkpoint();
    try state.set_balance(addr1, 100);

    try testing.expect(state.balances.contains(addr1));
    try testing.expectEqual(@as(u256, 100), state.get_balance(addr1));

    try state.revert();

    try testing.expect(!state.balances.contains(addr1));
    try testing.expectEqual(@as(u256, 0), state.get_balance(addr1));
}
