const std = @import("std");
const testing = std.testing;
const Gas = @import("Gas.zig").Gas;
const GasCosts = @import("Gas.zig").GasCosts;
const GasError = @import("Gas.zig").GasError;
const getStaticGasCost = @import("Gas.zig").getStaticGasCost;
const OPCODE_GAS_COSTS = @import("Gas.zig").OPCODE_GAS_COSTS;
const GasResult = @import("constants.zig").GasResult;

test "Gas.init creates gas meter with correct values" {
    const gas = Gas.init(1000000);
    
    try testing.expectEqual(@as(u64, 1000000), gas.limit);
    try testing.expectEqual(@as(u64, 1000000), gas.remaining);
    try testing.expectEqual(@as(u64, 0), gas.used);
    try testing.expectEqual(@as(u64, 0), gas.refund);
    try testing.expectEqual(@as(u64, 0), gas.memory_size);
}

test "Gas.consume successful consumption" {
    var gas = Gas.init(1000);
    
    try gas.consume(100);
    try testing.expectEqual(@as(u64, 900), gas.remaining);
    try testing.expectEqual(@as(u64, 100), gas.used);
    
    try gas.consume(400);
    try testing.expectEqual(@as(u64, 500), gas.remaining);
    try testing.expectEqual(@as(u64, 500), gas.used);
}

test "Gas.consume out of gas error" {
    var gas = Gas.init(100);
    
    try gas.consume(50);
    try testing.expectEqual(@as(u64, 50), gas.remaining);
    
    // This should fail
    const result = gas.consume(51);
    try testing.expectError(error.OutOfGas, result);
    
    // State should not change on error
    try testing.expectEqual(@as(u64, 50), gas.remaining);
    try testing.expectEqual(@as(u64, 50), gas.used);
}

test "Gas.tryConsume" {
    var gas = Gas.init(100);
    
    // Successful consumption
    try testing.expect(gas.tryConsume(50));
    try testing.expectEqual(@as(u64, 50), gas.remaining);
    try testing.expectEqual(@as(u64, 50), gas.used);
    
    // Failed consumption
    try testing.expect(!gas.tryConsume(51));
    try testing.expectEqual(@as(u64, 50), gas.remaining);
    try testing.expectEqual(@as(u64, 50), gas.used);
    
    // Exact amount
    try testing.expect(gas.tryConsume(50));
    try testing.expectEqual(@as(u64, 0), gas.remaining);
    try testing.expectEqual(@as(u64, 100), gas.used);
}

test "Gas.refundGas" {
    var gas = Gas.init(1000);
    try gas.consume(600);
    
    // Refund some gas
    gas.refundGas(200);
    try testing.expectEqual(@as(u64, 600), gas.remaining);
    try testing.expectEqual(@as(u64, 400), gas.used);
    
    // Refund cannot exceed limit
    gas.refundGas(1000);
    try testing.expectEqual(@as(u64, 1000), gas.remaining);
    try testing.expectEqual(@as(u64, 0), gas.used);
}

test "Gas refund counter operations" {
    var gas = Gas.init(1000);
    
    // Add refunds
    gas.addRefund(100);
    try testing.expectEqual(@as(u64, 100), gas.refund);
    
    gas.addRefund(50);
    try testing.expectEqual(@as(u64, 150), gas.refund);
    
    // Subtract refunds
    gas.subRefund(30);
    try testing.expectEqual(@as(u64, 120), gas.refund);
    
    // Underflow protection
    gas.subRefund(200);
    try testing.expectEqual(@as(u64, 0), gas.refund);
}

test "Gas.getEffectiveRefund with London rules" {
    var gas = Gas.init(1000);
    try gas.consume(500);
    
    // Add large refund
    gas.addRefund(200);
    
    // Effective refund is capped at used/5 = 100
    const effective = gas.getEffectiveRefund();
    try testing.expectEqual(@as(u64, 100), effective);
    
    // If refund is less than cap, use refund
    gas.refund = 50;
    const effective2 = gas.getEffectiveRefund();
    try testing.expectEqual(@as(u64, 50), effective2);
}

