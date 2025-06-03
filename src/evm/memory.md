# Memory Design Document

## Overview

This document outlines the design for refactoring Tevm's `Memory.zig` to a `Memory.zig` implementation inspired by revm's Memory model. The new design enables efficient handling of nested EVM call contexts through a checkpointing system while maintaining Zig's safety and performance characteristics.

## Motivation

The current `Memory.zig` implementation provides a flat, resizable byte array suitable for single-context EVM execution. However, it lacks support for:
- Efficient nested call contexts (CALL, DELEGATECALL, STATICCALL, CREATE)
- Memory isolation between parent and child contexts
- Reverting child context changes on failure
- Committing child context changes on success

The Memory design addresses these limitations by introducing a single shared buffer with context-based checkpointing.

## Core Architecture

### Single Shared Buffer
- A single `std.ArrayList(u8)` serves as the underlying memory for all contexts
- The root context owns the buffer and allocator
- Child contexts hold pointers to access the shared state

### Checkpointing System
- Each `Memory` instance represents a call context with:
  - `my_checkpoint`: Starting offset within the shared buffer
  - `child_active_checkpoint`: Parent's record of buffer length before child creation
- Operations are relative to `my_checkpoint`
- Buffer can be reverted to `child_active_checkpoint` on child failure

### Memory Layout Example
```
Shared Buffer: [----ROOT----][---CHILD1---][--GRANDCHILD--]
               ^             ^             ^
               |             |             |
               0             1024          2048
               (root         (child1       (grandchild
                checkpoint)   checkpoint)   checkpoint)
```

## API Design

### Structure Definition
```zig
pub const Memory = struct {
    /// Single shared buffer (owned by root)
    shared_buffer: std.ArrayList(u8),

    /// Allocator (owned by root)
    allocator: std.mem.Allocator,

    /// This context's start offset
    my_checkpoint: usize,

    /// Length of shared_buffer before child creation
    child_active_checkpoint: ?usize,

    /// Global memory limit
    memory_limit: u64,

    /// Pointer to root instance
    root_ptr: *Memory,
};
```

### Key Operations

#### Initialization
- `init()`: Creates root Memory with owned buffer
- `deinit()`: Only root can free the shared buffer

#### Context Management
- `newChildContext()`: Creates child with new checkpoint
- `revertChildContext()`: Truncates buffer to parent's checkpoint
- `commitChildContext()`: Accepts child's changes

#### Memory Access (Context-Relative)
- `getByte(offset)`: Read byte at context offset
- `setByte(offset, value)`: Write byte at context offset
- `getWord(offset)`: Read 32 bytes at context offset
- `setWord(offset, value)`: Write 32 bytes at context offset
- `copy(dest, src, len)`: Copy within context

#### Memory Management
- `resizeContext(size)`: Resize current context's visible memory
- `ensureContextCapacity(size)`: Ensure capacity, return new words for gas
- `contextSize()`: Get current context's memory size

## Implementation Details

### Offset Calculations
All operations must translate context-relative offsets to absolute positions:
```zig
absolute_offset = self.my_checkpoint + relative_offset
```

### Growth Strategy
- Initial capacity: 4KB (OS page size)
- 2x growth when expanding
- Zero-initialization of new memory
- Respect global memory limit

### Gas Calculation
`ensureContextCapacity()` returns the number of new 32-byte words added to the total shared buffer, not just the context's view. This accurately reflects EVM memory expansion costs.

### Error Handling
```zig
pub const MemoryError = error{
    OutOfMemory,
    InvalidOffset,
    InvalidSize,
    MemoryLimitExceeded,
    ChildContextActive,
    NoChildContextToRevertOrCommit,
};
```

## Usage Example

```zig
// Root context for transaction
var root = try Memory.init(allocator, 4096, max_memory);
defer root.deinit();

// Perform root operations
try root.setByte(0, 0xFF);

// Create child context for CALL
var child = try root.newChildContext();

// Child operations
try child.setWord(0, word_data);

// On success: commit changes
try root.commitChildContext();

// On failure: revert changes
try root.revertChildContext();
```

