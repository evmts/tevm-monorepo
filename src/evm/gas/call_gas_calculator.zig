const std = @import("std");
const gas_constants = @import("../constants/gas_constants.zig");

/// Result structure for call gas calculations
///
/// This structure encapsulates all gas-related information for CALL operations,
/// including the base cost, amount to forward, and any stipend provided.
pub const CallGasCalculation = struct {
    /// Base gas cost for the call operation itself
    /// Includes costs for cold/warm access, value transfer, and new account creation
    base_cost: u64,
    
    /// Total gas forwarded to the called contract
    /// Includes regular gas plus any stipend
    gas_forwarded: u64,
    
    /// Gas stipend amount (if any)
    /// 2300 gas for value transfers, 0 otherwise
    gas_stipend: u64,
    
    /// Returns the total cost charged to the caller
    /// This is the gas consumed from the calling frame
    pub fn total_caller_cost(self: *const CallGasCalculation) u64 {
        return self.base_cost;
    }
    
    /// Returns the total gas available to the recipient
    /// This includes both regular gas and any stipend
    pub fn total_recipient_gas(self: *const CallGasCalculation) u64 {
        return self.gas_forwarded;
    }
    
    /// Returns true if this call includes a gas stipend
    /// Only value transfers receive stipends
    pub fn has_stipend(self: *const CallGasCalculation) bool {
        return self.gas_stipend > 0;
    }
    
    /// Returns the regular (non-stipend) gas forwarded
    /// Used for gas refund calculations
    pub fn regular_gas_forwarded(self: *const CallGasCalculation) u64 {
        return self.gas_forwarded - self.gas_stipend;
    }
};

/// Calculates gas costs and forwarding for CALL operations
///
/// Implements the complete gas calculation logic for CALL operations including:
/// - Base costs (warm/cold account access)
/// - Value transfer costs
/// - New account creation costs
/// - 63/64 gas retention rule
/// - 2300 gas stipend for value transfers
///
/// ## Parameters
/// - `available_gas`: Total gas available to the calling frame
/// - `gas_parameter`: Gas limit specified in the CALL instruction (0 = all available)
/// - `transfers_value`: Whether this call transfers ETH (value > 0)
/// - `is_cold_account`: Whether the target account is cold (EIP-2929)
/// - `creates_new_account`: Whether this call creates a new account
///
/// ## Returns
/// CallGasCalculation structure with all computed values
///
/// ## Examples
/// ```zig
/// // Regular call to warm account
/// const calc1 = calculate_call_gas(10000, 5000, false, false, false);
/// // calc1.base_cost = 100, calc1.gas_forwarded = 5000, calc1.gas_stipend = 0
///
/// // Value transfer to cold account
/// const calc2 = calculate_call_gas(20000, 0, true, true, true);
/// // calc2.base_cost = 36600, calc2.gas_stipend = 2300
/// ```
pub fn calculate_call_gas(
    available_gas: u64,
    gas_parameter: u64,
    transfers_value: bool,
    is_cold_account: bool,
    creates_new_account: bool
) CallGasCalculation {
    // Calculate base cost for the call operation
    var base_cost: u64 = if (is_cold_account) 
        gas_constants.CALL_COLD_ACCOUNT_COST 
    else 
        gas_constants.CALL_BASE_COST;
    
    // Add value transfer cost if applicable
    if (transfers_value) {
        base_cost += gas_constants.CALL_VALUE_TRANSFER_COST;
        
        // Add new account creation cost if needed
        if (creates_new_account) {
            base_cost += gas_constants.CALL_NEW_ACCOUNT_COST;
        }
    }
    
    // Check if we have enough gas for the call
    if (available_gas < base_cost) {
        return CallGasCalculation{
            .base_cost = base_cost,
            .gas_forwarded = 0,
            .gas_stipend = 0,
        };
    }
    
    // Calculate gas available for forwarding after base costs
    const gas_available_for_call = available_gas - base_cost;
    
    // Apply 63/64 rule: caller retains 1/64 of available gas
    const gas_retained = gas_available_for_call / gas_constants.CALL_GAS_RETENTION_DIVISOR;
    const max_forwardable = gas_available_for_call - gas_retained;
    
    // Determine gas to forward based on gas parameter
    var gas_to_forward: u64 = if (gas_parameter == 0) 
        // Forward all available gas (minus retention)
        max_forwardable
    else 
        // Forward requested amount (capped by available)
        @min(gas_parameter, max_forwardable);
    
    // Add stipend for value transfers
    const stipend_amount = if (transfers_value) gas_constants.GAS_STIPEND_VALUE_TRANSFER else 0;
    gas_to_forward += stipend_amount;
    
    return CallGasCalculation{
        .base_cost = base_cost,
        .gas_forwarded = gas_to_forward,
        .gas_stipend = stipend_amount,
    };
}

