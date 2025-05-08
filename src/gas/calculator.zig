//! Gas calculation module for ZigEVM
//! This module provides a comprehensive gas calculator for EVM operations

const std = @import("std");
const constants = @import("constants.zig");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Memory = @import("../memory/memory.zig").Memory;
const Opcode = @import("../opcodes/opcodes.zig").Opcode;
const OpcodeInfo = @import("../opcodes/opcodes.zig").OpcodeInfo;

/// Gas calculator for EVM operations
pub const GasCalculator = struct {
    /// Current gas remaining in execution
    gas_left: u64,
    
    /// Gas refund accumulated during execution
    gas_refund: u64,
    
    /// Maximum gas refund (half of gas used)
    max_refund: u64,
    
    /// Gas costs configuration
    gas_costs: constants.GasCosts,
    
    /// Get the current gas remaining
    pub fn getGasLeft(self: *const GasCalculator) u64 {
        return self.gas_left;
    }
    
    /// Get the current gas refund amount
    pub fn getGasRefund(self: *const GasCalculator) u64 {
        return if (self.gas_refund > self.max_refund) self.max_refund else self.gas_refund;
    }
    
    /// Create a new gas calculator
    pub fn init(gas_limit: u64) GasCalculator {
        return GasCalculator{
            .gas_left = gas_limit,
            .gas_refund = 0,
            .max_refund = 0,
            .gas_costs = constants.GasCosts{},
        };
    }
    
    /// Charge gas for an operation
    pub fn charge(self: *GasCalculator, amount: u64) !void {
        if (self.gas_left < amount) {
            return Error.OutOfGas;
        }
        self.gas_left -= amount;
        self.max_refund = (gas_limit - self.gas_left) / 2;
    }
    
    /// Add to the gas refund
    pub fn refund(self: *GasCalculator, amount: u64) void {
        self.gas_refund += amount;
        self.max_refund = (gas_limit - self.gas_left) / 2;
    }
    
    /// Subtract from the gas refund
    pub fn unrefund(self: *GasCalculator, amount: u64) void {
        self.gas_refund = if (self.gas_refund > amount) self.gas_refund - amount else 0;
    }
    
    /// Calculate and charge gas for a basic opcode
    pub fn chargeOpcode(self: *GasCalculator, opcode: Opcode) !void {
        // Get opcode info
        const info = OpcodeInfo.getInfo(@intFromEnum(opcode));
        
        // Charge gas based on opcode's static cost
        return self.charge(info.gas_cost);
    }
    
    /// Calculate and charge gas for memory expansion
    pub fn chargeMemory(self: *GasCalculator, old_size: usize, new_size: usize) !void {
        // If new size is smaller, no gas needed
        if (new_size <= old_size) {
            return;
        }
        
        // Calculate gas for old and new sizes
        const old_gas = constants.memoryGas(old_size);
        const new_gas = constants.memoryGas(new_size);
        
        // Charge the difference
        return self.charge(new_gas - old_gas);
    }
    
    /// Calculate and charge gas for SSTORE operation
    pub fn chargeSstore(
        self: *GasCalculator,
        is_cold: bool, 
        current_value: bool, 
        original_value: bool, 
        new_value: bool,
    ) !void {
        // Get gas cost and refund
        const result = constants.storageGas(is_cold, current_value, original_value, new_value);
        
        // Charge the gas cost
        try self.charge(result.cost);
        
        // Apply refund (can be negative)
        if (result.refund > 0) {
            self.refund(@intCast(result.refund));
        } else if (result.refund < 0) {
            self.unrefund(@intCast(-result.refund));
        }
    }
    
    /// Calculate and charge gas for LOG operations
    pub fn chargeLog(self: *GasCalculator, topics: u8, data_size: usize) !void {
        const gas_cost = constants.logGas(topics, data_size);
        return self.charge(gas_cost);
    }
    
    /// Calculate and charge gas for memory copy operations
    pub fn chargeMemoryCopy(self: *GasCalculator, size: usize, memory: *Memory, dest_offset: usize) !void {
        // Basic copy cost
        const copy_gas = constants.memoryCopyGas(size);
        try self.charge(copy_gas);
        
        // Memory expansion cost (if needed)
        if (size > 0) {
            const new_size = dest_offset + size;
            const expansion_gas = memory.expand(new_size);
            try self.charge(expansion_gas);
        }
    }
    
    /// Calculate and charge gas for SHA3 operation
    pub fn chargeSha3(self: *GasCalculator, data_size: usize) !void {
        const gas_cost = constants.sha3Gas(data_size);
        return self.charge(gas_cost);
    }
    
    /// Calculate and charge gas for BALANCE operation
    pub fn chargeBalance(self: *GasCalculator, is_cold: bool) !void {
        const gas_cost = constants.balanceGas(is_cold);
        return self.charge(gas_cost);
    }
    
    /// Calculate and charge gas for EXP operation
    pub fn chargeExp(self: *GasCalculator, exponent: U256) !void {
        // Find highest byte of exponent (0 if exponent is 0)
        var exponent_byte_size: usize = 0;
        var exp_copy = exponent;
        
        for (0..32) |i| {
            if (!exp_copy.isZero()) {
                exponent_byte_size = 32 - i;
                exp_copy = exp_copy.shr(8);
            } else {
                break;
            }
        }
        
        const gas_cost = constants.expGas(exponent_byte_size);
        return self.charge(gas_cost);
    }
    
    /// Calculate and charge gas for SELFDESTRUCT operation
    pub fn chargeSelfdestruct(self: *GasCalculator, is_cold: bool) !void {
        // Basic cost
        var gas_cost = self.gas_costs.selfdestruct;
        
        // Add cold access cost if applicable
        if (is_cold) {
            gas_cost += self.gas_costs.cold_account_access;
        }
        
        return self.charge(gas_cost);
    }
    
    /// Calculate and charge gas for CALL operations
    pub fn chargeCall(
        self: *GasCalculator, 
        is_cold: bool, 
        transfers_value: bool, 
        is_new_account: bool,
    ) !void {
        // Basic call cost
        var gas_cost = self.gas_costs.call;
        
        // Add cold access cost if applicable
        if (is_cold) {
            gas_cost += self.gas_costs.cold_account_access;
        }
        
        // Add value transfer cost if applicable
        if (transfers_value) {
            gas_cost += self.gas_costs.call_value;
        }
        
        // Add new account cost if applicable
        if (is_new_account && transfers_value) {
            gas_cost += self.gas_costs.new_account;
        }
        
        return self.charge(gas_cost);
    }
};

