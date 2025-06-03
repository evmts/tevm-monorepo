const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");

// Helper to convert Stack errors to ExecutionError
inline fn stack_pop(stack: *Stack) ExecutionError.Error!u256 {
    return stack.pop() catch |err| switch (err) {
        Stack.Error.Underflow => return ExecutionError.Error.StackUnderflow,
        else => return ExecutionError.Error.StackUnderflow,
    };
}

inline fn stack_push(stack: *Stack, value: u256) ExecutionError.Error!void {
    return stack.append(value) catch |err| switch (err) {
        Stack.Error.Overflow => return ExecutionError.Error.StackOverflow,
        else => return ExecutionError.Error.StackOverflow,
    };
}

pub fn op_add(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const values = frame.stack.pop2() catch |err| switch (err) {
        Stack.Error.OutOfBounds => return ExecutionError.Error.StackUnderflow,
        else => return ExecutionError.Error.StackUnderflow,
    };
    const sum = values.a +% values.b;
    try stack_push(&frame.stack, sum);
    return Operation.ExecutionResult{};
}

pub fn op_mul(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    const result = a *% b; // Wrapping multiplication
    try stack_push(&frame.stack, result);
    return Operation.ExecutionResult{};
}

pub fn op_sub(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const a = try stack_pop(&frame.stack); // First value popped from stack (top item)
    const b = try stack_pop(&frame.stack); // Second value popped from stack (item below top)

    // EVM standard: SUB pops two values and computes first_popped - second_popped
    const result = a -% b;
    try stack_push(&frame.stack, result);

    return Operation.ExecutionResult{};
}

pub fn op_div(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    if (b == 0) {
        try stack_push(&frame.stack, 0);
    } else {
        try stack_push(&frame.stack, a / b);
    }
    return Operation.ExecutionResult{};
}

pub fn op_sdiv(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    if (b == 0) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }
    // Signed division for u256
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));
    // Special case: division overflow
    const min_i256 = @as(i256, 1) << 255;
    if (a_i256 == min_i256 and b_i256 == -1) {
        try stack_push(&frame.stack, @as(u256, @bitCast(min_i256)));
    } else {
        const result_i256 = @divTrunc(a_i256, b_i256);
        try stack_push(&frame.stack, @as(u256, @bitCast(result_i256)));
    }
    return Operation.ExecutionResult{};
}

pub fn op_mod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    if (b == 0) {
        try stack_push(&frame.stack, 0);
    } else {
        try stack_push(&frame.stack, a % b);
    }
    return Operation.ExecutionResult{};
}

pub fn op_smod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    if (b == 0) {
        try stack_push(&frame.stack, 0);
        return Operation.ExecutionResult{};
    }
    // Signed modulo for u256
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));
    const result_i256 = @rem(a_i256, b_i256);
    try stack_push(&frame.stack, @as(u256, @bitCast(result_i256)));
    return Operation.ExecutionResult{};
}

pub fn op_addmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const a = try stack_pop(&frame.stack);
    const b = try stack_pop(&frame.stack);
    const n = try stack_pop(&frame.stack);
    if (n == 0) {
        try stack_push(&frame.stack, 0);
    } else {
        // Proper implementation of (a + b) % n handling overflow
        // We use the property: (a + b) % n = ((a % n) + (b % n)) % n
        // But we need to handle the case where (a % n) + (b % n) overflows
        const a_mod = a % n;
        const b_mod = b % n;
        // Check if a_mod + b_mod would overflow
        const sum_result = @addWithOverflow(a_mod, b_mod);
        if (sum_result[1] != 0) {
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
            const overflow_part = sum_result[0]; // This is (a_mod + b_mod) - 2^256 due to wrapping
            const result = (overflow_part +% two_pow_256_mod_n) % n;
            try stack_push(&frame.stack, result);
        } else {
            // No overflow, simple case
            const sum = sum_result[0] % n;
            try stack_push(&frame.stack, sum);
        }
    }
    return Operation.ExecutionResult{};
}

pub fn op_mulmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const a = try stack_pop(&frame.stack);
    const b = try stack_pop(&frame.stack);
    const n = try stack_pop(&frame.stack);
    if (n == 0) {
        try stack_push(&frame.stack, 0);
    } else {
        // For multiplication, we can't use the same trick as addition
        // We need to use a different approach based on decomposition
        // First, check if we can do it without overflow
        const result = @mulWithOverflow(a, b);
        if (result[1] == 0) {
            // No overflow, simple case
            const product = result[0] % n;
            try stack_push(&frame.stack, product);
        } else {
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

            try stack_push(&frame.stack, result_mod);
        }
    }

    return Operation.ExecutionResult{};
}

pub fn op_exp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;

    const exp = try stack_pop(&frame.stack);
    const base = try stack_pop(&frame.stack);

    // Calculate dynamic gas cost based on exponent size
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

    try stack_push(&frame.stack, result);

    return Operation.ExecutionResult{};
}

pub fn op_signextend(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    const byte_num = try stack_pop(&frame.stack);
    const x = try stack_pop(&frame.stack);

    // If byte_num >= 31, just return x unchanged
    if (byte_num >= 31) {
        try stack_push(&frame.stack, x);
        return Operation.ExecutionResult{};
    }

    const byte_index = @as(u8, @intCast(byte_num));
    const bit_index: u9 = @as(u9, byte_index) * 8 + 7;
    const bit_shift: u8 = @as(u8, @intCast(255 - bit_index));

    // Get the sign bit - need to cast bit_index to u8 for shift
    const sign_bit = (x >> @as(u8, @intCast(bit_index))) & 1;

    var result = x;
    if (sign_bit == 1) {
        // Sign extend - set all bits above bit_index to 1
        const mask = ~(@as(u256, 0) >> @as(u8, @intCast(bit_shift)));
        result |= mask;
    } else {
        // Clear all bits above bit_index
        const mask = @as(u256, 1) << @as(u8, @intCast(bit_index + 1));
        result &= (mask - 1);
    }

    try stack_push(&frame.stack, result);

    return Operation.ExecutionResult{};
}
