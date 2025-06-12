# Tevm EVM - Blazingly Fast Zig Implementation

A high-performance Ethereum Virtual Machine (EVM) implementation written in Zig, designed for both native and WebAssembly environments.

## 🎯 Project Goals

Tevm EVM is fully MIT licensed and aims to achieve three major goals:

1. **Best in class performance** - Leveraging Zig's zero hidden control flow and explicit memory management
2. **Smallest bundle size** - Optimized for WebAssembly deployment in JavaScript applications
3. **Feature complete and easy to maintain** - Clean architecture with clear separation of concerns

## 🔧 Build targets

Oftentimes size vs speed is a tradeoff. Much of other EVM wasm bundle size can be attributed to this tradeoff.

The zig build can be optimized for different tradeoffs

- Debug - Warns on undefined behavior and includes logging
- ReleaseFast - Optimizes for speed. Recomended for server apps that need the perf
- ReleaseSmall - Optimizes for small sizes. Recomended for WASM in browser
- ReleaseSafe - Optimizes for memory safety. Recomended for those who don't care about speed or perf

## 🚀 Why Zig?

The Zig programming language has proven to be an exceptional choice for this project:

- **Performance**: Zero hidden control flow and allocations make optimizing performance straightforward
- **Bundle Size**: Significantly better than Rust and Golang for building tiny WASM bundles
- **Maintainability**: Nearly as productive as Golang and JavaScript, making it enjoyable to read and write
- **Flexibility**: Architecture allows compiler optimization for either performance (inlining) or size

### Why not Rust?

Tevm originally planned on using revm. Revm has the following problems:

- **Bundle Size** Revm is only optimized for performance and not as much optimized for size including lots of inline and an api that bundles lots of unused code into final bundle
- **Wasm** Experimentation is showing zig to be a more ergonomic choice for wasm
- **C integration** Zig has first-class c integration giving it all of the C ecosystem first class as well as ability to interop with rust code too in a pinch
- **Dev velocity** We have found ourselves able to ship very fast with zig
- **Performance** Zig makes optimizing performance easy because of it's 0 hidden control flow or allocations making teh code so explicit about what is happening at a low level

### Why not JS?

Tevm is currently built on Ethereumjs. This migration to zig will have following impact

