//! Dynamic gas cost calculations for EVM operations
//! This module provides functions to calculate gas costs that depend on runtime values

const std = @import("std");
const constants = @import("constants.zig");

// Use an opaque type for U256 to avoid direct import
pub const U256 = opaque {
    pub fn isZero(_: *const @This()) bool {
        return false; // Stub implementation for tests
    }
    
    pub fn zero() @This() {
        return undefined; // Stub implementation for tests
    }
    
    pub fn fromU64(val: u64) @This() {
        _ = val;
        return undefined; // Stub implementation for tests
    }
};

/// Calculate the gas cost for memory expansion to a new size
/// Returns the additional gas required to expand memory
pub fn calculateMemoryExpansionGas(current_size: usize, new_size: usize) u64 {
    if (new_size <= current_size) {
        return 0;
    }
    
    // Calculate gas costs for both sizes
    const old_cost = constants.memoryGas(current_size);
    const new_cost = constants.memoryGas(new_size);
    
    // Return the difference
    return new_cost - old_cost;
}

/// Calculate the byte size of an exponent for gas calculation
pub fn expByteSize(exponent: U256) usize {
    // If exponent is zero, byte size is 0
    if (exponent.isZero()) {
        return 0;
    }
    
    // Calculate the byte size of the exponent by finding the highest set bit
    var byte_size: usize = 0;
    
    // Check high-order words first
    if (exponent.words[3] != 0 or exponent.words[2] != 0) {
        byte_size = 32; // At least 32 bytes (256 bits)
        
        // Start from highest word and find highest non-zero byte
        var i: usize = 3;
        var word = exponent.words[3];
        
        while (word == 0 and i > 0) {
            word = exponent.words[i - 1];
            i -= 1;
            byte_size -= 8;
        }
        
        // Now find highest non-zero byte within the word
        if (word != 0) {
            var shift: u6 = 56;
            while ((word >> shift) == 0 and shift > 0) {
                shift -= 8;
                byte_size -= 1;
            }
        }
    } else {
        // Check low-order words
        if (exponent.words[1] != 0) {
            byte_size = 16; // Start with assumption that it's in the upper half
            
            // Check if it's in upper or lower half
            if (exponent.words[1] & 0xFFFFFFFF00000000 == 0) {
                byte_size -= 4;
            }
            
            // Find highest non-zero byte
            const word = exponent.words[1];
            var shift: u6 = 56;
            if (byte_size == 12) { // If in lower half, adjust shift
                shift = 24;
            }
            
            while ((word >> shift) == 0 and shift > 0) {
                shift -= 8;
                byte_size -= 1;
            }
        } else if (exponent.words[0] != 0) {
            byte_size = 8; // Start with assumption that it's in the upper byte
            
            // Find highest non-zero byte
            const word = exponent.words[0];
            var shift: u6 = 56;
            
            while ((word >> shift) == 0 and shift > 0) {
                shift -= 8;
                byte_size -= 1;
            }
        }
    }
    
    return byte_size;
}

/// Calculate gas for the EXP operation based on the exponent
pub fn calculateExpGas(exponent: U256) u64 {
    // Calculate the byte size of the exponent
    const byte_size = expByteSize(exponent);
    
    // Calculate gas cost based on byte size
    return constants.expGas(byte_size);
}

/// Calculate cost for copying data based on size
pub fn calculateCopyGas(size: usize) u64 {
    return constants.memoryCopyGas(size);
}

/// Calculate gas for SHA3 operation
pub fn calculateSha3Gas(size: usize) u64 {
    return constants.sha3Gas(size);
}

