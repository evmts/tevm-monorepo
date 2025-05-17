const std = @import("std");

pub const StackError = error{
    OutOfBounds,
    OutOfMemory,
};

pub const Stack = struct {
    data: std.ArrayList(u256),
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) !Stack {
        return Stack{
            .data = std.ArrayList(u256).init(allocator),
            .allocator = allocator,
        };
    }

    pub fn deinit(self: *Stack) void {
        self.data.deinit();
    }

    pub fn push(self: *Stack, value: u256) !void {
        try self.data.append(value);
    }

    pub fn pop(self: *Stack) StackError!u256 {
        if (self.data.items.len == 0) return StackError.OutOfBounds;
        const value = self.data.items[self.data.items.len - 1];
        _ = self.data.pop();
        return value;
    }

    pub fn peek(self: *Stack) StackError!*u256 {
        if (self.data.items.len == 0) return StackError.OutOfBounds;
        return &self.data.items[self.data.items.len - 1];
    }

    pub fn len(self: *Stack) usize {
        return self.data.items.len;
    }

    pub fn swap1(self: *Stack) StackError!void {
        if (self.data.items.len < 2) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 2], &self.data.items[stack_len - 1]);
    }

    pub fn swap2(self: *Stack) StackError!void {
        if (self.data.items.len < 3) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 3], &self.data.items[stack_len - 1]);
    }

    pub fn swap3(self: *Stack) StackError!void {
        if (self.data.items.len < 4) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 4], &self.data.items[stack_len - 1]);
    }

    pub fn swap4(self: *Stack) StackError!void {
        if (self.data.items.len < 5) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 5], &self.data.items[stack_len - 1]);
    }

    pub fn swap5(self: *Stack) StackError!void {
        if (self.data.items.len < 6) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 6], &self.data.items[stack_len - 1]);
    }

    pub fn swap6(self: *Stack) StackError!void {
        if (self.data.items.len < 7) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 7], &self.data.items[stack_len - 1]);
    }

    pub fn swap7(self: *Stack) StackError!void {
        if (self.data.items.len < 8) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 8], &self.data.items[stack_len - 1]);
    }

    pub fn swap8(self: *Stack) StackError!void {
        if (self.data.items.len < 9) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 9], &self.data.items[stack_len - 1]);
    }

    pub fn swap9(self: *Stack) StackError!void {
        if (self.data.items.len < 10) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 10], &self.data.items[stack_len - 1]);
    }

    pub fn swap10(self: *Stack) StackError!void {
        if (self.data.items.len < 11) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 11], &self.data.items[stack_len - 1]);
    }

    pub fn swap11(self: *Stack) StackError!void {
        if (self.data.items.len < 12) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 12], &self.data.items[stack_len - 1]);
    }

    pub fn swap12(self: *Stack) StackError!void {
        if (self.data.items.len < 13) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 13], &self.data.items[stack_len - 1]);
    }

    pub fn swap13(self: *Stack) StackError!void {
        if (self.data.items.len < 14) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 14], &self.data.items[stack_len - 1]);
    }

    pub fn swap14(self: *Stack) StackError!void {
        if (self.data.items.len < 15) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 15], &self.data.items[stack_len - 1]);
    }

    pub fn swap15(self: *Stack) StackError!void {
        if (self.data.items.len < 16) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 16], &self.data.items[stack_len - 1]);
    }

    pub fn swap16(self: *Stack) StackError!void {
        if (self.data.items.len < 17) return StackError.OutOfBounds;
        const stack_len = self.data.items.len;
        std.mem.swap(u256, &self.data.items[stack_len - 17], &self.data.items[stack_len - 1]);
    }

    pub fn dup(self: *Stack, n: usize) StackError!void {
        if (n == 0 or n > self.data.items.len) return StackError.OutOfBounds;
        try self.push(self.data.items[self.data.items.len - n]);
    }

    pub fn back(self: *Stack, n: usize) StackError!*u256 {
        if (n >= self.data.items.len) return StackError.OutOfBounds;
        return &self.data.items[self.data.items.len - n - 1];
    }
};

const testing = std.testing;

test "Stack basic operations" {
    var stack = try Stack.init(testing.allocator);
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
    var stack = try Stack.init(testing.allocator);
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
}

test "Stack dup operations" {
    var stack = try Stack.init(testing.allocator);
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
    var stack = try Stack.init(testing.allocator);
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
    var stack = try Stack.init(testing.allocator);
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
    var stack = try Stack.init(testing.allocator);
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
    var stack = try Stack.init(testing.allocator);
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
