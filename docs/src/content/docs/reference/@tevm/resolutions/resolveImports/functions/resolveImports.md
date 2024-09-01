---
editUrl: false
next: false
prev: false
title: "resolveImports"
---

> **resolveImports**(`absolutePath`, `code`, `remappings`, `libs`, `sync`): `Effect`\<`never`, [`ResolveImportsError`](/reference/tevm/resolutions/resolveimports/type-aliases/resolveimportserror/), readonly [`ResolvedImport`](/reference/tevm/resolutions/types/type-aliases/resolvedimport/)[]\>

## Parameters

• **absolutePath**: `string`

• **code**: `string`

• **remappings**: `Record`\<`string`, `string`\>

• **libs**: readonly `string`[]

• **sync**: `boolean` = `false`

## Returns

`Effect`\<`never`, [`ResolveImportsError`](/reference/tevm/resolutions/resolveimports/type-aliases/resolveimportserror/), readonly [`ResolvedImport`](/reference/tevm/resolutions/types/type-aliases/resolvedimport/)[]\>

## Defined in

[resolveImports.js:50](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/resolutions/src/resolveImports.js#L50)
