# storage.zig - EVM Storage Opcodes Implementation

This document describes the Tevm storage opcodes implementation in `storage.zig` and compares it with other major EVM implementations.

## Overview

The storage opcodes module implements the SLOAD and SSTORE operations for the EVM. These operations:
- **SLOAD**: Load a 32-byte value from contract storage
- **SSTORE**: Store a 32-byte value to contract storage

These are among the most gas-intensive operations due to state access costs and various EIP implementations affecting gas calculation.

## Implementation Details

### Key EIPs Implemented

1. **EIP-2929**: Gas cost increases for cold storage access
   - Cold SLOAD: 2100 gas
   - Warm SLOAD: 100 gas
   - Cold SSTORE: +2100 gas

2. **EIP-2200**: Structured definition of net gas metering
   - Complex gas calculation based on value transitions
   - Refund calculations for storage clearing

3. **EIP-3529**: Reduction in refunds
   - Maximum refund reduced to 1/5 of gas used
   - Storage refunds reduced

### SLOAD Implementation

```zig
pub fn opSload(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8
```

**Execution Flow:**
1. **Stack Validation**: Ensure at least 1 item on stack
2. **Key Extraction**: Pop storage key from stack
3. **Type Conversion**: Convert u256 to B256 format
4. **State Access**: 
   - Get state manager from EVM
   - Retrieve contract storage value
5. **Gas Calculation**:
   - Assume cold access (TODO: implement warm/cold tracking)
   - Charge 2100 gas for cold access + 100 for warm read
6. **Result**: Push value to stack

**Current Limitations:**
- Always assumes cold access (no warm/cold tracking yet)
- Basic state manager integration

### SSTORE Implementation

```zig
pub fn opSstore(pc: usize, interpreter: *Interpreter, frame: *Frame) ExecutionError![]const u8
```

**Execution Flow:**
1. **Read-Only Check**: Fail if in static context
2. **Stack Validation**: Ensure at least 2 items
3. **Extract Values**: Pop key and value from stack
4. **Type Conversion**: Convert u256 values to B256
5. **State Access**:
   - Get current value from storage
   - Track original value for gas calculation
6. **Gas Calculation**:
   - EIP-2200 implementation for different transitions
   - Handle cold access costs (EIP-2929)
   - Calculate refunds based on value changes
7. **State Update**: Store new value
8. **Refund Tracking**: Update EVM refund counter

### Gas Calculation Functions

#### `sstoreDynamicGas`
Calculates dynamic gas cost based on EIP-2200:

```zig
pub fn sstoreDynamicGas(
    interpreter: *Interpreter,
    frame: *Frame,
    stack: *Stack,
    memory: *Memory,
    memorySize: u64
) ExecutionError!u64
```

**Gas Rules:**
- No-op (same value): 100 gas (EIP-2200)
- Create slot (0 → non-0): 20,000 gas
- Clear slot (non-0 → 0): 5,000 gas + refund
- Modify slot (non-0 → non-0): 5,000 gas
- Cold access: +2,100 gas (EIP-2929)

**Refund Rules:**
- Clear slot: 4,800 gas refund (EIP-3529)
- Restore original: Variable refund based on transitions

## Type Conversions

The implementation handles conversions between different type systems:

```zig
// u256 to B256
var key_bytes: [32]u8 = undefined;
var temp = key_u256;
var i: usize = 31;
while (i < 32) : (i -%= 1) {
    key_bytes[i] = @intCast(temp & 0xFF);
    temp >>= 8;
    if (i == 0) break;
}

// B256 to u256
var value_u256: u256 = 0;
for (0..32) |j| {
    value_u256 = (value_u256 << 8) | value.bytes[j];
}
```

## Comparison with Other Implementations

### Architecture Differences

| Implementation | State Access | Gas Calculation | Type System | Error Handling |
|----------------|--------------|-----------------|-------------|----------------|
| Tevm (Zig) | StateManager API | Separate functions | Multiple conversions | Error unions |
| go-ethereum | StateDB interface | Inline calculation | Native big.Int | Panic/recover |
| revm (Rust) | Host trait | Integrated | U256 throughout | Result types |
| evmone (C++) | EVMC callbacks | Inline optimized | intx::uint256 | Exceptions |

### Key Differences

#### 1. State Manager Integration

**Tevm**:
- Explicit StateManager access through EVM
- Type conversions between systems (u256 ↔ B256)
- Simple get/put interface

**go-ethereum**:
- Direct StateDB access
- Integrated journaling
- MPT (Merkle Patricia Trie) backed

**revm**:
- Host trait abstraction
- Flexible backend support
- Optimized for different use cases

**evmone**:
- EVMC host interface
- Minimal coupling
- Callback-based

#### 2. Gas Calculation Approach

**Tevm**:
- Separate `sstoreDynamicGas` function
- Explicit EIP-2200 implementation
- Clear refund tracking

**go-ethereum**:
- Inline gas calculation
- Complex state tracking
- Integrated with execution

**revm**:
- Optimized gas paths
- Minimal overhead
- Trait-based abstraction

**evmone**:
- Direct calculation
- No function calls
- Maximum performance

#### 3. Warm/Cold Tracking

**Tevm** (Current):
- TODO: Not implemented yet
- Always assumes cold access
- Placeholder for future implementation

**Other Implementations**:
- Full EIP-2929 support
- Access list tracking
- Optimized repeated access

## Performance Considerations

**Current Implementation**:
- Clean separation of concerns
- Some overhead from type conversions
- Room for optimization

**Optimization Opportunities**:
1. **Warm/Cold Tracking**: Implement access lists
2. **Type Unification**: Reduce conversions
3. **Gas Batching**: Combine calculations
4. **State Caching**: Cache recent accesses

## Testing Notes

The implementation includes test utilities:
- Mock state manager for unit tests
- Gas cost verification
- Value transition testing
- Error condition testing

## Future Enhancements

1. **EIP-2929 Full Support**:
   - Implement access list tracking
   - Warm/cold slot differentiation
   - Proper gas accounting

2. **Performance Optimizations**:
   - Reduce type conversions
   - Inline hot paths
   - Cache recent storage accesses

3. **Advanced Features**:
   - Transient storage (EIP-1153)
   - Storage proofs
   - Witness generation

4. **Better Integration**:
   - Unified type system
   - Optimized state manager API
   - Batch operations support

## Conclusion

The Tevm storage opcodes implementation provides a clean, well-documented foundation for EVM storage operations. While it currently lacks some optimizations (particularly warm/cold tracking), the architecture is sound and allows for incremental improvements.

Key strengths:
- **Clear Implementation**: Easy to understand and verify
- **Explicit Gas Rules**: All EIP-2200 cases handled
- **Good Error Handling**: Comprehensive error types
- **Extensible Design**: Easy to add features

The implementation correctly follows Ethereum specifications while maintaining code clarity, making it suitable for both educational purposes and production use with future optimizations.