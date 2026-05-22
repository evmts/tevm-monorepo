[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / bytesToHex

# Function: bytesToHex()

> **bytesToHex**(`value`, `opts?`): `` `0x${string}` ``

Encodes a bytes array into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#bytestohex

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `ByteArray` | Value to encode. |
| `opts?` | `BytesToHexOpts` | Options. |

## Returns

`` `0x${string}` ``

Hex value.

## Examples

```ts
import { bytesToHex } from 'viem'
const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
// '0x48656c6c6f20576f726c6421'
```

```ts
import { bytesToHex } from 'viem'
const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
// '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
```
