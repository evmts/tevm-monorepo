[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / bytesToHex

# Function: bytesToHex()

> **bytesToHex**(`value`, `opts`?): `` `0x${string}` ``

Defined in: node\_modules/.pnpm/viem@2.23.11\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:91

Encodes a bytes array into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#bytestohex

## Parameters

### value

`ByteArray`

Value to encode.

### opts?

`BytesToHexOpts`

Options.

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
