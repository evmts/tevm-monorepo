# Stack Implementation Issue

## Overview

Stack.zig provides a fixed-size stack implementation optimized for EVM operations with 1024 u256 elements capacity, supporting push/pop, swap, dup operations with both safe and unsafe variants.

## Requirements

- Fixed-size stack with 1024 u256 elements capacity
- Zero-copy operations where possible
- Push/pop operations with overflow/underflow checking
- Swap operations (SWAP1-SWAP16) with optimized implementations
- Dup operations (DUP1-DUP16) with bounds checking
- Stack-relative addressing (peek, back operations)
- Support for both safe and unsafe operation variants
- Inline all performance-critical operations
- No heap allocations (stack-allocated array)
- Alignment guarantees for cache efficiency
- EIP-663 support (DUPN, SWAPN, EXCHANGE)

## Interface

```zig
const std = @import("std");

pub const StackError = error{
    OutOfBounds,
    StackOverflow,
    InvalidPosition,
};

pub const Stack = struct {
    /// Static array of 1024 u256 elements, aligned for optimal cache performance
    data: [1024]u256 align(32) = [_]u256{0} ** 1024,
    /// Current stack size (number of elements)
    size: usize = 0,
    /// Maximum stack capacity (compile-time constant)
    pub const capacity: usize = 1024;
    
    // Basic operations
    
    /// Push a value onto the stack
    pub inline fn push(self: *Stack, value: u256) StackError!void
    
    /// Push without bounds checking (caller ensures space available)
    pub inline fn push_unsafe(self: *Stack, value: u256) void
    
    /// Pop a value from the stack
    pub inline fn pop(self: *Stack) StackError!u256
    
    /// Pop without bounds checking (caller ensures stack not empty)
    pub inline fn pop_unsafe(self: *Stack) u256
    
    /// Get reference to top element without popping
    pub inline fn peek(self: *Stack) StackError!*u256
    
    /// Peek without bounds checking
    pub inline fn peek_unsafe(self: *Stack) *u256
    
    /// Get current stack size
    pub inline fn len(self: *const Stack) usize
    
    /// Check if stack is empty
    pub inline fn isEmpty(self: *const Stack) bool
    
    /// Check if stack is full
    pub inline fn isFull(self: *const Stack) bool
    
    // Stack-relative operations
    
    /// Get reference to element N positions from top (0 = top)
    pub inline fn back(self: *Stack, n: usize) StackError!*u256
    
    /// Back without bounds checking
    pub inline fn back_unsafe(self: *Stack, n: usize) *u256
    
    /// Peek at element N positions from top (0 = top)
    pub inline fn peek_n(self: *const Stack, n: usize) StackError!u256
    
    // Swap operations (optimized)
    
    /// Generic swap operation (1-16)
    pub inline fn swap(self: *Stack, n: usize) StackError!void
    
    /// Swap top with Nth element (compile-time known N)
    pub inline fn swapN(self: *Stack, comptime N: usize) StackError!void
    
    /// Individual swap operations for better optimization
    pub inline fn swap1(self: *Stack) StackError!void
    pub inline fn swap2(self: *Stack) StackError!void
    // ... swap3 through swap16
    
    /// Unsafe swap variants
    pub inline fn swap_unsafe(self: *Stack, n: usize) void
    pub inline fn swapN_unsafe(self: *Stack, comptime N: usize) void
    
    // Dup operations
    
    /// Duplicate Nth element to top (1-based: dup(1) duplicates top)
    pub inline fn dup(self: *Stack, n: usize) StackError!void
    
    /// Dup with compile-time known N
    pub inline fn dupN(self: *Stack, comptime N: usize) StackError!void
    
    /// Unsafe dup variants
    pub inline fn dup_unsafe(self: *Stack, n: usize) void
    pub inline fn dupN_unsafe(self: *Stack, comptime N: usize) void
    
    // Bulk operations
    
    /// Pop N values from stack, returns them in order (top first)
    pub inline fn popn(self: *Stack, comptime N: usize) StackError![N]u256
    
    /// Pop N values and return reference to new top (for opcodes that pop N and push 1)
    pub inline fn popn_top(self: *Stack, comptime N: usize) StackError!struct { 
        values: [N]u256, 
        top: *u256 
    }
    
    /// Push multiple values (for testing/initialization)
    pub fn push_slice(self: *Stack, values: []const u256) StackError!void
    
    // EIP-663 operations
    
    /// DUPN - duplicate Nth element (dynamic N from bytecode)
    pub inline fn dupn(self: *Stack, n: u8) StackError!void
    
    /// SWAPN - swap top with Nth element (dynamic N from bytecode)
    pub inline fn swapn(self: *Stack, n: u8) StackError!void
    
    /// EXCHANGE - exchange two elements at positions n+1 and n+m+1
    pub inline fn exchange(self: *Stack, n: u8, m: u8) StackError!void
    
    // Utility operations
    
    /// Clear the stack (reset to empty)
    pub inline fn clear(self: *Stack) void
    
    /// Get slice of stack data (for debugging/serialization)
    pub fn toSlice(self: *const Stack) []const u256
    
    /// Validate stack requirements for an operation
    pub inline fn checkRequirements(self: *const Stack, pop_count: usize, push_count: usize) bool
};

// Helper functions

/// Create swap function using comptime (for generating swap1-swap16)
pub fn makeSwapN(comptime N: usize) fn(*Stack) StackError!void {
    return struct {
        pub fn swap(stack: *Stack) StackError!void {
            if (stack.size <= N) return StackError.OutOfBounds;
            // Direct memory swap, avoiding temporary variables when possible
            const top_idx = stack.size - 1;
            const swap_idx = stack.size - N - 1;
            const temp = stack.data[top_idx];
            stack.data[top_idx] = stack.data[swap_idx];
            stack.data[swap_idx] = temp;
        }
    }.swap;
}
```

