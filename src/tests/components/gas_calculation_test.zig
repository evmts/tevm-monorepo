//! Gas calculation tests for ZigEVM
//! This file contains tests for accurate gas calculation across different opcodes

const std = @import("std");
const testing = std.testing;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const types = @import("../../util/types.zig");
const U256 = types.U256;
const Address = types.Address;
const Opcode = @import("../../opcodes/opcodes.zig").Opcode;
const gas = @import("../../gas/index.zig");

/// Create a program that exercises various gas costs
fn createGasTestProgram() []const u8 {
    return &[_]u8{
        // Arithmetic operations (3 gas each for ADD, MUL)
        @intFromEnum(Opcode.PUSH1), 0x01,
        @intFromEnum(Opcode.PUSH1), 0x02,
        @intFromEnum(Opcode.ADD),
        @intFromEnum(Opcode.PUSH1), 0x03,
        @intFromEnum(Opcode.MUL),
        
        // Memory operations
        @intFromEnum(Opcode.PUSH1), 0xAA,
        @intFromEnum(Opcode.PUSH1), 0x00,
        @intFromEnum(Opcode.MSTORE),  // Memory expansion
        
        // Some more operations to test gas
        @intFromEnum(Opcode.PUSH1), 0x10,
        @intFromEnum(Opcode.PUSH1), 0x00,
        @intFromEnum(Opcode.MLOAD),
        
        // Stop execution
        @intFromEnum(Opcode.STOP),
    };
}

/// Create a program that tests memory expansion
fn createMemoryExpansionTest() []const u8 {
    return &[_]u8{
        // Store to offset 0
        @intFromEnum(Opcode.PUSH1), 0xAA,
        @intFromEnum(Opcode.PUSH1), 0x00,
        @intFromEnum(Opcode.MSTORE),
        
        // Store to offset 32 (second word)
        @intFromEnum(Opcode.PUSH1), 0xBB,
        @intFromEnum(Opcode.PUSH1), 0x20,
        @intFromEnum(Opcode.MSTORE),
        
        // Store to offset 1024 (large expansion)
        @intFromEnum(Opcode.PUSH1), 0xCC,
        @intFromEnum(Opcode.PUSH2), 0x04, 0x00, // 1024
        @intFromEnum(Opcode.MSTORE),
        
        // Stop execution
        @intFromEnum(Opcode.STOP),
    };
}

/// Create a program that tests LOG operations
fn createLogGasTest() []const u8 {
    return &[_]u8{
        // Store something in memory first
        @intFromEnum(Opcode.PUSH1), 0xAA,
        @intFromEnum(Opcode.PUSH1), 0x00,
        @intFromEnum(Opcode.MSTORE),
        
        // LOG0 (375 gas + data gas)
        @intFromEnum(Opcode.PUSH1), 0x20,
        @intFromEnum(Opcode.PUSH1), 0x00,
        @intFromEnum(Opcode.LOG0),
        
        // LOG1 (375 + 375 gas + data gas)
        @intFromEnum(Opcode.PUSH1), 0x01,
        @intFromEnum(Opcode.PUSH1), 0x20,
        @intFromEnum(Opcode.PUSH1), 0x00,
        @intFromEnum(Opcode.LOG1),
        
        // LOG4 (375 + 4*375 gas + data gas)
        @intFromEnum(Opcode.PUSH1), 0x04,
        @intFromEnum(Opcode.PUSH1), 0x03,
        @intFromEnum(Opcode.PUSH1), 0x02,
        @intFromEnum(Opcode.PUSH1), 0x01,
        @intFromEnum(Opcode.PUSH1), 0x20,
        @intFromEnum(Opcode.PUSH1), 0x00,
        @intFromEnum(Opcode.LOG4),
        
        // Stop execution
        @intFromEnum(Opcode.STOP),
    };
}

/// Create a program that tests EXP operation gas costs
fn createExpGasTest() []const u8 {
    return &[_]u8{
        // EXP with small exponent (5 + 8 gas)
        @intFromEnum(Opcode.PUSH1), 0x10, // exponent 16 (1 byte)
        @intFromEnum(Opcode.PUSH1), 0x02, // base 2
        @intFromEnum(Opcode.EXP),
        
        // EXP with large exponent (5 + 32*8 gas)
        @intFromEnum(Opcode.PUSH32), 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // exponent with MSB set
                         0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                         0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                         0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        @intFromEnum(Opcode.PUSH1), 0x02, // base 2
        @intFromEnum(Opcode.EXP),
        
        // Stop execution
        @intFromEnum(Opcode.STOP),
    };
}

