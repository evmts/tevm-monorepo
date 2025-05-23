const std = @import("std");
const MerkleTrie = @import("merkle_trie.zig").MerkleTrie;
const Allocator = std.mem.Allocator;

test "simple update operation" {
    const allocator = std.testing.allocator;
    var trie = MerkleTrie.init(allocator);
    defer trie.deinit();

    // Insert initial value
    const key = [_]u8{ 1, 2, 3 };
    try trie.put(&key, "first");

    // Verify initial value
    const initial_value = try trie.get(&key);
    try std.testing.expect(initial_value != null);
    try std.testing.expectEqualStrings("first", initial_value.?);

    // Update to new value
    try trie.put(&key, "second");

    // Verify updated value
    const updated_value = try trie.get(&key);
    try std.testing.expect(updated_value != null);
    try std.testing.expectEqualStrings("second", updated_value.?);

    std.debug.print("\nSimple update test passed!\n", .{});
}