const std = @import("std");

/// Stack represents the EVM stack with a maximum capacity of 1024 elements
const Self = @This();

pub const CAPACITY: usize = 1024;

pub const Error = error{
    Overflow,
    Underflow,
    OutOfBounds,
    InvalidPosition,
};

// Array of u256 aligned to 32 byte boundaries for performance reasons
data: [CAPACITY]u256 align(32) = [_]u256{0} ** CAPACITY,

size: usize = 0,

pub fn from_slice(values: []const u256) Error!Self {
    var stack = Self{};
    for (values) |value| {
        try stack.append(value);
    }
    return stack;
}

pub fn append(self: *Self, value: u256) Error!void {
        if (self.size >= CAPACITY) return Error.Overflow;
        self.data[self.size] = value;
        self.size += 1;
    }

pub fn append_unsafe(self: *Self, value: u256) void {
        self.data[self.size] = value;
        self.size += 1;
    }

pub fn appendUnsafe(self: *Self, value: u256) void {
        self.append_unsafe(value);
    }

pub fn pop(self: *Self) Error!u256 {
        if (self.size == 0) return Error.Underflow;
        self.size -= 1;
        const value = self.data[self.size];
        self.data[self.size] = 0;
        return value;
    }

pub fn pop_unsafe(self: *Self) u256 {
        self.size -= 1;
        const value = self.data[self.size];
        self.data[self.size] = 0;
        return value;
    }

pub fn popUnsafe(self: *Self) u256 {
        return self.pop_unsafe();
    }

pub fn peek(self: *const Self) Error!*const u256 {
        if (self.size == 0) return Error.OutOfBounds;
        return &self.data[self.size - 1];
    }

pub fn peek_unsafe(self: *const Self) *const u256 {
        return &self.data[self.size - 1];
    }

pub fn peekUnsafe(self: *const Self) *const u256 {
        return self.peek_unsafe();
    }

pub fn is_empty(self: *const Self) bool {
        return self.size == 0;
    }

pub fn isEmpty(self: *const Self) bool {
        return self.is_empty();
    }

pub fn is_full(self: *const Self) bool {
        return self.size == CAPACITY;
    }

pub fn isFull(self: *const Self) bool {
        return self.is_full();
    }

pub fn back(self: *const Self, n: usize) Error!u256 {
        if (n >= self.size) return Error.OutOfBounds;
        return self.data[self.size - n - 1];
    }

pub fn back_unsafe(self: *const Self, n: usize) u256 {
        return self.data[self.size - n - 1];
    }

pub fn backUnsafe(self: *const Self, n: usize) u256 {
        return self.back_unsafe(n);
    }

pub fn peek_n(self: *const Self, n: usize) Error!u256 {
        if (n >= self.size) return Error.OutOfBounds;
        return self.data[self.size - n - 1];
    }

pub fn peekN(self: *const Self, n: usize) Error!u256 {
        return self.peek_n(n);
    }

pub fn peek_n_unsafe(self: *const Self, n: usize) Error!u256 {
        return self.data[self.size - n - 1];
    }

pub fn swap(self: *Self, n: usize) Error!void {
        if (n == 0 or n > 16) return Error.InvalidPosition;
        if (self.size <= n) return Error.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
    }

pub fn swap_unsafe(self: *Self, n: usize) Error!void {
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
    }

pub fn swapUnsafe(self: *Self, n: usize) void {
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
    }

pub fn swap_n(self: *Self, comptime N: usize) Error!void {
        if (N == 0 or N > 16) @compileError("Invalid swap position");
        if (self.size <= N) return Error.OutOfBounds;
        const top_idx = self.size - 1;
        const swap_idx = self.size - N - 1;
        std.mem.swap(@TypeOf(self.data[0]), &self.data[top_idx], &self.data[swap_idx]);
    }

pub fn swapN(self: *Self, n: usize) Error!void {
        return self.swap(n);
    }

