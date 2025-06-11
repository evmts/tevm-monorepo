# Implement Memory Gas Optimization

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_memory_gas_optimization` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_memory_gas_optimization feat_implement_memory_gas_optimization`
3. **Work in isolation**: `cd g/feat_implement_memory_gas_optimization`
4. **Commit message**: Use the following XML format:

```
✨ feat: brief description of the change

<summary>
<what>
- Bullet point summary of what was changed
- Key implementation details and files modified
</what>

<why>
- Motivation and reasoning behind the changes
- Problem being solved or feature being added
</why>

<how>
- Technical approach and implementation strategy
- Important design decisions or trade-offs made
</how>
</summary>

<prompt>
Condensed version of the original prompt that includes:
- The core request or task
- Essential context needed to re-execute
- Replace large code blocks with <github>url</github> or <docs>description</docs>
- Remove redundant examples but keep key technical details
- Ensure someone could understand and repeat the task from this prompt alone
</prompt>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement memory gas pre-calculation and caching to optimize EVM memory expansion costs. Memory operations like MLOAD, MSTORE, CALLDATACOPY, etc. require dynamic gas calculation based on memory size growth. Pre-calculating and caching these costs can significantly improve performance for memory-intensive contracts.

## ELI5

In the EVM, using memory costs gas, and the more memory you use, the more expensive it gets (quadratically!). Every time a smart contract wants to read from or write to memory, the EVM has to calculate how much extra gas to charge based on how much the memory is growing. This is like having to recalculate your hotel bill every time you use another towel. Memory gas optimization is like pre-calculating and storing these costs so we don't have to do the expensive math every single time. This makes memory operations much faster, especially for contracts that use a lot of memory.

## Current Memory Gas Model

### Memory Expansion Formula
```
memory_cost = memory_size_word * Gmemory + (memory_size_word^2) / Gquadratic
where:
- memory_size_word = (memory_size + 31) / 32  (rounded up to nearest word)
- Gmemory = 3 (linear cost per word)
- Gquadratic = 512 (quadratic cost divisor)
```

### Dynamic Gas Calculation
Memory expansion gas is calculated as:
```
expansion_gas = new_memory_cost - old_memory_cost
```

## Optimization Strategy

### Memory Cost Caching
Cache memory costs for common sizes to avoid repeated quadratic calculations:
```zig
pub const MemoryCostCache = struct {
    const CACHE_SIZE = 1024; // Cache costs for first 1024 words
    const CACHE_THRESHOLD = CACHE_SIZE * 32; // 32KB threshold
    
    cached_costs: [CACHE_SIZE]u64,
    
    pub fn init() MemoryCostCache {
        var cache = MemoryCostCache{ .cached_costs = undefined };
        
        // Pre-calculate costs for common memory sizes
        for (0..CACHE_SIZE) |i| {
            cache.cached_costs[i] = calculate_memory_cost_uncached(@as(u32, @intCast(i * 32)));
        }
        
        return cache;
    }
    
    pub fn get_memory_cost(self: *const MemoryCostCache, memory_size: u32) u64 {
        const memory_size_word = (memory_size + 31) / 32;
        
        if (memory_size_word < CACHE_SIZE) {
            return self.cached_costs[memory_size_word];
        }
        
        // Fall back to calculation for large sizes
        return calculate_memory_cost_uncached(memory_size);
    }
};
```

### Incremental Cost Tracking
Track memory costs incrementally to avoid recalculation:
```zig
pub const MemoryGasTracker = struct {
    current_size: u32,
    current_cost: u64,
    cache: *const MemoryCostCache,
    
    pub fn init(cache: *const MemoryCostCache) MemoryGasTracker {
        return MemoryGasTracker{
            .current_size = 0,
            .current_cost = 0,
            .cache = cache,
        };
    }
    
    pub fn calculate_expansion_gas(self: *MemoryGasTracker, new_size: u32) u64 {
        if (new_size <= self.current_size) {
            return 0; // No expansion needed
        }
        
        const new_cost = self.cache.get_memory_cost(new_size);
        const expansion_gas = new_cost - self.current_cost;
        
        // Update tracker state
        self.current_size = new_size;
        self.current_cost = new_cost;
        
        return expansion_gas;
    }
};
```

## Implementation Tasks

### Task 1: Implement Memory Cost Cache
File: `/src/evm/memory/memory_gas_cache.zig`
```zig
const std = @import("std");
const gas_constants = @import("../constants/gas_constants.zig");

