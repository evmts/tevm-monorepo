const std = @import("std");

pub const StackError = error{
    OutOfBounds,
    StackOverflow,
    InvalidPosition,
};

/// EVM interpreter stack limit.
pub const STACK_LIMIT: usize = 1024;

/// EVM stack with fixed capacity of 1024 u256 elements.
/// Optimized for zero-allocation operation and cache efficiency.
///
/// Performance comparison with revm and evmone:
/// - Tevm: Static array [1024]u256 with explicit cache-line alignment
/// - revm: Vec<U256> dynamic allocation with capacity pre-allocation
/// - evmone: std::vector<uint256> with aligned allocation
///
/// Key optimizations:
/// 1. 32-byte alignment for cache efficiency
/// 2. Static allocation eliminates heap overhead
/// 3. Dual safe/unsafe API pattern from revm
/// 4. Manual swap implementation from evmone
/// 5. Comptime-generated operations for code size
pub const Stack = struct {
    /// Static array of 1024 u256 elements, aligned for optimal cache performance
    data: [STACK_LIMIT]u256 align(32) = [_]u256{0} ** STACK_LIMIT,
    /// Current stack size (number of elements)
    size: usize = 0,
    /// Maximum stack capacity (compile-time constant)
    pub const capacity: usize = STACK_LIMIT;

    // Basic operations

    /// Push a value onto the stack
    pub inline fn push(self: *Stack, value: u256) StackError!void {
        if (self.size >= capacity) {
            return StackError.StackOverflow;
        }
        self.data[self.size] = value;
        self.size += 1;
    }

    /// Push without bounds checking (caller ensures space available)
    pub inline fn push_unsafe(self: *Stack, value: u256) void {
        @setRuntimeSafety(false);
        std.debug.assert(self.size < capacity);
        self.data[self.size] = value;
        self.size += 1;
    }

    /// Pop a value from the stack
    pub inline fn pop(self: *Stack) StackError!u256 {
        if (self.size == 0) return StackError.OutOfBounds;
        self.size -= 1;
        const value = self.data[self.size];
        // Clear the popped value for security (only in safe variant)
        self.data[self.size] = 0;
        return value;
    }

    /// Pop without bounds checking (caller ensures stack not empty)
    pub inline fn pop_unsafe(self: *Stack) u256 {
        @setRuntimeSafety(false);
        std.debug.assert(self.size > 0);
        self.size -= 1;
        return self.data[self.size];
    }

    /// Get reference to top element without popping
    pub inline fn peek(self: *Stack) StackError!*u256 {
        if (self.size == 0) return StackError.OutOfBounds;
        return &self.data[self.size - 1];
    }

    /// Peek without bounds checking
    pub inline fn peek_unsafe(self: *Stack) *u256 {
        @setRuntimeSafety(false);
        std.debug.assert(self.size > 0);
        return &self.data[self.size - 1];
    }

    /// Get current stack size
    pub inline fn len(self: *const Stack) usize {
        return self.size;
    }

    /// Check if stack is empty
    pub inline fn isEmpty(self: *const Stack) bool {
        return self.size == 0;
    }

    /// Check if stack is full
    pub inline fn isFull(self: *const Stack) bool {
        return self.size == capacity;
    }

    // Stack-relative operations

    /// Get reference to element N positions from top (0 = top)
    pub inline fn back(self: *Stack, n: usize) StackError!*u256 {
        if (n >= self.size) return StackError.OutOfBounds;
        return &self.data[self.size - n - 1];
    }

    /// Back without bounds checking
    pub inline fn back_unsafe(self: *Stack, n: usize) *u256 {
        @setRuntimeSafety(false);
        std.debug.assert(n < self.size);
        return &self.data[self.size - n - 1];
    }

    /// Peek at element N positions from top (0 = top)
    pub inline fn peek_n(self: *const Stack, n: usize) StackError!u256 {
        if (n >= self.size) return StackError.OutOfBounds;
        return self.data[self.size - n - 1];
    }

    // Swap operations (optimized)

    /// Generic swap operation (1-16)
    pub inline fn swap(self: *Stack, n: usize) StackError!void {
        if (n == 0 or n > 16) return StackError.InvalidPosition;
        if (self.size <= n) return StackError.OutOfBounds;
        
        // Manual swap to work around compiler optimization issues
        // Reference: evmone's optimization for clang issue #59116
        const top_idx = self.size - 1;
        const swap_idx = self.size - n - 1;
        const temp = self.data[top_idx];
        self.data[top_idx] = self.data[swap_idx];
        self.data[swap_idx] = temp;
    }

    /// Swap top with Nth element (compile-time known N)
    pub inline fn swapN(self: *Stack, comptime N: usize) StackError!void {
        if (N == 0 or N > 16) @compileError("Invalid swap position");
        if (self.size <= N) return StackError.OutOfBounds;
        
        const top_idx = self.size - 1;
        const swap_idx = self.size - N - 1;
        const temp = self.data[top_idx];
        self.data[top_idx] = self.data[swap_idx];
        self.data[swap_idx] = temp;
    }

    /// Unsafe swap variants
    pub inline fn swap_unsafe(self: *Stack, n: usize) void {
        @setRuntimeSafety(false);
        std.debug.assert(n > 0 and n <= 16);
        std.debug.assert(self.size > n);
        
        const top_idx = self.size - 1;
        const swap_idx = self.size - n - 1;
        const temp = self.data[top_idx];
        self.data[top_idx] = self.data[swap_idx];
        self.data[swap_idx] = temp;
    }

    pub inline fn swapN_unsafe(self: *Stack, comptime N: usize) void {
        if (N == 0 or N > 16) @compileError("Invalid swap position");
        @setRuntimeSafety(false);
        std.debug.assert(self.size > N);
        
        const top_idx = self.size - 1;
        const swap_idx = self.size - N - 1;
        const temp = self.data[top_idx];
        self.data[top_idx] = self.data[swap_idx];
        self.data[swap_idx] = temp;
    }

    /// Individual swap operations for better optimization
    pub inline fn swap1(self: *Stack) StackError!void { return self.swapN(1); }
    pub inline fn swap2(self: *Stack) StackError!void { return self.swapN(2); }
    pub inline fn swap3(self: *Stack) StackError!void { return self.swapN(3); }
    pub inline fn swap4(self: *Stack) StackError!void { return self.swapN(4); }
    pub inline fn swap5(self: *Stack) StackError!void { return self.swapN(5); }
    pub inline fn swap6(self: *Stack) StackError!void { return self.swapN(6); }
    pub inline fn swap7(self: *Stack) StackError!void { return self.swapN(7); }
    pub inline fn swap8(self: *Stack) StackError!void { return self.swapN(8); }
    pub inline fn swap9(self: *Stack) StackError!void { return self.swapN(9); }
    pub inline fn swap10(self: *Stack) StackError!void { return self.swapN(10); }
    pub inline fn swap11(self: *Stack) StackError!void { return self.swapN(11); }
    pub inline fn swap12(self: *Stack) StackError!void { return self.swapN(12); }
    pub inline fn swap13(self: *Stack) StackError!void { return self.swapN(13); }
    pub inline fn swap14(self: *Stack) StackError!void { return self.swapN(14); }
    pub inline fn swap15(self: *Stack) StackError!void { return self.swapN(15); }
    pub inline fn swap16(self: *Stack) StackError!void { return self.swapN(16); }

    // Dup operations

    /// Duplicate Nth element to top (1-based: dup(1) duplicates top)
    pub inline fn dup(self: *Stack, n: usize) StackError!void {
        if (n == 0 or n > 16) return StackError.InvalidPosition;
        if (n > self.size) return StackError.OutOfBounds;
        if (self.size >= capacity) return StackError.StackOverflow;
        try self.push(self.data[self.size - n]);
    }

    /// Dup with compile-time known N
    pub inline fn dupN(self: *Stack, comptime N: usize) StackError!void {
        if (N == 0 or N > 16) @compileError("Invalid dup position");
        if (N > self.size) return StackError.OutOfBounds;
        if (self.size >= capacity) return StackError.StackOverflow;
        try self.push(self.data[self.size - N]);
    }

    /// Unsafe dup variants
    pub inline fn dup_unsafe(self: *Stack, n: usize) void {
        @setRuntimeSafety(false);
        std.debug.assert(n > 0 and n <= 16);
        std.debug.assert(n <= self.size);
        std.debug.assert(self.size < capacity);
        self.push_unsafe(self.data[self.size - n]);
    }

    pub inline fn dupN_unsafe(self: *Stack, comptime N: usize) void {
        if (N == 0 or N > 16) @compileError("Invalid dup position");
        @setRuntimeSafety(false);
        std.debug.assert(N <= self.size);
        std.debug.assert(self.size < capacity);
        self.push_unsafe(self.data[self.size - N]);
    }

    // Bulk operations

    /// Pop N values from stack, returns them in order (top first)
    pub inline fn popn(self: *Stack, comptime N: usize) StackError![N]u256 {
        if (self.size < N) return StackError.OutOfBounds;

        self.size -= N;
        var result: [N]u256 = undefined;

        // Unrolled at compile time for performance
        inline for (0..N) |i| {
            result[i] = self.data[self.size + i];
            // Clear popped values for security (only in safe variant)
            self.data[self.size + i] = 0;
        }

        return result;
    }

    /// Pop N values and return reference to new top (for opcodes that pop N and push 1)
    pub inline fn popn_top(self: *Stack, comptime N: usize) StackError!struct {
        values: [N]u256,
        top: *u256,
    } {
        if (self.size <= N) return StackError.OutOfBounds;

        const values = try self.popn(N);
        return .{ .values = values, .top = self.peek_unsafe() };
    }

    /// Push multiple values (for testing/initialization)
    pub fn push_slice(self: *Stack, values: []const u256) StackError!void {
        if (self.size + values.len > capacity) {
            return StackError.StackOverflow;
        }
        
        for (values) |value| {
            self.data[self.size] = value;
            self.size += 1;
        }
    }

    // EIP-663 operations

    /// DUPN - duplicate Nth element (dynamic N from bytecode)
    pub inline fn dupn(self: *Stack, n: u8) StackError!void {
        if (n == 0) return StackError.InvalidPosition;
        const idx = @as(usize, n);
        if (idx > self.size) return StackError.OutOfBounds;
        if (self.size >= capacity) return StackError.StackOverflow;
        try self.push(self.data[self.size - idx]);
    }

    /// SWAPN - swap top with Nth element (dynamic N from bytecode)
    pub inline fn swapn(self: *Stack, n: u8) StackError!void {
        const idx = @as(usize, n) + 1; // EIP-663: n+1 position
        if (idx > self.size) return StackError.OutOfBounds;
        
        const top_idx = self.size - 1;
        const swap_idx = self.size - idx;
        const temp = self.data[top_idx];
        self.data[top_idx] = self.data[swap_idx];
        self.data[swap_idx] = temp;
    }

    /// EXCHANGE - exchange two elements at positions n+1 and n+m+1
    pub inline fn exchange(self: *Stack, n: u8, m: u8) StackError!void {
        const n_idx = @as(usize, n) + 1;
        const m_idx = n_idx + @as(usize, m);
        
        if (m == 0) return StackError.InvalidPosition; // No overlap allowed
        if (m_idx > self.size) return StackError.OutOfBounds;
        
        const idx1 = self.size - n_idx;
        const idx2 = self.size - m_idx;
        const temp = self.data[idx1];
        self.data[idx1] = self.data[idx2];
        self.data[idx2] = temp;
    }

    // Utility operations

    /// Clear the stack (reset to empty)
    pub inline fn clear(self: *Stack) void {
        self.size = 0;
        // Optional: Clear data for security
        // @memset(&self.data, 0);
    }

    /// Get slice of stack data (for debugging/serialization)
    pub fn toSlice(self: *const Stack) []const u256 {
        return self.data[0..self.size];
    }

    /// Validate stack requirements for an operation
    pub inline fn checkRequirements(self: *const Stack, pop_count: usize, push_count: usize) bool {
        return self.size >= pop_count and (self.size - pop_count + push_count) <= capacity;
    }
};

