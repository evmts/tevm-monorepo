const std = @import("std");

pub const Stack = struct {
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

    pub fn fromSlice(values: []const u256) Error!void {
        const stack = Self{};
        for (values) |value| {
            stack.append(value);
        }
        return stack;
    }

    pub fn append(self: *Self, value: u256) Error!void {
        if (self.size >= CAPACITY) return Error.Overflow;
        self.data[self.size] = value;
        self.size += 1;
    }

    pub fn appendUnsafe(self: *Self, value: u256) void {
        self.data[self.size] = value;
        self.size += 1;
    }

    pub fn pop(self: *Self) Error!u256 {
        if (self.size == 0) return Error.Underflow;
        self.size -= 1;
        const value = self.data[self.size];
        self.data[self.size] = 0;
        return value;
    }

    pub fn popUnsafe(self: *Self) u256 {
        self.size -= 1;
        const value = self.data[self.size];
        self.data[self.size] = 0;
        return value;
    }

    pub fn peek(self: *const Self) Error!*const u256 {
        if (self.size == 0) return Error.OutOfBounds;
        return &self.data[self.size - 1];
    }

    pub fn peekUnsafe(self: *const Self) *const u256 {
        return &self.data[self.size - 1];
    }

    pub fn isEmpty(self: *const Self) bool {
        return self.size == 0;
    }

    pub fn isFull(self: *const Self) bool {
        return self.size == CAPACITY;
    }

    pub fn back(self: *const Self, n: usize) Error!u256 {
        if (n >= self.size) return Error.OutOfBounds;
        return self.data[self.size - n - 1];
    }

    pub fn backUnsafe(self: *const Self, n: usize) u256 {
        return self.data[self.size - n - 1];
    }

    pub fn peekN(self: *const Self, n: usize) Error!u256 {
        if (n >= self.size) return Error.OutOfBounds;
        return self.data[self.size - n - 1];
    }

    pub fn peekNUnsafe(self: *const Self, n: usize) Error!u256 {
        return self.data[self.size - n - 1];
    }

    pub fn swap(self: *Self, n: usize) Error!void {
        if (n == 0 or n > 16) return Error.InvalidPosition;
        if (self.size <= n) return Error.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
    }

    pub fn swapUnsafe(self: *Self, n: usize) Error!void {
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
    }

    pub fn swapN(self: *Self, comptime N: usize) Error!void {
        if (N == 0 or N > 16) @compileError("Invalid swap position");
        if (self.size <= N) return Error.OutOfBounds;
        const top_idx = self.size - 1;
        const swap_idx = self.size - N - 1;
        std.mem.swap(@TypeOf(self.data[0]), &self.data[top_idx], &self.data[swap_idx]);
    }

    pub fn swapNUnsafe(self: *Self, comptime N: usize) void {
        if (N == 0 or N > 16) @compileError("Invalid swap position");
        @setRuntimeSafety(false);
        std.debug.assert(self.size > N);
        const top_idx = self.size - 1;
        const swap_idx = self.size - N - 1;
        const temp = self.data[top_idx];
        self.data[top_idx] = self.data[swap_idx];
        self.data[swap_idx] = temp;
    }

    pub fn dup(self: *Self, n: usize) Error!void {
        if (n == 0 or n > 16) return Error.InvalidPosition;
        if (n > self.size) return Error.OutOfBounds;
        if (self.size >= CAPACITY) return Error.Overflow;
        try self.append(self.data[self.size - n]);
    }

    pub fn dupUnsafe(self: *Self, n: usize) void {
        self.appendUnsafe(self.data[self.size - n]);
    }

    pub fn dupN(self: *Self, comptime N: usize) Error!void {
        if (N == 0 or N > 16) @compileError("Invalid dup position");
        if (N > self.size) return Error.OutOfBounds;
        if (self.size >= CAPACITY) return Error.Overflow;
        try self.append(self.data[self.size - N]);
    }

    pub fn dupNUnsafe(self: *Self, comptime N: usize) void {
        if (N == 0 or N > 16) @compileError("Invalid dup position");
        @setRuntimeSafety(false);
        std.debug.assert(N <= self.size);
        std.debug.assert(self.size < CAPACITY);
        self.appendUnsafe(self.data[self.size - N]);
    }

    pub fn popn(self: *Self, comptime N: usize) Error![N]u256 {
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

    /// Pop N values and return reference to new top (for opcodes that pop N and push 1)
    pub fn popn_top(self: *Self, comptime N: usize) Error!struct {
        values: [N]u256,
        top: *u256,
    } {
        if (self.size <= N) return Error.OutOfBounds;
        const values = try self.popn(N);
        return .{ .values = values, .top = &self.data[self.size - 1] };
    }

    // EIP-663 operations

    /// DUPN - duplicate Nth element (dynamic N from bytecode)
    pub fn dupn(self: *Self, n: u8) Error!void {
        if (n == 0) return Error.InvalidPosition;
        const idx = @as(usize, n);
        if (idx > self.size) return Error.OutOfBounds;
        if (self.size >= CAPACITY) return Error.Overflow;
        try self.append(self.data[self.size - idx]);
    }

    /// SWAPN - swap top with Nth element (dynamic N from bytecode)
    pub fn swapn(self: *Self, n: u8) Error!void {
        // EIP-663: swap the top element with the one at `depth + 1`
        if (n >= self.size) return Error.OutOfBounds;
        const last = self.size - 1;
        std.mem.swap(
            u256,
            &self.data[last],
            &self.data[last - n],
        );
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

    pub fn toSlice(self: *const Stack) []const u256 {
        return self.data[0..self.size];
    }

    pub fn checkRequirements(self: *const Stack, pop_count: usize, push_count: usize) bool {
        return self.size >= pop_count and (self.size - pop_count + push_count) <= CAPACITY;
    }
};