## Performance Considerations

### Optimizations
- Inline hot-path functions (getters/setters)
- `@setCold(true)` for resize operations
- `@setRuntimeSafety(false)` for unsafe variants
- Efficient overlapping copy handling

### Memory Pooling
For frequent context creation/destruction:
- Consider pooling Memory instances
- Reuse large buffers across transactions
- Reset checkpoints instead of reallocating

## Testing Strategy

### Unit Tests
1. Basic operations (read/write/resize)
2. Context creation and management
3. Revert/commit behavior
4. Nested contexts (3+ levels)
5. Memory limit enforcement
6. Edge cases (empty contexts, boundary access)

### Integration Tests
1. Full EVM operation sequences
2. Gas calculation accuracy
3. State persistence across calls
4. Error propagation

### Benchmarks
1. Context switching overhead
2. Memory operation performance
3. Deep nesting impact
4. Comparison with flat Memory.zig

## Migration Path

1. Implement Memory alongside existing Memory
2. Update EVM to use Memory for root context
3. Modify call operations to create child contexts
4. Update gas calculation to use ensureContextCapacity
5. Remove old Memory implementation

## Open Questions

1. **Child Access Pattern**: Should children access shared_buffer through root_ptr or direct pointers?
2. **Memory Pooling**: Should we implement buffer pooling in initial version?
3. **Thread Safety**: Current design assumes single-threaded access. Future consideration?
4. **Snapshot/Restore**: Should we support full context snapshots beyond checkpointing?

## Benchmark Results

### Baseline Performance (Current Memory.zig)
Benchmarks run on: 2025-01-06
Configuration: ReleaseFast, native target

| Operation | Avg Time | Min | Max | P75 | P99 |
|-----------|----------|-----|-----|-----|-----|
| Memory Init (4KB) | 394ns ± 67ns | 333ns | 9.125μs | 417ns | 500ns |
| Memory Init (1MB) | 396ns ± 64ns | 333ns | 11.25μs | 417ns | 500ns |
| Memory Init With Limit | 396ns ± 286ns | 333ns | 60.958μs | 417ns | 500ns |
| Memory Limit Enforcement | 4.726μs ± 1.17μs | 3.541μs | 54.125μs | 4.75μs | 9.459μs |
| Byte Operations | 2.705μs ± 955ns | 1.542μs | 20.459μs | 2.625μs | 6.667μs |
| Word Operations | 2.704μs ± 1.047μs | 1.416μs | 42.25μs | 2.583μs | 7.041μs |
| U256 Operations | 2.644μs ± 997ns | 1.791μs | 32.917μs | 2.541μs | 6.708μs |
| Memory Expansion | 4.734μs ± 1.224μs | 3.541μs | 28.5μs | 4.667μs | 9.958μs |
| Large Data Copy | 5.036μs ± 1.361μs | 3.417μs | 47.833μs | 5.042μs | 10.125μs |
| Memory Copy (MCOPY) | 2.827μs ± 1.262μs | 1.541μs | 47.167μs | 2.625μs | 7.5μs |
| Bounded Copy | 2.82μs ± 1.204μs | 1.542μs | 44.375μs | 2.625μs | 7.292μs |
| Slice Reading | 2.691μs ± 1.163μs | 1.584μs | 40.584μs | 2.583μs | 6.959μs |
| Resize Operations | 2.725μs ± 1.061μs | 1.5μs | 31.542μs | 2.583μs | 7.083μs |
| Word-Aligned Resize | 2.576μs ± 860ns | 1.5μs | 22.625μs | 2.5μs | 6.041μs |

### Memory Performance
Benchmarks run on: 2025-01-06
Configuration: ReleaseFast, native target

