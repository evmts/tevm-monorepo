[@tevm/base](README.md) / Modules

# @tevm/base

## Table of contents

### Functions

- [bundler](modules.md#bundler)

## Functions

### bundler

▸ **bundler**(`config`, `logger`, `fao`, `solc`, `cache`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `ResolvedCompilerConfig$1` |
| `logger` | `Logger` |
| `fao` | `FileAccessObject` |
| `solc` | `any` |
| `cache` | `Cache$1` |

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `ResolvedCompilerConfig$1` | The configuration of the plugin. |
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

[types.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/bundler/base/src/types.ts#L48)
