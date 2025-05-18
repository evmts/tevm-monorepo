const std = @import("std");

pub const StackError = error{
    OutOfBounds,
    OutOfMemory,
    StackOverflow,
};

/// High-performance EVM stack implementation with fixed-width array
pub const Stack = struct {
    /// Fixed-size array with explicit alignment for cache efficiency
    data: [1024]u256 align(@alignOf(u256)) = undefined,
    /// Current size of the stack
    size: usize = 0,

    /// Initialize a new stack
    pub fn init() Stack {
        return Stack{};
    }

    /// Free any resources associated with the stack (no-op for fixed arrays)
    pub fn deinit(self: *Stack) void {
        _ = self;
    }

    /// Push a value onto the stack
    /// Inlined for maximum performance in hot paths
    pub inline fn push(self: *Stack, value: u256) StackError!void {
        if (self.size >= 1024) {
            return StackError.StackOverflow;
        }
        self.data[self.size] = value;
        self.size += 1;
    }

    /// Push a value without bounds checking (unsafe)
    /// For use in high-performance paths where bounds are known
    pub inline fn push_unsafe(self: *Stack, value: u256) void {
        std.debug.assert(self.size < 1024);
        self.data[self.size] = value;
        self.size += 1;
    }

    /// Pop a value from the stack
    /// Inlined for maximum performance in hot paths
    pub inline fn pop(self: *Stack) StackError!u256 {
        if (self.size == 0) return StackError.OutOfBounds;
        self.size -= 1;
        return self.data[self.size];
    }

    /// Pop a value without bounds checking (unsafe)
    /// For use in high-performance paths where bounds are known
    pub inline fn pop_unsafe(self: *Stack) u256 {
        std.debug.assert(self.size > 0);
        self.size -= 1;
        return self.data[self.size];
    }

    /// Peek the top value on the stack
    pub inline fn peek(self: *Stack) StackError!*u256 {
        if (self.size == 0) return StackError.OutOfBounds;
        return &self.data[self.size - 1];
    }

    /// Peek the top value without bounds checking (unsafe)
    pub inline fn peek_unsafe(self: *Stack) *u256 {
        std.debug.assert(self.size > 0);
        return &self.data[self.size - 1];
    }

    /// Get the current number of items on the stack
    pub inline fn len(self: *Stack) usize {
        return self.size;
    }

    /// Swap the top element with the nth element down
    /// Inlined for performance
    pub inline fn swap1(self: *Stack) StackError!void {
        if (self.size < 2) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 2]);
    }

    /// Optimized swap implementation avoiding full swap
    /// Based on evmone's implementation pattern
    pub inline fn swap1_fast(self: *Stack) StackError!void {
        if (self.size < 2) return StackError.OutOfBounds;

        // Unroll the swap to avoid temporary allocation
        const top_idx = self.size - 1;
        const swap_idx = self.size - 2;

        // Swap using direct register transfers
        const t0 = self.data[top_idx][0];
        const t1 = self.data[top_idx][1];
        const t2 = self.data[top_idx][2];
        const t3 = self.data[top_idx][3];

        self.data[top_idx] = self.data[swap_idx];

        self.data[swap_idx][0] = t0;
        self.data[swap_idx][1] = t1;
        self.data[swap_idx][2] = t2;
        self.data[swap_idx][3] = t3;
    }

    // Other swap operations follow the same pattern
    pub inline fn swap2(self: *Stack) StackError!void {
        if (self.size < 3) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 3]);
    }

    // ... existing swap3 through swap16 implementations ...

    /// Duplicate the nth value on the stack
    pub inline fn dup(self: *Stack, n: usize) StackError!void {
        if (n == 0 or n > self.size) return StackError.OutOfBounds;
        try self.push(self.data[self.size - n]);
    }

    /// Optimized dup without error checking for known-safe cases
    pub inline fn dup_unsafe(self: *Stack, n: usize) void {
        std.debug.assert(n > 0 and n <= self.size);
        self.push_unsafe(self.data[self.size - n]);
    }

    /// Access the nth item from the top of the stack
    pub inline fn back(self: *Stack, n: usize) StackError!*u256 {
        if (n >= self.size) return StackError.OutOfBounds;
        return &self.data[self.size - n - 1];
    }

    /// Unsafe back access for known-safe cases
    pub inline fn back_unsafe(self: *Stack, n: usize) *u256 {
        std.debug.assert(n < self.size);
        return &self.data[self.size - n - 1];
    }

    /// Batch operation to pop multiple values at once
    /// This is significantly faster than calling pop() multiple times
    pub inline fn popn(self: *Stack, comptime N: usize) ![N]u256 {
        if (self.size < N) return StackError.OutOfBounds;

        var result: [N]u256 = undefined;
        // Single bounds check followed by unchecked operations
        self.size -= N;

        // Unroll small loops for better performance
        if (N <= 4) {
            inline for (0..N) |i| {
                result[N - i - 1] = self.data[self.size + i];
            }
        } else {
            var i: usize = 0;
            while (i < N) : (i += 1) {
                result[N - i - 1] = self.data[self.size + i];
            }
        }

        return result;
    }

    /// Batch operation to pop multiple values and return the new top
    pub inline fn popn_top(self: *Stack, comptime N: usize) !struct { values: [N]u256, top: *u256 } {
        if (self.size <= N) return StackError.OutOfBounds;

        var result = try self.popn(N);
        return .{ .values = result, .top = self.peek_unsafe() };
    }

    /// Push multiple bytes onto the stack efficiently
    /// Similar to evmone's push_slice implementation
        // Handle remaining bytes (less than 32)
        if (src_index < slice.len) {
            var buf: [32]u8 = [_]u8{0} ** 32;
            const remaining = slice.len - src_index;
            // Right-align the remaining bytes
            std.mem.copy(u8, buf[32 - remaining ..], slice[src_index ..]);

            const word = std.mem.readInt(u256, &buf, .big);
            self.data[self.size] = word;
            self.size += 1;
        }

    /// Peek at a value at specific position without popping
    pub inline fn peek_n(self: *Stack, n: usize) !u256 {
        if (self.size <= n) return StackError.OutOfBounds;
        return self.data[self.size - n - 1];
    }
};

