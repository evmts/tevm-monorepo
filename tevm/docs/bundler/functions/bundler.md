**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [bundler](../README.md) > bundler

# Function: bundler()

> **bundler**(`config`, `logger`, `fao`, `solc`, `cache`): `object`

The base bundler instance used within tevm to generate JavaScript and TypeScript files
from solidity files. This is used internally by all other tevm build tooling including
the ts-plugin, the webpack plugin, the bun plugin, the vite plugin, and more.

## Parameters

▪ **config**: `ResolvedCompilerConfig$1`

The tevm config. Can be loaded with `loadConfig()`

▪ **logger**: `Logger$1`

The logger to use for logging. Can be `console`

▪ **fao**: `FileAccessObject$1`

The file access object to use for reading and writing files. Can use fs to fill this out

▪ **solc**: `any`

The solc compiler to use. Can be loaded with `createSolc()`

▪ **cache**: `Cache$1`

The cache to use. Can be created with `createCache()`

## Returns

> ### config
>
> > **config**: `ResolvedCompilerConfig$1`
>
> The configuration of the plugin.
>
> ### exclude
>
> > **exclude**?: `string`[]
>
> ### include
>
> > **include**?: `string`[]
>
> ### name
>
> > **name**: `string`
>
> The name of the plugin.
>
> ### resolveCjsModule
>
> > **resolveCjsModule**: `AsyncBundlerResult$1`
>
> Resolves cjs representation of the solidity module
>
> ### resolveCjsModuleSync
>
> > **resolveCjsModuleSync**: `SyncBundlerResult$1`
>
> Resolves cjs representation of the solidity module
>
> ### resolveDts
>
> > **resolveDts**: `AsyncBundlerResult$1`
>
> Resolves .d.ts representation of the solidity module
>
> ### resolveDtsSync
>
> > **resolveDtsSync**: `SyncBundlerResult$1`
>
> Resolves .d.ts representation of the solidity module
>
> ### resolveEsmModule
>
> > **resolveEsmModule**: `AsyncBundlerResult$1`
>
> Resolves the esm representation of the solidity module
>
> ### resolveEsmModuleSync
>
> > **resolveEsmModuleSync**: `SyncBundlerResult$1`
>
> Resolves the esm representation of the solidity module
>
> ### resolveTsModule
>
> > **resolveTsModule**: `AsyncBundlerResult$1`
>
> Resolves typescript representation of the solidity module
>
> ### resolveTsModuleSync
>
> > **resolveTsModuleSync**: `SyncBundlerResult$1`
>
> Resolves typescript representation of the solidity module
>

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

## Source

[bundler/base-bundler/dist/index.d.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/bundler/base-bundler/dist/index.d.ts#L34)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
