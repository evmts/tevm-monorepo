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

```rust
use crate::InstructionResult;
use core::{fmt, ptr};
use primitives::U256;
use std::vec::Vec;

use super::StackTr;

/// EVM interpreter stack limit.
pub const STACK_LIMIT: usize = 1024;

/// EVM stack with [STACK_LIMIT] capacity of words.
#[derive(Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize))]
pub struct Stack {
    /// The underlying data of the stack.
    data: Vec<U256>,
}

impl fmt::Display for Stack {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str("[")?;
        for (i, x) in self.data.iter().enumerate() {
            if i > 0 {
                f.write_str(", ")?;
            }
            write!(f, "{x}")?;
        }
        f.write_str("]")
    }
}

impl Default for Stack {
    #[inline]
    fn default() -> Self {
        Self::new()
    }
}

impl Clone for Stack {
    fn clone(&self) -> Self {
        // Use `Self::new()` to ensure the cloned Stack maintains the STACK_LIMIT capacity,
        // and then copy the data. This preserves the invariant that Stack always has
        // STACK_LIMIT capacity, which is crucial for the safety and correctness of other methods.
        let mut new_stack = Self::new();
        new_stack.data.extend_from_slice(&self.data);
        new_stack
    }
}

impl StackTr for Stack {
    fn len(&self) -> usize {
        self.len()
    }

    #[inline]
    fn popn<const N: usize>(&mut self) -> Option<[U256; N]> {
        if self.len() < N {
            return None;
        }
        // SAFETY: Stack length is checked above.
        Some(unsafe { self.popn::<N>() })
    }

    #[inline]
    fn popn_top<const POPN: usize>(&mut self) -> Option<([U256; POPN], &mut U256)> {
        if self.len() < POPN + 1 {
            return None;
        }
        // SAFETY: Stack length is checked above.
        Some(unsafe { self.popn_top::<POPN>() })
    }

    fn exchange(&mut self, n: usize, m: usize) -> bool {
        self.exchange(n, m)
    }

    fn dup(&mut self, n: usize) -> bool {
        self.dup(n)
    }

    fn push(&mut self, value: U256) -> bool {
        self.push(value)
    }
}

impl Stack {
    /// Instantiate a new stack with the [default stack limit][STACK_LIMIT].
    #[inline]
    pub fn new() -> Self {
        Self {
            // SAFETY: Expansion functions assume that capacity is `STACK_LIMIT`.
            data: Vec::with_capacity(STACK_LIMIT),
        }
    }

    /// Returns the length of the stack in words.
    #[inline]
    pub fn len(&self) -> usize {
        self.data.len()
    }

    /// Returns whether the stack is empty.
    #[inline]
    pub fn is_empty(&self) -> bool {
        self.data.is_empty()
    }

    /// Returns a reference to the underlying data buffer.
    #[inline]
    pub fn data(&self) -> &Vec<U256> {
        &self.data
    }

    /// Returns a mutable reference to the underlying data buffer.
    #[inline]
    pub fn data_mut(&mut self) -> &mut Vec<U256> {
        &mut self.data
    }

    /// Consumes the stack and returns the underlying data buffer.
    #[inline]
    pub fn into_data(self) -> Vec<U256> {
        self.data
    }

    /// Removes the topmost element from the stack and returns it, or `StackUnderflow` if it is
    /// empty.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn pop(&mut self) -> Result<U256, InstructionResult> {
        self.data.pop().ok_or(InstructionResult::StackUnderflow)
    }

    /// Removes the topmost element from the stack and returns it.
    ///
    /// # Safety
    ///
    /// The caller is responsible for checking the length of the stack.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub unsafe fn pop_unsafe(&mut self) -> U256 {
        self.data.pop().unwrap_unchecked()
    }

    /// Peeks the top of the stack.
    ///
    /// # Safety
    ///
    /// The caller is responsible for checking the length of the stack.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub unsafe fn top_unsafe(&mut self) -> &mut U256 {
        let len = self.data.len();
        self.data.get_unchecked_mut(len - 1)
    }

    /// Pops `N` values from the stack.
    ///
    /// # Safety
    ///
    /// The caller is responsible for checking the length of the stack.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub unsafe fn popn<const N: usize>(&mut self) -> [U256; N] {
        if N == 0 {
            return [U256::ZERO; N];
        }
        let mut result = [U256::ZERO; N];
        for v in &mut result {
            *v = self.data.pop().unwrap_unchecked();
        }
        result
    }

    /// Pops `N` values from the stack and returns the top of the stack.
    ///
    /// # Safety
    ///
    /// The caller is responsible for checking the length of the stack.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub unsafe fn popn_top<const POPN: usize>(&mut self) -> ([U256; POPN], &mut U256) {
        let result = self.popn::<POPN>();
        let top = self.top_unsafe();
        (result, top)
    }

    /// Push a new value onto the stack.
    ///
    /// If it will exceed the stack limit, returns false and leaves the stack
    /// unchanged.
    #[inline]
    #[must_use]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn push(&mut self, value: U256) -> bool {
        // Allows the compiler to optimize out the `Vec::push` capacity check.
        assume!(self.data.capacity() == STACK_LIMIT);
        if self.data.len() == STACK_LIMIT {
            return false;
        }
        self.data.push(value);
        true
    }

    /// Peek a value at given index for the stack, where the top of
    /// the stack is at index `0`. If the index is too large,
    /// `StackError::Underflow` is returned.
    #[inline]
    pub fn peek(&self, no_from_top: usize) -> Result<U256, InstructionResult> {
        if self.data.len() > no_from_top {
            Ok(self.data[self.data.len() - no_from_top - 1])
        } else {
            Err(InstructionResult::StackUnderflow)
        }
    }

    /// Duplicates the `N`th value from the top of the stack.
    ///
    /// # Panics
    ///
    /// Panics if `n` is 0.
    #[inline]
    #[must_use]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn dup(&mut self, n: usize) -> bool {
        assume!(n > 0, "attempted to dup 0");
        let len = self.data.len();
        if len < n || len + 1 > STACK_LIMIT {
            false
        } else {
            // SAFETY: Check for out of bounds is done above and it makes this safe to do.
            unsafe {
                let ptr = self.data.as_mut_ptr().add(len);
                ptr::copy_nonoverlapping(ptr.sub(n), ptr, 1);
                self.data.set_len(len + 1);
            }
            true
        }
    }

    /// Swaps the topmost value with the `N`th value from the top.
    ///
    /// # Panics
    ///
    /// Panics if `n` is 0.
    #[inline(always)]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn swap(&mut self, n: usize) -> bool {
        self.exchange(0, n)
    }

    /// Exchange two values on the stack.
    ///
    /// `n` is the first index, and the second index is calculated as `n + m`.
    ///
    /// # Panics
    ///
    /// Panics if `m` is zero.
    #[inline]
    #[cfg_attr(debug_assertions, track_caller)]
    pub fn exchange(&mut self, n: usize, m: usize) -> bool {
        assume!(m > 0, "overlapping exchange");
        let len = self.data.len();
        let n_m_index = n + m;
        if n_m_index >= len {
            return false;
        }
        // SAFETY: `n` and `n_m` are checked to be within bounds, and they don't overlap.
        unsafe {
            // Note: `ptr::swap_nonoverlapping` is more efficient than `slice::swap` or `ptr::swap`
            // because it operates under the assumption that the pointers do not overlap,
            // eliminating an intermediate copy,
            // which is a condition we know to be true in this context.
            let top = self.data.as_mut_ptr().add(len - 1);
            core::ptr::swap_nonoverlapping(top.sub(n), top.sub(n_m_index), 1);
        }
        true
    }

    /// Pushes an arbitrary length slice of bytes onto the stack, padding the last word with zeros
    /// if necessary.
    #[inline]
    pub fn push_slice(&mut self, slice: &[u8]) -> Result<(), InstructionResult> {
        if slice.is_empty() {
            return Ok(());
        }

        let n_words = slice.len().div_ceil(32);
        let new_len = self.data.len() + n_words;
        if new_len > STACK_LIMIT {
            return Err(InstructionResult::StackOverflow);
        }

        // SAFETY: Length checked above.
        unsafe {
            let dst = self.data.as_mut_ptr().add(self.data.len()).cast::<u64>();
            self.data.set_len(new_len);

            let mut i = 0;

            // Write full words
            let words = slice.chunks_exact(32);
            let partial_last_word = words.remainder();
            for word in words {
                // Note: We unroll `U256::from_be_bytes` here to write directly into the buffer,
                // instead of creating a 32 byte array on the stack and then copying it over.
                for l in word.rchunks_exact(8) {
                    dst.add(i).write(u64::from_be_bytes(l.try_into().unwrap()));
                    i += 1;
                }
            }

            if partial_last_word.is_empty() {
                return Ok(());
            }

            // Write limbs of partial last word
            let limbs = partial_last_word.rchunks_exact(8);
            let partial_last_limb = limbs.remainder();
            for l in limbs {
                dst.add(i).write(u64::from_be_bytes(l.try_into().unwrap()));
                i += 1;
            }

            // Write partial last limb by padding with zeros
            if !partial_last_limb.is_empty() {
                let mut tmp = [0u8; 8];
                tmp[8 - partial_last_limb.len()..].copy_from_slice(partial_last_limb);
                dst.add(i).write(u64::from_be_bytes(tmp));
                i += 1;
            }

            debug_assert_eq!(i.div_ceil(4), n_words, "wrote too much");

            // Zero out upper bytes of last word
            let m = i % 4; // 32 / 8
            if m != 0 {
                dst.add(i).write_bytes(0, 4 - m);
            }
        }

        Ok(())
    }

    /// Set a value at given index for the stack, where the top of the
    /// stack is at index `0`. If the index is too large,
    /// `StackError::Underflow` is returned.
    #[inline]
    pub fn set(&mut self, no_from_top: usize, val: U256) -> Result<(), InstructionResult> {
        if self.data.len() > no_from_top {
            let len = self.data.len();
            self.data[len - no_from_top - 1] = val;
            Ok(())
        } else {
            Err(InstructionResult::StackUnderflow)
        }
    }
}

#[cfg(feature = "serde")]
impl<'de> serde::Deserialize<'de> for Stack {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let mut data = Vec::<U256>::deserialize(deserializer)?;
        if data.len() > STACK_LIMIT {
            return Err(serde::de::Error::custom(std::format!(
                "stack size exceeds limit: {} > {}",
                data.len(),
                STACK_LIMIT
            )));
        }
        data.reserve(STACK_LIMIT - data.len());
        Ok(Self { data })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn run(f: impl FnOnce(&mut Stack)) {
        let mut stack = Stack::new();
        // Fill capacity with non-zero values
        unsafe {
            stack.data.set_len(STACK_LIMIT);
            stack.data.fill(U256::MAX);
            stack.data.set_len(0);
        }
        f(&mut stack);
    }

    #[test]
    fn push_slices() {
        // No-op
        run(|stack| {
            stack.push_slice(b"").unwrap();
            assert_eq!(stack.data, []);
        });

        // One word
        run(|stack| {
            stack.push_slice(&[42]).unwrap();
            assert_eq!(stack.data, [U256::from(42)]);
        });

        let n = 0x1111_2222_3333_4444_5555_6666_7777_8888_u128;
        run(|stack| {
            stack.push_slice(&n.to_be_bytes()).unwrap();
            assert_eq!(stack.data, [U256::from(n)]);
        });

        // More than one word
        run(|stack| {
            let b = [U256::from(n).to_be_bytes::<32>(); 2].concat();
            stack.push_slice(&b).unwrap();
            assert_eq!(stack.data, [U256::from(n); 2]);
        });

        run(|stack| {
            let b = [&[0; 32][..], &[42u8]].concat();
            stack.push_slice(&b).unwrap();
            assert_eq!(stack.data, [U256::ZERO, U256::from(42)]);
        });

        run(|stack| {
            let b = [&[0; 32][..], &n.to_be_bytes()].concat();
            stack.push_slice(&b).unwrap();
            assert_eq!(stack.data, [U256::ZERO, U256::from(n)]);
        });

        run(|stack| {
            let b = [&[0; 64][..], &n.to_be_bytes()].concat();
            stack.push_slice(&b).unwrap();
            assert_eq!(stack.data, [U256::ZERO, U256::ZERO, U256::from(n)]);
        });
    }

    #[test]
    fn stack_clone() {
        // Test cloning an empty stack
        let empty_stack = Stack::new();
        let cloned_empty = empty_stack.clone();
        assert_eq!(empty_stack, cloned_empty);
        assert_eq!(cloned_empty.len(), 0);
        assert_eq!(cloned_empty.data().capacity(), STACK_LIMIT);

        // Test cloning a partially filled stack
        let mut partial_stack = Stack::new();
        for i in 0..10 {
            assert!(partial_stack.push(U256::from(i)));
        }
        let mut cloned_partial = partial_stack.clone();
        assert_eq!(partial_stack, cloned_partial);
        assert_eq!(cloned_partial.len(), 10);
        assert_eq!(cloned_partial.data().capacity(), STACK_LIMIT);

        // Test that modifying the clone doesn't affect the original
        assert!(cloned_partial.push(U256::from(100)));
        assert_ne!(partial_stack, cloned_partial);
        assert_eq!(partial_stack.len(), 10);
        assert_eq!(cloned_partial.len(), 11);

        // Test cloning a full stack
        let mut full_stack = Stack::new();
        for i in 0..STACK_LIMIT {
            assert!(full_stack.push(U256::from(i)));
        }
        let mut cloned_full = full_stack.clone();
        assert_eq!(full_stack, cloned_full);
        assert_eq!(cloned_full.len(), STACK_LIMIT);
        assert_eq!(cloned_full.data().capacity(), STACK_LIMIT);

        // Test push to the full original or cloned stack should return StackOverflow
        assert!(!full_stack.push(U256::from(100)));
        assert!(!cloned_full.push(U256::from(100)));
    }
}
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

/// Provides memory for EVM stack.
class StackSpace
{
    static uint256* allocate() noexcept
    {
        static constexpr auto alignment = sizeof(uint256);
        static constexpr auto size = limit * sizeof(uint256);
#ifdef _MSC_VER
        // MSVC doesn't support aligned_alloc() but _aligned_malloc() can be used instead.
        const auto p = _aligned_malloc(size, alignment);
#else
        const auto p = std::aligned_alloc(alignment, size);
#endif
        return static_cast<uint256*>(p);
    }

    struct Deleter
    {
        // TODO(C++23): static
        void operator()(void* p) noexcept
        {
#ifdef _MSC_VER
            // For MSVC the _aligned_malloc() must be paired with _aligned_free().
            _aligned_free(p);
#else
            std::free(p);
#endif
        }
    };

    /// The storage allocated for maximum possible number of items.
    /// Items are aligned to 256 bits for better packing in cache lines.
    std::unique_ptr<uint256, Deleter> m_stack_space;

public:
    /// The maximum number of EVM stack items.
    static constexpr auto limit = 1024;

    StackSpace() noexcept : m_stack_space{allocate()} {}

    /// Returns the pointer to the "bottom", i.e. below the stack space.
    [[nodiscard]] uint256* bottom() noexcept { return m_stack_space.get(); }
};
```

