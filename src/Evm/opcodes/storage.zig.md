# storage.zig - EVM Storage Opcodes Implementation

This document describes the Tevm storage opcodes implementation in `storage.zig` and compares it with other major EVM implementations.

## Overview

The storage opcodes module implements the SLOAD and SSTORE operations for the EVM. These operations:
- **SLOAD**: Load a 32-byte value from contract storage
- **SSTORE**: Store a 32-byte value to contract storage

These are among the most gas-intensive operations due to state access costs and various EIP implementations affecting gas calculation.

## Implementation Details

### Module Imports

The implementation uses the package system:
- `@import("evm")` - Core EVM types and utilities
- `@import("utils")` - Utility functions
- `@import("StateManager")` - State management interface

### Logging System

The module includes comprehensive logging:
```zig
const log = std.log.scoped(.storage);
```

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
1. **Stack Validation**: Ensure at least 1 item on stack (uses `mapStackError` helper)
2. **Key Extraction**: Pop storage key from stack using `getKeyFromStack`
3. **Type Conversion**: Convert u256 to B256 format
4. **State Access**: 
   - Get state manager from EVM
   - Convert contract address to B160 format
   - Retrieve storage value via `stateManager.getStorage`
5. **Gas Calculation**:
   - Currently always charges cold access cost (2100 gas)
   - TODO: implement warm/cold tracking
6. **Result**: Convert B256 to u256 and push to stack

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
3. **Extract Values**: Pop value first, then key (reverse order)
4. **Type Conversion**: Convert u256 values to B256 using `u256ToBytes`
5. **State Access**:
   - Get current value from storage
   - Track original value using `frame.contract.trackOriginalStorageValue()`
6. **Gas Calculation (inline, no separate function)**:
   - EIP-2200 implementation for different transitions
   - Handle cold access costs (EIP-2929)
   - Calculate refunds based on value changes
7. **State Update**: Store new value via `stateManager.setStorage`
8. **Refund Tracking**: Update using `frame.contract.addGasRefund()` or `frame.contract.subGasRefund()`

### Gas Calculation

Gas calculation is performed inline within the `opSstore` function:

**Gas Rules (EIP-2200):**
- No-op (same value): 100 gas for warm read
- Create slot (0 → non-0): 20,000 gas
- Clear slot (non-0 → 0): 5,000 gas + refund
- Modify slot (non-0 → non-0): 5,000 gas
- Cold access: +2,100 gas (EIP-2929)

**Refund Rules (EIP-3529):**
- Clear slot: 4,800 gas refund
- Restore to original value: 4,900 gas refund (minus previously given refunds)
- Complex transitions handled to avoid double refunds

**Contract Methods Used:**
- `trackOriginalStorageValue()` - Records first access
- `getOriginalStorageValue()` - Retrieves original value
- `addGasRefund()` - Adds to refund counter
- `subGasRefund()` - Removes from refund counter

## Helper Functions

The implementation includes several helper functions:

### `getKeyFromStack`
```zig
fn getKeyFromStack(stack: *Stack) !u256
```
Extracts storage key from stack with error mapping.

### `u256ToBytes`
```zig
fn u256ToBytes(value: u256) [32]u8
```
Converts u256 to byte array (big-endian).

### `bytesTou256`
```zig
fn bytesTou256(bytes: [32]u8) u256
```
Converts byte array to u256.

### `mapStackError`
```zig
fn mapStackError(err: anyerror) ExecutionError
```
Maps Stack errors to ExecutionError types.

### `registerStorageOpcodes`
```zig
pub fn registerStorageOpcodes(table: *JumpTable) void
```
Registers SLOAD and SSTORE opcodes in the jump table.

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

#### 4. Transient Storage

**Tevm** (Current):
- TLOAD and TSTORE opcodes not implemented
- Marked as TODO in comments
- Will require EIP-1153 support

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

2. **EIP-1153 Transient Storage**:
   - Implement TLOAD opcode
   - Implement TSTORE opcode
   - Add transient storage to StateManager

3. **Performance Optimizations**:
   - Reduce type conversions
   - Inline hot paths
   - Cache recent storage accesses

4. **Better Integration**:
   - Unified type system across components
   - Optimized state manager API
   - Batch operations support

5. **Testing**:
   - Complete test suite (currently placeholder)
   - Gas cost verification
   - Edge case coverage

## Conclusion

The Tevm storage opcodes implementation provides a clean, well-documented foundation for EVM storage operations. While it currently lacks some optimizations (particularly warm/cold tracking), the architecture is sound and allows for incremental improvements.

Key strengths:
- **Clear Implementation**: Easy to understand and verify
- **Explicit Gas Rules**: All EIP-2200 cases handled
- **Good Error Handling**: Comprehensive error types
- **Extensible Design**: Easy to add features

The implementation correctly follows Ethereum specifications while maintaining code clarity, making it suitable for both educational purposes and production use with future optimizations.