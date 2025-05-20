const std = @import("std");
const testing = std.testing;
const math2 = @import("./math2.zig");
const Evm = @import("Evm");
const Frame = Evm.Frame;
const Contract = Evm.Contract;
const Interpreter = Evm.Interpreter;
const Address = @import("Address");
const ExecutionError = Evm.ExecutionError;

// Helper function to create a negative u256 number using two's complement
fn makeNegative(value: u256) u256 {
    return (~value) +% 1;
}

// Mock interpreter for testing
fn createMockInterpreter() !*Interpreter {
    const interpreter = try testing.allocator.create(Interpreter);
    interpreter.* = Interpreter{
        .evm = undefined,
        .depth = 0,
        .gas = 0,
        .abort = false,
        .returnData = null,
        .readOnly = false,
        .static_mode = false,
    };
    return interpreter;
}

// Mock contract for testing
fn createMockContract() !*Contract {
    var address: Address.Address = undefined;
    _ = std.fmt.hexToBytes(&address, "1234567890123456789012345678901234567890") catch unreachable;
    
    var caller: Address.Address = undefined;
    _ = std.fmt.hexToBytes(&caller, "2345678901234567890123456789012345678901") catch unreachable;
    
    const contract = try testing.allocator.create(Contract);
    contract.* = Contract{
        .input = "",
        .code = "",
        .hash = null,
        .address = address,
        .caller = caller,
        .value = 0,
        .gas = 1000000,
        .readOnly = false,
    };
    return contract;
}

// Helper for running opcode tests
fn runOpcodeTest(execute_fn: fn (usize, *Interpreter, *Frame) ExecutionError![]const u8, input: []const u256, expected_output: []const u256) !void {
    const mock_interpreter = try createMockInterpreter();
    defer testing.allocator.destroy(mock_interpreter);
    
    const mock_contract = try createMockContract();
    defer testing.allocator.destroy(mock_contract);
    
    var frame = try Frame.init(testing.allocator, mock_contract);
    defer frame.deinit();
    
    // Push input values onto the stack
    for (input) |val| {
        try frame.stack.push(val);
    }
    
    // Execute the opcode
    _ = try execute_fn(0, mock_interpreter, &frame);
    
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
    const expected = [_]u256{1}; // (7 * 5) % 3 = 35 % 3 = 2
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