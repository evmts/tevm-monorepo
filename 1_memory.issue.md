# Memory Implementation Issue

## Overview

Memory.zig provides a dynamic byte array implementation optimized for EVM memory operations with word-aligned access, efficient resizing, and copy operations.

## Requirements

- Dynamic byte array that grows on demand
- Word-aligned (32-byte) operations for EVM compatibility
- Efficient memory expansion with gas cost calculation support
- Initial capacity optimization (4KB recommended)
- Zero-initialization on expansion
- Support for both safe and unsafe operations
- Minimal overhead for read/write operations
- No debug logging in production builds
- Memory limit enforcement capability
- Context management for call stack (future enhancement)

## Interface

```zig
const std = @import("std");

pub const MemoryError = error{
    OutOfMemory,
    InvalidOffset,
    InvalidSize,
    MemoryLimitExceeded,
};

pub const Memory = struct {
    buffer: std.ArrayList(u8),
    memory_limit: u64,  // Maximum allowed memory size in bytes (default: u64.max)
    // Note: buffer.capacity tracks allocated memory, buffer.items.len tracks used memory
    
    // Initialize with default 4KB capacity
    pub fn init(allocator: std.mem.Allocator) !Memory
    
    // Initialize with custom capacity
    pub fn initWithCapacity(allocator: std.mem.Allocator, capacity: usize) !Memory
    
    // Initialize with memory limit
    pub fn initWithLimit(allocator: std.mem.Allocator, memory_limit: u64) !Memory
    
    // Clean up
    pub fn deinit(self: *Memory) void
    
    // Get current memory size in bytes
    pub fn size(self: *const Memory) usize
    
    // Check if memory is empty
    pub fn isEmpty(self: *const Memory) bool
    
    // Resize memory to new_size bytes (zero-fills new bytes)
    // Returns error if new_size exceeds memory_limit
    pub fn resize(self: *Memory, new_size: usize) MemoryError!void
    
    // Ensure memory is at least of given size (for gas calculation)
    // Returns the number of new words allocated (for gas cost)
    pub fn ensureCapacity(self: *Memory, min_size: usize) MemoryError!u64
    
    // Read operations
    
    // Read a single byte at offset
    pub fn getByte(self: *const Memory, offset: usize) MemoryError!u8
    
    // Read 32 bytes (word) at offset
    pub fn getWord(self: *const Memory, offset: usize) MemoryError![32]u8
    
    // Read 32 bytes as u256 at offset
    pub fn getU256(self: *const Memory, offset: usize) MemoryError!u256
    
    // Read arbitrary slice
    pub fn getSlice(self: *const Memory, offset: usize, len: usize) MemoryError![]const u8
    
    // Write operations
    
    // Write a single byte at offset
    pub fn setByte(self: *Memory, offset: usize, value: u8) MemoryError!void
    
    // Write 32 bytes (word) at offset
    pub fn setWord(self: *Memory, offset: usize, value: [32]u8) MemoryError!void
    
    // Write u256 as 32 bytes at offset
    pub fn setU256(self: *Memory, offset: usize, value: u256) MemoryError!void
    
    // Write arbitrary data at offset
    pub fn setData(self: *Memory, offset: usize, data: []const u8) MemoryError!void
    
    // Write data with source offset and length (handles partial copies and zero-fills)
    // Used for CALLDATACOPY, CODECOPY, etc.
    pub fn setDataBounded(
        self: *Memory,
        memory_offset: usize,
        data: []const u8,
        data_offset: usize,
        len: usize
    ) MemoryError!void
    
    // Copy within memory (handles overlapping regions)
    // Used for MCOPY instruction
    pub fn copy(self: *Memory, dest_offset: usize, src_offset: usize, len: usize) MemoryError!void
    
    // Unsafe operations (no bounds checking, caller ensures validity)
    
    // Get raw pointer to memory at offset
    pub fn getPtrUnsafe(self: *Memory, offset: usize) [*]u8
    
    // Get const raw pointer to memory at offset
    pub fn getConstPtrUnsafe(self: *const Memory, offset: usize) [*]const u8
    
    // Set bytes without bounds checking
    pub fn setUnsafe(self: *Memory, offset: usize, data: []const u8) void
    
    // Utility functions
    
    // Calculate number of words (32-byte chunks) for given byte size
    pub fn numWords(len: usize) usize
    
    // Get memory as hex string (for debugging/logging)
    pub fn toHex(self: *const Memory, allocator: std.mem.Allocator) ![]u8
    
    // Create a snapshot of current memory state
    pub fn snapshot(self: *const Memory, allocator: std.mem.Allocator) ![]u8
    
    // Restore from snapshot
    pub fn restore(self: *Memory, snapshot: []const u8) MemoryError!void
};

// Calculate number of words needed for byte length (rounds up)
pub fn calculateNumWords(len: usize) usize {
    return (len + 31) / 32;
}
```

