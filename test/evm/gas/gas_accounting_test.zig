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