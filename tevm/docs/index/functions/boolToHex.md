**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > boolToHex

# Function: boolToHex()

> **boolToHex**(`value`, `opts`?): [`Hex`](../type-aliases/Hex.md)

Encodes a boolean into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#booltohex

## Parameters

▪ **value**: `boolean`

Value to encode.

▪ **opts?**: `BoolToHexOpts`

Options.

## Returns

Hex value.

## Example

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true)
// '0x1'
```

## Example

```ts
import { boolToHex } from 'viem'
const data = boolToHex(false)
// '0x0'
```

## Example

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true, { size: 32 })
// '0x0000000000000000000000000000000000000000000000000000000000000001'
```

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.22.5/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:66

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
