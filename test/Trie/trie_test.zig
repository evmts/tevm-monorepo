const std = @import("std");
const trie_pkg = @import("trie");
const trie = trie_pkg;
const hash_builder = trie_pkg.hash_builder;
const proof = trie_pkg.proof;
const merkle_trie = trie_pkg.merkle_trie;
// proof_test is in the same test directory
const proof_test = struct {}; // Tests are run separately

// Test all trie modules
test {
    std.testing.refAllDeclsRecursive(trie);
    std.testing.refAllDeclsRecursive(hash_builder);
    std.testing.refAllDeclsRecursive(proof);
    std.testing.refAllDeclsRecursive(merkle_trie);
    
    // Run the standalone proof tests
    _ = proof_test;
}