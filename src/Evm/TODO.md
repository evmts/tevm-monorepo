# EVM Implementation Roadmap

## Project Overview

This document outlines the plan for implementing a production-ready Ethereum Virtual Machine (EVM) in Zig, based on Go-Ethereum's architecture. The goal is to create a fully compliant EVM that can execute Ethereum smart contracts with the same behavior as geth, but optimized for performance and embedded in a Zig codebase.

## Current Status

- ✅ Basic architecture established
- ✅ Frame (execution context) implemented
- ✅ JumpTable structure for opcode definitions
- ✅ Basic interpreter loop
- ✅ Math opcodes implemented
- ❌ Most opcodes still need implementation
- ❌ Gas calculation needs completion
- ❌ Testing infrastructure needs expansion

## Architecture

### Core Components

1. **EVM**: The main container for execution context
   - Tracks call depth
   - Maintains chain rules (for different hardforks)
   - Controls execution settings (readOnly, etc.)

2. **Interpreter**: The execution engine
   - Main execution loop
   - Opcode dispatch
   - Gas tracking
   - Error handling

3. **Frame**: The execution context for a particular call
   - Memory management
   - Stack operations
   - Current execution state (PC, gas cost, etc.)
   - Return data handling

4. **JumpTable**: The opcode registry
   - Maps bytecodes to operations
   - Stores gas costs for operations
   - Holds execution functions for each opcode

5. **Contract**: Represents a smart contract
   - Contains code and execution state
   - Tracks gas usage
   - Validates jump destinations

6. **Memory**: EVM memory model
   - Resizable byte array
   - Methods for reading/writing data

7. **Stack**: EVM stack
   - Fixed maximum size (1024 items)
   - Basic and specialized operations (push, pop, swap, dup)

## Implementation Plan

### 1. Opcode Implementation

All opcodes need to be implemented following the geth specification. Group them by category:

#### 1.1 Math Operations
- ✅ ADD, SUB, MUL, DIV, SDIV, MOD, SMOD, ADDMOD, MULMOD, EXP, SIGNEXTEND

**Relevant files in geth:**
- `core/vm/instructions.go:opAdd`, `opSub`, etc. - Implementation of math opcodes
- `core/vm/instructions_test.go:TestOpMstore*` - Test cases for math opcodes

#### 1.2 Comparison Operations
- ❌ LT, GT, SLT, SGT, EQ, ISZERO

**Relevant files in geth:**
- `core/vm/instructions.go:opLt`, `opGt`, etc. - Implementation of comparison opcodes
- `core/vm/instructions_test.go:TestOpCmp*` - Test cases for comparison opcodes

#### 1.3 Bitwise Operations
- ❌ AND, OR, XOR, NOT, BYTE, SHL, SHR, SAR

**Relevant files in geth:**
- `core/vm/instructions.go:opAnd`, `opOr`, etc. - Implementation of bitwise opcodes
- `core/vm/instructions_test.go:TestOpBitwise*` - Test cases for bitwise opcodes
- `core/vm/instructions.go:opByte` - Implementation of BYTE opcode

#### 1.4 Cryptographic Operations
- ❌ KECCAK256

**Relevant files in geth:**
- `core/vm/instructions.go:opKeccak256` - Implementation of KECCAK256 opcode
- `core/vm/instructions_test.go:TestOpKeccak256*` - Test cases for KECCAK256

#### 1.5 Environmental Information
- ❌ ADDRESS, BALANCE, ORIGIN, CALLER, CALLVALUE, CALLDATALOAD, CALLDATASIZE, CALLDATACOPY
- ❌ CODESIZE, CODECOPY, GASPRICE, EXTCODESIZE, EXTCODECOPY, RETURNDATASIZE, RETURNDATACOPY, EXTCODEHASH
- ❌ BLOCKHASH, COINBASE, TIMESTAMP, NUMBER, DIFFICULTY/PREVRANDAO, GASLIMIT, CHAINID, SELFBALANCE, BASEFEE
- ❌ BLOBHASH, BLOBBASEFEE

