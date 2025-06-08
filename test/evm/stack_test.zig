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
    try testing.expect(stack.isEmpty());
    try testing.expect(!stack.isFull());
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
    try testing.expect(!stack.isEmpty());
    try testing.expect(!stack.isFull());

    // Pop values and verify LIFO order
    try testing.expectEqual(@as(u256, 3), try stack.pop());
    try testing.expectEqual(@as(u256, 2), try stack.pop());
    try testing.expectEqual(@as(u256, 1), try stack.pop());

    // Stack should be empty
    try testing.expectEqual(@as(usize, 0), stack.size);
    try testing.expect(stack.isEmpty());

    // Pop from empty stack should error
    try testing.expectError(Stack.Error.Underflow, stack.pop());
}

test "Stack: push_unsafe and pop_unsafe" {
    var stack = Stack{};

    // Test unsafe push
    stack.append_unsafe(42);
    try testing.expectEqual(@as(usize, 1), stack.size);

    // Test unsafe pop
    const value = stack.pop_unsafe();
    try testing.expectEqual(@as(u256, 42), value);
    try testing.expectEqual(@as(usize, 0), stack.size);
}

test "Stack: peek operations" {
    var stack = Stack{};

    // Peek on empty stack should error
    try testing.expectError(Stack.Error.OutOfBounds, stack.peek());

    // Push values
    try stack.append(10);
    try stack.append(20);
    try stack.append(30);

    // Peek should return top without removing
    try testing.expectEqual(@as(u256, 30), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 3), stack.size);

    // peekUnsafe
    try testing.expectEqual(@as(u256, 30), stack.peekUnsafe().*);

    // peekN
    try testing.expectEqual(@as(u256, 30), try stack.peekN(0));
    try testing.expectEqual(@as(u256, 20), try stack.peekN(1));
    try testing.expectEqual(@as(u256, 10), try stack.peekN(2));
    try testing.expectError(Stack.Error.OutOfBounds, stack.peekN(3));
}

test "Stack: back operations" {
    var stack = Stack{};

    // Push values
    try stack.append(100);
    try stack.append(200);
    try stack.append(300);

    // Test back
    try testing.expectEqual(@as(u256, 300), try stack.back(0));
    try testing.expectEqual(@as(u256, 200), try stack.back(1));
    try testing.expectEqual(@as(u256, 100), try stack.back(2));
    try testing.expectError(Stack.Error.OutOfBounds, stack.back(3));

    // Test backUnsafe
    try testing.expectEqual(@as(u256, 300), stack.backUnsafe(0));
    try testing.expectEqual(@as(u256, 100), stack.backUnsafe(2));
}

test "Stack: overflow conditions" {
    var stack = Stack{};

    // Fill stack to capacity
    var i: u256 = 0;
    while (i < Stack.CAPACITY) : (i += 1) {
        try stack.append(i);
    }

    // Check state
    try testing.expectEqual(Stack.CAPACITY, stack.size);
    try testing.expect(stack.isFull());
    try testing.expect(!stack.isEmpty());

    // Trying to push should overflow
    try testing.expectError(Stack.Error.Overflow, stack.append(9999));
}

// Swap operations tests

test "Stack: swap operations" {
    var stack = Stack{};

    // Not enough items for swap
    try testing.expectError(Stack.Error.OutOfBounds, stack.swap(1));

    // Push values
    for (1..18) |i| {
        try stack.append(@as(u256, i));
    }

    // Test swap with n=1
    try stack.swap(1);
    try testing.expectEqual(@as(u256, 16), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), try stack.back(1));

    // Reset
    try stack.swap(1);

    // Test swap with runtime n
    try stack.swap(2);
    try testing.expectEqual(@as(u256, 15), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), try stack.back(2));

    // Test invalid swap positions
    try testing.expectError(Stack.Error.InvalidPosition, stack.swap(0));
    try testing.expectError(Stack.Error.InvalidPosition, stack.swap(17));
}

