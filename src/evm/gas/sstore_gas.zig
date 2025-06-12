const std = @import("std");
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;
const gas_constants = @import("../constants/gas_constants.zig");
const Log = @import("../log.zig");

/// SSTORE gas calculation and refund logic according to EIP-2200.
///
/// This module implements the complex gas metering for SSTORE operations that
/// depend on comparing original, current, and new storage values. The logic
/// follows EIP-2200 specification with hardfork-specific variations.
///
/// ## EIP-2200 Overview
/// SSTORE gas costs depend on three values:
/// - **Original**: Value at the start of the transaction
/// - **Current**: Value at the moment of SSTORE execution  
/// - **New**: Value being written by SSTORE
///
/// ## Gas Cost Formula
/// The gas cost depends on whether the storage slot is warm/cold (EIP-2929)
/// and the relationship between original, current, and new values.
pub const SStoreGasCalculator = struct {
    /// Calculate SSTORE gas cost according to EIP-2200.
    ///
    /// This function implements the complete EIP-2200 SSTORE gas calculation,
    /// taking into account warm/cold access costs and the complex state
    /// transitions for storage operations.
    ///
    /// @param original_value Value at transaction start
    /// @param current_value Current value in storage
    /// @param new_value Value being written
    /// @param hardfork Current hardfork for gas cost variations
    /// @param is_warm Whether the storage slot is warm (accessed before)
    /// @return Gas cost for the SSTORE operation
    ///
    /// Example:
    /// ```zig
    /// const gas_cost = SStoreGasCalculator.calculate_gas_cost(
    ///     0,      // original_value: was zero
    ///     0,      // current_value: still zero  
    ///     100,    // new_value: setting to 100
    ///     .LONDON, // hardfork
    ///     false   // is_warm: first access
    /// ); // Returns 22100 gas (2100 cold + 20000 set)
    /// ```
    pub fn calculate_gas_cost(
        original_value: u256,
        current_value: u256,
        new_value: u256,
        _: Hardfork, // Currently unused, may be needed for future hardfork-specific logic
        is_warm: bool,
    ) u64 {
        @branchHint(.likely);
        Log.debug("SStoreGasCalculator.calculate_gas_cost: original={}, current={}, new={}, warm={}", .{ original_value, current_value, new_value, is_warm });
        
        // No-op: current value equals new value (EIP-2200)
        if (current_value == new_value) {
            @branchHint(.likely);
            // EIP-2200: No-op operations
            // - Warm: 0 gas (completely free)
            // - Cold: 2100 gas (cold access cost)
            return if (is_warm) 0 else gas_constants.ColdSloadCost;
        }
        
        // EIP-2200 gas calculation with EIP-2929 modifications
        var gas_cost: u64 = 0;
        
        if (original_value == current_value) {
            // First modification in this transaction
            if (is_zero(original_value)) {
                // Setting zero to non-zero (most expensive)
                gas_cost = gas_constants.SSTORE_SET; // 20000 gas
            } else if (is_zero(new_value)) {
                // Clearing non-zero to zero (with refund)
                gas_cost = gas_constants.SSTORE_RESET; // 2800 gas base
            } else {
                // Modifying non-zero to different non-zero
                gas_cost = gas_constants.SSTORE_RESET; // 2800 gas base
            }
        } else {
            // Slot was already modified in this transaction (dirty slot)
            // For subsequent modifications, use current vs new value logic
            if (!is_zero(current_value)) {
                // Current is non-zero: treat as SSTORE_RESET operation
                if (is_zero(new_value)) {
                    // Clearing to zero
                    gas_cost = gas_constants.SSTORE_RESET; // 2800 gas base
                } else {
                    // Modifying non-zero to different non-zero
                    gas_cost = gas_constants.SSTORE_RESET; // 2800 gas base
                }
            } else {
                // Current is zero: treat as SSTORE_SET operation
                if (!is_zero(new_value)) {
                    // Setting from zero
                    gas_cost = gas_constants.SSTORE_SET; // 20000 gas
                } else {
                    // Zero to zero (should be handled by no-op case above)
                    gas_cost = gas_constants.WarmStorageReadCost; // 100 gas
                }
            }
        }
        
        // Add access cost according to EIP-2929
        if (!is_warm) {
            // Cold access: add cold access cost
            gas_cost += gas_constants.ColdSloadCost; // +2100 gas
        } else {
            // Warm access: add warm access cost for all SSTORE operations
            gas_cost += gas_constants.WarmStorageReadCost; // +100 gas
        }
        
        Log.debug("SStoreGasCalculator.calculate_gas_cost: calculated gas_cost={}", .{gas_cost});
        return gas_cost;
    }
    
    /// Calculate SSTORE gas refund according to EIP-2200.
    ///
    /// This function implements the complex refund logic that depends on the
    /// relationship between original, current, and new values. Refunds can be
    /// positive (adding to refund total) or negative (subtracting from total).
    ///
    /// @param original_value Value at transaction start
    /// @param current_value Current value in storage
    /// @param new_value Value being written
    /// @param hardfork Current hardfork for refund variations
    /// @return Signed refund amount (positive = add refund, negative = remove refund)
    ///
    /// Example:
    /// ```zig
    /// const refund = SStoreGasCalculator.calculate_refund(
    ///     100,    // original_value: was 100
    ///     100,    // current_value: still 100
    ///     0,      // new_value: clearing to zero
    ///     .LONDON // hardfork
    /// ); // Returns 15000 (SSTORE_CLEAR_REFUND)
    /// ```
    pub fn calculate_refund(
        original_value: u256,
        current_value: u256,
        new_value: u256,
        hardfork: Hardfork,
    ) i64 {
        @branchHint(.likely);
        Log.debug("SStoreGasCalculator.calculate_refund: original={}, current={}, new={}", .{ original_value, current_value, new_value });
        
        // No refund for no-op operations
        if (current_value == new_value) {
            return 0;
        }
        
        var refund: i64 = 0;
        
        if (original_value == current_value) {
            // First modification in this transaction
            if (!is_zero(original_value) and is_zero(new_value)) {
                // Clearing storage: add refund
                refund += gas_constants.SSTORE_CLEAR_REFUND;
            }
        } else {
            // Storage was already modified in this transaction
            if (!is_zero(original_value)) {
                // Original was non-zero
                if (is_zero(current_value)) {
                    // Un-clearing: remove previous clear refund
                    refund -= gas_constants.SSTORE_CLEAR_REFUND;
                }
                if (is_zero(new_value)) {
                    // Clearing again: add clear refund
                    refund += gas_constants.SSTORE_CLEAR_REFUND;
                }
            }
            
            if (is_zero(original_value)) {
                // Original was zero
                if (!is_zero(current_value)) {
                    // Un-creating: remove previous set refund
                    refund -= gas_constants.SSTORE_SET_REFUND;
                }
                if (is_zero(new_value)) {
                    // Creating again (zero->zero): add set refund
                    refund += gas_constants.SSTORE_SET_REFUND;
                }
            }
            
            // Reset to original value refunds
            if (original_value == new_value) {
                if (is_zero(original_value)) {
                    // Reset to original zero
                    refund += gas_constants.SSTORE_SET_REFUND;
                } else {
                    // Reset to original non-zero
                    refund += gas_constants.SSTORE_RESET_REFUND;
                }
            }
        }
        
        // Apply hardfork-specific refund adjustments
        // Currently hardfork doesn't affect refund calculations beyond the base EIP-2200 logic
        // Future EIPs may require hardfork-specific adjustments here
        _ = hardfork;
        
        Log.debug("SStoreGasCalculator.calculate_refund: calculated refund={}", .{refund});
        return refund;
    }
    
    /// Check if the current context has enough gas for SSTORE operation.
    ///
    /// EIP-2200 requires that at least 2300 gas remains after the SSTORE
    /// operation to prevent reentrancy attacks. This is known as the
    /// "gas sentry" mechanism.
    ///
    /// @param gas_remaining Gas available for execution
    /// @param gas_cost Calculated gas cost for this SSTORE
    /// @return True if enough gas is available
    ///
    /// Example:
    /// ```zig
    /// const can_execute = SStoreGasCalculator.check_gas_sentry(10000, 5000);
    /// // Returns true because 10000 - 5000 >= 2300
    /// ```
    pub fn check_gas_sentry(gas_remaining: u64, gas_cost: u64) bool {
        if (gas_cost > gas_remaining) {
            return false;
        }
        return (gas_remaining - gas_cost) >= gas_constants.SSTORE_SENTRY_GAS;
    }
    
    /// Get the minimum gas required to execute SSTORE operations.
    ///
    /// This is used to validate that SSTORE can be executed without
    /// violating the gas sentry requirement.
    ///
    /// @return Minimum gas required (2300)
    pub fn get_minimum_gas_requirement() u64 {
        return gas_constants.SSTORE_SENTRY_GAS;
    }
};

