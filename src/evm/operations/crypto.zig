/// Cryptographic operations module for the EVM
/// 
/// This module defines cryptographic operations available in the EVM.
/// Currently contains the Keccak-256 hash function (often referred to as SHA3
/// in the EVM context, though it's technically different from the final SHA-3 standard).
/// These operations are essential for creating hashes, verifying signatures, and
/// implementing various cryptographic protocols in smart contracts.

const std = @import("std");
const Operation = @import("../operation.zig");
const Stack = @import("../stack.zig");
const opcodes = @import("../opcodes/package.zig");

// Import the actual opcode implementations
const crypto = opcodes.crypto;

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
