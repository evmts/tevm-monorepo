---
editUrl: false
next: false
prev: false
title: "FileAccessObject"
---

> **FileAccessObject**: `object`

## Type declaration

### exists

> **exists**: (`path`) => `Promise`\<`boolean`\>

#### Parameters

▪ **path**: `string`

### existsSync

> **existsSync**: (`path`) => `boolean`

#### Parameters

▪ **path**: `string`

### readFile

> **readFile**: (`path`, `encoding`) => `Promise`\<`string`\>

#### Parameters

▪ **path**: `string`

▪ **encoding**: `BufferEncoding`

### readFileSync

> **readFileSync**: (`path`, `encoding`) => `string`

#### Parameters

▪ **path**: `string`

▪ **encoding**: `BufferEncoding`

## Source

[compiler/src/types.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/compiler/src/types.ts#L40)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
