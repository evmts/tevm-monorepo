# Foundry-Zig Compiler Integration

This package provides a Zig wrapper around the Foundry Solidity compiler infrastructure, enabling seamless Solidity compilation from Zig projects.

## Features

- **Full Solidity compilation support** via Foundry's compiler infrastructure
- **In-memory and file-based compilation** for flexible integration
- **Strongly typed error handling** with detailed error messages
- **Typed ABI parsing** using zabi for compile-time safety
- **Caching support** for improved performance
- **Remappings and optimizer configuration**
- **Automatic Solc version management**
- **Production-ready API** designed for libraries used by millions

## Prerequisites

- Zig 0.14.0 or later
- Rust toolchain (for building the Foundry wrapper)
- cbindgen (`cargo install cbindgen`)
- zabi (automatically fetched via `zig fetch`)

## Building

```bash
cd src/Compilers
zig build
```

This will:

1. Build the Rust Foundry wrapper static library
2. Generate C bindings using cbindgen
3. Build the Zig wrapper and tests

## Usage

### Basic File Compilation

```zig
const std = @import("std");
const tevm = @import("tevm");
const Compiler = tevm.Compiler;
const CompilerSettings = tevm.CompilerSettings;

// Create allocator
var gpa = std.heap.GeneralPurposeAllocator(.{}){};
defer _ = gpa.deinit();
const allocator = gpa.allocator();

// Configure compiler settings
const settings = CompilerSettings{
    .optimizer_enabled = true,
    .optimizer_runs = 200,
    .evm_version = "paris",
};

// Compile a Solidity file
var result = try Compiler.compileFile(
    allocator,
    "contracts/MyContract.sol",
    settings,
);
defer result.deinit();

// Access compiled contracts
for (result.contracts) |contract| {
    std.debug.print("Contract: {s}\n", .{contract.name});
    std.debug.print("Bytecode: {s}\n", .{contract.bytecode});
    std.debug.print("ABI Items: {}\n", .{contract.abi.len});
}

// Access ABI
const balanceOfAbi = contract.abi[1].abiFunction
```

### In-Memory Source Compilation

```zig
const source =
    \\// SPDX-License-Identifier: MIT
    \\pragma solidity ^0.8.0;
    \\
    \\contract SimpleStorage {
    \\    uint256 public value;
    \\
    \\    function setValue(uint256 _value) public {
    \\        value = _value;
    \\    }
    \\}
;

var result = try Compiler.compileSource(
    allocator,
    "SimpleStorage.sol",
    source,
    settings,
);
defer result.deinit();
```

### Working with Typed ABI

