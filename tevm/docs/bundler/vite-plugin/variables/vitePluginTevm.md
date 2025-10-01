[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/vite-plugin](../README.md) / vitePluginTevm

# Variable: vitePluginTevm()

> `const` **vitePluginTevm**: (`options?`) => `Plugin`

Defined in: bundler-packages/vite/types/vitePluginTevm.d.ts:52

Creates a Vite plugin for Tevm that enables direct Solidity imports in JavaScript
and TypeScript code.

This plugin integrates with Vite to transform imports of .sol files into JavaScript
modules that export Tevm Contract instances. These instances include the contract's ABI,
bytecode, and type information, allowing you to interact with Ethereum smart contracts
in a type-safe way directly in your Vite-powered applications.

## Parameters

### options?

#### solc?

`CompilerOption`

## Returns

`Plugin`

A Vite plugin that handles Solidity imports

## Examples

```ts
// Basic Configuration - Add the plugin to your Vite configuration
// vite.config.js
import { defineConfig } from 'vite'
import { vitePluginTevm } from '@tevm/vite'

export default defineConfig({
  plugins: [vitePluginTevm()],
})
```

```ts
// TypeScript Configuration - For full TypeScript support
// Add to tsconfig.json:
// {
//   "compilerOptions": {
//     "plugins": [{ "name": "tevm/ts-plugin" }]
//   }
// }
```

```ts
// How Solidity imports work - Generated module example
import { createContract } from '@tevm/contract'

export const ERC20 = createContract({
  name: 'ERC20',
  humanReadableAbi: [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    // other functions...
  ],
  bytecode: '0x...',
  deployedBytecode: '0x...',
})

The plugin supports Vite's HMR, so when you edit your Solidity files, your
application will update without a full reload if possible.
```

## See

 - [Tevm Solidity Import Documentation](https://tevm.sh/learn/solidity-imports)
 - [Vite Plugin API](https://vitejs.dev/guide/api-plugin.html)
