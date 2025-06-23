# EVM Prompt to Implementation Mapping

This document maps each prompt file in `src/evm/prompts/` to relevant Zig implementation files in `src/evm/**/*.zig` and test files in `test/**/*.zig`.

## Table of Contents

- [Precompiles](#precompiles)
- [Gas Management](#gas-management)
- [Memory & Performance](#memory--performance)
- [Tracing & Testing](#tracing--testing)
- [EIP & Hardfork Support](#eip--hardfork-support)
- [Architecture & Infrastructure](#architecture--infrastructure)
- [Build & Optimization](#build--optimization)

---

## Precompiles

### 1. implement-blake2f-precompile.md
**Feature**: BLAKE2F compression function precompile (address 0x09)
**Description**: Implements the BLAKE2b compression function with dynamic gas costs based on rounds.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher and registry
- `/src/evm/precompiles/precompile_addresses.zig` - Address constants for precompiles
- `/src/evm/precompiles/precompile_gas.zig` - Gas calculation for precompiles
- `/src/evm/precompiles/precompile_result.zig` - Result types for precompile execution

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory) - General precompile tests
- No specific BLAKE2F tests exist yet

**Notes**: The BLAKE2F precompile needs to be added to the precompile dispatcher. Current implementation only has identity and KZG precompiles.

---

### 2. implement-bls12-381-g1add-precompile.md
**Feature**: BLS12-381 G1 point addition precompile
**Description**: Implements elliptic curve point addition for BLS12-381 G1 group.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Address constants
- `/src/evm/hardforks/chain_rules.zig` - Hardfork availability rules

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory) - Precompile test infrastructure
- No BLS12-381 specific tests exist yet

**Notes**: Part of the BLS12-381 suite introduced in Berlin hardfork.

---

### 3. implement-bls12-381-g1msm-precompile.md / implement-bls12-381-g1msm-precompile-enhanced.md
**Feature**: BLS12-381 G1 multi-scalar multiplication precompile
**Description**: Implements efficient multi-scalar multiplication for BLS12-381 G1 points.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher
- `/src/evm/precompiles/precompile_gas.zig` - Variable gas costs for MSM operations

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

**Notes**: MSM operations have variable gas costs based on input size.

---

### 4. implement-bls12-381-g2add-precompile.md / implement-bls12-381-g2add-precompile-enhanced.md
**Feature**: BLS12-381 G2 point addition precompile
**Description**: Implements elliptic curve point addition for BLS12-381 G2 group.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher
- `/src/evm/precompiles/precompile_addresses.zig` - Address constants

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

### 5. implement-bls12-381-g2msm-precompile.md / implement-bls12-381-g2msm-precompile-enhanced.md
**Feature**: BLS12-381 G2 multi-scalar multiplication precompile
**Description**: Implements efficient multi-scalar multiplication for BLS12-381 G2 points.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher
- `/src/evm/precompiles/precompile_gas.zig` - Variable gas costs

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

### 6. implement-bls12-381-map-fp-to-g1-precompile.md
**Feature**: BLS12-381 field element to G1 mapping precompile
**Description**: Maps field elements to G1 curve points using hash-to-curve algorithms.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

### 7. implement-bls12-381-map-fp2-to-g2-precompile.md / implement-bls12-381-map-fp2-to-g2-precompile-enhanced.md
**Feature**: BLS12-381 field extension element to G2 mapping precompile
**Description**: Maps field extension elements to G2 curve points.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

### 8. implement-bls12-381-pairing-precompile.md / implement-bls12-381-pairing-precompile-enhanced.md
**Feature**: BLS12-381 pairing check precompile
**Description**: Implements bilinear pairing operations for BLS12-381 curve.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher
- `/src/evm/precompiles/precompile_gas.zig` - Complex gas calculation for pairing

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

### 9. implement-ecadd-precompile.md
**Feature**: Elliptic curve addition precompile for secp256k1
**Description**: Implements point addition for the secp256k1 elliptic curve.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

### 10. implement-ecmul-precompile.md / implement-ecmul-precompile-enhanced.md
**Feature**: Elliptic curve multiplication precompile for secp256k1
**Description**: Implements scalar multiplication for secp256k1 curve points.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

### 11. implement-ecpairing-precompile.md / implement-ecpairing-precompile-enhanced.md
**Feature**: Elliptic curve pairing precompile for alt_bn128
**Description**: Implements bilinear pairing for alt_bn128 curve used in zkSNARKs.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

### 12. implement-ecrecover-precompile-enhanced.md
**Feature**: ECDSA signature recovery precompile
**Description**: Recovers Ethereum addresses from ECDSA signatures.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher
- `/src/signature/` (directory) - Signature utilities that could be leveraged

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

### 13. implement-modexp-precompile.md / implement-modexp-precompile-enhanced.md
**Feature**: Modular exponentiation precompile
**Description**: Performs efficient modular exponentiation for large numbers.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher
- `/src/evm/precompiles/precompile_gas.zig` - Complex gas calculation based on input sizes

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

### 14. implement-ripemd160-precompile.md
**Feature**: RIPEMD160 hash function precompile
**Description**: Implements the RIPEMD160 cryptographic hash function.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

### 15. implement-sha256-precompile.md
**Feature**: SHA256 hash function precompile
**Description**: Implements the SHA256 cryptographic hash function.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

### 16. implement-op-stack-precompiles.md
**Feature**: OP Stack specific precompiles (P256VERIFY)
**Description**: Implements SECP256R1 signature verification for OP Stack chains.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher
- `/src/evm/hardforks/chain_rules.zig` - Chain-specific availability rules

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory)

---

## Gas Management

### 17. implement-call-gas-management.md / implement-call-gas-management-enhanced.md
**Feature**: 63/64th gas forwarding rule for call operations
**Description**: Implements proper gas forwarding for contract calls to prevent gas exhaustion attacks.

**Relevant Implementation Files:**
- `/src/evm/execution/system.zig` - Contains call operations that need gas management
- `/src/evm/constants/gas_constants.zig` - Gas constants and calculations
- `/src/evm/frame.zig` - Call frame management with gas tracking

**Relevant Test Files:**
- `/test/evm/opcodes/system_test.zig` - Tests for system opcodes including calls
- `/test/evm/gas/gas_accounting_test.zig` - Gas accounting tests

**Notes**: The system.zig file contains CallInput and CallType structures that would need gas forwarding logic.

---

### 18. implement-call-gas-stipend.md / implement-call-gas-stipend-enhanced.md
**Feature**: Gas stipend for contract calls with value transfer
**Description**: Ensures calls with ETH transfers receive minimum gas for basic operations.

**Relevant Implementation Files:**
- `/src/evm/execution/system.zig` - Call operations implementation
- `/src/evm/constants/gas_constants.zig` - Gas stipend constants

**Relevant Test Files:**
- `/test/evm/opcodes/system_test.zig` - System opcode tests
- `/test/evm/gas/gas_accounting_test.zig` - Gas accounting verification

---

### 19. implement-dynamic-gas-edge-cases.md / implement-dynamic-gas-edge-cases-enhanced.md
**Feature**: Edge case handling for dynamic gas calculations
**Description**: Handles complex gas calculation scenarios and overflow conditions.

**Relevant Implementation Files:**
- `/src/evm/constants/gas_constants.zig` - Gas calculation utilities
- `/src/evm/execution/memory.zig` - Memory expansion gas costs
- `/src/evm/execution/storage.zig` - Storage operation gas costs

**Relevant Test Files:**
- `/test/evm/gas/gas_accounting_test.zig` - Comprehensive gas tests
- `/test/evm/opcodes/memory_test.zig` - Memory gas cost tests

---

### 20. implement-gas-inspector.md / implement-gas-inspector-enhanced.md
**Feature**: Gas usage inspection and profiling tools
**Description**: Provides detailed gas usage tracking and analysis capabilities.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - Main VM execution loop for gas tracking
- `/src/evm/frame.zig` - Frame-level gas management

**Relevant Test Files:**
- `/test/evm/gas/gas_accounting_test.zig` - Gas accounting tests

---

### 21. implement-gas-refunds-sstore.md
**Feature**: Gas refunds for SSTORE operations
**Description**: Implements proper gas refund calculations for storage operations.

**Relevant Implementation Files:**
- `/src/evm/execution/storage.zig` - Storage operations with refund logic
- `/src/evm/constants/gas_constants.zig` - Refund constants

**Relevant Test Files:**
- `/test/evm/opcodes/storage_test.zig` - Storage operation tests
- `/test/evm/gas/gas_accounting_test.zig` - Gas refund tests

---

## Memory & Performance

### 22. implement-shared-memory.md / implement-shared-memory-enhanced.md / implement-shared-memory-enhanced-enhanced.md
**Feature**: Shared memory system for cross-context data sharing
**Description**: Implements efficient memory sharing between execution contexts.

**Relevant Implementation Files:**
- `/src/evm/memory.zig` - Core memory implementation with shared buffer
- `/src/evm/frame.zig` - Frame-level memory management
- `/src/evm/vm.zig` - VM memory coordination

**Relevant Test Files:**
- `/test/evm/memory_test.zig` - Memory system tests
- `/test/evm/shared_memory_test.zig` - Shared memory specific tests

**Notes**: The current memory.zig already has shared_buffer infrastructure that could be leveraged.

---

### 23. implement-memory-gas-optimization.md / implement-memory-gas-optimization-enhanced.md
**Feature**: Memory expansion gas cost optimization
**Description**: Optimizes gas calculations for memory operations and expansion.

**Relevant Implementation Files:**
- `/src/evm/memory.zig` - Memory expansion logic
- `/src/evm/memory_size.zig` - Memory size calculations
- `/src/evm/execution/memory.zig` - Memory operation implementations

**Relevant Test Files:**
- `/test/evm/memory_test.zig` - Memory operation tests
- `/test/evm/opcodes/memory_test.zig` - Memory opcode tests

---

### 24. implement-memory-allocator-tuning.md / implement-memory-allocator-tuning-enhanced.md
**Feature**: Memory allocator optimization for EVM operations
**Description**: Tunes memory allocation patterns for better performance.

**Relevant Implementation Files:**
- `/src/evm/memory.zig` - Core memory management
- `/src/evm/stack/stack.zig` - Stack memory allocation

**Relevant Test Files:**
- `/test/evm/memory_test.zig` - Memory allocation tests

---

### 25. implement-zero-allocation-patterns.md
**Feature**: Zero-allocation optimization patterns
**Description**: Minimizes memory allocations for performance-critical paths.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - Main execution loop optimizations
- `/src/evm/stack/stack.zig` - Stack operations
- `/src/evm/memory.zig` - Memory operations

**Relevant Test Files:**
- `/test/evm/vm_core_comprehensive_test.zig` - Core VM performance tests

---

### 26. implement-cache-optimization.md
**Feature**: Caching optimizations for EVM execution
**Description**: Implements caching strategies for frequently accessed data.

**Relevant Implementation Files:**
- `/src/evm/state/state.zig` - State caching
- `/src/evm/jump_table/jump_table.zig` - Opcode dispatch caching

**Relevant Test Files:**
- `/test/evm/state/` (directory) - State management tests

---

### 27. implement-state-caching.md / implement-state-caching-enhanced.md
**Feature**: State data caching mechanisms
**Description**: Implements efficient caching for state tree operations.

**Relevant Implementation Files:**
- `/src/evm/state/state.zig` - Main state management
- `/src/evm/state/database_interface.zig` - Database abstraction with caching

**Relevant Test Files:**
- `/test/evm/state/database_interface_test.zig` - Database interface tests

---

### 28. implement-simd-optimizations.md / implement-simd-optimizations-enhanced.md
**Feature**: SIMD optimizations for EVM operations
**Description**: Uses SIMD instructions for vectorized operations.

**Relevant Implementation Files:**
- `/src/evm/execution/arithmetic.zig` - Arithmetic operations
- `/src/evm/execution/bitwise.zig` - Bitwise operations

**Relevant Test Files:**
- `/test/evm/opcodes/arithmetic_test.zig` - Arithmetic operation tests
- `/test/evm/opcodes/bitwise_test.zig` - Bitwise operation tests

---

## Tracing & Testing

### 29. implement-eip3155-tracing.md
**Feature**: EIP-3155 standard execution trace format
**Description**: Implements standardized EVM execution tracing for debugging.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - Main execution loop for trace capture
- `/src/evm/frame.zig` - Frame-level trace data

**Relevant Test Files:**
- `/test/evm/vm_core_comprehensive_test.zig` - VM execution tests

**Notes**: New tracing module would need to be created in `/src/evm/tracing/`.

---

### 30. implement-comprehensive-tracing.md / implement-comprehensive-tracing-enhanced.md
**Feature**: Comprehensive execution tracing system
**Description**: Advanced tracing with multiple output formats and filtering.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - Main execution loop
- `/src/evm/log.zig` - Logging infrastructure

**Relevant Test Files:**
- `/test/evm/vm_core_comprehensive_test.zig` - VM execution tests

---

### 31. implement-state-test-runner.md
**Feature**: Official Ethereum state test execution runner
**Description**: Runs official Ethereum state tests for compatibility verification.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - VM execution for state tests
- `/src/evm/state/state.zig` - State management for test setup

**Relevant Test Files:**
- `/test/evm/` (directory) - Would house state test integration
- All existing integration tests as reference

**Notes**: Would require new testing infrastructure in `/src/evm/testing/`.

---

### 32. implement-consensus-test-suite.md / implement-consensus-test-suite-enhanced.md
**Feature**: Consensus compatibility test suite
**Description**: Comprehensive testing against Ethereum consensus rules.

**Relevant Implementation Files:**
- `/src/evm/hardforks/chain_rules.zig` - Hardfork consensus rules
- `/src/evm/vm.zig` - VM execution

**Relevant Test Files:**
- `/test/evm/integration/` (directory) - Integration test infrastructure

---

### 33. implement-fuzzing-infrastructure.md / implement-fuzzing-infrastructure-enhanced.md
**Feature**: Fuzzing infrastructure for EVM testing
**Description**: Automated fuzzing to discover edge cases and bugs.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - Main execution target for fuzzing
- All execution modules as fuzzing targets

**Relevant Test Files:**
- All existing tests as fuzzing references

---

### 34. implement-performance-benchmarks.md / implement-performance-benchmarks-enhanced.md
**Feature**: Performance benchmarking infrastructure
**Description**: Systematic performance measurement and regression testing.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - Main execution performance target
- All execution modules for micro-benchmarks

**Relevant Test Files:**
- `/test/bench/` (directory) - Existing benchmark infrastructure

---

## EIP & Hardfork Support

### 35. implement-eof-support.md
**Feature**: EOF (EVM Object Format) support
**Description**: Implements EVM Object Format for enhanced contract validation.

**Relevant Implementation Files:**
- `/src/evm/contract/contract.zig` - Contract representation
- `/src/evm/bytecode/bytecode.zig` - Bytecode handling
- `/src/evm/hardforks/chain_rules.zig` - EOF availability rules

**Relevant Test Files:**
- `/test/evm/vm_core_comprehensive_test.zig` - Contract execution tests

---

### 36. implement-prague-hardfork-support.md
**Feature**: Prague hardfork compatibility
**Description**: Implements changes from the Prague Ethereum hardfork.

**Relevant Implementation Files:**
- `/src/evm/hardforks/hardfork.zig` - Hardfork definitions
- `/src/evm/hardforks/chain_rules.zig` - Prague-specific rules

**Relevant Test Files:**
- `/test/evm/integration/` (directory) - Hardfork integration tests

---

### 37. implement-selfdestruct-opcode.md / implement-selfdestruct-opcode-enhanced.md
**Feature**: SELFDESTRUCT opcode implementation
**Description**: Implements contract self-destruction with proper semantics.

**Relevant Implementation Files:**
- `/src/evm/execution/system.zig` - System operations including SELFDESTRUCT
- `/src/evm/state/state.zig` - State modifications for contract deletion

**Relevant Test Files:**
- `/test/evm/opcodes/system_test.zig` - System opcode tests

---

### 38. implement-selfdestruct-refunds.md / implement-selfdestruct-refunds-enhanced.md
**Feature**: SELFDESTRUCT gas refund mechanisms
**Description**: Implements proper gas refunds for contract self-destruction.

**Relevant Implementation Files:**
- `/src/evm/execution/system.zig` - SELFDESTRUCT implementation
- `/src/evm/constants/gas_constants.zig` - Refund constants

**Relevant Test Files:**
- `/test/evm/opcodes/system_test.zig` - System opcode tests
- `/test/evm/gas/gas_accounting_test.zig` - Gas refund tests

---

## Architecture & Infrastructure

### 39. implement-handler-architecture.md
**Feature**: Modular handler architecture for opcodes
**Description**: Implements pluggable handler system for opcode execution.

**Relevant Implementation Files:**
- `/src/evm/jump_table/jump_table.zig` - Opcode dispatch table
- `/src/evm/opcodes/operation.zig` - Operation definitions
- `/src/evm/vm.zig` - VM execution dispatch

**Relevant Test Files:**
- `/test/evm/jump_table_test.zig` - Jump table tests
- `/test/evm/vm_opcode_test.zig` - Opcode execution tests

---

### 40. implement-interpreter-action-system.md / implement-interpreter-action-system-enhanced.md
**Feature**: Action-based interpreter system
**Description**: Implements action-oriented execution model for the interpreter.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - Main VM execution
- `/src/evm/frame.zig` - Execution context management

**Relevant Test Files:**
- `/test/evm/vm_core_comprehensive_test.zig` - VM execution tests

---

### 41. implement-interpreter-types-system.md
**Feature**: Type system for interpreter operations
**Description**: Implements strong typing for interpreter operations and data.

**Relevant Implementation Files:**
- `/src/evm/opcodes/operation.zig` - Operation type definitions
- `/src/evm/execution/execution_result.zig` - Result type system

**Relevant Test Files:**
- All opcode tests for type safety verification

---

### 42. implement-modular-context-system.md / implement-modular-context-system-enhanced.md
**Feature**: Modular execution context system
**Description**: Implements pluggable context management for different execution modes.

**Relevant Implementation Files:**
- `/src/evm/context.zig` - Execution context management
- `/src/evm/frame.zig` - Frame context
- `/src/evm/vm.zig` - VM context coordination

**Relevant Test Files:**
- `/test/evm/vm_core_comprehensive_test.zig` - Context management tests

---

### 43. implement-extension-points.md / implement-extension-points-enhanced.md
**Feature**: Extension points for customization
**Description**: Provides hooks and extension points for custom EVM behavior.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - Main execution hooks
- `/src/evm/precompiles/precompiles.zig` - Precompile extension points

**Relevant Test Files:**
- Custom extension tests would be added

---

### 44. implement-inspector-framework.md
**Feature**: Execution inspection framework
**Description**: Provides detailed inspection capabilities for EVM execution.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - Main execution inspection points
- `/src/evm/frame.zig` - Frame-level inspection

**Relevant Test Files:**
- `/test/evm/vm_core_comprehensive_test.zig` - VM inspection tests

---

### 45. implement-bundle-state-management.md / implement-bundle-state-management-enhanced.md
**Feature**: Bundle-based state management
**Description**: Implements efficient state bundling for MEV and transaction processing.

**Relevant Implementation Files:**
- `/src/evm/state/state.zig` - State management
- `/src/evm/state/journal.zig` - State journaling for bundles

**Relevant Test Files:**
- `/test/evm/state/journal_test.zig` - State journaling tests

---

### 46. implement-custom-chain-framework.md / implement-custom-chain-framework-enhanced.md
**Feature**: Framework for custom chain implementations
**Description**: Enables easy creation of custom EVM-compatible chains.

**Relevant Implementation Files:**
- `/src/evm/hardforks/chain_rules.zig` - Chain-specific rules
- `/src/evm/precompiles/precompiles.zig` - Chain-specific precompiles

**Relevant Test Files:**
- Custom chain tests would be added

---

### 47. implement-l2-chain-support.md
**Feature**: Layer 2 chain support
**Description**: Implements support for L2 scaling solutions and their specific features.

**Relevant Implementation Files:**
- `/src/evm/hardforks/chain_rules.zig` - L2-specific rules
- `/src/evm/precompiles/precompiles.zig` - L2-specific precompiles

**Relevant Test Files:**
- L2-specific tests would be added

---

### 48. implement-async-database-support.md / implement-async-database-support-enhanced.md
**Feature**: Asynchronous database operations
**Description**: Implements async database interface for non-blocking state operations.

**Relevant Implementation Files:**
- `/src/evm/state/database_interface.zig` - Database interface abstraction
- `/src/evm/state/memory_database.zig` - In-memory database implementation

**Relevant Test Files:**
- `/test/evm/state/database_interface_test.zig` - Database interface tests

---

### 49. implement-account-status-tracking.md / implement-account-status-tracking-enhanced.md
**Feature**: Account status tracking system
**Description**: Tracks account creation, modification, and deletion status.

**Relevant Implementation Files:**
- `/src/evm/state/state.zig` - Account state management
- `/src/evm/state/journal.zig` - State change tracking

**Relevant Test Files:**
- `/test/evm/state/journal_test.zig` - State tracking tests

---

## Build & Optimization

### 50. implement-wasm-build-fix.md / fix-wasm-build-integration.md
**Feature**: WebAssembly build fixes and optimization
**Description**: Fixes WASM compilation issues and optimizes WASM output.

**Relevant Implementation Files:**
- `/src/evm/wasm_stubs.zig` - WASM-specific implementations
- `/src/root_wasm.zig` - WASM root module
- `/src/root_wasm_minimal.zig` - Minimal WASM build

**Relevant Test Files:**
- WASM-specific tests would be added

---

### 51. implement-cicd-wasm-size-check.md
**Feature**: CI/CD WASM bundle size monitoring
**Description**: Implements automated monitoring of WASM bundle size in CI.

**Relevant Implementation Files:**
- Build system files
- WASM output monitoring

**Relevant Test Files:**
- CI/CD specific tests

---

### 52. implement-runtime-flags.md / implement-runtime-flags-enhanced.md
**Feature**: Runtime configuration flags
**Description**: Implements runtime configuration system for EVM behavior.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - VM configuration
- `/src/evm/hardforks/chain_rules.zig` - Runtime rule configuration

**Relevant Test Files:**
- Configuration tests would be added

---

### 53. implement-precompile-backend-selection.md / implement-precompile-backend-selection-enhanced.md
**Feature**: Pluggable precompile backend selection
**Description**: Allows selection of different precompile implementation backends.

**Relevant Implementation Files:**
- `/src/evm/precompiles/precompiles.zig` - Main precompile dispatcher
- `/src/evm/precompiles/precompile_result.zig` - Backend result handling

**Relevant Test Files:**
- `/test/evm/precompiles/` (directory) - Backend selection tests

---

### 54. implement-cli-tools.md / implement-cli-tools-enhanced.md
**Feature**: Command-line tools for EVM operations
**Description**: Provides CLI tools for EVM testing, debugging, and analysis.

**Relevant Implementation Files:**
- CLI integration with existing EVM modules

**Relevant Test Files:**
- CLI tool tests would be added

---

## Advanced Features

### 55. implement-branch-prediction-optimization.md
**Feature**: Branch prediction optimizations
**Description**: Optimizes branch prediction for hot execution paths.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - Main execution loop optimization
- `/src/evm/jump_table/jump_table.zig` - Opcode dispatch optimization

**Relevant Test Files:**
- Performance tests for branch prediction

---

### 56. implement-instruction-block-optimization.md
**Feature**: Instruction block optimization
**Description**: Optimizes execution of instruction blocks and sequences.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - VM execution optimization
- `/src/evm/execution/` (directory) - Instruction execution optimization

**Relevant Test Files:**
- Instruction sequence performance tests

---

### 57. implement-call-frame-pooling.md
**Feature**: Call frame pooling for memory efficiency
**Description**: Implements object pooling for call frames to reduce allocations.

**Relevant Implementation Files:**
- `/src/evm/frame.zig` - Frame management and pooling
- `/src/evm/vm.zig` - Frame lifecycle management

**Relevant Test Files:**
- `/test/evm/vm_core_comprehensive_test.zig` - Frame management tests

---

### 58. implement-loop-control.md
**Feature**: Loop control and gas management
**Description**: Implements proper loop control with gas metering.

**Relevant Implementation Files:**
- `/src/evm/vm.zig` - Main execution loop control
- `/src/evm/execution/control.zig` - Control flow operations

**Relevant Test Files:**
- `/test/evm/opcodes/control_test.zig` - Control flow tests

---

### 59. implement-subroutine-stack.md
**Feature**: Subroutine stack for EIP-2315
**Description**: Implements subroutine functionality for EVM (if/when adopted).

**Relevant Implementation Files:**
- `/src/evm/stack/stack.zig` - Stack management for subroutines
- `/src/evm/execution/control.zig` - Control flow for subroutines

**Relevant Test Files:**
- `/test/evm/stack_test.zig` - Stack operation tests

---

### 60. implement-external-bytecode.md / implement-external-bytecode-enhanced.md
**Feature**: External bytecode loading and execution
**Description**: Supports loading and executing bytecode from external sources.

**Relevant Implementation Files:**
- `/src/evm/bytecode/bytecode.zig` - Bytecode handling
- `/src/evm/contract/contract.zig` - Contract loading

**Relevant Test Files:**
- Bytecode loading tests would be added

---

### 61. implement-input-validation-framework.md / implement-input-validation-framework-enhanced.md
**Feature**: Input validation framework
**Description**: Comprehensive input validation for all EVM operations.

**Relevant Implementation Files:**
- All execution modules for input validation
- `/src/evm/vm.zig` - Top-level validation

**Relevant Test Files:**
- Input validation tests across all modules

---

## Summary

This mapping shows that the EVM implementation is well-structured with clear separation of concerns:

- **Precompiles** are centralized in `/src/evm/precompiles/` with a pluggable architecture
- **Execution logic** is modularized in `/src/evm/execution/` by operation type
- **State management** is abstracted in `/src/evm/state/` with interfaces for different backends
- **Testing infrastructure** exists in `/test/evm/` with comprehensive coverage

Most prompts would involve extending existing modules rather than creating entirely new systems, indicating a mature and extensible architecture. The enhanced versions of prompts typically add more comprehensive features, better error handling, and additional optimization to the base implementations.