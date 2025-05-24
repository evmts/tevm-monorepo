# Storage.zig - EVM Contract Storage Implementation

This document describes the Tevm EVM contract storage implementation in `Storage.zig` and compares it with other major EVM implementations.

## Overview

The `Storage` struct implements the key-value storage system for smart contracts in the EVM. Each contract has its own storage space mapping 256-bit keys to 256-bit values, providing persistent state storage across transactions.

## Implementation Details

### Core Structure

```zig
pub const Storage = struct {
    data: std.AutoHashMap(B256, B256),           // Main storage mapping
    dirty_keys: std.AutoHashMap(B256, void),     // Modified keys tracking
    original_values: std.AutoHashMap(B256, B256), // Original values for revert
    allocator: std.mem.Allocator,                // Memory allocator
}
```

### Key Features

1. **Sparse Storage**: Only stores non-zero values (lazy initialization)
2. **Dirty Tracking**: Tracks modified keys for efficient state updates
3. **Original Values**: Preserves initial values for gas calculation and reverts
4. **Zero Default**: Uninitialized slots return zero (Ethereum specification)

### Core Operations

#### Basic Storage Operations
- `init(allocator)` - Create new empty storage
- `deinit()` - Clean up all allocated memory
- `get(key)` - Read value (returns 0 for non-existent)
- `set(key, value)` - Write value with dirty tracking
- `delete(key)` - Remove entry (marks as dirty)
- `contains(key)` - Check if key exists
- `len()` - Get number of stored entries

#### Dirty Tracking Operations
- `markDirty(key, original_value)` - Track modification
- `isDirty(key)` - Check if key was modified
- `getDirtyKeys()` - Get all modified keys
- `getOriginal(key)` - Get value before modifications
- `clearDirty()` - Reset tracking state

#### Utility Operations
- `clone(allocator)` - Deep copy with state preservation
- `iterator()` - Iterate over all entries

### Storage Behavior

#### Zero Values
Following Ethereum specification:
```zig
pub fn get(self: *const Storage, key: B256) B256 {
    const val = self.data.get(key);
    if (val) |v| {
        return v;
    }
    return B256{ .bytes = [_]u8{0} ** 32 };  // Zero default
}
```

#### Dirty Tracking Logic
```zig
pub fn set(self: *Storage, key: B256, value: B256) !void {
    // Track original value on first modification
    if (!self.dirty_keys.contains(key)) {
        const original = self.get(key);
        try self.markDirty(key, original);
    }
    
    try self.data.put(key, value);
}
```

## Comparison with Other Implementations

### Storage Architecture

| Implementation | Storage Type | Dirty Tracking | Original Values | Backend |
|----------------|-------------|----------------|-----------------|---------|
| Tevm (Zig) | HashMap | Separate HashMap | HashMap cache | Memory |
| go-ethereum | Trie-based | Journal entries | Snapshot layers | LevelDB |
| revm (Rust) | HashMap | Status bits | Original in struct | Memory/DB |
| evmone | Host callbacks | Host managed | Host managed | External |

### Key Differences

#### 1. Storage Model

**Tevm**:
- Simple HashMap for direct access
- Memory-only implementation
- No persistence layer yet
- Explicit dirty tracking

**go-ethereum**:
- Merkle Patricia Trie based
- Multi-layer caching
- Persistent with LevelDB
- Complex snapshot system

**revm**:
- HashMap with status tracking
- Configurable backend
- Original value in storage entry
- Optimized for execution

**evmone**:
- No storage implementation
- Delegates to host via EVMC
- Minimal EVM responsibility

#### 2. Dirty Tracking Approach

**Tevm**:
```zig
dirty_keys: std.AutoHashMap(B256, void),     // Set of modified keys
original_values: std.AutoHashMap(B256, B256), // Original values cache
```
Separate tracking with original value preservation.

**go-ethereum**:
- Journal-based tracking
- Layered approach with snapshots
- Complex revert mechanism
- Integrated with state trie

