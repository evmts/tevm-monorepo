---
editUrl: false
next: false
prev: false
title: "FileAccessObject"
---

> **FileAccessObject**: `object`

Generalized interface for accessing file system
Allows this package to be used in browser environments or otherwise pluggable

## Type declaration

### exists

> **exists**: (`path`) => `Promise`\<`boolean`\>

#### Parameters

▪ **path**: `string`

### existsSync

> **existsSync**: (`path`) => `boolean`

#### Parameters

▪ **path**: `string`

### mkdir

> **mkdir**: *typeof* `mkdir`

### mkdirSync

> **mkdirSync**: *typeof* `mkdirSync`

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

### stat

> **stat**: *typeof* `stat`

### statSync

> **statSync**: *typeof* `statSync`

### writeFile

> **writeFile**: *typeof* `writeFile`

### writeFileSync

> **writeFileSync**: (`path`, `data`) => `void`

#### Parameters

▪ **path**: `string`

▪ **data**: `string`

## Source

[types.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
