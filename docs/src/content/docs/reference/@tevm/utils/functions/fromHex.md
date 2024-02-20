---
editUrl: false
next: false
prev: false
title: "fromHex"
---

> **fromHex**\<`TTo`\>(`hex`, `toOrOpts`): `FromHexReturnType`\<`TTo`\>

Decodes a hex string into a string, number, bigint, boolean, or byte array.

- Docs: https://viem.sh/docs/utilities/fromHex
- Example: https://viem.sh/docs/utilities/fromHex#usage

## Type parameters

▪ **TTo** extends `"string"` \| `"number"` \| `"bigint"` \| `"boolean"` \| `"bytes"`

## Parameters

▪ **hex**: \`0x${string}\`

Hex string to decode.

▪ **toOrOpts**: `FromHexParameters`\<`TTo`\>

Type to convert to or options.

## Returns

Decoded value.

## Example

```ts
import { fromHex } from 'viem'
const data = fromHex('0x1a4', 'number')
// 420
```

## Example

```ts
import { fromHex } from 'viem'
const data = fromHex('0x48656c6c6f20576f726c6421', 'string')
// 'Hello world'
```

## Example

```ts
import { fromHex } from 'viem'
const data = fromHex('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
  size: 32,
  to: 'string'
})
// 'Hello world'
```

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:47

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
