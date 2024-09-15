---
editUrl: false
next: false
prev: false
title: "FileAccessObject"
---

> **FileAccessObject**: `object`

## Type declaration

### exists()

> **exists**: (`path`) => `Promise`\<`boolean`\>

#### Parameters

• **path**: `string`

#### Returns

`Promise`\<`boolean`\>

### existsSync()

> **existsSync**: (`path`) => `boolean`

#### Parameters

• **path**: `string`

#### Returns

`boolean`

### readFile()

> **readFile**: (`path`, `encoding`) => `Promise`\<`string`\>

#### Parameters

• **path**: `string`

• **encoding**: `BufferEncoding`

#### Returns

`Promise`\<`string`\>

### readFileSync()

> **readFileSync**: (`path`, `encoding`) => `string`

#### Parameters

• **path**: `string`

• **encoding**: `BufferEncoding`

#### Returns

`string`

## Defined in

[compiler/src/types.ts:36](https://github.com/qbzzt/tevm-monorepo/blob/main/bundler-packages/compiler/src/types.ts#L36)
