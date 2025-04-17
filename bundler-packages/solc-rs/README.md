<p align="center">
  <a href="https://tevm.sh/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
      <img alt="wagmi logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
    </picture>
  </a>
</p>

<p align="center">
  Typesafe Solidity compiler (solc) wrapper in Rust
</p>

[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/e2e.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/e2e.yml)
[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/unit.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/unit.yml)

# @tevm/solc-rs

A Rust wrapper for the Solidity compiler (solc) that provides typesafe interactions with the compiler. This package is the Rust version of the JavaScript `@tevm/solc` package, offering the same functionality with Rust's strong type safety and performance benefits.

## Features

- Typesafe wrapper around solc compiler
- Support for multiple Solidity versions
- Complete type definitions for solc input and output formats
- Efficient compilation with proper error handling
- Easy integration with Rust projects

## Installation

Add the package to your Cargo.toml:

```toml
[dependencies]
tevm_solc_rs = "0.1.0"
```

## Usage

### Basic Usage

```rust
use tevm_solc_rs::{create_solc, SolcInputDescription, SolcLanguage, SolcInputSources};
use std::collections::HashMap;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a solc compiler instance with specific version
    let solc = create_solc("0.8.20").await?;
    
    // Prepare compilation input
    let mut sources = HashMap::new();
    sources.insert(
        "Contract.sol".to_string(),
        SolcInputSource {
            content: "pragma solidity ^0.8.20; contract Test { function getValue() public pure returns (uint) { return 42; } }".to_string(),
        },
    );
    
    let input = SolcInputDescription {
        language: SolcLanguage::Solidity,
        sources,
        settings: None, // Using default settings
    };
    
    // Compile the solidity code
    let output = solc.compile(&input)?;
    
    // Process compilation output
    if let Some(errors) = output.errors {
        for error in errors {
            println!("Error: {}", error.message);
        }
    }
    
    // Access compilation results
    if let Some(contracts) = output.contracts.get("Contract.sol") {
        if let Some(contract) = contracts.get("Test") {
            println!("ABI: {}", contract.abi);
            println!("Bytecode: {}", contract.evm.bytecode.object);
        }
    }
    
    Ok(())
}
```

### Using with Different Solidity Versions

```rust
// For Solidity 0.8.20
let solc_0_8_20 = create_solc("0.8.20").await?;

// For Solidity 0.7.6
let solc_0_7_6 = create_solc("0.7.6").await?;
```

### Compilation with Custom Settings

```rust
use tevm_solc_rs::{create_solc, SolcInputDescription, SolcSettings, SolcOptimizer, SolcOutputSelection};
use std::collections::HashMap;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let solc = create_solc("0.8.20").await?;
    
    // Define custom compilation settings
    let settings = SolcSettings {
        optimizer: Some(SolcOptimizer {
            enabled: Some(true),
            runs: 200,
        }),
        output_selection: Some({
            let mut output_selection = HashMap::new();
            let mut contract_outputs = HashMap::new();
            contract_outputs.insert("*".to_string(), vec![
                "abi".to_string(),
                "evm.bytecode".to_string(),
                "evm.deployedBytecode".to_string(),
                "evm.methodIdentifiers".to_string(),
            ]);
            output_selection.insert("*".to_string(), contract_outputs);
            output_selection
        }),
        ..Default::default()
    };
    
    // Prepare compilation input with custom settings
    let input = SolcInputDescription {
        language: SolcLanguage::Solidity,
        sources: /* your sources */,
        settings: Some(settings),
    };
    
    // Compile with custom settings
    let output = solc.compile(&input)?;
    
    // Process output...
    
    Ok(())
}
```

## API Reference

### Main Types

- `Solc` - The main solc compiler interface
- `SolcInputDescription` - Type for the input to the solc compiler
- `SolcOutput` - Type for the output from the solc compiler
- `SolcError` - Error type for solc compilation errors

### Main Functions

- `create_solc(version: &str) -> Result<Solc, SolcError>` - Creates a solc compiler instance for the specified version
- `compile(input: &SolcInputDescription) -> Result<SolcOutput, SolcError>` - Compiles Solidity code with the given input parameters

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>