/// Gas tracking system that separates regular gas from stipend gas
///
/// This tracker manages the two types of gas available during contract execution:
/// 1. Regular gas - Can be used for any operation including value calls
/// 2. Stipend gas - Limited to basic operations, cannot be used for value calls
///
/// The stipend system prevents attacks where contracts receive value calls with
/// minimal gas but use the stipend to make additional value calls.
pub const StipendTracker = struct {
    /// Whether this execution context has a gas stipend
    in_stipend_context: bool,
    
    /// Amount of stipend gas remaining
    /// Only available when in_stipend_context is true
    stipend_gas_remaining: u64,
    
    /// Amount of regular gas remaining
    /// Can be used for any operation
    regular_gas_remaining: u64,
    
    /// Initialize a new stipend tracker
    ///
    /// ## Parameters
    /// - `initial_gas`: Total gas provided to the execution context
    /// - `has_stipend`: Whether this context includes a gas stipend
    ///
    /// If has_stipend is true, the tracker separates the stipend amount from
    /// the initial gas, making them available for different types of operations.
    pub fn init(initial_gas: u64, has_stipend: bool) StipendTracker {
        const stipend_amount = if (has_stipend) gas_constants.GAS_STIPEND_VALUE_TRANSFER else 0;
        
        return StipendTracker{
            .in_stipend_context = has_stipend,
            .stipend_gas_remaining = stipend_amount,
            .regular_gas_remaining = if (initial_gas >= stipend_amount) 
                initial_gas - stipend_amount 
            else 
                0,
        };
    }
    
    /// Consume gas from the available pools
    ///
    /// Gas consumption follows a specific priority:
    /// 1. Try to consume from regular gas first
    /// 2. If insufficient regular gas and in stipend context, use stipend gas
    /// 3. Fail if total available gas is insufficient
    ///
    /// ## Parameters
    /// - `amount`: Amount of gas to consume
    ///
    /// ## Returns
    /// true if gas was successfully consumed, false if insufficient gas
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
    
    /// Returns the total gas remaining (regular + stipend)
    pub fn total_remaining(self: *const StipendTracker) u64 {
        return self.regular_gas_remaining + self.stipend_gas_remaining;
    }
    
    /// Checks if the tracker can afford a value transfer call
    ///
    /// Value calls require regular gas (not stipend gas) to prevent
    /// stipend-based attack vectors.
    ///
    /// ## Parameters
    /// - `required_gas`: Minimum gas needed for the value call
    ///
    /// ## Returns
    /// true if sufficient regular gas is available
    pub fn can_make_value_call(self: *const StipendTracker, required_gas: u64) bool {
        return self.regular_gas_remaining >= required_gas;
    }
    
    /// Returns true if only stipend gas remains
    ///
    /// This indicates that the execution context is operating on the
    /// 2300 gas stipend and cannot make value calls.
    pub fn is_using_stipend_only(self: *const StipendTracker) bool {
        return self.in_stipend_context and 
               self.regular_gas_remaining == 0 and 
               self.stipend_gas_remaining > 0;
    }
    
    /// Returns the amount of regular gas that would be refunded
    ///
    /// When a call completes, unused regular gas is refunded to the caller.
    /// Stipend gas is not refunded as it was "free" additional gas.
    pub fn get_refundable_gas(self: *const StipendTracker) u64 {
        return self.regular_gas_remaining;
    }
    
    /// Forcibly set the regular gas amount
    ///
    /// Used for gas refunds when returning from calls.
    /// Only affects regular gas, stipend gas is managed separately.
    pub fn set_regular_gas(self: *StipendTracker, amount: u64) void {
        self.regular_gas_remaining = amount;
    }
    
    /// Add refunded gas back to the regular pool
    ///
    /// Used when receiving gas refunds from completed calls.
    pub fn add_refunded_gas(self: *StipendTracker, amount: u64) void {
        self.regular_gas_remaining += amount;
    }
};

/// Fast path gas calculation for common cases
///
/// Pre-computed base costs for the most common call scenarios to avoid
/// repeated conditional logic in hot paths.
const CALL_BASE_COSTS = [4]u64{
    gas_constants.CALL_BASE_COST,                                           // Warm, no value
    gas_constants.CALL_BASE_COST + gas_constants.CALL_VALUE_TRANSFER_COST,  // Warm, with value
    gas_constants.CALL_COLD_ACCOUNT_COST,                                   // Cold, no value  
    gas_constants.CALL_COLD_ACCOUNT_COST + gas_constants.CALL_VALUE_TRANSFER_COST, // Cold, with value
};

/// Get base cost using lookup table for performance
///
/// ## Parameters
/// - `transfers_value`: Whether the call transfers value
/// - `is_cold`: Whether the account is cold
///
/// ## Returns
/// Base cost without new account creation cost
pub fn get_base_cost_fast(transfers_value: bool, is_cold: bool) u64 {
    const index = (@as(u8, if (is_cold) 2 else 0)) | (@as(u8, if (transfers_value) 1 else 0));
    return CALL_BASE_COSTS[index];
}

/// Validates that a call gas calculation is valid
///
/// Performs sanity checks on a CallGasCalculation to ensure all values
/// are consistent and within expected ranges.
pub fn validate_calculation(calc: *const CallGasCalculation) bool {
    // Stipend should only be present if gas_stipend > 0
    if (calc.has_stipend() and calc.gas_stipend == 0) return false;
    if (!calc.has_stipend() and calc.gas_stipend > 0) return false;
    
    // Gas forwarded should always be >= stipend
    if (calc.gas_forwarded < calc.gas_stipend) return false;
    
    // Stipend should be exactly the expected amount or zero
    if (calc.gas_stipend != 0 and calc.gas_stipend != gas_constants.GAS_STIPEND_VALUE_TRANSFER) {
        return false;
    }
    
    return true;
}