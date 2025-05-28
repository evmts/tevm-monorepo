const std = @import("std");
const testing = std.testing;
const Contract = @import("evm").Contract;
const constants = @import("evm").constants;

test "Contract: basic initialization" {
    const caller = [_]u8{0xaa} ** 20;
    const address = [_]u8{0xbb} ** 20;
    const value: u128 = 1000;
    const gas: u64 = 21000;
    const code = [_]u8{ constants.PUSH1, 0x01, constants.ADD, constants.STOP };
    const code_hash = [_]u8{0xcc} ** 32;
    const input = [_]u8{ 0x12, 0x34, 0x56, 0x78 };
    
    const contract = Contract.init(
        caller,
        address,
        value,
        gas,
        &code,
        code_hash,
        &input,
        false,
    );
    
    // Verify initialization
    try testing.expectEqual(address, contract.address);
    try testing.expectEqual(caller, contract.caller);
    try testing.expectEqual(value, contract.value);
    try testing.expectEqual(gas, contract.gas);
    try testing.expectEqualSlices(u8, &code, contract.code);
    try testing.expectEqual(code_hash, contract.code_hash);
    try testing.expectEqual(@as(u64, 4), contract.code_size);
    try testing.expectEqualSlices(u8, &input, contract.input);
    try testing.expectEqual(false, contract.is_static);
    try testing.expectEqual(true, contract.is_cold);
    try testing.expectEqual(@as(u64, 0), contract.gas_refund);
    try testing.expectEqual(false, contract.is_deployment);
    try testing.expectEqual(false, contract.is_system_call);
    try testing.expectEqual(false, contract.has_jumpdests); // No JUMPDEST in code
    try testing.expectEqual(false, contract.is_empty);
}

test "Contract: deployment initialization" {
    const caller = [_]u8{0xaa} ** 20;
    const value: u128 = 0;
    const gas: u64 = 100000;
    const deployment_code = [_]u8{
        // Constructor code
        constants.PUSH1, 0x60,
        constants.PUSH1, 0x40,
        constants.MSTORE,
        // Return runtime code
        constants.PUSH1, 0x04, // size
        constants.PUSH1, 0x0C, // offset
        constants.RETURN,
        // Runtime code
        constants.PUSH1, 0x42,
        constants.ADD,
        constants.STOP,
    };
    
    var contract = Contract.initDeployment(
        caller,
        value,
        gas,
        &deployment_code,
        null,
    );
    
    // Verify deployment initialization
    try testing.expectEqual(caller, contract.caller);
    try testing.expectEqual(value, contract.value);
    try testing.expectEqual(gas, contract.gas);
    try testing.expectEqualSlices(u8, &deployment_code, contract.code);
    try testing.expectEqual(@as(u64, deployment_code.len), contract.code_size);
    try testing.expectEqual(true, contract.is_deployment);
    try testing.expectEqual(false, contract.is_cold); // Deployment is always warm
    try testing.expectEqual(false, contract.is_static);
}

test "Contract: gas operations" {
    var contract = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        10000,
        &[_]u8{},
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    
    // Test useGas
    try testing.expect(contract.useGas(100));
    try testing.expectEqual(@as(u64, 9900), contract.gas);
    
    // Test useGas failure
    try testing.expect(!contract.useGas(10000));
    try testing.expectEqual(@as(u64, 9900), contract.gas); // Gas unchanged
    
    // Test useGasUnchecked
    contract.useGasUnchecked(900);
    try testing.expectEqual(@as(u64, 9000), contract.gas);
    
    // Test refundGas
    contract.refundGas(500);
    try testing.expectEqual(@as(u64, 9500), contract.gas);
    
    // Test gas refund counter
    contract.addGasRefund(1000);
    try testing.expectEqual(@as(u64, 1000), contract.gas_refund);
    
    // Test gas refund clamping (max is gas/5)
    contract.addGasRefund(5000);
    try testing.expectEqual(@as(u64, 1900), contract.gas_refund); // 9500/5 = 1900
    
    // Test subGasRefund
    contract.subGasRefund(500);
    try testing.expectEqual(@as(u64, 1400), contract.gas_refund);
    
    // Test subGasRefund with underflow protection
    contract.subGasRefund(2000);
    try testing.expectEqual(@as(u64, 0), contract.gas_refund);
}