// Tests
const testing = std.testing;

test "Basic gas calculator" {
    var calculator = GasCalculator.init(1000);
    
    // Check initial state
    try testing.expectEqual(@as(u64, 1000), calculator.getGasLeft());
    try testing.expectEqual(@as(u64, 0), calculator.getGasRefund());
    
    // Charge some gas
    try calculator.charge(100);
    try testing.expectEqual(@as(u64, 900), calculator.getGasLeft());
    
    // Add some refund
    calculator.refund(50);
    try testing.expectEqual(@as(u64, 50), calculator.getGasRefund());
    
    // Charge more gas and check max refund
    try calculator.charge(300);
    try testing.expectEqual(@as(u64, 600), calculator.getGasLeft());
    try testing.expectEqual(@as(u64, 50), calculator.getGasRefund()); // Refund still 50
    
    // Out of gas test
    var oog_calculator = GasCalculator.init(100);
    try testing.expectError(Error.OutOfGas, oog_calculator.charge(101));
}

test "Memory expansion gas" {
    var calculator = GasCalculator.init(1000);
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    // Expand memory to 100 bytes
    _ = memory.expand(100);
    
    // Calculate gas for expanding from 100 to 200 bytes
    try calculator.chargeMemory(100, 200);
    
    // Check gas charged (the exact amount depends on the memory gas formula)
    try testing.expect(calculator.getGasLeft() < 1000);
}

test "SSTORE gas" {
    var calculator = GasCalculator.init(30000);
    
    // Test zero to non-zero, cold access
    try calculator.chargeSstore(true, false, false, true);
    try testing.expect(calculator.getGasLeft() < 30000);
    
    // Reset for next test
    calculator = GasCalculator.init(30000);
    
    // Test non-zero to zero, warm access
    try calculator.chargeSstore(false, true, true, false);
    try testing.expect(calculator.getGasLeft() < 30000);
    try testing.expect(calculator.getGasRefund() > 0);
}