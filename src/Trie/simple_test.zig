const std = @import("std");
const trie = @import("trie.zig");

test "TrieMask basic operations" {
    const testing = std.testing;
    
    var mask = trie.TrieMask.init();
    try testing.expect(mask.isEmpty());
    try testing.expectEqual(@as(u5, 0), mask.bitCount());
    
    mask.set(1);
    try testing.expect(!mask.isEmpty());
    try testing.expectEqual(@as(u5, 1), mask.bitCount());
    try testing.expect(mask.isSet(1));
    try testing.expect(!mask.isSet(2));
}