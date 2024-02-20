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

▪ **value\_**: `number` \| `bigint`

▪ **opts?**: `NumberToHexOpts`

Options.

## Returns

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

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:122

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
