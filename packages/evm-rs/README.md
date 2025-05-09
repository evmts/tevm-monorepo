# @tevm/evm-rs

A Rust implementation of an EVM interpreter with WebAssembly bindings for Tevm.

## Features

- Minimal WASM footprint with optimized Rust compilation
- JavaScript wrapper with TypeScript type definitions
- Simple API for EVM operations

## Installation

```bash
pnpm add @tevm/evm-rs
```

## Usage

```javascript
import { EvmRsWrapper } from '@tevm/evm-rs';

async function main() {
  // Initialize the WASM module
  const evm = await EvmRsWrapper.init();
  
  // Get a greeting from the Rust code
  console.log(evm.greet('Tevm')); // "Hello, Tevm! This is evm-rs from WASM!"
  
  // Check the version
  console.log(evm.getVersion()); // "0.1.0"
  
  // In the future, this will interpret EVM bytecode
  console.log(evm.interpret('0x60806040'));
}

main().catch(console.error);
```

## Development

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Building

```bash
# Install dependencies
pnpm install

# Build the WASM module and JavaScript wrapper
pnpm build

# Run JavaScript tests
pnpm test

# Run Rust tests
pnpm test:rust
```

### Project Structure

- `src/lib.rs` - Rust source code with WASM bindings
- `src/index.js` - JavaScript wrapper for the WASM module
- `src/index.spec.ts` - Vitest tests for the JavaScript wrapper

## Future Plans

This package will eventually implement a full EVM interpreter in Rust with WASM bindings, offering:

- High-performance EVM execution
- Direct integration with JavaScript/TypeScript
- Small bundle size for browser usage
- Compatibility with the Tevm ecosystem

## License

MIT