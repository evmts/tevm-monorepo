# StateManager.zig - EVM State Management with EIP-2929 Support

This document describes the Tevm StateManager implementation which provides the primary interface for EVM state operations with built-in support for EIP-2929 access list gas metering.

## Overview

The StateManager serves as an intermediary layer between the EVM and the state database (StateDB). It enhances state operations with:
- EIP-2929 access list tracking for accurate gas metering
- Transaction context management
- Automatic warm/cold access detection
- Integration with state snapshots and reverts

## Implementation Details

### Core Structure

```zig
pub const StateManager = struct {
    state: *StateDB,                    // Underlying state database
    access_list: AccessList,            // EIP-2929 warm/cold tracking
    tx_context: ?TransactionContext,    // Current transaction info
    allocator: std.mem.Allocator,       // Memory management
}
```

### AccessList Implementation

The AccessList tracks warm addresses and storage slots for EIP-2929:

```zig
pub const AccessList = struct {
    addresses: std.AutoHashMap(Address, void),           // Warm addresses
    slots: std.AutoHashMap(Address, SlotSet),          // Warm storage slots per address
    allocator: std.mem.Allocator,
}
```

Key methods:
- `isAddressWarm(address)` - Check if address was accessed
- `isSlotWarm(address, slot)` - Check if storage slot was accessed
- `markAddressWarm(address)` - Mark address as accessed, return if was cold
- `markSlotWarm(address, slot)` - Mark slot as accessed, return if was cold

### Transaction Context

```zig
pub const TransactionContext = struct {
    sender: Address,                    // Transaction sender
    recipient: ?Address,                // Transaction recipient (null for create)
    prewarm_addresses: []const Address, // EIP-2930 access list addresses
    prewarm_slots: []const StorageSlot, // EIP-2930 access list slots
}
```

### Core Operations

#### State Access Methods

All getter methods return both the value and cold access information:

```zig
pub fn getBalance(self: *StateManager, address: Address) !struct { balance: u256, cold: bool }
pub fn getCode(self: *StateManager, address: Address) !struct { code: []const u8, cold: bool }
pub fn getCodeHash(self: *StateManager, address: Address) !struct { hash: B256, cold: bool }
pub fn getCodeSize(self: *StateManager, address: Address) !struct { size: usize, cold: bool }
pub fn getNonce(self: *StateManager, address: Address) !struct { nonce: u64, cold: bool }
```

Storage access returns two cold flags:
```zig
pub fn getStorage(self: *StateManager, address: Address, key: B256) !struct { 
    value: B256, 
    cold_address: bool,    // Was address cold?
    cold_slot: bool        // Was slot cold?
}
```

#### State Modification Methods

```zig
pub fn setStorage(self: *StateManager, address: Address, key: B256, value: B256) !struct {
    cold_address: bool,
    cold_slot: bool
}
pub fn createAccount(self: *StateManager, address: Address) !void
pub fn setCode(self: *StateManager, address: Address, code: []const u8) !void
pub fn addBalance(self: *StateManager, address: Address, amount: u256) !bool  // Returns if cold
pub fn subBalance(self: *StateManager, address: Address, amount: u256) !bool  // Returns if cold
```

#### Transaction Management

```zig
pub fn beginTransaction(
    self: *StateManager,
    sender: Address,
    recipient: ?Address,
    prewarm_addresses: []const Address,
    prewarm_slots: []const StorageSlot
) !void
```

## EIP-2929 Gas Metering

### Background

EIP-2929 introduced different gas costs for "cold" (first access) vs "warm" (subsequent access) state operations:
- Cold account access: 2600 gas
- Warm account access: 100 gas
- Cold storage slot: 2100 gas
- Warm storage slot: 100 gas

### Implementation Strategy

1. **Automatic Tracking**: Every state access automatically updates the access list
2. **Cold Detection**: Methods return whether access was cold for gas calculation
3. **Transaction Scoping**: Each transaction gets a fresh access list
4. **Prewarming**: EIP-2930 access lists pre-warm specified addresses/slots

### Usage Example

```zig
// Get balance and check if cold
const result = try state_manager.getBalance(address);
const gas_cost = if (result.cold) 2600 else 100;

// Storage access with dual cold flags
const storage = try state_manager.getStorage(address, slot);
var gas_cost: u64 = 0;
if (storage.cold_address) gas_cost += 2100;
if (storage.cold_slot) gas_cost += 2000;
```

## Comparison with Other Implementations

### Access List Management

