---
editUrl: false
next: false
prev: false
title: "resolveArtifacts"
---

> **resolveArtifacts**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): `Promise`\<[`ResolvedArtifacts`](/reference/tevm/compiler/types/type-aliases/resolvedartifacts/)\>

Resolves artifacts with solc asyncronously

## Parameters

• **solFile**: `string`

• **basedir**: `string`

• **logger**: [`Logger`](/reference/tevm/compiler/types/type-aliases/logger/)

• **config**: [`ResolvedCompilerConfig`](/reference/tevm/config/types/type-aliases/resolvedcompilerconfig/)

• **includeAst**: `boolean`

• **includeBytecode**: `boolean`

• **fao**: [`FileAccessObject`](/reference/tevm/compiler/types/type-aliases/fileaccessobject/)

• **solc**: `any`

## Returns

`Promise`\<[`ResolvedArtifacts`](/reference/tevm/compiler/types/type-aliases/resolvedartifacts/)\>

## Defined in

[compiler/src/resolveArtifacts.js:7](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/resolveArtifacts.js#L7)
