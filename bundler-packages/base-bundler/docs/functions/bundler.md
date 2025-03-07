[**@tevm/base-bundler**](../README.md)

***

[@tevm/base-bundler](../globals.md) / bundler

# Function: bundler()

> **bundler**(`config`, `logger`, `fao`, `solc`, `cache`, `contractPackage`?): `object`

Defined in: [bundler.js:45](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/base-bundler/src/bundler.js#L45)

The base bundler instance used within tevm to generate JavaScript and TypeScript files
from solidity files. This is used internally by all other tevm build tooling including
the ts-plugin, the webpack plugin, the bun plugin, the vite plugin, and more.

## Parameters

### config

`ResolvedCompilerConfig`

The tevm config. Can be loaded with `loadConfig()`

### logger

`Logger`

The logger to use for logging. Can be `console`

### fao

`FileAccessObject`

The file access object to use for reading and writing files. Can use fs to fill this out

### solc

`any`

The solc compiler to use. Can be loaded with `createSolc()`

### cache

`Cache`

The cache to use. Can be created with `createCache()`

### contractPackage?

The name of the package that contains the contract package
If not included the bundler will attempt to autodetect the package

`"tevm/contract"` | `"@tevm/contract"`

## Returns

`object`

### config

> **config**: `ResolvedCompilerConfig`

The configuration of the plugin.

### exclude?

> `optional` **exclude**: `string`[]

### include?

> `optional` **include**: `string`[]

### name

> **name**: `string`

The name of the plugin.

### resolveCjsModule

> **resolveCjsModule**: `AsyncBundlerResult`

Resolves cjs representation of the solidity module

### resolveCjsModuleSync

> **resolveCjsModuleSync**: `SyncBundlerResult`

Resolves cjs representation of the solidity module

### resolveDts

> **resolveDts**: `AsyncBundlerResult`

Resolves .d.ts representation of the solidity module

### resolveDtsSync

> **resolveDtsSync**: `SyncBundlerResult`

Resolves .d.ts representation of the solidity module

### resolveEsmModule

> **resolveEsmModule**: `AsyncBundlerResult`

Resolves the esm representation of the solidity module

### resolveEsmModuleSync

> **resolveEsmModuleSync**: `SyncBundlerResult`

Resolves the esm representation of the solidity module

### resolveTsModule

> **resolveTsModule**: `AsyncBundlerResult`

Resolves typescript representation of the solidity module

### resolveTsModuleSync

> **resolveTsModuleSync**: `SyncBundlerResult`

Resolves typescript representation of the solidity module

## Example

```typescript
import { bundler } from '@tevm/base-bundler-bundler'
import { createCache } from '@tevm/bundler-cache'
import { readFile, writeFile } from 'fs/promises'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { createSolc } from '@tevm/solc'
import { loadConfig } from '@tevm/config'

const fao = {
  readFile,
  writeFile,
  readFileSync,
  writeFileSync,
  existsSync,
  // may need more methods
}

const b = bundler(await loadConfig(), console, fao, await createSolc(), createCache())

const path = '../contracts/ERC20.sol'

const { abi, bytecode } = await b.resolveTs(path, __dirname, true, true)
```