**Relevant files in geth:**
- `core/vm/instructions.go:opAddress`, `opBalance`, etc. - Implementation of environmental opcodes
- `core/vm/instructions_test.go:TestContextual*` - Test cases for environmental opcodes
- `core/vm/evm.go:BlockContext` - Block context implementation
- `core/vm/evm.go:TxContext` - Transaction context implementation

#### 1.6 Memory Operations
- ❌ MLOAD, MSTORE, MSTORE8, MSIZE, MCOPY

**Relevant files in geth:**
- `core/vm/instructions.go:opMload`, `opMstore`, etc. - Implementation of memory opcodes
- `core/vm/memory.go` - Memory implementation
- `core/vm/memory_table.go` - Memory size calculation
- `core/vm/instructions_test.go:TestOpMstore*` - Test cases for memory opcodes

#### 1.7 Storage Operations
- ❌ SLOAD, SSTORE, TLOAD, TSTORE

**Relevant files in geth:**
- `core/vm/instructions.go:opSload`, `opSstore` - Implementation of storage opcodes
- `core/vm/instructions.go:makePersistentStorage` - Implementation for transient storage
- `core/state/statedb.go` - State database implementation
- `core/state/state_object.go` - State object implementation

#### 1.8 Flow Control Operations
- ❌ JUMP, JUMPI, PC, JUMPDEST

**Relevant files in geth:**
- `core/vm/instructions.go:opJump`, `opJumpi`, etc. - Implementation of flow control opcodes
- `core/vm/analysis.go` - JUMPDEST analysis
- `core/vm/contracts.go:jumpTable` - Jump table implementation

#### 1.9 Push Operations
- ❌ PUSH0, PUSH1-PUSH32

**Relevant files in geth:**
- `core/vm/instructions.go:makePush` - Implementation of PUSH opcodes
- `core/vm/jump_table.go:newFrontierInstructionSet` - Registration of PUSH opcodes

#### 1.10 Duplication Operations
- ❌ DUP1-DUP16

**Relevant files in geth:**
- `core/vm/instructions.go:makeDup` - Implementation of DUP opcodes
- `core/vm/jump_table.go:newFrontierInstructionSet` - Registration of DUP opcodes

#### 1.11 Exchange Operations
- ❌ SWAP1-SWAP16

**Relevant files in geth:**
- `core/vm/instructions.go:makeSwap` - Implementation of SWAP opcodes
- `core/vm/jump_table.go:newFrontierInstructionSet` - Registration of SWAP opcodes

#### 1.12 Logging Operations
- ❌ LOG0, LOG1, LOG2, LOG3, LOG4

**Relevant files in geth:**
- `core/vm/instructions.go:makeLog` - Implementation of LOG opcodes
- `core/types/log.go` - Log structure definition
- `core/state/journal.go` - Transaction journal for logs

#### 1.13 System Operations
- ❌ CREATE, CALL, CALLCODE, RETURN, DELEGATECALL, CREATE2, STATICCALL, REVERT, INVALID, SELFDESTRUCT

**Relevant files in geth:**
- `core/vm/instructions.go:opCreate`, `opCall`, etc. - Implementation of system opcodes
- `core/vm/evm.go:create` - Contract creation
- `core/vm/evm.go:Call` - Contract calls
- `core/vm/contracts.go` - Precompiled contracts

### 2. Gas Calculation

#### 2.1 Basic Gas Costs
- ✅ Constants defined for all operation types
- ❌ Complete implementation of constant gas costs

**Relevant files in geth:**
- `core/vm/gas.go` - Gas cost constants
- `core/vm/gas_table.go` - Gas calculation
- `core/vm/jump_table.go` - Association of gas costs with operations

#### 2.2 Dynamic Gas Calculation
- ❌ Memory expansion costs
- ❌ Storage costs with EIP-2200 net metering
- ❌ KECCAK256 dynamic costs
- ❌ EXP operation dynamic costs
- ❌ CALL family dynamic costs
- ❌ CREATE family dynamic costs
- ❌ LOG operations dynamic costs

**Relevant files in geth:**
- `core/vm/gas_table.go:memoryGasCost` - Memory gas calculation
- `core/vm/gas_table.go:gasSStore` - Storage gas calculation (with EIP-2200)
- `core/vm/gas_table.go:gasKeccak256` - KECCAK256 gas calculation
- `core/vm/gas_table.go:gasCall` - CALL gas calculation
- `core/vm/gas_table.go:gasLog` - LOG gas calculation

