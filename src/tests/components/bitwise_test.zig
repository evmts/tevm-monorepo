//! Tests for bitwise opcodes
//! Verifies the proper implementation of bitwise operations in the ZigEVM

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

/// Test executing bytecode containing bitwise comparison operations
test "SLT and SGT bytecode execution" {
    // Create bytecode for testing SLT
    // 1. PUSH 20 (push value 20)
    // 2. PUSH 10 (push value 10)
    // 3. SLT (signed less than: 10 < 20)
    const slt_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 20,
        @intFromEnum(Opcode.PUSH1), 10,
        @intFromEnum(Opcode.SLT),
    };
    
    // Create bytecode for testing SGT with negative number
    // First we need to create a negative number (-10) in two's complement
    // We'll use a PUSH32 for this
    var neg_ten = createNegative(10);
    var neg_ten_bytes: [32]u8 = undefined;
    neg_ten.toBytes(&neg_ten_bytes);
    
    // 1. PUSH 5
    // 2. PUSH -10 (via PUSH32 with two's complement representation)
    // 3. SGT (signed greater than: 5 > -10)
    var sgt_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 5,    // Push 5
        @intFromEnum(Opcode.PUSH32),      // PUSH32 instruction
    };
    sgt_bytecode = sgt_bytecode ++ neg_ten_bytes;
    const sgt_op = [_]u8{@intFromEnum(Opcode.SGT)};
    const sgt_complete_bytecode = sgt_bytecode ++ sgt_op;
    
    // Create interpreter and execute the SLT bytecode
    var slt_interpreter = try Interpreter.init(testing.allocator, &slt_bytecode, 100000, 0);
    defer slt_interpreter.deinit();
    
    const slt_result = slt_interpreter.execute();
    
    // Verify the result of SLT
    switch (slt_result) {
        .Success => |success| {
            // The stack should have one value: 1 (true, because 10 < 20)
            try testing.expectEqual(@as(usize, 1), slt_interpreter.stack.getSize());
            try testing.expectEqual(U256.one(), try slt_interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
    
    // Create interpreter and execute the SGT bytecode
    var sgt_interpreter = try Interpreter.init(testing.allocator, &sgt_complete_bytecode, 100000, 0);
    defer sgt_interpreter.deinit();
    
    const sgt_result = sgt_interpreter.execute();
    
    // Verify the result of SGT
    switch (sgt_result) {
        .Success => |success| {
            // The stack should have one value: 1 (true, because 5 > -10)
            try testing.expectEqual(@as(usize, 1), sgt_interpreter.stack.getSize());
            try testing.expectEqual(U256.one(), try sgt_interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false); // This should not happen
        },
    }
}

/// Test executing bytecode containing bitwise operations
test "Bitwise AND, OR, XOR, NOT execution" {
    // Create bytecode for testing AND
    // 1. PUSH 0b1010 (10 in decimal)
    // 2. PUSH 0b1100 (12 in decimal)
    // 3. AND (1010 & 1100 = 1000 = 8)
    const and_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 10,   // 0b1010
        @intFromEnum(Opcode.PUSH1), 12,   // 0b1100
        @intFromEnum(Opcode.AND),
    };
    
    // Create bytecode for testing OR
    // 1. PUSH 0b1010 (10 in decimal)
    // 2. PUSH 0b1100 (12 in decimal)
    // 3. OR (1010 | 1100 = 1110 = 14)
    const or_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 10,   // 0b1010
        @intFromEnum(Opcode.PUSH1), 12,   // 0b1100
        @intFromEnum(Opcode.OR),
    };
    
    // Create bytecode for testing XOR
    // 1. PUSH 0b1010 (10 in decimal)
    // 2. PUSH 0b1100 (12 in decimal) 
    // 3. XOR (1010 ^ 1100 = 0110 = 6)
    const xor_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 10,   // 0b1010
        @intFromEnum(Opcode.PUSH1), 12,   // 0b1100
        @intFromEnum(Opcode.XOR),
    };
    
    // Create bytecode for testing NOT
    // 1. PUSH 0b1010 (10 in decimal)
    // 2. NOT (all bits flipped, giving a huge number in 256-bit)
    const not_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 10,   // 0b1010
        @intFromEnum(Opcode.NOT),
    };
    
    // Test the AND operation
    var and_interpreter = try Interpreter.init(testing.allocator, &and_bytecode, 100000, 0);
    defer and_interpreter.deinit();
    const and_result = and_interpreter.execute();
    switch (and_result) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 1), and_interpreter.stack.getSize());
            try testing.expectEqual(U256.fromU64(8), try and_interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false);
        },
    }
    
    // Test the OR operation
    var or_interpreter = try Interpreter.init(testing.allocator, &or_bytecode, 100000, 0);
    defer or_interpreter.deinit();
    const or_result = or_interpreter.execute();
    switch (or_result) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 1), or_interpreter.stack.getSize());
            try testing.expectEqual(U256.fromU64(14), try or_interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false);
        },
    }
    
    // Test the XOR operation
    var xor_interpreter = try Interpreter.init(testing.allocator, &xor_bytecode, 100000, 0);
    defer xor_interpreter.deinit();
    const xor_result = xor_interpreter.execute();
    switch (xor_result) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 1), xor_interpreter.stack.getSize());
            try testing.expectEqual(U256.fromU64(6), try xor_interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false);
        },
    }
    
    // Test the NOT operation
    var not_interpreter = try Interpreter.init(testing.allocator, &not_bytecode, 100000, 0);
    defer not_interpreter.deinit();
    const not_result = not_interpreter.execute();
    switch (not_result) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 1), not_interpreter.stack.getSize());
            const expected = U256.bitNot(U256.fromU64(10));
            try testing.expectEqual(expected, try not_interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false);
        },
    }
}

