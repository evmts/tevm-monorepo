# Journal.zig - EVM State Change Journaling System

This document describes the Tevm Journal implementation which provides transaction rollback capabilities for the EVM state management system.

## Overview

The Journal implements a comprehensive state change tracking system that records all modifications during EVM execution. This enables atomic transactions where all changes can be rolled back if execution fails, maintaining the integrity of the blockchain state.

## Implementation Details

### Core Structure

```zig
pub const Journal = struct {
    entries: std.ArrayList(JournalEntry),              // Sequential change log
    snapshot_id: u64,                                  // Incremental snapshot counter
    snapshot_indexes: std.AutoHashMap(u64, usize),     // Snapshot ID to entry index
    allocator: std.mem.Allocator,                      // Memory management
}
```

### JournalEntry Types

The Journal tracks various types of state changes through a tagged union:

```zig
pub const JournalEntry = union(enum) {
    // Account state changes
    BalanceChange: struct {
        address: Address,
        prev_balance: u256,
    },
    NonceChange: struct {
        address: Address,
        prev_nonce: u64,
    },
    CodeChange: struct {
        address: Address,
        prev_code_hash: B256,
    },
    CreateAccount: struct {
        address: Address,
    },
    SelfDestruct: struct {
        address: Address,
        prev_balance: u256,
        prev_nonce: u64,
        had_code: bool,
    },
    
    // Storage changes
    StorageChange: struct {
        address: Address,
        key: B256,
        prev_value: B256,
    },
    
    // Transaction artifacts
    AddLog: struct {
        address: Address,
        topics: []B256,
        data: []u8,
    },
    
    // Gas tracking
    RefundChange: struct {
        prev_refund: u64,
    },
    
    // EIP-2929 access tracking
    AccessListChange: struct {
        address: Address,
        was_warm: bool,
    },
    StorageAccessChange: struct {
        address: Address,
        key: B256,
        was_warm: bool,
    },
    
    // State transitions
    AccountChange: struct {
        address: Address,
        was_empty: bool,
    },
    
    // Snapshot boundaries
    Snapshot: struct {
        id: u64,
    },
}
```

### Core Operations

#### Entry Management
- `init(allocator)` - Create new journal
- `deinit()` - Clean up resources
- `append(entry)` - Record a state change
- `clear()` - Reset journal

#### Snapshot Operations
- `snapshot()` - Create checkpoint, returns snapshot ID
- `revertToSnapshot(id)` - Rollback to checkpoint
- `entriesSinceSnapshot(id)` - Get changes since snapshot

### Snapshot Mechanism

The snapshot system provides nested transaction support:

```zig
pub fn snapshot(self: *Journal) !u64 {
    const id = self.snapshot_id;
    self.snapshot_id += 1;
    
    // Record current position
    try self.snapshot_indexes.put(id, self.entries.items.len);
    
    // Add boundary marker
    try self.entries.append(.{
        .Snapshot = .{ .id = id },
    });
    
    return id;
}
```

## State Change Tracking

### Balance Changes
```zig
// Record before modifying balance
journal.append(.{
    .BalanceChange = .{
        .address = address,
        .prev_balance = current_balance,
    },
});
```

### Storage Changes
```zig
// Record before modifying storage
journal.append(.{
    .StorageChange = .{
        .address = contract_address,
        .key = storage_key,
        .prev_value = current_value,
    },
});
```

### Account Creation
```zig
// Record new account
journal.append(.{
    .CreateAccount = .{
        .address = new_address,
    },
});
```

## Rollback Process

The revert operation processes entries in reverse order:

```zig
pub fn revertToSnapshot(self: *Journal, snapshot_id: u64) !void {
    const snapshot_index = self.snapshot_indexes.get(snapshot_id) orelse 
        return error.InvalidSnapshot;
    
    // Remove entries after snapshot
    self.entries.shrinkRetainingCapacity(snapshot_index);
    
    // Clean up invalid snapshot references
    var to_remove = std.ArrayList(u64).init(self.allocator);
    defer to_remove.deinit();
    
    var iter = self.snapshot_indexes.iterator();
    while (iter.next()) |entry| {
        if (entry.value_ptr.* > snapshot_index) {
            try to_remove.append(entry.key_ptr.*);
        }
    }
    
    for (to_remove.items) |id| {
        _ = self.snapshot_indexes.remove(id);
    }
}
```

## Comparison with Other Implementations

### Journal Architecture

