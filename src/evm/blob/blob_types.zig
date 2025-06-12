const std = @import("std");
const Address = @import("Address");

/// EIP-4844 Blob Data Structures
///
/// This module implements the core data structures for EIP-4844 blob transactions,
/// including blobs, KZG commitments, proofs, and versioned hashes. These structures
/// enable the blob transaction functionality that provides data availability for L2s.

/// Size constants for EIP-4844
pub const BYTES_PER_BLOB = 131072; // 128 KB
pub const FIELD_ELEMENTS_PER_BLOB = 4096; // 4096 field elements per blob
pub const MAX_BLOBS_PER_TRANSACTION = 6; // Maximum blobs in a single transaction
pub const GAS_PER_BLOB = 131072; // Gas units consumed per blob

/// BLS12-381 field modulus for KZG polynomial commitments
/// This is the prime modulus of the BLS12-381 scalar field
pub const BLS_MODULUS: u256 = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001;

/// A blob contains approximately 128 KB of data represented as field elements.
///
/// Blobs are the core data structure for EIP-4844, providing a way to include
/// large amounts of data in transactions for L2 data availability without
/// storing it permanently on-chain.
///
/// ## Structure
/// - 131,072 bytes total (128 KB)
/// - 4,096 field elements of 32 bytes each
/// - Data is committed to using KZG polynomial commitments
/// - Stored on-chain for ~18 days, then pruned
pub const Blob = struct {
    /// Raw blob data as bytes
    data: [BYTES_PER_BLOB]u8,

    /// Initialize an empty blob with all zeros
    pub fn init() Blob {
        return Blob{ .data = [_]u8{0} ** BYTES_PER_BLOB };
    }

    /// Create a blob from a byte slice
    ///
    /// @param bytes The input bytes (must be exactly BYTES_PER_BLOB length)
    /// @return Blob structure or error if size is invalid
    /// @throws error.InvalidBlobSize if bytes length != BYTES_PER_BLOB
    pub fn from_bytes(bytes: []const u8) !Blob {
        if (bytes.len != BYTES_PER_BLOB) {
            return error.InvalidBlobSize;
        }

        var blob = Blob.init();
        @memcpy(&blob.data, bytes);
        return blob;
    }

    /// Extract a field element from the blob at the given index
    ///
    /// @param self The blob instance
    /// @param index Field element index (0 to FIELD_ELEMENTS_PER_BLOB-1)
    /// @return FieldElement at the specified index, or zero if index is out of bounds
    pub fn get_field_element(self: *const Blob, index: usize) FieldElement {
        if (index >= FIELD_ELEMENTS_PER_BLOB) {
            return FieldElement.zero();
        }

        const start = index * 32;
        const end = start + 32;
        return FieldElement.from_bytes(self.data[start..end]);
    }

    /// Validate that all field elements in the blob are valid (< BLS_MODULUS)
    ///
    /// @param self The blob instance
    /// @return true if all field elements are valid, false otherwise
    pub fn validate(self: *const Blob) bool {
        for (0..FIELD_ELEMENTS_PER_BLOB) |i| {
            const element = self.get_field_element(i);
            if (element.value >= BLS_MODULUS) {
                return false;
            }
        }
        return true;
    }
};

/// A field element in the BLS12-381 scalar field.
///
/// Field elements are the atomic units of blob data, each representing
/// a 256-bit integer that must be less than the BLS12-381 field modulus.
pub const FieldElement = struct {
    /// The field element value (must be < BLS_MODULUS)
    value: u256,

    /// Create a zero field element
    pub fn zero() FieldElement {
        return FieldElement{ .value = 0 };
    }

    /// Create a field element from bytes
    ///
    /// @param bytes 32-byte big-endian representation
    /// @return FieldElement, or zero if bytes length != 32 or value >= BLS_MODULUS
    pub fn from_bytes(bytes: []const u8) FieldElement {
        if (bytes.len != 32) {
            return FieldElement.zero();
        }

        // Convert bytes to u256 (big-endian)
        var value: u256 = 0;
        for (bytes) |byte| {
            value = (value << 8) | byte;
        }

        // Ensure value is less than BLS modulus
        if (value >= BLS_MODULUS) {
            return FieldElement.zero();
        }

        return FieldElement{ .value = value };
    }

    /// Convert field element to 32-byte big-endian representation
    ///
    /// @param self The field element
    /// @return 32-byte array containing the big-endian representation
    pub fn to_bytes(self: *const FieldElement) [32]u8 {
        var bytes: [32]u8 = undefined;
        var value = self.value;

        // Convert to big-endian bytes
        var i: usize = 32;
        while (i > 0) {
            i -= 1;
            bytes[i] = @as(u8, @truncate(value));
            value >>= 8;
        }

        return bytes;
    }

    /// Check if this field element is valid (< BLS_MODULUS)
    pub fn is_valid(self: *const FieldElement) bool {
        return self.value < BLS_MODULUS;
    }
};

