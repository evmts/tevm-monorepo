/// EIP-4844 Blob Transaction Support
///
/// This module provides comprehensive support for EIP-4844 blob transactions,
/// including blob data structures, KZG verification, gas market mechanics,
/// and transaction validation.

// Core blob data structures
pub const blob_types = @import("blob_types.zig");
pub const Blob = blob_types.Blob;
pub const FieldElement = blob_types.FieldElement;
pub const KZGCommitment = blob_types.KZGCommitment;
pub const KZGProof = blob_types.KZGProof;
pub const VersionedHash = blob_types.VersionedHash;

// Blob gas market
pub const blob_gas_market = @import("blob_gas_market.zig");
pub const BlobGasMarket = blob_gas_market.BlobGasMarket;
pub const BlobGasMarketStats = blob_gas_market.BlobGasMarketStats;

// KZG verification
pub const kzg_verification = @import("kzg_verification.zig");
pub const KZGVerifier = kzg_verification.KZGVerifier;

// Re-export important constants
pub const BYTES_PER_BLOB = blob_types.BYTES_PER_BLOB;
pub const FIELD_ELEMENTS_PER_BLOB = blob_types.FIELD_ELEMENTS_PER_BLOB;
pub const MAX_BLOBS_PER_TRANSACTION = blob_types.MAX_BLOBS_PER_TRANSACTION;
pub const GAS_PER_BLOB = blob_types.GAS_PER_BLOB;
pub const BLS_MODULUS = blob_types.BLS_MODULUS;

pub const BLOB_BASE_FEE_UPDATE_FRACTION = blob_gas_market.BLOB_BASE_FEE_UPDATE_FRACTION;
pub const MIN_BLOB_GASPRICE = blob_gas_market.MIN_BLOB_GASPRICE;
pub const MAX_BLOB_GAS_PER_BLOCK = blob_gas_market.MAX_BLOB_GAS_PER_BLOCK;
pub const TARGET_BLOB_GAS_PER_BLOCK = blob_gas_market.TARGET_BLOB_GAS_PER_BLOCK;

// Re-export error types
pub const BlobError = blob_types.BlobError;
pub const KZGVerificationError = kzg_verification.KZGVerificationError;

// Utility functions
pub const validate_commitment_hash = blob_types.validate_commitment_hash;
pub const init_global_verifier = kzg_verification.init_global_verifier;
pub const deinit_global_verifier = kzg_verification.deinit_global_verifier;
pub const get_global_verifier = kzg_verification.get_global_verifier;