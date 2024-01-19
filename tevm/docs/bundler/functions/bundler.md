**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [bundler](../README.md) > bundler

# Function: bundler()

> **bundler**(`config`, `logger`, `fao`, `solc`, `cache`): `object`

## Parameters

▪ **config**: `ResolvedCompilerConfig$1`

▪ **logger**: `Logger$1`

▪ **fao**: `FileAccessObject$1`

▪ **solc**: `any`

▪ **cache**: `Cache$1`

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

## Source

bundler/base/dist/index.d.ts:34

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
