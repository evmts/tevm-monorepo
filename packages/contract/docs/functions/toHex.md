**@tevm/contract** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > toHex

# Function: toHex()

> **toHex**(`value`, `opts`?): `Hex`

Encodes a string, number, bigint, or ByteArray into a hex string

- Docs: https://viem.sh/docs/utilities/toHex.html
- Example: https://viem.sh/docs/utilities/toHex.html#usage

## Parameters

▪ **value**: `string` \| `number` \| `bigint` \| `boolean` \| `Uint8Array`

Value to encode.

▪ **opts?**: `ToHexParameters`

Options.

## Returns

Hex value.

## Example

```ts
import { toHex } from 'viem'
const data = toHex('Hello world')
// '0x48656c6c6f20776f726c6421'
```

## Example

```ts
import { toHex } from 'viem'
const data = toHex(420)
// '0x1a4'
```

## Example

```ts
import { toHex } from 'viem'
const data = toHex('Hello world', { size: 32 })
// '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
```

## Source

node\_modules/.pnpm/viem@2.0.2\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:36

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
