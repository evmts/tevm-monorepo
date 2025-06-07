const std = @import("std");

/// High-performance EVM stack implementation with fixed capacity.
///
/// The Stack is a core component of the EVM execution model, providing a
/// Last-In-First-Out (LIFO) data structure for 256-bit values. All EVM
/// computations operate on this stack, making its performance critical.
///
/// ## Design Rationale
/// - Fixed capacity of 1024 elements (per EVM specification)
/// - 32-byte alignment for optimal memory access on modern CPUs
/// - Separate safe and unsafe variants of operations for flexibility
/// - Batched operations for common patterns (pop2_push1, etc.)
///
/// ## EVM Stack Model
/// The EVM uses a stack-based execution model where:
/// - Most operations pop operands from the stack and push results
/// - Stack depth is limited to 1024 to prevent DoS attacks
/// - Stack underflow/overflow are execution errors
/// - DUP and SWAP operations allow stack manipulation
///
/// ## Performance Optimizations
/// - Aligned memory for SIMD-friendly access patterns
/// - Unsafe variants skip bounds checking in hot paths
/// - Batched operations reduce function call overhead
/// - Specialized variants for common operations (DUP1, SWAP1)
///
/// ## Safety Model
/// All operations have two variants:
/// - Safe: Returns errors on invalid operations
/// - Unsafe: Assumes preconditions are met (used after validation)
///
/// Example:
/// ```zig
/// var stack = Stack{};
/// try stack.append(100); // Safe variant
/// stack.append_unsafe(200); // Unsafe variant (faster)
/// ```
const Self = @This();

/// Maximum stack capacity as defined by the EVM specification.
/// This limit prevents stack-based DoS attacks.
pub const CAPACITY: usize = 1024;