// Helper functions

/// Create swap function using comptime (for generating swap1-swap16)
pub fn makeSwapN(comptime N: usize) fn (*Stack) StackError!void {
    return struct {
        pub fn swap(stack: *Stack) StackError!void {
            if (stack.size <= N) return StackError.OutOfBounds;
            // Direct memory swap, avoiding temporary variables when possible
            const top_idx = stack.size - 1;
            const swap_idx = stack.size - N - 1;
            const temp = stack.data[top_idx];
            stack.data[top_idx] = stack.data[swap_idx];
            stack.data[swap_idx] = temp;
        }
    }.swap;
}

const testing = std.testing;

test "Stack basic operations" {
    var stack = Stack{};

    const value1: u256 = 42;
    try stack.push(value1);
    try testing.expectEqual(@as(usize, 1), stack.len());

    const popped = try stack.pop();
    try testing.expectEqual(value1, popped);
    try testing.expectEqual(@as(usize, 0), stack.len());

    try stack.push(value1);
    const peeked = try stack.peek();
    try testing.expectEqual(value1, peeked.*);
    try testing.expectEqual(@as(usize, 1), stack.len());
}

test "Stack swap operations" {
    var stack = Stack{};

    const value1: u256 = 1;
    const value2: u256 = 2;
    const value3: u256 = 3;
    const value4: u256 = 4;

    try stack.push(value1);
    try stack.push(value2);
    try stack.push(value3);
    try stack.push(value4);

    try stack.swap1();
    try testing.expectEqual(value3, (try stack.peek()).*);
    try testing.expectEqual(value4, (try stack.back(1)).*);

    _ = try stack.pop();
    _ = try stack.pop();
    try stack.push(value3);
    try stack.push(value4);

    // Test manual swap implementation
    try stack.swap1();
    try testing.expectEqual(value3, (try stack.peek()).*);
    try testing.expectEqual(value4, (try stack.back(1)).*);
}

