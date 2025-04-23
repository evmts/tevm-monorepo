# How to Run the Solidity Resolution Benchmark

This benchmark compares the JavaScript and Rust implementations of Solidity import resolution.

## Setup and Building the Rust Library

1. Make sure you have both `@tevm/resolutions` and `@tevm/resolutions-rs` installed:

```bash
# From the repo root
pnpm install
```

2. Build the Rust library:

```bash
# From the repo root
cd bundler-packages/resolutions-rs
pnpm run build
```

The Rust library is built using napi-rs, which creates platform-specific binaries in the `bundler-packages/resolutions-rs/bindings` directory. These binaries are then loaded by Node.js at runtime.

## Running the Tests

```bash
# From the repo root
cd test/bench
pnpm run test -- src/resolutions/resolutions.spec.ts
```

## Running the Benchmark

```bash
# From the repo root
cd test/bench
pnpm run bench -- --filter=resolutions
```

Or run the benchmark with the UI for visualization:

```bash
pnpm run bench:ui -- --filter=resolutions
```

## Understanding the Results

The benchmark compares two implementations:

1. **JavaScript Implementation**: Uses `@tevm/resolutions` written in pure JavaScript
2. **Rust Implementation**: Uses `@tevm/resolutions-rs` with Rust core logic and NAPI bindings

The benchmark measures:

1. **Single File Resolution**: Time to resolve all imports for a single complex Solidity file
2. **All Files Resolution**: Time to resolve imports for all Solidity files in the fixture directory

The results show the average time taken for each operation, with lower times being better.

## Notes on Implementation

For this benchmark, we're using a simulated version of the Rust FFI until the real binary is built. In production code, you would:

1. Remove the simulation code in `resolutions-rs-ffi.js`
2. Uncomment the line that imports directly from the compiled library:
   ```js
   export { resolveImports, processModule } from '@tevm/resolutions-rs'
   ```

The real Rust implementation should be significantly faster than the JavaScript version, especially for:

1. Complex regex parsing of import statements
2. Path resolution with multiple remappings
3. Processing large Solidity files or many files at once

## Real-world Impact

This benchmark demonstrates the potential performance improvements from using Rust for heavy computational tasks in the Tevm toolchain. In real-world scenarios, the performance difference would be especially noticeable:

1. When working with large codebases with many imports
2. When resolving imports repeatedly during hot reloading
3. When performance is critical, such as in CI/CD pipelines

## Building for Production

For production use, the Rust library would be built for all supported platforms:

```bash
# From bundler-packages/resolutions-rs
pnpm run build
```

This would create platform-specific binaries for all the targets listed in the `napi` config in `package.json`. These binaries are then published to npm as separate packages, and the main package (`@tevm/resolutions-rs`) loads the appropriate binary for the current platform at runtime.