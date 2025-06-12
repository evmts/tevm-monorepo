const std = @import("std");
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;

/// Gas refund tracking for transaction-level SSTORE operations.
///
/// The RefundTracker manages gas refunds earned during a transaction execution,
/// primarily from SSTORE operations that clear storage slots (set to zero).
/// It enforces the refund cap mechanism introduced in various EIPs.
///
/// ## Refund Cap Evolution
/// - **Pre-London**: Refunds capped at 50% of gas used
/// - **London (EIP-3529)**: Refunds capped at 20% of gas used
///
/// ## Usage
/// ```zig
/// var tracker = RefundTracker.init(.LONDON);
/// tracker.add_refund(15000); // SSTORE clear refund
/// tracker.gas_used = 100000;
/// const final_refund = tracker.calculate_final_refund(); // Returns 20000 (20% cap)
/// ```
pub const RefundTracker = struct {
    /// Total gas refunds earned in this transaction
    total_refunds: u64 = 0,
    
    /// Total gas used in the transaction (for refund cap calculation)
    gas_used: u64 = 0,
    
    /// Hardfork rules for refund cap percentage
    hardfork: Hardfork,
    
    /// Initialize refund tracker for a specific hardfork.
    ///
    /// @param hardfork Ethereum hardfork determining refund cap rules
    /// @return Initialized RefundTracker with zero refunds
    pub fn init(hardfork: Hardfork) RefundTracker {
        return RefundTracker{
            .hardfork = hardfork,
        };
    }
    
    /// Add a gas refund to the transaction total.
    ///
    /// This method accumulates refunds from various sources (primarily SSTORE
    /// operations that clear storage). The actual refund amount will be capped
    /// at transaction finalization based on hardfork rules.
    ///
    /// @param self Mutable reference to the refund tracker
    /// @param amount Gas refund amount to add
    ///
    /// Example:
    /// ```zig
    /// tracker.add_refund(15000); // SSTORE clear refund
    /// tracker.add_refund(4900);  // SSTORE reset refund
    /// ```
    pub fn add_refund(self: *RefundTracker, amount: u64) void {
        self.total_refunds +%= amount; // Use wrapping add to prevent overflow
    }
    
    /// Subtract a gas refund from the transaction total.
    ///
    /// This is used in complex SSTORE scenarios where a previous refund
    /// needs to be reversed (e.g., un-clearing a storage slot).
    ///
    /// @param self Mutable reference to the refund tracker
    /// @param amount Gas refund amount to subtract
    ///
    /// Example:
    /// ```zig
    /// tracker.sub_refund(15000); // Reverse a previous clear refund
    /// ```
    pub fn sub_refund(self: *RefundTracker, amount: u64) void {
        if (amount > self.total_refunds) {
            self.total_refunds = 0;
        } else {
            self.total_refunds -= amount;
        }
    }
    
    /// Calculate the final gas refund applying hardfork-specific caps.
    ///
    /// The refund is limited to a percentage of the total gas used in the
    /// transaction to prevent refund abuse attacks. The percentage depends
    /// on the hardfork:
    /// - London and later: 20% of gas used (EIP-3529)
    /// - Earlier hardforks: 50% of gas used
    ///
    /// @param self Immutable reference to the refund tracker
    /// @return Final refund amount after applying caps
    ///
    /// Example:
    /// ```zig
    /// tracker.gas_used = 100000;
    /// tracker.total_refunds = 30000;
    /// const refund = tracker.calculate_final_refund(); // Returns 20000 for London+
    /// ```
    pub fn calculate_final_refund(self: RefundTracker) u64 {
        @branchHint(.likely);
        
        const max_refund = switch (self.hardfork) {
            // EIP-3529: Reduce refund cap from 50% to 20%
            .LONDON, .ARROW_GLACIER, .GRAY_GLACIER, .MERGE, .SHANGHAI, .CANCUN => self.gas_used / 5, // 20%
            // Pre-London: 50% refund cap
            else => self.gas_used / 2, // 50%
        };
        
        return @min(self.total_refunds, max_refund);
    }
    
    /// Reset the refund tracker for a new transaction.
    ///
    /// Clears all accumulated refunds and gas usage while preserving
    /// the hardfork configuration. This should be called at the start
    /// of each new transaction.
    ///
    /// @param self Mutable reference to the refund tracker
    pub fn reset(self: *RefundTracker) void {
        self.total_refunds = 0;
        self.gas_used = 0;
    }
    
    /// Update the total gas used in the transaction.
    ///
    /// This is typically called at transaction completion to set the
    /// gas usage baseline for refund cap calculations.
    ///
    /// @param self Mutable reference to the refund tracker
    /// @param gas_used Total gas consumed in the transaction
    pub fn set_gas_used(self: *RefundTracker, gas_used: u64) void {
        self.gas_used = gas_used;
    }
    
    /// Get the current total refunds before cap application.
    ///
    /// @param self Immutable reference to the refund tracker
    /// @return Total refunds accumulated so far
    pub fn get_total_refunds(self: RefundTracker) u64 {
        return self.total_refunds;
    }
    
    /// Check if any refunds have been accumulated.
    ///
    /// @param self Immutable reference to the refund tracker
    /// @return True if any refunds have been earned
    pub fn has_refunds(self: RefundTracker) bool {
        return self.total_refunds > 0;
    }
};