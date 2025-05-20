const std = @import("std");
const testing = std.testing;
const test_utils = @import("test_utils.zig");
const math2 = @import("math2.zig");
// Import everything via test_utils
const Frame = test_utils.Frame;
const ExecutionError = test_utils.ExecutionError;
const Interpreter = test_utils.Interpreter;
const Evm = test_utils.Evm;
const Contract = test_utils.Contract;
const Memory = test_utils.Memory;
const Address = test_utils.Address;

// Define the u256 type from math2
const @"u256" = math2.@"u256";

// Helper function to create a negative u256 number using two's complement
fn makeNegative(value: @"u256") @"u256" {
    return (~value) +% 1;
}

// Helper for running opcode tests
fn runOpcodeTest(execute_fn: fn (usize, *Interpreter, *Frame) ExecutionError![]const u8, input: []const @"u256", expected_output: []const @"u256") !void {
    const allocator = testing.allocator;
    
    // Create a mock contract with empty code
    const contract = try test_utils.createMockContract(allocator, &[_]u8{});
    defer {
        allocator.free(contract.code);
        allocator.destroy(contract);
    }
    
    // Create a frame with the mock contract
    var frame = try Frame.init(allocator, contract);
    defer frame.deinit();
    
    // Create a mock EVM
    const evm_instance = try test_utils.createMockEvm(allocator);
    defer allocator.destroy(evm_instance);
    
    // Create a mock interpreter
    const interpreter = try test_utils.createMockInterpreter(allocator, evm_instance);
    defer allocator.destroy(interpreter);
    
    // Push input values onto the stack
    for (input) |val| {
        try frame.stack.push(val);
    }
    
    // Execute the opcode
    _ = try execute_fn(0, interpreter, &frame);
    
    // Check if the stack has the expected size after execution
    try testing.expectEqual(expected_output.len, frame.stack.size);
    
    // Check each stack value
    for (0..expected_output.len) |i| {
        const actual = frame.stack.data[frame.stack.size - 1 - i];
        try testing.expectEqual(expected_output[i], actual);
    }
}

test "ADDMOD with non-zero modulus" {
    const input = [_]u256{ 7, 5, 3 }; // 7 + 5 mod 3
    const expected = [_]u256{0}; // (7 + 5) % 3 = 12 % 3 = 0
    try runOpcodeTest(math2.opAddmod, &input, &expected);
}

test "ADDMOD with zero modulus" {
    const input = [_]u256{ 7, 5, 0 }; // 7 + 5 mod 0
    const expected = [_]u256{0}; // Modulo by zero returns 0
    try runOpcodeTest(math2.opAddmod, &input, &expected);
}

test "ADDMOD with large numbers" {
    const input = [_]u256{ 
        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff, 
        2, 
        10 
    };
    const expected = [_]u256{1}; // (max_u256 + 2) % 10 = 1
    try runOpcodeTest(math2.opAddmod, &input, &expected);
}

test "MULMOD with non-zero modulus" {
    const input = [_]u256{ 7, 5, 3 }; // 7 * 5 mod 3
    const expected = [_]u256{2}; // (7 * 5) % 3 = 35 % 3 = 2
    try runOpcodeTest(math2.opMulmod, &input, &expected);
}

test "MULMOD with zero modulus" {
    const input = [_]u256{ 7, 5, 0 }; // 7 * 5 mod 0
    const expected = [_]u256{0}; // Modulo by zero returns 0
    try runOpcodeTest(math2.opMulmod, &input, &expected);
}

test "MULMOD with large numbers" {
    const input = [_]u256{ 
        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff, 
        2, 
        10 
    };
    const expected = [_]u256{8}; // (max_u256 * 2) % 10 = 8
    try runOpcodeTest(math2.opMulmod, &input, &expected);
}

test "EXP with zero exponent" {
    const input = [_]u256{ 5, 0 }; // 5^0
    const expected = [_]u256{1}; // Any number to the power of 0 is 1
    try runOpcodeTest(math2.opExp, &input, &expected);
}

test "EXP with zero base" {
    const input = [_]u256{ 0, 5 }; // 0^5
    const expected = [_]u256{0}; // 0 to any positive power is 0
    try runOpcodeTest(math2.opExp, &input, &expected);
}

test "EXP with small exponent" {
    const input = [_]u256{ 2, 3 }; // 2^3
    const expected = [_]u256{8}; // 2^3 = 8
    try runOpcodeTest(math2.opExp, &input, &expected);
}

test "EXP with large exponent" {
    const input = [_]u256{ 2, 10 }; // 2^10
    const expected = [_]u256{1024}; // 2^10 = 1024
    try runOpcodeTest(math2.opExp, &input, &expected);
}

