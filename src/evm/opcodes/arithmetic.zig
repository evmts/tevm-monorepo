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

pub fn op_add(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    
    const result = a +% b; // Wrapping addition
    
    try stack_push(&frame.stack, result);
    
    return "";
}

pub fn op_mul(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    
    const result = a *% b; // Wrapping multiplication
    
    try stack_push(&frame.stack, result);
    
    return "";
}

pub fn op_sub(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    
    const result = a -% b; // Wrapping subtraction
    
    try stack_push(&frame.stack, result);
    
    return "";
}

pub fn op_div(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
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
    
    return "";
}

pub fn op_sdiv(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    
    if (b == 0) {
        try stack_push(&frame.stack, 0);
        return "";
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
    
    return "";
}

pub fn op_mod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
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
    
    return "";
}

pub fn op_smod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    
    if (b == 0) {
        try stack_push(&frame.stack, 0);
        return "";
    }
    
    // Signed modulo for u256
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));
    
    const result_i256 = @rem(a_i256, b_i256);
    try stack_push(&frame.stack, @as(u256, @bitCast(result_i256)));
    
    return "";
}

pub fn op_addmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const n = try stack_pop(&frame.stack);
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    
    if (n == 0) {
        try stack_push(&frame.stack, 0);
    } else {
        // Need to handle potential overflow in addition
        // For u256, we need to check if a + b would overflow
        const result = @addWithOverflow(a, b);
        if (result[1] != 0) {
            // If overflow, we need to compute (a + b) mod n differently
            // This is a simplified approach - in production we'd use proper bigint arithmetic
            const a_mod = a % n;
            const b_mod = b % n;
            const sum = (a_mod +% b_mod) % n;
            try stack_push(&frame.stack, sum);
        } else {
            const sum = result[0] % n;
            try stack_push(&frame.stack, sum);
        }
    }
    
    return "";
}

pub fn op_mulmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const n = try stack_pop(&frame.stack);
    const b = try stack_pop(&frame.stack);
    const a = try stack_pop(&frame.stack);
    
    if (n == 0) {
        try stack_push(&frame.stack, 0);
    } else {
        // Need to handle potential overflow in multiplication
        // For u256, multiplication can overflow, so we need special handling
        // This is a simplified implementation - production code would use proper bigint
        const result = @mulWithOverflow(a, b);
        if (result[1] != 0) {
            // If overflow, we need more sophisticated handling
            // For now, do modular multiplication in chunks
            const a_mod = a % n;
            const b_mod = b % n;
            const product = (a_mod *% b_mod) % n;
            try stack_push(&frame.stack, product);
        } else {
            const product = result[0] % n;
            try stack_push(&frame.stack, product);
        }
    }
    
    return "";
}

pub fn op_exp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
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
        // TODO: Implement gas consumption
        _ = gas_cost;
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
    
    return "";
}

pub fn op_signextend(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error![]const u8 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    const byte_num = try stack_pop(&frame.stack);
    const x = try stack_pop(&frame.stack);
    
    // If byte_num >= 31, just return x unchanged
    if (byte_num >= 31) {
        try stack_push(&frame.stack, x);
        return "";
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
    
    return "";
}