## Implementation Guidelines

1. Use `std.ArrayList(u8)` as the underlying buffer
2. Initialize with 4KB capacity to reduce early allocations (matching OS page size)
3. Always zero-fill new memory on expansion using `@memset`
4. Implement word-aligned operations using direct memory access
5. Use `@memcpy` and `std.mem.copyForwards` for efficient copying
6. Bounds checking in safe operations, skip in unsafe variants
7. No debug prints in any methods
8. Use 2x growth strategy: double capacity when expanding until reaching required size
9. Ensure copy handles overlapping regions correctly (use `std.mem.copyForwards` for MCOPY)
10. Memory limit checks before expansion
11. Round up all memory sizes to 32-byte boundaries for word alignment
12. Consider marking grow/resize function as `noinline` for better instruction cache usage
13. Track both size (used) and capacity (allocated) separately for efficient reallocation
14. Integrate gas cost calculation: `3 * new_words + (new_words * new_words) / 512`
15. Use page-aligned allocations when possible for better OS memory management

## Error Handling

- `OutOfMemory`: System allocation failure
- `InvalidOffset`: Offset exceeds current memory size
- `InvalidSize`: Size would cause integer overflow
- `MemoryLimitExceeded`: Operation would exceed configured memory limit

## Performance Considerations

- Inline small functions like `getByte`, `setByte`
- Pre-allocate in chunks (e.g., 4KB) to reduce allocations
- Use unsafe variants in hot paths after validation
- Avoid unnecessary copies in word operations
- Consider SIMD operations for large copies (future enhancement)

## Dependencies

- `std` - Zig standard library only

## Export Requirements

- This module must be publicly exported from the EVM package
- Add to `src/Evm/package.zig`: `pub const Memory = @import("Memory.zig").Memory;`
- Add to `src/package.zig`: `pub const Memory = Evm.Memory;`

## Test Requirements

### 1. Functional Tests

- Empty memory operations (size, isEmpty, getByte on empty)
- Single byte read/write at various offsets
- Word (32-byte) aligned read/write
- Unaligned word access (crossing 32-byte boundaries)
- Large data operations (>1KB, >1MB)
- Memory expansion from zero
- Memory expansion from non-zero size
- Partial data copy with `setDataBounded`:
  - Source data smaller than requested length (zero-fill test)
  - Source offset beyond data bounds (full zero-fill test)
  - Normal partial copy with valid offsets
- Overlapping memory copy (forward and backward)
- Memory limit enforcement
- Out of bounds access (should error, not panic)
- Zero-length operations (copy, setData with len=0)
- Maximum memory size handling (near u64.max)
- Snapshot and restore functionality
- Multiple sequential expansions
- Shrinking is not supported (verify resize only grows)

### 2. Edge Cases

- Offset + length integer overflow protection
- Memory allocation failure handling
- Copy with source == destination (no-op optimization)
- Word operations at memory boundary (last 32 bytes)
- Very large single allocation (e.g., 1GB)
- Alternating small and large allocations
- Memory fragmentation patterns

### 3. Performance Tests (required)

```zig
// Benchmark suite comparing against baseline and targets
const MemoryBenchmark = struct {
    // Measure memory expansion cost
    pub fn benchmarkExpansion() !void
    // Target: <100ns for small expansions (<1KB)
    // Target: <1µs for medium expansions (<1MB)
    
    // Measure word read/write throughput
    pub fn benchmarkWordOperations() !void
    // Target: >1GB/s throughput for sequential word access
    
    // Measure bulk copy performance
    pub fn benchmarkCopy() !void
    // Target: >5GB/s for large copies (>1MB)
    
    // Measure random access patterns
    pub fn benchmarkRandomAccess() !void
    // Target: <50ns per word access
    
    // Compare against theoretical memcpy speed
    pub fn benchmarkAgainstMemcpy() !void
    // Target: Within 20% of raw memcpy for large operations
};
```

### 4. Stress Tests

- Rapid expansion/contraction cycles
- Concurrent access patterns (for future thread safety)
- Memory pressure scenarios (near system limits)
- Pathological access patterns (sparse writes)

### 5. Comparison Tests

- Performance comparison with revm's SharedMemory
- Performance comparison with evmone's Memory
- Gas cost accuracy for memory expansion

## Invariants to Verify

- Memory is always zero-initialized on expansion
- Memory size only increases (never shrinks)
- All successful operations maintain valid state
- No memory leaks in any code path
- Thread-safe for read operations (future requirement)

