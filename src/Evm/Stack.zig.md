# Stack.zig - EVM Stack Implementation

This document describes the Tevm EVM stack implementation in `Stack.zig` and compares it with other major EVM implementations.

## Overview

The Stack is a fundamental component of the EVM's stack-based architecture. All EVM operations work by pushing and popping values from this stack. The implementation provides a fixed-size stack of 1024 256-bit unsigned integers, matching the EVM specification.

## Implementation Details

### Core Structure

```zig
pub const Stack = struct {
    data: [1024]u256 align(@alignOf(u256)) = [_]u256{0} ** 1024,
    size: usize = 0,
    pub const capacity: usize = 1024,
}
```

### Key Design Decisions

1. **Static Array**: Fixed-size array avoids dynamic allocation overhead
2. **Explicit Alignment**: Ensures optimal memory access patterns
3. **Zero Initialization**: All slots initialized to 0 for security
4. **Size Tracking**: Explicit size field for O(1) stack depth queries

### Error Types

```zig
pub const StackError = error{
    OutOfBounds,      // Invalid stack position access
    OutOfMemory,      // Memory allocation failure
    StackOverflow,    // Exceeding 1024 item limit
};
```

### Core Operations

#### Push Operations
- `push(value)` - Push with bounds checking
- `push_unsafe(value)` - Push without checks (assumes space available)
- `push_slice(bytes)` - Push byte slice as u256 (handles endianness)

#### Pop Operations
- `pop()` - Pop with underflow checking
- `pop_unsafe()` - Pop without checks (assumes non-empty)
- `popn(comptime n)` - Pop multiple values (compile-time optimized)

#### Peek Operations
- `peek()` - View top without removing
- `peek_unsafe()` - Peek without bounds check
- `peek_n(n)` - Peek at nth element from top
- `back(n)` - Access element at depth n

#### Stack Manipulation
- `dup(n)` - Duplicate value at depth n to top
- `swap1()` through `swap16()` - Swap top with nth element
- Individual optimized swap functions for each position

### Performance Optimizations

#### 1. Dual API Pattern
Every critical operation has safe and unsafe variants:
```zig
// Safe version with checks
pub fn push(self: *Stack, value: u256) StackError!void {
    if (self.size >= capacity) return StackError.StackOverflow;
    self.data[self.size] = value;
    self.size += 1;
}

// Unsafe version for hot paths
pub inline fn push_unsafe(self: *Stack, value: u256) void {
    std.debug.assert(self.size < capacity);
    self.data[self.size] = value;
    self.size += 1;
}
```

#### 2. Compile-Time Optimization
The `popn` function uses compile-time known sizes:
```zig
pub inline fn popn(self: *Stack, comptime n: usize) StackError![n]u256 {
    if (self.size < n) return StackError.OutOfBounds;
    var result: [n]u256 = undefined;
    inline for (0..n) |i| {
        result[n - 1 - i] = self.data[self.size - 1 - i];
    }
    self.size -= n;
    return result;
}
```

#### 3. Direct Memory Operations
Optimized swap implementation avoiding function calls:
```zig
pub inline fn swap1_fast(self: *Stack) void {
    const top_index = self.size - 1;
    const temp = self.data[top_index];
    self.data[top_index] = self.data[top_index - 1];
    self.data[top_index - 1] = temp;
}
```

## Comparison with Other Implementations

### Memory Model Comparison

| Implementation | Storage Type | Allocation | Maximum Size | Growth Strategy |
|----------------|--------------|------------|--------------|-----------------|
| Tevm (Zig) | Static array | Stack-allocated | Fixed 1024 | No growth |
| go-ethereum | Dynamic slice | Heap-allocated | 1024 limit | Append-based |
| revm (Rust) | Vec<U256> | Heap-allocated | 1024 limit | Dynamic growth |
| evmone | std::vector | Heap-allocated | 1024 limit | Reserve capacity |

### Key Differences

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