const std = @import("std");
const EvmLogger = @import("EvmLogger.zig").EvmLogger;
const createLogger = @import("EvmLogger.zig").createLogger;
const createScopedLogger = @import("EvmLogger.zig").createScopedLogger;

// Module logger will be initialized when functions are called
fn getLogger() EvmLogger {
    return createLogger(@src().file);
}

/// FeeMarket implements the EIP-1559 fee market mechanism
///
/// The EIP-1559 fee market introduces a base fee per block that moves
/// up or down based on how full the previous block was compared to the target.
///
/// Key features:
/// 1. Base fee per block that is burned (not paid to miners)
/// 2. Priority fee (tip) that goes to miners
/// 3. Base fee adjustment based on block fullness
pub const FeeMarket = struct {
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
    pub fn initialBaseFee(parent_gas_used: u64, parent_gas_limit: u64) u64 {
        const logger = getLogger();
        const scoped = createScopedLogger(logger, "initialBaseFee()");
        defer scoped.deinit();
        
        logger.debug("Initializing base fee for first EIP-1559 block", .{});
        logger.debug("Parent block gas used: {d}, gas limit: {d}", .{parent_gas_used, parent_gas_limit});
        
        // Initial base fee formula from the EIP-1559 specification
        // If the parent block used exactly the target gas, the initial base fee is 1 gwei
        // If it used more, the initial base fee is higher
        // If it used less, the initial base fee is lower
        
        // Target gas usage is half the block gas limit
        const parent_gas_target = parent_gas_limit / 2;
        
        // Initial base fee calculation
        var initial_base_fee: u64 = 1_000_000_000; // 1 gwei in wei
        
        // Adjust initial base fee based on parent block's gas usage
        if (parent_gas_used > 0) {
            const gas_used_delta = if (parent_gas_used > parent_gas_target)
                parent_gas_used - parent_gas_target
            else
                parent_gas_target - parent_gas_used;
                
            const base_fee_delta = std.math.max(
                1,
                initial_base_fee * gas_used_delta / parent_gas_target / BASE_FEE_CHANGE_DENOMINATOR
            );
            
            if (parent_gas_used > parent_gas_target) {
                initial_base_fee = initial_base_fee + base_fee_delta;
            } else if (initial_base_fee > base_fee_delta) {
                initial_base_fee = initial_base_fee - base_fee_delta;
            }
        }
        
        // Ensure base fee is at least the minimum
        initial_base_fee = std.math.max(initial_base_fee, MIN_BASE_FEE);
        
        const logger = getLogger();
        logger.info("Initial base fee calculated: {d} wei", .{initial_base_fee});
        return initial_base_fee;
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
    pub fn nextBaseFee(parent_base_fee: u64, parent_gas_used: u64, parent_gas_target: u64) u64 {
        const logger = getLogger();
        const scoped = createScopedLogger(logger, "nextBaseFee()");
        defer scoped.deinit();
        
        logger.debug("Calculating next block's base fee", .{});
        logger.debug("Parent block base fee: {d} wei", .{parent_base_fee});
        logger.debug("Parent block gas used: {d}, gas target: {d}", .{parent_gas_used, parent_gas_target});
        
        // If parent block is empty, keep the base fee the same
        if (parent_gas_used == 0) {
            const logger = getLogger();
            logger.info("Parent block was empty, keeping base fee the same: {d} wei", .{parent_base_fee});
            return parent_base_fee;
        }
        
        // Calculate base fee delta
        var next_base_fee = parent_base_fee;
        
        if (parent_gas_used == parent_gas_target) {
            // If parent block used exactly the target gas, keep the base fee the same
            const logger = getLogger();
            logger.debug("Parent block used exactly the target gas, keeping base fee the same", .{});
        } else if (parent_gas_used > parent_gas_target) {
            // If parent block used more than the target gas, increase the base fee
            
            // Calculate gas used delta as a fraction of target
            const gas_used_delta = parent_gas_used - parent_gas_target;
            
            // Calculate the base fee delta (max 12.5% increase)
            const base_fee_delta = std.math.max(
                1,
                parent_base_fee * gas_used_delta / parent_gas_target / BASE_FEE_CHANGE_DENOMINATOR
            );
            
            // Increase the base fee
            // The overflow check is probably unnecessary given gas limits, but it's a good safety measure
            next_base_fee = if (std.math.add(u64, parent_base_fee, base_fee_delta)) |fee| fee else parent_base_fee;
            
            const logger = getLogger();
            logger.debug("Parent block used more than target gas, increasing base fee by {d} wei", .{base_fee_delta});
        } else {
            // If parent block used less than the target gas, decrease the base fee
            
            // Calculate gas used delta as a fraction of target
            const gas_used_delta = parent_gas_target - parent_gas_used;
            
            // Calculate the base fee delta (max 12.5% decrease)
            const base_fee_delta = std.math.max(
                1,
                parent_base_fee * gas_used_delta / parent_gas_target / BASE_FEE_CHANGE_DENOMINATOR
            );
            
            // Decrease the base fee, but don't go below the minimum
            next_base_fee = if (parent_base_fee > base_fee_delta)
                parent_base_fee - base_fee_delta
            else
                MIN_BASE_FEE;
                
            const logger = getLogger();
            logger.debug("Parent block used less than target gas, decreasing base fee by {d} wei", .{base_fee_delta});
        }
        
        // Ensure base fee is at least the minimum
        next_base_fee = std.math.max(next_base_fee, MIN_BASE_FEE);
        
        const logger = getLogger();
        logger.info("Next block base fee calculated: {d} wei", .{next_base_fee});
        return next_base_fee;
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
    pub fn getEffectiveGasPrice(
        base_fee_per_gas: u64,
        max_fee_per_gas: u64,
        max_priority_fee_per_gas: u64
    ) struct { effective_gas_price: u64, miner_fee: u64 } {
        const logger = getLogger();
        const scoped = createScopedLogger(logger, "getEffectiveGasPrice()");
        defer scoped.deinit();
        
        logger.debug("Calculating effective gas price", .{});
        logger.debug("Base fee: {d}, max fee: {d}, max priority fee: {d}", .{
            base_fee_per_gas, max_fee_per_gas, max_priority_fee_per_gas
        });
        
        // Ensure the transaction at least pays the base fee
        if (max_fee_per_gas < base_fee_per_gas) {
            logger.warn("Transaction's max fee ({d}) is less than base fee ({d})", .{
                max_fee_per_gas, base_fee_per_gas
            });
            // In a real implementation, this transaction would be rejected
            // For now, just return the max fee and zero miner fee
            return .{
                .effective_gas_price = max_fee_per_gas,
                .miner_fee = 0
            };
        }
        
        // Calculate the priority fee (tip to miner)
        // This is limited by both max_priority_fee_per_gas and the leftover after base fee
        const max_priority_fee = std.math.min(
            max_priority_fee_per_gas,
            max_fee_per_gas - base_fee_per_gas
        );
        
        // The effective gas price is base fee plus priority fee
        const effective_gas_price = base_fee_per_gas + max_priority_fee;
        
        logger.debug("Effective gas price: {d} wei", .{effective_gas_price});
        logger.debug("Miner fee (priority fee): {d} wei", .{max_priority_fee});
        
        return .{
            .effective_gas_price = effective_gas_price,
            .miner_fee = max_priority_fee
        };
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
    pub fn getGasTarget(gas_limit: u64) u64 {
        return gas_limit / 2;
    }
};

// Tests for the FeeMarket implementation

test "FeeMarket - initialBaseFee calculation" {
    const testing = std.testing;
    
    // Test with empty parent block
    {
        const parent_gas_used = 0;
        const parent_gas_limit = 30_000_000;
        const initial_fee = FeeMarket.initialBaseFee(parent_gas_used, parent_gas_limit);
        
        // Initial fee should be at least the minimum
        try testing.expect(initial_fee >= FeeMarket.MIN_BASE_FEE);
    }
    
    // Test with parent block at exactly 50% usage
    {
        const parent_gas_limit = 30_000_000;
        const parent_gas_used = parent_gas_limit / 2;
        const initial_fee = FeeMarket.initialBaseFee(parent_gas_used, parent_gas_limit);
        
        // Should be close to 1 gwei
        try testing.expect(initial_fee >= 1_000_000_000);
        try testing.expect(initial_fee <= 1_100_000_000);
    }
    
    // Test with parent block above target (75% full)
    {
        const parent_gas_limit = 30_000_000;
        const parent_gas_used = parent_gas_limit * 3 / 4;
        const initial_fee = FeeMarket.initialBaseFee(parent_gas_used, parent_gas_limit);
        
        // Should be higher than 1 gwei
        try testing.expect(initial_fee > 1_000_000_000);
    }
    
    // Test with parent block below target (25% full)
    {
        const parent_gas_limit = 30_000_000;
        const parent_gas_used = parent_gas_limit / 4;
        const initial_fee = FeeMarket.initialBaseFee(parent_gas_used, parent_gas_limit);
        
        // Should be lower than 1 gwei but above minimum
        try testing.expect(initial_fee < 1_000_000_000);
        try testing.expect(initial_fee >= FeeMarket.MIN_BASE_FEE);
    }
}

test "FeeMarket - nextBaseFee calculation" {
    const testing = std.testing;
    
    // Test with empty parent block
    {
        const parent_base_fee = 1_000_000_000; // 1 gwei
        const parent_gas_used = 0;
        const parent_gas_target = 15_000_000;
        
        const next_fee = FeeMarket.nextBaseFee(parent_base_fee, parent_gas_used, parent_gas_target);
        
        // If parent block is empty, base fee stays the same
        try testing.expectEqual(parent_base_fee, next_fee);
    }
    
    // Test with parent block at exactly target
    {
        const parent_base_fee = 1_000_000_000; // 1 gwei
        const parent_gas_target = 15_000_000;
        const parent_gas_used = parent_gas_target;
        
        const next_fee = FeeMarket.nextBaseFee(parent_base_fee, parent_gas_used, parent_gas_target);
        
        // If parent block used exactly target, base fee stays the same
        try testing.expectEqual(parent_base_fee, next_fee);
    }
    
    // Test with parent block 50% above target
    {
        const parent_base_fee = 1_000_000_000; // 1 gwei
        const parent_gas_target = 15_000_000;
        const parent_gas_used = parent_gas_target * 3 / 2; // 50% above target
        
        const next_fee = FeeMarket.nextBaseFee(parent_base_fee, parent_gas_used, parent_gas_target);
        
        // Base fee should increase by approximately 1/16 (6.25%)
        // since delta is 50% and denominator is 8 (50% / 8 = 6.25%)
        const expected_increase = parent_base_fee / 16;
        const expected_fee = parent_base_fee + expected_increase;
        
        // Allow a small margin of error due to integer division
        const lower_bound = expected_fee - 10;
        const upper_bound = expected_fee + 10;
        
        try testing.expect(next_fee >= lower_bound);
        try testing.expect(next_fee <= upper_bound);
    }
    
    // Test with parent block 50% below target
    {
        const parent_base_fee = 1_000_000_000; // 1 gwei
        const parent_gas_target = 15_000_000;
        const parent_gas_used = parent_gas_target / 2; // 50% below target
        
        const next_fee = FeeMarket.nextBaseFee(parent_base_fee, parent_gas_used, parent_gas_target);
        
        // Base fee should decrease by approximately 1/16 (6.25%)
        // since delta is 50% and denominator is 8 (50% / 8 = 6.25%)
        const expected_decrease = parent_base_fee / 16;
        const expected_fee = parent_base_fee - expected_decrease;
        
        // Allow a small margin of error due to integer division
        const lower_bound = expected_fee - 10;
        const upper_bound = expected_fee + 10;
        
        try testing.expect(next_fee >= lower_bound);
        try testing.expect(next_fee <= upper_bound);
    }
    
    // Test with parent block at maximum (100% above target)
    {
        const parent_base_fee = 1_000_000_000; // 1 gwei
        const parent_gas_target = 15_000_000;
        const parent_gas_used = parent_gas_target * 2; // 100% above target
        
        const next_fee = FeeMarket.nextBaseFee(parent_base_fee, parent_gas_used, parent_gas_target);
        
        // Base fee should increase by approximately 1/8 (12.5%)
        // since delta is 100% and denominator is 8 (100% / 8 = 12.5%)
        const expected_increase = parent_base_fee / 8;
        const expected_fee = parent_base_fee + expected_increase;
        
        // Allow a small margin of error due to integer division
        const lower_bound = expected_fee - 10;
        const upper_bound = expected_fee + 10;
        
        try testing.expect(next_fee >= lower_bound);
        try testing.expect(next_fee <= upper_bound);
    }
    
    // Test with very low base fee
    {
        const parent_base_fee = FeeMarket.MIN_BASE_FEE;
        const parent_gas_target = 15_000_000;
        const parent_gas_used = parent_gas_target / 2; // 50% below target
        
        const next_fee = FeeMarket.nextBaseFee(parent_base_fee, parent_gas_used, parent_gas_target);
        
        // Base fee should never go below minimum
        try testing.expectEqual(FeeMarket.MIN_BASE_FEE, next_fee);
    }
}

test "FeeMarket - getEffectiveGasPrice calculation" {
    const testing = std.testing;
    
    // Test with max fee higher than base fee + priority fee
    {
        const base_fee = 1_000_000_000; // 1 gwei
        const max_fee = 3_000_000_000; // 3 gwei
        const max_priority_fee = 1_000_000_000; // 1 gwei
        
        const result = FeeMarket.getEffectiveGasPrice(base_fee, max_fee, max_priority_fee);
        
        // Effective gas price should be base fee + priority fee
        try testing.expectEqual(@as(u64, 2_000_000_000), result.effective_gas_price);
        
        // Miner fee should be the full priority fee
        try testing.expectEqual(max_priority_fee, result.miner_fee);
    }
    
    // Test with max fee lower than base fee + priority fee but higher than base fee
    {
        const base_fee = 1_000_000_000; // 1 gwei
        const max_fee = 1_500_000_000; // 1.5 gwei
        const max_priority_fee = 1_000_000_000; // 1 gwei
        
        const result = FeeMarket.getEffectiveGasPrice(base_fee, max_fee, max_priority_fee);
        
        // Effective gas price should be limited by max fee
        try testing.expectEqual(max_fee, result.effective_gas_price);
        
        // Miner fee should be what's left after base fee
        try testing.expectEqual(@as(u64, 500_000_000), result.miner_fee);
    }
    
    // Test with max fee lower than base fee (would be rejected in practice)
    {
        const base_fee = 1_000_000_000; // 1 gwei
        const max_fee = 900_000_000; // 0.9 gwei
        const max_priority_fee = 500_000_000; // 0.5 gwei
        
        const result = FeeMarket.getEffectiveGasPrice(base_fee, max_fee, max_priority_fee);
        
        // In practice, this transaction would be rejected
        // For testing, we return max fee as effective gas price and zero miner fee
        try testing.expectEqual(max_fee, result.effective_gas_price);
        try testing.expectEqual(@as(u64, 0), result.miner_fee);
    }
    
    // Test with zero priority fee
    {
        const base_fee = 1_000_000_000; // 1 gwei
        const max_fee = 1_500_000_000; // 1.5 gwei
        const max_priority_fee = 0; // 0 gwei
        
        const result = FeeMarket.getEffectiveGasPrice(base_fee, max_fee, max_priority_fee);
        
        // Effective gas price should be just the base fee
        try testing.expectEqual(base_fee, result.effective_gas_price);
        
        // Miner fee should be zero
        try testing.expectEqual(@as(u64, 0), result.miner_fee);
    }
}

test "FeeMarket - getGasTarget calculation" {
    const testing = std.testing;
    
    // Standard case
    {
        const gas_limit = 30_000_000;
        const gas_target = FeeMarket.getGasTarget(gas_limit);
        
        // Gas target should be half the gas limit
        try testing.expectEqual(@as(u64, 15_000_000), gas_target);
    }
    
    // Edge case - very low gas limit
    {
        const gas_limit = 10;
        const gas_target = FeeMarket.getGasTarget(gas_limit);
        
        // Gas target should be half the gas limit
        try testing.expectEqual(@as(u64, 5), gas_target);
    }
}