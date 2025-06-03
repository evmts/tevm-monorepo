const std = @import("std");
const Operation = @import("../operation.zig");
const ExecutionError = @import("../execution_error.zig");
const Stack = @import("../stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");

// Optimized arithmetic operations using batched stack operations

/// Optimized ADD operation using batched stack operations
pub fn op_add_optimized(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // For hot paths where we've already validated stack requirements
    if (frame.stack.size < 2) {
        // Fallback to safe version
        const values = frame.stack.pop2() catch return ExecutionError.Error.StackUnderflow;
        const sum = values.a +% values.b;
        frame.stack.append(sum) catch return ExecutionError.Error.StackOverflow;
        return Operation.ExecutionResult{};
    }
    
    // Use unsafe batched operation
    const values = frame.stack.pop2_unsafe();
    const sum = values.a +% values.b;
    frame.stack.append_unsafe(sum);
    
    return Operation.ExecutionResult{};
}

/// Optimized MUL operation  
pub fn op_mul_optimized(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    if (frame.stack.size < 2) {
        const values = frame.stack.pop2() catch return ExecutionError.Error.StackUnderflow;
        const product = values.a *% values.b;
        frame.stack.append(product) catch return ExecutionError.Error.StackOverflow;
        return Operation.ExecutionResult{};
    }
    
    const values = frame.stack.pop2_unsafe();
    const product = values.a *% values.b;
    frame.stack.append_unsafe(product);
    
    return Operation.ExecutionResult{};
}

/// Optimized SUB operation
pub fn op_sub_optimized(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    if (frame.stack.size < 2) {
        const values = frame.stack.pop2() catch return ExecutionError.Error.StackUnderflow;
        const diff = values.a -% values.b;
        frame.stack.append(diff) catch return ExecutionError.Error.StackOverflow;
        return Operation.ExecutionResult{};
    }
    
    const values = frame.stack.pop2_unsafe();
    const diff = values.a -% values.b;
    frame.stack.append_unsafe(diff);
    
    return Operation.ExecutionResult{};
}

/// Optimized ADDMOD operation using pop3_push1
pub fn op_addmod_optimized(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    if (frame.stack.size < 3) {
        // Safe fallback
        const values = frame.stack.pop3_push1(0) catch |err| switch (err) {
            Stack.Error.OutOfBounds => return ExecutionError.Error.StackUnderflow,
            else => return ExecutionError.Error.StackUnderflow,
        };
        
        const n = values.c;
        if (n == 0) return Operation.ExecutionResult{};
        
        const a = values.a;
        const b = values.b;
        var result: u256 = undefined;
        
        if (a >= n) {
            const a_mod = a % n;
            if (b >= n) {
                result = addmod_inner(a_mod, b % n, n);
            } else {
                result = addmod_inner(a_mod, b, n);
            }
        } else if (b >= n) {
            result = addmod_inner(a, b % n, n);
        } else {
            result = addmod_inner(a, b, n);
        }
        
        frame.stack.data[frame.stack.size - 1] = result;
        return Operation.ExecutionResult{};
    }
    
    const values = frame.stack.pop3_push1_unsafe(0);
    const n = values.c;
    
    if (n == 0) {
        // Result already pushed as 0
        return Operation.ExecutionResult{};
    }
    
    // Calculate (a + b) % n handling overflow
    const a = values.a;
    const b = values.b;
    var result: u256 = undefined;
    
    if (a >= n) {
        const a_mod = a % n;
        if (b >= n) {
            result = addmod_inner(a_mod, b % n, n);
        } else {
            result = addmod_inner(a_mod, b, n);
        }
    } else if (b >= n) {
        result = addmod_inner(a, b % n, n);
    } else {
        result = addmod_inner(a, b, n);
    }
    
    // Update the pushed value
    frame.stack.data[frame.stack.size - 1] = result;
    
    return Operation.ExecutionResult{};
}

// Helper function for ADDMOD
fn addmod_inner(a: u256, b: u256, n: u256) u256 {
    if (a + b >= a) {
        return (a + b) % n;
    }
    
    // Overflow occurred
    const complement = @as(u256, @bitCast(@as(i256, -@as(i256, @intCast(n)))));
    return (a % n + b % n + complement % n) % n;
}

/// Comparison operations can benefit from pop2 without push
pub fn op_lt_optimized(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    if (frame.stack.size < 2) {
        const values = frame.stack.pop2() catch return ExecutionError.Error.StackUnderflow;
        const result: u256 = if (values.a < values.b) 1 else 0;
        frame.stack.append(result) catch return ExecutionError.Error.StackOverflow;
        return Operation.ExecutionResult{};
    }
    
    const values = frame.stack.pop2_unsafe();
    const result: u256 = if (values.a < values.b) 1 else 0;
    frame.stack.append_unsafe(result);
    
    return Operation.ExecutionResult{};
}

/// Unary operations can use pop1_push1
pub fn op_not_optimized(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    if (frame.stack.size < 1) {
        const value = frame.stack.pop1_push1(0) catch return ExecutionError.Error.StackUnderflow;
        const result = ~value;
        frame.stack.data[frame.stack.size - 1] = result;
        return Operation.ExecutionResult{};
    }
    
    const value = frame.stack.pop1_push1_unsafe(0);
    const result = ~value;
    frame.stack.data[frame.stack.size - 1] = result;
    
    return Operation.ExecutionResult{};
}

/// Example of using peek_multiple for operations that need to examine stack without modifying
pub fn op_gas_estimation(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!u64 {
    _ = pc;
    _ = interpreter;
    
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    
    // For an operation that needs to look at top 3 values to estimate gas
    if (frame.stack.size < 3) {
        return 0;
    }
    
    const values = try frame.stack.peek_multiple(3);
    // Use values[0], values[1], values[2] for gas calculation
    return calculate_dynamic_gas(values[0], values[1], values[2]);
}

fn calculate_dynamic_gas(a: u256, b: u256, c: u256) u64 {
    _ = a;
    _ = b; 
    _ = c;
    // Placeholder for actual gas calculation
    return 100;
}