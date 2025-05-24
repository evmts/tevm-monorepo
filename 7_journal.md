# Journal Implementation Issue

## Overview

Journal.zig provides a transaction journal for tracking and reverting state changes during EVM execution with support for nested call contexts, access lists, and efficient checkpointing.

## Requirements

- Track all state modifications during execution
- Support nested checkpoints for call hierarchy
- Enable efficient reversion to any checkpoint
- Maintain access lists for accounts and storage (EIP-2929)
- Track account creation/destruction lifecycle
- Log entries management with topic indexing
- Support for warm/cold access tracking
- Memory-efficient change tracking
- Thread-safe checkpoint management
- Integration with StateDB for persistence

## Interface

```zig
const std = @import("std");
const Address = @import("address").Address;
const B256 = @import("utils").B256;

pub const JournalError = error{
    NoCheckpoint,
    InvalidCheckpoint,
    OutOfMemory,
};

/// Types of changes that can be journaled
pub const ChangeType = enum {
    AccountCreated,
    AccountDestroyed,
    BalanceChange,
    NonceChange,
    CodeChange,
    StorageChange,
    StorageCleared,
    Touched,
    AccessListAccount,
    AccessListStorage,
    Log,
    Refund,
};

/// A single change entry in the journal
pub const Change = union(ChangeType) {
    AccountCreated: struct {
        address: Address,
    },
    AccountDestroyed: struct {
        address: Address,
        balance: u256,
        nonce: u64,
        code_hash: B256,
    },
    BalanceChange: struct {
        address: Address,
        prev: u256,
    },
    NonceChange: struct {
        address: Address,
        prev: u64,
    },
    CodeChange: struct {
        address: Address,
        prev_hash: B256,
        prev_code: []const u8,
    },
    StorageChange: struct {
        address: Address,
        key: B256,
        prev: B256,
    },
    StorageCleared: struct {
        address: Address,
        storage: std.AutoHashMap(B256, B256),
    },
    Touched: struct {
        address: Address,
    },
    AccessListAccount: struct {
        address: Address,
    },
    AccessListStorage: struct {
        address: Address,
        key: B256,
    },
    Log: struct {
        address: Address,
        topics: []const B256,
        data: []const u8,
    },
    Refund: struct {
        amount: u64,
    },
};

/// Checkpoint represents a point in time to which we can revert
pub const Checkpoint = struct {
    /// Index in the changes array where this checkpoint starts
    change_index: usize,
    /// Log index at this checkpoint
    log_index: usize,
    /// Refund counter at this checkpoint
    refund: u64,
};

pub const Journal = struct {
    /// All changes made during execution
    changes: std.ArrayList(Change),
    /// Stack of checkpoints for nested calls
    checkpoints: std.ArrayList(Checkpoint),
    /// All logs emitted during execution
    logs: std.ArrayList(Change.Log),
    /// Current refund counter
    refund: u64,
    /// Warm account addresses (EIP-2929)
    warm_accounts: std.AutoHashMap(Address, void),
    /// Warm storage slots per account (EIP-2929)
    warm_storage: std.AutoHashMap(Address, std.AutoHashMap(B256, void)),
    /// Allocator for memory management
    allocator: std.mem.Allocator,

    // Initialization

    /// Create a new journal
    pub fn init(allocator: std.mem.Allocator) !Journal

    /// Create with pre-allocated capacity
    pub fn initWithCapacity(allocator: std.mem.Allocator, capacity: usize) !Journal

    /// Clean up resources
    pub fn deinit(self: *Journal) void

    // Checkpoint Management

    /// Create a new checkpoint at the current state
    pub fn checkpoint(self: *Journal) !void

    /// Revert to the most recent checkpoint
    pub fn revert(self: *Journal) JournalError!void

    /// Commit the most recent checkpoint (merge with parent)
    pub fn commit(self: *Journal) JournalError!void

    /// Get the current checkpoint depth
    pub fn depth(self: *const Journal) usize

    // State Change Recording

    /// Record account creation
    pub fn recordAccountCreated(self: *Journal, address: Address) !void

    /// Record account destruction
    pub fn recordAccountDestroyed(
        self: *Journal,
        address: Address,
        balance: u256,
        nonce: u64,
        code_hash: B256
    ) !void

    /// Record balance change
    pub fn recordBalanceChange(self: *Journal, address: Address, prev: u256) !void

    /// Record nonce change
    pub fn recordNonceChange(self: *Journal, address: Address, prev: u64) !void

    /// Record code change
    pub fn recordCodeChange(
        self: *Journal,
        address: Address,
        prev_hash: B256,
        prev_code: []const u8
    ) !void

    /// Record storage change
    pub fn recordStorageChange(self: *Journal, address: Address, key: B256, prev: B256) !void

    /// Record storage cleared
    pub fn recordStorageCleared(
        self: *Journal,
        address: Address,
        storage: std.AutoHashMap(B256, B256)
    ) !void

    /// Record account touched (for empty account cleanup)
    pub fn recordTouched(self: *Journal, address: Address) !void

    // Access List Management (EIP-2929)

    /// Add account to access list
    pub fn accessAccount(self: *Journal, address: Address) !bool

    /// Add storage slot to access list
    pub fn accessStorage(self: *Journal, address: Address, key: B256) !bool

    /// Check if account is warm
    pub fn isWarmAccount(self: *const Journal, address: Address) bool

    /// Check if storage slot is warm
    pub fn isWarmStorage(self: *const Journal, address: Address, key: B256) bool

    // Log Management

    /// Record a log entry
    pub fn recordLog(self: *Journal, address: Address, topics: []const B256, data: []const u8) !void

    /// Get all logs
    pub fn getLogs(self: *const Journal) []const Change.Log

    /// Clear all logs (used after successful execution)
    pub fn clearLogs(self: *Journal) void

    // Refund Management

    /// Add gas refund
    pub fn addRefund(self: *Journal, amount: u64) !void

    /// Subtract gas refund (with underflow protection)
    pub fn subRefund(self: *Journal, amount: u64) !void

    /// Get current refund amount
    pub fn getRefund(self: *const Journal) u64

    // Utility Functions

    /// Clear the journal (remove all changes and checkpoints)
    pub fn clear(self: *Journal) void

    /// Get the number of changes
    pub fn changeCount(self: *const Journal) usize

    /// Check if journal is empty
    pub fn isEmpty(self: *const Journal) bool

    /// Apply a single change (used internally during revert)
    fn applyRevert(self: *Journal, change: *const Change) !void

    /// Clone a change entry (for storage in journal)
    fn cloneChange(self: *Journal, change: Change) !Change
};
```

