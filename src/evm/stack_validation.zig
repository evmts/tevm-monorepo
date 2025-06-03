const std = @import("std");
const Stack = @import("stack.zig");
const Operation = @import("operation.zig");
const ExecutionError = @import("execution_error.zig");

/// Validates stack requirements before executing an opcode
pub fn validate_stack_requirements(
    stack: *const Stack,
    operation: *const Operation,
) ExecutionError.Error!void {
    const stack_size = stack.size;
    
    // Check minimum stack requirement
    if (stack_size < operation.min_stack) {
        return ExecutionError.Error.StackUnderflow;
    }
    
    // Check maximum stack requirement
    // max_stack represents the maximum stack size allowed BEFORE the operation
    // to ensure we don't overflow after the operation completes
    if (stack_size > operation.max_stack) {
        return ExecutionError.Error.StackOverflow;
    }
}

/// Validates stack requirements for operations that pop and push
/// This is a more detailed validation that considers the net stack effect
pub fn validate_stack_operation(
    stack: *const Stack,
    pop_count: u32,
    push_count: u32,
) ExecutionError.Error!void {
    const stack_size = stack.size;
    
    // Check if we have enough items to pop
    if (stack_size < pop_count) {
        return ExecutionError.Error.StackUnderflow;
    }
    
    // Calculate stack size after operation
    const new_size = stack_size - pop_count + push_count;
    
    // Check if result would overflow
    if (new_size > Stack.CAPACITY) {
        return ExecutionError.Error.StackOverflow;
    }
}

/// Helper to calculate max_stack for an operation
/// max_stack = CAPACITY - (push_count - pop_count)
/// This ensures we have room for the net stack growth
pub fn calculate_max_stack(pop_count: u32, push_count: u32) u32 {
    if (push_count > pop_count) {
        const net_growth = push_count - pop_count;
        return @intCast(Stack.CAPACITY - net_growth);
    }
    // If operation reduces stack or is neutral, max is CAPACITY
    return Stack.CAPACITY;
}

/// Batch validation for common patterns
pub const ValidationPatterns = struct {
    /// Binary operation (pop 2, push 1)
    pub fn validate_binary_op(stack: *const Stack) ExecutionError.Error!void {
        return validate_stack_operation(stack, 2, 1);
    }
    
    /// Ternary operation (pop 3, push 1)
    pub fn validate_ternary_op(stack: *const Stack) ExecutionError.Error!void {
        return validate_stack_operation(stack, 3, 1);
    }
    
    /// Comparison operation (pop 2, push 1)
    pub fn validate_comparison_op(stack: *const Stack) ExecutionError.Error!void {
        return validate_stack_operation(stack, 2, 1);
    }
    
    /// Unary operation (pop 1, push 1)
    pub fn validate_unary_op(stack: *const Stack) ExecutionError.Error!void {
        return validate_stack_operation(stack, 1, 1);
    }
    
    /// DUP operation validation
    pub fn validate_dup(stack: *const Stack, n: u32) ExecutionError.Error!void {
        // DUP pops 0 and pushes 1
        if (stack.size < n) {
            return ExecutionError.Error.StackUnderflow;
        }
        if (stack.size >= Stack.CAPACITY) {
            return ExecutionError.Error.StackOverflow;
        }
    }
    
    /// SWAP operation validation
    pub fn validate_swap(stack: *const Stack, n: u32) ExecutionError.Error!void {
        // SWAP needs at least n+1 items on stack
        if (stack.size <= n) {
            return ExecutionError.Error.StackUnderflow;
        }
    }
    
    /// PUSH operation validation
    pub fn validate_push(stack: *const Stack) ExecutionError.Error!void {
        if (stack.size >= Stack.CAPACITY) {
            return ExecutionError.Error.StackOverflow;
        }
    }
};

// Tests
const testing = std.testing;

test "validate_stack_requirements" {
    var stack = Stack{};
    
    // Test underflow
    const op_needs_2 = Operation{
        .execute = undefined,
        .constant_gas = 3,
        .min_stack = 2,
        .max_stack = Stack.CAPACITY - 1,
    };
    
    try testing.expectError(ExecutionError.Error.StackUnderflow, validate_stack_requirements(&stack, &op_needs_2));
    
    // Add items and test success
    try stack.append(1);
    try stack.append(2);
    try validate_stack_requirements(&stack, &op_needs_2);
    
    // Test overflow
    const op_max_10 = Operation{
        .execute = undefined,
        .constant_gas = 3,
        .min_stack = 0,
        .max_stack = 10,
    };
    
    // Fill stack beyond max_stack
    var i: usize = 2;
    while (i < 11) : (i += 1) {
        try stack.append(@intCast(i));
    }
    
    try testing.expectError(ExecutionError.Error.StackOverflow, validate_stack_requirements(&stack, &op_max_10));
}

test "validate_stack_operation" {
    var stack = Stack{};
    
    // Test underflow
    try testing.expectError(ExecutionError.Error.StackUnderflow, validate_stack_operation(&stack, 2, 1));
    
    // Add items
    try stack.append(10);
    try stack.append(20);
    
    // Binary op should succeed
    try validate_stack_operation(&stack, 2, 1);
    
    // Test overflow - fill stack almost to capacity
    stack.size = Stack.CAPACITY - 1;
    
    // Operation that would overflow
    try testing.expectError(ExecutionError.Error.StackOverflow, validate_stack_operation(&stack, 0, 2));
}

test "calculate_max_stack" {
    // Binary operations (pop 2, push 1) - net decrease of 1
    try testing.expectEqual(@as(u32, Stack.CAPACITY), calculate_max_stack(2, 1));
    
    // Push operations (pop 0, push 1) - net increase of 1
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 1), calculate_max_stack(0, 1));
    
    // DUP operations (pop 0, push 1) - net increase of 1
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 1), calculate_max_stack(0, 1));
    
    // Operations that push more than pop
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 3), calculate_max_stack(1, 4));
}

test "ValidationPatterns" {
    var stack = Stack{};
    
    // Test binary op validation
    try testing.expectError(ExecutionError.Error.StackUnderflow, ValidationPatterns.validate_binary_op(&stack));
    try stack.append(1);
    try stack.append(2);
    try ValidationPatterns.validate_binary_op(&stack);
    
    // Test DUP validation
    try testing.expectError(ExecutionError.Error.StackUnderflow, ValidationPatterns.validate_dup(&stack, 3));
    try ValidationPatterns.validate_dup(&stack, 2);
    
    // Test SWAP validation
    try testing.expectError(ExecutionError.Error.StackUnderflow, ValidationPatterns.validate_swap(&stack, 2));
    try ValidationPatterns.validate_swap(&stack, 1);
    
    // Test PUSH validation at capacity
    stack.size = Stack.CAPACITY;
    try testing.expectError(ExecutionError.Error.StackOverflow, ValidationPatterns.validate_push(&stack));
}