---
editUrl: false
next: false
prev: false
title: "boolToHex"
---

> **boolToHex**(`value`, `opts`?): [`Hex`](/reference/type-aliases/hex/)

Encodes a boolean into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#booltohex

## Parameters

• **value**: `boolean`

Value to encode.

• **opts?**: `BoolToHexOpts`

Options.

## Returns

[`Hex`](/reference/type-aliases/hex/)

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

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:66