---

## Current Implementation (Prototype)

The current Zig implementation in `src/Evm/Memory.zig`:

```zig
const std = @import("std");

const Memory = @This();

m: std.ArrayList(u8),

pub const BigInt = u64;
pub const MemoryError = error{
    MemoryInvalidBigInt,
    MemoryInvalidOffset,
    MemoryOverflow,
    MemoryReadOutOfBounds,
};

pub fn init(allocator: std.mem.Allocator) Memory {
    return Memory{
        .m = std.ArrayList(u8).init(allocator),
    };
}

pub fn deinit(self: *Memory) void {
    self.m.deinit();
}

pub fn len(self: *const Memory) usize {
    return self.m.items.len;
}

pub fn lenBigInt(self: *const Memory) !BigInt {
    const length = self.len();
    if (length > std.math.maxInt(BigInt)) {
        return MemoryError.MemoryInvalidBigInt;
    }
    return @as(BigInt, @intCast(length));
}

pub fn read(self: *const Memory, offset: usize, size: usize) ![]const u8 {
    std.debug.print("Memory.read: offset={}, size={}, len={}\n", .{ offset, size, self.len() });
    if (offset + size > self.len()) {
        return MemoryError.MemoryReadOutOfBounds;
    }
    return self.m.items[offset .. offset + size];
}

pub fn readByte(self: *const Memory, offset: usize) !u8 {
    std.debug.print("Memory.readByte: offset={}, len={}\n", .{ offset, self.len() });
    if (offset >= self.len()) {
        return MemoryError.MemoryReadOutOfBounds;
    }
    return self.m.items[offset];
}

pub fn readBigInt(self: *const Memory, offset: BigInt, size: BigInt) ![]const u8 {
    const offset_usize = @as(usize, @intCast(offset));
    const size_usize = @as(usize, @intCast(size));
    return self.read(offset_usize, size_usize);
}

pub fn write(self: *Memory, offset: usize, data: []const u8) !void {
    std.debug.print("Memory.write: offset={}, data_len={}, mem_len={}\n", .{ offset, data.len, self.len() });
    const end = offset + data.len;
    if (end > self.len()) {
        try self.resize(end);
    }
    @memcpy(self.m.items[offset..end], data);
}

pub fn writeByte(self: *Memory, offset: usize, byte: u8) !void {
    std.debug.print("Memory.writeByte: offset={}, byte={}, len={}\n", .{ offset, byte, self.len() });
    if (offset >= self.len()) {
        try self.resize(offset + 1);
    }
    self.m.items[offset] = byte;
}

pub fn writeBigInt(self: *Memory, offset: BigInt, data: []const u8) !void {
    const offset_usize = @as(usize, @intCast(offset));
    return self.write(offset_usize, data);
}

pub fn resize(self: *Memory, new_size: usize) !void {
    std.debug.print("Memory.resize: current_len={}, new_size={}\n", .{ self.len(), new_size });
    
    const current_len = self.len();
    if (new_size <= current_len) {
        return;
    }
    
    try self.m.resize(new_size);
    
    var i = current_len;
    while (i < new_size) : (i += 1) {
        self.m.items[i] = 0;
    }
}

pub fn resizeBigInt(self: *Memory, new_size: BigInt) !void {
    const new_size_usize = @as(usize, @intCast(new_size));
    return self.resize(new_size_usize);
}

pub fn toHex(self: *const Memory, allocator: std.mem.Allocator) ![]u8 {
    const hex_len = self.len() * 2;
    var hex_str = try allocator.alloc(u8, hex_len);
    
    for (self.m.items, 0..) |byte, i| {
        _ = std.fmt.bufPrint(hex_str[i * 2 .. (i + 1) * 2], "{x:0>2}", .{byte}) catch unreachable;
    }
    
    return hex_str;
}
```

## Current Tests (Prototype)

The current test file in `test/Evm/memory_test.zig`:

