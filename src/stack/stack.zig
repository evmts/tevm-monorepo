//! Stack implementation for ZigEVM
//! This module implements the EVM stack model with a fixed maximum size of 1024 elements

const std = @import("std");
const types = @import("../util/types.zig");
const U256 = types.U256;
const Error = types.Error;

/// Stack implements the EVM stack with a maximum size of 1024 elements
pub const Stack = struct {
    // Fixed-size array with 1024 elements (max EVM stack size)
    data: [1024]U256 align(16) = undefined,
    size: u16 = 0,
    max_size: u16 = 1024,
    
    /// Initialize a new empty stack
    pub fn init() Stack {
        return .{};
    }
    
    /// Push a value onto the stack
    pub fn push(self: *Stack, value: U256) !void {
        if (self.size >= self.max_size) {
            return Error.StackOverflow;
        }
        self.data[self.size] = value;
        self.size += 1;
    }
    
    /// Pop a value from the stack
    pub fn pop(self: *Stack) !U256 {
        if (self.size == 0) {
            return Error.StackUnderflow;
        }
        self.size -= 1;
        return self.data[self.size];
    }
    
    /// Fast inlined peek operations to get a reference to the top value
    pub inline fn peek(self: *Stack) !*U256 {
        if (self.size == 0) {
            return Error.StackUnderflow;
        }
        return &self.data[self.size - 1];
    }
    
    /// Peek at an arbitrary depth from the top of the stack
    pub inline fn peekAt(self: *Stack, depth: u16) !*U256 {
        if (self.size <= depth) {
            return Error.StackUnderflow;
        }
        return &self.data[self.size - 1 - depth];
    }
    
    /// Implement DUP opcode behavior (duplicate nth value on the stack)
    pub fn dup(self: *Stack, n: u8) !void {
        const pos = n - 1;
        
        if (self.size <= pos) {
            return Error.StackUnderflow;
        }
        
        if (self.size >= self.max_size) {
            return Error.StackOverflow;
        }
        
        self.data[self.size] = self.data[self.size - 1 - pos];
        self.size += 1;
    }
    
    /// Implement SWAP opcode behavior (swap nth value with top of stack)
    pub fn swap(self: *Stack, n: u8) !void {
        const pos = n;
        
        if (self.size <= pos) {
            return Error.StackUnderflow;
        }
        
        const tmp = self.data[self.size - 1];
        self.data[self.size - 1] = self.data[self.size - 1 - pos];
        self.data[self.size - 1 - pos] = tmp;
    }
    
    /// Clear the stack
    pub fn clear(self: *Stack) void {
        self.size = 0;
    }
    
    /// Create a copy of the stack
    pub fn copy(self: *const Stack) Stack {
        var new_stack = Stack.init();
        if (self.size > 0) {
            @memcpy(new_stack.data[0..self.size], self.data[0..self.size]);
        }
        new_stack.size = self.size;
        return new_stack;
    }
    
    /// Create a shallow copy of the top n elements
    pub fn copyTop(self: *const Stack, depth: u16) !Stack {
        var new_stack = Stack.init();
        
        if (self.size < depth) {
            return Error.StackUnderflow;
        }
        
        if (depth > 0) {
            @memcpy(new_stack.data[0..depth], self.data[self.size - depth..self.size]);
        }
        new_stack.size = depth;
        
        return new_stack;
    }
    
    /// Get current stack size
    pub fn getSize(self: *const Stack) u16 {
        return self.size;
    }
    
    /// Check if stack is empty
    pub fn isEmpty(self: *const Stack) bool {
        return self.size == 0;
    }
    
    /// Check if stack is full
    pub fn isFull(self: *const Stack) bool {
        return self.size == self.max_size;
    }
    
    /// Get stack capacity
    pub fn getCapacity(self: *const Stack) u16 {
        return self.max_size;
    }
    
    /// Print the stack contents (for debugging)
    pub fn print(self: *const Stack, writer: anytype) !void {
        try writer.print("Stack (size: {}):\n", .{self.size});
        
        if (self.size == 0) {
            try writer.print("  <empty>\n", .{});
            return;
        }
        
        var i: usize = self.size;
        while (i > 0) {
            i -= 1;
            // Print in hex format for readability
            try writer.print("  {d}: 0x{x:0>16}\n", .{self.size - 1 - i, self.data[i].words[0]});
        }
    }
};