| Implementation | Storage | Snapshot Model | Revert Strategy | Memory Model |
|----------------|---------|----------------|-----------------|--------------|
| Tevm (Zig) | Linear array | ID-based markers | Truncate entries | Explicit |
| go-ethereum | Linked list | Depth-based | Reverse apply | GC managed |
| revm (Rust) | Vec + checkpoints | Index-based | Pop entries | Ownership |
| evmone | External | Host managed | Host managed | External |

### Key Differences

#### 1. Entry Storage

**Tevm**:
- ArrayList for sequential access
- Snapshot markers in-line
- Simple truncation for revert

**go-ethereum**:
- Complex object-based journaling
- Separate dirty tracking
- More memory overhead

**revm**:
- Checkpoint-based system
- Integrated with state
- Optimized for performance

#### 2. Snapshot Management

**Tevm**:
```zig
snapshot_indexes: std.AutoHashMap(u64, usize)
```
Direct mapping of ID to position.

**go-ethereum**:
- Snapshot objects with state
- Reference counting
- Complex lifecycle

**revm**:
- Simple index tracking
- Minimal overhead
- Fast revert

#### 3. Memory Management

**Tevm**:
- Explicit allocation
- Manual cleanup in revert
- Clear ownership

**Others**:
- Various GC or RAII approaches
- Less visible allocation

## Integration with State Management

### Transaction Flow

```zig
// 1. Start transaction
const snapshot_id = try journal.snapshot();

// 2. Record changes during execution
try journal.append(.{
    .BalanceChange = .{
        .address = sender,
        .prev_balance = sender_balance,
    },
});

// 3. On success - keep changes
// On failure - revert
if (transaction_failed) {
    try journal.revertToSnapshot(snapshot_id);
}
```

### Nested Calls

```zig
// Outer call
const outer_snapshot = try journal.snapshot();

// Inner call
const inner_snapshot = try journal.snapshot();

// Inner call fails
try journal.revertToSnapshot(inner_snapshot);

// Outer call continues...
```

## Best Practices

1. **Always Snapshot Before State Changes**:
   ```zig
   const snapshot = try journal.snapshot();
   defer {
       if (should_revert) journal.revertToSnapshot(snapshot) catch {};
   }
   ```

2. **Record Complete Previous State**:
   ```zig
   // Good - saves all necessary data
   .SelfDestruct = .{
       .address = address,
       .prev_balance = account.balance,
       .prev_nonce = account.nonce,
       .had_code = account.hasCode(),
   }
   ```

3. **Clean Snapshot Management**:
   ```zig
   // Ensure snapshots are properly reverted or committed
   const snapshot = try journal.snapshot();
   errdefer journal.revertToSnapshot(snapshot) catch {};
   ```

## Performance Considerations

1. **O(1) Append**: Adding entries is constant time
2. **O(n) Revert**: Proportional to changes since snapshot
3. **Memory Growth**: Entries accumulate until cleared
4. **Snapshot Overhead**: Minimal - just index storage

### Optimization Opportunities

1. **Entry Pooling**: Reuse entry memory
2. **Compression**: Combine related changes
3. **Lazy Deletion**: Mark as invalid vs remove
4. **Batch Operations**: Group related changes

## Testing Strategy

The Journal should be tested for:
- Basic append/snapshot/revert operations
- Nested snapshot handling
- Memory management and cleanup
- Edge cases (empty journal, invalid snapshot)
- Integration with StateDB
- Performance under load

## Future Enhancements

1. **Optimization**:
   - Entry compression
   - Memory pooling
   - Incremental snapshots

2. **Features**:
   - Change analytics
   - Replay capabilities
   - Serialization support

3. **Integration**:
   - Direct StateDB integration
   - Parallel execution support
   - Advanced debugging

## Use Cases

### Simple Transaction
```zig
const snapshot = try journal.snapshot();
// Execute transaction...
if (failed) {
    try journal.revertToSnapshot(snapshot);
}
```

### Complex Call Stack
```zig
// Each call frame gets its own snapshot
fn executeCall(journal: *Journal) !void {
    const snapshot = try journal.snapshot();
    errdefer journal.revertToSnapshot(snapshot) catch {};
    
    // Perform state changes...
    // Make nested calls...
    // Changes automatically tracked
}
```

### State Debugging
```zig
// Get all changes in current transaction
const changes = try journal.entriesSinceSnapshot(tx_snapshot);
for (changes) |entry| {
    // Analyze state modifications
}
```

## Conclusion

The Tevm Journal provides a robust, efficient system for tracking and reverting state changes during EVM execution. Its linear storage model and snapshot-based approach offer good performance while maintaining simplicity. The comprehensive change tracking supports all EVM requirements including nested calls, gas refunds, and access list management.