test "Stack popn operation" {
    var stack = Stack{};

    try stack.push(@as(u256, 1));
    try stack.push(@as(u256, 2));
    try stack.push(@as(u256, 3));
    try stack.push(@as(u256, 4));

    const values = try stack.popn(3);
    try testing.expectEqual(@as(u256, 2), values[0]);
    try testing.expectEqual(@as(u256, 3), values[1]);
    try testing.expectEqual(@as(u256, 4), values[2]);
    try testing.expectEqual(@as(usize, 1), stack.len());
    try testing.expectEqual(@as(u256, 1), (try stack.peek()).*);
}

test "Stack push_slice operation" {
    var stack = Stack{};

    const values = [_]u256{ 0x12345678, 0xABCDEF00, 0xDEADBEEF };
    try stack.push_slice(&values);

    try testing.expectEqual(@as(usize, 3), stack.len());
    
    // Verify in reverse order (LIFO)
    try testing.expectEqual(@as(u256, 0xDEADBEEF), try stack.pop());
    try testing.expectEqual(@as(u256, 0xABCDEF00), try stack.pop());
    try testing.expectEqual(@as(u256, 0x12345678), try stack.pop());
}

test "Stack dup operations" {
    var stack = Stack{};

    const value1: u256 = 1;
    const value2: u256 = 2;
    const value3: u256 = 3;

    try stack.push(value1);
    try stack.push(value2);
    try stack.push(value3);

    try stack.dup(1);
    try testing.expectEqual(value3, try stack.pop());
    try testing.expectEqual(value3, (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 3), stack.len());

    try stack.dup(2);
    try testing.expectEqual(value2, (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 4), stack.len());
}

