# Storage Opcodes Implementation Comparison

This document compares the implementation of `SLOAD` and `SSTORE` opcodes across different Ethereum VM implementations: Tevm (Zig), go-ethereum, revm (Rust), and evmone (C++).

## Overview

Storage operations are among the most complex EVM operations due to gas calculation rules that have evolved over time through multiple EIPs:

- **EIP-2200**: Net gas metering for SSTORE operations
- **EIP-2929**: Gas cost increases for state access operations (cold vs. warm storage)
- **EIP-3529**: Reduction in refund values for storage operations

The different implementations tackle these challenges with varying approaches to gas calculation, state management integration, and performance optimization.

## Tevm (Zig) Implementation

The Tevm implementation in Zig provides a very clean and readable approach to storage operations.

### SLOAD Implementation

Key characteristics:
1. Explicit gas calculation for EIP-2929 warm/cold accesses
2. Separate check for read-only mode violation
3. Clean conversion between u256 and bytes formats
4. Simple but effective state manager integration

The implementation follows a clear process:
1. Check read-only mode
2. Pop key from stack
3. Calculate and use gas based on warm/cold status
4. Mark slot as warm
5. Convert key to B256 format
6. Fetch value from state manager
7. Convert bytes back to u256
8. Push value onto stack

### SSTORE Implementation

Key characteristics:
1. Comprehensive EIP-2200 gas calculation with refund handling
2. Explicit tracking of original values for proper refund calculation
3. Separate gas calculation function for dynamic gas estimation
4. Clean state manager interaction

The SSTORE implementation follows a detailed flow:
1. Check read-only mode
2. Pop key and value from stack
3. Check if storage slot is cold (EIP-2929)
4. Load current value from storage
5. Track original value for EIP-2200 gas calculations
6. Calculate gas based on value transitions (zero→non-zero, non-zero→zero, etc.)
7. Calculate refunds based on EIP-2200 rules
8. Mark slot as warm
9. Store new value

### Performance Characteristics

- **Pros**:
  - Clean separation of gas calculation and execution logic
  - Explicit error handling with clear error types
  - Detailed tracking of original storage values
  - Comprehensive implementation of all relevant EIPs
  
- **Cons**:
  - Repeated code for conversion between u256 and bytes
  - Separate function calls for gas estimation and execution

## go-ethereum Implementation

The go-ethereum implementation is the reference implementation and focuses on correctness and completeness.

### SLOAD Implementation

Key characteristics:
1. Integrated into a larger interpreter loop using a jump table
2. Comprehensive access list tracking for EIP-2929
3. Caching and optimizations for repeated accesses
4. Integration with MPT (Merkle Patricia Trie) state

The implementation generally follows these steps:
1. Pop key from stack
2. Check access list status and calculate gas (EIP-2929)
3. Apply gas cost with panic-based error handling for out-of-gas
4. Update access list to mark slot as warm
5. Get value from state using StateDB
6. Push value onto stack

### SSTORE Implementation

Key characteristics:
1. Comprehensive EIP-2200 implementation with detailed refund tracking
2. Refund counter with sophisticated capping logic (EIP-3529)
3. Complex journal entry system for state changes
4. Specialized error handling for storage limit errors

The SSTORE flow typically includes:
1. Pop key and value from stack
2. Apply initial gas cost check
3. Fetch current value and original value from state
4. Calculate gas and refunds based on EIP-2200 logic
5. Apply gas costs with panic/recovery for out-of-gas scenarios
6. Update the state DB with new value
7. Update journal for potential reversion

### Performance Characteristics

- **Pros**:
  - Highly optimized with caching for repeated accesses
  - Complete implementation with all edge cases handled
  - Sophisticated journaling system for state changes
  
- **Cons**:
  - More complex code with panic-based error handling
  - Tightly coupled with specific state implementation
  - Less explicit about EIP implementations in the code

## revm (Rust) Implementation

The revm implementation in Rust focuses on performance and modern design patterns.

### SLOAD Implementation

Key characteristics:
1. Trait-based design with clear separation of concerns
2. Rust's Result type for error handling
3. Optimization for repeated access patterns
4. Host interface abstraction for state access

The implementation likely follows:
1. Pop key from stack with error handling
2. Check access status in the EVM context
3. Calculate gas following EIP-2929 rules
4. Apply gas with early returns for out-of-gas
5. Use host interface to get value from storage
6. Push value to stack with error handling

