**@tevm/base** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > bundler

# Function: bundler()

> **bundler**(`config`, `logger`, `fao`, `solc`, `cache`): `object`

## Parameters

▪ **config**: `ResolvedCompilerConfig$1`

▪ **logger**: `Logger`

▪ **fao**: `FileAccessObject`

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
> > **resolveCjsModule**: `AsyncBundlerResult`
>
> Resolves cjs representation of the solidity module
>
> ### resolveCjsModuleSync
>
> > **resolveCjsModuleSync**: `SyncBundlerResult`
>
> Resolves cjs representation of the solidity module
>
> ### resolveDts
>
> > **resolveDts**: `AsyncBundlerResult`
>
> Resolves .d.ts representation of the solidity module
>
> ### resolveDtsSync
>
> > **resolveDtsSync**: `SyncBundlerResult`
>
> Resolves .d.ts representation of the solidity module
>
> ### resolveEsmModule
>
> > **resolveEsmModule**: `AsyncBundlerResult`
>
> Resolves the esm representation of the solidity module
>
> ### resolveEsmModuleSync
>
> > **resolveEsmModuleSync**: `SyncBundlerResult`
>
> Resolves the esm representation of the solidity module
>
> ### resolveTsModule
>
> > **resolveTsModule**: `AsyncBundlerResult`
>
> Resolves typescript representation of the solidity module
>
> ### resolveTsModuleSync
>
> > **resolveTsModuleSync**: `SyncBundlerResult`
>
> Resolves typescript representation of the solidity module
>

## Source

[types.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/bundler/base/src/types.ts#L48)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
