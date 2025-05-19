# EVM Implementation Plan

## Go-Ethereum Architecture Overview

The Go-Ethereum (geth) EVM implementation is based on several key components:

1. **EVMInterpreter**: The main execution engine that runs smart contract code
   - Manages VM configuration and execution context
   - Contains the main execution loop
   - Handles operations like gas metering, code execution, and stack management

2. **JumpTable**: Contains all opcode definitions for the EVM
   - Different instruction sets for different hardforks
   - Each opcode has associated gas costs, stack requirements, and an execution function

3. **ScopeContext**: Contains the execution context for a particular call
   - Memory, Stack, and Contract references
   - Helper methods for accessing contract data

4. **Memory**: EVM memory implementation
   - Resizable byte array 
   - Methods for accessing and modifying memory

5. **Stack**: EVM stack implementation
   - Methods for pushing, popping, and manipulating stack items
   - Fixed size with validation

6. **Contract**: Represents an Ethereum contract 
   - Contains code, caller, callee addresses, value
   - Tracks gas usage
   - Validates jumpdest targets

7. **Error Handling**: Comprehensive error types for different EVM errors
   - Stack underflow/overflow
   - Out of gas
   - Execution reverted
   - Invalid opcode, etc.

## Current TEVM Architecture

1. **Interpreter**: Main execution component
   - Main run loop with program counter
   - Executes opcodes with operation.execute method

2. **InterpreterState** (to be renamed to Frame): Contains execution state
   - Represents a single execution frame
   - Manages stack, memory, and program counter
   - **TODO:** Expand to match geth's functionality

3. **JumpTable**: Contains opcode definitions
   - Maps opcodes to their implementations
   - Includes gas cost and stack requirements
   - Initialization for different Ethereum versions

4. **Stack**: Fixed-size stack for EVM
   - Push/pop operations
   - Dup/swap operations
   - Error handling for overflow/underflow

5. **Memory**: Represents EVM memory
   - Resizing capability
   - Methods to read/write bytes
   - Set32 for writing 32-byte values

6. **Contract**: Represents a contract execution
   - Contains code, addresses, gas tracking
   - JUMPDEST validation

## TODO List

1. **Rename InterpreterState to Frame**
   - Update all references and imports
   - Match geth's concept of execution frame/context

2. **Complete EVM Implementation**
   - Implement all missing operations in opcodes.zig
   - Implement proper gas calculation for all operations
   - Complete memory size calculation for memory-modifying operations

3. **Execution Loop Enhancement**
   - Add proper error handling with specific error types
   - Implement gas metering based on geth's approach
   - Add proper tracing hooks for debugging

4. **Frame Implementation**
   - Add returnData field to store data from calls
   - Enhance memory management
   - Add proper scope management for nested calls

5. **Testing Infrastructure**
   - Port test cases from geth
   - Create comprehensive test suite for all opcodes
   - Test edge cases like gas exhaustion, stack errors

6. **Gas Calculation**
   - Implement dynamic gas calculation functions
   - Memory expansion gas costs
   - Storage costs based on EIP-2200 (net gas metering)

7. **Add Support for Different Hardforks**
   - Implement different instruction sets based on hardforks
   - Make JumpTable initialization hardfork-aware

8. **Implement State Modifications**
   - SSTORE/SLOAD implementations
   - Account creation/destruction
   - Value transfer operations

9. **External Contract Interactions**
   - CALL/DELEGATECALL/STATICCALL operations
   - CREATE/CREATE2 operations
   - SELFDESTRUCT implementation

10. **Precompiled Contracts**
    - Implement standard precompiled contracts (ECRECOVER, SHA256, etc.)
    - Integrate with main interpreter

## Testing Strategy

1. **Unit Tests for Each Component**
   - Stack, Memory, Contract, Frame, etc.
   - Test all edge cases and error conditions

2. **Opcode Tests**
   - Individual tests for each opcode
   - Gas consumption tests
   - Error handling tests

3. **Integration Tests**
   - Full contract execution tests
   - Ethereum test vectors
   - Transaction-level tests

4. **Performance Testing**
   - Compare with geth implementation
   - Optimize hot paths

## Implementation Order

1. Focus on core components first:
   - Complete Frame implementation
   - Basic arithmetic operations
   - Stack and memory operations

2. Then implement state-affecting operations:
   - Storage operations
   - Log operations

3. Finally, implement more complex operations:
   - External calls
   - Contract creation
   - Precompiled contracts

This approach ensures we have a solid foundation before tackling more complex features.