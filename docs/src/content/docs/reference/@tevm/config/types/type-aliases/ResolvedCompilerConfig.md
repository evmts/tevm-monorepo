---
editUrl: false
next: false
prev: false
title: "ResolvedCompilerConfig"
---

> **ResolvedCompilerConfig**: `object`

A fully resolved compiler config with defaults filled in
See [CompilerConfig](/reference/tevm/config/types/type-aliases/compilerconfig/)

## Type declaration

### cacheDir

> **cacheDir**: `string`

Location of the tevm cache folder

### debug

> **debug**?: `boolean`

If debug is true tevm will write the .d.ts files in the ts server and publish extra debug info to a debug file

### foundryProject

> **foundryProject**: `boolean` \| `string`

If set to true it will resolve forge remappings and libs
Set to "path/to/forge/executable" to use a custom forge executable

### libs

> **libs**: readonly `string`[]

Sets directories to search for solidity imports in
Read autoamtically for forge projects if forge: true

### remappings

> **remappings**: `ReadonlyRecord`\<`string`\>

Remap the location of contracts

## Source

[bundler-packages/config/src/types.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/types.ts#L45)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