pub const MemoryCostCache = struct {
    const CACHE_SIZE = 1024; // Cache for first 32KB (1024 words)
    const MAX_CACHED_MEMORY = CACHE_SIZE * 32;
    
    cached_costs: [CACHE_SIZE]u64,
    
    pub fn init() MemoryCostCache {
        var cache = MemoryCostCache{
            .cached_costs = undefined,
        };
        
        // Pre-calculate memory costs for common sizes
        for (0..CACHE_SIZE) |i| {
            const memory_size = @as(u32, @intCast(i * 32));
            cache.cached_costs[i] = calculate_memory_cost_direct(memory_size);
        }
        
        return cache;
    }
    
    pub fn get_memory_cost(self: *const MemoryCostCache, memory_size: u32) u64 {
        if (memory_size <= MAX_CACHED_MEMORY) {
            const word_index = memory_size / 32;
            return self.cached_costs[word_index];
        }
        
        // Use direct calculation for large memory sizes
        return calculate_memory_cost_direct(memory_size);
    }
    
    fn calculate_memory_cost_direct(memory_size: u32) u64 {
        if (memory_size == 0) return 0;
        
        const memory_size_word = (memory_size + 31) / 32;
        const memory_size_word_u64 = @as(u64, memory_size_word);
        
        // Linear cost: memory_size_word * 3
        const linear_cost = memory_size_word_u64 * gas_constants.MEMORY_GAS_LINEAR;
        
        // Quadratic cost: memory_size_word^2 / 512
        const quadratic_cost = (memory_size_word_u64 * memory_size_word_u64) / gas_constants.MEMORY_GAS_QUADRATIC;
        
        return linear_cost + quadratic_cost;
    }
};

pub const MemoryGasTracker = struct {
    current_size: u32,
    current_cost: u64,
    cache: *const MemoryCostCache,
    
    pub fn init(cache: *const MemoryCostCache) MemoryGasTracker {
        return MemoryGasTracker{
            .current_size = 0,
            .current_cost = 0,
            .cache = cache,
        };
    }
    
    pub fn get_expansion_gas(self: *MemoryGasTracker, new_size: u32) u64 {
        if (new_size <= self.current_size) {
            return 0; // No expansion needed
        }
        
        const new_cost = self.cache.get_memory_cost(new_size);
        return new_cost - self.current_cost;
    }
    
    pub fn expand_memory(self: *MemoryGasTracker, new_size: u32) u64 {
        const expansion_gas = self.get_expansion_gas(new_size);
        
        if (new_size > self.current_size) {
            self.current_size = new_size;
            self.current_cost = self.cache.get_memory_cost(new_size);
        }
        
        return expansion_gas;
    }
    
    pub fn reset(self: *MemoryGasTracker) void {
        self.current_size = 0;
        self.current_cost = 0;
    }
    
    pub fn get_current_cost(self: *const MemoryGasTracker) u64 {
        return self.current_cost;
    }
    
    pub fn get_current_size(self: *const MemoryGasTracker) u32 {
        return self.current_size;
    }
};
```

### Task 2: Add Memory Gas Constants
File: `/src/evm/constants/gas_constants.zig` (modify existing)
```zig
// Memory gas calculation constants
pub const MEMORY_GAS_LINEAR: u64 = 3;
pub const MEMORY_GAS_QUADRATIC: u64 = 512;

// Memory operation base costs
pub const MLOAD_COST: u64 = 3;
pub const MSTORE_COST: u64 = 3;
pub const MSTORE8_COST: u64 = 3;

