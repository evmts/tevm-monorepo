const std = @import("std");
const module = @import("module.zig");
const trie = @import("trie.zig");
const hash_builder = @import("hash_builder.zig");
const proof = @import("proof.zig");
const merkle_trie = @import("merkle_trie.zig");
const optimized_branch = @import("optimized_branch.zig");
const known_roots_test = @import("known_roots_test.zig");

pub fn main() !void {
    // Run all tests and print a report
    std.debug.print("Running Trie tests...\n", .{});

    var passed: usize = 0;
    var failed: usize = 0;

    inline for (comptime get_all_tests()) |T| {
        std.debug.print("Test: {s}...", .{@typeName(T)});

        if (run_test(T)) {
            std.debug.print(" PASSED\n", .{});
            passed += 1;
        } else {
            std.debug.print(" FAILED\n", .{});
            failed += 1;
        }
    }

    std.debug.print("\nTest Report: {d} passed, {d} failed\n", .{ passed, failed });
    if (failed > 0) return error.TestsFailed;
}

fn get_all_tests() []const type {
    return &.{
        // Trie module tests
        trie.TrieMask,
        trie.key_to_nibbles,
        trie.nibbles_to_key,
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

        // Known roots tests
        known_roots_test,
    };
}

fn run_test(comptime T: type) bool {
    // Skip types that don't have tests
    if (!@hasDecl(T, "test")) return true;

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
