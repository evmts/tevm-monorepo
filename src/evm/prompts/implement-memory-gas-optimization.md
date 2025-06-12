# Implement Memory Gas Optimization

You are implementing Memory Gas Optimization for the Tevm EVM written in Zig. Your goal is to implement gas-efficient memory expansion algorithms following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_memory_gas_optimization` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_memory_gas_optimization feat_implement_memory_gas_optimization`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format

<<<<<<< HEAD
=======

<review>
**Implementation Status: PARTIALLY IMPLEMENTED 🟡**

**What exists:**
- ✅ Memory operations (MLOAD, MSTORE, etc.) are implemented
- ✅ Basic memory expansion logic exists in memory.zig
- ✅ Memory size calculations are present
- ✅ Gas constants are defined for memory operations

**What's missing:**
- ❌ Memory gas cost caching mechanism
- ❌ Pre-calculation of common memory expansion costs
- ❌ Performance optimization for memory-intensive operations
- ❌ Smart caching strategies for different usage patterns

**Performance Impact:**
- 🟡 **OPTIMIZATION**: Not critical for correctness but important for performance
- 🟡 **BENEFIT**: Could significantly speed up memory-intensive contracts
- 🟡 **COMPLEXITY**: Moderate implementation complexity

**Current Implementation:**
- ✅ Basic quadratic memory cost formula is likely implemented
- ❌ No evidence of caching or pre-calculation optimizations
- ❌ No performance benchmarks for memory operations

**Priority Assessment:**
- 🟠 **MEDIUM**: Performance optimization rather than correctness issue
- 🟠 **NICE-TO-HAVE**: Would improve performance but not blocking
- 🟠 **AFTER-CORE**: Should be implemented after core functionality is complete

**Next Steps:**
1. Implement memory cost caching for common sizes
2. Add performance benchmarks to measure impact
3. Optimize hot paths in memory expansion
4. Consider different caching strategies based on usage patterns
</review>
>>>>>>> origin/main

## Context

Implement memory gas pre-calculation and caching to optimize EVM memory expansion costs. Memory operations like MLOAD, MSTORE, CALLDATACOPY, etc. require dynamic gas calculation based on memory size growth. Pre-calculating and caching these costs can significantly improve performance for memory-intensive contracts.

## ELI5

Think of memory gas optimization like a smart parking meter system. In the old system, every time you want to use more parking spaces (memory), you have to recalculate the entire cost from scratch using a complex formula - this is slow and wasteful. The enhanced memory gas optimization is like having a smart meter that pre-calculates common parking costs and remembers them, so when you need 5 spaces, 10 spaces, or 20 spaces, it already knows the cost instantly. It's even smarter - it tracks how much you're currently using and only calculates the "expansion cost" for additional spaces you need, rather than recalculating everything. For contracts that use lots of memory (like those processing large amounts of data), this optimization makes operations much faster by avoiding repetitive expensive calculations, similar to how express checkout lanes speed up shopping for frequent customers.

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

## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Implementation matches Ethereum specification exactly
✅ Input validation handles all edge cases
✅ Output format matches reference implementations
✅ Performance meets or exceeds benchmarks
✅ Gas costs are calculated correctly

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/memory/memory_gas_optimization_test.zig`)
```zig
// Test basic memory gas optimization functionality
test "memory_cost_cache basic functionality with known scenarios"
test "memory_cost_cache handles edge cases correctly"
test "memory_cost_cache validates input parameters"
test "memory_cost_cache produces correct output format"
test "memory_expansion_tracker tracks growth correctly"
test "dynamic_calculator computes costs accurately"
test "cost_predictor predicts future costs"
test "memory_profiler analyzes usage patterns"
```

#### 2. **Integration Tests**
```zig
test "memory_optimization integrates with EVM execution context"
test "memory_optimization works with existing EVM systems"
test "memory_optimization maintains compatibility with hardforks"
test "memory_optimization handles system-level interactions"
test "memory_gas_calculation integrates with opcodes"
test "memory_expansion_costs match EVM behavior"
test "optimization_benefits measured correctly"
test "cache_coherency maintained across operations"
```

#### 3. **Functional Tests**
```zig
test "memory_optimization end-to-end functionality works correctly"
test "memory_optimization handles realistic usage scenarios"
test "memory_optimization maintains behavior under load"
test "memory_optimization processes complex inputs correctly"
test "memory_intensive_contracts benefit from optimization"
test "memory_expansion_sequences handled correctly"
test "large_memory_allocations optimized properly"
test "memory_access_patterns recognized"
```

#### 4. **Performance Tests**
```zig
test "memory_optimization meets performance requirements"
test "memory_optimization memory usage within bounds"
test "memory_optimization scalability with large inputs"
test "memory_optimization benchmark against baseline"
test "cache_hit_ratio_optimization achieved"
test "memory_expansion_speed_improvement measured"
test "gas_calculation_overhead_reduced"
test "memory_access_latency_improved"
```

#### 5. **Error Handling Tests**
```zig
test "memory_optimization error propagation works correctly"
test "memory_optimization proper error types and messages"
test "memory_optimization graceful handling of invalid inputs"
test "memory_optimization recovery from failure states"
test "memory_validation rejects invalid sizes"
test "memory_expansion handles overflow conditions"
test "cache_invalidation handles corruption"
test "memory_limits enforce boundaries"
```

#### 6. **Compatibility Tests**
```zig
test "memory_optimization maintains EVM specification compliance"
test "memory_optimization cross-client behavior consistency"
test "memory_optimization backward compatibility preserved"
test "memory_optimization platform-specific behavior verified"
test "memory_gas_costs match Ethereum specifications"
test "memory_expansion_formula accuracy maintained"
test "optimization_transparency ensured"
test "gas_accounting_precision preserved"
```

### Test Development Priority
1. **Start with core functionality** - Ensure basic memory cost caching works correctly
2. **Add integration tests** - Verify system-level interactions with EVM memory operations
3. **Implement performance tests** - Meet efficiency requirements for memory gas optimization
4. **Add error handling tests** - Robust failure management for memory operations
5. **Test edge cases** - Handle boundary conditions like memory limits and overflow scenarios
6. **Verify compatibility** - Ensure EVM specification compliance and gas cost accuracy

### Test Data Sources
- **EVM specification requirements**: Memory gas cost formula verification
- **Reference implementation data**: Cross-client memory behavior testing
- **Performance benchmarks**: Memory operation efficiency baseline
- **Real-world contract scenarios**: Memory-intensive application validation
- **Synthetic test cases**: Edge condition and stress testing

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public APIs
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify cross-platform compatibility

### Test-First Examples

**Before writing any implementation:**
```zig
test "memory_cost_cache basic functionality" {
    // This test MUST fail initially
    const allocator = testing.allocator;
    
    var cache = MemoryCostCache.init();
    
    // Test cache hit for small memory sizes
    const size_words = 10;
    const expected_cost = (size_words * 3) + ((size_words * size_words) / 512);
    
    const cached_cost = cache.getCost(size_words);
    try testing.expectEqual(expected_cost, cached_cost);
    
    // Test cache performance
    const start_time = std.time.nanoTimestamp();
    for (0..1000) |_| {
        _ = cache.getCost(size_words);
    }
    const cached_time = std.time.nanoTimestamp() - start_time;
    
    // Direct calculation for comparison
    const direct_start = std.time.nanoTimestamp();
    for (0..1000) |_| {
        _ = calculateMemoryCostDirect(size_words);
    }
    const direct_time = std.time.nanoTimestamp() - direct_start;
    
    // Cache should be significantly faster
    try testing.expect(cached_time < direct_time / 2);
}
```

**Only then implement:**
```zig
pub const MemoryCostCache = struct {
    pub fn getCost(self: *MemoryCostCache, size_words: u32) u64 {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test gas cost accuracy** - Ensure optimizations preserve exact gas calculations
- **Verify performance improvements** - Optimizations must provide measurable benefits
- **Test cross-platform memory behavior** - Ensure consistent results across platforms
- **Validate integration points** - Test all external interfaces thoroughly

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

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/v0.12.0/lib/evmone/instructions.hpp">
```cpp
/// Returns number of words what would fit to provided number of bytes,
/// i.e. it rounds up the number bytes to number of words.
constexpr int64_t num_words(uint64_t size_in_bytes) noexcept
{
    return static_cast<int64_t>((size_in_bytes + (word_size - 1)) / word_size);
}

/// Grows EVM memory and checks its cost.
///
/// This function should not be inlined because this may affect other inlining decisions:
/// - making check_memory() too costly to inline,
/// - making mload()/mstore()/mstore8() too costly to inline.
///
/// TODO: This function should be moved to Memory class.
[[gnu::noinline]] inline int64_t grow_memory(
    int64_t gas_left, Memory& memory, uint64_t new_size) noexcept
{
    // This implementation recomputes memory.size(). This value is already known to the caller
    // and can be passed as a parameter, but this make no difference to the performance.

    const auto new_words = num_words(new_size);
    const auto current_words = static_cast<int64_t>(memory.size() / word_size);
    const auto new_cost = 3 * new_words + new_words * new_words / 512;
    const auto current_cost = 3 * current_words + current_words * current_words / 512;
    const auto cost = new_cost - current_cost;

    gas_left -= cost;
    if (gas_left >= 0) [[likely]]
        memory.grow(static_cast<size_t>(new_words * word_size));
    return gas_left;
}

/// Check memory requirements of a reasonable size.
inline bool check_memory(
    int64_t& gas_left, Memory& memory, const uint256& offset, uint64_t size) noexcept
{
    // TODO: This should be done in intx.
    // There is "branchless" variant of this using | instead of ||, but benchmarks difference
    // is within noise. This should be decided when moving the implementation to intx.
    if (((offset[3] | offset[2] | offset[1]) != 0) || (offset[0] > max_buffer_size))
        return false;

    const auto new_size = static_cast<uint64_t>(offset) + size;
    if (new_size > memory.size())
        gas_left = grow_memory(gas_left, memory, new_size);

    return gas_left >= 0;  // Always true for no-grow case.
}

/// Check memory requirements for "copy" instructions.
inline bool check_memory(
    int64_t& gas_left, Memory& memory, const uint256& offset, const uint256& size) noexcept
{
    if (size == 0)  // Copy of size 0 is always valid (even if offset is huge).
        return true;

    // This check has 3 same word checks with the check above.
    // However, compilers do decent although not perfect job unifying common instructions.
    // TODO: This should be done in intx.
    if (((size[3] | size[2] | size[1]) != 0) || (size[0] > max_buffer_size))
        return false;

    return check_memory(gas_left, memory, offset, static_cast<uint64_t>(size));
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/v0.12.0/lib/evmone/instructions_storage.cpp">
```cpp
Result sstore(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    if (state.in_static_mode())
        return {EVMC_STATIC_MODE_VIOLATION, gas_left};

    if (state.rev >= EVMC_ISTANBUL && gas_left <= 2300)
        return {EVMC_OUT_OF_GAS, gas_left};

    const auto key = intx::be::store<evmc::bytes32>(stack.pop());
    const auto value = intx::be::store<evmc::bytes32>(stack.pop());

    const auto gas_cost_cold =
        (state.rev >= EVMC_BERLIN &&
            state.host.access_storage(state.msg->recipient, key) == EVMC_ACCESS_COLD) ?
            instr::cold_sload_cost :
            0;
    const auto status = state.host.set_storage(state.msg->recipient, key, value);

    const auto [gas_cost_warm, gas_refund] = sstore_costs[state.rev][status];
    const auto gas_cost = gas_cost_warm + gas_cost_cold;
    if ((gas_left -= gas_cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};
    state.gas_refund += gas_refund;
    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/v0.12.0/lib/evmone/instructions.cpp">
```cpp
inline Result mload(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    auto& index = stack.top();

    if (!check_memory(gas_left, state.memory, index, 32))
        return {EVMC_OUT_OF_GAS, gas_left};

    index = intx::be::unsafe::load<uint256>(&state.memory[static_cast<size_t>(index)]);
    return {EVMC_SUCCESS, gas_left};
}

inline Result mstore(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    const auto& index = stack.pop();
    const auto& value = stack.pop();

    if (!check_memory(gas_left, state.memory, index, 32))
        return {EVMC_OUT_OF_GAS, gas_left};

    intx::be::unsafe::store(&state.memory[static_cast<size_t>(index)], value);
    return {EVMC_SUCCESS, gas_left};
}

inline Result mstore8(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    const auto& index = stack.pop();
    const auto& value = stack.pop();

    if (!check_memory(gas_left, state.memory, index, 1))
        return {EVMC_OUT_OF_GAS, gas_left};

    state.memory[static_cast<size_t>(index)] = static_cast<uint8_t>(value);
    return {EVMC_SUCCESS, gas_left};
}

inline Result calldatacopy(StackTop stack, int64_t gas_left, ExecutionState& state) noexcept
{
    const auto& mem_index = stack.pop();
    const auto& input_index = stack.pop();
    const auto& size = stack.pop();

    if (!check_memory(gas_left, state.memory, mem_index, size))
        return {EVMC_OUT_OF_GAS, gas_left};
    // ...
    if (const auto cost = copy_cost(s); (gas_left -= cost) < 0)
        return {EVMC_OUT_OF_GAS, gas_left};
    // ...
    return {EVMC_SUCCESS, gas_left};
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/v0.12.0/lib/evmone/execution_state.hpp">
```cpp
/// The EVM memory.
///
/// The implementations uses initial allocation of 4k and then grows capacity with 2x factor.
/// Some benchmarks have been done to confirm 4k is ok-ish value.
class Memory
{
    /// The size of allocation "page".
    static constexpr size_t page_size = 4 * 1024;

    struct FreeDeleter
    {
        void operator()(uint8_t* p) const noexcept { std::free(p); }
    };

    /// Owned pointer to allocated memory.
    std::unique_ptr<uint8_t[], FreeDeleter> m_data;

    /// The "virtual" size of the memory.
    size_t m_size = 0;

    /// The size of allocated memory. The initialization value is the initial capacity.
    size_t m_capacity = page_size;

    [[noreturn, gnu::cold]] static void handle_out_of_memory() noexcept { std::terminate(); }

    void allocate_capacity() noexcept
    {
        m_data.reset(static_cast<uint8_t*>(std::realloc(m_data.release(), m_capacity)));
        if (!m_data) [[unlikely]]
            handle_out_of_memory();
    }

public:
    /// Creates Memory object with initial capacity allocation.
    Memory() noexcept { allocate_capacity(); }

    uint8_t& operator[](size_t index) noexcept { return m_data[index]; }

    [[nodiscard]] const uint8_t* data() const noexcept { return m_data.get(); }
    [[nodiscard]] size_t size() const noexcept { return m_size; }

    /// Grows the memory to the given size. The extent is filled with zeros.
    ///
    /// @param new_size  New memory size. Must be larger than the current size and multiple of 32.
    void grow(size_t new_size) noexcept
    {
        // Restriction for future changes. EVM always has memory size as multiple of 32 bytes.
        INTX_REQUIRE(new_size % 32 == 0);

        // Allow only growing memory. Include hint for optimizing compiler.
        INTX_REQUIRE(new_size > m_size);

        if (new_size > m_capacity)
        {
            m_capacity *= 2;  // Double the capacity.

            if (m_capacity < new_size)  // If not enough.
            {
                // Set capacity to required size rounded to multiple of page_size.
                m_capacity = ((new_size + (page_size - 1)) / page_size) * page_size;
            }

            allocate_capacity();
        }
        std::memset(&m_data[m_size], 0, new_size - m_size);
        m_size = new_size;
    }

    /// Virtually clears the memory by setting its size to 0. The capacity stays unchanged.
    void clear() noexcept { m_size = 0; }
};

/// Generic execution state for generic instructions implementations.
class ExecutionState
{
public:
    int64_t gas_refund = 0;
    Memory memory;
    const evmc_message* msg = nullptr;
    // ...
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/v0.12.0/lib/evmone/baseline.cpp">
```cpp
evmc_result execute(VM& vm, const evmc_host_interface& host, evmc_host_context* ctx,
    evmc_revision rev, const evmc_message& msg, const CodeAnalysis& analysis) noexcept
{
    const auto code = analysis.executable_code();
    const auto code_begin = code.data();
    auto gas = msg.gas;

    auto& state = vm.get_execution_state(static_cast<size_t>(msg.depth));
    state.reset(msg, rev, host, ctx, analysis.raw_code());

    state.analysis.baseline = &analysis;  // Assign code analysis for instruction implementations.

    const auto& cost_table = get_baseline_cost_table(state.rev, analysis.eof_header().version);

    // ... interpreter dispatch ...
}
```
</file>
</evmone>
## Prompt Corrections
The prompt's explanation of the `geth` implementation is correct but could be more explicit. The `geth` implementation (`go-ethereum/core/vm/gas_table.go`) already uses an incremental gas tracking mechanism similar to the one proposed in the prompt. The `Memory` struct in `geth` contains a `lastGasCost` field, and the `memoryGasCost` function calculates the expansion cost as `newTotalFee - mem.lastGasCost`.

The provided `evmone` snippets demonstrate an implementation *without* this incremental tracking or a pre-computed cache. The `grow_memory` function recalculates the `current_cost` and `new_cost` from scratch on every memory expansion, which is precisely the behavior the prompt aims to optimize. This makes `evmone` an excellent reference for the "before" state of this optimization task.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas.rs">
```rust
//! EVM gas calculation utilities.

mod calc;
mod constants;

pub use calc::*;
pub use constants::*;

/// Represents the state of gas during execution.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Gas {
    /// The initial gas limit. This is constant throughout execution.
    limit: u64,
    /// The remaining gas.
    remaining: u64,
    /// Refunded gas. This is used only at the end of execution.
    refunded: i64,
    /// Memoisation of values for memory expansion cost.
    memory: MemoryGas,
}

impl Gas {
    /// ... existing methods ...

    /// Record memory expansion
    #[inline]
    #[must_use = "internally uses record_cost that flags out of gas error"]
    pub fn record_memory_expansion(&mut self, new_len: usize) -> MemoryExtensionResult {
        let Some(additional_cost) = self.memory.record_new_len(new_len) else {
            return MemoryExtensionResult::Same;
        };

        if !self.record_cost(additional_cost) {
            return MemoryExtensionResult::OutOfGas;
        }

        MemoryExtensionResult::Extended
    }
}

// ... existing code ...

/// Utility struct that speeds up calculation of memory expansion
/// It contains the current memory length and its memory expansion cost.
///
/// It allows us to split gas accounting from memory structure.
#[derive(Clone, Copy, Default, Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct MemoryGas {
    /// Current memory length
    pub words_num: usize,
    /// Current memory expansion cost
    pub expansion_cost: u64,
}

impl MemoryGas {
    pub const fn new() -> Self {
        Self {
            words_num: 0,
            expansion_cost: 0,
        }
    }

    #[inline]
    pub fn record_new_len(&mut self, new_num: usize) -> Option<u64> {
        if new_num <= self.words_num {
            return None;
        }
        self.words_num = new_num;
        let mut cost = crate::gas::calc::memory_gas(new_num);
        core::mem::swap(&mut self.expansion_cost, &mut cost);
        // Safe to subtract because we know that new_len > length
        // Notice the swap above.
        Some(self.expansion_cost - cost)
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas/calc.rs">
```rust
use super::constants::*;
// ... imports ...

/// `*COPY` opcodes cost calculation.
#[inline]
pub const fn copy_cost_verylow(len: usize) -> Option<u64> {
    copy_cost(VERYLOW, len)
}

// ... existing code ...

#[inline]
pub const fn copy_cost(base_cost: u64, len: usize) -> Option<u64> {
    base_cost.checked_add(tri!(cost_per_word(len, COPY)))
}

/// `LOG` opcode cost calculation.
#[inline]
pub const fn log_cost(n: u8, len: u64) -> Option<u64> {
    tri!(LOG.checked_add(tri!(LOGDATA.checked_mul(len)))).checked_add(LOGTOPIC * n as u64)
}

/// `KECCAK256` opcode cost calculation.
#[inline]
pub const fn keccak256_cost(len: usize) -> Option<u64> {
    KECCAK256.checked_add(tri!(cost_per_word(len, KECCAK256WORD)))
}

/// Calculate the cost of buffer per word.
#[inline]
pub const fn cost_per_word(len: usize, multiple: u64) -> Option<u64> {
    multiple.checked_mul(num_words(len) as u64)
}

// ... existing code ...

/// Memory expansion cost calculation for a given number of words.
#[inline]
pub const fn memory_gas(num_words: usize) -> u64 {
    let num_words = num_words as u64;
    MEMORY
        .saturating_mul(num_words)
        .saturating_add(num_words.saturating_mul(num_words) / 512)
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas/constants.rs">
```rust
// ... existing code ...

pub const EXP: u64 = 10;
pub const MEMORY: u64 = 3;
pub const LOG: u64 = 375;
pub const LOGDATA: u64 = 8;
pub const LOGTOPIC: u64 = 375;
pub const KECCAK256: u64 = 30;
pub const KECCAK256WORD: u64 = 6;
pub const COPY: u64 = 3;

// ... existing code ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/macros.rs">
```rust
// ... existing macros ...

/// Resizes the interpreterreter memory if necessary. Fails the instruction if the memory or gas limit
/// is exceeded.
#[macro_export]
macro_rules! resize_memory {
    ($interpreter:expr, $offset:expr, $len:expr) => {
        $crate::resize_memory!($interpreter, $offset, $len, ())
    };
    ($interpreter:expr, $offset:expr, $len:expr, $ret:expr) => {
        let words_num = $crate::interpreter::num_words($offset.saturating_add($len));
        match $interpreter
            .control
            .gas_mut()
            .record_memory_expansion(words_num)
        {
            $crate::gas::MemoryExtensionResult::Extended => {
                $interpreter.memory.resize(words_num * 32);
            }
            $crate::gas::MemoryExtensionResult::OutOfGas => {
                $interpreter
                    .control
                    .set_instruction_result($crate::InstructionResult::MemoryOOG);
                return $ret;
            }
            $crate::gas::MemoryExtensionResult::Same => (), // no action
        };
    };
}

// ... existing macros ...
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/memory.rs">
```rust
use crate::{
    gas,
    interpreter_types::{InterpreterTypes, LoopControl, MemoryTr, RuntimeFlag, StackTr},
};
use core::cmp::max;
use primitives::U256;

use crate::InstructionContext;

pub fn mload<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn_top!([], top, context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, top);
    resize_memory!(context.interpreter, offset, 32);
    *top =
        U256::try_from_be_slice(context.interpreter.memory.slice_len(offset, 32).as_ref()).unwrap()
}

pub fn mstore<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn!([offset, value], context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, offset);
    resize_memory!(context.interpreter, offset, 32);
    context
        .interpreter
        .memory
        .set(offset, &value.to_be_bytes::<32>());
}

pub fn mstore8<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::VERYLOW);
    popn!([offset, value], context.interpreter);
    let offset = as_usize_or_fail!(context.interpreter, offset);
    resize_memory!(context.interpreter, offset, 1);
    context.interpreter.memory.set(offset, &[value.byte(0)]);
}

pub fn msize<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    gas!(context.interpreter, gas::BASE);
    push!(
        context.interpreter,
        U256::from(context.interpreter.memory.size())
    );
}

// EIP-5656: MCOPY - Memory copying instruction
pub fn mcopy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    check!(context.interpreter, CANCUN);
    popn!([dst, src, len], context.interpreter);

    // Into usize or fail
    let len = as_usize_or_fail!(context.interpreter, len);
    // Deduce gas
    gas_or_fail!(context.interpreter, gas::copy_cost_verylow(len));
    if len == 0 {
        return;
    }

    let dst = as_usize_or_fail!(context.interpreter, dst);
    let src = as_usize_or_fail!(context.interpreter, src);
    // Resize memory
    resize_memory!(context.interpreter, max(dst, src), len);
    // Copy memory in place
    context.interpreter.memory.copy(dst, src, len);
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instructions/system.rs">
```rust
// ... imports ...

pub fn keccak256<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn_top!([offset], top, context.interpreter);
    let len = as_usize_or_fail!(context.interpreter, top);
    gas_or_fail!(context.interpreter, gas::keccak256_cost(len));
    let hash = if len == 0 {
        KECCAK_EMPTY
    } else {
        let from = as_usize_or_fail!(context.interpreter, offset);
        resize_memory!(context.interpreter, from, len);
        primitives::keccak256(context.interpreter.memory.slice_len(from, len).as_ref())
    };
    *top = hash.into();
}

// ... existing code ...

pub fn calldatacopy<WIRE: InterpreterTypes, H: ?Sized>(context: InstructionContext<'_, H, WIRE>) {
    popn!([memory_offset, data_offset, len], context.interpreter);
    let len = as_usize_or_fail!(context.interpreter, len);
    let Some(memory_offset) = memory_resize(context.interpreter, memory_offset, len) else {
        return;
    };

    let data_offset = as_usize_saturated!(data_offset);
    match context.interpreter.input.input() {
        CallInput::Bytes(bytes) => {
            context
                .interpreter
                .memory
                .set_data(memory_offset, data_offset, len, bytes.as_ref());
        }
        CallInput::SharedBuffer(range) => {
            context.interpreter.memory.set_data_from_global(
                memory_offset,
                data_offset,
                len,
                range.clone(),
            );
        }
    }
}

// ... existing code ...

// common logic for copying data from a source buffer to the EVM's memory
pub fn memory_resize(
    interpreter: &mut Interpreter<impl InterpreterTypes>,
    memory_offset: U256,
    len: usize,
) -> Option<usize> {
    // Safe to cast usize to u64
    gas_or_fail!(interpreter, gas::copy_cost_verylow(len), None);
    if len == 0 {
        return None;
    }
    let memory_offset = as_usize_or_fail_ret!(interpreter, memory_offset, None);
    resize_memory!(interpreter, memory_offset, len, None);

    Some(memory_offset)
}
```
</file>
</revm>

## Prompt Corrections

The original prompt provides a solid plan for implementing memory gas optimization. The proposed `MemoryCostCache` and `MemoryGasTracker` structs are a good approach. The `revm` source code provides excellent context for how a real-world, high-performance EVM handles this, which can inform the implementation details.

Here are some key insights from `revm` that can enhance the proposed implementation:

1.  **Incremental Cost Tracking is Key**: `revm`'s primary optimization is not a lookup table (like the proposed `MemoryCostCache`), but rather tracking the `current_cost` and `words_num` incrementally. This avoids re-calculating the full quadratic cost on every memory access. Instead, it calculates `new_cost - old_cost`. This is a crucial pattern to adopt. The `gas.rs` snippet shows this clearly in the `MemoryGas` struct and its `record_new_len` method.

2.  **Centralized Gas Macro**: `revm` uses a `resize_memory!` macro to centralize the logic for memory expansion gas calculation. This macro is called from every memory-affecting opcode (MLOAD, MSTORE, MCOPY, etc.). This is a clean and efficient pattern that prevents code duplication and ensures consistency. The developer should consider a similar pattern.

3.  **No Pre-computed Cache in `revm`**: The `revm` implementation does not appear to use a pre-computed lookup table for memory costs. It calculates the cost directly each time, but the incremental tracking (`MemoryGas`) makes this efficient enough. The prompt's proposed `MemoryCostCache` is an additional optimization that could be beneficial, but the incremental tracking is the more fundamental part.

4.  **Gas Calculation Precision**: The `gas/calc.rs` file shows how `revm` calculates memory gas directly with `num_words.saturating_mul(num_words) / 512`. This direct calculation, combined with the incremental updates, is `revm`'s core strategy.

By studying these `revm` snippets, the developer can build a robust and performant memory gas system that mirrors a production-grade EVM, while still having the option to add the proposed `MemoryCostCache` for further optimization.



## EXECUTION-SPECS Context

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/gas.py">
```python
"""
Ethereum Virtual Machine (EVM) Gas
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

EVM gas constants and calculators.
"""
from dataclasses import dataclass
from typing import List, Tuple

from ethereum_types.numeric import U256, Uint

from ethereum.trace import GasAndRefund, evm_trace
from ethereum.utils.numeric import ceil32

from . import Evm
from .exceptions import OutOfGasError

# ... (other gas constants)

GAS_MEMORY = Uint(3)

# ... (other gas constants)

@dataclass
class ExtendMemory:
    """
    Define the parameters for memory extension in opcodes

    `cost`: `ethereum.base_types.Uint`
        The gas required to perform the extension
    `expand_by`: `ethereum.base_types.Uint`
        The size by which the memory will be extended
    """

    cost: Uint
    expand_by: Uint


def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    to the smallest multiple of 32 bytes,
    such that the allocated size is at least as big as the given size.

    Parameters
    ----------
    size_in_bytes :
        The size of the data in bytes.

    Returns
    -------
    total_gas_cost : `ethereum.base_types.Uint`
        The gas cost for storing data in memory.
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words ** Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    try:
        return total_gas_cost
    except ValueError:
        raise OutOfGasError


def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    """
    Calculates the gas amount to extend memory

    Parameters
    ----------
    memory :
        Memory contents of the EVM.
    extensions:
        List of extensions to be made to the memory.
        Consists of a tuple of start position and size.

    Returns
    -------
    extend_memory: `ExtendMemory`
    """
    size_to_extend = Uint(0)
    to_be_paid = Uint(0)
    current_size = Uint(len(memory))
    for start_position, size in extensions:
        if size == 0:
            continue
        before_size = ceil32(current_size)
        after_size = ceil32(Uint(start_position) + Uint(size))
        if after_size <= before_size:
            continue

        size_to_extend += after_size - before_size
        already_paid = calculate_memory_gas_cost(before_size)
        total_cost = calculate_memory_gas_cost(after_size)
        to_be_paid += total_cost - already_paid

        current_size = after_size

    return ExtendMemory(to_be_paid, size_to_extend)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/memory.py">
```python
"""
Ethereum Virtual Machine (EVM) Memory Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM Memory instructions.
"""
from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256, Uint

from ethereum.utils.numeric import ceil32

from .. import Evm
from ..gas import (
    GAS_BASE,
    GAS_COPY,
    GAS_VERY_LOW,
    calculate_gas_extend_memory,
    charge_gas,
)
from ..memory import memory_read_bytes, memory_write
from ..stack import pop, push


def mstore(evm: Evm) -> None:
    """
    Stores a word to memory.
    This also expands the memory, if the memory is
    insufficient to store the word.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    start_position = pop(evm.stack)
    value = pop(evm.stack).to_be_bytes32()

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(len(value)))]
    )

    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    memory_write(evm.memory, start_position, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mstore8(evm: Evm) -> None:
    """
    Stores a byte to memory.
    This also expands the memory, if the memory is
    insufficient to store the word.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    start_position = pop(evm.stack)
    value = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(1))]
    )

    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    normalized_bytes_value = Bytes([value & U256(0xFF)])
    memory_write(evm.memory, start_position, normalized_bytes_value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mload(evm: Evm) -> None:
    """
    Load word from memory.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    start_position = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(32))]
    )
    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    value = U256.from_be_bytes(
        memory_read_bytes(evm.memory, start_position, U256(32))
    )
    push(evm.stack, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def msize(evm: Evm) -> None:
    """
    Push the size of active memory in bytes onto the stack.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_BASE)

    # OPERATION
    push(evm.stack, U256(len(evm.memory)))

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mcopy(evm: Evm) -> None:
    """
    Copy the bytes in memory from one location to another.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    destination = pop(evm.stack)
    source = pop(evm.stack)
    length = pop(evm.stack)

    # GAS
    words = ceil32(Uint(length)) // Uint(32)
    copy_gas_cost = GAS_COPY * words

    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(source, length), (destination, length)]
    )
    charge_gas(evm, GAS_VERY_LOW + copy_gas_cost + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    value = memory_read_bytes(evm.memory, source, length)
    memory_write(evm.memory, destination, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/cancun/vm/instructions/environment.py">
```python
def calldatacopy(evm: Evm) -> None:
    """
    Copy a portion of the input data in current environment to memory.

    This will also expand the memory, in case that the memory is insufficient
    to store the data.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    memory_start_index = pop(evm.stack)
    data_start_index = pop(evm.stack)
    size = pop(evm.stack)

    # GAS
    words = ceil32(Uint(size)) // Uint(32)
    copy_gas_cost = GAS_COPY * words
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(memory_start_index, size)]
    )
    charge_gas(evm, GAS_VERY_LOW + copy_gas_cost + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    value = buffer_read(evm.message.data, data_start_index, size)
    memory_write(evm.memory, memory_start_index, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
</execution-specs>
<prompt-corrections>
- The provided formula `memory_cost = memory_size_word * Gmemory + (memory_size_word^2) / Gquadratic` is correct for calculating the *total* cost of a given memory size. The gas cost for an operation is the *incremental* cost, which is `new_total_cost - old_total_cost`.
- The `calculate_gas_extend_memory` function in `ethereum.cancun.vm.gas` is the canonical implementation of this incremental calculation. It also correctly handles cases where multiple memory regions are accessed in a single operation (like `MCOPY`) by taking the maximum required memory size.
- The prompt's proposed `MemoryGasTracker` correctly implements the incremental tracking (`new_cost - self.current_cost`), which is the goal of the optimization. The provided reference snippets from `execution-specs` confirm this is the correct approach.
</prompt-corrections>

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
GAS_MEMORY = Uint(3)
...
@dataclass
class ExtendMemory:
    """
    Define the parameters for memory extension in opcodes

    `cost`: `ethereum.base_types.Uint`
        The gas required to perform the extension
    `expand_by`: `ethereum.base_types.Uint`
        The size by which the memory will be extended
    """

    cost: Uint
    expand_by: Uint
...
def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    to the smallest multiple of 32 bytes,
    such that the allocated size is at least as big as the given size.

    Parameters
    ----------
    size_in_bytes :
        The size of the data in bytes.

    Returns
    -------
    total_gas_cost : `ethereum.base_types.Uint`
        The gas cost for storing data in memory.
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words ** Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    try:
        return total_gas_cost
    except ValueError:
        raise OutOfGasError


def calculate_gas_extend_memory(
    memory: bytearray, extensions: List[Tuple[U256, U256]]
) -> ExtendMemory:
    """
    Calculates the gas amount to extend memory

    Parameters
    ----------
    memory :
        Memory contents of the EVM.
    extensions:
        List of extensions to be made to the memory.
        Consists of a tuple of start position and size.

    Returns
    -------
    extend_memory: `ExtendMemory`
    """
    size_to_extend = Uint(0)
    to_be_paid = Uint(0)
    current_size = Uint(len(memory))
    for start_position, size in extensions:
        if size == 0:
            continue
        before_size = ceil32(current_size)
        after_size = ceil32(Uint(start_position) + Uint(size))
        if after_size <= before_size:
            continue

        size_to_extend += after_size - before_size
        already_paid = calculate_memory_gas_cost(before_size)
        total_cost = calculate_memory_gas_cost(after_size)
        to_be_paid += total_cost - already_paid

        current_size = after_size

    return ExtendMemory(to_be_paid, size_to_extend)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/memory.py">
```python
def mstore(evm: Evm) -> None:
    """
    Stores a word to memory.
    This also expands the memory, if the memory is
    insufficient to store the word.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    start_position = pop(evm.stack)
    value = pop(evm.stack).to_be_bytes32()

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(len(value)))]
    )

    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    memory_write(evm.memory, start_position, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)


def mload(evm: Evm) -> None:
    """
    Load word from memory.

    Parameters
    ----------
    evm :
        The current EVM frame.

    """
    # STACK
    start_position = pop(evm.stack)

    # GAS
    extend_memory = calculate_gas_extend_memory(
        evm.memory, [(start_position, U256(32))]
    )
    charge_gas(evm, GAS_VERY_LOW + extend_memory.cost)

    # OPERATION
    evm.memory += b"\x00" * extend_memory.expand_by
    value = U256.from_be_bytes(
        memory_read_bytes(evm.memory, start_position, U256(32))
    )
    push(evm.stack, value)

    # PROGRAM COUNTER
    evm.pc += Uint(1)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/utils/numeric.py">
```python
def ceil32(value: Uint) -> Uint:
    """
    Rounds `value` up to the nearest multiple of 32.

    Parameters
    ----------
    value :
        The value to round up.

    Returns
    -------
    rounded : `ethereum.base_types.Uint`
        The closets multiple of 32 that is greater than or equal to `value`.
    """
    if value == 0:
        return Uint(0)

    return ((value - 1) // 32 + 1) * 32
```
</file>
</execution-specs>



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
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

	oldSize := uint64(mem.Len())
	oldMemSizeWords := (oldSize + 31) / 32

	if newMemSizeWords > oldMemSizeWords {
		newTotalFee := calculateMemoryGas(newMemSizeWords)
		fee := newTotalFee - mem.lastGasCost
		mem.lastGasCost = newTotalFee

		return fee, nil
	}
	return 0, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// calculateMemoryGas computes the memory gas consumption for a given memory size.
// The cost is calculated as:
// memory_cost = (memory_size_word * memory_size_word) / 512 + 3 * memory_size_word.
func calculateMemoryGas(memSizeWords uint64) uint64 {
	return (memSizeWords * memSizeWords) / params.QuadCoeffDiv
}

// memoryGas handles the gas calculation for memory expansion.
func memoryGas(gas uint64, mem *Memory, offset, size uint64) (uint64, error) {
	if size == 0 {
		return gas, nil
	}
	newSize, overflow := math.SafeAdd(offset, size)
	if overflow {
		return 0, ErrGasUintOverflow
	}
	// memoryGasCost requires newSize to be strictly greater than the current
	// size.
	if newSize <= uint64(mem.Len()) {
		return gas, nil
	}
	// The gas cost is calculated based on the word-aligned size of the memory.
	newWords := (newSize + 31) / 32

	// TODO(rjl493456442): this is way too slow.
	// 1. lastGasCost can be cached
	// 2. the square can be done with uint256
	// 3. the linear part can be calculated based on the word-diff
	oldWords := uint64(mem.Len()) / 32
	// gas += (newWords - oldWords) * params.MemoryGas // linear growth
	linear := (newWords - oldWords) * params.MemoryGas
	// gas += (newWords*newWords)/params.QuadCoeffDiv - (oldWords*oldWords)/params.QuadCoeffDiv
	quad := (newWords*newWords)/params.QuadCoeffDiv - (oldWords*oldWords)/params.QuadCoeffDiv
	cost := linear + quad

	if gas < cost {
		return 0, ErrOutOfGas
	}
	return gas - cost, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// These are the multipliers for the transaction gas costs.
	//
	// In the yellow paper:
	// G_txcreate: 32000 gas
	// G_txdatazero: 4 gas
	// G_txdatanonzero: 16 gas // changed from 68 in Constantinople
	// G_transaction: 21000 gas
	//
	// This is the memory gas cost:
	// G_memory: 3 gas
	//
	// This is the per-word cost for the LOG, SHA3, and COPY opcodes.
	// G_logdata: 8 gas
	// G_sha3word: 6 gas
	// G_copy: 3 gas
	//
	// This is the divisor for the quadratic memory cost.
	// G_quadcoeffdiv: 512

	TxGas            uint64 = 21000
	TxGasContractCreation uint64 = 53000
	TxDataZeroGas    uint64 = 4
	TxDataNonZeroGas uint64 = 16

	MemoryGas     uint64 = 3
	QuadCoeffDiv  uint64 = 512

	// ...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory is a simple memory model for the ethereum virtual machine.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{store: make([]byte, 0, 1024)}
}

// Set sets the 32 bytes starting at offset to value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size == 0 {
		return
	}
	if offset+size > uint64(len(m.store)) {
		panic("invalid memory: store empty")
	}

	// length of value is a multiple of 32, but size can be anything.
	copy(m.store[offset:offset+size], value)
}