### 3. State Management

#### 3.1 Account State
- ❌ Account creation and destruction
- ❌ Balance management
- ❌ Nonce tracking
- ❌ Code storage

**Relevant files in geth:**
- `core/state/state_object.go` - Account state implementation
- `core/state/statedb.go:createObject` - Account creation
- `core/state/statedb.go:deleteStateObject` - Account deletion

#### 3.2 Storage Management
- ❌ Storage trie implementation
- ❌ Storage slot read/write
- ❌ Snapshot and revert functionality

**Relevant files in geth:**
- `core/state/statedb.go:GetState`, `SetState` - Storage slot access
- `trie/trie.go` - Merkle Patricia Trie implementation
- `core/state/snapshot` - State snapshot implementation

#### 3.3 Transaction Processing
- ❌ Transaction validation
- ❌ Transaction execution
- ❌ Receipt generation

**Relevant files in geth:**
- `core/state/statedb.go:Prepare` - Transaction preparation
- `core/state/transition.go:ApplyMessage` - Transaction application
- `core/state/statedb.go:Finalise` - State finalization
- `core/types/receipt.go` - Receipt structure

### 4. Testing

#### 4.1 Unit Tests
- ❌ Stack tests (complete coverage)
- ❌ Memory tests (complete coverage)
- ❌ Individual opcode tests
- ❌ Gas calculation tests

**Relevant files in geth:**
- `core/vm/stack_test.go` - Stack tests
- `core/vm/memory_test.go` - Memory tests
- `core/vm/instructions_test.go` - Opcode tests
- `core/vm/gas_test.go` - Gas calculation tests

#### 4.2 Integration Tests
- ❌ Full contract execution tests
- ❌ State transition tests
- ❌ Fork tests

**Relevant files in geth:**
- `core/vm/runtime/runtime_test.go` - VM runtime tests
- `core/vm/evm_test.go` - EVM integration tests
- `core/blockchain_test.go` - Blockchain tests

#### 4.3 Ethereum Test Vectors
- ❌ Port Ethereum test vectors from geth
- ❌ Implement test harness for test vectors

**Relevant files in geth:**
- `tests/init.go` - Test initialization
- `tests/vm_test.go` - VM test harness
- `tests/state_test.go` - State test harness
- `tests/transaction_test.go` - Transaction test harness

### 5. Precompiled Contracts

#### 5.1 Standard Precompiles
- ❌ ECRECOVER (0x01)
- ❌ SHA256 (0x02)
- ❌ RIPEMD160 (0x03)
- ❌ IDENTITY (0x04)
- ❌ MODEXP (0x05)
- ❌ ECADD (0x06)
- ❌ ECMUL (0x07)
- ❌ ECPAIRING (0x08)
- ❌ BLAKE2F (0x09)

**Relevant files in geth:**
- `core/vm/contracts.go` - Precompiled contract definitions
- `core/vm/contracts/ecrecover.go` - ECRECOVER implementation
- `core/vm/contracts/sha256.go` - SHA256 implementation
- `core/vm/contracts/ripemd160.go` - RIPEMD160 implementation
- `core/vm/contracts/identity.go` - IDENTITY implementation
- `core/vm/contracts/modexp.go` - MODEXP implementation
- `core/vm/contracts/bn256_*.go` - BN256 curve operations (ECADD, ECMUL, ECPAIRING)
- `core/vm/contracts/blake2f.go` - BLAKE2F implementation

#### 5.2 EIP-specific Precompiles
- ❌ POINT_EVALUATION (0x0A) (EIP-4844)
- ❌ Any other precompiles from active EIPs

**Relevant files in geth:**
- `core/vm/contracts/point_evaluation.go` - POINT_EVALUATION implementation

### 6. Hardfork Support

#### 6.1 Frontier
- ❌ Basic opcodes
- ❌ Original gas costs

**Relevant files in geth:**
- `core/vm/jump_table.go:frontierInstructionSet` - Frontier instruction set
- `params/config.go:ChainConfigWithFrontier` - Frontier configuration

