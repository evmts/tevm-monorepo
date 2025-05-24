# FeeMarketTransaction.zig - EIP-1559 Transaction Implementation

This document describes the Tevm EIP-1559 transaction implementation in `FeeMarketTransaction.zig` and compares it with other major EVM implementations.

## Overview

The FeeMarketTransaction struct implements EIP-1559 transactions, which introduced:
- Dual fee structure: base fee (burned) + priority fee (tip)
- Maximum fee specifications for predictable costs
- Access lists for gas optimization (EIP-2929)
- Typed transaction format (EIP-2718)

## Implementation Details

### Core Structure

```zig
pub const FeeMarketTransaction = struct {
    // Transaction identifier
    tx_type: TransactionType = .FeeMarket,
    
    // Chain and account info
    chain_id: u64,
    nonce: u64,
    
    // Gas parameters (EIP-1559)
    max_fee_per_gas: u256,        // Maximum total fee willing to pay
    max_priority_fee_per_gas: u256, // Maximum tip for miner
    gas_limit: u64,               // Gas limit for execution
    
    // Transaction details
    to: ?Address,                 // null for contract creation
    value: u256,                  // ETH to transfer
    data: []u8,                   // Input data/calldata
    
    // Access list (EIP-2929)
    access_list: []AccessListEntry,
    
    // Signature (EIP-2718 format)
    signature_v: u64,
    signature_r: [32]u8,
    signature_s: [32]u8,
    
    // Memory management
    allocator: std.mem.Allocator,
}
```

### Transaction Types

```zig
pub const TransactionType = enum(u8) {
    Legacy = 0,        // Pre-EIP-2718 transactions
    AccessList = 1,    // EIP-2930 access list transactions
    FeeMarket = 2,     // EIP-1559 fee market transactions
    Blob = 3,          // EIP-4844 blob transactions
}
```

### Access List Support

```zig
pub const AccessListEntry = struct {
    address: Address,              // Contract address
    storage_keys: []const [32]u8,  // Storage slots accessed
}
```

Used for EIP-2929 gas optimization - pre-declaring accessed state.

### Core Operations

#### Sender Recovery
```zig
pub fn getSender(self: *const FeeMarketTransaction) !Address
```
Recovers sender address from signature (placeholder - needs ECDSA implementation).

#### Fee Calculation
```zig
pub fn getEffectiveGasPrice(self: *const FeeMarketTransaction, base_fee: u256) struct {
    effective_gas_price: u256,
    miner_tip: u256,
}
```

Calculates actual gas price based on current base fee:
- Effective price = min(max_fee_per_gas, base_fee + max_priority_fee_per_gas)
- Miner tip = effective_price - base_fee

#### Cost Calculation
```zig
pub fn getCost(self: *const FeeMarketTransaction, base_fee: u256) !u256
```

Total cost = (gas_limit × effective_gas_price) + value

#### Transaction Creation
```zig
pub fn create(params: struct {
    chain_id: u64,
    nonce: u64,
    max_fee_per_gas: u256,
    max_priority_fee_per_gas: u256,
    gas_limit: u64,
    to: ?Address,
    value: u256,
    data: []const u8,
    access_list: []const AccessListEntry,
    // ... signature fields
}, allocator: std.mem.Allocator) !*FeeMarketTransaction
```

Factory function with validation:
- Ensures max_fee_per_gas ≥ max_priority_fee_per_gas
- Allocates and copies data to prevent external modification
- Returns error on invalid parameters

## Fee Market Mechanics

### EIP-1559 Fee Structure

1. **User Specifies**:
   - `max_fee_per_gas`: Maximum willing to pay total
   - `max_priority_fee_per_gas`: Maximum tip for miner
   
2. **Network Provides**:
   - `base_fee`: Algorithmically determined base fee
   
3. **Actual Cost**:
   - If max_fee < base_fee: Transaction invalid
   - Otherwise: Pay min(max_fee, base_fee + max_priority)
   - Base fee is burned, priority fee goes to miner

### Example Fee Calculation

```zig
// User willing to pay up to 100 gwei, with 2 gwei tip
tx.max_fee_per_gas = 100_000_000_000;
tx.max_priority_fee_per_gas = 2_000_000_000;

// Network base fee is 50 gwei
base_fee = 50_000_000_000;

// Calculation
effective_price = min(100, 50 + 2) = 52 gwei
miner_tip = 52 - 50 = 2 gwei
burned = 50 gwei
```