The compiler now returns strongly-typed ABI structures using the [zabi](https://github.com/Raiden1411/zabi) library instead of raw JSON strings:

```zig
const std = @import("std");
const zabi = @import("zabi");
const Compiler = @import("compiler.zig").Compiler;
const CompilerSettings = @import("compiler.zig").CompilerSettings;

// Compile a simple storage contract
const source =
    \\// SPDX-License-Identifier: MIT
    \\pragma solidity ^0.8.0;
    \\
    \\contract SimpleStorage {
    \\    uint256 public value;
    \\
    \\    function setValue(uint256 _value) public {
    \\        value = _value;
    \\    }
    \\}
;

const settings = CompilerSettings{};
var result = try Compiler.compileSource(
    allocator,
    "SimpleStorage.sol",
    source,
    settings,
);
defer result.deinit();

// Access the compiled contract
const contract = result.contracts[0];
std.debug.print("Contract name: {s}\n", .{contract.name});

// Work with the typed ABI
std.debug.print("ABI has {} items\n", .{contract.abi.len});

// Iterate through ABI items
for (contract.abi) |item| {
    switch (item) {
        .abiFunction => |func| {
            std.debug.print("Function: {s}\n", .{func.name});
            std.debug.print("  State Mutability: {s}\n", .{@tagName(func.stateMutability)});
            std.debug.print("  Inputs: {}\n", .{func.inputs.len});

            // Check function parameters
            for (func.inputs) |input| {
                std.debug.print("    - {s}: ", .{input.name});
                switch (input.type) {
                    .uint => |bits| std.debug.print("uint{}\n", .{bits}),
                    .int => |bits| std.debug.print("int{}\n", .{bits}),
                    .address => std.debug.print("address\n", .{}),
                    .bool => std.debug.print("bool\n", .{}),
                    .string => std.debug.print("string\n", .{}),
                    .bytes => std.debug.print("bytes\n", .{}),
                    else => std.debug.print("{s}\n", .{@tagName(input.type)}),
                }
            }
        },
        .abiEvent => |event| {
            std.debug.print("Event: {s}\n", .{event.name});
        },
        .abiError => |err| {
            std.debug.print("Error: {s}\n", .{err.name});
        },
        .abiConstructor => |ctor| {
            std.debug.print("Constructor with {} params\n", .{ctor.inputs.len});
        },
        else => {},
    }
}

// Example: Find a specific function
for (contract.abi) |item| {
    if (item == .abiFunction and std.mem.eql(u8, item.abiFunction.name, "setValue")) {
        const setValue = item.abiFunction;
        // Use the function metadata...
        break;
    }
}
```

### Advanced Configuration

```zig
const settings = CompilerSettings{
    .optimizer_enabled = true,
    .optimizer_runs = 1000,
    .evm_version = "shanghai",
    .remappings = &[_][]const u8{
        "@openzeppelin/=lib/openzeppelin-contracts/",
        "@solmate/=lib/solmate/src/",
    },
    .cache_enabled = true,
    .cache_path = ".cache/solc",
    .output_abi = true,
    .output_bytecode = true,
    .output_deployed_bytecode = true,
    .output_ast = false,
};
```

### Error Handling

```zig
var result = Compiler.compileFile(allocator, "contract.sol", settings) catch |err| {
    switch (err) {
        error.CompilationFailed => {
            // Check detailed errors in result
        },
        error.VersionInstallFailed => {
            // Solc version installation failed
        },
        error.OutOfMemory => {
            // Memory allocation failed
        },
        else => return err,
    }
};

// Check compilation errors
if (result.errors.len > 0) {
    for (result.errors) |compile_error| {
        std.debug.print("Error: {s}\n", .{compile_error.message});
    }
}
```

### Installing Solc Versions

```zig
// Install a specific Solidity compiler version
try Compiler.installSolcVersion(allocator, "0.8.19");
```

### Cache Management

```zig
// Clear the compilation cache
try Compiler.clearCache(".cache/solc");

// Or clear the default cache
try Compiler.clearCache(null);
```

## API Reference

### CompilerSettings

Configuration for the Solidity compiler:

- `optimizer_enabled: bool` - Enable/disable the optimizer
- `optimizer_runs: u32` - Number of optimizer runs
- `evm_version: ?[]const u8` - Target EVM version (e.g., "paris", "shanghai")
- `remappings: []const []const u8` - Import remappings
- `cache_enabled: bool` - Enable compilation caching
- `cache_path: ?[]const u8` - Custom cache directory
- `output_abi: bool` - Include ABI in output
- `output_bytecode: bool` - Include creation bytecode
- `output_deployed_bytecode: bool` - Include runtime bytecode
- `output_ast: bool` - Include AST in output

### CompilationResult

Result of compilation containing:

- `contracts: []CompiledContract` - Successfully compiled contracts
- `errors: []CompilerError` - Compilation errors
- `warnings: []CompilerError` - Compilation warnings

### CompiledContract

Information about a compiled contract:

- `name: []const u8` - Contract name
- `abi: zabi.abi.abitypes.Abi` - Contract ABI as parsed zabi types
- `bytecode: []const u8` - Creation bytecode (hex string)
- `deployed_bytecode: []const u8` - Runtime bytecode (hex string)

## Testing

Run the test suite:

```bash
zig build test-foundry
```

Run the example SnailTracer compilation:

```bash
zig build run-snailtracer
```

## Architecture

This integration consists of three layers:

1. **Rust Layer** (`lib.rs`): Wraps foundry-compilers and exposes a C-compatible API
2. **C Bindings** (generated by cbindgen): Provides the FFI interface
3. **Zig Layer** (`compiler.zig`): Provides an idiomatic Zig API with proper memory management

The Rust layer handles all the heavy lifting of Solidity compilation, while the Zig layer provides a clean, memory-safe interface that feels natural to Zig developers.

## License

This project inherits the license from the parent TEVM project.
