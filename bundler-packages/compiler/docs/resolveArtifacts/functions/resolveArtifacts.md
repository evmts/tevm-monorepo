[**@tevm/compiler**](../../README.md) • **Docs**

***

[@tevm/compiler](../../modules.md) / [resolveArtifacts](../README.md) / resolveArtifacts

# Function: resolveArtifacts()

> **resolveArtifacts**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): `Promise`\<[`ResolvedArtifacts`](../../types/type-aliases/ResolvedArtifacts.md)\>

Resolves artifacts with solc asyncronously

## Parameters

• **solFile**: `string`

• **basedir**: `string`

• **logger**: [`Logger`](../../types/type-aliases/Logger.md)

• **config**: `ResolvedCompilerConfig`

• **includeAst**: `boolean`

• **includeBytecode**: `boolean`

• **fao**: [`FileAccessObject`](../../types/type-aliases/FileAccessObject.md)

• **solc**: `any`

## Returns

`Promise`\<[`ResolvedArtifacts`](../../types/type-aliases/ResolvedArtifacts.md)\>

## Source

[compiler/src/resolveArtifacts.js:7](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/resolveArtifacts.js#L7)