// Copy operation costs per word
pub const COPY_GAS_PER_WORD: u64 = 3;
```

### Task 3: Update Frame with Memory Gas Tracker
File: `/src/evm/frame.zig` (modify existing)
```zig
const MemoryGasTracker = @import("memory/memory_gas_cache.zig").MemoryGasTracker;

pub const Frame = struct {
    // Existing fields...
    memory_gas_tracker: MemoryGasTracker,
    
    pub fn init(
        allocator: std.mem.Allocator,
        context: CallContext,
        memory_cache: *const MemoryCostCache
    ) !Frame {
        return Frame{
            // Existing initialization...
            .memory_gas_tracker = MemoryGasTracker.init(memory_cache),
        };
    }
    
    pub fn calculate_memory_expansion_gas(self: *Frame, offset: u64, size: u64) !u64 {
        // Check for overflow in memory access
        const end_offset = offset + size;
        if (end_offset < offset) return ExecutionError.MemoryOverflow;
        
        // Check against maximum memory limit
        if (end_offset > memory_limits.MAX_MEMORY_SIZE) {
            return ExecutionError.MemoryTooLarge;
        }
        
        // Calculate required memory size (round up to word boundary)
        const required_size = @as(u32, @intCast(end_offset));
        
        // Get expansion gas cost
        return self.memory_gas_tracker.get_expansion_gas(required_size);
    }
    
    pub fn expand_memory_with_gas(self: *Frame, offset: u64, size: u64) !u64 {
        const expansion_gas = try self.calculate_memory_expansion_gas(offset, size);
        
        // Check gas availability
        if (self.gas_remaining < expansion_gas) {
            return ExecutionError.OutOfGas;
        }
        
        // Consume gas and expand memory
        self.gas_remaining -= expansion_gas;
        const required_size = @as(u32, @intCast(offset + size));
        _ = self.memory_gas_tracker.expand_memory(required_size);
        
        // Expand actual memory
        try self.memory.expand(required_size);
        
        return expansion_gas;
    }
};
```

### Task 4: Update Memory Operations
File: `/src/evm/execution/memory.zig` (modify existing)
```zig
// Update MLOAD to use optimized gas calculation
pub fn execute_mload(vm: *Vm, frame: *Frame) !ExecutionResult {
    const offset = frame.stack.pop_unsafe();
    
    // Calculate memory expansion gas efficiently
    const expansion_gas = try frame.expand_memory_with_gas(offset, 32);
    
    // Load value from memory
    const value = frame.memory.load_word(offset);
    frame.stack.push_unsafe(value);
    
    return ExecutionResult.continue_execution;
}

// Update MSTORE to use optimized gas calculation
pub fn execute_mstore(vm: *Vm, frame: *Frame) !ExecutionResult {
    const offset = frame.stack.pop_unsafe();
    const value = frame.stack.pop_unsafe();
    
    // Calculate memory expansion gas efficiently
    const expansion_gas = try frame.expand_memory_with_gas(offset, 32);
    
    // Store value to memory
    frame.memory.store_word(offset, value);
    
    return ExecutionResult.continue_execution;
}

// Update MSTORE8 to use optimized gas calculation
pub fn execute_mstore8(vm: *Vm, frame: *Frame) !ExecutionResult {
    const offset = frame.stack.pop_unsafe();
    const value = frame.stack.pop_unsafe();
    
    // Calculate memory expansion gas efficiently
    const expansion_gas = try frame.expand_memory_with_gas(offset, 1);
    
    // Store byte to memory
    const byte_value = @as(u8, @intCast(value & 0xFF));
    frame.memory.store_byte(offset, byte_value);
    
    return ExecutionResult.continue_execution;
}

