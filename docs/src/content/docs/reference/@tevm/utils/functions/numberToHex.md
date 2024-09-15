---
editUrl: false
next: false
prev: false
title: "numberToHex"
---

> **numberToHex**(`value_`, `opts`?): [`Hex`](/reference/tevm/utils/type-aliases/hex/)

Encodes a number or bigint into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#numbertohex

## Parameters

• **value\_**: `number` \| `bigint`

• **opts?**: `NumberToHexOpts`

Options.

## Returns

[`Hex`](/reference/tevm/utils/type-aliases/hex/)

Hex value.

## Examples

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420)
// '0x1a4'
```

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420, { size: 32 })
// '0x00000000000000000000000000000000000000000000000000000000000001a4'
```

## Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:122
