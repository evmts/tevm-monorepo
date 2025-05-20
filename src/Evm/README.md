# Ethereum Virtual Machine (EVM) Implementation

This directory contains the Zig implementation of the Ethereum Virtual Machine (EVM), the runtime environment where all Ethereum smart contracts are executed.

## Architecture Overview

The EVM implementation is structured into several key components:

### Core Components

- **[evm.zig](./evm.zig)**: Main EVM implementation with configuration and chain rules
- **[interpreter.zig](./interpreter.zig)**: Core execution loop and instruction processing
- **[Stack.zig](./Stack.zig)**: EVM stack implementation (1024 max elements, 256-bit values)
- **[Memory.zig](./Memory.zig)**: Linear byte array memory with expansion mechanics
- **[Frame.zig](./Frame.zig)**: Execution frame containing stack and memory for a call
- **[Contract.zig](./Contract.zig)**: Representation of a contract being executed
- **[JumpTable.zig](./JumpTable.zig)**: Dispatcher for opcode implementations

### State Management

- **[State/](./State/)**: State management components for accessing and modifying accounts and storage
- **[FeeMarket.zig](./FeeMarket.zig)**: Implementation of EIP-1559 fee market mechanics
- **[FeeMarketTransaction.zig](./FeeMarketTransaction.zig)**: Transaction types for EIP-1559

### Instruction Implementations

- **[opcodes.zig](./opcodes.zig)**: Opcode definitions and mappings
- **[opcodes/](./opcodes/)**: Individual opcode implementations by category
  - Arithmetic operations (math.zig, math2.zig)
  - Bitwise operations (bitwise.zig)
  - Control flow (controlflow.zig)
  - Storage operations (storage.zig)
  - Cryptographic operations (crypto.zig)
  - And more...

### Precompiled Contracts

- **[precompiles.zig](./precompiles.zig)**: Main precompile registry
- **[precompiles/](./precompiles/)**: Standard precompiled contracts implementation
- **[precompile/](./precompile/)**: Advanced precompiled contracts (BLS12-381, etc.)

### EIP Implementations

Numerous Ethereum Improvement Proposals (EIPs) are implemented, including:

- EIP-1559: Base fee and gas price mechanics
- EIP-2929: Gas cost increases for state access operations
- EIP-3198: BASEFEE opcode
- EIP-3651: Warm COINBASE
- EIP-3855: PUSH0 instruction
- EIP-3860: Limit and meter initcode
- EIP-4844: Blob transactions (proto-danksharding)
- EIP-1153: Transient storage operations
- EIP-5656: MCOPY instruction

Each EIP implementation has corresponding documentation in the `.md` files.

## Chain Rules and Hardforks

The EVM supports all Ethereum hardforks from Frontier to Cancun, with preliminary support for Prague and Verkle:

- **Frontier**: The original Ethereum protocol
- **Homestead**: Added DELEGATECALL and other changes
- **Byzantium**: Added REVERT, RETURNDATASIZE, RETURNDATACOPY, STATICCALL
- **Constantinople/Petersburg**: Added bitwise shifting instructions and EXTCODEHASH
- **Istanbul**: Added CHAINID and SELFBALANCE instructions
- **Berlin**: Changed gas calculation for state access operations
- **London**: Added EIP-1559 fee market and BASEFEE opcode
- **Merge**: Transitioned from Proof of Work to Proof of Stake
- **Shanghai**: Added support for validator withdrawals and PUSH0
- **Cancun**: Added EIP-4844 for blob transactions and other improvements
- **Prague**: Planned future upgrade (preliminary support)
- **Verkle**: Planned transition to Verkle trees (preliminary support)

## Testing

The implementation includes extensive test coverage:

- Unit tests for individual components
- Integration tests for EIP implementations
- Compatibility tests against specification

## Future Enhancements

For planned features and improvements, see [TODO_EIP.md](./TODO_EIP.md).

## Key Features

- **Complete Opcode Support**: All Ethereum opcodes up to Cancun are implemented
- **EIP Compliance**: Implements all required EIPs for each hardfork
- **Advanced Precompiles**: Support for advanced cryptographic operations
- **Efficient Memory Management**: Optimized for performance and memory usage
- **Detailed Logging**: Comprehensive debug logging for execution tracing