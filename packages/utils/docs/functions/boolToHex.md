[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / boolToHex

# Function: boolToHex()

> **boolToHex**(`value`, `opts`?): [`Hex`](../type-aliases/Hex.md)

Encodes a boolean into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#booltohex

## Parameters

• **value**: `boolean`

Value to encode.

• **opts?**: `BoolToHexOpts`

Options.

## Returns

[`Hex`](../type-aliases/Hex.md)

Hex value.

## Examples

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true)
// '0x1'
```

```ts
import { boolToHex } from 'viem'
const data = boolToHex(false)
// '0x0'
```

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true, { size: 32 })
// '0x0000000000000000000000000000000000000000000000000000000000000001'
```

## Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.7.3\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:66