pub fn swap_n_unsafe(self: *Self, comptime N: usize) void {
        if (N == 0 or N > 16) @compileError("Invalid swap position");
        @setRuntimeSafety(false);
        // Unsafe: No bounds checking - caller must ensure self.size > N
        const top_idx = self.size - 1;
        const swap_idx = self.size - N - 1;
        const temp = self.data[top_idx];
        self.data[top_idx] = self.data[swap_idx];
        self.data[swap_idx] = temp;
    }

pub fn swapNUnsafe(self: *Self, n: usize) void {
        const top_idx = self.size - 1;
        const swap_idx = self.size - n - 1;
        std.mem.swap(u256, &self.data[top_idx], &self.data[swap_idx]);
    }

pub fn dup(self: *Self, n: usize) Error!void {
        if (n == 0 or n > 16) return Error.InvalidPosition;
        if (n > self.size) return Error.OutOfBounds;
        if (self.size >= CAPACITY) return Error.Overflow;
        try self.append(self.data[self.size - n]);
    }

pub fn dup_unsafe(self: *Self, n: usize) void {
        self.append_unsafe(self.data[self.size - n]);
    }

pub fn dupUnsafe(self: *Self, n: usize) void {
        self.dup_unsafe(n);
    }

pub fn dup_n(self: *Self, comptime N: usize) Error!void {
        if (N == 0 or N > 16) @compileError("Invalid dup position");
        if (N > self.size) return Error.OutOfBounds;
        if (self.size >= CAPACITY) return Error.Overflow;
        try self.append(self.data[self.size - N]);
    }

pub fn dupN(self: *Self, n: usize) Error!void {
        return self.dup(n);
    }

pub fn dup_n_unsafe(self: *Self, comptime N: usize) void {
        if (N == 0 or N > 16) @compileError("Invalid dup position");
        @setRuntimeSafety(false);
        // Unsafe: No bounds checking - caller must ensure N <= self.size and self.size < CAPACITY
        self.append_unsafe(self.data[self.size - N]);
    }

pub fn dupNUnsafe(self: *Self, n: usize) void {
        self.append_unsafe(self.data[self.size - n]);
    }

