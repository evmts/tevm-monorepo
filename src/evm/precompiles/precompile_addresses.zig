/// Precompile contract addresses according to Ethereum specification
/// 
/// Ethereum precompiles are deployed at well-known addresses in the address space
/// from 0x01 to 0x0A (and potentially higher in the future). These addresses are
/// reserved for built-in cryptographic and utility functions.
///
/// ## Address Mapping
/// - 0x01: ECRECOVER - Elliptic curve digital signature algorithm recovery
/// - 0x02: SHA256 - SHA-256 hash function  
/// - 0x03: RIPEMD160 - RIPEMD-160 hash function
/// - 0x04: IDENTITY - Identity function (returns input unchanged)
/// - 0x05: MODEXP - Modular exponentiation
/// - 0x06: ECADD - Elliptic curve addition
/// - 0x07: ECMUL - Elliptic curve scalar multiplication
/// - 0x08: ECPAIRING - Elliptic curve pairing check
/// - 0x09: BLAKE2F - BLAKE2b F compression function
/// - 0x0A: Undefined (reserved for future use)

const std = @import("std");

/// ECRECOVER precompile address - Elliptic curve signature recovery
pub const ECRECOVER_ADDRESS: u8 = 0x01;

/// SHA256 precompile address - SHA-256 hash function
pub const SHA256_ADDRESS: u8 = 0x02;

/// RIPEMD160 precompile address - RIPEMD-160 hash function  
pub const RIPEMD160_ADDRESS: u8 = 0x03;

/// IDENTITY precompile address - Identity function (returns input)
pub const IDENTITY_ADDRESS: u8 = 0x04;

/// MODEXP precompile address - Modular exponentiation
pub const MODEXP_ADDRESS: u8 = 0x05;

/// ECADD precompile address - Elliptic curve point addition
pub const ECADD_ADDRESS: u8 = 0x06;

/// ECMUL precompile address - Elliptic curve scalar multiplication
pub const ECMUL_ADDRESS: u8 = 0x07;

/// ECPAIRING precompile address - Elliptic curve pairing check
pub const ECPAIRING_ADDRESS: u8 = 0x08;

/// BLAKE2F precompile address - BLAKE2b F compression function
pub const BLAKE2F_ADDRESS: u8 = 0x09;

/// Maximum standard precompile address
pub const MAX_PRECOMPILE_ADDRESS: u8 = 0x09;

/// Check if an address corresponds to a precompile contract
/// 
/// ## Parameters
/// - `address`: 20-byte Ethereum address to check
/// 
/// ## Returns
/// - `true` if address is a precompile, `false` otherwise
/// 
/// ## Examples
/// ```zig
/// const sha256_addr = [_]u8{0} ** 19 ++ [_]u8{0x02};
/// try testing.expect(is_precompile(sha256_addr));
/// 
/// const regular_addr = [_]u8{0x12, 0x34} ++ [_]u8{0} ** 18;
/// try testing.expect(!is_precompile(regular_addr));
/// ```
pub fn is_precompile(address: [20]u8) bool {
    // Check if first 19 bytes are zero (precompiles have address 0x00...00XX)
    for (address[0..19]) |byte| {
        if (byte != 0) return false;
    }
    
    // Check if last byte is in valid precompile range
    const last_byte = address[19];
    return last_byte >= 0x01 and last_byte <= MAX_PRECOMPILE_ADDRESS;
}

/// Extract precompile ID from a precompile address
/// 
/// ## Parameters  
/// - `address`: 20-byte Ethereum address
/// 
/// ## Returns
/// - Precompile ID (0x01-0x09) if valid precompile, null otherwise
/// 
/// ## Examples
/// ```zig
/// const sha256_addr = [_]u8{0} ** 19 ++ [_]u8{0x02};
/// try testing.expectEqual(@as(?u8, 0x02), get_precompile_id(sha256_addr));
/// 
/// const regular_addr = [_]u8{0x12, 0x34} ++ [_]u8{0} ** 18;
/// try testing.expectEqual(@as(?u8, null), get_precompile_id(regular_addr));
/// ```
pub fn get_precompile_id(address: [20]u8) ?u8 {
    if (!is_precompile(address)) return null;
    return address[19];
}

test "precompile address detection" {
    const testing = std.testing;
    
    // Test valid precompile addresses
    const sha256_addr = [_]u8{0} ** 19 ++ [_]u8{SHA256_ADDRESS};
    try testing.expect(is_precompile(sha256_addr));
    try testing.expectEqual(@as(?u8, SHA256_ADDRESS), get_precompile_id(sha256_addr));
    
    const identity_addr = [_]u8{0} ** 19 ++ [_]u8{IDENTITY_ADDRESS};
    try testing.expect(is_precompile(identity_addr));
    try testing.expectEqual(@as(?u8, IDENTITY_ADDRESS), get_precompile_id(identity_addr));
    
    // Test invalid addresses
    const regular_addr = [_]u8{0x12, 0x34} ++ [_]u8{0} ** 18;
    try testing.expect(!is_precompile(regular_addr));
    try testing.expectEqual(@as(?u8, null), get_precompile_id(regular_addr));
    
    // Test out of range precompile address
    const invalid_precompile = [_]u8{0} ** 19 ++ [_]u8{0xFF};
    try testing.expect(!is_precompile(invalid_precompile));
    try testing.expectEqual(@as(?u8, null), get_precompile_id(invalid_precompile));
    
    // Test zero address (not a precompile)
    const zero_addr = [_]u8{0} ** 20;
    try testing.expect(!is_precompile(zero_addr));
    try testing.expectEqual(@as(?u8, null), get_precompile_id(zero_addr));
}