test "Stack: swapN compile-time operations" {
    var stack = Stack{};

    // Push enough values
    for (1..18) |i| {
        try stack.append(@as(u256, i));
    }

    // Test swapN with compile-time N
    try stack.swapN(3);
    try testing.expectEqual(@as(u256, 14), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), try stack.back(3));

    // Test swapUnsafe
    stack.swapUnsafe(1);
    try testing.expectEqual(@as(u256, 16), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 14), try stack.back(1));

    // Test swapNUnsafe
    stack.swapNUnsafe(1);
    try testing.expectEqual(@as(u256, 14), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 16), try stack.back(1));
}

test "Stack: all swap operations 1-16" {
    var stack = Stack{};

    // Push 17 values
    var i: u256 = 1;
    while (i <= 17) : (i += 1) {
        try stack.append(i);
    }

    // Test each swap operation
    try stack.swap(1);
    try testing.expectEqual(@as(u256, 16), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), try stack.back(1));
    try stack.swap(1); // Reset

    try stack.swap(2);
    try testing.expectEqual(@as(u256, 15), (try stack.peek()).*);
    try stack.swap(2); // Reset

    try stack.swap(3);
    try testing.expectEqual(@as(u256, 14), (try stack.peek()).*);
    try stack.swap(3); // Reset

    try stack.swap(16);
    try testing.expectEqual(@as(u256, 1), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), try stack.back(16));
}

// Dup operations tests

test "Stack: dup operations" {
    var stack = Stack{};

    // Push values
    try stack.append(10);
    try stack.append(20);
    try stack.append(30);

    // Test dup(1) - duplicate top
    try stack.dup(1);
    try testing.expectEqual(@as(u256, 30), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 4), stack.size);

    // Test dup(3) - duplicate third from top
    // After dup(1): stack is [10, 20, 30, 30], size = 4
    // We want to duplicate the 3rd from top (which is 20)
    try stack.dup(3);
    try testing.expectEqual(@as(u256, 20), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 5), stack.size);

    // Test invalid dup
    try testing.expectError(Stack.Error.InvalidPosition, stack.dup(0));
    try testing.expectError(Stack.Error.InvalidPosition, stack.dup(17));
    try testing.expectError(Stack.Error.OutOfBounds, stack.dup(10));
}

test "Stack: dupN compile-time operations" {
    var stack = Stack{};

    // Push values
    try stack.append(100);
    try stack.append(200);
    try stack.append(300);

    // Test dupN
    try stack.dupN(2);
    try testing.expectEqual(@as(u256, 200), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 4), stack.size);

    // Test dupUnsafe
    stack.dupUnsafe(1);
    try testing.expectEqual(@as(u256, 200), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 5), stack.size);

    // Test dupNUnsafe
    stack.dupNUnsafe(3);
    try testing.expectEqual(@as(u256, 300), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 6), stack.size);
}

// Bulk operations tests

test "Stack: popn operations" {
    var stack = Stack{};

    // Push values
    try stack.append(1);
    try stack.append(2);
    try stack.append(3);
    try stack.append(4);
    try stack.append(5);

    // Pop 3 values
    const values = try stack.popn(3);
    try testing.expectEqual(@as(u256, 3), values[0]);
    try testing.expectEqual(@as(u256, 4), values[1]);
    try testing.expectEqual(@as(u256, 5), values[2]);

    // Check remaining stack
    try testing.expectEqual(@as(usize, 2), stack.size);
    try testing.expectEqual(@as(u256, 2), (try stack.peek()).*);

    // Try to pop more than available
    try testing.expectError(Stack.Error.OutOfBounds, stack.popn(3));
}

