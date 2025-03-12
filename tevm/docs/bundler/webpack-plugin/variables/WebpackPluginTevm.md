[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/webpack-plugin](../README.md) / WebpackPluginTevm

# Variable: WebpackPluginTevm

> `const` **WebpackPluginTevm**: `TevmWebpackPluginConstructor`

Defined in: bundler-packages/webpack/types/WebpackPluginTevm.d.ts:108

Webpack plugin for Tevm that enables direct Solidity imports in JavaScript and TypeScript code.

This plugin integrates with Webpack to transform imports of .sol files into JavaScript
modules that export Tevm Contract instances. These instances include the contract's ABI,
bytecode, and type information, allowing you to interact with Ethereum smart contracts
in a type-safe way directly from your JavaScript/TypeScript code.

## Example

#### Basic Configuration

Add the plugin to your webpack configuration:

```javascript
// webpack.config.js
const { WebpackPluginTevm } = require('@tevm/webpack')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  plugins: [
    new WebpackPluginTevm()
  ]
}
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

// Create Tevm client and deploy the contract
const client = createMemoryClient()
const deployed = await client.deployContract(ERC20, ["WebpackDemo", "WDEMO"])

// Interact with the contract
const name = await deployed.read.name()
console.log(`Token name: ${name}`)
```

#### How It Works

Under the hood, the plugin transforms Solidity imports into JavaScript modules
that create Tevm Contract instances. For example, importing ERC20.sol generates code like:

```javascript
import { createContract } from '@tevm/contract'

export const ERC20 = createContract({
  name: 'ERC20',
  humanReadableAbi: [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
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
 - [Webpack Plugin System](https://webpack.js.org/concepts/plugins/)
