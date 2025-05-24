const std = @import("std");
const trie_pkg = @import("trie");
const module = trie_pkg;
const trie = trie_pkg;
const hash_builder = trie_pkg.hash_builder;
const proof = trie_pkg.proof;
const merkle_trie = trie_pkg.merkle_trie;
const optimized_branch = trie_pkg.optimized_branch;
// known_roots_test is run separately

pub fn main() !void {
    // Run all tests and print a report
    std.debug.print("Running Trie tests...\n", .{});
    
    var passed: usize = 0;
    var failed: usize = 0;
    
    inline for (comptime getAllTests()) |T| {
        std.debug.print("Test: {s}...", .{@typeName(T)});
        
        if (runTest(T)) {
            std.debug.print(" PASSED\n", .{});
            passed += 1;
        } else {
            std.debug.print(" FAILED\n", .{});
            failed += 1;
        }
    }
    
    std.debug.print("\nTest Report: {d} passed, {d} failed\n", .{passed, failed});
    if (failed > 0) {
        return error.TestsFailed;
    }
}

fn getAllTests() []const type {
    return &.{
        // Trie module tests
        trie.TrieMask,
        trie.keyToNibbles,
        trie.nibblesToKey,
        trie.encodePath,
        trie.BranchNode,
        trie.LeafNode,
        trie.ExtensionNode,
        trie.TrieNode,
        
        // HashBuilder tests
        hash_builder.HashBuilder,
        
        // Proof tests
        proof.ProofNodes,
        proof.ProofRetainer,
        
        // MerkleTrie tests
        merkle_trie.MerkleTrie,
        
        // Optimized branch tests
        optimized_branch.CompactBranchNode,
        
        // Known roots tests are run separately
    };
}

fn runTest(comptime T: type) bool {
    // Skip types that don't have tests
    if (!@hasDecl(T, "test")) {
        return true;
    }
    
    const test_fn = @field(T, "test");
    test_fn() catch |err| {
        std.debug.print("Error: {}\n", .{err});
        return false;
    };
    
    return true;
}

// Include all tests
test {
    std.testing.refAllDeclsRecursive(module);
}