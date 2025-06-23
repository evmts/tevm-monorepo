const std = @import("std");
const blob_types = @import("blob_types.zig");

/// EIP-4844 Blob Gas Market Implementation
///
/// This module implements the blob gas fee market mechanism introduced in EIP-4844.
/// The blob gas market operates independently from the regular gas market, with its own
/// base fee calculation and fee adjustment mechanism targeting 3 blobs per block.

/// EIP-4844 blob gas market constants
pub const BLOB_BASE_FEE_UPDATE_FRACTION = 3338477; // Adjustment factor for base fee updates
pub const MIN_BLOB_GASPRICE = 1; // Minimum blob gas price (1 wei)
pub const MAX_BLOB_GAS_PER_BLOCK = 786432; // 6 blobs * 131072 gas per blob
pub const TARGET_BLOB_GAS_PER_BLOCK = 393216; // 3 blobs * 131072 gas per blob

/// Blob gas market implementation for EIP-4844
///
/// The blob gas market uses an independent fee adjustment mechanism from regular gas,
/// with exponential adjustment targeting an average of 3 blobs per block.
pub const BlobGasMarket = struct {
    /// Calculate the blob base fee for the current block
    ///
    /// The blob base fee adjusts based on the blob gas usage in the parent block:
    /// - If usage equals target: base fee remains unchanged
    /// - If usage exceeds target: base fee increases exponentially
    /// - If usage is below target: base fee decreases exponentially
    ///
    /// @param parent_blob_gas_used Blob gas used in the parent block
    /// @param parent_blob_base_fee Blob base fee from the parent block
    /// @return New blob base fee for the current block
    pub fn calculate_blob_base_fee(
        parent_blob_gas_used: u64,
        parent_blob_base_fee: u256,
    ) u256 {
        // If blob gas usage equals target, maintain current base fee
        if (parent_blob_gas_used == TARGET_BLOB_GAS_PER_BLOCK) {
            return parent_blob_base_fee;
        }

        // Adjust base fee based on whether usage exceeded or fell short of target
        if (parent_blob_gas_used > TARGET_BLOB_GAS_PER_BLOCK) {
            @branchHint(.likely); // Most blocks are expected to have some blob usage
            return calculate_blob_fee_increase(parent_blob_gas_used, parent_blob_base_fee);
        } else {
            @branchHint(.unlikely); // Zero or low blob usage is less common
            return calculate_blob_fee_decrease(parent_blob_gas_used, parent_blob_base_fee);
        }
    }

    /// Calculate increased blob base fee when usage exceeds target
    ///
    /// Formula: base_fee + max(base_fee * excess_gas / target_gas / update_fraction, 1)
    ///
    /// @param blob_gas_used Blob gas used in the parent block
    /// @param base_fee Current blob base fee
    /// @return Increased blob base fee
    fn calculate_blob_fee_increase(blob_gas_used: u64, base_fee: u256) u256 {
        const excess_blob_gas = blob_gas_used - TARGET_BLOB_GAS_PER_BLOCK;

        // Calculate the fee increase delta
        // delta = max(parent_blob_base_fee * excess_blob_gas / TARGET_BLOB_GAS_PER_BLOCK / BLOB_BASE_FEE_UPDATE_FRACTION, 1)
        const numerator = base_fee * excess_blob_gas;
        const denominator = TARGET_BLOB_GAS_PER_BLOCK * BLOB_BASE_FEE_UPDATE_FRACTION;

        // Ensure a minimum increase of 1 wei
        const delta = @max(numerator / denominator, 1);

        return base_fee + delta;
    }

    /// Calculate decreased blob base fee when usage is below target
    ///
    /// Formula: max(base_fee - base_fee * deficit_gas / target_gas / update_fraction, min_price)
    ///
    /// @param blob_gas_used Blob gas used in the parent block
    /// @param base_fee Current blob base fee
    /// @return Decreased blob base fee (minimum MIN_BLOB_GASPRICE)
    fn calculate_blob_fee_decrease(blob_gas_used: u64, base_fee: u256) u256 {
        const deficit_blob_gas = TARGET_BLOB_GAS_PER_BLOCK - blob_gas_used;

        // Calculate the fee decrease delta
        // delta = parent_blob_base_fee * deficit_blob_gas / TARGET_BLOB_GAS_PER_BLOCK / BLOB_BASE_FEE_UPDATE_FRACTION
        const numerator = base_fee * deficit_blob_gas;
        const denominator = TARGET_BLOB_GAS_PER_BLOCK * BLOB_BASE_FEE_UPDATE_FRACTION;
        const delta = numerator / denominator;

        // Ensure the base fee never goes below the minimum
        return if (base_fee > delta) base_fee - delta else MIN_BLOB_GASPRICE;
    }

    /// Calculate the total blob fee for a transaction
    ///
    /// @param blob_count Number of blobs in the transaction
    /// @param blob_base_fee Current blob base fee per gas
    /// @return Total blob fee in wei
    pub fn calculate_blob_fee(blob_count: u32, blob_base_fee: u256) u256 {
        const blob_gas_used = blob_count * blob_types.GAS_PER_BLOB;
        return blob_gas_used * blob_base_fee;
    }

    /// Validate that a transaction's blob count doesn't exceed block limits
    ///
    /// @param blob_count Number of blobs in the transaction
    /// @return true if the blob count is valid, false otherwise
    pub fn validate_blob_gas_limit(blob_count: u32) bool {
        if (blob_count == 0) {
            @branchHint(.cold); // Blob transactions must have at least one blob
            return false;
        }

        if (blob_count > blob_types.MAX_BLOBS_PER_TRANSACTION) {
            @branchHint(.cold); // More than 6 blobs per transaction is invalid
            return false;
        }

        const total_blob_gas = blob_count * blob_types.GAS_PER_BLOB;
        return total_blob_gas <= MAX_BLOB_GAS_PER_BLOCK;
    }

    /// Calculate the blob gas used by a given number of blobs
    ///
    /// @param blob_count Number of blobs
    /// @return Total blob gas consumed
    pub fn calculate_blob_gas_used(blob_count: u32) u64 {
        return @as(u64, blob_count) * blob_types.GAS_PER_BLOB;
    }

    /// Validate that a transaction can afford the blob fee
    ///
    /// @param max_fee_per_blob_gas Maximum fee per blob gas the sender is willing to pay
    /// @param current_blob_base_fee Current blob base fee
    /// @return true if the transaction can afford the blob fee
    pub fn validate_blob_fee_affordability(
        max_fee_per_blob_gas: u256,
        current_blob_base_fee: u256,
    ) bool {
        // Check if the sender's maximum fee per blob gas is sufficient
        if (max_fee_per_blob_gas < current_blob_base_fee) {
            @branchHint(.cold); // Insufficient fee is an error condition
            return false;
        }

        return true;
    }

    /// Calculate the excess blob gas for the current block
    ///
    /// Excess blob gas accumulates when blocks consistently use more than the target
    /// blob gas, and is used to calculate the blob base fee.
    ///
    /// @param parent_excess_blob_gas Excess blob gas from the parent block
    /// @param parent_blob_gas_used Blob gas used in the parent block
    /// @return New excess blob gas for the current block
    pub fn calculate_excess_blob_gas(
        parent_excess_blob_gas: u64,
        parent_blob_gas_used: u64,
    ) u64 {
        const total_excess = parent_excess_blob_gas + parent_blob_gas_used;

        // Subtract the target to get the new excess
        return if (total_excess > TARGET_BLOB_GAS_PER_BLOCK)
            total_excess - TARGET_BLOB_GAS_PER_BLOCK
        else
            0;
    }

    /// Calculate blob base fee from excess blob gas (alternative method)
    ///
    /// This method calculates the blob base fee directly from the excess blob gas
    /// using the EIP-4844 fake exponential function.
    ///
    /// @param excess_blob_gas Current excess blob gas
    /// @return Blob base fee calculated from excess gas
    pub fn calculate_blob_base_fee_from_excess_gas(excess_blob_gas: u64) u256 {
        if (excess_blob_gas == 0) {
            return MIN_BLOB_GASPRICE;
        }

        // Simplified exponential approximation
        // In a full implementation, this would use the exact fake_exponential function from EIP-4844
        // For now, we use a simplified version: min_price * 2^(excess_gas / update_fraction)
        const exponent = @min(excess_blob_gas / BLOB_BASE_FEE_UPDATE_FRACTION, 64);
        const factor = @as(u256, 1) << @as(u6, @intCast(exponent));

        return MIN_BLOB_GASPRICE * factor;
    }
};

