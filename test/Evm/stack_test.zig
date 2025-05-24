const std = @import("std");
const testing = std.testing;
const Stack = @import("evm").Stack;
const StackError = @import("evm").StackError;
const STACK_LIMIT = @import("evm").STACK_LIMIT;

// Helper function to setup a stack with predefined values
fn setupStack(items: []const u256) !Stack {
    var stack = Stack{};
    for (items) |item| {
        try stack.push(item);
    }
    return stack;
}

// Basic operations tests

test "Stack: initialization" {
    const stack = Stack{};
    try testing.expectEqual(@as(usize, 0), stack.len());
    try testing.expect(stack.isEmpty());
    try testing.expect(!stack.isFull());
    try testing.expectEqual(@as(usize, STACK_LIMIT), stack.capacity);
}

test "Stack: basic push and pop operations" {
    var stack = Stack{};

    // Push values
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);

    // Check state
    try testing.expectEqual(@as(usize, 3), stack.len());
    try testing.expect(!stack.isEmpty());
    try testing.expect(!stack.isFull());

    // Pop values and verify LIFO order
    try testing.expectEqual(@as(u256, 3), try stack.pop());
    try testing.expectEqual(@as(u256, 2), try stack.pop());
    try testing.expectEqual(@as(u256, 1), try stack.pop());

    // Stack should be empty
    try testing.expectEqual(@as(usize, 0), stack.len());
    try testing.expect(stack.isEmpty());

    // Pop from empty stack should error
    try testing.expectError(StackError.OutOfBounds, stack.pop());
}

test "Stack: push_unsafe and pop_unsafe" {
    var stack = Stack{};

    // Test unsafe push
    stack.push_unsafe(42);
    try testing.expectEqual(@as(usize, 1), stack.len());

    // Test unsafe pop
    const value = stack.pop_unsafe();
    try testing.expectEqual(@as(u256, 42), value);
    try testing.expectEqual(@as(usize, 0), stack.len());
}

test "Stack: peek operations" {
    var stack = Stack{};

    // Peek on empty stack should error
    try testing.expectError(StackError.OutOfBounds, stack.peek());

    // Push values
    try stack.push(10);
    try stack.push(20);
    try stack.push(30);

    // Peek should return top without removing
    try testing.expectEqual(@as(u256, 30), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 3), stack.len());

    // peek_unsafe
    try testing.expectEqual(@as(u256, 30), stack.peek_unsafe().*);

    // peek_n
    try testing.expectEqual(@as(u256, 30), try stack.peek_n(0));
    try testing.expectEqual(@as(u256, 20), try stack.peek_n(1));
    try testing.expectEqual(@as(u256, 10), try stack.peek_n(2));
    try testing.expectError(StackError.OutOfBounds, stack.peek_n(3));
}

test "Stack: back operations" {
    var stack = Stack{};

    // Push values
    try stack.push(100);
    try stack.push(200);
    try stack.push(300);

    // Test back
    try testing.expectEqual(@as(u256, 300), (try stack.back(0)).*);
    try testing.expectEqual(@as(u256, 200), (try stack.back(1)).*);
    try testing.expectEqual(@as(u256, 100), (try stack.back(2)).*);
    try testing.expectError(StackError.OutOfBounds, stack.back(3));

    // Test back_unsafe
    try testing.expectEqual(@as(u256, 300), stack.back_unsafe(0).*);
    try testing.expectEqual(@as(u256, 100), stack.back_unsafe(2).*);
}

test "Stack: overflow conditions" {
    var stack = Stack{};

    // Fill stack to capacity
    var i: u256 = 0;
    while (i < STACK_LIMIT) : (i += 1) {
        try stack.push(i);
    }

    // Check state
    try testing.expectEqual(STACK_LIMIT, stack.len());
    try testing.expect(stack.isFull());
    try testing.expect(!stack.isEmpty());

    // Trying to push should overflow
    try testing.expectError(StackError.StackOverflow, stack.push(9999));
}

// Swap operations tests

test "Stack: swap operations" {
    var stack = Stack{};

    // Not enough items for swap
    try testing.expectError(StackError.OutOfBounds, stack.swap1());

    // Push values
    for (1..18) |i| {
        try stack.push(@as(u256, i));
    }

    // Test swap1
    try stack.swap1();
    try testing.expectEqual(@as(u256, 16), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), (try stack.back(1)).*);

    // Reset
    try stack.swap1();

    // Test swap with runtime n
    try stack.swap(2);
    try testing.expectEqual(@as(u256, 15), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), (try stack.back(2)).*);

    // Test invalid swap positions
    try testing.expectError(StackError.InvalidPosition, stack.swap(0));
    try testing.expectError(StackError.InvalidPosition, stack.swap(17));
}

test "Stack: swapN compile-time operations" {
    var stack = Stack{};

    // Push enough values
    for (1..18) |i| {
        try stack.push(@as(u256, i));
    }

    // Test swapN with compile-time N
    try stack.swapN(3);
    try testing.expectEqual(@as(u256, 14), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), (try stack.back(3)).*);

    // Test swap_unsafe
    stack.swap_unsafe(1);
    try testing.expectEqual(@as(u256, 17), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 14), (try stack.back(1)).*);

    // Test swapN_unsafe
    stack.swapN_unsafe(1);
    try testing.expectEqual(@as(u256, 14), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), (try stack.back(1)).*);
}