test "Gas.memoryGasCost zero size" {
    const gas = Gas.init(1000);
    const result = gas.memoryGasCost(100, 0);
    
    try testing.expectEqual(@as(u64, 0), result.cost);
    try testing.expectEqual(false, result.overflow);
}

test "Gas.memoryGasCost no expansion needed" {
    var gas = Gas.init(1000);
    gas.memory_size = 64; // Already paid for 2 words
    
    const result = gas.memoryGasCost(0, 32);
    try testing.expectEqual(@as(u64, 0), result.cost);
    try testing.expectEqual(false, result.overflow);
}

test "Gas.memoryGasCost expansion calculation" {
    const gas = Gas.init(1000);
    
    // First expansion to 1 word (32 bytes)
    const result1 = gas.memoryGasCost(0, 32);
    // Cost = 1^2/512 + 3*1 = 0 + 3 = 3
    try testing.expectEqual(@as(u64, 3), result1.cost);
    try testing.expectEqual(false, result1.overflow);
    
    // Expansion to 2 words (64 bytes)
    const result2 = gas.memoryGasCost(0, 64);
    // Cost = 2^2/512 + 3*2 = 0 + 6 = 6
    try testing.expectEqual(@as(u64, 6), result2.cost);
    
    // Large expansion
    const result3 = gas.memoryGasCost(0, 1024); // 32 words
    // Cost = 32^2/512 + 3*32 = 2 + 96 = 98
    try testing.expectEqual(@as(u64, 98), result3.cost);
}

test "Gas.memoryGasCost overflow detection" {
    const gas = Gas.init(1000);
    
    // Test overflow in offset + size
    const result = gas.memoryGasCost(std.math.maxInt(u64) - 10, 20);
    try testing.expectEqual(true, result.overflow);
}

test "Gas.expandMemory" {
    var gas = Gas.init(1000);
    
    try testing.expectEqual(@as(u64, 0), gas.memory_size);
    
    gas.expandMemory(32);
    try testing.expectEqual(@as(u64, 32), gas.memory_size);
    
    // Should not shrink
    gas.expandMemory(16);
    try testing.expectEqual(@as(u64, 32), gas.memory_size);
    
    gas.expandMemory(64);
    try testing.expectEqual(@as(u64, 64), gas.memory_size);
}

test "Gas.sstoreGasCost cold no-op" {
    var gas = Gas.init(10000);
    
    const result = gas.sstoreGasCost(100, 100, 100, true);
    try testing.expectEqual(GasCosts.COLD_SLOAD_COST, result.cost);
    try testing.expectEqual(@as(u64, 0), gas.refund);
}

test "Gas.sstoreGasCost warm no-op" {
    var gas = Gas.init(10000);
    
    const result = gas.sstoreGasCost(100, 100, 100, false);
    try testing.expectEqual(GasCosts.WARM_STORAGE_READ_COST, result.cost);
    try testing.expectEqual(@as(u64, 0), gas.refund);
}

test "Gas.sstoreGasCost first modification - create" {
    var gas = Gas.init(50000);
    
    // original = 0, current = 0, new = 100
    const result = gas.sstoreGasCost(0, 0, 100, false);
    const expected_cost = GasCosts.WARM_STORAGE_READ_COST + GasCosts.STORAGE_SET;
    try testing.expectEqual(expected_cost, result.cost);
    try testing.expectEqual(@as(u64, 0), gas.refund);
}

test "Gas.sstoreGasCost first modification - clear" {
    var gas = Gas.init(50000);
    
    // original = 100, current = 100, new = 0
    const result = gas.sstoreGasCost(100, 100, 0, false);
    const expected_cost = GasCosts.WARM_STORAGE_READ_COST + GasCosts.STORAGE_RESET;
    try testing.expectEqual(expected_cost, result.cost);
    try testing.expectEqual(GasCosts.STORAGE_CLEAR_REFUND_REDUCED, gas.refund);
}

test "Gas.sstoreGasCost subsequent modifications" {
    var gas = Gas.init(50000);
    
    // original = 100, current = 200, new = 300
    const result = gas.sstoreGasCost(100, 200, 300, false);
    const expected_cost = GasCosts.WARM_STORAGE_READ_COST + GasCosts.WARM_STORAGE_READ_COST;
    try testing.expectEqual(expected_cost, result.cost);
}