/// Error types for stack operations.
/// These map directly to EVM execution errors.
pub const Error = error{
    /// Stack would exceed 1024 elements
    Overflow,
    /// Attempted to pop from empty stack
    Underflow,
    /// Index out of valid range
    OutOfBounds,
    /// Invalid position for DUP/SWAP (must be 1-16)
    InvalidPosition,
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

/// Create a new stack from a slice of values.
///
/// Useful for testing and initializing stacks with predefined values.
/// Values are pushed in order, so values[0] will be deepest in stack.
///
/// @param values The values to initialize the stack with
/// @return A new stack containing the values
/// @throws Overflow if values.len > CAPACITY
///
/// Example:
/// ```zig
/// const values = [_]u256{10, 20, 30};
/// const stack = try Stack.from_slice(&values);
/// // Stack: [10, 20, 30] with 30 on top
/// ```
pub inline fn from_slice(values: []const u256) Error!Self {
    var stack = Self{};
    for (values) |value| {
        try stack.append(value);
    }
    return stack;
}

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
pub inline fn append(self: *Self, value: u256) Error!void {
    if (self.size >= CAPACITY) return Error.Overflow;
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
pub inline fn append_unsafe(self: *Self, value: u256) void {
    self.data[self.size] = value;
    self.size += 1;
}

/// Alias for append_unsafe (camelCase compatibility).
pub inline fn appendUnsafe(self: *Self, value: u256) void {
    self.append_unsafe(value);
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
pub inline fn pop(self: *Self) Error!u256 {
    if (self.size == 0) return Error.Underflow;
    self.size -= 1;
    const value = self.data[self.size];
    self.data[self.size] = 0;
    return value;
}

/// Pop a value from the stack (unsafe version).
///
/// Caller must ensure stack is not empty. Used in hot paths
/// after validation.
///
/// @param self The stack to pop from
/// @return The popped value
pub inline fn pop_unsafe(self: *Self) u256 {
    self.size -= 1;
    const value = self.data[self.size];
    self.data[self.size] = 0;
    return value;
}

pub inline fn popUnsafe(self: *Self) u256 {
    return self.pop_unsafe();
}

/// Peek at the top value without removing it (safe version).
///
/// @param self The stack to peek at
/// @return Pointer to the top value
/// @throws OutOfBounds if stack is empty
///
/// Example:
/// ```zig
/// const top = try stack.peek();
/// std.debug.print("Top value: {}", .{top.*});
/// ```
pub inline fn peek(self: *const Self) Error!*const u256 {
    if (self.size == 0) return Error.OutOfBounds;
    return &self.data[self.size - 1];
}

/// Peek at the top value without removing it (unsafe version).
///
/// Caller must ensure stack is not empty.
///
/// @param self The stack to peek at
/// @return Pointer to the top value
pub inline fn peek_unsafe(self: *const Self) *const u256 {
    return &self.data[self.size - 1];
}

pub inline fn peekUnsafe(self: *const Self) *const u256 {
    return self.peek_unsafe();
}

/// Check if the stack is empty.
///
/// @param self The stack to check
/// @return true if stack has no elements
pub inline fn is_empty(self: *const Self) bool {
    return self.size == 0;
}

pub inline fn isEmpty(self: *const Self) bool {
    return self.is_empty();
}

/// Check if the stack is at capacity.
///
/// @param self The stack to check
/// @return true if stack has 1024 elements
pub inline fn is_full(self: *const Self) bool {
    return self.size == CAPACITY;
}

pub inline fn isFull(self: *const Self) bool {
    return self.is_full();
}

/// Get value at position n from the top (0-indexed).
///
/// back(0) returns the top element, back(1) returns second from top, etc.
///
/// @param self The stack to access
/// @param n Position from top (0-indexed)
/// @return The value at position n
/// @throws OutOfBounds if n >= stack size
///
/// Example:
/// ```zig
/// // Stack: [10, 20, 30] with 30 on top
/// const top = try stack.back(0); // Returns 30
/// const second = try stack.back(1); // Returns 20
/// ```
pub inline fn back(self: *const Self, n: usize) Error!u256 {
    if (n >= self.size) return Error.OutOfBounds;
    return self.data[self.size - n - 1];
}

pub inline fn back_unsafe(self: *const Self, n: usize) u256 {
    return self.data[self.size - n - 1];
}

pub inline fn backUnsafe(self: *const Self, n: usize) u256 {
    return self.back_unsafe(n);
}

pub inline fn peek_n(self: *const Self, n: usize) Error!u256 {
    if (n >= self.size) return Error.OutOfBounds;
    return self.data[self.size - n - 1];
}

pub inline fn peekN(self: *const Self, n: usize) Error!u256 {
    return self.peek_n(n);
}

pub inline fn peek_n_unsafe(self: *const Self, n: usize) Error!u256 {
    return self.data[self.size - n - 1];
}

/// Swap the top element with the nth element (1-indexed).
///
/// SWAP1 swaps top two elements, SWAP2 swaps top with 3rd, etc.
/// Limited to SWAP1 through SWAP16 per EVM specification.
///
/// @param self The stack to operate on
/// @param n Position to swap with (1-16)
/// @throws InvalidPosition if n is 0 or > 16
/// @throws OutOfBounds if stack has <= n elements
///
/// Example:
/// ```zig
/// // Stack: [10, 20, 30, 40] with 40 on top
/// try stack.swap(2); // SWAP2
/// // Stack: [10, 40, 30, 20] with 20 on top
/// ```
pub inline fn swap(self: *Self, n: usize) Error!void {
    if (n == 0 or n > 16) return Error.InvalidPosition;
    if (self.size <= n) return Error.OutOfBounds;
    std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
}

pub inline fn swap_unsafe(self: *Self, n: usize) Error!void {
    std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
}

pub inline fn swapUnsafe(self: *Self, n: usize) void {
    std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
}

pub inline fn swap_n(self: *Self, comptime N: usize) Error!void {
    if (N == 0 or N > 16) @compileError("Invalid swap position");
    if (self.size <= N) return Error.OutOfBounds;
    const top_idx = self.size - 1;
    const swap_idx = self.size - N - 1;
    std.mem.swap(@TypeOf(self.data[0]), &self.data[top_idx], &self.data[swap_idx]);
}

pub inline fn swapN(self: *Self, n: usize) Error!void {
    return self.swap(n);
}

pub inline fn swap_n_unsafe(self: *Self, comptime N: usize) void {
    @setRuntimeSafety(false);
    if (N == 0 or N > 16) @compileError("Invalid swap position");
    // Unsafe: No bounds checking - caller must ensure self.size > N
    const top_idx = self.size - 1;
    const swap_idx = self.size - N - 1;
    const temp = self.data[top_idx];
    self.data[top_idx] = self.data[swap_idx];
    self.data[swap_idx] = temp;
}

pub inline fn swapNUnsafe(self: *Self, n: usize) void {
    @setRuntimeSafety(false);
    const top_idx = self.size - 1;
    const swap_idx = self.size - n - 1;
    std.mem.swap(u256, &self.data[top_idx], &self.data[swap_idx]);
}

/// Duplicate the nth element onto the top of stack (1-indexed).
///
/// DUP1 duplicates the top element, DUP2 duplicates the 2nd, etc.
/// Limited to DUP1 through DUP16 per EVM specification.
///
/// @param self The stack to operate on
/// @param n Position to duplicate from (1-16)
/// @throws InvalidPosition if n is 0 or > 16
/// @throws OutOfBounds if stack has < n elements
/// @throws Overflow if stack is at capacity
///
/// Example:
/// ```zig
/// // Stack: [10, 20, 30] with 30 on top
/// try stack.dup(2); // DUP2
/// // Stack: [10, 20, 30, 20] with 20 on top
/// ```
pub inline fn dup(self: *Self, n: usize) Error!void {
    if (n == 0 or n > 16) return Error.InvalidPosition;
    if (n > self.size) return Error.OutOfBounds;
    if (self.size >= CAPACITY) return Error.Overflow;
    try self.append(self.data[self.size - n]);
}

pub inline fn dup_unsafe(self: *Self, n: usize) void {
    @setRuntimeSafety(false);
    self.append_unsafe(self.data[self.size - n]);
}

pub inline fn dupUnsafe(self: *Self, n: usize) void {
    @setRuntimeSafety(false);
    self.dup_unsafe(n);
}

pub inline fn dup_n(self: *Self, comptime N: usize) Error!void {
    if (N == 0 or N > 16) @compileError("Invalid dup position");
    if (N > self.size) return Error.OutOfBounds;
    if (self.size >= CAPACITY) return Error.Overflow;
    try self.append(self.data[self.size - N]);
}

pub inline fn dupN(self: *Self, n: usize) Error!void {
    return self.dup(n);
}

pub inline fn dup_n_unsafe(self: *Self, comptime N: usize) void {
    @setRuntimeSafety(false);
    if (N == 0 or N > 16) @compileError("Invalid dup position");
    // Unsafe: No bounds checking - caller must ensure N <= self.size and self.size < CAPACITY
    self.append_unsafe(self.data[self.size - N]);
}

pub inline fn dupNUnsafe(self: *Self, n: usize) void {
    @setRuntimeSafety(false);
    self.append_unsafe(self.data[self.size - n]);
}

pub inline fn pop_n(self: *Self, comptime N: usize) Error![N]u256 {
    if (self.size < N) return Error.OutOfBounds;

    self.size -= N;
    var result: [N]u256 = undefined;

    inline for (0..N) |i| {
        result[i] = self.data[self.size + i];
        // Can consider not clearing here for perf
        self.data[self.size + i] = 0;
    }

    return result;
}

pub inline fn popn(self: *Self, n: usize) Error![]u256 {
    if (self.size < n) return Error.OutOfBounds;

    self.size -= n;
    const result = self.data[self.size .. self.size + n];

    return result;
}

/// Pop N values and return reference to new top (for opcodes that pop N and push 1)
pub inline fn pop_n_top(self: *Self, comptime N: usize) Error!struct {
    values: [N]u256,
    top: *u256,
} {
    if (self.size <= N) return Error.OutOfBounds;
    const values = try self.pop_n(N);
    return .{ .values = values, .top = &self.data[self.size - 1] };
}

pub inline fn popn_top(self: *Self, n: usize) Error!struct {
    values: []u256,
    top: *u256,
} {
    if (self.size <= n) return Error.OutOfBounds;
    const values = try self.popn(n);
    return .{ .values = values, .top = &self.data[self.size - 1] };
}

// EIP-663 operations

/// DUPN - duplicate Nth element (dynamic N from bytecode)
pub inline fn dup_n_dynamic(self: *Self, n: u8) Error!void {
    if (n == 0) return Error.InvalidPosition;
    const idx = @as(usize, n);
    if (idx > self.size) return Error.OutOfBounds;
    if (self.size >= CAPACITY) return Error.Overflow;
    try self.append(self.data[self.size - idx]);
}

pub inline fn dupn(self: *Self, n: usize) Error!void {
    return self.dup(n);
}

/// SWAPN - swap top with Nth element (dynamic N from bytecode)
pub inline fn swap_n_dynamic(self: *Self, n: u8) Error!void {
    // EIP-663: swap the top element with the one at `depth + 1`
    if (n >= self.size) return Error.OutOfBounds;
    const last = self.size - 1;
    std.mem.swap(
        u256,
        &self.data[last],
        &self.data[last - n],
    );
}

pub inline fn swapn(self: *Self, n: usize) Error!void {
    return self.swap(n);
}

pub inline fn exchange(self: *Self, n: u8, m: u8) Error!void {
    if (m == 0) return Error.InvalidPosition;

    const n_idx = @as(usize, n) + 1;
    const m_idx = n_idx + @as(usize, m);

    if (m_idx > self.size) return Error.OutOfBounds;

    std.mem.swap(u256, &self.data[n_idx], &self.data[m_idx]);
}

/// Clear all elements from the stack.
///
/// Resets size to 0 and zeroes memory to prevent information leakage.
/// The zeroing can be removed for performance if security is not a concern.
///
/// @param self The stack to clear
pub inline fn clear(self: *Self) void {
    self.size = 0;
    @memset(&self.data, 0); // could consider removing for perf
}

pub inline fn to_slice(self: *const Self) []const u256 {
    return self.data[0..self.size];
}

pub inline fn toSlice(self: *const Self) []const u256 {
    return self.to_slice();
}

/// Check if a stack operation would succeed.
///
/// Validates that the stack has enough elements to pop and enough
/// capacity for the pushes. Used by opcodes to pre-validate operations.
///
/// @param self The stack to check
/// @param pop_count Number of elements that will be popped
/// @param push_count Number of elements that will be pushed
/// @return true if operation would succeed
///
/// Example:
/// ```zig
/// // Check if we can do a binary operation (pop 2, push 1)
/// if (stack.check_requirements(2, 1)) {
///     // Safe to proceed
/// }
/// ```
pub inline fn check_requirements(self: *const Self, pop_count: usize, push_count: usize) bool {
    return self.size >= pop_count and (self.size - pop_count + push_count) <= CAPACITY;
}

pub inline fn checkRequirements(self: *const Self, pop_count: usize, push_count: usize) bool {
    return self.check_requirements(pop_count, push_count);
}

// Batched operations for performance optimization

/// Batched operation: pop 2 values and push 1 result.
///
/// Optimized for binary operations (ADD, MUL, etc.) that consume two
/// operands and produce one result. Reduces overhead by combining
/// operations into a single function.
///
/// @param self The stack to operate on
/// @param result The value to push after popping
/// @return The two popped values
/// @throws OutOfBounds if stack has < 2 elements
///
/// Example:
/// ```zig
/// // Implementing ADD operation
/// const operands = try stack.pop2_push1(a_plus_b);
/// // operands.a and operands.b contain the popped values
/// ```
pub inline fn pop2_push1(self: *Self, result: u256) Error!struct { a: u256, b: u256 } {
    if (self.size < 2) return Error.OutOfBounds;

    // Pop two values
    self.size -= 2;
    const a = self.data[self.size];
    const b = self.data[self.size + 1];

    // Push result (reuses first popped slot)
    self.data[self.size] = result;
    self.size += 1;

    return .{ .a = a, .b = b };
}

/// Pop 2 values and push 1 result (unsafe version for hot paths)
pub inline fn pop2_push1_unsafe(self: *Self, result: u256) struct { a: u256, b: u256 } {
    @setRuntimeSafety(false);

    self.size -= 2;
    const a = self.data[self.size];
    const b = self.data[self.size + 1];

    self.data[self.size] = result;
    self.size += 1;

    return .{ .a = a, .b = b };
}

/// Pop 3 values and push 1 result - common for ternary operations
pub inline fn pop3_push1(self: *Self, result: u256) Error!struct { a: u256, b: u256, c: u256 } {
    if (self.size < 3) return Error.OutOfBounds;

    self.size -= 3;
    const a = self.data[self.size];
    const b = self.data[self.size + 1];
    const c = self.data[self.size + 2];

    self.data[self.size] = result;
    self.size += 1;

    return .{ .a = a, .b = b, .c = c };
}

/// Pop 3 values and push 1 result (unsafe version)
pub inline fn pop3_push1_unsafe(self: *Self, result: u256) struct { a: u256, b: u256, c: u256 } {
    @setRuntimeSafety(false);

    self.size -= 3;
    const a = self.data[self.size];
    const b = self.data[self.size + 1];
    const c = self.data[self.size + 2];

    self.data[self.size] = result;
    self.size += 1;

    return .{ .a = a, .b = b, .c = c };
}

/// Pop 1 value and push 1 result - for unary operations
pub inline fn pop1_push1(self: *Self, result: u256) Error!u256 {
    if (self.size < 1) return Error.OutOfBounds;

    const value = self.data[self.size - 1];
    self.data[self.size - 1] = result;

    return value;
}

/// Pop 1 value and push 1 result (unsafe version)
pub inline fn pop1_push1_unsafe(self: *Self, result: u256) u256 {
    @setRuntimeSafety(false);

    const value = self.data[self.size - 1];
    self.data[self.size - 1] = result;

    return value;
}

/// Pop 2 values without pushing - for comparison operations
pub inline fn pop2(self: *Self) Error!struct { a: u256, b: u256 } {
    if (self.size < 2) return Error.OutOfBounds;

    self.size -= 2;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
    };
}

/// Pop 2 values without pushing (unsafe version)
pub inline fn pop2_unsafe(self: *Self) struct { a: u256, b: u256 } {
    @setRuntimeSafety(false);

    self.size -= 2;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
    };
}

/// Pop 3 values without pushing - for memory operations
pub inline fn pop3(self: *Self) Error!struct { a: u256, b: u256, c: u256 } {
    if (self.size < 3) return Error.OutOfBounds;

    self.size -= 3;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
        .c = self.data[self.size + 2],
    };
}

