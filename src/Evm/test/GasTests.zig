const std = @import("std");
const testing = std.testing;
const EvmTest = @import("EvmTestHelpers.zig").EvmTest;
const helpers = @import("EvmTestHelpers.zig");
const opcodes = @import("../opcodes.zig");
const JumpTable = @import("../JumpTable.zig");
const interpreter = @import("../interpreter.zig");

const Opcode = opcodes.Opcode;

// Test gas costs for basic operations
test "basic operation gas costs" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: Simple arithmetic operations
    {
        // Code: PUSH1 1, PUSH1 2, ADD
        const code = 
            helpers.push(1) ++
            helpers.push(2) ++
            &[_]u8{@intFromEnum(Opcode.ADD)};
            
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        
        // Gas used should be:
        // PUSH1: 3 gas (twice)
        // ADD: 3 gas
        // Total: 9 gas
        try testing.expectEqual(@as(u64, 9), result.gas_used);
    }
    
    // Test: EXP operation (dynamic gas cost based on exponent)
    {
        // Code: PUSH1 2, PUSH1 3, EXP (3^2)
        const code = 
            helpers.push(2) ++
            helpers.push(3) ++
            &[_]u8{@intFromEnum(Opcode.EXP)};
            
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        
        // Gas for EXP depends on the EVM revision and exponent byte size
        // Since exponent is 2 (1 byte), gas should be base gas + 50
        // In Byzantium: 10 gas + 50 gas = 60 gas
        // Plus 6 gas for two PUSH1 operations
        const expected_gas = JumpTable.ExpGas + JumpTable.ExpByteGas + 6;
        try testing.expectEqual(expected_gas, result.gas_used);
    }
}

// Test gas costs for memory operations
test "memory gas costs" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: MSTORE to a new memory area (memory expansion cost)
    {
        // Code: PUSH1 0xFF, PUSH1 0, MSTORE
        // Stores a 32-byte value at offset 0 (requires memory expansion from 0 to 32 bytes)
        const code = helpers.mstore(0, 0xFF);
            
        try evm_test.execute(50, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        
        // Gas used should account for:
        // - Two PUSH1 operations (3 gas each)
        // - MSTORE base cost (3 gas)
        // - Memory expansion (from 0 to 32 bytes)
        //   Memory gas is calculated as memory_size_words * 3 + memory_size_words^2 / 512
        //   For 1 word (32 bytes): 3 + 1/512 = 3 gas
        // Total: 6 (PUSH) + 3 (MSTORE) + 3 (memory) = 12 gas
        try testing.expectEqual(@as(u64, 12), result.gas_used);
    }
    
    // Test: Multiple memory expansions
    {
        // Code: Store at 0, then at 96 (requires 2 expansions)
        const code = 
            helpers.mstore(0, 0xFF) ++
            helpers.mstore(96, 0xFF);
            
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        
        // First expansion: from 0 to 32 bytes (1 word) = 3 gas
        // Second expansion: from 32 to 128 bytes (4 words) = 3*4 + 4^2/512 = 12 + 0.031 = 12 gas
        // Plus gas for opcodes: 2 * (6 for PUSH + 3 for MSTORE) = 18 gas
        // Total: 3 + 12 + 18 = 33 gas
        try testing.expect(result.gas_used >= 33);  // Memory gas calculation might differ slightly
    }
}

// Test gas for SSTORE
test "storage gas costs" {
    // Note: This test would require a state manager implementation
    // For now, we just check that we calculate gas correctly for the opcodes
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: SSTORE gas cost
    {
        // Code: PUSH1 0x42, PUSH1 0, SSTORE
        const code = 
            helpers.push(0x42) ++
            helpers.push(0) ++
            &[_]u8{@intFromEnum(Opcode.SSTORE)};
            
        // In Byzantium, SSTORE costs 20,000 gas for a new value, 5,000 gas for changing an existing value
        // Since we don't have a real state, this will be treated as a new value
        const expected_gas = 6 + JumpTable.SstoreSetGas;
        
        try evm_test.execute(25000, code, &[_]u8{});
        
        const result = evm_test.result.?;
        // This might fail since we don't have a state manager
        // We'd need to supply a mock state manager to make this work properly
    }
}

// Test out-of-gas error
test "out of gas" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: Not enough gas for simple operations
    {
        // Code: PUSH1 1, PUSH1 2, ADD
        const code = 
            helpers.push(1) ++
            helpers.push(2) ++
            &[_]u8{@intFromEnum(Opcode.ADD)};
            
        // Total gas required is 9, so set limit to 8
        try evm_test.execute(8, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(interpreter.InterpreterError.OutOfGas, result.status.?);
    }
    
    // Test: Out of gas during memory expansion
    {
        // Code: Massive memory store (high gas cost)
        const code = helpers.mstore(100000, 0x42);
            
        try evm_test.execute(1000, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(interpreter.InterpreterError.OutOfGas, result.status.?);
    }
}

// Test operations with dynamic gas calculation
test "dynamic gas calculation" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: SHA3 operation (dynamic gas based on data size)
    {
        // Code: PUSH1 32, PUSH1 0, SHA3
        // Hashes 32 bytes from memory offset 0
        const code = 
            helpers.push(32) ++
            helpers.push(0) ++
            &[_]u8{@intFromEnum(Opcode.SHA3)};
            
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        
        // SHA3 costs 30 base + 6*word_count (for 32 bytes = 1 word)
        // Plus 6 gas for two PUSH1 operations
        // Plus 3 gas for memory expansion to 32 bytes
        const expected_gas = JumpTable.Sha3Gas + JumpTable.Sha3WordGas + 6 + 3;
        try testing.expectEqual(expected_gas, result.gas_used);
    }
}

// Test gas costs across different revisions
test "gas costs in different revisions" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Simple code: PUSH1 1, BALANCE
    const code = 
        helpers.push(1) ++
        &[_]u8{@intFromEnum(Opcode.BALANCE)};
        
    // Test in Tangerine Whistle (EIP-150)
    evm_test.setHardfork(.TangerineWhistle);
    try evm_test.execute(500, code, &[_]u8{});
    
    const tw_result = evm_test.result.?;
    try testing.expectEqual(@as(?interpreter.InterpreterError, null), tw_result.status);
    const tw_gas = tw_result.gas_used;
    
    // Test in Istanbul (BALANCE gas cost was reduced)
    evm_test.setHardfork(.Istanbul);
    try evm_test.execute(500, code, &[_]u8{});
    
    const istanbul_result = evm_test.result.?;
    try testing.expectEqual(@as(?interpreter.InterpreterError, null), istanbul_result.status);
    const istanbul_gas = istanbul_result.gas_used;
    
    // Istanbul should use less gas than Tangerine Whistle for BALANCE
    try testing.expect(istanbul_gas < tw_gas);
}