const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Stack = evm.Stack;

fn setupStack(items: []const u256) !Stack {
    var stack = Stack{};
    for (items) |item| {
        try stack.append(item);
    }
    return stack;
}

test "Stack: initialization" {
    const stack = Stack{};
    try testing.expectEqual(@as(usize, 0), stack.size);
    try testing.expectEqual(@as(usize, Stack.CAPACITY), Stack.CAPACITY);
}

test "Stack: basic push and pop operations" {
    var stack = Stack{};

    // Push values
    try stack.append(1);
    try stack.append(2);
    try stack.append(3);

    // Check state
    try testing.expectEqual(@as(usize, 3), stack.size);

    // Pop values and verify LIFO order
    try testing.expectEqual(@as(u256, 3), try stack.pop());
    try testing.expectEqual(@as(u256, 2), try stack.pop());
    try testing.expectEqual(@as(u256, 1), try stack.pop());

    // Stack should be empty
    try testing.expectEqual(@as(usize, 0), stack.size);

    // Pop from empty stack should error
    try testing.expectError(Stack.Error.StackUnderflow, stack.pop());
}

test "Stack: push_unsafe and pop_unsafe" {
    var stack = Stack{};

    // Safe operations first to set up state
    try stack.append(100);
    try stack.append(200);

    // Use unsafe operations (requires validation they're safe to use)
    stack.append_unsafe(300);
    try testing.expectEqual(@as(usize, 3), stack.size);

    const value = stack.pop_unsafe();
    try testing.expectEqual(@as(u256, 300), value);
    try testing.expectEqual(@as(usize, 2), stack.size);
}

test "Stack: peek operations" {
    var stack = try setupStack(&[_]u256{ 1, 2, 3, 4, 5 });

    // Test peek_unsafe (top element)
    const top = stack.peek_unsafe();
    try testing.expectEqual(@as(u256, 5), top.*);
    try testing.expectEqual(@as(usize, 5), stack.size); // Size unchanged

    // Test peek_n (nth element from top)
    try testing.expectEqual(@as(u256, 5), try stack.peek_n(0)); // Top
    try testing.expectEqual(@as(u256, 4), try stack.peek_n(1)); // Second from top
    try testing.expectEqual(@as(u256, 1), try stack.peek_n(4)); // Bottom
    
    // Out of bounds should error
    try testing.expectError(Stack.Error.StackUnderflow, stack.peek_n(5));
}

test "Stack: dup_unsafe operation" {
    var stack = try setupStack(&[_]u256{ 10, 20, 30 });

    // Duplicate top element (n=1)
    stack.dup_unsafe(1);
    try testing.expectEqual(@as(usize, 4), stack.size);
    try testing.expectEqual(@as(u256, 30), try stack.pop()); // Duplicated top
    try testing.expectEqual(@as(u256, 30), try stack.pop()); // Original top

    // Test duplicating deeper element
    stack.dup_unsafe(2); // Should duplicate 10 (2nd from top)
    try testing.expectEqual(@as(u256, 10), try stack.pop());
}

test "Stack: swapUnsafe operation" {
    var stack = try setupStack(&[_]u256{ 1, 2, 3, 4, 5 });

    // Swap top with second element (n=1)
    stack.swapUnsafe(1);
    try testing.expectEqual(@as(u256, 4), try stack.pop()); // Was second, now top
    try testing.expectEqual(@as(u256, 5), try stack.pop()); // Was top, now second

    // Verify remaining elements unchanged
    try testing.expectEqual(@as(u256, 3), try stack.pop());
    try testing.expectEqual(@as(u256, 2), try stack.pop());
    try testing.expectEqual(@as(u256, 1), try stack.pop());
}

test "Stack: pop2_unsafe operation" {
    var stack = try setupStack(&[_]u256{ 1, 2, 3, 4, 5 });

    const popped = stack.pop2_unsafe();
    try testing.expectEqual(@as(u256, 4), popped.a); // Second from top
    try testing.expectEqual(@as(u256, 5), popped.b); // Top
    try testing.expectEqual(@as(usize, 3), stack.size);

    // Verify remaining elements
    try testing.expectEqual(@as(u256, 3), try stack.pop());
}

test "Stack: pop3_unsafe operation" {
    var stack = try setupStack(&[_]u256{ 1, 2, 3, 4, 5 });

    const popped = stack.pop3_unsafe();
    try testing.expectEqual(@as(u256, 3), popped.a); // Third from top
    try testing.expectEqual(@as(u256, 4), popped.b); // Second from top  
    try testing.expectEqual(@as(u256, 5), popped.c); // Top
    try testing.expectEqual(@as(usize, 2), stack.size);

    // Verify remaining elements
    try testing.expectEqual(@as(u256, 2), try stack.pop());
    try testing.expectEqual(@as(u256, 1), try stack.pop());
}

test "Stack: set_top_unsafe operation" {
    var stack = try setupStack(&[_]u256{ 1, 2, 3 });

    stack.set_top_unsafe(999);
    try testing.expectEqual(@as(u256, 999), try stack.pop());
    try testing.expectEqual(@as(u256, 2), try stack.pop());
    try testing.expectEqual(@as(u256, 1), try stack.pop());
}

test "Stack: clear operation" {
    var stack = try setupStack(&[_]u256{ 1, 2, 3, 4, 5 });
    try testing.expectEqual(@as(usize, 5), stack.size);

    stack.clear();
    try testing.expectEqual(@as(usize, 0), stack.size);

    // Should be able to use stack normally after clear
    try stack.append(100);
    try testing.expectEqual(@as(usize, 1), stack.size);
    try testing.expectEqual(@as(u256, 100), try stack.pop());
}

test "Stack: overflow protection" {
    var stack = Stack{};

    // Fill stack to capacity - 1
    for (0..Stack.CAPACITY - 1) |i| {
        try stack.append(@intCast(i));
    }
    try testing.expectEqual(@as(usize, Stack.CAPACITY - 1), stack.size);

    // This should succeed
    try stack.append(999);
    try testing.expectEqual(@as(usize, Stack.CAPACITY), stack.size);

    // This should fail
    try testing.expectError(Stack.Error.StackOverflow, stack.append(1000));
}

test "Stack: data alignment and access" {
    var stack = Stack{};
    
    // Test that we can store large values
    const large_value: u256 = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    try stack.append(large_value);
    
    try testing.expectEqual(large_value, try stack.pop());
}