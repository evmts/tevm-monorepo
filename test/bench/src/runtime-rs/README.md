# Runtime-rs Benchmark Integration

This directory contains benchmarks for comparing the JavaScript and Rust implementations of code generation for Solidity contracts.

## Status

The Rust implementation is now set up with all necessary boilerplate for napi-rs integration. The benchmark implementation is in progress and needs further refinement.

## Integration Steps

1. We've added the basic napi-rs bindings to the Rust code, exposing the `generate_runtime_js` function.
2. We've built the native module for the current platform with `npx napi build --platform --target aarch64-apple-darwin`.
3. We've verified that the module can be loaded and called correctly with specific input formats.

## Remaining Work

1. The benchmark code needs to be updated to handle the exact format expected by the Rust code.
2. The SolcOutput structure in JavaScript needs to match the Rust struct exactly, including field names.
3. The test-runtime.cjs file provides a working example of calling the Rust function.

## Usage

Once fully implemented, the benchmark can be run with:

```bash
cd /Users/williamcory/tevm/main/test/bench && node src/runtime-rs/direct-benchmark.cjs
```

## Solc Output Format

The Rust code expects a very specific format for the SolcOutput JSON. Key points:

1. The structure must follow the SolcOutput struct defined in solc-rs/src/models.rs
2. Field names must match exactly, including using `deployed_bytecode` instead of `deployedBytecode`
3. All required fields must be present, even if they are empty/null

A successful minimal example can be found in test-runtime.cjs.