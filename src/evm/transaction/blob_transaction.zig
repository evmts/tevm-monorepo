const std = @import("std");
const Address = @import("Address");
const AccessList = @import("../access_list/access_list.zig");
const blob_types = @import("../blob/blob_types.zig");
const blob_gas_market = @import("../blob/blob_gas_market.zig");
const kzg_verification = @import("../blob/kzg_verification.zig");

/// EIP-4844 Blob Transaction Implementation
///
/// This module implements the blob transaction type introduced in EIP-4844,
/// which extends EIP-1559 transactions to include blob data for L2 data availability.
/// Blob transactions include versioned hashes of blob commitments and separate
/// blob gas pricing.

/// Transaction type identifier for blob transactions (EIP-2718)
pub const BLOB_TX_TYPE = 0x03;

/// Errors that can occur during blob transaction processing
pub const BlobTransactionError = error{
    InvalidBlobCount,
    InvalidVersionedHash,
    KZGVerificationFailed,
    BlobGasLimitExceeded,
    InsufficientBlobGasFee,
    InvalidBlobData,
    MismatchedArrayLengths,
    TransactionTooLarge,
    InvalidSignature,
    EncodingFailed,
    OutOfMemory,
};

/// EIP-4844 blob transaction structure
///
/// Extends EIP-1559 transactions with blob-specific fields for data availability.
/// The transaction includes versioned hashes of blob commitments, but the actual
/// blob data is transmitted separately and not included in the transaction hash.
pub const BlobTransaction = struct {
    /// EIP-1559 transaction fields
    chain_id: u64,
    nonce: u64,
    max_priority_fee_per_gas: u256,
    max_fee_per_gas: u256,
    gas_limit: u64,
    to: ?Address.Address, // Blob transactions must have a recipient (cannot be contract creation)
    value: u256,
    data: []const u8,
    access_list: AccessList,

    /// EIP-4844 blob-specific fields
    max_fee_per_blob_gas: u256,
    blob_versioned_hashes: []const blob_types.VersionedHash,

    /// Blob sidecar data (not part of transaction hash, transmitted separately)
    blobs: ?[]const blob_types.Blob,
    commitments: ?[]const blob_types.KZGCommitment,
    proofs: ?[]const blob_types.KZGProof,

    /// Transaction signature (EIP-155)
    v: u256,
    r: u256,
    s: u256,

    /// Memory allocator for dynamic fields
    allocator: std.mem.Allocator,

    /// Initialize a new blob transaction
    ///
    /// @param allocator Memory allocator for dynamic fields
    /// @return Initialized blob transaction with default values
    pub fn init(allocator: std.mem.Allocator) BlobTransaction {
        return BlobTransaction{
            .chain_id = 0,
            .nonce = 0,
            .max_priority_fee_per_gas = 0,
            .max_fee_per_gas = 0,
            .gas_limit = 0,
            .to = null,
            .value = 0,
            .data = &[_]u8{},
            .access_list = AccessList.init(allocator),
            .max_fee_per_blob_gas = 0,
            .blob_versioned_hashes = &[_]blob_types.VersionedHash{},
            .blobs = null,
            .commitments = null,
            .proofs = null,
            .v = 0,
            .r = 0,
            .s = 0,
            .allocator = allocator,
        };
    }

    /// Clean up resources used by the transaction
    pub fn deinit(self: *BlobTransaction) void {
        self.access_list.deinit();

        if (self.data.len > 0) {
            self.allocator.free(self.data);
        }

        if (self.blob_versioned_hashes.len > 0) {
            self.allocator.free(self.blob_versioned_hashes);
        }

        if (self.blobs) |blobs| {
            self.allocator.free(blobs);
        }

        if (self.commitments) |commitments| {
            self.allocator.free(commitments);
        }

        if (self.proofs) |proofs| {
            self.allocator.free(proofs);
        }
    }

    /// Get the number of blobs in this transaction
    pub fn get_blob_count(self: *const BlobTransaction) u32 {
        return @as(u32, @intCast(self.blob_versioned_hashes.len));
    }

    /// Calculate the total blob gas used by this transaction
    pub fn get_blob_gas_used(self: *const BlobTransaction) u64 {
        return blob_gas_market.BlobGasMarket.calculate_blob_gas_used(self.get_blob_count());
    }

    /// Calculate the blob fee for this transaction
    ///
    /// @param blob_base_fee Current blob base fee
    /// @return Total blob fee in wei
    pub fn calculate_blob_fee(self: *const BlobTransaction, blob_base_fee: u256) u256 {
        return blob_gas_market.BlobGasMarket.calculate_blob_fee(self.get_blob_count(), blob_base_fee);
    }

    /// Validate the blob transaction structure and constraints
    ///
    /// @param current_blob_base_fee Current blob base fee for affordability check
    /// @return void on success, error on validation failure
    /// @throws BlobTransactionError for various validation failures
    pub fn validate(self: *const BlobTransaction, current_blob_base_fee: u256) BlobTransactionError!void {
        // Validate blob count constraints
        const blob_count = self.get_blob_count();
        if (blob_count == 0 or blob_count > blob_types.MAX_BLOBS_PER_TRANSACTION) {
            @branchHint(.cold);
            return BlobTransactionError.InvalidBlobCount;
        }

        // Validate blob gas limit
        if (!blob_gas_market.BlobGasMarket.validate_blob_gas_limit(blob_count)) {
            @branchHint(.cold);
            return BlobTransactionError.BlobGasLimitExceeded;
        }

        // Validate blob fee affordability
        if (!blob_gas_market.BlobGasMarket.validate_blob_fee_affordability(
            self.max_fee_per_blob_gas,
            current_blob_base_fee,
        )) {
            @branchHint(.cold);
            return BlobTransactionError.InsufficientBlobGasFee;
        }

        // Validate that blob transactions must have a recipient (no contract creation)
        if (self.to == null) {
            @branchHint(.cold);
            return BlobTransactionError.InvalidBlobData;
        }

        // If blob sidecar data is provided, validate it
        if (self.blobs) |blobs| {
            try self.validate_blob_sidecar(blobs);
        }
    }

    /// Validate the blob sidecar data (blobs, commitments, proofs)
    ///
    /// @param blobs The blob data to validate
    /// @throws BlobTransactionError for validation failures
    fn validate_blob_sidecar(self: *const BlobTransaction, blobs: []const blob_types.Blob) BlobTransactionError!void {
        // All arrays must have the same length
        if (blobs.len != self.blob_versioned_hashes.len) {
            @branchHint(.cold);
            return BlobTransactionError.MismatchedArrayLengths;
        }

        const commitments = self.commitments orelse {
            @branchHint(.cold);
            return BlobTransactionError.MismatchedArrayLengths;
        };

        const proofs = self.proofs orelse {
            @branchHint(.cold);
            return BlobTransactionError.MismatchedArrayLengths;
        };

        if (commitments.len != blobs.len or proofs.len != blobs.len) {
            @branchHint(.cold);
            return BlobTransactionError.MismatchedArrayLengths;
        }

        // Validate each blob against its commitment and versioned hash
        for (blobs, commitments, proofs, self.blob_versioned_hashes, 0..) |*blob, *commitment, *proof, *versioned_hash, i| {
            _ = i; // Suppress unused variable warning

            // Validate blob data
            if (!blob.validate()) {
                @branchHint(.cold);
                return BlobTransactionError.InvalidBlobData;
            }

            // Validate versioned hash matches commitment
            if (!blob_types.validate_commitment_hash(commitment, versioned_hash)) {
                @branchHint(.cold);
                return BlobTransactionError.InvalidVersionedHash;
            }

            // Validate KZG proof (requires KZG verifier)
            if (kzg_verification.get_global_verifier()) |verifier| {
                const verification_result = verifier.verify_blob_kzg_proof(blob, commitment, proof) catch {
                    @branchHint(.cold);
                    return BlobTransactionError.KZGVerificationFailed;
                };

                if (!verification_result) {
                    @branchHint(.cold);
                    return BlobTransactionError.KZGVerificationFailed;
                }
            }
        }
    }

    /// Set blob sidecar data (blobs, commitments, proofs)
    ///
    /// @param blobs Blob data array
    /// @param commitments KZG commitment array
    /// @param proofs KZG proof array
    /// @throws BlobTransactionError.MismatchedArrayLengths if arrays have different lengths
    /// @throws BlobTransactionError.OutOfMemory if allocation fails
    pub fn set_blob_sidecar(
        self: *BlobTransaction,
        blobs: []const blob_types.Blob,
        commitments: []const blob_types.KZGCommitment,
        proofs: []const blob_types.KZGProof,
    ) BlobTransactionError!void {
        if (blobs.len != commitments.len or blobs.len != proofs.len) {
            @branchHint(.cold);
            return BlobTransactionError.MismatchedArrayLengths;
        }

        // Clean up existing sidecar data
        if (self.blobs) |old_blobs| {
            self.allocator.free(old_blobs);
        }
        if (self.commitments) |old_commitments| {
            self.allocator.free(old_commitments);
        }
        if (self.proofs) |old_proofs| {
            self.allocator.free(old_proofs);
        }

        // Copy new sidecar data
        const new_blobs = self.allocator.dupe(blob_types.Blob, blobs) catch {
            return BlobTransactionError.OutOfMemory;
        };
        const new_commitments = self.allocator.dupe(blob_types.KZGCommitment, commitments) catch {
            self.allocator.free(new_blobs);
            return BlobTransactionError.OutOfMemory;
        };
        const new_proofs = self.allocator.dupe(blob_types.KZGProof, proofs) catch {
            self.allocator.free(new_blobs);
            self.allocator.free(new_commitments);
            return BlobTransactionError.OutOfMemory;
        };

        self.blobs = new_blobs;
        self.commitments = new_commitments;
        self.proofs = new_proofs;
    }

    /// Set versioned hashes from commitments
    ///
    /// @param commitments Array of KZG commitments to generate versioned hashes from
    /// @throws BlobTransactionError.OutOfMemory if allocation fails
    pub fn set_versioned_hashes_from_commitments(
        self: *BlobTransaction,
        commitments: []const blob_types.KZGCommitment,
    ) BlobTransactionError!void {
        // Clean up existing versioned hashes
        if (self.blob_versioned_hashes.len > 0) {
            self.allocator.free(self.blob_versioned_hashes);
        }

        // Generate versioned hashes from commitments
        const versioned_hashes = self.allocator.alloc(blob_types.VersionedHash, commitments.len) catch {
            return BlobTransactionError.OutOfMemory;
        };

        for (commitments, versioned_hashes) |*commitment, *versioned_hash| {
            versioned_hash.* = blob_types.VersionedHash.compute_versioned_hash(commitment);
        }

        self.blob_versioned_hashes = versioned_hashes;
    }

    /// Generate the transaction hash for signature verification
    ///
    /// The transaction hash does NOT include the blob sidecar data, only the
    /// versioned hashes. This allows the blob data to be transmitted separately.
    ///
    /// @return 32-byte transaction hash
    /// @throws BlobTransactionError.EncodingFailed if encoding fails
    /// @throws BlobTransactionError.OutOfMemory if allocation fails
    pub fn hash(self: *const BlobTransaction) BlobTransactionError!blob_types.VersionedHash {
        const encoded = self.encode_for_signing() catch {
            return BlobTransactionError.EncodingFailed;
        };
        defer self.allocator.free(encoded);

        const Keccak256 = std.crypto.hash.sha3.Keccak256;
        var hasher = Keccak256.init(.{});
        hasher.update(encoded);
        const hash_bytes = hasher.finalResult();

        return blob_types.VersionedHash.from_bytes(&hash_bytes) catch {
            return BlobTransactionError.EncodingFailed;
        };
    }

    /// Encode transaction for signature hash calculation
    ///
    /// Follows EIP-2718 typed transaction encoding for blob transactions.
    /// The encoding includes all transaction fields except the signature.
    ///
    /// @return Encoded transaction bytes
    /// @throws BlobTransactionError.OutOfMemory if allocation fails
    pub fn encode_for_signing(self: *const BlobTransaction) BlobTransactionError![]u8 {
        var list = std.ArrayList(u8).init(self.allocator);
        defer list.deinit();

        // Transaction type prefix
        list.append(BLOB_TX_TYPE) catch {
            return BlobTransactionError.OutOfMemory;
        };

        // TODO: Implement proper RLP encoding
        // For now, this is a placeholder implementation
        // A real implementation would RLP encode:
        // [chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, 
        //  to, value, data, access_list, max_fee_per_blob_gas, blob_versioned_hashes]

        // Placeholder: serialize key fields as bytes
        const fields = [_]u256{
            self.chain_id,
            self.nonce,
            self.max_priority_fee_per_gas,
            self.max_fee_per_gas,
            self.gas_limit,
            self.value,
            self.max_fee_per_blob_gas,
        };

        for (fields) |field| {
            const field_bytes = field_to_bytes(field);
            list.appendSlice(&field_bytes) catch {
                return BlobTransactionError.OutOfMemory;
            };
        }

        // Add versioned hashes
        for (self.blob_versioned_hashes) |*versioned_hash| {
            list.appendSlice(&versioned_hash.bytes) catch {
                return BlobTransactionError.OutOfMemory;
            };
        }

        return list.toOwnedSlice() catch {
            return BlobTransactionError.OutOfMemory;
        };
    }

    /// Check if this transaction has valid blob sidecar data
    pub fn has_valid_sidecar(self: *const BlobTransaction) bool {
        return self.blobs != null and self.commitments != null and self.proofs != null;
    }

    /// Get the transaction type
    pub fn get_type(self: *const BlobTransaction) u8 {
        _ = self;
        return BLOB_TX_TYPE;
    }
};