/// Test executing bytecode containing shift operations (SHL, SHR, SAR)
test "Shift operations bytecode execution" {
    // Create bytecode for testing SHL
    // 1. PUSH 2 (shift by 2 bits)
    // 2. PUSH 5 (value to shift)
    // 3. SHL (5 << 2 = 20)
    const shl_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 5,    // value
        @intFromEnum(Opcode.PUSH1), 2,    // shift amount
        @intFromEnum(Opcode.SHL),
    };
    
    // Create bytecode for testing SHR
    // 1. PUSH 1 (shift by 1 bit)
    // 2. PUSH 8 (value to shift)
    // 3. SHR (8 >> 1 = 4)
    const shr_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 8,    // value
        @intFromEnum(Opcode.PUSH1), 1,    // shift amount
        @intFromEnum(Opcode.SHR),
    };
    
    // Create bytecode for testing SAR with positive number
    // 1. PUSH 1 (shift by 1 bit)
    // 2. PUSH 8 (value to shift)
    // 3. SAR (8 >>> 1 = 4) - same as SHR for positive numbers
    const sar_pos_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH1), 8,    // value
        @intFromEnum(Opcode.PUSH1), 1,    // shift amount
        @intFromEnum(Opcode.SAR),
    };
    
    // Create bytecode for testing SAR with negative number
    // First create a negative number (-8) in two's complement
    var neg_eight = createNegative(8);
    var neg_eight_bytes: [32]u8 = undefined;
    neg_eight.toBytes(&neg_eight_bytes);
    
    // 1. PUSH 1 (shift by 1 bit)
    // 2. PUSH -8 (value to shift)
    // 3. SAR (-8 >>> 1 = -4) - arithmetic shift preserves sign
    var sar_neg_bytecode = [_]u8{
        @intFromEnum(Opcode.PUSH32),     // PUSH32 instruction
    };
    sar_neg_bytecode = sar_neg_bytecode ++ neg_eight_bytes;
    const sar_neg_part2 = [_]u8{
        @intFromEnum(Opcode.PUSH1), 1,    // shift amount
        @intFromEnum(Opcode.SAR),
    };
    const sar_neg_complete = sar_neg_bytecode ++ sar_neg_part2;
    
    // Test the SHL operation
    var shl_interpreter = try Interpreter.init(testing.allocator, &shl_bytecode, 100000, 0);
    defer shl_interpreter.deinit();
    const shl_result = shl_interpreter.execute();
    switch (shl_result) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 1), shl_interpreter.stack.getSize());
            try testing.expectEqual(U256.fromU64(20), try shl_interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false);
        },
    }
    
    // Test the SHR operation
    var shr_interpreter = try Interpreter.init(testing.allocator, &shr_bytecode, 100000, 0);
    defer shr_interpreter.deinit();
    const shr_result = shr_interpreter.execute();
    switch (shr_result) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 1), shr_interpreter.stack.getSize());
            try testing.expectEqual(U256.fromU64(4), try shr_interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false);
        },
    }
    
    // Test the SAR operation with positive number
    var sar_pos_interpreter = try Interpreter.init(testing.allocator, &sar_pos_bytecode, 100000, 0);
    defer sar_pos_interpreter.deinit();
    const sar_pos_result = sar_pos_interpreter.execute();
    switch (sar_pos_result) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 1), sar_pos_interpreter.stack.getSize());
            try testing.expectEqual(U256.fromU64(4), try sar_pos_interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false);
        },
    }
    
    // Test the SAR operation with negative number
    var sar_neg_interpreter = try Interpreter.init(testing.allocator, &sar_neg_complete, 100000, 0);
    defer sar_neg_interpreter.deinit();
    const sar_neg_result = sar_neg_interpreter.execute();
    switch (sar_neg_result) {
        .Success => |success| {
            try testing.expectEqual(@as(usize, 1), sar_neg_interpreter.stack.getSize());
            // -8 >>> 1 = -4
            const expected_neg_four = createNegative(4);
            try testing.expectEqual(expected_neg_four, try sar_neg_interpreter.stack.peek().*);
        },
        else => {
            try testing.expect(false);
        },
    }
}