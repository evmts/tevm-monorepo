**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > bytesToBigint

# Function: bytesToBigint()

> **bytesToBigint**(`bytes`, `opts`?): `bigint`

Decodes a byte array into a bigint.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobigint

## Parameters

▪ **bytes**: `Uint8Array`

Byte array to decode.

▪ **opts?**: `BytesToBigIntOpts`

Options.

## Returns

BigInt value.

## Example

```ts
import { bytesToBigInt } from 'viem'
const data = bytesToBigInt(new Uint8Array([1, 164]))
// 420n
```

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:59

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
