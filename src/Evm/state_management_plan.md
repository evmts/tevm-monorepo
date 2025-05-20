# State Management Implementation Plan

## Overview

This document outlines the plan for implementing state management for our Ethereum Virtual Machine (EVM) in Zig. State management is a critical component of the EVM that tracks account balances, nonces, code, and storage across transactions and blocks.

## Core Components

1. **StateDB**: The main state database interface
   - Tracks all account state changes
   - Manages snapshots and reverts
   - Provides access to account and storage data

2. **StateObject**: Represents an individual Ethereum account
   - Tracks account balance
   - Tracks account nonce
   - References account code
   - Manages storage trie
   - Tracks dirty state for efficient commits

3. **Journal**: Tracks state changes
   - Enables transaction atomicity
   - Supports reverting to previous state
   - Manages snapshots
   - Different entry types for different state changes

4. **StorageTrie**: Manages contract storage
   - Merkle Patricia Trie implementation
   - Maps storage keys to values
   - Supports Merkle proofs
   - Ensures data integrity

## Implementation Plan

### Phase 1: Basic Account State

1. **Account Structure**
   - Implement account data structure with balance, nonce, storage root, and code hash
   - Create methods for account creation, deletion, and updates
   - Add serialization/deserialization for accounts

2. **Simple State Database**
   - Implement in-memory state tracking as a map of addresses to accounts
   - Create basic CRUD operations for accounts
   - Support basic balance transfers and nonce management

### Phase 2: Storage Management

1. **Storage State**
   - Implement storage as a map of keys to values
   - Support SLOAD and SSTORE operations
   - Add dirty tracking for changed storage slots

2. **Journal Implementation**
   - Create journal structure to track state changes
   - Implement different journal entry types for different operations
   - Add snapshot and revert functionality

### Phase 3: Advanced Features

1. **Trie Implementation**
   - Implement Merkle Patricia Trie for storage
   - Add support for Merkle proofs
   - Ensure data integrity with proper hashing

2. **Snapshot System**
   - Implement snapshot identification
   - Add ability to revert to specific snapshots
   - Support nested snapshots

3. **Database Persistence**
   - Add ability to persist state to disk
   - Implement efficient state updates
   - Support pruning old state

### Phase 4: EIP Support

1. **EIP-1884: Gas Cost Changes**
   - Implement repricing of state access operations

2. **EIP-2929: Gas Cost Increases for State Access**
   - Implement warm/cold access tracking
   - Implement different gas costs based on access status

3. **EIP-2200: Net Gas Metering**
   - Implement net gas metering for SSTORE
   - Support gas refunds for storage clearing

## Interface Design

```zig
// Main StateDB interface
pub const StateDB = struct {
    // Account management
    fn createAccount(address: Address) !void
    fn deleteAccount(address: Address) !void
    fn getAccount(address: Address) !?Account
    fn getOrCreateAccount(address: Address) !Account
    
    // Balance operations
    fn getBalance(address: Address) !u256
    fn setBalance(address: Address, balance: u256) !void
    fn addBalance(address: Address, amount: u256) !void
    fn subBalance(address: Address, amount: u256) !void
    
    // Nonce operations
    fn getNonce(address: Address) !u64
    fn setNonce(address: Address, nonce: u64) !void
    fn incrementNonce(address: Address) !void
    
    // Code operations
    fn getCode(address: Address) ![]u8
    fn setCode(address: Address, code: []const u8) !void
    fn getCodeHash(address: Address) !B256
    fn getCodeSize(address: Address) !usize
    
    // Storage operations
    fn getState(address: Address, key: B256) !B256
    fn setState(address: Address, key: B256, value: B256) !void
    
    // Snapshot management
    fn snapshot() u64
    fn revertToSnapshot(id: u64) !void
    
    // Committing changes
    fn commit() !void
};

// Account state structure
pub const Account = struct {
    balance: u256,
    nonce: u64,
    root: B256,   // Storage trie root
    codeHash: B256,
    code: ?[]u8,
    
    // Dirty tracking
    dirtyCode: bool,
    dirtyStorage: bool,
};

// Journal for tracking state changes
pub const Journal = struct {
    entries: []JournalEntry,
    
    fn snapshot() u64
    fn revert(snapId: u64) !void
    fn append(entry: JournalEntry) !void
};

// Journal entry types
pub const JournalEntryKind = enum {
    BALANCE_CHANGE,
    NONCE_CHANGE,
    STORAGE_CHANGE,
    CODE_CHANGE,
    ACCOUNT_CREATION,
    ACCOUNT_DELETION,
};
```

## Testing Strategy

1. **Unit Tests**
   - Test individual components (Account, StateDB, Journal)
   - Verify correct behavior for each operation
   - Test edge cases and error handling

2. **Integration Tests**
   - Test interactions between components
   - Verify transaction processing
   - Test complex scenarios with multiple state changes

3. **Ethereum Test Vectors**
   - Run official Ethereum state tests
   - Ensure compliance with EVM specification
   - Validate against known state transitions

## Performance Considerations

1. **Memory Efficiency**
   - Use compact representation for storage
   - Minimize memory allocations
   - Efficient dirty tracking to avoid unnecessary operations

2. **Caching**
   - Cache recently accessed accounts and storage
   - Implement LRU caching for hot data

3. **Database Optimization**
   - Batch writes for persistence
   - Use efficient serialization formats
   - Implement pruning for old state

## Implementation Timeline

1. Phase 1: 1-2 weeks
2. Phase 2: 2-3 weeks
3. Phase 3: 3-4 weeks
4. Phase 4: 1-2 weeks

Total: 7-11 weeks

## References

1. [Go-Ethereum StateDB Implementation](https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go)
2. [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
3. [Merkle Patricia Trie Specification](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/)
4. [EIP-1884](https://eips.ethereum.org/EIPS/eip-1884)
5. [EIP-2200](https://eips.ethereum.org/EIPS/eip-2200)
6. [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929)

## Next Steps

1. Create basic Account and StateDB structures
2. Implement account CRUD operations
3. Add balance and nonce management
4. Implement simple storage operations
5. Add journaling for state changes