# EVM Virtual Machine Interface Documentation

This document defines the interface between EVM opcodes and the Virtual Machine (VM) implementation. It serves as a contract that must be maintained for proper opcode execution.

## Table of Contents

1. [Overview](#overview)
2. [Core VM Structure](#core-vm-structure)
3. [Required VM Methods](#required-vm-methods)
4. [Opcode Execution Interface](#opcode-execution-interface)
5. [Frame Context](#frame-context)
6. [Error Handling](#error-handling)
7. [Gas Management](#gas-management)
8. [Memory Management](#memory-management)
9. [Storage Interface](#storage-interface)
10. [External Call Interface](#external-call-interface)
11. [Access List Management](#access-list-management)

## Overview

The VM provides the execution environment for EVM opcodes. Each opcode receives:
- A reference to the VM instance (as `Operation.Interpreter`)
- A reference to the current execution frame (as `Operation.State`)
- The current program counter position

Opcodes return an `ExecutionResult` containing:
- `bytes_consumed`: Number of bytes consumed (default: 1)
- `output`: Optional return data (empty for continued execution)

## Core VM Structure

```zig
pub const Vm = struct {
    allocator: std.mem.Allocator,
    
    // Execution state
    return_data: []u8,
    stack: Stack,
    memory: Memory,
    table: JumpTable,
    depth: u16,
    read_only: bool,
    
    // Storage and state
    storage: std.AutoHashMap(StorageKey, u256),
    balances: std.AutoHashMap(Address.Address, u256),
    code: std.AutoHashMap(Address.Address, []const u8),
    transient_storage: std.AutoHashMap(StorageKey, u256),
    logs: std.ArrayList(Log),
    
    // EIP-2929: Access tracking
    address_access: std.AutoHashMap(Address.Address, bool),
    
    // Transaction context
    tx_origin: Address.Address,
    gas_price: u256,
    block_number: u64,
    block_timestamp: u64,
    block_coinbase: Address.Address,
    block_difficulty: u256,
    block_gas_limit: u64,
    chain_id: u256,
    block_base_fee: u256,
    blob_hashes: []const u256,
    blob_base_fee: u256,
};
```

## Required VM Methods

### Storage Operations

```zig
// Get storage value at address and slot
pub fn get_storage(self: *Vm, address: Address.Address, slot: u256) !u256

// Set storage value at address and slot
pub fn set_storage(self: *Vm, address: Address.Address, slot: u256, value: u256) !void

// Get transient storage value (EIP-1153)
pub fn get_transient_storage(self: *Vm, address: Address.Address, slot: u256) !u256

// Set transient storage value (EIP-1153)
pub fn set_transient_storage(self: *Vm, address: Address.Address, slot: u256, value: u256) !void
```

### Account Management

```zig
// Get account balance
pub fn get_balance(self: *Vm, address: Address.Address) !u256

// Set account balance
pub fn set_balance(self: *Vm, address: Address.Address, balance: u256) !void

// Get account code
pub fn get_code(self: *Vm, address: Address.Address) ![]const u8

// Set account code
pub fn set_code(self: *Vm, address: Address.Address, code: []const u8) !void
```

### Contract Execution

```zig
// Create new contract
pub fn create_contract(
    self: *Vm,
    creator: Address.Address,
    value: u256,
    init_code: []const u8,
    gas: u64
) !CreateResult

// Create contract with salt (CREATE2)
pub fn create2_contract(
    self: *Vm,
    creator: Address.Address,
    value: u256,
    init_code: []const u8,
    salt: u256,
    gas: u64
) !CreateResult

// Call contract
pub fn call_contract(
    self: *Vm,
    caller: Address.Address,
    to: Address.Address,
    value: u256,
    input: []const u8,
    gas: u64,
    is_static: bool
) !CallResult

// Delegate call
pub fn delegatecall_contract(
    self: *Vm,
    current: Address.Address,
    code_address: Address.Address,
    input: []const u8,
    gas: u64,
    is_static: bool
) !CallResult

// Static call
pub fn staticcall_contract(
    self: *Vm,
    caller: Address.Address,
    to: Address.Address,
    input: []const u8,
    gas: u64
) !CallResult

// Call code (deprecated)
pub fn callcode_contract(
    self: *Vm,
    current: Address.Address,
    code_address: Address.Address,
    value: u256,
    input: []const u8,
    gas: u64,
    is_static: bool
) !CallResult
```

### Result Types

```zig
pub const CreateResult = struct {
    success: bool,
    address: Address.Address,
    gas_left: u64,
    output: ?[]const u8,
};

pub const CallResult = struct {
    success: bool,
    gas_left: u64,
    output: ?[]const u8,
};
```

### Logging

```zig
// Emit log event
pub fn emit_log(
    self: *Vm,
    address: Address.Address,
    topics: []const u256,
    data: []const u8
) !void
```

### EIP-2929 Access List Management

```zig
// Mark address as warm and return if it was cold
pub fn mark_address_warm(self: *Vm, address: Address.Address) !bool

// Check if address is cold
pub fn is_address_cold(self: *const Vm, address: Address.Address) bool
```

## Opcode Execution Interface

All opcodes follow this signature:

```zig
pub fn op_example(
    pc: usize,
    interpreter: *Operation.Interpreter,
    state: *Operation.State
) ExecutionError.Error!Operation.ExecutionResult
```

Where:
- `pc`: Current program counter
- `interpreter`: VM instance cast as `Operation.Interpreter`
- `state`: Frame instance cast as `Operation.State`

### Casting Pattern

```zig
const frame = @as(*Frame, @ptrCast(@alignCast(state)));
const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
```

## Frame Context

The Frame structure provides the execution context:

```zig
pub const Frame = struct {
    allocator: std.mem.Allocator,
    
    // Core execution state
    stack: Stack,
    memory: Memory,
    contract: *Contract,
    gas_remaining: u64,
    pc: usize,
    
    // Additional context
    return_data_buffer: []u8,
    input: []const u8,
    depth: u32,
    is_static: bool,
};
```

### Frame Methods

```zig
// Consume gas
pub fn consume_gas(self: *Frame, amount: u64) !void

// Mark storage slot as warm (EIP-2929)
pub fn mark_storage_slot_warm(
    self: *Frame,
    slot: u256,
    original_value: ?u256
) !bool
```

## Error Handling

Opcodes can return these execution errors:

```zig
pub const ExecutionError = error{
    StackUnderflow,
    StackOverflow,
    InvalidJumpDest,
    InvalidOpcode,
    OutOfGas,
    OutOfMemory,
    OutOfOffset,
    WriteProtection,
    CallDepthExceeded,
    InsufficientBalance,
    ContractAddressCollision,
    InvalidInstruction,
    RevertInstruction,
    StaticCallError,
    InvalidCode,
    MaxCodeSizeExceeded,
    Overflow,
    InvalidSignature,
    Stop,
};
```

## Gas Management

### Gas Constants

Available in `gas_constants.zig`:

```zig
pub const GasZero = 0;
pub const GasQuickStep = 2;
pub const GasFastestStep = 3;
pub const GasFastStep = 5;
pub const GasMidStep = 8;
pub const GasSlowStep = 10;
pub const GasExtStep = 20;

// Memory expansion
pub fn memory_gas_cost(old_size: usize, new_size: usize) u64

// Copy operations
pub const CopyGas = 3; // Per word

// Storage operations
pub const SstoreSetGas = 20000;
pub const SstoreResetGas = 5000;
pub const SstoreClearRefund = 15000;
pub const ColdSloadCost = 2100;
pub const WarmStorageReadCost = 100;
```

### Gas Consumption Pattern

```zig
// Calculate dynamic gas
const gas_cost = calculateDynamicGas(params);

// Consume gas
try frame.consume_gas(gas_cost);

// Perform operation
// ...
```

## Memory Management

Memory operations must:
1. Check for valid offsets
2. Calculate memory expansion cost
3. Consume gas before expanding
4. Handle out-of-bounds access

```zig
// Example memory operation pattern
if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
    return ExecutionError.Error.OutOfOffset;
}

const offset_usize = @as(usize, @intCast(offset));
const size_usize = @as(usize, @intCast(size));

// Calculate memory expansion cost
const current_size = frame.memory.context_size();
const new_size = offset_usize + size_usize;
const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
try frame.consume_gas(memory_gas);

// Ensure memory is available
_ = try frame.memory.ensure_context_capacity(new_size);
```

## Storage Interface

Storage operations follow the cold/warm access pattern (EIP-2929):

```zig
// Storage read pattern
const is_cold = try frame.mark_storage_slot_warm(slot, null);
if (is_cold) {
    try frame.consume_gas(gas_constants.ColdSloadCost - gas_constants.WarmStorageReadCost);
}
const value = try vm.get_storage(frame.contract.address, slot);

// Storage write pattern
const current = try vm.get_storage(frame.contract.address, slot);
const is_cold = try frame.mark_storage_slot_warm(slot, current);
if (is_cold) {
    try frame.consume_gas(cold_access_cost);
}
// Calculate SSTORE gas based on current vs new value
// ...
try vm.set_storage(frame.contract.address, slot, new_value);
```

## External Call Interface

External calls must:
1. Check call depth (max 1024)
2. Calculate gas to give
3. Prepare call parameters
4. Handle return data

```zig
// Call pattern
if (frame.depth >= 1024) {
    // Push 0 (failure) but don't error
    try stack_push(&frame.stack, 0);
    return Operation.ExecutionResult{};
}

// Calculate gas for call
const gas_for_call = calculateCallGas(gas_param, frame.gas_remaining);

// Make call
const result = try vm.call_contract(
    caller,
    to,
    value,
    args_slice,
    gas_for_call,
    frame.is_static
);

// Update gas and handle result
frame.gas_remaining -= gas_for_call - result.gas_left;
frame.return_data_buffer = result.output orelse &[_]u8{};
```

## Access List Management

For EIP-2929 (Berlin), addresses and storage slots have cold/warm states:

### Address Access
- First access to an address costs 2600 gas (cold)
- Subsequent accesses cost 100 gas (warm)
- Addresses are warmed by: BALANCE, EXTCODESIZE, EXTCODECOPY, EXTCODEHASH

### Storage Access
- First access to a storage slot costs 2100 gas (cold)
- Subsequent accesses cost 100 gas (warm)
- Slots are warmed by: SLOAD, SSTORE

### Pre-warming
Transaction access lists pre-warm addresses and storage slots:

```zig
// Initialize transaction access list
pub fn init_transaction_access_list(self: *Vm) !void {
    // Pre-warm tx.origin, coinbase, and to address
    _ = try self.mark_address_warm(self.tx_origin);
    _ = try self.mark_address_warm(self.block_coinbase);
    // ... pre-warm access list entries
}
```

## Implementation Notes

1. **Type Safety**: Always use proper type conversions between u256 and usize
2. **Gas First**: Always consume gas before performing operations
3. **Error Propagation**: Use try/catch for proper error handling
4. **Stack Management**: Use helper functions for stack operations to ensure proper error mapping
5. **Memory Safety**: Always check bounds before memory operations
6. **Static Context**: Check `frame.is_static` before state modifications

## Future Extensions

The VM interface is designed to support future EIPs:
- EIP-3074: AUTH and AUTHCALL opcodes
- EIP-3540: EOF (EVM Object Format)
- EIP-4844: Shard blob transactions
- EIP-5656: MCOPY instruction (already implemented)

When adding new features:
1. Extend VM structure with required fields
2. Add new methods following existing patterns
3. Update relevant opcodes to use new functionality
4. Maintain backward compatibility