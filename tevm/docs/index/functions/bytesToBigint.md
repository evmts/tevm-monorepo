[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / bytesToBigint

# Function: bytesToBigint()

> **bytesToBigint**(`bytes`, `opts?`): `bigint`

Defined in: node\_modules/.pnpm/viem@2.30.6\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@3.25.76/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:59

Decodes a byte array into a bigint.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobigint

## Parameters

### bytes

`ByteArray`

Byte array to decode.

### opts?

`BytesToBigIntOpts`

Options.

## Returns

`bigint`

BigInt value.

## Example

```ts
import { bytesToBigInt } from 'viem'
const data = bytesToBigInt(new Uint8Array([1, 164]))
// 420n
```
