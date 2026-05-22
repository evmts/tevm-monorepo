[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / hexToBytes

# Function: hexToBytes()

> **hexToBytes**(`hex_`, `opts?`): `ByteArray`

Encodes a hex string into a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes#hextobytes

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex_` | `` `0x${string}` `` | - |
| `opts?` | `HexToBytesOpts` | Options. |

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
