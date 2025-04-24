# @tevm/evm-rs

Rust/WASM implementation of the tevm EVM (Ethereum Virtual Machine) using REVM.

## Description

This package provides a Rust implementation of the Tevm EVM using REVM (Rust Ethereum Virtual Machine) that compiles to WebAssembly. It offers the same API as the JavaScript implementation but with the performance benefits of REVM and WebAssembly.

## Features

- High-performance EVM execution via REVM
- WebAssembly-based for browser and Node.js compatibility
- Complete compatibility with the Tevm EVM API
- Asynchronous execution with Promise support
- Support for custom precompiles (in progress)
- Full TypeScript type definitions

## Installation

```bash
npm install @tevm/evm-rs
```

## Usage

```typescript
import { createEvm } from '@tevm/evm-rs'
import { mainnet } from '@tevm/common'
import { createBlockchain } from '@tevm/blockchain'
import { createStateManager } from '@tevm/state-manager'
import { EthjsAddress } from '@tevm/utils'

async function runExample() {
  // Create the EVM instance
  const evm = await createEvm({
    common: mainnet.clone(),
    stateManager: createStateManager({ common: mainnet }),
    blockchain: createBlockchain({ common: mainnet }),
  })

  // Make sure to wait for the EVM to be ready
  await evm.ready()

  // Setup an account
  await evm.setAccount(
    '0x1000000000000000000000000000000000000000',  // address
    '0x1000000000000000000',  // balance (1 ETH)
    null,  // code
    0  // nonce
  )

  // Execute a simple transaction
  const result = await evm.runCall({
    caller: '0x1000000000000000000000000000000000000000',
    to: '0x2000000000000000000000000000000000000000',
    value: '0x100000000000000000',  // 0.1 ETH
    data: '0x',
    gasLimit: 21000,
    skipBalance: false
  })

  console.log('Transaction result:', result)
  console.log('Gas used:', result.gasUsed.toString())
}

runExample().catch(console.error)
```

## Architecture

This package is built using:

1. **REVM**: A high-performance Rust implementation of the Ethereum Virtual Machine
2. **wasm-bindgen**: For Rust/JavaScript interoperability
3. **TypeScript**: For type definitions and JavaScript wrapper implementations

The package consists of:
- Rust code that compiles to WebAssembly
- TypeScript/JavaScript wrappers providing a familiar API
- Type definitions matching the original EVM package

## Building from Source

To build this package from source:

1. Install Rust and wasm-pack:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
   ```

2. Clone the repository and build:
   ```bash
   git clone https://github.com/evmts/tevm-monorepo
   cd tevm-monorepo/packages/evm-rs
   npm run build
   ```

## Current Limitations

- Custom precompiles are not fully implemented yet
- Some advanced EVM features are still in development
- Web Worker support is planned but not yet implemented

## License

MIT