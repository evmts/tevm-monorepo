const std = @import("std");
const gas_constants = @import("../constants/gas_constants.zig");
const Address = @import("Address");

/// Result of call gas calculation including base cost, forwarded gas, and stipend
pub const CallGasCalculation = struct {
    /// Gas cost for the call operation itself (paid by caller)
    base_cost: u64,
    /// Total gas sent to called contract (including stipend)
    gas_forwarded: u64,
    /// Stipend amount included in forwarded gas (0 for non-value calls)
    gas_stipend: u64,
    
    /// Get total cost paid by caller
    pub fn total_caller_cost(self: *const CallGasCalculation) u64 {
        return self.base_cost;
    }
    
    /// Get total gas available to recipient
    pub fn total_recipient_gas(self: *const CallGasCalculation) u64 {
        return self.gas_forwarded;
    }
    
    /// Check if this call includes a gas stipend
    pub fn has_stipend(self: *const CallGasCalculation) bool {
        return self.gas_stipend > 0;
    }
};

/// Calculate gas costs and forwarding for call operations
///
/// Implements the complete gas calculation for CALL/CALLCODE operations including:
/// - Base operation costs (warm/cold account access)
/// - Value transfer costs
/// - New account creation costs  
/// - 63/64 gas retention rule
/// - Gas stipend for value transfers
///
/// ## Parameters
/// - `available_gas`: Gas available to the calling frame
/// - `gas_parameter`: Gas parameter from CALL instruction (0 = all available)
/// - `transfers_value`: Whether this call transfers ETH value
/// - `is_cold_account`: Whether target account is cold (EIP-2929)
/// - `creates_new_account`: Whether call creates a new account
///
/// ## Returns
/// CallGasCalculation with base cost, forwarded gas, and stipend information
pub fn calculate_call_gas(
    available_gas: u64,
    gas_parameter: u64,
    transfers_value: bool,
    is_cold_account: bool,
    creates_new_account: bool
) CallGasCalculation {
    // Calculate base operation cost
    var base_cost: u64 = if (is_cold_account) 
        gas_constants.CALL_COLD_ACCOUNT_COST 
    else 
        gas_constants.CALL_BASE_COST;
    
    // Add value transfer cost
    if (transfers_value) {
        base_cost += gas_constants.CALL_VALUE_TRANSFER_COST;
        
        // Add new account creation cost
        if (creates_new_account) {
            base_cost += gas_constants.CALL_NEW_ACCOUNT_COST;
        }
    }
    
    // Check if we have enough gas for the call operation
    if (available_gas < base_cost) {
        return CallGasCalculation{
            .base_cost = base_cost,
            .gas_forwarded = 0,
            .gas_stipend = 0,
        };
    }
    
    // Calculate gas available for forwarding
    const gas_available_for_call = available_gas - base_cost;
    
    // Apply 63/64 rule: caller retains 1/64 of available gas
    const gas_retained = gas_available_for_call / gas_constants.CALL_GAS_RETENTION_DIVISOR;
    const max_forwardable = gas_available_for_call - gas_retained;
    
    // Determine gas to forward based on gas parameter
    var gas_to_forward: u64 = if (gas_parameter == 0) {
        // Forward all available gas (minus retention)
        max_forwardable
    } else {
        // Forward requested amount (capped by available)
        @min(gas_parameter, max_forwardable)
    };
    
    // Add stipend for value transfers
    const stipend_amount = if (transfers_value) gas_constants.GAS_STIPEND_VALUE_TRANSFER else 0;
    gas_to_forward += stipend_amount;
    
    return CallGasCalculation{
        .base_cost = base_cost,
        .gas_forwarded = gas_to_forward,
        .gas_stipend = stipend_amount,
    };
}

