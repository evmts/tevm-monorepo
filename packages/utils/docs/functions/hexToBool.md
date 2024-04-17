**@tevm/utils** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/utils](../README.md) / hexToBool

# Function: hexToBool()

> **hexToBool**(`hex_`, `opts`?): `boolean`

Decodes a hex value into a boolean.

- Docs: https://viem.sh/docs/utilities/fromHex#hextobool

## Parameters

• **hex\_**: ```0x${string}```

• **opts?**: `HexToBoolOpts`

Options.

## Returns

`boolean`

Boolean value.

## Example

```ts
import { hexToBool } from 'viem'
const data = hexToBool('0x01')
// true
```

## Example

```ts
import { hexToBool } from 'viem'
const data = hexToBool('0x0000000000000000000000000000000000000000000000000000000000000001', { size: 32 })
// true
```

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:99
