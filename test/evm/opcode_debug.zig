const std = @import("std");
const print = std.debug.print;
const testing = std.testing;

// Simple test to verify opcode imports work
test "opcode import test" {
    const arithmetic = @import("evm").execution.arithmetic;
    const bitwise = @import("evm").execution.bitwise;
    const comparison = @import("evm").execution.comparison;
    
    // Just verify the functions exist
    _ = arithmetic.op_add;
    _ = bitwise.op_and;
    _ = comparison.op_eq;
    
    print("Opcode imports working\n", .{});
}