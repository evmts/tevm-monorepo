//! Arithmetic operation handlers for ZigEVM
//! This module implements handlers for arithmetic opcodes

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;
const Stack = @import("../stack/stack.zig").Stack;

/// Add two values from the stack (ADD)
pub fn add(stack: *Stack) !void {
    const b = try stack.pop();
    const a = try stack.pop();
    const result = a.add(b);
    try stack.push(result);
}

/// Multiply two values from the stack (MUL)
pub fn mul(stack: *Stack) !void {
    const b = try stack.pop();
    const a = try stack.pop();
    const result = a.mul(b);
    try stack.push(result);
}

/// Subtract two values from the stack (SUB)
pub fn sub(stack: *Stack) !void {
    const b = try stack.pop();
    const a = try stack.pop();
    const result = a.sub(b);
    try stack.push(result);
}

/// Divide two values from the stack (DIV)
pub fn div(stack: *Stack) !void {
    var b = try stack.pop();
    const a = try stack.pop();
    
    // Division by zero returns zero
    if (b.isZero()) {
        try stack.push(U256.zero());
        return;
    }
    
    // Simple long division algorithm for unsigned integers
    var quotient = U256.zero();
    var remainder = U256.zero();
    
    // Process each bit from most significant to least
    var i: i32 = 255;
    while (i >= 0) : (i -= 1) {
        // Left shift remainder by 1 bit
        remainder = remainder.shl(1);
        
        // Set the least significant bit of remainder to the current bit of a
        if (a.words[i / 64] & (@as(u64, 1) << @intCast(i % 64)) != 0) {
            remainder = remainder.bitOr(U256.one());
        }
        
        // If remainder >= b, subtract b from remainder and set current bit in quotient
        if (remainder.gte(b)) {
            remainder = remainder.sub(b);
            quotient = quotient.bitOr(U256.one().shl(@intCast(i)));
        }
    }
    
    try stack.push(quotient);
}

/// Compute a % b (MOD)
pub fn mod(stack: *Stack) !void {
    var b = try stack.pop();
    var a = try stack.pop();
    
    // Modulo by zero returns zero
    if (b.isZero()) {
        try stack.push(U256.zero());
        return;
    }
    
    // Simple implementation using a naive algorithm
    // In production, we'd use a more efficient algorithm
    var remainder = a;
    while (remainder.gte(b)) {
        remainder = remainder.sub(b);
    }
    
    try stack.push(remainder);
}

/// Compute (a + b) % N (ADDMOD)
pub fn addmod(stack: *Stack) !void {
    const n = try stack.pop();
    const b = try stack.pop();
    const a = try stack.pop();
    
    // Modulo by zero returns zero
    if (n.isZero()) {
        try stack.push(U256.zero());
        return;
    }
    
    // Compute (a + b) % n
    // Note: This is a simplified implementation that doesn't handle the full 512-bit intermediate
    const sum = a.add(b);
    
    // Simple implementation for modulo - in production use a more efficient algorithm
    var remainder = sum;
    while (remainder.gte(n)) {
        remainder = remainder.sub(n);
    }
    
    try stack.push(remainder);
}

/// Compute (a * b) % N (MULMOD)
pub fn mulmod(stack: *Stack) !void {
    const n = try stack.pop();
    const b = try stack.pop();
    const a = try stack.pop();
    
    // Modulo by zero returns zero
    if (n.isZero()) {
        try stack.push(U256.zero());
        return;
    }
    
    // Compute (a * b) % n
    // Note: This is a simplified implementation that doesn't handle the full 512-bit intermediate
    const product = a.mul(b);
    
    // Simple implementation for modulo - in production use a more efficient algorithm
    var remainder = product;
    while (remainder.gte(n)) {
        remainder = remainder.sub(n);
    }
    
    try stack.push(remainder);
}

