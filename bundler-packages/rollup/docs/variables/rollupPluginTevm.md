[**@tevm/rollup-plugin**](../README.md)

***

[@tevm/rollup-plugin](../globals.md) / rollupPluginTevm

# Variable: rollupPluginTevm()

> `const` **rollupPluginTevm**: (`options?`) => `Plugin`

Defined in: [bundler-packages/rollup/src/rollupPluginTevm.js:125](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/rollup/src/rollupPluginTevm.js#L125)

Creates a Rollup plugin for Tevm that enables direct Solidity imports in JavaScript
and TypeScript code.

This plugin integrates with Rollup to transform imports of .sol files into JavaScript
modules that export Tevm Contract instances. These instances include the contract's ABI,
bytecode, and type information, allowing you to interact with Ethereum smart contracts
in a type-safe way directly from your JavaScript/TypeScript code.

## Parameters

### options?

#### solc?

`SolcVersions`

## Returns

`Plugin`

A Rollup plugin that handles Solidity imports

## Example

#### Basic Configuration

Add the plugin to your Rollup configuration:

```javascript
// rollup.config.js
import { defineConfig } from 'rollup'
import { rollupPluginTevm } from '@tevm/rollup'

export default defineConfig({
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [rollupPluginTevm()],
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
  "My Token",  // constructor arg: name
  "MTK"        // constructor arg: symbol
])

// Call read methods with full type safety
const name = await deployedContract.read.name()
const symbol = await deployedContract.read.symbol()
const decimals = await deployedContract.read.decimals()

// Call write methods
const tx = await deployedContract.write.transfer(
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // recipient address
  1000n                                         // amount (as BigInt)
)
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
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)',
    'function transfer(address,uint256) returns (bool)',
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
 - [Rollup Plugin Development](https://rollupjs.org/plugin-development)