/// Calculate gas cost for CALL operations
pub fn calculateCallGas(
    is_cold_account: bool,
    is_value_transfer: bool,
    is_new_account: bool,
    gas_stipend: bool,
    _: u64, // Unused child_gas_limit parameter
) struct {
    cost: u64,
    stipend: u64,
} {
    const gas_costs = constants.GasCosts{}; // Used below
    var cost = gas_costs.call;
    var stipend: u64 = 0;
    
    // Account access cost (EIP-2929)
    if (is_cold_account) {
        cost += gas_costs.cold_account_access;
    }
    
    // Value transfer cost
    if (is_value_transfer) {
        cost += gas_costs.call_value;
        if (gas_stipend) {
            stipend = gas_costs.callstipend;
        }
    }
    
    // New account creation cost
    if (is_new_account) {
        cost += gas_costs.new_account;
    }
    
    return .{
        .cost = cost,
        .stipend = stipend,
    };
}

/// Calculate gas cost for LOG operations
pub fn calculateLogGas(num_topics: u8, data_size: usize) u64 {
    return constants.logGas(num_topics, data_size);
}

/// Calculate gas cost for SSTORE operations
pub fn calculateSstoreGas(
    is_cold: bool,
    original_value: U256,
    current_value: U256,
    new_value: U256,
) struct { cost: u64, refund: i64 } {
    const original_is_zero = original_value.isZero();
    const current_is_zero = current_value.isZero();
    const new_is_zero = new_value.isZero();
    
    return constants.storageGas(
        is_cold,
        !current_is_zero, // Convert to bool for non-zero check
        !original_is_zero,
        !new_is_zero,
    );
}

/// Calculate gas cost for SELFDESTRUCT operation
pub fn calculateSelfdestructGas(
    is_cold_account: bool,
    creates_beneficiary: bool,
) u64 {
    const gas_costs = constants.GasCosts{}; // Used below
    var cost = gas_costs.selfdestruct;
    
    // Account access cost (EIP-2929)
    if (is_cold_account) {
        cost += gas_costs.cold_account_access;
    }
    
    // Cost for creating new account as beneficiary
    if (creates_beneficiary) {
        cost += gas_costs.new_account;
    }
    
    return cost;
}

/// Calculate gas cost for CREATE/CREATE2 operations
pub fn calculateCreateGas(
    code_size: usize,
    is_create2: bool,
    salt: ?U256,
) u64 {
    const gas_costs = constants.GasCosts{}; // Used in function body
    var cost = gas_costs.create;
    
    // Code deposit cost
    cost += code_size * gas_costs.code_deposit;
    
    // CREATE2 has additional hashing cost
    if (is_create2 and salt != null) {
        // Additional SHA3 cost for CREATE2
        cost += calculateSha3Gas(32); // Salt is 32 bytes
    }
    
    return cost;
}

// Tests
const testing = std.testing;

test "Memory expansion gas calculation" {
    // Test no expansion
    try testing.expectEqual(@as(u64, 0), calculateMemoryExpansionGas(64, 64));
    
    // Test expansion by one word
    try testing.expectEqual(@as(u64, 3), calculateMemoryExpansionGas(64, 96));
    
    // Test large expansion
    try testing.expectEqual(
        constants.memoryGas(10240) - constants.memoryGas(1024),
        calculateMemoryExpansionGas(1024, 10240)
    );
}

test "EXP gas calculation" {
    // Test zero exponent
    try testing.expectEqual(@as(u64, 5), calculateExpGas(U256.zero()));
    
    // Test small exponent
    try testing.expectEqual(@as(u64, 13), calculateExpGas(U256.fromU64(0x100))); // 2 bytes
    
    // Test larger exponent
    var large_exp = U256.zero();
    large_exp.words[2] = 0x1;  // Set a bit in the third word
    try testing.expectEqual(@as(u64, 5 + 25 * 8), calculateExpGas(large_exp)); // 25 bytes
}

test "LOG gas calculation" {
    // Test LOG0 with no data
    try testing.expectEqual(@as(u64, 375), calculateLogGas(0, 0));
    
    // Test LOG1 with 32 bytes
    try testing.expectEqual(@as(u64, 375 + 375 + 32 * 8), calculateLogGas(1, 32));
    
    // Test LOG4 with 1024 bytes
    try testing.expectEqual(@as(u64, 375 + 4 * 375 + 1024 * 8), calculateLogGas(4, 1024));
}