**revm**:
```rust
pub struct StorageSlot {
    pub previous_or_original_value: U256,
    pub present_value: U256,
    pub is_cold: bool,
}
```
All-in-one storage slot tracking.

#### 3. Gas Calculation Support

**Tevm**:
- Original values tracked for EIP-2200
- Dirty keys for warm/cold tracking
- Clean separation of concerns

**go-ethereum**:
- Integrated with state transitions
- Complex refund tracking
- Access list management

**revm**:
- Built-in warm/cold tracking
- Efficient gas calculation
- EIP-2929 native support

### Performance Characteristics

**Tevm HashMap Approach**:
- ✅ O(1) average access time
- ✅ Simple implementation
- ✅ Cache-friendly for hot data
- ❌ No merkle proof support
- ❌ Memory grows with storage

**Trie-Based (go-ethereum)**:
- ✅ Merkle proof generation
- ✅ Efficient state root calculation
- ❌ O(log n) access time
- ❌ Complex implementation
- ❌ Higher overhead

## Integration with EVM

### SLOAD Operation
```zig
// In storage opcodes
const value = storage.get(key);
// Returns zero for non-existent keys
// No error cases - always succeeds
```

### SSTORE Operation
```zig
// Track for gas calculation
const original = storage.getOriginal(key) orelse storage.get(key);
try storage.set(key, value);
// Calculate gas based on value transitions
```

### State Reverts
The original values enable transaction rollback:
```zig
// Revert to original state
for (storage.getDirtyKeys()) |key| {
    const original = storage.getOriginal(key);
    if (original.isZero()) {
        storage.delete(key);
    } else {
        storage.set(key, original);
    }
}
```

## Best Practices

1. **Initialize Properly**:
   ```zig
   var storage = Storage.init(allocator);
   defer storage.deinit();
   ```

2. **Check Dirty State**:
   ```zig
   if (storage.isDirty(key)) {
       // Key was modified in this transaction
   }
   ```

3. **Use Original Values**:
   ```zig
   const original = storage.getOriginal(key) orelse B256.zero();
   // Use for gas calculation
   ```

4. **Clone Carefully**:
   ```zig
   var storage_copy = try storage.clone(allocator);
   defer storage_copy.deinit();
   ```

## Testing Coverage

The implementation includes comprehensive tests:
- Basic get/set operations
- Dirty tracking mechanics
- Original value preservation
- Clone functionality
- Memory management
- Edge cases (zero values, overwrites)

## Future Enhancements

1. **Persistence Layer**:
   - Add database backend
   - Implement storage tries
   - Support merkle proofs

2. **Optimization**:
   - Bloom filters for existence checks
   - LRU cache for hot data
   - Batch operations

3. **Features**:
   - Storage slot packing
   - Access pattern analysis
   - Compression support

4. **Integration**:
   - StateDB integration improvements
   - Snapshot/revert optimization
   - Parallel access support

## Use Cases

### Transaction Execution
1. Load storage for contract
2. Track modifications during execution
3. Calculate gas costs using original values
4. Commit or revert based on success

### Gas Calculation (EIP-2200)
```zig
const original = storage.getOriginal(key) orelse B256.zero();
const current = storage.get(key);
const new = value_to_store;

// Calculate gas based on transitions
if (original.equals(current) and current.equals(new)) {
    // No-op case
} else if (original.equals(current) and !current.equals(new)) {
    // First modification
} else if (!original.equals(current) and current.equals(new)) {
    // Reset to original
}
```

### State Root Calculation
```zig
// Only process dirty keys for efficiency
for (storage.getDirtyKeys()) |key| {
    const value = storage.get(key);
    // Update merkle trie with key-value pair
}
```

## Conclusion

The Tevm Storage implementation provides a clean, efficient contract storage system with comprehensive dirty tracking and original value preservation. While it currently lacks persistence and merkle trie support, the architecture supports these additions. The implementation correctly handles Ethereum's storage semantics while maintaining simplicity and performance.