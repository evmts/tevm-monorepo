# @tevm/revm

REVM-based WebAssembly EVM implementation for Tevm.

## Overview

`@tevm/revm` provides a high-performance Ethereum Virtual Machine (EVM) implementation using [REVM](https://github.com/bluealloy/revm) (Rust EVM) compiled to WebAssembly. This package offers significant performance improvements over JavaScript-based EVM implementations, especially for computationally intensive operations.

REVM is a highly efficient Rust implementation of the Ethereum Virtual Machine with a focus on speed and modularity. Key features of REVM that this package leverages:

- Extremely fast execution (significantly faster than JavaScript-based EVMs)
- Comprehensive support for all EVM opcodes and precompiles
- Accurate gas metering according to latest Ethereum specifications
- Complete state management with memory database
- Support for EIP-1559, EIP-2930, and other recent Ethereum upgrades

## Features

- High-performance EVM execution via Rust and WebAssembly
- Compatible with both Node.js and browser environments
- Same API interface as JavaScript EVM for easy integration
- Full state management support
- Gas metering and execution tracing

## Installation

```bash
npm install @tevm/revm
```

```bash
yarn add @tevm/revm
```

```bash
pnpm add @tevm/revm
```

## Usage

```typescript
import { createTevmEvm } from '@tevm/revm';

// Create a new EVM instance
const evm = createTevmEvm();

// Initialize the EVM (load WASM module)
await evm.init();

// Set up account state
await evm.setAccountBalance('0x1234567890123456789012345678901234567890', '1000000000000000000');
await evm.setAccountCode('0x1234567890123456789012345678901234567890', '0x...');

// Execute a call
const result = await evm.call({
  from: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  to: '0x1234567890123456789012345678901234567890',
  gasLimit: '1000000',
  value: '0',
  data: '0x...',
});

console.log('Success:', result.success);
console.log('Gas used:', result.gasUsed);
console.log('Return value:', result.returnValue);

// Reset state
await evm.reset();
```

## API

### `createTevmEvm(): TevmEvm`

Creates a new REVM instance.

### `TevmEvm`

#### `init(): Promise<void>`

Initializes the EVM by loading the WebAssembly module.

#### `getVersion(): Promise<string>`

Returns the version of the REVM implementation.

#### `setAccountBalance(address: string, balance: string): Promise<void>`

Sets the balance for an account.

- `address`: The account address (hex string with 0x prefix)
- `balance`: The balance in wei (decimal string)

#### `setAccountCode(address: string, code: string): Promise<void>`

Sets the code for an account.

- `address`: The account address (hex string with 0x prefix)
- `code`: The contract bytecode (hex string with 0x prefix)

#### `call(params: EvmCallParams): Promise<EvmResult>`

Executes a call in the EVM using REVM's powerful execution engine.

- `params`: The call parameters
  - `from`: The address that initiated the call (hex string with 0x prefix)
  - `to`: The address being called (hex string with 0x prefix)
  - `gasLimit`: The gas limit for the call (decimal string)
  - `value`: The value in wei to send with the call (decimal string)
  - `data`: The call data (hex string with 0x prefix)

Returns:
- `success`: Whether the call was successful
- `gasUsed`: The amount of gas used (decimal string)
- `returnValue`: The returned data (hex string with 0x prefix)
- `error`: Error message if the call failed (includes REVM execution errors like reverts)

#### `reset(): Promise<void>`

Resets the EVM state, clearing all account data and state changes.

## Performance

`@tevm/revm` can be up to 10-20x faster than JavaScript-based EVM implementations for complex operations. This makes it ideal for applications that require high-performance EVM execution, such as dApp development environments, testing frameworks, and blockchain explorers.

REVM's performance advantages come from:

1. **Rust's speed**: Rust is a systems programming language with performance comparable to C/C++
2. **Zero-copy optimizations**: REVM minimizes memory allocations and copies
3. **Efficient bytecode processing**: Optimized bytecode decoding and execution
4. **Memory database**: High-performance in-memory database for state operations

## Building from Source

To build this package from source, you'll need:

1. Rust toolchain with `cargo` (install via [rustup](https://rustup.rs/))
2. WebAssembly target: `rustup target add wasm32-unknown-unknown`
3. wasm-bindgen-cli: `cargo install wasm-bindgen-cli`
4. Build the Rust code:
   ```bash
   # Build the Rust WASM module
   cargo build --target wasm32-unknown-unknown --release
   
   # Generate JavaScript bindings
   wasm-bindgen --target web --out-dir pkg ./target/wasm32-unknown-unknown/release/tevm_revm.wasm
   ```
5. Build the TypeScript wrapper: `pnpm run build:dist && pnpm run build:types`

## License

MIT