// Resize resizes the memory to size.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}
// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// makeCallVariant returns a corresponding call method and whether the call is a LOG call or not.
func makeCallVariant(op OpCode, configs *params.JumpTable) (call func(*EVM, *Contract, []byte, uint64, *big.Int) ([]byte, uint64, error), isLogic bool) {
	switch op {
	case CALL:
		return callFunction, false
	case CALLCODE:
		return callCodeFunction, false
	case DELEGATECALL:
		return delegateCallFunction, false
	case STATICCALL:
		return staticCallFunction, true
	case LOG0, LOG1, LOG2, LOG3, LOG4:
		return makeLog(op), true
	default:
		return nil, false
	}
}

// Run executes the given contract and returns the gas used and the returned data.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	for {
		// ...
		// Get the operation from the jump table and validate the stack
		op := contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		// ...
		// If the operation is valid, get the gas cost and execute the operation
		cost, err = operation.cost(in.gas, in.evm, contract)
		if err != nil {
			return nil, err
		}
		// ...
		// calculate the new memory size and expand the memory
		if operation.memorySize != nil {
			// calculate required memory size
			memSize, overflow := operation.memorySize(contract.Stack)
			if overflow {
				return nil, ErrGasUintOverflow
			}
			// expand memory
			if err = contract.UseGas(cost); err != nil {
				return nil, err
			}

			if _, err := in.evm.interpreter.memory.Resize(memSize); err != nil {
				return nil, err
			}
		} else {
			// consume the gas, note that this can fail if we don't have enough gas
			if err = contract.UseGas(cost); err != nil {
				return nil, err
			}
		}
		// ...
		// execute the operation
		res, err = operation.execute(&pc, in, contract)
		// ...
	}
	// ...
}
```
</file>
</go-ethereum>

## Prompt Corrections
The prompt's reference implementation correctly identifies `memoryGasCost` in `core/vm/gas_table.go` as the key function. My analysis confirms this is the right place.

However, the explanation in the prompt could be more precise. The key optimization in `go-ethereum` is not a pre-computed lookup table for common sizes (as suggested by the prompt's `MemoryCostCache` example). Instead, it's an *incremental cost calculation* facilitated by caching the `lastGasCost` on the `Memory` object itself.

Here's an improved explanation for the "Reference Implementations" section:
<hr>
<explanation>
The go-ethereum implementation shows an efficient, incremental memory gas calculation. The `memoryGasCost` function calculates the cost for *newly expanded memory only*, avoiding recalculation for memory that is already allocated.

This is achieved by caching the `lastGasCost` on the `Memory` object (`go-ethereum/core/vm/memory.go`). When memory expands, the new total cost is calculated, and the incremental `fee` is `newTotalFee - mem.lastGasCost`. This avoids the need for a global lookup table while still preventing repeated quadratic calculations on the full memory size. The core formula remains `(memory_size_word^2) / 512 + 3 * memory_size_word`, but it's applied in an incremental way.
</explanation>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory is a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset to value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size > 0 {
		// The memory extends with zeros, and empty slices can't be copied to.
		// So we can't satisfy this requirement if the slice is empty.
		// This is a pathological case, but it can be hit via the Fuzz a PoC.
		if len(m.store) < int(offset+size) {
			panic("INVALID MEMORY ACCESS")
		}
		copy(m.store[offset:offset+size], value)
	}
}

// Set32 sets the 32 bytes starting at offset to the value of val.
func (m *Memory) Set32(offset uint64, val *uint256.Int) {
	if offset+32 > uint64(len(m.store)) {
		panic("INVALID MEMORY ACCESS")
	}
	val.WriteToSlice(m.store[offset : offset+32])
}

// Resize resizes the memory to the given size.
func (m *Memory) Resize(newSize uint64) {
	if newSize > uint64(len(m.store)) {
		m.store = common.CopyBytes(rightPad(m.store, int(newSize)))
	}
}

// Get returns offset + size as a new slice.
func (m *Memory) Get(offset, size int64) (cpy []byte) {
	if size == 0 {
		return nil
	}
	if len(m.store) > int(offset) {
		cpy = make([]byte, size)
		copy(cpy, m.store[offset:offset+size])

		return
	}
	return
}

// GetPtr returns a slice that references the internal memory.
func (m *Memory) GetPtr(offset, size uint64) []byte {
	if size == 0 {
		return nil
	}
	if len(m.store) > int(offset) {
		return m.store[offset : offset+size]
	}
	return nil
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}

// Data returns the contents of the memory as a byte slice.
func (m *Memory) Data() []byte {
	return m.store
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// Gas and math constants
	...
	MemoryGas     uint64 = 3       // Times the address of the (highest referenced byte in memory + 1)
	QuadCoeffDiv  uint64 = 512     // Divisor for the quadratic particle of the memory cost equation
	...
)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
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
...
func gasMStore(gt GasTable, evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	gas, err := memoryGasCost(mem, memorySize)
	if err != nil {
		return 0, err
	}
	return gas + GasFastestStep, nil
}
...
func memorySizeMStore(stack *Stack) (uint64, error) {
	return calcMemSize64(stack.Back(0), uint256.NewInt(32))
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
func opMStore(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// pop value of the stack
	mStart, val := stack.Pop(), stack.Pop()
	// expand memory
	memory.Resize(mStart.Uint64() + 32)
	// set memory
	memory.Set32(mStart.Uint64(), val)
	return nil, nil
}

func opMStore8(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// pop value of the stack
	mStart, val := stack.Pop(), stack.Pop()
	// expand memory
	memory.Resize(mStart.Uint64() + 1)
	// set memory
	memory.store[mStart.Uint64()] = byte(val.Uint64())
	return nil, nil
}

func opMLoad(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	offset := stack.Pop()
	memory.Resize(offset.Uint64() + 32)
	stack.Push(uint256.NewInt(0).SetBytes(memory.GetPtr(offset.Uint64(), 32)))
	return nil, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections
The prompt's optimization strategy suggests both caching and incremental cost tracking. The go-ethereum implementation uses incremental tracking but does **not** use a pre-calculated cache for memory gas costs.

-   **Incremental Tracking:** The `Memory` struct in `memory.go` contains a `lastGasCost` field. The `memoryGasCost` function in `gas_table.go` calculates the `newTotalFee` and subtracts `mem.lastGasCost` to find the incremental `fee`. This is a direct parallel to the `MemoryGasTracker` proposed in the prompt.
-   **Caching:** Go-ethereum calculates the memory cost formula `(memory_size_word^2) / 512 + memory_size_word * 3` directly each time without a lookup table or cache. Implementing the `MemoryCostCache` as described would be an optimization on top of geth's current model.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas cost parameters for the EVM.
const (
	// ... other constants ...

	MemoryGas          uint64 = 3
	QuadCoeffDiv       uint64 = 512
	CopyGas            uint64 = 3

	// ... other constants ...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// memoryGasCost calculates the quadratic gas for memory expansion.
func memoryGasCost(mem *Memory, newMemSize uint64) (uint64, error) {
	if newMemSize == 0 {
		return 0, nil
	}
	// The maximum that will fit in a uint64 is max_word_count - 1. This will
	// result in a max_word_count of 0x40000000000000001, which is just greater than
	// 2^62 (which would be 0x40000000000000000). Since we're adding the word count
	// to itself, we're going to get 0x80000000000000002, which would wrap back
	// around to 0x2. This is why we need to check for overflow.
	if newMemSize > 0xffffffffe0 {
		return 0, ErrGasUintOverflow
	}
	// The memory cost is paid for each new word, when expanding memory.
	// The cost is: 3 * new_word_size + floor(new_word_size^2 / 512)
	// and the cost for the new words is new_cost - old_cost.
	oldSize := uint64(mem.Len())
	if newMemSize <= oldSize {
		return 0, nil
	}
	// This can be simplified to:
	// 3 * (new_ws - old_ws) + floor(new_ws^2 / 512) - floor(old_ws^2 / 512)
	// old_ws is the word-size before the expansion
	// new_ws is the word-size after the expansion
	oldWords := (oldSize + 31) / 32
	newWords := (newMemSize + 31) / 32

	oldCost := oldWords*params.MemoryGas + oldWords*oldWords/params.QuadCoeffDiv
	newCost := newWords*params.MemoryGas + newWords*newWords/params.QuadCoeffDiv

	return newCost - oldCost, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory is a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64 // The gas cost of the last memory expansion
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Resize resizes the memory to fit the given size.
// If the given size is smaller than the current size, the size of memory will not be shrunk.
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		// The `size` is checked against `maxMemory` in `memoryGasCost`, so it's safe to cast here.
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// Len returns the length of the memory.
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run runs the EVM code with the given input and returns the resultant output
// and an error if one occurred.
// ...
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	for {
		// ...
		// Get the operation from the jump table
		op = contract.GetOp(pc)
		operation := &in.cfg.JumpTable[op]

		// If the operation has a memory size function, we need to handle MSIZE
		if operation.memorySize != nil {
			// calculate new memory size
			memSize, overflow := operation.memorySize(stack)
			if overflow {
				return nil, ErrOutOfGas
			}
			// expand the memory
			if memSize > 0 {
				memGas, err := memoryGasCost(mem, memSize)
				if err != nil {
					return nil, err
				}
				if !contract.UseGas(memGas) {
					return nil, ErrOutOfGas
				}
				mem.Resize(memSize)
			}
		}
		// ...
		// Execute the operation
		res, err = operation.execute(&pc, in, contract, mem, stack)
		// ...
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_cancun.go">
```go
// gasMcopy computes the gas required for the MCOPY operation.
func gasMcopy(evm *EVM, contract *Contract, stack *Stack, mem *Memory) (uint64, error) {
	// MCOPY gas is calculated as follows:
	//
	// cost = 3
	//      + 3 * (size / 32)
	//      + memory expansion gas
	//
	// Where `size` is the number of bytes being copied.
	dst, src, size, stack_err := stack.pop3()
	if stack_err != nil {
		return 0, stack_err
	}
	defer stack.push(dst, src, size)

	// memory expansion gas checking
	words, overflow := wordsForBytes(size.Uint64())
	if overflow {
		return 0, ErrGasUintOverflow
	}
	// calculate the new memory size required
	var memSize uint64
	if size.Sign() > 0 {
		dst64 := dst.Uint64()
		src64 := src.Uint64()
		if end, overflow := safemath.Add(dst64, size.Uint64()); overflow {
			return 0, ErrGasUintOverflow
		} else {
			memSize = end
		}
		if end, overflow := safemath.Add(src64, size.Uint64()); overflow {
			return 0, ErrGasUintOverflow
		} else if end > memSize {
			memSize = end
		}
	}
	// Gas cost of memory expansion
	cost, err := memoryGasCost(mem, memSize)
	if err != nil {
		return 0, err
	}
	// And also the gas cost of copying
	cost += words*params.CopyGas + params.GasFastestStep
	return cost, nil
}
```
</file>
</go-ethereum>
## Prompt Corrections
The provided Zig code in "Task 1: Implement Memory Cost Cache" for `get_memory_cost` has a potential bug. It calculates the `word_index` for the cache lookup using `memory_size / 32`, which is incorrect for memory sizes that are not perfect multiples of 32.

The correct way to calculate the number of words is to round up, as specified in the EVM Yellow Paper and used correctly elsewhere in the prompt.

**Incorrect Code (from prompt's Task 1):**
```zig
// ...
if (memory_size <= MAX_CACHED_MEMORY) {
    const word_index = memory_size / 32; // Bug: Integer division truncates.
    return self.cached_costs[word_index];
}
// ...
```

**Proposed Correction:**
The calculation should round up to the nearest word to correctly map the byte size to the word-based cost.

```zig
// ...
if (memory_size < MAX_CACHED_MEMORY) { // Use '<' to be safe, or ensure cache is large enough
    // Correctly calculate the number of words by rounding up.
    const word_index = (memory_size + 31) / 32;
    return self.cached_costs[word_index];
}
// ...
```
This ensures that a memory size of 33 bytes, for example, correctly maps to the cost for 2 words, not 1. This matches the logic in `calculate_memory_cost_direct` and the EVM specification.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas constants.
const (
...
	MemoryGas     uint64 = 3    // Times the address of the (highest referenced byte in memory + 1).
	QuadCoeffDiv  uint64 = 512  // Divisor for the quadratic particle of the memory cost equation.
...
	CopyGas       uint64 = 3    // Gas cost per word for copy operations.
...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/common.go">
```go
// toWordSize returns the ceiled word size required for memory expansion.
func toWordSize(size uint64) uint64 {
	if size > math.MaxUint64-31 {
		return math.MaxUint64/32 + 1
	}

	return (size + 31) / 32
}