/// Convert a u256 value to big-endian bytes
fn field_to_bytes(value: u256) [32]u8 {
    var bytes: [32]u8 = undefined;
    var val = value;

    var i: usize = 32;
    while (i > 0) {
        i -= 1;
        bytes[i] = @as(u8, @truncate(val));
        val >>= 8;
    }

    return bytes;
}

/// Blob transaction validator for block processing
pub const BlobTransactionValidator = struct {
    /// Validate a blob transaction for inclusion in a block
    ///
    /// @param transaction The blob transaction to validate
    /// @param current_blob_base_fee Current blob base fee
    /// @param current_block_blob_gas_used Blob gas already used in current block
    /// @return void on success, error on validation failure
    pub fn validate_for_block(
        transaction: *const BlobTransaction,
        current_blob_base_fee: u256,
        current_block_blob_gas_used: u64,
    ) BlobTransactionError!void {
        // Basic transaction validation
        try transaction.validate(current_blob_base_fee);

        // Check if adding this transaction would exceed block blob gas limit
        const transaction_blob_gas = transaction.get_blob_gas_used();
        const total_blob_gas = current_block_blob_gas_used + transaction_blob_gas;

        if (total_blob_gas > blob_gas_market.MAX_BLOB_GAS_PER_BLOCK) {
            @branchHint(.cold);
            return BlobTransactionError.BlobGasLimitExceeded;
        }
    }

    /// Validate blob transaction signature
    ///
    /// @param transaction The blob transaction to validate
    /// @return true if signature is valid
    /// TODO: Implement actual signature verification
    pub fn validate_signature(transaction: *const BlobTransaction) bool {
        // Placeholder implementation
        // Real implementation would:
        // 1. Recover public key from signature
        // 2. Verify signature against transaction hash
        // 3. Check that sender matches recovered address

        return transaction.v != 0 and transaction.r != 0 and transaction.s != 0;
    }
};