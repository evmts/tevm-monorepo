const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const error_mapping = @import("../error_mapping.zig");

pub fn op_add(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // First pop the values to calculate the sum
    const values = frame.stack.pop2() catch |err| return error_mapping.map_stack_error(err);
    
    const sum = values.a +% values.b;
    
    // Push the result
    try error_mapping.stack_push(&frame.stack, sum);
    
    return Operation.ExecutionResult{};
}

pub fn op_mul(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const a = try error_mapping.stack_pop(&frame.stack);
    const b = try error_mapping.stack_pop(&frame.stack);
    
    const result = a *% b; // Wrapping multiplication
    
    try error_mapping.stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}

pub fn op_sub(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try error_mapping.stack_pop(&frame.stack);
    const a = try error_mapping.stack_pop(&frame.stack);
    
    const result = a -% b; // Wrapping subtraction
    
    try error_mapping.stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}

pub fn op_div(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try error_mapping.stack_pop(&frame.stack);
    const a = try error_mapping.stack_pop(&frame.stack);
    
    if (b == 0) {
        try error_mapping.stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }
    
    try error_mapping.stack_push(&frame.stack, a / b);
    
    return Operation.ExecutionResult{};
}

pub fn op_sdiv(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try error_mapping.stack_pop(&frame.stack);
    const a = try error_mapping.stack_pop(&frame.stack);
    
    if (b == 0) {
        try error_mapping.stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }
    
    // Signed division for u256
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));
    
    // Special case: division overflow
    const min_i256 = @as(i256, 1) << 255;
    if (a_i256 == min_i256 and b_i256 == -1) {
        try error_mapping.stack_push(&frame.stack, @as(u256, @bitCast(min_i256)));
        return Operation.ExecutionResult{};
    }
    
    const result_i256 = @divTrunc(a_i256, b_i256);
    try error_mapping.stack_push(&frame.stack, @as(u256, @bitCast(result_i256)));
    
    return Operation.ExecutionResult{};
}

pub fn op_mod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try error_mapping.stack_pop(&frame.stack);
    const a = try error_mapping.stack_pop(&frame.stack);
    
    if (b == 0) {
        try error_mapping.stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }
    
    try error_mapping.stack_push(&frame.stack, a % b);
    
    return Operation.ExecutionResult{};
}

pub fn op_smod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try error_mapping.stack_pop(&frame.stack);
    const a = try error_mapping.stack_pop(&frame.stack);
    
    if (b == 0) {
        try error_mapping.stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }
    
    // Signed modulo for u256
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));
    
    const result_i256 = @rem(a_i256, b_i256);
    try error_mapping.stack_push(&frame.stack, @as(u256, @bitCast(result_i256)));
    
    return Operation.ExecutionResult{};
}

