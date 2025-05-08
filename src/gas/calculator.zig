const std = @import("std");
const constants = @import("constants.zig");
const dynamic = @import("dynamic.zig");
const U256 = @import("../util/types.zig").U256;

/// GasCalculator tracks and charges gas during EVM execution
/// Implements EIP-2200 net gas metering changes for SSTORE
/// Implements EIP-2929 gas cost increases for state access
/// Implements EIP-3529 reduction in refunds
pub const GasCalculator = struct {
    /// Remaining gas
    gas_left: u64,
    /// Gas refund (can be negative)
    gas_refund: i64 = 0,
    /// Maximum refund (1/5 of gas used according to EIP-3529)
    max_refund: u64 = 0,
    /// Gas costs configuration
    gas_costs: constants.GasCosts = constants.GasCosts{},

    /// Create a new gas calculator with the given amount of gas
    pub fn init(gas: u64) GasCalculator {
        return GasCalculator{
            .gas_left = gas,
        };
    }

    /// Get remaining gas
    pub fn getRemainingGas(self: *const GasCalculator) u64 {
        return self.gas_left;
    }

    /// Get the gas refund amount
    pub fn getGasRefund(self: *const GasCalculator) i64 {
        return self.gas_refund;
    }

    /// Use the given amount of gas, with out-of-gas check
    pub fn useGas(self: *GasCalculator, amount: u64) !void {
        if (self.gas_left < amount) {
            return error.OutOfGas;
        }
        self.gas_left -= amount;
    }

    /// Record used gas and update the max refund
    pub fn recordGasUsed(self: *GasCalculator, initial_gas: u64) void {
        const gas_used = initial_gas - self.gas_left;
        // EIP-3529: Reduction in refunds (max refund is 1/5 of gas used)
        self.max_refund = gas_used / 5;
    }

    /// Add gas refund, capped at the maximum refund amount
    pub fn addRefund(self: *GasCalculator, refund: i64) void {
        self.gas_refund += refund;
    }

    /// Calculate final gas including refund
    pub fn finalize(self: *GasCalculator) u64 {
        var final_refund: u64 = 0;
        if (self.gas_refund > 0) {
            // Cap refund at max_refund
            final_refund = @intCast(@min(self.gas_refund, @as(i64, @intCast(self.max_refund))));
        }
        return self.gas_left + final_refund;
    }

    /// Charge gas for basic operations using gas tiers
    pub fn chargeGasTier(self: *GasCalculator, tier: constants.GasTier) !void {
        const amount = switch (tier) {
            .zero => self.gas_costs.zero,
            .base => self.gas_costs.base,
            .very_low => self.gas_costs.very_low,
            .low => self.gas_costs.low,
            .mid => self.gas_costs.mid,
            .high => self.gas_costs.high,
        };
        try self.useGas(amount);
    }

    /// Charge gas for memory expansion
    pub fn chargeMemoryExpansion(self: *GasCalculator, size_in_bytes: usize) !void {
        const gas_cost = constants.memoryGas(size_in_bytes);
        try self.useGas(gas_cost);
    }

    /// Charge gas for SSTORE operation
    pub fn chargeSstore(
        self: *GasCalculator,
        is_cold: bool,
        original_value: U256,
        current_value: U256,
        new_value: U256,
    ) !void {
        const result = dynamic.calculateSstoreGas(is_cold, original_value, current_value, new_value);
        try self.useGas(result.cost);
        self.addRefund(result.refund);
    }

    /// Charge gas for exponentiation (EXP)
    pub fn chargeExp(self: *GasCalculator, exponent: U256) !void {
        const base_cost = self.gas_costs.exp;
        const byte_cost = self.gas_costs.exp_byte;
        const byte_size = dynamic.expByteSize(exponent);
        const gas_cost = base_cost + (byte_cost * byte_size);
        try self.useGas(gas_cost);
    }

    /// Charge gas for CALL operations
    pub fn chargeCall(
        self: *GasCalculator,
        is_cold: bool,
        transfer_value: bool,
        new_account: bool,
        stipend: u64,
    ) !u64 {
        var gas_cost = if (is_cold) self.gas_costs.cold_account_access else self.gas_costs.warm_account_access;
        
        // Extra gas for value transfer
        if (transfer_value) {
            gas_cost += self.gas_costs.call_value;
            // Extra gas for creating a new account
            if (new_account) {
                gas_cost += self.gas_costs.new_account;
            }
        }
        
        try self.useGas(gas_cost);
        
        // Return the call stipend if this is a value-transferring call
        return if (transfer_value) stipend else 0;
    }

    /// Charge gas for CREATE/CREATE2 operations
    pub fn chargeCreate(self: *GasCalculator, is_create2: bool) !void {
        var gas_cost = self.gas_costs.create;
        
        if (is_create2) {
            gas_cost += self.gas_costs.create2_additional;
        }
        
        try self.useGas(gas_cost);
    }

    /// Charge gas for LOG operations
    pub fn chargeLog(self: *GasCalculator, topics: usize, data_size: usize) !void {
        var gas_cost = self.gas_costs.log;
        
        // Add gas cost for topics
        gas_cost += self.gas_costs.log_topic * @intCast(u64, topics);
        
        // Add gas cost for data
        gas_cost += self.gas_costs.log_data * @intCast(u64, data_size);
        
        try self.useGas(gas_cost);
    }

    /// Charge gas for BALANCE, EXTCODESIZE, EXTCODEHASH operations
    pub fn chargeAccountAccess(self: *GasCalculator, is_cold: bool) !void {
        const gas_cost = if (is_cold) 
            self.gas_costs.cold_account_access 
        else 
            self.gas_costs.warm_account_access;
        
        try self.useGas(gas_cost);
    }

    /// Charge gas for EXTCODECOPY operation
    pub fn chargeExtCodeCopy(self: *GasCalculator, is_cold: bool, size: usize) !void {
        var gas_cost = if (is_cold) 
            self.gas_costs.cold_account_access 
        else 
            self.gas_costs.warm_account_access;
        
        // Add gas cost for copying
        gas_cost += self.gas_costs.copy_gas * ((size + 31) / 32);
        
        try self.useGas(gas_cost);
    }

    /// Charge gas for RETURN, REVERT, SELFDESTRUCT operations
    pub fn chargeReturn(self: *GasCalculator, size: usize) !void {
        // Determine memory expansion cost
        const mem_gas = constants.memoryGas(size);
        try self.useGas(mem_gas);
    }

    /// Charge gas for SELFDESTRUCT operation
    pub fn chargeSelfDestruct(
        self: *GasCalculator, 
        is_cold: bool, 
        creates_new_account: bool
    ) !void {
        var gas_cost = self.gas_costs.selfdestruct;
        
        // Add cold access cost
        if (is_cold) {
            gas_cost += self.gas_costs.cold_account_access;
        }
        
        // Add new account creation cost
        if (creates_new_account) {
            gas_cost += self.gas_costs.new_account;
        }
        
        try self.useGas(gas_cost);
    }
};

