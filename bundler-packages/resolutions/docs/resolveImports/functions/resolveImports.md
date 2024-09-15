[**@tevm/resolutions**](../../README.md) • **Docs**

***

[@tevm/resolutions](../../modules.md) / [resolveImports](../README.md) / resolveImports

# Function: resolveImports()

> **resolveImports**(`absolutePath`, `code`, `remappings`, `libs`, `sync`): `Effect`\<`never`, [`ResolveImportsError`](../type-aliases/ResolveImportsError.md), readonly [`ResolvedImport`](../../types/type-aliases/ResolvedImport.md)[]\>

## Parameters

• **absolutePath**: `string`

• **code**: `string`

• **remappings**: `Record`\<`string`, `string`\>

• **libs**: readonly `string`[]

• **sync**: `boolean` = `false`

## Returns

`Effect`\<`never`, [`ResolveImportsError`](../type-aliases/ResolveImportsError.md), readonly [`ResolvedImport`](../../types/type-aliases/ResolvedImport.md)[]\>

## Defined in

[resolveImports.js:50](https://github.com/qbzzt/tevm-monorepo/blob/main/bundler-packages/resolutions/src/resolveImports.js#L50)
