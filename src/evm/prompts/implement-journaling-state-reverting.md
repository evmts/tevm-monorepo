# Implement Journaling/State Reverting System

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_journaling_state_reverting` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_journaling_state_reverting feat_implement_journaling_state_reverting`
3. **Work in isolation**: `cd g/feat_implement_journaling_state_reverting`
4. **Commit message**: `✨ feat: implement journaling and state reverting system`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement a journaling system for state snapshots and proper revert handling. This is critical for correct EVM behavior, especially for failed transactions, reverted calls, and exception handling.

## Ethereum Specification

### State Journaling Requirements
- **Snapshot Creation**: Capture state at specific execution points
- **Revert Handling**: Restore state to previous snapshot on failures
- **Nested Calls**: Support multiple levels of snapshots (call stack depth)
- **Transaction Scope**: Full transaction revert capabilities
- **Storage Changes**: Track and revert storage modifications
- **Account Changes**: Track balance, nonce, and code changes

### Key Operations
1. **Snapshot**: Create state checkpoint
2. **Commit**: Finalize changes from snapshot point
3. **Revert**: Restore state to snapshot point
4. **Journal**: Track all state changes for reverting

## Reference Implementations

### revm Implementation
Search for `Journal` and `StateChanges` in revm codebase for pattern reference.

### evmone Implementation
Look for state snapshot mechanisms in evmone for gas and performance patterns.

## Implementation Requirements

### Core Functionality
1. **Journal System**: Track all state modifications
2. **Snapshot Stack**: Maintain nested snapshots for call depth
3. **Change Tracking**: Record every state modification
4. **Efficient Revert**: Fast state restoration
5. **Memory Management**: Efficient snapshot storage

### Journal Entry Types
```zig
pub const JournalEntry = union(enum) {
    account_touched: struct {
        address: Address,
    },
    account_loaded: struct {
        address: Address,
        account: Account,
    },
    storage_changed: struct {
        address: Address,
        key: B256,
        previous_value: B256,
    },
    transient_storage_changed: struct {
        address: Address,
        key: B256,
        previous_value: B256,
    },
    balance_changed: struct {
        address: Address,
        previous_balance: U256,
    },
    nonce_changed: struct {
        address: Address,
        previous_nonce: u64,
    },
    code_changed: struct {
        address: Address,
        previous_code: ?[]const u8,
    },
    account_destroyed: struct {
        address: Address,
        account: Account,
    },
    account_created: struct {
        address: Address,
    },
    log_created: struct {
        log_index: usize,
    },
};
```

## Implementation Tasks

### Task 1: Define Journal Data Structures
File: `/src/evm/state/journal.zig`
```zig
const std = @import("std");
const Address = @import("../Address.zig").Address;
const U256 = @import("../Types/U256.ts").U256;
const B256 = @import("../Types/B256.ts").B256;

pub const Journal = struct {
    entries: std.ArrayList(JournalEntry),
    snapshots: std.ArrayList(usize), // Index of journal entries at snapshot points
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) Journal {
        return Journal{
            .entries = std.ArrayList(JournalEntry).init(allocator),
            .snapshots = std.ArrayList(usize).init(allocator),
            .allocator = allocator,
        };
    }

    pub fn deinit(self: *Journal) void {
        self.entries.deinit();
        self.snapshots.deinit();
    }

    pub fn snapshot(self: *Journal) !usize {
        const snapshot_id = self.snapshots.items.len;
        try self.snapshots.append(self.entries.items.len);
        return snapshot_id;
    }

    pub fn commit(self: *Journal, snapshot_id: usize) void {
        // Remove snapshot point (commits all changes since snapshot)
        _ = self.snapshots.swapRemove(snapshot_id);
    }

    pub fn revert(self: *Journal, snapshot_id: usize, state: *State) !void {
        const snapshot_point = self.snapshots.items[snapshot_id];
        
        // Revert all entries from the end back to snapshot point
        while (self.entries.items.len > snapshot_point) {
            const entry = self.entries.pop();
            try self.revert_entry(entry, state);
        }
        
        // Remove the snapshot
        _ = self.snapshots.swapRemove(snapshot_id);
    }

    fn revert_entry(self: *Journal, entry: JournalEntry, state: *State) !void {
        switch (entry) {
            .storage_changed => |change| {
                try state.set_storage(change.address, change.key, change.previous_value);
            },
            .balance_changed => |change| {
                try state.set_balance(change.address, change.previous_balance);
            },
            // ... handle all journal entry types
        }
    }
};
```

### Task 2: Integrate Journal with State
File: `/src/evm/state/state.zig` (modify existing)
```zig
pub const State = struct {
    // ... existing fields
    journal: Journal,

    pub fn init(allocator: std.mem.Allocator) State {
        return State{
            // ... existing initialization
            .journal = Journal.init(allocator),
        };
    }

    pub fn set_storage(self: *State, address: Address, key: B256, value: B256) !void {
        // Get current value for journal
        const previous_value = self.get_storage(address, key);
        
        // Record journal entry
        try self.journal.entries.append(.{
            .storage_changed = .{
                .address = address,
                .key = key,
                .previous_value = previous_value,
            },
        });
        
        // Apply the change
        try self.apply_storage_change(address, key, value);
    }

    // Similar journaling for all state modifications
    pub fn set_balance(self: *State, address: Address, balance: U256) !void {
        const previous_balance = self.get_balance(address);
        try self.journal.entries.append(.{
            .balance_changed = .{
                .address = address,
                .previous_balance = previous_balance,
            },
        });
        try self.apply_balance_change(address, balance);
    }
};
```