## Implementation Details

### Change Tracking

Changes are stored in a linear array for efficient iteration during revert:
```zig
// Efficient revert implementation
pub fn revert(self: *Journal) JournalError!void {
    const checkpoint = self.checkpoints.popOrNull() orelse return error.NoCheckpoint;
    
    // Revert changes in reverse order
    while (self.changes.items.len > checkpoint.change_index) {
        const change = self.changes.pop();
        try self.applyRevert(&change);
        
        // Free any allocated memory in the change
        self.freeChange(&change);
    }
    
    // Revert logs and refund counter
    self.logs.shrinkRetainingCapacity(checkpoint.log_index);
    self.refund = checkpoint.refund;
}
```

### Access List Optimization

Warm/cold tracking uses nested hash maps for O(1) lookups:
```zig
pub fn accessStorage(self: *Journal, address: Address, key: B256) !bool {
    // Check if already warm
    if (self.warm_storage.get(address)) |storage_map| {
        if (storage_map.contains(key)) {
            return false; // Already warm
        }
    }
    
    // Add to warm set
    var storage_map = self.warm_storage.get(address) orelse blk: {
        const new_map = std.AutoHashMap(B256, void).init(self.allocator);
        try self.warm_storage.put(address, new_map);
        break :blk self.warm_storage.getPtr(address).?;
    };
    
    try storage_map.put(key, {});
    
    // Record in journal for revert
    try self.changes.append(.{ .AccessListStorage = .{
        .address = address,
        .key = key,
    }});
    
    return true; // Was cold
}
```

### Memory Management

The journal must carefully manage memory for cloned data:
```zig
fn cloneChange(self: *Journal, change: Change) !Change {
    return switch (change) {
        .CodeChange => |c| .{
            .CodeChange = .{
                .address = c.address,
                .prev_hash = c.prev_hash,
                .prev_code = try self.allocator.dupe(u8, c.prev_code),
            },
        },
        .StorageCleared => |c| .{
            .StorageCleared = .{
                .address = c.address,
                .storage = try c.storage.clone(),
            },
        },
        .Log => |l| .{
            .Log = .{
                .address = l.address,
                .topics = try self.allocator.dupe(B256, l.topics),
                .data = try self.allocator.dupe(u8, l.data),
            },
        },
        // Simple value types can be copied directly
        else => change,
    };
}
```

## Usage Example

```zig
// Create journal for transaction execution
var journal = try Journal.init(allocator);
defer journal.deinit();

// Start transaction
try journal.checkpoint();

// Track account access (EIP-2929)
const was_cold = try journal.accessAccount(contract_address);
const access_cost = if (was_cold) COLD_ACCOUNT_ACCESS_COST else WARM_STORAGE_READ_COST;

// Record state changes
try journal.recordBalanceChange(sender, sender_balance);
sender_balance -= value;

try journal.recordBalanceChange(receiver, receiver_balance);
receiver_balance += value;

// Execute contract with nested checkpoint
try journal.checkpoint();
const result = try executeContract(vm, contract);

if (result == .Revert) {
    // Revert nested call
    try journal.revert();
} else {
    // Commit nested call
    try journal.commit();
    
    // Record logs from successful execution
    for (result.logs) |log| {
        try journal.recordLog(log.address, log.topics, log.data);
    }
}

// Transaction successful - get logs and commit
const logs = journal.getLogs();
try journal.commit();
```

## Performance Considerations

1. **Linear Change Array**: Changes stored sequentially for cache-friendly iteration
2. **Checkpoint Stack**: Minimal overhead for nested calls
3. **Lazy Allocation**: Storage maps created only when needed
4. **Memory Pooling**: Reuse allocated buffers where possible
5. **Access Pattern**: Optimize for forward recording, backward reverting

## Testing Requirements

1. **Basic Operations**:
   - Test all change types recording and reverting
   - Test checkpoint creation and management
   - Test nested checkpoints (simulate call stack)

2. **Access Lists**:
   - Test account warm/cold tracking
   - Test storage slot warm/cold tracking
   - Test access list persistence across checkpoints

3. **Edge Cases**:
   - Test revert with no checkpoint
   - Test deeply nested checkpoints
   - Test large storage clearing
   - Test memory limits

4. **Integration**:
   - Test with StateDB integration
   - Test with concurrent modifications
   - Test transaction lifecycle

## References

- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - Gas cost increases for state access
- [Go-Ethereum journal.go](https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go)
- [revm JournaledState](https://github.com/bluealloy/revm/blob/main/crates/revm/src/journaled_state.rs)