test "SSTORE gas calculation" {
    const zero = U256.zero();
    const one = U256.fromU64(1);
    const two = U256.fromU64(2);
    
    // Test cold access, storing new non-zero value
    var result = calculateSstoreGas(true, zero, zero, one);
    try testing.expectEqual(@as(u64, 22100), result.cost); // 20000 SSTORE_SET + 2100 Cold access
    try testing.expectEqual(@as(i64, 0), result.refund);
    
    // Test warm access, clearing storage
    result = calculateSstoreGas(false, one, one, zero);
    try testing.expectEqual(@as(u64, 5000), result.cost); // SSTORE_RESET
    try testing.expectEqual(@as(i64, 15000), result.refund);
    
    // Test warm access, modifying existing value
    result = calculateSstoreGas(false, one, one, two);
    try testing.expectEqual(@as(u64, 5000), result.cost); // SSTORE_RESET
    try testing.expectEqual(@as(i64, 0), result.refund);
    
    // Test warm access, resetting to original value
    result = calculateSstoreGas(false, one, two, one);
    try testing.expectEqual(@as(u64, 100), result.cost); // WARM_STORAGE_READ
    try testing.expectEqual(@as(i64, 4900), result.refund); // SSTORE_RESET - WARM_STORAGE_READ
}

test "CALL gas calculation" {
    // We'll use the exact values we expect for test comparisons
    
    // Basic CALL to warm account with no value
    var result = calculateCallGas(false, false, false, false, 0);
    try testing.expectEqual(@as(u64, 700), result.cost);
    try testing.expectEqual(@as(u64, 0), result.stipend);
    
    // CALL to cold account with value
    result = calculateCallGas(true, true, false, true, 0);
    try testing.expectEqual(
        @as(u64, 700 + 2600 + 9000), 
        result.cost
    ); // BASE_CALL + COLD_ACCOUNT + CALL_VALUE
    try testing.expectEqual(@as(u64, 2300), result.stipend);
    
    // CALL with value creating new account
    result = calculateCallGas(true, true, true, true, 0);
    try testing.expectEqual(
        @as(u64, 700 + 2600 + 9000 + 25000), 
        result.cost
    ); // BASE_CALL + COLD_ACCOUNT + CALL_VALUE + NEW_ACCOUNT
    try testing.expectEqual(@as(u64, 2300), result.stipend);
}

test "CREATE gas calculation" {
    // Using exact expected values for test clarity
    
    // Basic CREATE with 100 bytes of code
    try testing.expectEqual(
        @as(u64, 32000 + 100 * 200),
        calculateCreateGas(100, false, null)
    ); // BASE_CREATE + CODE_DEPOSIT * size
    
    // CREATE2 with 100 bytes of code
    try testing.expectEqual(
        @as(u64, 32000 + 100 * 200 + constants.sha3Gas(32)),
        calculateCreateGas(100, true, U256.fromU64(1))
    ); // BASE_CREATE + CODE_DEPOSIT * size + SHA3 cost
}

test "SELFDESTRUCT gas calculation" {
    // Using exact expected values for test clarity
    
    // Basic SELFDESTRUCT with warm account
    try testing.expectEqual(@as(u64, 5000), calculateSelfdestructGas(false, false));
    
    // SELFDESTRUCT with cold account
    try testing.expectEqual(
        @as(u64, 5000 + 2600),
        calculateSelfdestructGas(true, false)
    ); // BASE_SELFDESTRUCT + COLD_ACCOUNT
    
    // SELFDESTRUCT creating new account
    try testing.expectEqual(
        @as(u64, 5000 + 2600 + 25000),
        calculateSelfdestructGas(true, true)
    ); // BASE_SELFDESTRUCT + COLD_ACCOUNT + NEW_ACCOUNT
}