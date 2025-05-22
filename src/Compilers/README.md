# Foundry Solidity Compiler Zig Integration

This directory contains an integration between Zig and the Foundry Solidity compiler (written in Rust). It enables using Foundry's Solidity compilation capabilities directly from Zig code.

## Components

### Rust Side

- **Cargo.toml**: Defines the Rust package and dependencies
- **cbindgen.toml**: Configuration for the C bindings generation
- **src/lib.rs**: Implements the C-compatible wrapper around Foundry's compiler functionality
- **build.rs**: Generates C header files for Zig integration

### Zig Side

- **compiler.zig**: Implements the Zig wrapper around the Rust/C functions
- **rust_build.zig**: Integrates the Rust build into Zig's build system

## Usage Example

The [SnailTracer.zig](../Solidity/SnailTracer.zig) file demonstrates how to use this integration to compile Solidity code.

```zig
const std = @import("std");
const Compiler = @import("Compiler");

// Create a bundler with a specified Solidity version
var bundler = Compiler.Bundler.init(allocator, "0.8.17");

// Install the Solidity compiler
try bundler.installSolc("0.8.17");

// Compile a Solidity file
try bundler.compileFile("/path/to/contract.sol");

// Compile a Solidity project
try bundler.compileProject("/path/to/project");
```

## Build and Test

The integration is built as part of the regular Zig build process:

```bash
zig build
```

To run the SnailTracer example:

```bash
zig build run-snailtracer
```

## Features

- Compile individual Solidity files
- Compile entire Solidity projects
- Install specific Solidity compiler versions
- Error handling with detailed error information

## Notes

- The actual compilation may fail if the Solidity compiler is not installed or if the environment is not set up correctly
- In a production environment, the Foundry library would need to download and install the Solidity compiler
- This integration is primarily meant as a demonstration of Rust-Zig FFI capabilities