| Implementation | Access Tracking | Integration | Gas Calculation |
|----------------|-----------------|-------------|-----------------|
| Tevm (Zig) | Separate AccessList | Return cold flags | Caller calculates |
| go-ethereum | AccessListState | Integrated | Automatic |
| revm (Rust) | JournaledState | Status bits | Built-in |
| evmone | Host callbacks | External | Host managed |

### Key Differences

#### 1. Separation of Concerns

**Tevm**:
- StateManager handles access tracking
- StateDB handles storage
- Clean separation of responsibilities

**go-ethereum**:
- AccessListState wraps StateDB
- More integrated approach
- Complex inheritance hierarchy

**revm**:
- All-in-one JournaledState
- Status bits for everything
- Highly optimized

#### 2. Cold Access Reporting

**Tevm**:
```zig
// Explicit cold flag in return value
const result = try getBalance(address);
if (result.cold) { /* charge cold gas */ }
```

**go-ethereum**:
- Implicit in gas calculation
- Less visible to caller

**revm**:
- Returns access status
- Can query warm/cold state

#### 3. Transaction Context

**Tevm**:
- Explicit transaction context
- Clear transaction boundaries
- Supports EIP-2930 prewarming

**Others**:
- Various approaches
- Often more implicit

## Integration with EVM

### SLOAD Operation
```zig
const result = try state_manager.getStorage(address, key);
// Calculate gas based on cold flags
var gas_cost: u64 = 100;  // Base warm cost
if (result.cold_address) gas_cost += 2000;
if (result.cold_slot) gas_cost += 2000;
```

### BALANCE Operation
```zig
const result = try state_manager.getBalance(address);
const gas_cost = if (result.cold) 2600 else 100;
```

### Transaction Processing
```zig
// Begin new transaction
try state_manager.beginTransaction(sender, recipient, access_list_addresses, access_list_slots);

// Execute transaction...

// Access list automatically tracks all accesses
```

## Best Practices

1. **Always Check Cold Flags**:
   ```zig
   const result = try state_manager.getBalance(address);
   const gas_cost = if (result.cold) COLD_ACCOUNT_ACCESS else WARM_ACCESS;
   ```

2. **Initialize Transaction Context**:
   ```zig
   try state_manager.beginTransaction(sender, recipient, prewarm_addrs, prewarm_slots);
   defer state_manager.endTransaction();
   ```

3. **Handle Errors Properly**:
   ```zig
   state_manager.subBalance(address, amount) catch |err| {
       if (err == error.InsufficientBalance) {
           // Handle gracefully
       }
       return err;
   };
   ```

## Performance Considerations

1. **HashMap Efficiency**: O(1) warm/cold checks
2. **Memory Allocation**: Minimal allocations during normal operation
3. **Cache Locality**: Access patterns optimize for hot data
4. **No Redundant Work**: Tracks access once per transaction

## Testing Coverage

The implementation should be tested for:
- Correct cold/warm tracking
- Transaction context isolation
- EIP-2930 prewarming
- State snapshot/revert with access lists
- Memory management
- Edge cases

## Future Enhancements

1. **Optimization**:
   - Bloom filters for existence checks
   - Compact access list representation
   - Batch operations

2. **Features**:
   - Access pattern analytics
   - Gas usage profiling
   - Cross-transaction caching

3. **Integration**:
   - Better StateDB integration
   - Parallel access support
   - Advanced snapshot mechanisms

## Use Cases

### EIP-2929 Compliant Execution
```zig
// Automatic tracking of all state access
const balance = try state_manager.getBalance(addr);
// balance.cold indicates if this was first access
```

### EIP-2930 Transaction Support
```zig
// Pre-warm addresses from access list
try state_manager.beginTransaction(
    sender,
    recipient,
    tx.access_list.addresses,
    tx.access_list.storage_keys
);
```

### Gas Calculation
```zig
fn calculateSloadGas(state_manager: *StateManager, address: Address, key: B256) !u64 {
    const result = try state_manager.getStorage(address, key);
    var gas: u64 = 100;  // Base cost
    if (result.cold_address) gas += 2000;
    if (result.cold_slot) gas += 2000;
    return gas;
}
```

## Conclusion

The Tevm StateManager provides a clean abstraction for EVM state operations with built-in EIP-2929 support. Its separation of concerns between access tracking and state storage makes the code maintainable while the explicit cold flag returns make gas calculation transparent. The design efficiently supports modern Ethereum features while maintaining simplicity and correctness.