const std = @import("std");
const trie = @import("trie.zig");
const hash_builder = @import("hash_builder.zig");
const proof = @import("proof.zig");
const merkle_trie = @import("merkle_trie.zig");

// Test all trie modules
test {
    std.testing.refAllDeclsRecursive(trie);
    std.testing.refAllDeclsRecursive(hash_builder);
    std.testing.refAllDeclsRecursive(proof);
    std.testing.refAllDeclsRecursive(merkle_trie);
}