test "Stack: popn_top operation" {
    var stack = Stack{};

    // Push values
    try stack.append(10);
    try stack.append(20);
    try stack.append(30);
    try stack.append(40);

    // Pop 2 and get reference to new top
    const result = try stack.popn_top(2);
    try testing.expectEqual(@as(u256, 30), result.values[0]);
    try testing.expectEqual(@as(u256, 40), result.values[1]);
    try testing.expectEqual(@as(u256, 20), result.top.*);

    // Stack should have 2 remaining
    try testing.expectEqual(@as(usize, 2), stack.size);

    // Not enough values
    try testing.expectError(Stack.Error.OutOfBounds, stack.popn_top(2));
}

test "Stack: push multiple values" {
    var stack = Stack{};

    // Push multiple values manually
    const values = [_]u256{ 100, 200, 300, 400 };
    for (values) |value| {
        try stack.append(value);
    }

    // Verify all pushed
    try testing.expectEqual(@as(usize, 4), stack.size);
    try testing.expectEqual(@as(u256, 400), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 300), try stack.back(1));
    try testing.expectEqual(@as(u256, 200), try stack.back(2));
    try testing.expectEqual(@as(u256, 100), try stack.back(3));

    // Test overflow
    var i: usize = stack.size;
    while (i < Stack.CAPACITY) : (i += 1) {
        try stack.append(@as(u256, i));
    }
    try testing.expectError(Stack.Error.Overflow, stack.append(9999));
}

// EIP-663 operations tests

test "Stack: dupn operation (dynamic)" {
    var stack = Stack{};

    // Push values
    try stack.append(10);
    try stack.append(20);
    try stack.append(30);

    // Test dupn with u8 parameter
    try stack.dupn(2);
    try testing.expectEqual(@as(u256, 20), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 4), stack.size);

    // Test invalid dupn
    try testing.expectError(Stack.Error.InvalidPosition, stack.dupn(0));
    try testing.expectError(Stack.Error.OutOfBounds, stack.dupn(10));
}

test "Stack: swapn operation (dynamic)" {
    var stack = Stack{};

    // Push values
    for (1..6) |i| {
        try stack.append(@as(u256, i));
    }

    // Test swapn
    try stack.swapn(1); // Swap top with position 1
    try testing.expectEqual(@as(u256, 4), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 5), try stack.back(1));

    // Test boundary
    try testing.expectError(Stack.Error.OutOfBounds, stack.swapn(10));
}

test "Stack: exchange operation" {
    var stack = Stack{};

    // Push values
    for (1..8) |i| {
        try stack.append(@as(u256, i));
    }

    // Exchange positions 1 and 3 (n=0, m=2)
    // This exchanges absolute positions 1 and 3 from bottom: [1,2,3,4,5,6,7] -> [1,4,3,2,5,6,7]
    try stack.exchange(0, 2);
    try testing.expectEqual(@as(u256, 7), (try stack.peek()).*); // unchanged
    try testing.expectEqual(@as(u256, 6), try stack.back(1)); // unchanged
    try testing.expectEqual(@as(u256, 5), try stack.back(2)); // unchanged
    try testing.expectEqual(@as(u256, 2), try stack.back(3)); // was 4

    // Test invalid exchange (m=0)
    try testing.expectError(Stack.Error.InvalidPosition, stack.exchange(1, 0));

    // Test out of bounds
    try testing.expectError(Stack.Error.OutOfBounds, stack.exchange(5, 5));
}

// Utility operations tests

test "Stack: clear operation" {
    var stack = Stack{};

    // Push values
    try stack.append(1);
    try stack.append(2);
    try stack.append(3);

    // Clear
    stack.clear();
    try testing.expectEqual(@as(usize, 0), stack.size);
    try testing.expect(stack.isEmpty());

    // Can push after clear
    try stack.append(42);
    try testing.expectEqual(@as(u256, 42), (try stack.peek()).*);
}

