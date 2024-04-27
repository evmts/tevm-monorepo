**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > numberToHex

# Function: numberToHex()

> **numberToHex**(`value_`, `opts`?): [`Hex`](../type-aliases/Hex.md)

Encodes a number or bigint into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#numbertohex

## Parameters

▪ **value\_**: `number` \| `bigint`

▪ **opts?**: `NumberToHexOpts`

Options.

## Returns

Hex value.

## Example

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420)
// '0x1a4'
```

## Example

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420, { size: 32 })
// '0x00000000000000000000000000000000000000000000000000000000000001a4'
```

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.23.4/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:122

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
