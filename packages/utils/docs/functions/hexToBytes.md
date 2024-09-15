[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / hexToBytes

# Function: hexToBytes()

> **hexToBytes**(`hex_`, `opts`?): `ByteArray`

Encodes a hex string into a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes#hextobytes

## Parameters

• **hex\_**: \`0x$\{string\}\`

• **opts?**: `HexToBytesOpts`

Options.

## Returns

`ByteArray`

Byte array value.

## Examples

```ts
import { hexToBytes } from 'viem'
const data = hexToBytes('0x48656c6c6f20776f726c6421')
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
```

```ts
import { hexToBytes } from 'viem'
const data = hexToBytes('0x48656c6c6f20776f726c6421', { size: 32 })
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
```

## Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/toBytes.d.ts:87