test "Contract: JUMPDEST detection" {
    // Code with JUMPDEST
    const code_with_jumpdest = [_]u8{
        constants.PUSH1, 0x04,
        constants.JUMP,
        constants.STOP,
        constants.JUMPDEST,
        constants.ADD,
    };
    
    const contract1 = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        21000,
        &code_with_jumpdest,
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    
    try testing.expectEqual(true, contract1.has_jumpdests);
    
    // Code without JUMPDEST
    const code_without_jumpdest = [_]u8{
        constants.PUSH1, 0x01,
        constants.ADD,
        constants.STOP,
    };
    
    const contract2 = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        21000,
        &code_without_jumpdest,
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    
    try testing.expectEqual(false, contract2.has_jumpdests);
}

test "Contract: validJumpdest basic" {
    const allocator = testing.allocator;
    
    // Code with valid JUMPDEST
    const code = [_]u8{
        constants.PUSH1, 0x04,
        constants.JUMP,
        constants.STOP,
        constants.JUMPDEST, // Position 4
        constants.ADD,
        constants.JUMPDEST, // Position 6
        constants.STOP,
    };
    
    var contract = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        21000,
        &code,
        [_]u8{0x12} ** 32,
        &[_]u8{},
        false,
    );
    
    // Valid JUMPDEST at position 4
    try testing.expect(contract.validJumpdest(4));
    
    // Valid JUMPDEST at position 6
    try testing.expect(contract.validJumpdest(6));
    
    // Invalid positions
    try testing.expect(!contract.validJumpdest(0)); // PUSH1
    try testing.expect(!contract.validJumpdest(1)); // PUSH data
    try testing.expect(!contract.validJumpdest(2)); // JUMP
    try testing.expect(!contract.validJumpdest(3)); // STOP
    try testing.expect(!contract.validJumpdest(5)); // ADD
    
    // Out of bounds
    try testing.expect(!contract.validJumpdest(100));
}

test "Contract: validJumpdest with JUMPDEST in PUSH data" {
    // JUMPDEST byte (0x5B) appearing in PUSH data should not be valid
    const code = [_]u8{
        constants.PUSH2, constants.JUMPDEST, constants.JUMPDEST, // 0x5B5B in data
        constants.JUMPDEST, // Real JUMPDEST at position 3
        constants.STOP,
    };
    
    var contract = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        21000,
        &code,
        [_]u8{0x34} ** 32,
        &[_]u8{},
        false,
    );
    
    // JUMPDEST bytes in PUSH data should not be valid
    try testing.expect(!contract.validJumpdest(1));
    try testing.expect(!contract.validJumpdest(2));
    
    // Real JUMPDEST should be valid
    try testing.expect(contract.validJumpdest(3));
}

test "Contract: validJumpdest fast paths" {
    // Empty contract
    var empty_contract = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        21000,
        &[_]u8{},
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    
    try testing.expect(!empty_contract.validJumpdest(0));
    try testing.expect(!empty_contract.validJumpdest(10));
    
    // Contract with no JUMPDESTs
    const no_jumpdest_code = [_]u8{
        constants.PUSH1, 0x01,
        constants.ADD,
        constants.STOP,
    };
    
    var no_jumpdest_contract = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        21000,
        &no_jumpdest_code,
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    
    try testing.expect(!no_jumpdest_contract.validJumpdest(0));
    try testing.expect(!no_jumpdest_contract.validJumpdest(3));
}

test "Contract: getOp operations" {
    const code = [_]u8{
        constants.PUSH1, 0x42,
        constants.ADD,
        constants.STOP,
    };
    
    const contract = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        21000,
        &code,
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    
    // Test getOp with bounds checking
    try testing.expectEqual(constants.PUSH1, contract.getOp(0));
    try testing.expectEqual(@as(u8, 0x42), contract.getOp(1));
    try testing.expectEqual(constants.ADD, contract.getOp(2));
    try testing.expectEqual(constants.STOP, contract.getOp(3));
    
    // Out of bounds returns STOP
    try testing.expectEqual(constants.STOP, contract.getOp(4));
    try testing.expectEqual(constants.STOP, contract.getOp(100));
    
    // Test getOpUnchecked (no bounds checking)
    try testing.expectEqual(constants.PUSH1, contract.getOpUnchecked(0));
    try testing.expectEqual(@as(u8, 0x42), contract.getOpUnchecked(1));
}