/// Check if a u256 value is zero.
/// Optimized helper function for common zero checks in SSTORE logic.
fn is_zero(value: u256) bool {
    return value == 0;
}

/// SSTORE execution result containing gas cost and refund information.
pub const SStoreResult = struct {
    /// Gas cost for the SSTORE operation
    gas_cost: u64,
    /// Gas refund amount (can be negative)
    refund: i64,
    /// Whether the operation is valid (passed gas sentry check)
    is_valid: bool,
    
    /// Create a successful SSTORE result.
    pub fn success(gas_cost: u64, refund: i64) SStoreResult {
        return SStoreResult{
            .gas_cost = gas_cost,
            .refund = refund,
            .is_valid = true,
        };
    }
    
    /// Create a failed SSTORE result (insufficient gas).
    pub fn failure() SStoreResult {
        return SStoreResult{
            .gas_cost = 0,
            .refund = 0,
            .is_valid = false,
        };
    }
};

/// Calculate complete SSTORE operation including gas cost, refund, and validation.
///
/// This is a convenience function that performs all SSTORE calculations
/// in one call, returning a complete result structure.
///
/// @param original_value Value at transaction start
/// @param current_value Current value in storage
/// @param new_value Value being written
/// @param hardfork Current hardfork
/// @param is_warm Whether storage slot is warm
/// @param gas_remaining Available gas for execution
/// @return Complete SSTORE result with gas cost, refund, and validity
pub fn calculate_sstore_operation(
    original_value: u256,
    current_value: u256,
    new_value: u256,
    hardfork: Hardfork,
    is_warm: bool,
    gas_remaining: u64,
) SStoreResult {
    const gas_cost = SStoreGasCalculator.calculate_gas_cost(
        original_value,
        current_value,
        new_value,
        hardfork,
        is_warm,
    );
    
    const refund = SStoreGasCalculator.calculate_refund(
        original_value,
        current_value,
        new_value,
        hardfork,
    );
    
    const is_valid = SStoreGasCalculator.check_gas_sentry(gas_remaining, gas_cost);
    
    // Debug output to understand what's happening
    Log.debug("calculate_sstore_operation: gas_cost={}, gas_remaining={}, sentry_check={}, remaining_after={}", .{ gas_cost, gas_remaining, is_valid, gas_remaining -| gas_cost });
    
    if (is_valid) {
        return SStoreResult.success(gas_cost, refund);
    } else {
        return SStoreResult.failure();
    }
}