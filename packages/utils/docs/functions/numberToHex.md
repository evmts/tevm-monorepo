[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / numberToHex

# Function: numberToHex()

> **numberToHex**(`value_`, `opts`?): [`Hex`](../type-aliases/Hex.md)

Encodes a number or bigint into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#numbertohex

## Parameters

• **value\_**: `number` \| `bigint`

• **opts?**: `NumberToHexOpts`

Options.

## Returns

[`Hex`](../type-aliases/Hex.md)

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

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.6.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:122