#### 6.2 Homestead
- ❌ Changes to DELEGATECALL

**Relevant files in geth:**
- `core/vm/jump_table.go:homesteadInstructionSet` - Homestead instruction set
- `params/config.go:ChainConfigWithHomestead` - Homestead configuration

#### 6.3 Tangerine Whistle (EIP-150)
- ❌ Gas cost changes

**Relevant files in geth:**
- `core/vm/jump_table.go:tangerineWhistleInstructionSet` - TangerineWhistle instruction set
- `params/config.go:ChainConfigWithEIP150` - EIP-150 configuration

#### 6.4 Spurious Dragon (EIP-158)
- ❌ Empty account cleanup
- ❌ EXP gas cost change

**Relevant files in geth:**
- `core/vm/jump_table.go:spuriousDragonInstructionSet` - SpuriousDragon instruction set
- `params/config.go:ChainConfigWithEIP158` - EIP-158 configuration

#### 6.5 Byzantium
- ❌ REVERT opcode
- ❌ RETURNDATASIZE and RETURNDATACOPY opcodes
- ❌ STATICCALL opcode
- ❌ New precompiled contracts

**Relevant files in geth:**
- `core/vm/jump_table.go:byzantiumInstructionSet` - Byzantium instruction set
- `params/config.go:ChainConfigWithByzantium` - Byzantium configuration

#### 6.6 Constantinople/Petersburg
- ❌ SHL, SHR, SAR opcodes
- ❌ CREATE2 opcode
- ❌ EXTCODEHASH opcode

**Relevant files in geth:**
- `core/vm/jump_table.go:constantinopleInstructionSet` - Constantinople instruction set
- `params/config.go:ChainConfigWithConstantinople` - Constantinople configuration

#### 6.7 Istanbul
- ❌ Gas cost changes
- ❌ CHAINID opcode
- ❌ SELFBALANCE opcode

**Relevant files in geth:**
- `core/vm/jump_table.go:istanbulInstructionSet` - Istanbul instruction set
- `params/config.go:ChainConfigWithIstanbul` - Istanbul configuration

#### 6.8 Berlin
- ❌ Gas cost changes
- ❌ BASEFEE opcode

**Relevant files in geth:**
- `core/vm/jump_table.go:berlinInstructionSet` - Berlin instruction set
- `params/config.go:ChainConfigWithBerlin` - Berlin configuration

#### 6.9 London
- ❌ BASEFEE opcode
- ❌ EIP-3529 (refund changes)

**Relevant files in geth:**
- `core/vm/jump_table.go:londonInstructionSet` - London instruction set
- `params/config.go:ChainConfigWithLondon` - London configuration

#### 6.10 Merge
- ❌ DIFFICULTY -> PREVRANDAO changes

**Relevant files in geth:**
- `core/vm/jump_table.go:mergeInstructionSet` - Merge instruction set
- `params/config.go:ChainConfigWithMerge` - Merge configuration

#### 6.11 Shanghai
- ❌ PUSH0 opcode
- ❌ Warm COINBASE access

**Relevant files in geth:**
- `core/vm/jump_table.go:shanghaiInstructionSet` - Shanghai instruction set
- `params/config.go:ChainConfigWithShanghai` - Shanghai configuration

#### 6.12 Cancun
- ❌ TLOAD, TSTORE opcodes
- ❌ MCOPY opcode
- ❌ BLOBHASH, BLOBBASEFEE opcodes
- ❌ POINT_EVALUATION precompile

**Relevant files in geth:**
- `core/vm/jump_table.go:cancunInstructionSet` - Cancun instruction set
- `params/config.go:ChainConfigWithCancun` - Cancun configuration
- `core/vm/instructions.go:opTload`, `opTstore` - Transient storage opcodes
- `core/vm/instructions.go:opMcopy` - Memory copy opcode
- `core/vm/instructions.go:opBlobhash`, `opBlobbasefee` - Blob operations

### 7. Optimizations

#### 7.1 Performance Optimization
- ❌ Hot path optimization
- ❌ Memory allocation optimization
- ❌ JIT compilation for frequently executed code

