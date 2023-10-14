[@evmts/bundler](/reference/schema/README.md) / [Modules](/reference/schema/modules.md) / bundler

# Module: bundler

## Table of contents

### Functions

- [bundler](/reference/schema/modules/bundler.md#bundler)

## Functions

### bundler

▸ **bundler**(`config`, `logger`, `fao`, `cache?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Required`<`CompilerConfig`\> |
| `logger` | `Logger` |
| `fao` | `FileAccessObject` |
| `cache?` | [`Cache`](/reference/schema/modules/createCache.md#cache) |

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Required`<`CompilerConfig`\> | The configuration of the plugin. |
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

[bundlers/bundler/src/types.ts:32](https://github.com/evmts/evmts-monorepo/blob/main/bundlers/bundler/src/types.ts#L32)
