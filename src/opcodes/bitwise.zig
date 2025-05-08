//! Bitwise operation handlers for ZigEVM
//! This module implements handlers for bitwise opcodes

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Stack = @import("../stack/stack.zig").Stack;

/// Bitwise AND (AND)
pub fn bitAnd(stack: *Stack) !void {
    const b = try stack.pop();
    const a = try stack.pop();
    const result = a.bitAnd(b);
    try stack.push(result);
}

/// Bitwise OR (OR)
pub fn bitOr(stack: *Stack) !void {
    const b = try stack.pop();
    const a = try stack.pop();
    const result = a.bitOr(b);
    try stack.push(result);
}

/// Bitwise XOR (XOR)
pub fn bitXor(stack: *Stack) !void {
    const b = try stack.pop();
    const a = try stack.pop();
    const result = a.bitXor(b);
    try stack.push(result);
}

/// Bitwise NOT (NOT)
pub fn bitNot(stack: *Stack) !void {
    const a = try stack.pop();
    const result = a.bitNot();
    try stack.push(result);
}

/// Get a single byte from a word (BYTE)
pub fn byte(stack: *Stack) !void {
    const position = try stack.pop();
    const value = try stack.pop();
    
    // If position >= 32, result is 0
    if (position.words[0] >= 32) {
        try stack.push(U256.zero());
        return;
    }
    
    // Determine which byte to extract
    const pos = position.words[0];
    const word_pos = pos / 8;
    const byte_pos = pos % 8;
    
    // Extract the byte
    const extracted_byte = (value.words[word_pos] >> (8 * byte_pos)) & 0xFF;
    
    try stack.push(U256.fromU64(extracted_byte));
}

/// Shift left (SHL)
pub fn shl(stack: *Stack) !void {
    const shift = try stack.pop();
    const value = try stack.pop();
    
    // If shift >= 256, result is 0
    if (shift.words[0] >= 256) {
        try stack.push(U256.zero());
        return;
    }
    
    const result = value.shl(@intCast(shift.words[0]));
    try stack.push(result);
}

/// Logical shift right (SHR)
pub fn shr(stack: *Stack) !void {
    const shift = try stack.pop();
    const value = try stack.pop();
    
    // If shift >= 256, result is 0
    if (shift.words[0] >= 256) {
        try stack.push(U256.zero());
        return;
    }
    
    const result = value.shr(@intCast(shift.words[0]));
    try stack.push(result);
}

/// Arithmetic shift right (SAR)
pub fn sar(stack: *Stack) !void {
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
        return;
    }
    
    // For non-negative values, SAR is identical to SHR
    if (!is_negative) {
        try stack.push(value.shr(@intCast(shift.words[0])));
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
}

// Tests
test "bitwise operations" {
    var stack = Stack.init();
    
    // Test AND
    try stack.push(U256.fromU64(0b1100));
    try stack.push(U256.fromU64(0b1010));
    try bitAnd(&stack);
    try std.testing.expectEqual(U256.fromU64(0b1000), try stack.pop());
    
    // Test OR
    try stack.push(U256.fromU64(0b1100));
    try stack.push(U256.fromU64(0b1010));
    try bitOr(&stack);
    try std.testing.expectEqual(U256.fromU64(0b1110), try stack.pop());
    
    // Test XOR
    try stack.push(U256.fromU64(0b1100));
    try stack.push(U256.fromU64(0b1010));
    try bitXor(&stack);
    try std.testing.expectEqual(U256.fromU64(0b0110), try stack.pop());
    
    // Test NOT
    try stack.push(U256.fromU64(0b1010));
    try bitNot(&stack);
    // NOT in EVM is 256-bit, so we would get all 1s except the 4 we specified
    const expected = U256.max().bitXor(U256.fromU64(0b1010));
    try std.testing.expect(expected.eq(try stack.pop()));
    
    // Test BYTE
    try stack.push(U256.fromU64(0x0102030405060708));
    try stack.push(U256.fromU64(0)); // get byte at position 0 (in Ethereum, byte 0 is the most significant)
    try byte(&stack);
    try std.testing.expectEqual(U256.fromU64(0x08), try stack.pop());
    
    // Test SHL
    try stack.push(U256.fromU64(1)); // 0000 0001
    try stack.push(U256.fromU64(1)); // shift by 1
    try shl(&stack);
    try std.testing.expectEqual(U256.fromU64(2), try stack.pop()); // 0000 0010
    
    // Test SHR
    try stack.push(U256.fromU64(8)); // 0000 1000
    try stack.push(U256.fromU64(2)); // shift by 2
    try shr(&stack);
    try std.testing.expectEqual(U256.fromU64(2), try stack.pop()); // 0000 0010
    
    // Test SAR with positive number (should work like SHR)
    try stack.push(U256.fromU64(8)); // 0000 1000
    try stack.push(U256.fromU64(2)); // shift by 2
    try sar(&stack);
    try std.testing.expectEqual(U256.fromU64(2), try stack.pop()); // 0000 0010
    
    // Test SAR with negative number (high bit set)
    // For this we need a number with the high bit set
    var negative_num = U256.zero();
    negative_num.words[3] = 0x8000000000000000; // Set the MSB
    try stack.push(negative_num);
    try stack.push(U256.fromU64(4)); // shift by 4
    try sar(&stack);
    
    // The result should have the 4 highest bits set
    var expected_result = U256.zero();
    expected_result.words[3] = 0xF000000000000000;
    try std.testing.expect(expected_result.eq(try stack.pop()));
}