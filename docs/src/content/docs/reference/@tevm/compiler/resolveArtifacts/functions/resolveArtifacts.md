---
editUrl: false
next: false
prev: false
title: "resolveArtifacts"
---

> **resolveArtifacts**(`solFile`, `basedir`, `logger`, `config`, `includeAst`, `includeBytecode`, `fao`, `solc`): `Promise`\<[`ResolvedArtifacts`](/reference/types/type-aliases/resolvedartifacts/)\>

Resolves artifacts with solc asyncronously

## Parameters

• **solFile**: `string`

• **basedir**: `string`

• **logger**: [`Logger`](/reference/types/type-aliases/logger/)

• **config**: [`ResolvedCompilerConfig`](/reference/config/types/type-aliases/resolvedcompilerconfig/)

• **includeAst**: `boolean`

• **includeBytecode**: `boolean`

• **fao**: [`FileAccessObject`](/reference/types/type-aliases/fileaccessobject/)

• **solc**: `any`

## Returns

`Promise`\<[`ResolvedArtifacts`](/reference/types/type-aliases/resolvedartifacts/)\>

## Source

[compiler/src/resolveArtifacts.js:7](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/resolveArtifacts.js#L7)
