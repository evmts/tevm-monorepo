[@evmts/base](../README.md) / [Modules](../modules.md) / bundler

# Module: bundler

## Table of contents

### Functions

- [bundler](bundler.md#bundler)

## Functions

### bundler

▸ **bundler**(`config`, `logger`, `fao`, `cache?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `ResolvedCompilerConfig` |
| `logger` | `Logger` |
| `fao` | `FileAccessObject` |
| `cache?` | [`Cache`](createCache.md#cache) |

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `ResolvedCompilerConfig` | The configuration of the plugin. |
| `exclude?` | `string`[] | - |
| `include?` | `string`[] | - |
| `name` | `string` | The name of the plugin. |
| `resolveCjsModule` | `AsyncBundlerResult` | Resolves cjs representation of the solidity module |
| `resolveCjsModuleSync` | `SyncBundlerResult` | Resolves cjs representation of the solidity module |
| `resolveDts` | `AsyncBundlerResult` | Resolves .d.ts representation of the solidity module |
| `resolveDtsSync` | `SyncBundlerResult` | Resolves .d.ts representation of the solidity module |
| `resolveEsmModule` | `AsyncBundlerResult` | Resolves the esm representation of the solidity module |
| `resolveEsmModuleSync` | `SyncBundlerResult` | Resolves the esm representation of the solidity module |
| `resolveTsModule` | `AsyncBundlerResult` | Resolves typescript representation of the solidity module |
| `resolveTsModuleSync` | `SyncBundlerResult` | Resolves typescript representation of the solidity module |

#### Defined in

[types.ts:34](https://github.com/evmts/evmts-monorepo/blob/main/bundler/base/src/types.ts#L34)