- [100x perf](https://github.com/ziyadedher/evm-bench)
- Smaller bundle size (we are optimizing for it up front)
- Complete control over the EVM with verticle integration with all of Tevm

## 🏃 Running the Project

```bash
# Build the project
zig build

# Run all tests (669 tests)
zig build test-all

# Run specific test suites
zig build test-evm        # EVM core tests
zig build test-opcodes    # Opcode implementation tests
zig build test-stack      # Stack tests
zig build test-memory     # Memory tests
zig build test-gas        # Gas accounting tests
```

All test and build targets are configured in build.zig. If an import isn't working you may need to add it there.

## Learning zig

Zig is pretty easy especially if you have used a memory managed language in the past. Here is what I did to learn it

1. [ziglings](https://ziglings.org/) to learn basic syntax
2. Skim through [std library docs](https://ziglang.org/documentation/master/std/)
3. Write zig and ask AI questions as I go. The entire [zig language docs](https://ziglang.org/documentation/0.14.1/) fits in context.
4. Read zig code from std library and other OSS code. Avoid Bun, however, as that project is a bit harder to read and understand.

## 🤖 AI

Use both the root CLAUDE.md and src/evm/CLAUDE.md in your claude and cursor environments. They have important rules for the AI for this project.

AI is decent at zig but it does hallucinate sometimes. It's not a big deal if you understand zig well. If you aren't comfy with zig consider sharign [zig language docs](https://ziglang.org/documentation/0.14.1/) anytime the ai isn't using zig right. They are small enough to almost always fit in context.

## ✅ Implementation Status

### Core EVM Architecture

- [x] **VM Implementation** (`vm.zig`) - Core virtual machine orchestrating execution
- [x] **Frame Management** (`frame.zig`) - Execution contexts with stack, memory, and PC
- [x] **Memory Management** (`memory.zig`) - Byte-addressable with expansion and copy-on-write semantics
- [x] **Jump Table** (`jump_table/`) - O(1) opcode dispatch with hardfork-specific configurations
- [x] **Error Mapping** (`error_mapping.zig`) - Comprehensive error translation utilities
- [x] **Contract System** (`contract/`) - Contract execution context and bytecode analysis
- [x] **State Management** (`state/`) - World state interface with account and storage handling

### Stack Implementation (`stack/`)

- [x] **Core Stack** (`stack.zig`) - 1024 element capacity with overflow/underflow protection
- [x] **Stack Validation** (`stack_validation.zig`) - Pre-execution bounds checking
- [x] **Validation Patterns** (`validation_patterns.zig`) - Common stack operation patterns
- [x] **Unsafe Operations** - High-performance batch operations (pop2_push1_unsafe, etc.)

### Arithmetic Opcodes (`execution/arithmetic.zig`)

- [x] **ADD** (0x01) - Addition with overflow wrapping
- [x] **MUL** (0x02) - Multiplication with overflow wrapping
- [x] **SUB** (0x03) - Subtraction with underflow wrapping
- [x] **DIV** (0x04) - Integer division (div by zero = 0)
- [x] **SDIV** (0x05) - Signed integer division
- [x] **MOD** (0x06) - Modulo operation
- [x] **SMOD** (0x07) - Signed modulo operation
- [x] **ADDMOD** (0x08) - Addition followed by modulo
- [x] **MULMOD** (0x09) - Multiplication followed by modulo
- [x] **EXP** (0x0A) - Exponentiation with dynamic gas
- [x] **SIGNEXTEND** (0x0B) - Sign extension operation

### Comparison Opcodes (`execution/comparison.zig`)

- [x] **LT** (0x10) - Less than comparison
- [x] **GT** (0x11) - Greater than comparison
- [x] **SLT** (0x12) - Signed less than
- [x] **SGT** (0x13) - Signed greater than
- [x] **EQ** (0x14) - Equality comparison
- [x] **ISZERO** (0x15) - Zero check

### Bitwise Opcodes (`execution/bitwise.zig`)

- [x] **AND** (0x16) - Bitwise AND
- [x] **OR** (0x17) - Bitwise OR
- [x] **XOR** (0x18) - Bitwise XOR
- [x] **NOT** (0x19) - Bitwise NOT
- [x] **BYTE** (0x1A) - Byte extraction
- [x] **SHL** (0x1B) - Shift left
- [x] **SHR** (0x1C) - Shift right
- [x] **SAR** (0x1D) - Arithmetic shift right

### Crypto Opcodes (`execution/crypto.zig`)

- [x] **SHA3/KECCAK256** (0x20) - Keccak-256 hash function

### Environment Opcodes (`execution/environment.zig`)

- [x] **ADDRESS** (0x30) - Current contract address
- [x] **BALANCE** (0x31) - Account balance lookup
- [x] **ORIGIN** (0x32) - Transaction origin
- [x] **CALLER** (0x33) - Message caller
- [x] **CALLVALUE** (0x34) - Message value
- [x] **CALLDATALOAD** (0x35) - Load word from call data
- [x] **CALLDATASIZE** (0x36) - Size of call data
- [x] **CALLDATACOPY** (0x37) - Copy call data to memory
- [x] **CODESIZE** (0x38) - Size of executing code
- [x] **CODECOPY** (0x39) - Copy executing code to memory
- [x] **GASPRICE** (0x3A) - Transaction gas price
- [x] **EXTCODESIZE** (0x3B) - External code size
- [x] **EXTCODECOPY** (0x3C) - Copy external code to memory
- [x] **RETURNDATASIZE** (0x3D) - Size of return data from last call
- [x] **RETURNDATACOPY** (0x3E) - Copy return data to memory
- [x] **EXTCODEHASH** (0x3F) - External code hash
- [x] **SELFBALANCE** (0x47) - Balance of current contract

### Block Information Opcodes (`execution/block.zig`)

- [x] **BLOCKHASH** (0x40) - Block hash lookup
- [x] **COINBASE** (0x41) - Block beneficiary
- [x] **TIMESTAMP** (0x42) - Block timestamp
- [x] **NUMBER** (0x43) - Block number
- [x] **DIFFICULTY/PREVRANDAO** (0x44) - Block difficulty or random value
- [x] **GASLIMIT** (0x45) - Block gas limit
- [x] **CHAINID** (0x46) - Chain identifier
- [x] **BASEFEE** (0x48) - Base fee per gas (EIP-1559)
- [x] **BLOBHASH** (0x49) - Blob hash (EIP-4844)
- [x] **BLOBBASEFEE** (0x4A) - Blob base fee (EIP-4844)

### Stack Opcodes (`execution/stack.zig`)

- [x] **POP** (0x50) - Remove top stack item
- [x] **PUSH0** (0x5F) - Push zero (EIP-3855)
- [x] **PUSH1-PUSH32** (0x60-0x7F) - Push 1-32 bytes onto stack
- [x] **DUP1-DUP16** (0x80-0x8F) - Duplicate stack items
- [x] **SWAP1-SWAP16** (0x90-0x9F) - Swap stack items

### Memory Opcodes (`execution/memory.zig`)

- [x] **MLOAD** (0x51) - Load word from memory
- [x] **MSTORE** (0x52) - Store word to memory
- [x] **MSTORE8** (0x53) - Store byte to memory
- [x] **MSIZE** (0x59) - Size of active memory
- [x] **MCOPY** (0x5E) - Copy memory to memory (EIP-5656)

### Storage Opcodes (`execution/storage.zig`)

- [x] **SLOAD** (0x54) - Load from storage
- [x] **SSTORE** (0x55) - Store to storage
- [x] **TLOAD** (0x5C) - Load from transient storage (EIP-1153)
- [x] **TSTORE** (0x5D) - Store to transient storage (EIP-1153)

### Control Flow Opcodes (`execution/control.zig`)

- [x] **JUMP** (0x56) - Unconditional jump
- [x] **JUMPI** (0x57) - Conditional jump
- [x] **PC** (0x58) - Program counter
- [x] **JUMPDEST** (0x5B) - Jump destination marker
- [x] **STOP** (0x00) - Halts execution
- [x] **RETURN** (0xF3) - Return data and halt
- [x] **REVERT** (0xFD) - Revert state and halt
- [x] **SELFDESTRUCT** (0xFF) - 🔴 Destroy contract and transfer balance | [Enhanced](./prompts/implement-selfdestruct-opcode-enhanced.md)

### System Opcodes (`execution/system.zig`)

- [x] **GAS** (0x5A) - Remaining gas
- [x] **CREATE** (0xF0) - 🟡 Create contract (basic implementation)
- [x] **CREATE2** (0xF5) - 🟡 Create contract with salt (basic implementation)
- [x] **CALL** (0xF1) - 🟡 Message call (basic implementation)
- [x] **CALLCODE** (0xF2) - 🟡 Message call with caller's context
- [x] **DELEGATECALL** (0xF4) - 🟡 Message call with caller's context and value
- [x] **STATICCALL** (0xFA) - 🟡 Static message call
- [x] **INVALID** (0xFE) - Invalid opcode

### Logging Opcodes (`execution/log.zig`)

- [x] **LOG0** (0xA0) - Emit log with 0 topics
- [x] **LOG1** (0xA1) - Emit log with 1 topic
- [x] **LOG2** (0xA2) - Emit log with 2 topics
- [x] **LOG3** (0xA3) - Emit log with 3 topics
- [x] **LOG4** (0xA4) - Emit log with 4 topics

### Gas & Access Lists

- [x] **Gas Metering** (`constants/gas_constants.zig`) - Comprehensive gas costs for all opcodes
- [x] **Access Lists** (`access_list/`) - EIP-2929/2930 warm/cold storage and account tracking
- [x] **Memory Expansion Gas** - Dynamic gas calculation for memory growth
- [x] **Dynamic Gas Costs** - Context-dependent gas costs (SSTORE, calls, etc.)

### Hardfork Support (`hardforks/`)

- [x] **Hardfork Detection** (`hardfork.zig`) - Frontier through Cancun
- [x] **Chain Rules** (`chain_rules.zig`) - Fork-specific validation and behavior
- [x] **Operation Availability** - Opcode availability by hardfork
- [x] **EIP-2929** - Gas cost increases for state access
- [x] **EIP-2930** - Optional access lists
- [x] **EIP-3855** - PUSH0 opcode (Shanghai)
- [x] **EIP-1153** - Transient storage (Cancun)
- [x] **EIP-5656** - MCOPY opcode (Cancun)

### External Modules

- [x] **Address System** (`src/Address/`) - Address type and utilities
- [x] **Trie Implementation** (`src/Trie/`) - Merkle Patricia Trie with optimizations
  - [x] **Hash Builders** - Multiple hash building strategies
  - [x] **Merkle Proofs** - Proof generation and verification
  - [x] **Optimized Branches** - Performance optimizations

### Advanced Features

- [x] **Static Call Protection** - Prevents state modifications in read-only contexts
- [x] **Call Depth Limits** - 1024 call depth enforcement
- [x] **Code Analysis** (`contract/code_analysis.zig`) - JUMPDEST validation and bytecode analysis
- [x] **Storage Pooling** (`contract/storage_pool.zig`) - Efficient storage slot management
- [x] **Fee Market** (`fee_market.zig`) - EIP-1559 fee calculations
- [x] **Two-Stage Safety System** - Pre-validation + unsafe execution for performance

### Missing Features

#### Critical System Features

- [ ] 🔴 **WASM Build** - [Currently broken, needs fixing as well as integration into the overall Tevm typescript code](./prompts/implement-wasm-build-fix.md)
- [x] **Journaling/State Reverting** - Complete state snapshots for proper revert handling ✅
- [x] **Database Interface/Traits** - Pluggable database abstraction for state management ✅
- [x] **Complete CALL Operations** - Basic implementation with comprehensive call infrastructure ✅
  - [🔄] **Call Gas Management** - [63/64th gas forwarding rule implementation](./prompts/implement-call-gas-management.md) | [Enhanced](./prompts/implement-call-gas-management-enhanced.md)
  - [x] **Call Gas Management** - [63/64th gas forwarding rule implementation](./prompts/implement-call-gas-stipend.md) ✅
  - [🔄] **Call Gas Management** - [63/64th gas forwarding rule implementation](./prompts/implement-call-gas-stipend.md) - @claude working on this
  - [x] **Call Gas Management** - [63/64th gas forwarding rule implementation](./prompts/implement-call-gas-stipend.md) ✅
  - [🔄] **Call Gas Management** - [63/64th gas forwarding rule implementation](./prompts/implement-call-gas-stipend.md) - @claude working on this
  - [x] **Call Gas Management** - [63/64th gas forwarding rule implementation](./prompts/implement-call-gas-stipend.md) ✅
  - [x] **Call Context Switching** - Proper context isolation between contract calls ✅
  - [x] **Return Data Handling** - Complete RETURNDATASIZE/RETURNDATACOPY after calls ✅
  - [x] **Value Transfer Logic** - ETH transfer mechanics in calls ✅

#### Precompiled Contracts (2/17 implemented)

- [ ] 🟡 **Standard Precompiles**
  - [🔄] review with more context please **ECRECOVER** (0x01) - [Elliptic curve signature recovery](./prompts/implement-ecrecover-precompile.md) | [Enhanced](./prompts/implement-ecrecover-precompile-enhanced.md)
  - [x] review with more context please **SHA256** (0x02) - [SHA-256 hash function](./prompts/implement-sha256-precompile.md)

#### Precompiled Contracts (3/17 implemented)

- [ ] 🟡 **Standard Precompiles**
  - [x] **ECRECOVER** (0x01) - Elliptic curve signature recovery (placeholder implementation) ✅

#### Precompiled Contracts (3/17 implemented)

- [ ] 🟡 **Standard Precompiles**
  - [x] **ECRECOVER** (0x01) - Elliptic curve signature recovery (placeholder implementation) ✅
  - [x] **SHA256** (0x02) - SHA-256 hash function ✅
  - [ ] **RIPEMD160** (0x03) - [RIPEMD-160 hash function](./prompts/implement-ripemd160-precompile.md)

#### Precompiled Contracts (6/17 implemented)

#### Precompiled Contracts (4/17 implemented)

- [ ] 🟡 **Standard Precompiles**
  - [x] **ECRECOVER** (0x01) - Elliptic curve signature recovery (placeholder implementation) ✅
  - [x] **SHA256** (0x02) - SHA-256 hash function ✅
  - [🔄] **RIPEMD160** (0x03) - [RIPEMD-160 hash function](./prompts/implement-ripemd160-precompile.md) - @claude working on this
  - [x] **IDENTITY** (0x04) - Identity/copy function ✅
  - [ ] **MODEXP** (0x05) - [Modular exponentiation](./prompts/implement-modexp-precompile.md) | [Enhanced](./prompts/implement-modexp-precompile-enhanced.md)
  - [x] **ECADD** (0x06) - [Elliptic curve point addition](./prompts/implement-ecadd-precompile.md) ✅
  - [x] **ECMUL** (0x07) - [Elliptic curve point multiplication](./prompts/implement-ecmul-precompile.md) ✅
  - [x] **ECPAIRING** (0x08) - [Elliptic curve pairing check](./prompts/implement-ecpairing-precompile.md) ✅
  - [🔄] **BLAKE2F** (0x09) - [Blake2f compression function](./prompts/implement-blake2f-precompile.md) - @claude working on this
  - [ ] **MODEXP** (0x05) - [Modular exponentiation](./prompts/implement-modexp-precompile.md)
  - [🔄] **MODEXP** (0x05) - [Modular exponentiation](./prompts/implement-modexp-precompile.md) - @claude working on this
  - [x] **MODEXP** (0x05) - Modular exponentiation with EIP-2565 gas optimization ✅
  - [ ] **ECADD** (0x06) - Elliptic curve point addition
  - [ ] **ECMUL** (0x07) - Elliptic curve point multiplication
  - [ ] **ECPAIRING** (0x08) - Elliptic curve pairing check
  - [ ] **BLAKE2F** (0x09) - [Blake2f compression function](./prompts/implement-blake2f-precompile.md)
- [x] **KZG Point Evaluation** (0x0A) - EIP-4844 blob verification precompile ✅
- [ ] 🟡 **BLS12-381 Precompiles** (EIP-2537)
  - [ ] **G1ADD** (0x0B) - BLS12-381 G1 addition
  - [ ] **G1MSM** (0x0C) - [BLS12-381 G1 multi-scalar multiplication](./prompts/implement-bls12-381-g1msm-precompile.md)
  - [ ] **G2ADD** (0x0D) - [BLS12-381 G2 addition](./prompts/implement-bls12-381-g2add-precompile.md) | [Enhanced](./prompts/implement-bls12-381-g2add-precompile-enhanced.md)
  - [ ] **G2MSM** (0x0E) - [BLS12-381 G2 multi-scalar multiplication](./prompts/implement-bls12-381-g2msm-precompile.md) | [Enhanced](./prompts/implement-bls12-381-g2msm-precompile-enhanced.md)
  - [ ] **PAIRING** (0x0F) - [BLS12-381 pairing check](./prompts/implement-bls12-381-pairing-precompile.md) | [Enhanced](./prompts/implement-bls12-381-pairing-precompile-enhanced.md)
  - [ ] **MAP_FP_TO_G1** (0x10) - [Map field point to G1](./prompts/implement-bls12-381-map-fp-to-g1-precompile.md)
  - [ ] **MAP_FP2_TO_G2** (0x11) - [Map field point to G2](./prompts/implement-bls12-381-map-fp2-to-g2-precompile.md) | [Enhanced](./prompts/implement-bls12-381-map-fp2-to-g2-precompile-enhanced.md)
- [ ] 🟡 **OP Stack Precompiles** - [P256VERIFY (RIP-7212) for SECP256R1 signature verification](./prompts/implement-op-stack-precompiles.md)

#### Advanced Gas & Performance

- [ ] 🟡 **Gas Refunds**
  - [ ] **SSTORE Refunds** - [EIP-3529 compliant refund mechanism](./prompts/implement-gas-refunds-sstore.md)
  - [ ] **SELFDESTRUCT Refunds** - Contract destruction refunds (pre-London)
- [ ] 🟡 **Advanced Gas Calculations**
  - [ ] **Instruction Block Optimization** - Basic block gas calculation (evmone-style)
  - [ ] **Memory Gas Optimization** - [Pre-calculate and cache memory expansion costs](./prompts/implement-memory-gas-optimization-enhanced.md)
  - [ ] **Call Gas Stipend** - [Proper gas stipend handling for value transfers](./prompts/implement-call-gas-stipend-enhanced.md)
  - [ ] **Dynamic Gas Edge Cases** - [Complex memory growth scenarios](./prompts/implement-dynamic-gas-edge-cases-enhanced.md)

#### EIP Support & Advanced Hardforks

- [x] **Complete EIP-4844 Support** - Blob transaction handling beyond opcodes ✅
- [x] **EIP-7702** - Complete EOA account code delegation implementation ✅
- [ ] 🟡 **L2 Chain Support**
  - [ ] **Optimism** - OP Stack specific opcodes and behavior
  - [ ] **Arbitrum** - Arbitrum specific opcodes and gas model
  - [ ] **Polygon** - Polygon specific features
- [ ] 🟡 **EOF Support** - EVM Object Format
  - [ ] **EIP-3540** - EOF container format
  - [ ] **EIP-3670** - EOF code validation
  - [ ] **EIP-4200** - EOF static relative jumps
  - [ ] **EIP-4750** - EOF functions
  - [ ] **EIP-5450** - EOF stack validation
- [ ] 🟡 **Future Prague Support** - Upcoming hardfork preparation

#### Development Infrastructure

- [ ] 🟢 **Runtime Inspection**
  - [ ] **Comprehensive Tracing** - [Step-by-step execution monitoring](./prompts/implement-comprehensive-tracing-enhanced.md)
  - [ ] **EIP-3155 Tracing** - [Standard execution trace format](./prompts/implement-eip3155-tracing.md)
  - [ ] **Inspector Framework** - Pluggable inspection hooks
  - [ ] **Gas Inspector** - [Detailed gas consumption analysis](./prompts/implement-gas-inspector-enhanced.md)
- [ ] 🟢 **Testing Infrastructure**
  - [ ] **Consensus Test Suite** - Ethereum official test vectors compliance
  - [ ] **Fuzzing Infrastructure** - [Automated edge case discovery](./prompts/implement-fuzzing-infrastructure-enhanced.md)
  - [ ] **State Test Runner** - [Official Ethereum state test execution](./prompts/implement-state-test-runner.md)
  - [ ] **CLI Tools** - [Command-line interface for testing and benchmarking](./prompts/implement-cli-tools-enhanced.md)
- [ ] 🟢 **Handler Architecture** - Configurable execution handlers for pre/post processing

#### Production Hardening

- [x] **Robustness**
  - [x] **DoS Protection** - Comprehensive gas limit enforcement ✅
  - [x] **Edge Case Handling** - Real-world scenario validation ✅
  - [x] **Memory Safety Auditing** - Additional bounds checking ✅
- [ ] 🟢 **State Management**
  - [x] **State Interface** - Vtable interface for pluggable implementations ✅
  - [ ] **Async Database Support** - [Non-blocking database operations](./prompts/implement-async-database-support-enhanced.md)
  - [ ] **State Caching** - [Intelligent caching layer for frequently accessed state](./prompts/implement-state-caching-enhanced.md)
  - [ ] **Bundle State Management** - [Efficient state transitions and rollback](./prompts/implement-bundle-state-management-enhanced.md)
  - [ ] **Account Status Tracking** - [Detailed account lifecycle management](./prompts/implement-account-status-tracking-enhanced.md)

#### Performance & Optimization

- [ ] 🟢 **Low-Level Optimizations**
  - [ ] **SIMD Optimizations** - Vectorized operations for 256-bit math
  - [ ] **Memory Allocator Tuning** - [Specialized EVM memory allocators](./prompts/implement-memory-allocator-tuning-enhanced.md)
  - [ ] **Cache Optimization** - Better cache utilization in hot paths
  - [ ] **Zero-Allocation Patterns** - Minimize memory allocations in hot paths
  - [ ] **Branch Prediction Optimization** - Strategic branch hinting for modern CPUs
- [ ] 🟢 **Architecture Optimizations**
  - [ ] **Call Frame Pooling** - Reuse execution frames to reduce allocation overhead
  - [ ] **Precompile Backend Selection** - Multiple crypto library backends
  - [ ] **Interpreter Types System** - Configurable interpreter components
- [ ] 🟢 **Benchmarking**
  - [ ] **Performance Benchmarks** - [Snailtracer benchmarking vs Geth and Reth](./prompts/implement-performance-benchmarks-enhanced.md)
  - [ ] **CI/CD WASM Size Check** - [Automated bundle size regression testing](./prompts/implement-cicd-wasm-size-check.md)

#### Advanced Architecture Features

- [ ] 🟢 **Modularity**
  - [ ] **Modular Context System** - [Pluggable block, transaction, and configuration contexts](./prompts/implement-modular-context-system-enhanced.md)
  - [ ] **Custom Chain Framework** - [Easy implementation of custom blockchain variants](./prompts/implement-custom-chain-framework-enhanced.md)
  - [ ] **Extension Points** - Configurable extension system for custom functionality
- [ ] 🟢 **Advanced Execution**
  - [ ] **Subroutine Stack** - EOF subroutine support for advanced contract execution
  - [ ] **Runtime Flags** - [Efficient runtime behavior configuration](./prompts/implement-runtime-flags-enhanced.md)
  - [ ] **Loop Control** - Advanced execution loop management and gas tracking
  - [ ] **Shared Memory** - [Memory sharing between execution contexts](./prompts/implement-shared-memory-enhanced.md)
  - [ ] **External Bytecode** - [Support for external bytecode loading and management](./prompts/implement-external-bytecode-enhanced.md)
  - [ ] **Interpreter Action System** - [Structured action handling for calls and creates](./prompts/implement-interpreter-action-system-enhanced.md)
  - [ ] **Input Validation Framework** - [Comprehensive input validation and sanitization](./prompts/implement-input-validation-framework-enhanced.md)

## 📁 Directory Structure

```
src/evm/
├── README.md                # This file
├── CLAUDE.md               # Detailed implementation guide
├── evm.zig                 # Main module exports
├── vm.zig                  # Virtual machine implementation
├── frame.zig               # Execution context/frame
├── memory.zig              # Memory management
├── log.zig                 # Logging utilities
├── fee_market.zig          # EIP-1559 fee calculations
├── error_mapping.zig       # Error translation utilities
│
├── access_list/            # EIP-2929/2930 access list tracking
│   ├── access_list.zig
│   └── access_list_storage_key.zig
│
├── constants/              # EVM constants and limits
│   ├── constants.zig       # Stack size, call depth limits
│   ├── gas_constants.zig   # Gas costs for operations
│   └── memory_limits.zig   # Memory expansion limits
│
├── contract/               # Contract and bytecode management
│   ├── contract.zig        # Contract execution context
│   ├── code_analysis.zig   # JUMPDEST analysis
│   ├── storage_pool.zig    # Storage slot pooling
│   ├── bitvec.zig         # Bit vector utilities
│   └── eip_7702_bytecode.zig # EOA delegation
│
├── execution/              # Opcode implementations
│   ├── package.zig         # Execution module exports
│   ├── execution_error.zig # Error types
│   ├── execution_result.zig # Result types
│   ├── arithmetic.zig      # ADD, MUL, SUB, DIV, MOD, etc.
│   ├── bitwise.zig        # AND, OR, XOR, NOT, SHL, SHR, SAR
│   ├── comparison.zig     # LT, GT, EQ, ISZERO
│   ├── control.zig        # JUMP, JUMPI, PC, STOP, RETURN, REVERT
│   ├── crypto.zig         # KECCAK256/SHA3
│   ├── environment.zig    # ADDRESS, CALLER, CALLVALUE, etc.
│   ├── block.zig          # BLOCKHASH, TIMESTAMP, NUMBER, etc.
│   ├── memory.zig         # MLOAD, MSTORE, MSIZE, MCOPY
│   ├── storage.zig        # SLOAD, SSTORE, TLOAD, TSTORE
│   ├── stack.zig          # POP, PUSH0-32, DUP1-16, SWAP1-16
│   ├── log.zig            # LOG0-4
│   └── system.zig         # CREATE, CALL, DELEGATECALL, etc.
│
├── hardforks/             # Hardfork specifications
│   ├── hardfork.zig       # Hardfork enumeration
│   └── chain_rules.zig    # Fork-specific validation
│
├── jump_table/            # Opcode dispatch
│   ├── jump_table.zig     # Jump table implementation
│   └── operation_specs.zig # Operation metadata
│
├── opcodes/               # Opcode definitions
│   ├── opcode.zig         # Opcode enumeration
│   └── operation.zig      # Operation interface
│
├── stack/                 # Stack implementation
│   ├── stack.zig          # 1024-element stack
│   ├── stack_validation.zig # Validation utilities
│   └── validation_patterns.zig # Common patterns
│
└── state/                 # State management
    ├── state.zig          # World state interface
    ├── storage_key.zig    # Storage key handling
    └── evm_log.zig        # Event log structures
```

## 🏗️ Architecture Overview

The EVM implementation follows a modular architecture with clear separation of concerns:

1. **VM Layer** (`vm.zig`) - Orchestrates execution, manages call stack, handles gas accounting
2. **Frame Layer** (`frame.zig`) - Represents individual execution contexts with their own stack, memory, and PC
3. **Execution Layer** (`execution/`) - Individual opcode implementations following a consistent pattern
4. **State Layer** (`state/`) - Manages accounts, storage, and logs with support for transient storage
5. **Validation Layer** - Pre-execution validation ensures safety, allowing optimized unsafe operations

### Performance Optimizations

- **Two-stage safety system**: Pre-validation + unsafe execution for maximum performance
- **Batch operations**: Combine multiple stack operations (e.g., `pop2_push1_unsafe`)
- **In-place modifications**: Direct memory access patterns where safe
- **Jump destination caching**: O(log n) JUMPDEST validation
- **Storage pooling**: Reuse hash maps across executions

## 🔮 Roadmap

### Immediate Priorities

1. **Fix WASM build** and integrate into Tevm JavaScript library
2. **Complete call gas management** with 63/64th gas forwarding rule
3. **Implement precompiled contracts** (ECRECOVER, SHA256, etc.)
4. **Add gas refunds** for SSTORE and SELFDESTRUCT operations

### Performance & Testing

5. **Snailtracer benchmarking** against Geth and Reth
6. **Unit benchmarks** for all EVM components
7. **CI/CD checks** for WASM bundle size regression

### Feature Completion

8. **Implement all precompiles** without bundle size regression
9. **Gas refunds** for SSTORE operations
10. **L2 support** for Optimism, Arbitrum, etc.
11. **Complete call gas management** with proper forwarding rules

## 🤝 Contributing

We're actively looking for contributors! The codebase is designed to be approachable and maintainable. If you're interested in helping with:

- Performance optimizations
- Missing opcode implementations
- WASM build fixes
- L2 support
- Testing and benchmarking

Please reach out or submit a PR. The Zig language makes contributing enjoyable and productive.

## 📚 References

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
- [EVM Opcodes Reference](https://www.evm.codes/)
- [Go-Ethereum Implementation](https://github.com/ethereum/go-ethereum)
- [Revm (Rust Implementation)](https://github.com/bluealloy/revm)
- [Evmone (C++ Implementation)](https://github.com/ethereum/evmone)

## 📝 License

MIT License - see the [LICENSE](../../LICENSE) file for details.