/// ADDMOD opcode (0x08): Modulo addition operation
/// 
/// Computes (a + b) % n where a, b, and n are 256-bit unsigned integers.
/// This operation correctly handles cases where a + b exceeds 256 bits.
/// 
/// ## Stack Requirements
/// - Consumes 3 values: [a, b, n] (n is TOS - top of stack)
/// - Pushes 1 value: (a + b) % n
/// 
/// ## Gas Cost
/// - Static: 8 gas (mid-cost operation)
/// 
/// ## Edge Cases
/// - If n == 0, result is 0 (following EVM specification)
/// - Handles overflow when a + b exceeds 256 bits
/// 
/// ## Algorithm
/// Uses the mathematical property: (a + b) % n = ((a % n) + (b % n)) % n
/// When (a % n) + (b % n) overflows, we compute:
/// - overflow_part = wrapped result of (a % n) + (b % n)
/// - 2^256 % n using two's complement: (~n + 1) % n
/// - Final result = (overflow_part + 2^256 % n) % n
/// 
/// This approach avoids needing 512-bit arithmetic while maintaining correctness.
pub fn op_addmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const n = try error_mapping.stack_pop(&frame.stack);
    const b = try error_mapping.stack_pop(&frame.stack);
    const a = try error_mapping.stack_pop(&frame.stack);
    
    // Special case: modulo by zero returns zero (EVM specification)
    if (n == 0) {
        try error_mapping.stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }
    const a_mod = a % n;
    const b_mod = b % n;
    
    // Check if a_mod + b_mod would overflow
    const sum_result = @addWithOverflow(a_mod, b_mod);
    if (sum_result[1] == 0) {
        // No overflow, simple case
        const sum = sum_result[0] % n;
        try error_mapping.stack_push(&frame.stack, sum);
        return Operation.ExecutionResult{};
    }
    
    // If overflow occurs, we know that a_mod + b_mod >= 2^256
    // Since both a_mod and b_mod are < n, and n <= 2^256 - 1,
    // we have: a_mod + b_mod < 2n
    // So (a_mod + b_mod) - 2^256 < n, and we can compute:
    // (a_mod + b_mod) % n = (a_mod + b_mod - 2^256) + 2^256 % n
    
    // First compute 2^256 % n
    // Since we're in u256, we can't represent 2^256 directly
    // But 2^256 % n = (2^256 - n + n) % n = ((2^256 - n) % n + n) % n = (2^256 - n) % n
    // And 2^256 - n = ~n + 1 in two's complement
    const two_pow_256_mod_n = (~n +% 1) % n;
    
    // Now compute the final result
    const overflow_part = sum_result[0]; // This is (a_mod + b_mod) - 2^256 due to wrapping
    const result = (overflow_part +% two_pow_256_mod_n) % n;
    try error_mapping.stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}

/// MULMOD opcode (0x09): Modulo multiplication operation
/// 
/// Computes (a * b) % n where a, b, and n are 256-bit unsigned integers.
/// This operation handles cases where a * b exceeds 256 bits.
/// 
/// ## Stack Requirements
/// - Consumes 3 values: [a, b, n] (n is TOS - top of stack)
/// - Pushes 1 value: (a * b) % n
/// 
/// ## Gas Cost
/// - Static: 8 gas (mid-cost operation)
/// 
/// ## Edge Cases
/// - If n == 0, result is 0 (following EVM specification)
/// - Handles overflow when a * b exceeds 256 bits without requiring 512-bit arithmetic
/// 
/// ## Algorithm: Russian Peasant Multiplication
/// When a * b would overflow, we use an iterative algorithm that:
/// 1. Decomposes multiplication into repeated doubling and addition
/// 2. Takes modulo at each step to keep values within 256 bits
/// 3. Handles overflow in intermediate additions using two's complement arithmetic
/// 
/// The algorithm works by representing b in binary and computing:
/// a * b = a * (b₀*2⁰ + b₁*2¹ + ... + bₙ*2ⁿ)
/// where bᵢ is the i-th bit of b
pub fn op_mulmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const n = try error_mapping.stack_pop(&frame.stack);
    const b = try error_mapping.stack_pop(&frame.stack);
    const a = try error_mapping.stack_pop(&frame.stack);
    
    // Special case: modulo by zero returns zero (EVM specification)
    if (n == 0) {
        try error_mapping.stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }
    
    // First, check if we can do it without overflow
    const result = @mulWithOverflow(a, b);
    if (result[1] == 0) {
        // No overflow, simple case
        const product = result[0] % n;
        try error_mapping.stack_push(&frame.stack, product);
        return Operation.ExecutionResult{};
    }
    
    // Overflow case - we need to compute (a * b) % n where a * b > 2^256
    // We'll use the fact that we can decompose the multiplication
    // and compute modulo at each step to keep numbers manageable
    
    // Method: Russian peasant multiplication with modulo
    // This computes (a * b) % n without needing full 512-bit arithmetic
    var result_mod: u256 = 0;
    var a_temp = a % n;
    var b_temp = b % n;
    
    while (b_temp > 0) {
        // If b_temp is odd, add a_temp to result
        if ((b_temp & 1) == 1) {
            // result_mod = (result_mod + a_temp) % n
            const add_result = @addWithOverflow(result_mod, a_temp);
            if (add_result[1] != 0) {
                // Handle overflow in addition
                const two_pow_256_mod_n = (~n +% 1) % n;
                const overflow_part = add_result[0];
                result_mod = (overflow_part +% two_pow_256_mod_n) % n;
            } else {
                result_mod = add_result[0] % n;
            }
        }
        
        // Double a_temp (mod n)
        const double_result = @addWithOverflow(a_temp, a_temp);
        if (double_result[1] != 0) {
            // Handle overflow in doubling
            const two_pow_256_mod_n = (~n +% 1) % n;
            const overflow_part = double_result[0];
            a_temp = (overflow_part +% two_pow_256_mod_n) % n;
        } else {
            a_temp = double_result[0] % n;
        }
        
        // Halve b_temp
        b_temp >>= 1;
    }
    
    try error_mapping.stack_push(&frame.stack, result_mod);
    
    return Operation.ExecutionResult{};
}

