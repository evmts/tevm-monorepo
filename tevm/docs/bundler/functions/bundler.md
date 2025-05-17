[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [bundler](../README.md) / bundler

# Function: bundler()

> **bundler**(`config`, `logger`, `fao`, `solc`, `cache`, `contractPackage?`): `object`

Defined in: bundler-packages/base-bundler/types/src/bundler.d.ts:1

## Parameters

### config

`ResolvedCompilerConfig`

### logger

`Logger`

### fao

`FileAccessObject`

### solc

[`Solc`](../solc/interfaces/Solc.md)

### cache

`Cache`

### contractPackage?

`"tevm/contract"` | `"@tevm/contract"`

## Returns

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
