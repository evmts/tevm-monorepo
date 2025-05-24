const std = @import("std");
const testing = std.testing;
const trie_pkg = @import("trie");
const proof = trie_pkg.proof;
const ProofNodes = proof.ProofNodes;
const ProofRetainer = proof.ProofRetainer;

// Simple test for the proof module
test "ProofNodes initialization" {
    const allocator = testing.allocator;
    
    var nodes = ProofNodes.init(allocator);
    defer nodes.deinit();
    
    try testing.expect(nodes.nodes.count() == 0);
}

test "ProofRetainer initialization" {
    const allocator = testing.allocator;
    const key = &[_]u8{1, 2, 3};
    
    var retainer = try ProofRetainer.init(allocator, key);
    defer retainer.deinit();
    
    // Verify the key was converted to nibbles
    try testing.expectEqual(@as(usize, 6), retainer.key_nibbles.len);
    try testing.expectEqual(@as(u8, 0), retainer.key_nibbles[0]);
    try testing.expectEqual(@as(u8, 1), retainer.key_nibbles[1]);
    try testing.expectEqual(@as(u8, 0), retainer.key_nibbles[2]);
    try testing.expectEqual(@as(u8, 2), retainer.key_nibbles[3]);
    try testing.expectEqual(@as(u8, 0), retainer.key_nibbles[4]);
    try testing.expectEqual(@as(u8, 3), retainer.key_nibbles[5]);
    
    try testing.expect(retainer.proof.nodes.count() == 0);
}

// More extensive tests would require a functioning trie implementation
// to test proof generation and verification, which we won't cover here.