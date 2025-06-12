const Stack = @import("stack.zig");
const ExecutionError = @import("../execution/execution_error.zig");
const Log = @import("../log.zig");

/// Common validation patterns for EVM stack operations.
///
/// This module provides optimized validation functions for frequently used
/// stack operation patterns in the EVM. These functions check stack requirements
/// before operations execute, preventing stack underflow/overflow errors.
///
/// ## Design Philosophy
/// Rather than repeating validation logic across opcodes, these functions
/// encapsulate common patterns:
/// - Binary operations: pop 2, push 1 (ADD, MUL, SUB, etc.)
/// - Ternary operations: pop 3, push 1 (ADDMOD, MULMOD, etc.)
/// - Comparison operations: pop 2, push 1 (LT, GT, EQ, etc.)
/// - Unary operations: pop 1, push 1 (NOT, ISZERO, etc.)
///
/// ## Performance
/// These validation functions are designed to be inlined by the compiler,
/// making them zero-cost abstractions over direct validation code.

/// Validates stack requirements for binary operations.
///
/// Binary operations consume two stack items and produce one result.
/// This pattern is used by arithmetic operations like ADD, MUL, SUB, DIV,
/// and bitwise operations like AND, OR, XOR.
///
/// @param stack The stack to validate
/// @return Error if stack has fewer than 2 items or would overflow
///
/// Example:
/// ```zig
/// // Before ADD operation
/// try validate_binary_op(&frame.stack);
/// const b = frame.stack.pop();
/// const a = frame.stack.pop();
/// frame.stack.push(a + b);
/// ```
pub fn validate_binary_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 2, 1);
}

/// Validates stack requirements for ternary operations.
///
/// Ternary operations consume three stack items and produce one result.
/// This pattern is used by operations like ADDMOD and MULMOD which
/// perform modular arithmetic.
///
/// @param stack The stack to validate
/// @return Error if stack has fewer than 3 items or would overflow
///
/// Example:
/// ```zig
/// // Before ADDMOD operation: (a + b) % n
/// try validate_ternary_op(&frame.stack);
/// const n = frame.stack.pop();
/// const b = frame.stack.pop();
/// const a = frame.stack.pop();
/// frame.stack.push((a + b) % n);
/// ```
pub fn validate_ternary_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 3, 1);
}

/// Validates stack requirements for comparison operations.
///
/// Comparison operations consume two stack items and produce one boolean
/// result (0 or 1). This includes LT, GT, SLT, SGT, and EQ operations.
///
/// @param stack The stack to validate
/// @return Error if stack has fewer than 2 items or would overflow
///
/// Note: This is functionally identical to validate_binary_op but exists
/// as a separate function for semantic clarity and potential future
/// specialization.
pub fn validate_comparison_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 2, 1);
}

/// Validates stack requirements for unary operations.
///
/// Unary operations consume one stack item and produce one result.
/// This pattern is used by operations like NOT, ISZERO, and SIGNEXTEND.
///
/// @param stack The stack to validate
/// @return Error if stack is empty or would overflow
///
/// Example:
/// ```zig
/// // Before ISZERO operation
/// try validate_unary_op(&frame.stack);
/// const value = frame.stack.pop();
/// frame.stack.push(if (value == 0) 1 else 0);
/// ```
pub fn validate_unary_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 1, 1);
}

/// Validates stack requirements for DUP operations.
///
/// DUP operations duplicate the nth stack item, pushing a copy onto the top.
/// They consume no items but add one, so the stack must have:
/// - At least n items to duplicate from
/// - Room for one more item
///
/// @param stack The stack to validate
/// @param n The position to duplicate from (1-based, DUP1 duplicates top item)
/// @return StackUnderflow if fewer than n items, StackOverflow if full
///
/// Example:
/// ```zig
/// // DUP3 operation
/// try validate_dup(&frame.stack, 3);
/// const value = frame.stack.peek(2); // 0-based indexing
/// frame.stack.push(value);
/// ```
pub fn validate_dup(stack: *const Stack, n: u32) ExecutionError.Error!void {
    Log.debug("ValidationPatterns.validate_dup: Validating DUP{}, stack_size={}", .{ n, stack.size });
    // DUP pops 0 and pushes 1
    if (stack.size < n) {
        @branchHint(.cold);
        Log.debug("ValidationPatterns.validate_dup: Stack underflow, size={} < n={}", .{ stack.size, n });
        return ExecutionError.Error.StackUnderflow;
    }
    if (stack.size >= Stack.CAPACITY) {
        @branchHint(.cold);
        Log.debug("ValidationPatterns.validate_dup: Stack overflow, size={} >= capacity={}", .{ stack.size, Stack.CAPACITY });
        return ExecutionError.Error.StackOverflow;
    }
    Log.debug("ValidationPatterns.validate_dup: Validation passed", .{});
}

/// Validates stack requirements for SWAP operations.
///
/// SWAP operations exchange the top stack item with the (n+1)th item.
/// They don't change the stack size, but require at least n+1 items.
///
/// @param stack The stack to validate
/// @param n The position to swap with (1-based, SWAP1 swaps top two items)
/// @return StackUnderflow if stack has n or fewer items
///
/// Example:
/// ```zig
/// // SWAP2 operation swaps top with 3rd item
/// try validate_swap(&frame.stack, 2);
/// frame.stack.swap(2);
/// ```
pub fn validate_swap(stack: *const Stack, n: u32) ExecutionError.Error!void {
    Log.debug("ValidationPatterns.validate_swap: Validating SWAP{}, stack_size={}", .{ n, stack.size });
    // SWAP needs at least n+1 items on stack
    if (stack.size <= n) {
        @branchHint(.cold);
        Log.debug("ValidationPatterns.validate_swap: Stack underflow, size={} <= n={}", .{ stack.size, n });
        return ExecutionError.Error.StackUnderflow;
    }
    Log.debug("ValidationPatterns.validate_swap: Validation passed", .{});
}

/// Validates stack requirements for PUSH operations.
///
/// PUSH operations add one new item to the stack. They only require
/// checking that the stack isn't already full.
///
/// @param stack The stack to validate
/// @return StackOverflow if stack is at capacity
///
/// Example:
/// ```zig
/// // PUSH1 operation
/// try validate_push(&frame.stack);
/// const value = readByte(pc + 1);
/// frame.stack.push(value);
/// ```
pub fn validate_push(stack: *const Stack) ExecutionError.Error!void {
    Log.debug("ValidationPatterns.validate_push: Validating PUSH, stack_size={}", .{stack.size});
    if (stack.size >= Stack.CAPACITY) {
        @branchHint(.cold);
        Log.debug("ValidationPatterns.validate_push: Stack overflow, size={} >= capacity={}", .{ stack.size, Stack.CAPACITY });
        return ExecutionError.Error.StackOverflow;
    }
    Log.debug("ValidationPatterns.validate_push: Validation passed", .{});
}

// Import the helper function
const validate_stack_operation = @import("stack_validation.zig").validate_stack_operation;
