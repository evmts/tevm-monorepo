[**@tevm/effect**](../../README.md) • **Docs**

***

[@tevm/effect](../../modules.md) / [resolve](../README.md) / resolveSync

# Function: resolveSync()

> **resolveSync**(`importPath`, `options`): `Effect`\<`never`, [`CouldNotResolveImportError`](../classes/CouldNotResolveImportError.md), `string`\>

Effect wrapper around import('node:resolve').resolveSync

## Parameters

• **importPath**: `string`

• **options**: `SyncOpts` & `AsyncOpts`

## Returns

`Effect`\<`never`, [`CouldNotResolveImportError`](../classes/CouldNotResolveImportError.md), `string`\>

## Defined in

[packages/effect/src/resolve.js:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/resolve.js#L46)