```zig
const std = @import("std");
const Memory = @import("../../src/Evm/Memory.zig");
const expect = std.testing.expect;

test "Memory: init and deinit" {
    const allocator = std.testing.allocator;
    var mem = Memory.init(allocator);
    defer mem.deinit();
    
    try expect(mem.len() == 0);
}

test "Memory: write and read" {
    const allocator = std.testing.allocator;
    var mem = Memory.init(allocator);
    defer mem.deinit();
    
    const data = [_]u8{ 0x01, 0x02, 0x03, 0x04 };
    try mem.write(0, &data);
    
    try expect(mem.len() == 4);
    
    const read_data = try mem.read(0, 4);
    try expect(std.mem.eql(u8, read_data, &data));
}

test "Memory: write at offset with resize" {
    const allocator = std.testing.allocator;
    var mem = Memory.init(allocator);
    defer mem.deinit();
    
    const data = [_]u8{ 0xAA, 0xBB };
    try mem.write(10, &data);
    
    try expect(mem.len() == 12);
    
    // Check that memory before offset is zero-initialized
    const prefix = try mem.read(0, 10);
    for (prefix) |byte| {
        try expect(byte == 0);
    }
    
    // Check written data
    const read_data = try mem.read(10, 2);
    try expect(std.mem.eql(u8, read_data, &data));
}

test "Memory: toHex" {
    const allocator = std.testing.allocator;
    var mem = Memory.init(allocator);
    defer mem.deinit();
    
    const data = [_]u8{ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF };
    try mem.write(0, &data);
    
    const hex = try mem.toHex(allocator);
    defer allocator.free(hex);
    
    try expect(std.mem.eql(u8, hex, "0123456789abcdef"));
}
```

## revm Implementation Reference

revm's SharedMemory implementation (`/revm/crates/interpreter/src/interpreter/shared_memory.rs`):

```rust
// Key features from revm:
// 1. Reference-counted shared buffer: Rc<RefCell<Vec<u8>>>
// 2. Checkpoint system for call contexts
// 3. 4KB initial capacity
// 4. Word-aligned operations (get_word, set_word, get_u256, set_u256)
// 5. Efficient set_data with partial copy and zero-fill
// 6. Memory limit support (optional feature)
// 7. Unsafe optimizations for performance
// 8. Context management (new_child_context, free_child_context)

pub struct SharedMemory {
    buffer: Rc<RefCell<Vec<u8>>>,
    my_checkpoint: usize,
    child_checkpoint: Option<usize>,
    #[cfg(feature = "memory_limit")]
    memory_limit: u64,
}

// Example of word-aligned operations:
pub fn get_word(&self, offset: usize) -> B256 {
    (*self.slice_len(offset, 32)).try_into().unwrap()
}

pub fn set_word(&mut self, offset: usize, value: &B256) {
    self.set(offset, &value[..]);
}

// Efficient data setting with zero-fill:
unsafe fn set_data(dst: &mut [u8], src: &[u8], dst_offset: usize, src_offset: usize, len: usize) {
    if src_offset >= src.len() {
        dst.get_mut(dst_offset..dst_offset + len).unwrap().fill(0);
        return;
    }
    // ... copy available data and zero-fill the rest
}
```

## evmone Implementation Insights

evmone's memory implementation provides additional optimization strategies:

1. **Page-based allocation** - Uses 4KB pages matching OS page size
2. **2x growth factor** - Doubles capacity until reaching required size
3. **Custom memory management** - Uses `std::realloc()` with `std::unique_ptr`
4. **Alignment guarantees** - Ensures proper alignment for performance
5. **Gas cost integration** - `3 * words + words² / 512` calculation built-in
6. **Noinline optimization** - `grow_memory` marked noinline to improve instruction cache
7. **Memory size alignment** - Always rounds up to 32-byte boundaries

Key implementation details from evmone:
```cpp
// Initial allocation and growth strategy
Memory() noexcept { allocate(4 * 1024); }  // 4KB initial

void grow(size_t new_size) noexcept {
    // Double capacity until it fits new_size
    while (m_capacity < new_size)
        m_capacity *= 2;
    
    // Realloc and zero new memory
    m_data = std::realloc(m_data, m_capacity);
    std::memset(m_data + old_size, 0, m_capacity - old_size);
}

// Gas cost calculation integrated
int64_t gas_cost = 3 * new_words + (new_words * new_words) / 512;
```

## Key Improvements Needed

1. **Remove all debug prints** - Current implementation has excessive logging
2. **Add word-aligned operations** - Critical for EVM's 32-byte word size
3. **Implement initial capacity** - Start with 4KB to reduce allocations
4. **Add memory limit support** - Prevent unbounded growth
5. **Optimize with unsafe variants** - For validated hot paths
6. **Implement setDataBounded** - For efficient partial copies with zero-fill
7. **Add snapshot/restore** - For state management
8. **Fix BigInt type** - Should use u256, not u64
9. **Add performance benchmarks** - Ensure targets are met
10. **Implement proper error handling** - Without panics
11. **Add 2x growth strategy** - Like evmone, double capacity when growing
12. **Ensure 32-byte alignment** - Round up all sizes to word boundaries
13. **Consider page-aligned allocation** - Use OS page size for better performance
14. **Integrate gas calculation** - Build in `3*words + words²/512` formula
15. **Mark grow function noinline** - Optimize instruction cache usage