# TODO: Bundler-RS Implementation Plan

## Project Overview

The bundler-rs package aims to replace two existing JavaScript packages (compiler and base-bundler) with a more efficient Rust implementation. It will leverage the existing Rust packages (resolutions-rs, solc-rs, and runtime-rs) to provide a complete bundling solution for Solidity contracts.

## Current Implementation Status

The current implementation includes a basic structure with mock implementations of dependencies. The focus has been on:

1. Setting up the proper type structure
2. Creating NAPI bindings for JS integration
3. Setting up thread-safe implementations for JS callbacks
4. Implementing a unified API for all module types
5. Creating mocks for dependencies (tevm_resolutions_rs, tevm_runtime_rs) 

The project is not yet functionally complete, with many mock implementations that need to be replaced with real ones.

## Key Improvements

1. **Simplified API**: Pass solc options explicitly rather than using specific flags like `accessList` or `includeAst`
2. **Unified Package**: Combine compiler and base-bundler functionality into a single package
3. **Performance**: Leverage Rust's performance advantages and concurrency features
4. **Direct Integration**: Access Rust implementations directly rather than through JS bridges
5. **Async-Only API**: Use only async methods for a simpler, more maintainable codebase

## Implementation Steps

### 1. Core Types and Structs

- [x] Define `Bundler` struct that will be the main entry point
- [x] Create comprehensive options types for:
  - [x] `BundlerOptions` - Main configuration options
  - [x] `SolcOptions` - Compiler-specific options
  - [x] `RuntimeOptions` - Code generation options
- [x] Create result types for returned data
- [x] Define error types with detailed context

### 2. Module Resolution Integration

- [ ] Integrate with resolutions-rs for import resolution
- [ ] Implement module factory integration for building module graphs
- [x] Add support for remappings and library paths (structure only)
- [x] Implement asynchronous resolution path for module resolution
- [x] Add caching layer for module resolution

*Note: Currently using a mock implementation for tevm_resolutions_rs*

### 3. Compilation Pipeline

- [ ] Integrate with solc-rs for contract compilation
- [x] Create `compileArtifacts` method to compile Solidity files (structure only)
- [x] Implement AST extraction (mock)
- [x] Implement bytecode extraction (mock)
- [x] Add support for solc version selection (structure only)
- [x] Support for compiler optimization settings (structure only)

*Note: Currently using a mocked compilation process*

### 4. Code Generation

- [ ] Integrate with runtime-rs for generating JavaScript/TypeScript
- [x] Support multiple output formats:
  - [x] TypeScript (.ts)
  - [x] CommonJS (.cjs)
  - [x] ES Modules (.mjs)
  - [x] TypeScript declarations (.d.ts)
- [x] Generate code based on module format (mock)
- [x] Support for contract package customization (structure only)

*Note: Currently using a mock implementation for tevm_runtime_rs*

### 5. Bundler API Implementation

- [x] Implement top-level NAPI bindings for bundler access from JavaScript
- [x] Create bundler factory function
- [x] Implement core resolution methods (both sync and async wrappers):
  - [x] `resolveTsModule`
  - [x] `resolveEsmModule`
  - [x] `resolveCjsModule`
  - [x] `resolveDts`
- [x] Implement unified `resolveFile` method for all module types

### 6. Caching System

- [x] Design efficient caching strategy
- [x] Use hashing for content-based caching
- [x] Implement file system cache
- [x] Add in-memory cache for repeated operations
- [x] Support cache invalidation

### 7. JavaScript Integration

- [x] Implement basic NAPI bindings
- [ ] Implement JavaScript shims for compatibility
- [ ] Ensure TypeScript typings are complete and accurate
- [ ] Support for browser and Node.js environments

### 8. Testing

- [ ] Write unit tests for each component
- [ ] Create integration tests matching the JavaScript implementation
- [ ] Test against real-world Solidity files
- [ ] Performance benchmarks vs. JavaScript implementation
- [ ] Cross-platform testing (Linux, macOS, Windows)

### 9. Documentation and Examples

- [x] Document the API structure
- [ ] Create example code
- [ ] Add migration guide from compiler/base-bundler
- [ ] Document performance considerations

## Next Steps

1. ✅ Create core types and structs
2. ⚠️ Implement proper file access with JS interop (in progress)
3. ❌ Integrate with real resolutions-rs and runtime-rs packages
4. ❌ Create benchmarking code
5. ❌ Complete tests
6. ❌ Complete cross-platform testing

## Remaining Work

### Critical Tasks

- [ ] Replace mocked resolutions_rs with real implementation
- [ ] Replace mocked runtime_rs with real implementation
- [ ] Implement real compilation with solc
- [ ] Create proper error handling for compilation errors
- [ ] Add proper thread safety for all operations
- [ ] Implement proper file access for JS callbacks

### Additional Feature Refinements

- [ ] Add proper parsing of source maps for debugging
- [ ] Handle circular dependencies properly
- [ ] Support for foundry projects (with remappings.txt)
- [ ] Support for hardhat projects
- [ ] Error reporting with clear, actionable messages

### Performance Optimizations

- [ ] Optimize caching strategy with file system watchers
- [ ] Add proper concurrency control for resource management
- [ ] Add benchmarking suite

### Documentation

- [ ] Create detailed API documentation for all functions
- [ ] Add code examples for common use cases
- [ ] Create tutorials for migrating from compiler + base-bundler

### Testing

- [ ] Complete comprehensive test suite
- [ ] Add CI tests for all platforms
- [ ] Add benchmark comparisons with JavaScript implementation

## Benchmarking Plan

To compare performance of the Rust implementation with the JavaScript implementation:

1. Create a benchmark in the test/bench package similar to the resolutions benchmark
2. Compare:
   - JavaScript synchronous implementation
   - JavaScript asynchronous implementation
   - Rust implementation
3. Measure:
   - Time to resolve imports
   - Time to compile Solidity code
   - Time to generate JavaScript/TypeScript
   - End-to-end bundle time