## Implementation Guidelines

1. Use static array `[1024]u256` with explicit alignment (32 bytes minimum)
2. All operations must be marked `inline` for performance
3. Implement both safe (with checks) and unsafe (no checks) variants
4. Use direct array indexing, not pointer arithmetic (Zig optimizer handles this better)
5. For swap operations, avoid `std.mem.swap` in hot paths - use direct assignment
6. Consider cache-line alignment for frequently accessed fields
7. No debug prints or logging in any operations
8. Use `@setRuntimeSafety(false)` in unsafe functions for maximum performance
9. Leverage comptime for generating repetitive operations (swap1-swap16)
10. Ensure bounds checks compile to branch-free code where possible
11. Stack grows upward: index 0 is bottom, size-1 is top
12. Clear popped values for security (set to 0) in safe variants
13. Use `std.debug.assert` in unsafe variants (compiled out in release)
14. Consider `@prefetch` for operations that access deep stack elements
15. Optimize for common case: stack has space for push, has elements for pop

## Error Handling

- `OutOfBounds`: Attempted to access element beyond current stack size
- `StackOverflow`: Attempted to push when stack is at capacity (1024)
- `InvalidPosition`: Invalid position specified for dup/swap operations

## Performance Considerations

- Static allocation eliminates heap allocation overhead
- Inline everything to enable cross-operation optimization
- Direct indexing is faster than pointer arithmetic in Zig
- Unsafe variants for validated hot paths (10-20% performance gain)
- Consider generating swap1-swap16 at comptime to reduce code size
- Alignment guarantees enable SIMD optimizations (future)
- Clear security: only clear popped values in safe variants
- Branch prediction: optimize for successful operations
- Cache efficiency: frequently accessed data (size) at struct start

## Dependencies

- `std` - Zig standard library only
- No heap allocations, no external dependencies

## Export Requirements

- This module must be publicly exported from the EVM package
- Add to `src/Evm/package.zig`: `pub const Stack = @import("Stack.zig").Stack;`
- Add to `src/package.zig`: `pub const Stack = Evm.Stack;`

## Test Requirements

### 1. Functional Tests

- Empty stack operations (pop/peek on empty should error)
- Basic push/pop sequences with value verification
- Stack overflow detection (push beyond 1024 capacity)
- All swap operations (swap1-swap16) with bounds checking
- All dup operations with proper value duplication
- Stack-relative addressing (back, peek_n)
- Bulk operations (popn with various N values)
- Clear operation resets stack properly
- EIP-663 operations (dupn, swapn, exchange)
- Edge cases for each operation at stack boundaries

