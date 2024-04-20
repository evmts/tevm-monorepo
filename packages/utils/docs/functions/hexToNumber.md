**@tevm/utils** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/utils](../README.md) / hexToNumber

# Function: hexToNumber()

> **hexToNumber**(`hex`, `opts`?): `number`

Decodes a hex string into a number.

- Docs: https://viem.sh/docs/utilities/fromHex#hextonumber

## Parameters

• **hex**: ```0x${string}```

Hex value to decode.

• **opts?**: `HexToBigIntOpts`

Options.

## Returns

`number`

Number value.

## Example

```ts
import { hexToNumber } from 'viem'
const data = hexToNumber('0x1a4')
// 420
```

## Example

```ts
import { hexToNumber } from 'viem'
const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
// 420
```

## Source

node\_modules/.pnpm/viem@2.9.23\_typescript@5.4.5\_zod@3.22.5/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:121
