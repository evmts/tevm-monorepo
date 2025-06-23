/// EIP-4844 Transaction Support
///
/// This module provides transaction types and validation for EIP-4844 blob transactions.

// Blob transaction implementation
pub const blob_transaction = @import("blob_transaction.zig");
pub const BlobTransaction = blob_transaction.BlobTransaction;
pub const BlobTransactionValidator = blob_transaction.BlobTransactionValidator;

// Re-export important constants and types
pub const BLOB_TX_TYPE = blob_transaction.BLOB_TX_TYPE;
pub const BlobTransactionError = blob_transaction.BlobTransactionError;