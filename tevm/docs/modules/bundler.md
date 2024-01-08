[tevm](../README.md) / [Modules](../modules.md) / bundler

# Module: bundler

## Table of contents

### Type Aliases

- [AsyncBundlerResult](bundler.md#asyncbundlerresult)
- [Bundler](bundler.md#bundler)
- [BundlerResult](bundler.md#bundlerresult)
- [FileAccessObject](bundler.md#fileaccessobject)
- [Logger](bundler.md#logger)
- [SolidityResolver](bundler.md#solidityresolver)
- [SyncBundlerResult](bundler.md#syncbundlerresult)

### Functions

- [bundler](bundler.md#bundler-1)

## Type Aliases

### AsyncBundlerResult

Ƭ **AsyncBundlerResult**: `AsyncBundlerResult$1`

./types.ts

#### Defined in

bundler/base/dist/index.d.ts:137

___

### Bundler

Ƭ **Bundler**: `Bundler$1`

./types.ts

#### Defined in

bundler/base/dist/index.d.ts:141

___

### BundlerResult

Ƭ **BundlerResult**: `BundlerResult$1`

./types.ts

#### Defined in

bundler/base/dist/index.d.ts:145

___

### FileAccessObject

Ƭ **FileAccessObject**: `FileAccessObject$1`

./types.ts

#### Defined in

bundler/base/dist/index.d.ts:149

___

### Logger

Ƭ **Logger**: `Logger$1`

./types.ts

#### Defined in

bundler/base/dist/index.d.ts:153

___

### SolidityResolver

Ƭ **SolidityResolver**: `SolidityResolver$1`

./types.ts

#### Defined in

bundler/base/dist/index.d.ts:157

___

### SyncBundlerResult

Ƭ **SyncBundlerResult**: `SyncBundlerResult$1`

./types.ts

#### Defined in

bundler/base/dist/index.d.ts:161

## Functions

### bundler

▸ **bundler**(`config`, `logger`, `fao`, `solc`, `cache`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `ResolvedCompilerConfig$1` |
| `logger` | `Logger$1` |
| `fao` | `FileAccessObject$1` |
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
| `resolveCjsModule` | `AsyncBundlerResult$1` | Resolves cjs representation of the solidity module |
| `resolveCjsModuleSync` | `SyncBundlerResult$1` | Resolves cjs representation of the solidity module |
| `resolveDts` | `AsyncBundlerResult$1` | Resolves .d.ts representation of the solidity module |
| `resolveDtsSync` | `SyncBundlerResult$1` | Resolves .d.ts representation of the solidity module |
| `resolveEsmModule` | `AsyncBundlerResult$1` | Resolves the esm representation of the solidity module |
| `resolveEsmModuleSync` | `SyncBundlerResult$1` | Resolves the esm representation of the solidity module |
| `resolveTsModule` | `AsyncBundlerResult$1` | Resolves typescript representation of the solidity module |
| `resolveTsModuleSync` | `SyncBundlerResult$1` | Resolves typescript representation of the solidity module |

#### Defined in

bundler/base/dist/index.d.ts:34