test "Contract: accessor methods" {
    const caller = [_]u8{0xca} ** 20;
    const address = [_]u8{0xad} ** 20;
    const value: u128 = 12345;
    const gas: u64 = 50000;
    const input = [_]u8{ 0xab, 0xcd, 0xef };
    
    const contract = Contract.init(
        caller,
        address,
        value,
        gas,
        &[_]u8{ constants.STOP },
        [_]u8{0} ** 32,
        &input,
        true, // is_static
    );
    
    // Test all getter methods
    try testing.expectEqual(caller, contract.getCaller());
    try testing.expectEqual(address, contract.getAddress());
    try testing.expectEqual(value, contract.getValue());
    try testing.expectEqual(gas, contract.getGas());
    try testing.expectEqual(@as(u64, 0), contract.getGasRefund());
    try testing.expectEqual(@as(u64, 1), contract.getCodeSize());
    try testing.expectEqualSlices(u8, &input, contract.getInput());
    try testing.expectEqual(true, contract.isStatic());
    try testing.expectEqual(false, contract.isDeployment());
}

test "Contract: setCallCode" {
    var contract = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        21000,
        &[_]u8{},
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    
    // Initially empty
    try testing.expectEqual(@as(u64, 0), contract.code_size);
    try testing.expectEqual(true, contract.is_empty);
    try testing.expectEqual(false, contract.has_jumpdests);
    
    // Set new code
    const new_code = [_]u8{
        constants.JUMPDEST,
        constants.PUSH1, 0x00,
        constants.RETURN,
    };
    const new_hash = [_]u8{0xde} ** 32;
    
    contract.setCallCode(new_hash, &new_code);
    
    // Verify update
    try testing.expectEqualSlices(u8, &new_code, contract.code);
    try testing.expectEqual(new_hash, contract.code_hash);
    try testing.expectEqual(@as(u64, 4), contract.code_size);
    try testing.expectEqual(false, contract.is_empty);
    try testing.expectEqual(true, contract.has_jumpdests);
    try testing.expectEqual(@as(?*const Contract.CodeAnalysis, null), contract.analysis); // Reset
}

test "Contract: storage access tracking" {
    const allocator = testing.allocator;
    
    var contract = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        21000,
        &[_]u8{},
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    defer contract.deinit(null);
    
    // Initially all slots are cold
    try testing.expect(contract.isStorageSlotCold(0));
    try testing.expect(contract.isStorageSlotCold(42));
    try testing.expect(contract.isStorageSlotCold(1000));
    
    // Mark slot as warm
    const was_cold = try contract.markStorageSlotWarm(42, null);
    try testing.expect(was_cold);
    try testing.expect(!contract.isStorageSlotCold(42));
    
    // Marking again should return false (already warm)
    const was_cold2 = try contract.markStorageSlotWarm(42, null);
    try testing.expect(!was_cold2);
    
    // Other slots still cold
    try testing.expect(contract.isStorageSlotCold(0));
    try testing.expect(contract.isStorageSlotCold(1000));
    
    // Batch mark slots
    const slots = [_]u128{ 100, 200, 300 };
    try contract.markStorageSlotsWarm(&slots, null);
    
    try testing.expect(!contract.isStorageSlotCold(100));
    try testing.expect(!contract.isStorageSlotCold(200));
    try testing.expect(!contract.isStorageSlotCold(300));
}

test "Contract: original storage tracking" {
    const allocator = testing.allocator;
    
    var contract = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        21000,
        &[_]u8{},
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    defer contract.deinit(null);
    
    // Initially no original values
    try testing.expectEqual(@as(?u128, null), contract.getOriginalStorageValue(42));
    
    // Set original value
    try contract.setOriginalStorageValue(42, 1234, null);
    try testing.expectEqual(@as(?u128, 1234), contract.getOriginalStorageValue(42));
    
    // Set another value
    try contract.setOriginalStorageValue(100, 5678, null);
    try testing.expectEqual(@as(?u128, 5678), contract.getOriginalStorageValue(100));
    
    // First value still there
    try testing.expectEqual(@as(?u128, 1234), contract.getOriginalStorageValue(42));
    
    // Unset slot returns null
    try testing.expectEqual(@as(?u128, null), contract.getOriginalStorageValue(999));
}

