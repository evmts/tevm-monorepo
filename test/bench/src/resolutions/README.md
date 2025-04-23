# Solidity Import Resolution Benchmark

This benchmark compares the performance of two implementations for resolving imports in Solidity files:

1. The JavaScript implementation from `@tevm/resolutions`
2. The Rust implementation from `@tevm/resolutions-rs` (via FFI using NAPI)

## Test Fixtures

The benchmark uses a complex set of Solidity files with various import patterns:

- A main contract that imports multiple contracts, interfaces, and libraries
- Contracts that import from other contracts (single and multiple imports)
- Circular imports to test resolution handling
- Different import statement formats and styles
- A mixture of small and large files

## Benchmarking Methodology

The benchmark measures two aspects:

1. **Single File Resolution**: Time to resolve all imports for a single Solidity file
2. **Full Directory Resolution**: Time to resolve imports for all Solidity files in the fixture directory

## Running the Benchmark

```bash
cd /Users/williamcory/tevm/main
pnpm install  # Install dependencies including the workspace references
cd test/bench
pnpm run bench # Run all benchmarks
pnpm run bench:run -- --filter=resolutions # Run just the resolutions benchmark
```

## Expected Results

The Rust implementation is expected to perform significantly better than the JavaScript implementation, especially for large Solidity files with many imports or when processing many files at once.