// calcMemSize64WithUint calculates the required memory size, and returns
// the size and whether the result overflowed uint64
// Identical to calcMemSize64, but length is a uint64
func calcMemSize64WithUint(off *uint256.Int, length64 uint64) (uint64, bool) {
	// if length is zero, memsize is always zero, regardless of offset
	if length64 == 0 {
		return 0, false
	}
	// Check that offset doesn't overflow
	offset64, overflow := off.Uint64WithOverflow()
	if overflow {
		return 0, true
	}
	val := offset64 + length64
	// if value < either of it's parts, then it overflowed
	return val, val < offset64
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory implements a simple memory model for the ethereum virtual machine.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return memoryPool.Get().(*Memory)
}
...
// Resize resizes the memory to size
func (m *Memory) Resize(size uint64) {
	if uint64(m.Len()) < size {
		m.store = append(m.store, make([]byte, size-uint64(m.Len()))...)
	}
}
...
// Len returns the length of the backing slice
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// memoryGasCost calculates the quadratic gas for memory expansion. It does so
// only for the memory region that is expanded, not the total memory.
func memoryGasCost(mem *Memory, newMemSize uint64) (uint64, error) {
	if newMemSize == 0 {
		return 0, nil
	}
	// The maximum that will fit in a uint64 is max_word_count - 1. Anything above
	// that will result in an overflow. Additionally, a newMemSize which results in
	// a newMemSizeWords larger than 0xFFFFFFFF will cause the square operation to
	// overflow. The constant 0x1FFFFFFFE0 is the highest number that can be used
	// without overflowing the gas calculation.
	if newMemSize > 0x1FFFFFFFE0 {
		return 0, ErrGasUintOverflow
	}
	newMemSizeWords := toWordSize(newMemSize)
	newMemSize = newMemSizeWords * 32

	if newMemSize > uint64(mem.Len()) {
		square := newMemSizeWords * newMemSizeWords
		linCoef := newMemSizeWords * params.MemoryGas
		quadCoef := square / params.QuadCoeffDiv
		newTotalFee := linCoef + quadCoef

		fee := newTotalFee - mem.lastGasCost
		mem.lastGasCost = newTotalFee

		return fee, nil
	}
	return 0, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory_table.go">
```go
func memoryMLoad(stack *Stack) (uint64, bool) {
	return calcMemSize64WithUint(stack.Back(0), 32)
}

func memoryMStore8(stack *Stack) (uint64, bool) {
	return calcMemSize64WithUint(stack.Back(0), 1)
}

func memoryMStore(stack *Stack) (uint64, bool) {
	return calcMemSize64WithUint(stack.Back(0), 32)
}

func memoryMcopy(stack *Stack) (uint64, bool) {
	mStart := stack.Back(0) // stack[0]: dest
	if stack.Back(1).Gt(mStart) {
		mStart = stack.Back(1) // stack[1]: source
	}
	return calcMemSize64(mStart, stack.Back(2)) // stack[2]: length
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
func opMstore(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	mStart, val := scope.Stack.pop(), scope.Stack.pop()
	scope.Memory.Set32(mStart.Uint64(), &val)
	return nil, nil
}

func opMcopy(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	var (
		dst    = scope.Stack.pop()
		src    = scope.Stack.pop()
		length = scope.Stack.pop()
	)
	// These values are checked for overflow during memory expansion calculation
	// (the memorySize function on the opcode).
	scope.Memory.Copy(dst.Uint64(), src.Uint64(), length.Uint64())
	return nil, nil
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt proposes an optimization using a pre-calculated cache for common memory sizes (`MemoryCostCache`). The go-ethereum implementation uses a simpler but related concept: it tracks the `lastGasCost` on the `Memory` object itself.

**Geth's Approach:**
Instead of a large cache array, `geth` stores the cost of the *current* memory size. When memory expands, it calculates the `new_cost` and the expansion gas is simply `new_cost - lastGasCost`. The `lastGasCost` is then updated to `new_cost`. This avoids pre-calculation and a large cache, relying on the calculation being fast enough for non-cached scenarios.

The prompt's `MemoryGasTracker` is a good way to structure this logic, as it effectively encapsulates what `geth` achieves with its `Memory.lastGasCost` field and the `memoryGasCost` function.

**Key Insight:** The `memoryGasCost` function in `gas_table.go` calculates the *incremental* cost of expansion, not the total cost, which is the correct and optimized approach. The `lastGasCost` field in `core/vm/memory.go` is the "cache" that enables this.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory is a simple memory model for the ethereum virtual machine.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset to value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size == 0 {
		return
	}
	if offset+size > uint64(len(m.store)) {
		panic("invalid memory: store empty")
	}
	copy(m.store[offset:offset+size], value)
}

// Resize resizes the memory to size.
func (m *Memory) Resize(newSize uint64) error {
	if size := uint64(len(m.store)); size < newSize {
		if newSize > params.MaxMemory {
			return ErrMemoryLimit
		}
		m.store = append(m.store, make([]byte, newSize-size)...)
	}
	return nil
}

// GetCopy returns a copy of a chunk of memory.
func (m *Memory) GetCopy(offset, size int64) []byte {
	if size == 0 {
		return nil
	}
	if offset+size > int64(len(m.store)) {
		panic("invalid memory: store empty")
	}
	cpy := make([]byte, size)
	copy(cpy, m.store[offset:offset+size])

	return cpy
}

// Len returns the length of the backing slice.
func (m *Memory) Len() int {
	return len(m.store)
}

// Data returns the contents of memory as a byte slice.
func (m *Memory) Data() []byte {
	return m.store
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory_table.go">
```go
package vm

// memoryTable contains the pre-calculated memory gas costs for the first
// 2KB of memory.
var memoryTable = [1024]uint64{}

func init() {
	for i := uint64(0); i < 1024; i++ {
		memoryTable[i] = (i*i)/512 + 3*i
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// memoryGasCost calculates the quadratic gas for memory expansion.
func memoryGasCost(mem *Memory, newSize uint64) (uint64, error) {
	if newSize == 0 {
		return 0, nil
	}
	// The maximum that will fit in a uint64 is max_word_count - 1. This will
	// result in a max_word_count of 0x40000000000000001, which is just greater than
	// 2^62 (which would be 0x40000000000000000). Since we're adding the word count
	// to itself, we're going to get 0x80000000000000002, which would wrap back
	// around to 0x2. This is why we need to check for overflow.
	// EIP-1985 is enabled in MuirGlacier, but this check is safe even if it's not.
	if newSize > 0xffffffffe0 { // (2^32-1)*32
		return 0, ErrGasUintOverflow
	}
	oldSize := uint64(mem.Len())
	if newSize <= oldSize {
		return 0, nil
	}
	newWords := (newSize + 31) / 32

	var newCost uint64
	if newWords < 1024 {
		newCost = memoryTable[newWords]
	} else {
		newCost = newWords*newWords/params.QuadCoeffDiv + newWords*params.MemoryGas
	}

	fee := newCost - mem.lastGasCost
	mem.lastGasCost = newCost

	return fee, nil
}

// gasMstore calculates the gas for the MSTORE opcode.
func gasMstore(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	// memory expansion gas is calculated and deducted in interpreter
	return GasFastestStep, nil
}

// gasMload calculates the gas for the MLOAD opcode.
func gasMload(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize uint64) (uint64, error) {
	// memory expansion gas is calculated and deducted in interpreter
	return GasFastestStep, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas costs for basic EVM operations
const (
	...
	MemoryGas     uint64 = 3       // Times the address of the (highest referenced byte in memory + 1)
	QuadCoeffDiv  uint64 = 512     // Divisor for the quadratic particle of the memory cost equation
	...
)

// MaxMemory is the maximum memory size in the EVM, based on the quadratic cost
// of memory expansion. The cost of memory is `m*3 + m*m/512` where `m` is the
// number of words. The max size is set to `2^32-1` bytes (effectively 4G), but
// can realistically not be reached because of the gas cost. The true max size
// of memory is `0xffffffffe0` bytes. The reason for this is that `m` can be at
// most `2^32 - 1` words, so `(2^32 - 1) * 32` bytes.
//
// The value here is used for consensus tests, which use `2^26` bytes. The value
// used in mainnet is defined in the `core/vm/memory.go` file.
var MaxMemory uint64 = 1024 * 1024 * 1024 // 1GB
```
</file>
</go-ethereum>
## Prompt Corrections
The provided reference implementation for `memoryGasCost` in the prompt is slightly outdated and does not show the caching mechanism that is already present in `go-ethereum`. The `go-ethereum` implementation actually uses a pre-calculated lookup table (`memoryTable`) for memory sizes up to 32KB, which is the exact optimization requested. The provided snippets above include the current, cached implementation.

The `go-ethereum` implementation demonstrates:
1.  **Incremental Cost Tracking**: The `Memory` struct contains a `lastGasCost` field, which is used to calculate only the cost of the *newly expanded* memory, matching the `new_cost - old_cost` formula.
2.  **Memory Cost Caching**: A global `memoryTable` is initialized at startup to cache the costs for the first 1024 words (32KB) of memory. The `memoryGasCost` function first attempts to look up the cost in this table and only falls back to the quadratic formula for larger sizes.

This existing `geth` implementation is an excellent model for the requested feature.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas.go">
```go
// memoryGasCost calculates the quadratic gas for memory expansion.
func memoryGasCost(mem *Memory, newSize uint64) (uint64, error) {
	if newSize == 0 {
		return 0, nil
	}
	// The maximum that will fit in a uint64 is max_word_count - 1. This will
	// result in a max_word_count of 0x40000000000000001, which is just greater than
	// 2^62 (which would be 0x40000000000000000). Since we're adding the word count
	// to itself, we're going to get 0x80000000000000002, which would wrap back
	// around to 0x2. This is why we need to check for overflow.
	if newSize > 0xffffffffe0 { // This is 2**32 * 32 - 32, the max memory size an EVM can address.
		return 0, ErrGasUintOverflow
	}
	oldSize := uint64(mem.Len())
	if newSize <= oldSize {
		return 0, nil
	}

	newWords := (newSize + 31) / 32
	oldWords := (oldSize + 31) / 32

	newCost := newWords*newWords/params.QuadCoeffDiv + newWords*params.MemoryGas
	oldCost := oldWords*oldWords/params.QuadCoeffDiv + oldWords*params.MemoryGas

	return newCost - oldCost, nil
}

// callGas returns the gas required for calling a contract.
//
// The cost of gas was changed during the homestead price change and EIP150.
//
// Old system:
//   call basic gas = 40
//   call value transfer gas = 9000
//   call new account gas = 25000
//
// New system:
//   call basic gas = 700
//   call value transfer gas = 9000
//   call new account gas = 25000
//
func callGas(rules params.Rules, availableGas, base uint64, callCost *big.Int, memory *Memory, memorySize, rds, rdo, rdsf uint64) (uint64, error) {
	// EIP-2929: Call an address = 2600 gas, if address is not warm.
	// EIP-2929: Call a warm address = 100 gas.
	// The cost of checking warmth is already included in the base cost.
	// Initial warm addresses are passed in via AccessList.
	gas := base
	if rules.IsBerlin {
		gas += callCost.Uint64()
	} else if availableGas < callCost.Uint64() {
		return 0, ErrOutOfGas
	} else {
		gas += callCost.Uint64()
	}

	// Dynamic memory expansion cost can be calculated here, because it's calculated
	// on the same memory size, and needs to be added to gas.
	var overflow bool
	if memorySize > 0 {
		var memGas uint64
		memGas, overflow = memoryGasCost2(memory, memorySize)
		if overflow {
			return 0, ErrGasUintOverflow
		}
		gas, overflow = math.SafeAdd(gas, memGas)
		if overflow {
			return 0, ErrGasUintOverflow
		}
	}
	return gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents a simple memory model for the ethereum virtual machine.
type Memory struct {
	store       []byte
	lastGasCost uint64
	size        int
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset to value
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size > 0 {
		m.resize(offset + size)
		copy(m.store[offset:offset+size], value)
	}
}

// Resize resizes the memory to size
func (m *Memory) resize(size uint64) {
	if uint64(m.Len()) < size {
		// grow the memory
		m.grow(size)
	}
}

// grow resizes the memory to size (which must be larger than the current size)
// and returns the gas cost for the operation.
func (m *Memory) grow(size uint64) (uint64, error) {
	if size > MaxMemorySize {
		return 0, ErrMemoryLimit
	}
	newSize := common.PaddedSize(size)
	if newSize > uint64(m.Len()) {
		// The cost of memory is calculated as:
		// Cmem(s) = Gmem * s + floor(s^2 / 512)
		// where s is the size in words.
		words := newSize / 32
		newCost := words*params.MemoryGas + words*words/params.QuadCoeffDiv
		cost := newCost - m.lastGasCost
		m.lastGasCost = newCost

		// Check if we have enough gas for the op.
		// Note: we're doing this check *before* we actually do the resizing,
		// and we can't revert the gas cost if the resizing fails.
		// The error will be "out of gas" in that case, and the cost of the
		// memory expansion will be deducted still.
		if m.Size() > 0 && cost > 0 { // prevent overflow if size is 0
			// Before EIP-150, the available gas was checked using size and not size - gas.
			// No matter what, we have to check for this condition
			if newSize > uint64(len(m.store)) {
				m.store = common.Extend(m.store, int(newSize-uint64(len(m.store))))
			}
		}
		return cost, nil
	}
	return 0, nil
}
// Len returns the length of the memory
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ... other constants ...
	QuadCoeffDiv          uint64 = 512   // Divisor for the quadratic particle of the memory cost equation.
	// ...
	MemoryGas             uint64 = 3     // Times the address of the (highest referenced byte in memory + 1). NOTE: referencing happens on read, write and in instructions such as RETURN and CALL.
	// ...
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup)

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = new(bytes.Buffer)
		// For optimisation, reference types are scoped to the interpreter loop.
		// They are copied and returned on exit only if necessary.
		pc   = uint64(0) // program counter
		cost uint64
		// ...
	)
	// ...

	// The main loop. It's purpose is to cleanly decapsulate the EVM executing
	// logic out from the intricate fault checking and handling logic.
	for {
		// ...
		// Get the valid jump destinations
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		// ...

		// calculate the gas cost for the operation
		cost, err = operation.gasCost(in.evm, contract, stack, mem)
		if err != nil {
			return nil, err
		}
		// ...

		// consume the gas for the operation
		if err = contract.UseGas(cost); err != nil {
			return nil, err
		}

		// execute the operation
		res, err := operation.execute(&pc, in, contract, mem, stack)
		// ...
	}
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
```go
// gasMStore returns the gas required for memory expansion of MSTORE.
func gasMStore(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize, gas uint64) (uint64, error) {
	return callGas(evm.chainRules, gas, GasFastestStep, nil, mem, memorySize, 0, 0, 0)
}

// gasMStore8 returns the gas required for memory expansion of MSTORE8.
func gasMStore8(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize, gas uint64) (uint64, error) {
	return callGas(evm.chainRules, gas, GasFastestStep, nil, mem, memorySize, 0, 0, 0)
}

// gasMLoad returns the gas required for memory expansion of MLOAD.
func gasMLoad(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize, gas uint64) (uint64, error) {
	return callGas(evm.chainRules, gas, GasFastestStep, nil, mem, memorySize, 0, 0, 0)
}

// gasReturn returns the gas required for memory expansion of RETURN.
func gasReturn(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize, gas uint64) (uint64, error) {
	return callGas(evm.chainRules, gas, 0, nil, mem, memorySize, 0, 0, 0)
}

// gasRevert returns the gas required for memory expansion of REVERT.
func gasRevert(evm *EVM, contract *Contract, stack *Stack, mem *Memory, memorySize, gas uint64) (uint64, error) {
	return callGas(evm.chainRules, gas, 0, nil, mem, memorySize, 0, 0, 0)
}
```
</file>
## Prompt Corrections

The original prompt suggests an optimization strategy involving two parts: a pre-computed cache for small memory sizes (`MemoryCostCache`) and an incremental tracker (`MemoryGasTracker`).

The go-ethereum implementation provides a strong reference for the **incremental tracking** part. The `Memory` struct in `core/vm/memory.go` contains a `lastGasCost` field, and the `memoryGasCost` function in `core/vm/gas.go` calculates the expansion cost as `new_cost - old_cost`. This is precisely the incremental tracking strategy.

However, **go-ethereum does not use a pre-computed cache** for small memory sizes. It calculates the quadratic cost on-the-fly for every expansion. Therefore, implementing the `MemoryCostCache` as described in the prompt would be a further optimization on top of what go-ethereum does.

**Recommendation:**
The implementation should follow the prompt's `MemoryGasTracker` design, which is well-supported by the go-ethereum reference implementation. The logic within `go-ethereum/core/vm/gas.go`'s `memoryGasCost` function is the ideal reference for calculating the cost difference and handling potential overflows. The `MemoryCostCache` can be implemented as an additional lookup layer before falling back to the direct calculation, which is a valid and potentially beneficial optimization not found in Geth.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
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

	oldSize := uint64(mem.Len())
	oldMemSizeWords := (oldSize + 31) / 32
	if newMemSizeWords > oldMemSizeWords {
		// This is the quadratic memory cost calculation
		// Cmem(s) = Gmem * s + s^2 / 512
		// where s is the memory size in words.
		square := newMemSizeWords * newMemSizeWords
		linCoeff := newMemSizeWords * params.MemoryGas
		quadCoeff := square / params.QuadCoeffDiv
		newTotalFee := linCoeff + quadCoeff

		// The gas cost is the difference between the new cost and the old cost
		fee := newTotalFee - mem.lastGasCost
		mem.lastGasCost = newTotalFee

		return fee, nil
	}
	return 0, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets offset + size to value
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size > 0 {
		// Should we check for overflow?
		m.Resize(offset + size)
		copy(m.store[offset:offset+size], value)
	}
}

// Set32 sets the 32 bytes starting at offset to value.
func (m *Memory) Set32(offset uint64, val *uint256.Int) {
	// Should we check for overflow?
	m.Resize(offset + 32)
	val.WriteToSlice(m.store[offset : offset+32])
}

// Resize resizes the memory to size
func (m *Memory) Resize(size uint64) {
	if uint64(len(m.store)) < size {
		m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
	}
}

// Get returns offset + size as a new slice
func (m *Memory) Get(offset, size int64) []byte {
	if size == 0 {
		return nil
	}
	if int64(len(m.store)) < offset+size {
		return common.RightPadBytes(m.store[offset:], int(size))
	}
	return m.store[offset : offset+size]
}

// Len returns the length of the memory
func (m *Memory) Len() int {
	return len(m.store)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// Gas cost for memory expansion
	MemoryGas     uint64 = 3       // Times the address of the (highest-referenced byte in memory + 1).
	QuadCoeffDiv  uint64 = 512     // Divisor for the quadratic particle of the memory cost equation.

	// Gas cost for copy operations
	CopyGas      uint64 = 3 // Per word copied, i.e. multiplied by ceil(size/32).
)
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt's formula for memory expansion gas is slightly simplified. Go-ethereum's implementation in `memoryGasCost` correctly calculates the expansion cost as the *difference* between the new total memory cost and the previously tracked total memory cost (`newTotalFee - mem.lastGasCost`). This incremental approach is the key optimization geth already employs and is a more accurate model to follow than `new_memory_cost - old_memory_cost` if `old_memory_cost` is recalculated based on the *previous* size instead of being cached.

The geth code also includes an important overflow check (`newSize > 0xffffffffe0`) before calculating the memory size in words, which is a critical detail for a robust implementation.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents a simple memory model for the ethereum virtual machine.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Set sets the 32 bytes starting at offset to value.
func (m *Memory) Set(offset, size uint64, value []byte) {
	if size > 0 {
		m.resize(offset + size)
		copy(m.store[offset:offset+size], value)
	}
}

// resize resizes the memory to the given size.
// For the EIP-2929, we need to handle the gas cost using words, which is
// charged using the highest accessed memory.
//
// The growth of memory is quadratic, and is charged per word.
//
// oldsize is the memory size in words.
func (m *Memory) resize(newSize uint64) {
	if uint64(len(m.store)) < newSize {
		// Think of this as the 'cost' of the new memory, which is returned
		// to the caller for gas accounting
		m.store = append(m.store, make([]byte, newSize-uint64(len(m.store)))...)
	}
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gas_table.go">
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
	// new memory size in words
	newMemSize := (newSize + 31) / 32

	// The memory size can't be larger than the address space of the EVM,
	// which is at maximum 2^64-1.
	// The cost of memory is calculated as:
	// C_mem(a) = G_memory * a + a*a / G_quadcoeff
	// a is the number of words. The cost is rounded up to the nearest word.
	// The cost of memory is paid on memory expansion.
	newMemSizeWords := newMemSize

	oldMemSizeWords := uint64(mem.Len()) / 32
	if newMemSizeWords > oldMemSizeWords {
		// Prevent overflow, which can happen for a size > 2^62 - 1.
		if newMemSizeWords > 4_702_962_068_109_951 { // 2^62-1, approx
			return 0, ErrGasUintOverflow
		}
		newTotalFee := newMemSizeWords*params.MemoryGas + (newMemSizeWords*newMemSizeWords)/params.QuadCoeffDiv

		fee := newTotalFee - mem.lastGasCost
		mem.lastGasCost = newTotalFee

		return fee, nil
	}
	return 0, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
// Gas and refund constants
const (
	// ...
	MemoryGas     uint64 = 3       // Times the address of the (highest referenced byte in memory + 1).
	QuadCoeffDiv  uint64 = 512     // Divisor for the quadratic particle of the memory cost equation.
	// ...
)
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt proposes an optimization strategy that includes a `MemoryCostCache` (a lookup table for pre-calculated memory costs) and a `MemoryGasTracker` for incremental cost updates.

This is a good strategy, but it's important to clarify how it relates to the go-ethereum implementation:

1.  **Geth does NOT use a pre-calculated lookup table (`MemoryCostCache`).** It calculates the total memory cost dynamically each time memory expands, as shown in the `memoryGasCost` function. The prompt's idea of a `MemoryCostCache` is a *new optimization* on top of what Geth does.

2.  **Geth DOES use incremental cost tracking.** The `Memory` struct in `core/vm/memory.go` contains a `lastGasCost` field. The `memoryGasCost` function uses this field to calculate the *expansion cost* (`newTotalFee - mem.lastGasCost`) and then updates it. This is exactly what the prompt's proposed `MemoryGasTracker` aims to do.

Therefore, the provided go-ethereum snippets are a perfect reference for implementing the *uncached* part of the logic and the incremental tracking system. The Zig implementation can then add the `MemoryCostCache` as an enhancement to avoid the dynamic calculation for common memory sizes.