### 2. Safety Tests

- Unsafe operations in debug mode (should assert)
- Safe operations with invalid inputs (should return errors)
- Memory clearing verification after pop operations
- Stack integrity after failed operations
- Bounds checking for all indexed operations

### 3. Performance Tests (required)

```zig
const StackBenchmark = struct {
    // Measure push/pop throughput
    pub fn benchmarkPushPop() !void
    // Target: >500M operations/second
    
    // Measure swap operations performance
    pub fn benchmarkSwap() !void
    // Target: swap1 >400M ops/sec, swap16 >300M ops/sec
    
    // Measure dup operations performance
    pub fn benchmarkDup() !void
    // Target: >400M operations/second
    
    // Compare safe vs unsafe variants
    pub fn benchmarkSafeVsUnsafe() !void
    // Target: unsafe 10-20% faster than safe
    
    // Measure bulk operations
    pub fn benchmarkBulkOps() !void
    // Target: popn(4) within 2x of 4 individual pops
    
    // Cache efficiency test
    pub fn benchmarkCacheAccess() !void
    // Target: <2ns per operation for hot cache
};
```

### 4. Stress Tests

- Maximum depth operations (all 1024 slots used)
- Rapid push/pop cycles (cache stress)
- Deep stack access patterns (swap16, dup16)
- Interleaved operations (push/swap/dup/pop sequences)

### 5. Comparison Tests

- Performance comparison with revm's Vec-based stack
- Performance comparison with evmone's pointer-based stack
- Memory usage comparison (should be constant 32KB)

## Invariants to Verify

- Stack size never exceeds capacity (1024)
- Stack size is always consistent with actual data
- No memory leaks (static allocation)
- Popped values are cleared in safe variants
- All operations maintain stack integrity
- Unsafe operations never perform bounds checking
- Safe operations always validate inputs

---

## Current Implementation Analysis

The current Zig implementation already has many optimizations:

**Strengths**:
1. **Static allocation** - Uses `[1024]u256` array, avoiding heap allocation overhead
2. **Inline functions** - All operations marked `inline`
3. **Unsafe variants** - Provides both safe and unsafe versions
4. **Direct indexing** - Uses array indexing instead of pointer arithmetic
5. **Compile-time operations** - Has `popn` with comptime N parameter
6. **Well-documented** - Includes performance comparisons with revm/evmone

**Areas for Improvement**:
1. **Repetitive swap functions** - Could use comptime generation
2. **Missing EIP-663** - No dupn, swapn, exchange operations
3. **Manual swap implementation** - swap1_fast shows std.mem.swap overhead
4. **Missing bulk operations** - No push_slice optimization for u256
5. **No alignment specification** - Should specify alignment for cache
6. **Security clearing** - Clears popped values even in unsafe variants

## revm Implementation Reference

From revm analysis:
```rust
// Uses Vec<U256> with capacity 1024
// Key optimizations:
// - Capacity pre-allocation
// - assume! macro for optimization hints
// - ptr::swap_nonoverlapping for efficient swaps
// - Optimized push_slice using u64 chunks
```

## evmone Implementation Reference

From evmone analysis:
```cpp
// Key design choices:
// - StackTop abstraction with pointer to end
// - Template-based swap/dup for compile-time optimization
// - Manual swap to work around compiler optimization issues
// - Aligned allocation for cache efficiency
// - No bounds checking in core operations
// - Separate StackSpace class for memory management

// Notable optimization for swap:
// Manual field-by-field copy instead of std::swap
// to work around clang optimization issue #59116
```

## Key Improvements Needed

1. **Add alignment specification** - Align to cache line (32 or 64 bytes)
2. **Implement comptime swap generation** - Reduce code duplication
3. **Add EIP-663 operations** - dupn, swapn, exchange for dynamic indices
4. **Optimize swap further** - Consider evmone's manual copy approach
5. **Add exchange operation** - New EIP-663 operation
6. **Remove unnecessary clearing** - Don't clear in unsafe variants
7. **Add checkRequirements** - Validate stack has space for operation
8. **Consider StackTop abstraction** - For cleaner opcode implementation
9. **Add @setRuntimeSafety(false)** - In unsafe functions
10. **Document performance targets** - Based on revm/evmone benchmarks