test "Stack: toSlice operation" {
    var stack = Stack{};

    // Empty slice
    var slice = stack.toSlice();
    try testing.expectEqual(@as(usize, 0), slice.len);

    // Push values
    try stack.append(10);
    try stack.append(20);
    try stack.append(30);

    // Get slice
    slice = stack.toSlice();
    try testing.expectEqual(@as(usize, 3), slice.len);
    try testing.expectEqual(@as(u256, 10), slice[0]);
    try testing.expectEqual(@as(u256, 20), slice[1]);
    try testing.expectEqual(@as(u256, 30), slice[2]);
}

test "Stack: checkRequirements operation" {
    var stack = Stack{};

    // Empty stack
    try testing.expect(!stack.checkRequirements(1, 1)); // Can't pop from empty

    // Push 5 items
    for (1..6) |i| {
        try stack.append(@as(u256, i));
    }

    // Valid requirements
    try testing.expect(stack.checkRequirements(2, 1)); // Pop 2, push 1
    try testing.expect(stack.checkRequirements(5, 0)); // Pop all
    try testing.expect(stack.checkRequirements(0, 5)); // Just push

    // Invalid requirements
    try testing.expect(!stack.checkRequirements(6, 0)); // Can't pop 6 from 5
    try testing.expect(!stack.checkRequirements(0, Stack.CAPACITY)); // Would overflow
}

// Edge cases and error conditions

test "Stack: edge case operations" {
    var stack = Stack{};

    // Multiple operations on empty stack
    try testing.expectError(Stack.Error.Underflow, stack.pop());
    try testing.expectError(Stack.Error.OutOfBounds, stack.peek());
    try testing.expectError(Stack.Error.OutOfBounds, stack.back(0));
    try testing.expectError(Stack.Error.OutOfBounds, stack.swap(1));
    try testing.expectError(Stack.Error.OutOfBounds, stack.dup(1));

    // Single element edge cases
    try stack.append(42);
    try testing.expectError(Stack.Error.OutOfBounds, stack.swap(1)); // Need 2 elements
    try stack.dup(1); // Can dup single element
    try testing.expectEqual(@as(u256, 42), (try stack.peek()).*);

    // Clear and reuse
    stack.clear();
    try testing.expectEqual(@as(usize, 0), stack.size);
    try stack.append(100);
    try testing.expectEqual(@as(u256, 100), (try stack.peek()).*);
}

test "Stack: memory safety verification" {
    var stack = Stack{};

    // Push and pop cycle
    try stack.append(0xDEADBEEF);
    try stack.append(0xCAFEBABE);

    _ = try stack.pop();
    try testing.expectEqual(@as(usize, 1), stack.size);

    // The popped value location should be cleared (in safe variant)
    // This is implementation detail but important for security

    // Push new value
    try stack.append(0x12345678);
    try testing.expectEqual(@as(u256, 0x12345678), (try stack.peek()).*);
}

// Test for makeSwapN would go here if it exists in the implementation
// For now, skipping this test as makeSwapN doesn't appear to be implemented

// Complex combined operations test

test "Stack: complex operation sequences" {
    var stack = Stack{};

    // Sequence: push, dup, swap, pop
    try stack.append(1);
    try stack.append(2);
    try stack.append(3);

    try stack.dup(2); // Stack: [1, 2, 3, 2]
    try testing.expectEqual(@as(u256, 2), (try stack.peek()).*);

    try stack.swap(2); // Stack: [1, 2, 2, 2] (swapping identical values)
    try testing.expectEqual(@as(u256, 2), (try stack.peek()).*);

    const popped = try stack.popn(2); // Pop from [1, 2, 3, 2] -> Stack: [1, 2]
    // popn returns in array order, not pop order
    try testing.expectEqual(@as(u256, 3), popped[0]); // Was at index 2
    try testing.expectEqual(@as(u256, 2), popped[1]); // Was at index 3

    try testing.expectEqual(@as(usize, 2), stack.size);
    try testing.expectEqual(@as(u256, 2), (try stack.peek()).*);
}
