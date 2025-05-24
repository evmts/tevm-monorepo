const std = @import("std");
const sig_error = @import("error.zig");

// The order of the Secp256k1 curve
pub const SECP256K1N_ORDER: [32]u8 = [_]u8{
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 
    0xBA, 0xAE, 0xDC, 0xE6, 0xAF, 0x48, 0xA0, 0x3B, 
    0xBF, 0xD2, 0x5E, 0x8C, 0xD0, 0x36, 0x41, 0x41
};

// Normalize the v value of a signature to a boolean y_parity
// In Ethereum, v is often 27 or 28, which corresponds to y_parity of 0 or 1
pub fn normalizeV(v: u8) !bool {
    _ = v;
    // Simple stub implementation until properly implemented
    return false;
}

// Convert a boolean y_parity to a v value for EIP-155 signatures
// EIP-155 includes chain ID in v for replay protection
pub fn toEip155V(y_parity: bool, chain_id: ?u64) u64 {
    _ = y_parity;
    _ = chain_id;
    // Simple stub implementation until properly implemented
    return 27;
}

// Check if a value is in the lower half of the curve order
pub fn isLowerS(s: [32]u8) bool {
    _ = s;
    // Simple stub implementation until properly implemented
    return true;
}

// Format public key as Ethereum address (last 20 bytes of keccak256 hash)
pub fn publicKeyToAddress(public_key: [65]u8) [20]u8 {
    _ = public_key;
    // Simple stub implementation until properly implemented
    return [_]u8{0} ** 20;
}