test "Gas.callGasCost" {
    var gas = Gas.init(10000);
    
    // Cold call with no value
    const result1 = gas.callGasCost(0, true, true);
    try testing.expectEqual(GasCosts.COLD_ACCOUNT_ACCESS_COST, result1.cost);
    
    // Warm call with no value
    const result2 = gas.callGasCost(0, true, false);
    try testing.expectEqual(GasCosts.WARM_STORAGE_READ_COST, result2.cost);
    
    // Cold call with value to existing account
    const result3 = gas.callGasCost(1000, true, true);
    const expected3 = GasCosts.COLD_ACCOUNT_ACCESS_COST + GasCosts.CALLVALUE;
    try testing.expectEqual(expected3, result3.cost);
    
    // Cold call with value to new account
    const result4 = gas.callGasCost(1000, false, true);
    const expected4 = GasCosts.COLD_ACCOUNT_ACCESS_COST + GasCosts.CALLVALUE + GasCosts.NEWACCOUNT;
    try testing.expectEqual(expected4, result4.cost);
}

test "Gas.callGasAllocation" {
    const gas = Gas.init(10000);
    
    // Request less than available
    const alloc1 = gas.callGasAllocation(5000);
    try testing.expectEqual(@as(u64, 5000), alloc1);
    
    // Request more than allowed (63/64 rule)
    const max_allowed = gas.remaining - (gas.remaining / 64);
    const alloc2 = gas.callGasAllocation(20000);
    try testing.expectEqual(max_allowed, alloc2);
}

test "Gas.callStipend" {
    try testing.expectEqual(@as(u64, 2300), Gas.callStipend(1));
    try testing.expectEqual(@as(u64, 2300), Gas.callStipend(1000));
    try testing.expectEqual(@as(u64, 0), Gas.callStipend(0));
}

test "Gas.expGasCost" {
    // Zero exponent
    const result1 = Gas.expGasCost(0);
    try testing.expectEqual(GasCosts.EXP, result1.cost);
    
    // 1 byte exponent (1-255)
    const result2 = Gas.expGasCost(100);
    try testing.expectEqual(GasCosts.EXP + GasCosts.EXPBYTE, result2.cost);
    
    // 2 byte exponent (256-65535)
    const result3 = Gas.expGasCost(1000);
    try testing.expectEqual(GasCosts.EXP + GasCosts.EXPBYTE * 2, result3.cost);
    
    // 8 byte exponent
    const result4 = Gas.expGasCost(std.math.maxInt(u64));
    try testing.expectEqual(GasCosts.EXP + GasCosts.EXPBYTE * 8, result4.cost);
}

test "Gas.keccak256GasCost" {
    // Empty data
    const result1 = Gas.keccak256GasCost(0);
    try testing.expectEqual(GasCosts.KECCAK256, result1.cost);
    
    // 1 word
    const result2 = Gas.keccak256GasCost(32);
    try testing.expectEqual(GasCosts.KECCAK256 + GasCosts.KECCAK256_WORD, result2.cost);
    
    // Partial word rounds up
    const result3 = Gas.keccak256GasCost(33);
    try testing.expectEqual(GasCosts.KECCAK256 + GasCosts.KECCAK256_WORD * 2, result3.cost);
}

test "Gas.copyGasCost" {
    // Empty copy
    const result1 = Gas.copyGasCost(0);
    try testing.expectEqual(@as(u64, 0), result1.cost);
    
    // 1 word
    const result2 = Gas.copyGasCost(32);
    try testing.expectEqual(GasCosts.COPY, result2.cost);
    
    // Partial word rounds up
    const result3 = Gas.copyGasCost(33);
    try testing.expectEqual(GasCosts.COPY * 2, result3.cost);
}

test "Gas.logGasCost" {
    // LOG0 with no data
    const result1 = Gas.logGasCost(0, 0);
    try testing.expectEqual(GasCosts.LOG, result1.cost);
    
    // LOG1 with 32 bytes
    const result2 = Gas.logGasCost(32, 1);
    const expected2 = GasCosts.LOG + GasCosts.LOGDATA * 32 + GasCosts.LOGTOPIC;
    try testing.expectEqual(expected2, result2.cost);
    
    // LOG4 with 64 bytes
    const result3 = Gas.logGasCost(64, 4);
    const expected3 = GasCosts.LOG + GasCosts.LOGDATA * 64 + GasCosts.LOGTOPIC * 4;
    try testing.expectEqual(expected3, result3.cost);
}

