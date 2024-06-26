[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / bytesToBigint

# Function: bytesToBigint()

> **bytesToBigint**(`bytes`, `opts`?): `bigint`

Decodes a byte array into a bigint.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobigint

## Parameters

• **bytes**: `Uint8Array`

Byte array to decode.

• **opts?**: `BytesToBigIntOpts`

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

## Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:59
