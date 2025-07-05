const std = @import("std");
const Log = @import("log.zig");

// NOTE: FEE market is currently just exported but unused by the EVM
// FeeMarket implements the EIP-1559 fee market mechanism
///
// The EIP-1559 fee market introduces a base fee per block that moves
// up or down based on how full the previous block was compared to the target.
///
// Key features:
// 1. Base fee per block that is burned (not paid to miners)
// 2. Priority fee (tip) that goes to miners
// 3. Base fee adjustment based on block fullness

/// Helper function to calculate fee delta safely avoiding overflow and division by zero
fn calculate_fee_delta(fee: u64, gas_delta: u64, gas_target: u64, denominator: u64) u64 {
    // Using u128 for intermediate calculation to avoid overflow
    const intermediate: u128 = @as(u128, fee) * @as(u128, gas_delta);
    // Avoid division by zero
    const divisor: u128 = @max(1, @as(u128, gas_target) * @as(u128, denominator));
    const result: u64 = @intCast(@min(@as(u128, std.math.maxInt(u64)), intermediate / divisor));

    // Always return at least 1 to ensure some movement
    return @max(1, result);
}
/// Minimum base fee per gas (in wei)
/// This ensures the base fee never goes to zero
pub const MIN_BASE_FEE: u64 = 7;

/// Base fee change denominator
/// The base fee can change by at most 1/BASE_FEE_CHANGE_DENOMINATOR
/// (or 12.5% with the value of 8) between blocks
pub const BASE_FEE_CHANGE_DENOMINATOR: u64 = 8;

/// Initialize base fee for the first EIP-1559 block
///
/// This is used when transitioning from a pre-EIP-1559 chain to
/// an EIP-1559 enabled chain.
///
/// Parameters:
/// - parent_gas_used: Gas used by the parent block
/// - parent_gas_limit: Gas limit of the parent block
///
/// Returns: The initial base fee (in wei)
pub fn initial_base_fee(parent_gas_used: u64, parent_gas_limit: u64) u64 {
    Log.debug("Initializing base fee for first EIP-1559 block", .{});
    Log.debug("Parent block gas used: {d}, gas limit: {d}", .{ parent_gas_used, parent_gas_limit });

    // Initial base fee formula from the EIP-1559 specification
    // If the parent block used exactly the target gas, the initial base fee is 1 gwei
    // If it used more, the initial base fee is higher
    // If it used less, the initial base fee is lower

    // Target gas usage is half the block gas limit
    const parent_gas_target = parent_gas_limit / 2;

    // Initial base fee calculation
    var base_fee: u64 = 1_000_000_000; // 1 gwei in wei

    // Adjust initial base fee based on parent block's gas usage
    if (parent_gas_used > 0) {
        const gas_used_delta = if (parent_gas_used > parent_gas_target)
            parent_gas_used - parent_gas_target
        else
            parent_gas_target - parent_gas_used;

        const base_fee_delta = calculate_fee_delta(base_fee, gas_used_delta, parent_gas_target, BASE_FEE_CHANGE_DENOMINATOR);

        if (parent_gas_used > parent_gas_target) {
            base_fee = base_fee + base_fee_delta;
        } else if (base_fee > base_fee_delta) {
            base_fee = base_fee - base_fee_delta;
        }
    }

    // Ensure base fee is at least the minimum
    base_fee = @max(base_fee, MIN_BASE_FEE);

    Log.debug("Initial base fee calculated: {d} wei", .{base_fee});
    return base_fee;
}

