# Implement State VTable Interface

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `refactor_implement_state_vtable_interface` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/refactor_implement_state_vtable_interface refactor_implement_state_vtable_interface`
3. **Work in isolation**: `cd g/refactor_implement_state_vtable_interface`
4. **Commit message**: `♻️ refactor: implement State vtable interface for pluggable state backends`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Refactor the current State implementation to use a vtable interface pattern, making it possible to plug in different state backend implementations. This architectural change will enable future support for different storage backends (in-memory, disk-based, remote, etc.) without changing the EVM execution logic.

## Current State Analysis

### Current Implementation
File: `/Users/williamcory/tevm/main/src/evm/state/state.zig`
- Concrete implementation with HashMap-based storage
- Direct method calls throughout EVM code
- Single implementation tied to specific storage approach

### Usage Points
The State is used throughout the EVM implementation:
- `/src/evm/vm.zig` - VM execution context
- `/src/evm/execution/*.zig` - Opcode implementations (SLOAD, SSTORE, etc.)
- `/src/evm/frame.zig` - Execution frame context

## Architecture Goals

### Pluggable Backends
Enable different state implementations:
1. **InMemoryState** - Current HashMap-based implementation
2. **PersistentState** - Disk-based storage for large states
3. **ForkedState** - State that reads from remote provider (for mainnet forking)
4. **CachedState** - Layered caching on top of other backends
5. **TestState** - Optimized for testing with easy reset/snapshot

### Interface Design Principles
1. **Zero Runtime Cost**: Vtable dispatch should be compile-time where possible
2. **Type Safety**: Interface should prevent incorrect usage
3. **Memory Management**: Clear ownership and lifetime semantics
4. **Async Support**: Interface should support async backends (future)

## Implementation Approach

### Zig Interface Pattern
Use Zig's interface pattern with function pointers:
```zig
pub const StateInterface = struct {
    ptr: *anyopaque,
    vtable: *const VTable,
    
    pub const VTable = struct {
        get_account: *const fn (ptr: *anyopaque, address: Address) ?Account,
        set_account: *const fn (ptr: *anyopaque, address: Address, account: Account) void,
        get_storage: *const fn (ptr: *anyopaque, address: Address, key: U256) U256,
        set_storage: *const fn (ptr: *anyopaque, address: Address, key: U256, value: U256) void,
        // ... other methods
    };
    
    pub fn get_account(self: StateInterface, address: Address) ?Account {
        return self.vtable.get_account(self.ptr, address);
    }
    
    // ... wrapper methods for all vtable functions
};
```

### Alternative: Comptime Interface
Use Zig's comptime for zero-cost abstraction:
```zig
pub fn StateInterface(comptime Impl: type) type {
    return struct {
        impl: Impl,
        
        pub fn get_account(self: *@This(), address: Address) ?Account {
            return self.impl.get_account(address);
        }
        
        // Compile-time verification that Impl has required methods
        comptime {
            const info = @typeInfo(Impl);
            if (!@hasDecl(Impl, "get_account")) @compileError("State implementation must have get_account method");
            // ... check all required methods
        }
    };
}
```

## Interface Definition

### Core State Methods
```zig
pub const StateVTable = struct {
    // Account management
    account_exists: *const fn (ptr: *anyopaque, address: Address) bool,
    get_account: *const fn (ptr: *anyopaque, address: Address) ?Account,
    set_account: *const fn (ptr: *anyopaque, address: Address, account: Account) void,
    delete_account: *const fn (ptr: *anyopaque, address: Address) void,
    
    // Balance operations
    get_balance: *const fn (ptr: *anyopaque, address: Address) U256,
    set_balance: *const fn (ptr: *anyopaque, address: Address, balance: U256) void,
    add_balance: *const fn (ptr: *anyopaque, address: Address, amount: U256) void,
    sub_balance: *const fn (ptr: *anyopaque, address: Address, amount: U256) bool,
    
    // Nonce operations
    get_nonce: *const fn (ptr: *anyopaque, address: Address) u64,
    set_nonce: *const fn (ptr: *anyopaque, address: Address, nonce: u64) void,
    increment_nonce: *const fn (ptr: *anyopaque, address: Address) void,
    
    // Code operations
    get_code: *const fn (ptr: *anyopaque, address: Address) []const u8,
    set_code: *const fn (ptr: *anyopaque, address: Address, code: []const u8) void,
    get_code_hash: *const fn (ptr: *anyopaque, address: Address) Hash,
    
    // Storage operations
    get_storage: *const fn (ptr: *anyopaque, address: Address, key: U256) U256,
    set_storage: *const fn (ptr: *anyopaque, address: Address, key: U256, value: U256) void,
    
    // Transient storage (EIP-1153)
    get_transient_storage: *const fn (ptr: *anyopaque, address: Address, key: U256) U256,
    set_transient_storage: *const fn (ptr: *anyopaque, address: Address, key: U256, value: U256) void,
    
    // Log operations
    add_log: *const fn (ptr: *anyopaque, log: Log) void,
    get_logs: *const fn (ptr: *anyopaque) []const Log,
    
    // State management
    checkpoint: *const fn (ptr: *anyopaque) StateCheckpoint,
    revert_to_checkpoint: *const fn (ptr: *anyopaque, checkpoint: StateCheckpoint) void,
    commit_checkpoint: *const fn (ptr: *anyopaque, checkpoint: StateCheckpoint) void,
    
    // Cleanup
    deinit: *const fn (ptr: *anyopaque) void,
};
```

## Implementation Tasks

### Task 1: Define State Interface
File: `/src/evm/state/state_interface.zig`
- Define the vtable structure
- Create wrapper methods for type-safe access
- Define common types (Account, Log, StateCheckpoint, etc.)

### Task 2: Refactor Current State Implementation
File: `/src/evm/state/in_memory_state.zig` (renamed from state.zig)
- Implement the vtable interface for current HashMap-based state
- Maintain all existing functionality
- Ensure no behavior changes

### Task 3: Create State Factory
File: `/src/evm/state/state_factory.zig`
```zig
pub const StateType = enum {
    in_memory,
    // Future: persistent, forked, cached, etc.
};

pub fn createState(allocator: Allocator, state_type: StateType) !StateInterface {
    switch (state_type) {
        .in_memory => {
            const impl = try allocator.create(InMemoryState);
            impl.* = InMemoryState.init(allocator);
            return impl.interface();
        },
    }
}
```

### Task 4: Update EVM Integration Points
Update all files that use State:
- `/src/evm/vm.zig` - Update to use StateInterface
- `/src/evm/frame.zig` - Update state field type
- `/src/evm/execution/storage.zig` - Update SLOAD/SSTORE implementations
- `/src/evm/execution/environment.zig` - Update balance/nonce operations
- `/src/evm/execution/log.zig` - Update log operations

### Task 5: Maintain API Compatibility
Ensure existing code continues to work:
```zig
// Provide convenience constructors
pub fn createInMemoryState(allocator: Allocator) !StateInterface {
    return createState(allocator, .in_memory);
}

// Type alias for backward compatibility during transition
pub const State = StateInterface;
```

### Task 6: Comprehensive Testing
File: `/test/evm/state/state_interface_test.zig`
- Test that interface works with existing state implementation
- Verify all methods work correctly through vtable
- Test state factory creation
- Ensure no performance regression

## Migration Strategy

### Phase 1: Interface Definition
1. Create the interface types
2. Implement interface for current state
3. Ensure tests pass with new interface

### Phase 2: Integration Updates
1. Update VM and Frame to use interface
2. Update all opcode implementations
3. Maintain backward compatibility

### Phase 3: Validation
1. Run full test suite
2. Performance benchmarking
3. Memory usage analysis

## Performance Considerations

### Vtable Dispatch Cost
```zig
// Measure performance impact of vtable dispatch
test "vtable performance vs direct calls" {
    const iterations = 1_000_000;
    
    // Direct call benchmark
    var timer = std.time.Timer.start();
    for (0..iterations) |_| {
        _ = direct_state.get_balance(address);
    }
    const direct_time = timer.read();
    
    // Vtable call benchmark
    timer.reset();
    for (0..iterations) |_| {
        _ = interface_state.get_balance(address);
    }
    const vtable_time = timer.read();
    
    // Should be minimal overhead
    try std.testing.expect(vtable_time < direct_time * 1.1);
}
```

### Memory Layout
```zig
// Optimize for cache locality
pub const StateInterface = struct {
    ptr: *anyopaque,
    vtable: *const VTable,
    
    // Keep frequently used methods at the beginning of vtable
    pub const VTable = struct {
        // Hot path methods first
        get_storage: *const fn (ptr: *anyopaque, address: Address, key: U256) U256,
        set_storage: *const fn (ptr: *anyopaque, address: Address, key: U256, value: U256) void,
        get_balance: *const fn (ptr: *anyopaque, address: Address) U256,
        
        // Less frequent methods later
        add_log: *const fn (ptr: *anyopaque, log: Log) void,
        checkpoint: *const fn (ptr: *anyopaque) StateCheckpoint,
        // ...
    };
};
```

## Future Extension Points

### Async State Support
```zig
// Future: async methods for remote state backends
pub const AsyncStateVTable = struct {
    get_storage_async: *const fn (ptr: *anyopaque, address: Address, key: U256) AsyncResult(U256),
    set_storage_async: *const fn (ptr: *anyopaque, address: Address, key: U256, value: U256) AsyncResult(void),
    // ...
};
```

### State Backend Types
Enable future implementations:
1. **ForkedState**: Reads from remote Ethereum node, caches locally
2. **LayeredState**: Multiple state layers with different priorities
3. **SnapshotState**: Immutable state snapshots for parallel execution
4. **CompressedState**: Memory-efficient state for large simulations

## Testing Strategy

### Interface Compliance Testing
```zig
// Test that any state implementation satisfies the interface
pub fn testStateInterface(state: StateInterface) !void {
    const address = Address.fromInt(0x123);
    const key = U256.fromInt(0x456);
    const value = U256.fromInt(0x789);
    
    // Test storage operations
    try testing.expectEqual(U256.zero(), state.get_storage(address, key));
    state.set_storage(address, key, value);
    try testing.expectEqual(value, state.get_storage(address, key));
    
    // Test all other interface methods...
}
```

### Performance Regression Testing
```zig
test "state interface performance" {
    const allocator = testing.allocator;
    const state = try createInMemoryState(allocator);
    defer state.deinit();
    
    // Benchmark common operations
    const iterations = 100_000;
    var timer = std.time.Timer.start();
    
    for (0..iterations) |i| {
        const addr = Address.fromInt(i);
        const key = U256.fromInt(i);
        const value = U256.fromInt(i * 2);
        
        state.set_storage(addr, key, value);
        _ = state.get_storage(addr, key);
    }
    
    const elapsed = timer.read();
    // Should complete within reasonable time
    try testing.expect(elapsed < std.time.ns_per_s); // < 1 second
}
```

## Success Criteria

1. **No Behavior Changes**: All existing functionality works identically
2. **Performance**: <5% overhead from vtable dispatch
3. **Type Safety**: Interface prevents incorrect usage at compile time
4. **Extensibility**: Easy to add new state backend implementations
5. **Test Coverage**: All interface methods tested thoroughly
6. **Memory Safety**: No memory leaks or undefined behavior

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Maintain backward compatibility** - Existing code should not break
3. **Zero behavior changes** - Same functionality, different architecture
4. **Performance validation** - Measure and verify minimal overhead
5. **Memory management** - Clear ownership and cleanup patterns
6. **Type safety** - Interface should catch errors at compile time

## References

- [Zig Interfaces Pattern](https://ziglearn.org/chapter-2/#interfaces)
- [Design Patterns in Systems Programming](https://www.informit.com/articles/article.aspx?p=1398618)
- [Ethereum State Management](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/)
- [Plugin Architecture Patterns](https://martinfowler.com/articles/plugins.html)