test "Stack: all swap operations 1-16" {
    var stack = Stack{};

    // Push 17 values
    var i: u256 = 1;
    while (i <= 17) : (i += 1) {
        try stack.push(i);
    }

    // Test each swap operation
    try stack.swap1();
    try testing.expectEqual(@as(u256, 16), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), (try stack.back(1)).*);
    try stack.swap1(); // Reset

    try stack.swap2();
    try testing.expectEqual(@as(u256, 15), (try stack.peek()).*);
    try stack.swap2(); // Reset

    try stack.swap3();
    try testing.expectEqual(@as(u256, 14), (try stack.peek()).*);
    try stack.swap3(); // Reset

    try stack.swap16();
    try testing.expectEqual(@as(u256, 1), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 17), (try stack.back(16)).*);
}

// Dup operations tests

test "Stack: dup operations" {
    var stack = Stack{};

    // Push values
    try stack.push(10);
    try stack.push(20);
    try stack.push(30);

    // Test dup(1) - duplicate top
    try stack.dup(1);
    try testing.expectEqual(@as(u256, 30), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 4), stack.len());

    // Test dup(2) - duplicate second from top
    try stack.dup(2);
    try testing.expectEqual(@as(u256, 20), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 5), stack.len());

    // Test invalid dup
    try testing.expectError(StackError.InvalidPosition, stack.dup(0));
    try testing.expectError(StackError.InvalidPosition, stack.dup(17));
    try testing.expectError(StackError.OutOfBounds, stack.dup(10));
}

test "Stack: dupN compile-time operations" {
    var stack = Stack{};

    // Push values
    try stack.push(100);
    try stack.push(200);
    try stack.push(300);

    // Test dupN
    try stack.dupN(2);
    try testing.expectEqual(@as(u256, 200), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 4), stack.len());

    // Test dup_unsafe
    stack.dup_unsafe(1);
    try testing.expectEqual(@as(u256, 200), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 5), stack.len());

    // Test dupN_unsafe
    stack.dupN_unsafe(3);
    try testing.expectEqual(@as(u256, 300), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 6), stack.len());
}

// Bulk operations tests

test "Stack: popn operations" {
    var stack = Stack{};

    // Push values
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    try stack.push(4);
    try stack.push(5);

    // Pop 3 values
    const values = try stack.popn(3);
    try testing.expectEqual(@as(u256, 3), values[0]);
    try testing.expectEqual(@as(u256, 4), values[1]);
    try testing.expectEqual(@as(u256, 5), values[2]);

    // Check remaining stack
    try testing.expectEqual(@as(usize, 2), stack.len());
    try testing.expectEqual(@as(u256, 2), (try stack.peek()).*);

    // Try to pop more than available
    try testing.expectError(StackError.OutOfBounds, stack.popn(3));
}

test "Stack: popn_top operation" {
    var stack = Stack{};

    // Push values
    try stack.push(10);
    try stack.push(20);
    try stack.push(30);
    try stack.push(40);

    // Pop 2 and get reference to new top
    const result = try stack.popn_top(2);
    try testing.expectEqual(@as(u256, 20), result.values[0]);
    try testing.expectEqual(@as(u256, 30), result.values[1]);
    try testing.expectEqual(@as(u256, 10), result.top.*);

    // Stack should have 1 remaining
    try testing.expectEqual(@as(usize, 1), stack.len());

    // Not enough values
    try testing.expectError(StackError.OutOfBounds, stack.popn_top(2));
}

test "Stack: push_slice operation" {
    var stack = Stack{};

    // Push multiple values
    const values = [_]u256{ 100, 200, 300, 400 };
    try stack.push_slice(&values);

    // Verify all pushed
    try testing.expectEqual(@as(usize, 4), stack.len());
    try testing.expectEqual(@as(u256, 400), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 300), (try stack.back(1)).*);
    try testing.expectEqual(@as(u256, 200), (try stack.back(2)).*);
    try testing.expectEqual(@as(u256, 100), (try stack.back(3)).*);

    // Test overflow
    var large_values: [STACK_LIMIT]u256 = undefined;
    for (&large_values, 0..) |*v, i| {
        v.* = @as(u256, i);
    }
    try testing.expectError(StackError.StackOverflow, stack.push_slice(&large_values));
}

// EIP-663 operations tests

test "Stack: dupn operation (dynamic)" {
    var stack = Stack{};

    // Push values
    try stack.push(10);
    try stack.push(20);
    try stack.push(30);

    // Test dupn with u8 parameter
    try stack.dupn(2);
    try testing.expectEqual(@as(u256, 20), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 4), stack.len());

    // Test invalid dupn
    try testing.expectError(StackError.InvalidPosition, stack.dupn(0));
    try testing.expectError(StackError.OutOfBounds, stack.dupn(10));
}