```cpp
/// Represents the pointer to the stack top item
/// and allows retrieving stack items and manipulating the pointer.
class StackTop
{
    uint256* m_end;  ///< Pointer to the stack end (1 slot above the stack top item).

public:
    explicit(false) StackTop(uint256* end) noexcept
      : m_end{std::assume_aligned<sizeof(uint256)>(end)}
    {}

    /// Returns the pointer to the stack end (the stack slot above the top item).
    [[nodiscard]] uint256* end() noexcept { return m_end; }

    /// Returns the reference to the stack item by index, where 0 means the top item
    /// and positive index values the items further down the stack.
    /// Using [-1] is also valid, but .push() should be used instead.
    [[nodiscard]] uint256& operator[](int index) noexcept { return m_end[-1 - index]; }

    /// Returns the reference to the stack top item.
    [[nodiscard]] uint256& top() noexcept { return m_end[-1]; }

    /// Returns the current top item and move the stack top pointer down.
    /// The value is returned by reference because the stack slot remains valid.
    [[nodiscard]] uint256& pop() noexcept { return *--m_end; }

    /// Assigns the value to the stack top and moves the stack top pointer up.
    void push(const uint256& value) noexcept { *m_end++ = value; }
};


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

## Prototype

The below prototype is a good starting point though the requirements request an even better more feature complete performant implementation. This is still a good starting point.

```zig
const std = @import("std");