test "Gas.createGasCost" {
    // Empty init code
    const result1 = Gas.createGasCost(0);
    try testing.expectEqual(GasCosts.CREATE, result1.cost);
    
    // 1 word of init code
    const result2 = Gas.createGasCost(32);
    try testing.expectEqual(GasCosts.CREATE + GasCosts.CREATE_DATA, result2.cost);
    
    // Partial word rounds up
    const result3 = Gas.createGasCost(33);
    try testing.expectEqual(GasCosts.CREATE + GasCosts.CREATE_DATA * 2, result3.cost);
}

test "Gas.transactionIntrinsicGas" {
    // Simple transfer
    const result1 = Gas.transactionIntrinsicGas(&[_]u8{}, false, 0, 0);
    try testing.expectEqual(GasCosts.TRANSACTION, result1.cost);
    
    // Contract creation
    const result2 = Gas.transactionIntrinsicGas(&[_]u8{}, true, 0, 0);
    try testing.expectEqual(GasCosts.TRANSACTION_CREATE, result2.cost);
    
    // With data
    const data = [_]u8{ 0x00, 0x01, 0x00, 0x02 };
    const result3 = Gas.transactionIntrinsicGas(&data, false, 0, 0);
    const expected3 = GasCosts.TRANSACTION + 
                     GasCosts.TRANSACTION_ZERO_DATA * 2 + 
                     GasCosts.TRANSACTION_NON_ZERO_DATA * 2;
    try testing.expectEqual(expected3, result3.cost);
    
    // With access list
    const result4 = Gas.transactionIntrinsicGas(&[_]u8{}, false, 2, 4);
    const expected4 = GasCosts.TRANSACTION + 2400 * 2 + 1900 * 4;
    try testing.expectEqual(expected4, result4.cost);
}

test "getStaticGasCost for various opcodes" {
    // STOP
    try testing.expectEqual(GasCosts.ZERO, getStaticGasCost(0x00));
    
    // ADD
    try testing.expectEqual(GasCosts.VERYLOW, getStaticGasCost(0x01));
    
    // MUL
    try testing.expectEqual(GasCosts.LOW, getStaticGasCost(0x02));
    
    // EXP (dynamic, returns 0)
    try testing.expectEqual(@as(u64, 0), getStaticGasCost(0x0a));
    
    // JUMPDEST
    try testing.expectEqual(GasCosts.JUMPDEST, getStaticGasCost(0x5b));
    
    // PUSH1
    try testing.expectEqual(GasCosts.VERYLOW, getStaticGasCost(0x60));
    
    // DUP1
    try testing.expectEqual(GasCosts.BASE, getStaticGasCost(0x80));
    
    // SWAP1
    try testing.expectEqual(GasCosts.BASE, getStaticGasCost(0x90));
}

test "Gas operations integration" {
    var gas = Gas.init(100000);
    
    // Simulate a complex operation
    
    // 1. Basic arithmetic
    try gas.consume(GasCosts.VERYLOW); // ADD
    try gas.consume(GasCosts.LOW); // MUL
    
    // 2. Memory expansion
    const mem_result = gas.memoryGasCost(0, 64);
    try gas.consume(mem_result.cost);
    gas.expandMemory(64);
    
    // 3. Storage operation
    const sstore_result = gas.sstoreGasCost(0, 0, 100, true);
    try gas.consume(sstore_result.cost);
    
    // 4. Call operation
    const call_result = gas.callGasCost(1000, false, true);
    try gas.consume(call_result.cost);
    
    // Verify gas usage
    const total_used = GasCosts.VERYLOW + GasCosts.LOW + mem_result.cost + 
                      sstore_result.cost + call_result.cost;
    try testing.expectEqual(total_used, gas.used);
    try testing.expectEqual(100000 - total_used, gas.remaining);
}