const testing = std.testing;

test "Stack basic operations" {
    var stack = Stack.init();
    defer stack.deinit();

    // Test push and pop
    const value1: u256 = 42;
    try stack.push(value1);
    try testing.expectEqual(@as(usize, 1), stack.len());

    const popped = try stack.pop();
    try testing.expectEqual(value1, popped);
    try testing.expectEqual(@as(usize, 0), stack.len());

    // Test peek
    try stack.push(value1);
    const peeked = try stack.peek();
    try testing.expectEqual(value1, peeked.*);
    try testing.expectEqual(@as(usize, 1), stack.len());
}

test "Stack swap operations" {
    var stack = Stack.init();
    defer stack.deinit();

    const value1: u256 = 1;
    const value2: u256 = 2;
    const value3: u256 = 3;
    const value4: u256 = 4;

    try stack.push(value1);
    try stack.push(value2);
    try stack.push(value3);
    try stack.push(value4);

    // Test swap1
    try stack.swap1();
    try testing.expectEqual(value3, (try stack.peek()).*);
    try testing.expectEqual(value4, (try stack.back(1)).*);

    // Reset stack
    _ = try stack.pop();
    _ = try stack.pop();
    try stack.push(value3);
    try stack.push(value4);

    // Test optimized swap
    try stack.swap1_fast();
    try testing.expectEqual(value3, (try stack.peek()).*);
    try testing.expectEqual(value4, (try stack.back(1)).*);
}

