const std = @import("std");
const testing = std.testing;
const mock = @import("Contract_mock.zig");
const Contract = mock.Contract;
const createContract = mock.createContract;
const createContractWithParent = mock.createContractWithParent;
const Address = mock.Address;
const U256 = mock.U256;
const bitvec = @import("bitvec.zig");
const opcodes = @import("opcodes.zig");

// Helper functions for creating test values
fn mockAddress(value: u8) Address {
    return Address{ 
        .value = value,
    };
}

fn mockU256(value: u64) U256 {
    return U256.fromU64(value);
}

// Test contract creation
test "Contract initialization" {
    const caller = mockAddress(1);
    const address = mockAddress(2);
    const value = mockU256(100);
    const gas: u64 = 1000000;
    
    var contract = createContract(caller, address, value, gas);
    
    try testing.expectEqual(gas, contract.gas);
    try testing.expectEqual(@as(usize, 0), contract.code.len);
    
    // Set contract code
    const code = [_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01, 0x5B, 0x00 }; // PUSH1 0x01, PUSH1 0x02, ADD, JUMPDEST, STOP
    const code_hash = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32 };
    contract.setCallCode(code_hash, &code);
    
    try testing.expectEqual(@as(usize, 7), contract.code.len);
    try testing.expectEqual(code_hash, contract.code_hash);
}

// Test getOp function
test "Contract getOp" {
    const caller = mockAddress(1);
    const address = mockAddress(2);
    const value = mockU256(100);
    const gas: u64 = 1000000;
    
    var contract = createContract(caller, address, value, gas);
    
    // Set contract code: PUSH1 0x01, PUSH1 0x02, ADD, JUMPDEST, STOP
    const code = [_]u8{ 0x60, 0x01, 0x60, 0x02, 0x01, 0x5B, 0x00 };
    const code_hash = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32 };
    contract.setCallCode(code_hash, &code);
    
    // Test valid opcodes
    try testing.expectEqual(@as(u8, 0x60), contract.getOp(0)); // PUSH1
    try testing.expectEqual(@as(u8, 0x01), contract.getOp(1)); // 0x01 (data)
    try testing.expectEqual(@as(u8, 0x60), contract.getOp(2)); // PUSH1
    try testing.expectEqual(@as(u8, 0x02), contract.getOp(3)); // 0x02 (data)
    try testing.expectEqual(@as(u8, 0x01), contract.getOp(4)); // ADD
    try testing.expectEqual(@as(u8, 0x5B), contract.getOp(5)); // JUMPDEST
    try testing.expectEqual(@as(u8, 0x00), contract.getOp(6)); // STOP
    
    // Test beyond code length
    try testing.expectEqual(@as(u8, 0x00), contract.getOp(7)); // Should return STOP
    try testing.expectEqual(@as(u8, 0x00), contract.getOp(100)); // Should return STOP
}

// Test gas management
test "Contract gas management" {
    const caller = mockAddress(1);
    const address = mockAddress(2);
    const value = mockU256(100);
    const gas: u64 = 1000000;
    
    var contract = createContract(caller, address, value, gas);
    
    // Use gas successfully
    try testing.expect(contract.useGas(500));
    try testing.expectEqual(@as(u64, 999500), contract.gas);
    
    // Refund gas
    contract.refundGas(300);
    try testing.expectEqual(@as(u64, 999800), contract.gas);
    
    // Try to use more gas than available
    try testing.expect(!contract.useGas(1000000));
    try testing.expectEqual(@as(u64, 999800), contract.gas); // Gas should remain unchanged
    
    // Zero gas refund should have no effect
    contract.refundGas(0);
    try testing.expectEqual(@as(u64, 999800), contract.gas);
}

// Test JUMPDEST validation
test "Contract validJumpdest" {
    const caller = mockAddress(1);
    const address = mockAddress(2);
    const value = mockU256(100);
    const gas: u64 = 1000000;
    
    var contract = createContract(caller, address, value, gas);
    
    // Set contract code: PUSH1 0x05, JUMPDEST, PUSH1 0x01, JUMPDEST, STOP
    const code = [_]u8{ 0x60, 0x05, 0x5B, 0x60, 0x01, 0x5B, 0x00 };
    const code_hash = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32 };
    contract.setCallCode(code_hash, &code);
    
    // Test valid JUMPDEST
    try testing.expect(contract.validJumpdest(U256.fromU64(2))); // JUMPDEST at position 2
    try testing.expect(contract.validJumpdest(U256.fromU64(5))); // JUMPDEST at position 5
    
    // Test invalid destinations
    try testing.expect(!contract.validJumpdest(U256.fromU64(0))); // PUSH1 is not a valid jump destination
    try testing.expect(!contract.validJumpdest(U256.fromU64(1))); // Data byte is not a valid jump destination
    try testing.expect(!contract.validJumpdest(U256.fromU64(3))); // PUSH1 is not a valid jump destination
    try testing.expect(!contract.validJumpdest(U256.fromU64(4))); // Data byte is not a valid jump destination
    try testing.expect(!contract.validJumpdest(U256.fromU64(6))); // STOP is not a valid jump destination
    try testing.expect(!contract.validJumpdest(U256.fromU64(100))); // Out of bounds
}

// Test parent contract jumpdests sharing
test "Contract jumpdests sharing" {
    const caller1 = mockAddress(1);
    const address1 = mockAddress(2);
    const value1 = mockU256(100);
    const gas1: u64 = 1000000;
    
    var parent_contract = createContract(caller1, address1, value1, gas1);
    
    // Set parent contract code
    const code1 = [_]u8{ 0x60, 0x05, 0x5B, 0x60, 0x01, 0x5B, 0x00 };
    const code_hash1 = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32 };
    parent_contract.setCallCode(code_hash1, &code1);
    
    // Create a child contract that shares jumpdests with parent
    const caller2 = mockAddress(3);
    const address2 = mockAddress(4);
    const value2 = mockU256(200);
    const gas2: u64 = 2000000;
    
    var child_contract = createContractWithParent(caller2, address2, value2, gas2, &parent_contract);
    
    // Set child contract code (same as parent for simplicity)
    child_contract.setCallCode(code_hash1, &code1);
    
    // Test that both validate jump destinations correctly
    try testing.expect(parent_contract.validJumpdest(U256.fromU64(2)));
    try testing.expect(parent_contract.validJumpdest(U256.fromU64(5)));
    try testing.expect(child_contract.validJumpdest(U256.fromU64(2)));
    try testing.expect(child_contract.validJumpdest(U256.fromU64(5)));
    
    // Ensure non-destinations are also correctly identified
    try testing.expect(!parent_contract.validJumpdest(U256.fromU64(1)));
    try testing.expect(!child_contract.validJumpdest(U256.fromU64(1)));
}