test "Contract: StoragePool" {
    const allocator = testing.allocator;
    
    var pool = Contract.StoragePool.init(allocator);
    defer pool.deinit();
    
    // Test borrowing and returning access maps
    {
        const map1 = try pool.borrowAccessMap();
        const map2 = try pool.borrowAccessMap();
        
        // Maps should be different
        try testing.expect(map1 != map2);
        
        // Use the maps
        try map1.put(42, true);
        try map2.put(100, true);
        
        // Return maps to pool
        pool.returnAccessMap(map1);
        pool.returnAccessMap(map2);
        
        // Borrow again should reuse
        const map3 = try pool.borrowAccessMap();
        try testing.expect(map3 == map2 or map3 == map1); // Should be one of the returned maps
        try testing.expectEqual(@as(usize, 0), map3.count()); // Should be cleared
    }
    
    // Test with storage maps
    {
        const map1 = try pool.borrowStorageMap();
        try map1.put(10, 20);
        
        pool.returnStorageMap(map1);
        
        const map2 = try pool.borrowStorageMap();
        try testing.expect(map2 == map1); // Should reuse
        try testing.expectEqual(@as(usize, 0), map2.count()); // Should be cleared
    }
}

test "Contract: storage tracking with pool" {
    const allocator = testing.allocator;
    
    var pool = Contract.StoragePool.init(allocator);
    defer pool.deinit();
    
    var contract = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        21000,
        &[_]u8{},
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    defer contract.deinit(&pool);
    
    // Use pool for storage tracking
    const was_cold = try contract.markStorageSlotWarm(42, &pool);
    try testing.expect(was_cold);
    
    try contract.setOriginalStorageValue(42, 1234, &pool);
    try testing.expectEqual(@as(?u128, 1234), contract.getOriginalStorageValue(42));
    
    // Verify maps are returned to pool after deinit
    // (This is tested implicitly by the defer statements)
}

test "Contract: complex bytecode analysis" {
    // Complex bytecode with multiple JUMPDESTs and PUSH operations
    const code = [_]u8{
        constants.PUSH1, 0x08,      // 0-1: Push jump target
        constants.DUP1,             // 2: Duplicate
        constants.JUMPDEST,         // 3: First jumpdest
        constants.PUSH2, 0x5B, 0x5B,// 4-6: PUSH with JUMPDEST bytes in data
        constants.POP,              // 7: Pop
        constants.JUMPDEST,         // 8: Second jumpdest
        constants.PUSH1, 0x0C,      // 9-10: Push another target
        constants.JUMP,             // 11: Jump
        constants.JUMPDEST,         // 12: Third jumpdest
        constants.STOP,             // 13: Stop
    };
    
    var contract = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        21000,
        &code,
        [_]u8{0xab} ** 32,
        &[_]u8{},
        false,
    );
    
    // Test valid JUMPDESTs
    try testing.expect(contract.validJumpdest(3));  // First JUMPDEST
    try testing.expect(contract.validJumpdest(8));  // Second JUMPDEST
    try testing.expect(contract.validJumpdest(12)); // Third JUMPDEST
    
    // Test invalid positions
    try testing.expect(!contract.validJumpdest(0));  // PUSH1
    try testing.expect(!contract.validJumpdest(1));  // Push data
    try testing.expect(!contract.validJumpdest(5));  // JUMPDEST byte in PUSH data
    try testing.expect(!contract.validJumpdest(6));  // JUMPDEST byte in PUSH data
    try testing.expect(!contract.validJumpdest(10)); // Push data
}

test "Contract: edge cases" {
    // Maximum gas refund
    var contract = Contract.init(
        [_]u8{0} ** 20,
        [_]u8{0} ** 20,
        0,
        50000,
        &[_]u8{},
        [_]u8{0} ** 32,
        &[_]u8{},
        false,
    );
    
    // Add massive refund
    contract.addGasRefund(100000);
    try testing.expectEqual(@as(u64, 10000), contract.gas_refund); // Clamped to gas/5
    
    // Zero gas edge case
    contract.gas = 0;
    contract.gas_refund = 0;
    contract.addGasRefund(100);
    try testing.expectEqual(@as(u64, 0), contract.gas_refund); // 0/5 = 0
}