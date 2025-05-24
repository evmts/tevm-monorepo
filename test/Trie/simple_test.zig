const std = @import("std");
const testing = std.testing;

// A very simple test that verifies the import path changes work
test "imports" {
    // Just verify we can import the modules without errors
    const trie_pkg = @import("trie");
    _ = trie_pkg;
    _ = trie_pkg.hash_builder;
    _ = trie_pkg.merkle_trie;
    
    // Success if we got this far
    try testing.expect(true);
}