## Comparison with Other Implementations

### Transaction Structure

| Implementation | Type System | Memory Model | Validation | Encoding |
|----------------|------------|--------------|------------|----------|
| Tevm (Zig) | Tagged enum | Manual allocation | On creation | Placeholder |
| go-ethereum | Interface types | GC managed | Multiple stages | Full RLP |
| revm (Rust) | Enum variants | Ownership | Builder pattern | Efficient |
| evmone | C structs | Manual | Minimal | External |

### Key Differences

#### 1. Type Safety

**Tevm**:
```zig
tx_type: TransactionType = .FeeMarket,
```
Explicit type field with enum.

**go-ethereum**:
- Interface-based polymorphism
- Runtime type assertions
- More flexible, less safe

**revm**:
```rust
enum Transaction {
    Legacy(LegacyTx),
    EIP2930(AccessListTx),
    EIP1559(FeeMarketTx),
}
```
Rust enum with variants.

#### 2. Memory Management

**Tevm**:
- Explicit allocator
- Manual memory copying
- Clear ownership

**go-ethereum**:
- Garbage collected
- Hidden allocations
- Simpler but less control

**revm**:
- Rust ownership
- Move semantics
- Zero-copy where possible

#### 3. Validation Strategy

**Tevm**:
```zig
if (params.max_fee_per_gas < params.max_priority_fee_per_gas) {
    return error.InvalidFeeParameters;
}
```
Validation on creation.

**Others**:
- Various validation points
- Some validate lazily
- Different error handling

## Integration with EVM

### Transaction Processing Flow

```zig
// 1. Create transaction
const tx = try FeeMarketTransaction.create(.{
    .chain_id = 1,
    .nonce = account_nonce,
    .max_fee_per_gas = 100_000_000_000,
    .max_priority_fee_per_gas = 2_000_000_000,
    // ... other fields
}, allocator);

// 2. Validate against current state
if (tx.max_fee_per_gas < current_base_fee) {
    return error.InsufficientFee;
}

// 3. Calculate costs
const cost_result = tx.getEffectiveGasPrice(current_base_fee);
const total_cost = try tx.getCost(current_base_fee);

// 4. Check balance
if (sender_balance < total_cost) {
    return error.InsufficientBalance;
}
```

### Access List Usage

```zig
// Pre-declare accessed contracts and storage
const access_list = [_]AccessListEntry{
    .{
        .address = contract_address,
        .storage_keys = &[_][32]u8{storage_key_1, storage_key_2},
    },
};

// These addresses/slots will be "warm" on first access
```

## Best Practices

1. **Validate Fee Parameters**:
   ```zig
   if (max_fee < max_priority_fee) return error.InvalidFees;
   ```

2. **Copy External Data**:
   ```zig
   // Allocate and copy to prevent external modification
   const data_copy = try allocator.alloc(u8, params.data.len);
   @memcpy(data_copy, params.data);
   ```

3. **Check Allocations**:
   ```zig
   const tx = allocator.create(FeeMarketTransaction) catch {
       return error.OutOfMemory;
   };
   ```

## Testing Strategy

The implementation includes tests for:
- Fee calculation correctness
- Parameter validation
- Memory management
- Data isolation
- Edge cases (zero fees, overflow)

## Future Enhancements

1. **Complete Implementation**:
   - ECDSA signature recovery
   - RLP encoding/decoding
   - Transaction hashing
   - Signature validation

2. **Optimizations**:
   - Pool transaction objects
   - Optimize access list storage
   - Cache computed values

3. **Features**:
   - Builder pattern API
   - Serialization support
   - Transaction simulation

## Security Considerations

1. **Fee Validation**: Prevent max_priority > max_fee
2. **Overflow Protection**: Check cost calculations
3. **Memory Safety**: Copy external data
4. **Signature Security**: Proper ECDSA implementation needed

## Conclusion

The Tevm FeeMarketTransaction provides a solid foundation for EIP-1559 transactions with:
- Clean structure following Ethereum standards
- Proper validation and error handling
- Efficient memory management
- Clear integration points

While some features need completion (signature recovery, encoding), the architecture supports these additions without major refactoring.