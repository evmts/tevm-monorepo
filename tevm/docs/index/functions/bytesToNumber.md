[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / bytesToNumber

# Function: bytesToNumber()

> **bytesToNumber**(`bytes`, `opts`?): `number`

Defined in: node\_modules/.pnpm/viem@2.23.5\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@6.0.5\_zod@3.24.2/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:96

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