// Size of u256 in bytes (32 bytes = 256 bits)
pub const u256_byte_size = 32;

pub const StackError = error{
    OutOfBounds,
    OutOfMemory,
    StackOverflow,
};

// Performance comparison with revm and evmone:
//
// Memory Layout:
// - Tevm: Static array [1024]u256 with explicit alignment
// - revm: Vec<U256> dynamic allocation (https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/stack.rs#L15)
// - evmone: std::vector<uint256> dynamic allocation (https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp#L179)
//
// Performance implications:
// - Static array avoids heap allocation overhead
// - revm/evmone's dynamic allocation allows flexibility but adds indirection
// - Consider: evmone uses custom uint256 type optimized for EVM operations
//
// Optimization opportunities from revm/evmone:
// 1. evmone uses aggressive inlining and noexcept annotations
// 2. revm provides both safe and unsafe variants for all operations
// 3. Both use custom bigint implementations optimized for 256-bit operations
pub const Stack = struct {
    data: [1024]u256 align(@alignOf(u256)) = [_]u256{0} ** 1024, // Initialize all elements to 0
    size: usize = 0,
    pub const capacity: usize = 1024;

    // Push operation comparison:
    // - revm: Uses capacity check with Vec::push (https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/stack.rs#L92)
    // - evmone: Direct index assignment with bounds check (https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_stack.hpp#L16)
    // Tevm matches evmone's approach with static bounds, avoiding Vec overhead
    pub inline fn push(self: *Stack, value: u256) StackError!void {
        if (self.size >= capacity) {
            return StackError.StackOverflow;
        }
        self.data[self.size] = value;
        self.size += 1;
    }

    // Unsafe variant matches revm's dual API pattern
    // revm ref: https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/stack.rs#L101
    pub inline fn push_unsafe(self: *Stack, value: u256) void {
        std.debug.assert(self.size < capacity);
        self.data[self.size] = value;
        self.size += 1;
    }

    // Pop operation comparison:
    // - revm: Vec::pop with Option return (https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/stack.rs#L115)
    // - evmone: Direct array access with decrement (https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_stack.hpp#L24)
    // Tevm follows evmone's approach, avoiding Option wrapper overhead
    pub inline fn pop(self: *Stack) StackError!u256 {
        if (self.size == 0) return StackError.OutOfBounds;
        self.size -= 1;
        const value = self.data[self.size];
        // Clear the popped value for security (optional but safer)
        self.data[self.size] = 0;
        return value;
    }

    // evmone optimization: No bounds checking in release builds
    // evmone ref: https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_stack.hpp#L32
    pub inline fn pop_unsafe(self: *Stack) u256 {
        std.debug.assert(self.size > 0);
        self.size -= 1;
        const value = self.data[self.size];
        // Clear the popped value for security (optional but safer)
        self.data[self.size] = 0;
        return value;
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

    // Swap operations comparison:
    // - revm: Generic swap_top function with index parameter (https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/stack.rs#L174)
    // - evmone: Template-based swap with compile-time index (https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_stack.hpp#L39)
    //
    // Performance note: evmone's template approach eliminates index calculation at runtime
    // Tevm could benefit from comptime swap generation like evmone
    pub inline fn swap1(self: *Stack) StackError!void {
        if (self.size < 2) return StackError.OutOfBounds;
        std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 2]);
    }

    // Manual swap implementation avoids std.mem.swap overhead
    // Similar to evmone's direct assignment approach
    // evmone ref: https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_stack.hpp#L41-L44
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

    // Multi-pop optimization comparison:
    // - revm: Individual pop calls (https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/arithmetic.rs)
    // - evmone: Bulk pointer operations for multi-argument opcodes
    //
    // Tevm's comptime N parameter enables unrolled loops like evmone
    // This avoids loop overhead for known sizes (common in EVM opcodes)
    pub inline fn popn(self: *Stack, comptime N: usize) ![N]u256 {
        if (self.size < N) return StackError.OutOfBounds;

        self.size -= N;

        var result: [N]u256 = [_]u256{0} ** N; // Initialize to zeros for safety

        // Unrolled at compile time - matches evmone's template approach
        // evmone ref: https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp
        inline for (0..N) |i| {
            result[i] = self.data[self.size + i];
            // Clear the stack items that have been popped (optional but safer)
            self.data[self.size + i] = 0;
        }

        return result;
    }

    // Optimization from evmone: Combined pop + peek for opcodes that pop N and push 1
    // Common pattern in arithmetic operations (ADD, MUL, etc.)
    // evmone ref: https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_arithmetic.cpp
    pub inline fn popn_top(self: *Stack, comptime N: usize) !struct { values: [N]u256, top: *u256 } {
        // First pop the top value (discarded)
        if (self.size <= N) return StackError.OutOfBounds;

        _ = try self.pop();

        // Then pop N values
        const result = try self.popn(N);

        // Return the N values and a reference to the new top
        return .{ .values = result, .top = self.peek_unsafe() };
    }

    /// Push a byte slice onto the stack
    /// This converts the byte slice into words and pushes them onto the stack
    pub fn push_slice(self: *Stack, slice: []const u8) !void {
        if (slice.len == 0) {
            return; // Nothing to push
        }

        // For small slices (up to 32 bytes), push as a single value
        if (slice.len <= u256_byte_size) {
            var value: u256 = 0;
            for (slice) |byte| {
                value = (value << 8) | byte;
            }
            try self.push(value);
            return;
        }

        // For larger slices, split into 32-byte words
        var i: usize = 0;
        while (i + u256_byte_size <= slice.len) : (i += u256_byte_size) {
            var value: u256 = 0;
            for (slice[i..i+u256_byte_size]) |byte| {
                value = (value << 8) | byte;
            }
            try self.push(value);
        }

        // Handle any remaining bytes
        if (i < slice.len) {
            var value: u256 = 0;
            for (slice[i..]) |byte| {
                value = (value << 8) | byte;
            }
            try self.push(value);
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

    // Test bytes for push_slice
    const bytes = [_]u8{ 0x12, 0x34, 0x56, 0x78 };

    // Test push_slice functionality
    try stack.push_slice(&bytes);

    // Verify we have one item on the stack
    try testing.expectEqual(@as(usize, 1), stack.len());

    // Pop the value and verify it's not zero (some value was pushed)
    const value = try stack.pop();
    try testing.expect(value != 0);

    // Now manually push the same value in a regular way
    try stack.push(0x12345678);
    try testing.expectEqual(@as(usize, 1), stack.len());

    // Verify we can pop it off
    const popped = try stack.pop();
    try testing.expectEqual(@as(u256, 0x12345678), popped);
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
```

And here are tests from the prototype

```zig
const std = @import("std");
const testing = std.testing;
const evm = @import("evm");
const Stack = evm.Stack;
const StackError = evm.StackError;

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

    // Test dup2 (duplicate second item from top)
    try stack.dup(2);
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);  // Second from top is 3
    try testing.expectEqual(@as(usize, 5), stack.len());

    // Test dup3 (duplicate third item from top)
    // Current stack: [1, 2, 3, 3, 3] with size=5
    // dup(3) duplicates item at index 5-3=2, which has value 3
    try stack.dup(3);
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);  // Item at index 2 is 3
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
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);  // Second from top is 3
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
    // Current stack: [1, 3, 2] with size=3
    // dup(2) duplicates item at index 3-2=1, which has value 3
    try stack.dup(2);
    try testing.expectEqual(@as(usize, 4), stack.len());
    try testing.expectEqual(@as(u64, 3), (try stack.peek()).*);
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
    // Current stack: [1, 2, 3, 5, 4, 3] with size=6
    // popn(3) will pop from indices 3,4,5 which are values [5, 4, 3]
    const popped = try stack.popn(3);
    try testing.expectEqual(@as(u64, 5), popped[0]);
    try testing.expectEqual(@as(u64, 4), popped[1]);
    try testing.expectEqual(@as(u64, 3), popped[2]);

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