test "GasCalculator basics" {
    const testing = std.testing;
    var calc = GasCalculator.init(1000);
    
    try calc.useGas(100);
    try testing.expectEqual(@as(u64, 900), calc.getRemainingGas());
    
    calc.recordGasUsed(1000);
    try testing.expectEqual(@as(u64, 180), calc.max_refund); // 1/5 of 900 gas used
    
    calc.addRefund(50);
    try testing.expectEqual(@as(i64, 50), calc.getGasRefund());
    
    const final_gas = calc.finalize();
    try testing.expectEqual(@as(u64, 950), final_gas); // 900 + 50
}

test "GasCalculator refund capping" {
    const testing = std.testing;
    var calc = GasCalculator.init(1000);
    
    try calc.useGas(500);
    calc.recordGasUsed(1000);
    try testing.expectEqual(@as(u64, 100), calc.max_refund); // 1/5 of 500 gas used
    
    calc.addRefund(200); // More than max_refund
    try testing.expectEqual(@as(i64, 200), calc.getGasRefund());
    
    const final_gas = calc.finalize();
    try testing.expectEqual(@as(u64, 600), final_gas); // 500 + 100 (capped at max_refund)
}

test "GasCalculator memory expansion" {
    const testing = std.testing;
    var calc = GasCalculator.init(10000);
    
    // Memory cost for 32 bytes is minimal
    try calc.chargeMemoryExpansion(32);
    try testing.expect(calc.getRemainingGas() > 9900);
    
    // Memory cost grows quadratically
    try calc.useGas(calc.getRemainingGas() - 10000); // Reset gas
    calc.gas_left = 10000;
    
    // Memory cost for 1024 bytes should be higher
    try calc.chargeMemoryExpansion(1024);
    try testing.expect(calc.getRemainingGas() < 9900);
}

test "GasCalculator tier costs" {
    const testing = std.testing;
    var calc = GasCalculator.init(100);
    
    try calc.chargeGasTier(.zero);
    try testing.expectEqual(@as(u64, 100), calc.getRemainingGas());
    
    try calc.chargeGasTier(.base);
    try testing.expectEqual(@as(u64, 98), calc.getRemainingGas());
    
    try calc.chargeGasTier(.very_low);
    try testing.expectEqual(@as(u64, 95), calc.getRemainingGas());
}