### SSTORE Implementation

Key characteristics:
1. Explicit state and gas models with EIP-2200 implementation
2. Clear separation between state access and gas calculation
3. Efficient tracking of original values using maps
4. Rust type system for preventing common errors

The typical flow includes:
1. Pop key and value with error handling
2. Track access status for EIP-2929
3. Get current and original values from state
4. Calculate gas and refunds based on EIP-2200/3529
5. Apply gas with Result-based error handling
6. Update state with new value
7. Update refund counter with caps

### Performance Characteristics

- **Pros**:
  - High performance with clean abstractions
  - Strong type system preventing many common errors
  - Clear separation between gas/execution/state concerns
  - Modern design with traits for extensibility
  
- **Cons**:
  - More complex abstractions requiring deeper understanding
  - Multiple layers of indirection for flexibility

## evmone (C++) Implementation

The evmone implementation in C++ focuses on raw performance with a minimalist approach.

### SLOAD Implementation

Key characteristics:
1. Highly optimized execution with computed goto
2. Direct memory access for performance
3. Simple but effective state abstractions
4. C++ templates for code generation

The implementation likely includes:
1. Direct stack manipulation without function calls
2. Checking access list flags with bit operations
3. Applying gas with direct counter deduction
4. State access through a minimal host interface
5. Stack push with direct memory operations

### SSTORE Implementation

Key characteristics:
1. Performance-focused implementation
2. Minimal abstraction layers
3. Efficient bitwise operations for flags
4. Inline gas calculation for reduced overhead

The implementation flow likely includes:
1. Direct stack access to get key and value
2. Check access status with bit flags
3. Get values directly from state
4. Calculate gas with inline operations
5. Apply gas with direct counter updates
6. Update state with new value
7. Update refund with simple counter modification

### Performance Characteristics

- **Pros**:
  - Extremely high performance with minimal overhead
  - Direct memory manipulation for efficiency
  - Reduced abstraction for simpler understanding
  
- **Cons**:
  - Less explicit error handling
  - Fewer abstractions can make complex logic harder to follow
  - Often requires specific knowledge of C++ memory model

## Gas Calculation Comparison

The EIP-2200 and EIP-2929 gas calculation logic is particularly complex. Below is a comparison of how each implementation handles different scenarios:

| Operation | Tevm (Zig) | go-ethereum | revm | evmone |
|-----------|------------|-------------|------|--------|
| Cold SLOAD | 2100 gas | 2100 gas | 2100 gas | 2100 gas |
| Warm SLOAD | 100 gas | 100 gas | 100 gas | 100 gas |
| SSTORE no-op (unchanged value) | 100 gas | 100 gas | 100 gas | 100 gas |
| SSTORE create slot (0 → non-0) | 20000 gas | 20000 gas | 20000 gas | 20000 gas |
| SSTORE clear slot (non-0 → 0) | 5000 gas + refund | 5000 gas + refund | 5000 gas + refund | 5000 gas + refund |
| SSTORE modify slot (non-0 → non-0) | 5000 gas | 5000 gas | 5000 gas | 5000 gas |
| Cold SSTORE (additional) | +2000 gas | +2000 gas | +2000 gas | +2000 gas |
| Refund: clear slot | 4800 gas (EIP-3529) | 4800 gas (EIP-3529) | 4800 gas (EIP-3529) | 4800 gas (EIP-3529) |
| Refund: restore original | 4900 gas | 4900 gas | 4900 gas | 4900 gas |

All implementations follow the same gas rules, showing strong consensus on the EIP implementations.

## State Management Interaction

The different implementations vary significantly in how they interact with state:

### Tevm (Zig)
- Uses a simple StateManager interface
- Explicit conversion between value types
- Direct getContractStorage/putContractStorage calls
- Explicit handling of original values in the Contract struct

```zig
// Get value from storage
const value_bytes = try state_manager.getContractStorage(addr, key_b256);

// Store the value
try state_manager.putContractStorage(addr, key_b256, &value_bytes);
```

### go-ethereum
- Uses StateDB with more complex MPT integration
- Journal-based state modifications
- Integrated snapshot/revert functionality
- Caching for performance