/// Compute a ** b (EXP)
pub fn exp(stack: *Stack) !void {
    const exponent = try stack.pop();
    const base = try stack.pop();
    
    // Optimization: X**0 = 1
    if (exponent.isZero()) {
        try stack.push(U256.one());
        return;
    }
    
    // Optimization: 0**X = 0 (except 0**0 = 1, handled above)
    if (base.isZero()) {
        try stack.push(U256.zero());
        return;
    }
    
    // Optimization: 1**X = 1
    if (base.eq(U256.one())) {
        try stack.push(U256.one());
        return;
    }
    
    // Standard binary exponentiation algorithm
    var result = U256.one();
    var current_base = base;
    var current_exponent = exponent;
    
    while (!current_exponent.isZero()) {
        // If current bit in exponent is 1, multiply result by current_base
        if (current_exponent.words[0] & 1 != 0) {
            result = result.mul(current_base);
        }
        
        // Square the base and halve the exponent
        current_base = current_base.mul(current_base);
        current_exponent = current_exponent.shr(1);
    }
    
    try stack.push(result);
}

/// Compute sign extension (SIGNEXTEND)
pub fn signextend(stack: *Stack) !void {
    const b = try stack.pop(); // byte number to sign-extend from
    const x = try stack.pop(); // value to sign-extend
    
    // If b >= 32, return x unchanged (no sign extension necessary)
    if (b.words[0] >= 32) {
        try stack.push(x);
        return;
    }
    
    // Calculate bit position to sign-extend from
    const bit_pos = b.words[0] * 8 + 7;
    const byte_pos = bit_pos / 8;
    const word_pos = byte_pos / 8;
    const bit_in_byte = bit_pos % 8;
    
    // Get a copy of the value to modify
    var result = x;
    
    // Check the sign bit
    const sign_bit_word_offset = bit_pos / 64;
    const sign_bit_pos = bit_pos % 64;
    const sign_bit = (x.words[sign_bit_word_offset] >> sign_bit_pos) & 1;
    
    // If sign bit is 1, extend with 1s, otherwise extend with 0s (already 0s)
    if (sign_bit == 1) {
        // Set all bits above the sign bit to 1
        const byte_mask = @as(u8, 0xFF) << (bit_in_byte + 1);
        
        // Set bits in the current byte
        const current_byte_index = byte_pos;
        if (current_byte_index < 32) {
            // Implementation would set bits in this byte
        }
        
        // Set all bytes above this one to all 1s
        for (byte_pos + 1..32) |i| {
            // Implementation would set bytes
        }
        
        // For simplicity in this example, we'll use a crude approach for this demo
        if (sign_bit == 1) {
            // Fill all words above sign_bit_word_offset with 1s
            for (sign_bit_word_offset + 1..4) |i| {
                result.words[i] = @as(u64, 0xFFFFFFFFFFFFFFFF);
            }
            
            // Fill current word with 1s above the sign bit
            const mask = (@as(u64, 1) << sign_bit_pos) - 1;
            result.words[sign_bit_word_offset] = x.words[sign_bit_word_offset] | ~mask;
        }
    }
    
    try stack.push(result);
}

// Tests
test "arithmetic operations" {
    var stack = Stack.init();
    
    // Test ADD
    try stack.push(U256.fromU64(100));
    try stack.push(U256.fromU64(50));
    try add(&stack);
    try std.testing.expectEqual(U256.fromU64(150), try stack.pop());
    
    // Test SUB
    try stack.push(U256.fromU64(100));
    try stack.push(U256.fromU64(30));
    try sub(&stack);
    try std.testing.expectEqual(U256.fromU64(70), try stack.pop());
    
    // Test MUL
    try stack.push(U256.fromU64(5));
    try stack.push(U256.fromU64(7));
    try mul(&stack);
    try std.testing.expectEqual(U256.fromU64(35), try stack.pop());
    
    // Test DIV
    try stack.push(U256.fromU64(100));
    try stack.push(U256.fromU64(5));
    try div(&stack);
    try std.testing.expectEqual(U256.fromU64(20), try stack.pop());
    
    // Test DIV by zero
    try stack.push(U256.fromU64(100));
    try stack.push(U256.fromU64(0));
    try div(&stack);
    try std.testing.expectEqual(U256.fromU64(0), try stack.pop());
    
    // Test EXP
    try stack.push(U256.fromU64(2));
    try stack.push(U256.fromU64(3));
    try exp(&stack);
    try std.testing.expectEqual(U256.fromU64(8), try stack.pop());
}