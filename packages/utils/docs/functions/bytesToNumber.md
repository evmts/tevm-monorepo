[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / bytesToNumber

# Function: bytesToNumber()

> **bytesToNumber**(`bytes`, `opts?`): `number`

Defined in: node\_modules/.pnpm/viem@2.37.9\_bufferutil@4.0.9\_typescript@5.9.3\_utf-8-validate@5.0.10\_zod@4.1.11/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:96

Decodes a byte array into a number.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestonumber

## Parameters

### bytes

`ByteArray`

Byte array to decode.

### opts?

`BytesToBigIntOpts`

Options.

## Returns

`number`

Number value.

## Example

```ts
import { bytesToNumber } from 'viem'
const data = bytesToNumber(new Uint8Array([1, 164]))
// 420
```
