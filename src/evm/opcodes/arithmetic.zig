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
    
    // Direct access - no error handling needed
    const b = frame.stack.data[frame.stack.size - 1];
    const a = frame.stack.data[frame.stack.size - 2];
    frame.stack.size -= 1;
    
    // Modify in-place (now at top of stack)
    frame.stack.data[frame.stack.size - 1] = a +% b;
    
    return Operation.ExecutionResult{};
}

pub fn op_mul(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);
    
    // Direct access - no error handling needed
    const b = frame.stack.data[frame.stack.size - 1];
    const a = frame.stack.data[frame.stack.size - 2];
    frame.stack.size -= 1;
    
    // Modify in-place (now at top of stack)
    frame.stack.data[frame.stack.size - 1] = a *% b;
    
    return Operation.ExecutionResult{};
}

pub fn op_sub(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);
    
    // Direct access - no error handling needed
    const b = frame.stack.data[frame.stack.size - 1];
    const a = frame.stack.data[frame.stack.size - 2];
    frame.stack.size -= 1;
    
    // Modify in-place (now at top of stack)
    const result = a -% b;
    frame.stack.data[frame.stack.size - 1] = result;
    
    // Store for testing
    vm.last_stack_value = result;
    
    // Debug logging
    std.debug.print("\nSUB operation: a={}, b={}, result={}\n", .{a, b, result});

    return Operation.ExecutionResult{};
}

pub fn op_div(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);
    
    // Direct access - no error handling needed
    const b = frame.stack.data[frame.stack.size - 1];
    const a = frame.stack.data[frame.stack.size - 2];
    frame.stack.size -= 1;
    
    // Modify in-place (now at top of stack)
    if (b == 0) {
        frame.stack.data[frame.stack.size - 1] = 0;
    } else {
        frame.stack.data[frame.stack.size - 1] = a / b;
    }
    return Operation.ExecutionResult{};
}

pub fn op_sdiv(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);
    
    // Direct access - no error handling needed
    const b = frame.stack.data[frame.stack.size - 1];
    const a = frame.stack.data[frame.stack.size - 2];
    frame.stack.size -= 1;
    
    // Get pointer to result location (now at top of stack)
    const result_ptr = &frame.stack.data[frame.stack.size - 1];
    
    if (b == 0) {
        result_ptr.* = 0;
        return Operation.ExecutionResult{};
    }
    
    // Signed division for u256
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));
    // Special case: division overflow
    const min_i256 = @as(i256, 1) << 255;
    if (a_i256 == min_i256 and b_i256 == -1) {
        result_ptr.* = @as(u256, @bitCast(min_i256));
    } else {
        const result_i256 = @divTrunc(a_i256, b_i256);
        result_ptr.* = @as(u256, @bitCast(result_i256));
    }
    return Operation.ExecutionResult{};
}

pub fn op_mod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // Debug-only bounds check - compiled out in release builds
    std.debug.assert(frame.stack.size >= 2);
    
    // Direct access - no error handling needed
    const b = frame.stack.data[frame.stack.size - 1];
    const a = frame.stack.data[frame.stack.size - 2];
    frame.stack.size -= 1;
    
    // Modify in-place (now at top of stack)
    if (b == 0) {
        frame.stack.data[frame.stack.size - 1] = 0;
    } else {
        frame.stack.data[frame.stack.size - 1] = a % b;
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
    const n = try stack_pop(&frame.stack);  // First pop: modulus
    const b = try stack_pop(&frame.stack);  // Second pop: second addend
    const a = try stack_pop(&frame.stack);  // Third pop: first addend
    
    if (n == 0) {
        try stack_push(&frame.stack, 0);
    } else {
        // The EVM ADDMOD operation computes (a + b) % n
        // Since we're working with u256, overflow wraps automatically
        // So (a +% b) gives us (a + b) mod 2^256
        // Then we just need to compute that result mod n
        const sum = a +% b;  // Wrapping addition
        const result = sum % n;
        try stack_push(&frame.stack, result);
    }
    return Operation.ExecutionResult{};
}

pub fn op_mulmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const n = try stack_pop(&frame.stack);  // First pop: modulus
    const b = try stack_pop(&frame.stack);  // Second pop: second multiplicand
    const a = try stack_pop(&frame.stack);  // Third pop: first multiplicand
    if (n == 0) {
        try stack_push(&frame.stack, 0);
    } else {
        // For MULMOD, we need to compute (a * b) % n where a * b might overflow
        // We can't just do (a *% b) % n because that would give us ((a * b) % 2^256) % n
        // which is not the same as (a * b) % n when a * b >= 2^256
        
        // We'll use the Russian peasant multiplication algorithm with modular reduction
        // This allows us to compute (a * b) % n without needing the full 512-bit product
        var result: u256 = 0;
        var x = a % n;  // Reduce a modulo n first
        var y = b % n;  // Reduce b modulo n first
        
        while (y > 0) {
            // If y is odd, add x to result (mod n)
            if ((y & 1) == 1) {
                // result = (result + x) % n
                const sum = result +% x;  // Wrapping addition
                result = sum % n;
            }
            
            // Double x (mod n)
            x = (x +% x) % n;
            
            // Halve y
            y >>= 1;
        }
        
        try stack_push(&frame.stack, result);
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
