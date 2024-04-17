---
editUrl: false
next: false
prev: false
title: "stringToHex"
---

> **stringToHex**(`value_`, `opts`?): [`Hex`](/reference/type-aliases/hex/)

Encodes a UTF-8 string into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#stringtohex

## Parameters

• **value\_**: `string`

• **opts?**: `StringToHexOpts`

Options.

## Returns

[`Hex`](/reference/type-aliases/hex/)

Hex value.

## Example

```ts
import { stringToHex } from 'viem'
const data = stringToHex('Hello World!')
// '0x48656c6c6f20576f726c6421'
```

## Example

```ts
import { stringToHex } from 'viem'
const data = stringToHex('Hello World!', { size: 32 })
// '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
```

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:147
