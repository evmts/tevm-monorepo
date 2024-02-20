---
editUrl: false
next: false
prev: false
title: "fromBytes"
---

> **fromBytes**\<`TTo`\>(`bytes`, `toOrOpts`): `FromBytesReturnType`\<`TTo`\>

Decodes a byte array into a UTF-8 string, hex value, number, bigint or boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes
- Example: https://viem.sh/docs/utilities/fromBytes#usage

## Type parameters

▪ **TTo** extends `"string"` \| `"number"` \| `"bigint"` \| `"boolean"` \| `"hex"`

## Parameters

▪ **bytes**: `Uint8Array`

Byte array to decode.

▪ **toOrOpts**: `FromBytesParameters`\<`TTo`\>

Type to convert to or options.

## Returns

Decoded value.

## Example

```ts
import { fromBytes } from 'viem'
const data = fromBytes(new Uint8Array([1, 164]), 'number')
// 420
```

## Example

```ts
import { fromBytes } from 'viem'
const data = fromBytes(
  new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
  'string'
)
// 'Hello world'
```

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:37

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