test "Stack popn operation" {
    var stack = Stack.init();
    defer stack.deinit();

    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    try stack.push(4);

    const values = try stack.popn(3);
    try testing.expectEqual(@as(u256, 2), values[0]);
    try testing.expectEqual(@as(u256, 3), values[1]);
    try testing.expectEqual(@as(u256, 4), values[2]);
    try testing.expectEqual(@as(usize, 1), stack.len());
    try testing.expectEqual(@as(u256, 1), (try stack.peek()).*);
}

test "Stack push_slice operation" {
    var stack = Stack.init();
    defer stack.deinit();

    const bytes = [_]u8{ 0x12, 0x34, 0x56, 0x78 };
    try stack.push_slice(&bytes);

    try testing.expectEqual(@as(usize, 1), stack.len());
    const value = try stack.pop();
    // 0x12345678 followed by zeros, should be 0x12345678000000...
    try testing.expectEqual(@as(u64, 0x1234567800000000), @truncate(value >> 192));
}

test "Stack dup operations" {
    var stack = Stack.init();
    defer stack.deinit();

    const value1: u256 = 1;
    const value2: u256 = 2;
    const value3: u256 = 3;

    try stack.push(value1);
    try stack.push(value2);
    try stack.push(value3);

    // Test dup
    try stack.dup(1); // Duplicate value3
    try testing.expectEqual(value3, try stack.pop()); // Pop the duplicated value3
    try testing.expectEqual(value3, (try stack.peek()).*); // Now value3 should be on top again
    try testing.expectEqual(@as(usize, 3), stack.len());

    try stack.dup(2); // Duplicate value2
    try testing.expectEqual(value2, (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 4), stack.len());
}

test "Stack back operations" {
    var stack = Stack.init();
    defer stack.deinit();

    const value1: u256 = 1;
    const value2: u256 = 2;
    const value3: u256 = 3;

    try stack.push(value1);
    try stack.push(value2);
    try stack.push(value3);

    // Test back
    try testing.expectEqual(value2, (try stack.back(1)).*);
    try testing.expectEqual(value1, (try stack.back(2)).*);
}

test "Stack multiple operations" {
    var stack = Stack.init();
    defer stack.deinit();

    // Push multiple values
    const values = [_]u256{ 1, 2, 3, 4, 5 };

    for (values) |value| {
        try stack.push(value);
    }

    // Test various operations
    try testing.expectEqual(@as(usize, 5), stack.len());
    try testing.expectEqual(values[4], (try stack.peek()).*);

    // Test swap operations
    try stack.swap1();
    try testing.expectEqual(values[3], (try stack.peek()).*);
    try testing.expectEqual(values[4], (try stack.back(1)).*);

    // Test dup operations
    try stack.dup(2);
    // After swap1, the stack is [1, 2, 3, 5, 4], so dup(2) duplicates 5
    try testing.expectEqual(values[4], (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 6), stack.len());

    // Test pop operations
    const popped = try stack.pop();
    try testing.expectEqual(values[4], popped);
    try testing.expectEqual(@as(usize, 5), stack.len());
}

test "Stack swap operations comprehensive" {
    var stack = Stack.init();
    defer stack.deinit();

    // Push 17 values to test all swap operations
    var i: usize = 1;
    while (i <= 17) : (i += 1) {
        try stack.push(@intCast(i));
    }

    // Test all swap operations
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

    // Continue testing all swap operations...
    try stack.swap16();
    try testing.expectEqual(@as(u256, 1), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), (try stack.back(1)).*);
    try testing.expectEqual(@as(u256, 16), (try stack.back(2)).*);
}

test "Stack error cases" {
    var stack = Stack.init();
    defer stack.deinit();

    // Test pop on empty stack
    try testing.expectError(StackError.OutOfBounds, stack.pop());

    // Test peek on empty stack
    try testing.expectError(StackError.OutOfBounds, stack.peek());

    // Test back with invalid index
    try testing.expectError(StackError.OutOfBounds, stack.back(0));

    // Test dup with invalid index
    try stack.push(1);
    try testing.expectError(StackError.OutOfBounds, stack.dup(2));
}
