const std = @import("std");
const testing = std.testing;
const Stack = @import("Stack.zig").Stack;
const StackError = @import("Stack.zig").StackError;

// Helper function to setup a stack with predefined values
fn setupStack(items: []const u64) !Stack {
    var stack = Stack{};
    for (items) |item| {
        try stack.push(item);
    }
    return stack;
}

// Basic push/pop operations
test "Stack: basic push and pop operations" {
    var stack = Stack{};
    
    // Push values to stack
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    
    // Check stack size
    try testing.expectEqual(@as(usize, 3), stack.len());
    
    // Pop values and verify
    try testing.expectEqual(@as(u64, 3), try stack.pop());
    try testing.expectEqual(@as(u64, 2), try stack.pop());
    try testing.expectEqual(@as(u64, 1), try stack.pop());
    
    // Stack should be empty
    try testing.expectEqual(@as(usize, 0), stack.len());
    
    // Trying to pop from empty stack should throw OutOfBounds
    try testing.expectError(StackError.OutOfBounds, stack.pop());
}

// Test peek operations
test "Stack: peek operations" {
    var stack = Stack{};
    
    // Stack is empty, peek should throw OutOfBounds
    try testing.expectError(StackError.OutOfBounds, stack.peek());
    
    // Push values to stack
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    
    // Peek at top value (should be 3)
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);
    
    // Stack size should remain unchanged after peek
    try testing.expectEqual(@as(usize, 3), stack.len());
}

// Test stack overflow
test "Stack: overflow conditions" {
    var stack = Stack{};
    
    // Push values until almost full
    var i: u64 = 0;
    while (i < Stack.capacity - 1) : (i += 1) {
        try stack.push(i);
    }
    
    // Push one more value to reach capacity
    try stack.push(i);
    
    // Stack should be at capacity
    try testing.expectEqual(Stack.capacity, stack.len());
    
    // Trying to push another value should throw StackOverflow
    try testing.expectError(StackError.StackOverflow, stack.push(i + 1));
}

// Test multiple item operations (popN)
test "Stack: popN operations" {
    var stack = Stack{};
    
    // Push values to stack
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    try stack.push(4);
    try stack.push(5);
    
    // Pop multiple values and verify
    const values = try stack.popn(3);
    try testing.expectEqual(@as(u64, 3), values[0]);
    try testing.expectEqual(@as(u64, 4), values[1]);
    try testing.expectEqual(@as(u64, 5), values[2]);
    
    // Stack should have remaining items
    try testing.expectEqual(@as(usize, 2), stack.len());
    try testing.expectEqual(@as(u64, 2), (try stack.peek()).*);
    
    // Try to pop more values than available
    try testing.expectError(StackError.OutOfBounds, stack.popn(3));
}

// Test popn_top operation
test "Stack: popn_top operation" {
    var stack = Stack{};
    
    // Push values to stack
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    try stack.push(4);
    
    // Pop multiple values and get top
    const result = try stack.popn_top(2);
    try testing.expectEqual(@as(u64, 2), result.values[0]);
    try testing.expectEqual(@as(u64, 3), result.values[1]);
    try testing.expectEqual(@as(u64, 1), result.top.*);
    
    // Stack should have remaining items
    try testing.expectEqual(@as(usize, 1), stack.len());
    
    // Try to pop more values than available
    try testing.expectError(StackError.OutOfBounds, stack.popn_top(2));
}

// Test swap operations
test "Stack: swap operations" {
    var stack = Stack{};
    
    // Not enough items for swap1
    try testing.expectError(StackError.OutOfBounds, stack.swap1());
    
    // Push values to stack
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    try stack.push(4);
    try stack.push(5);
    
    // Test swap1
    try stack.swap1();
    try testing.expectEqual(@as(u64, 4), (try stack.peek()).*);
    try testing.expectEqual(@as(u64, 5), (try stack.back(1)).*);
    
    // Test swap1_fast
    try stack.swap1_fast();
    try testing.expectEqual(@as(u64, 5), (try stack.peek()).*);
    try testing.expectEqual(@as(u64, 4), (try stack.back(1)).*);
    
    // Test other swap operations
    try stack.swap2();
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);
    try testing.expectEqual(@as(u64, 4), (try stack.back(1)).*);
    try testing.expectEqual(@as(u64, 5), (try stack.back(2)).*);
    
    // Test for insufficient items
    var small_stack = try setupStack(&[_]u64{1, 2});
    try testing.expectError(StackError.OutOfBounds, small_stack.swap2());
}

