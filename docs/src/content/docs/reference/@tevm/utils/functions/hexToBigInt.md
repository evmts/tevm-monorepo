---
editUrl: false
next: false
prev: false
title: "hexToBigInt"
---

> **hexToBigInt**(`hex`, `opts`?): `bigint`

Decodes a hex value into a bigint.

- Docs: https://viem.sh/docs/utilities/fromHex#hextobigint

## Parameters

▪ **hex**: \`0x${string}\`

Hex value to decode.

▪ **opts?**: `HexToBigIntOpts`

Options.

## Returns

BigInt value.

## Example

```ts
import { hexToBigInt } from 'viem'
const data = hexToBigInt('0x1a4', { signed: true })
// 420n
```

## Example

```ts
import { hexToBigInt } from 'viem'
const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
// 420n
```

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:74

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
