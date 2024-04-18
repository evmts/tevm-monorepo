**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [index](../README.md) / bytesToHex

# Function: bytesToHex()

> **bytesToHex**(`value`, `opts`?): [`Hex`](../type-aliases/Hex.md)

Encodes a bytes array into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#bytestohex

## Parameters

• **value**: `Uint8Array`

Value to encode.

• **opts?**: `BytesToHexOpts`

Options.

## Returns

[`Hex`](../type-aliases/Hex.md)

Hex value.

## Example

```ts
import { bytesToHex } from 'viem'
const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
// '0x48656c6c6f20576f726c6421'
```

## Example

```ts
import { bytesToHex } from 'viem'
const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
// '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
```

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:91
