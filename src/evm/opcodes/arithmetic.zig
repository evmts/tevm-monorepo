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

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    // The .*; dereferences the pointer returned by peek_unsafe()
    const a = frame.stack.peek_unsafe().*;

    const sum = a +% b;

    // Modify the current top of the stack (which was a's slot) in-place with the sum
    frame.stack.set_top_unsafe(sum);

    return Operation.ExecutionResult{};
}

pub fn op_mul(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    const product = a *% b;

    // Modify the current top of the stack (which was a's slot) in-place with the product
    frame.stack.set_top_unsafe(product);

    return Operation.ExecutionResult{};
}

pub fn op_sub(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // EVM SUB computes: a - b (where a was second from top, b was top)
    const result = a -% b;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    // Store for testing
    vm.last_stack_value = result;

    return Operation.ExecutionResult{};
}

pub fn op_div(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // EVM DIV: a / b with division by zero returning 0
    const result = if (b == 0) 0 else a / b;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_sdiv(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (b == 0) {
        result = 0;
    } else {
        // Signed division for u256
        const a_i256 = @as(i256, @bitCast(a));
        const b_i256 = @as(i256, @bitCast(b));
        // Special case: division overflow
        const min_i256 = @as(i256, 1) << 255;
        if (a_i256 == min_i256 and b_i256 == -1) {
            result = @as(u256, @bitCast(min_i256));
        } else {
            const result_i256 = @divTrunc(a_i256, b_i256);
            result = @as(u256, @bitCast(result_i256));
        }
    }

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_mod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // EVM MOD: a % b with modulo by zero returning 0
    const result = if (b == 0) 0 else a % b;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_smod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (b == 0) {
        result = 0;
    } else {
        // Signed modulo for u256
        const a_i256 = @as(i256, @bitCast(a));
        const b_i256 = @as(i256, @bitCast(b));
        const result_i256 = @rem(a_i256, b_i256);
        result = @as(u256, @bitCast(result_i256));
    }

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_addmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 3);

    // Pop three operands: n (modulus), b (second addend), a (first addend)
    const n = frame.stack.pop_unsafe(); // First pop: modulus
    const b = frame.stack.pop_unsafe(); // Second pop: second addend
    // Peek the remaining operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (n == 0) {
        result = 0;
    } else {
        // The EVM ADDMOD operation computes (a + b) % n
        // Since we're working with u256, overflow wraps automatically
        // So (a +% b) gives us (a + b) mod 2^256
        // Then we just need to compute that result mod n
        const sum = a +% b; // Wrapping addition
        result = sum % n;
    }

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_mulmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 3);

    // Pop three operands: n (modulus), b (second multiplicand), a (first multiplicand)
    const n = frame.stack.pop_unsafe(); // First pop: modulus
    const b = frame.stack.pop_unsafe(); // Second pop: second multiplicand
    // Peek the remaining operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (n == 0) {
        result = 0;
    } else {
        // For MULMOD, we need to compute (a * b) % n where a * b might overflow
        // We can't just do (a *% b) % n because that would give us ((a * b) % 2^256) % n
        // which is not the same as (a * b) % n when a * b >= 2^256

        // We'll use the Russian peasant multiplication algorithm with modular reduction
        // This allows us to compute (a * b) % n without needing the full 512-bit product
        result = 0;
        var x = a % n; // Reduce a modulo n first
        var y = b % n; // Reduce b modulo n first

        while (y > 0) {
            // If y is odd, add x to result (mod n)
            if ((y & 1) == 1) {
                // result = (result + x) % n
                const sum = result +% x; // Wrapping addition
                result = sum % n;
            }

            // Double x (mod n)
            x = (x +% x) % n;

            // Halve y
            y >>= 1;
        }
    }

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_exp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (exp) unsafely
    const exp = frame.stack.pop_unsafe();
    // Peek the remaining operand (base) unsafely
    const base = frame.stack.peek_unsafe().*;

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

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_signextend(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);

    // Pop the top operand (byte_num) unsafely
    const byte_num = frame.stack.pop_unsafe();
    // Peek the remaining operand (x) unsafely
    const x = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    // If byte_num >= 31, just return x unchanged
    if (byte_num >= 31) {
        result = x;
    } else {
        const byte_index = @as(u8, @intCast(byte_num));
        // The sign bit is at position (byte_index * 8 + 7)
        const sign_bit_pos = byte_index * 8 + 7;

        // Get the sign bit
        const sign_bit = (x >> @intCast(sign_bit_pos)) & 1;

        // Create a mask for the bits we want to keep (0 to sign_bit_pos)
        const keep_bits = sign_bit_pos + 1;

        if (sign_bit == 1) {
            // Sign bit is 1, extend with 1s
            // First, create a mask of all 1s for the upper bits
            if (keep_bits >= 256) {
                result = x;
            } else {
                const shift_amount = @as(u9, 256) - @as(u9, keep_bits);
                const ones_mask = ~(@as(u256, 0) >> @intCast(shift_amount));
                result = x | ones_mask;
            }
        } else {
            // Sign bit is 0, extend with 0s (just mask out upper bits)
            if (keep_bits >= 256) {
                result = x;
            } else {
                const zero_mask = (@as(u256, 1) << @intCast(keep_bits)) - 1;
                result = x & zero_mask;
            }
        }
    }

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
