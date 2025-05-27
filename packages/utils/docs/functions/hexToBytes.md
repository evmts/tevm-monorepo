[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / hexToBytes

# Function: hexToBytes()

> **hexToBytes**(`hex_`, `opts?`): `ByteArray`

Defined in: node\_modules/.pnpm/viem@2.30.1\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.25.28/node\_modules/viem/\_types/utils/encoding/toBytes.d.ts:87

Encodes a hex string into a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes#hextobytes

## Parameters

### hex\_

`` `0x${string}` ``

### opts?

`HexToBytesOpts`

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
