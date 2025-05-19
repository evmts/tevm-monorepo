const std = @import("std");

pub const StackError = error{
    OutOfBounds,
    OutOfMemory,
    StackOverflow,
};

pub const Stack = struct {
    data: [1024]u256 align(@alignOf(u256)) = undefined,
    size: usize = 0,

    pub inline fn push(self: *Stack, value: u256) StackError!void {
        if (self.size >= 1024) {
            return StackError.StackOverflow;
        }
        self.data[self.size] = value;
        self.size += 1;
    }

    pub inline fn push_unsafe(self: *Stack, value: u256) void {
        std.debug.assert(self.size < 1024);
        self.data[self.size] = value;
        self.size += 1;
    }

    pub inline fn pop(self: *Stack) StackError!u256 {
        if (self.size == 0) return StackError.OutOfBounds;
        self.size -= 1;
        return self.data[self.size];
    }

    pub inline fn pop_unsafe(self: *Stack) u256 {
        std.debug.assert(self.size > 0);
        self.size -= 1;
        return self.data[self.size];
    }

    pub inline fn peek(self: *Stack) StackError!*u256 {
        if (self.size == 0) return StackError.OutOfBounds;
        return &self.data[self.size - 1];
    }

    pub inline fn peek_unsafe(self: *Stack) *u256 {
        std.debug.assert(self.size > 0);
        return &self.data[self.size - 1];
    }

    pub inline fn len(self: *Stack) usize {
        return self.size;
    }

    pub inline fn swap1(self: *Stack) StackError!void {
        if (self.size < 2) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 2]);
    }

    pub inline fn swap1_fast(self: *Stack) StackError!void {
        if (self.size < 2) return StackError.OutOfBounds;

        const top_idx = self.size - 1;
        const swap_idx = self.size - 2;

        const temp = self.data[top_idx];

        self.data[top_idx] = self.data[swap_idx];

        self.data[swap_idx] = temp;
    }

    pub inline fn swap2(self: *Stack) StackError!void {
        if (self.size < 3) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 3]);
    }

    pub inline fn swap3(self: *Stack) StackError!void {
        if (self.size < 4) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 4]);
    }

    pub inline fn swap4(self: *Stack) StackError!void {
        if (self.size < 5) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 5]);
    }

    pub inline fn swap5(self: *Stack) StackError!void {
        if (self.size < 6) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 6]);
    }

    pub inline fn swap6(self: *Stack) StackError!void {
        if (self.size < 7) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 7]);
    }

    pub inline fn swap7(self: *Stack) StackError!void {
        if (self.size < 8) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 8]);
    }

    pub inline fn swap8(self: *Stack) StackError!void {
        if (self.size < 9) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 9]);
    }

    pub inline fn swap9(self: *Stack) StackError!void {
        if (self.size < 10) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 10]);
    }

    pub inline fn swap10(self: *Stack) StackError!void {
        if (self.size < 11) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 11]);
    }

    pub inline fn swap11(self: *Stack) StackError!void {
        if (self.size < 12) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 12]);
    }

    pub inline fn swap12(self: *Stack) StackError!void {
        if (self.size < 13) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 13]);
    }

    pub inline fn swap13(self: *Stack) StackError!void {
        if (self.size < 14) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 14]);
    }

    pub inline fn swap14(self: *Stack) StackError!void {
        if (self.size < 15) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 15]);
    }

    pub inline fn swap15(self: *Stack) StackError!void {
        if (self.size < 16) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 16]);
    }

    pub inline fn swap16(self: *Stack) StackError!void {
        if (self.size < 17) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 17]);
    }

    pub inline fn dup(self: *Stack, n: usize) StackError!void {
        if (n == 0 or n > self.size) return StackError.OutOfBounds;
        try self.push(self.data[self.size - n]);
    }

    pub inline fn dup_unsafe(self: *Stack, n: usize) void {
        std.debug.assert(n > 0 and n <= self.size);
        self.push_unsafe(self.data[self.size - n]);
    }

    pub inline fn back(self: *Stack, n: usize) StackError!*u256 {
        if (n >= self.size) return StackError.OutOfBounds;
        return &self.data[self.size - n - 1];
    }

    pub inline fn back_unsafe(self: *Stack, n: usize) *u256 {
        std.debug.assert(n < self.size);
        return &self.data[self.size - n - 1];
    }

    pub inline fn popn(self: *Stack, comptime N: usize) ![N]u256 {
        if (self.size < N) return StackError.OutOfBounds;

        self.size -= N;

        var result: [N]u256 = undefined;

        inline for (0..N) |i| {
            result[i] = self.data[self.size + i];
        }

        return result;
    }

    pub inline fn popn_top(self: *Stack, comptime N: usize) !struct { values: [N]u256, top: *u256 } {
        if (self.size <= N) return StackError.OutOfBounds;

        const result = try self.popn(N);
        return .{ .values = result, .top = self.peek_unsafe() };
    }

    pub fn push_slice(self: *Stack, slice: []const u8) !void {
        if (self.size + (slice.len + 31) / 32 > 1024) {
            return StackError.StackOverflow;
        }

        var src_index: usize = 0;
        while (src_index + 32 <= slice.len) {
            var buf: [32]u8 = undefined;
            @memcpy(&buf, slice[src_index .. src_index + 32]);

            const word = std.mem.readInt(u256, &buf, .big);

            self.data[self.size] = word;
            self.size += 1;

            src_index += 32;
        }

        if (src_index < slice.len) {
            var buf: [32]u8 = [_]u8{0} ** 32;
            const remaining = slice.len - src_index;
            @memcpy(buf[32 - remaining ..], slice[src_index..]);

            const word = std.mem.readInt(u256, &buf, .big);

            self.data[self.size] = word;
            self.size += 1;
        }
    }

    pub inline fn peek_n(self: *Stack, n: usize) !u256 {
        if (self.size <= n) return StackError.OutOfBounds;
        return self.data[self.size - n - 1];
    }
};

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

    try stack.swap1_fast();
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

    const bytes = [_]u8{ 0x12, 0x34, 0x56, 0x78 };
    try stack.push_slice(&bytes);

    try testing.expectEqual(@as(usize, 1), stack.len());
    const value = try stack.pop();

    const expected: u256 = 0x12345678;
    try testing.expectEqual(expected, value);
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