// Test all available swap operations
test "Stack: all swap operations" {
    // Setup stack with 17 items (enough for all swap operations)
    var stack = Stack{};
    var i: u64 = 1;
    while (i <= 17) : (i += 1) {
        try stack.push(i);
    }
    
    // Test each swap operation
    try stack.swap1();
    try testing.expectEqual(@as(u64, 16), (try stack.peek()).*);
    try testing.expectEqual(@as(u64, 17), (try stack.back(1)).*);
    
    // Reset stack
    _ = try stack.pop();
    _ = try stack.pop();
    try stack.push(16);
    try stack.push(17);
    
    // Test swap2
    try stack.swap2();
    try testing.expectEqual(@as(u64, 15), (try stack.peek()).*);
    try testing.expectEqual(@as(u64, 17), (try stack.back(2)).*);
    
    // Reset stack
    _ = try stack.pop();
    try stack.push(17);
    
    // Test swap3
    try stack.swap3();
    try testing.expectEqual(@as(u64, 14), (try stack.peek()).*);
    try testing.expectEqual(@as(u64, 17), (try stack.back(3)).*);
    
    // Reset stack
    _ = try stack.pop();
    try stack.push(17);
    
    // Test swap operations 4-16
    // Testing a sample of them for brevity
    
    // Test swap4
    try stack.swap4();
    try testing.expectEqual(@as(u64, 13), (try stack.peek()).*);
    try testing.expectEqual(@as(u64, 17), (try stack.back(4)).*);
    
    // Reset stack
    _ = try stack.pop();
    try stack.push(17);
    
    // Test swap8
    try stack.swap8();
    try testing.expectEqual(@as(u64, 9), (try stack.peek()).*);
    try testing.expectEqual(@as(u64, 17), (try stack.back(8)).*);
    
    // Reset stack
    _ = try stack.pop();
    try stack.push(17);
    
    // Test swap16
    try stack.swap16();
    try testing.expectEqual(@as(u64, 1), (try stack.peek()).*);
    try testing.expectEqual(@as(u64, 17), (try stack.back(16)).*);
}

// Test dup operations
test "Stack: dup operations" {
    var stack = Stack{};
    
    // Push some initial values
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    
    // Test dup1 (duplicate top item)
    try stack.dup(1);
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 4), stack.len());
    
    // Test dup2 (duplicate second item)
    try stack.dup(2);
    try testing.expectEqual(@as(u64, 2), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 5), stack.len());
    
    // Test dup3 (duplicate third item)
    try stack.dup(3);
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 6), stack.len());
    
    // Test error cases
    try testing.expectError(StackError.OutOfBounds, stack.dup(0)); // Invalid position
    try testing.expectError(StackError.OutOfBounds, stack.dup(10)); // Beyond stack size
}

// Test dup_unsafe operation
test "Stack: dup_unsafe operation" {
    var stack = Stack{};
    
    // Push some initial values
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    
    // Test dup_unsafe
    stack.dup_unsafe(1);
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 4), stack.len());
    
    stack.dup_unsafe(2);
    try testing.expectEqual(@as(u64, 2), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 5), stack.len());
}

// Test back operations
test "Stack: back operations" {
    var stack = Stack{};
    
    // Push values to stack
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    try stack.push(4);
    
    // Test back
    try testing.expectEqual(@as(u64, 4), (try stack.back(0)).*);
    try testing.expectEqual(@as(u64, 3), (try stack.back(1)).*);
    try testing.expectEqual(@as(u64, 2), (try stack.back(2)).*);
    try testing.expectEqual(@as(u64, 1), (try stack.back(3)).*);
    
    // Test out of bounds
    try testing.expectError(StackError.OutOfBounds, stack.back(4));
    
    // Test back_unsafe
    try testing.expectEqual(@as(u64, 4), stack.back_unsafe(0).*);
    try testing.expectEqual(@as(u64, 1), stack.back_unsafe(3).*);
}

// Test push_slice operation
test "Stack: push_slice operation" {
    var stack = Stack{};
    
    // Test with various byte sequences
    const bytes1 = [_]u8{0x12, 0x34, 0x56, 0x78};
    try stack.push_slice(&bytes1);
    try testing.expectEqual(@as(usize, 1), stack.len());
    try testing.expectEqual(@as(u64, 0x12345678), (try stack.peek()).*);
    _ = try stack.pop();
    
    // Test with larger byte sequence
    const bytes2 = [_]u8{0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08};
    try stack.push_slice(&bytes2);
    try testing.expectEqual(@as(usize, 1), stack.len());
    try testing.expectEqual(@as(u64, 0x0102030405060708), (try stack.peek()).*);
    _ = try stack.pop();
    
    // Test with partial byte sequence
    const bytes3 = [_]u8{0xAA, 0xBB, 0xCC};
    try stack.push_slice(&bytes3);
    try testing.expectEqual(@as(usize, 1), stack.len());
    // Value should be shifted appropriately based on the implementation
    const value = (try stack.peek()).*;
    try testing.expect(value != 0);
    _ = try stack.pop();
    
    // Test with empty byte sequence
    const bytes4 = [_]u8{};
    try stack.push_slice(&bytes4);
    try testing.expectEqual(@as(usize, 0), stack.len());
}

