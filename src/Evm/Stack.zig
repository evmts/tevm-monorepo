const std = @import("std");

/// Maximum stack depth for the EVM
pub const MAX_STACK_DEPTH = 1024;

/// Stack represents the EVM stack, which contains 256-bit words
///
/// The EVM stack is a last-in-first-out (LIFO) data structure that can hold
/// a maximum of 1024 items, each 256 bits wide. It's used to store operands
/// for computation and control flow within the EVM.
///
/// The stack has the following properties:
/// - Limited to MAX_STACK_DEPTH (1024) items
/// - Each item is 256 bits (32 bytes)
/// - Operations can push/pop values and manipulate the stack
/// - Stack underflow and overflow are checked and result in errors
///
/// PERFORMANCE OPTIMIZATION NOTES:
///
/// Based on analysis of evmone and revm implementations:
///
/// 1. DIRECT ARRAY ACCESS:
///    - evmone implements stack as a fixed-size array with a stack pointer
///    - This avoids bounds checking and dynamic allocation overhead
///    - Current implementation is already good with a pre-allocated array
///
/// 2. STACK POINTER:
///    - Using direct stack pointer manipulation is faster than modifying sizes
///    - This is already implemented with our size field
///
/// 3. STACK DEPTH CACHING:
///    - Cache stack depth values for repeated use in validation logic
///    - This can reduce repeated bounds checking in tight loops
pub const Stack = struct {
    const Self = @This();

    /// The underlying array storing the stack items
    data: [1024]u256 align(@alignOf(u256)) = [_]u256{0} ** 1024,

    /// The current size of the stack (number of items)
    size: usize = 0,

    /// Creates a new stack instance
    pub fn create() Self {
        return Self{};
    }

    /// Pushes a value onto the stack
    /// Returns an error if the stack would overflow
    pub fn push(self: *Self, value: u256) !void {
        if (self.size >= MAX_STACK_DEPTH) {
            return error.StackOverflow;
        }

        self.data[self.size] = value;
        self.size += 1;
    }

    /// Pops a value from the stack
    /// Returns an error if the stack is empty
    pub fn pop(self: *Self) !u256 {
        if (self.size == 0) {
            return error.StackUnderflow;
        }

        self.size -= 1;
        return self.data[self.size];
    }

    /// Returns a pointer to the top item on the stack without removing it
    /// Returns an error if the stack is empty
    pub fn peek(self: *Self) !*u256 {
        if (self.size == 0) {
            return error.StackUnderflow;
        }

        return &self.data[self.size - 1];
    }

    /// Returns a pointer to the nth item from the top of the stack
    /// n=0 returns the top item, n=1 returns the second item, etc.
    /// Returns an error if n is out of bounds
    pub fn peekAt(self: *Self, n: usize) !*u256 {
        if (n >= self.size) {
            return error.StackUnderflow;
        }

        return &self.data[self.size - 1 - n];
    }

    /// Swaps the nth item from the top with the top item
    /// n=0 is a no-op, n=1 swaps the top two items, etc.
    /// Returns an error if either position is out of bounds
    pub fn swap(self: *Self, n: usize) !void {
        if (n == 0 or n >= self.size) {
            return error.StackUnderflow;
        }

        const temp = self.data[self.size - 1];
        self.data[self.size - 1] = self.data[self.size - 1 - n];
        self.data[self.size - 1 - n] = temp;
    }

    /// Duplicates the nth item from the top to the top of the stack
    /// n=0 duplicates the top item, n=1 duplicates the second item, etc.
    /// Returns an error if n is out of bounds or the stack would overflow
    pub fn dup(self: *Self, n: usize) !void {
        if (n >= self.size) {
            return error.StackUnderflow;
        }

        if (self.size >= MAX_STACK_DEPTH) {
            return error.StackOverflow;
        }

        self.data[self.size] = self.data[self.size - 1 - n];
        self.size += 1;
    }
};
