---
editUrl: false
next: false
prev: false
title: "numberToHex"
---

> **numberToHex**(`value_`, `opts`?): [`Hex`](/reference/type-aliases/hex/)

Encodes a number or bigint into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#numbertohex

## Parameters

• **value\_**: `number` \| `bigint`

• **opts?**: `NumberToHexOpts`

Options.

## Returns

[`Hex`](/reference/type-aliases/hex/)

Hex value.

## Example

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420)
// '0x1a4'
```

## Example

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420, { size: 32 })
// '0x00000000000000000000000000000000000000000000000000000000000001a4'
```

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:122
