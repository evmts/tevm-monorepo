# EVM State Management

This directory contains the implementation of the Ethereum state management system in Zig. State management is a critical component of the EVM, providing access to accounts, balances, contract code, and storage.

## Components

### Account ([Account.zig](./Account.zig))

The `Account` struct represents an Ethereum account with:

- **Balance**: Stored as a 256-bit integer (u256)
- **Nonce**: Number of transactions sent from the account
- **Storage Root**: Root hash of the account's storage trie
- **Code Hash**: Keccak-256 hash of the account's code
- **Code**: Cached bytecode of the account

Key features:
- Balance management (get, set, add, subtract)
- Nonce management (get, set, increment)
- Code management (get, set, check)
- Empty account detection

### Storage ([Storage.zig](./Storage.zig))

The `Storage` struct manages contract storage, which is a mapping of 256-bit keys to 256-bit values:

- Storage is organized as a key-value store
- Values are initialized to zero by default
- Uses hash maps for efficient lookups

### StateDB ([StateDB.zig](./StateDB.zig))

The `StateDB` is the main state database that tracks account states:

- Maintains a mapping of addresses to accounts
- Maintains a mapping of addresses to storage
- Implements the journaling system for transaction reversibility
- Tracks gas refunds

Key features:
- Account management (create, delete, get)
- Balance operations
- Nonce operations
- Code operations
- Storage operations
- Snapshot and revert functionality

### Journal ([Journal.zig](./Journal.zig))

The `Journal` records state changes to enable transaction reversal:

- Each state modification is recorded as a journal entry
- Supports creating snapshots of the state
- Allows reverting to previous snapshots
- Essential for implementing transaction atomicity

Entry types include:
- Balance changes
- Nonce changes
- Code changes
- Storage changes
- Account creation/deletion
- Refund changes

### StateManager ([StateManager.zig](./StateManager.zig))

The `StateManager` is a high-level interface for state operations:

- Acts as a facade for the StateDB
- Implements forking functionality for connecting to remote chains
- Handles caching for improved performance
- Provides access methods for the EVM during execution

## State Management Flow

1. **Transaction Processing**:
   - EVM execution calls StateManager functions
   - StateManager delegates to StateDB for account and storage access
   - All state changes are journaled for possible reversal

2. **Journaling System**:
   - Each state modification is recorded as a journal entry
   - Snapshots create points that can be reverted to
   - If a transaction fails, all changes can be reverted

3. **Account and Storage Management**:
   - Accounts are created on-demand when accessed
   - Storage slots are initialized to zero
   - Code is stored and retrieved with accounts

## Key Features

### Transactional State

The state management system implements a transactional model:
- Changes are journaled
- Transactions can be committed or reverted atomically
- No partial state changes are visible until committed

### Copy-on-Write Semantics

- State objects are only copied when modified
- Efficient memory usage for large state trees
- Changes are stored in-memory until committed

### EIP-2929 Access Lists

- Tracking of "warm" accounts and storage slots
- Reduced gas costs for repeated state accesses
- Improved security against DoS attacks

## Implementation Notes

- The system uses copy-on-write semantics to minimize memory usage
- Journal entries store the previous state for efficient reversion
- Snapshots are implemented as markers in the journal
- State pruning is supported to clean up unreachable state