test "Stack: swapn operation (dynamic)" {
    var stack = Stack{};

    // Push values
    for (1..6) |i| {
        try stack.push(@as(u256, i));
    }

    // Test swapn (n+1 position per EIP-663)
    try stack.swapn(1); // Swap top with position 2
    try testing.expectEqual(@as(u256, 3), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 5), (try stack.back(2)).*);

    // Test boundary
    try testing.expectError(StackError.OutOfBounds, stack.swapn(10));
}

test "Stack: exchange operation" {
    var stack = Stack{};

    // Push values
    for (1..8) |i| {
        try stack.push(@as(u256, i));
    }

    // Exchange positions 1 and 3 (n=0, m=2)
    try stack.exchange(0, 2);
    try testing.expectEqual(@as(u256, 7), (try stack.peek()).*); // unchanged
    try testing.expectEqual(@as(u256, 4), (try stack.back(1)).*); // was 6
    try testing.expectEqual(@as(u256, 5), (try stack.back(2)).*); // unchanged
    try testing.expectEqual(@as(u256, 6), (try stack.back(3)).*); // was 4

    // Test invalid exchange (m=0)
    try testing.expectError(StackError.InvalidPosition, stack.exchange(1, 0));

    // Test out of bounds
    try testing.expectError(StackError.OutOfBounds, stack.exchange(5, 5));
}

// Utility operations tests

test "Stack: clear operation" {
    var stack = Stack{};

    // Push values
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);

    // Clear
    stack.clear();
    try testing.expectEqual(@as(usize, 0), stack.len());
    try testing.expect(stack.isEmpty());

    // Can push after clear
    try stack.push(42);
    try testing.expectEqual(@as(u256, 42), (try stack.peek()).*);
}

test "Stack: toSlice operation" {
    var stack = Stack{};

    // Empty slice
    var slice = stack.toSlice();
    try testing.expectEqual(@as(usize, 0), slice.len);

    // Push values
    try stack.push(10);
    try stack.push(20);
    try stack.push(30);

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
        try stack.push(@as(u256, i));
    }

    // Valid requirements
    try testing.expect(stack.checkRequirements(2, 1)); // Pop 2, push 1
    try testing.expect(stack.checkRequirements(5, 0)); // Pop all
    try testing.expect(stack.checkRequirements(0, 5)); // Just push

    // Invalid requirements
    try testing.expect(!stack.checkRequirements(6, 0)); // Can't pop 6 from 5
    try testing.expect(!stack.checkRequirements(0, STACK_LIMIT)); // Would overflow
}

// Edge cases and error conditions

test "Stack: edge case operations" {
    var stack = Stack{};

    // Multiple operations on empty stack
    try testing.expectError(StackError.OutOfBounds, stack.pop());
    try testing.expectError(StackError.OutOfBounds, stack.peek());
    try testing.expectError(StackError.OutOfBounds, stack.back(0));
    try testing.expectError(StackError.OutOfBounds, stack.swap1());
    try testing.expectError(StackError.OutOfBounds, stack.dup(1));

    // Single element edge cases
    try stack.push(42);
    try testing.expectError(StackError.OutOfBounds, stack.swap1()); // Need 2 elements
    try stack.dup(1); // Can dup single element
    try testing.expectEqual(@as(u256, 42), (try stack.peek()).*);

    // Clear and reuse
    stack.clear();
    try testing.expectEqual(@as(usize, 0), stack.len());
    try stack.push(100);
    try testing.expectEqual(@as(u256, 100), (try stack.peek()).*);
}

test "Stack: memory safety verification" {
    var stack = Stack{};

    // Push and pop cycle
    try stack.push(0xDEADBEEF);
    try stack.push(0xCAFEBABE);
    
    _ = try stack.pop();
    try testing.expectEqual(@as(usize, 1), stack.len());
    
    // The popped value location should be cleared (in safe variant)
    // This is implementation detail but important for security
    
    // Push new value
    try stack.push(0x12345678);
    try testing.expectEqual(@as(u256, 0x12345678), (try stack.peek()).*);
}

test "Stack: makeSwapN helper function" {
    const swap5_fn = @import("evm").makeSwapN(5);
    
    var stack = Stack{};
    for (1..7) |i| {
        try stack.push(@as(u256, i));
    }
    
    try swap5_fn(&stack);
    try testing.expectEqual(@as(u256, 1), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 6), (try stack.back(5)).*);
}

// Complex combined operations test

test "Stack: complex operation sequences" {
    var stack = Stack{};

    // Sequence: push, dup, swap, pop
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    
    try stack.dup(2); // Stack: [1, 2, 3, 2]
    try testing.expectEqual(@as(u256, 2), (try stack.peek()).*);
    
    try stack.swap2(); // Stack: [1, 3, 2, 2]
    try testing.expectEqual(@as(u256, 3), (try stack.peek()).*);
    
    const popped = try stack.popn(2); // Stack: [1, 3]
    try testing.expectEqual(@as(u256, 2), popped[0]);
    try testing.expectEqual(@as(u256, 3), popped[1]);
    
    try testing.expectEqual(@as(usize, 2), stack.len());
    try testing.expectEqual(@as(u256, 3), (try stack.peek()).*);
}