/// Pop 3 values without pushing (unsafe version)
pub inline fn pop3_unsafe(self: *Self) struct { a: u256, b: u256, c: u256 } {
    @setRuntimeSafety(false);

    self.size -= 3;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
        .c = self.data[self.size + 2],
    };
}

/// Optimized implementation of SWAP1 operation.
///
/// SWAP1 is the most common swap operation, so this specialized
/// version avoids the generic swap overhead. Manually unrolled
/// for maximum performance.
///
/// @param self The stack to operate on
/// @throws OutOfBounds if stack has < 2 elements
///
/// Example:
/// ```zig
/// // Stack: [10, 20] with 20 on top
/// try stack.swap1_optimized();
/// // Stack: [20, 10] with 10 on top
/// ```
pub inline fn swap1_optimized(self: *Self) Error!void {
    if (self.size < 2) return Error.OutOfBounds;

    const top_idx = self.size - 1;
    const second_idx = self.size - 2;

    const temp = self.data[top_idx];
    self.data[top_idx] = self.data[second_idx];
    self.data[second_idx] = temp;
}

/// Optimized implementation of DUP1 operation.
///
/// DUP1 is the most common duplication operation, so this specialized
/// version avoids the generic dup overhead. Directly copies the top
/// element.
///
/// @param self The stack to operate on
/// @throws OutOfBounds if stack is empty
/// @throws Overflow if stack is at capacity
///
/// Example:
/// ```zig
/// // Stack: [10, 20] with 20 on top
/// try stack.dup1_optimized();
/// // Stack: [10, 20, 20] with 20 on top
/// ```
pub inline fn dup1_optimized(self: *Self) Error!void {
    if (self.size == 0) return Error.OutOfBounds;
    if (self.size >= CAPACITY) return Error.Overflow;

    self.data[self.size] = self.data[self.size - 1];
    self.size += 1;
}

/// Batch push multiple values
pub inline fn push_batch(self: *Self, values: []const u256) Error!void {
    if (self.size + values.len > CAPACITY) return Error.Overflow;

    @memcpy(self.data[self.size .. self.size + values.len], values);
    self.size += values.len;
}

/// Get multiple top values without popping (for opcodes that need to peek at multiple values)
pub inline fn peek_multiple(self: *const Self, comptime N: usize) Error![N]u256 {
    if (self.size < N) return Error.OutOfBounds;

    var result: [N]u256 = undefined;
    inline for (0..N) |i| {
        result[i] = self.data[self.size - N + i];
    }
    return result;
}

pub inline fn set_top_unsafe(self: *Self, value: u256) void {
    // @setRuntimeSafety(false); // Removed as per user feedback
    // Assumes stack is not empty; this should be guaranteed by jump_table validation
    // for opcodes that use this pattern (e.g., after a pop and peek on a stack with >= 2 items).
    self.data[self.size - 1] = value;
}

pub inline fn set_top_two_unsafe(self: *Self, top: u256, second: u256) void {
    // Assumes stack has at least 2 elements; this should be guaranteed by jump_table validation
    self.data[self.size - 1] = top;
    self.data[self.size - 2] = second;
}
