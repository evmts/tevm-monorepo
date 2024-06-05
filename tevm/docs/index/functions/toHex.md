[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / toHex

# Function: toHex()

> **toHex**(`value`, `opts`?): [`Hex`](../type-aliases/Hex.md)

Encodes a string, number, bigint, or ByteArray into a hex string

- Docs: https://viem.sh/docs/utilities/toHex
- Example: https://viem.sh/docs/utilities/toHex#usage

## Parameters

• **value**: `string` \| `number` \| `bigint` \| `boolean` \| `Uint8Array`

Value to encode.

• **opts?**: `ToHexParameters`

Options.

## Returns

[`Hex`](../type-aliases/Hex.md)

Hex value.

## Examples

```ts
import { toHex } from 'viem'
const data = toHex('Hello world')
// '0x48656c6c6f20776f726c6421'
```

```ts
import { toHex } from 'viem'
const data = toHex(420)
// '0x1a4'
```

```ts
import { toHex } from 'viem'
const data = toHex('Hello world', { size: 32 })
// '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
```

## Source

node\_modules/.pnpm/viem@2.13.6\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:36
