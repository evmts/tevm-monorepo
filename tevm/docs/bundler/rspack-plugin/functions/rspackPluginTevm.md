[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/rspack-plugin](../README.md) / rspackPluginTevm

# Function: rspackPluginTevm()

> **rspackPluginTevm**(`options`?): `any`

Defined in: bundler-packages/rspack/types/rspackPluginTevm.d.ts:140

Creates an Rspack plugin for Tevm that enables direct Solidity imports in JavaScript
and TypeScript code.

This plugin integrates with Rspack to transform imports of .sol files into JavaScript
modules that export Tevm Contract instances. These instances include the contract's ABI,
bytecode, and type information, allowing you to interact with Ethereum smart contracts
in a type-safe way directly from your JavaScript/TypeScript code.

[Rspack](https://www.rspack.dev/) is a Rust-based JavaScript bundler that's highly
compatible with Webpack APIs but offers significantly better performance.

## Parameters

### options?

#### solc?

[`SolcVersions`](../../solc/type-aliases/SolcVersions.md)

Solidity compiler version to use

## Returns

`any`

- An Rspack plugin instance

## Example

#### Basic Rspack Configuration

Add the plugin to your Rspack configuration:

```javascript
// rspack.config.js
const { rspackPluginTevm } = require('@tevm/rspack')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  plugins: [
    rspackPluginTevm()
  ]
}
```

#### Rsbuild Configuration

Works with Rsbuild as well:

```typescript
// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core'
import { rspackPluginTevm } from '@tevm/rspack'

export default defineConfig({
  tools: {
    rspack: {
      plugins: [rspackPluginTevm()]
    }
  }
})
```

#### TypeScript Configuration

For full TypeScript support including editor integration (code completion, type checking),
add the Tevm TypeScript plugin to your tsconfig.json:

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "tevm/ts-plugin" }]
  }
}
```

#### Using Imported Contracts

Once configured, you can import Solidity files directly and use them with full type safety:

```typescript
// Import a Solidity contract directly
import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol'
import { createMemoryClient } from 'tevm'

// Access contract metadata
console.log('ABI:', ERC20.abi)
console.log('Human-readable ABI:', ERC20.humanReadableAbi)
console.log('Bytecode:', ERC20.bytecode)

// Create a Tevm client
const client = createMemoryClient()

// Deploy the contract
const deployedContract = await client.deployContract(ERC20, [
  "Rspack Demo Token",  // name
  "RDT"                 // symbol
])

// Call read methods with full type safety
const name = await deployedContract.read.name()
const symbol = await deployedContract.read.symbol()

console.log(`Token: ${name} (${symbol})`)
```

#### How It Works

Under the hood, the plugin transforms Solidity imports into JavaScript modules.
For example, importing ERC20.sol generates a module with code like:

```typescript
import { createContract } from '@tevm/contract'

export const ERC20 = createContract({
  name: 'ERC20',
  humanReadableAbi: [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)',
    // ... other functions
  ],
  bytecode: '0x...',
  deployedBytecode: '0x...',
})
```

#### Custom Configuration

For custom configuration of the Tevm compiler, add a `tevm.config.json` file to your project root:

```json
{
  "foundryProject": true,       // Is this a Foundry project?
  "libs": ["lib"],              // Library directories to search in
  "remappings": {               // Import remappings (like in Foundry)
    "foo": "vendored/foo"
  },
  "debug": true,                // Enable debug logging
  "cacheDir": ".tevm"           // Cache directory for compiled contracts
}
```

## See

 - [Tevm Solidity Import Documentation](https://tevm.sh/learn/solidity-imports)
 - [Rspack Plugin API](https://www.rspack.dev/api/plugin)
