# Memory.zig - EVM Memory Implementation

This document describes the Tevm EVM memory implementation in `Memory.zig` and compares it with other major EVM implementations.

## Overview

The `Memory` struct in Tevm implements the EVM's byte-addressable linear memory space that:
- Starts empty and expands as needed
- Is reset for each message call
- Stores temporary data during contract execution
- Has gas costs that increase quadratically with size

## Implementation Details

### Core Structure

```zig
pub const Memory = struct {
    store: std.ArrayList(u8),      // Dynamic byte array backing store
    last_gas_cost: u64,            // Cached gas cost for metering
    allocator: std.mem.Allocator,  // Memory allocator for operations
}
```

### Key Features

1. **Dynamic Growth**: Uses Zig's `ArrayList` for automatic resizing
2. **Explicit Memory Management**: Allocator pattern for resource control
3. **Safety First**: Comprehensive error handling with overflow protection
4. **Debug Support**: Extensive debug logging in debug builds
5. **Performance Options**: Both safe and optimized code paths

### Core Operations

#### Memory Access
- `get8(offset)` - Read a single byte (test helper)
- `store8(offset, value)` - Write a single byte (test helper)
- `getPtr(offset, size)` - Get a read-only slice (no copy)
- `getCopy(offset, size)` - Get a copied slice (caller must free)

#### Memory Modification
- `set(offset, size, value)` - Copy bytes to memory
- `set32(offset, val)` - Store 256-bit value (big-endian)
- `copy(dst, src, length)` - MCOPY operation with overlap support

#### Memory Management
- `resize(size)` - Expand/shrink memory to exact size
- `require(offset, size)` - Ensure memory region is accessible
- `len()` / `memSize()` - Get current memory size
- `data()` - Access raw memory buffer

### Safety Features

1. **Overflow Protection**: All arithmetic uses safe operations
   ```zig
   const end_offset = std.math.add(u64, offset, size) catch {
       return error.InvalidArgument;
   };
   ```

2. **Bounds Checking**: Validates all memory accesses
3. **Zero Initialization**: New memory is always zeroed
4. **Error Propagation**: Explicit error handling throughout

### Performance Considerations

The implementation includes several optimizations while maintaining safety:

1. **Direct Memory Access**: `getPtr()` provides zero-copy access for reads
2. **Efficient Copying**: Uses `@memcpy` for bulk operations
3. **Smart Resizing**: Only resizes when necessary
4. **Overlap Handling**: `copy()` uses `copyForwards`/`copyBackwards` for correct MCOPY semantics

## Comparison with Other Implementations

### Memory Management Strategy

| Implementation | Backing Store | Growth Strategy | Memory Safety |
|----------------|---------------|-----------------|---------------|
| Tevm (Zig) | `ArrayList(u8)` | Dynamic with explicit resize | Explicit error handling |
| go-ethereum | `[]byte` slice | Append-based growth | Runtime panics |
| revm (Rust) | `Vec<u8>` | Capacity management | Result types |
| evmone (C++) | `std::vector<uint8_t>` | Chunk allocation (4KB) | Exceptions |

### Key Differences

1. **Error Handling**
   - Tevm: Explicit error unions (`!void`, `error{OutOfBounds}`)
   - go-ethereum: Panic on errors
   - revm: Result<T, Error> types
   - evmone: C++ exceptions

2. **Memory Initialization**
   - Tevm: Explicit `@memset` in `initializeMemory()`
   - Others: Rely on language/stdlib zeroing

3. **Gas Cost Tracking**
   - Tevm: Separate from memory operations (cleaner separation)
   - go-ethereum: Integrated with memory expansion
   - revm: Tracked via effective_len
   - evmone: Inline with operations

4. **Debug Support**
   - Tevm: Extensive debug logging with `@import("builtin").mode`
   - Others: Minimal or no built-in debug output

### Performance Optimizations in Other Implementations

**evmone's Chunk Allocation**:
```cpp
static constexpr size_t page_size = 4 * 1024;  // 4KB chunks
```
Reduces allocation overhead by growing in larger chunks.

**revm's SharedMemory**:
```rust
Rc<RefCell<Vec<u8>>>  // Reference counting for call contexts
```
Enables efficient memory sharing between contexts without copying.

**go-ethereum's Caching**:
Caches previous gas costs to avoid recalculation on repeated accesses.

## Memory Operations Deep Dive

### set32 - Storing 256-bit Values

The `set32` operation stores a 256-bit integer in big-endian format:

```zig
pub fn set32(self: *Memory, offset: u64, val: BigInt) !void {
    // 1. Check for overflow
    const end_offset = std.math.add(u64, offset, 32) catch 
        return error.InvalidOffset;
    
    // 2. Ensure memory is sized
    if (end_offset > self.store.items.len) {
        try self.resize(end_offset);
    }
    
    // 3. Convert to big-endian bytes
    var buffer: [32]u8 = [_]u8{0} ** 32;
    var v = val;
    var i: usize = 31;
    while (true) {
        buffer[i] = @truncate(v & 0xFF);
        v >>= 8;
        if (i == 0) break;
        if (v == 0) break;
        i -= 1;
    }
    
    // 4. Copy to memory
    @memcpy(self.store.items[offset..end_offset], &buffer);
}
```

### copy - MCOPY Implementation

The `copy` operation implements EVM's MCOPY with proper overlap handling:

```zig
pub fn copy(self: *Memory, dst: u64, src: u64, length: u64) !void {
    // ... bounds checking ...
    
    // Handle overlapping regions
    if (dst <= src) {
        // Non-overlapping or dst before src
        std.mem.copyForwards(u8, dest_slice, source_slice);
    } else {
        // src before dst (overlapping)
        std.mem.copyBackwards(u8, dest_slice, source_slice);
    }
}
```

## Gas Cost Considerations

While the Memory implementation doesn't calculate gas directly, it's designed to support gas metering:

1. **Memory Size Tracking**: `memSize()` provides current size for gas calculations
2. **last_gas_cost Field**: Reserved for caching gas calculations
3. **Expansion Tracking**: All size changes go through `resize()`

Gas calculation formula (implemented elsewhere):
```
memory_cost = (memory_size_in_words * 3) + (memory_size_in_words² / 512)
```

## Best Practices and Usage

1. **Always Free Allocated Memory**:
   ```zig
   const data = try memory.getCopy(offset, size);
   defer allocator.free(data);
   ```

2. **Prefer getPtr() for Temporary Access**:
   ```zig
   const view = try memory.getPtr(offset, size);
   // Use view immediately, don't store reference
   ```

3. **Use require() Before Access**:
   ```zig
   try memory.require(offset, size);
   // Memory is now guaranteed to be large enough
   ```

4. **Handle Errors Explicitly**:
   ```zig
   memory.set(offset, size, data) catch |err| {
       // Handle specific error cases
   };
   ```

## Future Optimization Opportunities

Based on other implementations, potential improvements include:

1. **Chunk-based Allocation**: Like evmone's 4KB pages to reduce allocations
2. **Memory Sharing**: Reference counting for efficient call contexts
3. **Specialized Operations**: Fast paths for common patterns
4. **SIMD Operations**: For bulk memory operations
5. **Memory Pooling**: Reuse memory across calls

## Conclusion

The Tevm Memory implementation provides a clean, safe, and well-documented EVM memory model. It prioritizes correctness and maintainability while providing the necessary hooks for performance optimization. The explicit error handling and comprehensive debug support make it excellent for development and testing, while the clear separation of concerns allows for future optimizations without major refactoring.