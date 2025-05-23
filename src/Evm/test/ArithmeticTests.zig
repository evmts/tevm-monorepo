const std = @import("std");
const testing = std.testing;
const EvmTest = @import("EvmTestHelpers.zig").EvmTest;
const helpers = @import("EvmTestHelpers.zig");
const opcodes = @import("../opcodes.zig");
const interpreter = @import("../interpreter.zig");

const Opcode = opcodes.Opcode;

/// Test basic arithmetic operations
test "basic arithmetic operations" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: 1 + 2 = 3
    {
        const code = helpers.add(1, 2) ++ helpers.ret_top();
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Output is 32-byte number in big-endian, so the value 3 would be at the end
        try testing.expectEqual(@as(u8, 3), result.output.?[31]);
    }
    
    // Test: 5 - 3 = 2
    {
        const code = helpers.sub(5, 3) ++ helpers.ret_top();
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        try testing.expectEqual(@as(u8, 2), result.output.?[31]);
    }
    
    // Test: 7 * 6 = 42
    {
        const code = helpers.mul(7, 6) ++ helpers.ret_top();
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        try testing.expectEqual(@as(u8, 42), result.output.?[31]);
    }
    
    // Test: 8 / 2 = 4
    {
        const code = helpers.div(8, 2) ++ helpers.ret_top();
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        try testing.expectEqual(@as(u8, 4), result.output.?[31]);
    }
}

/// Test division by zero
test "division by zero" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: 5 / 0 = 0
    {
        const code = helpers.div(5, 0) ++ helpers.ret_top();
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Division by zero should return 0
        try testing.expectEqual(@as(u8, 0), result.output.?[31]);
    }
    
    // Test: 5 % 0 = 0
    {
        const code = helpers.mod(5, 0) ++ helpers.ret_top();
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // Modulo by zero should return 0
        try testing.expectEqual(@as(u8, 0), result.output.?[31]);
    }
}

/// Test addmod and mulmod operations
test "addmod and mulmod" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Test: (7 + 5) % 3 = 0
    {
        const code = helpers.addmod(7, 5, 3) ++ helpers.ret_top();
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        try testing.expectEqual(@as(u8, 0), result.output.?[31]);
    }
    
    // Test: (7 * 5) % 3 = 2
    {
        const code = helpers.mulmod(7, 5, 3) ++ helpers.ret_top();
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        try testing.expectEqual(@as(u8, 2), result.output.?[31]);
    }
    
    // Test: addmod with modulo 0 (should return 0)
    {
        const code = helpers.addmod(7, 5, 0) ++ helpers.ret_top();
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        try testing.expectEqual(@as(u8, 0), result.output.?[31]);
    }
}

/// Test signed division
test "signed division" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // In EVM, -1 is represented as 2^256 - 1
    const minus_one = u256.max;
    
    // Test: -1 / 2 = -0 (0)
    {
        const code = helpers.sdiv(minus_one, 2) ++ helpers.ret_top();
        try evm_test.execute(100, code, &[_]u8{});
        
        const result = evm_test.result.?;
        try testing.expectEqual(@as(?interpreter.InterpreterError, null), result.status);
        try testing.expectEqual(@as(u64, 32), result.output.?.len);
        
        // In EVM, -0 is just 0
        try testing.expectEqual(@as(u8, 0xFF), result.output.?[0]); // Should be all FFs for -1
        for (1..31) |i| {
            try testing.expectEqual(@as(u8, 0xFF), result.output.?[i]);
        }
    }
}

