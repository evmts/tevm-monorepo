/// Cryptographic operations module for the EVM
/// 
/// This module defines cryptographic operations available in the EVM.
/// Currently contains the Keccak-256 hash function (often referred to as SHA3
/// in the EVM context, though it's technically different from the final SHA-3 standard).
/// These operations are essential for creating hashes, verifying signatures, and
/// implementing various cryptographic protocols in smart contracts.

const std = @import("std");
const Operation = @import("operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const crypto = opcodes.crypto;
const environment = opcodes.environment;

/// SHA3 operation (0x20): Keccak-256 Hash
/// 
/// Computes the Keccak-256 hash of data in memory and pushes the result onto the stack.
/// Note: Despite the name "SHA3", this actually computes Keccak-256, not SHA3-256.
/// Ethereum adopted Keccak-256 before SHA-3 was finalized, leading to this naming confusion.
/// 
/// Stack: [..., offset, size] → [..., hash]
/// Gas: 30 + 6 × (size + 31) ÷ 32
/// 
/// Where:
/// - offset: Starting position in memory
/// - size: Number of bytes to hash
/// - hash: 256-bit Keccak-256 hash result
/// 
/// Common uses:
/// - Computing storage slot locations for mappings
/// - Creating unique identifiers
/// - Verifying data integrity
/// - Implementing commit-reveal schemes
pub const SHA3 = Operation{
    .execute = crypto.op_sha3,
    .constant_gas = opcodes.gas_constants.Keccak256Gas,
    .min_stack = 2,
    .max_stack = Stack.CAPACITY,
};

/// EXTCODEHASH operation (0x3F): Get External Code Hash
/// 
/// Returns the keccak256 hash of the code at the specified address.
/// Returns 0 for non-existent accounts, and a special value (0xc5d2...c5d2)
/// for accounts with no code (EOAs).
/// 
/// Stack: [..., address] → [..., hash]
/// Gas: Variable (depends on hardfork and address warm/cold status)
///   - Pre-Berlin: 400 (Constantinople) or 700 (Istanbul)
///   - Berlin+: 100 (warm) or 2600 (cold)
/// 
/// Introduced in Constantinople (EIP-1052).
/// More efficient than EXTCODECOPY for verifying code without retrieving it.
/// Useful for:
/// - Checking if an address is a contract
/// - Verifying contract code hasn't changed
/// - Implementing proxy patterns with code verification
pub const EXTCODEHASH = Operation{
    .execute = environment.op_extcodehash,
    .constant_gas = 0, // Gas handled by access_list in opcode
    .min_stack = 1,
    .max_stack = Stack.CAPACITY,
};