/// KZG commitment to a polynomial derived from a blob.
///
/// KZG commitments provide a cryptographic commitment to the polynomial
/// representation of blob data, enabling efficient verification of blob
/// contents without requiring the full blob data.
pub const KZGCommitment = struct {
    /// BLS12-381 G1 point (48 bytes)
    data: [48]u8,

    /// Initialize an empty commitment
    pub fn init() KZGCommitment {
        return KZGCommitment{ .data = [_]u8{0} ** 48 };
    }

    /// Create a commitment from bytes
    ///
    /// @param bytes Input bytes (must be exactly 48 bytes)
    /// @return KZGCommitment or error if size is invalid
    /// @throws error.InvalidCommitmentSize if bytes length != 48
    pub fn from_bytes(bytes: []const u8) !KZGCommitment {
        if (bytes.len != 48) {
            return error.InvalidCommitmentSize;
        }

        var commitment = KZGCommitment.init();
        @memcpy(&commitment.data, bytes);
        return commitment;
    }

    /// Check if commitment is the zero/identity element
    pub fn is_zero(self: *const KZGCommitment) bool {
        return std.mem.allEqual(u8, &self.data, 0);
    }
};

/// KZG proof for polynomial evaluation verification.
///
/// KZG proofs enable verification that a commitment corresponds to a
/// polynomial that evaluates to a specific value at a given point,
/// without revealing the full polynomial.
pub const KZGProof = struct {
    /// BLS12-381 G1 point (48 bytes)
    data: [48]u8,

    /// Initialize an empty proof
    pub fn init() KZGProof {
        return KZGProof{ .data = [_]u8{0} ** 48 };
    }

    /// Create a proof from bytes
    ///
    /// @param bytes Input bytes (must be exactly 48 bytes)
    /// @return KZGProof or error if size is invalid
    /// @throws error.InvalidProofSize if bytes length != 48
    pub fn from_bytes(bytes: []const u8) !KZGProof {
        if (bytes.len != 48) {
            return error.InvalidProofSize;
        }

        var proof = KZGProof.init();
        @memcpy(&proof.data, bytes);
        return proof;
    }

    /// Check if proof is the zero/identity element
    pub fn is_zero(self: *const KZGProof) bool {
        return std.mem.allEqual(u8, &self.data, 0);
    }
};

/// Versioned hash of a KZG commitment.
///
/// Versioned hashes provide a compact, versioned representation of KZG
/// commitments that can be included in transaction data. The version
/// byte enables future commitment scheme upgrades.
pub const VersionedHash = struct {
    /// 32-byte hash with version prefix
    bytes: [32]u8,

    /// Version 1 identifier for KZG commitments
    pub const VERSION_KZG: u8 = 0x01;

    /// Compute the versioned hash for a KZG commitment
    ///
    /// The versioned hash is computed as:
    /// 1. Hash = SHA256(commitment)
    /// 2. Hash[0] = VERSION_KZG (0x01)
    ///
    /// @param commitment The KZG commitment to hash
    /// @return VersionedHash with version prefix
    pub fn compute_versioned_hash(commitment: *const KZGCommitment) VersionedHash {
        const Sha256 = std.crypto.hash.sha2.Sha256;
        var hasher = Sha256.init(.{});
        hasher.update(&commitment.data);
        var hash = hasher.finalResult();

        // Set version byte to 0x01 for KZG commitments
        hash[0] = VERSION_KZG;

        return VersionedHash{ .bytes = hash };
    }

    /// Create versioned hash from bytes
    ///
    /// @param bytes Input bytes (must be exactly 32 bytes)
    /// @return VersionedHash or error if size is invalid
    /// @throws error.InvalidHashSize if bytes length != 32
    pub fn from_bytes(bytes: []const u8) !VersionedHash {
        if (bytes.len != 32) {
            return error.InvalidHashSize;
        }

        var hash: [32]u8 = undefined;
        @memcpy(&hash, bytes);
        return VersionedHash{ .bytes = hash };
    }

    /// Get the version of this versioned hash
    pub fn get_version(self: *const VersionedHash) u8 {
        return self.bytes[0];
    }

    /// Check if this is a valid KZG versioned hash (version = 0x01)
    pub fn is_kzg_hash(self: *const VersionedHash) bool {
        return self.get_version() == VERSION_KZG;
    }

    /// Convert to u256 for use in EVM stack operations
    pub fn to_u256(self: *const VersionedHash) u256 {
        var value: u256 = 0;
        for (self.bytes) |byte| {
            value = (value << 8) | byte;
        }
        return value;
    }
};

/// Validate that a commitment corresponds to its versioned hash
///
/// @param commitment The KZG commitment
/// @param versioned_hash The claimed versioned hash
/// @return true if the versioned hash is correct for the commitment
pub fn validate_commitment_hash(commitment: *const KZGCommitment, versioned_hash: *const VersionedHash) bool {
    const computed_hash = VersionedHash.compute_versioned_hash(commitment);
    return std.mem.eql(u8, &computed_hash.bytes, &versioned_hash.bytes);
}

/// Error types for blob operations
pub const BlobError = error{
    InvalidBlobSize,
    InvalidCommitmentSize,
    InvalidProofSize,
    InvalidHashSize,
    InvalidFieldElement,
    BlobValidationFailed,
};