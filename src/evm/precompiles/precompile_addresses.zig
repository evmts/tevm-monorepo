const Address = @import("Address").Address;

/// Precompile addresses as defined by the Ethereum specification
/// These addresses are reserved for built-in precompiled contracts

/// ECRECOVER precompile - signature recovery
pub const ECRECOVER_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x01 };

/// SHA256 precompile - SHA-256 hash function
pub const SHA256_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x02 };

/// RIPEMD160 precompile - RIPEMD-160 hash function
pub const RIPEMD160_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x03 };

/// IDENTITY precompile - returns input data unchanged
pub const IDENTITY_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x04 };

/// MODEXP precompile - modular exponentiation
pub const MODEXP_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x05 };

/// ECADD precompile - elliptic curve addition on alt_bn128
pub const ECADD_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x06 };

/// ECMUL precompile - elliptic curve scalar multiplication on alt_bn128
pub const ECMUL_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x07 };

/// ECPAIRING precompile - elliptic curve pairing check on alt_bn128
pub const ECPAIRING_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x08 };

/// BLAKE2F precompile - BLAKE2b F compression function
pub const BLAKE2F_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x09 };

/// POINT_EVALUATION precompile - KZG point evaluation (EIP-4844)
pub const POINT_EVALUATION_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x0A };

/// BLS12_381_G1ADD precompile - BLS12-381 G1 point addition (EIP-2537)
pub const BLS12_381_G1ADD_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x0B };

/// BLS12_381_G1MSM precompile - BLS12-381 G1 multi-scalar multiplication (EIP-2537)
pub const BLS12_381_G1MSM_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x0C };

/// BLS12_381_G2ADD precompile - BLS12-381 G2 point addition (EIP-2537)
pub const BLS12_381_G2ADD_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x0D };

/// BLS12_381_G2MSM precompile - BLS12-381 G2 multi-scalar multiplication (EIP-2537)
pub const BLS12_381_G2MSM_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x0E };

/// Checks if the given address is a precompile address
/// @param address The address to check
/// @return true if the address is a known precompile, false otherwise
pub fn is_precompile(address: Address) bool {
    // Check if the first 19 bytes are zero
    for (address[0..19]) |byte| {
        if (byte != 0) {
            @branchHint(.cold);
            return false;
        }
    }
    
    // Check if the last byte is in the precompile range (1-14)
    const last_byte = address[19];
    return last_byte >= 1 and last_byte <= 14;
}

/// Gets the precompile ID from an address
/// @param address The precompile address
/// @return The precompile ID (1-14) or 0 if not a precompile
pub fn get_precompile_id(address: Address) u8 {
    if (!is_precompile(address)) {
        @branchHint(.cold);
        return 0;
    }
    return address[19];
}