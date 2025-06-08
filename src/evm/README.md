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

### Core EVM Features

- [x] **All Core Opcodes** - Arithmetic, bitwise, comparison, stack, memory, storage, control flow
- [x] **Stack Implementation** - 1024 element capacity with overflow/underflow protection
- [x] **Memory Management** - Byte-addressable with expansion and copy-on-write semantics
- [x] **Gas Metering** - Basic gas consumption for all implemented opcodes
- [x] **Jump Table** - O(1) opcode dispatch with hardfork-specific configurations
- [x] **Hardfork Support** - Frontier through Cancun
- [x] **Access List (EIP-2929/2930)** - Warm/cold account and storage tracking
- [x] **PUSH0 (EIP-3855)** - Shanghai opcode
- [x] **Transient Storage (EIP-1153)** - TLOAD/TSTORE opcodes
- [x] **MCOPY (EIP-5656)** - Memory copying opcode
- [x] **CREATE/CREATE2** - Contract deployment (partial implementation)
- [x] **Static Call Protection** - Prevents state modifications in read-only contexts

### Missing Features

- [ ] **WASM Build** - Currently broken, needs fixing as well as integration into the overall Tevm typescript code
- [ ] []**Journaling/State Reverting** - Need to implement state snapshots for proper revert handling
- [ ] **Complete CALL Operations** - These are the methods to recursively make inner calls. They are setup but currently not wired up to track gas or execute. CALL, CALLCODE, DELEGATECALL, STATICCALL need completion and gas validation
- [ ] **SELFDESTRUCT** - Contract destruction opcode
- [ ] **Precompiles** - ECRECOVER, SHA256, RIPEMD160, IDENTITY, MODEXP, ECADD, ECMUL, ECPAIRING, BLAKE2F
- [ ] **Gas Refunds** - SSTORE refund mechanism
- [ ] **L2 Support** - Optimism, Arbitrum, and other L2-specific opcodes
- [ ] **EIP-4844 Support** - Blob transaction opcodes (BLOBHASH, BLOBBASEFEE)
- [ ] **EOF Support** - (Not planned) EVM Object Format features
- [ ] **State Interface** - Make State a vtable interface for pluggable implementations
- [ ] **Performance Benchmarks** - Snailtracer benchmarking vs Geth and Reth. After feature complete add to [evm benchmarks](https://github.com/ziyadedher/evm-bench)
- [ ] **CI/CD WASM Size Check** - Automated bundle size regression testing

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
2. **Add journaling support** for proper state reverting
3. **Complete CALL operations** with proper gas metering tests
4. **Implement SELFDESTRUCT** opcode

### Performance & Testing

5. **Snailtracer benchmarking** against Geth and Reth
6. **Unit benchmarks** for all EVM components
7. **CI/CD checks** for WASM bundle size regression

### Feature Completion

8. **Implement all precompiles** without bundle size regression
9. **Gas refunds** for SSTORE operations
10. **L2 support** for Optimism, Arbitrum, etc.
11. **EIP-4844 support** for blob transactions
12. **Make State pluggable** via vtable interface

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