/// Test bitwise operations
test "bitwise operations" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Define bytecode for bitwise operations
    const and_code = helpers.push(0xF0) ++ helpers.push(0xFF) ++ &[_]u8{@intFromEnum(Opcode.AND)} ++ helpers.ret_top();
    const or_code = helpers.push(0xF0) ++ helpers.push(0x0F) ++ &[_]u8{@intFromEnum(Opcode.OR)} ++ helpers.ret_top();
    const xor_code = helpers.push(0xFF) ++ helpers.push(0x0F) ++ &[_]u8{@intFromEnum(Opcode.XOR)} ++ helpers.ret_top();
    const not_code = helpers.not(0x0F) ++ helpers.ret_top();
    
    // Test: 0xF0 & 0xFF = 0xF0
    try evm_test.execute(100, and_code, &[_]u8{});
    const and_result = evm_test.result.?;
    try testing.expectEqual(@as(?interpreter.InterpreterError, null), and_result.status);
    try testing.expectEqual(@as(u8, 0xF0), and_result.output.?[31]);
    
    // Test: 0xF0 | 0x0F = 0xFF
    try evm_test.execute(100, or_code, &[_]u8{});
    const or_result = evm_test.result.?;
    try testing.expectEqual(@as(?interpreter.InterpreterError, null), or_result.status);
    try testing.expectEqual(@as(u8, 0xFF), or_result.output.?[31]);
    
    // Test: 0xFF ^ 0x0F = 0xF0
    try evm_test.execute(100, xor_code, &[_]u8{});
    const xor_result = evm_test.result.?;
    try testing.expectEqual(@as(?interpreter.InterpreterError, null), xor_result.status);
    try testing.expectEqual(@as(u8, 0xF0), xor_result.output.?[31]);
    
    // Test: ~0x0F = 0xFFFFF...F0
    try evm_test.execute(100, not_code, &[_]u8{});
    const not_result = evm_test.result.?;
    try testing.expectEqual(@as(?interpreter.InterpreterError, null), not_result.status);
    for (0..31) |i| {
        try testing.expectEqual(@as(u8, 0xFF), not_result.output.?[i]);
    }
    try testing.expectEqual(@as(u8, 0xF0), not_result.output.?[31]);
}

/// Test comparison operations
test "comparison operations" {
    var evm_test = try EvmTest.init(testing.allocator);
    defer evm_test.deinit();
    
    // Define bytecode for comparison operations
    const eq_true_code = helpers.push(0x42) ++ helpers.push(0x42) ++ &[_]u8{@intFromEnum(Opcode.EQ)} ++ helpers.ret_top();
    const eq_false_code = helpers.push(0x42) ++ helpers.push(0x24) ++ &[_]u8{@intFromEnum(Opcode.EQ)} ++ helpers.ret_top();
    const lt_true_code = helpers.push(0x24) ++ helpers.push(0x42) ++ &[_]u8{@intFromEnum(Opcode.LT)} ++ helpers.ret_top();
    const lt_false_code = helpers.push(0x42) ++ helpers.push(0x24) ++ &[_]u8{@intFromEnum(Opcode.LT)} ++ helpers.ret_top();
    const gt_true_code = helpers.push(0x42) ++ helpers.push(0x24) ++ &[_]u8{@intFromEnum(Opcode.GT)} ++ helpers.ret_top();
    const gt_false_code = helpers.push(0x24) ++ helpers.push(0x42) ++ &[_]u8{@intFromEnum(Opcode.GT)} ++ helpers.ret_top();
    
    // Test: 0x42 == 0x42 => 1
    try evm_test.execute(100, eq_true_code, &[_]u8{});
    const eq_true_result = evm_test.result.?;
    try testing.expectEqual(@as(?interpreter.InterpreterError, null), eq_true_result.status);
    try testing.expectEqual(@as(u8, 1), eq_true_result.output.?[31]);
    
    // Test: 0x42 == 0x24 => 0
    try evm_test.execute(100, eq_false_code, &[_]u8{});
    const eq_false_result = evm_test.result.?;
    try testing.expectEqual(@as(?interpreter.InterpreterError, null), eq_false_result.status);
    try testing.expectEqual(@as(u8, 0), eq_false_result.output.?[31]);
    
    // Test: 0x24 < 0x42 => 1
    try evm_test.execute(100, lt_true_code, &[_]u8{});
    const lt_true_result = evm_test.result.?;
    try testing.expectEqual(@as(?interpreter.InterpreterError, null), lt_true_result.status);
    try testing.expectEqual(@as(u8, 1), lt_true_result.output.?[31]);
    
    // Test: 0x42 < 0x24 => 0
    try evm_test.execute(100, lt_false_code, &[_]u8{});
    const lt_false_result = evm_test.result.?;
    try testing.expectEqual(@as(?interpreter.InterpreterError, null), lt_false_result.status);
    try testing.expectEqual(@as(u8, 0), lt_false_result.output.?[31]);
    
    // Test: 0x42 > 0x24 => 1
    try evm_test.execute(100, gt_true_code, &[_]u8{});
    const gt_true_result = evm_test.result.?;
    try testing.expectEqual(@as(?interpreter.InterpreterError, null), gt_true_result.status);
    try testing.expectEqual(@as(u8, 1), gt_true_result.output.?[31]);
    
    // Test: 0x24 > 0x42 => 0
    try evm_test.execute(100, gt_false_code, &[_]u8{});
    const gt_false_result = evm_test.result.?;
    try testing.expectEqual(@as(?interpreter.InterpreterError, null), gt_false_result.status);
    try testing.expectEqual(@as(u8, 0), gt_false_result.output.?[31]);
}