// Update MCOPY to use optimized gas calculation
pub fn execute_mcopy(vm: *Vm, frame: *Frame) !ExecutionResult {
    const dest_offset = frame.stack.pop_unsafe();
    const src_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();
    
    // Calculate memory expansion for both source and destination
    const src_expansion_gas = try frame.calculate_memory_expansion_gas(src_offset, size);
    const dest_expansion_gas = try frame.calculate_memory_expansion_gas(dest_offset, size);
    
    // Use maximum expansion gas
    const total_expansion_gas = @max(src_expansion_gas, dest_expansion_gas);
    
    // Calculate copy gas (3 gas per word)
    const words = (size + 31) / 32;
    const copy_gas = words * gas_constants.COPY_GAS_PER_WORD;
    
    const total_gas = total_expansion_gas + copy_gas;
    
    // Check gas and expand memory
    if (frame.gas_remaining < total_gas) {
        return ExecutionError.OutOfGas;
    }
    
    frame.gas_remaining -= total_gas;
    
    // Expand memory for both regions
    try frame.memory.expand(@as(u32, @intCast(src_offset + size)));
    try frame.memory.expand(@as(u32, @intCast(dest_offset + size)));
    
    // Perform the copy
    frame.memory.copy(dest_offset, src_offset, size);
    
    return ExecutionResult.continue_execution;
}
```

### Task 5: Update VM with Memory Cache
File: `/src/evm/vm.zig` (modify existing)
```zig
const MemoryCostCache = @import("memory/memory_gas_cache.zig").MemoryCostCache;

pub const Vm = struct {
    // Existing fields...
    memory_cost_cache: MemoryCostCache,
    
    pub fn init(allocator: std.mem.Allocator) !Vm {
        return Vm{
            // Existing initialization...
            .memory_cost_cache = MemoryCostCache.init(),
        };
    }
    
    pub fn create_frame(self: *Vm, context: CallContext) !Frame {
        return Frame.init(
            self.allocator,
            context,
            &self.memory_cost_cache
        );
    }
};
```

### Task 6: Optimize Call Operations
File: `/src/evm/execution/system.zig` (modify existing call operations)
```zig
// Update CALLDATACOPY to use optimized memory gas
pub fn execute_calldatacopy(vm: *Vm, frame: *Frame) !ExecutionResult {
    const dest_offset = frame.stack.pop_unsafe();
    const src_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();
    
    // Calculate memory expansion gas efficiently
    const expansion_gas = try frame.expand_memory_with_gas(dest_offset, size);
    
    // Calculate copy gas
    const words = (size + 31) / 32;
    const copy_gas = words * gas_constants.COPY_GAS_PER_WORD;
    
    // Check gas for copy operation
    if (frame.gas_remaining < copy_gas) {
        return ExecutionError.OutOfGas;
    }
    
    frame.gas_remaining -= copy_gas;
    
    // Perform the copy
    const src_end = src_offset + size;
    const call_data = frame.context.call_data;
    
    for (0..size) |i| {
        const src_idx = src_offset + i;
        const byte_value = if (src_idx < call_data.len) call_data[src_idx] else 0;
        frame.memory.store_byte(dest_offset + i, byte_value);
    }
    
    return ExecutionResult.continue_execution;
}
```

## Testing Requirements

### Test File
Create `/test/evm/memory/memory_gas_optimization_test.zig`

### Test Cases
```zig
const std = @import("std");
const testing = std.testing;
const MemoryCostCache = @import("../../../src/evm/memory/memory_gas_cache.zig").MemoryCostCache;
const MemoryGasTracker = @import("../../../src/evm/memory/memory_gas_cache.zig").MemoryGasTracker;

test "memory cost cache accuracy" {
    const cache = MemoryCostCache.init();
    
    // Test cached values match direct calculation
    for (0..1024) |i| {
        const memory_size = @as(u32, @intCast(i * 32));
        const cached_cost = cache.get_memory_cost(memory_size);
        const direct_cost = calculate_memory_cost_reference(memory_size);
        
        try testing.expectEqual(direct_cost, cached_cost);
    }
}