**Relevant files in geth:**
- `core/vm/interpreter.go:run` - Main interpreter loop (hot path)
- `core/vm/stack.go` - Stack implementation (performance critical)
- `core/vm/memory.go` - Memory implementation (performance critical)

#### 7.2 Memory Usage Optimization
- ❌ Reduce memory allocations
- ❌ Optimize data structures

**Relevant files in geth:**
- `core/vm/memory.go:Resize` - Memory resize strategy
- `core/vm/stack.go:data` - Stack data structure

#### 7.3 Gas Usage Optimization
- ❌ Fast paths for common operations
- ❌ Optimize gas calculation

**Relevant files in geth:**
- `core/vm/gas_table.go` - Gas calculation functions
- `core/vm/interpreter.go:run` - Gas metering in the interpreter loop

## Porting Strategy

When porting code from Go to Zig, follow these principles:

1. **Understand before porting**: Fully understand how the Go code works before attempting to port it.
2. **Test-driven approach**: Write tests first, then implement the functionality.
3. **Language idioms**: Don't blindly translate Go code to Zig; use Zig idioms and features.
4. **Start simple**: Get basic functionality working before adding optimizations.
5. **Incremental testing**: Test each component as it's implemented.

## Test Cases from Geth

Look in these locations in the geth codebase for test cases:

- `core/vm/runtime_test.go` - Runtime tests
- `core/vm/evm_test.go` - EVM tests
- `core/vm/instructions_test.go` - Opcode tests
- `core/vm/jump_table_test.go` - Jump table tests
- `core/state/state_test.go` - State tests
- `tests/state_test.go` - Ethereum official state tests

## Key Files in Geth Codebase

### Core EVM Implementation
- `core/vm/evm.go` - Main EVM implementation
- `core/vm/interpreter.go` - EVM interpreter
- `core/vm/stack.go` - Stack implementation
- `core/vm/memory.go` - Memory implementation
- `core/vm/opcodes.go` - Opcode definitions
- `core/vm/jump_table.go` - Jump table for opcodes
- `core/vm/gas.go` - Gas cost constants
- `core/vm/gas_table.go` - Dynamic gas calculation
- `core/vm/contracts.go` - Precompiled contract definitions
- `core/vm/errors.go` - Error definitions
- `core/vm/logger.go` - EVM execution logging

### State Management
- `core/state/statedb.go` - State database
- `core/state/state_object.go` - Account state
- `core/state/journal.go` - State changes journal
- `trie/trie.go` - Merkle Patricia Trie

### Blockchain Components
- `core/blockchain.go` - Blockchain implementation
- `core/types/block.go` - Block structure
- `core/types/transaction.go` - Transaction structure
- `core/types/receipt.go` - Receipt structure
- `params/protocol_params.go` - Protocol parameters
- `params/config.go` - Chain configuration

### Testing Infrastructure
- `tests/vm_test_util.go` - VM test utilities
- `tests/state_test_util.go` - State test utilities
- `core/vm/testdata/` - Test fixtures

## References

- [Go-Ethereum (geth) GitHub repository](https://github.com/ethereum/go-ethereum)
- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
- [EVM Opcodes Reference](https://www.evm.codes/)
- [EIPs (Ethereum Improvement Proposals)](https://eips.ethereum.org/)

## Appendix: EVM Diagram

```
┌─────────────────────────┐
│          EVM            │
│                         │
│   ┌─────────────────┐   │
│   │   Interpreter   │   │
│   │                 │   │
│   │  ┌──────────┐   │   │
│   │  │ JumpTable│   │   │
│   │  └──────────┘   │   │
│   │                 │   │
│   │  ┌──────────┐   │   │
│   │  │Operations│   │   │
│   │  └──────────┘   │   │
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │      Frame      │   │
│   │                 │   │
│   │  ┌──────────┐   │   │
│   │  │  Stack   │   │   │
│   │  └──────────┘   │   │
│   │                 │   │
│   │  ┌──────────┐   │   │
│   │  │  Memory  │   │   │
│   │  └──────────┘   │   │
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │    Contract     │   │
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │StateManager/Trie│   │
│   └─────────────────┘   │
└─────────────────────────┘
```