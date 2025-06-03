const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Stack = evm.Stack;

// Test for batched stack operations

test "Stack: pop2_push1 operation" {
    var stack = Stack{};
    
    // Push test values
    try stack.append(10);
    try stack.append(20);
    
    // Compute result and use pop2_push1
    const result = try stack.pop2_push1(30);
    
    // Verify popped values
    try testing.expectEqual(@as(u256, 10), result.a);
    try testing.expectEqual(@as(u256, 20), result.b);
    
    // Verify pushed result
    try testing.expectEqual(@as(usize, 1), stack.size);
    try testing.expectEqual(@as(u256, 30), (try stack.peek()).*);
    
    // Test error case
    try testing.expectError(Stack.Error.OutOfBounds, stack.pop2_push1(42));
}

test "Stack: pop2_push1_unsafe operation" {
    var stack = Stack{};
    
    // Push test values
    try stack.append(100);
    try stack.append(200);
    
    // Use unsafe version
    const result = stack.pop2_push1_unsafe(300);
    
    // Verify
    try testing.expectEqual(@as(u256, 100), result.a);
    try testing.expectEqual(@as(u256, 200), result.b);
    try testing.expectEqual(@as(u256, 300), (try stack.peek()).*);
}

test "Stack: pop3_push1 operation" {
    var stack = Stack{};
    
    // Push test values
    try stack.append(1);
    try stack.append(2);
    try stack.append(3);
    
    // Use pop3_push1
    const result = try stack.pop3_push1(6);
    
    // Verify popped values
    try testing.expectEqual(@as(u256, 1), result.a);
    try testing.expectEqual(@as(u256, 2), result.b);
    try testing.expectEqual(@as(u256, 3), result.c);
    
    // Verify pushed result
    try testing.expectEqual(@as(usize, 1), stack.size);
    try testing.expectEqual(@as(u256, 6), (try stack.peek()).*);
}

test "Stack: pop1_push1 operation" {
    var stack = Stack{};
    
    // Push test value
    try stack.append(42);
    
    // Transform value
    const old_value = try stack.pop1_push1(84);
    
    // Verify
    try testing.expectEqual(@as(u256, 42), old_value);
    try testing.expectEqual(@as(u256, 84), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 1), stack.size);
}

test "Stack: pop2 operation" {
    var stack = Stack{};
    
    // Push test values
    try stack.append(10);
    try stack.append(20);
    try stack.append(30);
    
    // Pop 2 values
    const values = try stack.pop2();
    
    // Verify
    try testing.expectEqual(@as(u256, 20), values.a);
    try testing.expectEqual(@as(u256, 30), values.b);
    try testing.expectEqual(@as(usize, 1), stack.size);
    try testing.expectEqual(@as(u256, 10), (try stack.peek()).*);
}

test "Stack: swap1_optimized operation" {
    var stack = Stack{};
    
    // Push test values
    try stack.append(10);
    try stack.append(20);
    
    // Swap top two
    try stack.swap1_optimized();
    
    // Verify
    try testing.expectEqual(@as(u256, 10), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 20), try stack.back(1));
}

test "Stack: dup1_optimized operation" {
    var stack = Stack{};
    
    // Push test value
    try stack.append(42);
    
    // Duplicate top
    try stack.dup1_optimized();
    
    // Verify
    try testing.expectEqual(@as(usize, 2), stack.size);
    try testing.expectEqual(@as(u256, 42), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 42), try stack.back(1));
}

test "Stack: push_batch operation" {
    var stack = Stack{};
    
    // Batch push values
    const values = [_]u256{ 1, 2, 3, 4, 5 };
    try stack.push_batch(&values);
    
    // Verify all pushed
    try testing.expectEqual(@as(usize, 5), stack.size);
    try testing.expectEqual(@as(u256, 5), (try stack.peek()).*);
    try testing.expectEqual(@as(u256, 4), try stack.back(1));
    try testing.expectEqual(@as(u256, 3), try stack.back(2));
    try testing.expectEqual(@as(u256, 2), try stack.back(3));
    try testing.expectEqual(@as(u256, 1), try stack.back(4));
    
    // Test overflow
    var full_stack = Stack{};
    full_stack.size = Stack.CAPACITY - 2;
    try testing.expectError(Stack.Error.Overflow, full_stack.push_batch(&values));
}

test "Stack: peek_multiple operation" {
    var stack = Stack{};
    
    // Push test values
    try stack.append(10);
    try stack.append(20);
    try stack.append(30);
    try stack.append(40);
    
    // Peek at top 3
    const values = try stack.peek_multiple(3);
    
    // Verify (should be in stack order)
    try testing.expectEqual(@as(u256, 20), values[0]);
    try testing.expectEqual(@as(u256, 30), values[1]);
    try testing.expectEqual(@as(u256, 40), values[2]);
    
    // Stack should be unchanged
    try testing.expectEqual(@as(usize, 4), stack.size);
    
    // Test error
    try testing.expectError(Stack.Error.OutOfBounds, stack.peek_multiple(5));
}

// Performance comparison test (for benchmarking)
test "Stack: batched vs individual operations performance" {
    var stack = Stack{};
    
    // Test traditional approach
    try stack.append(10);
    try stack.append(20);
    const b = try stack.pop();
    const a = try stack.pop();
    const sum = a + b;
    try stack.append(sum);
    
    try testing.expectEqual(@as(u256, 30), (try stack.peek()).*);
    stack.clear();
    
    // Test batched approach
    try stack.append(10);
    try stack.append(20);
    const values = try stack.pop2_push1(30);
    
    try testing.expectEqual(@as(u256, 10), values.a);
    try testing.expectEqual(@as(u256, 20), values.b);
    try testing.expectEqual(@as(u256, 30), (try stack.peek()).*);
}

// Edge case tests
test "Stack: batched operations edge cases" {
    var stack = Stack{};
    
    // Empty stack
    try testing.expectError(Stack.Error.OutOfBounds, stack.pop2_push1(0));
    try testing.expectError(Stack.Error.OutOfBounds, stack.pop3_push1(0));
    try testing.expectError(Stack.Error.OutOfBounds, stack.pop1_push1(0));
    
    // Single element
    try stack.append(42);
    try testing.expectError(Stack.Error.OutOfBounds, stack.pop2_push1(0));
    try testing.expectError(Stack.Error.OutOfBounds, stack.pop3_push1(0));
    
    // Can do pop1_push1
    const val = try stack.pop1_push1(84);
    try testing.expectEqual(@as(u256, 42), val);
}

// Test unsafe operations used correctly
test "Stack: unsafe operations used in hot path simulation" {
    var stack = Stack{};
    
    // Simulate hot path with pre-validated stack
    try stack.append(100);
    try stack.append(200);
    try stack.append(300);
    
    // In real usage, we'd check requirements once
    try testing.expect(stack.checkRequirements(3, 1));
    
    // Then use unsafe operations
    const result1 = stack.pop2_push1_unsafe(500); // 200 + 300
    const result2 = stack.pop2_push1_unsafe(600); // 100 + 500
    
    try testing.expectEqual(@as(u256, 200), result1.a);
    try testing.expectEqual(@as(u256, 300), result1.b);
    try testing.expectEqual(@as(u256, 100), result2.a);
    try testing.expectEqual(@as(u256, 500), result2.b);
    try testing.expectEqual(@as(u256, 600), (try stack.peek()).*);
}