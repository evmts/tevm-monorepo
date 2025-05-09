//! Bitwise operation handlers for ZigEVM
//! This module implements handlers for bitwise opcodes

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Stack = @import("../stack/stack.zig").Stack;
const Memory = @import("../memory/memory.zig").Memory;

/// Less than (LT)
pub fn lt(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop values
    const b = try stack.pop();
    const a = try stack.pop();
    
    // Compare a < b
    const result = if (a.lt(b)) U256.one() else U256.zero();
    
    // Push result
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

/// Greater than (GT)
pub fn gt(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop values
    const b = try stack.pop();
    const a = try stack.pop();
    
    // Compare a > b
    const result = if (a.gt(b)) U256.one() else U256.zero();
    
    // Push result
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

/// Equality (EQ)
pub fn eq(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop values
    const b = try stack.pop();
    const a = try stack.pop();
    
    // Compare a == b
    const result = if (a.eq(b)) U256.one() else U256.zero();
    
    // Push result
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

/// Is zero (ISZERO)
pub fn isZero(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop value
    const a = try stack.pop();
    
    // Check if a == 0
    const result = if (a.isZero()) U256.one() else U256.zero();
    
    // Push result
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

/// Bitwise AND (AND)
pub fn bitAnd(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop two values
    const b = try stack.pop();
    const a = try stack.pop();
    
    // Compute a & b
    const result = a.bitAnd(b);
    
    // Push result
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

/// Bitwise OR (OR)
pub fn bitOr(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop two values
    const b = try stack.pop();
    const a = try stack.pop();
    
    // Compute a | b
    const result = a.bitOr(b);
    
    // Push result
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

/// Bitwise XOR (XOR)
pub fn bitXor(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop two values
    const b = try stack.pop();
    const a = try stack.pop();
    
    // Compute a ^ b
    const result = a.bitXor(b);
    
    // Push result
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

/// Bitwise NOT (NOT)
pub fn bitNot(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop value
    const a = try stack.pop();
    
    // Compute ~a
    const result = a.bitNot();
    
    // Push result
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

/// Get a single byte from a word (BYTE)
pub fn byte(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop values
    const position = try stack.pop();
    const value = try stack.pop();
    
    // If position >= 32, result is 0
    if (position.words[0] >= 32) {
        try stack.push(U256.zero());
        pc.* += 1;
        return;
    }
    
    // Determine which byte to extract
    const pos = position.words[0];
    const word_pos = pos / 8;
    const byte_pos = pos % 8;
    
    // Extract the byte
    const extracted_byte = (value.words[word_pos] >> (8 * byte_pos)) & 0xFF;
    
    try stack.push(U256.fromU64(extracted_byte));
    
    // Advance PC
    pc.* += 1;
}

/// Shift left (SHL)
pub fn shl(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop values
    const shift = try stack.pop();
    const value = try stack.pop();
    
    // If shift >= 256, result is 0
    if (shift.words[0] >= 256) {
        try stack.push(U256.zero());
        pc.* += 1;
        return;
    }
    
    const result = value.shl(@intCast(shift.words[0]));
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

/// Logical shift right (SHR)
pub fn shr(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop values
    const shift = try stack.pop();
    const value = try stack.pop();
    
    // If shift >= 256, result is 0
    if (shift.words[0] >= 256) {
        try stack.push(U256.zero());
        pc.* += 1;
        return;
    }
    
    const result = value.shr(@intCast(shift.words[0]));
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

/// Arithmetic shift right (SAR)
pub fn sar(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop values
    const shift = try stack.pop();
    var value = try stack.pop();
    
    // Check if value is negative (msb set)
    const is_negative = (value.words[3] >> 63) & 1 == 1;
    
    // If shift >= 256, result is either 0 or all 1s
    if (shift.words[0] >= 256) {
        if (is_negative) {
            // All 1s
            try stack.push(U256.bitNot(U256.zero()));
        } else {
            // All 0s
            try stack.push(U256.zero());
        }
        pc.* += 1;
        return;
    }
    
    // For non-negative values, SAR is identical to SHR
    if (!is_negative) {
        try stack.push(value.shr(@intCast(shift.words[0])));
        pc.* += 1;
        return;
    }
    
    // For negative values, we need to maintain the sign bit
    // First do a logical right shift
    const shift_amount: u9 = @intCast(shift.words[0]);
    var result = value.shr(shift_amount);
    
    // Then set the high bits that were shifted in to 1
    const mask_size = @min(shift_amount, 256);
    if (mask_size > 0) {
        const mask = U256.bitNot(U256.zero().shr(mask_size)); // Creates a mask with top 'mask_size' bits set
        result = result.bitOr(mask);
    }
    
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

/// Signed less than (SLT)
pub fn slt(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop values
    const b = try stack.pop();
    const a = try stack.pop();
    
    // Check if values are negative (most significant bit set)
    const a_negative = (a.words[3] >> 63) & 1 == 1;
    const b_negative = (b.words[3] >> 63) & 1 == 1;
    
    // Comparison logic for signed values
    const result = if (a_negative and !b_negative) {
        // a is negative, b is not: a < b
        U256.one();
    } else if (!a_negative and b_negative) {
        // a is not negative, b is: a > b
        U256.zero();
    } else if (a_negative and b_negative) {
        // Both negative: compare magnitudes in reverse
        // If a has a larger magnitude than b, it's more negative, so a < b
        if (a.gt(b)) U256.one() else U256.zero();
    } else {
        // Both positive: normal comparison
        if (a.lt(b)) U256.one() else U256.zero();
    };
    
    // Push result
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

/// Signed greater than (SGT)
pub fn sgt(
    stack: *Stack,
    memory: *Memory,
    code: []const u8,
    pc: *usize,
    gas_left: *u64,
    gas_refund: ?*u64,
) !void {
    _ = memory;
    _ = code;
    _ = gas_refund;
    
    // Check gas
    if (gas_left.* < 3) {
        return Error.OutOfGas;
    }
    gas_left.* -= 3;
    
    // Pop values
    const b = try stack.pop();
    const a = try stack.pop();
    
    // Check if values are negative (most significant bit set)
    const a_negative = (a.words[3] >> 63) & 1 == 1;
    const b_negative = (b.words[3] >> 63) & 1 == 1;
    
    // Comparison logic for signed values
    const result = if (a_negative and !b_negative) {
        // a is negative, b is not: a < b
        U256.zero();
    } else if (!a_negative and b_negative) {
        // a is not negative, b is: a > b
        U256.one();
    } else if (a_negative and b_negative) {
        // Both negative: compare magnitudes in reverse
        // If a has a smaller magnitude than b, it's less negative, so a > b
        if (a.lt(b)) U256.one() else U256.zero();
    } else {
        // Both positive: normal comparison
        if (a.gt(b)) U256.one() else U256.zero();
    };
    
    // Push result
    try stack.push(result);
    
    // Advance PC
    pc.* += 1;
}

// Tests
test "bitwise operations with dispatch signature" {
    var stack = Stack.init();
    var memory = try Memory.init(std.testing.allocator);
    defer memory.deinit();
    
    var dummy_code = [_]u8{0};
    var pc: usize = 0;
    var gas_left: u64 = 1000;
    var gas_refund: u64 = 0;
    
    // Test AND
    try stack.push(U256.fromU64(0b1100));
    try stack.push(U256.fromU64(0b1010));
    try bitAnd(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(U256.fromU64(0b1000), try stack.pop());
    try std.testing.expectEqual(@as(usize, 1), pc); // PC should be advanced
    
    // Reset PC
    pc = 0;
    
    // Test OR
    try stack.push(U256.fromU64(0b1100));
    try stack.push(U256.fromU64(0b1010));
    try bitOr(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(U256.fromU64(0b1110), try stack.pop());
    try std.testing.expectEqual(@as(usize, 1), pc);
    
    // Reset PC
    pc = 0;
    
    // Test XOR
    try stack.push(U256.fromU64(0b1100));
    try stack.push(U256.fromU64(0b1010));
    try bitXor(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(U256.fromU64(0b0110), try stack.pop());
    try std.testing.expectEqual(@as(usize, 1), pc);
    
    // Reset PC
    pc = 0;
    
    // Test NOT
    try stack.push(U256.fromU64(0b1010));
    try bitNot(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    // NOT in EVM is 256-bit, so we would get all 1s except the 4 we specified
    const expected = U256.max().bitXor(U256.fromU64(0b1010));
    try std.testing.expect(expected.eq(try stack.pop()));
    try std.testing.expectEqual(@as(usize, 1), pc);
    
    // Reset PC
    pc = 0;
    
    // Test SHL
    try stack.push(U256.fromU64(1)); // 0000 0001
    try stack.push(U256.fromU64(1)); // shift by 1
    try shl(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(U256.fromU64(2), try stack.pop()); // 0000 0010
    try std.testing.expectEqual(@as(usize, 1), pc);
    
    // Reset PC
    pc = 0;
    
    // Test SHR
    try stack.push(U256.fromU64(8)); // 0000 1000
    try stack.push(U256.fromU64(2)); // shift by 2
    try shr(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(U256.fromU64(2), try stack.pop()); // 0000 0010
    try std.testing.expectEqual(@as(usize, 1), pc);

    // Reset PC
    pc = 0;
    
    // Helper for creating negative numbers in two's complement
    const makeNegative = struct {
        fn make(value: u64) U256 {
            const val = U256.fromU64(value);
            var result = val.bitNot(); // ~x
            result = result.add(U256.one()); // ~x + 1
            return result;
        }
    }.make;

    // Test SLT with positive values
    try stack.push(U256.fromU64(10));
    try stack.push(U256.fromU64(20));
    try slt(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(U256.one(), try stack.pop()); // 10 < 20 is true
    try std.testing.expectEqual(@as(usize, 1), pc);

    // Reset PC
    pc = 0;
    
    // Test SLT with negative values
    try stack.push(makeNegative(10));
    try stack.push(makeNegative(20));
    try slt(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(U256.zero(), try stack.pop()); // -10 < -20 is false
    try std.testing.expectEqual(@as(usize, 1), pc);

    // Reset PC
    pc = 0;
    
    // Test SLT with mixed signs
    try stack.push(makeNegative(10));
    try stack.push(U256.fromU64(20));
    try slt(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(U256.one(), try stack.pop()); // -10 < 20 is true
    try std.testing.expectEqual(@as(usize, 1), pc);

    // Reset PC
    pc = 0;
    
    // Test SGT with positive values
    try stack.push(U256.fromU64(30));
    try stack.push(U256.fromU64(15));
    try sgt(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(U256.one(), try stack.pop()); // 30 > 15 is true
    try std.testing.expectEqual(@as(usize, 1), pc);

    // Reset PC
    pc = 0;
    
    // Test SGT with negative values
    try stack.push(makeNegative(5));
    try stack.push(makeNegative(25));
    try sgt(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(U256.one(), try stack.pop()); // -5 > -25 is true
    try std.testing.expectEqual(@as(usize, 1), pc);

    // Reset PC
    pc = 0;
    
    // Test SGT with mixed signs
    try stack.push(U256.fromU64(5));
    try stack.push(makeNegative(10));
    try sgt(&stack, &memory, &dummy_code, &pc, &gas_left, &gas_refund);
    try std.testing.expectEqual(U256.one(), try stack.pop()); // 5 > -10 is true
    try std.testing.expectEqual(@as(usize, 1), pc);
}