```

## Previous notes

The below section has previous info that might be useful

#### 1. Memory Allocation Strategy

**Tevm**:

- Zero heap allocation
- Predictable memory usage
- Fast stack allocation
- No GC pressure

**go-ethereum**:

- Dynamic slice with capacity
- GC-managed memory
- Reallocation on growth
- Higher memory overhead

**revm**:

- Vec with capacity optimization
- RAII memory management
- Efficient move semantics
- Growth amortization

**evmone**:

- Pre-reserved vector
- Manual memory management
- Minimal allocations
- Cache-friendly layout

#### 2. Performance Characteristics

**Tevm Static Array**:

- ✅ No allocation overhead
- ✅ Cache-friendly sequential access
- ✅ Predictable performance
- ❌ Higher stack memory usage
- ❌ Always uses full 32KB

**Dynamic Implementations**:

- ✅ Lower initial memory
- ✅ Grows as needed
- ❌ Allocation overhead
- ❌ Potential fragmentation
- ❌ GC pressure (go-ethereum)

#### 3. Safety and Error Handling

**Tevm**:

- Explicit error types
- Dual safe/unsafe APIs
- Compile-time bounds where possible
- Debug assertions in unsafe paths

**go-ethereum**:

- Runtime bounds checking
- Panic on overflow
- Less granular errors

**revm**:

- Result<T, E> types
- Comprehensive error handling
- Safe by default

**evmone**:

- Minimal error checking
- Performance over safety
- Assumes valid usage

### Operation Implementation Comparison

#### SWAP Operations

**Tevm**:

```zig
pub fn swap2(self: *Stack) StackError!void {
    if (self.size < 3) return StackError.OutOfBounds;
    std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - 3]);
}
```

**revm**:

```rust
pub fn swap(&mut self, n: usize) -> Result<(), Error> {
    let len = self.data.len();
    if len <= n { return Err(Error::StackUnderflow); }
    self.data.swap(len - 1, len - n - 1);
    Ok(())
}
```

## EVM Compatibility

The stack implementation fully supports all EVM stack operations:

1. **Basic Operations**: PUSH, POP
2. **Duplication**: DUP1-DUP16
3. **Swapping**: SWAP1-SWAP16
4. **Stack Depth**: Maximum 1024 items
5. **Word Size**: 256-bit values

### Byte Slice Handling

Special support for pushing byte data:

```zig
pub fn push_slice(self: *Stack, bytes: []const u8) StackError!void {
    const len = bytes.len;
    const offset = 32 - len;
    var value: u256 = 0;
    for (bytes, 0..) |byte, i| {
        value |= @as(u256, byte) << @intCast((offset + i) * 8);
    }
    try self.push(value);
}
```

## Testing Coverage

Comprehensive test suite includes:

- Basic operations (push, pop, peek)
- All SWAP operations (1-16)
- DUP operations
- Multi-value operations
- Boundary conditions
- Error cases
- Edge cases with empty/full stack

## Best Practices

1. **Use Safe APIs by Default**:

   ```zig
   try stack.push(value); // Preferred
   ```

2. **Use Unsafe APIs in Hot Paths**:

   ```zig
   // After verifying space available
   if (stack.size + n <= Stack.capacity) {
       stack.push_unsafe(value); // Faster
   }
   ```

3. **Batch Operations**:

   ```zig
   const values = try stack.popn(3); // More efficient than 3 pops
   ```

4. **Check Depth Before Operations**:
   ```zig
   if (stack.size() < required_depth) {
       return error.StackUnderflow;
   }
   ```

## Performance Analysis

### Advantages of Static Array

1. **No Allocation Overhead**: Zero malloc/free calls
2. **Cache Locality**: Entire stack likely in L2 cache
3. **Predictable Performance**: No GC pauses or reallocation
4. **SIMD Potential**: Fixed layout enables vectorization

### Trade-offs

1. **Memory Usage**: Always uses 32KB regardless of actual usage
2. **Stack Allocation**: Large stack frame requirement
3. **Initialization Cost**: Must zero 32KB on creation

### Benchmarking Results

Based on implementation analysis:

- Push/Pop: O(1) with minimal overhead
- Swap: O(1) with two memory accesses
- Dup: O(1) with one read, one write
- No allocation overhead in any operation

## Future Enhancements

1. **SIMD Operations**: Use vector instructions for bulk operations
2. **Memory Pooling**: Reuse stack instances across executions
3. **Compressed Representation**: Pack small values more efficiently
4. **Profiling Integration**: Add performance counters
5. **Alternative Backends**: Switchable heap-based implementation

## Conclusion

The Tevm Stack implementation provides a high-performance, EVM-compatible stack with zero allocation overhead. The static array approach trades memory efficiency for predictable performance and simplicity. The dual API pattern allows both safe and performant usage patterns, making it suitable for both development and production use cases.
