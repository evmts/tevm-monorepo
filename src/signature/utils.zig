const std = @import("std");
const error = @import("error.zig");

/// The order of the Secp256k1 curve
pub const SECP256K1N_ORDER: [32]u8 = [_]u8{
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 
    0xBA, 0xAE, 0xDC, 0xE6, 0xAF, 0x48, 0xA0, 0x3B, 
    0xBF, 0xD2, 0x5E, 0x8C, 0xD0, 0x36, 0x41, 0x41
};

/// Normalize the v value of a signature to a boolean y_parity
/// In Ethereum, v is often 27 or 28, which corresponds to y_parity of 0 or 1
pub fn normalize_v(v: u8) !bool {
    // Pseudocode:
    // 1. If v is 0 or 1, return v == 1
    // 2. If v is 27 or 28, return v == 28
    // 3. Otherwise, return error.InvalidV
    @compileError("Not implemented");
}

/// Convert a boolean y_parity to a v value for EIP-155 signatures
/// EIP-155 includes chain ID in v for replay protection
pub fn to_eip155_v(y_parity: bool, chain_id: ?u64) u64 {
    // Pseudocode:
    // 1. If chain_id is null, return 27 + @boolToInt(y_parity)
    // 2. Otherwise, return 35 + chain_id * 2 + @boolToInt(y_parity)
    @compileError("Not implemented");
}

/// Check if a value is in the lower half of the curve order
pub fn is_lower_s(s: [32]u8) bool {
    // Pseudocode:
    // 1. Create the half-order constant (SECP256K1N_ORDER / 2)
    // 2. Compare s with half-order
    // 3. Return true if s < half-order
    @compileError("Not implemented");
}

/// Format public key as Ethereum address (last 20 bytes of keccak256 hash)
pub fn public_key_to_address(public_key: [65]u8) [20]u8 {
    // Pseudocode:
    // 1. Verify public key starts with 0x04 (uncompressed format)
    // 2. Hash the public key (excluding first byte) with keccak256
    // 3. Take the last 20 bytes of the hash
    // 4. Return as address
    @compileError("Not implemented");
};