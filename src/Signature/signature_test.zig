const std = @import("std");
const signature = @import("signature.zig");
const Signature = signature.Signature;

test "Signature creation and conversion" {
    // Create a simple signature with dummy values
    const r = [_]u8{0} ** 32;
    const s = [_]u8{0} ** 32;
    const y_parity = false;
    
    const sig = try Signature.fromRsAndYParity(r, s, y_parity);
    
    // Test asBytes method
    const bytes = sig.asBytes();
    try std.testing.expectEqual(@as(usize, 65), bytes.len);
    
    // Test isValid method (currently just a stub)
    _ = sig.isValid();
}

// Create test for hashMessage function
test "Signature hashMessage" {
    const message = "Hello, world!";
    const hash = Signature.hashMessage(message);
    
    // Since the implementation is a stub, we just check the length
    try std.testing.expectEqual(@as(usize, 32), hash.len);
}

// Create test for recovery methods
test "Signature recovery methods" {
    // Create a simple signature with dummy values
    const r = [_]u8{0} ** 32;
    const s = [_]u8{0} ** 32;
    const y_parity = false;
    
    const sig = try Signature.fromRsAndYParity(r, s, y_parity);
    
    // Create a dummy message hash
    const message_hash = [_]u8{0} ** 32;
    
    // Test recoverPublicKey method
    const public_key = try sig.recoverPublicKey(message_hash);
    try std.testing.expectEqual(@as(usize, 65), public_key.len);
    
    // Test recoverAddress method
    const address = try sig.recoverAddress(message_hash);
    try std.testing.expectEqual(@as(usize, 20), address.len);
}