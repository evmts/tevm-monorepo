//! Gas cost constants for ZigEVM
//! This module defines the gas costs for various EVM operations

const std = @import("std");

/// Gas constants as defined in the Ethereum Yellow Paper and subsequent EIPs
pub const GasCosts = struct {
    // Basic operations
    zero: u64 = 0,
    base: u64 = 2,
    very_low: u64 = 3,
    low: u64 = 5,
    mid: u64 = 8,
    high: u64 = 10,
    
    // Memory operations
    memory_gas_per_word: u64 = 3,
    memory_expansion_quadratic_denominator: u64 = 512,
    
    // Storage operations
    sload: u64 = 800,             // Pre-EIP-2200 cost, used as a fallback
    cold_sload: u64 = 2100,       // EIP-2929 cost for first-time (cold) storage access
    warm_sload: u64 = 100,        // EIP-2929 cost for repeated (warm) storage access
    sstore_set: u64 = 20000,      // Cost of storing a new non-zero value
    sstore_reset: u64 = 5000,     // Cost of changing a value from non-zero to different non-zero
    sstore_clears_refund: u64 = 15000,  // Refund for clearing a storage slot (non-zero to zero)
    sstore_refund_reset: u64 = 4800,    // Refund when changing back to original non-zero value
    
    // Call operations
    call: u64 = 700,
    call_value: u64 = 9000,       // Additional cost for calls with non-zero value
    new_account: u64 = 25000,     // Cost of creating a new account
    callstipend: u64 = 2300,      // Stipend given to calls with value
    
    // Log operations
    log: u64 = 375,               // Base cost for LOG operations
    log_topic: u64 = 375,         // Cost per topic
    log_data: u64 = 8,            // Cost per byte of data
    
    // Contract operations
    create: u64 = 32000,          // Cost of CREATE operation
    code_deposit: u64 = 200,      // Cost per byte of deployed contract code
    selfdestruct: u64 = 5000,     // Base cost of SELFDESTRUCT
    
    // Special operations
    expensive_operations: u64 = 40000,  // Operations like BALANCE, EXTCODESIZE
    
    // EIP-150 multiplier for out-of-gas child calls
    call_gas_eip150: u64 = 63,    // Numerator of EIP-150 multiplier (63/64)
    
    // Block information access
    blockhash: u64 = 20,          // Cost of accessing a block hash
    
    // Precompiled contract gas costs - simplified, actual costs are dynamic
    ecrecover: u64 = 3000,
    sha256_base: u64 = 60,
    sha256_per_word: u64 = 12,
    ripemd160_base: u64 = 600,
    ripemd160_per_word: u64 = 120,
    identity_base: u64 = 15,
    identity_per_word: u64 = 3,
    
    // Gas limits
    max_gas_limit: u64 = 0x7fffffffffffffff, // Maximum gas allowed in a transaction
    
    // EIP-2929 constants (added in Berlin hard fork)
    cold_account_access: u64 = 2600,  // Cost of accessing a new account
    warm_account_access: u64 = 100,   // Cost of accessing a previously accessed account
    
    // EIP-3529 constants (added in London hard fork)
    access_list_address: u64 = 2400,  // Cost to add an address to access list
    access_list_storage: u64 = 1900,  // Cost to add a storage key to access list
};

/// Get the gas cost for a basic opcode by its category
pub fn getBasicGas(category: enum { Zero, Base, VeryLow, Low, Mid, High }) u64 {
    const gas_costs = GasCosts{};
    
    return switch (category) {
        .Zero => gas_costs.zero,
        .Base => gas_costs.base,
        .VeryLow => gas_costs.very_low, 
        .Low => gas_costs.low,
        .Mid => gas_costs.mid,
        .High => gas_costs.high,
    };
}

/// Calculate gas cost for memory expansion
/// Uses the formula from the Yellow Paper: 3 * words + words^2 / 512
pub fn memoryGas(size_in_bytes: usize) u64 {
    const gas_costs = GasCosts{};
    
    // If size is 0, no gas cost
    if (size_in_bytes == 0) {
        return 0;
    }
    
    // Convert bytes to words, rounding up
    const size_in_words = (size_in_bytes + 31) / 32;
    
    // Calculate gas using the formula from the Yellow Paper
    const linear_cost = size_in_words * gas_costs.memory_gas_per_word;
    const quadratic_cost = (size_in_words * size_in_words) / gas_costs.memory_expansion_quadratic_denominator;
    
    return linear_cost + quadratic_cost;
}

