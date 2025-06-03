# EVM Virtual Machine Interface Documentation

This document defines the interface between the EVM opcodes and the Virtual Machine (VM) implementation. It serves as a contract for implementing a compatible VM that can execute EVM bytecode.

## Table of Contents

1. [Overview](#overview)
2. [Core VM Interface](#core-vm-interface)
3. [State Access Methods](#state-access-methods)
4. [Contract Interaction Methods](#contract-interaction-methods)
5. [Environment Access Methods](#environment-access-methods)
6. [Block Context Methods](#block-context-methods)
7. [Transaction Context Methods](#transaction-context-methods)
8. [Gas Management](#gas-management)
9. [Memory and Stack Management](#memory-and-stack-management)
10. [Access List Management (EIP-2929)](#access-list-management-eip-2929)
11. [Error Handling](#error-handling)

## Overview

The VM interface provides a clean separation between the opcode execution layer and the state management layer. This design allows for:

- Modular testing of opcodes without full VM implementation
- Different VM implementations (e.g., optimized vs. reference)
- Clear boundaries for security and access control
- Efficient state caching and access patterns

## Core VM Interface

The VM must implement the following core interface:

```zig
pub const VM = struct {
    // Core components
    allocator: std.mem.Allocator,
    hardfork: Hardfork,
    
    // State components
    storage: std.AutoHashMap(StorageKey, u256),
    transient_storage: std.AutoHashMap(StorageKey, u256),
    balances: std.AutoHashMap(Address.Address, u256),
    code: std.AutoHashMap(Address.Address, []const u8),
    
    // Block context
    block_number: u64,
    timestamp: u64,
    block_coinbase: Address.Address,
    difficulty: u256,
    gas_limit: u64,
    base_fee: u256,
    blob_hashes: []const u256,
    blob_base_fee: u256,
    
    // Transaction context
    tx_origin: Address.Address,
    gas_price: u256,
    chain_id: u256,
    
    // Access tracking (EIP-2929)
    warm_addresses: std.AutoHashMap(Address.Address, bool),
    warm_storage_slots: std.AutoHashMap(StorageKey, bool),
    
    // Execution results
    logs: std.ArrayList(Log),
    call_result: ?CallResult,
    create_result: ?CreateResult,
    
    // Methods (see sections below)
};
```

## State Access Methods

### Storage Operations

```zig
/// Get storage value at slot for address
/// Returns 0 if slot is uninitialized
pub fn get_storage(self: *VM, address: Address.Address, slot: u256) !u256

/// Set storage value at slot for address
/// May fail with OutOfMemory if storage map needs to grow
pub fn set_storage(self: *VM, address: Address.Address, slot: u256, value: u256) !void

/// Get transient storage value (EIP-1153)
/// Transient storage is cleared after each transaction
pub fn get_transient_storage(self: *VM, address: Address.Address, slot: u256) !u256

/// Set transient storage value (EIP-1153)
pub fn set_transient_storage(self: *VM, address: Address.Address, slot: u256, value: u256) !void
```

### Account Operations

```zig
/// Get balance of address
/// Returns 0 if account doesn't exist
pub fn get_balance(self: *VM, address: Address.Address) u256

/// Set balance of address
/// Creates account if it doesn't exist
pub fn set_balance(self: *VM, address: Address.Address, balance: u256) !void

/// Get code of address
/// Returns empty slice if no code
pub fn get_code(self: *VM, address: Address.Address) []const u8

/// Set code of address
/// Typically only used during contract creation
pub fn set_code(self: *VM, address: Address.Address, code: []const u8) !void

/// Get code size without loading full code
pub fn get_code_size(self: *VM, address: Address.Address) usize

/// Get code hash (keccak256 of code)
/// Returns hash of empty string for non-existent accounts
pub fn get_code_hash(self: *VM, address: Address.Address) u256
```

## Contract Interaction Methods

### Contract Creation

```zig
pub const CreateResult = struct {
    success: bool,
    address: Address.Address,
    gas_left: u64,
    output: ?[]const u8,
};

/// Create new contract (CREATE opcode)
/// @param caller The address creating the contract
/// @param value Wei to transfer to new contract
/// @param init_code Contract initialization code
/// @param gas Gas allocated for creation
/// @param salt Not used for CREATE (only CREATE2)
pub fn create_contract(
    self: *VM,
    caller: Address.Address,
    value: u256,
    init_code: []const u8,
    gas: u64,
    salt: ?u256,
) CreateResult
```

### Contract Calls

```zig
pub const CallResult = struct {
    success: bool,
    gas_left: u64,
    output: ?[]const u8,
};

pub const CallType = enum {
    Call,        // Normal call with value transfer
    CallCode,    // Execute code in caller's context (deprecated)
    DelegateCall,// Execute code in caller's context
    StaticCall,  // Read-only call, no state modifications
};

/// Call contract
/// @param call_type Type of call (CALL, DELEGATECALL, etc.)
/// @param caller Address making the call
/// @param to Address being called
/// @param value Wei to transfer (0 for DELEGATECALL/STATICCALL)
/// @param input Call data
/// @param gas Gas allocated for call
pub fn call_contract(
    self: *VM,
    call_type: CallType,
    caller: Address.Address,
    to: Address.Address,
    value: u256,
    input: []const u8,
    gas: u64,
) CallResult
```

## Environment Access Methods

These methods provide access to execution environment data:

```zig
/// Get current executing address (ADDRESS opcode)
pub fn get_address(self: *VM, frame: *const Frame) Address.Address {
    return frame.contract.address;
}

/// Get transaction origin (ORIGIN opcode)
pub fn get_origin(self: *VM) Address.Address {
    return self.tx_origin;
}

/// Get caller address (CALLER opcode)
pub fn get_caller(self: *VM, frame: *const Frame) Address.Address {
    return frame.contract.caller;
}

/// Get call value (CALLVALUE opcode)
pub fn get_call_value(self: *VM, frame: *const Frame) u256 {
    return frame.contract.value;
}

/// Get gas price (GASPRICE opcode)
pub fn get_gas_price(self: *VM) u256 {
    return self.gas_price;
}

/// Get chain ID (CHAINID opcode)
pub fn get_chain_id(self: *VM) u256 {
    return self.chain_id;
}
```

## Block Context Methods

These methods provide access to block information:

```zig
/// Get block hash by number (BLOCKHASH opcode)
/// Returns 0 for blocks outside the 256 block window
pub fn get_block_hash(self: *VM, block_number: u64) u256

/// Get current block number (NUMBER opcode)
pub fn get_block_number(self: *VM) u64 {
    return self.block_number;
}

/// Get block timestamp (TIMESTAMP opcode)
pub fn get_timestamp(self: *VM) u64 {
    return self.timestamp;
}

/// Get block coinbase (COINBASE opcode)
pub fn get_coinbase(self: *VM) Address.Address {
    return self.block_coinbase;
}

/// Get block difficulty/prevrandao (DIFFICULTY opcode)
pub fn get_difficulty(self: *VM) u256 {
    return self.difficulty;
}

/// Get block gas limit (GASLIMIT opcode)
pub fn get_gas_limit(self: *VM) u64 {
    return self.gas_limit;
}

/// Get base fee (BASEFEE opcode, London+)
pub fn get_base_fee(self: *VM) u256 {
    return self.base_fee;
}

/// Get blob hash by index (BLOBHASH opcode, Cancun+)
pub fn get_blob_hash(self: *VM, index: u256) u256

/// Get blob base fee (BLOBBASEFEE opcode, Cancun+)
pub fn get_blob_base_fee(self: *VM) u256 {
    return self.blob_base_fee;
}
```

## Transaction Context Methods

### Log Emission

```zig
pub const Log = struct {
    address: Address.Address,
    topics: []const u8, // Each topic is 32 bytes
    data: []const u8,
};

/// Emit log event (LOG0-LOG4 opcodes)
/// @param address Contract emitting the log
/// @param topics Array of 32-byte topics (0-4 topics)
/// @param data Arbitrary length log data
pub fn emit_log(
    self: *VM,
    address: Address.Address,
    topics: []const u256,
    data: []const u8,
) !void
```

## Gas Management

Gas is managed at the Frame level, but the VM must provide gas costs:

```zig
/// Calculate dynamic gas cost for memory expansion
pub fn memory_gas_cost(memory_size: u64) u64

/// Calculate dynamic gas cost for EXP opcode
pub fn exp_gas_cost(exponent: u256) u64

/// Calculate dynamic gas cost for copy operations
pub fn copy_gas_cost(size: u64) u64
```

## Memory and Stack Management

Memory and stack are managed by the Frame, not the VM directly:

```zig
pub const Frame = struct {
    // Stack (managed by Stack module)
    stack: Stack,
    
    // Memory (managed by Memory module)
    memory: Memory,
    
    // Gas tracking
    gas_remaining: u64,
    
    // Execution context
    contract: *Contract,
    pc: usize,
    depth: u32,
    is_static: bool,
    
    // Return data from last call
    return_data_buffer: []u8,
    
    // Call data
    input: []const u8,
};
```

## Access List Management (EIP-2929)

For Berlin+ hardforks, the VM must track cold/warm access:

```zig
/// Check if address is cold (not accessed in this transaction)
pub fn is_address_cold(self: *VM, address: Address.Address) bool

/// Mark address as warm (accessed)
pub fn mark_address_warm(self: *VM, address: Address.Address) !void

/// Check if storage slot is cold
pub fn is_storage_cold(self: *VM, address: Address.Address, slot: u256) bool

/// Mark storage slot as warm
pub fn mark_storage_warm(self: *VM, address: Address.Address, slot: u256) !void

/// Clear access lists for new transaction
pub fn clear_access_list(self: *VM) void

/// Pre-warm addresses from transaction access list (EIP-2930)
pub fn pre_warm_addresses(self: *VM, addresses: []const Address.Address) !void

/// Pre-warm storage slots from transaction access list
pub fn pre_warm_storage_slots(
    self: *VM,
    slots: []const struct { address: Address.Address, slot: u256 }
) !void

/// Initialize access list with transaction participants
pub fn init_transaction_access_list(
    self: *VM,
    origin: Address.Address,
    to: ?Address.Address,
) !void
```

## Error Handling

The VM should map internal errors to ExecutionError types:

```zig
- OutOfMemory → OutOfGas (memory allocation failures)
- Storage/Balance errors → OutOfGas
- Invalid operations → appropriate ExecutionError variant
```

## Implementation Notes

1. **State Isolation**: Each call creates a new execution context. State changes should be reverted on failure.

2. **Gas Calculation**: Gas costs should be calculated before state modifications to ensure atomicity.

3. **Static Context**: In static calls, any state-modifying operation should fail with WriteProtection error.

4. **Depth Limit**: Call depth is limited to 1024. CREATE and CALL operations at max depth should fail gracefully.

5. **Memory Safety**: All memory accesses should be bounds-checked. The VM should never panic on invalid input.

6. **Determinism**: All operations must be deterministic. Random number generation, system time, etc. must come from block context.

## Testing Considerations

The VM interface should be easily mockable for testing:

```zig
pub const TestVm = struct {
    vm: VM,
    
    // Helper methods for test setup
    pub fn init(allocator: std.mem.Allocator) !TestVm
    pub fn deinit(self: *TestVm) void
    pub fn setAccount(self: *TestVm, address: Address.Address, balance: u256, code: []const u8) !void
    pub fn setStorage(self: *TestVm, address: Address.Address, slot: u256, value: u256) !void
    // ... etc
};
```

This allows opcodes to be tested in isolation without a full blockchain implementation.