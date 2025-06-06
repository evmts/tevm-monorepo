const Stack = @import("stack.zig");
const ExecutionError = @import("execution_error.zig");

/// Batch validation for common patterns
const Self = @This();

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

// Import the helper function
const validate_stack_operation = @import("stack_validation.zig").validate_stack_operation;