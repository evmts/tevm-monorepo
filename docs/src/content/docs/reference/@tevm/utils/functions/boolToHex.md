---
editUrl: false
next: false
prev: false
title: "boolToHex"
---

> **boolToHex**(`value`, `opts`?): [`Hex`](/reference/tevm/utils/type-aliases/hex/)

Encodes a boolean into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#booltohex

## Parameters

▪ **value**: `boolean`

Value to encode.

▪ **opts?**: `BoolToHexOpts`

Options.

## Returns

Hex value.

## Example

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true)
// '0x1'
```

## Example

```ts
import { boolToHex } from 'viem'
const data = boolToHex(false)
// '0x0'
```

## Example

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true, { size: 32 })
// '0x0000000000000000000000000000000000000000000000000000000000000001'
```

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:66

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
