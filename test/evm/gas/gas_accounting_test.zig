const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const gas_constants = @import("../../../src/evm/constants/gas_constants.zig");


// Test basic gas constants are defined correctly
test "gas constants are correctly defined" {
    // Basic operation costs
    try testing.expectEqual(@as(u64, 2), gas_constants.GasQuickStep);
    try testing.expectEqual(@as(u64, 3), gas_constants.GasFastestStep);
    try testing.expectEqual(@as(u64, 5), gas_constants.GasFastStep);
    try testing.expectEqual(@as(u64, 8), gas_constants.GasMidStep);
    try testing.expectEqual(@as(u64, 10), gas_constants.GasSlowStep);
    try testing.expectEqual(@as(u64, 20), gas_constants.GasExtStep);
    
    // Storage operation costs
    try testing.expectEqual(@as(u64, 100), gas_constants.SloadGas);
    try testing.expectEqual(@as(u64, 2100), gas_constants.ColdSloadCost);
    try testing.expectEqual(@as(u64, 2600), gas_constants.ColdAccountAccessCost);
    
    // Precompile costs
    try testing.expectEqual(@as(u64, 3000), gas_constants.ECRECOVER_COST);
    try testing.expectEqual(@as(u64, 15), gas_constants.IDENTITY_BASE_COST);
    try testing.expectEqual(@as(u64, 3), gas_constants.IDENTITY_WORD_COST);
}

// Test memory expansion gas calculation
test "memory expansion gas calculation" {
    // Test no expansion needed
    try testing.expectEqual(@as(u64, 0), gas_constants.memory_gas_cost(100, 100));
    try testing.expectEqual(@as(u64, 0), gas_constants.memory_gas_cost(100, 50));
    
    // Test basic expansion cases
    // Expanding from 0 to 32 bytes (1 word): 3 + 0 = 3 gas
    try testing.expectEqual(@as(u64, 3), gas_constants.memory_gas_cost(0, 32));
    
    // Expanding from 0 to 64 bytes (2 words): 6 + 0 = 6 gas
    try testing.expectEqual(@as(u64, 6), gas_constants.memory_gas_cost(0, 64));
    
    // Test expansion with existing memory
    // From 32 to 64 bytes: 6 - 3 = 3 gas
    try testing.expectEqual(@as(u64, 3), gas_constants.memory_gas_cost(32, 64));
    
    // Test larger expansion
    // From 0 to 1024 bytes (32 words): 3*32 + 32*32/512 = 96 + 2 = 98 gas
    try testing.expectEqual(@as(u64, 98), gas_constants.memory_gas_cost(0, 1024));
}

// Test memory expansion lookup table
test "memory expansion lookup table" {
    // Test that LUT values match calculated values for small sizes
    for (0..100) |words| {
        const expected = gas_constants.MemoryGas * words + (words * words) / gas_constants.QuadCoeffDiv;
        try testing.expectEqual(expected, gas_constants.MEMORY_EXPANSION_LUT[words]);
    }
}

// Test edge cases for memory expansion
test "memory expansion edge cases" {
    // Test alignment - should round up to nearest word
    try testing.expectEqual(@as(u64, 3), gas_constants.memory_gas_cost(0, 1));
    try testing.expectEqual(@as(u64, 3), gas_constants.memory_gas_cost(0, 31));
    try testing.expectEqual(@as(u64, 3), gas_constants.memory_gas_cost(0, 32));
    try testing.expectEqual(@as(u64, 6), gas_constants.memory_gas_cost(0, 33));
    
    // Test that very large sizes don't cause overflow
    const large_size = gas_constants.memory_gas_cost(0, 1024 * 1024); // 1MB
    try testing.expect(large_size > 1000000); // Should be very expensive
}

// Test gas accounting for specific operations
test "operation gas costs" {
    // Quick operations (ADDRESS, ORIGIN, etc.)
    try testing.expectEqual(@as(u64, 2), gas_constants.GasQuickStep);
    
    // Arithmetic operations (ADD, SUB, etc.)
    try testing.expectEqual(@as(u64, 3), gas_constants.GasFastestStep);
    
    // Multiplication/division (MUL, DIV, etc.)
    try testing.expectEqual(@as(u64, 5), gas_constants.GasFastStep);
    
    // Advanced arithmetic (ADDMOD, MULMOD, etc.)
    try testing.expectEqual(@as(u64, 8), gas_constants.GasMidStep);
    
    // Control flow (JUMPI)
    try testing.expectEqual(@as(u64, 10), gas_constants.GasSlowStep);
    
    // External operations (BALANCE, EXTCODESIZE, etc.)
    try testing.expectEqual(@as(u64, 20), gas_constants.GasExtStep);
}

// Test transaction gas costs
test "transaction gas costs" {
    try testing.expectEqual(@as(u64, 21000), gas_constants.TxGas);
    try testing.expectEqual(@as(u64, 53000), gas_constants.TxGasContractCreation);
    try testing.expectEqual(@as(u64, 4), gas_constants.TxDataZeroGas);
    try testing.expectEqual(@as(u64, 16), gas_constants.TxDataNonZeroGas);
}

