---
editUrl: false
next: false
prev: false
title: "toBytes"
---

> **toBytes**(`value`, `opts`?): `ByteArray`

Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes
- Example: https://viem.sh/docs/utilities/toBytes#usage

## Parameters

▪ **value**: `string` \| `number` \| `bigint` \| `boolean`

Value to encode.

▪ **opts?**: `ToBytesParameters`

Options.

## Returns

Byte array value.

## Example

```ts
import { toBytes } from 'viem'
const data = toBytes('Hello world')
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
```

## Example

```ts
import { toBytes } from 'viem'
const data = toBytes(420)
// Uint8Array([1, 164])
```

## Example

```ts
import { toBytes } from 'viem'
const data = toBytes(420, { size: 4 })
// Uint8Array([0, 0, 1, 164])
```

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/encoding/toBytes.d.ts:37

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
