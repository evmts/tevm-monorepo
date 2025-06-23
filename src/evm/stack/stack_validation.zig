const std = @import("std");
const Stack = @import("stack.zig");
const Operation = @import("../opcodes/operation.zig").Operation;
const ExecutionError = @import("../execution/execution_error.zig");
const Log = @import("../log.zig");

/// Stack validation utilities for EVM operations.
///
/// This module provides validation functions to ensure stack operations
/// will succeed before attempting them. This is crucial for:
/// - Preventing execution errors
/// - Enabling optimized unsafe operations after validation
/// - Maintaining EVM correctness
///
/// ## Validation Strategy
/// The EVM uses two-phase validation:
/// 1. Pre-execution validation (this module)
/// 2. Unsafe operations after validation passes
///
/// This allows opcodes to use fast unsafe operations in hot paths
/// while maintaining safety guarantees.
///
/// ## Stack Limits
/// The EVM enforces strict stack limits:
/// - Maximum depth: 1024 elements
/// - Underflow: Cannot pop from empty stack
/// - Overflow: Cannot exceed maximum depth
pub const ValidationPatterns = @import("validation_patterns.zig");

/// Validates stack requirements using Operation metadata.
///
/// Each EVM operation has min_stack and max_stack requirements:
/// - min_stack: Minimum elements needed on stack
/// - max_stack: Maximum allowed before operation (to prevent overflow)
///
/// @param stack The stack to validate
/// @param operation The operation with stack requirements
/// @throws StackUnderflow if stack has fewer than min_stack elements
/// @throws StackOverflow if stack has more than max_stack elements
///
/// Example:
/// ```zig
/// // Validate before executing an opcode
/// try validate_stack_requirements(&frame.stack, &operation);
/// // Safe to use unsafe operations now
/// operation.execute(&frame);
/// ```
pub fn validate_stack_requirements(
    stack: *const Stack,
    operation: *const Operation,
) ExecutionError.Error!void {
    const stack_size = stack.size;
    Log.debug("StackValidation.validate_stack_requirements: Validating stack, size={}, min_required={}, max_allowed={}", .{ stack_size, operation.min_stack, operation.max_stack });

    // Check minimum stack requirement
    if (stack_size < operation.min_stack) {
        @branchHint(.cold);
        Log.debug("StackValidation.validate_stack_requirements: Stack underflow, size={} < min_stack={}", .{ stack_size, operation.min_stack });
        return ExecutionError.Error.StackUnderflow;
    }

    // Check maximum stack requirement
    // max_stack represents the maximum stack size allowed BEFORE the operation
    // to ensure we don't overflow after the operation completes
    if (stack_size > operation.max_stack) {
        @branchHint(.cold);
        Log.debug("StackValidation.validate_stack_requirements: Stack overflow, size={} > max_stack={}", .{ stack_size, operation.max_stack });
        return ExecutionError.Error.StackOverflow;
    }
    
    Log.debug("StackValidation.validate_stack_requirements: Validation passed", .{});
}

/// Validates stack has capacity for pop/push operations.
///
/// More flexible than validate_stack_requirements, this function
/// validates arbitrary pop/push counts. Used by:
/// - Dynamic operations (e.g., LOG with variable topics)
/// - Custom validation logic
/// - Testing and debugging
///
/// @param stack The stack to validate
/// @param pop_count Number of elements to pop
/// @param push_count Number of elements to push
/// @throws StackUnderflow if stack has < pop_count elements
/// @throws StackOverflow if operation would exceed capacity
///
/// Example:
/// ```zig
/// // Validate LOG3 operation (pops 5, pushes 0)
/// try validate_stack_operation(&stack, 5, 0);
/// ```
pub fn validate_stack_operation(
    stack: *const Stack,
    pop_count: u32,
    push_count: u32,
) ExecutionError.Error!void {
    const stack_size = stack.size;
    Log.debug("StackValidation.validate_stack_operation: Validating operation, stack_size={}, pop_count={}, push_count={}", .{ stack_size, pop_count, push_count });

    // Check if we have enough items to pop
    if (stack_size < pop_count) {
        @branchHint(.cold);
        Log.debug("StackValidation.validate_stack_operation: Stack underflow, size={} < pop_count={}", .{ stack_size, pop_count });
        return ExecutionError.Error.StackUnderflow;
    }

    // Calculate stack size after operation
    const new_size = stack_size - pop_count + push_count;

    // Check if result would overflow
    if (new_size > Stack.CAPACITY) {
        @branchHint(.cold);
        Log.debug("StackValidation.validate_stack_operation: Stack overflow, new_size={} > capacity={}", .{ new_size, Stack.CAPACITY });
        return ExecutionError.Error.StackOverflow;
    }
    
    Log.debug("StackValidation.validate_stack_operation: Validation passed, new_size={}", .{new_size});
}

/// Calculate the maximum allowed stack size for an operation.
///
/// The max_stack value ensures that after an operation completes,
/// the stack won't exceed capacity. This is calculated as:
/// - If operation grows stack: CAPACITY - net_growth
/// - If operation shrinks/neutral: CAPACITY
///
/// @param pop_count Number of elements operation pops
/// @param push_count Number of elements operation pushes
/// @return Maximum allowed stack size before operation
///
/// Example:
/// ```zig
/// // PUSH1 operation (pop 0, push 1)
/// const max = calculate_max_stack(0, 1); // Returns 1023
/// // Stack must have <= 1023 elements before PUSH1
/// ```
pub fn calculate_max_stack(pop_count: u32, push_count: u32) u32 {
    if (push_count > pop_count) {
        @branchHint(.likely);
        const net_growth = push_count - pop_count;
        return @intCast(Stack.CAPACITY - net_growth);
    }
    // If operation reduces stack or is neutral, max is CAPACITY
    return Stack.CAPACITY;
}


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