/// Test general gas accounting
test "Basic gas accounting" {
    const code = createGasTestProgram();
    var interpreter = try Interpreter.init(std.testing.allocator, code, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Check successful execution and gas usage
    switch (result) {
        .Success => |success| {
            // Gas should be consumed by the operations
            try testing.expect(success.gas_used > 0);
            try testing.expect(success.gas_used < 100000);
            
            // We can check that the gas used is the expected amount
            // by calculating it manually based on our operations
            const expected_minimum = 3 + 3 + 3 + 3 + 3; // PUSH, PUSH, ADD, PUSH, MUL
            try testing.expect(success.gas_used >= expected_minimum);
        },
        else => {
            try testing.expect(false); // Unexpected result
        },
    }
}

/// Test gas accounting for memory expansion
test "Memory expansion gas" {
    const code = createMemoryExpansionTest();
    var interpreter = try Interpreter.init(std.testing.allocator, code, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Check successful execution and gas usage
    switch (result) {
        .Success => |success| {
            // This should use a significant amount of gas due to the large memory expansion
            try testing.expect(success.gas_used > 100);
            
            // The memory expansion to offset 1024 should incur quadratic costs
            const quad_cost = gas.memoryGas(1024 + 32); // 1024 + 32 bytes for the stored word
            try testing.expect(success.gas_used >= quad_cost);
        },
        else => {
            try testing.expect(false); // Unexpected result
        },
    }
}

/// Test gas accounting for LOG operations
test "LOG operations gas" {
    const code = createLogGasTest();
    var interpreter = try Interpreter.init(std.testing.allocator, code, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Check successful execution and gas usage
    switch (result) {
        .Success => |success| {
            // Calculate minimum expected gas:
            // LOG0: 375 + 32*8 = 631
            // LOG1: 375*2 + 32*8 = 1006
            // LOG4: 375*5 + 32*8 = 2131
            // Total minimum for LOG operations: 3768
            try testing.expect(success.gas_used > 3768);
        },
        else => {
            try testing.expect(false); // Unexpected result
        },
    }
}

/// Test gas accounting for EXP operations
test "EXP operation gas" {
    const code = createExpGasTest();
    var interpreter = try Interpreter.init(std.testing.allocator, code, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Check successful execution and gas usage
    switch (result) {
        .Success => |success| {
            // Small exponent: 5 + 8 gas
            // Large exponent: 5 + 32*8 = 261 gas
            // Total minimum for EXP operations: 5 + 8 + 5 + 32*8 = 274
            try testing.expect(success.gas_used > 274);
        },
        else => {
            try testing.expect(false); // Unexpected result
        },
    }
}

/// Test out of gas condition
test "Out of gas" {
    const code = createGasTestProgram();
    
    // Create an interpreter with a very small gas limit
    var interpreter = try Interpreter.init(std.testing.allocator, code, 5, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Should fail with OutOfGas
    switch (result) {
        .Error => |err| {
            try testing.expectEqual(types.Error.OutOfGas, err.error_type);
        },
        else => {
            try testing.expect(false); // Unexpected result
        },
    }
}

/// Test gas calculator
test "GasCalculator" {
    var calculator = gas.GasCalculator.init(1000);
    
    // Charge some gas
    try calculator.charge(100);
    try testing.expectEqual(@as(u64, 900), calculator.getGasLeft());
    
    // Add some refund
    calculator.refund(50);
    try testing.expectEqual(@as(u64, 50), calculator.getGasRefund());
    try testing.expectEqual(@as(u64, 900), calculator.getGasLeft());
    
    // Check out of gas
    try testing.expectError(types.Error.OutOfGas, calculator.charge(1000));
}

/// Test memory expansion gas calculation
test "Memory expansion gas calculation" {
    // No expansion
    try testing.expectEqual(@as(u64, 0), gas.memoryExpansionGas(100, 100));
    
    // Small expansion
    const small_expansion = gas.memoryExpansionGas(32, 64);
    try testing.expect(small_expansion > 0);
    
    // Large expansion
    const large_expansion = gas.memoryExpansionGas(32, 1024);
    try testing.expect(large_expansion > small_expansion);
}

/// Test static gas costs for operations
test "Static gas costs" {
    const gas_costs = gas.GasCosts{};
    
    // Test basic operation costs
    try testing.expect(gas_costs.very_low == 3); // ADD, SUB, etc.
    try testing.expect(gas_costs.low == 5);      // MUL, DIV, etc.
    try testing.expect(gas_costs.mid == 8);      // ADDMOD, MULMOD
    try testing.expect(gas_costs.high == 10);    // EXP base cost
    
    // Test storage operation costs
    try testing.expect(gas_costs.cold_sload == 2100);  // Cold storage access
    try testing.expect(gas_costs.warm_sload == 100);   // Warm storage access
    try testing.expect(gas_costs.sstore_set == 20000); // New slot
    
    // Test LOG costs
    try testing.expect(gas_costs.log == 375);          // Base cost
    try testing.expect(gas_costs.log_topic == 375);    // Per topic
    try testing.expect(gas_costs.log_data == 8);       // Per byte
}

/// Test dynamic gas calculations
test "Dynamic gas calculations" {
    // Test memory gas calculation
    try testing.expectEqual(@as(u64, 3), gas.memoryGas(32));  // 1 word: 3 gas
    try testing.expectEqual(@as(u64, 6), gas.memoryGas(64));  // 2 words: 6 gas
    
    // Test storage gas calculation with different scenarios
    var result = gas.storageGas(true, false, false, true); // Cold, 0->non-0
    try testing.expectEqual(@as(u64, 2100 + 20000), result.cost);
    try testing.expectEqual(@as(i64, 0), result.refund);
    
    result = gas.storageGas(false, true, true, false); // Warm, non-0->0
    try testing.expectEqual(@as(u64, 5000), result.cost);
    try testing.expectEqual(@as(i64, 15000), result.refund);
    
    // Test LOG gas calculation
    try testing.expectEqual(@as(u64, 375), gas.logGas(0, 0));  // LOG0, no data
    try testing.expectEqual(@as(u64, 375 + 375), gas.logGas(1, 0));  // LOG1, no data
    try testing.expectEqual(@as(u64, 375 + 32 * 8), gas.logGas(0, 32));  // LOG0, 32 bytes
}