### Task 3: VM Integration for Call Handling
File: `/src/evm/vm.zig` (modify existing)
```zig
pub fn call(self: *VM, call_input: CallInput) !CallResult {
    // Create snapshot before call
    const snapshot_id = try self.state.journal.snapshot();
    errdefer {
        // Revert on any error
        self.state.journal.revert(snapshot_id, &self.state) catch {};
    }
    
    // Execute the call
    const result = self.execute_call(call_input) catch |err| {
        // Revert state and propagate error
        try self.state.journal.revert(snapshot_id, &self.state);
        return err;
    };
    
    // Handle result
    if (result.is_success) {
        // Commit changes
        self.state.journal.commit(snapshot_id);
    } else {
        // Revert changes
        try self.state.journal.revert(snapshot_id, &self.state);
    }
    
    return result;
}
```

### Task 4: Implement Snapshot Operations
File: `/src/evm/execution/system.zig` (add functions)
```zig
pub fn create_snapshot(vm: *VM) !usize {
    return try vm.state.journal.snapshot();
}

pub fn commit_snapshot(vm: *VM, snapshot_id: usize) void {
    vm.state.journal.commit(snapshot_id);
}

pub fn revert_to_snapshot(vm: *VM, snapshot_id: usize) !void {
    try vm.state.journal.revert(snapshot_id, &vm.state);
}
```

### Task 5: Exception Handling Integration
```zig
pub const ExecutionResult = struct {
    pub fn handle_exception(self: *ExecutionResult, vm: *VM, snapshot_id: usize) !void {
        if (self.is_error()) {
            try vm.state.journal.revert(snapshot_id, &vm.state);
        } else {
            vm.state.journal.commit(snapshot_id);
        }
    }
};
```

### Task 6: Comprehensive Testing
File: `/test/evm/state/journal_test.zig`

### Test Cases
1. **Basic Snapshot/Revert**: Simple state changes and reversion
2. **Nested Snapshots**: Multiple call depth scenarios
3. **Storage Reversion**: Complex storage change patterns
4. **Account State Reversion**: Balance, nonce, code changes
5. **Transient Storage**: EIP-1153 transient storage reversion
6. **Failed Calls**: Proper reversion on call failures
7. **Exception Handling**: Reversion on various exception types
8. **Performance**: Large state change reversion performance

## Integration Points

### Files to Modify
- `/src/evm/state/state.zig` - Add journal integration
- `/src/evm/state/journal.zig` - New journal implementation
- `/src/evm/vm.zig` - Add snapshot/revert to call handling
- `/src/evm/execution/system.zig` - Add snapshot operations
- `/test/evm/state/journal_test.zig` - New comprehensive tests

### Call Operation Integration
- CREATE/CREATE2 operations need snapshot/revert
- CALL/DELEGATECALL/STATICCALL need snapshot/revert
- Exception handling needs automatic revert
- Gas exhaustion needs proper revert

## Performance Considerations

### Memory Optimization
```zig
// Efficient journal entry allocation
pub const JournalPool = struct {
    entries: std.heap.MemoryPool(JournalEntry),
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) JournalPool {
        return JournalPool{
            .entries = std.heap.MemoryPool(JournalEntry).init(allocator),
            .allocator = allocator,
        };
    }

    pub fn create_entry(self: *JournalPool) !*JournalEntry {
        return try self.entries.create();
    }

    pub fn destroy_entry(self: *JournalPool, entry: *JournalEntry) void {
        self.entries.destroy(entry);
    }
};
```

### Snapshot Optimization
- **Copy-on-Write**: Only copy data when modified
- **Incremental Snapshots**: Only track changes since last snapshot
- **Batch Operations**: Group related changes for efficiency
- **Memory Pooling**: Reuse journal entry allocations

## Complex Scenarios

### Nested Call Reversion
```zig
// Example: A calls B calls C, C reverts, only C's changes are reverted
fn test_nested_call_reversion() !void {
    var vm = VM.init(allocator);
    defer vm.deinit();

    // Contract A calls Contract B
    const snapshot_a = try vm.state.journal.snapshot();
    
    // Contract B calls Contract C  
    const snapshot_b = try vm.state.journal.snapshot();
    
    // Contract C reverts
    try vm.state.journal.revert(snapshot_b, &vm.state);
    
    // Contract B continues and succeeds
    vm.state.journal.commit(snapshot_a);
}
```

### Transaction-Level Reversion
- Full transaction revert on any failure
- Preserve state changes across successful calls within transaction
- Handle complex interaction patterns

### Storage Key Conflicts
- Multiple modifications to same storage slot
- Transient vs permanent storage interactions
- Gas refund tracking with reversion

## Success Criteria

1. **Ethereum Compatibility**: Matches Geth/other client revert behavior
2. **Nested Call Support**: Proper handling of multi-level call stacks
3. **Performance**: Minimal overhead for snapshot/revert operations
4. **Memory Efficiency**: No memory leaks in revert scenarios
5. **Test Coverage**: Comprehensive test suite covering all scenarios
6. **Integration**: Seamless integration with existing EVM components

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Test nested scenarios thoroughly** - Complex call patterns are error-prone
3. **Verify memory management** - No leaks during revert operations
4. **Handle all state types** - Storage, accounts, logs, etc.
5. **Performance testing** - Ensure acceptable overhead
6. **Exception safety** - Proper cleanup on all error paths

## References

- [EVM State Management](https://ethereum.github.io/yellowpaper/paper.pdf)
- [revm Journal Implementation](https://github.com/bluealloy/revm)
- [Geth State Object](https://github.com/ethereum/go-ethereum)
- [Database Transactions Pattern](https://en.wikipedia.org/wiki/Database_transaction)