// Test peek_n operation
test "Stack: peek_n operation" {
    var stack = Stack{};
    
    // Push values to stack
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    try stack.push(4);
    
    // Test peek_n
    try testing.expectEqual(@as(u64, 4), try stack.peek_n(0));
    try testing.expectEqual(@as(u64, 3), try stack.peek_n(1));
    try testing.expectEqual(@as(u64, 2), try stack.peek_n(2));
    try testing.expectEqual(@as(u64, 1), try stack.peek_n(3));
    
    // Test out of bounds
    try testing.expectError(StackError.OutOfBounds, stack.peek_n(4));
}

// Test preserving stack items during operations
test "Stack: preserve values during operations" {
    var stack = Stack{};
    
    // Push values to stack
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    
    // Peek (should not modify stack)
    _ = try stack.peek();
    try testing.expectEqual(@as(usize, 3), stack.len());
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);
    
    // Use back (should not modify stack)
    _ = try stack.back(1);
    try testing.expectEqual(@as(usize, 3), stack.len());
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);
    try testing.expectEqual(@as(u64, 2), (try stack.back(1)).*);
    
    // Use swap (should not change stack size)
    try stack.swap1();
    try testing.expectEqual(@as(usize, 3), stack.len());
    try testing.expectEqual(@as(u64, 2), (try stack.peek()).*);
    try testing.expectEqual(@as(u64, 3), (try stack.back(1)).*);
    
    // Use dup (should increase stack size by 1)
    try stack.dup(2);
    try testing.expectEqual(@as(usize, 4), stack.len());
    try testing.expectEqual(@as(u64, 1), (try stack.peek()).*);
}

// Test unsafe operations
test "Stack: unsafe operations" {
    var stack = Stack{};
    
    // Push values to stack
    try stack.push(1);
    try stack.push(2);
    
    // Test push_unsafe
    stack.push_unsafe(3);
    try testing.expectEqual(@as(usize, 3), stack.len());
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);
    
    // Test pop_unsafe
    const val = stack.pop_unsafe();
    try testing.expectEqual(@as(u64, 3), val);
    try testing.expectEqual(@as(usize, 2), stack.len());
    
    // Test peek_unsafe
    const peekVal = stack.peek_unsafe();
    try testing.expectEqual(@as(u64, 2), peekVal.*);
}

// Combined complex operations test
test "Stack: complex combined operations" {
    var stack = Stack{};
    
    // Push multiple values
    try stack.push(1);
    try stack.push(2);
    try stack.push(3);
    try stack.push(4);
    try stack.push(5);
    
    // Perform a series of operations
    try stack.swap1(); // Stack: 1, 2, 3, 5, 4
    try stack.dup(3);  // Stack: 1, 2, 3, 5, 4, 3
    
    // Verify stack state
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);
    try testing.expectEqual(@as(usize, 6), stack.len());
    
    // Pop multiple items
    const popped = try stack.popn(3);
    try testing.expectEqual(@as(u64, 3), popped[0]);
    try testing.expectEqual(@as(u64, 4), popped[1]);
    try testing.expectEqual(@as(u64, 5), popped[2]);
    
    // Verify final state
    try testing.expectEqual(@as(usize, 3), stack.len());
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);
    try testing.expectEqual(@as(u64, 2), (try stack.back(1)).*);
    try testing.expectEqual(@as(u64, 1), (try stack.back(2)).*);
}

// Test for correct memory cleanup after operations
test "Stack: memory cleanup after operations" {
    var stack = Stack{};
    
    // Push values
    try stack.push(0xDEADBEEF);
    try stack.push(0xCAFEBABE);
    
    // Pop a value, which should clear the memory
    _ = try stack.pop();
    
    // The size should be reduced
    try testing.expectEqual(@as(usize, 1), stack.len());
    
    // Push a new value and make sure it's not affected by the previous value
    try stack.push(0x12345678);
    try testing.expectEqual(@as(u64, 0x12345678), (try stack.peek()).*);
    
    // Use popn to remove both values
    _ = try stack.popn(2);
    try testing.expectEqual(@as(usize, 0), stack.len());
    
    // Push another value and ensure it starts fresh
    try stack.push(0xABCDEF);
    try testing.expectEqual(@as(u64, 0xABCDEF), (try stack.peek()).*);
}