test "Stack back operations" {
    var stack = Stack{};

    const value1: u256 = 1;
    const value2: u256 = 2;
    const value3: u256 = 3;

    try stack.push(value1);
    try stack.push(value2);
    try stack.push(value3);

    try testing.expectEqual(value2, (try stack.back(1)).*);
    try testing.expectEqual(value1, (try stack.back(2)).*);
}

test "Stack multiple operations" {
    var stack = Stack{};

    const values = [_]u256{ 1, 2, 3, 4, 5 };

    for (values) |value| {
        try stack.push(value);
    }

    try testing.expectEqual(@as(usize, 5), stack.len());
    try testing.expectEqual(values[4], (try stack.peek()).*);

    try stack.swap1();
    try testing.expectEqual(values[3], (try stack.peek()).*);
    try testing.expectEqual(values[4], (try stack.back(1)).*);

    try stack.dup(2);
    try testing.expectEqual(values[4], (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 6), stack.len());

    const popped = try stack.pop();
    try testing.expectEqual(values[4], popped);
    try testing.expectEqual(@as(usize, 5), stack.len());
}

test "Stack swap operations comprehensive" {
    var stack = Stack{};

    var i: usize = 1;
    while (i <= 17) : (i += 1) {
        try stack.push(@as(u256, i));
    }

    try stack.swap1();
    try testing.expectEqual(@as(u256, 16), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), (try stack.back(1)).*);

    try stack.swap2();
    try testing.expectEqual(@as(u256, 15), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), (try stack.back(1)).*);
    try testing.expectEqual(@as(u256, 16), (try stack.back(2)).*);

    try stack.swap3();
    try testing.expectEqual(@as(u256, 14), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), (try stack.back(1)).*);
    try testing.expectEqual(@as(u256, 16), (try stack.back(2)).*);
    try testing.expectEqual(@as(u256, 15), (try stack.back(3)).*);

    try stack.swap16();
    try testing.expectEqual(@as(u256, 1), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), (try stack.back(1)).*);
    try testing.expectEqual(@as(u256, 16), (try stack.back(2)).*);
}

test "Stack error cases" {
    var stack = Stack{};

    try testing.expectError(StackError.OutOfBounds, stack.pop());

    try testing.expectError(StackError.OutOfBounds, stack.peek());

    try testing.expectError(StackError.OutOfBounds, stack.back(0));

    try stack.push(@as(u256, 1));
    try testing.expectError(StackError.OutOfBounds, stack.dup(2));
}