/// Calculate gas for copying data in memory (CALLDATACOPY, CODECOPY, etc.)
pub fn memoryCopyGas(size: usize) u64 {
    const gas_costs = GasCosts{};
    
    // Base cost of 3 gas (VERYLOW)
    var gas: u64 = gas_costs.very_low;
    
    // Add copy cost: 3 gas per word, rounded up
    if (size > 0) {
        const words = (size + 31) / 32;
        gas += words * gas_costs.memory_gas_per_word;
    }
    
    return gas;
}

/// Calculate gas cost for storage operations based on EIP-2200 and EIP-2929
pub fn storageGas(
    is_cold: bool,
    current_value: bool,
    original_value: bool,
    new_value: bool,
) struct { cost: u64, refund: i64 } {
    const gas_costs = GasCosts{};
    var cost: u64 = 0;
    var refund: i64 = 0;
    
    // Add cold access cost if applicable
    if (is_cold) {
        cost += gas_costs.cold_sload;
    }
    
    // If no change in value, low cost
    if (current_value == new_value) {
        cost += gas_costs.warm_sload;
        return .{ .cost = cost, .refund = refund };
    }
    
    // The value is being changed
    if (original_value == current_value) {
        // Original and current values are the same
        if (!original_value) {
            // Changing from 0 to non-zero
            cost += gas_costs.sstore_set;
        } else if (!new_value) {
            // Changing from non-zero to zero - charge reset cost and add refund
            cost += gas_costs.sstore_reset;
            refund += @intCast(gas_costs.sstore_clears_refund);
        } else {
            // Changing from non-zero to non-zero
            cost += gas_costs.sstore_reset;
        }
    } else {
        // Original and current values are different
        
        // Base cost for warm access
        cost += gas_costs.warm_sload;
        
        // Handle refunds for various cases
        if (original_value and !current_value) {
            // Current value is zero (slot was cleared) and we're changing it to non-zero
            // Remove refund for clearing the slot
            refund -= @intCast(gas_costs.sstore_clears_refund);
        }
        
        if (original_value == new_value) {
            // Reverting to original value
            if (!original_value) {
                // Original value was zero
                refund += @intCast(gas_costs.sstore_set - gas_costs.warm_sload);
            } else {
                // Original value was non-zero
                refund += @intCast(gas_costs.sstore_reset - gas_costs.warm_sload);
            }
        } else if (!new_value and original_value) {
            // Setting to zero when original was non-zero
            refund += @intCast(gas_costs.sstore_clears_refund);
        }
    }
    
    return .{ .cost = cost, .refund = refund };
}

/// Calculate gas cost for LOG operations
pub fn logGas(topics: u8, data_size: usize) u64 {
    const gas_costs = GasCosts{};
    
    // Base cost for LOG
    var gas = gas_costs.log;
    
    // Cost per topic
    gas += @as(u64, topics) * gas_costs.log_topic;
    
    // Cost per byte of data
    gas += @as(u64, data_size) * gas_costs.log_data;
    
    return gas;
}

/// Calculate gas cost for SHA3 operation
pub fn sha3Gas(data_size: usize) u64 {
    const gas_costs = GasCosts{};
    
    // Base cost
    var gas = gas_costs.mid; // SHA3 base gas is 30, but we use mid cost as an approximation
    
    // Cost per word, rounded up
    if (data_size > 0) {
        const words = (data_size + 31) / 32;
        gas += words * 6; // 6 gas per word for SHA3
    }
    
    return gas;
}

/// Calculate gas cost for BALANCE operation
pub fn balanceGas(is_cold: bool) u64 {
    const gas_costs = GasCosts{};
    
    return if (is_cold) gas_costs.cold_account_access else gas_costs.warm_account_access;
}

/// Calculate gas cost for EXP operation
pub fn expGas(exponent_byte_size: usize) u64 {
    const gas_costs = GasCosts{};
    
    // Base cost
    var gas = gas_costs.low; // 5 gas for EXP
    
    // Cost per byte of exponent, but only if exponent is non-zero
    if (exponent_byte_size > 0) {
        gas += exponent_byte_size * 8; // 8 gas per byte of exponent
    }
    
    return gas;
}

