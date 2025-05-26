[**@tevm/base-bundler**](../../README.md)

***

[@tevm/base-bundler](../../modules.md) / [bundler](../README.md) / bundler

# Function: bundler()

> **bundler**(`config`, `logger`, `fao`, `solc`, `cache`, `contractPackage?`): `object`

Defined in: [bundler.js:89](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/base-bundler/src/bundler.js#L89)

Creates a bundler instance for processing Solidity files into JavaScript and TypeScript.

The bundler is the core component of Tevm's build system, providing the capability to:
- Compile Solidity files to ABI, bytecode, and AST
- Generate TypeScript type definitions from the ABI
- Generate JavaScript or TypeScript code for importing contracts
- Cache compilation results for better performance
- Support multiple module formats (ESM, CJS, TypeScript)

This base bundler is used by all Tevm build plugins including TypeScript,
Webpack, Vite, Bun, ESBuild, and others.

## Parameters

### config

`ResolvedCompilerConfig`

The Tevm compiler configuration

### logger

[`Logger`](../../types/type-aliases/Logger.md)

Logger for error and info reporting

### fao

[`FileAccessObject`](../../types/type-aliases/FileAccessObject.md)

File system access object for reading/writing files

### solc

`Solc`

Solidity compiler instance

### cache

`Cache`

Cache instance for build artifacts

### contractPackage?

Optional contract package name

`"tevm/contract"` | `"@tevm/contract"`

## Returns

A bundler instance with methods for resolving Solidity modules

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

> **resolveCjsModule**: [`AsyncBundlerResult`](../../types/type-aliases/AsyncBundlerResult.md)

Resolves cjs representation of the solidity module

### resolveCjsModuleSync

> **resolveCjsModuleSync**: [`SyncBundlerResult`](../../types/type-aliases/SyncBundlerResult.md)

Resolves cjs representation of the solidity module

### resolveDts

> **resolveDts**: [`AsyncBundlerResult`](../../types/type-aliases/AsyncBundlerResult.md)

Resolves .d.ts representation of the solidity module

### resolveDtsSync

> **resolveDtsSync**: [`SyncBundlerResult`](../../types/type-aliases/SyncBundlerResult.md)

Resolves .d.ts representation of the solidity module

### resolveEsmModule

> **resolveEsmModule**: [`AsyncBundlerResult`](../../types/type-aliases/AsyncBundlerResult.md)

Resolves the esm representation of the solidity module

### resolveEsmModuleSync

> **resolveEsmModuleSync**: [`SyncBundlerResult`](../../types/type-aliases/SyncBundlerResult.md)

Resolves the esm representation of the solidity module

### resolveTsModule

> **resolveTsModule**: [`AsyncBundlerResult`](../../types/type-aliases/AsyncBundlerResult.md)

Resolves typescript representation of the solidity module

### resolveTsModuleSync

> **resolveTsModuleSync**: [`SyncBundlerResult`](../../types/type-aliases/SyncBundlerResult.md)

Resolves typescript representation of the solidity module

## Example

```javascript
import { bundler } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { readFile, writeFile } from 'fs/promises'
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'fs'
import { mkdir, stat } from 'fs/promises'
import { createSolc } from '@tevm/solc'
import { loadConfig } from '@tevm/config'

// Create a file access object with all required methods
const fao = {
  // Async methods
  readFile: (path, encoding) => readFile(path, { encoding }),
  writeFile,
  exists: async (path) => existsSync(path),
  stat,
  mkdir,

  // Sync methods
  readFileSync: (path, encoding) => readFileSync(path, { encoding }),
  writeFileSync,
  existsSync,
  statSync,
  mkdirSync
}

async function setupBundler() {
  // Initialize dependencies
  const config = await loadConfig()
  const solcCompiler = await createSolc()
  const cacheInstance = createCache()

  // Create the bundler
  const tevmBundler = bundler(
    config,
    console,
    fao,
    solcCompiler,
    cacheInstance
  )

  // Process a Solidity file to TypeScript
  const result = await tevmBundler.resolveTsModule(
    './contracts/ERC20.sol',
    process.cwd(),
    true,  // include AST
    true   // include bytecode
  )

  console.log(result.code)

  // The result contains:
  // - code: The generated TypeScript code
  // - modules: Information about processed modules
  // - solcInput: The input provided to solc
  // - solcOutput: The compiler output
  // - asts: Abstract Syntax Trees (if requested)
}

setupBundler().catch(console.error)
```