/// Gas tracking for call frames with stipend support
///
/// Manages gas consumption in call frames that may have both regular gas
/// and stipend gas. Ensures stipend limitations are enforced while allowing
/// efficient gas consumption tracking.
pub const StipendTracker = struct {
    /// Whether this frame has stipend gas available
    in_stipend_context: bool,
    /// Remaining stipend gas (max 2300)
    stipend_gas_remaining: u64,
    /// Remaining regular gas
    regular_gas_remaining: u64,
    
    /// Initialize stipend tracker for a new frame
    ///
    /// ## Parameters
    /// - `initial_gas`: Total gas provided to frame
    /// - `has_stipend`: Whether frame includes gas stipend
    ///
    /// ## Returns
    /// Initialized StipendTracker with appropriate gas allocation
    pub fn init(initial_gas: u64, has_stipend: bool) StipendTracker {
        const stipend_gas = if (has_stipend) gas_constants.GAS_STIPEND_VALUE_TRANSFER else 0;
        const regular_gas = if (initial_gas >= stipend_gas) initial_gas - stipend_gas else 0;
        
        return StipendTracker{
            .in_stipend_context = has_stipend,
            .stipend_gas_remaining = stipend_gas,
            .regular_gas_remaining = regular_gas,
        };
    }
    
    /// Consume gas from available pools
    ///
    /// Gas consumption priority:
    /// 1. Regular gas is consumed first
    /// 2. Stipend gas is used only when regular gas is exhausted
    ///
    /// ## Parameters
    /// - `amount`: Gas amount to consume
    ///
    /// ## Returns
    /// true if gas was successfully consumed, false if insufficient
    pub fn consume_gas(self: *StipendTracker, amount: u64) bool {
        // Try to consume from regular gas first
        if (amount <= self.regular_gas_remaining) {
            self.regular_gas_remaining -= amount;
            return true;
        }
        
        // If in stipend context, try to consume from stipend
        if (self.in_stipend_context) {
            const remaining_needed = amount - self.regular_gas_remaining;
            if (remaining_needed <= self.stipend_gas_remaining) {
                self.stipend_gas_remaining -= remaining_needed;
                self.regular_gas_remaining = 0;
                return true;
            }
        }
        
        return false; // Insufficient gas
    }
    
    /// Get total remaining gas across all pools
    pub fn total_remaining(self: *const StipendTracker) u64 {
        return self.regular_gas_remaining + self.stipend_gas_remaining;
    }
    
    /// Check if frame can make value-transferring calls
    ///
    /// Value calls require regular gas (not stipend gas) to prevent
    /// recursive value calls using only stipend gas.
    ///
    /// ## Parameters
    /// - `required_gas`: Gas required for the value call
    ///
    /// ## Returns
    /// true if frame has sufficient regular gas for value call
    pub fn can_make_value_call(self: *const StipendTracker, required_gas: u64) bool {
        return self.regular_gas_remaining >= required_gas;
    }
    
    /// Check if frame is operating only on stipend gas
    ///
    /// ## Returns
    /// true if frame has no regular gas and is using only stipend
    pub fn is_using_stipend_only(self: *const StipendTracker) bool {
        return self.in_stipend_context and 
               self.regular_gas_remaining == 0 and 
               self.stipend_gas_remaining > 0;
    }
    
    /// Get remaining regular gas (excluding stipend)
    ///
    /// Used for gas refunds - only regular gas is refunded to caller
    pub fn regular_gas(self: *const StipendTracker) u64 {
        return self.regular_gas_remaining;
    }
    
    /// Get remaining stipend gas
    pub fn stipend_gas(self: *const StipendTracker) u64 {
        return self.stipend_gas_remaining;
    }
};

// Tests
const testing = std.testing;

