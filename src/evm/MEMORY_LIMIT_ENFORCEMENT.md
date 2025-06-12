# Memory Limit Enforcement

This document describes the memory limit enforcement implementation in the EVM to prevent excessive memory allocation and DoS attacks.

## Overview

The EVM uses a quadratic gas cost formula for memory expansion, making large allocations prohibitively expensive. However, without explicit memory limits, malicious code could attempt to allocate unreasonable amounts of memory before gas costs are calculated, potentially causing system instability.

## Implementation Details

### Default Memory Limit

The default memory limit is set to **32 MB** (33,554,432 bytes):

```zig
pub const DefaultMemoryLimit: u64 = 32 * 1024 * 1024;
```

This limit was chosen because:
1. It matches common production EVM implementations
2. The gas cost for 32 MB of memory exceeds 2 billion gas (far beyond any reasonable block gas limit)
3. It provides sufficient memory for legitimate smart contract operations
4. It prevents DoS attacks through excessive memory allocation

### Gas Cost Calculation

Memory expansion follows a quadratic cost formula:

```zig
memory_cost = 3 * words + (words * words) / 512
```

Where `words = (bytes + 31) / 32`

Examples:
- 1 KB: ~96 gas
- 1 MB: ~1.6 million gas
- 32 MB: ~2.15 billion gas

### Memory Limit Enforcement Points

Memory limits are enforced at multiple levels:

1. **resize_context()** - Direct memory resizing
   ```zig
   if (new_total_len > self.memory_limit) {
       return MemoryError.MemoryLimitExceeded;
   }
   ```

2. **ensure_context_capacity()** - Memory expansion for operations
   ```zig
   if (required_total_len > self.memory_limit) {
       return MemoryError.MemoryLimitExceeded;
   }
   ```

3. **Data operations** - set_byte, set_word, set_data, copy
   - All operations that could expand memory check limits before allocation

### Child Context Inheritance

Child contexts inherit the memory limit from their parent:

```zig
return Self{
    // ...
    .memory_limit = self.memory_limit, // Inherit limit
    // ...
};
```

This ensures consistent limits across all execution contexts.

### Dynamic Limit Configuration

Memory limits can be adjusted at runtime:

```zig
pub fn set_memory_limit(self: *Self, new_limit: u64) void {
    self.root_ptr.memory_limit = new_limit;
}
```

Changes propagate to all contexts through the shared root pointer.

## Alternative Limits

For different use cases, alternative limits are available:

```zig
// Conservative: 16 MB
pub const CONSERVATIVE_MEMORY_LIMIT: u64 = 16 * 1024 * 1024;

// Permissive: 64 MB  
pub const PERMISSIVE_MEMORY_LIMIT: u64 = 64 * 1024 * 1024;
```

## Security Considerations

1. **DoS Prevention**: Even with "unlimited" memory settings, gas costs prevent abuse
2. **Predictable Resource Usage**: Memory limits ensure predictable maximum memory consumption
3. **Early Failure**: Operations fail fast when limits are exceeded, before actual allocation
4. **No Bypass**: All memory operations go through limit checks

## Testing

Comprehensive tests in `test/evm/memory_limit_test.zig` verify:
- Default and custom limit enforcement
- Child context limit inheritance
- All memory operations respect limits
- Gas cost calculations
- DoS attack prevention

## Usage Example

```zig
// Create memory with default 32 MB limit
var memory = try Memory.init_default(allocator);
defer memory.deinit();
memory.finalize_root();

// Or with custom limit
var memory = try Memory.init(allocator, 4096, 16 * 1024 * 1024); // 16 MB limit

// Operations automatically enforce limit
try memory.resize_context(1024 * 1024); // OK: 1 MB < 32 MB
const result = memory.resize_context(64 * 1024 * 1024); // Error: 64 MB > 32 MB
```

## Comparison with Other EVMs

- **go-ethereum**: 32 MB default limit
- **revm**: Configurable, typically 32-64 MB
- **evmone**: 32 MB default
- **Tevm**: 32 MB default (matching consensus)

## Future Considerations

1. **Per-transaction limits**: Could implement transaction-specific memory limits
2. **Dynamic adjustment**: Could adjust limits based on available system resources
3. **Metrics**: Could track memory usage patterns for optimization
4. **Configuration**: Could expose limits through node configuration