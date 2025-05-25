[**@tevm/esbuild-plugin**](../README.md)

***

[@tevm/esbuild-plugin](../globals.md) / esbuildPluginTevm

# Variable: esbuildPluginTevm()

> `const` **esbuildPluginTevm**: (`options?`) => `Plugin`

Defined in: bundler-packages/esbuild/src/esbuildPluginTevm.js:113

Creates an esbuild plugin for Tevm that enables direct Solidity imports in JavaScript
and TypeScript code.

This plugin integrates with esbuild to transform imports of .sol files into JavaScript
modules that export Tevm Contract instances. These instances include the contract's ABI,
bytecode, and type information, allowing you to interact with them in a type-safe way.

## Parameters

### options?

#### solc?

`SolcVersions`

## Returns

`Plugin`

An esbuild plugin that handles Solidity imports

## Example

#### Basic Configuration

Add the plugin to your esbuild configuration:

```javascript
// esbuild.config.js
import { esbuildPluginTevm } from '@tevm/esbuild'
import { build } from 'esbuild'

build({
  entryPoints: ['src/index.js'],
  outdir: 'dist',
  bundle: true,
  plugins: [esbuildPluginTevm()],
})
```

#### TypeScript Configuration

For full TypeScript support including editor integration, add the Tevm TypeScript plugin
to your tsconfig.json:

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

// Deploy and interact with the contract
const client = createMemoryClient()

// Deploy contract
const deployed = await client.deployContract(ERC20, [
  "My Token",  // name
  "MTK"        // symbol
])

// Call contract methods with type safety
const name = await deployed.read.name()
const totalSupply = await deployed.read.totalSupply()

// Write operations
const tx = await deployed.write.transfer(
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  1000n
)
```

#### How It Works

Under the hood, the plugin transforms Solidity imports into JavaScript modules.
For example, importing ERC20.sol creates code like:

```typescript
import { createContract } from '@tevm/contract'

export const ERC20 = createContract({
  name: 'ERC20',
  humanReadableAbi: [ 'function balanceOf(address): uint256', ... ],
  bytecode: '0x...',
  deployedBytecode: '0x...',
})
```

#### Custom Configuration

For custom configuration of the Tevm compiler, add a `tevm.config.json` file to your project root:

```json
{
  "foundryProject": true,       // Is this a Foundry project?
  "libs": ["lib"],              // Library directories
  "remappings": {               // Import remappings (like in Foundry)
    "foo": "vendored/foo"
  },
  "debug": true,                // Enable debug logging
  "cacheDir": ".tevm"           // Cache directory
}
```

## See

 - [Tevm Solidity Import Documentation](https://tevm.sh/learn/solidity-imports)
 - [esbuild Plugins Documentation](https://esbuild.github.io/plugins/)
