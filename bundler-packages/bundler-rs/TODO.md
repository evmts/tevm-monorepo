# TODO: Bundler-RS Implementation Plan

## Project Overview

The bundler-rs package aims to replace two existing JavaScript packages (compiler and base-bundler) with a more efficient Rust implementation. It will leverage the existing Rust packages (resolutions-rs, solc-rs, and runtime-rs) to provide a complete bundling solution for Solidity contracts.

## Key Improvements

1. **Simplified API**: Pass solc options explicitly rather than using specific flags like `accessList` or `includeAst`
2. **Unified Package**: Combine compiler and base-bundler functionality into a single package
3. **Performance**: Leverage Rust's performance advantages and concurrency features
4. **Direct Integration**: Access Rust implementations directly rather than through JS bridges
5. **Async-Only API**: Use only async methods for a simpler, more maintainable codebase

## Implementation Steps

### 1. Core Types and Structs (1-2 days)

- [x] Define `Bundler` struct that will be the main entry point
- [x] Create comprehensive options types for:
  - [x] `BundlerOptions` - Main configuration options
  - [x] `SolcOptions` - Compiler-specific options
  - [x] `RuntimeOptions` - Code generation options
- [x] Create result types for returned data
- [x] Define error types with detailed context

### 2. Module Resolution Integration (1-2 days)

- [x] Integrate with resolutions-rs for import resolution
- [x] Implement module factory integration for building module graphs
- [x] Add support for remappings and library paths
- [x] Implement asynchronous resolution path for module resolution
- [x] Add caching layer for module resolution

### 3. Compilation Pipeline (2-3 days)

- [x] Integrate with solc-rs for contract compilation
- [x] Create `compileArtifacts` method to compile Solidity files
- [x] Implement AST extraction (optional)
- [x] Implement bytecode extraction (optional)
- [x] Add support for solc version selection
- [x] Support for compiler optimization settings

### 4. Code Generation (2-3 days)

- [x] Integrate with runtime-rs for generating JavaScript/TypeScript
- [x] Support multiple output formats:
  - [x] TypeScript (.ts)
  - [x] CommonJS (.cjs)
  - [x] ES Modules (.mjs)
  - [x] TypeScript declarations (.d.ts)
- [x] Generate code based on module format
- [x] Support for contract package customization

### 5. Bundler API Implementation (2-3 days)

- [x] Implement top-level NAPI bindings for bundler access from JavaScript
- [x] Create bundler factory function
- [x] Implement core resolution methods (async only):
  - [x] `resolveTsModule`
  - [x] `resolveEsmModule`
  - [x] `resolveCjsModule`
  - [x] `resolveDts`

### 6. Caching System (1-2 days)

- [x] Design efficient caching strategy
- [x] Use hashing for content-based caching
- [x] Implement file system cache
- [x] Add in-memory cache for repeated operations
- [x] Support cache invalidation

### 7. JavaScript Integration (1-2 days)

- [x] Refine NAPI bindings
- [x] Implement JavaScript shims for compatibility
- [x] Ensure TypeScript typings are complete and accurate
- [x] Support for browser and Node.js environments

### 8. Testing (2-3 days)

- [x] Write unit tests for each component
- [x] Create integration tests matching the JavaScript implementation
- [x] Test against real-world Solidity files
- [x] Performance benchmarks vs. JavaScript implementation
- [ ] Cross-platform testing (Linux, macOS, Windows)

### 9. Documentation and Examples (1-2 days)

- [x] Document the API comprehensively
- [x] Create example code
- [ ] Add migration guide from compiler/base-bundler
- [ ] Document performance considerations

## Next Steps

1. ✅ Create core types and structs
2. ✅ Implement the compilation pipeline
3. ✅ Add module resolution and code generation
4. ✅ Create a complete JS API surface
5. ✅ Create basic testing
6. [ ] Complete cross-platform testing
7. [ ] Create migration guide
8. [ ] Document performance considerations
9. [ ] Add CI/CD pipeline integration

## Remaining Work

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