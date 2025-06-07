# SSTORE Gas Refund Implementation Plan

## Overview

To properly implement EIP-2200 gas refunds, we need to track the original storage values from the beginning of the transaction. This allows us to correctly calculate refunds based on the state transitions: original → current → new.

## Current State

- Basic refund logic implemented in `storage.zig`
- Only tracks current → new transitions
- Missing original value tracking across transaction lifetime

## Requirements

### EIP-2200 Refund Rules

For each SSTORE operation, we need to know:
1. **Original value**: The value at the start of the transaction
2. **Current value**: The value before this SSTORE
3. **New value**: The value being set

The refund logic:
- `original != 0, current != 0, new = 0`: Add refund (clearing slot)
- `original != 0, current = 0, new != 0`: Remove refund (undoing a clear)
- `original = new != 0, current != 0`: Add refund (restoring original)
- `original = new = 0, current != 0`: Remove refund (undoing a set)

### Gas Refund Limits

- **Pre-London**: Refund capped at 50% of gas used
- **London+**: Refund capped at 20% of gas used (EIP-3529)

## Proposed Design

### 1. Original Value Cache

Add an original value cache to track storage values at transaction start:

```zig
// In EvmState or VM
original_storage: std.AutoHashMap(StorageKey, u256),
```

### 2. Transaction Lifecycle Integration

#### Transaction Start
- Clear the original storage cache
- As storage slots are accessed for the first time in a transaction, cache their values

#### During SSTORE
1. Check if we have an original value cached
2. If not, the current value IS the original value (first access)
3. Apply full EIP-2200 logic with original, current, and new values

#### Transaction End
- Apply gas refund cap (20% or 50% of gas used)
- Clear the original storage cache

### 3. Implementation Locations

#### A. EvmState Enhancement
```zig
// In evm_state.zig
pub const EvmState = struct {
    // ... existing fields ...
    
    /// Original storage values at transaction start
    /// Used for EIP-2200 gas refund calculations
    original_storage: std.AutoHashMap(StorageKey, u256),
    
    /// Track if we're in a transaction context
    in_transaction: bool,
    
    /// Get original storage value, caching it if first access
    pub fn get_original_storage(self: *Self, address: Address, slot: u256) !u256 {
        const key = StorageKey{ .address = address, .slot = slot };
        
        if (self.original_storage.get(key)) |value| {
            return value;
        }
        
        // First access in this transaction - current value is original
        const current = self.get_storage(address, slot);
        try self.original_storage.put(key, current);
        return current;
    }
    
    /// Start a new transaction context
    pub fn begin_transaction(self: *Self) !void {
        self.original_storage.clearRetainingCapacity();
        self.in_transaction = true;
    }
    
    /// End transaction context
    pub fn end_transaction(self: *Self) void {
        self.original_storage.clearRetainingCapacity();
        self.in_transaction = false;
    }
};
```

#### B. Storage Opcode Enhancement
```zig
// In storage.zig op_sstore
pub fn op_sstore(...) {
    // ... existing code ...
    
    const current_value = try error_mapping.vm_get_storage(vm, frame.contract.address, slot);
    const original_value = try vm.state.get_original_storage(frame.contract.address, slot);
    
    // ... gas calculation ...
    
    try error_mapping.vm_set_storage(vm, frame.contract.address, slot, value);
    
    // Full EIP-2200 refund logic
    if (vm.chain_rules.IsIstanbul) {
        apply_sstore_refund(frame.contract, original_value, current_value, value, vm.chain_rules);
    }
}

fn apply_sstore_refund(contract: *Contract, original: u256, current: u256, new: u256, rules: ChainRules) void {
    const refund_amount = if (rules.IsLondon) SSTORE_CLEARS_REFUND else 15000;
    
    // Case 1: Storage slot is being cleared (non-zero to zero)
    if (current != 0 and new == 0) {
        contract.add_gas_refund(refund_amount);
    }
    
    // Case 2: Reverting a previous clear in same transaction
    if (original != 0 and current == 0 and new != 0) {
        contract.sub_gas_refund(refund_amount);
    }
    
    // Case 3: Restoring original value
    if (original == new and original != 0 and current != original) {
        contract.add_gas_refund(refund_amount);
    }
    
    // Case 4: Undoing a set to non-zero where original was zero
    if (original == 0 and current != 0 and new == 0) {
        contract.sub_gas_refund(refund_amount);
    }
}
```

#### C. VM Transaction Handling
```zig
// In vm.zig or wherever transactions are processed
pub fn execute_transaction(self: *Self, tx: Transaction) !TransactionResult {
    // Begin transaction context
    try self.state.begin_transaction();
    defer self.state.end_transaction();
    
    // ... execute transaction ...
    
    // Apply gas refund cap before finalizing
    const gas_used = initial_gas - gas_remaining;
    const max_refund = if (self.chain_rules.IsLondon) 
        gas_used / 5  // 20% cap
    else 
        gas_used / 2; // 50% cap
        
    const actual_refund = @min(total_refund, max_refund);
    gas_remaining += actual_refund;
    
    return result;
}
```

### 4. Testing Strategy

1. **Unit Tests**: Test each refund case in isolation
2. **Integration Tests**: Test full transaction flows with multiple SSTORE operations
3. **Edge Cases**:
   - Multiple changes to same slot in one transaction
   - Nested calls modifying same storage
   - Reverted calls and refund rollback
   - Gas refund cap enforcement

### 5. Implementation Steps

1. [ ] Add `original_storage` HashMap to EvmState
2. [ ] Implement `get_original_storage()` method
3. [ ] Add transaction begin/end methods
4. [ ] Update `op_sstore` to use original values
5. [ ] Implement full `apply_sstore_refund` logic
6. [ ] Integrate transaction lifecycle in VM
7. [ ] Add gas refund cap application
8. [ ] Write comprehensive tests
9. [ ] Update existing tests to use transaction context

## Alternative Approaches Considered

### 1. Journal-Based Tracking
- Store original values in journal entries
- Pro: Integrates with existing rollback mechanism
- Con: Journal is per-call, not per-transaction

### 2. Separate Transaction State Object
- Create a TransactionState that wraps EvmState
- Pro: Clean separation of concerns
- Con: More complex API changes

### 3. Storage Access List Enhancement
- Extend existing access list to track original values
- Pro: Reuses existing infrastructure
- Con: Mixes concerns (access tracking vs value tracking)

## Decision

We'll implement the Original Value Cache approach because:
1. It's straightforward and focused on the specific need
2. Minimal API changes required
3. Clear transaction lifecycle
4. Easy to test in isolation
5. Performance efficient (single HashMap lookup)

## References

- [EIP-2200](https://eips.ethereum.org/EIPS/eip-2200): Structured Definitions for Net Gas Metering
- [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529): Reduction in gas refunds (London)
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929): Gas cost increases for state access opcodes