// Tests
test "Stack push and pop" {
    var stack = Stack.init();
    
    // Initial state
    try std.testing.expect(stack.size == 0);
    try std.testing.expect(stack.isEmpty());
    try std.testing.expect(!stack.isFull());
    
    // Push values
    try stack.push(U256.fromU64(42));
    try stack.push(U256.fromU64(100));
    try std.testing.expect(stack.size == 2);
    try std.testing.expect(!stack.isEmpty());
    
    // Pop values
    const v1 = try stack.pop();
    try std.testing.expect(v1.words[0] == 100);
    try std.testing.expect(stack.size == 1);
    
    const v2 = try stack.pop();
    try std.testing.expect(v2.words[0] == 42);
    try std.testing.expect(stack.size == 0);
    try std.testing.expect(stack.isEmpty());
    
    // Test underflow
    try std.testing.expectError(Error.StackUnderflow, stack.pop());
}

test "Stack peek operations" {
    var stack = Stack.init();
    try stack.push(U256.fromU64(10));
    try stack.push(U256.fromU64(20));
    try stack.push(U256.fromU64(30));
    
    // Peek at top
    const top = try stack.peek();
    try std.testing.expect(top.*.words[0] == 30);
    try std.testing.expect(stack.size == 3); // Size unchanged
    
    // Peek at arbitrary depth
    const middle = try stack.peekAt(1);
    try std.testing.expect(middle.*.words[0] == 20);
    
    const bottom = try stack.peekAt(2);
    try std.testing.expect(bottom.*.words[0] == 10);
    
    // Test underflow for peekAt
    try std.testing.expectError(Error.StackUnderflow, stack.peekAt(3));
}

test "Stack DUP and SWAP" {
    var stack = Stack.init();
    try stack.push(U256.fromU64(10)); // [10]
    try stack.push(U256.fromU64(20)); // [10, 20]
    try stack.push(U256.fromU64(30)); // [10, 20, 30]
    
    // Test DUP1 (duplicate top item)
    try stack.dup(1); // [10, 20, 30, 30]
    try std.testing.expect(stack.size == 4);
    const top = try stack.peek();
    try std.testing.expect(top.*.words[0] == 30);
    
    // Test DUP3 (duplicate 3rd item from top)
    try stack.dup(3); // [10, 20, 30, 30, 20]
    try std.testing.expect(stack.size == 5);
    const new_top = try stack.peek();
    try std.testing.expect(new_top.*.words[0] == 20);
    
    // Test SWAP1 (swap top with 2nd item)
    try stack.swap(1); // [10, 20, 30, 20, 30]
    const after_swap1 = try stack.peek();
    try std.testing.expect(after_swap1.*.words[0] == 30);
    const second = try stack.peekAt(1);
    try std.testing.expect(second.*.words[0] == 20);
    
    // Test SWAP4 (swap top with 5th item)
    try stack.swap(4); // [30, 20, 30, 20, 10]
    const after_swap4 = try stack.peek();
    try std.testing.expect(after_swap4.*.words[0] == 10);
    const fifth = try stack.peekAt(4);
    try std.testing.expect(fifth.*.words[0] == 30);
}

test "Stack copy" {
    var stack = Stack.init();
    try stack.push(U256.fromU64(10));
    try stack.push(U256.fromU64(20));
    try stack.push(U256.fromU64(30));
    
    // Full copy
    const full_copy = stack.copy();
    try std.testing.expect(full_copy.size == 3);
    try std.testing.expect((try full_copy.peek()).*.words[0] == 30);
    
    // Partial copy
    const partial = try stack.copyTop(2);
    try std.testing.expect(partial.size == 2);
    try std.testing.expect((try partial.peek()).*.words[0] == 30);
    try std.testing.expect((try partial.peekAt(1)).*.words[0] == 20);
}

test "Stack clear" {
    var stack = Stack.init();
    try stack.push(U256.fromU64(10));
    try stack.push(U256.fromU64(20));
    try std.testing.expect(stack.size == 2);
    
    stack.clear();
    try std.testing.expect(stack.size == 0);
    try std.testing.expect(stack.isEmpty());
}

test "Stack overflow" {
    var stack = Stack.init();
    stack.max_size = 3; // Artificial limit for testing
    
    try stack.push(U256.fromU64(10));
    try stack.push(U256.fromU64(20));
    try stack.push(U256.fromU64(30));
    
    // This should overflow
    try std.testing.expectError(Error.StackOverflow, stack.push(U256.fromU64(40)));
    try std.testing.expect(stack.size == 3);
    try std.testing.expect(stack.isFull());
}