/// EXP opcode (0x0a): Exponentiation operation
/// 
/// Computes base^exp where base and exp are 256-bit unsigned integers.
/// Result is computed modulo 2^256 (wrapping arithmetic).
/// 
/// ## Stack Requirements
/// - Consumes 2 values: [base, exp] (exp is TOS - top of stack)
/// - Pushes 1 value: base^exp (mod 2^256)
/// 
/// ## Gas Cost
/// - Static: 10 gas base cost
/// - Dynamic: 50 gas per byte in the exponent
///   - If exp = 0, only base cost (10 gas)
///   - If exp = 0xFF, dynamic cost = 50 * 1 = 50 gas (total: 60)
///   - If exp = 0xFFFF, dynamic cost = 50 * 2 = 100 gas (total: 110)
///   - If exp = 2^256-1, dynamic cost = 50 * 32 = 1600 gas (total: 1610)
/// 
/// ## Algorithm: Square-and-Multiply
/// Uses binary exponentiation for efficiency:
/// 1. Start with result = 1
/// 2. For each bit in exp (from LSB to MSB):
///    - If bit is 1: result *= base
///    - Square base for next iteration
/// 3. All operations use wrapping arithmetic (modulo 2^256)
/// 
/// Time complexity: O(log exp) multiplications
pub fn op_exp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;
    
    const base = try error_mapping.stack_pop(&frame.stack);
    const exp = try error_mapping.stack_pop(&frame.stack);
    
    // Calculate dynamic gas cost based on exponent size
    // Gas = 50 * number_of_bytes_in_exponent
    var exp_copy = exp;
    var byte_size: u64 = 0;
    while (exp_copy > 0) : (exp_copy >>= 8) {
        byte_size += 1;
    }
    if (byte_size > 0) {
        const gas_cost = 50 * byte_size;
        try frame.consume_gas(gas_cost);
    }
    
    // Calculate base^exp
    var result: u256 = 1;
    var b = base;
    var e = exp;
    
    while (e > 0) {
        if ((e & 1) == 1) {
            result *%= b;
        }
        b *%= b;
        e >>= 1;
    }
    
    try error_mapping.stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}

pub fn op_signextend(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const byte_num = try error_mapping.stack_pop(&frame.stack);
    const x = try error_mapping.stack_pop(&frame.stack);
    
    // If byte_num >= 31, just return x unchanged
    if (byte_num >= 31) {
        try error_mapping.stack_push(&frame.stack, x);
        return Operation.ExecutionResult{};
    }
    
    const byte_index = @as(u8, @intCast(byte_num));
    const bit_index: u9 = @as(u9, byte_index) * 8 + 7;
    const bit_shift: u8 = @as(u8, @intCast(255 - bit_index));
    
    // Get the sign bit - need to cast bit_index to u8 for shift
    const sign_bit = (x >> @as(u8, @intCast(bit_index))) & 1;
    
    var result = x;
    if (sign_bit == 0) {
        // Clear all bits above bit_index
        const mask = @as(u256, 1) << @as(u8, @intCast(bit_index + 1));
        result &= (mask - 1);
        try error_mapping.stack_push(&frame.stack, result);
        return Operation.ExecutionResult{};
    }
    
    // Sign extend - set all bits above bit_index to 1
    const mask = ~(@as(u256, 0) >> @as(u8, @intCast(bit_shift)));
    result |= mask;
    
    try error_mapping.stack_push(&frame.stack, result);
    
    return Operation.ExecutionResult{};
}