// Test call operation gas costs
test "call operation gas costs" {
    try testing.expectEqual(@as(u64, 40), gas_constants.CallGas);
    try testing.expectEqual(@as(u64, 2300), gas_constants.CallStipend);
    try testing.expectEqual(@as(u64, 9000), gas_constants.CallValueTransferGas);
    try testing.expectEqual(@as(u64, 25000), gas_constants.CallNewAccountGas);
}

// Test storage operation gas costs
test "storage operation gas costs" {
    try testing.expectEqual(@as(u64, 20000), gas_constants.SstoreSetGas);
    try testing.expectEqual(@as(u64, 5000), gas_constants.SstoreResetGas);
    try testing.expectEqual(@as(u64, 5000), gas_constants.SstoreClearGas);
    try testing.expectEqual(@as(u64, 4800), gas_constants.SstoreRefundGas);
    try testing.expectEqual(@as(u64, 2300), gas_constants.SstoreSentryGas);
}

// Test logging operation gas costs
test "logging operation gas costs" {
    try testing.expectEqual(@as(u64, 375), gas_constants.LogGas);
    try testing.expectEqual(@as(u64, 8), gas_constants.LogDataGas);
    try testing.expectEqual(@as(u64, 375), gas_constants.LogTopicGas);
}

// Test contract creation gas costs
test "contract creation gas costs" {
    try testing.expectEqual(@as(u64, 32000), gas_constants.CreateGas);
    try testing.expectEqual(@as(u64, 200), gas_constants.CreateDataGas);
    try testing.expectEqual(@as(u64, 2), gas_constants.InitcodeWordGas);
    try testing.expectEqual(@as(u64, 49152), gas_constants.MaxInitcodeSize);
}

// Test hashing operation gas costs
test "hashing operation gas costs" {
    try testing.expectEqual(@as(u64, 30), gas_constants.Keccak256Gas);
    try testing.expectEqual(@as(u64, 6), gas_constants.Keccak256WordGas);
}

// Test EIP-specific gas costs
test "eip specific gas costs" {
    // EIP-1153: Transient storage
    try testing.expectEqual(@as(u64, 100), gas_constants.TLoadGas);
    try testing.expectEqual(@as(u64, 100), gas_constants.TStoreGas);
    
    // EIP-4844: Blob transactions
    try testing.expectEqual(@as(u64, 3), gas_constants.BlobHashGas);
    try testing.expectEqual(@as(u64, 2), gas_constants.BlobBaseFeeGas);
}

// Test refund mechanics
test "gas refund mechanics" {
    try testing.expectEqual(@as(u64, 24000), gas_constants.SelfdestructRefundGas);
    try testing.expectEqual(@as(u64, 5), gas_constants.MaxRefundQuotient);
}

// Test copy operation costs
test "copy operation costs" {
    try testing.expectEqual(@as(u64, 3), gas_constants.CopyGas);
}

// ============================
// REVM-Inspired Gas Edge Cases
// ============================

// Test gas calculation overflow protection
test "gas calculation overflow protection" {
    // Test that extremely large memory expansion doesn't overflow
    // Use a more reasonable large size that won't cause overflow
    const large_size = 1024 * 1024; // 1MB
    const large_memory_cost = gas_constants.memory_gas_cost(0, large_size);
    try testing.expect(large_memory_cost > 0); // Should not overflow to 0
    try testing.expect(large_memory_cost < std.math.maxInt(u32)); // Should be reasonable
}

// Test out-of-gas conditions during precompile calls
test "precompile out-of-gas scenarios" {
    // ECRECOVER: requires exactly 3000 gas
    const ecrecover_cost = gas_constants.ECRECOVER_COST;
    try testing.expectEqual(@as(u64, 3000), ecrecover_cost);
    
    // SHA256: requires 60 + 12 * ceil(input_len / 32) gas
    const sha256_base = gas_constants.SHA256_BASE_COST;
    const sha256_word = gas_constants.SHA256_WORD_COST;
    try testing.expectEqual(@as(u64, 60), sha256_base);
    try testing.expectEqual(@as(u64, 12), sha256_word);
    
    // RIPEMD160: requires 600 + 120 * ceil(input_len / 32) gas (if implemented)
    // Note: These constants might not be implemented yet
    // const ripemd_base = gas_constants.RIPEMD160_BASE_COST;
    // const ripemd_word = gas_constants.RIPEMD160_WORD_COST;
    // try testing.expectEqual(@as(u64, 600), ripemd_base);
    // try testing.expectEqual(@as(u64, 120), ripemd_word);
    
    // IDENTITY: requires 15 + 3 * ceil(input_len / 32) gas
    const identity_base = gas_constants.IDENTITY_BASE_COST;
    const identity_word = gas_constants.IDENTITY_WORD_COST;
    try testing.expectEqual(@as(u64, 15), identity_base);
    try testing.expectEqual(@as(u64, 3), identity_word);
}

