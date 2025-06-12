const std = @import("std");
const Log = @import("../log.zig");

/// High-performance EVM stack implementation with fixed capacity.
///
/// The Stack is a core component of the EVM execution model, providing a
/// Last-In-First-Out (LIFO) data structure for 256-bit values. All EVM
/// computations operate on this stack, making its performance critical.
///
/// ## Design Rationale
/// - Fixed capacity of 1024 elements (per EVM specification)
/// - 32-byte alignment for optimal memory access on modern CPUs
/// - Unsafe variants skip bounds checking in hot paths for performance
///
/// ## Performance Optimizations
/// - Aligned memory for SIMD-friendly access patterns
/// - Unsafe variants used after jump table validation
/// - Direct memory access patterns for maximum speed
///
/// ## Safety Model
/// Operations are validated at the jump table level, allowing individual
/// opcodes to use faster unsafe operations without redundant bounds checking.
///
/// Example:
/// ```zig
/// var stack = Stack{};
/// try stack.append(100); // Safe variant (for error_mapping)
/// stack.append_unsafe(200); // Unsafe variant (for opcodes)
/// ```
pub const Stack = @This();

/// Maximum stack capacity as defined by the EVM specification.
/// This limit prevents stack-based DoS attacks.
pub const CAPACITY: usize = 1024;

/// Error types for stack operations.
/// These map directly to EVM execution errors.
pub const Error = error{
    /// Stack would exceed 1024 elements
    StackOverflow,
    /// Attempted to pop from empty stack
    StackUnderflow,
};

/// Stack storage aligned to 32-byte boundaries.
/// Alignment improves performance on modern CPUs by:
/// - Enabling SIMD operations
/// - Reducing cache line splits
/// - Improving memory prefetching
data: [CAPACITY]u256 align(32) = [_]u256{0} ** CAPACITY,

/// Current number of elements on the stack.
/// Invariant: 0 <= size <= CAPACITY
size: usize = 0,

/// Push a value onto the stack (safe version).
///
/// @param self The stack to push onto
/// @param value The 256-bit value to push
/// @throws Overflow if stack is at capacity
///
/// Example:
/// ```zig
/// try stack.append(0x1234);
/// ```
pub fn append(self: *Stack, value: u256) Error!void {
    if (self.size >= CAPACITY) {
        @branchHint(.cold);
        Log.debug("Stack.append: Stack overflow, size={}, capacity={}", .{ self.size, CAPACITY });
        return Error.StackOverflow;
    }
    Log.debug("Stack.append: Pushing value={}, new_size={}", .{ value, self.size + 1 });
    self.data[self.size] = value;
    self.size += 1;
}

/// Push a value onto the stack (unsafe version).
///
/// Caller must ensure stack has capacity. Used in hot paths
/// after validation has already been performed.
///
/// @param self The stack to push onto
/// @param value The 256-bit value to push
pub fn append_unsafe(self: *Stack, value: u256) void {
    @branchHint(.likely);
    self.data[self.size] = value;
    self.size += 1;
}

/// Pop a value from the stack (safe version).
///
/// Removes and returns the top element. Clears the popped
/// slot to prevent information leakage.
///
/// @param self The stack to pop from
/// @return The popped value
/// @throws Underflow if stack is empty
///
/// Example:
/// ```zig
/// const value = try stack.pop();
/// ```
pub fn pop(self: *Stack) Error!u256 {
    if (self.size == 0) {
        @branchHint(.cold);
        Log.debug("Stack.pop: Stack underflow, size=0", .{});
        return Error.StackUnderflow;
    }
    self.size -= 1;
    const value = self.data[self.size];
    self.data[self.size] = 0;
    Log.debug("Stack.pop: Popped value={}, new_size={}", .{ value, self.size });
    return value;
}

/// Pop a value from the stack (unsafe version).
///
/// Caller must ensure stack is not empty. Used in hot paths
/// after validation.
///
/// @param self The stack to pop from
/// @return The popped value
pub fn pop_unsafe(self: *Stack) u256 {
    @branchHint(.likely);
    self.size -= 1;
    const value = self.data[self.size];
    self.data[self.size] = 0;
    return value;
}

/// Peek at the top value without removing it (unsafe version).
///
/// Caller must ensure stack is not empty.
///
/// @param self The stack to peek at
/// @return Pointer to the top value
pub fn peek_unsafe(self: *const Stack) *const u256 {
    @branchHint(.likely);
    return &self.data[self.size - 1];
}

/// Duplicate the nth element onto the top of stack (unsafe version).
///
/// Caller must ensure preconditions are met.
///
/// @param self The stack to operate on
/// @param n Position to duplicate from (1-16)
pub fn dup_unsafe(self: *Stack, n: usize) void {
    @branchHint(.likely);
    @setRuntimeSafety(false);
    self.append_unsafe(self.data[self.size - n]);
}

/// Pop 2 values without pushing (unsafe version)
pub fn pop2_unsafe(self: *Stack) struct { a: u256, b: u256 } {
    @branchHint(.likely);
    @setRuntimeSafety(false);
    self.size -= 2;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
    };
}

/// Pop 3 values without pushing (unsafe version)
pub fn pop3_unsafe(self: *Stack) struct { a: u256, b: u256, c: u256 } {
    @branchHint(.likely);
    @setRuntimeSafety(false);
    self.size -= 3;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
        .c = self.data[self.size + 2],
    };
}

pub fn set_top_unsafe(self: *Stack, value: u256) void {
    @branchHint(.likely);
    // Assumes stack is not empty; this should be guaranteed by jump_table validation
    // for opcodes that use this pattern (e.g., after a pop and peek on a stack with >= 2 items).
    self.data[self.size - 1] = value;
}

/// CamelCase alias used by existing execution code  
pub fn swapUnsafe(self: *Stack, n: usize) void {
    @branchHint(.likely);
    std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
}

/// Peek at the nth element from the top (for test compatibility)
pub fn peek_n(self: *const Stack, n: usize) Error!u256 {
    if (n >= self.size) {
        @branchHint(.cold);
        return Error.StackUnderflow;
    }
    return self.data[self.size - 1 - n];
}

/// Clear the stack (for test compatibility)
pub fn clear(self: *Stack) void {
    self.size = 0;
    // Zero out the data for security
    @memset(&self.data, 0);
}

/// Peek at the top value (for test compatibility)
pub fn peek(self: *const Stack) Error!u256 {
    if (self.size == 0) {
        @branchHint(.cold);
        return Error.StackUnderflow;
    }
    return self.data[self.size - 1];
}