/// Calculate the next block's base fee based on the current block
///
/// This implements the EIP-1559 base fee adjustment algorithm:
/// - If the block used exactly the target gas, the base fee remains the same
/// - If the block used more than the target, the base fee increases
/// - If the block used less than the target, the base fee decreases
/// - The maximum change per block is 12.5% (1/8)
///
/// Parameters:
/// - parent_base_fee: Base fee of the parent block
/// - parent_gas_used: Gas used by the parent block
/// - parent_gas_target: Target gas usage of the parent block
///
/// Returns: The next block's base fee (in wei)
pub fn next_base_fee(parent_base_fee: u64, parent_gas_used: u64, parent_gas_target: u64) u64 {
    Log.debug("Calculating next block's base fee", .{});
    Log.debug("Parent block base fee: {d} wei", .{parent_base_fee});
    Log.debug("Parent block gas used: {d}, gas target: {d}", .{ parent_gas_used, parent_gas_target });

    // If parent block is empty, keep the base fee the same
    // Skip the delta calculations and just return the parent fee directly
    if (parent_gas_used == 0) {
        Log.debug("Parent block was empty, keeping base fee the same: {d} wei", .{parent_base_fee});
        return parent_base_fee;
    }

    // Calculate base fee delta
    var new_base_fee = parent_base_fee;

    if (parent_gas_used == parent_gas_target) {
        // If parent block used exactly the target gas, keep the base fee the same
        Log.debug("Parent block used exactly the target gas, keeping base fee the same", .{});
    } else if (parent_gas_used > parent_gas_target) {
        // If parent block used more than the target gas, increase the base fee

        // Calculate gas used delta as a fraction of target
        const gas_used_delta = parent_gas_used - parent_gas_target;

        // Calculate the base fee delta (max 12.5% increase)
        const base_fee_delta = calculate_fee_delta(parent_base_fee, gas_used_delta, parent_gas_target, BASE_FEE_CHANGE_DENOMINATOR);

        // Increase the base fee
        // The overflow check is probably unnecessary given gas limits, but it's a good safety measure
        new_base_fee = std.math.add(u64, parent_base_fee, base_fee_delta) catch parent_base_fee;

        Log.debug("Parent block used more than target gas, increasing base fee by {d} wei", .{base_fee_delta});
    } else {
        // If parent block used less than the target gas, decrease the base fee

        // Calculate gas used delta as a fraction of target
        const gas_used_delta = parent_gas_target - parent_gas_used;

        // Calculate the base fee delta (max 12.5% decrease)
        const base_fee_delta = calculate_fee_delta(parent_base_fee, gas_used_delta, parent_gas_target, BASE_FEE_CHANGE_DENOMINATOR);

        // Decrease the base fee, but don't go below the minimum
        new_base_fee = if (parent_base_fee > base_fee_delta)
            parent_base_fee - base_fee_delta
        else
            MIN_BASE_FEE;

        Log.debug("Parent block used less than target gas, decreasing base fee by {d} wei", .{base_fee_delta});
    }

    // Ensure base fee is at least the minimum
    new_base_fee = @max(new_base_fee, MIN_BASE_FEE);

    Log.debug("Next block base fee calculated: {d} wei", .{new_base_fee});
    return new_base_fee;
}

/// Calculate the effective gas price for an EIP-1559 transaction
///
/// The effective gas price is the minimum of:
/// 1. max_fee_per_gas specified by the sender
/// 2. base_fee_per_gas + max_priority_fee_per_gas
///
/// Parameters:
/// - base_fee_per_gas: Current block's base fee
/// - max_fee_per_gas: Maximum fee the sender is willing to pay
/// - max_priority_fee_per_gas: Maximum tip the sender is willing to pay to the miner
///
/// Returns: The effective gas price, and the miner's portion of the fee
pub fn get_effective_gas_price(base_fee_per_gas: u64, max_fee_per_gas: u64, max_priority_fee_per_gas: u64) struct { effective_gas_price: u64, miner_fee: u64 } {
    Log.debug("Calculating effective gas price", .{});
    Log.debug("Base fee: {d}, max fee: {d}, max priority fee: {d}", .{ base_fee_per_gas, max_fee_per_gas, max_priority_fee_per_gas });

    // Ensure the transaction at least pays the base fee
    if (max_fee_per_gas < base_fee_per_gas) {
        Log.warn("Transaction's max fee ({d}) is less than base fee ({d})", .{ max_fee_per_gas, base_fee_per_gas });
        // In a real implementation, this transaction would be rejected
        // For now, just return the max fee and zero miner fee
        return .{ .effective_gas_price = max_fee_per_gas, .miner_fee = 0 };
    }

    // Calculate the priority fee (tip to miner)
    // This is limited by both max_priority_fee_per_gas and the leftover after base fee
    const max_priority_fee = @min(max_priority_fee_per_gas, max_fee_per_gas - base_fee_per_gas);

    // The effective gas price is base fee plus priority fee
    const effective_gas_price = base_fee_per_gas + max_priority_fee;

    Log.debug("Effective gas price: {d} wei", .{effective_gas_price});
    Log.debug("Miner fee (priority fee): {d} wei", .{max_priority_fee});

    return .{ .effective_gas_price = effective_gas_price, .miner_fee = max_priority_fee };
}

/// Get the gas target for a block
///
/// The gas target is the desired gas usage per block, which is typically
/// half of the maximum gas limit.
///
/// Parameters:
/// - gas_limit: The block's gas limit
///
/// Returns: The gas target for the block
pub fn get_gas_target(gas_limit: u64) u64 {
    return gas_limit / 2;
}
