**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > bytesToBool

# Function: bytesToBool()

> **bytesToBool**(`bytes_`, `opts`?): `boolean`

Decodes a byte array into a boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobool

## Parameters

▪ **bytes\_**: `Uint8Array`

▪ **opts?**: `BytesToBoolOpts`

Options.

## Returns

Boolean value.

## Example

```ts
import { bytesToBool } from 'viem'
const data = bytesToBool(new Uint8Array([1]))
// true
```

## Source

node\_modules/.pnpm/viem@2.9.23\_typescript@5.4.5\_zod@3.22.5/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:79

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
