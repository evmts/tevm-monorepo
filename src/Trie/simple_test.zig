const std = @import("std");
const testing = std.testing;

// A very simple test that verifies the import path changes work
test "imports" {
    // Just verify we can import the modules without errors
    _ = @import("trie.zig");
    _ = @import("hash_builder.zig");
    _ = @import("merkle_trie.zig");
    
    // Success if we got this far
    try testing.expect(true);
}