test "memory gas tracker incremental costs" {
    const cache = MemoryCostCache.init();
    var tracker = MemoryGasTracker.init(&cache);
    
    // Test incremental expansion
    const expansion1 = tracker.expand_memory(64);   // 0 -> 64 bytes
    const expansion2 = tracker.expand_memory(128);  // 64 -> 128 bytes
    const expansion3 = tracker.expand_memory(64);   // 128 -> 64 (no expansion)
    
    // Verify costs
    try testing.expect(expansion1 > 0);
    try testing.expect(expansion2 > 0);
    try testing.expectEqual(@as(u64, 0), expansion3); // No expansion
    
    // Verify total cost equals direct calculation
    const total_cost = tracker.get_current_cost();
    const expected_cost = cache.get_memory_cost(128);
    try testing.expectEqual(expected_cost, total_cost);
}

test "memory expansion gas calculation" {
    const cache = MemoryCostCache.init();
    var tracker = MemoryGasTracker.init(&cache);
    
    // Test various memory sizes
    const test_sizes = [_]u32{ 32, 64, 96, 128, 256, 512, 1024, 2048 };
    var previous_cost: u64 = 0;
    
    for (test_sizes) |size| {
        const expansion_gas = tracker.expand_memory(size);
        const current_cost = tracker.get_current_cost();
        
        // Verify expansion gas equals cost difference
        try testing.expectEqual(current_cost - previous_cost, expansion_gas);
        previous_cost = current_cost;
    }
}

test "large memory size calculation" {
    const cache = MemoryCostCache.init();
    
    // Test memory sizes beyond cache
    const large_size = 1024 * 1024; // 1MB
    const cost = cache.get_memory_cost(large_size);
    
    // Should still produce valid cost
    try testing.expect(cost > 0);
    
    // Should be significantly higher than cached sizes
    const small_cost = cache.get_memory_cost(1024);
    try testing.expect(cost > small_cost * 100);
}

test "memory gas optimization performance" {
    const cache = MemoryCostCache.init();
    var tracker = MemoryGasTracker.init(&cache);
    
    // Benchmark memory expansion operations
    const iterations = 10000;
    var total_gas: u64 = 0;
    
    var timer = std.time.Timer.start() catch unreachable;
    const start_time = timer.read();
    
    for (0..iterations) |i| {
        const size = @as(u32, @intCast((i % 100) * 32));
        total_gas += tracker.get_expansion_gas(size);
    }
    
    const end_time = timer.read();
    const duration = end_time - start_time;
    
    // Should complete quickly (performance test)
    try testing.expect(duration < 1000000); // Less than 1ms
    try testing.expect(total_gas > 0); // Sanity check
}

fn calculate_memory_cost_reference(memory_size: u32) u64 {
    // Reference implementation for testing
    if (memory_size == 0) return 0;
    
    const memory_size_word = (memory_size + 31) / 32;
    const memory_size_word_u64 = @as(u64, memory_size_word);
    
    const linear_cost = memory_size_word_u64 * 3;
    const quadratic_cost = (memory_size_word_u64 * memory_size_word_u64) / 512;
    
    return linear_cost + quadratic_cost;
}
```

### Integration Tests
```zig
test "mload with optimized memory gas" {
    // Test MLOAD operation uses cached memory costs
    // Verify gas consumption is accurate
}

test "multiple memory operations optimization" {
    // Test sequence of memory operations
    // Verify cumulative gas savings
}

test "memory intensive contract execution" {
    // Test contract with many memory operations
    // Measure performance improvement
}
```

## Performance Considerations

### Cache Efficiency
```zig
// Optimize cache size for common use cases
const OPTIMAL_CACHE_SIZE = 1024; // 32KB coverage
const CACHE_LINE_SIZE = 64; // Align with CPU cache lines

