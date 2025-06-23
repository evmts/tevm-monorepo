const std = @import("std");

// Re-export all trie functionality
pub const trie = @import("trie.zig");
pub const merkle_trie = @import("merkle_trie.zig");
pub const hash_builder = @import("hash_builder_complete.zig");
pub const proof = @import("proof.zig");
pub const optimized_branch = @import("optimized_branch.zig");
pub const known_roots_test = @import("known_roots_test.zig");

// Main types
pub const MerkleTrie = merkle_trie.MerkleTrie;
pub const TrieNode = trie.TrieNode;
pub const HashBuilder = hash_builder.HashBuilder;
pub const ProofNodes = proof.ProofNodes;
pub const ProofRetainer = proof.ProofRetainer;
pub const CompactBranchNode = optimized_branch.CompactBranchNode;

// Error types
pub const TrieError = trie.TrieError;
pub const ProofError = proof.ProofError;

// Utility functions
pub const key_to_nibbles = trie.key_to_nibbles;
pub const nibbles_to_key = trie.nibbles_to_key;

// Tests
test {
    // Run all tests in the module
    std.testing.refAllDeclsRecursive(@This());
}