/// Calculate gas cost for EXTCODEHASH operation
pub fn extcodehashGas(is_cold: bool) u64 {
    const gas_costs = GasCosts{};
    
    return if (is_cold) gas_costs.cold_account_access else gas_costs.warm_account_access;
}

// Tests
const testing = std.testing;

test "Basic gas costs" {
    try testing.expectEqual(@as(u64, 0), getBasicGas(.Zero));
    try testing.expectEqual(@as(u64, 2), getBasicGas(.Base));
    try testing.expectEqual(@as(u64, 3), getBasicGas(.VeryLow));
    try testing.expectEqual(@as(u64, 5), getBasicGas(.Low));
    try testing.expectEqual(@as(u64, 8), getBasicGas(.Mid));
    try testing.expectEqual(@as(u64, 10), getBasicGas(.High));
}

test "Memory gas calculation" {
    // Test empty memory
    try testing.expectEqual(@as(u64, 0), memoryGas(0));
    
    // Test one word
    try testing.expectEqual(@as(u64, 3), memoryGas(32));
    
    // Test two words
    try testing.expectEqual(@as(u64, 6), memoryGas(64));
    
    // Test partial word (rounds up to full word)
    try testing.expectEqual(@as(u64, 3), memoryGas(16));
    
    // Test large memory size with quadratic component
    try testing.expectEqual(@as(u64, 768 + 1), memoryGas(256 * 32));
}

test "Storage gas calculation" {
    // Test cold access, no change in value
    var result = storageGas(true, false, false, false); // Cold, all zeros
    try testing.expectEqual(@as(u64, 2100 + 100), result.cost);
    try testing.expectEqual(@as(i64, 0), result.refund);
    
    // Test warm access, no change in value
    result = storageGas(false, true, true, true); // Warm, all ones
    try testing.expectEqual(@as(u64, 100), result.cost);
    try testing.expectEqual(@as(i64, 0), result.refund);
    
    // Test cold access, zero to non-zero
    result = storageGas(true, false, false, true);
    try testing.expectEqual(@as(u64, 2100 + 20000), result.cost);
    try testing.expectEqual(@as(i64, 0), result.refund);
    
    // Test warm access, non-zero to zero (with refund)
    result = storageGas(false, true, true, false);
    try testing.expectEqual(@as(u64, 5000), result.cost);
    try testing.expectEqual(@as(i64, 15000), result.refund);
    
    // Test warm access, restoring original value
    result = storageGas(false, false, true, true); // Current is zero, but original and new are non-zero
    try testing.expectEqual(@as(u64, 100), result.cost);
    try testing.expectEqual(@as(i64, -15000 + 4900), result.refund); // -15000 for removing previous refund, +4900 for restoring
}

test "LOG gas calculation" {
    // Test LOG0 with no data
    try testing.expectEqual(@as(u64, 375), logGas(0, 0));
    
    // Test LOG0 with some data
    try testing.expectEqual(@as(u64, 375 + 32 * 8), logGas(0, 32));
    
    // Test LOG1 with some data
    try testing.expectEqual(@as(u64, 375 + 375 + 32 * 8), logGas(1, 32));
    
    // Test LOG4 with large data
    try testing.expectEqual(@as(u64, 375 + 4 * 375 + 1024 * 8), logGas(4, 1024));
}

test "Other gas calculations" {
    // Test SHA3 gas
    try testing.expectEqual(@as(u64, 8), sha3Gas(0)); // Base cost only
    try testing.expectEqual(@as(u64, 8 + 6), sha3Gas(32)); // Base cost + 1 word
    try testing.expectEqual(@as(u64, 8 + 6 * 2), sha3Gas(33)); // Base cost + 2 words
    
    // Test BALANCE gas
    try testing.expectEqual(@as(u64, 2600), balanceGas(true)); // Cold access
    try testing.expectEqual(@as(u64, 100), balanceGas(false)); // Warm access
    
    // Test EXP gas
    try testing.expectEqual(@as(u64, 5), expGas(0)); // Base cost only
    try testing.expectEqual(@as(u64, 5 + 8), expGas(1)); // Base cost + 1 byte
    try testing.expectEqual(@as(u64, 5 + 32 * 8), expGas(32)); // Base cost + 32 bytes
}