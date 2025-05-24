# Account.zig - EVM Account Implementation

This document describes the Tevm EVM account implementation in `Account.zig` and compares it with other major EVM implementations.

## Overview

The `Account` struct represents an Ethereum account in the EVM state. It unifies both Externally Owned Accounts (EOAs) and Contract Accounts in a single structure, following the Ethereum Yellow Paper specification.

## Implementation Details

### Core Structure

```zig
pub const Account = struct {
    // Core account state (Ethereum Yellow Paper)
    balance: u256,                     // Wei balance
    nonce: u64,                        // Transaction count
    storage_root: B256,                // Storage trie root hash
    code_hash: B256,                   // Keccak256 of contract code
    
    // Cached data
    code: ?[]u8 = null,               // Contract bytecode (cached)
    
    // Dirty tracking flags
    dirty_balance: bool = false,       // Balance modified
    dirty_nonce: bool = false,         // Nonce modified
    dirty_code: bool = false,          // Code modified
    dirty_storage: bool = false,       // Storage modified
}
```

### Constants

```zig
// Empty values per Ethereum specification
pub const EMPTY_ROOT_HASH = B256{ .bytes = [_]u8{0x56, 0xe8, ...} };  // Keccak256(RLP([]))
pub const EMPTY_CODE_HASH = B256{ .bytes = [_]u8{0xc5, 0xd2, ...} };  // Keccak256("")
```

### Core Operations

#### Account Lifecycle
- `init()` - Create empty account with zero balance
- `initWithBalance(balance)` - Create account with initial balance
- `deinit(allocator)` - Free allocated memory (code)
- `clone(allocator)` - Deep copy including code

#### Balance Management
- `getBalance()` - Read balance
- `setBalance(balance)` - Set balance (marks dirty)
- `addBalance(amount)` - Increment balance safely
- `subBalance(amount)` - Decrement with underflow check

#### Nonce Management
- `getNonce()` - Read nonce
- `setNonce(nonce)` - Set nonce (marks dirty)
- `incrementNonce()` - Increment by 1

#### Code Management
- `setCode(allocator, code)` - Set bytecode and compute hash
- `getCode()` - Get bytecode slice
- `getCodeSize()` - Get bytecode length
- `hasCode()` - Check if contract account

#### State Queries
- `isEmpty()` - Check if account can be deleted
- `getStorageRoot()` - Get storage trie root
- `getCodeHash()` - Get code hash

### Dirty Tracking System

The implementation uses dirty flags to optimize state updates:

```zig
pub fn setBalance(self: *Account, balance: u256) void {
    self.balance = balance;
    self.dirty_balance = true;  // Mark for persistence
}
```

This allows the state manager to:
1. Track which accounts need persistence
2. Optimize storage writes
3. Support efficient journaling
4. Minimize hashing operations

## Comparison with Other Implementations

### Account Representation

| Implementation | Structure | Code Storage | Dirty Tracking | Memory Model |
|----------------|-----------|--------------|----------------|--------------|
| Tevm (Zig) | Single struct | Cached optional | Explicit flags | Manual |
| go-ethereum | StateObject | Lazy loaded | Dirty map | GC managed |
| revm (Rust) | AccountInfo | Separate storage | Status enum | Ownership |
| evmone | account struct | Not cached | External | RAII |

### Key Differences

#### 1. Code Storage Strategy

**Tevm**:
- Code cached in account struct
- Allocated on demand
- Manual memory management
- Direct access when cached

**go-ethereum**:
- Lazy loading from database
- Cached in state object
- GC manages memory
- Complex caching layers

**revm**:
- Code stored separately
- Bytecode analysis info cached
- Efficient for execution
- Jump table preprocessing

**evmone**:
- Code not stored in account
- Fetched on demand
- Minimal account size
- External code management

#### 2. Dirty Tracking Approach

**Tevm**:
```zig
dirty_balance: bool = false,
dirty_nonce: bool = false,
dirty_code: bool = false,
dirty_storage: bool = false,
```
Fine-grained tracking per field.

**go-ethereum**:
- Uses dirty storage map
- Tracks storage changes separately
- Complex journaling system
- Snapshot capabilities

**revm**:
- Status enum (Cold, Accessed, Dirty, etc.)
- Bitflags for efficient checks
- Integrated with access lists
- EIP-2929 support built-in

**evmone**:
- No dirty tracking in account
- Handled by host implementation
- Minimal account responsibility

#### 3. Empty Account Definition

**Tevm**:
```zig
pub fn isEmpty(self: *const Account) bool {
    return self.balance == 0 and 
           self.nonce == 0 and 
           !self.hasCode();
}
```

**go-ethereum**:
More complex with suicide flags and existence tracking.

**revm**:
Considers touched/created status for EIP-161.

### Performance Characteristics

**Tevm Design Benefits**:
1. **Cache Locality**: All account data in one struct
2. **Direct Access**: No indirection for cached code
3. **Minimal Allocations**: Only code requires heap
4. **Simple Logic**: Straightforward operations

**Trade-offs**:
1. **Memory Usage**: Code duplicated if cached
2. **Manual Management**: Must track allocations
3. **No Lazy Loading**: Code loaded fully or not at all

## Error Handling

The implementation uses Zig's error unions:

```zig
pub const AccountError = error{
    InsufficientBalance,
    NonceOverflow,
    CodeHashMismatch,
};
```

Example usage:
```zig
pub fn subBalance(self: *Account, amount: u256) !void {
    if (self.balance < amount) return error.InsufficientBalance;
    self.balance -= amount;
    self.dirty_balance = true;
}
```

## Integration with State Management

The Account struct integrates with StateDB for:

1. **State Persistence**: Dirty flags indicate what to save
2. **Journaling**: Track changes for rollback
3. **Hashing**: Compute state root efficiently
4. **Caching**: Avoid redundant database reads

### Usage Pattern

```zig
// Create new account
var account = Account.init();
defer account.deinit(allocator);

// Modify account
try account.setCode(allocator, contract_code);
account.setBalance(1000000);
account.incrementNonce();

// Check status
if (account.isEmpty()) {
    // Account can be deleted
}
```

## Best Practices

1. **Always Free Code**: Call `deinit()` when done
2. **Check Errors**: Handle balance underflow
3. **Use Dirty Flags**: Let state manager optimize
4. **Clone Carefully**: Deep copy when needed

## Testing Coverage

The implementation includes tests for:
- Account initialization
- Balance operations with overflow/underflow
- Nonce management
- Code setting and hashing
- Empty account detection
- Cloning with code
- Memory management

## Future Enhancements

1. **Performance**:
   - Code deduplication
   - Lazy code loading
   - Memory pooling

2. **Features**:
   - EIP-2929 access tracking
   - Account versioning
   - Witness generation

3. **Optimization**:
   - Pack dirty flags as bitfield
   - Inline small code
   - Cache code hash computation

## Ethereum Compatibility

The implementation follows Ethereum specifications:

1. **Account Model**: Unified EOA and contract accounts
2. **Storage Root**: Empty trie hash for new accounts
3. **Code Hash**: Keccak256 of empty string for EOAs
4. **Empty Definition**: No balance, nonce, or code
5. **Nonce Semantics**: Transaction counter

## Conclusion

The Tevm Account implementation provides a clean, efficient representation of Ethereum accounts. Its explicit dirty tracking and manual memory management offer predictable performance, while the simple design makes it easy to understand and maintain. The implementation correctly follows Ethereum specifications while leaving room for future optimizations.