test "call gas calculation with value transfer" {
    // Test gas calculation for value-transferring call
    const gas_calc = calculate_call_gas(
        10000,  // available gas
        0,      // gas parameter (all available)
        true,   // transfers value
        false,  // warm account
        false   // doesn't create account
    );
    
    // Should include base cost + value transfer cost
    const expected_base = gas_constants.CALL_BASE_COST + gas_constants.CALL_VALUE_TRANSFER_COST;
    try testing.expectEqual(expected_base, gas_calc.base_cost);
    
    // Should include stipend
    try testing.expectEqual(gas_constants.GAS_STIPEND_VALUE_TRANSFER, gas_calc.gas_stipend);
    
    // Should forward available gas minus retention plus stipend
    const available_for_call = 10000 - expected_base;
    const retained = available_for_call / gas_constants.CALL_GAS_RETENTION_DIVISOR;
    const expected_forward = (available_for_call - retained) + gas_constants.GAS_STIPEND_VALUE_TRANSFER;
    try testing.expectEqual(expected_forward, gas_calc.gas_forwarded);
}

test "call gas calculation without value transfer" {
    // Test gas calculation for non-value call
    const gas_calc = calculate_call_gas(
        10000,  // available gas
        5000,   // gas parameter
        false,  // no value transfer
        false,  // warm account
        false   // doesn't create account
    );
    
    // Should not include value transfer cost
    try testing.expectEqual(gas_constants.CALL_BASE_COST, gas_calc.base_cost);
    
    // Should not include stipend
    try testing.expectEqual(@as(u64, 0), gas_calc.gas_stipend);
    
    // Should forward requested gas (capped by 63/64 rule)
    const available_for_call = 10000 - gas_constants.CALL_BASE_COST;
    const retained = available_for_call / gas_constants.CALL_GAS_RETENTION_DIVISOR;
    const max_forwardable = available_for_call - retained;
    const expected_forward = @min(5000, max_forwardable);
    try testing.expectEqual(expected_forward, gas_calc.gas_forwarded);
}

test "stipend tracker gas consumption" {
    var tracker = StipendTracker.init(5000, true); // 5000 gas + 2300 stipend
    
    // Should have regular gas and stipend
    try testing.expectEqual(@as(u64, 7300), tracker.total_remaining());
    
    // Consume from regular gas first
    try testing.expect(tracker.consume_gas(3000));
    try testing.expectEqual(@as(u64, 4300), tracker.total_remaining());
    
    // Consume remaining regular gas + some stipend
    try testing.expect(tracker.consume_gas(2500)); // 2000 regular + 500 stipend
    try testing.expectEqual(@as(u64, 1800), tracker.total_remaining()); // 1800 stipend left
    
    // Should not be able to make value calls with only stipend
    try testing.expect(!tracker.can_make_value_call(1000));
    
    // Should be in stipend-only context
    try testing.expect(tracker.is_using_stipend_only());
}

test "cold account gas calculation" {
    // Test cold account access cost
    const gas_calc = calculate_call_gas(
        30000,  // available gas
        0,      // gas parameter
        true,   // transfers value
        true,   // cold account
        true    // creates new account
    );
    
    // Should include cold access + value transfer + new account costs
    const expected_base = gas_constants.CALL_COLD_ACCOUNT_COST + 
                         gas_constants.CALL_VALUE_TRANSFER_COST + 
                         gas_constants.CALL_NEW_ACCOUNT_COST;
    try testing.expectEqual(expected_base, gas_calc.base_cost);
    
    // Should still include stipend
    try testing.expectEqual(gas_constants.GAS_STIPEND_VALUE_TRANSFER, gas_calc.gas_stipend);
}

test "insufficient gas for call" {
    // Test when available gas is less than base cost
    const gas_calc = calculate_call_gas(
        1000,   // available gas (insufficient)
        0,      // gas parameter
        true,   // transfers value
        false,  // warm account
        false   // doesn't create account
    );
    
    // Should set base cost but no gas forwarded
    const expected_base = gas_constants.CALL_BASE_COST + gas_constants.CALL_VALUE_TRANSFER_COST;
    try testing.expectEqual(expected_base, gas_calc.base_cost);
    try testing.expectEqual(@as(u64, 0), gas_calc.gas_forwarded);
    try testing.expectEqual(@as(u64, 0), gas_calc.gas_stipend);
}