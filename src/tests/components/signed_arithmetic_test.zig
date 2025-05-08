//! Tests for SDIV and SMOD opcodes
//! Verifies the proper implementation of signed arithmetic operations in the ZigEVM

const std = @import("std");
const testing = std.testing;
const Interpreter = @import("../../interpreter/interpreter.zig").Interpreter;
const Opcode = @import("../../opcodes/opcodes.zig").Opcode;
const ExecutionResult = @import("../../util/types.zig").ExecutionResult;
const U256 = @import("../../util/types.zig").U256;

/// Create a negative U256 value (two's complement representation)
fn createNegative(value: u64) U256 {
    var val = U256.fromU64(value);
    var complement = val.bitNot();  // ~x
    return complement.add(U256.one()); // ~x + 1
}

/// Test executing bytecode containing SDIV instructions
test "SDIV bytecode execution" {
    // Create bytecode for testing SDIV
    // 1. PUSH 10 (push value 10)
    // 2. PUSH -5 (push value -5 as two's complement)
    // 3. SDIV (signed division)
    
    // Create a negative 5 value
    var neg_five = createNegative(5);
    
    // Convert to bytes for bytecode
    var neg_five_bytes: [32]u8 = undefined;
    neg_five.toBytes(&neg_five_bytes);
    
    // Create the bytecode
    var bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH32),
    };
    // Add 32 bytes for the negative number (PUSH32 value)
    const bytecode_with_neg_five = bytecode ++ neg_five_bytes;
    
    // Add PUSH1 and SDIV instructions
    const complete_bytecode = bytecode_with_neg_five ++ [_]u8{
        @intFromEnum(Opcode.PUSH1), 10,     // Push 10
        @intFromEnum(Opcode.SDIV),          // SDIV operation
    };
    
    // Create interpreter and execute the bytecode
    var interpreter = try Interpreter.init(testing.allocator, &complete_bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Verify the result
    switch (result) {
        .Success => |success| {
            // The stack should have one value: -2 (10 / -5 = -2)
            try testing.expect(interpreter.stack.getSize() == 1);
            
            const stack_value = try interpreter.stack.peek().*;
            
            // Expected result: -2 (as two's complement)
            const expected_neg_two = createNegative(2);
            try testing.expectEqual(expected_neg_two, stack_value);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test executing bytecode containing SMOD instructions
test "SMOD bytecode execution" {
    // Create bytecode for testing SMOD
    // 1. PUSH -100 (push value -100 as two's complement)
    // 2. PUSH 7 (push value 7)
    // 3. SMOD (signed modulo)
    
    // Create a negative 100 value
    var neg_hundred = createNegative(100);
    
    // Convert to bytes for bytecode
    var neg_hundred_bytes: [32]u8 = undefined;
    neg_hundred.toBytes(&neg_hundred_bytes);
    
    // Create the bytecode
    var bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH32),
    };
    // Add 32 bytes for the negative number (PUSH32 value)
    const bytecode_with_neg_hundred = bytecode ++ neg_hundred_bytes;
    
    // Add PUSH1 and SMOD instructions
    const complete_bytecode = bytecode_with_neg_hundred ++ [_]u8{
        @intFromEnum(Opcode.PUSH1), 7,     // Push 7
        @intFromEnum(Opcode.SMOD),        // SMOD operation
    };
    
    // Create interpreter and execute the bytecode
    var interpreter = try Interpreter.init(testing.allocator, &complete_bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Verify the result
    switch (result) {
        .Success => |success| {
            // The stack should have one value: -2 (-100 % 7 = -2)
            try testing.expect(interpreter.stack.getSize() == 1);
            
            const stack_value = try interpreter.stack.peek().*;
            
            // Expected result: -2 (as two's complement)
            const expected_neg_two = createNegative(2);
            try testing.expectEqual(expected_neg_two, stack_value);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test complex bytecode combining both SDIV and SMOD
test "Combined SDIV and SMOD bytecode execution" {
    // Create bytecode that:
    // 1. Performs SDIV: -128 / 4 = -32
    // 2. Performs SMOD: -32 % 5 = -2
    
    // Create negative values
    var neg_128 = createNegative(128);
    
    // Convert to bytes for bytecode
    var neg_128_bytes: [32]u8 = undefined;
    neg_128.toBytes(&neg_128_bytes);
    
    // Create the bytecode
    const bytecode = [_]u8{
        // Push -128
        @intFromEnum(Opcode.PUSH32),
    } ++ neg_128_bytes ++ [_]u8{
        // Perform -128 / 4 = -32
        @intFromEnum(Opcode.PUSH1), 4,
        @intFromEnum(Opcode.SDIV),
        
        // Perform -32 % 5 = -2
        @intFromEnum(Opcode.PUSH1), 5,
        @intFromEnum(Opcode.SMOD),
    };
    
    // Create interpreter and execute the bytecode
    var interpreter = try Interpreter.init(testing.allocator, &bytecode, 100000, 0);
    defer interpreter.deinit();
    
    const result = interpreter.execute();
    
    // Verify the result
    switch (result) {
        .Success => |success| {
            // The stack should have one value: -2
            try testing.expect(interpreter.stack.getSize() == 1);
            
            const stack_value = try interpreter.stack.peek().*;
            
            // Expected result: -2 (as two's complement)
            const expected_neg_two = createNegative(2);
            try testing.expectEqual(expected_neg_two, stack_value);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}