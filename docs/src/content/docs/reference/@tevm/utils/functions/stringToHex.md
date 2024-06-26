---
editUrl: false
next: false
prev: false
title: "stringToHex"
---

> **stringToHex**(`value_`, `opts`?): [`Hex`](/reference/tevm/utils/type-aliases/hex/)

Encodes a UTF-8 string into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#stringtohex

## Parameters

• **value\_**: `string`

• **opts?**: `StringToHexOpts`

Options.

## Returns

[`Hex`](/reference/tevm/utils/type-aliases/hex/)

Hex value.

## Examples

```ts
import { stringToHex } from 'viem'
const data = stringToHex('Hello World!')
// '0x48656c6c6f20576f726c6421'
```

```ts
import { stringToHex } from 'viem'
const data = stringToHex('Hello World!', { size: 32 })
// '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
```

## Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:147
