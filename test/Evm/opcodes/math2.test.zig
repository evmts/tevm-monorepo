const std = @import("std");
const testing = std.testing;
const test_utils = @import("test_utils.zig");
const evm = @import("evm");

// Import math2 functions from the EVM package
const math2 = evm.opcodes.math2;
const opAddmod = math2.opAddmod;
const opMulmod = math2.opMulmod;
const opExp = math2.opExp;
const opSignextend = math2.opSignextend;
const opMod = math2.opMod;
const opSdiv = math2.opSdiv;
const opSmod = math2.opSmod;
const expDynamicGas = math2.expDynamicGas;
const registerMath2Opcodes = math2.registerMath2Opcodes;

// Test utilities
const TestInterpreter = test_utils.Interpreter;
const TestFrame = test_utils.Frame;
const TestExecutionError = test_utils.ExecutionError;
const JumpTableTest = test_utils.JumpTable;
const TestStack = test_utils.Stack;
const TestMemory = test_utils.Memory;
const Operation = evm.jumpTable.Operation;

// Helper function to run opcode tests
fn runOpcodeTest(opcode: anytype, input: []const u256, expected: []const u256) !void {
    const allocator = testing.allocator;
    
    // Create test environment
    var interpreter = TestInterpreter{
        .allocator = allocator,
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .evm = undefined,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    var stack = TestStack{};
    var memory = TestMemory.init(allocator, null) catch unreachable;
    defer memory.deinit();
    
    var frame = TestFrame{
        .stack = &stack,
        .memory = &memory,
        .contract = undefined,
        .return_data = null,
        .gas = 1000000,
    };
    
    // Push input values onto stack
    for (input) |value| {
        try stack.push(value);
    }
    
    // Execute the opcode
    _ = try opcode(0, &interpreter, &frame);
    
    // Check expected output
    for (expected) |expected_value| {
        const actual = try stack.pop();
        try testing.expectEqual(expected_value, actual);
    }
    
    // Stack should be empty after consuming all expected values
    try testing.expectEqual(@as(usize, 0), stack.size);
}

test "ADDMOD with non-zero modulus" {
    const input = [_]u256{ 7, 5, 3 }; // 7 + 5 mod 3
    const expected = [_]u256{0}; // (7 + 5) % 3 = 12 % 3 = 0
    try runOpcodeTest(opAddmod, input, expected);
}

test "ADDMOD with zero modulus" {
    const input = [_]u256{ 7, 5, 0 }; // 7 + 5 mod 0
    const expected = [_]u256{0}; // Modulo by zero returns 0
    try runOpcodeTest(opAddmod, input, expected);
}

test "ADDMOD with large numbers" {
    const input = [_]u256{ 
        0xffffffffffffffff, // max u64 value
        2, 
        10 
    };
    const expected = [_]u256{1}; // (max_u64 + 2) % 10 = 1
    try runOpcodeTest(opAddmod, input, expected);
}

test "MULMOD with non-zero modulus" {
    const input = [_]u256{ 7, 5, 3 }; // 7 * 5 mod 3
    const expected = [_]u256{2}; // (7 * 5) % 3 = 35 % 3 = 2
    try runOpcodeTest(opMulmod, input, expected);
}

test "MULMOD with zero modulus" {
    const input = [_]u256{ 7, 5, 0 }; // 7 * 5 mod 0
    const expected = [_]u256{0}; // Modulo by zero returns 0
    try runOpcodeTest(opMulmod, input, expected);
}

test "EXP with zero exponent" {
    const input = [_]u256{ 5, 0 }; // 5^0
    const expected = [_]u256{1}; // Any number to the power of 0 is 1
    try runOpcodeTest(opExp, &input, &expected);
}

test "EXP with zero base" {
    const input = [_]u256{ 0, 5 }; // 0^5
    const expected = [_]u256{0}; // 0 to any positive power is 0
    try runOpcodeTest(opExp, &input, &expected);
}

test "EXP with small exponent" {
    const input = [_]u256{ 2, 3 }; // 2^3
    const expected = [_]u256{8}; // 2^3 = 8
    try runOpcodeTest(opExp, &input, &expected);
}

test "EXP with large exponent" {
    const input = [_]u256{ 2, 10 }; // 2^10
    const expected = [_]u256{1024}; // 2^10 = 1024
    try runOpcodeTest(opExp, &input, &expected);
}

test "SIGNEXTEND with byte position 0" {
    // Test extending a negative number (0xFF = -1 in 8-bit signed)
    const input = [_]u256{ 0xFF, 0 }; // Extend 0xFF from byte 0
    const expected = [_]u256{0xFFFFFFFFFFFFFFFF}; // Sign bit is 1, extend with 1s (for u64)
    try runOpcodeTest(opSignextend, &input, &expected);
}

test "SIGNEXTEND with byte position 0 for positive number" {
    // Test extending a positive number (0x7F = 127 in 8-bit signed)
    const input = [_]u256{ 0x7F, 0 }; // Extend 0x7F from byte 0
    const expected = [_]u256{0x7F}; // Sign bit is 0, extend with 0s
    try runOpcodeTest(opSignextend, &input, &expected);
}

test "SIGNEXTEND with large byte position" {
    // Test with byte position >= 32 (no extension)
    const input = [_]u256{ 0xFF, 32 }; // Extend 0xFF from byte 32
    const expected = [_]u256{0xFF}; // No change, byte position >= 32
    try runOpcodeTest(opSignextend, &input, &expected);
}

test "MOD with non-zero modulus" {
    const input = [_]u256{ 17, 5 }; // 17 % 5
    const expected = [_]u256{2}; // 17 % 5 = 2
    try runOpcodeTest(opMod, &input, &expected);
}

test "MOD with zero modulus" {
    const input = [_]u256{ 17, 0 }; // 17 % 0
    const expected = [_]u256{0}; // Modulo by zero returns 0
    try runOpcodeTest(opMod, &input, &expected);
}

test "SDIV with positive numbers" {
    const input = [_]u256{ 10, 3 }; // 10 / 3
    const expected = [_]u256{3}; // 10 / 3 = 3 (integer division)
    try runOpcodeTest(opSdiv, &input, &expected);
}

test "SDIV with zero divisor" {
    const input = [_]u256{ 0, 10 }; // 10 / 0
    const expected = [_]u256{0}; // Division by zero returns 0
    try runOpcodeTest(opSdiv, &input, &expected);
}

test "SMOD with positive numbers" {
    const input = [_]u256{ 5, 17 }; // 17 % 5
    const expected = [_]u256{2}; // 17 % 5 = 2
    try runOpcodeTest(opSmod, &input, &expected);
}

test "SMOD with zero modulus" {
    const input = [_]u256{ 0, 17 }; // 17 % 0
    const expected = [_]u256{0}; // Modulo by zero returns 0
    try runOpcodeTest(opSmod, &input, &expected);
}

test "SDIV with negative dividend" {
    // Test -10 / 3 = -3 (rounded towards zero)
    const neg_10 = (~@as(u256, 10)) +% 1; // Two's complement for -10
    const input = [_]u256{ 3, neg_10 };
    const neg_3 = (~@as(u256, 3)) +% 1; // Two's complement for -3
    const expected = [_]u256{neg_3};
    try runOpcodeTest(opSdiv, &input, &expected);
}

test "SDIV with negative divisor" {
    // Test 10 / -3 = -3 (rounded towards zero)
    const neg_3 = (~@as(u256, 3)) +% 1; // Two's complement for -3
    const input = [_]u256{ neg_3, 10 };
    const expected = [_]u256{neg_3};
    try runOpcodeTest(opSdiv, &input, &expected);
}

test "SDIV with both negative" {
    // Test -10 / -3 = 3
    const neg_10 = (~@as(u256, 10)) +% 1;
    const neg_3 = (~@as(u256, 3)) +% 1;
    const input = [_]u256{ neg_3, neg_10 };
    const expected = [_]u256{3};
    try runOpcodeTest(opSdiv, &input, &expected);
}

test "SDIV with extreme values" {
    // Test MIN_INT / -1 (special case that would overflow in signed arithmetic)
    const min_int = @as(u256, 1) << 255; // -2^255 in two's complement
    const neg_1 = (~@as(u256, 0)) +% 0; // -1 in two's complement
    const input = [_]u256{ neg_1, min_int };
    const expected = [_]u256{min_int}; // Result is MIN_INT (overflow wraps)
    try runOpcodeTest(opSdiv, &input, &expected);
}

test "SMOD with negative value" {
    // Test -17 % 5 = -2
    const neg_17 = (~@as(u256, 17)) +% 1;
    const input = [_]u256{ 5, neg_17 };
    const neg_2 = (~@as(u256, 2)) +% 1;
    const expected = [_]u256{neg_2};
    try runOpcodeTest(opSmod, &input, &expected);
}

test "SMOD with negative modulus" {
    // Test 17 % -5 = 2 (result takes sign of dividend)
    const neg_5 = (~@as(u256, 5)) +% 1;
    const input = [_]u256{ neg_5, 17 };
    const expected = [_]u256{2};
    try runOpcodeTest(opSmod, &input, &expected);
}

test "SMOD with both negative" {
    // Test -17 % -5 = -2 (result takes sign of dividend)
    const neg_17 = (~@as(u256, 17)) +% 1;
    const neg_5 = (~@as(u256, 5)) +% 1;
    const input = [_]u256{ neg_5, neg_17 };
    const neg_2 = (~@as(u256, 2)) +% 1;
    const expected = [_]u256{neg_2};
    try runOpcodeTest(opSmod, &input, &expected);
}

test "ADDMOD with overflow" {
    // Test maximum u256 values that would overflow
    const max_u256 = std.math.maxInt(u256);
    const input = [_]u256{ max_u256, max_u256, 10 };
    const expected = [_]u256{8}; // (max + max) % 10 = 8 (with overflow)
    try runOpcodeTest(opAddmod, &input, &expected);
}

test "MULMOD with overflow" {
    // Test multiplication that would overflow
    const large_val = std.math.maxInt(u256) / 2;
    const input = [_]u256{ large_val, 3, 7 };
    const expected = [_]u256{1}; // (large * 3) % 7 with overflow
    try runOpcodeTest(opMulmod, &input, &expected);
}

test "EXP gas calculation" {
    const allocator = testing.allocator;
    
    // Create minimal test environment
    var interpreter = TestInterpreter{
        .allocator = allocator,
        .pc = 0,
        .gas = 1000000,
        .gas_refund = 0,
        .valid_jump_destinations = std.AutoHashMap(u24, void).init(allocator),
        .evm = undefined,
    };
    defer interpreter.valid_jump_destinations.deinit();
    
    var stack = TestStack{};
    var memory = TestMemory.init(allocator, null) catch unreachable;
    defer memory.deinit();
    
    // Test with zero exponent (should cost minimum 10 gas)
    try stack.push(0); // exponent
    try stack.push(5); // base
    const gas1 = try expDynamicGas(&interpreter, undefined, &stack, &memory, 0);
    try testing.expectEqual(@as(u64, 10), gas1);
    _ = try stack.pop();
    _ = try stack.pop();
    
    // Test with 1-byte exponent (should cost 10 + 50*1 = 60 gas)
    try stack.push(0xFF); // exponent (1 byte)
    try stack.push(5); // base
    const gas2 = try expDynamicGas(&interpreter, undefined, &stack, &memory, 0);
    try testing.expectEqual(@as(u64, 60), gas2);
    _ = try stack.pop();
    _ = try stack.pop();
    
    // Test with 2-byte exponent (should cost 10 + 50*2 = 110 gas)
    try stack.push(0xFFFF); // exponent (2 bytes)
    try stack.push(5); // base
    const gas3 = try expDynamicGas(&interpreter, undefined, &stack, &memory, 0);
    try testing.expectEqual(@as(u64, 110), gas3);
}

test "SIGNEXTEND edge cases" {
    // Test with byte position 1 (16-bit extension)
    const input1 = [_]u256{ 0x8000, 1 }; // Negative in 16-bit
    const expected1 = [_]u256{0xFFFFFFFFFFFF8000}; // Extended with 1s
    try runOpcodeTest(opSignextend, &input1, &expected1);
    
    // Test with byte position 2 (24-bit extension)
    const input2 = [_]u256{ 0x7FFFFF, 2 }; // Positive in 24-bit
    const expected2 = [_]u256{0x7FFFFF}; // No extension needed
    try runOpcodeTest(opSignextend, &input2, &expected2);
    
    // Test with byte position 31 (full 256-bit, no extension)
    const input3 = [_]u256{ 0xFFFFFFFFFFFFFFFF, 31 };
    const expected3 = [_]u256{0xFFFFFFFFFFFFFFFF};
    try runOpcodeTest(opSignextend, &input3, &expected3);
}

test "EXP with pattern testing" {
    // Test 2^32
    const input1 = [_]u256{ 2, 32 };
    const expected1 = [_]u256{4294967296}; // 2^32
    try runOpcodeTest(opExp, &input1, &expected1);
    
    // Test 3^3
    const input2 = [_]u256{ 3, 3 };
    const expected2 = [_]u256{27}; // 3^3 = 27
    try runOpcodeTest(opExp, &input2, &expected2);
    
    // Test 10^6
    const input3 = [_]u256{ 10, 6 };
    const expected3 = [_]u256{1000000}; // 10^6 = 1,000,000
    try runOpcodeTest(opExp, &input3, &expected3);
}

test "registerMath2Opcodes" {
    const allocator = testing.allocator;
    
    // Create a mock jump table
    const MockJumpTable = struct {
        table: [256]?*Operation,
    };
    
    var jump_table = MockJumpTable{
        .table = undefined,
    };
    
    // Initialize all entries to null
    for (&jump_table.table) |*entry| {
        entry.* = null;
    }
    
    // Register math2 opcodes
    try registerMath2Opcodes(allocator, &jump_table);
    
    // Verify opcodes were registered
    const math2_opcodes = [_]struct { opcode: u8, name: []const u8 }{
        .{ .opcode = 0x05, .name = "SDIV" },
        .{ .opcode = 0x07, .name = "SMOD" },
        .{ .opcode = 0x08, .name = "ADDMOD" },
        .{ .opcode = 0x09, .name = "MULMOD" },
        .{ .opcode = 0x0A, .name = "EXP" },
        .{ .opcode = 0x0B, .name = "SIGNEXTEND" },
        .{ .opcode = 0x06, .name = "MOD" },
    };
    
    for (math2_opcodes) |op_info| {
        const operation = jump_table.table[op_info.opcode];
        try testing.expect(operation != null);
        try testing.expectEqualStrings(op_info.name, operation.?.name);
    }
    
    // Clean up allocated operations
    for (jump_table.table) |maybe_op| {
        if (maybe_op) |op| {
            allocator.destroy(op);
        }
    }
}