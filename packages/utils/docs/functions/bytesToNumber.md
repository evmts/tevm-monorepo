**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > bytesToNumber

# Function: bytesToNumber()

> **bytesToNumber**(`bytes`, `opts`?): `number`

Decodes a byte array into a number.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestonumber

## Parameters

▪ **bytes**: `Uint8Array`

Byte array to decode.

▪ **opts?**: `BytesToBigIntOpts`

Options.

## Returns

Number value.

## Example

```ts
import { bytesToNumber } from 'viem'
const data = bytesToNumber(new Uint8Array([1, 164]))
// 420
```

## Source

node\_modules/.pnpm/viem@2.9.23\_typescript@5.4.5\_zod@3.22.5/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:96

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