| Operation | Avg Time | Min | Max | P75 | P99 |
|-----------|----------|-----|-----|-----|-----|
| Memory Init (4KB) | 405ns ± 64ns | 333ns | 9.708μs | 417ns | 500ns |
| Memory Init (1MB) | 392ns ± 88ns | 333ns | 12.125μs | 417ns | 500ns |
| Memory Init With Limit | 394ns ± 100ns | 333ns | 21.042μs | 417ns | 500ns |
| Child Context Revert | 405ns ± 41ns | 333ns | 4.459μs | 417ns | 542ns |
| Child Context Commit | 397ns ± 27ns | 291ns | 1.792μs | 417ns | 500ns |
| Nested Contexts | 2.551μs ± 666ns | 1.583μs | 20.334μs | 2.625μs | 5.625μs |
| Context Byte Operations | 2.956μs ± 810ns | 1.917μs | 44.625μs | 3.041μs | 6.334μs |
| Context Word Operations | 2.699μs ± 973ns | 1.542μs | 22.333μs | 2.625μs | 6.625μs |
| Context U256 Operations | 2.706μs ± 1.014μs | 1.458μs | 27.792μs | 2.625μs | 7.125μs |
| Context Memory Expansion | 4.88μs ± 1.318μs | 3.334μs | 30.75μs | 4.875μs | 9.916μs |
| Context Large Data Copy | 5.086μs ± 1.389μs | 3.542μs | 54.666μs | 5.084μs | 10.209μs |
| Context Memory Copy (MCOPY) | 2.601μs ± 777ns | 1.458μs | 33.25μs | 2.625μs | 5.917μs |
| Context Bounded Copy | 2.647μs ± 959ns | 1.5μs | 33.25μs | 2.542μs | 6.417μs |
| Context Slice Reading | 2.817μs ± 1.076μs | 1.584μs | 49.5μs | 2.75μs | 7.042μs |
| Deep Context Operations | 2.632μs ± 888ns | 1.541μs | 30.542μs | 2.583μs | 6.333μs |
| Context Limit Enforcement | 4.922μs ± 1.334μs | 3.542μs | 41.875μs | 4.958μs | 9.792μs |

### Performance Comparison

| Operation | Memory.zig | Memory.zig | Difference |
|-----------|------------|------------------|------------|
| Init (4KB) | 394ns | 405ns | +2.8% |
| Init (1MB) | 396ns | 392ns | -1.0% |
| Init With Limit | 396ns | 394ns | -0.5% |
| Byte Operations | 2.705μs | 2.956μs | +9.3% |
| Word Operations | 2.704μs | 2.699μs | -0.2% |
| U256 Operations | 2.644μs | 2.706μs | +2.3% |
| Memory Expansion | 4.734μs | 4.88μs | +3.1% |
| Large Data Copy | 5.036μs | 5.086μs | +1.0% |
| Memory Copy (MCOPY) | 2.827μs | 2.601μs | -8.0% |
| Bounded Copy | 2.82μs | 2.647μs | -6.1% |
| Slice Reading | 2.691μs | 2.817μs | +4.7% |
| Limit Enforcement | 4.726μs | 4.922μs | +4.1% |

### Key Findings

1. **Minimal Overhead**: Memory introduces minimal overhead (mostly < 5%) for basic operations despite the added context management complexity.

2. **Improved Copy Performance**: Memory copy operations (MCOPY and bounded copy) are actually faster in Memory, likely due to better cache locality with the shared buffer approach.

3. **Efficient Context Management**: Child context creation and revert/commit operations are extremely fast (~400ns), making nested calls very efficient.

4. **Deep Context Performance**: Operations in deeply nested contexts (5 levels) remain efficient at ~2.6μs, showing good scalability.

5. **Memory Expansion**: The slight increase in expansion time (+3.1%) is acceptable given the added gas calculation and context management features.

### Conclusion

The Memory implementation successfully achieves its design goals:
- Efficient context management for nested EVM calls
- Minimal performance overhead compared to flat memory
- Fast context switching (< 500ns)
- Scalable to deep call stacks
- Maintains or improves performance for critical operations like memory copying

The implementation is ready for integration into the EVM execution engine.

## References

- [revm Memory](https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/memory.rs)
- [EVM Memory Specification](https://www.evm.codes/about#memoryexpansion)
- [Zig Standard Library - ArrayList](https://ziglang.org/documentation/master/std/#std.ArrayList)