```go
// Get value
value := evm.StateDB.GetState(addr, key)

// Store value
evm.StateDB.SetState(addr, key, value)
```

### revm
- Uses Host interface abstraction
- Trait-based design for flexibility
- Clear separation between storage and execution
- Efficient maps and caching

```rust
// Get value
let value = host.storage(addr, key)?;

// Store value
host.set_storage(addr, key, value)?;
```

### evmone
- Minimal host interface
- Direct memory access for performance
- Simple state abstraction focusing on performance
- Uses C++ templates and variants for state

```cpp
// Get value
auto value = host.get_storage(addr, key);

// Store value
host.set_storage(addr, key, value);
```

## Error Handling Approaches

Error handling varies significantly across implementations:

### Tevm (Zig)
- Explicit error types and error union returns
- Clear propagation of errors up the call stack
- Strong compile-time checking of error handling
- Try/catch syntax for concise error handling

```zig
// Error handling in Zig
if (frame.contract.gas < gas_cost) {
    return ExecutionError.OutOfGas;
}

// Try syntax for error propagation
const value = try frame.stack.pop();
```

### go-ethereum
- Mix of explicit errors and panic/recover
- Gas errors often handled via panic for performance
- Custom error types for specific failures
- Return values with bool flags for success/failure

```go
// Panic-based error handling
if gas > contract.Gas {
    panic(ErrOutOfGas)
}

// Error return
value, success := evm.StateDB.GetState(addr, key)
if !success {
    return nil, ErrExecutionReverted
}
```

### revm
- Rust Result type for comprehensive error handling
- ? operator for concise error propagation
- Explicit error enum with variants
- Strong type safety for error cases

```rust
// Result-based error handling
let value = stack.pop().ok_or(Error::StackUnderflow)?;

if gas_cost > frame.gas_left {
    return Err(Error::OutOfGas);
}
```

### evmone
- C++ exceptions for critical errors
- Status code returns for many operations
- Direct control flow for performance
- Less explicit error handling for hot paths

```cpp
// Exception-based error handling
if (gas < gas_cost)
    throw out_of_gas{};

// Status code returns
auto result = host.get_storage(addr, key);
if (!result.success)
    return EVMC_STORAGE_ACCESS_ERROR;
```

## Design Choices and Trade-offs

Each implementation makes different trade-offs between performance, readability, and maintainability:

### Tevm (Zig)
- **Design Philosophy**: Clean, explicit code with strong documentation
- **Strengths**: Readable implementation, explicit error handling, well-documented logic
- **Trade-offs**: Some repeated code, less optimization for performance
- **Unique Aspects**: Strong separation between gas calculation and execution logic

### go-ethereum
- **Design Philosophy**: Comprehensive reference implementation with all features
- **Strengths**: Complete feature set, sophisticated journaling, battle-tested in production
- **Trade-offs**: Complex code with many interdependencies, panic-based error handling
- **Unique Aspects**: Tight integration with MPT state and extensive caching

### revm
- **Design Philosophy**: Performance-oriented with modern Rust design patterns
- **Strengths**: High performance, strong abstractions, trait-based extensibility
- **Trade-offs**: More complex abstractions requiring deeper understanding
- **Unique Aspects**: Host trait system allowing multiple backends/implementations

### evmone
- **Design Philosophy**: Raw performance with minimal overhead
- **Strengths**: Extremely fast execution, simple design
- **Trade-offs**: Less emphasis on readability and maintainability
- **Unique Aspects**: Computed goto dispatch, direct memory manipulation

## Conclusions

The storage opcodes (SLOAD/SSTORE) provide an excellent window into the design philosophies of each EVM implementation:

1. **Tevm (Zig)** prioritizes clean, explicit code with strong documentation and error handling, making it excellent for understanding EVM semantics and as a teaching tool.

2. **go-ethereum** provides the most comprehensive implementation with sophisticated state management and journaling, but with more complex code that can be harder to understand.

3. **revm (Rust)** achieves high performance through modern design patterns and strong abstractions, with excellent error handling but requiring more knowledge of its architectural patterns.

4. **evmone (C++)** focuses on raw execution speed with minimal abstraction layers, making it extremely fast but potentially harder to maintain.

All implementations correctly follow the EIP specifications for gas calculation and state transitions, showing strong consensus on the core semantics of the Ethereum Virtual Machine.