test "SIGNEXTEND with byte position 0" {
    // Test extending a negative number (0xFF = -1 in 8-bit signed)
    const input = [_]u256{ 0xFF, 0 }; // Extend 0xFF from byte 0
    const expected = [_]u256{0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF}; // Sign bit is 1, extend with 1s
    try runOpcodeTest(math2.opSignextend, &input, &expected);
}

test "SIGNEXTEND with byte position 0 for positive number" {
    // Test extending a positive number (0x7F = 127 in 8-bit signed)
    const input = [_]u256{ 0x7F, 0 }; // Extend 0x7F from byte 0
    const expected = [_]u256{0x7F}; // Sign bit is 0, extend with 0s
    try runOpcodeTest(math2.opSignextend, &input, &expected);
}

test "SIGNEXTEND with large byte position" {
    // Test with byte position >= 32 (no extension)
    const input = [_]u256{ 0xFF, 32 }; // Extend 0xFF from byte 32
    const expected = [_]u256{0xFF}; // No change, byte position >= 32
    try runOpcodeTest(math2.opSignextend, &input, &expected);
}

test "MOD with non-zero modulus" {
    const input = [_]u256{ 17, 5 }; // 17 % 5
    const expected = [_]u256{2}; // 17 % 5 = 2
    try runOpcodeTest(math2.opMod, &input, &expected);
}

test "MOD with zero modulus" {
    const input = [_]u256{ 17, 0 }; // 17 % 0
    const expected = [_]u256{0}; // Modulo by zero returns 0
    try runOpcodeTest(math2.opMod, &input, &expected);
}

test "SDIV with positive numbers" {
    const input = [_]u256{ 10, 3 }; // 10 / 3
    const expected = [_]u256{3}; // 10 / 3 = 3 (integer division)
    try runOpcodeTest(math2.opSdiv, &input, &expected);
}

test "SDIV with negative dividend" {
    // -10 in two's complement using wraparound subtraction
    const negative_ten: u256 = makeNegative(10);
    const input = [_]u256{ 3, negative_ten }; // -10 / 3
    const expected = [_]u256{makeNegative(3)}; // -3 in two's complement
    try runOpcodeTest(math2.opSdiv, &input, &expected);
}

test "SDIV with negative divisor" {
    // -3 in two's complement using wraparound subtraction
    const negative_three: u256 = makeNegative(3);
    const input = [_]u256{ negative_three, 10 }; // 10 / -3
    const expected = [_]u256{makeNegative(3)}; // -3 in two's complement
    try runOpcodeTest(math2.opSdiv, &input, &expected);
}

test "SDIV with both negative" {
    // -10 in two's complement using wraparound subtraction
    const negative_ten: u256 = makeNegative(10);
    // -3 in two's complement using wraparound subtraction
    const negative_three: u256 = makeNegative(3);
    const input = [_]u256{ negative_three, negative_ten }; // -10 / -3
    const expected = [_]u256{3}; // -10 / -3 = 3
    try runOpcodeTest(math2.opSdiv, &input, &expected);
}

test "SDIV with zero divisor" {
    const input = [_]u256{ 0, 10 }; // 10 / 0
    const expected = [_]u256{0}; // Division by zero returns 0
    try runOpcodeTest(math2.opSdiv, &input, &expected);
}

test "SMOD with positive numbers" {
    const input = [_]u256{ 5, 17 }; // 17 % 5
    const expected = [_]u256{2}; // 17 % 5 = 2
    try runOpcodeTest(math2.opSmod, &input, &expected);
}

test "SMOD with negative dividend" {
    // -17 in two's complement using wraparound subtraction
    const negative_seventeen: u256 = makeNegative(17);
    const input = [_]u256{ 5, negative_seventeen }; // -17 % 5
    const expected = [_]u256{makeNegative(2)}; // -2 in two's complement
    try runOpcodeTest(math2.opSmod, &input, &expected);
}

test "SMOD with negative modulus" {
    // -5 in two's complement using wraparound subtraction
    const negative_five: u256 = makeNegative(5);
    const input = [_]u256{ negative_five, 17 }; // 17 % -5
    const expected = [_]u256{2}; // 17 % -5 = 2 (sign follows dividend)
    try runOpcodeTest(math2.opSmod, &input, &expected);
}

test "SMOD with both negative" {
    // -17 in two's complement using wraparound subtraction
    const negative_seventeen: u256 = makeNegative(17);
    // -5 in two's complement using wraparound subtraction
    const negative_five: u256 = makeNegative(5);
    const input = [_]u256{ negative_five, negative_seventeen }; // -17 % -5
    const expected = [_]u256{makeNegative(2)}; // -2 in two's complement (sign follows dividend)
    try runOpcodeTest(math2.opSmod, &input, &expected);
}

test "SMOD with zero modulus" {
    const input = [_]u256{ 0, 17 }; // 17 % 0
    const expected = [_]u256{0}; // Modulo by zero returns 0
    try runOpcodeTest(math2.opSmod, &input, &expected);
}