// Use bit operations for fast word calculation
fn memory_size_to_words(size: u32) u32 {
    return (size + 31) >> 5; // Faster than division
}
```

### Memory Layout Optimization
```zig
// Pack cache structure for better memory access
pub const MemoryCostCache = packed struct {
    cached_costs: [CACHE_SIZE]u64,
    
    // Align to cache line boundary
    comptime {
        if (@sizeOf(MemoryCostCache) % 64 != 0) {
            @compileError("MemoryCostCache must be cache-line aligned");
        }
    }
};
```

### Lookup Table Alternative
```zig
// For even better performance, use lookup table for small sizes
const LOOKUP_TABLE_SIZE = 256;
const MEMORY_COST_LOOKUP: [LOOKUP_TABLE_SIZE]u64 = generate_lookup_table();

fn generate_lookup_table() [LOOKUP_TABLE_SIZE]u64 {
    @setEvalBranchQuota(10000);
    var table: [LOOKUP_TABLE_SIZE]u64 = undefined;
    
    for (0..LOOKUP_TABLE_SIZE) |i| {
        table[i] = calculate_memory_cost_direct(@as(u32, @intCast(i * 32)));
    }
    
    return table;
}
```

## Success Criteria

1. **Performance Improvement**: Measurable speedup for memory-intensive operations
2. **Gas Accuracy**: Exact gas costs match EVM specification
3. **Memory Efficiency**: Minimal additional memory overhead
4. **Cache Effectiveness**: High cache hit rate for common memory sizes
5. **Integration**: Seamless integration with existing memory system
6. **Compatibility**: Works across all hardforks and opcodes

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Maintain gas accuracy** - Optimizations must not change gas costs
3. **Test cache coverage** - Verify cache effectiveness for real contracts
4. **Benchmark performance** - Measure actual improvement
5. **Handle large memory** - Graceful fallback for sizes beyond cache
6. **Memory safety** - Prevent overflow in memory calculations

## References

- [Ethereum Yellow Paper - Appendix G](https://ethereum.github.io/yellowpaper/paper.pdf) - Memory gas calculation
- [EIP-150: Gas cost changes](https://eips.ethereum.org/EIPS/eip-150) - Memory gas history
- [Go-Ethereum Memory Implementation](https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go)
- [Performance Engineering Handbook](https://performance.wiki/) - Cache optimization techniques

## Reference Implementations

### geth

<explanation>
The go-ethereum implementation shows the standard memory gas calculation with quadratic growth formula. The memoryGasCost function implements the exact EVM specification: linear cost (memory_size_word * 3) plus quadratic cost (memory_size_word^2 / 512), with proper overflow protection and word-aligned size calculation.
</explanation>

**Memory Gas Calculation** - `/go-ethereum/core/vm/gas_table.go` (lines 26-41):
```go
// memoryGasCost calculates the quadratic gas for memory expansion. It does so
// only for the memory region that is expanded, not the total memory.
func memoryGasCost(mem *Memory, newSize uint64) (uint64, error) {
	if newSize == 0 {
		return 0, nil
	}
	// The maximum that will fit in a uint64 is max_word_count - 1. This will
	// result in a max_word_count of 0x40000000000000001, which is just greater than
	// 2^62 (which would be 0x40000000000000000). Since we're adding the word count
	// to itself, we're going to get 0x80000000000000002, which would wrap back
	// around to 0x2. This is why we need to check for overflow.
	if newSize > 0xffffffffe0 {
		return 0, ErrGasUintOverflow
	}

	newMemSize := (newSize + 31) / 32
	newMemSizeWords := newMemSize

	if newMemSizeWords > uint64(mem.Len())/32 {
		square := newMemSizeWords * newMemSizeWords
		linCoeff := newMemSizeWords * params.MemoryGas
		quadCoeff := square / params.QuadCoeffDiv
		newTotalFee := linCoeff + quadCoeff

		fee := newTotalFee - mem.lastGasCost
		mem.lastGasCost = newTotalFee

		return fee, nil
	}
	return 0, nil
}
```

**Gas Constants** - `/go-ethereum/params/protocol_params.go` (lines 28-29):
```go
MemoryGas     uint64 = 3       // Times the address of the (highest referenced byte in memory + 1)
QuadCoeffDiv  uint64 = 512     // Divisor for the quadratic particle of the memory cost equation
```