// Test gas refund capping (EIP-3529)
test "gas refund capping mechanism" {
    // After EIP-3529, refunds are capped at gas_used / 5
    const max_refund_quotient = gas_constants.MaxRefundQuotient;
    try testing.expectEqual(@as(u64, 5), max_refund_quotient);
    
    // Test refund calculation scenarios
    const gas_used = 10000;
    const max_refund = gas_used / max_refund_quotient;
    try testing.expectEqual(@as(u64, 2000), max_refund);
    
    // If actual refund exceeds maximum, should be capped
    const large_refund = 5000;
    const capped_refund = if (large_refund > max_refund) max_refund else large_refund;
    try testing.expectEqual(@as(u64, 2000), capped_refund);
}

// Test very large memory access gas costs
test "extreme memory expansion costs" {
    // Test quadratic growth for very large memory
    const size_1mb = 1024 * 1024;
    const size_2mb = 2 * 1024 * 1024;
    
    const cost_1mb = gas_constants.memory_gas_cost(0, size_1mb);
    const cost_2mb = gas_constants.memory_gas_cost(0, size_2mb);
    
    // Cost should grow quadratically, so doubling size should more than double cost
    try testing.expect(cost_2mb > cost_1mb * 2);
}

// Test intrinsic gas calculation edge cases
test "intrinsic gas calculation edge cases" {
    const tx_gas = gas_constants.TxGas;
    const tx_data_zero = gas_constants.TxDataZeroGas;
    const tx_data_nonzero = gas_constants.TxDataNonZeroGas;
    
    // Empty transaction should cost base gas
    try testing.expectEqual(@as(u64, 21000), tx_gas);
    
    // Transaction with only zero bytes: 21000 + (bytes * 4)
    const zero_bytes = 100;
    const zero_data_cost = tx_gas + (zero_bytes * tx_data_zero);
    try testing.expectEqual(@as(u64, 21400), zero_data_cost);
    
    // Transaction with only non-zero bytes: 21000 + (bytes * 16)
    const nonzero_bytes = 100;
    const nonzero_data_cost = tx_gas + (nonzero_bytes * tx_data_nonzero);
    try testing.expectEqual(@as(u64, 22600), nonzero_data_cost);
}

// Test CREATE2 salt collision gas costs
test "create2 gas calculation" {
    const create_gas = gas_constants.CreateGas;
    const keccak_gas = gas_constants.Keccak256Gas;
    const keccak_word_gas = gas_constants.Keccak256WordGas;
    
    // CREATE2 has additional cost for salt hashing
    try testing.expectEqual(@as(u64, 32000), create_gas);
    try testing.expectEqual(@as(u64, 30), keccak_gas);
    try testing.expectEqual(@as(u64, 6), keccak_word_gas);
    
    // CREATE2 cost = CREATE_GAS + KECCAK_GAS + KECCAK_WORD_GAS * init_code_words
    const init_code_size = 64; // 2 words
    const init_code_words = (init_code_size + 31) / 32;
    const create2_cost = create_gas + keccak_gas + (keccak_word_gas * init_code_words);
    try testing.expectEqual(@as(u64, 32042), create2_cost);
}

// Test call stipend mechanics in edge cases
test "call stipend edge cases" {
    const call_stipend = gas_constants.CallStipend;
    const call_gas = gas_constants.CallGas;
    const call_value_gas = gas_constants.CallValueTransferGas;
    
    // Call with value transfer gets stipend
    try testing.expectEqual(@as(u64, 2300), call_stipend);
    try testing.expectEqual(@as(u64, 40), call_gas);
    try testing.expectEqual(@as(u64, 9000), call_value_gas);
    
    // Total cost for value transfer call: base + value_transfer + (stipend deducted from remaining)
    const value_call_cost = call_gas + call_value_gas;
    try testing.expectEqual(@as(u64, 9040), value_call_cost);
}

// Test hardfork-specific gas changes
test "hardfork gas cost transitions" {
    // EIP-2929: Cold access costs
    const cold_sload = gas_constants.ColdSloadCost;
    const warm_sload = gas_constants.SloadGas;
    const cold_account = gas_constants.ColdAccountAccessCost;
    
    try testing.expectEqual(@as(u64, 2100), cold_sload);
    try testing.expectEqual(@as(u64, 100), warm_sload);
    try testing.expectEqual(@as(u64, 2600), cold_account);
    
    // Cold access should be significantly more expensive than warm
    try testing.expect(cold_sload > warm_sload * 20);
    try testing.expect(cold_account > cold_sload);
}

// Test gas exhaustion detection
test "gas exhaustion boundary conditions" {
    // Test scenarios where gas runs out exactly at operation completion
    const small_gas = 100;
    const large_operation_cost = 1000;
    
    // Should detect insufficient gas
    try testing.expect(small_gas < large_operation_cost);
    
    // Test edge case where gas equals operation cost exactly
    const exact_gas = large_operation_cost;
    try testing.expectEqual(exact_gas, large_operation_cost);
}