pub fn pop_n(self: *Self, comptime N: usize) Error![N]u256 {
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

pub fn popn(self: *Self, n: usize) Error![]u256 {
        if (self.size < n) return Error.OutOfBounds;
        
        self.size -= n;
        const result = self.data[self.size..self.size + n];
        
        return result;
    }

/// Pop N values and return reference to new top (for opcodes that pop N and push 1)
pub fn pop_n_top(self: *Self, comptime N: usize) Error!struct {
        values: [N]u256,
        top: *u256,
    } {
        if (self.size <= N) return Error.OutOfBounds;
        const values = try self.pop_n(N);
        return .{ .values = values, .top = &self.data[self.size - 1] };
    }

pub fn popn_top(self: *Self, n: usize) Error!struct {
        values: []u256,
        top: *u256,
    } {
        if (self.size <= n) return Error.OutOfBounds;
        const values = try self.popn(n);
        return .{ .values = values, .top = &self.data[self.size - 1] };
    }

// EIP-663 operations

/// DUPN - duplicate Nth element (dynamic N from bytecode)
pub fn dup_n_dynamic(self: *Self, n: u8) Error!void {
        if (n == 0) return Error.InvalidPosition;
        const idx = @as(usize, n);
        if (idx > self.size) return Error.OutOfBounds;
        if (self.size >= CAPACITY) return Error.Overflow;
        try self.append(self.data[self.size - idx]);
    }

pub fn dupn(self: *Self, n: usize) Error!void {
        return self.dup(n);
    }

/// SWAPN - swap top with Nth element (dynamic N from bytecode)
pub fn swap_n_dynamic(self: *Self, n: u8) Error!void {
        // EIP-663: swap the top element with the one at `depth + 1`
        if (n >= self.size) return Error.OutOfBounds;
        const last = self.size - 1;
        std.mem.swap(
            u256,
            &self.data[last],
            &self.data[last - n],
        );
    }

pub fn swapn(self: *Self, n: usize) Error!void {
        return self.swap(n);
    }

pub fn exchange(self: *Self, n: u8, m: u8) Error!void {
        if (m == 0) return Error.InvalidPosition;

        const n_idx = @as(usize, n) + 1;
        const m_idx = n_idx + @as(usize, m);

        if (m_idx > self.size) return Error.OutOfBounds;

        std.mem.swap(u256, &self.data[n_idx], &self.data[m_idx]);
    }

pub fn clear(self: *Self) void {
        self.size = 0;
        @memset(&self.data, 0); // could consider removing for perf
    }

pub fn to_slice(self: *const Self) []const u256 {
    return self.data[0..self.size];
}

pub fn toSlice(self: *const Self) []const u256 {
    return self.to_slice();
}

pub fn check_requirements(self: *const Self, pop_count: usize, push_count: usize) bool {
    return self.size >= pop_count and (self.size - pop_count + push_count) <= CAPACITY;
}

pub fn checkRequirements(self: *const Self, pop_count: usize, push_count: usize) bool {
    return self.check_requirements(pop_count, push_count);
}

// Batched operations for performance optimization

/// Pop 2 values and push 1 result - common pattern for binary operations
pub fn pop2_push1(self: *Self, result: u256) Error!struct { a: u256, b: u256 } {
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
pub fn pop2_push1_unsafe(self: *Self, result: u256) struct { a: u256, b: u256 } {
    @setRuntimeSafety(false);
    
    self.size -= 2;
    const a = self.data[self.size];
    const b = self.data[self.size + 1];
    
    self.data[self.size] = result;
    self.size += 1;
    
    return .{ .a = a, .b = b };
}

/// Pop 3 values and push 1 result - common for ternary operations
pub fn pop3_push1(self: *Self, result: u256) Error!struct { a: u256, b: u256, c: u256 } {
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
pub fn pop3_push1_unsafe(self: *Self, result: u256) struct { a: u256, b: u256, c: u256 } {
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
pub fn pop1_push1(self: *Self, result: u256) Error!u256 {
    if (self.size < 1) return Error.OutOfBounds;
    
    const value = self.data[self.size - 1];
    self.data[self.size - 1] = result;
    
    return value;
}

/// Pop 1 value and push 1 result (unsafe version)
pub fn pop1_push1_unsafe(self: *Self, result: u256) u256 {
    @setRuntimeSafety(false);
    
    const value = self.data[self.size - 1];
    self.data[self.size - 1] = result;
    
    return value;
}

/// Pop 2 values without pushing - for comparison operations
pub fn pop2(self: *Self) Error!struct { a: u256, b: u256 } {
    if (self.size < 2) return Error.OutOfBounds;
    
    self.size -= 2;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
    };
}

/// Pop 2 values without pushing (unsafe version)
pub fn pop2_unsafe(self: *Self) struct { a: u256, b: u256 } {
    @setRuntimeSafety(false);
    
    self.size -= 2;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
    };
}

/// Specialized swap for SWAP1 (most common swap)
pub fn swap1_optimized(self: *Self) Error!void {
    if (self.size < 2) return Error.OutOfBounds;
    
    const top_idx = self.size - 1;
    const second_idx = self.size - 2;
    
    const temp = self.data[top_idx];
    self.data[top_idx] = self.data[second_idx];
    self.data[second_idx] = temp;
}

/// Specialized dup for DUP1 (most common dup)
pub fn dup1_optimized(self: *Self) Error!void {
    if (self.size == 0) return Error.OutOfBounds;
    if (self.size >= CAPACITY) return Error.Overflow;
    
    self.data[self.size] = self.data[self.size - 1];
    self.size += 1;
}

/// Batch push multiple values
pub fn push_batch(self: *Self, values: []const u256) Error!void {
    if (self.size + values.len > CAPACITY) return Error.Overflow;
    
    @memcpy(self.data[self.size..self.size + values.len], values);
    self.size += values.len;
}

/// Get multiple top values without popping (for opcodes that need to peek at multiple values)
pub fn peek_multiple(self: *const Self, comptime N: usize) Error![N]u256 {
    if (self.size < N) return Error.OutOfBounds;
    
    var result: [N]u256 = undefined;
    inline for (0..N) |i| {
        result[i] = self.data[self.size - N + i];
    }
    return result;
}