/// Blob gas market statistics for monitoring and debugging
pub const BlobGasMarketStats = struct {
    /// Current blob base fee
    blob_base_fee: u256,
    /// Current excess blob gas
    excess_blob_gas: u64,
    /// Target blob gas per block
    target_blob_gas: u64,
    /// Maximum blob gas per block
    max_blob_gas: u64,
    /// Current blob gas utilization percentage (0-100)
    utilization_percentage: u8,

    /// Create market statistics from current state
    ///
    /// @param blob_base_fee Current blob base fee
    /// @param excess_blob_gas Current excess blob gas
    /// @param current_blob_gas_used Blob gas used in the current block
    /// @return BlobGasMarketStats structure
    pub fn from_current_state(
        blob_base_fee: u256,
        excess_blob_gas: u64,
        current_blob_gas_used: u64,
    ) BlobGasMarketStats {
        const utilization = if (current_blob_gas_used == 0)
            0
        else
            @as(u8, @intCast((current_blob_gas_used * 100) / MAX_BLOB_GAS_PER_BLOCK));

        return BlobGasMarketStats{
            .blob_base_fee = blob_base_fee,
            .excess_blob_gas = excess_blob_gas,
            .target_blob_gas = TARGET_BLOB_GAS_PER_BLOCK,
            .max_blob_gas = MAX_BLOB_GAS_PER_BLOCK,
            .utilization_percentage = utilization,
        };
    }
};